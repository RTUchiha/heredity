/* Chapter 8 · Gene Interactions · source: Hairdity.pdf ch. 8 (Singh, Introduction to Genetics, CC BY-NC-SA 4.0) */
(function(){
const H0=window.HL;
/* ---- deck-local helpers ---- */
function drawA(a,o){H0.D(a.firstChild,1,Object.assign({d:600},o));H0.O(a.lastChild,1,Object.assign({d:200},o,{at:((o&&o.at)||0)+450}));}
function mkA(p,x1,y1,x2,y2,o){const a=H0.arrow(p,x1,y1,x2,y2,o);H0.O(a.lastChild,0,{d:0});return a;}
function pop(e,o){H0.T(e,{s:1},Object.assign({d:700},o));H0.O(e,1,Object.assign({d:300},o));}
function hide(e){H0.T(e,{s:.001},{d:0});H0.O(e,0,{d:0});}
const stage=()=>document.getElementById('stage');
function at(p,x,y,s){const G=H0.g(p);H0.T(G,{x,y,s:s==null?1:s},{d:0});return G;}
// tween any CSS paint (fill or stroke) to a raw CSS colour (allows color-mix)
function paint(e,prop,css,o){if(Array.isArray(e)){e.forEach(x=>paint(x,prop,css,o));return e}o=o||{};
  e.style.transitionDuration=(o.d!=null?o.d:600)+'ms';e.style.transitionDelay=(o.at||0)+'ms';e.style[prop]=css;return e;}
const fill=(e,c,o)=>paint(e,'fill',c,o);
// pigment colours: theme tokens, plus fixed hex only for real animal pigments
const NOPIG='var(--card)',PURPLE='color-mix(in srgb, var(--dad) 50%, var(--bad))',RED='var(--bad)',GRN='var(--good)',BLU='var(--dad)';
const YEL='color-mix(in srgb, var(--hi) 85%, var(--mom))',INK='var(--ink)',DARKTXT='#16181d',LIGHTTXT='#ffffff';
const DOG={blk:'color-mix(in srgb, #2a2421 80%, var(--ink))',choc:'#7b4526',yel:'#ecd08f'};
const TINT=['var(--dad-tint)','var(--mom-tint)','color-mix(in srgb, var(--good) 24%, var(--card))','var(--wash)'];
// text with ^x or ^{xy} superscripts and _x subscripts
function rt(p,x,y,s,cls,a){const t=H0.E('text',Object.assign({x,y,cls:cls||'lb'},a||{}),p);
  s.split(/(\^\{[^}]*\}|\^.|_\{[^}]*\})/).forEach(part=>{if(!part)return;
    if(part[0]==='^'||(part[0]==='_'&&part[1]==='{')){const v=part[1]==='{'?part.slice(2,-1):part.slice(1);
      H0.E('tspan',{'baseline-shift':part[0]==='^'?'super':'sub',st:'font-size:.68em',text:v},t);}
    else H0.E('tspan',{text:part},t);});return t;}
// enzyme glyph: a "pac-man" protein centred on 0,0
function enzyme(p,x,y,o){o=o||{};const r=o.r||10;const G=at(p,x,y);
  const a=28*Math.PI/180;G.body=H0.E('path',{d:`M0,0 L${r*Math.cos(a)},${-r*Math.sin(a)} A${r},${r} 0 1 0 ${r*Math.cos(a)},${r*Math.sin(a)} Z`,
    st:`fill:${o.fill||'var(--good)'};stroke:var(--ink);stroke-width:1.4;stroke-linejoin:round`},G);
  if(o.label)H0.txt(G,0,-r-5,o.label,'lb',{'text-anchor':'middle',st:'font-size:12.5px'});return G;}
// red X (drawn on)
function xmark(p,x,y,h,o){o=o||{};const G=H0.g(p);H0.E('path',{d:`M${x-h},${y-h} L${x+h},${y+h} M${x+h},${y-h} L${x-h},${y+h}`,pathLength:1,cls:'draw',st:`fill:none;stroke:var(--bad);stroke-width:${o.w||4};stroke-linecap:round`},G);return G;}
// rounded photo with border; href is an @@asset@@ token
let CLIPN=0;
function photo(p,href,x,y,w,h,o){o=o||{};const id='c8clp'+(++CLIPN);const G=H0.g(p);
  const cp=H0.E('clipPath',{id},G);H0.E('rect',{x,y,width:w,height:h,rx:o.r!=null?o.r:10},cp);
  H0.E('image',{href,x,y,width:w,height:h,preserveAspectRatio:o.fit||'xMidYMid slice','clip-path':`url(#${id})`},G);
  H0.E('rect',{x,y,width:w,height:h,rx:o.r!=null?o.r:10,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},G);return G;}
// dark label tag on top of a photo
function tag(p,x,y,t,o){o=o||{};const G=H0.g(p);const w=o.w||t.length*7.6+16;const bx=o.anchor==='end'?x-w:o.anchor==='middle'?x-w/2:x;
  H0.E('rect',{x:bx,y:y-15,width:w,height:22,rx:6,st:'fill:#16181d;opacity:.86'},G);rt(G,bx+w/2,y+1,t,'lb',{'text-anchor':'middle',st:'fill:#fff;font-size:13px'});return G;}
// small chromosome bar with an allele band
function chrom(p,x,y0,y1,color,o){o=o||{};const G=H0.g(p);const w=o.w||12;
  H0.E('line',{x1:x,y1:y0,x2:x,y2:y1,st:`stroke:${H0.C(color)};stroke-width:${w};stroke-linecap:round`},G);
  if(o.band!=null){const B=at(G,x,o.band);B.r=H0.E('rect',{x:-(w+10)/2,y:-9,width:w+10,height:18,rx:4,st:`fill:${o.bfill||'var(--hi)'};stroke:var(--ink);stroke-width:1.5`},B);
    B.t=rt(B,0,4.5,o.label||'','lb',{'text-anchor':'middle',st:'font-size:12px;fill:#16181d'});G.band=B;}
  return G;}
// pea seed: round or wrinkled
function pea(p,x,y,r,col,wr){const G=at(p,x,y);let d='';
  if(wr){const n=9;for(let i=0;i<=n*2;i++){const a=i/(n*2)*Math.PI*2,rr=i%2?r*.8:r;d+=(i?' L':'M')+(rr*Math.cos(a)).toFixed(1)+','+(rr*Math.sin(a)).toFixed(1)}d+=' Z'}
  else d=`M${-r},0 A${r},${r} 0 1 0 ${r},0 A${r},${r} 0 1 0 ${-r},0 Z`;
  G.b=H0.E('path',{d,st:`fill:${col};stroke:var(--ink);stroke-width:1.5;stroke-linejoin:round`},G);return G;}
