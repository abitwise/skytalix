import json, sys
d = json.load(open(sys.argv[1]))
print(f"total {d['numTotalTests']} passed {d['numPassedTests']} failed {d['numFailedTests']} pending {d['numPendingTests']} todo {d['numTodoTests']} files {len(d['testResults'])} failedSuites {d['numFailedTestSuites']}")
for f in d['testResults']:
    name = f['name'].split('/src/')[-1] if '/src/' in f['name'] else f['name'].split('/')[-1]
    if f.get('status') == 'failed' and not any(a['status']=='failed' for a in f['assertionResults']):
        print(f"FILEFAIL\t{name}\t{(f.get('message') or '')[:200]}")
    for a in f['assertionResults']:
        if a['status'] == 'failed':
            print(f"KILL\t{name}::{a['fullName']}")
