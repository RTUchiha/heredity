/* Chapter 10 · Sex Chromosomes and Sex Linkage — source: Hairdity.pdf ch. 10 (Singh, Introduction to Genetics, CC BY-NC-SA 4.0) */
(function(){
const H=window.HL;
const $s=()=>document.getElementById('stage');
/* ---- deck-local helpers ---- */
function drawA(a,o){H.D(a.firstChild,1,Object.assign({d:600},o));H.O(a.lastChild,1,Object.assign({d:200},o,{at:((o&&o.at)||0)+450}));}
function mkA(p,x1,y1,x2,y2,o){const a=H.arrow(p,x1,y1,x2,y2,o);H.O(a.lastChild,0,{d:0});return a;}
function org(e,x,y){e.style.transformOrigin=`${x}px ${y}px`;return e;}
function pop(e,o){H.T(e,{s:1},Object.assign({d:700},o));H.O(e,1,Object.assign({d:300},o));}
function hide(e){H.T(e,{s:.001},{d:0});H.O(e,0,{d:0});}
/* start an element offset by (dx,dy) and invisible; go() moves it home */
function from(G,dx,dy){H.T(G,{x:dx,y:dy},{d:0});H.O(G,0,{d:0});return G;}
function go(G,o){o=o||{};H.O(G,1,{d:250,at:o.at});H.T(G,{x:0,y:0},{d:o.d||1000,at:o.at});}
function fade(G){H.O(G,0,{d:0});return G;}
/* chromosome bar (unreplicated): letter inside, edge colour = parent of origin */
function cb(p,x,y,lab,o){o=o||{};const L=o.len||(lab==='Y'||lab==='W'?30:58),w=o.w||16;const G=H.g(p);
  G.body=H.E('rect',{x:x-w/2,y:y-L/2,width:w,height:L,rx:w/2,st:`fill:${H.C(o.fill||'card')};stroke:${H.C(o.col||'ink')};stroke-width:${o.sw||3}`},G);
  if(lab)G.t=H.txt(G,x,y+(o.fs||13)*.36,lab,'',{'text-anchor':'middle',st:`font:800 ${o.fs||13}px var(--f-display);fill:${H.C(o.ink||'ink')}`});
  G.x=x;G.y=y;G.L=L;return G;}
/* allele tile: chromosome letter + superscript allele. fill 'bad' = red-eye allele */
function tile(p,x,y,lab,sup,o){o=o||{};const W=o.w||(sup?32:24),Ht=o.h||22;const G=H.g(p);
  const fill=o.fill||((lab==='Y'||lab==='W')?'wash':'card');
  G.r=H.E('rect',{x:x-W/2,y:y-Ht/2,width:W,height:Ht,rx:5,st:`fill:${H.C(fill)};stroke:${H.C(o.edge||'ink')};stroke-width:${o.edge?2.6:1.5}`},G);
  const t=H.E('text',{x:x+(sup?-2:0),y:y+5,'text-anchor':'middle',st:`font:800 ${o.fs||14}px var(--f-display);fill:${H.C(o.ink||(fill==='bad'?'paper':'ink'))}`},G);
  H.E('tspan',{text:lab},t);if(sup)H.E('tspan',{text:sup,dy:-6,st:`font:700 ${o.fss||11}px var(--f-body)`},t);
  G.x=x;G.y=y;return G;}
/* pedigree-style symbol: square = male, circle = female */
function sym(p,x,y,sex,o){o=o||{};const r=o.r||12;const G=H.g(p);
  const st=`fill:${H.C(o.fill||'card')};stroke:var(--ink);stroke-width:2.2`;
  G.s=sex==='m'?H.E('rect',{x:x-r,y:y-r,width:2*r,height:2*r,st},G):H.E('circle',{cx:x,cy:y,r,st},G);return G;}
/* top-view fruit fly; eye 'red' | 'white'; male has a dark tip on the abdomen */
function fly(p,x,y,o){o=o||{};const G=H.g(p);const I=H.g(G);
  [-1,1].forEach(sg=>H.E('ellipse',{cx:sg*9,cy:8,rx:6.5,ry:16,transform:`rotate(${sg*-16} ${sg*9} 8)`,st:'fill:var(--wash);stroke:var(--muted);stroke-width:1'},I));
  H.E('ellipse',{cx:0,cy:12,rx:7.5,ry:11,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.4'},I);
  [8,13].forEach(yy=>H.E('line',{x1:-6.5,y1:yy,x2:6.5,y2:yy,st:'stroke:var(--ink);stroke-width:1.1'},I));
  if(o.sex==='m')H.E('path',{d:'M-6.2,16 Q0,27 6.2,16 Z',st:'fill:var(--ink)'},I);
  H.E('ellipse',{cx:0,cy:-3,rx:7,ry:7.5,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.4'},I);
  H.E('ellipse',{cx:0,cy:-13,rx:7.5,ry:4.8,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.4'},I);
  G.eyes=[-1,1].map(sg=>H.E('circle',{cx:sg*6.2,cy:-13.5,r:3.6,st:`fill:${o.eye==='white'?'var(--card)':'var(--bad)'};stroke:var(--ink);stroke-width:1.2`},I));
  H.T(I,{x,y,s:o.s||1},{d:0});G.I=I;return G;}
/* drawn sex glyph (fonts render ♂ inconsistently); (x,y) is the text baseline it replaces */
function sexT(p,x,y,sex,o){const k=((o&&o.fs)||17)/17,cy=y-6*k,G=H.g(p);const st=`fill:none;stroke:${H.C((o&&o.c)||'ink')};stroke-width:${2*Math.max(1,k*.8)};stroke-linecap:round;stroke-linejoin:round`;
  if(sex==='f'){H.E('circle',{cx:x,cy:cy-3*k,r:5*k,st},G);H.E('path',{d:`M${x},${cy+2*k} V${cy+10*k} M${x-3.6*k},${cy+6.5*k} H${x+3.6*k}`,st},G);}
  else{const cx=x-2*k,c2=cy+2.5*k;H.E('circle',{cx,cy:c2,r:5*k,st},G);const a=cx+3.5*k,b=c2-3.5*k,t=cx+9*k,u=c2-9*k;H.E('path',{d:`M${a},${b} L${t},${u} M${t-4.5*k},${u} H${t} V${u+4.5*k}`,st},G);}
  return G;}
/* a small pill label */
function pill(p,x,y,t,o){o=o||{};const G=H.g(p);const w=o.w||t.length*6.8+18;
  G.r=H.E('rect',{x:x-w/2,y:y-11,width:w,height:22,rx:11,st:`fill:${H.C(o.fill||'card')};stroke:${H.C(o.stroke||'ink')};stroke-width:1.5`},G);
  G.t=H.txt(G,x,y+4.3,t,'lbs',{'text-anchor':'middle',st:`font-weight:700;fill:${H.C(o.ink||'ink')}`});return G;}
function cross(p,x,y,h,o){o=o||{};const G=H.g(p);H.E('path',{d:`M${x-h},${y-h} L${x+h},${y+h} M${x+h},${y-h} L${x-h},${y+h}`,pathLength:1,cls:'draw',st:`fill:none;stroke:var(--bad);stroke-width:${o.w||4};stroke-linecap:round`},G);return G;}
/* sperm cell: head ellipse + tail */
function sperm(p,x,y,o){o=o||{};const G=H.g(p);
  H.E('path',{d:`M${x-16},${y} C${x-28},${y-7} ${x-34},${y+7} ${x-46},${y}`,st:'fill:none;stroke:var(--ink);stroke-width:2;stroke-linecap:round'},G);
  H.E('ellipse',{cx:x,cy:y,rx:o.rx||17,ry:o.ry||12,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},G);return G;}

/* reciprocal-cross scene: Morgan's drawing at left, Punnett squares at right; tiles travel drawing → squares → drawing */
function crossScene(H,c){const s=$s();const k=404/c.h,oy=8;const FP=i=>[c.fl[i][0]*k,oy+c.fl[i][1]*k];
  H.E('image',{href:c.img,x:0,y:oy,width:c.w*k,height:404},s);
  const TK={'+':['X','+','bad'],'w':['X','w','card'],'Y':['Y','',null]};
  const tk=(p,x,y,t,edge,sm)=>{const d=TK[t];const o={edge,w:sm?(d[1]?27:21):(d[1]?32:24),h:sm?19:22,fs:sm?12:14,fss:sm?9.5:11};if(d[2])o.fill=d[2];return tile(p,x,y,d[0],d[1],o)};
  const mv=(p,x,y,t,edge,sm,sx,sy)=>from(tk(p,x,y,t,edge,sm),sx-x,sy-y);
  const ovPos=i=>{const [x,y]=FP(i);return [[x-14,y],[x+14,y]]};
  // P overlays
  const P=[0,1].map(i=>{const G=H.g(s);const pp=ovPos(i);c.P[i].forEach((t,j)=>tk(G,pp[j][0],pp[j][1],t,null,1));H.O(G,0,{d:0});return G});
  // right panel geometry
  const cX=[440,550],r1=84,r2=[220,276],ex=354;
  const head=(y,t)=>H.txt(s,495,y,t,'cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  const grid=(ys)=>{const y0=ys[0]-28,y1=ys[ys.length-1]+28;let d=`M385,${y0} H605 V${y1} H385 Z M495,${y0} V${y1}`;if(ys.length>1)d+=` M385,${(ys[0]+ys[1])/2} H605`;
    return H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:1.6'},s)};
  const h1=head(24,'P GAMETES → F1'),g1=grid([r1]);H.O(h1,0,{d:0});
  const lb=(x,y,t)=>{const e=H.txt(s,x,y,t,'lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(e,0,{d:0});return e};
  const l1=[lb(ex,62,'eggs'),lb(392,50,'sperm')];l1[1].setAttribute('text-anchor','end');l1[1].setAttribute('x',412);
  const pf=ovPos(0),pm=ovPos(1);
  const e1=mv(s,ex,r1,c.P[0][0],'mom',0,pf[0][0],pf[0][1]);
  const s1=cX.map((x,j)=>mv(s,x,46,c.P[1][j],'dad',0,pm[j][0],pm[j][1]));
  const off=(egg,sp)=>{const fem=sp!=='Y';const red=egg==='+'||sp==='+';return {fem,red}};
  const cellFill=(ys,eggs)=>{const out=[];ys.forEach((y,i)=>cX.forEach((x,j)=>{const G=H.g(s);out.push(G);G.r=i;G.c=j;G.y=y;G.x=x;}));return out};
  const mkCells=(ys,eggT,spT,eggH,spH)=>{const cells=[];ys.forEach((y,i)=>cX.forEach((x,j)=>{const a=mv(s,x-17,y-9,eggT[i],'mom',0,eggH[i][0],eggH[i][1]),b=mv(s,x+17,y-9,spT[j],'dad',0,spH[j][0],spH[j][1]);
      const o=off(eggT[i],spT[j]);const L=H.g(s);sexT(L,x-26,y+21,o.fem?'f':'m',{fs:14});H.txt(L,x+4,y+20,o.red?'red':'white','lbs',{'text-anchor':'middle',st:`font-weight:800;fill:${o.red?'var(--bad)':'var(--ink)'}`});H.O(L,0,{d:0});
      cells.push({a,b,L,eg:eggT[i],sp:spT[j],x,y})}));return cells};
  const c1=mkCells([r1],[c.P[0][0]],c.P[1],[[ex,r1]],cX.map(x=>[x,46]));
  // F1 overlays come from cells
  const F1=[0,1].map(i=>{const C=c1[i];const pp=ovPos(2+i);const G=H.g(s);G.a=mv(G,pp[0][0],pp[0][1],C.eg,'mom',1,C.x-17,C.y-9);G.b=mv(G,pp[1][0],pp[1][1],C.sp,'dad',1,C.x+17,C.y-9);return G});
  // F2
  const h2=head(160,'F1 GAMETES → F2'),g2=grid(r2);H.O(h2,0,{d:0});const l2=[lb(ex,198,'eggs'),lb(392,190,'sperm')];l2[1].setAttribute('text-anchor','end');l2[1].setAttribute('x',412);
  const fF=ovPos(2),fM=ovPos(3);const f1f=[c1[0].eg,c1[0].sp],f1m=[c1[1].eg,c1[1].sp];
  const e2=r2.map((y,i)=>mv(s,ex,y,f1f[i],'mom',0,fF[i][0],fF[i][1]));
  const s2=cX.map((x,j)=>mv(s,x,186,f1m[j],'dad',0,fM[j][0],fM[j][1]));
  const c2=mkCells(r2,f1f,f1m,r2.map(y=>[ex,y]),cX.map(x=>[x,186]));
  const F2=c.f2map.map((ci,i)=>{const C=c2[ci];const pp=ovPos(4+i);const G=H.g(s);mv(G,pp[0][0],pp[0][1],C.eg,'mom',1,C.x-17,C.y-9);mv(G,pp[1][0],pp[1][1],C.sp,'dad',1,C.x+17,C.y-9);return G});
  const res=H.g(s);H.O(res,0,{d:0});c.res.forEach((t,i)=>H.txt(res,495,334+i*21,t,'lb',{'text-anchor':'middle',st:'font-size:13.5px'}));
  const show=a=>a.forEach((e,i)=>go(e,{at:i*180}));
  return [
    ()=>{P.forEach((G,i)=>H.O(G,1,{at:300+i*300}))},
    ()=>{H.O(h1,1);H.D(g1,1,{d:800});H.O(l1,1);go(e1,{at:300});s1.forEach((e,i)=>go(e,{at:600+i*250}))},
    ()=>{c1.forEach((C,i)=>{go(C.a,{at:i*300});go(C.b,{at:150+i*300});H.O(C.L,1,{at:1100})});F1.forEach((G,i)=>{go(G.a,{at:1500+i*300});go(G.b,{at:1650+i*300})})},
    ()=>{H.O(h2,1);H.D(g2,1,{d:800});H.O(l2,1);e2.forEach((e,i)=>go(e,{at:300+i*250}));s2.forEach((e,i)=>go(e,{at:800+i*250}))},
    ()=>{c2.forEach((C,i)=>{go(C.a,{at:i*220});go(C.b,{at:110+i*220});H.O(C.L,1,{at:1200})});F2.forEach((G,i)=>[...G.children].forEach(e=>go(e,{at:1600+i*200})));H.O(res,1,{at:2200})},
  ];}

deck({
docTitle:'Sex Linkage · Heredity Ch.10',
title:'Sex Chromosomes and Sex Linkage',
chapter:10,
eyebrow:'Heredity · Chapter 10 · Sex Chromosomes and Sex Linkage',
slides:[

/* 1 ─────────────────────────────── */
{title:'Sex Chromosomes and Sex Linkage',caption:'Blue = from the father · orange = from the mother · bars are schematic',
text:`<p data-step="0">A human body cell has 46 chromosomes in 23 pairs. In 22 of the pairs, the two chromosomes match, in males and in females.</p>
<p data-step="1">The 23rd pair differs between the sexes. A female has two X chromosomes (XX). A male has one X and one Y (XY).</p>
<p data-step="2">A father gives his X to each daughter and his Y to each son. A mother gives one of her two X chromosomes to each child.</p>
<p data-step="3">So a gene on the X or on the Y passes to sons and to daughters in different ways. Inheritance that follows the sex chromosomes is <b>sex linkage</b>.</p>`,
star:'22 pairs ignore sex. The X and the Y differ between the sexes.',starStep:3,
scene(H){const s=$s();
  const A=H.g(s);H.txt(A,300,30,'22 PAIRS · THE SAME IN BOTH SEXES','cap',{'text-anchor':'middle'});
  const prs=[];for(let i=0;i<22;i++){const x=34+i*25.4,L=66-i*2;const G=H.g(A);
    [-4,4].forEach((dx,j)=>H.E('rect',{x:x+dx-3,y:96-L/2,width:6,height:L,rx:3,st:`fill:${H.C(j?'mom':'dad')}`},G));
    H.txt(G,x,142,String(i+1),'lbs',{'text-anchor':'middle',st:'font-size:9.5px'});org(G,x,96);hide(G);prs.push(G)}
  const q=H.g(s);H.E('rect',{x:590,y:58,width:40,height:76,rx:8,st:'fill:none;stroke:var(--ink);stroke-width:1.6;stroke-dasharray:5 4'},q);
  const qm=H.txt(q,610,104,'?','big',{'text-anchor':'middle'});H.txt(q,610,152,'23','lbs',{'text-anchor':'middle',st:'font-size:9.5px'});H.O(q,0,{d:0});
  const P=H.g(s);H.O(P,0,{d:0});
  H.txt(P,170,186,'MOTHER · XX','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});H.txt(P,450,186,'FATHER · XY','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  const mX1=cb(P,155,232,'X',{col:'mom'}),mX2=cb(P,185,232,'X',{col:'mom'}),fX=cb(P,435,232,'X',{col:'dad'}),fY=cb(P,465,246,'Y',{col:'dad'});
  const mini=H.g(s);H.O(mini,0,{d:0});H.txt(mini,610,80,'XX','lb',{'text-anchor':'middle'});H.txt(mini,610,98,'or','lbs',{'text-anchor':'middle'});H.txt(mini,610,118,'XY','lb',{'text-anchor':'middle'});
  const K=H.g(s);H.O(K,0,{d:0});
  H.E('path',{d:'M310,232 V292 M230,292 H390 M230,292 V312 M390,292 V312',st:'fill:none;stroke:var(--ink);stroke-width:2'},K);
  H.E('line',{x1:205,y1:232,x2:415,y2:232,st:'stroke:var(--ink);stroke-width:2'},K);
  H.txt(K,230,410,'daughter · XX','lb',{'text-anchor':'middle'});H.txt(K,390,410,'son · XY','lb',{'text-anchor':'middle'});
  const dX=from(cb(s,215,360,'X',{col:'dad'}),435-215,232-360),dM=from(cb(s,245,360,'X',{col:'mom'}),185-245,0),
        sY=from(cb(s,375,374,'Y',{col:'dad'}),465-375,246-374),sM=from(cb(s,405,360,'X',{col:'mom'}),155-405,0);
  [dM,sM].forEach(e=>H.T(e,{y:232-360},{d:0}));
  const hl=H.g(s);H.O(hl,0,{d:0});
  [[435,232,20,36],[215,360,20,36],[465,246,20,22],[375,374,20,22]].forEach(([x,y,rx,ry])=>H.E('ellipse',{cx:x,cy:y,rx,ry,st:'fill:none;stroke:var(--hi);stroke-width:3.5'},hl));
  H.txt(hl,468,334,'father’s X → daughters only','lbs',{st:'font-weight:700'});H.txt(hl,468,354,'father’s Y → sons only','lbs',{st:'font-weight:700'});
  return [
    ()=>{prs.forEach((G,i)=>pop(G,{at:i*45}));H.O(q,1,{at:1100})},
    ()=>{H.O(qm,0);H.O(mini,1,{at:200});H.O(P,1,{d:700,at:300})},
    ()=>{H.O(K,1);go(dX,{at:300});go(sY,{at:700});go(dM,{at:1100});go(sM,{at:1500})},
    ()=>{H.O(hl,1)},
  ];}},

/* 2 ─────────────────────────────── */
{title:'Autosomes and Sex Chromosomes',caption:'Karyotype: NHGRI, public domain, via Wikimedia Commons · bars are schematic',
text:`<p data-step="0">A <b>karyotype</b> is a picture of all the chromosomes of one cell, sorted into pairs by size. The karyotype here belongs to a human male. Its 46 chromosomes form 23 pairs.</p>
<p data-step="1">A <b>diploid</b> cell has two sets of chromosomes, one set from each parent. The two chromosomes of a pair have the same length. They also have the same band pattern (the stripes that a stain shows). Their centromeres (the narrow waists) are in the same position. They are <b>homologous chromosomes</b>.</p>
<p data-step="2"><b>Autosomes</b> are the chromosomes that males and females have in the same number. Humans have 22 pairs of autosomes, numbered 1 to 22.</p>
<p data-step="3"><b>Sex chromosomes</b> are the chromosomes that differ between the sexes. A human female has two X chromosomes. A human male has one X and one Y.</p>
<p data-step="4">The X is much larger than the Y, and the two carry mostly different genes. A pair of chromosomes that differ in size and shape is <b>heteromorphic</b>.</p>`,
star:'Same number in both sexes: autosome. Differs between the sexes: sex chromosome.',starStep:3,
scene(H){const s=$s();const k=.47,oy=22;
  H.E('image',{href:'@@asset:human-male-karyotype.jpg@@',x:0,y:oy,width:470,height:368},s);
  const ring=(cx,cy,rx,ry,c)=>{const e=H.E('ellipse',{cx:cx*k,cy:oy+cy*k,rx,ry,pathLength:1,cls:'draw',st:`fill:none;stroke:${H.C(c||'hi')};stroke-width:3.5`},s);return e};
  const lead=(x1,y1,x2,y2)=>{const e=H.E('path',{d:`M${x1},${y1} L${x2},${y2}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:1.3'},s);return e};
  const n46=H.g(s);pill(n46,235,406,'46 chromosomes · 23 pairs',{w:200});H.O(n46,0,{d:0});
  const r1=ring(80,105,30,44),l1=H.E('path',{d:'M38,26 V10 H482 V24',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:1.3'},s);
  const t1=H.g(s);H.txt(t1,486,40,'HOMOLOGOUS PAIR','cap',{st:'fill:var(--ink)'});['same length','same centromere','same bands','one from each parent'].forEach((t,i)=>H.txt(t1,486,60+i*17,t,'lbs'));H.O(t1,0,{d:0});
  const au=H.g(s);H.E('path',{d:`M8,${oy+6} H466 V${oy+262} H${395} V${oy+366} H8 Z`,st:'fill:var(--dad-tint);fill-opacity:.28;stroke:var(--dad);stroke-width:2;stroke-dasharray:6 4'},au);
  H.txt(au,486,170,'AUTOSOMES','cap',{st:'fill:var(--dad)'});H.txt(au,486,189,'pairs 1 to 22','lbs');H.txt(au,486,206,'same in both sexes','lbs');H.O(au,0,{d:0});
  s.insertBefore(au,s.children[1]);
  const r3=ring(918,682,32,34,'mom');const l3=lead(462,326,482,300);
  const t3=H.g(s);H.txt(t3,486,262,'SEX CHROMOSOMES','cap',{st:'fill:var(--mom)'});H.txt(t3,486,281,'X and Y','lbs');H.txt(t3,486,298,'differ between sexes','lbs');H.O(t3,0,{d:0});
  const Z=H.g(s);H.O(Z,0,{d:0});const bx=cb(Z,536,350,'X',{len:84,w:18,fs:14}),by=cb(Z,582,374,'Y',{len:36,w:18,fs:14});
  H.txt(Z,559,410,'heteromorphic pair','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  return [
    ()=>{H.O(n46,1,{at:300})},
    ()=>{H.D(r1,1,{d:800});H.D(l1,1,{d:600,at:600});H.O(t1,1,{at:900})},
    ()=>{H.O(au,1,{d:800})},
    ()=>{H.D(r3,1,{d:800});H.D(l3,1,{d:500,at:600});H.O(t3,1,{at:800})},
    ()=>{H.O(Z,1,{d:600});org(bx,536,350);org(by,582,374);H.T(bx,{s:.3},{d:0});H.T(by,{s:.3},{d:0});H.T(bx,{s:1},{d:900});H.T(by,{s:1},{d:900})},
  ];}},

/* 3 ─────────────────────────────── */
{title:'X, Y, Z and W: Names for Unknowns',caption:'Nettie Stevens, about 1904: Carnegie Institution, public domain, Wikimedia Commons',
text:`<p data-step="0">In 1891 the German biologist Hermann Henking studied sperm formation in the firebug, an insect. One chromosome went into only half of the sperm cells. He did not know its job, so he named it X, the letter for an unknown.</p>
<p data-step="1">In 1905 the American biologist Nettie Stevens studied the mealworm beetle. Female cells had 20 large chromosomes. Male cells had 19 large chromosomes and 1 small chromosome. Biologists now call the small chromosome the Y.</p>
<p data-step="2">Half of the male’s sperm cells carried the small chromosome. Stevens concluded that these sperm cells make males, and the other sperm cells make females.</p>
<p data-step="3">Biologists later named other sex chromosomes Z and W. The letters are labels, not shapes. A Y chromosome does not resemble the letter Y. Chromosome 4 does not resemble a 4 either.</p>`,
star:'X = the unknown chromosome. The letters are names, not shapes.',starStep:3,
scene(H){const s=$s();
  const ph=H.g(s);H.E('image',{href:'@@asset:c10-nettie-stevens.jpg@@',x:8,y:14,width:190,height:242},ph);H.txt(ph,103,274,'Nettie Stevens','lb',{'text-anchor':'middle'});H.O(ph,0,{d:0});
  // Henking: two sperm
  const He=H.g(s);H.txt(He,420,30,'1891 · FIREBUG SPERM','cap',{'text-anchor':'middle'});
  const s1=sperm(He,340,74,{rx:30,ry:21}),s2=sperm(He,520,74,{rx:30,ry:21});
  [[332,'dad'],[341,'dad'],[350,'dad'],[512,'dad'],[521,'dad'],[530,'dad']].forEach(([x])=>H.E('line',{x1:x-6,y1:66,x2:x-6,y2:82,st:'stroke:var(--muted);stroke-width:4;stroke-linecap:round'},He));
  const xel=H.E('rect',{x:348,y:62,width:9,height:24,rx:4,st:'fill:var(--ink)'},He);
  const xl=H.txt(He,380,118,'X = ?','lb',{'text-anchor':'middle',st:'font-size:16px'});H.txt(He,520,118,'no X','lbs',{'text-anchor':'middle'});
  H.O(He,0,{d:0});
  // Stevens: beetle chromosome sets
  const St=H.g(s);H.txt(St,425,160,'1905 · MEALWORM BEETLE','cap',{'text-anchor':'middle'});H.O(St,0,{d:0});
  const row=(y,lab,small)=>{const G=H.g(St);H.txt(G,236,y+5,lab,'lb');for(let i=0;i<10;i++)[-5,5].forEach((dx,j)=>{const x=310+i*30+dx;const last=i===9,sm=small&&last&&j===1;
      H.E('rect',{x:x-3.5,y:y-(sm?6:15),width:7,height:sm?12:30,rx:3.5,st:`fill:${last?H.C(j?'dad':'mom'):'var(--muted)'}`},G)});return G};
  const fr=row(202,'female',false),mr=row(258,'male',true);
  const smL=H.txt(St,598,292,'small','lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--dad)'});
  // sperm types
  const Sp=H.g(s);H.O(Sp,0,{d:0});H.txt(Sp,425,318,'TWO KINDS OF SPERM CELL','cap',{'text-anchor':'middle'});
  sperm(Sp,320,360,{rx:34,ry:22});sperm(Sp,520,360,{rx:34,ry:22});
  for(let i=0;i<5;i++){const L=i===4;H.E('rect',{x:299+i*9,y:348,width:5,height:22,rx:2.5,st:`fill:${L?'var(--mom)':'var(--muted)'}`},Sp);H.E('rect',{x:499+i*9,y:L?354:348,width:5,height:L?10:22,rx:2.5,st:`fill:${L?'var(--dad)':'var(--muted)'}`},Sp)}
  H.txt(Sp,320,402,'large one → female','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.txt(Sp,520,402,'small one → male','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  // shape
  const Sh=H.g(s);H.O(Sh,0,{d:0});
  const rc=H.chromosome(Sh,{L1:22,L2:30,w:7,color:'mom',state:'x',x:60,y:350});const ry=H.chromosome(Sh,{L1:9,L2:16,w:7,color:'dad',state:'x',x:150,y:356});
  H.txt(Sh,60,396,'an X','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.txt(Sh,150,396,'a Y','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  H.txt(Sh,103,314,'replicated, both look alike','lbs',{'text-anchor':'middle'});
  return [
    ()=>{H.O(He,1,{d:600})},
    ()=>{H.O(ph,1,{d:700});H.O(St,1,{d:600,at:300})},
    ()=>{H.O(Sp,1,{d:700})},
    ()=>{H.O(Sh,1,{d:700})},
  ];}},

/* 4 ─────────────────────────────── */
{title:'Two Systems: XX/XY and ZZ/ZW',caption:'Turkey (bronze): Steve Voght, CC BY-SA 2.0, via Flickr · tree shows relationships only',
text:`<p data-step="0">Sex chromosomes arose several separate times during evolution. So different groups of organisms use different systems.</p>
<p data-step="1"><b>XX/XY system.</b> Females are XX and males are XY. Mammals, fruit flies and some <b>dioecious</b> plants use this system. A dioecious plant species has separate male plants and female plants, for example the white campion.</p>
<p data-step="2"><b>ZZ/ZW system.</b> Males are ZZ and females are ZW. Birds, moths and butterflies use this system. In the turkey, a gene on the Z sets the feather colour, bronze or brown.</p>
<p data-step="3">A <b>gamete</b> is an egg cell or a sperm cell. The sex with two sex chromosomes of the same kind (XX or ZZ) is <b>homogametic</b>. All its gametes carry the same sex chromosome. The sex with two different sex chromosomes (XY or ZW) is <b>heterogametic</b>.</p>`,
star:'XY: the male is the odd one. ZW: the female is the odd one.',starStep:3,
scene(H){const s=$s();
  const lv=[['mammals','XY',70],['birds','ZW',130],['fruit flies','XY',190],['moths, butterflies','ZW',250],['white campion','XY',320]];
  const T=H.g(s);
  const br=H.E('path',{d:'M8,247 H20 M20,175 V320 M20,175 H50 M20,320 H120 M50,115 V235 M50,115 H80 M50,235 H80 M80,100 V130 M80,100 H120 M80,130 H120 M80,220 V250 M80,220 H120 M80,250 H120',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:2'},T);
  const ys=[100,130,220,250,320];
  const leaf=lv.map(([n,sys],i)=>{const G=H.g(T);const y=ys[i];H.txt(G,128,y+5,n,'lb',{st:'font-size:13px'});
    const c=sys==='XY'?'dad':'mom';const st=H.txt(G,276,y+5,sys,'lb',{'text-anchor':'end',st:'font-size:14px'});H.O(G,0,{d:0});G.sys=sys;return G});
  // separate origins: stars on branch tips
  const stars=ys.map(y=>{const e=H.txt(T,108,y+4,'✱','lbs',{'text-anchor':'middle',st:'font-size:12px;fill:var(--mom)'});H.O(e,0,{d:0});return e});
  const sl=H.txt(T,150,370,'✱ = sex chromosomes arose','lbs',{'text-anchor':'middle'});const sl2=H.txt(T,150,386,'separately in each group','lbs',{'text-anchor':'middle'});H.O([sl,sl2],0,{d:0});
  // XY panel
  const XY=H.g(s);H.O(XY,0,{d:0});H.E('rect',{x:310,y:14,width:322,height:150,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.4'},XY);
  H.txt(XY,326,40,'XX/XY','big',{st:'font-size:20px'});
  H.txt(XY,420,64,'female','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.txt(XY,560,64,'male','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  const xf=[cb(XY,405,104,'X'),cb(XY,435,104,'X')],xm=[cb(XY,545,104,'X'),cb(XY,575,118,'Y')];
  // ZW panel
  const ZW=H.g(s);H.O(ZW,0,{d:0});H.E('rect',{x:310,y:178,width:322,height:234,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.4'},ZW);
  H.E('image',{href:'@@asset:c10-turkey.jpg@@',x:322,y:226,width:186,height:124},ZW);
  H.txt(ZW,326,206,'ZZ/ZW','big',{st:'font-size:20px'});H.txt(ZW,415,370,'turkey: Z gene for','lbs',{'text-anchor':'middle'});H.txt(ZW,415,386,'bronze or brown feathers','lbs',{'text-anchor':'middle'});
  sexT(ZW,530,256,'m');sexT(ZW,530,356,'f');
  const zm=[cb(ZW,568,250,'Z'),cb(ZW,598,250,'Z')],zf=[cb(ZW,568,350,'Z'),cb(ZW,598,364,'W')];
  const ring=(x,y,w,h,c)=>H.E('rect',{x,y,width:w,height:h,rx:14,pathLength:1,cls:'draw',st:`fill:none;stroke:${H.C(c)};stroke-width:3`},s);
  const hets=[ring(523,70,74,68,'bad'),ring(546,316,74,70,'bad')],homs=[ring(383,70,74,68,'good'),ring(546,216,74,68,'good')];
  const lab=H.g(s);H.O(lab,0,{d:0});H.txt(lab,420,154,'homogametic','lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--good)'});H.txt(lab,560,154,'heterogametic','lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--bad)'});
  H.txt(lab,583,298,'homogametic','lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--good)'});H.txt(lab,583,401,'heterogametic','lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--bad)'});
  return [
    ()=>{H.D(br,1,{d:1200});leaf.forEach((G,i)=>H.O(G,1,{at:600+i*120}));stars.forEach((e,i)=>H.O(e,1,{at:1300+i*150}));H.O([sl,sl2],1,{at:1600})},
    ()=>{H.O(XY,1,{d:700});leaf.forEach(G=>H.O(G,G.sys==='XY'?1:.3))},
    ()=>{H.O(ZW,1,{d:700});leaf.forEach(G=>H.O(G,G.sys==='ZW'?1:.3))},
    ()=>{leaf.forEach(G=>H.O(G,1));H.D(homs,1,{d:800});H.D(hets,1,{d:800,at:400});H.O(lab,1,{at:700})},
  ];}},

/* 5 ─────────────────────────────── */
{title:'Sex Chromosomes in Meiosis',caption:'Blue = from the father · orange = from the mother · autosomes not shown',
text:`<p data-step="0"><b>Meiosis</b> is the cell division that makes gametes. Meiosis has two divisions, <b>meiosis I</b> and <b>meiosis II</b>. In meiosis I, homologous chromosomes pair and then separate. In an XX female, the two X chromosomes pair and separate like autosomes, so each egg cell gets one X.</p>
<p data-step="1">In an XY male, the X and the Y pair with each other, although they differ in size. They pair at short regions at their tips, where the two carry the same DNA.</p>
<p data-step="2"><b>Anaphase I</b> is the stage when the paired chromosomes separate. The X moves to one <b>pole</b> (end) of the cell, and the Y moves to the other pole.</p>
<p data-step="3">Before meiosis, the cell <b>replicates</b> (copies) each chromosome, so each chromosome has two identical <b>sister chromatids</b>. Meiosis II separates the sister chromatids. Two sperm cells get an X, and two sperm cells get a Y. So half of the sperm cells carry an X, and half carry a Y.</p>`,
star:'Eggs: all X. Sperm: half X, half Y.',starStep:3,
scene(H){const s=$s();
  const F=H.g(s);H.txt(F,95,30,'FEMALE · XX','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  H.E('circle',{cx:95,cy:110,r:50,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},F);
  H.chromosome(F,{L1:10,L2:20,w:5,color:'mom',state:'x',x:83,y:110});H.chromosome(F,{L1:10,L2:20,w:5,color:'dad',state:'x',x:107,y:110});
  const fa=[mkA(F,95,168,95,206,{w:1.6,h:6})];
  const eg=[[95,'mom']].map(([x,c])=>{const G=H.g(F);H.E('circle',{cx:x,cy:256,r:40,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.2'},G);
    H.chromosome(G,{L1:10,L2:20,w:5,color:c,state:'single',x,y:256});org(G,x,256);hide(G);return G});
  const fl=H.g(F);H.txt(fl,95,318,'one egg cell, one X','lb',{'text-anchor':'middle'});H.txt(fl,95,336,'(either of her two X)','lbs',{'text-anchor':'middle'});H.O(fl,0,{d:0});
  H.E('line',{x1:200,y1:20,x2:200,y2:400,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  const M=H.g(s);H.txt(M,420,30,'MALE · XY','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});H.O(M,0,{d:0});
  const Cl=H.cell(M,{x:420,y:140,r:86});
  const X=H.chromosome(M,{L1:18,L2:38,w:8,color:'mom',state:'x',x:376,y:140});
  const Y=H.chromosome(M,{L1:7,L2:16,w:8,color:'dad',state:'x',x:466,y:150});
  const tips=H.g(M);H.O(tips,0,{d:0});H.E('ellipse',{cx:418,cy:124,rx:34,ry:10,st:'fill:none;stroke:var(--hi);stroke-width:3'},tips);
  const tl=H.txt(M,500,92,'pair at the tips','lbs',{st:'font-weight:700'});H.O(tl,0,{d:0});
  const pl=H.g(M);H.O(pl,0,{d:0});H.txt(pl,346,250,'X to one pole','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.txt(pl,494,250,'Y to the other','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  const sx=[262,352,488,578],sc=['mom','mom','dad','dad'];
  const sp=sx.map((x,i)=>{const G=H.g(M);sperm(G,x+14,330,{rx:24,ry:17});
    H.chromosome(G,{L1:i<2?15:6,L2:i<2?32:14,w:6,color:sc[i],state:'single',x:x+14,y:330,s:i<2?.62:1});
    H.txt(G,x+14,374,i<2?'X':'Y','lb',{'text-anchor':'middle'});from(G,(i<2?372:468)-x,140-330);return G});
  const res=H.txt(M,420,404,'2 X sperm : 2 Y sperm = 1 : 1','lb',{'text-anchor':'middle'});H.O(res,0,{d:0});
  return [
    ()=>{fa.forEach((a,i)=>drawA(a,{at:300}));eg.forEach((G,i)=>pop(G,{at:700+i*200}));H.O(fl,1,{at:1200})},
    ()=>{H.O(M,1,{d:600});H.T(X,{x:400,y:141},{d:1300,at:500});H.T(Y,{x:436,y:130},{d:1300,at:500});H.O(tips,1,{at:1700});H.O(tl,1,{at:1700})},
    ()=>{H.O([tips,tl],0,{d:300});H.cleave(Cl,52,.72,{d:1400});H.T(X,{x:362,y:141},{d:1400});H.T(Y,{x:478,y:132},{d:1400});H.O(pl,1,{at:900})},
    ()=>{H.O(pl,0,{d:300});[...Cl.parts.flat()].forEach(e=>H.O(e,.25,{d:600}));H.O([X,Y],.25,{d:600});sp.forEach((G,i)=>go(G,{at:300+i*200,d:1100}));H.O(res,1,{at:1500})},
  ];}},

/* 6 ─────────────────────────────── */
{title:'The Sperm Cell Decides the Sex',caption:'Blue = from the father · orange = from the mother · circle with cross = female · circle with arrow = male',
text:`<p data-step="0">Fertilization joins one egg cell and one sperm cell into a <b>zygote</b>, the first cell of a new organism. In mammals, every egg cell carries an X.</p>
<p data-step="1">A sperm cell with an X makes an XX zygote, which develops as a female. A sperm cell with a Y makes an XY zygote, which develops as a male.</p>
<p data-step="2">Half of the sperm cells carry each type. So about half of the children are daughters and half are sons. In mammals, the sperm cell decides the sex of the child.</p>
<p data-step="3">In birds, the roles of the sexes swap. Every sperm cell carries a Z. Half of the egg cells carry a Z and half carry a W, so the egg cell decides the sex.</p>`,
star:'Mammals: the sperm decides. Birds: the egg decides.',starStep:3,
scene(H){const s=$s();
  const pun=(p,cx0,cxs,rys,cw,rh)=>{const G=H.g(p);const x1=cxs[0]-cw/2,x2=cxs[cxs.length-1]+cw/2,y1=rys[0]-rh/2,y2=rys[rys.length-1]+rh/2;
    const d=`M${x1},${y1} H${x2} M${x1},${y2} H${x2} M${x1},${y1} V${y2} M${x2},${y1} V${y2} M${(cxs[0]+cxs[1])/2},${y1} V${y2} M${x1},${(rys[0]+rys[1])/2} H${x2}`;
    G.grid=H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:1.8'},G);return G};
  // mammals
  const Mm=H.g(s);H.txt(Mm,175,26,'MAMMALS · XX/XY','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  const mc=[160,260],mr=[150,240];const gm=pun(Mm,70,mc,mr,100,90);
  H.txt(Mm,210,54,'sperm','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.txt(Mm,62,106,'eggs','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  const eggs=mr.map(y=>{const t=tile(Mm,62,y,'X','',{edge:'mom'});org(t,62,y);hide(t);return t});
  const sps=[['X',160],['Y',260]].map(([l,x])=>{const t=tile(Mm,x,82,l,'',{edge:'dad'});org(t,x,82);hide(t);return t});
  const cells=[];mr.forEach((y,i)=>mc.forEach((x,j)=>{const a=from(tile(Mm,x-14,y-12,'X','',{edge:'mom'}),62-(x-14),0),b=from(tile(Mm,x+14,y-12,j?'Y':'X','',{edge:'dad'}),0,82-(y-12));
    const sy=sexT(Mm,x,y+26,j?'m':'f',{fs:20});H.O(sy,0,{d:0});cells.push({a,b,sy})}));
  const r1=H.txt(Mm,210,322,'XX : XY = 1 : 1','lb',{'text-anchor':'middle',st:'font-size:16px'});H.O(r1,0,{d:0});
  const ring1=H.E('rect',{x:120,y:66,width:180,height:32,rx:12,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5'},Mm);
  const d1=H.txt(Mm,210,350,'the sperm decides','lb',{'text-anchor':'middle',st:'fill:var(--ink)'});H.O(d1,0,{d:0});
  H.E('line',{x1:350,y1:20,x2:350,y2:400,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  // birds
  const B=H.g(s);H.O(B,0,{d:0});H.txt(B,495,26,'BIRDS · ZZ/ZW','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  const bc=[480,570],br=[150,240];pun(B,395,bc,br,90,90).grid.style.strokeDashoffset=0;
  H.txt(B,525,54,'sperm','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.txt(B,392,106,'eggs','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  [480,570].forEach(x=>tile(B,x,82,'Z','',{edge:'dad'}));tile(B,392,150,'Z','',{edge:'mom'});tile(B,392,240,'W','',{edge:'mom'});
  br.forEach((y,i)=>bc.forEach(x=>{tile(B,x-14,y-12,i?'W':'Z','',{edge:'mom'});tile(B,x+14,y-12,'Z','',{edge:'dad'});sexT(B,x,y+26,i?'f':'m',{fs:20})}));
  H.txt(B,525,322,'ZZ : ZW = 1 : 1','lb',{'text-anchor':'middle',st:'font-size:16px'});
  H.E('rect',{x:368,y:124,width:48,height:142,rx:12,st:'fill:none;stroke:var(--hi);stroke-width:3.5'},B);
  H.txt(B,525,350,'the egg decides','lb',{'text-anchor':'middle'});
  return [
    ()=>{H.D(gm.grid,1,{d:900});eggs.forEach((t,i)=>pop(t,{at:500+i*150}))},
    ()=>{sps.forEach((t,i)=>pop(t,{at:i*150}));cells.forEach((c,i)=>{go(c.a,{at:500+i*120});go(c.b,{at:700+i*120});H.O(c.sy,1,{at:1500+i*100})})},
    ()=>{H.O(r1,1);H.D(ring1,1,{d:800,at:300});H.O(d1,1,{at:800})},
    ()=>{H.O(B,1,{d:800})},
  ];}},

/* 7 ─────────────────────────────── */
{title:'One Gene Starts a Testis: SRY',caption:'Schematic · SRY = sex-determining region of the Y · TDF = testis-determining factor',
text:`<p data-step="0">Until about six weeks after fertilization, a human embryo has the same gonads in both sexes. A <b>gonad</b> is the organ that later makes gametes. At this stage, each gonad can still develop as a testis or as an ovary.</p>
<p data-step="1">The Y carries the gene <i>SRY</i> (sex-determining region of the Y). In an XY embryo, gonad cells activate <i>SRY</i> about six weeks after fertilization. Its protein is the <b>testis-determining factor (TDF)</b>.</p>
<p data-step="2">TDF is a <b>transcription factor</b>: a protein that activates other genes. TDF activates <i>SOX9</i>, a gene on chromosome 17. SOX9 protein makes the gonad develop as a testis. The testis then makes hormones, and the hormones make the body develop as male.</p>
<p data-step="3">An XX embryo has no <i>SRY</i>. Other genes then direct the gonads to develop as ovaries, and the body develops as female.</p>
<p data-step="4">Other genes on the Y act later. Some of them are necessary for sperm production in the testis.</p>`,
star:'SRY active: testis. No SRY: ovary.',starStep:4,
scene(H){const s=$s();const yA=128,yB=310;
  const lane=(y,t)=>{const G=H.g(s);H.txt(G,20,y-78,t,'cap',{st:'fill:var(--ink)'});return G};
  const A=lane(yA,'XY EMBRYO'),B=lane(yB,'XX EMBRYO');
  cb(A,52,yA,'X',{len:86,w:22,fs:15});{const yy=cb(A,96,yA-16,'Y',{len:54,w:22,fs:15});yy.t.setAttribute('y',yA+2);}
  const sry=H.E('rect',{x:84,y:yA-38,width:24,height:8,rx:2,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.2'},A);
  const sl=H.txt(A,128,yA-30,'SRY','lb',{st:'fill:var(--good)'});
  cb(B,52,yB,'X',{len:86,w:22,fs:15});cb(B,96,yB,'X',{len:86,w:22,fs:15});
  const gon=(p,x,y)=>{const G=H.g(p);G.o=H.E('ellipse',{cx:x,cy:y,rx:58,ry:38,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.6'},G);
    G.l=H.txt(p,x,y+62,'gonad','lb',{'text-anchor':'middle',st:'font-size:15px'});G.x=x;G.y=y;return G};
  const gA=gon(A,300,yA),gB=gon(B,300,yB);
  const q=[H.txt(A,300,yA+9,'?','big',{'text-anchor':'middle',st:'font-size:26px;fill:var(--muted)'}),H.txt(B,300,yB+9,'?','big',{'text-anchor':'middle',st:'font-size:26px;fill:var(--muted)'})];
  const tub=H.E('path',{d:`M262,${yA-8} q9.5,-16 19,0 t19,0 t19,0 t19,0 M262,${yA+12} q9.5,-16 19,0 t19,0 t19,0 t19,0`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:2.4'},A);
  const fol=H.g(B);[[274,yB-6,9],[298,yB-16,6],[320,yB+4,10],[294,yB+16,5],[330,yB-18,5],[268,yB+18,4]].forEach(([x,y,r])=>H.E('circle',{cx:x,cy:y,r,st:'fill:var(--card);stroke:var(--ink);stroke-width:2'},fol));H.O(fol,0,{d:0});
  const prot=H.g(A);H.E('path',{d:'M0,-11 C16,-13 18,11 2,12 C-12,13 -14,-10 0,-11 Z',st:'fill:var(--good);stroke:var(--ink);stroke-width:1.6'},prot);
  H.txt(prot,0,-17,'TDF','lbs',{'text-anchor':'middle',st:'font-weight:800;fill:var(--good)'});H.T(prot,{x:96,y:yA-34,s:.3},{d:0});H.O(prot,0,{d:0});
  const pa=mkA(A,124,yA-12,232,yA-2,{w:1.8,h:8});
  const sox=H.g(A);pill(sox,300,yA-58,'SOX9 activated',{fill:'hi',ink:'#16181d',w:136});H.O(sox,0,{d:0});
  const ha=mkA(A,366,yA,432,yA,{w:2,h:8}),hb=mkA(B,366,yB,432,yB,{w:2,h:8});
  const mA=H.g(A);H.txt(mA,442,yA-6,'testis hormones','lbs',{st:'font-weight:700'});H.txt(mA,442,yA+16,'male body','lb',{st:'font-size:16px'});H.O(mA,0,{d:0});
  const mB=H.g(B);H.txt(mB,442,yB-6,'other genes','lbs',{st:'font-weight:700'});H.txt(mB,442,yB+16,'female body','lb',{st:'font-size:16px'});H.O(mB,0,{d:0});
  const noS=H.txt(B,124,yB-30,'no SRY','lb',{st:'fill:var(--bad)'});H.O(noS,0,{d:0});
  const ring=H.E('ellipse',{cx:96,cy:yA-34,rx:26,ry:13,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5'},s);
  const one=H.txt(s,320,410,'one gene decides the gonad','lb',{'text-anchor':'middle',st:'font-size:16px'});H.O(one,0,{d:0});
  H.O([sry,sl],0,{d:0});
  return [
    ()=>{H.O(q,1)},
    ()=>{H.O([sry,sl],1);H.O(prot,1,{d:300,at:300});H.T(prot,{s:1},{d:700,at:300})},
    ()=>{H.O(prot,1,{d:0});H.T(prot,{s:1},{d:0});drawA(pa);H.T(prot,{x:300,y:yA},{d:1300});H.after(1300,()=>{H.O(q[0],0,{d:300});H.O(sox,1);H.D(tub,1,{d:900});gA.l.textContent='testis';H.K(gA.o,{stroke:'good'})});
      drawA(ha,{at:1900});H.O(mA,1,{at:2300});H.O(prot,0,{d:400,at:1600})},
    ()=>{H.O(noS,1);H.O(q[1],0,{d:300,at:400});H.O(fol,1,{at:600});H.after(600,()=>{gB.l.textContent='ovary'});drawA(hb,{at:900});H.O(mB,1,{at:1300})},
    ()=>{H.D(ring,1,{d:800});H.O(one,1,{at:500})},
  ];}},

/* 8 ─────────────────────────────── */
{title:'Humans Look for a Y; Flies Count X',caption:'45,X = 45 chromosomes with one X and no Y · XO = one X and no Y',
text:`<p data-step="0">Humans and fruit flies both have XX females and XY males. A few people and a few flies have other combinations. The rare combinations show that the two species use different rules.</p>
<p data-step="1"><b>Humans.</b> A person with one X and no Y (45,X) is female, with <b>Turner syndrome</b>. A person with XXY (47,XXY) is male, with <b>Klinefelter syndrome</b>. So in humans, the Y decides the sex, through <i>SRY</i>.</p>
<p data-step="2"><b>Fruit flies.</b> A fly with one X and no Y (XO) is male. A fly with XXY is female. The fly counts its X chromosomes, so the number of X chromosomes decides the sex.</p>
<p data-step="3">An XO male fly is <b>sterile</b>: he cannot produce offspring, because the fly Y carries genes that sperm cells need. So the fly Y affects <b>fertility</b> (the ability to produce offspring), not sex.</p>
<p data-step="4"><b>Birds.</b> Birds count Z chromosomes. The Z gene <i>DMRT1</i> works by dose: two copies (ZZ) make testes, and one copy (ZW) makes ovaries.</p>`,
star:'Humans: a Y makes a male. Flies: two X make a female. Birds: two Z make a male.',starStep:4,
scene(H){const s=$s();const cX=[80,300,500],rY=[88,146,204,262];
  const hd=H.g(s);H.txt(hd,cX[0],40,'CHROMOSOMES','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});H.txt(hd,cX[1],40,'HUMAN','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});H.txt(hd,cX[2],40,'FRUIT FLY','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  H.E('line',{x1:16,y1:56,x2:624,y2:56,st:'stroke:var(--ink);stroke-width:2'},hd);
  rY.forEach((y,i)=>{if(i)H.E('line',{x1:16,y1:y-29,x2:624,y2:y-29,st:'stroke:var(--faint);stroke-width:1'},hd)});
  const rows=[['X','X'],['X','Y'],['X',null],['X','X','Y']];
  const rg=rows.map((r,i)=>{const G=H.g(s);const y=rY[i];const n=r.length;r.forEach((l,j)=>{const x=cX[0]+(j-(n-1)/2)*30;
      if(l)tile(G,x,y,l,'');else{H.E('rect',{x:x-12,y:y-11,width:24,height:22,rx:5,st:'fill:none;stroke:var(--muted);stroke-width:1.4;stroke-dasharray:3 3'},G)}});
    if(i>1)H.O(G,0,{d:0});return G});
  const cell=(x,y,sex,note,c)=>{const G=H.g(s);sexT(G,x,y+6,sex,{fs:24});if(note)H.txt(G,x,y+24,note,'lbs',{'text-anchor':'middle',st:`font-weight:700;fill:${H.C(c||'muted')}`});H.O(G,0,{d:0});return G};
  const hu=[cell(cX[1],rY[0],'f'),cell(cX[1],rY[1],'m'),cell(cX[1],rY[2],'f','45,X · Turner syndrome'),cell(cX[1],rY[3],'m','47,XXY · Klinefelter syndrome')];
  const fl=[cell(cX[2],rY[0],'f'),cell(cX[2],rY[1],'m'),cell(cX[2],rY[2],'m'),cell(cX[2],rY[3],'f')];
  const ster=H.txt(s,cX[2],rY[2]+24,'male, but sterile','lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--bad)'});H.O(ster,0,{d:0});
  const rule=[pill(s,cX[1],rY[3]+56,'a Y (with SRY) makes a male',{stroke:'good',ink:'good',w:210}),pill(s,cX[2],rY[3]+56,'two X make a female',{stroke:'good',ink:'good',w:160})];H.O(rule,0,{d:0});
  const Bd=H.g(s);H.O(Bd,0,{d:0});H.E('rect',{x:16,y:358,width:608,height:56,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.4'},Bd);
  H.txt(Bd,30,385,'BIRDS','cap',{st:'fill:var(--ink)'});tile(Bd,112,388,'Z','');tile(Bd,140,388,'Z','');sexT(Bd,172,395,'m',{fs:22});
  tile(Bd,232,388,'Z','');tile(Bd,260,388,'W','');sexT(Bd,292,395,'f',{fs:22});
  H.txt(Bd,330,384,'DMRT1 on the Z works by dose:','lbs',{st:'font-weight:700'});H.txt(Bd,330,402,'2 copies → testes · 1 copy → ovaries','lbs');
  return [
    ()=>{[0,1].forEach(i=>{H.O(hu[i],1,{at:300+i*200});H.O(fl[i],1,{at:500+i*200})})},
    ()=>{H.O(rg[2],1);H.O(rg[3],1);H.O(hu[2],1,{at:400});H.O(hu[3],1,{at:700});H.O(rule[0],1,{at:1100})},
    ()=>{H.O(fl[2],1,{at:200});H.O(fl[3],1,{at:500});H.O(rule[1],1,{at:900})},
    ()=>{H.O(ster,1)},
    ()=>{H.O(Bd,1,{d:700})},
  ];}},

/* 9 ─────────────────────────────── */
{title:'An Unequal Pair',caption:'Schematic · yellow = shared tip regions · green on the Y = SRY',
text:`<p data-step="0">The human X has about 156 million <b>base pairs</b> (pairs of DNA letters). The X carries about 800 <b>protein-coding genes</b>, genes with the code for a protein. The Y has about 60 million base pairs and fewer than 100 protein-coding genes.</p>
<p data-step="1">About 180 million years ago, the X and the Y were an ordinary pair of autosomes with the same genes. Then one copy of the gene <i>SOX3</i> changed into <i>SRY</i>, the switch for male development.</p>
<p data-step="2"><b>Crossing over</b> is an exchange of pieces between paired chromosomes in meiosis. Over time, crossing over between the X and the Y stopped along most of their length. Without crossing over, damaged genes collected on the Y, and the Y lost most of its genes.</p>
<p data-step="3">The X kept most of its genes. So most X genes have no partner copy on the Y. A male has only one copy of these genes, so he is <b>hemizygous</b> for them.</p>`,
star:'X: about 800 genes. Y: fewer than 100. Most X genes have no partner on the Y.',starStep:3,
scene(H){const s=$s();const top=50,N=20,by=i=>60+i*15.4;
  const X=H.g(s);H.E('rect',{x:182,y:top,width:36,height:322,rx:18,st:'fill:var(--card);stroke:var(--ink);stroke-width:2.4'},X);
  const xb=[];for(let i=0;i<N;i++){const c=(i===0||i===N-1)?'hi':i===2?'hi':'muted';xb.push(H.E('rect',{x:184,y:by(i)-2.5,width:32,height:5,st:`fill:${H.C(i===2?'muted':c)}`},X))}
  H.txt(X,200,top-10,'X','big',{'text-anchor':'middle',st:'font-size:22px'});
  const Yg=H.g(s);const yr=H.E('rect',{x:282,y:top,width:36,height:322,rx:18,st:'fill:var(--card);stroke:var(--ink);stroke-width:2.4'},Yg);org(yr,300,top);
  const keep={0:60,2:82,5:104,8:124,12:144,19:163};
  const yb=[];for(let i=0;i<N;i++){const k=keep[i]!=null;const e=H.E('rect',{x:284,y:by(i)-2.5,width:32,height:5,st:`fill:${H.C((i===0||i===N-1)?'hi':i===2?'good':'muted')}`},Yg);
    e.k=k;e.fy=k?keep[i]-by(i):0;yb.push(e)}
  H.txt(Yg,300,top-10,'Y','big',{'text-anchor':'middle',st:'font-size:22px'});
  const setNow=o=>{H.T(yr,{sy:123/322},o);yb.forEach(e=>{if(e.k)H.T(e,{y:e.fy},o);else H.O(e,0,o)})};
  setNow({d:0});
  const sox=H.g(s);H.txt(sox,172,by(2)+4,'SOX3','lbs',{'text-anchor':'end',st:'font-weight:700'});H.txt(sox,326,by(2)+4,'SRY','lbs',{st:'font-weight:800;fill:var(--good)'});H.O(sox,0,{d:0});
  const R=H.g(s);
  const card=(y,t,a,b)=>{const G=H.g(R);H.txt(G,380,y,t,'big',{st:'font-size:20px'});const n1=H.txt(G,380,y+24,a,'lbs',{st:'font-weight:600;fill:var(--ink)'});const n2=H.txt(G,380,y+42,b,'lbs',{st:'font-weight:600;fill:var(--ink)'});return G};
  card(90,'X','about 156 million base pairs','about 800 protein-coding genes');card(190,'Y','about 60 million base pairs','fewer than 100 protein-coding genes');
  const era=H.txt(s,250,404,'','lb',{'text-anchor':'middle'});
  const lost=H.txt(s,380,300,'','lbs',{st:'font-weight:700;fill:var(--bad)'});
  const hemi=H.g(s);H.O(hemi,0,{d:0});
  H.txt(hemi,166,300,'orange: no Y partner','lbs',{'text-anchor':'end',st:'font-weight:700;fill:var(--mom)'});H.txt(hemi,166,317,'one copy in a male','lbs',{'text-anchor':'end',st:'font-weight:700;fill:var(--mom)'});
  return [
    ()=>{era.textContent='today'},
    ()=>{H.O(R,.25);era.textContent='about 180 million years ago';H.T(yr,{sy:1},{d:1400});yb.forEach(e=>{H.T(e,{y:0},{d:1400});H.O(e,1,{d:600,at:700})});H.O(sox,1,{at:1400})},
    ()=>{era.textContent='crossing over stops · genes are lost';yb.forEach((e,i)=>{if(!e.k)H.O(e,0,{d:400,at:(N-i)*90})});
      H.after(1900,()=>{setNow({d:1400});era.textContent='today'});H.O(R,1,{at:2600})},
    ()=>{H.O(hemi,1,{d:700});xb.forEach((e,i)=>{if(keep[i]==null)H.K(e,{fill:'mom'},{at:i*40})})},
  ];}},

/* 10 ─────────────────────────────── */
{title:'Pseudo-Autosomal Regions',caption:'Orange = X, from the mother · blue = Y, from the father · PARs drawn enlarged',
text:`<p data-step="0">The X and the Y still share two short regions at their tips. The two regions are the <b>pseudo-autosomal regions</b> (PARs). PAR1 is at the tips of the short arms, the parts above the centromere (the narrow waist). PAR2 is at the tips of the long arms.</p>
<p data-step="1">PAR1 is about 2.7 million base pairs long. In PAR1, the X and the Y carry the same genes, for example <i>SHOX</i>.</p>
<p data-step="2">In prophase I, the first stage of meiosis I in a male, the X and the Y pair at PAR1. Crossing over then swaps a piece of PAR1 between an X chromatid and a Y chromatid.</p>
<p data-step="3">A crossover in PAR1 happens in nearly every male meiosis. The crossover holds the X and the Y together until anaphase I, so the two separate correctly.</p>
<p data-step="4">The prefix <i>pseudo-</i> means false. The PARs are on the sex chromosomes, but every person has two copies of each PAR gene. So PAR genes follow autosomal rules.</p>`,
star:'PARs: the tips where the X and the Y still match, pair and swap.',starStep:4,
scene(H){const s=$s();
  const R=H.g(s,{transform:'translate(-70,-104) scale(1.3)'});
  const X=H.chromosome(R,{L1:50,L2:120,w:14,color:'mom',state:'x',x:210,y:215,tipsB:[{from:-35,color:'dad'}]});
  const Y=H.chromosome(R,{L1:20,L2:62,w:14,color:'dad',state:'x',x:450,y:205,tipsA:[{from:-5,color:'mom'}]});
  const par=(G,y0,y1)=>H.E('rect',{x:-33,y:y0,width:66,height:y1-y0,rx:9,st:'fill:var(--hi);fill-opacity:.35;stroke:var(--hi);stroke-width:2.5'},G);
  const pX=[par(X,-57,-31),par(X,100,127)],pY=[par(Y,-27,-1),par(Y,44,69)];pX.forEach(e=>X.insertBefore(e,X.firstChild));pY.forEach(e=>Y.insertBefore(e,Y.firstChild));H.O([...pX,...pY],0,{d:0});
  H.txt(X,0,-68,'X','big',{'text-anchor':'middle',st:'font-size:24px'});H.txt(Y,0,-38,'Y','big',{'text-anchor':'middle',st:'font-size:24px'});
  const lX=H.g(X);H.txt(lX,-42,-39,'PAR1','lb',{'text-anchor':'end'});H.txt(lX,-42,118,'PAR2','lb',{'text-anchor':'end'});H.O(lX,0,{d:0});
  const lY=H.g(Y);H.txt(lY,42,-9,'PAR1','lb');H.txt(lY,42,61,'PAR2','lb');H.O(lY,0,{d:0});
  const g1=H.g(s);H.txt(g1,330,40,'PAR1: about 2.7 million base pairs','lb');H.txt(g1,330,60,'same genes on X and Y, e.g. SHOX','lbs',{st:'font-weight:700'});
  H.E('path',{d:'M326,48 L262,96',st:'fill:none;stroke:var(--ink);stroke-width:1.3'},g1);H.O(g1,0,{d:0});
  const cx=H.g(R);H.E('path',{d:'M-7,-7 L7,7 M7,-7 L-7,7',st:'stroke:var(--ink);stroke-width:2.6;stroke-linecap:round'},cx);H.T(cx,{x:245,y:171},{d:0});H.O(cx,0,{d:0});
  const cxl=H.txt(s,330,70,'crossover in PAR1','lb');H.O(cxl,0,{d:0});
  const pl=H.g(s);H.O(pl,0,{d:0});H.txt(pl,320,404,'PAR genes: two copies in everyone · inherited like autosomal genes','lb',{'text-anchor':'middle'});
  return [
    ()=>{H.O([...pX,...pY],1,{d:700});H.O([lX,lY],1,{at:300})},
    ()=>{H.O(g1,1)},
    ()=>{H.O(g1,0,{d:300});H.O(lY,0,{d:300});H.T(Y,{x:264,y:185},{d:1500});H.after(1500,()=>{H.O(cx,1);H.O(cxl,1);H.O(X.b.tips[0],1,{d:600,at:300});H.O(Y.a.tips[0],1,{d:600,at:300})})},
    ()=>{H.O([cx,cxl],0,{d:300});H.T(X,{x:170},{d:1400});H.T(Y,{x:440,y:205},{d:1400});H.O(lY,1,{at:1200})},
    ()=>{H.O(pl,1)},
  ];}},

/* 11 ─────────────────────────────── */
{title:'PAR Genes Follow Autosomal Rules',caption:'Circle = daughter · square = son · orange = his X (from his mother) · blue = his Y',
text:`<p data-step="0">Follow one PAR1 gene in a father. Each chromosome carries one <b>allele</b> (version) of the gene. His X carries allele <b>a</b>, and his Y carries allele <b>A</b>.</p>
<p data-step="1">Some sperm cells get chromatids with no crossover between the gene and the PAR1 boundary. In these sperm cells, <b>A</b> stays on the Y. A son from such a sperm cell gets <b>A</b>, and a daughter gets <b>a</b>.</p>
<p data-step="2">A crossover between the gene and the boundary swaps the alleles on one X chromatid and one Y chromatid. A sperm cell with a swapped chromatid carries <b>A</b> on the X or <b>a</b> on the Y. A daughter from it gets <b>A</b>, and a son gets <b>a</b>.</p>
<p data-step="3">Take a gene near the tip of PAR1. Nearly every male meiosis has a crossover between this gene and the boundary. The crossover involves two of the four chromatids, so about half of the sperm cells carry a swapped X or Y. Sons and daughters then get <b>A</b> equally often, as for an autosomal gene.</p>
<p data-step="3">A gene near the boundary seldom has a crossover beside it, so it almost always stays with its sex chromosome.</p>`,
star:'Near the tip: an autosomal pattern. Near the boundary: a sex-linked pattern.',starStep:3,
scene(H){const s=$s();const B=170;
  const hbar=(p,x0,x1,y,col,o)=>{o=o||{};const G=H.g(p);G.r=H.E('rect',{x:x0,y:y-10,width:x1-x0,height:20,rx:10,st:`fill:var(--card);stroke:${H.C(col)};stroke-width:3`},G);return G};
  const allele=(p,x,y,l)=>{const G=H.g(p);H.E('rect',{x:x-11,y:y-10,width:22,height:20,rx:4,st:`fill:${l==='A'?'var(--good)':'var(--card)'};stroke:var(--ink);stroke-width:1.5`},G);
    H.txt(G,x,y+5,l,'',{'text-anchor':'middle',st:`font:800 14px var(--f-body);fill:${l==='A'?'var(--paper)':'var(--ink)'}`});return G};
  const F=H.g(s);H.txt(F,486,36,'FATHER','cap',{st:'fill:var(--ink)'});
  const shade=H.E('rect',{x:34,y:44,width:B-34,height:84,rx:8,st:'fill:var(--hi);fill-opacity:.3'},F);
  hbar(F,40,440,64,'mom');hbar(F,40,250,104,'dad');H.txt(F,452,69,'X','lb');H.txt(F,262,109,'Y','lb');
  H.E('line',{x1:B,y1:42,x2:B,y2:130,st:'stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4'},F);
  H.txt(F,104,36,'PAR1','lb',{'text-anchor':'middle'});H.txt(F,B+6,36,'boundary','lbs',{st:'font-weight:700'});
  const fa=allele(F,78,64,'a'),fA=allele(F,78,104,'A');
  const grad=H.g(s);H.O(grad,0,{d:0});const df=H.E('defs',{},grad);const lg=H.E('linearGradient',{id:'c10g'},df);
  H.E('stop',{offset:'0','stop-color':'var(--hi)'},lg);H.E('stop',{offset:'1','stop-color':'var(--card)'},lg);
  H.E('rect',{x:40,y:134,width:B-40,height:12,rx:6,st:'fill:url(#c10g);stroke:var(--ink);stroke-width:1.2'},grad);
  H.txt(grad,40,162,'tip: about 1/2','lbs',{st:'font-weight:700'});H.txt(grad,B+4,162,'boundary: about 0','lbs',{st:'font-weight:700'});
  H.txt(grad,290,134,'share of sperm with a swap','lbs',{st:'font-weight:700'});H.txt(grad,290,150,'(gene near the tip or near the boundary)','lbs');
  const panel=(x0,t)=>{const G=H.g(s);H.txt(G,x0,196,t,'cap',{st:'fill:var(--ink)'});H.O(G,0,{d:0});return G};
  const P1=panel(20,'SPERM WITHOUT A SWAP'),P2=panel(330,'SPERM WITH A SWAP');
  H.E('line',{x1:315,y1:186,x2:315,y2:410,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  // panel 1: plain copies
  const k1=H.g(P1);hbar(k1,30,190,236,'mom');allele(k1,58,236,'a');hbar(k1,30,110,276,'dad');allele(k1,58,276,'A');from(k1,10,-172);
  const o1=H.g(P1);H.O(o1,0,{d:0});mkA(o1,198,236,232,236,{w:1.6,h:6}).lastChild.style.opacity=1;mkA(o1,118,276,232,276,{w:1.6,h:6}).lastChild.style.opacity=1;
  o1.querySelectorAll('.draw').forEach(e=>e.style.strokeDashoffset=0);
  sym(o1,252,236,'f');sym(o1,252,276,'m');H.txt(o1,272,241,'a','lb');H.txt(o1,272,281,'A','lb');
  H.txt(o1,150,330,'daughters get a','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.txt(o1,150,348,'sons get A','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  // panel 2: swapped tips
  const k2=H.g(P2);const xr=H.g(k2),yr=H.g(k2);
  H.E('rect',{x:410,y:226,width:120,height:20,rx:10,st:'fill:var(--card);stroke:var(--mom);stroke-width:3'},xr);
  H.E('rect',{x:410,y:266,width:20,height:20,rx:10,st:'fill:var(--card);stroke:var(--dad);stroke-width:3'},yr);
  const xt=H.g(k2),yt=H.g(k2);H.E('rect',{x:340,y:226,width:76,height:20,rx:10,st:'fill:var(--card);stroke:var(--mom);stroke-width:3'},xt);allele(xt,368,236,'a');
  H.E('rect',{x:340,y:266,width:76,height:20,rx:10,st:'fill:var(--card);stroke:var(--dad);stroke-width:3'},yt);allele(yt,368,276,'A');
  from(k2,-300,-172);
  const o2=H.g(P2);H.O(o2,0,{d:0});[[538,236],[438,276]].forEach(([x,y])=>{const a=H.arrow(o2,x,y,572,y,{w:1.6,h:6});a.firstChild.style.strokeDashoffset=0});
  sym(o2,592,236,'f');sym(o2,592,276,'m');H.txt(o2,612,241,'A','lb');H.txt(o2,612,281,'a','lb');
  H.txt(o2,470,330,'daughters get A','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.txt(o2,470,348,'sons get a','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  const cxl=H.E('line',{x1:417,y1:216,x2:417,y2:296,pathLength:1,cls:'draw',st:'stroke:var(--bad);stroke-width:2.5'},P2);
  const tot=H.txt(s,320,396,'tip gene: about 1/2 of the sperm carry a swap → sons and daughters equal','lb',{'text-anchor':'middle',st:'font-size:13.5px'});H.O(tot,0,{d:0});
  return [
    ()=>{H.O(shade,1)},
    ()=>{H.O(P1,1);go(k1,{d:1100});H.O(o1,1,{at:1100})},
    ()=>{H.O(P2,1);go(k2,{d:1100});H.D(cxl,1,{d:600,at:1100});H.after(1700,()=>{H.T(xt,{y:40},{d:1000});H.T(yt,{y:-40},{d:1000})});H.O(o2,1,{at:2700})},
    ()=>{H.O(grad,1,{d:700});H.O(tot,1,{at:500})},
  ];}},

/* 12 ─────────────────────────────── */
{title:'When SRY Moves or Breaks',caption:'Square = male · circle = female · orange = from the mother · blue = from the father',
text:`<p data-step="0"><i>SRY</i> sits on the short arm of the Y, close to the PAR1 boundary.</p>
<p data-step="1">Rarely, the crossover in a father’s meiosis happens slightly past the boundary. The piece of the Y that moves to the X then carries <i>SRY</i>.</p>
<p data-step="2">A sperm cell with this X makes an XX zygote with <i>SRY</i>. TDF starts testis development, so the child develops as a male. About 1 in 20,000 males is XX.</p>
<p data-step="3">An XX male makes no sperm, because he lacks other Y genes that sperm production needs.</p>
<p data-step="4">Some other people are XY but have a broken copy of <i>SRY</i>. Their gonads do not develop as testes, and their bodies develop as female. So <i>SRY</i> decides whether the gonads become testes or ovaries.</p>`,
star:'The SRY gene, not the whole Y, decides testis or ovary.',starStep:4,
scene(H){const s=$s();const B=170,C=210;
  const F=H.g(s);H.txt(F,486,30,'FATHER','cap',{st:'fill:var(--ink)'});
  H.E('rect',{x:34,y:38,width:B-34,height:84,rx:8,st:'fill:var(--hi);fill-opacity:.3'},F);
  H.E('line',{x1:B,y1:36,x2:B,y2:126,st:'stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4'},F);H.txt(F,104,30,'PAR1','lb',{'text-anchor':'middle'});
  const seg=(p,x0,x1,y,col)=>H.E('rect',{x:x0,y:y-10,width:x1-x0,height:20,rx:10,st:`fill:var(--card);stroke:${H.C(col)};stroke-width:3`},p);
  seg(F,C-6,440,58,'mom');seg(F,C-6,250,98,'dad');H.txt(F,452,63,'X','lb');H.txt(F,262,103,'Y','lb');
  const xt=H.g(F),yt=H.g(F);seg(xt,40,C,58,'mom');seg(yt,40,C,98,'dad');
  const sry=H.E('rect',{x:178,y:88,width:14,height:20,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.2'},yt);
  const sl=H.txt(F,185,140,'SRY','lb',{'text-anchor':'middle',st:'fill:var(--good)'});
  const cut=H.E('line',{x1:C,y1:40,x2:C,y2:118,pathLength:1,cls:'draw',st:'stroke:var(--bad);stroke-width:2.5'},F);
  const cl=H.txt(F,C+8,140,'rare crossover past the boundary','lbs',{st:'font-weight:700;fill:var(--bad)'});H.O(cl,0,{d:0});
  H.E('line',{x1:315,y1:170,x2:315,y2:410,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  // XX male
  const L=H.g(s);H.O(L,0,{d:0});H.txt(L,20,182,'XX WITH SRY','cap',{st:'fill:var(--ink)'});
  const k=H.g(L);seg(k,30,250,214,'mom');const kt=H.g(k);seg(kt,30,C-10,214,'dad');H.E('rect',{x:168,y:204,width:14,height:20,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.2'},kt);
  H.txt(k,262,219,'X','lb');seg(k,30,250,248,'mom');H.txt(k,262,253,'X','lb');H.txt(L,140,278,'father’s X (with SRY) + mother’s X','lbs',{'text-anchor':'middle'});
  const mA=mkA(L,140,290,140,316,{w:1.8,h:7});
  const res=H.g(L);sym(res,112,346,'m',{r:14});H.txt(res,136,342,'testis · male','lb');H.txt(res,136,360,'about 1 in 20,000 males','lbs');H.O(res,0,{d:0});
  const ns=H.g(L);H.txt(ns,140,398,'no sperm: other Y genes missing','lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--bad)'});H.O(ns,0,{d:0});
  // XY female
  const R2=H.g(s);H.O(R2,0,{d:0});H.txt(R2,330,182,'XY WITH A BROKEN SRY','cap',{st:'fill:var(--ink)'});
  seg(R2,340,560,214,'mom');H.txt(R2,572,219,'X','lb');seg(R2,340,450,248,'dad');H.txt(R2,462,253,'Y','lb');
  H.E('rect',{x:398,y:238,width:14,height:20,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.2'},R2);
  const brk=cross(R2,405,248,11,{w:3.5});H.txt(R2,450,278,'mother’s X + father’s Y','lbs',{'text-anchor':'middle'});
  mkA(R2,450,290,450,316,{w:1.8,h:7});
  const r2=H.g(R2);sym(r2,422,346,'f',{r:14});H.txt(r2,446,342,'no testis · female','lb');
  R2.querySelectorAll('.draw').forEach(e=>e.style.strokeDashoffset=0);R2.querySelectorAll('g>path:last-child').forEach(e=>e.style.opacity=1);
  const ring=[H.E('ellipse',{cx:175,cy:214,rx:18,ry:18,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5'},s),H.E('ellipse',{cx:405,cy:248,rx:18,ry:18,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5'},s)];
  return [
    ()=>{H.O(sl,1)},
    ()=>{H.D(cut,1,{d:600});H.O(cl,1,{at:300});H.after(700,()=>{H.T(xt,{y:40},{d:1100});H.T(yt,{y:-40},{d:1100})})},
    ()=>{H.O(L,1,{d:500});H.O(cl,0,{d:300});drawA(mA,{at:500});H.O(res,1,{at:1000})},
    ()=>{H.O(ns,1)},
    ()=>{H.O(R2,1,{d:700});H.D(ring,1,{d:800,at:900})},
  ];}},

/* 13 ─────────────────────────────── */
{title:'X-Inactivation: One X per Cell',caption:'Orange = X from the mother · blue = X from the father · grey = silenced X',
text:`<p data-step="0">A female has two X chromosomes, and a male has one. Without a correction, most X genes would make twice as much protein in females. <b>Dosage compensation</b> is a system that makes the dose of X genes equal in the two sexes.</p>
<p data-step="1">In mammals, each cell of an early female embryo silences one X. The chosen X makes an <b>RNA</b> (a molecule copied from DNA) named <i>XIST</i>. <i>XIST</i> RNA coats that X and silences most of its genes. Biologists call this process <b>X-inactivation</b>.</p>
<p data-step="2">Each cell chooses at random between the X from the mother and the X from the father.</p>
<p data-step="3">All cells that descend from that cell keep the same choice. So an adult female is a <b>mosaic</b>. Some patches of her cells use the mother’s X, and other patches use the father’s X.</p>
<p data-step="4">The silenced X packs into a small, dark body at the edge of the nucleus, the <b>Barr body</b>. Fruit flies use a different system: a male fly makes his one X twice as active.</p>`,
star:'One X per cell stays active. Chance picks which one, and the cell keeps that choice.',starStep:3,
scene(H){const s=$s();
  const Z=H.g(s);H.txt(Z,110,30,'ONE FEMALE CELL','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  H.E('circle',{cx:110,cy:130,r:82,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},Z);H.E('circle',{cx:110,cy:130,r:52,st:'fill:none;stroke:var(--ink);stroke-width:1.4;stroke-dasharray:6 4'},Z);
  const xo=cb(Z,94,130,'',{len:62,w:13,col:'mom',fill:'mom'}),xd=cb(Z,126,130,'',{len:62,w:13,col:'dad',fill:'dad'});
  const coat=H.E('path',{d:'M94,99 q8,6 0,12 q-8,6 0,12 q8,6 0,12 q-8,6 0,12 q8,6 0,12',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:5;stroke-linecap:round'},Z);
  const xl=H.txt(Z,110,232,'','lb',{'text-anchor':'middle'});
  const M=H.g(s);H.txt(M,110,268,'MALE CELL','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});H.E('circle',{cx:110,cy:330,r:48,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.2'},M);
  cb(M,110,330,'',{len:40,w:10,col:'mom',fill:'mom'});H.txt(M,110,398,'one X','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  const barr=H.E('ellipse',{cx:64,cy:130,rx:6,ry:11,st:'fill:var(--muted);stroke:var(--ink);stroke-width:1.2'},Z);H.O(barr,0,{d:0});
  const bl=H.E('path',{d:'M62,142 L74,214',st:'fill:none;stroke:var(--ink);stroke-width:1.3'},Z);H.O(bl,0,{d:0});
  // embryo
  const E=H.g(s);H.O(E,0,{d:0});H.txt(E,430,30,'EARLY FEMALE EMBRYO','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  const ch='mddmdmmd',pos=[];for(let r=0;r<2;r++)for(let c=0;c<4;c++)pos.push([310+c*80+(r?40:0),100+r*72]);
  const cells=pos.map(([x,y],i)=>{const G=H.g(E);G.c=H.E('circle',{cx:x,cy:y,r:32,st:'fill:var(--cellfill);stroke:var(--ink);stroke-width:2'},G);
    G.o=cb(G,x-8,y,'',{len:30,w:8,col:'mom',fill:'mom',sw:2});G.d=cb(G,x+8,y,'',{len:30,w:8,col:'dad',fill:'dad',sw:2});G.k=ch[i];G.x=x;G.y=y;return G});
  // mosaic
  const Mo=H.g(s);const seeds=[[300,80],[392,62],[500,96],[600,70],[330,200],[440,170],[560,210],[290,320],[400,300],[520,330],[612,320],[470,250]];const pick='mddmdmmdmddm';const sq=[];
  let rs=11;const rnd=()=>{rs=(rs*9301+49297)%233280;return rs/233280};
  const x0=270,y0=50,n=18,m=16,w=20;for(let i=0;i<n;i++)for(let j=0;j<m;j++){const x=x0+i*w+w/2,y=y0+j*w+w/2;let b=0,bd=1e9;
    seeds.forEach(([sx,sy],q)=>{const d=Math.hypot(x-sx,y-sy)+rnd()*34;if(d<bd){bd=d;b=q}});
    const r=H.E('rect',{x:x-w/2,y:y-w/2,width:w,height:w,st:`fill:${H.C(pick[b]==='m'?'mom':'dad')};fill-opacity:.55;stroke:var(--card);stroke-width:1`},Mo);r.d=bd;H.O(r,0,{d:0});sq.push(r)}
  const ml=H.g(s);H.O(ml,0,{d:0});H.txt(ml,450,392,'adult tissue: a mosaic of patches','lb',{'text-anchor':'middle'});
  const fly=pill(s,450,402,'fruit fly: the male’s one X works twice as hard',{w:330});H.O(fly,0,{d:0});
  return [
    ()=>{xl.textContent='2 X chromosomes'},
    ()=>{H.D(coat,1,{d:1200});H.after(1100,()=>{H.K(xo.body,{fill:'muted',stroke:'muted'});xl.textContent='XIST silences one X'})},
    ()=>{H.O(E,1,{d:600});cells.forEach((G,i)=>{const off=G.k==='m'?G.d:G.o;H.after(600+i*150,()=>{H.K(off.body,{fill:'muted',stroke:'muted'});H.K(G.c,{fill:G.k==='m'?'mom-tint':'dad-tint'})})})},
    ()=>{cells.forEach(G=>{H.T(G,{y:80},{d:1000});H.O(G,0,{d:600,at:700})});sq.forEach(r=>H.O(r,1,{d:500,at:700+r.d*12}));H.O(ml,1,{at:1800});H.after(700,()=>{E.querySelector('text').textContent='ADULT TISSUE'})},
    ()=>{H.O(ml,0,{d:300});H.T(xo,{s:.4},{d:0});org(xo,94,130);H.T(xo,{x:0,y:0},{d:0});H.O(xo,0,{d:600});H.O(coat,0,{d:600});H.O(barr,1,{at:400});H.O(bl,1,{at:400});xl.textContent='Barr body = silenced X';H.O(fly,1,{at:600})},
  ];}},

/* 14 ─────────────────────────────── */
{title:'The Calico Cat',caption:'Calico: Terragio67 · tortoiseshell: Ivanhercaz · both CC BY-SA 4.0, Wikimedia Commons',
text:`<p data-step="0">In cats, an X gene sets the fur colour. The <b>O</b> allele makes the pigment cells in the hair roots produce orange pigment. The <b>o</b> allele makes them produce black pigment.</p>
<p data-step="0" class="note">The O allele is a small deletion of DNA in the X gene <i>ARHGAP36</i>. Two research teams reported it in 2025.</p>
<p data-step="1">A female cat with one O and one o is <b>heterozygous</b> (she has two different alleles). Early in development, each cell of the embryo silences one X. The pigment cells keep the choice of the cells that they descend from.</p>
<p data-step="2">Where the X with O is active, the fur is orange. Where the X with o is active, the fur is black. A female with this mix of patches is a <b>tortoiseshell</b> cat.</p>
<p data-step="3">A separate gene on an autosome adds white patches. A tortoiseshell pattern with white patches makes a <b>calico</b> cat.</p>
<p data-step="4">A male cat has one X, so his fur is orange or black, not both. Calico males are rare. Most of them are XXY, and they are usually sterile.</p>`,
star:'Two fur colours in patches: two different X chromosomes at work.',starStep:4,
scene(H){const s=$s();
  const ph=H.g(s);H.E('image',{href:'@@asset:c10-calico.jpg@@',x:0,y:4,width:360,height:240},ph);H.E('image',{href:'@@asset:c10-tortoiseshell.jpg@@',x:408,y:4,width:216,height:240},ph);
  H.txt(ph,180,262,'calico','lb',{'text-anchor':'middle'});H.txt(ph,516,262,'tortoiseshell','lb',{'text-anchor':'middle'});
  const tag=(x,y,t,px,py)=>{const G=H.g(s);const w=t.length*7.2+16;
    H.E('line',{x1:px,y1:py,x2:x+w/2,y2:y,st:'stroke:#fff;stroke-width:2.2'},G);H.E('circle',{cx:px,cy:py,r:6,st:'fill:none;stroke:#fff;stroke-width:3'},G);
    H.E('rect',{x,y:y-12,width:w,height:24,rx:6,st:'fill:#16181d;opacity:.9'},G);H.txt(G,x+8,y+5,t,'lbs',{st:'fill:#fff;font-weight:700'});H.O(G,0,{d:0});return G};
  const tO=tag(196,30,'orange: X with O on',282,86),tB=tag(190,222,'black: X with o on',150,126),tW=tag(8,222,'white: autosomal gene',90,178);
  const Dg=H.g(s);const TY=302;
  const al=(p,x,y,a,o)=>tile(p,x,y,'X',a,Object.assign({w:38,fss:14},o));
  const patch=(x,on,off,fur,lab)=>{const G=H.g(Dg);al(G,x-20,TY,on,{fill:on==='O'?'mom':'ink',ink:'paper'});al(G,x+20,TY,off,{fill:'faint'});
    H.E('line',{x1:x+4,y1:TY+10,x2:x+36,y2:TY-10,st:'stroke:var(--muted);stroke-width:2'},G);
    H.E('rect',{x:x-32,y:TY+18,width:64,height:32,rx:6,st:`fill:${H.C(fur)};stroke:var(--ink);stroke-width:1.5`},G);H.txt(G,x,TY+66,lab,'lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(G,0,{d:0});return G};
  const fh=H.txt(Dg,150,284,'Female O/o: two kinds of patch','lb',{'text-anchor':'middle'});H.O(fh,0,{d:0});
  const p1=patch(90,'O','o','mom','orange patch'),p2=patch(210,'o','O','ink','black patch');
  const fn=H.txt(Dg,150,392,'struck-out X = silenced','lbs',{'text-anchor':'middle'});H.O(fn,0,{d:0});
  H.E('line',{x1:318,y1:276,x2:318,y2:410,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},Dg);
  const Ml=H.g(Dg);H.O(Ml,0,{d:0});H.txt(Ml,480,284,'Male: one X','lb',{'text-anchor':'middle'});
  [[410,'O','mom','all orange'],[550,'o','ink','all black']].forEach(([x,a,f,l])=>{al(Ml,x-18,TY,a,{fill:f,ink:'paper'});tile(Ml,x+18,TY,'Y','');
    H.E('rect',{x:x-32,y:TY+18,width:64,height:32,rx:6,st:`fill:${H.C(f)};stroke:var(--ink);stroke-width:1.5`},Ml);H.txt(Ml,x,TY+66,l,'lbs',{'text-anchor':'middle',st:'font-weight:700'})});
  H.txt(Ml,480,392,'most calico males: XXY, usually sterile','lbs',{'text-anchor':'middle'});
  return [
    ()=>{},
    ()=>{H.O([fh,fn],1);[p1,p2].forEach(G=>H.O(G,1,{d:500}))},
    ()=>{H.O(tO,1,{at:200});H.O(tB,1,{at:500})},
    ()=>{H.O(tW,1)},
    ()=>{H.O(Ml,1,{d:700})},
  ];}},

/* 15 ─────────────────────────────── */
{title:'SHOX: Counting PAR Copies',caption:'Heights are schematic · yellow tip = PAR1 with one SHOX copy',
text:`<p data-step="0"><i>SHOX</i> is a gene in PAR1. Its protein promotes the growth of the long bones of the arms and legs. A person with 46,XX or 46,XY has two sex chromosomes. So that person has two copies of <i>SHOX</i> and average height.</p>
<p data-step="1">PAR genes stay active on both X chromosomes, even on the silenced X. So each extra sex chromosome adds one active copy. People with 47,XXX, 47,XXY or 47,XYY have three copies and are often taller than average.</p>
<p data-step="2">A girl or woman with 45,X has Turner syndrome. She has one copy of <i>SHOX</i> and is usually short. The single copy of <i>SHOX</i> causes her short height and some bone differences.</p>
<p data-step="3">A cell with one chromosome too many or too few has <b>aneuploidy</b>. A sex-chromosome aneuploidy changes the number of copies of every PAR gene. The cells then make too much or too little of the PAR gene proteins.</p>`,
star:'SHOX copies = sex chromosomes. One copy: short. Three copies: often tall.',starStep:2,
scene(H){const s=$s();const xs=[70,170,270,370,470,570],base=300;
  const kt=[['45,X',['X']],['46,XX',['X','X']],['46,XY',['X','Y']],['47,XXX',['X','X','X']],['47,XXY',['X','X','Y']],['47,XYY',['X','Y','Y']]];
  const hgt={1:120,2:170,3:205};
  H.E('line',{x1:20,y1:base,x2:620,y2:base,st:'stroke:var(--ink);stroke-width:2'},s);
  const avg=H.E('line',{x1:20,y1:base-170,x2:620,y2:base-170,st:'stroke:var(--muted);stroke-width:1.3;stroke-dasharray:6 5'},s);H.txt(s,22,base-176,'average height','lbs');
  const cols=kt.map(([n,cs],i)=>{const G=H.g(s);const x=xs[i];const c=cs.length;
    const bar=H.E('rect',{x:x-22,y:base-hgt[c],width:44,height:hgt[c],rx:6,st:`fill:var(--wash);stroke:var(--ink);stroke-width:1.6`},G);bar.h=hgt[c];
    H.txt(G,x,base+20,n,'lb',{'text-anchor':'middle'});
    cs.forEach((l,j)=>{const cx=x+(j-(c-1)/2)*20,L=l==='Y'?26:42;const yy=base+34+L/2;
      H.E('rect',{x:cx-6,y:base+34,width:12,height:L,rx:6,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.6'},G);
      H.E('rect',{x:cx-6,y:base+34,width:12,height:9,rx:4,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.2'},G)});
    const cn=H.txt(G,x,base-8,'','lb',{'text-anchor':'middle',st:'font-size:15px'});G.bar=bar;G.cn=cn;G.c=c;H.O(G,0,{d:0});return G});
  cols.forEach(G=>{org(G.bar,0,base);H.T(G.bar,{sy:.001},{d:0});G.cn.setAttribute('y',base-G.bar.h-8);G.cn.textContent=`${G.c} × SHOX`;H.O(G.cn,0,{d:0})});
  const grow=G=>{H.O(G,1,{d:400});H.T(G.bar,{sy:1},{d:1100,at:200});H.O(G.cn,1,{at:1000})};
  const tur=H.txt(s,xs[0],base-150,'Turner','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(tur,0,{d:0});
  const an=H.g(s);H.O(an,0,{d:0});[[xs[0],xs[0]],[xs[3],xs[5]]].forEach(([a,b])=>H.E('path',{d:`M${a-30},${base+96} V${base+104} H${b+30} V${base+96}`,st:'fill:none;stroke:var(--bad);stroke-width:2.2'},an));
  H.txt(an,(xs[3]+xs[5])/2,base+118,'aneuploidy','lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--bad)'});H.txt(an,xs[0],base+118,'aneuploidy','lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--bad)'});
  return [
    ()=>{grow(cols[1]);H.after(250,()=>grow(cols[2]))},
    ()=>{[3,4,5].forEach((i,j)=>H.after(j*250,()=>grow(cols[i])))},
    ()=>{grow(cols[0]);H.O(tur,1,{at:500})},
    ()=>{H.O(an,1,{d:600})},
  ];}},

/* 16 ─────────────────────────────── */
{title:'Sex Linkage: When the Parent’s Sex Matters',caption:'Red tile = X with the allele · blue edge = from the father · orange edge = from the mother',
text:`<p data-step="0">Gregor Mendel studied heredity in pea plants in the 1860s. A <b>cross</b> is a mating between two chosen parents. Mendel’s first law is the <b>law of segregation</b>. The two copies of a gene separate into gametes in equal numbers.</p>
<p data-step="0">For an autosomal gene, a cross gives the same result whichever parent carries an allele.</p>
<p data-step="1"><b>Sex-linked</b> genes are on a sex chromosome. <b>X-linked genes</b> are on the X. Most of them have no copy on the Y, so a female has two copies and a male has one.</p>
<p data-step="2">A father gives his X to every daughter and to no son. So an X-linked allele in a father passes to all his daughters and to none of his sons.</p>
<p data-step="3">Each child gets one of the mother’s two X chromosomes. So an X-linked allele in a mother passes to half of her daughters and half of her sons.</p>
<p data-step="4">The X and the Y still separate 1 : 1 into gametes. But the result of a cross now depends on which parent carries the allele, and sons and daughters can differ.</p>`,
star:'Father’s X: every daughter, no son. Mother’s X: half of all children.',starStep:4,
scene(H){const s=$s();
  const T=H.g(s);H.txt(T,150,24,'AUTOSOMAL GENE','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  tile(T,130,58,'A','',{});tile(T,170,58,'a','',{});H.txt(T,150,96,'2 copies → gametes A : a = 1 : 1','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  const S=H.g(s);H.O(S,0,{d:0});H.txt(S,470,24,'X-LINKED GENE','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  sexT(S,372,64,'f',{fs:20});tile(S,402,58,'X','',{fill:'bad'});tile(S,434,58,'X','');H.txt(S,418,96,'female: 2 copies','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  sexT(S,500,64,'m',{fs:20});tile(S,530,58,'X','',{fill:'bad'});tile(S,562,58,'Y','');H.E('line',{x1:550,y1:46,x2:574,y2:70,st:'stroke:var(--bad);stroke-width:2'},S);H.txt(S,546,96,'male: 1 copy','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  H.E('line',{x1:20,y1:118,x2:620,y2:118,st:'stroke:var(--faint);stroke-width:1.5'},s);
  const panel=(x0,title,fa,mo)=>{const G=H.g(s);H.O(G,0,{d:0});H.txt(G,x0+140,146,title,'cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
    const cx=[x0+130,x0+230],ry=[226,296];
    H.E('path',{d:`M${x0+80},${192} H${x0+280} V${332} H${x0+80} Z M${x0+180},192 V332 M${x0+80},262 H${x0+280}`,st:'fill:none;stroke:var(--ink);stroke-width:1.6'},G);
    const sp=fa.map((t,j)=>tile(G,cx[j],176,t[0],'',{edge:'dad',fill:t[1]?'bad':undefined}));
    const eg=mo.map((t,i)=>tile(G,x0+56,ry[i],t[0],'',{edge:'mom',fill:t[1]?'bad':undefined}));
    const cells=[];ry.forEach((y,i)=>cx.forEach((x,j)=>{const C=H.g(G);tile(C,x-14,y-8,mo[i][0],'',{edge:'mom',fill:mo[i][1]?'bad':undefined});tile(C,x+14,y-8,fa[j][0],'',{edge:'dad',fill:fa[j][1]?'bad':undefined});
      sexT(C,x,y+24,fa[j][0]==='Y'?'m':'f',{fs:16});const has=mo[i][1]||fa[j][1];if(has)H.E('rect',{x:x-46,y:y-31,width:92,height:62,rx:6,st:'fill:none;stroke:var(--bad);stroke-width:2.4'},C);H.O(C,0,{d:0});cells.push(C)}));
    G.cells=cells;return G};
  const L=panel(10,'ALLELE IN THE FATHER',[['X',1],['Y',0]],[['X',0],['X',0]]),R=panel(330,'ALLELE IN THE MOTHER',[['X',0],['Y',0]],[['X',1],['X',0]]);
  const rL=H.txt(s,150,362,'all daughters · no sons','lb',{'text-anchor':'middle',st:'fill:var(--bad)'}),rR=H.txt(s,470,362,'1/2 of daughters · 1/2 of sons','lb',{'text-anchor':'middle',st:'fill:var(--bad)'});H.O([rL,rR],0,{d:0});
  const dif=H.txt(s,320,404,'different results → the gene is sex-linked','lb',{'text-anchor':'middle',st:'font-size:16px'});H.O(dif,0,{d:0});
  return [
    ()=>{},
    ()=>{H.O(S,1,{d:600})},
    ()=>{H.O(L,1,{d:500});L.cells.forEach((C,i)=>H.O(C,1,{at:500+i*200}));H.O(rL,1,{at:1400})},
    ()=>{H.O(R,1,{d:500});R.cells.forEach((C,i)=>H.O(C,1,{at:500+i*200}));H.O(rR,1,{at:1400})},
    ()=>{H.O(dif,1)},
  ];}},

/* 17 ─────────────────────────────── */
{title:'The white Gene of the Fruit Fly',caption:'Fly: Paul Reynolds, CC BY 2.5, Wikimedia Commons · X⁺ = X with w⁺ · Xʷ = X with w⁻',
text:`<p data-step="0">The fruit fly <i>Drosophila melanogaster</i> normally has dark red eyes. Pigment cells in the eye build the red pigment from small building-block molecules.</p>
<p data-step="1">The <i>white</i> gene is on the X. Pigment granules are small sacs in which the cell makes pigment. The gene makes a <b>transporter</b>, a protein in the wall of the pigment granules. The transporter carries the building blocks into the granules.</p>
<p data-step="2">The normal allele is <b>w⁺</b>, the <b>wild type</b> (the common form in nature). The <b>mutant</b> allele <b>w⁻</b> (an allele with a DNA change) makes no functional transporter. A fly with no w⁺ copy has no eye pigment, so its eyes are white.</p>
<p data-step="3">One w⁺ copy makes enough transporter. So a w⁺/w⁻ female (one w⁺ and one w⁻) has red eyes. The allele w⁻ is <b>recessive</b>: its trait shows only without a w⁺ copy. The allele w⁺ is <b>dominant</b>. A w⁻/w⁻ female has white eyes.</p>
<p data-step="4">The Y has no <i>white</i> gene, so a male is hemizygous. A w⁺/Y male has red eyes, and a w⁻/Y male has white eyes. In short, X⁺ is an X with w⁺, and Xʷ is an X with w⁻.</p>`,
star:'w⁺ makes the transporter for pigment building blocks.',starStep:4,
scene(H){const s=$s();
  H.E('image',{href:'@@asset:c10-white-eyed-fly.jpg@@',x:0,y:4,width:300,height:204},s);
  const ey=H.g(s);H.E('circle',{cx:240,cy:66,r:22,st:'fill:none;stroke:var(--hi);stroke-width:3.5'},ey);H.txt(ey,204,30,'white eye','lb',{st:'fill:#fff;font-size:15px'});H.O(ey,0,{d:0});
  // pigment cell mechanism
  const C=H.g(s);const cx0=318;H.txt(C,470,22,'EYE PIGMENT CELL','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  H.E('rect',{x:cx0,y:36,width:304,height:168,rx:22,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},C);
  const gran=H.E('circle',{cx:552,cy:120,r:42,st:'fill:var(--card);stroke:var(--ink);stroke-width:2'},C);H.txt(C,548,182,'pigment granule','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  const tr=H.g(C);H.E('rect',{x:494,y:100,width:12,height:40,rx:3,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.5'},tr);H.E('rect',{x:510,y:100,width:12,height:40,rx:3,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.5'},tr);
  const trl=H.txt(C,488,160,'transporter','lbs',{'text-anchor':'end',st:'font-weight:700;fill:var(--good)'});H.O([tr,trl],0,{d:0});
  const dots=[];for(let i=0;i<7;i++){const d=H.E('circle',{cx:0,cy:0,r:5,st:'fill:var(--bad)'},C);H.T(d,{x:360+(i%3)*24,y:76+Math.floor(i/3)*30+(i%2)*8},{d:0});dots.push(d)}
  const bk=cross(C,508,120,18,{w:4});const bkl=H.txt(C,400,190,'w⁻: no transporter','lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--bad)'});H.O(bkl,0,{d:0});
  // genotype table
  const T=H.g(s);const gx=[64,188,312,436,560];const gt=[['+','+'],['+','w'],['w','w'],['+','Y'],['w','Y']];
  const cols=gt.map((g,i)=>{const G=H.g(T);const x=gx[i];const red=g.includes('+');
    g.forEach((a,j)=>{const xx=x-17+j*34;if(a==='Y')tile(G,xx,262,'Y','');else tile(G,xx,262,'X',a,{fill:a==='+'?'bad':'card'})});
    fly(G,x,318,{eye:red?'red':'white',sex:g[1]==='Y'?'m':'f',s:1.25});
    H.txt(G,x,372,red?'red eyes':'white eyes','lb',{'text-anchor':'middle',st:`fill:${red?'var(--bad)':'var(--ink)'}`});
    sexT(G,x,398,g[1]==='Y'?'m':'f',{fs:16});H.O(G,0,{d:0});return G});
  H.E('line',{x1:374,y1:236,x2:374,y2:410,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},T);
  return [
    ()=>{H.O(ey,1,{at:300})},
    ()=>{H.O([tr,trl],1);dots.forEach((d,i)=>{H.T(d,{x:508,y:120},{d:700,at:300+i*220});H.T(d,{x:534+(i%3)*14,y:106+Math.floor(i/3)*14},{d:500,at:1000+i*220})});H.after(2600,()=>H.K(gran,{fill:'bad'}))},
    ()=>{H.K(gran,{fill:'card'},{d:500});dots.forEach((d,i)=>{H.T(d,{x:360+(i%3)*24,y:76+Math.floor(i/3)*30+(i%2)*8},{d:600})});H.D(bk.firstChild,1,{d:500,at:400});H.O(bkl,1,{at:600})},
    ()=>{[0,1,2].forEach((i,j)=>H.O(cols[i],1,{at:j*250}))},
    ()=>{[3,4].forEach((i,j)=>H.O(cols[i],1,{at:j*250}))},
  ];}},

/* 18 ─────────────────────────────── */
{title:'Morgan’s White-Eyed Male',caption:'Photo: National Library of Medicine, public domain, Wikimedia Commons · Morgan’s 1910 counts',
text:`<p data-step="0">In 1910 Thomas Hunt Morgan bred fruit flies at Columbia University in New York. In a bottle of red-eyed flies, he found one male with white eyes.</p>
<p data-step="1">He crossed this white-eyed male with red-eyed females. Nearly all of their offspring, the <b>F1</b> generation, had red eyes: 1237 flies. So white is recessive.</p>
<p data-step="2">He then crossed F1 flies with each other. Their offspring, the <b>F2</b> generation, had 2459 red-eyed females, 1011 red-eyed males and 782 white-eyed males.</p>
<p data-step="3">Every white-eyed F2 fly was male. Morgan explained this result: the <i>white</i> gene is on the X. <i>White</i> was the first gene that a scientist placed on a specific chromosome.</p>
<p data-step="3" class="note">The F2 has fewer white-eyed flies (782 of 4252) than a 3 : 1 ratio predicts. White-eyed flies survive less well.</p>
<p data-step="4">Morgan received the Nobel Prize in 1933 for his discoveries about the role of chromosomes in heredity.</p>`,
star:'White eyes in the F2: only in males. So white is on the X.',starStep:3,
scene(H){const s=$s();
  H.E('image',{href:'@@asset:c10-thomas-hunt-morgan.jpg@@',x:6,y:6,width:190,height:253},s);H.txt(s,101,278,'Thomas Hunt Morgan','lb',{'text-anchor':'middle'});
  const m0=H.g(s);fly(m0,101,324,{eye:'white',sex:'m',s:1.5});H.txt(m0,101,378,'the white-eyed male','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(m0,0,{d:0});
  const nob=pill(s,101,410,'Nobel Prize 1933',{fill:'hi',ink:'#16181d',w:140});H.O(nob,0,{d:0});
  const X0=268,W=290,mx=2459;
  const row=(y,lab,eye,sex,n)=>{const G=H.g(s);fly(G,X0-26,y+12,{eye,sex,s:.9});H.txt(G,X0,y,lab,'lbs',{st:'font-weight:700'});
    const b=H.E('rect',{x:X0,y:y+6,width:Math.max(1,W*n/mx),height:20,rx:3,st:`fill:${eye==='red'?'var(--bad)':'var(--card)'};stroke:var(--ink);stroke-width:1.5`},G);org(b,X0,y);H.T(b,{sx:.001},{d:0});
    const t=H.txt(G,X0+W*n/mx+8,y+21,'0','lb');G.b=b;G.t=t;G.n=n;H.O(G,0,{d:0});return G};
  const F1h=H.txt(s,X0-48,36,'F1','big',{st:'font-size:22px'});H.O(F1h,0,{d:0});
  const f1=row(64,'red-eyed flies','red','f',1237);
  const F2h=H.txt(s,X0-48,136,'F2','big',{st:'font-size:22px'});H.O(F2h,0,{d:0});
  const f2=[row(164,'red-eyed females','red','f',2459),row(224,'red-eyed males','red','m',1011),row(284,'white-eyed males','white','m',782),row(344,'white-eyed females','white','f',0)];
  const grow=(G,at)=>{H.O(G,1,{at});H.T(G.b,{sx:1},{d:1100,at});const p={set textContent(v){G.t.textContent=v}};H.after(at||0,()=>H.count(p,0,G.n,{d:1100,fmt:v=>String(Math.round(v))}))};
  const ring=H.E('rect',{x:X0-48,y:326,width:W+110,height:86,rx:12,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5'},s);
  const xl=H.g(s);H.txt(xl,X0+40,374,'none: every F2 daughter got','lbs',{st:'font-weight:700;fill:var(--ink)'});H.txt(xl,X0+40,392,'her father’s X, which carried w⁺','lbs',{st:'font-weight:700;fill:var(--ink)'});H.O(xl,0,{d:0});
  return [
    ()=>{H.O(m0,1,{d:600})},
    ()=>{H.O(F1h,1);grow(f1,200)},
    ()=>{H.O(F2h,1);f2.forEach((G,i)=>grow(G,200+i*350))},
    ()=>{H.D(ring,1,{d:900});H.O(xl,1,{at:600})},
    ()=>{H.O(nob,1)},
  ];}},

/* 19 ─────────────────────────────── */
{title:'Cross A: Red-Eyed Female × White-Eyed Male',caption:'Drawing: T. H. Morgan (1916), public domain, Wikimedia Commons · red = X⁺, plain = Xʷ',
text:`<p data-step="0"><b>P generation.</b> The parents are a pure-breeding red-eyed female and a white-eyed male. A <b>strain</b> is a line of flies bred together. A pure-breeding strain gives offspring with the same trait in every generation. X⁺ is an X with w⁺, and Xʷ is an X with w⁻. In symbols (× means crossed with): X⁺X⁺ × XʷY.</p>
<p data-step="1"><b>Gametes.</b> Every egg cell carries X⁺. Half of the sperm cells carry Xʷ, and half carry Y.</p>
<p data-step="2"><b>F1.</b> Daughters are X⁺Xʷ and have red eyes. Sons are X⁺Y and have red eyes, because a son gets his only X from his mother. All F1 flies are red-eyed.</p>
<p data-step="3"><b>F1 × F1.</b> An F1 female (X⁺Xʷ) makes eggs with X⁺ or Xʷ. An F1 male (X⁺Y) makes sperm with X⁺ or Y.</p>
<p data-step="4"><b>F2.</b> All daughters have red eyes, because each gets X⁺ from her father. Half of the sons are X⁺Y (red) and half are XʷY (white). Red : white = 3 : 1, and every white-eyed fly is male.</p>`,
star:'Cross A: F1 all red. F2: white eyes only in sons.',starStep:4,
scene(H){return crossScene(H,{img:'@@asset:c10-morgan-fig35.jpg@@',w:510,h:773,
  fl:[[172,150],[330,150],[118,405],[385,415],[55,675],[190,675],[320,675],[455,675]],
  P:[['+','+'],['w','Y']],f2map:[0,2,1,3],res:['F2 daughters: all red','F2 sons: 1/2 red, 1/2 white','red : white = 3 : 1']})}},

/* 20 ─────────────────────────────── */
{title:'Cross B: The Reciprocal Cross',caption:'Drawing: T. H. Morgan (1916), public domain, Wikimedia Commons · red = X⁺, plain = Xʷ',
text:`<p data-step="0"><b>P generation.</b> Cross B swaps the two <b>phenotypes</b> (visible traits) between the sexes. The parents are a white-eyed female and a red-eyed male. In symbols: XʷXʷ × X⁺Y.</p>
<p data-step="1"><b>Gametes.</b> Every egg cell carries Xʷ. Half of the sperm cells carry X⁺, and half carry Y.</p>
<p data-step="2"><b>F1.</b> Daughters are X⁺Xʷ and have red eyes. Sons are XʷY and have white eyes, because each son gets his only X from his white-eyed mother. A trait that passes from mother to son and from father to daughter shows <b>criss-cross inheritance</b>.</p>
<p data-step="3"><b>F1 × F1.</b> An F1 female (X⁺Xʷ) makes eggs with X⁺ or Xʷ. An F1 male (XʷY) makes sperm with Xʷ or Y.</p>
<p data-step="4"><b>F2.</b> Half of the daughters and half of the sons have white eyes. Red : white = 1 : 1 in both sexes.</p>`,
star:'Cross B: F1 daughters red, sons white. F2: 1 : 1 in both sexes.',starStep:4,
scene(H){return crossScene(H,{img:'@@asset:c10-morgan-fig36.jpg@@',w:522,h:778,
  fl:[[195,160],[330,160],[130,410],[395,410],[60,665],[195,665],[330,665],[465,665]],
  P:[['w','w'],['+','Y']],f2map:[2,0,3,1],res:['F2 daughters: 1/2 red, 1/2 white','F2 sons: 1/2 red, 1/2 white','red : white = 1 : 1']})}},

/* 21 ─────────────────────────────── */
{title:'Reciprocal Crosses Test for Sex Linkage',caption:'Bar = one sex · red part = fraction with red eyes · white part = fraction with white eyes',
text:`<p data-step="0">A <b>reciprocal cross</b> is a pair of crosses in which the two parental phenotypes swap sexes. Cross A and cross B of the <i>white</i> gene are reciprocal crosses.</p>
<p data-step="1">For an autosomal gene, both crosses give the same result. All F1 flies are red-eyed, and the F2 has 3 red : 1 white in both sexes.</p>
<p data-step="2">For the X-linked <i>white</i> gene, the two crosses give different F1 and F2 results. Sons and daughters also differ.</p>
<p data-step="3">So reciprocal crosses test a new mutation for sex linkage. Suppose that the two crosses differ, or that sons differ from daughters. Then the gene is usually on a sex chromosome.</p>`,
star:'Swap the sexes of the parents. Same result: autosomal. Different result: sex-linked.',starStep:3,
scene(H){const s=$s();const cx=[130,330,530],ry=[80,240],BH=96;
  const hd=[['AUTOSOMAL GENE','either cross'],['X-LINKED · CROSS A','red female × white male'],['X-LINKED · CROSS B','white female × red male']];
  const heads=hd.map(([a,b],i)=>{const G=H.g(s);H.txt(G,cx[i],26,a,'cap',{'text-anchor':'middle',st:'fill:var(--ink)'});H.txt(G,cx[i],44,b,'lbs',{'text-anchor':'middle'});return G});
  H.txt(s,14,ry[0]+BH/2+6,'F1','big',{st:'font-size:20px'});H.txt(s,14,ry[1]+BH/2+6,'F2','big',{st:'font-size:20px'});
  H.E('line',{x1:230,y1:20,x2:230,y2:370,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  const V=[[[1,1],[.75,.75]],[[1,1],[1,.5]],[[1,0],[.5,.5]]];
  const cols=V.map((col,i)=>col.map((pr,r)=>{const G=H.g(s);H.O(G,0,{d:0});pr.forEach((f,j)=>{const x=cx[i]+(j?22:-46),y=ry[r];
      H.E('rect',{x,y,width:24,height:BH,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.6'},G);
      const red=H.E('rect',{x,y:y+BH*(1-f),width:24,height:BH*f,st:'fill:var(--bad)'},G);org(red,x,y+BH);H.T(red,{sy:.001},{d:0});G.reds=(G.reds||[]).concat(red);
      H.E('rect',{x,y,width:24,height:BH,st:'fill:none;stroke:var(--ink);stroke-width:1.6'},G);
      sexT(G,x+12,y+BH+20,j?'m':'f',{fs:15});H.txt(G,x+(j?32:-8),y+BH*(1-f)+(f?14:-4),f===1?'all':f===0?'none':f===.75?'3/4':'1/2','lbs',{'text-anchor':j?'start':'end',st:'font-weight:700'});});return G}));
  const show=G=>{H.O(G,1);G.reds.forEach((r,k)=>H.T(r,{sy:1},{d:900,at:k*150}))};
  const ring=[H.E('rect',{x:420,y:60,width:220,height:310,rx:14,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5'},s)];
  const r2=H.E('rect',{x:240,y:60,width:180,height:310,rx:14,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5'},s);
  const cmp=H.g(s);H.O(cmp,0,{d:0});H.txt(cmp,130,402,'A = B','lb',{'text-anchor':'middle',st:'font-size:16px;fill:var(--good)'});H.txt(cmp,430,402,'A ≠ B → sex-linked','lb',{'text-anchor':'middle',st:'font-size:16px;fill:var(--bad)'});
  return [
    ()=>{},
    ()=>{cols[0].forEach((G,r)=>H.after(r*500,()=>show(G)))},
    ()=>{[1,2].forEach((i,k)=>cols[i].forEach((G,r)=>H.after(k*700+r*350,()=>show(G))))},
    ()=>{H.D([r2,...ring],1,{d:900});H.O(cmp,1,{at:600})},
  ];}},

/* 22 ─────────────────────────────── */
{title:'The Turkey Z Gene: Reciprocal Crosses in Birds',caption:'Turkey (bronze): Steve Voght, CC BY-SA 2.0, via Flickr · gold tile = Zᴱ · plain tile = Zᵉ',
text:`<p data-step="0">In the turkey, a gene on the Z sets the feather colour. The dominant allele <b>E</b> gives bronze feathers, even with one copy. The recessive allele <b>e</b> gives brown feathers only without an E copy.</p>
<p data-step="1">A male (ZZ) has two copies of the gene. A female (ZW) has one copy, because the W carries no copy. So a female bird is hemizygous for Z genes.</p>
<p data-step="2"><b>Cross 1.</b> A bronze male (ZᴱZᴱ) × a brown female (ZᵉW). Sons are ZᴱZᵉ, and daughters are ZᴱW. All offspring are bronze.</p>
<p data-step="3"><b>Cross 2, the reciprocal cross.</b> A brown male (ZᵉZᵉ) × a bronze female (ZᴱW). Sons are ZᴱZᵉ and bronze. Daughters are ZᵉW and brown.</p>
<p data-step="4">The reciprocal crosses give different results, so the gene is sex-linked. In birds, a daughter gets her only Z from her father, so she shows her father’s allele.</p>`,
star:'Birds: a daughter’s only Z comes from her father.',starStep:4,
scene(H){const s=$s();
  H.E('image',{href:'@@asset:c10-turkey.jpg@@',x:8,y:6,width:210,height:140},s);
  const K=H.g(s);H.txt(K,240,30,'ALLELES ON THE Z','cap',{st:'fill:var(--ink)'});tile(K,256,58,'Z','E',{fill:'hi',ink:'#16181d'});H.txt(K,280,63,'bronze (dominant)','lbs',{st:'font-weight:700'});
  tile(K,256,90,'Z','e',{});H.txt(K,280,95,'brown (recessive)','lbs',{st:'font-weight:700'});
  const Cp=H.g(s);H.O(Cp,0,{d:0});H.txt(Cp,420,30,'COPIES','cap',{st:'fill:var(--ink)'});sexT(Cp,432,64,'m',{fs:18});tile(Cp,462,58,'Z','');tile(Cp,490,58,'Z','');H.txt(Cp,512,63,'male: 2','lbs',{st:'font-weight:700'});
  sexT(Cp,432,96,'f',{fs:18});tile(Cp,462,90,'Z','');tile(Cp,490,90,'W','');H.txt(Cp,512,95,'female: 1','lbs',{st:'font-weight:700'});
  H.E('line',{x1:20,y1:162,x2:620,y2:162,st:'stroke:var(--faint);stroke-width:1.5'},s);
  const Z=(p,x,y,a,edge)=>a==='W'?tile(p,x,y,'W','',{edge}):tile(p,x,y,'Z',a,{fill:a==='E'?'hi':'card',ink:'#16181d',edge});
  const crossG=(x0,title,dad,mom,kids)=>{const G=H.g(s);H.O(G,0,{d:0});H.txt(G,x0+140,186,title,'cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
    sexT(G,x0+44,226,'m',{fs:18});Z(G,x0+74,220,dad[0]);Z(G,x0+108,220,dad[1]);H.txt(G,x0+140,226,'×','lb',{'text-anchor':'middle',st:'font-size:18px'});
    sexT(G,x0+176,226,'f',{fs:18});Z(G,x0+206,220,mom[0]);Z(G,x0+240,220,mom[1]);
    H.txt(G,x0+91,250,dad[2],'lbs',{'text-anchor':'middle',st:'font-weight:700'});H.txt(G,x0+223,250,mom[2],'lbs',{'text-anchor':'middle',st:'font-weight:700'});
    const kidsG=kids.map(([sex,a,b,ph],i)=>{const K2=H.g(G);const x=x0+70+i*140,y=320;sexT(K2,x-44,y+6,sex,{fs:18});
      const ta=from(Z(K2,x-12,y,a,'dad'),(x0+74)-(x-12),220-y),tb=from(Z(K2,x+22,y,b,'mom'),(x0+(b==='W'?240:206))-(x+22),220-y);
      const L=H.txt(K2,x+5,y+34,ph,'lb',{'text-anchor':'middle',st:'fill:var(--ink)'});H.O(L,0,{d:0});K2.ta=ta;K2.tb=tb;K2.L=L;return K2});
    H.txt(G,x0+70,292,'sons','lbs',{'text-anchor':'middle'});H.txt(G,x0+210,292,'daughters','lbs',{'text-anchor':'middle'});
    G.kids=kidsG;return G};
  const C1=crossG(10,'CROSS 1',['E','E','bronze'],['e','W','brown'],[['m','E','e','bronze'],['f','E','W','bronze']]);
  const C2=crossG(330,'CROSS 2 · RECIPROCAL',['e','e','brown'],['E','W','bronze'],[['m','e','E','bronze'],['f','e','W','brown']]);
  H.E('line',{x1:320,y1:176,x2:320,y2:380,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  const ring=H.E('rect',{x:484,y:296,width:130,height:72,rx:12,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5'},s);
  const end=H.txt(s,320,404,'different results → the E gene is on the Z','lb',{'text-anchor':'middle',st:'font-size:15px'});H.O(end,0,{d:0});
  const run=C=>{H.O(C,1,{d:500});C.kids.forEach((K2,i)=>{go(K2.ta,{at:500+i*400});go(K2.tb,{at:700+i*400});H.O(K2.L,1,{at:1600})})};
  return [()=>{},()=>{H.O(Cp,1,{d:600})},()=>run(C1),()=>run(C2),()=>{H.D(ring,1,{d:800});H.O(end,1,{at:500})}];}},

/* 23 ─────────────────────────────── */
{title:'A Map of the Human Y',caption:'Schematic, not to scale · AZF = azoospermia factor',
text:`<p data-step="0">The human Y has about 60 million base pairs. The <b>centromere</b>, the narrow waist of the chromosome, divides it into a short arm and a long arm.</p>
<p data-step="1">PAR1 is at the tip of the short arm, and PAR2 is at the tip of the long arm. Together, the two PARs form about 5 in 100 base pairs of the Y.</p>
<p data-step="2"><i>SRY</i> is on the short arm, next to PAR1. Its protein, TDF, starts testis development.</p>
<p data-step="3">The long arm carries genes for sperm production in three <b>AZF regions</b> (azoospermia factor; azoospermia means no sperm). A man who lacks an AZF region makes few or no sperm.</p>
<p data-step="4">The part between the two PARs is the <b>male-specific region</b>. This region almost never crosses over with the X. Many of its genes sit in mirror-image pairs of copies, the <b>palindromes</b>. A damaged copy can copy the correct DNA back from its partner. The end of the long arm is a large block of repeated DNA with almost no genes.</p>`,
star:'Top to bottom: PAR1, SRY, centromere, AZF genes, repeats, PAR2.',starStep:4,
scene(H){const s=$s();const x=230,W=48,top=34,bot=392,cen=122;
  const C=H.g(s);
  H.E('path',{d:`M${x-W/2},${top+24} Q${x-W/2},${top} ${x},${top} Q${x+W/2},${top} ${x+W/2},${top+24} V${cen-8} Q${x+W/2},${cen} ${x+10},${cen} Q${x+W/2},${cen} ${x+W/2},${cen+8} V${bot-24} Q${x+W/2},${bot} ${x},${bot} Q${x-W/2},${bot} ${x-W/2},${bot-24} V${cen+8} Q${x-W/2},${cen} ${x-10},${cen} Q${x-W/2},${cen} ${x-W/2},${cen-8} Z`,pathLength:1,cls:'draw',st:'fill:var(--card);stroke:var(--ink);stroke-width:2.6'},C);
  const band=(y0,y1,fill,o)=>{o=o||{};const e=H.E('rect',{x:x-W/2+2,y:y0,width:W-4,height:y1-y0,rx:o.rx||2,st:`fill:${H.C(fill)};${o.st||''}`},s);H.O(e,0,{d:0});return e};
  const lab=(y,t,sub,c)=>{const G=H.g(s);H.E('line',{x1:x+W/2+4,y1:y,x2:x+W/2+40,y2:y,st:'stroke:var(--ink);stroke-width:1.3'},G);
    H.txt(G,x+W/2+46,y+(sub?-2:5),t,'lb',{st:c?`fill:${H.C(c)}`:''});if(sub)H.txt(G,x+W/2+46,y+15,sub,'lbs');H.O(G,0,{d:0});return G};
  const arms=H.g(s);H.O(arms,0,{d:0});[[top,cen-4,'short arm'],[cen+4,bot-30,'long arm']].forEach(([a,b,t])=>{H.E('path',{d:`M${x-W/2-10},${a+4} H${x-W/2-18} V${b-4} H${x-W/2-10}`,st:'fill:none;stroke:var(--ink);stroke-width:1.8'},arms);
    H.txt(arms,x-W/2-24,(a+b)/2+5,t,'lb',{'text-anchor':'end'})});
  const cl=lab(cen,'centromere','');const sz=H.txt(s,x,top-10+0,'','lbs');
  const p1=band(top+3,top+18,'hi',{rx:10}),p2=band(bot-18,bot-3,'hi',{rx:10});const lp1=lab(top+11,'PAR1','crosses over with the X'),lp2=lab(bot-11,'PAR2','pairs with the X more rarely');
  const sr=band(top+22,top+32,'good');const ls=lab(top+27,'SRY','makes TDF: starts the testis','good');ls.querySelector('text').setAttribute('y',top+58);ls.querySelectorAll('text')[1].setAttribute('y',top+75);ls.querySelector('line').setAttribute('y2',top+54);
  const az=[[150,168,'AZFa'],[196,222,'AZFb'],[214,246,'AZFc']].map(([a,b])=>band(a,b,'mom',{st:'fill-opacity:.75'}));const la=lab(198,'AZF regions','genes for sperm production','mom');
  const het=band(262,bot-22,'muted',{st:'fill-opacity:.45'});const lh=lab(318,'repeated DNA','almost no genes');
  const msy=H.g(s);H.O(msy,0,{d:0});H.E('path',{d:`M${x-W/2-100},${top+20} H${x-W/2-108} V${bot-20} H${x-W/2-100}`,st:'fill:none;stroke:var(--dad);stroke-width:3'},msy);
  H.txt(msy,x-W/2-114,250,'male-','lbs',{'text-anchor':'end',st:'font-weight:800;fill:var(--dad)'});H.txt(msy,x-W/2-114,266,'specific','lbs',{'text-anchor':'end',st:'font-weight:800;fill:var(--dad)'});H.txt(msy,x-W/2-114,282,'region','lbs',{'text-anchor':'end',st:'font-weight:800;fill:var(--dad)'});
  const pal=H.g(s);H.O(pal,0,{d:0});[[202,214],[226,240]].forEach(([a,b])=>{H.E('path',{d:`M${x+6},${a} q14,${(b-a)/2} 0,${b-a}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},pal)});
  const big=H.txt(s,600,40,'about 60 million base pairs','lb',{'text-anchor':'end',st:'font-size:16px'});H.O(big,0,{d:0});
  return [
    ()=>{H.D(C.firstChild,1,{d:1200});H.O(arms,1,{at:900});H.O(cl,1,{at:1100});H.O(big,1,{at:900})},
    ()=>{H.O([p1,p2],1);H.O([lp1,lp2],1,{at:300})},
    ()=>{H.O(sr,1);H.O(ls,1,{at:300})},
    ()=>{H.O(cl,0,{d:300});H.O(az,1);H.O(la,1,{at:300})},
    ()=>{H.O(het,1);H.O(lh,1,{at:300});H.O(msy,1,{at:600});H.O(pal,1,{at:900})},
  ];}},

/* 24 ─────────────────────────────── */
{title:'Y-Linked Traits',caption:'Filled = shows the trait · drawing: W. G. Tilesius (1802), public domain, Wikimedia Commons',
text:`<p data-step="0">A <b>Y-linked</b> gene is a gene in the male-specific region of the Y. Only males have a Y, so only males show Y-linked traits.</p>
<p data-step="1">A father gives his Y to every son. So a Y-linked trait passes from a father to all of his sons, in every generation. A daughter never gets the trait from her father.</p>
<p data-step="2">A male has one copy of each Y-linked gene. So the terms dominant and recessive do not apply to Y-linked traits. A male with 47,XYY (<b>XYY syndrome</b>) has two copies of each Y gene. The two copies are usually identical.</p>
<p data-step="3">Y-linked traits are rare. The clearest example is male infertility from an AZF deletion. Such men usually have few or no children. With <b>ICSI</b> (a laboratory method that injects one sperm cell into an egg cell), their sons inherit the deletion.</p>
<p data-step="4">Older reports called two traits Y-linked: webbed toes in one English family, and the scaly skin of the Lambert family. In 1957 Curt Stern checked both reports. In 1958 Lionel Penrose and Stern checked the Lambert records again. The records did not support Y linkage for either trait.</p>`,
star:'Y-linked: father to every son, and to every son’s son.',starStep:1,
scene(H){const s=$s();
  const lines=H.g(s);const st='fill:none;stroke:var(--ink);stroke-width:2';
  H.E('path',{d:'M94,70 H146 M120,70 V108 M50,108 H200 M50,108 V126 M120,108 V128 M200,108 V126 M214,140 H252 M233,140 V182 M190,182 H276 M190,182 V200 M276,182 V202',st},lines);
  const P=[['m',80,70,1],['f',160,70,0],['m',50,140,1],['f',120,140,0],['m',200,140,1],['f',266,140,0],['m',190,214,1],['f',276,214,0]];
  const ps=P.map(([sx,x,y,a])=>{const G=sym(s,x,y,sx,{r:13,fill:a?'ink':'card'});return G});
  H.txt(s,6,75,'I','lb',{st:'font:700 16px var(--f-math);font-style:italic'});H.txt(s,6,145,'II','lb',{st:'font:700 16px var(--f-math);font-style:italic'});H.txt(s,6,219,'III','lb',{st:'font:700 16px var(--f-math);font-style:italic'});
  const yt=[[80,70],[50,140],[200,140],[190,214]].map(([x,y],i)=>{const t=tile(s,x+22,y-24,'Y','',{edge:'dad',w:22,h:20,fs:12});if(i){from(t,80-x,70-y)}else H.O(t,0,{d:0});return t});
  const yt3=yt[3];H.T(yt3,{x:200-190,y:140-214},{d:0});
  const nd=H.txt(s,150,262,'daughters: no Y','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(nd,0,{d:0});
  const xyy=H.g(s);H.O(xyy,0,{d:0});H.txt(xyy,24,300,'47,XYY:','lb');tile(xyy,104,296,'X','');tile(xyy,132,296,'Y','');tile(xyy,160,296,'Y','');H.txt(xyy,180,301,'two copies of Y genes','lbs',{st:'font-weight:700'});
  const az=H.g(s);H.O(az,0,{d:0});H.txt(az,24,340,'AZF deletion:','lb');tile(az,136,336,'Y','',{edge:'dad'});cross(az,136,336,9,{w:3}).firstChild.style.strokeDashoffset=0;H.txt(az,156,341,'few or no sperm → few or no children','lbs',{st:'font-weight:700'});
  H.txt(az,156,359,'(sons inherit it through ICSI)','lbs');
  const im=H.g(s);H.O(im,0,{d:0});H.E('image',{href:'@@asset:c10-lambert.jpg@@',x:330,y:20,width:300,height:197},im);
  H.txt(im,480,236,'a Lambert, drawn in 1802','lbs',{'text-anchor':'middle',st:'font-weight:700'});
  const stamp=H.g(s);H.O(stamp,0,{d:0});H.E('rect',{x:352,y:256,width:256,height:58,rx:10,st:'fill:var(--card);stroke:var(--bad);stroke-width:3'},stamp);
  H.txt(stamp,480,281,'not shown to be Y-linked','lb',{'text-anchor':'middle',st:'fill:var(--bad)'});H.txt(stamp,480,302,'records re-checked, 1957–1958','lbs',{'text-anchor':'middle'});
  const wt=H.txt(s,480,342,'same result for webbed toes','lbs',{'text-anchor':'middle',st:'font-weight:700'});H.O(wt,0,{d:0});
  return [
    ()=>{H.O(yt[0],1)},
    ()=>{go(yt[1],{at:200});go(yt[2],{at:500});H.O(yt3,1,{d:250,at:800});H.T(yt3,{x:0,y:0},{d:1000,at:1300});H.O(nd,1,{at:1600})},
    ()=>{H.O(xyy,1)},
    ()=>{H.O(az,1)},
    ()=>{H.O(im,1,{d:700});H.O(stamp,1,{at:600});H.O(wt,1,{at:900})},
  ];}},

/* 25 ─────────────────────────────── */
{title:'The Shrinking Y',caption:'Curve is schematic · My = million years',
text:`<p data-step="0">Outside the PARs, the Y almost never crosses over. So it passes from father to son almost unchanged. A <b>Y lineage</b> is a line of fathers and sons that share one Y.</p>
<p data-step="1">Without crossing over, an intact copy from a partner chromosome cannot replace a damaged Y gene. Over about 180 million years, the Y lost most of the genes that it once shared with the X.</p>
<p data-step="2">If that average rate of loss continued, the human Y would disappear in about 10 million years. The geneticist Jennifer Graves made this prediction in 2002.</p>
<p data-step="3">A comparison with the Y of the rhesus monkey tested the prediction. The human and rhesus lines separated about 25 million years ago. Since then, the human Y has lost only one gene. Its palindromes help it to keep the genes that it still has.</p>
<p data-step="4">Some mole voles and spiny rats have no Y at all. Their males still develop, because other DNA changes replaced <i>SRY</i> as the switch for testis development.</p>`,
star:'The Y lost genes fast at first. For the last 25 million years, it has held steady.',starStep:3,
scene(H){const s=$s();
  const ch=H.g(s);H.txt(ch,20,30,'A Y LINEAGE','cap',{st:'fill:var(--ink)'});
  [60,170,280,390].forEach((x,i)=>{sym(ch,x,62,'m',{r:12});tile(ch,x+26,62,'Y','',{edge:'dad',w:20,h:18,fs:11});if(i)mkA(ch,x-74,62,x-18,62,{w:1.6,h:6}).querySelectorAll('path').forEach(e=>{e.style.opacity=1;e.style.strokeDashoffset=0})});
  H.txt(ch,470,67,'same Y, father to son','lbs',{st:'font-weight:700'});H.O(ch,0,{d:0});
  const X0=80,X1=560,Y0=120,Y1=350;const xt=t=>X0+(180-t)/180*(X1-X0);const yv=v=>Y1-v*(Y1-Y0);
  const ax=H.g(s);H.E('path',{d:`M${X0},${Y0-6} V${Y1} H${X1+50}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},ax);
  [180,120,60,25,0].forEach(t=>{H.E('line',{x1:xt(t),y1:Y1,x2:xt(t),y2:Y1+6,st:'stroke:var(--ink);stroke-width:1.5'},ax);H.txt(ax,xt(t),Y1+22,t?t+' My ago':'now','lbs',{'text-anchor':'middle'})});
  H.txt(ax,X0-10,Y0+4,'all','lbs',{'text-anchor':'end'});H.txt(ax,X0-10,Y1,'0','lbs',{'text-anchor':'end'});
  H.txt(ax,X0+6,Y0-14,'genes shared with the X still on the Y','lbs',{st:'font-weight:700'});H.O(ax,0,{d:0});
  const f=t=>{const u=(180-t)/155;return t>25?.04+.96*Math.exp(-3.1*u*u*1.15):.05};
  let d='';for(let t=180;t>=25;t-=2.5){d+=(d?' L':'M')+xt(t).toFixed(1)+','+yv(f(t)).toFixed(1)}
  const cur=H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:4;stroke-linecap:round'},s);
  const flat=H.E('path',{d:`M${xt(25)},${yv(f(25))} L${xt(0)},${yv(.05)}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--good);stroke-width:5;stroke-linecap:round'},s);
  const pred=H.E('path',{d:`M${xt(180)},${yv(1)} L${xt(-12)},${yv(0)}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--bad);stroke-width:2.2;stroke-dasharray:1'},s);
  const pl=H.g(s);H.txt(pl,xt(88),yv(.9),'prediction from the average rate:','lbs',{st:'font-weight:700;fill:var(--bad)'});H.txt(pl,xt(88),yv(.9)+16,'no Y in about 10 million years','lbs',{st:'font-weight:700;fill:var(--bad)'});H.O(pl,0,{d:0});
  const fl=H.g(s);H.txt(fl,xt(25)-4,yv(.05)-62,'rhesus comparison:','lbs',{st:'font-weight:700;fill:var(--good)'});H.txt(fl,xt(25)-4,yv(.05)-46,'1 gene lost in 25 My','lbs',{st:'font-weight:700;fill:var(--good)'});H.O(fl,0,{d:0});
  const ro=pill(s,330,404,'mole voles, spiny rats: no Y, still males',{w:290});H.O(ro,0,{d:0});
  return [
    ()=>{H.O(ch,1,{d:700})},
    ()=>{H.O(ax,1);H.D(cur,1,{d:1800,at:300})},
    ()=>{H.D(pred,1,{d:1200});H.O(pl,1,{at:900})},
    ()=>{H.D(flat,1,{d:900});H.O(fl,1,{at:600})},
    ()=>{H.O(ro,1)},
  ];}},

/* 26 ─────────────────────────────── */
{title:'Four Kinds of Gene Location',wide:true,steps:3,
text:`<div class="tblwrap" data-step="0"><table class="tbl">
<thead><tr><th>In mammals (XX/XY)</th><th>Autosomal gene</th><th>X-linked gene</th><th>Y-linked gene</th><th>PAR gene</th></tr></thead>
<tbody>
<tr><td>Copies in a female</td><td>2</td><td>2</td><td>0</td><td>2</td></tr>
<tr><td>Copies in a male</td><td>2</td><td>1 (hemizygous)</td><td>1</td><td>2 (one on the X, one on the Y)</td></tr>
</tbody><tbody data-step="1">
<tr><td>A father’s allele passes to</td><td>1/2 of his sons and 1/2 of his daughters</td><td>all of his daughters, none of his sons</td><td>all of his sons, none of his daughters</td><td>near the tip: about 1/2 of sons and 1/2 of daughters</td></tr>
<tr><td>A mother’s allele passes to</td><td>1/2 of her sons and 1/2 of her daughters</td><td>1/2 of her sons and 1/2 of her daughters</td><td>(no Y)</td><td>1/2 of her sons and 1/2 of her daughters</td></tr>
<tr><td>Reciprocal crosses</td><td>same results</td><td>different results</td><td>trait only in males</td><td>about the same results</td></tr>
</tbody><tbody data-step="2">
<tr><td>Dominant and recessive</td><td>apply</td><td>apply in females; one copy decides in males</td><td>do not apply</td><td>apply</td></tr>
<tr><td>Examples</td><td><i>ABO</i> (the A, B and O blood groups)</td><td><i>white</i> in flies, cat orange, <i>F8</i> (a blood-clotting factor; broken in the bleeding disease hemophilia A)</td><td><i>SRY</i>, AZF genes</td><td><i>SHOX</i></td></tr>
</tbody></table></div>
<p class="note" data-step="2">In birds (ZZ/ZW), Z-linked genes follow the X-linked rules with the sexes swapped. A mother’s Z passes to all of her sons. A father passes one of his two Z chromosomes to every child.</p>`,
star:'Count the copies in each sex, then follow the chromosome.',starStep:2},

/* 27 ─────────────────────────────── */
{title:'Summary',wide:true,steps:3,
text:`<div class="cols"><div data-step="0"><h3>Chromosomes</h3><ul>
<li>Autosomes are present in the same number in both sexes. Sex chromosomes differ between the sexes.</li>
<li>Mammals and fruit flies use XX females and XY males. Birds, moths and butterflies use ZZ males and ZW females.</li>
<li>The homogametic sex (XX or ZZ) makes one kind of gamete. The heterogametic sex (XY or ZW) makes two kinds in equal numbers and decides the sex of the offspring.</li>
<li>In humans, the Y gene <i>SRY</i> starts testis development. Flies count X chromosomes, and birds count Z chromosomes.</li>
</ul></div><div data-step="1"><h3>X and Y</h3><ul>
<li>The X and the Y are heteromorphic. The X carries about 800 protein-coding genes, and the Y fewer than 100.</li>
<li>The pseudo-autosomal regions at the tips of the X and the Y pair and cross over in male meiosis. Their genes follow autosomal rules.</li>
<li>Dosage compensation makes the dose of X genes equal in the two sexes. In mammals, X-inactivation silences one X in each female cell.</li>
</ul></div><div data-step="2"><h3>Sex linkage</h3><ul>
<li>Sex-linked genes break one of Mendel’s expectations: the result depends on which parent carries the allele.</li>
<li>Reciprocal crosses test for sex linkage. Morgan used them to place <i>white</i> on the X of <i>Drosophila</i>.</li>
<li>Three sex-linked genes: <i>white</i> on the fly X, <i>SRY</i> (TDF) on the human Y, and the turkey feather gene E on the Z.</li>
<li>Y-linked traits pass from father to every son. Proven examples are few.</li>
</ul></div></div>`,
star:'Find the chromosome, count the copies, follow the parents.',starStep:2},

/* 28 ─────────────────────────────── */
{title:'Key Terms',wide:true,steps:1,
text:`<div class="terms" data-step="0">
<div class="term"><b>Karyotype</b>A picture of all the chromosomes of one cell, sorted into pairs by size.</div>
<div class="term"><b>Autosome</b>A chromosome that males and females have in the same number. Humans have 22 pairs.</div>
<div class="term"><b>Sex chromosome</b>A chromosome that differs between the sexes, for example X, Y, Z or W.</div>
<div class="term"><b>Homogametic</b>The sex with two sex chromosomes of the same kind (XX or ZZ). All its gametes carry the same sex chromosome.</div>
<div class="term"><b>Heterogametic</b>The sex with two different sex chromosomes (XY or ZW). Half its gametes carry each one.</div>
<div class="term"><b>Heteromorphic</b>Different in size and shape, as the X and the Y are.</div>
<div class="term"><b>Pseudo-autosomal regions</b>The shared tips of the X and the Y (PAR1, PAR2). They pair and cross over, so their genes follow autosomal rules.</div>
<div class="term"><b>Sex-linked</b>On a sex chromosome. A sex-linked gene can give different results in sons and daughters.</div>
<div class="term"><b>X-linked genes</b>Genes on the X. A female has two copies, and a male has one.</div>
<div class="term"><b>Reciprocal cross</b>A pair of crosses in which the two parental phenotypes swap sexes. Different results show sex linkage.</div>
<div class="term"><b>Hemizygous</b>With one copy of a gene, as a male is for most X genes.</div>
<div class="term"><b>Y-linked</b>In the male-specific region of the Y. Passes from father to every son.</div>
<div class="term"><b>SRY (TDF)</b>The Y gene that starts testis development. Its protein is the testis-determining factor.</div>
<div class="term"><b>Dosage compensation</b>A system that makes the dose of X genes equal in the two sexes.</div>
<div class="term"><b>X-inactivation</b>Each cell of a female mammal silences one X at random. The silenced X forms the Barr body.</div>
<div class="term"><b>Mosaic</b>A body with patches of cells that differ, for example in which X is active.</div>
<div class="term"><b>Criss-cross inheritance</b>A trait passes from mother to son and from father to daughter.</div>
<div class="term"><b>Aneuploidy</b>One chromosome too many or too few, for example 45,X or 47,XXY.</div>
</div>`},

/* 29 ─────────────────────────────── */
{title:'Check Your Understanding: 1 and 2',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">1. A rare dominant mutation causes a nerve disease that appears late in life in every person who carries it. A father has the disease. What is the probability that his daughter also gets the disease?</div><button>Show answer</button><div class="a" hidden>It depends on the chromosome that carries the gene.<br><b>Autosome:</b> the mutation is rare, so the father is almost surely heterozygous. He gives the mutant allele to each child with a probability of 1/2. The probability for the daughter is 1/2 (50%).<br><b>X:</b> the father has one X, and it carries the mutation. He gives his X to every daughter. The probability is 1 (100%).<br><b>Y:</b> a daughter never gets her father’s Y. The probability is 0.<br><b>Penetrance</b> is the percentage of carriers who show the disease. If penetrance is below 100%, multiply each value by the penetrance. Each value above 0 is then lower.</div></div>
<div class="qa"><div class="q">2. Draw Punnett squares for the F1 and the F2 of cross A and of cross B. Cross A is an X⁺X⁺ female × an XʷY male. Cross B is an XʷXʷ female × an X⁺Y male.</div><button>Show answer</button><div class="a" hidden>A <b>Punnett square</b> is a grid of every egg–sperm combination. Rows = eggs, columns = sperm.
<table class="tbl" style="margin:6px 0"><tr><th>Cross A, F1</th><th>Xʷ</th><th>Y</th></tr><tr><td>X⁺</td><td>X⁺Xʷ red female</td><td>X⁺Y red male</td></tr></table>
<table class="tbl" style="margin:6px 0"><tr><th>Cross A, F2</th><th>X⁺</th><th>Y</th></tr><tr><td>X⁺</td><td>X⁺X⁺ red female</td><td>X⁺Y red male</td></tr><tr><td>Xʷ</td><td>X⁺Xʷ red female</td><td>XʷY white male</td></tr></table>
<table class="tbl" style="margin:6px 0"><tr><th>Cross B, F1</th><th>X⁺</th><th>Y</th></tr><tr><td>Xʷ</td><td>X⁺Xʷ red female</td><td>XʷY white male</td></tr></table>
<table class="tbl" style="margin:6px 0"><tr><th>Cross B, F2</th><th>Xʷ</th><th>Y</th></tr><tr><td>X⁺</td><td>X⁺Xʷ red female</td><td>X⁺Y red male</td></tr><tr><td>Xʷ</td><td>XʷXʷ white female</td><td>XʷY white male</td></tr></table>
Cross A: F1 all red; F2 3 red : 1 white, and only males are white. Cross B: F1 red daughters and white sons; F2 1 red : 1 white in each sex.</div></div>
</div>`},

/* 30 ─────────────────────────────── */
{title:'Check Your Understanding: 3',wide:true,steps:1,
text:`<div class="qa" data-step="0"><div class="q">3. In the turkey, the dominant allele E (bronze feathers) and the recessive allele e (brown feathers) are on the Z. Draw reciprocal crosses that show that the E gene is on the Z.</div><button>Show answer</button><div class="a" hidden>Use pure-breeding birds. A male has two Z chromosomes. A female has one Z and one W.
<table class="tbl" style="margin:6px 0"><tr><th>Cross</th><th>Parents</th><th>Gametes</th><th>Sons</th><th>Daughters</th></tr>
<tr><td>1</td><td>bronze male ZᴱZᴱ × brown female ZᵉW</td><td>sperm: all Zᴱ · eggs: Zᵉ or W</td><td>ZᴱZᵉ, bronze</td><td>ZᴱW, bronze</td></tr>
<tr><td>2 (reciprocal)</td><td>brown male ZᵉZᵉ × bronze female ZᴱW</td><td>sperm: all Zᵉ · eggs: Zᴱ or W</td><td>ZᴱZᵉ, bronze</td><td>ZᵉW, brown</td></tr></table>
The two crosses give different results, and in cross 2 the daughters show their father’s allele. If the gene were on an autosome, both crosses would give only bronze offspring of both sexes. So the gene is on the Z.</div></div>`},

/* 31 ─────────────────────────────── */
{title:'Check Your Understanding: 4 and 5',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">4. The Y has lost most of its genes during evolution. Will the human Y disappear? What would happen to males?</div><button>Show answer</button><div class="a" hidden>Outside the PARs, the Y almost never crosses over, so it cannot replace damaged genes. Over about 180 million years, it lost most of its genes. At that average rate, it would disappear in about 10 million years, as Jennifer Graves predicted in 2002. But the rhesus monkey Y shows a different rate: the human Y lost only one gene in 25 million years. Its palindromes let one gene copy repair the other, so the Y now looks stable. Males can also develop without a Y. Some mole voles and spiny rats have no Y, and other DNA changes replaced <i>SRY</i> as their testis switch.</div></div>
<div class="qa"><div class="q">5. Some sports bodies test female athletes for <i>SRY</i>. The IOC used such a test from 1992 to 1999. World Athletics brought one back in 2025, and the IOC did the same in 2026. What does the test detect? Use crossing over in meiosis to explain why its result can mislead.</div><button>Show answer</button><div class="a" hidden>The test detects the DNA of <i>SRY</i> in a sample of cells. The test does not show how a body developed. Three cases show the limits.<br><b>SRY moved.</b> In a father’s meiosis, a rare crossover slightly past the PAR1 boundary moves <i>SRY</i> to the X. A child with that X is XX but develops as a male, and the test gives a male result. A child with the partner Y is XY but has no <i>SRY</i>. This child develops as a female, and the test gives a female result.<br><b>SRY broken.</b> Some XY people have an <i>SRY</i> with a DNA change that stops the protein. Their gonads do not become testes, and they develop as female. The test can still find the gene and give a male result.<br><b>Complete androgen insensitivity.</b> Some XY people have a functional <i>SRY</i> and testes. Their cells cannot respond to testosterone, the main male hormone. Their bodies develop as female, and the test gives a male result.</div></div>
</div>`},

]});
})();
