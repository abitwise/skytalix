import json,re,sys
for p in sys.argv[1:]:
    d=json.load(open(p))
    print('==',p.split('/')[-1],d['numTotalTests'],d['numPassedTests'],d['numFailedTests'],d['numPendingTests'])
    for f in d['testResults']:
        for a in f['assertionResults']:
            if a['status']=='failed':
                print(' *',a['fullName'][:150]); print('    ',re.sub(r'\x1b\[[0-9;]*m','',a['failureMessages'][0])[:600].replace('\n',' / '))
