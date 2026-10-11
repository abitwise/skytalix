# Read-only: compare two package-lock.json v3 files. Prints added/removed/changed packages with
# licence, install-script flag, resolved host, integrity presence, dev flag.
import json, sys
from collections import Counter
b = json.load(open(sys.argv[1]))["packages"]; h = json.load(open(sys.argv[2]))["packages"]
def name(p): return p.split("node_modules/")[-1]
bk = {k for k in b if k}; hk = {k for k in h if k}
add = sorted(hk - bk); rem = sorted(bk - hk)
chg = sorted(k for k in bk & hk if b[k].get("version") != h[k].get("version"))
print(f"root lockfileVersion: base {json.load(open(sys.argv[1]))['lockfileVersion']} head {json.load(open(sys.argv[2]))['lockfileVersion']}")
print(f"entries: base {len(bk)} head {len(hk)}; added {len(add)} removed {len(rem)} version-changed {len(chg)}")
def row(e): return f"lic={e.get('license','<none>')} dev={e.get('dev',False)} opt={e.get('optional',False)} script={e.get('hasInstallScript',False)} host={(e.get('resolved') or '<none>').split('/')[2] if e.get('resolved') else '<none>'} integrity={'sha512' if (e.get('integrity') or '').startswith('sha512') else e.get('integrity')}"
print("\n== ADDED"); [print(f"  {k} {h[k].get('version')} {row(h[k])}") for k in add]
print("\n== REMOVED"); [print(f"  {k} {b[k].get('version')} {row(b[k])}") for k in rem]
print("\n== CHANGED (base -> head)")
for k in chg:
    bv, hv = b[k].get("version"), h[k].get("version")
    maj = "MAJOR" if bv.split(".")[0] != hv.split(".")[0] or (bv.split(".")[0] == "0" and bv.split(".")[1] != hv.split(".")[1]) else ""
    lic = "" if b[k].get("license") == h[k].get("license") else f" LICENCE-CHANGED {b[k].get('license')}->{h[k].get('license')}"
    print(f"  {k} {bv} -> {hv} {maj} {row(h[k])}{lic}")
print("\n== install scripts, all entries: base", sorted(name(k)+'@'+b[k]['version'] for k in bk if b[k].get('hasInstallScript')), "head", sorted(name(k)+'@'+h[k]['version'] for k in hk if h[k].get('hasInstallScript')))
print("== licences, head, all entries:", dict(Counter(h[k].get('license','<none>') for k in hk)))
print("== licences, base, all entries:", dict(Counter(b[k].get('license','<none>') for k in bk)))
print("== resolved hosts head:", dict(Counter((h[k].get('resolved') or '<none>').split('/')[2] if h[k].get('resolved') else '<none>' for k in hk)))
print("== entries without sha512 integrity head:", [k for k in hk if not (h[k].get('integrity') or '').startswith('sha512') and not h[k].get('link')])
print("== non-dev entries head:", [k for k in hk if not h[k].get('dev')])
print("== root deps head:", h[''].get('dependencies'), "devDeps:", h[''].get('devDependencies'))
