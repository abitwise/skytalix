# ABC-134 acceptance helper: bullets, comment-stripped probe-it hash, ABC-136 pin counts. Usage: check.py <file>
import hashlib, re, sys
src = open(sys.argv[1], encoding="utf-8").read()
def h(s): return hashlib.sha256(s.encode()).hexdigest()[:16]
def coll(s): return re.sub(r"\s+", " ", re.sub(r"(?m)^\s*(\*|//)\s?", "", s))
a = src.index('  it("evaluates history.ts\'s module body NOWHERE ON THE FRAME PATH'); b = src.index("\n  });\n", a)
probe = src[a:b]
print("probe-it code-only (// lines dropped)\t", h("\n".join(l for l in probe.split("\n") if not l.strip().startswith("//"))))
print("whole file code-only (comment lines dropped)\t", h("\n".join(l for l in src.split("\n") if not re.match(r"\s*(\*|/\*\*|\*/|//)", l))))
print("turn literal:", re.findall(r"turn < (\d+)", src))
dock = coll(src[src.index("WHAT NEITHER PHASE COVERS"):src.index("THE RECORDED LOSS")])
bul = [x for x in dock.split(" - ")]
cond = next(x for x in bul if "CONDITIONAL" in x); reb = next(x for x in bul if "rebuilds the derive" in x)
print("A1 bullet:", {w: w in cond for w in ["unicode","black-bottom","thinking","message"]})
print("A2 bullet:", {w: w in reb for w in ["gameStatus","replay","seen by no instrument"]})
st = coll(src[src.index("THE PER-FRAME PHASE"):src.index("const probe = `")])
print("A3 settle:", {w: w in st for w in ["3 `setImmediate` turns","at most 3 deep","timer","deeper `setImmediate` chain","NOT seen"]})
dp = coll(src[src.index("IT FAILS CLOSED ON A SECOND COMPOSER"):src.index("WHAT NEITHER PHASE COVERS")])
it = coll(src[src.index('it("the composer tripwire'):src.index("const directory = new URL", src.index('it("the composer tripwire'))])
for n, t in (("A4 docblock", dp), ("A4 in-test", it)):
    print(n + ":", {w: w in t for w in ["string-named specifier","comment containing `;`","AT LEAST","not exhaustive"]})
pins = [
 "/${WITNESSED_EXPRESSION.source}/${WITNESSED_EXPRESSION.flags}.test(",
 "\n    expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)));\n",
 "\n    const production = productionModulesIn(directory);\n    const runtimeImporters = production.filter((file) =>\n",
 '\n    const runtimeImporters = production.filter((file) =>\n      /^(?:import|export)\\s+(?!type\\b)(?:[^;]*from\\s+)?"\\.\\/history\\.ts";/m.test(\n        readFileSync(`${directory}${file}`, "utf8"),\n      ),\n    );\n',
]
src2 = src.replace("${WITNESSED_EXPRESSION.source}", "^(?:import|export)\\s+(?!type\\b)(?:[^;]*from\\s+)?\"\\.\\/history\\.ts\";").replace("${WITNESSED_EXPRESSION.flags}", "m")
for i, p in enumerate(pins):
    pp = p if i else "/^(?:import|export)\\s+(?!type\\b)(?:[^;]*from\\s+)?\"\\.\\/history\\.ts\";/m.test("
    print(f"ABC-136 pin {i} raw count\t", src.count(pp), "\thash", h(pp))
print("first LICENSED_DRIVERS decl line:", next(i+1 for i,l in enumerate(src.split("\n")) if l.startswith("const LICENSED_DRIVERS")), " first COMPOSITION_ROOT decl:", next(i+1 for i,l in enumerate(src.split("\n")) if re.match(r"^const COMPOSITION_ROOT = ", l)))
