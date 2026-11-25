/* Chapter 13 · Genes and COVID-19 Susceptibility in Humans
   source: Singh, Introduction to Genetics (LibreTexts), CC BY-NC-SA 4.0 */
(function(){
const H=window.HL;
const stage=()=>document.getElementById('stage');

/* ---- deck-local helpers ---- */
function drawA(a,o){H.D(a.firstChild,1,Object.assign({d:600},o));H.O(a.lastChild,1,Object.assign({d:200},o,{at:((o&&o.at)||0)+450}));}
function mkA(p,x1,y1,x2,y2,o){const a=H.arrow(p,x1,y1,x2,y2,o);H.O(a.lastChild,0,{d:0});return a;}
function pop(e,o){H.T(e,{s:1},Object.assign({d:700},o));H.O(e,1,Object.assign({d:300},o));}
function hide(e){H.T(e,{s:.001},{d:0});H.O(e,0,{d:0});}
function at(p,x,y,s){const G=H.g(p);H.T(G,{x,y,s:s==null?1:s},{d:0});return G;}
/* text with ^x superscripts and _x subscripts */
function rt(p,x,y,s,cls,a){const t=H.E('text',Object.assign({x,y,cls:cls||'lb'},a||{}),p);
  s.split(/(\^\{[^}]*\}|\^.|_\{[^}]*\}|_.)/).forEach(part=>{if(!part)return;
    if(part[0]==='^'||part[0]==='_'){const v=part[1]==='{'?part.slice(2,-1):part.slice(1);
      H.E('tspan',{'baseline-shift':part[0]==='^'?'super':'sub',st:'font-size:.68em',text:v},t);}
    else H.E('tspan',{text:part},t);});return t;}
/* rounded photo with border */
let CLIPN=0;
function photo(p,href,x,y,w,h,o){o=o||{};const id='c13clp'+(++CLIPN);const G=H.g(p);
  const cp=H.E('clipPath',{id},G);H.E('rect',{x,y,width:w,height:h,rx:o.r!=null?o.r:10},cp);
  H.E('image',{href,x,y,width:w,height:h,preserveAspectRatio:o.fit||'xMidYMid slice','clip-path':`url(#${id})`},G);
  H.E('rect',{x,y,width:w,height:h,rx:o.r!=null?o.r:10,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},G);return G;}
/* label with a leader line, hidden until shown */
function leader(p,x,y,tx,ty,text,anchor,col){const G=H.g(p);
  H.E('path',{d:`M${x},${y} L${tx},${ty}`,pathLength:1,cls:'draw k',st:`stroke-width:1.3;stroke:${col||'var(--ink)'}`},G);
  H.txt(G,tx+(anchor==='end'?-6:6),ty+5,text,'lb',{'text-anchor':anchor||'start'});H.O(G,0,{d:0});return G;}
