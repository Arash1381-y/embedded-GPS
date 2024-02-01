# Camera Bash
Using phone camera to capture frames by Droidcam application.

## Install v4l2loopbackl and ffmpeg
v4l2loopbackl is a a kernel module to create V4L2 loopback devices, this module allows you to create "virtual video devices".
ffmpeg is a collection of tools to process multimedia content such as audio and video.
## Launching v4l2loopbackl
v4l2loopback parameters paramater assignment example:
```shell
sudo modprobe v4l2loopback devices=1 max_buffers=2 exclusive_caps=1 card_label="VirtualCam #0" 
```
## Launching ffmpeg





