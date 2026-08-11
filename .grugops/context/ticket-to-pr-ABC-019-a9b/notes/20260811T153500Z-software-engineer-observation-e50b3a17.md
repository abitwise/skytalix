---
id: 20260811T153500Z-software-engineer-observation-e50b3a17
kind: observation
by: software-engineer
at: 2026-08-11T15:35:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-016
  - ABC-017
  - ADR-0009
  - ADR-0010
  - plans/tickets/ABC-019-turn-loop-skeleton.md
supersedes:
---

# Every criterion checked against the AMENDED text, where each clause is actually asserted, and the limits I am not papering over

> **Hand-authored** — see this hop's `decision` note for why. **Nothing here is a `finding`.**

## All twenty-three criteria are MET, and none is met only in part

`A1`, `A1b`, `A2`, `A3`, `A3b`, `A4`, `A5`, `A6`, `A7`, `A7b`, `A8`, `A9`, **`A9b`**, `A10`, `A11`,
`A12`, `A13`, `A14`, `A15`, `A16`, `A17`, `A18`, `A19`.

**The previous hop reported two as *met in part*; neither is any longer, and neither changed because
of anything I built.** `[D33]` and `[D34]` ruled `A12` and `A17` met in FULL — the criteria were
under-specified, not the build — and my refusal to put `A17`'s timing half in the lane is now the
criterion's own wording. **Nothing in this hop's diff touches either.**

## The four criteria whose TEXT changed, checked clause by clause against what the suite asserts

Eight rulings were text-only. Re-reading a criterion after it is amended is the step that catches a
build that was right for a reason the new text no longer gives, so each was re-read rather than
assumed unaffected.

### `A2` — the corrected cadence needs no new test, and this was checked arithmetically rather than asserted

`[D29]` replaced `1 + plies + non-advancing outcomes` with `1 + plies + RE-EMITTING non-advancing
outcomes` and added an explicit negative clause: **end-of-input adds no frame.**

**The delivered `A2` test already discriminates the two formulas, and I checked the arithmetic on
each of its three cases rather than trusting that it did:**

| `A2` case | script | plies | re-emitting | asserted | corrected formula | OLD formula predicts |
|---|---|---|---|---|---|---|
| `full` | `["g1f3","g8f6"]` | 2 | 0 | **3** | 3 | **4** |
| `rejected` | `["zzzz","g1f3","g8f6"]` | 2 | 1 | **4** | 4 | **5** |
| `busy` | `["zzzz","board","g1f3","g8f6"]` | 2 | 2 | **5** | 5 | **6** |

**All three runs end at end-of-input**, because each script is exhausted at a human prompt. So the
negative clause is asserted three times inside `A2`'s own test, and additionally at rows 8-11 and at
`A8`. **A build satisfying the old formula is RED on every one of them.** No assertion was added.

### `A3b` — both corrected counts were already asserted, at four places

**(a) `gameStatus` exactly `N + 1`:** `A3` (`plies + 1` on the invocation order array), `A3b` (3 for
2 plies with two non-advancing outcomes; 1 for 0 plies with three), and `src/turn-loop.nfr.test.ts`
at **40 / 120 / 300** plies plus the 12-rejections case at 41. **(b) `repetitionCounts` exactly 0:**
asserted alongside every one of those.

The half nobody had named — that `repetitionCounts` reads 0 **because `gameStatusOf` calls it inside
`src/history.ts:152`**, so demanding *"once per ply"* of it could only be satisfied by the hand-rolled
`gameStatus(position, repetitionCounts(history))` that `A3` forbids — is stated in both test files'
headers already and needed no change.

### `A3`'s clarified order clause — where each of its three halves is asserted

The amended text says what is assertable is *"the **append** precedes that call and the **render**
follows it, plus the map handed to `gameStatus` being this game's."*

- **append precedes evaluate** — `A3`, on `invocationCallOrder` for `playMove` vs `gameStatus`.
- **map is this game's** — `A3`, `countsTotal(counts) === call + 1` on every call.
- **render follows evaluate** — **not asserted inside `A3`'s own test.** It is pinned by `A4`:
  `statuses[8]` is the status the render seam *received* for frame 9, and it must equal the
  post-ply-8 claimable evaluation. A loop that rendered before evaluating would hand the seam the
  stale status and `A4` is RED. **Stated as reasoning from the assertion's structure — I did not
  build a render-before-evaluate mutant at this hop, because it is a structural rewrite rather than
  a one-line mutation, and I am not calling it measured.**

