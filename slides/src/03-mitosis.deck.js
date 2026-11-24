/* Chapter 3 · The Cell Cycle and Mitosis — source: Hairdity.pdf pp.58–77 (Singh, Introduction to Genetics, CC BY-NC-SA 4.0) */
(function(){
const H=window.HL;
/* ---- deck-local helpers ---- */
// tiny cell glyph: unit circle scaled to radius; nucleus + two chromatin dots
function blob(p,o){const G=H.g(p);H.E('circle',{r:1,cls:'cellfill nss',st:'stroke:var(--ink);stroke-width:2.5'},G);
  H.E('circle',{r:.45,cls:'nss',st:'fill:none;stroke:var(--ink);stroke-width:1.3;stroke-dasharray:4 3'},G);
  H.E('circle',{r:.11,cx:-.15,cy:.02,st:'fill:var(--dad)'},G);H.E('circle',{r:.11,cx:.16,cy:-.04,st:'fill:var(--mom)'},G);
  H.T(G,{x:o.x,y:o.y,s:o.r},{d:0});return G;}
// straight chromosome bar (unreplicated), with optional coloured tip
function bar(p,x,y,len,color,o){o=o||{};const G=H.g(p);
  H.E('line',{x1:x,y1:y-len/2,x2:x,y2:y+len/2,st:`stroke:${H.C(color)};stroke-width:${o.w||6};stroke-linecap:round`},G);
  if(o.tip)H.E('line',{x1:x,y1:y+len/2-o.tipLen,x2:x,y2:y+len/2,st:`stroke:${H.C(o.tip)};stroke-width:${o.w||6};stroke-linecap:round`},G);
  return G;}
function miniCell(p,x,y,r,bars){const G=H.g(p);H.E('circle',{cx:x,cy:y,r,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},G);
  bars.forEach(b=>bar(G,x+b[0],y,b[1],b[2],b[3]));return G;}
function drawA(a,o){H.D(a.firstChild,1,Object.assign({d:600},o));H.O(a.lastChild,1,Object.assign({d:200},o,{at:((o&&o.at)||0)+450}));}
function mkA(p,x1,y1,x2,y2,o){const a=H.arrow(p,x1,y1,x2,y2,o);H.O(a.lastChild,0,{d:0});return a;}
function pop(e,o){H.T(e,{s:1},Object.assign({d:700},o));H.O(e,1,Object.assign({d:300},o));}
function hide(e){H.T(e,{s:.001},{d:0});H.O(e,0,{d:0});}

deck({
docTitle:'Mitosis · Heredity Ch.3',
title:'The Cell Cycle and Mitosis',
chapter:3,
eyebrow:'Heredity · Chapter 3 · The Cell Cycle and Mitosis',
slides:[

/* 1 ─────────────────────────────── */
{sec:'3.1',title:'The Cell Cycle and Mitosis',caption:'After Fig. 3.1.1 · cell growth, cell division, cell proliferation',
text:`<p data-step="0">Your body started as one cell. Two processes made all of your other cells: growth and division.</p>
<p data-step="1"><b>Growth.</b> The cell makes more of its own parts and becomes larger.</p>
<p data-step="2"><b>Division.</b> The parent cell splits into two <b>daughter cells</b>. Each daughter cell is half the size of the parent cell.</p>
<p data-step="3">Each daughter cell grows and then divides again. Each round of division doubles the number of cells: 1, 2, 4, 8.</p>
<p data-step="4">Growth and division together are <b>cell proliferation</b>.</p>
<p data-step="4" class="note">An organism with many cells needs growth and division to develop. <b>Asexual reproduction</b> (reproduction without sex) also needs growth and division.</p>`,
star:'Grow, copy, split. Repeat.',starStep:4,
scene(H){const s=document.getElementById('stage');const P=H.g(s);
  const gen=[[[320,210]],[[230,210],[410,210]],[[200,145],[200,275],[440,145],[440,275]],
    [[140,145],[260,145],[140,275],[260,275],[380,145],[500,145],[380,275],[500,275]]];
  const cells=[];for(let i=0;i<8;i++){const c=blob(P,{x:320,y:210,r:.001});cells.push(c);H.O(c,i===0?1:0,{d:0})}
  const lab=H.txt(P,320,395,'',`cap`,{'text-anchor':'middle'});
  const place=(g,r,o)=>cells.forEach((c,i)=>{const per=8>>g;const k=Math.floor(i/per);const [x,y]=gen[g][k];
      if(i%per===0)H.O(c,1,{d:200,at:o&&o.at});H.T(c,{x,y,s:r},o)});
  const say=t=>{lab.textContent=t};
  return [
    ()=>{H.T(cells[0],{s:34},{d:800});say('one cell')},
    ()=>{H.T(cells[0],{s:66},{d:1100});say('growth')},
    ()=>{place(1,46,{d:1000});say('division · 2 cells')},
    ()=>{place(1,64,{d:700});H.after(800,()=>{place(2,42,{d:1000});say('grow, then divide · 4 cells')})},
    ()=>{place(2,56,{d:700});H.after(800,()=>{place(3,40,{d:1000});H.after(1100,()=>place(3,50,{d:800}));say('proliferation · 8 cells')})},
  ];}},

/* 2 ─────────────────────────────── */
{sec:'3.1',title:'Two Ways to Divide',caption:'Blue = from dad, orange = from mom · 2n = 4 in this model',
text:`<p data-step="0"><b>Eukaryotes</b> are organisms whose cells have a nucleus. Eukaryotic cells divide in two ways.</p>
<p data-step="1"><b>Mitosis</b> makes body cells. One parent cell divides once and makes two daughter cells. Each daughter cell gets one copy of each chromosome of the parent cell. So the daughter cells are genetically identical to the parent cell.</p>
<p data-step="2"><b>Meiosis</b> makes <b>gametes</b> (sperm cells and egg cells). Each gamete gets half the number of chromosomes of the parent cell. A cell with one set of chromosomes is <b>haploid</b>. A cell with two sets is <b>diploid</b>.</p>
<p data-step="3">Mitosis is also called the vegetative division. Meiosis is also called the reproductive division.</p>`,
star:'miTosis = my Toes (body cells). meiOsis = makes Ova (egg cells) and sperm.',starStep:3,
scene(H){const s=document.getElementById('stage');
  const P2n=[[-21,40,'dad'],[-7,40,'mom'],[7,24,'dad'],[21,24,'mom']];
  const A=H.g(s),B=H.g(s);
  H.txt(A,170,32,'MITOSIS','cap',{'text-anchor':'middle'});H.txt(B,480,32,'MEIOSIS','cap',{'text-anchor':'middle'});
  const pa=miniCell(A,170,100,48,P2n),pb=miniCell(B,480,100,48,P2n);
  H.E('line',{x1:320,y1:20,x2:320,y2:400,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  const arA=[mkA(A,158,156,112,226),mkA(A,182,156,228,226)];
  const arB=[mkA(B,466,156,436,196),mkA(B,494,156,524,196)];
  const dA=[miniCell(A,105,285,48,P2n),miniCell(A,235,285,48,P2n)];
  const g4=[[[-9,40,'dad'],[9,24,'mom']],[[-9,40,'dad',{tip:'mom',tipLen:14}],[9,24,'mom']],[[-9,40,'mom',{tip:'dad',tipLen:14}],[9,24,'dad']],[[-9,40,'mom'],[9,24,'dad']]];
  const dB=[[430,250],[530,250],[430,350],[530,350]].map((q,i)=>miniCell(B,q[0],q[1],38,g4[i]));
  const lA=H.txt(A,170,375,'2 cells · identical · 2n','lb',{'text-anchor':'middle'}),lA2=H.txt(A,170,395,'same chromosomes as the parent','lbs',{'text-anchor':'middle'});
  const lB1=H.txt(B,480,375+30,'4 cells · all different · n','lb',{'text-anchor':'middle'});const lB2=H.txt(B,480,200,'','lbs');
  [...dA,...dB].forEach(hide);H.O([lA,lA2,lB1,lB2],0,{d:0});
  dA.forEach((c,i)=>{c.style.transformOrigin=`${[105,235][i]}px 285px`});dB.forEach((c,i)=>{c.style.transformOrigin=`${[430,530,430,530][i]}px ${[250,250,350,350][i]}px`});
  return [
    ()=>{pop(pa);pop(pb)},
    ()=>{arA.forEach(a=>drawA(a));dA.forEach((c,i)=>pop(c,{at:400+i*150}))},
    ()=>{arB.forEach(a=>drawA(a));dB.forEach((c,i)=>pop(c,{at:400+i*150}))},
    ()=>{H.O([lA,lA2,lB1,lB2],1,{d:600})},
  ];}},

/* 3 ─────────────────────────────── */
{sec:'3.2',title:'The Cell Cycle',caption:'After Fig. 3.2.1 · sector size shows the relative time of each phase',
text:`<p data-step="0">The <b>cell cycle</b> is the repeated sequence of cell growth and cell division. The cycle has four phases.</p>
<p data-step="1"><b>G1 (gap 1).</b> The cell does its usual work and grows. A new daughter cell starts at half the size of its parent, so it must grow before it divides.</p>
<p data-step="2"><b>S (synthesis).</b> The cell replicates (copies) the DNA of each chromosome. After S, each chromosome has two identical <b>sister chromatids</b>. The chromosomes stay long and thin.</p>
<p data-step="3"><b>G2 (gap 2).</b> The cell grows more and makes the proteins that division needs.</p>
<p data-step="4"><b>M (mitosis).</b> The nucleus divides, and then the cytoplasm divides. One cell becomes two cells.</p>
<p data-step="5">G1, S and G2 together are <b>interphase</b>. Interphase uses most of the time in each cycle. The size of each sector shows the relative time of its phase.</p>
<p data-step="6">After M, each daughter cell starts the cycle again at G1.</p>`,
star:'G1 grow · S copy · G2 prepare · M divide.',starStep:5,
scene(H){const s=document.getElementById('stage');const cx=190,cy=205,R0=100,R1=148;
  const ph=[{n:'G1',a0:10,a1:165,f:'dad-tint',t:'cell growth'},{n:'S',a0:165,a1:275,f:'mom-tint',t:'DNA copying'},{n:'G2',a0:275,a1:330,f:'wash',t:'growth'},{n:'M',a0:330,a1:370,f:'ink',t:''}];
  const W=H.g(s);const secs=ph.map(p=>{const e=H.E('path',{d:H.sectorD(cx,cy,R0,R1,p.a0,p.a1),st:`fill:${H.C(p.f)};stroke:var(--ink);stroke-width:2;fill-opacity:0`},W);return e});
  const ring=[H.E('path',{d:H.arcD(cx,cy,R1,0,359.9),pathLength:1,cls:'draw k',st:'stroke-width:2'},W),H.E('path',{d:H.arcD(cx,cy,R0,0,359.9),pathLength:1,cls:'draw k',st:'stroke-width:2'},W)];
  const labs=ph.map(p=>{const a=(p.a0+p.a1)/2*Math.PI/180,r=(R0+R1)/2;const G=H.g(W);
    H.txt(G,cx+r*Math.sin(a),cy-r*Math.cos(a)+(p.t?-2:6),p.n,'big',{'text-anchor':'middle',st:p.n==='M'?'fill:var(--paper);font-size:20px':'font-size:22px'});
    if(p.t)H.txt(G,cx+r*Math.sin(a),cy-r*Math.cos(a)+15,p.t,'lbs',{'text-anchor':'middle'});H.O(G,0,{d:0});return G});
  const inter=H.g(W);H.E('path',{d:H.arcD(cx,cy,R1+14,12,328),pathLength:1,cls:'draw k',st:'stroke-width:3;stroke-linecap:round'},inter);
  H.txt(inter,cx,cy+R1+34,'INTERPHASE = G1 + S + G2','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});H.O(inter,0,{d:0});
  const hub=H.txt(W,cx,cy+6,'','lb',{'text-anchor':'middle'});
  const dot=H.E('circle',{r:9,st:'fill:var(--mom);stroke:var(--paper);stroke-width:3'},W);
  // right: model cell driven by u (0..1 around the cycle)
  const M=H.g(s);const mx=500,my=205;H.txt(M,mx,40,'MODEL CELL','cap',{'text-anchor':'middle'});
  const phase=H.txt(M,mx,385,'','lb',{'text-anchor':'middle'});
  const sk=H.g(M),fl=H.g(M);const cA=[H.E('circle',{st:'fill:none;stroke:var(--ink);stroke-width:5'},sk),H.E('circle',{cls:'cellfill'},fl)];
  const cB=[H.E('circle',{st:'fill:none;stroke:var(--ink);stroke-width:5'},sk),H.E('circle',{cls:'cellfill'},fl)];
  const nuc=H.E('circle',{st:'fill:none;stroke:var(--ink);stroke-width:1.5;stroke-dasharray:6 4'},M);
  const chr=['dad','mom'].map((c,i)=>[0,1].map(()=>H.E('line',{st:`stroke:${H.C(c)};stroke-width:6;stroke-linecap:round`},M)));
  const A=a=>(a-10)/360; // angle->u
  function render(u){u=((u%1)+1)%1;const ang=10+360*u;const deg=ang>=360?ang-360:ang;
    const r=(R0+R1)/2;dot.setAttribute('cx',cx+r*Math.sin(ang*Math.PI/180));dot.setAttribute('cy',cy-r*Math.cos(ang*Math.PI/180));
    let rad,sis=0,sep=0,name;
    if(ang<165){const f=(ang-10)/155;rad=42+20*f;name='G1 · the cell grows'}
    else if(ang<275){const f=(ang-165)/110;rad=62+4*f;sis=f;name='S · each chromosome is copied'}
    else if(ang<330){const f=(ang-275)/55;rad=66+8*f;sis=1;name='G2 · the cell gets ready'}
    else{const f=(ang-330)/40;rad=74-24*f;sis=1;sep=f;name='M · the cell divides'}
    const d=sep*58;[[cA,-d],[cB,d]].forEach(([pair,dx])=>pair.forEach(c=>{c.setAttribute('cx',mx+dx);c.setAttribute('cy',my);c.setAttribute('r',rad)}));
    nuc.setAttribute('cx',mx);nuc.setAttribute('cy',my);nuc.setAttribute('r',rad*.55);nuc.style.opacity=sep>0?0:1;
    chr.forEach((pair,i)=>pair.forEach((ln,j)=>{const base=(i?10:-10);const off=(j?1:-1)*sis*4;
      const x=mx+base*(1-sep*.4)+off*(1-sep)+(j?1:-1)*d;const L=i?16:24;
      ln.setAttribute('x1',x);ln.setAttribute('x2',x);ln.setAttribute('y1',my-L);ln.setAttribute('y2',my+L)}));
    phase.textContent=name;hub.textContent=deg<0?'':'';}
  let u=0;const proxy={set textContent(v){u=v;render(v)}};
  const to=(v,d)=>H.count(proxy,u,v,{d:d||1600,fmt:x=>x});
  render(0);
  return [
    ()=>{H.D(ring,1,{d:1200})},
    ()=>{secs[0].style.fillOpacity=1;H.O(labs[0],1,{at:200});to(A(160))},
    ()=>{secs[1].style.fillOpacity=1;H.O(labs[1],1,{at:200});to(A(270))},
    ()=>{secs[2].style.fillOpacity=1;H.O(labs[2],1,{at:200});to(A(326))},
    ()=>{secs[3].style.fillOpacity=1;H.O(labs[3],1,{at:200});to(A(368),2000)},
    ()=>{H.O(inter,1);H.D(inter.firstChild,1,{d:1200})},
    ()=>{if(H.instant)return;const u0=u;H.loop(t=>render(u0+t/9))},
  ];}},

/* 4 ─────────────────────────────── */
{sec:'3.2',title:'Anatomy of a Replicated Chromosome',caption:'After Fig. 3.2.2 · sister chromatids, centromere, kinetochore',
text:`<p data-step="0">Before S phase, each chromosome is one long DNA molecule. A chromosome in this state is an <b>unreplicated chromosome</b>.</p>
<p data-step="1">S phase replicates the DNA. The chromosome now has two identical DNA molecules, the <b>sister chromatids</b>. A chromosome with two sister chromatids is a <b>replicated chromosome</b>.</p>
<p data-step="2">The <b>centromere</b> holds the sister chromatids together. A replicated chromosome has one centromere, so it counts as one chromosome.</p>
<p data-step="3">The <b>kinetochore</b> is the region of a chromatid where microtubules attach. The kinetochore contains the centromere and proteins that help the microtubules bind.</p>
<p data-step="4"><b>Microtubules</b> are thin protein tubes. During mitosis, microtubules attach to the kinetochores and move the chromosomes.</p>`,
star:'Count the centromeres to count the chromosomes.',starStep:2,
scene(H){const s=document.getElementById('stage');const X=300,Y=210;
  const mt=H.g(s);const ch=H.chromosome(s,{L1:92,L2:92,w:24,color:'dad',state:'single',x:X,y:Y});
  const w=24,waist=w*1.3-w*.93;
  const kin=H.g(s);[-1,1].forEach(sg=>H.E('rect',{x:X+sg*(waist+w/2)-(sg<0?12:0),y:Y-15,width:12,height:30,rx:3,st:'fill:var(--hi);stroke:var(--ink);stroke-width:2'},kin));H.O(kin,0,{d:0});
  ch.ca.setAttribute('r',7);ch.cb.setAttribute('r',7);
  const fib=[];[-1,1].forEach(sg=>[-1,0,1].forEach(k=>{const x0=X+sg*(waist+w/2+12),x1=X+sg*230;
    fib.push(H.E('path',{d:`M${x1},${Y+k*34} Q${(x0+x1)/2},${Y+k*14} ${x0},${Y+k*9}`,pathLength:1,cls:'draw k',st:'stroke-width:1.8'},mt))}));
  const lab=(x,y,tx,t,anchor)=>{const G=H.g(s);H.E('path',{d:`M${x},${y} L${tx},${t[1]}`,pathLength:1,cls:'draw k',st:'stroke-width:1.3'},G);
    H.txt(G,tx+(anchor==='end'?-6:6),t[1]+5,t[0],'lb',{'text-anchor':anchor||'start'});H.O(G,0,{d:0});return G};
  const L0=lab(X+14,Y-70,440,['one DNA molecule',90]);
  const L1=lab(X+34,Y+80,440,['sister chromatid',330]),L1b=lab(X-34,Y+80,160,['sister chromatid',330],'end');
  const L2=lab(X+2,Y-6,440,['centromere',130]);
  const L3=lab(X-28,Y-15,160,['kinetochore',130],'end');
  const L4=H.txt(s,X-230,Y+62,'microtubules','lb');H.O(L4,0,{d:0});
  const cnt=H.txt(s,X,404,'','lb',{'text-anchor':'middle'});
  const show=G=>{H.O(G,1);H.D(G.firstChild,1,{d:600})};
  return [
    ()=>{H.O(L0,1);show(L0);cnt.textContent='1 chromosome · 1 chromatid'},
    ()=>{H.O(L0,0);H.setChr(ch,'x',{d:1400});show(L1);show(L1b);cnt.textContent='1 chromosome · 2 chromatids'},
    ()=>{H.T(ch.ca,{s:1.6},{d:500});H.T(ch.cb,{s:1.6},{d:500});H.after(600,()=>{H.T(ch.ca,{s:1},{d:500});H.T(ch.cb,{s:1},{d:500})});show(L2);cnt.textContent='1 centromere = 1 chromosome'},
    ()=>{H.O(kin,1);show(L3)},
    ()=>{H.D(fib,1,{d:1300});fib.forEach((f,i)=>f.style.transitionDelay=(i%3)*120+'ms');H.O(L4,1,{at:700})},
  ];}},

/* 5 ─────────────────────────────── */
{sec:'3.2',title:'Checkpoints and Cyclins',caption:'After Fig. 3.2.1 · checkpoints and cyclin–CDK pairs',
text:`<p data-step="0">The cell cycle has <b>checkpoints</b>. At each checkpoint, the cell checks the previous phase. The next phase starts only if the previous phase is complete and correct.</p>
<p data-step="1">The three main checkpoints are the <b>G1 checkpoint</b> (the restriction point), the <b>G2 checkpoint</b> and the <b>M checkpoint</b>.</p>
<p data-step="2"><b>Cyclins</b> are a family of proteins that control the cell cycle. A cyclin binds to an enzyme, a <b>cyclin-dependent kinase (CDK)</b>, and activates the enzyme. The active CDK moves the cell into the next phase.</p>
<p data-step="3">Each phase uses a different cyclin–CDK pair. For example, cyclin D with CDK4 acts in G1. Cyclin B with CDK1 starts mitosis.</p>
<p data-step="4">Example problems are an error in DNA replication or a missing protein. When the cell finds a problem, the cycle stops. The stop is an <b>arrest</b>.</p>
<p data-step="5">During the arrest, the cell repairs the problem, and then the cycle continues. If the cell cannot repair the problem, the cell dies.</p>`,
star:'Checkpoint = a gate. Cyclin + CDK = the key.',starStep:2,
scene(H){const s=document.getElementById('stage');const cx=215,cy=215,R0=72,R1=112;
  const ph=[{n:'G1',a0:10,a1:165,f:'dad-tint'},{n:'S',a0:165,a1:275,f:'mom-tint'},{n:'G2',a0:275,a1:330,f:'wash'},{n:'M',a0:330,a1:370,f:'ink'}];
  const W=H.g(s);ph.forEach(p=>{H.E('path',{d:H.sectorD(cx,cy,R0,R1,p.a0,p.a1),st:`fill:${H.C(p.f)};stroke:var(--ink);stroke-width:2`},W);
    const a=(p.a0+p.a1)/2*Math.PI/180,r=(R0+R1)/2;H.txt(W,cx+r*Math.sin(a),cy-r*Math.cos(a)+6,p.n,'lb',{'text-anchor':'middle',st:p.n==='M'?'fill:var(--paper)':''})});
  H.O(W,0,{d:0});
  const P=(a,r)=>[cx+r*Math.sin(a*Math.PI/180),cy-r*Math.cos(a*Math.PI/180)];
  const gates=[[163,'G1 checkpoint',[cx+60,cy+168],'(restriction point)'],[328,'G2 checkpoint',[cx-120,cy-168],''],[352,'M checkpoint',[cx+40,cy-168],'']].map(([a,t,lp,sub])=>{
    const G=H.g(s);const [x,y]=P(a,(R0+R1)/2);const box=H.E('rect',{x:x-9,y:y-9,width:18,height:18,rx:3,st:'fill:var(--paper);stroke:var(--ink);stroke-width:2.5'},G);
    H.E('line',{x1:x,y1:y,x2:lp[0],y2:lp[1]-5,cls:'k',st:'stroke-width:1.2'},G);
    H.txt(G,lp[0],lp[1]+(lp[1]>cy?12:-4),t,'lb',{'text-anchor':'middle'});if(sub)H.txt(G,lp[0],lp[1]+28,sub,'lbs',{'text-anchor':'middle'});
    H.O(G,0,{d:0});G.box=box;G.x=x;G.y=y;return G});
  const tags=[[[cx+R1+14,cy-40],'cyclin D + CDK4'],[[cx-R1-22,cy+120],'cyclin A + CDK2'],[[cx+70,cy+122],'cyclin E + CDK2'],[[cx-R1-22,cy-98],'cyclin B + CDK1']].map(([[x,y],t])=>{
    const G=H.g(s);const tw=t.length*6.6+14;const ax=Math.max(6,x<cx?x-tw/2+20:x);
    H.E('rect',{x:ax,y:y-11,width:tw,height:22,rx:11,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},G);H.txt(G,ax+tw/2,y+4.5,t,'lbs',{'text-anchor':'middle',st:'fill:#16181d;font-weight:700'});H.O(G,0,{d:0});return G});
  // docking demo
  const Dk=H.g(s);const dx=490,dy=110;H.txt(Dk,dx+40,dy-50,'HOW A CYCLIN WORKS','cap',{'text-anchor':'middle'});
  const cdk=H.E('rect',{x:dx-30,y:dy-26,width:70,height:52,rx:10,st:'fill:var(--card);stroke:var(--muted);stroke-width:2.5;stroke-dasharray:5 4'},Dk);
  H.txt(Dk,dx+5,dy+5,'CDK','lb',{'text-anchor':'middle'});
  const cyc=H.g(Dk);H.E('path',{d:`M0,-24 C44,-24 48,24 0,24 C-10,24 -10,-24 0,-24 Z`,st:'fill:var(--hi);stroke:var(--ink);stroke-width:2'},cyc);
  H.txt(cyc,17,5,'cyclin','lbs',{'text-anchor':'middle',st:'fill:#16181d;font-weight:700'});H.T(cyc,{x:dx+150,y:dy},{d:0});
  const st=H.txt(Dk,dx+40,dy+56,'CDK alone: inactive','lbs',{'text-anchor':'middle'});H.O(Dk,0,{d:0});
  const dot=H.E('circle',{r:10,st:'fill:var(--mom);stroke:var(--paper);stroke-width:3'},s);
  const X=H.g(s);H.E('path',{d:'M-9,-9 L9,9 M9,-9 L-9,9',st:'stroke:var(--bad);stroke-width:4;stroke-linecap:round'},X);H.O(X,0,{d:0});
  const msg=H.txt(s,470,300,'','lb',{'text-anchor':'middle'}),msg2=H.txt(s,470,322,'','lbs',{'text-anchor':'middle'});
  let u=20;const pr={set textContent(v){u=v;const [x,y]=P(v,(R0+R1)/2);dot.setAttribute('cx',x);dot.setAttribute('cy',y)}};pr.textContent=20;
  const g1=gates[0];H.T(X,{x:g1.x,y:g1.y},{d:0});
  return [
    ()=>{H.O(W,1,{d:700})},
    ()=>{gates.forEach((G,i)=>H.O(G,1,{at:i*250}))},
    ()=>{H.O(Dk,1);H.T(cyc,{x:dx+50},{d:1000,at:400});H.after(1300,()=>{cdk.style.stroke='var(--good)';cdk.style.strokeDasharray='none';st.textContent='cyclin + CDK: active → next phase'})},
    ()=>{tags.forEach((G,i)=>H.O(G,1,{at:i*200}))},
    ()=>{H.count(pr,u,150,{d:1400,fmt:v=>v});H.after(1400,()=>{H.O(X,1);H.K(g1.box,{stroke:'bad'});msg.textContent='Problem found at the G1 checkpoint';msg2.textContent='arrest: the cycle stops'})},
    ()=>{H.O(X,0);H.K(g1.box,{stroke:'good'});msg.textContent='Problem repaired';msg2.textContent='the cell continues into S phase';H.count(pr,150,215,{d:1400,at:300,fmt:v=>v})},
  ];}},

/* 6 ─────────────────────────────── */
{sec:'3.2',title:'Not Every Cell Cycles the Same Way',caption:'Timelines read left to right · block width ≈ time in each phase',
text:`<p data-step="0">Different types of cell use the cell cycle in different ways.</p>
<p data-step="1"><b>Blood stem cells</b> (hematopoietic stem cells) are in the bone marrow. They make all the other types of blood cell, so they repeat the cycle continuously.</p>
<p data-step="2"><b>Meiocytes</b> are the cells that do meiosis. Meiocytes usually have no G2 phase.</p>
<p data-step="3"><b>Nerve cells</b> do not divide. They stay in G1 and then enter a permanent non-dividing state, <b>G0</b>.</p>
<p data-step="4">Some cells complete many S phases with no mitosis, so their DNA content doubles each time. Repeated S phases without mitosis are <b>endoreduplication</b>. The larval cells of the fruit fly <i>Drosophila</i> are an example.</p>
<p data-step="4" class="note">Cancer cells divide without correct control, so scientists study cell-cycle control closely.</p>`,
star:'G0 = zero more divisions.',starStep:3,
scene(H){const s=document.getElementById('stage');const x0=200,x1=625;
  const col={G1:'dad-tint',S:'mom-tint',G2:'wash',M:'ink',MI:'ink',MII:'ink',G0:'card'};const wd={G1:44,S:32,G2:24,M:14,MI:16,MII:16};
  H.txt(s,x0,32,'TIME →','cap');
  const lane=(y,name,sub,seq)=>{const G=H.g(s);H.txt(G,14,y-4,name,'lb');H.txt(G,14,y+14,sub,'lbs');
    H.E('line',{x1:x0,y1:y,x2:x1,y2:y,st:'stroke:var(--faint);stroke-width:1.5'},G);let x=x0;const bl=[];
    seq.forEach(([k,w])=>{w=w||wd[k];const b=H.g(G);H.E('rect',{x,y:y-15,width:w-2,height:30,rx:4,st:`fill:${H.C(col[k])};stroke:var(--ink);stroke-width:1.5`},b);
      if(w>=20)H.txt(b,x+(w-2)/2,y+4.5,k==='MI'?'M I':k==='MII'?'M II':k==='G0'?'G0 · permanent non-dividing state':k,'lbs',{'text-anchor':'middle',st:`font-weight:700;fill:${k.startsWith('M')?'var(--paper)':'var(--ink)'}`});
      bl.push(b);H.O(b,0,{d:0});x+=w});G.bl=bl;return G};
  const cyc=[];for(let i=0;i<4;i++)cyc.push(['G1'],['S'],['G2'],['M']);
  const L1=lane(80,'Blood stem cell','bone marrow · always cycles',cyc.slice(0,14));
  const L2=lane(170,'Meiocyte','makes gametes · no G2',[['G1'],['S'],['MI',30],['MII',30]]);
  const L3=lane(260,'Nerve cell','stops dividing',[['G1'],['G0',360]]);
  const L4=lane(360,'Fruit-fly larva cell','endoreduplication',[['G1',30],['S'],['G1',22],['S'],['G1',22],['S'],['G1',22],['S']]);
  const dna=H.txt(s,x1,330,'','lb',{'text-anchor':'end'});
  const show=(L,step)=>L.bl.forEach((b,i)=>H.O(b,1,{d:250,at:i*step}));
  return [()=>{},()=>show(L1,90),()=>show(L2,250),()=>show(L3,400),
    ()=>{show(L4,160);const p={set textContent(v){dna.textContent='DNA: '+v}};H.count(p,2,16,{d:1400,fmt:v=>(2**Math.round(Math.log2(Math.max(2,v))))+'c'})}];}},

/* 7 ─────────────────────────────── */
{sec:'3.3',title:'Mitosis, Stage by Stage',caption:'After Fig. 3.3.1 and 3.4.2 · 2n = 4 · blue = paternal, orange = maternal',
text:`<p data-step="0"><span class="chip">i</span> <b>Interphase.</b> In S phase, the cell replicated each chromosome, so each chromosome has two sister chromatids. The chromosomes are long and thin, so they are not visible as separate structures.</p>
<p data-step="1"><span class="chip">P</span> <b>Prophase.</b> The replicated chromosomes condense and become short, thick and visible. The nuclear envelope dissolves. The two <b>centrosomes</b> organize microtubules. They move to the opposite ends of the cell, the <b>poles</b>. There they make the <b>spindle</b>, a structure of microtubules.</p>
<p data-step="2"><span class="chip">M</span> <b>Metaphase.</b> Microtubules from both poles attach to the kinetochores. The chromosomes align in single file on the <b>metaphase plate</b>, the plane across the middle of the cell.</p>
<p data-step="3"><span class="chip">A</span> <b>Anaphase.</b> The centromere of each chromosome divides, and the sister chromatids separate. The microtubules move the chromatids to opposite poles. Each chromatid is now a chromosome.</p>
<p data-step="4"><span class="chip">T</span> <b>Telophase.</b> Each pole now has one complete set of unreplicated chromosomes. A nuclear envelope forms around each set.</p>
<p data-step="5"><b>Cytokinesis.</b> The cytoplasm divides and makes two daughter cells. Each daughter cell has the same chromosomes as the parent cell.</p>`,
star:'iPMAT: interphase, Prophase = Pack, Metaphase = Middle, Anaphase = Apart, Telophase = Two.',starStep:5,
scene(H){const s=document.getElementById('stage');const CX=320,CY=212;
  const Cl=H.cell(s,{x:CX,y:CY,r:160});
  const sp=H.g(s);const pl=[CX-142,CY],pr=[CX+142,CY];
  const polar=[-95,-50,50,95].map(k=>H.E('path',{d:`M${pl[0]},${pl[1]} Q${CX},${CY+k} ${pr[0]},${pr[1]}`,pathLength:1,cls:'draw k',st:'stroke-width:1.3;opacity:.55'},sp));
  const plate=H.E('line',{x1:CX,y1:CY-125,x2:CX,y2:CY+125,pathLength:1,cls:'draw',st:'stroke:var(--muted);stroke-width:1.5;stroke-dasharray:1'},s);
  const nuc=H.nucleus(s,CX,CY,92);
  const sq=['dad','mom','dad','mom'].map((c,i)=>H.squiggle(s,CX-30+i*18,CY-20+(i%2)*30,9,c,i*7+3));
  const nucs=[H.nucleus(s,CX-109,CY,90),H.nucleus(s,CX+109,CY,90)];nucs.forEach(n=>{H.O(n,0,{d:0});H.T(n,{s:.7},{d:0})});
  const kf=H.g(s);
  const spec=[['dad',25],['mom',25],['dad',15],['mom',15]];const ys=[CY-62,CY-8,CY+38,CY+72];
  const pro=[[CX-40,CY-30,35],[CX+38,CY-26,-30],[CX-28,CY+40,70],[CX+34,CY+36,12]];
  const chs=spec.map(([c,L],i)=>{const ch=H.chromosome(s,{L1:L,L2:L,w:8,color:c,state:'x',x:pro[i][0],y:pro[i][1],r:pro[i][2]});H.T(ch,{s:.001},{d:0});return ch});
  const cs=[H.centrosome(s,CX-8,CY-108),H.centrosome(s,CX+8,CY-108)];
  const fibs=[];const name=H.txt(s,22,40,'','big');const sub=H.txt(s,22,62,'','lbs');
  const lab=(a,b)=>{name.textContent=a;sub.textContent=b};
  const dL=H.txt(s,CX-108,400,'2n = 4','lb',{'text-anchor':'middle'}),dR=H.txt(s,CX+108,400,'2n = 4','lb',{'text-anchor':'middle'});H.O([dL,dR],0,{d:0});
  const GAP=8*1.3,BUL=8*.93,D=94;
  return [
    ()=>{lab('Interphase','DNA already copied (S phase)');H.D(sq,1,{d:1600})},
    ()=>{lab('Prophase','chromosomes pack up');H.O(sq,0,{d:700});chs.forEach((c,i)=>H.T(c,{s:1},{d:1100,at:200+i*80}));
      H.O(nuc,0,{d:900,at:500});H.T(nuc,{s:1.12},{d:900,at:500});
      H.T(cs[0],{x:pl[0],y:pl[1]},{d:1500,at:300});H.T(cs[1],{x:pr[0],y:pr[1]},{d:1500,at:300});H.D(polar,1,{d:1200,at:1300})},
    ()=>{lab('Metaphase','line up in the middle');H.D(plate,1,{d:800});
      chs.forEach((c,i)=>H.T(c,{x:CX,y:ys[i],r:0},{d:1300,at:i*90}));
      H.after(1300,inst=>{chs.forEach((c,i)=>{[[pl,-1],[pr,1]].forEach(([P,sg])=>{const tx=CX+sg*(GAP-BUL+3.5),ty=ys[i];
        const f=H.fibre(kf,P,[P[0]+(tx-P[0])*.02,P[1]+(ty-P[1])*.02],{w:1.6});H.fibreTo(f,[tx,ty],{d:inst?0:700});fibs.push({f,i,sg})})})})},
    ()=>{lab('Anaphase','sister chromatids pulled apart');H.O(plate,0);
      chs.forEach(c=>H.setChr(c,'apart',{D,d:1700}));
      fibs.forEach(({f,i,sg})=>H.fibreTo(f,[CX+sg*(GAP+D+BUL*1.4-3.5),ys[i]],{d:1700}))},
    ()=>{lab('Telophase','two nuclei form');fibs.forEach(({f})=>H.O(f,0,{d:600}));H.O(polar,0,{d:600});
      nucs.forEach(n=>{H.O(n,1,{d:800,at:300});H.T(n,{s:1},{d:900,at:300})});H.cleave(Cl,40,.86,{d:1200,at:400});
      chs.forEach(c=>{[[c.a,c.ca,-1],[c.b,c.cb,1]].forEach(([t,d,sg])=>{H.T(t,{sx:sg*2.5},{d:1000});H.T(d,{x:t._t.x+sg*2.5},{d:1000})})});
      H.T(cs[0],{x:CX-179,y:CY-62},{d:1200});H.T(cs[1],{x:CX+179,y:CY-62},{d:1200});chs.forEach((c,i)=>H.T(c,{x:CX+(i-1.5)*12},{d:1000}))},
    ()=>{lab('Cytokinesis','the cytoplasm splits · 2 identical cells');H.cleave(Cl,109,.66,{d:1400});H.O([dL,dR],1,{at:1200})},
  ];}},

/* 8 ─────────────────────────────── */
{sec:'3.3',title:'Real Cells Do Not Stop Between Stages',caption:'Fig. 3.3.2 · root tip of Vicia faba (broad bean), stained · J. Reischig (2014), CC BY-SA 3.0',
text:`<p data-step="0">The image is a micrograph (a photograph through a microscope) of cells from the tip of a bean root. A purple stain shows the chromosomes.</p>
<p data-step="1">Most cells are in <b>interphase</b>. Their long, thin chromosomes make each nucleus a round, grainy ball.</p>
<p data-step="2">The cell at the lower right is in <b>prophase</b>. Its chromosomes are condensed into separate threads.</p>
<p data-step="3">The cell at the upper left is in <b>anaphase</b>. Two groups of chromatids move to opposite poles. The centromeres lead and the arms trail, because the microtubules pull on the centromeres.</p>
<p data-step="4">Mitosis is a continuous process. A cell does not jump from one stage to the next. The stage names are labels for points in one smooth process.</p>`,
star:'Stage names are labels on a continuous process.',starStep:4,
scene(H){const s=document.getElementById('stage');const k=640/1056;
  H.E('image',{href:'@@asset:vicia-root-tip.jpg@@',x:0,y:0,width:640,height:676*k},s);
  const ring=(x,y,rx,ry,label,lx,ly,anchor)=>{const G=H.g(s);
    H.E('ellipse',{cx:x*k,cy:y*k,rx,ry,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--hi);stroke-width:4'},G);
    const tw=label.length*8.2+18;const bx=anchor==='end'?lx-tw:lx;
    H.E('rect',{x:bx,y:ly-17,width:tw,height:26,rx:6,st:'fill:#16181d;opacity:.88'},G);H.txt(G,bx+9,ly+1,label,'lb',{st:'fill:#fff'});H.O(G,0,{d:0});return G};
  const R1=ring(545,310,62,64,'interphase',402,196,'start'),R2=ring(780,455,108,64,'prophase',600,365,'end'),R3=ring(225,180,112,82,'anaphase',230,40,'start');
  const ar=[[[150,145],[90,180]],[[195,85],[245,55]]].map(([a,b])=>mkA(s,a[0],a[1],b[0],b[1],{color:'hi',w:3}));
  const on=R=>{H.O(R,1);H.D(R.firstChild,1,{d:900})};
  return [()=>{},()=>on(R1),()=>on(R2),()=>{on(R3);ar.forEach(a=>drawA(a,{at:700}))},()=>{}];}},

/* 9 ─────────────────────────────── */
{sec:'3.3',title:'iPMAT in One Line',caption:'Memory strip · the whole of mitosis',
text:`<p data-step="0"><b>i · Interphase.</b> The cell replicates its DNA before mitosis starts.</p>
<p data-step="1"><b>P · Prophase.</b> The chromosomes condense. The nuclear envelope dissolves.</p>
<p data-step="2"><b>M · Metaphase.</b> The chromosomes align in single file in the middle of the cell.</p>
<p data-step="3"><b>A · Anaphase.</b> The sister chromatids separate and move to opposite poles.</p>
<p data-step="4"><b>T · Telophase.</b> Two nuclei form. Cytokinesis then divides the cell into two identical diploid cells.</p>`,
star:'iPMAT: Prophase = Pack, Metaphase = Middle, Anaphase = Apart, Telophase = Two.',starStep:4,
scene(H){const s=document.getElementById('stage');const Y=180,xs=[64,190,320,450,576],R=54;
  const panels=xs.map((x,i)=>{const G=H.g(s);H.O(G,0,{d:0});return G});
  const mini=(p,x,y,c,L,st,r,o)=>{const ch=H.chromosome(p,Object.assign({L1:L,L2:L,w:4.5,color:c,state:st,x,y,r:r||0},o||{}));return ch};
  // i
  H.E('circle',{cx:xs[0],cy:Y,r:R,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},panels[0]);
  H.E('circle',{cx:xs[0],cy:Y,r:30,st:'fill:none;stroke:var(--ink);stroke-width:1.4;stroke-dasharray:5 4'},panels[0]);
  ['dad','mom','dad','mom'].forEach((c,i)=>{const q=H.squiggle(panels[0],xs[0]-16+i*9,Y-8+(i%2)*14,5,c,i*5+2);q.style.strokeDashoffset=0;q.style.strokeWidth=2.2});
  // P
  H.E('circle',{cx:xs[1],cy:Y,r:R,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},panels[1]);
  H.E('circle',{cx:xs[1],cy:Y,r:36,st:'fill:none;stroke:var(--ink);stroke-width:1.4;stroke-dasharray:3 9'},panels[1]);
  [['dad',15,-16,-12,30],['mom',15,14,-14,-25],['dad',9,-12,16,70],['mom',9,16,14,10]].forEach(([c,L,dx,dy,r])=>mini(panels[1],xs[1]+dx,Y+dy,c,L,'x',r));
  // M
  H.E('circle',{cx:xs[2],cy:Y,r:R,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},panels[2]);
  [-1,1].forEach(sg=>[-30,-10,10,30].forEach(dy=>H.E('line',{x1:xs[2]+sg*44,y1:Y,x2:xs[2]+sg*6,y2:Y+dy,st:'stroke:var(--ink);stroke-width:1;opacity:.6'},panels[2])));
  [['dad',11,-33],['mom',11,-11],['dad',7,10],['mom',7,30]].forEach(([c,L,dy])=>mini(panels[2],xs[2],Y+dy,c,L,'x'));
  [-1,1].forEach(sg=>H.E('circle',{cx:xs[2]+sg*44,cy:Y,r:3,cls:'kf'},panels[2]));
  // A
  H.E('circle',{cx:xs[3],cy:Y,r:R,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},panels[3]);
  [['dad',11,-33],['mom',11,-11],['dad',7,10],['mom',7,30]].forEach(([c,L,dy])=>{const ch=mini(panels[3],xs[3],Y+dy,c,L,'apart');H.setChr(ch,'apart',{D:18,d:0})});
  // T
  const T=H.g(panels[4]);[-1,1].forEach(sg=>H.E('circle',{cx:xs[4]+sg*24,cy:Y,r:30,st:'fill:none;stroke:var(--ink);stroke-width:5'},T));
  [-1,1].forEach(sg=>H.E('circle',{cx:xs[4]+sg*24,cy:Y,r:30,cls:'cellfill'},T));
  [-1,1].forEach(sg=>{H.E('circle',{cx:xs[4]+sg*24,cy:Y,r:19,st:'fill:none;stroke:var(--ink);stroke-width:1.2;stroke-dasharray:4 3'},T);
    [['dad',-9,24],['mom',-3,24],['dad',3,14],['mom',9,14]].forEach(([c,dx,L])=>H.E('line',{x1:xs[4]+sg*24+dx,y1:Y-L/2,x2:xs[4]+sg*24+dx,y2:Y+L/2,st:`stroke:${H.C(c)};stroke-width:3.5;stroke-linecap:round`},T))});
  const names=[['Interphase','DNA copies itself'],['Prophase','PACK up'],['Metaphase','line up in the MIDDLE'],['Anaphase','pulled APART'],['Telophase','TWO nuclei form']];
  names.forEach(([n,d],i)=>{H.txt(panels[i],xs[i],Y+84,n,'lb',{'text-anchor':'middle'});H.txt(panels[i],xs[i],Y+104,d,'lbs',{'text-anchor':'middle'})});
  const letters=['i','P','M','A','T'];letters.forEach((l,i)=>H.txt(panels[i],xs[i],Y-76,l,'big',{'text-anchor':'middle',st:`font-size:34px;fill:${i?'var(--dad)':'var(--muted)'}`}));
  const arr=[0,1,2,3].map(i=>mkA(s,xs[i]+R+4,Y,xs[i+1]-R-6,Y,{w:1.8,h:7}));
  return [0,1,2,3,4].map(i=>()=>{H.O(panels[i],1,{d:600});if(i)drawA(arr[i-1])});}},

/* 10 ─────────────────────────────── */
{sec:'3.4',title:'Two Numbers: c and n',caption:'After Fig. 3.4.1 · haploid number = 2 in this model · nuclear envelopes not shown',
text:`<p data-step="0">Two numbers describe the genetic material of a cell. The <b>c-value</b> (<span class="m">c</span>) is the amount of DNA. The <b>n-value</b> (<span class="m">n</span>) is the number of complete chromosome sets.</p>
<p data-step="0">A <b>gamete</b> (a sperm cell or an egg cell) is haploid. A gamete has <span class="m">1c</span> and <span class="m">1n</span>.</p>
<p data-step="1"><b>Fertilization.</b> A sperm cell and an egg cell join and make a <b>zygote</b>. The zygote is diploid: it has <span class="m">2c</span> and <span class="m">2n</span>.</p>
<p data-step="2"><b>S phase.</b> DNA replication doubles the DNA content to <span class="m">4c</span>. The chromosome number stays <span class="m">2n</span>, because each pair of sister chromatids shares one centromere.</p>
<p data-step="3"><b>Mitosis.</b> Each daughter cell receives one chromatid of each replicated chromosome, which is half of the DNA. So each daughter cell has <span class="m">2c</span> and <span class="m">2n</span> again.</p>`,
star:'c counts DNA. n counts sets. DNA replication changes c, not n.',starStep:2,
scene(H){const s=document.getElementById('stage');const Y=200;
  const cols=[75,230,385,548],heads=['gametes','zygote','after S phase','after mitosis'];
  const hd=cols.map((x,i)=>{const t=H.txt(s,x,46,heads[i].toUpperCase(),'cap',{'text-anchor':'middle'});H.O(t,0,{d:0});return t});
  const val=cols.map((x,i)=>{const G=H.g(s);const c=H.txt(G,x,352,'','mt',{'text-anchor':'middle',st:'font-size:24px'});
    const sub=H.txt(G,x,376,i===0?'each gamete':i===3?'each daughter cell':'','lbs',{'text-anchor':'middle'});H.O(G,0,{d:0});G.c=c;return G});
  const setV=(i,c,n)=>{val[i].c.textContent=`${c}c · ${n}n`};
  const sperm=H.g(s);H.E('path',{d:'M45,140 C30,135 22,150 8,142',st:'fill:none;stroke:var(--ink);stroke-width:2.5;stroke-linecap:round'},sperm);
  H.E('circle',{cx:75,cy:140,r:30,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},sperm);
  const egg=H.E('circle',{cx:75,cy:262,r:42,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},s);
  const ghosts=[];
  const Z=H.cell(s,{x:230,y:Y,r:52});H.O(Z,0,{d:0});
  const spec=[['dad',14,68,140],['mom',14,68,262],['dad',9,82,140],['mom',9,82,262]]; // bL, oL, bS, oS
  const ch=spec.map(([c,L,x,y])=>H.chromosome(s,{L1:L,L2:L,w:5,color:c,state:'single',x,y}));
  const proc=[['fertilization',152],['S phase',308],['mitosis',466]].map(([t,x])=>{const G=H.g(s);H.txt(G,x,296,t,'lbs',{'text-anchor':'middle'});
    const a=mkA(G,x-26,306,x+26,306,{w:1.6,h:6});G.a=a;H.O(G,0,{d:0});return G});
  const ghost=(x)=>{const c=H.E('circle',{cx:x,cy:Y,r:52,st:'fill:none;stroke:var(--muted);stroke-width:1.5;stroke-dasharray:4 4'},s);H.O(c,0,{d:0});H.O(c,.8,{at:300});};
  return [
    ()=>{H.O(hd[0],1);H.O(val[0],1);setV(0,1,1)},
    ()=>{H.O(hd[1],1);H.O(proc[0],1);drawA(proc[0].a);H.O(sperm,0,{d:600});H.O(egg,0,{d:600});H.O(Z,1,{d:600,at:300});
      [214,225,236,247].forEach((x,i)=>H.T(ch[i],{x,y:Y},{d:1300,at:150}));
      H.O(val[1],1,{at:900});const p={set textContent(v){val[1].c.textContent=`${v}c · ${v}n`}};p.textContent=1;H.count(p,1,2,{d:600,at:1000})},
    ()=>{H.O(hd[2],1);H.O(proc[1],1);drawA(proc[1].a);ghost(230);H.T(Z,{x:385},{d:1200});
      [355,375,395,415].forEach((x,i)=>{H.T(ch[i],{x},{d:1200});H.after(1100,()=>H.setChr(ch[i],'x',{d:900}))});
      H.O(val[2],1,{at:1000});const p={set textContent(v){val[2].c.textContent=`${v}c · 2n`}};p.textContent=2;H.count(p,2,4,{d:700,at:1700})},
    ()=>{H.O(hd[3],1);H.O(proc[2],1);drawA(proc[2].a);ghost(385);H.T(Z,{x:548},{d:1200});
      ch.forEach((c,i)=>H.T(c,{x:548+(i-1.5)*10},{d:1200}));
      H.after(1200,()=>{H.cleave(Z,50,.8,{d:1300});ch.forEach(c=>H.setChr(c,'apart',{D:42,d:1300}));
        H.after(1300,()=>ch.forEach(c=>{[[c.a,c.ca],[c.b,c.cb]].forEach(([t,d])=>{H.T(t,{sx:.001},{d:700});H.T(d,{x:t._t.x},{d:700})})}))});
      H.O(val[3],1,{at:2000});setV(3,2,2)},
  ];}},

/* 11 ─────────────────────────────── */
{sec:'3.4',title:'Chromosomes or Chromatids?',caption:'2n = 4 model · each black dot is one centromere',
text:`<p data-step="0">Count the centromeres to count the chromosomes. Count the DNA molecules to count the chromatids.</p>
<p data-step="0"><b>G1.</b> Each chromosome has one chromatid. Model cell: 4 chromosomes, 4 chromatids.</p>
<p data-step="1"><b>S and G2.</b> Each chromosome has two sister chromatids on one centromere. Model cell: 4 chromosomes, 8 chromatids.</p>
<p data-step="2"><b>Anaphase.</b> The centromeres divide, so each chromatid becomes a separate chromosome. For a short time, the model cell has 8 chromosomes.</p>
<p data-step="3"><b>End of mitosis.</b> Each daughter cell has 4 chromosomes with one chromatid each.</p>
<div class="qa" data-step="3"><div class="q">Practice. A diploid organism has 2n = 16. How many chromosomes and chromatids does one cell have at the end of G1, S, G2 and mitosis?</div><button>Show answer</button><div class="a" hidden>End of G1: 16 chromosomes and 16 chromatids. End of S: 16 chromosomes and 32 chromatids. End of G2: 16 and 32. End of mitosis: 16 and 16 in each daughter cell.</div></div>`,
star:'One centromere = one chromosome.',starStep:0,
scene(H){const s=document.getElementById('stage');const CX=215,CY=212;
  const Z=H.cell(s,{x:CX,y:CY,r:150});const ys=[166,196,228,258];
  const ch=[['dad',12],['mom',12],['dad',8],['mom',8]].map(([c,L],i)=>H.chromosome(s,{L1:L,L2:L,w:7,color:c,state:'single',x:CX,y:ys[i]}));
  const name=H.txt(s,22,40,'','big');
  const mk=(y,t)=>{H.txt(s,500,y,t,'cap',{'text-anchor':'middle',st:'fill:var(--ink)'});return H.txt(s,500,y+70,'','big',{'text-anchor':'middle',st:'font-size:64px'})};
  const nC=mk(110,'Chromosomes'),nT=mk(250,'Chromatids');const each=H.txt(s,500,385,'','lbs',{'text-anchor':'middle'});
  const flash=()=>ch.forEach(c=>[c.ca,c.cb].forEach(d=>{H.T(d,{s:2.2},{d:350});H.after(450,()=>H.T(d,{s:1},{d:350}))}));
  const set=(a,b)=>{const pa={set textContent(v){nC.textContent=v}},pb={set textContent(v){nT.textContent=v}};
    H.count(pa,+nC.textContent||a,a,{d:700});H.count(pb,+nT.textContent||b,b,{d:700})};
  return [
    ()=>{name.textContent='G1';set(4,4);flash()},
    ()=>{name.textContent='S and G2';ch.forEach(c=>H.setChr(c,'x',{d:1200}));H.after(900,()=>{flash();set(4,8)})},
    ()=>{name.textContent='Anaphase';ch.forEach(c=>H.setChr(c,'apart',{D:62,d:1500}));H.after(1300,()=>{flash();set(8,8)})},
    ()=>{name.textContent='After mitosis';H.cleave(Z,76,.5,{d:1400});ch.forEach((c,i)=>H.T(c,{x:CX+(i-1.5)*9},{d:1200}));ch.forEach(c=>[[c.a,c.ca],[c.b,c.cb]].forEach(([t,d])=>{H.T(t,{sx:Math.sign(t._t.sx)*.001},{d:900});H.T(d,{x:t._t.x},{d:900})}));
      H.after(900,()=>{set(4,4);each.textContent='in each daughter cell'})},
  ];}},

/* 12 ─────────────────────────────── */
{sec:'3.4',title:'The Human Numbers',caption:'Tables 3.4.2 and 3.4.3 · Mb = million base pairs · two separate scales',
text:`<p data-step="0">A human gamete has about 3000 million base pairs of DNA. A <b>base pair</b> is one rung of the DNA ladder, and 1 Mb is one million base pairs. So for humans, <span class="m">1c</span> = 3000 Mb.</p>
<p data-step="0">A human gamete has 23 chromosomes. So for humans, <span class="m">1n</span> = 23.</p>
<p data-step="1">A body cell before S phase has <span class="m">2c</span> = 6000 Mb and <span class="m">2n</span> = 46.</p>
<p data-step="2">After S phase, the cell has <span class="m">4c</span> = 12 000 Mb. The chromosome number stays at <span class="m">2n</span> = 46.</p>
<p data-step="3">After mitosis, each daughter cell has <span class="m">2c</span> = 6000 Mb and <span class="m">2n</span> = 46. The same values apply to the cells of embryos, fetuses, children and adults.</p>
<p data-step="3" class="note">Table 3.4.1 (slide 13) gives 3200 Mb for the human genome. Calculations often use the round value, 3000 Mb.</p>
<p data-step="3" class="note">Example: an adult white blood cell in metaphase has 4c = 12 000 Mb. Rare exceptions include some cells that make gametes, and some liver cells with extra chromosome sets (polyploidy).</p>`,
star:'Human: 1c = 3000 Mb, 1n = 23. Body cell: 2n = 46 before and after S phase; c goes 2c → 4c → 2c.',starStep:3,
scene(H){const s=document.getElementById('stage');const B=320,HT=220;
  const cats=[['gamete'],['before','S phase'],['after','S phase'],['after','mitosis']];
  const chart=(x0,title,vals,max,ticks,fmt)=>{const G=H.g(s);H.txt(G,x0,52,title,'cap',{st:'fill:var(--ink)'});
    ticks.forEach(t=>{const y=B-HT*t/max;H.E('line',{x1:x0,y1:y,x2:x0+232,y2:y,st:`stroke:var(--faint);stroke-width:${t?1:2}`},G);H.txt(G,x0-6,y+4,fmt(t),'lbs',{'text-anchor':'end'})});
    const bars=vals.map((v,i)=>{const bx=x0+16+i*58;const b=H.g(G);T0(b,bx,B);const r=H.E('rect',{x:0,y:-1,width:40,height:1,st:'fill:var(--muted)'},b);
      const lab=H.txt(G,bx+20,B-HT*v/max-8,fmt(v),'lb',{'text-anchor':'middle'});H.O(lab,0,{d:0});
      cats[i].forEach((t,k)=>H.txt(G,bx+20,B+18+k*15,t,'lbs',{'text-anchor':'middle'}));
      H.E('title',{text:`${cats[i].join(' ')}: ${fmt(v)}`},b);b.r=r;b.lab=lab;b.h=HT*v/max;return b});return bars};
  function T0(b,x,y){H.T(b,{x,y,sx:1,sy:.001},{d:0})}
  const cb=chart(70,'DNA content (Mb)',[3000,6000,12000,6000],12000,[0,3000,6000,9000,12000],v=>v.toLocaleString('en-US'));
  const nb=chart(370,'Chromosome number',[23,46,46,46],46,[0,23,46],v=>String(v));
  const grow=(i)=>[cb,nb].forEach(bs=>{bs.forEach((b,j)=>{b.r.style.fill=j===i?'var(--ink)':'var(--muted)';b.r.style.opacity=j===i?1:.45});
    H.T(bs[i],{sy:bs[i].h},{d:1000});H.O(bs[i].lab,1,{at:700})});
  const notes=[H.txt(s,70+16+2*58+20,B+66,'× 2','lb',{'text-anchor':'middle',st:'fill:var(--ink)'}),H.txt(s,370+16+2*58+20,B+66,'same','lb',{'text-anchor':'middle'})];H.O(notes,0,{d:0});
  return [()=>grow(0),()=>grow(1),()=>{grow(2);H.O(notes,1,{at:900})},()=>{grow(3);H.O(notes,0)}];}},

/* 13 ─────────────────────────────── */
{sec:'3.4',title:'Genome Size and the c-Value Paradox',caption:'Table 3.4.1 + §3.4 text · log scale: each grid line is 10× the one before',
text:`<p data-step="0">The <b>nuclear genome</b> is all the DNA in the nucleus. The c-value gives its size in base pairs or in picograms (pg) of DNA.</p>
<p data-step="0">In general, larger and more complex organisms have more DNA. For example, <i>E. coli</i> has 5 Mb and humans have 3200 Mb. On the logarithmic scale, each grid line is 10 times the previous one.</p>
<p data-step="1">Many organisms do not follow this rule. Wheat has about 17 000 Mb, almost 6 times the human value. The marbled lungfish has about 133 000 Mb (about 45 times). The amoeba <i>Polychaos dubium</i> has about 670 000 Mb (about 200 times).</p>
<p data-step="1">So the amount of DNA does not follow the complexity of the organism. Scientists call this mismatch the <b>c-value paradox</b>.</p>
<p data-step="2">Gene number is also a poor guide. The small plant <i>Arabidopsis</i> has about 25 000 genes, the same number as humans. Chromosome number is a poor guide too: yeast has 16 chromosomes but only 12 Mb of DNA.</p>`,
star:'More DNA does not mean a more complex organism.',starStep:1,
scene(H){const s=document.getElementById('stage');const X0=178,W=300,top=58,dy=29;
  const rows=[['Human',3200,23,25000],['Mouse',2600,20,25000],['Fruit fly',140,4,13000],['Arabidopsis (plant)',130,5,25000],['C. elegans (worm)',100,6,19000],['Yeast',12,16,6000],['E. coli (bacterium)',5,1,3200],
    ['Wheat',17000],['Marbled lungfish',133000],['Polychaos dubium',670000]];
  let M=4;const xOf=v=>W*Math.log10(v)/M;
  const axisT=H.txt(s,X0+W/2,404,'DNA content per gamete (Mb, 1c)','lbs',{'text-anchor':'middle'});
  const ticks=[0,1,2,3,4,5,6].map(e=>{const G=H.g(s);H.E('line',{x1:0,y1:top-16,x2:0,y2:top+dy*10-8,st:'stroke:var(--faint);stroke-width:1'},G);
    H.txt(G,0,top+dy*10+10,['1','10','10²','10³','10⁴','10⁵','10⁶'][e],'lbs',{'text-anchor':'middle'});H.T(G,{x:X0+W*e/M},{d:0});if(e>M)H.O(G,0,{d:0});return G});
  const R=rows.map((r,i)=>{const y=top+i*dy;const G=H.g(s);const nm=H.txt(G,X0-10,y+5,r[0],'lb',{'text-anchor':'end',st:'font-size:13px'});
    const b=H.E('rect',{x:0,y:y-9,width:1,height:18,cls:'nss',st:`fill:${i>6?'var(--hi)':'var(--ink)'};stroke:var(--ink);stroke-width:${i>6?1.5:0}`},G);H.T(b,{x:X0,sx:.001},{d:0});
    const v=H.txt(G,0,y+5,'','lbs',{st:'fill:var(--ink);font-weight:600'});H.T(v,{x:X0+8},{d:0});H.E('title',{text:`${r[0]}: ${r[1].toLocaleString('en-US')} Mb`},G);
    if(i>6)H.O(G,0,{d:0});return {G,b,v,r}});
  const show=(o,val,label,at)=>{H.T(o.b,{sx:Math.max(.001,xOf(val))},{d:1100,at});H.T(o.v,{x:X0+xOf(val)+8},{d:1100,at});o.v.textContent=label};
  const lbl=r=>`${r[1].toLocaleString('en-US')} Mb`+(r[2]?` · n = ${r[2]}`:'');
  const rescale=()=>ticks.forEach((t,e)=>{H.T(t,{x:X0+W*e/M},{d:1200});H.O(t,e<=M?1:0,{d:600})});
  return [
    ()=>{R.slice(0,7).forEach((o,i)=>show(o,o.r[1],lbl(o.r),i*90))},
    ()=>{M=6;rescale();R.slice(0,7).forEach(o=>show(o,o.r[1],lbl(o.r)));
      const x={7:' · ≈ 6× human',8:' · ≈ 45× human',9:' · ≈ 200× human'};
      R.slice(7).forEach((o,i)=>{H.O(o.G,1,{at:900+i*250});show(o,o.r[1],o.r[1].toLocaleString('en-US')+' Mb'+x[i+7],900+i*250)})},
    ()=>{axisT.textContent='Estimated number of genes';R.slice(7).forEach(o=>H.O(o.G,.12));
      R.slice(0,7).forEach(o=>show(o,o.r[3],o.r[3].toLocaleString('en-US')+' genes'))},
  ];}},

/* 14 ─────────────────────────────── */
{sec:'3.4',title:'Junk DNA and the Onion Test',caption:'Gene spacing from Table 3.4.1 (average non-coding bp between genes) · onion data from §3.4',
text:`<p data-step="0">Not all DNA codes for genes. In a small genome, the genes are close together. In a large genome, long stretches of non-gene DNA separate the genes.</p>
<p data-step="1">Much of the non-gene DNA is <b>transposable elements</b>: DNA segments that can copy themselves into new locations. Other non-gene DNA is short sequences that repeat many times. Scientists often call all of this DNA <b>junk DNA</b>.</p>
<p data-step="1">Non-gene DNA explains the c-value paradox. Most of the extra DNA in a large genome is non-gene DNA.</p>
<p data-step="2"><b>The onion test.</b> An onion (<i>Allium cepa</i>) has about 17 pg of DNA per haploid genome. A human has about 3.5 pg. A proposed function for non-gene DNA must explain why an onion needs about 5 times more of it.</p>
<p data-step="3">Different onion species have from 7 pg to 31.5 pg, but their complexity is similar. The Canadian biologist T. Ryan Gregory proposed the onion test in 2007. Some writers disagree with the test (J. McLatchie, 2011).</p>`,
star:'Big genome: the extra DNA is mostly non-gene DNA.',starStep:1,
scene(H){const s=document.getElementById('stage');const x0=40,x1=600;
  const strip=(y,title,sub,genes,junk)=>{const G=H.g(s);H.txt(G,x0,y-24,title,'lb');H.txt(G,x1,y-24,sub,'lbs',{'text-anchor':'end'});
    const ln=H.E('line',{x1:x0,y1:y,x2:x1,y2:y,pathLength:1,cls:'draw',st:'stroke:var(--ink);stroke-width:2'},G);
    const gs=genes.map(([a,w])=>{const r=H.E('rect',{x:a,y:y-9,width:w,height:18,rx:2,st:'fill:var(--ink)'},G);H.O(r,0,{d:0});return r});
    const js=junk.map(([a,w,k])=>{const r=H.E('rect',{x:a,y:y-(k?5:7),width:w,height:k?10:14,rx:2,st:k?'fill:var(--faint)':'fill:var(--hi);stroke:var(--ink);stroke-width:1'},G);H.O(r,0,{d:0});return r});
    G.ln=ln;G.gs=gs;G.js=js;return G};
  const yg=[];for(let x=x0+8;x<x1-20;x+=34)yg.push([x,22]);
  const A=strip(78,'Small genome (yeast)','about 2 000 bp between genes',yg,[]);
  const hj=[];for(let x=x0+30;x<x1-40;x+=26){if((x-x0)%130<26)continue;hj.push([x,(x*7)%3===0?20:12,(x*13)%4===0])}
  const B=strip(160,'Large genome (human)','about 100 000 bp between genes',[[x0+6,22],[x0+262,22],[x0+520,22]],hj);
  const key=H.g(s);[['gene','ink',0],['transposable element','hi',100],['repeat','faint',290]].forEach(([t,c,dx])=>{H.E('rect',{x:x0+dx,y:198,width:16,height:12,rx:2,st:`fill:var(--${c});stroke:var(--ink);stroke-width:${c==='ink'?0:1}`},key);H.txt(key,x0+dx+22,209,t,'lbs')});H.O(key,0,{d:0});
  const sc=v=>v/31.5*420,bx=150;
  const bar=(y,label,v,txt)=>{const G=H.g(s);H.txt(G,bx-10,y+5,label,'lb',{'text-anchor':'end'});const r=H.E('rect',{x:0,y:y-11,width:1,height:22,st:'fill:var(--ink)'},G);H.T(r,{x:bx,sx:.001},{d:0});
    const t=H.txt(G,bx+sc(v)+8,y+5,txt,'lbs',{st:'fill:var(--ink);font-weight:600'});H.O(G,0,{d:0});G.r=r;G.v=v;return G};
  const hu=bar(262,'Human',3.5,'3.5 pg'),on=bar(300,'Onion',17,'17 pg · ≈ 5× human');
  const rg=H.g(s);H.txt(rg,bx-10,345,'Other onions','lb',{'text-anchor':'end'});
  H.E('line',{x1:bx+sc(7),y1:340,x2:bx+sc(31.5),y2:340,st:'stroke:var(--ink);stroke-width:3'},rg);[7,31.5].forEach(v=>H.E('line',{x1:bx+sc(v),y1:331,x2:bx+sc(v),y2:349,st:'stroke:var(--ink);stroke-width:3'},rg));
  H.txt(rg,bx+sc(7),368,'7 pg','lbs',{'text-anchor':'middle'});H.txt(rg,bx+sc(31.5),368,'31.5 pg','lbs',{'text-anchor':'end'});H.O(rg,0,{d:0});
  const ax=H.txt(s,bx,400,'DNA per haploid genome, picograms (pg)','lbs');H.O(ax,0,{d:0});
  return [
    ()=>{[A,B].forEach(G=>{H.D(G.ln,1,{d:900});G.gs.forEach((r,i)=>H.O(r,1,{at:500+i*40}))})},
    ()=>{B.js.forEach((r,i)=>H.O(r,1,{d:300,at:i*35}));H.O(key,1)},
    ()=>{[hu,on].forEach((G,i)=>{H.O(G,1,{at:i*300});H.T(G.r,{sx:sc(G.v)},{d:1000,at:i*300})});H.O(ax,1)},
    ()=>{H.O(rg,1)},
  ];}},

/* 15 ─────────────────────────────── */
{sec:'3.5',title:'How DNA Packs into a Chromosome',caption:'After Fig. 3.5.1 · widths are approximate · 1 nm = one millionth of a millimetre',
text:`<p data-step="0">Eukaryotic DNA is always wrapped around proteins. DNA and proteins pack together in levels. The DNA double helix is about 2 nm wide (1 nm is one millionth of a millimetre).</p>
<p data-step="1">The DNA wraps around proteins called <b>histones</b>. One unit of DNA and histones is a <b>nucleosome</b>. A line of nucleosomes has the shape of beads on a string.</p>
<p data-step="2">More histones fold the string of nucleosomes into a <b>30 nm fibre</b>.</p>
<p data-step="3"><b>Scaffold proteins</b> hold the 30 nm fibre in loops.</p>
<p data-step="4">At the start of mitosis, the loops pack tightly into the short, thick metaphase chromosome.</p>
<p data-step="5">In interphase, each chromosome is mostly a 30 nm fibre. The fibre fits in the nucleus. Enzymes can still reach the DNA to make RNA, replicate DNA and repair DNA.</p>
<p data-step="5">In mitosis, the enzyme work stops. The chromosome condenses more, so that it can move to one end of the cell. After mitosis, the chromosome returns to the 30 nm fibre.</p>`,
star:'Helix → beads → fibre → loops → chromosome.',starStep:5,
scene(H){const s=document.getElementById('stage');const xs=[58,178,298,428,568],Y0=92,Y1=290;
  const P=xs.map(()=>{const G=H.g(s);H.O(G,0,{d:0});return G});
  // 1 helix
  const hx=(ph)=>{let d='';for(let y=Y0;y<=Y1;y+=3){const x=xs[0]+11*Math.sin((y-Y0)/14+ph);d+=(d?' L':'M')+x.toFixed(1)+','+y}return d};
  const h1=H.E('path',{d:hx(0),pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:3'},P[0]),h2=H.E('path',{d:hx(Math.PI),pathLength:1,cls:'draw',st:'fill:none;stroke:var(--mom);stroke-width:3'},P[0]);
  for(let y=Y0+6;y<Y1;y+=11){const a=11*Math.sin((y-Y0)/14);H.E('line',{x1:xs[0]+a,y1:y,x2:xs[0]-a,y2:y,st:'stroke:var(--muted);stroke-width:1.3'},P[0])}
  // 2 beads on a string
  let d=`M${xs[1]},${Y0}`;const beads=[];for(let i=0;i<6;i++){const y=Y0+18+i*34;const x=xs[1]+(i%2?8:-8);d+=` Q${xs[1]+(i%2?-10:10)},${y-14} ${x},${y}`;beads.push([x,y])}d+=` L${xs[1]},${Y1}`;
  H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:2.5'},P[1]);
  beads.forEach(([x,y])=>{H.E('circle',{cx:x,cy:y,r:11,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.8'},P[1]);H.E('path',{d:`M${x-11},${y-4} A11,11 0 0 0 ${x+11},${y-4}`,st:'fill:none;stroke:var(--dad);stroke-width:2.5'},P[1])});
  // 3 30nm fibre
  H.E('rect',{x:xs[2]-24,y:Y0,width:48,height:Y1-Y0,rx:22,st:'fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4'},P[2]);
  for(let i=0;i<16;i++){H.E('circle',{cx:xs[2]+(i%2?9:-9),cy:Y0+12+i*12.2,r:8.5,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.4'},P[2])}
  // 4 loops on scaffold
  H.E('line',{x1:xs[3],y1:Y0,x2:xs[3],y2:Y1,st:'stroke:var(--muted);stroke-width:6;stroke-linecap:round'},P[3]);
  const lp=[];for(let i=0;i<9;i++){const y=Y0+12+i*22,sg=i%2?1:-1;lp.push(H.E('path',{d:`M${xs[3]},${y} C${xs[3]+sg*70},${y-30} ${xs[3]+sg*70},${y+34} ${xs[3]},${y+12}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:3.5'},P[3]))}
  // 5 chromosome
  H.chromosome(P[4],{L1:74,L2:74,w:22,color:'dad',state:'x',x:xs[4],y:(Y0+Y1)/2});
  const names=[['double helix','2 nm'],['nucleosomes','11 nm'],['30 nm fibre','30 nm'],['loops on scaffold','300 nm'],['chromosome','1400 nm · metaphase']];
  names.forEach(([n,w],i)=>{H.txt(P[i],xs[i],Y1+28,n,'lb',{'text-anchor':'middle',st:'font-size:13px'});H.txt(P[i],xs[i],Y1+46,w,'lbs',{'text-anchor':'middle'})});
  const adds=['+ histones','+ more histones','+ scaffold','pack tight'];const ar=adds.map((t,i)=>{const G=H.g(s);const xa=xs[i]+(i===3?54:i===2?32:24),xb=xs[i+1]-(i===3?46:i===2?52:28);
    const a=mkA(G,xa,60,xb,60,{w:1.6,h:6});H.txt(G,(xa+xb)/2,50,t,'lbs',{'text-anchor':'middle'});H.O(G,0,{d:0});G.a=a;return G});
  const br=(x,w,t)=>{const G=H.g(s);H.E('path',{d:`M${x-w},372 L${x-w},380 L${x+w},380 L${x+w},372`,st:'fill:none;stroke:var(--ink);stroke-width:2'},G);H.txt(G,x,400,t,'lb',{'text-anchor':'middle'});H.O(G,0,{d:0});return G};
  const b1=br(xs[2],42,'interphase: mostly here'),b2=br(xs[4],52,'mitosis');
  return [
    ()=>{H.O(P[0],1);H.D([h1,h2],1,{d:1300})},
    ()=>{H.O(ar[0],1);drawA(ar[0].a);H.O(P[1],1,{at:300});H.D(P[1].querySelector('.draw'),1,{d:1200,at:300})},
    ()=>{H.O(ar[1],1);drawA(ar[1].a);H.O(P[2],1,{at:300,d:800})},
    ()=>{H.O(ar[2],1);drawA(ar[2].a);H.O(P[3],1,{at:300});H.D(lp,1,{d:900,at:300});lp.forEach((e,i)=>e.style.transitionDelay=300+i*80+'ms')},
    ()=>{H.O(ar[3],1);drawA(ar[3].a);H.O(P[4],1,{at:300,d:800})},
    ()=>{H.O(b1,1);H.O(b2,1,{at:400})},
  ];}},

/* 16 ─────────────────────────────── */
{sec:'3.5',title:'Mom’s and Dad’s Chromosome 1',caption:'After Fig. 3.5.2 · the other 44 chromosomes are not shown',
text:`<p data-step="0">Each body cell has two copies of chromosome 1. One copy is from the mother (<span class="mom">maternal</span>) and one from the father (<span class="dad">paternal</span>). The two copies are <b>homologous chromosomes</b>.</p>
<p data-step="0"><b>G1.</b> Each chromosome 1 is unreplicated and uncondensed: a long, thin thread in the nucleus.</p>
<p data-step="1"><b>G2.</b> Each chromosome 1 is replicated, with two sister chromatids. Both are still uncondensed.</p>
<p data-step="2"><b>Metaphase.</b> Both chromosomes are condensed. They align on the metaphase plate independently and do <b>not</b> pair.</p>
<p data-step="3"><b>Anaphase.</b> The sister chromatids of each chromosome separate. After division, each daughter cell starts G1 with one maternal and one paternal chromosome 1.</p>
<p data-step="4">In meiosis I, homologous chromosomes do pair. Homolog pairing is one of the main differences between meiosis and mitosis.</p>`,
star:'Mitosis: homologs ignore each other. Meiosis I: homologs pair up.',starStep:4,
scene(H){const s=document.getElementById('stage');const CX=225,CY=215;
  const Z=H.cell(s,{x:CX,y:CY,r:152});const nuc=H.nucleus(s,CX,CY,108);
  const q=[['mom',CX-50,CY-30,11],['dad',CX+30,CY+10,23]].map(([c,x,y,sd])=>{const p=H.squiggle(s,x,y,10,c,sd);p.style.strokeWidth=3.5;return p});
  const q2=q.map(p=>{const c=p.cloneNode();s.insertBefore(c,p);c.style.strokeDashoffset=0;H.O(c,0,{d:0});return c});
  const plate=H.E('line',{x1:CX,y1:CY-110,x2:CX,y2:CY+110,pathLength:1,cls:'draw',st:'stroke:var(--muted);stroke-width:1.5'},s);
  const xs=[H.chromosome(s,{L1:34,L2:30,w:9,color:'mom',state:'x',x:CX,y:CY-48}),H.chromosome(s,{L1:34,L2:30,w:9,color:'dad',state:'x',x:CX,y:CY+52})];
  xs.forEach(c=>{H.T(c,{s:.001},{d:0})});
  const name=H.txt(s,22,40,'','big');const note=H.txt(s,CX+70,CY+4,'','lb');
  const ins=H.g(s);H.E('rect',{x:440,y:110,width:186,height:210,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},ins);
  H.txt(ins,533,136,'MEIOSIS I, FOR COMPARISON','cap',{'text-anchor':'middle',st:'font-size:9.5px'});
  H.chromosome(ins,{L1:34,L2:30,w:9,color:'mom',state:'x',x:515,y:220});H.chromosome(ins,{L1:34,L2:30,w:9,color:'dad',state:'x',x:553,y:220});
  H.txt(ins,533,290,'homologs pair up','lb',{'text-anchor':'middle'});H.txt(ins,533,308,'(synapsis)','lbs',{'text-anchor':'middle'});H.O(ins,0,{d:0});
  return [
    ()=>{name.textContent='G1';H.D(q,1,{d:1600})},
    ()=>{name.textContent='G2';q2.forEach(c=>{H.O(c,1,{d:600});H.T(c,{x:6,y:5},{d:1000})})},
    ()=>{name.textContent='Metaphase';H.O([...q,...q2],0,{d:600});H.O(nuc,0,{d:600});xs.forEach((c,i)=>H.T(c,{s:1},{d:1000,at:300+i*150}));H.D(plate,1,{d:800,at:600});
      H.after(1100,()=>{note.textContent='not paired'})},
    ()=>{name.textContent='Anaphase';note.textContent='';H.O(plate,0);xs.forEach(c=>H.setChr(c,'apart',{D:80,d:1500}))},
    ()=>{H.O(ins,1,{d:700})},
  ];}},

/* 17 ─────────────────────────────── */
{sec:'3.6',title:'Mitosis vs Meiosis',wide:true,steps:4,
text:`<div class="tblwrap" data-step="0"><table class="tbl">
<thead><tr><th>In humans (2n = 46)</th><th>Mitosis</th><th>Meiosis</th></tr></thead>
<tbody>
<tr><td>Makes</td><td>all the cells of the body except sex cells</td><td>sex cells only: egg cells or sperm cells</td></tr>
<tr><td>Definition</td><td>one division that makes 2 daughter cells with the same number of chromosomes as the parent</td><td>two divisions that make 4 daughter cells with half the number of chromosomes</td></tr>
<tr><td>Stages</td><td>interphase, prophase, metaphase, anaphase, telophase</td><td>interphase, prophase I, metaphase I, anaphase I, telophase I, prophase II, metaphase II, anaphase II, telophase II</td></tr>
</tbody><tbody data-step="1">
<tr><td>Divisions</td><td>1</td><td>2</td></tr>
<tr><td>Daughter cells</td><td>2</td><td>4</td></tr>
<tr><td>Identical to parent?</td><td>yes</td><td>no: they have half the chromosomes, in new combinations</td></tr>
<tr><td>Chromosomes at the end</td><td>46, the same as the parent</td><td>23, half of the parent</td></tr>
</tbody><tbody data-step="2">
<tr><td>Homologs pair?</td><td>no</td><td>yes, in prophase I (with crossing over)</td></tr>
<tr><td>Cytokinesis</td><td>after telophase</td><td>after telophase I and after telophase II</td></tr>
<tr><td>Reproduction</td><td>asexual</td><td>sexual</td></tr>
</tbody><tbody data-step="3">
<tr><td>Why it is important</td><td>growth, repair of damaged tissue, new body cells to replace dead cells</td><td>makes the sex cells for sexual reproduction, and makes variation in a population</td></tr>
</tbody></table></div>`,
star:'miTosis = my Toes (body cells): 46 → 46. meiOsis = makes Ova (egg cells) and sperm: 46 → 23.',starStep:3},

/* 18 ─────────────────────────────── */
{sec:'3.7–3.8',title:'Summary and Key Terms',wide:true,steps:2,
text:`<div class="cols" data-step="0"><div><h3>Summary</h3><ul>
<li>Mitosis transmits genetic information from a cell to its daughter cells without sex (asexual transmission).</li>
<li>The stages of mitosis are prophase, metaphase, anaphase and telophase.</li>
<li>Mitosis halves the c-value of a replicated cell (4c to 2c). Mitosis does not change the n-value (2n stays 2n).</li>
</ul></div><div><h3>&nbsp;</h3><ul>
<li>In humans, 1c = 3000 Mb and 1n = 23.</li>
<li>Before DNA replication, a human body cell has 2c = 6000 Mb and 2n = 46. After replication, it has 4c = 12 000 Mb and 2n = 46.</li>
<li>Most DNA in higher eukaryotes does not code for genes. So the amount of DNA does not follow complexity (the c-value paradox).</li>
</ul></div></div>
<div data-step="1"><h3>Key terms</h3><div class="terms">
<div class="term"><b>Cell cycle</b>The repeated sequence of growth (G1, S, G2) and division (M).</div>
<div class="term"><b>Interphase</b>G1, S and G2 together: the time between two divisions.</div>
<div class="term"><b>G1 phase</b>First gap phase. The cell grows and does its usual work.</div>
<div class="term"><b>S phase</b>Synthesis phase. The cell replicates its DNA.</div>
<div class="term"><b>G2 phase</b>Second gap phase. The cell grows and makes proteins for division.</div>
<div class="term"><b>G0 phase</b>A permanent state without division, for example in nerve cells.</div>
<div class="term"><b>M phase</b>The phase in which the cell divides.</div>
<div class="term"><b>Mitosis</b>Division of one cell into two genetically identical daughter cells.</div>
<div class="term"><b>Prophase</b>The chromosomes condense, the nuclear envelope dissolves and the spindle forms.</div>
<div class="term"><b>Metaphase</b>The chromosomes align on the metaphase plate.</div>
<div class="term"><b>Metaphase plate</b>The plane across the middle of the cell where the chromosomes align.</div>
<div class="term"><b>Anaphase</b>The sister chromatids separate and move to opposite poles.</div>
<div class="term"><b>Telophase</b>A nuclear envelope forms around each set of chromosomes.</div>
<div class="term"><b>Cytokinesis</b>Division of the cytoplasm into two daughter cells.</div>
<div class="term"><b>Chromatids</b>The two identical DNA molecules of a replicated chromosome (sister chromatids).</div>
<div class="term"><b>Unreplicated chromosome</b>A chromosome with one DNA molecule (one chromatid).</div>
<div class="term"><b>Replicated chromosome</b>A chromosome with two sister chromatids on one centromere.</div>
<div class="term"><b>Centromere</b>The region that holds sister chromatids together. Each chromosome has one.</div>
<div class="term"><b>Kinetochore</b>The region where microtubules attach. Contains the centromere and proteins.</div>
<div class="term"><b>Microtubules</b>Thin protein tubes that make the spindle and move the chromosomes.</div>
<div class="term"><b>Checkpoint, cyclin, CDK</b>A checkpoint is a control stop. A cyclin activates a CDK enzyme, and the CDK moves the cell to the next phase.</div>
<div class="term"><b>Nuclear genome</b>All the DNA in the nucleus.</div>
<div class="term"><b>c-value</b>The amount of DNA in a gamete.</div>
<div class="term"><b>n-value</b>The number of chromosomes in a gamete.</div>
<div class="term"><b>c-value paradox</b>The mismatch between the amount of DNA and the complexity of an organism.</div>
<div class="term"><b>Endoreduplication</b>Repeated S phases without mitosis.</div>
</div></div>`},

/* 19 ─────────────────────────────── */
{sec:'3.9–3.10',title:'Check Your Understanding',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">1. Species A has n = 4 chromosomes. Species B has n = 6. Which species has more DNA? Which species has more genes?</div><button>Show answer</button><div class="a" hidden>You cannot tell. Chromosomes differ greatly in size, so the number of chromosomes does not show the total DNA content. The number of genes does not follow the DNA content closely either.</div></div>
<div class="qa"><div class="q">2. Name some chromosome regions that contain few genes.</div><button>Show answer</button><div class="a" hidden>Centromeres; telomeres (the ends of a chromosome); and heterochromatin (tightly packed regions) that contains repetitive DNA.</div></div>
<div class="qa"><div class="q">3. How many centromeres does a typical chromosome have? What happens if it has two, or none?</div><button>Show answer</button><div class="a" hidden>One. The only exception is a rare type, the holocentric chromosome. With two centromeres, the microtubules can pull the two centromeres to opposite poles, so the chromosome breaks. With no centromere, the chromosome cannot move correctly in mitosis or meiosis. Then the daughter cells get the wrong number of chromosomes (aneuploidy).</div></div>
<div class="qa"><div class="q">4. A diploid organism has 2n = 16. Give the number of chromosomes and chromatids per cell at the end of G1, S, G2 and mitosis.</div><button>Show answer</button><div class="a" hidden>G1: 16 chromosomes with 1 chromatid each. S: 16 with 2 chromatids each. G2: 16 with 2 chromatids each. Mitosis: 16 with 1 chromatid each, in each daughter cell.</div></div>
<div class="qa"><div class="q">5. Look at Table 3.4.1 (slide 13). Is there a relation between DNA content, gene number, gene spacing and chromosome number?</div><button>Show answer</button><div class="a" hidden>There is little relation. Larger genomes tend to have more genes, but not always and not in proportion. Larger genomes also tend to have more distance between genes.</div></div>
<div class="qa"><div class="q">6. Which feature of genomes explains the c-value paradox?</div><button>Show answer</button><div class="a" hidden>Genomes have different amounts of non-coding DNA. The non-coding DNA is between the genes, and also inside genes as introns (non-coding parts of a gene).</div></div>
</div>`},

]});
})();
