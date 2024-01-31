#!/bin/bash
fswebcam -r 1920x1080 --png 9 -d /dev/vi
deo0 -S 40 -s Gamma=50% -s Contrast=15%
-s Brightness=70% -s Sharpness=100% --no
-banner ./shots/$1.png
