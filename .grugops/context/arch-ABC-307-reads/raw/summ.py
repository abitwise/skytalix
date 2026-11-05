# summ.py <json> : a vitest JSON report to KILL / FILEFAIL lines. An absent or empty report prints UNREAD, never 0 killers.
import json, os, sys
p = sys.argv[1]
if not os.path.exists(p) or os.path.getsize(p) == 0:
    print("UNREAD empty or absent report"); sys.exit(0)
d = json.load(open(p))
print(f"total {d['numTotalTests']} passed {d['numPassedTests']} failed {d['numFailedTests']} pending {d['numPendingTests']} todo {d['numTodoTests']} files {len(d['testResults'])} failedSuites {d['numFailedTestSuites']}")
for f in d['testResults']:
    name = f['name'].split('/src/')[-1] if '/src/' in f['name'] else f['name'].split('/')[-1]
    if f.get('status') == 'failed' and not any(a['status'] == 'failed' for a in f['assertionResults']):
        print(f"FILEFAIL\t{name}\t{(f.get('message') or '')[:200]}")
    for a in f['assertionResults']:
        if a['status'] == 'failed':
            print(f"KILL\t{name}::{a['fullName']}")
