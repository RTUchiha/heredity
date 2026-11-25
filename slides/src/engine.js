/* Heredity slide engine: step-driven SVG animation (3b1b-style builds) + STE text reveal.
   Each slide: { sec, title, text (HTML with data-step), caption, wide, scene(L) -> [step0, step1, ...] }
   step k is applied with CSS transitions when you advance; jumps re-apply all earlier steps instantly. */
(function(){
const NS='http://www.w3.org/2000/svg';
const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;
let INSTANT=false, rafs=new Set(), timers=new Set();
const C=n=>n&&n.startsWith('#')?n:`var(--${n})`;

/* ---------- primitives ---------- */
function E(tag,a,parent){const e=document.createElementNS(NS,tag);
  if(a)for(const k in a){const v=a[k];if(v==null)continue;
    if(k==='text')e.textContent=v;else if(k==='cls')e.setAttribute('class',v);
    else if(k==='st')e.setAttribute('style',v);else e.setAttribute(k,v);}
  if(parent)parent.appendChild(e);return e;}
function tim(e,o){o=o||{};e.style.transitionDuration=(o.d!=null?o.d:900)+'ms';e.style.transitionDelay=(o.at||0)+'ms';
  if(o.ease)e.style.transitionTimingFunction=o.ease;}
/* transform tween: x,y,r,s|sx,sy */
function T(e,p,o){const t=e._t||(e._t={x:0,y:0,r:0,sx:1,sy:1});const q=Object.assign({},p);
  if(q.s!=null){t.sx=t.sy=q.s;delete q.s}Object.assign(t,q);tim(e,o);
  e.style.transform=`translate(${t.x}px,${t.y}px) rotate(${t.r}deg) scale(${t.sx},${t.sy})`;return e;}
function O(e,v,o){if(Array.isArray(e)){e.forEach(x=>O(x,v,o));return e}tim(e,Object.assign({d:500},o));e.style.opacity=v;return e;}
/* draw-on: element must have pathLength=1 and class "draw" */
function D(e,f,o){if(Array.isArray(e)){e.forEach(x=>D(x,f,o));return e}tim(e,Object.assign({d:1100},o));e.style.strokeDashoffset=1-(f==null?1:f);return e;}
function K(e,c,o){tim(e,Object.assign({d:600},o));if(c.stroke)e.style.stroke=C(c.stroke);if(c.fill)e.style.fill=C(c.fill);return e;}
function after(ms,fn){if(INSTANT){fn(true);return}const id=setTimeout(()=>{timers.delete(id);fn(false)},ms);timers.add(id);}
function count(node,from,to,o){o=o||{};const fmt=o.fmt||(v=>Math.round(v).toLocaleString('en-US'));
  if(INSTANT||REDUCE){node.textContent=fmt(to);return}
  const d=o.d||900,t0=performance.now()+(o.at||0);
  const f=now=>{const u=Math.min(1,Math.max(0,(now-t0)/d));const s=u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
    node.textContent=fmt(from+(to-from)*s);if(u<1){const id=requestAnimationFrame(f);rafs.add(id)}};
  const id=requestAnimationFrame(f);rafs.add(id);
  const tid=setTimeout(()=>{timers.delete(tid);node.textContent=fmt(to)},(o.at||0)+d+80);timers.add(tid);}
function loop(fn){if(REDUCE)return;const t0=performance.now();const f=now=>{fn((now-t0)/1000);const id=requestAnimationFrame(f);rafs.add(id)};const id=requestAnimationFrame(f);rafs.add(id);}
function txt(p,x,y,s,cls,a){return E('text',Object.assign({x,y,cls:cls||'lb',text:s},a||{}),p)}
function g(p,a){return E('g',a,p)}

/* ---------- biology components ---------- */
/* chromatid: unit-bulge arc x=(1-(y/L)^2), scaled by sx=bulge; tips = [{from,color}] colour overlays toward the q-arm end */
function arcPts(L1,L2,y0,y1){const pts=[];const n=28;for(let i=0;i<=n;i++){const y=y0+(y1-y0)*i/n;const L=y<0?L1:L2;const x=1-(y/L)*(y/L);pts.push((Math.abs(x)<1e-6?0:x).toFixed(4)+','+y.toFixed(2))}return 'M'+pts.join(' L')}
function chromatid(p,o){const G=g(p);const w=o.w||7;
  G.body=E('path',{d:arcPts(o.L1,o.L2,-o.L1,o.L2),cls:'nss',st:`fill:none;stroke:${C(o.color)};stroke-width:${w};stroke-linecap:round;stroke-linejoin:round`},G);
  G.tips=(o.tips||[]).map(t=>E('path',{d:t.from<0?arcPts(o.L1,o.L2,-o.L1,t.from):arcPts(o.L1,o.L2,t.from,o.L2),cls:'nss',
    st:`fill:none;stroke:${C(t.color)};stroke-width:${w};stroke-linecap:round;opacity:${t.show?1:0}`},G));
  return G;}
/* chromosome: two sister chromatids + centromere dots. state via setChr */
function chromosome(p,o){o=Object.assign({L1:26,L2:26,w:7,color:'dad'},o);const G=g(p,{cls:'chr'});
  G.o=o;G.a=chromatid(G,Object.assign({},o,{tips:o.tipsA}));G.b=chromatid(G,Object.assign({},o,{tips:o.tipsB}));
  G.ca=E('circle',{r:o.w*0.55,cls:'kf'},G);G.cb=E('circle',{r:o.w*0.55,cls:'kf'},G);
  setChr(G,o.state||'x',{d:0});if(o.x!=null||o.y!=null)T(G,{x:o.x||0,y:o.y||0,r:o.r||0,s:o.s||1},{d:0});return G;}
/* states: single (unreplicated bar), x (replicated X), apart:{D} sisters pulled distance D each way (V shapes) */
function setChr(G,st,o){o=o||{};let a,b;const GAP=G.o.w*1.3,BUL=G.o.w*.93;
  if(st==='single'){a={x:0,sx:.001};b={x:0,sx:.001}}
  else if(st==='x'){a={x:-GAP,sx:BUL};b={x:GAP,sx:-BUL}}
  else if(st==='open'){a={x:-GAP-4,sx:2};b={x:GAP+4,sx:-2}}
  else if(st==='apart'){const D=o.D||40;a={x:-GAP-D,sx:-BUL*1.4};b={x:GAP+D,sx:BUL*1.4}}
  T(G.a,a,o);T(G.b,b,o);T(G.ca,{x:a.x+a.sx},o);T(G.cb,{x:b.x+b.sx},o);
  if(st==='single'){O(G.b,0,{d:o.d!=null?o.d:300});O(G.cb,0,{d:0})}else{O(G.b,1,{d:200,at:o.at});O(G.cb,1,{d:200,at:o.at})}
  return G;}
/* cell with cytokinesis: union of two circles (stroke layer under fill layer) */
function cell(p,o){o=Object.assign({r:150,w:2.5},o);const G=g(p);T(G,{x:o.x,y:o.y},{d:0});
  const sk=g(G),fl=g(G);G.parts=[];
  for(let i=0;i<2;i++){const s=E('circle',{r:o.r,st:`fill:none;stroke:var(--ink);stroke-width:${o.w*2}`},sk);
    const f=E('circle',{r:o.r,cls:'cellfill'},fl);G.parts.push([s,f]);}
  G.inner=g(G);G.r=o.r;return G;}
function cleave(G,dx,k,o){G.parts[0].forEach(e=>T(e,{x:-dx,s:k},o));G.parts[1].forEach(e=>T(e,{x:dx,s:k},o));}
/* nuclear envelope */
function nucleus(p,x,y,r){const n=E('circle',{cx:0,cy:0,r,cls:'k',st:'stroke-width:2;stroke-dasharray:7 5'},p);T(n,{x,y},{d:0});return n;}
/* microtubule fibre from P towards Q, retargetable */
function fibre(p,P,Q,o){o=o||{};const G=g(p);const ln=E('line',{x1:0,y1:0,x2:1,y2:0,cls:'k nss',st:`stroke-width:${o.w||1.4};opacity:.75`},G);
  G.P=P;fibreTo(G,Q,{d:0});T(G,{x:P[0],y:P[1]},{d:0});G.ln=ln;return G;}
function fibreTo(G,Q,o){const dx=Q[0]-G.P[0],dy=Q[1]-G.P[1];T(G,{r:Math.atan2(dy,dx)*180/Math.PI,sx:Math.max(.001,Math.hypot(dx,dy)),sy:1},o);}
/* centrosome: pair of centrioles */
function centrosome(p,x,y){const G=g(p);E('rect',{x:-6,y:-2.5,width:12,height:5,rx:2,cls:'kf'},G);E('rect',{x:-2.5,y:-6,width:5,height:12,rx:2,cls:'kf',st:'opacity:.55'},G);T(G,{x,y},{d:0});return G;}
/* interphase chromatin squiggle */
function squiggle(p,x,y,len,color,seed){let s=seed||1;const rnd=()=>{s=(s*9301+49297)%233280;return s/233280};
  let d=`M${x},${y}`;let cx=x,cy=y;for(let i=0;i<len;i++){const nx=cx+(rnd()-.5)*26,ny=cy+(rnd()-.5)*26;d+=` Q${(cx+nx)/2+(rnd()-.5)*18},${(cy+ny)/2+(rnd()-.5)*18} ${nx},${ny}`;cx=nx;cy=ny}
  return E('path',{d,pathLength:1,cls:'draw',st:`fill:none;stroke:${C(color)};stroke-width:3;stroke-linecap:round`},p);}
function arrow(p,x1,y1,x2,y2,o){o=o||{};const G=g(p);const a=Math.atan2(y2-y1,x2-x1),h=o.h||9;
  E('path',{d:`M${x1},${y1} L${x2},${y2}`,pathLength:1,cls:'draw k',st:`stroke-width:${o.w||2};stroke:${C(o.color||'ink')}`},G);
  E('path',{d:`M${x2-h*Math.cos(a-.45)},${y2-h*Math.sin(a-.45)} L${x2},${y2} L${x2-h*Math.cos(a+.45)},${y2-h*Math.sin(a+.45)}`,cls:'k',st:`stroke-width:${o.w||2};stroke:${C(o.color||'ink')};stroke-linecap:round;stroke-linejoin:round`},G);
  return G;}
/* arc path on circle (degrees, 0 = up, clockwise) */
function arcD(cx,cy,r,a0,a1){const P=a=>[cx+r*Math.sin(a*Math.PI/180),cy-r*Math.cos(a*Math.PI/180)];const [x0,y0]=P(a0),[x1,y1]=P(a1);
  return `M${x0},${y0} A${r},${r} 0 ${a1-a0>180?1:0} 1 ${x1},${y1}`;}
function sectorD(cx,cy,r0,r1,a0,a1){const P=(r,a)=>[cx+r*Math.sin(a*Math.PI/180),cy-r*Math.cos(a*Math.PI/180)];const L=a1-a0>180?1:0;
  const [a,b]=P(r1,a0),[c,d]=P(r1,a1),[e,f]=P(r0,a1),[h,i]=P(r0,a0);return `M${a},${b} A${r1},${r1} 0 ${L} 1 ${c},${d} L${e},${f} A${r0},${r0} 0 ${L} 0 ${h},${i} Z`;}

const L={E,T,O,D,K,g,txt,after,count,loop,chromatid,chromosome,setChr,cell,cleave,nucleus,fibre,fibreTo,centrosome,squiggle,arrow,arcD,sectorD,C,
  get instant(){return INSTANT}};
window.HL=L;

/* ---------- deck runtime ---------- */
window.deck=function(cfg){
  const S=cfg.slides;document.title=cfg.docTitle||cfg.title;
  const root=document.getElementById('deck');
  root.innerHTML=`<header class="hd"><div><div class="eyebrow">${cfg.eyebrow}</div><h1 id="ttl"></h1></div>
   <div class="hd-r"><div class="sec" id="sec"></div><div class="tile" aria-label="Chapter ${cfg.chapter}">${cfg.chapter}</div></div></header>
   <section class="body" id="body"><figure class="fig" id="fig" tabindex="0" aria-label="Animated figure. Select to play the next step."><svg class="stage" id="stage" viewBox="0 0 640 420" preserveAspectRatio="xMidYMid meet" role="img"></svg><figcaption><span id="cap"></span><span class="hint" id="hint"></span></figcaption></figure>
   <article class="txt" id="txt" aria-live="polite"></article></section>
   <footer class="ft"><div class="nav"><button class="btn" id="prev" aria-label="Back">&#8592;</button><button class="btn" id="next" aria-label="Next">Next &#8594;</button></div>
   <div class="prog"><div class="bar" id="bar"></div><div class="steps" id="steps"></div></div>
   <div class="nav"><span class="keys">&#8592; &#8594; or space · click the figure</span><button class="btn" id="all" aria-pressed="false" title="Show every step of this slide">Show all</button></div></footer>`;
  const $=id=>document.getElementById(id);const stage=$('stage');
  S.forEach((s,i)=>{const b=document.createElement('i');b.title=`${i+1}. ${s.title}`;b.onclick=()=>go(i,0);$('bar').appendChild(b)});
  let cur={i:-1,k:-1},steps=[],showAll=false;
  function clear(){rafs.forEach(cancelAnimationFrame);rafs.clear();timers.forEach(clearTimeout);timers.clear();stage.innerHTML='';}
  function mount(i){clear();const s=S[i];
    $('ttl').textContent=s.title;$('sec').innerHTML=`<b>Slide ${i+1}</b><span> of ${S.length}</span>`;
    $('body').className='body'+(s.wide?' wide':'');$('fig').hidden=!!s.wide;
    $('txt').innerHTML=s.text+(s.star?`<p class="star" data-step="${s.starStep!=null?s.starStep:0}">${s.star}</p>`:'');
    $('cap').textContent=s.caption||'';
    INSTANT=true;stage.classList.add('instant');steps=s.scene?s.scene(L,stage)||[]:Array.from({length:s.steps||1},()=>()=>{});INSTANT=false;
    $('txt').querySelectorAll('.qa button').forEach(b=>b.onclick=e=>{e.stopPropagation();const a=b.nextElementSibling;a.hidden=!a.hidden;b.textContent=a.hidden?'Show answer':'Hide answer'});
    $('txt').scrollTop=0;}
  function apply(k,animLast){
    INSTANT=true;stage.classList.add('instant');
    for(let j=0;j<=k;j++){if(j===k&&animLast&&!REDUCE){break}steps[j]&&steps[j]()}
    stage.getBoundingClientRect();stage.classList.remove('instant');INSTANT=false;
    if(animLast&&!REDUCE&&steps[k])steps[k]();}
  function ui(){const s=S[cur.i],n=steps.length;
    $('txt').querySelectorAll('[data-step]').forEach(p=>p.classList.toggle('off',+p.dataset.step>cur.k));
    $('bar').querySelectorAll('i').forEach((b,j)=>{b.className=j<cur.i?'done':j===cur.i?'now':''});
    $('steps').innerHTML=n>1?Array.from({length:n},(_,j)=>`<i class="${j<=cur.k?'on':''}"></i>`).join('')+`<span>&nbsp;step ${cur.k+1} of ${n}</span>`:'';
    $('hint').textContent=s.wide?'':(cur.k<n-1?'Select the figure for the next step':'');
    $('prev').disabled=cur.i===0&&cur.k===0;$('next').disabled=cur.i===S.length-1&&cur.k===n-1;
    $('all').setAttribute('aria-pressed',showAll);
    try{history.replaceState(null,'',`#${cur.i+1}.${cur.k+1}`)}catch(e){}}
  function go(i,k,anim){i=Math.max(0,Math.min(S.length-1,i));
    const fwdStep=(i===cur.i&&k===cur.k+1&&anim);
    if(i!==cur.i||!fwdStep){mount(i);steps.length;k=Math.max(0,Math.min(steps.length-1,k));cur={i,k};apply(k,!!anim);}
    else{cur.k=k;steps[k]();}
    ui();}
  function next(){if(showAll){if(cur.i<S.length-1){go(cur.i+1,0,true);finishAll()}return}
    if(cur.k<steps.length-1)go(cur.i,cur.k+1,true);else if(cur.i<S.length-1)go(cur.i+1,0,true);}
  function prev(){if(showAll){if(cur.i>0){go(cur.i-1,0);finishAll()}return}
    if(cur.k>0)go(cur.i,cur.k-1);else if(cur.i>0){go(cur.i-1,999)}}
  function finishAll(){go(cur.i,steps.length-1)}
  $('next').onclick=next;$('prev').onclick=prev;
  $('fig').onclick=()=>next();$('fig').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();next()}};
  $('all').onclick=()=>{showAll=!showAll;if(showAll)finishAll();else ui();ui()};
  addEventListener('keydown',e=>{if(e.metaKey||e.ctrlKey||e.altKey)return;
    if(['ArrowRight',' ','PageDown','ArrowDown'].includes(e.key)){e.preventDefault();next()}
    else if(['ArrowLeft','PageUp','ArrowUp'].includes(e.key)){e.preventDefault();prev()}
    else if(e.key==='Home')go(0,0);else if(e.key==='End')go(S.length-1,0);
    else if(e.key==='a'||e.key==='A')$('all').click();});
  let sx=null;root.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  root.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>60){dx<0?next():prev()}sx=null});
  const m=/^#(\d+)\.(\d+)$/.exec(location.hash);go(m?+m[1]-1:0,m?+m[2]-1:0,!m);
};
})();
