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

