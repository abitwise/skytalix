---
subtask: qe-ABC-178
role: qe-e2e
ticket: plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
ref: .grugops/context/qe-ABC-178/
branch: grugops/ABC-178 (tip efaa0a76; base 43e4996f); worktree ../wt-ABC-178 (read only)
width: 2 (beside qe-ABC-196, which runs vitest in ../wt-qe-ABC-196)
---

# QE gate for ABC-178 (narrowed to R1: one additive cross-session hold row in `src/uci-session.test.ts`). B6, B7, B8 are yours; re-verify B1, B3–B5, B9

## Read first
- The ticket page. **Its dated 2026-10-22 block after the H1 governs**: R1 only, B2 out, B3–B6 cover R1, and B8 runs all four arms (B/T, H/H2).
- BA/PM `bapm-rerule-ABC-178` (`…8165d1ba`, `…d5e744dd`); `ABC-177` A9's timing protocol and the AC-power rule `…bfdc97e5`; Architect `arch-O3-ABC-177` `…74d39535`, `…ee7527cc`; your own `qe-ABC-177` and `qe-ABC-177-timing` notes and `probe/gap/gp.mjs`.
- The owner delegation `.grugops/context/owner-delegation-2026-10-22/notes/20261022T140148Z-orchestrator-decision-5aaf7cec.md`. The Orchestrator ruled the **thermal rule for this B8 reading: "thermal kept and flagged"** (warm rounds are kept and flagged, not voided), for this reading only.

## Do
- Create your own worktree `../wt-qe-ABC-178` on `grugops/qe-ABC-178` from the tip. **Merge the current `main` into it first** (a merge, not a rebase) and report the merge sha.
- Verify B1, B3–B5 and B9 with your own runs **before** opening the SE's notes (`.grugops/context/ticket-to-pr-ABC-178/notes/` in main's tree: `…82e891e8`, `…8392960f`, `…3634ec07`, `…a72e3f79`). Rule on the SE's B3 flag: the hunk has one blank separator line beside R1 and its comment. Is that inside "additive only"?
- **B6:** with `gp.mjs` byte-copied on scratch copies (full `node_modules`), QP1 passes base's whole lane and goes red at the tip on R1 alone. Build at least two QP1 variants of your own (e.g. held leaking only on `ponderhit`, or only after a second `go infinite`) and say whether R1 kills them.
- **B7 and B8 (timing):** do the non-timing work first. Take timing only when the host is fit: AC power (`pmset -g batt`), load1 ≤ 8, and no other vitest running (bracket a character, e.g. `pgrep -f '[v]itest'`; never wait on an unbracketed pattern). `qe-ABC-196` is running vitest now. Wait for it to finish (poll at intervals; at most about 60 minutes in total). If the window never opens, record B7/B8 as OWED with the readings that blocked them. Do not ask the owner and do not block on him. At 30 minutes in, report what you have and whether the cause is this host's other load.
- Gates at your merge: lint, typecheck, build; `npm test` + `last-run.json` success; skip-count capture as spelled → `test-skip-integrity.js`; `UCI_DEEP`. Heap 128 multi-file, 400 one-file.
- UAT waiver form must print nothing. Zero production lines means UAT is waived.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register (`QE-178-x`, each with severity and proposed route). State plainly whether B8 is MET, OWED or failed, and the median.

## Fences
- Work only in `../wt-qe-ABC-178`. Commit typed notes written inside your worktree (context root: `../wt-qe-ABC-178/.grugops/context`) and a `## QE` section on the ABC-178 page there.
- No edits to `src/` on the tip, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, other ticket pages, `tools/`, config. Do not touch other worktrees.
- Plants only in scratch copies outside the repository. Never set git config. Never push, `--force`, `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-178`). **Pass your worktree's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`. Append-only; record artifacts as `observation`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |`, exactly 10 cells, as a plain table line. Write your done record as `.grugops/queue/done/qe-ABC-178.md` (this brief plus `## Result`) and `.claim.md` in main's tree, uncommitted. Leave this pending file and the claim directory alone.

## Result

**PASS_WITH_GAPS.** Branch `grugops/qe-ABC-178` in `../wt-qe-ABC-178`. **Merge `80493be0`** = tip `efaa0a76` + `main` `5d3832ef` (a merge, no conflict). Commits on top: `fe37f538` (notes, probe, `## QE`) and `d781e5e5` (probe logs as `*.log.txt`, because `.gitignore` ignores `*.log`). Not pushed, not merged into `main`, no `--force`.

