#!/bin/bash

rm -f /tmp/screenshot-android.png
adb shell screencap -p | perl -pe 's/\x0D\x0A/\x0A/g' > /tmp/screenshot-android.png
open /tmp/screenshot-android.png