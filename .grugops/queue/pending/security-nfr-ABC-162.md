---
subtask: security-nfr-ABC-162
role: security-nfr
ticket: plans/tickets/ABC-162-the-real-engine-book-child-runs-from-the-tree-root-so-a-cwd-relative-book-read-passes.md
ref: .grugops/context/qe-ABC-162/
branch: grugops/qe-ABC-162 @ 91f18689 (over SE 3d05e230; base 51503331); QE worktree ../wt-qe-ABC-162 (read only)
width: 3 (beside bapm-rule-QE-159 and scribe-agents-md-2026-10-21)
---

# Security/NFR: rule on AR-095-CWD's close for ABC-162

QE passed ABC-162 with gaps (`…68554c31`); the plants and decoy probe are in `…567002e7`. P6b, the close condition, is now red at head. But **P6f**, which tries the working directory first and falls back to the module path, still passes the head test (G-1).

## Read first
- The ABC-162 page and the ABC-095 page.
- AR-095-CWD wherever it is recorded (`plans/tickets/ABC-095-*`, `plans/traceability.md`).
- QE notes `…865e9bc6`, `…567002e7`, `…df4fc9ed` and `…68554c31`.

## Decide
1. **AR-095-CWD.** Close it outright, or close it with P6f carried as a narrower named residual (state owner and trigger)? Or does it stay open?
2. **G-1 and G-2.** G-1: P6f survives; QE's decoy-file fix contradicts A1's "no `data/`" wording. G-2: the kill rests on the single stderr assertion. Accept each as a risk, or recommend a BA/PM cut, naming the fix shape.
3. **Security surface.** Confirm the change is test-only (`src/cli.real-engine.test.ts`). Check that `mkdtemp` under `os.tmpdir()` with removal by exact path raises no temp-file concern (symlink, shared-dir) at ASVS L1.

## Fences
- Records only, plus the AR-095-CWD record and the risk lines.
- No `src/`, `AGENTS.md` or worktree edits. Run no timing. Never push or merge.

## Publish
- Seal notes with `/Users/olgeroeselg/.claude/plugins/cache/grugops/grugops/2.1.0/scripts/context-io.js` (`admitAndAppend`, task `security-nfr-ABC-162`).
- Write `.grugops/queue/done/security-nfr-ABC-162.md` (brief + `## Result`: verdict PASS / PASS_WITH_RISKS / FAIL, rulings, trace row) and `.claim.md`, uncommitted on main.
