---
id: 20260809T094600Z-qe-e2e-observation-f9b3a54c
kind: observation
by: qe-e2e
at: 2026-08-09T09:46:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-015
  - ABC-016
  - ABC-017
  - ABC-019
  - EPIC-002
  - EPIC-003
  - EPIC-006
  - src/frame.ts
  - src/frame.test.ts
  - plans/tickets/ABC-018-frame-output-and-redraw.md
  - 20260809T084500Z-ba-pm-decision-53b4877d
  - 20260809T090800Z-software-engineer-observation-2bfbf80e
supersedes: 
---

# 56 mutants, 46 killed by the delivered suite — the twelve criteria one by one, and the six holes that were real

Every criterion below was checked by **mutating `src/frame.ts` until the behaviour it names was
wrong** and watching whether the suite noticed. **No test was accepted because it is named after a
criterion.** 56 distinct mutants, 75 mutate-and-restore cycles, digest asserted after every cycle
(see the gates note for the restoration proof).

## The two fakes the ticket's own `## Test notes` name — BOTH CHECKED, NEITHER PRESENT

**1 — "the screen-model criteria can be degraded into byte assertions."** Proven absent **by
construction, not by inspection.** A byte-only rewrite of criteria 5 and 6 was written into a scratch
file — cursor-home prefix, the frame present, exactly one erase, exactly two `\x1b` — and run against
the **no-padding-to-`W`** mutant. **The byte-only forms PASS on that mutant; the delivered forms
FAIL.** So the screen model is load-bearing: it sees a stale character that no "was the erase
emitted" assertion can see. The model is not a rubber stamp either — it applies the sequences to a
grid, scrolls, defers the right-margin wrap, and **throws** on an escape it does not implement.

**2 — "the escape-stripping can be asserted on the sanitizer's return value."** Proven absent by the
mutant that is exactly that fake: **`sanitize()` left completely correct while the writer bypasses it
for message items.** A test asserting the sanitizer's return value passes; the delivered criteria 11
and 12 **both fail**, because both assert on the CAPTURED STREAM. The mutant dies to five tests.

## The twelve testable criteria, one by one

`SOLE` = mutants this test is the ONLY killer of, across the campaign. It measures discriminating
power, not worth — a 0 can mean redundant rather than empty, and both cases are distinguished below.

| # | Criterion | Test | SOLE | Verdict |
|---|---|---|---|---|
| 1 | identical row count at 80 and 300 plies | ✅ | **0** | **NEAR-VACUOUS, exactly as BA/PM ruled — confirmed by measurement, not conceded.** It cannot fail while the panels are fixed-height stubs. Integration obligation for `ABC-019` / `EPIC-006` |
| 2 | height invariant across message content × thinking state | ✅ | **0** | **WEAKER THAN RULED — see below. It does NOT kill the mutant its own rationale names** |
| 3 | 6 candidates FIT, no marker | ✅ | 0 | **PASS.** Non-vacuous: kills the marker-when-nothing-is-hidden mutant and the fewest-items-first packing |
| 4 | 10 candidates do NOT fit, `N` counted from the input | ✅ | **3** | **PASS — the strongest criterion in the set.** Sole killer of an invented `N`, of no room reserved for the marker, and of the marker on the wrong row. BA/PM's defect-1 correction did its job |
| 5 | 24-row TTY: home + frame + exactly one erase, zero rows from frame N | ✅ | 0 | **PASS, and the screen half is load-bearing** — see the degradation proof above |
| 6 | the `≥` boundary: 23-row TTY, 23-row frame, nothing scrolls | ✅ | **1** | **PASS.** Sole killer of `>` where the rule says `≥`. **BA/PM's defect-3 correction was not ceremony.** But the OTHER side of the boundary was open — see hole 4 |
| 7 | `H` includes the reserved prompt row; cursor at its start, no trailing newline | ✅ | **1** | **PASS.** Sole killer of the erase emitted before the frame instead of after; kills the trailing newline with criterion 6 |
| 8 | non-TTY, 80 frames, zero `\x1b`, none truncated | ✅ | 0 | **PASS.** Kills a cursor sequence in append mode and a truncated frame |
| 9 | 10-row TTY under a 23-row frame appends, zero cursor control | ✅ | 0 | **PASS, but fully redundant** — every mutant it caught was also caught by the Engineer's absent-signals pin |
| 10 | the sink's signals change AFTER construction; both frames still in place | ✅ | **1** | **PASS.** Sole killer of the per-write re-decide. **BA/PM's defect-5 correction was not ceremony, and the mutant is live** |
| 11 | `\x1b[2J` in a message: zero `\x1b` from it, row count unchanged | ✅ | **1** | **PASS, asserted on the EMITTED STREAM** — proven by the bypass mutant |
| 12 | ASCII mode, `é` and `♞`: zero code points above `U+007F` | ✅ | **1** | **PASS.** Sole killer of the ASCII strip removed |
| — | `NFR-002` (compute + write summed < 16 ms) | **no in-repo assertion** | — | By this project's standing convention (`src/zobrist.nfr.test.ts:112`). **Security/NFR's to re-derive** |

### Criterion 2 is weaker than BA/PM ruled, and this is measured rather than argued

