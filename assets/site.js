
(()=>{
const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.worm').forEach(w=>{
  const pts=JSON.parse(w.querySelector('.worm-data').textContent),line=w.querySelector('.line'),ball=w.querySelector('.ball'),
    who=w.querySelector('.who'),num=w.querySelector('.num'),over=w.querySelector('.over'),wk=[...w.querySelectorAll('.wk')],A=w.dataset.a,B=w.dataset.b,
    bat={1:w.dataset.bat1,2:w.dataset.bat2},tip=w.querySelector('.tip'),plot=w.querySelector('.plot');
  // show(i): the chart as it stood at ball i. scrub=true (the reader is pointing at it) keeps the whole line and adds the tooltip.
  const show=(i,scrub)=>{const [x,y,p,inn,b,r,k]=pts[i],lead=(p>=50?A:B),pc=Math.max(p,100-p)+'%',sc=bat[inn]+' '+r+'/'+k,
      ov=(inn==1?'1st':'2nd')+' innings, over '+Math.floor(b/6)+'.'+(b%6);
    line.style.clipPath=scrub?'none':'inset(0 '+(100-x)+'% 0 0)';ball.style.left=x+'%';ball.style.top=y+'%';
    who.textContent=lead;num.textContent=pc;over.textContent=sc+', '+ov;
    wk.forEach(e=>e.classList.toggle('on',scrub||+e.dataset.x<=x));
    tip.hidden=!scrub;
    if(scrub){tip.textContent='';[[lead+' '+pc,'b'],[sc,'span'],[ov+' (ball '+b+')','span']].forEach(([t,tag])=>{const d=document.createElement(tag);d.textContent=t;tip.appendChild(d);});
      tip.style.left=x+'%';tip.style.top=y+'%';tip.dataset.side=x<24?'l':x>76?'r':'c';tip.dataset.v=y<42?'below':'above';}};
  let raf;
  const play=()=>{cancelAnimationFrame(raf);w.classList.add('js');const t0=performance.now(),D=8000;
    const step=t=>{const k=Math.min(1,(t-t0)/D);show(Math.round(k*(pts.length-1)));if(k<1)raf=requestAnimationFrame(step);};raf=requestAnimationFrame(step);};
  const point=e=>{cancelAnimationFrame(raf);w.classList.add('js');const r=plot.getBoundingClientRect(),x=100*(e.clientX-r.left)/r.width;
    let best=0;pts.forEach((p,i)=>{if(Math.abs(p[0]-x)<Math.abs(pts[best][0]-x))best=i;});show(best,true);};
  plot.addEventListener('pointermove',point);plot.addEventListener('pointerdown',point);
  plot.addEventListener('pointerleave',()=>{show(pts.length-1,true);tip.hidden=true;});
  w.querySelector('.replay').addEventListener('click',play);
  // each chart plays once, when it first scrolls into view
  if(!still){if('IntersectionObserver' in window){const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){o.disconnect();play();}},{threshold:.35});o.observe(w);}else play();}
});
if(!still&&'IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);e.target.classList.add('go');
    e.target.querySelectorAll('[data-n]').forEach(n=>{const end=+n.dataset.n,from=+(n.dataset.from||0),suf=n.dataset.suf||'',t0=performance.now();
      const s=t=>{const k=Math.min(1,(t-t0)/1000);n.textContent=Math.round(from+(end-from)*(1-Math.pow(1-k,3)))+suf;if(k<1)requestAnimationFrame(s);};requestAnimationFrame(s);});
  }),{threshold:.08});
  document.querySelectorAll('.anim').forEach(e=>{e.classList.add('pre');io.observe(e);});
}
const times=document.querySelectorAll('time[data-ts]');
times.forEach(t=>{const d=new Date(+t.dataset.ts*1000);if(!isNaN(d))t.textContent=d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});});
if(times.length&&document.getElementById('tz'))document.getElementById('tz').textContent='Start times are shown in your local time.';
const openTarget=()=>{const t=location.hash&&document.getElementById(location.hash.slice(1));if(t&&t.tagName==='DETAILS'){t.open=true;t.scrollIntoView();}};
addEventListener('hashchange',openTarget);openTarget();
})();
