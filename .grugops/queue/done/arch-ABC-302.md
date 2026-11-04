---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T17:35:38Z
subtask: arch-ABC-302
role: architect-design
ref: .grugops/context/arch-ABC-302/
branch: new grugops/arch-ABC-302 from main — worktree .claude/worktrees/arch-ABC-302
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Mutant reads on scratch copies only; ≤ 1 h of runs. Host paths only as placeholders.
---
# Design ABC-302's remnants (form S): the nine rows, kill parity, R8/R9 placement
Read plans/tickets/ABC-302*.md (R1–R9, A4, A6, A8, the owed list), the Security/NFR decision …1184fec4, ADR-0046 § Dated 2026-11-04 (form S, R-281-a's rule) and the arch-ABC-281 records as the precedent.
1. For each of R1–R9, give a form and a default-lane remnant confirmed by mutant reads (default-lane kill parity), or "move whole" only with measured kill parity. Put the mutant list in a PREREG sealed before the reads; QE freezes it as A6.
2. Place R8 (cli.test ABC-241 A4) and R9 (engine.capacity ABC-122 A8) in existing lanes. R9's file mocks legal/zobrist/search, so choose (i) rewrite it mock-free, (ii) gate it under ENGINE_DEEP in its own file, run only by its -t line (check whether that counts as a new lane line under the no-new-lane rule), or (iii) keep it in the default lane. Confirm R8 still runs the real search if it is placed in uci-session. Check whether R6/R7 are already covered by ABC-281's QE-087-d slice.
3. Give each row's -t line with its expected passed count, for A4 and for the ADR-0046 run rule.
4. Write a dated line in ADR-0046 (form S, ABC-302) with the rows, forms and lanes.
The Orchestrator rules A8's 9.4 s as a target, not a hard bar, per BA/PM's routing. The within-ticket offset allowance is NOT adopted.
Fences: memory-bank/50-decisions, your records, scratch. No committed src or test changes; no ticket, EPIC or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-302, contextRoot = the worktree's .grugops/context, `at` from `date -u`), including a decision note with the owed lines for BA/PM (DoR row 10) and the SE build lines; queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-04T18:13:30Z. Records plus scratch mutant reads.
- **How the reads were run.**
  - On a `git archive` copy of `b84613c1` (`src/` tree `af2b77dc`, which is `main`'s), under the host lock. About 17 min of runs.
  - The PREREG `…23abb6c5` (28 mutants and the form rules) was sealed and committed at `85b227b5`, before the first mutant read.
  - Nothing was written to `src/` or `tools/`. The ticket, EPIC and board are untouched. Nothing is left running.
- **The forms.**
  - **S:** R1, R2, R4, R5, R8 and R9. **W:** R3, R6 and R7. No K.
  - The remnants: R1 is the in-check root plus position-5 at depth 4. R2 and R8 run on a 500 ms virtual step, depth 8, and R8 asserts depth ≥ 5. R4 walks 1 ply. R5 uses a 10 000 ms counting clock. R9 uses a clock spent after `2 * ITERATIONS` root passes.
  - Remnant cost is 100 ms of the rows' 948 ms in-thread.
- **Parity.**
  - Base reads 2 687 / 2 687 and the tip sketch 2 684 / 2 684 (base − 3 W), over 71 files.
  - The tip's default lane kills all 27 killed mutants, and each S remnant kills its row's A6 mutant. Each of the nine `-t` lines prints 1 passed, and 1 failed under its A6 mutant.
  - **Single-held at base:** M2 by R2, M8d by R2 and R8 together, M9 and M9r by R9.
  - **R3 kills none.** Its doors also turn off taper, SEE, history and aspiration.
  - QE-244-a's five are still killed by CLI A7, CLI ABC-230 A1 and R8's remnant.
- **R8** goes to `src/uci-session.test.ts`'s `ENGINE_DEEP` block. It reads the real search there: it passes after the file's stubbing describes, and fails under REP0 and M8d.
- **R9** takes option (ii), a gate in its own file. It needs no `AGENTS.md` line, environment variable or file, and its `-t` line joins ADR-0046's run-rule table. A2 is waived for R9 by name (a new constant on the existing variable).
- **Forecast:** about −0.50 s of wall (the −0.555 s probe × 0.89). `main` lands near 9.3 s.
- **Records.**
  - `ADR-0046`: a Status pointer, and § Dated 2026-11-04 (`arch-ABC-302`).
  - Notes: PREREG `…23abb6c5`, observation `…8c8cfeed`, decision `…bcadd41d` (the owed lines for BA/PM's DoR row 10, and the SE build lines).
  - `raw/` holds the scripts, kill sets, matrix, counts and probes.
- **Owner question: none.** `R-302-a` is closed. Board moves are the Orchestrator's.
