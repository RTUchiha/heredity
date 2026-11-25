/* Chapter 7 · The Central Dogma: Mutations and Biochemical Pathways · source: Hairdity.pdf ch. 7 (Singh, Introduction to Genetics, CC BY-NC-SA 4.0) */
(function(){
const H=window.HL;

/* ---- deck-local colour tokens: RNA teal, protein/pigment purple, culture colours ---- */
(function(){const D='--rna:#3fd3cf;--rna-tint:#123a3a;--aa:#c79bff;--aa-tint:#35264f;--petal:#e9edf4;--pk:#0d0f13;--good-tint:#173a2b;--bad-tint:#4b2124;--ylw:#ffd84d;--orn:#ff9c48;--mucus:#7f8a4a;';
  const st=document.createElement('style');
  st.textContent=':root{--rna:#0b8a8f;--rna-tint:#d5f0f0;--aa:#7b3fc4;--aa-tint:#ece1fa;--petal:#ffffff;--pk:#16181d;--good-tint:#d8f0e3;--bad-tint:#fbdfdf;--ylw:#f2c200;--orn:#ee7a10;--mucus:#b9c27a}'+
   '@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){'+D+'}}:root[data-theme="dark"]{'+D+'}';
  document.head.appendChild(st);})();

/* ---- deck-local helpers ---- */
function mkA(p,x1,y1,x2,y2,o){const a=H.arrow(p,x1,y1,x2,y2,o);H.O(a.lastChild,0,{d:0});return a;}
function drawA(a,o){H.D(a.firstChild,1,Object.assign({d:600},o));H.O(a.lastChild,1,Object.assign({d:200},o,{at:((o&&o.at)||0)+450}));}
function undrawA(a,o){H.D(a.firstChild,0,Object.assign({d:300},o));H.O(a.lastChild,0,Object.assign({d:150},o));}
function shown(a){a.firstChild.style.strokeDashoffset=0;H.O(a.lastChild,1,{d:0});return a;}
function pop(e,o){H.T(e,{s:e._s||1},Object.assign({d:700},o));H.O(e,1,Object.assign({d:300},o));}
function hide(e){H.T(e,{s:.001},{d:0});H.O(e,0,{d:0});}
function grp(p,x,y,s){const G=H.g(p);H.T(G,{x,y,s:s||1},{d:0});G._s=s||1;return G;}
function tx(p,x,y,t,cls,st,anchor){return H.txt(p,x,y,t,cls||'lb',{'text-anchor':anchor||'middle',st:st||null});}
const MONO='font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:700;';
/* rounded photo with a border */
let CLIPN=0;
function photo(p,href,x,y,w,h,o){o=o||{};const id='c7clip'+(++CLIPN);const G=H.g(p);
  const cp=H.E('clipPath',{id},G);H.E('rect',{x,y,width:w,height:h,rx:o.r!=null?o.r:10},cp);
  H.E('image',{href,x,y,width:w,height:h,preserveAspectRatio:o.fit||'xMidYMid slice','clip-path':`url(#${id})`},G);
  H.E('rect',{x,y,width:w,height:h,rx:o.r!=null?o.r:10,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},G);return G;}
/* dark label tag for photos */
function tag(p,x,y,t,anchor){const G=H.g(p);const w=t.length*6.7+14;const bx=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;
  H.E('rect',{x:bx,y:y-14,width:w,height:21,rx:5,st:'fill:#16181d;opacity:.86'},G);H.txt(G,bx+7,y+1,t,'lbs',{st:'fill:#fff;font-weight:700'});return G;}
/* one letter tile (DNA or RNA). kind: dna | rna | ghost */
function tile(p,x,y,ch,kind,o){o=o||{};const w=o.w||22,h=o.h||26;const G=grp(p,x,y);
  const f={dna:'var(--card)',rna:'var(--rna-tint)',ghost:'var(--wash)'}[kind||'dna'],sc={dna:'var(--ink)',rna:'var(--rna)',ghost:'var(--faint)'}[kind||'dna'];
  G.r=H.E('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:4,st:`fill:${f};stroke:${sc};stroke-width:1.6`},G);
  G.t=H.txt(G,0,5.5,ch,'lb',{'text-anchor':'middle',st:MONO+`font-size:${o.fs||15}px;fill:${kind==='rna'?'var(--rna)':'var(--ink)'}`});G.ch=ch;return G;}
function row(p,x0,y,str,kind,o){o=o||{};const dx=o.dx||24;return [...str].map((c,i)=>tile(p,x0+i*dx,y,c,kind,o));}
/* amino-acid bead */
function bead(p,x,y,lab,o){o=o||{};const r=o.r||15;const G=grp(p,x,y);
  G.c=H.E('circle',{r,st:`fill:${o.fill||'var(--aa)'};stroke:var(--ink);stroke-width:1.5`},G);
  G.t=H.txt(G,0,3.8,lab,'lbs',{'text-anchor':'middle',st:`font-weight:700;font-size:${o.fs||10.5}px;fill:${o.tc||'var(--paper)'}`});return G;}
/* flower glyph (petals recolourable) */
function flower(p,x,y,s,col){const G=grp(p,x,y,s);
  H.E('path',{d:'M0,10 C3,30 -3,46 0,64',st:'fill:none;stroke:var(--good);stroke-width:3.5;stroke-linecap:round'},G);
  H.E('path',{d:'M1,46 C10,34 24,34 30,38 C22,48 10,50 1,46Z',st:'fill:var(--good)'},G);
  G.pet=[0,72,144,216,288].map(a=>H.E('ellipse',{cx:0,cy:-15,rx:10,ry:15,transform:`rotate(${a})`,st:`fill:${H.C(col||'petal')};stroke:var(--pk);stroke-width:1.6`},G));
  H.E('circle',{r:6.5,st:'fill:var(--hi);stroke:var(--pk);stroke-width:1.5'},G);return G;}
function paint(G,col,o){G.pet.forEach(e=>H.K(e,{fill:col},o));}
/* red X badge */
function xBadge(p,x,y,r){const G=grp(p,x,y);r=r||8;H.E('circle',{r,st:'fill:var(--bad);stroke:var(--card);stroke-width:1.5'},G);
  const k=r*.4;H.E('path',{d:`M${-k},${-k} L${k},${k} M${k},${-k} L${-k},${k}`,st:'stroke:#fff;stroke-width:2;stroke-linecap:round'},G);return G;}
function mark(p,x,y,ok,s,show){const G=grp(p,x,y,s);
  H.E('path',{d:ok?'M-6,0 L-2,5 L7,-6':'M-5,-5 L5,5 M5,-5 L-5,5',st:`fill:none;stroke:var(--${ok?'good':'bad'});stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round`},G);
  H.O(G,show?1:0,{d:0});return G;}
/* petri plate (top view) with a growth layer */
function plate(p,x,y,r,o){o=o||{};const G=grp(p,x,y);
  H.E('circle',{r,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2'},G);H.E('circle',{r:r-4,st:'fill:none;stroke:var(--faint);stroke-width:1'},G);
  G.gr=H.g(G);let sd=o.seed||3;const rnd=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
  for(let i=0;i<(o.n||14);i++){const a=rnd()*Math.PI*2,d=Math.sqrt(rnd())*(r-9);H.E('circle',{cx:d*Math.cos(a),cy:d*Math.sin(a),r:3+rnd()*4,st:`fill:${H.C(o.col||'hi')};stroke:var(--ink);stroke-width:.8`},G.gr)}
  H.O(G.gr,0,{d:0});return G;}
/* gene box on a DNA bar */
function gbox(p,x,y,t,o){o=o||{};const w=o.w||64,h=o.h||22;const G=grp(p,x,y);
  G.r=H.E('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:5,st:`fill:${H.C(o.fill||'ink')};stroke:var(--ink);stroke-width:1.5`},G);
  G.t=tx(G,0,4.5,t,'lbs',`font-weight:700;fill:${o.tc||'var(--paper)'}`);return G;}
/* enzyme pill over a pathway arrow, with an X overlay */
function pill(p,x,y,t,o){o=o||{};const w=o.w||(t.length*6.6+18);const G=grp(p,x,y);
  H.E('rect',{x:-w/2,y:-11,width:w,height:22,rx:11,st:`fill:${H.C(o.fill||'hi')};stroke:var(--ink);stroke-width:1.5`},G);
  tx(G,0,4.5,t,'lbs',`font-weight:700;fill:${o.tc||'#16181d'}`);
  G.X=H.g(G);H.E('rect',{x:-w/2,y:-11,width:w,height:22,rx:11,st:'fill:var(--card);opacity:.6'},G.X);xBadge(G.X,w/2-2,-10,8);H.O(G.X,0,{d:0});return G;}

/* the standard genetic code (first base = row block, second base = column, third base = row inside the block) */
const B='UCAG',AA1='FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
const AA3={F:'Phe',L:'Leu',S:'Ser',Y:'Tyr','*':'Stop',C:'Cys',W:'Trp',P:'Pro',H:'His',Q:'Gln',R:'Arg',I:'Ile',M:'Met',T:'Thr',N:'Asn',K:'Lys',V:'Val',A:'Ala',D:'Asp',E:'Glu',G:'Gly'};
function aaOf(c){c=c.replace(/T/g,'U');const i=B.indexOf(c[0])*16+B.indexOf(c[1])*4+B.indexOf(c[2]);return AA3[AA1[i]];}

deck({
docTitle:'The Central Dogma · Heredity Ch.7',
title:'The Central Dogma: Mutations and Biochemical Pathways',
chapter:7,
eyebrow:'Heredity · Chapter 7 · The Central Dogma',
slides:[

/* 1 ─────────────────────────────── */
{sec:'7.1',title:'From Gene to Trait',caption:'teal = RNA · purple = protein and pigment · red badge = a mutation',
text:`<p data-step="0">A <b>gene</b> is a segment of <b>DNA</b>. DNA is a long molecule built from four chemical letters: A, C, G and T. The order of the letters is the DNA <b>sequence</b>.</p>
<p data-step="1">The cell copies the sequence of a gene into a similar molecule, <b>RNA</b>. Biologists call this copy step <b>transcription</b>.</p>
<p data-step="2">The cell reads the RNA and joins <b>amino acids</b> into a chain, a <b>polypeptide</b>. Biologists call this step <b>translation</b>. The chain folds into a <b>protein</b>.</p>
<p data-step="3">Many proteins are <b>enzymes</b>: proteins that make one chemical reaction go fast. In a purple flower, enzymes make the purple <b>pigment</b> (a coloured compound).</p>
<p data-step="4">A <b>mutation</b> is a change in the DNA sequence. A mutation can break the gene for one of these enzymes. Then the cell makes no pigment, and the flower is white.</p>
<p data-step="4" class="note">In Mendel's peas, the white <b>allele</b> (a version of a gene) has a one-letter change in a gene that starts the pigment enzymes.</p>`,
star:'DNA makes RNA, RNA makes protein, protein makes the trait.',starStep:4,
scene(H){const s=document.getElementById('stage');const DY=84;
  const dna=H.g(s);const d1=H.E('path',{d:`M24,${DY} L616,${DY}`,pathLength:1,cls:'draw',st:'stroke:var(--ink);stroke-width:3'},dna),d2=H.E('path',{d:`M24,${DY+16} L616,${DY+16}`,pathLength:1,cls:'draw',st:'stroke:var(--ink);stroke-width:3'},dna);
  const rungs=H.g(dna);for(let x=30;x<612;x+=11)H.E('line',{x1:x,y1:DY+2,x2:x,y2:DY+14,st:'stroke:var(--muted);stroke-width:1.6'},rungs);H.O(rungs,0,{d:0});
  tx(s,24,DY-16,'DNA','cap','fill:var(--ink)','start');
  const gene=H.g(s);H.E('rect',{x:236,y:DY-10,width:168,height:36,rx:7,st:'fill:none;stroke:var(--aa);stroke-width:3'},gene);tx(gene,320,DY-18,'one gene','lb','fill:var(--aa)');H.O(gene,0,{d:0});
  const mut=xBadge(s,290,DY+8,9);hide(mut);const mL=tx(s,278,DY+44,'mutation','lbs','font-weight:700;fill:var(--bad)','end');H.O(mL,0,{d:0});
  // transcription
  const tA=mkA(s,320,DY+32,320,DY+58,{w:1.8,h:6});const tL=tx(s,332,DY+50,'transcription','lbs',null,'start');H.O(tL,0,{d:0});
  const RY=DY+80;let wd=`M240,${RY}`;for(let x=240;x<400;x+=10)wd+=` Q${x+5},${(x/10)%2?RY-6:RY+6} ${x+10},${RY}`;
  const rna=H.E('path',{d:wd,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--rna);stroke-width:4;stroke-linecap:round'},s);
  const rL=tx(s,230,RY+5,'mRNA','lb','fill:var(--rna)','end');H.O(rL,0,{d:0});
  // translation: ribosome walks the mRNA, beads trail behind it, then fold
  const EY=318;
  const enz=H.g(s);H.E('path',{d:`M352,${EY-6} C346,${EY-36} 296,${EY-36} 292,${EY-6} C288,${EY+24} 312,${EY+40} 336,${EY+34} C352,${EY+30} 360,${EY+20} 352,${EY+12} L336,${EY+4} Z`,st:'fill:var(--aa-tint);stroke:var(--aa);stroke-width:2.5'},enz);H.O(enz,0,{d:0});
  const rib=grp(s,248,RY+4);H.E('ellipse',{cx:0,cy:-14,rx:22,ry:13,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2'},rib);H.E('ellipse',{cx:0,cy:8,rx:28,ry:15,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2'},rib);hide(rib);
  const trL=tx(s,412,RY+5,'translation','lbs',null,'start');H.O(trL,0,{d:0});
  const NB=8;const beads=[];for(let i=0;i<NB;i++){const b=H.E('circle',{r:8,st:'fill:var(--aa);stroke:var(--ink);stroke-width:1.3'},s);H.T(b,{x:384-i*20,y:RY+44,s:.001},{d:0});H.O(b,0,{d:0});beads.push(b)}
  const chL=tx(s,236,RY+49,'polypeptide','lbs','font-weight:700;fill:var(--aa)','end');H.O(chL,0,{d:0});
  const fold=[[306,EY-16],[322,EY-22],[338,EY-14],[304,EY+2],[320,EY-2],[304,EY+18],[320,EY+18],[336,EY+22]];
  const eL=tx(s,322,EY+64,'folded protein: an enzyme','lbs','font-weight:700;fill:var(--ink)');H.O(eL,0,{d:0});
  const eX=xBadge(s,352,EY-30,10);hide(eX);
  // reaction: colourless compound -> purple pigment
  const home=i=>[118+(i%3)*28,EY-12+Math.floor(i/3)*26];
  const dots=[];for(let i=0;i<6;i++){const c=H.E('circle',{r:8,st:'fill:var(--card);stroke:var(--muted);stroke-width:1.6'},s);H.T(c,{x:home(i)[0],y:home(i)[1]},{d:0});H.O(c,0,{d:0});dots.push(c)}
  const cL=tx(s,146,EY+64,'colourless compound','lbs');H.O(cL,0,{d:0});
  const fl=flower(s,548,EY-12,1.05);hide(fl);const fL=tx(s,548,EY+80,'','lb');
  return [
    ()=>{H.D([d1,d2],1,{d:1100});H.O(rungs,1,{at:600});H.O(gene,1,{at:900})},
    ()=>{drawA(tA);H.O(tL,1,{at:300});H.D(rna,1,{d:1000,at:500});H.O(rL,1,{at:900})},
    ()=>{pop(rib);H.O(trL,1,{at:300});H.T(rib,{x:392},{d:2200,at:400});
      beads.forEach((b,i)=>{const k=NB-1-i;H.T(b,{x:392-20*0,y:RY+44},{d:0});H.after(500+k*260,()=>{H.O(b,1,{d:150});H.T(b,{s:1,x:268+k*17},{d:300})})});
      H.O(chL,1,{at:2500});
      H.after(2900,()=>{H.O([rib,chL],0,{d:400});beads.forEach((b,i)=>H.T(b,{x:fold[i][0],y:fold[i][1]},{d:1100,at:i*40}));H.O(enz,1,{d:600,at:900});H.O(eL,1,{at:1200})})},
    ()=>{pop(fl,{d:500});H.O(cL,1);dots.forEach((c,i)=>{H.O(c,1,{d:200,at:i*80});H.T(c,{x:322,y:EY},{d:900,at:300+i*260,ease:'ease-in'});
        H.after(1200+i*260,()=>{H.K(c,{fill:'aa',stroke:'ink'},{d:200});H.T(c,{x:444+(i%3)*22,y:EY-12+Math.floor(i/3)*24},{d:700})})});
      paint(fl,'aa',{d:700,at:2600});H.after(2600,()=>{fL.textContent='purple flower'})},
    ()=>{pop(mut);H.O(mL,1,{at:300});pop(eX,{at:500});H.O(enz,.35,{at:600});H.O(beads,.35,{at:600});
      dots.forEach((c,i)=>{H.K(c,{fill:'card',stroke:'muted'},{d:500,at:600});H.T(c,{x:home(i)[0],y:home(i)[1]},{d:900,at:700})});
      paint(fl,'petal',{d:700,at:1200});H.after(1300,()=>{fL.textContent='white flower'})},
  ];}},

/* 2 ─────────────────────────────── */
{sec:'7.1',title:'The Central Dogma',caption:'solid arrows = flow in all cells · dashed arrow = flow in some viruses · red = never happens',
text:`<p data-step="0">The <b>Central Dogma</b> of molecular biology describes the flow of genetic information in a cell: DNA → RNA → protein.</p>
<p data-step="1"><b>Replication:</b> the cell copies its DNA before each cell division. <b>Transcription:</b> the cell copies a gene into <b>messenger RNA (mRNA)</b>. <b>Translation:</b> the cell reads the mRNA and makes a polypeptide.</p>
<p data-step="2">Information never flows from a protein back to RNA or DNA. A cell cannot use a protein as a template to write a gene.</p>
<p data-step="3">Some viruses, for example HIV, copy their RNA into DNA. Biologists call this RNA → DNA step <b>reverse transcription</b>. The rule still holds, because the information starts in a nucleic acid (DNA or RNA).</p>
<p data-step="4">Proteins do most of the work in a cell. They make reactions go fast, build structures and control other genes. So the DNA (the <b>genotype</b>) sets the possible traits (the <b>phenotype</b>). The environment also changes the phenotype.</p>`,
star:'Information flows from nucleic acid to protein, never back.',starStep:2,
scene(H){const s=document.getElementById('stage');const Y=150,xs=[110,320,530];
  const node=(x,t,col)=>{const G=grp(s,x,Y);H.E('rect',{x:-62,y:-26,width:124,height:52,rx:14,st:`fill:var(--card);stroke:${H.C(col)};stroke-width:3`},G);tx(G,0,8,t,'big',`font-size:22px;fill:${H.C(col)}`);hide(G);return G};
  const N=[node(xs[0],'DNA','ink'),node(xs[1],'RNA','rna'),node(xs[2],'protein','aa')];
  const rep=H.g(s);H.E('path',{d:`M${xs[0]-30},${Y-28} C${xs[0]-60},${Y-100} ${xs[0]+60},${Y-100} ${xs[0]+30},${Y-30}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:2.2'},rep);
  const rh=H.E('path',{d:`M${xs[0]+22},${Y-38} L${xs[0]+30},${Y-30} L${xs[0]+37},${Y-40}`,st:'fill:none;stroke:var(--ink);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round'},rep);H.O(rh,0,{d:0});
  const repL=tx(s,xs[0],Y-88,'replication','lb');H.O(repL,0,{d:0});
  const a1=mkA(s,xs[0]+66,Y,xs[1]-70,Y,{w:2.4,h:9}),a2=mkA(s,xs[1]+66,Y,xs[2]-70,Y,{w:2.4,h:9});
  const l1=tx(s,(xs[0]+xs[1])/2,Y-12,'transcription','lbs','font-weight:700;fill:var(--ink)'),l2=tx(s,(xs[1]+xs[2])/2,Y-12,'translation','lbs','font-weight:700;fill:var(--ink)');H.O([l1,l2],0,{d:0});
  const back=H.g(s);H.E('path',{d:`M${xs[2]},${Y+30} C${xs[2]-40},${Y+92} ${xs[1]+40},${Y+92} ${xs[1]+8},${Y+34}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--bad);stroke-width:2.2;stroke-dasharray:1'},back);
  const bx=xBadge(back,(xs[1]+xs[2])/2,Y+76,11);H.O(bx,0,{d:0});const bL=tx(back,(xs[1]+xs[2])/2,Y+106,'protein → RNA or DNA: never','lbs','font-weight:700;fill:var(--bad)');H.O(bL,0,{d:0});
  const rt=H.g(s);const rp=H.E('path',{d:`M${xs[1]-24},${Y+28} C${xs[1]-60},${Y+96} ${xs[0]+50},${Y+96} ${xs[0]+20},${Y+30}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--rna);stroke-width:2.2'},rt);
  const rtd=H.E('path',{d:`M${xs[1]-24},${Y+28} C${xs[1]-60},${Y+96} ${xs[0]+50},${Y+96} ${xs[0]+20},${Y+30}`,st:'fill:none;stroke:var(--card);stroke-width:3;stroke-dasharray:6 6'},rt);H.O(rtd,0,{d:0});
  const rth=H.E('path',{d:`M${xs[0]+12},${Y+40} L${xs[0]+20},${Y+30} L${xs[0]+30},${Y+38}`,st:'fill:none;stroke:var(--rna);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round'},rt);H.O(rth,0,{d:0});
  const rtL=H.g(s);tx(rtL,(xs[0]+xs[1])/2,Y+106,'reverse transcription','lbs','font-weight:700;fill:var(--rna)');tx(rtL,(xs[0]+xs[1])/2,Y+122,'some viruses, e.g. HIV','lbs');H.O(rtL,0,{d:0});
  // protein jobs -> phenotype
  const J=H.g(s);H.O(J,0,{d:0});const jx=[368,470,572];
  H.E('path',{d:`M${xs[2]+40},${Y+26} L${xs[2]+40},${Y+120} M${jx[0]},${Y+120} L${jx[2]},${Y+120} M${jx[0]},${Y+120} L${jx[0]},${Y+134} M${jx[1]},${Y+120} L${jx[1]},${Y+134} M${jx[2]},${Y+120} L${jx[2]},${Y+134}`,st:'fill:none;stroke:var(--aa);stroke-width:2'},J);
  [['make reactions','go fast'],['build','structures'],['control','other genes']].forEach(([a,b],i)=>{const G=grp(J,jx[i],Y+156);
    H.E('rect',{x:-48,y:-22,width:96,height:44,rx:10,st:'fill:var(--aa-tint);stroke:var(--aa);stroke-width:1.8'},G);tx(G,0,-3,a,'lbs','font-weight:700;fill:var(--ink)');tx(G,0,13,b,'lbs','font-weight:700;fill:var(--ink)')});
  const ph=H.g(s);H.O(ph,0,{d:0});H.E('rect',{x:320,y:368,width:300,height:38,rx:10,st:'fill:var(--card);stroke:var(--ink);stroke-width:2'},ph);
  tx(ph,470,393,'phenotype (traits)','lb');const envA=mkA(ph,236,387,312,387,{w:2,h:7});shown(envA);tx(ph,228,391,'environment','lbs','font-weight:700;fill:var(--ink)','end');
  [jx[0],jx[1],jx[2]].forEach(x=>{const a=mkA(ph,x,Y+180,x,364,{w:1.6,h:6});shown(a)});
  const gt=tx(s,70,Y+46,'genotype','lbs','font-weight:700;fill:var(--ink)');H.O(gt,0,{d:0});
  return [
    ()=>{N.forEach((n,i)=>pop(n,{at:i*250}))},
    ()=>{H.D(rep.firstChild,1,{d:800});H.O(rh,1,{at:700});H.O(repL,1,{at:400});drawA(a1,{at:700});H.O(l1,1,{at:900});drawA(a2,{at:1300});H.O(l2,1,{at:1500})},
    ()=>{H.D(back.firstChild,1,{d:900});pop(bx,{at:800});H.O(bL,1,{at:1000})},
    ()=>{H.D(rp,1,{d:900});H.O(rtd,1,{at:900});H.O(rth,1,{at:850});H.O(rtL,1,{at:900})},
    ()=>{H.O([back,bx,bL],.25);H.O(J,1,{d:700});H.O(ph,1,{d:600,at:600});H.O(gt,1,{at:300})},
  ];}},

/* 3 ─────────────────────────────── */
{sec:'7.1',title:'Transcription: DNA to RNA',caption:'white tiles = DNA · teal tiles = RNA · yellow ring = T in DNA, U in RNA',
text:`<p data-step="0">DNA has two strands. Each letter pairs with one partner letter in the other strand: G with C, and A with T. Each pair is a <b>base pair</b>.</p>
<p data-step="1">In transcription, an enzyme, <b>RNA polymerase</b>, opens the DNA at a gene. The enzyme reads one strand, the <b>template strand</b>.</p>
<p data-step="2">RNA polymerase builds an RNA strand one letter at a time. Each RNA letter pairs with the template letter. RNA uses the letter U (uracil) in place of T.</p>
<p data-step="3">So the mRNA copies the sequence of the other DNA strand, the <b>coding strand</b>, but every T becomes U. Behind the enzyme, the DNA closes again.</p>
<p data-step="4">Many genes of eukaryotes (organisms with a nucleus) contain <b>introns</b>: segments that the cell removes from the RNA. The kept segments are <b>exons</b>. The cut-and-join step is <b>splicing</b>.</p>`,
star:'Transcription copies a gene into mRNA: same message, U for T.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const cod='ATGGCTTTTGGTTAA',tem=[...cod].map(c=>({A:'T',T:'A',G:'C',C:'G'})[c]).join(''),rnaS=cod.replace(/T/g,'U');
  const X0=150,DX=26,yT=96,yB=126;
  const pol=grp(s,X0-40,(yT+yB)/2);H.E('ellipse',{rx:38,ry:56,st:'fill:var(--hi);stroke:var(--ink);stroke-width:2;opacity:.85'},pol);hide(pol);
  const polL=tx(s,0,0,'RNA polymerase','lbs','font-weight:700;fill:var(--ink)');H.T(polL,{x:X0-40,y:40},{d:0});H.O(polL,0,{d:0});
  const pairs=H.g(s);for(let i=0;i<15;i++)H.E('line',{x1:X0+i*DX,y1:yT+13,x2:X0+i*DX,y2:yB-13,st:'stroke:var(--muted);stroke-width:2'},pairs);
  const top=H.g(s),bot=H.g(s);const T=row(top,X0,yT,cod,'dna',{dx:DX}),Bt=row(bot,X0,yB,tem,'dna',{dx:DX});
  const lT=tx(s,X0-18,yT+5,'coding strand','lbs','font-weight:700;fill:var(--ink)','end'),lB=tx(s,X0-18,yB+5,'template strand','lbs','font-weight:700;fill:var(--ink)','end');
  H.O([lT,lB],0,{d:0});
  const bp=H.g(s);tx(bp,320,176,'base pairs: A–T and G–C','lb');H.O(bp,0,{d:0});
  const RYn=196;const R=row(s,X0,RYn,rnaS,'rna',{dx:DX});R.forEach(t=>{hide(t)});
  const rL=tx(s,X0-18,RYn+5,'mRNA','lb','fill:var(--rna)','end');H.O(rL,0,{d:0});
  const ringT=T.filter(t=>t.ch==='T').map(t=>t.r),ringU=R.filter(t=>t.ch==='U').map(t=>t.r);
  // splicing schematic
  const SP=H.g(s);H.O(SP,0,{d:0});const SY=330;
  tx(SP,30,SY-40,'SPLICING','cap','fill:var(--ink)','start');
  const e1=H.E('rect',{x:150,y:SY-11,width:120,height:22,rx:5,st:'fill:var(--rna);stroke:var(--ink);stroke-width:1.5'},SP);
  const inG=grp(SP,0,0);const intr=H.E('rect',{x:270,y:SY-7,width:110,height:14,rx:3,st:'fill:var(--faint);stroke:var(--ink);stroke-width:1.2'},inG);
  const e2=grp(SP,0,0);H.E('rect',{x:380,y:SY-11,width:120,height:22,rx:5,st:'fill:var(--rna);stroke:var(--ink);stroke-width:1.5'},e2);
  tx(SP,210,SY+4,'exon 1','lbs','font-weight:700;fill:var(--paper)');tx(e2,440,SY+4,'exon 2','lbs','font-weight:700;fill:var(--paper)');tx(inG,325,SY+30,'intron','lbs','font-weight:700;fill:var(--ink)');
  tx(SP,140,SY+5,'RNA copy','lbs','font-weight:700;fill:var(--ink)','end');
  const done=tx(SP,325,SY+62,'mRNA: exon 1 + exon 2','lb','fill:var(--rna)');H.O(done,0,{d:0});
  return [
    ()=>{H.O([lT,lB],1);H.O(bp,1,{at:400})},
    ()=>{H.O(bp,0);pop(pol);H.O(polL,1);H.O(pairs,0,{d:500});H.T(top,{y:-16},{d:900});H.T(bot,{y:10},{d:900});H.T(lT,{y:-16},{d:900});H.T(lB,{y:10},{d:900})},
    ()=>{H.O(rL,1);R.forEach((t,i)=>{H.T(t,{y:RYn-(RYn-(yB+10+30))},{d:0});H.after(i*170,()=>{pop(t,{d:300});H.T(t,{y:yB+42},{d:300})})});
      H.T(pol,{x:X0+15*DX+30},{d:15*170+300});H.T(polL,{x:X0+15*DX+30},{d:15*170+300})},
    ()=>{H.O([pol,polL],0,{d:500});H.T(top,{y:0},{d:900,at:300});H.T(bot,{y:0},{d:900,at:300});H.T(lT,{y:0},{d:900,at:300});H.T(lB,{y:0},{d:900,at:300});H.O(pairs,1,{at:900});
      R.forEach(t=>H.T(t,{y:RYn},{d:900,at:300}));
      H.after(1300,()=>{[...ringT,...ringU].forEach(r=>{r.style.stroke='var(--hi)';r.style.strokeWidth='3.5'})})},
    ()=>{H.O(SP,1,{d:600});H.T(inG,{y:-46},{d:900,at:800});H.O(inG,0,{d:500,at:1500});H.T(e2,{x:-110},{d:900,at:1700});H.O(done,1,{at:2400})},
  ];}},

/* 4 ─────────────────────────────── */
{sec:'7.1',title:'Translation: Reading Codons',caption:'teal tiles = mRNA · purple beads = amino acids · Met, Ala, Phe, Gly = methionine, alanine, phenylalanine, glycine',
text:`<p data-step="0">A <b>ribosome</b> reads the mRNA three letters at a time. Each group of three letters is a <b>codon</b>.</p>
<p data-step="1">The start codon, AUG, sets the <b>reading frame</b>: the way the letters group into codons. Each codon names one amino acid.</p>
<p data-step="2">A <b>transfer RNA (tRNA)</b> carries the amino acid for each codon. Its three-letter <b>anticodon</b> pairs with the codon, letter by letter: A with U, and G with C. The ribosome joins each new amino acid to the chain.</p>
<p data-step="3">A <b>stop codon</b> (UAA, UAG or UGA) names no amino acid. At a stop codon, the ribosome releases the polypeptide.</p>
<p data-step="4">The chain folds into a shape. The amino acid sequence sets the shape, and the shape sets the job of the protein.</p>`,
star:'Three letters, one amino acid. AUG starts, UAA, UAG and UGA stop.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const rnaS='AUGGCUUUUGGUUAA',X0=138,DX=26,Y=250;const cx=c=>X0+(3*c+1)*DX;
  const RB=grp(s,cx(0),Y);const big=H.E('ellipse',{cx:0,cy:-40,rx:52,ry:34,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2'},RB);
  H.E('ellipse',{cx:0,cy:20,rx:50,ry:16,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2'},RB);hide(RB);
  const ribL=tx(s,0,0,'ribosome','lbs','font-weight:700;fill:var(--ink)');H.T(ribL,{x:cx(0),y:Y+58},{d:0});H.O(ribL,0,{d:0});
  const R=row(s,X0,Y,rnaS,'rna',{dx:DX});tx(s,X0-20,Y+5,'mRNA','lb','fill:var(--rna)','end');
  const names=['Met','Ala','Phe','Gly','stop'],anti=['UAC','CGA','AAA','CCA'];
  const BR=names.map((n,c)=>{const G=H.g(s);H.E('path',{d:`M${cx(c)-36},${Y+18} L${cx(c)-36},${Y+24} L${cx(c)+36},${Y+24} L${cx(c)+36},${Y+18}`,st:`fill:none;stroke:${c===4?'var(--bad)':c===0?'var(--good)':'var(--ink)'};stroke-width:2`},G);
    tx(G,cx(c),Y+84,c===0?'start: Met':n,'lb',`font-size:13px;fill:${c===4?'var(--bad)':c===0?'var(--good)':'var(--ink)'}`);H.O(G,0,{d:0});return G});
  // tRNAs with amino acid beads
  const TR=anti.map((a,c)=>{const G=grp(s,cx(c),Y-150);H.E('path',{d:'M0,-6 L0,16 M-14,16 L14,16',st:'stroke:var(--rna);stroke-width:3;stroke-linecap:round'},G);
    tx(G,0,32,a,'lbs',MONO+'font-size:11px;fill:var(--rna)');G.b=bead(G,0,-20,names[c]);H.O(G,0,{d:0});return G});
  const chain=[];const done=n=>{for(let k=0;k<n;k++){}};
  const aaL=tx(s,40,40,'','lb','fill:var(--aa)','start');
  const fold=H.g(s);H.E('path',{d:'M300,40 C340,14 392,30 388,66 C384,98 340,104 318,90 C298,78 286,58 300,40 Z',st:'fill:var(--aa-tint);stroke:var(--aa);stroke-width:2.5'},fold);H.O(fold,0,{d:0});
  const fL=tx(s,450,64,'folded protein','lb','fill:var(--aa)','start');H.O(fL,0,{d:0});
  const relL=tx(s,cx(4),Y-92,'release','lb','fill:var(--bad)');H.O(relL,0,{d:0});
  // free chain beads (separate from tRNA beads so they can stay on the chain)
  const CB=names.slice(0,4).map((n,c)=>{const b=bead(s,cx(c),Y-170,n);H.O(b,0,{d:0});return b});
  const place=(c,o)=>{for(let k=0;k<=c;k++){const x=cx(c)-(c-k)*34-18,y=Y-104-(c-k)*14;H.T(CB[k],{x,y},o)}};
  return [
    ()=>{pop(RB);H.O(ribL,1)},
    ()=>{BR.forEach((G,i)=>H.O(G,1,{at:i*220}))},
    ()=>{for(let c=0;c<4;c++)H.after(c*1100,inst=>{const d=inst?0:1;H.T(RB,{x:cx(c)},{d:600*d});H.T(ribL,{x:cx(c)},{d:600*d});
        H.O(TR[c],1,{d:200*d,at:500*d});H.T(TR[c],{y:Y-86},{d:500*d,at:500*d});
        H.O(CB[c],1,{d:0,at:1000*d});H.after(inst?0:1000,()=>{H.O(TR[c],0,{d:300*d});H.T(TR[c],{y:Y-150},{d:0,at:300*d})});place(c,{d:500*d,at:1000*d})})},
    ()=>{H.T(RB,{x:cx(4)},{d:600});H.T(ribL,{x:cx(4)},{d:600});H.O(relL,1,{at:600});
      CB.forEach((b,k)=>H.T(b,{x:190+k*34,y:70},{d:1000,at:900}));H.O([RB,ribL],0,{d:600,at:1400})},
    ()=>{H.O(relL,0);const P=[[312,44],[346,36],[370,62],[336,78]];CB.forEach((b,k)=>H.T(b,{x:P[k][0],y:P[k][1]},{d:1100}));H.O(fold,1,{d:700,at:700});H.O(fL,1,{at:1000})},
  ];}},

/* 5 ─────────────────────────────── */
{sec:'7.1',title:'The Genetic Code',caption:'the standard genetic code, written in mRNA letters · green = start codon · red = stop codons',
text:`<p data-step="0">Four letters, read three at a time, make 4 × 4 × 4 = 64 different codons. In the table, the first letter picks the block of rows and the second letter picks the column. The third letter picks the row inside the block.</p>
<p data-step="1">61 codons name amino acids, and 3 codons mean stop. AUG names methionine and also marks the start.</p>
<p data-step="2">Cells use 20 kinds of amino acid, so most amino acids have more than one codon. Scientists call the code <b>degenerate</b>. Leucine has 6 codons, but methionine has only 1.</p>
<p data-step="3">Example: GCU, GCC, GCA and GCG all name alanine. In the DNA of the coding strand, these codons are GCT, GCC, GCA and GCG. A change in the third letter does not change the amino acid.</p>
<p data-step="4">Almost all living things use the same code. So a bacterium can read a human gene: bacteria with the human insulin gene make human insulin for medicine.</p>`,
star:'64 codons, 20 amino acids, 3 stops: most amino acids have spare codons.',starStep:3,
scene(H){const s=document.getElementById('stage');const X0=40,Y0=52,CW=64,RH=19.5,GAP=6;
  const pos=(i,j,k)=>[X0+j*CW,Y0+i*(4*RH+GAP)+k*RH];
  H.O(H.g(s),0,{d:0});
  const head=H.g(s);B.split('').forEach((b,j)=>tx(head,X0+j*CW+30,Y0-10,b,'lb','font-size:13px;fill:var(--muted)'));
  B.split('').forEach((b,i)=>tx(head,X0-14,pos(i,0,2)[1]+2,b,'lb','font-size:13px;fill:var(--muted)'));
  tx(head,X0+128,Y0-26,'2nd letter','lbs');tx(head,X0,Y0+4*(4*RH+GAP)+12,'3rd letter: the row inside each block (U, C, A, G)','lbs',null,'start');tx(head,14,Y0-10,'1st','lbs',null,'start');H.O(head,0,{d:0});
  const T={};const all=[];
  for(let i=0;i<4;i++)for(let j=0;j<4;j++)for(let k=0;k<4;k++){const cod=B[i]+B[j]+B[k];const aa=aaOf(cod);const [x,y]=pos(i,j,k);
    const G=grp(s,x,y);const st=aa==='Stop'?'fill:var(--bad-tint);stroke:var(--bad)':cod==='AUG'?'fill:var(--good-tint);stroke:var(--good)':'fill:var(--card);stroke:var(--faint)';
    G.r=H.E('rect',{x:1,y:1,width:CW-3,height:RH-2,rx:3,st:st+';stroke-width:1.2'},G);
    tx(G,4,RH-5.5,cod,'lbs',MONO+'font-size:10.5px;fill:var(--ink)','start');tx(G,CW-5,RH-5.5,aa==='Stop'?'stop':aa,'lbs','font-size:10.5px;font-weight:700;fill:var(--ink)','end');
    H.O(G,0,{d:0});T[cod]=G;all.push(G)}
  const R=H.g(s);const RX=470;
  const big=tx(R,RX,96,'','big','font-size:34px');const bigL=tx(R,RX,120,'','lbs','font-weight:700;fill:var(--ink)');
  const c2=tx(R,RX,178,'','big','font-size:28px');const c2L=tx(R,RX,200,'','lbs','font-weight:700;fill:var(--ink)');
  const ALA=['GCU','GCC','GCA','GCG'];const al=H.g(s);H.O(al,0,{d:0});
  const clones=ALA.map((c,k)=>{const G=grp(s,0,0);H.E('rect',{x:0,y:0,width:CW-3,height:RH-2,rx:3,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.4'},G);
    tx(G,4,RH-6.5,c.slice(0,2),'lbs',MONO+'font-size:10.5px;fill:#16181d','start');tx(G,4+2*6.4,RH-6.5,c[2],'lbs',MONO+'font-size:12px;fill:var(--bad)','start');
    const [x,y]=pos(2+1,1,k);H.T(G,{x:x+1,y:y+1},{d:0});H.O(G,0,{d:0});return G});
  const ala=bead(s,560,266,'Ala',{r:20,fs:12});hide(ala);const alaL=tx(s,560,306,'alanine','lbs','font-weight:700;fill:var(--ink)');H.O(alaL,0,{d:0});
  const links=ALA.map((c,k)=>{const l=H.E('path',{d:`M${396+62},${232+k*24} L536,266`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--muted);stroke-width:1.5'},s);return l});
  const bact=H.g(s);H.O(bact,0,{d:0});const BY=372;
  gbox(bact,368,BY,'human gene',{w:84,fill:'dad'});mkA(bact,414,BY,446,BY,{w:1.8,h:6});H.E('rect',{x:452,y:BY-18,width:86,height:36,rx:18,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},bact);
  tx(bact,495,BY+4,'bacterium','lbs','font-weight:700;fill:var(--ink)');mkA(bact,542,BY,572,BY,{w:1.8,h:6});[0,1,2].forEach(k=>H.E('circle',{cx:584+k*14,cy:BY,r:6,st:'fill:var(--aa);stroke:var(--ink);stroke-width:1'},bact));
  tx(bact,598,BY+30,'insulin','lbs','font-weight:700;fill:var(--aa)');[...bact.querySelectorAll('.draw')].forEach(e=>e.style.strokeDashoffset=0);[...bact.querySelectorAll('g')].forEach(g=>H.O(g.lastChild,1,{d:0}));
  return [
    ()=>{H.O(head,1);all.forEach((G,n)=>H.O(G,1,{d:200,at:n*18}));const p={set textContent(v){big.textContent=v}};H.count(p,0,64,{d:1200});bigL.textContent='codons'},
    ()=>{['UAA','UAG','UGA','AUG'].forEach(c=>{H.T(T[c],{s:1.06},{d:300});T[c].r.style.strokeWidth='2.5'});c2.textContent='61 + 3';c2L.textContent='amino-acid codons + stops'},
    ()=>{all.forEach(G=>H.O(G,.35,{d:400}));['CUU','CUC','CUA','CUG','UUA','UUG','AUG'].forEach(c=>{H.O(T[c],1,{d:400});T[c].r.style.fill='var(--aa-tint)'});
      big.textContent='20';bigL.textContent='kinds of amino acid';c2.textContent='6 vs 1';c2L.textContent='Leu codons vs Met codons'},
    ()=>{ALA.forEach(c=>{H.O(T[c],1,{d:400})});['CUU','CUC','CUA','CUG','UUA','UUG','AUG'].forEach(c=>{H.O(T[c],.35);T[c].r.style.fill='var(--card)'});
      clones.forEach((G,k)=>{H.O(G,1,{d:200,at:200});H.T(G,{x:396,y:222+k*24},{d:1000,at:300+k*120})});H.D(links,1,{d:600,at:1300});pop(ala,{at:1700});H.O(alaL,1,{at:1900});
      H.O([big,bigL,c2,c2L],0,{d:300})},
    ()=>{H.O(bact,1,{d:700})},
  ];}},

/* 6 ─────────────────────────────── */
{sec:'7.1',title:'Mutations Make New Traits',caption:'Sphynx cat: Tgianf75, CC BY-SA 3.0, Wikimedia Commons · blue = from the father · orange = from the mother · h = hairless allele',
text:`<p data-step="0">A mutation can have no effect, a harmful effect or a new effect. The result depends on the DNA change and on the gene. An individual with a changed trait is a <b>mutant</b>.</p>
<p data-step="0">Most mutations that change a trait are harmful. A few make a new trait. A <b>spontaneous</b> mutation happens naturally, with no <b>mutagen</b> (a chemical or a radiation that changes DNA).</p>
<p data-step="1">In 1966, a hairless kitten appeared in a litter in Toronto, Canada. Some cats in the area already carried a spontaneous hairless allele on one copy, unseen. The kitten got one hairless copy from each parent. Breeders started the Sphynx line from it.</p>
<p data-step="2">The hairless allele is <b>autosomal recessive</b>: the gene is on an autosome (a chromosome that is not X or Y). A cat with one copy is a <b>carrier</b>. It has normal hair, but it can pass the allele to its kittens. A cat needs two copies to be hairless.</p>
<p data-step="3">The gene, <i>KRT71</i>, makes a keratin, a structural protein of the hair. So the mutant shows the job of the normal gene: it builds normal hair.</p>`,
star:'A mutant shows what the normal gene does.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const ph=photo(s,'@@asset:c7-sphynx.jpg@@',14,14,236,392);tag(s,24,392,'Sphynx cat');
  const X=300;
  const pair=(p,x,col,al)=>{const G=H.g(p);al.forEach((ok,k)=>{const y=62+k*22;const g=grp(G,x,y);H.E('line',{x1:-34,y1:0,x2:34,y2:0,st:`stroke:var(--${col});stroke-width:8;stroke-linecap:round;opacity:.55`},g);
      const c=gbox(g,0,0,ok?'+':'h',{w:26,h:17,fill:ok?'good':'card',tc:ok?'var(--paper)':'var(--bad)'});if(!ok)c.r.style.stroke='var(--bad)';G['c'+k]=g});return G};
  const kid=H.g(s);H.O(kid,0,{d:0});tx(kid,X,34,'1966: TWO CARRIERS, ONE HAIRLESS KITTEN','cap','fill:var(--ink)','start');
  pair(kid,340,'dad',[1,0]);pair(kid,450,'mom',[1,0]);tx(kid,395,78,'×','lb');
  const fromD=pair(s,340,'dad',[0]),fromM=pair(s,450,'mom',[0]);H.T(fromD,{y:22},{d:0});H.T(fromM,{y:22},{d:0});H.O([fromD,fromM],0,{d:0});
  shown(mkA(kid,494,72,532,72,{w:1.6,h:6}));
  tx(kid,340,118,'carrier father','lbs','font-weight:700;fill:var(--ink)');tx(kid,450,118,'carrier mother','lbs','font-weight:700;fill:var(--ink)');
  const kL=tx(kid,580,118,'hairless kitten','lbs','font-weight:700;fill:var(--bad)');H.O(kL,0,{d:0});
  const G=H.g(s);H.O(G,0,{d:0});tx(G,X,156,'TWO COPIES OF KRT71','cap','fill:var(--ink)','start');
  const rows=[['two working copies',1,1,'normal hair'],['one copy: a carrier',1,0,'normal hair'],['two hairless copies',0,0,'hairless']];
  rows.forEach(([t,a,b,ph],i)=>{const y=184+i*58;
    [[a,'dad',0],[b,'mom',22]].forEach(([ok,col,dy])=>{H.E('line',{x1:X,y1:y+dy,x2:X+100,y2:y+dy,st:`stroke:var(--${col});stroke-width:8;stroke-linecap:round;opacity:.55`},G);
      const g=gbox(G,X+50,y+dy,ok?'+':'h',{w:30,h:18,fill:ok?'good':'card',tc:ok?'var(--paper)':'var(--bad)'});if(!ok)g.r.style.stroke='var(--bad)'});
    tx(G,X+118,y+6,t,'lbs','font-weight:700;fill:var(--ink)','start');
    const hairs=H.g(G);if(a||b)for(let k=0;k<7;k++)H.E('path',{d:`M${X+256+k*9},${y+24} q-4,-12 2,-24 q4,-8 0,-14`,st:'fill:none;stroke:var(--muted);stroke-width:2;stroke-linecap:round'},hairs);
    else H.E('path',{d:`M${X+252},${y+24} L${X+322},${y+24}`,st:'stroke:var(--muted);stroke-width:2;stroke-dasharray:3 3'},hairs);
    tx(G,X+118,y+24,ph,'lbs',null,'start')});
  const job=H.g(s);H.O(job,0,{d:0});H.E('rect',{x:X-6,y:364,width:336,height:40,rx:10,st:'fill:var(--good-tint);stroke:var(--good);stroke-width:1.8'},job);
  tx(job,X+162,389,'KRT71 → keratin → normal hair','lb','font-size:13px');
  return [
    ()=>{},
    ()=>{H.O(kid,1,{d:500});H.O([fromD,fromM],1,{d:200,at:600});H.T(fromD,{x:240,y:0},{d:1000,at:700});H.T(fromM,{x:130,y:22},{d:1000,at:900});H.O(kL,1,{at:1800})},
    ()=>{H.O(G,1,{d:700})},
    ()=>{H.O(job,1,{d:600})},
  ];}},

/* 7 ─────────────────────────────── */
{sec:'7.1',title:'Garrod and Black Urine',caption:'Archibald Garrod and the title page of his book: Wellcome Collection, CC BY 4.0, Wikimedia Commons',
text:`<p data-step="0">In 1908, the British doctor Archibald Garrod described <b>inborn errors of metabolism</b>. In such a disease, the body lacks one step of its chemistry from birth.</p>
<p data-step="1">A <b>metabolic pathway</b> is a chain of chemical reactions in a cell. An enzyme does each step. One pathway breaks the amino acid tyrosine from food into smaller compounds, step by step. The last compounds enter the pathways that make energy. One of its compounds is homogentisic acid, called alkapton.</p>
<p data-step="2">In <b>alkaptonuria</b> (black urine disease), the enzyme for the next step does not work. Alkapton collects in the body and leaves it in the urine. In air, alkapton turns the urine black.</p>
<p data-step="3">Garrod proposed that an inherited factor (a gene) controls the enzyme. Today we know the gene, <i>HGD</i>. People with alkaptonuria have two broken copies of <i>HGD</i>, so the disease is recessive.</p>`,
star:'One broken gene, one missing enzyme, one blocked step.',starStep:3,
scene(H){const s=document.getElementById('stage');
  photo(s,'@@asset:c7-garrod.jpg@@',14,14,232,174);photo(s,'@@asset:c7-garrod-book.jpg@@',40,200,186,200);
  tag(s,22,180,'Archibald Garrod');
  const X=330,ys=[44,134,234];
  const P=H.g(s);H.O(P,0,{d:0});
  const nd=(y,t1,t2,col)=>{const G=grp(P,X,y);H.E('circle',{r:13,st:`fill:${H.C(col||'card')};stroke:var(--ink);stroke-width:2`},G);tx(G,22,0,t1,'lb','font-size:13px','start');if(t2)tx(G,22,16,t2,'lbs',null,'start');return G};
  nd(ys[0],'tyrosine','an amino acid from food');const n1=nd(ys[1],'homogentisic acid','(alkapton)');nd(ys[2],'next compounds','');
  tx(P,X+22,ys[2]+40,'… → compounds that give energy','lbs',null,'start');
  const ar0=mkA(P,X,ys[0]+17,X,ys[1]-17,{w:2,h:7});shown(ar0);const ar1=mkA(P,X,ys[1]+17,X,ys[2]-17,{w:2,h:7});shown(ar1);
  const E1=pill(P,X+70,(ys[1]+ys[2])/2,'HGD enzyme',{w:96});
  const flow=[];for(let i=0;i<6;i++){const d=H.E('circle',{r:5,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1'},s);H.T(d,{x:X,y:ys[0]},{d:0});H.O(d,0,{d:0});flow.push(d)}
  const tube=grp(s,566,236);H.E('path',{d:'M-18,-70 L-18,40 A18,18 0 0 0 18,40 L18,-70',st:'fill:none;stroke:var(--ink);stroke-width:2.5'},tube);
  const liq=H.E('path',{d:'M-16,-20 L-16,40 A16,16 0 0 0 16,40 L16,-20 Z',st:'fill:#f3e3a0;stroke:var(--muted);stroke-width:1.5'},tube);tube.insertBefore(liq,tube.firstChild);
  const tL=tx(s,566,330,'urine','lb');const tL2=tx(s,566,348,'','lbs','font-weight:700;fill:var(--ink)');H.O([tube,tL],0,{d:0});
  const pileL=tx(s,X-40,ys[1]+36,'collects','lbs','font-weight:700;fill:var(--bad)');H.O(pileL,0,{d:0});
  const pipe=H.E('path',{d:`M${X+150},${ys[1]} C${X+200},${ys[1]} 566,${ys[1]+10} 566,160`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:1'},s);
  const G=H.g(s);H.O(G,0,{d:0});const GY=392;tx(G,X-60,GY+5,'HGD gene','lb','font-size:13px','start');
  [['dad',0],['mom',1]].forEach(([c,k])=>{const x=X+60+k*120;H.E('line',{x1:x-50,y1:GY,x2:x+50,y2:GY,st:`stroke:var(--${c});stroke-width:8;stroke-linecap:round;opacity:.55`},G);
    const g=gbox(G,x,GY,'broken',{w:56,h:18,fill:'card',tc:'var(--bad)'});g.r.style.stroke='var(--bad)'});
  return [
    ()=>{},
    ()=>{H.O(P,1,{d:600});flow.forEach((d,i)=>{H.O(d,1,{d:150,at:500+i*300});H.T(d,{y:ys[2]},{d:1400,at:500+i*300,ease:'linear'});H.O(d,0,{d:200,at:1800+i*300})})},
    ()=>{H.O(E1.X,1,{d:300});H.O([tube,tL],1,{d:500});flow.forEach((d,i)=>{H.T(d,{x:X,y:ys[0]},{d:0});H.O(d,1,{d:150,at:300+i*200});H.T(d,{x:X-24-(i%3)*12-(i>2?6:0),y:ys[1]+(i>2?8:-4)},{d:900,at:300+i*200})});
      H.O(pileL,1,{at:1400});H.D(pipe,1,{d:900,at:1500});
      H.after(2400,()=>{liq.style.transition='fill 2.4s';liq.style.fill='#1d1a14';tL2.textContent='turns black in air'})},
    ()=>{H.O(G,1,{d:700})},
  ];}},

/* 8 ─────────────────────────────── */
{sec:'7.2',title:'Beadle, Tatum and a Bread Mould',caption:'G. Beadle, 1962: Danny Lyon, public domain (published with no copyright notice) · E. Tatum, 1972: Willy Pragher, CC BY 4.0 · Neurospora on oncom, a food: Hariadhi, CC BY-SA 4.0 · all Wikimedia Commons',
text:`<p data-step="0">In 1941, George Beadle and Edward Tatum tested the link between genes and enzymes. They used the orange bread mould <i>Neurospora crassa</i>.</p>
<p data-step="1"><i>Neurospora</i> grows fast in a laboratory. Its threads are <b>haploid</b>: each nucleus has one copy of each gene. A <b>diploid</b> nucleus has two copies. In a haploid cell, a broken gene shows its effect at once, because no second copy can cover it.</p>
<p data-step="2">The <b>wild type</b> is the normal form found in nature. Wild-type <i>Neurospora</i> is a <b>prototroph</b>: it makes all its own amino acids and almost all its vitamins. The wild type grows on <b>minimal medium (MM)</b>: water with a few minerals, a simple sugar and one vitamin, biotin.</p>
<p data-step="3"><i>Neurospora</i> cannot make biotin. So even the wild type needs biotin in the medium.</p>
<p data-step="4">Beadle and Tatum shared the 1958 Nobel Prize in Physiology or Medicine for this work.</p>`,
star:'Haploid mould: one copy of each gene, so every broken gene shows.',starStep:1,
scene(H){const s=document.getElementById('stage');
  photo(s,'@@asset:c7-beadle.jpg@@',14,14,136,178);photo(s,'@@asset:c7-tatum.jpg@@',158,14,152,178);photo(s,'@@asset:c7-neurospora.jpg@@',318,14,124,178);
  tag(s,20,184,'George Beadle');tag(s,164,184,'Edward Tatum');tag(s,324,184,'Neurospora');
  const nob=H.g(s);H.O(nob,0,{d:0});H.E('rect',{x:452,y:60,width:174,height:86,rx:12,st:'fill:var(--hi);stroke:var(--ink);stroke-width:2'},nob);
  tx(nob,539,96,'Nobel Prize','lb','fill:#16181d');tx(nob,539,120,'1958','big','font-size:22px;fill:#16181d');
  // haploid vs diploid
  const HD=H.g(s);H.O(HD,0,{d:0});
  const nuc=(x,y,label,copies,res,ok)=>{const G=grp(HD,x,y);H.E('circle',{r:44,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2;stroke-dasharray:6 4'},G);
    copies.forEach((c,k)=>{const yy=copies.length===1?0:(k?13:-13);H.E('line',{x1:-32,y1:yy,x2:32,y2:yy,st:'stroke:var(--muted);stroke-width:7;stroke-linecap:round;opacity:.6'},G);
      const g=gbox(G,0,yy,c?'arg':'arg',{w:36,h:17,fill:c?'good':'card',tc:c?'var(--paper)':'var(--bad)'});if(!c)g.r.style.stroke='var(--bad)'});
    tx(G,0,62,label,'lb','font-size:13px');tx(G,0,80,res,'lbs',`font-weight:700;fill:var(--${ok?'good':'bad'})`);return G};
  nuc(82,258,'haploid nucleus',[0],'broken gene shows',false);nuc(232,258,'diploid nucleus',[1,0],'working copy covers it',true);
  // minimal medium flask
  const MM=H.g(s);H.O(MM,0,{d:0});const FX=400,FY=300;
  H.E('path',{d:`M${FX-14},${FY-78} L${FX-14},${FY-30} L${FX-52},${FY+40} A8,8 0 0 0 ${FX-45},${FY+52} L${FX+45},${FY+52} A8,8 0 0 0 ${FX+52},${FY+40} L${FX+14},${FY-30} L${FX+14},${FY-78}`,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2.5;stroke-linejoin:round'},MM);
  const gr=H.g(MM);[[-26,30,9],[-8,26,11],[12,30,9],[28,34,7],[-16,38,8],[4,40,9]].forEach(([dx,dy,r])=>H.E('circle',{cx:FX+dx,cy:FY+dy,r,st:'fill:var(--orn);stroke:var(--ink);stroke-width:1'},gr));H.O(gr,0,{d:0});
  tx(MM,FX,FY+76,'minimal medium','lb','font-size:13px');
  const chips=['minerals','sugar','biotin'].map((t,i)=>{const G=grp(MM,FX+128,FY-46+i*34);H.E('rect',{x:-44,y:-12,width:88,height:24,rx:12,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},G);tx(G,0,4.5,t,'lbs','font-weight:700;fill:var(--ink)');return G});
  const grL=tx(MM,FX+86,FY+52,'wild type grows','lbs','font-weight:700;fill:var(--good)','start');H.O(grL,0,{d:0});
  const bio=H.g(s);H.O(bio,0,{d:0});H.E('rect',{x:FX+82,y:FY+40,width:94,height:36,rx:8,st:'fill:var(--card);stroke:var(--bad);stroke-width:1.8'},bio);
  tx(bio,FX+129,FY+56,'cannot make','lbs','font-weight:700;fill:var(--bad)');tx(bio,FX+129,FY+70,'biotin','lbs','font-weight:700;fill:var(--bad)');
  return [
    ()=>{},
    ()=>{H.O(HD,1,{d:700})},
    ()=>{H.O(MM,1,{d:600});chips.forEach((c,i)=>{H.T(c,{x:FX+128,y:FY-46+i*34},{d:0})});H.O(gr,1,{d:800,at:900});H.O(grL,1,{at:1200})},
    ()=>{chips[2].firstChild.style.stroke='var(--bad)';chips[2].firstChild.style.strokeWidth='2.5';H.O(grL,0);H.O(bio,1,{d:500})},
    ()=>{H.O(nob,1,{d:600})},
  ];}},


/* 9 ─────────────────────────────── */
{sec:'7.2',title:'Searching for Auxotrophs',caption:'each circle = a plate (a dish of solid medium) · orange spots = mould growth · Ala, Leu, Arg, Trp, Val, Thr = alanine, leucine, arginine, tryptophan, valine, threonine',
text:`<p data-step="0">Beadle and Tatum exposed <i>Neurospora</i> <b>spores</b> to X-rays. A spore is a single cell that can grow into a new mould. X-rays damage DNA and cause mutations at random places.</p>
<p data-step="1">Each spore grew into a <b>colony</b>: a group of genetically identical cells from one spore.</p>
<p data-step="2">Most colonies still grew on minimal medium. Some colonies grew only on <b>complete medium (CM)</b>: minimal medium plus amino acids, vitamins and other nutrients. A mutant that needs an extra nutrient is an <b>auxotroph</b>.</p>
<p data-step="3">They then put each auxotroph on minimal medium plus one nutrient. One colony grew only on CM and on MM + <b>arginine</b>, an amino acid. So one of its genes for the arginine pathway did not work. Such a <b>strain</b> (a line of genetically identical individuals) is arg<sup>−</sup> (arginine-less).</p>
<p data-step="4">A search like this is a <b>genetic screen</b>, or <b>mutant screen</b>. Scientists expose many individuals to a mutagen and then find the mutants with a defect in one process.</p>`,
star:'Auxotroph: grows on CM only. Test one nutrient at a time to find the broken pathway.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const SP=H.g(s);tx(SP,30,30,'X-RAYS','cap','fill:var(--ink)','start');
  const spores=[];for(let i=0;i<9;i++){const c=H.E('circle',{cx:0,cy:0,r:4.5,st:'fill:var(--orn);stroke:var(--ink);stroke-width:1'},SP);H.T(c,{x:44+(i%3)*18,y:70+Math.floor(i/3)*16},{d:0});spores.push(c)}
  const bolts=[0,1,2].map(i=>H.E('path',{d:`M${100+i*14},${24+i*4} L${86+i*14},${46+i*4} L${96+i*14},${48+i*4} L${80+i*14},${70+i*4}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round'},s));
  tx(s,62,128,'spores','lbs');
  const a1=mkA(s,120,86,186,86,{w:1.8,h:7});const a1L=tx(s,153,74,'1 spore','lbs');H.O(a1L,0,{d:0});
  const col=plate(s,236,86,38,{col:'orn',n:16,seed:5});H.O(col,0,{d:0});const colL=tx(s,236,140,'one colony','lbs','font-weight:700;fill:var(--ink)');H.O(colL,0,{d:0});
  // CM vs MM
  const T1=H.g(s);H.O(T1,0,{d:0});const bus=H.E('path',{d:'M236,152 L236,172 M120,172 L340,172 M120,172 L120,184 M340,172 L340,184',st:'fill:none;stroke:var(--muted);stroke-width:1.5'},T1);
  const pCM=plate(T1,120,220,32,{col:'orn',seed:7}),pMM=plate(T1,340,220,32,{col:'orn',seed:9});
  tx(T1,120,270,'CM','lb');tx(T1,340,270,'MM','lb');const mC=mark(T1,164,220,true,1.3),mM=mark(T1,384,220,false,1.3);
  const aux=tx(s,230,288,'grows on CM only: an auxotroph','lb','fill:var(--bad);font-size:13px');H.O(aux,0,{d:0});
  // MM + one nutrient
  const T2=H.g(s);H.O(T2,0,{d:0});const nut=['Ala','Leu','Arg','Trp','Val','Thr'];
  const P2=nut.map((n,i)=>{const x=70+i*100;const p=plate(T2,x,350,28,{col:'orn',seed:11+i});tx(T2,x,396,'MM + '+n,'lbs','font-weight:700;fill:var(--ink)');p.m=mark(T2,x+34,330,n==='Arg',1);p.n=n;return p});
  const ring=H.E('rect',{x:270-42,y:312,width:84,height:96,rx:12,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--bad);stroke-width:2.5'},s);
  const argL=tx(s,316,312,'arg⁻','lb','fill:var(--bad)','start');H.O(argL,0,{d:0});
  // many screens
  const MS=H.g(s);H.O(MS,0,{d:0});tx(MS,520,30,'REPEAT WITH MANY SPORES','cap','fill:var(--ink)');
  for(let r=0;r<3;r++)for(let c=0;c<7;c++){const x=436+c*28,y=60+r*30;const hit=(r===1&&c===2)||(r===2&&c===5);
    H.E('circle',{cx:x,cy:y,r:11,st:`fill:${hit?'var(--bad-tint)':'var(--wash)'};stroke:${hit?'var(--bad)':'var(--ink)'};stroke-width:1.4`},MS)}
  tx(MS,520,162,'red = a new auxotroph','lbs','font-weight:700;fill:var(--bad)');
  return [
    ()=>{H.D(bolts,1,{d:700});spores.forEach((c,i)=>H.after(500+i*60,()=>H.K(c,{fill:'bad'},{d:300})))},
    ()=>{drawA(a1);H.O(a1L,1);H.O(col,1,{d:400,at:400});H.O(col.gr,1,{d:900,at:800});H.O(colL,1,{at:1200})},
    ()=>{H.O(T1,1,{d:500});H.O(pCM.gr,1,{d:800,at:700});H.O([mC,mM],1,{at:1300});H.O(aux,1,{at:1600})},
    ()=>{H.O(T2,1,{d:500});P2.forEach((p,i)=>{if(p.n==='Arg')H.O(p.gr,1,{d:800,at:700});H.O(p.m,1,{at:900+i*120})});H.D(ring,1,{d:800,at:1800});H.O(argL,1,{at:2100})},
    ()=>{H.O(MS,1,{d:700})},
  ];}},

/* 10 ─────────────────────────────── */
{sec:'7.3',title:'Ordering the Arginine Pathway',caption:'simplified pathway · red X = the broken step of each mutant · a green ring marks the compound added to the plate',
text:`<p data-step="0"><i>Neurospora</i> makes arginine in several steps. A different enzyme does each step. Two <b>intermediates</b> (compounds made on the way) are <b>ornithine</b> (Orn) and <b>citrulline</b> (Cit).</p>
<p data-step="1">In a simplified view, three genes make the three enzymes. Gene A acts at precursor → Orn, gene B at Orn → Cit and gene C at Cit → Arg. A <b>precursor</b> is a start compound. A broken copy of any of the three genes makes the mould arg<sup>−</sup>.</p>
<p data-step="2">In 1944, Adrian Srb and Norman Horowitz grew arg<sup>−</sup> mutants on MM plus Orn, Cit or Arg. A compound that restores growth <b>rescues</b> the mutant.</p>
<p data-step="3">Gene A mutants grow on all three. Gene B mutants grow on Cit or Arg. Gene C mutants grow only on Arg.</p>
<p data-step="4">An added compound rescues a mutant only if it comes after the block. So the earlier the block, the more compounds rescue the mutant. The growth table gives the order of the steps.</p>`,
star:'Feed a compound after the block, and the mutant grows.',starStep:4,
scene(H){const s=document.getElementById('stage');
  const X=[70,230,390,550],Y=58,names=['precursor','ornithine (Orn)','citrulline (Cit)','arginine (Arg)'];
  const P=H.g(s);H.O(P,0,{d:0});
  const N=X.map((x,i)=>{const G=grp(P,x,Y);H.E('circle',{r:13,st:`fill:${i===3?'var(--hi)':'var(--card)'};stroke:var(--ink);stroke-width:2`},G);tx(G,0,32,names[i],'lbs','font-weight:700;fill:var(--ink)');return G});
  const A=[0,1,2].map(i=>mkA(P,X[i]+18,Y,X[i+1]-20,Y,{w:2.2,h:8}));
  const E=['A','B','C'].map((k,i)=>pill(s,(X[i]+X[i+1])/2,Y-24,'enzyme '+k,{w:76}));H.O(E,0,{d:0});
  const flow=[];for(let i=0;i<4;i++){const d=H.E('circle',{r:5,st:'fill:var(--orn);stroke:var(--ink);stroke-width:1'},s);H.T(d,{x:X[0],y:Y},{d:0});H.O(d,0,{d:0});flow.push(d)}
  const GN=H.g(s);H.O(GN,0,{d:0});tx(GN,320,112,'gene A → enzyme A · gene B → enzyme B · gene C → enzyme C','lbs','font-weight:700;fill:var(--ink)');
  // growth table
  const cx=[330,440,550],ry=[196,276,356],res={A:[1,1,1],B:[0,1,1],C:[0,0,1]};
  const HD=H.g(s);H.O(HD,0,{d:0});['MM + Orn','MM + Cit','MM + Arg'].forEach((t,i)=>tx(HD,cx[i],150,t,'lb','font-size:13px'));
  const rows=['A','B','C'].map((k,r)=>{const G=H.g(s);H.O(G,0,{d:0});const y=ry[r];
    tx(G,16,y-14,'gene '+k+' mutant','lb','font-size:13px','start');
    const mx=[24,76,128,180];mx.forEach((x,i)=>{H.E('circle',{cx:x,cy:y+12,r:7,st:`fill:${i===3?'var(--hi)':'var(--card)'};stroke:var(--ink);stroke-width:1.5`},G);if(i<3)H.E('line',{x1:x+8,y1:y+12,x2:mx[i+1]-8,y2:y+12,st:'stroke:var(--ink);stroke-width:1.6'},G)});
    xBadge(G,(mx[r]+mx[r+1])/2,y+12,7);
    const pl=cx.map((x,i)=>{const p=plate(G,x,y,27,{col:'orn',seed:20+r*3+i,n:12});p.m=mark(G,x+36,y-18,!!res[k][i],1);
      p.ring=H.E('circle',{cx:mx[i+1],cy:y+12,r:11,st:'fill:none;stroke:var(--good);stroke-width:2.5'},G);H.O(p.ring,0,{d:0});return p});
    H.E('line',{x1:14,y1:y+40,x2:626,y2:y+40,st:'stroke:var(--faint);stroke-width:1'},G);
    return {G,pl,k}});
  const rule=H.g(s);H.O(rule,0,{d:0});H.E('rect',{x:220,y:398,width:400,height:20,rx:6,st:'fill:var(--good-tint)'},rule);
  tx(rule,420,412,'early block → many rescues · late block → few rescues','lbs','font-weight:700;fill:var(--ink)');
  const run=(R,at)=>{H.O(R.G,1,{d:400,at});R.pl.forEach((p,i)=>{H.O(p.ring,1,{d:300,at:at+400+i*350});if(res[R.k][i])H.O(p.gr,1,{d:600,at:at+600+i*350});H.O(p.m,1,{at:at+800+i*350});H.O(p.ring,0,{d:300,at:at+1100+i*350})})};
  return [
    ()=>{H.O(P,1,{d:600});A.forEach((a,i)=>drawA(a,{at:300+i*200}));flow.forEach((d,i)=>{H.O(d,1,{d:150,at:900+i*350});H.T(d,{x:X[3]},{d:1800,at:900+i*350,ease:'linear'});H.O(d,0,{d:150,at:2600+i*350})})},
    ()=>{E.forEach((e,i)=>H.O(e,1,{at:i*200}));H.O(GN,1,{at:600})},
    ()=>{H.O(HD,1,{d:600})},
    ()=>{rows.forEach((R,r)=>run(R,r*1300))},
    ()=>{H.O(rule,1,{d:600})},
  ];}},

/* 11 ─────────────────────────────── */
{sec:'7.3',title:'Colour Shows the Block',caption:'model pathway for the orange colour of Neurospora · W = white compound, Y = yellow compound, O = orange compound',
text:`<p data-step="0">In a model of the orange colour of <i>Neurospora</i>, enzyme 1 changes the white compound W into the yellow compound Y. Enzyme 2 changes Y into the orange compound O.</p>
<p data-step="1"><i>gene1</i><sup>+</sup> makes enzyme 1, and <i>gene2</i><sup>+</sup> makes enzyme 2. A minus sign marks a broken allele. None of the compounds is necessary for growth.</p>
<p data-step="2">Give each strain one compound. The cell changes it as far as its working enzymes go, so the colour shows the last compound that the cell can make.</p>
<p data-step="3">The wild type turns every compound orange. A <i>gene1</i><sup>−</sup> strain stays white on MM + W but turns orange on MM + Y, because enzyme 2 still works.</p>
<p data-step="4">A <i>gene2</i><sup>−</sup> strain turns W and Y yellow. The compound immediately before the block collects and shows its colour.</p>
<p data-step="5">A <i>gene1</i><sup>−</sup> <i>gene2</i><sup>−</sup> strain changes nothing. So each culture keeps the colour of its compound: white, yellow and orange.</p>`,
star:'The colour that collects is the compound immediately before the block.',starStep:4,
scene(H){const s=document.getElementById('stage');
  const X=[150,350,550],Y=70,COL=['card','ylw','orn'],NM=['W','Y','O'];
  const node=(x,k)=>{const G=grp(s,x,Y);H.E('circle',{r:22,st:`fill:var(--${COL[k]});stroke:var(--ink);stroke-width:2`},G);tx(G,0,7,NM[k],'big',`font-size:20px;fill:${k?'#16181d':'var(--ink)'}`);return G};
  const N=X.map((x,k)=>node(x,k));const A=[0,1].map(i=>mkA(s,X[i]+28,Y,X[i+1]-30,Y,{w:2.4,h:9}));
  const E=[0,1].map(i=>pill(s,(X[i]+X[i+1])/2,Y-26,'enzyme '+(i+1),{w:84}));
  const GN=[0,1].map(i=>{const G=H.g(s);tx(G,(X[i]+X[i+1])/2,Y+30,'made by gene'+(i+1)+'⁺','lbs','font-weight:700;fill:var(--ink)');H.O(G,0,{d:0});return G});
  const cx=[300,420,540],ry=[184,250,316,382];
  const HD=H.g(s);H.O(HD,0,{d:0});['MM + W','MM + Y','MM + O'].forEach((t,i)=>tx(HD,cx[i],144,t,'lb','font-size:13px'));tx(HD,20,144,'STRAIN','cap','fill:var(--ink)','start');
  const strains=[['gene1⁺ gene2⁺','wild type',['orn','orn','orn']],['gene1⁻ gene2⁺','',['card','orn','orn']],['gene1⁺ gene2⁻','',['ylw','ylw','orn']],['gene1⁻ gene2⁻','',['card','ylw','orn']]];
  const rows=strains.map(([g,sub,c],r)=>{const G=H.g(s);H.O(G,0,{d:0});const y=ry[r];tx(G,20,y+5,g,'lb','font-size:14px','start');if(sub)tx(G,20,y+22,sub,'lbs',null,'start');
    const cells=cx.map((x,i)=>{const t=grp(G,x,y);const body=H.E('rect',{x:-38,y:-20,width:76,height:40,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.6'},t);
      if(!c){tx(t,0,6,'?','lb','fill:var(--muted)')}t.body=body;return t});
    H.E('line',{x1:14,y1:y+32,x2:626,y2:y+32,st:'stroke:var(--faint);stroke-width:1'},G);return {G,cells,c}});
  const fill=(R,at)=>R.cells.forEach((t,i)=>{if(R.c)H.after(at+i*250,()=>H.K(t.body,{fill:R.c[i]},{d:600}))});
  return [
    ()=>{},
    ()=>{GN.forEach(g=>H.O(g,1))},
    ()=>{H.O(HD,1)},
    ()=>{H.O(rows[0].G,1);fill(rows[0],300);H.O(rows[1].G,1,{at:1200});fill(rows[1],1500)},
    ()=>{H.O(rows[2].G,1);fill(rows[2],300)},
    ()=>{H.O(rows[3].G,1);fill(rows[3],300)},
  ];}},

/* 12 ─────────────────────────────── */
{sec:'7.3',title:'One Gene, One Enzyme',caption:'blue chains = A chains (gene trpA) · purple chains = B chains (gene trpB) · Da = dalton, the unit of molecule mass',
text:`<p data-step="0">Beadle and Tatum linked many mutants to single steps in the pathways that make amino acids and vitamins. Each mutant lacked one enzyme.</p>
<p data-step="1">They proposed the <b>one gene–one enzyme</b> hypothesis: a different gene makes each enzyme of a pathway.</p>
<p data-step="2">Many enzymes contain more than one polypeptide chain. The enzyme tryptophan synthase of the bacterium <i>E. coli</i> has two A chains and two B chains. Gene <i>trpA</i> makes the A chain, and gene <i>trpB</i> makes the B chain.</p>
<p data-step="3">So the rule became <b>one gene–one polypeptide</b>. A protein-coding gene makes one chain, and several chains can join into one protein. Haemoglobin, which carries oxygen in blood, also has two chains of each of two kinds.</p>
<p data-step="4">The mass of a chain gives its length. One amino acid adds about 110 daltons (Da). So an A chain of about 29,500 Da has about 29,500 ÷ 110 ≈ 268 amino acids.</p>`,
star:'One gene makes one polypeptide. Several polypeptides can make one enzyme.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const P=H.g(s);tx(P,20,30,'A PATHWAY','cap','fill:var(--ink)','start');const X=[70,230,390,550],Y=86;
  X.forEach((x,i)=>H.E('circle',{cx:x,cy:Y,r:11,st:`fill:${i===3?'var(--hi)':'var(--card)'};stroke:var(--ink);stroke-width:2`},P));
  [0,1,2].forEach(i=>shown(mkA(P,X[i]+15,Y,X[i+1]-17,Y,{w:2,h:7})));
  const E=[0,1,2].map(i=>pill(P,(X[i]+X[i+1])/2,Y-22,'enzyme '+(i+1),{w:78}));
  const Gs=[0,1,2].map(i=>{const g=gbox(s,(X[i]+X[i+1])/2,Y+48,'gene '+(i+1),{w:70});H.O(g,0,{d:0});return g});
  const ln=[0,1,2].map(i=>mkA(s,(X[i]+X[i+1])/2,Y+36,(X[i]+X[i+1])/2,Y+14,{w:1.6,h:6}));
  const hyp=tx(s,320,172,'one gene – one enzyme','lb','font-size:16px');H.O(hyp,0,{d:0});
  // tryptophan synthase assembly
  const TS=H.g(s);H.O(TS,0,{d:0});const TY=260;
  tx(TS,20,206,'TRYPTOPHAN SYNTHASE OF E. COLI','cap','fill:var(--ink)','start');
  H.E('line',{x1:30,y1:TY,x2:250,y2:TY,st:'stroke:var(--muted);stroke-width:7;stroke-linecap:round;opacity:.6'},TS);
  gbox(TS,100,TY,'trpA',{w:60,fill:'dad'});gbox(TS,180,TY,'trpB',{w:60,fill:'aa'});
  const chA=[0,1].map(k=>{const c=H.E('ellipse',{rx:22,ry:16,st:'fill:var(--dad);stroke:var(--ink);stroke-width:1.5'},s);H.T(c,{x:100,y:TY,s:.001},{d:0});H.O(c,0,{d:0});return c});
  const chB=[0,1].map(k=>{const c=H.E('ellipse',{rx:30,ry:20,st:'fill:var(--aa);stroke:var(--ink);stroke-width:1.5'},s);H.T(c,{x:180,y:TY,s:.001},{d:0});H.O(c,0,{d:0});return c});
  const cxT=470,cyT=280;const slot={A:[[cxT-26,cyT-17],[cxT+28,cyT+19]],B:[[cxT-32,cyT+19],[cxT+30,cyT-17]]};
  const enzL=tx(s,cxT,cyT+76,'one enzyme = 2 A chains + 2 B chains','lb','font-size:13px');H.O(enzL,0,{d:0});
  const mass=H.g(s);H.O(mass,0,{d:0});H.E('rect',{x:18,y:332,width:262,height:78,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},mass);
  tx(mass,30,356,'A chain ≈ 29,500 Da','lb','font-size:13px','start');tx(mass,30,378,'29,500 ÷ 110 ≈ 268 amino acids','lbs','font-weight:700;fill:var(--ink)','start');
  tx(mass,30,398,'1 amino acid ≈ 110 Da','lbs',null,'start');
  return [
    ()=>{E.forEach((e,i)=>H.T(e,{s:1},{d:0}))},
    ()=>{Gs.forEach((g,i)=>H.O(g,1,{at:i*200}));ln.forEach((a,i)=>drawA(a,{at:300+i*200}));H.O(hyp,1,{at:1000})},
    ()=>{H.O(hyp,.3);H.O(TS,1,{d:500});chA.forEach((c,k)=>{H.O(c,1,{d:200,at:500+k*300});H.T(c,{s:1,x:300,y:TY-30+k*60},{d:700,at:500+k*300})});
      chB.forEach((c,k)=>{H.O(c,1,{d:200,at:1100+k*300});H.T(c,{s:1,x:360,y:TY-30+k*60},{d:700,at:1100+k*300})})},
    ()=>{chA.forEach((c,k)=>H.T(c,{x:slot.A[k][0],y:slot.A[k][1]},{d:900}));chB.forEach((c,k)=>H.T(c,{x:slot.B[k][0],y:slot.B[k][1]},{d:900}));H.O(enzL,1,{at:900})},
    ()=>{H.O(mass,1,{d:600})},
  ];}},

/* 13 ─────────────────────────────── */
{sec:'7.3',title:'Genes Beyond One Polypeptide',caption:'teal = RNA · purple = protein · exons 1 to 4 of one gene',
text:`<p data-step="0">Not every gene makes a protein. Some genes make RNA that the cell uses directly and never translates.</p>
<p data-step="1"><b>Ribosomal RNA (rRNA)</b> forms the core of the ribosome. <b>Transfer RNA (tRNA)</b> carries amino acids to the ribosome. Other RNAs control genes.</p>
<p data-step="2">One gene can make several proteins. In <b>alternative splicing</b>, the cell joins different sets of exons from one RNA. Each set gives a different polypeptide.</p>
<p data-step="3">Humans have about 20,000 protein-coding genes. They also have thousands of genes for RNAs that are never translated.</p>
<p data-step="4">Many proteins are not enzymes. Keratin builds hair, haemoglobin carries oxygen, and the CFTR protein is a channel for chloride <b>ions</b> (atoms with an electric charge).</p>`,
star:'Most genes make proteins, but some genes make only RNA.',starStep:1,
scene(H){const s=document.getElementById('stage');
  const R1=H.g(s);H.O(R1,0,{d:0});tx(R1,20,30,'GENES THAT MAKE ONLY RNA','cap','fill:var(--ink)','start');
  const g1=gbox(R1,90,66,'rRNA gene',{w:96}),g2=gbox(R1,90,140,'tRNA gene',{w:96});
  const a1=mkA(R1,142,66,190,66,{w:1.8,h:7}),a2=mkA(R1,142,140,190,140,{w:1.8,h:7});
  // ribosome made of rRNA
  const rib=grp(R1,250,66);H.E('ellipse',{cx:0,cy:-6,rx:34,ry:18,st:'fill:var(--rna-tint);stroke:var(--rna);stroke-width:2'},rib);H.E('ellipse',{cx:0,cy:14,rx:40,ry:12,st:'fill:var(--rna-tint);stroke:var(--rna);stroke-width:2'},rib);
  tx(R1,300,70,'ribosome core','lbs','font-weight:700;fill:var(--rna)','start');
  const trn=grp(R1,250,140);H.E('path',{d:'M0,-16 L0,10 M-12,10 L12,10',st:'stroke:var(--rna);stroke-width:3;stroke-linecap:round'},trn);bead(trn,0,-26,'aa',{r:10,fs:9});
  tx(R1,300,144,'carries amino acids','lbs','font-weight:700;fill:var(--rna)','start');
  const noP=tx(R1,320,178,'no protein made','lb','fill:var(--bad);font-size:13px','start');
  const R2=H.g(s);H.O(R2,0,{d:0});tx(R2,20,216,'ALTERNATIVE SPLICING: ONE GENE, TWO PROTEINS','cap','fill:var(--ink)','start');
  const EX=[[40,'1'],[112,'2'],[184,'3'],[256,'4']];
  H.E('line',{x1:30,y1:250,x2:320,y2:250,st:'stroke:var(--faint);stroke-width:5'},R2);
  const ex=EX.map(([x,t])=>{const G=grp(R2,x,250);H.E('rect',{x:0,y:-12,width:52,height:24,rx:5,st:'fill:var(--rna);stroke:var(--ink);stroke-width:1.4'},G);tx(G,26,5,'exon '+t,'lbs','font-weight:700;fill:var(--paper)');return G});
  const mk=(y,keep,col)=>{const G=H.g(R2);let x=92;keep.forEach(k=>{const r=grp(G,x,y);H.E('rect',{x:0,y:-11,width:52,height:22,rx:5,st:'fill:var(--rna);stroke:var(--ink);stroke-width:1.3'},r);tx(r,26,4,'exon '+EX[k][1],'lbs','font-weight:700;fill:var(--paper)');x+=54});
    const a=mkA(G,x+10,y,x+40,y,{w:1.6,h:6});shown(a);const c=[];for(let i=0;i<keep.length+1;i++)H.E('circle',{cx:x+56+i*15,cy:y,r:6.5,st:`fill:var(--${col});stroke:var(--ink);stroke-width:1`},G);H.O(G,0,{d:0});return G};
  const v1=mk(306,[0,1,3],'aa'),v2=mk(352,[0,2,3],'dad');
  const vL=[tx(R2,84,310,'mRNA 1','lbs','font-weight:700;fill:var(--ink)','end'),tx(R2,84,356,'mRNA 2','lbs','font-weight:700;fill:var(--ink)','end')];
  const C=H.g(s);H.O(C,0,{d:0});H.E('rect',{x:430,y:212,width:196,height:150,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},C);
  tx(C,528,238,'HUMAN GENOME','cap','fill:var(--ink)');const n1=tx(C,528,282,'≈ 20,000','big','font-size:28px');tx(C,528,302,'protein-coding genes','lbs','font-weight:700;fill:var(--ink)');
  tx(C,528,334,'+ thousands of genes','lbs','font-weight:700;fill:var(--rna)');tx(C,528,350,'that make only RNA','lbs','font-weight:700;fill:var(--rna)');
  const NP=H.g(s);H.O(NP,0,{d:0});tx(NP,20,394,'Proteins that are not enzymes:','lbs','font-weight:700;fill:var(--ink)','start');
  [['keratin',278],['haemoglobin',386],['CFTR channel',500]].forEach(([t,x])=>{const G=grp(NP,x,390);H.E('rect',{x:-46,y:-13,width:92,height:26,rx:13,st:'fill:var(--aa-tint);stroke:var(--aa);stroke-width:1.5'},G);tx(G,0,4.5,t,'lbs','font-weight:700;fill:var(--ink)')});
  return [
    ()=>{H.O(R1,1,{d:400});[rib,trn,noP].forEach(e=>H.O(e,0,{d:0}));[...R1.querySelectorAll('text')].slice(-3).forEach(t=>{});drawA(a1,{at:300});drawA(a2,{at:300})},
    ()=>{pop(rib);pop(trn,{at:300});H.O(noP,1,{at:800})},
    ()=>{H.O(R2,1,{d:500});H.O(v1,1,{d:500,at:600});H.O(v2,1,{d:500,at:1200})},
    ()=>{H.O(C,1,{d:600})},
    ()=>{H.O(NP,1,{d:600})},
  ];}},

/* 14 ─────────────────────────────── */
{sec:'7.5',title:'One-Letter Changes',caption:'coding-strand DNA codons · the red letter is the change · Met, Ala, Glu, Trp, Lys, Val = methionine, alanine, glutamate, tryptophan, lysine, valine',
text:`<p data-step="0">A <b>point mutation</b> changes one letter or a few letters. The most common type is a <b>substitution</b>: one letter replaces another.</p>
<p data-step="1"><b>Silent mutation</b> (also called synonymous): the new codon names the same amino acid. GCT → GCC still gives alanine, so the protein does not change.</p>
<p data-step="2"><b>Missense mutation</b>: the new codon names a different amino acid. In sickle cell disease, GAG → GTG in the <i>HBB</i> gene changes glutamate to valine in haemoglobin.</p>
<p data-step="3"><b>Nonsense mutation</b>: the new codon is a stop codon. The ribosome stops early, so the polypeptide is short and usually has no function.</p>`,
star:'Silent: same amino acid. Missense: new amino acid. Nonsense: early stop.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const cods=['ATG','GCT','GAG','TGG','AAG','TAA'];const X0=62,W=86;
  const rowY=[62,154,246,338];const labs=['normal gene','silent','missense','nonsense'];
  const changes=[null,[1,2,'C'],[2,1,'T'],[3,2,'A']];
  const R=rowY.map((y,r)=>{const G=H.g(s);if(r)H.O(G,0,{d:0});tx(G,14,y-24,labs[r].toUpperCase(),'cap',r===0?'fill:var(--ink)':'fill:var(--'+['ink','good','mom','bad'][r]+')','start');
    const cs=cods.slice();let ch=changes[r];if(ch){const c=cs[ch[0]].split('');c[ch[1]]=ch[2];cs[ch[0]]=c.join('')}
    const T=cs.map((c,i)=>{const t=grp(G,X0+i*W,y);[0,1,2].forEach(k=>{const isCh=ch&&ch[0]===i&&ch[1]===k;
      const tt=tile(t,(k-1)*22,0,c[k],'dna',{w:21,h:24,fs:14});if(isCh){tt.t.style.fill='var(--bad)';tt.r.style.stroke='var(--bad)';tt.r.style.strokeWidth='2.5';t.chg=tt}});return t});
    let stop=false;const aas=cs.map((c,i)=>{const a=aaOf(c);if(stop)return null;if(a==='Stop'){stop=true;const g=grp(G,X0+i*W,y+40);H.E('rect',{x:-24,y:-11,width:48,height:22,rx:5,st:'fill:var(--bad-tint);stroke:var(--bad);stroke-width:1.5'},g);tx(g,0,4.5,'stop','lbs','font-weight:700;fill:var(--bad)');return g}
      const same=r===0||!(ch&&ch[0]===i);return bead(G,X0+i*W,y+40,a,{r:14,fill:(r===2&&i===2)?'var(--hi)':'var(--aa)',tc:(r===2&&i===2)?'#16181d':null})});
    aas.forEach(a=>{if(a)H.O(a,r?0:1,{d:0})});return {G,T,aas,ch}});
  const notes=[null,tx(s,520,rowY[1]-24,'same protein','lbs','font-weight:700;fill:var(--good)','end'),tx(s,520,rowY[2]-24,'one amino acid changed','lbs','font-weight:700;fill:var(--mom)','end'),tx(s,520,rowY[3]-24,'short protein','lbs','font-weight:700;fill:var(--bad)','end')];
  notes.forEach(n=>{if(n)H.O(n,0,{d:0})});
  const show=(r)=>{const o=R[r];H.O(o.G,1,{d:400});o.aas.forEach((a,i)=>{if(a)H.O(a,1,{d:300,at:600+i*150})});H.O(notes[r],1,{at:1600});
    if(o.ch){const t=o.T[o.ch[0]];H.T(t,{s:1.12},{d:300,at:300});H.T(t,{s:1},{d:300,at:700})}};
  return [()=>{},()=>show(1),()=>show(2),()=>show(3)];}},

/* 15 ─────────────────────────────── */
{sec:'7.5',title:'Insertions, Deletions and Frameshifts',caption:'word analogy: each three-letter word stands for one codon · red = the changed letters',
text:`<p data-step="0">An <b>insertion</b> adds letters to the DNA. A <b>deletion</b> removes letters.</p>
<p data-step="1">The ribosome reads codons in a fixed frame of three letters. An insertion or deletion of one letter shifts every later codon. The result is a <b>frameshift</b>.</p>
<p data-step="2">After a frameshift, every later amino acid is wrong, and a stop codon usually appears soon. The protein has no function.</p>
<p data-step="3">A deletion of exactly three letters removes one codon. The frame stays correct, and the protein lacks one amino acid only. The most common cystic fibrosis allele is this type of deletion.</p>`,
star:'THE FAT CAT ATE THE RAT. Lose one letter, and every word after it is nonsense.',starStep:2,
scene(H){const s=document.getElementById('stage');
  const W=['THE','FAT','CAT','ATE','THE','RAT'];const X0=40,CW=21;
  const line=(p,y,str,o)=>{o=o||{};const ts=[];[...str].forEach((c,i)=>{const t=tile(p,X0+i*CW+Math.floor(i/3)*10,y,c,'dna',{w:19,h:24,fs:13});if(o.red&&o.red.includes(i)){t.t.style.fill='var(--bad)';t.r.style.stroke='var(--bad)'}ts.push(t)});return ts};
  const words=(p,y,str,bad)=>{for(let i=0;i<str.length/3;i++){const w=str.slice(3*i,3*i+3);const ok=W.includes(w);tx(p,X0+i*(3*CW+10)+CW,y,w,'lb',`font-size:12px;fill:var(--${(bad&&i>=bad)?'bad':'good'})`)}};
  const R0=H.g(s);tx(R0,20,40,'NORMAL','cap','fill:var(--ink)','start');line(R0,66,W.join(''));
  const brk=H.g(R0);for(let i=0;i<6;i++)H.E('path',{d:`M${X0+i*(3*CW+10)-8},84 L${X0+i*(3*CW+10)-8},90 L${X0+i*(3*CW+10)+3*CW-12},90 L${X0+i*(3*CW+10)+3*CW-12},84`,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},brk);H.O(brk,0,{d:0});
  const w0=H.g(s);words(w0,108,W.join(''));H.O(w0,0,{d:0});
  const R1=H.g(s);H.O(R1,0,{d:0});tx(R1,20,150,'DELETE ONE LETTER (THE F)','cap','fill:var(--bad)','start');
  const d1='THEATCATETHERAT';line(R1,176,d1);const w1=H.g(R1);words(w1,206,d1,1);
  const R2=H.g(s);H.O(R2,0,{d:0});tx(R2,20,248,'INSERT ONE LETTER (AN X)','cap','fill:var(--bad)','start');
  const i1='THEFXATCATATETHERAT';line(R2,274,i1.slice(0,18),{red:[4]});const w2=H.g(R2);words(w2,304,i1.slice(0,18),1);
  const R3=H.g(s);H.O(R3,0,{d:0});tx(R3,20,346,'DELETE THREE LETTERS (CAT)','cap','fill:var(--good)','start');
  const d3='THEFATATETHERAT';line(R3,372,d3);const w3=H.g(R3);words(w3,402,d3);
  const sh=tx(s,470,206,'frame shifted: nonsense','lb','fill:var(--bad);font-size:13px','start');const sh2=tx(s,470,304,'frame shifted: nonsense','lb','fill:var(--bad);font-size:13px','start');
  const ok3=tx(s,400,402,'frame kept: one word lost','lb','fill:var(--good);font-size:13px','start');H.O([sh,sh2,ok3],0,{d:0});
  return [
    ()=>{},
    ()=>{H.O(brk,1);H.O(w0,1,{at:300});H.O(R1,1,{d:500,at:700});H.O(R2,1,{d:500,at:1300})},
    ()=>{H.O([sh,sh2],1)},
    ()=>{H.O(R3,1,{d:500});H.O(ok3,1,{at:600})},
  ];}},


/* 16 ─────────────────────────────── */
{sec:'7.5',title:'How Much Function Is Lost?',caption:'one enzyme, three possible missense changes · bars = enzyme activity compared with the wild type',
text:`<p data-step="0">A protein folds into a shape. In an enzyme, a few amino acids form the <b>active site</b>: the pocket where the reaction happens.</p>
<p data-step="1">Many amino acids sit on the surface, far from the active site. A change there often has no effect, and the enzyme still works normally.</p>
<p data-step="2">Some changes alter the shape a little. The enzyme still works, but more slowly. The result is a <b>partial loss-of-function</b>.</p>
<p data-step="3">A change in the active site can stop all activity. A mutation that removes all function of a gene is a <b>null</b> mutation (a complete <b>loss-of-function</b>).</p>
<p data-step="4">Many different changes give the same null result. Examples are a changed active site, a core that cannot fold, an early stop codon and a frameshift. A null mutant often still makes the protein, but the protein does not work.</p>`,
star:'Surface: no effect. Shape: slower. Active site: null.',starStep:3,
scene(H){const s=document.getElementById('stage');const CX=160,CY=176,R=96,a=24*Math.PI/180;
  const body=H.E('path',{d:`M${CX+R*Math.cos(a)},${CY-R*Math.sin(a)} A${R},${R} 0 1 0 ${CX+R*Math.cos(a)},${CY+R*Math.sin(a)} L${CX+40},${CY+18} Q${CX+28},${CY} ${CX+40},${CY-18} Z`,st:'fill:var(--aa-tint);stroke:var(--aa);stroke-width:3;stroke-linejoin:round'},s);
  const site=H.E('path',{d:`M${CX+40},${CY-18} Q${CX+28},${CY} ${CX+40},${CY+18}`,st:'fill:none;stroke:var(--bad);stroke-width:5;stroke-linecap:round;opacity:0'},s);
  const siteL=tx(s,CX+96,CY-92,'active site','lb','fill:var(--ink);font-size:13px','start');const siteA=shown(mkA(s,CX+104,CY-84,CX+46,CY-12,{w:1.5,h:6}));
  const sub=H.E('circle',{r:13,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},s);H.T(sub,{x:CX+156,y:CY},{d:0});
  const subL=tx(s,CX+156,CY+34,'compound','lbs');
  const muts=[[CX-70,CY-62,'good','surface'],[CX-30,CY+40,'mom','shape'],[CX+36,CY,'bad','active site']].map(([x,y,c,t])=>{const G=grp(s,x,y);
    H.E('circle',{r:11,st:`fill:var(--${c});stroke:var(--ink);stroke-width:1.5`},G);tx(G,0,4.5,'✱','lbs','fill:var(--paper);font-weight:700');hide(G);return G});
  const bars=[['surface change','no effect','good',1],['shape change','partial loss-of-function','mom',.4],['active-site change','null: no activity','bad',0]].map(([t,r,c,v],i)=>{
    const G=H.g(s);const y=74+i*74;tx(G,380,y,t,'lb','font-size:13px','start');
    H.E('rect',{x:380,y:y+10,width:230,height:18,rx:4,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},G);
    const b=H.E('rect',{x:0,y:0,width:1,height:15,cls:'nss',st:`fill:var(--${c})`},G);H.T(b,{x:381.5,y:y+11.5,sx:.001},{d:0});
    tx(G,380,y+46,r+' · '+Math.round(v*100)+'%','lbs',`font-weight:700;fill:var(--${c})`,'start');H.O(G,0,{d:0});G.b=b;G.v=v;return G});
  const NL=H.g(s);H.O(NL,0,{d:0});const NY=330;
  const ch=['active-site change','core cannot fold','early stop codon','frameshift'];
  ch.forEach((t,i)=>{const x=86+i*156;const G=grp(NL,x,NY);H.E('rect',{x:-72,y:-14,width:144,height:28,rx:14,st:'fill:var(--bad-tint);stroke:var(--bad);stroke-width:1.5'},G);tx(G,0,4.5,t,'lbs','font-weight:700;fill:var(--ink)');
    shown(mkA(NL,x,NY+16,320+(x-320)*.25,NY+44,{w:1.5,h:6}))});
  const nb=grp(NL,320,NY+64);H.E('rect',{x:-130,y:-16,width:260,height:32,rx:10,st:'fill:var(--card);stroke:var(--bad);stroke-width:2.5'},nb);tx(nb,0,5,'null: 0% activity','lb','fill:var(--bad)');
  const go=(i,at)=>{H.O(bars[i],1,{at});H.T(bars[i].b,{sx:Math.max(.001,227*bars[i].v)},{d:900,at:at+200})};
  let react=null;
  return [
    ()=>{H.T(sub,{x:CX+48},{d:900,at:300});H.O(site,1,{d:400,at:900})},
    ()=>{H.T(sub,{x:CX+156},{d:0});pop(muts[0]);go(0,400)},
    ()=>{pop(muts[1]);go(1,400);H.T(body,{sx:1.04,sy:.95},{d:900})},
    ()=>{pop(muts[2]);go(2,400);H.O(sub,.4,{at:400})},
    ()=>{H.O(NL,1,{d:700})},
  ];}},

/* 17 ─────────────────────────────── */
{sec:'7.5',title:'Loss of Function and Gain of Function',caption:'+ = working allele · m = loss-of-function allele · G = gain-of-function allele · dashed line = the amount of protein the cell needs',
text:`<p data-step="0">Most mutations are <b>loss-of-function</b> mutations: they break a gene. A diploid cell has two copies of each gene.</p>
<p data-step="1">In most cases, one working copy makes enough protein. So a +/m <b>heterozygote</b> (an individual with two different alleles) has the wild-type phenotype, and the loss-of-function allele is recessive.</p>
<p data-step="2">A <b>gain-of-function</b> mutation gives a gene a new or extra activity. The extra activity works whether a normal copy is present or not. So gain-of-function alleles are usually <b>dominant</b>: one copy is enough to show the trait.</p>
<p data-step="3">Example: in achondroplasia, a common form of short stature, a change in the <i>FGFR3</i> gene makes its protein too active. One mutant copy is enough to cause the trait.</p>`,
star:'Broken copy: usually recessive. Overactive copy: usually dominant.',starStep:2,
scene(H){const s=document.getElementById('stage');
  const L=H.g(s);tx(L,20,30,'LOSS-OF-FUNCTION','cap','fill:var(--ink)','start');
  const G3=[['+/+',[1,1],1],['+/m',[1,0],.5],['m/m',[0,0],0]];const BX=150,BW=150,need=.35;
  const rows=G3.map(([g,al,v],i)=>{const G=H.g(L);const y=78+i*66;tx(G,20,y+6,g,'mt','font-size:20px','start');
    al.forEach((ok,k)=>{const c=gbox(G,86+k*34,y,ok?'+':'m',{w:28,h:22,fill:ok?'good':'card',tc:ok?'var(--paper)':'var(--bad)'});if(!ok)c.r.style.stroke='var(--bad)'});
    H.E('rect',{x:BX,y:y-10,width:BW,height:20,rx:4,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},G);
    const b=H.E('rect',{x:0,y:0,width:1,height:17,cls:'nss',st:'fill:var(--good)'},G);H.T(b,{x:BX+1.5,y:y-8.5,sx:.001},{d:0});
    const r=tx(G,BX+BW+10,y+5,'','lb','font-size:13px','start');if(i)H.O(G,0,{d:0});return {G,b,v,r,y}});
  const nl=H.E('line',{x1:BX+BW*need,y1:62,x2:BX+BW*need,y2:226,st:'stroke:var(--ink);stroke-width:1.5;stroke-dasharray:4 3'},L);tx(L,BX+BW*need,56,'needed','lbs','font-weight:700;fill:var(--ink)');
  const R=H.g(s);H.O(R,0,{d:0});H.E('line',{x1:20,y1:262,x2:620,y2:262,st:'stroke:var(--faint);stroke-width:1.5'},R);tx(R,20,288,'GAIN-OF-FUNCTION','cap','fill:var(--ink)','start');
  tx(R,20,336,'+/G','mt','font-size:20px','start');gbox(R,86,330,'+',{w:28,h:22,fill:'good'});const gg=gbox(R,120,330,'G',{w:28,h:22,fill:'hi',tc:'#16181d'});
  const np=grp(R,230,330);H.E('circle',{r:16,st:'fill:var(--aa-tint);stroke:var(--aa);stroke-width:2'},np);tx(np,0,36,'normal protein','lbs');
  const op=grp(R,350,330);const glow=H.E('circle',{r:26,st:'fill:var(--hi);opacity:.35'},op);H.E('circle',{r:16,st:'fill:var(--hi);stroke:var(--ink);stroke-width:2'},op);tx(op,0,36,'overactive protein','lbs','font-weight:700;fill:var(--ink)');
  const res=tx(R,470,326,'new trait shows','lb','fill:var(--bad);font-size:13px','start');tx(R,470,344,'with one copy: dominant','lbs','font-weight:700;fill:var(--bad)','start');
  const ex=H.g(s);H.O(ex,0,{d:0});H.E('rect',{x:20,y:378,width:600,height:30,rx:8,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.2'},ex);
  tx(ex,320,398,'achondroplasia: one overactive FGFR3 copy → short stature','lbs','font-weight:700;fill:var(--ink)');
  const fillRow=(o,at)=>{H.O(o.G,1,{at});H.T(o.b,{sx:Math.max(.001,(BW-3)*o.v)},{d:900,at:at+200});H.after(at+1100,()=>{o.r.textContent=o.v>=need?(o.v===1?'wild type':'looks wild type'):'mutant';o.r.style.fill=o.v>=need?'var(--good)':'var(--bad)'})};
  return [
    ()=>{fillRow(rows[0],0)},
    ()=>{fillRow(rows[1],0);fillRow(rows[2],900)},
    ()=>{H.O(R,1,{d:600});H.T(glow,{s:1.25},{d:700,at:600})},
    ()=>{H.O(ex,1,{d:600})},
  ];}},

/* 18 ─────────────────────────────── */
{sec:'7.5',title:'Dominant Negative Mutations',caption:'green = normal chain · red = faulty chain · each square of four = one protein group · all 16 equally likely combinations',
text:`<p data-step="0">Some proteins work as groups of several identical chains. A <b>dominant negative</b> mutation makes a faulty chain that still joins the group. The faulty chain stops the whole group, normal chains included.</p>
<p data-step="1">Example: a protein built of 4 chains, in a heterozygous cell. Each copy of the gene makes half the chains, so each chain is faulty with probability ½.</p>
<p data-step="2">A group works only if all 4 chains are normal. The probability is ½ × ½ × ½ × ½ = 1/16. Half of the chains are normal, but only about 6% of the groups work, not 50%.</p>
<p data-step="3">So one faulty copy causes the trait: the allele is dominant. The protein p53 protects cells against cancer and works as a group of four chains. Some p53 mutations act as dominant negatives.</p>
<p data-step="4">Gain-of-function and dominant negative mutations are rare. There are many ways to break a protein, but few ways to give it a new or harmful activity.</p>`,
star:'One faulty chain in four spoils the group: (½)⁴ = 1/16 groups work.',starStep:2,
scene(H){const s=document.getElementById('stage');
  const pool=H.g(s);tx(pool,24,30,'CHAINS MADE IN A +/m CELL','cap','fill:var(--ink)','start');
  for(let i=0;i<16;i++){const ok=i%2===0;H.E('rect',{x:30+(i%8)*30,y:46+Math.floor(i/8)*30,width:22,height:22,rx:5,st:`fill:var(--${ok?'good':'bad'});stroke:var(--ink);stroke-width:1.2`},pool)}
  tx(pool,148,124,'half normal, half faulty','lbs','font-weight:700;fill:var(--ink)');
  const GR=[];const X0=330,Y0=40,C=72;
  for(let n=0;n<16;n++){const G=grp(s,X0+(n%4)*C+30,Y0+Math.floor(n/4)*C+30);
    const bits=[3,2,1,0].map(b=>(n>>b)&1);const all=bits.every(b=>!b);
    G.fr=H.E('rect',{x:-30,y:-30,width:60,height:60,rx:10,st:`fill:${all?'var(--good-tint)':'var(--card)'};stroke:${all?'var(--good)':'var(--faint)'};stroke-width:${all?3:1.2}`},G);
    bits.forEach((b,k)=>H.E('rect',{x:-24+(k%2)*25,y:-24+Math.floor(k/2)*25,width:22,height:22,rx:5,st:`fill:var(--${b?'bad':'good'});stroke:var(--ink);stroke-width:1.2`},G));
    G.all=all;H.O(G,0,{d:0});GR.push(G)}
  const cnt=tx(s,170,206,'','big','font-size:44px');const cntL=tx(s,170,232,'','lbs','font-weight:700;fill:var(--ink)');
  const pr=H.g(s);H.O(pr,0,{d:0});tx(pr,170,280,'½ × ½ × ½ × ½ = 1/16','lb','font-size:17px');tx(pr,170,304,'≈ 6% of groups work','lb','fill:var(--good)');
  const dom=H.g(s);H.O(dom,0,{d:0});H.E('rect',{x:30,y:336,width:280,height:56,rx:10,st:'fill:var(--bad-tint);stroke:var(--bad);stroke-width:1.8'},dom);
  tx(dom,170,360,'one faulty copy → trait shows','lb','fill:var(--bad);font-size:13px');tx(dom,170,380,'dominant negative','lbs','font-weight:700;fill:var(--ink)');
  return [
    ()=>{},
    ()=>{GR.forEach((G,i)=>H.O(G,1,{d:250,at:i*70}))},
    ()=>{GR.forEach(G=>{if(!G.all)H.O(G,.35,{d:500})});const p={set textContent(v){cnt.textContent=v}};p.textContent='1 of 16';cntL.textContent='groups with 4 normal chains';H.O(pr,1,{at:400})},
    ()=>{H.O(dom,1,{d:600})},
    ()=>{},
  ];}},

/* 19 ─────────────────────────────── */
{sec:'7.4',title:'How Mutagens Change DNA',caption:'two DNA strands shown as two lines · yellow = repair enzymes · NHEJ = non-homologous end joining',
text:`<p data-step="0">A <b>mutagen</b> is a chemical or a radiation that changes DNA. The chemical EMS (ethyl methanesulfonate) changes single letters. Most EMS mutations change a G–C base pair into an A–T pair.</p>
<p data-step="1">X-rays can cut both strands of the DNA at one place. The result is a <b>double-strand break</b>.</p>
<p data-step="2">Every cell has a <b>DNA repair system</b>: enzymes that find damaged DNA and fix it. The system repairs most damage correctly.</p>
<p data-step="3">One repair method, <b>non-homologous end joining (NHEJ)</b>, joins two broken ends directly. NHEJ uses no template, so it often loses or adds a few letters at the join.</p>
<p data-step="4">With two breaks at once, NHEJ can join the wrong ends. The result is a <b>chromosome rearrangement</b>. Examples are a large deletion, an <b>inversion</b> (a segment turned around) and a <b>translocation</b> (a segment moved to another chromosome).</p>`,
star:'EMS changes letters. X-rays break DNA, and a wrong join rearranges chromosomes.',starStep:4,
scene(H){const s=document.getElementById('stage');
  // EMS
  const E=H.g(s);tx(E,20,30,'EMS: A LETTER CHANGE','cap','fill:var(--ink)','start');
  const pair=(x,a,b,col)=>{const G=grp(E,x,72);tile(G,0,-15,a,'dna',{w:22,h:24});tile(G,0,15,b,'dna',{w:22,h:24});if(col)[...G.querySelectorAll('rect')].forEach(r=>r.style.stroke=H.C(col));return G};
  const p1=pair(60,'G','C');const p2=pair(180,'G*','T','mom');const p3=pair(300,'A','T','bad');[p2,p3].forEach(p=>H.O(p,0,{d:0}));
  [p2.querySelector('text')].forEach(t=>t.style.fontSize='12px');
  const ea=[mkA(E,80,72,156,72,{w:1.6,h:6}),mkA(E,200,72,276,72,{w:1.6,h:6})];
  tx(E,118,62,'EMS','lbs','font-weight:700;fill:var(--ink)');tx(E,238,62,'copying','lbs','font-weight:700;fill:var(--ink)');
  // double-strand break
  const D=H.g(s);H.O(D,0,{d:0});const DY=178;tx(D,20,136,'X-RAYS: A DOUBLE-STRAND BREAK','cap','fill:var(--ink)','start');
  const L=grp(D,0,0),Rr=grp(D,0,0);
  [DY-6,DY+6].forEach(y=>{H.E('line',{x1:40,y1:y,x2:320,y2:y,st:'stroke:var(--ink);stroke-width:4;stroke-linecap:round'},L);H.E('line',{x1:320,y1:y,x2:600,y2:y,st:'stroke:var(--ink);stroke-width:4;stroke-linecap:round'},Rr)});
  const lost=H.E('rect',{x:310,y:DY-10,width:20,height:20,rx:3,st:'fill:var(--bad);opacity:0'},D);
  const bolt=H.E('path',{d:`M340,${DY-52} L322,${DY-24} L334,${DY-22} L316,${DY-2}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:4;stroke-linecap:round;stroke-linejoin:round'},D);
  const enz=[0,1].map(k=>{const G=grp(D,k?400:240,DY+40);H.E('path',{d:'M0,0 L12,-7 A14,14 0 1 0 12,7 Z',transform:k?'scale(-1,1)':'',st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},G);hide(G);return G});
  const rL=tx(D,320,DY+44,'repair enzymes','lbs','font-weight:700;fill:var(--ink)');H.O(rL,0,{d:0});
  const jL=tx(D,320,DY+44,'NHEJ joins the ends: a few letters lost','lbs','font-weight:700;fill:var(--bad)');H.O(jL,0,{d:0});
  // rearrangement
  const RG=H.g(s);H.O(RG,0,{d:0});tx(RG,20,262,'TWO BREAKS, WRONG JOIN: A TRANSLOCATION','cap','fill:var(--ink)','start');
  const c1a=H.E('line',{x1:50,y1:300,x2:300,y2:300,st:'stroke:var(--ink);stroke-width:11;stroke-linecap:round'},RG),c1b=H.E('line',{x1:300,y1:300,x2:430,y2:300,st:'stroke:var(--ink);stroke-width:11;stroke-linecap:round'},RG);
  const c2a=H.E('line',{x1:50,y1:350,x2:220,y2:350,st:'stroke:var(--rna);stroke-width:11;stroke-linecap:round'},RG),c2b=H.E('line',{x1:220,y1:350,x2:340,y2:350,st:'stroke:var(--rna);stroke-width:11;stroke-linecap:round'},RG);
  tx(RG,460,304,'chromosome 1','lbs','font-weight:700;fill:var(--ink)','start');tx(RG,460,354,'chromosome 2','lbs','font-weight:700;fill:var(--rna)','start');
  const cuts=[[300,300],[220,350]].map(([x,y])=>H.E('path',{d:`M${x+8},${y-20} L${x-4},${y-6} L${x+4},${y-4} L${x-8},${y+10}`,st:'fill:none;stroke:var(--hi);stroke-width:3;stroke-linecap:round'},RG));
  const res=tx(RG,320,398,'the end segments swap places','lb','fill:var(--bad);font-size:13px');H.O(res,0,{d:0});
  return [
    ()=>{drawA(ea[0]);H.O(p2,1,{at:500});drawA(ea[1],{at:900});H.O(p3,1,{at:1400})},
    ()=>{H.O(D,1,{d:500});H.D(bolt,1,{d:400,at:500});H.T(L,{x:-14},{d:600,at:900});H.T(Rr,{x:14},{d:600,at:900})},
    ()=>{H.O(bolt,0);enz.forEach((G,k)=>{pop(G,{at:k*200});H.T(G,{x:k?340:300},{d:900,at:300})});H.O(rL,1,{at:600})},
    ()=>{H.O(rL,0);H.T(L,{x:-4},{d:900});H.T(Rr,{x:4},{d:900});H.O(lost,1,{d:300,at:300});H.T(lost,{y:-26},{d:700,at:600});H.O(lost,0,{d:400,at:1200});H.O(enz,0,{d:400,at:900});H.O(jL,1,{at:1100})},
    ()=>{H.O(RG,1,{d:500});H.after(900,()=>{H.O(cuts,0,{d:300});const d=1100;
      c1b.style.transition=`all ${d}ms`;c2b.style.transition=`all ${d}ms`;H.T(c1b,{x:-80,y:50},{d});H.T(c2b,{x:80,y:-50},{d});
      H.after(d+100,()=>{H.K(c1b,{stroke:'ink'});H.K(c2b,{stroke:'rna'})})});H.O(res,1,{at:2200})},
  ];}},

/* 20 ─────────────────────────────── */
{sec:'7.4',title:'Somatic Cells and Germline Cells',caption:'small circles = cells · yellow = germline cells · red dot = a cell with the mutation · m = mutant allele, + = normal allele',
text:`<p data-step="0"><b>Somatic cells</b> are the body cells that do not make gametes. A mutation in a somatic cell passes only to the daughter cells of that cell. The offspring do not inherit it.</p>
<p data-step="1"><b>Germline cells</b> are the <b>gametes</b> (egg cells, sperm cells and pollen cells) and the cells that make them. A mutation in a germline cell can pass to a child. Then every cell of the child carries it.</p>
<p data-step="2">A mutagen hits each cell independently. So an exposed individual usually shows no new trait. Each mutation is in a few cells only, and on one copy of the gene (heterozygous).</p>
<p data-step="3">Most new mutations are recessive. A child that inherits one copy (+/m) looks normal. The trait shows only in a later generation, when an individual inherits two copies (m/m).</p>
<p data-step="3" class="note">For a gene on the X chromosome, one copy is enough in a male, because he has one X. He is <b>hemizygous</b> for the X genes.</p>`,
star:'Somatic: stays in the body. Germline: goes to the children.',starStep:1,
scene(H){const s=document.getElementById('stage');
  const body=(x0,y0,cols,rows,lab)=>{const G=H.g(s);H.E('rect',{x:x0-16,y:y0-16,width:cols*22+12,height:rows*22+12,rx:22,st:'fill:var(--card);stroke:var(--ink);stroke-width:2.5'},G);
    const C=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const germ=r>=rows-2&&c>=cols-3;const e=H.E('circle',{cx:x0+c*22,cy:y0+r*22,r:8,st:`fill:${germ?'var(--hi)':'var(--cellfill)'};stroke:var(--muted);stroke-width:1.2`},G);e.germ=germ;C.push(e)}
    tx(G,x0+cols*11-14,y0-26,lab,'lb','font-size:13px');G.C=C;return G};
  const P=body(40,62,11,9,'parent');
  const dot=(e,o)=>{const d=H.E('circle',{cx:e.getAttribute('cx'),cy:e.getAttribute('cy'),r:4,st:'fill:var(--bad)'},s);H.O(d,0,{d:0});return d};
  const som=[16,17,27,28,38,39].map(i=>dot(P.C[i]));const somL=tx(s,40,300,'somatic mutation: a patch of cells','lbs','font-weight:700;fill:var(--bad)','start');H.O(somL,0,{d:0});
  const gi=P.C.findIndex(e=>e.germ)+1;const gd=dot(P.C[gi]);
  const K=body(400,62,9,9,'child');H.O(K,0,{d:0});const kd=K.C.map(e=>dot(e));
  const arr=mkA(s,300,170,382,170,{w:2,h:8});const aL=tx(s,341,160,'gamete','lbs','font-weight:700;fill:var(--ink)');H.O(aL,0,{d:0});
  const noP=tx(s,341,196,'patch not passed on','lbs','font-weight:700;fill:var(--muted)');H.O(noP,0,{d:0});
  const kL=tx(s,500,300,'every cell carries it','lbs','font-weight:700;fill:var(--bad)');H.O(kL,0,{d:0});
  const scatter=[3,22,45,61,70,84].map(i=>{const d=dot(P.C[i]);d.style.fill='var(--mom)';return d});
  const sL=tx(s,40,318,'mutagen: scattered single cells, one copy each','lbs','font-weight:700;fill:var(--mom)','start');H.O(sL,0,{d:0});
  const GN=H.g(s);H.O(GN,0,{d:0});const GY=372;
  [['+/m','looks normal','good'],['m/m','shows the trait','bad'],['male m (one X)','shows the trait','bad']].forEach(([g,t,c],i)=>{const x=40+i*200;
    tx(GN,x,GY,g,'mt','font-size:18px','start');tx(GN,x,GY+20,t,'lbs',`font-weight:700;fill:var(--${c})`,'start')});
  return [
    ()=>{som.forEach((d,i)=>H.O(d,1,{d:300,at:i*200}));H.O(somL,1,{at:1200});H.O(noP,1,{at:1400})},
    ()=>{H.O(noP,0);H.O(gd,1,{d:300});drawA(arr,{at:500});H.O(aL,1,{at:500});H.O(K,1,{d:600,at:900});kd.forEach((d,i)=>H.O(d,1,{d:200,at:1300+i*8}));H.O(kL,1,{at:2000})},
    ()=>{H.O(som,.15);H.O(somL,0);scatter.forEach((d,i)=>H.O(d,1,{d:300,at:i*150}));H.O(sL,1,{at:900})},
    ()=>{H.O(GN,1,{d:600})},
  ];}},

/* 21 ─────────────────────────────── */
{sec:'7.4',title:'Designing a Mutant Screen',caption:'M1 = plants from the treated seeds · M2 = their offspring · white flower = a recessive mutant trait',
text:`<p data-step="0">A <b>genetic screen for mutations</b> has two parts. First, treat a large population with a mutagen. Then search the offspring for individuals with a defect in the process of interest.</p>
<p data-step="1">Example: a diploid plant that pollinates itself. Soak many seeds in EMS. Each seed grows into an <b>M1</b> plant. A new mutation is on one copy only, so the M1 plant is +/m and looks normal.</p>
<p data-step="2">Each M1 plant pollinates itself. Its gametes are ½ + and ½ m, so ¼ of its offspring are m/m.</p>
<p data-step="3">Grow the offspring, the <b>M2</b> plants, and search them for the trait. The m/m plants show the recessive trait.</p>
<p data-step="4">A dominant mutation shows already in the M1 plants. So a screen for dominant mutations can search the M1 generation.</p>`,
star:'Treat with a mutagen, self-pollinate, then search the M2 plants.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const dish=H.g(s);H.E('ellipse',{cx:80,cy:92,rx:62,ry:24,st:'fill:var(--rna-tint);stroke:var(--ink);stroke-width:2'},dish);tx(dish,80,134,'seeds in EMS','lbs','font-weight:700;fill:var(--ink)');
  const seeds=[];for(let i=0;i<7;i++){const e=H.E('ellipse',{cx:46+i*11,cy:88+(i%2)*8,rx:6,ry:4,st:'fill:#c9a46a;stroke:var(--ink);stroke-width:1'},dish);seeds.push(e)}
  const star=xBadge(s,90,96,7);hide(star);
  const a1=mkA(s,150,92,206,92,{w:1.8,h:7});
  const m1=flower(s,250,80,.62,'aa');hide(m1);const m1L=tx(s,250,140,'M1 plant: +/m','lb','font-size:13px');const m1L2=tx(s,250,156,'looks normal','lbs');H.O([m1L,m1L2],0,{d:0});
  // Punnett square for selfing
  const PS=H.g(s);H.O(PS,0,{d:0});const PX=420,PY=60,C=46;tx(PS,PX+C,PY-14,'self-pollination','lbs','font-weight:700;fill:var(--ink)');
  ['+','m'].forEach((g,i)=>{tx(PS,PX+C/2+i*C,PY+4,g,'mt','font-size:17px;fill:var(--dad)');tx(PS,PX-12,PY+C/2+22+i*C,g,'mt','font-size:17px;fill:var(--mom)')});
  const cells=[['+/+',0],['+/m',0],['+/m',0],['m/m',1]];
  const PC=cells.map(([t,b],k)=>{const x=PX+(k%2)*C,y=PY+14+Math.floor(k/2)*C;const G=H.g(PS);H.E('rect',{x,y,width:C,height:C,st:`fill:${b?'var(--bad-tint)':'var(--card)'};stroke:var(--ink);stroke-width:1.5`},G);tx(G,x+C/2,y+C/2+6,t,'mt','font-size:15px');return G});
  const q=tx(PS,PX+C,PY+14+2*C+22,'¼ are m/m','lb','fill:var(--bad);font-size:13px');
  const sa=mkA(s,300,90,396,90,{w:1.8,h:7});
  // M2 row
  const M2=H.g(s);H.O(M2,0,{d:0});tx(M2,20,214,'M2 PLANTS','cap','fill:var(--ink)','start');
  const gm=['+/+','+/m','+/m','m/m','+/m','+/+','m/m','+/m'];
  const F=gm.map((g,i)=>{const x=60+i*74;const f=flower(M2,x,262,.55,'aa');tx(M2,x,318,g,'mt','font-size:14px');f.g=g;return f});
  const ring=F.filter(f=>f.g==='m/m').map(f=>{const r=H.E('rect',{x:f._t.x-30,y:226,width:60,height:104,rx:10,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--bad);stroke-width:2.5'},s);return r});
  const fL=tx(s,320,350,'search: the m/m plants show the trait','lb','fill:var(--bad);font-size:13px');H.O(fL,0,{d:0});
  const dom=H.g(s);H.O(dom,0,{d:0});H.E('rect',{x:20,y:368,width:600,height:40,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},dom);
  tx(dom,320,393,'dominant mutation: the M1 plant already shows the trait','lb','font-size:13px');
  return [
    ()=>{},
    ()=>{pop(star);drawA(a1,{at:400});pop(m1,{at:900});H.O([m1L,m1L2],1,{at:1200})},
    ()=>{drawA(sa);H.O(PS,1,{d:600,at:300})},
    ()=>{H.O(M2,1,{d:600});F.forEach((f,i)=>{if(f.g==='m/m')paint(f,'petal',{d:600,at:900})});H.D(ring,1,{d:700,at:1500});H.O(fL,1,{at:1800})},
    ()=>{H.O(dom,1,{d:600})},
  ];}},


/* 22 ─────────────────────────────── */
{sec:'7.4',title:'Forward and Reverse Genetics',caption:'learning test: a fly learns to avoid the odour that came with an electric shock · CRISPR = a tool that cuts DNA at a chosen sequence',
text:`<p data-step="0"><b>Genetic analysis</b> is the study of a biological process through its mutants. <b>Forward genetics</b> starts with a trait and searches for the genes behind it. A random mutant screen is forward genetics.</p>
<p data-step="1">Example: a normal fruit fly learns to avoid an odour that came with an electric shock. Scientists screened mutant flies for this learning. Mutants such as <i>dunce</i> do not learn the link.</p>
<p data-step="2">All animals share common ancestors, so many fly genes have human relatives. So some fly learning genes can point to human genes for memory.</p>
<p data-step="3"><b>Reverse genetics</b> starts with a known gene. Scientists break the gene on purpose and look for the change in the phenotype.</p>
<p data-step="4">Genome sequencing gives the sequence of every gene, but not the job of each gene. Tools such as CRISPR can break one chosen gene, so reverse genetics is now common.</p>`,
star:'Forward: trait → gene. Reverse: gene → trait.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const fly=(p,x,y,sc,col)=>{const G=grp(p,x,y,sc);H.E('ellipse',{cx:-8,cy:-9,rx:12,ry:6,transform:'rotate(-20 -8 -9)',st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.2;opacity:.9'},G);
    H.E('ellipse',{cx:8,cy:-9,rx:12,ry:6,transform:'rotate(20 8 -9)',st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.2;opacity:.9'},G);
    H.E('ellipse',{cx:0,cy:4,rx:6,ry:11,st:`fill:${H.C(col||'brn')};stroke:var(--ink);stroke-width:1.2`},G);H.E('circle',{cx:0,cy:-9,r:5,st:'fill:var(--ink)'},G);
    H.E('circle',{cx:-3,cy:-10,r:2,st:'fill:var(--bad)'},G);H.E('circle',{cx:3,cy:-10,r:2,st:'fill:var(--bad)'},G);return G};
  const F=H.g(s);tx(F,20,28,'FORWARD GENETICS: TRAIT → GENE','cap','fill:var(--ink)','start');
  // T-maze-like choice: odour A (with shock) left, odour B right
  const arena=(x,lab)=>{const G=grp(F,x,0);H.E('path',{d:'M-70,64 L70,64 M0,64 L0,130',st:'fill:none;stroke:var(--faint);stroke-width:18;stroke-linecap:round'},G);
    H.E('circle',{cx:-72,cy:64,r:20,st:'fill:var(--mom);opacity:.35'},G);tx(G,-72,69,'A','lb');H.E('circle',{cx:72,cy:64,r:20,st:'fill:var(--rna);opacity:.35'},G);tx(G,72,69,'B','lb');
    H.E('path',{d:'M-84,32 L-76,44 L-82,46 L-72,58',st:'fill:none;stroke:var(--hi);stroke-width:2.5;stroke-linecap:round'},G);
    tx(G,0,150,lab,'lb','font-size:13px');return G};
  const A1=arena(100,'normal fly'),A2=arena(370,'dunce mutant');
  const f1=fly(F,0,0,.9,'brn'),f2=fly(F,0,0,.9,'brn');H.T(f1,{x:100,y:122,s:.9},{d:0});H.T(f2,{x:370,y:122,s:.9},{d:0});
  const r1=tx(F,100,170,'','lbs','font-weight:700;fill:var(--good)'),r2=tx(F,370,170,'','lbs','font-weight:700;fill:var(--bad)');
  const gA=H.g(F);H.O(gA,0,{d:0});shown(mkA(gA,490,110,540,110,{w:1.8,h:7}));gbox(gA,582,110,'dunce',{w:70,fill:'bad'});tx(gA,582,138,'the gene','lbs');
  const hu=H.g(s);H.O(hu,0,{d:0});H.E('rect',{x:470,y:154,width:156,height:30,rx:8,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.2'},hu);tx(hu,548,174,'human relatives','lbs','font-weight:700;fill:var(--ink)');
  const R=H.g(s);H.O(R,0,{d:0});H.E('line',{x1:20,y1:204,x2:620,y2:204,st:'stroke:var(--faint);stroke-width:1.5'},R);
  tx(R,20,230,'REVERSE GENETICS: GENE → TRAIT','cap','fill:var(--ink)','start');
  const seq=H.g(R);H.E('line',{x1:40,y1:276,x2:600,y2:276,st:'stroke:var(--muted);stroke-width:8;stroke-linecap:round;opacity:.6'},seq);
  ['gene 1','gene 2','gene 3','gene 4'].forEach((t,i)=>gbox(seq,100+i*140,276,t,{w:72,fill:i===2?'rna':'ink'}));tx(seq,320,256,'genome sequence: every gene known, many jobs unknown','lbs','font-weight:700;fill:var(--ink)');
  const cut=H.g(s);H.O(cut,0,{d:0});const sc=grp(cut,380,316);H.E('path',{d:'M-10,-14 L10,14 M10,-14 L-10,14',st:'stroke:var(--ink);stroke-width:2.5;stroke-linecap:round'},sc);H.E('circle',{cx:-12,cy:17,r:5,st:'fill:none;stroke:var(--ink);stroke-width:2'},sc);H.E('circle',{cx:12,cy:17,r:5,st:'fill:none;stroke:var(--ink);stroke-width:2'},sc);
  tx(cut,404,322,'CRISPR breaks gene 3','lbs','font-weight:700;fill:var(--ink)','start');const xb=xBadge(cut,412,266,8);
  const obs=H.g(s);H.O(obs,0,{d:0});shown(mkA(obs,380,346,380,366,{w:1.6,h:6}));H.E('rect',{x:240,y:370,width:280,height:34,rx:8,st:'fill:var(--good-tint);stroke:var(--good);stroke-width:1.5'},obs);
  tx(obs,380,392,'look for the change in phenotype','lbs','font-weight:700;fill:var(--ink)');
  return [
    ()=>{},
    ()=>{H.T(f1,{y:64},{d:600,at:300});H.T(f1,{x:172},{d:800,at:900});H.T(f2,{y:64},{d:600,at:300});H.T(f2,{x:298},{d:800,at:900});H.after(1500,()=>{r1.textContent='avoids A: learns';r2.textContent='goes to A: does not learn'});H.O(gA,1,{d:500,at:1900})},
    ()=>{H.O(hu,1,{d:600})},
    ()=>{H.O(R,1,{d:600});H.O(cut,1,{d:500,at:700})},
    ()=>{H.O(obs,1,{d:600})},
  ];}},

/* 23 ─────────────────────────────── */
{sec:'7.5',title:'Genes Are Named After Their Mutants',caption:'photo: fruit flies with different eye colours, Ktbn, public domain, Wikimedia Commons · right: one eye cell',
text:`<p data-step="0">Scientists find most genes through mutants. So they usually name a gene after its mutant phenotype, not after its normal job.</p>
<p data-step="1">Example: the fruit-fly gene <i>white</i>, on the X chromosome. Flies without a working copy have white eyes. The working allele, <i>white</i><sup>+</sup>, gives red eyes.</p>
<p data-step="2">The <i>white</i> protein carries a colourless pigment precursor into the eye cells. The cells then make the red pigment. Without the protein, the eye stays white.</p>
<p data-step="3">More than a dozen other genes also change the eye colour when broken, for example <i>cinnabar</i>, <i>brown</i>, <i>scarlet</i> and <i>vermilion</i>. The name <i>red</i> would fit all of them, so each gene takes the name of its mutant colour.</p>
<p data-step="4">Genes for early development take names from the look of the mutant embryo: <i>hunchback</i>, <i>even-skipped</i>, <i>hairy</i>, <i>runt</i>. Rule: the normal job of a gene is what is missing or wrong in the mutant.</p>`,
star:'Gene white: broken gives white eyes, working gives red eyes.',starStep:2,
scene(H){const s=document.getElementById('stage');
  photo(s,'@@asset:c5-fly-eye-colours.jpg@@',14,14,200,250);tag(s,22,256,'eye-colour mutants');
  const CX=460,CY=130;const cellG=H.g(s);H.O(cellG,0,{d:0});
  H.E('rect',{x:CX-150,y:CY-90,width:300,height:180,rx:28,st:'fill:var(--cellfill);stroke:var(--ink);stroke-width:2.5'},cellG);tx(cellG,CX,CY+76,'eye cell','lbs','font-weight:700;fill:var(--ink)');
  const tr=grp(cellG,CX-150,CY);const trB=H.E('rect',{x:-9,y:-26,width:18,height:52,rx:6,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.6'},tr);
  const trL=tx(cellG,CX-150,CY-36,'white protein','lbs','font-weight:700;fill:var(--good)');
  const pre=[];for(let i=0;i<5;i++){const d=H.E('circle',{r:6,st:'fill:var(--card);stroke:var(--muted);stroke-width:1.5'},s);H.T(d,{x:CX-200,y:CY-40+i*20},{d:0});H.O(d,0,{d:0});pre.push(d)}
  const preL=tx(s,CX-200,CY+76,'precursor','lbs');H.O(preL,0,{d:0});
  const pig=tx(cellG,CX+40,CY-50,'','lb','fill:var(--bad)');
  const X=xBadge(cellG,CX-140,CY-26,9);hide(X);
  const N=H.g(s);H.O(N,0,{d:0});const NY=300;
  tx(N,232,NY-20,'OTHER EYE-COLOUR GENES','cap','fill:var(--ink)','start');
  ['cinnabar','brown','scarlet','vermilion'].forEach((t,i)=>{const G=grp(N,272+i*92,NY+4);H.E('rect',{x:-42,y:-13,width:84,height:26,rx:13,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},G);tx(G,0,4.5,t,'lbs','font-style:italic;font-weight:700;fill:var(--ink)')});
  const D=H.g(s);H.O(D,0,{d:0});tx(D,20,NY+52,'DEVELOPMENT GENES','cap','fill:var(--ink)','start');
  ['hunchback','even-skipped','hairy','runt'].forEach((t,i)=>{const G=grp(D,80+i*124,NY+80);H.E('rect',{x:-56,y:-13,width:112,height:26,rx:13,st:'fill:var(--aa-tint);stroke:var(--aa);stroke-width:1.5'},G);tx(G,0,4.5,t,'lbs','font-style:italic;font-weight:700;fill:var(--ink)')});
  return [
    ()=>{},
    ()=>{H.O(cellG,1,{d:600})},
    ()=>{H.O(preL,1);pre.forEach((d,i)=>{H.O(d,1,{d:200,at:i*120});H.T(d,{x:CX-150,y:CY},{d:700,at:300+i*300});
        H.after(1000+i*300,()=>{H.K(d,{fill:'bad',stroke:'ink'},{d:300});H.T(d,{x:CX-40+(i%3)*30,y:CY-6+Math.floor(i/3)*26},{d:700})})});
      H.after(2600,()=>{pig.textContent='red pigment'})},
    ()=>{H.O(N,1,{d:600})},
    ()=>{H.O(D,1,{d:600})},
  ];}},

/* 24 ─────────────────────────────── */
{sec:'7.5',title:'Changes With No Visible Effect',caption:'dark blocks = exons · light blocks = introns · grey = DNA between genes · dots = DNA changes after a mutagen',
text:`<p data-step="0">After a mutagen treatment, most DNA changes have no visible effect on the phenotype.</p>
<p data-step="1">Only about 1–2% of human DNA codes for protein. Most of the rest is <b>intergenic</b> (between genes) or inside introns. A change there usually has no effect.</p>
<p data-step="2">A change inside a coding sequence can be a <b>silent mutation</b>. The new codon names the same amino acid, so the protein stays the same.</p>
<p data-step="3">A missense change can also have no effect. Lysine and arginine are similar amino acids. So a lysine → arginine change on the surface of a protein often has no effect.</p>
<p data-step="4">But a change in an intron can break splicing. A change near a gene can alter the amount of RNA that the cell makes.</p>`,
star:'Most of the genome is not coding, so most hits do nothing visible.',starStep:1,
scene(H){const s=document.getElementById('stage');const Y=80;
  const G=H.g(s);tx(G,20,36,'A STRETCH OF DNA','cap','fill:var(--ink)','start');
  H.E('rect',{x:20,y:Y-9,width:600,height:18,rx:4,st:'fill:var(--faint)'},G);
  const gene=(x0,ex)=>{H.E('rect',{x:x0,y:Y-9,width:ex[ex.length-1][0]+ex[ex.length-1][1],height:18,st:'fill:var(--rna-tint);stroke:var(--rna);stroke-width:1'},G);
    ex.forEach(([a,w])=>H.E('rect',{x:x0+a,y:Y-11,width:w,height:22,rx:2,st:'fill:var(--rna);stroke:var(--ink);stroke-width:1'},G))};
  gene(110,[[0,10],[40,8],[90,12]]);gene(400,[[0,12],[52,9],[120,10],[160,8]]);
  tx(G,160,Y+32,'gene 1','lbs','font-weight:700;fill:var(--ink)');tx(G,484,Y+32,'gene 2','lbs','font-weight:700;fill:var(--ink)');
  const hx=[44,70,128,180,236,262,300,346,372,430,466,500,525,590,604];const exonHit=[false,false,false,false,false,false,false,false,false,false,false,false,true,false,false];
  const hits=hx.map((x,i)=>{const d=H.E('circle',{r:5,st:`fill:${exonHit[i]?'var(--bad)':'var(--ink)'};stroke:var(--card);stroke-width:1.5`},s);H.T(d,{x,y:Y-40},{d:0});H.O(d,0,{d:0});return d});
  const hL=tx(s,320,Y+54,'14 of 15 changes land outside exons: no visible effect','lbs','font-weight:700;fill:var(--ink)');H.O(hL,0,{d:0});
  const P=H.g(s);H.O(P,0,{d:0});tx(P,20,170,'HUMAN GENOME','cap','fill:var(--ink)','start');
  H.E('rect',{x:20,y:182,width:600,height:24,rx:4,st:'fill:var(--faint)'},P);H.E('rect',{x:20,y:182,width:9,height:24,st:'fill:var(--rna)'},P);
  tx(P,34,224,'protein-coding: about 1.5%','lbs','font-weight:700;fill:var(--rna)','start');tx(P,620,224,'introns, intergenic DNA and other non-coding DNA','lbs','font-weight:700;fill:var(--ink)','end');
  const S1=H.g(s);H.O(S1,0,{d:0});tx(S1,20,262,'SILENT','cap','fill:var(--good)','start');
  const t1=row(S1,40,290,'GCT','dna',{w:21,h:24,fs:14});shown(mkA(S1,84,290,116,290,{w:1.6,h:6}));const t2=row(S1,130,290,'GCC','dna',{w:21,h:24,fs:14});t2[2].t.style.fill='var(--bad)';t2[2].r.style.stroke='var(--bad)';
  bead(S1,64,330,'Ala',{r:13});bead(S1,154,330,'Ala',{r:13});tx(S1,110,360,'same amino acid','lbs','font-weight:700;fill:var(--good)');
  const S2=H.g(s);H.O(S2,0,{d:0});tx(S2,230,262,'HARMLESS MISSENSE','cap','fill:var(--good)','start');
  row(S2,250,290,'AAG','dna',{w:21,h:24,fs:14});shown(mkA(S2,294,290,326,290,{w:1.6,h:6}));const t3=row(S2,340,290,'AGG','dna',{w:21,h:24,fs:14});t3[1].t.style.fill='var(--bad)';t3[1].r.style.stroke='var(--bad)';
  bead(S2,274,330,'Lys',{r:13});bead(S2,364,330,'Arg',{r:13,fill:'var(--hi)',tc:'#16181d'});tx(S2,320,360,'similar amino acid','lbs','font-weight:700;fill:var(--good)');
  const S3=H.g(s);H.O(S3,0,{d:0});tx(S3,440,262,'EXCEPTIONS','cap','fill:var(--bad)','start');
  tx(S3,450,292,'• intron change breaks','lbs','font-weight:700;fill:var(--ink)','start');tx(S3,462,308,'splicing','lbs','font-weight:700;fill:var(--ink)','start');
  tx(S3,450,334,'• change near a gene alters','lbs','font-weight:700;fill:var(--ink)','start');tx(S3,462,350,'the amount of RNA','lbs','font-weight:700;fill:var(--ink)','start');
  return [
    ()=>{hits.forEach((d,i)=>{H.O(d,1,{d:150,at:i*120});H.T(d,{y:Y},{d:500,at:i*120})});H.O(hL,1,{at:2000})},
    ()=>{H.O(P,1,{d:600})},
    ()=>{H.O(S1,1,{d:600})},
    ()=>{H.O(S2,1,{d:600})},
    ()=>{H.O(S3,1,{d:600})},
  ];}},

/* 25 ─────────────────────────────── */
{sec:'7.5',title:'Hidden by the Environment or a Backup Gene',caption:'orange spots = mould growth · X1 and X2 = two genes that make enzymes with the same job',
text:`<p data-step="0">Some mutations remove all function of a gene, but the phenotype does not change. Even a <b>homozygous</b> mutant (one with two mutant copies) can look normal.</p>
<p data-step="1"><b>Environment.</b> An auxotroph on complete medium grows like the wild type, because the medium supplies the missing nutrient. On minimal medium, the defect shows. Scientists change the conditions to reveal such mutants.</p>
<p data-step="2"><b>Redundancy.</b> A second gene, at another <b>locus</b> (position on a chromosome), can make a product with the same job. The second gene covers the loss of the first. A screen for broken genes cannot easily find a redundant gene.</p>
<p data-step="3">Example: salivary glands and the bladder contain much CFTR protein. Broken CFTR causes no problem in these organs, probably because other ion channels do the same job there.</p>
<p data-step="4"><b>Heterozygotes.</b> A carrier of one recessive allele also looks normal, because one working copy makes enough protein.</p>`,
star:'No phenotype does not mean no mutation.',starStep:2,
scene(H){const s=document.getElementById('stage');
  const E=H.g(s);H.O(E,0,{d:0});tx(E,20,30,'ENVIRONMENT','cap','fill:var(--ink)','start');
  const w1=plate(E,70,96,34,{col:'orn',seed:3}),w2=plate(E,170,96,34,{col:'orn',seed:4}),m1=plate(E,70,206,34,{col:'orn',seed:5}),m2=plate(E,170,206,34,{col:'orn',seed:6});
  [w1,w2,m1].forEach(p=>H.O(p.gr,1,{d:0}));tx(E,70,56,'CM','lb','font-size:13px');tx(E,170,56,'MM','lb','font-size:13px');
  tx(E,228,100,'wild type','lbs','font-weight:700;fill:var(--ink)','start');tx(E,228,210,'auxotroph','lbs','font-weight:700;fill:var(--bad)','start');
  const hid=H.E('rect',{x:30,y:164,width:80,height:84,rx:10,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--good);stroke-width:2.5'},E);
  const hidL=tx(E,70,262,'looks normal on CM','lbs','font-weight:700;fill:var(--good)');
  const R=H.g(s);H.O(R,0,{d:0});const RX=340;tx(R,RX,30,'REDUNDANCY','cap','fill:var(--ink)','start');
  const lanes=[['both working',1,1],['X1 broken',0,1],['both broken',0,0]].map(([t,a,b],i)=>{const G=H.g(R);const y=74+i*72;tx(G,RX,y-18,t,'lbs','font-weight:700;fill:var(--ink)','start');
    [[a,'X1',0],[b,'X2',1]].forEach(([ok,n,k])=>{const g=gbox(G,RX+26+k*62,y+4,n,{w:48,h:22,fill:ok?'good':'card',tc:ok?'var(--paper)':'var(--bad)'});if(!ok)g.r.style.stroke='var(--bad)'});
    shown(mkA(G,RX+128,y+4,RX+166,y+4,{w:1.6,h:6}));const on=a||b;
    H.E('circle',{cx:RX+184,cy:y+4,r:11,st:`fill:${on?'var(--hi)':'var(--card)'};stroke:var(--ink);stroke-width:1.5`},G);
    tx(G,RX+204,y+9,on?'product made':'no product','lbs',`font-weight:700;fill:var(--${on?'good':'bad'})`,'start');H.O(G,0,{d:0});return G});
  const C=H.g(s);H.O(C,0,{d:0});H.E('rect',{x:20,y:296,width:600,height:46,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.2'},C);
  tx(C,320,316,'salivary gland and bladder: CFTR broken, other channels move the ions','lbs','font-weight:700;fill:var(--ink)');tx(C,320,333,'no problem in these organs','lbs','font-weight:700;fill:var(--good)');
  const Hz=H.g(s);H.O(Hz,0,{d:0});tx(Hz,20,380,'HETEROZYGOTE','cap','fill:var(--ink)','start');
  gbox(Hz,170,376,'+',{w:28,h:22,fill:'good'});const hm=gbox(Hz,204,376,'m',{w:28,h:22,fill:'card',tc:'var(--bad)'});hm.r.style.stroke='var(--bad)';
  tx(Hz,236,381,'one working copy: looks normal','lbs','font-weight:700;fill:var(--good)','start');
  return [
    ()=>{},
    ()=>{H.O(E,1,{d:600});H.D(hid,1,{d:800,at:700})},
    ()=>{H.O(R,1);lanes.forEach((G,i)=>H.O(G,1,{d:500,at:i*500}))},
    ()=>{H.O(C,1,{d:600})},
    ()=>{H.O(Hz,1,{d:600})},
  ];}},

/* 26 ─────────────────────────────── */
{sec:'7.5',title:'Essential Genes and Lethal Alleles',caption:'photo: fruit-fly embryo, nuclei blue and even-skipped protein red, Thomas Gregor, CC BY 4.0, Wikimedia Commons · a = lethal allele',
text:`<p data-step="0">Some traits show only at a later stage. Flower colour needs a plant old enough to flower. Eye colour needs an adult fly.</p>
<p data-step="1">An <b>essential gene</b> is a gene that an organism needs to survive. A broken essential gene is a <b>recessive lethal allele</b>. An aa individual dies at an early stage: as an embryo, a larva or a pupa. A <b>larva</b> is the young, worm-like stage, and a <b>pupa</b> is the resting stage before the adult.</p>
<p data-step="2">Cross two carriers, Aa × Aa. The aa offspring die. All the survivors (AA and Aa) look normal. They form a 3 : 0 ratio, the same as 1 : 0: both mean one phenotype class only. A screen of adults misses the mutation.</p>
<p data-step="3">Screens of embryos find these genes. Christiane Nüsslein-Volhard and Eric Wieschaus found the gap, pair-rule and segment-polarity genes, which divide the fly embryo into segments. They shared the 1995 Nobel Prize with Edward Lewis. Humans have related genes.</p>`,
star:'Dead embryos leave no mutant adults to count: Aa × Aa gives 3 normal : 0 mutant.',starStep:2,
scene(H){const s=document.getElementById('stage');
  const T=H.g(s);tx(T,20,30,'WHEN A TRAIT SHOWS','cap','fill:var(--ink)','start');
  const st=['embryo','seedling','flowering plant'];const sx=[80,240,420];
  H.E('line',{x1:40,y1:96,x2:520,y2:96,st:'stroke:var(--faint);stroke-width:2'},T);
  const em=grp(T,sx[0],80);H.E('ellipse',{rx:24,ry:13,st:'fill:var(--cellfill);stroke:var(--ink);stroke-width:2'},em);
  const sd=grp(T,sx[1],80);H.E('path',{d:'M0,14 L0,-6 M0,-2 C-12,-8 -16,-2 -14,4 C-8,6 -2,2 0,-2 M0,-6 C10,-14 16,-8 14,-2 C8,0 2,-2 0,-6',st:'fill:var(--good);stroke:var(--good);stroke-width:2'},sd);
  const fl=flower(T,sx[2],70,.45,'aa');tx(T,sx[0],120,st[0],'lbs');tx(T,sx[1],120,st[1],'lbs');tx(T,sx[2],120,st[2],'lbs');
  const sc=tx(T,580,80,'colour','lb','font-size:13px;fill:var(--aa)');tx(T,580,96,'shows here','lbs');
  const die=H.g(s);H.O(die,0,{d:0});xBadge(die,sx[0]+22,66,9);tx(die,sx[0],140,'aa dies here','lbs','font-weight:700;fill:var(--bad)');
  const PS=H.g(s);H.O(PS,0,{d:0});const PX=60,PY=190,C=50;tx(PS,PX+C,PY-24,'Aa × Aa','lb','font-size:14px');
  ['A','a'].forEach((g,i)=>{tx(PS,PX+C/2+i*C,PY-4,g,'mt','font-size:17px;fill:var(--dad)');tx(PS,PX-14,PY+C/2+6+i*C,g,'mt','font-size:17px;fill:var(--mom)')});
  const cells=['AA','Aa','Aa','aa'].map((t,k)=>{const x=PX+(k%2)*C,y=PY+Math.floor(k/2)*C;const G=H.g(PS);G.r=H.E('rect',{x,y,width:C,height:C,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},G);tx(G,x+C/2,y+C/2+6,t,'mt','font-size:16px');G.cx=x+C/2;G.cy=y+C/2;return G});
  const dX=xBadge(PS,cells[3].cx+18,cells[3].cy-18,8);hide(dX);
  const surv=H.g(s);H.O(surv,0,{d:0});const fls=[0,1,2].map(i=>{const f=flower(surv,230+i*54,232,.45,'aa');return f});
  tx(surv,284,290,'3 survivors, all normal','lbs','font-weight:700;fill:var(--ink)');const ratio=tx(surv,284,318,'3 : 0  =  1 : 0','lb','font-size:16px');
  const EM=H.g(s);H.O(EM,0,{d:0});photo(EM,'@@asset:c7-fly-embryo.jpg@@',380,170,248,92);tag(EM,386,254,'even-skipped stripes');
  tx(EM,504,286,'Nobel Prize 1995','lb','font-size:13px');tx(EM,504,304,'Nüsslein-Volhard · Wieschaus · Lewis','lbs');
  tx(EM,504,340,'gap, pair-rule and','lb','font-size:13px;fill:var(--aa)');tx(EM,504,358,'segment-polarity genes','lb','font-size:13px;fill:var(--aa)');
  tx(EM,504,380,'divide the embryo into segments','lbs');
  return [
    ()=>{},
    ()=>{H.O(die,1,{d:500})},
    ()=>{H.O(PS,1,{d:500});pop(dX,{at:700});H.after(700,()=>{cells[3].r.style.fill='var(--bad-tint)'});H.O(cells[3],.45,{at:900});H.O(surv,1,{d:600,at:1200})},
    ()=>{H.O(EM,1,{d:700})},
  ];}},

/* 27 ─────────────────────────────── */
{sec:'7.5',title:'A Shortage of Sons',caption:'blue = from the father · orange = from the mother · red badge = recessive lethal mutation on the X',
text:`<p data-step="0">Scientists exposed the father of a female fruit fly to a mutagen. Later, they cross her with a normal male. All the offspring look normal, but there are twice as many daughters as sons.</p>
<p data-step="1">Hypothesis: her father gave her an X chromosome with a new recessive lethal mutation, l. She is a carrier, X<sup>+</sup>X<sup>l</sup>. She lives because her other X is normal.</p>
<p data-step="2">Each son gets his only X from his mother. Half of her sons get X<sup>l</sup> and die as embryos, because a male has no second X.</p>
<p data-step="3">Each daughter also gets a normal X from her father, so all the daughters live. The survivors are 2 daughters for each son.</p>
<p data-step="4">Test: cross each daughter with a normal male. Half of the daughters are carriers, and they give the 2 : 1 ratio again. The other daughters give a normal 1 : 1 ratio.</p>`,
star:'X-linked lethal in the mother: half her sons die, so daughters : sons = 2 : 1.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const xc=(p,x,y,col,lab,bad,len)=>{const G=grp(p,x,y);H.E('line',{x1:0,y1:-(len||26),x2:0,y2:(len||26),st:`stroke:var(--${col});stroke-width:12;stroke-linecap:round`},G);
    tx(G,0,(len||26)+20,lab,'lbs','font-weight:700;fill:var(--ink)');if(bad)xBadge(G,0,-6,7);return G};
  const yc=(p,x,y)=>{const G=grp(p,x,y);H.E('line',{x1:0,y1:-14,x2:0,y2:14,st:'stroke:var(--dad);stroke-width:12;stroke-linecap:round'},G);tx(G,0,34,'Y','lbs','font-weight:700;fill:var(--ink)');return G};
  const P=H.g(s);tx(P,150,30,'MOTHER (CARRIER)','cap','fill:var(--ink)');tx(P,480,30,'FATHER (NORMAL)','cap','fill:var(--ink)');
  xc(P,128,80,'mom','X⁺',false);const ml=xc(P,172,80,'mom','Xˡ',false);xc(P,462,80,'dad','X⁺',false);yc(P,502,92);tx(P,320,86,'×','big');
  const ld=xBadge(s,172,74,7);hide(ld);const gl=tx(s,190,52,'from her father','lbs','font-weight:700;fill:var(--bad)','start');H.O(gl,0,{d:0});
  const kids=[['daughter','X⁺','X⁺',0,0],['daughter','X⁺','Xˡ',0,1],['son','X⁺','Y',1,0],['son','Xˡ','Y',1,1]];
  const K=kids.map(([t,a,b,son,bad],i)=>{const G=H.g(s);const x=90+i*150,y=246;
    if(son){xc(G,x-14,y,'mom',a,false);yc(G,x+14,y+12);if(bad)xBadge(G,x-14,y-6,7)}else{xc(G,x-14,y,'dad','X⁺',false);xc(G,x+14,y,'mom',b,false);if(bad)xBadge(G,x+14,y-6,7)}
    G.lab=tx(G,x,y+64,t,'lb','font-size:13px');G.res=tx(G,x,y+82,'','lbs','font-weight:700');H.O(G,0,{d:0});G.son=son;G.bad=bad;return G});
  const lines=K.map((G,i)=>H.E('path',{d:`M320,124 L${90+i*150},190`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--faint);stroke-width:1.5'},s));
  const cnt=H.g(s);H.O(cnt,0,{d:0});H.E('rect',{x:150,y:352,width:340,height:50,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},cnt);
  tx(cnt,320,384,'daughters : sons = 2 : 1','lb','font-size:18px');
  const TC=H.g(s);H.O(TC,0,{d:0});[['carrier daughter × normal male','2 : 1 again','bad',20],['normal daughter × normal male','1 : 1','good',330]].forEach(([a,b,c,x])=>{H.E('rect',{x,y:348,width:290,height:56,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},TC);tx(TC,x+145,370,a,'lbs','font-weight:700;fill:var(--ink)');tx(TC,x+145,394,'daughters : sons = '+b,'lb',`font-size:14px;fill:var(--${c})`)});
  return [
    ()=>{},
    ()=>{pop(ld);H.O(gl,1,{at:300})},
    ()=>{[2,3].forEach(i=>{H.D(lines[i],1,{d:600});H.O(K[i],1,{d:500,at:400})});
      H.after(1100,()=>{K[2].res.textContent='lives';K[2].res.style.fill='var(--good)';K[3].res.textContent='dies as an embryo';K[3].res.style.fill='var(--bad)'});H.O(K[3],.35,{at:1300})},
    ()=>{[0,1].forEach(i=>{H.D(lines[i],1,{d:600});H.O(K[i],1,{d:500,at:400})});
      H.after(1100,()=>{K[0].res.textContent='lives';K[1].res.textContent='lives (carrier)';[0,1].forEach(i=>K[i].res.style.fill='var(--good)')});H.O(cnt,1,{d:600,at:1400})},
    ()=>{H.O(cnt,0);H.O(TC,1,{d:600,at:300})},
  ];}},


/* 28 ─────────────────────────────── */
{sec:'7.6',title:'Cystic Fibrosis: One Gene, One Disease',caption:'Lap-Chee Tsui: Joi Ito, CC BY 2.0, Wikimedia Commons · blue = from the father · orange = from the mother · cf = a mutant CFTR allele',
text:`<p data-step="0"><b>Cystic fibrosis (CF)</b> is a disease caused by mutations in one gene, <b>CFTR</b>, on chromosome 7. CF is autosomal recessive.</p>
<p data-step="1">CF is the most common life-limiting recessive disease in people of northern European ancestry. About 1 in 25 of these people carries one mutant copy. The frequency differs between populations.</p>
<p data-step="2">One working copy makes enough CFTR channels, so a carrier is healthy. Two carriers have a ¼ chance of a child with CF in each pregnancy.</p>
<p data-step="3">If two people meet at random, both are carriers with probability 1/25 × 1/25 = 1/625. Their child has CF with probability ¼. So about 1 in 2,500 babies of northern European ancestry has CF.</p>
<p data-step="4">A team led by Lap-Chee Tsui in Toronto found the position of the gene on chromosome 7 in 1985. With the teams of John Riordan and Francis Collins, it identified the gene itself in 1989.</p>`,
star:'One working CFTR copy is enough: carriers are healthy, and CF needs two mutant copies.',starStep:2,
scene(H){const s=document.getElementById('stage');
  const par=(x,col,lab)=>{const G=H.g(s);[0,1].forEach(k=>{const y=70+k*30;H.E('line',{x1:x-60,y1:y,x2:x+60,y2:y,st:`stroke:var(--${col});stroke-width:9;stroke-linecap:round;opacity:.55`},G);
      const g=gbox(G,x+10,y,k?'cf':'CFTR',{w:44,h:20,fill:k?'card':'good',tc:k?'var(--bad)':'var(--paper)'});if(k)g.r.style.stroke='var(--bad)'});
    tx(G,x,40,lab,'lb','font-size:13px');tx(G,x-70,90,'7','lbs','font-weight:700;fill:var(--ink)','end');return G};
  const P1=par(110,'dad','carrier father'),P2=par(330,'mom','carrier mother');tx(s,220,92,'×','big');
  const ppl=H.g(s);H.O(ppl,0,{d:0});tx(ppl,330,152,'1 IN 25 IS A CARRIER','cap','fill:var(--ink)');
  for(let i=0;i<25;i++){const x=262+(i%5)*34,y=176+Math.floor(i/5)*37,c=i===12;H.E('circle',{cx:x,cy:y,r:8,st:`fill:${c?'var(--mom)':'var(--wash)'};stroke:var(--ink);stroke-width:1.3`},ppl);H.E('path',{d:`M${x-10},${y+20} Q${x},${y+6} ${x+10},${y+20}`,st:`fill:${c?'var(--mom)':'var(--wash)'};stroke:var(--ink);stroke-width:1.3`},ppl)}
  const PS=H.g(s);H.O(PS,0,{d:0});const PX=60,PY=170,C=58;
  ['+','cf'].forEach((g,i)=>{tx(PS,PX+C/2+i*C,PY-8,g,'mt','font-size:17px;fill:var(--dad)');tx(PS,PX-16,PY+C/2+6+i*C,g,'mt','font-size:17px;fill:var(--mom)')});
  [['+/+',0],['+/cf',0],['+/cf',0],['cf/cf',1]].forEach(([t,b],k)=>{const x=PX+(k%2)*C,y=PY+Math.floor(k/2)*C;H.E('rect',{x,y,width:C,height:C,st:`fill:${b?'var(--bad-tint)':'var(--card)'};stroke:var(--ink);stroke-width:1.5`},PS);
    tx(PS,x+C/2,y+C/2+2,t,'mt','font-size:15px');tx(PS,x+C/2,y+C/2+18,b?'CF':(t==='+/+'?'healthy':'carrier'),'lbs',`font-weight:700;fill:var(--${b?'bad':'good'})`)});
  tx(PS,PX+C,PY+2*C+24,'¼ of children: CF','lb','fill:var(--bad);font-size:13px');
  const calc=H.g(s);H.O(calc,0,{d:0});H.E('rect',{x:20,y:366,width:430,height:42,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},calc);
  tx(calc,235,393,'1/25 × 1/25 × ¼ = 1/2,500 babies with CF','lb','font-size:15px');
  const ph=H.g(s);H.O(ph,0,{d:0});photo(ph,'@@asset:c7-tsui.jpg@@',470,14,156,206);tag(ph,476,212,'Lap-Chee Tsui');
  tx(ph,548,246,'gene position: 1985','lbs','font-weight:700;fill:var(--ink)');tx(ph,548,264,'gene identified: 1989','lbs','font-weight:700;fill:var(--ink)');
  return [
    ()=>{},
    ()=>{H.O(ppl,1,{d:600})},
    ()=>{H.O(PS,1,{d:600})},
    ()=>{H.O(calc,1,{d:600})},
    ()=>{H.O(ph,1,{d:700})},
  ];}},

/* 29 ─────────────────────────────── */
{sec:'7.6',title:'CFTR: A Chloride Channel',caption:'right: the real shape of human CFTR, from its structure (PDB 5UAK), Robmagin1, CC BY-SA 4.0, Wikimedia Commons · green dots = chloride ions · blue drops = water',
text:`<p data-step="0">CFTR stands for cystic fibrosis transmembrane conductance regulator. The CFTR protein is a channel in the cell membrane of <b>epithelial cells</b>. These cells line the lungs, the gut and the glands.</p>
<p data-step="1">The channel lets chloride ions (Cl<sup>−</sup>) pass through the membrane. Its gate opens when another part of the protein binds <b>ATP</b>, the energy molecule of the cell.</p>
<p data-step="2">Chloride leaves the cell, and water follows it. The water keeps a thin liquid layer on the surface. So the mucus stays thin, and the <b>cilia</b> (tiny hairs on the cells) can move it out of the lungs.</p>
<p data-step="3">With too little CFTR activity, less chloride and water reach the surface. The mucus becomes thick and sticky. In the lungs, it traps bacteria and causes infections.</p>
<p data-step="4">Lung disease causes most deaths from CF. CF also damages the pancreas, liver and intestines, and it often causes infertility. Faulty CFTR makes sweat too salty, so doctors diagnose CF with a sweat test.</p>`,
star:'No chloride out, no water out: the mucus turns thick.',starStep:3,
scene(H){const s=document.getElementById('stage');const MY=230,X0=20,X1=420;
  tx(s,X0,40,'AIRWAY SURFACE','cap','fill:var(--ink)','start');tx(s,X0,400,'INSIDE AN EPITHELIAL CELL','cap','fill:var(--ink)','start');
  const muc=H.E('rect',{x:X0,y:MY-82,width:X1-X0,height:30,rx:6,st:'fill:var(--mucus);opacity:.55'},s);const thick=H.E('rect',{x:X0,y:MY-122,width:X1-X0,height:70,rx:8,st:'fill:var(--mucus);opacity:0'},s);const mucL=tx(s,X1-6,MY-62,'thin mucus','lbs','font-weight:700;fill:var(--ink)','end');
  const cil=H.g(s);for(let x=X0+14;x<X1;x+=22)if(Math.abs(x-200)>40)H.E('path',{d:`M${x},${MY-16} q-4,-14 4,-30`,st:'fill:none;stroke:var(--ink);stroke-width:1.6;stroke-linecap:round'},cil);
  const mem=H.g(s);for(let x=X0+6;x<X1;x+=12)if(Math.abs(x-200)>30){[MY-12,MY+12].forEach((y,k)=>{H.E('circle',{cx:x,cy:y,r:5,st:'fill:var(--mom);opacity:.75'},mem);H.E('line',{x1:x,y1:y+(k?-5:5),x2:x,y2:MY,st:'stroke:var(--mom);stroke-width:1.5;opacity:.6'},mem)})}
  const ch=grp(s,200,MY);const L=H.E('path',{d:'M-30,-26 L-8,-26 L-8,26 L-34,26 Z',st:'fill:var(--dad);stroke:var(--ink);stroke-width:1.5'},ch),R=H.E('path',{d:'M8,-26 L30,-26 L34,26 L8,26 Z',st:'fill:var(--dad);stroke:var(--ink);stroke-width:1.5'},ch);
  const gate=H.E('rect',{x:-10,y:22,width:20,height:8,rx:3,st:'fill:var(--ink)'},ch);const nbd=H.E('ellipse',{cx:0,cy:52,rx:26,ry:14,st:'fill:var(--dad-tint);stroke:var(--dad);stroke-width:1.5'},ch);
  tx(s,236,MY+60,'CFTR channel','lb','fill:var(--dad)','start');
  const atp=grp(s,120,MY+110);H.E('circle',{r:12,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},atp);tx(atp,0,4,'ATP','lbs','font-weight:700;fill:#16181d;font-size:9px');H.O(atp,0,{d:0});
  const cl=[];for(let i=0;i<6;i++){const d=grp(s,170+(i%3)*30,MY+86+Math.floor(i/3)*24);H.E('circle',{r:9,st:'fill:var(--good);stroke:var(--ink);stroke-width:1'},d);tx(d,0,3.5,'Cl⁻','lbs','font-weight:700;fill:var(--paper);font-size:8px');H.O(d,0,{d:0});cl.push(d)}
  const wat=[];for(let i=0;i<5;i++){const w=H.E('path',{d:'M0,-8 C5,-2 7,2 7,4 A7,7 0 0 1 -7,4 C-7,2 -5,-2 0,-8 Z',st:'fill:var(--dad-tint);stroke:var(--dad);stroke-width:1.3'},s);H.T(w,{x:250+i*24,y:MY+100},{d:0});H.O(w,0,{d:0});wat.push(w)}
  const bac=H.g(s);H.O(bac,0,{d:0});[[60,MY-96],[150,MY-104],[330,MY-92],[380,MY-108]].forEach(([x,y])=>{H.E('rect',{x:x-9,y:y-5,width:18,height:10,rx:5,st:'fill:var(--bad);stroke:var(--ink);stroke-width:1'},bac)});
  const ph=H.g(s);photo(ph,'@@asset:c7-cftr-structure.png@@',440,20,186,260,{fit:'xMidYMid meet'});tx(ph,533,298,'real CFTR protein','lb','font-size:13px');tx(ph,533,316,'spans the membrane','lbs');
  const org=H.g(s);H.O(org,0,{d:0});
  const OR=['lungs','pancreas','liver','intestines','sweat glands'];OR.forEach((t,i)=>{const G=grp(org,476+(i%2)*80,342+Math.floor(i/2)*26);H.E('rect',{x:-38,y:-11,width:76,height:22,rx:11,st:'fill:var(--bad-tint);stroke:var(--bad);stroke-width:1.3'},G);tx(G,0,4,t,'lbs','font-weight:700;fill:var(--ink);font-size:10.5px')});
  return [
    ()=>{},
    ()=>{H.O(atp,1);H.T(atp,{x:200,y:MY+52},{d:900,at:300});H.after(1200,()=>{H.T(gate,{x:-22},{d:500});H.T(L,{x:-3},{d:500});H.T(R,{x:3},{d:500})})},
    ()=>{cl.forEach((d,i)=>{H.O(d,1,{d:200,at:i*120});H.T(d,{x:200,y:MY-30},{d:700,at:300+i*260});H.T(d,{x:60+i*58,y:MY-40},{d:600,at:1000+i*260})});
      wat.forEach((w,i)=>{H.O(w,1,{d:200,at:1400+i*120});H.T(w,{x:80+i*70,y:MY-38},{d:900,at:1600+i*160})})},
    ()=>{H.T(gate,{x:0},{d:500});H.T(L,{x:0},{d:500});H.T(R,{x:0},{d:500});H.O(atp,0);H.O(ch,.35,{at:300});cl.forEach(d=>H.O(d,0,{d:400}));wat.forEach(w=>H.O(w,0,{d:400}));
      H.O(thick,.95,{d:900,at:400});H.after(800,()=>{mucL.textContent='thick, sticky mucus'});H.O(bac,1,{d:600,at:1200})},
    ()=>{H.O(org,1,{d:600})},
  ];}},

/* 30 ─────────────────────────────── */
{sec:'7.6',title:'F508del: Three Letters Lost',caption:'coding-strand DNA of CFTR codons 506 to 509 · Ile = isoleucine, Phe = phenylalanine, Gly = glycine · ER = endoplasmic reticulum',
text:`<p data-step="0">Scientists know more than 1,000 different mutant alleles of CFTR. Any mutation that stops enough chloride transport can cause CF.</p>
<p data-step="1">The most common allele is <b>F508del</b> (also written ΔF508). F508del deletes three DNA letters, CTT, which span codons 507 and 508. Codon 507 becomes ATT, which still names isoleucine. The reading frame stays intact, but the protein loses one amino acid: phenylalanine (F) number 508 of 1,480.</p>
<p data-step="2">The cell makes CFTR in the <b>endoplasmic reticulum (ER)</b>, a network of membranes where new proteins fold. The F508del protein folds wrongly. The quality control of the cell destroys it, so little CFTR reaches the cell membrane.</p>
<p data-step="3">In North America, about 7 in 10 mutant CFTR copies in people with CF are F508del.</p>
<p data-step="4">One hypothesis explains the high frequency: carriers lose less water in cholera, a disease that kills by dehydration. Another hypothesis is protection against some other infections. Neither hypothesis is proven.</p>`,
star:'F508del: 3 letters out, 1 amino acid out, the protein misfolds and never arrives.',starStep:2,
scene(H){const s=document.getElementById('stage');
  const seq='ATCATCTTTGGT',X0=110,DX=26;const pos=i=>X0+i*DX+Math.floor(i/3)*12;
  tx(s,20,32,'NORMAL CFTR','cap','fill:var(--ink)','start');
  const T=[...seq].map((c,i)=>tile(s,pos(i),62,c,'dna',{w:23,h:26}));
  ['506','507','508','509'].forEach((n,k)=>tx(s,pos(3*k+1),44,n,'lbs'));
  const aa=['Ile','Ile','Phe','Gly'].map((a,k)=>bead(s,pos(3*k+1),104,a,{r:14,fill:k===2?'var(--hi)':'var(--aa)',tc:k===2?'#16181d':null}));
  const del=[5,6,7];const ring=H.E('rect',{x:pos(5)-14,y:46,width:pos(7)-pos(5)+28,height:32,rx:6,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--bad);stroke-width:2.5'},s);
  const ML=H.g(s);H.O(ML,0,{d:0});tx(ML,20,154,'F508del','cap','fill:var(--bad)','start');
  const mseq='ATCATTGGT';const M=[...mseq].map((c,i)=>tile(ML,pos(i),184,c,'dna',{w:23,h:26}));
  ['Ile','Ile','Gly'].map((a,k)=>bead(ML,pos(3*k+1),226,a,{r:14}));tx(ML,440,231,'Phe 508 missing','lb','font-size:13px;fill:var(--bad)','start');
  tx(ML,440,189,'frame kept','lb','font-size:13px;fill:var(--good)','start');
  // fate in the cell
  const F=H.g(s);H.O(F,0,{d:0});const FY=310;
  H.E('path',{d:`M20,${FY+50} C60,${FY+20} 100,${FY+80} 150,${FY+46} C190,${FY+20} 220,${FY+74} 250,${FY+50}`,st:'fill:none;stroke:var(--muted);stroke-width:10;opacity:.35;stroke-linecap:round'},F);tx(F,40,FY+86,'ER','lb','font-size:13px','start');
  const mem=H.E('line',{x1:330,y1:FY-30,x2:620,y2:FY-30,st:'stroke:var(--mom);stroke-width:10;opacity:.6'},F);tx(F,612,FY-44,'cell membrane','lbs','font-weight:700;fill:var(--ink)','end');
  const good=grp(F,140,FY+20);H.E('path',{d:'M-14,-16 L14,-16 L16,16 L-16,16 Z',st:'fill:var(--dad);stroke:var(--ink);stroke-width:1.5'},good);
  const goodL=tx(F,420,FY+10,'normal: folds, reaches the membrane','lbs','font-weight:700;fill:var(--good)');
  const bad=grp(F,200,FY+30);H.E('path',{d:'M-14,-10 C-20,-22 6,-20 12,-12 C20,-2 4,8 14,16 C2,22 -18,14 -12,4 C-20,-2 -8,-4 -14,-10 Z',st:'fill:var(--dad-tint);stroke:var(--bad);stroke-width:2'},bad);
  const shred=grp(F,330,FY+56);H.E('rect',{x:-26,y:-16,width:52,height:32,rx:8,st:'fill:var(--ink)'},shred);tx(shred,0,4.5,'destroyed','lbs','font-weight:700;fill:var(--paper);font-size:9.5px');H.O(shred,0,{d:0});
  const badL=tx(F,450,FY+60,'F508del: misfolds, destroyed','lbs','font-weight:700;fill:var(--bad)','start');H.O(badL,0,{d:0});
  const freq=H.g(s);H.O(freq,0,{d:0});tx(freq,626,24,'CF ALLELES, NORTH AMERICA','cap','fill:var(--ink)','end');
  H.E('rect',{x:450,y:34,width:176,height:22,rx:4,st:'fill:var(--faint)'},freq);H.E('rect',{x:450,y:34,width:123,height:22,rx:4,st:'fill:var(--bad)'},freq);
  tx(freq,511,50,'F508del ≈ 70%','lbs','font-weight:700;fill:var(--paper)');tx(freq,600,50,'others','lbs','font-weight:700;fill:var(--ink)');
  return [
    ()=>{},
    ()=>{H.D(ring,1,{d:700});del.forEach(i=>{H.K(T[i].r,{stroke:'bad'},{d:300,at:500});T[i].t.style.fill='var(--bad)'});H.O(ML,1,{d:600,at:900});H.O(aa[2],.4,{at:900})},
    ()=>{H.O(F,1,{d:500});H.T(good,{x:470,y:FY-30},{d:1600,at:600});H.O(goodL,1,{at:800});H.T(bad,{x:300,y:FY+52},{d:1200,at:1400});pop(shred,{at:2200});H.O(bad,0,{d:400,at:2600});H.O(badL,1,{at:2600})},
    ()=>{H.O(freq,1,{d:600})},
    ()=>{},
  ];}},

/* 31 ─────────────────────────────── */
{sec:'7.6',title:'Medicine Designed from the Gene',caption:'blue = CFTR protein · green dots = chloride ions · purple = corrector drugs · yellow key = ivacaftor',
text:`<p data-step="0">The exact mutation shows what is wrong with the protein, so scientists can design a drug for it. CF drugs of this kind are <b>CFTR modulators</b>.</p>
<p data-step="1">In the G551D allele, glycine 551 changes to aspartate (a missense change). The protein reaches the membrane, but ATP cannot open the gate. Fewer than 5% of people with CF have this allele.</p>
<p data-step="2">The drug ivacaftor (Kalydeco), approved in 2012, binds CFTR and holds the gate open.</p>
<p data-step="3">In 2019, United States regulators approved a triple drug: elexacaftor, tezacaftor and ivacaftor. Elexacaftor and tezacaftor are <b>correctors</b>: they help the F508del protein fold and reach the membrane. Ivacaftor then opens the gate.</p>
<p data-step="4">The triple drug works for people with at least one F508del copy: about 9 in 10 people with CF.</p>`,
star:'Fold it, move it, open it: medicine designed from the DNA change.',starStep:3,
scene(H){const s=document.getElementById('stage');const MY=120;
  H.E('line',{x1:20,y1:MY,x2:620,y2:MY,st:'stroke:var(--mom);stroke-width:14;opacity:.5'},s);tx(s,620,MY-20,'cell membrane','lbs','font-weight:700;fill:var(--ink)','end');
  const chan=(x,lab)=>{const G=grp(s,x,MY);G.L=H.E('path',{d:'M-26,-24 L-6,-24 L-6,24 L-30,24 Z',st:'fill:var(--dad);stroke:var(--ink);stroke-width:1.5'},G);
    G.R=H.E('path',{d:'M6,-24 L26,-24 L30,24 L6,24 Z',st:'fill:var(--dad);stroke:var(--ink);stroke-width:1.5'},G);G.gate=H.E('rect',{x:-9,y:20,width:18,height:7,rx:3,st:'fill:var(--ink)'},G);
    tx(G,0,58,lab,'lb','font-size:13px');G.st=tx(G,0,76,'','lbs','font-weight:700');return G};
  const open=(G,at)=>{H.T(G.gate,{x:-20},{d:500,at});H.T(G.L,{x:-3},{d:500,at});H.T(G.R,{x:3},{d:500,at})};
  const flow=(x,at)=>{for(let i=0;i<3;i++){const d=H.E('circle',{r:6,st:'fill:var(--good);stroke:var(--ink);stroke-width:1'},s);H.T(d,{x,y:MY+40},{d:0});H.O(d,0,{d:0});
    H.O(d,1,{d:150,at:at+i*300});H.T(d,{y:MY-46-i*4,x:x+(i-1)*16},{d:900,at:at+i*300})}};
  const C1=chan(110,'G551D');const C2=chan(330,'F508del');H.O([C1,C2],0,{d:0});
  const key=grp(s,110,MY+120);H.E('path',{d:'M-14,-6 L8,-6 L8,-12 L18,0 L8,12 L8,6 L-14,6 Z',st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},key);key.l=tx(key,0,30,'ivacaftor','lbs','font-weight:700;fill:var(--ink)');H.O(key,0,{d:0});
  const ER=H.g(s);H.O(ER,0,{d:0});H.E('path',{d:`M240,320 C280,296 320,350 360,322 C400,296 430,346 460,320`,st:'fill:none;stroke:var(--muted);stroke-width:10;opacity:.35;stroke-linecap:round'},ER);tx(ER,350,360,'ER','lb','font-size:13px');
  const route=H.E('path',{d:'M350,268 L350,212',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:1'},s);
  const rL=tx(s,340,244,'correctors fold it, then it moves up','lbs','font-weight:700;fill:var(--aa)','end');H.O(rL,0,{d:0});
  const noL=tx(s,350,390,'without correctors: destroyed in the ER','lbs','font-weight:700;fill:var(--bad)');H.O(noL,0,{d:0});
  const mis=grp(s,350,290);H.E('path',{d:'M-14,-10 C-20,-22 6,-20 12,-12 C20,-2 4,8 14,16 C2,22 -18,14 -12,4 C-20,-2 -8,-4 -14,-10 Z',st:'fill:var(--dad-tint);stroke:var(--bad);stroke-width:2'},mis);H.O(mis,0,{d:0});
  const cor=[0,1].map(k=>{const G=grp(s,k?470:230,250);H.E('path',{d:'M-10,-10 L10,-10 L10,10 L-10,10 Z',transform:'rotate(45)',st:'fill:var(--aa);stroke:var(--ink);stroke-width:1.5'},G);tx(G,0,30,k?'tezacaftor':'elexacaftor','lbs','font-weight:700;fill:var(--aa)');H.O(G,0,{d:0});return G});
  const k2=grp(s,560,MY+120);H.E('path',{d:'M-14,-6 L8,-6 L8,-12 L18,0 L8,12 L8,6 L-14,6 Z',st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},k2);k2.l=tx(k2,0,30,'ivacaftor','lbs','font-weight:700;fill:var(--ink)');H.O(k2,0,{d:0});
  const nine=H.g(s);H.O(nine,0,{d:0});tx(nine,560,300,'PEOPLE WITH CF','cap','fill:var(--ink)');
  for(let i=0;i<10;i++){const x=510+(i%5)*25,y=322+Math.floor(i/5)*34;H.E('circle',{cx:x,cy:y,r:7,st:`fill:${i<9?'var(--good)':'var(--wash)'};stroke:var(--ink);stroke-width:1.2`},nine);H.E('path',{d:`M${x-9},${y+18} Q${x},${y+5} ${x+9},${y+18}`,st:`fill:${i<9?'var(--good)':'var(--wash)'};stroke:var(--ink);stroke-width:1.2`},nine)}
  tx(nine,560,404,'9 in 10 can use it','lbs','font-weight:700;fill:var(--good)');
  return [
    ()=>{},
    ()=>{H.O(C1,1,{d:500});H.after(600,()=>{C1.st.textContent='at the membrane, gate shut';C1.st.style.fill='var(--bad)'})},
    ()=>{H.O(key,1);H.O(key.l,0,{d:300,at:700});H.T(key,{y:MY+34},{d:900,at:200});open(C1,1100);flow(110,1500);H.after(1400,()=>{C1.st.textContent='ivacaftor opens the gate';C1.st.style.fill='var(--good)'})},
    ()=>{H.O(ER,1);H.O(noL,1);H.O(mis,1,{d:400});H.D(route,1,{d:900,at:1500});H.O(rL,1,{at:1700});cor.forEach((c,k)=>{H.O(c,1,{d:300,at:300});H.T(c,{x:k?370:330,y:280},{d:900,at:600})});
      H.after(1600,()=>{H.O([mis,...cor],0,{d:400});H.O(C2,1,{d:300});H.T(C2,{y:MY+170},{d:0});H.T(C2,{y:MY},{d:1200,at:200});H.after(1500,()=>{C2.st.textContent='folded, at the membrane, open';C2.st.style.fill='var(--good)'})});
      H.O(k2,1,{at:2600});H.O(k2.l,0,{d:300,at:3300});H.T(k2,{x:330,y:MY+34},{d:900,at:2700});open(C2,3600);flow(330,3900)},
    ()=>{H.O(nine,1,{d:600})},
  ];}},

/* 32 ─────────────────────────────── */
{sec:'7.5',title:'Mutation Types at a Glance',wide:true,steps:3,
text:`<div class="tblwrap" data-step="0"><table class="tbl">
<thead><tr><th>Mutation</th><th>DNA change</th><th>Effect on the protein</th><th>Usual dominance</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Silent</td><td>one letter; same amino acid</td><td>none</td><td>—</td><td>GCT → GCC: alanine stays alanine</td></tr>
<tr><td>Missense</td><td>one letter; a new amino acid</td><td>none, partial or complete loss of function</td><td>depends on the change</td><td><i>HBB</i> GAG → GTG (sickle cell); CFTR G551D</td></tr>
<tr><td>Nonsense</td><td>one letter; a new stop codon</td><td>short polypeptide, usually no function</td><td>recessive</td><td>TGG → TGA</td></tr>
</tbody><tbody data-step="1">
<tr><td>Frameshift</td><td>insertion or deletion of 1 or 2 letters (not a multiple of 3)</td><td>wrong amino acids after the change, then an early stop</td><td>recessive</td><td>THE FAT CAT → THE ATC AT…</td></tr>
<tr><td>In-frame deletion</td><td>deletion of 3 letters</td><td>one amino acid missing</td><td>depends on the change</td><td>CFTR F508del (recessive)</td></tr>
<tr><td>Chromosome rearrangement</td><td>large deletion, inversion or translocation</td><td>genes lost, broken or moved</td><td>depends on the genes</td><td>wrong NHEJ joins after X-rays</td></tr>
</tbody><tbody data-step="2">
<tr><td>Loss-of-function (null)</td><td>any change that breaks the gene</td><td>less activity, or none</td><td>recessive: one working copy is enough</td><td>alkaptonuria (<i>HGD</i>), CF</td></tr>
<tr><td>Gain-of-function</td><td>usually missense</td><td>new or extra activity</td><td>dominant</td><td><i>FGFR3</i> in achondroplasia</td></tr>
<tr><td>Dominant negative</td><td>usually missense</td><td>a faulty chain spoils a group of chains</td><td>dominant</td><td>some p53 mutations</td></tr>
</tbody></table></div>`,
star:'The DNA change sets the protein change, and the protein change sets the dominance.',starStep:2},

/* 33 ─────────────────────────────── */
{sec:'7.7',title:'Summary',wide:true,steps:2,
text:`<div class="cols"><div data-step="0"><h3>Genes, enzymes and pathways</h3><ul>
<li>The Central Dogma: DNA → RNA (transcription) → protein (translation). Information never flows from protein back to a nucleic acid.</li>
<li>In 1908, Garrod connected an inherited disease, alkaptonuria, to one missing enzyme.</li>
<li>Beadle and Tatum screened <i>Neurospora</i> for auxotrophs and proposed one gene–one enzyme. Today the rule is one gene–one polypeptide, and some genes make only RNA.</li>
<li>Growth tests with intermediates give the order of the steps in a pathway. A compound rescues a mutant only if it comes after the block.</li>
<li>Forward genetics goes from a trait to its genes. Reverse genetics goes from a gene to its trait.</li>
</ul></div><div data-step="1"><h3>Mutations</h3><ul>
<li>Somatic mutations stay in one individual. Germline mutations pass to the offspring.</li>
<li>A mutation can be silent, missense, nonsense or a frameshift. Its effect can be a loss of function (usually recessive) or a gain of function (usually dominant).</li>
<li>Many mutations show no phenotype: silent and non-coding changes, redundancy, the environment, heterozygosity, and lethality before the trait shows. Mutant screens miss such mutations.</li>
<li>A person with cystic fibrosis has two mutant copies of <i>CFTR</i>, a chloride channel gene. F508del removes one amino acid, and the protein misfolds. Modulator drugs help the protein fold and open.</li>
</ul></div></div>`},

/* 34 ─────────────────────────────── */
{sec:'7.8',title:'Key Terms (1 of 2)',wide:true,steps:1,
text:`<div class="terms" data-step="0" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">
<div class="term"><b>Arginine</b>An amino acid. <i>Neurospora</i> makes it in a pathway of several steps.</div>
<div class="term"><b>Auxotroph</b>A mutant that cannot make one nutrient. It grows only when the medium supplies that nutrient.</div>
<div class="term"><b>Beadle &amp; Tatum</b>George Beadle and Edward Tatum. In 1941 they used <i>Neurospora</i> mutants to link genes to enzymes.</div>
<div class="term"><b>Central Dogma</b>The flow of genetic information: DNA → RNA → protein, never from protein back.</div>
<div class="term"><b>CFTR</b>The gene, on chromosome 7, for a chloride channel in epithelial cells. Its mutations cause CF.</div>
<div class="term"><b>Chromosome rearrangement</b>A large change in chromosome structure: a deletion, an inversion or a translocation.</div>
<div class="term"><b>Complete medium (CM)</b>Minimal medium plus amino acids, vitamins and other nutrients.</div>
<div class="term"><b>Cystic fibrosis (CF)</b>An autosomal recessive disease from two mutant <i>CFTR</i> copies. Thick mucus damages the lungs and other organs.</div>
<div class="term"><b>DNA repair system</b>The enzymes of a cell that find and fix damaged DNA.</div>
<div class="term"><b>Dominant negative</b>A mutation whose faulty product blocks the normal product. One mutant copy causes the trait.</div>
<div class="term"><b>Double-strand break</b>A cut through both DNA strands at one place, for example from X-rays.</div>
<div class="term"><b>Essential gene</b>A gene that an organism needs to survive.</div>
<div class="term"><b>Gain-of-function</b>A mutation that gives a gene a new or extra activity. It is usually dominant.</div>
<div class="term"><b>Genetic analysis</b>The study of a biological process through its mutants.</div>
<div class="term"><b>Genetic screen</b>A search through many individuals for the ones with a chosen phenotype.</div>
<div class="term"><b>Genetic screen for mutations</b>Treat a population with a mutagen, then search the offspring for mutants with a defect in one process.</div>
<div class="term"><b>Genotype</b>The alleles (the DNA) of an individual.</div>
<div class="term"><b>Germline cells</b>Gametes and the cells that make them. Their mutations pass to the offspring.</div>
</div>`},

/* 35 ─────────────────────────────── */
{sec:'7.8',title:'Key Terms (2 of 2)',wide:true,steps:1,
text:`<div class="terms" data-step="0" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">
<div class="term"><b>Intergenic region</b>DNA between genes.</div>
<div class="term"><b>Loss-of-function</b>A mutation that reduces or removes the function of a gene. It is usually recessive.</div>
<div class="term"><b>Metabolic pathway</b>A chain of chemical reactions in a cell. One enzyme does each step.</div>
<div class="term"><b>Minimal medium (MM)</b>Water, minerals, a simple sugar and only the vitamins that the species cannot make (biotin for <i>Neurospora</i>).</div>
<div class="term"><b>Mutant screen</b>A genetic screen: a search for mutants with a changed trait.</div>
<div class="term"><b><i>Neurospora crassa</i></b>An orange bread mould with haploid threads. Beadle and Tatum used it.</div>
<div class="term"><b>Non-homologous end joining</b>A repair method that joins two broken DNA ends directly. It often loses or adds a few letters.</div>
<div class="term"><b>Null</b>A mutation that removes all function of a gene: a complete loss-of-function.</div>
<div class="term"><b>One gene–one enzyme</b>The hypothesis that a different gene makes each enzyme of a pathway. Today: one gene–one polypeptide.</div>
<div class="term"><b>Phenotype</b>The traits of an individual.</div>
<div class="term"><b>Prototroph</b>A strain that makes all its own nutrients, so it grows on minimal medium.</div>
<div class="term"><b>Recessive lethal allele</b>An allele that kills an individual with two copies, often as an embryo.</div>
<div class="term"><b>Redundancy</b>Two genes do the same job, so the loss of one gene has no visible effect.</div>
<div class="term"><b>Rescue</b>An added compound (or gene) lets a mutant grow again.</div>
<div class="term"><b>Reverse transcription</b>An enzyme copies RNA into DNA. HIV uses this step.</div>
<div class="term"><b>Silent mutation</b>A DNA change that does not change the amino acid sequence.</div>
<div class="term"><b>Somatic cells</b>Body cells that do not make gametes. Their mutations do not pass to the children.</div>
<div class="term"><b>Transcription</b>RNA polymerase copies a gene into RNA.</div>
<div class="term"><b>Translation</b>A ribosome makes a polypeptide from the codons of an mRNA.</div>
</div>`},

/* 36 ─────────────────────────────── */
{sec:'7.9',title:'Check Your Understanding (1 of 4)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">1. A simplified arginine pathway: precursor → (enzyme A) → ornithine → (enzyme B) → citrulline → (enzyme C) → arginine. Three new arg<sup>−</sup> mutants grow as follows. #1: on MM + Cit and MM + Arg. #2: on MM + Arg only. #3: on MM + Orn, MM + Cit and MM + Arg. Which gene (A, B or C) is mutant in each?</div><button>Show answer</button><div class="a" hidden>A compound rescues a mutant only if it comes after the block. #1: Cit and Arg rescue it, but Orn does not. So the block is between Orn and Cit: gene B. #2: only Arg rescues it. So the block is between Cit and Arg: gene C. #3: all three rescue it. So the block is before Orn: gene A. In each mutant, the other two genes work.</div></div>
<div class="qa"><div class="q">2. Why does the minimal medium for <i>Neurospora</i> always contain the vitamin biotin?</div><button>Show answer</button><div class="a" hidden>Even wild-type <i>Neurospora</i> cannot make biotin, because it lacks the enzymes of the biotin pathway. Without biotin, no strain grows, so the test could not separate prototrophs from auxotrophs. Complete medium also contains biotin.</div></div>
<div class="qa"><div class="q">3. Garrod, and later Beadle and Tatum, showed that genes make enzymes. Do all genes make enzymes? Explain.</div><button>Show answer</button><div class="a" hidden>No. Many genes make proteins that are not enzymes. Examples are keratin (structure), haemoglobin (a carrier), CFTR (a channel) and proteins that control other genes. Other genes make no protein: they make rRNA, tRNA and other RNAs that work without translation. Also, one enzyme can contain chains from several genes, and one gene can make several proteins by alternative splicing.</div></div>
</div>`},

/* 37 ─────────────────────────────── */
{sec:'7.9',title:'Check Your Understanding (2 of 4)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">4. Most mutant proteins differ from the wild type by one amino acid. Explain how one amino acid change can cause (a) no loss of function, (b) a partial loss of function, (c) a complete loss of function. (d) Why do changes at different sites give the same complete loss?</div><button>Show answer</button><div class="a" hidden>(a) The protein does not need that exact amino acid. The site is on the surface, far from the active site, or the new amino acid is similar (lysine → arginine). (b) The amino acid helps the protein work at its best. The change alters the shape a little, so the protein works more slowly or is less stable. (c) The protein needs that exact amino acid. It is in the active site, or in the core, where the change stops correct folding. (d) A protein needs many specific amino acids (all of the active site and the folded core). A change at any one of them stops all function, so different changes give the same null phenotype.</div></div>
<div class="qa"><div class="q">5. Some mutants lose one enzyme activity. Does this mean that the mutant gene makes no protein?</div><button>Show answer</button><div class="a" hidden>No. The cell often still transcribes and translates the gene, and the cell makes the polypeptide. A changed amino acid makes it inactive. Example: the CFTR G551D protein reaches the membrane, but its gate does not open. Other mutations (nonsense, frameshift, a deleted gene) do stop the protein. Only a test for the protein itself can show which case applies.</div></div>
<div class="qa"><div class="q">6. Tryptophan synthase of <i>E. coli</i> has A chains of mass 29,500 and B chains of mass 49,500 (in daltons). The whole enzyme has mass 158,000. (a) An average amino acid has mass 110. How many amino acids are in each chain? (b) How many chains does the whole enzyme contain?</div><button>Show answer</button><div class="a" hidden>(a) A chain: 29,500 ÷ 110 ≈ 268 amino acids. B chain: 49,500 ÷ 110 = 450 amino acids. (b) One A plus one B is 29,500 + 49,500 = 79,000. 158,000 ÷ 79,000 = 2. So the enzyme has 4 chains: two A and two B. Check: 2 × 29,500 + 2 × 49,500 = 59,000 + 99,000 = 158,000. A protein with four chains of two kinds is a heterotetramer.</div></div>
</div>`},

/* 38 ─────────────────────────────── */
{sec:'7.9',title:'Check Your Understanding (3 of 4)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">7. In <i>Neurospora</i>, enzyme 1 (from <i>gene1</i><sup>+</sup>) changes white compound W into yellow Y, and enzyme 2 (from <i>gene2</i><sup>+</sup>) changes Y into orange O. None of the compounds is necessary for growth, and each reaction goes to completion if the enzyme is present. Give the colour of each strain on MM + W, MM + Y and MM + O.</div><button>Show answer</button><div class="a" hidden>The cell changes the added compound as far as its working enzymes go.
<table class="tbl"><thead><tr><th>Strain</th><th>MM + W</th><th>MM + Y</th><th>MM + O</th></tr></thead><tbody>
<tr><td>gene1<sup>+</sup> gene2<sup>+</sup></td><td>orange</td><td>orange</td><td>orange</td></tr>
<tr><td>gene1<sup>−</sup> gene2<sup>+</sup></td><td>white</td><td>orange</td><td>orange</td></tr>
<tr><td>gene1<sup>+</sup> gene2<sup>−</sup></td><td>yellow</td><td>yellow</td><td>orange</td></tr>
<tr><td>gene1<sup>−</sup> gene2<sup>−</sup></td><td>white</td><td>yellow</td><td>orange</td></tr></tbody></table>
The double mutant cannot change any compound, so each culture keeps the colour of the compound that it gets.</div></div>
<div class="qa"><div class="q">8. Scientists exposed a female fruit fly's father to a mutagen, but not the female herself. They then crossed her with a normal male. All the offspring looked normal, but there were twice as many daughters as sons. (a) Propose a hypothesis. (b) How can you test it?</div><button>Show answer</button><div class="a" hidden>(a) Her father gave her an X with a new recessive lethal mutation (l). She is X<sup>+</sup>X<sup>l</sup>. Half of her eggs carry X<sup>l</sup>. Daughters also get a normal X from their father, so all of them live: ½ of the offspring. Sons get only her X, so half of the sons die: ½ × ½ = ¼ of the offspring live as sons. Daughters : sons = ½ : ¼ = 2 : 1. (b) Living sons cannot carry X<sup>l</sup>, so a cross with males is impossible. Instead, cross many <b>F1</b> daughters (the first generation of offspring), one by one, with normal males. About half of the daughters are carriers, and their offspring show 2 daughters : 1 son. The other daughters give 1 : 1.</div></div>
</div>`},

/* 39 ─────────────────────────────── */
{sec:'7.9',title:'Check Your Understanding (4 of 4)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">9. Use genetics to learn how a plant makes the sweet smell of its flowers. The plant is diploid and pollinates itself. (a) How do you find genes for the scent? (b) A recessive mutant has fishy-smelling flowers, so you name it <i>fishy</i>. What is the normal job of the <i>fishy</i> gene? (c) Another recessive mutant has no scent, <i>nosmell</i>. What can its normal job be?</div><button>Show answer</button><div class="a" hidden>(a) Treat many seeds with a mutagen such as EMS. Grow them into M1 plants, and let each M1 plant pollinate itself. Smell the flowers of the M2 plants, where ¼ of the offspring of a carrier are homozygous mutants. Keep the plants with a changed scent. (b) The <i>fishy</i> gene is necessary for the sweet scent. A good hypothesis: its enzyme changes a fishy-smelling intermediate into the sweet compound. In the mutant, the intermediate collects, like the yellow compound before a block. (c) The phenotype alone does not place <i>nosmell</i>. Its enzyme can act before the fishy step (no fishy compound forms) or after it (an unscented intermediate collects). Or <i>nosmell</i> acts outside the pathway, for example to move the scent out of the cells.</div></div>
<div class="qa"><div class="q">10. You want only dominant mutations that change the scent. (a) Are dominant mutations more or less frequent than recessive ones? Why? (b) How does your screen change? (c) Which mutagen is better: one that makes point mutations, or one that makes large deletions?</div><button>Show answer</button><div class="a" hidden>(a) Much less frequent. Most mutations break a gene, and one working copy is usually enough, so most mutations are recessive. A dominant mutation must usually give a new or harmful activity, and there are few ways to do that. (b) A dominant mutation shows with one copy, so search the M1 plants directly. No self-pollination is necessary. (c) A point mutation mutagen. One changed amino acid can make an overactive or dominant negative protein. A large deletion removes the whole gene, so it usually causes only a loss of function.</div></div>
<div class="qa"><div class="q">11. You study how an organism makes the amino acid proline (Pro). (a) Design a mutant screen. (b) You find ten mutants that grow poorly without proline. How do you find the number of genes? (c) What is the phenotype of the F1 of two mutants if they are in different genes? (d) If they are in the same gene?</div><button>Show answer</button><div class="a" hidden>(a) Treat a wild-type (prototrophic) strain with a mutagen. Grow colonies, and test each one on MM and on MM + proline. Keep the colonies that grow only with proline: they are proline auxotrophs. (b) Do <b>complementation tests</b>: combine two mutants in one cell (a cross, or a fused cell in a fungus). If the cell grows without proline, each mutant supplies the working gene that the other lacks. Then the mutations are in different genes. Each set of mutants that fail to complement is one gene. Genetic mapping (different positions on the chromosomes) and growth tests with proline precursors (different responses) also help. (c) Wild type: the F1 grows on MM without proline. (d) Mutant: the F1 grows only with proline.</div></div>
</div>`},


]});
})();
