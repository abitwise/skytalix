# ABC-059 A1: every `Dev / run` occurrence in AGENTS.md, whitespace-normalized, span = to the next '.'.
# Usage: python3 -I dev-run-spans.py <tree>
import re, json, os, sys
root = sys.argv[1]
src = open(os.path.join(root, 'AGENTS.md')).read()
pkg = json.load(open(os.path.join(root, 'package.json')))
print('scripts running src/cli.ts:', [k for k, v in pkg['scripts'].items() if 'src/cli.ts' in v])
def spans(text):
    t = re.sub(r'\s+', ' ', text)
    return [t[m.start():t.find('.', m.end()) + 1] for m in re.finditer('Dev / run', t)]
for sp in spans(src):
    print(repr(sp[:100]), '| UNKNOWN' if 'UNKNOWN - verify' in sp else '', '| npm run' if 'npm run ' in sp else '')
q13 = "\n…which is why `Dev / run` above is\n`UNKNOWN - verify` and stays that way.\n"
print('Q13 sentence appended -> spans with UNKNOWN:', sum('UNKNOWN - verify' in sp for sp in spans(src + q13)))
print('UNKNOWN - verify occurrences:', src.count('UNKNOWN - verify'))
