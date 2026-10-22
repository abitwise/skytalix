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
