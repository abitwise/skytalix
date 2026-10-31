const C=(t,i,m)=>Math.max(1,Math.min((t-1000-m*100)/m+i,t-1100));
const B=(t,m)=>Math.min(59500,C(t,0,m));
function run(plies,{start,book=0,add={},mtg=true}){let t=start;const rows=[];for(let p=1;p<=plies;p++){const m=mtg?40-((p-1)%40):20;let b;if(p<=book)b=undefined;else b=B(t,m);const sent=t;t-= b===undefined?0:b+31;rows.push({b,sent,left:t});t+=add[p]??0;}return rows;}
let r=run(40,{start:900000});console.log('A2 min',Math.min(...r.map(x=>x.left)),'last',r.at(-1).left,'used',(900000-r.at(-1).left)/900000, 'first',r[0].b,'max b',Math.max(...r.map(x=>x.b)));
r=run(40,{start:900000,book:6});console.log('A3 min',Math.min(...r.map(x=>x.left)),'last',r.at(-1).left,'used',(900000-r.at(-1).left)/900000,'b7',r[6].b);
r=run(120,{start:900000,add:{40:900000,80:900000}});for(const k of [0,1,2]){const s=r.slice(k*40,k*40+40);const st=s[0].sent;console.log('A4 p',k,'start',st,'min',Math.min(...s.map(x=>x.left)),'last',s.at(-1).left,'used',(st-s.at(-1).left)/900000, (st-s.at(-1).left)/st);}
r=run(80,{start:900000,mtg:false});console.log('A6 min',Math.min(...r.map(x=>x.left)),'last',r.at(-1).left);
console.log('A5',B(3000,1),C(800,0,20), 'A7',C(3600000,0,40));
