#!/bin/zsh
# usage: shot.sh file.html "1.5 2.4" [w h] [dark]
# Headless Chrome will not lay out narrower than 500px, so widths < 500 render the deck inside an iframe of that width.
OUTDIR=/private/tmp/claude-501/-Users-roohi-Documents-heredity/6237e3c1-89e5-42e9-b5b3-b4f1dfba1d85/scratchpad/shots; mkdir -p $OUTDIR
W=${3:-1280}; Hh=${4:-760}; DARK=${5:-}
for h in ${=2}; do
  URL="file://$PWD/../${1}#$h"; WIN=$W
  if (( W < 500 )); then
    WRAP=$OUTDIR/.wrap-${1:t:r}-$h-$W-$$.html; WIN=500
    print -r -- "<!doctype html><style>body{margin:0;background:#888}iframe{border:0;width:${W}px;height:${Hh}px;display:block}</style><iframe src=\"$URL\"></iframe>" > $WRAP
    URL="file://$WRAP"
  fi
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars ${DARK:+--force-dark-mode --enable-features=WebContentsForceDark:false} --blink-settings=preferredColorScheme=${DARK:+0}${DARK:-1} \
    --allow-file-access-from-files --window-size=$WIN,$Hh --virtual-time-budget=6000 --screenshot=$OUTDIR/${1:t:r}-$h-$W${DARK:+-dark}.png "$URL" 2>/dev/null
done
ls $OUTDIR | tail -5
