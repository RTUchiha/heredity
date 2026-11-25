/* Chapter 5 · The Complementation Test · source: Hairdity.pdf ch.5 (Singh, Introduction to Genetics, CC BY-NC-SA 4.0) */
(function(){
const H=window.HL;

/* ---- deck-local colour tokens: pigment purple, white petals, fly colours, table tints ---- */
(function(){const D='--pig:#c79bff;--pig-tint:#35264f;--petal:#e9edf4;--pk:#0d0f13;--good-tint:#173a2b;--bad-tint:#4b2124;--brn:#c08a52;--red:#ff5d5d;';
  const st=document.createElement('style');
  st.textContent=':root{--pig:#7b3fc4;--pig-tint:#ece1fa;--petal:#ffffff;--pk:#16181d;--good-tint:#d8f0e3;--bad-tint:#fbdfdf;--brn:#7a4a1e;--red:#c8262c}'+
   '@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){'+D+'}}:root[data-theme="dark"]{'+D+'}';
  document.head.appendChild(st);})();

/* ---- deck-local helpers ---- */
function mkA(p,x1,y1,x2,y2,o){const a=H.arrow(p,x1,y1,x2,y2,o);H.O(a.lastChild,0,{d:0});return a;}
function drawA(a,o){H.D(a.firstChild,1,Object.assign({d:600},o));H.O(a.lastChild,1,Object.assign({d:200},o,{at:((o&&o.at)||0)+450}));}
function undrawA(a,o){H.D(a.firstChild,0,Object.assign({d:300},o));H.O(a.lastChild,0,Object.assign({d:150},o));}
function pop(e,o){H.T(e,{s:e._s||1},Object.assign({d:700},o));H.O(e,1,Object.assign({d:300},o));}
function hide(e){H.T(e,{s:.001},{d:0});H.O(e,0,{d:0});}
function tx(p,x,y,t,cls,st,anchor){return H.txt(p,x,y,t,cls||'lb',{'text-anchor':anchor||'middle',st:st||null});}
function grp(p,x,y,s){const G=H.g(p);H.T(G,{x,y,s:s||1},{d:0});G._s=s||1;return G;}
/* gene box: filled = working copy, hollow + red badge = broken copy */
function geneBox(p,x,y,o){o=Object.assign({w:30,h:22,ok:true,col:'dad',fs:14},o);const G=grp(p,x,y);
  const t1=o.t||o.n.toUpperCase(),t0=o.tb||o.n.toLowerCase();
  G.on=H.g(G);G.off=H.g(G);
  H.E('rect',{x:-o.w/2,y:-o.h/2,width:o.w,height:o.h,rx:5,st:`fill:${H.C(o.col)};stroke:var(--ink);stroke-width:1.5`},G.on);
  tx(G.on,0,o.fs*.36,t1,'lb',`fill:var(--paper);font-size:${o.fs}px`);
  H.E('rect',{x:-o.w/2,y:-o.h/2,width:o.w,height:o.h,rx:5,st:`fill:var(--card);stroke:${H.C(o.col)};stroke-width:2;stroke-dasharray:4 2.5`},G.off);
  tx(G.off,0,o.fs*.36,t0,'lb',`fill:${H.C(o.col)};font-size:${o.fs}px`);
  const bx=o.xm!=null?o.xm:o.w/2-1,by=-o.h/2;
  H.E('circle',{cx:bx,cy:by,r:6.5,st:'fill:var(--bad);stroke:var(--card);stroke-width:1.5'},G.off);
  H.E('path',{d:`M${bx-2.6},${by-2.6} L${bx+2.6},${by+2.6} M${bx+2.6},${by-2.6} L${bx-2.6},${by+2.6}`,st:'stroke:#fff;stroke-width:1.8;stroke-linecap:round'},G.off);
  setG(G,o.ok,{d:0});return G;}
function setG(G,ok,o){H.O(G.on,ok?1:0,o);H.O(G.off,ok?0:1,o);}
/* chromosome: coloured bar (blue = from father, orange = from mother) with gene boxes */
function chrom(p,x,y,col,genes,o){o=o||{};const L=o.L||100;const G=grp(p,x,y,o.s);
  H.E('line',{x1:-L/2,y1:0,x2:L/2,y2:0,st:`stroke:${H.C(col)};stroke-width:${o.bw||9};stroke-linecap:round;opacity:.5`},G);
  G.g={};const n=genes.length;
  genes.forEach((q,i)=>{const dx=q.dx!=null?q.dx:(n===1?0:(i-(n-1)/2)*(o.sp||44));
    G.g[q.n.toUpperCase()]=geneBox(G,dx,0,Object.assign({col,w:o.gw||30,h:o.gh||22,fs:o.fs||14},q));});
  return G;}
/* flower glyph: local origin = flower centre */
function flower(p,x,y,s,col){const G=grp(p,x,y,s);
  H.E('path',{d:'M0,10 C3,30 -3,46 0,64',st:'fill:none;stroke:var(--good);stroke-width:3.5;stroke-linecap:round'},G);
  H.E('path',{d:'M1,46 C10,34 24,34 30,38 C22,48 10,50 1,46Z',st:'fill:var(--good)'},G);
  G.pet=[0,72,144,216,288].map(a=>H.E('ellipse',{cx:0,cy:-15,rx:10,ry:15,transform:`rotate(${a})`,st:`fill:${H.C(col||'petal')};stroke:var(--pk);stroke-width:1.6`},G));
  H.E('circle',{r:6.5,st:'fill:var(--hi);stroke:var(--pk);stroke-width:1.5'},G);return G;}
function paint(G,col,o){G.pet.forEach(e=>H.K(e,{fill:col},o));}
/* horizontal biochemical pathway: nodes = compounds, pills = enzymes over the arrows */
function pathway(p,x0,y,o){o=Object.assign({gap:200,nodes:['compound 1','compound 2','pigment'],enz:['A','B'],r:13,ew:76},o);
  const G=H.g(p);G.xs=o.nodes.map((_,i)=>x0+i*o.gap);G.y=y;
  G.A=o.enz.map((e,i)=>mkA(G,G.xs[i]+o.r+5,y,G.xs[i+1]-o.r-7,y,{w:2.2,h:8}));
  G.N=o.nodes.map((t,i)=>{const g=grp(G,G.xs[i],y);g.c=H.E('circle',{r:o.r,st:'fill:var(--card);stroke:var(--ink);stroke-width:2'},g);
    tx(g,0,o.r+16,t,'lbs','font-weight:600;fill:var(--ink)');return g});
  G.E=o.enz.map((e,i)=>{const g=grp(G,(G.xs[i]+G.xs[i+1])/2,y-24);
    H.E('rect',{x:-o.ew/2,y:-11,width:o.ew,height:22,rx:11,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},g);
    tx(g,0,4.5,o.et?o.et[i]:'enzyme '+e,'lbs','fill:#16181d;font-weight:700');
    g.X=H.g(g);H.E('rect',{x:-o.ew/2,y:-11,width:o.ew,height:22,rx:11,st:'fill:var(--card);opacity:.55'},g.X);const bx=o.ew/2-2;
    H.E('circle',{cx:bx,cy:-10,r:8,st:'fill:var(--bad);stroke:var(--card);stroke-width:1.5'},g.X);
    H.E('path',{d:`M${bx-3.2},-13.2 L${bx+3.2},-6.8 M${bx+3.2},-13.2 L${bx-3.2},-6.8`,st:'stroke:#fff;stroke-width:2;stroke-linecap:round'},g.X);H.O(g.X,0,{d:0});
    g.px=(G.xs[i]+G.xs[i+1])/2;g.py=y-24;return g});
  G.last=G.N[G.N.length-1].c;return G;}
/* culture tube with medium; growth = colony on top of the medium */
function tube(p,x,y,s){const G=grp(p,x,y,s);
  H.E('path',{d:'M-11,0 L-11,26 A11,11 0 0 0 11,26 L11,0 Z',st:'fill:var(--wash)'},G);
  H.E('line',{x1:-11,y1:0,x2:11,y2:0,st:'stroke:var(--muted);stroke-width:1.2'},G);
  G.gr=H.g(G);[[-6,-3,5],[0,-6,6],[6,-3,5],[-4,-10,4.5],[4,-11,4.5],[0,-15,4]].forEach(([cx,cy,r])=>H.E('circle',{cx,cy,r,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1'},G.gr));H.O(G.gr,0,{d:0});
  H.E('path',{d:'M-14,-40 L-11,-37 L-11,26 A11,11 0 0 0 11,26 L11,-37 L14,-40',st:'fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round;stroke-linecap:round'},G);
  return G;}
function mark(p,x,y,ok,s,show){const G=grp(p,x,y,s);
  H.E('path',{d:ok?'M-6,0 L-2,5 L7,-6':'M-5,-5 L5,5 M5,-5 L-5,5',st:`fill:none;stroke:var(--${ok?'good':'bad'});stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round`},G);
  H.O(G,show?1:0,{d:0});return G;}
/* bacterium with its circular chromosome and gene a */
function bact(p,x,y,s,o){o=o||{};const G=grp(p,x,y,s);
  H.E('rect',{x:-62,y:-32,width:124,height:64,rx:32,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},G);
  H.E('ellipse',{cx:-18,cy:3,rx:30,ry:17,st:'fill:none;stroke:var(--muted);stroke-width:2.5'},G);
  G.a=geneBox(G,-18,-14,{n:'a',t:'a⁺',tb:'a⁻',ok:!!o.ok,col:'ink',w:36,h:21,fs:o.fs||13});
  return G;}
/* plasmid: ring, AntiR segment (yellow), insert segment */
function plasmid(p,x,y,r,o){o=o||{};const G=grp(p,x,y,o.s);
  H.E('circle',{r,st:'fill:none;stroke:var(--ink);stroke-width:2.5'},G);
  G.anti=H.E('path',{d:H.arcD(0,0,r,135,225),st:'fill:none;stroke:var(--hi);stroke-width:7'},G);H.O(G.anti,o.anti?1:0,{d:0});
  if(o.ins){G.ins=H.E('path',{d:H.arcD(0,0,r,-55,55),pathLength:1,cls:'draw',st:`fill:none;stroke:${H.C(o.ins)};stroke-width:7`},G);if(!o.drawIns)G.ins.style.strokeDashoffset=0;}
  if(o.lab)G.lab=tx(G,0,4.5,o.lab,'lb','font-size:'+(o.fs||13)+'px');
  return G;}
function cellBox(p,x,y,v,sz){const G=grp(p,x,y);const f={p:'pig-tint',w:'wash','+':'good-tint','-':'bad-tint'}[v];const t={p:'pig',w:'ink','+':'good','-':'bad'}[v];
  G.r=H.E('rect',{x:-sz/2,y:-sz/2,width:sz,height:sz,rx:5,st:`fill:var(--${f});stroke:var(--faint);stroke-width:1`},G);
  tx(G,0,6,v==='-'?'−':v,'lb',`fill:var(--${t});font-size:17px`);return G;}
/* dark label tag for photos */
function tag(p,x,y,t,anchor){const G=H.g(p);const w=t.length*6.6+14;const bx=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;
  H.E('rect',{x:bx,y:y-14,width:w,height:21,rx:5,st:'fill:#16181d;opacity:.86'},G);H.txt(G,bx+7,y+1,t,'lbs',{st:'fill:#fff;font-weight:700'});return G;}
const T51={n:['a','b','c','d','e','f'],rows:['w','pw','pww','pppw','pppww','pwwppw']};
function res51(r,c){if(c>r){const t=r;r=c;c=t}return T51.rows[r][c];}
const T52=['-','--','++-','+++-','++---'];

deck({
docTitle:'Complementation Test · Heredity Ch.5',
title:'The Complementation Test',
chapter:5,
eyebrow:'Heredity · Chapter 5 · The Complementation Test',
slides:[

/* 1 ─────────────────────────────── */
{sec:'5.1',title:'The Complementation Test',caption:'Pea flowers: INRA, Jean Weber, CC BY 2.0, Wikimedia Commons · blue = copy from the father plant (it gives the pollen) · orange = copy from the mother plant · filled box = working gene · red badge = broken gene',
text:`<p data-step="0">Wild pea plants have purple flowers. The normal form is the <b>wild type</b>. Some pea plants have white flowers. A white plant is a <b>mutant</b>. <b>DNA</b> is the molecule that holds the instructions of a cell. In a mutant, a change in the DNA stops the production of the purple pigment.</p>
<p data-step="1">To <b>cross</b> two plants, a scientist puts pollen from one plant on the flower of the other. The plants that grow from the seeds are the <b>F1</b> (first generation).</p>
<p data-step="1">A <b>gene</b> is a segment of DNA with the instructions for one product. Cross two white mutants. Their F1 plants have purple flowers: each parent gives a working gene that the other parent lacks.</p>
<p data-step="2">In a second cross, two other white mutants give F1 plants with white flowers. Both parents have the same gene broken, so the F1 plants get no working version of it.</p>
<p data-step="3">A cross of two mutants with the same <b>trait</b> (feature) is a <b>complementation test</b>. The test shows if the two mutants have broken copies of the same gene or of different genes.</p>`,
star:'Purple F1: different genes. White F1: same gene.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const ph=H.g(s);H.E('image',{href:'@@asset:c5-pea-flowers.jpg@@',x:0,y:15,width:640,height:389},ph);
  tag(ph,16,388,'wild type: purple');tag(ph,340,388,'mutant: white');
  const div=H.E('line',{x1:20,y1:204,x2:590,y2:204,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);H.O(div,0,{d:0});
  const rows=[0,205].map((dy,ri)=>{const G=H.g(s);
    const g1=[{n:'A',ok:false},{n:'B',ok:true}],g2=ri?[{n:'A',ok:false,xm:-8},{n:'B',ok:true}]:[{n:'A',ok:true},{n:'B',ok:false}];
    const cap=tx(G,20,24+dy,ri?'SECOND CROSS':'FIRST CROSS','cap',null,'start');H.O(cap,0,{d:0});
    const par=H.g(G);flower(par,90,64+dy,.72);flower(par,250,64+dy,.72);
    tx(par,170,74+dy,'×','big');chrom(par,90,138+dy,'dad',g1);chrom(par,250,138+dy,'mom',g2);
    const ar=mkA(G,330,96+dy,410,96+dy,{w:2.2,h:8});
    const k1=chrom(G,90,138+dy,'dad',g1),k2=chrom(G,250,138+dy,'mom',g2);H.O([k1,k2],0,{d:0});
    const kid=flower(G,500,64+dy,.72);hide(kid);
    const v=tx(G,500,186+dy,ri?'white F1: same gene':'purple F1: different genes','lb',ri?'font-size:13px':'font-size:13px;fill:var(--pig)');H.O(v,0,{d:0});
    H.O(par,0,{d:0});return {G,cap,par,ar,k1,k2,kid,v,dy}});
  const br=H.g(s);H.E('path',{d:'M600,40 L612,40 L612,392 L600,392',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:2'},br);
  H.txt(br,628,216,'COMPLEMENTATION TEST','cap',{'text-anchor':'middle',transform:'rotate(-90 628 216)',st:'fill:var(--ink)'});H.O(br,0,{d:0});
  const run=(R,at)=>{H.O(R.par,1,{d:600,at});H.O(R.cap,1,{at});drawA(R.ar,{at:at+500});H.O([R.k1,R.k2],1,{d:200,at:at+500});
    H.T(R.k1,{x:500,y:128+R.dy},{d:1100,at:at+700});H.T(R.k2,{x:500,y:152+R.dy},{d:1100,at:at+700});pop(R.kid,{at:at+1300});H.O(R.v,1,{at:at+2300});};
  return [
    ()=>{},
    ()=>{H.O(ph,0,{d:600});H.O(div,1,{at:400});run(rows[0],400);paint(rows[0].kid,'pig',{d:700,at:2200})},
    ()=>{run(rows[1],0)},
    ()=>{H.O(br,1);H.D(br.firstChild,1,{d:900})},
  ];}},

/* 2 ─────────────────────────────── */
{sec:'5.2',title:'Genes Build Pathways',caption:'a simplified pigment pathway with two enzymes',
text:`<p data-step="0">The cell reads a gene and makes a <b>protein</b>: a large molecule with one job in the cell. Many proteins are <b>enzymes</b>. An enzyme changes one <b>compound</b> (chemical substance) into a different compound.</p>
<p data-step="1">A <b>biochemical pathway</b> is a chain of these changes. Each enzyme does one step.</p>
<p data-step="2">In this simplified flower, enzyme A changes colourless compound 1 into colourless compound 2. Enzyme B changes compound 2 into a purple <b>pigment</b> (a coloured compound). Gene A makes enzyme A, and gene B makes enzyme B.</p>
<p data-step="3">DNA is a chain of four chemical letters: A, T, G and C. Their order is the DNA <b>sequence</b>. A <b>mutation</b> is a change in the sequence. Without working enzyme A or working enzyme B, the pathway stops, and the flower is white.</p>
<p data-step="4">In the flower, each gene is an on/off step. Human height, skin colour, eye colour and weight are <b>polygenic</b>. For these traits, many genes each add a small effect, so the trait varies smoothly.</p>`,
star:'A pathway is a chain. Break any link, and the end product is missing.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const dL=tx(s,40,32,'DNA','cap',null,'start');
  const dna=H.E('line',{x1:40,y1:56,x2:600,y2:56,pathLength:1,cls:'draw',st:'stroke:var(--muted);stroke-width:8;stroke-linecap:round'},s);
  const oth=[84,300,520,574].map(x=>{const b=H.E('rect',{x:x-11,y:46,width:22,height:20,rx:4,st:'fill:var(--muted);stroke:var(--ink);stroke-width:1.2'},s);H.O(b,0,{d:0});return b});
  const gA=geneBox(s,200,56,{n:'A',t:'gene A',tb:'gene A',col:'ink',w:92,h:26,fs:13}),gB=geneBox(s,420,56,{n:'B',t:'gene B',col:'ink',w:92,h:26,fs:13});H.O([gA,gB],0,{d:0});
  const mk=[200,420].map(x=>mkA(s,x,74,x,100,{w:1.8,h:6}));
  const conv=H.g(s);[84,200,300,420,520,574].forEach(x=>H.E('path',{d:`M${x},70 Q${(x+530)/2},${210} 530,318`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--muted);stroke-width:1.5'},conv));
  const P=pathway(s,110,250,{gap:210,nodes:['colourless compound 1','colourless compound 2','purple pigment'],r:16,ew:80});
  const ghost=[0,1].map(i=>H.E('line',{x1:P.xs[i]+22,y1:250,x2:P.xs[i+1]-24,y2:250,st:'stroke:var(--faint);stroke-width:2;stroke-dasharray:4 5'},s));s.insertBefore(ghost[0],P);s.insertBefore(ghost[1],P);
  H.O([...P.N,...ghost],0,{d:0});
  [200,420].forEach((x,i)=>{H.T(P.E[i],{x,y:56,s:.001},{d:0});H.O(P.E[i],0,{d:0})});
  const fl=flower(s,530,350,.8);hide(fl);
  const note=tx(s,60,345,'A broken gene B stops the pathway','lbs',null,'start'),note2=tx(s,60,361,'one step later, at compound 2.','lbs',null,'start');H.O([note,note2],0,{d:0});
  const tr=tx(s,330,395,'many genes → one trait','lb','fill:var(--ink)');H.O(tr,0,{d:0});
  return [
    ()=>{H.D(dna,1,{d:900});H.O([gA,gB],1,{at:500});mk.forEach(a=>drawA(a,{at:800}));
      [200,420].forEach((x,i)=>{H.T(P.E[i],{x,y:122,s:1},{d:900,at:1000});H.O(P.E[i],1,{d:300,at:1000})})},
    ()=>{P.N.forEach((n,i)=>H.O(n,1,{at:i*250}));H.O(ghost,1,{at:300})},
    ()=>{pop(fl);P.E.forEach((e,i)=>H.T(e,{x:e.px,y:e.py},{d:1000}));H.O(mk,0);drawA(P.A[0],{at:1000});drawA(P.A[1],{at:1600});
      H.K(P.last,{fill:'pig'},{at:2100});paint(fl,'pig',{d:700,at:2200})},
    ()=>{setG(gA,false);H.O(P.E[0].X,1,{d:300,at:300});H.O(P.E[0],.55,{at:300});undrawA(P.A[0],{at:500});undrawA(P.A[1],{at:500});
      H.O(P.N[1],.3,{at:600});H.O(P.N[2],.3,{at:600});H.K(P.last,{fill:'card'},{at:700});paint(fl,'petal',{at:900});H.O([note,note2],1,{at:1300})},
    ()=>{H.O([P,...ghost,note,note2],.12);H.O(oth,1,{at:300});H.D([...conv.children],1,{d:1100,at:500});H.O(tr,1,{at:1400})},
  ];}},

/* 3 ─────────────────────────────── */
{sec:'5.2',title:'Two Copies of Every Gene',caption:'Blue = copy from the father · orange = copy from the mother · bar = amount of enzyme A · dashed line = amount needed for purple',
text:`<p data-step="0">A <b>chromosome</b> is one long DNA molecule that carries many genes. Most plants and animals are <b>diploid</b>: their body cells have two copies of each chromosome (two sets). So a body cell has two copies of each gene, one from each parent.</p>
<p data-step="1">The versions of a gene are its <b>alleles</b>. A capital letter names the working allele (A), and a small letter names a broken allele (a). The pair of alleles is the <b>genotype</b>. The trait that we see is the <b>phenotype</b>.</p>
<p data-step="2">One working copy makes enough enzyme for the pathway. So an Aa plant has purple flowers, like an AA plant. Aa is <b>heterozygous</b> (two different alleles). The broken allele is <b>recessive</b>: it has no effect when a working copy is present.</p>
<p data-step="3">Of these three plants, only the aa plant has white flowers. AA and aa are <b>homozygous</b> (two identical alleles). A homozygous plant is <b>true-breeding</b>: all of its <b>gametes</b> (pollen cells or egg cells) carry the same allele.</p>
<p data-step="4">A genotype usually names only the mutant gene. In full, the white plant is aaBB. Gene B and all the other genes are wild type.</p>`,
star:'One working copy is enough. Two broken copies give the mutant trait.',starStep:3,
scene(H){const s=document.getElementById('stage');const xs=[110,320,530];const geno=[[1,1],[1,0],[0,0]];
  const capE=tx(s,320,152,'ENZYME A MADE','cap');H.O(capE,0,{d:0});
  const C=xs.map((x,j)=>{const o={};
    o.hd=tx(s,x,44,['AA','Aa','aa'][j],'big');H.O(o.hd,0,{d:0});
    o.cb=chrom(s,x,88,'dad',[{n:'A',ok:!!geno[j][0],dx:-16},{n:'B',ok:true,dx:16}],{L:84});
    o.co=chrom(s,x,118,'mom',[{n:'A',ok:!!geno[j][1],dx:-16},{n:'B',ok:true,dx:16}],{L:84});
    [o.cb,o.co].forEach(c=>H.O(c.g.B,0,{d:0}));
    o.ga=H.g(s);H.E('rect',{x:x-40,y:163,width:80,height:14,rx:3,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},o.ga);
    o.fill=H.E('rect',{x:0,y:164.5,width:1,height:11,rx:2,st:'fill:var(--hi)'},o.ga);H.T(o.fill,{x:x-39,sx:.001},{d:0});
    H.E('line',{x1:x-20,y1:158,x2:x-20,y2:182,st:'stroke:var(--ink);stroke-width:1.5;stroke-dasharray:3 2'},o.ga);H.O(o.ga,0,{d:0});
    o.cnt=tx(s,x,198,['2 working copies','1 working copy','0 working copies'][j],'lbs');H.O(o.cnt,0,{d:0});
    o.fl=flower(s,x,258,.7);hide(o.fl);
    o.ph=tx(s,x,326,j<2?'purple':'white','lb',j<2?'fill:var(--pig)':'');H.O(o.ph,0,{d:0});
    o.term=tx(s,x,346,j===1?'heterozygous':'homozygous','lbs');H.O(o.term,0,{d:0});
    o.full=tx(s,x,378,['AABB','AaBB','aaBB'][j],'lb','font-size:18px');o.wt=tx(s,x,398,['wild type','looks wild type','mutant'][j],'lbs');H.O([o.full,o.wt],0,{d:0});
    if(j){hide(o.cb);hide(o.co)}return o});
  const c0=C[0];H.T(c0.cb,{x:40,y:40},{d:0});H.T(c0.co,{x:180,y:40},{d:0});H.O([c0.cb,c0.co],0,{d:0});
  const lf=tx(s,160,92,'from father','lbs','fill:var(--dad);font-weight:700','start'),lm=tx(s,160,122,'from mother','lbs','fill:var(--mom);font-weight:700','start');H.O([lf,lm],0,{d:0});
  const show=(j,at)=>{const o=C[j];H.O(o.ga,1,{at});H.T(o.fill,{sx:[78,39,.001][j]},{d:900,at:at+200});H.O(o.cnt,1,{at:at+400});pop(o.fl,{at:at+700});H.O(o.ph,1,{at:at+1400})};
  return [
    ()=>{H.O([c0.cb,c0.co],1,{d:400});H.T(c0.cb,{x:110,y:88},{d:1100});H.T(c0.co,{x:110,y:118},{d:1100});H.O([lf,lm],1,{at:900})},
    ()=>{H.O([lf,lm],0);C.forEach((o,j)=>{H.O(o.hd,1,{at:j*200});if(j){pop(o.cb,{at:200+j*200});pop(o.co,{at:300+j*200})}})},
    ()=>{H.O(capE,1);show(0,0);show(1,300);paint(C[0].fl,'pig',{at:1300});paint(C[1].fl,'pig',{at:1600});H.O(C[1].term,1,{at:1900})},
    ()=>{show(2,0);H.O([C[0].term,C[2].term],1,{at:1500})},
    ()=>{C.forEach((o,j)=>{[o.cb,o.co].forEach(c=>pop(c.g.B,{at:j*150}));H.O([o.full,o.wt],1,{at:500+j*150})})},
  ];}},

/* 4 ─────────────────────────────── */
{sec:'5.2',title:'Same Look, Different Cause',caption:'Blue = copy from the father · orange = copy from the mother · a red badge marks the place of the DNA change',
text:`<p data-step="0">A search for mutants with a changed trait is a <b>mutant screen</b>. Scientists treat many seeds with a <b>mutagen</b>, a chemical or radiation that changes DNA.</p>
<p data-step="0">A new mutation is usually on one copy of a gene only, so a recessive trait does not show yet. Each plant pollinates itself, and scientists search the next generation for the changed trait.</p>
<p data-step="1">Two white mutants grow from two different seeds. The two mutations are <b>independent</b>: each one happened separately. But the two plants look the same.</p>
<p data-step="2">Explanation 1: both plants have broken copies of the same gene. Mutations in the same gene are <b>allelic mutations</b>. They are at the same <b>locus</b> (the position of a gene on its chromosome).</p>
<p data-step="3">Explanation 2: the two plants have broken copies of different genes. Mutations in different genes are <b>non-allelic mutations</b>. The white flowers alone cannot show which explanation is correct.</p>`,
star:'Allelic: same gene, same locus. Non-allelic: different genes.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const mL=tx(s,20,24,'MUTAGEN','cap',null,'start');
  const bolts=[150,330,510].map(x=>H.E('path',{d:`M${x-14},6 L${x+4},20 L${x-6},24 L${x+12},40`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round'},s));
  const F=[];for(let r=0;r<3;r++)for(let c=0;c<6;c++){const f=flower(s,80+c*96,62+r*58,.38,'pig');hide(f);F.push(f)}
  const m1=F[1],m2=F[10];
  const lab=[tx(s,120,136,'mutant 1','lb'),tx(s,520,136,'mutant 2','lb'),tx(s,320,86,'?','big','font-size:40px')];H.O(lab,0,{d:0});
  const pan=(y,title,g1,g2,mid)=>{const G=H.g(s);H.E('rect',{x:14,y,width:612,height:118,rx:12,st:'fill:none;stroke:var(--faint);stroke-width:1.5'},G);
    tx(G,28,y+22,title,'cap',null,'start');
    [[120,g1],[520,g2]].forEach(([x,g])=>{chrom(G,x,y+58,'dad',g);chrom(G,x,y+86,'mom',g)});
    tx(G,320,y+77,mid,'lb');H.O(G,0,{d:0});return G};
  const P1=pan(152,'EXPLANATION 1 · SAME GENE · ALLELIC',[{n:'A',ok:false,xm:-8},{n:'B',ok:true}],[{n:'A',ok:false,xm:8},{n:'B',ok:true}],'both: gene A broken');
  const P2=pan(284,'EXPLANATION 2 · DIFFERENT GENES · NON-ALLELIC',[{n:'A',ok:false},{n:'B',ok:true}],[{n:'A',ok:true},{n:'B',ok:false}],'gene A vs gene B');
  return [
    ()=>{H.D(bolts,1,{d:700});F.forEach((f,i)=>pop(f,{at:300+i*45}))},
    ()=>{H.O([...bolts,mL],0);paint(m1,'petal',{d:500});paint(m2,'petal',{d:500});
      F.forEach(f=>{if(f!==m1&&f!==m2)H.O(f,0,{d:600,at:700})});
      H.T(m1,{x:120,y:66,s:.7},{d:1200,at:900});H.T(m2,{x:520,y:66,s:.7},{d:1200,at:900});H.O(lab,1,{at:1900})},
    ()=>{H.O(P1,1,{d:700})},
    ()=>{H.O(P2,1,{d:700})},
  ];}},

/* 5 ─────────────────────────────── */
{sec:'5.2',title:'Different Genes: Complementation',caption:'blue = from mutant 1 (father) · orange = from mutant 2 (mother)',
text:`<p data-step="0">Suppose that explanation 2 is true: mutant 1 is aaBB, and mutant 2 is AAbb. In this model, genes A and B are on one chromosome. The cross is mutant 1 × mutant 2 (× means crossed with).</p>
<p data-step="1">Each gamete gets one copy of the chromosome. Mutant 1 gives aB. Mutant 2 gives Ab.</p>
<p data-step="2">A pollen cell and an egg cell join, and the seed grows into an F1 plant. Each F1 plant is AaBb.</p>
<p data-step="3">The F1 plant gets a working gene A from mutant 2 and a working gene B from mutant 1. So it makes both enzymes, and its flowers are purple.</p>
<p data-step="4">Each parent gives the working gene that the other parent lacks. Scientists call this result <b>complementation</b>. Mutations that complement each other are almost always in different genes: they are non-allelic.</p>
<p data-step="4" class="note">Rare exception: two mutations in the same gene can sometimes complement. Scientists call this <b>intragenic complementation</b>.</p>`,
star:'Complement = complete. Each parent fills the gap of the other.',starStep:4,
scene(H){const s=document.getElementById('stage');
  const c={g1:[{n:'A',ok:false},{n:'B',ok:true}],g2:[{n:'A',ok:true},{n:'B',ok:false}],l1:'mutant 1 · aaBB',l2:'mutant 2 · AAbb',gt1:'aB',gt2:'Ab',fl:'F1 · AaBb'};
  const R=crossFig(s,c);const P=R.P;
  const src=[[298,276],[342,250]];P.E.forEach((e,i)=>{H.T(e,{x:src[i][0],y:src[i][1],s:.001},{d:0})});
  const rings=H.g(s);[[298,276,'mom'],[342,250,'dad']].forEach(([x,y,col])=>H.E('rect',{x:x-19,y:y-15,width:38,height:30,rx:8,st:`fill:none;stroke:var(--good);stroke-width:3`},rings));
  tx(rings,234,281,'A from mutant 2','lbs','fill:var(--mom);font-weight:700','end');tx(rings,406,255,'B from mutant 1','lbs','fill:var(--dad);font-weight:700','start');H.O(rings,0,{d:0});
  const v=tx(s,320,204,'complementation: non-allelic','lb','fill:var(--good)');H.O(v,0,{d:0});
  const st=crossSteps(R,true);
  return [st[0],st[1],st[2],
    ()=>{H.O(P,1);P.E.forEach((e,i)=>{H.O(e,1,{d:200,at:i*500});H.T(e,{x:e.px,y:e.py,s:1},{d:900,at:i*500})});
      drawA(P.A[0],{at:900});H.O(P.N[1],1,{at:1300});drawA(P.A[1],{at:1500});H.O(P.N[2],1,{at:1900});H.K(P.last,{fill:'pig'},{at:1900});paint(R.ff,'pig',{d:700,at:2100})},
    ()=>{H.O(rings,1,{d:600});H.O(v,1,{at:600})},
  ];}},

/* 6 ─────────────────────────────── */
{sec:'5.2',title:'Same Gene: No Complementation',caption:'blue = from mutant 1 (father) · orange = from mutant 3 (mother)',
text:`<p data-step="0">Suppose that explanation 1 is true for a third white mutant, mutant 3. Mutant 1 and mutant 3 are both aa: both have two broken copies of gene A. The DNA change in mutant 3 can be at a different place inside gene A.</p>
<p data-step="1">Each parent gives one copy of the chromosome to each gamete. In both parents, that copy carries a broken gene A.</p>
<p data-step="2">The F1 plant is aa, so it has no working copy of gene A. The F1 plant makes no enzyme A. The pathway stops at compound 1, and the flowers are white.</p>
<p data-step="3">The two mutations <b>fail to complement</b> each other, so they are allelic. Allelic mutations can be the same DNA change or different DNA changes in the same gene.</p>`,
star:'Same gene broken in both parents: no working copy, so the F1 is mutant.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const c={g1:[{n:'A',ok:false,xm:-8},{n:'B',ok:true}],g2:[{n:'A',ok:false,xm:8},{n:'B',ok:true}],l1:'mutant 1 · aa',l2:'mutant 3 · aa',gt1:'aB',gt2:'aB',fl:'F1 · aa'};
  const R=crossFig(s,c);const P=R.P;
  H.T(P.E[0],{x:P.E[0].px,y:P.E[0].py,s:1},{d:0});H.T(P.E[1],{x:342,y:250,s:.001},{d:0});
  const ins=H.g(s);tx(ins,214,180,'gene A','lb',null,'end');
  H.E('rect',{x:226,y:170,width:190,height:16,rx:4,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},ins);
  [[262,'dad','mutant 1'],[380,'mom','mutant 3']].forEach(([x,col,t])=>{H.E('line',{x1:x,y1:166,x2:x,y2:190,st:`stroke:var(--bad);stroke-width:4;stroke-linecap:round`},ins);tx(ins,x,160,'change in '+t,'lbs',`fill:var(--${col});font-weight:700`)});
  tx(ins,320,208,'no complementation: allelic','lb');H.O(ins,0,{d:0});
  const st=crossSteps(R);
  return [st[0],st[1],
    ()=>{st[2]();H.O(P,1,{at:1300});H.O(P.E[0],1,{d:300,at:1700});H.O(P.E[0].X,1,{d:300,at:2000});
      H.O(P.E[1],1,{d:200,at:1700});H.T(P.E[1],{x:P.E[1].px,y:P.E[1].py,s:1},{d:900,at:1700})},
    ()=>{H.O(ins,1,{d:700})},
  ];}},

/* 7 ─────────────────────────────── */
{sec:'5.2',title:'Testing an Unknown Mutant',caption:'A tester is a true-breeding mutant with a known broken gene · blue = from mutant 4 · orange = from the tester',
text:`<p data-step="0">A new white mutant, mutant 4, has an unknown broken gene. Cross it with a <b>tester</b> for each known gene. A tester is a true-breeding mutant with a known broken gene: here, aa and bb.</p>
<p data-step="1">Mutant 4 × aa gives purple F1 flowers. The mutations complement, so gene A works in mutant 4.</p>
<p data-step="2">Mutant 4 × bb gives white F1 flowers. The mutations fail to complement, so mutant 4 has a new broken allele of gene B.</p>
<p data-step="3">If mutant 4 complemented both testers, its mutation would be in a third gene, for example gene C.</p>
<p data-step="4">Genes A and B are on one chromosome. In each F1 plant, the two mutations are on different copies: scientists call this <b>trans</b> (Latin: across). In <b>cis</b> (Latin: on this side), both mutations are on one copy. The other copy then has both genes working, so a cis plant is always wild type.</p>
<p data-step="4">The cis plant is the control, and the trans plant is the test. So scientists also call the complementation test the <b>cis–trans test</b>.</p>`,
star:'Purple with the aa tester and white with the bb tester: the new mutation is in gene B.',starStep:2,
scene(H){const s=document.getElementById('stage');
  const gU=[{n:'A',ok:true},{n:'B',ok:false}],gTa=[{n:'A',ok:false},{n:'B',ok:true}],gTb=[{n:'A',ok:true},{n:'B',ok:false}];
  const q=G=>{const Q=H.g(G);['A','B'].forEach(k=>{const dx=G.g[k]._t.x;H.E('rect',{x:dx-15,y:-11,width:30,height:22,rx:5,st:'fill:var(--wash);stroke:var(--dad);stroke-width:2'},Q);tx(Q,dx,5,'?','lb','fill:var(--dad)')});return Q};
  const top=H.g(s);H.O(top,0,{d:0});
  flower(top,90,44,.55);flower(top,320,44,.55);flower(top,550,44,.55);
  chrom(top,90,108,'mom',gTa);chrom(top,550,108,'mom',gTb);const cU=chrom(top,320,108,'dad',gU);const qU=q(cU);
  tx(top,90,140,'aa tester','lb','font-size:13px');tx(top,320,140,'mutant 4','lb','font-size:13px');tx(top,550,140,'bb tester','lb','font-size:13px');
  const F1=[170,470].map((x,i)=>{const o={};const tX=i?550:90;
    o.ln=[[tX,150,x+(i?24:-24),180],[320,150,x+(i?-30:30),180]].map(([a,b,c2,d])=>H.E('line',{x1:a,y1:b,x2:c2,y2:d,pathLength:1,cls:'draw',st:'stroke:var(--muted);stroke-width:1.5'},s));
    o.cell=grp(s,x,214);H.E('ellipse',{rx:76,ry:36,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},o.cell);hide(o.cell);
    o.ku=chrom(s,320,108,'dad',gU);o.Q=q(o.ku);o.kt=chrom(s,tX,108,'mom',i?gTb:gTa);H.O([o.ku,o.kt],0,{d:0});
    o.fl=flower(s,i?600:42,206,.55);hide(o.fl);
    o.l1=tx(s,x,272,i?'white F1: fails to complement':'purple F1: complements','lb','font-size:13px'+(i?'':';fill:var(--pig)'));
    o.l2=tx(s,x,290,i?'mutant 4 has a broken gene B':'gene A works in mutant 4','lbs');H.O([o.l1,o.l2],0,{d:0});
    o.x=x;return o});
  const cross=(o,at)=>{H.D(o.ln,1,{d:700,at});H.O([o.ku,o.kt],1,{d:200,at});H.T(o.ku,{x:o.x,y:202},{d:1100,at:at+200});H.T(o.kt,{x:o.x,y:226},{d:1100,at:at+200});
    pop(o.cell,{at:at+600});pop(o.fl,{at:at+1200});H.O(o.l1,1,{at:at+1700});H.O(o.l2,1,{at:at+1900})};
  const sep=H.E('line',{x1:20,y1:304,x2:620,y2:304,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);H.O(sep,0,{d:0});
  const third=tx(s,320,328,'Purple F1 with both testers → the mutation is in a third gene, C','lb','font-size:13px');H.O(third,0,{d:0});
  const CT=H.g(s);H.O(CT,0,{d:0});const mini=(x,y,col,g)=>chrom(CT,x,y,col,g,{L:70,gw:22,gh:16,fs:11,sp:30});
  tx(CT,150,382,'trans','lb',null,'end');mini(200,366,'dad',[{n:'A',ok:true},{n:'B',ok:false}]);mini(200,390,'mom',[{n:'A',ok:false},{n:'B',ok:true}]);
  tx(CT,200,414,'mutations on different copies','lbs');
  tx(CT,400,382,'cis','lb',null,'end');mini(450,366,'dad',[{n:'A',ok:false},{n:'B',ok:false}]);mini(450,390,'mom',[{n:'A',ok:true},{n:'B',ok:true}]);
  tx(CT,450,414,'both on one copy: the control','lbs');
  return [
    ()=>{H.O(top,1,{d:700})},
    ()=>{cross(F1[0],0);paint(F1[0].fl,'pig',{d:700,at:1700})},
    ()=>{cross(F1[1],0);H.O([qU,F1[0].Q,F1[1].Q],0,{d:600,at:2200})},
    ()=>{H.O(sep,1);H.O(third,1,{at:300})},
    ()=>{H.O(CT,1,{d:700})},
  ];}},

/* 8 ─────────────────────────────── */
{sec:'5.2',title:'What the Test Needs',caption:'A* = a dominant mutant allele of gene A · blue = from the father or strain 1 · orange = from the mother or strain 2',
text:`<p data-step="0">The test needs <b>recessive</b> mutations and true-breeding parents, so every F1 plant has the same genotype. An F1 plant with one working copy of each gene is wild type.</p>
<p data-step="1">A <b>dominant</b> mutation shows its trait with only one mutant copy. For example, the mutant protein can block the normal protein. Then the F1 is mutant even when the two mutations are in different genes. The test gives no answer.</p>
<p data-step="1" class="note">A <b>semi-dominant</b> mutation gives a trait between the wild type and the mutant with one copy. The test fails in the same way.</p>
<p data-step="2">The test needs two copies of each gene in one cell. A <b>haploid</b> cell has one set of chromosomes, so it has one copy of each gene. In fungi, two <b>strains</b> (lines with the same DNA) can share one cell.</p>
<p data-step="2">Two haploid yeast cells mate and make one diploid cell. Two <i>Neurospora</i> threads fuse into one cell with nuclei of both strains, a <b>heterokaryon</b>.</p>
<p data-step="2" class="note">An unfused haploid cell cannot do the test, because it has only one copy of each gene.</p>`,
star:'Recessive mutations, true-breeding parents, two copies in one cell.',starStep:2,
scene(H){const s=document.getElementById('stage');
  const R1=H.g(s),R2=H.g(s),R3=H.g(s);[R1,R2,R3].forEach(g=>H.O(g,0,{d:0}));
  tx(R1,20,26,'RECESSIVE MUTATIONS','cap',null,'start');
  chrom(R1,150,58,'dad',[{n:'A',ok:false},{n:'B',ok:true}]);chrom(R1,150,84,'mom',[{n:'A',ok:true},{n:'B',ok:false}]);
  tx(R1,150,114,'F1 of two recessive mutants','lbs');
  const a1=mkA(R1,222,71,384,71,{w:2,h:7});const f1=flower(R1,418,62,.6);
  tx(R1,456,62,'purple: wild type','lb','fill:var(--pig)','start');tx(R1,456,80,'the test gives an answer','lbs',null,'start');
  tx(R2,20,148,'DOMINANT MUTATION','cap',null,'start');
  chrom(R2,150,180,'dad',[{n:'A',ok:false,tb:'A*'},{n:'B',ok:true}]);chrom(R2,150,206,'mom',[{n:'A',ok:true},{n:'B',ok:false}]);
  tx(R2,150,236,'one copy of A* is enough to block','lbs');
  const enz=grp(R2,128,206,.001);H.E('rect',{x:-34,y:-11,width:68,height:22,rx:11,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},enz);tx(enz,0,4.5,'enzyme A','lbs','fill:#16181d;font-weight:700');H.O(enz,0,{d:0});
  const bad=grp(R2,128,180,.001);H.E('rect',{x:-34,y:-11,width:68,height:22,rx:11,st:'fill:var(--bad);stroke:var(--ink);stroke-width:1.5'},bad);tx(bad,0,4.5,'A* protein','lbs','fill:#fff;font-weight:700');H.O(bad,0,{d:0});
  const X=H.g(R2);H.E('circle',{cx:348,cy:182,r:8,st:'fill:var(--bad);stroke:var(--card);stroke-width:1.5'},X);H.E('path',{d:'M344.8,178.8 L351.2,185.2 M351.2,178.8 L344.8,185.2',st:'stroke:#fff;stroke-width:2;stroke-linecap:round'},X);H.O(X,0,{d:0});
  const a2=mkA(R2,360,193,384,193,{w:2,h:7});const f2=flower(R2,418,186,.6);
  const v2=H.g(R2);tx(v2,456,186,'white: mutant','lb',null,'start');tx(v2,456,204,'with a working gene A','lbs',null,'start');tx(v2,456,220,'no answer','lbs','fill:var(--bad);font-weight:700','start');H.O(v2,0,{d:0});
  tx(R3,20,268,'HAPLOID FUNGI: TWO STRAINS SHARE ONE CELL','cap',null,'start');
  // yeast: two haploid cells mate into one diploid cell
  tx(R3,20,292,'yeast','lb','font-size:13px','start');
  const y1=grp(R3,58,336),y2=grp(R3,142,336);[y1,y2].forEach(g=>H.E('ellipse',{rx:38,ry:26,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},g));
  const mc={L:60,gw:22,gh:17,fs:11,sp:26};
  const k1=chrom(R3,58,336,'dad',[{n:'A',ok:false},{n:'B',ok:true}],mc),k2=chrom(R3,142,336,'mom',[{n:'A',ok:true},{n:'B',ok:false}],mc);
  const dip=grp(R3,240,336);H.E('ellipse',{rx:52,ry:36,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},dip);hide(dip);R3.insertBefore(dip,k1);
  const yl=tx(R3,100,382,'haploid: one copy','lbs'),dl=tx(R3,240,392,'diploid cell: test works','lbs','fill:var(--good);font-weight:700');H.O(dl,0,{d:0});
  // Neurospora: two threads fuse; nuclei of both strains mix in one cell
  H.E('line',{x1:316,y1:282,x2:316,y2:404,st:'stroke:var(--faint);stroke-width:1.5'},R3);
  tx(R3,334,292,'Neurospora','lb','font-size:13px;font-style:italic','start');
  const th=[[350,322,250],[392,362,230]].map(([x,y,w])=>H.E('rect',{x,y:y-10,width:w,height:20,rx:10,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},R3));
  const br=H.E('rect',{x:500,y:322,width:26,height:40,cls:'cellfill',st:'stroke:none'},R3);H.O(br,0,{d:0});
  const brl=[500,526].map(x=>{const l=H.E('line',{x1:x,y1:331,x2:x,y2:353,st:'stroke:var(--ink);stroke-width:2'},R3);H.O(l,0,{d:0});return l});
  const nu=[];[[380,322,'dad'],[430,322,'dad'],[470,322,'dad'],[560,322,'dad'],[420,362,'mom'],[470,362,'mom'],[560,362,'mom'],[600,362,'mom']].forEach(([x,y,c])=>{const n=H.E('circle',{cx:0,cy:0,r:5.5,st:`fill:var(--${c});stroke:var(--ink);stroke-width:1`},R3);H.T(n,{x,y},{d:0});nu.push({n,x,y})});
  const hl=tx(R3,480,394,'heterokaryon: one cell, two kinds of nucleus','lbs','fill:var(--good);font-weight:700');H.O(hl,0,{d:0});
  return [
    ()=>{H.O(R1,1,{d:600});drawA(a1,{at:400});paint(f1,'pig',{d:700,at:900})},
    ()=>{H.O(R2,1,{d:600});H.O(enz,1,{at:500});H.T(enz,{x:316,y:193,s:1},{d:900,at:500});H.O(bad,1,{at:1100});H.T(bad,{x:248,y:193,s:1},{d:800,at:1100});H.O(X,1,{at:1900});drawA(a2,{at:2000});H.O(v2,1,{at:2300})},
    ()=>{H.O(R3,1,{d:600});H.T(y1,{x:228},{d:1000,at:800});H.T(y2,{x:252},{d:1000,at:800});H.O([y1,y2,yl],0,{d:500,at:1300});pop(dip,{at:1300});
      H.T(k1,{x:240,y:324},{d:1100,at:800});H.T(k2,{x:240,y:348},{d:1100,at:800});H.O(dl,1,{at:2000});
      H.O([br,...brl],1,{d:500,at:900});[[1,526,362],[3,410,362],[4,500,322],[6,600,322]].forEach(([i,x,y],k)=>H.T(nu[i].n,{x,y},{d:1000,at:1300+k*120}));H.O(hl,1,{at:2300})},
  ];}},

/* 9 ─────────────────────────────── */
{sec:'5.3',title:'Eye Colour in Fruit Flies',caption:'Photo: Ktbn, public domain, Wikimedia Commons (“Fruit Fly Eye Colors”) · right: blue = X from the father, orange = X from the mother',
text:`<p data-step="0">Real fruit flies (<i>Drosophila</i>) have many eye colours. The wild type has dark red eyes. Each other colour is the result of a broken gene.</p>
<p data-step="1">The eye colour is a mix of a red pigment and a brown pigment. Flies with a broken <i>vermilion</i>, <i>cinnabar</i> or <i>scarlet</i> gene make no brown pigment, so their eyes are bright red. <i>Brown</i> and <i>sepia</i> mutants make little red pigment, so their eyes look brown. A <i>white</i> mutant has neither pigment in its eyes.</p>
<p data-step="2">A female fly has two <b>X chromosomes</b>. A male has one X chromosome and one <b>Y chromosome</b>. So a male has only one copy of each gene on the X. The <i>white</i> gene is on the X.</p>`,
star:'Red + brown = wild type. Lose the brown: bright red. Lose both: white.',starStep:1,
scene(H){const s=document.getElementById('stage');const k=336/799;
  H.E('image',{href:'@@asset:c5-fly-eye-colours.jpg@@',x:0,y:0,width:336,height:420},s);
  const ring=(x,y,r,label,lx,ly)=>{const G=H.g(s);H.E('circle',{cx:x*k,cy:y*k,r,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3'},G);tag(G,lx,ly,label);H.O(G,0,{d:0});return G};
  const R={wild:ring(212,585,20,'wild type',8,300),white:ring(318,600,24,'white',150,300),
    cin:ring(343,338,18,'cinnabar',150,112),ver:ring(447,548,20,'vermilion',230,200),
    brn:ring(232,330,18,'brown',8,112),sep:ring(500,420,22,'sepia',230,152)};
  const on=G=>{H.O(G,1);H.D(G.firstChild,1,{d:700})};
  const X0=350;const PG=H.g(s);H.O(PG,0,{d:0});
  tx(PG,X0,30,'PIGMENTS IN THE EYE','cap','fill:var(--ink)','start');tx(PG,560,52,'red','lbs','font-weight:700;fill:var(--ink)');tx(PG,606,52,'brown','lbs','font-weight:700;fill:var(--ink)');
  const chip=(x,y,col,on)=>H.E('rect',{x:x-11,y:y-9,width:22,height:18,rx:4,st:on?`fill:var(--${col});stroke:var(--ink);stroke-width:1.2`:'fill:var(--card);stroke:var(--muted);stroke-width:1.2;stroke-dasharray:3 2'},PG);
  [['wild type',1,1],['vermilion, cinnabar, scarlet',1,0],['brown, sepia',0,1],['white',0,0]].forEach(([t,r,b],i)=>{const y=76+i*30;tx(PG,X0,y+5,t,'lbs','font-weight:700;fill:var(--ink)','start');chip(560,y,'red',r);chip(606,y,'brn',b);
    H.E('line',{x1:X0,y1:y+16,x2:626,y2:y+16,st:'stroke:var(--faint);stroke-width:1'},PG)});
  const XY=H.g(s);H.O(XY,0,{d:0});tx(XY,X0,222,'SEX CHROMOSOMES','cap','fill:var(--ink)','start');
  const xc=(x,y,col,lab)=>{H.E('line',{x1:x-50,y1:y,x2:x+50,y2:y,st:`stroke:var(--${col});stroke-width:9;stroke-linecap:round;opacity:.5`},XY);tx(XY,x-62,y+5,lab,'lb','font-size:13px','end');geneBox(XY,x+14,y,{n:'w',t:'white',col,w:46,h:20,fs:11})};
  tx(XY,X0,250,'female','lb','font-size:13px','start');xc(520,268,'dad','X');xc(520,294,'mom','X');
  tx(XY,X0,330,'male','lb','font-size:13px','start');xc(520,348,'mom','X');
  H.E('line',{x1:470,y1:374,x2:520,y2:374,st:'stroke:var(--muted);stroke-width:9;stroke-linecap:round;opacity:.6'},XY);tx(XY,458,379,'Y','lb','font-size:13px','end');
  tx(XY,X0,404,'one copy of each X gene','lbs','font-weight:700;fill:var(--bad)','start');
  return [
    ()=>{on(R.wild);on(R.white)},
    ()=>{on(R.cin);on(R.ver);on(R.brn);on(R.sep);H.O(PG,1,{d:600,at:400})},
    ()=>{H.O(XY,1,{d:600})},
  ];}},

/* 10 ─────────────────────────────── */
{sec:'5.3',title:'Crossing Fly Mutants',caption:'Blue = from the father · orange = from the mother · (Y) = the Y chromosome, which has no white gene',
text:`<p data-step="0">A white-eyed male × a cinnabar-eyed female gives F1 flies with dark red eyes. Each F1 fly has a working copy of both genes, so the mutations complement. A white-eyed male × a scarlet-eyed female gives the same result.</p>
<p data-step="1">A white-eyed mother spoils the test. Each son gets his only X from his mother. So every son gets a broken <i>white</i> gene and has white eyes. The sons look mutant even though the two genes differ.</p>
<p data-step="2">The <i>vestigial</i> gene is necessary for normal wings. A white-eyed male × a vestigial female gives F1 flies with dark red eyes and normal wings. The traits differ, but the logic is the same: each F1 fly has a working copy of each gene.</p>
<p data-step="3">Scientists have found more than 300 different mutations in the <i>white</i> gene. Any two of them fail to complement each other, because all of them break the same gene.</p>`,
star:'For a gene on the X, put the mutation in the father.',starStep:1,
scene(H){const s=document.getElementById('stage');
  const col=(X0,title,rows,verdict,vcol)=>{const G=H.g(s);H.O(G,0,{d:0});const wx=X0+128,cx=X0+226;
    tx(G,X0,22,title,'cap','fill:var(--ink)','start');tx(G,wx,44,'white gene','lbs','font-weight:700;fill:var(--ink)');tx(G,cx,44,'cinnabar gene','lbs','font-weight:700;fill:var(--ink)');
    const F=H.g(G);
    rows.forEach(([y,lab,sub,ws,cs],i)=>{const tgt=i<2?G:F;tx(tgt,X0,y-1,lab,'lb','font-size:13px','start');tx(tgt,X0,y+14,sub,'lbs',sub.indexOf('white')===0&&i>1?'fill:var(--bad);font-weight:700':null,'start');
      [[wx,ws],[cx,cs]].forEach(([gx,list])=>list.forEach(([c,ok,t],j)=>{const x=gx+(j?19:-19);if(t==='Y'){tx(tgt,x,y+5,'(Y)','lbs');return}geneBox(tgt,x,y,{n:'w',t,tb:t,ok,col:c,w:34,h:20,fs:11})}))});
    H.E('line',{x1:X0,y1:132,x2:X0+282,y2:132,st:'stroke:var(--faint);stroke-width:1.5'},G);
    tx(F,X0+141,240,verdict,'lb','font-size:13px;fill:var(--'+vcol+')');H.O(F,0,{d:0});G.F=F;return G};
  const L=col(14,'WHITE-EYED FATHER',[
      [72,'father','white eyes',[['dad',0,'w'],['dad',1,'Y']],[['dad',1,'cn'],['dad',1,'cn']]],
      [108,'mother','cinnabar eyes',[['mom',1,'w'],['mom',1,'w']],[['mom',0,'cn'],['mom',0,'cn']]],
      [160,'F1 daughter','dark red eyes',[['dad',0,'w'],['mom',1,'w']],[['dad',1,'cn'],['mom',0,'cn']]],
      [202,'F1 son','dark red eyes',[['mom',1,'w'],['dad',1,'Y']],[['dad',1,'cn'],['mom',0,'cn']]]],'all F1 wild type: complement','good');
  const R=col(334,'WHITE-EYED MOTHER',[
      [72,'father','cinnabar eyes',[['dad',1,'w'],['dad',1,'Y']],[['dad',0,'cn'],['dad',0,'cn']]],
      [108,'mother','white eyes',[['mom',0,'w'],['mom',0,'w']],[['mom',1,'cn'],['mom',1,'cn']]],
      [160,'F1 daughter','dark red eyes',[['dad',1,'w'],['mom',0,'w']],[['dad',0,'cn'],['mom',1,'cn']]],
      [202,'F1 son','white eyes',[['mom',0,'w'],['dad',1,'Y']],[['dad',0,'cn'],['mom',1,'cn']]]],'sons white: the test is spoiled','bad');
  H.E('line',{x1:320,y1:12,x2:320,y2:250,st:'stroke:var(--faint);stroke-width:1.5'},s);
  const V=H.g(s);H.O(V,0,{d:0});H.E('line',{x1:14,y1:264,x2:626,y2:264,st:'stroke:var(--faint);stroke-width:1.5'},V);
  tx(V,14,290,'white-eyed male × vestigial female','lb','font-size:13px','start');tx(V,14,308,'F1: dark red eyes, normal wings: complement','lbs','font-weight:700;fill:var(--good)','start');
  const W=H.g(s);H.O(W,0,{d:0});
  tx(W,14,342,'white gene: more than 300 known mutations','lb','font-size:13px','start');
  H.E('rect',{x:14,y:354,width:612,height:18,rx:4,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},W);
  const ticks=[];let sd=7;const rnd=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
  for(let g=0;g<10;g++){const T=H.g(W);for(let i=0;i<30;i++){const x=18+rnd()*604;H.E('line',{x1:x,y1:356,x2:x,y2:370,st:'stroke:var(--bad);stroke-width:1'},T)}H.O(T,0,{d:0});ticks.push(T)}
  tx(W,14,396,'any two of them: mutant F1 (no complementation)','lbs','font-weight:700;fill:var(--ink)','start');
  return [
    ()=>{H.O(L,1,{d:600});H.O(L.F,1,{d:600,at:700})},
    ()=>{H.O(R,1,{d:600});H.O(R.F,1,{d:600,at:700})},
    ()=>{H.O(V,1,{d:600})},
    ()=>{H.O(W,1,{d:500});ticks.forEach((T,i)=>H.O(T,1,{d:200,at:300+i*120}))},
  ];}},

/* 11 ─────────────────────────────── */
{sec:'5.3',title:'The Complementation Table',caption:'a to f are names of mutants · w = white F1 (mutant) · p = purple F1 (wild type)',
text:`<p data-step="0">With many mutants, scientists cross each pair of mutants. They record the F1 flower colour of each cross in a table. In this example, six true-breeding white mutants have the names a to f. (These letters are names of mutants, not alleles.)</p>
<p data-step="1">Each box shows one cross. A <b>w</b> (white F1) means that the two mutations fail to complement. A <b>p</b> (purple F1) means that they complement.</p>
<p data-step="2">The boxes on the <b>diagonal</b> cross a mutant with itself. Both chromosome copies carry the same broken gene, so the result is always w.</p>
<p data-step="3">The cross a × b gives the same F1 as b × a, because the F1 gets the same two chromosomes. So the table is symmetric about the diagonal, and scientists complete only one half.</p>
<p data-step="3" class="note">The symmetry is true for genes that are not on the X chromosome. For an X gene, the sons of the two crosses can differ.</p>`,
star:'Diagonal: always w. Each box has a mirror twin across the diagonal.',starStep:3,
scene(H){const s=document.getElementById('stage');const N=T51.n,CS=40,X0=84,Y0=98;const cx=c=>X0+c*CS,cy=r=>Y0+r*CS;
  const grid=H.g(s);
  for(let i=0;i<=6;i++){H.E('line',{x1:cx(-.5),y1:cy(i-.5),x2:cx(5.5),y2:cy(i-.5),st:'stroke:var(--faint);stroke-width:1'},grid);H.E('line',{x1:cx(i-.5),y1:cy(-.5),x2:cx(i-.5),y2:cy(5.5),st:'stroke:var(--faint);stroke-width:1'},grid)}
  H.E('line',{x1:cx(-1.5)+8,y1:cy(-.5),x2:cx(5.5),y2:cy(-.5),st:'stroke:var(--ink);stroke-width:2'},grid);H.E('line',{x1:cx(-.5),y1:cy(-1.5)+8,x2:cx(-.5),y2:cy(5.5),st:'stroke:var(--ink);stroke-width:2'},grid);
  N.forEach((n,i)=>{tx(s,cx(i),cy(-1)+6,n,'lb','font-size:17px;fill:var(--mom)');tx(s,cx(-1),cy(i)+6,n,'lb','font-size:17px;fill:var(--dad)')});
  tx(s,cx(-1),cy(-1)+6,'×','lb','fill:var(--muted)');
  const L=[];for(let r=0;r<6;r++)for(let c=0;c<=r;c++){const g=cellBox(s,cx(c),cy(r),res51(r,c),36);hide(g);
    const ca=tx(s,0,0,N[r],'lb','font-size:15px;fill:var(--dad)'),cb=tx(s,0,0,N[c],'lb','font-size:15px;fill:var(--mom)');
    H.T(ca,{x:cx(-1),y:cy(r)+6},{d:0});H.T(cb,{x:cx(c),y:cy(-1)+6},{d:0});H.O([ca,cb],0,{d:0});L.push({r,c,g,ca,cb})}
  const ghosts=L.filter(o=>o.c<o.r).map(o=>{const g=cellBox(s,cx(o.c),cy(o.r),res51(o.r,o.c),36);H.O(g,0,{d:0});return {g,o}});
  const dg=H.E('line',{x1:cx(-.5),y1:cy(-.5),x2:cx(5.5),y2:cy(5.5),pathLength:1,cls:'draw',st:'stroke:var(--ink);stroke-width:2;opacity:.6'},s);
  const leg=H.g(s);H.O(leg,0,{d:0});tx(leg,340,64,'EACH BOX = ONE CROSS','cap',null,'start');
  cellBox(leg,356,100,'w',30);tx(leg,382,96,'w = white F1','lb',null,'start');tx(leg,382,113,'fail to complement','lbs',null,'start');
  cellBox(leg,356,148,'p',30);tx(leg,382,144,'p = purple F1','lb',null,'start');tx(leg,382,161,'complement','lbs',null,'start');
  const dn=H.g(s);H.O(dn,0,{d:0});tx(dn,340,204,'DIAGONAL','cap','fill:var(--ink)','start');tx(dn,340,224,'a mutant × itself','lb',null,'start');tx(dn,340,241,'same broken gene on both copies → w','lbs',null,'start');
  const sy=H.g(s);H.O(sy,0,{d:0});tx(sy,340,282,'SYMMETRY','cap','fill:var(--ink)','start');
  const mini=(x,y,col,t)=>{H.E('line',{x1:x-34,y1:y,x2:x+34,y2:y,st:`stroke:var(--${col});stroke-width:9;stroke-linecap:round;opacity:.55`},sy);tx(sy,x,y+4,t,'lbs','font-weight:700;fill:var(--ink)')};
  tx(sy,400,306,'a × b','lb');mini(400,328,'dad','from a');mini(400,352,'mom','from b');
  tx(sy,480,346,'=','big');
  tx(sy,560,306,'b × a','lb');mini(560,328,'dad','from b');mini(560,352,'mom','from a');
  tx(sy,480,386,'same two chromosomes → same F1','lbs');
  return [
    ()=>{},
    ()=>{L.forEach((o,i)=>H.after(i*110,()=>{H.O([o.ca,o.cb],1,{d:120});H.T(o.ca,{x:cx(o.c)-8,y:cy(o.r)+6},{d:420});H.T(o.cb,{x:cx(o.c)+8,y:cy(o.r)+6},{d:420});
        H.after(430,()=>{H.O([o.ca,o.cb],0,{d:150});pop(o.g,{d:350})})}));H.O(leg,1,{at:300})},
    ()=>{H.D(dg,1,{d:900});L.filter(o=>o.r===o.c).forEach((o,i)=>{H.K(o.g.r,{stroke:'ink'},{at:i*120});o.g.r.style.strokeWidth='2.5'});H.O(dn,1,{at:500})},
    ()=>{ghosts.forEach(({g,o},i)=>{H.O(g,.5,{d:300,at:i*40});H.T(g,{x:cx(o.r),y:cy(o.c)},{d:1200,at:200+i*40})});H.O(sy,1,{at:600})},
  ];}},

/* 12 ─────────────────────────────── */
{sec:'5.3',title:'Complementation Groups',caption:'the full table, with rows and columns reordered by group',
text:`<p data-step="0">A <b>complementation group</b> is a set of mutations that fail to complement each other. All the mutations in one group are in the same gene.</p>
<p data-step="1">Reorder the rows and columns so that the members of each group are next to each other. The w boxes then make square blocks along the diagonal.</p>
<p data-step="2">The six mutants make three groups: (1) a; (2) b, c and f; (3) d and e. A group can have only one mutation, or it can have many.</p>
<p data-step="3">Each complementation group is one gene. So the number of groups is the number of different genes in the collection: here, three genes.</p>
<p data-step="4">If each mutant has only one broken gene, two mutants from different groups always complement. Each one has a working copy of the gene that the other lacks. So every box outside the blocks is p.</p>`,
star:'One complementation group = one gene.',starStep:3,
scene(H){const s=document.getElementById('stage');const N=T51.n,CS=40,X0=84,Y0=98;const cx=c=>X0+c*CS,cy=r=>Y0+r*CS;
  const o0=[0,1,2,3,4,5],o1=[0,1,2,5,3,4];const pos=(i,o)=>o.indexOf(i);
  const grid=H.g(s);
  for(let i=0;i<=6;i++){H.E('line',{x1:cx(-.5),y1:cy(i-.5),x2:cx(5.5),y2:cy(i-.5),st:'stroke:var(--faint);stroke-width:1'},grid);H.E('line',{x1:cx(i-.5),y1:cy(-.5),x2:cx(i-.5),y2:cy(5.5),st:'stroke:var(--faint);stroke-width:1'},grid)}
  H.E('line',{x1:cx(-1.5)+8,y1:cy(-.5),x2:cx(5.5),y2:cy(-.5),st:'stroke:var(--ink);stroke-width:2'},grid);H.E('line',{x1:cx(-.5),y1:cy(-1.5)+8,x2:cx(-.5),y2:cy(5.5),st:'stroke:var(--ink);stroke-width:2'},grid);
  const hc=N.map((n,i)=>{const t=tx(s,0,0,n,'lb','font-size:17px;fill:var(--mom)');H.T(t,{x:cx(i),y:cy(-1)+6},{d:0});return t});
  const hr=N.map((n,i)=>{const t=tx(s,0,0,n,'lb','font-size:17px;fill:var(--dad)');H.T(t,{x:cx(-1),y:cy(i)+6},{d:0});return t});
  const C=[];for(let r=0;r<6;r++)for(let c=0;c<6;c++)C.push({r,c,v:res51(r,c),g:cellBox(s,cx(c),cy(r),res51(r,c),36)});
  const place=(o,q)=>{C.forEach(k=>H.T(k.g,{x:cx(pos(k.c,o)),y:cy(pos(k.r,o))},q));hc.forEach((t,i)=>H.T(t,{x:cx(pos(i,o))},q));hr.forEach((t,i)=>H.T(t,{y:cy(pos(i,o))+6},q))};
  const blocks=[[0,1],[1,3],[4,2]].map(([a,n])=>H.E('rect',{x:cx(a-.5)+1,y:cy(a-.5)+1,width:n*CS-2,height:n*CS-2,rx:6,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:3.5'},s));
  const GL=[['Group 1',['a']],['Group 2',['b','c','f']],['Group 3',['d','e']]].map(([t,ls],i)=>{const G=H.g(s);const y=96+i*40;
    tx(G,340,y,t,'lb','font-size:15px','start');ls.forEach((l,j)=>tx(G,420+j*20,y,l,'lb','font-size:16px'));H.O(G,0,{d:0});G.ls=ls;G.y=y;return G});
  const chr=H.g(s);H.O(chr,0,{d:0});H.E('line',{x1:346,y1:284,x2:626,y2:284,st:'stroke:var(--muted);stroke-width:8;stroke-linecap:round'},chr);
  const gx=[392,486,580];gx.forEach((x,i)=>geneBox(chr,x,284,{n:'g',t:'gene '+(i+1),col:'ink',w:72,h:26,fs:12}));
  tx(chr,486,256,'one chromosome region, three genes','lbs');
  const chips=[];GL.forEach((G,i)=>G.ls.forEach((l,j)=>{const t=tx(s,0,0,l,'lb','font-size:16px;fill:var(--bad)');H.T(t,{x:420+j*20,y:G.y},{d:0});H.O(t,0,{d:0});
    chips.push({t,x:gx[i]+(j-(G.ls.length-1)/2)*20,y:326})}));
  const res=tx(s,486,372,'3 groups = 3 genes','lb','font-size:18px');H.O(res,0,{d:0});
  const pn=tx(s,486,402,'between groups: always p','lbs','fill:var(--pig);font-weight:700');H.O(pn,0,{d:0});
  return [
    ()=>{},
    ()=>{place(o1,{d:1500})},
    ()=>{blocks.forEach((b,i)=>H.D(b,1,{d:700,at:i*350}));GL.forEach((G,i)=>H.O(G,1,{at:300+i*350}))},
    ()=>{H.O(chr,1);chips.forEach((c,i)=>{H.O(c.t,1,{d:200,at:300+i*120});H.T(c.t,{x:c.x,y:c.y},{d:1000,at:300+i*120})});H.O(res,1,{at:1600})},
    ()=>{C.filter(k=>k.v==='p').forEach((k,i)=>{H.K(k.g.r,{stroke:'pig'},{at:i*30});k.g.r.style.strokeWidth='2.5'});H.O(pn,1,{at:400})},
  ];}},

/* 13 ─────────────────────────────── */
{sec:'5.3',title:'A Double-Hit Strain',caption:'− = no complementation (mutant F1) · + = complementation (wild-type F1) · red badge = broken gene',
text:`<p data-step="0">Five white mutants, 1 to 5, give this table. The sign − means no complementation (mutant F1). The sign + means complementation (wild-type F1).</p>
<p data-step="1">Mutants 1 and 2 fail to complement, so both are in gene A. Mutants 3 and 4 complement mutants 1 and 2 and also each other. So they are in two other genes, B and C.</p>
<p data-step="2">Mutant 5 fails to complement mutant 3 and also mutant 4. One broken gene cannot do that, because 3 and 4 are in different genes. So mutant 5 has broken copies of both gene B and gene C.</p>
<p data-step="2">A strain with mutations in two different genes is a <b>double-hit strain</b>. A mutant with two broken genes for the same trait is rare.</p>
<p data-step="3">Today scientists can <b>sequence</b> the genome of each mutant: they read every letter of its DNA. A mutagen makes many DNA changes, so the sequence alone cannot show which change causes the trait. The complementation test shows which mutants share a broken gene.</p>`,
star:'A mutant that fails to complement two groups that complement each other is a double hit.',starStep:2,
scene(H){const s=document.getElementById('stage');const CS=36,X0=76,Y0=110;const cx=c=>X0+c*CS,cy=r=>Y0+r*CS;
  for(let i=0;i<=5;i++){H.E('line',{x1:cx(-.5),y1:cy(i-.5),x2:cx(4.5),y2:cy(i-.5),st:'stroke:var(--faint);stroke-width:1'},s);H.E('line',{x1:cx(i-.5),y1:cy(-.5),x2:cx(i-.5),y2:cy(4.5),st:'stroke:var(--faint);stroke-width:1'},s)}
  H.E('line',{x1:cx(-1.5)+8,y1:cy(-.5),x2:cx(4.5),y2:cy(-.5),st:'stroke:var(--ink);stroke-width:2'},s);H.E('line',{x1:cx(-.5),y1:cy(-1.5)+8,x2:cx(-.5),y2:cy(4.5),st:'stroke:var(--ink);stroke-width:2'},s);
  for(let i=0;i<5;i++){tx(s,cx(i),cy(-1)+6,String(i+1),'lb','font-size:16px;fill:var(--mom)');tx(s,cx(-1),cy(i)+6,String(i+1),'lb','font-size:16px;fill:var(--dad)')}
  tx(s,20,30,'TABLE OF CROSSES','cap',null,'start');tx(s,300,30,'THE STRAINS: WHICH GENES ARE BROKEN','cap',null,'start');
  const L=[];T52.forEach((row,r)=>[...row].forEach((v,c)=>{const g=cellBox(s,cx(c),cy(r),v,32);hide(g);L.push({r,c,g})}));
  const GX={A:360,B:430,C:500};tx(s,GX.A,cy(-1)+6,'A','lb');tx(s,GX.B,cy(-1)+6,'B','lb');tx(s,GX.C,cy(-1)+6,'C','lb');tx(s,590,cy(-1)+6,'other genes','lbs');
  const brk=[['A'],['A'],['B'],['C'],['B','C']];
  const S=brk.map((b,r)=>{const G=H.g(s);const y=cy(r);H.E('line',{x1:300,y1:y,x2:626,y2:y,st:'stroke:var(--ink);stroke-width:2.5'},G);tx(G,292,y+5,String(r+1),'lb','font-size:13px','end');
    ['A','B','C'].forEach(k=>geneBox(G,GX[k],y,{n:k,ok:!b.includes(k),col:'ink',w:32,h:22,fs:13,xm:r===1&&k==='A'?-9:null}));
    [570,610].forEach(x=>H.E('rect',{x:x-9,y:y-8,width:18,height:16,rx:3,st:'fill:var(--ink)'},G));H.O(G,0,{d:0});return G});
  const hl=[[4,2],[4,3]].map(([r,c])=>H.E('rect',{x:cx(c)-18,y:cy(r)-18,width:36,height:36,rx:6,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--bad);stroke-width:3'},s));
  const X=H.g(s);H.O(X,0,{d:0});tx(X,270,312,'F1 of 5 × 3','lb','font-size:13px','end');tx(X,270,330,'no working gene B','lbs','fill:var(--bad);font-weight:700','end');
  [[306,'dad',['B','C']],[332,'mom',['B']]].forEach(([y,col,b])=>{H.E('line',{x1:300,y1:y,x2:626,y2:y,st:`stroke:var(--${col});stroke-width:6;opacity:.5`},X);['A','B','C'].forEach(k=>geneBox(X,GX[k],y,{n:k,ok:!b.includes(k),col,w:32,h:20,fs:12}))});
  H.E('rect',{x:GX.B-24,y:290,width:48,height:58,rx:8,st:'fill:none;stroke:var(--bad);stroke-width:2.5'},X);
  const Q=H.g(s);H.O(Q,0,{d:0});tx(Q,270,384,'genome of mutant 5','lb','font-size:13px','end');
  H.E('rect',{x:300,y:374,width:326,height:16,rx:4,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},Q);
  [318,GX.B,468,GX.C,548,604].forEach(x=>H.E('line',{x1:x,y1:372,x2:x,y2:392,st:'stroke:var(--bad);stroke-width:3;stroke-linecap:round'},Q));
  [GX.B,GX.C].forEach(x=>H.E('circle',{cx:x,cy:382,r:13,st:'fill:none;stroke:var(--ink);stroke-width:2'},Q));
  tx(Q,463,412,'6 DNA changes · 2 of them break genes B and C','lbs');
  return [
    ()=>{L.forEach((o,i)=>pop(o.g,{d:400,at:i*80}))},
    ()=>{S.slice(0,4).forEach((G,i)=>H.O(G,1,{at:i*300}))},
    ()=>{H.O(S[4],1);H.D(hl,1,{d:700,at:400});H.O(X,1,{d:600,at:1100})},
    ()=>{H.O(Q,1,{d:600})},
  ];}},

/* 14 ─────────────────────────────── */
{sec:'5.4',title:'One Gene, One Enzyme',caption:'Top: red oncom, an Indonesian food made with orange Neurospora mould, Midori, CC BY-SA 3.0 · bottom: Neurospora crassa threads under a microscope, Roland Gromes, CC BY-SA 3.0 · both Wikimedia Commons',
text:`<p data-step="0">In 1941, George Beadle and Edward Tatum studied the bread mould <i>Neurospora crassa</i>. The mould grows fast as thin threads, and it is easy to keep in a laboratory.</p>
<p data-step="1">Wild-type <i>Neurospora</i> is <b>prototrophic</b>: it makes all of its own <b>amino acids</b> (the building blocks of proteins). The mould also makes all of its vitamins except biotin. So it grows on <b>minimal medium</b> (MM). A medium is the food on which cells grow, and MM has only minerals, simple sugars and the vitamin biotin.</p>
<p data-step="2">Beadle and Tatum proposed the <b>one gene, one enzyme</b> hypothesis. The hypothesis states that a different gene makes each enzyme of a pathway.</p>
<p data-step="3">Today we know of exceptions. Some genes make <b>RNA</b> (a molecule similar to DNA) but no protein. Some enzymes contain proteins from several genes. Most genes make one product. The product makes a reaction go faster, controls other genes or builds a structure.</p>`,
star:'One gene, one enzyme: a good first rule, with exceptions.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const ph=H.g(s);H.E('image',{href:'@@asset:c5-neurospora-oncom.jpg@@',x:8,y:10,width:200,height:150},ph);H.E('image',{href:'@@asset:c5-neurospora-hyphae.jpg@@',x:8,y:168,width:200,height:149},ph);
  tag(ph,14,152,'orange mould');tag(ph,14,308,'threads');H.O(ph,0,{d:0});
  const MM=H.g(s);H.O(MM,0,{d:0});tx(MM,108,342,'MINIMAL MEDIUM','cap','fill:var(--ink)');
  ['minerals','sugars','biotin'].forEach((t,i)=>{const x=40+i*68;H.E('rect',{x:x-31,y:352,width:62,height:20,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.2'},MM);tx(MM,x,366,t,'lbs','font-weight:700;fill:var(--ink)')});
  mark(MM,52,396,true,1,true);tx(MM,64,401,'wild type grows','lb','font-size:13px','start');
  const cap1=tx(s,240,252,'INSIDE EACH CELL: A PATHWAY MAKES AN AMINO ACID','cap',null,'start');H.O(cap1,0,{d:0});
  const P=pathway(s,250,200,{gap:118,nodes:['start','','','amino acid'],enz:['1','2','3'],r:11,ew:68});H.O(P,0,{d:0});
  const cap2=tx(s,240,40,'ONE GENE, ONE ENZYME','cap','fill:var(--ink)','start');H.O(cap2,0,{d:0});
  const chr=H.g(s);H.E('line',{x1:240,y1:78,x2:626,y2:78,st:'stroke:var(--muted);stroke-width:8;stroke-linecap:round'},chr);
  P.E.forEach((e,i)=>geneBox(chr,e.px,78,{n:'g',t:'gene '+(i+1),col:'ink',w:70,h:24,fs:12}));H.O(chr,0,{d:0});
  const lk=P.E.map(e=>mkA(s,e.px,92,e.px,160,{w:1.6,h:6}));
  const EX=H.g(s);H.O(EX,0,{d:0});H.E('line',{x1:232,y1:266,x2:630,y2:266,st:'stroke:var(--faint);stroke-width:1.5'},EX);tx(EX,240,288,'EXCEPTIONS','cap','fill:var(--ink)','start');
  geneBox(EX,320,314,{n:'g',t:'gene 4',col:'ink',w:66,h:22,fs:12});mkA(EX,320,328,320,346,{w:1.6,h:6}).lastChild.style.opacity=1;
  [...EX.querySelectorAll('.draw')].forEach(e=>e.style.strokeDashoffset=0);
  H.E('path',{d:'M282,360 q9,-10 19,0 t19,0 t19,0 t19,0',st:'fill:none;stroke:var(--mom);stroke-width:3;stroke-linecap:round'},EX);
  tx(EX,320,386,'RNA, no protein','lb','font-size:13px');
  geneBox(EX,470,314,{n:'g',t:'gene 5',col:'ink',w:66,h:22,fs:12});geneBox(EX,560,314,{n:'g',t:'gene 6',col:'ink',w:66,h:22,fs:12});
  const h1=grp(EX,470,350),h2=grp(EX,560,350);H.E('path',{d:'M0,-12 A12,12 0 0 0 0,12 Z',st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},h1);H.E('path',{d:'M0,-12 A12,12 0 0 1 0,12 Z',st:'fill:var(--dad-tint);stroke:var(--ink);stroke-width:1.5'},h2);
  tx(EX,515,386,'one enzyme, two genes','lb','font-size:13px');
  return [
    ()=>{H.O(ph,1,{d:800})},
    ()=>{H.O(MM,1,{d:600});H.O([cap1,P],1,{at:500});P.A.forEach((a,i)=>drawA(a,{at:700+i*300}));H.K(P.last,{fill:'hi'},{at:1700})},
    ()=>{H.O([cap2,chr],1);lk.forEach((a,i)=>drawA(a,{at:400+i*250}))},
    ()=>{H.O(EX,1,{d:600});H.T(h1,{x:503},{d:900,at:700});H.T(h2,{x:503},{d:900,at:700})},
  ];}},

/* 15 ─────────────────────────────── */
{sec:'5.4',title:'Searching for Auxotrophs',caption:'Ala, Leu, Cys, Met, Trp, Arg, Val, Tyr = the amino acids alanine, leucine, cysteine, methionine, tryptophan, arginine, valine, tyrosine',
text:`<p data-step="0">Beadle and Tatum exposed <i>Neurospora</i> <b>spores</b> to X-rays. A spore is a single cell that can grow into a new mould. X-rays damage DNA and change its sequence at random places.</p>
<p data-step="1">Each treated spore divided many times and made a <b>colony</b>: a group of cells that all descend from one cell. So all the cells of one colony have the same DNA.</p>
<p data-step="2">Most colonies still grew on minimal medium. Some colonies grew only on <b>complete medium</b> (CM): minimal medium plus amino acids, vitamins and other nutrients. A mutant that needs an extra nutrient is an <b>auxotroph</b>.</p>
<p data-step="3">Next, Beadle and Tatum tested each auxotroph on minimal medium plus one nutrient. One colony grew only on CM and on MM + the amino acid arginine (Arg). So it was an arginine auxotroph (arg<sup>−</sup>), with a broken gene in the arginine pathway.</p>
<p data-step="4">The search of Beadle and Tatum is a mutant screen. The study of a biological process through its mutants is <b>genetic analysis</b>.</p>`,
star:'Auxotroph: needs an extra nutrient. Prototroph: grows on minimal medium.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const t0=tube(s,90,110,1);const sp=H.g(t0);[[-5,10],[4,16],[-3,22],[5,6],[0,28]].forEach(([x,y])=>H.E('circle',{cx:x,cy:y,r:2.4,st:'fill:var(--ink)'},sp));
  tx(s,90,166,'spores','lbs');
  const bolts=[0,1,2].map(i=>H.E('path',{d:`M${18+i*10},${40+i*12} L${36+i*10},${58+i*12} L${30+i*10},${62+i*12} L${54+i*10},${84+i*10}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3;stroke-linecap:round;stroke-linejoin:round'},s));
  const xl=tx(s,20,30,'X-RAYS','cap','fill:var(--ink)','start');
  const one=H.E('circle',{cx:0,cy:0,r:3,st:'fill:var(--ink)'},s);H.T(one,{x:90,y:126},{d:0});H.O(one,0,{d:0});
  const a1=mkA(s,118,110,196,110,{w:1.8,h:7});const al=tx(s,157,98,'1 spore','lbs');H.O(al,0,{d:0});
  const t1=tube(s,236,110,1);H.O(t1,0,{d:0});const cl=tx(s,236,166,'1 colony','lbs');H.O(cl,0,{d:0});
  const names=[['CM',''],['MM',''],['MM','+Ala'],['MM','+Leu'],['MM','+Cys'],['MM','+Met'],['MM','+Trp'],['MM','+Arg'],['MM','+Val'],['MM','+Tyr']];
  const grows=[1,0,0,0,0,0,0,1,0,0];
  const bus=H.E('path',{d:'M236,178 L236,226 M44,226 L602,226',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--muted);stroke-width:1.5'},s);
  const T=names.map((n,i)=>{const x=44+i*62;const G=H.g(s);const tb=tube(G,x,300,.85);tx(G,x,352,n[0],'lb','font-size:13px');if(n[1])tx(G,x,368,n[1],'lbs','font-weight:700;fill:var(--ink)');
    const m=mark(G,x,392,!!grows[i]);const dot=H.E('circle',{cx:0,cy:0,r:3,st:'fill:var(--ink)'},G);H.T(dot,{x,y:226},{d:0});H.O(dot,0,{d:0});
    H.O(G,0,{d:0});return {G,tb,m,dot,x,g:grows[i]}});
  const ring=H.E('rect',{x:T[7].x-26,y:252,width:52,height:156,rx:10,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--bad);stroke-width:2.5'},s);
  const argl=tx(s,T[7].x,246,'arg⁻','lb','fill:var(--bad)');H.O(argl,0,{d:0});
  const many=H.g(s);H.O(many,0,{d:0});tx(many,500,38,'REPEAT FOR MANY SPORES','cap','fill:var(--ink)');
  for(let r=0;r<2;r++)for(let c=0;c<6;c++){const tt=tube(many,410+c*36,86+r*76,.6);if(!(r===1&&c===3))H.O(tt.gr,1,{d:0});}
  const test=(o,at)=>{H.O(o.G,1,{at});H.O(o.dot,1,{d:200,at:at+300});H.T(o.dot,{y:296},{d:700,at:at+300});H.O(o.dot,0,{d:200,at:at+1000});
    if(o.g)H.O(o.tb.gr,1,{d:600,at:at+1200});H.O(o.m,1,{at:at+1500})};
  return [
    ()=>{H.D(bolts,1,{d:800})},
    ()=>{H.O(one,1);H.T(one,{x:236,y:126},{d:1000,at:200});drawA(a1);H.O(al,1);H.O(t1,1,{at:600});H.O(one,0,{at:1200});H.O(t1.gr,1,{d:700,at:1300});H.O(cl,1,{at:1500})},
    ()=>{H.D(bus,1,{d:800});test(T[0],400);test(T[1],400)},
    ()=>{T.slice(2).forEach((o,i)=>test(o,i*150));H.D(ring,1,{d:800,at:2800});H.O(argl,1,{at:3000})},
    ()=>{H.O(many,1,{d:700})},
  ];}},

/* 16 ─────────────────────────────── */
{sec:'5.4',title:'Feeding Past the Block',caption:'simplified pathway · each row is a different arg⁻ mutant · red line = the broken step',
text:`<p data-step="0">In a simplified view, <i>Neurospora</i> makes arginine in three steps. The letters A, B and C start again here, because this is a different pathway. Enzyme A makes <b>ornithine</b> (Orn) from a <b>precursor</b> (a start compound). Enzyme B changes ornithine into <b>citrulline</b> (Cit). Enzyme C changes citrulline into arginine.</p>
<p data-step="1">In 1944, Adrian Srb and Norman Horowitz grew arg<sup>−</sup> mutants on minimal medium plus one of these compounds. When an added compound makes a mutant grow, the compound <b>rescues</b> the mutant. A compound rescues a mutant when it comes after the broken step.</p>
<p data-step="2">Gene C mutants grow only on MM + Arg. Their block is at the last step, so only arginine helps.</p>
<p data-step="3">Gene B mutants grow on MM + Cit or MM + Arg. Gene A mutants grow on all three. The more compounds rescue a mutant, the earlier its block is in the pathway.</p>
<p data-step="4">So the growth tests place each mutation at one step of the pathway.</p>`,
star:'Add a compound that comes after the block, and the mutant grows.',starStep:4,
scene(H){const s=document.getElementById('stage');
  const P=pathway(s,70,62,{gap:160,nodes:['precursor','ornithine (Orn)','citrulline (Cit)','arginine (Arg)'],enz:['A','B','C'],r:12,ew:78});
  H.O([...P.N,...P.E],0,{d:0});
  const cols=[230,390,550],ry=[188,268,348],res={A:[1,1,1],B:[0,1,1],C:[0,0,1]};
  const HD=H.g(s);H.O(HD,0,{d:0});['MM + Orn','MM + Cit','MM + Arg'].forEach((t,i)=>tx(HD,cols[i],130,t,'lb','font-size:13px'));
  const rows={};['A','B','C'].forEach((k,r)=>{const G=H.g(HD);tx(G,14,ry[r]+5,'gene '+k+' mutant','lb','font-size:13px','start');
    H.E('line',{x1:14,y1:ry[r]+40,x2:626,y2:ry[r]+40,st:'stroke:var(--faint);stroke-width:1'},G);
    const tb=cols.map(x=>tube(G,x,ry[r]-2,.62));const mk=cols.map((x,i)=>mark(s,x+30,ry[r]+4,!!res[k][i]));
    const ex=P.E[r].px;const ln=H.E('path',{d:`M${ex},78 L${ex},${ry[r]+28}`,pathLength:1,cls:'draw',st:'stroke:var(--bad);stroke-width:2.5'},s);
    rows[k]={tb,mk,ln,r}});
  const run=(k,at)=>{const o=rows[k];H.O(P.E[o.r].X,1,{d:300,at});H.D(o.ln,1,{d:700,at:at+200});
    o.tb.forEach((t,i)=>{if(res[k][i])H.O(t.gr,1,{d:600,at:at+900+i*150})});o.mk.forEach((m,i)=>H.O(m,1,{at:at+1100+i*150}))};
  const rl=tx(s,320,410,'block early → many compounds rescue · block late → few','lb','fill:var(--good);font-size:13px');H.O(rl,0,{d:0});
  return [
    ()=>{P.N.forEach((n,i)=>H.O(n,1,{at:i*400}));P.E.forEach((e,i)=>H.O(e,1,{at:200+i*400}));P.A.forEach((a,i)=>drawA(a,{at:200+i*400}));H.K(P.last,{fill:'hi'},{at:1400})},
    ()=>{H.O(HD,1,{d:700})},
    ()=>{run('C',0)},
    ()=>{run('B',0);run('A',1700)},
    ()=>{H.O(rl,1)},
  ];}},

/* 17 ─────────────────────────────── */
{sec:'5.4',title:'Transformation Rescue',caption:'photo: E. coli colonies on a dish of solid medium, Gaurav, CC BY 4.0, Wikimedia Commons (the marker lines are on the dish)',
text:`<p data-step="0">A compound added to the medium is one way to rescue a mutant. <b>Transformation rescue</b> gives the mutant a working copy of the broken gene instead.</p>
<p data-step="1">Example: in the bacterium <i>E. coli</i>, a<sup>+</sup> is the working allele of gene a, and a<sup>−</sup> is a broken allele. An a<sup>−</sup> strain grows only when the medium has the missing compound. The wild type (a<sup>+</sup>) grows with or without the compound.</p>
<p data-step="2"><b>Transformation</b>: a cell absorbs DNA from outside the cell. The a<sup>−</sup> cell absorbs a <b>plasmid</b>, a small circle of DNA, that carries a working copy of gene a.</p>
<p data-step="3">The cell reads the new gene and makes enzyme A. The pathway works again, so the cell grows on minimal medium and makes a colony. The working gene on the plasmid complements the broken allele.</p>
<p data-step="4">Some gene therapies use the same idea. Spinal muscular atrophy kills the nerve cells that control muscles. One treatment uses a modified virus to give these cells a working <i>SMN1</i> gene. A virus is a tiny particle that can carry genes into cells.</p>`,
star:'Rescue with a compound adds the product. Transformation rescue adds the gene.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const B=bact(s,150,236,1.35);const bl=tx(s,150,300,'a⁻ cell','lb');
  const pl=plasmid(s,150,74,26,{ins:'good',lab:'a⁺',fs:16});hide(pl);
  const TB=H.g(s);H.O(TB,0,{d:0});
  tx(TB,350,44,'strain','lbs','font-weight:700;fill:var(--ink)','start');tx(TB,460,44,'MM','lbs','font-weight:700;fill:var(--ink)');tx(TB,565,44,'MM + compound','lbs','font-weight:700;fill:var(--ink)');
  H.E('line',{x1:340,y1:54,x2:630,y2:54,st:'stroke:var(--ink);stroke-width:2'},TB);
  [['a⁻',[0,1]],['a⁺',[1,1]]].forEach(([n,g],i)=>{const y=80+i*32;tx(TB,350,y+5,n,'lb','font-size:15px','start');mark(TB,460,y,!!g[0],1,true);mark(TB,565,y,!!g[1],1,true);
    H.E('line',{x1:340,y1:y+16,x2:630,y2:y+16,st:'stroke:var(--faint);stroke-width:1'},TB)});
  const enz=grp(s,190,247,.001);H.E('rect',{x:-36,y:-11,width:72,height:22,rx:11,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},enz);tx(enz,0,4.5,'enzyme A','lbs','fill:#16181d;font-weight:700');H.O(enz,0,{d:0});
  const el=tx(s,150,356,'made from the a⁺ gene','lbs');H.O(el,0,{d:0});
  const PH=H.g(s);H.O(PH,0,{d:0});H.E('image',{href:'@@asset:c5-ecoli-colonies.jpg@@',x:420,y:150,width:210,height:168},PH);
  tag(PH,426,312,'real E. coli colonies');tx(PH,525,336,'each dot = one colony from one cell','lbs');
  const GT=H.g(s);H.O(GT,0,{d:0});tx(GT,300,362,'SAME IDEA: GENE THERAPY','cap','fill:var(--ink)','start');
  const hx=Array.from({length:6},(_,i)=>{const a=Math.PI/3*i+Math.PI/6;return `${360+18*Math.cos(a)},${392+18*Math.sin(a)}`}).join(' ');
  H.E('polygon',{points:hx,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2'},GT);H.E('path',{d:'M352,392 q4,-6 8,0 t8,0',st:'fill:none;stroke:var(--good);stroke-width:3'},GT);
  tx(GT,388,384,'virus +','lbs',null,'start');tx(GT,388,398,'SMN1 gene','lbs','font-weight:700;fill:var(--ink)','start');
  const ga=mkA(GT,470,392,514,392,{w:1.8,h:6});ga.lastChild.style.opacity=1;ga.firstChild.style.strokeDashoffset=0;
  H.E('circle',{cx:536,cy:392,r:14,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},GT);
  [[-1,-1],[-1,1],[0,-1.3]].forEach(([dx,dy])=>H.E('line',{x1:536+dx*12,y1:392+dy*10,x2:536+dx*22,y2:392+dy*20,st:'stroke:var(--ink);stroke-width:1.8'},GT));
  H.E('line',{x1:550,y1:392,x2:626,y2:392,st:'stroke:var(--ink);stroke-width:2.5'},GT);tx(GT,588,384,'nerve cell','lbs');
  return [
    ()=>{},
    ()=>{H.O(TB,1,{d:700})},
    ()=>{pop(pl);H.T(pl,{x:194,y:248,s:.82},{d:1300,at:800})},
    ()=>{H.O(enz,1,{d:200});H.T(enz,{x:150,y:334,s:1},{d:1000});H.O(el,1,{at:900});H.O(PH,1,{d:700,at:1100})},
    ()=>{H.O(GT,1,{d:700})},
  ];}},

/* 18 ─────────────────────────────── */
{sec:'5.4',title:'Building a DNA Library',caption:'Steps 1 to 3 of transformation rescue · green = gene a⁺ · grey = other genes · the letters show one EcoRI cut',
text:`<p data-step="0"><b>Step 1.</b> Extract DNA from wild-type <i>E. coli</i>. Cut the DNA into fragments with a <b>restriction enzyme</b>. A restriction enzyme cuts DNA only at one short sequence of letters. For example, the enzyme EcoRI cuts only at GAATTC.</p>
<p data-step="1"><b>Step 2.</b> Cut plasmids with the same restriction enzyme. DNA has two strands. The cut leaves a short single strand at each end, a <b>sticky end</b>. The sticky ends of the plasmids and of the fragments match.</p>
<p data-step="2"><b>Step 3.</b> Mix the fragments with the cut plasmids. The sticky ends pair, and the enzyme <b>DNA ligase</b> seals the joins. A plasmid with an added fragment is <b>recombinant DNA</b>. The plasmid is the <b>DNA vector</b>: it carries the fragment into a cell.</p>
<p data-step="3">The full set of plasmids is a <b>DNA library</b>. Most plasmids carry one fragment: some carry gene a, and others carry other genes (call them all b). A few plasmids close again with no fragment.</p>`,
star:'Cut both with one enzyme, pair the sticky ends, seal with ligase.',starStep:2,
scene(H){const s=document.getElementById('stage');
  tx(s,360,32,'WILD-TYPE E. COLI DNA','cap');
  const cuts=[200,300,400,500],edges=[100,...cuts,610];
  const fr=edges.slice(0,-1).map((a,i)=>{const b=edges[i+1];const G=H.g(s);H.E('line',{x1:a+2,y1:60,x2:b-2,y2:60,st:'stroke:var(--muted);stroke-width:7;stroke-linecap:round'},G);
    if(i===1)geneBox(G,(a+b)/2,60,{n:'a',t:'a⁺',col:'good',w:46,h:20,fs:12});else if(i===3)geneBox(G,(a+b)/2,60,{n:'b',t:'b⁺',col:'muted',w:46,h:20,fs:12});
    else H.E('rect',{x:(a+b)/2-10,y:52,width:20,height:16,rx:3,st:'fill:var(--faint);stroke:var(--ink);stroke-width:1'},G);G.cx=(a+b)/2;return G});
  const sc=cuts.map(x=>H.E('path',{d:`M${x},44 L${x},76`,pathLength:1,cls:'draw',st:'stroke:var(--bad);stroke-width:3;stroke-linecap:round'},s));
  const rl=tx(s,360,140,'EcoRI cuts at every GAATTC','lbs','font-weight:700;fill:var(--ink)');H.O(rl,0,{d:0});
  // sticky-end zoom
  const Z=H.g(s);H.O(Z,0,{d:0});tx(Z,16,196,'ONE ECORI CUT','cap',null,'start');
  const mono='font-family:ui-monospace,Menlo,Consolas,monospace;font-size:17px;font-weight:700;fill:var(--ink)';
  const zl=H.g(Z),zr=H.g(Z);tx(zl,28,226,'G','lb',mono,'start');tx(zl,28,250,'CTTAA','lb',mono,'start');tx(zr,38.5,226,'AATTC','lb',mono,'start');tx(zr,80.5,250,'G','lb',mono,'start');
  const zc=tx(Z,76,282,'sticky ends: AATT','lbs','fill:var(--bad);font-weight:700');H.O(zc,0,{d:0});
  // plasmids: a ring with a closable top segment
  const PX=[280,420,560],PY=262;
  const P=PX.map((x,i)=>{const G=grp(s,x,PY);H.E('path',{d:H.arcD(0,0,30,40,320),st:'fill:none;stroke:var(--ink);stroke-width:3'},G);
    G.cap=H.E('path',{d:H.arcD(0,0,30,-40,40),st:'fill:none;stroke:var(--ink);stroke-width:3'},G);
    G.ins=H.E('path',{d:H.arcD(0,0,30,-40,40),pathLength:1,cls:'draw',st:`fill:none;stroke:var(--${i?'muted':'good'});stroke-width:7`},G);
    G.ends=[-40,40].map(a=>{const q=H.E('circle',{cx:30*Math.sin(a*Math.PI/180),cy:-30*Math.cos(a*Math.PI/180),r:4,st:'fill:var(--bad)'},G);H.O(q,0,{d:0});return q});
    hide(G);return G});
  const pl=['a⁺ fragment','b⁺ fragment','no fragment'].map((t,i)=>{const e=tx(s,PX[i],312,t,'lbs','font-weight:700;fill:var(--ink)');H.O(e,0,{d:0});return e});
  const lab2=tx(s,420,206,'same enzyme: the plasmids open','lb','font-size:13px'),lab3=tx(s,420,206,'sticky ends pair · DNA ligase seals = recombinant DNA','lb','font-size:13px');H.O([lab2,lab3],0,{d:0});
  const lib=H.E('rect',{x:222,y:222,width:396,height:104,rx:14,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:2.5'},s);
  const libl=tx(s,420,350,'DNA library','lb');H.O(libl,0,{d:0});
  return [
    ()=>{H.D(sc,1,{d:400});H.O(sc,0,{d:300,at:700});fr.forEach((G,i)=>H.T(G,{x:(i-2)*10,y:56},{d:900,at:500}));H.O(rl,1,{at:1100})},
    ()=>{P.forEach((p,i)=>pop(p,{at:i*200}));P.forEach(p=>{H.O(p.cap,0,{d:400,at:1000});H.O(p.ends,1,{d:300,at:1100})});H.O(lab2,1,{at:1100});
      H.O(Z,1,{d:500});H.T(zr,{x:26},{d:900,at:900});H.O(zc,1,{at:1500})},
    ()=>{H.O(lab2,0);[1,3].forEach((fi,k)=>{H.T(fr[fi],{x:PX[k]-fr[fi].cx,y:150},{d:1000,at:200});H.O(fr[fi],0,{d:300,at:1100});H.D(P[k].ins,1,{d:500,at:1100});H.O(P[k].ends,0,{at:1200})});
      [0,2,4].forEach(fi=>H.O(fr[fi],.2,{at:200}));H.O(lab3,1,{at:1300});H.O(pl[0],1,{at:1500});H.O(pl[1],1,{at:1500})},
    ()=>{H.O(P[2].cap,1,{d:500});H.O(P[2].ends,0,{d:300});H.O(pl[2],1,{at:400});H.D(lib,1,{d:1000,at:300});H.O(libl,1,{at:1000})},
  ];}},

/* 19 ─────────────────────────────── */
{sec:'5.4',title:'Getting Plasmids into Cells',caption:'Steps 4 and 5 of transformation rescue · green arc = a⁺ fragment · grey arc = b⁺ fragment',
text:`<p data-step="0"><b>Step 4.</b> Make the a<sup>−</sup> cells <b>competent</b>: able to absorb DNA. One method soaks the cells in ice-cold calcium chloride, a salt.</p>
<p data-step="1"><b>Step 5.</b> Mix the library with the competent cells. Then give a <b>heat shock</b>: a quick change from ice-cold to about 42 °C. The heat shock drives plasmids into some cells.</p>
<p data-step="1" class="note">A second method is <b>electroporation</b>. A short electric pulse makes small holes in the <b>cell membrane</b>, the thin outer layer of the cell. Plasmids enter through the holes.</p>
<p data-step="2">Only a small fraction of the cells absorbs a plasmid. A cell that absorbs a plasmid is the <b>host</b> of that plasmid. A host usually absorbs one plasmid only.</p>
<p data-step="3">The host cell copies its plasmid many times. Identical copies of one DNA fragment are <b>clones</b>. When the host divides, each new cell gets copies of the plasmid too.</p>`,
star:'Calcium makes the cells ready. Heat drives the DNA in. The host copies it.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const bk=H.g(s);H.E('rect',{x:20,y:56,width:290,height:194,rx:16,st:'fill:var(--dad-tint);stroke:var(--ink);stroke-width:2'},bk);
  tx(bk,165,272,'ice-cold calcium chloride','lb','font-size:13px');
  const pos=[[78,112],[165,112],[252,112],[78,196],[165,196],[252,196]];
  const C=pos.map(([x,y])=>bact(s,x,y,.5,{fs:15}));H.O(C,0,{d:0});
  const pls=[[122,152,'good',1],[212,154,'muted',4],[40,154,null,-1],[290,160,'good',-1],[120,236,'muted',-1]].map(([x,y,ins,tgt])=>{const p=plasmid(s,x,y,11,{ins});H.O(p,0,{d:0});p.tgt=tgt;return p});
  const th=H.g(s);H.E('rect',{x:352,y:62,width:18,height:170,rx:9,st:'fill:var(--card);stroke:var(--ink);stroke-width:2'},th);
  H.E('circle',{cx:361,cy:244,r:15,st:'fill:var(--bad);stroke:var(--ink);stroke-width:2'},th);
  const col=H.E('rect',{x:356,y:0,width:10,height:1,rx:4,st:'fill:var(--dad)'},th);H.T(col,{y:232,sy:-24},{d:0});
  const t0=tx(th,380,214,'0 °C','lbs',null,'start'),t42=tx(th,380,90,'42 °C','lb','font-size:13px;fill:var(--bad)','start');H.O(t42,0,{d:0});
  const EP=H.g(s);H.O(EP,0,{d:0});H.E('path',{d:'M40,300 L28,322 L38,324 L26,348',st:'fill:none;stroke:var(--hi);stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round'},EP);
  tx(EP,52,318,'or electroporation:','lb','font-size:13px','start');tx(EP,52,336,'an electric pulse opens holes','lbs',null,'start');tx(EP,52,352,'in the cell membrane','lbs',null,'start');
  const hosts=[1,4].map(i=>{const t=tag(s,pos[i][0]-18,pos[i][1]-30,'host');H.O(t,0,{d:0});return t});
  const few=tx(s,165,40,'most cells absorb no plasmid','lbs','font-weight:700;fill:var(--ink)');H.O(few,0,{d:0});
  const Zm=H.g(s);H.O(Zm,0,{d:0});tx(Zm,525,282,'INSIDE ONE HOST','cap','fill:var(--ink)');
  bact(Zm,525,336,1.15,{});const zp=[[556,336],[548,318],[568,352],[540,354],[574,322]].map(([x,y],i)=>{const p=plasmid(Zm,x,y,8,{ins:'good'});if(i)H.T(p,{x:556,y:336,s:.001},{d:0});H.O(p,i?0:1,{d:0});return p});
  tx(Zm,525,394,'copies of one fragment = clones','lbs','font-weight:700;fill:var(--ink)');
  const ln=H.E('path',{d:'M180,206 Q330,300 450,330',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--muted);stroke-width:1.5'},s);
  return [
    ()=>{C.forEach((c,i)=>H.O(c,1,{at:i*80}));pls.forEach((p,i)=>H.O(p,1,{at:500+i*80}))},
    ()=>{H.T(col,{sy:-150},{d:1000});H.K(col,{fill:'bad'},{d:800});H.O(t42,1,{at:700});H.O(t0,.4,{at:700});
      pls.forEach(p=>{if(p.tgt>=0)H.T(p,{x:pos[p.tgt][0]+16,y:pos[p.tgt][1]+3,s:.85},{d:900,at:900})});H.O(EP,1,{at:1600})},
    ()=>{hosts.forEach(t=>H.O(t,1));H.O(few,1,{at:300});[0,2,3,5].forEach(i=>H.O(C[i],.45,{at:400}))},
    ()=>{H.D(ln,1,{d:700});H.O(Zm,1,{d:500,at:300});zp.forEach((p,i)=>{if(i){H.O(p,1,{d:200,at:800+i*250});H.T(p,{x:[556,548,568,540,574][i],y:[336,318,352,354,322][i],s:1},{d:600,at:800+i*250})}})},
  ];}},

/* 20 ─────────────────────────────── */
{sec:'5.4',title:'Selecting the Rescued Cells',caption:'yellow arc = AntiR gene · green arc = a⁺ gene · grey arc = b⁺ gene',
text:`<p data-step="0"><b>Step 6.</b> Spread the cells on a <b>plate</b>: a flat dish of solid medium. The plate has minimal medium plus an <b>antibiotic</b>, a drug that kills bacteria.</p>
<p data-step="1">Every plasmid also carries <b>AntiR</b>, a gene that protects the cell from the antibiotic. So the antibiotic kills every cell without a plasmid.</p>
<p data-step="2">The host cells are a<sup>−</sup> b<sup>+</sup>. A cell with an a<sup>+</sup> plasmid has a working gene a, so it grows on minimal medium. A cell with a b<sup>+</sup> plasmid or an empty plasmid stays auxotrophic.</p>
<p data-step="3">In a rare cell, a new random mutation changes the a<sup>−</sup> allele back to a working allele (a <b>reversion</b>). Such a cell has no plasmid, so the antibiotic kills it. On a plate without the antibiotic, it grows and gives a false result.</p>
<p data-step="4">So only cells with an a<sup>+</sup> plasmid grow into colonies. The antibiotic does a <b>selection</b>: it keeps only the cells with a plasmid. The minimal medium keeps only the cells with a working gene a.</p>`,
star:'The antibiotic keeps cells with a plasmid. Minimal medium keeps cells with a working gene a.',starStep:4,
scene(H){const s=document.getElementById('stage');const xs=[76,196,318,440,562],TOP=82,DOWN=300;
  const plate=H.g(s);H.E('rect',{x:20,y:196,width:600,height:208,rx:18,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2'},plate);tx(plate,36,220,'PLATE: MINIMAL MEDIUM + ANTIBIOTIC','cap','fill:var(--ink)','start');H.O(plate,0,{d:0});
  const kinds=[{t:'no plasmid',ok:false,p:null,mm:false},{t:'reversion',ok:true,p:null,mm:true},{t:'empty plasmid',ok:false,p:'e',mm:false},{t:'b⁺ plasmid',ok:false,p:'muted',mm:false},{t:'a⁺ plasmid',ok:false,p:'good',mm:true}];
  const mk=(i,k,y)=>{const G=H.g(s);G.c=bact(G,xs[i],y,.8,{ok:k.ok,fs:14});if(k.p){G.pl=plasmid(G,xs[i]+28,y+8,16,{ins:k.p==='e'?null:k.p,anti:false,s:.7})}return G};
  const K=kinds.map((k,i)=>{const o=Object.assign({},k);o.top=mk(i,k,TOP);o.cp=mk(i,k,TOP);H.O(o.cp,0,{d:0});
    o.l1=tx(s,xs[i],TOP+44,k.t,'lb','font-size:12.5px');o.l2=tx(s,xs[i],TOP+60,'on MM: '+(k.mm?'grows':'no growth'),'lbs',k.mm?'fill:var(--good);font-weight:700':'');H.O(o.l2,0,{d:0});
    if(i===1)H.O([o.top,o.l1],0,{d:0});return o});
  const anti=K.filter(o=>o.p).flatMap(o=>[o.top.pl.anti,o.cp.pl.anti]);
  const fate=K.map((o,i)=>{const G=H.g(s);const y=356;
    if(i<2){mark(G,xs[i],DOWN,false,1.8,true);tx(G,xs[i],y,'killed: no AntiR','lbs','fill:var(--bad);font-weight:700')}
    else if(i<4){tx(G,xs[i],y,'alive, no enzyme A:','lbs');tx(G,xs[i],y+16,'no colony','lbs','font-weight:700;fill:var(--ink)')}
    else{const cg=H.g(G);[[-14,-4,7],[0,-9,9],[13,-3,7],[-6,8,7],[8,9,8]].forEach(([dx,dy,r])=>H.E('circle',{cx:xs[i]+dx,cy:DOWN-8+dy,r,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.2'},cg));
      tx(G,xs[i],y,'colony: rescued','lbs','fill:var(--good);font-weight:700')}
    H.O(G,0,{d:0});return G});
  const drop=(i,at)=>{const o=K[i];H.O(o.cp,1,{d:200,at});H.T(o.cp,{y:DOWN-TOP},{d:1000,at})};
  return [
    ()=>{H.O(plate,1,{d:600})},
    ()=>{H.O(anti,1,{d:600});drop(0,500);H.O(K[0].cp,.3,{at:1600});H.O(fate[0],1,{at:1600})},
    ()=>{K.forEach((o,i)=>{if(i!==1)H.O(o.l2,1,{at:i*150})})},
    ()=>{H.O([K[1].top,K[1].l1,K[1].l2],1,{d:500});drop(1,600);H.O(K[1].cp,.3,{at:1700});H.O(fate[1],1,{at:1700})},
    ()=>{[2,3,4].forEach((i,k)=>drop(i,k*150));[2,3,4].forEach(i=>H.O(fate[i],1,{at:1300}))},
  ];}},

/* 21 ─────────────────────────────── */
{sec:'5.2–5.4',title:'Three Ways to Fill the Gap',wide:true,steps:3,
text:`<div class="tblwrap" data-step="0"><table class="tbl">
<thead><tr><th></th><th>Complementation test</th><th>Rescue with a compound</th><th>Transformation rescue</th></tr></thead>
<tbody>
<tr><td>What the mutant gets</td><td>a working copy of the gene, from the other parent</td><td>a compound that comes after the block, in the medium</td><td>a working copy of the gene, on a plasmid</td></tr>
<tr><td>Method</td><td>cross two mutants and examine the F1</td><td>grow the mutant on minimal medium plus one compound</td><td>give a DNA library to competent mutant cells</td></tr>
</tbody><tbody data-step="1">
<tr><td>Needs</td><td>two copies of each gene in one cell; recessive, true-breeding mutants</td><td>a cell that can absorb the compound</td><td>competent cells, a DNA library and an antibiotic to kill cells without a plasmid</td></tr>
</tbody><tbody data-step="2">
<tr><td>Wild type or growth shows</td><td>the two mutations are in different genes</td><td>the block is before the added compound</td><td>the plasmid carries a working copy of the broken gene</td></tr>
</tbody></table></div>`,
star:'Each method gives the mutant what it lacks: a gene from the other parent, a compound after the block, or a gene on a plasmid.',starStep:2},

/* 22 ─────────────────────────────── */
{sec:'5.5',title:'Summary',wide:true,steps:2,
text:`<div class="cols" data-step="0"><div><h3>The complementation test</h3><ul>
<li>A trait often depends on a biochemical pathway: a chain of enzymes, each made by a different gene.</li>
<li>A recessive mutant has two broken copies of one gene. One working copy is enough for the wild type.</li>
<li>The complementation test crosses two true-breeding recessive mutants with the same phenotype.</li>
<li>A wild-type F1 means that the mutations complement: they are almost always in different genes (non-allelic).</li>
<li>A mutant F1 means that the mutations fail to complement: they are in the same gene (allelic).</li>
</ul></div><div data-step="1"><h3>Groups and rescue</h3><ul>
<li>Mutations that fail to complement each other form a complementation group. Each group is one gene.</li>
<li>A double-hit strain has two broken genes, so it fails to complement two groups.</li>
<li>An auxotroph needs an extra nutrient. A compound after its block rescues it, so growth tests show the order of the steps.</li>
<li>Transformation rescue gives the mutant a working copy of the gene on a plasmid. An antibiotic kills the cells without a plasmid.</li>
</ul></div></div>`},

/* 23 ─────────────────────────────── */
{sec:'5.6',title:'Key Terms',wide:true,steps:1,
text:`<div class="terms" data-step="0" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr))">
<div class="term"><b>Biochemical pathway</b>A chain of chemical steps. One enzyme does each step.</div>
<div class="term"><b>Allelic mutations</b>Mutations in the same gene. They fail to complement.</div>
<div class="term"><b>Non-allelic mutations</b>Mutations in different genes. They complement each other.</div>
<div class="term"><b>Complementation</b>Two mutants give a wild-type F1: each parent gives a working gene that the other lacks.</div>
<div class="term"><b>Complementation test</b>A cross that shows if two recessive mutants share a broken gene. Other name: cis–trans test.</div>
<div class="term"><b>Complementation group</b>Mutations that fail to complement each other. One group = one gene.</div>
<div class="term"><b>Double-hit strain</b>A strain with mutations in two different genes.</div>
<div class="term"><b>Recessive</b>An allele with no effect when a working copy is present.</div>
<div class="term"><b>True-breeding</b>Homozygous: every gamete carries the same allele.</div>
<div class="term"><b>Mutant screen</b>A search for mutants with a changed trait.</div>
<div class="term"><b>Prototroph · auxotroph</b>A prototroph grows on minimal medium. An auxotroph is a mutant that needs an extra nutrient.</div>
<div class="term"><b>Minimal (MM) · complete medium (CM)</b>MM: sugar, salts and only the vitamins that the species cannot make. CM: MM plus amino acids and vitamins.</div>
<div class="term"><b>Rescue</b>Growth that an added compound or gene gives back to a mutant.</div>
<div class="term"><b>Transformation</b>A cell absorbs foreign DNA.</div>
<div class="term"><b>Transformation rescue</b>A rescue that gives a working copy of the broken gene.</div>
<div class="term"><b>Competent cell</b>A cell that can absorb DNA, for example after calcium chloride.</div>
<div class="term"><b>Heat shock</b>A quick change from ice-cold to about 42 °C. It drives DNA into competent cells.</div>
<div class="term"><b>Electroporation</b>A short electric pulse that opens holes in the cell membrane.</div>
<div class="term"><b>Restriction enzyme</b>An enzyme that cuts DNA at one short sequence only.</div>
<div class="term"><b>DNA vector</b>A DNA molecule, such as a plasmid, that carries a fragment into a host cell.</div>
<div class="term"><b>Plasmids</b>Small circles of DNA in bacteria. The host cell copies them.</div>
<div class="term"><b>Recombinant DNA</b>A vector with an added DNA fragment.</div>
<div class="term"><b>Clones</b>Identical copies of one DNA fragment.</div>
<div class="term"><b>DNA library</b>A set of plasmids that together hold the fragments of a genome.</div>
</div>`},

/* 24 ─────────────────────────────── */
{sec:'5.7–5.8',title:'Check Your Understanding',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">1a. A fungus normally makes the amino acid proline (Pro). How do you design a mutant screen to find the genes for proline synthesis?</div><button>Show answer</button><div class="a" hidden>Treat wild-type (prototrophic) spores with a mutagen, for example X-rays. Let each spore make a colony. Test each colony on minimal medium and on minimal medium plus proline. Keep the colonies that grow only with added proline. They are proline auxotrophs.</div></div>
<div class="qa"><div class="q">1b. The screen finds ten mutants (#1 to #10) that grow poorly without proline. How do you find the number of different genes that they represent?</div><button>Show answer</button><div class="a" hidden>Do complementation tests between pairs of mutants. In a fungus, the two strains must share one cell. Yeast cells mate into a diploid cell, and <i>Neurospora</i> threads fuse into a heterokaryon. If the fused cell grows without proline, the two mutations complement. The number of complementation groups is the number of genes.<br>Two other methods help. Genetic mapping (finding the position of each mutation on a chromosome): mutations that map far apart are in different genes. Growth tests: a different response to the compounds before proline suggests a different gene.</div></div>
<div class="qa"><div class="q">1c and 1d. Two of the mutants share one fused cell. What is the phenotype of the fused cell if (c) all ten mutants are in different genes? (d) all ten are in the same gene?</div><button>Show answer</button><div class="a" hidden>(c) Wild type: the fused cell grows on minimal medium without proline. Each strain gives a working copy of the gene that the other lacks. (d) Mutant: the fused cell grows only with added proline. Neither strain has a working copy of that gene.<br>The offspring of a cross are different. Two haploid strains mate, and their spores are haploid again. Each spore gets one copy of each gene, so in (c) some spores are wild type and some are mutant. In (d), all spores are mutant.</div></div>
<div class="qa"><div class="q">2. Draw a complementation table for five yeast mutants with at least three mutant loci (loci is the plural of locus). One mutant is a double hit.</div><button>Show answer</button><div class="a" hidden>Many answers are correct. Example (− = no complementation, + = complementation):
<table class="tbl"><thead><tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead><tbody>
<tr><td>1</td><td>−</td><td></td><td></td><td></td><td></td></tr><tr><td>2</td><td>−</td><td>−</td><td></td><td></td><td></td></tr>
<tr><td>3</td><td>+</td><td>+</td><td>−</td><td></td><td></td></tr><tr><td>4</td><td>+</td><td>+</td><td>+</td><td>−</td><td></td></tr>
<tr><td>5</td><td>+</td><td>+</td><td>−</td><td>−</td><td>−</td></tr></tbody></table>
Mutants 1 and 2 share locus 1. Mutant 3 is in locus 2. Mutant 4 is in locus 3. Mutant 5 fails to complement 3 and 4, but 3 and 4 complement each other. So mutant 5 is a double hit in loci 2 and 3.</div></div>
<div class="qa"><div class="q">3. Students make an <i>E. coli</i> strain that cannot make the amino acid methionine. Three students make plasmid libraries from wild-type DNA: student A cuts with EcoRI, student B with HindIII, student C with XhoI (two other restriction enzymes). Only student A gets colonies on minimal medium. The transformation works for all three. Explain.</div><button>Show answer</button><div class="a" hidden>The methionine gene has a HindIII site and an XhoI site inside it, but no EcoRI site. So EcoRI can make a fragment that holds the whole gene. HindIII and XhoI cut the gene into two or more pieces. No plasmid in those libraries carries a complete working gene, so no cell gets a working gene.</div></div>
<div class="qa"><div class="q">4. A plasmid with a<sup>+</sup> rescues an a<sup>−</sup> strain. Can you also rescue it with medium that contains enzyme A (the product of the a<sup>+</sup> gene)? With the product of enzyme A?</div><button>Show answer</button><div class="a" hidden>Enzyme A: no. <i>E. coli</i> cells do not normally absorb proteins from outside. So the enzyme cannot reach the pathway inside the cell. The product of enzyme A: yes, if the cells can absorb it. The product comes after the block, so the rest of the pathway can use it.</div></div>
</div>`},

]});

/* ---- shared cross figure for slides 5 and 6 ---- */
function crossFig(s,c){const R={};const X1=190,X2=450,Y=[46,74],GY=166,FX=320,FY=262;
  R.par=H.g(s);
  R.f1=flower(R.par,64,58,.6);R.f2=flower(R.par,576,58,.6);
  Y.forEach(y=>{chrom(R.par,X1,y,'dad',c.g1);chrom(R.par,X2,y,'mom',c.g2)});
  tx(R.par,X1,106,c.l1,'lb','font-size:13px');tx(R.par,X2,106,c.l2,'lb','font-size:13px');
  tx(R.par,320,70,'×','big');H.O(R.par,0,{d:0});
  R.gam=[X1,X2].map(x=>H.E('ellipse',{cx:x,cy:GY,rx:68,ry:22,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:1.6'},s));
  R.gl=[tx(s,X1-76,GY+5,'gamete '+c.gt1,'lbs','font-weight:700;fill:var(--ink)','end'),tx(s,X2+76,GY+5,'gamete '+c.gt2,'lbs','font-weight:700;fill:var(--ink)','start')];H.O(R.gl,0,{d:0});
  R.F=grp(s,FX,FY);H.E('ellipse',{rx:84,ry:40,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},R.F);hide(R.F);
  R.k1=chrom(s,X1,Y[1],'dad',c.g1);R.k2=chrom(s,X2,Y[1],'mom',c.g2);H.O([R.k1,R.k2],0,{d:0});
  R.fl=tx(s,FX,FY+58,c.fl,'lb');H.O(R.fl,0,{d:0});
  R.ff=flower(s,560,252,.62);hide(R.ff);
  R.P=pathway(s,120,374,{gap:200,nodes:['compound 1','compound 2','purple pigment'],r:12,ew:76});H.O(R.P,0,{d:0});
  H.O([R.P.N[1],R.P.N[2]],.28,{d:0});R.P.E.forEach(e=>H.O(e,0,{d:0}));
  return R;}
function crossSteps(R,keep){return [
  ()=>{H.O(R.par,1,{d:700})},
  ()=>{H.D(R.gam,1,{d:800});H.O(R.gl,1,{at:600});H.O([R.k1,R.k2],1,{d:250});H.T(R.k1,{x:190,y:166},{d:1000,at:150});H.T(R.k2,{x:450,y:166},{d:1000,at:150})},
  ()=>{if(keep){H.O(R.gam,.35,{d:500});H.O(R.gl,.5,{d:300})}else{H.D(R.gam,0,{d:500});H.O(R.gl,0,{d:300})}pop(R.F);H.T(R.k1,{x:320,y:250},{d:1100,at:200});H.T(R.k2,{x:320,y:276},{d:1100,at:200});H.O(R.fl,1,{at:1000});pop(R.ff,{at:900})},
];}
})();
