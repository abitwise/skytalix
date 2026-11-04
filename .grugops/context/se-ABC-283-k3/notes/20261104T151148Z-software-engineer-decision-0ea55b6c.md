---
id: 20261104T151148Z-software-engineer-decision-0ea55b6c
kind: decision
by: software-engineer
at: 2026-11-04T15:11:48Z
verified_by: 
confidence: high: the build follows lines 1–5 exactly; the two extra re-pins are measured and explained, and the Orchestrator rules on them
refs:
  - se-ABC-283-k3
  - grugops/ABC-283
  - ABC-283
  - ADR-0063
  - ADR-0066
  - ADR-0064
  - K3
  - F2
  - P0
  - G1
  - R-283-LMR
  - R-281-a
  - NFR-008
  - R-N8H-1
  - arch-ABC-283-mate
  - 05ef9fc9
  - c8e90c3c
  - orch-2026-10-30a
  - 6c6fb0be
  - 3922394e
  - 9e81db85
  - ab0a37b6
  - 09694a4e
  - src/search.ts
  - src/search.bundle.test.ts
supersedes: 
seal: sha256:3d77372a98b10e5ca19ee33e40223c486c0c91c379ac31ca8b7f2fdde6a9e256
---

# se-ABC-283-k3 built K3 on `grugops/ABC-283`, per build lines 1–5 of arch-ABC-283-mate `…05ef9fc9` and Orchestrator ruling `…6c6fb0be`. There are three test re-pins, not one. The two extra re-pins are named below for the Orchestrator to accept or reject.

## Step 0
- `git merge --no-ff grugops/arch-ABC-283-mate` → merge commit `3922394e`. It was clean: no conflict, no rewrite.

## Build line 1 (commit `9e81db85`)
- `src/search.ts` `orderKey`'s last line: `return history ? Math.max(0, HISTORY[historyIndex(move)] as number) : 0;`.
- The tier comment above `HASH_MOVE_KEY` now says: "a quiet move's key is max(0, its cell): history promotes, never demotes (`ADR-0063` d4, dated 2026-11-04)". The key range now reads [0, `HISTORY_BOUND`].
- `orderKey` had no doc comment, so a two-line one was added with the same sentence.
- No other production line changed: no `engine.ts` edit, no export change.

## Build lines 2–4 (commit `ab0a37b6`, `src/search.bundle.test.ts`)
- **The order row (re-pin 1, the ruled one).** Old → new:
  - title: "…by their cells…" → "…by max(0, cell)…";
  - expected order: old `killer, plain[7, 8, 9, 11..19], plain[5, 6, 0..4]` → new `killer, plain[7], plain[0..6, 8, 9, 11..19]`;
  - the cell pin (−13 ×5, −5, −9, +9, 0) and the switch-off assertion are unchanged;
  - **added:** a negative cell (plain[6], −9) sits immediately before a zero cell (plain[8]) in generation order, and the positive cell (plain[7], +9) sorts above plain[0], [5] and [6].
- **Unchanged and green (line 3):** the source row and the lifetime row. Lifetime is re-read 77 / 28 non-zero cells, as `…05ef9fc9` says.
- **Green with no re-pin (line 4):** both mate-floor rows in the bundle file, ABC-268 A3 (b) (futility 53 / 53), ABC-279 A3 (b) (see 52 / 52) and ABC-269 B2 (taper 169 / 169).

## Two re-pins outside the build lines (deviation; the Orchestrator rules)
- **Re-pin 2, the ADR-0066 aspiration KRK row** `8/k7/8/2K5/8/8/8/1R6 w - - 2 2`, in the default lane:
  - "a mate found at iteration 5" → "a mate found at iteration 6". The root lower bound is now stored at depth 6, not 5: `[5]` → `[6]`.
  - The FEN, move c5c6, score MATE−5 and the door-equality assertions are unchanged, and the non-mate row is unchanged.
  - **Why** (`raw/out/iter-krk-row.txt`): under K3, head, the no-aspiration door and the all-off door all read d5 c5c6 632 and d6 c5c6 29995.
  - As built, history's demotion of the quiet non-mating moves let the head find this mate one iteration before the door. K3 removes that, so the head now finds it when the door does.
  - ADR-0066 d9 asks for "a mate found first at iteration 5 or later", and iteration 6 meets that.
  - `…05ef9fc9` does not list this row.
- **Re-pin 3, the d8 instrument row**, deep and marked "information, not a bar":
  - old 514 521 / 703 710 and 222 273 / 97 096 → new 523 847 / 707 548 and 234 214 / 101 425;
  - the new values are exactly `…05ef9fc9` R3's figures;
  - root move and score are the door's on both roots, as asserted.
- If the Orchestrator holds to "one re-pin", rows 2 and 3 are the ones to revisit. No bar depends on either one.

## Environment fix (not committed)
- The worktree's `node_modules` held only a vite cache, so `src/cli.test.ts` "A2 — the installed vitest…" failed with ENOENT. That failure was environmental, not caused by the diff.
- The directory was replaced by a symlink to the main checkout's `node_modules`, as the sibling worktrees have. After that: 2 665 / 2 665.
