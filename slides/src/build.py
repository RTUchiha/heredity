"""Inline engine.css + engine.js into each deck source (src/*.deck.js) -> slides/<name>.html"""
import pathlib, re

SRC = pathlib.Path(__file__).resolve().parent
OUT = SRC.parent
FONTS = ("https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900"
         "&family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,wght@1,400;1,600&display=swap")
MIME = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "svg": "image/svg+xml", "webp": "image/webp"}
css = (SRC / "engine.css").read_text()
js = (SRC / "engine.js").read_text()

for deck in sorted(SRC.glob("*.deck.js")):
    body = deck.read_text()
    import base64
    body = re.sub(r"@@asset:([\w.\-]+)@@", lambda m: "data:" + MIME[m.group(1).rsplit(".",1)[-1].lower()] + ";base64," + base64.b64encode((SRC / "assets" / m.group(1)).read_bytes()).decode(), body)
    m = re.search(r"docTitle:\s*'([^']+)'", body)
    title = m.group(1) if m else deck.stem
    html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<style>body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}
{css}</style></head>
<body><main class="deck" id="deck"></main>
<script>{js}</script>
<script>{body}</script>
</body></html>
"""
    out = OUT / (deck.name.replace(".deck.js", ".html"))
    out.write_text(html)
    print("built", out.name, len(html) // 1024, "KB")
