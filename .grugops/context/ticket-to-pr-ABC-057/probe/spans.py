# Prints sha1 of the spans ABC-057 must leave byte-identical. Usage: spans.py <file>
import hashlib, sys, re
src = open(sys.argv[1]).read()
lines = src.split("\n")
def h(s): return hashlib.sha1(s.encode()).hexdigest()[:12]
regex = [l for l in lines if 'history\\.ts";/' in l]
print("licence-regex-lines", len(regex), h("\n".join(regex)))
a = src.index("    const directory = new URL(\".\", import.meta.url).pathname;\n    const bindsAssembleFrame")
b = src.index(".toEqual([COMPOSITION_ROOT]);", a) + len(".toEqual([COMPOSITION_ROOT]);")
print("composer-tripwire-span", src[a:b].count("\n") + 1, h(src[a:b]))
s = src.index('    expect(instrument, "the guard above runs the expression the witnesses below run").toContain(')
e = src.index(");\n", s) + 2
print("sibling-tripwire", src[s:e].count("\n") + 1, h(src[s:e]))
g = src.index("    const runtimeImporters = production.filter((file) =>")
ge = src.index('    expect(readFileSync(`${directory}history-pane.ts`, "utf8")).toContain(', g)
print("guard-body", h(src[g:ge]))
print("game-owning driver:", src.count("game-owning driver"))
