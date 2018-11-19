#!/bin/bash

if [ -z "$STREAM_PORT" ]; then
    echo "\$STREAM_PORT is not defined!"
    exit 1
fi

ffmpeg -loglevel error -f v4l2 -r 25 -i /dev/video0 -f mpegts -s 1024x576 -codec:v mpeg1video -b:v 1000k -bf 0 http://localhost:$STREAM_PORT/supersecret