// 5-petal flower, petals recolourable
function flower(p,x,y,r,col){const G=at(p,x,y);G.pet=[];for(let i=0;i<5;i++){
    const e=H0.E('ellipse',{cx:0,cy:-r*.52,rx:r*.36,ry:r*.52,st:`fill:${col||NOPIG};stroke:var(--ink);stroke-width:1.5`},G);e.setAttribute('transform',`rotate(${i*72})`);G.pet.push(e);}
  H0.E('circle',{r:r*.2,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.3'},G);return G;}

/* ---- the 16-box grid: cells move into a sorted column, and classes merge ---- */
function G16(p,o){const H=H0;o=Object.assign({x:60,y:140,cs:42,g:['A','B'],sq:16,gap:2,px:330,py:116,fs:11.5},o);
  const [A,B]=o.g,a=(o.lo||[])[0]||A.toLowerCase(),b=(o.lo||[])[1]||B.toLowerCase();
  const gm=[[1,1],[1,0],[0,1],[0,0]],gs=v=>(v[0]?A:a)+(v[1]?B:b);
  const R={cells:[],labs:[],o};const G=H.g(p);R.G=G;R.ghost=H.g(G);R.hdr=H.g(G);
  gm.forEach((v,i)=>{rt(R.hdr,o.x+i*o.cs+o.cs/2,o.y-8,gs(v),'lb',{'text-anchor':'middle',st:'fill:var(--mom);font-size:13px'});
    rt(R.hdr,o.x-7,o.y+i*o.cs+o.cs/2+4.5,gs(v),'lb',{'text-anchor':'end',st:'fill:var(--dad);font-size:13px'})});
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){const nA=gm[r][0]+gm[c][0],nB=gm[r][1]+gm[c][1];
    const geno=(nA==2?A+A:nA==1?A+a:a+a)+(nB==2?B+B:nB==1?B+b:b+b);const x=o.x+c*o.cs,y=o.y+r*o.cs;
    H.E('rect',{x:x+1,y:y+1,width:o.cs-2,height:o.cs-2,rx:4,st:'fill:none;stroke:var(--faint);stroke-width:1.2;stroke-dasharray:3 3'},R.ghost);
    rt(R.ghost,x+o.cs/2,y+o.cs/2+4,geno,'lbs',{'text-anchor':'middle',st:`font-size:${o.fs}px;opacity:.55`});
    const C=H.g(G);C.home=[x,y];H.T(C,{x,y},{d:0});
    C.r=H.E('rect',{x:1,y:1,width:o.cs-2,height:o.cs-2,rx:4,cls:'nss',st:'fill:var(--card);stroke:var(--ink);stroke-width:1.2'},C);
    C.t=rt(C,o.cs/2,o.cs/2+4,geno,'lbs',{'text-anchor':'middle',st:`fill:var(--ink);font-weight:600;font-size:${o.fs}px`});
    C.nA=nA;C.nB=nB;C.ci=(nA?0:2)+(nB?0:1);C.geno=geno;C.idx=r*4+c;R.cells.push(C);}
  R.keys=[A+'_'+B+'_',A+'_'+b+b,a+a+B+'_',a+a+b+b];
  H.O(R.hdr,0,{d:0});H.O(R.ghost,0,{d:0});R.cells.forEach(C=>H.O(C,0,{d:0}));
  R.show=()=>{H.O(R.hdr,1);H.O(R.ghost,1);R.cells.forEach((C,i)=>H.O(C,1,{d:250,at:150+i*55}))};
  // f(C) -> [fill, text colour]
  R.paint=(f,o2)=>{R.cells.forEach((C,i)=>{const [fc,tc]=f(C);fill(C.r,fc,{d:600,at:((o2&&o2.at)||0)+i*20});fill(C.t,tc||INK,{d:600,at:((o2&&o2.at)||0)+i*20})})};
  R.tint=o2=>R.paint(C=>[TINT[C.ci],INK],o2);
  // groups: [{cls:[0], n:'9', name:'E_B_', sub:'', col}] in column order
  R.col=(groups,o2)=>{o2=o2||{};const at0=o2.at||0;R.labs.forEach(l=>H.O(l,0,{d:300}));R.labs=[];
    const st=o.sq+o.gap,k=o.sq/o.cs;let i=0;
    groups.forEach(gp=>{const i0=i;
      gp.cls.forEach(ci=>R.cells.filter(C=>C.ci===ci).forEach(C=>{H.T(C,{x:o.px,y:o.py+i*st,s:k},{d:1000,at:at0+i*25});H.O(C.t,0,{d:250,at:at0});i++}));
      const y0=o.py+i0*st,y1=o.py+i*st-o.gap,xm=o.px+o.sq+6,ym=(y0+y1)/2;const L=H.g(G);
      H.E('path',{d:`M${xm},${y0+1} L${xm+5},${y0+1} L${xm+5},${y1-1} L${xm},${y1-1}`,st:'fill:none;stroke:var(--ink);stroke-width:1.6'},L);
      const two=gp.sub&&(y1-y0)>=34;
      const t=H.txt(L,xm+13,ym+(two?-2:5),'','lb',{st:'font-size:15px'});H.E('tspan',{text:gp.n+'  ',st:'font:900 17px var(--f-display)'},t);
      H.E('tspan',{text:gp.name,st:gp.col?`fill:${gp.col}`:''},t);
      if(gp.sub)H.txt(L,xm+13+(two?0:0),ym+(two?15:20),gp.sub,'lbs',two?{}:{st:'opacity:0'});
      H.O(L,0,{d:0});H.O(L,1,{d:500,at:at0+700});R.labs.push(L)});};
  return R;}
// big ratio readout
function ratioTxt(p,x,y,anchor){const t=H0.txt(p,x,y,'','big',{'text-anchor':anchor||'middle',st:'font-size:30px'});return t;}

deck({
docTitle:'Gene Interactions · Heredity Ch.8',
title:'Gene Interactions',
chapter:8,
eyebrow:'Heredity · Chapter 8 · Gene Interactions',
slides:[

/* 1 ─────────────────────────────── */
{sec:'8.1',title:'Gene Interactions',caption:'Model of two genes for one trait · after a drawing by Thomas Shafee, CC BY 4.0',
text:`<p data-step="0">A trait often depends on more than one gene. A <b>locus</b> (plural <b>loci</b>) is the position of a gene on a chromosome. <b>Gene interaction</b> is the effect of the alleles at one locus on the trait that another locus controls.</p>
<p data-step="1">Model: one gene sets the hair colour, blond or red. A second gene is necessary for hair growth.</p>
<p data-step="2">A person who cannot grow hair is bald with any hair-colour alleles. So the hair-growth gene hides the hair-colour gene.</p>
<p data-step="3">When the alleles of one gene hide the effect of another gene, the interaction is <b>epistasis</b> (Greek: "standing upon"). In <b>recessive epistasis</b>, the allele that hides is recessive. In <b>dominant epistasis</b>, it is dominant.</p>
<p data-step="4">Two genes can give four phenotype classes. With epistasis, two or more classes look the same, so there are fewer phenotypes.</p>`,
star:'Epistasis: one gene stands on another and hides it.',starStep:3,
scene(H){const s=stage();
  const head=(x,y,hc)=>{const G=at(s,x,y);
    [-1,1].forEach(k=>H.E('ellipse',{cx:k*45,cy:8,rx:9,ry:14,st:'fill:var(--card);stroke:var(--ink);stroke-width:2.5'},G));
    H.E('path',{d:'M-42,-14 C-42,-66 42,-66 42,-14 L42,12 C42,42 20,60 0,60 C-20,60 -42,42 -42,12 Z',st:'fill:var(--card);stroke:var(--ink);stroke-width:2.5'},G);
    [-15,15].forEach(k=>H.E('circle',{cx:k,cy:4,r:3.4,cls:'kf'},G));H.E('path',{d:'M-9,32 L9,32',st:'stroke:var(--ink);stroke-width:2.5;stroke-linecap:round'},G);
    const hair=H.E('path',{d:'M-47,6 C-58,-76 58,-76 47,6 C42,-20 34,-28 26,-30 C10,-24 -14,-26 -30,-32 C-38,-24 -44,-12 -47,6 Z',st:`fill:${hc};stroke:var(--ink);stroke-width:2.5;stroke-linejoin:round`},G);
    hair.style.transformOrigin='0px -20px';H.T(hair,{sy:.001},{d:0});H.O(hair,0,{d:0});G.hair=hair;
    G.gh=H.E('path',{d:hair.getAttribute('d'),st:`fill:none;stroke:${hc};stroke-width:2.5;stroke-dasharray:5 5`},G);H.O(G.gh,0,{d:0});H.O(G,0,{d:0});return G};
  const BL='color-mix(in srgb, var(--hi) 90%, var(--card))',RD='color-mix(in srgb, var(--bad) 80%, var(--mom))';
  const cx=[300,500],cy=[120,300];
  const hd=H.g(s);[['blond allele',cx[0]],['red allele',cx[1]]].forEach(([t,x])=>H.txt(hd,x,32,t,'lb',{'text-anchor':'middle'}));
  H.txt(hd,400,14,'HAIR-COLOUR GENE','cap',{'text-anchor':'middle'});H.O(hd,0,{d:0});
  const rl=H.g(s);[['hair grows',cy[0]],['no hair growth',cy[1]]].forEach(([t,y],i)=>{H.txt(rl,20,y-4,t,'lb');H.txt(rl,20,y+14,i?'broken gene':'working gene','lbs')});
  H.txt(rl,20,cy[0]-44,'HAIR-GROWTH GENE','cap');H.O(rl,0,{d:0});
  const top=[head(cx[0],cy[0],BL),head(cx[1],cy[0],RD)],bot=[head(cx[0],cy[1],BL),head(cx[1],cy[1],RD)];
  const ph=[['blond',cx[0],cy[0]],['red',cx[1],cy[0]],['bald',cx[0],cy[1]],['bald',cx[1],cy[1]]].map(([t,x,y])=>{const e=H.txt(s,x,y+84,t,'lb',{'text-anchor':'middle'});H.O(e,0,{d:0});return e});
  const ghosts=bot.map((G,i)=>{const e=H.txt(s,cx[i],cy[1]+102,i?'red allele hidden':'blond allele hidden','lbs',{'text-anchor':'middle',st:'font-style:italic'});H.O(e,0,{d:0});return e});
  const msg=[H.txt(s,20,372,'','lb',{st:'fill:var(--bad)'}),H.txt(s,20,392,'','lb',{st:'fill:var(--bad)'})];
  return [
    ()=>{H.O(hd,1)},
    ()=>{H.O(rl,1);top.forEach((G,i)=>{H.O(G,1,{at:i*200});H.O(G.hair,1,{d:300,at:500+i*200});H.T(G.hair,{sy:1},{d:900,at:500+i*200});H.O(ph[i],1,{at:1100+i*200})})},
    ()=>{bot.forEach((G,i)=>{H.O(G,1,{at:i*200});H.O(G.gh,.7,{d:600,at:700+i*200});H.O(ghosts[i],1,{at:900+i*200});H.O(ph[2+i],1,{at:900+i*200})})},
    ()=>{msg[0].textContent='epistasis: the growth gene';msg[1].textContent='hides the colour gene'},
    ()=>{msg[0].textContent='4 combinations,';msg[1].textContent='only 3 phenotypes'},
  ];}},

/* 2 ─────────────────────────────── */
{sec:'8.1',title:'Genes Work in Pathways',caption:'Model pathway · green pac-man = working enzyme · one gene makes each enzyme',
text:`<p data-step="0">Most genes make a protein, and many proteins are <b>enzymes</b>. Each enzyme does one step in a chain of chemical reactions, a <b>pathway</b>.</p>
<p data-step="1">In this model, enzyme A changes a colourless starting compound (the <b>precursor</b>) into a colourless <b>intermediate</b>. Enzyme B changes the intermediate into purple pigment.</p>
<p data-step="2">Allele A makes enzyme A. Allele a makes no working enzyme A. In an aa plant, the pathway stops at the first step, so the flower is white. Enzyme B is present, but it gets no intermediate. So the B gene cannot change the flower colour.</p>
<p data-step="3">The phenotype of the B gene depends on the A gene. The usual reason for gene interaction is that the two genes act in the same pathway.</p>
<p data-step="4">A cross that follows two genes is a <b>dihybrid cross</b>. Different pathways give different ratios in a dihybrid cross. So a ratio is a clue to the pathway.</p>`,
star:'A broken early step hides every later step.',starStep:2,
scene(H){const s=stage();const Y=250;
  const cA=chrom(s,70,40,170,'dad',{band:90,label:'A',w:12}),cB=chrom(s,140,40,170,'mom',{band:110,label:'B',w:12});
  const gl=H.g(s);H.txt(gl,70,192,'gene A','lbs',{'text-anchor':'middle'});H.txt(gl,140,192,'gene B','lbs',{'text-anchor':'middle'});
  [cA,cB,gl].forEach(e=>H.O(e,0,{d:0}));
  const nodes=[[90,'precursor',NOPIG],[290,'intermediate',NOPIG],[490,'pigment',PURPLE]].map(([x,t,c])=>{const G=at(s,x,Y);
    G.c=H.E('circle',{r:26,st:`fill:${c};stroke:var(--ink);stroke-width:2`},G);H.txt(G,0,48,t,'lb',{'text-anchor':'middle'});
    H.txt(G,0,66,c===PURPLE?'purple':'colourless','lbs',{'text-anchor':'middle'});H.O(G,0,{d:0});return G});
  const ar=[mkA(s,122,Y,254,Y,{w:2.2}),mkA(s,322,Y,454,Y,{w:2.2})];
  const eA=enzyme(s,70,90,{r:13}),eB=enzyme(s,140,110,{r:13});[eA,eB].forEach(e=>H.O(e,0,{d:0}));
  const eL=[H.txt(s,188,Y-36,'enzyme A','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'}),H.txt(s,388,Y-36,'enzyme B','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'})];H.O(eL,0,{d:0});
  const fl=flower(s,580,110,46,NOPIG);H.O(fl,0,{d:0});const fll=H.txt(s,580,182,'','lb',{'text-anchor':'middle'});
  const gt=H.txt(s,580,40,'','mt',{'text-anchor':'middle',st:'font-size:22px'});
  const X=xmark(s,188,Y-16,11);const tok=H.E('circle',{r:9,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},s);H.O(tok,0,{d:0});
  const note=H.txt(s,388,Y+88,'','lb',{'text-anchor':'middle',st:'fill:var(--bad)'});
  const sum=H.g(s);H.E('rect',{x:24,y:356,width:592,height:34,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},sum);
  H.txt(sum,320,378,'A acts first, so aa hides the B gene: aa is epistatic to B','lb',{'text-anchor':'middle'});H.O(sum,0,{d:0});
  const hint=H.txt(s,320,414,'1 pathway, 2 genes → a new dihybrid ratio','lb',{'text-anchor':'middle',st:'fill:var(--dad)'});H.O(hint,0,{d:0});
  return [
    ()=>{[cA,cB,gl].forEach((e,i)=>H.O(e,1,{at:i*150}));H.O(eA,1,{at:500});H.O(eB,1,{at:600})},
    ()=>{nodes.forEach((G,i)=>H.O(G,1,{at:i*200}));ar.forEach((a,i)=>drawA(a,{at:200+i*200}));H.O(eL,1,{at:700});
      H.T(eA,{x:188,y:Y-16},{d:1100});H.T(eB,{x:388,y:Y-16},{d:1100,at:150});
      H.O(fl,1,{at:400});fill(fl.pet,PURPLE,{d:900,at:1500});fll.textContent='AA BB: purple';gt.textContent='';
      H.O(tok,1,{d:200,at:900});H.T(tok,{x:90,y:Y},{d:0});H.after(1000,inst=>{H.T(tok,{x:490},{d:inst?0:1400});H.after(inst?0:1400,()=>H.O(tok,0,{d:300}))})},
    ()=>{H.O(eA,0,{d:500});H.D(X.firstChild,1,{d:500,at:300});cA.band.t.textContent='a';fill(cA.band.r,RED);H.K(nodes[1].c,{fill:'card'});nodes[1].style.opacity=.35;nodes[2].style.opacity=.35;
      fill(nodes[2].c,NOPIG,{d:700});fill(fl.pet,NOPIG,{d:900,at:300});fll.textContent='aa BB: white';note.textContent='enzyme B waits: no intermediate'},
    ()=>{H.O(sum,1)},
    ()=>{H.O(hint,1,{at:200})},
  ];}},

/* 3 ─────────────────────────────── */
{sec:'8.2',title:'Mendel’s Second Law',caption:'Meiosis, simplified · blue = from the yellow round parent · orange = from the green wrinkled parent',
text:`<p data-step="0">The parents of a cross are the <b>P</b> (parental) generation. Their offspring are the <b>F1</b>, and the offspring of two F1 individuals are the <b>F2</b>.</p>
<p data-step="0">Mendel crossed true-breeding peas with yellow, round seeds and peas with green, wrinkled seeds. All F1 seeds were yellow and round. Each F1 plant was a <b>dihybrid</b>: heterozygous at two loci, <span class="m">Rr Yy</span>.</p>
<p data-step="1">The gene for seed shape (R) and the gene for seed colour (Y) are on different chromosomes. In meiosis I, each chromosome pair moves to the middle of the cell independently of the other pair.</p>
<p data-step="2">One orientation gives RY and ry gametes. The other orientation gives Ry and rY gametes.</p>
<p data-step="3">The two orientations are equally likely, so the dihybrid makes four kinds of gametes, 1/4 each. This behaviour is <b>independent assortment</b>. <b>Mendel's Second Law</b> states it: two loci assort independently during gamete formation.</p>`,
star:'Two chromosome pairs, two ways to line up, four kinds of gametes.',starStep:3,
scene(H){const s=stage();
  // top: the cross
  const top=H.g(s);const P1=pea(top,70,46,15,YEL,false),P2=pea(top,170,46,15,GRN,true);H.txt(top,120,51,'×','lb',{'text-anchor':'middle',st:'font-size:20px'});
  H.txt(top,70,82,'RR YY','lbs',{'text-anchor':'middle'});H.txt(top,170,82,'rr yy','lbs',{'text-anchor':'middle'});H.txt(top,22,51,'P','lb',{'text-anchor':'middle',st:'font-size:16px'});
  const ar0=mkA(top,212,46,262,46,{w:1.8,h:6});const F1=pea(top,300,46,15,YEL,false);H.txt(top,300,82,'Rr Yy','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});
  H.txt(top,342,51,'F1: all yellow, round','lb');H.O(top,0,{d:0});
  // two cells
  const C=[[170,222],[470,222]];const cells=C.map(([x,y],i)=>{const G=H.g(s);H.E('ellipse',{cx:x,cy:y,rx:118,ry:86,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},G);
    H.E('line',{x1:x,y1:y-74,x2:x,y2:y+74,st:'stroke:var(--muted);stroke-width:1.4;stroke-dasharray:4 4'},G);
    H.txt(G,x,y-96,i?'ORIENTATION 2':'ORIENTATION 1','cap',{'text-anchor':'middle'});H.O(G,0,{d:0});return G});
  const gam=C.map(([x,y],i)=>[-1,1].map(k=>{const G=H.g(s);H.E('circle',{cx:x+k*62,cy:y+150,r:24,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},G);
    H.O(G,0,{d:0});return G}));
  const mk=(x,y,col,L,lab)=>{const ch=H.chromosome(s,{L1:L,L2:L,w:7,color:col,state:'x',x,y});const t=H.txt(s,0,0,lab,'lb',{'text-anchor':'middle',st:'font-size:13px'});
    const G={ch,t,x,y};G.move=(nx,ny,o)=>{H.T(ch,{x:nx,y:ny},o);H.T(t,{x:nx,y:ny-L-6},o);G.x=nx;G.y=ny};G.move(x,y,{d:0});H.O(ch,0,{d:0});H.O(t,0,{d:0});return G};
  const sets=C.map(([x,y],i)=>{const L=[mk(x-16,y-30,'dad',22,'R'),mk(x+16,y-30,'mom',22,'r')];
    const S=i?[mk(x-16,y+36,'mom',14,'y'),mk(x+16,y+36,'dad',14,'Y')]:[mk(x-16,y+36,'dad',14,'Y'),mk(x+16,y+36,'mom',14,'y')];return {L,S}});
  const gl=C.map(([x,y],i)=>[-1,1].map(k=>{const lab=i?(k<0?'Ry':'rY'):(k<0?'RY':'ry');const t=H.txt(s,x+k*62,y+194,lab+' · 1/4','lb',{'text-anchor':'middle'});H.O(t,0,{d:0});return t}));
  const showSet=i=>{const S=sets[i];[...S.L,...S.S].forEach((g,j)=>{H.O(g.ch,1,{at:j*100});H.O(g.t,1,{at:j*100})})};
  const split=(i)=>{const [x,y]=C[i];H.O(cells[i],1);const S=sets[i];
    // pull each pair apart: left member goes to left gamete, right to right
    H.after(500,inst=>{const o={d:inst?0:1300};
      S.L[0].move(x-62-6,y+150-4,o);S.S[0].move(x-62+8,y+150+6,o);S.L[1].move(x+62-6,y+150-4,o);S.S[1].move(x+62+8,y+150+6,o);
      [...S.L,...S.S].forEach(g=>{H.T(g.ch,{s:.7},o);H.O(g.t,0,{d:300});H.after(inst?0:1300,()=>H.setChr(g.ch,'single',{d:inst?0:500}))});
      gam[i].forEach(G=>H.O(G,1,{d:600,at:inst?0:500}));H.O(cells[i],.3,{d:600,at:inst?0:1200});gl[i].forEach(t=>H.O(t,1,{d:500,at:inst?0:1200}))})};
  return [
    ()=>{H.O(top,1);drawA(ar0,{at:300})},
    ()=>{H.O(cells[0],1);showSet(0);H.O(cells[1],1,{at:300});showSet(1)},
    ()=>{split(0)},
    ()=>{split(1)},
  ];}},

/* 4 ─────────────────────────────── */
{sec:'8.2',title:'The 16-Box Grid: 9 : 3 : 3 : 1',caption:'Rows = gametes of one parent (blue) · columns = gametes of the other (orange) · each box = 1/16',
text:`<p data-step="0">Cross two dihybrids: <span class="m">Rr Yy × Rr Yy</span>. Each parent makes RY, Ry, rY and ry gametes, 1/4 each. The grid (a <b>Punnett square</b>) has 4 × 4 = 16 boxes, each with a probability of 1/16.</p>
<p data-step="1">A blank (_) means "either allele": R_ is RR or Rr. R and Y are completely dominant, so every R_ seed is round and every Y_ seed is yellow.</p>
<p data-step="2">Sort the boxes by phenotype: 9 round yellow, 3 round green, 3 wrinkled yellow and 1 wrinkled green. The ratio is <b>9 : 3 : 3 : 1</b>. Mendel counted 315 : 108 : 101 : 32, close to this ratio.</p>
<p data-step="3">The <b>product rule</b> gives the same result: the probability of two independent events is the product of their probabilities. 3/4 of the seeds are round and 3/4 are yellow, so 3/4 × 3/4 = 9/16 are round and yellow. Round green is 3/4 × 1/4 = 3/16. Wrinkled green is 1/4 × 1/4 = 1/16.</p>`,
star:'9 : 3 : 3 : 1 is (3 : 1) × (3 : 1).',starStep:3,
scene(H){const s=stage();
  const R=G16(s,{x:58,y:58,cs:44,g:['R','Y'],px:322,py:58,sq:17,gap:2});
  const peas=R.cells.map(C=>{const G=at(R.G,0,0);const p=pea(G,22,22,11,C.nB?YEL:GRN,!C.nA);C.appendChild(G);H.O(G,0,{d:0});return G});
  const prod=H.g(s);const y0=304;
  [['round × yellow','3/4 × 3/4','= 9/16'],['round × green','3/4 × 1/4','= 3/16'],['wrinkled × yellow','1/4 × 3/4','= 3/16'],['wrinkled × green','1/4 × 1/4','= 1/16']].forEach(([a,b,c],i)=>{
    H.txt(prod,40,y0+i*26,a,'lbs',{st:'fill:var(--ink);font-weight:600'});H.txt(prod,168,y0+i*26,b,'mt',{st:'font-size:16px'});H.txt(prod,236,y0+i*26,c,'mt',{st:'font-size:16px;fill:var(--dad)'})});
  H.O(prod,0,{d:0});
  return [
    ()=>{R.show()},
    ()=>{R.cells.forEach((C,i)=>{H.O(C.t,0,{d:300,at:i*30});H.O(peas[i],1,{d:400,at:200+i*30})})},
    ()=>{R.cells.forEach((C,i)=>{H.O(C.t,0,{d:0});H.O(peas[i],1,{d:0})});R.paint(C=>[TINT[C.ci],INK]);
      R.col([{cls:[0],n:'9',name:'round yellow',sub:'R_ Y_'},{cls:[1],n:'3',name:'round green',sub:'R_ yy'},{cls:[2],n:'3',name:'wrinkled yellow',sub:'rr Y_'},{cls:[3],n:'1',name:'wrinkled green',sub:'rr yy'}],{at:300})},
    ()=>{H.O(prod,1)},
  ];}},

/* 5 ─────────────────────────────── */
{sec:'8.2',title:'When 9 : 3 : 3 : 1 Changes',caption:'Each square = 1/16 of the offspring · linkage bar = share of each gamete type (example values)',
text:`<p data-step="0">The 9 : 3 : 3 : 1 ratio needs three conditions. (1) The two loci assort independently. (2) One allele at each locus is completely dominant. (3) The two genes do not interact, so all four phenotypes look different.</p>
<p data-step="1"><b>Linkage</b> breaks condition 1. Two loci close together on one chromosome usually go into the same gamete. Then the four gamete types are not 1/4 each.</p>
<p data-step="2">Incomplete dominance or codominance breaks condition 2. Heterozygotes then have their own phenotype, so the 16 boxes give as many as 9 classes.</p>
<p data-step="3">Gene interaction breaks condition 3. Some of the four classes look the same, so they merge.</p>
<p data-step="3">A ratio that differs from 9 : 3 : 3 : 1 is a <b>modified Mendelian ratio</b>. With gene interaction, each new class is a sum of the 9, 3, 3 and 1.</p>`,
star:'Linkage, incomplete dominance and gene interaction each break 9 : 3 : 3 : 1.',starStep:3,
scene(H){const s=stage();const X0=196,sq=24,gp=2.5;const rows=[66,166,266,366];
  const lab=(y,t,sub)=>{const G=H.g(s);H.txt(G,14,y-2,t,'lb',{st:'font-size:13.5px'});H.txt(G,14,y+15,sub,'lbs');H.O(G,0,{d:0});return G};
  const L=[lab(rows[0],'Mendel','independent, dominant'),lab(rows[1],'Linkage','condition 1 broken'),lab(rows[2],'Incomplete dominance','condition 2 broken'),lab(rows[3],'Gene interaction','condition 3 broken')];
  const strip=(y,cols)=>{const G=H.g(s);const sqs=[];for(let i=0;i<16;i++){const r=H.E('rect',{x:X0+i*(sq+gp),y:y-sq/2,width:sq,height:sq,rx:3,st:`fill:${cols[i]};stroke:var(--ink);stroke-width:1.2`},G);sqs.push(r)}G.sqs=sqs;H.O(G,0,{d:0});return G};
  const base=[...Array(9).fill(TINT[0]),...Array(3).fill(TINT[1]),...Array(3).fill(TINT[2]),TINT[3]];
  const S0=strip(rows[0],base);
  const brk=(p,y,groups)=>{const G=H.g(p);let i=0;groups.forEach(([n,t])=>{const x0=X0+i*(sq+gp),x1=X0+(i+n)*(sq+gp)-gp;
      H.E('path',{d:`M${x0+1},${y} L${x0+1},${y+5} L${x1-1},${y+5} L${x1-1},${y}`,st:'fill:none;stroke:var(--ink);stroke-width:1.4'},G);H.txt(G,(x0+x1)/2,y+20,t,'lb',{'text-anchor':'middle',st:'font-size:13px'});i+=n});H.O(G,0,{d:0});return G};
  const B0=brk(s,rows[0]+16,[[9,'9'],[3,'3'],[3,'3'],[1,'1']]);
  // linkage: gamete share bar
  const LK=H.g(s);const W=16*(sq+gp)-gp;const parts=[['RY','dad-tint'],['Ry','wash'],['rY','wash'],['ry','mom-tint']];
  const segs=parts.map(([t,c],i)=>{const g=at(LK,X0+i*W/4,rows[1]-sq/2);const r=H.E('rect',{x:0,y:0,width:1,height:sq,cls:'nss',st:`fill:var(--${c});stroke:var(--ink);stroke-width:1.2`},g);H.T(r,{sx:W/4},{d:0});
    const tx=H.txt(LK,X0+i*W/4+W/8,rows[1]+5,t,'lb',{'text-anchor':'middle',st:'font-size:13px'});return {g,r,tx}});
  const lkl=H.txt(LK,X0,rows[1]+34,'gametes: 1/4 each','lbs');H.O(LK,0,{d:0});
  // incomplete dominance: 9 classes 1 2 1 2 4 2 1 2 1
  const cls9=[1,2,1,2,4,2,1,2,1];const shade=k=>`color-mix(in srgb, var(--dad) ${12+k*9}%, var(--card))`;
  const cols9=[];cls9.forEach((n,k)=>{for(let j=0;j<n;j++)cols9.push(shade(k))});const S2=strip(rows[2],cols9);
  const B2=brk(s,rows[2]+16,cls9.map(n=>[n,String(n)]));
  const S3=strip(rows[3],base);const B3a=brk(s,rows[3]+16,[[9,'9'],[3,'3'],[3,'3'],[1,'1']]),B3=brk(s,rows[3]+16,[[9,'9'],[3,'3'],[4,'4']]);
  return [
    ()=>{H.O(L[0],1);H.O(S0,1);H.O(B0,1,{at:400})},
    ()=>{H.O(L[1],1);H.O(LK,1);const f=[.42,.08,.08,.42];let x=X0;
      segs.forEach((sg,i)=>{H.T(sg.g,{x},{d:1200,at:600});H.T(sg.r,{sx:W*f[i]},{d:1200,at:600});H.T(sg.tx,{x:x+W*f[i]/2-(X0+i*W/4+W/8)},{d:1200,at:600});x+=W*f[i]});
      H.after(900,()=>{lkl.textContent='gametes: mostly RY and ry (parental types)'})},
    ()=>{H.O(L[2],1);H.O(S2,1);H.O(B2,1,{at:400})},
    ()=>{H.O(L[3],1);H.O(S3,1);H.O(B3a,1);H.after(900,inst=>{H.O(B3a,0,{d:inst?0:300});S3.sqs.slice(12).forEach(r=>fill(r,TINT[2],{d:inst?0:700}));H.O(B3,1,{d:inst?0:500,at:inst?0:300})})},
  ];}},

/* 6 ─────────────────────────────── */
{sec:'8.3',title:'Labrador Coat Colour: Two Genes',caption:'Molly, Zoey and Chance, three Labrador colours · photo Erikeltic, CC BY-SA 3.0, via Wikimedia Commons',
text:`<p data-step="0">Labrador retrievers have three coat colours: black, chocolate (brown) and yellow. Two genes control the colour.</p>
<p data-step="1">The <b>E gene</b> is MC1R. MC1R makes a <b>receptor</b>: a protein on the surface of the pigment cells that receives a signal. Allele E makes a working receptor. Allele e makes a broken receptor.</p>
<p data-step="2">The <b>B gene</b> is TYRP1. TYRP1 makes an enzyme that makes the dark pigment black. Allele B makes a working enzyme. Allele b makes no working enzyme.</p>
<p data-step="3">A blank (_) means "either allele". E_B_ dogs are black. E_bb dogs are chocolate. ee dogs are yellow with any B alleles: ee B_ and ee bb look the same.</p>`,
star:'E lets the dark pigment form. B makes it black.',starStep:3,
scene(H){const s=stage();photo(s,'@@asset:c8-labradors.jpg@@',6,8,304,400,{r:10});
  const tags=[tag(s,196,38,'chocolate'),tag(s,262,210,'black',{anchor:'middle'}),tag(s,30,268,'yellow')];tags.forEach(t=>H.O(t,0,{d:0}));
  const card=(y,title,sub,draw)=>{const G=H.g(s);H.E('rect',{x:334,y,width:296,height:96,rx:10,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5'},G);
    rt(G,350,y+26,title,'lb',{st:'font-size:15px'});H.txt(G,350,y+46,sub,'lbs');draw(G,y);H.O(G,0,{d:0});return G};
  const cE=card(14,'E gene · MC1R','receptor on pigment cells',(G,y)=>{
    H.E('rect',{x:350,y:y+60,width:120,height:12,rx:3,st:'fill:var(--mom-tint);stroke:var(--ink);stroke-width:1.2'},G);
    [[380,'E',1],[440,'e',0]].forEach(([x,t,ok])=>{H.E('path',{d:`M${x},${y+80} L${x},${y+56} M${x-8},${y+50} L${x},${y+58} L${x+8},${y+50}`,st:`fill:none;stroke:${ok?'var(--good)':'var(--bad)'};stroke-width:4;stroke-linecap:round;stroke-linejoin:round${ok?'':';stroke-dasharray:3 4'}`},G);
      rt(G,x+14,y+88,t,'mt',{st:'font-size:16px'})});
    H.txt(G,486,y+68,'E: works','lbs',{st:'fill:var(--ink);font-weight:600'});H.txt(G,486,y+84,'e: broken','lbs',{st:'fill:var(--ink);font-weight:600'})});
  const cB=card(122,'B gene · TYRP1','enzyme: dark pigment → black',(G,y)=>{
    const e1=enzyme(G,378,y+72,{r:12});const e2=enzyme(G,438,y+72,{r:12,fill:'var(--card)'});e2.body.style.strokeDasharray='3 3';
    rt(G,378,y+94,'B','mt',{'text-anchor':'middle',st:'font-size:15px'});rt(G,438,y+94,'b','mt',{'text-anchor':'middle',st:'font-size:15px'});
    H.txt(G,486,y+68,'B: works','lbs',{st:'fill:var(--ink);font-weight:600'});H.txt(G,486,y+84,'b: broken','lbs',{st:'fill:var(--ink);font-weight:600'})});
  const tb=H.g(s);[['black','E_ B_',DOG.blk],['chocolate','E_ bb',DOG.choc],['yellow','ee B_ or ee bb',DOG.yel]].forEach(([c,g,col],i)=>{const y=262+i*46;
    H.E('rect',{x:338,y:y-16,width:30,height:30,rx:6,st:`fill:${col};stroke:var(--ink);stroke-width:1.5`},tb);H.txt(tb,380,y+5,c,'lb');rt(tb,470,y+5,g,'mt',{st:'font-size:17px'})});
  H.O(tb,0,{d:0});
  return [()=>{tags.forEach((t,i)=>H.O(t,1,{at:300+i*250}))},()=>{H.O(cE,1)},()=>{H.O(cB,1)},()=>{H.O(tb,1)}];}},

/* 7 ─────────────────────────────── */
{sec:'8.3',title:'Why Yellow Hides Black and Brown',caption:'Pigment cell of the hair, simplified · dots = pigment granules · signal = a hormone outside the cell',
text:`<p data-step="0">Pigment cells make two kinds of <b>melanin</b> (pigment). <b>Eumelanin</b> is black or brown. <b>Pheomelanin</b> is yellow to red. Without a signal, the cells make pheomelanin.</p>
<p data-step="1">A signal from outside binds to the MC1R receptor. The receptor then switches the cell to eumelanin.</p>
<p data-step="2">TYRP1 makes the eumelanin black. A bb dog has no working TYRP1, so its eumelanin is brown.</p>
<p data-step="3">An ee dog has a broken receptor, so the pigment cells in its hair never switch. They make only pheomelanin, and the coat is yellow. TYRP1 has no eumelanin to change, so the B alleles have no effect on the coat.</p>
<p data-step="4">So ee hides the B gene. ee is <b>epistatic</b> to B, and B is <b>hypostatic</b> to ee ("standing under"). The genotype that hides is recessive, so this is <b>recessive epistasis</b>.</p>
<p data-step="4" class="note">The pigment cells in the skin of the nose do not need the MC1R signal to make eumelanin. So the nose of a yellow dog shows the B gene: black with B_, brown with bb.</p>`,
star:'ee: no switch, so no dark pigment for B to colour.',starStep:4,
scene(H){const s=stage();const cx=215,cy=245;
  H.E('ellipse',{cx,cy,rx:195,ry:145,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},s);
  H.txt(s,cx,410,'PIGMENT CELL','cap',{'text-anchor':'middle'});
  // receptor in membrane at top
  const RX=cx,RY=cy-145;const rec=H.g(s);H.E('path',{d:`M${RX},${RY+24} L${RX},${RY-6} M${RX-12},${RY-18} L${RX},${RY-4} L${RX+12},${RY-18}`,st:'fill:none;stroke:var(--good);stroke-width:6;stroke-linecap:round;stroke-linejoin:round'},rec);
  H.txt(rec,RX-22,RY-4,'MC1R (E)','lb',{'text-anchor':'end',st:'font-size:13px'});H.O(rec,0,{d:0});
  const sigG=H.g(s);const sig=H.E('path',{d:'M0,-9 L9,0 L0,9 L-9,0 Z',st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},sigG);H.T(sig,{x:RX,y:22},{d:0});
  const sigL=H.txt(sigG,RX+16,26,'signal','lbs',{st:'fill:var(--ink);font-weight:600'});H.O(sigG,0,{d:0});
  // routes
  const S0=[70,cy];const start=H.g(s);H.E('circle',{cx:S0[0],cy:S0[1],r:16,st:'fill:var(--card);stroke:var(--ink);stroke-width:2'},start);H.txt(start,S0[0],S0[1]+34,'start','lbs',{'text-anchor':'middle'});
  const up=H.E('path',{d:`M${S0[0]+16},${cy-8} C${cx-60},${cy-90} ${cx},${cy-80} ${cx+80},${cy-78}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:3'},s);
  const dn=H.E('path',{d:`M${S0[0]+16},${cy+8} C${cx-60},${cy+90} ${cx},${cy+80} ${cx+80},${cy+78}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:3'},s);
  const gran=(x,y,col)=>{const G=H.g(s);const pts=[[0,0],[16,-6],[30,4],[8,14],[24,18],[-6,-14],[14,-20]];G.d=pts.map(([a,b])=>H.E('circle',{cx:x+a,cy:y+b,r:6.5,st:`fill:${col};stroke:var(--ink);stroke-width:1`},G));return G};
  const gU=gran(cx+98,cy-76,DOG.blk),gD=gran(cx+98,cy+76,DOG.yel);
  const lU=H.txt(s,cx+108,cy-112,'eumelanin','lb',{'text-anchor':'middle',st:'font-size:13px'}),lD=H.txt(s,cx+108,cy+118,'pheomelanin','lb',{'text-anchor':'middle',st:'font-size:13px'});
  const ty=enzyme(s,cx+10,cy-79,{r:11});const tyL=H.txt(s,cx+10,cy-44,'TYRP1 (B)','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});H.O([ty,tyL],0,{d:0});
  const recX=xmark(s,RX,RY+4,10);
  // hair strands
  const hx=[488,544,600];const hair=hx.map((x,i)=>{const G=H.g(s);const r=H.E('rect',{x:x-11,y:70,width:22,height:250,rx:11,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},G);
    H.txt(G,x,346,['black','brown','yellow'][i],'lb',{'text-anchor':'middle',st:'font-size:13px'});rt(G,x,366,['E_B_','E_bb','ee__'][i],'mt',{'text-anchor':'middle',st:'font-size:14px'});G.r=r;H.O(G,0,{d:0});return G});
  H.txt(s,544,52,'HAIR','cap',{'text-anchor':'middle'});
  const epi=H.txt(s,544,398,'ee is epistatic to B','lb',{'text-anchor':'middle',st:'fill:var(--dad);font-size:13px'});H.O(epi,0,{d:0});
  const dimU=v=>{H.O(up,v);H.O(gU,v)},dimD=v=>{H.O(dn,v);H.O(gD,v)};
  return [
    ()=>{H.D([up,dn],1,{d:900});dimU(.25);H.O(lU,1)},
    ()=>{H.O(rec,1);H.O(sigG,1);H.T(sig,{y:RY-14},{d:1000,at:300});H.after(1200,inst=>{dimU(1);dimD(.25);H.D(up,1,{d:0})});},
    ()=>{H.O([ty,tyL],1);H.O(hair[0],1,{at:300});fill(hair[0].r,DOG.blk,{at:500});
      H.after(1400,inst=>{fill(gU.d,DOG.choc,{d:inst?0:700});fill(ty.body,'var(--card)',{d:inst?0:500});ty.body.style.strokeDasharray='3 3';tyL.textContent='bb: no working TYRP1';
        H.O(hair[1],1,{d:inst?0:300});fill(hair[1].r,DOG.choc,{d:inst?0:600,at:inst?0:300})})},
    ()=>{H.D(recX.firstChild,1,{d:500});H.O(sigG,0,{d:400});dimU(.2);dimD(1);H.O(ty,.35);tyL.textContent='TYRP1: nothing to change';fill(gU.d,DOG.blk,{d:0});
      H.O(hair[2],1,{at:500});fill(hair[2].r,DOG.yel,{at:700})},
    ()=>{H.O(epi,1)},
  ];}},

/* 8 ─────────────────────────────── */
{sec:'8.3',title:'Recessive Epistasis: 9 : 3 : 4',caption:'Rows = gametes of the father (blue) · columns = gametes of the mother (orange) · each box = 1/16',
text:`<p data-step="0">Cross two black dogs that are both <span class="m">Ee Bb</span>. Each parent makes EB, Eb, eB and eb gametes, 1/4 each. The grid has 16 boxes.</p>
<p data-step="1">Sort the boxes by genotype class: 9 E_B_ : 3 E_bb : 3 ee B_ : 1 ee bb. These are the usual 9 : 3 : 3 : 1 classes.</p>
<p data-step="2">Now apply the pathway. E_B_ dogs are black and E_bb dogs are chocolate. All ee dogs are yellow, so the ee B_ and ee bb classes look the same and merge: 3 + 1 = 4.</p>
<p data-step="3">The ratio is 9 black : 3 chocolate : 4 yellow. A 9 : 3 : 4 ratio (also written 9 : 4 : 3) in a dihybrid cross points to recessive epistasis.</p>
<p data-step="3" class="note">The yellow dogs differ inside: ee B_ dogs have black noses and ee bb dogs have brown noses.</p>`,
star:'Recessive epistasis: 3 + 1 = 4, so 9 : 3 : 4.',starStep:3,
scene(H){const s=stage();const R=G16(s,{x:56,y:60,cs:48,g:['E','B'],px:340,py:62,sq:18,gap:2,fs:12.5});
  const rat=ratioTxt(s,152,330);const sub=H.txt(s,152,356,'','lbs',{'text-anchor':'middle'});
  const coat=C=>C.nA?(C.nB?[DOG.blk,LIGHTTXT]:[DOG.choc,LIGHTTXT]):[DOG.yel,DARKTXT];
  return [
    ()=>{R.show()},
    ()=>{R.tint();R.col([{cls:[0],n:'9',name:'E_ B_'},{cls:[1],n:'3',name:'E_ bb'},{cls:[2],n:'3',name:'ee B_'},{cls:[3],n:'1',name:'ee bb'}],{at:200});rat.textContent='9 : 3 : 3 : 1';sub.textContent='genotype classes'},
    ()=>{R.paint(coat);R.col([{cls:[0],n:'9',name:'black',sub:'E_ B_'},{cls:[1],n:'3',name:'chocolate',sub:'E_ bb'},{cls:[2,3],n:'4',name:'yellow',sub:'ee B_ + ee bb'}],{at:500});rat.textContent='9 : 3 : 4';sub.textContent='phenotype classes'},
    ()=>{H.K(rat,{fill:'dad'})},
  ];}},

/* 9 ─────────────────────────────── */
{sec:'8.3',title:'Dominant Epistasis: 12 : 3 : 1',caption:'Squash photo Lisa Ann Yount, CC0, via Flickr · pathway is a model',
text:`<p data-step="0">Fruit colour in summer squash depends on two genes. In the model pathway, the fruit makes green pigment, and the enzyme from gene B changes it to yellow. So B_ fruit are yellow and bb fruit stay green.</p>
<p data-step="1">A dominant allele of a second gene, A, blocks an early step, before any green or yellow pigment forms. So A_ fruit are white. One copy of the allele that blocks is enough, so A is dominant.</p>
<p data-step="2">Cross <span class="m">Aa Bb × Aa Bb</span>. The 16 boxes give 9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb.</p>
<p data-step="3">A_B_ and A_bb fruit are both white, so they merge: 9 + 3 = 12. aaB_ fruit are yellow and aabb fruit are green.</p>
<p data-step="4">The ratio is 12 white : 3 yellow : 1 green. A hides B, and the allele that hides is dominant, so this is <b>dominant epistasis</b>.</p>`,
star:'Dominant epistasis: 9 + 3 = 12, so 12 : 3 : 1.',starStep:4,
scene(H){const s=stage();photo(s,'@@asset:c8-squash.jpg@@',440,6,194,129,{r:8});
  const Y=56;const nodes=[[36,'precursor',NOPIG],[176,'green',GRN],[316,'yellow',YEL]].map(([x,t,c])=>{const G=at(s,x,Y);
    G.c=H.E('circle',{r:17,st:`fill:${c};stroke:var(--ink);stroke-width:1.8`},G);H.txt(G,0,34,t,'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});H.O(G,0,{d:0});return G});
  const ar=[mkA(s,58,Y,152,Y,{w:2}),mkA(s,198,Y,292,Y,{w:2})];const eB=enzyme(s,246,Y-14,{r:9});const eBl=H.txt(s,246,Y-28,'B','mt',{'text-anchor':'middle',st:'font-size:14px'});H.O([eB,eBl],0,{d:0});
  const blk=H.g(s);H.E('path',{d:`M106,${Y-34} L106,${Y-6} M94,${Y-6} L118,${Y-6}`,st:'fill:none;stroke:var(--bad);stroke-width:4;stroke-linecap:round'},blk);H.txt(blk,106,Y-40,'A blocks','lbs',{'text-anchor':'middle',st:'fill:var(--bad);font-weight:700'});H.O(blk,0,{d:0});
  const R=G16(s,{x:52,y:166,cs:38,g:['A','B'],px:322,py:160,sq:13,gap:2,fs:10.5});
  const rat=ratioTxt(s,128,392);
  const col=C=>C.nA?[NOPIG,INK]:C.nB?[YEL,DARKTXT]:[GRN,LIGHTTXT];
  return [
    ()=>{nodes.forEach((G,i)=>H.O(G,1,{at:i*200}));ar.forEach((a,i)=>drawA(a,{at:200+i*250}));H.O([eB,eBl],1,{at:600})},
    ()=>{H.O(blk,1);H.O(nodes[1],.3,{at:300});H.O(nodes[2],.3,{at:300});H.O(ar[1],.3,{at:300})},
    ()=>{R.show()},
    ()=>{R.tint();R.col([{cls:[0],n:'9',name:'A_ B_'},{cls:[1],n:'3',name:'A_ bb'},{cls:[2],n:'3',name:'aa B_'},{cls:[3],n:'1',name:'aa bb'}],{at:200})},
    ()=>{R.paint(col);R.col([{cls:[0,1],n:'12',name:'white',sub:'A_ B_ + A_ bb'},{cls:[2],n:'3',name:'yellow',sub:'aa B_'},{cls:[3],n:'1',name:'green',sub:'aa bb'}],{at:500});rat.textContent='12 : 3 : 1'},
  ];}},

/* 10 ─────────────────────────────── */
{sec:'8.3',title:'Duplicate Genes: 15 : 1',caption:'Bread wheat carries three genome sets (A, B and D) · the red-seed gene R has a copy in each',
text:`<p data-step="0">Wheat seeds are red or white. The red pigment forms in the seed coat. The red-seed gene, R, makes a <b>transcription factor</b>: a protein that activates other genes, here the genes of the pigment pathway.</p>
<p data-step="1">Bread wheat carries three similar genome sets from three ancestral grasses. So R has three similar copies, on chromosomes 3A, 3B and 3D. Call the copy on 3A gene A and the copy on 3B gene B. In this cross, the copy on 3D is broken in all plants.</p>
<p data-step="2">Genes A and B do the same job. One working copy of either gene is enough for red seeds. The pattern is <b>duplicate gene action</b>, and the overlap of function is <b>redundancy</b>.</p>
<p data-step="3">Cross <span class="m">Aa Bb × Aa Bb</span>. Only aabb seeds lack a working copy of both genes, so only they are white. The other classes merge: 9 + 3 + 3 = 15.</p>
<p data-step="4">The ratio is 15 red : 1 white. A 15 : 1 ratio points to two genes that can replace each other.</p>`,
star:'Duplicate genes: either one is enough. 15 : 1.',starStep:4,
scene(H){const s=stage();
  const gen=H.g(s);const cs3=[['3A','dad',40],['3B','mom',96],['3D','good',152]].map(([t,c,x],i)=>{const C=chrom(gen,x,22,120,c,{band:62,label:'R',w:11});H.txt(gen,x,140,t,'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});return C});H.O(gen,0,{d:0});
  const PY=72;const pw=H.g(s);H.E('circle',{cx:250,cy:PY,r:17,st:`fill:${NOPIG};stroke:var(--ink);stroke-width:1.8`},pw);H.txt(pw,250,PY+34,'precursor','lbs',{'text-anchor':'middle'});
  H.E('circle',{cx:540,cy:PY,r:17,st:`fill:${RED};stroke:var(--ink);stroke-width:1.8`},pw);H.txt(pw,540,PY+34,'red pigment','lbs',{'text-anchor':'middle'});
  const a1=H.E('path',{d:`M268,${PY-6} C340,${PY-60} 450,${PY-60} 520,${PY-8}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:2.2'},pw);
  const a2=H.E('path',{d:`M268,${PY+6} C340,${PY+60} 450,${PY+60} 520,${PY+8}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:2.2'},pw);
  const eA=enzyme(pw,394,PY-46,{r:10,label:'A'}),eB=enzyme(pw,394,PY+46,{r:10});H.txt(pw,394,PY+72,'B','lb',{'text-anchor':'middle',st:'font-size:12.5px'});
  const orL=H.txt(pw,394,PY+4,'A or B','lb',{'text-anchor':'middle',st:'fill:var(--dad)'});H.O(pw,0,{d:0});
  const R=G16(s,{x:52,y:186,cs:36,g:['A','B'],px:322,py:150,sq:13,gap:2,fs:10});
  const rat=ratioTxt(s,124,374);const note=H.txt(s,124,400,'','lbs',{'text-anchor':'middle'});
  const col=C=>(C.nA||C.nB)?[RED,LIGHTTXT]:[NOPIG,INK];
  return [
    ()=>{H.O(gen,.25);H.O(pw,0)},
    ()=>{H.O(gen,1);H.after(700,()=>{cs3[0].band.t.textContent='A';cs3[1].band.t.textContent='B';cs3[2].band.t.textContent='r';fill(cs3[2].band.r,RED)})},
    ()=>{H.O(pw,1);H.D([a1,a2],1,{d:900,at:200})},
    ()=>{R.show();H.after(1100,inst=>{R.tint({at:inst?0:0});R.col([{cls:[0],n:'9',name:'A_ B_'},{cls:[1],n:'3',name:'A_ bb'},{cls:[2],n:'3',name:'aa B_'},{cls:[3],n:'1',name:'aa bb'}],{at:inst?0:300})})},
    ()=>{R.paint(col);R.col([{cls:[0,1,2],n:'15',name:'red',sub:'A_ B_ + A_ bb + aa B_'},{cls:[3],n:'1',name:'white',sub:'aa bb'}],{at:500});rat.textContent='15 : 1';note.textContent='only aa bb has no working copy'},
  ];}},

/* 11 ─────────────────────────────── */
{sec:'8.3',title:'Two White Parents, Purple Children',caption:'Sweet pea photos Acabashi, CC BY-SA 4.0, via Wikimedia Commons · the same white photo stands for both white lines',
text:`<p data-step="0">In the early 1900s, William Bateson and Reginald Punnett crossed two true-breeding lines of sweet pea (<i>Lathyrus odoratus</i>). Both lines had white flowers.</p>
<p data-step="1">All the F1 plants had purple flowers. In the F2, purple and white plants appeared in a ratio of about 9 : 7.</p>
<p data-step="2">Model pathway: enzyme A makes a colourless intermediate, and enzyme B changes it into purple pigment. Line 1 was AAbb, with no enzyme B. Line 2 was aaBB, with no enzyme A. So both lines were white.</p>
<p data-step="3">The F1 plants (AaBb) got a working A from line 1 and a working B from line 2. With both enzymes, they made purple pigment.</p>
<p data-step="4">When two genes are both necessary for one phenotype, the interaction is <b>complementary gene action</b>.</p>`,
star:'Each white line lacks a different enzyme. The F1 gets a working copy of both genes, so it is purple.',starStep:3,
scene(H){const s=stage();
  const P1=photo(s,'@@asset:c8-sweetpea-white.jpg@@',14,14,126,132,{r:8}),P2=photo(s,'@@asset:c8-sweetpea-white.jpg@@',190,14,126,132,{r:8});
  const xx=H.txt(s,165,86,'×','lb',{'text-anchor':'middle',st:'font-size:22px'});
  const pl=[H.txt(s,77,166,'line 1 · white','lb',{'text-anchor':'middle',st:'font-size:13px'}),H.txt(s,253,166,'line 2 · white','lb',{'text-anchor':'middle',st:'font-size:13px'})];
  const gt=[rt(s,77,184,'AA bb','mt',{'text-anchor':'middle',st:'font-size:15px'}),rt(s,253,184,'aa BB','mt',{'text-anchor':'middle',st:'font-size:15px'})];H.O(gt,0,{d:0});
  const arF=mkA(s,330,80,400,80,{w:2});const F1=photo(s,'@@asset:c8-sweetpea-purple.jpg@@',412,14,126,132,{r:8});
  const fl=H.txt(s,475,166,'F1 · all purple','lb',{'text-anchor':'middle',st:'font-size:13px'});const fg=rt(s,475,184,'Aa Bb','mt',{'text-anchor':'middle',st:'font-size:15px'});H.O(fg,0,{d:0});
  const f2=H.g(s);H.txt(f2,590,70,'F2','lb',{'text-anchor':'middle',st:'font-size:16px'});H.txt(f2,590,96,'9 purple','lb',{'text-anchor':'middle',st:'font-size:13px;fill:var(--dad)'});H.txt(f2,590,116,': 7 white','lb',{'text-anchor':'middle',st:'font-size:13px'});H.O(f2,0,{d:0});
  [P1,P2,xx,...pl].forEach(e=>H.O(e,0,{d:0}));H.O([F1,fl],0,{d:0});
  // three pathway rows
  const rowY=[240,310,380],rowL=['line 1','line 2','F1'];
  const rows=rowY.map((y,i)=>{const G=H.g(s);H.txt(G,14,y+5,rowL[i],'lb',{st:'font-size:13px'});
    const n=[[110,NOPIG],[290,NOPIG],[470,i===2?PURPLE:NOPIG]].map(([x,c],k)=>{const e=H.E('circle',{cx:x,cy:y,r:14,st:`fill:${c};stroke:var(--ink);stroke-width:1.8`},G);return e});
    const a=[mkA(G,128,y,272,y,{w:2}),mkA(G,308,y,452,y,{w:2})];
    const eA=enzyme(G,200,y-14,{r:9}),eB=enzyme(G,380,y-14,{r:9});H.txt(G,200,y-28,'A','mt',{'text-anchor':'middle',st:'font-size:13px'});H.txt(G,380,y-28,'B','mt',{'text-anchor':'middle',st:'font-size:13px'});
    const res=H.txt(G,500,y+5,i===2?'purple':'white','lb',{st:`font-size:13px;${i===2?'fill:var(--dad)':''}`});
    if(i===0){fill(eB.body,'var(--card)');eB.body.style.strokeDasharray='3 3';H.O([n[2],a[1].firstChild],.35);H.O(a[1],.35)}
    if(i===1){fill(eA.body,'var(--card)');eA.body.style.strokeDasharray='3 3';H.O([n[1],n[2]],.35);H.O(a[0],.35);H.O(a[1],.35)}
    G.a=a;H.O(G,0,{d:0});return G});
  const hd=H.g(s);[[110,'precursor'],[290,'intermediate'],[470,'pigment']].forEach(([x,t])=>H.txt(hd,x,408,t,'lbs',{'text-anchor':'middle'}));H.O(hd,0,{d:0});
  return [
    ()=>{[P1,P2,xx,...pl].forEach((e,i)=>H.O(e,1,{at:i*120}))},
    ()=>{drawA(arF);H.O(F1,1,{at:400});H.O(fl,1,{at:600});H.O(f2,1,{at:1200})},
    ()=>{H.O(gt,1);H.O(hd,1);[0,1].forEach(i=>{H.O(rows[i],1,{at:300+i*400});rows[i].a.forEach(a=>drawA(a,{at:300+i*400}))})},
    ()=>{H.O(fg,1);H.O(rows[2],1,{at:200});rows[2].a.forEach((a,k)=>drawA(a,{at:200+k*250}))},
    ()=>{},
  ];}},

/* 12 ─────────────────────────────── */
{sec:'8.3',title:'Complementary Gene Action: 9 : 7',caption:'Rows = gametes of one F1 parent (blue) · columns = gametes of the other (orange) · each box = 1/16',
text:`<p data-step="0">Cross two F1 plants: <span class="m">Aa Bb × Aa Bb</span>. The 16 boxes give 9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb.</p>
<p data-step="1">Only A_B_ plants have both enzymes, so only they make purple pigment.</p>
<p data-step="2">A_bb plants have no enzyme B. aaB_ plants have no enzyme A. aabb plants have neither. All three classes are white, so they merge: 3 + 3 + 1 = 7.</p>
<p data-step="3">The ratio is 9 purple : 7 white. Each homozygous recessive genotype hides the other gene, so 9 : 7 is also called <b>duplicate recessive epistasis</b>.</p>
<p data-step="3">Compare with duplicate genes (15 : 1): there, either gene is enough. Complementary genes need both.</p>`,
star:'Complementary genes: A and B are both necessary. 9 : 7.',starStep:3,
scene(H){const s=stage();const R=G16(s,{x:56,y:60,cs:48,g:['A','B'],px:340,py:62,sq:18,gap:2,fs:12.5});
  const rat=ratioTxt(s,152,330);const sub=H.txt(s,152,356,'','lbs',{'text-anchor':'middle'});
  const col=C=>(C.nA&&C.nB)?[PURPLE,LIGHTTXT]:[NOPIG,INK];
  return [
    ()=>{R.show();H.after(1100,inst=>{R.tint();R.col([{cls:[0],n:'9',name:'A_ B_'},{cls:[1],n:'3',name:'A_ bb'},{cls:[2],n:'3',name:'aa B_'},{cls:[3],n:'1',name:'aa bb'}],{at:inst?0:300})});rat.textContent='9 : 3 : 3 : 1'},
    ()=>{R.cells.filter(C=>C.ci===0).forEach((C,i)=>{fill(C.r,PURPLE,{at:i*40});fill(C.t,LIGHTTXT)});R.labs[0]&&R.labs[0].querySelector('tspan:last-child')&&(R.labs[0].querySelector('tspan:last-child').textContent='purple')},
    ()=>{R.paint(col);R.col([{cls:[0],n:'9',name:'purple',sub:'A_ B_'},{cls:[1,2,3],n:'7',name:'white',sub:'A_ bb + aa B_ + aa bb'}],{at:500});rat.textContent='9 : 7';sub.textContent='phenotype classes'},
    ()=>{H.K(rat,{fill:'dad'})},
  ];}},

/* 13 ─────────────────────────────── */
{sec:'8.3',title:'Three Ways to Need Both Genes',caption:'Schematic · each row is one molecular reason for the 9 : 7 rule',
text:`<p data-step="0">A 9 : 7 ratio means that the phenotype needs a working A and a working B. Three molecular set-ups give this rule.</p>
<p data-step="1"><b>(a) Two enzymes in a row.</b> Enzyme A and enzyme B do two steps, one after the other. The order does not matter: B before A gives the same ratio.</p>
<p data-step="2"><b>(b) Two subunits.</b> Proteins A and B are two <b>subunits</b> (parts) of one enzyme. The enzyme works only when both parts are present.</p>
<p data-step="3"><b>(c) A switch and an enzyme.</b> Protein A is a transcription factor. Protein A activates gene B, and gene B makes the enzyme.</p>
<p data-step="4">In each case, the loss of A, the loss of B, or the loss of both gives the same phenotype: no pigment.</p>`,
star:'A and B both necessary → 9 : 7.',starStep:4,
scene(H){const s=stage();const ys=[86,216,346];
  const lab=ys.map((y,i)=>{const t=H.txt(s,14,y-50,['(a) two enzymes in a row','(b) two subunits of one enzyme','(c) a transcription factor and an enzyme'][i],'lb',{st:'font-size:13.5px;fill:var(--muted)'});H.O(t,0,{d:0});return t});
  const sep=[150,280].map(y=>{const l=H.E('line',{x1:14,y1:y,x2:626,y2:y,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);H.O(l,0,{d:0});return l});
  const node=(p,x,y,c)=>H.E('circle',{cx:x,cy:y,r:14,st:`fill:${c};stroke:var(--ink);stroke-width:1.8`},p);
  const dash=e=>{fill(e,'var(--card)');e.style.strokeDasharray='3 3'};
  // (a)
  const A=H.g(s);node(A,50,ys[0],NOPIG);const ia=node(A,230,ys[0],NOPIG);const pa=node(A,410,ys[0],NOPIG);
  const aa=[mkA(A,68,ys[0],212,ys[0],{w:2}),mkA(A,248,ys[0],392,ys[0],{w:2})];const ea=enzyme(A,140,ys[0]-15,{r:9,label:'A'}),eb=enzyme(A,320,ys[0]-15,{r:9,label:'B'});H.O(A,0,{d:0});
  // (b)
  const Bg=H.g(s);node(Bg,250,ys[1],NOPIG);const pb=node(Bg,430,ys[1],NOPIG);const ab=mkA(Bg,268,ys[1],412,ys[1],{w:2});
  const half=(sx)=>{const G=at(Bg,sx<0?60:150,ys[1]);H.E('path',{d:sx<0?'M0,-16 A16,16 0 0 0 0,16 Z':'M0,-16 A16,16 0 0 1 0,16 Z',st:`fill:${sx<0?'var(--dad-tint)':'var(--mom-tint)'};stroke:var(--ink);stroke-width:1.6`},G);
    H.txt(G,sx*8,5,sx<0?'A':'B','lb',{'text-anchor':'middle',st:'font-size:12px'});return G};
  const hA=half(-1),hB=half(1);H.O(Bg,0,{d:0});
  // (c)
  const Cg=H.g(s);H.E('line',{x1:24,y1:ys[2]+14,x2:214,y2:ys[2]+14,st:'stroke:var(--mom);stroke-width:8;stroke-linecap:round'},Cg);
  H.E('rect',{x:120,y:ys[2]+6,width:70,height:16,rx:3,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.3'},Cg);H.txt(Cg,155,ys[2]+18,'gene B','lbs',{'text-anchor':'middle',st:'fill:#16181d;font-weight:700'});
  H.txt(Cg,84,ys[2]+40,'switch','lbs',{'text-anchor':'middle'});
  const tf=at(Cg,44,ys[2]-24);H.E('path',{d:'M-11,10 L-11,-1 C-11,-13 11,-13 11,-1 L11,10 L5,10 L5,1 C5,-5 -5,-5 -5,1 L-5,10 Z',st:'fill:var(--dad-tint);stroke:var(--ink);stroke-width:1.5'},tf);H.txt(tf,18,4,'A','lb',{st:'font-size:12px'});
  node(Cg,260,ys[2],NOPIG);const pc=node(Cg,440,ys[2],NOPIG);const ac=mkA(Cg,278,ys[2],422,ys[2],{w:2});const ec=enzyme(Cg,155,ys[2]-6,{r:9});H.O(ec,0,{d:0});H.O(Cg,0,{d:0});
  const res=[[A,440,ys[0]],[Bg,460,ys[1]],[Cg,470,ys[2]]].map(([G,x,y])=>H.txt(G,x+6,y+5,'','lb',{st:'font-size:13px'}));
  const res2=H.txt(s,620,400,'','lb',{'text-anchor':'end',st:'fill:var(--bad)'});
  return [
    ()=>{lab.forEach((t,i)=>H.O(t,1,{at:i*200}));H.O(sep,1)},
    ()=>{H.O(A,1);aa.forEach((a,i)=>drawA(a,{at:300+i*400}));fill(pa,PURPLE,{d:700,at:1300});H.after(1300,()=>{res[0].textContent='purple'})},
    ()=>{H.O(Bg,1);H.T(hA,{x:100},{d:900,at:300});H.T(hB,{x:100},{d:900,at:300});H.after(1200,inst=>{H.T(hA,{x:340,y:ys[1]-24},{d:inst?0:800});H.T(hB,{x:340,y:ys[1]-24},{d:inst?0:800});drawA(ab,{d:inst?0:600,at:inst?0:500});fill(pb,PURPLE,{d:inst?0:700,at:inst?0:1100});res[1].textContent='purple'})},
    ()=>{H.O(Cg,1);H.T(tf,{x:84,y:ys[2]+2},{d:900,at:300});H.after(1100,inst=>{H.O(ec,1,{d:inst?0:300});H.T(ec,{x:350,y:ys[2]-15},{d:inst?0:900});drawA(ac,{d:inst?0:600,at:inst?0:500});fill(pc,PURPLE,{d:inst?0:700,at:inst?0:1000});res[2].textContent='purple'})},
    ()=>{dash(ea.body);H.O([ia,pa],.45);fill(pa,NOPIG,{d:700});
      dash(hA.firstChild);H.T(hA,{x:60,y:ys[1]},{d:900});H.T(hB,{x:150,y:ys[1]},{d:900});fill(pb,NOPIG,{d:700});
      dash(tf.firstChild);H.T(tf,{x:44,y:ys[2]-24},{d:900});H.O(ec,0,{d:500});fill(pc,NOPIG,{d:700});
      res.forEach(t=>{t.textContent='no A: white'});res2.textContent='no B, or neither: white too'},
  ];}},

/* 14 ─────────────────────────────── */
{sec:'8.3',title:'Suppressors and Enhancers',caption:'Schematic · a slash separates the two alleles of one gene, a semicolon separates genes · dot = one facet (small unit of the eye)',
text:`<p data-step="0">The fruit-fly <i>white</i> gene makes a protein that carries pigment building blocks into the eye cells. Allele w<sup>+</sup> gives red eyes, the <b>wild type</b> (the usual form in nature). Allele w<sup>−</sup> gives white eyes.</p>
<p data-step="1">The <b>white-mottled</b> allele, w<sup>m</sup>, gives eyes with red and white patches. w<sup>m</sup> is recessive to w<sup>+</sup> and dominant to w<sup>−</sup>.</p>
<p data-step="2">A <b>suppressor mutation</b> makes a mutant phenotype more like the wild type. A dominant suppressor, Su<sup>−</sup>, makes a mottled eye almost red. An <b>enhancer mutation</b> makes a mutant phenotype stronger: a dominant enhancer, En<sup>−</sup>, makes it almost white. Alone, neither usually changes the fly.</p>
<p data-step="3">In real mottled flies, a chromosome rearrangement put <i>white</i> next to <b>heterochromatin</b> (tightly packed DNA). In some eye cells, the heterochromatin spreads over <i>white</i> and silences it. Those cells are white.</p>
<p data-step="4">Many dominant suppressors are broken copies of genes for proteins that pack DNA. With half the amount of such a protein, fewer cells silence <i>white</i>.</p>`,
star:'Suppressor: back toward wild type. Enhancer: further from it.',starStep:2,
scene(H){const s=stage();
  const fly=(x,y,lvl,seed)=>{const G=at(s,x,y);H.E('ellipse',{rx:46,ry:30,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.6'},G);
    const fac=[];[-1,1].forEach(k=>{const ex=k*30,ey=-2,rx=17,ry=22;H.E('ellipse',{cx:ex,cy:ey,rx,ry,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},G);
      for(let yy=-ry+3;yy<ry-2;yy+=4.6)for(let xx=-rx+3;xx<rx-2;xx+=4.6){if((xx*xx)/(rx*rx)+(yy*yy)/(ry*ry)>.82)continue;
        const c=H.E('circle',{cx:ex+xx,cy:ey+yy,r:2.2,st:'fill:var(--card)'},G);
        c.u=.5+.32*Math.sin(xx*.33+seed+k)*Math.cos(yy*.27-seed*1.7)+.18*Math.sin((xx+yy)*.9+seed*3);fac.push(c)}});
    const order=fac.slice().sort((a,b)=>a.u-b.u);order.forEach((c,i)=>c.rank=i/order.length);
    G.set=(v,o)=>{fac.forEach(c=>fill(c,c.rank<v?RED:'var(--card)',Object.assign({d:500},o)))};G.set(lvl,{d:0});H.O(G,0,{d:0});return G};
  const lab=(x,y,a,b)=>{const G=H.g(s);rt(G,x,y,a,'lb',{'text-anchor':'middle',st:'font-size:13px'});H.txt(G,x,y+17,b,'lbs',{'text-anchor':'middle'});H.O(G,0,{d:0});return G};
  const F=[fly(100,70,1,1),fly(320,70,.5,2),fly(540,70,0,3)];
  const L=[lab(100,122,'w^+/w^+ or w^+/w^m','red'),lab(320,122,'w^m/w^m or w^m/w^−','mottled'),lab(540,122,'w^−/w^−','white')];
  const S=fly(190,214,.5,2),E=fly(450,214,.5,2);const LS=lab(190,266,'w^m/w^m ; Su^−','almost red'),LE=lab(450,266,'w^m/w^m ; En^−','almost white');
  const aS=mkA(s,290,148,222,184,{w:1.8,h:7}),aE=mkA(s,350,148,418,184,{w:1.8,h:7});
  const aSl=H.txt(s,244,160,'+ suppressor','lbs',{'text-anchor':'end',st:'fill:var(--good);font-weight:700'}),aEl=H.txt(s,396,160,'+ enhancer','lbs',{st:'fill:var(--bad);font-weight:700'});H.O([aSl,aEl],0,{d:0});
  // chromatin strips
  const strip=(y,spread)=>{const G=H.g(s);H.E('line',{x1:100,y1:y,x2:420,y2:y,st:'stroke:var(--dad);stroke-width:8;stroke-linecap:round'},G);
    H.E('rect',{x:100,y:y-11,width:120,height:22,rx:5,st:'fill:var(--muted)'},G);H.txt(G,160,y+4,'heterochromatin','lbs',{'text-anchor':'middle',st:'fill:var(--paper);font-weight:700'});
    H.E('rect',{x:260,y:y-11,width:66,height:22,rx:4,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.3'},G);H.txt(G,293,y+4,'white','lbs',{'text-anchor':'middle',st:'fill:#16181d;font-weight:700;font-style:italic'});
    const sp=H.E('rect',{x:0,y:y-15,width:1,height:30,rx:6,cls:'nss',st:'fill:var(--muted);opacity:.55'},G);H.T(sp,{x:220,sx:.001},{d:0});G.sp=sp;
    const dot=H.E('circle',{cx:452,cy:y,r:12,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},G);G.dot=dot;
    const t=H.txt(G,472,y+5,'','lbs',{st:'fill:var(--ink);font-weight:600'});G.t=t;H.O(G,0,{d:0});return G};
  const C1=strip(330,0),C2=strip(386,1);const cl=[H.txt(s,14,334,'eye cell 1','lbs'),H.txt(s,14,390,'eye cell 2','lbs')];H.O(cl,0,{d:0});
  const mid=[S,E,LS,LE];mid.forEach(e=>H.O(e,0,{d:0}));
  return [
    ()=>{[F[0],F[2],L[0],L[2]].forEach((e,i)=>H.O(e,1,{at:i*120}))},
    ()=>{H.O(F[1],1);H.O(L[1],1,{at:200})},
    ()=>{H.O(S,1);H.O(E,1);H.O(LS,1);H.O(LE,1);drawA(aS);drawA(aE);H.O([aSl,aEl],1);S.set(.93,{at:700});E.set(.08,{at:700})},
    ()=>{[C1,C2,...cl].forEach(e=>H.O(e,1));fill(C1.dot,RED,{at:400});C1.t.textContent='white is on: red';
      H.T(C2.sp,{sx:110},{d:1400,at:500});H.after(1500,inst=>{C2.t.textContent='white is off: white'})},
    ()=>{H.T(C2.sp,{sx:.001},{d:1200});fill(C2.dot,RED,{d:600,at:900});H.after(900,()=>{C2.t.textContent='less packing: red'})},
  ];}},

/* 15 ─────────────────────────────── */
{sec:'8.3',title:'A Suppressor Inside the Gene',caption:'Three-letter words stand for codons · green = correct codon, red = wrong codon',
text:`<p data-step="0">A suppressor can be in the mutant gene itself (an <b>intragenic</b> suppressor) or in another gene (an <b>extragenic</b> suppressor).</p>
<p data-step="0">The cell reads a gene in groups of three letters, the <b>codons</b>. Each codon codes for one amino acid of the protein.</p>
<p data-step="1">A deletion of one letter shifts the reading frame, so every later codon is wrong. Such a mutation is a <b>frameshift</b> mutation. The protein usually does not work.</p>
<p data-step="2">A second mutation that inserts one letter nearby restores the frame. Only the codons between the two changes are wrong, so the protein often works again. The second mutation is an intragenic suppressor.</p>
<p data-step="2" class="note">In 1961, Francis Crick, Sydney Brenner and colleagues used such deletion and insertion pairs to show the reading frame. Three insertions together also gave a working gene again. So the cell reads the code in groups of three.</p>
<p data-step="3">In extragenic suppression, a mutation in gene B hides the phenotype of a mutation in gene A. The suppressor allele can be dominant or recessive.</p>`,
star:'Minus one letter, plus one letter: back in frame.',starStep:2,
scene(H){const s=stage();const word='THEFATCATATETHERAT'.split('');const X0=58,Y=150,slot=i=>X0+i*26+Math.floor(i/3)*16;
  const ref=H.g(s);word.forEach((c,i)=>H.txt(ref,slot(i)+11,74,c,'lb',{'text-anchor':'middle',st:'font-family:ui-monospace,Menlo,monospace;font-size:18px;opacity:.45'}));
  H.txt(ref,X0,46,'ORIGINAL GENE','cap');
  const boxes=[0,1,2,3,4,5].map(k=>{const r=H.E('rect',{x:slot(k*3)-4,y:Y-26,width:3*26+4,height:38,rx:6,st:'fill:color-mix(in srgb, var(--good) 22%, var(--card));stroke:var(--good);stroke-width:2'},s);return r});
  const hd=H.txt(s,X0,Y-40,'READING FRAME (CODONS)','cap');
  const L=word.map((c,i)=>{const t=H.txt(s,0,Y,c,'lb',{'text-anchor':'middle',st:'font-family:ui-monospace,Menlo,monospace;font-size:20px'});H.T(t,{x:slot(i)+11},{d:0});return t});
  const G=H.txt(s,0,Y,'G','lb',{'text-anchor':'middle',st:'font-family:ui-monospace,Menlo,monospace;font-size:20px;fill:var(--dad)'});H.T(G,{x:slot(9)+11,y:-60},{d:0});H.O(G,0,{d:0});
  const box=(k,ok,o)=>{paint(boxes[k],'fill',ok?'color-mix(in srgb, var(--good) 22%, var(--card))':'color-mix(in srgb, var(--bad) 22%, var(--card))',o);paint(boxes[k],'stroke',ok?'var(--good)':'var(--bad)',o)};
  const msg=H.txt(s,X0,Y+46,'','lb');const msg2=H.txt(s,X0,Y+68,'','lbs',{st:'fill:var(--ink)'});
  // extragenic panel
  const ex=H.g(s);const gy=[318,378];
  [['gene A','dad',0],['gene B','mom',1]].forEach(([t,c,i])=>{H.txt(ex,X0,gy[i]+5,t,'lb',{st:'font-size:13px'});H.E('line',{x1:X0+70,y1:gy[i],x2:X0+330,y2:gy[i],st:`stroke:var(--${c});stroke-width:10;stroke-linecap:round`},ex)});
  H.E('circle',{cx:X0+170,cy:gy[0],r:9,st:'fill:var(--bad);stroke:var(--ink);stroke-width:1.5'},ex);H.txt(ex,X0+186,gy[0]-14,'mutation: mutant phenotype','lbs',{st:'fill:var(--ink);font-weight:600'});
  H.E('circle',{cx:X0+250,cy:gy[1],r:9,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.5'},ex);H.txt(ex,X0+266,gy[1]-14,'suppressor: phenotype back to wild type','lbs',{st:'fill:var(--ink);font-weight:600'});
  H.txt(ex,X0,gy[0]-34,'EXTRAGENIC: TWO GENES','cap');H.O(ex,0,{d:0});
  return [
    ()=>{msg.textContent='THE FAT CAT ATE THE RAT';msg2.textContent='every codon is correct'},
    ()=>{fill(L[4],RED,{d:300});H.T(L[4],{y:-40},{d:700,at:300});H.O(L[4],0,{d:500,at:500});
      L.forEach((t,i)=>{if(i>4)H.T(t,{x:slot(i-1)+11},{d:900,at:800})});[1,2,3,4,5].forEach(k=>box(k,false,{at:1300+k*80}));
      msg.textContent='THE FTC ATA TET HER AT·';msg2.textContent='1 letter deleted: every codon after it is wrong'},
    ()=>{H.O(G,1,{d:300});H.T(G,{y:0},{d:800,at:200});L.forEach((t,i)=>{if(i>=10)H.T(t,{x:slot(i)+11},{d:800})});
      [4,5].forEach(k=>box(k,true,{at:900}));
      msg.textContent='THE FTC ATA GTE THE RAT';msg2.textContent='1 letter inserted: the frame is back after it'},
    ()=>{H.O(ex,1)},
  ];}},

/* 16 ─────────────────────────────── */
{sec:'8.3',title:'Dominant Suppression: 15 : 1',caption:'Model cross · the real white gene is on the X chromosome; the model ignores this',
text:`<p data-step="0">Write W for w<sup>+</sup> and w for w<sup>m</sup>. For the suppressor gene, write S for the suppressor allele (Su<sup>−</sup>) and s for the normal allele (Su<sup>+</sup>). S is dominant: one copy suppresses the mottling. Here the capital letter S is the mutant allele, because it is dominant.</p>
<p data-step="1">The P cross WW SS × ww ss gives F1 flies that are all Ww Ss, with red eyes. Cross two F1 flies. The 16 boxes give 9 W_S_ : 3 W_ss : 3 wwS_ : 1 wwss.</p>
<p data-step="2">W_ flies have red eyes, because w<sup>+</sup> is dominant. wwS_ flies also have red eyes, because S suppresses the mottling. Only wwss flies are mottled.</p>
<p data-step="3">So 9 + 3 + 3 merge into one class: 15 red : 1 mottled. The rule is the same as for duplicate genes: either W or S is enough for red eyes.</p>`,
star:'Dominant suppressor: 15 : 1.',starStep:3,
scene(H){const s=stage();const d=H.E('defs',{},s);const pt=H.E('pattern',{id:'c8mot',patternUnits:'userSpaceOnUse',width:8,height:8},d);
  H.E('rect',{width:8,height:8,st:'fill:var(--card)'},pt);H.E('circle',{cx:2,cy:2,r:2.2,st:'fill:var(--bad)'},pt);H.E('circle',{cx:6,cy:6,r:1.6,st:'fill:var(--bad)'},pt);
  const R=G16(s,{x:56,y:60,cs:48,g:['W','S'],px:340,py:62,sq:18,gap:2,fs:12.5});
  const rat=ratioTxt(s,152,320);const sub=H.txt(s,152,346,'','lbs',{'text-anchor':'middle'});
  const col=C=>(C.nA||C.nB)?[RED,LIGHTTXT]:['url(#c8mot)',INK];
  const key=H.g(s);H.E('rect',{x:60,y:376,width:18,height:18,rx:3,st:'fill:url(#c8mot);stroke:var(--ink);stroke-width:1.2'},key);H.txt(key,86,390,'= mottled eye','lbs',{st:'fill:var(--ink)'});
  H.E('rect',{x:190,y:376,width:18,height:18,rx:3,st:`fill:${RED};stroke:var(--ink);stroke-width:1.2`},key);H.txt(key,216,390,'= red eye','lbs',{st:'fill:var(--ink)'});H.O(key,0,{d:0});
  return [
    ()=>{},
    ()=>{R.show();H.after(1100,inst=>{R.tint();R.col([{cls:[0],n:'9',name:'W_ S_'},{cls:[1],n:'3',name:'W_ ss'},{cls:[2],n:'3',name:'ww S_'},{cls:[3],n:'1',name:'ww ss'}],{at:inst?0:300})});rat.textContent='9 : 3 : 3 : 1';sub.textContent='genotype classes'},
    ()=>{R.paint(col);H.O(key,1)},
    ()=>{R.col([{cls:[0,1,2],n:'15',name:'red',sub:'W_ S_ + W_ ss + ww S_'},{cls:[3],n:'1',name:'mottled',sub:'ww ss'}]);rat.textContent='15 : 1';sub.textContent='phenotype classes';H.K(rat,{fill:'dad'})},
  ];}},

/* 17 ─────────────────────────────── */
{sec:'8.3',title:'Recessive Suppression: 13 : 3',caption:'Model cross · the real white gene is on the X chromosome; the model ignores this',
text:`<p data-step="0">Now the suppressor allele is recessive. Write s for the mutant suppressor allele (su<sup>−</sup>). S now means the normal allele. A fly needs two copies, ss, to suppress the mottling.</p>
<p data-step="1">Cross two flies that are both Ww Ss. The 16 boxes give 9 W_S_ : 3 W_ss : 3 wwS_ : 1 wwss.</p>
<p data-step="2">W_ flies have red eyes with any suppressor alleles. wwss flies also have red eyes, because ss suppresses the mottling. Only wwS_ flies are mottled.</p>
<p data-step="3">So 9 + 3 + 1 merge into one class: 13 red : 3 mottled. The odd class is now a 3, not a 1, because two suppressor copies are necessary.</p>`,
star:'Recessive suppressor: 13 : 3.',starStep:3,
scene(H){const s=stage();const d=H.E('defs',{},s);const pt=H.E('pattern',{id:'c8mot2',patternUnits:'userSpaceOnUse',width:8,height:8},d);
  H.E('rect',{width:8,height:8,st:'fill:var(--card)'},pt);H.E('circle',{cx:2,cy:2,r:2.2,st:'fill:var(--bad)'},pt);H.E('circle',{cx:6,cy:6,r:1.6,st:'fill:var(--bad)'},pt);
  const R=G16(s,{x:56,y:60,cs:48,g:['W','S'],px:340,py:62,sq:18,gap:2,fs:12.5});
  const rat=ratioTxt(s,152,320);const sub=H.txt(s,152,346,'','lbs',{'text-anchor':'middle'});
  const col=C=>(C.nA||!C.nB)?[RED,LIGHTTXT]:['url(#c8mot2)',INK];
  const key=H.g(s);H.E('rect',{x:60,y:376,width:18,height:18,rx:3,st:'fill:url(#c8mot2);stroke:var(--ink);stroke-width:1.2'},key);H.txt(key,86,390,'= mottled eye','lbs',{st:'fill:var(--ink)'});
  H.E('rect',{x:190,y:376,width:18,height:18,rx:3,st:`fill:${RED};stroke:var(--ink);stroke-width:1.2`},key);H.txt(key,216,390,'= red eye','lbs',{st:'fill:var(--ink)'});H.O(key,0,{d:0});
  return [
    ()=>{},
    ()=>{R.show();H.after(1100,inst=>{R.tint();R.col([{cls:[0],n:'9',name:'W_ S_'},{cls:[1],n:'3',name:'W_ ss'},{cls:[2],n:'3',name:'ww S_'},{cls:[3],n:'1',name:'ww ss'}],{at:inst?0:300})});rat.textContent='9 : 3 : 3 : 1';sub.textContent='genotype classes'},
    ()=>{R.paint(col);H.O(key,1)},
    ()=>{R.col([{cls:[0,1,3],n:'13',name:'red',sub:'W_ S_ + W_ ss + ww ss'},{cls:[2],n:'3',name:'mottled',sub:'ww S_'}]);rat.textContent='13 : 3';sub.textContent='phenotype classes';H.K(rat,{fill:'dad'})},
  ];}},

/* 18 ─────────────────────────────── */
{sec:'8.3',title:'Every Modified Ratio Is a Sum',caption:'Each row = the same 16 boxes, sorted · brackets join the classes that look the same',
text:`<p data-step="0">In a dihybrid cross with gene interaction, each phenotype class is a sum of the classes 9, 3, 3 and 1. The total stays 16.</p>
<p data-step="1"><b>Epistasis.</b> 9 : 3 : 4 merges 3 + 1 (recessive epistasis). 12 : 3 : 1 merges 9 + 3 (dominant epistasis).</p>
<p data-step="2"><b>Duplicate and complementary genes.</b> 15 : 1 merges 9 + 3 + 3. 9 : 7 merges 3 + 3 + 1.</p>
<p data-step="3"><b>Two more.</b> 13 : 3 merges 9 + 3 + 1. 9 : 6 : 1 merges the two 3s.</p>
<p data-step="3">Example of 9 : 6 : 1: in summer squash, A_B_ fruit are disc-shaped, A_bb and aaB_ fruit are round, and aabb fruit are long. One dominant allele of either gene makes the fruit round. Dominant alleles of both genes make it disc-shaped.</p>`,
star:'Count to 16: every modified ratio merges the 9, 3, 3 and 1.',starStep:3,
scene(H){const s=stage();const X0=150,sq=17,gp=2,top=34,dy=54;
  const rows=[['9 : 3 : 3 : 1','no interaction',[[0],[1],[2],[3]]],['9 : 3 : 4','recessive epistasis',[[0],[1],[2,3]]],['12 : 3 : 1','dominant epistasis',[[0,1],[2],[3]]],
    ['15 : 1','duplicate genes',[[0,1,2],[3]]],['9 : 7','complementary genes',[[0],[1,2,3]]],['13 : 3','recessive suppression',[[0,1,3],[2]]],['9 : 6 : 1','duplicate interaction',[[0],[1,2],[3]]]];
  const N=[9,3,3,1];const Rw=rows.map(([rt0,name,groups],ri)=>{const y=top+ri*dy;const G=H.g(s);
    H.txt(G,14,y+13,rt0,'lb',{st:'font-size:15px;font-weight:800'});H.txt(G,X0+16*(sq+gp)+10,y+13,name,'lbs',{st:'fill:var(--ink);font-weight:600'});
    const sqs=[];[0,1,2,3].forEach(ci=>{for(let k=0;k<N[ci];k++){const r=H.E('rect',{x:0,y:0,width:sq,height:sq,rx:3,st:`fill:${TINT[ci]};stroke:var(--ink);stroke-width:1.1`},G);r.ci=ci;sqs.push(r)}});
    // initial = base order
    let i=0;sqs.forEach(r=>{H.T(r,{x:X0+i*(sq+gp),y:top},{d:0});i++});
    const br=H.g(G);let j=0;groups.forEach(gpc=>{const n=gpc.reduce((a,c)=>a+N[c],0);const x0=X0+j*(sq+gp),x1=X0+(j+n)*(sq+gp)-gp;
      H.E('path',{d:`M${x0+1},${y+sq+3} L${x0+1},${y+sq+7} L${x1-1},${y+sq+7} L${x1-1},${y+sq+3}`,st:'fill:none;stroke:var(--ink);stroke-width:1.3'},br);
      H.txt(br,(x0+x1)/2,y+sq+21,String(n),'lb',{'text-anchor':'middle',st:'font-size:12.5px'});j+=n});H.O(br,0,{d:0});
    H.O(G,0,{d:0});return {G,sqs,br,groups,y}});
  const place=(R,o)=>{let i=0;R.groups.forEach(gpc=>{const col=TINT[gpc[0]];gpc.forEach(ci=>R.sqs.filter(r=>r.ci===ci).forEach(r=>{H.T(r,{x:X0+i*(sq+gp),y:R.y},o);fill(r,col,Object.assign({},o,{at:(o.at||0)+900}));i++}))});H.O(R.br,1,{d:400,at:(o.at||0)+1000})};
  const show=(ri,at)=>{const R=Rw[ri];H.O(R.G,1,{d:300,at});place(R,{d:1100,at:at+200})};
  return [()=>show(0,0),()=>{show(1,0);show(2,500)},()=>{show(3,0);show(4,500)},()=>{show(5,0);show(6,500)}];}},

/* 19 ─────────────────────────────── */
{sec:'8.3',title:'From Pathway to Ratio',caption:'Model pathway · moving dot = how far each genotype class gets along the pathway',
text:`<p data-step="0">A pathway predicts the ratio. Model: enzyme A changes a white precursor into a yellow intermediate. Enzyme B changes the yellow intermediate into red pigment.</p>
<p data-step="1"><b>Step 1.</b> List the four genotype classes of the dihybrid cross: 9 A_B_, 3 A_bb, 3 aaB_ and 1 aabb.</p>
<p data-step="2"><b>Step 2.</b> For each class, follow the pathway until it stops. The last compound collects and gives the colour. A_B_ makes red pigment. A_bb stops at yellow. aaB_ and aabb stop at the start, so they are white.</p>
<p data-step="3"><b>Step 3.</b> Merge the classes that look the same: 9 red : 3 yellow : 4 white.</p>
<p data-step="4">aabb has the same colour as aaB_, not as A_bb. So the gene for the earlier step (A) is epistatic to the gene for the later step (B). When each compound has its own colour, the double mutant has the phenotype of the mutant for the earlier step.</p>`,
star:'Follow the pathway, find the block, merge the boxes.',starStep:3,
scene(H){const s=stage();const xs=[170,330,490],cols=[NOPIG,YEL,RED],names=['white precursor','yellow','red'];
  const top=H.g(s);xs.forEach((x,i)=>{H.E('circle',{cx:x,cy:48,r:16,st:`fill:${cols[i]};stroke:var(--ink);stroke-width:1.8`},top);H.txt(top,x,82,names[i],'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'})});
  const ta=[mkA(top,188,48,312,48,{w:2}),mkA(top,348,48,472,48,{w:2})];enzyme(top,250,34,{r:9,label:'A'});enzyme(top,410,34,{r:9,label:'B'});H.O(top,0,{d:0});
  const cls=[['A_ B_','9',1,1],['A_ bb','3',1,0],['aa B_','3',0,1],['aa bb','1',0,0]];const ys=[132,190,248,306];
  const rows=cls.map(([g,n,a,b],i)=>{const y=ys[i];const G=H.g(s);rt(G,20,y+5,g,'mt',{st:'font-size:17px'});H.txt(G,92,y+5,n+(n==='1'?' box':' boxes'),'lbs');
    xs.forEach(x=>H.E('circle',{cx:x,cy:y,r:9,st:'fill:none;stroke:var(--faint);stroke-width:1.5'},G));
    [[xs[0],xs[1],a],[xs[1],xs[2],b]].forEach(([x0,x1,ok],k)=>H.E('line',{x1:x0+11,y1:y,x2:x1-11,y2:y,st:`stroke:${ok?'var(--ink)':'var(--bad)'};stroke-width:1.6;${ok?'':'stroke-dasharray:3 4'}`},G));
    const stop=a?(b?2:1):0;const tok=H.E('circle',{r:8,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.6'},G);H.T(tok,{x:xs[0],y},{d:0});
    const chip=H.E('rect',{x:540,y:y-13,width:26,height:26,rx:5,st:`fill:${cols[stop]};stroke:var(--ink);stroke-width:1.5`},G);H.O(chip,0,{d:0});
    const ct=H.txt(G,576,y+5,'','lb');H.O(G,0,{d:0});return {G,tok,chip,stop,ct,y,n}});
  const br=H.g(s);H.E('path',{d:`M604,${ys[2]-12} L612,${ys[2]-12} L612,${ys[3]+12} L604,${ys[3]+12}`,st:'fill:none;stroke:var(--ink);stroke-width:1.6'},br);H.txt(br,620,(ys[2]+ys[3])/2+5,'4','lb',{st:'font:900 17px var(--f-display)'});H.O(br,0,{d:0});
  const rat=H.txt(s,320,368,'','big',{'text-anchor':'middle',st:'font-size:24px'});const epi=H.txt(s,320,400,'','lb',{'text-anchor':'middle',st:'fill:var(--dad)'});
  return [
    ()=>{H.O(top,1);ta.forEach((a,i)=>drawA(a,{at:200+i*300}))},
    ()=>{rows.forEach((R,i)=>H.O(R.G,1,{at:i*200}))},
    ()=>{rows.forEach((R,i)=>{H.T(R.tok,{x:xs[R.stop]},{d:600+R.stop*500,at:i*150});fill(R.tok,cols[R.stop],{at:i*150+600+R.stop*500});H.O(R.chip,1,{at:i*150+900+R.stop*500})})},
    ()=>{rows.forEach(R=>{R.ct.textContent=R.n});H.O(br,1,{at:300});rat.textContent='9 red : 3 yellow : 4 white'},
    ()=>{epi.textContent='aa bb = aa B_  →  A (earlier step) is epistatic to B'},
  ];}},

/* 20 ─────────────────────────────── */
{sec:'8.3',title:'Gene Interactions at a Glance',wide:true,steps:2,
text:`<div class="tblwrap" data-step="0"><table class="tbl">
<thead><tr><th>F2 ratio</th><th>Name</th><th>Which classes look the same</th><th>Molecular reason</th><th>Example</th></tr></thead>
<tbody>
<tr><td style="white-space:nowrap">9 : 3 : 3 : 1</td><td>no interaction</td><td>none: four phenotypes</td><td>the genes act in separate pathways</td><td>pea seed shape and colour</td></tr>
<tr><td>9 : 3 : 4</td><td>recessive epistasis</td><td>aaB_ = aabb</td><td>aa blocks a step that B needs</td><td>Labrador coat (ee is yellow)</td></tr>
<tr><td>12 : 3 : 1</td><td>dominant epistasis</td><td>A_B_ = A_bb</td><td>one copy of A blocks the pathway early</td><td>summer squash fruit colour</td></tr>
<tr><td>15 : 1</td><td>duplicate gene action (duplicate dominant epistasis)</td><td>A_B_ = A_bb = aaB_</td><td>either gene does the job (redundancy)</td><td>wheat seed colour; dominant suppressor</td></tr>
<tr><td>9 : 7</td><td>complementary gene action (duplicate recessive epistasis)</td><td>A_bb = aaB_ = aabb</td><td>both genes are necessary</td><td>sweet pea flower colour</td></tr>
<tr><td>13 : 3</td><td>dominant and recessive epistasis</td><td>A_B_ = A_bb = aabb</td><td>a recessive suppressor (two copies needed) hides the mutant</td><td>white-mottled flies with a recessive suppressor</td></tr>
<tr><td>9 : 6 : 1</td><td>duplicate interaction</td><td>A_bb = aaB_</td><td>the two genes add the same effect</td><td>summer squash fruit shape</td></tr>
</tbody></table></div>
<p data-step="1" class="note" style="max-width:none">The descriptions follow the classes in the order A_B_ : A_bb : aaB_ : aabb. The 9 : 3 : 4 ratio is also written 9 : 4 : 3. The 13 : 3 row uses the fly example. A = w<sup>+</sup> (dominant, red) and a = w<sup>m</sup>. B = the normal allele of the suppressor gene, and b = the recessive suppressor allele. The same 13 : 3 pattern has two names: dominant and recessive epistasis, or recessive suppression.</p>
<p data-step="1" class="star" style="max-width:none">Start from 9 : 3 : 3 : 1 and merge the classes that look the same.</p>`},

/* 21 ─────────────────────────────── */
{sec:'8.4',title:'Discrete and Continuous Variation',caption:'Left: counts of two flower colours · right: a model height distribution',
text:`<p data-step="0">Many traits come in a few clear forms, such as purple or white flowers, or red or white eyes. These traits are <b>qualitative</b>. They show <b>discrete variation</b>.</p>
<p data-step="1">Other traits have a continuous range of values that we measure: body mass, blood pressure, height, crop yield. These traits show <b>continuous variation</b>. They are <b>quantitative traits</b>.</p>
<p data-step="2">Quantitative traits are often <b>complex</b>: many genes and the environment affect them. They do not show simple ratios such as 3 : 1, but part of their variation is inherited.</p>
<p data-step="3">Around 1900, some biologists doubted Mendel for this reason. One individual has at most two alleles of each gene, but height has no separate classes. Many genes that act together explain the smooth range.</p>`,
star:'Discrete: count the classes. Continuous: measure the value.',starStep:1,
scene(H){const s=stage();const B=300;
  const L=H.g(s);H.txt(L,150,40,'DISCRETE','cap',{'text-anchor':'middle'});H.E('line',{x1:40,y1:B,x2:260,y2:B,st:'stroke:var(--ink);stroke-width:2'},L);
  const bars=[[90,180,PURPLE],[210,60,NOPIG]].map(([x,h,c])=>{const r=H.E('rect',{x:x-30,y:B-h,width:60,height:h,st:`fill:${c};stroke:var(--ink);stroke-width:1.5`},L);r.style.transformOrigin=`${x}px ${B}px`;H.T(r,{sy:.001},{d:0});return r});
  const f1=flower(L,90,B+40,24,PURPLE),f2=flower(L,210,B+40,24,NOPIG);H.txt(L,150,B+92,'2 clear classes · 3 : 1','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});H.O(L,0,{d:0});
  const R=H.g(s);H.txt(R,470,40,'CONTINUOUS','cap',{'text-anchor':'middle'});H.E('line',{x1:330,y1:B,x2:615,y2:B,st:'stroke:var(--ink);stroke-width:2'},R);
  const n=30,x0=336,w=(610-x0)/n;const hb=[];for(let i=0;i<n;i++){const z=(i+.5-n/2)/(n/5.2);const h=200*Math.exp(-z*z/2)*(0.9+0.2*Math.abs(Math.sin(i*2.7)));
    const r=H.E('rect',{x:x0+i*w+.5,y:B-h,width:w-1,height:h,st:'fill:var(--dad);opacity:.85'},R);r.style.transformOrigin=`0px ${B}px`;H.T(r,{sy:.001},{d:0});hb.push(r)}
  let d='';for(let i=0;i<=80;i++){const xx=x0+(610-x0)*i/80,z=(i/80*n-n/2)/(n/5.2);d+=(i?' L':'M')+xx.toFixed(1)+','+(B-200*Math.exp(-z*z/2)).toFixed(1)}
  const cv=H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--mom);stroke-width:3'},R);
  H.txt(R,340,B+22,'short','lbs');H.txt(R,610,B+22,'tall','lbs',{'text-anchor':'end'});H.txt(R,470,B+22,'height','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});H.O(R,0,{d:0});
  const cx=H.g(s);[['many genes',380,'dad'],['environment',560,'good']].forEach(([t,x,c],i)=>{H.txt(cx,x,74,t,'lb',{'text-anchor':'middle',st:`fill:var(--${c});font-size:13px`});
    const a=mkA(cx,x+(i?-20:20),82,470+(i?30:-30),108,{w:1.6,h:6,color:c});a.lastChild.style.opacity=1;a.firstChild.style.strokeDashoffset=0});H.O(cx,0,{d:0});
  const sum=H.g(s);H.txt(sum,470,B+52,'one person:','lbs',{'text-anchor':'middle'});const parts=['+1','+0','+1','+1','+0','+1','+0','+1'];
  parts.forEach((t,i)=>{const e=H.txt(sum,360+i*30,B+76,t,'lb',{'text-anchor':'middle',st:`font-size:13px;fill:${t==='+1'?'var(--good)':'var(--muted)'}`})});H.txt(sum,600,B+76,'= 5','lb',{'text-anchor':'middle'});H.O(sum,0,{d:0});
  return [
    ()=>{H.O(L,1);bars.forEach((r,i)=>H.T(r,{sy:1},{d:900,at:300+i*200}))},
    ()=>{H.O(R,1);hb.forEach((r,i)=>H.T(r,{sy:1},{d:700,at:i*35}));H.D(cv,1,{d:1200,at:1100})},
    ()=>{H.O(cx,1)},
    ()=>{H.O(sum,1)},
  ];}},

/* 22 ─────────────────────────────── */
{sec:'8.4',title:'More Genes, More Classes',caption:'Model: capital letter = plus allele (+1 unit), small letter = zero allele · darker box = more plus alleles',
text:`<p data-step="0">Model: each gene has a plus allele (capital letter) that adds one unit to the trait, and a zero allele (small letter) that adds nothing. The effects add up, and neither allele is dominant.</p>
<p data-step="1"><b>One gene</b> (Aa × Aa): each offspring has 0, 1 or 2 plus alleles. Three classes, 1 : 2 : 1.</p>
<p data-step="2"><b>Two genes</b> (AaBb × AaBb): 0 to 4 plus alleles. Five classes, 1 : 4 : 6 : 4 : 1 out of 16.</p>
<p data-step="3"><b>Three genes</b>: 64 boxes and seven classes, 1 : 6 : 15 : 20 : 15 : 6 : 1.</p>
<p data-step="4">A <b>histogram</b> is a bar chart of the number of individuals in each class. With more genes, and with effects of the environment, the classes overlap and the histogram becomes a smooth bell curve. Because many genes control them, quantitative traits are also called <b>polygenic traits</b>. In real traits, some genes have large effects and others small ones. One gene can also affect several traits.</p>`,
star:'More genes → more classes → a smooth bell curve.',starStep:4,
scene(H){const s=stage();const B=360,HX0=300,HX1=626;
  const shade=(k,m)=>`color-mix(in srgb, var(--dad) ${Math.round(8+86*k/m)}%, var(--card))`;
  const ax=H.g(s);H.E('line',{x1:HX0-4,y1:B,x2:HX1,y2:B,st:'stroke:var(--ink);stroke-width:2'},ax);H.txt(ax,(HX0+HX1)/2,B+42,'number of plus alleles (trait value)','lbs',{'text-anchor':'middle'});H.O(ax,0,{d:0});
  const ticks=H.g(s);
  const make=(n,cs,gx,gy,bh)=>{const N=1<<n,m=2*n;const G=H.g(s);const gam=[];for(let i=0;i<N;i++){const bits=[];for(let b=0;b<n;b++)bits.push((i>>(n-1-b))&1?0:1);gam.push(bits)}
    const L='ABC';const cells=[];const cnt=new Array(m+1).fill(0);const cw=(HX1-HX0)/(m+1);
    for(let r=0;r<N;r++)for(let c=0;c<N;c++){let k=0;let g='';for(let b=0;b<n;b++){const x=gam[r][b],y=gam[c][b];k+=x+y;g+=(x||y)?(x&&y?L[b]+L[b]:L[b]+L[b].toLowerCase()):L[b].toLowerCase()+L[b].toLowerCase()}
      const C=H.g(G);H.T(C,{x:gx+c*cs,y:gy+r*cs},{d:0});const rr=H.E('rect',{x:.5,y:.5,width:cs-1,height:cs-1,rx:cs>20?3:1.5,cls:'nss',st:`fill:${shade(k,m)};stroke:var(--ink);stroke-width:${cs>20?1.2:.6}`},C);
      if(cs>=26){const t=H.txt(C,cs/2,cs/2+4,g,'lbs',{'text-anchor':'middle',st:`font-size:${cs>36?13:9}px;font-weight:600;fill:${k/m>.55?'#fff':'var(--ink)'}`});C.t=t}
      C.k=k;C.sl=cnt[k]++;cells.push(C)}
    const gh=H.g(G);H.E('rect',{x:gx,y:gy,width:N*cs,height:N*cs,rx:4,st:'fill:none;stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 4'},gh);
    G.gh=gh;const sc=(cw-4)/cs,sy=bh/cs;
    G.drop=(o)=>{H.O(G.gh,0,{d:600,at:(o.at||0)+800});cells.forEach((C,i)=>{const x=HX0+C.k*cw+2,y=B-(C.sl+1)*bh;H.T(C,{x,y,sx:sc,sy},Object.assign({d:1100},o,{at:(o.at||0)+i*(n===3?8:40)}));if(C.t)H.O(C.t,0,{d:200,at:o.at||0})})};
    G.ticks=()=>{ticks.innerHTML='';for(let k=0;k<=m;k++)H.txt(ticks,HX0+(k+.5)*cw,B+18,String(k),'lbs',{'text-anchor':'middle'})};
    G.cnt=cnt;G.cw=cw;H.O(G,0,{d:0});return G};
  const G1=make(1,56,64,120,70),G2=make(2,36,40,90,34),G3=make(3,19,30,70,12.5);
  const lab=H.txt(s,150,46,'','lb',{'text-anchor':'middle',st:'font-size:15px'}),rat=H.txt(s,(HX0+HX1)/2,40,'','lb',{'text-anchor':'middle',st:'font-size:14px;fill:var(--dad)'});
  const cw3=(HX1-HX0)/7;let d='';for(let i=0;i<=120;i++){const kk=-0.5+i/120*7,x=HX0+(kk+.5)*cw3;const z=(kk-3)/Math.sqrt(1.5);d+=(i?' L':'M')+x.toFixed(1)+','+(B-20*12.5*Math.exp(-z*z/2)).toFixed(1)}
  const bell=H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--mom);stroke-width:3.5'},s);
  const pol=[H.txt(s,150,250,'','lb',{'text-anchor':'middle',st:'fill:var(--mom)'}),H.txt(s,150,270,'','lb',{'text-anchor':'middle',st:'fill:var(--mom)'})];
  const run=(G,txt,r,prev)=>{if(prev)H.O(prev,0,{d:500});H.O(ax,1);H.O(G,1,{d:500,at:300});G.ticks();lab.textContent=txt;rat.textContent=r;H.after(1200,inst=>G.drop({d:inst?0:1100}))};
  return [
    ()=>{H.O(ax,1)},
    ()=>run(G1,'1 gene · 2 × 2 = 4 boxes','1 : 2 : 1'),
    ()=>run(G2,'2 genes · 4 × 4 = 16 boxes','1 : 4 : 6 : 4 : 1',G1),
    ()=>run(G3,'3 genes · 8 × 8 = 64 boxes','1 : 6 : 15 : 20 : 15 : 6 : 1',G2),
    ()=>{H.D(bell,1,{d:1400});pol[0].textContent='many genes + environment:';pol[1].textContent='a smooth curve'},
  ];}},

/* 23 ─────────────────────────────── */
{sec:'8.5',title:'Genotype + Environment = Phenotype',caption:'Hydrangea, one plant with many flower colours · Cinderkinder, CC BY-SA 4.0, via Wikimedia Commons',
text:`<p data-step="0">Most phenotypes depend on the genotype and on the environment. In short: <b>G + E ⇒ P</b> (genotype plus environment gives phenotype).</p>
<p data-step="1">Often the effect of a gene depends on the environment. This extra part is the gene–environment interaction, I<sub>GE</sub>: <b>G + E + I<sub>GE</sub> ⇒ P</b>.</p>
<p data-step="2">Example: hydrangea flowers. The same plant can have blue flowers in acid soil and pink flowers in alkaline soil. In acid soil, the roots take up aluminium, and aluminium makes the flower pigment blue. White hydrangeas stay white in any soil. So the effect of the soil depends on the genotype: that is I<sub>GE</sub>.</p>
<p data-step="3">Example: a genotype can increase the risk of a cancer. The cancer often develops only after exposure to <b>carcinogens</b>, chemicals that damage DNA. So not every person with the genotype gets the cancer.</p>`,
star:'G + E + I<sub>GE</sub> ⇒ P.',starStep:1,
scene(H){const s=stage();photo(s,'@@asset:c8-hydrangea.jpg@@',6,8,228,304,{r:10});
  const bx=(x,y,w,t,c)=>{const G=H.g(s);H.E('rect',{x,y,width:w,height:40,rx:8,st:`fill:${c};stroke:var(--ink);stroke-width:1.5`},G);H.txt(G,x+w/2,y+26,t,'lb',{'text-anchor':'middle',st:'font-size:15px'});H.O(G,0,{d:0});return G};
  const y0=30;const g=bx(262,y0,44,'G','var(--dad-tint)'),p1=H.txt(s,318,y0+27,'+','lb',{'text-anchor':'middle',st:'font-size:18px'}),e=bx(330,y0,44,'E','color-mix(in srgb, var(--good) 24%, var(--card))');
  const p2=H.txt(s,386,y0+27,'+','lb',{'text-anchor':'middle',st:'font-size:18px'}),i=bx(398,y0,62,'I_GE','var(--mom-tint)');
  i.querySelector('text').textContent='';rt(i,429,y0+26,'I_{GE}','lb',{'text-anchor':'middle',st:'font-size:15px'});
  const ar=H.txt(s,486,y0+27,'⇒','lb',{'text-anchor':'middle',st:'font-size:20px'}),P=bx(506,y0,44,'P','var(--wash)');[p1,p2,ar].forEach(t=>H.O(t,0,{d:0}));
  // pH scale
  const ph=H.g(s);const X0=270,X1=616,Y=170;const grad=H.E('defs',{},ph);const lg=H.E('linearGradient',{id:'c8ph',x1:0,x2:1,y1:0,y2:0},grad);
  H.E('stop',{offset:'0%',st:'stop-color:var(--dad)'},lg);H.E('stop',{offset:'100%',st:'stop-color:color-mix(in srgb, var(--bad) 55%, var(--card))'},lg);
  H.E('rect',{x:X0,y:Y,width:X1-X0,height:16,rx:8,st:'fill:url(#c8ph);stroke:var(--ink);stroke-width:1.2'},ph);
  H.txt(ph,X0,Y+36,'acid soil (pH 5)','lbs');H.txt(ph,X1,Y+36,'alkaline soil (pH 7.5)','lbs',{'text-anchor':'end'});H.txt(ph,X0,Y-14,'SAME GENOTYPE, DIFFERENT SOIL','cap');
  flower(ph,X0+26,Y+72,24,BLU);H.txt(ph,X0+58,Y+70,'aluminium taken up','lbs',{st:'fill:var(--ink);font-weight:600'});H.txt(ph,X0+58,Y+86,'→ blue','lbs',{st:'fill:var(--ink);font-weight:600'});
  const fl=flower(ph,X0+26,Y+72,24,BLU);H.O(fl,0,{d:0});const al=H.g(ph);H.txt(al,X1-58,Y+70,'little aluminium','lbs',{'text-anchor':'end',st:'fill:var(--ink);font-weight:600'});H.txt(al,X1-58,Y+86,'taken up → pink','lbs',{'text-anchor':'end',st:'fill:var(--ink);font-weight:600'});H.O(al,0,{d:0});H.O(ph,0,{d:0});
  // cancer rows
  const cr=H.g(s);const cy=[326,378];H.txt(cr,262,302,'RISK GENOTYPE','cap');
  [[0,'no carcinogen','no cancer','good'],[1,'+ carcinogen (DNA damage)','cancer can develop','bad']].forEach(([k,a,b,c])=>{const y=cy[k];
    H.E('rect',{x:262,y:y-14,width:28,height:28,rx:5,st:'fill:var(--dad-tint);stroke:var(--ink);stroke-width:1.4'},cr);H.txt(cr,276,y+5,'G','lb',{'text-anchor':'middle',st:'font-size:13px'});
    H.txt(cr,300,y+5,a,'lbs',{st:'fill:var(--ink);font-weight:600'});H.txt(cr,616,y+5,b,'lb',{'text-anchor':'end',st:`font-size:13px;fill:var(--${c})`})});H.O(cr,0,{d:0});
  return [
    ()=>{H.O(g,1);H.O(p1,1,{at:200});H.O(e,1,{at:300});H.O(ar,1,{at:500});H.O(P,1,{at:600})},
    ()=>{H.O(p2,1);H.O(i,1,{at:200})},
    ()=>{H.O(ph,1);H.O(fl,1,{d:0});H.T(fl,{x:X1-26},{d:1600,at:800});fill(fl.pet,'color-mix(in srgb, var(--bad) 55%, var(--card))',{d:1600,at:800});H.O(al,1,{at:2200})},
    ()=>{H.O(cr,1)},
  ];}},

/* 24 ─────────────────────────────── */
{sec:'8.5',title:'Penetrance',caption:'Each icon = one individual with the genotype · filled = shows the phenotype · risk figure: carriers followed to age 80',
text:`<p data-step="0"><b>Penetrance</b> is the percentage of individuals with a given genotype who show the phenotype of that genotype.</p>
<p data-step="1">If all of them show it, the penetrance is complete (100%). Every pea plant with the white-flower genotype aa has white flowers.</p>
<p data-step="2">If some do not show it, the penetrance is <b>incomplete</b>. Many human disease genotypes have incomplete penetrance. Example: about 7 in 10 women with one broken copy of BRCA1 develop breast cancer by age 80.</p>
<p data-step="3">BRCA1 makes a protein that helps to repair DNA. A <b>carrier</b> is a person with one broken copy. Every cell of a carrier still has one working copy. A cancer usually starts in a cell that also loses this second copy, by chance or after DNA damage.</p>
<p data-step="4">So chance, the environment and the alleles of other genes decide whether a carrier shows the phenotype.</p>`,
star:'Penetrance: does the genotype show at all?',starStep:1,
scene(H){const s=stage();
  const person=(p,x,y,on)=>{const G=at(p,x,y);const c1=H.E('circle',{cy:-14,r:7,st:`fill:${on?'var(--bad)':'var(--card)'};stroke:var(--ink);stroke-width:1.5`},G);
    const c2=H.E('path',{d:'M-11,12 L-11,2 C-11,-6 11,-6 11,2 L11,12 Z',st:`fill:${on?'var(--bad)':'var(--card)'};stroke:var(--ink);stroke-width:1.5`},G);G.parts=[c1,c2];return G};
  const r1=H.g(s);H.txt(r1,20,40,'PEA PLANTS, WHITE-FLOWER GENOTYPE','cap');const fls=[];for(let i=0;i<10;i++){fls.push(flower(r1,40+i*44,76,17,NOPIG))}
  H.txt(r1,620,82,'10 of 10 = 100%','lb',{'text-anchor':'end'});rt(r1,20,112,'aa: all white, complete penetrance','lbs');H.O(r1,0,{d:0});
  const r2=H.g(s);H.txt(r2,20,150,'WOMEN WITH ONE BROKEN BRCA1 COPY','cap');const pp=[];for(let i=0;i<10;i++)pp.push(person(r2,40+i*44,188,false));
  const r2t=H.txt(r2,620,194,'7 of 10 ≈ 70%','lb',{'text-anchor':'end'});H.txt(r2,20,224,'breast cancer by age 80: incomplete penetrance','lbs');H.O(r2,0,{d:0});
  // two-hit cell
  const cl=H.g(s);const cx=150,cy=320;H.E('circle',{cx,cy,r:58,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},cl);H.txt(cl,cx,cy+80,'one cell of a carrier','lbs',{'text-anchor':'middle'});
  const c1=chrom(cl,cx-18,cy-36,cy+36,'dad',{band:cy,label:'+',w:10,bfill:'var(--good)'}),c2=chrom(cl,cx+18,cy-36,cy+36,'mom',{band:cy,label:'−',w:10,bfill:'var(--bad)'});
  const bolt=H.E('path',{d:'M0,0 L-10,18 L0,18 L-8,36',st:'fill:none;stroke:var(--hi);stroke-width:4;stroke-linecap:round;stroke-linejoin:round'},cl);H.T(bolt,{x:cx-4,y:cy-90},{d:0});H.O(bolt,0,{d:0});
  const bl=H.txt(cl,cx+30,cy-72,'chance or DNA damage','lbs',{st:'fill:var(--ink);font-weight:600'});H.O(bl,0,{d:0});
  const res=H.txt(cl,250,cy-10,'','lb',{st:'font-size:14px'});const res2=H.txt(cl,250,cy+10,'','lbs');H.O(cl,0,{d:0});
  const cz=H.g(s);[['chance',0],['environment',1],['other genes',2]].forEach(([t,i])=>{H.E('rect',{x:250+i*126,y:362,width:116,height:28,rx:14,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.3'},cz);H.txt(cz,308+i*126,381,t,'lb',{'text-anchor':'middle',st:'font-size:13px'})});H.O(cz,0,{d:0});
  return [
    ()=>{},
    ()=>{H.O(r1,1)},
    ()=>{H.O(r2,1);[0,1,3,4,6,7,9].forEach((k,j)=>fill(pp[k].parts,'var(--bad)',{at:400+j*120}))},
    ()=>{H.O(cl,1);res.textContent='one working copy left';res2.textContent='the cell repairs DNA';
      H.after(1000,inst=>{H.O(bolt,1,{d:inst?0:200});H.O(bl,1,{d:inst?0:300});fill(c1.band.r,RED,{d:inst?0:500,at:inst?0:300});c1.band.t.textContent='−';
        res.textContent='no working copy left';res2.textContent='damage collects: a cancer can start'})},
    ()=>{H.O(cz,1)},
  ];}},

/* 25 ─────────────────────────────── */
{sec:'8.5',title:'Expressivity',caption:'Fly wings, one mutant genotype · J. Locke (2017), CC BY-SA, Open Genetics Lectures',
text:`<p data-step="0"><b>Expressivity</b> is how strongly the phenotype shows in the individuals that have it. In <b>narrow</b> expressivity, they all look alike. In <b>broad</b> (variable) expressivity, the severity differs.</p>
<p data-step="1">Example: fruit flies with the same wing mutation. In some flies the gap in one wing vein (arrows) is small. In others it is large.</p>
<p data-step="2">Many human genetic diseases have broad expressivity. People with the same genotype can have mild or severe symptoms.</p>
<p data-step="3">Penetrance and expressivity are separate measures. Penetrance asks whether the phenotype shows. Expressivity asks how strongly it shows. The same causes act on both.</p>`,
star:'Penetrance: whether. Expressivity: how much.',starStep:3,
scene(H){const s=stage();photo(s,'@@asset:c8-fly-wings.jpg@@',6,16,262,338,{r:8,fit:'xMidYMid meet'});
  const panel=(x,y,title,vals)=>{const G=H.g(s);H.txt(G,x,y-12,title,'lb',{st:'font-size:13px'});const dots=vals.map((v,i)=>{const c=H.E('circle',{cx:x+14+(i%4)*36,cy:y+16+Math.floor(i/4)*36,r:13,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},G);c.v=v;return c});G.dots=dots;H.O(G,0,{d:0});return G};
  const P=[panel(300,70,'complete, narrow',[1,1,1,1,1,1,1,1]),panel(476,70,'complete, broad',[1,.25,.7,.45,.9,.15,.6,.35]),
    panel(300,240,'incomplete, narrow',[1,0,1,1,0,1,0,1]),panel(476,240,'incomplete, broad',[.8,0,.3,1,0,.55,0,.2])];
  const show=G=>{H.O(G,1);G.dots.forEach((c,i)=>{if(c.v>0)fill(c,`color-mix(in srgb, var(--bad) ${Math.round(c.v*100)}%, var(--card))`,{at:300+i*80})})};
  const lg=H.g(s);H.txt(lg,300,366,'each circle = one individual with the mutant genotype','lbs');H.txt(lg,300,384,'darker = stronger phenotype · empty = no phenotype','lbs');H.O(lg,0,{d:0});
  return [()=>{show(P[0]);H.O(lg,1)},()=>{show(P[1])},()=>{},()=>{show(P[2]);show(P[3])}];}},

/* 26 ─────────────────────────────── */
{sec:'8.6',title:'Lethal Alleles Change the Ratio',caption:'Tailless ("rumpy") Manx cat · EliasAlucard, CC BY-SA 3.0, via Wikimedia Commons',
text:`<p data-step="0">Some genotypes kill the embryo. Those individuals are missing when we count the offspring, so the ratio changes.</p>
<p data-step="1">Manx cats have no tail or a short tail. The Manx allele, M, is a mutation in the gene TBXT, which helps to form the tail and the lower spine in the embryo. One copy of M shortens the tail, so M is dominant for the tail. The tail length varies from cat to cat: broad expressivity.</p>
<p data-step="2">Two copies of M kill the embryo early in development. For survival, M is a <b>recessive lethal</b> allele.</p>
<p data-step="3">Mm × Mm gives 1 MM : 2 Mm : 1 mm at fertilization. The MM embryos die, so the kittens are 2 Manx : 1 tailed, not 3 : 1.</p>
<p data-step="4"><b>Recessive lethal mutations</b> also change dihybrid ratios. In fruit flies, a genotype that dies as an embryo or larva is missing when we count the adults.</p>`,
star:'Lethal homozygote: 3 : 1 becomes 2 : 1.',starStep:3,
scene(H){const s=stage();photo(s,'@@asset:c8-manx-cat.jpg@@',6,8,250,205,{r:10});
  const gn=H.g(s);H.E('line',{x1:30,y1:262,x2:232,y2:262,st:'stroke:var(--dad);stroke-width:10;stroke-linecap:round'},gn);H.E('rect',{x:110,y:252,width:46,height:20,rx:4,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.4'},gn);
  H.txt(gn,133,267,'TBXT','lbs',{'text-anchor':'middle',st:'fill:#16181d;font-weight:700'});H.txt(gn,133,294,'M = Manx allele','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});H.O(gn,0,{d:0});
  const gx=360,gy=60,cs=80;const hd=H.g(s);[['M',0],['m',1]].forEach(([t,i])=>{H.txt(hd,gx+i*cs+cs/2,gy-10,t,'mt',{'text-anchor':'middle',st:'font-size:18px;fill:var(--mom)'});H.txt(hd,gx-12,gy+i*cs+cs/2+6,t,'mt',{'text-anchor':'end',st:'font-size:18px;fill:var(--dad)'})});H.O(hd,0,{d:0});
  const gts=[['MM',0,0],['Mm',0,1],['Mm',1,0],['mm',1,1]];const cells=gts.map(([g,r,c])=>{const G=H.g(s);const x=gx+c*cs,y=gy+r*cs;
    G.r=H.E('rect',{x:x+2,y:y+2,width:cs-4,height:cs-4,rx:8,st:`fill:${g==='mm'?'var(--card)':'var(--mom-tint)'};stroke:var(--ink);stroke-width:1.5`},G);
    H.txt(G,x+cs/2,y+cs/2-2,g,'mt',{'text-anchor':'middle',st:'font-size:20px'});H.txt(G,x+cs/2,y+cs/2+18,g==='MM'?'dies':g==='mm'?'tailed':'Manx','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});
    G.x=x;G.y=y;H.O(G,0,{d:0});return G});
  const X=xmark(s,gx+cs/2,gy+cs/2,30,{w:5});
  const tl=H.g(s);const B=360;H.E('line',{x1:300,y1:B,x2:620,y2:B,st:'stroke:var(--ink);stroke-width:2'},tl);
  const bar=(x,n,c,t)=>{const r=H.E('rect',{x:x,y:B-n*36,width:60,height:n*36,st:`fill:${c};stroke:var(--ink);stroke-width:1.5`},tl);r.style.transformOrigin=`0px ${B}px`;H.T(r,{sy:.001},{d:0});H.txt(tl,x+30,B+18,t,'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});return r};
  const b1=bar(330,2,'var(--mom-tint)','Manx (Mm)'),b2=bar(430,1,'var(--card)','tailed (mm)'),b0=bar(530,1,'var(--faint)','MM: none born');
  const rat=H.txt(tl,620,B-90,'','big',{'text-anchor':'end',st:'font-size:24px'});H.O(tl,0,{d:0});
  return [
    ()=>{},
    ()=>{H.O(gn,1)},
    ()=>{H.O(hd,1);cells.forEach((G,i)=>H.O(G,1,{at:i*150}))},
    ()=>{H.D(X.firstChild,1,{d:600});H.O(cells[0],.35,{at:400});H.O(tl,1,{at:500});H.T(b1,{sy:1},{d:800,at:700});H.T(b2,{sy:1},{d:800,at:800});H.T(b0,{sy:1},{d:400,at:600});H.T(b0,{sy:.001},{d:600,at:1200});H.after(1300,()=>{rat.textContent='2 : 1'})},
    ()=>{},
  ];}},

/* 27 ─────────────────────────────── */
{sec:'8.6',title:'Same Phenotype, Different Causes',caption:'Pedigree (family tree) symbols: square = male, circle = female, filled = deaf · genotypes are a model',
text:`<p data-step="0"><b>Genetic heterogeneity</b>: mutations in different genes, or different genetic mechanisms, give the same phenotype. Example: inherited deafness. Mutations in more than 100 different genes can cause it.</p>
<p data-step="1">Two deaf parents with mutations in different genes (aa BB × AA bb) can have children who all hear (Aa Bb). Each child has a working copy of both genes: the logic of complementary genes.</p>
<p data-step="2">A <b>phenocopy</b> is a phenotype that the environment causes and that copies a genetic phenotype. Example: rubella (German measles) infection during pregnancy can make the baby deaf, but the child has no deafness genotype.</p>
<p data-step="3"><b>Polygenic determination</b>: many genes control one trait, as in polygenic traits. Heterogeneity, phenocopies, incomplete penetrance and lethal genotypes all move real counts away from Mendelian ratios.</p>`,
star:'Same phenotype ≠ same genotype.',starStep:2,
scene(H){const s=stage();
  const sym=(p,x,y,sex,on,lab)=>{const G=H.g(p);const st=`fill:${on?'var(--ink)':'var(--card)'};stroke:var(--ink);stroke-width:2`;
    G.sh=sex==='m'?H.E('rect',{x:x-15,y:y-15,width:30,height:30,st},G):H.E('circle',{cx:x,cy:y,r:15,st},G);
    if(lab)rt(G,x,y+34,lab,'mt',{'text-anchor':'middle',st:'font-size:14px'});return G};
  // genes strip
  const gs=H.g(s);H.txt(gs,20,30,'GENES FOR HEARING','cap');for(let i=0;i<22;i++){H.E('rect',{x:20+i*27,y:42,width:20,height:14,rx:3,st:`fill:${i===3?'var(--hi)':'var(--wash)'};stroke:var(--ink);stroke-width:1.1`},gs)}
  H.txt(gs,20,74,'more than 100 genes: broken copies of any one of them can cause deafness','lbs');H.txt(gs,20,90,'yellow = GJB2, the most common cause in many populations','lbs');H.O(gs,0,{d:0});
  // family 1
  const f1=H.g(s);H.txt(f1,20,118,'FAMILY 1 · HETEROGENEITY','cap');
  sym(f1,70,150,'m',1,'aa BB');sym(f1,190,150,'f',1,'AA bb');H.E('line',{x1:85,y1:150,x2:175,y2:150,st:'stroke:var(--ink);stroke-width:2'},f1);
  H.E('path',{d:'M130,150 L130,200 M70,200 L190,200 M70,200 L70,216 M130,200 L130,216 M190,200 L190,216',st:'fill:none;stroke:var(--ink);stroke-width:2'},f1);
  [[70,'m'],[130,'f'],[190,'m']].forEach(([x,sx])=>sym(f1,x,231,sx,0,'Aa Bb'));H.txt(f1,130,296,'all children hear','lb',{'text-anchor':'middle',st:'font-size:13px;fill:var(--good)'});H.O(f1,0,{d:0});
  // family 2
  const f2=H.g(s);H.txt(f2,360,118,'FAMILY 2 · PHENOCOPY','cap');
  sym(f2,410,150,'m',0,'');sym(f2,530,150,'f',0,'');H.E('line',{x1:425,y1:150,x2:515,y2:150,st:'stroke:var(--ink);stroke-width:2'},f2);
  H.E('path',{d:'M470,150 L470,216',st:'fill:none;stroke:var(--ink);stroke-width:2'},f2);const ch=sym(f2,470,231,'f',1,'');
  H.txt(f2,470,272,'no deafness genotype','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});
  const vir=at(f2,580,226);H.E('circle',{r:11,st:'fill:var(--bad);opacity:.85;stroke:var(--ink);stroke-width:1.4'},vir);for(let k=0;k<8;k++){const a=k*Math.PI/4;H.E('line',{x1:11*Math.cos(a),y1:11*Math.sin(a),x2:17*Math.cos(a),y2:17*Math.sin(a),st:'stroke:var(--ink);stroke-width:1.6'},vir)}
  H.txt(f2,580,258,'rubella virus','lbs',{'text-anchor':'middle'});H.txt(f2,580,274,'in pregnancy','lbs',{'text-anchor':'middle'});const va=mkA(f2,562,230,492,231,{w:1.8,h:6});H.O(f2,0,{d:0});
  const pg=H.g(s);H.txt(pg,20,336,'POLYGENIC DETERMINATION','cap');for(let i=0;i<9;i++){const x=40+i*40;H.E('rect',{x:x-12,y:350,width:24,height:14,rx:3,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.1'},pg);
    const a=mkA(pg,x,366,480,392,{w:1.1,h:5,color:'muted'});a.firstChild.style.strokeDashoffset=0;a.lastChild.style.opacity=1}
  H.E('rect',{x:486,y:378,width:130,height:28,rx:14,st:'fill:var(--mom-tint);stroke:var(--ink);stroke-width:1.4'},pg);H.txt(pg,551,397,'one trait','lb',{'text-anchor':'middle',st:'font-size:13px'});H.O(pg,0,{d:0});
  return [()=>{H.O(gs,1)},()=>{H.O(f1,1)},()=>{H.O(f2,1);drawA(va,{at:500})},()=>{H.O(pg,1)}];}},

/* 28 ─────────────────────────────── */
{sec:'8.6',title:'Linkage and Sex Linkage',caption:'Left: an AB/ab dihybrid, gamete shares are example values · right: an X-linked cross',
text:`<p data-step="0"><b>Linkage</b>: two loci close together on the same chromosome usually go into the same gamete. In an AB/ab dihybrid, A and B sit on one chromosome and a and b on the other. Its <b>parental</b> gametes are AB and ab.</p>
<p data-step="0">Such a dihybrid makes more parental gametes than new combinations, so the cross does not give 9 : 3 : 3 : 1.</p>
<p data-step="1"><b>Crossing over</b> is an exchange of segments between the two chromosomes of a pair in meiosis. The new combinations Ab and aB are the result of crossing over between the two loci. The closer the loci, the fewer the crossovers.</p>
<p data-step="2"><b>Sex linkage</b>: the gene is on the X chromosome. A male has one X, so he has only one copy of each X gene. A female has two.</p>
<p data-step="3">Example: X<sup>A</sup>X<sup>a</sup> × X<sup>A</sup>Y. All daughters show the dominant phenotype. Half of the sons show the recessive phenotype. The ratio differs between sons and daughters.</p>`,
star:'Linked genes travel together. X genes count once in males.',starStep:3,
scene(H){const s=stage();
  const L=H.g(s);H.txt(L,20,34,'LINKAGE','cap');
  const ch=(x,col,a,b)=>{H.E('line',{x1:x,y1:60,x2:x,y2:230,st:`stroke:var(--${col});stroke-width:14;stroke-linecap:round`},L);
    [[a,110],[b,150]].forEach(([t,y])=>{H.E('rect',{x:x-13,y:y-10,width:26,height:20,rx:4,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.4'},L);H.txt(L,x,y+5,t,'lb',{'text-anchor':'middle',st:'font-size:13px;fill:#16181d'})})};
  ch(50,'dad','A','B');ch(106,'mom','a','b');H.txt(L,78,256,'A and B: close together','lbs',{'text-anchor':'middle'});
  const gm=[['AB','parental',.42,'dad-tint'],['ab','parental',.42,'mom-tint'],['Ab','crossover',.08,'wash'],['aB','crossover',.08,'wash']];
  const bars=gm.map(([t,k,f,c],i)=>{const y=80+i*44;const G=H.g(L);H.txt(G,150,y+5,t,'lb',{st:'font-size:14px'});const r=H.E('rect',{x:178,y:y-11,width:1,height:22,cls:'nss',st:`fill:var(--${c});stroke:var(--ink);stroke-width:1.2`},G);
    H.T(r,{sx:.001},{d:0});r.style.transformOrigin='178px 0px';const p=H.txt(G,226,y+5,'','lbs',{st:'fill:var(--ink);font-weight:600'});G.r=r;G.f=f;G.p=p;G.k=k;H.O(G,0,{d:0});return G});
  const xo=H.E('path',{d:'M50,130 C70,128 86,132 106,130',st:'fill:none;stroke:var(--bad);stroke-width:3;stroke-dasharray:4 3'},L);H.O(xo,0,{d:0});const xol=H.txt(L,78,282,'crossover: rare','lbs',{'text-anchor':'middle',st:'fill:var(--bad);font-weight:600'});H.O(xol,0,{d:0});
  H.O(L,0,{d:0});
  const sep=H.E('line',{x1:320,y1:24,x2:320,y2:400,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);H.O(sep,0,{d:0});
  const R=H.g(s);H.txt(R,345,34,'SEX LINKAGE','cap');
  const xs=(p,x,y,t,col,isY)=>{const G=at(p,x,y);H.E('rect',{x:-30,y:-14,width:60,height:28,rx:14,st:`fill:var(--${col}-tint);stroke:var(--${col});stroke-width:2`},G);rt(G,0,6,t,'lb',{'text-anchor':'middle',st:'font-size:15px'});return G};
  xs(R,420,76,'X^A X^a','mom');H.txt(R,486,82,'×','lb',{'text-anchor':'middle',st:'font-size:18px'});xs(R,552,76,'X^A Y','dad');
  H.txt(R,420,108,'mother (carrier)','lbs',{'text-anchor':'middle'});H.txt(R,552,108,'father','lbs',{'text-anchor':'middle'});
  const gx=440,gy=150,cs=78;[['X^A',0],['X^a',1]].forEach(([t,i])=>rt(R,gx+i*cs+cs/2,gy-8,t,'lb',{'text-anchor':'middle',st:'fill:var(--mom);font-size:14px'}));
  [['X^A',0],['Y',1]].forEach(([t,i])=>rt(R,gx-10,gy+i*cs+cs/2+5,t,'lb',{'text-anchor':'end',st:'fill:var(--dad);font-size:14px'}));
  const cells=[['X^A X^A','daughter',0],['X^A X^a','daughter',0],['X^A Y','son',0],['X^a Y','son',1]].map(([g,w,aff],i)=>{const r=Math.floor(i/2),c=i%2;const G=H.g(R);
    H.E('rect',{x:gx+c*cs+2,y:gy+r*cs+2,width:cs-4,height:cs-4,rx:8,st:`fill:${aff?'color-mix(in srgb, var(--bad) 25%, var(--card))':'var(--card)'};stroke:var(--ink);stroke-width:1.5`},G);
    rt(G,gx+c*cs+cs/2,gy+r*cs+cs/2-2,g,'lb',{'text-anchor':'middle',st:'font-size:14px'});H.txt(G,gx+c*cs+cs/2,gy+r*cs+cs/2+17,aff?'recessive':w,'lbs',{'text-anchor':'middle',st:`${aff?'fill:var(--bad);font-weight:700':''}`});H.O(G,0,{d:0});return G});
  const sm=H.g(R);H.txt(sm,480,340,'daughters: all dominant phenotype','lb',{'text-anchor':'middle',st:'font-size:13px'});H.txt(sm,480,362,'sons: 1 dominant : 1 recessive','lb',{'text-anchor':'middle',st:'font-size:13px;fill:var(--bad)'});H.O(sm,0,{d:0});
  H.O(R,0,{d:0});
  return [
    ()=>{H.O(L,1);bars.slice(0,2).forEach((G,i)=>{H.O(G,1,{at:400+i*200});H.T(G.r,{sx:76*G.f/.42},{d:900,at:400+i*200})});
      bars.forEach(G=>{G.p.setAttribute('x',178+76*G.f/.42+8)});H.after(1000,()=>{bars.slice(0,2).forEach(G=>{G.p.textContent='parental'})})},
    ()=>{H.O(xo,1);H.O(xol,1);bars.slice(2).forEach((G,i)=>{H.O(G,1,{at:300+i*200});H.T(G.r,{sx:76*G.f/.42},{d:900,at:300+i*200})});H.after(1000,()=>{bars.slice(2).forEach(G=>{G.p.textContent='new'})})},
    ()=>{H.O(sep,1);H.O(R,1)},
    ()=>{cells.forEach((G,i)=>H.O(G,1,{at:i*200}));H.O(sm,1,{at:1000})},
  ];}},

/* 29 ─────────────────────────────── */
{sec:'8.7',title:'Summary',wide:true,steps:2,
text:`<div class="cols" data-step="0"><div><h3>Two genes, one trait</h3><ul>
<li>A phenotype depends on the alleles, their dominance, and often on other genes and the environment.</li>
<li>The alleles of different loci assort independently, unless the loci are linked. With complete dominance and no gene interaction, a dihybrid cross gives 9 : 3 : 3 : 1.</li>
<li>Gene interaction merges classes of 9 : 3 : 3 : 1. The modified ratios are 9 : 3 : 4 (recessive epistasis), 12 : 3 : 1 (dominant epistasis), 15 : 1 (duplicate genes) and 9 : 7 (complementary genes). Two more are 13 : 3 and 9 : 6 : 1.</li>
<li>A modified ratio usually means that the two genes act in the same pathway. Follow the pathway to predict the ratio.</li>
<li>A suppressor mutation makes a mutant more like the wild type. An enhancer mutation makes it more mutant.</li>
</ul></div><div><h3>Quantitative traits and other deviations</h3><ul>
<li>Many traits show continuous variation. They are quantitative (polygenic) traits. The effects of many genes add up and give a bell curve. Some genes have large effects, and others small ones.</li>
<li>Many quantitative traits depend on genes and the environment: G + E ⇒ P.</li>
<li>Penetrance tells whether a genotype shows. Expressivity tells how strongly it shows.</li>
<li>Genetic heterogeneity, polygenic determination, phenocopies, incomplete penetrance, lethal genotypes, linkage and sex linkage also change the expected ratios.</li>
</ul></div></div>
<p data-step="1" class="star" style="max-width:none">Pathway first, ratio second.</p>`},

/* 30 ─────────────────────────────── */
{sec:'8.8',title:'Key Terms',wide:true,steps:1,
text:`<div class="terms" data-step="0">
<div class="term"><b>Dihybrid</b>An individual that is heterozygous at two loci, for example AaBb.</div>
<div class="term"><b>Independent assortment</b>The alleles of two loci go into the gametes independently of each other.</div>
<div class="term"><b>Mendel's Second Law</b>Two loci assort independently during gamete formation.</div>
<div class="term"><b>Linkage</b>Two loci close together on one chromosome usually go into the same gamete.</div>
<div class="term"><b>Modified Mendelian ratios</b>Dihybrid ratios that differ from 9 : 3 : 3 : 1. With gene interaction, some of the four classes merge.</div>
<div class="term"><b>Epistasis</b>The alleles of one gene hide the effect of another gene. The gene that hides is epistatic, and the hidden gene is hypostatic.</div>
<div class="term"><b>Recessive epistasis</b>A homozygous recessive genotype of one gene hides another gene. F2 ratio 9 : 3 : 4.</div>
<div class="term"><b>Dominant epistasis</b>A dominant allele of one gene hides another gene. F2 ratio 12 : 3 : 1.</div>
<div class="term"><b>Duplicate gene action</b>Two genes do the same job, so one working gene is enough. F2 ratio 15 : 1.</div>
<div class="term"><b>Redundancy</b>Two genes have the same function, so the loss of one gene has no effect.</div>
<div class="term"><b>Complementary gene action</b>Two genes are both necessary for one phenotype. The loss of either gene, or both, gives the same phenotype. F2 ratio 9 : 7.</div>
<div class="term"><b>Suppressor and enhancer</b>A suppressor mutation makes a mutant phenotype more like the wild type. An enhancer mutation makes it stronger.</div>
<div class="term"><b>Continuous variation</b>A continuous range of measured values, with no separate classes.</div>
<div class="term"><b>Polygenic traits</b>Traits that many genes control. They usually show continuous variation.</div>
<div class="term"><b>G + E ⇒ P</b>Genotype plus environment, and their interaction, give the phenotype (also written G + E = P).</div>
<div class="term"><b>Penetrance</b>The percentage of individuals with a genotype who show its phenotype.</div>
<div class="term"><b>Expressivity</b>How strongly a phenotype shows in the individuals that have it: narrow or broad.</div>
<div class="term"><b>Recessive lethal mutations</b>Mutations that kill when homozygous. The dead genotypes are missing from the counts.</div>
<div class="term"><b>Phenocopy</b>An effect of the environment that copies a genetic phenotype.</div>
<div class="term"><b>Genetic heterogeneity</b>Different genes or mechanisms that give the same phenotype.</div>
</div>`},

/* 31 ─────────────────────────────── */
{sec:'8.9–8.10',title:'Check Your Understanding (1)',wide:true,steps:1,
text:`<div class="qa" data-step="0" style="display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);column-gap:22px;align-items:start;grid-template-rows:auto 1fr"><div class="q" style="grid-row:1/3">1. Mouse hair colour. Match each case to one term: haplosufficiency, haploinsufficiency, pleiotropy, incomplete dominance, codominance, incomplete penetrance, broad (variable) expressivity. The allele symbols say nothing about dominance.<div class="note" style="font-weight:500;margin-top:6px"><b>Key.</b> Haplosufficiency: one working copy is enough for the normal phenotype. Haploinsufficiency: one working copy is not enough. Pleiotropy: one gene affects two or more traits. Codominance: a heterozygote shows the phenotypes of both alleles. Incomplete dominance: a heterozygote is between the two homozygotes.</div>
<div class="tblwrap"><table class="tbl" style="font-size:14px"><thead><tr><th>Case</th><th>A1A1</th><th>A1A2</th><th>A2A2</th></tr></thead><tbody>
<tr><td>1</td><td>all hairs black</td><td>each mouse: 50% of hairs all black, 50% all white</td><td>all hairs white</td></tr>
<tr><td>2</td><td>all hairs black</td><td>all hairs one shade of grey</td><td>all hairs white</td></tr>
<tr><td>3</td><td>all hairs black</td><td>all hairs black</td><td>50% of mice all white, 50% all black</td></tr>
<tr><td>4</td><td>all hairs black</td><td>all hairs black</td><td>no hair</td></tr>
<tr><td>5</td><td>all hairs black</td><td>all hairs white</td><td>all hairs white</td></tr>
<tr><td>6</td><td>all hairs black</td><td>all hairs black</td><td>all hairs white</td></tr>
<tr><td>7</td><td>all hairs black</td><td>all hairs black</td><td>a wide range of greys</td></tr>
</tbody></table></div></div><button style="justify-self:start">Show answer</button><div class="a" hidden>Take A1 as the allele that makes black pigment, and A2 as the allele that does not.<br><b>1 codominance:</b> both phenotypes show in one mouse, each in its own hairs.<br><b>2 incomplete dominance:</b> grey is between black and white.<br><b>3 incomplete penetrance:</b> only some A2A2 mice show the white phenotype.<br><b>4 pleiotropy:</b> the same gene affects hair colour and hair growth.<br><b>5 haploinsufficiency:</b> one A1 copy is not enough for black, so A1A2 is white.<br><b>6 haplosufficiency:</b> one A1 copy is enough for black.<br><b>7 broad expressivity:</b> the A2A2 phenotype shows at different strengths.</div></div>`},

/* 32 ─────────────────────────────── */
{sec:'8.9–8.10',title:'Check Your Understanding (2)',wide:true,steps:1,
text:`<div class="qa" data-step="0" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);column-gap:22px;align-items:start;grid-template-rows:auto 1fr"><div class="q" style="grid-row:1/3">2. Fruit-colour pathway: enzyme A changes precursor 1 into precursor 3, and enzyme B changes precursor 2 into precursor 3. So either 1 or 2 can give 3. Enzyme D changes 3 into 4. All mutant alleles (small letters) are recessive. A gene missing from a genotype is wild type. Here 1, 2 and 3 are colourless, and 4 is red. Give the phenotypes of (a) aa, (b) bb, (c) dd, (d) aabb, (e) aadd, (f) bbdd, (g) aabbdd. Give the phenotypic ratios of the offspring of (h) AaBb × AaBb, (i) BbDd × BbDd, (j) AaDd × AaDd.<svg viewBox="0 0 330 118" width="330" height="118" style="display:block;margin:8px 0;max-width:100%" role="img" aria-label="Pathway: enzyme A changes 1 into 3, enzyme B changes 2 into 3, enzyme D changes 3 into 4"><defs><marker id="c8ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" style="fill:var(--ink)"/></marker></defs><circle cx="30" cy="24" r="15" style="fill:var(--card);stroke:var(--ink);stroke-width:1.6"/><text x="30" y="29" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">1</text><circle cx="30" cy="94" r="15" style="fill:var(--card);stroke:var(--ink);stroke-width:1.6"/><text x="30" y="99" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">2</text><circle cx="160" cy="59" r="15" style="fill:var(--card);stroke:var(--ink);stroke-width:1.6"/><text x="160" y="64" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">3</text><circle cx="290" cy="59" r="15" style="fill:var(--bad);stroke:var(--ink);stroke-width:1.6"/><text x="290" y="64" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">4</text><path d="M46,30 L142,52" style="stroke:var(--ink);stroke-width:1.8;fill:none" marker-end="url(#c8ar)"/><path d="M46,88 L142,66" style="stroke:var(--ink);stroke-width:1.8;fill:none" marker-end="url(#c8ar)"/><path d="M176,59 L272,59" style="stroke:var(--ink);stroke-width:1.8;fill:none" marker-end="url(#c8ar)"/><text x="96" y="26" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">A</text><text x="96" y="104" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">B</text><text x="224" y="50" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">D</text></svg></div><button style="justify-self:start">Show answer</button><div class="a" hidden>Find the compounds that each genotype can make. The compounds that collect give the colour. A fruit with no pigment is white.<table class="tbl" style="font-size:14px;margin:4px 0"><thead><tr><th>Genotype</th><th>Compounds present</th><th>Fruit</th></tr></thead><tbody><tr><td>(a) aa</td><td>1; 2 → 3 → 4</td><td>red</td></tr><tr><td>(b) bb</td><td>2; 1 → 3 → 4</td><td>red</td></tr><tr><td>(c) dd</td><td>1, 2 → 3; 3 collects</td><td>white</td></tr><tr><td>(d) aabb</td><td>1 and 2 only</td><td>white</td></tr><tr><td>(e) aadd</td><td>1; 2 → 3 collects</td><td>white</td></tr><tr><td>(f) bbdd</td><td>2; 1 → 3 collects</td><td>white</td></tr><tr><td>(g) aabbdd</td><td>1 and 2 only</td><td>white</td></tr></tbody></table><b>(h)</b> All plants are DD. Only aabb makes no 3: 9 + 3 + 3 = 15 red : 1 white.<br><b>(i)</b> All plants are AA, so every plant makes 3. Only D matters: D_ = 9 + 3 = 12 red, dd = 3 + 1 = 4 white. 12 red : 4 white (3 : 1).<br><b>(j)</b> All plants are BB, so every plant makes 3. D_ = 12 red, dd = 4 white: 12 red : 4 white (3 : 1).</div></div>`},

/* 33 ─────────────────────────────── */
{sec:'8.9–8.10',title:'Check Your Understanding (3)',wide:true,steps:1,
text:`<div class="qa" data-step="0" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);column-gap:22px;align-items:start;grid-template-rows:auto 1fr"><div class="q" style="grid-row:1/3">3. Use the fruit-colour pathway again. The rules of question 2 apply. Here 1 and 2 are colourless, 3 is blue and 4 is red. Give the phenotypes of (a) aa, (b) bb, (c) dd, (d) aabb, (e) aadd, (f) bbdd, (g) aabbdd. Give the phenotypic ratios of the offspring of (h) AaBb × AaBb, (i) BbDd × BbDd, (j) AaDd × AaDd.<svg viewBox="0 0 330 118" width="330" height="118" style="display:block;margin:8px 0;max-width:100%" role="img" aria-label="Pathway: enzyme A changes 1 into 3, enzyme B changes 2 into 3, enzyme D changes 3 into 4"><defs><marker id="c8ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" style="fill:var(--ink)"/></marker></defs><circle cx="30" cy="24" r="15" style="fill:var(--card);stroke:var(--ink);stroke-width:1.6"/><text x="30" y="29" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">1</text><circle cx="30" cy="94" r="15" style="fill:var(--card);stroke:var(--ink);stroke-width:1.6"/><text x="30" y="99" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">2</text><circle cx="160" cy="59" r="15" style="fill:var(--dad);stroke:var(--ink);stroke-width:1.6"/><text x="160" y="64" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">3</text><circle cx="290" cy="59" r="15" style="fill:var(--bad);stroke:var(--ink);stroke-width:1.6"/><text x="290" y="64" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">4</text><path d="M46,30 L142,52" style="stroke:var(--ink);stroke-width:1.8;fill:none" marker-end="url(#c8ar)"/><path d="M46,88 L142,66" style="stroke:var(--ink);stroke-width:1.8;fill:none" marker-end="url(#c8ar)"/><path d="M176,59 L272,59" style="stroke:var(--ink);stroke-width:1.8;fill:none" marker-end="url(#c8ar)"/><text x="96" y="26" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">A</text><text x="96" y="104" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">B</text><text x="224" y="50" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">D</text></svg></div><button style="justify-self:start">Show answer</button><div class="a" hidden>Find the compounds that each genotype can make. The compounds that collect give the colour. A fruit with no pigment is white.<table class="tbl" style="font-size:14px;margin:4px 0"><thead><tr><th>Genotype</th><th>Compounds present</th><th>Fruit</th></tr></thead><tbody><tr><td>(a) aa</td><td>1; 2 → 3 → 4</td><td>red</td></tr><tr><td>(b) bb</td><td>2; 1 → 3 → 4</td><td>red</td></tr><tr><td>(c) dd</td><td>3 collects</td><td>blue</td></tr><tr><td>(d) aabb</td><td>1 and 2 only</td><td>white</td></tr><tr><td>(e) aadd</td><td>1; 2 → 3 collects</td><td>blue</td></tr><tr><td>(f) bbdd</td><td>2; 1 → 3 collects</td><td>blue</td></tr><tr><td>(g) aabbdd</td><td>1 and 2 only</td><td>white</td></tr></tbody></table><b>(h)</b> All plants are DD. Only aabb makes no 3: 15 red : 1 white.<br><b>(i)</b> All plants are AA, so every plant makes 3. D_ = 12 red, and dd = 4 blue (3 collects): 12 red : 4 blue.<br><b>(j)</b> All plants are BB, so every plant makes 3. D_ = 12 red, dd = 4 blue: 12 red : 4 blue.</div></div>`},

/* 34 ─────────────────────────────── */
{sec:'8.9–8.10',title:'Check Your Understanding (4)',wide:true,steps:1,
text:`<div class="qa" data-step="0" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);column-gap:22px;align-items:start;grid-template-rows:auto 1fr"><div class="q" style="grid-row:1/3">4. Use the fruit-colour pathway again. The rules of question 2 apply. Here 1 is colourless, 2 is yellow, 3 is blue and 4 is red. Assume that red covers any other colour, and that yellow and blue together look green. Give the phenotypes of (a) aa, (b) bb, (c) dd, (d) aabb, (e) aadd, (f) bbdd, (g) aabbdd. Give the phenotypic ratios of the offspring of (h) AaBb × AaBb, (i) BbDd × BbDd, (j) AaDd × AaDd.<svg viewBox="0 0 330 118" width="330" height="118" style="display:block;margin:8px 0;max-width:100%" role="img" aria-label="Pathway: enzyme A changes 1 into 3, enzyme B changes 2 into 3, enzyme D changes 3 into 4"><defs><marker id="c8ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" style="fill:var(--ink)"/></marker></defs><circle cx="30" cy="24" r="15" style="fill:var(--card);stroke:var(--ink);stroke-width:1.6"/><text x="30" y="29" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">1</text><circle cx="30" cy="94" r="15" style="fill:color-mix(in srgb, var(--hi) 85%, var(--mom));stroke:var(--ink);stroke-width:1.6"/><text x="30" y="99" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">2</text><circle cx="160" cy="59" r="15" style="fill:var(--dad);stroke:var(--ink);stroke-width:1.6"/><text x="160" y="64" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">3</text><circle cx="290" cy="59" r="15" style="fill:var(--bad);stroke:var(--ink);stroke-width:1.6"/><text x="290" y="64" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">4</text><path d="M46,30 L142,52" style="stroke:var(--ink);stroke-width:1.8;fill:none" marker-end="url(#c8ar)"/><path d="M46,88 L142,66" style="stroke:var(--ink);stroke-width:1.8;fill:none" marker-end="url(#c8ar)"/><path d="M176,59 L272,59" style="stroke:var(--ink);stroke-width:1.8;fill:none" marker-end="url(#c8ar)"/><text x="96" y="26" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">A</text><text x="96" y="104" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">B</text><text x="224" y="50" style="font:700 13px var(--f-body);fill:var(--ink)" text-anchor="middle">D</text></svg></div><button style="justify-self:start">Show answer</button><div class="a" hidden>Find the compounds that each genotype can make. The compounds that collect give the colour. A fruit with no pigment is white.<table class="tbl" style="font-size:14px;margin:4px 0"><thead><tr><th>Genotype</th><th>Compounds present</th><th>Fruit</th></tr></thead><tbody><tr><td>(a) aa</td><td>1; 2 → 3 → 4</td><td>red</td></tr><tr><td>(b) bb</td><td>2 (yellow) and 4 (red)</td><td>red: red covers yellow</td></tr><tr><td>(c) dd</td><td>3 collects</td><td>blue</td></tr><tr><td>(d) aabb</td><td>1 and 2</td><td>yellow</td></tr><tr><td>(e) aadd</td><td>1 and 3</td><td>blue</td></tr><tr><td>(f) bbdd</td><td>2 and 3</td><td>green (yellow + blue)</td></tr><tr><td>(g) aabbdd</td><td>1 and 2</td><td>yellow</td></tr></tbody></table><b>(h)</b> A_B_, A_bb and aaB_ are red (9 + 3 + 3). aabb is yellow: 15 red : 1 yellow.<br><b>(i)</b> B_D_ and bbD_ are red (9 + 3). B_dd is blue (3). bbdd is green (1): 12 red : 3 blue : 1 green.<br><b>(j)</b> A_D_ and aaD_ are red (12). A_dd and aadd are blue (4): 12 red : 4 blue.</div></div>`},

/* 35 ─────────────────────────────── */
{sec:'8.9–8.10',title:'Check Your Understanding (5)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">5. Which of the three fruit-colour pathway questions show epistasis?</div><button>Show answer</button><div class="a" hidden><b>The test.</b> Take two mutants with different mutant phenotypes. Make the double mutant. If it has the phenotype of one of the two, that gene is epistatic. Here the mutant for the first step is aabb (no compound 3), because A and B do the same job. Alone, aa or bb has no mutant phenotype.<br><b>Colourless 1, 2 and 3 (red 4):</b> aabb and dd are both white. The two mutants do not differ, so the phenotypes show no epistasis.<br><b>Blue 3:</b> aabb is white and dd is blue. The triple mutant aabbdd is white, like aabb. So the first step (A and B) is epistatic to D. This agrees with the rule: the gene for the earlier step is epistatic.<br><b>Yellow 2, blue 3:</b> aabb is yellow and dd is blue. The triple mutant aabbdd is yellow, like aabb. So the first step is epistatic to D again. The bbdd mutant is green, because both yellow 2 and blue 3 collect. So bb and dd show no epistasis.</div></div>
<div class="qa"><div class="q">6. Think of the Labrador (9 : 3 : 4), squash (12 : 3 : 1), wheat (15 : 1) and sweet pea (9 : 7) crosses. Each F2 came from AaBb × AaBb. Give the genotypes and phenotypes of the F1 and of the P generation.</div><button>Show answer</button><div class="a" hidden>In every case the F1 is AaBb, and the F2 is the offspring of AaBb × AaBb. The P cross was AABB × aabb or AAbb × aaBB.<br><b>Labrador:</b> F1 EeBb, black. P: EEBB (black) × eebb (yellow, brown nose), or EEbb (chocolate) × eeBB (yellow, black nose).<br><b>Squash:</b> F1 AaBb, white. P: AABB (white) × aabb (green), or AAbb (white) × aaBB (yellow).<br><b>Wheat:</b> F1 AaBb, red. P: AABB (red) × aabb (white), or AAbb (red) × aaBB (red).<br><b>Sweet pea:</b> F1 AaBb, purple. P: AABB (purple) × aabb (white), or AAbb (white) × aaBB (white), the cross of two white lines.</div></div>
</div>`},

/* 36 ─────────────────────────────── */
{sec:'8.9–8.10',title:'Check Your Understanding (6)',wide:true,steps:1,
text:`<div class="qa" data-step="0" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);column-gap:22px;align-items:start;grid-template-rows:auto 1fr"><div class="q" style="grid-row:1/3">7. In the small plant <i>Arabidopsis</i>, you find a recessive allele g with a <b>point mutation</b> (a change of one DNA letter). In gg plants, the leaves grow as narrow tubes instead of flat sheets (G = wild type). Allele g is a complete loss of function. Plan a way to find other genes that interact with g. Show all the possible genotypes in the F2.</div><button style="justify-self:start">Show answer</button><div class="a" hidden>Do a <b>suppressor and enhancer screen</b>.<br>(1) Start with gg plants, which have tube leaves.<br>(2) Treat their seeds with a <b>mutagen</b>, a chemical that makes new random mutations. EMS (ethyl methanesulfonate) is a common mutagen.<br>(3) Grow these plants, the <b>M1</b> (first) generation. Each one is gg and heterozygous for new mutations, for example Aa gg.<br>(4) Let each plant <b>self-pollinate</b> (fertilize itself). Then new recessive mutations become homozygous in some offspring.<br>(5) In the F2, look for plants whose leaves differ from gg. Less normal leaves point to an enhancer. More normal leaves point to a suppressor.<br><b>F2 genotypes</b> from one Aa gg plant: 1 AA gg : 2 Aa gg : 1 aa gg. Only the aa gg plants (1/4) can show a new recessive interaction.</div></div>`},

/* 37 ─────────────────────────────── */
{sec:'8.9–8.10',title:'Check Your Understanding (7)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">8. The recessive allele g mutates again and becomes g*. What are the possible phenotypes of a g*g* plant?</div><button>Show answer</button><div class="a" hidden>Allele g already has no function, so a second change cannot make it worse.<br>(1) Most second changes do nothing: g*g* has tube leaves, like gg.<br>(2) A <b>true revertant</b> changes the mutant letter back to the original letter. Then g*g* has flat, wild-type leaves, like GG.<br>(3) An <b>intragenic suppressor</b> is a second change at another place in g. It can restore the reading frame or the shape of the protein. Then g*g* has wild-type or almost wild-type leaves.<br>(4) A change can also restore part of the function. Then the leaves are between tubes and flat sheets.</div></div>
<div class="qa"><div class="q">9. Use the product rule to find the phenotypic ratio of a trihybrid cross, AaBbCc × AaBbCc. Assume independent assortment, complete dominance and no gene interaction.</div><button>Show answer</button><div class="a" hidden>Each gene gives 3/4 dominant and 1/4 recessive phenotype. Multiply for the three genes (64 = 4 × 4 × 4):<br>A_B_C_ = 3/4 × 3/4 × 3/4 = 27/64.<br>A_B_cc, A_bbC_, aaB_C_ = 3/4 × 3/4 × 1/4 = 9/64 each.<br>A_bbcc, aaB_cc, aabbC_ = 3/4 × 1/4 × 1/4 = 3/64 each.<br>aabbcc = 1/4 × 1/4 × 1/4 = 1/64.<br>So the ratio is <b>27 : 9 : 9 : 9 : 3 : 3 : 3 : 1</b>: eight classes that add up to 64. Each class of 9 : 3 : 3 : 1 splits 3 : 1 at the third gene.</div></div>
</div>`},

/* 38 ─────────────────────────────── */
{sec:'8.9–8.10',title:'Check Your Understanding (8)',wide:true,steps:1,
text:`<div class="qa" data-step="0" style="display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.6fr);column-gap:22px;align-items:start;grid-template-rows:auto 1fr"><div class="q" style="grid-row:1/3">10. Allele g gives tube leaves, as in question 7. Allele a is a recessive allele of a second gene. What are the possible phenotypes of an aagg plant? For each case, give the phenotypic ratio of the offspring of AaGg × AaGg.<br><br><span style="font-weight:500">The answer depends on what gene A does, so several cases are possible. Derive each ratio from the four classes 9 A_G_ : 3 A_gg : 3 aaG_ : 1 aagg.</span></div><button style="justify-self:start">Show answer</button><div class="a" hidden><table class="tbl" style="font-size:13.5px"><thead><tr><th>Case</th><th style="text-transform:none;letter-spacing:0">aagg</th><th style="text-transform:none;letter-spacing:0">aaG_</th><th>Ratio</th></tr></thead><tbody>
<tr><td>1. A acts in another process (for example root growth)</td><td>tube leaves and short roots</td><td>short roots</td><td>9 wild type : 3 tube : 3 short roots : 1 both</td></tr>
<tr><td>2a. a enhances g</td><td>no leaves</td><td>its own phenotype</td><td>9 : 3 : 3 : 1</td></tr>
<tr><td>2b. a enhances g</td><td>no leaves</td><td>tube leaves, like A_gg</td><td>9 wild type : 6 tube : 1 no leaves</td></tr>
<tr><td>2c. a enhances g</td><td>no leaves</td><td>wild type</td><td>12 wild type : 3 tube : 1 no leaves</td></tr>
<tr><td>3a. a suppresses g</td><td>wild type</td><td>its own phenotype</td><td>10 wild type (9 + 1) : 3 tube : 3 aa phenotype</td></tr>
<tr><td>3b. a suppresses g</td><td>wild type</td><td>tube leaves, like A_gg</td><td>10 wild type : 6 tube</td></tr>
<tr><td>3c. a suppresses g</td><td>wild type</td><td>wild type</td><td>13 wild type : 3 tube</td></tr>
<tr><td>4. aa is epistatic to gg</td><td>like aaG_, for example no leaves</td><td>for example no leaves</td><td>9 wild type : 3 tube : 4 no leaves</td></tr>
</tbody></table>Many more ratios are possible, for example with lethal genotypes. In a real screen, you observe the ratio and then deduce the biology from it.</div></div>`},

/*END*/
]});
})();
