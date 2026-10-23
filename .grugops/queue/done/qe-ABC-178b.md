---
subtask: qe-ABC-178b
role: qe-e2e
ticket: plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
ref: .grugops/context/qe-ABC-178b/
branch: grugops/ABC-178 (tip 0036e5c6; merge 0fb19ab9; prior QE'd tip efaa0a76); worktree ../wt-ABC-178 (read only)
width: 3 (beside qe-ABC-189 and security-nfr-ABC-190)
---

# QE re-read for ABC-178 after the QE-178-b fold (+2 lines in R1). Non-timing only: B7/B8 stay owed to a later quiet-host hop

## Do
- Continue your own branch `grugops/qe-ABC-178` in `../wt-qe-ABC-178`: merge `grugops/ABC-178` (tip `0036e5c6`) and then the current `main` into it (merges, not rebases). Report both shas.
- Re-verify the amended B1, B3, B4, B5, B6 and B9 (the newest BA/PM block on the page, `…1f4936b2`) with your own runs **before** opening the SE's notes (`.grugops/context/ticket-to-pr-ABC-178b/notes/` in main's tree).
- **B6:** your `gp-qe178.mjs` @ `d781e5e5`, byte-copied, on scratch copies (full `node_modules`): QP0 green; QP1, QP1a, QP1c red on R1 in the file run and ≥ 1 red in the lane; QP1b reported, not graded. Try one QP1c variant of your own (e.g. the release lands in session 1's output via a different keyword) and say whether the re-check kills it.
- B5: census sum 608,965 and R1 = 655; the sorted census equals your `census-H.tsv`.
- Gates at your merge: lint, typecheck, build; `npm test` + `last-run.json` success (60 / 1996); skip-count capture as spelled → `test-skip-integrity.js`; `UCI_DEEP`. No timing.
- UAT waiver form must print nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register. Carry QE-178-c/-d (B7/B8 OWED) forward unchanged. Say whether QE-178-b closes.

## Fences
- Work only in `../wt-qe-ABC-178` and scratch copies. Commit typed notes inside your worktree (context root `../wt-qe-ABC-178/.grugops/context`, task `qe-ABC-178b`) and update the `## QE` section on the page there.
- No edits to `src/` on the tip, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, other pages. Do not touch other worktrees. Never set git config. Never push, `--force`, `--amend` or rebase; never merge into `main`. Temp files in your scratch area, not `/tmp`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-178b`). Every `at` from `date -u`. Include a `kind: decision`. Append-only.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/qe-ABC-178b.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.

## Result

**PASS_WITH_GAPS. QE-178-b closes.** Branch `grugops/qe-ABC-178` in `../wt-qe-ABC-178`:
- **merge `fb00ad68`** = `d781e5e5` + `grugops/ABC-178` tip `0036e5c6`;
- **merge `7b87e5de`** = `fb00ad68` + `main` `66fd8e1b`.

Both are merges with no conflict, and `src/` at `7b87e5de` equals the tip. The commit on top is `2aeeabda` (notes, probe, page § QE). Not pushed, not merged into `main`, no `--force`. No timing taken. The SE's notes were opened at 15:47:57Z, after every QE run.

Notes, sealed with `admitAndAppend` under `../wt-qe-ABC-178/.grugops/context/qe-ABC-178b/notes/`:
- `…dea0917d`: B1, B3–B5, B9. It supersedes `…fdb7ccca`, which named the BA/PM decision with a wrong timestamp; the body is unchanged.
- `…41cd7a8e`: B6;
- `…806ca802`: artifacts;
- `…006ed3cf`: the SE cross-check;
- `…d72f02f0` (decision): the verdict and the gap register.

### Per criterion
| crit | result |
|---|---|
| B1 | **MET.** check 1: 0 `bestmove`; session 2 a fresh session, `out` `[]`; the re-check of the same `held.out` after session 2: 0 `bestmove` |
| B3 | **MET.** One file. 0 `-` lines. One hunk of 9 `+` lines: R1, its re-check, comments citing `ABC-178`/`QE-177-a`/`QE-178-b`, and the blank separator. +2 against `efaa0a76` |
| B4 | **MET.** file 126 → 127; lane 1 995 → 1 996; the difference is R1 alone; 0 skipped |
| B5 | **MET.** R1 = 655; sum 608 965; the sorted census is `cmp`-equal to `census-H.tsv` |
| B6 | **MET.** See the table below |
| B7/B8 | **OWED** (unchanged) |
| B9 | **MET.** See the gates below |

### B6 (tip; `gp-qe178.mjs` @ `d781e5e5`, sha256 `12c0b8db…`, byte copy; QE variants in a copy, `gp-qe178b.mjs`)
| probe | wrong build | file (127) | lane (1 996) | pre-fold file | base file / lane |
|---|---|---|---|---|---|
| QP0 | none | 0 | 0 | 0 | 0 / — |
| QP1 | `held` at module scope | **1: R1** | **1: R1** | — | — |
| QP1a | leak via `ponderhit` only | **1: R1** | **1: R1** | — | — |
| QP1b | leak after a 2nd hold (reported) | 0 | 0 | — | — |
| QP1c | fresh `stop`/`ponderhit` releases into the holder's stream | **1: R1 @ 289:68** | **1: R1** | 0 | 0 / 0 (`…f910b911`) |
| **QP1d** (QE) | fresh `position`/`go`/`ucinewgame` releases into the holder's stream | **0: survives** | **0: survives** | 0 | 0 / 0 |
| **QP1e** (QE) | constructing a fresh session releases into the holder's stream | **1: R1 @ 289:68** | **1: R1** | 0 | 0 / — |

**Whether the re-check kills QE's variants:**
- **QP1e:** yes, and nothing else does (it survives the pre-fold file).
- **QP1d:** no. Session 2 sends only `stop`/`ponderhit`, so the re-check never sees the release. → QE-178-f.

In scratch, changing session 2 to `talk(["stop", "ponderhit", "position startpos", "ucinewgame"])` kills QP1d. It keeps QP0 green and QP1/1a/1c/1e red, at 0 extra nodes.

### Gates at the merge `7b87e5de`
| gate | result |
|---|---|
| lint | 0 (119 files) |
| typecheck | 0 |
| build | 0 |
| `npm test` | 60 files / **1 996** passed / 0 failed / 0 skipped; `last-run.json` `success: true` |
| skip capture as spelled | `0` |
| `test-skip-integrity.js --skip-count 0` | `No findings.` |
| `UCI_DEEP` | 5/5 |
| M4 plant | 13/127 red, sweep row red |

**UAT waiver form:** empty for `0036e5c6~1..0036e5c6`, `fb00ad68~1..fb00ad68` and `7b87e5de~1..7b87e5de`. **UAT waived.**

### Gap register
| id | sev | state / route |
|---|---|---|
| QE-178-a | LOW | ACCEPTED (BA/PM `…1f4936b2`); QP1b still survives, as expected |
| QE-178-b | LOW | **CLOSED** |
| QE-178-c | MEDIUM | B7 OWED, unchanged → Orchestrator: a quiet-host timing hop at width 1 (P2), on the folded tip |
| QE-178-d | MEDIUM | B8 OWED, unchanged; `NFR-008` NOT READ → the same hop; Security/NFR rules on the state |
| QE-178-e | INFO | CLOSED (corrected by BA/PM) |
| QE-178-f | LOW | **NEW.** QP1d survives (not a regression; one session per process) → BA/PM: accept, or the one-line session 2 widening (0 nodes) |

### Trace row
| ABC-178 (qe-ABC-178b) | QE re-read after the QE-178-b fold: B1, B3–B6, B9 MET; QE-178-b closed; B7/B8 OWED | EPIC-007 | — | QE-178-b CLOSED; QE-178-c, QE-178-d (MEDIUM, OWED); QE-178-f (LOW, new); QE-178-a accepted; NFR-008 NOT READ | grugops/qe-ABC-178 @ 2aeeabda (merges fb00ad68, 7b87e5de; tip 0036e5c6)<br>.grugops/context/qe-ABC-178b/; ABC-178 page § QE | lint/typecheck/build green; npm test 1996/1996; file 127; skips 0; UCI_DEEP 5/5; QP1c 1/127 + 1/1996 on R1; R1 655 nodes, census 608965 | UAT waived (0 production lines) | — | PASS_WITH_GAPS; In Review holds for the B7/B8 timing hop; QE-178-f to BA/PM |