const show=G=>{H.O(G,1);H.D(G.firstChild,1,{d:600});};
/* a virus particle: envelope, spikes, RNA coil */
function virion(p,x,y,r,o){o=o||{};const G=at(p,x,y,o.s==null?1:o.s);const n=o.n||14;
  G.env=H.E('circle',{r,st:'fill:color-mix(in srgb, var(--bad) 14%, var(--card));stroke:var(--ink);stroke-width:2.2'},G);
  G.rna=H.E('path',{d:coil(r*0.62),pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:2.4;stroke-linecap:round'},G);
  G.mp=[];for(let i=0;i<n;i+=2){const a=(i+1)*2*Math.PI/n;
    G.mp.push(H.E('rect',{x:r*Math.cos(a)-3,y:r*Math.sin(a)-3,width:6,height:6,rx:1.5,st:'fill:var(--muted)'},G));}
  G.sp=[];for(let i=0;i<n;i++){const a=i*2*Math.PI/n;const S=H.g(G);
    H.E('line',{x1:r*Math.cos(a),y1:r*Math.sin(a),x2:(r+8)*Math.cos(a),y2:(r+8)*Math.sin(a),st:'stroke:var(--bad);stroke-width:2.6;stroke-linecap:round'},S);
    H.E('circle',{cx:(r+11)*Math.cos(a),cy:(r+11)*Math.sin(a),r:3.6,st:'fill:var(--bad);stroke:var(--ink);stroke-width:1'},S);
    G.sp.push(S);}
  return G;}
function coil(r){let d='';const n=22;for(let i=0;i<=n;i++){const t=i/n*Math.PI*4.4;const rr=r*(0.35+0.5*i/n);
  const x=rr*Math.cos(t),y=rr*0.72*Math.sin(t);d+=(i?' L':'M')+x.toFixed(1)+','+y.toFixed(1);}return d;}
/* a piece of cell membrane: two lines with a tinted band between them */
function membrane(p,x0,x1,y,o){o=o||{};const G=H.g(p);const t=o.t||11;
  H.E('rect',{x:x0,y:y,width:x1-x0,height:t,st:'fill:var(--wash)'},G);
  H.E('line',{x1:x0,y1:y,x2:x1,y2:y,st:'stroke:var(--ink);stroke-width:2'},G);
  H.E('line',{x1:x0,y1:y+t,x2:x1,y2:y+t,st:'stroke:var(--ink);stroke-width:2'},G);
  for(let x=x0+6;x<x1;x+=12){H.E('circle',{cx:x,cy:y+t/2,r:2,st:'fill:var(--faint)'},G);}
  return G;}
/* ACE2 receptor glyph standing on a membrane at x, membrane top y */
function ace2(p,x,y,o){o=o||{};const G=at(p,x,y);
  H.E('rect',{x:-5,y:0,width:10,height:18,rx:3,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.6'},G);
  G.head=H.E('path',{d:'M-13,0 A13,13 0 0 1 13,0 Z',st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.8'},G);
  H.T(G,{x,y:y-0},{d:0});return G;}
/* one spike protein: S2 stalk + S1 head with the receptor-binding domain */
/* a bar that grows from its left edge: rect lives at 0,0 and is placed by translate */
function gbar(p,x,y,h,col,o){o=o||{};const r=H.E('rect',{x:0,y:0,width:1,height:h,rx:o.rx||0,cls:'nss',st:`fill:${col}`},p);
  H.T(r,{x,y,sx:.001,sy:1},{d:0});r.gx=x;r.gy=y;return r;}
const grow=(r,w,o)=>H.T(r,{x:r.gx,y:r.gy,sx:Math.max(.001,w),sy:1},Object.assign({d:900},o));
/* a bar that grows upward from a baseline */
function vbar(p,x,y,w,col,o){o=o||{};const r=H.E('rect',{x:0,y:-1,width:w,height:1,cls:'nss',st:`fill:${col}`},p);
  H.T(r,{x,y,sx:1,sy:.001},{d:0});r.gx=x;r.gy=y;return r;}
const growV=(r,h,o)=>H.T(r,{x:r.gx,y:r.gy,sx:1,sy:Math.max(.001,h)},Object.assign({d:900},o));
function spike(p,x,y,o){o=o||{};const G=at(p,x,y,o.s==null?1:o.s);
  G.s2=H.E('rect',{x:-6,y:-26,width:12,height:28,rx:4,st:'fill:color-mix(in srgb, var(--bad) 45%, var(--card));stroke:var(--ink);stroke-width:1.6'},G);
  G.s1=H.E('path',{d:'M-15,-26 A15,15 0 0 1 15,-26 Z',st:'fill:var(--bad);stroke:var(--ink);stroke-width:1.8'},G);
  G.rbd=H.E('circle',{cx:0,cy:-36,r:6,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.6'},G);
  return G;}

deck({
docTitle:'Genes and COVID-19 · Heredity Ch.13',
title:'Genes and COVID-19 Susceptibility in Humans',
chapter:13,
eyebrow:'Heredity · Chapter 13 · Genes and COVID-19',
slides:[

/* 1 ─────────────────────────────── */
{sec:'13.1',title:'Two Genomes Meet',caption:'Red = virus · blue = human DNA · yellow = the ACE2 protein on the cell surface',
text:`<p data-step="0"><b>COVID-19</b> is an illness of the airways. A virus causes it: <b>SARS-CoV-2</b>. The virus keeps its genes in RNA, not in DNA.</p>
<p data-step="1">Your cells keep your genes in DNA. The human genome is about 3000 million DNA letters long. It holds about 20 000 <b>protein-coding genes</b>, the genes that a cell reads to make proteins.</p>
<p data-step="2">Infection starts when one virus protein touches one human protein. The virus <b>spike protein</b> binds the human <b>ACE2</b> protein. A gene in the virus genome makes the spike. A gene in your genome makes ACE2.</p>
<p data-step="3">Most people who catch this virus have a mild illness. A small number become severely ill. Age, other illnesses and DNA differences all change that chance.</p>`,
star:'The illness depends on two genomes: the virus genome and yours.',starStep:3,
scene(H){const s=stage();
  const V=virion(s,120,200,36,{n:14});hide(V);
  const CL=at(s,470,210);
  H.E('circle',{r:96,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},CL);
  H.E('circle',{r:44,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5;stroke-dasharray:5 4'},CL);
  [[-14,'dad',26],[2,'mom',20],[16,'dad',14]].forEach(([dx,c,L])=>H.E('line',{x1:dx,y1:-L/2,x2:dx,y2:L/2,st:`stroke:${H.C(c)};stroke-width:5;stroke-linecap:round`},CL));
  hide(CL);
  const R=ace2(s,374,196);H.T(R,{r:-90},{d:0});hide(R);
  const vl1=H.txt(s,120,96,'SARS-CoV-2','lb',{'text-anchor':'middle'}),vl2=H.txt(s,120,116,'genome: about 30 000 RNA letters','lbs',{'text-anchor':'middle'});
  const cl1=H.txt(s,470,96,'human cell','lb',{'text-anchor':'middle'}),cl2=H.txt(s,470,116,'genome: about 3000 million DNA letters','lbs',{'text-anchor':'middle'});
  H.O([vl1,vl2,cl1,cl2],0,{d:0});
  const fit=H.txt(s,300,370,'spike protein + ACE2 protein','lb',{'text-anchor':'middle'});H.O(fit,0,{d:0});
  const out=H.g(s);const ob=[['most people: mild illness',324,'good'],['some people: severe illness',362,'bad']].map(([t,y,c])=>{
    const g=H.g(out);H.E('circle',{cx:382,cy:y-4,r:5,st:`fill:var(--${c})`},g);H.txt(g,396,y,t,'lb',{st:'font-size:13px'});return g});
  H.O(out,0,{d:0});
  return [
    ()=>{pop(V);H.D(V.rna,1,{d:1200,at:300});H.O([vl1,vl2],1,{at:400})},
    ()=>{pop(CL);H.O([cl1,cl2],1,{at:400})},
    ()=>{pop(R);H.T(V,{x:330,y:196},{d:1400,at:300});H.O(fit,1,{at:1400});H.T(V.sp[7],{s:1.25},{d:600,at:1400})},
    ()=>{H.O(fit,0,{d:300});H.O(out,1,{at:300});ob.forEach((g,i)=>H.O(g,1,{at:300+i*350}))},
  ];}},

/* 2 ─────────────────────────────── */
{sec:'13.1',title:'What a Coronavirus Is',caption:'Schematic particle · about 100 nanometres wide (one nanometre = one millionth of a millimetre)',
text:`<p data-step="0">A <b>coronavirus</b> is a virus with an RNA genome and a crown of spikes. The Latin word <i>corona</i> means crown. Coronaviruses infect mammals and birds. Some cause a common cold. Three cause severe lung illness: SARS, MERS and COVID-19.</p>
<p data-step="1">The genome is one long RNA strand. The <b>nucleocapsid protein (N)</b> binds this RNA and folds it into a tight coil.</p>
<p data-step="2">A fatty <b>envelope</b> surrounds the coil. The envelope is a piece of the membrane of the cell that made the particle. The <b>membrane protein (M)</b> sits in it and gives the particle its shape.</p>
<p data-step="3">The <b>envelope protein (E)</b> is small and helps the particle form and leave the cell.</p>
<p data-step="4">The <b>spike protein (S)</b> projects from the envelope. Each spike is three copies of the S protein joined together. The spikes make the crown, and they start every infection.</p>`,
star:'N holds the RNA. M and E build the shell. S opens the door.',starStep:4,
scene(H){const s=stage();const CX=250,CY=212,R=104;
  const V=at(s,CX,CY);
  const rna=H.E('path',{d:coil(74),pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:3;stroke-linecap:round'},V);
  const nb=[];for(let k=0;k<9;k++){const i=1.5+k*2.3,n=22;const t=i/n*Math.PI*4.4,rad=74*(0.35+0.5*i/n);
    nb.push(H.E('circle',{cx:rad*Math.cos(t),cy:rad*0.72*Math.sin(t),r:6,st:'fill:var(--mom);stroke:var(--ink);stroke-width:1.2'},V));}
  nb.forEach(e=>H.O(e,0,{d:0}));
  const env=H.E('circle',{r:R,st:'fill:none;stroke:var(--ink);stroke-width:3',pathLength:1,cls:'draw'},V);
  const envf=H.E('circle',{r:R,st:'fill:color-mix(in srgb, var(--bad) 10%, var(--card))'},V);
  V.insertBefore(envf,V.firstChild);H.O(envf,0,{d:0});
  const mp=[],ep=[],sp=[];
  for(let i=0;i<16;i++){const a=(i+0.5)*2*Math.PI/16;
    mp.push(H.E('rect',{x:R*Math.cos(a)-4,y:R*Math.sin(a)-4,width:8,height:8,rx:2,st:'fill:var(--muted);stroke:var(--ink);stroke-width:1'},V));}
  for(let i=0;i<5;i++){const a=(i+0.25)*2*Math.PI/5;
    ep.push(H.E('circle',{cx:R*Math.cos(a),cy:R*Math.sin(a),r:5,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.2'},V));}
  for(let i=0;i<16;i++){const a=i*2*Math.PI/16;const G=H.g(V);
    H.E('line',{x1:R*Math.cos(a),y1:R*Math.sin(a),x2:(R+16)*Math.cos(a),y2:(R+16)*Math.sin(a),st:'stroke:var(--bad);stroke-width:3.4;stroke-linecap:round'},G);
    H.E('circle',{cx:(R+22)*Math.cos(a),cy:(R+22)*Math.sin(a),r:6.5,st:'fill:var(--bad);stroke:var(--ink);stroke-width:1.2'},G);
    hide(G);G.style.transformOrigin=`${R*Math.cos(a)}px ${R*Math.sin(a)}px`;sp.push(G);}
  [...mp,...ep].forEach(e=>H.O(e,0,{d:0}));H.O(env,0,{d:0});
  const key=[['RNA genome','dad',70],['N · nucleocapsid protein','mom',96],['M · membrane protein','muted',122],['E · envelope protein','good',148],['S · spike protein','bad',174]].map(([t,c,y])=>{
    const G=H.g(s);H.E('rect',{x:420,y:y-10,width:13,height:13,rx:3,st:`fill:${H.C(c)};stroke:var(--ink);stroke-width:1.2`},G);
    H.txt(G,440,y,t,'lb',{st:'font-size:13px'});H.O(G,0,{d:0});return G});
  const sz=H.g(s);H.E('path',{d:'M420,260 L620,260 M420,254 L420,266 M620,254 L620,266',st:'stroke:var(--ink);stroke-width:1.6'},sz);
  H.txt(sz,520,282,'about 100 nanometres','lbs',{'text-anchor':'middle'});
  H.txt(sz,520,302,'about 700 in a row would','lbs',{'text-anchor':'middle'});
  H.txt(sz,520,318,'cross one human hair','lbs',{'text-anchor':'middle'});H.O(sz,0,{d:0});
  const crown=H.txt(s,CX,54,'','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  return [
    ()=>{H.D(rna,1,{d:1400});H.O(key[0],1,{at:800})},
    ()=>{nb.forEach((e,i)=>H.O(e,1,{d:300,at:i*110}));H.O(key[1],1,{at:600})},
    ()=>{H.O(env,1,{d:0});H.D(env,1,{d:1200});H.O(envf,.9,{d:900,at:400});mp.forEach((e,i)=>H.O(e,1,{d:300,at:600+i*50}));H.O(key[2],1,{at:900})},
    ()=>{ep.forEach((e,i)=>H.O(e,1,{d:300,at:i*120}));H.O(key[3],1,{at:400})},
    ()=>{sp.forEach((g,i)=>pop(g,{at:i*70}));H.O(key[4],1,{at:600});H.O(sz,1,{at:1000});crown.textContent='CORONA = CROWN'},
  ];}},

/* 3 ─────────────────────────────── */
{sec:'13.1',title:'Real Virus Particles',caption:'Transmission electron micrograph of a laboratory-grown cell, colour added · NIAID, CC BY 2.0, via Wikimedia Commons',
text:`<p data-step="0">An electron microscope made this image. It sends electrons through a thin slice of an infected cell. So it shows objects far smaller than light shows.</p>
<p data-step="1">Each round red object is one virus particle. Each one is about 100 <b>nanometres</b> (nm) wide. One nanometre is one millionth of a millimetre.</p>
<p data-step="2">The grey material is the inside of a cell grown in a laboratory. Scientists infected it with virus taken from a patient. Groups of particles sit in vesicles, the small bubbles that the cell uses to move cargo.</p>
<p data-step="3">The microscope records grey values only. The team then added the red colour to the particles.</p>`,
star:'Round, about 100 nm, in bubbles inside a cell.',starStep:2,
scene(H){const s=stage();const X=150,Y=6,W=404,HT=404;
  photo(s,'@@asset:c13-sars-cov2-tem.jpg@@',X,Y,W,HT,{r:12});
  const mark=(cx,cy,rx,ry,label,lx,ly,anchor)=>{const G=H.g(s);
    H.E('ellipse',{cx,cy,rx,ry,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5'},G);
    const tw=label.length*7.1+16;const bx=anchor==='end'?lx-tw:lx;
    H.E('path',{d:`M${anchor==='end'?lx+4:lx-4},${ly-4} L${cx+(anchor==='end'?rx:-rx)},${cy}`,st:'stroke:var(--hi);stroke-width:2'},G);
    H.E('rect',{x:bx,y:ly-17,width:tw,height:25,rx:6,st:'fill:#16181d;opacity:.92'},G);
    H.txt(G,bx+8,ly,label,'lb',{st:'fill:#fff;font-size:12.5px'});H.O(G,0,{d:0});return G};
  const P1=mark(X+252,Y+244,24,24,'one virus particle',142,226,'end');
  const P2=mark(X+120,Y+330,66,46,'in a vesicle',142,352,'end');
  const P3=mark(X+300,Y+100,54,40,'lab-grown cell',142,96,'end');
  const sx0=X+W-120;const sc=H.g(s);H.E('path',{d:`M${sx0},${Y+386} L${sx0+96},${Y+386} M${sx0},${Y+380} L${sx0},${Y+392} M${sx0+96},${Y+380} L${sx0+96},${Y+392}`,st:'stroke:#fff;stroke-width:2.5'},sc);
  H.txt(sc,sx0+48,Y+376,'about 400 nm','lbs',{'text-anchor':'middle',st:'fill:#fff;font-weight:700'});H.O(sc,0,{d:0});
  return [()=>{},()=>{show(P1);H.O(sc,1,{at:600})},()=>{show(P2)},()=>{show(P3)}];}},

/* 4 ─────────────────────────────── */
{sec:'13.1 · 13.4',title:'The Virus Genome Is One Message',caption:'Gene positions follow the published SARS-CoV-2 reference sequence · ORF = open reading frame',
text:`<p data-step="0">The whole genome of SARS-CoV-2 is one RNA strand of 29 903 letters. Scientists in China read it in January 2020 and published the sequence for everyone.</p>
<p data-step="1">The first two thirds are two long genes, <b>ORF1a</b> and <b>ORF1b</b>. An open reading frame (ORF) is a stretch that a cell can read as protein. These two make 16 <b>non-structural proteins</b>: the tools that copy the RNA and separate the new proteins.</p>
<p data-step="2">Then come the four structural genes, S, E, M and N. They make the four parts of the particle.</p>
<p data-step="3">Between them sit small <b>accessory genes</b>. Each type of coronavirus has its own set. They act on the infected cell and on the immune answer.</p>
<p data-step="4">The human genome is about 100 000 times larger. A virus does the same job with a short message, because it borrows the machinery of the cell.</p>`,
star:'Two thirds copying tools, then the four parts of the shell.',starStep:2,
scene(H){const s=stage();const x0=30,x1=612,Y=120,BH=34,TOT=29903;
  const X=v=>x0+(x1-x0)*v/TOT;
  const genes=[['ORF1a',266,13468,'dad'],['ORF1b',13468,21555,'dad'],['S',21563,25384,'bad'],['3a',25393,26220,'hi'],['E',26245,26472,'good'],
    ['M',26523,27191,'muted'],['6',27202,27387,'hi'],['7a',27394,27759,'hi'],['7b',27756,27887,'hi'],['8',27894,28259,'hi'],['N',28274,29533,'mom'],['10',29558,29674,'hi']];
  H.txt(s,x0,58,'SARS-CoV-2 GENOME · RNA','cap',{st:'fill:var(--ink)'});
  const cnt=H.txt(s,x1,58,'','lb',{'text-anchor':'end'});
  const rail=H.E('line',{x1:x0,y1:Y+BH/2,x2:x1,y2:Y+BH/2,pathLength:1,cls:'draw',st:'stroke:var(--ink);stroke-width:2'},s);
  const bx=genes.map(([n,a,b,c])=>{const G=H.g(s);
    const r=H.E('rect',{x:X(a),y:Y,width:Math.max(3,X(b)-X(a)),height:BH,rx:3,st:`fill:${H.C(c)};stroke:var(--ink);stroke-width:1.4`},G);
    if(X(b)-X(a)>26)H.txt(G,(X(a)+X(b))/2,Y+BH/2+5,n,'lb',{'text-anchor':'middle',st:`font-size:13px;fill:${c==='dad'||c==='bad'?'var(--paper)':'var(--ink)'}`});
    H.O(G,0,{d:0});return G});
  const nsp=H.g(s);H.txt(nsp,X(10000),Y+74,'16 non-structural proteins: the copying tools','lb',{'text-anchor':'middle',st:'font-size:13px'});
  for(let i=0;i<16;i++)H.E('rect',{x:X(500)+i*22,y:Y+84,width:17,height:17,rx:3,st:'fill:var(--dad-tint);stroke:var(--dad);stroke-width:1.5'},nsp);
  H.O(nsp,0,{d:0});
  const parts=H.g(s);const pv=virion(parts,470,296,40,{n:12});
  H.txt(parts,470,364,'S, E, M and N build the particle','lb',{'text-anchor':'middle',st:'font-size:13px'});H.O(parts,0,{d:0});
  const acc=H.g(s);H.E('path',{d:`M${X(25393)},${Y+BH+8} L${X(25393)},${Y+BH+14} L${X(29674)},${Y+BH+14} L${X(29674)},${Y+BH+8}`,st:'fill:none;stroke:var(--ink);stroke-width:1.6'},acc);
  H.txt(acc,520,Y+BH+32,'accessory genes','lb',{'text-anchor':'middle',st:'font-size:13px'});
  H.txt(acc,520,Y+BH+50,'each coronavirus type has its own set','lbs',{'text-anchor':'middle'});H.O(acc,0,{d:0});
  const cmp=H.g(s);H.txt(cmp,30,250,'SIZE, SIDE BY SIDE','cap',{st:'fill:var(--ink)'});
  H.E('rect',{x:30,y:266,width:320,height:20,rx:4,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},cmp);
  H.txt(cmp,30,306,'human genome: 3000 million DNA letters','lbs');
  H.E('rect',{x:30,y:330,width:3.2,height:20,rx:1,st:'fill:var(--bad);stroke:var(--ink);stroke-width:1'},cmp);
  H.txt(cmp,42,346,'virus genome: 29 903 RNA letters','lbs');
  H.txt(cmp,30,378,'the virus message is about 100 000 times shorter','lb',{st:'font-size:13px'});H.O(cmp,0,{d:0});
  return [
    ()=>{H.D(rail,1,{d:900});const p={set textContent(v){cnt.textContent=v+' letters'}};
      H.count(p,0,TOT,{d:1400,at:300,fmt:v=>Math.round(v).toLocaleString('en-US').replace(/,/g,' ')})},
    ()=>{[0,1].forEach(i=>H.O(bx[i],1,{d:400,at:i*200}));H.O(nsp,1,{at:600})},
    ()=>{H.O(nsp,0,{d:300});[2,4,5,10].forEach((i,k)=>H.O(bx[i],1,{d:400,at:k*180}));H.O(parts,1,{at:500});H.D(pv.rna,1,{d:900,at:700})},
    ()=>{H.O(parts,0,{d:300});[3,6,7,8,9,11].forEach((i,k)=>H.O(bx[i],1,{d:400,at:k*140}));H.O(acc,1,{at:500})},
    ()=>{H.O(cmp,1,{at:200})},
  ];}},

/* 5 ─────────────────────────────── */
{sec:'13.2',title:'ACE2: the Door the Virus Uses',caption:'ACE2 = angiotensin-converting enzyme 2 · beads = the eight amino acids of angiotensin II',
text:`<p data-step="0"><b>Angiotensin-converting enzyme 2 (ACE2)</b> is a human <b>enzyme</b>, a protein that speeds up one chemical reaction. ACE2 sits in the outer membrane of many cell types, with its working end outside the cell. The <i>ACE2</i> gene sits on the X chromosome.</p>
<p data-step="1">Its normal job is to calm the body. <b>Angiotensin II</b> is a short signal protein made of eight <b>amino acids</b>, the building blocks of proteins. Angiotensin II narrows blood vessels and raises blood pressure. It also increases <b>inflammation</b>: swelling, heat and the arrival of immune cells in a tissue.</p>
<p data-step="2">ACE2 removes one amino acid from the end of angiotensin II. The seven-amino-acid piece that remains does the opposite: it widens blood vessels and lowers inflammation.</p>
<p data-step="3">Cells with ACE2 line the nose, the mouth, the lungs and the heart. They also line the blood vessels, the kidneys, the liver and the gut. The virus can reach all of these tissues.</p>
<p data-step="4">A bound virus stops ACE2 from doing its job. Researchers think that angiotensin II then increases. Inflammation and tissue damage then rise, most of all in the lungs and the heart.</p>`,
star:'ACE2 calms the body. The virus uses it as a handle.',starStep:4,
scene(H){const s=stage();const MY=272;
  membrane(s,20,440,MY,{t:12});
  H.txt(s,24,MY+30,'INSIDE THE CELL','cap');H.txt(s,330,MY-10,'OUTSIDE THE CELL','cap');
  const R=ace2(s,150,MY);
  const A2=at(s,248,118);const beads=[];
  for(let i=0;i<8;i++){beads.push(H.E('circle',{cx:i*17,cy:0,r:8,st:`fill:${i===7?'var(--bad)':'var(--mom)'};stroke:var(--ink);stroke-width:1.4`},A2));}
  H.E('line',{x1:0,y1:0,x2:119,y2:0,st:'stroke:var(--ink);stroke-width:1.6'},A2);
  A2.insertBefore(A2.lastChild,A2.firstChild);
  const a2l=H.txt(s,248,94,'angiotensin II · 8 amino acids','lb');
  const a2e=H.txt(s,248,76,'raises blood pressure and inflammation','lbs');
  hide(A2);H.O([a2l,a2e],0,{d:0});
  const cut=H.txt(s,196,218,'ACE2 removes the last amino acid','lbs');H.O(cut,0,{d:0});
  const res=H.txt(s,248,94,'7 amino acids left','lb');const res2=H.txt(s,248,76,'lowers blood pressure and inflammation','lbs');H.O([res,res2],0,{d:0});
  const tis=H.g(s);H.txt(tis,490,140,'ACE2 IS IN','cap',{st:'fill:var(--ink)'});
  ['nose and mouth','lungs','heart','blood vessels','kidneys','liver','gut'].forEach((t,i)=>{
    H.E('circle',{cx:496,cy:162+i*22-4,r:3.5,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1'},tis);
    H.txt(tis,508,162+i*22,t,'lb',{st:'font-size:13px'})});
  H.O(tis,0,{d:0});
  const V=virion(s,150,MY-160,30,{n:12});hide(V);
  const blk=H.txt(s,166,MY+66,'','lb',{'text-anchor':'middle',st:'fill:var(--bad)'});
  const blk2=H.txt(s,166,MY+86,'','lbs',{'text-anchor':'middle'});
  return [
    ()=>{H.O(R,1,{d:600});H.T(R,{s:1},{d:600})},
    ()=>{pop(A2);H.O([a2l,a2e],1,{at:300})},
    ()=>{H.T(A2,{x:196,y:MY-28},{d:1200});H.O(cut,1,{at:900});
      H.after(1400,()=>{H.O(beads[7],0,{d:400});H.T(beads[7],{x:26,y:40},{d:700});H.O([a2l,a2e],0,{d:300});H.O([res,res2],1,{d:400})})},
    ()=>{H.O(tis,1,{d:600})},
    ()=>{H.O([res,res2,cut],0,{d:300});H.T(A2,{x:248,y:118},{d:800});H.O([a2l,a2e],1,{d:400,at:400});
      H.T(beads[7],{x:0,y:0},{d:600});H.O(beads[7],1,{d:400,at:300});
      pop(V,{at:200});H.T(V,{x:150,y:MY-54},{d:1200,at:300});
      H.after(1500,()=>{blk.textContent='ACE2 is blocked';blk2.textContent='researchers think inflammation then rises'})},
  ];}},

/* 6 ─────────────────────────────── */
{sec:'13.2',title:'Step 1: the Spike Binds ACE2',caption:'One spike is three S proteins together · RBD = receptor-binding domain (yellow)',
text:`<p data-step="0">Each spike has two parts. <b>S1</b> is the head. <b>S2</b> is the stalk that holds the head on the envelope.</p>
<p data-step="1">One piece of S1 is the <b>receptor-binding domain</b>, the small surface that touches ACE2. In a spike at rest the domain lies flat. The domain rises before it can bind.</p>
<p data-step="2">The raised domain fits the top of ACE2 the way a key fits a lock. The fit is tight, so the particle stays attached.</p>
<p data-step="3">Several spikes bind at the same time. The particle is now fixed to the cell surface.</p>
<p data-step="4">An <b>antibody</b> is a Y-shaped immune protein that sticks to one shape on a germ. An antibody that covers the receptor-binding domain stops this step. Every COVID-19 vaccine teaches the body to make antibodies against the spike.</p>`,
star:'S1 head binds, S2 stalk holds. The binding piece is the receptor-binding domain.',starStep:2,
scene(H){const s=stage();const MY=332;
  membrane(s,16,624,MY,{t:12});H.txt(s,20,MY+30,'HUMAN CELL','cap');
  /* left panel: one spike, labelled */
  const SP=at(s,110,250,2);const sp=spike(SP,0,0);
  const l1=leader(s,84,194,30,124,'S1 · head','start'),
        l2=leader(s,122,236,150,284,'S2 · stalk','start'),
        l3=leader(s,124,174,172,140,'receptor-','start');
  H.txt(l3,178,158,'binding domain','lb');
  /* right: three ACE2 receptors and a particle */
  const rx=[376,452,528];
  const R=rx.map((x,i)=>{const G=ace2(s,x,MY);if(i)H.O(G,1,{d:0});return G});
  const V=virion(s,452,170,50,{n:14});hide(V);
  const glow=rx.map(x=>{const e=H.E('circle',{cx:x,cy:MY-12,r:15,st:'fill:none;stroke:var(--good);stroke-width:4'},s);H.O(e,0,{d:0});return e});
  const lock=H.txt(s,452,MY+54,'','lb',{'text-anchor':'middle'});
  const ab=at(s,300,86);H.E('path',{d:'M0,0 L0,18 M0,0 L-14,-13 M0,0 L14,-13',st:'fill:none;stroke:var(--good);stroke-width:4;stroke-linecap:round'},ab);
  H.txt(ab,0,-24,'antibody','lbs',{'text-anchor':'middle',st:'fill:var(--good);font-weight:700'});hide(ab);
  const X=H.g(s);H.E('path',{d:'M-11,-11 L11,11 M11,-11 L-11,11',st:'stroke:var(--bad);stroke-width:4.5;stroke-linecap:round'},X);
  H.T(X,{x:452,y:MY-18},{d:0});H.O(X,0,{d:0});
  return [
    ()=>{H.O(SP,1,{d:600});show(l1);show(l2)},
    ()=>{show(l3);H.T(sp.rbd,{x:12,y:8},{d:700});H.after(800,()=>H.T(sp.rbd,{x:0,y:-8},{d:900}))},
    ()=>{pop(V);H.T(V,{x:452,y:MY-74},{d:1300,at:300});
      H.O(glow[1],1,{d:400,at:1300});H.after(1300,()=>{lock.textContent='the domain binds ACE2'})},
    ()=>{H.O(glow[0],1,{d:400});H.O(glow[2],1,{d:400,at:250});H.T(V,{x:452,y:MY-66},{d:700});
      lock.textContent='several spikes hold the particle on the cell'},
    ()=>{pop(ab);H.T(ab,{x:452,y:MY-150},{d:1100,at:300});H.O(glow[1],0,{d:400,at:1100});
      H.O(X,1,{d:400,at:1200});lock.textContent='an antibody on the binding domain blocks the step'},
  ];}},

/* 7 ─────────────────────────────── */
{sec:'13.2',title:'Step 2: Human Enzymes Cut the Spike',caption:'Scissors = a protease, an enzyme that cuts other proteins',
text:`<p data-step="0">A <b>protease</b> is an enzyme that cuts other proteins. The spike needs two cuts by human proteases before the virus can enter.</p>
<p data-step="1">The first cut happens early. The protease <b>furin</b> cuts between S1 and S2 while the particle is still inside the cell that made it. Most related coronaviruses have no furin cut site. SARS-CoV-2 has one, so its particles leave the first cell already prepared.</p>
<p data-step="2">The second cut happens at the target cell. The protease <b>TMPRSS2</b> sits in the same membrane as ACE2. TMPRSS2 cuts S2 below the head.</p>
<p data-step="3">The cut frees the stalk. A sticky end of S2, the fusion peptide, pushes into the cell membrane. The stalk then folds in half and pulls the two membranes together until they join.</p>
<p data-step="4">A cell with little TMPRSS2 has a second route. The cell takes the particle into a vesicle. Proteases called cathepsins then cut the spike inside that bubble.</p>`,
star:'Bind, cut, fuse. The virus borrows our own scissors.',starStep:3,
scene(H){const s=stage();const MY=310;
  membrane(s,16,624,MY,{t:12});H.txt(s,20,MY+34,'HUMAN CELL','cap');
  const R=ace2(s,300,MY);
  const V=virion(s,300,146,44,{n:14});
  const SP=at(s,300,MY-72,1.6);const sp=spike(SP,0,0);
  const fur=at(s,150,120);
  H.E('path',{d:'M-14,-10 L10,8 M-14,10 L10,-8 M12,10 a5,5 0 1 0 .1,0 M12,-10 a5,5 0 1 0 .1,0',st:'fill:none;stroke:var(--mom);stroke-width:2.6;stroke-linecap:round'},fur);
  H.txt(fur,0,30,'furin','lb',{'text-anchor':'middle',st:'fill:var(--mom)'});hide(fur);
  const tm=at(s,370,MY);
  H.E('rect',{x:-7,y:0,width:14,height:16,rx:3,st:'fill:var(--mom);stroke:var(--ink);stroke-width:1.5'},tm);
  H.E('path',{d:'M-12,-4 L10,-20 M-12,-14 L10,2',st:'fill:none;stroke:var(--mom);stroke-width:2.6;stroke-linecap:round'},tm);
  H.txt(tm,44,-24,'TMPRSS2','lb',{'text-anchor':'middle',st:'fill:var(--mom)'});hide(tm);
  const c1=H.txt(s,22,44,'','lb',{st:'font-size:15px'});
  const note=H.txt(s,320,396,'','lb',{'text-anchor':'middle'});
  const fuse=H.g(s);H.E('path',{d:`M256,${MY+6} Q300,${MY-30} 344,${MY+6}`,pathLength:1,cls:'draw',st:`fill:none;stroke:var(--bad);stroke-width:3`},fuse);H.O(fuse,0,{d:0});
  const rnaIn=H.E('path',{d:`M248,${MY+52} q18,-16 36,0 q18,16 36,0 q18,-16 36,0`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:3;stroke-linecap:round'},s);
  const rnaL=H.txt(s,248,MY+80,'the RNA genome is now in the cell','lbs');H.O(rnaL,0,{d:0});
  const ves=H.g(s);H.E('circle',{cx:520,cy:MY+52,r:40,st:'fill:none;stroke:var(--ink);stroke-width:2;stroke-dasharray:6 4'},ves);
  const vv=virion(ves,520,MY+52,22,{n:10});
  H.txt(ves,520,MY+112,'vesicle route: cathepsins cut the spike','lbs',{'text-anchor':'middle'});H.O(ves,0,{d:0});
  return [
    ()=>{H.O(V,1,{d:400});H.O(SP,1,{d:400});c1.textContent='the spike needs two cuts'},
    ()=>{pop(fur);H.T(fur,{x:264,y:MY-100},{d:1100,at:300});
      H.after(1400,()=>{H.T(sp.s1,{y:-4},{d:500});c1.textContent='cut 1 · furin separates S1 from S2';H.O(fur,0,{d:500,at:500})})},
    ()=>{pop(tm);c1.textContent='cut 2 · TMPRSS2 cuts the stalk';H.T(tm,{x:330},{d:900,at:300})},
    ()=>{H.O(sp.s1,0,{d:600});H.T(sp.s1,{y:-30,x:40},{d:900});H.T(sp.rbd,{y:-30,x:40},{d:900});H.O(sp.rbd,0,{d:600});
      H.T(sp.s2,{sy:.45,y:14},{d:1100,at:400});H.T(V,{x:300,y:MY-60},{d:1400,at:500});
      H.after(1700,()=>{H.O(fuse,1,{d:500});H.D(rnaIn,1,{d:900,at:300});H.O(rnaL,1,{at:700});
        c1.textContent='the membranes join and the RNA enters'});note.textContent=''},
    ()=>{H.O(ves,1,{d:600});H.D(vv.rna,1,{d:800,at:300})},
  ];}},

/* 8 ─────────────────────────────── */
{sec:'13.2',title:'Step 3: Inside the Cell',caption:'Blue = virus RNA · grey = ribosome · the virus RNA never enters the nucleus',
text:`<p data-step="0">The RNA strand is now in the cytoplasm, the fluid part of the cell. It works like one of the cell's own messages.</p>
<p data-step="1"><b>Ribosomes</b> are the machines that read RNA and join amino acids into proteins. They read ORF1a and ORF1b first and make the copying tools, above all the enzyme that copies RNA.</p>
<p data-step="2">That enzyme makes a mirror copy of the genome, and then reads the mirror copy to make many new genomes. It also makes shorter messages for S, E, M and N.</p>
<p data-step="3">New N proteins coil around each new genome. S, M and E proteins wait in the membrane of a cell compartment. Particles form there and leave the cell in vesicles.</p>
<p data-step="4">One infected cell can release hundreds of particles. The virus has no DNA stage and no enzyme to write DNA, so its genes never join your chromosomes.</p>`,
star:'Read, copy, pack, leave. All of it outside the nucleus.',starStep:4,
scene(H){const s=stage();
  H.E('rect',{x:14,y:30,width:612,height:376,rx:26,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},s);
  H.txt(s,28,54,'CYTOPLASM','cap');
  const nuc=at(s,92,318);H.E('circle',{r:52,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2;stroke-dasharray:6 4'},nuc);
  H.txt(nuc,0,4,'nucleus','lb',{'text-anchor':'middle'});H.txt(nuc,0,22,'your DNA','lbs',{'text-anchor':'middle'});
  const rna=H.E('path',{d:'M70,110 q26,-26 52,0 q26,26 52,0 q26,-26 52,0',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:3;stroke-linecap:round'},s);
  const rl=H.txt(s,70,88,'virus RNA','lb');H.O(rl,0,{d:0});
  const rib=at(s,130,110,.001);H.E('circle',{r:16,st:'fill:var(--faint);stroke:var(--ink);stroke-width:1.6'},rib);
  H.E('path',{d:'M-16,2 A16,16 0 0 0 16,2 Z',st:'fill:var(--muted);stroke:var(--ink);stroke-width:1.4'},rib);
  const rl2=H.txt(s,130,66,'ribosome','lbs',{'text-anchor':'middle'});H.O(rl2,0,{d:0});
  const tools=H.g(s);H.txt(tools,200,150,'16 copying tools','lb');
  const tb=[];for(let i=0;i<16;i++)tb.push(H.E('rect',{x:200+i*13,y:160,width:10,height:14,rx:2,st:'fill:var(--dad-tint);stroke:var(--dad);stroke-width:1.3'},tools));
  H.O(tools,0,{d:0});
  const cop=H.g(s);
  const mir=H.E('path',{d:'M300,214 q26,-22 52,0 q26,22 52,0 q26,-22 52,0',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--muted);stroke-width:3;stroke-dasharray:1'},cop);
  H.txt(cop,300,200,'mirror copy','lbs');
  const kids=[0,1,2].map(i=>{const p=H.E('path',{d:`M300,${250+i*26} q26,-18 52,0 q26,18 52,0`,st:'fill:none;stroke:var(--dad);stroke-width:2.6;stroke-linecap:round'},cop);H.O(p,0,{d:0});return p});
  const msg=H.txt(cop,300,330,'plus short messages for S, E, M and N','lbs');H.O(msg,0,{d:0});H.O(cop,0,{d:0});
  const fac=H.g(s);H.E('rect',{x:424,y:60,width:186,height:150,rx:14,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.8;stroke-dasharray:5 4'},fac);
  H.txt(fac,517,82,'PARTICLES FORM HERE','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  const nv=[[478,130,20],[556,126,20],[517,176,20]].map(([x,y,r])=>{const V=virion(fac,x,y,r,{n:10});hide(V);return V});
  H.O(fac,0,{d:0});
  const out=[[528,236],[560,262],[540,212]].map(([x,y])=>{const V=virion(s,x,y,15,{n:8});hide(V);V.gx=x;V.gy=y;return V});
  const cnt=H.txt(s,300,386,'','lb',{'text-anchor':'middle'});
  const safe=H.txt(s,92,390,'','lbs',{'text-anchor':'middle',st:'fill:var(--good);font-weight:700'});
  return [
    ()=>{H.D(rna,1,{d:1100});H.O(rl,1,{at:600})},
    ()=>{pop(rib);H.O(rl2,1,{at:300});H.T(rib,{x:120},{d:1600,at:500});H.O(tools,1,{at:1200})},
    ()=>{H.O(cop,1);H.D(mir,1,{d:1000});kids.forEach((p,i)=>H.O(p,1,{d:400,at:800+i*250}));H.O(msg,1,{at:1600})},
    ()=>{H.O(fac,1,{d:500});nv.forEach((V,i)=>{pop(V,{at:400+i*300});H.D(V.rna,1,{d:600,at:500+i*300})})},
    ()=>{out.forEach((V,i)=>{H.T(V,{x:V.gx,y:V.gy,s:1},{d:0});H.O(V,0,{d:0});
        H.O(V,1,{d:300,at:i*250});H.T(V,{x:V.gx+[42,24,46][i],y:V.gy+[76,94,-18][i]},{d:1300,at:i*250})});
      cnt.textContent='hundreds of new particles from one cell';safe.textContent='no DNA stage'},
  ];}},

/* 9 ─────────────────────────────── */
{sec:'13.2',title:'A Cell Covered in Virus',caption:'Scanning electron micrograph of a laboratory-grown cell, colour added · NIAID, CC BY 2.0, via Wikimedia Commons',
text:`<p data-step="0">A scanning electron microscope shows surfaces. The teal shapes are the outside of one cell grown in a laboratory. The virus that infected it came from a patient.</p>
<p data-step="1">The orange balls are virus particles on that surface. They left the cell a moment before.</p>
<p data-step="2">The cell surface has broken into round <b>blebs</b>, bubbles that bulge from a dying cell. A cell that dies in this way releases its contents, and the immune system reacts to them.</p>
<p data-step="3">The team added both colours. The microscope records only shape and brightness.</p>`,
star:'One cell releases hundreds of new particles.',starStep:1,
scene(H){const s=stage();const X=72,Y=16,W=496,HT=386;
  photo(s,'@@asset:c13-sars-cov2-sem.jpg@@',X,Y,W,HT,{r:12});
  const mark=(cx,cy,rx,ry,label,lx,ly,anchor)=>{const G=H.g(s);
    H.E('ellipse',{cx,cy,rx,ry,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:3.5'},G);
    const tw=label.length*7.3+16;const bx=anchor==='end'?lx-tw:lx;
    H.E('rect',{x:bx,y:ly-16,width:tw,height:25,rx:6,st:'fill:#16181d;opacity:.9'},G);
    H.txt(G,bx+8,ly+1,label,'lb',{st:'fill:#fff;font-size:12.5px'});H.O(G,0,{d:0});return G};
  const P1=mark(X+250,Y+170,56,52,'one cell',16,120,'start');
  const P2=mark(X+356,Y+100,30,26,'virus particles',624,86,'end');
  const P3=mark(X+140,Y+300,54,44,'the surface breaks into blebs',16,330,'start');
  return [()=>{},()=>show(P1),()=>show(P2),()=>show(P3)];}},

/* 10 ─────────────────────────────── */
{sec:'13.3',title:'How the Body Answers',caption:'Green = defence · the alarm protein is type I interferon',
text:`<p data-step="0">An infected cell detects virus RNA with sensor proteins. A <b>Toll-like receptor</b> is one family of sensors. Each one binds a shape that only germs have. <b>TLR7</b> binds single-strand RNA inside immune cells.</p>
<p data-step="1">A sensor that finds virus RNA makes <b>interferon</b>, an alarm protein. Interferon reaches the neighbour cells, and they start to make antiviral proteins before the virus arrives.</p>
<p data-step="2">Immune cells also carry C-type lectin receptors. These bind the sugar chains on the spike. This route, the <b>C-lectin pathway</b>, lets a scavenging cell catch the particle and show its pieces to other immune cells.</p>
<p data-step="3"><b>B cells</b> make antibodies. An antibody sticks to the spike and blocks it. <b>T cells</b> find and kill the cells that already carry the virus.</p>
<p data-step="4">Some B cells and T cells stay as <b>memory cells</b>. At the next meeting with the same spike, they act in days instead of weeks. A vaccine builds this memory without the illness.</p>`,
star:'Alarm first, antibodies later, memory last.',starStep:4,
scene(H){const s=stage();
  const C1=at(s,96,150);H.E('circle',{r:50,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.2'},C1);
  const vr=H.E('path',{d:'M-24,6 q12,-14 24,0 q12,14 24,0',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:2.6'},C1);
  const sen=H.E('path',{d:'M-10,-20 a10,10 0 1 1 20,0 a10,10 0 1 1 -20,0',st:'fill:var(--good);stroke:var(--ink);stroke-width:1.5'},C1);H.O(sen,0,{d:0});
  H.txt(s,96,218,'infected cell','lb',{'text-anchor':'middle'});
  const slab=H.txt(s,96,236,'sensor finds virus RNA','lbs',{'text-anchor':'middle'});H.O(slab,0,{d:0});
  const ifn=[[214,100],[216,208],[200,156]].map(([tx,ty])=>{const G=at(s,96,150);
    H.E('circle',{r:7,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.4'},G);H.O(G,0,{d:0});G.tx=tx;G.ty=ty;return G});
  const C2=[[252,92],[252,208]].map(([x,y])=>{const G=at(s,x,y);H.E('circle',{r:34,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},G);
    G.sh=H.E('circle',{r:34,st:'fill:none;stroke:var(--good);stroke-width:4'},G);H.O(G.sh,0,{d:0});return G});
  const nl=H.txt(s,252,262,'neighbour cells get ready','lbs',{'text-anchor':'middle'});H.O(nl,0,{d:0});
  const DC=at(s,126,330);H.E('path',{d:'M0,-26 L22,-12 L26,14 L4,30 L-20,22 L-28,-6 Z',st:'fill:var(--mom-tint);stroke:var(--ink);stroke-width:1.8'},DC);
  for(let i=0;i<5;i++){const a=i*72*Math.PI/180;H.E('line',{x1:20*Math.cos(a),y1:20*Math.sin(a),x2:34*Math.cos(a),y2:34*Math.sin(a),st:'stroke:var(--ink);stroke-width:1.6'},DC)}
  H.txt(DC,0,52,'scavenging cell · C-lectin pathway','lbs',{'text-anchor':'middle'});hide(DC);
  const B=at(s,430,110);H.E('circle',{r:30,st:'fill:var(--dad-tint);stroke:var(--ink);stroke-width:2'},B);H.txt(B,0,5,'B','big',{'text-anchor':'middle',st:'font-size:22px'});
  H.txt(B,0,50,'B cell: antibodies','lbs',{'text-anchor':'middle'});hide(B);
  const ab=[[374,70],[390,138],[356,104]].map(([tx,ty])=>{const G=at(s,430,110);
    H.E('path',{d:'M0,0 L0,12 M0,0 L-9,-9 M0,0 L9,-9',st:'fill:none;stroke:var(--good);stroke-width:3;stroke-linecap:round'},G);
    H.O(G,0,{d:0});G.tx=tx;G.ty=ty;return G});
  const T=at(s,430,250);H.E('circle',{r:30,st:'fill:var(--mom-tint);stroke:var(--ink);stroke-width:2'},T);H.txt(T,0,5,'T','big',{'text-anchor':'middle',st:'font-size:22px'});
  H.txt(T,0,50,'T cell: kills infected cells','lbs',{'text-anchor':'middle'});hide(T);
  const MEM=at(s,566,180);H.E('circle',{r:30,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2.5;stroke-dasharray:5 4'},MEM);
  H.txt(MEM,0,5,'M','big',{'text-anchor':'middle',st:'font-size:22px'});H.txt(MEM,0,52,'memory cells','lbs',{'text-anchor':'middle'});
  H.txt(MEM,0,70,'ready for the next time','lbs',{'text-anchor':'middle'});hide(MEM);
  return [
    ()=>{H.D(vr,1,{d:900});H.O(sen,1,{d:500,at:700});H.O(slab,1,{at:900})},
    ()=>{ifn.forEach((G,i)=>{H.T(G,{x:96,y:150},{d:0});H.O(G,1,{d:300,at:i*200});H.T(G,{x:G.tx,y:G.ty},{d:1100,at:i*200})});
      C2.forEach((G,i)=>H.O(G.sh,1,{d:600,at:900+i*200}));H.O(nl,1,{at:1200})},
    ()=>{pop(DC)},
    ()=>{pop(B);pop(T,{at:250});ab.forEach((G,i)=>{H.T(G,{x:430,y:110},{d:0});H.O(G,1,{d:300,at:700+i*180});H.T(G,{x:G.tx,y:G.ty},{d:900,at:700+i*180})})},
    ()=>{pop(MEM)},
  ];}},

/* 11 ─────────────────────────────── */
{sec:'13.3',title:'When the Alarm Goes Too Far',caption:'Model curves · the shaded band shows the level the lungs tolerate',
text:`<p data-step="0"><b>Cytokines</b> are small signal proteins. Immune cells release them to call other immune cells to the infected tissue. A measured release clears the virus.</p>
<p data-step="1">An <b>inflammasome</b> is a protein complex inside a cell. It assembles when the cell senses damage or germs, and it starts strong inflammation signals.</p>
<p data-step="2">In some patients the signals do not stop. Cytokine levels climb far above the useful level. This runaway state is a <b>cytokine storm</b>.</p>
<p data-step="3">The storm damages the thin wall between the air sacs and the blood vessels of the lung. Fluid enters the air sacs, so oxygen crosses less well, and breathing becomes hard.</p>
<p data-step="4">Early in the pandemic about 15 of every 100 confirmed cases became severe. Severe illness was rare in children and teenagers. The risk rises with age from about 40 years. It is higher for people with heart disease, diabetes, long-term lung illness or cancer.</p>`,
star:'The damage comes from the virus and from an answer that overshoots.',starStep:3,
scene(H){const s=stage();const gx0=40,gx1=330,gy0=300,gy1=70;
  const X=v=>gx0+(gx1-gx0)*v,Y=v=>gy0-(gy0-gy1)*v;
  H.E('path',{d:`M${gx0},${gy1-10} L${gx0},${gy0} L${gx1+10},${gy0}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},s);
  H.txt(s,gx0,gy1-20,'cytokine level','lb');H.txt(s,(gx0+gx1)/2,gy0+26,'days after infection','lbs',{'text-anchor':'middle'});
  H.E('rect',{x:gx0,y:Y(.42),width:gx1-gx0,height:gy0-Y(.42),st:'fill:var(--good);opacity:.13'},s);
  H.txt(s,gx1+8,Y(.42)+4,'level the','lbs');H.txt(s,gx1+8,Y(.42)+20,'lungs tolerate','lbs');
  const mk=(f,col,w)=>{let d='';for(let i=0;i<=60;i++){const v=i/60;d+=(i?' L':'M')+X(v).toFixed(1)+','+Y(f(v)).toFixed(1)}
    return H.E('path',{d,pathLength:1,cls:'draw',st:`fill:none;stroke:${col};stroke-width:${w||3};stroke-linecap:round`},s)};
  const normal=mk(v=>.34*Math.exp(-Math.pow((v-.38)/.19,2)),'var(--good)');
  const storm=mk(v=>.95*Math.exp(-Math.pow((v-.58)/.26,2)),'var(--bad)');
  H.O(storm,0,{d:0});
  const nl=H.txt(s,X(.2),Y(.3),'measured answer','lbs',{'text-anchor':'middle',st:'fill:var(--good);font-weight:700'});H.O(nl,0,{d:0});
  const sl=H.txt(s,X(.58),Y(.95)-14,'cytokine storm','lb',{'text-anchor':'middle',st:'fill:var(--bad)'});H.O(sl,0,{d:0});
  const cyt=[[96,112],[180,96],[250,120],[132,152],[214,160]].map(([tx,ty])=>{const G=at(s,X(.38),Y(.34));
    H.E('circle',{r:6,st:'fill:var(--bad);stroke:var(--ink);stroke-width:1.2'},G);H.O(G,0,{d:0});G.tx=tx;G.ty=ty;return G});
  const INF=at(s,470,110);
  const ring=[];for(let i=0;i<7;i++){const a=i*2*Math.PI/7;const e=H.E('rect',{x:20*Math.cos(a)-7,y:20*Math.sin(a)-7,width:14,height:14,rx:3,st:'fill:var(--mom);stroke:var(--ink);stroke-width:1.3'},INF);
    H.T(e,{x:(i%2?-1:1)*90,y:(i<3?-1:1)*60},{d:0});ring.push(e)}
  H.txt(INF,0,56,'inflammasome','lb',{'text-anchor':'middle'});H.O(INF,0,{d:0});
  const AL=at(s,470,252);
  const sac=H.E('circle',{r:46,st:'fill:var(--card);stroke:var(--ink);stroke-width:2.5'},AL);
  const wall=H.E('path',{d:'M-46,0 A46,46 0 0 0 46,0',st:'fill:none;stroke:var(--dad);stroke-width:5'},AL);
  H.txt(AL,0,-56,'air sac in the lung','lb',{'text-anchor':'middle'});
  H.txt(AL,0,74,'','lbs',{'text-anchor':'middle'});const alw=AL.lastChild;
  const fluid=H.E('path',{d:'M-44,10 A46,46 0 0 0 44,10 Z',st:'fill:var(--dad);opacity:.35'},AL);H.O(fluid,0,{d:0});H.O(AL,0,{d:0});
  const risk=H.g(s);H.txt(risk,30,356,'HIGHER RISK OF SEVERE ILLNESS','cap',{st:'fill:var(--ink)'});
  H.txt(risk,30,378,'age from about 40 years upward','lb',{st:'font-size:13px'});
  H.txt(risk,30,398,'heart disease · diabetes · lung illness · cancer','lb',{st:'font-size:13px'});H.O(risk,0,{d:0});
  return [
    ()=>{H.D(normal,1,{d:1300});H.O(nl,1,{at:900});
      cyt.forEach((G,i)=>{H.T(G,{x:X(.38),y:Y(.34)},{d:0});H.O(G,.85,{d:300,at:i*150});H.T(G,{x:G.tx,y:G.ty},{d:1000,at:i*150})})},
    ()=>{H.O(INF,1,{d:400});ring.forEach((e,i)=>H.T(e,{x:0,y:0},{d:900,at:i*90}))},
    ()=>{H.O(storm,1,{d:0});H.D(storm,1,{d:1400});H.O(sl,1,{at:1000})},
    ()=>{H.O(AL,1,{d:500});H.K(wall,{stroke:'bad'},{d:800,at:600});H.O(fluid,1,{d:900,at:900});alw.textContent='fluid enters, so oxygen crosses less well'},
    ()=>{H.O(risk,1,{d:500})},
  ];}},

/* 12 ─────────────────────────────── */
{sec:'13.3',title:'Finding Genes by Comparing Genomes',caption:'Drawn plot · the peaks sit on the real chromosomes; the dots are not measurements',
text:`<p data-step="0">Two people can meet the same virus and have different illnesses. Part of that difference lies in their DNA. To find the DNA part, scientists compare large groups.</p>
<p data-step="1">A <b>genome-wide association study</b> reads millions of positions where people differ by one DNA letter. It reads them in thousands of patients with severe illness and in thousands of people with mild or no illness.</p>
<p data-step="2">At almost every position the two groups match, because most differences have nothing to do with the virus. Those positions make the flat band of dots.</p>
<p data-step="3">A few positions are clearly uneven: one letter is more common in the severe group. Those positions rise above the band and mark a region of a chromosome.</p>
<p data-step="4">A peak is an <b>association</b>, not a proof of cause. The peak marks a region, and the region can hold several genes. Later work must test which gene does the work.</p>`,
star:'Compare two groups. A peak marks a region, not yet a cause.',starStep:4,
scene(H){const s=stage();const gx0=56,gx1=620,gy0=330,gy1=78;
  H.E('path',{d:`M${gx0},${gy1-8} L${gx0},${gy0} L${gx1},${gy0}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},s);
  H.txt(s,gx0-6,gy1,'uneven','lbs',{'text-anchor':'end'});H.txt(s,gx0-6,gy0,'equal','lbs',{'text-anchor':'end'});
  H.txt(s,gx0,gy1-20,'difference between the two groups','lb',{st:'font-size:13px'});
  H.txt(s,(gx0+gx1)/2,gy0+36,'position along the 22 numbered chromosomes','lbs',{'text-anchor':'middle'});
  let sd=7;const rnd=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
  const peaks={3:.92,9:.42,12:.52,19:.47,21:.38};
  const dots=[];const band=H.g(s),tall=H.g(s);
  for(let c=1;c<=22;c++){const x0=gx0+8+(c-1)*(gx1-gx0-16)/22,w=(gx1-gx0-16)/22;
    H.E('rect',{x:x0,y:gy0+4,width:w-2,height:9,rx:2,st:`fill:${c%2?'var(--faint)':'var(--muted)'}`},s);
    if(c%3===1||peaks[c])H.txt(s,x0+w/2,gy0+26,String(c),'lbs',{'text-anchor':'middle',st:'font-size:10px'});
    for(let i=0;i<14;i++){const h=Math.pow(rnd(),2)*.2;const x=x0+rnd()*(w-3);
      dots.push(H.E('circle',{cx:x,cy:gy0-(gy0-gy1)*h,r:2.2,st:`fill:${c%2?'var(--muted)':'var(--faint)'}`},band));}
    if(peaks[c]){const pk=peaks[c];for(let i=0;i<7;i++){const h=pk*(1-i*0.11);
      H.E('circle',{cx:x0+w/2+(i-3)*2.6,cy:gy0-(gy0-gy1)*h,r:3.4,st:'fill:var(--bad);stroke:var(--ink);stroke-width:1'},tall)}
      H.txt(tall,x0+w/2,gy0-(gy0-gy1)*pk-14,'chr '+c,'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});}}
  H.O(band,0,{d:0});H.O(tall,0,{d:0});
  const G1=H.g(s);const grp=(x,col,n,t1,t2)=>{const G=H.g(G1);
    for(let i=0;i<n;i++){const r=Math.floor(i/6),k=i%6;H.E('circle',{cx:x+k*17,cy:100+r*17,r:6,st:`fill:${col};stroke:var(--ink);stroke-width:1.2`},G)}
    H.txt(G,x+43,100+Math.ceil(n/6)*17+8,t1,'lb',{'text-anchor':'middle',st:'font-size:13px'});
    H.txt(G,x+43,100+Math.ceil(n/6)*17+26,t2,'lbs',{'text-anchor':'middle'});return G};
  grp(90,'var(--bad)',18,'severe illness','thousands of patients');
  grp(360,'var(--good)',18,'mild or no illness','thousands of controls');
  const dna=H.txt(G1,320,230,'read millions of single-letter differences in every person','lb',{'text-anchor':'middle',st:'font-size:13px'});H.O(dna,0,{d:0});
  const note=H.txt(s,320,386,'','lb',{'text-anchor':'middle'});
  return [
    ()=>{H.O(G1,1,{d:500});H.O(dna,0,{d:0})},
    ()=>{H.O(dna,1,{d:500})},
    ()=>{H.O(G1,0,{d:400});H.O(band,1,{d:700,at:300})},
    ()=>{H.O(tall,1,{d:800})},
    ()=>{note.textContent='association: the region differs between the groups'},
  ];}},

/* 13 ─────────────────────────────── */
{sec:'13.3',title:'The Risk Region on Chromosome 3',caption:'Band 3p21.31 · gene order follows the human reference genome · bars show relative risk, not absolute risk',
text:`<p data-step="0">The largest common signal for severe COVID-19 sits on <b>chromosome 3</b>, in the band 3p21.31. Bands are stripes with numbers that give an address on a chromosome.</p>
<p data-step="1">The signal covers about 50 000 DNA letters. People inherit this whole stretch as one block. In <b>crossing over</b>, matching chromosomes swap pieces in the cells that make eggs and sperm. A swap almost never happens inside such a short stretch.</p>
<p data-step="2">Six genes sit in the block: <i>SLC6A20</i>, <i>LZTFL1</i>, <i>CCR9</i>, <i>FYCO1</i>, <i>CXCR6</i> and <i>XCR1</i>. Three of them, <i>CCR9</i>, <i>CXCR6</i> and <i>XCR1</i>, guide immune cells to tissues. <i>LZTFL1</i> acts in the cells that line the airways.</p>
<p data-step="3">The six genes travel together, so the comparison cannot separate them. Later work on lung cells identified <i>LZTFL1</i> as the gene whose activity changes.</p>
<p data-step="4">The first large comparisons measured the need for breathing support. People with one copy needed it about 1.6 to 1.8 times as often as people with no copy. Carrying the block raises the chance. It does not decide what happens.</p>`,
star:'One block, six genes, one shared result.',starStep:3,
scene(H){const s=stage();
  const CH=at(s,86,210);
  const arm=(y0,y1,w)=>H.E('path',{d:`M${-w},${y0} L${w},${y0} L${w},${y1} L${-w},${y1} Z`,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2'},CH);
  arm(-150,-8,13);arm(8,150,13);
  H.E('circle',{cx:0,cy:0,r:9,cls:'kf'},CH);
  const bands=[[-146,-120],[-112,-96],[-88,-60],[-52,-34],[-28,-12],[16,40],[48,76],[84,112],[120,146]];
  bands.forEach(([a,b],i)=>H.E('rect',{x:-13,y:a,width:26,height:b-a,st:`fill:${i%2?'var(--faint)':'var(--muted)'};opacity:.7`},CH));
  H.txt(CH,0,-168,'chromosome 3','lb',{'text-anchor':'middle'});
  const hl=H.E('rect',{x:-17,y:-92,width:34,height:34,rx:4,st:'fill:none;stroke:var(--bad);stroke-width:3.5'},CH);H.O(hl,0,{d:0});
  const bl=H.txt(CH,24,-72,'3p21.31','lb');H.O(bl,0,{d:0});
  const zx0=210,zx1=612,ZY=130;
  const zoom=H.g(s);
  H.E('path',{d:`M103,118 L${zx0},${ZY-26} M103,152 L${zx0},${ZY+40}`,st:'stroke:var(--faint);stroke-width:1.5'},zoom);
  H.E('rect',{x:zx0,y:ZY-26,width:zx1-zx0,height:66,rx:8,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.8'},zoom);
  H.txt(zoom,zx0,ZY-38,'about 50 000 DNA letters, inherited as one block','lb',{st:'font-size:13px'});H.O(zoom,0,{d:0});
  const names=['SLC6A20','LZTFL1','CCR9','FYCO1','CXCR6','XCR1'];
  const gw=(zx1-zx0-24)/6;
  const gb=names.map((n,i)=>{const G=H.g(s);const x=zx0+12+i*gw;
    H.E('rect',{x,y:ZY-12,width:gw-6,height:36,rx:4,st:`fill:${i===1?'var(--bad)':'var(--dad-tint)'};stroke:var(--ink);stroke-width:1.4`},G);
    H.txt(G,x+(gw-6)/2,ZY+10,n,'lbs',{'text-anchor':'middle',st:`font-weight:700;fill:${i===1?'var(--paper)':'var(--ink)'};font-size:11px`});
    H.O(G,0,{d:0});return G});
  const roles=H.g(s);H.txt(roles,zx0,ZY+78,'CCR9, CXCR6 and XCR1 guide immune cells','lb',{st:'font-size:13px'});
  H.txt(roles,zx0,ZY+100,'LZTFL1 acts in the cells that line the airways','lb',{st:'font-size:13px'});H.O(roles,0,{d:0});
  const rk=H.g(s);const bx0=250,bw=300;
  H.txt(rk,bx0,262,'NEED FOR BREATHING SUPPORT, FIRST LARGE COMPARISONS','cap',{st:'fill:var(--ink);font-size:9px'});
  const b1=gbar(rk,bx0,288,24,'var(--muted)'),b2=gbar(rk,bx0,334,24,'var(--bad)');
  H.txt(rk,bx0,282,'no copy of the block','lbs');H.txt(rk,bx0,328,'one copy of the block','lbs');
  const rl=H.txt(rk,bx0+bw*0.62+10,351,'about 1.6 to 1.8 times as often','lb',{st:'font-size:13px'});H.O(rl,0,{d:0});H.O(rk,0,{d:0});
  return [
    ()=>{H.O(hl,1,{d:500});H.O(bl,1,{at:300})},
    ()=>{H.O(zoom,1,{d:600})},
    ()=>{gb.forEach((G,i)=>H.O(G,1,{d:300,at:i*150}));H.O(roles,1,{at:900})},
    ()=>{gb.forEach((G,i)=>{if(i!==1)H.O(G,.4,{d:500})})},
    ()=>{H.O(rk,1,{d:400});grow(b1,bw*0.38,{at:200});grow(b2,bw*0.62,{at:500});H.O(rl,1,{at:1200})},
  ];}},

/* 14 ─────────────────────────────── */
{sec:'13.3',title:'Inherited from Neanderthals',caption:'Skull from La Chapelle-aux-Saints, Luna04, CC BY 2.5 · Svante Pääbo, Duncan Hull, CC BY-SA 4.0 · both via Wikimedia Commons · letters are an example',
text:`<p data-step="0"><b>Neanderthals</b> were a human group in Europe and western Asia. They disappeared about 40 000 years ago. Their bones still hold short pieces of DNA.</p>
<p data-step="1">Svante Pääbo and his team read Neanderthal genomes from these bones. Neanderthals and early modern humans had children together about 50 000 years ago. People with ancestors outside Africa carry about 2 percent Neanderthal DNA.</p>
<p data-step="2">In 2020 Hugo Zeberg and Svante Pääbo compared the risk block with a Neanderthal genome from Vindija Cave in Croatia. The letters match along the whole block, so the block came from Neanderthals.</p>
<p data-step="3">About 16 of every 100 people in Europe carry the block, and about 50 of every 100 in South Asia. It is almost absent in East Asia and in Africa.</p>
<p data-step="4">Why this stretch stayed common is not known. One idea is that it once helped against a different germ. <b>Natural selection</b> makes helpful variants more common over many generations. It cannot prepare a body for a virus that arrives 50 000 years later.</p>`,
star:'An old inheritance, a new virus, a different result.',starStep:4,
scene(H){const s=stage();
  photo(s,'@@asset:c13-neanderthal-skull.jpg@@',22,54,148,189,{r:10});
  const sl=H.txt(s,96,262,'Neanderthal skull','lbs',{'text-anchor':'middle'});
  const sl2=H.txt(s,96,280,'about 50 000 years old','lbs',{'text-anchor':'middle'});
  const PP=H.g(s);photo(PP,'@@asset:c13-paabo.jpg@@',190,54,110,147,{r:10});
  H.txt(PP,186,220,'Svante Pääbo','lbs');
  H.txt(PP,186,238,'read Neanderthal DNA','lbs');H.O(PP,0,{d:0});
  const M=H.g(s);const mx=330,my=66;
  H.txt(M,mx,my-14,'EXAMPLE LETTERS FROM THE BLOCK','cap',{st:'fill:var(--ink);font-size:9px'});
  const seq='GTACCTGATCAGGTTACCGA';
  ['Neanderthal from Vindija Cave','carrier today'].forEach((t,r)=>{
    H.txt(M,mx,my+16+r*44,t,'lbs');
    for(let i=0;i<seq.length;i++){H.E('rect',{x:mx+i*14,y:my+22+r*44,width:12,height:16,rx:2,st:'fill:var(--wash);stroke:var(--ink);stroke-width:.8'},M);
      H.txt(M,mx+i*14+6,my+34+r*44,seq[i],'lbs',{'text-anchor':'middle',st:'font-size:9px;fill:var(--ink)'})}});
  const mt=H.txt(M,mx,my+124,'the same letters, in the same order','lb',{st:'font-size:13px'});H.O(M,0,{d:0});
  const F=H.g(s);
  H.txt(F,330,236,'PEOPLE WHO CARRY THE BLOCK','cap',{st:'fill:var(--ink)'});
  const rows=[['Europe',16],['South Asia',50],['East Asia','very rare',0.6],['Africa','very rare',0.6]];
  const bx0=436,bw=120;
  const bars=rows.map((r,i)=>{const y=256+i*30;H.txt(F,330,y+12,r[0],'lb',{st:'font-size:13px'});
    H.E('rect',{x:bx0,y:y,width:bw,height:16,rx:3,st:'fill:var(--wash);stroke:var(--faint);stroke-width:1'},F);
    const b=gbar(F,bx0,y,16,'var(--bad)');
    const t=H.txt(F,bx0+bw+8,y+13,typeof r[1]==='number'?r[1]+' in 100':r[1],'lbs',{st:'fill:var(--ink);font-weight:700'});H.O(t,0,{d:0});
    return {b,t,v:typeof r[1]==='number'?r[1]/100:(r[2]/100)}});
  H.O(F,0,{d:0});
  const last=H.txt(s,22,400,'','lb');
  return [
    ()=>{H.O([sl,sl2],1,{d:500})},
    ()=>{H.O(PP,1,{d:600})},
    ()=>{H.O(M,1,{d:500});H.O(mt,1,{at:600})},
    ()=>{H.O(F,1,{d:400});bars.forEach((b,i)=>{grow(b.b,bw*b.v,{at:i*200});H.O(b.t,1,{at:600+i*200})})},
    ()=>{last.textContent='why the block stayed common is not known'},
  ];}},

/* 15 ─────────────────────────────── */
{sec:'13.3',title:'A Neanderthal Variant That Protects',caption:'OAS1 is on chromosome 12 · double-strand RNA only appears while a virus copies itself · bars are relative, not absolute',
text:`<p data-step="0">Not every inherited variant raises risk. The gene <b>OAS1</b> on chromosome 12 carries one that lowers it.</p>
<p data-step="1">The OAS1 protein detects <b>double-strand RNA</b>. Human messages are single strands, but a copying virus makes a double strand. So double-strand RNA is a reliable sign of a virus.</p>
<p data-step="2">When OAS1 finds it, OAS1 activates the enzyme RNase L. RNase L cuts RNA inside the cell, so the virus loses its messages and its new genomes.</p>
<p data-step="3">One version of <i>OAS1</i>, also inherited from Neanderthals, makes a slightly longer protein. The extra end anchors the protein to the membranes where the virus copies itself, so it detects the virus sooner.</p>
<p data-step="4">Hugo Zeberg and Svante Pääbo reported this in 2021. Carriers of the version had about 20 percent lower risk of severe COVID-19. The effect is modest, and it is an association.</p>`,
star:'Double-strand RNA means a virus. OAS1 sees it and calls the scissors.',starStep:2,
scene(H){const s=stage();
  const CL=H.E('rect',{x:20,y:60,width:420,height:300,rx:24,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.2'},s);
  H.txt(s,34,84,'INFECTED CELL','cap');
  const mem=H.E('path',{d:'M60,300 L400,300',st:'stroke:var(--mom);stroke-width:5;stroke-linecap:round'},s);
  H.txt(s,60,320,'membrane where the virus copies itself','lbs');
  const ss=H.E('path',{d:'M90,140 q22,-18 44,0 q22,18 44,0 q22,-18 44,0',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:3'},s);
  const ss2=H.E('path',{d:'M90,152 q22,-18 44,0 q22,18 44,0 q22,-18 44,0',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--bad);stroke-width:3'},s);
  const dl=H.txt(s,90,122,'double-strand RNA: a virus is copying','lb',{st:'font-size:13px'});H.O([dl],0,{d:0});H.O(ss2,0,{d:0});
  const OA=at(s,310,210);H.E('path',{d:'M0,-18 A18,18 0 1 1 -0.1,-18 Z',st:'fill:var(--good);stroke:var(--ink);stroke-width:1.8'},OA);
  H.txt(OA,0,34,'OAS1','lb',{'text-anchor':'middle'});hide(OA);
  const RL=at(s,150,250);H.E('path',{d:'M-13,-9 L10,8 M-13,9 L10,-7 M13,9 a5,5 0 1 0 .1,0 M13,-9 a5,5 0 1 0 .1,0',st:'fill:none;stroke:var(--good);stroke-width:2.6;stroke-linecap:round'},RL);
  H.txt(RL,0,34,'RNase L cuts RNA','lbs',{'text-anchor':'middle',st:'fill:var(--good);font-weight:700'});hide(RL);
  const frag=[0,1,2].map(i=>{const p=H.E('path',{d:`M${100+i*70},196 q16,-12 32,0`,st:'fill:none;stroke:var(--dad);stroke-width:2.6;stroke-linecap:round'},s);H.O(p,0,{d:0});return p});
  const LONG=H.g(s);H.txt(LONG,544,72,'TWO VERSIONS OF OAS1','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  [['common version',102,0],['Neanderthal version',156,26]].forEach(([t,y,extra])=>{
    H.txt(LONG,462,y-8,t,'lbs');
    H.E('rect',{x:462,y:y,width:100,height:18,rx:4,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.4'},LONG);
    if(extra){H.E('rect',{x:562,y:y,width:extra,height:18,rx:4,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.4'},LONG);
      H.txt(LONG,575,y+32,'longer end','lbs',{'text-anchor':'middle'});}});
  H.txt(LONG,462,222,'the longer end anchors it','lbs');
  H.txt(LONG,462,238,'on the membrane, near the virus','lbs');H.O(LONG,0,{d:0});
  const RES=H.g(s);H.txt(RES,452,278,'RISK OF SEVERE ILLNESS','cap',{st:'fill:var(--ink);font-size:9.5px'});
  const r1=gbar(RES,462,300,18,'var(--muted)'),r2=gbar(RES,462,344,18,'var(--good)');
  H.txt(RES,462,296,'common version','lbs');H.txt(RES,462,340,'Neanderthal version','lbs');
  const rr=H.txt(RES,462,386,'about 20% lower','lbs',{st:'fill:var(--ink);font-weight:700'});H.O(rr,0,{d:0});H.O(RES,0,{d:0});
  return [
    ()=>{H.D(ss,1,{d:900})},
    ()=>{H.O(ss2,1,{d:0});H.D(ss2,1,{d:900});H.O(dl,1,{at:600})},
    ()=>{pop(OA);H.T(OA,{x:200,y:150},{d:1100,at:400});
      H.after(1500,()=>{pop(RL);H.O([ss,ss2],.2,{d:600});frag.forEach((p,i)=>H.O(p,1,{d:300,at:400+i*180}))})},
    ()=>{H.O(LONG,1,{d:500})},
    ()=>{H.O(RES,1,{d:400});grow(r1,140,{at:200});grow(r2,112,{at:500});H.O(rr,1,{at:1200})},
  ];}},

/* 16 ─────────────────────────────── */
{sec:'13.3',title:'Blood Group and Risk',caption:'Square = sugar A · circle = sugar B · the ABO gene sits on chromosome 9 · bar heights are schematic',
text:`<p data-step="0">The <b>ABO gene</b> makes an enzyme that adds one sugar to the chains on the surface of red blood cells. The A version adds sugar A, the B version adds sugar B. The O version has a one-letter deletion and makes no working enzyme, so group O cells carry the plain chain.</p>
<p data-step="1">Early comparisons of patients found the ABO gene among the signals. One study in Italy and Spain compared healthy people with patients in <b>respiratory failure</b>, lungs that cannot supply enough oxygen. Group O was less common among the patients, and group A more common.</p>
<p data-step="2">The difference is small next to age and other illnesses, and some later studies did not find it.</p>
<p data-step="3">Nobody has proved the reason. Researchers test two ideas. A particle carries the sugars of the cell that made it, so antibodies against those sugars can catch the particle. Blood group also changes the level of the proteins that clot blood.</p>
<p data-step="4">The link is an association between a group and a chance. Blood group does not decide who becomes ill, and it changes no advice for any person.</p>`,
star:'A real but small association. Group O is not a shield.',starStep:4,
scene(H){const s=stage();
  const cells=[['A',110,110],['B',250,110],['AB',390,110],['O',530,110]].map(([t,x,y])=>{const G=at(s,x,y);
    H.E('circle',{r:40,st:'fill:color-mix(in srgb, var(--bad) 26%, var(--card));stroke:var(--bad);stroke-width:2.4'},G);
    for(let k=0;k<6;k++){const a=k*60*Math.PI/180,px=52*Math.cos(a),py=52*Math.sin(a);
      H.E('line',{x1:40*Math.cos(a),y1:40*Math.sin(a),x2:46*Math.cos(a),y2:46*Math.sin(a),st:'stroke:var(--ink);stroke-width:1.5'},G);
      const useA=t==='A'||(t==='AB'&&k%2===0),useB=t==='B'||(t==='AB'&&k%2===1);
      if(useA)H.E('rect',{x:px-5,y:py-5,width:10,height:10,rx:2,st:'fill:var(--good);stroke:var(--ink);stroke-width:1'},G);
      if(useB)H.E('circle',{cx:px,cy:py,r:5.5,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1'},G);}
    H.txt(G,0,6,t,'big',{'text-anchor':'middle',st:'font-size:22px'});
    H.txt(G,0,78,'group '+t,'lbs',{'text-anchor':'middle'});H.O(G,0,{d:0});return G});
  const gx0=150,gx1=560,gy0=330,gy1=232;
  const CH=H.g(s);
  H.txt(CH,gx0,212,'SCHEMATIC: SHARE OF EACH BLOOD GROUP, PATIENTS VERSUS CONTROLS','cap',{st:'fill:var(--ink);font-size:9px'});
  H.E('line',{x1:gx0,y1:gy0,x2:gx1,y2:gy0,st:'stroke:var(--ink);stroke-width:2'},CH);
  const vals=[['A',.34,.42],['B',.11,.11],['AB',.05,.05],['O',.46,.32]];
  const bars=vals.map((v,i)=>{const x=gx0+22+i*98;
    H.txt(CH,x+26,gy0+20,'group '+v[0],'lbs',{'text-anchor':'middle'});
    return {a:vbar(CH,x,gy0,34,'var(--muted)'),b:vbar(CH,x+38,gy0,34,'var(--bad)'),va:v[1],vb:v[2]}});
  const key=H.g(CH);[['controls','var(--muted)',0],['patients','var(--bad)',96]].forEach(([t,c,dx])=>{
    H.E('rect',{x:gx0+dx,y:364,width:14,height:12,rx:2,st:`fill:${c}`},key);H.txt(key,gx0+dx+20,375,t,'lbs')});
  H.O(CH,0,{d:0});
  const nts=[H.txt(s,330,368,'','lb',{st:'font-size:12.5px'}),H.txt(s,330,390,'','lbs')];
  return [
    ()=>{cells.forEach((G,i)=>H.O(G,1,{d:400,at:i*200}))},
    ()=>{H.O(CH,1,{d:400});bars.forEach((b,i)=>{growV(b.a,(gy0-gy1)*b.va/.5,{at:i*150});growV(b.b,(gy0-gy1)*b.vb/.5,{at:150+i*150})});
      H.after(1200,()=>{nts[0].textContent='group O: less common among patients';nts[1].textContent='group A: more common among patients'})},
    ()=>{nts[0].textContent='small next to age and other illnesses';nts[1].textContent='not found in every study'},
    ()=>{nts[0].textContent='two ideas under test';nts[1].textContent='antibodies against A and B sugars · clotting proteins'},
    ()=>{nts[0].textContent='an association between a group and a chance';nts[1].textContent='it changes no advice for any person'},
  ];}},

/* 17 ─────────────────────────────── */
{sec:'13.3',title:'Rare Variants with Large Effects',caption:'Type I interferon is the alarm protein of the first days of an infection',
text:`<p data-step="0">Common variants change the chance a little. A rare broken gene in the interferon alarm can change it a lot.</p>
<p data-step="1"><b>TLR7</b> is a Toll-like receptor inside immune cells. It binds single-strand virus RNA and starts the signal for <b>type I interferon</b>, the alarm proteins of the first days of an infection.</p>
<p data-step="2">The <i>TLR7</i> gene sits on the X chromosome. A male has one X, so one broken copy leaves him with no working TLR7. In 2020 a Dutch team found broken <i>TLR7</i> copies in four young men, two pairs of brothers, all with severe COVID-19.</p>
<p data-step="3">About 3 or 4 of every 100 people with life-threatening COVID-19 carry a rare broken copy of an alarm gene. Examples are <i>TLR3</i>, <i>IRF7</i> and <i>IFNAR1</i>.</p>
<p data-step="4"><b>Pneumonia</b> is an infection that fills the air sacs of the lungs with fluid. In about 10 of every 100 people with life-threatening pneumonia, the body makes antibodies against its own interferon. Almost all are men, and the share rises with age. Nobody inherits these antibodies.</p>`,
star:'No interferon early, severe illness later.',starStep:3,
scene(H){const s=stage();
  H.E('rect',{x:20,y:58,width:600,height:196,rx:22,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.2'},s);
  H.txt(s,34,82,'IMMUNE CELL','cap');
  H.E('circle',{cx:110,cy:160,r:54,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2;stroke-dasharray:6 4'},s);
  const rna=H.E('path',{d:'M80,158 q15,-14 30,0 q15,14 30,0',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:2.8'},s);
  H.txt(s,174,120,'virus RNA in a bubble','lbs');
  const T7=at(s,110,200);H.E('path',{d:'M-22,0 A22,22 0 0 1 22,0 Z',st:'fill:var(--good);stroke:var(--ink);stroke-width:1.8'},T7);
  H.txt(T7,0,18,'TLR7','lb',{'text-anchor':'middle'});hide(T7);
  const chain=[[196,186],[258,166],[318,154]].map(([tx,ty])=>{const G=at(s,120,196);
    H.E('circle',{r:9,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.4'},G);H.O(G,0,{d:0});G.tx=tx;G.ty=ty;return G});
  const IF=at(s,382,150);H.E('circle',{r:24,st:'fill:var(--good);stroke:var(--ink);stroke-width:2'},IF);
  H.txt(IF,0,5,'IFN','lb',{'text-anchor':'middle',st:'fill:var(--paper)'});
  H.txt(IF,34,0,'type I interferon','lb',{st:'font-size:13px'});
  H.txt(IF,34,18,'warns every nearby cell','lbs');hide(IF);
  const X=H.g(s);H.E('path',{d:'M-14,-14 L14,14 M14,-14 L-14,14',st:'stroke:var(--bad);stroke-width:5;stroke-linecap:round'},X);
  H.T(X,{x:110,y:186},{d:0});H.O(X,0,{d:0});
  const xc=H.g(s);H.txt(xc,24,288,'TLR7 IS ON THE X CHROMOSOME','cap',{st:'fill:var(--ink)'});
  [['male: X and Y',304,['X','Y']],['female: X and X',348,['X','X']]].forEach(([t,y,pair])=>{
    H.txt(xc,24,y+20,t,'lb',{st:'font-size:13px'});
    pair.forEach((p,i)=>{const col=p==='Y'?'var(--muted)':'var(--dad)';
      H.E('rect',{x:154+i*32,y:y,width:24,height:p==='Y'?20:32,rx:5,st:`fill:${col};stroke:var(--ink);stroke-width:1.4`},xc);
      H.txt(xc,166+i*32,y+16,p,'lbs',{'text-anchor':'middle',st:'fill:var(--paper);font-weight:700'})})});
  H.txt(xc,24,404,'one broken copy leaves a male with no working TLR7','lb',{st:'font-size:13px'});H.O(xc,0,{d:0});
  const stats=H.g(s);H.txt(stats,290,306,'','lb',{st:'font-size:13px'});const s1=stats.lastChild;
  H.txt(stats,290,332,'','lb',{st:'font-size:13px'});const s2=stats.lastChild;H.O(stats,0,{d:0});
  return [
    ()=>{H.D(rna,1,{d:900})},
    ()=>{pop(T7);H.T(T7,{x:110,y:192},{d:900,at:400});
      chain.forEach((G,i)=>{H.T(G,{x:120,y:196},{d:0});H.O(G,1,{d:250,at:900+i*200});H.T(G,{x:G.tx,y:G.ty},{d:800,at:900+i*200})});
      H.after(1700,()=>{pop(IF)})},
    ()=>{H.O(X,1,{d:400});H.O([IF],.2,{d:600});chain.forEach(G=>H.O(G,.2,{d:600}));H.O(xc,1,{at:400})},
    ()=>{H.O(stats,1,{d:400});s1.textContent='3 or 4 in 100 severe cases: a rare broken alarm gene';s2.textContent=''},
    ()=>{s2.textContent='10 in 100: antibodies against their own interferon'},
  ];}},

/* 18 ─────────────────────────────── */
{sec:'13.3',title:'Common and Rare, Small and Large',caption:'Positions are approximate · they show the pattern, not exact measurements',
text:`<p data-step="0">DNA differences that change COVID-19 risk come in two kinds. The bottom axis counts carriers. Each step to the right means ten times as many carriers. For example, 1 in 1000 is ten times as common as 1 in 10 000.</p>
<p data-step="1"><b>Common variants</b> occur in many people. Each one changes the chance by a small amount. The chromosome 3 block, the <i>OAS1</i> version and the ABO signal all belong here. Studies of thousands of people find them.</p>
<p data-step="2"><b>Rare variants</b> occur in few people. Each one changes the chance by a large amount. A broken <i>TLR7</i> copy belongs here. Studies of single families and single patients find them.</p>
<p data-step="3">The two kinds need different methods. Together they explain part of why the same virus gives different illnesses.</p>`,
star:'Common and small, or rare and large.',starStep:3,
scene(H){const s=stage();const gx0=96,gx1=600,gy0=330,gy1=70;
  H.E('path',{d:`M${gx0},${gy1-12} L${gx0},${gy0} L${gx1+10},${gy0}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},s);
  const xs=[['1 in 10 000',0],['1 in 1000',.25],['1 in 100',.5],['1 in 10',.75],['1 in 2',1]];
  xs.forEach(([t,v])=>{const x=gx0+(gx1-gx0)*v;H.E('line',{x1:x,y1:gy0,x2:x,y2:gy0+6,st:'stroke:var(--ink);stroke-width:1.6'},s);
    H.txt(s,x,gy0+22,t,'lbs',{'text-anchor':'middle',st:'font-size:11px'})});
  H.txt(s,(gx0+gx1)/2,gy0+44,'how many people carry the variant','lb',{'text-anchor':'middle',st:'font-size:13px'});
  const ys=[['small',.1],['medium',.45],['large',.78],['very large',.97]];
  ys.forEach(([t,v])=>{const y=gy0-(gy0-gy1)*v;H.txt(s,gx0-8,y+4,t,'lbs',{'text-anchor':'end',st:'font-size:11px'});
    H.E('line',{x1:gx0-5,y1:y,x2:gx0,y2:y,st:'stroke:var(--ink);stroke-width:1.6'},s)});
  H.txt(s,gx0-78,gy1-18,'effect on the chance of severe illness','lb',{st:'font-size:13px'});
  const P=(x,y)=>[gx0+(gx1-gx0)*x,gy0-(gy0-gy1)*y];
  const pts=[['chromosome 3 block',.86,.42,'bad',1],['OAS1 version',.9,.3,'good',1],['ABO signal',.95,.16,'muted',1],
    ['broken TLR7 copy',.12,.95,'bad',2],['other broken alarm genes',.28,.82,'bad',2]];
  const dots=pts.map(([t,x,y,c,grp])=>{const [px,py]=P(x,y);const G=at(s,px,py,.001);
    H.E('circle',{r:9,st:`fill:${H.C(c)};stroke:var(--ink);stroke-width:1.6`},G);
    const anchor=x>.6?'end':'start';H.txt(G,anchor==='end'?-14:14,5,t,'lb',{'text-anchor':anchor,st:'font-size:12.5px'});
    H.O(G,0,{d:0});G.grp=grp;return G});
  const zoneA=H.g(s);H.E('rect',{x:P(.62,0)[0],y:gy1+140,width:gx1-P(.62,0)[0],height:gy0-gy1-140,rx:10,st:'fill:var(--good);opacity:.1'},zoneA);
  H.txt(zoneA,gx1-6,gy0-10,'common variants · found by comparing thousands of people','lbs',{'text-anchor':'end'});H.O(zoneA,0,{d:0});
  const zoneB=H.g(s);H.E('rect',{x:gx0+2,y:gy1-4,width:P(.42,0)[0]-gx0,height:118,rx:10,st:'fill:var(--bad);opacity:.1'},zoneB);
  H.txt(zoneB,gx0+10,gy1+128,'rare variants · found in single families','lbs');H.O(zoneB,0,{d:0});
  return [
    ()=>{},
    ()=>{H.O(zoneA,1,{d:500});dots.filter(d=>d.grp===1).forEach((G,i)=>pop(G,{at:300+i*250}))},
    ()=>{H.O(zoneB,1,{d:500});dots.filter(d=>d.grp===2).forEach((G,i)=>pop(G,{at:300+i*250}))},
    ()=>{dots.forEach(G=>H.T(G,{s:1.18},{d:400}));H.after(500,()=>dots.forEach(G=>H.T(G,{s:1},{d:400})))},
  ];}},

/* 19 ─────────────────────────────── */
{sec:'13.2 · 13.3',title:'Human Genes the Virus Meets',wide:true,steps:2,
text:`<div class="tblwrap" data-step="0"><table class="tbl">
<thead><tr><th>Human gene</th><th>Where</th><th>What the protein does</th><th>Why it matters here</th></tr></thead>
<tbody>
<tr><td>ACE2</td><td>X chromosome</td><td>enzyme on the cell surface; removes one amino acid from angiotensin II and so calms blood pressure and inflammation</td><td>the receptor that the spike binds; the door into the cell</td></tr>
<tr><td>TMPRSS2</td><td>chromosome 21</td><td>protease in the same membrane as ACE2</td><td>cuts the spike at the cell surface, so the membranes can join</td></tr>
<tr><td>FURIN</td><td>chromosome 15</td><td>protease inside the cell</td><td>makes the first cut in the spike, before the new particle leaves</td></tr>
<tr><td>CD209 (DC-SIGN), CLEC4M</td><td>chromosome 19</td><td>C-type lectin receptors; they bind sugar chains on germ surfaces</td><td>the C-lectin pathway; a scavenging cell catches the particle</td></tr>
<tr><td>HLA genes (human leukocyte antigen)</td><td>chromosome 6</td><td>show pieces of virus protein to T cells; the most variable genes we have</td><td>every person shows a slightly different set of virus pieces</td></tr>
</tbody></table></div>
<p data-step="1" class="note">Each of these proteins has a normal job in the body. The virus uses three of them, and the immune system uses the other two.</p>`,
star:'The door, the two scissors, the catcher and the display.',starStep:1},

/* 19b ─────────────────────────────── */
{sec:'13.3',title:'Genes Linked to Severe Illness',wide:true,steps:2,
text:`<div class="tblwrap" data-step="0"><table class="tbl">
<thead><tr><th>Gene or region</th><th>Where</th><th>What the protein does</th><th>What was found</th></tr></thead>
<tbody>
<tr><td>3p21.31 block (<i>LZTFL1</i>, <i>SLC6A20</i>, <i>CCR9</i>, <i>FYCO1</i>, <i>CXCR6</i>, <i>XCR1</i>)</td><td>chromosome 3</td><td><i>CCR9</i>, <i>CXCR6</i> and <i>XCR1</i> guide immune cells to tissues; <i>LZTFL1</i> acts in the cells that line the airways</td><td>strongest common risk signal; inherited from Neanderthals</td></tr>
<tr><td>OAS1</td><td>chromosome 12</td><td>detects double-strand RNA and activates RNase L</td><td>a Neanderthal version lowers the risk of severe illness</td></tr>
<tr><td>TYK2</td><td>chromosome 19</td><td>relays interferon signals inside cells</td><td>people with two copies of a variant that disables TYK2 have a much higher risk</td></tr>
<tr><td>IFNAR2</td><td>chromosome 21</td><td>part of the receptor that receives interferon</td><td>variants that lower the amount raise the risk</td></tr>
<tr><td>DPP9</td><td>chromosome 19</td><td>enzyme that acts on the inflammasome</td><td>a common variant is linked to severe illness</td></tr>
<tr><td>ABO</td><td>chromosome 9</td><td>enzyme that adds a sugar to red blood cell chains</td><td>small association; group O slightly less common among severe cases</td></tr>
<tr><td>TLR7</td><td>X chromosome</td><td>sensor for single-strand RNA; starts the interferon alarm</td><td>rare broken copies can cause severe illness in young men</td></tr>
<tr><td>TLR3, IRF7, IFNAR1</td><td>chromosomes 4, 11, 21</td><td>other parts of the interferon alarm</td><td>rare broken copies in a few of every hundred severe cases</td></tr>
</tbody></table></div>
<p data-step="1" class="note">The first six of these are based on comparisons of thousands of genomes. The last two are based on studies of single families and single patients.</p>`,
star:'Six common signals and two rare ones. Most of them act in the interferon alarm.',starStep:1},

/* 20 ─────────────────────────────── */
{sec:'13.4',title:'From Genome to Vaccine Design',caption:'A vaccine design needs the sequence of one gene, not the live virus',
text:`<p data-step="0">A <b>vaccine</b> teaches the immune system one germ in advance. The body then answers fast at the real meeting. A vaccine carries an <b>antigen</b>, the piece that the immune system learns.</p>
<p data-step="1">Chinese scientists read the whole SARS-CoV-2 genome within days of the first reports. They posted the sequence on the website virological.org on 11 January 2020. Laboratories everywhere then had all 29 903 letters.</p>
<p data-step="2">Every team picked the same antigen: the spike. Antibodies against the spike block the step that starts an infection, so the spike is the useful target.</p>
<p data-step="3">Letters 21 563 to 25 384 hold the spike gene. A designer needs that stretch only. The first mRNA vaccine design took days. The first dose in a trial followed on 16 March 2020.</p>
<p data-step="4">The sequence also gave the world its first tests. A PCR (polymerase chain reaction) test copies a short piece of the virus sequence millions of times. So even a few particles give a clear signal. The first tests appeared in the same weeks.</p>`,
star:'Publish the sequence, and every laboratory can start.',starStep:1,
scene(H){const s=stage();const x0=30,x1=612,Y=92,BH=30,TOT=29903;
  const X=v=>x0+(x1-x0)*v/TOT;
  H.E('rect',{x:x0,y:Y,width:x1-x0,height:BH,rx:4,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.6'},s);
  H.txt(s,x0,Y-14,'SARS-CoV-2 GENOME · PUBLISHED 11 JANUARY 2020','cap',{st:'fill:var(--ink)'});
  const sgene=H.E('rect',{x:X(21563),y:Y,width:X(25384)-X(21563),height:BH,rx:4,st:'fill:var(--bad);stroke:var(--ink);stroke-width:1.6'},s);
  H.O(sgene,0,{d:0});
  const sl=H.txt(s,X(23473),Y-14,'S gene','lb',{'text-anchor':'middle',st:'fill:var(--bad)'});H.O(sl,0,{d:0});
  const seq=H.g(s);const letters='ATGTTTGTTTTTCTTGTTTTATTGCCACTAGTCTCTAGTCAGTGTGTTAATCTTACAACCAGAACTCAA';
  for(let i=0;i<34;i++){H.txt(seq,x0+i*17,Y+58,letters[i],'lbs',{st:'font-family:ui-monospace,Menlo,monospace;font-weight:700;fill:var(--ink)'})}
  H.txt(seq,x0,Y+80,'the first letters of the spike gene','lbs');H.O(seq,0,{d:0});
  const AN=H.g(s);const SP=at(AN,120,268,1.8);spike(SP,0,0);
  H.txt(AN,120,320,'spike protein','lb',{'text-anchor':'middle'});
  H.txt(AN,120,340,'the antigen every vaccine uses','lbs',{'text-anchor':'middle'});H.O(AN,0,{d:0});
  const ab=at(s,250,230);H.E('path',{d:'M0,0 L0,16 M0,0 L-13,-12 M0,0 L13,-12',st:'fill:none;stroke:var(--good);stroke-width:4;stroke-linecap:round'},ab);
  H.txt(ab,34,-6,'antibodies block this step','lbs',{st:'fill:var(--good);font-weight:700'});hide(ab);
  const TL=H.g(s);const tx0=300,tx1=610,ty=300;
  H.E('line',{x1:tx0,y1:ty,x2:tx1,y2:ty,pathLength:1,cls:'draw k',st:'stroke-width:2'},TL);
  [['11 Jan 2020','sequence published',0],['Jan 2020','design on paper',.42],['16 Mar 2020','first trial dose',1]].forEach(([d,t,v],i)=>{
    const x=tx0+(tx1-tx0)*v;H.E('circle',{cx:x,cy:ty,r:5,st:'fill:var(--bad);stroke:var(--paper);stroke-width:2'},TL);
    H.txt(TL,x,ty-14,d,'lbs',{'text-anchor':i===2?'end':i?'middle':'start',st:'fill:var(--ink);font-weight:700'});
    H.txt(TL,x,ty+(i===1?40:22),t,'lbs',{'text-anchor':i===2?'end':i?'middle':'start'})});
  H.O(TL,0,{d:0});
  const pcr=H.txt(s,30,392,'','lb');
  return [
    ()=>{},
    ()=>{H.O(seq,1,{d:600})},
    ()=>{H.O(AN,1,{d:500});pop(ab,{at:500});H.T(ab,{x:120,y:202},{d:900,at:700})},
    ()=>{H.O(sgene,1,{d:600});H.O(sl,1,{at:400});H.O(TL,1,{at:600});H.D(TL.firstChild,1,{d:1000,at:600})},
    ()=>{pcr.textContent='the same sequence gave the first PCR tests'},
  ];}},

/* 21 ─────────────────────────────── */
{sec:'13.4',title:'mRNA Vaccines',caption:'Katalin Karikó, US Embassy Sweden, CC BY 2.0, via Wikimedia Commons · LNP = lipid nanoparticle',
text:`<p data-step="0">An <b>mRNA</b> (messenger RNA) vaccine carries a message, not a virus. RNA uses four letters: A, C, G and U. The message is a copy of the spike gene in RNA.</p>
<p data-step="1">RNA alone would not survive in the body. The message travels inside a <b>lipid nanoparticle</b>, a fat bubble about 100 nanometres wide. The bubble fuses with a cell and releases the message in the cytoplasm.</p>
<p data-step="2">Ribosomes read the message and make spike protein. The cell shows pieces of the spike on its surface, as an infected cell would.</p>
<p data-step="3">B cells then make antibodies against the spike, T cells learn it, and memory cells remain. The message decays within days. It never enters the nucleus and never joins your DNA.</p>
<p data-step="4">The message uses N1-methylpseudouridine, a changed form of the letter U (<b>uridine</b>). In 2005 Katalin Karikó and Drew Weissman found that such a change stops the cell's RNA sensors from raising an alarm. They received the Nobel Prize in Physiology or Medicine in 2023.</p>`,
star:'Message in, spike made, memory kept.',starStep:3,
scene(H){const s=stage();const MY=236;
  const LNP=at(s,330,92);
  H.E('circle',{r:34,st:'fill:var(--mom-tint);stroke:var(--mom);stroke-width:2.4'},LNP);
  for(let i=0;i<14;i++){const a=i*2*Math.PI/14;H.E('line',{x1:34*Math.cos(a),y1:34*Math.sin(a),x2:28*Math.cos(a),y2:28*Math.sin(a),st:'stroke:var(--mom);stroke-width:2'},LNP)}
  const msg=H.E('path',{d:'M-18,4 q9,-10 18,0 q9,10 18,0',st:'fill:none;stroke:var(--dad);stroke-width:2.6;stroke-linecap:round'},LNP);
  H.txt(LNP,0,56,'lipid nanoparticle','lb',{'text-anchor':'middle'});
  H.txt(LNP,0,74,'with spike mRNA inside','lbs',{'text-anchor':'middle'});hide(LNP);
  membrane(s,16,490,MY,{t:12});H.txt(s,24,MY+30,'YOUR CELL','cap');
  const inm=H.E('path',{d:'M232,302 q16,-14 32,0 q16,14 32,0',pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:3'},s);
  const rib=at(s,246,302,.001);H.E('circle',{r:15,st:'fill:var(--faint);stroke:var(--ink);stroke-width:1.6'},rib);
  H.E('path',{d:'M-15,2 A15,15 0 0 0 15,2 Z',st:'fill:var(--muted);stroke:var(--ink);stroke-width:1.4'},rib);
  H.txt(s,232,340,'ribosome reads the message','lbs');const ribl=s.lastChild;H.O(ribl,0,{d:0});
  const sp=[[352,MY],[404,MY],[452,MY]].map(([tx,ty])=>{const G=at(s,300,300,.001);spike(G,0,0,{});
    H.O(G,0,{d:0});G.tx=tx;G.ty=ty;return G});
  const B=at(s,564,104);H.E('circle',{r:28,st:'fill:var(--dad-tint);stroke:var(--ink);stroke-width:2'},B);H.txt(B,0,5,'B','big',{'text-anchor':'middle',st:'font-size:20px'});
  H.txt(B,0,46,'antibodies','lbs',{'text-anchor':'middle'});hide(B);
  const T=at(s,564,200);H.E('circle',{r:28,st:'fill:var(--mom-tint);stroke:var(--ink);stroke-width:2'},T);H.txt(T,0,5,'T','big',{'text-anchor':'middle',st:'font-size:20px'});
  H.txt(T,0,46,'T cells','lbs',{'text-anchor':'middle'});hide(T);
  const MEM=at(s,564,300);H.E('circle',{r:28,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2.4;stroke-dasharray:5 4'},MEM);
  H.txt(MEM,0,5,'M','big',{'text-anchor':'middle',st:'font-size:20px'});H.txt(MEM,0,46,'memory','lbs',{'text-anchor':'middle'});hide(MEM);
  const gone=H.txt(s,232,386,'','lbs',{st:'fill:var(--ink);font-weight:700'});
  const KP=H.g(s);photo(KP,'@@asset:c13-kariko.jpg@@',20,54,76,102,{r:8});
  H.txt(KP,106,78,'Katalin Karikó','lb',{st:'font-size:13px'});
  H.txt(KP,106,96,'changed RNA letter, 2005','lbs');
  H.txt(KP,106,114,'Nobel Prize 2023','lbs');H.O(KP,0,{d:0});
  return [
    ()=>{pop(LNP)},
    ()=>{H.T(LNP,{x:250,y:MY-46},{d:1300,at:200});H.after(1500,()=>{H.O(LNP,0,{d:500});H.D(inm,1,{d:800})})},
    ()=>{pop(rib);H.O(ribl,1,{at:300});H.T(rib,{x:330,y:302},{d:1500,at:400});
      sp.forEach((G,i)=>{H.T(G,{x:300,y:300,s:.001},{d:0});H.O(G,1,{d:300,at:700+i*300});
        H.T(G,{x:G.tx,y:G.ty,s:1},{d:900,at:700+i*300})})},
    ()=>{pop(B);pop(T,{at:250});pop(MEM,{at:500});gone.textContent='the message decays within days'},
    ()=>{H.O(KP,1,{d:500})},
  ];}},

/* 22 ─────────────────────────────── */
{sec:'13.4',title:'Four More Ways to Make a Vaccine',caption:'Every platform shows the immune system the same antigen: the spike',
text:`<p data-step="0">An <b>inactivated virus</b> vaccine uses whole particles that cannot copy themselves. Radiation or a chemical destroys the genome while the outside shape stays. The immune system sees the whole particle.</p>
<p data-step="1">A <b>viral vector</b> vaccine uses a harmless virus, often an adenovirus, as the delivery van. Scientists remove the genes it needs to copy itself and add the spike gene. The van enters a cell, and the cell makes spike.</p>
<p data-step="2">A <b>protein subunit</b> vaccine injects the spike protein itself. Scientists put the spike gene into insect cells (Nuvaxovid) or yeast cells (Corbevax). The cells grow and make the protein. Workers then collect and purify the protein.</p>
<p data-step="3">A <b>DNA</b> vaccine injects a small DNA ring, a plasmid, that carries the spike gene. The cell reads the DNA, makes the message and then makes the protein. ZyCoV-D, approved in India in 2021, was the first DNA vaccine for people.</p>
<p data-step="4">Every platform gives the body antibodies and T cells that know the spike, before the real virus arrives.</p>`,
star:'Whole particle, delivery van, ready protein, DNA ring or RNA message.',starStep:4,
scene(H){const s=stage();
  const panel=(x,y,w,h,t)=>{const G=H.g(s);H.E('rect',{x,y,width:w,height:h,rx:12,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.8'},G);
    H.txt(G,x+12,y+22,t,'cap',{st:'fill:var(--ink)'});H.O(G,0,{d:0});return G};
  const W=296,HT=158;
  const P1=panel(18,34,W,HT,'INACTIVATED VIRUS');
  const v1=virion(P1,96,118,30,{n:12});H.O(v1.rna,1,{d:0});v1.rna.style.strokeDashoffset=0;
  H.E('path',{d:'M78,100 L114,136 M114,100 L78,136',st:'stroke:var(--bad);stroke-width:4;stroke-linecap:round'},P1);
  H.txt(P1,200,106,'genome destroyed','lbs',{'text-anchor':'middle'});
  H.txt(P1,200,124,'shape kept','lbs',{'text-anchor':'middle'});
  H.txt(P1,200,150,'CoronaVac · Covaxin','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});
  const P2=panel(326,34,W,HT,'VIRAL VECTOR');
  const ad=at(P2,404,112);H.E('path',{d:'M0,-26 L23,-13 L23,13 L0,26 L-23,13 L-23,-13 Z',st:'fill:var(--dad-tint);stroke:var(--dad);stroke-width:2'},ad);
  H.E('rect',{x:-11,y:-7,width:22,height:14,rx:3,st:'fill:var(--bad);stroke:var(--ink);stroke-width:1.2'},ad);
  H.txt(P2,424,152,'harmless virus + spike gene','lbs',{'text-anchor':'middle'});
  H.txt(P2,520,108,'the cell makes','lbs',{'text-anchor':'middle'});H.txt(P2,520,126,'the spike','lbs',{'text-anchor':'middle'});
  const sp2=at(P2,520,80,1);spike(sp2,0,0);
  H.txt(P2,404,172,'','lbs');
  const P3=panel(18,214,W,HT,'PROTEIN SUBUNIT');
  const ye=at(P3,88,286);H.E('ellipse',{rx:26,ry:20,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.8'},ye);
  H.E('ellipse',{cx:22,cy:-14,rx:11,ry:9,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.6'},ye);
  H.txt(P3,96,326,'Corbevax: yeast cells','lbs',{'text-anchor':'middle'});
  H.txt(P3,96,344,'Nuvaxovid: insect cells','lbs',{'text-anchor':'middle'});
  const sp3=at(P3,214,288,1.1);spike(sp3,0,0);
  H.txt(P3,234,326,'purified spike protein','lbs',{'text-anchor':'middle'});
  
  const P4=panel(326,214,W,HT,'DNA PLASMID');
  const pl=at(P4,404,290);H.E('circle',{r:26,st:'fill:none;stroke:var(--dad);stroke-width:4'},pl);
  H.E('path',{d:'M-9,-24 A26,26 0 0 1 11,-23',st:'fill:none;stroke:var(--bad);stroke-width:7'},pl);
  H.txt(P4,424,334,'DNA ring with the spike gene','lbs',{'text-anchor':'middle'});
  H.txt(P4,520,276,'cell reads DNA','lbs',{'text-anchor':'middle'});
  H.txt(P4,520,294,'makes the message','lbs',{'text-anchor':'middle'});
  H.txt(P4,520,312,'then the spike','lbs',{'text-anchor':'middle'});
  H.txt(P4,404,352,'ZyCoV-D, India, 2021','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});
  const END=H.g(s);H.E('rect',{x:18,y:386,width:604,height:26,rx:8,st:'fill:var(--good);opacity:.14'},END);
  H.txt(END,320,404,'every platform ends with antibodies and T cells that know the spike','lb',{'text-anchor':'middle',st:'font-size:13px'});H.O(END,0,{d:0});
  return [()=>{H.O(P1,1,{d:500})},()=>{H.O(P2,1,{d:500})},()=>{H.O(P3,1,{d:500})},()=>{H.O(P4,1,{d:500})},()=>{H.O(END,1,{d:500})}];}},

/* 23 ─────────────────────────────── */
{sec:'13.4',title:'The Five Platforms Compared',wide:true,steps:3,
text:`<div class="tblwrap" data-step="0"><table class="tbl">
<thead><tr><th>Platform</th><th>What the injection contains</th><th>Where the spike comes from</th><th>Examples</th></tr></thead>
<tbody>
<tr><td>mRNA</td><td>spike mRNA inside a fat bubble</td><td>your own cells make it</td><td>Comirnaty, Spikevax</td></tr>
<tr><td>Viral vector</td><td>a harmless virus carrying the spike gene</td><td>your own cells make it</td><td>Vaxzevria, Jcovden, Sputnik V</td></tr>
<tr><td>Protein subunit</td><td>purified spike protein with an adjuvant</td><td>yeast or insect cells in a factory</td><td>Nuvaxovid, Corbevax</td></tr>
<tr><td>Inactivated virus</td><td>whole particles that cannot copy themselves</td><td>the particle itself carries it</td><td>CoronaVac, Covaxin</td></tr>
<tr><td>DNA plasmid</td><td>a DNA ring carrying the spike gene</td><td>your own cells make it</td><td>ZyCoV-D</td></tr>
</tbody></table></div>
<div class="cols" data-step="1"><div><h3>How a team picks a platform</h3><ul>
<li><b>Speed</b> favours mRNA and DNA designs. They need the sequence only, so a team can finish one in days.</li>
<li><b>Storage</b> favours protein and inactivated vaccines, which keep in a normal refrigerator. Early mRNA vaccines needed a deep freezer.</li>
<li><b>Experience</b> favours inactivated and protein vaccines, whose methods are more than fifty years old.</li>
</ul></div><div><h3>What an adjuvant does</h3><ul>
<li>An <b>adjuvant</b> is a substance added to a protein or inactivated vaccine.</li>
<li>The adjuvant makes the immune system treat the antigen as a real threat. The immune answer then grows stronger and lasts longer.</li>
<li>mRNA and viral-vector vaccines need none, because the delivery itself alerts the cell.</li>
</ul></div></div>
<p data-step="2" class="note">Every approach passed the same test. Thousands of volunteers received the vaccine or a dummy injection, and the teams then compared the two groups.</p>`,
star:'Same antigen, five deliveries. The choice is speed, storage and experience.',starStep:1},

/* 24 ─────────────────────────────── */
{sec:'13.4',title:'Testing and the First Injection',caption:'Vial and syringe from the first vaccination outside a trial · The wub, CC BY-SA 4.0, via Wikimedia Commons',
text:`<p data-step="0">Before use, a vaccine must pass a trial. Thousands of volunteers get the vaccine or a dummy injection. Neither the volunteers nor the doctors know who got which one.</p>
<p data-step="1">After some weeks the team counts the cases of illness in each group. The two groups are alike in every other way. So a large difference shows the work of the vaccine, not the work of chance.</p>
<p data-step="2">The United Kingdom authorized the first mRNA vaccine on 2 December 2020, under eleven months after the sequence appeared. Margaret Keenan, aged 90, received the first dose outside a trial on 8 December 2020.</p>
<p data-step="3">The photograph shows that vial and syringe. Health services have since given billions of doses worldwide.</p>`,
star:'Two groups, one difference, one answer.',starStep:1,
scene(H){const s=stage();
  const PH=H.g(s);photo(PH,'@@asset:c13-vaccine-vial.jpg@@',110,196,420,206,{r:12});H.O(PH,0,{d:0});
  const TR=H.g(s);
  const grp=(x,col,t)=>{const G=H.g(TR);
    for(let i=0;i<24;i++){const r=Math.floor(i/8),k=i%8;
      H.E('circle',{cx:x+k*18,cy:64+r*18,r:6.4,st:`fill:${col};stroke:var(--ink);stroke-width:1.1`},G)}
    H.txt(G,x+63,146,t,'lb',{'text-anchor':'middle',st:'font-size:13px'});return G};
  grp(70,'var(--dad-tint)','group 1: the vaccine');
  grp(380,'var(--wash)','group 2: a dummy injection');
  H.txt(TR,320,40,'NOBODY KNOWS WHO GOT WHICH','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  const CNT=H.g(s);
  const box=(x,n,t,col)=>{const G=H.g(CNT);H.E('rect',{x,y:176,width:166,height:84,rx:10,st:`fill:var(--card);stroke:${col};stroke-width:2.4`},G);
    H.txt(G,x+83,222,n,'big',{'text-anchor':'middle',st:'font-size:34px'});
    H.txt(G,x+83,246,t,'lbs',{'text-anchor':'middle'});return G};
  box(50,'few','cases of illness','var(--good)');box(424,'many','cases of illness','var(--bad)');
  H.txt(CNT,320,300,'the groups are alike in every other way','lb',{'text-anchor':'middle',st:'font-size:13px'});
  H.txt(CNT,320,322,'so the difference comes from the vaccine','lb',{'text-anchor':'middle',st:'font-size:13px'});H.O(CNT,0,{d:0});
  const DT=H.g(s);H.txt(DT,320,142,'2 December 2020: first authorization','lb',{'text-anchor':'middle'});
  H.txt(DT,320,166,'8 December 2020: first dose outside a trial','lb',{'text-anchor':'middle'});
  H.txt(DT,320,186,'Margaret Keenan, aged 90, United Kingdom','lbs',{'text-anchor':'middle'});H.O(DT,0,{d:0});
  return [
    ()=>{H.O(TR,1,{d:500})},
    ()=>{H.O(CNT,1,{d:500})},
    ()=>{H.O([TR,CNT],0,{d:400});H.O(DT,1,{d:500,at:400})},
    ()=>{H.O(PH,1,{d:600});H.T(DT,{y:-56},{d:700})},
  ];}},

/* 25 ─────────────────────────────── */
{sec:'13.4',title:'Why the Virus Keeps Changing',caption:'Schematic family tree · branch lengths and positions are not data',
text:`<p data-step="0">The enzyme that copies the virus genome makes mistakes. Each mistake changes one letter. Most changes do nothing, some harm the virus, and a few help it.</p>
<p data-step="1">A change in the spike gene can change the shape that antibodies recognise. It can also make the spike hold ACE2 more tightly. Such a change spreads, because its carrier virus infects more people.</p>
<p data-step="2">A group of particles with the same set of changes is a <b>variant</b>. Variants that spread widely get a Greek name, for example Alpha, Delta and Omicron. Omicron carried more than 30 amino acid changes in the spike alone.</p>
<p data-step="3">Laboratories read virus genomes from patient samples every week and compare them. The comparison builds a family tree and shows which variant is growing.</p>
<p data-step="4">When the spike changes far enough, makers rewrite the vaccine message with the newer spike sequence. The platform stays the same, so only the sequence in the message changes.</p>`,
star:'Copy, change, compare, update.',starStep:4,
scene(H){const s=stage();
  const node=(x,y)=>({x,y});
  const pts=[node(40,210),node(116,150),node(116,270),node(192,110),node(192,186),node(192,250),node(192,320),
             node(268,92),node(268,150),node(268,232),node(268,300),node(344,78),node(344,128),node(344,214),node(344,266),node(344,332)];
  const edges=[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[3,7],[3,8],[5,9],[6,10],[7,11],[8,12],[9,13],[9,14],[10,15]];
  const lines=edges.map(([a,b])=>H.E('path',{d:`M${pts[a].x},${pts[a].y} L${pts[a].x},${pts[b].y} L${pts[b].x},${pts[b].y}`,pathLength:1,cls:'draw k',st:'stroke-width:1.8'},s));
  const tips=[11,12,13,14,15].map(i=>H.E('circle',{cx:pts[i].x,cy:pts[i].y,r:5,st:'fill:var(--muted);stroke:var(--ink);stroke-width:1.2'},s));
  H.txt(s,40,190,'first genome','lbs');
  
  const nm=[['Alpha',11,'muted'],['Omicron',12,'bad'],['Delta',14,'mom']].map(([t,i,c])=>{const G=H.g(s);
    H.E('circle',{cx:pts[i].x,cy:pts[i].y,r:7,st:`fill:${H.C(c)};stroke:var(--ink);stroke-width:1.5`},G);
    H.txt(G,pts[i].x+14,pts[i].y+5,t,'lb',{st:'font-size:13px'});H.O(G,0,{d:0});return G});
  const SP=at(s,540,120,1.5);const sp=spike(SP,0,0);H.O(SP,0,{d:0});
  const marks=[[-8,-34],[6,-30],[-3,-24],[10,-40]].map(([dx,dy])=>{const e=H.E('circle',{cx:dx,cy:dy,r:3,st:'fill:var(--bad);stroke:var(--ink);stroke-width:.8'},SP);H.O(e,0,{d:0});return e});
  const spl=H.txt(s,540,186,'changes in the spike','lbs',{'text-anchor':'middle'});H.O(spl,0,{d:0});
  const upd=H.g(s);H.E('rect',{x:420,y:240,width:206,height:72,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.6'},upd);
  H.txt(upd,523,266,'vaccine update','lb',{'text-anchor':'middle'});
  H.txt(upd,523,288,'same platform,','lbs',{'text-anchor':'middle'});
  H.txt(upd,523,304,'newer spike sequence','lbs',{'text-anchor':'middle'});H.O(upd,0,{d:0});
  const watch=H.txt(s,24,370,'','lb',{st:'font-size:13px'});
  return [
    ()=>{H.D(lines.slice(0,6),1,{d:900});lines.slice(0,6).forEach((l,i)=>l.style.transitionDelay=i*90+'ms')},
    ()=>{H.O(SP,1,{d:400});marks.forEach((e,i)=>H.O(e,1,{d:300,at:300+i*200}));H.O(spl,1,{at:700})},
    ()=>{H.D(lines.slice(6),1,{d:1000});lines.slice(6).forEach((l,i)=>l.style.transitionDelay=i*80+'ms');nm.forEach((G,i)=>H.O(G,1,{d:400,at:700+i*250}))},
    ()=>{watch.textContent='laboratories read new genomes every week'},
    ()=>{H.O(upd,1,{d:500})},
  ];}},

/* 26 ─────────────────────────────── */
{sec:'13.5',title:'Summary',wide:true,steps:2,
text:`<div class="cols" data-step="0"><div><h3>The virus and the cell</h3><ul>
<li>A coronavirus is an RNA virus with a crown of spikes. SARS-CoV-2 causes COVID-19. Its genome is 29 903 RNA letters. Two long genes hold the copying tools, then come S, E, M and N, plus small accessory genes.</li>
<li>The spike protein binds the human ACE2 protein. The human proteases furin and TMPRSS2 cut the spike, the membranes join, and the RNA enters the cell.</li>
<li>Ribosomes read the RNA, the copying enzyme makes new genomes, and particles assemble and leave. The virus has no DNA stage.</li>
<li>Sensors such as TLR7 raise the interferon alarm. B cells make antibodies, T cells kill infected cells, and memory cells remain. A runaway release of cytokines is a cytokine storm, and it damages the lungs.</li>
</ul></div><div><h3>Human genes and vaccines</h3><ul>
<li>Genome-wide comparisons of patients and controls find regions linked to severe illness. A peak is an association, not a proven cause.</li>
<li>The strongest common signal is a block at 3p21.31 on chromosome 3. It came from Neanderthals and holds six genes, among them <i>LZTFL1</i>. A Neanderthal version of <i>OAS1</i> on chromosome 12 lowers risk. The ABO signal is small.</li>
<li>Rare broken copies of interferon genes, for example X-linked <i>TLR7</i>, cause severe illness in a few people. Antibodies against a person's own interferon do the same without any inherited change.</li>
<li>The genome sequence posted on 11 January 2020 let teams design vaccines at once. Five platforms are in use: mRNA, viral vector, protein subunit, inactivated virus and DNA plasmid. All of them teach the body the spike.</li>
</ul></div></div>
<div data-step="1"><h3>Numbers worth keeping</h3><div class="terms">
<div class="term"><b>29 903</b>RNA letters in the SARS-CoV-2 genome.</div>
<div class="term"><b>16 and 50 in 100</b>people who carry the chromosome 3 risk block in Europe and in South Asia.</div>
<div class="term"><b>about 1.6 to 1.8 times</b>need for breathing support with one copy of that block, in the first large comparisons.</div>
<div class="term"><b>about 20 percent lower</b>risk of severe illness with the Neanderthal <i>OAS1</i> version.</div>
<div class="term"><b>10 in 100</b>people with life-threatening pneumonia who carry antibodies against their own interferon.</div>
</div></div>`},

/* 27 ─────────────────────────────── */
{sec:'13.6',title:'Key Terms: the Virus and the Body',wide:true,steps:1,
text:`<div class="terms" data-step="0">
<div class="term"><b>Coronavirus</b>A group of RNA viruses with a crown of spike proteins. They infect mammals and birds and cause illnesses from a common cold to severe lung illness.</div>
<div class="term"><b>SARS-CoV-2</b>The coronavirus that causes COVID-19. Its genome is one RNA strand of 29 903 letters.</div>
<div class="term"><b>COVID-19</b>The illness caused by SARS-CoV-2. Most cases are mild. Severe cases affect the lungs.</div>
<div class="term"><b>Spike protein (S)</b>The virus protein that projects from the envelope and binds ACE2. Three S proteins form one spike.</div>
<div class="term"><b>Angiotensin-converting enzyme 2 (ACE2)</b>A human enzyme in the outer membrane of many cell types. The enzyme removes one amino acid from angiotensin II, and so lowers blood pressure and inflammation. The spike binds it.</div>
<div class="term"><b>Receptor-binding domain</b>The small part of S1 that touches ACE2. Antibodies against it block infection.</div>
<div class="term"><b>Protease</b>An enzyme that cuts other proteins. Furin and TMPRSS2 are the human proteases that cut the spike.</div>
<div class="term"><b>Nucleocapsid protein (N)</b>The virus protein that binds the RNA genome and folds it into a coil.</div>
<div class="term"><b>Membrane protein (M), envelope protein (E)</b>The two virus proteins that build and shape the fatty envelope.</div>
<div class="term"><b>Toll-like receptor</b>A family of sensor proteins that bind shapes found only on germs. TLR7 binds single-strand RNA and starts the interferon alarm.</div>
<div class="term"><b>Interferon</b>An alarm protein from an infected cell. Nearby cells then start to make antiviral proteins.</div>
<div class="term"><b>C-lectin pathway</b>The route in which C-type lectin receptors on immune cells bind sugar chains on a germ. The cell then catches the germ and shows its pieces to other immune cells.</div>
<div class="term"><b>Cytokine</b>A small signal protein that immune cells release to call other immune cells.</div>
<div class="term"><b>Inflammasome</b>A protein complex inside a cell that assembles on damage or infection and starts strong inflammation signals.</div>
<div class="term"><b>Cytokine storm</b>A runaway release of cytokines. The level rises far above the useful level and damages the lung tissue.</div>
</div>`},

/* 29 ─────────────────────────────── */
{sec:'13.6',title:'Key Terms: Genes and Vaccines',wide:true,steps:1,
text:`<div class="terms" data-step="0">
<div class="term"><b>Genome-wide association study</b>A comparison of millions of single-letter DNA differences between patients and controls. It finds the regions linked to an illness.</div>
<div class="term"><b>Association</b>A link between a DNA difference and a chance of an outcome. An association alone does not prove a cause.</div>
<div class="term"><b>Block (haplotype)</b>A stretch of a chromosome inherited as one piece, because crossing over rarely cuts inside it. All its genes travel together.</div>
<div class="term"><b>Neanderthals</b>A human group in Europe and western Asia until about 40 000 years ago. People with ancestry outside Africa carry about 2 percent Neanderthal DNA.</div>
<div class="term"><b>OAS1</b>A human gene on chromosome 12. Its protein detects double-strand RNA and activates RNase L, which cuts RNA inside the cell.</div>
<div class="term"><b>ABO gene</b>The gene on chromosome 9. Its enzyme adds sugar A or sugar B to chains on red blood cells. The O allele has a one-letter deletion and makes no working enzyme.</div>
<div class="term"><b>Vaccine</b>A preparation that teaches the immune system one germ without the illness. The body then answers quickly at the real meeting.</div>
<div class="term"><b>Antigen</b>The piece that the immune system learns. In COVID-19 vaccines the antigen is the spike.</div>
<div class="term"><b>Lipid nanoparticle</b>A fat bubble about 100 nanometres wide that carries mRNA into a cell.</div>
<div class="term"><b>Adjuvant</b>A substance added to a protein or inactivated vaccine so that the immune answer is stronger and lasts longer.</div>
<div class="term"><b>Variant</b>A group of virus particles that share the same set of genome changes.</div>
<div class="term"><b>Antibody</b>A Y-shaped immune protein made by B cells. It sticks to one shape on a germ, for example the spike.</div>
</div>`},

/* Q1 ─────────────────────────────── */
{sec:'13.2',title:'Check Your Understanding (1)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">1. Describe, in order, how SARS-CoV-2 enters a human cell.</div><button>Show answer</button><div class="a" hidden><b>1.</b> The receptor-binding domain of S1 rises and binds ACE2 in the cell membrane. <b>2.</b> Furin has already cut between S1 and S2 inside the cell that made the particle. <b>3.</b> TMPRSS2, in the same membrane as ACE2, makes the second cut in S2. <b>4.</b> S1 separates. The fusion end of S2 pushes into the cell membrane. S2 then folds in half and pulls the two membranes together. <b>5.</b> The RNA genome enters the cytoplasm. If the cell has little TMPRSS2, it takes the particle into a vesicle and cathepsin proteases make the cut there.</div></div>
<div class="qa"><div class="q">2. What is the normal job of ACE2, and what changes when a virus binds it?</div><button>Show answer</button><div class="a" hidden>Angiotensin II is a signal protein of eight amino acids. It narrows blood vessels and raises inflammation. ACE2 removes one amino acid from it. The seven-amino-acid piece that remains widens blood vessels and lowers inflammation, so ACE2 calms the system. A bound virus blocks this work. Researchers think that angiotensin II then increases. Inflammation and tissue damage then rise, most of all in the lungs and heart.</div></div>
<div class="qa"><div class="q">3. Why does the virus need a human protease at all? Predict what happens in a cell that has ACE2 but almost no TMPRSS2.</div><button>Show answer</button><div class="a" hidden>The spike holds its fusion end folded inside itself. A cut releases that end, so the stalk can change shape and pull the membranes together. Without a cut the virus sticks to the cell but cannot enter. A cell with ACE2 and almost no TMPRSS2 uses the slower route. It takes the particle into a vesicle, and cathepsin proteases inside make the cut.</div></div>
<div class="qa"><div class="q">4. The virus genome is 29 903 letters. A human <b>gamete</b> (an egg or sperm cell) carries one copy of the genome, about 3000 million DNA letters. How many times larger is the human genome? Why can the virus manage with so little?</div><button>Show answer</button><div class="a" hidden>3 000 000 000 ÷ 29 903 ≈ 100 000 times larger. The virus carries only the genes for its own shell and its own copying tools. It borrows everything else from the cell: ribosomes, amino acids, nucleotides, membranes and energy.</div></div>
</div>`},

/* Q2 ─────────────────────────────── */
{sec:'13.3',title:'Check Your Understanding (2)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">5. Name the four structural proteins of SARS-CoV-2 and give the job of each.</div><button>Show answer</button><div class="a" hidden><b>S (spike):</b> binds ACE2 and starts the entry. <b>E (envelope):</b> small protein that helps particles form and leave. <b>M (membrane):</b> sits in the envelope and gives the particle its shape. <b>N (nucleocapsid):</b> binds the RNA genome and folds it into a tight coil.</div></div>
<div class="qa"><div class="q">6. What is a cytokine storm, and why does it make breathing hard?</div><button>Show answer</button><div class="a" hidden>Cytokines are signal proteins that call immune cells to the infected tissue. In a cytokine storm the release does not stop, and the level climbs far above the useful level. Immune cells and their signals damage the thin wall between the air sacs and the blood vessels. Fluid then enters the air sacs, so oxygen crosses into the blood less well.</div></div>
<div class="qa"><div class="q">7. A genome-wide comparison gives a peak on chromosome 3 that covers six genes. Why can the study not name the gene that causes the risk?</div><button>Show answer</button><div class="a" hidden>The six genes sit in one block of about 50 000 letters. A child inherits the whole block as one piece, because crossing over almost never cuts inside it. Every carrier of the risk version carries all six together, so all six show the same association. Separating them needs other evidence, for example measurements of gene activity in lung cells. That later work identified <i>LZTFL1</i>.</div></div>
<div class="qa"><div class="q">8. A father carries one copy of the chromosome 3 risk block. The mother carries none. What is the chance that a child inherits the block? That two children both inherit it?</div><button>Show answer</button><div class="a" hidden>The father has one chromosome 3 with the block and one without. So half of his sperm cells carry it, and the chance is 1/2. The mother contributes no copy. So each child has a 1/2 chance. The two children are independent events, so both: 1/2 × 1/2 = 1/4.</div></div>
</div>`},

/* Q3 ─────────────────────────────── */
{sec:'13.3',title:'Check Your Understanding (3)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">9. Both parents carry one copy of the block. What is the chance a child has two copies? At least one copy? No copy?</div><button>Show answer</button><div class="a" hidden>Each parent passes the block with chance 1/2. Two copies: 1/2 × 1/2 = 1/4. No copy: 1/2 × 1/2 = 1/4. At least one copy: 1 − 1/4 = 3/4. An <b>allele</b> is one version of a stretch of DNA. Here R is the risk block and r is no block. A <b>Punnett square</b> is a grid that pairs each gamete of one parent with each gamete of the other. For Rr × Rr the grid gives RR 1/4, Rr 1/2 and rr 1/4.</div></div>
<div class="qa"><div class="q">10. In a town of 1000 adults, 160 carry one copy of the risk block. Of the people with no copy, 5 in 100 who catch the virus become severely ill. Carriers have about 1.6 times that chance. How many severe cases does each group give?</div><button>Show answer</button><div class="a" hidden>Non-carriers: 1000 − 160 = 840 people, at 5 in 100 → 840 × 0.05 = 42 severe cases. Carriers: 160 people, at 1.6 × 5 = 8 in 100 → 160 × 0.08 = 12.8, so about 13 severe cases. Total about 55. Most severe cases are in the larger non-carrier group, although each carrier has the higher chance.</div></div>
<div class="qa"><div class="q">11. Why did broken copies of <i>TLR7</i> cause severe illness in young men rather than in young women?</div><button>Show answer</button><div class="a" hidden><i>TLR7</i> sits on the X chromosome. A male has one X and one Y, so he has one copy of the gene and no backup. One broken copy leaves him with no working TLR7, so his cells cannot start the interferon alarm by that route. A female has two X chromosomes, so a second, working copy is usually present. (Early in development, each of her cells silences one X at random. This process is X-inactivation. Cells that keep the working copy active still make TLR7, and <i>TLR7</i> partly escapes X-inactivation.)</div></div>
<div class="qa"><div class="q">12. Name two different ways a person can have no working interferon alarm.</div><button>Show answer</button><div class="a" hidden><b>Inherited:</b> a rare broken copy of a gene in the alarm, for example <i>TLR7</i>, <i>TLR3</i>, <i>IRF7</i> or <i>IFNAR1</i>. Doctors find this in about 3 or 4 of every 100 people with life-threatening COVID-19. <b>Acquired:</b> the body makes antibodies against its own interferon. Doctors find this in about 10 of every 100 people with life-threatening pneumonia. Almost all of them are men, the share rises with age, and no one inherits it.</div></div>
</div>`},

/* Q4 ─────────────────────────────── */
{sec:'13.4',title:'Check Your Understanding (4)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">13. Describe the five vaccine platforms and say what is in each injection.</div><button>Show answer</button><div class="a" hidden><b>mRNA:</b> spike mRNA in a lipid nanoparticle; your cells make the spike. <b>Viral vector:</b> a harmless virus that cannot copy itself, carrying the spike gene; your cells make the spike. <b>Protein subunit:</b> purified spike protein grown in yeast or insect cells, with an adjuvant. <b>Inactivated virus:</b> whole particles whose genome radiation or a chemical has destroyed. <b>DNA plasmid:</b> a small DNA ring with the spike gene; the cell reads it, makes the message, then the protein. All five give the body the same antigen.</div></div>
<div class="qa"><div class="q">14. Why could vaccine design start in January 2020, before any laboratory outside China had the virus?</div><button>Show answer</button><div class="a" hidden>Chinese scientists posted the full genome sequence on virological.org on 11 January 2020. An mRNA, DNA or viral-vector design needs only the letters of the spike gene. That gene runs from position 21 563 to 25 384. Teams wrote that sequence into their own construct. Laboratories needed the live virus later, for tests, but not for the design.</div></div>
<div class="qa"><div class="q">15. Why does an mRNA vaccine not change your DNA?</div><button>Show answer</button><div class="a" hidden>The vaccine contains RNA, not DNA. The message stays in the cytoplasm, and your DNA is in the nucleus. DNA from an RNA message needs an enzyme called reverse transcriptase. The vaccine does not carry it, and our cells do not supply it for this message. Ribosomes read the message, and the message then decays within days.</div></div>
<div class="qa"><div class="q">16. Why do new variants appear, and how do vaccine makers answer?</div><button>Show answer</button><div class="a" hidden>The enzyme that copies the virus genome makes mistakes. Each round adds new single-letter changes to the population of particles. Most changes do nothing. A change that makes the spike bind ACE2 better, or that changes the shape antibodies recognise, spreads. A set of such changes defines a variant. Laboratories read genomes from patient samples, compare them and see which variant grows. When the spike has changed far enough, makers rewrite the vaccine with the newer spike sequence. The platform stays the same.</div></div>
</div>`},

]});
})();
