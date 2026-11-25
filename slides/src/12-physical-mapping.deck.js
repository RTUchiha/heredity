/* Chapter 12 · Physical Mapping of Chromosomes and Genomes · source: Hairdity.pdf ch. 12 (Singh, Introduction to Genetics, CC BY-NC-SA 4.0)
   Data: chromosome 7 and 1 bands = GRCh38 (Ensembl); chromosome 7 cM = HapMap-based sex-averaged map lifted to GRCh38 (SHAPEIT4 genetic_maps.b38);
   CFTR/MET coordinates = Ensembl canonical transcripts (GRCh38 and GRCh37). */
(function(){
const H0=window.HL;
/* ---- deck-local helpers ---- */
function drawA(a,o){H0.D(a.firstChild,1,Object.assign({d:600},o));H0.O(a.lastChild,1,Object.assign({d:200},o,{at:((o&&o.at)||0)+450}));}
function mkA(p,x1,y1,x2,y2,o){const a=H0.arrow(p,x1,y1,x2,y2,o);H0.O(a.lastChild,0,{d:0});return a;}
function pop(e,o){H0.T(e,{s:1},Object.assign({d:700},o));H0.O(e,1,Object.assign({d:300},o));}
function hide(e){H0.T(e,{s:.001},{d:0});H0.O(e,0,{d:0});}
const stage=()=>document.getElementById('stage');
const MONO='font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-weight:700';
const HALO=';paint-order:stroke;stroke:var(--card);stroke-width:4px;stroke-linejoin:round';
let UID=0;
function R(p,x,y,w,h,st,a){return H0.E('rect',Object.assign({x,y,width:w,height:h,st},a||{}),p);}
function Ln(p,x1,y1,x2,y2,st,a){return H0.E('line',Object.assign({x1,y1,x2,y2,st},a||{}),p);}
// line that draws on; a dashed line (own dasharray) cannot draw on, so it fades in instead (use show())
function DL(p,x1,y1,x2,y2,st){if(/dasharray/.test(st)){const e=H0.E('path',{d:`M${x1},${y1} L${x2},${y2}`,st:'fill:none;'+st},p);e.dz=1;e.style.opacity=0;return e}
  return H0.E('path',{d:`M${x1},${y1} L${x2},${y2}`,pathLength:1,cls:'draw',st:'fill:none;'+st},p);}
function show(e,o){if(Array.isArray(e)||e instanceof NodeList){[...e].forEach(x=>show(x,o));return}if(e.dz)H0.O(e,1,Object.assign({d:600},o));else H0.D(e,1,o);}
function hid(e){H0.O(e,0,{d:0});return e;}
// rounded photo (or crop of a photo) with border. crop=[sx,sy,sw,sh] in image pixels, iw/ih = full image size
function photo(p,href,x,y,w,h,o){o=o||{};const G=H0.g(p);const id='ph'+(++UID);
  const cp=H0.E('clipPath',{id},G);H0.E('rect',{x,y,width:w,height:h,rx:o.r!=null?o.r:8},cp);
  if(o.bg)R(G,x,y,w,h,`fill:${o.bg}`,{rx:o.r!=null?o.r:8});
  if(o.crop){const [sx,sy,sw,sh]=o.crop;const cg=H0.g(G,{'clip-path':`url(#${id})`});const sv=H0.E('svg',{x,y,width:w,height:h,viewBox:`${sx} ${sy} ${sw} ${sh}`,preserveAspectRatio:'xMidYMid meet'},cg);
    H0.E('image',{href,x:0,y:0,width:o.iw,height:o.ih},sv);}
  else H0.E('image',{href,x,y,width:w,height:h,preserveAspectRatio:o.fit||'xMidYMid meet','clip-path':`url(#${id})`},G);
  if(o.border!==false)R(G,x,y,w,h,'fill:none;stroke:var(--ink);stroke-width:1.5',{rx:o.r!=null?o.r:8});return G;}
// chip: rounded label box centred at x
function chip(p,x,y,t,o){o=o||{};const G=H0.g(p);const fs=o.fs||12;const w=o.w||(t.length*fs*.6+18);
  R(G,x-w/2,y-fs,w,fs*1.9,`fill:${o.fill||'var(--card)'};stroke:${o.stroke||'var(--ink)'};stroke-width:1.5`,{rx:fs*.95});
  H0.txt(G,x,y+fs*.35,t,'lbs',{'text-anchor':'middle',st:`font-size:${fs}px;font-weight:700;fill:${o.ink||'var(--ink)'}`});return G;}

/* ---- real data ---- */
// [band, start Mb, end Mb, stain] stain: 0 gneg, 25..100 gpos, -1 acen, -2 gvar
const B7=[['p22.3',0,2.8,0],['p22.2',2.8,4.5,25],['p22.1',4.5,7.2,0],['p21.3',7.2,13.7,100],['p21.2',13.7,16.5,0],['p21.1',16.5,20.9,100],['p15.3',20.9,25.5,0],['p15.2',25.5,27.9,50],['p15.1',27.9,28.8,0],['p14.3',28.8,34.9,75],['p14.2',34.9,37.1,0],['p14.1',37.1,43.3,75],['p13',43.3,45.4,0],['p12.3',45.4,49,75],['p12.2',49,50.5,0],['p12.1',50.5,53.9,75],['p11.2',53.9,58.1,0],['p11.1',58.1,60.1,-1],['q11.1',60.1,62.1,-1],['q11.21',62.1,67.5,0],['q11.22',67.5,72.7,50],['q11.23',72.7,77.9,0],['q21.11',77.9,86.7,100],['q21.12',86.7,88.5,0],['q21.13',88.5,91.5,75],['q21.2',91.5,93.3,0],['q21.3',93.3,98.4,75],['q22.1',98.4,104.2,0],['q22.2',104.2,104.9,50],['q22.3',104.9,107.8,0],['q31.1',107.8,115,75],['q31.2',115,117.7,0],['q31.31',117.7,121.4,75],['q31.32',121.4,124.1,0],['q31.33',124.1,127.5,75],['q32.1',127.5,129.6,0],['q32.2',129.6,130.8,25],['q32.3',130.8,132.9,0],['q33',132.9,138.5,50],['q34',138.5,143.4,0],['q35',143.4,148.2,75],['q36.1',148.2,152.8,0],['q36.2',152.8,155.2,25],['q36.3',155.2,159.346,0]];
const B1=(`p36.33,0,2.3,0;p36.32,2.3,5.3,25;p36.31,5.3,7.1,0;p36.23,7.1,9.1,25;p36.22,9.1,12.5,0;p36.21,12.5,15.9,50;p36.13,15.9,20.1,0;p36.12,20.1,23.6,25;p36.11,23.6,27.6,0;p35.3,27.6,29.9,25;p35.2,29.9,32.3,0;p35.1,32.3,34.3,25;p34.3,34.3,39.6,0;p34.2,39.6,43.7,25;p34.1,43.7,46.3,0;p33,46.3,50.2,75;p32.3,50.2,55.6,0;p32.2,55.6,58.5,50;p32.1,58.5,60.8,0;p31.3,60.8,68.5,50;p31.2,68.5,69.3,0;p31.1,69.3,84.4,100;p22.3,84.4,87.9,0;p22.2,87.9,91.5,75;p22.1,91.5,94.3,0;p21.3,94.3,99.3,75;p21.2,99.3,101.8,0;p21.1,101.8,106.7,100;p13.3,106.7,111.2,0;p13.2,111.2,115.5,50;p13.1,115.5,117.2,0;p12,117.2,120.4,50;p11.2,120.4,121.7,0;p11.1,121.7,123.4,-1;q11,123.4,125.1,-1;q12,125.1,143.2,-2;q21.1,143.2,147.5,0;q21.2,147.5,150.6,50;q21.3,150.6,155.1,0;q22,155.1,156.6,50;q23.1,156.6,159.1,0;q23.2,159.1,160.5,50;q23.3,160.5,165.5,0;q24.1,165.5,167.2,50;q24.2,167.2,170.9,0;q24.3,170.9,173,75;q25.1,173,176.1,0;q25.2,176.1,180.3,50;q25.3,180.3,185.8,0;q31.1,185.8,190.8,100;q31.2,190.8,193.8,0;q31.3,193.8,198.7,100;q32.1,198.7,207.1,0;q32.2,207.1,211.3,25;q32.3,211.3,214.4,0;q41,214.4,223.9,100;q42.11,223.9,224.4,0;q42.12,224.4,226.8,25;q42.13,226.8,230.5,0;q42.2,230.5,234.6,50;q42.3,234.6,236.4,0;q43,236.4,243.5,75;q44,243.5,248.956,0`).split(';').map(r=>{const a=r.split(',');return [a[0],+a[1],+a[2],+a[3]]});
const L7=159.346,L1=248.956,G7=187.2;
// cM at each whole Mb of chromosome 7 (0..159), then the end
const CM7=[0.0,1.8,3.4,5.2,6.5,9.0,11.2,12.6,14.9,18.0,20.0,20.7,22.4,23.8,25.6,27.8,29.3,31.0,32.3,33.7,35.4,37.1,38.8,40.6,41.4,42.6,44.4,45.3,46.2,48.5,50.0,51.8,53.4,54.6,55.7,56.8,57.5,59.4,61.1,62.7,63.2,64.4,66.0,67.0,68.1,69.0,70.2,71.3,73.1,73.6,74.7,75.8,76.8,77.6,78.3,79.0,80.1,80.5,80.9,80.9,80.9,80.9,80.9,80.9,81.2,81.4,81.5,81.6,82.2,83.6,84.3,85.2,86.8,87.2,88.1,89.3,91.3,91.8,92.6,94.9,95.9,97.6,98.8,100.2,101.2,101.6,102.4,102.6,103.0,103.8,104.7,105.0,106.3,107.0,108.4,109.2,110.2,111.2,112.3,113.6,114.1,114.5,115.5,116.1,117.2,117.9,119.4,121.6,122.6,123.6,124.3,125.3,125.9,126.8,127.6,128.1,129.0,129.6,130.2,130.6,130.8,131.2,132.1,132.7,133.0,133.4,134.0,134.4,134.9,136.0,136.8,138.2,140.4,141.7,141.9,142.8,143.8,145.1,146.4,148.9,151.0,152.2,153.4,154.5,155.4,156.5,157.3,158.3,159.7,162.0,163.4,165.3,168.7,170.7,173.6,177.1,181.3,183.3,185.6,186.7,187.2];
// gene: [name, start Mb (GRCh38), cM]
const GN={TWIST1:[19.02,33.7],HOXA1:[27.09,45.4],EGFR:[55.02,79.0],ELN:[74.03,88.1],MET:[116.67,129.3],CFTR:[117.48,130.0],LEP:[128.24,135.1],KEL:[142.94,154.4],SHH:[155.80,180.1]};
// CFTR exons, kb from the gene start (canonical transcript, 27 exons, 188,641 bp)
const EX=[[0,.12],[24.2,24.34],[29,29.12],[50.9,51.09],[54.3,54.34],[55.2,55.39],[56.5,56.65],[60.1,60.32],[62,62.08],[68.6,68.8],[79.4,79.63],[107.7,107.81],[110.3,110.41],[111.9,112.63],[114.9,115.03],[122.8,122.84],[123.5,123.76],[126.6,126.73],[130.5,130.64],[131.6,131.78],[134.6,134.69],[147.5,147.75],[162.4,162.57],[172.8,172.91],[184.7,184.84],[185.4,185.54],[186.9,188.64]];
const KARYO='@@asset:c12-karyotype.jpg@@';

/* ---- chromosome drawing ---- */
// a stained chromosome looks dark-on-light in both themes, like the micrographs
const CHR_BG='#fbfbfc',CHR_INK='#1b1e24';
const bandSt=s=>s>0?`fill:${CHR_INK};fill-opacity:${(s/100*.9).toFixed(2)}`:s===-1?'fill:#8a909c;fill-opacity:.7':s===-2?'fill:#8a909c':`fill:${CHR_INK};fill-opacity:0`;
// outline of a chromosome along axis u (a..e) with a pinch at the centromere (c0..c1, narrowest at cm)
function shapeD(a,e,c0,cm,c1,c,h,vert){const r=h/2,pw=h*.2,t=c-r,b=c+r;const P=(u,v)=>vert?`${v},${u}`:`${u},${v}`;const sw=vert?0:1;
  if(c0==null)return `M${P(a+r,t)} L${P(e-r,t)} A${r},${r} 0 0 ${sw} ${P(e-r,b)} L${P(a+r,b)} A${r},${r} 0 0 ${sw} ${P(a+r,t)} Z`;
  const ta=Math.max(a+r,Math.min(c0,a+r)),te=Math.min(e-r,Math.max(c1,e-r));
  return `M${P(ta,t)} L${P(c0,t)} L${P(cm,c-pw)} L${P(c1,t)} L${P(te,t)} A${r},${r} 0 0 ${sw} ${P(te,b)} L${P(c1,b)} L${P(cm,c+pw)} L${P(c0,b)} L${P(ta,b)} A${r},${r} 0 0 ${sw} ${P(ta,t)} Z`;}
// banded ideogram from real band data. o: {a, len, c, h, vert, drawn}
function ideo(p,bands,L,o){const H=H0;const G=H.g(p);const u=mb=>o.a+o.len*mb/L;
  const ac=bands.filter(b=>b[3]===-1);const c0=u(ac[0][1]),cm=u(ac[0][2]),c1=u(ac[ac.length-1][2]);
  const d=shapeD(u(0),u(L),c0,cm,c1,o.c,o.h,o.vert);const id='id'+(++UID);
  const cp=H.E('clipPath',{id},G);H.E('path',{d},cp);
  G.bg=H.E('path',{d,st:`fill:${CHR_BG}`},G);G.BG=H.g(G,{'clip-path':`url(#${id})`});
  G.bands=bands.map(b=>{const s=b[3];const st=bandSt(s);
    const A=u(b[1]),B=u(b[2]);const r=o.vert?R(G.BG,o.c-o.h/2,A,o.h,B-A,st):R(G.BG,A,o.c-o.h/2,B-A,o.h,st);r.b=b;return r});
  G.outline=H.E('path',{d,pathLength:1,cls:o.drawn?'':'draw',st:'fill:none;stroke:var(--ink);stroke-width:1.6'},G);
  G.u=u;G.band=n=>bands.find(b=>b[0]===n);return G;}
// horizontal ruler with tick labels underneath
function ruler(p,o){const H=H0;const G=H.g(p);const X=v=>o.a+(o.b-o.a)*(v-(o.min||0))/(o.max-(o.min||0));
  G.line=H.E('path',{d:`M${o.a},${o.y} L${o.b},${o.y}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:2'},G);
  G.ticks=H.g(G);(o.ticks||[]).forEach(t=>{Ln(G.ticks,X(t),o.y-5,X(t),o.y+5,'stroke:var(--ink);stroke-width:1.5');
    H.txt(G.ticks,X(t),o.y+19,(o.fmt||String)(t),'lbs',{'text-anchor':'middle',st:'font-size:11px'})});
  G.X=X;return G;}

/* chromosome parts + replication (two slides share one drawing) */
function chromScene(H,mode){const s=stage();const Y=118,h=40,a=40,e=600,cm=300;
  const d=shapeD(a,e,cm-14,cm,cm+14,Y,h,false);const id='ch'+(++UID);const cp=H.E('clipPath',{id},s);H.E('path',{d},cp);
  H.E('path',{d,st:'fill:var(--cellfill)'},s);const inner=H.g(s,{'clip-path':`url(#${id})`});
  const genes=H.g(inner);[[78,4],[120,6],[168,3],[208,7],[252,3],[350,5],[392,8],[452,4],[505,6],[548,3]].forEach(([x,n])=>{for(let i=0;i<n;i++)R(genes,x+i*5,Y-h/2,2.5,h,'fill:var(--dad)')});hid(genes);
  const tel=H.g(inner);R(tel,a,Y-h/2,24,h,'fill:var(--muted)');R(tel,e-24,Y-h/2,24,h,'fill:var(--muted)');hid(tel);
  const cen=H.g(inner);R(cen,cm-14,Y-h/2,28,h,'fill:var(--hi)');hid(cen);
  const ol=H.E('path',{d,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:2'},s);
  const gl=H.g(s);H.txt(gl,150,Y-34,'genes','lb',{'text-anchor':'middle'});Ln(gl,150,Y-28,150,Y-22,'stroke:var(--ink);stroke-width:1.5');H.txt(gl,470,Y-34,'genes','lb',{'text-anchor':'middle'});Ln(gl,470,Y-28,470,Y-22,'stroke:var(--ink);stroke-width:1.5');hid(gl);
  // centromere detail
  const cd=H.g(s);[-1,1].forEach(sg=>{R(cd,cm-7,Y+sg*(h*.2)-(sg<0?8:0),14,8,'fill:var(--mom);stroke:var(--ink);stroke-width:1.2',{rx:2})});
  [-18,0,18].forEach(dx=>Ln(cd,cm+dx*1.6,32,cm,Y-14,'stroke:var(--ink);stroke-width:1.3;opacity:.7'));
  H.E('ellipse',{cx:cm,cy:Y,rx:20,ry:9,st:'fill:none;stroke:var(--good);stroke-width:3'},cd);
  H.txt(cd,cm+46,40,'microtubules','lbs');H.txt(cd,cm,Y+44,'centromere','lb',{'text-anchor':'middle'});
  H.txt(cd,cm,Y+80,'cohesin ring (green) · kinetochore (orange)','lbs',{'text-anchor':'middle',st:'font-size:11px'});hid(cd);
  const td=H.g(s);H.txt(td,a,Y+44,'telomere','lb');H.txt(td,e,Y+44,'telomere','lb',{'text-anchor':'end'});
  H.txt(td,a,Y+62,'TTAGGG TTAGGG TTAGGG…','lbs',{st:MONO+';font-size:11px;fill:var(--muted)'});hid(td);
  // replication panel
  const RY=330,rx0=40,rx1=600,ori=[95,205,300,425,530];
  const rp=H.g(s);H.txt(rp,rx0,268,'ZOOM: ONE STRETCH OF DNA','cap');const oriG=H.g(rp);
  ori.forEach(x=>{Ln(oriG,x,RY+16,x,RY+24,'stroke:var(--ink);stroke-width:2');H.txt(oriG,x,RY+40,'origin','lbs',{'text-anchor':'middle',st:'font-size:11px'})});hid(oriG);
  const top=H.E('path',{st:'fill:none;stroke:var(--ink);stroke-width:2.4;stroke-linecap:round'},rp),bot=H.E('path',{st:'fill:none;stroke:var(--ink);stroke-width:2.4;stroke-linecap:round'},rp);
  const newS=[H.E('path',{st:'fill:none;stroke:var(--mom);stroke-width:2.4'},rp),H.E('path',{st:'fill:none;stroke:var(--mom);stroke-width:2.4'},rp)];
  const forks=H.g(rp);const msg=H.txt(rp,320,392,'','lb',{'text-anchor':'middle'});hid(rp);
  function render(r){const iv=[];ori.forEach(o=>{const A=Math.max(rx0,o-r),B=Math.min(rx1,o+r);if(r>0.5)iv.push([A,B])});iv.sort((p,q)=>p[0]-q[0]);
    const m=[];iv.forEach(v=>{if(m.length&&v[0]<=m[m.length-1][1])m[m.length-1][1]=Math.max(m[m.length-1][1],v[1]);else m.push(v.slice())});
    const path=(sg,off)=>{let dd=`M${rx0},${m.length&&m[0][0]<=rx0?RY+sg*off:RY}`;m.forEach(([A,B])=>{const q=Math.min(10,(B-A)/2);
        if(A>rx0)dd+=` L${A},${RY} Q${A+q},${RY+sg*off} ${A+2*q},${RY+sg*off}`;dd+=` L${B<rx1?B-2*q:B},${RY+sg*off}`;if(B<rx1)dd+=` Q${B-q},${RY+sg*off} ${B},${RY}`});
      const last=m.length&&m[m.length-1][1]>=rx1;if(!last)dd+=` L${rx1},${RY}`;return dd};
    top.setAttribute('d',path(-1,11));bot.setAttribute('d',path(1,11));
    const inner=(sg)=>m.map(([A,B])=>{const q=Math.min(10,(B-A)/2);return `M${A+2*q-(A<=rx0?2*q:0)},${RY+sg*4} L${B<rx1?B-2*q:B},${RY+sg*4}`}).join(' ');
    newS[0].setAttribute('d',inner(-1));newS[1].setAttribute('d',inner(1));
    forks.innerHTML='';m.forEach(([A,B])=>{[A,B].forEach(x=>{if(x>rx0&&x<rx1)H.E('circle',{cx:x,cy:RY,r:4.5,st:'fill:var(--mom);stroke:var(--card);stroke-width:1.5'},forks)})});}
  let rr=0;const pr={set textContent(v){rr=v;render(v)}};render(0);
  if(mode==='A'){
    const xc=H.g(s);const X=H.chromosome(xc,{L1:40,L2:40,w:13,color:'dad',state:'x',x:150,y:318});
    H.E('ellipse',{cx:150,cy:318,rx:22,ry:9,st:'fill:none;stroke:var(--good);stroke-width:3'},xc);
    H.txt(xc,196,296,'after S phase: two identical','lb',{st:'font-size:12.5px'});H.txt(xc,196,312,'sister chromatids','lb',{st:'font-size:12.5px'});
    H.txt(xc,196,334,'cohesin (green) holds them together','lbs',{st:'font-size:11.5px'});H.txt(xc,196,350,'until anaphase','lbs',{st:'font-size:11.5px'});hid(xc);
    return [
      ()=>{H.D(ol,1,{d:1200});H.O(genes,1,{at:700});H.O(gl,1,{at:900})},
      ()=>{H.O(cen,1);H.O(cd,1,{at:300});H.O(xc,1,{at:700})},
      ()=>{H.O(tel,1);H.O(td,1,{at:300})},
    ];}
  ol.style.strokeDashoffset=0;[genes,gl,cen,tel].forEach(g=>g.style.opacity=1);
  return [
    ()=>{H.O(rp,1);H.O(oriG,1,{at:200});msg.textContent='S phase starts: one DNA molecule'},
    ()=>{H.count(pr,rr,32,{d:1500,at:200,fmt:v=>v});msg.textContent='forks move away from each origin'},
    ()=>{H.count(pr,rr,120,{d:2200,fmt:v=>v});H.after(2100,()=>{msg.textContent='all forks met: two complete DNA molecules'})},
  ];}

deck({
docTitle:'Physical Mapping · Heredity Ch.12',
title:'Physical Mapping of Chromosomes and Genomes',
chapter:12,
eyebrow:'Heredity · Chapter 12 · Physical Mapping',
slides:[

/* 1 ─────────────────────────────── */
{sec:'12.1',title:'Every Gene Has an Address',caption:'Human chromosome 7 · bands, exons and sequence from GRCh38, the 2013 human reference sequence',
text:`<p data-step="0">Each gene sits at one fixed place on one chromosome, its address. A <b>map</b> of a chromosome shows the addresses of its genes. A chromosome has a short arm (<b>p</b>) and a long arm (<b>q</b>).</p>
<p data-step="1">For example, the gene <b>CFTR</b> sits on human chromosome 7. A person with two broken copies of CFTR has <b>cystic fibrosis</b>. In this disease, thick mucus blocks the lungs and gut. CFTR has 27 <b>exons</b>, the parts of a gene that stay in its mRNA. They span 188,641 <b>base pairs (bp)</b>. A base pair is one rung of the DNA ladder: A–T or G–C.</p>
<p data-step="2">The most detailed address is the DNA sequence of the gene: every base pair, in order.</p>
<p data-step="3">Geneticists give an address in three ways. A genetic map uses <b>crossovers</b>: exchanges of DNA between the two copies of a chromosome when sperm and egg cells form. Genetic distances are in centimorgans (cM). A cytogenetic map uses stained bands. A physical map uses base pairs.</p>
<p data-step="3" class="note">Maps help find genes for cystic fibrosis, for ankylosing spondylitis (a disease of the spine joints) and for common conditions such as heart disease and diabetes. Doctors use gene maps to diagnose, monitor and treat genetic diseases.</p>`,
star:'A map gives every gene an address.',starStep:3,
scene(H){const s=stage();
  H.txt(s,40,48,'HUMAN CHROMOSOME 7','cap');
  const C=ideo(s,B7,L7,{a:40,len:560,c:86,h:28});H.O(C.BG,0,{d:0});
  const pq=[H.txt(s,C.u(30),124,'p (short arm)','lbs',{'text-anchor':'middle'}),H.txt(s,C.u(84),124,'q (long arm)','lbs',{'text-anchor':'middle'})];hid(pq[0]);hid(pq[1]);
  const x0=C.u(115),x1=C.u(117.7);
  const hl=H.g(s);R(hl,x0-3,68,x1-x0+6,36,'fill:none;stroke:var(--hi);stroke-width:3.5',{rx:3});H.txt(hl,(x0+x1)/2,62,'7q31.2','lb',{'text-anchor':'middle'});hid(hl);
  const w1=[DL(s,x0,106,60,196,'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4'),DL(s,x1,106,580,196,'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4')];
  const gx=kb=>70+500*kb/188.64;
  const gene=H.g(s);Ln(gene,62,215,588,215,'stroke:var(--ink);stroke-width:2');
  const exs=EX.map(([a,b],i)=>R(gene,gx(a),203,Math.max(2.5,gx(b)-gx(a)),24,`fill:${i===10?'var(--mom)':'var(--dad)'}`));
  H.E('path',{d:'M580,209 L590,215 L580,221',st:'fill:none;stroke:var(--ink);stroke-width:2'},gene);
  H.txt(gene,62,248,'CFTR gene · 27 exons (coloured blocks)','lb',{st:'font-size:13px'});H.txt(gene,588,248,'188,641 bp','lbs',{'text-anchor':'end'});hid(gene);
  const ex11=gx(79.5);
  const w2=[DL(s,ex11-2,229,96,290,'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4'),DL(s,ex11+2,229,544,290,'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4')];
  const sq=H.g(s);const cod=['AAT','ATC','ATC','TTT','GGT','GTT','TCC','TAT'],aa=['Asn','Ile','Ile','Phe','Gly','Val','Ser','Tyr'];
  cod.forEach((c,i)=>{const x=104+i*56;H.txt(sq,x+19,314,c,'lb',{'text-anchor':'middle',st:MONO+';font-size:17px'+(i===3?';fill:var(--mom)':'')});
    H.txt(sq,x+19,334,aa[i],'lbs',{'text-anchor':'middle'})});H.txt(sq,104+3*56+19,350,'amino acid 508','lbs',{'text-anchor':'middle',st:'font-size:10.5px'});hid(sq);
  const tags=H.g(s);chip(tags,118,392,'genetic map: ≈ 130 cM',{fs:12,w:184});chip(tags,320,392,'cytogenetic map: 7q31.2',{fs:12,w:184});chip(tags,522,392,'physical map: bp 117,480,025',{fs:12,w:196});hid(tags);
  return [
    ()=>{H.D(C.outline,1,{d:1200});H.O(C.BG,1,{d:900,at:600});H.O(pq,1,{at:1000})},
    ()=>{H.O(hl,1);show(w1,{d:800,at:300});H.O(gene,1,{at:900});exs.forEach((e,i)=>{e.style.opacity=0;H.O(e,1,{d:200,at:1000+i*40})})},
    ()=>{show(w2,{d:700});H.O(sq,1,{at:600,d:700})},
    ()=>{H.O(tags,1,{d:700})},
  ];}},

/* 2 ─────────────────────────────── */
{sec:'12.1',title:'Three Maps of One Chromosome',caption:'Human chromosome 7 · cM: HapMap project genetic map, average of male and female · bands and Mb: GRCh38 (2013 human reference sequence)',
text:`<p data-step="0">A <b>genetic map</b> orders genes by how often crossovers separate them. Its unit is the <b>centimorgan (cM)</b>.</p>
<p data-step="1">A <b>cytogenetic map</b> shows the dark and light bands of a stained chromosome under a microscope.</p>
<p data-step="2">A <b>physical map</b> gives positions in base pairs (bp) along the DNA molecule. 1 Mb (megabase) is one million base pairs.</p>
<p data-step="3">All three maps put the genes in the same order, but the spacing differs. The <b>centromere</b> (the narrow point that joins the two arms) holds about 4 Mb of DNA. The region has almost no crossovers, so it is almost 0 cM long. The tip of the long arm has many crossovers, so it is long on the genetic map.</p>
<p data-step="4">The most detailed form of a physical map is the sequence itself. Chromosome 7 has 159,345,973 bp.</p>`,
star:'Same order, different spacing.',starStep:3,
scene(H){const s=stage();const X0=110,LEN=490;const gx=c=>X0+LEN*c/G7,px=m=>X0+LEN*m/L7;
  const names=['TWIST1','HOXA1','EGFR','ELN','CFTR','KEL','SHH'];
  const lab=(y,t,sub)=>{const G=H.g(s);H.txt(G,14,y,t,'lb');H.txt(G,14,y+16,sub,'lbs');hid(G);return G};
  // genetic
  const gL=lab(86,'Genetic','cM');const gR=ruler(s,{a:X0,b:X0+LEN,y:88,max:G7,ticks:[0,50,100,150],fmt:v=>v});hid(gR.ticks);
  const gT=H.g(s);names.forEach((n,i)=>{const x=gx(GN[n][1]);Ln(gT,x,80,x,96,'stroke:var(--mom);stroke-width:3');H.txt(gT,x,i%2?50:66,n,'lbs',{'text-anchor':'middle',st:'font-weight:700;fill:var(--ink);font-size:11.5px'})});hid(gT);
  // cytogenetic
  const cL=lab(200,'Cytogenetic','bands');const C=ideo(s,B7,L7,{a:X0,len:LEN,c:205,h:26});H.O(C.BG,0,{d:0});
  const lk1=names.map(n=>DL(s,gx(GN[n][1]),97,px(GN[n][0]),190,'stroke:var(--mom);stroke-width:1.3'));
  // physical
  const pL=lab(316,'Physical','Mb');const pR=ruler(s,{a:X0,b:X0+LEN,y:318,max:L7,ticks:[0,25,50,75,100,125,150],fmt:v=>v});hid(pR.ticks);
  const lk2=names.map(n=>DL(s,px(GN[n][0]),220,px(GN[n][0]),312,'stroke:var(--mom);stroke-width:1.3'));
  // mismatch highlights
  const mm=H.g(s);H.E('path',{d:`M${gx(80.85)},92 L${gx(80.95)},92 L${px(62.1)},192 L${px(58.1)},192 Z`,st:'fill:var(--hi);fill-opacity:.55;stroke:var(--ink);stroke-width:1'},mm);
  H.E('path',{d:`M${gx(163.4)},92 L${gx(G7)},92 L${px(L7)},192 L${px(150)},192 Z`,st:'fill:var(--hi);fill-opacity:.55;stroke:var(--ink);stroke-width:1'},mm);
  H.txt(mm,gx(80.9)-14,140,'centromere: 4 Mb, ≈ 0 cM','lb',{'text-anchor':'end',st:'font-size:12.5px'+HALO});
  H.txt(mm,gx(163.4)-8,140,'tip: 9 Mb, 24 cM','lb',{'text-anchor':'end',st:'font-size:12.5px'+HALO});hid(mm);
  // sequence
  const sL=lab(392,'Sequence','bp');const sq=H.g(s);
  const w=[DL(s,px(117.48),326,X0+60,376,'stroke:var(--muted);stroke-width:1.1;stroke-dasharray:4 4'),DL(s,px(117.48),326,X0+LEN-40,376,'stroke:var(--muted);stroke-width:1.1;stroke-dasharray:4 4')];
  H.txt(sq,X0+LEN/2+10,399,'…ATCATCTTTGGTGTTTCCTATGAT…','lb',{'text-anchor':'middle',st:MONO+';font-size:16px;letter-spacing:1.5px'});hid(sq);
  return [
    ()=>{H.O(gL,1);H.D(gR.line,1,{d:900});H.O(gR.ticks,1,{at:500});H.O(gT,1,{at:700})},
    ()=>{H.O(cL,1);H.D(C.outline,1,{d:1000});H.O(C.BG,1,{at:500});H.D(lk1,1,{d:900,at:900})},
    ()=>{H.O(pL,1);H.D(pR.line,1,{d:900});H.O(pR.ticks,1,{at:500});H.D(lk2,1,{d:700,at:700})},
    ()=>{H.O(mm,1,{d:800})},
    ()=>{H.O(sL,1);show(w,{d:700});H.O(sq,1,{at:600})},
  ];}},

/* 3 ─────────────────────────────── */
{sec:'12.1',title:'What a Working Chromosome Needs',caption:'Not to scale · blue stripes = genes',
text:`<p data-step="0">Each chromosome is one long double-stranded DNA molecule that carries <b>genes</b>. Many genes code for proteins: the cell copies the gene into <b>mRNA</b> (messenger RNA) and <b>translates</b> the mRNA into protein. Other genes code for RNA that the cell does not translate, such as <b>tRNA</b> and <b>rRNA</b>, which help the cell make proteins.</p>
<p data-step="0" class="note">Chromosome 1, the largest human chromosome, has about 249 million base pairs and about 2,000 protein-coding genes.</p>
<p data-step="1"><b>Centromere.</b> Proteins bind here. In <b>S phase</b> the cell copies its DNA, so each chromosome becomes two identical <b>sister chromatids</b>. <b>Cohesin</b> proteins hold the sisters together until <b>anaphase</b>, the stage when they separate. In <b>mitosis</b> (cell division), <b>kinetochore</b> proteins attach the chromosome to <b>microtubules</b>, protein fibres that pull the chromatids apart.</p>
<p data-step="2"><b>Telomeres.</b> The two ends are a short sequence repeated many times (TTAGGG in humans). The enzyme <b>telomerase</b> adds new repeats to the ends. Centromeres and telomeres contain no genes.</p>`,
star:'Genes, one centromere, two telomeres.',starStep:2,
scene(H){return chromScene(H,'A')}},

/* 3b ─────────────────────────────── */
{sec:'12.1',title:'Copying a Chromosome from Many Origins',caption:'Not to scale · lower panel: a short stretch of the DNA during S phase · orange = new DNA strands',
text:`<p data-step="0">In S phase, DNA copying starts at many <b>origins of replication</b> along each chromosome. Origins are the fourth feature that every working chromosome needs.</p>
<p data-step="1">At each origin the two DNA strands separate. Two <b>replication forks</b>, the Y-shaped places where copying happens, leave the origin and move in opposite directions.</p>
<p data-step="2">Forks from nearby origins meet. When all the forks meet, the cell has two complete copies of the chromosome DNA.</p>`,
star:'Many origins, two forks each, until all forks meet.',starStep:2,
scene(H){return chromScene(H,'B')}},

/* 4 ─────────────────────────────── */
{sec:'12.3',title:'Where the Centromere Sits',caption:'Replicated chromosomes, two sister chromatids each · lengths not to scale',
text:`<p data-step="0">Every human chromosome has one centromere, but not always in the middle. The centromere divides the chromosome into two arms. The short arm is <b>p</b> (French <i>petit</i>, small). The long arm is <b>q</b>, the next letter.</p>
<p data-step="1"><b>Metacentric:</b> the centromere is in the middle, so the two arms are about equal. Example: human chromosome 1.</p>
<p data-step="2"><b>Submetacentric:</b> the centromere is a little off the middle. Example: human chromosome 5.</p>
<p data-step="3"><b>Acrocentric:</b> the centromere is near one end, so the p arm is short. Example: human chromosome 21.</p>
<p data-step="4"><b>Telocentric:</b> the centromere is at one end. Humans have no telocentric chromosomes, but mice do. In a <b>holocentric</b> chromosome, the whole length acts as a centromere, as in the worm <i>C. elegans</i>.</p>`,
star:'Meta = middle · sub = a little off · acro = near the end · telo = at the end.',starStep:4,
scene(H){const s=stage();const xs=[70,190,310,430,550],T0=62,B0=300,LEN=B0-T0;
  const F=[.5,.3,.13,0,0],NM=[['metacentric','chromosome 1'],['submetacentric','chromosome 5'],['acrocentric','chromosome 21'],['telocentric','mouse chromosomes'],['holocentric','the worm C. elegans']];
  function mk(i){const G=H.g(s);const rs=[0,1,2,3].map(()=>R(G,0,0,15,10,'fill:var(--dad-tint);stroke:var(--dad);stroke-width:2.5',{rx:7.5}));
    const strip=[-1,1].map(sg=>Ln(G,sg*18,T0+4,sg*18,B0-4,'stroke:var(--hi);stroke-width:5;stroke-linecap:round'));
    const dot=H.E('circle',{r:6.5,cls:'kf'},G);const pL=H.txt(G,-34,0,'p','mt',{'text-anchor':'middle',st:'font-size:17px'}),qL=H.txt(G,-34,0,'q','mt',{'text-anchor':'middle',st:'font-size:17px'});
    const lb=H.g(s);H.txt(lb,xs[i],336,NM[i][0],'lb',{'text-anchor':'middle',st:'font-size:13.5px'});H.txt(lb,xs[i],354,NM[i][1],'lbs',{'text-anchor':'middle',st:'font-size:11.5px'+(i===4?';font-style:italic':'')});hid(lb);
    G.set=(f,holo)=>{const c=T0+LEN*f;const g=4;[-1,1].forEach((sg,k)=>{const x=sg<0?-17:2;const top=rs[k*2],bo=rs[k*2+1];
        const ph=holo?0:Math.max(0,c-g-T0);top.setAttribute('x',x);top.setAttribute('y',T0);top.setAttribute('height',Math.max(.01,ph));top.style.opacity=ph<3?0:1;
        const qs=holo?T0:Math.max(T0,c+g);bo.setAttribute('x',x);bo.setAttribute('y',qs);bo.setAttribute('height',B0-qs)});
      dot.setAttribute('cx',0);dot.setAttribute('cy',Math.max(T0+3,c));dot.style.opacity=holo?0:1;strip.forEach(l=>l.style.opacity=holo?1:0);
      pL.setAttribute('y',(T0+c)/2+6);qL.setAttribute('y',(c+B0)/2+6);pL.style.opacity=(c-T0)>30&&!holo?1:0;qL.style.opacity=holo?0:1;};
    G.set(F[i],false);H.T(G,{x:xs[i]},{d:0});G.lb=lb;return G}
  const C=xs.map((x,i)=>mk(i));C.slice(1).forEach(hid);hid(C[0].lb);
  const go=(i)=>{const G=C[i];let f=F[i-1];G.set(f,false);H.T(G,{x:xs[i-1]},{d:0});H.O(G,1,{d:300});H.T(G,{x:xs[i]},{d:1200,at:200});
    const p={set textContent(v){G.set(v,false)}};H.count(p,F[i-1],F[i],{d:1200,at:200,fmt:v=>v});H.O(G.lb,1,{at:1200});};
  return [
    ()=>{H.O(C[0],1)},
    ()=>{H.O(C[0].lb,1)},
    ()=>go(1),
    ()=>go(2),
    ()=>{go(3);H.after(1500,()=>{const G=C[4];G.set(0,false);H.T(G,{x:xs[3]},{d:0});H.O(G,1,{d:300});H.T(G,{x:xs[4]},{d:1100});H.after(1000,()=>{G.set(0,true);H.O(G.lb,1)})})},
  ];}},

/* 5 ─────────────────────────────── */
{sec:'12.2',title:'One Gene, How Many Copies?',caption:'Blue = from dad, orange = from mom · yellow band = the gene · one cell in G1, the phase before S phase',
text:`<p data-step="0">The number of copies of a gene in a cell depends on the chromosome that carries the gene. Different versions of one gene are <b>alleles</b>.</p>
<p data-step="1"><b>LCT</b> (chromosome 2) makes lactase, the enzyme that digests milk sugar. Chromosome 2 is an <b>autosome</b> (not a sex chromosome), so everyone has two copies of LCT: one maternal and one paternal.</p>
<p data-step="2">After S phase the cell has four copies of LCT. The sister chromatids are identical, so the cell still has only two alleles.</p>
<p data-step="3"><b>F8</b> (X chromosome) makes clotting factor VIII. Females (XX) have two copies; males (XY) have one. <b>SRY</b> (Y chromosome) makes the gonads (the organs that make <b>gametes</b>: sperm or eggs) become testes. Males have one copy; females have none.</p>
<p data-step="4"><b>MT-CO1</b> is on the small circular DNA of the <b>mitochondria</b>, the energy-making parts of the cell. A cell holds hundreds to thousands of copies of this DNA. A child inherits all of them from the mother. They are usually identical, so a person usually has one MT-CO1 allele.</p>`,
star:'For a gene in the nucleus, count the chromosomes that carry it: that is the copy number.',starStep:4,
scene(H){const s=stage();const FX=318,MX=498;
  const hd=H.g(s);H.txt(hd,FX+30,26,'FEMALE · XX','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});H.txt(hd,MX+30,26,'MALE · XY','cap',{'text-anchor':'middle',st:'fill:var(--ink)'});
  [FX,MX].forEach(x=>{H.txt(hd,x-4,46,'copies','lbs',{'text-anchor':'middle',st:'font-size:11px'});H.txt(hd,x+72,46,'alleles','lbs',{'text-anchor':'middle',st:'font-size:11px'})});Ln(hd,14,54,626,54,'stroke:var(--faint);stroke-width:1.5');
  const bar=(p,x,y,len,col,mk)=>{const G=H.g(p);R(G,x-7,y-len/2,14,len,`fill:var(--${col})`,{rx:7});R(G,x-9,y-len/2+len*mk-4,18,8,'fill:var(--hi);stroke:var(--ink);stroke-width:1.2',{rx:2});return G};
  const row=(y,name,sub)=>{const G=H.g(s);H.txt(G,16,y-2,name,'lb');H.txt(G,16,y+15,sub,'lbs',{st:'font-size:11.5px'});Ln(G,14,y+42,626,y+42,'stroke:var(--faint);stroke-width:1');hid(G);return G};
  const num=(p,x,y,v)=>H.txt(p,x,y+9,v,'big',{'text-anchor':'middle',st:'font-size:26px'});
  // rows
  const r1=row(98,'LCT','chromosome 2 · autosome');const c1=H.g(s);const orig=[[FX-22,'dad'],[FX+14,'mom'],[MX-22,'dad'],[MX+14,'mom']].map(([x,c])=>bar(c1,x,98,74,c,.3));
  num(c1,FX+72,98,'2');num(c1,MX+72,98,'2');hid(c1);
  const sis=H.g(s);const tw=[[FX-22,'dad'],[FX+14,'mom'],[MX-22,'dad'],[MX+14,'mom']].map(([x,c])=>{const b=bar(sis,x,98,74,c,.3);return b});hid(sis);
  const sl=H.g(s);H.txt(sl,(FX+MX)/2-18,158,'after S phase: 4 copies, still 2 alleles','lb',{'text-anchor':'middle',st:'font-size:12.5px'+HALO});hid(sl);
  const r2=row(196,'F8','X chromosome');const c2=H.g(s);bar(c2,FX-22,196,64,'dad',.75);bar(c2,FX+14,196,64,'mom',.75);bar(c2,MX-4,196,64,'mom',.75);num(c2,FX+72,196,'2');num(c2,MX+72,196,'1');hid(c2);
  const r3=row(280,'SRY','Y chromosome');const c3=H.g(s);H.txt(c3,FX-4,286,'none','lbs',{'text-anchor':'middle'});bar(c3,MX-4,280,30,'dad',.25);num(c3,FX+72,280,'0');num(c3,MX+72,280,'1');hid(c3);
  const r4=row(358,'MT-CO1','mitochondrial DNA');const c4=H.g(s);[FX-4,MX-4].forEach(x=>{[[-20,-10],[0,-14],[20,-10],[-11,8],[11,8]].forEach(([dx,dy])=>{H.E('circle',{cx:x+dx,cy:358+dy,r:7,st:'fill:none;stroke:var(--mom);stroke-width:3'},c4);
    H.E('path',{d:H.arcD(x+dx,358+dy,7,-35,35),st:'fill:none;stroke:var(--hi);stroke-width:4.5'},c4)});H.txt(c4,x,388,'many identical copies','lbs',{'text-anchor':'middle',st:'font-size:10.5px'})});num(c4,FX+72,358,'1');num(c4,MX+72,358,'1');hid(c4);
  return [
    ()=>{},
    ()=>{H.O(r1,1);H.O(c1,1,{at:200})},
    ()=>{H.O(sis,1);tw.forEach((b,i)=>{H.T(b,{x:0},{d:0});H.T(b,{x:7},{d:900,at:200})});orig.forEach(b=>H.T(b,{x:-7},{d:900,at:200}));H.O(sl,1,{at:900})},
    ()=>{H.O(sis,0,{d:400});orig.forEach(b=>H.T(b,{x:0},{d:600}));H.O(sl,0,{d:300});H.O(r2,1,{at:200});H.O(c2,1,{at:300});H.O(r3,1,{at:900});H.O(c3,1,{at:1000})},
    ()=>{H.O(r4,1);H.O(c4,1,{at:200})},
  ];}},

/* 6 ─────────────────────────────── */
{sec:'12.2',title:'Genetic Maps Count Crossovers',caption:'Blue = from dad, orange = from mom · numbers are an example',
text:`<p data-step="0">Two <b>loci</b> (gene positions) close together on the same chromosome are <b>linked</b>. <b>Meiosis</b> is the cell division that makes gametes. In meiosis, the two <b>homologous chromosomes</b> (one from each parent) exchange segments by <b>crossing over</b>.</p>
<p data-step="1">A capital and a small letter are two alleles of one gene (<span class="m">A</span> and <span class="m">a</span>). A crossover between the two loci makes a <b>recombinant</b> chromosome: a new combination of alleles, such as <span class="m">A b</span>. A crossover outside the two loci does not.</p>
<p data-step="2">The <b>recombination frequency</b> (RF) is the percentage of recombinant gametes. Loci far apart get a crossover between them more often, so their RF is higher.</p>
<p data-step="3">An RF of 1% is 1 <b>map unit</b> (m.u.), also called 1 <b>centimorgan (cM)</b>, after the geneticist Thomas Hunt Morgan. Here 8 recombinants in 100 gametes give RF = 8%, so A and B are 8 cM apart.</p>
<p data-step="4">Each RF measures one pair of loci. Pairwise distances combine into one map. A–B = 8 cM, B–C = 3 cM and A–C = 11 cM, so the order is A–B–C.</p>`,
star:'1% recombinant gametes = 1 cM.',starStep:3,
scene(H){const s=stage();const xa=60,xb=380,LA=110,LB=320,XC=215;
  const mkBar=(y,cl,cr)=>{const G=H.g(s);const l=R(G,xa,y-7,XC-xa,14,`fill:var(--${cl})`,{rx:7});const r=R(G,XC,y-7,xb-XC,14,`fill:var(--${cr})`,{rx:7});
    R(G,XC-8,y-7,16,14,`fill:var(--${cl})`);G.l=l;G.r=r;return G};
  const top=mkBar(90,'dad','dad'),bot=mkBar(132,'mom','mom');const tr=top.r,br=bot.r;
  const lab=H.g(s);[[LA,'A','a'],[LB,'B','b']].forEach(([x,u,l])=>{Ln(lab,x,78,x,144,'stroke:var(--ink);stroke-width:2.5');H.txt(lab,x,70,u,'mt',{'text-anchor':'middle',st:'font-size:20px'});H.txt(lab,x,164,l,'mt',{'text-anchor':'middle',st:'font-size:20px'})});
  const xo=H.g(s);H.E('path',{d:`M${XC-14},86 C${XC},100 ${XC},122 ${XC+14},136 M${XC-14},136 C${XC},122 ${XC},100 ${XC+14},86`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--ink);stroke-width:2.5'},xo);
  const rl=H.g(s);H.txt(rl,xb+10,95,'A b','mt',{st:'font-size:18px;fill:var(--ink)'});H.txt(rl,xb+10,137,'a B','mt',{st:'font-size:18px;fill:var(--ink)'});H.txt(rl,xb+10,158,'recombinant','lbs',{st:'font-size:11px'});hid(rl);
  // gamete grid
  const gx0=490,gy0=48,cs=15;const dots=[];const rec=[7,19,34,41,58,66,83,95];
  for(let i=0;i<100;i++){const x=gx0+(i%10)*cs,y=gy0+Math.floor(i/10)*cs;const c=H.E('circle',{cx:x,cy:y,r:5,st:`fill:var(--${rec.includes(i)?'hi':'faint'});stroke:var(--ink);stroke-width:${rec.includes(i)?1.4:0}`},s);hid(c);dots.push(c)}
  const gl=H.g(s);H.txt(gl,gx0+67,gy0+162,'100 gametes','lb',{'text-anchor':'middle',st:'font-size:13px'});H.txt(gl,gx0+67,gy0+178,'yellow = recombinant','lbs',{'text-anchor':'middle',st:'font-size:11px'});hid(gl);
  const eq=H.g(s);H.txt(eq,320,246,'RF = 8 ÷ 100 = 8%   →   A–B = 8 cM','lb',{'text-anchor':'middle',st:'font-size:20px'});hid(eq);
  // combined map: adjacent pairs above the line, A–C below
  const MY=350,sc=34,mx=(v)=>130+v*sc;const mp=H.g(s);const ml=DL(mp,90,MY,560,MY,'stroke:var(--ink);stroke-width:2.5');
  const pts=[['A',0],['B',8],['C',11]];const pk=H.g(mp);pts.forEach(([n,v])=>{Ln(pk,mx(v),MY-7,mx(v),MY+7,'stroke:var(--ink);stroke-width:2.5');H.txt(pk,mx(v),MY-14,n,'mt',{'text-anchor':'middle',st:'font-size:18px'})});
  const arc=(a,b,hh,t,below)=>{const G=H.g(mp);const y0=below?MY+10:MY-32,sg=below?1:-1;
    H.E('path',{d:`M${mx(a)+4},${y0} Q${(mx(a)+mx(b))/2},${y0+sg*hh*2} ${mx(b)-4},${y0}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--mom);stroke-width:2'},G);
    H.txt(G,(mx(a)+mx(b))/2,below?y0+hh+16:y0-hh-5,t,'lb',{'text-anchor':'middle',st:'font-size:13px'+HALO});hid(G);return G};
  const a1=arc(0,8,18,'8 cM'),a2=arc(8,11,12,'3 cM'),a3=arc(0,11,24,'11 cM',true);hid(pk);
  const sh=G=>{H.O(G,1);H.D(G.querySelector('.draw'),1,{d:700})};
  return [
    ()=>{},
    ()=>{H.D(xo.firstChild,1,{d:700});H.after(700,()=>{H.K(tr,{fill:'mom'},{d:800});H.K(br,{fill:'dad'},{d:800});H.O(rl,1,{at:700})})},
    ()=>{dots.forEach((d,i)=>H.O(d,1,{d:150,at:i*14}));H.O(gl,1,{at:1400})},
    ()=>{H.O(eq,1)},
    ()=>{H.D(ml,1,{d:800});H.O(pk,1,{at:300});sh(a1);H.after(500,()=>sh(a2));H.after(1000,()=>sh(a3))},
  ];}},

/* 7 ─────────────────────────────── */
{sec:'12.2',title:'Centimorgans Are Not Base Pairs',caption:'Human chromosome 7 · cM: HapMap project genetic map, average of male and female · Mb: GRCh38 (2013 human reference sequence)',
text:`<p data-step="0">Genetic distance is roughly proportional to physical distance (the amount of DNA). The graph plots the genetic map of human chromosome 7 against its physical map.</p>
<p data-step="1">Near the centromere the line is flat: about 4 Mb of DNA with almost no crossovers. Regions with few crossovers often hold <b>heterochromatin</b>, tightly packed DNA with few genes.</p>
<p data-step="2">Near the tip of the long arm the line is steep, up to 4 cM per Mb. Crossovers cluster in short stretches of DNA, about 1,000–2,000 bp long, called <b>crossover hot spots</b>. In humans, the protein PRDM9 binds a short DNA <b>motif</b> (a short sequence pattern) and marks many hot spots.</p>
<p data-step="3">On average, chromosome 7 has 187 cM for 159 Mb: about 0.85 Mb per cM. The ratio changes with the species and with the place on the chromosome. In the plant <i>Arabidopsis</i>, 1 cM is roughly 150,000 to 250,000 bp and holds dozens of genes.</p>`,
star:'cM counts crossovers. bp counts DNA.',starStep:3,
scene(H){const s=stage();const x0=90,x1=600,y0=360,y1=40;const X=m=>x0+(x1-x0)*m/160,Y=c=>y0-(y0-y1)*c/200;
  const ax=H.g(s);[0,50,100,150,200].forEach(c=>{Ln(ax,x0,Y(c),x1,Y(c),`stroke:var(--faint);stroke-width:${c?1:2}`);H.txt(ax,x0-8,Y(c)+4,c,'lbs',{'text-anchor':'end'})});
  [0,40,80,120,160].forEach(m=>{Ln(ax,X(m),y0,X(m),y0+5,'stroke:var(--ink);stroke-width:1.5');H.txt(ax,X(m),y0+20,m,'lbs',{'text-anchor':'middle'})});
  H.txt(ax,(x0+x1)/2,y0+44,'physical map: position in Mb','lb',{'text-anchor':'middle',st:'font-size:13px'});
  const yl=H.txt(ax,0,0,'genetic map: cM','lb',{'text-anchor':'middle',st:'font-size:13px'});yl.setAttribute('transform',`translate(28,${(y0+y1)/2}) rotate(-90)`);
  const pts=CM7.map((c,i)=>[X(i===160?L7:i),Y(c)]);
  const curve=H.E('path',{d:'M'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L'),pathLength:1,cls:'draw',st:'fill:none;stroke:var(--dad);stroke-width:2.6;stroke-linejoin:round'},s);
  H.E('title',{text:'Chromosome 7: genetic position (cM) against physical position (Mb)'},curve);
  const cf=H.g(s);H.E('circle',{cx:X(117.48),cy:Y(130),r:5,st:'fill:var(--mom);stroke:var(--card);stroke-width:2'},cf);H.txt(cf,X(117.48)-9,Y(130)-8,'CFTR','lb',{'text-anchor':'end',st:'font-size:12px'+HALO});hid(cf);
  const ce=H.g(s);R(ce,X(58.1),y1,X(62.1)-X(58.1),y0-y1,'fill:var(--hi);fill-opacity:.45');H.txt(ce,X(58)-6,Y(118),'centromere:','lb',{'text-anchor':'end',st:'font-size:12.5px'+HALO});
  H.txt(ce,X(58)-6,Y(118)+16,'4 Mb, almost 0 cM','lbs',{'text-anchor':'end',st:'fill:var(--ink)'+HALO});mkA(ce,X(58)-30,Y(108),X(59.5),Y(83),{w:1.5,h:6});hid(ce);
  const tp=H.g(s);H.E('path',{d:'M'+pts.slice(150).map(p=>p.join(',')).join(' L'),st:'fill:none;stroke:var(--mom);stroke-width:6;stroke-linecap:round'},tp);
  H.txt(tp,X(146),Y(190),'q-arm tip: steep,','lb',{'text-anchor':'end',st:'font-size:12.5px'+HALO});H.txt(tp,X(146),Y(190)+16,'many crossovers','lbs',{'text-anchor':'end',st:'fill:var(--ink)'+HALO});hid(tp);
  const av=H.g(s);DL(av,X(0),Y(0),X(L7),Y(G7),'stroke:var(--muted);stroke-width:1.8;stroke-dasharray:6 5');
  H.txt(av,X(100),Y(60),'average: 187 cM ÷ 159 Mb','lb',{st:'font-size:12.5px'+HALO});H.txt(av,X(100),Y(60)+16,'≈ 0.85 Mb per cM','lbs',{st:'fill:var(--ink)'+HALO});hid(av);
  return [
    ()=>{H.D(curve,1,{d:1800});H.O(cf,1,{at:1600})},
    ()=>{H.O(ce,1);drawA(ce.querySelector('g'),{at:300})},
    ()=>{H.O(tp,1)},
    ()=>{H.O(av,1);show(av.firstChild,{d:1000})},
  ];}},

/* 8 ─────────────────────────────── */
{sec:'12.2',title:'Comparing Species: Conserved Synteny',caption:'Genetic maps of two linkage groups (LG5, LG10) · P. Beldade et al. (2009), PLOS Genetics, CC BY',
text:`<p data-step="0">Genetic maps let geneticists compare species. Geneticists mapped two chromosomes in the silk moth <i>Bombyx mori</i> (Bmori) and in a butterfly, <i>Bicyclus anynana</i> (Bany). The scale at the left is in cM. The silk-moth positions are estimates, drawn at twice their size.</p>
<p data-step="0">Each vertical bar is a <b>linkage group</b>: the loci of one chromosome, in map order.</p>
<p data-step="1">Thin lines join the same gene in the two species. Genes that sit on one chromosome together in both species show <b>conserved synteny</b> (synteny: "on the same chromosome").</p>
<p data-step="2">In linkage group 10, most lines keep the same order. In linkage group 5, more lines cross: some genes changed place after the two species separated.</p>
<p data-step="3">Conserved synteny shows that both species inherited these chromosomes from a common ancestor. Genetic maps also track alleles in crop and animal breeding, and they help find genes for human diseases.</p>`,
star:'Same genes, same chromosome, two species: shared ancestry.',starStep:3,
scene(H){const s=stage();const k=400/812,ox=8,oy=10;const P=(x,y)=>[ox+x*k,oy+y*k];
  const im=photo(s,'@@asset:c12-synteny.jpg@@',ox,oy,955*k,812*k,{bg:'#fff',r:6});hid(im);
  const side=H.g(s);const L=(y,t,sub)=>{H.txt(side,488,y,t,'lb',{st:'font-size:13px'});if(sub)H.txt(side,488,y+16,sub,'lbs',{st:'font-size:11.5px'})};
  L(60,'Bmori = silk moth','Bombyx mori');L(104,'Bany = butterfly','Bicyclus anynana');L(148,'LG = linkage group','one chromosome');hid(side);
  const hiL=(x1,y1,x2,y2)=>{const a=P(x1,y1),b=P(x2,y2);return DL(s,a[0],a[1],b[0],b[1],'stroke:var(--mom);stroke-width:3.2;stroke-linecap:round;opacity:.85')};
  const par=[hiL(738,172,810,172),hiL(738,400,808,496),hiL(738,608,808,614),hiL(738,730,810,688)];
  const crs=[hiL(273,125,352,795)];
  const n1=H.g(s);H.txt(n1,488,214,'orange: same gene','lb',{st:'font-size:12.5px'});H.txt(n1,488,230,'in both species','lbs',{st:'font-size:11.5px'});hid(n1);
  const n2=H.g(s);H.txt(n2,488,268,'crossing lines:','lb',{st:'font-size:12.5px'});H.txt(n2,488,284,'genes moved','lbs',{st:'font-size:11.5px'});hid(n2);
  return [
    ()=>{H.O(im,1,{d:700});H.O(side,1,{at:500})},
    ()=>{H.D(par,1,{d:900});par.forEach((l,i)=>l.style.transitionDelay=i*150+'ms');H.O(n1,1,{at:600})},
    ()=>{H.D(crs,1,{d:1100});H.O(n2,1,{at:700})},
    ()=>{},
  ];}},

/* 9 ─────────────────────────────── */
{sec:'12.3',title:'Cytogenetic Maps: Stained Bands',caption:'Left: G-banded human chromosome 1 pair, NHGRI, public domain · right: chromosome 1 band pattern from GRCh38, the 2013 human reference sequence',
text:`<p data-step="0"><b>Cytogenetics</b> studies chromosomes under the microscope. In <b>metaphase</b>, the stage of cell division when the chromosomes align in the middle of the cell, they are most condensed, so they give the clearest view. An average metaphase chromosome is about 5 µm long. Each chromatid is about 700 nm wide (1 mm = 1,000 µm; 1 µm = 1,000 nm). In <b>interphase</b>, between divisions, the same chromosome is a thin fibre about 2 mm long.</p>
<p data-step="1">To make bands, a cytogeneticist treats the chromosomes with the enzyme trypsin and stains them with Giemsa dye (<b>G-banding</b>). The fluorescent dye quinacrine gives a similar pattern (<b>Q-banding</b>).</p>
<p data-step="2">The bands follow the DNA sequence. Regions rich in A–T base pairs stain dark and have few genes. Regions rich in G–C base pairs stain light and have most of the genes.</p>
<p data-step="3">Each chromosome pair has its own band pattern. Length, centromere position and band pattern together identify each human chromosome.</p>`,
star:'Dark band: A–T rich, few genes. Light band: G–C rich, many genes.',starStep:2,
scene(H){const s=stage();
  const ph=photo(s,KARYO,22,40,190,279,{crop:[41,40,109,160],iw:1200,ih:940,bg:'#fff'});
  const sb=H.g(s);Ln(sb,226,52,226,310,'stroke:var(--ink);stroke-width:1.5');Ln(sb,221,52,231,52,'stroke:var(--ink);stroke-width:1.5');Ln(sb,221,310,231,310,'stroke:var(--ink);stroke-width:1.5');
  const t=H.txt(sb,0,0,'≈ 8–10 µm (chromosome 1)','lbs',{'text-anchor':'middle',st:'fill:var(--ink)'});t.setAttribute('transform','translate(242,181) rotate(90)');
  H.txt(sb,117,356,'metaphase chromosome 1 pair','lb',{'text-anchor':'middle',st:'font-size:12.5px'});H.txt(sb,117,374,'in interphase: a fibre about 2 mm long','lbs',{'text-anchor':'middle'});
  const C=ideo(s,B1,L1,{a:40,len:340,c:330,h:30,vert:true,drawn:true});C.bands.forEach(b=>b.style.opacity=0);
  const dye=R(s,312,40,36,0,'fill:var(--mom);fill-opacity:.22',{rx:15});
  const dl=H.g(s);H.txt(dl,330,30,'trypsin + Giemsa','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});hid(dl);
  const zoom=(mbA,mbB,y,title,seq,sub,dark)=>{const G=H.g(s);const ya=C.u(mbA),yb=C.u(mbB);
    R(G,312,ya,36,yb-ya,`fill:none;stroke:var(--${dark?'dad':'mom'});stroke-width:3`);Ln(G,348,(ya+yb)/2,396,y,'stroke:var(--ink);stroke-width:1.2');
    R(G,396,y-30,232,72,'fill:var(--card);stroke:var(--ink);stroke-width:1.5',{rx:8});H.txt(G,408,y-10,title,'lb',{st:'font-size:13px'});
    H.txt(G,408,y+12,seq,'lb',{st:MONO+';font-size:14px;letter-spacing:1px;fill:var(--'+(dark?'dad':'mom')+')'});H.txt(G,408,y+32,sub,'lbs',{st:'font-size:11.5px'});hid(G);return G};
  const zl=zoom(34.3,39.6,96,'light band (1p34.3)','GCGGCCGCTGGC…','example sequence · many genes',false);
  const zd=zoom(69.3,84.4,212,'dark band (1p31.1)','ATTAAATATTTA…','example sequence · few genes',true);
  const id=H.g(s);H.txt(id,512,318,'chromosome 1','lb',{'text-anchor':'middle'});H.txt(id,512,336,'longest · metacentric','lbs',{'text-anchor':'middle'});H.txt(id,512,352,'its own band pattern','lbs',{'text-anchor':'middle'});hid(id);
  hid(C);
  return [
    ()=>{},
    ()=>{H.O(C,1);H.O(dl,1);dye.setAttribute('height',0);H.T(dye,{sy:1},{d:0});const p={set textContent(v){dye.setAttribute('height',v)}};H.count(p,0,340,{d:1500,fmt:v=>v});
      H.after(1500,()=>{H.O(dye,0,{d:600});C.bands.forEach((b,i)=>H.O(b,1,{d:250,at:i*22}))})},
    ()=>{H.O(zl,1);H.O(zd,1,{at:400})},
    ()=>{H.O(id,1)},
  ];}},

/* 10 ─────────────────────────────── */
{sec:'12.3',title:'Karyogram and Karyotype',caption:'Chromosomes cut from a G-banded human male karyogram, NHGRI, public domain · the scattered view is a simulation',
text:`<p data-step="0">A cytogeneticist photographs a cell in metaphase. In this <b>metaphase spread</b>, the chromosomes lie scattered and often overlap, so they are hard to tell apart.</p>
<p data-step="1">A cytogeneticist sorts the chromosomes into pairs in a standard order. The result is a <b>karyogram</b>. In the past, people cut each chromosome from a printed photograph with scissors and glued it to card. Today software sorts them, and a person checks the result.</p>
<p data-step="2">The pairs carry numbers by length, from 1 (the longest) down. Chromosome 21 is slightly shorter than chromosome 22, so the order has one exception. A body cell has 22 pairs of <b>autosomes</b> and one pair of sex chromosomes: 2n = 46. Here n is the number of chromosomes in one set. A gamete has one set: n = 23.</p>
<p data-step="3">The <b>karyotype</b> is the complete set of chromosomes of one individual, for example 46,XY for this male. The two copies of a pair look the same, but their DNA differs at many base pairs. Usually nobody can tell which copy came from the mother.</p>`,
star:'Karyogram = the sorted picture. Karyotype = the set of chromosomes.',starStep:3,
scene(H){const s=stage();const k=.4,ox=80,oy=10;
  const BX=[[41,40,109,162],[210,45,94,154],[381,60,107,142],[806,60,83,126],[977,57,80,138],[49,287,80,133],[231,296,65,119],[387,306,88,100],[555,311,75,96],[733,317,65,99],[900,304,75,104],[1065,311,88,100],[47,560,94,78],[219,561,95,77],[395,560,58,78],[728,566,68,69],[903,573,74,64],[1087,569,56,68],[233,791,55,61],[398,780,54,63],[733,809,61,50],[909,800,61,57],[1077,756,68,98]];
  const card=R(s,ox-8,oy-6,1200*k+16,940*k+6,'fill:#fff;stroke:var(--ink);stroke-width:1.5',{rx:8});hid(card);
  const spread=H.E('ellipse',{cx:320,cy:212,rx:300,ry:196,st:'fill:#fff;stroke:var(--ink);stroke-width:1.5'},s);
  let seed=7;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
  const pcs=[];BX.forEach((b,i)=>{[0,1].forEach(h=>{const sx=b[0]+h*b[2]/2,sw=b[2]/2,sy=b[1],sh=b[3];const w=sw*k,hh=sh*k;
      const G=H.g(s);const sv=H.E('svg',{x:-w/2,y:-hh/2,width:w,height:hh,viewBox:`${sx} ${sy} ${sw} ${sh}`},G);H.E('image',{href:KARYO,width:1200,height:940},sv);
      const fx=ox+(sx+sw/2)*k,fy=oy+(sy+sh/2)*k;let px,py;do{px=60+rnd()*520;py=40+rnd()*340}while(((px-320)/270)**2+((py-212)/170)**2>1);
      G.f=[fx,fy];G.p=[px,py,(rnd()-.5)*300];H.T(G,{x:px,y:py,r:G.p[2]},{d:0});pcs.push(G)})});
  const nums=H.g(s);const NL=['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','X Y'];
  BX.forEach((b,i)=>H.txt(nums,ox+(b[0]+b[2]/2)*k,oy+(b[1]+b[3])*k+13,NL[i],'lb',{'text-anchor':'middle',st:'font-size:12px;fill:#16181d'}));hid(nums);
  const xy=BX[22];const xyR=R(s,ox+xy[0]*k-4,oy+xy[1]*k-4,xy[2]*k+8,xy[3]*k+24,'fill:none;stroke:var(--mom);stroke-width:3',{rx:5});hid(xyR);
  const cnt=H.g(s);chip(cnt,178,404,'22 pairs of autosomes',{fs:12.5,w:170});chip(cnt,362,404,'+ X and Y = 46',{fs:12.5,w:140});hid(cnt);
  const kt=H.g(s);chip(kt,530,404,'karyotype: 46,XY',{fs:13,w:150,fill:'var(--hi)',ink:'#16181d'});hid(kt);
  return [
    ()=>{},
    ()=>{H.O(spread,0,{d:700});H.O(card,1,{d:700});pcs.forEach((G,i)=>H.T(G,{x:G.f[0],y:G.f[1],r:0},{d:1400,at:200+i*22}))},
    ()=>{H.O(nums,1);H.O(xyR,1,{at:300});H.O(cnt,1,{at:500})},
    ()=>{H.O(kt,1)},
  ];}},

/* 11 ─────────────────────────────── */
{sec:'12.3',title:'Reading a Band Address: 7q31.2',caption:'Human chromosome 7 bands from GRCh38, the 2013 human reference sequence · region 3 of the long arm enlarged below',
text:`<p data-step="0">A band name is an address on the cytogenetic map. Read 7q31.2 one part at a time.</p>
<p data-step="1"><b>7</b> is the chromosome. <b>q</b> is the long arm (<b>p</b> would be the short arm).</p>
<p data-step="2"><b>3</b> is region 3 of the q arm. The numbers of regions, bands and sub-bands increase outward, from the centromere toward the tip.</p>
<p data-step="3"><b>1</b> is band 1 inside region 3. Read "31" as "three one", not "thirty-one".</p>
<p data-step="4"><b>.2</b> is sub-band 2 of band 31. The gene CFTR sits at 7q31.2. Longer, less condensed chromosomes show more bands, so some sub-bands split again, for example 7q31.31.</p>`,
star:'Chromosome · arm · region · band . sub-band',starStep:4,
scene(H){const s=stage();
  const C=ideo(s,B7,L7,{a:40,len:560,c:72,h:26,drawn:true});
  const pq=H.g(s);H.txt(pq,C.u(30),46,'p','mt',{'text-anchor':'middle',st:'font-size:18px'});H.txt(pq,C.u(110),46,'q','mt',{'text-anchor':'middle',st:'font-size:18px'});
  const qh=R(pq,C.u(60.1),57,C.u(L7)-C.u(60.1)+2,30,'fill:none;stroke:var(--hi);stroke-width:3.5',{rx:13});hid(pq);
  const regs=[[0,20.9,'2'],[20.9,60.1,'1'],[60.1,77.9,'1'],[77.9,107.8,'2'],[107.8,L7,'3']];const rg=H.g(s);const rgE=regs.map(([a,b,n],i)=>{const G=H.g(rg);
    H.E('path',{d:`M${C.u(a)+2},92 L${C.u(a)+2},98 L${C.u(b)-2},98 L${C.u(b)-2},92`,st:`fill:none;stroke:var(--ink);stroke-width:1.5`},G);
    H.txt(G,(C.u(a)+C.u(b))/2,114,'region '+n,'lbs',{'text-anchor':'middle',st:'font-size:11px'});return G});hid(rg);
  const arrowsOut=H.g(s);H.txt(arrowsOut,40,290,'Numbers grow outward from the centromere:','lb',{st:'font-size:12.5px'});
  H.txt(arrowsOut,330,290,'p2 · p1 | q1 · q2 · q3','lbs',{st:MONO+';font-size:12.5px;fill:var(--ink)'});hid(arrowsOut);
  // zoom of region 3
  const Z0=107.8,ZA=40,ZL=560,zu=m=>ZA+ZL*(m-Z0)/(L7-Z0),ZY=196,ZH=34;
  const zm=H.g(s);DL(zm,C.u(Z0),86,ZA,ZY-ZH/2,'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4');DL(zm,C.u(L7),86,ZA+ZL,ZY-ZH/2,'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4');
  const zb=B7.filter(b=>b[1]>=Z0-.01);const zr=zb.map(b=>{R(zm,zu(b[1]),ZY-ZH/2,zu(b[2])-zu(b[1]),ZH,`fill:${CHR_BG}`);return R(zm,zu(b[1]),ZY-ZH/2,zu(b[2])-zu(b[1]),ZH,bandSt(b[3])+';stroke:var(--ink);stroke-width:.8')});
  const zl=zb.map(b=>{const x=(zu(b[1])+zu(b[2]))/2;const t=H.txt(zm,0,0,'q'+b[0].slice(1),'lbs',{st:'font-size:11px;fill:var(--ink)'});t.setAttribute('transform',`translate(${x+3},${ZY+ZH/2+8}) rotate(50)`);return t});
  s.insertBefore(zm,rg);hid(zm);
  const b31=R(s,zu(107.8),ZY-ZH/2-5,zu(127.5)-zu(107.8),ZH+10,'fill:none;stroke:var(--hi);stroke-width:3.5',{rx:4});hid(b31);
  const b312=H.g(s);R(b312,zu(115),ZY-ZH/2-9,zu(117.7)-zu(115),ZH+18,'fill:none;stroke:var(--mom);stroke-width:3.5',{rx:3});
  H.txt(b312,zu(116.35),ZY-ZH/2-16,'CFTR','lb',{'text-anchor':'middle',st:HALO.slice(1)});hid(b312);
  // the address
  const parts=[['7','chromosome'],['q','arm'],['3','region'],['1','band'],['.2','sub-band']];const ax=[150,214,278,342,410];
  const ad=parts.map(([c,m],i)=>{const G=H.g(s);const big=H.txt(G,ax[i],352,c,'big',{'text-anchor':'middle',st:'font-size:46px;fill:var(--faint)'});
    const sub=H.txt(G,ax[i],386,m,'lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});hid(sub);G.big=big;G.sub=sub;return G});
  const lit=(i)=>{H.K(ad[i].big,{fill:'ink'});H.O(ad[i].sub,1)};
  return [
    ()=>{},
    ()=>{lit(0);lit(1);H.O(pq,1)},
    ()=>{lit(2);H.O(rg,1);H.O(arrowsOut,1);H.O(zm,1,{at:400});show([...zm.querySelectorAll('path')].filter(e=>e.dz),{d:700,at:400});H.O(qh,0)},
    ()=>{lit(3);H.O(b31,1)},
    ()=>{lit(4);H.O(b312,1);zl.forEach(t=>t.style.fontWeight=t.textContent==='q31.2'?'800':'')},
  ];}},

/* 12 ─────────────────────────────── */
{sec:'12.3',title:'FISH: A Glowing Probe Finds Its Place',caption:'FISH principle · probe = cloned DNA from CFTR, so its spots land on 7q31.2',
text:`<p data-step="0"><b>Fluorescence in situ hybridization (FISH)</b> shows where a piece of DNA sits on a chromosome. <i>In situ</i> means "in place": the chromosomes stay on the microscope slide.</p>
<p data-step="1">A <b>clone</b> is one piece of DNA that bacteria copy many times. The <b>probe</b> is a copy of a cloned piece of DNA with a fluorescent dye attached. Heat separates the two strands of the chromosome DNA.</p>
<p data-step="2">The probe pairs only with its matching sequence: A with T, G with C. This pairing is <b>hybridization</b>.</p>
<p data-step="3">Under a fluorescence microscope, the probe glows as a spot on the band that holds its sequence. Each copy of the chromosome gets a spot. FISH links a cloned DNA piece (physical map) to a band (cytogenetic map).</p>`,
star:'FISH: a glowing probe pairs with its matching DNA.',starStep:3,
scene(H){const s=stage();
  const chrs=[62,122].map(x=>ideo(s,B7,L7,{a:50,len:330,c:x,h:24,vert:true,drawn:true}));
  H.txt(s,92,402,'chromosome 7 pair','lbs',{'text-anchor':'middle'});
  const yq=chrs[0].u(116.35);
  const zl=H.g(s);DL(zl,134,yq,250,100,'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4');DL(zl,134,yq,250,270,'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4');
  R(zl,250,100,380,170,'fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4',{rx:8});
  const TOP='TATCATCTTTGGTG',BOT='ATAGTAGAAACCAC',sx=272,dx=25,yT=196,yB=240;
  const dna=H.g(s);const topG=H.g(dna),botG=H.g(dna);
  Ln(topG,sx-8,yT+6,sx+dx*13+8,yT+6,'stroke:var(--dad);stroke-width:3');Ln(botG,sx-8,yB-18,sx+dx*13+8,yB-18,'stroke:var(--dad);stroke-width:3');
  const rungs=H.g(dna);for(let i=0;i<14;i++){Ln(rungs,sx+i*dx,yT+9,sx+i*dx,yB-21,'stroke:var(--muted);stroke-width:1.6')}
  [...TOP].forEach((c,i)=>H.txt(topG,sx+i*dx,yT,c,'lb',{'text-anchor':'middle',st:MONO+';font-size:15px'}));
  [...BOT].forEach((c,i)=>H.txt(botG,sx+i*dx,yB,c,'lb',{'text-anchor':'middle',st:MONO+';font-size:15px'}));
  H.txt(dna,262,262,'chromosome DNA at 7q31.2','lbs',{st:'font-size:11px'});hid(dna);
  // probe
  const PS=3,PL=9,probe=H.g(s);Ln(probe,sx+PS*dx-8,yT+6,sx+(PS+PL-1)*dx+8,yT+6,'stroke:var(--good);stroke-width:3');
  [...TOP.slice(PS,PS+PL)].forEach((c,i)=>H.txt(probe,sx+(PS+i)*dx,yT,c,'lb',{'text-anchor':'middle',st:MONO+';font-size:15px;fill:var(--good)'}));
  const star=H.E('circle',{cx:sx+PS*dx-18,cy:yT-4,r:9,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.5'},probe);
  H.txt(probe,sx+PS*dx-32,yT,'dye','lbs',{'text-anchor':'end',st:'font-size:11px'});
  const pl=H.txt(s,sx+(PS+4)*dx,60,'probe','lb',{'text-anchor':'middle',st:'fill:var(--good)'});hid(pl);
  H.T(probe,{y:-120},{d:0});hid(probe);
  const glow=chrs.map(c=>{const G=H.g(s);const x=+c.bands[0].getAttribute('x')+12;H.E('circle',{cx:x,cy:yq,r:15,st:'fill:var(--hi);fill-opacity:.35'},G);H.E('circle',{cx:x,cy:yq,r:7,st:'fill:var(--hi);stroke:var(--ink);stroke-width:1.2'},G);hid(G);return G});
  const gl=H.g(s);H.txt(gl,250,300,'one spot on each chromosome 7,','lb',{st:'font-size:13px'});H.txt(gl,250,318,'at band 7q31.2','lbs',{st:'fill:var(--ink)'});hid(gl);
  hid(zl);
  return [
    ()=>{H.O(zl,1);show([...zl.querySelectorAll('path')].filter(e=>e.dz),{d:700});H.O(dna,1,{at:500})},
    ()=>{H.O(probe,1);H.O(pl,1);H.O(rungs,0,{d:500});H.T(topG,{y:-58},{d:1000,at:300});H.O(topG,.35,{d:800,at:300})},
    ()=>{H.O(pl,0);H.T(probe,{y:0},{d:1200});H.O(rungs,1,{d:500,at:1100})},
    ()=>{glow.forEach((g,i)=>H.O(g,1,{d:600,at:i*200}));H.O(gl,1,{at:400})},
  ];}},

/* 13 ─────────────────────────────── */
{sec:'12.3',title:'FISH on Real Chromosomes',caption:'Top: J. H. Hsu et al. (2013), Int. J. Mol. Sci., CC BY 3.0 · bottom: A. R. Tonelli et al. (2007), CC BY 2.0 · both via Wikimedia Commons',
text:`<p data-step="0">Top: a metaphase spread under a fluorescence microscope. The green probe is a <b>BAC clone</b>: a piece of human DNA of about 100,000 to 200,000 bp, copied in bacteria. The probe lights the same band next to the centromere on both copies of chromosome 16.</p>
<p data-step="0">A red probe paints the whole length of chromosome 16, so the two copies are easy to find.</p>
<p data-step="1">Bottom: FISH tests nuclei of two people for <b>22q11.2 deletion syndrome</b>. A <b>syndrome</b> is a group of health problems that occur together. A green probe marks a site near the end of the long arm of each chromosome 22, as a control. A red probe marks band 22q11.2.</p>
<p data-step="2">The normal nucleus has two red spots. The patient's nucleus has one, because one chromosome 22 lacks about 3 Mb of DNA. A deletion this small is usually invisible in a banded karyogram. FISH finds it, because the probe tests one exact sequence.</p>`,
star:'One missing spot = one missing piece of DNA.',starStep:2,
scene(H){const s=stage();
  const A=photo(s,'@@asset:c12-fish-chr16.jpg@@',8,6,216,234,{crop:[0,0,505,547],iw:1024,ih:547});
  const In=photo(s,'@@asset:c12-fish-chr16.jpg@@',236,6,260,125,{crop:[508,0,516,250],iw:1024,ih:547,bg:'#fff'});
  const r=k=>216/505;const sp=[[215,362],[184,415]].map(([x,y])=>{const G=H.g(s);H.E('circle',{cx:8+x*216/505,cy:6+y*234/547,r:11,st:'fill:none;stroke:var(--hi);stroke-width:3'},G);hid(G);return G});
  const tl=H.g(s);H.txt(tl,236,154,'enlarged: the two chromosome 16s','lb',{st:'font-size:12.5px'});H.txt(tl,236,172,'green = BAC probe · red = whole-16 paint','lbs',{st:'font-size:11.5px'});hid(tl);
  const B=photo(s,'@@asset:c12-fish-22q11.jpg@@',8,248,431,168,{});hid(B);
  const bl=H.g(s);H.txt(bl,452,288,'NORMAL','cap',{st:'fill:var(--ink)'});H.txt(bl,452,306,'2 red · 2 green','lb',{st:'font-size:13px'});
  H.txt(bl,452,352,'22q11.2 DELETION','cap',{st:'fill:var(--ink)'});H.txt(bl,452,370,'1 red · 2 green','lb',{st:'font-size:13px'});hid(bl);
  const del=H.g(s);H.E('circle',{cx:8+(800-180)*431/910,cy:248+(675-455)*168/355,r:13,st:'fill:none;stroke:var(--hi);stroke-width:3'},del);H.txt(del,452,392,'one copy lacks ≈ 3 Mb','lbs',{st:'fill:var(--ink)'});hid(del);
  hid(A);hid(In);
  return [
    ()=>{H.O(A,1,{d:600});H.O(In,1,{d:600,at:300});sp.forEach((g,i)=>H.O(g,1,{at:700+i*200}));H.O(tl,1,{at:900})},
    ()=>{H.O(B,1,{d:600});H.O(bl,1,{at:400})},
    ()=>{H.O(del,1)},
  ];}},

/* 14 ─────────────────────────────── */
{sec:'12.4',title:'Physical Maps: Positions in Base Pairs',caption:'Human chromosome 7 · positions from the GRCh38 and GRCh37 reference sequences (Ensembl)',
text:`<p data-step="0">A <b>physical map</b> gives distances in base pairs. A gene's <b>molecular location</b> is its start and end position, in base pairs, on its chromosome.</p>
<p data-step="1">CFTR runs from base pair 117,480,025 to 117,668,665 of chromosome 7. So the gene is 188,641 bp long. A cytogenetic address (7q31.2) only says that the gene is somewhere in a band of 2.7 Mb.</p>
<p data-step="2">The molecular location also gives exact distances. The nearby gene MET ends about 0.68 Mb before CFTR starts.</p>
<p data-step="3">Positions change a little between versions of the human reference sequence. In the 2009 version (GRCh37), CFTR started at 117,120,017. In the 2013 version (GRCh38), it starts at 117,480,025. Research groups also report slightly different positions, because they interpret the sequence in different ways.</p>`,
star:'Physical map = address in base pairs.',starStep:1,
scene(H){const s=stage();
  const C=ideo(s,B7,L7,{a:40,len:560,c:50,h:22,drawn:true});H.txt(s,40,26,'CHROMOSOME 7','cap');
  const W0=116.4,W1=117.8,wx=m=>40+560*(m-W0)/(W1-W0);
  const win=R(s,C.u(W0),36,C.u(W1)-C.u(W0),28,'fill:none;stroke:var(--hi);stroke-width:3',{rx:2});
  const z1=[DL(s,C.u(W0),64,40,112,'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4'),DL(s,C.u(W1),64,600,112,'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4')];
  const R1=ruler(s,{a:40,b:600,y:150,min:W0,max:W1,ticks:[116.5,117,117.5],fmt:v=>v+' Mb'});
  const geneBox=(p,a,b,y,col,name)=>{const G=H.g(p);const x0=wx(a),x1=wx(b);H.E('path',{d:`M${x0},${y-10} L${x1-8},${y-10} L${x1},${y} L${x1-8},${y+10} L${x0},${y+10} Z`,st:`fill:var(--${col});stroke:var(--ink);stroke-width:1.5`},G);
    H.txt(G,(x0+x1)/2,y-16,name,'lb',{'text-anchor':'middle',st:'font-size:13px'});return G};
  const gm=geneBox(s,116.672,116.798,128,'dad-tint','MET'),gc=geneBox(s,117.480,117.669,128,'mom-tint','CFTR');
  const z1G=H.g(s);[win,...z1,R1,gm,gc].forEach(e=>z1G.appendChild(e));hid(z1G);
  const gap=H.g(s);mkA(gap,(wx(116.798)+wx(117.48))/2,128,wx(116.798)+4,128,{w:1.6,h:6});mkA(gap,(wx(116.798)+wx(117.48))/2,128,wx(117.48)-4,128,{w:1.6,h:6});
  H.txt(gap,(wx(116.798)+wx(117.48))/2,118,'≈ 0.68 Mb','lb',{'text-anchor':'middle',st:'font-size:12.5px'});hid(gap);
  // zoom to CFTR
  const gx=kb=>60+520*kb/188.64,GY=268;const cz=H.g(s);
  DL(cz,wx(117.48),139,60,GY-18,'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4');DL(cz,wx(117.669),139,580,GY-18,'stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 4');
  Ln(cz,60,GY,580,GY,'stroke:var(--ink);stroke-width:2');EX.forEach(([a,b])=>R(cz,gx(a),GY-11,Math.max(2.5,gx(b)-gx(a)),22,'fill:var(--mom)'));
  H.txt(cz,60,GY+30,'117,480,025','lb',{st:MONO+';font-size:13px'});H.txt(cz,580,GY+30,'117,668,665','lb',{'text-anchor':'end',st:MONO+';font-size:13px'});
  H.txt(cz,320,GY+30,'CFTR · 188,641 bp','lb',{'text-anchor':'middle',st:'font-size:13px'});hid(cz);
  // versions
  const vs=H.g(s);const vy=354;H.txt(vs,40,vy,'GRCh37 (2009)','lb',{st:'font-size:13px'});H.txt(vs,40,vy+30,'GRCh38 (2013)','lb',{st:'font-size:13px'});
  const vx=m=>180+420*(m-116.9)/0.8;Ln(vs,180,vy-4,600,vy-4,'stroke:var(--faint);stroke-width:2');Ln(vs,180,vy+26,600,vy+26,'stroke:var(--faint);stroke-width:2');
  const g37=R(vs,vx(117.12),vy-11,vx(117.309)-vx(117.12),14,'fill:var(--mom)',{rx:3}),g38=R(vs,vx(117.48),vy+19,vx(117.669)-vx(117.48),14,'fill:var(--mom)',{rx:3});
  H.txt(vs,vx(117.12)+(vx(117.309)-vx(117.12))+8,vy+1,'starts 117,120,017','lbs',{st:'fill:var(--ink)'});H.txt(vs,vx(117.48)-8,vy+31,'starts 117,480,025','lbs',{'text-anchor':'end',st:'fill:var(--ink)'});hid(vs);
  return [
    ()=>{H.O(z1G,1);show(z1,{d:700});H.D(R1.line,1,{d:800,at:300})},
    ()=>{H.O(cz,1);show([...cz.querySelectorAll('path')].filter(e=>e.dz),{d:700})},
    ()=>{H.O(gap,1);gap.querySelectorAll(':scope>g').forEach(a=>drawA(a))},
    ()=>{H.O(vs,1);H.T(g38,{x:vx(117.12)-vx(117.48),y:-30},{d:0});H.T(g38,{x:0,y:0},{d:1300,at:300})},
  ];}},

/* 15 ─────────────────────────────── */
{sec:'12.4',title:'Cloning Large Pieces of a Genome',caption:'Not to scale · three colours = three copies of the same DNA',
text:`<p data-step="0">Scientists build a physical map of a whole chromosome from smaller pieces. They start with many copies of the genome DNA.</p>
<p data-step="1">A <b>restriction enzyme</b> cuts DNA at a specific short sequence, its <b>restriction site</b>. A short reaction cuts only some of the sites, so each copy breaks at different places. The pieces from different copies overlap.</p>
<p data-step="2">Scientists put each piece into a <b>vector</b>, a DNA molecule that bacteria copy. Each copied piece is a clone. A <b>bacterial artificial chromosome (BAC)</b> carries a piece of about 100,000 to 200,000 bp. A <b>plasmid</b> (a small circle of bacterial DNA) carries smaller pieces.</p>
<p data-step="3">All the clones together are a <b>clone library</b>. Many clones carry the same region, so the library holds redundant, overlapping clones.</p>
<p data-step="3" class="note">For scale: the DNA of lambda, a virus that infects bacteria, is 48,502 bp long. A human chromosome is 47 to 249 million bp long.</p>`,
star:'Cut copies at different places → overlapping clones.',starStep:3,
scene(H){const s=stage();const ys=[60,98,136],cols=['dad','mom','good'],sites=[95,160,230,300,350,430,500,560];
  const cuts=[[160,350,500],[95,300,430],[230,560]];
  const copies=ys.map((y,i)=>{const G=H.g(s);const segs=[];const pts=[40,...cuts[i],600];
    for(let k=0;k<pts.length-1;k++){const sg=H.g(G);Ln(sg,pts[k]+1,y,pts[k+1]-1,y,`stroke:var(--${cols[i]});stroke-width:6;stroke-linecap:butt`);segs.push({g:sg,a:pts[k],b:pts[k+1]})}
    sites.forEach(x=>Ln(G,x,y-9,x,y+9,'stroke:var(--ink);stroke-width:1.5'));G.segs=segs;hid(G);return G});
  const sl=H.g(s);H.txt(sl,40,32,'restriction sites (black ticks)','lbs',{st:'fill:var(--ink)'});hid(sl);
  const scis=H.g(s);cuts.forEach((cs,i)=>cs.forEach(x=>{H.E('path',{d:`M${x-6},${ys[i]-14} L${x+6},${ys[i]+14} M${x+6},${ys[i]-14} L${x-6},${ys[i]+14}`,st:'stroke:var(--bad);stroke-width:2.5;stroke-linecap:round'},scis)}));hid(scis);
  const pick=[[0,1],[0,2],[1,1],[1,2],[2,1],[1,3]];const bx=[[110,250],[320,250],[530,250],[110,338],[320,338],[530,338]];
  const bact=bx.map(([x,y],i)=>{const G=H.g(s);H.E('ellipse',{cx:x,cy:y,rx:68,ry:28,st:'fill:var(--cellfill);stroke:var(--ink);stroke-width:2'},G);
    const [ci,si]=pick[i];const sg=copies[ci].segs[si];const frac=Math.min(.75,(sg.b-sg.a)/420);
    H.E('circle',{cx:x,cy:y,r:17,st:'fill:none;stroke:var(--ink);stroke-width:2.5'},G);H.E('path',{d:H.arcD(x,y,17,-180*frac,180*frac),st:`fill:none;stroke:var(--${cols[ci]});stroke-width:6`},G);
    H.txt(G,x,y+43,'BAC clone '+(i+1),'lbs',{'text-anchor':'middle',st:'font-size:11px'});hid(G);return G});
  const lib=H.g(s);R(lib,20,212,600,192,'fill:none;stroke:var(--mom);stroke-width:2.5;stroke-dasharray:7 5',{rx:14});chip(lib,320,214,'clone library',{fs:12.5,w:120,fill:'var(--card)'});hid(lib);
  return [
    ()=>{copies.forEach((c,i)=>H.O(c,1,{at:i*200}));H.O(sl,1,{at:500})},
    ()=>{H.O(scis,1);H.after(500,()=>copies.forEach(c=>c.segs.forEach((sg,k)=>H.T(sg.g,{x:(k-(c.segs.length-1)/2)*7},{d:700}))));H.O(scis,0,{d:400,at:1100})},
    ()=>{pick.forEach(([ci,si],i)=>{const sg=copies[ci].segs[si];const [x,y]=bx[i];H.T(sg.g,{x:x-(sg.a+sg.b)/2,y:y-ys[ci],s:1},{d:1100,at:i*120});H.O(sg.g,0,{d:300,at:1000+i*120});H.O(bact[i],1,{d:500,at:900+i*120})});copies.forEach(c=>c.segs.forEach(sg=>{if(!pick.some(([ci,si])=>copies[ci].segs[si]===sg))H.O(sg.g,.25,{at:1200})}))},
    ()=>{H.O(lib,1)},
  ];}},

/* 16 ─────────────────────────────── */
{sec:'12.4',title:'Contigs: Putting Clones in Order',caption:'Five clones from one region · letters = example sites of four restriction enzymes (B, N, S, F)',
text:`<p data-step="0">Each clone holds an unknown piece of the genome. Scientists must put the clones in order without the full sequence of each clone.</p>
<p data-step="1">One method compares the pattern of restriction sites in each clone. Two clones that share part of their pattern overlap there.</p>
<p data-step="2">Another method uses DNA from one end of a clone as a probe. The probe finds the other clones that contain the same sequence. Step by step, the overlaps extend along the chromosome.</p>
<p data-step="3">A set of overlapping clones that covers a region without gaps is a <b>contig</b> (from "contiguous"). Building it is <b>contig construction</b>. For sequencing, scientists choose the smallest set of clones that still covers the region.</p>`,
star:'Shared patterns show the overlaps; overlaps give the order.',starStep:3,
scene(H){const s=stage();const X=p=>44+5.5*p;
  const SITES=[['B',4],['N',9],['N',14],['S',25],['N',27],['S',36],['F',39],['B',42],['F',52],['F',57],['N',70],['N',73],['B',76],['S',79],['B',86],['S',89],['F',92],['N',96],['S',99]];
  const CL=[[0,45],[22,60],[40,82],[50,94],[80,100]];const FY=[60,104,148,192,236];const start=[2,0,4,1,3],after1=[0,1,2,3,4];
  const clones=CL.map(([a,b],i)=>{const G=H.g(s);Ln(G,X(a),0,X(b),0,'stroke:var(--ink);stroke-width:2.5');H.txt(G,X(a)-10,5,String(i+1),'lb',{'text-anchor':'end',st:'fill:var(--mom)'});
    G.marks=SITES.filter(t=>t[1]>a&&t[1]<b).map(([l,p])=>{const m=H.g(G);Ln(m,X(p),-8,X(p),0,'stroke:var(--ink);stroke-width:1.6');H.txt(m,X(p),-12,l,'lbs',{'text-anchor':'middle',st:'font-size:11px;font-weight:700;fill:var(--ink)'});m.p=p;return m});
    H.T(G,{x:X(0)-X(a),y:FY[start[i]]},{d:0});return G});
  const ov=(i,j)=>{const a=Math.max(CL[i][0],CL[j][0]),b=Math.min(CL[i][1],CL[j][1]);[i,j].forEach(c=>clones[c].marks.forEach(m=>{if(m.p>a&&m.p<b)H.K(m.querySelector('text'),{fill:'mom'})}))};
  const pr=H.g(s);H.E('circle',{cx:0,cy:0,r:7,st:'fill:var(--good);stroke:var(--ink);stroke-width:1.5'},pr);H.txt(pr,12,4,'end probe','lbs',{st:'font-size:11px;font-weight:700;fill:var(--good)'});hid(pr);
  const ctg=H.g(s);const CY=330;Ln(ctg,X(0),CY,X(100),CY,'stroke:var(--mom);stroke-width:4');SITES.forEach(([l,p])=>{Ln(ctg,X(p),CY-9,X(p),CY,'stroke:var(--mom);stroke-width:2');H.txt(ctg,X(p),CY-13,l,'lbs',{'text-anchor':'middle',st:'font-size:11px;font-weight:700;fill:var(--ink)'})});
  H.txt(ctg,X(50),CY+26,'contig: the whole region, sites in order','lb',{'text-anchor':'middle',st:'font-size:13px'});hid(ctg);
  const tl=H.g(s);H.txt(tl,X(50),CY+58,'smallest covering set: clones 1, 3 and 5','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});hid(tl);
  return [
    ()=>{},
    ()=>{H.T(clones[0],{x:0,y:FY[0]},{d:1100});H.T(clones[1],{x:0,y:FY[1]},{d:1100,at:200});[2,3,4].forEach(i=>H.T(clones[i],{x:X(0)-X(CL[i][0]),y:FY[i]},{d:900}));H.after(1300,()=>ov(0,1))},
    ()=>{[2,3,4].forEach((i,k)=>{H.after(k*900,inst=>{H.O(pr,1,{d:200});H.T(pr,{x:X(CL[i-1][1])-4,y:FY[i-1]},{d:inst?0:300});H.T(clones[i],{x:0,y:FY[i]},{d:inst?0:800,at:inst?0:300});H.after(1000,()=>ov(i-1,i))})});H.after(2900,()=>H.O(pr,0))},
    ()=>{H.O(ctg,1);H.after(700,()=>{[1,3].forEach(i=>H.O(clones[i],.3));H.O(tl,1)})},
  ];}},

/* 17 ─────────────────────────────── */
{sec:'12.4',title:'Restriction Enzymes and Gels',caption:'Photograph: agarose gel under UV light, ladder in the left lane · Mnolf, CC BY-SA 3.0, Wikimedia Commons',
text:`<p data-step="0">Each restriction enzyme recognizes its own site. KpnI cuts GGTAC•C, ApaI cuts GGGCC•C and NarI cuts GG•CGCC (• marks the cut). CvnI cuts CC•TNAGG, where N is any base.</p>
<p data-step="1"><b>Gel electrophoresis</b> sorts DNA pieces by size. DNA has a negative charge, so an electric field pulls it through a gel toward the positive pole. Short pieces move fastest. Each group of pieces of one size makes a <b>gel band</b>.</p>
<p data-step="2">A <b>size marker</b> (a ladder of DNA pieces of known sizes) runs in one lane. Compare each sample gel band with the ladder to read its size. Sizes are in kb (1 kb = 1,000 bp).</p>
<p data-step="3">In the photograph, a stain makes the DNA glow under ultraviolet light. Each glowing gel band holds many DNA pieces of one size.</p>`,
star:'Short pieces run farthest.',starStep:2,
scene(H){const s=stage();
  const T='ATTCGGTACCATGA',B='TAAGCCATGGTACT',sx=150,dx=24,yt=56,yb=84;
  const L=H.g(s),Rr=H.g(s);const tc=9,bc=5;
  [...T].forEach((c,i)=>H.txt(i<tc?L:Rr,sx+i*dx,yt,c,'lb',{'text-anchor':'middle',st:MONO+';font-size:16px'+(i>=4&&i<=9?';fill:var(--mom)':'')}));
  [...B].forEach((c,i)=>H.txt(i<bc?L:Rr,sx+i*dx,yb,c,'lb',{'text-anchor':'middle',st:MONO+';font-size:16px'+(i>=4&&i<=9?';fill:var(--mom)':'')}));
  const cut=H.E('path',{d:`M${sx+(tc-.5)*dx},${yt-18} L${sx+(tc-.5)*dx},${yt+8} L${sx+(bc-.5)*dx},${yt+8} L${sx+(bc-.5)*dx},${yb+8}`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--bad);stroke-width:2.5;stroke-dasharray:1'},s);
  H.txt(s,sx+6.5*dx,yt-24,'KpnI site','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});
  // gel
  const gx0=36,gw=250,gy0=140,gh=262;const gel=H.g(s);R(gel,gx0,gy0,gw,gh,'fill:var(--wash);stroke:var(--ink);stroke-width:1.5',{rx:6});
  H.txt(gel,gx0+gw+8,gy0+14,'−','lb',{st:'font-size:20px'});H.txt(gel,gx0+gw+8,gy0+gh-2,'+','lb',{st:'font-size:20px'});
  const lanes=[gx0+40,gx0+125,gx0+205];lanes.forEach(x=>R(gel,x-22,gy0+10,44,8,'fill:var(--card);stroke:var(--ink);stroke-width:1.2'));
  const yOf=kb=>gy0+30+(Math.log10(12)-Math.log10(kb))/(Math.log10(12)-Math.log10(.4))*(gh-50);
  const lad=[10,6,4,3,2,1.5,1,.5],sA=[7,2.5],sB=[5,3.5,1.2];
  const bands=[];const mkB=(x,kb,col)=>{const b=R(gel,x-20,gy0+12,40,6,`fill:var(--${col})`,{rx:2});b.ty=yOf(kb)-3-(gy0+12);bands.push(b);return b};
  lad.forEach(k=>mkB(lanes[0],k,'ink'));sA.forEach(k=>mkB(lanes[1],k,'mom'));sB.forEach(k=>mkB(lanes[2],k,'mom'));bands.forEach(hid);
  const ll=H.g(s);lad.forEach(k=>H.txt(ll,lanes[0]-26,yOf(k)+4,k+' kb','lbs',{'text-anchor':'end',st:'font-size:10px;fill:var(--ink)'}));H.txt(ll,lanes[0],gy0-6,'ladder','lbs',{'text-anchor':'middle',st:'font-size:11px;font-weight:700;fill:var(--ink)'});
  H.txt(ll,lanes[1],gy0-6,'sample 1','lbs',{'text-anchor':'middle',st:'font-size:11px'});H.txt(ll,lanes[2],gy0-6,'sample 2','lbs',{'text-anchor':'middle',st:'font-size:11px'});hid(ll);
  hid(gel);
  const ph=photo(s,'@@asset:c12-gel.jpg@@',318,140,310,232);const pl=H.g(s);mkA(pl,352,392,352,368,{w:1.6,h:6});H.txt(pl,362,398,'ladder','lbs',{st:'fill:var(--ink);font-weight:700'});hid(ph);hid(pl);
  return [
    ()=>{H.D(cut,1,{d:700});H.T(Rr,{x:22},{d:800,at:700});H.T(L,{x:-10},{d:800,at:700})},
    ()=>{H.O(gel,1);bands.forEach((b,i)=>{H.O(b,1,{d:200,at:300});H.T(b,{y:b.ty},{d:2200,at:400,ease:'cubic-bezier(.2,.6,.3,1)'})})},
    ()=>{H.O(ll,1)},
    ()=>{H.O(ph,1,{d:700});H.O(pl,1,{at:500});drawA(pl.querySelector('g'),{at:500})},
  ];}},

/* 18 ─────────────────────────────── */
{sec:'12.4',title:'Restriction Mapping (1): One Site at a Time',caption:'Lambda DNA, 48.5 kb, linear · gel lanes: one enzyme (A, N, K) or two together (A/N, K/A) · sizes in kb',
text:`<p data-step="0"><b>Restriction mapping</b> finds the positions of restriction sites on a DNA molecule. A scientist cuts lambda DNA (48.5 kb, linear) with one enzyme (a <b>single digest</b>) or with two enzymes together (a <b>double digest</b>). The gel gives the sizes of the pieces.</p>
<p data-step="0" class="note">The gel gives sizes rounded to 0.1 kb, so sums can differ by 0.1.</p>
<p data-step="1"><b>ApaI (A):</b> 10.0 + 38.4 kb. One cut in a linear molecule gives two pieces, so there is one A site. Call the end next to it the left end: A is at 10.0.</p>
<p data-step="2"><b>NarI (N):</b> 45.7 + 2.8, so one N site 2.8 kb from an end. <b>A/N:</b> 10.0 + 35.7 + 2.8. The 10.0 piece is unchanged, so N cuts the 38.4 piece. N is at 45.7.</p>
<p data-step="3"><b>KpnI (K):</b> 17.0 + 1.5 + 29.9: two K sites. <b>K/A:</b> 10.0 + 7.0 + 1.5 + 29.9. A splits the 17.0 piece, so the 17.0 piece is at the left end and K cuts at 17.0. The 1.5 piece can sit next to the 17.0 piece or at the right end. The CvnI digests decide.</p>`,
star:'A piece that a second enzyme leaves whole has no site for that enzyme.',starStep:3,
scene(H){return lambdaScene(H,{
  lanes:['A','N','A/N','K','K/A'],
  rows:[['A',[10.0,38.4]],['N',[45.7,2.8]],['A/N',[10.0,35.7,2.8]],['K',[17.0,1.5,29.9]],['K/A',[10.0,7.0,1.5,29.9]]],
  steps:[[],[0],[1,2],[3,4]],
  sites:[[],[['A',10]],[['N',45.7]],[['K',17]]],unsure:[[3,1],[4,2]]});}},

/* 19 ─────────────────────────────── */
{sec:'12.4',title:'Restriction Mapping (2): The Whole Map',caption:'Lambda DNA, 48.5 kb · lanes C (CvnI), C/K and C/N · sizes in kb',
text:`<p data-step="0"><b>CvnI (C):</b> 26.7 + 7.6 + 14.2: two C sites. <b>C/K:</b> 17.0 + 1.5 + 8.2 + 7.6 + 14.2. The 26.7 piece splits into 17.0 + 1.5 + 8.2, so it holds both K sites. So the 1.5 piece is next to the 17.0 piece: K at 18.5. The 26.7 piece is at the left end, and C cuts at 26.7.</p>
<p data-step="1"><b>C/N:</b> 26.7 + 7.6 + 11.4 + 2.8. The 14.2 piece splits into 11.4 + 2.8, so it holds the N site and sits at the right end. The 7.6 piece is in the middle: the second C site is at 26.7 + 7.6 = 34.3.</p>
<p data-step="2">The map, from the left end: A 10.0 · K 17.0 · K 18.5 · C 26.7 · C 34.3 · N 45.7 kb. Every lane of the gel fits this map.</p>
<p data-step="3">The gel cannot show which end is left, so the mirror image fits too. More enzymes add more sites and give a more detailed map.</p>
<p data-step="3" class="note">Restriction mapping is quick and cheap. A restriction map shows whether two DNA samples are alike, without sequencing. Its sites also let a scientist cut a gene free, to sequence it or to use it as a probe.</p>`,
star:'Single digests count the sites; double digests place them.',starStep:2,
scene(H){return lambdaScene(H,{
  lanes:['C','C/K','C/N'],
  rows:[['C',[26.7,7.6,14.2]],['C/K',[17.0,1.5,8.2,7.6,14.2]],['C/N',[26.7,7.6,11.4,2.8]]],
  steps:[[0,1],[2],[],[]],pre:[['A',10],['N',45.7],['K',17]],
  sites:[[['C',26.7],['K',18.5]],[['C',34.3]],[],[]],final:2,mirror:3});}},

/* 20 ─────────────────────────────── */
{sec:'12.4',title:'Sequencing: The Ultimate Physical Map',caption:'Short example · real reads are 100 to more than 10,000 letters long',
text:`<p data-step="0">To read a <b>DNA sequence</b>, scientists start with many copies of the DNA.</p>
<p data-step="1">In <b>shotgun sequencing</b>, the copies break at random places. A machine reads the letters of each piece. Each readout is a <b>read</b>.</p>
<p data-step="2">Reads that share letters overlap. A computer aligns the overlaps and joins the reads into one long sequence, again called a contig.</p>
<p data-step="3">A computer cannot place a repeat that is longer than the reads, so the repeat leaves a gap. Newer machines read more than 10,000 letters at a time, so one read spans most repeats.</p>
<p data-step="3" class="note">Scientists use the finished sequence of one <b>strain</b> (one genetic line of an organism) as a reference. They compare the sequence of a <b>mutant</b> strain, which carries a changed gene, with the reference to find the differences.</p>`,
star:'Overlap, align, join: reads become a sequence.',starStep:2,
scene(H){const s=stage();const SEQ='GATTCGCATGACCTAGTTGCAGAGCTTCGGATCCATAGCA',x0=62,dx=13.2;
  const RD=[[0,10],[6,9],[12,10],[17,9],[23,10],[28,9],[33,7]],RY=[136,166,136,166,136,166,196];
  const cp=H.g(s);[40,62,84].forEach((y,i)=>Ln(cp,x0-6,y,x0+40*dx,y,`stroke:var(--${['dad','mom','good'][i]});stroke-width:5`));H.txt(cp,x0-6,24,'MANY COPIES OF ONE DNA','cap');
  const reads=RD.map(([a,n],i)=>{const G=H.g(s);R(G,-6,-15,n*dx+4,21,'fill:var(--dad-tint);stroke:var(--dad);stroke-width:1.5',{rx:4});
    [...SEQ.slice(a,a+n)].forEach((c,k)=>H.txt(G,k*dx+dx/2-4,1,c,'lb',{'text-anchor':'middle',st:MONO+';font-size:13px'}));
    G.f=[x0+a*dx,RY[i]];G.r=[[70,140,-7],[300,128,5],[470,155,-4],[130,205,6],[330,212,-5],[480,240,3],[210,268,-2]][i];H.T(G,{x:G.r[0],y:G.r[1],r:G.r[2]},{d:0});hid(G);return G});
  const con=H.g(s);R(con,x0-8,224,40*dx+8,26,'fill:var(--hi);fill-opacity:.35;stroke:var(--ink);stroke-width:1.5',{rx:4});
  [...SEQ].forEach((c,k)=>H.txt(con,x0+k*dx+dx/2-4,242,c,'lb',{'text-anchor':'middle',st:MONO+';font-size:13px'}));H.txt(con,x0-8,276,'joined sequence (contig)','lb',{st:'font-size:13px'});hid(con);
  const rp=H.g(s);const RY2=352;H.txt(rp,x0-6,316,'A REPEAT LONGER THAN THE READS','cap');
  R(rp,x0-6,RY2-12,140,24,'fill:var(--dad-tint);stroke:var(--dad);stroke-width:1.5',{rx:4});H.txt(rp,x0+64,RY2+5,'…GATTCG','lb',{'text-anchor':'middle',st:MONO+';font-size:13px'});
  R(rp,x0+160,RY2-12,190,24,'fill:none;stroke:var(--bad);stroke-width:2;stroke-dasharray:6 4',{rx:4});H.txt(rp,x0+255,RY2+5,'CACACACA… ? …CACA','lb',{'text-anchor':'middle',st:MONO+';font-size:13px;fill:var(--bad)'});
  R(rp,x0+370,RY2-12,140,24,'fill:var(--dad-tint);stroke:var(--dad);stroke-width:1.5',{rx:4});H.txt(rp,x0+440,RY2+5,'TAGCCA…','lb',{'text-anchor':'middle',st:MONO+';font-size:13px'});hid(rp);
  const lr=H.g(s);R(lr,x0+30,RY2+20,450,14,'fill:var(--good)',{rx:7});H.txt(lr,x0+255,RY2+52,'one long read spans the repeat: the gap closes','lbs',{'text-anchor':'middle',st:'fill:var(--ink);font-weight:700'});hid(lr);
  return [
    ()=>{},
    ()=>{reads.forEach((G,i)=>H.O(G,1,{d:400,at:i*120}))},
    ()=>{reads.forEach((G,i)=>H.T(G,{x:G.f[0],y:G.f[1],r:0},{d:1300,at:i*120}));H.O(con,1,{at:1600})},
    ()=>{H.O(rp,1);H.O(lr,1,{at:1200});H.T(lr,{x:0},{d:0})},
  ];}},

/* 21 ─────────────────────────────── */
{sec:'12.4',title:'The Human Genome Project',caption:'White House, 26 June 2000: J. Craig Venter, President Bill Clinton, Francis Collins · NHGRI, public domain',
text:`<p data-step="0">The <b>Human Genome Project</b> (HGP) ran from 1990 to 2003. Its goal was to read the sequence of all human DNA and to map all human genes. The public team, the International Human Genome Sequencing <b>Consortium</b> (a team of many groups), joined 20 research centres in six countries.</p>
<p data-step="1">In June 2000, the HGP and the company Celera announced a first draft of the sequence. Both groups published their drafts in 2001.</p>
<p data-step="2">In 2003 the HGP called the sequence "essentially complete". About 8% was still missing, mostly long repeats such as the DNA of the centromeres.</p>
<p data-step="3">In 2022, the Telomere-to-Telomere (T2T) consortium published the first gap-free human sequence: 22 autosomes plus X, about 3.05 billion bp. A complete Y chromosome followed in 2023. The sequence gives every human gene a molecular location.</p>`,
star:'1990 start · 2001 draft · 2003: 92% · 2022: gap-free.',starStep:3,
scene(H){const s=stage();
  const ph=photo(s,'@@asset:c12-hgp-2000.jpg@@',14,12,330,210);
  const st=H.g(s);H.txt(st,362,40,'PUBLIC CONSORTIUM','cap');H.txt(st,362,70,'20 centres','big',{st:'font-size:24px'});H.txt(st,362,94,'in 6 countries','lbs',{st:'fill:var(--ink)'});
  H.txt(st,362,116,'USA, UK, Japan, France,','lbs',{st:'font-size:11.5px'});H.txt(st,362,131,'Germany, China','lbs',{st:'font-size:11.5px'});hid(st);
  const bars=H.g(s);H.txt(bars,362,166,'SHARE OF THE GENOME SEQUENCED','cap',{st:'font-size:9.5px'});
  const bar=(y,lab)=>{R(bars,362,y,250,14,'fill:var(--wash);stroke:var(--ink);stroke-width:1.2',{rx:3});const f=R(bars,362,y,0,14,'fill:var(--good)',{rx:3});f.set={set textContent(v){f.setAttribute('width',v)}};
    const t=H.txt(bars,362,y+30,lab,'lbs',{st:'fill:var(--ink);font-weight:700'});hid(t);return {f,t}};
  const b03=bar(176,'2003: about 92%'),b22=bar(218,'2022: 100% (22 autosomes + X)');hid(bars);
  const TX=y=>40+560*(y-1990)/33,TY=330;const tl=H.g(s);Ln(tl,30,TY,610,TY,'stroke:var(--ink);stroke-width:2.5');
  [1990,2000,2010,2020].forEach(y=>H.txt(tl,TX(y),TY+44,y,'lbs',{'text-anchor':'middle'}));
  const ev=(y,lab,sub,up,anchor)=>{const G=H.g(s);const x=TX(y);H.E('circle',{cx:x,cy:TY,r:7,st:'fill:var(--mom);stroke:var(--card);stroke-width:2'},G);
    const ty=up?TY-44:TY+64;Ln(G,x,TY+(up?-8:8),x,up?ty+6:ty-30,'stroke:var(--ink);stroke-width:1.2');
    H.txt(G,x,ty-(up?14:0),lab,'lb',{'text-anchor':anchor||'middle',st:'font-size:12.5px'});H.txt(G,x,ty+(up?2:16),sub,'lbs',{'text-anchor':anchor||'middle',st:'font-size:11px'});hid(G);return G};
  const e90=ev(1990,'1990','HGP starts',true,'start'),e00=ev(2000.5,'2000–2001','first drafts',false),e03=ev(2003,'2003','"essentially complete"',true),e22=ev(2022.5,'2022–2023','gap-free (T2T)',true,'end');
  hid(tl);hid(ph);
  return [
    ()=>{H.O(ph,1,{d:700});H.O(tl,1,{at:300});H.O(e90,1,{at:500});H.O(st,1,{at:700})},
    ()=>{H.O(e00,1)},
    ()=>{H.O(e03,1);H.O(bars,1);H.count(b03.f.set,0,250*.92,{d:1300,at:300,fmt:v=>v});H.O(b03.t,1,{at:1200})},
    ()=>{H.O(e22,1);H.count(b22.f.set,0,250,{d:1300,at:300,fmt:v=>v});H.O(b22.t,1,{at:1200})},
  ];}},

/* 22 ─────────────────────────────── */
{sec:'12.4',title:'Markers Link the Three Maps',caption:'Blue = from dad, orange = from mom · MET positions: HapMap cM, GRCh38 band and bp',
text:`<p data-step="0">A <b>DNA marker</b> is a site where people's DNA differs, so geneticists can follow it from parents to children. A marker does not have to be a gene.</p>
<p data-step="1">A <b>SNP</b> (single-nucleotide polymorphism) is a site where one base pair differs, for example C in one copy and T in the other.</p>
<p data-step="2">A <b>microsatellite</b> is a short sequence repeated many times in a row, such as CACACA. The number of repeats differs between copies.</p>
<p data-step="3">A marker has a position on all three maps. Family studies give its cM position. FISH gives its band. The sequence gives its position in base pairs. For example, the MET gene is at about 129 cM, in band 7q31.2, at 116.7 Mb.</p>`,
star:'One marker, three addresses.',starStep:3,
scene(H){const s=stage();
  const hd=H.g(s);H.txt(hd,30,32,'TWO COPIES OF ONE STRETCH OF DNA','cap');Ln(hd,30,64,610,64,'stroke:var(--dad);stroke-width:5');Ln(hd,30,124,610,124,'stroke:var(--mom);stroke-width:5');
  H.txt(hd,30,54,'from dad','lbs',{st:'font-size:11px'});H.txt(hd,30,144,'from mom','lbs',{st:'font-size:11px'});
  const snp=H.g(s);const sd='GATCAGGA',sm='GATTAGGA';[[sd,86],[sm,108]].forEach(([q,y])=>[...q].forEach((c,i)=>H.txt(snp,130+i*16,y,c,'lb',{'text-anchor':'middle',st:MONO+';font-size:15px'+(i===3?';fill:var(--bad)':'')})));
  R(snp,130+3*16-9,70,18,46,'fill:none;stroke:var(--hi);stroke-width:3',{rx:4});H.txt(snp,130+3*16,168,'SNP: C or T','lb',{'text-anchor':'middle',st:'font-size:13px'});hid(snp);
  const ms=H.g(s);const blk=(x,y,n,col)=>{for(let i=0;i<n;i++){R(ms,x+i*24,y-13,22,18,`fill:var(--${col}-tint);stroke:var(--${col});stroke-width:1.3`,{rx:3});H.txt(ms,x+i*24+11,y+1,'CA','lbs',{'text-anchor':'middle',st:MONO+';font-size:11px;fill:var(--ink)'})}};
  blk(330,92,5,'dad');blk(330,114,8,'mom');H.txt(ms,430,168,'microsatellite: 5 or 8 repeats','lb',{'text-anchor':'middle',st:'font-size:13px'});hid(ms);
  // three addresses
  const X0=130,LEN=470,gx=c=>X0+LEN*c/G7,px=m=>X0+LEN*m/L7;
  const th=H.g(s);const lab=(y,t)=>H.txt(th,20,y+4,t,'lb',{st:'font-size:13px'});
  lab(226,'Genetic (cM)');const gR=ruler(th,{a:X0,b:X0+LEN,y:226,max:G7,ticks:[0,50,100,150],fmt:v=>v});gR.line.style.strokeDashoffset=0;
  lab(300,'Cytogenetic');const C=ideo(th,B7,L7,{a:X0,len:LEN,c:300,h:22,drawn:true});
  lab(372,'Physical (Mb)');const pR=ruler(th,{a:X0,b:X0+LEN,y:372,max:L7,ticks:[0,50,100,150],fmt:v=>v});pR.line.style.strokeDashoffset=0;hid(th);
  const pin=H.g(s);const gxm=gx(GN.MET[1]),pxm=px(GN.MET[0]);
  H.E('path',{d:`M${gxm},226 L${pxm},289 M${pxm},311 L${pxm},372`,pathLength:1,cls:'draw',st:'fill:none;stroke:var(--mom);stroke-width:2.5'},pin);
  [[gxm,226],[pxm,300],[pxm,372]].forEach(([x,y])=>H.E('circle',{cx:x,cy:y,r:6,st:'fill:var(--mom);stroke:var(--card);stroke-width:2'},pin));
  H.txt(pin,gxm-10,208,'MET ≈ 129 cM','lb',{'text-anchor':'end',st:'font-size:12.5px'+HALO});H.txt(pin,pxm-14,282,'7q31.2','lb',{'text-anchor':'end',st:'font-size:12.5px'+HALO});H.txt(pin,pxm-10,358,'116.7 Mb','lb',{'text-anchor':'end',st:'font-size:12.5px'+HALO});hid(pin);
  return [
    ()=>{},
    ()=>{H.O(snp,1)},
    ()=>{H.O(ms,1)},
    ()=>{H.O(th,1);H.O(pin,1,{at:500});H.D(pin.querySelector('.draw'),1,{d:1000,at:500})},
  ];}},

/* 23 ─────────────────────────────── */
{sec:'12.4',title:'Map-Based Cloning: How CFTR Was Found',caption:'Cystic fibrosis gene hunt, 1985–1989 · positions GRCh38 · clone walk drawn schematically',
text:`<p data-step="0"><b>Map-based cloning</b> (also called positional cloning) finds a gene from its position on the maps, before anyone knows what the gene does.</p>
<p data-step="1"><b>Genetic map.</b> In 1985, family studies showed that children inherit cystic fibrosis together with markers on chromosome 7, among them MET. Few crossovers separated the disease from MET, so the gene had to be close to MET.</p>
<p data-step="2"><b>Physical map.</b> Researchers then moved along the DNA from the markers with a series of overlapping clones. They searched each clone for genes.</p>
<p data-step="3"><b>Sequence.</b> In 1989 they found the gene, CFTR. Its most common disease allele, F508del, lacks three base pairs (CTT). So the CFTR protein lacks one amino acid: phenylalanine number 508.</p>
<p data-step="4">Today geneticists know the human sequence. A gene hunt now goes from a map position straight to the list of genes in that region.</p>`,
star:'Genetic map → physical map → sequence → gene.',starStep:4,
scene(H){const s=stage();
  const gl=H.g(s);H.txt(gl,30,34,'GENETIC MAP · CHROMOSOME 7','cap');const gR=ruler(gl,{a:40,b:600,y:62,max:G7,ticks:[0,50,100,150],fmt:v=>v+' cM'});gR.line.style.strokeDashoffset=0;
  const gq=H.g(s);H.txt(gq,gR.X(129.6),46,'CF gene: somewhere here?','lb',{'text-anchor':'middle',st:'font-size:12.5px'+HALO});R(gq,gR.X(126),55,gR.X(133)-gR.X(126),14,'fill:var(--bad);fill-opacity:.3;stroke:var(--bad);stroke-width:1.5',{rx:3});
  const mm=H.g(s);Ln(mm,gR.X(129.3),52,gR.X(129.3),72,'stroke:var(--dad);stroke-width:4');H.txt(mm,gR.X(129.3)-8,98,'marker MET','lbs',{'text-anchor':'end',st:'fill:var(--dad);font-weight:700'});hid(mm);hid(gq);
  // physical walk
  const W0=116.55,W1=117.75,wx=m=>40+560*(m-W0)/(W1-W0),PY=184;const pl=H.g(s);
  H.txt(pl,345,128,'PHYSICAL MAP · 116.55–117.75 Mb','cap',{'text-anchor':'middle'});DL(pl,gR.X(126),72,40,PY-28,'stroke:var(--muted);stroke-width:1.1;stroke-dasharray:4 4');DL(pl,gR.X(133),72,600,PY-28,'stroke:var(--muted);stroke-width:1.1;stroke-dasharray:4 4');
  Ln(pl,40,PY,600,PY,'stroke:var(--ink);stroke-width:2');R(pl,wx(116.672),PY-7,wx(116.798)-wx(116.672),14,'fill:var(--dad)',{rx:3});H.txt(pl,(wx(116.672)+wx(116.798))/2,PY+24,'MET','lb',{'text-anchor':'middle',st:'font-size:12px'});hid(pl);
  const steps=9,cl=[];for(let i=0;i<steps;i++){const a=116.74+i*0.09;cl.push(R(s,wx(a),PY-24-(i%2)*9,wx(a+0.13)-wx(a),6,'fill:var(--good)',{rx:3}))}cl.forEach(hid);
  const cf=H.g(s);R(cf,wx(117.48),PY-7,wx(117.669)-wx(117.48),14,'fill:var(--mom)',{rx:3});H.txt(cf,(wx(117.48)+wx(117.669))/2,PY+24,'CFTR','lb',{'text-anchor':'middle',st:'font-size:12px'});hid(cf);
  // sequence
  const SY=284;const sq=H.g(s);H.txt(sq,330,SY-40,'SEQUENCE · CFTR EXON 11','cap',{'text-anchor':'middle'});DL(sq,wx(117.48),PY+8,100,SY-24,'stroke:var(--muted);stroke-width:1.1;stroke-dasharray:4 4');DL(sq,wx(117.669),PY+8,560,SY-24,'stroke:var(--muted);stroke-width:1.1;stroke-dasharray:4 4');
  const N='ATCATCTTTGGTGTT',cx=150,cw=22;const lets=[...N].map((c,i)=>H.txt(sq,cx+i*cw+(Math.floor(i/3))*8,SY,c,'lb',{'text-anchor':'middle',st:MONO+';font-size:18px'+(i>=5&&i<=7?';fill:var(--bad)':'')}));
  const aa=['Ile','Ile','Phe','Gly','Val'].map((a,i)=>H.txt(sq,cx+(i*3+1)*cw+i*8,SY+24,a,'lbs',{'text-anchor':'middle',st:'fill:var(--ink)'}));
  const num=H.txt(sq,cx+(2*3+1)*cw+2*8,SY+40,'508','lbs',{'text-anchor':'middle',st:'font-size:10.5px'});
  const res=H.txt(sq,320,SY+68,'F508del: CTT deleted → phenylalanine 508 missing','lb',{'text-anchor':'middle',st:'font-size:13.5px;fill:var(--bad)'});hid(res);hid(sq);
  const today=H.g(s);chip(today,140,392,'map position',{fs:12.5,w:130});chip(today,320,392,'reference sequence',{fs:12.5,w:160});chip(today,500,392,'genes in the region',{fs:12.5,w:160});
  mkA(today,207,392,238,392,{w:1.6,h:6});mkA(today,402,392,418,392,{w:1.6,h:6});hid(today);
  return [
    ()=>{},
    ()=>{H.O(mm,1);H.O(gq,1,{at:500})},
    ()=>{H.O(pl,1);show([...pl.querySelectorAll('path')].filter(e=>e.dz),{d:700});cl.forEach((c,i)=>H.O(c,1,{d:250,at:600+i*260}));H.O(cf,1,{at:600+steps*260})},
    ()=>{H.O(sq,1);show([...sq.querySelectorAll('path')].filter(e=>e.dz),{d:700});H.after(1200,inst=>{
        [5,6,7].forEach(i=>{H.T(lets[i],{y:40},{d:inst?0:700});H.O(lets[i],0,{d:inst?0:700})});
        lets.forEach((l,i)=>{if(i>7)H.T(l,{x:((i-3)*cw+Math.floor((i-3)/3)*8)-(i*cw+Math.floor(i/3)*8)},{d:inst?0:900,at:inst?0:600})});
        // codon 507 becomes ATT, Phe disappears
        H.O(aa[2],0,{d:inst?0:500});H.O(num,0,{d:inst?0:500});[3,4].forEach(i=>H.T(aa[i],{x:-3*cw-8},{d:inst?0:900,at:inst?0:600}));H.O(res,1,{at:inst?0:1200})})},
    ()=>{H.O(today,1);today.querySelectorAll('g').forEach(a=>{if(a.childNodes.length===2&&a.firstChild.getAttribute('pathLength'))drawA(a,{at:300})})},
  ];}},

/* 24 ─────────────────────────────── */
{sec:'12.5',title:'Three Maps Compared',wide:true,steps:2,
text:`<div class="tblwrap" data-step="0"><table class="tbl">
<thead><tr><th></th><th>Genetic map</th><th>Cytogenetic map</th><th>Physical map</th></tr></thead>
<tbody>
<tr><td>Measures</td><td>how often crossovers separate two loci</td><td>dark and light bands on stained metaphase chromosomes</td><td>the amount of DNA between two points</td></tr>
<tr><td>Unit</td><td>centimorgan (cM) = map unit; 1 cM = 1% recombination</td><td>band name, such as 7q31.2</td><td>base pairs: bp, kb (1,000 bp), Mb (1,000,000 bp)</td></tr>
<tr><td>Made by</td><td>crosses or family studies that count recombinant offspring</td><td>G-banding, karyograms, FISH</td><td>restriction maps, clone contigs, DNA sequencing</td></tr>
</tbody><tbody data-step="1">
<tr><td>Detail</td><td>limited by the number of offspring; about 1 Mb per cM in humans</td><td>one band holds millions of base pairs</td><td>down to one base pair (the sequence)</td></tr>
<tr><td>Spacing</td><td>stretched at hot spots, squeezed where crossovers are rare</td><td>approximate: bands differ in how much they condense</td><td>true distance along the DNA</td></tr>
<tr><td>CFTR</td><td>about 130 cM</td><td>7q31.2</td><td>bp 117,480,025 to 117,668,665</td></tr>
</tbody></table></div>`,
star:'All three agree on the order. Only the physical map gives true distances.',starStep:1},

/* 25 ─────────────────────────────── */
{sec:'12.5',title:'Summary',wide:true,steps:1,
text:`<div class="cols" data-step="0"><div><ul>
<li>There are three kinds of chromosome map: <b>genetic</b> (recombination), <b>cytogenetic</b> (bands on metaphase chromosomes) and <b>physical</b> (base pairs). They agree on the order of genes, but not on the spacing.</li>
<li>Recombination frequency is roughly proportional to the distance between loci, so recombination frequencies build genetic maps: 1% recombination = 1 cM.</li>
<li>Crossovers are rare near centromeres and frequent at hot spots, so cM and bp do not match exactly.</li>
<li>The number of copies of a gene in the nucleus follows its chromosome. An autosomal gene has 2 copies. For X and Y genes, the number differs between the sexes. A mitochondrial gene usually has one allele in everyone.</li>
</ul></div><div><ul>
<li>Length, centromere position (metacentric, submetacentric, acrocentric, telocentric) and band pattern identify each chromosome. A band name such as 7q31.2 is an address.</li>
<li>FISH places a cloned DNA piece on a band and finds deletions too small for banding.</li>
<li>Scientists make a restriction map of single clones and join the clones into a contig, which can cover a whole chromosome.</li>
<li>The ultimate physical map is the DNA sequence of the whole chromosome or genome. The first gap-free human sequence appeared in 2022.</li>
</ul></div></div>`},

/* 26 ─────────────────────────────── */
{sec:'12.6',title:'Key Terms',wide:true,steps:1,
text:`<div class="terms" data-step="0">
<div class="term"><b>Genetic map</b>A map of loci on a chromosome, ordered and spaced by recombination frequency.</div>
<div class="term"><b>Recombination frequency</b>The percentage of gametes (or offspring) that carry a recombinant combination of alleles.</div>
<div class="term"><b>Map unit (m.u.)</b>The unit of a genetic map. 1 m.u. = 1% recombination frequency.</div>
<div class="term"><b>Centimorgan (cM)</b>Another name for the map unit, after Thomas Hunt Morgan. 1 cM = 1% recombination.</div>
<div class="term"><b>Cytogenetic map</b>A map of the dark and light bands of stained metaphase chromosomes.</div>
<div class="term"><b>Karyogram</b>A picture of the chromosomes of one cell, sorted into pairs in a standard order.</div>
<div class="term"><b>Karyotype</b>The complete set of chromosomes of an individual, for example 46,XY.</div>
<div class="term"><b>Physical map</b>A map that gives distances in base pairs. The ultimate physical map is the DNA sequence.</div>
<div class="term"><b>Restriction map</b>A map of the positions of restriction-enzyme sites on a DNA molecule.</div>
<div class="term"><b>Contig</b>A set of overlapping clones (or reads) that covers a region without gaps.</div>
<div class="term"><b>Contig construction</b>The process that puts clones in order by their overlaps, until they cover a region.</div>
<div class="term"><b>Map-based cloning</b>A method that finds and isolates a gene from its map position (positional cloning).</div>
<div class="term"><b>Molecular location</b>The start and end of a gene, in base pairs, on its chromosome.</div>
<div class="term"><b>BAC</b>Bacterial artificial chromosome: a vector that carries about 100–200 kb of DNA in bacteria.</div>
<div class="term"><b>FISH</b>A method in which a fluorescent DNA probe pairs with its matching sequence on a chromosome and shows its band.</div>
<div class="term"><b>Conserved synteny</b>The same genes on one chromosome in two species.</div>
<div class="term"><b>Marker (SNP, microsatellite)</b>A DNA site that differs between people. Geneticists follow it in families.</div>
<div class="term"><b>Crossover hot spot</b>A short DNA region where crossovers happen much more often than elsewhere.</div>
</div>`},

/* 27 ─────────────────────────────── */
{sec:'12.7–12.8',title:'Check Your Understanding (1)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa" style="grid-column:1/-1"><div class="q">1. Three linked loci are in the order B–C–A. The A–B distance is 1 cM and the B–C distance is 0.6 cM. A geneticist crosses the trihybrid <i>AaBbCc</i> (heterozygous at all three loci; one of its parents was <i>AABBCC</i>) with <i>aabbcc</i>. What is the frequency of <i>Aabb</i> offspring?</div><button>Show answer</button><div class="a" hidden><b>0.5%.</b> The <i>aabbcc</i> parent gives only <i>abc</i> gametes, so each child shows the alleles of one gamete from the trihybrid. The trihybrid got <i>B C A</i> from its <i>AABBCC</i> parent and <i>b c a</i> from the other parent. An <i>Aabb</i> child needs a gamete with <i>A</i> and <i>b</i>: a recombinant between B and A.<br>C lies between B and A, so C–A = 1 − 0.6 = 0.4 cM. A crossover between B and C (0.6% of gametes) gives <i>b C A</i> in half of them: 0.3% (<i>Aa bb Cc</i>). A crossover between C and A (0.4%) gives <i>b c A</i> in half: 0.2% (<i>Aa bb cc</i>). Total: 0.3% + 0.2% = 0.5%, about 1 child in 200.<br>Shortcut: A–B = 1 cM means 1% recombinant gametes, half <i>Ab</i> and half <i>aB</i>, so <i>Ab</i> = 0.5%.</div></div>
<div class="qa" style="grid-column:1/-1"><div class="q">2. A scientist cut lambda DNA (48.5 kb, linear) with ApaI (A), NarI (N), KpnI (K) and CvnI (C), alone and in pairs. Fragments (kb): A 38.4, 10.0 · N 45.7, 2.8 · A/N 35.7, 10.0, 2.8 · K 29.9, 17.0, 1.5 · K/A 29.9, 10.0, 7.0, 1.5 · C 26.7, 14.2, 7.6 · C/K 17.0, 14.2, 8.2, 7.6, 1.5 · C/N 26.7, 11.4, 7.6, 2.8. Draw the map.</div><button>Show answer</button><div class="a" hidden>1. A gives 2 pieces, so 1 site; call its end "left": <b>A at 10.0</b>.<br>2. N: 1 site, 2.8 kb from an end. A/N splits the 38.4 piece into 35.7 + 2.8, so <b>N at 45.7</b>.<br>3. K: 3 pieces, 2 sites. K/A splits the 17.0 piece into 10.0 + 7.0. So the 17.0 piece is at the left end: <b>K at 17.0</b>. The 1.5 piece can sit next to it or at the right end.<br>4. C: 2 sites. C/K splits the 26.7 piece into 17.0 + 1.5 + 8.2, so the 26.7 piece holds both K sites. So the 1.5 piece is next to the 17.0 piece: <b>K at 18.5</b>. The 26.7 piece is at the left end: <b>C at 26.7</b>.<br>5. C/N splits the 14.2 piece into 11.4 + 2.8. So the 14.2 piece is at the right end, and the 7.6 piece is in the middle: <b>C at 34.3</b>.<br>Map (kb from the left end): 0 · A 10.0 · K 17.0 · K 18.5 · C 26.7 · C 34.3 · N 45.7 · 48.5. The mirror image fits the gel equally well. The sizes are rounded to 0.1 kb, so sums can differ by 0.1.</div></div>
</div>`},

/* 28 ─────────────────────────────── */
{sec:'12.7–12.8',title:'Check Your Understanding (2)',wide:true,steps:1,
text:`<div class="grid2" data-step="0">
<div class="qa"><div class="q">3. Decode the band address 13q14.3.</div><button>Show answer</button><div class="a" hidden>Chromosome 13, long arm (q), region 1, band 4, sub-band 3. Say it "thirteen q one four point three".</div></div>
<div class="qa"><div class="q">4. A man's skin cell is in G1. How many copies of LCT, F8 and SRY does it have? How many after S phase?</div><button>Show answer</button><div class="a" hidden>G1: LCT 2 (chromosome 2 pair), F8 1 (one X), SRY 1 (one Y). After S phase each chromosome has two identical sister chromatids, so the copies double: LCT 4, F8 2, SRY 2. The alleles stay the same: 2, 1 and 1.</div></div>
<div class="qa"><div class="q">5. About 4 Mb of DNA around the centromere of chromosome 7 measures almost 0 cM. Explain.</div><button>Show answer</button><div class="a" hidden>cM counts crossovers, not DNA. Almost no crossovers happen in the tightly packed DNA around the centromere. So loci on the two sides almost never recombine. Their recombination frequency is near 0%, so the genetic distance is near 0 cM. The physical distance is still 4 Mb.</div></div>
<div class="qa"><div class="q">6. Why does FISH detect 22q11.2 deletion syndrome when a banded karyogram usually does not?</div><button>Show answer</button><div class="a" hidden>The deletion is about 3 Mb, smaller than most bands, so the banding pattern looks normal. A FISH probe pairs with one exact sequence inside the deleted region. The chromosome 22 that lacks the region shows no spot, so the cell has one red spot instead of two.</div></div>
</div>`},

]});

/* ---- restriction-mapping scene shared by the two lambda slides ---- */
function lambdaScene(H,c){const s=stage();const L=48.5;
  const gx0=14,gy0=58,gh=330,lw=34;const lanes=['M',...c.lanes];const LX=i=>gx0+28+i*lw;const gw=LX(lanes.length-1)+24-gx0;
  const yOf=kb=>gy0+22+(Math.log10(50)-Math.log10(kb))/(Math.log10(50)-Math.log10(1.2))*(gh-40);
  const gel=H.g(s);R(gel,gx0,gy0,gw,gh,'fill:var(--wash);stroke:var(--ink);stroke-width:1.5',{rx:6});
  lanes.forEach((l,i)=>{R(gel,LX(i)-12,gy0+6,24,7,'fill:var(--card);stroke:var(--ink);stroke-width:1.1');H.txt(gel,LX(i),gy0-8,l,'lb',{'text-anchor':'middle',st:'font-size:12px'})});
  [48.5,30,20,15,10,7,5,3,2].forEach(k=>R(gel,LX(0)-11,yOf(k)-2,22,4,'fill:var(--ink)',{rx:1}));
  const MX0=gx0+gw+52,MX1=624,mx=kb=>MX0+(MX1-MX0)*kb/L;
  const nr=c.rows.length;const rowY=i=>70+i*(c.final!=null?62:56);
  const laneBands=c.rows.map((r,ri)=>{const ys=r[1].map(yOf);return r[1].map((kb,k)=>{const b=H.g(s);const y=yOf(kb);const close=ys.some((v,j)=>j!==k&&v<y&&y-v<17);R(b,LX(ri+1)-12,y-3,24,6,'fill:var(--mom)',{rx:1.5});H.txt(b,LX(ri+1),close?y+13:y-6,kb.toFixed(1),'lbs',{'text-anchor':'middle',st:'font-size:9.5px;fill:var(--ink);font-weight:700'});hid(b);return b})});
  // order of fragments on the map (left to right) = order given
  const rows=c.rows.map((r,ri)=>{const G=H.g(s);const y=rowY(ri);H.txt(G,MX0-10,y+5,r[0],'lb',{'text-anchor':'end',st:'font-size:13px'});hid(G);
    let acc=0;const fr=r[1].map((kb,k)=>{const a=acc;acc+=kb;const F=H.g(s);const w=mx(kb)-mx(0);
      const un=(c.unsure||[]).some(([a,b])=>a===ri&&b===k);
      R(F,0,-6,w,12,`fill:var(--${k%2?'mom':'dad'}-tint);stroke:var(--ink);stroke-width:1.2${un?';stroke-dasharray:3 2':''}`,{rx:2});
      H.txt(F,w/2,-10,kb.toFixed(1)+(un?'?':''),'lbs',{'text-anchor':'middle',st:'font-size:10px;fill:var(--ink);font-weight:700'});
      F.fin=[mx(a),y];F.src=[LX(ri+1)-12,yOf(kb)];F.w=w;H.T(F,{x:F.src[0],y:F.src[1],sx:24/w},{d:0});hid(F);return F});G.fr=fr;return G});
  const MY=c.final!=null?rowY(nr)+30:rowY(nr)+20;const map=H.g(s);
  H.txt(map,MX0-10,MY+5,'map','lb',{'text-anchor':'end',st:'font-size:13px;fill:var(--mom)'});Ln(map,mx(0),MY,mx(L),MY,'stroke:var(--ink);stroke-width:3');
  [0,10,20,30,40,48.5].forEach(k=>{Ln(map,mx(k),MY+3,mx(k),MY+8,'stroke:var(--ink);stroke-width:1.2');H.txt(map,mx(k),MY+21,k===48.5?'48.5':k,'lbs',{'text-anchor':'middle',st:'font-size:10px'})});
  H.txt(map,mx(L),MY+36,'kb','lbs',{'text-anchor':'end',st:'font-size:10px'});
  const site=(l,kb,pre)=>{const G=H.g(map);Ln(G,mx(kb),MY-12,mx(kb),MY+2,'stroke:var(--mom);stroke-width:2.5');const t=H.txt(G,mx(kb),MY-16,l,'lb',{'text-anchor':'middle',st:'font-size:12px'});if(!pre)hid(G);return G};
  (c.pre||[]).forEach(([l,kb])=>site(l,kb,true));
  const sites=c.sites.map(ss=>ss.map(([l,kb])=>site(l,kb)));
  let fullT=null,mir=null;
  if(c.final!=null){fullT=H.g(s);H.txt(fullT,(mx(0)+mx(L))/2,MY+58,'A 10.0 · K 17.0 · K 18.5 · C 26.7 · C 34.3 · N 45.7','lb',{'text-anchor':'middle',st:'font-size:12.5px'});hid(fullT);}
  if(c.mirror!=null){mir=H.g(s);const y2=MY+92;H.txt(mir,MX0-10,y2+5,'mirror','lbs',{'text-anchor':'end',st:'font-size:11.5px;fill:var(--ink)'});Ln(mir,mx(0),y2,mx(L),y2,'stroke:var(--muted);stroke-width:2.5;stroke-dasharray:5 4');
    [['A',10],['K',17],['K',18.5],['C',26.7],['C',34.3],['N',45.7]].forEach(([l,kb])=>{Ln(mir,mx(L-kb),y2-10,mx(L-kb),y2+2,'stroke:var(--muted);stroke-width:2');H.txt(mir,mx(L-kb),y2-14,l,'lbs',{'text-anchor':'middle',st:'font-size:11px;font-weight:700'})});hid(mir);}
  const play=(ri,at)=>{laneBands[ri].forEach(b=>H.O(b,1,{d:300,at}));const G=rows[ri];H.O(G,1,{d:300,at});
    G.fr.forEach((F,k)=>{H.O(F,1,{d:200,at:at+300});H.T(F,{x:F.fin[0],y:F.fin[1],sx:1},{d:1100,at:at+400+k*120})})};
  return c.steps.map((st,si)=>()=>{st.forEach((ri,k)=>play(ri,k*1500));sites[si].forEach(G=>H.O(G,1,{at:st.length*1500+200}));
    if(si===c.final&&fullT)H.O(fullT,1);if(si===c.mirror&&mir)H.O(mir,1)});}
})();
