---
layout: post
title:  "HDA and JSON"
categories: Houdini
tags: Houdini HDA Unreal JSON
author: Aleksandr Kozlov
---

Transferring data between Houdini and Unreal is well-known bottleneck. Figuring out what parameters needs to be exposed drops production performance. Each time user wants from you more parameters to control, and each time input parameter structure is changing - it needs to be changed in HDA... Things became even worse if there are hunders(thousands) parameters, or parameters needs to be dynamically changed.  

## What is JSON?

JSON (JavaScript Object Notation) is industry standart of storing data. It means, that is beign supported by lots of softwarss

It is implemented in C and Fortran, which makes it highly efficient for numerical computations. It leverages optimized, low-level memory operations, which result in faster execution compared to regular Python lists. 

Despite the fact that it is a python library - performance is comparable with VEX. Numpy array supporded by lots of python libraries, can be processed with scipy, converted to picture, processed as tensor for neural network operations and much more...

## Convert Houdini volume to Numpy Array

Houdini volume looks like 3-dimentional array, which is common for numpy. But in fact data is stored as sequence of voxel ids and float values that correspond for each id.
![](https://raw.githubusercontent.com/AlekVolok/AlekVolok.github.io/main/_attachments/houdini_numpy/voxels_data_attrib.jpg) 

Houdini Python documentation has already fast performant function that gets all voxels data into tuple for future converting it into numpy array.
[hou.Volume](https://www.sidefx.com/docs/houdini/hom/hou/Volume.html)

Convert Volume into 3d Numpy Array:

```python
import numpy as np
node = hou.pwd()
geo = node.geometry()

"""
Each Prim resides inside a Geometry object and stores some 
sort of 3D geometric primitive, 
like a polygon, a NURBS curve, or a volume.
In this case primitive object represents volume.
"""

# Get first volume
volume = geo.prims()[0]

# Get voxel values
voxel_vals = volume.allVoxels()
# Make 1-dimentional numpy array from voxels values
np_volume = np.array(voxel_vals)

# Convert 1D array to 3D
vol_res = volume.resolution()

np_volume3d = np_volume.reshape(vol_res) 
```
Note that this np array data cannot be stored in geometry. After manipulation on the arraay it should be converted back to attributes or saved somewhere. 

## Convert Numpy Array to picture

This code converts 3d array to flipbook sheet:

```python
# Calc 2d image size
import math
res_2d = int(math.sqrt(vol_res[0] * vol_res[1] * vol_res[2]))

# Create 2d image container
vol_2d = np.zeros((res_2d, res_2d))

# Fill container with sliced volume data
for i in range(int(res_2d/vol_res[0])):
    for j in range(int(res_2d/vol_res[1])):
        vol_2d[i*vol_res[0]:(i+1)*vol_res[0], j*vol_res[0]:(j+1)*vol_res[0]] = np_volume3d[:,:,(j+i)]

# Preview 2d Image
from PIL import Image
np_image = Image.fromarray((vol_2d*255).astype(np.uint8))
np_image.show()
```
![Alt text](https://raw.githubusercontent.com/AlekVolok/AlekVolok.github.io/main/_attachments/houdini_numpy/slices_volume_preview.jpg)

```image.show()``` method is for image preview. For saving as disk image: ```np_image.save("C:/Temp.../image.jpg")```

## Convert Numpy Array Houdini volume

This code generates numpy array random values and store values to volume:

```python
import numpy as np
node = hou.pwd()
geo = node.geometry()

# Get first volume
volume = geo.prims()[0]

# Get volume resolution
vol_res = volume.resolution()

# Create 3d volume with norm random
np_volume3d = np.random.normal(0, 1, size=(100, 100, 100))

# Make it 1-dimensional. Houdini volumes use float32 and numpy float64. So data needs to be converted.
np_volume = np_volume3d.flatten().astype(np.float32)

# Convert the NumPy array to a Python list
voxels = np_volume.tolist()

# Apply voxels data to geometry
volume.setAllVoxels(voxels)
```

![ArrayToVolume](https://raw.githubusercontent.com/AlekVolok/AlekVolok.github.io/main/_attachments/houdini_numpy/array_to_volume.jpg)

Looks nice, but not very practical. Since Numpy arrays is just a way of how we can represent a data - we can generate/feed any data we want!

## Houdini Heightfields

Import multiple pictures tiles and combine them in one piece. In Unreal Engine, for example, there is a way to export height data into for each landscape chunk into .png data. With python's numpy it is possible to grab this data (and event multiple landscape layers) and store it into one heightfield in one go.

Exported landscape data from unreal usually looks like that:

![DataExample](https://raw.githubusercontent.com/AlekVolok/AlekVolok.github.io/main/_attachments/houdini_numpy/exported_data.jpg)

This code looks to the giving folderpath and combines image tiles into one heightfield object according to unreal's tile naming convention:

```python
from pathlib import Path
import imageio
import numpy as np

# Define variables
node = hou.pwd()
geo = node.geometry()
ls_data_dir = hou.parm("data_dir").eval()
tiles_x = hou.parm("ls_tiles1").eval()
tiles_y = hou.parm("ls_tiles2").eval()
ls_res_x = hou.parm("ls_res1").eval()
ls_res_y = hou.parm("ls_res2").eval()
chunk_res_x = int((ls_res_x - 1) / tiles_x)
chunk_res_y = int((ls_res_y - 1) / tiles_y)

# Height is always the first prim 
heightfield_height = geo.prims()[0]
heightfield_resolution = heightfield_height.resolution()

# Create np array canvas to store image data
canvas2d = np.zeros((heightfield_resolution[0], heightfield_resolution[1]))

# Fill canvas2d with image data
for file in Path(ls_data_dir).iterdir():
    if not file.is_file():
        continue
    for x in range(tiles_x):
        for y in range(tiles_y):
            if f"x{x}_y{y}" in file.name:
                chunk_img = imageio.imread(file)
                if chunk_img is not None:
                    canvas2d[y*chunk_res_y:(y+1)*chunk_res_y, 
                             x*chunk_res_x:(x+1)*chunk_res_x] = np.array(chunk_img)

# Map imported data to world coords (based on Unreal Engine documentation)
canvas2d = canvas2d/128 - 256

# Store data to heightfield
heightfield_height.setAllVoxels(tuple(np.transpose(canvas2d).flatten()))
```
![DataExample](https://raw.githubusercontent.com/AlekVolok/AlekVolok.github.io/main/_attachments/houdini_numpy/landscape_to_houdini.jpg)

Despite being written in Python, it exhibits impressive speed, even when compared to VEX! 

The transfer of landscape data from Unreal to Houdini traditionally involves a time-consuming operation, often taking several seconds, and requiring repetition whenever changes are made to the landscape. However, employing this method allows for the selective export of only the essential chunks, significantly streamlining production time.

[Numpy Houdini Examples](https://github.com/AlekVolok/HoudiniExamples/blob/master/numpy_array.hiplc)