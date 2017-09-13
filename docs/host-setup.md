## DEPENDENCIES

1. [nodejs](https://nodejs.org)
2. [bcm2835](http://www.airspayce.com/mikem/bcm2835/)
3. [ffmpeg](https://www.ffmpeg.org/)

## SETUP

1. Add user to gpio group (in order to run as non root)
```
sudo adduser pi gpio
```
Check that /dev/gpiomem has the correct permissions.

```
ls -l /dev/gpiomem
crw-rw---- 1 root gpio 244, 0 Dec 28 22:51 /dev/gpiomem
```

2. Allow node to occupy 80 & 443 ports, in order to avoid startup as root (from: https://superuser.com/questions/710253/allow-non-root-process-to-bind-to-port-80-and-443/892391/)

Option 1: Use [CAP_NET_BIND_SERVICE](http://man7.org/linux/man-pages/man7/capabilities.7.html) to grant low-numbered port access to a process:

With this you can grant permanent access to a specific binary to bind to low-numbered ports via the  setcap command:
```
sudo setcap CAP_NET_BIND_SERVICE=+eip `which node`
```
For more details on the e/i/p part, see [cap_from_text](https://linux.die.net/man/3/cap_from_text).

After doing this, /path/to/binary will be able to bind to low-numbered ports. Note that you must use setcap on the binary itself rather than a symlink.

Option 2: Use authbind to grant one-time access, with finer user/group/port control:

The [authbind](https://en.wikipedia.org/wiki/Authbind) ([man page](http://manpages.ubuntu.com/manpages/zesty/en/man1/authbind.1.html)) tool exists precisely for this.

Install authbind using your favorite package manager.
Configure it to grant access to the relevant ports, e.g. to allow 80 and 443 from all users and groups:
```
sudo touch /etc/authbind/byport/80
sudo touch /etc/authbind/byport/443
sudo chmod 777 /etc/authbind/byport/80
sudo chmod 777 /etc/authbind/byport/443
```
Now execute your command via authbind (optionally specifying --deep or other arguments, see the man page):

authbind --deep /path/to/binary command line args
E.g.
authbind --deep java -jar SomeServer.jar

## INSTALLATION

1. nodejs 8.x (from: https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```
2. pm2
```
npm install pm2 -g
```
3. bcm2835 (from: http://www.airspayce.com/mikem/bcm2835/)

download the latest version of the library, say bcm2835-1.xx.tar.gz, then:
```
tar zxvf bcm2835-1.xx.tar.gz
cd bcm2835-1.xx
./configure
make
sudo make check
sudo make install
```

4. FFmpeg (from: https://www.jeffreythompson.org/blog/2014/11/13/installing-ffmpeg-for-raspberry-pi/)

##### INSTALL H264 SUPPORT

```
cd /usr/src
git clone git://git.videolan.org/x264
cd x264
./configure --host=arm-unknown-linux-gnueabi --enable-static --disable-opencl
make
sudo make install
```
##### INSTALL FFMPEG

```
cd /usr/src
git clone https://github.com/FFmpeg/FFmpeg.git
cd ffmpeg
sudo ./configure --arch=armel --target-os=linux --enable-gpl --enable-libx264 --enable-nonfree
make
sudo make install
```