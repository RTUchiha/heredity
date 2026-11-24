#!/bin/zsh
# usage: shot.sh file.html "1.5 2.4" [w h] [dark]
OUTDIR=/private/tmp/claude-501/-Users-roohi-Documents-heredity/6237e3c1-89e5-42e9-b5b3-b4f1dfba1d85/scratchpad/shots; mkdir -p $OUTDIR
W=${3:-1280}; Hh=${4:-760}; DARK=${5:-}
for h in ${=2}; do
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars ${DARK:+--force-dark-mode --enable-features=WebContentsForceDark:false} --blink-settings=preferredColorScheme=${DARK:+0}${DARK:-1} \
    --window-size=$W,$Hh --virtual-time-budget=6000 --screenshot=$OUTDIR/${1:t:r}-$h-$W${DARK:+-dark}.png "file://$PWD/../${1}#$h" 2>/dev/null
done
ls $OUTDIR | tail -5
