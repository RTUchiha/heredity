/* Chapter 2 · Mendel's Second Law: Independent Assortment · source: Hairdity.pdf ch. 2 (Singh, Introduction to Genetics, CC BY-NC-SA 4.0) */
(function(){
const H0=window.HL;
/* ---- deck-local helpers ---- */
function drawA(a,o){H0.D(a.firstChild,1,Object.assign({d:600},o));H0.O(a.lastChild,1,Object.assign({d:200},o,{at:((o&&o.at)||0)+450}));}
function mkA(p,x1,y1,x2,y2,o){const a=H0.arrow(p,x1,y1,x2,y2,o);H0.O(a.lastChild,0,{d:0});return a;}
// static arrow, fully drawn
function fullA(p,x1,y1,x2,y2,o){const a=H0.arrow(p,x1,y1,x2,y2,o);a.firstChild.style.strokeDashoffset=0;return a;}
function pop(e,o){H0.T(e,{s:1},Object.assign({d:700},o));H0.O(e,1,Object.assign({d:300},o));}
function hide(e){H0.T(e,{s:.001},{d:0});H0.O(e,0,{d:0});}
const stage=()=>document.getElementById('stage');
// group placed at x,y (draw children around 0,0)
function at(p,x,y,s){const G=H0.g(p);H0.T(G,{x,y,s:s==null?1:s},{d:0});return G;}
// tween a CSS paint property to a raw CSS colour (allows color-mix)
function paint(e,prop,css,o){if(Array.isArray(e)){e.forEach(x=>paint(x,prop,css,o));return e}o=o||{};
  e.style.transitionDuration=(o.d!=null?o.d:600)+'ms';e.style.transitionDelay=(o.at||0)+'ms';e.style[prop]=css;return e;}
const fill=(e,c,o)=>paint(e,'fill',c,o);
// text with ^x or ^{xy} superscripts and _x subscripts
function rt(p,x,y,s,cls,a){const t=H0.E('text',Object.assign({x,y,cls:cls||'lb'},a||{}),p);
  s.split(/(\^\{[^}]*\}|\^.|_\{[^}]*\}|_.)/).forEach(part=>{if(!part)return;
    if(part[0]==='^'||part[0]==='_'){const v=part[1]==='{'?part.slice(2,-1):part.slice(1);
      H0.E('tspan',{'baseline-shift':part[0]==='^'?'super':'sub',st:'font-size:.68em',text:v},t);}
    else H0.E('tspan',{text:part},t);});return t;}
// rounded photo with border; href is an @@asset@@ token
let CLIPN=0;
function photo(p,href,x,y,w,h,o){o=o||{};const id='c2clp'+(++CLIPN);const G=H0.g(p);
  const cp=H0.E('clipPath',{id},G);H0.E('rect',{x,y,width:w,height:h,rx:o.r!=null?o.r:10},cp);
  H0.E('image',{href,x,y,width:w,height:h,preserveAspectRatio:o.fit||'xMidYMid slice','clip-path':`url(#${id})`},G);
  H0.E('rect',{x,y,width:w,height:h,rx:o.r!=null?o.r:10,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},G);return G;}
// dark label plate on top of a photo
function plate(p,x,y,t,o){o=o||{};const G=H0.g(p);const w=o.w||(t.length*7.4+16);const bx=o.anchor==='end'?x-w:o.anchor==='middle'?x-w/2:x;
  H0.E('rect',{x:bx,y:y-16,width:w,height:23,rx:5,st:'fill:#16181d;opacity:.86'},G);H0.txt(G,bx+w/2,y+0.5,t,'lbs',{'text-anchor':'middle',st:'fill:#fff;font-weight:700'});return G;}

/* ---- pea seeds: colour from the Y gene, round or wrinkled from the R gene ---- */
const YEL='var(--hi)',GRN='var(--good)';
// class fills: yellow or green; deeper tint = wrinkled
const KC={RY:'color-mix(in srgb, var(--hi) 30%, var(--card))',Ry:'color-mix(in srgb, var(--good) 24%, var(--card))',
  rY:'color-mix(in srgb, var(--hi) 78%, var(--card))',ry:'color-mix(in srgb, var(--good) 58%, var(--card))'};
const CLS=[{k:'RY',name:'round, yellow',g:'R_Y_',round:1,yellow:1},{k:'Ry',name:'round, green',g:'R_yy',round:1,yellow:0},
  {k:'rY',name:'wrinkled, yellow',g:'rrY_',round:0,yellow:1},{k:'ry',name:'wrinkled, green',g:'rryy',round:0,yellow:0}];
function wrinkPath(r,sd){let s=sd||7;const rnd=()=>{s=(s*9301+49297)%233280;return s/233280};
  const n=9,P=[];for(let i=0;i<n;i++){const a=(i/n)*2*Math.PI+rnd()*.25;const rr=r*(.78+.12*rnd());P.push([rr*Math.cos(a),rr*Math.sin(a),a])}
  let d='';for(let i=0;i<n;i++){const p=P[i],q=P[(i+1)%n];const am=(p[2]+q[2]+(i===n-1?2*Math.PI:0))/2;const rc=r*(1.0+.12*rnd());
    d+=(i?'':`M${p[0].toFixed(1)},${p[1].toFixed(1)}`)+` Q${(rc*Math.cos(am)).toFixed(1)},${(rc*Math.sin(am)).toFixed(1)} ${q[0].toFixed(1)},${q[1].toFixed(1)}`}
  return d+'Z';}
function seed(p,x,y,r,round,yellow,sd){const G=at(p,x,y);const col=yellow?YEL:GRN;
  G.rd=H0.E('circle',{r:r*.92,st:`fill:${col};stroke:var(--ink);stroke-width:1.5`},G);
  G.hl=H0.E('ellipse',{cx:-r*.3,cy:-r*.32,rx:r*.28,ry:r*.17,st:'fill:#fff;opacity:.5'},G);
  G.wr=H0.g(G);G.wb=H0.E('path',{d:wrinkPath(r,sd||Math.round(x*7+y*3)),st:`fill:${col};stroke:var(--ink);stroke-width:1.5;stroke-linejoin:round`},G.wr);
  [`M${-.45*r},${-.12*r} Q${-.1*r},${.18*r} ${.32*r},${-.26*r}`,`M${-.22*r},${.36*r} Q${.08*r},${.18*r} ${.4*r},${.3*r}`].forEach(d=>
    H0.E('path',{d,st:'fill:none;stroke:var(--ink);stroke-width:1.1;opacity:.55;stroke-linecap:round'},G.wr));
  setSeed(G,round,yellow,{d:0});return G;}
function setSeed(G,round,yellow,o){o=o||{};H0.O(G.rd,round?1:0,o);H0.O(G.hl,round?1:0,o);H0.O(G.wr,round?0:1,o);fill([G.rd,G.wb],yellow?YEL:GRN,o);}
// allele / gamete chip (italic serif letters)
function chip(p,x,y,t,o){o=o||{};const G=at(p,x,y);const w=o.w||(t.replace(/[_]/g,'').length*9.5+16),h=o.h||24;
  G.r=H0.E('rect',{x:-w/2,y:-h/2,width:w,height:h,rx:6,st:`fill:${o.fill||'var(--card)'};stroke:${o.stroke?H0.C(o.stroke):'var(--ink)'};stroke-width:${o.sw||2}`},G);
  G.t=H0.txt(G,0,5.5,t,'mt',{'text-anchor':'middle',st:`font-size:${o.fs||16}px`});return G;}
/* ---- chromosomes for meiosis ---- */
// one chromatid: vertical bar centred on 0,0; tags = [[allele, y]]
function ctd(p,x,y,len,color,tags,w){const G=at(p,x,y);w=w||9;
  G.bar=H0.E('line',{x1:0,y1:-len/2,x2:0,y2:len/2,st:`stroke:${H0.C(color)};stroke-width:${w};stroke-linecap:round`},G);
  G.tags=(tags||[]).map(([t,ty])=>{const T=at(G,0,ty);H0.E('rect',{x:-8,y:-8,width:16,height:16,rx:3,cls:'card',st:'stroke:var(--ink);stroke-width:1.3'},T);
    H0.txt(T,0,4.5,t,'mt',{'text-anchor':'middle',st:'font-size:13px'});return T});return G;}
// replicated chromosome: two sister chromatids and a centromere
function rchr(p,x,y,len,color,tags){const C={len};C.a=ctd(p,x-9,y,len,color,tags);C.b=ctd(p,x+9,y,len,color,tags);
  C.c=at(p,x,y);H0.E('rect',{x:-13,y:-3.5,width:26,height:7,rx:3.5,cls:'kf'},C.c);C.x=x;C.y=y;return C;}
