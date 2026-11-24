"""Prose scorer for deck text: ASD-STE100 limits + AI-slop markers.

usage: python3 slop_score.py deck.js [deck.js ...] [--detail]
Scores the reader-facing prose of each slide: text, star, caption, and term/Q&A cards.
Lower is better. Score = weighted hits per 100 words. Target: < 3.0 per deck and no slide > 6.
"""
import re, sys, html

W = {  # weight per hit
    'long>20': 2, 'long>25': 4, 'passive': 2, 'slop-word': 3, 'filler': 2, 'em-dash': 2,
    'not-x-but-y': 3, 'colon-reveal': 1, 'rhetorical-q': 3, 'phrasal-verb': 1, 'ing-form': 1,
    'vague-pronoun-start': 1, 'para>6-sent': 2, 'you-will': 1, 'scare-quote': 2, 'hedge': 1, 'stack-of-3+-commas': 1,
    'throat-clearing': 3, 'meta-talk': 2, 'teaser': 3, 'duplicate-sentence': 3, 'empty-sentence': 2,
}
OPENERS = r"^(here,|now,|let'?s|remember|note( that)?|as you can see|as we|in this (chapter|deck|slide)|so,|well,|first of all|in summary|to sum up|basically|okay|imagine)"
META = r"\b(this (slide|deck)|the last slides?|the next slides?|in the figure|the figure (now|shows)|watch (the|one|how)|look at)\b"
TEASER = r"(to make this happen|here is how|here's how|the answer is|this is where|that is where|the secret|the trick|what happens next|guess what)"
TECH = set()  # filled per deck from bold terms

SLOP = r"\b(crucial|vital|essential(ly)?|delve|dive into|journey|unlock|landscape|robust|seamless(ly)?|leverage|utili[sz]e|fascinating|amazing|incredibl[ey]|powerful|remarkabl[ey]|intricate|tapestry|realm|pivotal|key to|plays? a (key |vital |crucial )?role|game[- ]chang\w*|in essence|at its core|it is worth|worth noting|notably|importantly|interestingly|ultimately)\b"
FILLER = r"\b(very|really|just|simply|basically|actually|quite|rather|truly|of course|in fact|indeed|so-called|various|numerous|a (wide )?(range|variety) of)\b"
HEDGE = r"\b(may|might|could|perhaps|somewhat|arguably|seems? to|appears? to)\b"
PHRASAL = r"\b(line[sd]? up|lining up|pack(s|ed)? up|break(s)? down|broke down|go(es)? through|went through|pull(s|ed)? apart|set(s)? up|carr(y|ies|ied) out|find(s)? out|end(s)? up|turn(s|ed)? into|make(s)? up|give(s)? rise|come(s)? from|pick(s|ed)? up|look(s)? like|zip(s|ped)? (up|shut))\b"
ING_OK = set("""during nothing something anything everything thing things ring string strings king morning spring bring sing wing
crossing ceiling building finding findings beginning ending meaning painting""".split())
TECH_ING = r"\b(crossing over|crossing-over|true-breeding|pure-breeding|non-dividing|self-replicating|dna-binding|cyclin-dependent)\b"
PASSIVE = re.compile(r"\b(is|are|was|were|be|been|being|gets|get|got)\s+(\w+ly\s+)?(\w+ed|made|done|seen|shown|known|held|given|taken|built|kept|found|split|set|put|caused|called|named|drawn|written|broken|torn|bound|born|grown|thrown|chosen|spread|sent|left|lost|stuck|struck)\b", re.I)
PASSIVE_OK = re.compile(r"\b(is|are) (called|named)\b", re.I)  # definitions: "X is called Y" still flagged lightly below

def prose_blocks(src):
    out = []  # (slide_no, title, kind, text)
    slides = re.split(r"\n/\* \d+ ─", src)
    for i, s in enumerate(slides[1:], 1):
        t = re.search(r"title:'([^']*)'", s)
        title = t.group(1) if t else '?'
        for kind, pat in (('text', r"text:`(.*?)`"), ('star', r"star:'((?:[^'\\]|\\.)*)'"), ('caption', r"caption:'((?:[^'\\]|\\.)*)'")):
            for m in re.finditer(pat, s, re.S):
                out.append((i, title, kind, m.group(1)))
    return out

def paras(htmltext):
    htmltext = re.sub(r'<span class="chip">[^<]*</span>', '', htmltext)
    htmltext = re.sub(r"<b>([^<]{1,40}?)\.</b>", r"\1:", htmltext)  # bold run-in labels are headings, not sentences
    h = re.sub(r"<(br|/p|/li|/div|/td|/th|/tr|/h3)[^>]*>", "\n", htmltext)
    h = re.sub(r"<[^>]+>", " ", h)
    h = html.unescape(h)
    return [re.sub(r"\s+", " ", p).strip() for p in h.split("\n") if p.strip()]

