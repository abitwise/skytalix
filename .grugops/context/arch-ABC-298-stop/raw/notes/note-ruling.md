# arch-ABC-298-stop: se-ABC-298's STOP is not F2. Three source-shape rows are re-pointed in place, word for word. V3 continues

Architect/Design, task `arch-ABC-298-stop`. Records only, on `grugops/arch-ABC-298-stop` from `main` `e3113742`. The text of record is `ADR-0077`'s dated lines in commit `a1085151`.

**What was read:**
- the Engineer's notes `…999b2535` (the STOP), `…db1b4b5c` and `…0c57c9f0` on `grugops/ABC-298` `0123e893`;
- `git diff 6f943726 0123e893 -- src`;
- the three red rows;
- `ADR-0063` d2 and `ADR-0050` d7;
- `ADR-0077` d1, d3, d6, d8, d12 and F2;
- `ABC-303`'s in-place edits (`de1adcc5`);
- `ABC-299`'s page and `EPIC-011` G7;
- the Orchestrator's note `…3b6b5ec3`.

**Nothing was run:** no test, build or engine. The only reads of the build were text reads of `src/` at `43fe357e`: each literal below was checked against the source, flattened as each test file flattens it.

## 1. The three rows: source-shape rows, not identity rows. Not F2

**Identity in `ADR-0077`** means what the search does: the nodes, their order, the moves, the scores, the clock reads and the door outputs. That comes from d3, § The pins this ticket moves, and the owner's question 1 as he was shown it: "the same positions … in the same order … the same move at the same depth … checked by exact counts". F2 and d12 guard that, and his question 2 ends V3 on it.

**What the rows read.** They read where calls sit in the source. d1 step 5 and d3 item 10 move that text by design.

**The fault is the ADR's.** As written, SG1 (c)'s "changes none" could not be met by any build that keeps d1. d6's "each can be met by a correct build" was wrong for these three rows, and I missed them when I listed the rows the build touches.

**Each row's property still holds on the build:**
- **R1, `src/search.bundle.test.ts` "ABC-283 (h) … source: each negamax updates once, at its beta cutoff, behind the switch; …".** The property is `ADR-0063` d2: history is updated only at a main-tree beta cutoff, behind the switch, at most once per node, and never in quiescence, at the root or on a null-move cutoff.
  - On the build, each recursion has two call sites, each in a beta-cutoff block behind the switch.
  - The hash move's site returns, and the loop runs only after it, so a node still updates at most once.
  - Quiescence, the clears and the `HISTORY` write and fill counts are unchanged.
  - **The property holds.**
- **R2 and R3, `src/search.null-move.test.ts` "both recursions try the null move … and return beta", `./search.ts` and `./engine.ts`.** The property is `ADR-0050` d7: the null cut returns beta, never the null score, and stores no table entry.
  - On the build, the null-move block is unchanged and holds no `storeEntry(`.
  - The one store between it and `legalMoves(position);` is the hash move's cutoff store that d3 item 10 requires.
  - **The property holds.**

**Ruling:** re-pointed in place under `ADR-0077` d6's dated line. Not F2, and V3 continues. `ADR-0063` and `ADR-0050` are not amended.

## The re-point, word for word (the Engineer makes it in its own commit, citing d6's dated line; titles unchanged)

**R1, two lines out:**
- `expect(search.match(/recordHistoryCutoff\(/g)).toHaveLength(2); // the declaration and negamax`
- `expect(engine.match(/recordHistoryCutoff\(/g)).toHaveLength(1);`

**R1, lines in:**
- `expect(search.match(/recordHistoryCutoff\(/g)).toHaveLength(3); // the declaration, the loop's cutoff, the hash move's cutoff (ADR-0077 d3 item 10)`
- `expect(engine.match(/recordHistoryCutoff\(/g)).toHaveLength(2); // the loop's cutoff, the hash move's cutoff`
- `expect(search).toContain("if (prune && Math.max(alpha, hashScore) >= beta) { if (switches.history) { HASH_CUTTER[0] = hashFirst; recordHistoryCutoff(position, HASH_CUTTER, 0, depth, false, previousCut); } killers.record(ply, hashFirst); storeEntry(key, depth, boundOf(hashScore, alpha, beta), hashScore, ply, hashFirst); return hashScore; }");`
- `expect(engine).toContain("if (Math.max(alpha, hashScore) >= beta) { if (budget.history) { HASH_CUTTER[0] = hashFirst; recordHistoryCutoff(position, HASH_CUTTER, 0, remaining, false, previousCut); } budget.killers.record(ply, hashFirst); storeEntry(key, remaining, boundOf(hashScore, alpha, beta), hashScore, ply, hashFirst); return hashScore; }");`

Every other R1 line stays.

**R2 and R3 (one `it` body), two lines out:**
- `// The cut: beta, never the null score, and no table store between the gate and the moves.`
- `expect(block, path).not.toContain("storeEntry(");`

**R2 and R3, lines in:**
- `// The cut: beta, never the null score, and no table store in the null move's block. The one store between it and the moves is the hash move's cutoff (ADR-0077 d1 step 5, d3 item 10).`
- `const v3 = block.indexOf("const gated =");`
- `expect(block.indexOf("if (nullScore >= beta) return beta;"), path).toBeGreaterThan(-1);`
- `expect(v3, path).toBeGreaterThan(block.indexOf("if (nullScore >= beta) return beta;"));`
- `expect(block.slice(0, v3), path).not.toContain("storeEntry(");`
- `expect(block.match(/storeEntry\(/g) ?? [], path).toHaveLength(1);`
- `` expect(block.slice(v3), path).toContain(`storeEntry(key, ${depth}, boundOf(hashScore, alpha, beta), hashScore, ply, hashFirst); return hashScore;`); ``

