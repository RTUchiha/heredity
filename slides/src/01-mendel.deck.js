/* Chapter 1 · Mendel’s First Law (all of chapter 1 except the meiosis section, which has its own deck) · source: Singh, Introduction to Genetics, CC BY-NC-SA 4.0 */
(function(){
const H0=window.HL;
const ST=()=>document.getElementById('stage');
/* ---- assets (each token appears once, so the build embeds each image once) ---- */
const IMG={portrait:'@@asset:c1-mendel-portrait.jpg@@',paper:'@@asset:c1-mendel-paper.jpg@@',plant:'@@asset:c1-pea-plant.jpg@@',
  traits:'@@asset:c1-seven-traits.jpg@@',round:'@@asset:c1-peas-round.jpg@@',wrinkled:'@@asset:c1-peas-wrinkled.jpg@@',
  purple:'@@asset:pea-purple.jpg@@',white:'@@asset:pea-white.jpg@@'};
/* cells of the seven-traits photo (884 × 490 px): [x, y, w, h] of the photo part, without the printed label */
const TC={round:[4,101,122,145],wrinkled:[4,296,122,145],yellow:[130,101,121,145],green:[130,296,121,145],
  fwhite:[255,101,122,145],fpurple:[255,296,122,145],tall:[762,101,118,150],short:[762,296,118,150]};
/* ---- deck-local helpers ---- */
function drawA(a,o){H0.D(a.firstChild,1,Object.assign({d:600},o));H0.O(a.lastChild,1,Object.assign({d:200},o,{at:((o&&o.at)||0)+450}));}
function mkA(p,x1,y1,x2,y2,o){const a=H0.arrow(p,x1,y1,x2,y2,o);H0.O(a.lastChild,0,{d:0});return a;}
function pop(e,o){H0.T(e,{s:1},Object.assign({d:700},o));H0.O(e,1,Object.assign({d:300},o));}
function hide(e){H0.T(e,{s:.001},{d:0});H0.O(e,0,{d:0});}
function at(p,x,y,s){const G=H0.g(p);H0.T(G,{x,y,s:s==null?1:s},{d:0});return G;}
function fly(e,x,y,o){o=o||{};H0.O(e,1,{d:200,at:o.at});H0.T(e,{x,y},Object.assign({d:950},o));}
// tween fill/stroke to any CSS colour (allows color-mix of tokens)
function paint(e,prop,css,o){if(Array.isArray(e)){e.forEach(x=>paint(x,prop,css,o));return e}o=o||{};
  e.style.transitionDuration=(o.d!=null?o.d:600)+'ms';e.style.transitionDelay=(o.at||0)+'ms';e.style[prop]=css;return e;}
// pigment colours, mixed from theme tokens; white petals are a real white
const PURPLE='color-mix(in srgb, var(--dad) 50%, var(--bad))';
const PALE='color-mix(in srgb, color-mix(in srgb, var(--dad) 50%, var(--bad)) 38%, #ffffff)';
const WHITEF='#fbfaf5';
const PEA='color-mix(in srgb, var(--good) 55%, var(--hi))';
// text with ^x / _x superscripts and subscripts
function rt(p,x,y,s,cls,a){const t=H0.E('text',Object.assign({x,y,cls:cls||'lb'},a||{}),p);
  s.split(/(\^\{[^}]*\}|\^.|_\{[^}]*\}|_.)/).forEach(part=>{if(!part)return;
    if(part[0]==='^'||part[0]==='_'){const v=part[1]==='{'?part.slice(2,-1):part.slice(1);
      H0.E('tspan',{'baseline-shift':part[0]==='^'?'super':'sub',st:'font-size:.68em',text:v},t);}
    else H0.E('tspan',{text:part},t);});return t;}
