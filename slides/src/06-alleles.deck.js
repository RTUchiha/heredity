/* Chapter 6 · Alleles at a Single Locus · source: Hairdity.pdf ch. 6 (Singh, Introduction to Genetics, CC BY-NC-SA 4.0) */
(function(){
const H0=window.HL;
/* ---- deck-local helpers ---- */
function drawA(a,o){H0.D(a.firstChild,1,Object.assign({d:600},o));H0.O(a.lastChild,1,Object.assign({d:200},o,{at:((o&&o.at)||0)+450}));}
function mkA(p,x1,y1,x2,y2,o){const a=H0.arrow(p,x1,y1,x2,y2,o);H0.O(a.lastChild,0,{d:0});return a;}
function pop(e,o){H0.T(e,{s:1},Object.assign({d:700},o));H0.O(e,1,Object.assign({d:300},o));}
function hide(e){H0.T(e,{s:.001},{d:0});H0.O(e,0,{d:0});}
const stage=()=>document.getElementById('stage');
// group placed at x,y (draw children around 0,0)
function at(p,x,y,s){const G=H0.g(p);H0.T(G,{x,y,s:s==null?1:s},{d:0});return G;}
// tween any CSS paint (fill or stroke) to a raw CSS colour (allows color-mix)
function paint(e,prop,css,o){if(Array.isArray(e)){e.forEach(x=>paint(x,prop,css,o));return e}o=o||{};
  e.style.transitionDuration=(o.d!=null?o.d:600)+'ms';e.style.transitionDelay=(o.at||0)+'ms';e.style[prop]=css;return e;}
const fill=(e,c,o)=>paint(e,'fill',c,o);
// pigment colours (all mixed from theme tokens)
const PURPLE='color-mix(in srgb, var(--dad) 50%, var(--bad))';
const RED='var(--bad)', PINK='color-mix(in srgb, var(--bad) 42%, var(--card))', NOPIG='var(--card)';
const AMBER='color-mix(in srgb, var(--mom) 75%, var(--hi))', IRIS='color-mix(in srgb, var(--dad) 40%, var(--muted))';
// text with ^x or ^{xy} superscripts and _x subscripts
function rt(p,x,y,s,cls,a){const t=H0.E('text',Object.assign({x,y,cls:cls||'lb'},a||{}),p);
  s.split(/(\^\{[^}]*\}|\^.|_\{[^}]*\}|_.)/).forEach(part=>{if(!part)return;
    if(part[0]==='^'||part[0]==='_'){const v=part[1]==='{'?part.slice(2,-1):part.slice(1);
      H0.E('tspan',{'baseline-shift':part[0]==='^'?'super':'sub',st:'font-size:.68em',text:v},t);}
    else H0.E('tspan',{text:part},t);});return t;}
// enzyme glyph: a "pac-man" protein, centred on 0,0
function enzyme(p,x,y,o){o=o||{};const r=o.r||9;const G=at(p,x,y);
  const a=28*Math.PI/180;const body=H0.E('path',{d:`M0,0 L${r*Math.cos(a)},${-r*Math.sin(a)} A${r},${r} 0 1 0 ${r*Math.cos(a)},${r*Math.sin(a)} Z`,
    st:`fill:${o.fill||'var(--good)'};stroke:var(--ink);stroke-width:1.4;stroke-linejoin:round${o.broken?';stroke-dasharray:3 2':''}`},G);G.body=body;return G;}