function mvChr(C,x,y,o){H0.T(C.a,{x:x-9,y,s:1},o);H0.T(C.b,{x:x+9,y,s:1},o);H0.T(C.c,{x,y},o);C.x=x;C.y=y;}
function chrParts(C){return [C.a,C.b,C.c];}
/* meiosis machine: one cell, homologous pairs (blue = father's copy, orange = mother's copy), two ways to line up */
function meio(H,s,cfg){const cx=320,cy=150,XL=cx-23,XR=cx+23,AL=cx-70,AR=cx+70,GY=cfg.gy||334,GR=cfg.gr||25,GS=cfg.gs||.6;
  const slotX=[[60,125,190,255],[385,450,515,580]];
  const Cl=H.cell(s,{x:cx,y:cy,r:118});
  const nuc=H.nucleus(s,cx,cy,88);
  const plateL=H.E('line',{x1:cx,y1:cy-104,x2:cx,y2:cy+104,st:'stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 5'},s);H.O(plateL,0,{d:0});
  const poles=[H.centrosome(s,cx-104,cy),H.centrosome(s,cx+104,cy)];H.O(poles,0,{d:0});
  const head=[0,1].map(k=>{const t=H.txt(s,k?482:157,GY-40,'','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});return t});
  const gams=[0,1].map(k=>slotX[k].map(x=>{const G=at(s,x,GY);H.E('circle',{r:GR,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},G);hide(G);return G}));
  const sets=[0,1].map(()=>cfg.pairs.map(P=>({b:rchr(s,XL,P.y,P.len,'dad',P.bt),o:rchr(s,XR,P.y,P.len,'mom',P.ot)})));
  const labs=[0,1].map(k=>slotX[k].map((x,i)=>{const t=H.txt(s,x,GY+GR+21,cfg.lab[k][i],'mt',{'text-anchor':'middle',st:'font-size:18px'});H.O(t,0,{d:0});return t}));
  sets[1].forEach(pr=>[pr.b,pr.o].forEach(C=>H.O(chrParts(C),0,{d:0})));
  const npair=cfg.pairs.length;
  function meta(k,flipped,o){sets[k].forEach((pr,j)=>{const P=cfg.pairs[j];const f=flipped&&P.flip;mvChr(pr.b,f?XR:XL,P.y,o);mvChr(pr.o,f?XL:XR,P.y,o)})}
  function run(k){const S=sets[k];const flip=k===1;let t=0;
    if(k===1){H.O(Cl,1,{d:300});H.cleave(Cl,0,1,{d:500});H.O(S.flatMap(pr=>[...chrParts(pr.b),...chrParts(pr.o)]),1,{d:400,at:300});t=800;
      // flip the marked pairs: the two homologs swap sides, passing above and below each other
      S.forEach((pr,j)=>{const P=cfg.pairs[j];if(!P.flip)return;
        H.after(t,()=>{mvChr(pr.b,cx,P.y-P.len*.38,{d:450});mvChr(pr.o,cx,P.y+P.len*.38,{d:450});
          H.after(460,()=>{mvChr(pr.b,XR,P.y,{d:450});mvChr(pr.o,XL,P.y,{d:450})})})});t+=1100;}
    H.after(t,()=>{H.O(head[k],1);head[k].textContent=cfg.head[k];
      // anaphase I: homologs to opposite poles
      S.forEach((pr,j)=>{const P=cfg.pairs[j];const f=flip&&P.flip;mvChr(pr.b,f?AR:AL,P.y,{d:900});mvChr(pr.o,f?AL:AR,P.y,{d:900})});
      H.after(950,()=>{H.cleave(Cl,70,.62,{d:800});
        H.after(850,()=>{gams[k].forEach((g,i)=>pop(g,{at:i*60}));
          // meiosis II: sister chromatids into separate gametes
          S.forEach((pr,j)=>{const P=cfg.pairs[j];const f=flip&&P.flip;const L=f?pr.o:pr.b,R=f?pr.b:pr.o;const dx=npair>1?(j?8:-8):0;
            [[L.a,0],[L.b,1],[R.a,2],[R.b,3]].forEach(([c,i])=>H.T(c,{x:slotX[k][i]+dx,y:GY,s:GS},{d:1100,at:150}));H.O([L.c,R.c],0,{d:300})});
          labs[k].forEach((l,i)=>H.O(l,1,{at:1200+i*80}));H.O(Cl,.22,{d:600,at:1400})})})});}
  return {Cl,nuc,plate:plateL,poles,sets,gams,labs,head,meta,run,
    scatter(pos){sets[0].forEach((pr,j)=>{mvChr(pr.b,pos[j][0][0],pos[j][0][1],{d:0});mvChr(pr.o,pos[j][1][0],pos[j][1][1],{d:0})})}};}

/* 16-box grid for gene interaction (epi = 0: linkage and pathways; 1: Labrador epistasis) */
function interScene(H,epi){const s=stage();const c=54,x0=36,y0=80;const ord=['AB','Ab','aB','ab'];
  const PUR='#9a5bb5',WHT='#f7f6f0',BLK='#1d1d1f',BRN='#7b4a25',YLW='#e3be78';
  const K4={AB:KC.RY,Ab:KC.Ry,aB:KC.rY,ab:KC.ry};
  const lab=g=>epi?g.replace('A','E').replace('a','e'):g;
  ord.forEach((g,j)=>H.txt(s,x0+c/2+j*c,y0-10,lab(g),'mt',{'text-anchor':'middle',st:'font-size:14px;fill:var(--dad)'}));ord.forEach((g,i)=>H.txt(s,x0-8,y0+c/2+i*c+5,lab(g),'mt',{'text-anchor':'end',st:'font-size:14px;fill:var(--mom)'}));
  H.txt(s,x0+2*c,y0-34,epi?'EeBb × EeBb':'AaBb × AaBb','mt',{'text-anchor':'middle',st:'font-size:17px'});
  const boxes=[];for(let i=0;i<4;i++)for(let j=0;j<4;j++){const a=ord[i],b=ord[j];const A=a[0]==='A'||b[0]==='A',B=a[1]==='B'||b[1]==='B';
    const k=(A?'A':'a')+(B?'B':'b');const r=H.E('rect',{x:x0+j*c,y:y0+i*c,width:c,height:c,st:`fill:${epi?'var(--wash)':K4[k]};stroke:var(--ink);stroke-width:1.5`},s);boxes.push({r,k})}
  const L=x0+4*c+24,W=620-L;
  const bar=H.g(s);const segs=[0,1,2,3].map(()=>{const r=H.E('rect',{x:0,y:0,width:1,height:30,cls:'nss',st:'stroke:var(--ink);stroke-width:1.5;fill:var(--card)'},bar);const t=H.txt(bar,0,21,'','lb',{'text-anchor':'middle',st:'font-size:14px'});return {r,t}});
  H.T(bar,{x:L,y:y0},{d:0});
  const setBar=(vals,fills,labs,o,tc)=>{const tot=vals.reduce((a,b)=>a+b,0);let acc=0;segs.forEach((g,i)=>{const v=vals[i]||0;const w=W*v/tot;H.T(g.r,{x:acc,sx:Math.max(.001,w)},o);
    fill(g.r,fills[i]||'var(--card)',o);H.T(g.t,{x:acc+w/2},o);g.t.textContent=labs[i]||'';g.t.style.opacity=w>22?1:0;g.t.style.fill=tc?tc[i]:'';acc+=w})};
  const bl=H.txt(s,L,y0-12,'','lb',{st:'font-size:14px'});
  const recol=(fn,o)=>boxes.forEach((b,n)=>fill(b.r,fn(b.k),Object.assign({d:400,at:n*35},o)));
  const pane=()=>{const G=H.g(s);H.O(G,0,{d:0});return G};
  const py=262;
  if(epi){H.O(bar,0,{d:0});
    const leg=(p,y,f,t)=>{H.E('rect',{x:L,y:y-11,width:22,height:22,rx:4,st:`fill:${f};stroke:var(--ink);stroke-width:1.2`},p);H.txt(p,L+32,y+5,t,'lb',{st:'font-size:14px'})};
    const l1=pane();leg(l1,py-40,BLK,'B_ : black');leg(l1,py-6,BRN,'bb : brown');
    const l2=pane();leg(l2,py+28,YLW,'ee : yellow, whatever the B alleles');H.txt(l2,L,py+66,'no working MC1R: only yellow pigment','lbs');
    return [()=>{},
      ()=>{H.O(bar,1);H.O(l1,1);recol(k=>k[1]==='B'?BLK:BRN);setBar([12,4],[BLK,BRN],['12','4'],{d:900},['#fff','#fff']);bl.textContent='gene B alone: 12:4'},
      ()=>{H.O(l2,1);recol(k=>k[0]==='a'?YLW:k[1]==='B'?BLK:BRN);setBar([9,3,4],[BLK,BRN,YLW],['9','3','4'],{d:900},['#fff','#fff','#16181d']);bl.textContent='epistasis: 9:3:4'}];}
  setBar([9,3,3,1],[K4.AB,K4.Ab,K4.aB,K4.ab],['9','3','3','1'],{d:0});bl.textContent='independent: 9:3:3:1';
  const linkBar=H.g(s);const lb=[10.56,1.44,1.44,2.56];let ac=0;lb.forEach((v,i)=>{const w=W*v/16;H.E('rect',{x:L+ac,y:y0+70,width:w,height:30,st:`fill:${[K4.AB,K4.Ab,K4.aB,K4.ab][i]};stroke:var(--ink);stroke-width:1.5`},linkBar);
    H.txt(linkBar,L+ac+w/2,y0+91,['10.56','1.44','1.44','2.56'][i],'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700;font-size:11px'});ac+=w});
  H.txt(linkBar,L,y0+62,'linked (AB/ab), RF = 20%','lb',{st:'font-size:14px'});H.O(linkBar,0,{d:0});
  const pw=pane();const node=(p,x,y,t,f)=>{const G=at(p,x,y);H.E('circle',{r:15,st:`fill:${f};stroke:var(--ink);stroke-width:1.5`},G);H.txt(G,0,34,t,'lbs',{'text-anchor':'middle'});return G};
  node(pw,L+14,py,'white',WHT);node(pw,L+W/2,py,'white',WHT);node(pw,L+W-14,py,'purple',PUR);
  [[L+32,L+W/2-20,'A'],[L+W/2+18,L+W-32,'B']].forEach(([a,b,t])=>{fullA(pw,a,py,b,py,{w:2,h:7});H.txt(pw,(a+b)/2,py-12,'enzyme '+t,'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'})});
  const pd=pane();node(pd,L+14,py,'white',WHT);node(pd,L+W-14,py,'coloured',PUR);
  [[py-26,'enzyme A'],[py+26,'enzyme B']].forEach(([y,t])=>{H.E('path',{d:`M${L+32},${py} Q${L+W/2},${y+(y<py?-20:20)} ${L+W-32},${py}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},pd);H.txt(pd,L+W/2,y+(y<py?-14:28),t,'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'})});
  H.txt(pd,L+W/2,py+68,'either enzyme is enough','lbs',{'text-anchor':'middle'});
  return [
    ()=>{H.O(linkBar,1,{at:300})},
    ()=>{H.O(linkBar,0);recol(()=>'var(--wash)')},
    ()=>{recol(k=>k==='AB'?PUR:WHT);setBar([9,7],[PUR,WHT],['9','7'],{d:900},['#fff','#16181d']);bl.textContent='complementary: 9:7';H.O(pw,1)},
    ()=>{H.O(pw,0);recol(k=>k==='ab'?WHT:PUR);setBar([15,1],[PUR,WHT],['15','1'],{d:900},['#fff','#16181d']);bl.textContent='duplicate: 15:1';H.O(pd,1)},
  ];}

deck({
docTitle:'Independent Assortment · Heredity Ch.2',
title:'Mendel’s Second Law: Independent Assortment',
chapter:2,
eyebrow:'Heredity · Chapter 2 · Independent Assortment',
slides:[

/* 1 ─────────────────────────────── */
{sec:'2.1',title:'Independent Assortment',caption:'Blue = chromosome from the father · orange = chromosome from the mother',
text:`<p data-step="0"><b>DNA</b> is the molecule that carries hereditary information. A <b>chromosome</b> is one long DNA molecule. A <b>gene</b> is a segment of a chromosome that affects a trait. A pea plant has two copies of each gene, one from each parent.</p>
<p data-step="0">This plant has two different <b>alleles</b> (versions) of a seed-shape gene, <span class="m">R</span> and <span class="m">r</span>. It also has two different alleles of a seed-colour gene, <span class="m">Y</span> and <span class="m">y</span>.</p>
<p data-step="1">The two genes are on different chromosomes. When the plant makes <b>gametes</b> (sperm cells in pollen, and egg cells), each chromosome pair separates on its own.</p>
<p data-step="2">So the plant makes four types of gamete in equal numbers: <span class="m">RY</span>, <span class="m">Ry</span>, <span class="m">rY</span> and <span class="m">ry</span>. The alleles of the two genes go into the gametes independently. This is <b>independent assortment</b> (IA).</p>
<p data-step="3">When you cross two such plants, the seeds show four types in a 9:3:3:1 ratio. Gregor Mendel found this pattern in peas. The pattern is <b>Mendel’s Second Law</b>, the <b>Law of Independent Assortment</b>.</p>`,
star:'Different chromosomes: each pair separates on its own.',starStep:3,
scene(H){const s=stage();const cx=118,cy=150;
  H.E('circle',{cx,cy,r:96,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2.5'},s);
  const xs={Rb:82,Ro:104,Yb:140,Yo:162},Ly=150;
  const R1=ctd(s,xs.Rb,Ly,84,'dad',[['R',-18]]),R2=ctd(s,xs.Ro,Ly,84,'mom',[['r',-18]]);
  const Y1=ctd(s,xs.Yb,Ly+10,56,'dad',[['Y',-10]]),Y2=ctd(s,xs.Yo,Ly+10,56,'mom',[['y',-10]]);
  const gl=H.g(s);H.txt(gl,93,216,'SHAPE','cap',{'text-anchor':'middle',st:'font-size:9.5px'});H.txt(gl,151,216,'COLOUR','cap',{'text-anchor':'middle',st:'font-size:9.5px'});
  const geno=rt(s,cx,276,'R/r ; Y/y','mt',{'text-anchor':'middle',st:'font-size:22px'});
  const sub=H.txt(s,cx,298,'two different alleles of each gene','lbs',{'text-anchor':'middle'});
  const note=H.txt(s,cx,330,'each pair separates on its own','lb',{'text-anchor':'middle'});H.O(note,0,{d:0});
  // gametes
  const GX=284,gy=[56,124,192,260],spec=[['R','Y','dad','dad'],['R','y','dad','mom'],['r','Y','mom','dad'],['r','y','mom','mom']];
  const ar=gy.map(y=>mkA(s,216,cy,GX-30,y,{w:1.5,h:7}));
  const gc=gy.map(y=>{const G=at(s,GX,y);H.E('circle',{r:25,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},G);hide(G);return G});
  const fly=spec.map(([a,b,ca,cb])=>[ctd(s,a==='R'?xs.Rb:xs.Ro,Ly,84,ca,[[a,-18]]),ctd(s,b==='Y'?xs.Yb:xs.Yo,Ly+10,56,cb,[[b,-10]])]);
  fly.flat().forEach(f=>H.O(f,0,{d:0}));
  const gl2=gy.map((y,i)=>{const G=H.g(s);H.txt(G,GX+34,y+6,spec[i][0]+spec[i][1],'mt',{st:'font-size:19px'});H.txt(G,GX+66,y+6,'¼','lb',{st:'font-size:17px'});H.O(G,0,{d:0});return G});
  // seeds: 4 × 4 square, then sorted into 9 : 3 : 3 : 1
  const order=['RY','Ry','rY','ry'];const cls=(i,j)=>{const a=order[i],b=order[j];const R=a[0]==='R'||b[0]==='R',Y=a[1]==='Y'||b[1]==='Y';return (R?'R':'r')+(Y?'Y':'y')};
  const sx0=444,sy0=56,sp=38;const seeds=[];const slot={RY:0,Ry:0,rY:0,ry:0};
  const home={RY:[[476,110],3],Ry:[[476,196],3],rY:[[476,250],3],ry:[[476,304],1]};
  for(let i=0;i<4;i++)for(let j=0;j<4;j++){const k=cls(i,j);const c=CLS.find(q=>q.k===k);const S=seed(s,sx0+j*sp,sy0+i*sp,14,c.round,c.yellow,i*4+j+3);hide(S);
    const n=slot[k]++;const [[hx,hy],cols]=home[k];S.dest=[hx+(cols>1?(n%3-1)*22:0),hy+(k==='RY'?Math.floor(n/3)*24-24:0)];S.home=[sx0+j*sp,sy0+i*sp];seeds.push(S)}
  const nums=H.g(s);[[120,'9'],[206,'3'],[260,'3'],[314,'1']].forEach(([y,t],i)=>{H.txt(nums,422,y,t,'big',{'text-anchor':'middle'});CLS[i].name.split(', ').forEach((w,k)=>H.txt(nums,516,y-12+k*16,w,'lbs',{st:'fill:var(--ink)'}))});
  H.txt(nums,476,372,'9 : 3 : 3 : 1','big',{'text-anchor':'middle',st:'font-size:22px'});H.O(nums,0,{d:0});
  const sq=H.txt(s,sx0+57,200,'16 equally likely seeds','lbs',{'text-anchor':'middle'});H.O(sq,0,{d:0});
  return [
    ()=>{},
    ()=>{H.O(note,1);[[Y1,xs.Yo],[Y2,xs.Yb]].forEach(([c,x])=>H.T(c,{x},{d:700}));H.after(900,()=>[[Y1,xs.Yb],[Y2,xs.Yo]].forEach(([c,x])=>H.T(c,{x},{d:700})));
      H.after(1700,()=>[[R1,xs.Ro],[R2,xs.Rb]].forEach(([c,x])=>H.T(c,{x},{d:700})));H.after(2500,()=>[[R1,xs.Rb],[R2,xs.Ro]].forEach(([c,x])=>H.T(c,{x},{d:700})))},
    ()=>{ar.forEach((a,i)=>drawA(a,{at:i*120}));gc.forEach((g,i)=>pop(g,{at:400+i*120}));
      fly.forEach(([a,b],i)=>{H.O([a,b],1,{d:200,at:500+i*150});H.T(a,{x:GX-7,y:gy[i],s:.55},{d:1000,at:600+i*150});H.T(b,{x:GX+7,y:gy[i]+3,s:.55},{d:1000,at:600+i*150});H.O(gl2[i],1,{at:1500+i*150})})},
    ()=>{seeds.forEach((S,i)=>{H.T(S,{x:S.home[0],y:S.home[1]},{d:0});pop(S,{at:i*50})});H.O(sq,1,{at:600});
      H.after(1500,()=>{H.O(sq,0);seeds.forEach((S,i)=>{H.T(S,{x:S.dest[0],y:S.dest[1],s:.78},{d:1200,at:i*30})});H.O(nums,1,{at:1300})})},
  ];}},

/* 2 ─────────────────────────────── */
{sec:'2.1',title:'Blending or Particles?',caption:'Gregor Mendel (1822–1884) · photo: unknown author, public domain, via Wikimedia Commons · × = crossed with',
text:`<p data-step="0"><b>Heritable traits</b> are features that parents pass to their offspring, for example the colour of a pea seed. Before Mendel, the usual model was <b>blended inheritance</b>: the traits of the two parents mix like paint.</p>
<p data-step="1">The blending model predicts that yellow × green (yellow crossed with green) gives yellow-green offspring. A blend cannot separate again, so pure yellow and pure green never return.</p>
<p data-step="2">Mendel crossed pea plants from 1856 to 1863 and presented his results in 1865. Mendel concluded that separate units that do not mix control the traits. A unit can be hidden in one generation and appear again, unchanged, in the next. This model is <b>particulate inheritance</b>.</p>
<p data-step="3">Today we know that the units are genes: segments of DNA on the chromosomes. A gene copy passes to the offspring as an intact piece of DNA, so it cannot blend.</p>`,
star:'Paint blends; genes are beads that do not blend.',starStep:3,
scene(H){const s=stage();
  photo(s,'@@asset:c2-mendel.jpg@@',16,34,150,204);
  H.txt(s,91,262,'Gregor Mendel','lb',{'text-anchor':'middle'});H.txt(s,91,280,'monk and scientist, Brno','lbs',{'text-anchor':'middle'});
  const BL='color-mix(in srgb, var(--hi) 50%, var(--good))';
  // blending row
  const A=H.g(s);H.txt(A,200,48,'BLENDING MODEL','cap');
  const dY=H.E('circle',{cx:226,cy:92,r:18,st:`fill:${YEL};stroke:var(--ink);stroke-width:1.5`},A),dG=H.E('circle',{cx:292,cy:92,r:18,st:`fill:${GRN};stroke:var(--ink);stroke-width:1.5`},A);
  H.txt(A,259,98,'×','lb',{'text-anchor':'middle',st:'font-size:18px'});
  const aA=mkA(A,318,92,354,92,{w:1.6,h:7});const mix=at(A,380,92);H.E('circle',{r:18,st:`fill:${BL};stroke:var(--ink);stroke-width:1.5`},mix);hide(mix);
  const aA2=mkA(A,406,92,442,92,{w:1.6,h:7});
  const f2A=[470,512,554,596].map(x=>{const c=at(A,x,92);H.E('circle',{r:15,st:`fill:${BL};stroke:var(--ink);stroke-width:1.5`},c);hide(c);return c});
  const tA=H.txt(A,200,136,'Prediction: the blend stays. Yellow and green never return.','lbs');H.O(tA,0,{d:0});
  H.O(A,0,{d:0});
  // particle row
  const B=H.g(s);H.txt(B,200,186,'PARTICLE MODEL','cap');
  const bead=(p,x,y,c,r)=>{const G=at(p,x,y);H.E('circle',{r:r||9,st:`fill:${c};stroke:var(--ink);stroke-width:1.5`},G);return G};
  const pY=[bead(B,218,232,YEL),bead(B,238,232,YEL)],pG=[bead(B,284,232,GRN),bead(B,304,232,GRN)];
  H.txt(B,261,238,'×','lb',{'text-anchor':'middle',st:'font-size:18px'});
  const aB=mkA(B,318,232,348,232,{w:1.6,h:7});
  const F1=H.g(B);const f1y=bead(F1,372,232,YEL),f1g=bead(F1,392,232,GRN);H.txt(F1,382,262,'offspring look yellow','lbs',{'text-anchor':'middle'});H.O(F1,0,{d:0});
  const aB2=mkA(B,414,232,440,232,{w:1.6,h:7});
  const f2=H.g(B);[[466,YEL,YEL],[510,YEL,GRN],[554,GRN,YEL],[598,GRN,GRN]].forEach(([x,a,b])=>{bead(f2,x-10,232,a,8);bead(f2,x+10,232,b,8)});
  const ret=H.E('rect',{x:578,y:216,width:40,height:32,rx:8,st:'fill:none;stroke:var(--bad);stroke-width:2.5'},f2);
  H.txt(f2,618,266,'green returns','lbs',{'text-anchor':'end',st:'fill:var(--bad);font-weight:700'});H.O(f2,0,{d:0});
  H.O(B,0,{d:0});
  // DNA view
  const D=H.g(s);H.txt(D,200,316,'THE UNITS ARE GENES','cap');
  [[350,'dad'],[386,'mom']].forEach(([y,c])=>H.E('line',{x1:226,y1:y,x2:500,y2:y,st:`stroke:${H.C(c)};stroke-width:12;stroke-linecap:round`},D));
  const band=(y,t,c)=>{const G=at(D,366,y);H.E('rect',{x:-16,y:-11,width:32,height:22,rx:4,st:`fill:${c};stroke:var(--ink);stroke-width:1.6`},G);H.txt(G,0,5,t,'mt',{'text-anchor':'middle',st:'font-size:15px;fill:#16181d'});return G};
  band(350,'Y',YEL);band(386,'y',GRN);
  H.txt(D,514,354,'from father','lbs',{st:'fill:var(--dad);font-weight:700'});H.txt(D,514,390,'from mother','lbs',{st:'fill:var(--mom);font-weight:700'});
  H.txt(D,366,414,'one gene, two alleles','lbs',{'text-anchor':'middle'});
  H.O(D,0,{d:0});
  return [
    ()=>{H.O(A,1)},
    ()=>{drawA(aA);pop(mix,{at:500});
      drawA(aA2,{at:1100});f2A.forEach((c,i)=>pop(c,{at:1500+i*120}));H.O(tA,1,{at:2000})},
    ()=>{H.O(A,.35);H.O(B,1);drawA(aB,{at:300});H.O(F1,1,{at:700});drawA(aB2,{at:1300});H.O(f2,1,{at:1800})},
    ()=>{H.O(D,1)},
  ];}},

/* 3 ─────────────────────────────── */
{sec:'2.1',title:'Seed Shape: The Starch Gene',caption:'SBEI = starch-branching enzyme I · the inserted DNA is about 800 base pairs long · not to scale',
text:`<p data-step="0">The pea gene for seed shape is <span class="m">R</span>. A <b>locus</b> is the place on a chromosome where a gene is. The DNA of <span class="m">R</span> <b>codes for</b> (holds the instructions for) a <b>protein</b>, a molecule that does a job in the cell. This protein is an <b>enzyme</b>, a protein that speeds up one chemical reaction: <b>starch-branching enzyme I</b> (SBEI).</p>
<p data-step="1">SBEI adds side branches to the glucose chains of starch. With working SBEI, a young seed turns most of its sugar into starch.</p>
<p data-step="2">The <span class="m">r</span> allele has an extra piece of DNA inside the gene, about 800 <b>base pairs</b> (DNA letters) long. This piece is a <b>transposon</b>: a DNA segment that can move to new places in the <b>genome</b>, all the DNA of the organism. The insertion breaks the gene, so <span class="m">r</span> makes no working enzyme.</p>
<p data-step="3">An <span class="m">rr</span> seed makes less starch and keeps more sugar. The sugar pulls extra water into the young seed. When the ripe seed dries, it loses this water and wrinkles.</p>
<p data-step="4">One <span class="m">R</span> allele makes enough enzyme for a round seed. So <span class="m">Rr</span> seeds are round, like <span class="m">RR</span> seeds: <span class="m">R</span> is <b>dominant</b> and <span class="m">r</span> is <b>recessive</b>.</p>`,
star:'Wrinkled = jumping DNA landed in the starch gene.',starStep:2,
scene(H){const s=stage();
  // gene diagrams
  const dna=(y,lab)=>{const G=H.g(s);H.E('line',{x1:70,y1:y,x2:600,y2:y,st:'stroke:var(--muted);stroke-width:3'},G);rt(G,40,y+6,lab,'mt',{'text-anchor':'middle',st:'font-size:20px'});return G};
  dna(54,'R');const rr=dna(112,'r');
  const gene=(p,y)=>{const L=at(p,230,y),Rr=at(p,330,y);[L,Rr].forEach(G=>H.E('rect',{x:0,y:-12,width:100,height:24,rx:3,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.6'},G));return [L,Rr]};
  gene(s,54);H.txt(s,330,32,'SBEI gene','lb',{'text-anchor':'middle'});
  const [gL,gR]=gene(s,112);
  const tp=at(s,560,150);H.E('rect',{x:0,y:-12,width:56,height:24,rx:3,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.6'},tp);H.O(tp,0,{d:0});
  const tpl=H.txt(s,358,146,'transposon inserted (about 800 bp)','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});H.O(tpl,0,{d:0});
  // starch building (R)
  const P1=H.g(s);H.txt(P1,40,182,'WITH SBEI','cap');
  const chain=[];for(let i=0;i<9;i++){chain.push(H.E('circle',{cx:70+i*22,cy:250,r:7,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.4'},P1))}
  const br=[];[[114,-1],[158,1],[202,-1],[246,1]].forEach(([x,d])=>{for(let k=1;k<=3;k++){const c=H.E('circle',{cx:x+k*9,cy:250+d*k*17,r:6,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.3'},P1);H.O(c,0,{d:0});br.push(c)}});
  const enz=at(P1,60,212);const a=28*Math.PI/180;H.E('path',{d:`M0,0 L${13*Math.cos(a)},${-13*Math.sin(a)} A13,13 0 1 0 ${13*Math.cos(a)},${13*Math.sin(a)} Z`,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.4'},enz);
  H.txt(P1,40,322,'glucose chains become branched starch','lbs');H.O(P1,0,{d:0});
  // seeds: R vs r
  const P2=H.g(s);H.txt(P2,350,182,'RIPENING SEEDS','cap');
  const sR=seed(P2,410,244,30,1,1,5),sr=seed(P2,540,244,30,1,1,9);
  H.txt(P2,410,298,'RR or Rr','mt',{'text-anchor':'middle',st:'font-size:17px'});H.txt(P2,540,298,'rr','mt',{'text-anchor':'middle',st:'font-size:17px'});
  const drops=[];for(let i=0;i<6;i++){const d=H.E('path',{d:'M0,-6 Q5,1 0,5 Q-5,1 0,-6 Z',st:'fill:var(--dad);opacity:0'},P2);H.T(d,{x:540+Math.cos(i)*62,y:244+Math.sin(i*1.3)*50},{d:0});drops.push(d)}
  const sugar=[];for(let i=0;i<7;i++){const c=H.E('circle',{r:3,st:'fill:var(--ink);opacity:0'},P2);H.T(c,{x:540+((i*37)%40)-20,y:244+((i*23)%36)-18},{d:0});sugar.push(c)}
  const dry=H.txt(P2,540,196,'','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});
  H.O(P2,0,{d:0});
  // genotype row
  const P3=H.g(s);[[120,'RR','100%',1],[320,'Rr','50%',1],[520,'rr','0%',0]].forEach(([x,g,pc,rd])=>{chip(P3,x-50,352,g,{w:44});
    H.E('rect',{x:x-20,y:344,width:60,height:16,rx:3,st:'fill:none;stroke:var(--ink);stroke-width:1.3'},P3);
    const w=60*parseInt(pc)/100;if(w)H.E('rect',{x:x-20,y:344,width:w,height:16,rx:3,st:'fill:var(--good)'},P3);
    H.txt(P3,x+10,382,pc+' SBEI','lbs',{'text-anchor':'middle'});seed(P3,x+70,352,17,rd,1,x)});
  H.O(P3,0,{d:0});
  const X=H.g(s);H.E('path',{d:'M-9,-9 L9,9 M9,-9 L-9,9',st:'stroke:var(--bad);stroke-width:4;stroke-linecap:round'},X);H.T(X,{x:540,y:112},{d:0});H.txt(X,0,-18,'no enzyme','lbs',{'text-anchor':'middle',st:'fill:var(--bad);font-weight:700'});H.O(X,0,{d:0});
  return [
    ()=>{},
    ()=>{H.O(P1,1);H.T(enz,{x:236},{d:1800,at:300});br.forEach((c,i)=>H.O(c,1,{d:250,at:400+i*120}))},
    ()=>{H.O(tp,1,{d:200});H.T(gR,{x:386},{d:700});H.T(tp,{x:330,y:112},{d:900,at:200});H.O(tpl,1,{at:900});H.O(X,1,{at:1200})},
    ()=>{H.O(P2,1);drops.forEach((d,i)=>{d.style.opacity=.9;H.T(d,{x:540+Math.cos(i)*14,y:244+Math.sin(i*1.3)*12},{d:900,at:300+i*90})});
      sugar.forEach((c,i)=>H.O(c,.8,{at:i*60}));
      H.after(1300,()=>{H.T(sr,{s:1.22},{d:700});dry.textContent='takes up extra water';
        H.after(1100,()=>{drops.forEach(d=>{d.style.transitionDuration='500ms';d.style.opacity=0});H.O(sugar,0,{d:500});H.T(sr,{s:1},{d:700});setSeed(sr,0,1,{d:700});dry.textContent='dries and wrinkles'})})},
    ()=>{H.O(P3,1)},
  ];}},

/* 4 ─────────────────────────────── */
{sec:'2.1',title:'Seed Colour: The Stay-Green Gene',caption:'Split peas show the seed halves · yellow: Mx. Granger, CC0 · green: Liji Jinaraj, CC BY-SA 2.0 · both via Wikimedia Commons',
text:`<p data-step="0">Most of a pea seed is two seed leaves, the <b>cotyledons</b>. Seed colour is their colour. A young seed is green, because it contains <b>chlorophyll</b>, the green pigment of plants.</p>
<p data-step="1">As a seed with <span class="m">Y</span> ripens, a protein called <b>SGR</b> (stay-green) starts the breakdown of chlorophyll. The green colour goes, and the yellow colour shows.</p>
<p data-step="2">The green allele, <span class="m">y</span>, has a small DNA change, so its SGR protein does not work. The chlorophyll stays, and the ripe seed stays green.</p>
<p data-step="3">One <span class="m">Y</span> allele removes the chlorophyll, so <span class="m">Yy</span> seeds are yellow: yellow (<span class="m">Y</span>) is dominant to green (<span class="m">y</span>). Pea geneticists name this gene <span class="m">I</span>; most genetics problems use <span class="m">Y</span>.</p>
<p data-step="4">The seed-shape gene and the seed-colour gene are on different pea chromosomes.</p>`,
star:'Y works: green out, yellow shows. y is broken: the seed stays green.',starStep:3,
scene(H){const s=stage();
  photo(s,'@@asset:c2-yellow-peas.jpg@@',16,22,296,150);photo(s,'@@asset:c2-green-peas.jpg@@',328,22,296,150);
  plate(s,24,162,'yellow cotyledons');plate(s,336,162,'green cotyledons');
  // ripening
  const R=H.g(s);H.txt(R,24,206,'RIPENING','cap');
  const mk=(x,lab)=>{const S=seed(R,x,262,34,1,0,3);const dots=[];for(let i=0;i<9;i++){const c=H.E('circle',{r:3.2,st:'fill:color-mix(in srgb, var(--good) 55%, #000)'},R);H.T(c,{x:x+((i*29)%46)-23,y:262+((i*17)%40)-20},{d:0});dots.push(c)}
    const L=rt(R,x,322,lab,'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600;font-size:13px'});H.O(L,0,{d:0});return {S,dots,L}};
  const A=mk(96,'Y allele: working SGR'),B=mk(276,'y allele: faulty SGR');
  const pac=(x,y,broken)=>{const G=at(R,x,y);const a=28*Math.PI/180;H.E('path',{d:`M0,0 L${12*Math.cos(a)},${-12*Math.sin(a)} A12,12 0 1 0 ${12*Math.cos(a)},${12*Math.sin(a)} Z`,
    st:`fill:${broken?'var(--card)':'var(--good)'};stroke:var(--ink);stroke-width:1.4${broken?';stroke-dasharray:3 2':''}`},G);return G};
  const e1=pac(30,262),e2=pac(210,262,1);H.O([e1,e2],0,{d:0});
  H.O(R,0,{d:0});
  // genotype row
  const G3=H.g(s);[[60,'YY',1],[170,'Yy',1],[280,'yy',0]].forEach(([x,g,y])=>{chip(G3,x-22,372,g,{w:40});seed(G3,x+24,372,16,1,y,x)});H.O(G3,0,{d:0});
  // two chromosomes
  const C=H.g(s);H.txt(C,400,206,'TWO DIFFERENT CHROMOSOMES','cap');
  ctd(C,440,290,120,'dad',[['R',-30]],12);ctd(C,470,290,120,'mom',[['r',-30]],12);
  ctd(C,560,300,84,'dad',[['Y',-16]],12);ctd(C,590,300,84,'mom',[['y',-16]],12);
  H.txt(C,455,374,'seed shape','lbs',{'text-anchor':'middle'});H.txt(C,575,374,'seed colour','lbs',{'text-anchor':'middle'});
  H.O(C,0,{d:0});
  return [
    ()=>{H.O(R,1)},
    ()=>{H.O(e1,1);H.O(A.L,1);H.T(e1,{x:122},{d:1600,at:200});A.dots.forEach((d,i)=>H.O(d,0,{d:250,at:400+i*130}));setSeed(A.S,1,1,{d:900,at:1500})},
    ()=>{H.O(e2,1);H.O(B.L,1);H.T(e2,{x:302},{d:1600,at:200})},
    ()=>{H.O(G3,1)},
    ()=>{H.O(C,1)},
  ];}},

/* 5 ─────────────────────────────── */
{sec:'2.1',title:'Each Gene Alone Gives 3 : 1',caption:'Rows = alleles in egg cells (orange) · columns = alleles in sperm cells from pollen (blue)',
text:`<p data-step="0">A <b>homozygous</b> plant has two identical alleles of a gene. A <b>heterozygous</b> plant has two different alleles. A <b>pure-breeding</b> line is homozygous: when the plants of the line breed with each other, all offspring have the same trait. Mendel crossed a pure-breeding round line (<span class="m">RR</span>) with a pure-breeding wrinkled line (<span class="m">rr</span>), the parental (<b>P</b>) generation.</p>
<p data-step="1">All their offspring, the <b>F1</b> generation, had the <b>genotype</b> (pair of alleles) <span class="m">Rr</span> and the <b>phenotype</b> (visible trait) round. A cross that follows one gene is a <b>monohybrid cross</b>.</p>
<p data-step="2">Pea flowers usually pollinate themselves. The two alleles of a gene <b>segregate</b> (separate) into different gametes, so each F1 plant makes <span class="m">R</span> and <span class="m">r</span> gametes in equal numbers. This is Mendel’s First Law, the <b>Law of Segregation</b>.</p>
<p data-step="2">The grid, a <b>Punnett square</b>, shows the four equally likely combinations. The <b>F2</b> seeds are ¼ <span class="m">RR</span>, ½ <span class="m">Rr</span> and ¼ <span class="m">rr</span>: 3 round to 1 wrinkled.</p>
<p data-step="3">Seed colour gives the same pattern: ¾ yellow and ¼ green. Next, Mendel followed both genes in the same plants.</p>`,
star:'One gene: 3:1. Two genes: multiply.',starStep:3,
scene(H){const s=stage();
  const side=(x0,A,a,shape)=>{const G=H.g(s);const sd=(p,x,y,r,dom,k)=>seed(p,x,y,r,shape?dom:1,shape?1:dom,k);
    H.txt(G,x0+110,30,shape?'SEED SHAPE':'SEED COLOUR','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
    const P=H.g(G);sd(P,x0+50,66,16,1,1);H.txt(P,x0+50,98,A+A,'mt',{'text-anchor':'middle',st:'font-size:16px'});H.txt(P,x0+110,72,'×','lb',{'text-anchor':'middle',st:'font-size:18px'});
    sd(P,x0+170,66,16,0,2);H.txt(P,x0+170,98,a+a,'mt',{'text-anchor':'middle',st:'font-size:16px'});H.txt(P,x0+2,70,'P','lb',{st:'fill:var(--muted)'});
    const F1=H.g(G);sd(F1,x0+110,132,16,1,4);H.txt(F1,x0+140,138,A+a,'mt',{st:'font-size:16px'});H.txt(F1,x0+2,136,'F1','lb',{st:'fill:var(--muted)'});H.O(F1,0,{d:0});
    // Punnett 2x2
    const Q=H.g(G);const gx=x0+70,gy=190,c=54;
    [A,a].forEach((t,j)=>chip(Q,gx+c/2+j*c,gy-16,t,{stroke:'dad',w:30,h:22}));[A,a].forEach((t,i)=>chip(Q,gx-18,gy+c/2+i*c,t,{stroke:'mom',w:30,h:22}));
    const boxes=[];for(let i=0;i<2;i++)for(let j=0;j<2;j++){const g=([A,a][j]===A||[A,a][i]===A);const B=at(Q,gx+j*c,gy+i*c);
      H.E('rect',{x:0,y:0,width:c,height:c,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},B);      const gt=(i===0&&j===0)?A+A:(i===1&&j===1)?a+a:A+a;H.txt(B,c/2,20,gt,'mt',{'text-anchor':'middle',st:'font-size:15px'});sd(B,c/2,37,10,g?1:0,i*2+j+5);hide(B);boxes.push(B)}
    const r=H.txt(G,x0+110,330,shape?'3 round : 1 wrinkled':'3 yellow : 1 green','lb',{'text-anchor':'middle'});const r2=H.txt(G,x0+110,350,'¾ : ¼','lbs',{'text-anchor':'middle'});
    H.O([Q,r,r2],0,{d:0});G.F1=F1;G.Q=Q;G.boxes=boxes;G.r=[r,r2];G.P=P;return G};
  const L=side(20,'R','r',1),Rt=side(330,'Y','y',0);H.O(Rt,0,{d:0});
  H.E('line',{x1:320,y1:20,x2:320,y2:360,st:'stroke:var(--faint);stroke-width:1.5;stroke-dasharray:4 5'},s);
  const both=H.g(s);H.txt(both,320,396,'Both genes in one plant:','lb',{'text-anchor':'end'});rt(both,330,396,'RRYY × rryy','mt',{st:'font-size:18px'});H.O(both,0,{d:0});
  const showQ=G=>{H.O(G.Q,1);G.boxes.forEach((b,i)=>pop(b,{at:300+i*150}));H.O(G.r,1,{at:1100})};
  return [
    ()=>{},
    ()=>{H.O(L.F1,1)},
    ()=>{showQ(L)},
    ()=>{H.O(Rt,1);H.O(Rt.F1,1,{at:300});H.after(500,()=>showQ(Rt));H.O(both,1,{at:2000})},
  ];}},

/* 6 ─────────────────────────────── */
{sec:'2.1',title:'Writing Two Genes',caption:'A, B = any two genes · pea example: R (seed shape) and Y (seed colour)',
text:`<p data-step="0">A <b>dihybrid</b> is an individual that is heterozygous at two genes. For two genes <span class="m">A</span> and <span class="m">B</span>, the notation shows where the alleles are.</p>
<p data-step="1"><b>Different chromosomes.</b> A semicolon separates the chromosome pairs: <span class="m">A/a ; B/b</span>. The slash separates the two chromosomes of one pair.</p>
<p data-step="2"><b>Same chromosome.</b> Write together the alleles on one chromosome of the pair. <span class="m">AB/ab</span> means that one chromosome carries <span class="m">A</span> and <span class="m">B</span>. The other chromosome of the pair carries <span class="m">a</span> and <span class="m">b</span>.</p>
<p data-step="3"><b>Position unknown.</b> No marks: <span class="m">AaBb</span>. Write both alleles of one gene, then the next gene: <span class="m">AaBb</span>, not <span class="m">ABab</span>. The order of the genes says nothing about their positions.</p>
<p data-step="4">An underscore means “either allele”. <span class="m">R_Y_</span> is any round, yellow seed: <span class="m">RRYY</span>, <span class="m">RRYy</span>, <span class="m">RrYY</span> or <span class="m">RrYy</span>.</p>`,
star:'Semicolon = different chromosome pairs. Slash = the two chromosomes of one pair.',starStep:2,
scene(H){const s=stage();
  const P1=H.g(s),P2=H.g(s),P3=H.g(s);
  ctd(P1,62,128,128,'dad',[['A',-30]],12);ctd(P1,90,128,128,'mom',[['a',-30]],12);ctd(P1,138,138,92,'dad',[['B',-16]],12);ctd(P1,166,138,92,'mom',[['b',-16]],12);
  const n1=H.g(P1);rt(n1,114,232,'A/a ; B/b','mt',{'text-anchor':'middle',st:'font-size:22px'});H.txt(n1,114,254,'different chromosomes','lbs',{'text-anchor':'middle'});H.O(n1,0,{d:0});
  ctd(P2,304,128,150,'dad',[['A',-40],['B',36]],12);ctd(P2,336,128,150,'mom',[['a',-40],['b',36]],12);
  rt(P2,320,232,'AB/ab','mt',{'text-anchor':'middle',st:'font-size:22px'});H.txt(P2,320,254,'same chromosome','lbs',{'text-anchor':'middle'});
  const q=at(P3,526,128);H.E('rect',{x:-50,y:-66,width:100,height:132,rx:12,st:'fill:var(--wash);stroke:var(--ink);stroke-width:1.5;stroke-dasharray:6 5'},q);H.txt(q,0,16,'?','big',{'text-anchor':'middle',st:'font-size:48px;fill:var(--muted)'});
  rt(P3,526,232,'AaBb','mt',{'text-anchor':'middle',st:'font-size:22px'});H.txt(P3,526,254,'position unknown','lbs',{'text-anchor':'middle'});
  [P2,P3].forEach(P=>H.O(P,0,{d:0}));
  const ord=H.g(s);const bad=rt(ord,200,316,'ABab','mt',{'text-anchor':'middle',st:'font-size:22px;fill:var(--muted)'});
  const strike=H.E('line',{x1:168,y1:310,x2:232,y2:310,pathLength:1,cls:'draw',st:'stroke:var(--bad);stroke-width:3'},ord);
  const good=rt(ord,330,316,'AaBb','mt',{'text-anchor':'middle',st:'font-size:22px'});const ok=H.txt(ord,372,316,'✓','lb',{st:'fill:var(--good);font-size:20px'});
  H.txt(ord,330,338,'gene A first, then gene B','lbs',{'text-anchor':'middle'});H.O(ord,0,{d:0});H.O([good,ok],0,{d:0});
  const us=H.g(s);H.txt(us,30,388,'R_Y_','mt',{st:'font-size:22px'});seed(us,108,381,14,1,1,4);H.txt(us,134,387,'=','lb',{st:'font-size:18px'});
  ['RRYY','RRYy','RrYY','RrYy'].forEach((g,i)=>{chip(us,194+i*84,380,g,{w:72});});H.O(us,0,{d:0});
  return [
    ()=>{},
    ()=>{H.O(n1,1)},
    ()=>{H.O(P2,1)},
    ()=>{H.O(P3,1);H.O(ord,1,{at:300});H.D(strike,1,{d:500,at:900});H.O([good,ok],1,{at:1300})},
    ()=>{H.O(us,1)},
  ];}},

/* 7 ─────────────────────────────── */
{sec:'2.2',title:'Meiosis I: Each Pair Faces Either Way',caption:'Model meiocyte R/r ; Y/y · long pair = seed shape, short pair = seed colour · blue = from the father, orange = from the mother',
text:`<p data-step="0"><b>Meiosis</b> is the cell division that makes gametes. It has two divisions, <b>meiosis I</b> and <b>meiosis II</b>, and it halves the chromosome number. A <b>meiocyte</b> is a cell that divides by meiosis. This meiocyte is <span class="m">R/r ; Y/y</span>.</p>
<p data-step="0">Before meiosis, each chromosome replicates, so it has two identical <b>sister chromatids</b>. In <b>prophase I</b>, the first stage, the chromosomes become short and thick.</p>
<p data-step="1">The two chromosomes of a pair, one from each parent, are <b>homologous chromosomes</b>. In <b>metaphase I</b>, the pairs align on the middle plane of the cell. The <b>poles</b> are the two opposite ends of the cell. The father’s chromosome (blue) can face the left pole or the right pole. Both directions are equally likely.</p>
<p data-step="2"><b>Way 1.</b> Both blue chromosomes face the same pole. In <b>anaphase I</b>, the two chromosomes of each pair move to opposite poles. In meiosis II, the sister chromatids separate into different gametes. The result is two <span class="m">RY</span> gametes and two <span class="m">ry</span> gametes.</p>`,
star:'Meiosis I separates the pairs. Meiosis II separates the sister chromatids.',starStep:2,
scene(H){const s=stage();
  const M=meio(H,s,{pairs:[{y:104,len:70,bt:[['R',-18]],ot:[['r',-18]],flip:0},{y:200,len:52,bt:[['Y',-12]],ot:[['y',-12]],flip:1}],
    lab:[['RY','RY','ry','ry'],['Ry','Ry','rY','rY']],head:['WAY 1','WAY 2']});
  M.scatter([[[262,118],[362,92]],[[300,206],[372,186]]]);
  const name=H.txt(s,16,40,'Prophase I','big',{st:'font-size:22px'});
  const pl=H.g(s);H.txt(pl,206,28,'pole','lbs',{'text-anchor':'middle'});H.txt(pl,434,28,'pole','lbs',{'text-anchor':'middle'});
  H.E('line',{x1:208,y1:34,x2:214,y2:140,st:'stroke:var(--muted);stroke-width:1'},pl);H.E('line',{x1:432,y1:34,x2:426,y2:140,st:'stroke:var(--muted);stroke-width:1'},pl);H.O(pl,0,{d:0});
  return [
    ()=>{},
    ()=>{name.textContent='Metaphase I';H.O(M.nuc,0,{d:600});H.O(M.poles,1,{d:600});H.O(pl,1,{at:600});M.meta(0,0,{d:1200});H.O(M.plate,1,{at:900})},
    ()=>{name.textContent='';H.O(pl,0,{d:300});H.O(M.plate,0,{d:300});M.run(0)},
  ];}},

/* 8 ─────────────────────────────── */
{sec:'2.2',title:'Way 2: Each Pair Is a Coin Toss',caption:'Model meiocytes R/r ; Y/y · blue = from the father, orange = from the mother',
text:`<p data-step="0">One meiocyte with its pairs in Way 1 made two <span class="m">RY</span> gametes and two <span class="m">ry</span> gametes.</p>
<p data-step="1"><b>Way 2.</b> In another meiocyte, the short pair faces the other way. Now the blue long chromosome and the orange short chromosome face the same pole. This meiocyte makes two <span class="m">Ry</span> gametes and two <span class="m">rY</span> gametes.</p>
<p data-step="2">The direction of one pair has no effect on the direction of the other pair. Each pair is like a separate coin toss. This is the physical cause of independent assortment.</p>`,
star:'Two pairs = two coins. Each lands on its own.',starStep:2,
scene(H){const s=stage();
  const M=meio(H,s,{pairs:[{y:104,len:70,bt:[['R',-18]],ot:[['r',-18]],flip:0},{y:200,len:52,bt:[['Y',-12]],ot:[['y',-12]],flip:1}],
    lab:[['RY','RY','ry','ry'],['Ry','Ry','rY','rY']],head:['WAY 1','WAY 2']});
  H.O(M.nuc,0,{d:0});H.O(M.poles,1,{d:0});M.meta(0,0,{d:0});M.run(0);
  const coins=[[548,100,'R','r'],[548,198,'Y','y']].map(([x,y,a,b])=>{const G=at(s,x,y);const face=H.g(G);H.E('circle',{r:22,st:'fill:var(--hi);stroke:var(--ink);stroke-width:2'},face);
    const t=H.txt(face,0,7,a,'mt',{'text-anchor':'middle',st:'font-size:20px;fill:#16181d'});face.style.transition='none';G.face=face;G.t=t;G.ab=[a,b];H.O(G,0,{d:0});return G});
  const coinL=H.txt(s,548,250,'which allele goes left?','lbs',{'text-anchor':'middle'});H.O(coinL,0,{d:0});
  return [
    ()=>{},
    ()=>{M.run(1)},
    ()=>{H.O(coins,1);H.O(coinL,1);if(H.instant)return;H.loop(t=>coins.forEach((c,i)=>{const v=Math.cos(t*(i?5.3:3.7));c.face.style.transform=`scale(${Math.max(.04,Math.abs(v))},1)`;c.t.textContent=v>0?c.ab[0]:c.ab[1]}))},
  ];}},

/* 9 ─────────────────────────────── */
{sec:'2.2',title:'Four Gamete Types in Equal Numbers',caption:'Model: 20 meiocytes, 10 in each way · each small circle = one meiocyte · left half = the chromosomes that face the same pole · each slab = one gamete',
text:`<p data-step="0">A plant makes its gametes from many meiocytes. In about half of the meiocytes, the pairs face Way 1. In the other half, they face Way 2. The model shows 20 meiocytes, 10 of each.</p>
<p data-step="1">Each meiocyte makes four gametes. Way 1 makes <span class="m">RY</span> and <span class="m">ry</span>. Way 2 makes <span class="m">Ry</span> and <span class="m">rY</span>. So the plant makes the four gamete types in equal numbers, ¼ each.</p>
<p data-step="2">A <b>probability</b> is the chance of an event, from 0 (never) to 1 (always). P(<span class="m">R</span>) means “the probability of <span class="m">R</span>”. Two events are <b>independent</b> when one has no effect on the other. A gamete gets <span class="m">R</span> with P = ½ and <span class="m">Y</span> with P = ½, so <span style="white-space:nowrap">P(<span class="m">RY</span>) = ½ × ½ = ¼</span>.</p>
<p data-step="3">Each extra chromosome pair with two different alleles doubles the number of gamete types: 2<sup>n</sup> types for n such pairs. Humans have 23 chromosome pairs. Without crossing over, one person can make 2<sup>23</sup> = 8,388,608 combinations of whole chromosomes.</p>`,
star:'n pairs → 2ⁿ gamete types.',starStep:3,
scene(H){const s=stage();
  const ways=[1,2,2,1,2, 1,1,2,1,2, 2,1,2,2,1, 1,2,1,1,2];
  const pos=ways.map((w,i)=>[44+(i%5)*56,64+Math.floor(i/5)*60]);
  const cells=ways.map((w,i)=>{const G=at(s,pos[i][0],pos[i][1]);H.E('circle',{r:22,cls:'cellfill',st:'stroke:var(--ink);stroke-width:2'},G);
    const L=[['dad',w===1?'dad':'mom'],['mom',w===1?'mom':'dad']];
    L.forEach(([cl,cs],k)=>{const x=k?6:-6;H.E('line',{x1:x,y1:-13,x2:x,y2:1,st:`stroke:${H.C(cl)};stroke-width:4.5;stroke-linecap:round`},G);H.E('line',{x1:x,y1:6,x2:x,y2:13,st:`stroke:${H.C(cs)};stroke-width:4.5;stroke-linecap:round`},G)});
    hide(G);return G});
  H.txt(s,156,30,'MODEL: 20 MEIOCYTES','cap',{'text-anchor':'middle'});
  const key=H.g(s);H.txt(key,20,316,'Way 1: blue + blue on one side','lbs',{st:'fill:var(--ink)'});H.txt(key,20,334,'Way 2: blue + orange on one side','lbs',{st:'fill:var(--ink)'});H.O(key,0,{d:0});
  const BX=[392,452,512,572],B0=290,u=6.6;const names=['RY','Ry','rY','ry'];
  H.E('line',{x1:362,y1:B0,x2:602,y2:B0,st:'stroke:var(--ink);stroke-width:2'},s);
  BX.forEach((x,i)=>chip(s,x,B0+20,names[i],{w:42}));
  const cnt=BX.map(x=>H.txt(s,x,B0-8,'0','lb',{'text-anchor':'middle'}));
  const fr=H.g(s);BX.forEach(x=>H.txt(fr,x,B0+56,'¼','lb',{'text-anchor':'middle',st:'font-size:18px'}));H.O(fr,0,{d:0});
  H.txt(s,482,112,'GAMETES MADE','cap',{'text-anchor':'middle'});
  const n=[0,0,0,0];const slabs=[];
  ways.forEach((w,i)=>{(w===1?[0,0,3,3]:[1,1,2,2]).forEach(t=>{const k=n[t]++;const G=at(s,pos[i][0],pos[i][1]);
    H.E('rect',{x:-18,y:-u/2+.6,width:36,height:u-1.2,rx:1.5,st:`fill:var(--${w===1?'dad':'mom'})`},G);H.O(G,0,{d:0});slabs.push({G,t,k,i})})});
  const pr=H.g(s);rt(pr,20,372,'P(R) = ½,  P(Y) = ½','mt',{st:'font-size:18px'});rt(pr,20,398,'P(RY) = ½ × ½ = ¼','mt',{st:'font-size:18px'});H.O(pr,0,{d:0});
  const dbl=H.g(s);const dT=H.txt(dbl,600,404,'','lb',{'text-anchor':'end',st:'font-size:17px;font-variant-numeric:tabular-nums'});const dL=H.txt(dbl,600,384,'','lbs',{'text-anchor':'end'});H.O(dbl,0,{d:0});
  return [
    ()=>{cells.forEach((c,i)=>pop(c,{at:i*40}));H.O(key,1,{at:900})},
    ()=>{const c=[0,0,0,0];slabs.forEach(({G,t,k,i})=>{const at0=i*110;H.O(G,1,{d:150,at:at0});H.T(G,{x:BX[t],y:B0-(k+.5)*u},{d:700,at:at0});
      H.after(at0+700,()=>{c[t]=Math.max(c[t],k+1);cnt[t].textContent=c[t];cnt[t].setAttribute('y',B0-c[t]*u-8)})});H.O(fr,1,{at:20*110+600})},
    ()=>{H.O(pr,1)},
    ()=>{H.O(dbl,1);dL.textContent='human: 23 pairs, no crossing over';const p={set textContent(v){dT.textContent='2²³ = '+v}};H.count(p,4,8388608,{d:1800})},
  ];}},

/* 9 ─────────────────────────────── */
{sec:'2.3',title:'Two Genes on One Chromosome',caption:'Model meiocyte AB/ab · no crossing over in this model',
text:`<p data-step="0">Now put two genes, <span class="m">A</span> and <span class="m">B</span>, on the same chromosome. The father’s chromosome carries <span class="m">A</span> and <span class="m">B</span>. The mother’s chromosome carries <span class="m">a</span> and <span class="m">b</span>. The genotype is <span class="m">AB/ab</span>.</p>
<p data-step="1"><b>Way 1.</b> The blue chromosome faces the left pole. The gametes are <span class="m">AB</span> and <span class="m">ab</span>.</p>
<p data-step="2"><b>Way 2.</b> The pair faces the other way. The gametes are again <span class="m">AB</span> and <span class="m">ab</span>. The alleles on one chromosome travel together, so the direction makes no difference.</p>
<p data-step="3"><b>Crossing over</b> is an exchange of DNA segments between the two chromosomes of a pair. Without crossing over, only two gamete types form. Both are <b>parental</b> types: they keep the allele combinations of the parents’ chromosomes. Genes that tend to stay together in this way show <b>linkage</b>.</p>`,
star:'Same chromosome = alleles travel together, unless a crossover separates them.',starStep:3,
scene(H){const s=stage();
  const M=meio(H,s,{pairs:[{y:150,len:112,bt:[['A',-32],['B',32]],ot:[['a',-32],['b',32]],flip:1}],
    lab:[['AB','AB','ab','ab'],['ab','ab','AB','AB']],head:['WAY 1','WAY 2'],gr:31,gs:.5,gy:330});
  H.O(M.nuc,0,{d:0});H.O(M.poles,1,{d:0});H.O(M.plate,1,{d:0});
  const name=H.txt(s,16,40,'Metaphase I','big',{st:'font-size:22px'});
  const sum=H.g(s);H.txt(sum,540,70,'ONLY 2 TYPES','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  chip(sum,512,104,'AB',{stroke:'dad'});chip(sum,568,104,'ab',{stroke:'mom'});H.txt(sum,540,142,'parental gametes','lbs',{'text-anchor':'middle'});
  H.txt(sum,540,176,'not 4 types','lb',{'text-anchor':'middle',st:'fill:var(--bad)'});H.O(sum,0,{d:0});
  return [
    ()=>{},
    ()=>{name.textContent='';H.O(M.plate,0,{d:300});M.run(0)},
    ()=>{M.run(1)},
    ()=>{H.O(sum,1)},
  ];}},

/* 10 ─────────────────────────────── */
{sec:'2.3',title:'Crossing Over Separates Linked Genes',caption:'One homologous pair in prophase I · the curve shows the general trend, not data',
text:`<p data-step="0">In prophase I, the two chromosomes of each pair lie side by side. <b>Non-sister chromatids</b> are two chromatids from different chromosomes of the pair.</p>
<p data-step="1">In crossing over, two non-sister chromatids exchange DNA segments. A crossover between locus <span class="m">A</span> and locus <span class="m">B</span> makes two <b>recombinant</b> chromatids, <span class="m">Ab</span> and <span class="m">aB</span>. The other two keep the parental combinations.</p>
<p data-step="2">Crossovers can happen almost anywhere along a chromosome. So the farther apart two loci are, the more often a crossover falls between them.</p>
<p data-step="3">The <b>recombination frequency</b> (RF) is the fraction of gametes that are recombinant. For loci far apart, RF is almost 50%. Then the four gamete types are almost equal, as for genes on different chromosomes.</p>
<p data-step="3" class="note">Mendel studied seven pea traits, each controlled by one gene. Pea has 7 chromosome pairs, but Mendel’s seven genes are on only four of them. Most genes that share a chromosome are far apart and assort almost independently. One pair (stem length and pod shape) is close, but Mendel did not report that cross.</p>`,
star:'Far apart on one chromosome behaves like different chromosomes.',starStep:3,
scene(H){const s=stage();
  const X=[92,118,178,204],top=62,mid=226,bot=330,cen=146;const col=['dad','dad','mom','mom'];
  X.forEach((x,i)=>H.E('line',{x1:x,y1:top,x2:x,y2:mid,st:`stroke:${H.C(col[i])};stroke-width:13;stroke-linecap:round`},s));
  const lo=X.map((x,i)=>{const G=at(s,x,0);H.E('line',{x1:0,y1:mid,x2:0,y2:bot,st:`stroke:${H.C(col[i])};stroke-width:13;stroke-linecap:round`},G);return G});
  [105,191].forEach(x=>H.E('rect',{x:x-20,y:cen-4,width:40,height:8,rx:4,cls:'kf'},s));
  const tag=(p,x,y,t)=>{const T=at(p,x,y);H.E('rect',{x:-9,y:-9,width:18,height:18,rx:3,cls:'card',st:'stroke:var(--ink);stroke-width:1.4'},T);H.txt(T,0,5,t,'mt',{'text-anchor':'middle',st:'font-size:14px'});return T};
  X.forEach((x,i)=>tag(s,x,94,i<2?'A':'a'));const tB=lo.map((G,i)=>tag(G,0,300,i<2?'B':'b'));
  const sis=H.g(s);H.txt(sis,105,44,'sisters','lbs',{'text-anchor':'middle'});H.txt(sis,191,44,'sisters','lbs',{'text-anchor':'middle'});
  const non=H.g(s);H.E('path',{d:'M118,28 L118,20 L178,20 L178,28',st:'fill:none;stroke:var(--ink);stroke-width:1.5'},non);H.txt(non,148,14,'non-sisters','lb',{'text-anchor':'middle',st:'font-size:13px'});H.O(non,0,{d:0});
  const chi=H.g(s);H.E('path',{d:`M118,${mid-22} L178,${mid+22} M178,${mid-22} L118,${mid+22}`,pathLength:1,cls:'draw',st:'stroke:var(--hi);stroke-width:5;stroke-linecap:round'},chi);
  const res=H.g(s);[['AB',92,0],['Ab',118,1],['aB',178,1],['ab',204,0]].forEach(([t,x,r])=>H.txt(res,x,358,t,'mt',{'text-anchor':'middle',st:`font-size:16px;${r?'fill:var(--ink)':'fill:var(--muted)'}`}));
  H.txt(res,148,380,'2 recombinant','lb',{'text-anchor':'middle',st:'font-size:13px'});H.txt(res,148,398,'2 parental','lbs',{'text-anchor':'middle'});H.O(res,0,{d:0});
  // RF graph
  const g0=[366,320],GW=240,GH=200;const gx=d=>g0[0]+GW*d/2.2,gy=rf=>g0[1]-GH*rf/.5;
  const G=H.g(s);H.E('path',{d:`M${g0[0]},${g0[1]-GH-14} L${g0[0]},${g0[1]} L${g0[0]+GW+10},${g0[1]}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},G);
  H.E('line',{x1:g0[0],y1:gy(.5),x2:g0[0]+GW,y2:gy(.5),st:'stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 5'},G);
  [[0,'0%'],[.25,'25%'],[.5,'50%']].forEach(([v,t])=>H.txt(G,g0[0]-8,gy(v)+4,t,'lbs',{'text-anchor':'end'}));
  H.txt(G,g0[0]+GW/2,g0[1]+24,'distance between the loci →','lbs',{'text-anchor':'middle'});H.txt(G,g0[0],g0[1]-GH-22,'RF','lb',{'text-anchor':'middle'});
  let d='';for(let i=0;i<=60;i++){const v=2.2*i/60;d+=(i?' L':'M')+gx(v).toFixed(1)+','+gy(.5*(1-Math.exp(-2*v))).toFixed(1)}
  const curve=H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:3'},G);H.O(G,0,{d:0});
  const dot=H.E('circle',{r:8,st:'fill:var(--mom);stroke:var(--paper);stroke-width:3'},s);H.O(dot,0,{d:0});
  const dl=H.txt(s,0,0,'','lb',{st:'font-size:13px'});
  const place=(v,lab,o)=>{const rf=.5*(1-Math.exp(-2*v));H.T(dot,{x:gx(v),y:gy(rf)},o);H.T(dl,{x:gx(v)+(v>1.4?4:12),y:gy(rf)+(v>1.4?-14:18)},o);dl.setAttribute('text-anchor',v>1.4?'end':'start');dl.textContent=lab;};
  place(.12,'',{d:0});
  return [
    ()=>{H.O(non,1)},
    ()=>{H.D(chi.firstChild,1,{d:700});H.after(900,()=>{H.T(lo[1],{x:178},{d:1200});H.T(lo[2],{x:118},{d:1200});H.O(chi,0,{d:500,at:600});H.O(res,1,{at:1200})})},
    ()=>{H.O(G,1);H.D(curve,1,{d:1200});H.O(dot,1,{at:300});tB.forEach(t=>H.T(t,{y:246},{d:800}));place(.12,'close: RF small',{d:800,at:300});
      H.after(1500,()=>{tB.forEach(t=>H.T(t,{y:300},{d:900}));place(.5,'farther: RF larger',{d:900})})},
    ()=>{place(2.05,'very far: RF almost 50%',{d:1200})},
  ];}},

/* 11 ─────────────────────────────── */
{sec:'2.4',title:'Mendel’s Dihybrid Cross',caption:'Painting: Daniel J. Fairbanks, “Mendel’s Experiments: Seed Shape & Color” (2017), CC BY-SA 4.0, via Wikimedia Commons',
text:`<p data-step="0">A <b>dihybrid cross</b> is a cross between two dihybrids. To make dihybrids, Mendel crossed a pure-breeding round, yellow line (<span class="m">RRYY</span>) with a pure-breeding wrinkled, green line (<span class="m">rryy</span>).</p>
<p data-step="1">Every F1 seed was round and yellow. Every F1 plant was a dihybrid, <span class="m">RrYy</span>.</p>
<p data-step="2">Mendel let 15 F1 plants pollinate themselves. Their pods held four kinds of seed, often side by side in one pod. The painting shows two such pods.</p>
<p data-step="3">Two kinds were new combinations: round green and wrinkled yellow. Neither parent had them, so the two traits can separate. The numbers of each kind show that the genes assort independently.</p>`,
star:'New combinations = the traits can separate. 9:3:3:1 = they assort independently.',starStep:3,
scene(H){const s=stage();
  const P=H.g(s);H.txt(P,16,70,'P','lb',{st:'fill:var(--muted)'});seed(P,90,64,20,1,1,3);seed(P,240,64,20,0,0,5);H.txt(P,165,70,'×','lb',{'text-anchor':'middle',st:'font-size:20px'});
  H.txt(P,90,104,'RRYY','mt',{'text-anchor':'middle',st:'font-size:16px'});H.txt(P,240,104,'rryy','mt',{'text-anchor':'middle',st:'font-size:16px'});
  const a1=mkA(s,165,114,165,146,{w:1.8,h:7});
  const F1=H.g(s);H.txt(F1,16,176,'F1','lb',{st:'fill:var(--muted)'});seed(F1,165,170,20,1,1,7);H.txt(F1,196,176,'RrYy','mt',{st:'font-size:16px'});H.txt(F1,196,194,'dihybrid','lbs');H.O(F1,0,{d:0});
  const a2=mkA(s,165,200,165,234,{w:1.8,h:7});const self=H.txt(s,176,222,'self-pollination','lbs');H.O(self,0,{d:0});
  const F2=H.g(s);H.txt(F2,16,280,'F2','lb',{st:'fill:var(--muted)'});
  const xs=[66,148,230,312];CLS.forEach((c,i)=>{seed(F2,xs[i],274,19,c.round,c.yellow,i+11);c.name.split(', ').forEach((w,k)=>H.txt(F2,xs[i],316+k*16,w,'lbs',{'text-anchor':'middle',st:'fill:var(--ink)'}))});H.O(F2,0,{d:0});
  const ring=H.g(s);[148,230].forEach(x=>H.E('circle',{cx:x,cy:274,r:25,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--bad);stroke-width:3'},ring));
  const nl=H.txt(s,189,374,'new combinations','lb',{'text-anchor':'middle',st:'fill:var(--bad)'});H.O(nl,0,{d:0});
  const art=H.g(s);photo(art,'@@asset:c2-f2-pods.jpg@@',408,18,208,384,{fit:'xMidYMid meet'});plate(art,512,394,'F2 pods',{anchor:'middle'});H.O(art,0,{d:0});
  return [
    ()=>{},
    ()=>{drawA(a1);H.O(F1,1,{at:500})},
    ()=>{drawA(a2);H.O(self,1);H.O(F2,1,{at:600});H.O(art,1,{at:900,d:800})},
    ()=>{H.D([...ring.children],1,{d:800});H.O(nl,1,{at:600})},
  ];}},

/* 12 ─────────────────────────────── */
{sec:'2.4',title:'The 16-Box Punnett Square',caption:'Columns = sperm cells from pollen (blue) · rows = egg cells (orange) · both from RrYy plants',
text:`<p data-step="0">A Punnett square lists the gametes of one parent across the top and the gametes of the other parent down the side. Each <span class="m">RrYy</span> parent makes four gamete types, ¼ each.</p>
<p data-step="1">Each box joins one sperm cell and one egg cell. There are 4 × 4 = 16 boxes, and each box has a probability of 1/16.</p>
<p data-step="2">A seed with at least one <span class="m">R</span> and at least one <span class="m">Y</span> is round and yellow: <span class="m">R_Y_</span>. Nine boxes are <span class="m">R_Y_</span>.</p>
<p data-step="3">Three boxes are <span class="m">R_yy</span> (round, green). Three boxes are <span class="m">rrY_</span> (wrinkled, yellow).</p>
<p data-step="4">One box is <span class="m">rryy</span> (wrinkled, green). The phenotypic ratio is 9:3:3:1.</p>`,
star:'9&#8239;:&#8239;3&#8239;:&#8239;3&#8239;:&#8239;1 = both dominant : one : the other : neither.',starStep:4,
scene(H){const s=stage();const ord=['RY','Ry','rY','ry'],c=54,x0=112,y0=94;
  H.txt(s,x0+2*c,30,'SPERM CELLS (POLLEN)','cap',{'text-anchor':'middle',st:'fill:var(--dad)'});H.txt(s,x0-36,y0-30,'EGG CELLS','cap',{'text-anchor':'middle',st:'fill:var(--mom)'});
  const hc=ord.map((g,j)=>{const C=chip(s,x0+c/2+j*c,y0-18,g,{stroke:'dad',w:42});return C});
  const hr=ord.map((g,i)=>{const C=chip(s,x0-28,y0+c/2+i*c,g,{stroke:'mom',w:42});return C});
  [...hc,...hr].forEach(C=>hide(C));
  const geno=(a,b)=>{const R=[a[0],b[0]].sort().join(''),Y=[a[1],b[1]].sort().join('');return R+Y};
  const cls=(a,b)=>((a[0]==='R'||b[0]==='R')?'R':'r')+((a[1]==='Y'||b[1]==='Y')?'Y':'y');
  const boxes=[];for(let i=0;i<4;i++)for(let j=0;j<4;j++){const B=at(s,x0+j*c,y0+i*c);
    const r=H.E('rect',{x:0,y:0,width:c,height:c,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},B);
    const pd=H.txt(B,c/2,21,ord[j],'mt',{'text-anchor':'middle',st:'font-size:14px;fill:var(--dad)'}),md=H.txt(B,c/2,41,ord[i],'mt',{'text-anchor':'middle',st:'font-size:14px;fill:var(--mom)'});
    H.T(pd,{x:0,y:-(i*c+21+18)},{d:0});H.T(md,{x:-(j*c+c/2+28),y:-20+0},{d:0});H.O([pd,md],0,{d:0});
    const gt=rt(B,c/2,22,geno(ord[i],ord[j]),'mt',{'text-anchor':'middle',st:'font-size:14px'});H.O(gt,0,{d:0});
    const k=cls(ord[i],ord[j]),C=CLS.find(q=>q.k===k);const sd=seed(B,c/2,39,9,C.round,C.yellow,i*4+j+1);hide(sd);
    boxes.push({B,r,pd,md,gt,k,sd})}
  const tally=CLS.map((C,i)=>{const G=H.g(s);const y=118+i*54;seed(G,402,y,15,C.round,C.yellow,i+2);const n=H.txt(G,428,y+10,'','big',{st:'font-size:28px'});
    H.txt(G,462,y-1,C.name,'lb',{st:'font-size:14px'});H.txt(G,462,y+17,C.g,'mt',{st:'font-size:15px'});H.O(G,0,{d:0});G.n=n;return G});
  const prob=H.txt(s,x0+2*c,y0+4*c+22,'each box: probability 1/16','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});H.O(prob,0,{d:0});
  const RB=H.g(s);const bw=500,bx=112;let acc=0;[9,3,3,1].forEach((v,i)=>{const w=bw*v/16;H.E('rect',{x:bx+acc,y:356,width:w,height:30,st:`fill:${KC[CLS[i].k]};stroke:var(--ink);stroke-width:1.5`},RB);
    H.txt(RB,bx+acc+w/2,377,String(v),'lb',{'text-anchor':'middle',st:'font-size:16px'});acc+=w});H.O(RB,0,{d:0});
  const colour=(ks,at0)=>{let n=0;boxes.forEach(b=>{if(ks.includes(b.k)){fill(b.r,KC[b.k],{d:500,at:at0+n*90});pop(b.sd,{at:at0+n*90});n++}})};
  return [
    ()=>{hc.forEach((C,i)=>pop(C,{at:i*100}));hr.forEach((C,i)=>pop(C,{at:400+i*100}))},
    ()=>{boxes.forEach((b,n)=>{const t=n*70;H.O([b.pd,b.md],1,{d:200,at:t});H.T(b.pd,{x:0,y:0},{d:700,at:t});H.T(b.md,{x:0,y:0},{d:700,at:t});
      H.O([b.pd,b.md],0,{d:300,at:t+900});H.O(b.gt,1,{d:300,at:t+1000})});H.O(prob,1,{at:1800})},
    ()=>{H.O(prob,0);colour(['RY'],0);H.O(tally[0],1,{at:300});tally[0].n.textContent='9'},
    ()=>{colour(['Ry'],0);colour(['rY'],400);[1,2].forEach(i=>{H.O(tally[i],1,{at:300+i*200});tally[i].n.textContent='3'})},
    ()=>{colour(['ry'],0);H.O(tally[3],1,{at:200});tally[3].n.textContent='1';H.O(RB,1,{at:600})},
  ];}},

/* 13 ─────────────────────────────── */
{sec:'2.4',title:'Multiply: ¾ × ¾ = 9/16',caption:'Area = probability · the whole square = all F2 seeds = 1',
text:`<p data-step="0">Each gene alone still gives 3&#8239;:&#8239;1. For seed shape, ¾ of the F2 seeds are round and ¼ are wrinkled.</p>
<p data-step="1">For seed colour, ¾ are yellow and ¼ are green. With independent assortment, this 3&#8239;:&#8239;1 ratio is the same among the round seeds and among the wrinkled seeds.</p>
<p data-step="2">So the fraction of round, yellow seeds is ¾ × ¾ = 9/16. Round, green: ¾ × ¼ = 3/16. Wrinkled, yellow: ¼ × ¾ = 3/16. Wrinkled, green: ¼ × ¼ = 1/16.</p>
<p data-step="3">The <b>product rule</b> multiplies the probabilities of independent events. The rule gives the same 9:3:3:1 as the 16-box square, in four steps instead of sixteen.</p>`,
star:'A 3&#8239;:&#8239;1 inside a 3&#8239;:&#8239;1 makes 9&#8239;:&#8239;3&#8239;:&#8239;3&#8239;:&#8239;1.',starStep:3,
scene(H){const s=stage();const X0=94,Y0=56,S=280,q=S*.75;
  const sq=H.E('rect',{x:X0,y:Y0,width:S,height:S,st:'fill:var(--card);stroke:var(--ink);stroke-width:2'},s);
  const rects=[[X0,Y0,q,q,'RY'],[X0,Y0+q,q,S-q,'Ry'],[X0+q,Y0,S-q,q,'rY'],[X0+q,Y0+q,S-q,S-q,'ry']].map(([x,y,w,h,k])=>{const r=H.E('rect',{x,y,width:w,height:h,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},s);r.k=k;return r});
  const vL=H.E('line',{x1:X0+q,y1:Y0,x2:X0+q,y2:Y0+S,pathLength:1,cls:'draw',st:'stroke:var(--ink);stroke-width:3'},s);
  const hL=H.E('line',{x1:X0,y1:Y0+q,x2:X0+S,y2:Y0+q,pathLength:1,cls:'draw',st:'stroke:var(--ink);stroke-width:3'},s);
  const top=H.g(s);H.txt(top,X0+q/2,Y0-24,'¾ round','lb',{'text-anchor':'middle'});H.txt(top,X0+q+(S-q)/2,Y0-24,'¼ wrinkled','lb',{'text-anchor':'middle',st:'font-size:13px'});
  seed(top,X0+q/2-50,Y0-29,9,1,1,1);H.O(top,0,{d:0});
  const left=H.g(s);H.txt(left,X0-10,Y0+q/2-2,'¾','lb',{'text-anchor':'end',st:'font-size:16px'});H.txt(left,X0-10,Y0+q/2+16,'yellow','lb',{'text-anchor':'end',st:'font-size:13px'});
  H.txt(left,X0-10,Y0+q+(S-q)/2-2,'¼','lb',{'text-anchor':'end',st:'font-size:16px'});H.txt(left,X0-10,Y0+q+(S-q)/2+16,'green','lb',{'text-anchor':'end',st:'font-size:13px'});H.O(left,0,{d:0});
  const frac=[[X0+q/2,Y0+q/2,'9/16',30],[X0+q/2,Y0+q+(S-q)/2,'3/16',20],[X0+q+(S-q)/2,Y0+q/2,'3/16',18],[X0+q+(S-q)/2,Y0+q+(S-q)/2,'1/16',15]].map(([x,y,t,f])=>{const e=H.txt(s,x,y+f*.35,t,'big',{'text-anchor':'middle',st:`font-size:${f}px`});H.O(e,0,{d:0});return e});
  const dots=[];const addDot=(x,y,c)=>{const S2=seed(s,x,y,13,c.round,c.yellow,dots.length+3);hide(S2);dots.push(S2)};
  [129,199,269].forEach(x=>[91,161,231].forEach(y=>addDot(x,y,CLS[0])));[129,199,269].forEach(x=>addDot(x,301,CLS[1]));[91,161,231].forEach(y=>addDot(339,y,CLS[2]));addDot(339,301,CLS[3]);
  const eq=CLS.map((C,i)=>{const G=H.g(s);const y=96+i*62;seed(G,412,y-5,13,C.round,C.yellow,i+5);
    const t=['¾ × ¾ = 9/16','¾ × ¼ = 3/16','¼ × ¾ = 3/16','¼ × ¼ = 1/16'][i];H.txt(G,436,y+1,t,'mt',{st:'font-size:20px'});H.txt(G,436,y+21,C.name,'lbs');H.O(G,0,{d:0});return G});
  const pr=H.g(s);H.txt(pr,520,370,'P(A and B) = P(A) × P(B)','mt',{'text-anchor':'middle',st:'font-size:18px'});H.txt(pr,520,392,'when A and B are independent','lbs',{'text-anchor':'middle'});H.O(pr,0,{d:0});
  return [
    ()=>{H.D(vL,1,{d:900});H.O(top,1,{at:400});fill(rects[0],'color-mix(in srgb, var(--ink) 6%, var(--card))',{at:300});fill(rects[1],'color-mix(in srgb, var(--ink) 6%, var(--card))',{at:300})},
    ()=>{H.D(hL,1,{d:900});H.O(left,1,{at:400})},
    ()=>{rects.forEach((r,i)=>fill(r,KC[r.k],{at:i*250}));frac.forEach((f,i)=>H.O(f,1,{at:300+i*250}));eq.forEach((g,i)=>H.O(g,1,{at:400+i*300}))},
    ()=>{H.O(frac,0,{d:400});dots.forEach((d,i)=>pop(d,{at:300+i*60}));H.O(pr,1,{at:900})},
  ];}},

/* 14 ─────────────────────────────── */
{sec:'2.4',title:'Mendel’s Counts',caption:'G. Mendel, Versuche über Pflanzen-Hybriden (1866), p. 19 · public domain, via Wikimedia Commons · rund = round, kantig = angular (wrinkled), gelb = yellow, grün = green',
text:`<p data-step="0">Mendel published his results in German in 1866. From his 15 dihybrid plants he collected 556 F2 seeds.</p>
<p data-step="1">He sorted them into four classes: 315 round yellow, 108 round green, 101 wrinkled yellow and 32 wrinkled green.</p>
<p data-step="2">The 9:3:3:1 ratio predicts about 313 round yellow seeds (556 × 9/16 ≈ 313; ≈ means “about”). It predicts about 104 for each 3/16 class and about 35 for wrinkled green. Mendel’s counts are close to these numbers.</p>
<p data-step="3">Real counts rarely match a ratio exactly, because each seed is a separate chance event. Large samples come closer to the predicted ratio than small samples.</p>`,
star:'315&#8239;:&#8239;108&#8239;:&#8239;101&#8239;:&#8239;32 ≈ 9&#8239;:&#8239;3&#8239;:&#8239;3&#8239;:&#8239;1.',starStep:2,
scene(H){const s=stage();const k=600/865;
  H.E('image',{href:'@@asset:c2-mendel-1866-counts.jpg@@',x:20,y:14,width:600,height:295*k},s);
  H.E('rect',{x:20,y:14,width:600,height:295*k,rx:4,st:'fill:none;stroke:var(--ink);stroke-width:1.5'},s);
  const hl=(x0,x1,y)=>{const r=H.E('rect',{x:20+x0*k,y:14+(y-17)*k,width:(x1-x0)*k,height:24*k,rx:3,st:'fill:var(--hi);opacity:0;mix-blend-mode:multiply'},s);return r};
  const h0=hl(168,520,128);const hs=[[290,560,160],[290,560,194],[290,560,228],[290,560,262]].map(a=>hl(...a));
  const vis=(r,v,o)=>{r.style.transitionDuration=((o&&o.d)||500)+'ms';r.style.transitionDelay=((o&&o.at)||0)+'ms';r.style.opacity=v};
  const obs=[315,108,101,32],exp=[312.75,104.25,104.25,34.75],xc=[110,250,390,530],B0=358,sc=110/315;
  const G=H.g(s);H.E('line',{x1:40,y1:B0,x2:600,y2:B0,st:'stroke:var(--ink);stroke-width:2'},G);
  const ob=xc.map((x,i)=>{const b=at(G,x-14,B0);H.E('rect',{x:-13,y:-1,width:26,height:1,st:'fill:var(--ink)'},b);H.T(b,{sy:.001},{d:0});return b});
  const ex=xc.map((x,i)=>{const b=H.E('rect',{x:x+2,y:B0-exp[i]*sc,width:26,height:exp[i]*sc,st:'fill:none;stroke:var(--ink);stroke-width:1.6;stroke-dasharray:4 3'},G);H.O(b,0,{d:0});return b});
  const on=xc.map((x,i)=>{const t=H.txt(G,x-14,B0-obs[i]*sc-6,String(obs[i]),'lb',{'text-anchor':'middle',st:'font-size:13px'});H.O(t,0,{d:0});return t});
  const en=xc.map((x,i)=>{const t=H.txt(G,x+15,B0-exp[i]*sc-6,String(Math.round(exp[i])),'lbs',{'text-anchor':'middle'});H.O(t,0,{d:0});return t});
  CLS.forEach((C,i)=>seed(G,xc[i]-46,B0-14,11,C.round,C.yellow,i+3));
  const pct=xc.map((x,i)=>{const t=H.txt(G,x,B0+22,`${(obs[i]/556*100).toFixed(1)}% vs ${(exp[i]/556*100).toFixed(2).replace(/0$/,'')}%`,'lbs',{'text-anchor':'middle',st:'fill:var(--ink)'});H.O(t,0,{d:0});return t});
  const key=H.g(s);H.E('rect',{x:448,y:226,width:12,height:12,st:'fill:var(--ink)'},key);H.txt(key,466,237,'counted','lbs');
  H.E('rect',{x:526,y:226,width:12,height:12,st:'fill:none;stroke:var(--ink);stroke-width:1.5;stroke-dasharray:3 2'},key);H.txt(key,544,237,'predicted','lbs');H.O(key,0,{d:0});
  const pc=H.txt(s,40,404,'counted % vs predicted % of all 556 seeds','lbs');H.O(pc,0,{d:0});
  return [
    ()=>{vis(h0,.55,{at:300})},
    ()=>{vis(h0,0);hs.forEach((r,i)=>vis(r,.55,{at:i*200}));ob.forEach((b,i)=>H.T(b,{sy:obs[i]*sc},{d:900,at:400+i*200}));on.forEach((t,i)=>H.O(t,1,{at:1100+i*200}));H.O(key,1)},
    ()=>{ex.forEach((b,i)=>H.O(b,1,{at:i*150}));en.forEach((t,i)=>H.O(t,1,{at:300+i*150}))},
    ()=>{pct.forEach((t,i)=>H.O(t,1,{at:i*150}));H.O(pc,1,{at:600})},
  ];}},

/* 15 ─────────────────────────────── */
{sec:'2.4',title:'Nine Genotypes: 1 : 2 : 1 : 2 : 4 : 2 : 1 : 2 : 1',caption:'Mendel’s numbers of F2 plants of each genotype (1866) · dashed line = number predicted from the Punnett square',
text:`<p data-step="0">One phenotype can hide several genotypes. A round, yellow seed can be <span class="m">RRYY</span>, <span class="m">RRYy</span>, <span class="m">RrYY</span> or <span class="m">RrYy</span>.</p>
<p data-step="1">Mendel planted his F2 seeds and looked at the seeds of each new plant. A plant with only round, yellow seeds was <span class="m">RRYY</span>. A plant with all four kinds of seed was <span class="m">RrYy</span>.</p>
<p data-step="2">His 529 plants had nine different genotypes. Each gene has three genotypes (for example <span class="m">RR</span>, <span class="m">Rr</span>, <span class="m">rr</span>), so two genes give 3 × 3 = 9.</p>
<p data-step="3">The Punnett square predicts 1, 2 or 4 boxes per genotype: a 1&#8239;:&#8239;2&#8239;:&#8239;1&#8239;:&#8239;2&#8239;:&#8239;4&#8239;:&#8239;2&#8239;:&#8239;1&#8239;:&#8239;2&#8239;:&#8239;1 ratio. Mendel’s counts follow it closely.</p>`,
star:'Phenotypes 9&#8239;:&#8239;3&#8239;:&#8239;3&#8239;:&#8239;1. Genotypes 1&#8239;:&#8239;2&#8239;:&#8239;1&#8239;:&#8239;2&#8239;:&#8239;4&#8239;:&#8239;2&#8239;:&#8239;1&#8239;:&#8239;2&#8239;:&#8239;1.',starStep:3,
scene(H){const s=stage();
  const T=H.g(s);seed(T,44,96,22,1,1,4);const ar=mkA(T,72,96,104,96,{w:1.6,h:7});
  ['RRYY','RRYy','RrYY','RrYy'].forEach((g,i)=>chip(T,150+(i%2)*80,76+Math.floor(i/2)*40,g,{w:70}));H.txt(T,190,148,'one phenotype, four genotypes','lbs',{'text-anchor':'middle'});
  const pod=(p,x,y,list)=>{const G=H.g(p);H.E('rect',{x,y:y-17,width:186,height:34,rx:17,st:'fill:color-mix(in srgb, var(--good) 22%, var(--card));stroke:var(--ink);stroke-width:1.5'},G);
    list.forEach((k,i)=>{const C=CLS.find(q=>q.k===k);seed(G,x+22+i*29,y,11,C.round,C.yellow,i*3+x)});return G};
  const Pd=H.g(s);H.txt(Pd,326,56,'SEEDS OF ONE F2 PLANT','cap');
  rt(Pd,326,88,'RRYY','mt',{st:'font-size:17px'});pod(Pd,430,83,['RY','RY','RY','RY','RY','RY']);
  rt(Pd,326,136,'RrYy','mt',{st:'font-size:17px'});pod(Pd,430,131,['RY','rY','Ry','RY','ry','RY']);H.O(Pd,0,{d:0});
  const data=[['RRYY',38,1],['RRYy',65,2],['RRyy',35,1],['RrYY',60,2],['RrYy',138,4],['Rryy',67,2],['rrYY',28,1],['rrYy',68,2],['rryy',30,1]];
  const B0=352,sc=1.0,xc=data.map((d,i)=>50+i*67);
  const G=H.g(s);H.E('line',{x1:20,y1:B0,x2:620,y2:B0,st:'stroke:var(--ink);stroke-width:2'},G);
  const bars=data.map(([g,v,r],i)=>{const C=CLS.find(q=>q.k===(g.includes('R')?'R':'r')+(g.includes('Y')?'Y':'y'));const b=at(G,xc[i],B0);
    H.E('rect',{x:-15,y:-1,width:30,height:1,st:`fill:${KC[C.k]};stroke:var(--ink);stroke-width:1.2`,cls:'nss'},b);H.T(b,{sy:.001},{d:0});return b});
  const lab=H.g(s);data.forEach(([g],i)=>rt(lab,xc[i],B0+18,g,'mt',{'text-anchor':'middle',st:'font-size:13px'}));H.O(lab,0,{d:0});
  const num=data.map(([g,v,r],i)=>{const t=H.txt(G,xc[i],B0-Math.max(v*sc,529/16*r*sc)-7,String(v),'lb',{'text-anchor':'middle',st:'font-size:13px'});H.O(t,0,{d:0});return t});
  const exp=H.g(s);data.forEach(([g,v,r],i)=>{const y=B0-529/16*r*sc;H.E('line',{x1:xc[i]-21,y1:y,x2:xc[i]+21,y2:y,st:'stroke:var(--ink);stroke-width:2;stroke-dasharray:4 3'},exp);
    H.txt(exp,xc[i],B0+40,String(r),'big',{'text-anchor':'middle',st:'font-size:20px;fill:var(--dad)'})});H.O(exp,0,{d:0});
  return [
    ()=>{drawA(ar)},
    ()=>{H.O(Pd,1)},
    ()=>{H.O(lab,1);bars.forEach((b,i)=>H.T(b,{sy:Math.max(.001,data[i][1]*sc)},{d:900,at:i*90}));num.forEach((t,i)=>H.O(t,1,{at:700+i*90}))},
    ()=>{H.O(exp,1)},
  ];}},

/* 16 ─────────────────────────────── */
{sec:'2.4',title:'When Does 9:3:3:1 Hold?',caption:'Each card = one condition of the 9:3:3:1 ratio',
text:`<p data-step="0">A dihybrid cross gives 9:3:3:1 only when three conditions are true.</p>
<p data-step="1"><b>1. Independent assortment.</b> The two genes are on different chromosomes, or far apart on one chromosome.</p>
<p data-step="2"><b>2. Complete dominance.</b> At each gene, the heterozygote has the same phenotype as the dominant homozygote. In gene terms: one working allele is enough.</p>
<p data-step="3"><b>3. Four clear phenotypes.</b> Each phenotype is easy to identify, and neither gene changes the effect of the other gene.</p>
<p data-step="4">When a cross gives a different ratio, at least one condition is false. So a changed ratio tells you something about the genes, for example that they are linked.</p>`,
star:'Independent + dominant + distinct = 9:3:3:1.',starStep:3,
scene(H){const s=stage();
  const RB=H.g(s);let acc=0;const bx=40,bw=560;[9,3,3,1].forEach((v,i)=>{const w=bw*v/16;H.E('rect',{x:bx+acc,y:30,width:w,height:30,st:`fill:${KC[CLS[i].k]};stroke:var(--ink);stroke-width:1.5`},RB);
    H.txt(RB,bx+acc+w/2,51,String(v),'lb',{'text-anchor':'middle',st:'font-size:16px'});acc+=w});
  const card=(y,title)=>{const G=H.g(s);H.E('rect',{x:20,y,width:600,height:84,rx:12,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},G);
    H.txt(G,300,y+48,title,'lb',{st:'font-size:16px'});const ck=at(G,592,y+42);H.E('circle',{r:14,st:'fill:var(--good)'},ck);H.E('path',{d:'M-6,0 L-1.5,5 L7,-5',st:'fill:none;stroke:var(--paper);stroke-width:3;stroke-linecap:round;stroke-linejoin:round'},ck);
    H.O(G,0,{d:0});return G};
  const c1=card(80,'Genes assort independently'),c2=card(176,'One working allele is enough'),c3=card(272,'Four phenotypes, easy to identify');
  ctd(c1,60,122,58,'dad',[['R',-12]],10);ctd(c1,82,122,58,'mom',[['r',-12]],10);ctd(c1,130,126,42,'dad',[['Y',-6]],10);ctd(c1,152,126,42,'mom',[['y',-6]],10);
  H.txt(c1,206,127,'R/r ; Y/y','mt',{'text-anchor':'middle',st:'font-size:17px'});
  [['RR',100,1],['Rr',50,1],['rr',0,0]].forEach(([g,pc,rd],i)=>{const x=58+i*80;H.txt(c2,x,200,g,'mt',{'text-anchor':'middle',st:'font-size:15px'});
    H.E('rect',{x:x-24,y:210,width:48,height:10,rx:2,st:'fill:none;stroke:var(--ink);stroke-width:1.2'},c2);if(pc)H.E('rect',{x:x-24,y:210,width:48*pc/100,height:10,rx:2,st:'fill:var(--good)'},c2);
    seed(c2,x,238,10,rd,1,i+4)});
  CLS.forEach((C,i)=>seed(c3,60+i*56,314,17,C.round,C.yellow,i+8));
  const bad=H.g(s);H.txt(bad,320,394,'A different ratio means a condition is false.','lb',{'text-anchor':'middle',st:'fill:var(--bad)'});H.O(bad,0,{d:0});
  return [
    ()=>{},
    ()=>{H.O(c1,1)},
    ()=>{H.O(c2,1)},
    ()=>{H.O(c3,1)},
    ()=>{H.O(bad,1)},
  ];}},

/* 17 ─────────────────────────────── */
{sec:'2.4',title:'Ratios That Break the Rule',caption:'Gene interaction: same 16 equal boxes, only the phenotypes change · linkage: the boxes are no longer equal, so only the bar shows the ratio',
text:`<p data-step="0"><b>Linkage.</b> Two genes close together on one chromosome make more parental gametes than recombinant gametes. The ratio moves away from 9:3:3:1 by an amount that depends on the RF.</p>
<p data-step="1"><b>Gene interaction.</b> Two genes can affect the same trait. Then some of the four classes look the same, and their boxes merge.</p>
<p data-step="2"><b>Complementary gene action.</b> A <b>pathway</b> is a series of chemical steps, each done by one enzyme. Two genes code for two enzymes in one pigment pathway. Pigment forms only with a working allele of both genes (<span class="m">A_B_</span>). Sweet-pea flowers give 9 purple : 7 white.</p>
<p data-step="3"><b>Duplicate gene action.</b> Two genes do the same job, so one working gene is enough. Only <span class="m">aabb</span> is different: 15:1.</p>`,
star:'Merged boxes, new ratio: 9:7 or 15:1.',starStep:3,
scene(H){return interScene(H,0);}},

/* 17b ─────────────────────────────── */
{sec:'2.4',title:'Epistasis: Labrador Coat Colour',caption:'E = the MC1R gene · B = the TYRP1 gene · box colours = coat colours of the dogs',
text:`<p data-step="0"><b>Epistasis</b> is a gene interaction in which one gene hides the effect of another gene. Coat colour in Labrador dogs is an example.</p>
<p data-step="1">Gene <span class="m">B</span> (TYRP1) codes for an enzyme that makes the dark hair pigment black. A dog with <span class="m">B_</span> makes black pigment. A <span class="m">bb</span> dog has a faulty enzyme, so its dark pigment is brown.</p>
<p data-step="2">Gene <span class="m">E</span> codes for <b>MC1R</b>, a <b>receptor</b>: a protein on the surface of a pigment cell that receives a signal. Working MC1R switches the cell to dark pigment. An <span class="m">ee</span> dog has no working MC1R, so it makes only yellow pigment in its hair, whatever its <span class="m">B</span> alleles.</p>
<p data-step="2">So <span class="m">EeBb</span> × <span class="m">EeBb</span> gives 9 black : 3 brown : 4 yellow.</p>`,
star:'ee hides gene B, so 9:3:3:1 becomes 9:3:4.',starStep:2,
scene(H){return interScene(H,1);}},

/* 18 ─────────────────────────────── */
{sec:'2.5',title:'The Dihybrid Test Cross',caption:'Black outline = gametes of the unknown plant · grey outline = gametes of the tester',
text:`<p data-step="0">A <b>test cross</b> crosses an individual of unknown genotype with a <b>tester</b>: an individual that is homozygous recessive for every gene in the test. For the two seed genes, the tester is <span class="m">rryy</span> (wrinkled, green).</p>
<p data-step="1">The tester makes only one gamete type, <span class="m">ry</span>. Recessive alleles never hide another allele.</p>
<p data-step="2">So each offspring shows exactly the alleles of the gamete from the unknown parent. An <span class="m">RrYy</span> plant makes <span class="m">RY</span>, <span class="m">Ry</span>, <span class="m">rY</span> and <span class="m">ry</span> gametes, ¼ each.</p>
<p data-step="3">The offspring are round yellow, round green, wrinkled yellow and wrinkled green in a 1:1:1:1 ratio. A test cross shows the four gamete types directly, and 1:1:1:1 is easier to check than 9:3:3:1.</p>`,
star:'The tester gives only recessive alleles, so the offspring show the unknown parent’s gametes.',starStep:3,
scene(H){const s=stage();
  const U=H.g(s);seed(U,60,52,20,1,1,3);H.txt(U,90,48,'RrYy','mt',{st:'font-size:18px'});H.txt(U,90,66,'dihybrid','lbs');H.O(U,0,{d:0});
  const T=H.g(s);seed(T,430,52,20,0,0,6);H.txt(T,460,48,'rryy','mt',{st:'font-size:18px'});H.txt(T,460,66,'tester','lbs');
  const X=H.txt(s,250,58,'×','lb',{'text-anchor':'middle',st:'font-size:22px'});H.O(X,0,{d:0});
  const tc=[0,1,2,3].map(i=>{const C=chip(s,410+i*48,108,'ry',{stroke:'muted',w:40});hide(C);return C});
  const one=H.txt(s,600,140,'all gametes alike','lbs',{'text-anchor':'end'});H.O(one,0,{d:0});
  const rows=[178,232,286,340],ug=['RY','Ry','rY','ry'];
  const uc=ug.map((g,i)=>{const C=chip(s,70,rows[i],g,{stroke:'ink',w:44});hide(C);return C});
  const plus=rows.map(y=>{const t=H.txt(s,112,y+6,'+','lb',{'text-anchor':'middle',st:'font-size:18px'});H.O(t,0,{d:0});return t});
  const fc=rows.map(y=>{const C=chip(s,434,108,'ry',{stroke:'muted',w:40});H.O(C,0,{d:0});C.y=y;return C});
  const geno=['RrYy','Rryy','rrYy','rryy'];
  const res=rows.map((y,i)=>{const G=H.g(s);fullA(G,182,y,212,y,{w:1.5,h:6});H.txt(G,226,y+6,geno[i],'mt',{st:'font-size:17px'});H.O(G,0,{d:0});return G});
  const ph=rows.map((y,i)=>{const G=H.g(s);const C=CLS[i];seed(G,318,y,15,C.round,C.yellow,i+2);H.txt(G,342,y+5,C.name,'lb',{st:'font-size:14px'});H.O(G,0,{d:0});return G});
  const bars=rows.map((y,i)=>{const b=at(s,500,y);H.E('rect',{x:0,y:-10,width:1,height:20,st:`fill:${KC[CLS[i].k]};stroke:var(--ink);stroke-width:1.2`,cls:'nss'},b);H.T(b,{sx:.001},{d:0});H.O(b,0,{d:0});return b});
  const q=rows.map(y=>{const t=H.txt(s,610,y+5,'¼','lb',{'text-anchor':'end',st:'font-size:16px'});H.O(t,0,{d:0});return t});
  const rat=H.txt(s,555,392,'1 : 1 : 1 : 1','big',{'text-anchor':'middle',st:'font-size:24px'});H.O(rat,0,{d:0});
  return [
    ()=>{},
    ()=>{tc.forEach((C,i)=>pop(C,{at:i*120}));H.after(900,()=>{tc.forEach((C,i)=>H.T(C,{x:434},{d:600}));H.after(650,()=>{tc.forEach((C,i)=>{if(i)H.O(C,0,{d:200})});H.O(one,1)})})},
    ()=>{H.O([U,X],1);uc.forEach((C,i)=>pop(C,{at:300+i*120}));H.O(plus,1,{at:800});
      fc.forEach((C,i)=>{H.O(C,1,{d:200,at:900+i*150});H.T(C,{x:150,y:C.y},{d:800,at:900+i*150})});res.forEach((G,i)=>H.O(G,1,{at:1700+i*150}))},
    ()=>{ph.forEach((G,i)=>H.O(G,1,{at:i*150}));bars.forEach((b,i)=>{H.O(b,1,{d:100,at:500+i*150});H.T(b,{sx:80},{d:800,at:500+i*150})});H.O(q,1,{at:1100});H.O(rat,1,{at:1400})},
  ];}},

/* 19 ─────────────────────────────── */
{sec:'2.5',title:'Reading an Unknown Genotype',caption:'Every row: unknown round, yellow plant × rryy tester · the tester gives ry to every offspring',
text:`<p data-step="0">A round, yellow plant can be <span class="m">RRYY</span>, <span class="m">RRYy</span>, <span class="m">RrYY</span> or <span class="m">RrYy</span>. A test cross with <span class="m">rryy</span> identifies the genotype.</p>
<p data-step="1"><span class="m">RRYY</span> makes only <span class="m">RY</span> gametes. All offspring are round and yellow.</p>
<p data-step="2"><span class="m">RRYy</span> makes <span class="m">RY</span> and <span class="m">Ry</span>. The offspring are 1 round yellow : 1 round green.</p>
<p data-step="3"><span class="m">RrYY</span> makes <span class="m">RY</span> and <span class="m">rY</span>. The offspring are 1 round yellow : 1 wrinkled yellow.</p>
<p data-step="4"><span class="m">RrYy</span> makes four gamete types, so the offspring are 1:1:1:1. A gene that gives two offspring phenotypes is heterozygous in the unknown parent.</p>`,
star:'Two offspring types for a gene = heterozygous for that gene.',starStep:4,
scene(H){const s=stage();
  const hd=H.g(s);[[60,'UNKNOWN'],[220,'ITS GAMETES'],[452,'OFFSPRING']].forEach(([x,t])=>H.txt(hd,x,30,t,'cap',{'text-anchor':'middle'}));
  const rows=[[78,'RRYY',['RY'],['RY'],'all','no gene'],[160,'RRYy',['RY','Ry'],['RY','Ry'],'1 : 1','Y gene'],[242,'RrYY',['RY','rY'],['RY','rY'],'1 : 1','R gene'],[324,'RrYy',['RY','Ry','rY','ry'],['RY','Ry','rY','ry'],'1 : 1 : 1 : 1','both genes']];
  H.txt(hd,622,30,'HETEROZYGOUS','cap',{'text-anchor':'end'});
  const G=rows.map(([y,g,gam,off,r,het],n)=>{const R=H.g(s);
    H.E('rect',{x:12,y:y-34,width:616,height:68,rx:10,st:'fill:var(--card);stroke:var(--faint);stroke-width:1.5'},R);
    seed(R,36,y,14,1,1,n+2);H.txt(R,58,y+6,g,'mt',{st:'font-size:17px'});
    gam.forEach((t,i)=>chip(R,160+i*44+(4-gam.length)*22,y,t,{stroke:'ink',w:40}));
    fullA(R,348,y,374,y,{w:1.5,h:6});
    off.forEach((k,i)=>{const C=CLS.find(q=>q.k===k);seed(R,400+i*38,y-6,13,C.round,C.yellow,i*5+n)});
    H.txt(R,400+((off.length-1)*38)/2,y+24,r,'lb',{'text-anchor':'middle',st:'font-size:13px'});H.txt(R,618,y+5,het,'lb',{'text-anchor':'end',st:`font-size:13px;fill:var(--${n?'dad':'muted'})`});
    H.O(R,0,{d:0});return R});
  return [()=>{},...G.map(R=>()=>H.O(R,1))];}},

/* 20 ─────────────────────────────── */
{sec:'2.6',title:'The Product Rule and the Sum Rule',caption:'F2 of RrYy × RrYy · column widths and row heights = probabilities',
text:`<p data-step="0">A <b>probability</b> is the chance that an event happens, from 0 (never) to 1 (always). A predicted ratio is a set of probabilities: 9:3:3:1 means 9/16, 3/16, 3/16 and 1/16.</p>
<p data-step="1"><b>Product rule.</b> For independent events, <span style="white-space:nowrap">P(A and B) = P(A) × P(B)</span>. The word “and” signals the product rule. Example: <span style="white-space:nowrap">P(<span class="m">rr</span> and <span class="m">yy</span>) = ¼ × ¼ = 1/16</span>.</p>
<p data-step="2"><b>Sum rule.</b> Two events are <b>mutually exclusive</b> when they cannot both happen. Then <span style="white-space:nowrap">P(A or B) = P(A) + P(B)</span>. The word “or” signals the sum rule.</p>
<p data-step="3">Example: a round seed is <span class="m">RR</span> or <span class="m">Rr</span>, never both. <span style="white-space:nowrap">P(round) = ¼ + ½ = ¾</span>.</p>
<p data-step="4">Many problems use both rules: <span style="white-space:nowrap">P(round and green) = ¾ × ¼ = 3/16</span>.</p>`,
star:'AND → multiply. OR → add.',starStep:4,
scene(H){const s=stage();
  // probability line
  const PL=H.g(s);const bx=40,bw=560;let acc=0;[9,3,3,1].forEach((v,i)=>{const w=bw*v/16;H.E('rect',{x:bx+acc,y:30,width:w,height:26,st:`fill:${KC[CLS[i].k]};stroke:var(--ink);stroke-width:1.5`},PL);
    H.txt(PL,bx+acc+w/2,48,v+'/16','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});acc+=w});
  H.txt(PL,bx,74,'0','lbs',{'text-anchor':'middle'});H.txt(PL,bx+bw,74,'1','lbs',{'text-anchor':'middle'});H.txt(PL,bx+bw/2,74,'all four classes together = 1','lbs',{'text-anchor':'middle'});
  // unit square
  const X0=96,Y0=120,U=200,cw=[50,100,50];const xs=[X0,X0+50,X0+150],ys=[Y0,Y0+50,Y0+150];
  const SQ=H.g(s);H.O(SQ,0,{d:0});
  const cells=[];for(let i=0;i<3;i++)for(let j=0;j<3;j++){const r=H.E('rect',{x:xs[j],y:ys[i],width:cw[j],height:cw[i],st:'fill:var(--card);stroke:var(--ink);stroke-width:1.3'},SQ);cells.push({r,i,j})}
  ['RR ¼','Rr ½','rr ¼'].forEach((t,j)=>H.txt(SQ,xs[j]+cw[j]/2,Y0-8,t,'mt',{'text-anchor':'middle',st:'font-size:14px'}));
  ['YY ¼','Yy ½','yy ¼'].forEach((t,i)=>H.txt(SQ,X0-8,ys[i]+cw[i]/2+5,t,'mt',{'text-anchor':'end',st:'font-size:14px'}));
  const cell=(i,j)=>cells.find(c=>c.i===i&&c.j===j).r;
  const e1=rt(s,330,150,'P(rr and yy) = ¼ × ¼ = 1/16','mt',{st:'font-size:18px'});H.O(e1,0,{d:0});
  // sum bar
  const SB=H.g(s);H.O(SB,0,{d:0});const sx=330,sw=280,sy=200;
  const segR=[['RR ¼',70],['Rr ½',140],['rr ¼',70]];let ax=sx;const sr=segR.map(([t,w])=>{const r=H.E('rect',{x:ax,y:sy,width:w,height:28,st:'fill:var(--card);stroke:var(--ink);stroke-width:1.5'},SB);
    const tt=H.txt(SB,ax+w/2,sy+19,t,'mt',{'text-anchor':'middle',st:'font-size:14px'});ax+=w;return {r,tt}});
  H.txt(SB,sx,sy-10,'seed shape gene: RR, Rr or rr','lbs');
  const brace=H.g(s);H.E('path',{d:`M${sx},${sy+36} L${sx},${sy+44} L${sx+210},${sy+44} L${sx+210},${sy+36}`,st:'fill:none;stroke:var(--ink);stroke-width:2'},brace);
  H.txt(brace,sx+105,sy+62,'¼ + ½ = ¾ round','mt',{'text-anchor':'middle',st:'font-size:17px'});H.O(brace,0,{d:0});
  const e3=rt(s,330,310,'P(round and green) = ¾ × ¼ = 3/16','mt',{st:'font-size:18px'});H.O(e3,0,{d:0});
  const note=H.txt(s,X0+U/2,Y0+U+26,'','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:600'});
  return [
    ()=>{},
    ()=>{H.O(SQ,1);[0,1,2].forEach(i=>fill(cell(i,2),'var(--wash)',{at:300}));[0,1,2].forEach(j=>fill(cell(2,j),'var(--wash)',{at:300}));fill(cell(2,2),'var(--hi)',{at:900});H.O(e1,1,{at:1000});note.textContent='rr column × yy row = 1/16 of the area'},
    ()=>{H.O(SB,1)},
    ()=>{sr.slice(0,2).forEach(o=>fill(o.r,KC.RY,{d:600}));H.O(brace,1,{at:400})},
    ()=>{cells.forEach(c=>fill(c.r,'var(--card)',{d:300}));[0,1].forEach(j=>fill(cell(2,j),KC.Ry,{at:400}));H.O(e3,1,{at:700});note.textContent='round columns × yy row = 3/16 of the area'},
  ];}},

/* 21 ─────────────────────────────── */
{sec:'2.6',title:'The Branch Diagram',caption:'Branch diagram for RrYy × RrYy · multiply along each path',
text:`<p data-step="0">A <b>branch diagram</b> (forked-line method) works on one gene at a time. For many genes, it is faster than a Punnett square.</p>
<p data-step="1">First fork: seed shape. In <span class="m">RrYy</span> × <span class="m">RrYy</span>, ¾ of the seeds are round and ¼ are wrinkled.</p>
<p data-step="2">Second fork: from each shape, seed colour: ¾ yellow and ¼ green.</p>
<p data-step="3">Multiply along each path (product rule): 9/16 round yellow, 3/16 round green, 3/16 wrinkled yellow, 1/16 wrinkled green.</p>
<p data-step="4">For genotypes, use three branches per gene: ¼ <span class="m">RR</span>, ½ <span class="m">Rr</span>, ¼ <span class="m">rr</span>. Two genes give 3 × 3 = 9 genotypes. For example, <span style="white-space:nowrap">P(<span class="m">RrYy</span>) = ½ × ½ = ¼</span>.</p>`,
star:'Fork per gene, multiply along the path.',starStep:3,
scene(H){const s=stage();
  const root=[30,206];const L1=[[132,116,'round','¾',1,1],[132,306,'wrinkled','¼',0,1]];
  const L2=[[0,270,64,'yellow','¾',1],[0,270,160,'green','¼',0],[1,270,258,'yellow','¾',1],[1,270,352,'green','¼',0]];
  const br=(a,b,f,o)=>{const G=H.g(s);const p=H.E('path',{d:`M${a[0]},${a[1]} C${(a[0]+b[0])/2},${a[1]} ${(a[0]+b[0])/2},${b[1]} ${b[0]},${b[1]}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:2'},G);
    const t=o==='end'?H.txt(G,b[0]-6,b[1]-9,f,'lb',{'text-anchor':'end',st:'font-size:15px;fill:var(--dad)'}):H.txt(G,(a[0]+b[0])/2+(o||0),(a[1]+b[1])/2+(b[1]<a[1]?-8:18),f,'lb',{'text-anchor':'middle',st:'font-size:16px;fill:var(--dad)'});H.O(t,0,{d:0});G.p=p;G.t=t;return G};
  H.E('circle',{cx:root[0],cy:root[1],r:6,cls:'kf'},s);
  const b1=L1.map(([x,y,n,f])=>br(root,[x-22,y],f,-10));
  const n1=L1.map(([x,y,n,f,rd])=>{const G=H.g(s);seed(G,x-8,y,12,rd,1,x+y);H.txt(G,x+8,y+5,n,'lb',{st:'font-size:14px'});H.O(G,0,{d:0});return G});
  const b2=L2.map(([k,x,y,n,f])=>br([L1[k][0]+(k?72:56),L1[k][1]],[x-6,y],f,'end'));
  const n2=L2.map(([k,x,y,n,f,yl])=>{const G=H.g(s);H.txt(G,x,y+5,n,'lb',{st:'font-size:14px'});H.O(G,0,{d:0});return G});
  const tips=L2.map(([k,x,y],i)=>{const G=H.g(s);const C=CLS[i];seed(G,x+62,y,12,C.round,C.yellow,i+7);H.txt(G,x+80,y+6,['¾ × ¾ = 9/16','¾ × ¼ = 3/16','¼ × ¾ = 3/16','¼ × ¼ = 1/16'][i],'mt',{st:'font-size:16px'});H.O(G,0,{d:0});return G});
  // genotype grid
  const gx=508,gy=150,c=42;const GG=H.g(s);H.txt(GG,gx+c*1.5,gy-46,'GENOTYPES','cap',{'text-anchor':'middle'});
  ['RR','Rr','rr'].forEach((t,j)=>{H.txt(GG,gx+c/2+j*c,gy-22,t,'mt',{'text-anchor':'middle',st:'font-size:14px'});H.txt(GG,gx+c/2+j*c,gy-8,['¼','½','¼'][j],'lbs',{'text-anchor':'middle'})});
  ['YY','Yy','yy'].forEach((t,i)=>{H.txt(GG,gx-8,gy+c/2+i*c,t,'mt',{'text-anchor':'end',st:'font-size:14px'});H.txt(GG,gx-8,gy+c/2+i*c+14,['¼','½','¼'][i],'lbs',{'text-anchor':'end'})});
  const w=[1,2,1];for(let i=0;i<3;i++)for(let j=0;j<3;j++){const hi=i===1&&j===1;H.E('rect',{x:gx+j*c,y:gy+i*c,width:c,height:c,st:`fill:${hi?'var(--hi)':'var(--card)'};stroke:var(--ink);stroke-width:1.3`},GG);
    H.txt(GG,gx+c/2+j*c,gy+c/2+i*c+5,(w[i]*w[j])+'/16','mt',{'text-anchor':'middle',st:'font-size:14px'+(hi?';fill:#16181d':'')})}
  H.txt(GG,gx+c*1.5,gy+3*c+24,'RrYy = 4/16 = ¼','mt',{'text-anchor':'middle',st:'font-size:16px'});H.txt(GG,gx+c*1.5,gy+3*c+44,'9 genotypes','lbs',{'text-anchor':'middle'});H.O(GG,0,{d:0});
  return [
    ()=>{},
    ()=>{b1.forEach((G,i)=>{H.D(G.p,1,{d:700,at:i*150});H.O(G.t,1,{at:500})});n1.forEach((G,i)=>H.O(G,1,{at:600+i*150}))},
    ()=>{b2.forEach((G,i)=>{H.D(G.p,1,{d:700,at:i*120});H.O(G.t,1,{at:500+i*120})});n2.forEach((G,i)=>H.O(G,1,{at:600+i*120}))},
    ()=>{tips.forEach((G,i)=>H.O(G,1,{at:i*250}))},
    ()=>{H.O(GG,1)},
  ];}},

/* 22 ─────────────────────────────── */
{sec:'2.6',title:'Three Genes and More',caption:'Mendel (1866), pp. 22–23: “3ⁿ … 4ⁿ … 2ⁿ” · public domain, via Wikimedia Commons · n = number of heterozygous genes',
text:`<p data-step="0">A <b>trihybrid</b> is heterozygous at three genes, for example <span class="m">RrYyCc</span>. In this example, gene <span class="m">C</span> gives purple flowers and <span class="m">cc</span> gives white. Each gene doubles the gamete types: 2 × 2 × 2 = 8.</p>
<p data-step="1">So a trihybrid Punnett square needs 8 × 8 = 64 boxes.</p>
<p data-step="2">A branch diagram is faster: <span style="white-space:nowrap">P(<span class="m">R_Y_C_</span>) = ¾ × ¾ × ¾ = 27/64</span>. The full phenotypic ratio is 27:9:9:9:3:3:3:1.</p>
<p data-step="3">For n heterozygous genes that assort independently: 2<sup>n</sup> gamete types, 3<sup>n</sup> genotypes, 2<sup>n</sup> phenotypes (with complete dominance) and 4<sup>n</sup> Punnett boxes. Mendel wrote the 3<sup>n</sup>, 4<sup>n</sup> and 2<sup>n</sup> counts in 1866.</p>
<p data-step="4">Example: <span class="m">RrYyCc</span> × <span class="m">rrYyCC</span>. P(<span class="m">Rr</span> and <span class="m">yy</span> and <span class="m">C_</span>) = <span style="white-space:nowrap">½ × ¼ × 1 = 1/8</span>.</p>`,
star:'Per gene: ×2 gametes, ×3 genotypes, ×4 boxes.',starStep:3,
scene(H){const s=stage();
  // gamete doubling
  const g8=[];['R','r'].forEach(a=>['Y','y'].forEach(b=>['C','c'].forEach(c=>g8.push(a+b+c))));
  const GX=572,gy=i=>40+i*27;
  const chips=g8.map((g,i)=>{const C=chip(s,GX,gy(i),g,{w:50,h:22,fs:15});hide(C);return C});
  const gcount=H.txt(s,GX,gy(7)+34,'','lb',{'text-anchor':'middle'});
  // grids
  const grid=(x,y,n,c)=>{const G=H.g(s);for(let i=0;i<n;i++)for(let j=0;j<n;j++){H.E('rect',{x:x+j*c,y:y+i*c,width:c,height:c,st:'fill:var(--card);stroke:var(--ink);stroke-width:1'},G)}H.O(G,0,{d:0});return G};
  const G1=grid(28,70,2,24),G2=grid(110,54,4,16),G3=grid(220,38,8,12);
  const gl=[[52,'n = 1','4 boxes'],[142,'n = 2','16 boxes'],[268,'n = 3','64 boxes']].map(([x,a,b])=>{const G=H.g(s);H.txt(G,x,156,a,'mt',{'text-anchor':'middle',st:'font-size:15px'});H.txt(G,x,174,b,'lbs',{'text-anchor':'middle'});H.O(G,0,{d:0});return G});
  const hi27=[];g8.forEach((a,i)=>g8.forEach((b,j)=>{const ok=[0,1,2].every(k=>a[k]===a[k].toUpperCase()||b[k]===b[k].toUpperCase());if(ok){const r=H.E('rect',{x:220+j*12,y:38+i*12,width:12,height:12,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1'},s);H.O(r,0,{d:0});hi27.push(r)}}));
  const t27=H.txt(s,360,96,'27/64','big',{st:'font-size:24px'});const t27b=H.txt(s,360,116,'R_Y_C_','mt',{st:'font-size:15px'});H.O([t27,t27b],0,{d:0});
  // table
  const TB=H.g(s);const cols=[200,250,300,350,412];const rows=[['heterozygous genes','1','2','3','n'],['gamete types','2','4','8','2^n'],['genotypes','3','9','27','3^n'],['phenotypes','2','4','8','2^n'],['Punnett boxes','4','16','64','4^n']];
  rows.forEach((r,i)=>{const y=212+i*24;r.forEach((v,j)=>{if(!j)H.txt(TB,24,y,v,i?'lb':'lbs',{st:i?'font-size:14px':'font-weight:700'});else rt(TB,cols[j-1],y,v,'mt',{'text-anchor':'middle',st:i?'font-size:16px':'font-size:15px;fill:var(--muted)'})});
    H.E('line',{x1:20,y1:y+8,x2:440,y2:y+8,st:`stroke:var(--${i?'faint':'ink'});stroke-width:${i?1:2}`},TB)});
  const k=420/845;H.E('image',{href:'@@asset:c2-mendel-1866-rule.jpg@@',x:20,y:336,width:420,height:150*k},TB);H.E('rect',{x:20,y:336,width:420,height:150*k,rx:3,st:'fill:none;stroke:var(--ink);stroke-width:1.2'},TB);
  H.O(TB,0,{d:0});
  const EX=H.g(s);H.txt(EX,470,286,'EXAMPLE','cap');const ex=[['Rr × rr','½ Rr'],['Yy × Yy','¼ yy'],['Cc × CC','1 C_']];ex.forEach(([a,b],i)=>{const y=310+i*24;H.txt(EX,470,y,a,'mt',{st:'font-size:15px'});H.txt(EX,628,y,b,'mt',{'text-anchor':'end',st:'font-size:15px'})});
  H.E('line',{x1:470,y1:376,x2:628,y2:376,st:'stroke:var(--ink);stroke-width:1.5'},EX);H.txt(EX,628,398,'½ × ¼ × 1 = 1/8','mt',{'text-anchor':'end',st:'font-size:17px'});H.O(EX,0,{d:0});
  return [
    ()=>{chips.forEach((C,i)=>pop(C,{at:i*90}));gcount.textContent='8 gamete types'},
    ()=>{[G1,G2,G3].forEach((G,i)=>H.O(G,1,{at:i*400}));gl.forEach((G,i)=>H.O(G,1,{at:200+i*400}))},
    ()=>{hi27.forEach((r,i)=>H.O(r,1,{d:150,at:i*30}));H.O([t27,t27b],1,{at:900})},
    ()=>{H.O(TB,1)},
    ()=>{H.O(EX,1)},
  ];}},

/* 23 ─────────────────────────────── */
{sec:'2.4',title:'Linkage Changes the F2 Ratio',caption:'A and B linked, RF = 20% · F2 classes in order A_B_ : A_bb : aaB_ : aabb, out of 16',
text:`<p data-step="0">Take genes <span class="m">A</span> and <span class="m">B</span> on one chromosome, with RF = 20%. The F1 of <span class="m">AABB</span> × <span class="m">aabb</span> is <span class="m">AB/ab</span>: <span class="m">A</span> and <span class="m">B</span> are on the same chromosome of the pair. This arrangement is <b>coupling</b>. Both F1 parents are <span class="m">AB/ab</span>, so each makes 40% <span class="m">AB</span>, 40% <span class="m">ab</span>, 10% <span class="m">Ab</span> and 10% <span class="m">aB</span> gametes.</p>
<p data-step="1">An <span class="m">aabb</span> offspring needs <span class="m">ab</span> from both parents: 0.4 × 0.4 = 0.16, or 2.56 out of 16 instead of 1.</p>
<p data-step="2">Each gamete still carries <span class="m">b</span> with a probability of ½, so <span class="m">bb</span> is still 4 out of 16. Every <span class="m">bb</span> seed is either <span class="m">A_bb</span> or <span class="m">aabb</span>, so <span class="m">A_bb</span> = 4 − 2.56 = 1.44. In the same way, <span class="m">aaB_</span> = 1.44, and <span class="m">A_B_</span> = 16 − 2.56 − 2.88 = 10.56.</p>
<p data-step="3">In <b>repulsion</b> (<span class="m">Ab/aB</span>), <span class="m">A</span> and <span class="m">B</span> are on different chromosomes of the pair. Now <span class="m">ab</span> is 10%: <span class="m">aabb</span> = 0.1 × 0.1 = 0.01, or 0.16 out of 16. The ratio is 8.16:3.84:3.84:0.16.</p>
<p data-step="4">Coupling raises the 9 and 1 classes. Repulsion lowers the 9 and 1 classes.</p>`,
star:'Coupling: more 9 and 1. Repulsion: more 3s.',starStep:4,
scene(H){const s=stage();
  const icon=(p,x,y,tb,to)=>{const G=H.g(p);[[y,'dad',tb],[y+24,'mom',to]].forEach(([yy,c,t])=>{H.E('line',{x1:x,y1:yy,x2:x+110,y2:yy,st:`stroke:${H.C(c)};stroke-width:11;stroke-linecap:round`},G);
    t.forEach((a,i)=>{const T=at(G,x+28+i*54,yy);H.E('rect',{x:-8,y:-8,width:16,height:16,rx:3,cls:'card',st:'stroke:var(--ink);stroke-width:1.3'},T);H.txt(T,0,4.5,a,'mt',{'text-anchor':'middle',st:'font-size:13px'})})});return G};
  const gbar=(p,x,y,vals)=>{const G=H.g(p);const W=250;let acc=0;['AB','Ab','aB','ab'].forEach((g,i)=>{const w=W*vals[i]/100;const par=vals[i]>=25;
    H.E('rect',{x:x+acc,y:y-14,width:w,height:28,st:`fill:${par?'var(--wash)':'var(--card)'};stroke:var(--ink);stroke-width:1.4`},G);
    H.txt(G,x+acc+w/2,y+32,g,'mt',{'text-anchor':'middle',st:'font-size:13px'});H.txt(G,x+acc+w/2,y+5,String(vals[i]),'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});acc+=w});return G};
  const C=H.g(s);H.txt(C,20,30,'COUPLING','cap',{st:'fill:var(--ink)'});H.txt(C,104,31,'AB/ab','mt',{st:'font-size:15px'});H.txt(C,295,30,'GAMETES (%)','cap',{'text-anchor':'middle'});icon(C,20,54,['A','B'],['a','b']);gbar(C,170,68,[40,10,10,40]);
  const Rp=H.g(s);H.txt(Rp,20,124,'REPULSION','cap',{st:'fill:var(--ink)'});H.txt(Rp,110,125,'Ab/aB','mt',{st:'font-size:15px'});icon(Rp,20,148,['A','b'],['a','B']);gbar(Rp,170,162,[10,40,40,10]);H.O(Rp,0,{d:0});
  const eq1=H.g(s);rt(eq1,450,30,'aabb = 0.4 × 0.4','mt',{st:'font-size:16px'});rt(eq1,450,52,'= 0.16 = 2.56/16','mt',{st:'font-size:16px'});H.O(eq1,0,{d:0});
  const eq2=H.g(s);rt(eq2,450,124,'aabb = 0.1 × 0.1','mt',{st:'font-size:16px'});rt(eq2,450,146,'= 0.01 = 0.16/16','mt',{st:'font-size:16px'});H.O(eq2,0,{d:0});
  // F2 bars
  const fills=CLS.map(c=>KC[c.k]);const bx=150,bw=470;
  const F=(y,lab,vals,txt)=>{const G=H.g(s);H.txt(G,bx-10,y+5,lab,'lb',{'text-anchor':'end',st:'font-size:13px'});let acc=0;vals.forEach((v,i)=>{const w=bw*v/16;
    H.E('rect',{x:bx+acc,y:y-14,width:Math.max(w,.5),height:28,st:`fill:${fills[i]};stroke:var(--ink);stroke-width:1.4`},G);
    if(w>24)H.txt(G,bx+acc+w/2,y+5,txt[i],'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});acc+=w});return G};
  const hd=H.g(s);H.txt(hd,bx,232,'F2 CLASSES','cap');['A_B_','A_bb','aaB_','aabb'].forEach((t,i)=>{H.E('rect',{x:300+i*82,y:222,width:12,height:12,st:`fill:${fills[i]};stroke:var(--ink);stroke-width:1`},hd);H.txt(hd,316+i*82,233,t,'mt',{st:'font-size:13px'})});
  F(268,'independent',[9,3,3,1],['9','3','3','1']);
  const fc=F(318,'coupling',[10.56,1.44,1.44,2.56],['10.56','1.44','1.44','2.56']);H.O(fc,0,{d:0});
  const fr=F(372,'repulsion',[8.16,3.84,3.84,.16],['8.16','3.84','3.84','']);H.O(fr,0,{d:0});
  const frn=H.txt(s,bx+bw+2,400,'0.16','lbs',{'text-anchor':'end',st:'fill:var(--ink)'});H.O(frn,0,{d:0});
  const upd=H.g(s);H.txt(upd,bx-10,336,'9 and 1 up','lbs',{'text-anchor':'end',st:'fill:var(--good);font-weight:700'});H.txt(upd,bx-10,390,'9 and 1 down','lbs',{'text-anchor':'end',st:'fill:var(--bad);font-weight:700'});H.O(upd,0,{d:0});
  const ab=H.E('rect',{x:bx+bw*13.44/16,y:304,width:bw*2.56/16,height:28,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--bad);stroke-width:3'},s);
  return [
    ()=>{},
    ()=>{H.O(eq1,1);H.O(fc,.25);},
    ()=>{H.O(fc,1);H.D(ab,1,{d:700})},
    ()=>{H.O(ab,0);H.O(Rp,1);H.O(eq2,1,{at:400});H.O(fr,1,{at:800});H.O(frn,1,{at:900})},
    ()=>{H.O(upd,1)},
  ];}},

/* 24 ─────────────────────────────── */
{sec:'2.5',title:'Linkage in a Test Cross',caption:'AB/ab × ab/ab · 100 offspring · shaded bars = parental classes · blue = chromosome from the father, orange = from the mother',
text:`<p data-step="0">In a test cross, each offspring shows the gamete from the dihybrid parent. So the offspring ratio equals the gamete ratio.</p>
<p data-step="1">With independent assortment, the ratio is 1:1:1:1: 25 of each class in 100 offspring.</p>
<p data-step="2">With coupling (<span class="m">AB/ab</span>) and RF = 20%, the offspring are 40 <span class="m">AaBb</span> : 10 <span class="m">Aabb</span> : 10 <span class="m">aaBb</span> : 40 <span class="m">aabb</span>, or 4:1:1:4. The two parental classes increase. The two recombinant classes decrease.</p>
<p data-step="3">So a test cross measures RF directly: RF = recombinant offspring ÷ all offspring = (10 + 10) ÷ 100 = 20%. Geneticists use RF values to put genes in order along a chromosome.</p>`,
star:'Test-cross ratio = gamete ratio.',starStep:3,
scene(H){const s=stage();
  const g=['AaBb','Aabb','aaBb','aabb'],par=[1,0,0,1],xs=[200,300,400,500],B0=330,sc=3.7;
  const bars=xs.map((x,i)=>{const b=at(s,x,B0);H.E('rect',{x:-30,y:-1,width:60,height:1,st:`fill:${par[i]?'var(--wash)':'var(--card)'};stroke:var(--ink);stroke-width:1.5`,cls:'nss'},b);H.T(b,{sy:.001},{d:0});return b});
  H.E('line',{x1:140,y1:B0,x2:560,y2:B0,st:'stroke:var(--ink);stroke-width:2'},s);
  xs.forEach((x,i)=>{H.txt(s,x,B0+22,g[i],'mt',{'text-anchor':'middle',st:'font-size:16px'});H.txt(s,x,B0+40,par[i]?'parental':'recombinant','lbs',{'text-anchor':'middle'})});
  const num=xs.map(x=>{const t=H.txt(s,x,B0-8,'','lb',{'text-anchor':'middle'});return t});
  const setN=(vals,o)=>vals.forEach((v,i)=>{H.T(bars[i],{sy:v*sc},o);const p={set textContent(q){num[i].textContent=Math.round(q);num[i].setAttribute('y',B0-8-q*sc)}};H.count(p,+num[i].textContent||0,v,{d:o.d})});
  const top=H.g(s);const icon=(x,tb,to)=>[[40,'dad',tb],[62,'mom',to]].forEach(([yy,c,t])=>{H.E('line',{x1:x,y1:yy,x2:x+100,y2:yy,st:`stroke:${H.C(c)};stroke-width:10;stroke-linecap:round`},top);
    t.forEach((a,i)=>{const T=at(top,x+26+i*48,yy);H.E('rect',{x:-8,y:-8,width:16,height:16,rx:3,cls:'card',st:'stroke:var(--ink);stroke-width:1.3'},T);H.txt(T,0,4.5,a,'mt',{'text-anchor':'middle',st:'font-size:13px'})})});
  icon(190,['A','B'],['a','b']);icon(410,['a','b'],['a','b']);
  H.txt(top,240,94,'AB/ab','mt',{'text-anchor':'middle',st:'font-size:18px'});H.txt(top,240,112,'dihybrid, coupling','lbs',{'text-anchor':'middle'});
  H.txt(top,350,58,'×','lb',{'text-anchor':'middle',st:'font-size:20px'});H.txt(top,460,94,'ab/ab','mt',{'text-anchor':'middle',st:'font-size:18px'});H.txt(top,460,112,'tester','lbs',{'text-anchor':'middle'});
  const lab=H.txt(s,350,146,'','lb',{'text-anchor':'middle',st:'font-size:15px'});
  const br=H.g(s);H.E('path',{d:`M270,${B0+52} L270,${B0+60} L430,${B0+60} L430,${B0+52}`,st:'fill:none;stroke:var(--bad);stroke-width:2'},br);
  H.txt(br,350,B0+80,'RF = (10 + 10) ÷ 100 = 20%','mt',{'text-anchor':'middle',st:'font-size:17px;fill:var(--bad)'});H.O(br,0,{d:0});
  return [
    ()=>{},
    ()=>{setN([25,25,25,25],{d:900});lab.textContent='independent: 1 : 1 : 1 : 1'},
    ()=>{setN([40,10,10,40],{d:1100});lab.textContent='linked, RF = 20%: 4 : 1 : 1 : 4'},
    ()=>{H.O(br,1)},
  ];}},

/* 25 ─────────────────────────────── */
{sec:'2.3–2.5',title:'Two Genes: What to Expect',wide:true,steps:3,
text:`<div class="tblwrap" data-step="0"><table class="tbl">
<thead><tr><th>Where the two genes are</th><th>Gametes (%)<br><span class="m" style="text-transform:none;letter-spacing:0">AB : Ab : aB : ab</span></th><th>F2, dihybrid × dihybrid (of 16)<br><span class="m" style="text-transform:none;letter-spacing:0">A_B_ : A_bb : aaB_ : aabb</span></th><th>Test cross × <span class="m" style="text-transform:none;letter-spacing:0">aabb</span><br><span class="m" style="text-transform:none;letter-spacing:0">AaBb : Aabb : aaBb : aabb</span></th></tr></thead>
<tbody>
<tr><td>Different chromosomes (<span class="m">A/a ; B/b</span>)</td><td>25&#8239;:&#8239;25&#8239;:&#8239;25&#8239;:&#8239;25</td><td>9&#8239;:&#8239;3&#8239;:&#8239;3&#8239;:&#8239;1</td><td>1&#8239;:&#8239;1&#8239;:&#8239;1&#8239;:&#8239;1</td></tr>
<tr><td>One chromosome, far apart (RF ≈ 50%)</td><td>almost 25 each</td><td>almost 9&#8239;:&#8239;3&#8239;:&#8239;3&#8239;:&#8239;1</td><td>almost 1&#8239;:&#8239;1&#8239;:&#8239;1&#8239;:&#8239;1</td></tr>
</tbody><tbody data-step="1">
<tr><td>One chromosome, coupling <span class="m">AB/ab</span>, RF = 20%</td><td>40&#8239;:&#8239;10&#8239;:&#8239;10&#8239;:&#8239;40</td><td>10.56&#8239;:&#8239;1.44&#8239;:&#8239;1.44&#8239;:&#8239;2.56</td><td>4&#8239;:&#8239;1&#8239;:&#8239;1&#8239;:&#8239;4</td></tr>
<tr><td>One chromosome, repulsion <span class="m">Ab/aB</span>, RF = 20%</td><td>10&#8239;:&#8239;40&#8239;:&#8239;40&#8239;:&#8239;10</td><td>8.16&#8239;:&#8239;3.84&#8239;:&#8239;3.84&#8239;:&#8239;0.16</td><td>1&#8239;:&#8239;4&#8239;:&#8239;4&#8239;:&#8239;1</td></tr>
</tbody><tbody data-step="2">
<tr><td>One chromosome, no crossover between them (RF = 0), <span class="m">AB/ab</span></td><td>50&#8239;:&#8239;0&#8239;:&#8239;0&#8239;:&#8239;50</td><td>12&#8239;:&#8239;0&#8239;:&#8239;0&#8239;:&#8239;4 (a 3&#8239;:&#8239;1 ratio)</td><td>1&#8239;:&#8239;0&#8239;:&#8239;0&#8239;:&#8239;1</td></tr>
</tbody></table></div>
<p class="note" data-step="2">In each row, the gametes add to 100% and the F2 classes add to 16. In every row, each gene alone still gives 3:1 in the F2 and 1:1 in the test cross.</p>`,
star:'Test-cross ratio = gamete ratio. Parental classes big = linkage.',starStep:2},

/* 26 ─────────────────────────────── */
{sec:'2.6',title:'Practice Problems',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">P1. In <span class="m">RrYy</span> × <span class="m">RrYy</span>, what fraction of the offspring is <span class="m">RrYY</span>?</div><button>Show answer</button><div class="a" hidden>Use one gene at a time. <span class="m">Rr</span> × <span class="m">Rr</span> gives <span class="m">Rr</span> with a probability of ½. <span class="m">Yy</span> × <span class="m">Yy</span> gives <span class="m">YY</span> with a probability of ¼. Product rule: ½ × ¼ = 1/8.</div></div>
<div class="qa"><div class="q">P2. In <span class="m">AaBbCc</span> × <span class="m">AaBbCc</span>, what fraction of the offspring is <span class="m">aabbcc</span>? What fraction shows all three dominant traits?</div><button>Show answer</button><div class="a" hidden><span class="m">aabbcc</span>: ¼ × ¼ × ¼ = 1/64. All three dominant (<span class="m">A_B_C_</span>): ¾ × ¾ × ¾ = 27/64.</div></div>
<div class="qa"><div class="q">P3. A round, yellow plant × <span class="m">rryy</span> gives 52 round, yellow and 48 wrinkled, yellow seeds. What is the genotype of the round, yellow plant?</div><button>Show answer</button><div class="a" hidden><span class="m">RrYY</span>. Seed shape gives two offspring phenotypes in about 1&#8239;:&#8239;1, so the plant is <span class="m">Rr</span>. All seeds are yellow, so the plant gave <span class="m">Y</span> to every offspring: it is <span class="m">YY</span>.</div></div>
<div class="qa"><div class="q">P4. How many gamete types can a plant with genotype <span class="m">AaBbCCDd</span> make, if the genes assort independently?</div><button>Show answer</button><div class="a" hidden>Count the heterozygous genes: <span class="m">Aa</span>, <span class="m">Bb</span> and <span class="m">Dd</span>, so n = 3. <span class="m">CC</span> always gives <span class="m">C</span>. The number of gamete types is 2<sup>3</sup> = 8.</div></div>
<div class="qa"><div class="q">P5. In <span class="m">RrYy</span> × <span class="m">RrYy</span>, what is the probability that a seed is round or green, or both?</div><button>Show answer</button><div class="a" hidden>The classes round yellow (9/16), round green (3/16) and wrinkled green (1/16) are mutually exclusive. Sum rule: 9/16 + 3/16 + 1/16 = 13/16. Check: only wrinkled yellow (3/16) is missing, and 1 − 3/16 = 13/16.</div></div>
<div class="qa"><div class="q">P6. Mendel counted 556 F2 seeds. How many wrinkled seeds does the 9:3:3:1 ratio predict? He counted 101 + 32. Is that close?</div><button>Show answer</button><div class="a" hidden>Wrinkled = 3/16 + 1/16 = 4/16 = ¼. ¼ × 556 = 139. Mendel counted 133, close to 139. The count fits a 3:1 ratio for seed shape alone.</div></div>
</div>`},

/* 27 ─────────────────────────────── */
{sec:'2.7',title:'Summary',wide:true,steps:2,
text:`<div class="cols"><div data-step="0"><h3>Mechanism</h3><ul>
<li>Genes on different chromosomes assort independently. Each homologous pair aligns in metaphase I with no effect on the other pairs.</li>
<li>A dihybrid makes four gamete types in equal numbers. With n heterozygous genes, there are 2<sup>n</sup> gamete types.</li>
<li>Genes on one chromosome travel together (linkage), unless crossing over separates them. Genes far apart on one chromosome assort almost independently.</li>
<li>In peas, <span class="m">R</span> codes for the starch-branching enzyme SBEI, and <span class="m">Y</span> (also written <span class="m">I</span>) codes for the stay-green protein SGR. One working allele of each gene is enough, so both are dominant.</li>
</ul></div><div data-step="1"><h3>Ratios</h3><ul>
<li>The expected phenotypic ratio of a dihybrid cross is 9:3:3:1. The genotypic ratio is 1:2:1:2:4:2:1:2:1.</li>
<li>The 9:3:3:1 ratio changes in three cases: dominance is not complete, the genes interact, or the genes are linked.</li>
<li>A test cross of a dihybrid gives 1:1:1:1 for genes that assort independently.</li>
<li>Product rule for “and”, sum rule for “or”. A branch diagram applies them one gene at a time.</li>
</ul></div></div>`,
star:'Independent pairs in meiosis give 4 gamete types, ¼ each, so 9:3:3:1 in the F2 and 1:1:1:1 in a test cross.',starStep:1},

/* 28 ─────────────────────────────── */
{sec:'2.8',title:'Key Terms',wide:true,steps:1,
text:`<div class="terms" data-step="0">
<div class="term"><b>Heritable traits</b>Features that parents pass to their offspring through their genes.</div>
<div class="term"><b>Blended inheritance</b>An old, wrong model: the traits of the parents mix and cannot separate again.</div>
<div class="term"><b>Particulate inheritance</b>Separate units (genes) control traits. The units pass to the offspring unchanged and do not mix.</div>
<div class="term"><b>Locus</b>The place on a chromosome where a gene is.</div>
<div class="term"><b>Dihybrid</b>An individual that is heterozygous at two genes, for example <span class="m">RrYy</span>.</div>
<div class="term"><b>Dihybrid cross</b>A cross between two dihybrids, for example <span class="m">RrYy</span> × <span class="m">RrYy</span>.</div>
<div class="term"><b>9:3:3:1</b>The phenotypic ratio of a dihybrid cross for two independent genes with complete dominance.</div>
<div class="term"><b>Independent assortment (IA)</b>The alleles of one gene go into the gametes without any effect on the alleles of another gene.</div>
<div class="term"><b>Mendel’s Second Law (Law of Independent Assortment)</b>Alleles of different genes segregate independently during gamete formation.</div>
<div class="term"><b>Crossing over</b>An exchange of DNA segments between non-sister chromatids in prophase I.</div>
<div class="term"><b>Linkage</b>Alleles of genes close together on one chromosome tend to go into the same gamete.</div>
<div class="term"><b>Parental and recombinant</b>A parental gamete keeps a parent’s allele combination. A recombinant gamete has a new combination.</div>
<div class="term"><b>Recombination frequency (RF)</b>The fraction of gametes that are recombinant. RF is at most about 50%.</div>
<div class="term"><b>Coupling and repulsion</b>Coupling: <span class="m">AB/ab</span>, both dominant alleles on one chromosome of the pair. Repulsion: <span class="m">Ab/aB</span>.</div>
<div class="term"><b>Test cross</b>A cross of an unknown individual with a tester that is homozygous recessive for every gene in the test.</div>
<div class="term"><b>Product rule</b>For independent events, P(A and B) = P(A) × P(B).</div>
<div class="term"><b>Sum rule</b>For mutually exclusive events, P(A or B) = P(A) + P(B).</div>
<div class="term"><b>Branch diagram</b>The forked-line method: one fork per gene, multiply along each path.</div>
<div class="term"><b>Epistasis</b>One gene hides the effect of another gene, for example 9:3:4.</div>
<div class="term"><b>Complementary and duplicate gene action</b>Complementary: both genes must work (9:7). Duplicate: either gene is enough (15:1).</div>
</div>`},

/* 29 ─────────────────────────────── */
{sec:'2.9–2.10',title:'Check Your Understanding: 1 and 2',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">1. A round, yellow plant of unknown genotype is test-crossed with <span class="m">rryy</span>. Draw the Punnett squares for the unknown genotypes <span class="m">RrYY</span> and <span class="m">RrYy</span>. Give the offspring ratios.</div><button>Show answer</button><div class="a" hidden>
<p><span class="m">RrYY</span> makes <span class="m">RY</span> and <span class="m">rY</span> gametes, ½ each. The tester gives <span class="m">ry</span>.</p>
<table class="tbl"><tr><th></th><th style="text-transform:none;letter-spacing:0"><span class="m">RY</span></th><th style="text-transform:none;letter-spacing:0"><span class="m">rY</span></th></tr><tr><td><span class="m">ry</span></td><td><span class="m">RrYy</span> round, yellow</td><td><span class="m">rrYy</span> wrinkled, yellow</td></tr></table>
<p>Ratio: 1 round, yellow : 1 wrinkled, yellow.</p>
<p><span class="m">RrYy</span> makes <span class="m">RY</span>, <span class="m">Ry</span>, <span class="m">rY</span> and <span class="m">ry</span>, ¼ each.</p>
<table class="tbl"><tr><th></th><th style="text-transform:none;letter-spacing:0"><span class="m">RY</span></th><th style="text-transform:none;letter-spacing:0"><span class="m">Ry</span></th><th style="text-transform:none;letter-spacing:0"><span class="m">rY</span></th><th style="text-transform:none;letter-spacing:0"><span class="m">ry</span></th></tr><tr><td><span class="m">ry</span></td><td><span class="m">RrYy</span> round, yellow</td><td><span class="m">Rryy</span> round, green</td><td><span class="m">rrYy</span> wrinkled, yellow</td><td><span class="m">rryy</span> wrinkled, green</td></tr></table>
<p>Ratio: 1&#8239;:&#8239;1&#8239;:&#8239;1&#8239;:&#8239;1. A full 4 × 4 square repeats this row four times.</p></div></div>
<div class="qa"><div class="q">2. Every gamete of the tester <span class="m">rryy</span> is <span class="m">ry</span>. In a test-cross Punnett square, must you write the tester gamete four times? Redraw the square for <span class="m">RRYy</span> × <span class="m">rryy</span> in its simplest form.</div><button>Show answer</button><div class="a" hidden>
<p>No. Identical gametes give identical rows, so one row is enough, and the ratio stays the same. The full square is also correct, only longer.</p>
<p><span class="m">RRYy</span> makes <span class="m">RY</span> and <span class="m">Ry</span>, ½ each:</p>
<table class="tbl"><tr><th></th><th style="text-transform:none;letter-spacing:0"><span class="m">RY</span></th><th style="text-transform:none;letter-spacing:0"><span class="m">Ry</span></th></tr><tr><td><span class="m">ry</span></td><td><span class="m">RrYy</span> round, yellow</td><td><span class="m">Rryy</span> round, green</td></tr></table>
<p>Ratio: 1 round, yellow : 1 round, green.</p></div></div>
</div>`},

/* 30 ─────────────────────────────── */
{sec:'2.9–2.10',title:'Check Your Understanding: 3 and 4',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">3. <span class="m">AABB</span> × <span class="m">aabb</span> gives <span class="m">AaBb</span> F1 plants. With independent assortment, F1 × F1 gives 9:3:3:1 (<span class="m">A</span> and <span class="m">B</span> dominant). Now suppose <span class="m">A</span> and <span class="m">B</span> are linked with RF = 20%, so <span class="m">AB</span> and <span class="m">ab</span> are the common gametes. How does the ratio change? What if <span class="m">Ab</span> and <span class="m">aB</span> are the common gametes?</div><button>Show answer</button><div class="a" hidden>
<p><b>Coupling</b> (<span class="m">AB/ab</span>): gametes 40% <span class="m">AB</span>, 10% <span class="m">Ab</span>, 10% <span class="m">aB</span>, 40% <span class="m">ab</span>. <span class="m">aabb</span> = 0.4 × 0.4 = 0.16 = 2.56/16. <span class="m">bb</span> is still ¼ = 4/16, so <span class="m">A_bb</span> = 4 − 2.56 = 1.44. In the same way, <span class="m">aaB_</span> = 1.44. <span class="m">A_B_</span> = 16 − 2.56 − 1.44 − 1.44 = 10.56.</p>
<p>Ratio 10.56&#8239;:&#8239;1.44&#8239;:&#8239;1.44&#8239;:&#8239;2.56. The 9 and the 1 increase; the 3s decrease.</p>
<p><b>Repulsion</b> (<span class="m">Ab/aB</span>, for example from <span class="m">AAbb</span> × <span class="m">aaBB</span>): gametes 10% <span class="m">AB</span>, 40% <span class="m">Ab</span>, 40% <span class="m">aB</span>, 10% <span class="m">ab</span>. <span class="m">aabb</span> = 0.1 × 0.1 = 0.01 = 0.16/16. <span class="m">A_bb</span> = 4 − 0.16 = 3.84, <span class="m">aaB_</span> = 3.84, <span class="m">A_B_</span> = 16 − 0.16 − 7.68 = 8.16.</p>
<p>Ratio 8.16&#8239;:&#8239;3.84&#8239;:&#8239;3.84&#8239;:&#8239;0.16. The 9 and the 1 decrease; the 3s increase.</p></div></div>
<div class="qa"><div class="q">4. Do the same first cross as in question 3, but test-cross the F1 with <span class="m">aabb</span>. Independent assortment gives 1:1:1:1. How does linkage change this ratio?</div><button>Show answer</button><div class="a" hidden>
<p>The offspring ratio equals the gamete ratio of the F1. With RF = 20% in coupling: 40 <span class="m">AaBb</span> : 10 <span class="m">Aabb</span> : 10 <span class="m">aaBb</span> : 40 <span class="m">aabb</span>, or 4:1:1:4.</p>
<p>The two parental classes (<span class="m">AaBb</span>, <span class="m">aabb</span>) rise above 25%. The two recombinant classes (<span class="m">Aabb</span>, <span class="m">aaBb</span>) fall below 25%. The closer the genes, the smaller the RF and the larger this difference.</p></div></div>
</div>`},

]});
})();