// allele chip: border = parent colour; ok:true = working copy (green), ok:false = broken copy (dashed)
function chip(p,x,y,L,o){o=o||{};const G=at(p,x,y);const w=o.w||26,h=o.h||w;
  const fill=o.ok===true?'var(--good)':(o.fill||'var(--card)');
  G.r=H0.E('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:Math.min(6,w/4),st:`fill:${fill};stroke:${o.par?H0.C(o.par):'var(--ink)'};stroke-width:${o.sw||2.4}${o.ok===false?';stroke-dasharray:4 3':''}`},G);
  G.t=rt(G,0,h*.24,L,'mt',{'text-anchor':'middle',st:`font-size:${o.fs||Math.round(h*.66)}px;fill:${o.ok===true?'var(--paper)':'var(--ink)'}`});return G;}
// cell outline (parent colour)
function cellC(p,x,y,r,par,o){o=o||{};const G=at(p,x,y);H0.E('circle',{r,cls:'cellfill',st:`stroke:${par?H0.C(par):'var(--ink)'};stroke-width:${o.w||2.6}`},G);return G;}
// five-petal flower glyph
function flower(p,x,y,r,col){const G=at(p,x,y);G.pet=[];for(let i=0;i<5;i++){
    const e=H0.E('ellipse',{cx:0,cy:-r*.52,rx:r*.36,ry:r*.52,st:`fill:${col};stroke:var(--ink);stroke-width:1.5`},G);e.setAttribute('transform',`rotate(${i*72})`);G.pet.push(e);}
  H0.E('circle',{r:r*.2,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.3'},G);return G;}
// pea seed: round or wrinkled
function wrinkD(r){let d='';const n=72;for(let i=0;i<=n;i++){const a=i/n*2*Math.PI;
  const q=r*(1+.075*Math.sin(7*a)+.05*Math.sin(12*a+1.3)+.03*Math.sin(19*a+.4));d+=(i?'L':'M')+(q*Math.cos(a)).toFixed(1)+','+(q*Math.sin(a)).toFixed(1)}return d+'Z';}
function seed(p,x,y,r,o){o=o||{};const G=at(p,x,y);const col=o.col||PEA;
  G.rd=H0.g(G);H0.E('circle',{r,st:`fill:${col};stroke:var(--ink);stroke-width:1.6`},G.rd);
  H0.E('ellipse',{cx:-r*.35,cy:-r*.38,rx:r*.24,ry:r*.14,st:'fill:#ffffff;opacity:.55'},G.rd);
  G.wr=H0.g(G);H0.E('path',{d:wrinkD(r*.9),st:`fill:${col};stroke:var(--ink);stroke-width:1.6;stroke-linejoin:round`},G.wr);
  [[-.45,-.2,.1,-.45],[-.1,.35,.45,.05],[-.5,.3,-.15,.55]].forEach(([a,b,c,d])=>H0.E('path',{d:`M${a*r},${b*r} Q${(a+c)/2*r+3},${(b+d)/2*r-4} ${c*r},${d*r}`,st:'fill:none;stroke:var(--ink);stroke-width:1.2;opacity:.6'},G.wr));
  H0.O(o.wr?G.rd:G.wr,0,{d:0});return G;}
// rounded photo
let CLIPN=0;
function photo(p,href,x,y,w,h,o){o=o||{};const id='c1clip'+(++CLIPN);const G=H0.g(p);
  const cp=H0.E('clipPath',{id},G);H0.E('rect',{x,y,width:w,height:h,rx:o.r!=null?o.r:10},cp);
  H0.E('image',{href,x,y,width:w,height:h,preserveAspectRatio:o.fit||'xMidYMid slice','clip-path':`url(#${id})`},G);
  H0.E('rect',{x,y,width:w,height:h,rx:o.r!=null?o.r:10,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},G);return G;}
// one cell of the seven-traits photo
function trait(p,key,x,y,w,h){const [cx,cy,cw,ch]=TC[key];const G=H0.g(p);
  const sv=H0.E('svg',{x,y,width:w,height:h,viewBox:`${cx} ${cy} ${cw} ${ch}`,preserveAspectRatio:'xMidYMid slice'},G);
  H0.E('image',{href:IMG.traits,x:0,y:0,width:884,height:490},sv);
  H0.E('rect',{x,y,width:w,height:h,rx:3,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},G);return G;}
function hiChip(c,o){paint(c.r,'fill','var(--hi)',o);c.t.style.fill='#16181d';}
function cap(p,x,y,t,anchor,st){return H0.txt(p,x,y,t,'cap',{'text-anchor':anchor||'middle',st:st||''});}
function lbs(p,x,y,t,anchor,st){return H0.txt(p,x,y,t,'lbs',{'text-anchor':anchor||'middle',st:st||''});}
function lb(p,x,y,t,anchor,st){return H0.txt(p,x,y,t,'lb',{'text-anchor':anchor||'middle',st:st||''});}
const MATH='font-family:var(--f-math);font-style:italic;font-weight:600';
// label that mixes plain words and an italic serif genotype: parts = [['text',0],['Aa',1],...]
function gl(p,x,y,parts,anchor,st){const t=H0.E('text',{x,y,cls:'lb','text-anchor':anchor||'middle',st:st||''},p);
  parts.forEach(([v,m])=>H0.E('tspan',{text:v,st:m?MATH+';font-size:1.12em':''},t));return t;}
// paint drop (blending slide)
const DROP='M0,-24 C10,-10 17,-1 17,7 A17,17 0 0 1 -17,7 C-17,-1 -10,-10 0,-24 Z';
// enzyme glyph (open circle sector)
function enzyme(p,x,y,o){o=o||{};const r=o.r||13;const G=at(p,x,y);const a=30*Math.PI/180;
  G.body=H0.E('path',{d:`M0,0 L${r*Math.cos(a)},${-r*Math.sin(a)} A${r},${r} 0 1 0 ${r*Math.cos(a)},${r*Math.sin(a)} Z`,
    st:`fill:${o.broken?'var(--card)':'var(--good)'};stroke:${o.broken?'var(--bad)':'var(--ink)'};stroke-width:1.6;stroke-linejoin:round${o.broken?';stroke-dasharray:3 2':''}`},G);return G;}
function cross(p,x,y,r){const G=at(p,x,y);H0.E('path',{d:`M${-r},${-r} L${r},${r} M${r},${-r} L${-r},${r}`,st:'stroke:var(--bad);stroke-width:3.5;stroke-linecap:round'},G);return G;}
function hexD(r){let d='';for(let i=0;i<6;i++){const a=i*Math.PI/3;d+=(i?'L':'M')+(r*Math.cos(a)).toFixed(1)+','+(r*Math.sin(a)).toFixed(1)}return d+'Z';}
// gene strip: a DNA bar with a label
function gene(p,x,y,w,label,o){o=o||{};const G=H0.g(p);
  H0.E('rect',{x,y:y-10,width:w,height:20,rx:4,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.6'},G);
  for(let i=x+8;i<x+w-4;i+=9)H0.E('line',{x1:i,y1:y-10,x2:i,y2:y+10,st:'stroke:var(--faint);stroke-width:1.2'},G);
  if(label)rt(G,x,y-17,label,'lb',{st:'font-size:13px'});return G;}

deck({
docTitle:'Mendel’s First Law · Heredity Ch.1',
title:'Mendel’s First Law',
chapter:1,
eyebrow:'Heredity · Chapter 1 · Mendel’s First Law',
slides:[

/* 1 ─────────────────────────────── */
{sec:'1.1',title:'Mendel’s First Law',caption:'R and r = two versions (alleles) of the seed-shape gene · blue = copy from the father plant, orange = copy from the mother plant',
text:`<p data-step="0">A <b>gene</b> is a unit of heredity: a set of instructions that parents pass to their offspring. A pea plant has two copies of each gene. The plant got one copy from its father plant and one from its mother plant.</p>
<p data-step="1">The plant makes sex cells, or <b>gametes</b>. Its pollen carries the sperm cells, and its egg cells stay inside the flower. Each gamete gets only one of the two copies. Half the gametes get one copy and half get the other.</p>
<p data-step="2">A sperm cell and an egg cell join and make a seed. The seed gets one copy from each parent, so it has two copies again.</p>
<p data-step="3">Suppose that both parents have one round copy (<i>R</i>) and one wrinkled copy (<i>r</i>). One <i>R</i> copy is enough for a round seed, so only an <i>rr</i> seed is wrinkled. On average, 3 seeds in 4 are round and 1 in 4 is wrinkled. Gregor Mendel counted 5474 round and 1850 wrinkled seeds.</p>
<p data-step="4"><b>Mendel’s First Law</b> states the rule: the two copies of a gene separate into different gametes, in equal numbers.</p>`,
star:'Two copies in each plant. One copy in each gamete.',starStep:4,
scene(H){const s=ST();
  cap(s,130,22,'Father plant','middle','fill:var(--dad)');cap(s,510,22,'Mother plant','middle','fill:var(--mom)');
  cellC(s,130,76,42,'dad');cellC(s,510,76,42,'mom');
  chip(s,116,76,'R',{par:'dad'});chip(s,144,76,'r',{par:'dad'});chip(s,496,76,'R',{par:'mom'});chip(s,524,76,'r',{par:'mom'});
  const GP=[['R','dad',80,116],['r','dad',180,144],['R','mom',460,496],['r','mom',560,524]];const gy=186;
  const ar=GP.map(([,,x,sx])=>mkA(s,sx,124,x+(sx<x?-4:4)*0,gy-24,{w:1.8,h:7}));
  const gc=GP.map(([,,x])=>{const c=cellC(s,x,gy,19,null,{w:2});hide(c);return c});
  const gch=GP.map(([L,par,,sx])=>{const c=chip(s,sx,76,L,{par,w:22});H.O(c,0,{d:0});return c});
  const half=GP.map(([,,x])=>{const t=lbs(s,x,gy+36,'1/2','middle','font-weight:700;fill:var(--ink)');H.O(t,0,{d:0});return t});
  const one=lb(s,320,gy+5,'each gamete: one copy');H.O(one,0,{d:0});
  const xs=[200,280,360,440],sy=290,cy=334;
  const combos=[[0,2],[0,3],[1,2],[1,3]];
  const kids=combos.map(([a,b],i)=>{const sd=seed(s,xs[i],sy,22,{wr:i===3});hide(sd);
    const c1=chip(s,GP[a][2],gy,GP[a][0],{par:'dad',w:22}),c2=chip(s,GP[b][2],gy,GP[b][0],{par:'mom',w:22});H.O([c1,c2],0,{d:0});
    const ph=lbs(s,xs[i],cy+32,i===3?'wrinkled':'round','middle',i===3?'font-weight:700;fill:var(--ink)':'');H.O(ph,0,{d:0});return {sd,c1,c2,ph,x:xs[i]}});
  const tally=H.E('text',{x:320,y:404,'text-anchor':'middle',cls:'lb',st:'font-size:15px'},s);
  H.E('tspan',{text:'Mendel’s count: '},tally);const n1=H.E('tspan',{text:'0'},tally);H.E('tspan',{text:' round : '},tally);
  const n2=H.E('tspan',{text:'0'},tally);H.E('tspan',{text:' wrinkled = 2.96 : 1'},tally);H.O(tally,0,{d:0});
  return [
    ()=>{},
    ()=>{ar.forEach(a=>drawA(a));gc.forEach((c,i)=>pop(c,{at:300+i*80}));gch.forEach((c,i)=>fly(c,GP[i][2],gy,{at:500+i*80}));H.O(half,1,{at:1300})},
    ()=>{kids.forEach((k,i)=>{fly(k.c1,k.x-12,cy,{at:i*220});fly(k.c2,k.x+12,cy,{at:i*220});pop(k.sd,{at:900+i*220});H.O(k.ph,1,{at:1100+i*220})})},
    ()=>{H.O(tally,1);H.count(n1,0,5474,{d:1400,fmt:v=>String(Math.round(v))});H.count(n2,0,1850,{d:1400,fmt:v=>String(Math.round(v))})},
    ()=>{H.O(one,1);gch.forEach(c=>{H.T(c,{s:1.35},{d:350});H.after(450,()=>H.T(c,{s:1},{d:350}))})},
  ];}},

/* 2 ─────────────────────────────── */
{sec:'1.1',title:'Gregor Mendel',caption:'Portrait: Hugo Iltis / Wellcome Collection, CC BY 4.0 · Mendel’s paper (1866): public domain · Wikimedia Commons',
text:`<p data-step="0"><b>Gregor Mendel</b> (1822–1884) was a monk of the Augustinian order. He lived at St Thomas’s Abbey in Brno, in Moravia, now part of the Czech Republic.</p>
<p data-step="1">Mendel studied <b>heredity</b>: how parents pass traits to their offspring. For about eight years, from 1856 to 1863, he crossed garden pea plants. He chose pairs of parent plants and studied their offspring.</p>
<p data-step="2">Mendel was one of the first biologists to count offspring and calculate ratios. He started with well-known pea varieties, repeated each cross many times and kept careful records.</p>
<p data-step="3">He presented his results in Brno in 1865. He published them in 1866 as <i>Experiments on Plant Hybridization</i>. Few scientists understood the work during his life.</p>
<p data-step="4">In 1900, three botanists found the same ratios independently: Hugo de Vries, Carl Correns and Erich von Tschermak. They also found Mendel’s paper. Biologists call this event the rediscovery of Mendel’s work.</p>`,
star:'Mendel counted offspring. He found ratios such as 3 : 1.',starStep:2,
scene(H){const s=ST();
  const P=photo(s,IMG.portrait,14,10,188,238,{r:12});H.O(P,0,{d:0});
  const nm=H.g(s);lb(nm,320,58,'Gregor Mendel','middle','font:900 25px var(--f-display)');lbs(nm,320,82,'1822–1884');lbs(nm,320,100,'St Thomas’s Abbey, Brno');H.O(nm,0,{d:0});
  const meth=H.g(s);[['true-breeding varieties','✓'],['each cross repeated','↻'],['every offspring counted','#']].forEach(([t,g],i)=>{const y=140+i*32;
    H.E('rect',{x:214,y:y-12,width:22,height:22,rx:5,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.4'},meth);H.txt(meth,225,y+4,g,'lb',{'text-anchor':'middle',st:'fill:#16181d;font-size:13px'});
    H.txt(meth,244,y+4,t,'lb',{st:'font-size:13px'})});H.O(meth,0,{d:0});
  const PP=photo(s,IMG.paper,438,10,188,190,{r:12});H.O(PP,0,{d:0});H.T(PP,{x:40},{d:0});
  const X=y=>30+(y-1820)*580/85,TY=322;
  const TL=H.g(s);H.E('line',{x1:30,y1:TY,x2:610,y2:TY,st:'stroke:var(--ink);stroke-width:2'},TL);
  [1820,1840,1860,1880].forEach(y=>{H.E('line',{x1:X(y),y1:TY-4,x2:X(y),y2:TY+4,st:'stroke:var(--ink);stroke-width:1.5'},TL);lbs(TL,X(y),TY+20,String(y))});H.O(TL,0,{d:0});
  const mark=(y,t,up,anchor)=>{const G=H.g(s);H.E('circle',{cx:X(y),cy:TY,r:6,st:'fill:var(--ink);stroke:var(--paper);stroke-width:2'},G);
    H.E('line',{x1:X(y),y1:TY+(up?-8:8),x2:X(y),y2:TY+(up?-26:40),st:'stroke:var(--ink);stroke-width:1.2'},G);
    lb(G,X(y),up?TY-32:TY+56,t,anchor||'middle','font-size:13px');H.O(G,0,{d:0});return G};
  const m22=mark(1822,'1822 born',true,'start'),m84=mark(1884,'1884 dies',true);
  const bar=H.g(s);const br=H.E('rect',{x:X(1856),y:TY-7,width:X(1863)-X(1856),height:14,rx:4,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},bar);
  lb(bar,(X(1856)+X(1863))/2,TY-32,'1856–1863 pea crosses','middle','font-size:13px');H.O(bar,0,{d:0});
  const m65=mark(1865.5,'1865 talk · 1866 paper',false);
  const m00=mark(1900,'1900 rediscovery',false,'end');const nms=lbs(s,X(1900)+4,TY+74,'de Vries · Correns · von Tschermak','end');H.O(nms,0,{d:0});
  return [
    ()=>{H.O(P,1,{d:700});H.O(nm,1,{at:300});H.O(TL,1,{at:400});H.O([m22,m84],1,{at:700})},
    ()=>{H.O(bar,1);H.T(br,{sx:1},{d:0})},
    ()=>{H.O(meth,1)},
    ()=>{H.O(PP,1,{d:700});H.T(PP,{x:0},{d:900});H.O(m65,1,{at:500})},
    ()=>{H.O(m00,1);H.O(nms,1,{at:300})},
  ];}},

/* 3 ─────────────────────────────── */
{sec:'1.1',title:'Why the Garden Pea',caption:'Garden pea, Pisum sativum: Rasbak, CC BY-SA 3.0, via Wikimedia Commons · flower drawing is schematic',
text:`<p data-step="0">Mendel used the garden pea, <i>Pisum sativum</i>. The pea was a good choice for four reasons.</p>
<p data-step="1"><b>True-breeding varieties.</b> Seed sellers had pea <b>varieties</b>, lines of plants with the same form of a trait in every generation. Such a line is <b>true-breeding</b>.</p>
<p data-step="2"><b>Two clear forms.</b> A <b>trait</b> is a feature of an organism, such as flower colour. Each trait that Mendel chose had two clear forms, with no forms in between. For example, a flower is purple or white.</p>
<p data-step="3"><b>Controlled pollination.</b> <b>Pollen</b> carries the sperm cells of a plant. The petals of a pea flower close around its pollen and its <b>stigma</b>, the part that receives pollen. So pollen from other flowers usually cannot enter. A pea flower usually fertilizes itself with its own pollen: <b>self-pollination</b>.</p>
<p data-step="4"><b>Fast and small.</b> Pea plants grow quickly and need little space. So Mendel grew large numbers of plants each year.</p>`,
star:'Pea = true-breeding, two clear forms, closed flower, fast growth.',starStep:4,
scene(H){const s=ST();photo(s,IMG.plant,8,8,228,304,{r:12});
  const X0=258;const row=(y,t)=>{const G=H.g(s);cap(G,X0,y,t,'start','fill:var(--ink)');H.O(G,0,{d:0});return G};
  const R1=row(28,'1 · True-breeding');[300,380,460].forEach((x,i)=>{flower(R1,x,66,17,PURPLE);if(i)mkA(R1,x-60,66,x-24,66,{w:1.6,h:6}).lastChild.style.opacity=1});
  R1.querySelectorAll('.draw').forEach(e=>e.style.strokeDashoffset=0);lbs(R1,500,70,'every generation','start');
  const R2=row(118,'2 · Two clear forms');flower(R2,300,154,17,PURPLE);lb(R2,338,159,'or');flower(R2,376,154,17,WHITEF);lbs(R2,410,159,'nothing in between','start');
  const R3=row(204,'3 · Closed flower, self-pollination');
  H.E('path',{d:'M318,286 C300,216 372,206 412,224 C452,206 520,222 502,286 Z',st:`fill:${PALE};stroke:var(--ink);stroke-width:1.5`},R3);
  H.E('path',{d:'M300,288 C330,250 470,240 528,272 C512,302 458,314 400,312 C352,312 316,304 300,288 Z',cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},R3);
  H.E('path',{d:'M330,290 C380,276 430,268 470,272',st:'fill:none;stroke:var(--good);stroke-width:3;stroke-linecap:round'},R3);
  H.E('circle',{cx:474,cy:272,r:5.5,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.2'},R3);
  const anth=[[420,286],[436,290],[452,286],[444,298],[428,298]];anth.forEach(([x,y])=>H.E('ellipse',{cx:x,cy:y,rx:6,ry:4,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.1'},R3));
  const pol=anth.map(([x,y])=>{const d=H.E('circle',{r:2.6,st:'fill:var(--hi);stroke:var(--ink);stroke-width:.6'},R3);H.T(d,{x,y},{d:0});H.O(d,0,{d:0});return d});
  const out=H.E('circle',{r:3.5,st:'fill:var(--muted);stroke:var(--ink);stroke-width:.6'},R3);H.T(out,{x:612,y:236},{d:0});
  H.E('path',{d:'M508,298 L530,322',st:'stroke:var(--ink);stroke-width:1.1'},R3);lbs(R3,532,334,'closed petals','start');
  H.E('path',{d:'M480,268 L536,226',st:'stroke:var(--ink);stroke-width:1.1'},R3);lbs(R3,540,224,'stigma','start');
  H.E('path',{d:'M436,302 L456,330',st:'stroke:var(--ink);stroke-width:1.1'},R3);lbs(R3,460,334,'pollen','start');
  const R4=row(352,'4 · Fast and small');seed(R4,298,386,9,{});mkA(R4,314,386,346,386,{w:1.6,h:6});
  const sp=(x,h)=>{H.E('path',{d:`M${x},398 L${x},${398-h}`,st:'stroke:var(--good);stroke-width:3;stroke-linecap:round'},R4);
    H.E('ellipse',{cx:x-7,cy:398-h*.55,rx:7,ry:4,st:'fill:var(--good)'},R4);H.E('ellipse',{cx:x+7,cy:398-h*.75,rx:7,ry:4,st:'fill:var(--good)'},R4)};
  sp(368,24);mkA(R4,386,386,418,386,{w:1.6,h:6});sp(440,40);H.E('path',{d:'M447,372 q10,4 8,16',st:'fill:none;stroke:var(--good);stroke-width:5;stroke-linecap:round'},R4);
  lbs(R4,474,390,'seed to seed in one season','start');
  R4.querySelectorAll('.draw').forEach(e=>e.style.strokeDashoffset=0);R4.querySelectorAll('path').forEach(e=>{if(e.style.opacity==='0')e.style.opacity=1});
  return [
    ()=>{},
    ()=>{H.O(R1,1)},
    ()=>{H.O(R2,1)},
    ()=>{H.O(R3,1);pol.forEach((d,i)=>{H.O(d,1,{d:200,at:400+i*120});H.T(d,{x:474+((i%3)-1)*3,y:272+(i%2?3:-3)},{d:1000,at:600+i*120})});
      H.T(out,{x:532,y:258},{d:900,at:300});H.after(1300,()=>{H.T(out,{x:600,y:220},{d:800});H.O(out,0,{d:600,at:300})})},
    ()=>{H.O(R4,1)},
  ];}},

/* 4 ─────────────────────────────── */
{sec:'1.1',title:'Crossing Two Plants by Hand',caption:'Flowers seen from the front, schematic · blue = father plant (gives pollen), orange = mother plant (gives eggs)',
text:`<p data-step="0">To <b>cross</b> two plants, a breeder puts pollen from one plant on a flower of another plant. Mendel chose which pollen reached each flower. The sign × reads as <i>crossed with</i>.</p>
<p data-step="1">First, he opened a young flower on the mother plant. He removed its <b>anthers</b>, the parts that make pollen. So the flower could not fertilize itself.</p>
<p data-step="2">Next, he took pollen from the father plant with a small brush. He put the pollen on the stigma of the mother flower.</p>
<p data-step="3">The sperm cells from the pollen fertilize the egg cells. A pod with seeds grows from the flower. Each seed is one offspring of the cross.</p>
<p data-step="4">Mendel did each cross in both directions, for example purple mother × white father, and white mother × purple father. Such a pair is a <b>reciprocal cross</b>. Both directions gave the same result, so both parents contribute equally to these traits.</p>`,
star:'Reciprocal cross: swap the parent that gives the pollen.',starStep:4,
scene(H){const s=ST();
  const big=(x,col,par,t)=>{const G=H.g(s);cap(G,x,40,t,'middle',`fill:var(--${par})`);H.E('circle',{cx:x,cy:142,r:78,st:`fill:none;stroke:var(--${par});stroke-width:2.5;stroke-dasharray:6 5`},G);
    flower(G,x,142,64,col);H.E('circle',{cx:x,cy:142,r:9,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.4'},G);
    G.an=[0,1,2,3,4].map(i=>{const a=(i*72+36)*Math.PI/180;const e=H.E('ellipse',{rx:7,ry:5,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.2'},G);H.T(e,{x:x+26*Math.sin(a),y:142-26*Math.cos(a),r:i*72+36},{d:0});return e});return G};
  const M=big(150,WHITEF,'mom','Mother plant'),F=big(470,PURPLE,'dad','Father plant');
  const l1=lbs(s,150,240,'anthers removed');H.O(l1,0,{d:0});
  const l0=H.g(s);H.E('path',{d:'M162,142 L240,118',st:'stroke:var(--ink);stroke-width:1.2'},l0);lbs(l0,244,116,'stigma','start');
  H.E('path',{d:'M485,121 L560,88',st:'stroke:var(--ink);stroke-width:1.2'},l0);lbs(l0,562,86,'anthers','start');
  const brush=at(s,560,250);H.E('rect',{x:0,y:-4,width:62,height:8,rx:3,st:'fill:var(--mom-tint);stroke:var(--ink);stroke-width:1.4'},brush);
  H.E('path',{d:'M0,-6 C-10,-7 -20,-3 -24,0 C-20,3 -10,7 0,6 Z',st:'fill:var(--muted);stroke:var(--ink);stroke-width:1.2'},brush);
  const bp=[[-18,-1],[-14,2],[-10,-2],[-20,2]].map(([x,y])=>{const d=H.E('circle',{cx:x,cy:y,r:2.6,st:'fill:var(--hi);stroke:var(--ink);stroke-width:.6'},brush);H.O(d,0,{d:0});return d});
  H.T(brush,{r:-20},{d:0});H.O(brush,0,{d:0});
  const sp=[[-3,-2],[3,1],[0,4],[-4,3]].map(([x,y])=>{const d=H.E('circle',{cx:150+x,cy:142+y,r:2.6,st:'fill:var(--hi);stroke:var(--ink);stroke-width:.6'},s);H.O(d,0,{d:0});return d});
  const l2=lbs(s,150,256,'pollen on the stigma');H.O(l2,0,{d:0});
  const pod=H.g(s);const pd=H.E('path',{d:'M60,318 C100,288 210,288 250,312 C210,340 100,344 60,318 Z',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--good);stroke-width:3'},pod);
  const ps=[92,124,156,188,218].map(x=>{const e=seed(pod,x,316,11,{});hide(e);return e});const l3=lbs(pod,155,362,'seeds = offspring');H.O(l3,0,{d:0});
  const R=H.g(s);cap(R,465,286,'Reciprocal crosses');
  const rr=(y,mc,fc)=>{const G=H.g(R);flower(G,345,y,15,mc);H.E('circle',{cx:345,cy:y,r:19,st:'fill:none;stroke:var(--mom);stroke-width:2.2'},G);lb(G,377,y+5,'×');
    flower(G,409,y,15,fc);H.E('circle',{cx:409,cy:y,r:19,st:'fill:none;stroke:var(--dad);stroke-width:2.2'},G);const a=mkA(G,436,y,470,y,{w:1.6,h:6});a.lastChild.style.opacity=1;
    flower(G,492,y,15,PURPLE);lbs(G,516,y+4,'all purple','start');G.querySelectorAll('.draw').forEach(e=>e.style.strokeDashoffset=0)};
  rr(320,PURPLE,WHITEF);rr(372,WHITEF,PURPLE);lbs(R,345,404,'mother');lbs(R,409,404,'father');H.O(R,0,{d:0});
  return [
    ()=>{},
    ()=>{M.an.forEach((e,i)=>{H.T(e,{y:30},{d:900,at:i*80});H.O(e,0,{d:600,at:300+i*80})});H.O(l1,1,{at:700})},
    ()=>{H.O(l1,0,{d:300});H.O(brush,1);H.T(brush,{x:500,y:132,r:-20},{d:800});H.after(800,()=>{bp.forEach(d=>H.O(d,1,{d:300}));
        H.T(brush,{x:180,y:132,r:-20},{d:1300,at:300});H.after(1650,()=>{sp.forEach(d=>H.O(d,1,{d:300}));bp.forEach(d=>H.O(d,0,{d:300}));H.O(brush,0,{d:500,at:400});H.O(l2,1)})})},
    ()=>{H.O(l2,0,{d:300});H.D(pd,1,{d:900});ps.forEach((e,i)=>pop(e,{at:600+i*120}));H.O(l3,1,{at:1200})},
    ()=>{H.O(R,1,{d:700})},
  ];}},

/* 5 ─────────────────────────────── */
{sec:'1.1',title:'Seven Traits, Two Forms Each',caption:'Photos of the seven traits: Bioanthropologist1, CC BY 4.0, via Wikimedia Commons (cropped)',
text:`<p data-step="0">Mendel studied seven pea traits. Each trait had two clear forms.</p>
<p data-step="1"><b>Seed traits.</b> Seed shape is round or wrinkled. Seed colour is yellow or green. Mendel saw these two traits directly on the seeds in the pod.</p>
<p data-step="2"><b>Flower colour.</b> The flowers are purple or white.</p>
<p data-step="3"><b>Pod traits.</b> Pod shape is inflated or constricted (narrow between the seeds). Pod colour is green or yellow.</p>
<p data-step="4"><b>Plant traits.</b> The flowers grow along the stem (axial) or at its top (terminal). The stem is tall or short.</p>
<p data-step="5">For each trait, Mendel crossed plants with the two forms. Then he counted the offspring with each form.</p>`,
star:'7 traits × 2 forms: seed shape, seed colour, flower colour, pod shape, pod colour, flower position, stem length.',starStep:5,
scene(H){const s=ST();const k=640/884,Y0=12;
  H.E('image',{href:IMG.traits,x:0,y:Y0,width:640,height:490*k},s);
  const cx=[2,128,253,379,537,630,760,881].map(v=>v*k),y0=Y0+2*k,y1=Y0+487*k;
  const groups=[[0,2],[2,3],[3,5],[5,7]];
  const veil=groups.map(([a,b])=>{const r=H.E('rect',{x:cx[a],y:y0,width:cx[b]-cx[a],height:y1-y0,st:'fill:var(--paper);opacity:0'},s);return r});
  const ring=groups.map(([a,b])=>H.E('rect',{x:cx[a]+2,y:y0+2,width:cx[b]-cx[a]-4,height:y1-y0-4,rx:6,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:4'},s));
  const focus=i=>{veil.forEach((v,j)=>{v.style.transitionDuration='500ms';v.style.opacity=j===i?0:.62});ring.forEach((r,j)=>H.D(r,j===i?1:0,{d:j===i?900:300}))};
  const note=lb(s,320,392,'each column: one trait, with its two forms','middle','font-size:14px');H.O(note,0,{d:0});
  return [()=>{},()=>focus(0),()=>focus(1),()=>focus(2),()=>focus(3),
    ()=>{veil.forEach(v=>{v.style.opacity=0});ring.forEach(r=>H.D(r,0,{d:300}));H.O(note,1,{at:300})}];}},

/* 6 ─────────────────────────────── */
{sec:'1.1',title:'Blending or Particles?',caption:'Top: what blending predicts · bottom: what Mendel saw · beads = Mendel’s factors',
text:`<p data-step="0">Before Mendel, most biologists accepted <b>blending inheritance</b>. In this idea, the traits of two parents mix like paint, and the mix cannot separate again.</p>
<p data-step="1">Blending predicts that purple × white gives pale purple offspring. Their offspring are pale purple too. White flowers never return.</p>
<p data-step="2">Mendel crossed true-breeding purple plants with true-breeding white plants. All the offspring had purple flowers, not pale purple flowers.</p>
<p data-step="3">Then the purple offspring self-pollinated. About one plant in four of the next generation had white flowers. The white form stayed hidden for one generation, but it did not disappear.</p>
<p data-step="4">So heredity uses separate units that keep their identity. Biologists call this idea <b>particulate inheritance</b>. Mendel called the units factors. Today we call them <b>genes</b>.</p>`,
star:'Paint blends. Genes stay separate.',starStep:4,
scene(H){const s=ST();
  H.E('line',{x1:16,y1:190,x2:624,y2:190,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  const top=H.g(s);cap(top,20,30,'Blending predicts','start','fill:var(--ink)');
  const drop=(p,x,y,col,sc)=>{const G=at(p,x,y,sc||1);H.E('path',{d:DROP,st:`fill:${col};stroke:var(--ink);stroke-width:1.6`},G);return G};
  const dp=drop(top,70,96,PURPLE),dw=drop(top,150,96,WHITEF);const tx=lb(top,110,102,'×');
  const a1=mkA(top,186,96,228,96,{w:1.6,h:6}),a2=mkA(top,312,96,354,96,{w:1.6,h:6});
  const f1=drop(top,270,96,PALE);hide(f1);const f2=[392,442,492,542].map(x=>{const d=drop(top,x,96,PALE,.85);hide(d);return d});
  const tl=[[110,'parents'],[270,'offspring'],[467,'next generation']].map(([x,t])=>lbs(top,x,146,t));
  const no=H.g(s);H.E('rect',{x:370,y:58,width:196,height:72,rx:8,st:'fill:none;stroke:var(--bad);stroke-width:2.5'},no);lb(no,468,174,'not seen','middle','fill:var(--bad)');H.O(no,0,{d:0});
  const bot=H.g(s);cap(bot,20,214,'Mendel saw','start','fill:var(--ink)');H.O(bot,0,{d:0});
  const FY=268;const P1=flower(s,70,FY,24,PURPLE),P2=flower(s,150,FY,24,WHITEF);const bx=lb(s,110,FY+5,'×');
  const b1=mkA(s,186,FY,228,FY,{w:1.6,h:6}),b2=mkA(s,312,FY,354,FY,{w:1.6,h:6});
  const F1=flower(s,270,FY,24,PURPLE);const F2=[392,442,492,542].map((x,i)=>flower(s,x,FY,21,i===3?WHITEF:PURPLE));
  [P1,P2,F1,...F2].forEach(hide);H.O(bx,0,{d:0});
  const bl=[[110,'parents'],[270,'offspring'],[467,'next generation']].map(([x,t])=>{const e=lbs(s,x,FY+48,t);H.O(e,0,{d:0});return e});
  const hl=H.E('circle',{cx:542,cy:FY,r:30,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:4'},s);
  const bead=(x,cols)=>{const G=H.g(s);cols.forEach((c,i)=>H.E('circle',{cx:x+(i?9:-9),cy:FY+72,r:7,st:`fill:${c};stroke:var(--ink);stroke-width:1.4`},G));H.O(G,0,{d:0});return G};
  const P=PURPLE,W=WHITEF;const beads=[bead(70,[P,P]),bead(150,[W,W]),bead(270,[P,W]),bead(392,[P,P]),bead(442,[P,W]),bead(492,[W,P]),bead(542,[W,W])];
  const bl2=lb(s,320,FY+120,'two factors per plant · they never mix');H.O(bl2,0,{d:0});
  return [
    ()=>{},
    ()=>{H.T(dp,{x:240},{d:900});H.T(dw,{x:300},{d:900});H.O([dp,dw],0,{d:400,at:700});H.O(tx,0,{d:300});drawA(a1);
      H.after(900,()=>{pop(f1);H.T(dp,{x:70},{d:0});H.T(dw,{x:150},{d:0});H.O([dp,dw,tx],1,{d:400,at:300});drawA(a2,{at:400});f2.forEach((d,i)=>pop(d,{at:800+i*120}))})},
    ()=>{H.O(bot,1);pop(P1);pop(P2);H.O(bx,1);drawA(b1,{at:400});pop(F1,{at:900});H.O(bl.slice(0,2),1,{at:900})},
    ()=>{drawA(b2);F2.forEach((f,i)=>pop(f,{at:400+i*150}));H.O(bl[2],1,{at:900});H.D(hl,1,{d:800,at:1200});H.O(no,1,{at:1400})},
    ()=>{beads.forEach((b,i)=>H.O(b,1,{at:i*120}));H.O(bl2,1,{at:900})},
  ];}},

/* 7 ─────────────────────────────── */
{sec:'1.4',title:'Genes Are Made of DNA',caption:'One pair of homologous chromosomes · DNA letters are schematic · blue = from the father plant, orange = from the mother plant',
text:`<p data-step="0"><b>DNA</b> is the molecule of heredity. DNA is a long chain of four chemical units. Biologists write the units as the letters A, C, G and T. The order of the letters carries the instructions.</p>
<p data-step="0">A <b>chromosome</b> is one long DNA molecule.</p>
<p data-step="1">A <b>protein</b> is a molecule that does one job in the cell. A <b>gene</b> is a segment of DNA with the instructions for one product, usually a protein. Each gene has a fixed place on its chromosome, its <b>locus</b> (plural <b>loci</b>).</p>
<p data-step="2">Pea body cells are <b>diploid</b>: they have two sets of chromosomes, one set from each parent. The two chromosomes of a pair are <b>homologous chromosomes</b>, or <b>homologs</b>. Homologs carry the same genes at the same loci. So a diploid cell has two copies of each gene.</p>`,
star:'Chromosome = one DNA molecule. Gene = a segment of it. Locus = the address of the gene.',starStep:2,
scene(H){const s=ST();const XB=60,XO=120,Y0=46,Y1=330,LY=150;
  const chr=[['dad',XB],['mom',XO]].map(([c,x])=>H.E('path',{d:`M${x},${Y0} L${x},${Y1}`,pathLength:1,cls:'draw',st:`stroke:var(--${c});stroke-width:18;stroke-linecap:round`},s));
  const loci=[];[[86,10],[LY,18],[232,12],[292,10]].forEach(([y,h])=>[XB,XO].forEach(x=>{const r=H.E('rect',{x:x-13,y:y-h/2,width:26,height:h,rx:3,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.4'},s);H.O(r,0,{d:0});loci.push([r,y])}));
  const g0=H.g(s);H.E('path',{d:`M${XO+14},86 L150,70`,st:'stroke:var(--ink);stroke-width:1.2'},g0);lb(g0,154,70,'genes','start');H.O(g0,0,{d:0});
  const g1=H.g(s);H.E('path',{d:`M${XO+14},${LY+6} L148,${LY+24}`,st:'stroke:var(--ink);stroke-width:1.2'},g1);lb(g1,150,LY+38,'locus of the','start','font-size:13px');lb(g1,150,LY+54,'seed-shape gene','start','font-size:13px');H.O(g1,0,{d:0});
  const g2=H.g(s);cap(g2,XB+10,28,'father','end','fill:var(--dad)');cap(g2,XO-10,28,'mother','start','fill:var(--mom)');
  H.E('path',{d:`M${XB-10},348 L${XB-10},356 L${XO+10},356 L${XO+10},348`,st:'fill:none;stroke:var(--ink);stroke-width:1.6'},g2);lb(g2,90,376,'homologs','middle','font-size:13px');lbs(g2,90,392,'(homologous chromosomes)');H.O(g2,0,{d:0});
  // DNA ladder zoom
  const Z=H.g(s);const zx=300,zy=56;
  H.E('path',{d:`M${XB+10},${LY-40} L${zx-8},${zy} M${XB+10},${LY+40} L${zx-8},${zy+110}`,st:'stroke:var(--faint);stroke-width:1.2;stroke-dasharray:3 3'},Z);
  H.E('rect',{x:zx-8,y:zy,width:340,height:110,rx:8,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.2'},Z);
  lbs(Z,zx+2,zy+18,'DNA: a chain of the letters A, C, G and T','start','fill:var(--ink);font-weight:600');
  const top='ATGGCTTACGATCCGA',bot='TACCGAATGCTAGGCT';const hl=H.E('rect',{x:zx+4+4*20-6,y:zy+28,width:9*20,height:70,rx:6,st:'fill:var(--hi);opacity:0'},Z);
  for(let i=0;i<16;i++){const x=zx+10+i*20;H.E('line',{x1:x,y1:zy+52,x2:x,y2:zy+72,st:'stroke:var(--muted);stroke-width:2'},Z);
    H.txt(Z,x,zy+48,top[i],'lb',{'text-anchor':'middle',st:'font-family:ui-monospace,Menlo,monospace;font-size:15px;fill:var(--dad)'});
    H.txt(Z,x,zy+90,bot[i],'lb',{'text-anchor':'middle',st:'font-family:ui-monospace,Menlo,monospace;font-size:15px;fill:var(--dad)'})}
  H.O(Z,0,{d:0});
  const GP=H.g(s);const gx=zx+4+4*20-6+90;lb(GP,gx,zy+130,'one gene','middle','font-size:13px');
  const ga=mkA(GP,gx,zy+138,gx,zy+176,{w:1.8,h:7});
  H.E('path',{d:`M${gx-30},${zy+200} C${gx-30},${zy+180} ${gx-6},${zy+178} ${gx+4},${zy+186} C${gx+22},${zy+176} ${gx+40},${zy+190} ${gx+30},${zy+206} C${gx+36},${zy+222} ${gx+8},${zy+226} ${gx-4},${zy+218} C${gx-20},${zy+226} ${gx-34},${zy+214} ${gx-30},${zy+200} Z`,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.5'},GP);
  lb(GP,gx+50,zy+206,'protein','start','font-size:13px');H.O(GP,0,{d:0});
  return [
    ()=>{H.D(chr,1,{d:1100});H.O(Z,1,{d:700,at:600})},
    ()=>{loci.forEach(([r],i)=>H.O(r,1,{at:i*60}));H.O(g0,1,{at:300});H.O(hl,.45,{at:300});H.O(GP,1,{at:600});drawA(ga,{at:600});
      loci.forEach(([r,y])=>{if(y===LY)paint(r,'fill','var(--hi)',{at:900})});H.O(g1,1,{at:1000})},
    ()=>{H.O(g2,1)},
  ];}},

/* 8 ─────────────────────────────── */
{sec:'1.4',title:'Alleles, Genotype and Phenotype',caption:'Seed-shape gene · DNA letters are schematic · blue = allele from the father plant, orange = allele from the mother plant',
text:`<p data-step="0">The two copies of a gene can differ in their DNA letters. Each version of a gene is an <b>allele</b>. For example, the round allele <i>R</i> and the wrinkled allele <i>r</i> differ by an extra piece of DNA in <i>r</i>.</p>
<p data-step="1">A plant with two identical alleles (<i>RR</i> or <i>rr</i>) is <b>homozygous</b>. A plant with two different alleles (<i>Rr</i>) is <b>heterozygous</b>, a heterozygote. Mendel called a heterozygote a <b>hybrid</b>.</p>
<p data-step="1">The alleles of an individual are its <b>genotype</b>.</p>
<p data-step="2">The traits that we can observe or measure are its <b>phenotype</b>, for example seed shape or flower colour. <i>RR</i> and <i>Rr</i> seeds are round. Only <i>rr</i> seeds are wrinkled.</p>`,
star:'Locus = the address. Allele = the version at that address.',starStep:0,
scene(H){const s=ST();const XB=60,XO=120,Y0=46,Y1=330,LY=150;
  [['dad',XB],['mom',XO]].forEach(([c,x])=>H.E('path',{d:`M${x},${Y0} L${x},${Y1}`,st:`stroke:var(--${c});stroke-width:18;stroke-linecap:round`},s));
  [[86,10],[LY,18],[232,12],[292,10]].forEach(([y,h])=>[XB,XO].forEach(x=>H.E('rect',{x:x-13,y:y-h/2,width:26,height:h,rx:3,st:`fill:${y===LY?'var(--hi)':'var(--card)'};stroke:var(--ink);stroke-width:1.4`},s)));
  chip(s,XB,LY+30,'R',{par:'dad',w:22});chip(s,XO,LY+30,'r',{par:'mom',w:22});
  const Z=H.g(s);const zx=292,zy=56;
  H.E('path',{d:`M${XO+13},${LY-9} L${zx-6},${zy} M${XO+13},${LY+9} L${zx-6},${zy+120}`,st:'stroke:var(--faint);stroke-width:1.2;stroke-dasharray:3 3'},Z);
  H.E('rect',{x:zx-6,y:zy,width:346,height:120,rx:8,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.2'},Z);
  const seq=(y,col,parts)=>{let x=zx+8;parts.forEach(([t,hi])=>{if(hi){H.E('rect',{x:x-2,y:y-15,width:t.length*10.2+4,height:21,rx:3,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1'},Z)}
      H.txt(Z,x,y,t,'lb',{st:`font-family:ui-monospace,Menlo,monospace;font-size:15px;letter-spacing:.8px;fill:${hi?'#16181d':H.C(col)}`});x+=t.length*10.2+(hi?6:0)})};
  lb(Z,zx+8,zy+22,'allele R','start','font-size:13px;fill:var(--dad)');seq(zy+44,'dad',[['…GCTTACG',0],['ATCCGA…',0]]);
  lb(Z,zx+8,zy+72,'allele r','start','font-size:13px;fill:var(--mom)');seq(zy+96,'mom',[['…GCTTACG',0],['+800 letters',1],['ATCC…',0]]);H.O(Z,0,{d:0});
  const cxs=[372,480,588];const T1=H.g(s),T2=H.g(s);cap(T1,292,214,'Genotype','start','fill:var(--ink)');cap(T2,292,302,'Phenotype','start','fill:var(--ink)');
  [['R','R'],['R','r'],['r','r']].forEach((g,i)=>{chip(T1,cxs[i]-14,240,g[0],{par:'dad',w:24});chip(T1,cxs[i]+14,240,g[1],{par:'mom',w:24});
    lbs(T1,cxs[i],272,i===1?'heterozygous':'homozygous');seed(T2,cxs[i],334,18,{wr:i===2});lbs(T2,cxs[i],370,i===2?'wrinkled':'round')});H.O([T1,T2],0,{d:0});
  return [()=>{H.O(Z,1,{d:700})},()=>{H.O(T1,1,{d:700})},()=>{H.O(T2,1,{d:700})}];}},

/* 9 ─────────────────────────────── */
{sec:'1.2',title:'Why One Working Copy Is Enough',caption:'Green = working copy, dashed = broken copy · dots = protein, schematic · photos: purple pea, Steffen Bauer (SaatPilot), CC BY 4.0; white pea, net_efekt, CC BY 2.0; via Wikimedia Commons',
text:`<p data-step="0">Most genes make a protein. Mendel’s flower-colour gene, <i>A</i>, makes a protein that causes the cell to make purple <b>pigment</b> (a coloured substance). An <i>AA</i> plant has two working copies and purple flowers.</p>
<p data-step="1">The white allele, <i>a</i>, is a broken copy: it has a DNA change, so its protein does not work. An <i>aa</i> plant makes no working protein and no pigment, so its flowers are white.</p>
<p data-step="2">An <i>Aa</i> plant has one working copy, so it makes about half the normal amount of protein. Half is enough for full purple colour. So <i>Aa</i> flowers look the same as <i>AA</i> flowers.</p>
<p data-step="3">The allele that sets the phenotype of the heterozygote is <b>dominant</b> (<i>A</i>). The other allele is <b>recessive</b> (<i>a</i>): its phenotype shows only in a homozygote. We know which allele is dominant only when we observe the heterozygote.</p>
<p data-step="3" class="note">All seven of Mendel’s traits show this <b>complete dominance</b>. In other genes, the heterozygote is in between the two homozygotes (incomplete dominance), or it shows both forms (codominance).</p>`,
star:'A recessive allele is often a broken copy. One working copy is usually enough.',starStep:3,
scene(H){const s=ST();const ys={AA:88,Aa:208,aa:328};
  [[46,'Genotype'],[121,'Copies'],[262,'Protein'],[458,'Flower']].forEach(([x,t])=>cap(s,x,30,t));
  const hl=H.E('rect',{x:8,y:ys.Aa-54,width:624,height:108,rx:12,st:'fill:var(--hi);opacity:0'},s);
  const R={};
  Object.entries(ys).forEach(([g,y])=>{const G=H.g(s);rt(G,54,y+8,g,'mt',{'text-anchor':'middle',st:'font-size:24px'});
    const ok=[g[0]==='A',g[1]==='A'];const ch=[chip(G,104,y,g[0],{par:'dad',w:30,ok:ok[0]}),chip(G,138,y,g[1],{par:'mom',w:30,ok:ok[1]})];
    H.E('rect',{x:184,y:y-30,width:156,height:60,rx:8,st:'fill:none;stroke:var(--faint);stroke-width:1.5'},G);
    const dots=[];ok.forEach((o,k)=>{if(!o)return;for(let j=0;j<4;j++){const d=H.E('circle',{r:8,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.2'},G);
      const tx=200+(k*4+j)*18.5,ty=y+(j%2?8:-8);H.T(d,{x:[104,138][k],y},{d:0});H.O(d,0,{d:0});dots.push([d,tx,ty])}});
    const pct=lbs(G,262,y+48,g==='AA'?'100%':g==='Aa'?'50% · enough':'0% · none','middle','font-weight:700;fill:var(--ink)');H.O(pct,0,{d:0});
    const a=mkA(G,352,y,394,y,{w:1.8,h:7});
    const ph=photo(G,g==='aa'?IMG.white:IMG.purple,412,y-46,92,92,{r:46});H.O(ph,0,{d:0});
    const w=lb(G,520,y+5,g==='aa'?'white':'purple','start');H.O(w,0,{d:0});H.O(G,0,{d:0});
    R[g]={G,dots,pct,a,ph,w}});
  const show=(g,o)=>{const r=R[g];H.O(r.G,1);r.dots.forEach(([d,x,y],i)=>{H.O(d,1,{d:200,at:300+i*90});H.T(d,{x,y},{d:800,at:300+i*90})});
    H.O(r.pct,1,{at:900});drawA(r.a,{at:1000});H.O(r.ph,1,{at:1300});H.O(r.w,1,{at:1400})};
  const dom=H.g(s);lb(dom,520,ys.Aa+26,'A: dominant','start','font-size:13px');lb(dom,520,ys.Aa+44,'a: recessive','start','font-size:13px');H.O(dom,0,{d:0});
  return [()=>show('AA'),()=>show('aa'),()=>show('Aa'),()=>{H.O(hl,.2);H.O(dom,1,{at:300})}];}},

/* 10 ─────────────────────────────── */
{sec:'1.2',title:'The Seed-Shape Gene',caption:'Photos: round peas, Billjones94, CC BY-SA 4.0; wrinkled peas, Ninjatacoshell, CC BY-SA 3.0; via Wikimedia Commons · gene and starch drawings are schematic',
text:`<p data-step="0">In 1990, scientists found the DNA of Mendel’s seed-shape gene, <i>R</i>. <i>R</i> makes an enzyme (a protein that speeds up one chemical reaction): <b>starch-branching enzyme I</b> (SBEI). The Roman numeral I in the name means type 1. SBEI adds branches to the starch chains in a young seed.</p>
<p data-step="1">The wrinkled allele, <i>r</i>, contains an extra piece of DNA about 800 letters long. The piece is a <b>transposon</b>, a DNA segment that can move to a new place in the <b>genome</b> (all the DNA of an organism). The insert breaks the gene, so the cell makes no working enzyme.</p>
<p data-step="2">So an <i>rr</i> seed makes less starch and keeps more sugar. The sugar draws extra water into the young seed, and the seed swells.</p>
<p data-step="3">When the ripe seed dries, it loses this extra water. The seed shrinks unevenly, so its surface wrinkles.</p>
<p data-step="4">An <i>Rr</i> seed has one working copy. The one working copy makes enough enzyme for normal starch, so the seed stays round. Thus <i>R</i> is dominant and <i>r</i> is recessive.</p>`,
star:'Broken starch enzyme → more sugar → more water → wrinkles.',starStep:3,
scene(H){const s=ST();
  photo(s,IMG.round,8,8,180,124,{r:10});lb(s,98,152,'round seeds','middle','font-size:13px');lbs(s,98,168,'RR or Rr');
  photo(s,IMG.wrinkled,8,184,180,124,{r:10});lb(s,98,328,'wrinkled seeds','middle','font-size:13px');lbs(s,98,344,'rr');
  const RY=60,rY=166;
  const A=H.g(s);gene(A,214,RY,118,'gene R');const ea=mkA(A,338,RY,368,RY,{w:1.6,h:6});const en=enzyme(A,386,RY,{});lbs(A,386,RY+30,'SBEI');H.O(A,0,{d:0});
  const st=H.g(s);const sx=[];for(let i=0;i<10;i++)sx.push([424+i*20,RY+12]);
  const br=[[[464,RY+12],[478,RY-2],[492,RY-16],[506,RY-30]],[[524,RY+12],[538,RY-2],[552,RY-16]],[[584,RY+12],[598,RY-2],[612,RY-16],[626,RY-30]]];
  const chain=[sx,...br];const stl=chain.map(pts=>H.E('path',{d:'M'+pts.map(p=>p.join(',')).join(' L'),pathLength:1,cls:'draw',st:'fill:none;stroke:var(--muted);stroke-width:2'},st));
  const beads=[];chain.forEach(pts=>pts.forEach(([x,y])=>{const b=H.E('circle',{cx:x,cy:y,r:4.5,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.2'},st);H.O(b,0,{d:0});beads.push(b)}));
  lbs(st,524,RY+38,'branched starch');
  const B=H.g(s);gene(B,214,rY,118,'gene r');const ins=at(B,273,rY-60);H.E('rect',{x:-16,y:-10,width:32,height:20,rx:3,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.4'},ins);
  lbs(B,273,rY+28,'+ 800 letters (transposon)');const eb=mkA(B,338,rY,368,rY,{w:1.6,h:6});const en2=enzyme(B,386,rY,{broken:true});const xx=cross(B,386,rY,9);H.O(xx,0,{d:0});
  lbs(B,386,rY+28,'no working SBEI','start','font-size:11px').setAttribute('x',356);
  const sug=H.g(B);const sp=[[440,150],[466,172],[492,148],[520,176],[548,152],[576,172],[604,150],[460,196],[512,198],[566,198]];
  const hex=sp.map(([x,y])=>{const h=at(sug,x,y);H.E('path',{d:hexD(7),st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.1'},h);H.O(h,0,{d:0});return h});
  lbs(B,524,220,'less starch, more sugar');H.O(B,0,{d:0});
  // seed development
  const D=H.g(s);H.E('line',{x1:206,y1:244,x2:632,y2:244,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},D);lb(D,214,268,'A young seed with genotype rr','start','font-size:13px');
  const sd=seed(D,330,330,34,{});const wr=sd.wr,rd=sd.rd;
  const drops=[[-1,-.6],[-1,.4],[1,-.5],[1,.5],[0,-1],[-.6,1],[.6,1]].map(([dx,dy],i)=>{const G=at(D,330+dx*120,330+dy*70,.45);H.E('path',{d:DROP,st:'fill:var(--wash);stroke:var(--muted);stroke-width:2.5'},G);H.O(G,0,{d:0});G.dx=dx;G.dy=dy;return G});
  const dl=lbs(D,430,396,'','middle','font-weight:700;fill:var(--ink)');
  const E=H.g(s);chip(E,520,320,'R',{par:'dad',w:24,ok:true});chip(E,548,320,'r',{par:'mom',w:24,ok:false});seed(E,598,320,22,{});lbs(E,560,356,'Rr: enough SBEI','middle','font-weight:700;fill:var(--ink)');lbs(E,560,372,'→ round');H.O(E,0,{d:0});
  H.O(D,0,{d:0});
  return [
    ()=>{H.O(A,1);drawA(ea,{at:300});H.D(stl,1,{d:1200,at:800});beads.forEach((b,i)=>H.O(b,1,{d:200,at:900+i*40}))},
    ()=>{H.O(B,1);H.T(ins,{y:rY},{d:900,at:300});drawA(eb,{at:900});H.O(xx,1,{at:1300});hex.forEach((h,i)=>H.O(h,1,{at:1500+i*60}))},
    ()=>{H.O(D,1);dl.textContent='sugar draws in water';drops.forEach((d,i)=>{H.O(d,1,{d:200,at:300+i*80});H.T(d,{x:330+d.dx*28,y:330+d.dy*22,s:.3},{d:1000,at:300+i*80});H.O(d,0,{d:300,at:1200+i*80})});H.T(sd,{s:1.25},{d:900,at:1100})},
    ()=>{dl.textContent='the seed dries and wrinkles';drops.forEach((d,i)=>{H.T(d,{x:330+d.dx*130,y:330+d.dy*76,s:.45},{d:0});H.O(d,0,{d:0})});
      drops.forEach((d,i)=>{H.T(d,{x:330+d.dx*40,y:330+d.dy*30,s:.35},{d:0});H.O(d,1,{d:200,at:i*60});H.T(d,{x:330+d.dx*130,y:330+d.dy*76,s:.45},{d:1000,at:100+i*60});H.O(d,0,{d:400,at:800+i*60})});
      H.T(sd,{s:1},{d:900,at:600});H.O(rd,0,{d:500,at:900});H.O(wr,1,{d:500,at:900})},
    ()=>{H.O(E,1)},
  ];}},

/* 11 ─────────────────────────────── */
{sec:'1.2',title:'Three More of Mendel’s Genes',caption:'Photos: purple pea, Steffen Bauer (SaatPilot), CC BY 4.0; white pea, net_efekt, CC BY 2.0; seeds and plants, Bioanthropologist1, CC BY 4.0; via Wikimedia Commons',
text:`<p data-step="0">Scientists now know the DNA changes behind several of Mendel’s traits. In each example, the recessive allele is a broken or weak copy of the gene.</p>
<p data-step="1"><b>Flower colour, gene <i>A</i>.</b> <i>A</i> makes a <b>transcription factor</b>, a protein that activates other genes. The A protein activates the genes for purple pigment. The white allele has a one-letter DNA change, so the cell makes no working protein.</p>
<p data-step="2"><b>Seed colour, gene <i>I</i>.</b> <i>I</i> makes the protein SGR, short for STAY-GREEN. As the seed ripens, SGR starts the breakdown of the green pigment chlorophyll, so the seed becomes yellow. Seeds with no working SGR stay green.</p>
<p data-step="3"><b>Stem length, gene <i>Le</i>.</b> <i>Le</i> makes an enzyme that makes the active form of gibberellin, a plant growth hormone. The short allele has a one-letter change that weakens the enzyme. With less active gibberellin, the stem stays short.</p>
<p data-step="4">For <i>R</i>, <i>A</i>, <i>I</i> and <i>Le</i>, one working copy makes enough product. So the working allele is dominant, as Mendel observed.</p>`,
star:'For these genes: dominant = working copy, recessive = broken or weak copy.',starStep:4,
scene(H){const s=ST();const ys=[74,200,326];
  cap(s,58,20,'Dominant');cap(s,150,20,'Recessive');cap(s,214,20,'Gene','start');cap(s,416,20,'Product','start');
  const row=(y,ph,gl,mut,prod,res)=>{const G=H.g(s);
    ph[0](G,14,y-44,88,88);ph[1](G,106,y-44,88,88);lbs(G,58,y+60,ph[2]);lbs(G,150,y+60,ph[3]);
    gene(G,214,y,110,gl);if(mut){H.E('line',{x1:270,y1:y-14,x2:270,y2:y+14,st:'stroke:var(--bad);stroke-width:3'},G);lbs(G,270,y+30,mut)}
    const a=mkA(G,332,y,362,y,{w:1.6,h:6});a.lastChild.style.opacity=1;G.querySelectorAll('.draw').forEach(e=>e.style.strokeDashoffset=0);
    prod(G,y);const rl=gl(G,632,y+5,res,'end','font-size:13px');rl.classList.add('res');H.O(rl,0,{d:0});H.O(G,0,{d:0});return G};
  const pic=(href)=>(G,x,y,w,h)=>photo(G,href,x,y,w,h,{r:8});const tr=key=>(G,x,y,w,h)=>trait(G,key,x,y,w,h);
  const r1=row(ys[0],[pic(IMG.purple),pic(IMG.white),'purple','white'],'gene A','1 letter',(G,y)=>{
      const tf=at(G,384,y);H.E('rect',{x:-16,y:-11,width:32,height:22,rx:11,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.4'},tf);lbs(G,384,y+28,'transcription');lbs(G,384,y+42,'factor');
      const a=mkA(G,404,y,430,y,{w:1.4,h:5});a.lastChild.style.opacity=1;a.firstChild.style.strokeDashoffset=0;
      [0,1,2,3,4,5].forEach(i=>H.E('circle',{cx:446+(i%3)*14,cy:y-7+Math.floor(i/3)*14,r:5.5,st:`fill:${PURPLE};stroke:var(--ink);stroke-width:1`},G));lbs(G,460,y+28,'pigment')},[['Aa',1],[': purple',0]]);
  const r2=row(ys[1],[tr('yellow'),tr('green'),'yellow','green'],'gene I','DNA change',(G,y)=>{
      const p=at(G,384,y);H.E('rect',{x:-16,y:-11,width:32,height:22,rx:11,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.4'},p);H.txt(p,0,4,'SGR','lbs',{'text-anchor':'middle',st:'fill:var(--paper);font-weight:700;font-size:10px'});
      lbs(G,384,y+28,'stay-green');lbs(G,384,y+42,'protein');
      const a=mkA(G,404,y,430,y,{w:1.4,h:5});a.lastChild.style.opacity=1;a.firstChild.style.strokeDashoffset=0;
      [0,1,2].forEach(i=>{const x=446+i*15;H.E('path',{d:hexD(6.5),transform:`translate(${x},${y-6})`,st:`fill:var(--good);stroke:var(--ink);stroke-width:1;opacity:${1-i*.3}`},G);
        H.E('path',{d:'M-3,-3 L3,3 M3,-3 L-3,3',transform:`translate(${x},${y+12})`,st:`stroke:var(--good);stroke-width:2;opacity:${.3+i*.3}`},G)});lbs(G,460,y+28,'chlorophyll')},[['Ii',1],[': yellow',0]]);
  const r3=row(ys[2],[tr('tall'),tr('short'),'tall','short'],'gene Le','1 letter',(G,y)=>{
      enzyme(G,384,y,{});lbs(G,384,y+28,'enzyme');
      const a=mkA(G,404,y,430,y,{w:1.4,h:5});a.lastChild.style.opacity=1;a.firstChild.style.strokeDashoffset=0;
      [0,1,2].forEach(i=>H.E('path',{d:'M0,-5 L5,0 L0,5 L-5,0 Z',transform:`translate(${446+i*14},${y})`,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1'},G));lbs(G,460,y+28,'gibberellin')},[['Le/le',1],[': tall',0]]);
  const res=()=>s.querySelectorAll('text.res');
  return [()=>{},()=>H.O(r1,1,{d:700}),()=>H.O(r2,1,{d:700}),()=>H.O(r3,1,{d:700}),()=>{H.O([...res()],1)}];}},

/* 12 ─────────────────────────────── */
{sec:'1.2',title:'Writing Genes and Alleles',caption:'Gene and allele symbols in italics · protein names in plain capitals',
text:`<p data-step="0">Geneticists name each gene with a letter or a short word. The dominant allele takes a capital letter (<i>A</i>) and the recessive allele the small letter (<i>a</i>). Alleles of one gene share the letter.</p>
<p data-step="1">A genotype lists both alleles: <i>AA</i>, <i>Aa</i> or <i>aa</i>. A slash shows that the two alleles are on the two homologs. <i>A</i>/<i>a</i> and <i>Aa</i> mean the same genotype.</p>
<p data-step="2">The <b>wild type</b> is the most common form of a trait in natural populations. A <b>wild-type allele</b> is the most common allele in natural populations. A superscript + marks it. Other superscripts or subscripts name other alleles.</p>
<p data-step="3">Gene and allele symbols are in italics. Chromosome and protein names are not. Protein names are often all capitals: the fruit-fly gene <i>white</i> (<i>w</i>) makes the protein WHITE.</p>
<p data-step="4">A genotype usually lists only the genes under study. We assume that all other genes are wild type.</p>
<p data-step="4" class="note">Capital and small letters work only for a gene with two alleles and complete dominance. For other genes, geneticists use superscripts.</p>`,
star:'Capital = dominant · small = recessive · + = wild type · italic = gene.',starStep:4,
scene(H){const s=ST();
  const A=H.g(s);cap(A,20,28,'One gene, one letter','start','fill:var(--ink)');chip(A,60,76,'A',{w:40});chip(A,140,76,'a',{w:40});lbs(A,60,116,'dominant');lbs(A,140,116,'recessive');H.O(A,0,{d:0});
  const B=H.g(s);cap(B,330,28,'Slash = one allele per homolog','start','fill:var(--ink)');
  H.E('line',{x1:340,y1:64,x2:500,y2:64,st:'stroke:var(--dad);stroke-width:12;stroke-linecap:round'},B);H.E('line',{x1:340,y1:96,x2:500,y2:96,st:'stroke:var(--mom);stroke-width:12;stroke-linecap:round'},B);
  const t1=chip(B,420,64,'A',{par:'dad',w:24}),t2=chip(B,420,96,'a',{par:'mom',w:24});
  const sl=lb(B,560,86,'/','middle',MATH+';font-size:30px');const eq=lb(B,560,122,'= Aa','middle',MATH+';font-size:18px');H.O([sl,eq],0,{d:0});H.O(B,0,{d:0});
  const C=H.g(s);cap(C,20,172,'Wild type = most common','start','fill:var(--ink)');
  const eye=(x,y,col)=>{const e=at(C,x,y);H.E('ellipse',{rx:13,ry:16,st:`fill:${col};stroke:var(--ink);stroke-width:1.4`},e);return e};
  const RED='var(--bad)',APR='color-mix(in srgb, var(--mom) 70%, var(--hi))';
  [RED,RED,RED,RED,RED,RED,APR,WHITEF].forEach((c,i)=>eye(36+i*34,206,c));lbs(C,155,238,'fly eyes in a population');
  [[60,'w^+','red · wild type'],[150,'w^a','apricot'],[230,'w','white']].forEach(([x,t,d])=>{rt(C,x,278,t,'lb',{'text-anchor':'middle',st:MATH+';font-size:22px'});lbs(C,x,298,d)});H.O(C,0,{d:0});
  const D=H.g(s);cap(D,330,172,'Gene in italics, protein in capitals','start','fill:var(--ink)');
  gene(D,340,222,100,'');rt(D,390,262,'white (w)','lb',{'text-anchor':'middle',st:'font-style:italic'});
  const da=mkA(D,450,222,488,222,{w:1.8,h:7});da.lastChild.style.opacity=1;da.firstChild.style.strokeDashoffset=0;
  H.E('path',{d:'M500,222 C500,200 540,196 560,206 C584,196 616,214 604,232 C612,250 576,256 556,246 C536,256 500,246 500,222 Z',st:'fill:var(--good);stroke:var(--ink);stroke-width:1.5'},D);
  lb(D,554,227,'WHITE','middle','fill:var(--paper);font-size:13px;font-weight:800');lbs(D,554,274,'protein');H.O(D,0,{d:0});
  const E=H.g(s);cap(E,20,330,'Only the genes under study','start','fill:var(--ink)');
  H.E('line',{x1:30,y1:372,x2:460,y2:372,st:'stroke:var(--dad);stroke-width:14;stroke-linecap:round'},E);
  for(let i=0;i<12;i++){const x=48+i*35;H.E('rect',{x:x-6,y:364,width:12,height:16,rx:2,st:`fill:${i===5?'var(--hi)':'var(--card)'};stroke:var(--ink);stroke-width:1.2`},E)}
  H.E('path',{d:'M223,384 L223,400 L480,400',st:'fill:none;stroke:var(--ink);stroke-width:1.2'},E);lb(E,486,404,'write Aa','start','font-size:13px');lbs(E,486,378,'others: wild type','start');H.O(E,0,{d:0});
  return [
    ()=>{H.O(A,1)},
    ()=>{H.O(B,1);H.T(t1,{x:540,y:82,s:1.25},{d:1100,at:500});H.T(t2,{x:580,y:82,s:1.25},{d:1100,at:500});H.O(sl,1,{at:1500});H.O(eq,1,{at:1800})},
    ()=>{H.O(C,1)},
    ()=>{H.O(D,1)},
    ()=>{H.O(E,1)},
  ];}},

/* 13 ─────────────────────────────── */
{sec:'1.4',title:'True-Breeding Lines',caption:'Arrows = self-pollination · chips under each flower = its two alleles',
text:`<p data-step="0">A <b>true-breeding line</b> (also called a pure-breeding line) is a group of plants or animals that always produce offspring with the same form of a trait.</p>
<p data-step="1">A true-breeding line is homozygous. A self-pollinated <i>AA</i> plant makes only <i>A</i> gametes, so all its offspring are <i>AA</i>. In the same way, <i>aa</i> plants give only <i>aa</i> offspring.</p>
<p data-step="2">A heterozygous plant does not breed true. A self-pollinated <i>Aa</i> plant makes <i>A</i> and <i>a</i> gametes, so its offspring are a mixture.</p>
<p data-step="3">Before his main crosses, Mendel grew 34 pea varieties for two years. All of them bred true. Mendel chose 22 of them for his crosses. So he knew that each parent line carried only one form of each trait.</p>
<p data-step="3">Geneticists still keep collections of true-breeding lines for research.</p>`,
star:'True-breeding = homozygous: AA × AA gives only AA.',starStep:1,
scene(H){const s=ST();const gy=[74,170,266];
  const line=(x,col,g,t)=>{const G=H.g(s);gl(G,x,26,[[g+g,1],[' line',0]]);const it=gy.map((y,i)=>{const F=H.g(G);flower(F,x,y,18,col);
      chip(F,x-11,y+32,g,{w:18,par:'dad'});chip(F,x+11,y+32,g,{w:18,par:'mom'});if(i){const a=mkA(F,x,y-52,x,y-26,{w:1.6,h:6});F.a=a}H.O(F,0,{d:0});return F});G.it=it;return G};
  const LA=line(90,PURPLE,'A'),La=line(230,WHITEF,'a');
  const gA=H.g(s);lbs(gA,124,124,'only A','start','font-weight:700;fill:var(--ink)');lbs(gA,124,138,'gametes','start');H.O(gA,0,{d:0});
  H.E('line',{x1:316,y1:20,x2:316,y2:300,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  const M=H.g(s);gl(M,470,26,[['Aa',1],[' plant',0]]);flower(M,470,74,20,PURPLE);chip(M,459,106,'A',{w:18,par:'dad'});chip(M,481,106,'a',{w:18,par:'mom'});
  const ks=[[380,'A','A'],[440,'A','a'],[500,'a','A'],[560,'a','a']].map(([x,p,q],i)=>{const F=H.g(M);flower(F,x,214,17,i===3?WHITEF:PURPLE);chip(F,x-10,244,p,{w:17,par:'dad'});chip(F,x+10,244,q,{w:17,par:'mom'});H.O(F,0,{d:0});return F});
  const ma=[380,440,500,560].map(x=>mkA(M,470,124,x,190,{w:1.4,h:6}));lbs(M,470,282,'a mixture: 3 purple : 1 white');H.O(M,0,{d:0});
  const V=H.g(s);cap(V,20,334,'Mendel’s two-year test','start','fill:var(--ink)');
  const sq=[];for(let i=0;i<34;i++){const r=H.E('rect',{x:22+i*17.4,y:346,width:14,height:14,rx:3,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.2'},V);sq.push(r)}
  const vl=lb(V,20,390,'','start','font-size:14px');H.O(V,0,{d:0});
  const keep=[0,1,3,4,5,7,8,10,11,13,14,16,17,19,20,22,24,25,27,28,30,32];
  return [
    ()=>{LA.it.forEach((F,i)=>{H.O(F,1,{at:i*450});if(F.a)drawA(F.a,{at:i*450-200})})},
    ()=>{H.O(gA,1);La.it.forEach((F,i)=>{H.O(F,1,{at:i*450});if(F.a)drawA(F.a,{at:i*450-200})})},
    ()=>{H.O(M,1);ma.forEach(a=>drawA(a,{at:300}));ks.forEach((F,i)=>H.O(F,1,{at:800+i*150}))},
    ()=>{H.O(V,1);vl.textContent='34 varieties, 2 years: all bred true';H.after(1200,()=>{sq.forEach((r,i)=>{if(keep.includes(i)){r.style.transition='stroke .5s';r.style.stroke='var(--ink)';r.style.strokeWidth=2.4}else{r.style.transition='opacity .6s';r.style.opacity=.25}});vl.textContent='34 varieties, 2 years: all bred true → Mendel chose 22 for his crosses'})},
  ];}},

/* 14 ─────────────────────────────── */
{sec:'1.4',title:'A Monohybrid Cross: P, F1, F2',caption:'Flower-colour gene A. Blue = allele from the father plant, orange = from the mother plant. Last step: yellow marks every a allele.',
text:`<p data-step="0">Geneticists name the generations of a cross. The <b>P generation</b> (parental) is the first pair of parents. Mendel crossed a true-breeding purple line (<i>AA</i>) with a true-breeding white line (<i>aa</i>).</p>
<p data-step="1">Their offspring are the <b>F1 generation</b> (first filial generation; filial means <i>of a son or daughter</i>). Each F1 plant gets <i>A</i> from one parent and <i>a</i> from the other. All F1 plants are <i>Aa</i>, with purple flowers.</p>
<p data-step="2">A cross between two individuals that are heterozygous for one gene is a <b>monohybrid cross</b> (mono = one). Mendel self-pollinated the F1 plants. Self-pollination of an <i>Aa</i> plant is the cross <i>Aa</i> × <i>Aa</i>.</p>
<p data-step="3">Their offspring are the <b>F2 generation</b>. About 3 in 4 F2 plants are purple and 1 in 4 is white. White returns, because some F2 plants get <i>a</i> from both gametes.</p>
<p data-step="4">Later generations are F3, F4 and so on. The <i>a</i> allele passes through every generation, even when no plant shows it.</p>`,
star:'P: AA × aa → F1: all Aa, purple → F2: 3 purple : 1 white.',starStep:3,
scene(H){const s=ST();const Y={P:66,F1:196,F2:326};
  Object.entries(Y).forEach(([k,y])=>lb(s,30,y+8,k,'middle','font:900 24px var(--f-display)'));
  const pf=flower(s,200,Y.P,20,PURPLE),pm=flower(s,380,Y.P,20,WHITEF);lb(s,290,Y.P+6,'×','middle','font-size:20px');
  const pc=[chip(s,189,Y.P+32,'A',{w:18,par:'dad'}),chip(s,211,Y.P+32,'A',{w:18,par:'dad'}),chip(s,369,Y.P+32,'a',{w:18,par:'mom'}),chip(s,391,Y.P+32,'a',{w:18,par:'mom'})];
  lbs(s,200,Y.P-30,'father: true-breeding purple');lbs(s,380,Y.P-30,'mother: true-breeding white');
  const fx=[140,230,320,410];
  const F1=fx.map(x=>{const f=flower(s,x,Y.F1,18,PURPLE);hide(f);return f});
  const f1c=fx.map(x=>{const a=chip(s,200,Y.P+32,'A',{w:18,par:'dad'}),b=chip(s,380,Y.P+32,'a',{w:18,par:'mom'});H.O([a,b],0,{d:0});return [a,b,x]});
  const r1=lb(s,470,Y.F1+5,'all Aa · all purple','start');H.O(r1,0,{d:0});
  const self=H.g(s);H.E('path',{d:`M${fx[1]+18},${Y.F1+56} C${fx[1]+40},${Y.F1+80} ${fx[2]-40},${Y.F1+80} ${fx[2]-18},${Y.F1+56}`,st:'fill:none;stroke:var(--ink);stroke-width:1.6;stroke-dasharray:4 4'},self);
  lb(self,275,Y.F1+92,'Aa × Aa','middle',MATH+';font-size:16px');H.O(self,0,{d:0});
  const kg=[['A','A'],['A','a'],['a','A'],['a','a']];
  const F2=fx.map((x,i)=>{const f=flower(s,x,Y.F2,18,i===3?WHITEF:PURPLE);hide(f);return f});
  const f2c=kg.map(([p,q],i)=>{const a=chip(s,fx[1]-11,Y.F1+32,p,{w:18,par:'dad'}),b=chip(s,fx[2]+11,Y.F1+32,q,{w:18,par:'mom'});H.O([a,b],0,{d:0});return [a,b,fx[i]]});
  const r2=H.g(s);lb(r2,470,Y.F2-4,'3 purple : 1 white','start');lbs(r2,470,Y.F2+14,'1 AA : 2 Aa : 1 aa','start');H.O(r2,0,{d:0});
  const glow=[pc[2],pc[3]];
  return [
    ()=>{},
    ()=>{f1c.forEach(([a,b,x],i)=>{fly(a,x-11,Y.F1+32,{at:i*150});fly(b,x+11,Y.F1+32,{at:i*150})});F1.forEach((f,i)=>pop(f,{at:900+i*150}));H.O(r1,1,{at:1500})},
    ()=>{H.O(self,1)},
    ()=>{f2c.forEach(([a,b,x],i)=>{fly(a,x-11,Y.F2+32,{at:i*200});fly(b,x+11,Y.F2+32,{at:i*200})});F2.forEach((f,i)=>pop(f,{at:1000+i*200}));H.O(r2,1,{at:1800})},
    ()=>{const lit=[...glow,...f1c.map(c=>c[1]),...f2c.flatMap(([a,b])=>[a,b]).filter(c=>c.t.textContent==='a')];
      lit.forEach((c,i)=>hiChip(c,{at:i*70}))},
  ];}},

/* 15 ─────────────────────────────── */
{sec:'1.4',title:'Segregation Happens in Meiosis',caption:'One homologous pair of an Aa plant · blue homolog carries A, orange homolog carries a',
text:`<p data-step="0">Gametes form by <b>meiosis</b>, a cell division that halves the number of chromosomes. Meiosis starts in a diploid cell, the <b>meiocyte</b>. In an <i>Aa</i> plant, <i>A</i> is on one homologous chromosome and <i>a</i> is on the other.</p>
<p data-step="1">First, the cell copies each chromosome. A copied chromosome has two identical <b>sister chromatids</b>, so both sisters carry the same allele.</p>
<p data-step="2">In <b>Meiosis I</b>, the two homologous chromosomes pair. Then they move to opposite ends of the cell, and the cell divides. So <i>A</i> usually goes into one cell and <i>a</i> into the other.</p>
<p data-step="3">In <b>Meiosis II</b>, the sister chromatids separate, and each cell divides again. The result is four cells: two with <i>A</i> and two with <i>a</i>. Gametes form from these cells.</p>
<p data-step="4">So half the gametes carry <i>A</i> and half carry <i>a</i>. Mendel’s First Law, the <b>Law of Equal Segregation</b>, states this result: each gamete has an equal chance to get either allele.</p>
<p data-step="4" class="note">If homologs exchange a segment between the gene and the <b>centromere</b> (the point that joins sister chromatids), <i>A</i> and <i>a</i> separate in Meiosis II instead. Each gamete still gets one allele.</p>`,
star:'Segregation = homologs separate, usually in Meiosis I.',starStep:4,
scene(H){const s=ST();
  const A=H.cell(s,{x:320,y:196,r:128});
  const B=[195,445].map(x=>{const c=H.cell(s,{x,y:196,r:80.6});H.T(c,{r:90},{d:0});H.O(c,0,{d:0});return c});
  const bl=H.chromosome(s,{L1:30,L2:30,w:9,color:'dad',state:'single',x:280,y:200}),or=H.chromosome(s,{L1:30,L2:30,w:9,color:'mom',state:'single',x:360,y:200});
  const tA=chip(s,280,148,'A',{par:'dad',w:24}),ta=chip(s,360,148,'a',{par:'mom',w:24});
  const tA2=chip(s,280,148,'A',{par:'dad',w:24}),ta2=chip(s,360,148,'a',{par:'mom',w:24});H.O([tA2,ta2],0,{d:0});
  const lab=lb(s,320,362,'');lab.textContent='meiocyte with genotype Aa';
  const sum=H.g(s);lb(sum,320,404,'1/2 of the cells carry A · 1/2 carry a','middle','font-size:15px');H.O(sum,0,{d:0});
  function relax(c,dx,o){dx=dx||0;const xa=c.a._t.x-dx,xb=c.b._t.x+dx;H.T(c.a,{x:xa,sx:.001},o);H.T(c.b,{x:xb,sx:.001},o);H.T(c.ca,{x:xa},o);H.T(c.cb,{x:xb},o);H.O([c.ca,c.cb],0,o);}
  return [
    ()=>{},
    ()=>{H.setChr(bl,'x',{d:1200});H.setChr(or,'x',{d:1200});lab.textContent='each chromosome copied: sister chromatids';
      H.T(tA,{x:266},{d:900});H.T(ta,{x:346},{d:900});H.O([tA2,ta2],1,{at:500});H.T(tA2,{x:294},{d:900,at:500});H.T(ta2,{x:374},{d:900,at:500})},
    ()=>{H.T(bl,{x:303},{d:900});H.T(or,{x:337},{d:900});H.T(tA,{x:289},{d:900});H.T(tA2,{x:317},{d:900});H.T(ta,{x:323,y:252},{d:900});H.T(ta2,{x:351,y:252},{d:900});
      lab.textContent='Meiosis I: homologs pair, then separate';
      H.after(1000,()=>{H.cleave(A,125,.62,{d:1500});H.T(bl,{x:195},{d:1300});H.T(or,{x:445},{d:1300});
        H.T(tA,{x:181},{d:1300});H.T(tA2,{x:209},{d:1300});H.T(ta,{x:431,y:140},{d:1300});H.T(ta2,{x:459,y:140},{d:1300})})},
    ()=>{H.O(A,0,{d:0});B.forEach(c=>H.O(c,1,{d:0}));B.forEach(c=>H.cleave(c,78,.62,{d:1500}));lab.textContent='Meiosis II: sister chromatids separate';
      [[bl,195],[or,445]].forEach(([c,x])=>{H.T(c,{x,y:196,r:90},{d:700});H.after(650,()=>{H.setChr(c,'apart',{D:70,d:1200});H.after(1250,()=>relax(c,0,{d:700}))})});
      [[tA,261,117],[tA2,261,275],[ta,511,117],[ta2,511,275]].forEach(([c,x,y],i)=>H.T(c,{x,y},{d:1200,at:800}))},
    ()=>{lab.textContent='four cells: gametes form from them';H.O(sum,1);[tA,tA2,ta,ta2].forEach(c=>{H.T(c,{s:1.3},{d:300});H.after(400,()=>H.T(c,{s:1},{d:300}))})},
  ];}},

/* 16 ─────────────────────────────── */
{sec:'1.3',title:'Only Meiosis Separates Alleles',caption:'Model cells with one homologous pair · Aa = A on the blue homolog, a on the orange homolog',
text:`<p data-step="0">Body cells divide by <b>mitosis</b>. Mitosis copies each chromosome, then gives one copy of every chromosome to each of two daughter cells.</p>
<p data-step="1">So both daughter cells of an <i>Aa</i> cell are <i>Aa</i>: mitosis does not separate alleles.</p>
<p data-step="2">In meiosis, the two homologs of each pair attach to each other along their full length before they separate. Geneticists say that the homologs <b>pair up</b>, or <b>synapse</b>. A protein ladder, the <b>synaptonemal complex</b>, holds each pair together. Homologs do not pair in mitosis.</p>
<p data-step="3"><b>Meiosis I</b> separates the homologs and halves the chromosome number, so it is a <b>reductional</b> division. <b>Meiosis II</b> separates the sister chromatids and keeps the number, so it is an <b>equational</b> division.</p>
<p data-step="4">Sister chromatids are copies, so they start with the same alleles. Homologs can carry different alleles. So equal segregation of alleles happens only in meiosis.</p>`,
star:'Mitosis: Aa → Aa + Aa. Meiosis: Aa → A, A, a, a.',starStep:4,
scene(H){const s=ST();
  H.E('line',{x1:300,y1:16,x2:300,y2:404,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  cap(s,150,24,'Mitosis','middle','fill:var(--ink)');cap(s,470,24,'Meiosis','middle','fill:var(--ink)');
  const mc=(p,x,y,r,bars)=>{const G=at(p,x,y);H.E('circle',{r,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.4'},G);
    bars.forEach(([dx,c,L])=>{H.E('line',{x1:dx,y1:-r*.42,x2:dx,y2:r*.42,st:`stroke:var(--${c});stroke-width:${r>30?7:5};stroke-linecap:round`},G);
      chip(G,dx,-r*.42-(r>30?12:9),L,{par:c,w:r>30?18:14,sw:1.8})});return G};
  const AA=[[-10,'dad','A'],[10,'mom','a']];
  const L0=mc(s,150,92,42,AA);
  const LD=[[90,236],[210,236]].map(([x,y])=>{const c=mc(s,x,y,42,AA);hide(c);return c});const La=[mkA(s,140,140,100,182,{w:1.8,h:7}),mkA(s,160,140,200,182,{w:1.8,h:7})];
  const lm=lb(s,150,312,'Aa → Aa + Aa');const lm2=lbs(s,150,330,'both alleles stay together');H.O([lm,lm2],0,{d:0});
  const R0=mc(s,470,92,42,AA);
  const syn=H.g(s);for(let y=-12;y<=14;y+=6)H.E('line',{x1:-4,y1:y,x2:4,y2:y,st:'stroke:var(--muted);stroke-width:1.5'},syn);H.T(syn,{x:470,y:92},{d:0});H.O(syn,0,{d:0});
  const synL=H.g(s);H.E('path',{d:'M480,96 L540,66',st:'stroke:var(--ink);stroke-width:1.1'},synL);lbs(synL,544,64,'homologs pair','start');lbs(synL,544,78,'(synapsis)','start');H.O(synL,0,{d:0});
  const M1=[[420,196,[[0,'dad','A']]],[520,196,[[0,'mom','a']]]].map(([x,y,b])=>{const c=mc(s,x,y,30,b);hide(c);return c});
  const M2=[[388,'dad','A'],[442,'dad','A'],[498,'mom','a'],[552,'mom','a']].map(([x,c,L])=>{const g=mc(s,x,300,24,[[0,c,L]]);hide(g);return g});
  const a1=[mkA(s,458,136,430,160,{w:1.6,h:6}),mkA(s,482,136,510,160,{w:1.6,h:6})];
  const a2=[mkA(s,412,228,394,268,{w:1.4,h:6}),mkA(s,428,228,438,268,{w:1.4,h:6}),mkA(s,512,228,502,268,{w:1.4,h:6}),mkA(s,528,228,546,268,{w:1.4,h:6})];
  const t1=H.g(s);lbs(t1,312,150,'Meiosis I','start','font-weight:700;fill:var(--ink)');lbs(t1,312,164,'reductional','start');lbs(t1,312,250,'Meiosis II','start','font-weight:700;fill:var(--ink)');lbs(t1,312,264,'equational','start');H.O(t1,0,{d:0});
  const lr=lb(s,470,358,'Aa → A, A, a, a');const lr2=lbs(s,470,376,'A : a = 1 : 1');H.O([lr,lr2],0,{d:0});
  const bars=R0.querySelectorAll('line'),chips=[...R0.children].filter(c=>c.tagName==='g');
  return [
    ()=>{La.forEach(a=>drawA(a));LD.forEach((c,i)=>pop(c,{at:500+i*150}))},
    ()=>{H.O([lm,lm2],1)},
    ()=>{H.T(chips[0],{x:-20},{d:900});H.T(chips[1],{x:20},{d:900});bars[0].style.transition='transform .9s';bars[0].style.transform='translateX(6px)';bars[1].style.transition='transform .9s';bars[1].style.transform='translateX(-6px)';
      H.O(syn,1,{at:800});H.O(synL,1,{at:900})},
    ()=>{a1.forEach(a=>drawA(a));M1.forEach((c,i)=>pop(c,{at:400+i*150}));a2.forEach(a=>drawA(a,{at:1100}));M2.forEach((c,i)=>pop(c,{at:1500+i*120}));H.O(t1,1,{at:600})},
    ()=>{H.O([lr,lr2],1)},
  ];}},

/* 17 ─────────────────────────────── */
{sec:'1.5',title:'The Punnett Square',caption:'Aa × Aa · blue = gametes from the father, orange = gametes from the mother',
text:`<p data-step="0">A <b>Punnett square</b> is a grid that shows every way the gametes of two parents can combine. The British geneticist Reginald Punnett invented it in the early 1900s.</p>
<p data-step="1">Write the gametes of one parent along the top and the gametes of the other parent down the side. An <i>Aa</i> parent makes <i>A</i> gametes and <i>a</i> gametes in equal numbers.</p>
<p data-step="2">Each box joins the gamete above it with the gamete to its left. The four boxes are four equally likely offspring.</p>
<p data-step="3">Count the genotypes: 1 <i>AA</i> : 2 <i>Aa</i> : 1 <i>aa</i>. A ratio of genotypes is a <b>genotypic ratio</b>.</p>
<p data-step="4"><i>AA</i> and <i>Aa</i> plants both have purple flowers. So the <b>phenotypic ratio</b> (the ratio of phenotypes) is 3 purple : 1 white.</p>`,
star:'Monohybrid cross: 1 : 2 : 1 genotypes, 3 : 1 phenotypes.',starStep:4,
scene(H){const s=ST();const X0=230,Y0=140,C=110;const tx=[X0+C/2,X0+1.5*C],sy=[Y0+C/2,Y0+1.5*C];
  const grid=H.E('path',{d:`M${X0},${Y0} H${X0+2*C} V${Y0+2*C} H${X0} Z M${X0+C},${Y0} V${Y0+2*C} M${X0},${Y0+C} H${X0+2*C}`,pathLength:1,cls:'draw k',st:'stroke-width:2'},s);
  const fc=cellC(s,340,42,30,'dad');chip(fc,-12,0,'A',{par:'dad',w:20});chip(fc,12,0,'a',{par:'dad',w:20});gl(s,380,47,[['Father ',0],['Aa',1]],'start','fill:var(--dad)');
  const mc=cellC(s,70,250,30,'mom');chip(mc,-12,0,'A',{par:'mom',w:20});chip(mc,12,0,'a',{par:'mom',w:20});gl(s,70,208,[['Mother ',0],['Aa',1]],'middle','fill:var(--mom)');
  const fl=['A','a'];
  const tg=tx.map(x=>{const c=cellC(s,x,108,18,null,{w:2});hide(c);return c}),sg=sy.map(y=>{const c=cellC(s,196,y,18,null,{w:2});hide(c);return c});
  const tch=fl.map((L,i)=>{const c=chip(s,340+(i?12:-12),42,L,{par:'dad',w:20});H.O(c,0,{d:0});return c}),sch=fl.map((L,i)=>{const c=chip(s,70+(i?12:-12),250,L,{par:'mom',w:20});H.O(c,0,{d:0});return c});
  const halves=H.g(s);lbs(halves,tx[0],86,'1/2');lbs(halves,tx[1],86,'1/2');lbs(halves,168,sy[0]+4,'1/2','end');lbs(halves,168,sy[1]+4,'1/2','end');H.O(halves,0,{d:0});
  const box=[];[0,1].forEach(r=>[0,1].forEach(c=>{const cx=tx[c],cy=sy[r];const g=fl[c]+fl[r];const rec=g==='aa';
    const bg=H.E('rect',{x:X0+c*C+4,y:Y0+r*C+4,width:C-8,height:C-8,rx:6,st:'fill:var(--hi);opacity:0'},s);s.insertBefore(bg,grid);
    const a=chip(s,tx[c],108,fl[c],{par:'dad',w:24}),b=chip(s,196,sy[r],fl[r],{par:'mom',w:24});H.O([a,b],0,{d:0});
    const f=flower(s,cx,cy+22,17,rec?WHITEF:PURPLE);hide(f);box.push({a,b,f,bg,cx,cy,g,rec})}));
  const T=H.g(s);cap(T,474,150,'Genotypes','start','fill:var(--ink)');
  [['1','AA'],['2','Aa'],['1','aa']].forEach(([n,g],i)=>{lb(T,474,182+i*28,n,'start','font-size:18px');rt(T,494,182+i*28,g,'mt',{st:'font-size:18px'})});H.O(T,0,{d:0});
  const P=H.g(s);cap(P,474,284,'Phenotypes','start','fill:var(--ink)');flower(P,486,316,13,PURPLE);lb(P,506,321,'3 purple','start');flower(P,486,350,13,WHITEF);lb(P,506,355,'1 white','start');H.O(P,0,{d:0});
  return [
    ()=>{H.D(grid,1,{d:1000})},
    ()=>{tg.forEach((c,i)=>pop(c,{at:i*120}));sg.forEach((c,i)=>pop(c,{at:i*120}));tch.forEach((c,i)=>fly(c,tx[i],108,{at:300+i*120}));sch.forEach((c,i)=>fly(c,196,sy[i],{at:300+i*120}));H.O(halves,1,{at:1200})},
    ()=>{box.forEach((b,i)=>{fly(b.a,b.cx-14,b.cy-20,{at:i*300});fly(b.b,b.cx+14,b.cy-20,{at:i*300});pop(b.f,{at:900+i*300})})},
    ()=>{H.O(T,1)},
    ()=>{H.O(P,1);box.forEach(b=>{if(b.rec)H.O(b.bg,.35)})},
  ];}},

/* 18 ─────────────────────────────── */
{sec:'1.5',title:'Probability in the Punnett Square',caption:'Branch diagram for Aa × Aa · blue = allele from the father, orange = allele from the mother',
text:`<p data-step="0">A Punnett square also gives the probability of each offspring. A <b>probability</b> is a number from 0 (the event never happens) to 1 (it always happens).</p>
<p data-step="1">Half the gametes of an <i>Aa</i> father carry <i>A</i>. So the probability that his gamete carries <i>A</i> is 1/2. The same is true for the mother.</p>
<p data-step="2">The two gametes form independently: the allele in the sperm does not affect the allele in the egg. For the probability that two events both happen, multiply: the probability of <i>AA</i> is 1/2 × 1/2 = 1/4.</p>
<p data-step="3"><i>Aa</i> forms in two ways: <i>A</i> from the father and <i>a</i> from the mother, or the reverse. When either of two events gives the result, add: 1/4 + 1/4 = 1/2.</p>
<p data-step="4">So the probability of a purple offspring is 1/4 + 1/2 = 3/4. The probability of a white offspring is 1/4.</p>`,
star:'Both events: multiply. Either event: add.',starStep:3,
scene(H){const s=ST();const R=[36,206];const F=[[160,104,'A'],[160,300,'a']];
  const M=[[300,58,'A',0],[300,150,'a',0],[300,254,'A',1],[300,346,'a',1]];
  const root=H.g(s);H.E('circle',{cx:R[0],cy:R[1],r:7,cls:'kf'},root);
  const e1=F.map(([x,y])=>H.E('path',{d:`M${R[0]+6},${R[1]} L${x-16},${y}`,pathLength:1,cls:'draw k',st:'stroke-width:2'},s));
  const p1=F.map(([x,y])=>{const t=lb(s,(R[0]+x)/2-8,(R[1]+y)/2+(y<R[1]?-6:16),'1/2','middle','fill:var(--dad)');H.O(t,0,{d:0});return t});
  const fc=F.map(([x,y,L])=>{const c=chip(s,x,y,L,{par:'dad',w:26});hide(c);return c});
  const e2=M.map(([x,y,,k])=>H.E('path',{d:`M${F[k][0]+15},${F[k][1]} L${x-16},${y}`,pathLength:1,cls:'draw k',st:'stroke-width:2'},s));
  const p2=M.map(([x,y,,k])=>{const t=lb(s,(F[k][0]+x)/2+2,(F[k][1]+y)/2+(y<F[k][1]?-6:16),'1/2','middle','fill:var(--mom)');H.O(t,0,{d:0});return t});
  const mcc=M.map(([x,y,L])=>{const c=chip(s,x,y,L,{par:'mom',w:26});hide(c);return c});
  const out=M.map(([x,y,L,k])=>{const G=H.g(s);const g=F[k][2]+L;chip(G,346,y,F[k][2],{par:'dad',w:22});chip(G,370,y,L,{par:'mom',w:22});
    flower(G,404,y,12,g==='aa'?WHITEF:PURPLE);lb(G,426,y+5,'1/2 × 1/2 = 1/4','start','font-size:14px');H.O(G,0,{d:0});G.g=g;return G});
  const br=H.g(s);H.E('path',{d:'M552,150 L562,150 L562,254 L552,254',st:'fill:none;stroke:var(--ink);stroke-width:1.8'},br);lb(br,568,198,'Aa:','start','font-size:13px');lb(br,568,216,'1/4 + 1/4','start','font-size:13px');lb(br,568,234,'= 1/2','start','font-size:13px');H.O(br,0,{d:0});
  const NL=H.g(s);const nx=v=>40+v*300,ny=398;H.E('line',{x1:nx(0),y1:ny,x2:nx(1),y2:ny,st:'stroke:var(--ink);stroke-width:2'},NL);
  [[0,'0'],[.25,'1/4'],[.5,'1/2'],[.75,'3/4'],[1,'1']].forEach(([v,t])=>{H.E('line',{x1:nx(v),y1:ny-5,x2:nx(v),y2:ny+5,st:'stroke:var(--ink);stroke-width:1.5'},NL);lbs(NL,nx(v),ny-10,t)});
  lbs(NL,nx(0),ny+18,'never','start');lbs(NL,nx(1),ny+18,'always','end');
  const mk=(v,col,t)=>{const G=H.g(s);H.E('circle',{cx:nx(v),cy:ny,r:7,st:`fill:${col};stroke:var(--ink);stroke-width:1.5`},G);lb(G,nx(v),ny+20,t,'middle','font-size:12px');H.O(G,0,{d:0});return G};
  const mW=mk(.25,WHITEF,'white'),mP=mk(.75,PURPLE,'purple');
  const sum=H.g(s);lb(sum,630,392,'purple: 1/4 + 1/2 = 3/4','end','font-size:14px');lb(sum,630,412,'white: 1/4','end','font-size:14px');H.O(sum,0,{d:0});
  return [
    ()=>{},
    ()=>{H.D(e1,1,{d:700});fc.forEach((c,i)=>pop(c,{at:500+i*100}));H.O(p1,1,{at:700})},
    ()=>{H.D(e2,1,{d:700});mcc.forEach((c,i)=>pop(c,{at:500+i*100}));H.O(p2,1,{at:700});out.forEach((G,i)=>H.O(G,1,{at:1000+i*150}))},
    ()=>{H.O(br,1)},
    ()=>{H.O(sum,1);H.O(mW,1,{at:300});H.O(mP,1,{at:500})},
  ];}},

/* 19 ─────────────────────────────── */
{sec:'1.5',title:'Mendel’s Real Counts',caption:'Mendel’s F2 counts, published 1866 · ratio = dominant count ÷ recessive count',
text:`<p data-step="0">Mendel did a monohybrid cross for each of his seven traits. In every F2 generation, the dominant form outnumbered the recessive form by about 3 to 1.</p>
<p data-step="1"><b>Seed shape.</b> 5474 round and 1850 wrinkled seeds: 5474 ÷ 1850 = 2.96.</p>
<p data-step="2"><b>Seed colour.</b> 6022 yellow and 2001 green seeds: 6022 ÷ 2001 = 3.01.</p>
<p data-step="3"><b>All seven traits.</b> 14 949 dominant and 5010 recessive: a ratio of 2.98. The dominant forms are round, yellow, purple, inflated, green pod, axial and tall.</p>
<p data-step="4">No trait gives exactly 3 : 1, because each offspring forms from a random sperm and a random egg. Large counts are near the expected ratio.</p>`,
star:'All seven traits gave ratios near 3 : 1.',starStep:4,
scene(H){const s=ST();const X0=156,W=280,Y0=60,DY=38;
  const D=[['Seed shape',5474,1850],['Seed colour',6022,2001],['Flower colour',705,224],['Pod shape',882,299],['Pod colour',428,152],['Flower position',651,207],['Stem length',787,277]];
  const T=['All seven',14949,5010];
  cap(s,X0-8,34,'Trait','end');cap(s,X0,34,'Dominant  ·  recessive','start');cap(s,448,34,'Counts','start');cap(s,630,34,'Ratio','end');
  const ref=H.g(s);H.E('line',{x1:X0+W*.75,y1:44,x2:X0+W*.75,y2:392,st:'stroke:var(--ink);stroke-width:1.5;stroke-dasharray:4 4'},ref);lbs(ref,X0+W*.75,406,'3 : 1 (75% dominant)');
  const ex=lb(s,630,406,'expected: 3.00','end','font-size:13px;fill:var(--good)');H.O(ex,0,{d:0});
  const rows=[...D,T].map(([n,d,r],i)=>{const y=i<7?Y0+i*DY:Y0+7*DY+14;const G=H.g(s);lb(G,X0-8,y+5,n,'end',i===7?'font-size:14px':'font-size:13px');
    H.E('rect',{x:X0,y:y-11,width:W,height:22,rx:4,st:'fill:none;stroke:var(--faint);stroke-width:1.2'},G);
    const bd=H.E('rect',{x:0,y:y-11,width:1,height:22,cls:'nss',st:'fill:var(--muted)'},G),brc=H.E('rect',{x:0,y:y-11,width:1,height:22,cls:'nss',st:'fill:var(--hi)'},G);
    H.T(bd,{x:X0,sx:.001},{d:0});H.T(brc,{x:X0+W,sx:.001},{d:0});
    const c=lbs(G,448,y+4,'','start','fill:var(--ink)');const q=lb(G,630,y+5,'','end',i===7?'font-size:15px':'font-size:14px');H.O(G,0,{d:0});
    return {G,bd,brc,c,q,d,r,f:d/(d+r)}});
  if(true){const l=H.g(s);H.E('line',{x1:X0-120,y1:Y0+6.5*DY+7,x2:630,y2:Y0+6.5*DY+7,st:'stroke:var(--ink);stroke-width:1.2'},l)}
  const show=(o,at)=>{H.O(o.G,1,{at});H.T(o.bd,{sx:W*o.f},{d:1000,at});H.T(o.brc,{x:X0+W*o.f,sx:W*(1-o.f)},{d:1000,at});
    const nf=v=>v>=10000?String(v).replace(/(\d{2})(\d{3})$/,'$1 $2'):String(v);o.c.textContent=nf(o.d)+' : '+nf(o.r);const p={set textContent(v){o.q.textContent=v}};H.count(p,1,o.d/o.r,{d:1000,at,fmt:v=>v.toFixed(2)})};
  return [()=>{},()=>show(rows[0],0),()=>show(rows[1],0),()=>{rows.slice(2).forEach((o,i)=>show(o,i*180))},
    ()=>{H.O(ex,1);H.T(ref,{s:1},{d:0});const l=ref.firstChild;l.style.transition='stroke-width .6s';l.style.strokeWidth=3}];}},

/* 20 ─────────────────────────────── */
{sec:'1.5',title:'Chance and Small Families',caption:'Left: exact probabilities for families of 4 offspring · right: a computer simulation that adds Aa × Aa offspring one at a time; each mark on the axis is 4 times the previous one',
text:`<p data-step="0">A ratio of 3 : 1 is an average. The ratio describes probabilities, not the exact counts in each family.</p>
<p data-step="1">Each offspring of <i>Aa</i> × <i>Aa</i> has a probability of 1/4 to show the recessive phenotype. The result for one offspring does not depend on the results for its siblings.</p>
<p data-step="2">In families of four offspring, only about 42% have exactly 1 recessive offspring. About 32% have no recessive offspring at all.</p>
<p data-step="3">The probability that all four are recessive is 1/4 × 1/4 × 1/4 × 1/4 = 1/256. Rare results do occur, especially in small families.</p>
<p data-step="4">With thousands of offspring, the share of recessive offspring is near 1/4. For this reason, Mendel counted large numbers of offspring.</p>`,
star:'Small samples vary. Large samples are near 3 : 1.',starStep:4,
scene(H){const s=ST();
  const kids=[50,110,170,230].map(x=>{const G=at(s,x,44);H.E('circle',{r:19,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},G);H.txt(G,0,6,'?','lb',{'text-anchor':'middle',st:'font-size:18px'});
    const t=lbs(G,0,38,'1/4 white','middle','font-weight:700;fill:var(--ink)');H.O(t,0,{d:0});G.t=t;hide(G);return G});
  const base=340,S=3.5;const P=[81,108,54,12,1].map(v=>v/256);
  const BA=H.g(s);H.E('line',{x1:24,y1:base,x2:300,y2:base,st:'stroke:var(--ink);stroke-width:2'},BA);cap(BA,24,128,'Families of 4 offspring','start','fill:var(--ink)');
  lbs(BA,162,base+42,'number of recessive offspring');H.O(BA,0,{d:0});
  const bars=P.map((p,k)=>{const x=40+k*54;const G=H.g(s);const r=H.E('rect',{x:0,y:-1,width:40,height:1,cls:'nss',st:'fill:var(--muted)'},G);H.T(r,{x,y:base,sy:.001},{d:0});
    const t=lb(G,x+20,base-p*100*S-8,(p*100).toFixed(p<.01?1:0)+'%','middle','font-size:13px');if(k===4){t.setAttribute('x',x+24);}H.O(t,0,{d:0});lbs(G,x+20,base+18,String(k));H.O(G,0,{d:0});return {G,r,t,h:p*100*S}});
  const c4=H.g(s);lb(c4,280,base-34,'= 1/256','middle','font-size:13px;fill:var(--bad)');H.O(c4,0,{d:0});
  // convergence
  const CX0=360,CX1=620,CY0=90,CY1=340;const lx=n=>CX0+(Math.log2(n)-2)/11*(CX1-CX0),ly=f=>CY1-f/.6*(CY1-CY0);
  const CV=H.g(s);cap(CV,CX0,58,'Share of recessive offspring','start','fill:var(--ink)');
  H.E('line',{x1:CX0,y1:CY1,x2:CX1,y2:CY1,st:'stroke:var(--ink);stroke-width:2'},CV);H.E('line',{x1:CX0,y1:CY0,x2:CX0,y2:CY1,st:'stroke:var(--ink);stroke-width:2'},CV);
  [0,.25,.5].forEach(f=>lbs(CV,CX0-6,ly(f)+4,f===0?'0':f===.25?'1/4':'1/2','end'));
  H.E('line',{x1:CX0,y1:ly(.25),x2:CX1,y2:ly(.25),st:'stroke:var(--good);stroke-width:1.5;stroke-dasharray:5 4'},CV);
  [4,16,64,256,1024,4096].forEach(n=>lbs(CV,lx(n),CY1+18,String(n)));lbs(CV,(CX0+CX1)/2,CY1+42,'number of offspring');
  let seedv=7;const rnd=()=>{seedv=(seedv*1103515245+12345)%2147483648;return seedv/2147483648};
  let rec=0,pts=[];for(let n=1;n<=8192;n++){if(rnd()<.25)rec++;if(n>=4&&(n<64||n%16===0))pts.push([lx(n),ly(rec/n)])}
  const path=H.E('path',{d:'M'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L'),pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:2'},CV);
  const mp=H.g(CV);H.E('circle',{cx:lx(7324),cy:ly(1850/7324),r:6,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},mp);lb(mp,lx(7324)-4,ly(1850/7324)-14,'Mendel: 1850 of 7324','end','font-size:12px');H.O(mp,0,{d:0});
  H.O(CV,0,{d:0});
  return [
    ()=>{kids.forEach((k,i)=>pop(k,{at:i*120}))},
    ()=>{kids.forEach((k,i)=>H.O(k.t,1,{at:i*120}))},
    ()=>{H.O(BA,1);bars.forEach((b,i)=>{H.O(b.G,1,{at:i*100});H.T(b.r,{sy:b.h},{d:900,at:i*100});H.O(b.t,1,{at:700+i*100})});
      H.after(1000,()=>bars.forEach((b,i)=>{b.r.style.fill=i<2?'var(--ink)':'var(--muted)'}))},
    ()=>{bars.forEach((b,i)=>{b.r.style.fill=i===4?'var(--ink)':'var(--muted)'});H.O(c4,1)},
    ()=>{H.O(CV,1);H.D(path,1,{d:2200,at:300});H.O(mp,1,{at:2400})},
  ];}},

/* 21 ─────────────────────────────── */
{sec:'1.5',title:'Hidden Genotypes in the F2',caption:'Mendel’s F3 test of seed shape, published 1866 · arrows = self-pollination',
text:`<p data-step="0">Round F2 seeds look the same, but their genotypes differ. The Punnett square predicts that 1 in 3 round F2 seeds is <i>RR</i> and 2 in 3 are <i>Rr</i>.</p>
<p data-step="1">Mendel tested this prediction. He grew 565 plants from round F2 seeds and let each plant self-pollinate.</p>
<p data-step="2">193 plants gave only round seeds. They bred true, so they were <i>RR</i>.</p>
<p data-step="3">372 plants gave round and wrinkled seeds, in a ratio of about 3 : 1. So they were <i>Rr</i>.</p>
<p data-step="4">193 : 372 is about 1 : 2. The wrinkled F2 seeds are <i>rr</i>. So the F2 has 1 <i>RR</i> : 2 <i>Rr</i> : 1 <i>rr</i>, as the Punnett square predicts.</p>`,
star:'Dominant F2: 1/3 true-breeding, 2/3 heterozygous.',starStep:4,
scene(H){const s=ST();const y1=96,y2=222;
  cap(s,20,30,'Round F2 seeds','start','fill:var(--ink)');cap(s,250,30,'Seeds of each plant','start','fill:var(--ink)');
  const q=[[70,y1],[70,y2]].map(([x,y])=>{const G=H.g(s);seed(G,x,y,26,{});const t=lb(G,x,y+50,'RR or Rr?','middle','font-size:13px');G.t=t;return G});
  const sl=lbs(s,170,(y1+y2)/2+4,'565 plants');H.O(sl,0,{d:0});
  const ar=[mkA(s,110,y1,220,y1,{w:1.8,h:7}),mkA(s,110,y2,220,y2,{w:1.8,h:7})];
  const o1=[250,300,350,400].map(x=>{const e=seed(s,x,y1,16,{});hide(e);return e}),o2=[250,300,350,400].map((x,i)=>{const e=seed(s,x,y2,16,{wr:i===3});hide(e);return e});
  const n1=H.g(s);lb(n1,450,y1-6,'193 plants','start','font:900 22px var(--f-display)');lbs(n1,450,y1+14,'only round seeds: bred true','start');H.O(n1,0,{d:0});
  const n2=H.g(s);lb(n2,450,y2-6,'372 plants','start','font:900 22px var(--f-display)');lbs(n2,450,y2+14,'round and wrinkled, 3 : 1','start');H.O(n2,0,{d:0});
  const B=H.g(s);const bx=40,bw=560,f=193/565;H.E('rect',{x:bx,y:300,width:bw*f,height:30,rx:4,st:'fill:var(--muted);stroke:var(--ink);stroke-width:1.4'},B);
  H.E('rect',{x:bx+bw*f,y:300,width:bw*(1-f),height:30,rx:4,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.4'},B);
  lb(B,bx+bw*f/2,320,'193 RR','middle','fill:var(--paper)');lb(B,bx+bw*f+bw*(1-f)/2,320,'372 Rr','middle','fill:#16181d');
  lb(B,320,362,'193 : 372 = 1 : 1.93 ≈ 1 : 2','middle','font-size:16px');lbs(B,320,386,'with the wrinkled rr seeds: 1 RR : 2 Rr : 1 rr');H.O(B,0,{d:0});
  return [
    ()=>{},
    ()=>{ar.forEach(a=>drawA(a));H.O(sl,1,{at:300})},
    ()=>{o1.forEach((e,i)=>pop(e,{at:i*120}));H.O(n1,1,{at:500});q[0].t.textContent='RR'},
    ()=>{o2.forEach((e,i)=>pop(e,{at:i*120}));H.O(n2,1,{at:500});q[1].t.textContent='Rr'},
    ()=>{H.O(B,1)},
  ];}},

/* 22 ─────────────────────────────── */
{sec:'1.6',title:'The Test Cross',caption:'Unknown purple plant × white tester (aa) · blue = alleles from the unknown plant, orange = alleles from the tester',
text:`<p data-step="0">We cannot see a genotype directly. Because of dominance, a purple plant can be <i>AA</i> or <i>Aa</i>, and the two look the same.</p>
<p data-step="1">A <b>test cross</b> finds the genotype. Cross the unknown plant with a plant that is homozygous recessive (<i>aa</i>). The <i>aa</i> plant is the <b>tester</b>.</p>
<p data-step="2">The tester makes only <i>a</i> gametes. So the phenotype of each offspring shows the allele that it got from the unknown parent.</p>
<p data-step="3">If the unknown plant is <i>AA</i>, all its gametes carry <i>A</i>. All the offspring are <i>Aa</i>, with purple flowers.</p>
<p data-step="4">If the unknown plant is <i>Aa</i>, half its gametes carry <i>a</i>. Half the offspring are <i>Aa</i> (purple) and half are <i>aa</i> (white): a 1 : 1 ratio.</p>`,
star:'The tester gives only a, so the offspring show the unknown parent’s gametes.',starStep:2,
scene(H){const s=ST();
  H.E('line',{x1:320,y1:16,x2:320,y2:404,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  const panel=(x0,g)=>{const P={};const G=H.g(s);
    P.head=gl(G,x0+150,28,[['If the unknown is ',0],[g,1]]);H.O(P.head,0,{d:0});
    flower(G,x0+70,70,20,PURPLE);P.u1=chip(G,x0+58,104,'A',{par:'dad',w:20});P.u2=chip(G,x0+82,104,'?',{par:'dad',w:20});lbs(G,x0+70,132,'unknown');
    P.T=H.g(G);lb(P.T,x0+150,76,'×','middle','font-size:20px');flower(P.T,x0+230,70,20,WHITEF);chip(P.T,x0+218,104,'a',{par:'mom',w:20});chip(P.T,x0+242,104,'a',{par:'mom',w:20});lbs(P.T,x0+230,132,'tester');H.O(P.T,0,{d:0});
    const gx=[x0+120,x0+220],gy=180;P.grid=H.E('path',{d:`M${x0+70},${gy-12} H${x0+270} V${gy+100} H${x0+70} Z M${x0+170},${gy-12} V${gy+100}`,pathLength:1,cls:'draw k',st:'stroke-width:1.8'},G);
    P.sg=H.g(G);cellC(P.sg,x0+40,gy+44,15,null,{w:1.8});chip(P.sg,x0+40,gy+44,'a',{par:'mom',w:18});lbs(P.sg,x0+40,gy+76,'all a');H.O(P.sg,0,{d:0});
    const al=g==='AA'?['A','A']:['A','a'];
    P.tg=gx.map((x,i)=>{const c=chip(G,x0+(i?82:58),104,al[i],{par:'dad',w:20});H.O(c,0,{d:0});return c});P.gx=gx;
    P.box=gx.map((x,i)=>{const a=chip(G,x0+(i?82:58),104,al[i],{par:'dad',w:22}),b=chip(G,x0+40,gy+44,'a',{par:'mom',w:22});H.O([a,b],0,{d:0});
      const f=flower(G,x,gy+66,17,al[i]==='a'?WHITEF:PURPLE);hide(f);return {a,b,f,x,y:gy+26}});
    P.res=lb(G,x0+170,330,g==='AA'?'all purple':'1 purple : 1 white','middle','font-size:16px');P.res2=lbs(G,x0+170,350,g==='AA'?'→ the unknown is AA':'→ the unknown is Aa');H.O([P.res,P.res2],0,{d:0});
    P.al=al;return P};
  const L=panel(10,'AA'),R=panel(330,'Aa');
  const solve=P=>{H.O(P.head,1);P.u2.t.textContent=P.al[1];hiChip(P.u2);
    P.tg.forEach((c,i)=>fly(c,P.gx[i],156,{at:300+i*120}));P.box.forEach((b,i)=>{fly(b.a,b.x-12,b.y,{at:900+i*250});fly(b.b,b.x+12,b.y,{at:900+i*250});pop(b.f,{at:1600+i*250})});H.O([P.res,P.res2],1,{at:2200})};
  return [
    ()=>{},
    ()=>{[L,R].forEach(P=>H.O(P.T,1))},
    ()=>{[L,R].forEach(P=>{H.D(P.grid,1,{d:900});H.O(P.sg,1,{at:400})})},
    ()=>solve(L),
    ()=>solve(R),
  ];}},

/* 23 ─────────────────────────────── */
{sec:'1.6',title:'How Sure Is a Test Cross?',caption:'Unknown purple parent × white tester (aa) · bars: probability that an Aa parent gives only purple offspring',
text:`<p data-step="0">One white offspring proves that the unknown parent is <i>Aa</i>. A white offspring is <i>aa</i>, so it got an <i>a</i> from the unknown parent. An <i>AA</i> parent has no <i>a</i> to give.</p>
<p data-step="1">Purple offspring alone do not prove <i>AA</i>. An <i>Aa</i> parent also gives a purple offspring, with a probability of 1/2 each time.</p>
<p data-step="2">Let <i>n</i> be the number of purple offspring in a row. The probability that an <i>Aa</i> parent gives this result is 1/2 × 1/2 × … (<i>n</i> times), written (1/2)<sup><i>n</i></sup>. Each extra purple offspring halves it.</p>
<p data-step="3">After 7 purple offspring, this probability is 1/128, less than 1%. An <i>Aa</i> parent rarely gives 7 purple offspring in a row, so <i>AA</i> is much more likely.</p>`,
star:'One recessive offspring proves Aa. Many dominant offspring in a row make AA much more likely.',starStep:3,
scene(H){const s=ST();
  const T=H.g(s);flower(T,60,70,19,PURPLE);chip(T,49,102,'A',{par:'dad',w:18});chip(T,71,102,'?',{par:'dad',w:18});lb(T,110,76,'×','middle','font-size:18px');
  flower(T,160,70,19,WHITEF);chip(T,149,102,'a',{par:'mom',w:18});chip(T,171,102,'a',{par:'mom',w:18});
  const ta=mkA(T,200,70,250,70,{w:1.8,h:7});const wf=flower(T,286,70,19,WHITEF);const k1=chip(T,275,102,'a',{par:'dad',w:18}),k2=chip(T,297,102,'a',{par:'mom',w:18});
  lb(T,330,66,'a white offspring got','start','font-size:14px');lb(T,330,86,'a from the unknown','start','font-size:14px');lb(T,330,110,'→ the unknown is Aa','start','font-size:14px;fill:var(--bad)');
  const base=372,X0=70,BW=58,HMAX=170;
  const BG=H.g(s);H.E('line',{x1:40,y1:base,x2:600,y2:base,st:'stroke:var(--ink);stroke-width:2'},BG);cap(BG,40,150,'If all offspring are purple','start','fill:var(--ink)');lbs(BG,320,base+36,'number of purple offspring in a row');H.O(BG,0,{d:0});
  const bars=[1,2,3,4,5,6,7].map(n=>{const x=X0+(n-1)*76;const G=H.g(s);const p=Math.pow(.5,n);
    const r=H.E('rect',{x:0,y:-1,width:BW,height:1,cls:'nss',st:'fill:var(--muted)'},G);H.T(r,{x,y:base,sy:.001},{d:0});
    const t=lb(G,x+BW/2,base-p*2*HMAX-8,'1/'+(1/p),'middle','font-size:13px');H.O(t,0,{d:0});
    lbs(G,x+BW/2,base+18,String(n));H.O(G,0,{d:0});return {G,r,t,h:p*2*HMAX}});
  const one=H.g(s);lb(one,X0+6*76+BW/2,base-34,'less than 1%','middle','font-size:13px;fill:var(--bad)');H.O(one,0,{d:0});
  H.O(T,0,{d:0});[wf,k1,k2].forEach(e=>H.O(e,0,{d:0}));
  const grow=(o,at)=>{H.O(o.G,1,{at});H.T(o.r,{sy:o.h},{d:800,at});H.O(o.t,1,{at:at+600})};
  return [
    ()=>{H.O(T,1);drawA(ta,{at:400});H.O(wf,1,{at:900});H.O([k1,k2],1,{at:1000});hiChip(k1,{at:1300})},
    ()=>{H.O(BG,1);grow(bars[0],0)},
    ()=>{grow(bars[1],0);grow(bars[2],300)},
    ()=>{bars.slice(3).forEach((o,i)=>grow(o,i*250));H.O(one,1,{at:1300})},
  ];}},

/* 24 ─────────────────────────────── */
{sec:'1.5–1.6',title:'Single-Gene Crosses and Their Results',wide:true,steps:3,
text:`<p data-step="0">Every single-gene cross follows from the gametes. List the gametes of each parent, combine them, and count. The table uses <i>A</i> (dominant) and <i>a</i> (recessive).</p>
<div class="tblwrap" data-step="0"><table class="tbl"><thead><tr><th>Cross</th><th>Gametes</th><th>Offspring genotypes</th><th>Offspring phenotypes</th><th>Name or use</th></tr></thead>
<tbody>
<tr><td><i>AA</i> × <i>AA</i></td><td>all <i>A</i> · all <i>A</i></td><td>all <i>AA</i></td><td>all dominant</td><td>true-breeding line</td></tr>
<tr><td><i>aa</i> × <i>aa</i></td><td>all <i>a</i> · all <i>a</i></td><td>all <i>aa</i></td><td>all recessive</td><td>true-breeding line</td></tr>
<tr><td><i>AA</i> × <i>aa</i></td><td>all <i>A</i> · all <i>a</i></td><td>all <i>Aa</i></td><td>all dominant</td><td>P cross that makes the F1</td></tr>
</tbody><tbody data-step="1">
<tr><td><i>AA</i> × <i>Aa</i></td><td>all <i>A</i> · ½ <i>A</i>, ½ <i>a</i></td><td>1 <i>AA</i> : 1 <i>Aa</i></td><td>all dominant</td><td>hidden <i>a</i> in half the offspring</td></tr>
<tr><td><i>Aa</i> × <i>Aa</i></td><td>½ <i>A</i>, ½ <i>a</i> · ½ <i>A</i>, ½ <i>a</i></td><td>1 <i>AA</i> : 2 <i>Aa</i> : 1 <i>aa</i></td><td>3 dominant : 1 recessive</td><td>monohybrid cross (F1 × F1)</td></tr>
</tbody><tbody data-step="2">
<tr><td><i>Aa</i> × <i>aa</i></td><td>½ <i>A</i>, ½ <i>a</i> · all <i>a</i></td><td>1 <i>Aa</i> : 1 <i>aa</i></td><td>1 dominant : 1 recessive</td><td>test cross of a heterozygote</td></tr>
</tbody></table></div>
<p data-step="2" class="note">A cross with a recessive parent (<i>aa</i>) shows the gametes of the other parent directly. The test cross uses this rule.</p>`,
star:'3 : 1 → both parents Aa. 1 : 1 → Aa × aa. All dominant → at least one parent AA.',starStep:2},

/* 25 ─────────────────────────────── */
{sec:'1.1, 1.4',title:'From Classical to Molecular Genetics',caption:'Timeline of events, 1866–1990',
text:`<p data-step="0"><b>Classical genetics</b> studies heredity with controlled crosses of model organisms, such as peas or fruit flies. </p>
<p data-step="1">In 1900, three botanists found Mendel’s ratios again. In 1909, the Danish botanist Wilhelm Johannsen named Mendel’s factors <b>genes</b>.</p>
<p data-step="2">From 1910, Thomas Hunt Morgan’s laboratory studied fruit flies. By 1913, Morgan’s group showed that genes sit on chromosomes, each at its own locus.</p>
<p data-step="3">Friedrich Miescher discovered DNA in 1869. In the 1940s, experiments showed that DNA carries the genetic information (the instructions of heredity). In 1953, James Watson and Francis Crick showed that DNA is a <b>double helix</b>: two strands that twist around each other. They used X-ray data from Rosalind Franklin.</p>
<p data-step="4"><b>Molecular genetics</b> studies heredity through DNA, RNA and proteins. <b>RNA</b> is a working copy of a gene that the cell uses to build a protein. In the early 1970s, enzymes that cut DNA at specific sequences let scientists copy genes inside bacteria. This method is <b>DNA cloning</b>.</p>
<p data-step="5">In 1990, DNA cloning revealed Mendel’s seed-shape gene.</p>`,
star:'Classical genetics: crosses. Molecular genetics: DNA.',starStep:4,
scene(H){const s=ST();const X=y=>30+(y-1860)*580/135,TY=286;
  const ax=H.g(s);H.E('line',{x1:24,y1:TY,x2:616,y2:TY,st:'stroke:var(--ink);stroke-width:2.5'},ax);
  [1860,1880,1900,1920,1940,1960,1980].forEach(y=>{H.E('line',{x1:X(y),y1:TY-5,x2:X(y),y2:TY+5,st:'stroke:var(--ink);stroke-width:1.5'},ax);lbs(ax,X(y),TY+22,String(y))});
  const band=(y0,y1,yy,t,col)=>{const G=H.g(s);H.E('rect',{x:X(y0),y:yy,width:X(y1)-X(y0),height:14,rx:7,st:`fill:${col};stroke:var(--ink);stroke-width:1.2`},G);lb(G,X(y0)+4,yy+30,t,'start','font-size:13px');H.O(G,0,{d:0});return G};
  const bC=band(1866,1995,TY+38,'classical genetics: crosses','var(--wash)'),bM=band(1953,1995,TY+80,'molecular genetics: DNA','var(--hi)');
  const ev=(y,lines,lvl,anchor,ddx)=>{const G=H.g(s);const yy=TY-24-(lvl-1)*64;
    H.E('circle',{cx:X(y),cy:TY,r:6,st:'fill:var(--ink);stroke:var(--paper);stroke-width:2'},G);
    H.E('line',{x1:X(y),y1:TY-8,x2:X(y),y2:yy+6,st:'stroke:var(--ink);stroke-width:1.1'},G);
    const dx=ddx!=null?ddx:anchor==='start'?-4:anchor==='end'?4:0;
    lines.forEach((t,i)=>H.txt(G,X(y)+dx,yy-(lines.length-1-i)*15,t,i?'lbs':'lb',{'text-anchor':anchor||'middle',st:i?'':'font-size:13px'}));H.O(G,0,{d:0});return G};
  const E66=ev(1866,['1866','Mendel’s paper'],2,'start');const E69=ev(1869,['1869','DNA found'],1,'start');
  const E00=ev(1900,['1900','rediscovery'],1,'end');const E09=ev(1909,['1909','“gene”'],2,'end',-6);
  const E10=ev(1910,['1910–1913','genes on','chromosomes'],3,'start');
  const E44=ev(1944,['1944','DNA = genetic','material'],1,'end');const E53=ev(1953,['1953','double helix'],2,'middle');
  const E73=ev(1973,['1973','DNA cloning'],1,'middle');const E90=ev(1990,['1990','seed-shape','gene found'],2,'end');
  return [
    ()=>{H.O(E66,1);H.O(bC,1,{at:300})},
    ()=>{H.O(E00,1);H.O(E09,1,{at:300})},
    ()=>{H.O(E10,1)},
    ()=>{H.O(E69,1);H.O(E44,1,{at:250});H.O(E53,1,{at:500})},
    ()=>{H.O(E73,1);H.O(bM,1,{at:300})},
    ()=>{H.O(E90,1)},
  ];}},

/* 26 ─────────────────────────────── */
{sec:'1.7',title:'Summary',wide:true,steps:2,
text:`<div class="cols" data-step="0"><div><h3>Genes and alleles</h3><ul>
<li>Mendel showed that heredity uses separate units (his factors, now called genes) that affect specific traits. A gene is a unit of inheritance.</li>
<li>Homologous chromosomes carry the same genes in the same order, but not always the same alleles. Sister chromatids start with the same alleles.</li>
<li>A diploid individual has up to two different alleles at one locus.</li>
<li>Phenotype depends on the alleles, their dominance, and sometimes the environment and other genes.</li>
<li>A recessive allele is often a broken copy. One working copy usually makes enough protein, so the working allele is dominant.</li>
</ul></div><div><h3>Segregation and crosses</h3><ul>
<li>Homologous chromosomes pair (synapse) in meiosis, but not in mitosis.</li>
<li>The two alleles of a gene separate equally into gametes, usually in Meiosis I. Mendel’s First Law, the Law of Equal Segregation, states this rule.</li>
<li>Aa × Aa gives 1 AA : 2 Aa : 1 aa, and 3 dominant : 1 recessive.</li>
<li>Classical geneticists use true-breeding lines, monohybrid crosses, Punnett squares, test crosses and reciprocal crosses.</li>
</ul></div></div>
<div data-step="1" class="cols"><div><h3>Ratios to remember</h3><ul>
<li>3 : 1 phenotypes → both parents heterozygous.</li>
<li>1 : 1 phenotypes → a test cross of a heterozygote.</li></ul></div><div><h3>&nbsp;</h3><ul>
<li>Probabilities: multiply when both events must happen. Add when either event gives the result.</li>
<li>Ratios are averages. Small families can differ widely from them.</li></ul></div></div>`},

/* 27 ─────────────────────────────── */
{sec:'1.8',title:'Key Terms',wide:true,steps:1,
text:`<div class="terms">
<div class="term"><b>Gregor Mendel</b>A monk in Brno (1822–1884) who discovered the basic laws of heredity by crosses of pea plants.</div>
<div class="term"><b>blending inheritance</b>An old, incorrect idea: the traits of two parents mix permanently, like paint.</div>
<div class="term"><b>particulate inheritance</b>Heredity through separate units (genes) that keep their identity in every generation.</div>
<div class="term"><b>gene · locus</b>A DNA segment for one product, usually a protein · the fixed place of a gene on its chromosome.</div>
<div class="term"><b>alleles</b>Different versions of one gene. A diploid individual has two alleles of each gene.</div>
<div class="term"><b>homozygous · heterozygous</b>Two identical alleles of a gene · two different alleles. A heterozygote is also a hybrid.</div>
<div class="term"><b>genotype · phenotype</b>The alleles of an individual · the traits that we can observe or measure.</div>
<div class="term"><b>dominant · recessive</b>The allele that sets the phenotype of a heterozygote · the allele that shows only in a homozygote.</div>
<div class="term"><b>wild type</b>The most common form of a trait in natural populations. Symbol: superscript +.</div>
<div class="term"><b>gametes</b>Sex cells (sperm cells and egg cells). Each gamete has one copy of each chromosome.</div>
<div class="term"><b>true-breeding line</b>A homozygous group of plants or animals whose offspring always show the same form of a trait.</div>
<div class="term"><b>P · F1 · F2</b>The parental generation · their offspring (first filial) · the offspring of the F1 (second filial).</div>
<div class="term"><b>monohybrid cross</b>A cross between two individuals that are heterozygous for one gene, Aa × Aa. The result is a 3 : 1 phenotypic ratio.</div>
<div class="term"><b>reciprocal cross</b>The same cross done twice, with the roles of mother and father swapped.</div>
<div class="term"><b>Mendel’s First Law · Law of Equal Segregation</b>The two alleles of a gene separate when gametes form. Each gamete gets either allele with a probability of 1/2.</div>
<div class="term"><b>Punnett square</b>A grid that combines every gamete of one parent with every gamete of the other parent.</div>
<div class="term"><b>test cross · tester</b>A cross of an individual of unknown genotype with a homozygous recessive individual · that recessive individual.</div>
<div class="term"><b>classical genetics</b>The study of heredity through controlled crosses of model organisms.</div>
<div class="term"><b>molecular genetics</b>The study of heredity through DNA, RNA and proteins.</div>
<div class="term"><b>DNA cloning</b>A method that copies a specific piece of DNA, usually inside bacteria.</div>
</div>`},

/* 28 ─────────────────────────────── */
{sec:'1.8',title:'Key Terms: Meiosis, Part 1',wide:true,steps:1,
text:`<p class="note">Meiosis is the cell division that makes gametes. The <a href="01-meiosis.html">Meiosis</a> deck (slides/01-meiosis.html) animates every stage.</p>
<div class="terms">
<div class="term"><b>meiocytes</b>Diploid cells (two sets of chromosomes) that divide by meiosis. Meiosis gives haploid cells, with one set.</div>
<div class="term"><b>Meiosis I · reductional</b>The first division. The two homologs of each pair separate, so the number of chromosome sets halves (2n → n).</div>
<div class="term"><b>Meiosis II · equational</b>The second division. The two sister chromatids (identical copies) of each chromosome separate. The cells stay at one set (n).</div>
<div class="term"><b>pair up · synapse</b>Early in Meiosis I, the two homologs of each pair attach to each other along their full length.</div>
<div class="term"><b>synaptonemal complex</b>The protein ladder that holds two paired homologs together.</div>
<div class="term"><b>bivalent</b>Two paired homologs. Each homolog has two chromatids, so a bivalent has four (also called a tetrad).</div>
<div class="term"><b>crossing over</b>Two chromatids from different homologs (non-sister chromatids) exchange matching segments of DNA.</div>
<div class="term"><b>chiasma · chiasmata</b>A point where two non-sister chromatids cross after crossing over · plural. Chiasmata hold the homologs together until Anaphase I.</div>
</div>`},

/* 29 ─────────────────────────────── */
{sec:'1.8',title:'Key Terms: Meiosis, Part 2',wide:true,steps:1,
text:`<p class="note">Each division of meiosis has four stages: prophase, metaphase, anaphase and telophase.</p>
<div class="terms">
<div class="term"><b>leptotene · zygotene</b>The first two of five substages of Prophase I, the first stage of Meiosis I. Leptotene: the chromosomes become thick enough to see. Zygotene: the homologs pair.</div>
<div class="term"><b>pachytene · diplotene · diakinesis</b>The last three substages of Prophase I. Pachytene: pairing is complete and crossing over occurs. Diplotene: the homologs move slightly apart, joined at chiasmata. Diakinesis: the membrane around the nucleus dissolves.</div>
<div class="term"><b>Metaphase I · Metaphase II</b>The paired homologs align across the middle of the cell · in Meiosis II, single chromosomes align there.</div>
<div class="term"><b>Anaphase I · Anaphase II</b>The homologs of each pair move to opposite ends (poles) of the cell · the sister chromatids move to opposite poles.</div>
<div class="term"><b>Telophase I · Telophase II</b>A nucleus forms at each pole and the cell divides: two cells after Telophase I, four cells after Telophase II.</div>
<div class="term"><b>interkinesis</b>The short pause between Meiosis I and Meiosis II. The cell does not copy its DNA again.</div>
<div class="term"><b>Prophase II</b>The first stage of Meiosis II. The chromosomes become thick again and the membrane around the nucleus dissolves.</div>
<div class="term"><b>polar bodies</b>In female animals, meiosis gives one large egg cell and three small cells, the polar bodies. Polar bodies do not become eggs.</div>
</div>`},

/* 30 ─────────────────────────────── */
{sec:'1.9–1.10',title:'Check Your Understanding',wide:true,steps:1,
text:`<div class="grid2">
<div class="qa"><div class="q">1. Mendel crossed true-breeding purple plants with true-breeding white plants. Then he self-pollinated the purple F1 plants. How would the results differ if heredity worked by blending inheritance instead of particulate inheritance?</div><button>Show answer</button><div class="a" hidden>With blending, the F1 flowers would have a colour in between, for example pale purple. The mixed factors could not separate again. So the F2 flowers would also be pale purple, and white flowers would never return. Mendel saw all-purple F1 plants and 1 white F2 plant for every 3 purple ones. So the factors stay separate.</div></div>
<div class="qa"><div class="q">2. An <b>autosome</b> is a chromosome that is not a sex chromosome (a chromosome that sets the sex, such as X or Y in humans). How many alleles of one autosomal gene can a normal gamete of a diploid individual carry? How many can the whole population of a species have?</div><button>Show answer</button><div class="a" hidden>A gamete carries one allele, because meiosis puts one homolog of each pair into each gamete. The diploid individual has up to two, one on each homolog. A population can have many alleles, because different individuals can carry different alleles. The size of the population sets the limit. For example, scientists know more than 2000 alleles of the human gene <i>CFTR</i>. A person with two broken copies of <i>CFTR</i> has the disease cystic fibrosis.</div></div>
<div class="qa"><div class="q">3. Mendel used homozygous lines as parents. How did he know that they were homozygous, and why was this important?</div><button>Show answer</button><div class="a" hidden>Mendel could not see genes or genotypes. He knew only that his lines were true-breeding. He grew each variety for two years, and its phenotype did not change over generations of self-pollination. A true-breeding line is homozygous, so each parent gave only one allele. So every F1 plant had to carry one allele from each parent. The purple F1 then showed that one allele can hide the other. The white F2 plants showed that the hidden allele was still there. If the parents were heterozygous, the F1 would already show both forms, and Mendel could not see that one allele hides the other.</div></div>
<div class="qa"><div class="q">4. Does equal segregation of alleles into daughter cells happen in mitosis, in meiosis, or in both?</div><button>Show answer</button><div class="a" hidden>Only in meiosis. In Meiosis I, the homologous chromosomes separate, so <i>A</i> usually goes into one cell and <i>a</i> into the other. Mitosis separates sister chromatids, which carry the same alleles. So each daughter cell of mitosis keeps both alleles of the parent cell (<i>Aa</i>).</div></div>
</div>`},

/* 31 ─────────────────────────────── */
{sec:'1.9–1.10',title:'Check Your Understanding: Dogs, Part 1',wide:true,steps:1,
text:`<p>In dogs, the allele for wiry hair (<i>W</i>) is dominant to the allele for smooth hair (<i>w</i>).</p>
<div class="grid2">
<div class="qa"><div class="q">a. You cross a homozygous wiry-haired dog with a smooth-haired dog. What are the genotype and the phenotype of the F1 dogs?</div><button>Show answer</button><div class="a" hidden>The cross is <i>WW</i> × <i>ww</i>. The <i>WW</i> parent makes only <i>W</i> gametes, and the <i>ww</i> parent makes only <i>w</i> gametes. So all F1 dogs are <i>Ww</i>, with wiry hair.</div></div>
<div class="qa"><div class="q">b. Two F1 dogs mate. What is the most likely ratio of hair phenotypes in their puppies?</div><button>Show answer</button><div class="a" hidden><i>Ww</i> × <i>Ww</i> gives 1 <i>WW</i> : 2 <i>Ww</i> : 1 <i>ww</i>. <i>WW</i> and <i>Ww</i> dogs have wiry hair, so the expected ratio is 3 wiry : 1 smooth.</div></div>
<div class="qa"><div class="q">c. Two <i>Ww</i> dogs had a litter of three puppies, and all three had smooth hair. How can you explain this result?</div><button>Show answer</button><div class="a" hidden>The 3 : 1 ratio is a probability, not a fixed count. Each puppy has a probability of 1/4 to be smooth, independently of the others. The probability that all three are smooth is 1/4 × 1/4 × 1/4 = 1/64, about 1.6%. Such results are rare, but they occur, especially in small litters. In the same way, some human families have only girls, although the expected ratio is 1 : 1.</div></div>
</div>`},

/* 32 ─────────────────────────────── */
{sec:'1.9–1.10',title:'Check Your Understanding: Dogs, Part 2',wide:true,steps:1,
text:`<p>In dogs, the allele for wiry hair (<i>W</i>) is dominant to the allele for smooth hair (<i>w</i>).</p>
<div class="grid2">
<div class="qa"><div class="q">d. Someone leaves a wiry-haired dog at your door. Without a DNA test, what is the easiest way to find its genotype?</div><button>Show answer</button><div class="a" hidden>Do a test cross: mate the dog with a smooth-haired dog (<i>ww</i>), the tester. If any puppy has smooth hair, the dog is <i>Ww</i>. If all puppies are wiry, the dog is probably <i>WW</i>. Each extra wiry puppy halves the probability that a <i>Ww</i> dog gives only wiry puppies. A <i>Ww</i> dog gives 7 wiry puppies in a row with a probability of only (1/2)<sup>7</sup> = 1/128.</div></div>
<div class="qa"><div class="q">e. From this information, can you tell which allele, if either, is the wild type?</div><button>Show answer</button><div class="a" hidden>No. A wild-type allele is the most common allele in natural populations. Dominance shows only which allele sets the phenotype of the heterozygote, not which allele is common. Many wild-type alleles are dominant, because many mutant alleles (changed alleles) are broken, recessive copies. But this rule has exceptions. In real dogs, a dominant allele of the gene <i>RSPO2</i> carries an extra piece of DNA and gives a wiry coat with a beard. Wolves, the wild relatives of dogs, do not carry this allele.</div></div>
</div>`},

]});
})();
