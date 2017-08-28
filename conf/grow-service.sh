#! /bin/sh
# /etc/init.d/grow-service.sh

### BEGIN INIT INFO
# Provides:          Growmat automation service
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Startup script for growmat.js
# Description:       Start / stop growmat.js at boot / shutdown.
### END INIT INFO

# Carry out specific functions when asked to by the system
case "$1" in
   start)
    echo "Starting growmat.js"
    cd /home/pi/growmat && npm start
   ;;
   stop)
    echo "Stopping growmat.js"
    cd /home/pi/growmat && npm stop
   ;;
   *)
    echo "Usage: /etc/init.d/grow-service {start|stop}"
    exit 1
   ;;
esac

exit 0