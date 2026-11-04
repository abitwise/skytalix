const fs=require('fs');const dir=process.argv[2];const tag=process.argv[3];const runs=[1,2,3,4,5,6,7,8];
const per={};const tests={};let nfiles=0;
for(const r of runs){const j=JSON.parse(fs.readFileSync(`${dir}/${tag}-json-${r}.json`));nfiles=j.testResults.length;
 for(const f of j.testResults){const n=f.name.replace(/.*secnfr-nfr008-headroom\//,'');(per[n]??=[]).push(f.endTime-f.startTime);
  let sum=0;for(const a of f.assertionResults){sum+=a.duration||0;const k=n+' :: '+a.fullName;(tests[k]??=[]).push(a.duration||0);} (per[n+'#sum']??=[]).push(sum);}}
const med=a=>{const s=[...a].sort((x,y)=>x-y);const m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2};
const rows=Object.keys(per).filter(k=>!k.endsWith('#sum')).map(k=>[k,med(per[k]),med(per[k+'#sum'])]).sort((a,b)=>b[1]-a[1]);
let tot=0,totT=0;for(const r of rows){tot+=r[1];totT+=r[2]}
console.log('files',nfiles,'sum file-wall ms',tot.toFixed(0),'sum test-dur ms',totT.toFixed(0));
console.log('file\tmedian_file_ms\tmedian_sum_test_ms');for(const r of rows.slice(0,+process.argv[4]||25))console.log(r[0]+'\t'+r[1].toFixed(0)+'\t'+r[2].toFixed(0));
const tr=Object.keys(tests).map(k=>[k,med(tests[k])]).sort((a,b)=>b[1]-a[1]);
console.log('\nslowest tests (median ms)');for(const t of tr.slice(0,+process.argv[5]||40))console.log(t[1].toFixed(0)+'\t'+t[0].slice(0,200));
