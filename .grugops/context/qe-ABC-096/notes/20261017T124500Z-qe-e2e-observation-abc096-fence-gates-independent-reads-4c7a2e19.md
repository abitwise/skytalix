---
id: 20261017T124500Z-qe-e2e-observation-abc096-fence-gates-independent-reads-4c7a2e19
kind: observation
by: qe-e2e
task: qe-ABC-096
at: 2026-10-17T12:45:00Z
verified_by:
confidence: high
refs:
  - ABC-096
  - ADR-0043
  - plans/tickets/ABC-096-show-the-named-opening-when-the-book-knows-it.md
  - src/book.ts
  - src/render-seam.ts
  - src/cli.ts
  - src/cli.real-engine.test.ts
supersedes:
---

# QE `ABC-096`: the fence, the gates at the tip, and what I read myself

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). Branch
`grugops/ABC-096-opening-name`, tip `2acebaa8`, code `a48da51c`, base `6edadcf0`. Node v26.11.1, darwin-arm64.
**I took no timing reading.** `A4`'s `< 16 ms` and `NFR-007`'s first call `≤ 30 ms` go to Security/NFR.

**The fence.**
- `git diff --name-only 6edadcf0 a48da51c` gives 7 files. All 7 are in § Build contract's table: `src/book.ts`,
  `src/render-seam.ts`, `src/cli.ts`, `src/render-seam.test.ts`, `src/history-pane.nfr.test.ts`, `src/cli.test.ts`
  and `src/book-engine.test.ts`.
- The whole branch adds 3 SE notes, the page and 1 trace row, all delivery records. It adds no source file.
  `src/` is unchanged from `a48da51c` to `2acebaa8`.
- The must-not-change list is byte-identical: `git diff --quiet 6edadcf0 HEAD -- src/frame.ts src/turn-loop.ts
  src/book.test.ts src/book-file.ts src/book-engine.ts src/__snapshots__/ data/opening-book/ tools/` exits 0.
  `package.json`, `package-lock.json`, `vitest.config.ts`, `tsconfig.json` and `biome.json` are unchanged, so no
  dependency moved.
- UAT waiver grep: `git diff --name-only a48da51c~1 a48da51c | grep -v '\.test\.ts$' | grep '^src/'` prints
  `src/book.ts`, `src/cli.ts` and `src/render-seam.ts`. **The waiver does not apply, so UAT is owed.**

**Gates at `2acebaa8`, run in the worktree.**
- `npm run lint`: exit 0, 113 files, no diagnostics. `npm run typecheck`: exit 0. `npm run build`: exit 0.
- `npm test`: exit 0, **58 files / 1822 tests**. `last-run.json`: `success` true, 1822 passed, 0 failed, 0 pending,
  0 todo.
- Base `6edadcf0`, from a `git archive` copy outside the repository: `npm test` exit 0, **58 / 1810**. So the
  change is **+12**, and all 12 are the new `it` rows in `src/render-seam.test.ts`. `src/cli.test.ts` and
  `src/history-pane.nfr.test.ts` add assertions, not rows.
- Skip count: `npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'` gives `0`.
  `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints `No findings.`, exit 0.
- `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: exit 0, **10 passed**, 0 failed. No red to read.
  No `src/cli.ts` child was left running.

**What I read myself, by scratch scripts outside the repository (`scratchpad/qe096/scripts/`).**
- **`A6`: base and tip probe over the same book.** I walked every position reachable by book moves from the start
  position: 5,679 positions, 0 unresolved moves. Both probes used the same seeded `random`.
  - `inBook` differs on 0 positions. `bookMove` differs on 0 positions. Both made the same 5,679 draws.
  - The tip's `openingName` matches the raw artifact's `n` on every position. It returns all 2,853 names, and
    1,764 of them are on entries whose `m` is empty, which equals `ADR-0043`.
  - `openingName` made 0 draws. Neither probe warned.
- **`A1`, `A2` and `A4` over the shipped book.** I put every one of the 2,456 distinct shipped names through the
  real seam, in both modes, and checked it against an oracle I wrote from `A1`'s text, not from the seam's code.
  - 0 mismatches. Every frame has 23 rows and `W` = 21. No `more)` marker appears. The longest shown text is 21.
- **The odd-offset astral case, which the suite does not have** (see `QE-096-a`). In unicode mode, the name
  `"a"` followed by 20 × `U+1D11E` (41 code units) shows `a` + 8 × `U+1D11E` + `...`, which is 20 units and
  leaves no lone surrogate. `Caro-Kann` followed by 6 emoji (22 units) shows 21 units. **The production cut is
  correct.**
- **A real child, bounded.** I ran `printf 'e2e4\nzzz\nquit\n' | node src/cli.ts --colour white --ascii` on a
  scratch copy. It exited 0 and wrote 0 bytes to stderr.
  - The frame after `e2e4` shows `King's Pawn Game`, and so does the frame after the engine's reply.
  - The rejected `zzz` frame shows the rejection line (`type e2e4 or Nf3`) and no name. The `quit` frame shows
    `quit again to end`. That is `A9`'s precedence on a live session.

**The `src/cli.test.ts` reference-frame change.** The test now builds its reference frames over `SHIPPED_BOOK`, a
real `createBookProbe` over the shipped bytes whose `warn` and `random` throw.
- **The change is necessary and correct.** The spawned children read the shipped book, so a frame they draw with
  an empty message region now carries the name. A reference frame built without the book would be red.
- **It is a consistency check, not an oracle for the name.** The children and the reference frames run the same
  seam code over the same bytes. A defect in the seam's cut or precedence moves both sides together, and these
  rows stay green. The oracle for the name is `src/render-seam.test.ts`'s `ABC-096` block, and that block kills the
  seam's cut and precedence mutants, except Q2 (note `…mutants-qe-vs-se-9b3d51f0`).
- The reference frames now follow `data/opening-book/book.json`. A regenerated book moves them with no fixture
  edit. That is the intended coupling, and a failed load throws.

**The stale comment at `src/cli.real-engine.test.ts:405`.** The comment reads *"NON-VACUITY: the engine reached its
ply (the probe is asked only then)"*. Under `ADR-0043` D7, frame 0's `openingName` is now the probe's first call. So
the warning is written just before frame 0, not at the engine's ply. The row's assertions still hold, and it passed
under `CLI_DEEP`. Only the parenthesis is false. **I did not edit it.** The file is outside the code fence, which
names it on neither list. Recorded as `QE-096-c`.