// simple 5-petal flower, petals recolourable
function flower(p,x,y,r,col){const G=at(p,x,y);G.pet=[];for(let i=0;i<5;i++){const a=i*72;
    const e=H0.E('ellipse',{cx:0,cy:-r*.52,rx:r*.36,ry:r*.52,st:`fill:${col||NOPIG};stroke:var(--ink);stroke-width:1.6`},G);e.setAttribute('transform',`rotate(${a})`);G.pet.push(e);}
  H0.E('circle',{r:r*.2,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.4'},G);return G;}
// rounded photo with border; href is an @@asset@@ token
let CLIPN=0;
function photo(p,href,x,y,w,h,o){o=o||{};const id='clp'+(++CLIPN);const G=H0.g(p);
  const cp=H0.E('clipPath',{id},G);H0.E('rect',{x,y,width:w,height:h,rx:o.r!=null?o.r:10},cp);
  H0.E('image',{href,x,y,width:w,height:h,preserveAspectRatio:o.fit||'xMidYMid slice','clip-path':`url(#${id})`},G);
  H0.E('rect',{x,y,width:w,height:h,rx:o.r!=null?o.r:10,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},G);return G;}
// vertical unreplicated chromosome bar centred at x, from y0 to y1, with an optional allele band at yb
function chrom(p,x,y0,y1,color,o){o=o||{};const G=H0.g(p);const w=o.w||14;
  G.bar=H0.E('line',{x1:x,y1:y0,x2:x,y2:y1,st:`stroke:${H0.C(color)};stroke-width:${w};stroke-linecap:round`},G);
  if(o.band!=null){G.band=band(G,x,o.band,o.label||'',o.bfill,{w:w+12});}
  return G;}
function band(p,x,y,label,bfill,o){o=o||{};const G=at(p,x,y);const w=o.w||26,h=o.h||18;
  G.r=H0.E('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:4,st:`fill:${bfill||'var(--card)'};stroke:var(--ink);stroke-width:1.6`},G);
  G.t=rt(G,0,4.5,label,'lb',{'text-anchor':'middle',st:'font-size:12px'});return G;}

// dose-response layout shared by the complete- and incomplete-dominance slides
function doseScene(H,c){const s=stage();const ys=[92,200,308];const gx0=392,gx1=612,gy0=292,gy1=72;
  const X=v=>gx0+(gx1-gx0)*v,Y=v=>gy0-(gy0-gy1)*v;
  const hd=H.g(s);[[38,'GENOTYPE'],[100,'ALLELES'],[193,'PROTEIN'],[300,'FLOWER']].forEach(([x,t])=>H.txt(hd,x,36,t,'cap',{'text-anchor':'middle',st:'font-size:9.5px'}));
  const rows=c.rows.map((r,i)=>{const y=ys[i];const R={};
    R.lab=rt(s,34,y+7,r.g,'mt',{'text-anchor':'middle',st:'font-size:22px'});
    R.chips=H.g(s);r.a.forEach((al,k)=>{const x=79+k*40,ok=r.ok[k];const G=at(R.chips,x,y);
      H.E('rect',{x:-17,y:-14,width:34,height:28,rx:6,st:`fill:${ok?'var(--good)':'var(--card)'};stroke:var(--${k?'mom':'dad'});stroke-width:3${ok?'':';stroke-dasharray:4 3'}`},G);
      rt(G,0,6,al,'mt',{'text-anchor':'middle',st:`font-size:17px;fill:${ok?'var(--paper)':'var(--ink)'}`})});
    R.m=H.g(s);H.E('rect',{x:150,y:y-11,width:86,height:22,rx:4,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},R.m);
    R.bar=H.E('rect',{x:0,y:0,width:1,height:22,cls:'nss',st:'fill:var(--good)'},R.m);H.T(R.bar,{x:150,y:y-11,sx:.001},{d:0});
    R.pct=H.txt(R.m,193,y+30,Math.round(r.amt*100)+'%','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});
    R.ph=photo(s,r.img,262,y-38,76,76,{r:38});R.phl=H.txt(s,300,y+52,r.ph,'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});
    R.dot=H.E('circle',{r:7,st:`fill:${r.col};stroke:var(--ink);stroke-width:2`},s);H.T(R.dot,{x:236,y},{d:0});
    [R.lab,R.chips,R.m,R.ph,R.phl,R.dot].forEach(e=>H.O(e,0,{d:0}));R.r=r;return R});
  const gr=H.g(s);H.E('path',{d:`M${gx0},${gy1-12} L${gx0},${gy0} L${gx1+8},${gy0}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},gr);
  [0,.5,1].forEach(v=>{H.E('line',{x1:X(v),y1:gy0,x2:X(v),y2:gy0+6,st:'stroke:var(--ink);stroke-width:2'},gr);H.txt(gr,X(v),gy0+22,Math.round(v*100)+'%','lbs',{'text-anchor':'middle'})});
  H.txt(gr,(gx0+gx1)/2,gy0+44,'working protein (PP = 100%)'.replace('PP',c.top),'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});
  H.txt(gr,gx0-8,gy1-2,'full','lbs',{'text-anchor':'end'});H.txt(gr,gx0-8,gy0,'none','lbs',{'text-anchor':'end'});
  H.txt(gr,gx0,gy1-22,c.ylab,'lb',{st:'font-size:13px'});
  H.E('line',{x1:X(.5),y1:gy0,x2:X(.5),y2:gy1,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 4'},gr);
  let d='';for(let i=0;i<=60;i++){const v=i/60;d+=(i?' L':'M')+X(v).toFixed(1)+','+Y(c.f(v)).toFixed(1)}
  const curve=H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:3;stroke-linecap:round'},gr);H.O(gr,0,{d:0});
  const note=H.txt(s,X(.5)+(c.f(.5)>.8?8:14),Y(c.f(.5))+(c.f(.5)>.8?26:6),c.note,'lbs',{st:'fill:var(--ink);font-weight:700'});H.O(note,0,{d:0});
  const cross=H.g(s);c.cross.forEach((t,i)=>rt(cross,14,372+i*24,t,'lb',{st:'font-size:14px'}));H.O(cross,0,{d:0});
  return {rows,gr,curve,note,cross,X,Y,
    s0(){rows.forEach((R,i)=>{H.O(R.lab,1,{at:i*150});H.O(R.ph,1,{at:200+i*150});H.O(R.phl,1,{at:400+i*150})});},
    s1(){H.O(hd,1);rows.forEach((R,i)=>{H.O(R.chips,1,{at:i*150});H.O(R.m,1,{at:300+i*150});H.T(R.bar,{sx:Math.max(.001,86*R.r.amt)},{d:900,at:500+i*150})});},
    s2(){H.O(gr,1);H.D(curve,1,{d:1200,at:300});rows.forEach((R,i)=>{H.O(R.dot,1,{d:200,at:1300+i*250});H.T(R.dot,{x:X(R.r.amt),y:Y(c.f(R.r.amt))},{d:1100,at:1400+i*250})});H.O(note,1,{at:2400})},
    s4(){H.O(cross,1)}};}
const mono='font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:600';

deck({
docTitle:'Alleles at a Single Locus · Heredity Ch.6',
title:'Alleles at a Single Locus',
chapter:6,
eyebrow:'Heredity · Chapter 6 · Alleles at a Single Locus',
slides:[

/* 1 ─────────────────────────────── */
{sec:'6.1',title:'Alleles at a Single Locus',caption:'Blue = copy from the father · orange = copy from the mother',
text:`<p data-step="0">Each of your body cells has two copies of each chromosome. One copy came from your father and one from your mother.</p>
<p data-step="1">A gene sits at the same place on both copies. So each cell has two copies of each gene.</p>
<p data-step="2">Each gene copy carries the instructions for a protein. The two copies can differ in their DNA, so they can make different amounts or kinds of protein.</p>
<p data-step="3">The proteins from both copies act together and produce one trait, for example the colour of a flower.</p>
<p data-step="3">A single-gene trait depends on how much working protein the two copies make together, and on what that protein does. These two facts explain <b>dominance</b>: which copy sets the trait when the two copies differ.</p>`,
star:'Two copies in, one trait out.',starStep:3,
scene(H){const s=stage();
  const hd=[[110,'TWO GENE COPIES'],[330,'PROTEIN'],[535,'TRAIT']].map(([x,t])=>{const e=H.txt(s,x,40,t,'cap',{'text-anchor':'middle'});H.O(e,0,{d:0});return e});
  const cD=chrom(s,88,80,360,'dad',{w:16}),cM=chrom(s,132,80,360,'mom',{w:16});
  const bands=[band(s,88,170,'',  'var(--hi)',{w:30,h:22}),band(s,132,170,'','var(--hi)',{w:30,h:22})];bands.forEach(hide);
  const loc=H.g(s);H.E('path',{d:'M150,170 L188,170',cls:'k',st:'stroke-width:1.3'},loc);H.txt(loc,194,166,'same place,','lbs');H.txt(loc,194,181,'both copies','lbs');H.O(loc,0,{d:0});
  [cD,cM].forEach(c=>{H.T(c,{sy:.001},{d:0});c.style.transformOrigin='0 220px';H.O(c,0,{d:0})});
  // proteins
  const pool=[[300,180],[328,196],[356,178],[312,214],[344,226],[330,160]];
  const prots=pool.map((q,i)=>{const src=i%2?132:88;const e=enzyme(s,src,170,{r:11});H.O(e,0,{d:0});e.q=q;return e});
  const ar1=mkA(s,190,215,265,215,{w:1.8,h:7}),ar2=mkA(s,400,200,455,200,{w:1.8,h:7});
  const fl=flower(s,535,200,62,NOPIG);H.O(fl,0,{d:0});
  const tl=H.txt(s,535,300,'flower colour','lb',{'text-anchor':'middle'});H.O(tl,0,{d:0});
  const mt=H.g(s);H.txt(mt,330,300,'WORKING PROTEIN','cap',{'text-anchor':'middle'});
  H.E('rect',{x:250,y:312,width:160,height:26,rx:5,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},mt);
  const segs=[['dad',250],['mom',330]].map(([c,x])=>{const r=H.E('rect',{x:0,y:0,width:1,height:26,cls:'nss',st:`fill:var(--good);stroke:var(--ink);stroke-width:1.5`},mt);H.T(r,{x,y:312,sx:.001},{d:0});
    H.txt(mt,x+40,356,c==='dad'?'from copy 1':'from copy 2','lbs',{'text-anchor':'middle',st:`fill:var(--${c});font-weight:700`});return r});
  const pct=H.txt(mt,330,382,'','lb',{'text-anchor':'middle'});H.O(mt,0,{d:0});
  return [
    ()=>{H.O(hd[0],1);[cD,cM].forEach((c,i)=>{H.O(c,1,{d:300,at:i*200});H.T(c,{sy:1},{d:1000,at:i*200})})},
    ()=>{bands.forEach((b,i)=>pop(b,{at:i*200}));H.O(loc,1,{at:600})},
    ()=>{H.O(hd[1],1);H.O(loc,0,{d:300});drawA(ar1);prots.forEach((e,i)=>{H.O(e,1,{d:300,at:300+i*160});H.T(e,{x:e.q[0],y:e.q[1]},{d:1100,at:300+i*160})});
      H.O(mt,1,{at:900});segs.forEach((r,i)=>H.T(r,{sx:80},{d:900,at:1100+i*500}));pct.textContent='50% + 50% = 100%'},
    ()=>{H.O(hd[2],1);drawA(ar2);H.O(fl,1,{d:500,at:300});fill(fl.pet,PURPLE,{d:1200,at:800});H.O(tl,1,{at:1200})},
  ];}},

/* 2 ─────────────────────────────── */
{sec:'6.1 · 6.3',title:'Gene, Locus and Allele',caption:'Fruit-fly white gene · DNA letters are a schematic, not the real sequence',
text:`<p data-step="0"><b>Gene.</b> A <b>gene</b> is a segment of DNA that affects one or more traits. Many genes carry the code for a protein.</p>
<p data-step="1"><b>Locus.</b> A <b>locus</b> (plural <b>loci</b>) is the position of a gene on a chromosome. People often use the words gene and locus for the same thing. Locus names only the position.</p>
<p data-step="2"><b>Allele.</b> An <b>allele</b> is one form of a gene: one exact DNA sequence at the locus. A body cell has two copies of each chromosome, so it has two alleles of each gene. The two alleles can be the same or different.</p>
<p data-step="3">A population can have many alleles at one locus. These alleles form an <b>allelic series</b>. The most common allele in a natural population is the <b>wild-type</b> allele. Any allele with a different DNA sequence is a <b>variant</b>. Many variants look normal. A variant that changes the trait is a <b>mutant</b> allele.</p>`,
star:'Gene = the instructions. Locus = the address. Allele = the version.',starStep:2,
scene(H){const s=stage();const X0=40,X1=600,bx=320;
  const cD=H.E('line',{x1:X0,y1:46,x2:X1,y2:46,pathLength:1,cls:'draw',st:'stroke:var(--dad);stroke-width:14;stroke-linecap:round'},s);
  const other=[90,160,215,410,470,545].map(x=>H.E('rect',{x:x-6,y:39,width:12,height:14,rx:2,st:'fill:var(--card);opacity:.55'},s));H.O(other,0,{d:0});
  const gb=band(s,bx,46,'w','var(--hi)',{w:40,h:22});hide(gb);
  const cM=H.g(s);H.E('line',{x1:X0,y1:84,x2:X1,y2:84,st:'stroke:var(--mom);stroke-width:14;stroke-linecap:round'},cM);
  [90,160,215,410,470,545].forEach(x=>H.E('rect',{x:x-6,y:77,width:12,height:14,rx:2,st:'fill:var(--card);opacity:.55'},cM));
  band(cM,bx,84,'w','var(--hi)',{w:40,h:22});H.O(cM,0,{d:0});
  // zoom wedge + sequence
  const seqA='ATG GCC TAC GGA TTC',seqB='ATG GCC TAT GGA TTC';
  const zoom=H.g(s);H.E('path',{d:`M${bx-20},58 L120,112 M${bx+20},58 L520,112`,st:'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4;fill:none'},zoom);
  H.E('rect',{x:120,y:112,width:400,height:40,rx:8,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},zoom);
  H.txt(zoom,320,139,'… '+seqA+' …','lb',{'text-anchor':'middle',st:mono+';font-size:17px;letter-spacing:.06em;fill:var(--dad)'});H.O(zoom,0,{d:0});
  const gl=H.txt(s,528,138,'gene','lb');H.O(gl,0,{d:0});
  const pin=H.g(s);H.E('path',{d:`M${bx},22 L${bx},6`,cls:'k',st:'stroke-width:1.4'},pin);H.txt(pin,bx+8,16,'locus: one fixed position','lb');H.O(pin,0,{d:0});
  const s2=H.g(s);H.E('rect',{x:120,y:160,width:400,height:40,rx:8,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},s2);
  const tB=H.txt(s2,320,187,'','lb',{'text-anchor':'middle',st:mono+';font-size:17px;letter-spacing:.06em;fill:var(--mom)'});
  const pre='… '+seqB.slice(0,8),mid=seqB[8],post=seqB.slice(9)+' …';
  H.E('tspan',{text:pre},tB);H.E('tspan',{text:mid,st:'fill:var(--bad);text-decoration:underline'},tB);H.E('tspan',{text:post},tB);
  H.txt(s2,528,186,'2 alleles','lb');H.O(s2,0,{d:0});
  // allelic series: eyes
  const ser=[['w^+','wild type','red eye',RED],['w^+','variant: DNA differs','red eye',RED],['w^a','mutant · apricot','apricot eye',AMBER],['w','mutant · white','white eye',NOPIG]];
  const ttl=H.txt(s,320,240,'ALLELIC SERIES OF THE WHITE GENE · FRUIT FLY','cap',{'text-anchor':'middle'});H.O(ttl,0,{d:0});
  const eyes=ser.map(([sym,k,ph,col],i)=>{const x=95+i*150;const G=H.g(s);
    const head=at(G,x,310);H.E('ellipse',{rx:46,ry:34,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},head);
    H.E('ellipse',{cx:-24,cy:-4,rx:17,ry:21,st:`fill:${col};stroke:var(--ink);stroke-width:1.5`},head);H.E('ellipse',{cx:24,cy:-4,rx:17,ry:21,st:`fill:${col};stroke:var(--ink);stroke-width:1.5`},head);
    rt(G,x,370,sym,'lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:18px'});
    H.txt(G,x,390,k,'lbs',{'text-anchor':'middle'});H.txt(G,x,406,ph.replace('DNA differs · ',''),'lbs',{'text-anchor':'middle'});H.O(G,0,{d:0});return G});
  return [
    ()=>{H.D(cD,1,{d:900});H.O(other,.55,{at:500});pop(gb,{at:700});H.O(zoom,1,{at:1000});H.O(gl,1,{at:1200})},
    ()=>{H.O(pin,1)},
    ()=>{H.O(cM,1);H.O(s2,1,{at:400})},
    ()=>{H.O(ttl,1);eyes.forEach((e,i)=>H.O(e,1,{at:200+i*250}))},
  ];}},

/* 3 ─────────────────────────────── */
{sec:'6.1',title:'From Genotype to Phenotype',caption:'Gene → RNA → protein → trait · eye colour of the fruit fly as the example',
text:`<p data-step="0"><b>Transcription.</b> The cell copies a gene into <b>RNA</b>, a one-stranded molecule like DNA. The segment of DNA that the cell copies is the <b>transcription unit</b>.</p>
<p data-step="1"><b>Translation.</b> A <b>ribosome</b>, the protein-making machine of the cell, reads the RNA three letters at a time. Each group of three letters codes for one <b>amino acid</b>, a building block of proteins. The ribosome joins the amino acids in this order, and the chain folds into a protein.</p>
<p data-step="2"><b>Enzymes</b> are proteins that make one chemical reaction faster. Other proteins carry molecules: the fruit-fly protein WHITE carries pigment building blocks into the eye cells.</p>
<p data-step="3">The <b>genotype</b> is the set of alleles that an organism has. A written genotype usually lists only the loci under study and treats all other loci as wild type.</p>
<p data-step="4">The <b>phenotype</b> is the visible or detectable effect of the alleles, for example eye colour, behaviour or the risk of a disease.</p>
<p data-step="4">A body cell has two alleles of each gene, and both alleles can make products. The phenotype depends on how these products act together.</p>`,
star:'DNA → RNA → protein → trait.',starStep:4,
scene(H){const s=H.g(stage());H.T(s,{y:22},{d:0});const Y=150;
  // DNA with a gene
  const dna=H.g(s);H.E('line',{x1:20,y1:Y-5,x2:190,y2:Y-5,st:'stroke:var(--dad);stroke-width:4'},dna);H.E('line',{x1:20,y1:Y+5,x2:190,y2:Y+5,st:'stroke:var(--dad);stroke-width:4'},dna);
  H.E('rect',{x:62,y:Y-12,width:100,height:24,rx:4,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},dna);H.txt(dna,112,Y+5,'gene','lb',{'text-anchor':'middle',st:'font-size:13px;fill:#16181d'});
  H.E('path',{d:`M62,${Y-12} L62,${Y-30} L80,${Y-30}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},dna);H.E('path',{d:`M76,${Y-35} L82,${Y-30} L76,${Y-25}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},dna);
  H.txt(s,105,Y-58,'DNA','cap',{'text-anchor':'middle'});
  const tu=H.g(s);H.E('path',{d:`M62,${Y+22} L62,${Y+30} L162,${Y+30} L162,${Y+22}`,st:'fill:none;stroke:var(--ink);stroke-width:1.8'},tu);
  H.txt(tu,112,Y+48,'transcription unit','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});H.O(tu,0,{d:0});
  // RNA
  let d='M222,'+Y;for(let x=222;x<=330;x+=6)d+=` L${x},${Y+6*Math.sin((x-222)/6)}`;
  const rna=H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--mom);stroke-width:3.5;stroke-linecap:round'},s);
  const rl=H.txt(s,276,Y-58,'RNA','cap',{'text-anchor':'middle'});H.O(rl,0,{d:0});
  const a1=mkA(s,168,Y+0,215,Y+0,{w:1.6,h:6});const a1t=H.txt(s,192,Y-20,'','lbs',{'text-anchor':'middle'});
  const t1=H.txt(s,250,Y+34,'transcription','lbs',{'text-anchor':'middle'});H.O(t1,0,{d:0});
  // protein beads -> fold
  const beads=[];const cols=['good','dad','mom','hi','good','bad','dad','hi'];
  for(let i=0;i<8;i++){const b=H.E('circle',{r:6,st:`fill:var(--${cols[i]});stroke:var(--ink);stroke-width:1.2`},s);H.T(b,{x:380+i*14,y:Y},{d:0});H.O(b,0,{d:0});beads.push(b)}
  const fold=[[420,Y-8],[432,Y-14],[444,Y-6],[440,Y+8],[428,Y+12],[416,Y+6],[424,Y-2],[436,Y+2]];
  const a2=mkA(s,336,Y,372,Y,{w:1.6,h:6});const t2=H.txt(s,400,Y+34,'translation','lbs',{'text-anchor':'middle'});H.O(t2,0,{d:0});
  const pl=H.txt(s,430,Y-58,'PROTEIN WHITE','cap',{'text-anchor':'middle'});H.O(pl,0,{d:0});
  // enzyme makes pigment -> eye
  const a3=mkA(s,470,Y,508,Y,{w:1.6,h:6});
  const eye=at(s,565,Y);H.E('ellipse',{rx:42,ry:50,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.8'},eye);H.O(eye,0,{d:0});
  const pig=[];for(let i=0;i<22;i++){const a=i*2.4,r=8+((i*37)%30);const c=H.E('circle',{cx:r*Math.cos(a)*.8,cy:r*Math.sin(a),r:5,st:`fill:${RED}`},eye);H.O(c,0,{d:0});pig.push(c)}
  const el=H.txt(s,565,Y-58,'TRAIT','cap',{'text-anchor':'middle'});H.O(el,0,{d:0});const et=H.txt(s,565,Y+72,'red pigment in the eye','lbs',{'text-anchor':'middle'});H.O(et,0,{d:0});
  // genotype / phenotype brackets
  const br=(x0,x1,y,t,c)=>{const G=H.g(s);H.E('path',{d:`M${x0},${y} L${x0},${y+10} L${x1},${y+10} L${x1},${y}`,st:`fill:none;stroke:var(--${c});stroke-width:3`},G);
    H.txt(G,(x0+x1)/2,y+34,t,'big',{'text-anchor':'middle',st:`font-size:22px;fill:var(--${c})`});H.O(G,0,{d:0});return G};
  const gB=br(20,190,250,'GENOTYPE','ink'),pB=br(515,615,250,'PHENOTYPE','ink');pB.lastChild.style.fontSize='19px';gB.lastChild.style.fontSize='19px';
  const gs=H.g(s);rt(gs,105,320,'w^+ / w^+','lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:20px'});H.txt(gs,105,342,'the alleles','lbs',{'text-anchor':'middle'});H.O(gs,0,{d:0});
  const ps=H.g(s);H.txt(ps,565,320,'red eyes','lb',{'text-anchor':'middle',st:'font-size:16px'});H.txt(ps,565,342,'what you can see','lbs',{'text-anchor':'middle'});H.txt(ps,565,358,'or measure','lbs',{'text-anchor':'middle'});H.O(ps,0,{d:0});
  const link=mkA(s,190,300,500,300,{w:1.4,h:6,color:'muted'});const lt=H.txt(s,345,290,'both alleles can make products','lbs',{'text-anchor':'middle'});H.O(lt,0,{d:0});
  return [
    ()=>{H.O(tu,1);drawA(a1);H.O(t1,1,{at:300});H.O(rl,1,{at:300});H.D(rna,1,{d:1000,at:400})},
    ()=>{drawA(a2);H.O(t2,1,{at:300});H.O(pl,1,{at:300});beads.forEach((b,i)=>{H.O(b,1,{d:200,at:300+i*90});H.T(b,{x:fold[i][0],y:fold[i][1]},{d:900,at:1300})})},
    ()=>{drawA(a3);H.O(eye,1,{at:300});H.O(el,1,{at:300});pig.forEach((c,i)=>H.O(c,1,{d:250,at:600+i*50}));H.O(et,1,{at:900})},
    ()=>{H.O(gB,1);H.O(gs,1,{at:300})},
    ()=>{H.O(pB,1);H.O(ps,1,{at:300});drawA(link,{at:600});H.O(lt,1,{at:900})},
  ];}},

/* 4 ─────────────────────────────── */
{sec:'6.2',title:'Somatic and Germline Mutations',caption:'Each circle is a cell · lines join a cell to its daughter cells · red = carries the mutation',
text:`<p data-step="0">A <b>mutation</b> is a change in the DNA sequence. A mutation starts in one cell. When that cell divides by mitosis (ordinary cell division), both daughter cells inherit the mutation.</p>
<p data-step="1">Early in the development of an animal, its cells form two lines. <b>Somatic cells</b> make the body. <b>Germline cells</b> make the gametes: egg cells or sperm cells.</p>
<p data-step="2"><b>Somatic mutation.</b> The mutation passes only to the descendants of one body cell. The result is a patch of mutant cells beside normal cells. The individual can show the effect, but its children do not inherit the mutation.</p>
<p data-step="3"><b>Germline mutation.</b> The mutation can enter a gamete. If that gamete forms a zygote (a fertilized egg), every cell of the child has the mutation. The body of the parent does not show it.</p>
<p data-step="3" class="note">In plants, the germline forms late, from the cells that make the flower. So a somatic mutation in a shoot (a growing stem) can pass into the pollen or the egg cells.</p>`,
star:'Somatic = body: stays with you. Germline = passes to your children.',starStep:3,
scene(H){const s=stage();
  const N=(p,x,y,r)=>H.E('circle',{cx:x,cy:y,r,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},p);
  const L=H.g(s),C=H.g(s);
  const z=[40,215],g1=[[100,150],[100,285]],g2=[[160,110],[160,180],[160,250],[160,330]];
  const ln=(a,b,w)=>H.E('path',{d:`M${a[0]},${a[1]} L${b[0]},${b[1]}`,pathLength:1,cls:'draw',st:`stroke:var(--muted);stroke-width:${w||2}`},L);
  const l1=g1.map(b=>ln(z,b)),l2=g2.map((b,i)=>ln(g1[i<2?0:1],b));
  const cz=N(C,z[0],z[1],15),c1=g1.map(q=>N(C,q[0],q[1],13)),c2=g2.map(q=>N(C,q[0],q[1],12));
  [cz,...c1,...c2].forEach(e=>H.O(e,0,{d:0}));
  // body: each of cells 0..2 makes a block of 6 cells; cell 3 makes the gametes
  const clusters=[0,1,2].map(k=>{const cs=[];const [px,py]=g2[k];const l=ln([px+12,py],[226,py]);
    for(let i=0;i<6;i++){const c=N(C,240+(i%3)*24,py-11+Math.floor(i/3)*22,10);H.O(c,0,{d:0});cs.push(c)}return {cs,l}});
  const gl=ln([172,330],[226,330]);const gam=[];for(let i=0;i<3;i++){const c=N(C,240+i*24,330,8);H.O(c,0,{d:0});gam.push(c)}
  const body=H.g(s);H.E('rect',{x:220,y:80,width:88,height:200,rx:14,st:'fill:none;stroke:var(--dad);stroke-width:2;stroke-dasharray:6 4'},body);
  H.txt(body,264,70,'BODY (SOMATIC)','cap',{'text-anchor':'middle',st:'fill:var(--dad)'});H.O(body,0,{d:0});
  const germ=H.g(s);H.E('circle',{cx:160,cy:330,r:19,st:'fill:none;stroke:var(--hi);stroke-width:4'},germ);
  H.E('rect',{x:220,y:312,width:88,height:36,rx:10,st:'fill:none;stroke:var(--hi);stroke-width:3'},germ);H.txt(germ,264,370,'GAMETES (GERMLINE)','cap',{'text-anchor':'middle'});H.O(germ,0,{d:0});
  const gen=H.txt(s,30,50,'PARENT','cap');H.O(gen,0,{d:0});
  const star=(x,y)=>{const G=at(s,x,y);let d='';for(let i=0;i<10;i++){const r=i%2?5:12,a=i*Math.PI/5-Math.PI/2;d+=(i?'L':'M')+(r*Math.cos(a)).toFixed(1)+','+(r*Math.sin(a)).toFixed(1)}
    H.E('path',{d:d+'Z',st:'fill:var(--bad);stroke:var(--ink);stroke-width:1.2'},G);hide(G);return G};
  const st1=star(173,168),st2=star(173,318);
  const m1=H.g(s);H.txt(m1,322,176,'somatic mutation','lb');H.txt(m1,322,194,'a patch in the body','lbs');H.txt(m1,322,210,'not passed on','lbs');H.O(m1,0,{d:0});
  const ch=H.g(s);const kid=[];
  H.E('rect',{x:470,y:150,width:150,height:150,rx:18,st:'fill:none;stroke:var(--ink);stroke-width:1.5;stroke-dasharray:6 4'},ch);H.txt(ch,545,140,'CHILD','cap',{'text-anchor':'middle'});
  for(let i=0;i<16;i++){kid.push(N(ch,500+(i%4)*30,180+Math.floor(i/4)*30,10))}H.O(ch,0,{d:0});
  const egg=H.E('circle',{cx:0,cy:0,r:8,st:'fill:var(--bad);stroke:var(--ink);stroke-width:2'},s);H.T(egg,{x:288,y:330},{d:0});H.O(egg,0,{d:0});
  const eggP=H.E('path',{d:'M300,330 C400,330 440,300 470,260',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--bad);stroke-width:1.6;stroke-dasharray:1'},s);
  const m2=H.g(s);H.txt(m2,545,326,'germline mutation','lb',{'text-anchor':'middle'});H.txt(m2,545,344,'in every cell of the child','lbs',{'text-anchor':'middle'});H.O(m2,0,{d:0});
  const red=(e,o)=>fill(e,'var(--bad)',o);
  return [
    ()=>{H.O(gen,1);H.O(cz,1);H.D(l1,1,{d:500,at:300});c1.forEach(c=>H.O(c,1,{at:700}));H.D(l2,1,{d:500,at:1000});c2.forEach(c=>H.O(c,1,{at:1400}));
      clusters.forEach(k=>{H.D(k.l,1,{d:400,at:1700});k.cs.forEach((c,i)=>H.O(c,1,{at:2000+i*60}))});H.D(gl,1,{d:400,at:1700});gam.forEach((c,i)=>H.O(c,1,{at:2000+i*60}))},
    ()=>{H.O(body,1);H.O(germ,1,{at:400})},
    ()=>{pop(st1);red(c2[1],{at:500});H.K(clusters[1].l,{stroke:'bad'},{at:800});red(clusters[1].cs,{at:1000,d:900});H.O(m1,1,{at:1300})},
    ()=>{pop(st2);red(c2[3],{at:500});H.K(gl,{stroke:'bad'},{at:800});red(gam,{at:900});H.O(egg,1,{d:200,at:1300});H.D(eggP,1,{d:1200,at:1400});H.T(egg,{x:545,y:225},{d:1300,at:1400});
      H.O(ch,1,{at:2200});red(kid,{at:2500,d:900});H.O(egg,0,{at:2600});H.O(m2,1,{at:2800})},
  ];}},

/* 5 ─────────────────────────────── */
{sec:'6.2',title:'A Mosaic Eye',caption:'segmental heterochromia, left eye (right of photo) · Jvedral, CC BY-SA 4.0, via Wikimedia Commons',
text:`<p data-step="0">The <b>iris</b> is the coloured ring of the eye. In the photo, one iris has a brown patch in a blue-grey ring. This trait is <b>segmental heterochromia</b>.</p>
<p data-step="1">One possible cause is a somatic mutation in an early pigment cell. That cell divides many times, and all of its descendants carry the mutation. So one patch of the iris makes a different amount of pigment.</p>
<p data-step="2">An individual with two or more groups of cells with different genotypes is a <b>mosaic</b>. A mutation early in development gives a large patch. A mutation late in development gives a small patch.</p>
<p data-step="2" class="note">A cancer is another example of mosaicism. It starts from one body cell with mutations. That cell divides without control and makes a group of mutant cells in a normal body.</p>`,
star:'Early mutation → large patch. Late mutation → small patch.',starStep:2,
scene(H){const s=stage();const k=640/1024;
  photo(s,'@@asset:heterochromia.jpg@@',0,6,640,228*k,{r:10});
  const ring=H.E('ellipse',{cx:800*k,cy:6+115*k,rx:62,ry:58,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:4'},s);
  const rl=H.g(s);H.E('rect',{x:560,y:16,width:72,height:24,rx:6,st:'fill:#16181d;opacity:.88'},rl);H.txt(rl,596,33,'mosaic','lb',{'text-anchor':'middle',st:'fill:#fff'});H.O(rl,0,{d:0});
  // iris models
  const iris=(cx,cy,R,label)=>{const G=H.g(s);const dots=[];H.E('circle',{cx,cy,r:R+8,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},G);
    for(let ring=1;ring<=5;ring++){const r=12+ring*(R-14)/5;const n=6*ring+6;for(let i=0;i<n;i++){const a=i/n*Math.PI*2;
      const c=H.E('circle',{cx:cx+r*Math.cos(a),cy:cy+r*Math.sin(a),r:4.2,st:`fill:${IRIS}`},G);c.ring=ring;c.ang=(a*180/Math.PI);dots.push(c)}}
    H.E('circle',{cx,cy,r:13,cls:'kf'},G);H.txt(G,cx,cy+R+30,label,'lb',{'text-anchor':'middle'});H.O(G,0,{d:0});G.dots=dots;return G};
  const A=iris(170,312,66,'mutation in an early cell'),B=iris(470,312,66,'mutation in a later cell');
  const mdl=H.txt(s,320,226,'MODEL IRIS · EACH DOT IS ONE PIGMENT CELL','cap',{'text-anchor':'middle'});H.O(mdl,0,{d:0});
  const inA=d=>d.ang>=95&&d.ang<=185, inB=d=>d.ang>=200&&d.ang<=222&&d.ring>=4;
  const grow=(G,f,at0)=>G.dots.filter(f).forEach(d=>fill(d,AMBER,{d:400,at:at0+d.ring*260}));
  const big=H.txt(s,320,316,'vs','lb',{'text-anchor':'middle',st:'fill:var(--muted)'});H.O(big,0,{d:0});
  return [
    ()=>{H.D(ring,1,{d:900});H.O(rl,1,{at:700})},
    ()=>{H.O(mdl,1);H.O(A,1);grow(A,inA,500)},
    ()=>{H.O(B,1);H.O(big,1);grow(B,inB,400)},
  ];}},

/* 6 ─────────────────────────────── */
{sec:'6.2 · 6.3',title:'One Copy or Two',caption:'+ = wild-type allele · m = mutant allele · blue = from the father, orange = from the mother',
text:`<p data-step="0"><b>Haploid</b> cells have one copy of each gene. Yeast, for example, spends part of its life haploid. A mutation in the only copy shows directly in the phenotype, so the phenotype reveals the genotype.</p>
<p data-step="1"><b>Diploid</b> cells, as in humans and peas, have two copies of each chromosome, one from each parent. If both alleles at a locus are the same, the cell is <b>homozygous</b> at that locus.</p>
<p data-step="2">If the two alleles are different, the cell is <b>heterozygous</b>. The phenotype then depends on how the two alleles interact.</p>
<p data-step="3">If a cell has only one copy of a gene, it is <b>hemizygous</b>. A human male has one X and one Y chromosome. The Y lacks most X genes, so a male is hemizygous for almost all X genes. A <b>deletion</b> (a missing piece of chromosome) that removes the locus from one chromosome also makes a cell hemizygous.</p>`,
star:'Homo = same. Hetero = different. Hemi = half: only one copy.',starStep:3,
scene(H){const s=stage();const xs=[64,192,320,448,576],y0=110,y1=290,yb=170;
  const P=xs.map(()=>{const G=H.g(s);H.O(G,0,{d:0});return G});
  const head=(i,t,sub)=>{H.txt(P[i],xs[i],62,t,'cap',{'text-anchor':'middle',st:'fill:var(--ink)'});H.txt(P[i],xs[i],80,sub,'lbs',{'text-anchor':'middle'})};
  const foot=(i,a,b)=>{H.txt(P[i],xs[i],334,a,'lb',{'text-anchor':'middle'});H.txt(P[i],xs[i],354,b,'lbs',{'text-anchor':'middle'})};
  const WT='var(--good)',MU='var(--bad)';
  head(0,'HAPLOID','1 copy');chrom(P[0],xs[0],y0,y1,'muted',{band:yb,label:'m',bfill:MU});foot(0,'m','shows at once');
  head(1,'HOMOZYGOUS','same alleles');chrom(P[1],xs[1]-18,y0,y1,'dad',{band:yb,label:'+',bfill:WT});chrom(P[1],xs[1]+18,y0,y1,'mom',{band:yb,label:'+',bfill:WT});foot(1,'+/+','or m/m');
  head(2,'HETEROZYGOUS','different alleles');chrom(P[2],xs[2]-18,y0,y1,'dad',{band:yb,label:'+',bfill:WT});chrom(P[2],xs[2]+18,y0,y1,'mom',{band:yb,label:'m',bfill:MU});foot(2,'+/m','');
  head(3,'HEMIZYGOUS','XY male');chrom(P[3],xs[3]-18,y0,y1,'mom',{band:yb,label:'m',bfill:MU});chrom(P[3],xs[3]+18,y0,y0+80,'dad');
  H.txt(P[3],xs[3]-36,y1+4,'X','lb',{'text-anchor':'middle'});H.txt(P[3],xs[3]+18,y0+100,'Y','lb',{'text-anchor':'middle'});foot(3,'m/Y','no second copy');
  head(4,'HEMIZYGOUS','deletion');chrom(P[4],xs[4]-18,y0,y1,'dad',{band:yb,label:'+',bfill:WT});
  H.E('line',{x1:xs[4]+18,y1:y0,x2:xs[4]+18,y2:yb-16,st:'stroke:var(--mom);stroke-width:14;stroke-linecap:round'},P[4]);H.E('line',{x1:xs[4]+18,y1:yb+16,x2:xs[4]+18,y2:y1,st:'stroke:var(--mom);stroke-width:14;stroke-linecap:round'},P[4]);
  H.E('rect',{x:xs[4]+5,y:yb-9,width:26,height:18,rx:4,st:'fill:none;stroke:var(--bad);stroke-width:1.5;stroke-dasharray:3 3'},P[4]);foot(4,'+/Δ','Δ = deleted locus');
  const sep=H.E('line',{x1:128,y1:50,x2:128,y2:370,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);H.O(sep,0,{d:0});
  const dip=H.g(s);H.E('path',{d:'M142,32 L142,24 L626,24 L626,32',st:'fill:none;stroke:var(--muted);stroke-width:1.5'},dip);H.txt(dip,384,16,'DIPLOID CELLS','cap',{'text-anchor':'middle'});H.O(dip,0,{d:0});
  const wc=[0,2,1,0,1].map((n,i)=>{const G=H.g(P[i]);for(let k=0;k<2;k++)H.E('rect',{x:xs[i]-22+k*24,y:378,width:20,height:16,rx:3,st:`fill:${k<n?'var(--good)':'none'};stroke:var(--ink);stroke-width:1.3${k<n?'':';stroke-dasharray:3 2'}`},G);return G});
  const wl=H.txt(s,320,412,'WORKING COPIES OF THE GENE (GREEN BOXES)','cap',{'text-anchor':'middle'});H.O(wl,0,{d:0});
  return [()=>{H.O(P[0],1,{d:700});H.O(wl,1)},()=>{H.O(sep,1);H.O(dip,1);H.O(P[1],1,{d:700})},()=>{H.O(P[2],1,{d:700})},()=>{H.O(P[3],1,{d:700});H.O(P[4],1,{d:700,at:500})}];}},

/* 7 ─────────────────────────────── */
{sec:'6.4',title:'Pleiotropy: One Gene, Many Traits',caption:'Pea gene A after Hellens et al. (2010) · FBN1 = fibrillin-1 gene · icons are schematic',
text:`<p data-step="0"><b>Pleiotropy</b> is the effect of one gene on two or more traits that seem unrelated. Such a gene is a <b>pleiotropic gene</b>.</p>
<p data-step="1">Mendel saw pleiotropy in peas. Plants with a coloured seed coat always had purple flowers. They also had a purple mark at each leaf axil, the point where a leaf joins the stem. Plants with a white seed coat had white flowers and no colour in the axils.</p>
<p data-step="2">One gene, called A, explains the link. Its protein is a <b>transcription factor</b>: a protein that activates other genes. In all three tissues, it activates the genes for purple pigment.</p>
<p data-step="3">The cell normally cuts some pieces out of the RNA copy of gene A. Mendel's white allele, a, has a one-letter change that moves a cut to the wrong place. So aa plants make no working A protein and no pigment.</p>
<p data-step="4">In humans, FBN1 makes fibrillin-1, a protein of the stretchy fibres in many tissues. Mutations in FBN1 cause Marfan syndrome. It affects the lens of the eye, the aorta (the main artery from the heart) and the bones.</p>
<p data-step="4" class="note">In the fruit fly, vestigial (vg) mutations shorten the wings and also change some bristles, the egg strings and the lifespan.</p>`,
star:'Pleiotropy: one protein, used in many places.',starStep:4,
scene(H){const s=stage();const P=H.g(s);
  const gene=H.g(P);H.E('line',{x1:70,y1:90,x2:70,y2:330,st:'stroke:var(--dad);stroke-width:16;stroke-linecap:round'},gene);
  const gb=band(gene,70,210,'A','var(--hi)',{w:36,h:24});H.txt(gene,70,362,'gene A','lb',{'text-anchor':'middle'});
  const tis=[[400,95,'flower'],[400,215,'seed coat'],[400,335,'leaf axil']];
  const icons=tis.map(([x,y,t],i)=>{const G=H.g(P);let pig=[];
    if(i===0){const f=flower(G,x,y,48,NOPIG);pig=f.pet}
    else if(i===1){const e=H.E('ellipse',{cx:x,cy:y,rx:40,ry:30,st:`fill:${NOPIG};stroke:var(--ink);stroke-width:2`},G);H.E('ellipse',{cx:x-8,cy:y-6,rx:12,ry:8,st:'fill:none;stroke:var(--ink);stroke-width:1.2;opacity:.5'},G);pig=[e]}
    else{H.E('path',{d:`M${x},${y+45} L${x},${y-45}`,st:'stroke:var(--good);stroke-width:6;stroke-linecap:round'},G);
      H.E('path',{d:`M${x},${y} C${x+20},${y-30} ${x+60},${y-34} ${x+78},${y-20} C${x+56},${y+2} ${x+22},${y+4} ${x},${y}`,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.5;opacity:.85'},G);
      const m=H.E('circle',{cx:x,cy:y,r:11,st:`fill:${NOPIG};stroke:var(--ink);stroke-width:2`},G);pig=[m]}
    H.txt(G,x+(i===2?-24:62),y+(i===2?-30:5),t,'lb',{'text-anchor':i===2?'end':'start'});G.pig=pig;H.O(G,0,{d:0});return G});
  const ar=tis.map(([x,y])=>mkA(P,98,210,x-62,y,{w:1.8,h:7}));
  const tfs=[];tis.forEach(([x,y],i)=>{for(let k=0;k<2;k++){const t=at(P,70,210);H.E('path',{d:'M-9,8 L-9,-2 C-9,-12 9,-12 9,-2 L9,8 L4,8 L4,0 C4,-5 -4,-5 -4,0 L-4,8 Z',st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.4'},t);
    H.O(t,0,{d:0});t.to=[x-62+(k?-14:-30)*0,y];t.to=[x-80+k*18,y+(i===1?0:0)-14+k*8];t.i=i;tfs.push(t)}});
  const tfl=H.g(P);H.txt(tfl,250,118,'transcription factor','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});H.O(tfl,0,{d:0});
  const cut=H.g(P);H.txt(cut,96,74,'allele a: one-letter change','lbs',{st:'fill:var(--bad);font-weight:700'});H.O(cut,0,{d:0});
  const linked=H.g(P);H.E('path',{d:'M546,95 C574,95 574,335 546,335',st:'fill:none;stroke:var(--ink);stroke-width:2'},linked);H.txt(linked,604,220,'always','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});H.txt(linked,604,236,'together','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});H.O(linked,0,{d:0});
  // human panel
  const Hm=H.g(s);H.O(Hm,0,{d:0});
  H.E('line',{x1:70,y1:90,x2:70,y2:330,st:'stroke:var(--mom);stroke-width:16;stroke-linecap:round'},Hm);band(Hm,70,170,'FBN1','var(--hi)',{w:50,h:24});H.txt(Hm,70,362,'human chromosome 15','lbs',{'text-anchor':'middle'});
  const hx=470;const ic=[[95,'eye lens'],[215,'aorta'],[335,'bones']];
  const eye=at(Hm,hx,95);H.E('path',{d:'M-46,0 C-20,-32 20,-32 46,0 C20,32 -20,32 -46,0 Z',st:'fill:var(--card);stroke:var(--ink);stroke-width:2'},eye);H.E('circle',{r:16,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2'},eye);H.E('circle',{cx:6,cy:-5,r:8,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},eye);
  const ao=at(Hm,hx,215);H.E('path',{d:'M0,40 C-26,22 -34,6 -22,-2 C-12,-8 -4,-2 0,6 C4,-2 12,-8 22,-2 C34,6 26,22 0,40 Z',st:'fill:var(--bad);opacity:.25;stroke:var(--ink);stroke-width:1.5'},ao);H.E('path',{d:'M-30,30 L-30,-6 C-30,-36 30,-36 30,-6 L30,30',st:'fill:none;stroke:var(--bad);stroke-width:12;stroke-linecap:round'},ao);H.E('path',{d:'M-30,30 L-30,-6 C-30,-36 30,-36 30,-6 L30,30',st:'fill:none;stroke:var(--ink);stroke-width:1.5;stroke-dasharray:3 3'},ao);
  const bn=at(Hm,hx,335);H.E('path',{d:'M-50,-6 C-60,-18 -44,-26 -38,-12 L38,-12 C44,-26 60,-18 50,-6 C60,6 44,22 38,8 L-38,8 C-44,22 -60,6 -50,-6 Z',st:'fill:var(--card);stroke:var(--ink);stroke-width:2'},bn);
  ic.forEach(([y,t])=>H.txt(Hm,hx+66,y+5,t,'lb'));
  const har=ic.map(([y])=>mkA(Hm,110,170,hx-66,y,{w:1.8,h:7}));H.txt(Hm,250,124,'fibrillin-1','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});
  return [
    ()=>{H.O(gene,1);ar.forEach((a,i)=>drawA(a,{at:200+i*150}));icons.forEach((G,i)=>H.O(G,1,{at:500+i*150}))},
    ()=>{icons.forEach((G,i)=>fill(G.pig,PURPLE,{d:900,at:200}));H.O(linked,1,{at:700})},
    ()=>{H.O(tfl,1);tfs.forEach((t,j)=>{H.O(t,1,{d:200,at:j*120});H.T(t,{x:t.to[0],y:t.to[1]},{d:1200,at:j*120})})},
    ()=>{H.K(gb.r,{fill:'bad'});H.O(cut,1);tfs.forEach(t=>{H.T(t,{x:70,y:210},{d:900});H.O(t,0,{d:600,at:300})});H.O(tfl,0);icons.forEach(G=>fill(G.pig,NOPIG,{d:900,at:700}))},
    ()=>{H.O(P,0,{d:600});H.O(Hm,1,{d:700,at:500});har.forEach((a,i)=>drawA(a,{at:900+i*150}))},
  ];}},

/* 8 ─────────────────────────────── */
{sec:'6.4',title:'Polygenic Traits Make a Bell Curve',caption:'Model: every gene has a tall and a short allele, each at 50%; each tall allele adds the same small amount',
text:`<p data-step="0"><b>Polygenic inheritance</b> is the reverse of pleiotropy: many genes affect one trait. A normal fruit-fly wing needs dozens of genes. A mutation in any one of them changes the wing.</p>
<p data-step="1">Human height is polygenic. It depends on thousands of DNA differences across the genome. Each difference adds or removes a small amount of height.</p>
<p data-step="2">In a model with one gene, each person has 0, 1 or 2 tall alleles. So the population has three height classes, in the ratio 1 : 2 : 1.</p>
<p data-step="3">Two genes give five classes. Four genes give nine. Each extra gene adds classes and makes the steps between them smaller.</p>
<p data-step="4">With many genes, the classes merge into a smooth bell-shaped curve. Most people are near the middle, and few are at the two ends. Traits with a smooth range of values, such as height and skin colour, are usually polygenic.</p>`,
star:'Many small effects add up to a bell curve.',starStep:4,
scene(H){const s=stage();
  // top strip: many genes -> one wing
  const W=H.g(s);const gx=[40,80,120,160,200,240,280,320];
  gx.forEach((x,i)=>{H.E('line',{x1:x,y1:30,x2:x,y2:96,st:`stroke:var(--${i%2?'mom':'dad'});stroke-width:9;stroke-linecap:round`},W);H.E('rect',{x:x-8,y:52+(i*13)%30,width:16,height:9,rx:2,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.2'},W)});
  const wa=gx.map((x,i)=>mkA(W,x+10,60+(i*13)%30,450,62,{w:1.1,h:5,color:'muted'}));
  H.E('path',{d:'M460,62 C500,20 600,22 615,52 C620,72 560,92 460,66 Z',st:'fill:var(--wash);stroke:var(--ink);stroke-width:2'},W);
  [[495,50,560,42],[492,60,600,58],[500,68,580,76]].forEach(([a,b,c,d])=>H.E('path',{d:`M${a},${b} L${c},${d}`,st:'stroke:var(--ink);stroke-width:1;opacity:.6'},W));
  H.txt(W,540,112,'one wing','lb',{'text-anchor':'middle'});H.txt(W,180,124,'dozens of genes','lb',{'text-anchor':'middle'});H.O(W,0,{d:0});
  // genome strip with many small effects
  const G2=H.g(s);H.E('line',{x1:20,y1:62,x2:620,y2:62,st:'stroke:var(--ink);stroke-width:3'},G2);
  for(let i=0;i<110;i++){const x=24+i*5.4+((i*7)%3);const up=(i*37)%5<3;H.E('line',{x1:x,y1:62,x2:x,y2:up?50:74,st:`stroke:var(--${up?'good':'bad'});stroke-width:2`},G2)}
  H.txt(G2,320,104,'thousands of DNA differences, each with a small effect','lb',{'text-anchor':'middle'});H.txt(G2,620,40,'green = adds height · red = removes height','lbs',{'text-anchor':'end'});H.O(G2,0,{d:0});
  // histogram
  const B=392,x0=60,x1=600,HM=186;const hs=H.g(s);
  H.E('line',{x1:x0-10,y1:B,x2:x1+10,y2:B,st:'stroke:var(--ink);stroke-width:2'},hs);H.txt(hs,x0-10,B+20,'short','lbs');H.txt(hs,x1+10,B+20,'tall','lbs',{'text-anchor':'end'});
  H.txt(hs,320,B+20,'height class','lbs',{'text-anchor':'middle'});H.O(hs,0,{d:0});
  const bars=[];for(let i=0;i<41;i++){const r=H.E('rect',{x:0,y:-1,width:1,height:1,cls:'nss',st:'fill:var(--dad);stroke:var(--paper);stroke-width:1'},s);H.T(r,{x:320,y:B,sx:.001,sy:.001},{d:0});bars.push(r)}
  const C=(n,k)=>{let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return r};
  const lab=H.txt(s,320,150,'','big',{'text-anchor':'middle',st:'font-size:22px'});const rat=H.txt(s,320,172,'','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});
  const ref=(C(40,20)/Math.pow(4,20))/((x1-x0)/41);// tallest bar (20 genes) = HM
  const show=(n,o)=>{const m=2*n+1,w=(x1-x0)/m;bars.forEach((r,i)=>{if(i<m){const p=C(2*n,i)/Math.pow(4,n);const h=HM*(p/w)/ref;
      H.T(r,{x:x0+i*w,y:B,sx:w,sy:Math.max(.001,h)},o);H.O(r,1,o)}else{H.T(r,{x:x1,y:B,sx:.001,sy:.001},o);H.O(r,0,o)}})};
  let d='';const n=20,sd=Math.sqrt(2*n)/2,mu=n;for(let i=0;i<=120;i++){const k=i/120*40;const p=Math.exp(-((k-mu)**2)/(2*sd*sd))/(sd*Math.sqrt(2*Math.PI));
    const xx=x0+(k+.5)*(x1-x0)/41;const h=HM*p/((x1-x0)/41)/ref;d+=(i?' L':'M')+xx.toFixed(1)+','+(B-h).toFixed(1)}
  const bell=H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--mom);stroke-width:3.5'},s);
  return [
    ()=>{H.O(W,1);wa.forEach((a,i)=>drawA(a,{at:200+i*60}))},
    ()=>{H.O(W,0,{d:500});H.O(G2,1,{at:400})},
    ()=>{H.O(hs,1);show(1,{d:900});lab.textContent='1 gene · 3 classes';rat.textContent='1 : 2 : 1'},
    ()=>{show(2,{d:800});lab.textContent='2 genes · 5 classes';rat.textContent='1 : 4 : 6 : 4 : 1';H.after(1300,()=>{show(4,{d:800});lab.textContent='4 genes · 9 classes';rat.textContent='steps get smaller'})},
    ()=>{show(20,{d:1000});lab.textContent='many genes · a bell curve';rat.textContent='most people near the middle';H.D(bell,1,{d:1400,at:900})},
  ];}},

/* 9 ─────────────────────────────── */
{sec:'6.5',title:'Genes Plus Environment',caption:'tomatoes, Friedrich Haag, CC BY-SA 4.0, via Wikimedia Commons · the curve is a model',
text:`<p data-step="0">A <b>multifactorial</b> trait depends on several genes and on the environment. The colour, shape and size of tomatoes are examples. Sunlight, water and soil also change these traits.</p>
<p data-step="1">The environment adds its own small differences between individuals. These differences fill the gaps between the genetic classes, so the curve becomes smooth.</p>
<p data-step="2">So phenotype = genotype + environment + interaction. The interaction is the part where the effect of a gene depends on the environment.</p>
<p data-step="3">Two terms describe how reliably a genotype shows. <b>Penetrance</b> is the percentage of individuals with a genotype that show the expected phenotype. <b>Expressivity</b> is how strongly the phenotype shows in each individual.</p>`,
star:'Phenotype = genotype + environment + interaction.',starStep:2,
scene(H){const s=stage();
  photo(s,'@@asset:tomatoes.jpg@@',0,0,300,206,{r:10});
  const B=384,x0=40,x1=600,n=3,m=7,w=(x1-x0)/m;const C=[1,6,15,20,15,6,1];
  const ax=H.g(s);H.E('line',{x1:x0-10,y1:B,x2:x1+10,y2:B,st:'stroke:var(--ink);stroke-width:2'},ax);H.txt(ax,x0-10,B+18,'small','lbs');H.txt(ax,x1+10,B+18,'large','lbs',{'text-anchor':'end'});
  H.txt(ax,320,236,'MODEL: TOMATO SIZE · 3 GENES','cap',{'text-anchor':'middle'});
  const bars=C.map((c,i)=>{const r=H.E('rect',{x:x0+i*w+4,y:B-c*6,width:w-8,height:c*6,st:'fill:var(--dad);opacity:.9'},ax);return r});
  let d='';const sd=w*.6,A0=w/(sd*Math.sqrt(2*Math.PI));for(let i=0;i<=200;i++){const x=x0+(x1-x0)*i/200;let y=0;C.forEach((c,k)=>{const cx=x0+(k+.5)*w;y+=c*6*A0*Math.exp(-((x-cx)**2)/(2*sd*sd))});d+=(i?' L':'M')+x.toFixed(1)+','+(B-y).toFixed(1)}
  const sm=H.E('path',{d:d+` L${x1},${B} L${x0},${B} Z`,st:'fill:var(--dad-tint);stroke:none'},ax);const sml=H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--mom);stroke-width:3'},ax);
  s.insertBefore(sm,null);ax.insertBefore(sm,ax.firstChild);H.O(sm,0,{d:0});
  const envl=H.txt(s,320,256,'+ environment: the gaps close','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});H.O(envl,0,{d:0});
  const eq=H.g(s);rt(eq,470,40,'phenotype =','lb',{'text-anchor':'middle',st:'font-size:16px'});
  [['genotype','dad'],['+ environment','good'],['+ interaction','mom']].forEach(([t,c],i)=>H.txt(eq,470,66+i*22,t,'lb',{'text-anchor':'middle',st:`fill:var(--${c})`}));H.O(eq,0,{d:0});
  const pe=H.g(s);H.O(pe,0,{d:0});
  H.txt(pe,326,124,'penetrance 70%','lbs',{st:'fill:var(--ink);font-weight:700'});H.txt(pe,326,170,'variable expressivity','lbs',{st:'fill:var(--ink);font-weight:700'});
  const p1=[],p2=[];for(let i=0;i<10;i++){p1.push(H.E('circle',{cx:336+i*28,cy:140,r:9,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},pe));
    p2.push(H.E('circle',{cx:336+i*28,cy:186,r:9,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},pe))}
  const shade=[.15,.9,.5,.3,1,.65,.4,.8,.2,.55];
  return [
    ()=>{},
    ()=>{bars.forEach(b=>H.O(b,.35,{d:800}));H.O(sm,1,{d:900});H.D(sml,1,{d:1300});H.O(envl,1,{at:600})},
    ()=>{H.O(eq,1)},
    ()=>{H.O(eq,0,{d:400});H.O(pe,1,{at:300});p1.forEach((c,i)=>{if([0,1,2,4,5,7,8].includes(i))fill(c,'var(--bad)',{at:600+i*80})});
      p2.forEach((c,i)=>fill(c,`color-mix(in srgb, var(--bad) ${Math.round(shade[i]*100)}%, var(--card))`,{at:1200+i*80}))},
  ];}},

/* 10 ─────────────────────────────── */
{sec:'6.5',title:'Complete Dominance: Half Is Enough',caption:'Photos: purple pea, Steffen Bauer (SaatPilot), CC BY 4.0 · white pea, net_efekt, CC BY 2.0 · via Wikimedia Commons',
text:`<p data-step="0">Mendel's flower-colour gene is gene A, the pleiotropic gene. AA plants have purple flowers and aa plants have white flowers. Aa plants also have purple flowers.</p>
<p data-step="1">The A allele makes a working protein that activates purple pigment. The a allele makes no working protein. So AA plants have 100% of the protein, Aa plants about 50% and aa plants 0%.</p>
<p data-step="2">The graph plots flower colour against the amount of working protein. For this gene, 50% already gives full purple colour, and Aa flowers look the same as AA flowers.</p>
<p data-step="3">A is <b>dominant</b>: it sets the phenotype of the heterozygote. The a allele is <b>recessive</b>: its phenotype shows only in aa plants. This relationship is <b>complete dominance</b>. Only the heterozygote reveals the kind of dominance.</p>
<p data-step="4">Crosses show it too. AA × aa gives only Aa offspring, all purple. Aa × Aa gives 1 AA : 2 Aa : 1 aa, so 3 purple : 1 white.</p>`,
star:'Complete dominance: half the protein is enough.',starStep:3,
scene(H){const D=doseScene(H,{top:'AA',ylab:'purple colour',note:'50% → full colour',f:v=>Math.min(1,1-Math.exp(-v*9))/(1-Math.exp(-9)),
    rows:[{g:'AA',a:['A','A'],ok:[1,1],amt:1,img:'@@asset:pea-purple.jpg@@',ph:'purple',col:PURPLE},{g:'Aa',a:['A','a'],ok:[1,0],amt:.5,img:'@@asset:pea-purple.jpg@@',ph:'purple',col:PURPLE},{g:'aa',a:['a','a'],ok:[0,0],amt:0,img:'@@asset:pea-white.jpg@@',ph:'white',col:NOPIG}],
    cross:['AA × aa → all Aa: purple','Aa × Aa → 1 AA : 2 Aa : 1 aa → 3 purple : 1 white']});
  const s=stage();const hl=H.E('rect',{x:4,y:160,width:346,height:80,rx:10,st:'fill:var(--hi);opacity:0'},s);s.insertBefore(hl,s.firstChild);
  const tags=H.g(s);[['Aa looks like AA, so',0],['A is dominant,',1],['a is recessive',2]].forEach(([t,i])=>H.txt(tags,470,186+i*20,t,'lb',{st:'font-size:13.5px'}));H.O(tags,0,{d:0});
  return [()=>D.s0(),()=>D.s1(),()=>D.s2(),()=>{H.O(hl,.22);H.O(tags,1,{at:300})},()=>D.s4()];}},

/* 11 ─────────────────────────────── */
{sec:'6.5',title:'Writing Genes and Alleles',caption:'Symbols in use · gene and allele symbols in italics, protein names in plain text',
text:`<p data-step="0">Geneticists write gene and allele symbols in italics, and protein names in plain text. For example, the fruit-fly gene <i>white</i> (<i>w</i>) makes the protein WHITE. WHITE carries pigment building blocks into the cells of the eye.</p>
<p data-step="1"><b>Mendel's system.</b> A capital letter marks the dominant allele and a small letter the recessive allele: <i>A</i> and <i>a</i>. The system fails when neither allele is dominant, or when a gene has more than two alleles.</p>
<p data-step="2"><b>Superscripts.</b> A superscript after the gene symbol names each allele. A superscript + marks the wild-type allele. Fly genes take the name of their mutant phenotype, so <i>w</i><sup>+</sup> gives red eyes and <i>w</i> gives white eyes.</p>
<p data-step="3"><b>Capital or small.</b> In flies, a small first letter shows that the first mutant allele found was recessive (<i>w</i>, white). A capital shows that it was dominant (<i>M</i>, Minute).</p>
<p data-step="4"><b>Slash.</b> A slash separates the two alleles at one locus: <i>w</i><sup>+</sup>/<i>w</i>. The two alleles sit on the two homologous chromosomes, the matching chromosomes from the two parents. <i>AA</i> and <i>A</i>/<i>A</i> mean the same genotype.</p>`,
star:'Italic = gene. Plain = protein. + = wild type.',starStep:2,
scene(H){const s=stage();const M='font-family:var(--f-math);font-style:italic;font-weight:600';
  const row=(y,label)=>{const G=H.g(s);H.txt(G,24,y,label,'cap',{st:'fill:var(--ink)'});H.O(G,0,{d:0});return G};
  const r0=row(44,'GENE VS PROTEIN');rt(r0,60,92,'w','lb',{st:M+';font-size:34px'});mkA(r0,98,82,170,82,{w:1.8,h:7});H.txt(r0,186,94,'WHITE','lb',{st:'font-size:26px;font-weight:800'});
  H.txt(r0,60,116,'gene (italic)','lbs');H.txt(r0,186,116,'protein (plain)','lbs');r0.lastChild.previousSibling;
  const r1=row(150,"MENDEL'S SYSTEM");rt(r1,60,196,'A','lb',{st:M+';font-size:30px'});rt(r1,150,196,'a','lb',{st:M+';font-size:30px'});H.txt(r1,60,218,'dominant','lbs');H.txt(r1,150,218,'recessive','lbs');
  const r2=row(252,'SUPERSCRIPTS');
  const eyeI=(G,x,y,col)=>{const e=at(G,x,y);H.E('ellipse',{rx:30,ry:22,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},e);H.E('ellipse',{cx:-15,cy:-2,rx:11,ry:14,st:`fill:${col};stroke:var(--ink);stroke-width:1.5`},e);H.E('ellipse',{cx:15,cy:-2,rx:11,ry:14,st:`fill:${col};stroke:var(--ink);stroke-width:1.5`},e);return e};
  rt(r2,60,300,'w^+','lb',{st:M+';font-size:30px'});eyeI(r2,140,292,RED);rt(r2,210,300,'w','lb',{st:M+';font-size:30px'});eyeI(r2,276,292,NOPIG);
  H.txt(r2,60,334,'wild type: red','lbs');H.txt(r2,210,334,'mutant: white','lbs');
  const r3=row(44,'CAPITAL OR SMALL');H.T(r3,{x:330},{d:0});rt(r3,60,92,'w','lb',{st:M+';font-size:30px'});H.txt(r3,90,90,'white: first mutant recessive','lbs');
  rt(r3,60,130,'M','lb',{st:M+';font-size:30px'});H.txt(r3,96,128,'Minute: first mutant dominant','lbs');
  // slash: tags fly from chromosomes into the genotype
  const r4=row(170,'');H.txt(r4,354,170,'SLASH = ONE ALLELE PER CHROMOSOME','cap',{st:'fill:var(--ink)'});
  H.E('line',{x1:400,y1:204,x2:600,y2:204,st:'stroke:var(--dad);stroke-width:12;stroke-linecap:round'},r4);H.E('line',{x1:400,y1:236,x2:600,y2:236,st:'stroke:var(--mom);stroke-width:12;stroke-linecap:round'},r4);
  const t1=at(r4,500,204),t2=at(r4,500,236);[t1,t2].forEach((t,i)=>{H.E('rect',{x:-16,y:-11,width:32,height:22,rx:5,st:`fill:var(--card);stroke:var(--${i?'mom':'dad'});stroke-width:2.5`},t);rt(t,0,6,i?'w':'w^+','lb',{'text-anchor':'middle',st:M+';font-size:16px'})});
  const sl=H.txt(r4,500,312,'/','lb',{'text-anchor':'middle',st:M+';font-size:34px'});H.O(sl,0,{d:0});
  return [
    ()=>{H.O(r0,1)},()=>{H.O(r1,1)},()=>{H.O(r2,1)},()=>{H.O(r3,1)},
    ()=>{H.O(r4,1);H.T(t1,{x:468,y:302,s:1.3},{d:1100,at:500});H.T(t2,{x:532,y:302,s:1.3},{d:1100,at:500});H.O(sl,1,{at:1400})},
  ];}},

/* 12 ─────────────────────────────── */
{sec:'6.5',title:'Incomplete Dominance: Colour Follows Amount',caption:'Snapdragon photos: red, Suresh Prasad · pink and white, Sabina Bajracharya · all CC BY-SA 4.0, via Wikimedia Commons',
text:`<p data-step="0">In snapdragons and carnations, red × white plants give pink offspring. This pattern is <b>incomplete dominance</b>, also called <b>semi-dominance</b>.</p>
<p data-step="1">In the simplest model, the R<sup>1</sup> allele makes a working enzyme for red pigment. The R<sup>2</sup> allele makes none. So R<sup>1</sup>R<sup>1</sup> has 100% of the enzyme, R<sup>1</sup>R<sup>2</sup> about 50% and R<sup>2</sup>R<sup>2</sup> 0%.</p>
<p data-step="2">In this model, the amount of pigment follows the amount of enzyme in a straight line. Half the enzyme makes about half the pigment, so R<sup>1</sup>R<sup>2</sup> flowers are pink.</p>
<p data-step="3">The heterozygote is between the two homozygotes, so neither allele is completely dominant. Pink × pink gives 1 red : 2 pink : 1 white. Each genotype has its own phenotype, so the phenotype ratio equals the genotype ratio. The alleles still separate into the gametes, as Mendel's law of segregation says. Each gamete gets one of the two alleles.</p>
<p data-step="3" class="note">One letter with superscripts (R<sup>1</sup>, R<sup>2</sup>) shows that neither allele is dominant. A capital and a small letter (R and r) would suggest that one allele is dominant.</p>`,
star:'Incomplete dominance: half the enzyme, half the colour.',starStep:3,
scene(H){const D=doseScene(H,{top:'R¹R¹',ylab:'red pigment',note:'50% → half colour',f:v=>v,
    rows:[{g:'R^1R^1',a:['R^1','R^1'],ok:[1,1],amt:1,img:'@@asset:snap-red.jpg@@',ph:'red',col:RED},{g:'R^1R^2',a:['R^1','R^2'],ok:[1,0],amt:.5,img:'@@asset:snap-pink.jpg@@',ph:'pink',col:PINK},{g:'R^2R^2',a:['R^2','R^2'],ok:[0,0],amt:0,img:'@@asset:snap-white.jpg@@',ph:'white',col:NOPIG}],
    cross:['R^1R^1 × R^2R^2 → all R^1R^2: pink','R^1R^2 × R^1R^2 → 1 red : 2 pink : 1 white']});
  return [()=>D.s0(),()=>D.s1(),()=>D.s2(),()=>D.s4()];}},

/* 13 ─────────────────────────────── */
{sec:'6.5',title:'Codominance: The ABO Enzyme',caption:'Square = sugar A · circle = sugar B · hexagons = the sugar chain · DNA letters are a schematic',
text:`<p data-step="0">Red blood cells carry short chains of sugars on their surface. The <b>ABO gene</b> makes an enzyme that adds one more sugar to the end of each chain.</p>
<p data-step="1">The I<sup>A</sup> allele makes an enzyme that adds sugar A. Cells with only sugar A are blood type A.</p>
<p data-step="2">The I<sup>B</sup> allele makes an enzyme that adds sugar B. The A and B enzymes differ by only four amino acids. These few changes decide which sugar the enzyme adds.</p>
<p data-step="3">The most common i allele has a deletion of one DNA letter. The ribosome reads the RNA copy in groups of three letters, so every later group changes. A stop signal comes early, and the short enzyme does not work. Type O cells add no extra sugar.</p>
<p data-step="4">An I<sup>A</sup>/I<sup>B</sup> person makes both working enzymes, so each red blood cell carries both sugars. In <b>codominance</b>, both alleles show fully in the heterozygote. Type AB is not a blend of A and B.</p>`,
star:'Codominance: both enzymes work, so both sugars show.',starStep:4,
scene(H){const s=stage();const xs=[90,166,242,318,394,470,546],MB=372;
  const SQ='var(--good)',CI='var(--hi)';
  const mem=H.g(s);H.E('rect',{x:20,y:MB,width:600,height:44,rx:8,st:'fill:color-mix(in srgb, var(--bad) 22%, var(--card));stroke:var(--bad);stroke-width:2.5'},mem);
  H.txt(mem,320,400,'RED BLOOD CELL SURFACE','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  const hex=(p,x,y)=>{let d='';for(let i=0;i<6;i++){const a=i*Math.PI/3;d+=(i?'L':'M')+(x+8*Math.cos(a)).toFixed(1)+','+(y+8*Math.sin(a)).toFixed(1)}return H.E('path',{d:d+'Z',st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.4'},p)};
  xs.forEach(x=>{H.E('line',{x1:x,y1:MB,x2:x,y2:328,st:'stroke:var(--ink);stroke-width:2'},mem);hex(mem,x,354);hex(mem,x,334)});H.O(mem,0,{d:0});
  const top=H.g(s);H.txt(top,20,28,'GENOTYPE','cap');H.txt(top,620,28,'BLOOD TYPE','cap',{'text-anchor':'end'});H.E('line',{x1:16,y1:72,x2:624,y2:72,st:'stroke:var(--faint);stroke-width:1.5'},top);
  const geno=H.txt(top,20,58,'','lb',{st:'font-family:var(--f-math);font-style:italic;font-size:22px'});
  const typ=H.txt(top,620,60,'','big',{'text-anchor':'end',st:'font-size:30px'});H.O(top,0,{d:0});
  const CR=H.g(s);const bands=[[40,250,145,'dad'],[390,600,495,'mom']].map(([a,b,x,c])=>{H.E('line',{x1:a,y1:104,x2:b,y2:104,st:`stroke:var(--${c});stroke-width:12;stroke-linecap:round`},CR);
    const B=band(CR,x,104,'','var(--hi)',{w:44,h:24});B.t.style.fontFamily='var(--f-math)';B.t.style.fill='#16181d';B.t.style.fontStyle='italic';B.t.style.fontSize='15px';return B});
  const crA=[mkA(CR,145,120,145,146,{w:1.4,h:5}),mkA(CR,495,120,495,146,{w:1.4,h:5})];crA.forEach(a=>{H.D(a.firstChild,1,{d:0});H.O(a.lastChild,1,{d:0})});H.O(CR,0,{d:0});
  const setB=(a,b)=>[a,b].forEach((v,i)=>{const t=bands[i].t;t.textContent='';H.E('tspan',{text:v[0]},t);if(v[1])H.E('tspan',{text:v[1],'baseline-shift':'super',st:'font-size:.68em'},t)});
  const setG=(a,b)=>{geno.textContent='';[[a],['  /  '],[b]].forEach(([t])=>{const m=/^(\w)(\w)?$/.exec(t);if(m&&m[2]){H.E('tspan',{text:m[1]},geno);H.E('tspan',{text:m[2],'baseline-shift':'super',st:'font-size:.68em'},geno)}else H.E('tspan',{text:t},geno)})};
  // enzymes
  const enz=(x,lab,fl,dots)=>{const G=at(s,x,212);H.E('path',{d:'M0,0 L-14,26 A30,30 0 1 1 14,26 Z',st:`fill:${fl};stroke:var(--ink);stroke-width:2`},G);
    dots.forEach((c,i)=>H.E('circle',{cx:-16+i*11,cy:-10,r:3.6,st:`fill:${c};stroke:var(--ink);stroke-width:1`},G));
    rt(s,x,164,lab,'lb',{'text-anchor':'middle'});const L=s.lastChild;H.O(L,0,{d:0});G.lab=L;hide(G);return G};
  const eA=enz(150,'I^A allele → enzyme A','color-mix(in srgb, var(--good) 35%, var(--card))',['#fff','#fff','#fff','#fff']);
  const eB=enz(490,'I^B allele → enzyme B','color-mix(in srgb, var(--hi) 45%, var(--card))',['var(--ink)','var(--ink)','var(--ink)','var(--ink)']);
  const aa=H.g(s);H.E('path',{d:'M190,202 L450,202',st:'stroke:var(--muted);stroke-width:1.4;stroke-dasharray:4 4'},aa);H.txt(aa,320,194,'4 amino acids differ (dots)','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});H.O(aa,0,{d:0});
  // sugars
  const sq=xs.map(x=>{const G=at(s,150,228);H.E('rect',{x:-8,y:-8,width:16,height:16,rx:2,st:`fill:${SQ};stroke:var(--ink);stroke-width:1.4`},G);H.O(G,0,{d:0});G.x0=x;return G});
  const ci=xs.map(x=>{const G=at(s,490,228);H.E('circle',{r:9,st:`fill:${CI};stroke:var(--ink);stroke-width:1.4`},G);H.O(G,0,{d:0});G.x0=x;return G});
  const go=(arr,on,o)=>arr.forEach((G,i)=>{if(on(i)){H.O(G,1,{d:200,at:(o.at||0)+i*120});H.T(G,{x:G.x0,y:314},{d:900,at:(o.at||0)+i*120})}else{H.O(G,0,{d:400});H.T(G,{x:G.home,y:228},{d:600})}});
  sq.forEach(G=>G.home=150);ci.forEach(G=>G.home=490);
  // DNA strip for the O allele
  const seq='ATGGCGGTAGCCTTC';const D=H.g(s);H.O(D,0,{d:0});const bx=[];const L0=150;
  rt(D,20,112,'i allele','lb',{st:'font-size:13px'});
  for(let i=0;i<seq.length;i++){const G=at(D,L0+i*24,106);H.E('rect',{x:-11,y:-13,width:22,height:26,rx:4,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.2'},G);H.txt(G,0,5,seq[i],'lb',{'text-anchor':'middle',st:mono+';font-size:14px'});bx.push(G)}
  const cod=[0,1,2,3,4].map(k=>{const x=L0+k*72-12;const e=H.E('path',{d:`M${x+2},124 L${x+2},130 L${x+70},130 L${x+70},124`,st:'fill:none;stroke:var(--ink);stroke-width:1.6'},D);return e});
  const stop=H.g(D);H.E('rect',{x:L0+144-12,y:90,width:72,height:30,rx:5,st:'fill:none;stroke:var(--bad);stroke-width:3'},stop);H.txt(stop,L0+180-12,148,'STOP','lb',{'text-anchor':'middle',st:'fill:var(--bad)'});H.O(stop,0,{d:0});
  const delL=H.txt(D,L0+5*24,148,'deleted','lbs',{'text-anchor':'middle',st:'fill:var(--bad);font-weight:700'});H.O(delL,0,{d:0});
  const brk=at(s,320,224);H.E('path',{d:'M0,0 L-14,26 A30,30 0 0 1 -30,0',st:'fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:4 3'},brk);
  H.txt(brk,0,52,'short enzyme: no activity','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});hide(brk);
  const shift=on=>{bx.forEach((G,i)=>{if(i===5){H.T(G,{x:L0+i*24,y:on?132:106},{d:700});H.O(G,on?0:1,{d:500})}else if(i>5)H.T(G,{x:L0+(i-(on?1:0))*24,y:106},{d:800,at:on?500:0})})};
  return [
    ()=>{H.O(mem,1,{d:800})},
    ()=>{H.O(top,1);pop(eA);H.O(eA.lab,1);go(sq,()=>1,{at:600});setG('IA','IA');typ.textContent='A';H.O(CR,1);setB('IA','IA')},
    ()=>{go(sq,()=>0,{});pop(eB);H.O(eB.lab,1);H.O(aa,1,{at:500});go(ci,()=>1,{at:900});setG('IB','IB');typ.textContent='B';H.O(CR,1);setB('IB','IB')},
    ()=>{go(ci,()=>0,{});H.O(aa,0);[eA,eB].forEach(e=>{H.O(e,.15);H.O(e.lab,.15)});H.O(D,1);H.O(delL,1,{at:300});shift(true);H.O(stop,1,{at:1400});pop(brk,{at:1700});setG('i','i');typ.textContent='O';H.O(CR,0,{d:300})},
    ()=>{H.O(D,0);H.O(CR,1,{at:300});setB('IA','IB');hide(brk);H.O(brk,0);[eA,eB].forEach(e=>{H.O(e,1);H.O(e.lab,1)});go(sq,i=>i%2===0,{at:300});go(ci,i=>i%2===1,{at:450});setG('IA','IB');typ.textContent='AB'},
  ];}},

/* 14 ─────────────────────────────── */
{sec:'6.5',title:'ABO: Three Alleles, Four Blood Types',caption:'Rows = allele from the father · columns = allele from the mother · square = sugar A, circle = sugar B',
text:`<p data-step="0">The ABO gene has three common alleles: I<sup>A</sup>, I<sup>B</sup> and i. Each person has two of them, one from each parent. So there are six possible genotypes.</p>
<p data-step="1">I<sup>A</sup> and I<sup>B</sup> are codominant. I<sup>A</sup>/I<sup>B</sup> cells carry both sugars, so they are type AB.</p>
<p data-step="2">I<sup>A</sup> and I<sup>B</sup> are each completely dominant to i, because one working enzyme adds enough sugar. I<sup>A</sup>/I<sup>A</sup> and I<sup>A</sup>/i are type A. I<sup>B</sup>/I<sup>B</sup> and I<sup>B</sup>/i are type B.</p>
<p data-step="3">Only i/i people have no working enzyme. They are type O.</p>
<p data-step="4">So one gene can show two kinds of dominance. The kind depends on which two alleles you compare.</p>`,
star:'A with B: codominant. A or B with O: dominant.',starStep:4,
scene(H){const s=stage();const al=['I^A','I^B','i'];const cx=[262,382,502],cy=[110,200,290],CW=116,CH=86;
  const typeOf=(a,b)=>{const A=a===0||b===0,B=a===1||b===1;return A&&B?'AB':A?'A':B?'B':'O'};
  const grid=H.g(s);cx.forEach(x=>cy.forEach(y=>H.E('rect',{x:x-CW/2,y:y-CH/2,width:CW,height:CH,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},grid)));
  const top=al.map((a,j)=>rt(grid,cx[j],50,a,'lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:20px;fill:var(--mom)'}));
  const left=al.map((a,i)=>rt(grid,170,cy[i]+7,a,'lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:20px;fill:var(--dad)'}));
  H.txt(grid,cx[1],24,'FROM THE MOTHER','cap',{'text-anchor':'middle',st:'fill:var(--mom)'});H.txt(grid,108,cy[1]+4,'FROM THE','cap',{'text-anchor':'middle',st:'fill:var(--dad)'});H.txt(grid,108,cy[1]+18,'FATHER','cap',{'text-anchor':'middle',st:'fill:var(--dad)'});
  H.O(grid,0,{d:0});
  const cells=[];al.forEach((a,i)=>al.forEach((b,j)=>{const x=cx[j],y=cy[i],t=typeOf(i,j);const G=H.g(s);
    const g1=rt(G,0,0,a,'lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:14px;fill:var(--dad)'});H.T(g1,{x:170-0,y:cy[i]+7},{d:0});
    const g2=rt(G,0,0,b,'lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:14px;fill:var(--mom)'});H.T(g2,{x:cx[j],y:50},{d:0});
    const C=at(G,x-26,y+10);H.E('circle',{r:17,st:'fill:color-mix(in srgb, var(--bad) 30%, var(--card));stroke:var(--bad);stroke-width:2'},C);
    for(let k=0;k<6;k++){const an=k*60*Math.PI/180,px=26*Math.cos(an),py=26*Math.sin(an);H.E('line',{x1:17*Math.cos(an),y1:17*Math.sin(an),x2:21*Math.cos(an),y2:21*Math.sin(an),st:'stroke:var(--ink);stroke-width:1.5'},C);
      const useA=t==='A'||(t==='AB'&&k%2===0),useB=t==='B'||(t==='AB'&&k%2===1);
      if(useA)H.E('rect',{x:px-4.5,y:py-4.5,width:9,height:9,rx:1.5,st:'fill:var(--good);stroke:var(--ink);stroke-width:1'},C);
      if(useB)H.E('circle',{cx:px,cy:py,r:5,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1'},C);}
    const T=H.txt(G,x+26,y+18,t,'big',{'text-anchor':'middle',st:'font-size:24px'});
    [C,T].forEach(e=>H.O(e,0,{d:0}));H.O(g1,0,{d:0});H.O(g2,0,{d:0});
    G.show=()=>{H.O([g1,g2],1,{d:200});H.T(g1,{x:x-14,y:y-22},{d:900});H.T(g2,{x:x+14,y:y-22},{d:900});H.O(C,1,{at:800});H.O(T,1,{at:900})};
    G.t=t;cells.push(G)}));
  const slash=cells.map((G,k)=>{const e=H.txt(s,cx[k%3],cy[Math.floor(k/3)]-22,'/','lbs',{'text-anchor':'middle'});H.O(e,0,{d:0});return e});
  const sum=H.g(s);rt(sum,320,372,'6 genotypes → 4 blood types','lb',{'text-anchor':'middle',st:'font-size:15px'});
  rt(sum,320,398,'A: I^AI^A, I^Ai   ·   B: I^BI^B, I^Bi   ·   AB: I^AI^B   ·   O: ii','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600;font-size:13px'});H.O(sum,0,{d:0});
  const show=f=>cells.forEach((G,k)=>{if(f(G.t)){G.show();H.O(slash[k],1,{at:800})}});
  return [()=>{H.O(grid,1)},()=>show(t=>t==='AB'),()=>show(t=>t==='A'||t==='B'),()=>show(t=>t==='O'),()=>{H.O(sum,1)}];}},

/* 15 ─────────────────────────────── */
{sec:'6.6',title:'Haplosufficient or Haploinsufficient',caption:'Graph after A. J. Hunter, CC BY-SA 4.0 · bar = total function of the two alleles',
text:`<p data-step="0">Take a gene with a normal allele A<sup>+</sup> and a broken allele A<sup>−</sup> that makes little or no working product. A <b>loss-of-function</b> allele such as A<sup>−</sup> makes less product, or less active product, than wild type. An A<sup>+</sup>/A<sup>−</sup> heterozygote has a little over 50% of normal function.</p>
<p data-step="1">For most genes, the cell needs much less than 50%. These genes are <b>haplosufficient</b>: one normal copy is enough. A<sup>+</sup>/A<sup>−</sup> looks normal, so A<sup>−</sup> is recessive.</p>
<p data-step="2">For some genes, the cell needs more than 50%. These genes are <b>haploinsufficient</b>: one normal copy is not enough. A<sup>+</sup>/A<sup>−</sup> shows the mutant phenotype, so A<sup>−</sup> is dominant or semi-dominant.</p>
<p data-step="3">Example: most <i>Minute</i> genes of the fruit fly make proteins of the ribosome. With one broken copy, a fly grows short, thin bristles. With two broken copies, it dies.</p>`,
star:'Enough with one copy → the broken allele is recessive. Not enough → it is dominant.',starStep:2,
scene(H){const s=stage();const B=320,T=70,Hh=B-T,xs=[230,370,510],bw=86;const Y=v=>B-Hh*v;
  const ax=H.g(s);H.E('path',{d:`M120,${T-14} L120,${B} L600,${B}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},ax);
  [0,.5,1].forEach(v=>{H.E('line',{x1:114,y1:Y(v),x2:600,y2:Y(v),st:`stroke:var(--faint);stroke-width:1;${v?'stroke-dasharray:4 4':''}`},ax);H.txt(ax,108,Y(v)+4,Math.round(v*100)+'%','lbs',{'text-anchor':'end'})});
  H.txt(ax,20,40,'function, relative to A⁺/A⁺','lb',{st:'font-size:13px'});
  const gl=['A^+/A^+','A^+/A^−','A^−/A^−'];gl.forEach((g,i)=>rt(ax,xs[i],B+24,g,'lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:18px'}));
  const blk=(x,y0,h,c)=>{const r=H.E('rect',{x:0,y:-1,width:1,height:1,cls:'nss',st:`fill:var(--${c});stroke:var(--ink);stroke-width:1.5`},s);H.T(r,{x:x-bw/2,y:y0,sx:bw,sy:.001},{d:0});r.h=h;return r};
  const H5=Hh*.5,Hm=Hh*.05;
  const bl=[blk(xs[0],B,H5,'good'),blk(xs[0],B-H5,H5,'good'),blk(xs[1],B,H5,'good'),blk(xs[1],B-H5,Hm,'bad'),blk(xs[2],B,Hm,'bad'),blk(xs[2],B-Hm,Hm,'bad')];
  const key=H.g(s);H.E('rect',{x:440,y:30,width:14,height:14,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.2'},key);H.txt(key,460,42,'from A⁺','lbs');
  H.E('rect',{x:528,y:30,width:14,height:14,st:'fill:var(--bad);stroke:var(--ink);stroke-width:1.2'},key);H.txt(key,548,42,'from A⁻','lbs');H.O(key,0,{d:0});
  const th=H.g(s);H.E('line',{x1:120,y1:0,x2:600,y2:0,st:'stroke:var(--mom);stroke-width:3;stroke-dasharray:8 5'},th);const thl=H.txt(th,558,-8,'','lb',{st:'fill:var(--mom);font-size:13px'});const gk=H.txt(s,600,64,'','lb',{'text-anchor':'end',st:'font-size:13.5px'});
  H.T(th,{y:Y(.25)},{d:0});H.O(th,0,{d:0});
  const ver=xs.map(x=>{const t=H.txt(s,x,B+76,'','lb',{'text-anchor':'middle',st:'font-size:13.5px'});return t});
  const sub=xs.map(x=>H.txt(s,x,B+94,'','lbs',{'text-anchor':'middle'}));
  const say=(a,b)=>{a.forEach((t,i)=>{ver[i].textContent=t;ver[i].style.fill=t.startsWith('✓')?'var(--good)':'var(--bad)'});b.forEach((t,i)=>sub[i].textContent=t)};
  return [
    ()=>{H.O(key,1);bl.forEach((r,i)=>H.T(r,{sy:Math.max(.001,r.h)},{d:700,at:(i%2)*600+Math.floor(i/2)*150}))},
    ()=>{H.O(th,1);H.T(th,{y:Y(.25)},{d:600});thl.textContent='need ≈25%';gk.textContent='haplosufficient gene';say(['✓ normal','✓ normal','✗ mutant'],['','A⁻ is recessive',''])},
    ()=>{H.O(th,1);H.T(th,{y:Y(.7)},{d:1200});thl.textContent='need ≈70%';gk.textContent='haploinsufficient gene';H.after(900,()=>say(['✓ normal','✗ mutant','✗ mutant'],['','A⁻ is dominant','']))},
    ()=>{say(['✓ long bristles','✗ short bristles','✗ dies'],['wild type','Minute heterozygote','']);gk.textContent='Minute genes: haploinsufficient'},
  ];}},

/* 16 ─────────────────────────────── */
{sec:'6.6',title:'Dominant Negative and Gain of Function',caption:'Green = normal subunit · red = faulty subunit · a pair works only if both subunits are normal',
text:`<p data-step="0">Some mutant alleles are dominant for another reason: the mutant protein spoils the normal protein.</p>
<p data-step="1">Many proteins work as pairs or larger groups of subunits. One faulty subunit can block the whole group.</p>
<p data-step="2">A heterozygote makes normal and faulty subunits. If it makes equal amounts and they pair at random, only 1 pair in 4 has two normal subunits (½ × ½ = ¼). So the activity falls to about 25%. A heterozygote with a <b>null</b> allele (an allele that makes no protein) keeps 50%.</p>
<p data-step="3">A mutation of this kind is a <b>dominant-negative</b> mutation. Example: type I collagen, a protein rope of three chains in bone. Faulty chains spoil the rope and cause some forms of brittle-bone disease (osteogenesis imperfecta).</p>
<p data-step="4">Other mutant alleles make a product with more activity or a new activity. One copy is enough to add it, so <b>gain-of-function</b> alleles are almost always dominant.</p>`,
star:'Dominant negative: one faulty subunit spoils the pair.',starStep:3,
scene(H){const s=stage();
  const half=(p,c,side)=>{const G=at(p,0,0);H.E('path',{d:side<0?'M0,-14 A14,14 0 0 0 0,14 Z':'M0,-14 A14,14 0 0 1 0,14 Z',st:`fill:var(--${c});stroke:var(--ink);stroke-width:1.5`},G);G.c=c;return G};
  const pane=(x,t,sub)=>{const G=H.g(s);H.E('rect',{x:x,y:22,width:300,height:200,rx:12,st:'fill:none;stroke:var(--faint);stroke-width:1.5'},G);
    rt(G,x+150,44,t,'lb',{'text-anchor':'middle'});H.txt(G,x+150,62,sub,'lbs',{'text-anchor':'middle'});return G};
  const PL=pane(10,'A^+/null','null allele makes no subunits'),PR=pane(330,'A^+/A^m','allele m makes faulty subunits');H.O([PL,PR],0,{d:0});
  const rnd=k=>{let v=Math.sin(k*91.7)*43758.5;return v-Math.floor(v)};
  const scat=(h,x0,seed)=>{h.p0=[x0+30+rnd(seed)*250,96+rnd(seed+50)*100];H.T(h,{x:h.p0[0],y:h.p0[1]},{d:0});H.O(h,0,{d:0})};
  const lp=[[70,160],[130,160],[190,160],[250,160]];
  const L=[];for(let i=0;i<8;i++){const h=half(s,'good',i%2?1:-1);scat(h,10,1+i);h.t=lp[Math.floor(i/2)];L.push(h)}
  const rpos=[];for(let r=0;r<2;r++)for(let c=0;c<4;c++)rpos.push([395+c*62,118+r*62]);
  const pairs=[['good','good'],['good','bad'],['bad','good'],['bad','bad'],['good','bad'],['bad','bad'],['bad','good'],['good','good']];
  const R=[];pairs.forEach((pr,k)=>pr.forEach((c,j)=>{const h=half(s,c,j?1:-1);scat(h,330,30+k*2+j);h.t=rpos[k];R.push(h)}));
  const marks=[];const mark=(x,y,ok)=>{const t=H.txt(s,x,y+38,ok?'✓':'✗','lb',{'text-anchor':'middle',st:`font-size:18px;fill:var(--${ok?'good':'bad'})`});H.O(t,0,{d:0});marks.push(t);return t};
  lp.forEach(([x,y])=>mark(x,y,1));rpos.forEach((q,k)=>mark(q[0],q[1],pairs[k][0]==='good'&&pairs[k][1]==='good'));
  // activity bars
  const AB=H.g(s);const by=[262,294,326,358],lbl=['A^+/A^+','A^+/null','A^+/A^m','A^+/A^{gain}'],val=[1,.5,.25,1];
  H.txt(AB,20,244,'ACTIVITY','cap');const bars=by.map((y,i)=>{const G=H.g(AB);rt(G,24,y+5,lbl[i],'lb',{st:'font-family:var(--f-math);font-style:italic;font-size:15px'});
    const r=H.E('rect',{x:0,y:-10,width:1,height:20,cls:'nss',st:'fill:var(--good);stroke:var(--ink);stroke-width:1.2'},G);H.T(r,{x:118,y,sx:.001},{d:0});
    const t=H.txt(G,0,y+5,Math.round(val[i]*100)+'%','lb',{st:'font-size:13px'});H.T(t,{x:(i===3?122:124)+170*val[i]-(i===3?60:0)},{d:0});if(i===3)t.style.fill='var(--paper)';H.O(G,0,{d:0});G.r=r;G.v=val[i];return G});
  const nw=H.E('rect',{x:0,y:-10,width:1,height:20,cls:'nss',st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.2'},bars[3]);H.T(nw,{x:288,y:358,sx:.001},{d:0});
  const nwl=H.txt(bars[3],0,363,'+ new activity','lb',{st:'font-size:13px;fill:var(--ink)'});H.T(nwl,{x:336},{d:0});H.O(nwl,0,{d:0});
  H.O(AB,0,{d:0});
  // collagen rope
  const rope=H.g(s);H.txt(rope,550,244,'COLLAGEN ROPE','cap',{'text-anchor':'middle'});
  const strand=(ph,c,kink)=>{let d='';for(let x=480;x<=620;x+=4){const y=300+9*Math.sin((x-480)/14+ph)+(kink&&x>540&&x<580?(x-540)*(580-x)/30:0);d+=(x===480?'M':' L')+x+','+y.toFixed(1)}return H.E('path',{d,st:`fill:none;stroke:var(--${c});stroke-width:5;stroke-linecap:round`},rope)};
  strand(0,'good',1);strand(2.1,'good',1);strand(4.2,'bad',1);H.txt(rope,550,350,'one faulty chain','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});H.txt(rope,550,366,'bends the whole rope','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});H.O(rope,0,{d:0});
  const place=(h,x,y,o)=>H.T(h,{x,y},o);
  return [
    ()=>{H.O([PL,PR],1);[...L,...R].forEach((h,i)=>H.O(h,1,{d:300,at:200+i*30}))},
    ()=>{[...L,...R].forEach(h=>place(h,h.t[0],h.t[1],{d:1200}));marks.forEach(m=>H.O(m,1,{at:1300}))},
    ()=>{H.O(AB,1);bars.slice(0,3).forEach((G,i)=>{H.O(G,1,{at:i*250});H.T(G.r,{sx:170*G.v},{d:900,at:i*250})})},
    ()=>{H.O(rope,1)},
    ()=>{H.O(bars[3],1);H.T(bars[3].r,{sx:170},{d:900});H.T(nw,{sx:40},{d:700,at:900});H.O(nwl,1,{at:1400})},
  ];}},

/* 17 ─────────────────────────────── */
{sec:'6.7',title:'Classes of Mutants: Morphological',caption:'dog breeds, Mary Bloom, American Kennel Club, CC BY-SA 4.0, via Wikimedia Commons',
text:`<p data-step="0">Geneticists sort mutants by their effect into four classes: morphological, lethal, biochemical and conditional. Muller's morphs are a second system, based on the activity of the gene product.</p>
<p data-step="1"><b>Morphological</b> mutants change the visible form of an organism: its size, shape, colour or number of parts. An example is the curly wing of some fruit flies.</p>
<p data-step="2">Dog breeds show many morphological differences in body size, coat and the shape of the face. Changes in single genes cause many of these differences.</p>
<p data-step="3">Example: the hairless Chinese crested dog has one mutant copy of the FOXI3 gene. Puppies with two mutant copies are never born, because they die as embryos. So this allele is also a lethal allele, the next class.</p>`,
star:'Morphological = changes the form you can see.',starStep:1,
scene(H){const s=stage();const k=560/760;const W=560,Hh=585*k;const x0=40,y0=(420-Hh)/2-6;
  photo(s,'@@asset:dog-breeds.jpg@@',x0,y0,W,Hh,{r:10});
  const ring=(x,y,rx,ry,label,lx,ly)=>{const G=H.g(s);H.E('ellipse',{cx:x0+x*k,cy:y0+y*k,rx,ry,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:4'},G);
    const tw=label.length*7.4+16;H.E('rect',{x:lx,y:ly-16,width:tw,height:24,rx:6,st:'fill:#16181d;opacity:.88'},G);H.txt(G,lx+8,ly+1,label,'lb',{st:'fill:#fff;font-size:13px'});H.O(G,0,{d:0});return G};
  const big=ring(612,400,80,118,'large: deerhound',446,170),small=ring(290,500,70,52,'small breed',166,300);
  const face=ring(70,470,46,48,'short face',44,290+60);
  const hair=ring(495,95,58,72,'hairless: Chinese crested',236,40);
  const on=R=>{H.O(R,1);H.D(R.firstChild,1,{d:900})};
  return [()=>{},()=>{},()=>{on(big);on(small);on(face)},()=>{on(hair)}];}},

/* 18 ─────────────────────────────── */
{sec:'6.7',title:'Lethal Alleles: The Yellow Mouse',caption:'Photo: yellow laboratory mouse (strain with the yellow allele), Mouse Genome Database staff, CC BY 4.0, via Wikimedia Commons',
text:`<p data-step="0"><b>Lethal</b> mutants die early. In the fruit fly, a lethal mutation can kill the embryo, the larva (young grub) or the pupa (resting stage). Most lethal alleles are recessive, because one working copy keeps the organism alive.</p>
<p data-step="1">The mouse <b>agouti</b> gene makes a signal that tells hair pigment cells to make yellow pigment. The yellow allele (Y) is dominant for coat colour: one copy makes the coat yellow. The same allele is recessive for survival: YY embryos die.</p>
<p data-step="2">Two yellow mice (Yy × Yy) give 1 YY : 2 Yy : 1 yy. The YY embryos die, so the living pups are 2 yellow : 1 non-yellow.</p>
<p data-step="3">Y is a large deletion. It joins the agouti gene to the switch region of a neighbour gene, Raly. A switch region is the DNA that controls when a gene is active. So every cell makes the agouti signal, and the mouse is yellow and obese.</p>
<p data-step="4">The deletion also removes a second gene, Eif2s2, which every cell needs to make proteins. One copy of Eif2s2 is enough, but a YY embryo has none. So it dies at an early stage, at about the time it implants in the womb.</p>
<p data-step="4">So the kind of dominance depends on which part of the phenotype you study.</p>`,
star:'Yellow coat: dominant. Death: recessive. Same allele.',starStep:4,
scene(H){const s=stage();
  photo(s,'@@asset:yellow-mouse.jpg@@',0,10,230,172,{r:10});H.txt(s,115,204,'Yy: yellow coat','lb',{'text-anchor':'middle'});
  const PX=300,PY=40,C=108;const YEL='color-mix(in srgb, var(--hi) 70%, var(--mom))',DARK='var(--muted)';
  const mouse=(p,x,y,col)=>{const G=at(p,x,y);H.E('path',{d:'M-26,6 C-40,10 -46,-2 -54,4',st:'fill:none;stroke:var(--ink);stroke-width:2;stroke-linecap:round'},G);
    H.E('ellipse',{rx:26,ry:15,st:`fill:${col};stroke:var(--ink);stroke-width:1.8`},G);H.E('circle',{cx:24,cy:-6,r:11,st:`fill:${col};stroke:var(--ink);stroke-width:1.8`},G);
    H.E('circle',{cx:20,cy:-17,r:6,st:`fill:${col};stroke:var(--ink);stroke-width:1.5`},G);H.E('circle',{cx:28,cy:-8,r:1.8,cls:'kf'},G);return G};
  const P=H.g(s);const al=['Y','y'];
  al.forEach((a,j)=>H.txt(P,PX+C*j+C/2,PY-8,a,'lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:20px;fill:var(--mom)'}));
  al.forEach((a,i)=>H.txt(P,PX-16,PY+C*i+C/2+7,a,'lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:20px;fill:var(--dad)'}));
  const cells=[];for(let i=0;i<2;i++)for(let j=0;j<2;j++){const x=PX+C*j,y=PY+C*i;H.E('rect',{x,y,width:C,height:C,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},P);
    const g=al[i]+al[j];const G=H.g(s);const lab=g==='yY'?'Yy':g;H.txt(G,x+C/2,y+24,lab,'lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:17px'});
    const yy=lab==='yy',YY=lab==='YY';const m=mouse(G,x+C/2-4,y+64,YY?YEL:yy?DARK:YEL);
    const t=H.txt(G,x+C/2,y+C-8,YY?'':yy?'non-yellow':'yellow','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});
    H.O(G,0,{d:0});G.YY=YY;G.m=m;cells.push(G)}
  H.O(P,0,{d:0});
  const X=H.g(s);H.E('path',{d:`M${PX+18},${PY+40} L${PX+C-18},${PY+C-14} M${PX+C-18},${PY+40} L${PX+18},${PY+C-14}`,st:'stroke:var(--bad);stroke-width:5;stroke-linecap:round'},X);
  H.txt(X,PX+C/2,PY+C-6,'dies as embryo','lbs',{'text-anchor':'middle',st:'fill:var(--bad);font-weight:700'});H.O(X,0,{d:0});
  const rat=H.g(s);rt(rat,PX+C,PY+2*C+30,'living pups: 2 yellow : 1 non-yellow','lb',{'text-anchor':'middle',st:'font-size:14px'});H.O(rat,0,{d:0});
  // genome diagram
  const G2=H.g(s);const gy=330;H.E('line',{x1:20,y1:gy,x2:620,y2:gy,st:'stroke:var(--dad);stroke-width:6;stroke-linecap:round'},G2);
  const sw=H.g(G2);H.E('path',{d:`M40,${gy-12} L40,${gy-30} L58,${gy-30}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},sw);H.E('path',{d:`M54,${gy-35} L60,${gy-30} L54,${gy-25}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},sw);
  H.txt(G2,48,gy+40,'Raly switch','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});
  const raly=H.g(G2);H.E('rect',{x:70,y:gy-13,width:130,height:26,rx:4,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},raly);H.txt(raly,135,gy+5,'Raly','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});
  const eif=H.g(G2);H.E('rect',{x:214,y:gy-13,width:150,height:26,rx:4,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.5'},eif);H.txt(eif,289,gy+5,'Eif2s2 (every cell)','lbs',{'text-anchor':'middle',st:'fill:var(--paper);font-weight:700'});
  const gap=H.E('line',{x1:370,y1:gy,x2:452,y2:gy,st:'stroke:var(--dad);stroke-width:6'},G2);
  const ag=at(G2,520,gy);H.E('rect',{x:-62,y:-13,width:124,height:26,rx:4,st:`fill:${YEL};stroke:var(--ink);stroke-width:1.5`},ag);H.txt(ag,0,5,'agouti','lb',{'text-anchor':'middle',st:'font-size:13px;fill:#16181d'});
  const dl=H.g(s);H.E('rect',{x:66,y:gy-22,width:390,height:44,rx:8,st:'fill:none;stroke:var(--bad);stroke-width:2.5;stroke-dasharray:6 4'},dl);H.txt(dl,262,gy-30,'deleted in the Y allele','lb',{'text-anchor':'middle',st:'fill:var(--bad);font-size:13px'});H.O(dl,0,{d:0});
  const res=H.txt(s,330,gy+62,'Y allele: the Raly switch activates agouti in every cell → yellow coat','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});H.O(res,0,{d:0});
  const res2=H.txt(s,330,gy+80,'YY: no Eif2s2 on either chromosome → the embryo dies','lbs',{'text-anchor':'middle',st:'fill:var(--bad);font-weight:700'});H.O(res2,0,{d:0});
  const ghost=H.g(s);H.E('rect',{x:300,y:gy-13,width:150,height:26,rx:4,st:'fill:var(--card);stroke:var(--bad);stroke-width:2;stroke-dasharray:5 4'},ghost);H.txt(ghost,375,gy+5,'Eif2s2 missing','lbs',{'text-anchor':'middle',st:'fill:var(--bad);font-weight:700'});H.O(ghost,0,{d:0});
  H.O(G2,0,{d:0});
  return [
    ()=>{},
    ()=>{H.O(P,1);cells.forEach(G=>{if(!G.YY)H.O(G,.25)});H.O(cells[0],1,{at:300});H.O(cells[1],1,{at:300});H.O(X,1,{at:900});H.O(cells[0].m,.3,{at:900})},
    ()=>{H.O(P,1);cells.forEach((G,i)=>H.O(G,1,{at:i*150}));H.O(X,1,{at:800});H.O(cells[0].m,.3,{at:800});H.O(rat,1,{at:1200})},
    ()=>{H.O(G2,1);H.O(dl,1,{at:600});H.O([raly,eif,gap],0,{d:600,at:1400});H.T(ag,{x:126},{d:1200,at:1800});H.O(dl,0,{at:2600});H.O(res,1,{at:2800})},
    ()=>{H.O(ghost,1,{d:600});H.O(res2,1,{at:500})},
  ];}},

/* 19 ─────────────────────────────── */
{sec:'6.7',title:'Biochemical Mutants',caption:'Data of Beadle and Tatum, after A. Gathman, CC BY-NC-SA 2.0 · mutant n cannot do step n · + = grows, − = does not grow',
text:`<p data-step="0">A <b>biochemical pathway</b> is a chain of reactions. Each step uses one enzyme, and each enzyme is the product of one gene. The bread mould <i>Neurospora</i> makes the amino acid arginine. The last steps of this pathway are ornithine → citrulline → argininosuccinate → arginine.</p>
<p data-step="1">Beadle and Tatum studied this mould. Wild-type mould is <b>prototrophic</b>: it grows on a minimal medium and makes everything else itself. A minimal medium is food with only sugar, salts and one vitamin.</p>
<p data-step="2">A <b>biochemical mutant</b> cannot do one step of a pathway. A mutant that needs an extra nutrient, such as arginine, is <b>auxotrophic</b>.</p>
<p data-step="3">An auxotroph grows on every compound after its blocked step and on none before it. So the growth results show which step each mutant gene controls.</p>`,
star:'Auxotroph = needs a supplement. Prototroph = makes its own.',starStep:2,
scene(H){const s=stage();const nx=[50,170,290,410,560],ny=56;const nm=['precursor','ornithine','citrulline','argininosuccinate','arginine'];const gn=['step 1','step 2','step 3','step 4'];
  const pw=H.g(s);nm.forEach((t,i)=>{H.E('circle',{cx:nx[i],cy:ny,r:10,st:`fill:${i===4?'var(--good)':'var(--card)'};stroke:var(--ink);stroke-width:2`},pw);H.txt(pw,nx[i],ny+30,t,'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'})});
  const ar=gn.map((g,i)=>{const a=mkA(pw,nx[i]+14,ny,nx[i+1]-14,ny,{w:2,h:7});return a});
  const el=gn.map((g,i)=>{const G=H.g(pw);const x=(nx[i]+nx[i+1])/2;enzyme(G,x,ny-22,{r:8});H.txt(G,x,ny-36,g,'lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--ink)'});return G});
  H.O(pw,0,{d:0});
  const X=H.g(s);const xg=at(X,(nx[0]+nx[1])/2,ny);H.E('path',{d:'M-8,-8 L8,8 M8,-8 L-8,8',st:'stroke:var(--bad);stroke-width:4;stroke-linecap:round'},xg);H.O(X,0,{d:0});
  // table
  const tx=[150,240,330,420,520],ty0=152,rh=38;const cols=['nothing','ornithine','citrulline','arginino-','arginine'];
  const T=H.g(s);H.txt(T,20,ty0,'STRAIN','cap');H.txt(T,330,ty0-26,'GROWTH ON MINIMAL MEDIUM PLUS:','cap',{'text-anchor':'middle'});
  cols.forEach((c,i)=>{H.txt(T,tx[i],ty0,c,'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});if(i===3)H.txt(T,tx[i],ty0+14,'succinate','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'})});
  H.E('line',{x1:16,y1:ty0+22,x2:600,y2:ty0+22,st:'stroke:var(--ink);stroke-width:2'},T);H.O(T,0,{d:0});
  const rows=[['wild type',0],['mutant 1',1],['mutant 2',2],['mutant 3',3],['mutant 4',4]].map(([n,b],r)=>{const y=ty0+50+r*rh;const G=H.g(s);
    H.txt(G,20,y+5,n,'lb',{st:'font-size:14px'});
    const cells=tx.map((x,i)=>{const ok=r===0||i>=b;const t=H.txt(G,x,y+7,ok?'+':'−','lb',{'text-anchor':'middle',st:`font-size:22px;fill:var(--${ok?'good':'bad'})`});H.O(t,0,{d:0});return t});
    H.E('line',{x1:16,y1:y+20,x2:600,y2:y+20,st:'stroke:var(--faint);stroke-width:1'},G);H.O(G,0,{d:0});G.cells=cells;return G});
  const show=(r,at0)=>{H.O(rows[r],1,{at:at0});rows[r].cells.forEach((t,i)=>H.O(t,1,{at:at0+200+i*120}))};
  return [
    ()=>{H.O(pw,1);ar.forEach((a,i)=>drawA(a,{at:200+i*200}))},
    ()=>{H.O(T,1);show(0,300)},
    ()=>{H.O(X,1);show(1,300)},
    ()=>{H.T(xg,{x:(nx[1]+nx[2])/2},{d:600});show(2,200);H.after(1000,inst=>{H.T(xg,{x:(nx[2]+nx[3])/2},{d:inst?0:600})});show(3,1100);H.after(2000,inst=>{H.T(xg,{x:(nx[3]+nx[4])/2},{d:inst?0:600})});show(4,2100)},
  ];}},

/* 20 ─────────────────────────────── */
{sec:'6.7',title:'Conditional Mutants: The Siamese Cat',caption:'two Siamese cats, Steve Gilham, CC BY-NC-SA 2.0, via Flickr',
text:`<p data-step="0"><b>Conditional</b> mutants show the mutant phenotype only under some conditions. Under <b>restrictive</b> conditions, they look mutant. Under <b>permissive</b> conditions, they look wild type. Biochemical mutants are conditional too: the food medium is the condition.</p>
<p data-step="1">Siamese cats carry a temperature-sensitive allele of the TYR gene. TYR makes tyrosinase, the first enzyme in the pathway that makes the dark pigment melanin.</p>
<p data-step="2">The mutant enzyme loses its shape and stops working at body temperature. In the cooler ears, face, paws and tail, it keeps its shape and works. So these parts (breeders call them the points) are dark, and the warm body is light.</p>
<p data-step="3">For a conditional mutant, phenotype = genotype + environment + interaction. The same genotype gives dark fur in cool skin and light fur in warm skin.</p>`,
star:'Siamese cat: warm = light, cool = dark.',starStep:2,
scene(H){const s=stage();photo(s,'@@asset:siamese-cats.jpg@@',0,6,300,253,{r:10});
  const rg=H.g(s);[[160,214,30,26],[45,40,24,22],[230,25,22,40]].forEach(([x,y,rx,ry])=>H.E('ellipse',{cx:x,cy:6+y,rx,ry,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5'},rg));H.O(rg,0,{d:0});
  const cols=[[400,'WARM BODY','restrictive'],[560,'COOL POINTS','permissive']];
  const hd=cols.map(([x,t,c])=>{const G=H.g(s);H.txt(G,x,30,t,'cap',{'text-anchor':'middle',st:'fill:var(--ink)'});H.txt(G,x,48,c,'lbs',{'text-anchor':'middle'});H.O(G,0,{d:0});return G});
  const ez=cols.map(([x])=>{const e=enzyme(s,x,110,{r:22,fill:'color-mix(in srgb, var(--good) 40%, var(--card))'});H.O(e,0,{d:0});return e});
  const el=H.txt(s,480,154,'tyrosinase (TYR)','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});H.O(el,0,{d:0});
  const fur=cols.map(([x],i)=>{const G=H.g(s);const r=H.E('rect',{x:x-55,y:178,width:110,height:64,rx:8,st:`fill:var(--card);stroke:var(--ink);stroke-width:1.5`},G);
    const hairs=[];for(let k=0;k<11;k++){hairs.push(H.E('path',{d:`M${x-48+k*9.6},236 q4,-26 1,-50`,st:'fill:none;stroke:var(--faint);stroke-width:3;stroke-linecap:round'},G))}
    const t=H.txt(G,x,262,'','lb',{'text-anchor':'middle',st:'font-size:13px'});H.O(G,0,{d:0});G.hairs=hairs;G.t=t;return G});
  const eq=H.g(s);rt(eq,320,320,'phenotype = genotype + environment + interaction','lb',{'text-anchor':'middle',st:'font-size:16px'});
  rt(eq,320,350,'same TYR allele everywhere · different skin temperature · different fur','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});H.O(eq,0,{d:0});
  return [
    ()=>{hd.forEach(G=>H.O(G,1))},
    ()=>{ez.forEach(e=>H.O(e,1));H.O(el,1);H.O(rg,1,{at:400});H.D([...rg.children],1,{d:900,at:400})},
    ()=>{H.T(ez[0],{r:70,s:.9},{d:900});ez[0].body.style.strokeDasharray='4 3';H.K(ez[0].body,{fill:'card'},{d:700});
      fur.forEach((G,i)=>{H.O(G,1);H.K(G.hairs[0],{stroke:i?'ink':'faint'});G.hairs.forEach(h=>H.K(h,{stroke:i?'ink':'faint'},{d:800,at:400}));G.t.textContent=i?'enzyme works: dark fur':'enzyme fails: light fur'})},
    ()=>{H.O(eq,1)},
  ];}},

/* 21 ─────────────────────────────── */
{sec:'6.8',title:'Where a Mutation Can Act',caption:'Schematic gene: switch region, three exons (boxes) and two introns (thin lines)',
text:`<p data-step="0">A gene has a switch region and a coding region. The switch region (the <b>promoter</b> and <b>enhancers</b>) controls when, where and how much the cell transcribes the gene. The cell then removes parts of the RNA copy, the <b>introns</b>, in a step called <b>splicing</b>. The parts that stay are the <b>exons</b>. A ribosome translates them into protein.</p>
<p data-step="1"><b>Deletion.</b> A deletion removes the gene from the chromosome, so the cell makes no product.</p>
<p data-step="2"><b>Switch region.</b> A change can stop, reduce or increase transcription. A change can also activate the gene in a new tissue or at a new time.</p>
<p data-step="3"><b>Splicing.</b> A change can make the cell cut the RNA in the wrong place. The protein then has a wrong sequence.</p>
<p data-step="4"><b>Translation.</b> A change can stop, slow or increase the binding of the RNA to the ribosome.</p>
<p data-step="5"><b>Protein.</b> A change of one key amino acid can destroy or weaken the protein. It can also make the protein stronger or give it a new activity.</p>`,
star:'Switch → RNA → splicing → ribosome → protein: a mutation can hit any stage.',starStep:5,
scene(H){const s=H.g(stage());H.T(s,{y:16},{d:0});const Y1=70,Y2=170,Y3=250,Y4=340;
  const lab=(x,y,t)=>H.txt(s,x,y,t,'cap',{st:'fill:var(--muted)'});
  lab(16,Y1-34,'DNA');lab(16,Y2-28,'RNA');lab(16,Y3-26,'SPLICED RNA');lab(16,Y4-34,'PROTEIN');
  const dna=H.g(s);H.E('line',{x1:16,y1:Y1,x2:624,y2:Y1,st:'stroke:var(--dad);stroke-width:5'},dna);
  const sw=H.E('rect',{x:40,y:Y1-13,width:96,height:26,rx:5,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5;stroke-dasharray:4 3'},dna);H.txt(dna,88,Y1+30,'switch region','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});
  const ex=[[170,250],[320,410],[480,560]];ex.forEach(([a,b],i)=>{H.E('rect',{x:a,y:Y1-13,width:b-a,height:26,rx:4,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},dna);H.txt(dna,(a+b)/2,Y1+5,'exon '+(i+1),'lbs',{'text-anchor':'middle',st:'fill:#16181d;font-weight:700'})});
  [[250,320],[410,480]].forEach(([a,b])=>H.txt(dna,(a+b)/2,Y1+30,'intron','lbs',{'text-anchor':'middle'}));
  H.E('path',{d:`M152,${Y1-13} L152,${Y1-30} L172,${Y1-30}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},dna);H.E('path',{d:`M167,${Y1-35} L173,${Y1-30} L167,${Y1-25}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},dna);
  const r1=H.g(s);ex.forEach(([a,b])=>H.E('rect',{x:a,y:Y2-8,width:b-a,height:16,rx:3,st:'fill:var(--mom)'},r1));[[250,320],[410,480]].forEach(([a,b])=>H.E('line',{x1:a,y1:Y2,x2:b,y2:Y2,st:'stroke:var(--mom);stroke-width:4'},r1));
  const a1=mkA(s,606,Y1+18,606,Y2-10,{w:1.6,h:6});H.txt(r1,596,Y2-20,'transcription','lbs',{'text-anchor':'end'});
  const r2=H.g(s);let x=230;ex.forEach(([a,b])=>{H.E('rect',{x,y:Y3-8,width:b-a,height:16,rx:3,st:'fill:var(--mom)'},r2);x+=b-a});
  const rib=H.g(r2);H.E('ellipse',{cx:252,cy:Y3-14,rx:26,ry:14,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},rib);H.E('ellipse',{cx:252,cy:Y3+12,rx:20,ry:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},rib);H.txt(r2,290,Y3-26,'ribosome','lbs');
  const a2=mkA(s,606,Y2+10,606,Y3-10,{w:1.6,h:6});H.txt(r2,596,Y2+44,'splicing','lbs',{'text-anchor':'end'});
  const pr=H.g(s);const beads=[];for(let i=0;i<14;i++){beads.push(H.E('circle',{cx:200+i*20,cy:Y4,r:8,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.2'},pr))}
  const a3=mkA(s,606,Y3+10,606,Y4-10,{w:1.6,h:6});H.txt(pr,596,Y3+48,'translation','lbs',{'text-anchor':'end'});
  [r1,r2,pr,a1,a2,a3].forEach(e=>H.O(e,0,{d:0}));
  const hit=(x,y,t,ty)=>{const G=H.g(s);const z=at(G,x,y);H.E('path',{d:'M-4,-16 L6,-3 L-1,-1 L5,14 L-7,0 L0,-2 Z',st:'fill:var(--bad);stroke:var(--ink);stroke-width:1.2'},z);
    const tw=t.length*6.6+14;H.E('rect',{x:x-tw/2,y:ty-13,width:tw,height:20,rx:10,st:'fill:var(--bad)'},G);H.txt(G,x,ty+1,t,'lbs',{'text-anchor':'middle',st:'fill:var(--paper);font-weight:700'});H.O(G,0,{d:0});return G};
  const del=H.g(s);H.E('rect',{x:162,y:Y1-20,width:406,height:40,rx:6,st:'fill:var(--paper);opacity:.85'},del);H.E('rect',{x:162,y:Y1-20,width:406,height:40,rx:6,st:'fill:none;stroke:var(--bad);stroke-width:2.5;stroke-dasharray:6 4'},del);H.txt(del,365,Y1+5,'gene deleted: no product','lb',{'text-anchor':'middle',st:'fill:var(--bad);font-size:13px'});H.O(del,0,{d:0});
  const h2=hit(70,Y1-30,'none · less · more · new place or time',Y1+56);h2.lastChild.previousSibling.setAttribute('x',130);h2.lastChild.setAttribute('x',130+125);
  const bad=H.E('rect',{x:410,y:Y2-8,width:70,height:16,rx:3,st:'fill:var(--bad)'},s);H.O(bad,0,{d:0});const h3=hit(410,Y2-16,'intron kept by mistake',Y2+30);
  const h4=hit(226,Y3-4,'none · less · more protein',Y3+36);
  const h5=hit(400,Y4-18,'dead · weaker · stronger · new',Y4+30);const kb=beads[10];
  return [
    ()=>{H.O([a1,r1],1);drawA(a1);H.O([a2,r2],1,{at:700});drawA(a2,{at:700});H.O([a3,pr],1,{at:1400});drawA(a3,{at:1400})},
    ()=>{H.O(del,1)},
    ()=>{H.O(del,.0,{d:400});H.O(h2,1,{at:300})},
    ()=>{H.O(bad,1);H.O(h3,1,{at:300})},
    ()=>{H.O(h4,1)},
    ()=>{H.K(kb,{fill:'bad'});H.T(kb,{s:1},{d:0});H.O(h5,1,{at:300})},
  ];}},

/* 22 ─────────────────────────────── */
{sec:'6.8',title:"Muller's Morphs on One Dial",caption:'The dial reads the activity of one mutant allele · wild type = 100%',
text:`<p data-step="0">The geneticist Hermann Muller sorted mutant alleles into five classes, the <b>morphs</b>. The class depends on what the mutation does to the activity of the gene product. Each name is a Greek prefix plus <i>-morph</i> (form).</p>
<p data-step="1"><b>Amorph</b> (a- = without): no activity. An amorph is also a <b>null</b> allele: a complete <b>loss-of-function</b> allele.</p>
<p data-step="2"><b>Hypomorph</b> (hypo- = under): less activity than wild type. A hypomorph is a partial loss-of-function allele, also called a leaky allele.</p>
<p data-step="3"><b>Hypermorph</b> (hyper- = over): more of the same activity. A hypermorph is a <b>gain-of-function</b> allele.</p>
<p data-step="4"><b>Antimorph</b> (anti- = against): the product works against the wild-type product. An antimorph is a dominant-negative allele.</p>
<p data-step="5"><b>Neomorph</b> (neo- = new): the product does something new that the wild-type product does not do. A neomorph is a gain-of-function allele.</p>`,
star:'a- none · hypo- less · hyper- more · anti- against · neo- new.',starStep:5,
scene(H){const s=stage();const cx=250,cy=250,R=170;const vmin=-.5,vmax=2;const ang=v=>-120+(v-vmin)/(vmax-vmin)*240;
  const P=(a,r)=>[cx+r*Math.sin(a*Math.PI/180),cy-r*Math.cos(a*Math.PI/180)];
  const zone=(v0,v1,c,o)=>H.E('path',{d:H.sectorD(cx,cy,R-34,R,ang(v0),ang(v1)),st:`fill:${c};stroke:var(--ink);stroke-width:1.5;opacity:${o||1}`},s);
  zone(-.5,0,'color-mix(in srgb, var(--bad) 45%, var(--card))');zone(0,1,'color-mix(in srgb, var(--dad) 22%, var(--card))');zone(1,2,'color-mix(in srgb, var(--good) 35%, var(--card))');
  [[-.5,'below 0'],[0,'0%'],[.5,'50%'],[1,'100%'],[1.5,'150%'],[2,'200%']].forEach(([v,t])=>{const [x,y]=P(ang(v),R+16);H.txt(s,x,y+4,t,'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});
    const [a,b]=P(ang(v),R-34),[c,d]=P(ang(v),R);H.E('line',{x1:a,y1:b,x2:c,y2:d,st:'stroke:var(--ink);stroke-width:1.5'},s)});
  const zl=[[-.25,'blocks'],[.27,'less'],[1.72,'more']];zl.forEach(([v,t])=>{const [x,y]=P(ang(v),R-17);H.txt(s,x,y+4,t,'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'})});
  const wt=H.g(s);const [wx,wy]=P(ang(1),R+36);H.txt(wt,wx,wy,'wild type','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});
  const nd=H.g(s);H.E('path',{d:`M-5,0 L0,${-(R-46)} L5,0 Z`,st:'fill:var(--ink)'},nd);H.E('circle',{r:10,st:'fill:var(--ink)'},nd);H.T(nd,{x:cx,y:cy,r:ang(1)},{d:0});
  const name=H.txt(s,cx,cy+56,'WILD TYPE','big',{'text-anchor':'middle',st:'font-size:26px'});const sub=H.txt(s,cx,cy+80,'100% activity','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});
  const cls=H.txt(s,cx,cy+102,'','lbs',{'text-anchor':'middle'});
  // new-activity lamp
  const lamp=H.g(s);const lx=545,ly=150;H.E('rect',{x:lx-62,y:ly-70,width:124,height:150,rx:12,st:'fill:none;stroke:var(--faint);stroke-width:1.5'},lamp);
  H.txt(lamp,lx,ly-50,'NEW ACTIVITY','cap',{'text-anchor':'middle'});const bulb=H.E('circle',{cx:lx,cy:ly+4,r:30,st:'fill:var(--card);stroke:var(--ink);stroke-width:2'},lamp);
  const rays=[];for(let k=0;k<8;k++){const a=k*45*Math.PI/180;rays.push(H.E('line',{x1:lx+38*Math.cos(a),y1:ly+4+38*Math.sin(a),x2:lx+48*Math.cos(a),y2:ly+4+48*Math.sin(a),st:'stroke:var(--hi);stroke-width:4;stroke-linecap:round;opacity:0'},lamp))}
  const ll=H.txt(lamp,lx,ly+66,'off','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});
  const set=(v,n,t,c,o)=>{H.T(nd,{r:ang(v)},Object.assign({d:1300},o));name.textContent=n;sub.textContent=t;cls.textContent=c};
  const lampOn=on=>{H.K(bulb,{fill:on?'hi':'card'});rays.forEach(r=>H.O(r,on?1:0));ll.textContent=on?'on: something new':'off'};
  return [
    ()=>{set(1,'WILD TYPE','100% activity','');lampOn(0)},
    ()=>{set(0,'AMORPH','0% · no activity','null · loss of function');lampOn(0)},
    ()=>{set(.4,'HYPOMORPH','less than 100%','partial loss of function · leaky');lampOn(0)},
    ()=>{set(1.75,'HYPERMORPH','more than 100%','gain of function · more of the same');lampOn(0)},
    ()=>{set(-.35,'ANTIMORPH','below zero: blocks wild type','dominant negative');lampOn(0)},
    ()=>{name.textContent='NEOMORPH';sub.textContent='a new activity: not on this dial';cls.textContent='gain of function · something new';lampOn(1);H.O(nd,0,{d:600})},
  ];}},

/* 23 ─────────────────────────────── */
{sec:'6.8',title:"Muller's Test: Add or Remove Wild-Type Copies",caption:'Model bars · green = normal activity (one + copy = 1 unit) · yellow = new activity · dashed line = 1 unit, enough for wild type here',
text:`<p data-step="0">Muller's test pairs the mutant allele (m) with three standard alleles. These are a deletion (Df, no copy) and a wild-type allele (+). The third is a wild-type allele plus a duplication (Dp, one more wild-type copy).</p>
<p data-step="1"><b>Amorph.</b> m/Df is the same as m/m, because m adds nothing. Each wild-type copy moves the phenotype toward wild type.</p>
<p data-step="2"><b>Hypomorph.</b> m/Df is more severe than m/m, because two hypomorph copies give more activity than one. Wild-type copies restore the wild-type phenotype.</p>
<p data-step="3"><b>Hypermorph.</b> m/Df is milder than m/m. Extra wild-type copies make the phenotype stronger, because they add more of the same activity.</p>
<p data-step="4"><b>Antimorph.</b> m/+ already looks mutant, because m blocks the wild-type product. Extra wild-type copies make the phenotype milder.</p>
<p data-step="5"><b>Neomorph.</b> The new phenotype depends only on the number of m copies. Extra or missing wild-type copies do not change it.</p>`,
star:'Add or remove wild-type copies and watch the phenotype. The change names the morph.',starStep:5,
scene(H){const s=stage();const cols=['m/m','m/Df','m/+','m/+ + Dp'],plus=[0,0,1,2],mm=[2,1,1,1];const cx=[176,290,404,524],ry=[96,152,208,264,320],U=19;
  H.txt(s,20,48,'MORPH','cap');cols.forEach((c,j)=>rt(s,cx[j]+20,48,c,'lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:15px'}));
  H.E('line',{x1:16,y1:62,x2:624,y2:62,st:'stroke:var(--ink);stroke-width:2'},s);
  const act={amorph:(p,m)=>[p,0],hypomorph:(p,m)=>[p+.4*m,0],hypermorph:(p,m)=>[p+2.2*m,0],antimorph:(p,m)=>[Math.max(0,p-.75*m),0],neomorph:(p,m)=>[p,m]};
  const names=['amorph','hypomorph','hypermorph','antimorph','neomorph'];
  const rows=names.map((n,i)=>{const G=H.g(s);const y=ry[i];H.txt(G,20,y+5,n,'lb',{st:'font-size:14px'});
    cx.forEach((x,j)=>{const [a,nw]=act[n](plus[j],mm[j]);const x0=x-44;
      H.E('line',{x1:x0+U,y1:y-14,x2:x0+U,y2:y+14,st:'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 3'},G);
      const r=H.E('rect',{x:0,y:-10,width:1,height:20,cls:'nss',st:'fill:var(--good);stroke:var(--ink);stroke-width:1'},G);H.T(r,{x:x0,y,sx:.001},{d:0});
      const r2=H.E('rect',{x:0,y:-10,width:1,height:20,cls:'nss',st:'fill:var(--hi);stroke:var(--ink);stroke-width:1'},G);H.T(r2,{x:x0+Math.min(a,6)*U,y,sx:.001},{d:0});
      if(!a&&!nw)H.txt(G,x0+4,y+5,'0','lbs');
      G['b'+j]=[r,a,r2,nw]});
    H.E('line',{x1:16,y1:y+28,x2:624,y2:y+28,st:'stroke:var(--faint);stroke-width:1'},G);H.O(G,0,{d:0});return G});
  const grow=(G,o)=>[0,1,2,3].forEach(j=>{const [r,a,r2,nw]=G['b'+j];H.T(r,{sx:Math.max(.001,Math.min(a,6)*U)},Object.assign({d:800,at:j*150},o));if(nw)H.T(r2,{sx:nw*U},Object.assign({d:800,at:400+j*150},o))});
  const notes=['m/Df same as m/m','m/Df: less activity, more severe','m/Df milder · + makes it more severe','m/+ mutant · + helps','only m copies matter'];
  const nt=notes.map((t,i)=>{const e=H.txt(s,620,ry[i]+22,t,'lbs',{'text-anchor':'end',st:'font-size:10.5px'});H.O(e,0,{d:0});return e});
  const key=H.g(s);H.txt(key,20,380,'Model: + = 1 unit · Df = 0 · amorph 0 · hypomorph 0.4 · hypermorph 2.2 · antimorph cancels 0.75 · neomorph = new','lbs',{st:'font-size:11px'});H.O(key,0,{d:0});
  return [()=>{H.O(key,1)},...rows.map((G,i)=>()=>{H.O(G,1);grow(G);H.O(nt[i],1,{at:900})})];}},

/* 24 ─────────────────────────────── */
{sec:'6.8',title:'Gain of Function: More or New',caption:'Photo: wild-type fly (left) and Antennapedia mutant (right), arrows mark the antenna · BQUB15-Rcayuela, CC BY-SA 3.0, via Wikimedia Commons',
text:`<p data-step="0"><b>Hypermorph.</b> The classic hypermorph is a gene duplication. Two copies of the gene on one chromosome make more of the same product.</p>
<p data-step="1"><b>Neomorph.</b> A classic neomorph is the result of a chromosome <b>rearrangement</b>: the chromosome breaks and rejoins in a new order. The rearrangement places the switch region of one gene next to another gene. That gene then becomes active in a new tissue or at a new time.</p>
<p data-step="2">Example: dominant <i>Antennapedia</i> mutations in the fruit fly. The <i>Antennapedia</i> gene normally gives the middle body segment (the thorax, which carries the legs) its identity. A rearrangement activates it in the head. The head then builds thorax parts, so the fly grows legs in place of its antennae.</p>`,
star:'Hypermorph = more of the same. Neomorph = something new, for example a gene active in the wrong place.',starStep:2,
scene(H){const s=stage();const k=640/760;photo(s,'@@asset:antennapedia.jpg@@',0,4,640,284*k,{r:10});
  const pl=H.g(s);[[12,'wild type: antenna'],[332,'Antennapedia: leg on the head']].forEach(([x,t])=>{const w=t.length*7.3+16;H.E('rect',{x,y:12,width:w,height:24,rx:6,st:'fill:#16181d;opacity:.88'},pl);H.txt(pl,x+8,29,t,'lb',{st:'fill:#fff;font-size:13px'})});H.O(pl,0,{d:0});
  const Y=270,Y2=350;
  // duplication
  const D=H.g(s);H.txt(D,20,Y-16+10,'HYPERMORPH: DUPLICATION','cap');H.E('line',{x1:20,y1:Y+14,x2:290,y2:Y+14,st:'stroke:var(--dad);stroke-width:6;stroke-linecap:round'},D);
  const g1=at(D,90,Y+14);H.E('rect',{x:-30,y:-12,width:60,height:24,rx:4,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.5'},g1);H.txt(g1,0,5,'gene','lbs',{'text-anchor':'middle',st:'fill:var(--paper);font-weight:700'});
  const g2=at(D,90,Y+14);H.E('rect',{x:-30,y:-12,width:60,height:24,rx:4,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.5'},g2);H.txt(g2,0,5,'copy','lbs',{'text-anchor':'middle',st:'fill:var(--paper);font-weight:700'});
  const dots=[];for(let i=0;i<8;i++){const e=enzyme(D,90,Y+14,{r:7});H.O(e,0,{d:0});e.to=[40+i*30,Y2+18];e.src=i<4?90:170;dots.push(e)}
  H.txt(D,155,Y2+46,'twice the product','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});H.O(D,0,{d:0});
  // rearrangement
  const Rr=H.g(s);H.txt(Rr,340,Y+10,'NEOMORPH: REARRANGEMENT','cap');
  H.E('line',{x1:340,y1:Y+30,x2:620,y2:Y+30,st:'stroke:var(--dad);stroke-width:6;stroke-linecap:round'},Rr);
  const hs=H.g(Rr);H.E('rect',{x:350,y:Y+18,width:70,height:24,rx:4,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5;stroke-dasharray:4 3'},hs);H.txt(hs,385,Y+34,'head switch','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700;font-size:11px'});
  H.E('line',{x1:340,y1:Y2+10,x2:620,y2:Y2+10,st:'stroke:var(--mom);stroke-width:6;stroke-linecap:round'},Rr);
  const gx=at(Rr,470,Y+30);H.E('rect',{x:-38,y:-12,width:76,height:24,rx:4,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},gx);H.txt(gx,0,5,'head gene','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700;font-size:11px'});
  const an=at(Rr,560,Y2+10);H.E('rect',{x:-42,y:-12,width:84,height:24,rx:4,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.5'},an);H.txt(an,0,5,'Antennapedia','lbs',{'text-anchor':'middle',st:'fill:var(--paper);font-weight:700;font-size:11px'});
  const res=H.txt(Rr,480,Y2+48,'','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});H.O(Rr,0,{d:0});
  return [
    ()=>{H.O(D,1);H.T(g2,{x:170},{d:900,at:300});dots.forEach((e,i)=>{H.T(e,{x:e.src},{d:0});H.O(e,1,{d:200,at:1100+i*100});H.T(e,{x:e.to[0],y:e.to[1]},{d:900,at:1100+i*100})})},
    ()=>{H.O(Rr,1);H.T(gx,{x:560,y:Y2+10},{d:1200,at:400});H.T(an,{x:470,y:Y+30},{d:1200,at:400});H.after(1700,()=>{res.textContent='Antennapedia is now active in the head'})},
    ()=>{H.O(pl,1)},
  ];}},

/* 25 ─────────────────────────────── */
{sec:'6.5–6.8',title:'Dominance and Morphs at a Glance',wide:true,steps:2,
text:`<div class="tblwrap" data-step="0"><table class="tbl">
<thead><tr><th>Dominance type</th><th>What the two products do</th><th>Heterozygote</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Complete dominance</td><td>Half the working protein gives the full phenotype</td><td>looks like the dominant homozygote</td><td>pea flower colour: Aa is purple</td></tr>
<tr><td>Incomplete (semi) dominance</td><td>The phenotype follows the amount of product</td><td>between the two homozygotes</td><td>snapdragon: R<sup>1</sup>R<sup>2</sup> is pink</td></tr>
<tr><td>Codominance</td><td>Both alleles make working, different products</td><td>shows both phenotypes</td><td>ABO: I<sup>A</sup>I<sup>B</sup> is type AB</td></tr>
</tbody></table></div>
<div class="tblwrap" data-step="1"><table class="tbl">
<thead><tr><th>Morph</th><th>Activity of the product</th><th>Usual dominance over wild type</th><th>Classic example</th></tr></thead>
<tbody>
<tr><td>Amorph (null)</td><td>none</td><td>recessive; dominant if the gene is haploinsufficient</td><td>white eyes (<i>w</i>); <i>Minute</i> (haploinsufficient); ABO i allele</td></tr>
<tr><td>Hypomorph</td><td>less of the same</td><td>recessive</td><td>apricot eyes (<i>w</i><sup>a</sup>)</td></tr>
<tr><td>Hypermorph</td><td>more of the same</td><td>dominant</td><td>gene duplication</td></tr>
<tr><td>Antimorph</td><td>blocks the wild-type product</td><td>dominant (dominant negative)</td><td>faulty collagen chains in brittle bone disease</td></tr>
<tr><td>Neomorph</td><td>a new activity</td><td>dominant</td><td><i>Antennapedia</i>: legs on the head</td></tr>
</tbody></table></div>`,
star:'Loss of function: usually recessive. Gain of function or dominant negative: usually dominant.',starStep:1},

/* 26 ─────────────────────────────── */
{sec:'6.9',title:'Summary',wide:true,steps:2,
text:`<div class="cols" data-step="0"><div><h3>Genes and copies</h3><ul>
<li>A locus is the position of a gene. An allele is one DNA sequence of that gene. Symbols such as A/a, w<sup>+</sup>/w and I<sup>A</sup>/i write the genotype.</li>
<li>A somatic mutation affects the individual but not its children. A germline mutation passes to the children but does not affect the parent.</li>
<li>A diploid cell can be homozygous, heterozygous or hemizygous at a locus.</li>
<li>Phenotype depends on the alleles, their dominance, and often other genes and the environment. One gene can affect many traits (pleiotropy). Many genes can affect one trait (polygenic inheritance).</li>
</ul></div><div><h3>Dominance and morphs</h3><ul>
<li>Dominance is a result of protein amount and activity. Complete dominance: half the protein is enough. Incomplete dominance: the phenotype follows the dose. Codominance: both products work and both show.</li>
<li>Haplosufficient genes make loss-of-function alleles recessive. Haploinsufficient genes make them dominant.</li>
<li>Muller's morphs classify every mutant allele: amorph, hypomorph, hypermorph, neomorph and antimorph.</li>
</ul></div></div>
<p data-step="1" class="note">Mutant classes by effect are morphological (form) and lethal (early death). They are also biochemical (one blocked step of a pathway) and conditional (mutant only under restrictive conditions).</p>`},

/* 27 ─────────────────────────────── */
{sec:'6.10',title:'Key Terms',wide:true,steps:1,
text:`<div class="terms" data-step="0">
<div class="term"><b>Locus</b>The position of a gene on a chromosome.</div>
<div class="term"><b>Allele</b>One form of a gene: one DNA sequence at a locus.</div>
<div class="term"><b>Wild-type</b>The most common allele in a natural population. Symbol +.</div>
<div class="term"><b>Variant</b>An allele whose DNA sequence differs from the wild type.</div>
<div class="term"><b>Genotype</b>The set of alleles that an organism has.</div>
<div class="term"><b>Phenotype</b>The visible or detectable effect of the alleles.</div>
<div class="term"><b>Homozygous</b>Both alleles at a locus are the same.</div>
<div class="term"><b>Heterozygous</b>The two alleles at a locus are different.</div>
<div class="term"><b>Hemizygous</b>Only one copy of a gene, as for X genes in males.</div>
<div class="term"><b>Dominant</b>An allele that sets the heterozygote phenotype.</div>
<div class="term"><b>Recessive</b>An allele that shows only in the homozygote.</div>
<div class="term"><b>Complete dominance</b>The heterozygote has the same phenotype as the dominant homozygote.</div>
<div class="term"><b>Incomplete (semi) dominance</b>The heterozygote is between the two homozygotes.</div>
<div class="term"><b>Co-dominance</b>The heterozygote shows the phenotypes of both alleles.</div>
<div class="term"><b>ABO blood group</b>Types A, B, AB and O, set by the alleles I<sup>A</sup>, I<sup>B</sup> and i.</div>
<div class="term"><b>Haplosufficiency</b>One normal copy of a gene is enough for the wild type.</div>
<div class="term"><b>Haploinsufficiency</b>One normal copy is not enough for the wild type.</div>
<div class="term"><b>Loss-of-function</b>An allele with less activity than wild type, or none.</div>
<div class="term"><b>Gain-of-function</b>An allele with more activity, or a new activity.</div>
<div class="term"><b>Null</b>An allele with no activity at all. Same as amorph.</div>
<div class="term"><b>Amorph</b>A mutant allele with no activity.</div>
<div class="term"><b>Hypomorph</b>A mutant allele with less activity than wild type.</div>
<div class="term"><b>Hypermorph</b>A mutant allele with more of the same activity.</div>
<div class="term"><b>Neomorph</b>A mutant allele with a new activity.</div>
<div class="term"><b>Antimorph</b>A mutant allele whose product blocks the wild type (dominant negative).</div>
</div>`},

/* 28 ─────────────────────────────── */
{sec:'6.11–6.12',title:'Check Your Understanding (1)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">1. Distinguish among these terms: gene, locus, allele, transcription unit.</div><button>Show answer</button><div class="a" hidden><b>Gene:</b> a general term for a segment of DNA that is responsible for one or more phenotypes. <b>Locus:</b> the position of a gene on a chromosome. <b>Allele:</b> one form (one DNA sequence) of a gene at a locus. <b>Transcription unit:</b> the segment of DNA that the cell copies into RNA. For a gene that codes for a protein, this RNA is usually messenger RNA (mRNA).</div></div>
<div class="qa"><div class="q">2. A red-flowered diploid plant × a white-flowered diploid plant gives only red progeny. Show the cross with two kinds of symbols. What if all the progeny were pink?</div><button>Show answer</button><div class="a" hidden><b>Capital and small letters:</b> RR (red) × rr (white) → Rr (red). R is dominant to r. <b>Wild-type superscripts:</b> r<sup>+</sup>r<sup>+</sup> (red) × r<sup>−</sup>r<sup>−</sup> (white) → r<sup>+</sup>r<sup>−</sup> (red). r<sup>+</sup> is dominant to r<sup>−</sup>. <b>Pink progeny:</b> the crosses are the same, but now R (or r<sup>+</sup>) is incompletely (semi-) dominant. Better symbols are R<sup>1</sup>R<sup>1</sup> × R<sup>2</sup>R<sup>2</sup> → R<sup>1</sup>R<sup>2</sup> (pink).</div></div>
<div class="qa"><div class="q">3. Your blood type is B. What are the possible genotypes of your parents at the ABO locus?</div><button>Show answer</button><div class="a" hidden>Your genotype is I<sup>B</sup>I<sup>B</sup> or I<sup>B</sup>i. <b>If I<sup>B</sup>I<sup>B</sup>:</b> each parent gave you I<sup>B</sup>. So each parent is I<sup>B</sup>I<sup>B</sup>, I<sup>B</sup>i or I<sup>A</sup>I<sup>B</sup>. <b>If I<sup>B</sup>i:</b> one parent gave you I<sup>B</sup> (I<sup>B</sup>I<sup>B</sup>, I<sup>B</sup>i or I<sup>A</sup>I<sup>B</sup>). The other parent gave you i (I<sup>A</sup>i, I<sup>B</sup>i or ii). Together: one parent must carry I<sup>B</sup>. The other parent can have any genotype except I<sup>A</sup>I<sup>A</sup>.</div></div>
</div>
<div class="qa" data-step="0" style="margin-top:12px;display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);column-gap:22px;align-items:start"><div class="q" style="grid-row:1/3">5. True-breeding fruit-fly bristle mutants (one locus) are each crossed to wild type. The heterozygous progeny show: #1 bristles 20% shorter; #2 bristles 30% longer; #3 bristles 50% shorter; #4 bristles kinked and misshapen; #5 bristles missing. Name the Muller's morph of each mutant.</div><button style="justify-self:start">Show answer</button><div class="a" hidden>Each progeny fly is m/+. Assume that bristle length follows the total activity (+/+ = 100%).<br><b>#1 hypomorph:</b> 80% total. The + copy gives 50%, so m adds 30%: less than a + copy, but more than nothing.<br><b>#2 hypermorph:</b> more than 100%, so m adds extra activity of the same kind.<br><b>#3 amorph:</b> 50% total, so m adds nothing; only the + copy works.<br><b>#4 neomorph:</b> a new shape, so m does something new.<br><b>#5 antimorph:</b> about 0% total, worse than an amorph (50%), so m blocks the + product too.</div></div>
`},

/* 29 ─────────────────────────────── */
{sec:'6.11–6.12',title:'Check Your Understanding (2)',wide:true,steps:1,
text:`<div style="display:flex;flex-direction:column;gap:12px" data-step="0">
<div class="qa" style="display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);column-gap:22px;align-items:start"><div class="q" style="grid-row:1/3">4. Mouse hair colour. Match each case to one term: haplosufficiency, haploinsufficiency, pleiotropy, incomplete dominance, co-dominance, incomplete penetrance, variable (broad) expressivity. The symbols say nothing about dominance.
<div class="tblwrap"><table class="tbl" style="font-size:14px"><thead><tr><th>Case</th><th>A1A1</th><th>A1A2</th><th>A2A2</th></tr></thead><tbody>
<tr><td>1</td><td>black</td><td>each mouse: 50% black hairs, 50% white hairs</td><td>white</td></tr>
<tr><td>2</td><td>black</td><td>all hairs one shade of grey</td><td>white</td></tr>
<tr><td>3</td><td>black</td><td>black</td><td>50% of mice all white, 50% all black</td></tr>
<tr><td>4</td><td>black</td><td>black</td><td>no hair</td></tr>
<tr><td>5</td><td>black</td><td>white</td><td>white</td></tr>
<tr><td>6</td><td>black</td><td>black</td><td>white</td></tr>
<tr><td>7</td><td>black</td><td>black</td><td>a wide range of greys</td></tr>
</tbody></table></div></div><button style="justify-self:start">Show answer</button><div class="a" hidden>Take A1 as the allele that makes black pigment.<br><b>1</b> co-dominance: both phenotypes show in one mouse.<br><b>2</b> incomplete dominance: grey is between black and white.<br><b>3</b> incomplete penetrance: only some A2A2 mice show the white phenotype.<br><b>4</b> pleiotropy: the same gene affects colour and hair growth.<br><b>5</b> haploinsufficiency: one A1 copy is not enough for black.<br><b>6</b> haplosufficiency: one A1 copy is enough for black.<br><b>7</b> variable expressivity: the A2A2 phenotype shows at different strengths.</div></div>

</div>`},

]});
})();
