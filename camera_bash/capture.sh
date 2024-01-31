#!/bin/bash
sudo ffmpeg -i http://$1:$2/video/ -f v
4l2 -pix_fmt yuv420p /dev/video0
