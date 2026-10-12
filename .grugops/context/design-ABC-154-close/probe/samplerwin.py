import csv, sys
from datetime import datetime, timedelta
def t(s): return datetime.fromisoformat(s.replace('Z','+00:00'))
rows = list(csv.DictReader(open(sys.argv[1]), delimiter='\t'))
starts = [t(r['utc']) for r in rows]; ends = [t(r['utc'])+timedelta(seconds=float(r['wall'])) for r in rows]
# scored rounds only (round != 0) and whole window
for lab, rr in (('all rounds', rows), ('scored rounds', [r for r in rows if r['round']!='0'])):
    lo = min(t(r['utc']) for r in rr) - timedelta(seconds=5)
    hi = max(t(r['utc'])+timedelta(seconds=float(r['wall'])) for r in rr) + timedelta(seconds=5)
    sr = [s for s in csv.DictReader(open(sys.argv[2]), delimiter='\t') if lo <= t(s['utc']) <= hi]
    bad = [s for s in sr if s['thermal']!='0' or s['power']!='AC Power' or s['foreign_runner']!='0' or s['platform']!='0']
    print(f'{lab}: interval {lo.time()}..{hi.time()} sampler rows {len(sr)} bad {len(bad)}', [ (s['utc'], s['foreign_runner'], s['platform']) for s in bad][:4])
