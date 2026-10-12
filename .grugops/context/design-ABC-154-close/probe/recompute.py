import csv, sys
from fractions import Fraction as F
from math import comb
p = sys.argv[1]; samp = sys.argv[2]; HT = int(sys.argv[3]) if len(sys.argv)>3 else 32
rows = list(csv.DictReader(open(p), delimiter='\t'))
def cs(x): return round(float(x)*100)  # integer centiseconds
by = {}
voids = []
for r in rows:
    rd = int(r['round'])
    u, s, c = cs(r['user']), cs(r['sys']), cs(r['cpu'])
    if u + s != c: print('cpu!=user+sys', r['round'], r['cond'], u, s, c)
    exp_tests = HT if r['cond']=='H' else 1
    bad = (r['status']!='ok' or int(r['files'])!=1 or int(r['tests'])!=exp_tests or r['failed']!='0' or r['skipped']!='0'
           or r['foreign_vitest']!='0' or r['foreign_after']!='0' or r['thermal_before']!='0' or r['thermal_after']!='0'
           or r['power']!='AC Power' or r['power_after']!='AC Power')
    if bad: voids.append((rd, r['cond']))
    by.setdefault(rd, {})[r['cond']] = dict(cpu=c, wall=cs(r['wall']), load=(r['load1_before'], r['load1_after']), utc=r['utc'])
print('rows', len(rows), 'rounds', sorted(by), 'void rows', voids)
sc = [rd for rd in sorted(by) if rd != 0]
print('scored n =', len(sc))
def med(xs):
    xs = sorted(xs); n=len(xs)
    return F(xs[n//2-1]+xs[n//2],2) if n%2==0 else F(xs[n//2])
def fmt(x): return f"{float(x)/100:+.3f}"
for unit in ('cpu','wall'):
    print('==', unit)
    for a in 'BHT':
        v = [by[r][a][unit] for r in sc]
        print(f' {a} median {float(med(v))/100:.3f}  values {sorted(v)}')
    Bm = med([by[r]['B'][unit] for r in sc])
    for a, lab in (('H','treatment H-B'), ('T','twin T-B')):
        d = sorted(by[r][a][unit]-by[r]['B'][unit] for r in sc)
        m = med(d); x2, x7 = d[1], d[6]
        pos = sum(1 for x in d if x>0); neg = sum(1 for x in d if x<0); z = 8-pos-neg
        n2 = pos+neg
        if n2==0: pv = 1.0
        else:
            k = min(pos,neg); pv = min(1.0, 2*sum(comb(n2,i) for i in range(k+1))/2**n2)
        # old convention: positives vs everything else (n=8)
        k2 = min(pos, 8-pos); pold = min(1.0, 2*sum(comb(8,i) for i in range(k2+1))/2**8)
        print(f' {lab}: sorted {[x/100 for x in d]} median {fmt(m)} ({float(m/Bm)*100:.3f} % of B)  x(2)..x(7) {fmt(x2)}..{fmt(x7)}  R(=max|x2|,|x7|) {max(abs(x2),abs(x7))/100:.3f}  signs +{pos}/-{neg}/0x{z}  p_nonzero {pv:.3f}  p_old {pold:.3f}')
        if a=='T':
            lim = max(F(15,1000)*Bm, F(1))
            print(f'   A1 limit max(1.5% B={float(F(15,1000)*Bm)/100*1000:.2f} ms, 10 ms) -> |median| {abs(float(m))*10:.1f} ms <= {float(lim)*10:.2f} ms: {abs(m)<=lim}; sign at chance (p>0.05): {pv>0.05}')
            print(f'   pre-A1: |median|/B {abs(float(m/Bm))*100:.3f} % <= 1.5 %: {abs(m)<=F(15,1000)*Bm}; old p>0.05: {pold>0.05}')
# load
loads = [float(r['load1_before']) for r in rows] + [float(r['load1_after']) for r in rows]
print('load1 min/max over rows', min(loads), max(loads))
# sampler
sr = list(csv.DictReader(open(samp), delimiter='\t'))
bad = [r for r in sr if r['thermal']!='0' or r['power']!='AC Power' or r['foreign_runner']!='0' or r['platform']!='0' or r['foreign_cmds'].strip()]
print('sampler rows', len(sr), 'bad', len(bad), 'load1 range', min(float(r['load1']) for r in sr), max(float(r['load1']) for r in sr))
for r in sr: print('  ', r['utc'], r['load1'])
