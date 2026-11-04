---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T14:26:18Z
subtask: se-ABC-283-k3
role: software-engineer
ref: .grugops/context/se-ABC-283-k3/
branch: existing grugops/ABC-283 — worktree .claude/worktrees/se-ABC-283 (reuse it)
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. No games. Host paths only as placeholders.
---
# Apply K3 to the bundle (ABC-283), per ADR-0063's F2 ruling
Read the Orchestrator ruling …6c6fb0be and the Architect's ruling arch-ABC-283-mate …05ef9fc9 (build lines 1–5) plus observation …c8e90c3c.
0. In the existing worktree, run `git merge --no-ff grugops/arch-ABC-283-mate` into grugops/ABC-283 (this brings the ADR-0063 dated lines and the diagnosis records; no rewrite).
1. Build lines 1–5 of …05ef9fc9 exactly:
   - orderKey's history branch returns Math.max(0, HISTORY[...]);
   - re-pin the bundle order row old → new, and add the negative-equals-zero assertion;
   - the rows listed as unchanged stay unchanged;
   - the listed mate-floor rows go green with no re-pin.
2. Re-read the following and record them in the Result:
   - P0;
   - zugzwang;
   - G1;
   - the mate floor (search and chooseMove d5, plus the d6 report);
   - the drift (≤ 42 cp);
   - the d8 ratios;
   - typecheck, lint and build;
   - skip count 0;
   - every deep lane, with R-281-a's four -t lines and their passed counts;
   - npm test green and ≤ 10 s, by a few interleaved base/head pairs.
   Any count that differs from …05ef9fc9 is explained before any other bar is read.
Fences: src/, tests, your records. No ticket, EPIC, ADR (beyond what the merge brings) or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-283-k3, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

**2026-11-04, Software Engineer. DONE. K3 is built on `grugops/ABC-283` and every re-read count equals `…05ef9fc9`. Commits: claim `5f35a832`, merge `3922394e`, code `9e81db85`, tests `ab0a37b6`, then this records commit. Nothing pushed or merged into main, no game played, nothing left running.**

- **Build (decision `…0ea55b6c`):**
  - `orderKey` returns `history ? Math.max(0, HISTORY[historyIndex(move)] as number) : 0`;
  - the tier comment and the doc comment say "history promotes, never demotes (ADR-0063 d4, dated 2026-11-04)";
  - no other production line changed.
- **Re-pins, old → new:**
  1. **The order row (ruled):** `killer, plain[7, 8, 9, 11..19], plain[5, 6, 0..4]` → `killer, plain[7], plain[0..6, 8, 9, 11..19]`, plus a negative-equals-zero assertion.
  2. **Not in the build lines:** the ADR-0066 KRK aspiration row now fails high at iteration 6, not 5. Under K3 the head, the no-aspiration door and the all-off door all read d5 632 and d6 mate, so the head finds the mate when the door does. ADR-0066 d9's "5 or later" holds.
  3. **Not in the build lines:** the d8 instrument row, "information, not a bar", changes 514 521 / 703 710, 222 273 / 97 096 → 523 847 / 707 548, 234 214 / 101 425. These are `…05ef9fc9` R3's figures.
  - Re-pins 2 and 3 are the Orchestrator's to accept, against the ruling's "one re-pin".
- **Bars (observation `…d1c74042`):** the outputs are line-identical to arch's K3 outputs.
  - Floor: `search()` d5 0 / 190, `chooseMove` d5 0 / 188; older rows 0 / 0 / 0 / 0; d6 report 2 / 209.
  - P0 6 / 6, zugzwang 7 / 7, G1 54 / 58 with none new.
  - Drift max 28 / 27 cp (≤ 42).
  - d8 ratios 0.8657 / 0.5758 / 0.9234 / 1.1595; lifetime 77 / 28.
  - typecheck, lint and build 0; skip count 0.
  - `npm test` 2 665 / 2 665. Over 6 interleaved pairs the head median is 9.81 s against a base median of 9.43 s. ≤ 10 s is MET; it is above R-N8H-1's 9.5 s trigger, which is noted.
  - Every deep lane is green; the ladder was not run (games). R-281-a's four `-t` lines read 4 / 1 / 1 / 1 passed.
- **Artifacts:** observation `…6fdd5bf3`.
- **Next:** ABC-283 → In Review → `qe-ABC-283`.