### `A12` and `A17` — met in FULL, and nothing was added to make that true

`A12`'s five automatic fixtures each RUN (rows 1-5, exact-object assertions) **and** the enumeration
guard reads the table's declarations — `[D25]`'s requirement, now a stated clause. **Row 14 sits
outside `TABLE`, so the `TABLE.slice(0, 5)` guard is unaffected**; I checked that rather than assumed
it. `A17`'s lane half is the spied counts at all three ply counts; its timing half is out of tree.

## `A9b` — what each clause asserts, and the one thing it deliberately does NOT assert

- **(i)** `toFen(history.position)` equals `toFen` of the position replayed from
  `{ initialFen, moves }` by the CORE's primitives (the independent oracle, never the loop's), and
  `moves.length` is 0. **Plus the guard that makes it falsifiable:** the fixture's recorded
  mid-bracket FEN is asserted **different** from that oracle, so `[D10]`'s failure mode — a stub that
  throws before touching the board, against which a repair-nothing loop passes — cannot occur silently.
- **(ii)** the settled value is `toBe(PARSER_EXPLODED)` — object identity, not a message match.
- **(iii)** the settled value is asserted **not** equal to `{ result: null, reason: null,
  exitCode: 0 }`, which is `A8`'s exact end-of-input triple, and `A14`'s enumeration is asserted at
  ten.

**Not asserted, and named rather than implied: row 14 has no frame-count assertion.** The loop does
render exactly one frame before the prompt that throws, but a rejected promise carries no
`RunResult`, so the harness cannot report it without a second harness. `A9b` names no frame count and
neither does row 14's Expected cell, so nothing is owed — but a reader should not infer a count is
being checked there.

## `N8-LANE` — no file added, and the lane figure is NOT re-derived at this hop

**Zero test FILES added**, which is the binding risk by this ticket's own words. The prior hop's
chargeable figure — **420 ms against a 650 ms allowance, 0.65x, with two files added and 320 ms
netted** — is unchanged by two tests in an existing file.

`src/turn-loop.test.ts` read **28 ms** at the prior hop and **29 ms** here, but that is a **single
reading from the default reporter, not the paired-round protocol** (7 interleaved rounds, CPU via
`/usr/bin/time -p`, identity null control) the bar names. **It is not a measurement against the bar
and is not offered as one. `N8-LANE`'s owner is BA/PM at each cut.**

## `NFR-002` / `A17` timing — NOT re-measured at this hop, said plainly

The out-of-tree marginal figures in my previous `artifact-ref` (**27.23 / 58.79 / 112.86 µs** at
40 / 120 / 300, 0.61x / 0.59x / 0.56x, Darwin arm64 / Node v24.12.0) were **not re-run here and are
not restated as though they were.** What was re-run is the clause the ticket says BINDS: the spied
derive counts, green at all three ply counts.

Reasoning for not re-running, offered as reasoning and not as a measurement: the diff adds a `try`
block around one `await` on the human path and no work at all on any non-throwing path, and the
`NFR-002` harness's input seam never throws. **A number produced to confirm that would be cheap and
uninformative, and `MET`/`MISS` is Security/NFR's at the gate either way.**

## The branch went 2 BEHIND `main` DURING this hop, and it touches no `src/` byte

Verified at start: **0 behind, 3 ahead.** Verified at hand-back: **2 behind, 3 ahead.** The two new
commits are `0234aac` (`ADR-0010`, the frame-width ruling) and `660aef2` (the board routing to a new
`ABC-027`).

`git diff --stat HEAD...main -- src/` is **empty**, and they do not touch
`plans/tickets/ABC-019-turn-loop-skeleton.md`. **So every gate result in this hop's `artifact-ref`
stands as measured.** I did not rebase: sequencing is the Orchestrator's, and the ticket already
carries `ADR-0009` clause 9f's rebase-and-real-panel-re-gate as owed work.

**Nothing was read from the width hop's notes and no message passed between us**, per the standing
rule that the on-disk substrate is the only channel. `ADR-0010` is named here only because
`git log` surfaced it while verifying sync.

## Concurrency: what this hop did not touch

`src/status-panel.*` does not exist in this worktree and was not created. `src/frame.test.ts` was
**not read and not edited** at this hop — `git status --short` shows three changed files and no
others. The pending queue items for `ABC-016` (`quality-gate-ABC-016-qe`, `refinement-ABC-016-a13`,
`ticket-to-pr-ABC-016-d19b`, `ticket-to-pr-ABC-016-dev`) were left untouched in `pending/`.
