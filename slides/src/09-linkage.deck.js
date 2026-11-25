/* Chapter 9 · Linkage and Recombination Frequency — source: Hairdity.pdf ch.9 (Singh, Introduction to Genetics, CC BY-NC-SA 4.0) */
(function(){
const H=window.HL;
const ST=()=>document.getElementById('stage');
const BROWN='#8d5b34',WHITEFUR='#f7f4ec',MOUSEINK='#2a2d33',TAIL='#c98d82';
/* ---- deck-local helpers ---- */
function pop(e,o){H.T(e,{s:1},Object.assign({d:700},o));H.O(e,1,Object.assign({d:300},o));}
function hide(e){H.T(e,{s:.001},{d:0});H.O(e,0,{d:0});}
function mkA(p,x1,y1,x2,y2,o){const a=H.arrow(p,x1,y1,x2,y2,o);H.O(a.lastChild,0,{d:0});return a;}
function drawA(a,o){H.D(a.firstChild,1,Object.assign({d:600},o));H.O(a.lastChild,1,Object.assign({d:200},o,{at:((o&&o.at)||0)+450}));}
function cap(p,x,y,t,anchor){return H.txt(p,x,y,t,'cap',{'text-anchor':anchor||'middle'});}
function lbl(p,x,y,t,cls,o){return H.txt(p,x,y,t,cls||'lb',Object.assign({'text-anchor':'middle'},o||{}));}
function at(G,x,y,s){H.T(G,{x,y,s:s==null?1:s},{d:0});return G;}
/* allele tag: small card with the allele letter, drawn around its own centre */
function tag(p,x,y,t,o){o=o||{};const G=H.g(p);const w=o.w||Math.max(19,t.length*8+9);
  G.box=H.E('rect',{x:-w/2,y:-10.5,width:w,height:21,rx:5,cls:'card',st:`stroke:${H.C(o.stroke||'ink')};stroke-width:1.6`},G);
  const m=/^(\w+)([+−])$/.exec(t);
  if(m){G.t=H.txt(G,0,5,'','lb',{'text-anchor':'middle',st:'font-size:13px'});H.E('tspan',{text:m[1]},G.t);H.E('tspan',{text:m[2],dy:-5,'font-size':'80%'},G.t);}
  else G.t=H.txt(G,0,5,t,'lb',{'text-anchor':'middle',st:'font-size:13px'});H.T(G,{x,y,s:o.s||1},{d:0});return G;}
/* one chromatid as a horizontal bar centred on its own origin. segs:[[x0,x1,colour]], tags:[[x,label]] */
function strand(p,o){const G=H.g(p);const w=o.w||8;const segs=o.segs||[[-o.L/2,o.L/2,o.color]];
  G.lines=segs.map(([a,b,c],i)=>H.E('line',{x1:a,y1:0,x2:b,y2:0,st:`stroke:${H.C(c)};stroke-width:${w};stroke-linecap:${segs.length===1?'round':'butt'}`},G));
  G.caps=[];if(segs.length>1){const f=segs[0],l=segs[segs.length-1];G.caps=[H.E('circle',{cx:f[0],cy:0,r:w/2,st:`fill:${H.C(f[2])}`},G),H.E('circle',{cx:l[1],cy:0,r:w/2,st:`fill:${H.C(l[2])}`},G)];}
  G.tags=(o.tags||[]).map(([x,t])=>tag(G,x,0,t,{s:o.ts||1}));
  H.T(G,{x:o.x||0,y:o.y||0,s:o.s||1},{d:0});return G;}
function recol(G,cs,o){G.lines.forEach((l,i)=>H.K(l,{stroke:cs[i]},o));if(G.caps.length){H.K(G.caps[0],{fill:cs[0]},o);H.K(G.caps[1],{fill:cs[cs.length-1]},o)}}
/* gamete: a small cell holding strands. items:[{segs|color,L,tags,y}] */
function gamete(p,x,y,r,items,o){o=o||{};const G=H.g(p);H.T(G,{x,y},{d:0});
  G.cell=H.E('circle',{r,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.2'},G);
  G.items=items.map(it=>strand(G,Object.assign({w:6,ts:.8},it)));return G;}
/* four chromatids of a bivalent, horizontal. Breaks split each chromatid into segments; xo() swaps the segments right of a break. */
function tetrad(p,o){const T={g:H.g(p),segs:[],ys:o.ys.slice(),dx:[0,0,0,0],o};const w=o.w||8;
  const xs=[o.x0,...(o.breaks||[]),o.x1];T.xs=xs;const cols=o.cols||['dad','dad','mom','mom'];
  for(let r=0;r<4;r++)for(let k=0;k<xs.length-1;k++){const G=H.g(T.g);
    const ln=H.E('line',{x1:xs[k]-(k?0.6:0),y1:0,x2:xs[k+1]+(k<xs.length-2?0.6:0),y2:0,st:`stroke:${H.C(cols[r])};stroke-width:${w};stroke-linecap:butt`},G);
    if(k===0)H.E('circle',{cx:xs[0],cy:0,r:w/2,st:`fill:${H.C(cols[r])}`},G);
    if(k===xs.length-2)H.E('circle',{cx:xs[k+1],cy:0,r:w/2,st:`fill:${H.C(cols[r])}`},G);
    (o.loci||[]).forEach(L=>{if(L.x>=xs[k]&&L.x<xs[k+1]&&L.lab[r])tag(G,L.x,0,L.lab[r],{s:o.ts||1})});
    const S={G,k,row:r,orig:r,ln};T.segs.push(S);}
  T.place=(op)=>T.segs.forEach(S=>H.T(S.G,{x:T.dx[S.row],y:T.ys[S.row]},op||{d:0}));
  T.xo=(b,i,j,op)=>{T.segs.forEach(S=>{if(S.k>=b+1){if(S.row===i)S.row=j;else if(S.row===j)S.row=i}});T.place(op||{d:1100});};
  T.kOf=x=>{for(let k=0;k<xs.length-1;k++)if(x>=xs[k]&&x<xs[k+1])return k;return xs.length-2};
  T.rec=(xa,xb)=>{const ka=T.kOf(xa),kb=T.kOf(xb);return [0,1,2,3].map(r=>{const a=T.segs.find(S=>S.row===r&&S.k===ka),b=T.segs.find(S=>S.row===r&&S.k===kb);return (a.orig<2)!==(b.orig<2)})};
  T.place();return T;}
/* yellow cut mark */
function spark(p,x,y,r){const G=H.g(p);r=r||9;[0,45,90,135].forEach(a=>{const q=a*Math.PI/180;
  H.E('line',{x1:-r*Math.cos(q),y1:-r*Math.sin(q),x2:r*Math.cos(q),y2:r*Math.sin(q),st:'stroke:var(--hi);stroke-width:3;stroke-linecap:round'},G)});
  H.T(G,{x,y},{d:0});H.O(G,0,{d:0});return G;}
function flash(G,at){H.O(G,1,{d:200,at:at||0});H.T(G,{s:1.5},{d:400,at:at||0});H.after((at||0)+600,()=>{H.O(G,0,{d:300});H.T(G,{s:1},{d:300})});}
/* P / R chip: R is highlighted (recombinant) */
function chip(p,x,y,t){const G=H.g(p);const R=t==='R';
  G.box=H.E('rect',{x:-11,y:-11,width:22,height:22,rx:6,st:R?'fill:var(--hi);stroke:var(--ink);stroke-width:1.5':'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},G);
  G.t=H.txt(G,0,5,t,'lb',{'text-anchor':'middle',st:`font-size:13px;${R?'fill:#16181d':''}`});H.T(G,{x,y},{d:0});return G;}
function setChip(G,t){const R=t==='R';G.t.textContent=t;G.box.style.fill=R?'var(--hi)':'var(--card)';G.t.style.fill=R?'#16181d':'var(--ink)';}
/* mouse glyph facing right, centred on its body */
function mouse(p,o){const G=H.g(p);const fur=o.fur==='brown'?BROWN:WHITEFUR;const ink=`stroke:${MOUSEINK};stroke-width:2`;
  const tail=o.tail==='long'?'M-26,6 C-48,14 -58,-12 -86,-2':'M-26,6 C-31,9 -35,8 -39,6';
  H.E('path',{d:tail,st:`fill:none;stroke:${TAIL};stroke-width:3.2;stroke-linecap:round`},G);
  H.E('line',{x1:-12,y1:14,x2:-15,y2:21,st:`stroke:${MOUSEINK};stroke-width:2.4;stroke-linecap:round`},G);
  H.E('line',{x1:12,y1:14,x2:15,y2:21,st:`stroke:${MOUSEINK};stroke-width:2.4;stroke-linecap:round`},G);
  H.E('ellipse',{cx:0,cy:0,rx:28,ry:17,st:`fill:${fur};${ink}`},G);
  H.E('path',{d:'M18,-11 C30,-14 40,-6 44,2 C38,6 26,8 18,7 Z',st:`fill:${fur};${ink};stroke-linejoin:round`},G);
  H.E('circle',{cx:21,cy:-15,r:7,st:`fill:${fur};${ink}`},G);
  H.E('circle',{cx:32,cy:-3,r:2,st:`fill:${MOUSEINK}`},G);H.E('circle',{cx:44,cy:2,r:2.2,st:'fill:#d9788a'},G);
  H.T(G,{x:o.x||0,y:o.y||0,s:o.s||1},{d:0});return G;}
/* superscript text: parts = [['vg',''],['+','sup']] */
function sym(p,x,y,parts,o){o=o||{};const t=H.E('text',{x,y,'text-anchor':o.anchor||'middle',cls:o.cls||'mt',st:o.st||'font-size:22px'},p);
  let up=false;parts.forEach(([s,k])=>{const sp=H.E('tspan',{text:s},t);if(k==='sup'){if(!up)sp.setAttribute('dy',-9);sp.setAttribute('font-size','70%');up=true}else if(up){sp.setAttribute('dy',9);up=false}});return t;}
/* count animation that always lands on its final value, even if frames are skipped */
function cnt(P,from,to,o){o=o||{};const fmt=o.fmt||(v=>Math.round(v).toLocaleString('en-US'));
  if(H.instant||matchMedia('(prefers-reduced-motion: reduce)').matches){P.textContent=fmt(to);return}
  const d=o.d||900,t0=performance.now()+(o.at||0);let done=false;
  const f=()=>{if(done)return;const u=Math.min(1,Math.max(0,(performance.now()-t0)/d));const e=u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
    P.textContent=fmt(from+(to-from)*e);if(u<1)requestAnimationFrame(f);else done=true};
  requestAnimationFrame(f);H.after((o.at||0)+d+80,()=>{done=true;P.textContent=fmt(to)});}
function ring(p,cx,cy,rx,ry){const e=H.E('ellipse',{cx,cy,rx,ry,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:4'},p);return e;}
function plate(p,x,y,t,anchor){const G=H.g(p);const w=t.length*7.4+16;const bx=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;
  H.E('rect',{x:bx,y:y-15,width:w,height:23,rx:6,st:'fill:#16181d;fill-opacity:.86;stroke:var(--faint);stroke-width:1'},G);H.txt(G,bx+8,y+1,t,'lb',{st:'fill:#fff;font-size:13px'});H.O(G,0,{d:0});return G;}

deck({
docTitle:'Linkage and Recombination · Heredity Ch.9',
title:'Linkage and Recombination Frequency',
chapter:9,
eyebrow:'Heredity · Chapter 9 · Linkage',
slides:[

/* 1 ─────────────────────────────── */
{sec:'9.1',title:'Linkage and Recombination Frequency',caption:'Blue = from the father, orange = from the mother · each bar is one chromosome',
text:`<p data-step="0">A <b>gene</b> is a segment of DNA that affects a trait. An <b>allele</b> is one version of a gene. <b>Meiosis</b> is the cell division that makes <b>gametes</b> (sperm cells and egg cells).</p>
<p data-step="0">Mendel’s Second Law, the <b>Law of Independent Assortment</b>, says that the alleles of two genes go into gametes independently.</p>
<p data-step="1">Each chromosome is one long DNA molecule, and each gene is one position on it. A body cell has two copies of each chromosome, the <b>homologs</b>, one from each parent.</p>
<p data-step="2">Alleles of genes close together on one DNA molecule usually go into the same gamete. The tendency to stay together is <b>linkage</b>, an important exception to Mendel’s Second Law.</p>
<p data-step="3"><b>Linked</b> genes are close together on one chromosome. <b>Unlinked</b> genes are on different chromosomes, or far apart on one chromosome.</p>
<p data-step="4">In meiosis, <b>crossing over</b> exchanges segments between homologs and sometimes splits linked alleles. Genes far apart split more often. Scientists use this fact to place genes on chromosomes (<b>genetic mapping</b>).</p>`,
star:'Same DNA molecule, same gamete, unless a crossover splits them.',starStep:4,
scene(H){const s=ST();
  cap(s,160,26,'Genes on two chromosomes');cap(s,480,26,'Genes on one chromosome');
  H.E('line',{x1:320,y1:16,x2:320,y2:404,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  /* left: two pairs */
  const L=H.g(s);H.E('circle',{cx:160,cy:122,r:80,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},L);
  const src={A:[160,86],a:[160,110],B:[160,140],b:[160,164]};
  strand(L,{L:118,color:'dad',tags:[[-28,'A']],x:160,y:86});strand(L,{L:118,color:'mom',tags:[[-28,'a']],x:160,y:110});
  strand(L,{L:76,color:'dad',tags:[[12,'B']],x:160,y:140});strand(L,{L:76,color:'mom',tags:[[12,'b']],x:160,y:164});
  const gx=[50,124,198,272],gy=270;
  const combos=[['A','B'],['A','b'],['a','B'],['a','b']];
  const col={A:'dad',a:'mom',B:'dad',b:'mom'};
  const gl=combos.map(([g1,g2],i)=>{const G=H.g(s);H.E('circle',{cx:gx[i],cy:gy,r:32,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.2'},G);H.O(G,0,{d:0});
    const s1=strand(s,{L:44,w:6,color:col[g1],tags:[[-6,g1]],ts:.8,x:src[g1][0],y:src[g1][1]}),s2=strand(s,{L:32,w:6,color:col[g2],tags:[[4,g2]],ts:.8,x:src[g2][0],y:src[g2][1]});
    H.O([s1,s2],0,{d:0});const t=lbl(s,gx[i],gy+56,g1+g2);const f=lbl(s,gx[i],gy+76,'1/4','lbs');H.O([t,f],0,{d:0});return {G,s1,s2,t,f,x:gx[i]}});
  /* right: one pair, both genes on each homolog */
  const R=H.g(s);H.O(R,0,{d:0});H.E('circle',{cx:480,cy:122,r:80,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},R);
  const rb=strand(R,{L:138,color:'dad',tags:[[-42,'A'],[42,'B']],x:480,y:108}),ro=strand(R,{L:138,color:'mom',tags:[[-42,'a'],[42,'b']],x:480,y:138});
  const dnaL=H.g(R);H.E('path',{d:'M500,206 L520,186',cls:'k',st:'stroke-width:1.3'},dnaL);H.txt(dnaL,470,220,'each bar: one DNA molecule','lbs',{'text-anchor':'middle'});
  const rx=[374,446,518,590];
  const rc=[[[[-26,26,'dad']],'A','B','AB'],[[[-26,26,'mom']],'a','b','ab'],[[[-26,0,'dad'],[0,26,'mom']],'A','b','Ab'],[[[-26,0,'mom'],[0,26,'dad']],'a','B','aB']];
  const rg=rc.map(([segs,a1,a2,nm],i)=>{const G=H.g(s);H.E('circle',{cx:rx[i],cy:gy,r:32,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.2'},G);H.O(G,0,{d:0});
    const st=strand(s,{segs,w:6,tags:[[-15,a1],[15,a2]],ts:.8,x:480,y:i===0||i===3?108:138});H.O(st,0,{d:0});
    const t=lbl(s,rx[i],gy+56,nm);const f=lbl(s,rx[i],gy+76,'','lbs');H.O([t,f],0,{d:0});return {G,st,t,f,x:rx[i]}});
  const sp=spark(s,480,123,11);
  const verdict=[lbl(s,160,392,'unlinked: 4 types, equal numbers','lb'),lbl(s,480,392,'linked: mostly parental combinations','lb')];H.O(verdict,0,{d:0});
  return [
    ()=>{gl.forEach((g,i)=>{const at={at:200+i*160};H.O(g.G,1,at);H.O([g.s1,g.s2],1,at);
      H.T(g.s1,{x:g.x,y:gy-9},Object.assign({d:1100},at));H.T(g.s2,{x:g.x,y:gy+11},Object.assign({d:1100},at));H.O([g.t,g.f],1,{at:900+i*160})})},
    ()=>{H.O(R,1,{d:700})},
    ()=>{[0,1].forEach(i=>{const g=rg[i];H.O(g.G,1,{at:i*200});H.O(g.st,1,{at:i*200});H.T(g.st,{x:g.x,y:gy},{d:1100,at:i*200});g.f.textContent='1/2';H.O([g.t,g.f],1,{at:900})})},
    ()=>{H.O(verdict,1)},
    ()=>{flash(sp);rg[0].f.textContent='common';rg[1].f.textContent='common';
      [2,3].forEach((i,j)=>{const g=rg[i];g.f.textContent='rare';H.O(g.G,1,{at:500+j*200});H.O(g.st,1,{at:500+j*200});H.T(g.st,{x:g.x,y:gy},{d:1100,at:500+j*200});H.O([g.t,g.f],1,{at:1300})})},
  ];}},

/* 2 ─────────────────────────────── */
{sec:'9.1',title:'A Horse with Two Linked Coat Patterns',caption:'Bay roan tobiano foal · photo: Kumana @ Wild Equines, CC BY 2.0, via Wikimedia Commons',
text:`<p data-step="0">The young horse has a coat colour called <b>bay roan tobiano</b>. <b>Bay</b> is the brown base colour of the coat.</p>
<p data-step="1"><b>Roan</b> is a mixture of white hairs with the base colour, so the coat looks foggy.</p>
<p data-step="2"><b>Tobiano</b> is the pattern of large white patches.</p>
<p data-step="3">DNA changes in or near one gene, <i>KIT</i>, on horse chromosome 3 cause both patterns. The KIT protein helps pigment cells develop. Tobiano is an inversion, a reversed segment of DNA. The inversion ends about 100,000 <b>base pairs</b> (rungs of the DNA ladder) from <i>KIT</i>. The roan change is in the same region, so roan and tobiano are linked.</p>
<p data-step="4">Linkage lets a breeder predict the foals. Suppose that a parent carries roan and tobiano on the same chromosome. Most of its foals then get both patterns from it, or neither.</p>`,
star:'Linked variants = close neighbours on one DNA molecule.',starStep:3,
scene(H){const s=ST();const k=330/430,X=4,Y=46;
  H.E('image',{href:'@@asset:c9-roan-tobiano.jpg@@',x:X,y:Y,width:330,height:424*k},s);
  const R1=ring(s,X+100*k,Y+198*k,44,44),R2=ring(s,X+206*k,Y+152*k,40,52);
  const P1=plate(s,12,352,'roan: foggy grey','start'),P2=plate(s,186,74,'tobiano: white patch','start');
  /* right: chromosome 3 of one parent and its gametes */
  const C=H.g(s);H.O(C,0,{d:0});cap(C,490,40,'Chromosome 3 of one parent');
  const top=strand(C,{L:236,color:'dad',x:492,y:92});const bot=strand(C,{L:236,color:'mom',x:492,y:156});
  [top,bot].forEach(G=>{H.E('circle',{cx:-84,cy:0,r:6.5,cls:'kf'},G)});
  H.E('rect',{x:418,y:70,width:170,height:108,rx:8,st:'fill:none;stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 4'},C);
  lbl(C,503,196,'KIT region','lbs');
  tag(C,452,92,'roan');tag(C,538,92,'tobiano');tag(C,450,156,'no roan');tag(C,540,156,'no tobiano');
  const G=H.g(s);H.O(G,0,{d:0});
  const g1=gamete(G,430,292,38,[{L:58,color:'dad'}]),g2=gamete(G,556,292,38,[{L:58,color:'mom'}]);
  lbl(G,430,352,'roan + tobiano');lbl(G,556,352,'neither');lbl(G,493,382,'most foals get one of these two','lbs');
  const ar=[mkA(G,470,208,440,246),mkA(G,516,208,546,246)];
  return [()=>{},()=>{H.D(R1,1,{d:900});H.O(P1,1,{at:500})},()=>{H.D(R2,1,{d:900});H.O(P2,1,{at:500})},
    ()=>{H.O(C,1,{d:800})},
    ()=>{H.O(G,1);ar.forEach(a=>drawA(a))}];}},

/* 3 ─────────────────────────────── */
{sec:'9.2',title:'Genes, Loci and Alleles',caption:'A line is a chromosome · a tick is a locus · a letter is an allele',
text:`<p data-step="0">Each gene sits at one position in the <b>genome</b> (all the DNA of an organism). The position of a gene is its <b>locus</b> (plural: <b>loci</b>). A gene affects one or more traits of the organism.</p>
<p data-step="1">A gene can mutate (change its DNA sequence). Each version of the gene is an allele. Two alleles of one gene can differ by only one DNA letter.</p>
<p data-step="2">Geneticists draw a chromosome as a line. A short mark across the line shows a locus. A letter at the mark shows the allele at that locus.</p>
<p data-step="3">A <b>genotype</b> is the set of alleles in a cell or organism. A genotype usually lists only the genes under study. Geneticists assume that all other genes are <b>wild type</b>: the normal form found in most individuals.</p>
<p data-step="4">A <b>phenotype</b> is a trait that you can detect, such as wing shape. The genotype, with the environment, causes the phenotype. A phenotype description also lists only the traits under study.</p>`,
star:'Locus = the address. Allele = the version at that address.',starStep:2,
scene(H){const s=ST();
  const top=H.g(s);strand(top,{L:440,color:'muted',w:12,x:320,y:46});
  H.E('rect',{x:300,y:34,width:64,height:24,rx:4,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},top);
  const gL=H.g(s);lbl(gL,332,24,'one gene at one locus','lbs');H.O(gL,0,{d:0});
  /* zoom: two DNA sequences */
  const Z=H.g(s);H.O(Z,0,{d:0});
  H.E('path',{d:'M300,58 L160,88 M364,58 L520,88',st:'fill:none;stroke:var(--muted);stroke-width:1;stroke-dasharray:3 3'},Z);
  const seqs=[['G','A','C','T','T','C','A','G'],['G','A','C','A','T','C','A','G']];
  seqs.forEach((q,r)=>{const y=108+r*36;lbl(Z,126,y+5,r?'allele a':'allele A','lb',{'text-anchor':'end'});
    q.forEach((b,i)=>{const x=170+i*48;const diff=i===3;
      H.E('rect',{x:x-17,y:y-14,width:34,height:28,rx:5,st:`fill:${diff?'var(--hi)':'var(--wash)'};stroke:var(--ink);stroke-width:${diff?2:1}`},Z);
      lbl(Z,x,y+5,b,'lb',{st:`font-family:var(--f-display);font-size:15px;${diff?'fill:#16181d':''}`})})});
  /* homolog pair diagram */
  const D=H.g(s);H.O(D,0,{d:0});const y1=226,y2=272,x0=120,x1=540;
  [[y1,'dad'],[y2,'mom']].forEach(([y,c])=>H.E('line',{x1:x0,y1:y,x2:x1,y2:y,st:`stroke:${H.C(c)};stroke-width:6;stroke-linecap:round`},D));
  const loci=[[200,'A','a'],[340,'B','B'],[470,'d','d']];const MT='font-family:var(--f-math);font-style:italic;font-size:20px';
  const src=[];loci.forEach(([x,u,l])=>{[y1,y2].forEach((y,j)=>{H.E('line',{x1:x,y1:y-12,x2:x,y2:y+12,st:'stroke:var(--ink);stroke-width:2.5'},D);
    const yy=y+(j?32:-18);lbl(D,x,yy,j?l:u,'lb',{st:MT});src.push([x,yy,j?l:u])})});
  lbl(D,x0-14,y1+5,'homolog 1','lbs',{'text-anchor':'end'});lbl(D,x0-14,y2+5,'homolog 2','lbs',{'text-anchor':'end'});
  /* genotype: the letters travel down from the diagram */
  const Gt=H.g(s);H.O(Gt,0,{d:0});lbl(Gt,150,362,'genotype','lb',{'text-anchor':'end'});
  const slots=[[196,'/'],[290,'/'],[384,'/']];slots.forEach(([x,t])=>lbl(Gt,x,362,t,'lb',{st:MT}));
  const mv=src.map(([x,y,t],i)=>{const e=lbl(s,0,0,t,'lb',{st:MT});H.T(e,{x,y},{d:0});H.O(e,0,{d:0});const k=Math.floor(i/2);e.to=[[196,290,384][k]+(i%2?16:-16),362];return e});
  const Ph=H.g(s);H.O(Ph,0,{d:0});const ar=mkA(Ph,424,356,474,356,{w:1.8,h:7});H.txt(Ph,482,352,'phenotype','lb');H.txt(Ph,482,370,'a detectable trait','lbs');
  return [()=>{H.O(gL,1)},()=>{H.O(Z,1,{d:700})},()=>{H.O(D,1,{d:700})},
    ()=>{H.O(Gt,1,{at:600});mv.forEach((e,i)=>{H.O(e,1,{d:200});H.T(e,{x:e.to[0],y:e.to[1]},{d:1200,at:i*90})})},
    ()=>{H.O(Ph,1);drawA(ar)}];}},

/* 4 ─────────────────────────────── */
{sec:'9.2',title:'Writing Alleles: Plus, Minus and Slash',caption:'Fruit flies: the top fly has vestigial wings · photo: Salem.slima, CC BY-SA 4.0, via Wikimedia Commons',
text:`<p data-step="0">Each gene has a name and a short symbol, usually in italics. In the fruit fly <i>Drosophila</i>, <i>v</i> is vermilion, <i>vg</i> is vestigial and <i>vvl</i> is ventral veins lacking. Other organisms can use a symbol for a different gene.</p>
<p data-step="1">A superscript plus marks the wild-type allele: <i>vg</i><sup>+</sup>. A plus sign alone also means the wild-type allele.</p>
<p data-step="2">A superscript minus marks a <b>mutant</b> allele: <i>vg</i><sup>−</sup>. Often the symbol has no superscript: <i>vg</i>. One gene can have many mutant alleles.</p>
<p data-step="3">A slash separates the alleles on the two homologs. A <i>vg</i><sup>+</sup>/<i>vg</i> fly (short form +/<i>vg</i>) has one wild-type allele and one mutant allele.</p>
<p data-step="4">In some species, an uppercase letter marks a <b>dominant</b> allele (it shows its trait in one copy). A lowercase letter marks a <b>recessive</b> allele. In peas, <i>R</i> (round seed) is dominant to <i>r</i> (wrinkled seed).</p>
<p data-step="4" class="note">In <i>r</i>, extra DNA breaks the gene <i>SBE1</i>, so the seed lacks starch-branching enzyme 1. The seed keeps more sugar, takes up more water, and wrinkles as it dries.</p>`,
star:'Plus = wild type. Minus or no mark = mutant. Slash = the line between two homologs.',starStep:3,
scene(H){const s=ST();const k=372/640;
  H.E('image',{href:'@@asset:c9-fly-vestigial.jpg@@',x:2,y:6,width:372,height:682*k},s);
  const R1=ring(s,2+352*k,6+118*k,64,52),R2=ring(s,2+300*k,6+330*k,62,58);
  const P1=plate(s,246,28,'vestigial wings','start'),P2=plate(s,22,330,'wild-type wings','start');
  const MT='font-family:var(--f-math);font-style:italic;';
  const A=H.g(s);H.O(A,0,{d:0});cap(A,510,30,'Fruit fly gene symbols');
  [['v','vermilion eyes'],['vg','vestigial wings'],['vvl','ventral veins lacking']].forEach(([a,b],i)=>{H.txt(A,404,58+i*24,a,'lb',{st:MT+'font-size:16px'});H.txt(A,446,58+i*24,b,'lbs')});
  const B=H.g(s);H.O(B,0,{d:0});sym(B,452,160,[['vg',''],['+','sup']],{st:'font-size:26px'});lbl(B,452,184,'wild type','lbs');
  const C=H.g(s);H.O(C,0,{d:0});sym(C,566,160,[['vg',''],['−','sup'],['  or  ',''],['vg','']],{st:'font-size:22px'});lbl(C,566,184,'mutant','lbs');
  const D=H.g(s);H.O(D,0,{d:0});
  strand(D,{L:180,color:'dad',x:512,y:222,tags:[[0,'vg+']]});strand(D,{L:180,color:'mom',x:512,y:256,tags:[[0,'vg']]});
  lbl(D,414,227,'homolog 1','lbs',{'text-anchor':'end'});lbl(D,414,261,'homolog 2','lbs',{'text-anchor':'end'});
  const D2=H.g(s);H.O(D2,0,{d:0});sym(D2,512,304,[['vg',''],['+','sup'],[' / vg','']],{st:'font-size:26px'});lbl(D2,512,326,'short form:  + / vg','lbs');
  const E=H.g(s);H.O(E,0,{d:0});H.E('line',{x1:400,y1:346,x2:630,y2:346,st:'stroke:var(--faint);stroke-width:1.5'},E);
  sym(E,452,378,[['R',''],[' / ',''],['r','']],{st:'font-size:24px'});lbl(E,452,400,'pea: round / wrinkled','lbs');
  lbl(E,574,374,'r = SBE1 gene','lbs');lbl(E,574,390,'with extra DNA','lbs');
  return [()=>{H.O(A,1)},()=>{H.O(B,1);H.D(R2,1,{d:900});H.O(P2,1,{at:400})},()=>{H.O(C,1);H.D(R1,1,{d:900});H.O(P1,1,{at:400})},()=>{H.O(D,1);H.O(D2,1,{at:500})},()=>{H.O(E,1)}];}},

/* 5 ─────────────────────────────── */
{sec:'9.3',title:'Recombination: New Combinations of Alleles',caption:'Tag border: blue = allele from the father, orange = allele from the mother',
text:`<p data-step="0">In genetics, <b>recombination</b> is any process that makes gametes with combinations of alleles that were not in the gametes of the parents.</p>
<p data-step="1">Example: an individual got A and B together from its father, and a and b together from its mother. Its gametes AB and ab are <b>parental</b>. Its gametes Ab and aB are new combinations, so they are <b>recombinant</b>.</p>
<p data-step="2"><b>Interchromosomal recombination</b> occurs when the two genes are on different chromosomes. Independent assortment of the chromosomes in <b>meiosis I</b> (the first of the two divisions of meiosis) makes the new combinations.</p>
<p data-step="3"><b>Intrachromosomal recombination</b> occurs when the two genes are on the same chromosome. A crossover between the two loci makes the new combinations.</p>
<p data-step="4">Both kinds occur in meiosis. Some species also recombine in <b>mitosis</b> (the division that makes body cells), but rarely. Recombination increases the genetic variation in a <b>population</b> (a group of individuals of one species). The variation lets populations change over many generations.</p>`,
star:'Parental = the combination you inherited. Recombinant = a new combination.',starStep:1,
scene(H){const s=ST();
  const two=(p,x,y,a,b,ca,cb)=>{const G=H.g(p);H.E('circle',{r:30,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.2'},G);
    tag(G,-11,0,a,{stroke:ca});tag(G,11,0,b,{stroke:cb});G.querySelectorAll('rect').forEach(r=>r.style.strokeWidth=2.6);H.T(G,{x,y},{d:0});return G};
  const F=H.g(s);H.E('circle',{cx:250,cy:105,r:52,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},F);lbl(F,250,176,'the individual','lbs');H.O(F,0,{d:0});
  const gd=two(s,90,60,'A','B','dad','dad'),gm=two(s,90,150,'a','b','mom','mom');
  lbl(s,90,22,'from father','lbs');lbl(s,90,198,'from mother','lbs');
  const outs=[['A','B','dad','dad','P'],['a','b','mom','mom','P'],['A','b','dad','mom','R'],['a','B','mom','dad','R']].map(([a,b,ca,cb,t],i)=>{const x=372+i*72;
    const g=two(s,250,105,a,b,ca,cb);hide(g);const c=chip(s,x,152,t);H.O(c,0,{d:0});g.x=x;g.c=c;return g});
  const tP=lbl(s,408,184,'parental','lbs'),tR=lbl(s,552,184,'recombinant','lbs');H.O([tP,tR],0,{d:0});
  /* route cards */
  const card=(x,title,sub)=>{const G=H.g(s);H.E('rect',{x,y:222,width:296,height:178,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},G);
    cap(G,x+148,246,title);lbl(G,x+148,388,sub,'lbs');H.O(G,0,{d:0});return G};
  const c1=card(10,'Genes on different chromosomes','independent assortment in meiosis I');
  strand(c1,{L:110,color:'dad',x:90,y:290,tags:[[-20,'A']],ts:.85});strand(c1,{L:110,color:'mom',x:90,y:316,tags:[[-20,'a']],ts:.85});
  strand(c1,{L:76,color:'dad',x:226,y:290,tags:[[10,'B']],ts:.85});strand(c1,{L:76,color:'mom',x:226,y:316,tags:[[10,'b']],ts:.85});
  const sw=mkA(c1,158,348,198,348,{w:1.6,h:6});lbl(c1,158,368,'pairs align either way','lbs');
  const c2=card(334,'Genes on one chromosome','a crossover between the loci');
  strand(c2,{L:220,color:'dad',x:482,y:290,tags:[[-70,'A'],[70,'B']],ts:.85});strand(c2,{L:220,color:'mom',x:482,y:316,tags:[[-70,'a'],[70,'b']],ts:.85});
  const X=H.g(c2);H.E('path',{d:'M470,276 L494,330 M494,276 L470,330',st:'stroke:var(--hi);stroke-width:4;stroke-linecap:round'},X);lbl(c2,482,356,'crossover','lbs');
  return [
    ()=>{H.O(F,1,{d:400});H.T(gd,{x:250,y:90,s:.9},{d:1200});H.T(gm,{x:250,y:122,s:.9},{d:1200});H.O([gd.firstChild,gm.firstChild],0,{d:700,at:600})},
    ()=>{outs.forEach((g,i)=>{pop(g,{at:i*150});H.T(g,{x:g.x,y:105},{d:1000,at:i*150});H.O(g.c,1,{at:900+i*150})});H.O([tP,tR],1,{at:1400})},
    ()=>{H.O(c1,1);drawA(sw,{at:300})},
    ()=>{H.O(c2,1)},
    ()=>{outs.slice(2).forEach(g=>{H.T(g,{s:1.2},{d:400});H.after(450,()=>H.T(g,{s:1},{d:400}))})},
  ];}},

/* 6 ─────────────────────────────── */
{sec:'9.3',title:'Interchromosomal Recombination',caption:'Metaphase I · gene A on the long pair, gene B on the short pair · blue = from the father, orange = from the mother',
text:`<p data-step="0">Suppose that gene A and gene B are on different chromosomes. An individual got the gamete Ab from its father (blue) and aB from its mother (orange).</p>
<p data-step="0">In <b>metaphase I</b> (a stage of meiosis I), each pair of homologs aligns at the middle of the cell. Each homolog faces one end of the cell, a <b>pole</b>. Each pair can face either way.</p>
<p data-step="1"><b>Arrangement 1.</b> Both blue chromosomes face the same pole. The gametes are Ab and aB, the parental combinations.</p>
<p data-step="2"><b>Arrangement 2.</b> The short pair faces the other way. The gametes are AB and ab, which are recombinant.</p>
<p data-step="3">The two arrangements are equally likely, and each occurs in half of all meioses. So half of all gametes are recombinant. For genes on different chromosomes, the fraction of recombinant gametes is always about 50%.</p>`,
star:'Different chromosomes: a coin toss in metaphase I. 50% recombinant.',starStep:3,
scene(H){const s=ST();const cx=320,cy=150,yL=112,yS=196;
  H.E('circle',{cx,cy,r:108,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},s);
  H.E('line',{x1:cx,y1:cy-92,x2:cx,y2:cy+92,st:'stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 5'},s);
  H.centrosome(s,cx-92,cy);H.centrosome(s,cx+92,cy);
  const mk=(x,y,c,L,t)=>{const G=H.chromosome(s,{L1:L,L2:L,w:7,color:c,state:'x',x,y});tag(G,0,-L-15,t,{s:.85});return G};
  const bL=mk(302,yL,'dad',26,'A'),oL=mk(338,yL,'mom',26,'a'),bS=mk(302,yS,'dad',17,'b'),oS=mk(338,yS,'mom',17,'B');
  const nm=H.txt(s,cx,30,'','lb',{'text-anchor':'middle'});
  const gam=(x,longC,longT,shortC,shortT,from)=>{const G=H.g(s);H.E('circle',{cx:x,cy:332,r:34,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.2'},G);H.O(G,0,{d:0});
    const a=strand(s,{L:48,w:6,color:longC,tags:[[-8,longT]],ts:.8,x:from[0],y:from[1]}),b=strand(s,{L:32,w:6,color:shortC,tags:[[4,shortT]],ts:.8,x:from[0],y:from[2]});H.O([a,b],0,{d:0});
    return {G,a,b,x}};
  const G1=[gam(66,'dad','A','dad','b',[302,yL,yS]),gam(166,'mom','a','mom','B',[338,yL,yS])];
  const G2=[gam(474,'dad','A','mom','B',[302,yL,yS]),gam(574,'mom','a','dad','b',[338,yL,yS])];
  const lab=(x,t,c)=>{const e=lbl(s,x,388,t);H.O(e,0,{d:0});return e};
  const L1=[lab(66,'Ab'),lab(166,'aB')],L2=[lab(474,'AB'),lab(574,'ab')];
  const k1=[chip(s,66,410,'P'),chip(s,166,410,'P')],k2=[chip(s,474,410,'R'),chip(s,574,410,'R')];H.O([...k1,...k2],0,{d:0});
  const A1=mkA(s,262,214,170,282),A2=mkA(s,378,214,470,282);
  const half=[lbl(s,116,286,'arrangement 1','lbs'),lbl(s,524,286,'arrangement 2','lbs')];H.O(half,0,{d:0});
  const tot=H.g(s);H.O(tot,0,{d:0});H.E('rect',{x:236,y:300,width:168,height:64,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},tot);
  lbl(tot,320,326,'2 of 4 gamete types','lbs');lbl(tot,320,352,'50% recombinant','lb');
  const out=(Gs,Ls,Ks)=>Gs.forEach((g,i)=>{H.O(g.G,1,{at:300});H.O([g.a,g.b],1,{d:200});H.T(g.a,{x:g.x,y:323},{d:1200,at:i*120});H.T(g.b,{x:g.x,y:343},{d:1200,at:i*120});H.O([Ls[i],Ks[i]],1,{at:1100})});
  return [
    ()=>{nm.textContent='Metaphase I'},
    ()=>{drawA(A1);H.O(half[0],1);out(G1,L1,k1)},
    ()=>{H.T(bS,{x:320,y:yS+40},{d:600});H.T(oS,{x:320,y:yS-40},{d:600});H.after(650,()=>{H.T(bS,{x:338,y:yS},{d:700});H.T(oS,{x:302,y:yS},{d:700})});
      H.after(1400,()=>{drawA(A2);H.O(half[1],1);out(G2,L2,k2)})},
    ()=>{H.O(tot,1)},
  ];}},

/* 7 ─────────────────────────────── */
{sec:'9.3',title:'One Chromosome: Crossing Over',caption:'One bivalent (two synapsed homologs): 4 chromatids · centromeres (where sister chromatids join) not shown',
text:`<p data-step="0">In <b>prophase I</b> (the first stage of meiosis I), each chromosome pairs with its homolog along its full length. The pairing is <b>synapsis</b>. Each homolog has two identical <b>sister chromatids</b> (DNA copies), so a synapsed pair has four chromatids.</p>
<p data-step="1">An <b>enzyme</b> (a protein that speeds up a reaction) cuts both DNA strands of one chromatid. Repair enzymes copy the matching DNA of a <b>non-sister chromatid</b> (a chromatid of the other homolog). The non-sister chromatid acts as the <b>template</b>, the pattern to copy.</p>
<p data-step="2">Some of these repairs end in an exchange: each chromatid joins to the other at that position. The two non-sister chromatids then swap matching segments. The exchange is a <b>crossover</b>.</p>
<p data-step="3">The crossover is between locus A and locus B. So two chromatids now carry Ab and aB, and two keep AB and ab.</p>
<p data-step="4">Each chromatid goes into a different gamete. So one crossover between two loci makes 2 recombinant gametes out of 4.</p>
<p data-step="4" class="note">Each pair of homologs usually has at least one crossover per meiosis. In humans, each pair has one to a few.</p>`,
star:'One crossover involves only 2 of the 4 chromatids.',starStep:4,
scene(H){const s=ST();const xa=190,xb=450,xc=320;
  const T=tetrad(s,{x0:110,x1:530,ys:[92,116,158,182],breaks:[xc],loci:[{x:xa,lab:['A','A','a','a']},{x:xb,lab:['B','B','b','b']}],w:9,ts:.9});
  H.O(T.g,0,{d:0});
  const br=H.g(s);H.O(br,0,{d:0});
  [[92,116,'sister'],[158,182,'sister']].forEach(([a,b,t])=>{H.E('path',{d:`M100,${a-6} L94,${a-6} L94,${b+6} L100,${b+6}`,cls:'k',st:'stroke-width:1.5'},br);lbl(br,88,(a+b)/2-2,t,'lbs',{'text-anchor':'end'});lbl(br,88,(a+b)/2+12,'chromatids','lbs',{'text-anchor':'end'})});
  const ns=H.g(s);H.O(ns,0,{d:0});H.E('path',{d:'M544,116 L552,116 L552,158 L544,158',cls:'k',st:'stroke-width:1.5'},ns);lbl(ns,560,134,'non-','lbs',{'text-anchor':'start'});lbl(ns,560,148,'sisters','lbs',{'text-anchor':'start'});
  const sp=[spark(s,xc,116,10),spark(s,xc,158,10)];
  const tpl=H.g(s);H.O(tpl,0,{d:0});H.E('rect',{x:xc-60,y:150,width:120,height:16,rx:8,st:'fill:none;stroke:var(--hi);stroke-width:2.5;stroke-dasharray:5 4'},tpl);lbl(tpl,xc,214,'template for the repair','lbs',{st:'font-weight:700;fill:var(--ink)'});
  const chL=H.g(s);H.O(chL,0,{d:0});H.E('path',{d:`M${xc},128 L${xc},146`,st:'stroke:var(--hi);stroke-width:4;stroke-linecap:round'},chL);lbl(chL,xc,40,'crossover','lb');H.E('path',{d:`M${xc},46 L${xc},84`,cls:'k',st:'stroke-width:1.3'},chL);
  const labs=['AB','Ab','aB','ab'],kinds=['P','R','R','P'];
  const ch=[0,1,2,3].map(r=>{const G=H.g(s);const c=chip(G,0,0,kinds[r]);lbl(G,30,5,labs[r],'lb',{'text-anchor':'start'});H.T(G,{x:572,y:T.ys[r]},{d:0});H.O(G,0,{d:0});return G});
  const gy=[150,196,242,288];
  const cells=gy.map(y=>{const e=H.E('rect',{x:94,y:y-17,width:452,height:34,rx:17,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},s);H.O(e,0,{d:0});return e});
  cells.forEach(c=>s.insertBefore(c,s.firstChild));
  const tot=lbl(s,320,340,'2 of 4 gametes recombinant','lb');H.O(tot,0,{d:0});
  return [
    ()=>{H.O([T.g,br],1,{d:800})},
    ()=>{flash(sp[0]);H.O(ns,1);T.segs.forEach(S=>{if(S.row===1&&S.k===1)H.T(S.G,{x:7},{d:400,at:300})});H.O(tpl,1,{at:500})},
    ()=>{H.O([ns,tpl],0,{d:300});T.xo(0,1,2,{d:1300});H.O(chL,1,{at:900})},
    ()=>{const r=T.rec(xa,xb);ch.forEach((G,i)=>H.O(G,1,{at:i*150}))},
    ()=>{H.O([chL,br],0,{d:300});T.ys=gy.slice();T.place({d:1300});ch.forEach((G,i)=>H.T(G,{y:gy[i]},{d:1300}));H.O(cells,1,{at:900});H.O(tot,1,{at:1300})},
  ];}},

/* 8 ─────────────────────────────── */
{sec:'9.1',title:'Morgan’s Flies and the First Genetic Map',caption:'Morgan: photographer unknown, public domain (US National Library of Medicine) · drawing: T. H. Morgan 1916 · map: A. H. Sturtevant 1913 · both public domain',
text:`<p data-step="0">In 1905, William Bateson, Edith Saunders and Reginald Punnett crossed sweet peas. Two pairs of traits did not assort independently. They did not know the cause.</p>
<p data-step="1">Thomas Hunt Morgan studied the fruit fly <i>Drosophila</i> at Columbia University in New York. In 1911, he found that some genes on the X chromosome (a sex chromosome) stayed together in most offspring, but split in a few.</p>
<p data-step="2">Morgan proposed that the homologs twist around each other and exchange segments: crossing over. He also proposed that genes farther apart split more often. His drawing from 1916 shows the idea.</p>
<p data-step="3">His student Alfred Sturtevant used the percentage of recombinant offspring to place genes of the X chromosome in order along a line. His 1913 map was the first <b>genetic map</b>. One map unit is 1% recombination.</p>`,
star:'More recombination = farther apart. Sturtevant turned counts into a map.',starStep:3,
scene(H){const s=ST();
  const tl=H.g(s);H.E('line',{x1:60,y1:392,x2:580,y2:392,st:'stroke:var(--faint);stroke-width:2'},tl);
  const ev=[[100,'1905','Bateson, Saunders, Punnett'],[320,'1911','Morgan'],[540,'1913','Sturtevant']];
  const dots=ev.map(([x,y,t])=>{const G=H.g(tl);H.E('circle',{cx:x,cy:392,r:6,st:'fill:var(--ink)'},G);lbl(G,x,378,y,'lb',{st:'font-size:13px'});lbl(G,x,412,t,'lbs');H.O(G,.18,{d:0});return G});
  const ph=H.g(s);H.O(ph,0,{d:0});H.E('image',{href:'@@asset:c9-morgan.jpg@@',x:8,y:10,width:168,height:224},ph);lbl(ph,92,252,'Thomas Hunt Morgan','lbs');
  const dr=H.g(s);H.O(dr,0,{d:0});H.E('rect',{x:196,y:8,width:184,height:250,rx:6,st:'fill:#fff;stroke:var(--faint)'},dr);H.E('image',{href:'@@asset:c9-morgan-1916-crossover.jpg@@',x:199,y:11,width:178,height:178*660/480},dr);
  const ann=H.g(s);H.O(ann,0,{d:0});[[392,34,'1. the homologs twist'],[392,104,'2. they break'],[392,120,'and rejoin'],[392,232,'3. segments swapped'],[392,250,'Morgan’s drawing, 1916']].forEach(([x,y,t],i)=>H.txt(ann,x,y,t,i===4?'cap':'lbs',i===4?{st:'font-size:9.5px'}:{}));
  const mp=H.g(s);H.O(mp,0,{d:0});H.E('rect',{x:12,y:270,width:616,height:96,rx:8,st:'fill:#fff;stroke:var(--faint)'},mp);
  const MX=v=>24+592*v/850;H.E('image',{href:'@@asset:c9-sturtevant-1913-map.png@@',x:24,y:276,width:592,height:592*67/850},mp);
  [[MX(16),'yellow body','start',342],[MX(35),'white eyes','start',358],[MX(458),'vermilion eyes','end',342],[MX(479),'miniature wings','start',342],[MX(838),'rudimentary wings','end',358]].forEach(([x,t,an,y])=>{
    H.E('line',{x1:x,y1:324,x2:x,y2:y-3,st:'stroke:#9ba3b4;stroke-width:1'},mp);H.txt(mp,x+(an==='end'?-3:3),y,t,'lbs',{'text-anchor':an,st:'fill:#5a6172;font-size:11px'})});
  const on=i=>dots.forEach((d,j)=>H.O(d,j<=i?1:.18));
  return [()=>{on(0)},()=>{on(1);H.O(ph,1,{d:700})},()=>{on(1);H.O(dr,1,{d:700});H.O(ann,1,{at:600})},()=>{on(2);H.O(mp,1,{d:700})}];}},

/* 9 ─────────────────────────────── */
{sec:'9.3',title:'Parental or Recombinant? Check the P Generation',caption:'P = parental generation · F1 = their offspring · each bar is one homolog',
text:`<p data-step="0">To label gametes as parental or recombinant, you must know the genotypes of the parents, the <b>P generation</b>. The easiest parents are <b>homozygous</b>: each has two identical alleles of each gene.</p>
<p data-step="1">A parent with genotype A/A B/B makes only one type of gamete: AB. A parent with genotype a/a b/b makes only ab.</p>
<p data-step="2">The two gametes join and make a <b>dihybrid</b>, an individual that is <b>heterozygous</b> (has two different alleles) for both genes. The dihybrid is the <b>F1</b> generation. Its genotype is A/a B/b. You can write it as AB/ab, with each side of the slash as one homolog.</p>
<p data-step="3">The F1 can make four types of gamete. AB and ab are <b>parental</b>, because the F1 got them from its parents. Ab and aB are <b>recombinant</b>.</p>
<p data-step="4">Now suppose that the P generation is A/A b/b and a/a B/B. The F1 is then Ab/aB. Its parental gametes are Ab and aB, and its recombinant gametes are AB and ab.</p>
<p data-step="4" class="note">A/a B/b (or Aa Bb) lists the alleles but not their arrangement. AB/ab and Ab/aB also show which alleles share a homolog.</p>`,
star:'Parental means “as the F1 received it from the P generation.”',starStep:4,
scene(H){const s=ST();
  cap(s,82,26,'P generation');cap(s,262,26,'F1');cap(s,500,26,'Gametes of the F1');
  const par=(y,c,t1,t2)=>{const G=H.g(s);H.E('circle',{cx:82,cy:y,r:52,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.2'},G);
    const a=strand(G,{L:76,color:c,x:82,y:y-14,tags:[[-20,t1],[20,t2]],ts:.85}),b=strand(G,{L:76,color:c,x:82,y:y+14,tags:[[-20,t1],[20,t2]],ts:.85});G.st=[a,b];return G};
  const P1=par(100,'dad','A','B'),P2=par(258,'mom','a','b');
  const gt=[lbl(s,82,172,'A/A B/B','lbs'),lbl(s,82,330,'a/a b/b','lbs')];
  const gc=[H.E('circle',{cx:170,cy:114,r:26,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},s),H.E('circle',{cx:170,cy:244,r:26,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},s)];H.O(gc,0,{d:0});
  const F=H.g(s);H.E('circle',{cx:262,cy:180,r:58,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},F);H.O(F,0,{d:0});
  const mv=[strand(s,{L:76,color:'dad',x:82,y:114,tags:[[-20,'A'],[20,'B']],ts:.85}),strand(s,{L:76,color:'mom',x:82,y:244,tags:[[-20,'a'],[20,'b']],ts:.85})];H.O(mv,0,{d:0});
  const fl=lbl(s,262,262,'AB / ab','lb',{st:'font-family:var(--f-math);font-style:italic;font-size:19px'});H.O(fl,0,{d:0});
  const rows=[['A','B','AB'],['a','b','ab'],['A','b','Ab'],['a','B','aB']];const set1=[['dad','dad'],['mom','mom'],['dad','mom'],['mom','dad']],set2=[['dad','mom'],['mom','dad'],['dad','dad'],['mom','mom']];
  const ys=[76,148,220,292];
  const out=rows.map(([a,b,n],i)=>{const st=strand(s,{segs:[[-34,0,set1[i][0]],[0,34,set1[i][1]]],tags:[[-17,a],[17,b]],ts:.85,x:262,y:i===0||i===3?166:194});H.O(st,0,{d:0});
    const c=chip(s,560,ys[i],i<2?'P':'R');H.O(c,0,{d:0});return {st,c,y:ys[i]}});
  const k1=lbl(s,600,ys[0]+5,'','lbs',{'text-anchor':'start'});
  const ex=H.g(s);H.O(ex,0,{d:0});H.E('rect',{x:368,y:336,width:262,height:70,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},ex);
  lbl(ex,499,362,'P generation A/A b/b × a/a B/B','lbs');lbl(ex,499,388,'F1 = Ab / aB: the labels swap','lb');
  return [
    ()=>{},
    ()=>{H.O(gc,1,{d:400});H.O(mv,1,{d:300});H.T(mv[0],{x:170,y:114,s:.5},{d:1000});H.T(mv[1],{x:170,y:244,s:.5},{d:1000})},
    ()=>{H.O(F,1,{d:400});H.O(gc,0,{d:600,at:500});H.T(mv[0],{x:262,y:166,s:1},{d:1200});H.T(mv[1],{x:262,y:194,s:1},{d:1200});H.O(fl,1,{at:1000})},
    ()=>{out.forEach((o,i)=>{H.O(o.st,1,{d:200,at:i*150});H.T(o.st,{x:470,y:o.y},{d:1100,at:i*150});H.O(o.c,1,{at:900+i*150})})},
    ()=>{H.O(ex,1);[P1.st,P2.st].forEach((pair,j)=>pair.forEach(st=>{st.tags[1].t.textContent=j?'B':'b'}));
      mv[0].tags[1].t.textContent='b';mv[1].tags[1].t.textContent='B';fl.textContent='Ab / aB';gt[0].textContent='A/A b/b';gt[1].textContent='a/a B/B';
      out.forEach((o,i)=>{recol(o.st,set2[i]);H.after(300,()=>setChip(o.c,i<2?'R':'P'));H.T(o.c,{s:1.3},{d:300});H.after(350,()=>H.T(o.c,{s:1},{d:300}))})},
  ];}},

/* 10 ─────────────────────────────── */
{sec:'9.3',title:'Recombination Frequency',caption:'10 meioses of an AB/ab individual · each bar is one chromatid · dotted lines: loci A and B',
text:`<p data-step="0">The <b>recombination frequency (RF)</b> is the fraction of gametes (or offspring) that are recombinant:</p>
<p data-step="0" class="m" style="font-size:20px">RF = recombinants ÷ total</p>
<p data-step="0">Multiply RF by 100 to give a percentage.</p>
<p data-step="1">Count the gametes from 10 meioses of an AB/ab individual. Each meiosis sorts 4 chromatids into 4 gametes. So there are 40 gametes in total.</p>
<p data-step="2">In 4 of the 10 meioses, a crossover falls between locus A and locus B. Each of these crossovers makes 2 recombinant chromatids. In 2 other meioses, a crossover falls outside the A–B region, so A and B stay together.</p>
<p data-step="3">RF = 8 ÷ 40 = 0.20, or 20%. A meiosis with a crossover makes only 2 recombinants out of 4. So RF is half of the fraction of meioses with a crossover between the loci: ½ × 4/10 = 20%.</p>`,
star:'RF = recombinants ÷ total.',starStep:0,
scene(H){const s=ST();const cxs=[66,192,318,444,570],tops=[70,200];
  const hl=H.g(s);const M=[];
  const plan=[[null],[4,1,2],[46,0,3],[null],[-8,1,3],[null],[12,0,2],[-44,1,2],[-4,0,3],[null]];
  plan.forEach((pl,i)=>{const cx=cxs[i%5],y0=tops[Math.floor(i/5)];const G=H.g(s);H.O(G,0,{d:0});
    const brk=pl[0]==null?[]:[cx+pl[0]];
    const T=tetrad(G,{x0:cx-54,x1:cx+54,ys:[y0,y0+9,y0+22,y0+31],breaks:brk,w:5});
    [cx-30,cx+30].forEach((x,j)=>{H.E('line',{x1:x,y1:y0-14,x2:x,y2:y0+45,st:'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:2 3'},G);lbl(G,x,y0-18,j?'B':'A','lbs',{st:'font-weight:700'})});
    lbl(G,cx,y0+64,'meiosis '+(i+1),'lbs');
    const sp=pl[0]==null?null:spark(G,cx+pl[0],y0+15,9);
    M.push({G,T,pl,cx,y0,sp})});
  const box=H.g(s);H.O(box,0,{d:0});H.E('rect',{x:120,y:320,width:400,height:84,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},box);
  const nT=lbl(box,232,352,'','big',{st:'font-size:30px'}),nR=lbl(box,408,352,'','big',{st:'font-size:30px'});lbl(box,232,374,'gametes (chromatids)','lbs');lbl(box,408,374,'recombinant','lbs');
  const f0=lbl(s,320,360,'RF = recombinants ÷ total','lb',{st:'font-family:var(--f-math);font-style:italic;font-size:26px'});
  const f1=lbl(s,320,398,'RF = 8 ÷ 40 = 0.20 = 20%','lb',{st:'font-family:var(--f-math);font-style:italic;font-size:22px'});H.O(f1,0,{d:0});
  const pc={set textContent(v){nT.textContent=v}},pr={set textContent(v){nR.textContent=v}};
  return [
    ()=>{},
    ()=>{H.O(f0,0,{d:300});H.O(box,1);M.forEach((m,i)=>H.O(m.G,1,{at:i*80}));cnt(pc,0,40,{d:1000});pr.textContent=0},
    ()=>{M.forEach((m,i)=>{if(m.pl[0]==null)return;const at=i*90;if(m.sp)flash(m.sp,at);H.after(at+300,inst=>{m.T.xo(0,m.pl[1],m.pl[2],{d:inst?0:900});
        H.after(inst?0:1000,()=>{const r=m.T.rec(m.cx-30,m.cx+30);r.forEach((v,row)=>{if(!v)return;const y=m.T.ys[row];
          const e=H.E('rect',{x:m.cx-60,y:y-5,width:120,height:10,rx:5,st:'fill:var(--hi);opacity:.9'},hl);if(!inst){e.style.opacity=0;e.getBoundingClientRect();e.style.transition='opacity .5s';e.style.opacity=.9}})})})});
      cnt(pr,0,8,{d:900,at:1600})},
    ()=>{H.T(box,{y:-30},{d:800});H.O(f1,1,{at:500})},
  ];}},

/* 11 ─────────────────────────────── */
{sec:'9.3',title:'Why RF Is Never More Than 50%',caption:'Yellow band = recombinant chromatid · dotted lines: loci A and B · first crossover drawn between the middle two chromatids',
text:`<p data-step="0">One crossover between two loci involves only 2 of the 4 chromatids, so it makes 2 recombinants out of 4 (50%). A meiosis with no crossover there makes 0%.</p>
<p data-step="1">Loci far apart often have two crossovers between them. Assume that each crossover involves a random pair of non-sister chromatids. Then the second crossover has 4 equally likely cases. <b>Case 1:</b> it involves the same two chromatids and undoes the first crossover. 0 of 4 are recombinant.</p>
<p data-step="2"><b>Cases 2 and 3:</b> the second crossover involves one chromatid that the first crossover did not involve. 2 of 4 are recombinant.</p>
<p data-step="3"><b>Case 4:</b> the second crossover involves the other two chromatids. All 4 are recombinant.</p>
<p data-step="4">The 4 cases have 16 chromatids, and 0 + 2 + 2 + 4 = 8 are recombinant: 8 ÷ 16 = 50%. Three or more crossovers also give 50%. So RF = ½ × (fraction of meioses with a crossover between the loci), and RF is never more than 50%.</p>`,
star:'On average, crossovers involve half of the chromatids, so RF cannot go above 50%.',starStep:4,
scene(H){const s=ST();
  const mk=(cx,y0,half,brk,title)=>{const G=H.g(s);G.hg=H.g(G);const T=tetrad(G,{x0:cx-half,x1:cx+half,ys:[y0,y0+9,y0+22,y0+31],breaks:brk,w:5.5});
    [cx-half+28,cx+half-28].forEach((x,j)=>{H.E('line',{x1:x,y1:y0-12,x2:x,y2:y0+43,st:'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:2 3'},G);lbl(G,x,y0-16,j?'B':'A','lbs',{st:'font-weight:700'})});
    if(title)H.txt(G,cx-half,y0-30,title,'lbs',{st:'font-weight:600;fill:var(--ink)'});
    const res=lbl(G,cx,y0+58,'','lb');G.T=T;G.res=res;G.cx=cx;G.half=half;G.y0=y0;G.sp=brk.map(x=>spark(G,x,y0+15,9));H.O(G,0,{d:0});return G};
  const glow=(G,inst)=>{const r=G.T.rec(G.cx-G.half+28,G.cx+G.half-28);let n=0;r.forEach((v,row)=>{if(!v)return;n++;const y=G.T.ys[row];
      const e=H.E('rect',{x:G.cx-G.half-5,y:y-5,width:2*G.half+10,height:10,rx:5,st:'fill:var(--hi);opacity:.9'},G.hg);if(!inst){e.style.opacity=0;e.getBoundingClientRect();e.style.transition='opacity .5s';e.style.opacity=.9}});
    G.res.textContent=`${n} of 4 recombinant`;return n};
  const run=(G,pairs,at)=>{H.O(G,1,{d:300,at});pairs.forEach(([b,i,j],k)=>{const t=at+300+k*1300;flash(G.sp[b],t);H.after(t+300,inst=>G.T.xo(b,i,j,{d:inst?0:900}))});
    H.after(at+300+pairs.length*1300,inst=>glow(G,inst))};
  const one=mk(320,40,150,[320],'1 crossover between the loci');
  const cs=[[165,170],[475,170],[165,290],[475,290]].map(([cx,y],i)=>mk(cx,y,125,[cx-30,cx+30],['Case 1: the same pair again','Case 2: one different chromatid','Case 3: one different chromatid','Case 4: the other pair'][i]));
  const plan=[[[0,1,2],[1,1,2]],[[0,1,2],[1,0,2]],[[0,1,2],[1,1,3]],[[0,1,2],[1,0,3]]];
  const sum=H.g(s);H.O(sum,0,{d:0});H.E('rect',{x:120,y:372,width:400,height:40,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},sum);
  lbl(sum,320,399,'(0 + 2 + 2 + 4) ÷ 16 = 8 ÷ 16 = 50%','lb',{st:'font-family:var(--f-math);font-style:italic;font-size:19px'});
  return [
    ()=>{run(one,[[0,1,2]],0)},
    ()=>{H.O(one,.35,{d:500});run(cs[0],plan[0],0)},
    ()=>{run(cs[1],plan[1],0);run(cs[2],plan[2],300)},
    ()=>{run(cs[3],plan[3],0)},
    ()=>{H.O(sum,1)},
  ];}},

/* 12 ─────────────────────────────── */
{sec:'9.5',title:'Farther Apart, More Recombination',caption:'Curve assumes that crossovers fall at random positions · ticks = crossover positions from many meioses',
text:`<p data-step="0">A crossover can form at almost any position along a chromosome. So a long stretch of DNA between two loci gets more crossovers than a short stretch.</p>
<p data-step="1">For two loci close together, a crossover between them is rare, and RF is small. If the distance doubles, RF about doubles.</p>
<p data-step="2">For two loci far apart, most meioses have one or more crossovers between them. RF then comes close to 50% and stops there.</p>
<p data-step="3">For loci close together, RF measures the distance between them along the chromosome. An RF of 1% is one <b>map unit</b>, also called one <b>centimorgan</b> (cM) after Morgan. In humans, 1 cM is about 1 million base pairs of DNA, on average.</p>`,
star:'Short distance: RF ≈ distance. Long distance: RF stops at 50%.',starStep:3,
scene(H){const s=ST();const X0=104,Y0=372,PX=120,PY=4.3,xa=60;
  strand(s,{L:560,color:'muted',w:9,x:320,y:54});const A=tag(s,xa,54,'A');const B=tag(s,90,54,'B');
  let sd=7;const rnd=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
  const ticks=[];for(let i=0;i<44;i++){const x=48+rnd()*544;ticks.push({x,e:H.E('line',{x1:x,y1:72,x2:x,y2:86,st:'stroke:var(--muted);stroke-width:2;stroke-linecap:round'},s)})}
  H.txt(s,592,104,'crossover positions in many meioses','lbs',{'text-anchor':'end'});
  /* graph */
  const G=H.g(s);H.E('line',{x1:X0,y1:Y0,x2:X0+4*PX+10,y2:Y0,cls:'k',st:'stroke-width:2'},G);H.E('line',{x1:X0,y1:Y0,x2:X0,y2:Y0-50*PY-14,cls:'k',st:'stroke-width:2'},G);
  [0,10,20,30,40,50].forEach(v=>{const y=Y0-v*PY;H.E('line',{x1:X0-5,y1:y,x2:X0,y2:y,cls:'k',st:'stroke-width:1.5'},G);H.txt(G,X0-9,y+4,v+'%','lbs',{'text-anchor':'end'})});
  H.txt(G,X0+4*PX+10,Y0+22,'distance between A and B →','lbs',{'text-anchor':'end'});H.txt(G,X0-58,Y0-50*PY-26,'RF','lb');
  const cap50=H.g(G);H.E('line',{x1:X0,y1:Y0-50*PY,x2:X0+4*PX,y2:Y0-50*PY,st:'stroke:var(--bad);stroke-width:1.6;stroke-dasharray:6 5'},cap50);H.txt(cap50,X0+8,Y0-50*PY-8,'maximum 50%','lbs',{st:'fill:var(--bad);font-weight:700'});H.O(cap50,0,{d:0});
  const f=m=>50*(1-Math.exp(-m));let d='';for(let m=0;m<=4.001;m+=.05)d+=(d?' L':'M')+(X0+m*PX).toFixed(1)+','+(Y0-f(m)*PY).toFixed(1);
  const curve=H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:3'},G);
  const lin=H.E('path',{d:`M${X0},${Y0} L${X0+PX},${Y0-50*PY}`,st:'fill:none;stroke:var(--dad);stroke-width:2;stroke-dasharray:3 4'},G);H.O(lin,0,{d:0});
  const linL=H.txt(G,X0+PX*.62,Y0-50*PY*.62-10,'RF ≈ distance','lbs',{'text-anchor':'end',st:'fill:var(--dad);font-weight:700'});H.O(linL,0,{d:0});
  const dot=H.E('circle',{r:7,st:'fill:var(--mom);stroke:var(--paper);stroke-width:2.5'},G);const rd=H.txt(G,0,0,'','lb');
  const cm=H.g(s);H.O(cm,0,{d:0});H.E('rect',{x:330,y:236,width:286,height:62,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},cm);
  lbl(cm,473,260,'1% RF = 1 map unit = 1 cM','lb');lbl(cm,473,284,'human average: 1 cM ≈ 1 million base pairs','lbs');
  let m0=.2;const xB=m=>xa+28+m*126;
  const render=m=>{m0=m;H.T(B,{x:xB(m)},{d:0});dot.setAttribute('cx',X0+m*PX);dot.setAttribute('cy',Y0-f(m)*PY);
    rd.setAttribute('x',X0+m*PX+12);rd.setAttribute('y',Y0-f(m)*PY+(m>2?24:-4));rd.textContent=`RF = ${Math.round(f(m))}%`;
    ticks.forEach(t=>{const on=t.x>xa&&t.x<xB(m);t.e.style.stroke=on?'var(--hi)':'var(--muted)';t.e.style.strokeWidth=on?3.5:2})};
  const P={set textContent(v){render(+v)}};const go=(m,o)=>cnt(P,m0,m,Object.assign({d:1500,fmt:v=>v},o));
  render(.2);H.D(curve,0,{d:0});
  return [
    ()=>{render(.2)},
    ()=>{go(.4);H.O(lin,1);H.O(linL,1,{at:600})},
    ()=>{H.D(curve,1,{d:1800});go(3.4,{d:1800});H.O(cap50,1,{at:1400})},
    ()=>{H.O(cm,1)},
  ];}},

/* 13 ─────────────────────────────── */
{sec:'9.5',title:'Reading Crossovers in Family DNA',caption:'One chromosome pair of a father and the copy that each of three children got from him · not to scale',
text:`<p data-step="0">Today, scientists can read the DNA of parents and their children. A chromosome that a child gets from one parent is usually a mosaic of that parent’s two homologs.</p>
<p data-step="1">Each switch from one homolog to the other marks a crossover in the meiosis that made the sperm or egg. A crossover involves only 2 of the 4 chromatids, so some gametes carry none on a chromosome (child 3).</p>
<p data-step="2">In humans, each pair of homologs has one to a few crossovers in each meiosis. Averaged over the whole genome, 1 cM is about 1 million base pairs.</p>
<p data-step="3">Crossovers do not occur evenly. Most human crossovers fall in <b>hotspots</b>, short regions about 1000 to 2000 base pairs long. A protein called PRDM9 binds to a short DNA sequence. PRDM9 marks the nearby DNA packaging (the proteins that hold the DNA) for crossovers.</p>`,
star:'Every switch point in a child’s chromosome = one crossover in a parent.',starStep:1,
scene(H){const s=ST();const x0=110,x1=600,hh=14;
  const bar=(p,y,segs)=>{const G=H.g(p);segs.forEach(([a,b,k])=>{const r=H.E('rect',{x:a,y:y-hh/2,width:b-a,height:hh,st:k?'fill:var(--dad-tint)':'fill:var(--dad)'},G);});
    H.E('rect',{x:x0,y:y-hh/2,width:x1-x0,height:hh,rx:hh/2,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},G);return G};
  cap(s,x0,26,'Father','start');
  bar(s,48,[[x0,x1,0]]);bar(s,76,[[x0,x1,1]]);
  H.txt(s,x0-10,52,'homolog 1','lbs',{'text-anchor':'end'});H.txt(s,x0-10,80,'homolog 2','lbs',{'text-anchor':'end'});
  const kids=[[[x0,250,0],[250,x1,1]],[[x0,190,1],[190,440,0],[440,x1,1]],[[x0,x1,0]]];const ky=[138,170,202];
  cap(s,x0,116,'What each child got from him','start');
  const segs=[];kids.forEach((sg,i)=>{H.txt(s,x0-10,ky[i]+4,'child '+(i+1),'lbs',{'text-anchor':'end'});
    H.E('rect',{x:x0,y:ky[i]-hh/2,width:x1-x0,height:hh,rx:hh/2,st:'fill:none;stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 3'},s);
    sg.forEach(([a,b,k])=>{const r=H.E('rect',{x:a,y:-hh/2,width:b-a,height:hh,st:k?'fill:var(--dad-tint);stroke:var(--dad);stroke-width:1':'fill:var(--dad)'},s);H.T(r,{y:k?76:48},{d:0});H.O(r,0,{d:0});segs.push({r,y:ky[i]})})});
  const sw=[];kids.forEach((sg,i)=>sg.slice(1).forEach(([a])=>{const G=H.g(s);H.E('path',{d:`M${a},${ky[i]+hh/2+2} l-6,10 l12,0 z`,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.2'},G);H.O(G,0,{d:0});sw.push(G)}));
  const swL=H.txt(s,x1,232,'▲ = crossover','lbs',{'text-anchor':'end'});H.O(swL,0,{d:0});
  const nb=H.g(s);H.O(nb,0,{d:0});H.E('rect',{x:24,y:252,width:592,height:40,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},nb);
  lbl(nb,320,277,'humans: 1 to a few crossovers per pair per meiosis · 1 cM ≈ 1 million base pairs','lb',{st:'font-size:13px'});
  /* hotspot inset */
  const hs=H.g(s);H.O(hs,0,{d:0});const by=398;
  H.E('line',{x1:40,y1:by,x2:600,y2:by,cls:'k',st:'stroke-width:2'},hs);H.txt(hs,40,by+18,'crossovers along about 500,000 base pairs of one chromosome','lbs');
  [[90,12],[160,36],[236,9],[300,52],[392,18],[470,40],[548,14]].forEach(([x,h])=>H.E('path',{d:`M${x-7},${by} Q${x},${by-h*2} ${x+7},${by}`,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.3'},hs));
  H.E('path',{d:`M300,${by-84} L300,${by-58}`,cls:'k',st:'stroke-width:1.2'},hs);H.txt(hs,306,by-74,'hotspot: 1000–2000 bp','lb',{st:'font-size:13px'});
  const pr=H.g(hs);H.E('ellipse',{cx:0,cy:0,rx:24,ry:13,st:'fill:var(--mom-tint);stroke:var(--mom);stroke-width:2'},pr);H.txt(pr,0,4,'PRDM9','lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--ink);font-size:10px'});H.T(pr,{x:548,y:by-66},{d:0});
  H.E('path',{d:`M548,${by-53} L548,${by-30}`,cls:'k',st:'stroke-width:1.2'},hs);
  return [
    ()=>{segs.forEach((o,i)=>{H.O(o.r,1,{d:200,at:i*120});H.T(o.r,{y:o.y},{d:1100,at:i*120})})},
    ()=>{sw.forEach((G,i)=>H.O(G,1,{at:i*150}));H.O(swL,1)},
    ()=>{H.O(nb,1)},
    ()=>{H.O(hs,1)},
  ];}},

/* 14 ─────────────────────────────── */
{sec:'9.4',title:'Coupling (cis) and Repulsion (trans)',caption:'Two dihybrids with the same genotype, A/a B/b, and the same phenotype',
text:`<p data-step="0">Take an individual heterozygous for two linked genes, A/a and B/b. Its phenotype does not show which alleles sit together on one homolog.</p>
<p data-step="1">In the <b>coupling</b> (or <b>cis</b>) configuration, both dominant alleles are on one homolog, and both recessive alleles are on the other. The genotype is AB/ab. If the dominant alleles are the wild-type alleles, it is a<sup>+</sup>b<sup>+</sup>/a<sup>−</sup>b<sup>−</sup>.</p>
<p data-step="2">In the <b>repulsion</b> (or <b>trans</b>) configuration, each homolog has one dominant and one recessive allele. The genotype is Ab/aB, or a<sup>+</sup>b<sup>−</sup>/a<sup>−</sup>b<sup>+</sup>.</p>
<p data-step="3">The P generation shows the configuration. Suppose that one parent shows both dominant traits and the other parent shows both recessive traits. Then the F1 is in coupling. If each parent shows one dominant trait and one recessive trait, the F1 is in repulsion.</p>`,
star:'Cis is Latin for on this side. Trans is Latin for across.',starStep:2,
scene(H){const s=ST();const C=[[165,'Coupling · cis',['A','B'],['a','b'],'AB / ab',[['a',''],['+','sup'],['b',''],['+','sup'],[' / ',''],['a',''],['−','sup'],['b',''],['−','sup']]],[475,'Repulsion · trans',['A','b'],['a','B'],'Ab / aB',[['a',''],['+','sup'],['b',''],['−','sup'],[' / ',''],['a',''],['−','sup'],['b',''],['+','sup']]]];
  const P=C.map(([x,t,u,l,g,pm])=>{const G=H.g(s);H.E('circle',{cx:x,cy:140,r:98,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},G);
    const top=strand(G,{L:140,color:'dad',x,y:122,tags:[[-44,'?'],[44,'?']]}),bot=strand(G,{L:140,color:'mom',x,y:160,tags:[[-44,'?'],[44,'?']]});
    const T=cap(G,x,26,t);H.O(T,0,{d:0});const gl=lbl(G,x,270,g,'lb',{st:'font-family:var(--f-math);font-style:italic;font-size:22px'});H.O(gl,0,{d:0});
    const pl=sym(G,x,298,pm,{st:'font-size:17px'});H.O(pl,0,{d:0});
    return {G,top,bot,u,l,T,gl,pl,x}});
  const ph=lbl(s,320,266,'same phenotype: dominant A trait and dominant B trait','lbs');
  const reveal=(o)=>{H.O([o.T,o.gl,o.pl],1);[[o.top,o.u],[o.bot,o.l]].forEach(([st,a])=>st.tags.forEach((tg,i)=>{H.T(tg,{s:1.35},{d:250});H.after(260,()=>{tg.t.textContent=a[i];H.T(tg,{s:1},{d:300})})}))};
  const par=[['A/A B/B  ×  a/a b/b','both dominant × both recessive'],['A/A b/b  ×  a/a B/B','one of each × one of each']].map(([a,b],i)=>{const G=H.g(s);const x=C[i][0];
    H.E('rect',{x:x-140,y:326,width:280,height:58,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},G);lbl(G,x,350,'P: '+a,'lb',{st:'font-size:13px'});lbl(G,x,372,b,'lbs');H.O(G,0,{d:0});return G});
  return [()=>{},()=>{H.O(ph,0);reveal(P[0])},()=>{reveal(P[1])},()=>{par.forEach((G,i)=>H.O(G,1,{at:i*250}))}];}},

/* 15 ─────────────────────────────── */
{sec:'9.4',title:'The Test Cross Shows Which Classes Are Parental',caption:'Example counts for 100 offspring · RF = 18% in both crosses',
text:`<p data-step="0">A <b>test cross</b> mates the dihybrid (Cc Ee) with a <b>tester</b> that is homozygous recessive for both genes (cc ee). The tester’s gametes carry only c and e. So each offspring shows the alleles of the gamete from the dihybrid.</p>
<p data-step="1"><b>Coupling dihybrid, CE/ce.</b> Parental offspring: Cc Ee and cc ee. Recombinant offspring: Cc ee and cc Ee.</p>
<p data-step="2"><b>Repulsion dihybrid, Ce/cE.</b> Parental offspring: Cc ee and cc Ee. Recombinant offspring: Cc Ee and cc ee.</p>
<p data-step="3">For linked genes, the two largest classes are always the parental classes. An RF well above 50% usually means that someone swapped the parental and recombinant labels.</p>`,
star:'Biggest two classes = parental. Smallest two = recombinant.',starStep:3,
scene(H){const s=ST();
  const D=H.g(s);cap(D,140,24,'Dihybrid');const d1=strand(D,{L:120,color:'dad',x:140,y:52,tags:[[-36,'?'],[36,'?']]}),d2=strand(D,{L:120,color:'mom',x:140,y:82,tags:[[-36,'?'],[36,'?']]});
  lbl(s,320,74,'×','big');
  cap(s,500,24,'Tester');strand(s,{L:120,color:'muted',x:500,y:52,tags:[[-36,'c'],[36,'e']]});strand(s,{L:120,color:'muted',x:500,y:82,tags:[[-36,'c'],[36,'e']]});
  const bx=[140,265,390,515],base=330,K=3.6;
  const cls=[['Cc Ee','gamete CE'],['cc ee','gamete ce'],['Cc ee','gamete Ce'],['cc Ee','gamete cE']];
  H.E('line',{x1:70,y1:base,x2:590,y2:base,cls:'k',st:'stroke-width:2'},s);
  const bars=cls.map(([g,m],i)=>{const G=H.g(s);const r=H.E('rect',{x:-36,y:-1,width:72,height:1,st:'fill:var(--muted)'},G);H.T(G,{x:bx[i],y:base,sx:1,sy:.001},{d:0});
    lbl(s,bx[i],base+22,g,'lb');lbl(s,bx[i],base+40,m,'lbs');const n=lbl(s,bx[i],base-8,'','lb');const c=chip(s,bx[i],base-36,'P');H.O(c,0,{d:0});return {G,r,n,c,v:0}});
  const set=(vals,kinds)=>bars.forEach((b,i)=>{H.T(b.G,{sy:vals[i]*K},{d:1100});H.T(b.n,{y:-vals[i]*K},{d:1100});H.T(b.c,{y:base-36-vals[i]*K},{d:1100});
    const P={set textContent(v){b.n.textContent=v}};cnt(P,b.v,vals[i],{d:1100});b.v=vals[i];
    H.O(b.c,1,{at:600});H.after(500,()=>setChip(b.c,kinds[i]));b.r.style.fill=kinds[i]==='P'?'var(--ink)':'var(--hi)'});
  const setD=(u,l)=>{[[d1,u],[d2,l]].forEach(([st,a])=>st.tags.forEach((tg,i)=>{tg.t.textContent=a[i]}))};
  const brace=H.g(s);H.O(brace,0,{d:0});const bt=H.txt(brace,0,0,'','lb',{'text-anchor':'middle'});
  return [()=>{},
    ()=>{setD(['C','E'],['c','e']);set([41,41,9,9],['P','P','R','R'])},
    ()=>{setD(['C','e'],['c','E']);set([9,9,41,41],['R','R','P','P'])},
    ()=>{H.O(brace,1);bt.setAttribute('x',452);bt.setAttribute('y',118);bt.textContent='two largest classes = parental'}];}},

/* 16 ─────────────────────────────── */
{sec:'9.5',title:'Three Degrees of Linkage',caption:'Guideline ranges · each RF is a ratio of counts and includes random error',
text:`<p data-step="0">RF places two genes on a scale of linkage. Scientists calculate RF from counts of offspring, and counts include <b>random error</b> (chance differences between samples). So treat the boundaries as guidelines.</p>
<p data-step="1"><b>Complete linkage:</b> RF = 0%. No recombinant offspring appear.</p>
<p data-step="2"><b>Partial linkage</b> (also called <b>incomplete linkage</b>): RF is more than 0% and less than 50%. Clear cases have RF up to about 30%.</p>
<p data-step="3"><b>Unlinked:</b> RF is about 50%. Because of random error, counts for unlinked genes can give any value from about 40% to 60%.</p>
<p data-step="4">Between about 30% and 50% (the dashed zone), random error makes partial linkage hard to tell apart from no linkage.</p>`,
star:'0% complete · clear partial linkage up to about 30% · about 50% unlinked.',starStep:4,
scene(H){const s=ST();const X=v=>60+v*9,Y=230;
  H.E('line',{x1:X(0),y1:Y,x2:X(60),y2:Y,cls:'k',st:'stroke-width:2.5'},s);
  [0,10,20,30,40,50,60].forEach(v=>{H.E('line',{x1:X(v),y1:Y-6,x2:X(v),y2:Y+6,cls:'k',st:'stroke-width:2'},s);H.txt(s,X(v),Y+24,v+'%','lbs',{'text-anchor':'middle'})});
  H.txt(s,X(60),Y+44,'recombination frequency','lbs',{'text-anchor':'end'});
  const z=(a,b,y,h,st,t1,t2,ty)=>{const G=H.g(s);const r=H.E('rect',{x:X(a),y,width:Math.max(4,X(b)-X(a)),height:h,rx:6,st},G);H.T(r,{},{d:0});
    lbl(G,(X(a)+X(b))/2,ty,t1,'lb');if(t2)lbl(G,(X(a)+X(b))/2,ty+18,t2,'lbs');H.O(G,0,{d:0});return G};
  const comp=H.g(s);H.E('path',{d:`M${X(0)},${Y-28} l-9,-15 l18,0 z`,st:'fill:var(--ink)'},comp);lbl(comp,X(0)+4,Y-84,'complete','lb',{'text-anchor':'start'});lbl(comp,X(0)+4,Y-66,'RF = 0','lbs',{'text-anchor':'start'});H.O(comp,0,{d:0});
  const part=z(0.4,30,Y-48,34,'fill:var(--hi);opacity:.75;stroke:var(--ink);stroke-width:1.5','partial linkage','',Y-56);
  const unl=z(40,60,Y+58,34,'fill:var(--wash);stroke:var(--ink);stroke-width:1.5','unlinked','',Y+80);lbl(unl,(X(40)+X(60))/2,Y+112,'about 50% (counts: 40–60%)','lbs');
  const amb=H.g(s);H.O(amb,0,{d:0});H.E('rect',{x:X(30),y:Y-150,width:X(50)-X(30),height:136,rx:6,st:'fill:none;stroke:var(--bad);stroke-width:2;stroke-dasharray:6 5'},amb);
  lbl(amb,(X(30)+X(50))/2,Y-128,'30–50%:','lb',{st:'fill:var(--bad)'});lbl(amb,(X(30)+X(50))/2,Y-110,'partial or unlinked?','lbs');
  const ms=H.g(s);H.O(ms,0,{d:0});H.E('circle',{cx:X(25),cy:Y,r:7,st:'fill:var(--mom);stroke:var(--paper);stroke-width:2.5'},ms);lbl(ms,X(25),Y-14,'25%','lbs',{st:'font-weight:700;fill:var(--ink)'});
  lbl(ms,X(25),Y+70,'example: partial linkage','lbs');H.E('line',{x1:X(25),y1:Y+8,x2:X(25),y2:Y+56,st:'stroke:var(--muted);stroke-width:1'},ms);
  return [()=>{},()=>{H.O(comp,1)},()=>{H.O(part,1);H.O(ms,1,{at:500})},()=>{H.O(unl,1)},()=>{H.O(amb,1)}];}},

/* 17 ─────────────────────────────── */
{sec:'9.5',title:'Unlinked Genes',caption:'Parents gave AB and ab · bar height = share of gametes',
text:`<p data-step="0"><b>Unlinked</b> genes assort independently. The four gamete types appear in about equal numbers. Half of the gametes are recombinant, so RF is about 50%.</p>
<p data-step="1"><b>Case 1:</b> the genes are on different chromosomes. Each pair of homologs faces a random direction in metaphase I, so the alleles assort independently.</p>
<p data-step="2"><b>Case 2:</b> the genes are far apart on the same chromosome. So many crossovers fall between them that the alleles become randomly mixed. RF is again about 50%.</p>
<p data-step="3">Counts vary by chance. So a measured RF for unlinked genes can be anywhere from about 40% to 60%.</p>`,
star:'Unlinked: four equal classes, RF ≈ 50%.',starStep:3,
scene(H){const s=ST();
  H.E('line',{x1:320,y1:16,x2:320,y2:404,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  const L=H.g(s);H.O(L,0,{d:0});cap(L,160,26,'Different chromosomes');
  strand(L,{L:110,color:'dad',x:100,y:70,tags:[[0,'A']]});strand(L,{L:110,color:'mom',x:100,y:98,tags:[[0,'a']]});
  strand(L,{L:80,color:'dad',x:240,y:70,tags:[[0,'B']]});strand(L,{L:80,color:'mom',x:240,y:98,tags:[[0,'b']]});
  const R=H.g(s);H.O(R,0,{d:0});cap(R,480,26,'Far apart on one chromosome');
  strand(R,{L:280,color:'dad',x:480,y:70,tags:[[-122,'A'],[122,'B']]});strand(R,{L:280,color:'mom',x:480,y:98,tags:[[-122,'a'],[122,'b']]});
  const xs=[[402,0],[446,1],[500,0],[548,1]].map(([x,k])=>spark(R,x,84,10));
  const base=330,K=5;const names=['AB','Ab','aB','ab'],kinds=['P','R','R','P'];
  const mkBars=(x0)=>names.map((n,i)=>{const x=x0+i*64;const G=H.g(s);const r=H.E('rect',{x:-22,y:-1,width:44,height:1,st:`fill:${kinds[i]==='R'?'var(--hi)':'var(--ink)'}`},G);H.T(G,{x,y:base,sy:.001},{d:0});
    const t=lbl(s,x,base+22,n,'lb');const c=chip(s,x,base+46,kinds[i]);const v=lbl(s,x,base-8,'','lbs',{st:'font-weight:700;fill:var(--ink)'});H.O([t,c,v],0,{d:0});return {G,t,c,v,x,val:0}});
  const bl=mkBars(64),br=mkBars(384);
  [[40,280],[360,600]].forEach(([a,b])=>H.E('line',{x1:a,y1:base,x2:b,y2:base,cls:'k',st:'stroke-width:2'},s));
  const rf=[lbl(s,160,150,'','lb'),lbl(s,480,150,'','lb')];
  const grow=(B,vals,o)=>B.forEach((b,i)=>{H.O([b.t,b.c,b.v],1,o);H.T(b.G,{sy:vals[i]*K},Object.assign({d:1000},o));H.T(b.v,{y:-vals[i]*K},Object.assign({d:1000},o));
    const P={set textContent(v){b.v.textContent=Math.round(v)+'%'}};cnt(P,b.val,vals[i],Object.assign({d:1000},o));b.val=vals[i]});
  return [
    ()=>{},
    ()=>{H.O(L,1);grow(bl,[25,25,25,25],{at:400});rf[0].textContent='RF = 50%'},
    ()=>{H.O(R,1);xs.forEach((x,i)=>flash(x,i*200));grow(br,[25,25,25,25],{at:900});rf[1].textContent='RF = 50%'},
    ()=>{grow(bl,[28,22,24,26]);grow(br,[23,27,26,24]);rf[0].textContent='one possible sample: RF = 46%';rf[1].textContent='another sample: RF = 53%'},
  ];}},

/* 18 ─────────────────────────────── */
{sec:'9.5',title:'Complete Linkage',caption:'Loci A and B sit side by side · the crossover falls to the left of both',
text:`<p data-step="0">In <b>complete linkage</b> (also called <b>absolute linkage</b>), two loci are so close together that a crossover almost never falls between them.</p>
<p data-step="1">Crossovers still happen elsewhere on the chromosome. A crossover outside the A–B region moves A and B together, so their combination does not change.</p>
<p data-step="2">The alleles at the two loci stay on the same chromatid and go into the same gamete. All gametes are parental, here Ab and aB. No recombinants appear, so RF = 0%.</p>
<p data-step="3">Complete linkage is rare. The loci must be so close that crossovers between them are too rare to detect.</p>`,
star:'Complete linkage: only parental gametes, RF = 0.',starStep:2,
scene(H){const s=ST();const xa=330,xb=364,xc=180;
  const T=tetrad(s,{x0:90,x1:550,ys:[118,142,186,210],breaks:[xc],loci:[{x:xa,lab:['A','A','a','a']},{x:xb,lab:['b','b','B','B']}],w:9,ts:.9});
  const brk=H.g(s);H.E('path',{d:`M${xa},96 L${xa},88 L${xb},88 L${xb},96`,cls:'k',st:'stroke-width:1.6'},brk);lbl(brk,(xa+xb)/2,76,'very short distance','lbs',{st:'font-weight:700;fill:var(--ink)'});
  const sp=[spark(s,xc,142,10),spark(s,xc,186,10)];
  const labs=['Ab','aB','Ab','aB'];const ch=[0,1,2,3].map(r=>{const G=H.g(s);chip(G,0,0,'P');lbl(G,30,5,labs[r],'lb',{'text-anchor':'start'});H.T(G,{x:572,y:T.ys[r]},{d:0});H.O(G,0,{d:0});return G});
  const res=H.g(s);H.O(res,0,{d:0});H.E('rect',{x:170,y:262,width:300,height:56,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},res);
  lbl(res,320,286,'4 of 4 gametes parental','lb');lbl(res,320,306,'RF = 0%','lb',{st:'font-family:var(--f-math);font-style:italic;font-size:17px'});
  const no=H.g(s);H.O(no,0,{d:0});const nx=(xa+xb)/2;H.E('path',{d:`M${nx-5},159 L${nx+5},169 M${nx+5},159 L${nx-5},169`,st:'stroke:var(--hi);stroke-width:3.5;stroke-linecap:round'},no);
  H.E('circle',{cx:nx,cy:164,r:10,st:'fill:none;stroke:var(--bad);stroke-width:2.2'},no);H.E('line',{x1:nx-7,y1:171,x2:nx+7,y2:157,st:'stroke:var(--bad);stroke-width:2.2'},no);
  lbl(no,nx,362,'a crossover between A and B: almost never','lbs',{st:'font-weight:700;fill:var(--bad)'});H.E('line',{x1:nx,y1:184,x2:nx,y2:348,st:'stroke:var(--bad);stroke-width:1;stroke-dasharray:3 3'},no);
  return [()=>{},
    ()=>{flash(sp[0]);H.after(400,inst=>T.xo(0,1,2,{d:inst?0:1200}))},
    ()=>{ch.forEach((G,i)=>H.O(G,1,{at:i*150}));H.O(res,1,{at:700})},
    ()=>{H.O(no,1)}];}},

/* 19 ─────────────────────────────── */
{sec:'9.5',title:'Complete Linkage Changes the 9 : 3 : 3 : 1 Ratio',caption:'A_ = AA or Aa (dominant phenotype) · colour = phenotype class: yellow A_B_, green A_bb, red aaB_, grey aabb',
text:`<p data-step="0">In a <b>dihybrid cross</b>, two dihybrids mate. A <b>Punnett square</b> is a grid that combines each gamete of one parent with each gamete of the other. If the genes are unlinked, each parent makes 4 gamete types in equal numbers. The 4 × 4 square gives the phenotype ratio 9 : 3 : 3 : 1.</p>
<p data-step="1">With complete linkage, each parent makes only its 2 parental gametes. In coupling (AB/ab × AB/ab), the gametes are AB and ab.</p>
<p data-step="2">The 2 × 2 square gives 1 AA BB : 2 Aa Bb : 1 aa bb. A_ means AA or Aa, the dominant phenotype. So the phenotype ratio is 3 A_B_ : 1 aabb.</p>
<p data-step="3">In repulsion (Ab/aB × Ab/aB), the gametes are Ab and aB. The square gives 1 AA bb : 2 Aa Bb : 1 aa BB. The phenotype ratio is 1 A_bb : 2 A_B_ : 1 aaB_.</p>
<p data-step="4">If one parent is in coupling and the other is in repulsion, the ratio is 2 A_B_ : 1 A_bb : 1 aaB_. Partial linkage also changes the ratio. So a 9 : 3 : 3 : 1 ratio means that the two genes are unlinked.</p>`,
star:'9 : 3 : 3 : 1 needs four equal gamete types, so it needs unlinked genes.',starStep:4,
scene(H){const s=ST();
  const FILL={AB:'fill:var(--hi)',Ab:'fill:var(--good)',aB:'fill:var(--bad)',ab:'fill:var(--muted)'};
  const ph=g=>{const A=g[0]==='A'||g[1]==='A',B=g[2]==='B'||g[3]==='B';return (A?'A':'a')+(B?'B':'b')};
  const pname={AB:'A_B_',Ab:'A_bb',aB:'aaB_',ab:'aabb'};
  const join=(r,c)=>{const a=[r[0],c[0]].sort().join(''),b=[r[1],c[1]].sort().join('');return a+b};
  H.E('line',{x1:320,y1:10,x2:320,y2:410,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);H.E('line',{x1:10,y1:212,x2:630,y2:212,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  /* unlinked 4x4 */
  const U=H.g(s);cap(U,160,24,'Unlinked');const gs=['AB','Ab','aB','ab'];const cw=27,chh=22,ux=104,uy=52;
  gs.forEach((g,i)=>{lbl(U,ux+cw*i+cw/2,uy-6,g,'lbs',{st:'font-size:10px'});lbl(U,ux-6,uy+chh*i+chh/2+4,g,'lbs',{'text-anchor':'end',st:'font-size:10px'})});
  gs.forEach((r,i)=>gs.forEach((c,j)=>{const p=ph(join(r,c));H.E('rect',{x:ux+cw*j,y:uy+chh*i,width:cw,height:chh,st:FILL[p]+';stroke:var(--ink);stroke-width:1'},U)}));
  [['AB',9],['Ab',3],['aB',3],['ab',1]].forEach(([p,n],i)=>{const x=36+i*72;H.E('rect',{x,y:160,width:12,height:12,st:FILL[p]+';stroke:var(--ink);stroke-width:1'},U);H.txt(U,x+16,170,pname[p]+' '+n,'lbs',{st:'font-size:11px;fill:var(--ink)'})});
  lbl(U,160,198,'9 : 3 : 3 : 1','lb',{st:'font-family:var(--f-math);font-style:italic;font-size:18px'});
  /* 2x2 panel */
  const panel=(cx,cy,title,rows,cols,ratio)=>{const G=H.g(s);H.O(G,0,{d:0});cap(G,cx,cy+14,title);const w=74,h=42,x0=cx-48,y0=cy+42;
    const hd=H.g(G);cols.forEach((c,j)=>lbl(hd,x0+w*j+w/2,y0-7,c,'lb',{st:'font-size:13px'}));rows.forEach((r,i)=>lbl(hd,x0-8,y0+h*i+h/2+5,r,'lb',{'text-anchor':'end',st:'font-size:13px'}));
    const cells=[];rows.forEach((r,i)=>cols.forEach((c,j)=>{const g=join(r,c);const p=ph(g);const C=H.g(G);H.E('rect',{x:x0+w*j,y:y0+h*i,width:w,height:h,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.2'},C);
      H.E('rect',{x:x0+w*j+1,y:y0+h*i+1,width:7,height:h-2,st:FILL[p]},C);
      lbl(C,x0+w*j+w/2+3,y0+h*i+18,g,'lb',{st:'font-size:12.5px'});lbl(C,x0+w*j+w/2+3,y0+h*i+33,pname[p],'lbs',{st:'font-size:10.5px'});H.O(C,0,{d:0});cells.push(C)}));
    const rt=lbl(G,cx,cy+152,ratio,'lb',{st:'font-family:var(--f-math);font-style:italic;font-size:16px'});H.O(rt,0,{d:0});G.cells=cells;G.rt=rt;return G};
  const P1=panel(480,10,'Coupling × coupling',['AB','ab'],['AB','ab'],'3 A_B_ : 1 aabb');
  const P2=panel(160,216,'Repulsion × repulsion',['Ab','aB'],['Ab','aB'],'1 A_bb : 2 A_B_ : 1 aaB_');
  const P3=panel(480,216,'Coupling × repulsion',['AB','ab'],['Ab','aB'],'2 A_B_ : 1 A_bb : 1 aaB_');
  const fill=(P,at)=>{H.O(P,1);P.cells.forEach((c,i)=>H.O(c,1,{at:(at||0)+300+i*180}));H.O(P.rt,1,{at:(at||0)+1100})};
  return [()=>{},()=>{H.O(P1,1)},()=>{fill(P1)},()=>{fill(P2)},()=>{fill(P3)}];}},

/* 20 ─────────────────────────────── */
{sec:'9.5',title:'Partial Linkage and Synteny',caption:'Top: five meioses of an Ab/aB individual · bottom: two chromosomes of one genome',
text:`<p data-step="0">In <b>partial linkage</b> (also called <b>incomplete linkage</b>), two loci are on the same chromosome. A crossover falls between them in some meioses, but not in all. RF is more than 0% and less than 50%, with clear cases up to about 30%.</p>
<p data-step="1">A meiosis with a crossover between the loci makes 2 recombinant chromatids, here AB and ab. Each organism makes many independent meioses, so only some of its gametes are recombinant.</p>
<p data-step="2">Genes on the same chromosome are <b>syntenic</b> (from Greek: on the same ribbon), whether they are linked or not. A and B are syntenic and linked.</p>
<p data-step="3">A and Z are at opposite ends of one long chromosome. They are syntenic but unlinked, with RF about 50%. A and C are on different chromosomes, so they are not syntenic. So all linked genes are syntenic, but not all syntenic genes are linked.</p>`,
star:'Syntenic = same chromosome. Linked = close enough to travel together.',starStep:3,
scene(H){const s=ST();const hl=H.g(s);const cxs=[70,195,320,445,570],y0=54;const M=[];
  const plan=[[null],[0,1,2],[null],[null],[-6,0,3]];
  plan.forEach((pl,i)=>{const cx=cxs[i];const G=H.g(s);const brk=pl[0]==null?[]:[cx+pl[0]];
    const T=tetrad(G,{x0:cx-54,x1:cx+54,ys:[y0,y0+9,y0+22,y0+31],breaks:brk,w:5});
    [cx-30,cx+30].forEach((x,j)=>{H.E('line',{x1:x,y1:y0-12,x2:x,y2:y0+43,st:'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:2 3'},G);lbl(G,x,y0-16,j?'B':'A','lbs',{st:'font-weight:700'})});
    lbl(G,cx,y0+60,'meiosis '+(i+1),'lbs');M.push({G,T,pl,cx,sp:pl[0]==null?null:spark(G,cx+pl[0],y0+15,9)})});
  const tally=lbl(s,320,140,'','lb');
  /* synteny diagram */
  const D=H.g(s);H.O(D,0,{d:0});
  strand(D,{L:500,color:'muted',w:12,x:330,y:240});strand(D,{L:220,color:'muted',w:12,x:190,y:340});
  H.txt(D,70,224,'chromosome 1','lbs');H.txt(D,70,324,'chromosome 2','lbs');
  tag(D,110,240,'A');tag(D,170,240,'B');const tz=tag(D,556,240,'Z');const tc=tag(D,200,340,'C');
  H.E('path',{d:'M110,212 L110,204 L170,204 L170,212',cls:'k',st:'stroke-width:1.5'},D);lbl(D,140,194,'syntenic + linked','lbs',{st:'font-weight:700;fill:var(--ink)'});
  const AZ=H.g(s);H.O(AZ,0,{d:0});H.E('path',{d:'M110,264 L110,274 L556,274 L556,264',cls:'k',st:'stroke-width:1.5'},AZ);lbl(AZ,333,292,'syntenic, but unlinked (RF ≈ 50%)','lbs',{st:'font-weight:700;fill:var(--ink)'});
  const AC=H.g(s);H.O(AC,0,{d:0});H.E('path',{d:'M110,252 C80,290 160,300 200,328',st:'fill:none;stroke:var(--bad);stroke-width:1.6;stroke-dasharray:5 4'},AC);lbl(AC,330,350,'A and C: not syntenic','lbs',{'text-anchor':'start',st:'font-weight:700;fill:var(--bad)'});
  return [
    ()=>{},
    ()=>{M.forEach((m,i)=>{if(m.pl[0]==null)return;flash(m.sp,i*100);H.after(i*100+300,inst=>{m.T.xo(0,m.pl[1],m.pl[2],{d:inst?0:900});
      H.after(inst?0:1000,()=>{m.T.rec(m.cx-30,m.cx+30).forEach((v,row)=>{if(!v)return;const e=H.E('rect',{x:m.cx-60,y:m.T.ys[row]-5,width:120,height:10,rx:5,st:'fill:var(--hi);opacity:.9'},hl)})})})});
      tally.textContent='4 recombinant of 20 chromatids: RF = 20% in this sample'},
    ()=>{H.O(D,1)},
    ()=>{H.O(AZ,1);H.O(AC,1,{at:500})},
  ];}},

/* 21 ─────────────────────────────── */
{sec:'9.9',title:'Crossover or Recombination?',caption:'Double crossing over: drawing by T. H. Morgan, 1916, public domain · W = white eyes, M = miniature wings, Br = bar eyes',
text:`<p data-step="0">A <b>crossover</b> is a physical event: two non-sister chromatids exchange segments. Under a microscope, crossovers appear as <b>chiasmata</b> (singular: <b>chiasma</b>), the points where two chromatids cross.</p>
<p data-step="1"><b>Recombination</b> is a genetic result: new combinations of alleles among the offspring. Scientists detect it with <b>marker loci</b>: loci whose alleles they can tell apart.</p>
<p data-step="2">Not every crossover gives detectable recombination. A crossover outside the two marker loci changes nothing between them. Two crossovers between the markers that involve the same two chromatids restore the parental combination. An exchange between sister chromatids swaps identical DNA.</p>
<p data-step="3">Some recombinants have no crossover at all. Genes on different chromosomes recombine by independent assortment alone.</p>`,
star:'Crossover = the event. Recombination = what the markers show.',starStep:2,
scene(H){const s=ST();const k=236/480;
  H.E('rect',{x:6,y:6,width:244,height:330,rx:6,st:'fill:#fff;stroke:var(--faint)'},s);H.E('image',{href:'@@asset:c9-morgan-1916-double.jpg@@',x:10,y:10,width:236,height:640*k},s);
  const R1=ring(s,128,165,96,34);
  const Rb=ring(s,128,288,104,40);const L0=plate(s,128,360,'markers: W, M, Br','middle');const Lb=plate(s,128,390,'W and Br: still parental','middle');
  const mini=(y,title,res,good,draw)=>{const G=H.g(s);H.O(G,0,{d:0});H.txt(G,270,y,title,'lbs',{st:'font-weight:700;fill:var(--ink)'});draw(G,y+22);
    lbl(G,624,y+28,res,'lbs',{'text-anchor':'end',st:`font-weight:700;fill:var(--${good?'good':'bad'})`});return G};
  const pair=(G,y,top,bot,tags)=>{strand(G,{segs:top,x:0,y,tags:tags[0],ts:.75,w:6});strand(G,{segs:bot,x:0,y:y+20,tags:tags[1],ts:.75,w:6})};
  const m1=mini(36,'Crossover outside the markers','no recombination',0,(G,y)=>{pair(G,y,[[270,300,'dad'],[300,500,'mom']],[[270,300,'mom'],[300,500,'dad']],[[[320,'a'],[470,'b']],[[320,'A'],[470,'B']]])});
  const m2=mini(112,'Two crossovers, same two chromatids','no recombination',0,(G,y)=>{pair(G,y,[[270,340,'dad'],[340,420,'mom'],[420,500,'dad']],[[270,340,'mom'],[340,420,'dad'],[420,500,'mom']],[[[290,'A'],[480,'B']],[[290,'a'],[480,'b']]])});
  const m3=mini(188,'Exchange between sister chromatids','no recombination',0,(G,y)=>{pair(G,y,[[270,380,'dad'],[380,500,'dad']],[[270,380,'dad'],[380,500,'dad']],[[[300,'A'],[470,'B']],[[300,'A'],[470,'B']]])});
  const m4=mini(264,'Genes on different chromosomes','recombination, no crossover',1,(G,y)=>{strand(G,{L:70,color:'dad',x:310,y,tags:[[0,'A']],ts:.75,w:6});strand(G,{L:70,color:'mom',x:400,y,tags:[[0,'b']],ts:.75,w:6});lbl(G,270,y+44,'gamete Ab, from an A/a B/b parent that got AB and ab','lbs',{'text-anchor':'start'})});
  return [()=>{H.D(R1,1,{d:900})},()=>{H.O(L0,1)},()=>{H.D(Rb,1,{d:900});H.O(Lb,1,{at:500});[m1,m2,m3].forEach((G,i)=>H.O(G,1,{at:i*250}))},()=>{H.O(m4,1)}];}},

/* 22 ─────────────────────────────── */
{sec:'9.6',title:'Measuring RF: Start with Pure-Breeding Lines',caption:'Blue = from the father (short tail, brown) · orange = from the mother (long tail, white)',
text:`<p data-step="0">To measure RF, you need two genes with two alleles each, and you must know the parental combinations. The easiest start is two <b>pure-breeding</b> lines: homozygous lines whose offspring always have the same traits as the parents.</p>
<p data-step="1">Example in mice: gene A controls tail length. Allele A (long tail) is dominant to a (short tail). Gene B controls fur colour. Allele B (brown) is dominant to b (white).</p>
<p data-step="2">Cross a short-tailed, brown mouse (aa BB) with a long-tailed, white mouse (AA bb). The first parent makes only aB gametes. The second parent makes only Ab gametes.</p>
<p data-step="3">All the F1 offspring are dihybrids, Aa Bb, with long tails and brown fur. If the loci are linked, one homolog carries aB and the other carries Ab. So the parental gametes of the F1 are aB and Ab. The recombinant gametes are ab and AB.</p>
<p data-step="4">The cross does not yet show whether the loci are on one chromosome, or how close they are.</p>`,
star:'Pure-breeding parents give known gametes, so you know the parental combinations.',starStep:2,
scene(H){const s=ST();
  const m1=mouse(s,{fur:'brown',tail:'short',x:120,y:56}),m2=mouse(s,{fur:'white',tail:'long',x:520,y:56});
  lbl(s,120,102,'aa BB','lb');lbl(s,120,118,'short tail, brown','lbs');lbl(s,520,102,'AA bb','lb');lbl(s,520,118,'long tail, white','lbs');
  const p1=[strand(s,{L:96,color:'dad',x:120,y:146,tags:[[-26,'a'],[26,'B']],ts:.85}),strand(s,{L:96,color:'dad',x:120,y:168,tags:[[-26,'a'],[26,'B']],ts:.85})];
  const p2=[strand(s,{L:96,color:'mom',x:520,y:146,tags:[[-26,'A'],[26,'b']],ts:.85}),strand(s,{L:96,color:'mom',x:520,y:168,tags:[[-26,'A'],[26,'b']],ts:.85})];
  const key=H.g(s);H.O(key,0,{d:0});H.E('rect',{x:224,y:22,width:192,height:72,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},key);
  lbl(key,320,46,'A long tail  >  a short tail','lbs',{st:'font-weight:600;fill:var(--ink)'});lbl(key,320,68,'B brown  >  b white','lbs',{st:'font-weight:600;fill:var(--ink)'});lbl(key,320,86,'> means “is dominant to”','lbs',{st:'font-size:10.5px'});
  const gc=[[200,232],[440,232]].map(([x,y])=>{const c=H.E('circle',{cx:x,cy:y,r:30,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},s);H.O(c,0,{d:0});return c});
  const F=H.g(s);H.O(F,0,{d:0});const fm=mouse(F,{fur:'brown',tail:'long',x:250,y:330});lbl(F,250,376,'F1: Aa Bb','lb');lbl(F,250,392,'long tail, brown','lbs');
  H.E('ellipse',{cx:430,cy:330,rx:78,ry:40,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},F);
  const mv=[strand(s,{L:96,color:'dad',x:120,y:146,tags:[[-26,'a'],[26,'B']],ts:.85}),strand(s,{L:96,color:'mom',x:520,y:146,tags:[[-26,'A'],[26,'b']],ts:.85})];H.O(mv,0,{d:0});
  const pg=H.g(s);H.O(pg,0,{d:0});lbl(pg,560,316,'parental:','lbs',{'text-anchor':'start'});lbl(pg,560,332,'aB, Ab','lb',{'text-anchor':'start'});lbl(pg,560,352,'recombinant:','lbs',{'text-anchor':'start'});lbl(pg,560,368,'ab, AB','lb',{'text-anchor':'start'});
  const q=plate(s,430,404,'same chromosome? how close?','middle');
  return [
    ()=>{},
    ()=>{H.O(key,1)},
    ()=>{H.O(gc,1,{d:400});H.O(mv,1,{d:200});H.T(mv[0],{x:200,y:232,s:.55},{d:1100});H.T(mv[1],{x:440,y:232,s:.55},{d:1100})},
    ()=>{H.O(gc,0,{d:500,at:400});H.O(F,1,{d:600});H.T(mv[0],{x:430,y:318,s:1},{d:1200});H.T(mv[1],{x:430,y:342,s:1},{d:1200});H.O(pg,1,{at:1100})},
    ()=>{H.O(q,1)},
  ];}},

/* 23 ─────────────────────────────── */
{sec:'9.6',title:'The Test Cross Reveals Each Gamete',caption:'Tester: aa bb (short tail, white) makes only ab gametes · grey = from the tester',
text:`<p data-step="0">Mate the F1 dihybrid (Aa Bb) with a tester mouse, aa bb. The tester has a short tail and white fur, and it makes only ab gametes.</p>
<p data-step="1">The F1 makes four types of gamete: aB, Ab, ab and AB. Each one joins an ab gamete from the tester.</p>
<p data-step="2">Each type of F1 gamete gives a different phenotype. aB gives aa Bb (short, brown). Ab gives Aa bb (long, white). ab gives aa bb (short, white). AB gives Aa Bb (long, brown).</p>
<p data-step="3">So the phenotype of each offspring shows which gamete the F1 made. Short brown and long white offspring got parental gametes from the F1. Short white and long brown offspring got recombinant gametes.</p>
<p data-step="4">If only short brown and long white offspring appear, the F1 made only parental gametes, and RF = 0%.</p>`,
star:'Tester adds only recessive alleles, so each offspring shows the F1’s gamete.',starStep:3,
scene(H){const s=ST();
  cap(s,120,20,'F1 dihybrid');mouse(s,{fur:'brown',tail:'long',x:82,y:62,s:.62});
  const f1=[strand(s,{L:80,color:'dad',x:196,y:50,tags:[[-22,'a'],[22,'B']],ts:.8,w:7}),strand(s,{L:80,color:'mom',x:196,y:74,tags:[[-22,'A'],[22,'b']],ts:.8,w:7})];
  lbl(s,320,72,'×','big');
  cap(s,500,20,'Tester');mouse(s,{fur:'white',tail:'short',x:452,y:62,s:.62});
  strand(s,{L:80,color:'muted',x:556,y:50,tags:[[-22,'a'],[22,'b']],ts:.8,w:7});strand(s,{L:80,color:'muted',x:556,y:74,tags:[[-22,'a'],[22,'b']],ts:.8,w:7});
  const hd=H.g(s);[[70,'F1 gamete'],[170,'tester'],[272,'offspring'],[430,'phenotype'],[592,'type']].forEach(([x,t])=>cap(hd,x,118,t));
  H.E('line',{x1:20,y1:126,x2:620,y2:126,st:'stroke:var(--faint);stroke-width:1.5'},hd);
  const rows=[[[[-30,30,'dad']],'a','B','aa Bb','brown','short','short, brown','P'],[[[-30,30,'mom']],'A','b','Aa bb','white','long','long, white','P'],
    [[[-30,0,'dad'],[0,30,'mom']],'a','b','aa bb','white','short','short, white','R'],[[[-30,0,'mom'],[0,30,'dad']],'A','B','Aa Bb','brown','long','long, brown','R']];
  const ry=[160,214,268,322];
  const R=rows.map(([segs,a,b,g,fur,tail,ph,k],i)=>{const y=ry[i];
    const st=strand(s,{segs,x:196,y:i===0||i===3?50:74,tags:[[-15,a],[15,b]],ts:.8,w:7});H.O(st,0,{d:0});st.y=y;
    const tt=strand(s,{L:60,color:'muted',x:556,y:62,tags:[[-15,'a'],[15,'b']],ts:.8,w:7});H.O(tt,0,{d:0});
    const G=H.g(s);H.O(G,0,{d:0});lbl(G,272,y+5,g,'lb');mouse(G,{fur,tail,x:400,y:y+2,s:.5});lbl(G,488,y+5,ph,'lbs',{'text-anchor':'start'});
    const c=chip(s,592,y,k);H.O(c,0,{d:0});return {st,tt,G,c,y}});
  const note=plate(s,320,400,'only parental classes → RF = 0%','middle');
  return [
    ()=>{},
    ()=>{R.forEach((r,i)=>{H.O([r.st,r.tt],1,{d:200,at:i*150});H.T(r.st,{x:70,y:r.y},{d:1100,at:i*150});H.T(r.tt,{x:170,y:r.y},{d:1100,at:i*150})})},
    ()=>{R.forEach((r,i)=>H.O(r.G,1,{at:i*250}))},
    ()=>{R.forEach((r,i)=>H.O(r.c,1,{at:i*150}))},
    ()=>{R.slice(2).forEach(r=>H.O([r.st,r.tt,r.G,r.c],.2));H.O(note,1)},
  ];}},

/* 24 ─────────────────────────────── */
{sec:'9.6',title:'Count the Offspring, Calculate RF',caption:'Test-cross offspring of the Aa Bb mice · bar height = number of offspring',
text:`<p data-step="0">The test cross gives 120 offspring. Short brown: 48. Long white: 42. Short white: 13. Long brown: 17.</p>
<p data-step="1"><b>Parental classes:</b> short brown (from gamete aB) and long white (from gamete Ab). 48 + 42 = 90.</p>
<p data-step="2"><b>Recombinant classes:</b> short white (from gamete ab) and long brown (from gamete AB). 13 + 17 = 30.</p>
<p data-step="3">RF = 30 ÷ 120 = 0.25, or 25%.</p>
<p data-step="4">The RF is below 30%, so the tail-length gene and the fur-colour gene show partial linkage. They are on the same chromosome, roughly 25 map units apart.</p>`,
star:'RF = 30 ÷ 120 = 25%: partial linkage.',starStep:4,
scene(H){const s=ST();const base=282,K=2.2,W=56;
  const data=[[48,'short, brown','aB','brown','short','P'],[42,'long, white','Ab','white','long','P'],[13,'short, white','ab','white','short','R'],[17,'long, brown','AB','brown','long','R']];
  const bx=[74,184,294,404];
  H.E('line',{x1:24,y1:base,x2:620,y2:base,cls:'k',st:'stroke-width:2'},s);
  const ghosts=[];const B=data.map(([n,ph,g,fur,tail,k],i)=>{const x=bx[i];
    const gh=H.g(s);H.E('rect',{x:x-W/2,y:base-n*K,width:W,height:n*K,st:'fill:none;stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 4'},gh);lbl(gh,x,base-n*K-8,String(n),'lbs',{st:'font-weight:700'});H.O(gh,0,{d:0});ghosts.push(gh);
    const G=H.g(s);const r=H.E('rect',{x:-W/2,y:-n*K,width:W,height:n*K,st:`fill:${k==='P'?'var(--ink)':'var(--hi)'};stroke:var(--ink);stroke-width:1.2`},G);
    const t=lbl(G,0,-n*K+16,String(n),'lb',{st:`fill:${k==='P'?'var(--paper)':'#16181d'}`});H.T(G,{x,y:base,sx:1,sy:.001},{d:0});
    mouse(s,{fur,tail,x:x+8,y:base+26,s:.46});lbl(s,x,base+56,ph,'lbs',{st:'font-weight:600;fill:var(--ink)'});lbl(s,x,base+72,'gamete '+g,'lbs');
    const c=chip(s,x,base+94,k);H.O(c,0,{d:0});return {G,n,x,k,c}});
  const SX=548;let off={P:0};
  const tag2=(y,a,b)=>{const G=H.g(s);lbl(G,SX+42,y,a,'big',{'text-anchor':'start',st:'font-size:22px'});lbl(G,SX+42,y+16,b,'lbs',{'text-anchor':'start'});H.O(G,0,{d:0});return G};
  const tp=tag2(base-90*K/2+4,'90','parental'),tr=tag2(base-90*K-30*K/2+4,'30','recomb.');
  const fx=H.g(s);H.O(fx,0,{d:0});H.E('rect',{x:120,y:20,width:330,height:50,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},fx);
  lbl(fx,285,52,'RF = 30 ÷ 120 = 0.25 = 25%','lb',{st:'font-family:var(--f-math);font-style:italic;font-size:21px'});
  const vd=plate(s,285,98,'below 30%: partial linkage','middle');
  const stack=(list,y0)=>{let y=y0;list.forEach((i,j)=>{const b=B[i];H.O(ghosts[i],1);H.T(b.G,{x:SX,y:base-y},{d:1200,at:j*250});y+=b.n*K})};
  return [
    ()=>{B.forEach((b,i)=>{H.T(b.G,{sy:1},{d:1000,at:i*150});H.O(b.c,1,{at:600+i*150})})},
    ()=>{stack([0,1],0);H.O(tp,1,{at:1300})},
    ()=>{stack([2,3],90*K);H.O(tr,1,{at:1300})},
    ()=>{H.O(fx,1)},
    ()=>{H.O(vd,1)},
  ];}},

/* 25 ─────────────────────────────── */
{sec:'9.9',title:'A Linked Marker as an Early Warning',caption:'E = earlobe-shape allele at the marker locus · R = risk allele · grey = from the other parent',
text:`<p data-step="0">A <b>marker locus</b> is a locus whose alleles are easy to see or test. Suppose that an earlobe-shape allele (E) at a marker locus is tightly linked to a risk allele (R). The R allele raises the risk of <b>cardiovascular disease</b> (disease of the heart and blood vessels).</p>
<p data-step="1">Tight linkage means that crossovers between the two loci are rare. So in a family, E and R pass together from parent to child.</p>
<p data-step="2">A doctor can then use the earlobe shape as an early warning. A person with the E phenotype probably carries the R allele. That person can have more checkups and avoid other risks, such as smoking.</p>
<p data-step="3">The marker works only in a family where E and R sit on the same homolog. In another family, E can sit next to the low-risk allele r. In a whole population, the marker works only if most E alleles sit next to the R allele.</p>`,
star:'A tightly linked marker travels with its neighbour.',starStep:1,
scene(H){const s=ST();
  const card=(x,y,top,bot,o)=>{o=o||{};const G=H.g(s);G.box=H.E('rect',{x:-62,y:-30,width:124,height:60,rx:10,cls:'cellfill',st:'stroke:var(--ink);stroke-width:1.8'},G);
    G.a=strand(G,{segs:[[-46,46,top[0]]],y:-11,tags:[[-14,top[1]],[14,top[2]]],ts:.8,w:7});G.b=strand(G,{segs:[[-46,46,bot[0]]],y:13,tags:[[-14,bot[1]],[14,bot[2]]],ts:.8,w:7});
    H.T(G,{x,y},{d:0});return G};
  cap(s,320,20,'Parents');
  const P1=card(230,62,['dad','E','R'],['mom','e','r']),P2=card(410,62,['muted','e','r'],['muted','e','r']);
  cap(s,320,142,'Children');
  const kids=[[95,0],[245,1],[395,0],[545,1]].map(([x,k])=>{const G=card(x,190,k?['mom','e','r']:['dad','E','R'],['muted','e','r']);H.O(G,0,{d:0});G.x=x;G.k=k;return G});
  const fam=H.g(s);H.O(fam,0,{d:0});H.E('path',{d:'M320,62 L320,120 M95,120 L545,120 M95,120 L95,158 M245,120 L245,158 M395,120 L395,158 M545,120 L545,158',st:'fill:none;stroke:var(--ink);stroke-width:1.6'},fam);
  H.E('line',{x1:292,y1:62,x2:348,y2:62,st:'stroke:var(--ink);stroke-width:1.6'},fam);
  const warn=kids.filter(G=>!G.k).map(G=>{const W=H.g(s);H.E('rect',{x:G.x-68,y:154,width:136,height:72,rx:13,st:'fill:none;stroke:var(--hi);stroke-width:4'},W);lbl(W,G.x,244,'marker → checkups','lbs',{st:'font-weight:700;fill:var(--ink)'});H.O(W,0,{d:0});return W});
  const other=H.g(s);H.O(other,0,{d:0});H.E('line',{x1:20,y1:272,x2:620,y2:272,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},other);
  cap(other,320,296,'Another family');const oc=card(200,346,['dad','E','r'],['mom','e','R']);other.appendChild(oc);
  lbl(other,282,340,'here E sits next to r,','lbs',{'text-anchor':'start',st:'font-weight:600;fill:var(--ink)'});lbl(other,282,358,'so the earlobe shape does not predict risk','lbs',{'text-anchor':'start',st:'font-weight:600;fill:var(--ink)'});
  return [
    ()=>{},
    ()=>{H.O(fam,1);kids.forEach((G,i)=>{const at=200+i*250;const c=G.k?['mom','e','r']:['dad','E','R'];
      const mv=strand(s,{segs:[[-46,46,c[0]]],x:230,y:G.k?75:51,tags:[[-14,c[1]],[14,c[2]]],ts:.8,w:7});H.O(mv,0,{d:0});
      H.O(mv,1,{d:200,at});H.T(mv,{x:G.x,y:179},{d:1000,at});H.O(G,1,{at:at+900});H.O(mv,0,{d:200,at:at+1100})})},
    ()=>{warn.forEach((W,i)=>H.O(W,1,{at:i*200}))},
    ()=>{H.O(other,1)},
  ];}},

/* 26 ─────────────────────────────── */
{sec:'9.5',title:'Unlinked, Partial or Complete?',wide:true,steps:3,
text:`<div class="tblwrap" data-step="0"><table class="tbl">
<thead><tr><th></th><th>Unlinked</th><th>Partial linkage</th><th>Complete linkage</th></tr></thead>
<tbody>
<tr><td>Where the loci are</td><td>on different chromosomes, or far apart on one chromosome</td><td>on one chromosome, at a medium distance</td><td>on one chromosome, very close together</td></tr>
<tr><td>Crossovers between the loci</td><td>none needed (different chromosomes) or many</td><td>in some meioses, not in all</td><td>almost never</td></tr>
<tr><td>Gametes of a dihybrid</td><td>4 types in equal numbers</td><td>2 large parental types, 2 small recombinant types</td><td>2 parental types only</td></tr>
</tbody><tbody data-step="1">
<tr><td>Test-cross classes</td><td>4 classes of about equal size</td><td>2 large classes + 2 small classes</td><td>2 classes</td></tr>
<tr><td>RF</td><td>about 50% (real data about 40–60%)</td><td>more than 0% and less than 50% (clear cases up to about 30%)</td><td>0%</td></tr>
<tr><td>Example</td><td>genes on two different chromosomes</td><td>mouse tail and fur genes, RF = 25%</td><td>two loci side by side</td></tr>
</tbody></table></div>
<div data-step="2"><h3>Decision steps for test-cross data</h3><ol>
<li>Find the two largest classes. They are the parental classes.</li>
<li>Add the two smaller classes, and divide by the total: RF = recombinants ÷ total.</li>
<li>RF = 0%: complete linkage. RF up to about 30%: partial linkage. RF about 50%: unlinked. RF between 30% and 50%: partial linkage or unlinked, and the data cannot decide.</li>
</ol></div>`,
star:'Largest two = parental. Smallest two ÷ total = RF.',starStep:2},

/* 27 ─────────────────────────────── */
{sec:'9.7',title:'Summary',wide:true,steps:2,
text:`<div class="cols" data-step="0"><div><h3>Main points</h3><ul>
<li>Recombination is any process that makes gametes with combinations of alleles that were not in the gametes of the previous generation.</li>
<li>The RF between two loci depends on where the loci are on the chromosomes. Loci far apart have a higher RF than loci close together.</li>
<li>Unlinked loci have the maximum RF, 50%.</li>
</ul></div><div><h3>&nbsp;</h3><ul>
<li>Loci close together on one chromosome are linked. They tend to stay in the combinations that were in the parents.</li>
<li>Crossovers are a normal part of most meioses. Crossovers allow recombination between linked loci.</li>
<li>RF is easiest to measure with pure-breeding lines that have two alleles at each locus, and a tester line for the test cross.</li>
</ul></div></div>
<div class="cols" data-step="1"><div><h3>The genome view</h3><ul>
<li>A gene is a position on one DNA molecule. Genes on the same molecule travel together unless a crossover falls between them.</li>
<li>One crossover involves only 2 of the 4 chromatids. On average, crossovers involve half the chromatids, so RF cannot exceed 50%.</li>
</ul></div><div><h3>&nbsp;</h3><ul>
<li>In humans, each pair of homologs has one to a few crossovers per meiosis. On average, 1 cM is about 1 million base pairs.</li>
<li>Most human crossovers fall in short hotspots that the protein PRDM9 marks.</li>
</ul></div></div>`,
star:'Close = linked = mostly parental combinations. Far apart or separate chromosomes = 50%.',starStep:1},

/* 28 ─────────────────────────────── */
{sec:'9.8',title:'Key Terms: Genes and Linkage',wide:true,steps:1,
text:`<div class="terms">
<div class="term"><b>gene</b>A unit of heredity: a DNA segment at one locus that affects one or more traits.</div>
<div class="term"><b>locus (plural loci)</b>The position of a gene on a chromosome or in the genome.</div>
<div class="term"><b>allele</b>One version of a gene. Alleles of one gene differ in their DNA sequence.</div>
<div class="term"><b>genotype</b>The alleles of a cell or organism, usually only for the genes under study.</div>
<div class="term"><b>phenotype</b>A trait that you can detect, such as wing shape or fur colour.</div>
<div class="term"><b>linkage</b>The tendency of alleles at loci close together on one chromosome to go into gametes together.</div>
<div class="term"><b>unlinked</b>Loci on different chromosomes, or far apart on one chromosome. They assort independently, and RF is about 50%.</div>
<div class="term"><b>independent assortment</b>The alleles of different genes go into gametes independently of each other.</div>
<div class="term"><b>Second Law of Independent Assortment</b>Mendel’s Second Law: the alleles of two genes assort independently. Linked genes do not follow this law.</div>
<div class="term"><b>synapsis</b>The pairing of homologs along their full length in prophase I of meiosis.</div>
<div class="term"><b>crossover</b>An exchange of DNA segments between two chromatids, usually non-sister chromatids, in prophase I.</div>
</div>`},

/* 29 ─────────────────────────────── */
{sec:'9.8',title:'Key Terms: Recombination',wide:true,steps:1,
text:`<div class="terms">
<div class="term"><b>recombination</b>Any process that makes gametes with allele combinations that were not in the parents’ gametes.</div>
<div class="term"><b>interchromosomal recombination</b>Recombination of genes on different chromosomes, by independent assortment.</div>
<div class="term"><b>intrachromosomal recombination</b>Recombination of genes on the same chromosome, by a crossover between them.</div>
<div class="term"><b>parental genotype (and gametes)</b>An allele combination that the individual got from its parents.</div>
<div class="term"><b>recombinant genotype (and gametes)</b>A new allele combination that was not in the individual’s parents.</div>
<div class="term"><b>recombination frequency (RF)</b>Recombinants ÷ total gametes or offspring. The maximum is 50%.</div>
<div class="term"><b>coupling (cis) configuration</b>Both dominant (or wild-type) alleles on one homolog: AB/ab.</div>
<div class="term"><b>repulsion (trans) configuration</b>One dominant and one recessive allele on each homolog: Ab/aB.</div>
<div class="term"><b>complete (absolute) linkage</b>Loci so close that no recombinants appear: RF = 0%.</div>
<div class="term"><b>incomplete (partial) linkage</b>Loci on one chromosome with crossovers between them in some meioses. RF is more than 0% and less than 50% (clear cases up to about 30%).</div>
<div class="term"><b>syntenic</b>On the same chromosome, linked or not. All linked genes are syntenic.</div>
</div>`},

/* 30 ─────────────────────────────── */
{sec:'9.9',title:'Check Your Understanding (1)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">1. Compare the terms “recombination” and “crossover”. How are they similar? How are they different?</div><button>Show answer</button><div class="a" hidden><b>Similar:</b> both concern new combinations of alleles from meiosis. A crossover between two loci makes recombinant chromatids.<br><b>Different:</b> a crossover is a physical exchange between two non-sister chromatids. A microscope shows it as a chiasma. Recombination is a genetic result: the fraction of offspring with new allele combinations at marker loci.<br>Not every crossover gives recombination. A crossover outside the markers changes nothing between them. Two crossovers between the markers that involve the same two chromatids give a parental result. An exchange between sister chromatids swaps identical alleles.<br>Some recombinants have no crossover. Genes on different chromosomes recombine by independent assortment.</div></div>
<div class="qa"><div class="q">2. Why do you usually need pure-breeding lines to measure linkage?</div><button>Show answer</button><div class="a" hidden>Pure-breeding parents are homozygous, so each parent makes only one type of gamete with a known genotype. So you know which allele combinations the F1 received: those are the parental combinations. Then you can label each test-cross class as parental or recombinant and calculate RF. With heterozygous parents, you cannot tell which combinations the F1 received.</div></div>
<div class="qa"><div class="q">3. An allele that dominantly affects earlobe shape is tightly linked to an allele that dominantly affects the risk of cardiovascular disease. When is this information useful in a clinic?</div><button>Show answer</button><div class="a" hidden>It is useful when the earlobe allele and the risk allele sit on the same homolog. The two alleles must sit together in that family, or in most people of the population. Tight linkage means that crossovers rarely split them. Then a person with the earlobe phenotype probably carries the risk allele. The doctor can tell the person about the higher risk. The person can have more checkups and reduce other risk factors. In a family where the earlobe allele sits next to the low-risk allele, the marker does not predict risk.</div></div>
<div class="qa"><div class="q">4. Without gene interaction (one gene changing the effect of another), a dihybrid cross gives a 9 : 3 : 3 : 1 phenotype ratio. (a) What does this ratio assume about linkage? (b) What ratio do you get with complete linkage? Consider every configuration of alleles in the dihybrids.</div><button>Show answer</button><div class="a" hidden><b>(a)</b> It assumes that the two loci are unlinked. Each dihybrid then makes AB, Ab, aB and ab in equal numbers.<br><b>(b)</b> With complete linkage, each dihybrid makes only its two parental gametes.<br>Coupling × coupling (AB/ab × AB/ab): gametes AB and ab. Offspring 1 AA BB : 2 Aa Bb : 1 aa bb, so 3 A_B_ : 1 aabb.<br>Repulsion × repulsion (Ab/aB × Ab/aB): gametes Ab and aB. Offspring 1 AA bb : 2 Aa Bb : 1 aa BB, so 1 A_bb : 2 A_B_ : 1 aaB_.<br>Coupling × repulsion: offspring AA Bb, Aa BB, Aa bb and aa Bb, so 2 A_B_ : 1 A_bb : 1 aaB_.<br>(A_ means AA or Aa.)</div></div>
</div>`},

/* 31 ─────────────────────────────── */
{sec:'9.9',title:'Check Your Understanding (2)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">5. A dihybrid has the genotype Cc Ee. Give the genotypes of the parental and recombinant offspring of a test cross (× cc ee) if the alleles are (a) in coupling, (b) in repulsion.</div><button>Show answer</button><div class="a" hidden><b>(a) Coupling, CE/ce.</b> Parental gametes CE and ce give Cc Ee and cc ee. Recombinant gametes Ce and cE give Cc ee and cc Ee.<br><b>(b) Repulsion, Ce/cE.</b> Parental gametes Ce and cE give Cc ee and cc Ee. Recombinant gametes CE and ce give Cc Ee and cc ee.</div></div>
<div class="qa"><div class="q">6. White flowers (w) are recessive to purple (W), and yellow seeds (y) are recessive to green (Y). Test cross a dihybrid with green seeds and purple flowers. Half of the offspring have yellow seeds. (a) What can you conclude about linkage? (b) What do you need to know about the offspring?</div><button>Show answer</button><div class="a" hidden><b>(a)</b> Nothing. The cross is Ww Yy × ww yy. Yy × yy always gives ½ Yy (green) and ½ yy (yellow), with or without linkage. One gene alone cannot show linkage.<br><b>(b)</b> You need the number of offspring in each of the four classes: purple green, purple yellow, white green and white yellow. You also need the parental combinations of the dihybrid. Four classes of about equal size mean unlinked genes. Two large and two small classes mean linkage, with RF = (the two small classes) ÷ total.</div></div>
<div class="qa"><div class="q">7. Test cross the F1 of the cross aa BB × AA bb. The offspring are: Aa Bb 135, Aa bb 430, aa Bb 390, aa bb 120. What is the recombination frequency?</div><button>Show answer</button><div class="a" hidden>The F1 got aB from one parent and Ab from the other, so aB and Ab are the parental gametes.<br>Parental offspring: aa Bb (from aB) 390 and Aa bb (from Ab) 430. As expected, the parental classes are the two largest.<br>Recombinant offspring: Aa Bb (from AB) 135 and aa bb (from ab) 120. Total recombinants = 255.<br>Total = 135 + 430 + 390 + 120 = 1075.<br>RF = 255 ÷ 1075 = 0.237, or about 23.7%. The loci show partial linkage.</div></div>
<div class="qa"><div class="q">8. What does the sentence “All linked genes are syntenic, but not all syntenic genes are linked” mean?</div><button>Show answer</button><div class="a" hidden>Syntenic genes are on the same chromosome. Linked genes are always on the same chromosome, so they are always syntenic. But two genes far apart on one long chromosome have many crossovers between them. So they assort independently, with RF about 50%. Such genes are syntenic but not linked.</div></div>
</div>`},

]});
})();
