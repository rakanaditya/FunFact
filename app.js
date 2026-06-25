let list=ITEMS,i=0;const g=grid;
function draw(a){g.innerHTML='';a.forEach((x,n)=>g.innerHTML+=`<div class=card><img loading=lazy src="${x.img}" data-i="${n}"><div style="padding:8px">${x.title}</div></div>`);document.querySelectorAll('.card img').forEach(im=>im.onclick=()=>openV(a,+im.dataset.i));}
function openV(a,n){list=a;i=n;viewer.classList.add('show');refresh();}
function refresh(){img.src=list[i].img;title.textContent=list[i].title;download.href=list[i].img;let f=JSON.parse(localStorage.fav||'[]');fav.textContent=f.includes(title.textContent)?'♥ Favorite':'♡ Favorite';}
close.onclick=()=>viewer.classList.remove('show');prev.onclick=()=>{i=(i-1+list.length)%list.length;refresh()};next.onclick=()=>{i=(i+1)%list.length;refresh()}
q.oninput=e=>draw(ITEMS.filter(v=>v.title.toLowerCase().includes(e.target.value.toLowerCase())));
theme.onclick=()=>{document.body.classList.toggle('dark');localStorage.theme=document.body.classList.contains('dark')?'dark':'light'}
if(localStorage.theme==='dark')document.body.classList.add('dark');
fav.onclick=()=>{let f=JSON.parse(localStorage.fav||'[]');let t=title.textContent;f=f.includes(t)?f.filter(x=>x!=t):[...f,t];localStorage.fav=JSON.stringify(f);refresh();}
let sx=0;viewer.ontouchstart=e=>sx=e.touches[0].clientX;viewer.ontouchend=e=>{let d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40){i=(i+(d<0?1:-1)+list.length)%list.length;refresh();}}
draw(ITEMS);
