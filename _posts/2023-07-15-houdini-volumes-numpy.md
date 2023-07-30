---
layout: post
title:  "Houdini volumes and numpy"
categories: Houdini
tags: Houdini Volumes Python Numpy
author: Aleksandr Kozlov
---

# Using Numpy Array in Houdini

Python scripting with volumes in Houdini may be considered an uncommon practice, but it can offer tremendous benefits in various scenarios. In fact, it can even outperform VEX scripting in terms of speed and efficiency.

## What is Numpy Array?

NumPy (Numerical Python) is a fundamental library in Python used for numerical and scientific computing. One of the core features of NumPy is the "NumPy array," also known as ndarray (short for n-dimensional array). It is a powerful data structure that allows you to work with arrays and matrices of various dimensions efficiently and perform operations on them in an optimized manner.

It is implemented in C and Fortran, which makes it highly efficient for numerical computations. It leverages optimized, low-level memory operations, which result in faster execution compared to regular Python lists. 

Despite the fact that it is a python library - performance is comparable with VEX. Numpy array supporded by lots of python libraries, can be processed with scipy, converted to picture, processed as tensor for neural network operations and much more...

## Convert Houdini volume to Numpy Array

Houdini volume looks like 3-dimentional array, which is common for numpy. But in fact data is stored as sequence of voxel ids and float values that correspond for each id.
![](https://raw.githubusercontent.com/AlekVolok/AlekVolok.github.io/main/_attachments/houdini_numpy/voxels_data_attrib.jpg) 

Houdini Python documentation has already fast performant function that gets all voxels data into tuple for future converting it into numpy array.
[hou.Volume](https://www.sidefx.com/docs/houdini/hom/hou/Volume.html)

Convert Volume into 3d Numpy Array:

```
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

This code converts 3d array to flipbook sheet:

```
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

## Houdini Heighfields

## Powerup with common python operations