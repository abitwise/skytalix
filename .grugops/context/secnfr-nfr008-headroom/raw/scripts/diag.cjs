const fs=require('fs');const S=process.argv[2];const runs=[1,2,3];const acc={};let totals=[];
const med=a=>{const s=[...a].sort((x,y)=>x-y);const m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2};
for(const r of runs){const j=JSON.parse(fs.readFileSync(`${S}/n8h/D-diag-${r}.json`));totals.push(j.total);
 for(const x of j.rows){const a=(acc[x.file]??={occ:[],collect:[],tests:[],prepare:[],setup:[],qwait:[],end:[]});a.occ.push(x.end-x.start);a.collect.push(x.collect);a.tests.push(x.tests);a.prepare.push(x.prepare);a.setup.push(x.setup);a.qwait.push(x.start-x.queued);a.end.push(x.end);}}
const rows=Object.entries(acc).map(([f,a])=>({f,occ:med(a.occ),collect:med(a.collect),tests:med(a.tests),prepare:med(a.prepare),setup:med(a.setup),end:med(a.end)})).sort((a,b)=>b.occ-a.occ);
const sum=k=>rows.reduce((s,r)=>s+r[k],0);
console.log('run totals ms',totals.join(' '),'files',rows.length);
console.log('sum occ',sum('occ').toFixed(0),'sum collect',sum('collect').toFixed(0),'sum tests',sum('tests').toFixed(0),'sum prepare',sum('prepare').toFixed(0),'sum setup',sum('setup').toFixed(0));
console.log('file\tocc\tcollect\ttests\tprepare\tend_at');
for(const r of rows.slice(0,+process.argv[3]||20))console.log([r.f,r.occ,r.collect.toFixed(0),r.tests.toFixed(0),r.prepare.toFixed(0),r.end].join('\t'));
const last=[...rows].sort((a,b)=>b.end-a.end).slice(0,4);console.log('last to end:',last.map(r=>r.f+'@'+r.end).join(', '));
