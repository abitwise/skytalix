# secnfr-census-1105 probe arms: mark the named rows `it.skip` in an arm's copy. Usage: python3 -I mark.py <arm dir> <P1|P2>
import sys
P1 = [
 ("src/uci-session.test.ts", 'it("two sessions on the same seededRandom(k) write the same bestmove sequence"'),
 ("src/uci-session.test.ts", 'it("setoption name Skill Level value 7 sets 7: a bare go searches 30 000 ms"'),
 ("tools/grugops/qe-hop-integrity.test.ts", 'it("coverage() over EVERY real note (no --ticket folder filter) reads ABC-062 and ABC-073 as findings"'),
 ("tools/grugops/qe-hop-integrity.test.ts", 'it("--sweep lists ABC-073 as a finding"'),
 ("tools/grugops/qe-hop-integrity.test.ts", 'it("prints each count line and every finding by id, exits 1; 0 when every row is grandfathered"'),
 ("src/book.test.ts", 'it("ten seeds, one pick each, at least 3 distinct replies"'),
]
P2 = [
 ("src/cli.test.ts", 'it("A8′ — the seam built for each level moves exactly as `createLevel` does, on one seed and one injected clock"'),
 ("src/cli.test.ts", 'it("A4: with a legal ep capture available the same line is not a draw"'),
 ("src/cli.test.ts", 'it("A7: the move the search scores 0 is the move after which gameStatusOf reports the claim"'),
]
for f, t in {"P1": P1, "P2": P2}[sys.argv[2]]:
    p = f"{sys.argv[1]}/{f}"; s = open(p, encoding="utf8").read()
    assert s.count(t) == 1, (f, t, s.count(t))
    open(p, "w", encoding="utf8").write(s.replace(t, "it.skip" + t[2:]))