The `const block = …` line and the `return nullScore` line stay.

**Checked on `43fe357e`, text only:**
- Each `toContain` literal matches once.
- The counts read 3 and 2.
- `const gated =` appears once per file, after the null cut.
- The null-move part holds 0 stores, and the gap holds exactly 1.

**What QE reads at SG1 (c):** `git diff <freeze>..<head> -- 'src/*.test.ts'` removes exactly these four lines, two per file, and nothing else.

**What this ruling does not cover.** These three rows only. Any other red row, a source row included, comes back to the Architect. F2 stands as written for every value row, door row and deep pin, and for `G4`, which is not yet read.

## 2. The export question: no new export. The build stays as left

- d2 names one new export each in `src/moves.ts`, `src/legal.ts` and `src/transposition.ts`.
- The build has exactly `generateMovesFrom`, `legalMoveFrom`, and `entryMoveLegal` with `HASH_FIRST_DEPTH_LIMIT`. d1 names the constant and leaves its home to the Engineer.
- `src/search.test.ts` A6 pins `src/search.ts`'s export list, and every name added to it so far was named by an ADR decision. `ADR-0077` names none there.
- Nothing needs a new export: the engine already imports `recordHistoryCutoff`, and the re-point settles the rows.
- **A new `src/search.ts` or `src/engine.ts` export is not allowed under this ADR.** This is d2's dated line.

## 3. `list.slice(1)`: within d1–d3, not required to change

- **It is d1 step 6.** The loop starts at list position 1, with `index` 1, and the cutoff's `recordHistoryCutoff(position, list, index - 1, …)` still indexes the full list.
- **It is not a fixed structure.** It is one transient array per gated node whose hash move does not cut. `NFR-009` gets no line, and `G7` stays 0.
- **How many nodes pay it.** Those nodes are H − C in the probe (`…d097e25f`): 4 225 / 1 162 / 844, which is 5.7 % / 4.6 % / 5.8 % of G.
- **What each one costs.** Each already allocates the generated list, the filtered list and `orderMoves`' `moves.slice()`. The slice adds at most about one more such copy. By arithmetic that is well under S2's resolution. The reading is `UNKNOWN - verify`.
- **A non-allocating form is not required, and the build keeps the slice.**
  - An index loop would redden `src/search.futility.test.ts`'s source row: the loop must open `for (const move of ` with the futile skip first. That row is not re-pointed.
  - SG3 grades the build as it stands. This is d1's dated line.

## 4. Lane time (information, no ruling)

- **No one-worker default-lane wall for `main`'s freeze tree is on record.** QE's freeze ran the lane whole with one worker inside hold 5 (`qe-ABC-298-freeze` `raw/out/holds.txt`) but kept no per-part wall: "this hop takes no timing figure".
- **The one-worker walls on record are on other trees, ungraded and not comparable:**
  - `se-ABC-304` `…26228fe3`: 26.68 s, 2 684 rows, one core;
  - `qe-ABC-304` `…7d4a7c7f`: 27.16 s on one core, same tip;
  - `se-ABC-301-fit` `…358b29b1`: 17.74 s, 2 685 rows.
  They span about 50 % across conditions, so they cannot grade a +0.10 s bar.
- **The build's 25.97 s falls inside that span.** The 48 new default rows took 48.7 ms in-thread, by the run's own durations.
- **Nothing points to a defect.** `NFR-008` stays QE's read on its own instrument (d11).

## 5. `ABC-299` wording: corrected by a dated line at d8

- `ABC-299` is **R3**: `EPIC-011` G2's milestone reading after Phase 5, 200 games at 100 ms against Stockfish 19 `UCI_LimitStrength`.
- **The epic's 400-game close read is `EPIC-011` § Success measures G7** (`ADR-0056` C3″): head to head at 100 ms, closing build against starting build, QE alone before the close. It has no ticket id on record.
- d8 now says so. No games are owed by V3 either way.

## What the Engineer does next, if V3 continues (on `grugops/ABC-298`, from `0123e893`)

1. **The re-point, in its own commit** citing `ADR-0077` d6's dated line (`arch-ABC-298-stop`). Make exactly the four-line change above, with no title changed and no other test line touched.
2. **Re-read under the host lock, one core, one worker:**
   - the default lane whole: expect 2 782 / 2 782;
   - `SEARCH_DEEP` `search.bundle`: expect 56 / 56, with the mate floors as the freeze has them;
   - `SEARCH_DEEP` `search.null-move`, since R2 and R3 also run there;
   - typecheck, lint and build.
3. **`G4`, SG1 (b), against the frozen digest** (`…44a6717d` § 2): run `run-g4.sh` on a `git archive` of the head, then `join.sh`. The result must be `cmp`- and sha256-equal to `g4.jsonl` and `g4-sample.jsonl`. It is about 36 min of lock, inside the owner's 1 h line as one run.
   - **A difference is F2:** defect check first. If no fix inside d1 and d2 makes it equal, V3 ends by d12 and his word, and closes as "none".
4. **The other deep lanes** as the brief owes, each green with no figure changed.
5. **Keep the build otherwise as it is:** no new export, and the slice stays.
6. **Records, then QE's hop** (d9 step 7): stage 0, SG0–SG2, the gates and `NFR-008`, then SG3 and `G6` in one held window.
   - At SG1 (c), QE admits exactly the four removed lines named here.
   - Any other red row is a STOP to the Architect.

No gate, form, value, bar, spread rule, stop rule or order step moved. The owner's word is not reinterpreted: his "identity" is what the search plays and counts, and that is what F2 still guards. If the Orchestrator reads his question 2 as covering source rows, that is the owner's to answer. My recommendation is that no ask is needed.
