/* Chapter 4 · Pedigree Analysis — source: Hairdity.pdf ch. 4 (Singh, Introduction to Genetics, CC BY-NC-SA 4.0) */
(function(){
const H=window.HL;
const $s=()=>document.getElementById('stage');
/* ---- deck-local helpers ---- */
function drawA(a,o){H.D(a.firstChild,1,Object.assign({d:600},o));H.O(a.lastChild,1,Object.assign({d:200},o,{at:((o&&o.at)||0)+450}));}
function mkA(p,x1,y1,x2,y2,o){const a=H.arrow(p,x1,y1,x2,y2,o);H.O(a.lastChild,0,{d:0});return a;}
function pop(e,o){H.T(e,{s:1},Object.assign({d:700},o));H.O(e,1,Object.assign({d:300},o));}
function hide(e){H.T(e,{s:.001},{d:0});H.O(e,0,{d:0});}
function seq(seed){let s=seed||7;return()=>{s=(s*9301+49297)%233280;return s/233280}}
function hatchDefs(s){const d=H.E('defs',{},s);const p=H.E('pattern',{id:'hatch',patternUnits:'userSpaceOnUse',width:5,height:5,patternTransform:'rotate(45)'},d);
  H.E('line',{x1:0,y1:0,x2:0,y2:5,st:'stroke:var(--ink);stroke-width:1.8'},p);}
const T2=(e,x,y)=>H.T(e,{x,y},{d:0});

/* pedigree symbol: square = male, circle = female, diamond = unknown sex. state: 0 none, 1 affected, 'c' half (carrier), 'd' dot (X carrier) */
function sym(p,x,y,sex,o){o=o||{};const r=o.r||13,D=r*1.3;const G=H.g(p,{transform:`translate(${x},${y})`});const I=H.g(G);
  const shp=st=>sex==='m'?H.E('rect',{x:-r,y:-r,width:2*r,height:2*r,st},I):sex==='f'?H.E('circle',{r,st},I):H.E('path',{d:`M0,${-D} L${D},0 L0,${D} L${-D},0 Z`,st},I);
  shp('fill:var(--card)');
  if(o.hatch)G.hatch=shp('fill:url(#hatch)');
  G.full=shp('fill:var(--ink)');
  G.half=H.E('path',{d:sex==='m'?`M0,${-r} H${-r} V${r} H0 Z`:sex==='f'?`M0,${-r} A${r},${r} 0 0 0 0,${r} Z`:`M0,${-D} L${-D},0 L0,${D} Z`,st:'fill:var(--ink)'},I);
  G.dot=H.E('circle',{r:Math.max(3,r*.3),st:'fill:var(--ink)'},I);
  G.out=shp(`fill:none;stroke:var(--ink);stroke-width:${o.sw||2.2}`);
  if(o.dead)G.slash=H.E('line',{x1:-r*1.6,y1:r*1.6,x2:r*1.6,y2:-r*1.6,pathLength:1,cls:'draw',st:'stroke:var(--ink);stroke-width:2.2'},I);
  G.I=I;G.x=x;G.y=y;G.r=r;G.sex=sex;setSt(G,o.st||0,{d:0});return G;}
function setSt(G,st,o){o=Object.assign({d:500},o);H.O(G.full,st===1?1:0,o);H.O(G.half,st==='c'?1:0,o);H.O(G.dot,st==='d'?1:0,o);G.st=st;
  if(G.lab&&G.labIn)H.K(G.lab,{fill:st===1?'paper':'ink'},o);}
/* allele block: letter on a small tile. red tile = disease allele. x/y = X chromosome, y = Y chromosome (lower case = carries the trait allele) */
function blk(p,x,y,tok,o){o=o||{};const G=H.g(p);const bad=!!o.bad,W=o.w||13,Ht=o.h||15;
  const ch=tok==='x'?'X':tok==='y'?'Y':tok;const fill=bad?'var(--bad)':(ch==='Y'?'var(--wash)':'var(--card)');
  G.rect=H.E('rect',{x:x-W/2,y:y-Ht/2,width:W,height:Ht,rx:2.5,st:`fill:${fill};stroke:${o.stroke?H.C(o.stroke):'var(--ink)'};stroke-width:${o.sw||1.5}`},G);
  G.t=H.txt(G,x,y+(o.fs||10.5)*.37,ch,'',{'text-anchor':'middle',st:`font:700 ${o.fs||10.5}px var(--f-body);fill:${bad?'var(--paper)':'var(--ink)'}`});
  return G;}
/* pedigree kit. people: [id, sex, generation, x, state, alleles, label]; unions: [fatherId, motherId, [kidIds], consanguineous] */
function ped(p,o,people,unions){
  o=Object.assign({r:13,blocks:false,bad:'a',labs:'below',nx:24,sib:16,labLater:false},o);
  const r=o.r,F={p:{},u:[],o};const root=H.g(p);const Lg=H.g(root),Sg=H.g(root);F.root=root;F.L=Lg;
  const isBad=t=>t==='x'||t==='y'||t===o.bad;
  F.nums=o.num===false?[]:o.gy.map((y,i)=>{const t=H.txt(root,o.nx,y+5,['I','II','III','IV','V'][i],'lb',{'text-anchor':'middle',st:'font:700 16px var(--f-math);font-style:italic'});H.O(t,0,{d:0});return t});
  people.forEach(([id,sex,g,x,st,al,lab])=>{const y=o.gy[g];
    const G=sym(Sg,x,y,sex,{r,sw:o.sw});G.id=id;G.g=g;G.st0=st||0;G.tok=al?al.split(''):null;
    const L=lab===undefined?id:lab;
    if(o.labs&&L){if(o.labs==='in'){G.lab=H.txt(G,0,4.5,L,'',{'text-anchor':'middle',st:`font:700 ${o.lfs||12}px var(--f-body);fill:var(--ink)`});G.labIn=true}
      else G.lab=H.txt(G,0,r+(o.blocks&&G.tok?36:16),L,'lbs',{'text-anchor':'middle',st:o.lfs?`font-size:${o.lfs}px`:''});}
    hide(G.I);if(G.lab)H.O(G.lab,0,{d:0});
    G.bl=[];if(o.blocks&&G.tok)G.tok.forEach((t,j)=>{const b=blk(G,(j?1:-1)*7.5,r+12.5,t,{bad:isBad(t)});H.O(b,0,{d:0});G.bl.push(b)});
    F.p[id]=G;});
  unions.forEach(([a,b,kids,cons])=>{const A=F.p[a],B=F.p[b];const U={a:A,b:B,kids:(kids||[]).map(k=>F.p[k])};
    const xl=Math.min(A.x,B.x)+(o.lineGap!=null?o.lineGap:r),xr=Math.max(A.x,B.x)-(o.lineGap!=null?o.lineGap:r),y=A.y;U.mx=(A.x+B.x)/2;
    U.line=(cons?[-2.6,2.6]:[0]).map(dy=>H.E('path',{d:`M${xl},${y+dy} L${xr},${y+dy}`,pathLength:1,cls:'draw k',st:'stroke-width:2'},Lg));
    U.kids.forEach(K=>{const top=K.y-(K.sex==='u'?r*1.3:r);const yb=K.y-r-o.sib;K.par=[A,B];
      K.drop=H.E('path',{d:`M${U.mx},${y} L${U.mx},${yb} L${K.x},${yb} L${K.x},${top}`,pathLength:1,cls:'draw k',st:'stroke-width:2;stroke-linejoin:round'},Lg)});
    F.u.push(U);});
  Object.values(F.p).forEach(K=>{if(!K.par)return;K.bl.forEach((b,j)=>{const S=K.par[j];if(!S.tok)return;let k=S.tok.indexOf(K.tok[j]);if(k<0)k=j;if(S.tok[0]===S.tok[1])k=j;
    T2(b,S.x+(k?7.5:-7.5)-(K.x+(j?7.5:-7.5)),S.y-K.y);b.rect.style.stroke=S.sex==='m'?'var(--dad)':'var(--mom)';b.rect.style.strokeWidth='2.2'})});
  F.show=(id,q)=>{q=q||{};const G=F.p[id];pop(G.I,{at:q.at});if(G.lab&&!o.labLater)H.O(G.lab,1,{at:q.at});setSt(G,q.st!=null?q.st:G.st0,{d:300,at:q.at})};
  F.gen=(k,q)=>{q=q||{};const at=q.at||0;let ps=Object.values(F.p).filter(G=>G.g===k);if(q.only)ps=ps.filter(G=>q.only.includes(G.id));
    const kids=ps.filter(G=>G.drop);kids.forEach(G=>H.D(G.drop,1,{d:800,at}));const t0=at+(kids.length?600:0);
    ps.forEach((G,i)=>F.show(G.id,{at:t0+i*(q.stag!=null?q.stag:60)}));
    F.u.forEach(U=>{if(ps.includes(U.a)||ps.includes(U.b)){if(U.a.g===k)H.D(U.line,1,{d:600,at:t0+300})}});
    if(F.nums[k])H.O(F.nums[k],1,{at:t0});
    if(q.pass)ps.forEach(G=>{if(G.par)F.pass(G.id,{at:t0+(q.pAt!=null?q.pAt:700)});else F.al(G.id,{at:t0+400})});};
  F.pass=(id,q)=>{const at=(q&&q.at)||0;F.p[id].bl.forEach(b=>{H.O(b,1,{d:250,at});H.T(b,{x:0,y:0},{d:1100,at})})};
  F.al=(id,q)=>{F.p[id].bl.forEach(b=>H.O(b,1,Object.assign({d:400},q)))};
  F.st=(id,st,q)=>setSt(F.p[id],st,q);
  F.labsOn=q=>Object.values(F.p).forEach(G=>{if(G.lab)H.O(G.lab,1,q)});
  F.tag=(id,t,q)=>{q=q||{};const G=F.p[id];const e=H.txt(root,G.x+(q.dx!=null?q.dx:r+7),G.y+(q.dy!=null?q.dy:5),t,q.cls||'lb',{'text-anchor':q.anchor||'start',st:q.st||''});H.O(e,0,{d:0});return e};
  F.ring=(id,q)=>{q=q||{};const G=F.p[id];if(q.box){const bt=G.y+r+(G.bl.length?24:6);return H.E('rect',{x:G.x-22,y:G.y-r-6,width:44,height:bt-(G.y-r-6),rx:8,pathLength:1,cls:'draw',st:`fill:none;stroke:${H.C(q.c||'hi')};stroke-width:${q.w||3}`},root)}
    return H.E('circle',{cx:G.x,cy:G.y,r:q.R||r*1.75,pathLength:1,cls:'draw',st:`fill:none;stroke:${H.C(q.c||'hi')};stroke-width:${q.w||3};${q.dash?'stroke-dasharray:1':''}`},root)};
  F.all=q=>o.gy.forEach((_,k)=>F.gen(k,q));
  return F;}
/* chromosome bar with one gene band */
function cbar(p,x,y,len,tok,o){o=o||{};const G=H.g(p);
  G.bar=H.E('rect',{x:x-6,y:y-len/2,width:12,height:len,rx:6,st:`fill:var(--faint);stroke:${o.stroke?H.C(o.stroke):'var(--ink)'};stroke-width:${o.sw||1.6}`},G);
  if(tok)G.band=blk(G,x,y+(o.dy||0),tok,{bad:o.bad,w:o.bw||20,h:o.bh||16,fs:11});return G;}
/* a tag pill */
function pill(p,x,y,t,o){o=o||{};const G=H.g(p);const w=o.w||t.length*7+18;
  G.r=H.E('rect',{x:x-w/2,y:y-12,width:w,height:24,rx:12,st:`fill:${H.C(o.fill||'card')};stroke:${H.C(o.stroke||'ink')};stroke-width:1.6`},G);
  G.t=H.txt(G,x,y+4.5,t,'lbs',{'text-anchor':'middle',st:`font-weight:700;fill:${H.C(o.ink||'ink')}`});return G;}
function cross(p,x,y,h,o){o=o||{};const G=H.g(p);H.E('path',{d:`M${x-h},${y-h} L${x+h},${y+h} M${x+h},${y-h} L${x-h},${y+h}`,pathLength:1,cls:'draw',st:`fill:none;stroke:var(--bad);stroke-width:${o.w||4};stroke-linecap:round`},G);return G;}

deck({
docTitle:'Pedigree Analysis · Heredity Ch.4',
title:'Pedigree Analysis',
chapter:4,
eyebrow:'Heredity · Chapter 4 · Pedigree Analysis',
slides:[

/* 1 ─────────────────────────────── */
{sec:'4.1',title:'Pedigree Analysis',caption:'Filled = affected · red tile = disease allele · edge: blue = father, orange = mother',
text:`<p data-step="0">A <b>pedigree</b> (pedigree chart) is a family tree for one trait. The pedigree shows who in the family has the trait, across several generations.</p>
<p data-step="1"><b>DNA</b> is the molecule that holds the instructions of a cell, packed into <b>chromosomes</b>. A <b>gene</b> is a segment of DNA with the instructions for one product. Each person has two copies of most genes and gives one copy to each child.</p>
<p data-step="2">In a <b>controlled cross</b>, a scientist chooses which two individuals mate. Such crosses are not possible in humans. Humans also have few children, and one generation takes 25 to 30 years. So geneticists study real families.</p>
<p data-step="3">Most traits depend on many genes, so they show no simple pattern in a pedigree. A trait that depends on one gene shows a clear pattern. Huntington disease and cystic fibrosis are two examples.</p>
<p data-step="4">A <b>changed copy</b> of a gene has a change in its DNA. The pattern shows which chromosome carries the gene and how many changed copies cause the trait. Geneticists call this pattern the <b>mode of inheritance</b>.</p>`,
star:'A pedigree is a family tree for one trait.',starStep:1,
scene(H){const s=$s();
  const F=ped(s,{blocks:true,bad:'A',gy:[52,140,228]},[
    ['I-1','m',0,120,0,'aa'],['I-2','f',0,200,1,'Aa'],
    ['II-1','m',1,80,0,'aa'],['II-2','f',1,160,1,'aA'],['II-3','m',1,240,0,'aa'],
    ['III-1','f',2,160,1,'aA'],['III-2','m',2,240,0,'aa']],
    [['I-1','I-2',['II-1','II-2']],['II-3','II-2',['III-1','III-2']]]);
  H.T(F.root,{s:1.25},{d:0});
  const R=H.g(s);H.O(R,0,{d:0});T2(R,14,0);
  H.E('line',{x1:330,y1:30,x2:330,y2:330,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},R);
  H.txt(R,490,46,'ONE GENERATION','cap',{'text-anchor':'middle'});
  H.txt(R,356,86,'Fruit fly','lb');H.txt(R,356,104,'about 10 days','lbs');
  const rn=seq(11);const fd=[];for(let i=0;i<60;i++){const c=H.E('circle',{cx:458+(i%12)*13+rn()*4,cy:74+Math.floor(i/12)*12+rn()*4,r:3.6,st:'fill:var(--ink)'},R);H.O(c,0,{d:0});fd.push(c)}
  H.txt(R,534,150,'hundreds of offspring','lbs',{'text-anchor':'middle'});
  H.txt(R,356,206,'Human','lb');H.txt(R,356,224,'about 25 to 30 years','lbs');
  const hd=[0,1,2].map(i=>{const c=H.E('circle',{cx:500+i*22,cy:206,r:6,st:'fill:var(--ink)'},R);H.O(c,0,{d:0});return c});
  H.txt(R,522,238,'a few children','lbs',{'text-anchor':'middle'});
  H.txt(R,490,292,'No controlled crosses in humans','lb',{'text-anchor':'middle'});
  const rings=['I-2','II-2','III-1'].map(id=>F.ring(id,{box:1}));
  const pat=H.txt(s,200,390,'one gene: a clear pattern','lb',{'text-anchor':'middle'});H.O(pat,0,{d:0});
  const Q=H.g(s);H.O(Q,0,{d:0});T2(Q,14,0);H.txt(Q,490,110,'MODE OF INHERITANCE','cap',{'text-anchor':'middle'});
  [['1','Which chromosome','carries the gene?',150],['2','How many changed','copies cause the trait?',230]].forEach(([n,a,b,y])=>{
    H.E('circle',{cx:372,cy:y,r:14,st:'fill:var(--ink)'},Q);H.txt(Q,372,y+5,n,'lb',{'text-anchor':'middle',st:'fill:var(--paper)'});
    H.txt(Q,396,y-3,a,'lb');H.txt(Q,396,y+16,b,'lb')});
  return [
    ()=>{F.gen(0);F.gen(1,{at:900});F.gen(2,{at:1900})},
    ()=>{F.al('I-1');F.al('I-2');F.pass('II-1',{at:300});F.pass('II-2',{at:300});F.al('II-3',{at:300});F.pass('III-1',{at:1500});F.pass('III-2',{at:1500})},
    ()=>{H.O(R,1);fd.forEach((c,i)=>H.O(c,1,{d:200,at:300+i*18}));hd.forEach((c,i)=>H.O(c,1,{d:300,at:600+i*500}))},
    ()=>{H.D(rings,1,{d:900});rings.forEach((e,i)=>e.style.transitionDelay=i*250+'ms');H.O(pat,1,{at:700})},
    ()=>{H.O(R,0);H.O(Q,1,{at:400})},
  ];}},

/* 2 ─────────────────────────────── */
{sec:'4.2',title:'Pedigree Symbols',caption:'the standard symbols for a pedigree chart',
text:`<p data-step="0">A pedigree uses a standard set of symbols. A square is a male. A circle is a female. A diamond is a person of unknown sex.</p>
<p data-step="1">A filled symbol is an <b>affected</b> person: a person who shows the trait. An empty symbol is an unaffected person.</p>
<p data-step="2">A half-filled symbol is a <b>carrier</b>: a person with one changed copy of a gene but no trait. A carrier can give the changed copy to a child. A circle with a dot is a female carrier with the changed copy on an X chromosome. The X is one of the two sex chromosomes.</p>
<p data-step="3">A diagonal line through a symbol shows a person who has died. A hatched symbol shows a person who is affected by family history only.</p>
<p data-step="4">Twins hang from one point. A short bar joins the lines of identical twins. Fraternal twins have no bar.</p>`,
star:'Square = male, circle = female, filled = affected.',starStep:1,
scene(H){const s=$s();hatchDefs(s);
  const it=(x,y,sex,lab,o)=>{const G=H.g(s);const S=sym(G,x,y,sex,Object.assign({r:16},o));G.S=S;
    String(lab).split('|').forEach((l,i)=>H.txt(G,x,y+38+i*15,l,'lbs',{'text-anchor':'middle'}));H.O(G,0,{d:0});return G};
  const r0=[it(100,62,'m','male'),it(220,62,'f','female'),it(340,62,'u','unknown sex')];
  const r1=[it(100,152,'m','affected male',{st:1}),it(220,152,'f','affected female',{st:1})];r1.forEach(G=>T2(G,0,-90));
  const r2=[it(100,242,'m','carrier',{st:'c'}),it(220,242,'f','carrier',{st:'c'}),it(340,242,'f','carrier, changed|copy on an X',{st:'d'})];
  const r3=[it(100,332,'m','died',{dead:1}),it(220,332,'f','died',{dead:1}),it(340,332,'f','affected, by|family history',{hatch:1})];
  r3.forEach(G=>{if(G.S.slash)G.S.slash.style.strokeDashoffset=1});
  const tw=(y,ident,lab)=>{const G=H.g(s);const ax=525,ky=y+64;
    const L=H.E('path',{d:`M${ax},${y} L${ax-30},${ky-16} M${ax},${y} L${ax+30},${ky-16}`,pathLength:1,cls:'draw k',st:'stroke-width:2'},G);
    H.E('line',{x1:ax-40,y1:y-14,x2:ax+40,y2:y-14,st:'stroke:var(--ink);stroke-width:2'},G);H.E('line',{x1:ax,y1:y-14,x2:ax,y2:y,st:'stroke:var(--ink);stroke-width:2'},G);
    if(ident)H.E('line',{x1:ax-15,y1:y+24,x2:ax+15,y2:y+24,st:'stroke:var(--ink);stroke-width:2'},G);
    sym(G,ax-30,ky,'f',{r:15});sym(G,ax+30,ky,'f',{r:15});H.txt(G,ax,ky+36,lab,'lbs',{'text-anchor':'middle'});H.O(G,0,{d:0});G.L=L;return G};
  const T1=tw(82,1,'identical twins'),T2b=tw(250,0,'fraternal twins');
  H.E('line',{x1:432,y1:40,x2:432,y2:380,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  return [
    ()=>{r0.forEach((G,i)=>{H.O(G,1,{at:i*200});hide(G.S.I);pop(G.S.I,{at:i*200})})},
    ()=>{r1.forEach((G,i)=>{H.O(G,1,{d:300,at:i*200});H.T(G,{x:0,y:0},{d:1000,at:i*200});G.S.full.style.opacity=0;H.O(G.S.full,1,{d:600,at:900+i*200})})},
    ()=>{r2.forEach((G,i)=>{H.O(G,1,{at:i*250})})},
    ()=>{r3.forEach((G,i)=>{H.O(G,1,{at:i*250});if(G.S.slash)H.D(G.S.slash,1,{d:600,at:300+i*250})})},
    ()=>{[T1,T2b].forEach((G,i)=>{H.O(G,1,{at:i*400});H.D(G.L,1,{d:800,at:i*400})})},
  ];}},

/* 3 ─────────────────────────────── */
{sec:'4.2',title:'Lines, Generations and Numbers',caption:'a four-generation example family',
text:`<p data-step="0">A horizontal line between a male and a female is a <b>mating line</b>. Where possible, the male is on the left.</p>
<p data-step="1">A vertical line drops from the mating line to a horizontal <b>sibship line</b>. The children of the couple hang from it in birth order. The oldest child is at the left and the youngest is at the right.</p>
<p data-step="2">Two mating lines show a <b>consanguineous mating</b>: a mating between close relatives. Here two first cousins have children.</p>
<p data-step="3">Roman numerals (I, II, III) number the generations from the top. Arabic numbers (1, 2, 3) number the people in each generation from left to right. So II-3 is the third person in generation II.</p>
<p data-step="4">The <b>proband</b> (or propositus) is the affected person who first brings the family to a geneticist. An arrow points to the proband.</p>
<p data-step="5">The <b>consultand</b> is an unaffected person who asks for advice. <b>Genetic counselling</b> uses the pedigree to tell a family the probability that a child inherits a disease.</p>`,
star:'Generation in Roman numerals, person in Arabic numbers: II-3.',starStep:3,
scene(H){const s=$s();
  const F=ped(s,{gy:[64,154,244,334],labLater:true},[
    ['I-1','m',0,280],['I-2','f',0,360],
    ['II-1','m',1,110],['II-2','f',1,190],['II-3','f',1,320],['II-4','m',1,450],['II-5','f',1,530],
    ['III-1','f',2,110],['III-2','m',2,240],['III-3','f',2,400],['III-4','m',2,530],
    ['IV-1','m',3,280,1],['IV-2','f',3,360]],
    [['I-1','I-2',['II-2','II-3','II-4']],['II-1','II-2',['III-1','III-2']],['II-4','II-5',['III-3','III-4']],['III-2','III-3',['IV-1','IV-2'],true]]);
  const c0=H.txt(s,320,42,'mating line','lbs',{'text-anchor':'middle'});
  const c1=H.txt(s,388,116,'sibship line','lbs',{'text-anchor':'middle'});
  const c2=H.txt(s,320,232,'cousins','lbs',{'text-anchor':'middle'});
  const rg=F.ring('II-3',{R:19});const c3=H.txt(s,320,404,'II-3 = generation II, person 3','lb',{'text-anchor':'middle'});
  const G=F.p['IV-1'];const ar=mkA(s,G.x-44,G.y+30,G.x-17,G.y+12,{w:2.2,h:8});const pl=H.txt(s,G.x-48,G.y+40,'proband','lb',{'text-anchor':'end'});
  const G2=F.p['IV-2'];const ar2=mkA(s,G2.x+44,G2.y+30,G2.x+17,G2.y+12,{w:2.2,h:8});const cl=H.txt(s,G2.x+48,G2.y+40,'consultand','lb');
  H.O([c0,c1,c2,c3,pl,cl],0,{d:0});
  return [
    ()=>{F.gen(0);H.O(c0,1,{at:900})},
    ()=>{F.gen(1);H.O(c1,1,{at:900})},
    ()=>{F.gen(2);H.O(c2,1,{at:1000})},
    ()=>{F.gen(3);H.O([c0,c1,c2],0);F.labsOn({at:900});H.D(rg,1,{d:800,at:1300});H.O(c3,1,{at:1500})},
    ()=>{drawA(ar);H.O(pl,1,{at:300})},
    ()=>{drawA(ar2);H.O(cl,1,{at:300})},
  ];}},

/* 4 ─────────────────────────────── */
{sec:'4.3',title:'Two Copies of Every Gene',caption:'Grey bar = chromosome · tile = gene · edge: blue = father, orange = mother',
text:`<p data-step="0">A body cell has two copies of most chromosomes and genes: one from the mother and one from the father. Most genes make a <b>protein</b>, a molecule that does one job in the cell.</p>
<p data-step="1">Different versions of one gene are <b>alleles</b>. A capital letter (A) and a small letter (a) name two alleles of one gene. The pair of alleles in a person is the <b>genotype</b>, for example AA, Aa or aa.</p>
<p data-step="2">A person with two identical alleles (AA or aa) is <b>homozygous</b>. A person with two different alleles (Aa) is <b>heterozygous</b> (a heterozygote). The trait that a person shows is the <b>phenotype</b>.</p>
<p data-step="3"><b>Meiosis</b> is the cell division that makes sperm cells and egg cells (<b>gametes</b>). Meiosis puts one copy of each gene into each gamete, at random. So an Aa parent makes A gametes and a gametes in equal numbers.</p>
<p data-step="4">A grid of all gamete combinations is a <b>Punnett square</b>. Two Aa parents give four equally likely combinations. The ratio 1 AA : 2 Aa : 1 aa means that, on average, 1 child in 4 is AA, 2 are Aa and 1 is aa.</p>`,
star:'One copy from the mother, one from the father.',starStep:0,
scene(H){const s=$s();
  const cellC=(x,y,r,lab)=>{const G=H.g(s);H.E('circle',{cx:x,cy:y,r,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},G);if(lab)H.txt(G,x,y-r-9,lab,'cap',{'text-anchor':'middle'});return G};
  cellC(90,98,50,'FATHER');cellC(90,262,50,'MOTHER');
  const lt=[];const B=(x,y,t,o)=>{const b=cbar(s,x,y,56,t,o);lt.push(b.band.t);return b};
  B(76,98,'A');B(104,98,'a');B(76,262,'A');B(104,262,'a');
  const gt=[H.txt(s,150,104,'Aa','mt',{st:'font-size:22px'}),H.txt(s,150,268,'Aa','mt',{st:'font-size:22px'})];
  const kid=H.g(s);const kc=H.E('circle',{cx:250,cy:180,r:48,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},kid);H.txt(kid,250,248,'CHILD','cap',{'text-anchor':'middle'});
  const kgt=H.txt(kid,304,186,'Aa','mt',{st:'font-size:22px'});
  const k1=cbar(s,236,180,56,'a',{stroke:'dad',sw:2.4}),k2=cbar(s,264,180,56,'A',{stroke:'mom',sw:2.4});lt.push(k1.band.t,k2.band.t);
  T2(k1,104-236,98-180);T2(k2,76-264,262-180);H.O([k1,k2,kid],0,{d:0});
  lt.forEach(t=>H.O(t,0,{d:0}));H.O([...gt,kgt],0,{d:0});
  // chips
  const ch=H.g(s);[['AA','homozygous',45],['Aa','heterozygous',150],['aa','homozygous',255]].forEach(([g,l,x])=>{blk(ch,x-9,368,g[0],{w:17,h:19,fs:11});blk(ch,x+9,368,g[1],{w:17,h:19,fs:11});H.txt(ch,x,398,l,'lbs',{'text-anchor':'middle'})});H.O(ch,0,{d:0});
  // gametes
  const gm=H.g(s);H.O(gm,0,{d:0});H.txt(gm,485,22,'SPERM (FROM FATHER)','cap',{'text-anchor':'middle'});H.txt(gm,330,122,'EGGS','cap',{'text-anchor':'middle'});
  const gp=[[430,58],[540,58],[330,160],[330,270]];gp.forEach(([x,y])=>H.E('circle',{cx:x,cy:y,r:22,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},gm));
  [[458,64],[568,64],[300,166],[300,276]].forEach(([x,y],i)=>H.txt(gm,x,y,'1/2','lbs',{'text-anchor':i<2?'start':'end',st:'font-weight:700'}));
  const src=[[76,98],[104,98],[76,262],[104,262]],gt2=['A','a','A','a'];
  const gb=gp.map(([x,y],i)=>{const b=cbar(s,x,y,30,gt2[i],{stroke:i<2?'dad':'mom',sw:2.2,bw:18,bh:15});T2(b,src[i][0]-x,src[i][1]-y);H.O(b,0,{d:0});return b});
  // punnett
  const grid=H.E('path',{d:'M375,105 H595 V325 H375 Z M485,105 V325 M375,215 H595',pathLength:1,cls:'draw k',st:'stroke-width:2'},s);
  const cells=[];[[0,0],[1,0],[0,1],[1,1]].forEach(([c,r])=>{const cx=[430,540][c],cy=[160,270][r];
    const a=blk(s,cx-11,cy-8,gt2[c],{w:20,h:22,fs:13,stroke:'dad',sw:2.2}),b=blk(s,cx+11,cy-8,gt2[2+r],{w:20,h:22,fs:13,stroke:'mom',sw:2.2});
    T2(a,gp[c][0]-(cx-11),gp[c][1]-(cy-8));T2(b,gp[2+r][0]-(cx+11),gp[2+r][1]-(cy-8));H.O([a,b],0,{d:0});
    const L=H.txt(s,cx,cy+30,[gt2[c],gt2[2+r]].sort().join(''),'lb',{'text-anchor':'middle'});H.O(L,0,{d:0});cells.push([a,b,L])});
  const rat=H.txt(s,485,356,'1 AA : 2 Aa : 1 aa','lb',{'text-anchor':'middle',st:'font-size:17px'}),rat2=H.txt(s,485,378,'each box: probability 1/4','lbs',{'text-anchor':'middle'});H.O([rat,rat2],0,{d:0});
  return [
    ()=>{H.O(kid,1,{d:600});[k1,k2].forEach((k,i)=>{H.O(k,1,{d:200,at:500});H.T(k,{x:0,y:0},{d:1200,at:500+i*200})})},
    ()=>{lt.forEach(t=>H.O(t,1,{d:500}));H.O([...gt,kgt],1,{at:300})},
    ()=>{H.O(ch,1)},
    ()=>{H.O([kid,k1,k2],0,{d:500});H.O(gm,1,{at:300});gb.forEach((b,i)=>{H.O(b,1,{d:200,at:500});H.T(b,{x:0,y:0},{d:1100,at:500+i*120})})},
    ()=>{H.D(grid,1,{d:900});cells.forEach(([a,b,L],i)=>{[a,b].forEach(e=>{H.O(e,1,{d:200,at:700+i*250});H.T(e,{x:0,y:0},{d:900,at:700+i*250})});H.O(L,1,{at:1500+i*250})});H.O([rat,rat2],1,{at:2600})},
  ];}},

/* 5 ─────────────────────────────── */
{sec:'4.3',title:'Why an Allele Is Recessive or Dominant',caption:'Protein bars are schematic · CFTR on chromosome 7 · HTT on chromosome 4',
text:`<p data-step="0">DNA is a chain of four chemical letters (A, C, G and T). A <b>mutation</b> is a change in the DNA. Many disease alleles are <b>broken copies</b>: changed copies that make no working protein.</p>
<p data-step="1">A cell with one working copy and one broken copy makes about half the normal amount of protein. For most proteins, half is enough. So the heterozygote is unaffected, and the broken allele is <b>recessive</b>: its trait shows only with two broken copies.</p>
<p data-step="2">Example: cystic fibrosis. The <i>CFTR</i> gene makes a chloride channel. Two broken copies cause thick, sticky mucus in the lungs. A carrier has no symptoms.</p>
<p data-step="3">A <b>dominant</b> allele causes its trait with one copy, often with a harmful protein that the working copy cannot stop. The <b>dominance</b> of an allele is whether it is dominant or recessive.</p>
<p data-step="4">Example: Huntington disease. The <i>HTT</i> gene has a repeat of three DNA letters, CAG, usually fewer than 27 times. With 40 or more repeats, the protein is harmful and slowly kills nerve cells in the brain.</p>`,
star:'Recessive: half is enough. Dominant: one copy is enough.',starStep:3,
scene(H){const s=$s();
  const hdA=H.txt(s,24,30,'BROKEN COPY · RECESSIVE','cap',{st:'fill:var(--ink)'}),cfA=H.txt(s,616,30,'','cap',{'text-anchor':'end'});
  const rows=[['AA',1,'unaffected'],['Aa',.5,'unaffected · carrier'],['aa',0,'affected']];
  const X0=150,BW=220,thr=X0+BW*.25;
  const R=rows.map(([g,f,v],i)=>{const y=76+i*44;const G=H.g(s);
    blk(G,42,y,g[0],{w:18,h:22,fs:13,bad:g[0]==='a'});blk(G,62,y,g[1],{w:18,h:22,fs:13,bad:g[1]==='a'});
    const a=mkA(G,82,y,118,y,{w:1.8,h:6});
    H.E('rect',{x:X0,y:y-9,width:BW,height:18,rx:4,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.4'},G);
    const bar=H.E('rect',{x:0,y:y-9,width:BW,height:18,rx:4,st:'fill:var(--good)'},G);H.T(bar,{x:X0,sx:.001},{d:0});
    const vt=H.txt(G,X0+BW+14,y+5,v,'lb',{st:f<.25?'fill:var(--bad)':''});H.O(vt,0,{d:0});H.O(G,0,{d:0});
    G.a=a;G.bar=bar;G.f=f;G.vt=vt;return G});
  const th=H.g(s);H.E('line',{x1:thr,y1:52,x2:thr,y2:166,st:'stroke:var(--ink);stroke-width:1.6;stroke-dasharray:4 4'},th);H.txt(th,thr,48,'enough','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(th,0,{d:0});
  const lbP=H.txt(s,X0+BW/2,186,'protein made','lbs',{'text-anchor':'middle'});H.O(lbP,0,{d:0});
  H.E('line',{x1:20,y1:204,x2:620,y2:204,st:'stroke:var(--faint);stroke-width:1.5'},s);
  const hdB=H.txt(s,24,230,'CHANGED COPY · DOMINANT','cap',{st:'fill:var(--ink)'});H.O(hdB,0,{d:0});
  const prot=(p,x,y,bad)=>bad?H.E('path',{d:`M${x-9},${y} l4,-8 l5,6 l5,-8 l4,10 l-4,8 l-5,-6 l-5,6 Z`,st:'fill:var(--bad);stroke:var(--ink);stroke-width:1'},p):H.E('circle',{cx:x,cy:y,r:7,st:'fill:var(--good);stroke:var(--ink);stroke-width:1'},p);
  const D=[['aa',0,'unaffected'],['Aa',1,'Huntington disease']].map(([g,b,v],i)=>{const y=268+i*44;const G=H.g(s);
    blk(G,42,y,g[0],{w:18,h:22,fs:13,bad:g[0]==='A'});blk(G,62,y,g[1],{w:18,h:22,fs:13});mkA(G,82,y,118,y,{w:1.8,h:6}).lastChild.style.opacity=1;G.querySelectorAll('.draw').forEach(e=>e.style.strokeDashoffset=0);
    const ps=[];for(let k=0;k<6;k++){const e=prot(G,X0+12+k*34,y,b&&k%2===1);ps.push(e)}
    const vt=H.txt(G,X0+BW+14,y+5,v,'lb',{st:b?'fill:var(--bad)':''});H.O(G,0,{d:0});G.ps=ps;return G});
  const cag=H.g(s);H.O(cag,0,{d:0});H.txt(cag,24,370,'HTT','lb',{st:'font-style:italic'});
  const boxes=[];for(let k=0;k<44;k++){const b=H.E('rect',{x:62+k*9.6,y:360,width:8.4,height:14,rx:1.5,st:`fill:${k<26?'var(--dad-tint)':k<39?'var(--hi)':'var(--bad)'};stroke:var(--ink);stroke-width:.8`},cag);H.O(b,0,{d:0});boxes.push(b)}
  const cnt=H.txt(cag,616,372,'','lb',{'text-anchor':'end'});
  const key=H.txt(cag,62,398,'one box = one CAG · blue: normal · yellow: in between · red: disease','lbs');
  return [
    ()=>{H.O(R[2],1);H.O(R[0],1);drawA(R[0].a);drawA(R[2].a);H.T(R[0].bar,{sx:1},{d:900,at:400});H.O(lbP,1);H.O(R[2].vt,1,{at:900})},
    ()=>{H.O(R[1],1);drawA(R[1].a);H.T(R[1].bar,{sx:.5},{d:900,at:400});H.O(th,1,{at:900});H.O([R[0].vt,R[1].vt],1,{at:1200})},
    ()=>{cfA.textContent='CFTR · CYSTIC FIBROSIS';R[2].vt.textContent='cystic fibrosis';H.K(hdA,{fill:'ink'})},
    ()=>{H.O(hdB,1);D.forEach((G,i)=>{H.O(G,1,{at:300+i*500})})},
    ()=>{H.O(cag,1);const p={set textContent(v){const n=Math.round(v);boxes.forEach((b,k)=>b.style.opacity=k<n?1:0);cnt.textContent=n+' repeats'}};p.textContent=20;H.count(p,20,44,{d:1800,at:400,fmt:v=>v})},
  ];}},

/* 6 ─────────────────────────────── */
{sec:'4.3',title:'Autosomes, X and Y',caption:'Karyotype photo: NHGRI, public domain, Wikimedia Commons · bars are schematic',
text:`<p data-step="0">A human body cell has 46 chromosomes in 23 pairs. Pairs 1 to 22 are the <b>autosomes</b>. They are the same in males and females. The last pair is the <b>sex chromosomes</b>.</p>
<p data-step="1">A female has two X chromosomes (XX). A male has one X and one Y (XY). The X carries about 800 genes that make proteins. The Y carries fewer than 100 different genes.</p>
<p data-step="2">A male has only one copy of most X genes, so he is <b>hemizygous</b> for them. One recessive allele on his X shows its trait, because he has no second copy.</p>
<p data-step="3">A father gives his X to every daughter and his Y to every son. So a father gives no X genes to a son.</p>
<p data-step="3" class="note">Exception: a few genes at the tips of the X and the Y are on both chromosomes.</p>
<p data-step="4">A mother gives one of her two X chromosomes to each child, daughter or son. Each of her X chromosomes has a probability of 1/2.</p>`,
star:'Father’s X → every daughter. Father’s Y → every son.',starStep:3,
scene(H){const s=$s();
  const im=H.g(s);H.E('image',{href:'@@asset:human-male-karyotype.jpg@@',x:105,y:20,width:430,height:337},im);
  const ann=H.g(s);H.E('ellipse',{cx:505,cy:310,rx:30,ry:34,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--mom);stroke-width:3.5'},ann);
  H.txt(ann,505,372,'X and Y: sex chromosomes','lb',{'text-anchor':'middle'});H.txt(ann,250,386,'pairs 1 to 22: autosomes','lb',{'text-anchor':'middle'});H.txt(ann,250,402,'a human male, 46 chromosomes','lbs',{'text-anchor':'middle'});H.O(ann,0,{d:0});
  const thl=H.txt(s,98,168,'46 chromosomes','lbs',{'text-anchor':'middle'});H.O(thl,0,{d:0});
  const fam=H.g(s);H.O(fam,0,{d:0});
  const Fa=sym(fam,300,66,'m',{r:16}),Mo=sym(fam,520,66,'f',{r:16});H.txt(fam,300,38,'FATHER','cap',{'text-anchor':'middle'});H.txt(fam,520,38,'MOTHER','cap',{'text-anchor':'middle'});
  H.E('line',{x1:316,y1:66,x2:504,y2:66,st:'stroke:var(--ink);stroke-width:2'},fam);
  const chr=(p,x,y,t,o)=>{o=o||{};const L=t==='Y'?24:48;const G=H.g(p);G.bar=H.E('rect',{x:x-7,y:y-L/2,width:14,height:L,rx:7,st:`fill:var(--faint);stroke:${o.stroke?H.C(o.stroke):'var(--ink)'};stroke-width:${o.sw||1.6}`},G);
    G.band=H.E('rect',{x:x-9,y:y-5,width:18,height:10,rx:2,st:'fill:var(--bad);opacity:0'},G);if(t!=='Y')G.band.setAttribute('y',y+4);
    H.txt(G,x,y+(t==='Y'?28:40),t,'lb',{'text-anchor':'middle'});return G};
  const fX=chr(fam,285,130,'X'),fY=chr(fam,315,130,'Y'),mX1=chr(fam,505,130,'X'),mX2=chr(fam,535,130,'X');
  const cF=H.txt(fam,300,200,'XY: one X','lb',{'text-anchor':'middle'}),cM=H.txt(fam,520,200,'XX: two X','lb',{'text-anchor':'middle'});
  const hemi=H.g(s);H.O(hemi,0,{d:0});H.txt(hemi,300,222,'hemizygous:','lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--bad)'});H.txt(hemi,300,238,'no second copy','lbs',{'text-anchor':'middle',st:'fill:var(--bad)'});
  const kids=H.g(s);H.O(kids,0,{d:0});
  H.E('path',{d:'M410,66 V258 M330,258 H490 M330,258 V276 M490,258 V276',st:'fill:none;stroke:var(--ink);stroke-width:2'},kids);
  const Da=sym(kids,330,292,'f',{r:16}),So=sym(kids,490,292,'m',{r:16});H.txt(kids,268,297,'daughter','lbs',{'text-anchor':'end'});H.txt(kids,552,297,'son','lbs');
  const dX1=chr(s,315,352,'X',{stroke:'dad',sw:2.6}),sY=chr(s,475,352,'Y',{stroke:'dad',sw:2.6}),dX2=chr(s,345,352,'X',{stroke:'mom',sw:2.6}),sX=chr(s,505,352,'X',{stroke:'mom',sw:2.6});
  dX1.band.style.opacity=1;
  T2(dX1,285-315,130-352);T2(sY,315-475,130-352);T2(dX2,505-345,130-352);T2(sX,535-505,130-352);H.O([dX1,sY,dX2,sX],0,{d:0});
  const half=H.txt(s,590,140,'1/2 each','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(half,0,{d:0});
  return [
    ()=>{H.O(ann,1,{at:300});H.D(ann.firstChild,1,{d:900,at:300})},
    ()=>{H.O(ann,0,{d:400});H.T(im,{x:-37,y:-1,s:.42},{d:1200});H.O(thl,1,{at:1000});H.O(fam,1,{at:800})},
    ()=>{H.O(fX.band,1);setSt(Fa,1,{at:400});H.O(hemi,1,{at:500})},
    ()=>{H.O(fX.band,1);setSt(Fa,1);H.O(hemi,1);H.O(kids,1);[dX1,sY].forEach((c,i)=>{H.O(c,1,{d:200,at:500+i*500});H.T(c,{x:0,y:0},{d:1200,at:500+i*500})})},
    ()=>{H.O(half,1);[dX2,sX].forEach((c,i)=>{H.O(c,1,{d:200,at:300+i*500});H.T(c,{x:0,y:0},{d:1200,at:300+i*500})});setSt(Da,'d',{at:1600})},
  ];}},

/* 7 ─────────────────────────────── */
{sec:'4.3',title:'Five Modes of Inheritance',caption:'Two facts about a gene give five modes · AD, AR, XD, XR and Y-linked',
text:`<p data-step="0">Two facts about a gene predict its pattern in a pedigree. The first fact is the chromosome that carries the gene. The second fact is the number of changed copies that cause the trait.</p>
<p data-step="1">A male has only one Y. So a gene on the Y always has one copy, and dominance does not matter. The combinations give five modes of inheritance. The five modes are <b>autosomal dominant (AD)</b>, <b>autosomal recessive (AR)</b>, <b>X-linked dominant (XD)</b>, <b>X-linked recessive (XR)</b> and <b>Y-linked</b>.</p>
<p data-step="2"><b>Assumption 1: complete penetrance.</b> Every person with the disease genotype shows the trait. The disease genotype is one copy of a dominant allele, or two copies of a recessive allele.</p>
<p data-step="3"><b>Assumption 2: the trait is rare.</b> A person who joins the family by marriage is a <b>married-in</b> person. Because the trait is rare, a married-in person has no disease allele.</p>
<p data-step="4">Three clues follow from the assumptions. An unaffected person has no copy of a dominant disease allele. An unaffected person can carry one copy of a recessive disease allele. A male with one X-linked recessive allele is affected.</p>`,
star:'Which chromosome × how many copies = the mode.',starStep:1,
scene(H){const s=$s();const C1=330,C2=510,ys=[100,174,248];
  const fr=H.g(s);H.O(fr,0,{d:0});
  H.txt(fr,C1,44,'ONE COPY','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});H.txt(fr,C1,60,'is enough · dominant','lbs',{'text-anchor':'middle'});
  H.txt(fr,C2,44,'TWO COPIES','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});H.txt(fr,C2,60,'needed · recessive','lbs',{'text-anchor':'middle'});
  [['Autosome','pairs 1–22'],['X chromosome','XX or XY'],['Y chromosome','males only']].forEach(([a,b],i)=>{const y=ys[i];
    H.txt(fr,92,y-2,a,'lb');H.txt(fr,92,y+15,b,'lbs');
    if(i===0){H.E('rect',{x:30,y:y-22,width:11,height:44,rx:5.5,st:'fill:var(--faint);stroke:var(--ink);stroke-width:1.5'},fr);H.E('rect',{x:48,y:y-22,width:11,height:44,rx:5.5,st:'fill:var(--faint);stroke:var(--ink);stroke-width:1.5'},fr)}
    else if(i===1){H.E('rect',{x:38,y:y-22,width:13,height:44,rx:6.5,st:'fill:var(--faint);stroke:var(--ink);stroke-width:1.5'},fr);H.txt(fr,68,y+5,'X','lb',{'text-anchor':'middle'})}
    else{H.E('rect',{x:38,y:y-12,width:13,height:24,rx:6.5,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},fr);H.txt(fr,68,y+5,'Y','lb',{'text-anchor':'middle'})}});
  const cell=(x,y,w,a,b)=>{const G=H.g(s,{transform:`translate(${x},${y})`});const I=H.g(G);
    H.E('rect',{x:-w/2,y:-28,width:w,height:56,rx:10,st:'fill:var(--card);stroke:var(--ink);stroke-width:2'},I);
    H.txt(I,0,2,a,'big',{'text-anchor':'middle',st:'font-size:24px'});H.txt(I,0,20,b,'lbs',{'text-anchor':'middle'});hide(I);G.I=I;return G};
  const cs=[cell(C1,ys[0],160,'AD','autosomal dominant'),cell(C2,ys[0],160,'AR','autosomal recessive'),cell(C1,ys[1],160,'XD','X-linked dominant'),cell(C2,ys[1],160,'XR','X-linked recessive'),cell((C1+C2)/2,ys[2],340,'Y','Y-linked · one copy, males only')];
  const card=(x,t,a,b)=>{const G=H.g(s);H.E('rect',{x,y:300,width:290,height:96,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},G);
    H.txt(G,x+16,326,t,'cap',{st:'fill:var(--ink)'});H.txt(G,x+16,352,a,'lb');H.txt(G,x+16,374,b,'lbs');H.O(G,0,{d:0});return G};
  const k1=card(18,'ASSUMPTION 1','genotype → trait, always','complete penetrance');
  const k2=card(328,'ASSUMPTION 2','married-in: no disease allele','the trait is rare');
  const badge=(x,y,n)=>{const G=H.g(s);H.E('circle',{cx:x,cy:y,r:12,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},G);H.txt(G,x,y+5,n,'lb',{'text-anchor':'middle',st:'fill:#16181d'});H.O(G,0,{d:0});return G};
  const bd=[badge(C1+80,ys[0]-28,'1'),badge(C2+80,ys[0]-28,'2'),badge(C2+80,ys[1]-28,'3')];
  return [
    ()=>{H.O(fr,1,{d:700})},
    ()=>{cs.forEach((G,i)=>pop(G.I,{at:i*220}))},
    ()=>{H.O(k1,1)},
    ()=>{H.O(k2,1)},
    ()=>{bd.forEach((G,i)=>H.O(G,1,{at:i*300}))},
  ];}},

/* 8 ─────────────────────────────── */
{sec:'4.3',title:'Autosomal Dominant (AD)',caption:'A = disease allele (red), a = normal allele',
text:`<p data-step="0">In <b>autosomal dominant (AD)</b> inheritance, the gene is on an autosome, and one changed copy causes the trait. Examples are Huntington disease, achondroplasia and some forms of polydactyly (extra fingers or toes). A is the disease allele.</p>
<p data-step="1">An affected parent (Aa) gives A to each child with a probability of 1/2. Sons and daughters have the same probability, because the gene is on an autosome.</p>
<p data-step="2">Each affected child has an affected parent, so the trait appears in every generation. An affected father can have an affected son. Such <b>male-to-male transmission</b> <b>rules out</b> (shows to be wrong) X-linked inheritance, because a father gives a son his Y.</p>
<p data-step="3">An unaffected person has no A allele. So an unaffected person cannot transmit the trait, and the trait does not skip a generation.</p>
<p data-step="4">AD diseases are rare, so almost every affected person is Aa. An Aa parent with an aa partner can, by chance, have three unaffected children: 1/2 × 1/2 × 1/2 = 1/8. The trait then stops in that branch.</p>`,
star:'AD: every generation, both sexes, father → son is possible.',starStep:2,
scene(H){const s=$s();
  const F=ped(s,{blocks:true,bad:'A',gy:[62,160,258]},[
    ['I-1','m',0,260,0,'aa'],['I-2','f',0,340,1,'Aa'],
    ['II-1','m',1,80,1,'aA'],['II-2','f',1,150,0,'aa'],['II-3','m',1,250,0,'aa'],['II-4','f',1,320,0,'aa'],['II-5','m',1,430,0,'aa'],['II-6','f',1,500,1,'aA'],['II-7','m',1,590,0,'aa'],
    ['III-1','m',2,80,1,'Aa'],['III-2','f',2,150,0,'aa'],['III-3','f',2,285,0,'aa'],['III-4','f',2,410,1,'aA'],['III-5','m',2,480,0,'aa'],['III-6','m',2,550,1,'aA']],
    [['I-1','I-2',['II-1','II-4','II-6','II-7']],['II-1','II-2',['III-1','III-2']],['II-3','II-4',['III-3']],['II-5','II-6',['III-4','III-5','III-6']]]);
  const t1=H.txt(s,372,40,'each child gets A: 1/2','lbs',{st:'font-weight:700'});
  const rM=[F.ring('II-1',{box:1}),F.ring('III-1',{box:1})];const t2=H.txt(s,80,340,'father → son','lb',{'text-anchor':'middle'});
  const rU=[F.ring('II-4',{box:1,c:'good'}),F.ring('III-3',{box:1,c:'good'})];const t3=H.txt(s,285,340,'no A: no trait','lb',{'text-anchor':'middle',st:'fill:var(--good)'});
  const eq=H.g(s);H.txt(eq,470,350,'3 children, none affected:','lbs',{'text-anchor':'middle'});H.txt(eq,470,376,'1/2 × 1/2 × 1/2 = 1/8','lb',{'text-anchor':'middle',st:'font-size:17px'});
  H.O([t1,t2,t3,eq],0,{d:0});
  return [
    ()=>{F.gen(0,{pass:true})},
    ()=>{F.gen(1,{pass:true});H.O(t1,1,{at:1600})},
    ()=>{H.O(t1,0);F.gen(2,{pass:true});H.D(rM,1,{d:800,at:2200});H.O(t2,1,{at:2400})},
    ()=>{H.D(rU,1,{d:800});H.O(t3,1,{at:400})},
    ()=>{H.O(eq,1)},
  ];}},

/* 9 ─────────────────────────────── */
{sec:'4.3',title:'Achondroplasia: Dominant and Recessive Lethal',caption:'Receptor and bones are schematic · FGFR3 is on chromosome 4',
text:`<p data-step="0"><b>Achondroplasia</b> is the most common form of short-limbed dwarfism. The <i>FGFR3</i> gene on chromosome 4 makes a receptor protein. A signal molecule (FGF) activates the receptor, and the active receptor slows the growth of long bones. So the receptor acts as a brake.</p>
<p data-step="1">Almost every case has the same one-letter DNA change in <i>FGFR3</i>. The change keeps the brake active, so the arm and leg bones grow less.</p>
<p data-step="2">One changed copy is enough to make the bones short, so achondroplasia is AD. A person with achondroplasia is Aa.</p>
<p data-step="3">Two changed copies (AA) stop bone growth so much that the baby usually dies soon after birth. So the A allele is dominant for short bones and <b>recessive lethal</b>: two copies cause death.</p>
<p data-step="4">Two parents with achondroplasia (Aa × Aa) have 1/4 AA, 1/2 Aa and 1/4 aa children. The AA babies die. So among the children who live, 2 in 3 have achondroplasia: 2/3.</p>`,
star:'One copy: short bones. Two copies: lethal.',starStep:3,
scene(H){const s=$s();
  const L=H.g(s);H.txt(L,24,30,'FGFR3 RECEPTOR','cap',{st:'fill:var(--ink)'});
  H.E('rect',{x:20,y:100,width:280,height:16,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.4'},L);H.txt(L,26,112,'cell membrane','lbs');
  const rec=(x,bad)=>{const G=H.g(s);H.E('rect',{x:x-6,y:82,width:12,height:48,rx:3,st:'fill:var(--dad-tint);stroke:var(--ink);stroke-width:1.6'},G);
    H.E('path',{d:`M${x-18},60 Q${x-18},84 ${x},84 Q${x+18},84 ${x+18},60`,st:'fill:var(--dad-tint);stroke:var(--ink);stroke-width:1.6'},G);
    if(bad)H.E('path',{d:`M${x},101 l3,6 l7,0 l-5,5 l2,7 l-7,-4 l-7,4 l2,-7 l-5,-5 l7,0 Z`,st:'fill:var(--bad);stroke:var(--ink);stroke-width:.8'},G);
    H.E('rect',{x:x-15,y:150,width:30,height:72,rx:4,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.6'},G);
    G.m=H.E('rect',{x:x-15,y:0,width:30,height:72,rx:4,st:`fill:var(--${bad?'bad':'mom'})`},G);H.T(G.m,{y:222,sy:.001},{d:0});
    H.txt(G,x,240,'brake','lbs',{'text-anchor':'middle'});H.txt(G,x,48,bad?'changed':'normal','lb',{'text-anchor':'middle',st:bad?'fill:var(--bad)':''});
    const ar=mkA(G,x,132,x,146,{w:1.6,h:5});G.ar=ar;H.O(G,0,{d:0});return G};
  const R0=rec(150,0),R1=rec(250,1);
  const gf=H.E('circle',{cx:100,cy:70,r:7,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.2'},s);H.O(gf,0,{d:0});
  const gfl=H.txt(s,100,92,'FGF signal','lbs',{'text-anchor':'middle'});H.O(gfl,0,{d:0});
  const lvl=(G,f,o)=>H.T(G.m,{y:222-72*f,sy:f},o);
  // bones
  const B=H.g(s);H.txt(B,330,34,'LONG BONE LENGTH','cap',{st:'fill:var(--ink)'});
  const bone=(y,g,Lb,v,bad)=>{const G=H.g(s);blk(G,345,y,g[0],{w:16,h:20,fs:12,bad:g[0]==='A'});blk(G,363,y,g[1],{w:16,h:20,fs:12,bad:g[1]==='A'});
    const x0=392;G.o=H.E('path',{d:`M${x0},${y} H${x0+Lb}`,pathLength:1,cls:'draw',st:'stroke:var(--ink);stroke-width:15;stroke-linecap:round'},G);
    G.i=H.E('path',{d:`M${x0},${y} H${x0+Lb}`,pathLength:1,cls:'draw',st:'stroke:var(--card);stroke-width:10;stroke-linecap:round'},G);
    G.v=H.txt(G,x0,y+28,v,'lbs',{st:`font-weight:700;${bad?'fill:var(--bad)':''}`});H.O(G,0,{d:0});return G};
  const b0=bone(78,'aa',200,'average length'),b1=bone(140,'Aa',120,'achondroplasia: short bones'),b2=bone(202,'AA',40,'lethal: usually dies soon after birth',1);
  // punnett row
  const P=H.g(s);H.O(P,0,{d:0});H.E('line',{x1:20,y1:256,x2:620,y2:256,st:'stroke:var(--faint);stroke-width:1.5'},P);
  H.txt(P,24,300,'Aa × Aa','mt',{st:'font-size:22px'});
  const gs=['AA','Aa','Aa','aa'],bx=[150,240,330,420];
  const box=gs.map((g,i)=>{const G=H.g(P);G.r=H.E('rect',{x:bx[i]-36,y:310,width:72,height:46,rx:8,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.8'},G);
    H.txt(G,bx[i],340,g,'lb',{'text-anchor':'middle',st:'font-size:17px'});H.txt(G,bx[i],300,'1/4','lbs',{'text-anchor':'middle'});return G});
  const X=cross(s,bx[0],333,20);
  const br=H.g(s);H.E('path',{d:`M${bx[1]-34},368 v8 H${bx[3]+34} v-8`,st:'fill:none;stroke:var(--ink);stroke-width:2'},br);H.txt(br,bx[2],396,'3 survivors · 2 are Aa','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(br,0,{d:0});
  const res=H.txt(s,555,346,'2/3','big',{'text-anchor':'middle',st:'font-size:44px'});H.O(res,0,{d:0});
  return [
    ()=>{H.O(R0,1);drawA(R0.ar,{at:900});H.O([gf,gfl],1,{at:200});H.O(gfl,0,{at:900});H.T(gf,{x:50},{d:900,at:400});lvl(R0,.45,{d:900,at:1100})},
    ()=>{H.O(R1,1);drawA(R1.ar,{at:500});lvl(R1,1,{d:1000,at:900})},
    ()=>{[b0,b1].forEach((G,i)=>{H.O(G,1,{at:i*500});H.D([G.o,G.i],1,{d:1100,at:200+i*500})})},
    ()=>{H.O(b2,1);H.D([b2.o,b2.i],1,{d:700,at:200})},
    ()=>{H.O(P,1);H.D(X.firstChild,1,{d:500,at:900});H.O(box[0],.45,{at:1200});[1,2].forEach(i=>H.K(box[i].r,{fill:'mom-tint'},{at:1500}));H.O(br,1,{at:1500});H.O(res,1,{at:2000})},
  ];}},

/* 10 ─────────────────────────────── */
{sec:'4.3',title:'Autosomal Recessive (AR)',caption:'a = disease allele (red) · half-filled = known carrier',
text:`<p data-step="0">In <b>autosomal recessive (AR)</b> inheritance, the gene is on an autosome. A person needs two broken copies to show the trait. Cystic fibrosis is an example. Here a is the disease allele.</p>
<p data-step="1">Two unaffected parents can have an affected child (aa). The child got one a from each parent, so both parents must be carriers (Aa). Unaffected parents with an affected child are the main sign of a recessive trait.</p>
<p data-step="2">Each child of two carriers is aa with a probability of 1/4. Sons and daughters have the same probability.</p>
<p data-step="3">Carriers show no trait, so the allele can pass unseen through several generations. The trait often skips generations, and an AR pedigree usually has fewer affected people than an AD pedigree.</p>
<p data-step="4">Close relatives share many alleles from a shared ancestor. First cousins share about 1 in 8 of their alleles. So in a consanguineous mating, both parents can carry the same rare allele, and AR diseases appear more often.</p>`,
star:'AR: unaffected parents + affected child = two carriers.',starStep:1,
scene(H){const s=$s();
  const F=ped(s,{blocks:true,bad:'a',gy:[62,160,258]},[
    ['I-1','m',0,260,0,'Aa'],['I-2','f',0,340,0,'Aa'],
    ['II-1','m',1,60,0,'AA'],['II-2','f',1,130,0,'aA'],['II-3','m',1,230,0,'AA'],['II-4','f',1,330,1,'aa'],['II-5','m',1,430,0,'Aa'],['II-6','f',1,500,0,'AA'],
    ['III-1','m',2,60,0,'Aa'],['III-2','f',2,130,0,'AA'],['III-3','f',2,430,0,'aA'],['III-4','m',2,500,0,'AA']],
    [['I-1','I-2',['II-2','II-3','II-4','II-5']],['II-1','II-2',['III-1','III-2']],['II-5','II-6',['III-3','III-4']]]);
  const rA=F.ring('II-4',{box:1});const t1=H.txt(s,372,40,'each child is aa: 1/4','lbs',{st:'font-weight:700'});H.O(t1,0,{d:0});
  const hid=['II-2','II-5','III-1','III-3'].map(id=>F.ring(id,{box:1,c:'muted',w:2}));hid.forEach(e=>{e.style.strokeDashoffset=0;e.style.strokeDasharray='5 4';H.O(e,0,{d:0})});
  const t3=H.txt(s,280,350,'dashed rings: hidden carriers (Aa)','lb',{'text-anchor':'middle'});H.O(t3,0,{d:0});
  const F2=ped(s,{blocks:true,bad:'a',gy:[56,146,236,326],num:false,labs:false,r:13},[
    ['a1','m',0,300,0,'Aa'],['a2','f',0,380,0,'AA'],
    ['b1','m',1,190,0,'AA'],['b2','f',1,260,0,'aA'],['b3','m',1,420,0,'aA'],['b4','f',1,490,0,'AA'],
    ['c1','m',2,260,0,'Aa'],['c2','f',2,420,0,'aA'],['d1','m',3,340,1,'aa']],
    [['a1','a2',['b2','b3']],['b1','b2',['c1']],['b3','b4',['c2']],['c1','c2',['d1'],true]]);
  const cap2=H.g(s);H.txt(cap2,340,26,'SHARED GRANDPARENTS','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});H.txt(cap2,340,224,'first cousins','lb',{'text-anchor':'middle'});H.txt(cap2,340,400,'both cousins carry the same a from one grandparent','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(cap2,0,{d:0});
  return [
    ()=>{F.gen(0,{pass:true})},
    ()=>{F.gen(1,{pass:true});H.D(rA,1,{d:800,at:2200});F.st('I-1','c',{at:2700});F.st('I-2','c',{at:2900})},
    ()=>{H.O(t1,1)},
    ()=>{H.O(t1,0);F.gen(2,{pass:true});H.O(hid,1,{d:600,at:2300});H.O(t3,1,{at:2600})},
    ()=>{H.O([t3,...hid,rA],0);H.O(F.root,0,{d:600});
      F2.gen(0,{pass:true,at:600});F2.gen(1,{pass:true,at:1300,stag:0});F2.gen(2,{pass:true,at:2300});F2.gen(3,{pass:true,at:3300});H.O(cap2,1,{at:4300})},
  ];}},

/* 11 ─────────────────────────────── */
{sec:'4.3',title:'PKU and Compound Heterozygotes',caption:'Photo: U.S. Air Force, SSgt Eric T. Sheler · public domain, Wikimedia Commons',
text:`<p data-step="0"><b>Phenylketonuria (PKU)</b> is an AR disease. An <b>enzyme</b> is a protein that makes one chemical reaction happen fast. The <i>PAH</i> gene on chromosome 12 makes the enzyme phenylalanine hydroxylase. The enzyme converts phenylalanine (Phe) into tyrosine (Tyr), two <b>amino acids</b> (building blocks of proteins).</p>
<p data-step="1">With two broken copies of <i>PAH</i>, the enzyme does not work. Phenylalanine collects in the blood. Without treatment, high phenylalanine harms the brain of the baby and causes intellectual disability.</p>
<p data-step="2">In many countries, a blood test from the heel of each newborn finds PKU early. A diet low in phenylalanine then prevents the brain damage.</p>
<p data-step="3">Scientists know more than 1,000 different disease alleles of <i>PAH</i>, each with a different DNA change. So most people with PKU have two different broken alleles. Such a person is a <b>compound heterozygote</b>.</p>
<p data-step="3" class="note">Earlobe attachment is not a one-gene trait. A 2017 study of about 75,000 people found 49 DNA regions that affect it.</p>`,
star:'PKU: no enzyme → Phe collects. Test at birth, treat with diet.',starStep:2,
scene(H){const s=$s();
  const ex=218,ey=108;
  const enz=H.g(s);const eb=H.E('path',{d:`M${ex+36},${ey-22} A42,42 0 1 0 ${ex+36},${ey+22} L${ex+6},${ey} Z`,st:'fill:var(--good);stroke:var(--ink);stroke-width:2'},enz);
  H.txt(enz,ex-6,ey+66,'PAH enzyme','lb',{'text-anchor':'middle'});
  const X=cross(s,ex-6,ey,22,{w:5});
  const phe=(x,y)=>{const G=H.g(s);H.E('circle',{cx:0,cy:0,r:13,st:'fill:var(--mom-tint);stroke:var(--ink);stroke-width:1.5'},G);H.txt(G,0,3.5,'Phe','',{'text-anchor':'middle',st:'font:700 9.5px var(--f-body);fill:var(--ink)'});T2(G,x,y);return G};
  const tyr=(x,y)=>{const G=H.g(s);H.E('rect',{x:-13,y:-12,width:26,height:24,rx:5,st:'fill:var(--dad-tint);stroke:var(--ink);stroke-width:1.5'},G);H.txt(G,0,3.5,'Tyr','',{'text-anchor':'middle',st:'font:700 9.5px var(--f-body);fill:var(--ink)'});T2(G,x,y);return G};
  const P0=[0,1,2].map(i=>phe(46,70+i*38)),T0=[0,1,2].map(i=>{const t=tyr(ex,ey);H.O(t,0,{d:0});return t});
  const rn=seq(5);const pile=[];for(let i=0;i<11;i++){const p=phe(36+(i%4)*36+rn()*6,52+Math.floor(i/4)*42+rn()*6);H.O(p,0,{d:0});pile.push(p)}
  H.O([enz],0,{d:0});H.O(P0,0,{d:0});
  // blood meter
  const M=H.g(s);H.E('rect',{x:372,y:40,width:34,height:140,rx:5,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.8'},M);
  const mf=H.E('rect',{x:372,y:0,width:34,height:140,rx:5,st:'fill:var(--bad)'},M);H.T(mf,{y:180,sy:.001},{d:0});
  H.txt(M,389,200,'blood Phe','lbs',{'text-anchor':'middle',st:'font-weight:700'});const ml=H.txt(M,418,64,'too high','lb',{st:'fill:var(--bad)'});H.O(M,0,{d:0});
  const setM=(f,o)=>H.T(mf,{y:180-140*f,sy:f},o);
  const ph=H.g(s);H.E('image',{href:'@@asset:pku-heel-prick.jpg@@',x:330,y:220,width:300,height:166},ph);H.txt(ph,480,405,'newborn heel-prick blood test','lbs',{'text-anchor':'middle'});H.O(ph,0,{d:0});
  const C=H.g(s);H.O(C,0,{d:0});H.txt(C,24,232,'TWO COPIES OF CHROMOSOME 12','cap',{st:'fill:var(--ink)'});
  [['from father','dad',262,112],['from mother','mom',326,196]].forEach(([l,c,y,mx])=>{
    H.E('rect',{x:24,y:y-8,width:270,height:16,rx:8,st:`fill:var(--faint);stroke:var(--${c});stroke-width:2.4`},C);
    H.E('rect',{x:96,y:y-10,width:124,height:20,rx:3,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},C);H.txt(C,158,y+4.5,'PAH','',{'text-anchor':'middle',st:'font:italic 700 11px var(--f-body);fill:var(--ink)'});
    H.E('rect',{x:mx-3,y:y-12,width:6,height:24,st:'fill:var(--bad)'},C);H.txt(C,24,y+28,l,'lbs')});
  H.txt(C,300,292,'two different','lbs',{'text-anchor':'end',st:'font-weight:700;fill:var(--bad)'});H.txt(C,300,307,'DNA changes','lbs',{'text-anchor':'end',st:'font-weight:700;fill:var(--bad)'});
  H.txt(C,24,388,'compound heterozygote','lb');H.txt(C,24,405,'no working enzyme → PKU','lbs');
  return [
    ()=>{H.O(enz,1);P0.forEach((p,i)=>{H.O(p,1,{at:i*150});H.T(p,{x:ex-10,y:ey},{d:900,at:500+i*500});H.O(p,0,{d:200,at:1300+i*500});
      H.O(T0[i],1,{d:200,at:1350+i*500});H.T(T0[i],{x:336,y:70+i*38},{d:800,at:1400+i*500})})},
    ()=>{T0.forEach(t=>H.O(t,0));H.K(eb,{fill:'faint'});H.D(X.firstChild,1,{d:500});pile.forEach((p,i)=>H.O(p,1,{d:300,at:400+i*90}));H.O(M,1);setM(.92,{d:1500,at:400});ml.textContent='too high'},
    ()=>{H.O(ph,1);setM(.3,{d:1500,at:600});ml.textContent='kept low';H.K(ml,{fill:'good'},{at:600});pile.slice(3).forEach(p=>H.O(p,0,{at:600}))},
    ()=>{H.O(C,1)},
  ];}},

/* 12 ─────────────────────────────── */
{sec:'4.3',title:'X-Linked Recessive (XR)',caption:'red X = X with the disease allele · dot = female carrier',
text:`<p data-step="0">In <b>X-linked recessive (XR)</b> inheritance, the gene is on the X chromosome, and the disease allele is recessive. A female needs two disease alleles. A male needs only one, because he is hemizygous.</p>
<p data-step="1">An affected father gives his X to every daughter, so all his daughters are carriers. He gives his Y to every son, so no son gets the allele from him.</p>
<p data-step="2">A carrier mother gives her disease X to each child with a probability of 1/2. So each son is affected with a probability of 1/2. Each daughter is a carrier with a probability of 1/2.</p>
<p data-step="3">The allele passes from an affected man, through his carrier daughter, to her son. So the trait often skips a generation. Most affected people are male, because a male needs only one disease allele. Example: red-green colour blindness affects about 8 in 100 men of northern European ancestry. Fewer than 1 in 100 women have it.</p>
<p data-step="4">An affected daughter gets a disease X from her father, so her father must be affected. An affected daughter of an unaffected father rules out XR.</p>`,
star:'XR: mostly males · grandfather → carrier daughter → grandson.',starStep:3,
scene(H){const s=$s();
  const F=ped(s,{blocks:true,gy:[62,160,258]},[
    ['I-1','m',0,310,1,'xY'],['I-2','f',0,390,0,'XX'],
    ['II-1','m',1,80,0,'XY'],['II-2','f',1,150,'d','xX'],['II-3','m',1,260,0,'YX'],['II-4','f',1,370,'d','xX'],['II-5','m',1,450,0,'XY'],['II-6','m',1,550,0,'YX'],
    ['III-1','m',2,80,1,'Yx'],['III-2','f',2,150,0,'XX'],['III-3','f',2,370,'d','Xx'],['III-4','m',2,450,0,'YX'],['III-5','m',2,530,1,'Yx']],
    [['I-1','I-2',['II-2','II-3','II-4','II-6']],['II-1','II-2',['III-1','III-2']],['II-5','II-4',['III-3','III-4','III-5']]]);
  const t1=H.txt(s,626,40,'daughters: all carriers · sons: none affected','lbs',{'text-anchor':'end',st:'font-weight:700'});
  const t2=H.txt(s,600,232,'each son: 1/2','lbs',{'text-anchor':'end',st:'font-weight:700'});
  const path=['I-1','II-2','III-1'].map(id=>F.ring(id,{box:1}));
  const t3=H.txt(s,24,348,'grandfather → carrier daughter → grandson','lb');
  const mini=H.g(s);sym(mini,420,350,'m',{r:11});sym(mini,480,350,'f',{r:11});sym(mini,450,392,'f',{r:11,st:1});
  H.E('path',{d:'M431,350 H469 M450,350 V381',st:'fill:none;stroke:var(--ink);stroke-width:2'},mini);H.txt(mini,500,382,'→ not XR','lb',{st:'fill:var(--bad)'});
  H.O([t1,t2,t3,mini],0,{d:0});
  return [
    ()=>{F.gen(0,{pass:true})},
    ()=>{F.gen(1,{pass:true});H.O(t1,1,{at:2000})},
    ()=>{H.O(t1,0);F.gen(2,{pass:true});H.O(t2,1,{at:2200})},
    ()=>{H.O(t2,0);path.forEach((e,i)=>H.D(e,1,{d:700,at:i*600}));H.O(t3,1,{at:1600})},
    ()=>{H.O(t3,0);H.D(path,0,{d:300});H.O(mini,1)},
  ];}},

/* 13 ─────────────────────────────── */
{sec:'4.3',title:'Hemophilia in Queen Victoria’s Family',caption:'Tree: Shakko, CC BY-SA 4.0, Wikimedia Commons · badges added',
text:`<p data-step="0"><b>Hemophilia</b> is an XR disease: the blood clots slowly, so a small cut bleeds for a long time. <b>Hemophilia A</b> is the result of a broken <i>F8</i> gene, which makes clotting factor VIII. Hemophilia B is the result of a broken <i>F9</i> gene, which makes clotting factor IX. Both genes are on the X.</p>
<p data-step="1">Queen Victoria (1819–1901) was a carrier. No one in her family before her had hemophilia, so her allele was probably a new mutation. Her son Leopold had hemophilia. Her daughters Alice and Beatrice were carriers.</p>
<p data-step="2">Leopold gave his X to his daughter, Alice of Albany, so she was a carrier. Her son Rupert had hemophilia.</p>
<p data-step="3">Alice’s daughters Irene and Alexandra and Beatrice’s daughter Victoria Eugenie were carriers. By marriage, they became members of the royal families of Prussia, Russia and Spain. Several of their sons had hemophilia, for example Alexei, son of the last emperor of Russia.</p>
<p data-step="4">In 2009, scientists read DNA from the remains of the Russian royal family. The disease allele was a change in <i>F9</i>. So the royal disease was hemophilia B. Hemophilia A and B have the same XR pattern, because both genes are on the X.</p>`,
star:'An affected man’s daughters are all carriers.',starStep:2,
scene(H){const s=$s();const k=468.7/1280;
  H.E('image',{href:'@@asset:victoria-haemophilia-tree.jpg@@',x:0,y:0,width:468.7,height:420},s);
  const P=(ix,iy)=>[ix*k,iy*k];
  const box=(ix,iy,c)=>{const [x,y]=P(ix,iy);return H.E('rect',{x:x-23,y:y-48,width:46,height:96,rx:3,pathLength:1,cls:'draw',st:`fill:none;stroke:var(--${c||'hi'});stroke-width:3.5`},s)};
  const badge=(ix,iy,st,sex)=>{const [x,y]=P(ix,iy);const G=sym(s,x+15,y-39,sex,{r:7,st,sw:1.6});G.I.firstChild.style.fill='#fff';[G.full,G.dot].forEach(e=>e.style.fill='#16181d');G.out.style.stroke='#16181d';hide(G.I);return G};
  const car=(ix,iy)=>badge(ix,iy,'d','f'),aff=(ix,iy)=>badge(ix,iy,1,'m');
  const Vic=car(72,140),Leo=aff(628,370),Ali=car(72,370),Bea=car(880,370);
  const AoA=car(628,676),Rup=aff(628,1008);
  const rest=[car(72,676),car(367,676),car(880,676),aff(219,676),aff(1046,676),aff(1212,676),aff(72,1008),aff(219,1008),aff(367,1008),aff(880,1008),aff(1046,1008)];
  const xb=blk(s,0,0,'x',{bad:1,w:16,h:18,fs:12});const xp=[P(640,320),P(640,600),P(640,940)];T2(xb,xp[0][0]+18,xp[0][1]);H.O(xb,0,{d:0});
  const R=H.g(s);H.E('rect',{x:478,y:12,width:156,height:396,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},R);
  H.txt(R,556,38,'HEMOPHILIA','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  const k1=H.g(R);H.E('rect',{x:486,y:50,width:140,height:56,rx:8,st:'fill:#fff;stroke:#16181d;stroke-width:1.2'},k1);[[64,'f','d','carrier'],[90,'m',1,'affected male']].forEach(([y,sx,st,l])=>{const G=sym(k1,500,y,sx,{r:8,st,sw:1.6});G.I.firstChild.style.fill='#fff';[G.full,G.dot].forEach(e=>e.style.fill='#16181d');G.out.style.stroke='#16181d';H.txt(k1,516,y+5,l,'lbs',{st:'fill:#16181d'})});
  const g0=H.g(R);[['F8 → factor VIII','hemophilia A'],['F9 → factor IX','hemophilia B']].forEach(([a,b],i)=>{H.txt(g0,494,140+i*44,a,'lb');H.txt(g0,494,157+i*44,b,'lbs')});H.txt(g0,494,222,'both genes on the X','lbs',{st:'font-weight:700'});
  const cnt=H.g(R);H.txt(cnt,494,258,'affected: 10','lb');H.txt(cnt,494,275,'all male','lbs');H.O(cnt,0,{d:0});
  const dna=H.g(R);H.E('line',{x1:494,y1:298,x2:618,y2:298,st:'stroke:var(--faint);stroke-width:1.5'},dna);H.txt(dna,494,322,'2009 DNA test','lb');H.txt(dna,494,340,'royal allele: F9','lbs');H.txt(dna,494,356,'= hemophilia B','lbs',{st:'font-weight:700;fill:var(--bad)'});H.O(dna,0,{d:0});
  const bl=[box(628,370,'bad'),box(628,676),box(628,1008,'bad')];
  return [
    ()=>{},
    ()=>{[Vic,Leo,Ali,Bea].forEach((G,i)=>pop(G.I,{at:i*350}))},
    ()=>{H.D(bl,1,{d:700});bl.forEach((e,i)=>e.style.transitionDelay=i*500+'ms');H.O(xb,1,{at:300});H.T(xb,{x:xp[1][0]+18,y:xp[1][1]},{d:1000,at:600});H.T(xb,{x:xp[2][0]+18,y:xp[2][1]},{d:1000,at:1700});
      pop(AoA.I,{at:1500});pop(Rup.I,{at:2600});H.O(xb,0,{d:400,at:2900})},
    ()=>{H.O(xb,0);H.D(bl,0,{d:400});rest.forEach((G,i)=>pop(G.I,{at:i*150}));H.O(cnt,1,{at:1800})},
    ()=>{H.O(dna,1)},
  ];}},

/* 14 ─────────────────────────────── */
{sec:'4.3',title:'X-Linked Dominant (XD)',caption:'red X = X with the dominant disease allele (for example PHEX)',
text:`<p data-step="0">In <b>X-linked dominant (XD)</b> inheritance, the gene is on the X chromosome. One changed copy causes the trait in both sexes. Example: X-linked hypophosphatemia. One broken <i>PHEX</i> copy lowers phosphate, a mineral for bones, so the legs bend.</p>
<p data-step="1">An affected mother is usually heterozygous. As in AD, she gives her changed X to each son or daughter with a probability of 1/2.</p>
<p data-step="2">An affected father gives his X to every daughter and his Y to every son. So all his daughters are affected, and none of his sons.</p>
<p data-step="3">A female has two X chromosomes and a male has one, so an XD trait affects about twice as many females. Females often have milder symptoms, because each cell uses only one X.</p>
<p data-step="4">Two observations rule out XD: an affected father with an affected son, or an affected father with an unaffected daughter. Without such families, XD and AD can look the same.</p>
<p data-step="4" class="note">Fragile X does not follow the father rule. Its repeat grows to full size mainly through mothers.</p>`,
star:'XD: affected father → all daughters, no sons.',starStep:2,
scene(H){const s=$s();
  const F=ped(s,{blocks:true,gy:[62,160,258]},[
    ['I-1','m',0,240,0,'XY'],['I-2','f',0,320,1,'xX'],
    ['II-1','m',1,60,0,'XY'],['II-2','f',1,130,0,'XX'],['II-3','f',1,230,1,'Xx'],['II-4','m',1,330,0,'YX'],['II-5','m',1,430,1,'Yx'],['II-6','f',1,500,0,'XX'],
    ['III-1','m',2,60,0,'YX'],['III-2','f',2,130,0,'XX'],['III-3','f',2,400,1,'xX'],['III-4','m',2,460,0,'YX'],['III-5','f',2,520,1,'xX'],['III-6','m',2,580,0,'YX']],
    [['I-1','I-2',['II-2','II-3','II-4','II-5']],['II-1','II-2',['III-1','III-2']],['II-5','II-6',['III-3','III-4','III-5','III-6']]]);
  const t1=H.txt(s,352,40,'each child: 1/2, sons and daughters','lbs',{st:'font-weight:700'});
  const t2=H.txt(s,490,340,'all daughters · no sons','lb',{'text-anchor':'middle'});
  const rD=F.ring('II-5',{box:1});
  const bars=H.g(s);H.txt(bars,24,348,'females','lbs',{st:'font-weight:700'});H.txt(bars,24,378,'males','lbs',{st:'font-weight:700'});
  const bF=H.E('rect',{x:84,y:336,width:160,height:16,rx:3,st:'fill:var(--ink)'},bars),bM=H.E('rect',{x:84,y:366,width:80,height:16,rx:3,st:'fill:var(--muted)'},bars);
  H.txt(bars,252,349,'about 2×','lbs',{st:'font-weight:700'});H.T(bF,{sx:.001},{d:0});H.T(bM,{sx:.001},{d:0});[bF,bM].forEach(b=>b.style.transformOrigin='84px 0px');
  const mini=(x,kidSex,kidSt,lab)=>{const G=H.g(s);sym(G,x,346,'m',{r:10,st:1});sym(G,x+50,346,'f',{r:10});sym(G,x+25,390,kidSex,{r:10,st:kidSt});
    H.E('path',{d:`M${x+10},346 H${x+40} M${x+25},346 V380`,st:'fill:none;stroke:var(--ink);stroke-width:2'},G);H.txt(G,x+70,384,lab,'lbs',{st:'font-weight:700;fill:var(--bad)'});H.O(G,0,{d:0});return G};
  const n1=mini(300,'m',1,'not XD'),n2=mini(450,'f',0,'not XD');
  H.O([t1,t2,bars],0,{d:0});
  return [
    ()=>{F.gen(0,{pass:true})},
    ()=>{F.gen(1,{pass:true});H.O(t1,1,{at:2000})},
    ()=>{H.O(t1,0);F.gen(2,{pass:true});H.D(rD,1,{d:800,at:2300});H.O(t2,1,{at:2400})},
    ()=>{H.O(t2,0);H.O(bars,1);H.T(bF,{sx:1},{d:900,at:200});H.T(bM,{sx:1},{d:900,at:400})},
    ()=>{H.O(bars,0,{d:300});H.O(n1,1,{d:600,at:300});H.O(n2,1,{d:600,at:700})},
  ];}},

/* 15 ─────────────────────────────── */
{sec:'4.3',title:'Y-Linked Inheritance',caption:'Genghis Khan, Yuan dynasty album · public domain, Wikimedia Commons',
text:`<p data-step="0">In <b>Y-linked</b> inheritance, the gene is on the Y chromosome. Only males have a Y, so only males are affected.</p>
<p data-step="1">A father gives his Y to every son and to no daughter. So an affected father has only affected sons, and the trait passes from father to son in every generation.</p>
<p data-step="2">The Y carries fewer than 100 different genes, so Y-linked traits are rare. One Y gene, <i>SRY</i>, starts male development in the <b>embryo</b>, the unborn baby in its first weeks.</p>
<p data-step="3">Hairy ear rims in some Indian families were once a common example of a Y-linked trait. A 2004 DNA study found the trait in Indian men with different types of Y chromosome. So the gene for the trait is not on the Y.</p>
<p data-step="4">Most of the Y passes unchanged from father to son. So DNA differences on the Y (<b>Y-chromosome DNA polymorphisms</b>) trace male family lines. One Y type is in about 8 in 100 men in a large region of Asia. A 2003 study proposed that this Y type descends from Genghis Khan (about 1162–1227) and his male relatives.</p>`,
star:'Y-linked: father → every son, never a daughter.',starStep:1,
scene(H){const s=$s();
  const F=ped(s,{blocks:true,gy:[62,160,258]},[
    ['I-1','m',0,155,1,'Xy'],['I-2','f',0,235,0,'XX'],
    ['II-1','m',1,70,1,'yX'],['II-2','f',1,136,0,'XX'],['II-3','m',1,230,1,'yX'],['II-4','f',1,320,0,'XX'],['II-5','m',1,390,0,'XY'],
    ['III-1','m',2,70,1,'yX'],['III-2','f',2,136,0,'XX'],['III-3','f',2,320,0,'XX'],['III-4','m',2,390,0,'YX']],
    [['I-1','I-2',['II-1','II-3','II-4']],['II-1','II-2',['III-1','III-2']],['II-5','II-4',['III-3','III-4']]]);
  H.E('line',{x1:428,y1:20,x2:428,y2:400,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  const G2=H.g(s);H.txt(G2,528,42,'GENES ON EACH','cap',{'text-anchor':'middle'});
  const bX=H.E('rect',{x:470,y:70,width:30,height:180,rx:15,st:'fill:var(--faint);stroke:var(--ink);stroke-width:1.8'},G2),bY=H.E('rect',{x:556,y:186,width:30,height:64,rx:15,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.8'},G2);
  H.E('rect',{x:552,y:200,width:38,height:8,st:'fill:var(--dad)'},G2);H.txt(G2,598,208,'SRY','lbs',{st:'font-style:italic;font-weight:700'});
  H.txt(G2,485,276,'X','lb',{'text-anchor':'middle'});H.txt(G2,571,276,'Y','lb',{'text-anchor':'middle'});
  H.txt(G2,485,296,'about 800','lbs',{'text-anchor':'middle'});H.txt(G2,571,296,'fewer than 100','lbs',{'text-anchor':'middle'});H.O(G2,0,{d:0});
  const ear=H.g(s);H.E('rect',{x:436,y:322,width:190,height:62,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.4'},ear);
  H.txt(ear,450,346,'hairy ear rims','lb');H.txt(ear,450,366,'Y-linked? not confirmed','lbs',{st:'font-weight:700;fill:var(--bad)'});H.O(ear,0,{d:0});
  const GK=H.g(s);H.E('image',{href:'@@asset:genghis-khan-portrait.jpg@@',x:445,y:28,width:166,height:211},GK);
  H.txt(GK,528,258,'Genghis Khan','lb',{'text-anchor':'middle'});
  const rn=seq(3);for(let i=0;i<100;i++){H.E('circle',{cx:447+(i%20)*8.6,cy:286+Math.floor(i/20)*9,r:3.1,st:`fill:${[3,17,29,44,58,61,77,90].includes(i)?'var(--dad)':'var(--faint)'}`},GK)}
  H.txt(GK,528,348,'8 in 100 men, one region of Asia','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.txt(GK,528,366,'about 1 in 200 men worldwide','lbs',{'text-anchor':'middle'});
  H.O(GK,0,{d:0});
  return [
    ()=>{F.gen(0,{pass:true})},
    ()=>{F.gen(1,{pass:true});F.gen(2,{pass:true,at:2200})},
    ()=>{H.O(G2,1)},
    ()=>{H.O(ear,1)},
    ()=>{H.O([G2,ear],0);H.O(GK,1,{at:400})},
  ];}},

/* 16 ─────────────────────────────── */
{sec:'4.3',title:'Clues That Rule Out a Mode',caption:'Each row: one small family · struck-out tile = mode ruled out',
text:`<p data-step="0"><b>Unaffected parents, affected daughter.</b> A dominant allele always shows, so a parent would be affected. Her father's only X is normal, so XR is out. So only AR remains.</p>
<p data-step="1"><b>Unaffected parents, affected son.</b> The trait is recessive, and the unaffected father rules out Y-linked. A son gets his X from his mother, so AR and XR both fit.</p>
<p data-step="2"><b>Affected father, affected son.</b> A father gives a son his Y, not his X. So the gene is not on the X.</p>
<p data-step="3"><b>Affected father, unaffected daughter.</b> A daughter gets her father's only X. So the trait is not XD.</p>
<p data-step="4"><b>Affected mother, unaffected son.</b> An XR mother has two disease X chromosomes, so all her sons are affected. So the trait is not XR. An affected female also rules out Y-linked.</p>
<p data-step="5"><b>Only males, from father to every son, in every generation.</b> Only the Y takes this path, so Y-linked fits best.</p>`,
star:'Father → son rules out X-linked. An affected daughter of an unaffected father rules out XR.',starStep:2,
scene(H){const s=$s();const M=['AD','AR','XD','XR','Y'];
  const rows=[[0,0,'f',1,[0,2,3,4]],[0,0,'m',1,[0,2,4]],[1,0,'m',1,[2,3]],[1,0,'f',0,[2]],[0,1,'m',0,[3,4]],[1,0,'m',1,[2,3],'y']];
  const R=rows.map(([fa,mo,ks,kst,out,yy],i)=>{const y=40+i*64;const G=H.g(s);
    H.txt(G,22,y+22,String(i+1),'lb',{st:'fill:var(--muted)'});
    sym(G,60,y,'m',{r:10,st:fa});sym(G,112,y,'f',{r:10,st:mo});sym(G,86,y+36,ks,{r:10,st:kst});
    H.E('path',{d:`M70,${y} H102 M86,${y} V${y+26}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},G);
    if(yy){sym(G,130,y+36,'f',{r:10});H.E('path',{d:`M86,${y+18} H130 V${y+26}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},G)}
    const a=mkA(G,152,y+18,186,y+18,{w:1.8,h:6});G.a=a;
    G.c=M.map((m,j)=>{const x=232+j*80;const C=pill(G,x,y+18,m,{w:62});C.x=x;
      C.st=H.E('line',{x1:x-36,y1:y+18,x2:x+36,y2:y+18,pathLength:1,cls:'draw',st:'stroke:var(--bad);stroke-width:3.5'},G);C.out=out.includes(j);return C});
    G.yy=yy;H.O(G,0,{d:0});return G});
  return R.map(G=>()=>{H.O(G,1,{d:500});drawA(G.a,{at:200});G.c.forEach((C,j)=>{if(C.out){H.D(C.st,1,{d:400,at:700+j*100});H.O(C,.45,{at:1000+j*100})}else H.K(C.r,{fill:(G.yy&&j===4)?'hi':'mom-tint'},{at:1000})})});}},

/* 17 ─────────────────────────────── */
{sec:'4.2',title:'Incomplete Penetrance',caption:'Model family of 10 people with the same genotype · ages are typical, not exact',
text:`<p data-step="0">The examples so far assume <b>complete penetrance</b>: every person with the disease genotype shows the trait. Real families do not always follow this rule.</p>
<p data-step="1"><b>Penetrance</b> is the percentage of people with a genotype who show the trait. With <b>incomplete penetrance</b>, some people with the disease genotype show no trait. An <i>HTT</i> allele with 36 to 39 CAG repeats has incomplete penetrance.</p>
<p data-step="2">The <b>age of onset</b> (the age when symptoms start) can also hide a genotype. Huntington disease usually starts between ages 30 and 50. So a 20-year-old with the allele appears unaffected in the pedigree, but the disease can start later.</p>
<p data-step="3">An unaffected person with the allele can still transmit it. So with incomplete penetrance, a dominant trait can skip a generation in the pedigree.</p>`,
star:'Penetrance = how many with the genotype show the trait.',starStep:1,
scene(H){const s=$s();
  const ppl=[];for(let i=0;i<10;i++){const x=58+i*50;const G=sym(s,x,70,i%2?'f':'m',{r:13});hide(G.I);G.b=[blk(s,x-7.5,96,'A',{bad:1}),blk(s,x+7.5,96,'a')];H.O(G.b,0,{d:0});ppl.push(G)}
  const c0=H.txt(s,308,140,'complete penetrance: 10 of 10 show the trait','lb',{'text-anchor':'middle'}),c1=H.txt(s,308,140,'incomplete penetrance: 7 of 10 → 70%','lb',{'text-anchor':'middle'});H.O([c0,c1],0,{d:0});
  H.E('line',{x1:20,y1:166,x2:620,y2:166,st:'stroke:var(--faint);stroke-width:1.5'},s);
  const TL=H.g(s);H.O(TL,0,{d:0});const ax=a=>40+a*4.4;
  H.txt(TL,24,192,'AGE OF ONSET · HUNTINGTON DISEASE','cap',{st:'fill:var(--ink)'});
  H.E('rect',{x:ax(30),y:206,width:ax(50)-ax(30),height:106,st:'fill:var(--hi);opacity:.28'},TL);H.txt(TL,ax(40),228,'usual onset','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  H.E('line',{x1:ax(0),y1:312,x2:ax(80),y2:312,st:'stroke:var(--ink);stroke-width:2'},TL);
  for(let a=0;a<=80;a+=10){H.E('line',{x1:ax(a),y1:308,x2:ax(a),y2:316,st:'stroke:var(--ink);stroke-width:1.5'},TL);H.txt(TL,ax(a),332,String(a),'lbs',{'text-anchor':'middle'})}
  H.txt(TL,ax(40),350,'age (years)','lbs',{'text-anchor':'middle'});
  const P=sym(TL,ax(0),250,'m',{r:13});const pb=[blk(TL,0,0,'A',{bad:1}),blk(TL,0,0,'a')];
  const l20=H.txt(TL,ax(20),384,'age 20: looks unaffected','lbs',{'text-anchor':'middle',st:'font-weight:700'}),l45=H.txt(TL,ax(52),384,'age 45: affected','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O([l20,l45],0,{d:0});
  const place=a=>{const x=ax(a);P.setAttribute('transform',`translate(${x},250)`);pb[0].setAttribute('transform',`translate(${x-7.5},276)`);pb[1].setAttribute('transform',`translate(${x+7.5},276)`);P.full.style.opacity=a>=42?1:0;if(a>=20)l20.style.opacity=1;if(a>=45)l45.style.opacity=1};
  const prx={set textContent(v){place(+v)}};place(0);
  const F=ped(s,{blocks:true,bad:'A',gy:[214,290,366],num:false,labs:false,r:11},[
    ['p1','m',0,500,1,'Aa'],['p2','f',0,570,0,'aa'],['q1','m',1,535,0,'Aa'],['q2','f',1,605,0,'aa'],['r1','f',2,570,1,'Aa']],
    [['p1','p2',['q1']],['q1','q2',['r1']]]);
  const sk=H.txt(s,516,296,'has A,','lbs',{'text-anchor':'end',st:'font-weight:700'}),sk2=H.txt(s,516,311,'no trait','lbs',{'text-anchor':'end',st:'font-weight:700'});H.O([sk,sk2],0,{d:0});
  return [
    ()=>{ppl.forEach((G,i)=>{pop(G.I,{at:i*80});H.O(G.b,1,{at:300+i*80});setSt(G,1,{at:600+i*80})});H.O(c0,1,{at:1100})},
    ()=>{H.O(c0,0);[2,5,8].forEach((i,k)=>setSt(ppl[i],0,{at:300+k*300}));H.O(c1,1,{at:1200})},
    ()=>{H.O(TL,1);place(0);H.count(prx,0,55,{d:3300,at:500,fmt:v=>v})},
    ()=>{H.O(TL,.35);F.gen(0,{pass:true});F.gen(1,{pass:true,at:900});F.gen(2,{pass:true,at:1900});H.O([sk,sk2],1,{at:2000})},
  ];}},

/* 18 ─────────────────────────────── */
{sec:'4.2',title:'Variable Expressivity and Fragile X',caption:'Cells are schematic · green = working X active · red = changed X active',
text:`<p data-step="0"><b>Variable expressivity</b> means that people with the same disease genotype show the trait to different degrees. Other genes, the environment and chance all change the result.</p>
<p data-step="1"><b>Fragile X syndrome</b> is the most common inherited cause of intellectual disability. The <i>FMR1</i> gene on the X has a repeat of three DNA letters, CGG. Most people have fewer than 45 repeats. More than 200 repeats make the gene inactive.</p>
<p data-step="2">A male has one X. If his X has the long repeat, none of his brain cells makes FMR1 protein. He has intellectual disability.</p>
<p data-step="3">Early in a female embryo, each cell inactivates one of its two X chromosomes at random (<b>X-inactivation</b>). All cells that descend from that cell keep the same choice. So about half of her cells use the working X.</p>
<p data-step="4">The mix of cells differs from female to female. Some females with the changed X show no symptoms: incomplete penetrance. Others show mild or clear intellectual disability: variable expressivity.</p>
<p data-step="4" class="note">Fragile X is an X-linked trait that does not follow the XD father rule on slide 14. In fragile X, the repeat reaches full size mainly when a mother transmits the allele.</p>`,
star:'Same genotype, different degree = variable expressivity.',starStep:4,
scene(H){const s=$s();
  const E0=H.g(s);H.txt(E0,24,30,'SAME GENOTYPE','cap',{st:'fill:var(--ink)'});
  [[.25,'mild'],[.6,'moderate'],[1,'severe']].forEach(([f,l],i)=>{const x=60+i*80;H.E('rect',{x:x-18,y:46,width:36,height:36,st:'fill:var(--card)'},E0);
    const r=H.E('rect',{x:x-18,y:46+36*(1-f),width:36,height:36*f,st:'fill:var(--ink)'},E0);H.E('rect',{x:x-18,y:46,width:36,height:36,st:'fill:none;stroke:var(--ink);stroke-width:2.2'},E0);
    H.txt(E0,x,104,l,'lbs',{'text-anchor':'middle',st:'font-weight:700'})});H.O(E0,0,{d:0});
  const S=H.g(s);H.O(S,0,{d:0});H.txt(S,290,30,'FMR1 GENE ON THE X','cap',{st:'fill:var(--ink)'});
  const bx=[];for(let k=0;k<24;k++){const b=H.E('rect',{x:290+k*10,y:50,width:8.5,height:22,rx:1.5,st:`fill:${k<10?'var(--dad-tint)':'var(--mom)'};stroke:var(--ink);stroke-width:.8`},S);bx.push(b)}
  const gene=H.E('rect',{x:540,y:46,width:84,height:30,rx:5,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.8'},S);const gl=H.txt(S,582,66,'active','lbs',{'text-anchor':'middle',st:'font-weight:700;fill:#fff'});
  const cn=H.txt(S,290,96,'','lb');H.txt(S,290,114,'under 45 repeats: normal · over 200: gene inactive','lbs');
  H.E('line',{x1:20,y1:136,x2:620,y2:136,st:'stroke:var(--faint);stroke-width:1.5'},s);
  const grid=(p,x,y,c,r,f,seed,sz)=>{const G=H.g(p);const rn=seq(seed);sz=sz||16;const cells=[];
    for(let i=0;i<c*r;i++){const e=H.E('rect',{x:x+(i%c)*(sz+2),y:y+Math.floor(i/c)*(sz+2),width:sz,height:sz,rx:3,st:`fill:var(--${rn()<f?'good':'bad'});stroke:var(--ink);stroke-width:.8`},G);H.O(e,0,{d:0});cells.push(e)}G.cells=cells;return G};
  const Mg=H.g(s);H.O(Mg,0,{d:0});H.txt(Mg,24,162,'MALE · ONE X','cap',{st:'fill:var(--ink)'});const mg=grid(Mg,24,176,7,6,0,3);H.txt(Mg,24,302,'no cell makes','lbs',{st:'font-weight:700'});H.txt(Mg,24,318,'FMR1 protein','lbs',{st:'font-weight:700'});
  const Fg=H.g(s);H.O(Fg,0,{d:0});H.txt(Fg,214,162,'FEMALE · TWO X','cap',{st:'fill:var(--ink)'});const fg=grid(Fg,214,176,7,6,.5,9);H.txt(Fg,214,302,'random mix:','lbs',{st:'font-weight:700'});H.txt(Fg,214,318,'about half use the working X','lbs',{st:'font-weight:700'});
  const V=H.g(s);H.O(V,0,{d:0});H.txt(V,430,162,'THREE FEMALES','cap',{st:'fill:var(--ink)'});
  const vs=[[.8,'no symptoms',13],[.5,'mild',21],[.2,'clear disability',5]].map(([f,l,sd],i)=>{const y=180+i*72;const g=grid(V,430,y,6,3,f,sd,13);H.txt(V,522,y+26,l,'lbs',{st:'font-weight:700'});return g});
  const key=H.g(s);H.E('rect',{x:24,y:372,width:14,height:14,rx:3,st:'fill:var(--good);stroke:var(--ink);stroke-width:.8'},key);H.txt(key,44,384,'cell uses the working X','lbs');
  H.E('rect',{x:214,y:372,width:14,height:14,rx:3,st:'fill:var(--bad);stroke:var(--ink);stroke-width:.8'},key);H.txt(key,234,384,'cell uses the changed X','lbs');H.O(key,0,{d:0});
  return [
    ()=>{H.O(E0,1)},
    ()=>{H.O(S,1);const p={set textContent(v){const n=Math.round(+v);bx.forEach((b,k)=>b.style.opacity=k<Math.min(24,4+n/10)?1:0);cn.textContent=`${n} repeats`;
      const off=n>200;gene.style.fill=off?'var(--faint)':'var(--good)';gl.textContent=off?'inactive':'active';gl.style.fill=off?'var(--ink)':'#fff'}};p.textContent=30;H.count(p,30,230,{d:2200,at:600,fmt:v=>v})},
    ()=>{H.O(Mg,1);H.O(key,1);mg.cells.forEach((e,i)=>H.O(e,1,{d:200,at:300+i*25}))},
    ()=>{H.O(Fg,1);fg.cells.forEach((e,i)=>H.O(e,1,{d:200,at:300+i*25}))},
    ()=>{H.O(V,1);vs.forEach((g,k)=>g.cells.forEach((e,i)=>H.O(e,1,{d:200,at:300+k*400+i*15})))},
  ];}},

/* 19 ─────────────────────────────── */
{sec:'4.4',title:'New Mutations: Sporadic Cases',caption:'Tick marks are schematic · red tile = disease allele (A) · star = new mutation',
text:`<p data-step="0">A disease can appear in a family for the first time. In a <b>sporadic</b> case, no parent gave the person the disease allele.</p>
<p data-step="1">Each child has about 50 to 100 <b>new (de novo) mutations</b>, DNA changes that neither parent has. Most form in the cells that make the sperm of the father. Their number rises with the age of the father.</p>
<p data-step="2">Most new mutations change nothing important. A rare one changes a gene and causes a dominant disease in a child of two unaffected parents. About 4 in 5 children with achondroplasia have a new mutation.</p>
<p data-step="3">The child with the new mutation is Aa. Each child of that child inherits it with a probability of 1/2. So an AD pattern begins with that child.</p>
<p data-step="4"><b>Fertilization</b> is the union of a sperm cell and an egg cell. A <b>somatic mutation</b> forms in a body cell after fertilization. Only the cells that descend from that one cell carry it. The mutation is not in the eggs or sperm, so the person does not transmit it. Most cancers begin with somatic mutations.</p>`,
star:'New in the sperm or egg: inherited from then on. New in a body cell: not inherited.',starStep:4,
scene(H){const s=$s();
  const F=ped(s,{blocks:true,bad:'A',gy:[70,170,270]},[
    ['I-1','m',0,110,0,'aa'],['I-2','f',0,190,0,'aa'],['II-1','m',1,150,1,'Aa'],['II-2','f',1,230,0,'aa'],
    ['III-1','f',2,100,1,'Aa'],['III-2','m',2,160,0,'aa'],['III-3','f',2,220,0,'aa'],['III-4','m',2,280,1,'Aa']],
    [['I-1','I-2',['II-1']],['II-1','II-2',['III-1','III-2','III-3','III-4']]]);
  const nb=F.p['II-1'].bl[0];nb.rect.style.fill='var(--card)';nb.t.textContent='a';nb.t.style.fill='var(--ink)';
  const q=F.tag('II-1','?',{dx:-34,dy:6,cls:'big',st:'font-size:24px'});
  const star=H.E('path',{d:'M0,-11 L3,-3.5 L11,-3.5 L4.5,1.5 L7,9.5 L0,4.5 L-7,9.5 L-4.5,1.5 L-11,-3.5 L-3,-3.5 Z',st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.2'},s);T2(star,F.p['II-1'].x-24,F.p['II-1'].y+26);hide(star);
  const nm=H.txt(s,F.p['II-1'].x-40,F.p['II-1'].y+64,'new mutation','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(nm,0,{d:0});
  const t3=H.txt(s,190,356,'each child: 1/2','lb',{'text-anchor':'middle'});H.O(t3,0,{d:0});
  // genome bar
  const GB=H.g(s);H.O(GB,0,{d:0});H.txt(GB,480,34,'NEW CHANGES IN ONE CHILD','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  H.E('rect',{x:340,y:52,width:280,height:22,rx:4,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},GB);
  H.txt(GB,480,90,'the child’s whole genome, 6 billion DNA letters','lbs',{'text-anchor':'middle'});
  const rn=seq(21);const ticks=[];for(let i=0;i<70;i++){const x=343+rn()*274;const e=H.E('line',{x1:x,y1:54,x2:x,y2:72,st:`stroke:var(--${i%5===0?'mom':'dad'});stroke-width:2`},GB);H.O(e,0,{d:0});ticks.push(e)}
  const cnt=H.txt(GB,480,118,'','lb',{'text-anchor':'middle',st:'font-size:16px'});H.txt(GB,480,138,'blue: from the father · orange: from the mother','lbs',{'text-anchor':'middle'});
  // somatic tree
  const ST=H.g(s);H.O(ST,0,{d:0});H.txt(ST,480,178,'SOMATIC MUTATION','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  const lv=[[480],[420,540],[390,450,510,570],[375,405,435,465,495,525,555,585]],ly=[204,246,288,330];
  lv.forEach((xs,l)=>{if(l)xs.forEach((x,i)=>H.E('line',{x1:lv[l-1][Math.floor(i/2)],y1:ly[l-1],x2:x,y2:ly[l],st:'stroke:var(--ink);stroke-width:1.4'},ST))});
  const cells=lv.map((xs,l)=>xs.map(x=>H.E('circle',{cx:x,cy:ly[l],r:[11,10,9,8][l],cls:'cellfill',st:'stroke:var(--ink);stroke-width:1.8'},ST)));
  const mut=[cells[1][1],cells[2][2],cells[2][3],...cells[3].slice(4)];
  H.txt(ST,480,364,'only cells from that one cell carry it','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.txt(ST,480,380,'not in eggs or sperm: not inherited','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  const zs=H.txt(ST,500,208,'zygote','lbs');
  return [
    ()=>{F.gen(0,{pass:true});F.gen(1,{at:900});F.al('II-2',{at:1500});H.O(q,1,{at:1800})},
    ()=>{H.O(GB,1);ticks.forEach((e,i)=>H.O(e,1,{d:150,at:300+i*25}));const p={set textContent(v){cnt.textContent=Math.round(v)+' new changes'}};p.textContent=0;H.count(p,0,70,{d:1750,at:300});H.after(2200,()=>{cnt.textContent='about 50 to 100 per child'})},
    ()=>{H.O(q,0);F.pass('II-1',{at:200});H.after(1300,()=>{H.K(nb.rect,{fill:'bad'});nb.t.textContent='A';nb.t.style.fill='var(--paper)'});pop(star,{at:1300});H.O(nm,1,{at:1500})},
    ()=>{F.gen(2,{pass:true});H.O(t3,1,{at:2000})},
    ()=>{H.O(ST,1);H.after(900,()=>{mut.forEach((e,i)=>{H.K(e,{fill:'bad'},{at:i*120})})})},
  ];}},

/* 20 ─────────────────────────────── */
{sec:'4.4',title:'Non-Heritable and Complex Causes',caption:'Photos: Hawking (NASA), Gehrig (1923) · public domain, Wikimedia Commons',
text:`<p data-step="0">A disease is <b>heritable</b> when parents can transmit it to their children in their DNA. Many diseases depend on many genes and on the environment together. Such diseases run in families, but they show no simple pattern in a pedigree.</p>
<p data-step="1">A non-genetic disease can also affect several members of one family. The family shares a home, so the members share the same toxins, food and infections. The disease looks heritable, but no allele causes it.</p>
<p data-step="2">One disease can have different causes. <b>Amyotrophic lateral sclerosis (ALS)</b> kills the nerve cells that control the muscles. About 5 to 10 in 100 people with ALS have a family history of ALS, usually with an AD pattern. Most other cases are sporadic.</p>
<p data-step="3">Some people with no family history still carry an inherited ALS allele, for example in the <i>C9orf72</i> gene. The physicist Stephen Hawking and the baseball player Lou Gehrig had ALS with no family history of the disease.</p>`,
star:'Runs in a family does not always mean genetic.',starStep:1,
scene(H){const s=$s();
  H.E('line',{x1:320,y1:24,x2:320,y2:404,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);H.E('line',{x1:20,y1:208,x2:620,y2:208,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  const P0=H.g(s);H.txt(P0,24,38,'MANY GENES + ENVIRONMENT','cap',{st:'fill:var(--ink)'});
  const tiles=[];for(let i=0;i<8;i++){const t=H.E('rect',{x:30+(i%4)*24,y:58+Math.floor(i/4)*26,width:18,height:20,rx:3,st:'fill:var(--dad-tint);stroke:var(--ink);stroke-width:1.2'},P0);tiles.push(t)}
  H.txt(P0,76,124,'many genes','lbs',{'text-anchor':'middle'});
  const env=pill(P0,76,152,'environment',{w:100,fill:'mom-tint'});
  const a1=mkA(P0,130,82,206,104,{w:1.8,h:6}),a2=mkA(P0,130,150,206,122,{w:1.8,h:6});
  H.E('rect',{x:212,y:94,width:84,height:40,rx:8,st:'fill:var(--card);stroke:var(--ink);stroke-width:2'},P0);H.txt(P0,254,119,'trait','lb',{'text-anchor':'middle'});
  H.txt(P0,170,190,'no simple pedigree pattern','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(P0,0,{d:0});
  const P1=H.g(s);H.txt(P1,336,38,'SHARED HOME','cap',{st:'fill:var(--ink)'});
  const house=H.E('path',{d:'M370,96 L475,52 L580,96 V184 H370 Z',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:2.2;stroke-linejoin:round'},P1);
  const fam=H.g(P1);sym(fam,440,112,'m',{r:12,st:1});sym(fam,510,112,'f',{r:12,st:1});sym(fam,475,160,'f',{r:12,st:1});H.E('path',{d:'M452,112 H498 M475,112 V148',st:'fill:none;stroke:var(--ink);stroke-width:2'},fam);
  const drop=H.E('path',{d:'M548,104 C548,104 538,118 538,124 a10,10 0 0 0 20,0 C558,118 548,104 548,104 Z',st:'fill:var(--bad);stroke:var(--ink);stroke-width:1.2'},P1);H.txt(P1,548,150,'toxin','lbs',{'text-anchor':'middle'});
  H.txt(P1,475,200,'same exposure, no disease allele','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(P1,0,{d:0});
  const P2=H.g(s);H.txt(P2,24,232,'ALS: 100 CASES','cap',{st:'fill:var(--ink)'});
  const dots=[];for(let i=0;i<100;i++){const e=H.E('rect',{x:28+(i%10)*14,y:246+Math.floor(i/10)*14,width:11,height:11,rx:2,st:`fill:var(--${i<5?'ink':i<10?'muted':'faint'})`},P2);H.O(e,0,{d:0});dots.push(e)}
  H.E('rect',{x:182,y:262,width:12,height:12,rx:2,st:'fill:var(--ink)'},P2);H.E('rect',{x:182,y:280,width:12,height:12,rx:2,st:'fill:var(--muted)'},P2);H.txt(P2,200,282,'family history:','lbs',{st:'font-weight:700'});H.txt(P2,200,298,'5 to 10','lbs',{st:'font-weight:700'});
  H.E('rect',{x:182,y:322,width:12,height:12,rx:2,st:'fill:var(--faint)'},P2);H.txt(P2,200,333,'no family','lbs',{st:'font-weight:700'});H.txt(P2,200,349,'history: the rest','lbs',{st:'font-weight:700'});H.O(P2,0,{d:0});
  const P3=H.g(s);H.E('image',{href:'@@asset:hawking-nasa.jpg@@',x:346,y:226,width:104,height:149},P3);H.E('image',{href:'@@asset:lou-gehrig-1923.jpg@@',x:478,y:226,width:117,height:149},P3);
  H.txt(P3,398,392,'Stephen Hawking','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.txt(P3,536,392,'Lou Gehrig','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(P3,0,{d:0});
  return [
    ()=>{H.O(P0,1);drawA(a1,{at:500});drawA(a2,{at:700})},
    ()=>{H.O(P1,1);H.D(house,1,{d:1000})},
    ()=>{H.O(P2,1);dots.forEach((e,i)=>H.O(e,1,{d:150,at:i*15}))},
    ()=>{H.O(P3,1,{d:700})},
  ];}},

/* 21 ─────────────────────────────── */
{sec:'4.5',title:'The Product Rule and the Sum Rule',caption:'A fair six-sided die: each face has a probability of 1/6',
text:`<p data-step="0">A <b>probability</b> is a number from 0 (never) to 1 (always). A fair six-sided die shows a five with a probability of 1/6.</p>
<p data-step="1"><b>Product rule.</b> The probability that two <b>independent events</b> both happen is the product of their probabilities. Independent means that one event does not change the probability of the other. Three fives in three rolls: 1/6 × 1/6 × 1/6 = 1/216.</p>
<p data-step="2"><b>Sum rule.</b> The probability that one event or another event happens is the sum of their probabilities. The rule applies when the two events cannot both happen. A five or a six in one roll: 1/6 + 1/6 = 2/6 = 1/3.</p>
<p data-step="3">Two carriers (Aa × Aa): each parent gives a with a probability of 1/2. Both give a: 1/2 × 1/2 = 1/4. A carrier child is aA or Aa. By the sum rule, a child is a carrier with a probability of 1/4 + 1/4 = 1/2.</p>
<p data-step="3" class="note">Use the sum rule only for events that cannot both happen (<b>mutually exclusive</b> events). Two independent events can both happen, so their probabilities do not add.</p>`,
star:'AND → multiply. OR → add.',starStep:2,
scene(H){const s=$s();
  const pip={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
  const die=(p,x,y,n,o)=>{o=o||{};const G=H.g(p);const z=o.z||38;G.r=H.E('rect',{x:x-z/2,y:y-z/2,width:z,height:z,rx:7,st:`fill:${H.C(o.fill||'card')};stroke:var(--ink);stroke-width:2`},G);
    pip[n].forEach(([a,b])=>H.E('circle',{cx:x+a*z*.26,cy:y+b*z*.26,r:z*.075,st:'fill:var(--ink)'},G));return G};
  const R0=H.g(s);H.txt(R0,24,30,'ONE ROLL','cap',{st:'fill:var(--ink)'});const d0=[1,2,3,4,5,6].map(n=>die(R0,52+(n-1)*52,64,n));
  const r5=H.E('rect',{x:52+4*52-25,y:39,width:50,height:50,rx:10,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5'},R0);
  H.txt(R0,370,71,'P(five) = 1/6','lb',{st:'font-size:18px'});H.O(R0,0,{d:0});
  const R1=H.g(s);H.txt(R1,24,124,'AND → MULTIPLY','cap',{st:'fill:var(--ink)'});[0,1,2].forEach(i=>{die(R1,52+i*64,160,5,{fill:'mom-tint'});if(i<2)H.txt(R1,84+i*64,166,'×','lb',{'text-anchor':'middle'})});
  H.txt(R1,240,167,'1/6 × 1/6 × 1/6 = 1/216','lb',{st:'font-size:18px'});H.O(R1,0,{d:0});
  const R2=H.g(s);H.txt(R2,24,218,'OR → ADD','cap',{st:'fill:var(--ink)'});die(R2,52,254,5,{fill:'mom-tint'});H.txt(R2,90,260,'or','lb',{'text-anchor':'middle'});die(R2,128,254,6,{fill:'mom-tint'});
  H.txt(R2,240,261,'1/6 + 1/6 = 2/6 = 1/3','lb',{st:'font-size:18px'});H.O(R2,0,{d:0});
  const R3=H.g(s);H.txt(R3,24,310,'TWO CARRIERS','cap',{st:'fill:var(--ink)'});
  H.txt(R3,24,346,'father','lbs');H.txt(R3,24,386,'mother','lbs');
  const fa=[blk(R3,86,342,'A',{w:18,h:20,fs:12}),blk(R3,106,342,'a',{w:18,h:20,fs:12,bad:1})],mo=[blk(R3,86,382,'A',{w:18,h:20,fs:12}),blk(R3,106,382,'a',{w:18,h:20,fs:12,bad:1})];
  H.txt(R3,124,346,'a: 1/2','lbs',{st:'font-weight:700'});H.txt(R3,124,386,'a: 1/2','lbs',{st:'font-weight:700'});
  const c1=blk(s,232,362,'a',{w:18,h:20,fs:12,bad:1,stroke:'dad',sw:2.2}),c2=blk(s,252,362,'a',{w:18,h:20,fs:12,bad:1,stroke:'mom',sw:2.2});T2(c1,106-232,342-362);T2(c2,106-252,382-362);H.O([c1,c2],0,{d:0});
  const eq=H.g(R3);H.txt(eq,290,356,'aa: 1/2 × 1/2 = 1/4','lb',{st:'font-size:18px'});H.txt(eq,290,386,'carrier (aA or Aa): 1/4 + 1/4 = 1/2','lb',{st:'font-size:16px'});H.O(eq,0,{d:0});H.O(R3,0,{d:0});
  return [
    ()=>{H.O(R0,1);H.D(r5,1,{d:700,at:500})},
    ()=>{H.O(R1,1)},
    ()=>{H.O(R2,1)},
    ()=>{H.O(R3,1);[c1,c2].forEach((c,i)=>{H.O(c,1,{d:200,at:500});H.T(c,{x:0,y:0},{d:1000,at:500+i*150})});H.O(eq,1,{at:1600})},
  ];}},

/* 22 ─────────────────────────────── */
{sec:'4.5',title:'The 2/3 Rule',caption:'Each box = one equally likely outcome · edge: blue = father, orange = mother',
text:`<p data-step="0"><b>Problem.</b> Two carriers (Aa × Aa) have an affected daughter and an unaffected son. Find the probability that the son is a carrier.</p>
<p data-step="1">Each child has four equally likely combinations of alleles. With the allele from the father first, they are AA, aA, Aa and aa.</p>
<p data-step="2">The son is unaffected, so he cannot be aa. Remove the aa box. Three equally likely combinations remain.</p>
<p data-step="3">Two of the three combinations left are carriers (aA and Aa). So the probability that the son is a carrier is 2/3, not 1/2.</p>
<p data-step="4">A known phenotype can change a probability. The phenotype of the son removes one outcome, so the count is out of 3, not out of 4.</p>`,
star:'AR, two carrier parents: an unaffected child is a carrier with a probability of 2/3.',starStep:3,
scene(H){const s=$s();
  const F=ped(s,{blocks:true,bad:'a',gy:[90,210],labs:false},[['f','m',0,90,'c','Aa'],['m','f',0,170,'c','Aa'],['d','f',1,90,1,'aa'],['sn','m',1,170,0,null]],[['f','m',['d','sn']]]);
  const qm=F.tag('sn','?',{dx:20,dy:8,cls:'big',st:'font-size:26px'});const tg=F.tag('sn','2/3 carrier',{dx:-34,dy:44,st:'fill:var(--ink)'});H.O(tg,0,{d:0});
  const gt=['A','a'],cx=[410,520],cy=[150,260];
  const top=gt.map((t,i)=>blk(s,cx[i],64,t,{w:22,h:24,fs:14,bad:t==='a',stroke:'dad',sw:2.2})),lef=gt.map((t,i)=>blk(s,316,cy[i],t,{w:22,h:24,fs:14,bad:t==='a',stroke:'mom',sw:2.2}));
  const hdr=H.g(s);H.txt(hdr,465,34,'FROM THE FATHER','cap',{'text-anchor':'middle'});H.txt(hdr,316,100,'FROM THE','cap',{'text-anchor':'middle'});H.txt(hdr,316,114,'MOTHER','cap',{'text-anchor':'middle'});
  H.O([...top,...lef,hdr],0,{d:0});
  const grid=H.E('path',{d:'M355,95 H575 V315 H355 Z M465,95 V315 M355,205 H575',pathLength:1,cls:'draw k',st:'stroke-width:2'},s);
  const cells=[[0,0],[1,0],[0,1],[1,1]].map(([c,r])=>{const x=cx[c],y=cy[r];const G=H.g(s);
    const a=blk(G,x-12,y-8,gt[c],{w:22,h:24,fs:14,bad:gt[c]==='a',stroke:'dad',sw:2.2}),b=blk(G,x+12,y-8,gt[r],{w:22,h:24,fs:14,bad:gt[r]==='a',stroke:'mom',sw:2.2});
    T2(a,cx[c]-(x-12),64-(y-8));T2(b,316-(x+12),cy[r]-(y-8));H.O([a,b],0,{d:0});
    const L=H.txt(G,x,y+32,gt[c]+gt[r],'lb',{'text-anchor':'middle'});H.O(L,0,{d:0});G.a=a;G.b=b;G.L=L;G.x=x;G.y=y;return G});
  const X=cross(s,cx[1],cy[1],34,{w:5});
  const ring=[cells[1],cells[2]].map(G=>H.E('rect',{x:G.x-50,y:G.y-50,width:100,height:100,rx:10,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:4'},s));
  const fr=H.txt(s,465,362,'2 of 3 = 2/3','big',{'text-anchor':'middle',st:'font-size:30px'});H.O(fr,0,{d:0});
  const cmp=H.g(s);H.txt(cmp,24,320,'before: 2 of 4 = 1/2','lb');H.txt(cmp,24,346,'after the phenotype: 2 of 3 = 2/3','lb',{st:'fill:var(--dad)'});H.O(cmp,0,{d:0});
  return [
    ()=>{F.gen(0,{pass:true});F.gen(1,{pass:true,at:800});H.O(qm,1,{at:1800})},
    ()=>{H.O([...top,...lef,hdr],1);H.D(grid,1,{d:900,at:300});cells.forEach((G,i)=>{[G.a,G.b].forEach(e=>{H.O(e,1,{d:200,at:900+i*300});H.T(e,{x:0,y:0},{d:900,at:900+i*300})});H.O(G.L,1,{at:1700+i*300})})},
    ()=>{H.D(X.firstChild,1,{d:500});H.O(cells[3],.3,{at:400})},
    ()=>{H.D(ring,1,{d:800});H.O(fr,1,{at:900});H.O(qm,0);H.O(tg,1,{at:1200})},
    ()=>{H.O(cmp,1)},
  ];}},

/* 23 ─────────────────────────────── */
{sec:'4.5',title:'A Worked Pedigree Problem',caption:'AR disease · numbers name the people · diamond = unborn child',
text:`<p data-step="0">The disease is AR. People 5 and 11 are affected. People 12 and 13 ask for the probability that their future child, 14, will be affected. The diamond shows that 14 is not born yet, so its sex is unknown.</p>
<p data-step="1">People 1, 2, 3 and 4 are unaffected, but each couple has an affected child. So all four are carriers (Aa).</p>
<p data-step="2">Person 6 is the unaffected brother of an affected person. By the 2/3 rule, 6 is a carrier with a probability of 2/3. For the same reason, 9 is a carrier with a probability of 2/3.</p>
<p data-step="3">People 7 and 8 are married-in, so by Assumption 2 we assume that they are AA. For 12 to be Aa, 6 must be Aa (2/3) and 6 must give a (1/2). So 12 is Aa with a probability of 2/3 × 1/2 = 1/3. The same steps give 1/3 for 13.</p>
<p data-step="4">The two families are not related, so the two sides are independent. Child 14 is aa only if 12 is Aa, 13 is Aa, and both give a. Product rule: 1/3 × 1/3 × 1/4 = 1/36.</p>`,
star:'Multiply down the family: 2/3 × 1/2 = 1/3 per side, then 1/3 × 1/3 × 1/4.',starStep:4,
scene(H){const s=$s();
  const F=ped(s,{gy:[62,160,258,350],labs:'in',r:15,lfs:13},[
    ['1','m',0,120,0,0,'1'],['2','f',0,190,0,0,'2'],['3','m',0,430,0,0,'3'],['4','f',0,500,0,0,'4'],
    ['5','m',1,90,1,0,'5'],['6','m',1,170,0,0,'6'],['7','f',1,240,0,0,'7'],['8','m',1,380,0,0,'8'],['9','f',1,450,0,0,'9'],['10','f',1,520,0,0,'10'],['11','m',1,590,1,0,'11'],
    ['12','f',2,205,0,0,'12'],['13','m',2,415,0,0,'13'],['14','u',3,310,0,0,'14']],
    [['1','2',['5','6']],['3','4',['9','10','11']],['6','7',['12']],['8','9',['13']],['13','12',['14']]]);
  const q=F.tag('14','?',{dx:26,dy:8,cls:'big',st:'font-size:24px'});
  const T=(id,t,dy,c)=>F.tag(id,t,{dx:0,dy,anchor:'middle',st:`fill:var(--${c||'ink'})`});
  const tA=['1','2','3','4'].map(id=>T(id,'Aa',-24,'bad'));
  const t6=[T('6','2/3 Aa',38,'bad'),T('9','2/3 Aa',38,'bad')];
  const t7=[T('7','AA',38),T('8','AA',38)],t12=[T('12','1/3 Aa',38,'bad'),T('13','1/3 Aa',38,'bad')];
  const E=H.g(s);H.E('rect',{x:470,y:236,width:162,height:170,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},E);
  const e1=H.g(E);H.txt(e1,484,262,'12 or 13 is Aa:','lbs',{st:'font-weight:700'});H.txt(e1,484,284,'2/3 × 1/2 = 1/3','lb');
  const e2=H.g(E);H.txt(e2,484,316,'14 is aa:','lbs',{st:'font-weight:700'});H.txt(e2,484,338,'1/3 × 1/3 × 1/4','lb');H.txt(e2,484,380,'= 1/36','big',{st:'font-size:30px'});
  H.O([E,e1,e2],0,{d:0});const t14=F.tag('14','1/36',{dx:26,dy:8,cls:'lb',st:'fill:var(--bad);font-size:17px'});
  return [
    ()=>{F.gen(0);F.gen(1,{at:700});F.gen(2,{at:1500});F.gen(3,{at:2300});H.O(q,1,{at:3000})},
    ()=>{tA.forEach((e,i)=>H.O(e,1,{at:i*200}))},
    ()=>{H.O(t6,1)},
    ()=>{H.O(t7,1);H.O(t12,1,{at:600});H.O(E,1,{at:300});H.O(e1,1,{at:600})},
    ()=>{H.O(e2,1);H.O(q,0);H.O(t14,1,{at:600})},
  ];}},

/* 24 ─────────────────────────────── */
{sec:'4.3',title:'The Five Modes Side by Side',wide:true,steps:3,
text:`<div class="tblwrap" data-step="0"><table class="tbl">
<thead><tr><th>Mode</th><th>Gene and copies</th><th>Why the pattern happens</th><th>Who is affected</th><th>Pedigree clues</th><th>Examples</th></tr></thead>
<tbody>
<tr><td>AD</td><td>autosome · one changed copy causes the trait</td><td>every person with A shows the trait, so no one carries it unseen</td><td>males and females equally</td><td>every generation · each affected child has an affected parent · father → son is possible</td><td>Huntington disease, achondroplasia</td></tr>
<tr><td>AR</td><td>autosome · two broken copies cause the trait</td><td>one working copy makes enough protein, so carriers show nothing</td><td>males and females equally</td><td>often skips generations · unaffected carrier parents · more often after cousin matings</td><td>cystic fibrosis, PKU</td></tr>
</tbody><tbody data-step="1">
<tr><td>XD</td><td>X · one changed copy causes the trait</td><td>a father gives his X to every daughter and never to a son</td><td>about twice as many females</td><td>affected father → all daughters, no sons · no father → son</td><td>X-linked hypophosphatemia (<i>PHEX</i>)</td></tr>
<tr><td>XR</td><td>X · two copies in a female, one in a male</td><td>a male has one X and no second copy</td><td>mostly males</td><td>affected father → carrier daughters · carrier mother → 1/2 of sons affected · no father → son</td><td>hemophilia A and B, red-green colour blindness</td></tr>
<tr><td>Y-linked</td><td>Y · one copy, males only</td><td>only males have a Y, and every son gets his father’s Y</td><td>males only</td><td>father → every son · never a daughter</td><td>Y-chromosome DNA types that trace male lines</td></tr>
</tbody></table></div>
<p class="note" data-step="2">Fragile X syndrome is an exception to the XD father rule. Its CGG repeat grows to full size mainly when a mother transmits it.</p>`,
star:'Father → son rules out X-linked. Unaffected parents with an affected child mean recessive.',starStep:1},

/* 25 ─────────────────────────────── */
{sec:'4.6',title:'Summary',wide:true,steps:3,
text:`<div class="cols sum3"><div data-step="0"><h3>Patterns</h3><ul>
<li>A pedigree shows one trait in a family. Geneticists use pedigrees because they cannot do controlled crosses in humans.</li>
<li>Two facts set the mode of inheritance. One is the chromosome that carries the gene: an autosome, the X or the Y. The other is the number of changed copies that cause the trait.</li>
<li>A broken copy is usually recessive, because one working copy makes enough protein. A dominant allele causes its trait with one copy, for example with a harmful protein.</li>
<li>A male has one X, so one X-linked recessive allele shows in a male. A father gives his X to his daughters and his Y to his sons.</li>
</ul></div><div data-step="1"><h3>Probabilities</h3><ul>
<li>Product rule (AND): multiply the probabilities of independent events.</li>
<li>Sum rule (OR): add the probabilities of events that cannot both happen.</li>
<li>Two carrier parents of an AR trait: an unaffected child is a carrier with a probability of 2/3.</li>
<li>Pedigree problems use two assumptions: complete penetrance, and a married-in person has no disease allele.</li>
</ul></div><div data-step="2"><h3>Exceptions</h3><ul>
<li>Incomplete penetrance and variable expressivity make real pedigrees harder to read.</li>
<li>Some cases are sporadic: a new mutation in an egg or a sperm cell.</li>
<li>Somatic mutations form in body cells and are not inherited.</li>
<li>Some diseases that run in families have environmental causes.</li>
<li>Fragile X does not follow the simple XD rules.</li>
</ul></div></div>`,
star:'Chromosome + copy number → mode → probability.',starStep:2},

/* 26 ─────────────────────────────── */
{sec:'4.7',title:'Key Terms: Genes and Pedigrees',wide:true,steps:1,
text:`<div class="terms" data-step="0">
<div class="term"><b>Gene</b>A segment of DNA with the instructions for one product, usually a protein.</div>
<div class="term"><b>Allele</b>One version of a gene, for example A or a.</div>
<div class="term"><b>Genotype</b>The pair of alleles in a person, for example AA, Aa or aa.</div>
<div class="term"><b>Phenotype</b>The trait that a person shows.</div>
<div class="term"><b>Homozygous</b>With two identical alleles of a gene (AA or aa).</div>
<div class="term"><b>Heterozygous</b>With two different alleles of a gene (Aa). Such a person is a heterozygote.</div>
<div class="term"><b>Autosome</b>Any chromosome of pairs 1 to 22. Males and females have the same autosomes.</div>
<div class="term"><b>Hemizygous</b>With only one copy of a gene. A male is hemizygous for most X genes.</div>
<div class="term"><b>Pedigree chart</b>A family tree that shows one trait across generations.</div>
<div class="term"><b>Proband</b>The affected person who brings the family to a geneticist (the propositus).</div>
<div class="term"><b>Consultand</b>An unaffected person who asks a geneticist for advice.</div>
<div class="term"><b>Affected</b>A person who shows the trait. The pedigree shows a filled symbol.</div>
<div class="term"><b>Carrier</b>A person with one recessive disease allele and no trait.</div>
<div class="term"><b>Consanguineous mating</b>A mating between close relatives. The pedigree shows it with two lines.</div>
<div class="term"><b>Mode of inheritance</b>The pattern of a trait in a family, set by chromosome and dominance.</div>
<div class="term"><b>Penetrance</b>The percentage of people with a genotype who show the trait.</div>
<div class="term"><b>Incomplete penetrance</b>Some people with the disease genotype do not show the trait.</div>
<div class="term"><b>Variable expressivity</b>People with the same genotype show the trait to different degrees.</div>
<div class="term"><b>X-inactivation</b>In each cell of a female, one X becomes inactive at random.</div>
<div class="term"><b>Genetic counselling</b>Advice on the probability that a child inherits a disease.</div>
</div>`},

/* 27 ─────────────────────────────── */
{sec:'4.7',title:'Key Terms: Modes, Diseases and Probability',wide:true,steps:1,
text:`<div class="terms" data-step="0">
<div class="term"><b>Autosomal dominant (AD)</b>Gene on an autosome. One changed copy causes the trait.</div>
<div class="term"><b>Autosomal recessive (AR)</b>Gene on an autosome. Two broken copies cause the trait.</div>
<div class="term"><b>X-linked dominant (XD)</b>Gene on the X. One changed copy is enough in either sex.</div>
<div class="term"><b>X-linked recessive (XR)</b>Gene on the X. Females need two copies; males need one.</div>
<div class="term"><b>Y-linked</b>Gene on the Y. Only males are affected, from father to son.</div>
<div class="term"><b>Recessive lethal</b>An allele that causes death with two copies, as AA in achondroplasia.</div>
<div class="term"><b>Achondroplasia</b>AD short-limbed dwarfism. A changed <i>FGFR3</i> keeps a bone-growth brake active.</div>
<div class="term"><b>PKU</b>Phenylketonuria, an AR loss of the PAH enzyme, so phenylalanine collects.</div>
<div class="term"><b>Hemophilia A</b>XR loss of clotting factor VIII (gene <i>F8</i>). Hemophilia B: factor IX (<i>F9</i>).</div>
<div class="term"><b>Compound heterozygote</b>A person with two different disease alleles of one gene.</div>
<div class="term"><b>Hairy ear rim</b>A trait once given as Y-linked. Y-chromosome DNA tests did not support Y-linkage.</div>
<div class="term"><b>Sporadic</b>A case in which no parent gave the person the disease allele.</div>
<div class="term"><b>De novo mutation</b>A new DNA change in an egg or sperm cell that neither parent has.</div>
<div class="term"><b>Somatic mutation</b>A DNA change in a body cell after fertilization. Children do not inherit it.</div>
<div class="term"><b>Independent events</b>Events in which one does not change the probability of the other.</div>
<div class="term"><b>Product rule</b>The probability that independent events all happen is the product of their probabilities.</div>
<div class="term"><b>Sum rule</b>For events that cannot both happen, the probability of one or the other is the sum.</div>
</div>`},

/* 28 ─────────────────────────────── */
{sec:'4.8–4.9',title:'Check Your Understanding: 1 and 2',caption:'? = the father’s parents',
text:`<div class="qa" data-step="0"><div class="q">1. The pedigree shows an unaffected mother, an affected father and three children. Which modes of inheritance fit?</div><button>Show answer</button><div class="a" hidden>AD fits: the father is Aa and gave A to son 1. AR fits only if the mother is a carrier (Aa) and the father is aa. XR fits only if the mother is a carrier, because son 1 got his X from her. The mother is married-in, and Assumption 2 says that she has no disease allele. So AD fits best.<br>XD does not fit: daughter 2 got her father's X, so she would be affected. Y-linked does not fit: son 3 got his father's Y, so he would be affected.</div></div>
<div class="qa" data-step="1"><div class="q">2. The mode in question 1 is not certain. Which extra data would help to find it?</div><button>Show answer</button><div class="a" hidden>Many answers are possible. If both parents of the father are unaffected, the trait cannot be dominant. If only the father of the father is affected, XR needs the mother of the father to be a carrier. A carrier is unlikely for a rare allele. Suppose son 1 and an unrelated partner have an affected son. Then the X-linked modes do not fit, because a father gives a son his Y.</div></div>`,
scene(H){const s=$s();
  const F=ped(s,{gy:[90,200,310],labs:'below',r:16},[['gf','m',0,340,0,0,''],['gm','f',0,420,0,0,''],['M','f',1,260,0,0,''],['D','m',1,380,1,0,''],['1','m',2,220,1,0,'1'],['2','f',2,320,0,0,'2'],['3','m',2,420,0,0,'3']],
    [['gf','gm',['D']],['D','M',['1','2','3']]]);
  F.gen(1);F.gen(2);H.D(F.p.D.drop,0,{d:0});
  const qs=['gf','gm'].map(id=>F.tag(id,'?',{dx:0,dy:8,anchor:'middle',cls:'big',st:'font-size:22px'}));
  const lb=H.g(s);H.txt(lb,260,236,'mother','lbs',{'text-anchor':'middle'});H.txt(lb,380,236,'father','lbs',{'text-anchor':'middle'});
  return [()=>{},()=>{F.gen(0);H.D(F.p.D.drop,1,{d:800,at:600});H.O(qs,1,{at:700})}];}},

/* 29 ─────────────────────────────── */
{sec:'4.8–4.9',title:'Check Your Understanding: Question 3',caption:'Four pedigrees, one per step',
text:`<p data-step="0">3. Name the most likely mode of inheritance for each pedigree (AD, AR, XD or XR).</p>
<div class="qa" data-step="0"><div class="q">3a.</div><button>Show answer</button><div class="a" hidden>The most likely mode is AD. Each affected person has an affected parent, and the trait appears in every generation. Affected people with unaffected married-in partners have affected children. An affected father has an affected son, so the trait is not XD or XR.</div></div>
<div class="qa" data-step="1"><div class="q">3b.</div><button>Show answer</button><div class="a" hidden>The most likely mode is AR. Two unaffected parents have an affected daughter and an affected son, so the trait is recessive. The affected daughter has an unaffected father, so the trait is not XR. AR needs the married-in father to be a carrier, against Assumption 2, but AR is the only mode that fits.</div></div>
<div class="qa" data-step="2"><div class="q">3c.</div><button>Show answer</button><div class="a" hidden>AR is the most likely mode. An affected girl in generation IV has unaffected parents, so the trait is not AD or XD. The affected mother in generation I has unaffected sons, so the trait is not XR. Two married-in people are affected, so the allele seems common in this population.</div></div>
<div class="qa" data-step="3"><div class="q">3d.</div><button>Show answer</button><div class="a" hidden>The most likely mode is XR. Two affected sons have unaffected parents, so the trait is recessive. All affected people are male. The affected men have only unaffected sons, and their unaffected sisters have affected sons, as expected for carrier females.</div></div>`,
scene(H){const s=$s();
  const mk=(lab,o,pp,uu,sx,dx)=>{const G=H.g(s);H.txt(G,24,34,lab,'big',{st:'font-size:30px'});
    const F=ped(G,Object.assign({labs:false,r:10,sib:13,nx:18},o),pp.map(q=>{const c=q.slice();c[3]=c[3]*sx+dx;return c}),uu);F.all();H.O(G,0,{d:0});return G};
  // 3a
  const A=mk('a',{gy:[80,190,300]},[['a1','f',0,233,1],['a2','m',0,320],
    ['b1','f',1,28],['b2','m',1,70,1],['b3','m',1,108],['b4','f',1,157],['b5','m',1,196],['b6','f',1,243,1],['b7','m',1,304],['b8','f',1,358,1],['b9','f',1,410],['b10','m',1,452,1],['b11','f',1,505],
    ['c1','f',2,48,1],['c2','m',2,80],['c3','f',2,118],['c4','f',2,157],['c5','m',2,196],['c6','f',2,243],['c7','f',2,283],['c8','m',2,323,1],['c9','m',2,366],['c10','m',2,404],['c11','m',2,452],['c12','m',2,506,1]],
    [['a2','a1',['b2','b4','b6','b8','b9','b10']],['b2','b1',['c1']],['b3','b4',['c2','c3','c4']],['b5','b6',['c5','c6']],['b7','b8',['c7','c8','c9','c10']],['b10','b11',['c11','c12']]],1.1,22);
  // 3b
  const B=mk('b',{gy:[80,190,300]},[['a1','m',0,232],['a2','f',0,258],
    ['b1','m',1,40],['b2','f',1,92],['b3','m',1,165],['b4','f',1,214],['b5','f',1,268],['b6','m',1,343],
    ['c1','m',2,15],['c2','f',2,45],['c3','f',2,92],['c4','f',2,140,1],['c5','m',2,180,1],['c6','m',2,222],['c7','m',2,260],['c8','m',2,295],['c9','f',2,330],['c10','m',2,370]],
    [['a1','a2',['b2','b4','b5']],['b1','b2',['c1','c2','c3']],['b3','b4',['c4','c5','c6','c7']],['b6','b5',['c8','c9','c10']]],1.45,30);
  // 3c
  const C=mk('c',{gy:[70,160,250,340]},[['a1','f',0,72,1],['a2','m',0,110],
    ['b1','m',1,15],['b2','m',1,52,1],['b3','f',1,92],['b4','m',1,128,1],['b5','f',1,168,1],['b6','f',1,205],['r1','f',1,398],['r2','m',1,436,1],
    ['c1','m',2,15],['c2','m',2,52,1],['c3','m',2,90],['c4','f',2,128,1],['c5','f',2,166],['c6','m',2,204,1],['c7','m',2,242],['c8','f',2,282],
    ['d1','m',2,320],['d2','f',2,358],['d3','f',2,398],['d4','m',2,436],['d5','f',2,474],['d6','m',2,512],['d7','m',2,550],
    ['e1','f',3,245],['e2','f',3,285,1],['e3','m',3,320],['e4','f',3,358]],
    [['a2','a1',['b1','b2','b3','b5','b6']],['b4','b3',['c1','c2','c3','c4','c5','c6','c7','c8']],['r2','r1',['d1','d2','d3','d4','d5','d6','d7']],['d1','c8',['e1','e2','e3','e4']]],1.05,24);
  // 3d
  const Dd=mk('d',{gy:[90,200,310]},[['a1','m',0,112],['a2','f',0,152],
    ['b1','f',1,21],['b2','m',1,47,1],['b3','m',1,74,1],['b4','f',1,99],['b5','f',1,124],['b6','f',1,147],['b7','m',1,172],['b8','f',1,189],['b9','m',1,214],['b10','m',1,230],['b11','f',1,250],
    ['c1','m',2,21],['c2','m',2,47],['c3','f',2,62],['c4','m',2,84],['c5','m',2,105],['c6','m',2,120],['c7','f',2,147],['c8','m',2,172,1],['c9','f',2,187],['c10','f',2,209],['c11','m',2,225,1],['c12','f',2,243]],
    [['a1','a2',['b2','b3','b5','b6','b8','b10']],['b2','b1',['c1','c2']],['b3','b4',['c3','c4','c5','c6']],['b7','b6',['c7','c8']],['b9','b8',['c9','c10','c11']],['b10','b11',['c12']]],2.3,8);
  const all=[A,B,C,Dd];
  return all.map((G,k)=>()=>{all.forEach((o,j)=>H.O(o,j===k?1:0,{d:j===k?600:200}))});}},

/* 30 ─────────────────────────────── */
{sec:'4.8–4.9',title:'Check Your Understanding: 4 and 5',caption:'Q4 omits branches with no letters and no affected people',
text:`<div class="qa" data-step="0"><div class="q">4. The pedigree shows a rare AR disease. Small letters name the people. Give the genotypes of the people marked with letters.</div><button>Show answer</button><div class="a" hidden>People a, d and f are married-in, and the allele is rare, so they are AA. Person k is affected, so person k is aa. People i and j are the unaffected parents of k, so both are Aa. People g and h have affected children, so both are Aa.<br>Person g got her disease allele from person b, because person a is AA. So person b is Aa. People h and i got their disease allele from person c, because person d is AA. So person c is Aa. Person j got his disease allele from person e, because person f is AA. So person e is Aa.</div></div>
<div class="qa" data-step="1"><div class="q">5. Person 1 is a heterozygote for a rare AR disease. Person 2 and the partners of 3 and 4 are not carriers. Find the probability that person 7 is affected.</div><button>Show answer</button><div class="a" hidden>Person 3 is Aa with a probability of 1/2 (Aa × AA), and so is person 4. Person 1 gives each child a separate egg, so these two events are independent. If 3 is Aa, 5 is Aa with a probability of 1/2. If 4 is Aa, 6 is Aa with a probability of 1/2. If 5 and 6 are both Aa, 7 is aa with a probability of 1/4. Product rule: 1/2 × 1/2 × 1/2 × 1/2 × 1/4 = 1/64.</div></div>`,
scene(H){const s=$s();
  const G4=H.g(s);H.txt(G4,24,34,'4','big',{st:'font-size:30px'});
  const F4=ped(G4,{gy:[56,146,236,326],labs:'in',r:12,lfs:12,num:false},[
    ['o1','f',0,300,0,0,''],['o2','m',0,350,0,0,''],
    ['a','m',1,60,0,0,'a'],['b','f',1,110,0,0,'b'],['c','f',1,230,0,0,'c'],['d','m',1,280,0,0,'d'],['e','m',1,470,0,0,'e'],['f','f',1,520,0,0,'f'],
    ['s1','m',2,40,0,0,''],['g','f',2,100,0,0,'g'],['h','m',2,150,0,0,'h'],['s2','f',2,205,0,0,''],['i','f',2,260,0,0,'i'],['j','m',2,330,0,0,'j'],['s3','f',2,400,0,0,''],['s4','m',2,460,0,0,''],['s5','f',2,520,0,0,''],['s6','m',2,580,0,0,''],
    ['t1','m',3,40,1,0,''],['t2','f',3,80,0,0,''],['t3','f',3,120,1,0,''],['t4','f',3,160,1,0,''],['t5','m',3,200,0,0,''],['t6','f',3,240,0,0,''],['u1','m',3,290,0,0,''],['u2','f',3,330,0,0,''],['k','m',3,370,1,0,'k']],
    [['o2','o1',['b','c','e']],['a','b',['s1','g']],['d','c',['h','s2','i']],['e','f',['j','s3','s4','s5','s6']],['h','g',['t1','t2','t3','t4','t5','t6'],true],['j','i',['u1','u2','k'],true]]);
  F4.all();
  const G5=H.g(s);H.txt(G5,24,34,'5','big',{st:'font-size:30px'});
  const F5=ped(G5,{gy:[60,160,260,350],labs:'in',r:16,lfs:13,num:false},[
    ['1','f',0,280,0,0,'1'],['2','m',0,360,0,0,'2'],['p3','f',1,160,0,0,''],['3','m',1,230,0,0,'3'],['4','f',1,410,0,0,'4'],['p4','m',1,480,0,0,''],
    ['5','f',2,195,0,0,'5'],['6','m',2,445,0,0,'6'],['7','f',3,320,0,0,'7']],
    [['2','1',['3','4']],['3','p3',['5']],['p4','4',['6']],['6','5',['7'],true]]);
  F5.all();H.O(G5,0,{d:0});
  return [()=>{H.O(G4,1);H.O(G5,0)},()=>{H.O(G4,0,{d:300});H.O(G5,1,{at:200})}];}},

]});
})();
