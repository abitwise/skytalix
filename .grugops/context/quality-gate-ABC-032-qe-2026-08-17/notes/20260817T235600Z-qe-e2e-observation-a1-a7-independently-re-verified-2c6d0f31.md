---
id: 20260817T235600Z-qe-e2e-observation-a1-a7-independently-re-verified-2c6d0f31
kind: observation
by: qe-e2e
at: 2026-08-17T23:56:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - ADR-0004
  - src/san.ts
supersedes:
---

# `A1`–`A7` re-verified independently, and how each verdict was reached

Not a re-run of the engineer's assertions. Each criterion below was checked by a measurement I
chose — a mutation, a direct probe of `parseSan` outside the suite, or a git-level read — and where
my method was the same as his I say so.

| # | my verdict | how I reached it, independently |
|---|---|---|
| `A1` | **MET** | Checked by MUTATION rather than by re-reading the row. Making `resolve` return a COPY of the matched move (`{ ...candidates[0] }`) — a textbook `ADR-0004` (2b) violation — turns **14 tests red**, `A1`'s six position rows among them. So `A1`'s `toBe` is genuinely a provenance assertion and not decoration. The `178` total is the perft table's own depth-1 counts (`20+48+14+6+44+46`) and each position asserts its own count before the loop, so the total cannot be reached by looping the wrong list. **What `A1` cannot see is in its own note.** |
| `A2` | **MET** | Re-derived the eight expected arms from the position rather than from the test: `Nf3` — the knight already stands there; `Qh5#` — the d1 queen's diagonal runs through her own knight on f3; `Nbd2` — d2 holds White's own pawn. All three are `rejected` for the right reason. `O-O`/`0-0` and `Bxf7+`/`Bxf7` return the SAME object, confirmed by a direct probe outside the suite. Nothing throws. |
| `A3` | **MET** | Both axes present, exactly 2 candidates on each bare `Nd2`, all candidates reference-elements of `legal`. Checked as a guard, not a row: deleting the file-qualifier filter turns 4 tests red, deleting the rank-qualifier filter turns 1 red. Both directions of the rule are therefore load-bearing. |
| `A4` | **MET on the substitute FEN**, and the substitute is sound | Verified the printed FEN independently: `parseFen("8/4P3/8/8/8/8/4k3/4K3 w - - 0 1")` gives `isInCheck === true` for the side to move and a legal list of exactly `["Kxe2"]` — kings on e1/e2, an illegal position, criterion unreachable. The substitute `8/4P3/8/8/8/4k3/8/4K3 w - - 0 1` gives `Kf1, Kd1, e8=Q+, e8=R+, e8=B, e8=N`: the four promotions `A4` asks for, `e8=Q` resolving to the queen by reference, bare `e8` → `ambiguous` with exactly 4. **Intent preserved** — the only change is the black king e2→e3, the promotions are still the only moves reaching e8, and the checking suffix on two of them exercises the tolerance rather than weakening it. |
| `A5` | **MET, and the collapse claim holds under my own probe** | The eight hostile inputs return `rejected` and throw nothing — re-run. On the collapse: I reached each code from inputs the suite does not use, so the distinction is not an artefact of two hand-picked strings. `unreadable`: `Zx9`, `""`, `e8=P`, `e8Q`, `Ng5++`, `+Ng5`, `o-o`, `N g5`. `no-such-move`: `Bf7`, `Nxg5`, `Ne4g5`, `d5` in a position where only `exd5` is legal, `Qh5#` where there is no queen. Then the mutation: collapsing `no-such-move` into `unreadable` in `resolve` turns the suite red. **The two codes never collapse and the guard against collapsing them can fail.** |
| `A6` | **MET** | Read from git, not from a note. `git diff -U0 bf371d7 da69986 -- src/san.ts` is ONE hunk, `@@ -148,0 +149,132 @@`, and `grep -c '^-[^-]'` over that diff is **0** — zero deleted or modified lines, so `toSan`'s body is byte-unchanged under either reading of "body". `git diff --name-only` over the three fenced files is **empty**. The whole delivered diff touches `src/san.ts`, `src/san.parse.test.ts`, `src/san.test.ts` and the notes — no other `src/` file, no `package.json`, so the ticket's security firing threshold is not tripped either. Suite **957/957 on 33 files**, skip **0**, `PERFT_DEEP=1` **32/32**, all re-run here. |
| `A7` | **MET as written — and the criterion is weaker than its words** | The delivered assertions do bite: a promotion-letter map of its own (`{ 2: "N", 3: "B", … }`) and a `switch (letter)` decoder both turn `A7` red. But a second table spelled in a REGEX LITERAL is invisible to a string-literal count, and two such mutants survived the entire suite. Closed by two rows I added; the detail is in the mutation note. **`A7` MET, with the caveat recorded rather than smoothed over.** |

## One thing the engineer measured and I could not reproduce as stated

Nothing. Every figure in his `A1`–`A7` table that I re-measured came back the same. The
disagreements in my verdict are about what the criteria FAIL TO ASK, not about what he reported.
