# arch-ABC-298-probe PLAN: `ADR-0077` d9 step 3, the count probe, sealed before any measured run. G, H and C in `src/engine.ts` `negamax` on a scratch copy, `chooseMove` at `maxDepth` 9 with `now: () => 0` on kiwipete, position-6 and start, one run each. STOP if s = C ÷ G < 0.048 on at least two of the three boards, else GO

Architect/Design, task `arch-ABC-298-probe`, on `grugops/arch-ABC-298-probe` from `main` `090e17d1` (claim `33478ae4`). This plan is the one `ADR-0077` d9 step 3 asks for: *"the count probe, `arch-ABC-298-probe`, as written below, under the host lock. It is untimed, so no held host is needed. Its plan cites this line and is sealed before it runs."* It is sealed and committed **before any measured run**.

**The tree.** `main` `090e17d1`, `src/` tree `bba42fb7`, `package.json` blob `383f4719`. That is the `src/` tree `ADR-0077` was written on (`36baff11`) and accepted on (`3458e31c`, merged `af4258fe`). It is unchanged at `8c98c8ff` and `090e17d1`.

## Terms
The terms are d9's, used once. The probe makes no V3 code and reads no SG1 or SG3 figure. It cannot move a gate, bar, rule or order step.

- **Boards:** kiwipete `r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1`, position-6 `r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10`, start `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`. These are the FENs of the S2 instrument (`qe-ABC-254-a4v2` `raw/qe-scripts/probe.mjs`).
- **Depth and budget:** `chooseMove(position, { budgetMs: 1e9, now: () => 0, maxDepth: 9 })`. No `maxNodes`. With `now` fixed at 0 the deadline never falls, so every run reaches depth 9. d9 names no `budgetMs`. In `deepen` it enters only the deadline, `start + min(budgetMs, HARD_CEILING_MS)`, and no `softMs` is passed, so with `now` at 0 no limit can fire for any positive budget.
- **One run each,** one fresh process per board and copy, under the host lock, on one core.
- **Counts,** in `src/engine.ts` `negamax`, the shipped `chooseMove` path that SG3 times. Every node `negamax` sees is below the root; the roots are `runIteration`.
  - **G:** full-width nodes below the root that reach `legalMoves` today. Counted just before `const moves = legalMoves(position)`.
  - **H:** of those, the nodes inside d1's gate whose `entryMove` is not null. In `src/engine.ts` the table is always on and the ordering always `"full"`, so d1's gate there is "the probe hit and the remaining depth is 1 or 2". A non-null `entryMove` implies the hit. Counted after `entryMove`, by remaining depth.
  - **C:** of H, the nodes whose hash move cut off at index 0. Counted at the cutoff when `hashMove !== null`, `index === 1` (the first move searched) and the cutter is the hash move. Futility and the move-count rule never skip index 0.
  - **INFO:** G, H and C at every remaining depth 1–9, and the node count. H and C at remaining 3 and above show what the gate costs. They play no part in the rule.
  - **H and C at the gate** are the sums at remaining 1 and 2. **G** is the sum over every remaining depth.
- **The share:** s = C ÷ G, per board, compared unrounded.

## The rule, word for word (d9)
> **The rule, fixed now.** **STOP if s < 0.048 on at least two of the three boards.** Then V3 cannot reach 1.03 on two boards, and it closes as "none", with no freeze and no build. Otherwise GO, to step 4.

And d9's limits: *"What GO means: only "it can pay". It says nothing about the bar, and no figure of it enters SG3."* A STOP is F5 and, by the owner's ruling at d12 (`…44810861`, question 2), ends V3.