Notes, sealed with `admitAndAppend` under `../wt-qe-ABC-178/.grugops/context/qe-ABC-178/notes/`:
- `…211beb42`: the 30-minute report (cause: this host's other load);
- `…140515b9`: B1, B3–B5, B9;
- `…65ce53ef` (decision): the B3 ruling;
- `…f910b911`: B6;
- `…5a813d2a`: artifacts;
- `…0d723663`: B7/B8 timing;
- `…1ad5f522` (decision): the verdict and the gap register;
- `…a5642821`, superseded by `…89763e2c`: the `*.log.txt` rename.

### Per criterion
| crit | result |
|---|---|
| B1 | **MET.** Session 1: 655 nodes, no `bestmove`. Session 2: a fresh `talk`, `out` `[]` |
| B3 | **MET.** 1 file, 0 `-` lines. **The blank separator is inside "additive only":** it carries no token, git's hunk edge is arbitrary, and all 40 `it` blocks in the file are blank-separated |
| B4 | **MET.** File 126 → 127, lane 1 995 → 1 996, the difference is R1 alone, 0 skipped |
| B5 | **MET.** R1 655 nodes; the other 126 rows are unchanged |
| B6 | **MET.** `gp.mjs` byte copy: QP0 0 red; QP1 0/1 995 at base, 1/1 996 at the tip (R1 alone). QE variants: **QP1a** (ponderhit-only leak) is killed by R1. **QP1b** (leak after a session's second hold) and **QP1c** (release into the holder's stream) survive the whole lane at base and tip, and the pre-`ABC-177` file too |
| B7 | **OWED.** Three windows failed on foreign vitest polls only (2, 71, 1; load1 ≤ 4.56, AC, thermal 0 at start) |
| B8 | **OWED.** 5 windows, 1 admitted (`full-g2a1`, 15:04:38Z, 0 foreign polls, AC 37/37). Its stage: 36 runs, all AC. `174b`: scored 8, warm 5/8, H/H2 twin admissible, **NOT APPLICABLE** (load1 9.03 > 8 before scored round 7 H, while the owner's session ran 5 vitest processes). Strict 174 VOID, 174a VOID. Median printed by the instrument: H 9.790 s; **not a reading**. `NFR-008` NOT READ |
| B9 | **MET.** Lint, typecheck, build exit 0; `npm test` 60/1 996, `success` true; skip count 0 → `No findings.`; `UCI_DEEP` 5/5; the M4 sweep is green and the plant reds it |

UAT waiver form: empty for `efaa0a76~1..efaa0a76` and for the merge. **UAT waived.**

### Gap register
| id | sev | route |
|---|---|---|
| QE-178-a | LOW | QP1b survives → BA/PM: accept, or a test-only row later (same file as ABC-197) |
| QE-178-b | LOW | QP1c survives; one re-check of session 1 after session 2 kills it (scratch) → BA/PM: accept, or a one-line follow-up |
| QE-178-c | MEDIUM | B7 OWED → Orchestrator: a timing hop at width 1 with the owner's session paused (P2) |
| QE-178-d | MEDIUM | B8 OWED; ABC-197's input not produced; NFR-008 stays at 9.395 s (`f81bf03c`) → the same timing hop (it can read `main` after a merge, H = `main` + R1); Security/NFR rules on the state |
| QE-178-e | INFO | The page's 1 994 → 1 995 predates ABC-168; measured 1 995 → 1 996 → none |

**Timing blockers, plainly.** From 14:30 to 14:45Z, `qe-ABC-196`'s parallel mutant clones kept load1 over 8. After 14:50Z, the owner's session (`Projects/public/grugops`) ran vitest bursts every few minutes. Gate: 259 polls; a vitest process on 101, load1 > 8 on 96, AC on all. Disclosed: QE's own plant run fell in the first, already-failed window. Addendum 1 (15:03Z, before any lane ran) let B8 go before B7.

### Gates at the merge
lint 0; typecheck 0; build 0; `npm test` 60 files / 1 996 passed / 0 failed / 0 skipped; skip capture 0; integrity `No findings.`; `UCI_DEEP` 1 file / 5 passed. Heap 128 multi-file, 400 one-file.

### Trace row
| ABC-178 (qe-ABC-178) | QE gate on R1 (QE-177-a's kill): B1, B3–B6, B9 MET; B7/B8 OWED | EPIC-007 | — | QE-178-a, QE-178-b (LOW); QE-178-c, QE-178-d (MEDIUM); QE-178-e (INFO); NFR-008 NOT READ; N8-LANE not read | grugops/qe-ABC-178 @ d781e5e5 (merge 80493be0; tip efaa0a76)<br>.grugops/context/qe-ABC-178/; ABC-178 page § QE | lint/typecheck/build green; npm test 1996/1996; file 127; skips 0; UCI_DEEP 5/5; QP1 0/1995 base → 1/1996 tip; R1 655 nodes | UAT waived (0 production lines) | — | PASS_WITH_GAPS; recommend In Review → In Security/NFR, timing hop queued |
