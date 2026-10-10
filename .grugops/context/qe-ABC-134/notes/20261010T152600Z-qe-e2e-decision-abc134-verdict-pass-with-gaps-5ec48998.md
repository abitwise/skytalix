---
id: 20261010T152600Z-qe-e2e-decision-abc134-verdict-pass-with-gaps-5ec48998
kind: decision
by: qe-e2e
at: 2026-10-10T15:26:00Z
verified_by:
confidence: high
refs:
  - ABC-134
  - ABC-136
  - ABC-057
  - ADR-0029
  - QE-053-b
  - QE-053-c
  - QE-053-d
  - QE-057-b
  - QE-134-a
  - QE-134-b
  - QE-134-c
  - QE-134-d
  - src/history-pane.nfr.test.ts
  - 20261010T152600Z-qe-e2e-observation-abc134-readings-ledgers-gate-048ac24a
  - 20261010T152600Z-qe-e2e-observation-abc134-gap-register-5761436a
  - 20261010T151002Z-software-engineer-decision-abc134-four-comment-sites-at-least-four-spellings-1f2b70bf
  - 20261010T151002Z-software-engineer-observation-abc134-gates-a1-a5-spans-pins-d5b9d74c
supersedes:
---

# `ABC-134` QE: **PASS_WITH_GAPS**. `A1`–`A5` are MET at `4cac6911`, after QE's comment-only fix to one false clause in `A3`'s sentence

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).

- **Scope.** Subtask `qe-ABC-134`, Workflow 04 review exit.
  - Branch `grugops/ABC-134-frame-probe-prose`: SE tip `4d6b019a`, code `a42b59e3`, base `7f7e6b84`.
  - **QE tip `4cac6911`**: one comment-only commit inside `A3`'s site (below).
  - The authoritative scope and risks are the ticket's `## Scope` / `## Out of scope`.
- **Method.** Every sentence was judged against the code it describes, by mutant, not by phrase.
  - Mutants ran in an out-of-worktree `git archive` copy of `4d6b019a`.
  - Text readings used QE's own `qe134.mjs`; the comment-free check uses the TypeScript printer, not a line regex.
  - Readings: `…048ac24a`. Gaps: `…5761436a`. Raw files: `../probe/`.

## Verdict per criterion

| | verdict | the evidence, in one line |
|---|---|---|
| `A1` | **MET** | Phrase 1 → 0; the four words are present. The five named dimensions are the seam's whole input (`makeRenderSeam(mode, orientation)` + `(history, status, thinking, messages)`; no env or terminal read). `UNICODE-`/`BLACK-BOTTOM-`/`THINKING-`/`MESSAGES-`/`PLIES-GT-40-`/`ENDED-GAME-ONLY` GREEN 3/3; `ascii`/`white-bottom` controls RED 3/3 |
| `A2` | **MET** | Phrase 1 → 0; `gameStatus`, `replay`, "no instrument" present. A `gameStatus` rebuild reds `ABC-041` `A2` (4 RED). A replay rebuild riding the pane's walk, or in the seam, is GREEN on the full lane (1608/1608). Some placements are caught only incidentally (`QE-134-b`, INFO) |
| `A3` | **MET at `4cac6911`** | Phrase 1 → 0; "3 `setImmediate` turns" = `turn < 3`. A chain 3 deep RED 10/10, 4 deep GREEN 10/10, so "at most 3 deep" holds. **"A timer of any delay, is NOT seen" was FALSE**: 0 and 1 ms RED 10/10, 5 ms 1/10, 50 ms 0/10. QE fixed that clause (`QE-134-a`) |
| `A4` | **MET** | Both phrases 1 → 0; both sites name the string-named specifier and the `;` comment, with "AT LEAST" and "not exhaustive". The four are uncounted by the tripwire and lint-clean, and five more are also uncounted, so "not exhaustive" is true. Agrees with `ADR-0029`'s pointer (four) |
| `A5` | **MET** | `7f7e6b84..4cac6911` touches one `src/` path (+28/−13). The filter prints nothing. The comment-free AST hash is `098d2307…` at base, `4d6b019a` and `4cac6911`. 1608 = base. Gate green |

## Decisions

- **`QE-134-a` was fixed in the branch, not routed.**
  - The brief allows a comment-only fix inside the page's four sites "only if a sentence is wrong". This clause was wrong, reproducibly (10/10).
  - The fix keeps the `setImmediate` half and keeps naming a timer as unseen ("NOT reliably seen"), so `A3`'s criterion still reads true.
  - It changes no executable line: the AST hash is equal and the filter is empty.
  - The criterion's own premise ("never a timer", from `QE-053-d`) was wrong for short timers. Nothing else in the ticket depends on it.
- **No test is added.** The ticket narrates reach. Covering it (a glyph/orientation matrix, a clock-bounded settle, re-pointing the tripwire) is fenced out by name.
- **`ABC-136`'s four pins are unaffected:** each literal is evaluated from the file and counts 1 at base and at both tips.
- **`ABC-057`'s spans are unaffected:** six of seven are byte-identical. `probe-it`'s raw hash moves because `A3`'s site is inside it (accepted by the Orchestrator); with its `//` lines dropped it is identical, `0ad1227b…` at base and tip.
- **Board move is the Orchestrator's.**
  - The ticket may leave `In Review`.
  - UAT is WAIVED by the standing rule (0 production lines, measured at `4cac6911`).
  - `QE-134-a`'s new wording is QE's, so the Orchestrator may want a second reader on that one sentence (`QE-134-d`).
  - Not merged, not pushed.