## Instrument
- **Copies,** outside the repository, under `<scratch>/<home>/<repo>/abc298-probe/`. Each is `git archive 090e17d1 src package.json`, with no `node_modules` (`src/`'s non-test files import only `node:` built-ins).
  - **`main`:** unpatched. Checked before this seal: all 121 files under `src/` equal `main:src`'s blobs (tree `bba42fb7`), no file extra, and `package.json` equal.
  - **`count`:** the same, with `patch_count.mjs` applied. It changes `src/engine.ts` only: four lines, each one increment of a module-level `Float64Array` (G, H, C by remaining depth; X, the instrument check), plus four exports at the end of the file. The diff is `raw/out/count.diff`. No value, branch, call or allocation of the search changes.
  - **The instrument check X**, expected 0 on every board. X[0] counts a node with a hash move that the sort did not put first. X[1] counts a cut at index 0 by a move that is not the hash move, at a node that has one.
- **Scripts,** in this task's `raw/scripts/` as they will run. sha256:
  - `patch_count.mjs` `020666075e67a9d642d2a9fc4323fe9f3db30c33ed0a643fa203947376f96129`
  - `probe.ts` `bed557ffe9143f4447d5e33ca3f623381ec99b832e0546be4ba6e6b2ae371d40` (the same file in both copies)
  - `batch.sh` `54c87bb8eb0753268ba73c71f110686736a1776ec4d967bad44a8f7233ded1da`
  - `analyse.mjs` `fddb26d20a40c22987176cafbcbddd991de70faf983ec49850c2eab4fa7e3cfe`
- **Copies, sha256:**
  - `main/src/engine.ts` `cb65eaf4df5d7e6afbd107736d9f73e16c996ef050f3e0f83a1904dd4f960e06`
  - `count/src/engine.ts` `96e492e8c1001b496c29d4b99d8f58b2cce4f245c41d8f2bc3539f5799d28a03`
  - every file of `src/` and `package.json`, `sha256sum` sorted by path and hashed again: `main` `45955ed0246ae56a42fcb0db6ea2dd9f584c66e3e127bc414026c09b4e71c8f6`, `count` `70d78324eb8f168f99f341b1ba63e1c7bcfb17f2c1d8acc198e17751e0dd877c`
  - `raw/out/count.diff` `b3b4b3922fbcb22bcc0b2edf36f11db6324495fedbef2a2b3532f7c966ecfdd0`
- **No timing.** `probe.ts` reads no clock and prints no `elapsedMs`. The lock log records each batch's start and end UTC, for lock use only. No speed figure is taken or reported.

## Run order
- **Batch P, once:** `flock <scratch>/<home>/<repo>/host-test.lock taskset -c 0 bash batch.sh <scratch>/<home>/<repo>/abc298-probe`. Boards in the order kiwipete, position-6, start. Each board runs `main`, then `count`, in fresh processes, one at a time.
- **Then `analyse.mjs` once,** on the outputs. It reads identity **first**:
  - both exits 0;
  - `count`'s depth, nodes, score and move equal `main`'s;
  - both positions restored;
  - X = 0, 0;
  - no count at remaining 0 or 63 and above;
  - G's sum at most the node count.
  If any of those fails, it prints `DEFECT`, prints no G, H, C or s, and exits 3. Only when identity holds on all three boards does it print G, H, C, s and the rule's word.
- **What ran before this seal:** none of it reads a count. `patch_count.mjs` once on `count`, and one load-only smoke of `count` (it imports `src/engine.ts` and checks the exports exist; no search). Both ran under the lock, on one core, a few seconds in all.

## After the reading
- **No re-run after a reading.** The rule's word stands as `analyse.mjs` prints it.
- **An instrument defect gets one fix, under a sealed addendum.** A defect is an identity failure from `analyse.mjs` (it prints no count), or a fault in a script found before the reading. The addendum names the fault and the fix, with the new sha256s. It is sealed and committed before batch P runs again. One fix only: a second defect ends the probe with no word, and goes to the Orchestrator.
- **Results:** one `decision` note with G, C and s per board, H and the INFO counts, the identity check, and GO or STOP by this rule. Then one dated line in `ADR-0077` d9 with the outcome.
- **Fences:** no `src/`, ticket, EPIC or board edit. No held host is taken. No push, force, amend, rebase or merge into `main`.
