# qe-ABC-291-where: the wall identity and the per-file gap by class. usage: python3 -I groups.py <lanes2.json> <arms dir>
# Identity, exact per run: 2 x span = sum of gaps + sum of slots + lane end difference. Classes come from each arm's source: static import closure, type-only imports dropped.
import hashlib, json, os, re, statistics as st, sys
L = json.load(open(sys.argv[1])); A = sys.argv[2]; rs = L["rounds"]; RUN = L["runs"]
def imports(path):
    s = open(path, encoding="utf8").read()
    s2 = re.sub(r"/\*.*?\*/", "", s, flags=re.S); s2 = re.sub(r"(?m)^\s*//.*$", "", s2)
    out = []
    for m in re.finditer(r'(?m)^\s*(import|export)\s+(type\s+)?([^;"\']*?\sfrom\s+)?["\']([^"\']+)["\']', s2):
        if m[2]: continue
        out.append(m[4])
    return [o for o in out if o.startswith(".")]
def closure(arm, f):
    root = f"{A}/{arm}"; seen = set(); st_ = [f]
    while st_:
        p = st_.pop()
        if p in seen: continue
        seen.add(p); full = f"{root}/{p}"
        if not p.endswith((".ts", ".js", ".mjs", ".cjs")): continue
        for i in imports(full):
            q = os.path.normpath(os.path.join(os.path.dirname(p), i))
            if os.path.exists(f"{root}/{q}"): st_.append(q)
            elif os.path.exists(f"{root}/{q}.ts"): st_.append(q + ".ts")
    return seen
def sha(arm, p):
    try: return hashlib.sha256(open(f"{A}/{arm}/{p}", "rb").read()).hexdigest()
    except FileNotFoundError: return None
size = lambda arm, p: os.path.getsize(f"{A}/{arm}/{p}")
files = [f["n"] for f in RUN[f"{rs[0]}|B"]["files"]]
cls = {}; info = {}
for f in files:
    cb, ch = closure("B", f), closure("H", f)
    prod_changed = sorted(p for p in ch if not p.endswith(".test.ts") and sha("B", p) != sha("H", p))
    test_changed = sha("B", f) != sha("H", f)
    if f == "src/cli.test.ts": c = "1 cli.test.ts"
    elif test_changed and prod_changed: c = "2 test file changed, reaches changed production"
    elif test_changed: c = "3 test file changed, no changed production"
    elif prod_changed: c = "4 test file same, reaches changed production"
    else: c = "5 test file same, no changed production (control)"
    cls[f] = c
    info[f] = {"bytesB": sum(size("B", p) for p in cb), "bytesH": sum(size("H", p) for p in ch), "prod": prod_changed}
json.dump({"cls": cls, "info": info}, open(os.path.join(os.path.dirname(sys.argv[1]), "classes.json"), "w"), indent=0)
G = lambda r, a: {f["n"]: f for f in RUN[f"{r}|{a}"]["files"]}
T = {(r, a): G(r, a) for r in rs for a in ("B", "H", "H2")}
def row(name, fn, width=56):
    h = [fn(r, "H") - fn(r, "B") for r in rs]; g = [fn(r, "H2") - fn(r, "B") for r in rs]; t = [fn(r, "H2") - fn(r, "H") for r in rs]; b = [(x + y) / 2 for x, y in zip(h, g)]
    se = st.stdev(b) / len(b) ** 0.5
    print(f"{name:<{width}} B {st.median(fn(r,'B') for r in rs):7.0f} | H-B {st.median(h):+6.0f} mean {st.mean(h):+6.0f} {sum(x>0 for x in h)}/8 | H2-B {st.median(g):+6.0f} mean {st.mean(g):+6.0f} {sum(x>0 for x in g)}/8 | both mean {st.mean(b):+6.0f} se {se:4.0f} med {st.median(b):+6.0f} {sum(x>0 for x in b)}/8 | twin H2-H mean {st.mean(t):+6.0f} sd {st.stdev(t):4.0f}")
