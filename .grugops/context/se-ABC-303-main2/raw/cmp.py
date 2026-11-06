import json,sys,re
def per(f):
    d=json.load(open(f)); r={}
    for t in d['testResults']:
        n=re.sub(r'^.*?/(src|tools)/',r'\1/',t['name']); r[n]=len(t['assertionResults'])
    return r
m=per('count-38914841.json');b=per('count-c9ff7ff9.json');p=per('count-80bc0711.json');t=per('skip.json')
print('file main c9ff premerge tip  tip-main')
for k in sorted(set(m)|set(b)|set(p)|set(t)):
    v=[m.get(k,0),b.get(k,0),p.get(k,0),t.get(k,0)]
    if len(set(v))>1: print(k,*v,v[3]-v[0])
print('sum',sum(m.values()),sum(b.values()),sum(p.values()),sum(t.values()))