def sentences(p):
    p = re.sub(r"\b(e\.g|i\.e|cf|vs|approx|Fig|fig|No|St|Dr|E|S|C|J|T|R)\.", lambda m: m.group(0).replace('.', '∙'), p)
    return [x.strip() for x in re.split(r"(?<=[.!?])\s+(?=[A-Z0-9“\"(])", p) if x.strip()]

SEEN = {}
def score_text(t, kind):
    hits = []
    t = re.sub(r'<div class="q">.*?</div>', ' ', t, flags=re.S)  # real study questions are not rhetorical
    t = re.sub(r'<table.*?</table>', ' ', t, flags=re.S) if kind == 'text' else t
    words = 0
    for p in paras(t):
        ss = sentences(p)
        if kind == 'text' and len(ss) > 6: hits.append(('para>6-sent', p[:60]))
        for s in ss:
            w = re.findall(r"[A-Za-z0-9][\w'’\-]*", s)
            n = len(w); words += n
            if kind in ('text',) and not s.endswith('?'):
                if n > 25: hits.append(('long>25', s))
                elif n > 20: hits.append(('long>20', s))
            low = s.lower()
            for m in PASSIVE.finditer(s):
                if not re.match(r"(is|are|was|were) (called|named)", m.group(0), re.I) and m.group(3).lower() not in ('used', 'based', 'related', 'linked', 'joined', 'replicated', 'unreplicated', 'condensed', 'uncondensed', 'shaded', 'affected', 'paired', 'attached', 'located', 'made'):
                    hits.append(('passive', m.group(0)))
            for m in re.finditer(SLOP, low): hits.append(('slop-word', m.group(0)))
            for m in re.finditer(FILLER, low): hits.append(('filler', m.group(0)))
            for m in re.finditer(HEDGE, low): hits.append(('hedge', m.group(0)))
            if kind != 'star':
                for m in re.finditer(PHRASAL, low): hits.append(('phrasal-verb', m.group(0)))
            if '—' in s or ' – ' in s or ' -- ' in s: hits.append(('em-dash', s[:60]))
            if re.search(r"\bnot (just |only |merely )?[\w\s,]{1,30}, but\b", low): hits.append(('not-x-but-y', s[:60]))
            if re.search(r":\s+[A-Z][^.]{0,40}\.$", s) and kind == 'text' and s.count(':') == 1 and len(s.split(':')[0].split()) > 4: hits.append(('colon-reveal', s[:60]))
            if s.endswith('?') and kind == 'text': hits.append(('rhetorical-q', s))
            if re.search(r"\byou will\b|\byou'll\b", low): hits.append(('you-will', s[:60]))
            if re.match(r"(this|it|these|that)\b", low) and kind == 'text': hits.append(('vague-pronoun-start', s[:50]))
            if re.search(r"[“\"][a-z][^”\"]{0,20}[”\"]", s): hits.append(('scare-quote', s[:60]))
            if s.count(',') >= 4 and kind == 'text': hits.append(('stack-of-3+-commas', s[:60]))
            if kind == 'text':
                if re.search(OPENERS, low): hits.append(('throat-clearing', s[:50]))
                if re.search(META, low): hits.append(('meta-talk', s[:60]))
                if re.search(TEASER, low): hits.append(('teaser', s[:60]))
                key = re.sub(r'\W+', ' ', low).strip()
                if n >= 5:
                    if key in SEEN: hits.append(('duplicate-sentence', s[:60]))
                    SEEN[key] = 1
                if n <= 3 and not re.search(r'\d', s) and ':' not in s: hits.append(('empty-sentence', s))
            for m in re.finditer(r"\b[a-z]+ing\b", re.sub(TECH_ING, '', low)):
                if m.group(0) not in ING_OK: hits.append(('ing-form', m.group(0)))
    return hits, words

def main(paths, detail):
    for path in paths:
        SEEN.clear()
        src = open(path).read()
        per = {}
        for i, title, kind, t in prose_blocks(src):
            if kind == 'text' and ('class="qa"' in t or 'class="term"' in t or '<table' in t):
                pass
            hits, n = score_text(t, kind)
            d = per.setdefault(i, {'title': title, 'hits': [], 'words': 0})
            d['hits'] += hits; d['words'] += n
        tw = sum(d['words'] for d in per.values()); tp = sum(W[h[0]] for d in per.values() for h in d['hits'])
        print(f"\n== {path}  words={tw}  score={100*tp/max(tw,1):.2f} per 100 words")
        for i, d in sorted(per.items()):
            pts = sum(W[h[0]] for h in d['hits']); sc = 100 * pts / max(d['words'], 1)
            kinds = {}
            for h in d['hits']: kinds[h[0]] = kinds.get(h[0], 0) + 1
            flag = '  !!' if sc > 6 else ''
            print(f"{i:>2}. {d['title'][:38]:<38} {d['words']:>4}w  {sc:5.1f}{flag}  " + ', '.join(f"{k}×{v}" for k, v in sorted(kinds.items())))
            if detail:
                for k, s in d['hits']: print(f"      - {k}: {s}")

if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    main(a, '--detail' in sys.argv)
