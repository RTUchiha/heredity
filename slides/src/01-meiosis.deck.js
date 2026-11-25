/* Chapter 1 · Meiosis (§1.3 + meiosis parts of §1.7–1.10, §3.6) — source: Hairdity.pdf pp.9–37, 58–77 (Singh, Introduction to Genetics, CC BY-NC-SA 4.0) */
(function(){
const H=window.HL;
const ST=()=>document.getElementById('stage');
/* ---- deck-local helpers ---- */
function pop(e,o){H.T(e,{s:1},Object.assign({d:700},o));H.O(e,1,Object.assign({d:300},o));}
function hide(e){H.T(e,{s:.001},{d:0});H.O(e,0,{d:0});}
function arr(p,x1,y1,x2,y2,o){const a=H.arrow(p,x1,y1,x2,y2,o);H.O(a,0,{d:0});return a;}
function showArr(a,o){H.O(a,1,Object.assign({d:200},o));H.D(a.firstChild,1,Object.assign({d:700},o));}
function bar(p,x,y,len,color,o){o=o||{};const G=H.g(p);const w=o.w||6;
  H.E('line',{x1:x,y1:y-len/2,x2:x,y2:y+len/2,st:`stroke:${H.C(color)};stroke-width:${w};stroke-linecap:round`},G);
  if(o.tip)H.E('line',{x1:x,y1:y+len/2-o.tipLen,x2:x,y2:y+len/2,st:`stroke:${H.C(o.tip)};stroke-width:${w};stroke-linecap:round`},G);
  return G;}
/* small cell drawn around its own centre so pop() scales in place */
function miniCell(p,x,y,r,bars,o){o=o||{};const G=H.g(p);
  H.E('circle',{r,cls:'cellfill',st:`stroke:var(--ink);stroke-width:2.5${o.fill?';fill:'+H.C(o.fill):''}`},G);
  (bars||[]).forEach(b=>bar(G,b[0],0,b[1],b[2],b[3]));H.T(G,{x,y},{d:0});return G;}
/* straight segment, retargetable: P→Q */
function seg(p,color,w){const G=H.g(p);H.E('line',{x1:0,y1:0,x2:1,y2:0,cls:'nss',st:`stroke:${H.C(color)};stroke-width:${w||9};stroke-linecap:round`},G);return G;}
function setSeg(G,P,Q,o){const dx=Q[0]-P[0],dy=Q[1]-P[1],len=Math.hypot(dx,dy);
  if(len<.01){H.T(G,{x:P[0],y:P[1],sx:.001,sy:1},o)}else{H.T(G,{x:P[0],y:P[1],r:Math.atan2(dy,dx)*180/Math.PI,sx:len,sy:1},o)}}
function chrom(p,x,y,color,long,extra){return H.chromosome(p,Object.assign({L1:long?26:16,L2:long?26:16,w:7,color,state:'x',x,y},extra||{}));}
/* fibre that grows from the pole */
function grow(p,P,Q){const f=H.fibre(p,P,Q);f.len=Math.hypot(Q[0]-P[0],Q[1]-P[1]);H.T(f,{sx:.001},{d:0});H.O(f,0,{d:0});return f;}
function growOn(f,o){H.O(f,1,Object.assign({d:200},o));H.T(f,{sx:f.len},Object.assign({d:800},o));}
function tag(p,x,y,t){const G=H.g(p);H.E('rect',{x:-10,y:-10,width:20,height:20,rx:5,cls:'card',st:'stroke:var(--ink);stroke-width:1.6'},G);
  H.txt(G,0,5,t,'lb',{'text-anchor':'middle',st:'font-size:13px'});H.T(G,{x,y},{d:0});return G;}
function cap(p,x,y,t,anchor){return H.txt(p,x,y,t,'cap',{'text-anchor':anchor||'middle'});}
function poles(p,xs,y){return xs.map(x=>H.centrosome(p,x,y));}
/* after 'apart': straighten each chromatid (telophase uncoiling look), optional extra shift dx */
function relax(c,dx,o){dx=dx||0;const xa=c.a._t.x-dx,xb=c.b._t.x+dx;H.T(c.a,{x:xa,sx:.001},o);H.T(c.b,{x:xb,sx:.001},o);H.T(c.ca,{x:xa},o);H.T(c.cb,{x:xb},o);H.O([c.ca,c.cb],0,o);}

deck({
docTitle:'Meiosis · Heredity Ch.1',
title:'Meiosis',
chapter:1,
eyebrow:'Heredity · Chapter 1 · Meiosis',
slides:[

/* 1 ─────────────────────────────── */
{sec:'1.3',title:'Why Cells Halve Their Chromosomes',caption:'Chromosomes per body cell over four generations',
text:`<p data-step="0">A <b>chromosome</b> is one long DNA molecule that carries many genes. A human body cell has 46 chromosomes.</p>
<p data-step="0">Most <b>eukaryotes</b> (organisms whose cells have a nucleus) reproduce sexually. A cell from one parent fuses with a cell from the other parent. The two cells that fuse are <b>gametes</b>: sperm cells and egg cells.</p>
<p data-step="1">Suppose that each gamete had 46 chromosomes. Then the child would have 46 + 46 = 92 chromosomes.</p>
<p data-step="2">In each new generation, the number would double again: 184, then 368. A species cannot continue with a chromosome number that doubles in each generation.</p>
<p data-step="3"><b>Meiosis</b> is the cell division that makes gametes. Meiosis halves the chromosome number, so each human gamete has 23 chromosomes. 23 + 23 = 46, so the number stays the same in each generation.</p>
<p data-step="3">Meiosis has steps in common with mitosis. In both, the chromosomes align at the middle of the cell. Then <b>microtubules</b> (thin protein tubes) move them to the two ends of the cell. Meiosis differs from mitosis in two main ways. Meiosis has two divisions, and its first division separates pairs of chromosomes.</p>`,
star:'Half + half = whole: 23 + 23 = 46.',starStep:3,
scene(H){const s=ST();const base=322,k=.68;
  cap(s,170,36,'If gametes had 46');cap(s,470,36,'With meiosis');
  H.E('line',{x1:320,y1:20,x2:320,y2:400,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  const mk=(x0,vals,fill)=>vals.map((v,i)=>{const x=x0+i*55;const G=H.g(s);
    const b=H.g(G);H.E('rect',{x:-19,y:-1,width:38,height:1,st:`fill:${H.C(fill)}`},b);H.T(b,{x,y:base,sy:.001},{d:0});
    const t=H.txt(G,x,base-8,'0','lb',{'text-anchor':'middle',st:'font-variant-numeric:tabular-nums'});
    H.txt(G,x,base+20,'Gen '+(i+1),'lbs',{'text-anchor':'middle'});H.O(G,0,{d:0});
    return {G,b,t,v,h:v*k}});
  [[45,295],[345,595]].forEach(([a,b])=>H.E('line',{x1:a,y1:base,x2:b,y2:base,cls:'k',st:'stroke-width:2'},s));
  const L=mk(87,[46,92,184,368],'bad'),R=mk(387,[46,46,46,46],'good');
  const up=(c,o)=>{H.O(c.G,1,{d:200,at:o&&o.at});H.T(c.b,{sy:c.h},Object.assign({d:900},o));H.T(c.t,{y:-c.h},Object.assign({d:900},o));H.count(c.t,0,c.v,o)};
  const fL=H.txt(s,170,372,'46 + 46 = 92: the number doubles','lb',{'text-anchor':'middle'}),fR=H.txt(s,470,372,'23 + 23 = 46: the number stays','lb',{'text-anchor':'middle'});
  const fL2=H.txt(s,170,394,'each gamete has 46','lbs',{'text-anchor':'middle'}),fR2=H.txt(s,470,394,'each gamete has 23','lbs',{'text-anchor':'middle'});
  H.O([fL,fR,fL2,fR2],0,{d:0});
  return [
    ()=>{up(L[0]);up(R[0])},
    ()=>{up(L[1]);H.O([fL,fL2],1,{at:400})},
    ()=>{up(L[2]);up(L[3],{at:500})},
    ()=>{R.slice(1).forEach((c,i)=>up(c,{at:i*250}));H.O([fR,fR2],1,{at:600})},
  ];}},

/* 2 ─────────────────────────────── */
{sec:'1.3',title:'Meiosis in Five Moves',caption:'2n = 4 model: one long pair and one short pair · blue = from dad, orange = from mom',
text:`<p data-step="0">A <b>meiocyte</b> is a cell that will divide by meiosis. A meiocyte is <b>diploid (2n)</b>: it has two sets of chromosomes, one set from each parent. The two chromosomes of a pair are <b>homologous chromosomes</b>, or <b>homologs</b>. Homologs carry the same genes in the same order.</p>
<p data-step="1">First, the meiocyte grows and copies its DNA, as a cell does before mitosis. A <b>replicated chromosome</b> has two identical <b>sister chromatids</b>. A <b>centromere</b> holds the two sister chromatids together.</p>
<p data-step="2">Meiosis then has two divisions. In <b>Meiosis I</b>, each chromosome finds its homolog, and the two homologs pair.</p>
<p data-step="3">Paired homologs exchange segments of DNA. The exchange is <b>crossing over</b>.</p>
<p data-step="4">At the end of Meiosis I, the two homologs of each pair go into different cells. Each of the two cells has one set of chromosomes, so each cell is <b>haploid (1n)</b>.</p>
<p data-step="5">In <b>Meiosis II</b>, the sister chromatids separate. After two divisions of the cytoplasm, there are four cells. Each cell has one copy of each chromosome.</p>
<p data-step="5" class="note">Most multicellular organisms use meiosis to make gametes. Some single-celled eukaryotes, such as yeast, use meiosis to enter the haploid part of their life cycle. An <b>oocyte</b> is a cell that will become an egg. A <b>spermatocyte</b> is a cell that will become sperm.</p>`,
star:'Meiosis I separates the Pairs. Meiosis II separates the Sisters.',starStep:5,
scene(H){const s=ST();
  const A=H.cell(s,{x:320,y:200,r:130});
  const B=[195,445].map(x=>{const c=H.cell(s,{x,y:200,r:80.6});H.T(c,{r:90},{d:0});H.O(c,0,{d:0});return c});
  const bL=chrom(s,270,165,'dad',1,{state:'single',tipsB:[{from:8,color:'mom'}]}),oL=chrom(s,370,235,'mom',1,{state:'single',tipsA:[{from:8,color:'dad'}]});
  const bS=chrom(s,360,150,'dad',0,{state:'single'}),oS=chrom(s,280,262,'mom',0,{state:'single'});
  const all=[bL,oL,bS,oS];all.forEach(c=>H.O(c,0,{d:0}));
  const lab=H.txt(s,320,395,'','lb',{'text-anchor':'middle'});const say=t=>{lab.textContent=t};
  const tipOn=o=>{H.O(bL.b.tips[0],1,o);H.O(oL.a.tips[0],1,o)};
  const spark=H.g(s);[[320,173]].forEach(([x,y])=>[0,45,90,135].forEach(a=>{const r=a*Math.PI/180;
    H.E('line',{x1:x-9*Math.cos(r),y1:y-9*Math.sin(r),x2:x+9*Math.cos(r),y2:y+9*Math.sin(r),st:'stroke:var(--hi);stroke-width:3;stroke-linecap:round'},spark)}));H.O(spark,0,{d:0});
  return [
    ()=>{all.forEach((c,i)=>H.O(c,1,{at:i*120}));say('Meiocyte · 2n · 4 chromosomes')},
    ()=>{all.forEach(c=>H.setChr(c,'x',{d:1200}));say('S phase: each chromosome now has 2 sister chromatids')},
    ()=>{H.T(bL,{x:303,y:150},{d:1100});H.T(oL,{x:337,y:150},{d:1100});H.T(oS,{x:303,y:255},{d:1100});H.T(bS,{x:337,y:255},{d:1100});say('Meiosis I: homologs pair')},
    ()=>{H.O(spark,1,{d:200});H.after(400,()=>{tipOn({d:500});H.O(spark,0,{d:400})});say('Crossing over: homologs exchange segments')},
    ()=>{H.cleave(A,125,.62,{d:1500});H.T(bL,{x:182,y:200},{d:1300});H.T(oS,{x:210,y:200},{d:1300});H.T(oL,{x:432,y:200},{d:1300});H.T(bS,{x:460,y:200},{d:1300});say('End of Meiosis I: 2 cells, each 1n')},
    ()=>{H.O(A,0,{d:0});B.forEach(c=>H.O(c,1,{d:0}));B.forEach(c=>H.cleave(c,78,.62,{d:1500}));
      [[bL,195,191],[oS,195,213],[oL,445,191],[bS,445,213]].forEach(([c,x,y])=>{H.T(c,{x,y,r:90},{d:700});H.after(650,()=>{H.setChr(c,'apart',{D:70,d:1200});H.after(1250,()=>relax(c,0,{d:700}))})});
      say('End of Meiosis II: 4 haploid cells, all different')},
  ];}},

/* 3 ─────────────────────────────── */
{sec:'1.3',title:'Prophase I: Homologs Pair',caption:'one homologous pair, nuclear envelope dashed',
text:`<p data-step="0"><b>Prophase I</b> is the first stage of Meiosis I. Prophase I takes a long time. Biologists divide it into five substages. In <b>leptotene</b>, the replicated chromosomes condense into thin visible threads. The <b>centrosomes</b> (the structures that organize the spindle) move toward the two ends of the cell, the <b>poles</b>.</p>
<p data-step="1">In <b>zygotene</b>, each chromosome attaches to its homolog along its full length. The attachment is <b>synapsis</b>, and the homologs <b>synapse</b> (synapse means junction). Proteins bind to both homologs and make a protein ladder between them, the <b>synaptonemal complex</b>.</p>
<p data-step="2">In <b>pachytene</b>, synapsis is complete. The two synapsed homologs form a <b>bivalent</b>. A bivalent has four chromatids, so biologists also call it a <b>tetrad</b>. Crossing over occurs inside the synaptonemal complex.</p>
<p data-step="3">In <b>diplotene</b>, the synaptonemal complex disappears and the four chromatids become visible. The homologs move a small distance apart. They stay attached where crossing over occurred. Each attachment point is a <b>chiasma</b> (plural: <b>chiasmata</b>).</p>
<p data-step="4">In <b>diakinesis</b>, the chromatids become shorter and thicker. The <b>nuclear envelope</b> (the membrane around the nucleus) dissolves. The <b>spindle fibres</b> (bundles of microtubules) start to form.</p>`,
star:'Lazy Zebras Pack Dinner Daily: Leptotene, Zygotene, Pachytene, Diplotene, Diakinesis.',starStep:4,
scene(H){const s=ST();
  const nuc=H.nucleus(s,320,190,152);
  const cen=[[150,190],[490,190]];const cs=cen.map(([x,y])=>{const c=H.centrosome(s,x,y);H.O(c,0,{d:0});return c});
  const aster=H.g(s);cen.forEach(([x,y],j)=>[-50,-25,0,25,50].forEach(a=>{const r=(a+(j?180:0))*Math.PI/180;
    H.E('path',{d:`M${x+10*Math.cos(r)},${y+10*Math.sin(r)} L${x+40*Math.cos(r)},${y+40*Math.sin(r)}`,pathLength:1,cls:'draw k',st:'stroke-width:1.5'},aster)}));
  const biv=H.g(s);H.T(biv,{x:320,y:190},{d:0});
  const sc=H.g(biv);const rails=[-11,11].map(x=>H.E('path',{d:`M${x},-96 L${x},96`,pathLength:1,cls:'draw k',st:'stroke-width:2'},sc));
  const rungs=[];for(let y=-90;y<=90;y+=12)rungs.push(H.E('line',{x1:-11,y1:y,x2:11,y2:y,st:'stroke:var(--muted);stroke-width:1.5;opacity:0'},sc));
  const b=H.chromosome(biv,{L1:100,L2:100,w:12,color:'dad',state:'open',x:-80,y:-12,tipsB:[{from:40,color:'mom'}]});
  const o=H.chromosome(biv,{L1:100,L2:100,w:12,color:'mom',state:'open',x:80,y:12,tipsA:[{from:40,color:'dad'}]});
  H.O([b,o],0,{d:0});
  const chi=H.g(biv);H.E('line',{x1:-30,y1:24,x2:30,y2:56,cls:'nss',st:'stroke:var(--dad);stroke-width:12;stroke-linecap:round'},chi);
  H.E('line',{x1:30,y1:24,x2:-30,y2:56,cls:'nss',st:'stroke:var(--mom);stroke-width:12;stroke-linecap:round'},chi);H.O(chi,0,{d:0});
  const chiL=H.g(s);H.E('path',{d:'M352,230 L420,262',pathLength:1,cls:'draw k',st:'stroke-width:1.3'},chiL);H.txt(chiL,424,267,'chiasma','lb');H.O(chiL,0,{d:0});
  const scL=H.g(s);H.E('path',{d:'M331,120 L420,96',pathLength:1,cls:'draw k',st:'stroke-width:1.3'},scL);H.txt(scL,424,100,'synaptonemal','lb');H.txt(scL,424,116,'complex','lb');H.O(scL,0,{d:0});
  const names=['Leptotene','Zygotene','Pachytene','Diplotene','Diakinesis'];const tl=H.g(s);
  H.E('line',{x1:70,y1:372,x2:570,y2:372,st:'stroke:var(--faint);stroke-width:2'},tl);
  const dots=names.map((n,i)=>{const x=70+i*125;const d=H.E('circle',{cx:x,cy:372,r:6,st:'fill:var(--paper);stroke:var(--faint);stroke-width:2'},tl);
    const t=H.txt(tl,x,398,n,'lbs',{'text-anchor':'middle'});return [d,t]});
  const on=i=>dots.forEach(([d,t],j)=>{d.style.fill=j<=i?'var(--ink)':'var(--paper)';d.style.stroke=j<=i?'var(--ink)':'var(--faint)';t.style.fill=j===i?'var(--ink)':'var(--muted)';t.style.fontWeight=j===i?700:500});
  return [
    ()=>{H.O([b,o],1,{d:900});H.O(cs,1,{at:300});H.T(cs[0],{x:165},{d:1200});H.T(cs[1],{x:475},{d:1200});on(0)},
    ()=>{H.T(b,{x:-40,y:0},{d:1300});H.T(o,{x:40,y:0},{d:1300});H.D(rails,1,{d:1500,at:900});rungs.forEach((r,i)=>H.O(r,1,{at:900+i*80}));H.O(scL,1,{at:1400});H.D(scL.firstChild,1,{at:1400});on(1)},
    ()=>{H.O(b.b.tips[0],1,{d:600,at:200});H.O(o.a.tips[0],1,{d:600,at:200});on(2)},
    ()=>{H.O(sc,0,{d:600});H.O(scL,0,{d:400});H.T(b,{x:-50},{d:1000});H.T(o,{x:50},{d:1000});H.O(chi,1,{at:700});H.O(chiL,1,{at:900});H.D(chiL.firstChild,1,{at:900});on(3)},
    ()=>{H.T(biv,{sy:.84},{d:1100});H.O(nuc,0,{d:900});H.D([...aster.children],1,{d:900,at:400});H.O(chiL,0,{d:400});on(4)},
  ];}},

/* 4 ─────────────────────────────── */
{sec:'1.3',title:'Crossing Over',caption:'gene A/a near the top, gene B/b near the bottom',
text:`<p data-step="0">In pachytene, the four chromatids of a bivalent lie side by side. Two chromatids from the same homolog are sister chromatids. Two chromatids from different homologs are <b>non-sister chromatids</b>.</p>
<p data-step="0">An <b>allele</b> is one version of a gene. The blue homolog carries alleles A and B. The orange homolog carries alleles a and b. Homologs carry the same genes, but their alleles can differ.</p>
<p data-step="1"><b>DNA repair enzymes</b> (proteins that repair DNA) cut two non-sister chromatids. The two cuts are at almost the same location.</p>
<p data-step="2">The enzymes then join each cut end to the other non-sister chromatid with <b>covalent bonds</b> (strong chemical bonds). The point where the two chromatids cross is a chiasma. Chiasmata hold the homologs together during Meiosis I. As a result, each pair aligns in the correct direction and separates correctly.</p>
<p data-step="3">The new arrangement stays until the end of meiosis. Two chromatids keep the parental combinations, AB and ab. The two chromatids with new combinations, Ab and aB, are <b>recombinant</b> chromatids. A change in allele combinations is <b>recombination</b>.</p>
<p data-step="3">So crossing over increases <b>genetic diversity</b> (the differences between the individuals of a population). Over many generations, <b>natural selection</b> acts on that diversity. Allele combinations that help survival and reproduction become more common. In this way, populations <b>evolve</b> (change over time).</p>`,
star:'CROSSing over = non-sisters CROSS and swap ends.',starStep:3,
scene(H){const s=ST();const top=70,bot=320,brk=210,cy=150;
  const X={c1:250,c2:280,c3:360,c4:390};
  const c1=seg(s,'dad'),c4=seg(s,'mom');setSeg(c1,[X.c1,top],[X.c1,bot],{d:0});setSeg(c4,[X.c4,top],[X.c4,bot],{d:0});
  const BU=[seg(s,'dad'),seg(s,'dad')],BL=[seg(s,'dad'),seg(s,'dad')],OU=[seg(s,'mom'),seg(s,'mom')],OL=[seg(s,'mom'),seg(s,'mom')];
  const cenB=H.g(s);H.E('rect',{x:X.c1-6,y:cy-5,width:X.c2-X.c1+12,height:10,rx:5,cls:'kf'},cenB);
  const cenO=H.g(s);H.E('rect',{x:X.c3-6,y:cy-5,width:X.c4-X.c3+12,height:10,rx:5,cls:'kf'},cenO);
  const T={A1:tag(s,X.c1,100,'A'),B1:tag(s,X.c1,280,'B'),A2:tag(s,X.c2,100,'A'),B2:tag(s,X.c2,280,'B'),a3:tag(s,X.c3,100,'a'),b3:tag(s,X.c3,280,'b'),a4:tag(s,X.c4,100,'a'),b4:tag(s,X.c4,280,'b')};
  const st=(G,P,Q,o)=>setSeg(G,P,Q,o);
  function intact(o,dy){dy=dy||0;
    st(BU[0],[X.c2,top],[X.c2,brk-dy],o);st(BU[1],[X.c2,brk-dy],[X.c2,brk-dy],o);H.T(BU[1],{r:26.6},o);
    st(BL[0],[X.c2,brk+dy],[X.c2,brk+dy],o);H.T(BL[0],{r:153.4},o);st(BL[1],[X.c2,brk+dy],[X.c2,bot],o);
    st(OU[0],[X.c3,top],[X.c3,brk-dy],o);st(OU[1],[X.c3,brk-dy],[X.c3,brk-dy],o);H.T(OU[1],{r:153.4},o);
    st(OL[0],[X.c3,brk+dy],[X.c3,brk+dy],o);H.T(OL[0],{r:26.6},o);st(OL[1],[X.c3,brk+dy],[X.c3,bot],o);}
  intact({d:0});
  const spark=H.g(s);[[X.c2,brk],[X.c3,brk]].forEach(([x,y])=>[0,45,90,135].forEach(a=>{const r=a*Math.PI/180;
    H.E('line',{x1:x-10*Math.cos(r),y1:y-10*Math.sin(r),x2:x+10*Math.cos(r),y2:y+10*Math.sin(r),st:'stroke:var(--hi);stroke-width:3;stroke-linecap:round'},spark)}));H.O(spark,0,{d:0});
  const lab=H.g(s);H.txt(lab,265,54,'sisters','lbs',{'text-anchor':'middle'});H.txt(lab,375,54,'sisters','lbs',{'text-anchor':'middle'});
  H.txt(lab,320,26,'non-sisters','lbs',{'text-anchor':'middle'});H.E('path',{d:'M292,36 L348,36',cls:'k',st:'stroke-width:1.3'},lab);
  const chiL=H.g(s);H.txt(chiL,320,128,'chiasma','lb',{'text-anchor':'middle'});H.E('path',{d:'M320,136 L320,196',pathLength:1,cls:'draw k',st:'stroke-width:1.3'},chiL);H.O(chiL,0,{d:0});
  const res=H.g(s);[[190,'AB'],[220,'Ab'],[420,'aB'],[450,'ab']].forEach(([x,t],i)=>H.txt(res,x,352,t,'lb',{'text-anchor':'middle',st:(i===1||i===2)?'fill:var(--ink);font-weight:800':'fill:var(--muted)'}));
  H.txt(res,205,374,'parental · recombinant','lbs',{'text-anchor':'middle'});H.txt(res,435,374,'recombinant · parental','lbs',{'text-anchor':'middle'});H.O(res,0,{d:0});
  return [
    ()=>{},
    ()=>{intact({d:600},10);H.O(spark,1,{d:250});H.O(lab,.35,{d:400})},
    ()=>{const o={d:1100};H.O(spark,0,{d:300});
      st(BU[0],[X.c2,top],[X.c2,190],o);st(BU[1],[X.c2,190],[320,brk],o);st(OL[0],[320,brk],[X.c3,230],o);st(OL[1],[X.c3,230],[X.c3,bot],o);
      st(OU[0],[X.c3,top],[X.c3,190],o);st(OU[1],[X.c3,190],[320,brk],o);st(BL[0],[320,brk],[X.c2,230],o);st(BL[1],[X.c2,230],[X.c2,bot],o);
      H.O(chiL,1,{at:700});H.D(chiL.firstChild,1,{at:700})},
    ()=>{const o={d:1500};H.O(chiL,0,{d:300});H.O(lab,0,{d:300});const L=-60,R=60;
      st(c1,[X.c1+L,top],[X.c1+L,bot],o);st(c4,[X.c4+R,top],[X.c4+R,bot],o);
      st(BU[0],[X.c2+L,top],[X.c2+L,brk],o);st(BU[1],[X.c2+L,brk],[X.c2+L,brk],o);st(OL[0],[X.c2+L,brk],[X.c2+L,brk],o);st(OL[1],[X.c2+L,brk],[X.c2+L,bot],o);
      st(OU[0],[X.c3+R,top],[X.c3+R,brk],o);st(OU[1],[X.c3+R,brk],[X.c3+R,brk],o);st(BL[0],[X.c3+R,brk],[X.c3+R,brk],o);st(BL[1],[X.c3+R,brk],[X.c3+R,bot],o);
      H.T(cenB,{x:L},o);H.T(cenO,{x:R},o);
      H.T(T.A1,{x:X.c1+L},o);H.T(T.B1,{x:X.c1+L},o);H.T(T.A2,{x:X.c2+L},o);H.T(T.b3,{x:X.c2+L},o);
      H.T(T.a3,{x:X.c3+R},o);H.T(T.B2,{x:X.c3+R},o);H.T(T.a4,{x:X.c4+R},o);H.T(T.b4,{x:X.c4+R},o);
      H.O(res,1,{at:1200})},
  ];}},

/* 5 ─────────────────────────────── */
{sec:'1.3',title:'Metaphase I: Pairs Align',caption:'Spindle fibres from each pole · each pair can face either way',
text:`<p data-step="0">In <b>Metaphase I</b>, the bivalents align on the <b>metaphase plate</b>, the plane across the middle (equator) of the cell. They align as pairs, in double file. In mitosis, chromosomes align one at a time, in single file.</p>
<p data-step="1">Each homolog attaches to spindle fibres from one pole. Both of its sister chromatids attach to fibres from that same pole. The other homolog attaches to fibres from the opposite pole.</p>
<p data-step="2">The direction of each pair is random. The direction of one pair has no effect on the direction of another pair. As a result, each gamete gets a mixture of chromosomes from dad and from mom.</p>
<p data-step="3">With n pairs, there are 2<sup>n</sup> possible combinations of chromosomes. Humans have 23 pairs, so one person can make 2<sup>23</sup> = 8,388,608 combinations. Crossing over makes even more combinations.</p>
<p data-step="3">Random alignment is the basis of Mendel’s second law, the <b>Law of Independent Assortment</b>. Gregor Mendel found the laws of heredity with pea plants in the 1860s. Genes on different chromosomes go into gametes independently of each other.</p>`,
star:'Metaphase I = pairs, double file. Independent assortment happens here.',starStep:3,
scene(H){const s=ST();const cx=320,cy=175,r=150,yL=115,yS=235,PL=[195,cy],PR=[445,cy];
  H.E('circle',{cx,cy,r,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},s);
  H.E('line',{x1:cx,y1:cy-130,x2:cx,y2:cy+130,st:'stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 5'},s);
  H.txt(s,cx+8,cy-116,'metaphase plate','lbs');
  poles(s,[PL[0],PR[0]],cy);
  const fb=H.g(s);
  const bL=chrom(s,302,yL,'dad',1),oL=chrom(s,338,yL,'mom',1),bS=chrom(s,302,yS,'dad',0),oS=chrom(s,338,yS,'mom',0);
  const fl=[grow(fb,PL,[294,yL-4]),grow(fb,PL,[294,yL+4]),grow(fb,PR,[346,yL-4]),grow(fb,PR,[346,yL+4])];
  const fs=[grow(fb,PL,[294,yS-4]),grow(fb,PL,[294,yS+4]),grow(fb,PR,[346,yS-4]),grow(fb,PR,[346,yS+4])];
  const g4=[[[-7,30,'dad'],[7,18,'dad']],[[-7,30,'mom'],[7,18,'mom']],[[-7,30,'dad'],[7,18,'mom']],[[-7,30,'mom'],[7,18,'dad']]];
  const gam=[[140,'1'],[230,'1'],[410,'2'],[500,'2']].map(([x],i)=>{const c=miniCell(s,x,378,22,g4[i]);hide(c);return c});
  const t1=H.txt(s,185,348,'facing way 1','lbs',{'text-anchor':'middle'}),t2=H.txt(s,455,348,'facing way 2','lbs',{'text-anchor':'middle'});H.O([t1,t2],0,{d:0});
  const f1=H.txt(s,18,44,'n = 2 pairs','lb',{st:'font-family:var(--f-math);font-style:italic;font-size:17px'});
  const f2=H.txt(s,18,82,'2² = 4','big');const f3=H.txt(s,18,120,'','big',{st:'font-variant-numeric:tabular-nums'});
  const f4=H.txt(s,18,140,'','lbs');H.O([f1,f2],0,{d:0});
  return [
    ()=>{},
    ()=>{[...fl,...fs].forEach((f,i)=>growOn(f,{at:i*60}));H.O(t1,1,{at:800});pop(gam[0],{at:900});pop(gam[1],{at:1000})},
    ()=>{fs.forEach(f=>H.O(f,0,{d:300}));H.T(bS,{x:320,y:278},{d:600});H.T(oS,{x:320,y:196},{d:600});
      H.after(650,()=>{H.T(bS,{x:338,y:yS},{d:700});H.T(oS,{x:302,y:yS},{d:700});H.after(750,()=>fs.forEach(f=>H.O(f,1,{d:400})))});
      H.O(t2,1,{at:1200});pop(gam[2],{at:1300});pop(gam[3],{at:1400});H.O([f1,f2],1,{at:1500})},
    ()=>{f1.textContent='human: n = 23 pairs';f2.textContent='2²³ =';H.count(f3,4,8388608,{d:1600});f4.textContent='combinations'},
  ];}},

/* 6 ─────────────────────────────── */
{sec:'1.3',title:'Anaphase I: Homologs Separate',caption:'Long pair: A on the blue homolog, a on the orange homolog',
text:`<p data-step="0">At the end of Metaphase I, chiasmata still hold the homologs of each pair together.</p>
<p data-step="1">In <b>Anaphase I</b>, the chiasmata dissolve. The proteins that held the homologs together detach.</p>
<p data-step="2">Spindle fibres move the two homologs of each pair to opposite poles. One homolog of each pair goes to each future daughter cell.</p>
<p data-step="2">The centromeres do not divide, so the sister chromatids stay joined. Each pole gets complete replicated chromosomes.</p>
<p data-step="3">Anaphase I is the physical basis of Mendel’s first law, the <b>Law of Equal Segregation</b>. The two alleles of a gene, A and a, go into different cells. Each gamete gets one allele of each gene.</p>`,
star:'Anaphase I: homologs Apart. Sisters stay joined.',starStep:3,
scene(H){const s=ST();const cx=320,cy=175,r=150,yL=115,yS=235,PL=[185,cy],PR=[455,cy];
  H.E('circle',{cx,cy,r,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},s);
  const plate=H.E('line',{x1:cx,y1:cy-130,x2:cx,y2:cy+130,st:'stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 5'},s);
  poles(s,[PL[0],PR[0]],cy);const fb=H.g(s);
  const bL=chrom(s,302,yL,'dad',1,{tipsB:[{from:8,color:'mom',show:1}]}),oL=chrom(s,338,yL,'mom',1,{tipsA:[{from:8,color:'dad',show:1}]});
  const bS=chrom(s,302,yS,'dad',0),oS=chrom(s,338,yS,'mom',0);
  H.txt(bL,0,-36,'A','lb',{'text-anchor':'middle'});H.txt(oL,0,-36,'a','lb',{'text-anchor':'middle'});
  const chi=H.g(s);H.E('line',{x1:310,y1:122,x2:330,y2:134,st:'stroke:var(--ink);stroke-width:3;stroke-linecap:round'},chi);H.E('line',{x1:330,y1:122,x2:310,y2:134,st:'stroke:var(--ink);stroke-width:3;stroke-linecap:round'},chi);
  const F=[[bL,PL,-8],[bS,PL,-8],[oL,PR,8],[oS,PR,8]].map(([c,P,dx])=>{const y=c===bL||c===oL?yL:yS;const x=(c===bL||c===bS?302:338)+dx;
    return [c,dx,[H.fibre(fb,P,[x,y-4]),H.fibre(fb,P,[x,y+4])]]});
  const n1=H.txt(s,320,350,'Centromeres do not divide: sister chromatids stay joined','lbs',{'text-anchor':'middle'}),n2=H.g(s);
  const seg1=H.txt(s,320,378,'A goes to one cell. a goes to the other cell.','lb',{'text-anchor':'middle'});
  const seg2=H.txt(s,320,400,'Law of Equal Segregation','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  H.O([n1,n2,seg1,seg2],0,{d:0});
  return [
    ()=>{},
    ()=>{H.T(chi,{s:1.6},{d:500});H.O(chi,0,{d:600,at:200})},
    ()=>{const o={d:1600};H.O(plate,.3,o);
      F.forEach(([c,dx,fs])=>{const x=(c===bL||c===bS)?222:418;const y=(c===bL||c===oL)?yL:yS;H.T(c,{x},o);fs.forEach((f,i)=>H.fibreTo(f,[x+dx,y+(i?4:-4)],o))});
      H.O([n1,n2],1,{at:1400})},
    ()=>{H.O([seg1,seg2],1)},
  ];}},

/* 7 ─────────────────────────────── */
{sec:'1.3',title:'Telophase I and Interkinesis',caption:'Each new cell: 1n, 2 chromosomes, 4 chromatids',
text:`<p data-step="0">At the end of Anaphase I, each pole has one complete set of replicated chromosomes.</p>
<p data-step="1">In <b>Telophase I</b>, a nuclear envelope forms again around each set. The spindle fibres disappear.</p>
<p data-step="2">Next, <b>cytokinesis</b> (division of the cytoplasm) makes two daughter cells. Each daughter cell has half the number of chromosomes. Each chromosome still has two sister chromatids.</p>
<p data-step="2">The number of chromosome sets falls from 2n to 1n. For that reason, Meiosis I is a <b>reductional division</b>.</p>
<p data-step="3"><b>Interkinesis</b> is the short stage between Meiosis I and Meiosis II. Interkinesis is similar to <b>interphase</b> (the time between two divisions of a body cell). Unlike interphase, interkinesis has no <b>S phase</b> (DNA copy phase), so the cell does not copy its DNA again.</p>`,
star:'Meiosis I REDUCES: 2n → 1n. No DNA copy before Meiosis II.',starStep:3,
scene(H){const s=ST();const cy=190,PL=[160,cy],PR=[480,cy];
  const C=H.cell(s,{x:320,y:cy,r:165});const fb=H.g(s);const ps=poles(s,[PL[0],PR[0]],cy);
  const sets=[[222,'dad','dad'],[418,'mom','mom']].map(([x,cl,cs],i)=>[chrom(s,x,160,cl,1,i?{tipsA:[{from:8,color:'dad',show:1}]}:{tipsB:[{from:8,color:'mom',show:1}]}),chrom(s,x,232,cs,0)]);
  const fs=[];[[PL,212],[PR,428]].forEach(([P,x])=>[160,232].forEach(y=>{fs.push(H.fibre(fb,P,[x,y-4]),H.fibre(fb,P,[x,y+4]))}));
  const nucs=[222,418].map(x=>{const n=H.nucleus(s,x,192,74);H.O(n,0,{d:0});return n});
  const lb=[];[222,418].forEach(x=>{lb.push(H.txt(s,x,316,'1n','lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:18px'}),H.txt(s,x,336,'2 chromosomes, 4 chromatids','lbs',{'text-anchor':'middle'}))});H.O(lb,0,{d:0});
  const noS=H.g(s);H.E('circle',{cx:320,cy:cy,r:20,st:'fill:var(--paper);stroke:var(--bad);stroke-width:3'},noS);
  H.txt(noS,320,cy+8,'S','big',{'text-anchor':'middle',st:'font-size:22px'});H.E('line',{x1:306,y1:cy+14,x2:334,y2:cy-14,st:'stroke:var(--bad);stroke-width:3;stroke-linecap:round'},noS);
  H.txt(noS,320,370,'Interkinesis: no S phase, no DNA copying','lb',{'text-anchor':'middle'});H.O(noS,0,{d:0});
  return [
    ()=>{},
    ()=>{H.O(fs,0,{d:700});H.O(nucs,1,{d:900,at:300});H.O(ps,0,{d:700})},
    ()=>{H.cleave(C,98,.6,{d:1600});H.O(lb,1,{at:1300})},
    ()=>{H.O(noS,1)},
  ];}},

/* 8 ─────────────────────────────── */
{sec:'1.3',title:'Meiosis II: Sisters Separate',caption:'Both cells from Meiosis I divide at the same time',
text:`<p data-step="0"><b>Meiosis II</b> is similar to mitosis. Both cells from Meiosis I divide again. In <b>Prophase II</b>, the chromosomes condense and the nuclear envelope dissolves. The <b>centrioles</b> (small cylinders inside each centrosome) move to the poles.</p>
<p data-step="1">In <b>Metaphase II</b>, the chromosomes align on the metaphase plate one at a time, in single file. The two sister chromatids of each chromosome attach to spindle fibres from opposite poles.</p>
<p data-step="2">In <b>Anaphase II</b>, the centromeres divide. The sister chromatids move to opposite poles.</p>
<p data-step="3">In <b>Telophase II</b>, the chromosomes start to uncoil. The nuclear envelope and the <b>nucleoli</b> (dense regions inside the nucleus) form again. Cytokinesis then makes four daughter cells. Each daughter cell is haploid.</p>
<p data-step="4">Meiosis II separates sister chromatids, as mitosis does. The number of chromosome sets stays at 1n. For that reason, Meiosis II is an <b>equational division</b>. Crossing over and independent assortment make the four cells all different.</p>`,
star:'EQUational = the number stays EQUal. Meiosis II = mitosis of a 1n cell.',starStep:4,
scene(H){const s=ST();const cy=200,X=[170,470];
  const C=X.map(x=>H.cell(s,{x,y:cy,r:100}));
  const nucs=X.map(x=>H.nucleus(s,x,cy,62));const fb=H.g(s);
  const ps=[];X.forEach(x=>{ps.push(...poles(s,[x-75,x+75],cy))});H.O(ps,0,{d:0});
  ps.forEach((p,i)=>H.T(p,{x:X[i>>1]+(i%2?18:-18)},{d:0}));
  const plates=X.map(x=>{const l=H.E('line',{x1:x,y1:cy-80,x2:x,y2:cy+80,st:'stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 5'},s);H.O(l,0,{d:0});return l});
  const L=[chrom(s,150,180,'dad',1,{tipsB:[{from:8,color:'mom',show:1}]}),chrom(s,450,215,'mom',1,{tipsA:[{from:8,color:'dad',show:1}]})];
  const S=[chrom(s,195,228,'dad',0),chrom(s,492,172,'mom',0)];
  const all=[];X.forEach((x,i)=>{all.push([L[i],x,175],[S[i],x,238])});
  const F=all.map(([c,x,y])=>[H.fibre(fb,[x-75,cy],[x-7,y]),H.fibre(fb,[x+75,cy],[x+7,y])]);F.flat().forEach(f=>H.O(f,0,{d:0}));
  const names=[[118,'AB'],[222,'Ab'],[418,'aB'],[522,'ab']].map(([x,t])=>{const e=H.txt(s,x,300,t,'lb',{'text-anchor':'middle'});H.O(e,0,{d:0});return e});
  const sum=H.txt(s,320,350,'4 haploid cells · all different','lb',{'text-anchor':'middle'});H.O(sum,0,{d:0});
  return [
    ()=>{H.O(nucs,0,{d:1000});H.O(ps,1,{d:600,at:300});ps.forEach((p,i)=>H.T(p,{x:X[i>>1]+(i%2?75:-75)},{d:1200,at:300}))},
    ()=>{all.forEach(([c,x,y],i)=>H.T(c,{x,y},{d:1100}));H.O(plates,1,{at:600});F.flat().forEach((f,i)=>{H.O(f,1,{d:300,at:900})})},
    ()=>{const o={d:1400};all.forEach(([c,x,y],i)=>{H.setChr(c,'apart',Object.assign({D:40},o));H.fibreTo(F[i][0],[x-61,y],o);H.fibreTo(F[i][1],[x+61,y],o)});H.O(plates,0,{d:600})},
    ()=>{F.flat().forEach(f=>H.O(f,0,{d:500}));C.forEach(c=>H.cleave(c,52,.55,{d:1500}));H.O(ps,0,{d:600});all.forEach(([c,x],j)=>{relax(c,3,{d:1200,at:300});H.T(c,{x:x+(j%2?9:-9)},{d:1200,at:300})})},
    ()=>{H.O(names,1);H.O(sum,1,{at:300})},
  ];}},

/* 9 ─────────────────────────────── */
{sec:'1.3',title:'Counting DNA and Chromosome Sets',caption:'c = amount of DNA, n = number of chromosome sets',
text:`<p data-step="0">Two numbers describe the genetic material in a cell. The letter <b>c</b> gives the amount of DNA. The letter <b>n</b> gives the number of complete chromosome sets. A meiocyte in <b>G1</b> (the growth phase before DNA copy) is 2c and 2n.</p>
<p data-step="1">In S phase, the amount of DNA doubles to 4c. A replicated chromosome is still one chromosome, because it has one centromere. So the cell stays 2n.</p>
<p data-step="2">Meiosis I separates the homologs. Each cell gets half the DNA (2c) and one set of chromosomes (1n). In humans, 46 chromosomes become 23 per cell.</p>
<p data-step="3">Meiosis II separates the sister chromatids. Each cell gets half the DNA again (1c), and the number of sets stays 1n. A human gamete has 1c of DNA, about 3000 million <b>base pairs</b> (the rungs of the DNA ladder). A human gamete also has 1n = 23 chromosomes.</p>`,
star:'c counts DNA. n counts sets. S doubles c, not n.',starStep:3,
scene(H){const s=ST();
  const col=[75,220,390,560];const titles=['G1 meiocyte','after S','after Meiosis I','after Meiosis II'];
  const G=col.map(()=>H.g(s));G.forEach((g,i)=>{cap(g,col[i],30,titles[i]);if(i)H.O(g,0,{d:0})});
  miniCell(G[0],75,180,50,[[-21,32,'dad'],[-7,32,'mom'],[7,20,'dad'],[21,20,'mom']]);
  const c2=H.g(G[1]);H.E('circle',{cx:220,cy:180,r:55,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},c2);
  [[-30,'dad',1],[-10,'mom',1],[10,'dad',0],[30,'mom',0]].forEach(([dx,c,l])=>H.chromosome(c2,{L1:l?16:10,L2:l?16:10,w:5,color:c,x:220+dx,y:180}));
  [[130,'dad','mom'],[240,'mom','dad']].forEach(([y,a,b])=>{const g=H.g(G[2]);H.E('circle',{cx:390,cy:y,r:40,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},g);
    H.chromosome(g,{L1:16,L2:16,w:5,color:a,x:380,y});H.chromosome(g,{L1:10,L2:10,w:5,color:b,x:402,y})});
  [[85,'dad','mom'],[150,'dad','mom'],[215,'mom','dad'],[280,'mom','dad']].forEach(([y,a,b],i)=>miniCell(G[3],560,y,26,[[-6,28,a,i===1?{tip:'mom',tipLen:10}:i===2?{tip:'dad',tipLen:10}:undefined],[7,16,b]]));
  const ar=[arr(s,130,180,160,180),arr(s,281,180,343,180),arr(s,436,180,526,180)];
  const al=[['S',145],['Meiosis I',312],['Meiosis II',481]].map(([t,x])=>{const e=H.txt(s,x,166,t,'lbs',{'text-anchor':'middle'});H.O(e,0,{d:0});return e});
  const V=[[2,2,'46 chromosomes'],[4,2,'46 chromosomes'],[2,1,'23 per cell'],[1,1,'23 per cell']];
  const cn=col.map((x,i)=>{const c=H.txt(s,x,350,'','lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:22px'});
    const n=H.txt(s,x,376,'','lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:22px'});const h=H.txt(s,x,400,V[i][2],'lbs',{'text-anchor':'middle'});
    if(i)H.O([c,n,h],0,{d:0});return {c,n,h}});
  const fc=v=>Math.round(v)+'c',fn=v=>Math.round(v)+'n';
  const show=(i,from)=>{H.O(G[i],1,{d:600});const q=cn[i];H.O([q.c,q.n,q.h],1);H.count(q.c,from[0],V[i][0],{fmt:fc,d:1000,at:300});H.count(q.n,from[1],V[i][1],{fmt:fn,d:1000,at:300})};
  return [
    ()=>{cn[0].c.textContent='2c';cn[0].n.textContent='2n'},
    ()=>{showArr(ar[0]);H.O(al[0],1);show(1,[2,2])},
    ()=>{showArr(ar[1]);H.O(al[1],1);show(2,[4,2])},
    ()=>{showArr(ar[2]);H.O(al[2],1);show(3,[2,1])},
  ];}},

/* 10 ─────────────────────────────── */
{sec:'1.3',title:'From Meiosis to Gametes',caption:'polar body formation during gamete maturation',
text:`<p data-step="0">In animals and plants, the cells from meiosis must mature before they function as gametes.</p>
<p data-step="1">In male animals, Meiosis I makes two cells of equal size. In female animals, the division is unequal. One cell keeps almost all of the cytoplasm, and the other cell is small.</p>
<p data-step="2">In male animals, the four cells from meiosis are <b>spermatids</b>. In female animals, the large cell becomes the egg. The three small cells are <b>polar bodies</b>.</p>
<p data-step="3">Each spermatid grows new structures, such as a tail, and becomes a functional sperm cell. Only one cell from each meiosis becomes an egg, so the egg keeps the maximum amount of nutrients. The polar bodies do not become gametes, and they disappear.</p>
<p data-step="3">In plants, each cell from meiosis divides a few times by mitosis. The new cells then develop into male or female gametes.</p>`,
star:'Spermatocyte → 4 sperm. Oocyte → 1 egg + 3 polar bodies.',starStep:3,
scene(H){const s=ST();const ym=110,yf=310;
  cap(s,18,24,'Sperm · male animals','start');cap(s,18,232,'Egg · female animals','start');
  const M0=miniCell(s,70,ym,30);
  const M1=[85,137].map(y=>{const c=miniCell(s,210,y,22);hide(c);return c});
  const M2=[62,94,126,158].map(y=>{const c=miniCell(s,360,y,13);hide(c);return c});
  const M3=[62,94,126,158].map(y=>{const G=H.g(s);H.E('ellipse',{cx:500,cy:y,rx:11,ry:7,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},G);
    H.E('path',{d:`M511,${y} q10,-7 20,0 t20,0 t20,0 t20,0`,pathLength:1,cls:'draw k',st:'stroke-width:2'},G);H.O(G,0,{d:0});return G});
  const F0=miniCell(s,70,yf,44,[],{fill:'mom-tint'});
  const F1=miniCell(s,210,yf,42,[],{fill:'mom-tint'}),P1=miniCell(s,252,yf-52,9);[F1,P1].forEach(hide);
  const F2=miniCell(s,360,yf,42,[],{fill:'mom-tint'}),P2=[[404,252],[420,272],[388,240]].map(([x,y])=>{const c=miniCell(s,x,y,8);hide(c);return c});hide(F2);
  const F3=miniCell(s,530,yf,48,[],{fill:'mom-tint'});hide(F3);
  const A=[arr(s,104,ym,182,ym),arr(s,236,ym,340,ym),arr(s,378,ym,482,ym),arr(s,118,yf,164,yf),arr(s,256,yf,314,yf),arr(s,406,yf,476,yf)];
  const lb=(x,y,t)=>{const e=H.txt(s,x,y,t,'lbs',{'text-anchor':'middle'});H.O(e,0,{d:0});return e};
  const LM=[lb(70,186,'primary'),lb(70,200,'spermatocyte'),lb(210,186,'2 secondary'),lb(210,200,'spermatocytes'),lb(360,186,'4 spermatids'),lb(545,186,'4 sperm')];
  const LF=[lb(70,378,'primary oocyte'),lb(210,378,'secondary oocyte'),lb(210,394,'+ 1 polar body'),lb(360,378,'egg cell'),lb(360,394,'+ 3 polar bodies'),lb(530,378,'mature egg')];
  return [
    ()=>{H.O([LM[0],LM[1],LF[0]],1)},
    ()=>{showArr(A[0]);showArr(A[3]);M1.forEach((c,i)=>pop(c,{at:400+i*120}));pop(F1,{at:400});pop(P1,{at:700});H.O([LM[2],LM[3],LF[1],LF[2]],1,{at:600})},
    ()=>{showArr(A[1]);showArr(A[4]);M2.forEach((c,i)=>pop(c,{at:400+i*100}));pop(F2,{at:400});P2.forEach((c,i)=>pop(c,{at:700+i*120}));H.O([LM[4],LF[3],LF[4]],1,{at:600})},
    ()=>{showArr(A[2]);showArr(A[5]);M3.forEach((g,i)=>{H.O(g,1,{at:300+i*100});H.D(g.lastChild,1,{at:500+i*100})});pop(F3,{at:400});H.O(P2,.25,{d:900,at:900});H.O(P1,.25,{d:900,at:900});H.O([LM[5],LF[5]],1,{at:600})},
  ];}},

/* 11 ─────────────────────────────── */
{sec:'3.6',title:'Mitosis vs Meiosis',caption:'Human cells, 2n = 46 · model cells show 2n = 4',
text:`<div class="tblwrap"><table class="tbl"><thead><tr><th></th><th>Mitosis</th><th>Meiosis</th></tr></thead><tbody>
<tr data-step="0"><td>Makes</td><td>all body cells except sex cells</td><td>sex cells only (eggs, sperm)</td></tr>
<tr data-step="0"><td>Purpose</td><td>growth, repair, replace dead cells</td><td>sexual reproduction, variation</td></tr>
<tr data-step="0"><td>Reproduction</td><td>asexual</td><td>sexual</td></tr>
<tr data-step="1"><td>DNA copied</td><td>once</td><td>once (not before Meiosis II)</td></tr>
<tr data-step="1"><td>Divisions</td><td>1</td><td>2</td></tr>
<tr data-step="1"><td>Homologs pair</td><td>no</td><td>yes, in Prophase I</td></tr>
<tr data-step="1"><td>Crossing over</td><td>no</td><td>yes, in Prophase I</td></tr>
<tr data-step="1"><td>Metaphase</td><td>single file</td><td>pairs (I), then single file (II)</td></tr>
<tr data-step="2"><td>What splits</td><td>sister chromatids</td><td>homologs (I), then sisters (II)</td></tr>
<tr data-step="2"><td>Cytokinesis</td><td>after telophase</td><td>after Telophase I and Telophase II</td></tr>
<tr data-step="2"><td>Cells made</td><td>2</td><td>4</td></tr>
<tr data-step="3"><td>Chromosomes</td><td>2n → 2n (46 → 46)</td><td>2n → n (46 → 23)</td></tr>
<tr data-step="3"><td>Daughter cells</td><td>identical to the parent</td><td>all different, half the chromosomes</td></tr>
</tbody></table></div>`,
star:'miTosis = my Toes (body cells). meiOsis = makes Ova (egg cells) and sperm.',starStep:3,
scene(H){const s=ST();const P=[[-21,40,'dad'],[-7,40,'mom'],[7,24,'dad'],[21,24,'mom']];
  cap(s,160,30,'Mitosis');cap(s,480,30,'Meiosis');
  H.E('line',{x1:320,y1:20,x2:320,y2:400,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  miniCell(s,160,95,46,P);miniCell(s,480,95,46,P);
  const aA=[arr(s,148,146,110,196),arr(s,172,146,210,196)];
  const dA=[100,220].map(x=>{const c=miniCell(s,x,245,46,P);hide(c);return c});
  const aB=[arr(s,468,146,438,180),arr(s,492,146,522,180)];
  const dB=[[420,'dad','mom'],[540,'mom','dad']].map(([x,a,b])=>{const g=H.g(s);H.E('circle',{r:36,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},g);
    H.chromosome(g,{L1:15,L2:15,w:5,color:a,x:-9,y:0});H.chromosome(g,{L1:9,L2:9,w:5,color:b,x:11,y:0});H.T(g,{x,y:218},{d:0});hide(g);return g});
  const g4=[[[-6,28,'dad'],[7,16,'mom']],[[-6,28,'dad',{tip:'mom',tipLen:10}],[7,16,'mom']],[[-6,28,'mom',{tip:'dad',tipLen:10}],[7,16,'dad']],[[-6,28,'mom'],[7,16,'dad']]];
  const aC=[arr(s,410,256,394,290),arr(s,430,256,446,290),arr(s,530,256,514,290),arr(s,550,256,566,290)];
  const dC=[390,450,510,570].map((x,i)=>{const c=miniCell(s,x,320,25,g4[i]);hide(c);return c});
  const lA=H.txt(s,160,325,'1 division','lb',{'text-anchor':'middle'}),lA2=H.txt(s,160,345,'2 cells · 2n · identical','lbs',{'text-anchor':'middle'});
  const lB=H.txt(s,480,375,'2 divisions','lb',{'text-anchor':'middle'}),lB2=H.txt(s,480,395,'4 cells · n · all different','lbs',{'text-anchor':'middle'});
  H.O([lA,lA2,lB,lB2],0,{d:0});
  return [
    ()=>{},
    ()=>{aA.forEach(a=>showArr(a));dA.forEach((c,i)=>pop(c,{at:400+i*150}));aB.forEach(a=>showArr(a));dB.forEach((c,i)=>pop(c,{at:400+i*150}))},
    ()=>{aC.forEach(a=>showArr(a));dC.forEach((c,i)=>pop(c,{at:400+i*120}))},
    ()=>{H.O([lA,lA2,lB,lB2],1)},
  ];}},

/* 12 ─────────────────────────────── */
{sec:'1.3',title:'When Meiosis Goes Wrong',caption:'Nondisjunction in Meiosis I · chromosome 21 shown',
text:`<p data-step="0">Meiosis explains Mendel’s laws. <b>Segregation</b> occurs in Anaphase I, when the homologs separate. <b>Independent assortment</b> occurs in Metaphase I, when each pair aligns in a random direction.</p>
<p data-step="0">Crossing over and independent assortment make each gamete different. In random fertilization, any sperm cell can fuse with any egg cell. So all three events make each child different.</p>
<p data-step="1">Sometimes the two homologs of a pair do not separate. Both homologs move to the same pole. The failure to separate is <b>nondisjunction</b>.</p>
<p data-step="2">As a result, one cell from Meiosis I has an extra copy of that chromosome (n + 1). The other cell has no copy of that chromosome (n − 1). After Meiosis II, two gametes are n + 1 and two gametes are n − 1.</p>
<p data-step="3">Suppose that an n + 1 gamete fuses with a normal gamete. The <b>zygote</b> (the first cell of the child) then has three copies of that chromosome. Three copies of chromosome 21 cause <b>Down syndrome</b>.</p>`,
star:'NON-disjunction = the pair does NOT separate.',starStep:3,
scene(H){const s=ST();const cy=175,PL=[100,cy],PR=[280,cy];
  const C=H.cell(s,{x:190,y:cy,r:115});const ps=poles(s,[PL[0],PR[0]],cy);const fb=H.g(s);
  const plate=H.E('line',{x1:190,y1:cy-90,x2:190,y2:cy+90,st:'stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 5'},s);
  const Z=H.g(s);H.E('circle',{cx:500,cy:cy,r:72,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},Z);H.txt(Z,500,cy+100,'zygote','lbs',{'text-anchor':'middle'});H.O(Z,0,{d:0});
  const b=chrom(s,172,cy,'dad',0),o=chrom(s,208,cy,'mom',0);
  const fB=[H.fibre(fb,PL,[164,cy-4]),H.fibre(fb,PL,[164,cy+4])],fO=[H.fibre(fb,PR,[216,cy-4]),H.fibre(fb,PR,[216,cy+4])];
  const t1=H.txt(s,120,282,'n + 1','lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:20px'}),t2=H.txt(s,262,282,'n − 1','lb',{'text-anchor':'middle',st:'font-family:var(--f-math);font-style:italic;font-size:20px'});H.O([t1,t2],0,{d:0});
  const err=H.txt(s,190,40,'both homologs go to one pole','lb',{'text-anchor':'middle',st:'fill:var(--bad)'});H.O(err,0,{d:0});
  const sp=H.g(s);H.E('ellipse',{cx:0,cy:0,rx:16,ry:11,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},sp);
  H.E('path',{d:'M16,0 q10,-7 20,0 t20,0 t20,0',cls:'k',st:'stroke-width:2'},sp);H.E('line',{x1:0,y1:-6,x2:0,y2:6,st:'stroke:var(--muted);stroke-width:4;stroke-linecap:round'},sp);
  H.T(sp,{x:590,y:60},{d:0});H.O(sp,0,{d:0});
  const k=H.chromosome(s,{L1:16,L2:16,w:7,color:'muted',state:'single',x:528,y:cy});H.O(k,0,{d:0});
  const tri=H.txt(s,500,cy+122,'3 copies of chromosome 21','lb',{'text-anchor':'middle'});const tri2=H.txt(s,500,cy+142,'Down syndrome','lbs',{'text-anchor':'middle'});H.O([tri,tri2],0,{d:0});
  const legend=H.txt(s,590,380,'grey = from the sperm','lbs',{'text-anchor':'end'});H.O(legend,0,{d:0});
  return [
    ()=>{},
    ()=>{const o2={d:1400};H.O(fO,0,{d:400});H.O(plate,.3,o2);H.O(err,1);H.T(b,{x:128,y:cy-24},o2);H.T(o,{x:128,y:cy+24},o2);
      H.fibreTo(fB[0],[120,cy-24],o2);H.fibreTo(fB[1],[120,cy+24],o2)},
    ()=>{H.O(fB,0,{d:400});H.O(ps,0,{d:400});H.cleave(C,72,.56,{d:1500});H.T(b,{x:112},{d:1200});H.T(o,{x:132},{d:1200});H.O(err,0);H.O([t1,t2],1,{at:1200})},
    ()=>{H.O(Z,1,{d:500});H.O(sp,1,{d:300});H.T(sp,{x:548,y:130},{d:1200});H.after(1000,()=>{H.O(sp,0,{d:400});H.O(k,1,{d:400})});
      H.setChr(b,'single',{d:900,at:300});H.setChr(o,'single',{d:900,at:300});H.T(b,{x:472,y:cy},{d:1400,at:300});H.T(o,{x:500,y:cy},{d:1400,at:300});H.O([tri,tri2,legend],1,{at:1600})},
  ];}},

/* 13 ─────────────────────────────── */
{sec:'1.8',title:'Key Terms',wide:true,steps:1,
text:`<h3>Cell types in meiosis</h3><div class="terms">
<div class="term"><b>gamete</b>A sex cell: a sperm cell or an egg cell. A gamete is haploid.</div>
<div class="term"><b>meiocyte</b>A diploid cell that will divide by meiosis.</div>
<div class="term"><b>oocyte · spermatocyte</b>A cell before meiosis that will become an egg cell · a sperm cell.</div>
<div class="term"><b>spermatid</b>One of the four male cells from meiosis. A spermatid grows a tail and becomes a sperm cell.</div>
<div class="term"><b>polar body</b>One of the three small cells from female meiosis. Polar bodies do not become eggs.</div>
<div class="term"><b>diploid (2n) · haploid (1n)</b>A cell with two sets of chromosomes · a cell with one set of chromosomes.</div></div>
<h3>Chromosome pairs and crossing over</h3><div class="terms">
<div class="term"><b>homologs</b>Homologous chromosomes: a pair of chromosomes, one from each parent, with the same genes in the same order. Their alleles can differ.</div>
<div class="term"><b>sister chromatids</b>The two identical copies in a replicated chromosome, joined at the centromere. At first, sister chromatids carry the same alleles.</div>
<div class="term"><b>allele · locus</b>A version of a gene · the location of a gene on a chromosome. A diploid cell has a maximum of two alleles at one locus.</div>
<div class="term"><b>synapsis · synapse</b>The close attachment of homologs along their full length in Prophase I. Synapsis occurs in meiosis only, never in mitosis.</div>
<div class="term"><b>synaptonemal complex</b>The protein ladder that holds synapsed homologs together. The proteins detach at Anaphase I.</div>
<div class="term"><b>bivalent (tetrad)</b>Two synapsed homologs. A bivalent has four chromatids.</div>
<div class="term"><b>crossing over</b>Two non-sister chromatids break at the same location and exchange segments. Crossing over makes new allele combinations.</div>
<div class="term"><b>chiasma (plural chiasmata)</b>A point where two non-sister chromatids cross after crossing over. Chiasmata hold the homologs together in Meiosis I.</div>
<div class="term"><b>recombination</b>A change in the allele combinations on a chromosome. Recombinant chromatids carry the new combinations.</div>
<div class="term"><b>nondisjunction</b>Homologs or sister chromatids fail to separate. Some gametes then get an extra chromosome, and other gametes get none.</div></div>
<h3>The five Prophase I substages</h3><div class="terms">
<div class="term"><b>leptotene</b>The replicated chromosomes condense into thin threads.</div>
<div class="term"><b>zygotene</b>Homologs pair, and the synaptonemal complex forms.</div>
<div class="term"><b>pachytene</b>Synapsis is complete, and crossing over occurs.</div>
<div class="term"><b>diplotene</b>The synaptonemal complex disappears, and the chiasmata become visible.</div>
<div class="term"><b>diakinesis</b>The chromatids thicken, the nuclear envelope dissolves and spindle fibres form.</div></div>
<h3>Divisions, stages and Mendel’s laws</h3><div class="terms">
<div class="term"><b>Meiosis I · reductional division</b>The homologs separate, and each cell goes from 2n to 1n.</div>
<div class="term"><b>Meiosis II · equational division</b>The sister chromatids separate, and each cell stays at 1n.</div>
<div class="term"><b>Metaphase I · Metaphase II</b>Pairs align in double file · single chromosomes align in single file.</div>
<div class="term"><b>Anaphase I · Anaphase II</b>Homologs move to opposite poles · centromeres divide and sister chromatids move to opposite poles.</div>
<div class="term"><b>Telophase I · Telophase II</b>Nuclear envelopes form again, and cytokinesis makes 2 cells · 4 cells.</div>
<div class="term"><b>Prophase II</b>The chromosomes condense, the centrioles move to the poles and the nuclear envelope dissolves.</div>
<div class="term"><b>interkinesis</b>The short stage between Meiosis I and Meiosis II. Interkinesis has no S phase, so the DNA is not copied again.</div>
<div class="term"><b>Law of Equal Segregation</b>Mendel’s first law: the two alleles of a gene go into different gametes in equal numbers.</div>
<div class="term"><b>Law of Independent Assortment</b>Mendel’s second law: genes on different chromosomes go into gametes independently.</div></div>`},

/* 14 ─────────────────────────────── */
{sec:'1.9',title:'Check Your Understanding',wide:true,steps:1,
text:`<div class="grid2">
<div class="qa"><div class="q">1. Does equal segregation of alleles into daughter cells occur in mitosis, in meiosis, or in both?</div><button>Show answer</button><div class="a" hidden>Only in meiosis. Mitosis makes daughter cells that are genetically equal, but it does not separate alleles. Each daughter cell of mitosis keeps both alleles of the parent cell. In meiosis, Anaphase I sends the two alleles of a gene to different cells.</div></div>
<div class="qa"><div class="q">2. A diploid individual makes gametes. How many alleles of one autosomal gene (a gene on a chromosome that is not a sex chromosome) can a gamete carry? The individual? The whole population of the species?</div><button>Show answer</button><div class="a" hidden>A gamete carries one allele, because it has one set of chromosomes. The diploid individual has a maximum of two alleles at one locus. A population can have many alleles. The size of the population sets the limit.</div></div>
<div class="qa"><div class="q">3. A human meiocyte is in Metaphase I. How many chromosomes, chromatids and bivalents does it have?</div><button>Show answer</button><div class="a" hidden>46 chromosomes, because there are 46 centromeres. 92 chromatids, because each chromosome has two chromatids after S phase. 23 bivalents, because the 46 chromosomes are in 23 pairs.</div></div>
<div class="qa"><div class="q">4. Which division of meiosis is reductional and which is equational? Give the reason.</div><button>Show answer</button><div class="a" hidden>Meiosis I is reductional, because homologs separate and the cells go from 2n to 1n. Meiosis II is equational, because sister chromatids separate and the cells stay 1n.</div></div>
<div class="qa"><div class="q">5. A cell has 2n = 4 (two pairs). Without crossing over, how many types of gamete can independent assortment make?</div><button>Show answer</button><div class="a" hidden>2<sup>2</sup> = 4 types. Each pair can face two ways in Metaphase I, and the two pairs are independent.</div></div>
<div class="qa"><div class="q">6. Sister chromatids carry the same alleles at first. How can two sister chromatids carry different alleles at the end of Prophase I?</div><button>Show answer</button><div class="a" hidden>Crossing over. One sister chromatid exchanges a segment with a non-sister chromatid from the homolog. The exchanged segment can carry a different allele.</div></div>
</div>`},

]});
})();
