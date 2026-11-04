import json, sys
d = json.load(open(sys.argv[1]))
pats = sys.argv[2:]
for f in d['testResults']:
    name = f['name'].split('/src/')[-1]
    for a in f['assertionResults']:
        for p in pats:
            if p in a['fullName']:
                print(f"{a.get('duration',0):8.1f}\t{name}::{a['fullName'][:150]}")