BA/PM left criterion 1 near-vacuous **knowingly**, on the reasoning that *"the falsifiable weight is
carried by the criterion beneath it, which varies message content and thinking state in one run."*
**That reasoning does not hold as the criterion is instantiated.** The mutant it exists to catch — a
**message region GROWN to fit instead of truncated** — is killed by criteria 3 and 4 and by one pin,
and is **NOT killed by criterion 2**. The reason is its own input: the rejection is two items
(`"no piece on that square"`, `"try again"`), and a region that grows to `max(2, items.length)` still
has two rows for two items, so nothing grows and the height never varies.

**A third item would fix it, and QE did not amend the criterion** — amending a criterion is the
`Backlog` exit and belongs to BA/PM. The suite is not blind to it: the pin *"reserves the last row and
renders NOTHING into it"* hands in seven items and kills the mutant. So this is a **criteria** gap,
not a code or suite gap, and it is routed rather than closed.

## The six holes that were REAL — all closed in TESTS ONLY, no production line changed

Each was a mutant that **passed all 12 acceptance criteria and all 297 delivered tests**. Each added
test is now that mutant's **only** killer.

1. **`SEPARATOR = ""` — the items run together into one unreadable token.** `"Nbd2Nfd2Rae1"` still
   *contains* every candidate and still ends with the marker, so criteria 3 and 4 both pass. The
   separator is **load-bearing in the ticket's own arithmetic** — *"six 4-character SANs need 29
   characters"* is 6×4 **+ 5 separators** — and nothing asserted it.
2. **The sanitizer NOT run over the PANEL rows.** The Engineer recorded this decision with the honest
   note that the narrower reading *"would pass every test in this suite, because the stub panels are
   ASCII."* **It did.** `ABC-016` and `ABC-017` are unbuilt; the first panel carrying text this
   product did not generate is the first place it matters, and acceptance `2a` is a claim about the
   **whole** emitted stream.
3. **No `(+N more)` when NOT ONE supplied item fits.** The `shown === 0` fall-through. Every delivered
   case leaves at least one item showing, so a build that dropped the marker there went green while
   the region **went silently blank** and the player was never told anything had been withheld. The
   ticket's `## Scope` is explicit: *"the marker is present exactly when `N > 0`"*.
4. **A TTY exactly ONE row SHORT of the frame still redrawing in place — the other side of the `≥`
   boundary.** BA/PM's defect-3 correction added the 23/23 case and killed `>` for `≥`. The
   **exclusive** side was left open: the only "too short" case in the criteria is **10 rows against
   23**, thirteen rows short, which a `>= H - 1` slip clears easily. That slip passed everything, and
   it is **the exact failure `4b` exists to prevent** — a 22-row TTY scrolls the frame origin off the
   top on the first redraw and every later one lands one row high.
5. **`U+0000` surviving the C0 strip.** The two criteria that exercise the sanitizer supply `\x1b`,
   `U+0007` and `U+007F`. The measurable bar is a **RANGE** — *"C0 control characters (< `U+0020`) and
   `U+007F` removed"* — and the range was never asserted. The added test supplies all 32 C0 code
   points.
6. **The C1 block (`U+0080`–`U+009F`) — CHARACTERIZED, not decided.** The module keeps C1 in Unicode
   mode, which matches the bar exactly (the bar names C0 and `U+007F` only), and a build that stripped
   the whole C1 block was indistinguishable from it. `U+009B` is CSI in its 8-bit form; a UTF-8
   terminal does not honour it, which is why keeping it is defensible. **This is a criteria silence,
   not a code defect — recorded and routed to the Security/NFR gate rather than decided by QE.**

## Four mutants still survive, and all four are reported rather than hidden

| Mutant | Disposition |
|---|---|
| `(sink.rows ?? 0)` → `?? -1` | **PROVEN EQUIVALENT.** `frameHeight` is `board + status + history + 3`, so `height ≥ 3` on every reachable input, and `-1 >= h` and `0 >= h` are both false. They differ only at `height ≤ 0`, which no caller can produce (`AGENTS.md` rule 8) |
| `Boolean(sink.isTTY)` → `sink.isTTY === true` | **PROVEN EQUIVALENT** over the declared type. `FrameSink.isTTY` is `boolean \| undefined`, and `process.stdout.isTTY` is `true \| undefined`; the two differ only on a truthy non-`true` value, which the type forbids. **This is `ABC-015`'s surviving mutant a second time, on the same coercion** |
| `markerFor(hidden).length + SEPARATOR.length` → `+ 1` | **PROVEN EQUIVALENT.** `SEPARATOR` is `" "`, length 1. It is a readability difference, not a behaviour |
| marker room reserved on EVERY region row, not just the last | **A CONFORMING ALTERNATIVE, not a defect.** It shows fewer items and a larger `N`, and `N` stays the count of supplied items not shown in full. The ticket puts packing in the engineer's hands and pins only `N` — so both builds are correct and the criteria are right not to separate them |

## The Engineer's handed-over gap: CHECKED, REAL, and still open at the criteria level

*"No acceptance criterion constructs a sink whose `isTTY` or `rows` is ABSENT."* **Confirmed
independently.** Both mutants — an absent row count read as unlimited, an absent `isTTY` read as a
terminal — are killed by **exactly one test, and it is the Engineer's own added pin**, never by a
criterion. Every one of the twelve criteria names a row count, and Node leaves both signals
`undefined` on a pipe, which is the shape `EPIC-006`'s end-to-end test presents.

**This is the THIRD consecutive ticket on this board whose acceptance set is written entirely over
signals that agree.** `ABC-015`'s QE found it, `ABC-018`'s Engineer found it again while implementing,
and it is handed to BA/PM a third time. The suite covers it in three shapes; the **criteria** still do
not.
