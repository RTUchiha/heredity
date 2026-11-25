/* Chapter 11 · Recombination Mapping of Gene Loci — source: Hairdity.pdf ch.11 (Singh, Introduction to Genetics, CC BY-NC-SA 4.0) */
(function(){
const H=window.HL;
const ST=()=>document.getElementById('stage');
/* ---- deck-local helpers ---- */
function drawA(a,o){H.D(a.firstChild,1,Object.assign({d:600},o));H.O(a.lastChild,1,Object.assign({d:200},o,{at:((o&&o.at)||0)+450}));}
function mkA(p,x1,y1,x2,y2,o){const a=H.arrow(p,x1,y1,x2,y2,o);H.O(a.lastChild,0,{d:0});return a;}
function pop(e,o){H.T(e,{s:1},Object.assign({d:700},o));H.O(e,1,Object.assign({d:300},o));}
function hide(e){H.T(e,{s:.001},{d:0});H.O(e,0,{d:0});return e;}
function fade(e){H.O(e,0,{d:0});return e;}
const MID={'text-anchor':'middle'},END={'text-anchor':'end'};
const mid=o=>Object.assign({'text-anchor':'middle'},o||{});
/* allele tag: small card with a letter, outlined in the colour of its chromosome */
function tg(p,x,y,t,o){o=o||{};const G=H.g(p);const r=o.r||9;
  G.box=H.E('rect',{x:x-r,y:y-r,width:2*r,height:2*r,rx:r*.45,cls:'card',st:`stroke:${H.C(o.c||'ink')};stroke-width:1.8`},G);
  G.t=H.txt(G,x,y+r*.47,t,'lb',mid({st:`font-size:${o.fs||Math.round(r*1.4)}px`}));return G;}
/* chromosome piece: horizontal segment x0..x1 drawn at local y=0 and moved by T; carries its allele tags */
function piece(p,x0,x1,color,tags,o){o=o||{};const G=H.g(p);
  G.ln=H.E('path',{d:`M${x0},0 L${x1},0`,pathLength:1,cls:o.draw?'draw':null,st:`fill:none;stroke:${H.C(color)};stroke-width:${o.w||8};stroke-linecap:round`},G);
  G.tags=(tags||[]).map(([x,t])=>tg(G,x,0,t,{r:o.r||9,c:color}));
  H.T(G,{x:0,y:o.y||0},{d:0});G.y0=o.y||0;return G;}
/* strand = pieces split at the crossover points */
function strand(p,y,color,x0,x1,cuts,tags,o){const xs=[x0,...cuts,x1];const P=[];
  for(let i=0;i<xs.length-1;i++)P.push(piece(p,xs[i],xs[i+1],color,tags.filter(([x])=>x>=xs[i]&&x<xs[i+1]),Object.assign({},o,{y})));
  return P;}
function spark(p,x,y,r){const G=H.g(p);[0,45,90,135].forEach(a=>{const q=a*Math.PI/180;
  H.E('line',{x1:x-r*Math.cos(q),y1:y-r*Math.sin(q),x2:x+r*Math.cos(q),y2:y+r*Math.sin(q),st:'stroke:var(--hi);stroke-width:3;stroke-linecap:round'},G)});return G;}
function xmark(p,x,y,r,c){const G=H.g(p);H.E('path',{d:`M${x-r},${y-r} L${x+r},${y+r} M${x+r},${y-r} L${x-r},${y+r}`,st:`fill:none;stroke:${H.C(c||'ink')};stroke-width:2.6;stroke-linecap:round`},G);return G;}
/* horizontal bar that grows from x: T(G,{sx:len}) */
function hbar(p,x,y,h,color){const G=H.g(p);G.r=H.E('rect',{x:0,y:-h/2,width:1,height:h,st:`fill:${H.C(color)}`},G);H.T(G,{x,y,sx:.001},{d:0});return G;}
/* vertical bar that grows up from baseline y: T(G,{sy:len}) */
function vbar(p,x,y,w,color){const G=H.g(p);G.r=H.E('rect',{x:-w/2,y:-1,width:w,height:1,st:`fill:${H.C(color)}`},G);H.T(G,{x,y,sy:.001},{d:0});return G;}
/* bracket under/over an interval with a label */
function brace(p,x0,x1,y,t,o){o=o||{};const G=H.g(p);const k=o.up?-7:7;
  H.E('path',{d:`M${x0},${y-k} L${x0},${y} L${x1},${y} L${x1},${y-k}`,st:`fill:none;stroke:${H.C(o.c||'ink')};stroke-width:1.8`},G);
  G.t=H.txt(G,(x0+x1)/2,y+(o.up?-8:18),t,o.cls||'lb',mid(o.st?{st:o.st}:null));return G;}
/* ruler (genetic map): genes [[cM,label]] at x0 + cM*k */
function ruler(p,x0,y,k,genes,o){o=o||{};const G=H.g(p);const xs=genes.map(([v])=>x0+v*k);
  G.ln=H.E('path',{d:`M${xs[0]},${y} L${xs[xs.length-1]},${y}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:3;stroke-linecap:round'},G);
  G.ticks=genes.map(([v,l],i)=>{const t=H.g(G);H.E('line',{x1:xs[i],y1:y-9,x2:xs[i],y2:y+9,st:'stroke:var(--ink);stroke-width:3'},t);
    H.txt(t,xs[i],y-16,l,'lb',mid({st:'font-size:16px'}));if(!o.noNum)H.txt(t,xs[i],y+26,(o.fmt||(v=>v))(v),'lbs',MID);H.O(t,0,{d:0});return t});
  G.segs=o.segs?genes.slice(1).map(([v],i)=>{const a=xs[i],b=xs[i+1];const t=H.txt(G,(a+b)/2,y-(o.segUp?16:-22),(o.segFmt||(d=>d+' cM'))(+(v-genes[i][0]).toFixed(1)),'lb',mid({st:'fill:var(--dad)'}));H.O(t,0,{d:0});return t}):[];
  G.show=(d)=>{H.D(G.ln,1,{d:d||900});G.ticks.forEach((t,i)=>H.O(t,1,{at:(d||900)*i/G.ticks.length}));G.segs.forEach((t,i)=>H.O(t,1,{at:(d||900)+i*150}))};
  G.xs=xs;return G;}
/* mouse glyph (fur colours are the real animal colours) */
function mouse(p,x,y,o){const G=H.g(p);const fur=o.fur==='brown'?'#8b5e3c':'#f5efe4';
  H.E('path',{d:o.tail==='long'?'M-20,3 C-38,6 -44,-16 -66,-12':'M-20,3 C-25,5 -28,3 -31,1',st:'fill:none;stroke:var(--ink);stroke-width:2.2;stroke-linecap:round'},G);
  [-10,8].forEach(fx=>H.E('line',{x1:fx,y1:10,x2:fx+3,y2:16,st:'stroke:var(--ink);stroke-width:2;stroke-linecap:round'},G));
  H.E('ellipse',{cx:0,cy:0,rx:22,ry:13,st:`fill:${fur};stroke:var(--ink);stroke-width:2`},G);
  H.E('circle',{cx:17,cy:-12,r:5.5,st:`fill:${fur};stroke:var(--ink);stroke-width:1.8`},G);
  H.E('path',{d:'M14,-8 C22,-12 30,-8 33,-2 C30,3 22,5 15,4 Z',st:`fill:${fur};stroke:var(--ink);stroke-width:2;stroke-linejoin:round`},G);
  H.E('circle',{cx:24,cy:-4,r:1.7,st:'fill:#16181d'},G);H.E('circle',{cx:33,cy:-2,r:1.6,st:'fill:var(--bad)'},G);
  const L=o.wh==='long'?17:6;[-7,-1,5].forEach(dy=>H.E('line',{x1:31,y1:0,x2:31+L,y2:dy,st:'stroke:var(--ink);stroke-width:1.2'},G));
  H.T(G,{x,y,s:o.s||1},{d:0});return G;}

deck({
docTitle:'Recombination Mapping · Heredity Ch.11',
title:'Recombination Mapping of Gene Loci',
chapter:11,
eyebrow:'Heredity · Chapter 11 · Recombination Mapping',
slides:[

/* 1 ─────────────────────────────── */
{sec:'11.1',title:'Recombination Mapping',caption:'blue = homolog from dad, orange = homolog from mom · ✕ = one crossover',
text:`<p data-step="0">A chromosome is one long DNA molecule. Each gene has a fixed place on it, the gene’s <b>locus</b> (plural <b>loci</b>). So the genes of a chromosome sit in a fixed order.</p>
<p data-step="1">In meiosis, the two homologs of a pair exchange segments. The exchange is <b>crossing over</b>. The crossover site changes from one meiosis to the next.</p>
<p data-step="2">A crossover falls between two genes far apart more often than between two genes close together. Each crossover between two genes makes offspring with new allele combinations.</p>
<p data-step="3">Geneticists count those offspring and convert the percentages to distances. The result is a <b>genetic map</b>: the order of the genes on a chromosome and the distances between them. Other names are <b>linkage map</b> and <b>recombination map</b>.</p>`,
star:'Far apart → more crossovers between → more new combinations → longer map distance.',starStep:3,
scene(H){const s=ST();
  const top=piece(s,90,590,'dad',[[150,'A'],[310,'B'],[550,'C']],{y:96,draw:1,r:10});
  const bot=piece(s,90,590,'mom',[[150,'a'],[310,'b'],[550,'c']],{y:128,draw:1,r:10});
  const tags=[...top.tags,...bot.tags];tags.forEach(fade);
  const lab=H.txt(s,90,60,'ONE PAIR OF HOMOLOGS','cap');fade(lab);
  const strip=H.g(s);const pos=[420,120,260,570,360,110,500,200,575,100];
  const rows=pos.map((x,i)=>{const G=H.g(strip);const y=184+i*11.5;H.E('line',{x1:90,y1:y,x2:590,y2:y,st:'stroke:var(--faint);stroke-width:2'},G);
    G.x=xmark(G,x,y,4.5,'ink');G.inAB=x>150&&x<310;G.inBC=x>310&&x<550;fade(G);return G});
  const sl=H.txt(strip,90,172,'10 MEIOSES · ONE CROSSOVER EACH','cap');fade(sl);
  const bAB=H.E('rect',{x:150,y:176,width:160,height:122,st:'fill:var(--hi);opacity:0'},s),bBC=H.E('rect',{x:310,y:176,width:240,height:122,st:'fill:var(--good);opacity:0'},s);
  s.insertBefore(bAB,strip);s.insertBefore(bBC,strip);
  const cAB=H.txt(s,230,318,'2 crossovers','lb',MID),cBC=H.txt(s,430,318,'3 crossovers','lb',MID);fade(cAB);fade(cBC);
  const R=ruler(s,150,372,16,[[0,'A'],[10,'B'],[25,'C']],{segs:1,segUp:0,segFmt:d=>'RF '+d+'%',noNum:1});
  const rl=H.txt(s,90,328,'GENETIC MAP','cap');fade(rl);
  return [
    ()=>{H.O(lab,1);H.D([top.ln,bot.ln],1,{d:1100});tags.forEach((t,i)=>H.O(t,1,{at:500+i*90}))},
    ()=>{H.O(sl,1);rows.forEach((r,i)=>{H.O(r,1,{d:250,at:i*170});H.T(r.x,{s:1},{d:0})})},
    ()=>{bAB.style.opacity=.28;bBC.style.opacity=.2;H.O([cAB,cBC],1,{at:300});rows.forEach(r=>{if(r.inAB||r.inBC)H.K(r.x.firstChild,{stroke:r.inAB?'ink':'good'})})},
    ()=>{H.O(strip,.18);bAB.style.opacity=.1;bBC.style.opacity=.08;H.O([cAB,cBC],0,{d:300});H.O(rl,1);R.show(1000)},
  ];}},

/* 2 ─────────────────────────────── */
{sec:'11.1',title:'Parentals and Recombinants',caption:'test cross of a dihybrid in cis · 1000 offspring',
text:`<p data-step="0">A <b>dihybrid</b> is heterozygous at two genes. In this dihybrid, one homolog carries A and B, and the other carries a and b. Two dominant alleles on the same homolog are in <b>cis</b> (coupling). With A and b on one homolog and a and B on the other, the alleles are in <b>trans</b> (repulsion).</p>
<p data-step="1">With no crossover between the genes, a gamete gets the combination of one homolog, AB or ab. Such gametes are <b>parental</b> gametes, or <b>parentals</b>. A crossover between the genes makes the new combinations Ab and aB: <b>recombinant</b> gametes, or <b>recombinants</b>.</p>
<p data-step="2">A <b>test cross</b> crosses the dihybrid with a <b>tester</b>, a homozygous recessive aabb. The tester gives only a and b. So each offspring’s phenotype shows the gamete from the dihybrid.</p>
<p data-step="3">The <b>recombination frequency (RF)</b> is the percentage of recombinant offspring. RF = recombinants ÷ total × 100%.</p>`,
star:'Parental = an old combination. Recombinant = a new combination.',starStep:3,
scene(H){const s=ST();
  H.txt(s,150,34,'DIHYBRID (CIS)','cap',MID);H.txt(s,490,34,'TESTER','cap',MID);
  piece(s,70,230,'dad',[[110,'A'],[190,'B']],{y:60});piece(s,70,230,'mom',[[110,'a'],[190,'b']],{y:88});
  piece(s,410,570,'muted',[[450,'a'],[530,'b']],{y:60});piece(s,410,570,'muted',[[450,'a'],[530,'b']],{y:88});
  H.txt(s,320,80,'×','big',MID);
  const X=[90,240,390,540];const G=[['dad','dad','A','B'],['mom','mom','a','b'],['dad','mom','A','b'],['mom','dad','a','B']];
  const gam=G.map(([c1,c2,l1,l2],i)=>{const g=H.g(s);piece(g,X[i]-50,X[i],c1,[[X[i]-25,l1]],{y:170});piece(g,X[i],X[i]+50,c2,[[X[i]+25,l2]],{y:170});fade(g);return g});
  const gl=H.txt(s,20,150,'GAMETES FROM THE DIHYBRID','cap');fade(gl);
  const kind=['parental','parental','recombinant','recombinant'].map((t,i)=>{const e=H.txt(s,X[i],206,t,'lbs',mid({st:i>1?'fill:var(--ink);font-weight:700':''}));fade(e);return e});
  const tst=X.map(x=>{const g=H.g(s);const p=piece(g,x-50,x+50,'muted',[[x-25,'a'],[x+25,'b']],{y:88});H.T(g,{x:490-x},{d:0});fade(g);g.p=p;return g});
  const ph=[['A','B'],['a','b'],['A','b'],['a','B']].map(([a,b],i)=>{const e=H.txt(s,X[i],285,`shows ${a} and ${b}`,'lb',MID);fade(e);return e});
  const cnt=[430,410,85,75].map((n,i)=>{const e=H.txt(s,X[i],318,'0','big',mid({st:'font-size:24px;font-variant-numeric:tabular-nums'}));fade(e);e.n=n;return e});
  const f=H.txt(s,320,378,'RF = (85 + 75) ÷ 1000 × 100% = 16%','lb',mid({st:'font-size:19px'}));fade(f);
  const ol=H.txt(s,20,262,'OFFSPRING PHENOTYPES','cap');fade(ol);
  return [
    ()=>{},
    ()=>{H.O(gl,1);gam.forEach((g,i)=>H.O(g,1,{at:i*220}));kind.forEach((k,i)=>H.O(k,1,{at:600+i*150}))},
    ()=>{H.O(ol,1);tst.forEach((g,i)=>{H.O(g,1,{d:200,at:i*150});H.T(g,{x:0,y:146},{d:1100,at:i*150})});ph.forEach((e,i)=>H.O(e,1,{at:1200+i*120}))},
    ()=>{cnt.forEach((e,i)=>{H.O(e,1,{at:i*120});H.count(e,0,e.n,{d:900,at:i*120})});H.O(f,1,{at:1000})},
  ];}},

/* 3 ─────────────────────────────── */
{sec:'11.1',title:'Same Chromosome, Linked, or Neither',caption:'bars show the RF between gene A and gene B',
text:`<p data-step="0">Two genes on the same chromosome are <b>syntenic</b>. Two genes on different chromosomes are <b>non-syntenic</b>.</p>
<p data-step="1">Non-syntenic genes show <b>independent assortment</b>. Each pair of homologs aligns in a random direction in meiosis I. So the four gamete types are equally common, and RF = 50%. Such genes are <b>unlinked</b>.</p>
<p data-step="2">Two genes close together on one chromosome are <b>linked</b>. A crossover rarely falls between them, so their parental combinations usually stay together. Linked genes have RF below 50%.</p>
<p data-step="3">Two genes far apart on one chromosome have a crossover between them in almost every meiosis. Their RF is close to 50%. Such genes are syntenic but unlinked.</p>`,
star:'Syntenic = on the same chromosome. Linked = RF below 50%.',starStep:3,
scene(H){const s=ST();const Y=[78,205,332];const gx=405,gw=165;
  const panel=(i,title)=>{const G=H.g(s);H.txt(G,30,Y[i]-44,title,'cap');return G};
  const P1=panel(0,'Different chromosomes');piece(P1,40,230,'dad',[[120,'A']],{y:Y[0]-12});piece(P1,40,230,'mom',[[120,'a']],{y:Y[0]+14});
  piece(P1,260,370,'dad',[[315,'B']],{y:Y[0]-12});piece(P1,260,370,'mom',[[315,'b']],{y:Y[0]+14});
  const P2=panel(1,'Same chromosome, close together');piece(P2,40,370,'dad',[[150,'A'],[200,'B']],{y:Y[1]-12});piece(P2,40,370,'mom',[[150,'a'],[200,'b']],{y:Y[1]+14});
  const P3=panel(2,'Same chromosome, far apart');piece(P3,40,370,'dad',[[60,'A'],[350,'B']],{y:Y[2]-12});piece(P3,40,370,'mom',[[60,'a'],[350,'b']],{y:Y[2]+14});
  const names=[['non-syntenic','unlinked'],['syntenic','linked'],['syntenic','unlinked']];
  const gauges=Y.map((y,i)=>{const G=H.g(s);H.E('rect',{x:gx,y:y-11,width:gw,height:22,rx:4,st:'fill:var(--wash);stroke:var(--faint);stroke-width:1.5'},G);
    const b=hbar(G,gx,y,22,i===1?'dad':'muted');H.txt(G,gx,y+28,'0%','lbs');H.txt(G,gx+gw,y+28,'50%','lbs',END);
    const v=H.txt(G,gx+gw+10,y+5,'','lb');const n1=H.txt(G,gx,y-20,names[i][0],'lbs');const n2=H.txt(G,gx+gw,y-20,names[i][1],'lb',END);fade(n2);fade(G);G.b=b;G.v=v;G.n2=n2;return G});
  const fill=(i,val)=>{const g=gauges[i];H.O(g.n2,1,{at:900});H.T(g.b,{sx:gw*val/50},{d:1100});const p={set textContent(v){g.v.textContent=v}};H.count(p,0,val,{d:1100,fmt:v=>Math.round(v)+'%'})};
  [P1,P2,P3].forEach(fade);
  const ind=H.txt(s,gx,Y[0]+48,'independent assortment','lbs');fade(ind);
  gauges.forEach(g=>{g.v.style.fontSize='15px'});
  return [
    ()=>{H.O(P1,1);H.O(P2,1,{at:300});H.O(gauges[0],1,{at:600});H.O(gauges[1],1,{at:700})},
    ()=>{fill(0,50);H.O(ind,1,{at:900})},
    ()=>{fill(1,8)},
    ()=>{H.O(P3,1);H.O(gauges[2],1,{at:300});H.after(400,()=>fill(2,49))},
  ];}},

/* 4 ─────────────────────────────── */
{sec:'11.2',title:'Where Crossovers Fall',caption:'each grey line is one meiosis · ✕ = where its crossover formed',
text:`<p data-step="0">In prophase I of meiosis, a protein called <b>SPO11</b> cuts the DNA of each chromosome at many places. Repair enzymes then fix each cut, with the homolog as a guide.</p>
<p data-step="1">Only a few of the repairs make crossovers. In most species, each pair of homologs gets at least one crossover, and usually only a few.</p>
<p data-step="2">Each meiosis places its crossovers at different sites. On average, over long stretches of a chromosome, the number of crossovers grows in proportion to the length of DNA.</p>
<p data-step="3">So a crossover falls between genes A and C, far apart, in most meioses. A crossover falls between A and B, close together, in only a few. The chance of recombination between two genes grows with the distance between them.</p>`,
star:'More DNA between two genes = more chances for a crossover.',starStep:3,
scene(H){const s=ST();const x0=60,x1=580;
  const top=piece(s,x0,x1,'dad',[[110,'A'],[180,'B'],[520,'C']],{y:52});const bot=piece(s,x0,x1,'mom',[[110,'a'],[180,'b'],[520,'c']],{y:80});
  const cuts=[90,140,205,240,290,330,370,410,450,490,545,565].map((x,i)=>{const g=H.g(s);H.E('line',{x1:x,y1:60,x2:x,y2:72,st:'stroke:var(--bad);stroke-width:3;stroke-linecap:round'},g);fade(g);return g});
  const cl=H.txt(s,x1,30,'cuts made by SPO11','lbs',mid({'text-anchor':'end',st:'fill:var(--bad);font-weight:700'}));fade(cl);
  const pos=[130,470,260,330,560,410,200,145,390,300,545,240,450,360];
  const band=(a,b,c)=>{const r=H.E('rect',{x:a,y:108,width:b-a,height:220,st:`fill:${H.C(c)};opacity:0`},s);return r};
  const bAC=band(110,520,'good'),bAB=band(110,180,'hi');
  const rows=pos.map((x,i)=>{const G=H.g(s);const y=118+i*15;H.E('line',{x1:x0,y1:y,x2:x1,y2:y,st:'stroke:var(--faint);stroke-width:2'},G);
    xmark(G,x,y,5,'ink');fade(G);return G});
  const c1=H.txt(s,145,350,'A–B: 2 of 14','lb',mid({st:'font-size:15px'})),c2=H.txt(s,400,350,'A–C: 12 of 14','lb',mid({st:'font-size:15px'}));
  const c3=H.txt(s,145,370,'meioses','lbs',MID),c4=H.txt(s,400,370,'meioses','lbs',MID);[c1,c2,c3,c4].forEach(fade);
  return [
    ()=>{cuts.forEach((c,i)=>H.O(c,1,{d:200,at:300+i*90}));H.O(cl,1,{at:300})},
    ()=>{cuts.forEach((c,i)=>H.O(c,i===4?1:0,{d:400,at:i*40}));H.O(cl,0);cuts[4].firstChild.style.stroke='var(--ink)';H.T(cuts[4],{y:0},{d:0})},
    ()=>{H.O(cuts[4],0);rows.forEach((r,i)=>H.O(r,1,{d:250,at:i*140}))},
    ()=>{bAC.style.opacity=.18;bAB.style.transitionDelay='500ms';bAB.style.opacity=.45;H.O([c1,c3],1,{at:600});H.O([c2,c4],1,{at:200})},
  ];}},

/* 5 ─────────────────────────────── */
{sec:'11.2',title:'One Crossover Makes Two Recombinants',caption:'four chromatids of one bivalent · each chromatid enters a different gamete',
text:`<p data-step="0">Before meiosis, the cell copies its DNA. So each homolog has two identical <b>sister chromatids</b>, and a pair of homologs has four chromatids.</p>
<p data-step="1">A crossover joins two <b>non-sister chromatids</b>, one from each homolog. The other two chromatids do not take part.</p>
<p data-step="2">Each chromatid enters a different gamete. So one crossover between A and B makes 2 recombinant gametes and 2 parental gametes.</p>
<p data-step="3">Suppose every meiosis had one crossover between A and B. Then only half of the gametes would be recombinant. Two or more crossovers also give, on average, at most half recombinant gametes. So RF can never be more than 50%. With at most one crossover, RF is half the percentage of meioses with a crossover between the genes. If 20% of meioses have a crossover between A and B, RF = 10%.</p>`,
star:'One crossover → 2 of 4 chromatids recombinant → RF can never pass 50%.',starStep:3,
scene(H){const s=ST();const x0=100,x1=440,cx=270;const Y=[70,94,130,154];
  const col=['dad','dad','mom','mom'],AL=[['A','B'],['A','B'],['a','b'],['a','b']];
  const L=Y.map((y,i)=>piece(s,x0,cx,col[i],[[160,AL[i][0]]],{y}));const R=Y.map((y,i)=>piece(s,cx,x1,col[i],[[380,AL[i][1]]],{y}));
  const sis=H.g(s);[[Y[0],Y[1]],[Y[2],Y[3]]].forEach(([a,b])=>{H.E('path',{d:`M${x0-22},${a-6} L${x0-30},${a-6} L${x0-30},${b+6} L${x0-22},${b+6}`,st:'fill:none;stroke:var(--muted);stroke-width:1.6'},sis)});
  H.txt(sis,x0-36,(Y[0]+Y[1])/2+4,'sisters','lbs',END);H.txt(sis,x0-36,(Y[2]+Y[3])/2+4,'sisters','lbs',END);
  const sp=spark(s,cx,112,11);fade(sp);
  const NY=[218,256,294,332];const lab=[['AB','parental'],['Ab','recombinant'],['aB','recombinant'],['ab','parental']].map(([g,k],i)=>{const G=H.g(s);
    H.txt(G,462,NY[i]+6,g,'lb',{st:'font-size:16px'});H.txt(G,500,NY[i]+6,k,i%3?'lb':'lbs',{st:i%3?'fill:var(--ink)':''});fade(G);return G});
  const big=H.txt(s,300,388,'2 of 4 chromatids recombinant = 50%','lb',mid({st:'font-size:19px'}));fade(big);
  return [
    ()=>{},
    ()=>{H.O(sp,1,{d:200});H.T(R[1],{y:Y[2]},{d:1300,at:300});H.T(R[2],{y:Y[1]},{d:1300,at:300});H.O(sp,0,{d:400,at:1400})},
    ()=>{const o={d:1300};[0,1,2,3].forEach(i=>H.T(L[i],{y:NY[i]},o));H.T(R[0],{y:NY[0]},o);H.T(R[2],{y:NY[1]},o);H.T(R[1],{y:NY[2]},o);H.T(R[3],{y:NY[3]},o);
      H.O(sis,0,{d:400});lab.forEach((g,i)=>H.O(g,1,{at:1100+i*150}))},
    ()=>{H.O(big,1)},
  ];}},

/* 6 ─────────────────────────────── */
{sec:'11.2',title:'The Map Unit',caption:'each dot is one test-cross offspring · yellow = recombinant',
text:`<p data-step="0">Geneticists convert an RF directly to a map distance. One <b>map unit (m.u.)</b> equals 1% recombinant offspring. Another name for the map unit is the <b>centimorgan (cM)</b>.</p>
<p data-step="1">So an RF of 1% (0.01) is a distance of 1&nbsp;cM.</p>
<p data-step="2">An RF of 8% is a distance of 8&nbsp;cM. The British geneticist J.&nbsp;B.&nbsp;S.&nbsp;Haldane named the unit in 1919, in honour of the American geneticist Thomas Hunt Morgan. One morgan is 100&nbsp;cM.</p>
<p data-step="3">A map distance also predicts the offspring. Two genes 7.5&nbsp;cM apart give 7.5% recombinant gametes and 92.5% parental gametes.</p>`,
star:'1 cM = 1% recombinant offspring.',starStep:1,
scene(H){const s=ST();const gx=52,gy=58,sp=21;
  H.txt(s,gx-6,36,'100 TEST-CROSS OFFSPRING','cap');
  const order=[44,7,83,21,66,90,35,58];
  const dots=[];for(let i=0;i<100;i++){const d=H.E('circle',{cx:gx+(i%10)*sp,cy:gy+Math.floor(i/10)*sp,r:7,st:'fill:var(--wash);stroke:var(--muted);stroke-width:1.5'},s);dots.push(d);H.O(d,0,{d:0})}
  const on=(n)=>dots.forEach((d,i)=>{const k=order.indexOf(i);const r=k>=0&&k<n;d.style.fill=r?'var(--hi)':'var(--wash)';d.style.stroke=r?'var(--ink)':'var(--muted)'});
  const rx=330;const t1=H.txt(s,rx,88,'recombinants','lbs'),v1=H.txt(s,rx,122,'','big',{st:'font-variant-numeric:tabular-nums'});
  const t2=H.txt(s,rx,166,'RF','lbs'),v2=H.txt(s,rx,200,'','big'),t3=H.txt(s,rx,244,'map distance','lbs'),v3=H.txt(s,rx,278,'','big',{st:'fill:var(--dad)'});
  const R=[t1,v1,t2,v2,t3,v3];R.forEach(fade);
  const x0=60,k=26,y=362;const ax=H.g(s);H.E('line',{x1:x0,y1:y,x2:x0+20*k,y2:y,st:'stroke:var(--ink);stroke-width:2.5'},ax);
  for(let v=0;v<=20;v++){H.E('line',{x1:x0+v*k,y1:y-(v%5?4:8),x2:x0+v*k,y2:y+(v%5?4:8),st:'stroke:var(--ink);stroke-width:1.5'},ax);if(v%5===0)H.txt(ax,x0+v*k,y+26,v+' cM','lbs',MID)}
  fade(ax);const mk=H.g(s);H.E('path',{d:'M0,-6 L-8,-20 L8,-20 Z',st:'fill:var(--dad)'},mk);H.T(mk,{x:x0,y},{d:0});fade(mk);
  const set=(n,rf)=>{v1.textContent=n+' of 100';v2.textContent=rf+'%';v3.textContent=rf+' cM';H.T(mk,{x:x0+rf*k},{d:900})};
  const pred=H.g(s);H.txt(pred,rx,88,'distance','lbs');H.txt(pred,rx,122,'7.5 cM','big',{st:'fill:var(--dad)'});H.txt(pred,rx,166,'predicts','lbs');
  H.txt(pred,rx,200,'7.5% recombinant','lb',{st:'font-size:18px'});H.txt(pred,rx,226,'92.5% parental','lb',{st:'font-size:18px;fill:var(--muted)'});fade(pred);
  return [
    ()=>{dots.forEach((d,i)=>H.O(d,1,{d:200,at:i*8}));H.O(ax,1,{at:500})},
    ()=>{on(1);R.forEach(e=>H.O(e,1));H.O(mk,1);set(1,1)},
    ()=>{on(8);set(8,8)},
    ()=>{R.forEach(e=>H.O(e,0,{d:300}));H.O(pred,1,{at:300});dots.forEach(d=>H.O(d,.35,{d:400}));H.T(mk,{x:x0+7.5*k},{d:900})},
  ];}},

/* 7 ─────────────────────────────── */
{sec:'11.2',title:'Morgan’s Fly Lab',caption:'Left: Thomas Hunt Morgan, U.S. National Library of Medicine, public domain · Right: Drosophila melanogaster, André Karwath, CC BY-SA 2.5, Wikimedia Commons',
text:`<p data-step="0"><b>Thomas Hunt Morgan</b> (1866–1945) was an American biologist at Columbia University in New York. His group studied the fruit fly <i>Drosophila melanogaster</i>.</p>
<p data-step="1">A fruit fly is about 2.5 mm long. A fly completes one generation in about 10 days, and one female lays hundreds of eggs. So the group counted thousands of offspring in a few weeks.</p>
<p data-step="2">In 1910, Morgan found a male fly with white eyes. He showed that the eye-colour gene is on the X chromosome. Some X genes stayed together in the offspring more often than others. Morgan proposed that genes close together on a chromosome stay together more often.</p>
<p data-step="3">In 1933, Morgan received the Nobel Prize in Physiology or Medicine. The prize was for his discoveries about chromosomes in heredity.</p>`,
star:'Fruit flies: a new generation every 10 days, hundreds of eggs per female.',starStep:1,
scene(H){const s=ST();
  const M=H.g(s);H.E('image',{href:'@@asset:c11-morgan-1891.jpg@@',x:30,y:22,width:186,height:248},M);H.E('rect',{x:30,y:22,width:186,height:248,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},M);
  H.txt(M,123,292,'Thomas Hunt Morgan','lb',MID);fade(M);
  const F=H.g(s);H.E('image',{href:'@@asset:c11-drosophila.jpg@@',x:250,y:22,width:360,height:280},F);H.E('rect',{x:250,y:22,width:360,height:280,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},F);fade(F);
  const sz=H.g(s);H.E('path',{d:'M300,250 L470,250',st:'stroke:#fff;stroke-width:3'},sz);H.E('path',{d:'M300,243 L300,257 M470,243 L470,257',st:'stroke:#fff;stroke-width:3'},sz);
  H.E('rect',{x:338,y:256,width:94,height:24,rx:5,st:'fill:#16181d;opacity:.8'},sz);H.txt(sz,385,273,'≈ 2.5 mm','lb',mid({st:'fill:#fff'}));fade(sz);
  const tl=H.g(s);const y=352,xa=50,xb=600;H.E('line',{x1:xa,y1:y,x2:xb,y2:y,st:'stroke:var(--faint);stroke-width:3'},tl);
  const ev=[[1910,'white-eyed fly'],[1911,'first map'],[1913,'map published'],[1919,'unit named'],[1933,'Nobel Prize']];
  const X=i=>xa+50+i*(xb-xa-100)/4;
  const evs=ev.map(([yr,t],i)=>{const g=H.g(tl);H.E('circle',{cx:X(i),cy:y,r:6,st:'fill:var(--ink)'},g);H.txt(g,X(i),y-14,yr,'lb',MID);H.txt(g,X(i),y+24,t,'lbs',MID);fade(g);return g});
  fade(tl);
  return [
    ()=>{H.O(M,1,{d:800})},
    ()=>{H.O(F,1,{d:800});H.O(sz,1,{at:700})},
    ()=>{H.O(tl,1);H.O(evs[0],1,{at:200});H.O(evs[1],1,{at:600});H.O(evs[2],1,{at:900})},
    ()=>{H.O(evs[3],1);H.O(evs[4],1,{at:400})},
  ];}},

/* 8 ─────────────────────────────── */
{sec:'11.2',title:'The First Genetic Map, 1913',caption:'Top: Sturtevant (1913), Journal of Experimental Zoology, public domain, via Wikimedia Commons · below: redraw at the same scale',
text:`<p data-step="0">In 1911, <b>Alfred Sturtevant</b> (1891–1970) was an undergraduate student in Morgan’s lab. He saw that the RF between two genes measures the distance between them.</p>
<p data-step="1">He worked through most of one night and made the first genetic map. The map placed six genes of the fruit-fly X chromosome in a line. He published it in 1913.</p>
<p data-step="2">Sturtevant used one letter for each gene. His B is today’s yellow body (y), and his C and O are white eyes (w). His P is vermilion eyes (v), R is miniature wings (m) and M is rudimentary wings (r). Later work showed that C and O are one gene, white. Two alleles of it give white eyes and eosin (pale orange) eyes.</p>
<p data-step="3">His total, 57.6, is a sum of short distances: 1.0 + 29.7 + 3.0 + 23.9. Modern maps keep the same order. They place the genes at 0.0, 1.5, 33.0, 36.1 and 54.5&nbsp;cM.</p>`,
star:'Sturtevant, 1913: RF measures distance, and short distances add.',starStep:1,
scene(H){const s=ST();const iw=600,ih=600*67/850,ix=20,iy=40;
  const img=H.g(s);H.E('rect',{x:ix-6,y:iy-8,width:iw+12,height:ih+16,rx:6,st:'fill:#fff;stroke:var(--ink);stroke-width:1.5'},img);
  H.E('image',{href:'@@asset:c11-sturtevant-1913-map.png@@',x:ix,y:iy,width:iw,height:ih},img);H.txt(img,ix-6,iy-16,'THE ORIGINAL FIGURE, 1913','cap');fade(img);
  const px=v=>ix+v*iw/850;const k=9.4,x0=56,y=250;const X=v=>x0+v*k;
  /* [letter, cM, x in the 1913 image, tag offset dx, tag height] */
  const G=[['B',0,14,-13,0],['C',1.0,31,13,0],['O',1.0,31,13,1],['P',30.7,471,-13,0],['R',33.7,489,13,0],['M',57.6,836,0,0]];
  const axis=H.g(s);H.E('path',{d:`M${X(0)},${y} L${X(57.6)},${y}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:3'},axis);
  H.txt(axis,ix-6,128,'REDRAW','cap');
  const tags=G.map(([l,v,ipx,dx,h])=>{const g=H.g(s);const ty=y-34-h*26;
    const lead=H.E('path',{d:`M${X(v)},${y-8} L${X(v)+dx},${y-22}`,st:'fill:none;stroke:var(--muted);stroke-width:1.5'},g);fade(lead);
    const t=tg(g,0,0,l,{r:11,c:'dad'});H.T(t,{x:px(ipx),y:iy+12},{d:0});fade(t);return {t,lead,x:X(v)+dx,ty,h}});
  const nums=[[0,'0.0','end',-4],[1.0,'1.0','start',4],[30.7,'30.7','end',-4],[33.7,'33.7','start',4],[57.6,'57.6','middle',0]].map(([v,t,a,dx])=>{const g=H.g(s);
    H.E('line',{x1:X(v),y1:y-8,x2:X(v),y2:y+8,st:'stroke:var(--ink);stroke-width:2.5'},g);H.txt(g,X(v)+dx,y+24,t,'lbs',{'text-anchor':a});fade(g);return g});
  const modern=[[0,'y','yellow body','start',-6,1],[1.0,'w','white eyes','start',8,0],[30.7,'v','vermilion eyes','end',-6,0],[33.7,'m','miniature wings','start',6,1],[57.6,'r','rudimentary wings','end',8,0]].map(([v,g2,n,anc,dx,row])=>{const g=H.g(s);
    const yy=y+60+row*40;H.E('line',{x1:X(v),y1:y+30,x2:X(v),y2:yy-16,st:'stroke:var(--faint);stroke-width:1.5'},g);
    H.txt(g,X(v)+dx,yy,g2,'lb',{'text-anchor':anc,st:'font-size:17px;font-family:var(--f-math);font-style:italic'});H.txt(g,X(v)+dx,yy+16,n,'lbs',{'text-anchor':anc});fade(g);return g});
  const segs=[[0,1.0,'1.0'],[1.0,30.7,'29.7'],[30.7,33.7,'3.0'],[33.7,57.6,'23.9']].map(([a,b,t],i)=>{const g=brace(s,X(a),X(b),y-96,t,{up:1,c:'dad',st:'fill:var(--dad)'});
    if(i===0){g.t.setAttribute('x',X(0)-4);g.t.setAttribute('text-anchor','start')}if(i===2){g.t.setAttribute('x',X(33.7)+6);g.t.setAttribute('text-anchor','start')}fade(g);return g});
  const sum=H.txt(s,320,404,'1.0 + 29.7 + 3.0 + 23.9 = 57.6 map units','lb',mid({st:'font-size:17px'}));fade(sum);
  return [
    ()=>{H.O(img,1,{d:700})},
    ()=>{H.D(axis.firstChild,1,{d:900});tags.forEach((o,i)=>{H.O(o.t,1,{d:300,at:300+i*200});H.T(o.t,{x:o.x,y:o.ty},{d:1300,at:300+i*200});H.O(o.lead,1,{at:1500})});nums.forEach((n,i)=>H.O(n,1,{at:1400+i*150}))},
    ()=>{modern.forEach((m,i)=>H.O(m,1,{at:i*200}))},
    ()=>{segs.forEach((g,i)=>H.O(g,1,{at:i*250}));H.O(sum,1,{at:1100})},
  ];}},

/* 9 ─────────────────────────────── */
{sec:'11.2',title:'Map Distances Add',caption:'distances in cM · a map has no left or right',
text:`<p data-step="0">Map distances add, approximately. Suppose that genes A and B are 8&nbsp;cM apart.</p>
<p data-step="1">Gene C is 12&nbsp;cM from B. C can be on either side of B. Then the A–⁠C distance is 8 + 12 = 20&nbsp;cM, or 12 − 8 = 4&nbsp;cM.</p>
<p data-step="2">A cross of A and C gives RF = 20%. So C lies beyond B, and B is the middle gene. The largest distance always connects the two outer genes.</p>
<p data-step="3">The sum works well for short distances, with RF below about 30%. A map has no direction, so A–⁠B–⁠C and C–⁠B–⁠A are the same map. The map also does not show where the centromere or the chromosome ends (<b>telomeres</b>) are.</p>`,
star:'The largest distance spans the two outer genes.',starStep:2,
scene(H){const s=ST();const y=170,k=18,xA=170;const X=v=>xA+v*k;
  const ln=H.E('line',{x1:40,y1:y,x2:600,y2:y,st:'stroke:var(--faint);stroke-width:2'},s);
  const gene=(x,l,c)=>{const g=tg(s,0,0,l,{r:13,c:c||'ink'});H.T(g,{x,y},{d:0});g.x0=x;return g};
  const A=gene(X(0),'A'),B=gene(X(8),'B');[A,B].forEach(g=>H.T(g,{x:g.x0},{d:0}));
  const C1=gene(X(20),'C','dad'),C2=gene(X(-4),'C','dad');[C1,C2].forEach(g=>{H.T(g,{x:X(8)},{d:0});fade(g)});
  const dAB=brace(s,X(0),X(8),y-26,'8 cM',{up:1});
  const dBC=brace(s,X(8),X(20),y-26,'12 cM',{up:1});const dBC2=brace(s,X(-4),X(8),y+26,'12 cM',{});
  const p1=brace(s,X(0),X(20),y+62,'A–C = 20 cM',{c:'dad',st:'fill:var(--dad)'}),p2=brace(s,X(-4),X(0),y-70,'A–C = 4 cM',{up:1,c:'muted',st:'fill:var(--muted)'});
  [dBC,dBC2,p1,p2].forEach(fade);fade(B);fade(A);fade(dAB);
  const ok=H.txt(s,X(10),y+120,'measured: RF(A, C) = 20%','lb',mid({st:'font-size:17px'}));fade(ok);
  const flip=H.txt(s,320,385,'A–B–C  =  C–B–A','lb',mid({st:'font-size:20px'}));fade(flip);
  const m1=brace(s,X(0),X(12),y-26,'12 cM',{up:1}),m2=brace(s,X(12),X(20),y-26,'8 cM',{up:1});fade(m1);fade(m2);
  return [
    ()=>{H.O(A,1);H.O(B,1,{at:300});H.O(dAB,1,{at:600})},
    ()=>{[C1,C2].forEach(g=>H.O(g,1,{d:300}));H.T(C1,{x:X(20)},{d:1100});H.T(C2,{x:X(-4)},{d:1100});H.O([dBC,dBC2],1,{at:900});H.O(p1,1,{at:1300});H.O(p2,1,{at:1500})},
    ()=>{H.O(ok,1);H.O([C2,p2,dBC2],.12,{at:500});H.K(C1.box,{stroke:'ink'},{at:500})},
    ()=>{H.O([C2,p2,dBC2,ok,p1],0,{d:400});const o={d:1500,at:300};H.T(A,{x:X(20)},o);H.T(C1,{x:X(0)},o);H.T(B,{x:X(12)},o);
      H.O([dAB,dBC],0,{d:300});H.O([m1,m2],1,{at:1800});H.O(flip,1,{at:1800})},
  ];}},

/* 10 ─────────────────────────────── */
{sec:'11.3',title:'Two-Point Crosses: Linkage Groups',caption:'RF from separate two-point test crosses of four genes',
text:`<p data-step="0">A <b>two-point test cross</b> follows two genes at a time. Each test cross of a dihybrid gives the RF between two genes. A geneticist tested four genes (q, r, s and t) in pairs.</p>
<p data-step="1">q gives RF = 50% with each of the other genes. So q is unlinked to the other three genes. Gene q is on another chromosome, or far from them on the same chromosome. In the second case, more mapped genes between them would join q to the group.</p>
<p data-step="2">r, s and t give RFs below 50%, so they are linked. A <b>linkage group</b> is a set of genes that are linked to each other. Gene q forms linkage group 1, and r, s and t form linkage group 2.</p>
<p data-step="3">When geneticists map enough genes, each chromosome becomes one linkage group. The fruit fly has 4 pairs of chromosomes and 4 linkage groups.</p>`,
star:'RF = 50% → different linkage groups.',starStep:2,
scene(H){const s=ST();
  const rows=[['q','r',50],['q','s',50],['q','t',50],['r','s',20],['r','t',10],['s','t',28]];
  const T=H.g(s);H.txt(T,30,46,'GENES','cap');H.txt(T,170,46,'RF','cap',END);
  const tr=rows.map(([a,b,v],i)=>{const y=78+i*34;const g=H.g(T);H.txt(g,30,y,a+' and '+b,'lb',{st:'font-size:16px'});H.txt(g,170,y,v+'%','lb',mid({'text-anchor':'end',st:'font-size:16px'}));return g});
  H.E('line',{x1:26,y1:54,x2:176,y2:54,st:'stroke:var(--ink);stroke-width:2'},T);
  const P={q:[250,96],r:[420,150],s:[600,150],t:[356,214]};
  const ed=rows.map(([a,b,v])=>{const g=H.g(s);const [x1,y1]=P[a],[x2,y2]=P[b];
    g.l=H.E('path',{d:`M${x1},${y1} L${x2},${y2}`,pathLength:1,cls:'draw',st:`fill:none;stroke:${v===50?'var(--muted)':'var(--dad)'};stroke-width:${v===50?2:3.5}`},g);
    const mx=(x1+x2)/2,my=(y1+y2)/2;g.t=H.txt(g,mx,my-6,v+'%','lb',mid({st:`fill:${v===50?'var(--muted)':'var(--dad)'};paint-order:stroke;stroke:var(--card);stroke-width:5px`}));fade(g.t);return g});
  const nodes={};Object.keys(P).forEach(k=>{const g=H.g(s);H.E('circle',{cx:0,cy:0,r:20,st:'fill:var(--card);stroke:var(--ink);stroke-width:2.5'},g);
    H.txt(g,0,6,k,'lb',mid({st:'font-size:19px;font-family:var(--f-math);font-style:italic'}));H.T(g,{x:P[k][0],y:P[k][1]},{d:0});fade(g);nodes[k]=g});
  const g1=H.g(s);H.E('rect',{x:192,y:228,width:110,height:110,rx:14,st:'fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:6 5'},g1);H.txt(g1,247,358,'linkage group 1','lb',MID);fade(g1);
  const g2=H.g(s);H.E('ellipse',{cx:470,cy:180,rx:165,ry:92,st:'fill:none;stroke:var(--dad);stroke-width:2;stroke-dasharray:6 5'},g2);H.txt(g2,470,296,'linkage group 2','lb',mid({st:'fill:var(--dad)'}));fade(g2);
  const hl=(idx)=>tr.forEach((r,i)=>H.O(r,idx.includes(i)?1:.3,{d:400}));
  return [
    ()=>{Object.values(nodes).forEach((n,i)=>H.O(n,1,{at:i*120}))},
    ()=>{hl([0,1,2]);[0,1,2].forEach(i=>{H.D(ed[i].l,1,{d:700});H.O(ed[i].t,1,{at:600})});
      H.after(1500,()=>{[0,1,2].forEach(i=>{H.O(ed[i],0,{d:600})});H.T(nodes.q,{x:247,y:283},{d:1100});H.O(g1,1,{at:900})})},
    ()=>{hl([3,4,5]);[3,4,5].forEach((i,j)=>{H.D(ed[i].l,1,{d:700,at:j*250});H.O(ed[i].t,1,{at:600+j*250})});H.O(g2,1,{at:1300})},
    ()=>{hl([0,1,2,3,4,5])},
  ];}},

/* 11 ─────────────────────────────── */
{sec:'11.3',title:'Two-Point Crosses: Placing Gene t',caption:'linkage group 2 · distances in cM',
text:`<p data-step="0">r and s give RF = 20%, so they are 20&nbsp;cM apart.</p>
<p data-step="1">r and t give RF = 10%. So t is 10&nbsp;cM from r, on the left or on the right.</p>
<p data-step="2">Each position predicts a different s–⁠t distance. On the left, s–⁠t is about 10 + 20 = 30&nbsp;cM. On the right, s–⁠t is 20 − 10 = 10&nbsp;cM.</p>
<p data-step="3">The s–⁠t cross gives RF = 28%. So t is on the left. The order is t–⁠r–⁠s, with 10&nbsp;cM from t to r and 20&nbsp;cM from r to s. The measured 28% is a little less than 30%, because the s–⁠t cross misses some double crossovers. A double crossover is two crossovers between the same two genes, and it leaves those genes in a parental combination.</p>`,
star:'Two genes give a distance. A third gene gives the order.',starStep:3,
scene(H){const s=ST();const y=170,k=14,xr=270;const X=v=>xr+v*k;
  H.E('line',{x1:40,y1:y,x2:610,y2:y,st:'stroke:var(--faint);stroke-width:2'},s);
  const node=(x,l,c,dash)=>{const g=H.g(s);H.E('circle',{cx:0,cy:0,r:17,st:`fill:var(--card);stroke:${H.C(c||'ink')};stroke-width:2.5${dash?';stroke-dasharray:5 4':''}`},g);
    H.txt(g,0,6,l,'lb',mid({st:`font-size:19px;font-family:var(--f-math);font-style:italic;fill:${H.C(c||'ink')}`}));H.T(g,{x,y},{d:0});return g};
  const r=node(X(0),'r'),S=node(X(20),'s');fade(r);fade(S);
  const rs=brace(s,X(0),X(20),y-30,'20 cM',{up:1});fade(rs);
  const tL=node(X(0),'t','dad',1),tR=node(X(0),'t','dad',1);[tL,tR].forEach(fade);
  const d1=brace(s,X(-10),X(0),y-30,'10 cM',{up:1,c:'dad',st:'fill:var(--dad)'}),d2=brace(s,X(0),X(10),y+30,'10 cM',{c:'dad',st:'fill:var(--dad)'});[d1,d2].forEach(fade);
  const pL=brace(s,X(-10),X(20),y+82,'if t is on the left: s–t ≈ 30 cM',{}),pR=brace(s,X(10),X(20),y+128,'if t is on the right: s–t = 10 cM',{});[pL,pR].forEach(fade);
  pR.t.setAttribute('x',X(15)-40);
  const m=H.g(s);H.E('rect',{x:150,y:44,width:340,height:40,rx:8,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},m);H.txt(m,320,70,'measured: RF(s, t) = 28%','lb',mid({st:'font-size:18px'}));fade(m);
  return [
    ()=>{H.O(r,1);H.O(S,1,{at:200});H.O(rs,1,{at:500})},
    ()=>{H.O([tL,tR],1,{d:200});H.T(tL,{x:X(-10)},{d:1000});H.T(tR,{x:X(10)},{d:1000});H.O([d1,d2],1,{at:800})},
    ()=>{H.O(pL,1);H.O(pR,1,{at:500})},
    ()=>{H.O(m,1);H.O([tR,d2,pR],.12,{at:600});H.after(600,()=>{tL.firstChild.style.strokeDasharray='none'});pL.t.textContent='s–t = 28 cM measured, 30 cM by addition'},
  ];}},

/* 12 ─────────────────────────────── */
{sec:'11.2',title:'Double Crossovers Hide',caption:'two non-sister chromatids shown · the other two chromatids do not take part',
text:`<p data-step="0">Genes A and C are far apart, and gene B lies between them.</p>
<p data-step="1">One crossover between A and C swaps everything on one side of it. The chromatids become A&nbsp;b&nbsp;c and a&nbsp;B&nbsp;C. Both are recombinant for A and C.</p>
<p data-step="2">Two crossovers between A and C swap only the segment between them. The chromatids become A&nbsp;b&nbsp;C and a&nbsp;B&nbsp;c. Two crossovers between the same two genes are a <b>double crossover</b>.</p>
<p data-step="3">For genes A and C, a double crossover leaves the parental combinations, A with C and a with c. A cross that follows only A and C counts these offspring as parentals. Only a gene in the middle, here B, shows the two crossovers.</p>`,
star:'Two crossovers cancel for the outer genes. Only the middle gene switches.',starStep:3,
scene(H){const s=ST();const y1=120,y2=170,x0=70,x1=570,c1=225,c2=415;
  const T=strand(s,y1,'dad',x0,x1,[c1,c2],[[130,'A'],[320,'B'],[510,'C']],{r:12});
  const O=strand(s,y2,'mom',x0,x1,[c1,c2],[[130,'a'],[320,'b'],[510,'c']],{r:12});
  const sp=[spark(s,c1,(y1+y2)/2,12),spark(s,c2,(y1+y2)/2,12)];sp.forEach(fade);
  const lab=H.txt(s,320,60,'','lb',mid({st:'font-size:17px'}));
  const r1=H.txt(s,x1+10,y1+5,'','lbs'),r2=H.txt(s,x1+10,y2+5,'','lbs');
  const qs=[T[1].tags[0],O[1].tags[0]];
  const note=H.g(s);H.E('rect',{x:110,y:250,width:420,height:110,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},note);
  H.txt(note,320,282,'Follow only A and C:','lb',MID);H.txt(note,320,310,'A … C  and  a … c  =  parental combinations','lb',mid({st:'font-size:16px'}));
  H.txt(note,320,338,'2 crossovers, 0 counted','lb',mid({st:'fill:var(--bad)'}));fade(note);
  const sw=(i,o)=>{H.T(T[i],{y:y2},o);H.T(O[i],{y:y1},o)},back=(i,o)=>{H.T(T[i],{y:y1},o);H.T(O[i],{y:y2},o)};
  return [
    ()=>{lab.textContent='no crossover'},
    ()=>{lab.textContent='one crossover between A and C';H.O(sp[0],1,{d:200});H.O(sp[0],0,{d:400,at:1300});sw(1,{d:1200,at:300});sw(2,{d:1200,at:300})},
    ()=>{lab.textContent='two crossovers between A and C: a double crossover';back(1,{d:700});back(2,{d:700});
      H.after(800,()=>{H.O(sp,1,{d:200});H.O(sp,0,{d:400,at:1300});sw(1,{d:1200,at:300})})},
    ()=>{qs.forEach(q=>{H.O(q,.15,{d:600})});H.O(note,1,{at:400})},
  ];}},

/* 13 ─────────────────────────────── */
{sec:'11.2',title:'Why Long Distances Look Short',caption:'curve: Haldane mapping function, which assumes independent crossovers · bottom: fruit fly chromosome 2 · b = black body, cn = cinnabar eyes, vg = vestigial wings, bw = brown eyes',
text:`<p data-step="0">Two genes close together rarely have two crossovers between them. So for short distances, the RF and the map distance agree.</p>
<p data-step="1">Two genes far apart often have two or more crossovers between them. Two crossovers between the same two chromatids put the outer genes back in a parental combination. So the RF underestimates the distance, and the error grows with distance.</p>
<p data-step="2">The RF can never pass 50%. Two genes at opposite ends of a long chromosome give RF = 50%, the same as unlinked genes.</p>
<p data-step="3">A whole chromosome can still be more than 100&nbsp;cM long. Its length is the sum of many short intervals, each measured with a low RF. The Haldane mapping function (1919) is a formula that converts a large RF to a better estimate of distance. The formula assumes that crossovers are independent.</p>`,
star:'Map long distances in short steps, then add.',starStep:3,
scene(H){const s=ST();const ox=80,oy=262,kx=3.4,ky=4;const P=(d,r)=>[ox+d*kx,oy-r*ky];
  const ax=H.g(s);H.E('path',{d:`M${ox},${oy-210} L${ox},${oy} L${ox+150*kx},${oy}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},ax);
  [0,10,20,30,40,50].forEach(v=>{H.E('line',{x1:ox-5,y1:oy-v*ky,x2:ox,y2:oy-v*ky,st:'stroke:var(--ink);stroke-width:1.5'},ax);H.txt(ax,ox-9,oy-v*ky+4,v+'%','lbs',END)});
  [0,50,100,150].forEach(v=>{H.E('line',{x1:ox+v*kx,y1:oy,x2:ox+v*kx,y2:oy+5,st:'stroke:var(--ink);stroke-width:1.5'},ax);H.txt(ax,ox+v*kx,oy+19,v,'lbs',MID)});
  H.txt(ax,ox+75*kx,oy+38,'true map distance (cM)','lbs',MID);H.txt(ax,ox-8,oy-222,'RF measured in a cross','lbs');
  const ideal=H.E('path',{d:`M${P(0,0)} L${P(50,50)}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:1'},s);
  const il=H.txt(s,P(41,46)[0],P(41,46)[1]+4,'RF = distance','lbs',END);fade(il);
  let d='';for(let x=0;x<=150;x+=2){const r=50*(1-Math.exp(-x/50));d+=(d?' L':'M')+P(x,r).map(v=>v.toFixed(1)).join(',')}
  const cur=H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:3.5'},s);
  const g40=H.g(s);const [ax1,ay1]=P(40,40),[ax2,ay2]=P(40,50*(1-Math.exp(-.8)));H.E('path',{d:`M${ax1},${ay1} L${ax2},${ay2}`,st:'stroke:var(--bad);stroke-width:2.5'},g40);
  H.E('circle',{cx:ax2,cy:ay2,r:5,st:'fill:var(--dad)'},g40);const [lx,ly]=P(52,14);H.E('path',{d:`M${ax1+3},${(ay1+ay2)/2} L${lx-4},${ly-14}`,st:'stroke:var(--bad);stroke-width:1.3'},g40);H.txt(g40,lx,ly,'40 cM apart → RF ≈ 28%','lb',{st:'font-size:13px'});H.txt(g40,lx,ly+18,'the gap = hidden double crossovers','lbs',{st:'fill:var(--bad)'});fade(g40);
  const cap50=H.g(s);H.E('line',{x1:ox,y1:oy-50*ky,x2:ox+150*kx,y2:oy-50*ky,st:'stroke:var(--bad);stroke-width:1.5;stroke-dasharray:6 5'},cap50);H.txt(cap50,ox+150*kx,oy-50*ky-8,'RF never passes 50%','lb',mid({'text-anchor':'end',st:'fill:var(--bad);font-size:13px'}));fade(cap50);
  const R=ruler(s,60,382,5,[[0,''],[48.5,'b'],[57.5,'cn'],[67,'vg'],[104.5,'bw']],{fmt:v=>v?v.toFixed(1):''});R.ticks[0].style.display='none';
  const bb=brace(s,60+48.5*5,60+104.5*5,342,'b to bw: 56 cM on the map, RF in a cross ≤ 50%',{up:1,c:'bad',st:'fill:var(--bad);font-size:13px'});fade(bb);
  return [
    ()=>{H.D(ideal,1,{d:900});H.O(il,1,{at:700})},
    ()=>{H.D(cur,1,{d:1600});H.O(g40,1,{at:1400})},
    ()=>{H.O(cap50,1)},
    ()=>{R.show(900);H.O(bb,1,{at:1000})},
  ];}},

/* 14 ─────────────────────────────── */
{sec:'11.3',title:'The Plan of a Three-Point Cross',caption:'mouse example · blue = chromosome from one P parent, orange = from the other P parent',
text:`<p data-step="0">A <b>three-point cross</b> maps three linked genes in one experiment. The example uses three mouse genes. Allele A gives a long tail, and a gives a short tail. B gives brown fur, and b gives white fur. C gives long whiskers, and c gives short whiskers.</p>
<p data-step="1">Step 1 crosses two pure-breeding lines, homozygous at all three genes: aaBBcc × AAbbCC. Each F1 offspring is a <b>trihybrid</b>, heterozygous at all three genes. One homolog carries a, B and c. The other carries A, b and C.</p>
<p data-step="2">Step 2 test-crosses the trihybrid with a tester, aabbcc, homozygous recessive at all three genes.</p>
<p data-step="3">The trihybrid can make 2 × 2 × 2 = 8 types of gamete. The gene order on the chromosome is still unknown.</p>`,
star:'Trihybrid × triple recessive tester → 8 classes of offspring.',starStep:3,
scene(H){const s=ST();const LX=130,RX=480;
  const chr=(p,x,y,c,al)=>piece(p,x-62,x+62,c,[[x-38,al[0]],[x,al[1]],[x+38,al[2]]],{y,r:10});
  const P1=H.g(s);mouse(P1,LX-20,52,{tail:'short',fur:'brown',wh:'short'});chr(P1,LX,92,'dad','aBc');chr(P1,LX,116,'dad','aBc');H.txt(P1,LX+40,57,'aaBBcc','lb',{st:'font-size:15px'});
  const P2=H.g(s);mouse(P2,RX-20,52,{tail:'long',fur:'white',wh:'long'});chr(P2,RX,92,'mom','AbC');chr(P2,RX,116,'mom','AbC');H.txt(P2,RX+40,57,'AAbbCC','lb',{st:'font-size:15px'});
  H.txt(s,305,92,'×','big',MID);H.txt(s,18,30,'P','big',{st:'font-size:22px'});
  const c1=H.g(s),c2=H.g(s);chr(c1,LX,116,'dad','aBc');chr(c2,RX,116,'mom','AbC');
  const F1=H.g(s);mouse(F1,LX-20,190,{tail:'long',fur:'brown',wh:'long'});H.txt(F1,LX+40,195,'AaBbCc','lb',{st:'font-size:15px'});H.txt(F1,18,170,'F1','big',{st:'font-size:22px'});fade(F1);
  const unk=H.txt(s,LX,292,'gene order unknown','lbs',MID);fade(unk);
  const Tt=H.g(s);mouse(Tt,RX-20,190,{tail:'short',fur:'white',wh:'short'});chr(Tt,RX,236,'muted','abc');chr(Tt,RX,260,'muted','abc');H.txt(Tt,RX+40,190,'aabbcc','lb',{st:'font-size:15px'});H.txt(Tt,RX+40,207,'tester','lbs');
  H.txt(Tt,305,248,'×','big',MID);fade(Tt);
  const gl=H.txt(s,18,326,'8 TYPES OF GAMETE FROM THE TRIHYBRID','cap');fade(gl);
  const G=['ABC','ABc','AbC','Abc','aBC','aBc','abC','abc'].map((g,i)=>{const e=H.g(s);const x=50+i*77;H.E('rect',{x:x-32,y:342,width:64,height:30,rx:7,cls:'card',st:'stroke:var(--ink);stroke-width:1.5'},e);
    H.txt(e,x,363,g.split('').join(' '),'lb',mid({st:'font-size:15px'}));fade(e);return e});
  return [
    ()=>{},
    ()=>{H.O(F1,1);H.T(c1,{y:120},{d:1200,at:200});H.T(c2,{x:LX-RX,y:144},{d:1400,at:400});H.O(unk,1,{at:1500})},
    ()=>{H.O(Tt,1,{d:700})},
    ()=>{H.O(gl,1);G.forEach((g,i)=>H.O(g,1,{at:200+i*110}))},
  ];}},

/* 15 ─────────────────────────────── */
{sec:'11.3',title:'Read the Gamete from the Phenotype',caption:'test cross of the trihybrid · 120 offspring',
text:`<p data-step="0">The tester gives only a, b and c. So in each offspring, the allele from the trihybrid decides each trait.</p>
<p data-step="1">A short tail means that the gamete carried a. Brown fur means B. Long whiskers mean C. So the first mouse came from an a&nbsp;B&nbsp;C gamete.</p>
<p data-step="2">The test cross gave 8 classes of offspring. The class sizes differ a lot: from 42 offspring down to 1.</p>
<p data-step="3">Total: 5 + 38 + 1 + 16 + 42 + 5 + 12 + 1 = 120 offspring.</p>`,
star:'Test cross: phenotype = the trihybrid’s gamete.',starStep:1,
scene(H){const s=ST();const D=[['short','brown','long','aBC',5],['long','white','long','AbC',38],['short','white','long','abC',1],['long','brown','long','ABC',16],['short','brown','short','aBc',42],['long','white','short','Abc',5],['short','white','short','abc',12],['long','brown','short','ABc',1]];
  H.txt(s,135,30,'TAIL · FUR · WHISKERS','cap');H.txt(s,345,30,'GAMETE','cap',MID);H.txt(s,392,30,'OFFSPRING','cap');
  const rows=D.map(([t,f,w,g,n],i)=>{const y=58+i*43;const G=H.g(s);mouse(G,66,y+2,{tail:t,fur:f,wh:w,s:.72});
    H.txt(G,135,y+5,`${t} · ${f} · ${w}`,'lbs',{st:'fill:var(--ink)'});
    const gm=H.txt(s,345,y+6,g.split('').join(' '),'lb',mid({st:'font-size:17px'}));fade(gm);
    const b=hbar(s,392,y,20,'ink');const c=H.txt(s,398,y+5,'','lb');fade(c);fade(G);return {G,gm,b,c,n}});
  const tot=H.txt(s,600,395,'n = 120','big',mid({'text-anchor':'end',st:'font-size:22px'}));fade(tot);
  const hl=H.E('rect',{x:20,y:36,width:600,height:44,rx:8,st:'fill:var(--hi);opacity:0'},s);s.insertBefore(hl,s.firstChild);
  return [
    ()=>{rows.forEach((r,i)=>H.O(r.G,1,{at:i*100}))},
    ()=>{hl.style.opacity=.3;rows.forEach((r,i)=>H.O(r.gm,1,{at:i===0?0:600+i*90}))},
    ()=>{hl.style.opacity=0;rows.forEach((r,i)=>{H.T(r.b,{sx:r.n*4.6},{d:900,at:i*90});H.T(r.c,{x:r.n*4.6},{d:900,at:i*90});H.O(r.c,1,{at:i*90});H.count(r.c,0,r.n,{d:900,at:i*90})})},
    ()=>{H.O(tot,1)},
  ];}},

/* 16 ─────────────────────────────── */
{sec:'11.3',title:'Sort the Eight Classes',caption:'same 120 offspring, sorted into four pairs',
text:`<p data-step="0">Each crossover makes two <b>reciprocal</b> products: each one has the alleles that the other one lacks. So the 8 classes form 4 pairs, such as aBC and Abc.</p>
<p data-step="1">Sort the pairs by size.</p>
<p data-step="2">The largest pair, aBc (42) and AbC (38), are the parentals. They had no crossover between the genes. They match the two homologs of the trihybrid.</p>
<p data-step="3">The smallest pair, ABc (1) and abC (1), are the double crossovers. Two crossovers in one short region of the same meiosis are rare.</p>
<p data-step="4">The other two pairs are single crossovers: ABC and abc (28 in all), and aBC and Abc (10 in all).</p>`,
star:'Largest pair = parentals. Smallest pair = double crossovers.',starStep:4,
scene(H){const s=ST();const D=[['aBC',5],['AbC',38],['abC',1],['ABC',16],['aBc',42],['Abc',5],['abc',12],['ABc',1]];
  const pairOf={aBC:'p4',Abc:'p4',AbC:'p1',aBc:'p1',abC:'p5',ABc:'p5',ABC:'p3',abc:'p3'};
  const target={aBc:58,AbC:88,ABC:150,abc:180,aBC:242,Abc:272,ABc:334,abC:364};
  const k=6.2,bx=106;
  const pid={aBc:1,AbC:1,ABC:2,abc:2,aBC:3,Abc:3,ABc:4,abC:4};
  const rows=D.map(([g,n],i)=>{const G=H.g(s);const y0=50+i*42;H.txt(G,36,5,g.split('').join(' '),'lb',{st:'font-size:16px'});
    G.pt=H.g(G);H.E('circle',{cx:14,cy:0,r:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},G.pt);H.txt(G.pt,14,4.5,pid[g],'lb',mid({st:'font-size:12px'}));fade(G.pt);
    const b=H.g(G);G.br=H.E('rect',{x:bx,y:-10,width:n*k,height:20,st:'fill:var(--faint)'},b);H.txt(G,bx+n*k+8,5,n,'lb');H.T(G,{y:y0},{d:0});G.g=g;return G});
  const R=Object.fromEntries(rows.map(r=>[r.g,r]));
  const br=(y0,y1,c,t1,t2)=>{const G=H.g(s);H.E('path',{d:`M406,${y0-10} L414,${y0-10} L414,${y1+10} L406,${y1+10}`,st:`fill:none;stroke:${H.C(c)};stroke-width:2.2`},G);
    H.txt(G,424,(y0+y1)/2-2,t1,'lb',{st:`fill:${H.C(c==='hi'?'ink':c)}`});H.txt(G,424,(y0+y1)/2+16,t2,'lbs');fade(G);return G};
  const B1=br(58,88,'ink','parentals','no crossover · 80'),B2=br(150,180,'hi','single crossovers','28 offspring'),B3=br(242,272,'good','single crossovers','10 offspring'),B4=br(334,364,'bad','double crossovers','2 offspring');
  const col=(gs,c)=>gs.forEach(g=>H.K(R[g].br,{fill:c}));
  return [
    ()=>{rows.forEach((r,i)=>H.O(r.pt,1,{at:300+i*120}))},
    ()=>{rows.forEach(r=>H.T(r,{y:target[r.g]},{d:1400}))},
    ()=>{col(['aBc','AbC'],'ink');H.O(B1,1)},
    ()=>{col(['ABc','abC'],'bad');H.O(B4,1)},
    ()=>{col(['ABC','abc'],'hi');col(['aBC','Abc'],'good');H.O(B2,1);H.O(B3,1,{at:300})},
  ];}},

/* 17 ─────────────────────────────── */
{sec:'11.3',title:'The Middle Gene Switches',caption:'blue and orange = the two homologs of the trihybrid · each row tests one possible gene order',
text:`<p data-step="0">A double crossover swaps only the middle segment. So a double-crossover gamete differs from a parental gamete only at the middle gene.</p>
<p data-step="1">Test each possible order. If B is in the middle, the double crossovers would be abc and ABC. The two classes have 12 and 16 offspring, not the fewest.</p>
<p data-step="2">If C is in the middle, the double crossovers would be aBC and Abc, with 5 offspring each. Also not the fewest.</p>
<p data-step="3">If A is in the middle, the double crossovers would be ABc and abC. ABc and abC are the rarest classes, with 1 offspring each. So A is in the middle.</p>
<p data-step="4">Quick check: compare the parental aBc with the double crossover ABc. Only gene A differs. The gene order is B–⁠A–⁠C, which is the same map as C–⁠A–⁠B.</p>`,
star:'In the double crossover, the odd one out is the middle gene.',starStep:4,
scene(H){const s=ST();const Y=[100,208,316],x0=180,x1=380,c1=246,c2=314;
  H.txt(s,320,36,'Rarest classes observed: ABc (1) and abC (1)','lb',mid({st:'font-size:16px'}));
  const orders=[['B in the middle?',['a','B','c'],['A','b','C'],'a b c  +  A B C','12 + 16',0],['C in the middle?',['a','c','B'],['A','C','b'],'a B C  +  A b c','5 + 5',0],['A in the middle?',['B','a','c'],['b','A','C'],'A B c  +  a b C','1 + 1',1]];
  const rows=orders.map(([q,u,l,res,n,ok],i)=>{const y=Y[i];const G=H.g(s);H.txt(G,20,y+5,q,'lb',{st:'font-size:15px'});
    const xs=[213,280,347];const T=strand(G,y-14,'dad',x0,x1,[c1,c2],xs.map((x,j)=>[x,u[j]]),{r:10});const O=strand(G,y+14,'mom',x0,x1,[c1,c2],xs.map((x,j)=>[x,l[j]]),{r:10});
    const r=H.g(G);H.txt(r,400,y-2,'→ '+res,'lb',{st:'font-size:15px'});H.txt(r,416,y+18,n+' offspring','lbs');
    const m=H.txt(r,612,y+8,ok?'✓':'✗','big',mid({st:`fill:${ok?'var(--good)':'var(--bad)'};font-size:30px`}));fade(r);
    const band=H.E('rect',{x:10,y:y-38,width:620,height:76,rx:10,st:`fill:${ok?'var(--good)':'var(--wash)'};opacity:0`},s);s.insertBefore(band,s.firstChild);
    G.T=T;G.O=O;G.r=r;G.band=band;G.ok=ok;G.y=y;return G});
  const fin=H.txt(s,320,396,'Gene order: B – A – C','lb',mid({st:'font-size:22px'}));fade(fin);
  const run=i=>{const R=rows[i];H.T(R.T[1],{y:R.y+14},{d:1100});H.T(R.O[1],{y:R.y-14},{d:1100});H.O(R.r,1,{at:1000});R.band.style.transitionDelay='900ms';R.band.style.opacity=R.ok?.16:.6};
  return [()=>{},()=>run(0),()=>run(1),()=>run(2),()=>{H.O(fin,1);H.O([rows[0],rows[1]],.35)}];}},

/* 18 ─────────────────────────────── */
{sec:'11.3',title:'Where the Crossovers Fell',caption:'gene order B–A–C · region I = between B and A, region II = between A and C',
text:`<p data-step="0">Write the genes in the correct order, B–⁠A–⁠C, for every class. With no crossover, a gamete keeps one homolog of the trihybrid: B&nbsp;a&nbsp;c or b&nbsp;A&nbsp;C. The parentals make 42 + 38 = 80 offspring.</p>
<p data-step="1">A single crossover in region I, between B and A, makes B&nbsp;A&nbsp;C and b&nbsp;a&nbsp;c. The two classes have 16 + 12 = 28 offspring.</p>
<p data-step="2">A single crossover in region II, between A and C, makes B&nbsp;a&nbsp;C and b&nbsp;A&nbsp;c. The two classes have 5 + 5 = 10 offspring.</p>
<p data-step="3">One crossover in each region makes B&nbsp;A&nbsp;c and b&nbsp;a&nbsp;C. The two classes have 1 + 1 = 2 offspring.</p>`,
star:'One crossover in region I, one in region II, or one in each.',starStep:3,
scene(H){const s=ST();
  const P=[[16,36,'NO CROSSOVER',[],'B a c  +  b A C','42 + 38 = 80','muted'],[328,36,'CROSSOVER IN REGION I',[1,2],'B A C  +  b a c','16 + 12 = 28','hi'],[16,226,'CROSSOVER IN REGION II',[2],'B a C  +  b A c','5 + 5 = 10','good'],[328,226,'ONE IN EACH REGION',[1],'B A c  +  b a C','1 + 1 = 2','bad']];
  const panels=P.map(([px,py,t,sw,res,n,c],i)=>{const G=H.g(s);H.E('rect',{x:px,y:py,width:296,height:176,rx:12,st:`fill:var(--card);stroke:${H.C(c)};stroke-width:2`},G);
    H.txt(G,px+14,py+24,t,'cap',{st:`fill:${H.C(c==='hi'||c==='muted'?'ink':c)}`});
    const xs=[px+56,px+148,px+240],cuts=[px+102,px+194];
    const T=strand(G,py+58,'dad',px+20,px+276,cuts,[[xs[0],'B'],[xs[1],'a'],[xs[2],'c']],{r:10});const O=strand(G,py+88,'mom',px+20,px+276,cuts,[[xs[0],'b'],[xs[1],'A'],[xs[2],'C']],{r:10});
    if(i===0){H.txt(G,cuts[0],py+117,'I','lb',mid({st:'fill:var(--muted)'}));H.txt(G,cuts[1],py+117,'II','lb',mid({st:'fill:var(--muted)'}))}
    const sps=sw.length===2?[spark(G,cuts[0],py+73,9)]:sw[0]===2?[spark(G,cuts[1],py+73,9)]:sw.length?[spark(G,cuts[0],py+73,9),spark(G,cuts[1],py+73,9)]:[];sps.forEach(fade);
    const r=H.g(G);H.txt(r,px+148,py+140,res.replace(/  \+  /,'   +   '),'lb',mid({st:'font-size:15px;white-space:pre'}));H.txt(r,px+148,py+162,n+' offspring','lbs',MID);fade(r);
    fade(G);G.T=T;G.O=O;G.sw=sw;G.sps=sps;G.r=r;G.py=py;return G});
  const run=i=>{const G=panels[i];H.O(G,1,{d:500});H.O(G.sps,1,{d:200,at:500});H.O(G.sps,0,{d:400,at:1700});
    G.sw.forEach(j=>{H.T(G.T[j],{y:G.py+88},{d:1100,at:600});H.T(G.O[j],{y:G.py+58},{d:1100,at:600})});H.O(G.r,1,{at:G.sw.length?1600:400})};
  return [()=>run(0),()=>run(1),()=>run(2),()=>run(3)];}},

/* 19 ─────────────────────────────── */
{sec:'11.3',title:'Distances from a Three-Point Cross',caption:'bar lengths = numbers of offspring (120 in all)',
text:`<p data-step="0">The RF for one region counts every offspring that had a crossover in that region.</p>
<p data-step="1">Region I (B–⁠A): single crossovers in region I (28) plus double crossovers (2). RF = 30 ÷ 120 = 25%, so B and A are 25&nbsp;cM apart.</p>
<p data-step="2">Region II (A–⁠C): single crossovers in region II (10) plus double crossovers (2). RF = 12 ÷ 120 = 10%, so A and C are 10&nbsp;cM apart.</p>
<p data-step="3">Each double crossover counts in both regions, because it had one crossover in each. On the map, A is 25&nbsp;cM from B, and C is 10&nbsp;cM beyond A. So B–⁠C = 25 + 10 = 35&nbsp;cM.</p>`,
star:'RF of a region = (single crossovers in that region + all double crossovers) ÷ total.',starStep:3,
scene(H){const s=ST();const k=4,y0=74;
  const blk=(x,n,c)=>{const G=H.g(s);H.E('rect',{x:0,y:-14,width:n*k,height:28,rx:3,st:`fill:${H.C(c)}`},G);H.T(G,{x,y:y0},{d:0});return G};
  const segs=[[30,80,'muted','parentals','80'],[364,28,'hi','1 crossover in I','28'],[490,10,'good','1 in II','10'],[544,2,'bad','double crossovers','2']];
  const top=H.g(s);segs.forEach(([x,n,c,t,v])=>{blk(x,n,c).style.opacity=1});
  segs.forEach(([x,n,c,t,v],i)=>{if(i===3){H.txt(top,x+14,y0-3,v+' double','lb',{st:'font-size:13px'});H.txt(top,x+14,y0+13,'crossovers','lb',{st:'font-size:13px'});return}H.txt(top,x+n*k/2,y0+34,v,'lb',mid({st:'font-size:15px'}));H.txt(top,x+n*k/2,y0-22,t,'lbs',MID)});
  H.txt(top,30,30,'ALL 120 OFFSPRING','cap');
  const row=(y,label)=>{const G=H.g(s);H.txt(G,30,y-22,label,'cap');fade(G);return G};
  const L1=row(190,'Region I · B–A'),L2=row(276,'Region II · A–C');
  const m1=[blk(364,28,'hi'),blk(544,2,'bad')],m2=[blk(490,10,'good'),blk(544,2,'bad')];[...m1,...m2].forEach(fade);
  const e1=H.txt(s,190,196,'28 + 2 = 30 · 30 ÷ 120 = 25% → 25 cM','lb',{st:'font-size:16px'}),e2=H.txt(s,190,282,'10 + 2 = 12 · 12 ÷ 120 = 10% → 10 cM','lb',{st:'font-size:16px'});[e1,e2].forEach(fade);
  const R=ruler(s,90,370,13.5,[[0,'B'],[25,'A'],[35,'C']],{segs:1,segUp:0,noNum:1});
  const tot=brace(s,90,90+35*13.5,326,'B–C = 35 cM',{up:1});fade(tot);
  return [
    ()=>{},
    ()=>{H.O(L1,1);m1.forEach(b=>H.O(b,1,{d:200}));H.T(m1[0],{x:30,y:190},{d:1200});H.T(m1[1],{x:30+28*k,y:190},{d:1200,at:200});H.O(e1,1,{at:1300})},
    ()=>{H.O(L2,1);m2.forEach(b=>H.O(b,1,{d:200}));H.T(m2[0],{x:30,y:276},{d:1200});H.T(m2[1],{x:30+10*k,y:276},{d:1200,at:200});H.O(e2,1,{at:1300})},
    ()=>{R.show(1000);H.O(tot,1,{at:1300})},
  ];}},

/* 20 ─────────────────────────────── */
{sec:'11.3',title:'A Pair Count Misses Double Crossovers',caption:'gametes written in the gene order B–A–C · A shown faint',
text:`<p data-step="0">A geneticist can also count B and C as a pair, as if A were absent. Then a recombinant is any offspring with B and C together, or with b and c together.</p>
<p data-step="1">Four classes qualify: B&nbsp;A&nbsp;C (16), b&nbsp;a&nbsp;c (12), B&nbsp;a&nbsp;C (5) and b&nbsp;A&nbsp;c (5). Together they have 38 offspring. RF = 38 ÷ 120 = 31.7%, about 32&nbsp;cM.</p>
<p data-step="2">The double crossovers B&nbsp;A&nbsp;c and b&nbsp;a&nbsp;C keep B with c and b with C, the parental combinations. So the pair count misses them, although each one had two crossovers between B and C.</p>
<p data-step="3">Count each double crossover twice: (38 + 2 × 2) ÷ 120 = 42 ÷ 120 = 35%. Now B–⁠C equals 25 + 10 = 35&nbsp;cM. The middle gene reveals double crossovers that a two-point cross of B and C misses.</p>`,
star:'Add the short intervals. Do not trust one long RF.',starStep:3,
scene(H){const s=ST();
  const C=[['B','A','C',16,1],['b','a','c',12,1],['B','a','C',5,1],['b','A','c',5,1],['B','a','c',42,0],['b','A','C',38,0],['B','A','c',1,2],['b','a','C',1,2]];
  const tiles=C.map(([b,a,c,n,kind],i)=>{const G=H.g(s);const x=22+(i%4)*152,y=30+Math.floor(i/4)*86;
    G.box=H.E('rect',{x,y,width:138,height:70,rx:10,cls:'card',st:'stroke:var(--faint);stroke-width:2'},G);
    H.txt(G,x+69-34,y+32,b,'lb',mid({st:'font-size:22px'}));H.txt(G,x+69,y+32,a,'lb',mid({st:'font-size:22px;opacity:.25'}));H.txt(G,x+69+34,y+32,c,'lb',mid({st:'font-size:22px'}));
    H.txt(G,x+69,y+56,n+' offspring','lbs',MID);G.kind=kind;return G});
  const eq1=H.txt(s,320,232,'B–C recombinants: 16 + 12 + 5 + 5 = 38 → 38 ÷ 120 = 31.7%','lb',mid({st:'font-size:15px'}));fade(eq1);
  const eq2=H.txt(s,320,258,'double crossovers: 2 crossovers each, counted 0 times','lb',mid({st:'font-size:15px;fill:var(--bad)'}));fade(eq2);
  const eq3=H.txt(s,320,284,'(38 + 2 × 2) ÷ 120 = 35%','lb',mid({st:'font-size:17px;fill:var(--good)'}));fade(eq3);
  const k=14,x0=90;const cmp=H.g(s);
  const b1=hbar(cmp,x0,330,18,'muted'),b2=hbar(cmp,x0,366,18,'good');
  const l1=H.txt(cmp,x0-8,335,'pair count','lbs',END),l2=H.txt(cmp,x0-8,371,'25 + 10','lbs',END);
  const v1=H.txt(cmp,x0+31.7*k+8,335,'31.7 cM','lb'),v2=H.txt(cmp,x0+35*k+8,371,'35 cM','lb');fade(cmp);
  return [
    ()=>{},
    ()=>{tiles.forEach(t=>{if(t.kind===1){H.K(t.box,{stroke:'ink'});t.box.style.strokeWidth=3}});H.O(eq1,1,{at:400})},
    ()=>{tiles.forEach(t=>{if(t.kind===2){H.K(t.box,{stroke:'bad'});t.box.style.strokeWidth=3}});H.O(eq2,1,{at:400})},
    ()=>{H.O(eq3,1);H.O(cmp,1,{at:300});H.T(b1,{sx:31.7*k},{d:900,at:400});H.T(b2,{sx:35*k},{d:900,at:600})},
  ];}},

/* 21 ─────────────────────────────── */
{sec:'11.3',title:'Three Genes: Linked or Not',caption:'120 offspring in each case · bar height = number of offspring',
text:`<p data-step="0">The sizes of the 8 classes show which genes are linked. When all three genes are linked, the classes form 4 pairs with sizes that differ greatly. The pairs are the parentals, two kinds of single crossover and the double crossovers.</p>
<p data-step="1">When all three genes are unlinked, independent assortment makes all 8 gamete types equally common. Each type is 1/8 of the offspring, 15 of 120.</p>
<p data-step="2">Suppose that A and C are linked, 10&nbsp;cM apart, and B is unlinked. The 4 classes with a parental A–⁠C combination are common and equal (27 each). The 4 classes with a recombinant A–⁠C combination are rare and equal (3 each).</p>
<p data-step="2">B shows no pattern, because it assorts independently of A and C.</p>`,
star:'Equal classes = unlinked. Lopsided pairs = linked.',starStep:2,
scene(H){const s=ST();const G=['aBc','AbC','ABC','abc','aBC','Abc','ABc','abC'];const base=318,k=4.4;
  const sets=[{t:'All three linked (order B–A–C)',v:[42,38,16,12,5,5,1,1],c:['ink','ink','hi','hi','good','good','bad','bad']},
    {t:'All three unlinked',v:[15,15,15,15,15,15,15,15],c:Array(8).fill('muted')},
    {t:'A and C linked, B unlinked',v:[27,27,27,27,3,3,3,3],c:['ink','ink','ink','ink','good','good','good','good']}];
  H.E('line',{x1:50,y1:base,x2:610,y2:base,st:'stroke:var(--ink);stroke-width:2'},s);
  const X=i=>88+i*68;
  const bars=G.map((g,i)=>{const b=vbar(s,X(i),base,38,'ink');H.txt(s,X(i),base+22,g.split('').join(' '),'lb',mid({st:'font-size:14px'}));
    b.n=H.txt(s,X(i),base-8,'','lb',mid({st:'font-size:15px'}));return b});
  const ttl=H.txt(s,320,40,'','lb',mid({st:'font-size:18px'}));
  const lg=H.g(s);[['ink','parental'],['hi','single crossover, region I'],['good','single crossover, region II'],['bad','double crossover']].forEach(([c,t],i)=>{const x=30+[0,95,280,460][i];
    H.E('rect',{x,y:372,width:14,height:14,rx:3,st:`fill:${H.C(c)}`},lg);H.txt(lg,x+20,384,t,'lbs')});
  const lg2=H.g(s);[['ink','parental for A and C'],['good','recombinant for A and C']].forEach(([c,t],i)=>{const x=140+i*200;H.E('rect',{x,y:372,width:14,height:14,rx:3,st:`fill:${H.C(c)}`},lg2);H.txt(lg2,x+20,384,t,'lbs')});
  [lg,lg2].forEach(fade);
  const show=(j)=>{const S=sets[j];ttl.textContent=S.t;bars.forEach((b,i)=>{H.T(b,{sy:Math.max(.001,S.v[i]*k)},{d:1100,at:i*50});H.K(b.r,{fill:S.c[i]});
    H.T(b.n,{y:-S.v[i]*k},{d:1100,at:i*50});H.count(b.n,+b.n.textContent||0,S.v[i],{d:1100,at:i*50})});H.O(lg,j===0?1:0);H.O(lg2,j===2?1:0)};
  return [()=>show(0),()=>show(1),()=>show(2)];}},

/* 22 ─────────────────────────────── */
{sec:'11.4',title:'Expected Double Crossovers',caption:'left: square of all gametes · right: 120 offspring',
text:`<p data-step="0">Map distances also give the probability of a recombinant. A gamete is recombinant in region I with probability 0.25, and in region II with probability 0.10.</p>
<p data-step="1">Suppose that the crossovers in the two regions are independent. Then the product rule gives the probability of both: 0.25 × 0.10 = 0.025. So 2.5% of offspring would be double crossovers.</p>
<p data-step="2">Expected double crossovers = 0.025 × 120 = 3 offspring.</p>
<p data-step="3">The cross gave only 2 double crossovers. Fewer double crossovers than expected is common, because one crossover makes a second crossover nearby less likely.</p>`,
star:'Expected double crossovers = RF(I) × RF(II) × total offspring.',starStep:2,
scene(H){const s=ST();const x0=60,y0=70,W=230;
  const sq=H.E('rect',{x:x0,y:y0,width:W,height:W,st:'fill:var(--wash);stroke:var(--ink);stroke-width:2'},s);
  const v1=H.E('rect',{x:x0,y:y0,width:W*.25,height:W,st:'fill:var(--hi);opacity:0'},s),h2=H.E('rect',{x:x0,y:y0,width:W,height:W*.1,st:'fill:var(--good);opacity:0'},s);
  const both=H.E('rect',{x:x0,y:y0,width:W*.25,height:W*.1,st:'fill:var(--bad);opacity:0;stroke:var(--ink);stroke-width:1.5'},s);
  const l1=H.txt(s,x0,y0+W+22,'region I: 0.25','lb',{st:'font-size:13px'}),l2=H.txt(s,x0+W,y0-10,'region II: 0.10','lb',mid({'text-anchor':'end',st:'fill:var(--good);font-size:13px'}));
  const l3=H.g(s);H.E('path',{d:`M${x0+W*.25+4},${y0+W*.1+4} L${x0+W*.5},${y0+W*.38}`,st:'stroke:var(--bad);stroke-width:1.8'},l3);H.txt(l3,x0+W*.5+4,y0+W*.38+14,'both: 0.25 × 0.10','lb',{st:'fill:var(--bad);font-size:13px'});H.txt(l3,x0+W*.5+4,y0+W*.38+32,'= 0.025','lb',{st:'fill:var(--bad);font-size:13px'});
  [l1,l2,l3].forEach(fade);H.txt(s,x0,y0-34,'ALL GAMETES','cap');
  const dx=384,dy=88,sp=20.5;const dots=[];for(let i=0;i<120;i++){dots.push(H.E('circle',{cx:dx+(i%12)*sp,cy:dy+Math.floor(i/12)*sp,r:7,st:'fill:var(--wash);stroke:var(--muted);stroke-width:1.4'},s))}
  H.txt(s,dx-8,dy-22,'120 OFFSPRING','cap');
  const ex=[17,62,105];const rings=ex.map(i=>{const c=H.E('circle',{cx:dx+(i%12)*sp,cy:dy+Math.floor(i/12)*sp,r:11,st:'fill:none;stroke:var(--bad);stroke-width:2.5;stroke-dasharray:4 3'},s);fade(c);return c});
  const t1=H.txt(s,dx+113,dy+232,'expected: 3','lb',mid({st:'font-size:17px'})),t2=H.txt(s,dx+113,dy+256,'observed: 2','lb',mid({st:'font-size:17px;fill:var(--bad)'}));[t1,t2].forEach(fade);
  return [
    ()=>{v1.style.opacity=.55;h2.style.transitionDelay='500ms';h2.style.opacity=.35;H.O(l1,1,{at:300});H.O(l2,1,{at:800})},
    ()=>{both.style.opacity=.9;H.O(l3,1,{at:500})},
    ()=>{rings.forEach((r,i)=>H.O(r,1,{at:i*250}));H.O(t1,1,{at:700})},
    ()=>{[17,62].forEach(i=>{dots[i].style.fill='var(--bad)';dots[i].style.stroke='var(--ink)'});H.O(rings[2],.35);H.O(t2,1,{at:400})},
  ];}},

/* 23 ─────────────────────────────── */
{sec:'11.4',title:'Coincidence and Interference',caption:'mouse three-point cross: 2 double crossovers observed, 3 expected',
text:`<p data-step="0">The <b>coefficient of coincidence</b> compares the observed double crossovers with the expected number: coefficient of coincidence = observed ÷ expected. For the mouse cross, 2 ÷ 3 = 0.67.</p>
<p data-step="1"><b>Interference</b> is the degree to which one crossover prevents other crossovers nearby. Interference = 1 − coefficient of coincidence. For the mouse cross, 1 − 0.67 = 0.33.</p>
<p data-step="2">So one-third of the expected double crossovers did not occur. Interference = 0 means that the crossovers are independent. Interference = 1 means no double crossovers at all (complete interference).</p>
<p data-step="2" class="note">In rare cases, more double crossovers than expected occur. Then the coefficient of coincidence is above 1, and interference is negative.</p>`,
star:'Coincidence = observed ÷ expected. Interference = 1 − coincidence.',starStep:1,
scene(H){const s=ST();const x0=80,x1=560,L=x1-x0;
  const f1=H.txt(s,320,56,'coefficient of coincidence = observed ÷ expected','lb',mid({st:'font-size:16px'}));
  const f1b=H.txt(s,320,88,'= 2 ÷ 3 = 0.67','lb',mid({st:'font-size:22px;fill:var(--dad)'}));fade(f1b);
  const line=(y,lab,c)=>{const G=H.g(s);H.E('line',{x1:x0,y1:y,x2:x1,y2:y,st:'stroke:var(--ink);stroke-width:2.5'},G);
    [0,.25,.5,.75,1].forEach(v=>{H.E('line',{x1:x0+v*L,y1:y-6,x2:x0+v*L,y2:y+6,st:'stroke:var(--ink);stroke-width:2'},G);H.txt(G,x0+v*L,y+24,v,'lbs',MID)});
    H.txt(G,x0,y-34,lab,'cap');const m=H.g(G);H.E('path',{d:'M0,-6 L-9,-22 L9,-22 Z',st:`fill:${H.C(c)}`},m);m.v=H.txt(m,0,-28,'','lb',mid({st:`fill:${H.C(c)}`}));H.T(m,{x:x0,y},{d:0});G.m=m;fade(G);return G};
  const A=line(170,'coefficient of coincidence','dad'),B=line(290,'interference','bad');
  const f2=H.txt(s,320,388,'interference = 1 − 0.67 = 0.33','lb',mid({st:'font-size:20px;fill:var(--bad)'}));fade(f2);
  const e0=H.txt(s,x0,342,'I = 0: independent crossovers','lbs',{st:'fill:var(--ink)'}),e1=H.txt(s,x1,342,'I = 1: no double crossovers','lbs',{'text-anchor':'end',st:'fill:var(--ink)'});[e0,e1].forEach(fade);
  const go=(G,v)=>{H.O(G,1);H.T(G.m,{x:x0+v*L},{d:1100,at:300});H.count(G.m.v,0,v,{d:1100,at:300,fmt:x=>x.toFixed(2)})};
  return [
    ()=>{H.O(f1b,1,{at:300});go(A,.67)},
    ()=>{go(B,.33);H.O(f2,1,{at:900})},
    ()=>{H.O([e0,e1],1,{at:300})},
  ];}},

/* 24 ─────────────────────────────── */
{sec:'11.4',title:'Crossover Interference',caption:'each line = one chromatid after meiosis · ✕ = a crossover · band = the interval that the cross follows',
text:`<p data-step="0">If crossovers were independent, two crossovers would often land close together.</p>
<p data-step="1">Real chromosomes show interference. After one crossover forms, a second crossover close to it is less likely. So the crossovers on a chromosome are more evenly spaced than random positions.</p>
<p data-step="2">In a short interval, interference removes most double crossovers. Sturtevant saw this effect in his fly data in 1913.</p>
<p data-step="3">Interference is weaker over long distances. Two crossovers far apart on the same chromosome occur almost independently.</p>`,
star:'One crossover makes a second one nearby less likely.',starStep:1,
scene(H){const s=ST();const W=250,PX=[40,350],Y=i=>96+i*36;
  const R=[[.15,.5,.58],[.62,.9],[.3],[.45,.55,.8],[.1,.7],[.52,.66],[.25,.85]],I=[[.2,.75],[.55],[.3,.85],[.12,.6],[.45],[.25,.8],[.65]];
  const panel=(px,data,title)=>{const G=H.g(s);H.txt(G,px,52,title,'cap');
    const bS=H.E('rect',{x:px+W*.42,y:70,width:W*.3,height:252,st:'fill:var(--hi);opacity:0'},G);
    data.forEach((row,i)=>{H.E('line',{x1:px,y1:Y(i),x2:px+W,y2:Y(i),st:'stroke:var(--muted);stroke-width:5;stroke-linecap:round'},G);row.forEach(f=>xmark(G,px+f*W,Y(i),6,'bad'))});
    G.cnt=H.txt(G,px+W/2,352,'','lb',mid({st:'font-size:15px'}));G.bS=bS;fade(G);return G};
  const A=panel(PX[0],R,'IF CROSSOVERS WERE INDEPENDENT'),B=panel(PX[1],I,'REAL CHROMOSOMES');
  const dbl=(data,a,b)=>data.filter(r=>r.filter(f=>f>a&&f<b).length>=2).length;
  const band=(G,data,a,b,label)=>{H.T(G.bS,{},{d:0});G.bS.setAttribute('x',G.bS.getAttribute('x'));G.bS.style.opacity=.35;
    const n=dbl(data,a,b);G.cnt.textContent=label+': '+n+' double crossover'+(n===1?'':'s')};
  const widen=(G,px)=>{G.bS.setAttribute('x',px+W*.05);G.bS.setAttribute('width',W*.9)};
  return [
    ()=>{H.O(A,1)},
    ()=>{H.O(B,1)},
    ()=>{band(A,R,.42,.72,'short band');band(B,I,.42,.72,'short band')},
    ()=>{widen(A,PX[0]);widen(B,PX[1]);A.cnt.textContent='long band: '+dbl(R,.05,.95)+' double crossovers';B.cnt.textContent='long band: '+dbl(I,.05,.95)+' double crossovers'},
  ];}},

/* 25 ─────────────────────────────── */
{sec:'11.2',title:'What Genetic Maps Are For',caption:'M1 to M5 = genes already on the map · n = a new mutant gene',
text:`<p data-step="0">To map a new gene, a geneticist needs only two of its alleles. An example is the wild-type allele and a mutant allele.</p>
<p data-step="1">Crosses with genes already on the map give RFs. The RFs place the new gene between two mapped genes. The new gene n is 3&nbsp;cM from M2 and 5&nbsp;cM from M3.</p>
<p data-step="2">Geneticists then search the DNA between the two mapped genes for the new gene. Geneticists call this method <b>map-based cloning</b>. The method finds and isolates the DNA of a gene from its map position.</p>
<p data-step="3">Genetic maps also help breeders follow useful alleles in crops and farm animals. They help biologists compare species. They help medical researchers find genes that affect the risk of a disease.</p>`,
star:'Map position first, then the DNA.',starStep:2,
scene(H){const s=ST();const k=11.5,x0=60,y=96;const X=v=>x0+v*k;
  const R=ruler(s,x0,y,k,[[0,'M1'],[12,'M2'],[20,'M3'],[33,'M4'],[45,'M5']],{fmt:v=>v+' cM'});
  const n=tg(s,0,0,'n',{r:13,c:'mom'});H.T(n,{x:320,y:40},{d:0});fade(n);
  const nl=H.txt(s,345,45,'new mutant gene','lb',{st:'fill:var(--mom)'});fade(nl);
  const b1=brace(s,X(12),X(15),y+50,'3',{c:'mom',st:'fill:var(--mom)'}),b2=brace(s,X(15),X(20),y+50,'5',{c:'mom',st:'fill:var(--mom)'});[b1,b2].forEach(fade);
  const Z=H.g(s);H.E('path',{d:`M${X(12)},${y+74} L60,220 L580,220 L${X(20)},${y+74} Z`,st:'fill:var(--wash);stroke:var(--faint);stroke-width:1.5'},Z);
  H.E('rect',{x:60,y:220,width:520,height:34,rx:6,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.8'},Z);
  [[80,40],[140,30],[196,50],[270,36],[330,44],[395,30],[450,46],[520,40]].forEach(([x,w],i)=>{H.E('rect',{x,y:226,width:w,height:22,rx:4,st:`fill:${i===4?'var(--mom)':'var(--faint)'}`},Z)});
  H.txt(Z,352,276,'gene n','lb',mid({st:'fill:var(--mom)'}));H.txt(Z,60,206,'DNA BETWEEN M2 AND M3','cap');fade(Z);
  const uses=[['Breeding','follow useful alleles'],['Evolution','compare species'],['Medicine','find disease genes']].map(([a,b],i)=>{const G=H.g(s);const x=36+i*196;
    H.E('rect',{x,y:310,width:180,height:66,rx:10,cls:'card',st:'stroke:var(--ink);stroke-width:1.5'},G);H.txt(G,x+90,338,a,'lb',mid({st:'font-size:16px'}));H.txt(G,x+90,360,b,'lbs',MID);fade(G);return G});
  return [
    ()=>{R.show(900);H.O([n,nl],1,{at:900})},
    ()=>{H.O(nl,0,{d:300});H.T(n,{x:X(15),y:y-36},{d:1100});H.O(b1,1,{at:900});H.O(b2,1,{at:1100})},
    ()=>{H.O(Z,1,{d:900})},
    ()=>{uses.forEach((u,i)=>H.O(u,1,{at:i*250}))},
  ];}},

/* 26 ─────────────────────────────── */
{sec:'11.2',title:'Conserved Synteny',caption:'Left: real map data, Beldade and colleagues (2009), PLOS Genetics, CC BY · left column = silkmoth, right column = butterfly · right: model',
text:`<p data-step="0">Related species often have the same genes in the same order on a chromosome. Biologists call the shared order <b>conserved synteny</b>.</p>
<p data-step="0">The real data compare one chromosome of the silkmoth <i>Bombyx mori</i> with one chromosome of the butterfly <i>Bicyclus anynana</i>. Each thin line joins the same gene in the two species.</p>
<p data-step="1">Shared gene order is the result of common descent. Both species inherited chromosome segments from a common ancestor.</p>
<p data-step="2">A segment stays intact unless a rare chromosome rearrangement changes it. An <b>inversion</b> turns a segment around, so the lines between species cross.</p>
<p data-step="3">Humans and mice share many such blocks. For example, most genes of human chromosome 17 sit together on mouse chromosome 11.</p>`,
star:'Same genes, same order: inherited from a common ancestor.',starStep:1,
scene(H){const s=ST();const ih=396,iw=406*ih/790;
  const img=H.g(s);H.E('rect',{x:10,y:12,width:iw+8,height:ih,rx:6,st:'fill:#fff;stroke:var(--ink);stroke-width:1.5'},img);H.E('image',{href:'@@asset:c11-synteny-lg10.jpg@@',x:14,y:12,width:iw,height:ih},img);fade(img);
  const blk=H.E('rect',{x:16,y:296,width:iw-4,height:66,rx:6,st:'fill:none;stroke:var(--hi);stroke-width:4;opacity:0'},s);
  const x0=262,x1=622,n=6,X=i=>x0+28+i*((x1-x0-56)/(n-1));const YA=56,Y1=170,Y2=262;
  const anc=H.g(s);H.txt(anc,x0,YA-24,'COMMON ANCESTOR','cap');piece(anc,x0,x1,'muted',[],{y:YA});fade(anc);
  const sp1=H.g(s);H.txt(sp1,x0,Y1-24,'SPECIES 1','cap');piece(sp1,x0,x1,'dad',[],{y:Y1});fade(sp1);
  const sp2=H.g(s);H.txt(sp2,x0,Y2+34,'SPECIES 2','cap');piece(sp2,x0,x1,'mom',[],{y:Y2});fade(sp2);
  const lbl=['1','2','3','4','5','6'];const ord2=[0,1,4,3,2,5];
  const links=lbl.map((l,i)=>H.E('path',{d:`M${X(i)},${Y1+12} L${X(i)},${Y2-12}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--muted);stroke-width:1.8'},s));
  const inl=[2,3,4].map(i=>H.E('path',{d:`M${X(i)},${Y1+12} L${X(ord2.indexOf(i))},${Y2-12}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--bad);stroke-width:1.8'},s));
  const mk=y=>lbl.map((l,i)=>{const g=tg(s,0,0,l,{r:11,c:'ink'});H.T(g,{x:X(i),y},{d:0});fade(g);return g});
  const t0=mk(YA),t1=mk(YA),t2=mk(YA);
  const inv=brace(s,X(2)-14,X(4)+14,Y2+20,'inversion',{c:'bad',st:'fill:var(--bad)'});fade(inv);inv.t.setAttribute('x',X(3)+90);
  const a1=mkA(s,x0+180,YA+16,x0+180,Y1-30,{w:1.8,h:7});
  const hm=H.g(s);H.txt(hm,x0,334,'HUMAN AND MOUSE','cap');
  [[352,'human chromosome 17',0,1],[384,'mouse chromosome 11',.18,.95]].forEach(([y,t,a,b])=>{H.E('line',{x1:x0+150,y1:y,x2:x1,y2:y,st:'stroke:var(--faint);stroke-width:12;stroke-linecap:round'},hm);
    H.E('line',{x1:x0+150+a*(x1-x0-150),y1:y,x2:x0+150+b*(x1-x0-150),y2:y,st:'stroke:var(--hi);stroke-width:12;stroke-linecap:round'},hm);H.txt(hm,x0+140,y+5,t,'lbs',END)});fade(hm);
  return [
    ()=>{H.O(img,1,{d:800});blk.style.transitionDelay='900ms';blk.style.opacity=1},
    ()=>{H.O(anc,1);t0.forEach((t,i)=>H.O(t,1,{at:i*80}));H.O([sp1,sp2],1,{at:500});drawA(a1,{at:400});
      t1.forEach(t=>{H.O(t,1,{d:200,at:700});H.T(t,{y:Y1},{d:1200,at:700})});t2.forEach(t=>{H.O(t,1,{d:200,at:700});H.T(t,{y:Y2},{d:1200,at:700})});H.D(links,1,{d:900,at:1700})},
    ()=>{t2.forEach((t,i)=>H.T(t,{x:X(ord2.indexOf(i))},{d:1100}));[2,3,4].forEach(i=>H.O(links[i],0,{d:300}));H.D(inl,1,{d:900,at:900});H.O(inv,1,{at:1300})},
    ()=>{H.O(hm,1)},
  ];}},

/* 27 ─────────────────────────────── */
{sec:'11.2',title:'Genetic Map Meets DNA Sequence',caption:'top: model chromosome · bottom: relative lengths of the human genetic map from egg cells and from sperm',
text:`<p data-step="0">Today, geneticists can read the DNA sequence of a whole genome. A <b>physical map</b> gives each gene’s position in base pairs.</p>
<p data-step="1">The genetic map and the physical map show the same gene order. The distances do not scale evenly. In humans, 1&nbsp;cM is on average about 1 million base pairs (1&nbsp;Mb). In the small plant <i>Arabidopsis</i>, it is about 150,000 to 250,000 base pairs.</p>
<p data-step="2">Crossovers cluster in short <b>hotspots</b>, each about 1,000 to 2,000 base pairs long. In humans, a protein called PRDM9 binds a short DNA sequence and marks many hotspots. Near centromeres and in tightly packed DNA (<b>heterochromatin</b>), crossovers are rare.</p>
<p data-step="3">In humans, the map from egg cells is about 1.6 times longer than the map from sperm. Male fruit flies make no crossovers at all.</p>`,
star:'Same order, different spacing.',starStep:1,
scene(H){const s=ST();const yg=86,yp=236;const gx=[60,150,200,240,420,580],px=[60,130,330,450,490,580];
  const top=H.g(s);H.txt(top,60,52,'GENETIC MAP (CENTIMORGANS)','cap');H.E('line',{x1:60,y1:yg,x2:580,y2:yg,st:'stroke:var(--dad);stroke-width:6;stroke-linecap:round'},top);
  const bot=H.g(s);H.txt(bot,60,yp+46,'DNA SEQUENCE (BASE PAIRS)','cap');H.E('line',{x1:60,y1:yp,x2:580,y2:yp,st:'stroke:var(--ink);stroke-width:6;stroke-linecap:round'},bot);
  const cen=H.g(bot);H.E('ellipse',{cx:250,cy:yp,rx:16,ry:9,st:'fill:var(--ink)'},cen);H.txt(cen,250,yp-16,'centromere','lbs',MID);
  const L=['g1','g2','g3','g4','g5','g6'];
  const gt=gx.map((x,i)=>{const g=H.g(s);H.E('line',{x1:x,y1:yg-10,x2:x,y2:yg+10,st:'stroke:var(--ink);stroke-width:2.5'},g);H.txt(g,x,yg-16,L[i],'lb',MID);return g});
  const pt=px.map((x,i)=>{const g=H.g(s);H.E('line',{x1:x,y1:yp-10,x2:x,y2:yp+10,st:'stroke:var(--ink);stroke-width:2.5'},g);H.txt(g,x,yp+26,L[i],'lb',MID);return g});
  const links=gx.map((x,i)=>H.E('path',{d:`M${x},${yg+12} L${px[i]},${yp-12}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--muted);stroke-width:1.6'},s));
  [top,bot].forEach(fade);
  const hot=H.g(s);[455,462,470,478,484].forEach((x,i)=>H.E('line',{x1:x,y1:yp-12,x2:x,y2:yp-26-(i%2)*8,st:'stroke:var(--bad);stroke-width:2.5;stroke-linecap:round'},hot));
  H.E('rect',{x:240,y:yg-12,width:180,height:24,rx:5,st:'fill:var(--bad);opacity:.12'},hot);H.txt(hot,330,yg+32,'hotspot: many cM in little DNA','lb',mid({st:'fill:var(--bad);font-size:13px'}));
  H.E('rect',{x:130,y:yp-12,width:320,height:24,rx:5,st:'fill:var(--muted);opacity:.15'},hot);H.txt(hot,290,yp+66,'near the centromere: much DNA, few cM','lbs',MID);fade(hot);
  const sex=H.g(s);const k=.085;H.txt(sex,60,322,'HUMAN GENETIC MAP, WHOLE GENOME (RELATIVE LENGTH)','cap');
  const fb=hbar(sex,150,346,18,'mom'),mb=hbar(sex,150,374,18,'dad');H.txt(sex,140,351,'from egg cells','lbs',END);H.txt(sex,140,379,'from sperm','lbs',END);
  const fv=H.txt(sex,150+4140*k+8,351,'≈ 1.6 ×','lb'),mv=H.txt(sex,150+2590*k+8,379,'1 ×','lb');fade(sex);
  return [
    ()=>{H.O(top,1);H.O(bot,1,{at:300})},
    ()=>{H.D(links,1,{d:900})},
    ()=>{H.O(hot,1)},
    ()=>{H.O(sex,1);H.T(fb,{sx:4140*k},{d:1000,at:300});H.T(mb,{sx:2590*k},{d:1000,at:300})},
  ];}},

/* 28 ─────────────────────────────── */
{sec:'11.3',title:'How to Solve a Three-Point Cross',wide:true,steps:4,
text:`<div class="tblwrap"><table class="tbl">
<thead><tr><th>Step</th><th>What to do</th><th>Mouse example (120 offspring)</th></tr></thead>
<tbody data-step="0">
<tr><td>1. Read the gametes</td><td>In a test cross, each offspring phenotype shows the gamete from the trihybrid.</td><td>short tail, brown, long whiskers → a&nbsp;B&nbsp;C</td></tr>
<tr><td>2. Find the parentals</td><td>The largest pair of reciprocal classes.</td><td>aBc 42 + AbC 38 = 80</td></tr>
<tr><td>3. Find the double crossovers</td><td>The smallest pair of reciprocal classes.</td><td>ABc 1 + abC 1 = 2</td></tr>
</tbody><tbody data-step="1">
<tr><td>4. Find the middle gene</td><td>Compare a double crossover with the parental it most resembles. The one gene that differs is in the middle.</td><td>aBc → ABc: only A differs → order B–⁠A–⁠C</td></tr>
<tr><td>5. Rewrite in order</td><td>Write every class in the new gene order.</td><td>parentals B&nbsp;a&nbsp;c and b&nbsp;A&nbsp;C</td></tr>
</tbody><tbody data-step="2">
<tr><td>6. RF of each region</td><td>(single crossovers in that region + all double crossovers) ÷ total.</td><td>B–⁠A: (28 + 2) ÷ 120 = 25%; A–⁠C: (10 + 2) ÷ 120 = 10%</td></tr>
<tr><td>7. Draw the map</td><td>Add the two regions for the outer distance.</td><td>B at 0, A at 25, C at 35&nbsp;cM; B–⁠C = 25 + 10 = 35&nbsp;cM</td></tr>
</tbody><tbody data-step="3">
<tr><td>8. Coincidence</td><td>observed double crossovers ÷ (RF of region I × RF of region II × total).</td><td>2 ÷ (0.25 × 0.10 × 120) = 2 ÷ 3 = 0.67</td></tr>
<tr><td>9. Interference</td><td>1 − coefficient of coincidence.</td><td>1 − 0.67 = 0.33</td></tr>
</tbody></table></div>`,
star:'Largest pair = parentals, smallest pair = double crossovers, odd gene out = middle gene.',starStep:3},

/* 29 ─────────────────────────────── */
{sec:'11.5',title:'Summary',wide:true,steps:2,
text:`<div class="cols" data-step="0"><div><h3>Maps from crossovers</h3><ul>
<li>A genetic map (linkage map, recombination map) shows the order of genes on a chromosome and the distances between them. Crossover frequencies give the distances.</li>
<li>A crossover falls between two genes more often when they are far apart. So the RF grows with distance, and RFs can build a map.</li>
<li>1&nbsp;cM (1 map unit) = 1% recombinant offspring. One crossover makes only 2 recombinant chromatids out of 4, so the RF never passes 50%.</li>
<li>Syntenic genes share a chromosome. Linked genes give an RF below 50%, and unlinked genes give an RF of 50%.</li>
</ul></div><div><h3>Limits and corrections</h3><ul>
<li>Double crossovers leave the outer genes parental. So RF underestimates long distances. Map long distances in short steps and add them.</li>
<li>A three-point cross finds the gene order and both distances in one experiment. The cross also detects double crossovers between the two outer genes.</li>
<li>Interference: one crossover makes another nearby less likely. Interference = 1 − (observed ÷ expected double crossovers).</li>
</ul></div></div>
<div class="cols" data-step="1"><div><h3>Genome view</h3><ul>
<li>SPO11 cuts the DNA in meiosis, and a few repairs become crossovers. Their spacing and number set the map.</li>
<li>Genetic maps and DNA sequence give the same gene order. The number of base pairs in 1&nbsp;cM varies with hotspots, centromeres and sex.</li>
</ul></div><div><h3>History</h3><ul>
<li>Morgan’s fly lab linked genes to chromosomes. Sturtevant, an undergraduate, drew the first genetic map (1911, published 1913). Haldane named the unit after Morgan in 1919.</li>
</ul></div></div>`},

/* 30 ─────────────────────────────── */
{sec:'11.6',title:'Key Terms · Maps and Crosses',wide:true,steps:1,
text:`<div class="terms">
<div class="term"><b>genetic map</b>The order of genes on a chromosome and the distances between them, measured by recombination. Also linkage map or recombination map.</div>
<div class="term"><b>map unit (m.u.)</b>The unit of map distance: 1&nbsp;m.u. = 1% recombinant offspring.</div>
<div class="term"><b>centimorgan (cM)</b>Another name for the map unit. 100&nbsp;cM = 1 morgan.</div>
<div class="term"><b>recombination frequency (RF)</b>Recombinant offspring ÷ total offspring × 100%.</div>
<div class="term"><b>parentals</b>Gametes or offspring with an allele combination of one parental homolog.</div>
<div class="term"><b>recombinants</b>Gametes or offspring with a new allele combination, made by a crossover.</div>
<div class="term"><b>linked</b>On the same chromosome and close enough that the RF is below 50%.</div>
<div class="term"><b>unlinked</b>RF = 50%: on different chromosomes, or far apart on one chromosome.</div>
<div class="term"><b>independent assortment</b>Alleles of different genes enter gametes independently. For two genes, the result is four equal gamete types and RF = 50%.</div>
<div class="term"><b>test cross · tester</b>A cross of an individual with a tester. A tester is homozygous recessive at every gene that the cross follows.</div>
<div class="term"><b>cis · trans</b>Two dominant alleles on the same homolog · on different homologs.</div>
</div>`},

/* 31 ─────────────────────────────── */
{sec:'11.6',title:'Key Terms · Synteny, Crossovers and People',wide:true,steps:1,
text:`<div class="terms">
<div class="term"><b>syntenic</b>On the same chromosome.</div>
<div class="term"><b>non-syntenic</b>On different chromosomes.</div>
<div class="term"><b>conserved synteny</b>The same genes in the same order on a chromosome of two related species.</div>
<div class="term"><b>double crossover</b>Two crossovers between two genes. The outer genes keep their parental combination; only a middle gene switches.</div>
<div class="term"><b>three-point cross</b>A test cross of a trihybrid that gives the order and the distances of three linked genes.</div>
<div class="term"><b>coefficient of coincidence</b>Observed double crossovers ÷ expected double crossovers.</div>
<div class="term"><b>interference</b>The degree to which one crossover prevents others nearby. Interference = 1 − coefficient of coincidence.</div>
<div class="term"><b>map-based cloning</b>A method that finds and isolates the DNA of a gene from its position on the genetic map.</div>
<div class="term"><b>linkage group</b>A set of genes that are linked to each other. Usually one per chromosome.</div>
<div class="term"><b>Thomas Hunt Morgan</b>American biologist (1866–1945). His fruit-fly lab linked genes to chromosomes. Nobel Prize 1933.</div>
<div class="term"><b>Alfred Sturtevant</b>American geneticist (1891–1970). As an undergraduate in Morgan’s lab, he made the first genetic map.</div>
</div>`},

/* 32 ─────────────────────────────── */
{sec:'11.7',title:'Check Your Understanding · 1',wide:true,steps:1,
text:`<div class="grid2">
<div class="qa"><div class="q">1. In corn, resistance to a pathogen (a microbe that causes disease) is recessive (r). Short tassels (the male flower spikes at the top of the plant) are recessive (t). The two genes are linked. Design crosses to find the map distance. Give the phenotypes at each stage, and name the recombinants.</div><button>Show answer</button><div class="a" hidden>P: cross two pure-breeding lines, RRtt (sensitive, short tassels) × rrTT (resistant, long tassels).<br>F1: RrTt (sensitive, long tassels), with R t on one homolog and r T on the other.<br>Test cross: F1 × rrtt (resistant, short tassels). Expose the offspring to the pathogen to record resistance.<br>Parentals: Rrtt (sensitive, short) and rrTt (resistant, long).<br>Recombinants: RrTt (sensitive, long) and rrtt (resistant, short).<br>Map distance in cM = recombinants ÷ total × 100.</div></div>
<div class="qa"><div class="q">2. In fruit flies, a recessive mutation (m) stops flies from learning that a scent means food. Another fly line has an autosomal recessive mutation for orange eyes (e). Design crosses to find the map distance, and name the recombinants.</div><button>Show answer</button><div class="a" hidden>P: MMEE (red eyes, learns) × mmee (orange eyes, cannot learn).<br>F1: MmEe (red eyes, learns), with M E on one homolog and m e on the other.<br>Test cross: F1 <b>females</b> × mmee males. Male fruit flies make no crossovers, so the heterozygote must be the female.<br>Parentals: MmEe (red, learns) and mmee (orange, cannot learn).<br>Recombinants: Mmee (orange eyes, learns) and mmEe (red eyes, cannot learn).<br>Test each offspring for eye colour and for learning. RF = recombinants ÷ total × 100. If RF = 50%, the genes are unlinked.</div></div>
<div class="qa"><div class="q">3. In <i>Arabidopsis</i>, three recessive mutations sit on one chromosome. They cause a need for the amino acid methionine (m), loss of chlorophyll (c) and no leaf hairs (h). You have a triple mutant. How do you find the gene order?</div><button>Show answer</button><div class="a" hidden>Cross the triple mutant mmcchh with a wild type MMCCHH. The F1 is a trihybrid with M C H on one homolog and m c h on the other.<br>Test-cross the F1 with the triple mutant. Record every offspring’s phenotype for all three traits (growth without added methionine, green colour, leaf hairs).<br>The two largest classes are the parentals, M C H and m c h. The two smallest classes are the double crossovers.<br>Compare a double crossover with a parental. The one gene that differs is in the middle. For example, suppose that the rarest classes are m C H and M c h. Then gene m is in the middle, and the order is C–⁠M–⁠H.</div></div>
</div>`},

/* 33 ─────────────────────────────── */
{sec:'11.7',title:'Check Your Understanding · 2',wide:true,steps:1,
text:`<div class="grid2">
<div class="qa"><div class="q">4. Three genes are linked in the order B–⁠C–⁠A. The A–⁠B distance is 1&nbsp;cM, and the B–⁠C distance is 0.6&nbsp;cM. One parent of the trihybrid AaBbCc was AABBCC. Cross the trihybrid with aabbcc. What fraction of the offspring is Aabb?</div><button>Show answer</button><div class="a" hidden>The trihybrid got A&nbsp;B&nbsp;C from the AABBCC parent, so its other homolog is a&nbsp;b&nbsp;c.<br>An Aabb offspring got A and b from the trihybrid. A with b is a recombinant combination for genes A and B. (The C allele does not matter.)<br>RF(A, B) = 1%, split equally between the two recombinants, A b and a B.<br>So Aabb = 1% ÷ 2 = <b>0.5%</b> of the offspring.</div></div>
<div class="qa"><div class="q">5. In flies, B (black body) is dominant to b (yellow body). C (straight wings) is dominant to c (curved wings). Cross a yellow fly with a curved-wing fly, then test-cross the F1. The offspring are: black straight 17, yellow curved 12, black curved 337, yellow straight 364. (a) Find the B–⁠C map distance. (b) Why are the two smallest classes not equal?</div><button>Show answer</button><div class="a" hidden>(a) The F1 is Bb Cc in trans: b C from the yellow parent and B c from the curved parent. So the parentals are black curved and yellow straight. The recombinants are black straight and yellow curved.<br>Total = 17 + 12 + 337 + 364 = 730. RF = (17 + 12) ÷ 730 = 29 ÷ 730 = 4.0%. Distance = <b>4&nbsp;cM</b>.<br>(b) Chance. The two recombinant gametes form in equal numbers on average, about 14.5 each here. Each count is a random sample, so 17 and 12 differ by chance. For the same reason, many families do not have equal numbers of boys and girls.</div></div>
<div class="qa"><div class="q">6. Use the distance from question 5. Cross a yellow, curved-wing double mutant with a wild-type fly, then test-cross the F1. Which phenotypes appear, and in which proportions?</div><button>Show answer</button><div class="a" hidden>The F1 is in cis: B C from the wild type and b c from the double mutant.<br>Parentals (96% in all): black straight about 48%, yellow curved about 48%.<br>Recombinants (4% in all): black curved about 2%, yellow straight about 2%.<br>The heterozygous F1 must be the female, because male fruit flies make no crossovers.</div></div>
</div>`},

/* 34 ─────────────────────────────── */
{sec:'11.7',title:'Check Your Understanding · 3',wide:true,steps:1,
text:`<div class="qa"><div class="q">7. Wild-type mice have brown fur, short tails and normal behaviour. Recessive loss-of-function alleles give white fur (a), long tails (b) and agitated behaviour (c). Cross a wild-type mouse with a triple mutant, then test-cross the F1. Make a genetic map from the offspring counts.
<div class="tblwrap"><table class="tbl" style="margin-top:6px;font-weight:400"><thead><tr><th>Fur, tail, behaviour</th><th>Number</th><th>Fur, tail, behaviour</th><th>Number</th></tr></thead><tbody>
<tr><td>white, short, normal</td><td>16</td><td>white, long, normal</td><td>0</td></tr>
<tr><td>brown, short, agitated</td><td>0</td><td>brown, long, agitated</td><td>14</td></tr>
<tr><td>brown, short, normal</td><td>955</td><td>brown, long, normal</td><td>46</td></tr>
<tr><td>white, short, agitated</td><td>36</td><td>white, long, agitated</td><td>933</td></tr>
</tbody></table></div></div><button>Show answer</button><div class="a" hidden>
<div class="cols" style="gap:18px"><div class="tblwrap"><table class="tbl"><thead><tr><th>Gamete</th><th>Number</th><th>A–⁠B</th><th>A–⁠C</th><th>B–⁠C</th></tr></thead><tbody>
<tr><td>A B C</td><td>955</td><td></td><td></td><td></td></tr>
<tr><td>a b c</td><td>933</td><td></td><td></td><td></td></tr>
<tr><td>A b C</td><td>46</td><td>R</td><td></td><td>R</td></tr>
<tr><td>a B c</td><td>36</td><td>R</td><td></td><td>R</td></tr>
<tr><td>a B C</td><td>16</td><td>R</td><td>R</td><td></td></tr>
<tr><td>A b c</td><td>14</td><td>R</td><td>R</td><td></td></tr>
<tr><td>A B c</td><td>0</td><td></td><td>R</td><td>R</td></tr>
<tr><td>a b C</td><td>0</td><td></td><td>R</td><td>R</td></tr>
</tbody></table></div>
<div style="display:flex;flex-direction:column;gap:8px"><p>Gene A = fur (A brown, a white), B = tail (B short, b long), C = behaviour (C normal, c agitated). The F1 got A&nbsp;B&nbsp;C from the wild type and a&nbsp;b&nbsp;c from the triple mutant. Total = 2000. R = recombinant for that pair.</p>
<p>A–⁠B: (46 + 36 + 16 + 14) ÷ 2000 = 112 ÷ 2000 = 5.6%. A–⁠C: (16 + 14) ÷ 2000 = 30 ÷ 2000 = 1.5%. B–⁠C: (46 + 36) ÷ 2000 = 82 ÷ 2000 = 4.1%.</p>
<p>A–⁠B is the largest, so C is in the middle. The double-crossover classes, A&nbsp;B&nbsp;c and a&nbsp;b&nbsp;C, have 0 offspring. Map: B, then C 4.1&nbsp;cM away, then A 1.5&nbsp;cM further. Check: 4.1 + 1.5 = 5.6.</p>
<p>Extra: expected double crossovers = 0.041 × 0.015 × 2000 = 1.23. Observed = 0. So the coefficient of coincidence = 0, and interference = 1.</p></div></div></div></div>
<style>#txt .qa .tbl td,#txt .qa .tbl th{padding:4px 8px}#txt .qa .a p{max-width:none}</style>`},

]});
})();
