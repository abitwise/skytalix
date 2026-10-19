---
id: 20261019T140500Z-qe-e2e-decision-abc171-uat-conducted-owner-word-owed-b2794b17
kind: decision
by: qe-e2e
task: uat-ABC-171
at: 2026-10-19T14:05:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - ABC-167
  - ABC-168
  - ABC-174
  - ADR-0044
  - ADR-0045
  - NFR-004
  - NFR-008
  - R-167-1
  - R-167-2
  - R-171-1
  - QE-171-e
  - QE-171-f
  - UAT-171-a
  - UAT-171-b
  - UAT-171-c
  - UAT-171-d
  - grugops/ABC-171
  - grugops/uat-ABC-171
  - 20261019T140000Z-qe-e2e-artifact-ref-abc171-uat-pack-f340102a
  - 20261019T140100Z-qe-e2e-observation-abc171-uat-run-s0-s9-e7b71b15
  - 20261019T140200Z-qe-e2e-observation-abc171-s10-abc167-regression-f59a723d
  - 20261019T140300Z-qe-e2e-observation-abc171-not-observable-until-abc168-abc174-3cd487f4
  - 20261019T140400Z-qe-e2e-observation-abc171-gates-fences-controls-be4d3860
  - 20261019T160000Z-orchestrator-decision-owner-word-r1711-uat171-by-qe-2b7f4c88
  - 20261019T132100Z-security-nfr-decision-abc171-pass-with-risks-9a89caf5
  - 20261019T131500Z-qe-e2e-decision-abc171-recheck-verdict-pass-d60ef4d9
supersedes:
---

# UAT `ABC-171` conducted: PASS_WITH_GAPS on the observable half. NOT accepted; the owner's word is owed

This note is hand-authored and unsealed. `human_admission` is `off`, so this is a `decision` by an agent and never
a stamp.

> **Read this first.** "The UAT run passed" means that **an agent ran the scenarios and they came back green**.
> It does **not** mean the owner accepted `ABC-171`. Under `AGENTS.md` § Test and UAT authority, the owner's own
> word in session is the only `In UAT` signature, and a green agent report is explicitly not that word. Until he
> gives it, `ABC-171` is **UAT conducted, owner's word owed**.

## Result: PASS_WITH_GAPS