span = lambda r, a: max(f["e"] for f in T[(r, a)].values())
sg = lambda r, a: sum(f["gap"] for f in T[(r, a)].values())
ss = lambda r, a: sum(f["e"] - f["s"] for f in T[(r, a)].values())
ed = lambda r, a: RUN[f"{r}|{a}"]["ends"][1] - RUN[f"{r}|{a}"]["ends"][0]
print("identity check, largest error ms:", round(max(abs(2 * span(r, a) - sg(r, a) - ss(r, a) - ed(r, a)) for r in rs for a in ("B", "H", "H2")), 3))
row("2 x span (first dispatch to last row end, worker ms)", lambda r, a: 2 * span(r, a))
row("sum of gaps", sg); row("sum of slots", ss); row("lane end difference", ed)
print()
names = sorted(set(cls.values()))
for c in names:
    fl = [f for f in files if cls[f] == c]
    row(f"gap: {c} ({len(fl)})", lambda r, a: sum(T[(r, a)][f]["gap"] for f in fl), 66)
print()
for c in names:
    fl = [f for f in files if cls[f] == c]
    row(f"slot: {c} ({len(fl)})", lambda r, a: sum(T[(r, a)][f]["e"] - T[(r, a)][f]["s"] for f in fl), 66)
print()
print("largest per-file gap change, both arms, mean ms")
d = []
for f in files:
    h = [T[(r, "H")][f]["gap"] - T[(r, "B")][f]["gap"] for r in rs]; g = [T[(r, "H2")][f]["gap"] - T[(r, "B")][f]["gap"] for r in rs]
    d.append((st.mean(h + g), st.mean(h), st.mean(g), st.median(T[(r, "B")][f]["gap"] for r in rs), f, cls[f][0], info[f]["bytesH"] - info[f]["bytesB"]))
d.sort(reverse=True)
for x in d[:14] + d[-6:]: print(f"{x[0]:+7.1f} H {x[1]:+7.1f} H2 {x[2]:+7.1f} B {x[3]:6.0f} class {x[5]} dbytes {x[6]:+7d} {x[4]}")
print("\nsame-sign count, H and H2 mean gap change:", sum((x[1] > 0) == (x[2] > 0) for x in d), "of", len(d), "; positive both:", sum(x[1] > 0 and x[2] > 0 for x in d), "; negative both:", sum(x[1] < 0 and x[2] < 0 for x in d))
hs = [x[1] for x in d]; gs = [x[2] for x in d]
mh, mg = st.mean(hs), st.mean(gs)
print("across 71 files, correlation of H and H2 mean gap change:", round(sum((a - mh) * (b - mg) for a, b in zip(hs, gs)) / (st.pstdev(hs) * st.pstdev(gs) * len(hs)), 3))
# bytes against gap, B arm, files other than cli
xs = [info[f]["bytesB"] / 1024 for f in files if f != "src/cli.test.ts"]; ys = [st.median(T[(r, "B")][f]["gap"] for r in rs) for f in files if f != "src/cli.test.ts"]
mx, my = st.mean(xs), st.mean(ys); b = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs); a = my - b * mx
r = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / (st.pstdev(xs) * st.pstdev(ys) * len(xs))
print(f"\nB, 70 files: gap = {a:.1f} ms + {b:.3f} ms/KiB of statically loaded source; r {r:.3f}; bytes median {st.median(xs):.0f} KiB, max {max(xs):.0f}")
dk = sum(info[f]["bytesH"] - info[f]["bytesB"] for f in files if f != "src/cli.test.ts") / 1024
print(f"added source over those files: {dk:.0f} KiB in all loads; predicted worker ms {b*dk:+.0f}")
for c in names:
    fl = [f for f in files if cls[f] == c]
    print(f"  {c}: {len(fl)} files, added KiB in loads {sum(info[f]['bytesH']-info[f]['bytesB'] for f in fl)/1024:.0f}, predicted {b*sum(info[f]['bytesH']-info[f]['bytesB'] for f in fl)/1024:+.0f} ms")
for c in names: print(c, ":", [f.replace("src/", "") for f in files if cls[f] == c][:80])
