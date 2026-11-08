---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T22:03:52Z
subtask: arch-ABC-298-stop
role: architect-design
ref: .grugops/context/arch-ABC-298-stop/
branch: new grugops/arch-ABC-298-stop from main — worktree .claude/worktrees/arch-ABC-298-stop
width: records only (ADRs). A ruling on se-ABC-298's STOP. Nothing run. No src, test, ticket, EPIC or board.
---
# ABC-298: the Engineer's STOP on three source-shape rows
Read se-ABC-298's notes on branch grugops/ABC-298 (tip 0123e893): …999b2535 (the stop), …db1b4b5c, …0c57c9f0; the diff `git diff 6f943726 0123e893 -- src`; the three red rows in src/search.bundle.test.ts (ABC-283 (h) source count) and src/search.null-move.test.ts (no storeEntry( before legalMoves, both files); ADR-0063/ABC-283 and ADR-0050 (or whichever ADRs those rows serve); ADR-0077 d1, d3, d6 SG1 (c), d12, F2; how ABC-303 re-pointed rows in place; my note at 2026-11-08T22:03:52Z under orch-2026-10-30a.
1. Rule: for each row, what property it protects. Is it an identity row in ADR-0077's sense (F2 / d12, which ends V3 by the owner's word), or a record of the old code shape whose property still holds on the build and which a dated ruling may re-point in place? Say what the re-pointed row must still prove, word for word, so no property is lost. If any row's property does not hold on the build, it is F2: say so.
2. The engine.ts / search.ts export question (src/search.test.ts A6 freezes the export list): is a new export allowed, or must the build stay as the Engineer left it?
3. The `list.slice(1)` per non-cutting gated node: is it within d1–d3, and does it cost SG3? If a non-allocating form is required, name it.
4. Information: the default lane read 25.97 s at one worker on the build. Is there a one-worker figure for main on record to compare? NFR-008 stays QE's read on its own instrument; no ruling needed unless the figure points to a defect.
5. ADR-0077 d8 calls ABC-299 the 400-game close read; ABC-299's page is R3, 200 games against Stockfish. Correct the wording by dated line.
If the answer is F2, say so plainly: V3 closes as "none". No bar moves. Fences: ADRs and your records. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.

## Result

**2026-11-08, Architect/Design. Records only, on `grugops/arch-ABC-298-stop` from `main` `e3113742`. Text of record `a1085151` (`ADR-0077` dated lines); note `…251b60bb` (decision), sealed. No test, build or engine was run, and the only reads of the build (`grugops/ABC-298` `0123e893`) were text reads. No `src/`, test, ticket, EPIC or board edit. Nothing pushed or merged. No gate, form, value, bar, spread rule, stop rule or order step moved.**

1. **The STOP is not F2, and V3 continues.**
   - The three red rows read the shape of the source, not what the search does.
   - Each row's property holds on the build:
     - `ADR-0063` d2: history is updated at most once per node, at a beta cutoff, behind the switch. Each recursion now has two sites, and the hash move's site returns.
     - `ADR-0050` d7: the null cut stores nothing. The null block is unchanged, and the one store in the gap is d3 item 10's hash-cutoff store.
   - **The rows are re-pointed in place by d6's dated line, word for word, with titles unchanged:**
     - R1's counts become 3 / 2, and the new site's full literal is pinned.
     - R2 and R3: the null block, up to `const gated =`, stores nothing; there is exactly one store in the gap; and it is the hash-cutoff store.
     - Four lines come out, two per file.
   - The ruling covers these rows only, and F2 stands for every value row and for `G4`.
   - The fault was the ADR's: SG1 (c)'s "changes none" could not be met by any build that keeps d1.
2. **No new `src/search.ts` or `src/engine.ts` export** (d2's line). The build stays as the Engineer left it.
3. **`list.slice(1)` is within d1**, and it adds no fixed structure, so `NFR-009` and `G7` are not touched. Its cost is at most about one more `moves.slice()` at H − C nodes (4.6–5.8 % of G); the reading is `UNKNOWN - verify`. **A non-allocating form is not required.** An index loop would redden the futility source row. The slice stays (d1's line).
4. **Lane time:** no one-worker wall for `main`'s freeze tree is on record. Readings on other trees span 17.74–27.16 s, ungraded. The build's 25.97 s is information only, with no sign of a defect. `NFR-008` is QE's read.
5. **d8 corrected:** the 400-game close read is `EPIC-011` G7 (`ADR-0056` C3″, head to head). `ABC-299` is R3, 200 games against Stockfish.

- **Next, if V3 continues:** the Engineer, on `grugops/ABC-298`:
  - makes the four-line re-point in its own commit, citing d6's line;
  - re-reads the default lane (2 782 / 2 782), `search.bundle` (56 / 56) and `search.null-move` deep, plus typecheck, lint and build;
  - runs `G4` against the frozen digest (about 36 min of lock), where a difference is F2;
  - runs the rest of the owed deep lanes.
  - Then QE's hop, which admits exactly those four removed lines at SG1 (c).
- **Path check:** `node tools/grugops/records-path-check.js --base main`, recorded below.
