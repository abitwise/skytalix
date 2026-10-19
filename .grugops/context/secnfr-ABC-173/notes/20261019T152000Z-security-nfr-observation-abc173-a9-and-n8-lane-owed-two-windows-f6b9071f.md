---
id: 20261019T152000Z-security-nfr-observation-abc173-a9-and-n8-lane-owed-two-windows-f6b9071f
kind: observation
by: security-nfr
task: secnfr-ABC-173
at: 2026-10-19T15:20:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-173
  - NFR-008
  - ADR-0008
  - ADR-0035
  - R-173-1
  - R-173-2
  - R-167-2
  - R-171-1
  - QE-173-g
  - .grugops/context/secnfr-ABC-173/probe/window.mjs
  - .grugops/context/secnfr-ABC-173/probe/window1.out
  - .grugops/context/secnfr-ABC-173/probe/window2.out
  - 20261019T145000Z-qe-e2e-observation-abc173-a9-and-n8-lane-owed-c9e4a7d1
  - 20261019T132000Z-security-nfr-observation-abc171-n8-lane-owed-22a93cd8
supersedes:
---

# `ABC-173` `A9` and `N8-LANE`: both **OWED**. Two more foreground windows were foreign in every poll. Nothing was timed or estimated

Hand-authored and unsealed.

## The windows
- **Script:** `probe/window.mjs`, which is `qe-ABC-173/probe/window.mjs` with only the self-exclusion path changed
  (diff in this hop's transcript: line 1's comment and the `includes(...)` string). Foreign means any vitest, any
  `oeselg-labs/platform` process, or any process of another grugops hop of this project.
- **Host:** MacBook-Air.local (Mac15,13, 8 cores), Darwin 25.5.0, Node v26.11.1. Each window ran in the foreground,
  with nothing else of this hop live.

| window (UTC start) | polls | foreign polls | what | load1 first / min / max / last |
|---|---:|---:|---|---|
| 2026-10-19T15:07:37.305Z, 180 s | 181 | **181** | `oeselg-labs/platform/…/dist/main-worker.js`, pids 40997 and 50110, in every poll | 2.55 / 2.08 / 2.85 / 2.08 |
| 2026-10-19T15:13:08.005Z, 180 s | 181 | **181** | the same two pids, in every poll | 1.92 / 1.70 / 2.45 / 2.05 |

- Spot checks at 15:04:21Z and 15:06:54Z saw the same two pids, up about 3 h 54 min. I did not touch them.
- **Together with QE's two windows** (14:41:49Z and 14:45:40Z, `…c9e4a7d1`), four 180 s windows on this ticket have
  been foreign in 724 of 724 polls.
- **Verdict:** no quiet window. I started no base, head or twin arm, and no `A9` round. **`A9` is OWED and `N8-LANE` is
  OWED.** The full-lane `F` (1.72 s CPU / 3.25 s wall) stays as recorded, labelled pre-cap.
- **Not a timing reading:** this hop ran vitest 7 times in its scratch worktree, all for `SEC-173-1`. Six runs were
  guard refusals (unprefixed), and one was the as-spelled skip-count capture (1924 tests). Three ran at about 15:05Z,
  before window 1, and four at 15:16:27Z, after window 2 ended. None ran during a window. No wall or CPU figure was
  taken from them.

## Can merge carry them on an owner word? **Yes, both, as R-173-1 and R-173-2 (LOW), but only on Olger Oeselg's word**

- **Why it needs his word, not the Orchestrator's:** the owner-accepted addendum (Ruling 5) orders both readings
  **before** merge. Carrying them changes that order. That is a change to an accepted ADR, so it is his to make, as
  R-167-2 and R-171-1 were.
- **Why it is safe to carry:**
  - **The readings are on fixed trees, so a later window loses no attribution.** The `N8-LANE` arms are
    `git archive 68bbf33f` (base and twin, base's unprefixed command) and `git archive 9c97dd23` (head, the prefixed
    command). `A9` is `npm test` on the `9c97dd23` tree. A window after the merge reads the same charge as one before
    it, even if `ABC-171` merges in between.
  - **The outcome cannot reverse the merge.** Under the owner's Q4, *"the cap does not give way"*: a wall over 10 s
    goes to him, and the cap stays. Carrying changes **when** he learns the figure, not what is merged.
  - **The failure mode is a slower local loop.** Nothing is deployed, and no user is exposed (`deploy: none-local-only`).
- **Stated plainly, how this differs from R-167-2 and R-171-1:** those were row-local deltas to one file with 0 spawns.
  `ABC-173` is **lane-wide**:
  - every isolate in `npm test` drops from Node's default 4192 MiB to 224 MiB, so GC pressure may change across all
    59 files;
  - it adds 1 child (`N8_SPAWN` 27 → 28);
  - it adds TypeScript-parser scans of every `src/**/*.test.ts` (`C2`, `A6 (static)`);
  - the narrow set holds 5 files.

  So the unmeasured quantity is the whole lane's wall against the 10 s bar, and the whole narrow set's CPU against
  650 ms. **Both are `UNKNOWN - verify`.** The last admissible full-lane walls on record (6.52 / 7.16 s) were taken on
  vitest 3.2.7 before the cap, and do not stand in for this reading.
- **Discharge:** the first admissible quiet-window reading of each, by `ADR-0035`'s instrument with a twin. QE's
  staged harness (`qe-ABC-173/probe/lane173.mjs`, `readout173.py`, `readout-a9.py`) is reusable, with one change:
  **its head arm `H`/`H2` was archived at `840ebbf7` and must be re-archived at `9c97dd23`.** The narrow set is
  unchanged, because the fix touched only `src/cli.test.ts`, which is already in the set: `src/cli.test.ts
  src/cli.real-engine.test.ts src/engine.test.ts src/line-input.test.ts src/uci-session.test.ts`.
- **Do not conflate:** one reading on the combined `ABC-171` + `ABC-173` tree would charge `R-167-2`, `R-171-1` and
  `ABC-173` together on `src/uci-session.test.ts`. Read `ABC-173`'s arms on its own trees.
- **Independent of this, and not carriable by word:** `QE-173-g`. Whichever of `ABC-171` and `ABC-173` merges second
  must re-run every `AGENTS.md` lane, as spelled, on the combined tree before it merges. `ABC-171`'s +533 test lines
  have never run under the cap. That is a pass/OOM count (A7's kind), not a timing reading, and it needs no quiet
  window.
