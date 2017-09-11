## DEPENDENCIES

1. [nodejs](https://nodejs.org)
2. [bcm2835](http://www.airspayce.com/mikem/bcm2835/)
3. [ffmpeg](https://www.ffmpeg.org/)

## SETUP

1. Add user to gpio group (in order to run as non root)

sudo adduser pi gpio



## INSTALLATION

1. nodejs
  1. npm install pm2 -g

2. bcm2835 (from: http://www.airspayce.com/mikem/bcm2835/)

download the latest version of the library, say bcm2835-1.xx.tar.gz, then:

tar zxvf bcm2835-1.xx.tar.gz
cd bcm2835-1.xx
./configure
make
sudo make check
sudo make install


3. FFmpeg (from: https://www.jeffreythompson.org/blog/2014/11/13/installing-ffmpeg-for-raspberry-pi/)

INSTALL H264 SUPPORT

cd /usr/src
git clone git://git.videolan.org/x264
cd x264
./configure --host=arm-unknown-linux-gnueabi --enable-static --disable-opencl
make
sudo make install

INSTALL FFMPEG

cd /usr/src
git clone https://github.com/FFmpeg/FFmpeg.git
cd ffmpeg
sudo ./configure --arch=armel --target-os=linux --enable-gpl --enable-libx264 --enable-nonfree
make
sudo make install