| criterion | UAT verdict | basis |
|---|---|---|
| A1 the option lines | **PASS** | S1: exactly the 5 lines, in order, 0 reads; the advertised defaults are what plays. S9 and S10 handshakes |
| A2 setoption | **PASS** | S2: case-blind names (4 spellings × both options); each bad value writes one printable `info string` and keeps the old value; other names write nothing and change nothing |
| A3 a book hit | **PASS** | S3: exactly `info string book`, `bestmove e2e4`, also by FEN; transposition, FEN and FEN+moves hits. S9: games open from the shipped book |
| A4 OwnBook off | **PASS** | S4: 8 sessions, every `go` searched, **0 reads**, 0 warnings, no book line |
| A5 read once, at the right time | **PASS** | S3: 0 after `uci`, 1 after the first `isready`, then 1 throughout, or 1 at the first `go` without `isready`; toggling does not re-read. S8: `ucinewgame` does not reload |
| A6 a level change is observable | **PASS** | S6: 5 levels × 5 `go` forms in their windows; A6's G = 3 500 reads 200 / 3 100 / 3 600 at levels 1 / 3 / 5 (step 100) |
| A7 the blunder path | **PASS** | S6: identical lines per seed, twice, k = 1..8 at levels 1 and 2. The level line has no `score`. `go depth 3` at level 1 writes one `info string`; at level 3 it reports depth 3 |
| A8 no reseed, one draw per blunder-level go | **PASS** | S8: `ucinewgame` draws 0, and the next `go` plays the second seed's move. S6: 1 draw per `go`. S3 / S7: book hits draw 0 at every level. S8: rate-0 levels draw 0. `UAT-171-b` (a mated position draws 1) is INFO |
| A9 a bad book | **PASS** | S5: 9 bad books × 4 flows. Legal `bestmove`s, never a throw, `warn` exactly once, fixed text, no planted byte |
| A10 infinite on a book hit | **PASS** | S7: holds `info string book` until `stop` / `ponderhit`; released first by `position` / `ucinewgame` / `quit` / `go` |
| A11 capability-free, M4 | **PASS** | X1: 1 793 lines, all prefixed and printable, one `bestmove` per `go`. The text half (`import type` only for `book.ts`, no limb) was read at entry (`…be4d3860`) |
| A12 fences, ABC-167 unchanged | **PASS (re-measured)** | The two files from merge base `55a1e223`. S10: ABC-167's 13 scenarios 2876/2876, output identical to ABC-167's recorded run except the `uci` lines (`…f59a723d`) |
| A13a–d (QE rows) | **PASS** | S6: the seed oracle 64/64 per level (A13a). S3 / S7: a hit at levels 1–2 draws 0 (A13b). S6: one line naming `depth`, `nodes` and `mate` (A13c). S2: an invalid `OwnBook` keeps `true` (A13d) |
| QE-171-f f1–f4 | **observed as ruled** | S2: `TRUE` refused (f1); multi-token values and no value refused (f2); `01` / `1.0` / `0x1` refused (f4). S3: on a book hit, the bad-token `info string`s come first, then `info string book` (f3) |
| NFR-004 | **PASS (virtual), engine path** | no engine-path `time` above 5 000 + 2·step; level 5 reads 4 600 at step 100. The blunder path's virtual time is `UAT-171-a`, INFO |
| NFR-008 N8-LANE | **OWED** | R-171-1, accepted by the owner (`…2b7f4c88`). No timing reading was taken |

- **S0–S9 and X1: 11 of 11 PASS, 4061 of 4061 checks**, twice, byte-identical, at `5dee231c` (`…e7b71b15`).
  **S10: 13 of 13, 2876 of 2876**, twice, byte-identical (`…f59a723d`).
- **The gaps are what cannot be observed yet, not failures** (`…3cd487f4`). These are `ABC-168`'s: the binary, a
  real book file, a real GUI, real time at levels 1–2, varied openings through `Math.random`, and the warning
  reaching the GUI. The re-cut table and `default 5` are `ABC-174`'s.
- **Defects found: 0.** There are four INFO items:
  - `UAT-171-a`: the blunder path's virtual time is clock reads.
  - `UAT-171-b`: a mated position at a blunder level draws one seed.
  - `UAT-171-c`: `default 3` is a literal, for `ABC-174`'s QE to pin with `DEFAULT_LEVEL`.
  - `UAT-171-d`: the warning stays in `warn` (QE-171-e).
  RUN-0's 5 FAILs were two errors of mine, disclosed.

## The question the owner answers to sign

> **Do you accept ABC-171, `OwnBook` and `Skill Level` over UCI, on this UAT?**
> - On the virtual clock, 10 GUI-style scenarios pass (4061 checks). They cover the option lines; `setoption` with
>   good and bad values; book on, off and bad; the five levels' budgets and the seeded blunder path; `go infinite` on
>   a book hit; `ucinewgame` drawing no seed; and a full game at level 1 and at level 3.
> - ABC-167's 13 UAT scenarios give the same output as when you accepted them, apart from the two new option lines.
> - The binary, the real book file, a real GUI, real time, varied openings and the warning reaching the GUI are left
>   for ABC-168. The re-cut levels and `default 5` are left for ABC-174. N8-LANE stays OWED under R-171-1.
>
> **Accept or reject?**

## What happens next (none of it is QE's)

- **Accept:** the Orchestrator transcribes the owner's word and owns the board move out of `In UAT`.
- **Reject:** the reason goes to the Orchestrator for routing.
- QE has not merged, has not pushed and has not moved the board. `src/`, `plans/board.md` and
  `plans/traceability.md` are untouched. The trace row is in the handoff.
