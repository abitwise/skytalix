---
subtask: ticket-to-pr-ABC-174
role: software-engineer
tickets: [ABC-174]
branch: grugops/ABC-174 @ be6a5599 (from bd480c99); worktree ../wt-ABC-174
done_at: 2026-10-19T19:00:00Z
result: paused (owner PAUSE order via the Orchestrator). Note: the work was complete before the pause arrived. WIP tip = be6a5599 (the worktree was clean at the pause, so no empty "wip(ABC-174):" commit was made). ADR-0045 D1 table, DEFAULT_LEVEL 5, DEFAULT_DIFFICULTY 5, the Skill Level default read from DEFAULT_LEVEL; every page pin re-pinned at equal strength; no further pin reddened; all brief gates green on be6a5599. Remaining: nothing for the SE. A6 is QE's; NFR-008 reading is QE's; Scribe/Security-NFR items owed. No timing taken. Not pushed, not merged. No run was in flight at the pause.
---

# ABC-174: the level table re-cut per ADR-0045

**PAUSED by owner order. For a resuming engineer:** nothing is left in the SE scope.
- Resume from `be6a5599`. The worktree `../wt-ABC-174` is clean, and its `node_modules` is a symlink to main's (ignored, never committed).
- Done: A1, A2, A3, A4, A5, A7 (data), A8, and every pin below.
- Remaining, all outside the SE: A6 (QE: `ENGINE_DEEP` / `LADDER_DEEP` short), the NFR-008 reading (QE), the board/trace move (Orchestrator), AGENTS.md:59 (Scribe), the NFR-004 catalog lines (Security/NFR), then ABC-175 before UAT.
- The last gate results are in § Gates, all from `be6a5599`.
- If anything changes, re-run every vitest command with its `NODE_OPTIONS` prefix, one at a time.

**Tip:** `be6a5599` on `grugops/ABC-174`, one commit on top of `bd480c99`. 7 files.
I wrote the tests first and watched them red against the unchanged production code:
levels 4 red, uci-session 7 red, cli 4 red. Then I made the production change.

## Criteria
| # | result | evidence |
|---|---|---|
| A1 | MET | `levels.test.ts` "ABC-174 A1": deep-equals D1, and `Object.isFrozen` holds on the table and on each entry. The merged ordering row (A1 "orders the table…") is green and was not edited. |
| A2 | MET | `levels.test.ts` "ABC-174 A2": `[1, 5, 5]` and `LEVELS[DEFAULT_LEVEL]` equals `{ DEFAULT_BUDGET_MS, 0 }`. `cli.test.ts` ABC-101 A2 (folded): `optionsOf([]).difficulty === DEFAULT_DIFFICULTY === Math.max(levels) === HARDEST_LEVEL === DEFAULT_LEVEL`. |
| A3 | MET | `levels.test.ts` "ABC-174 A3": 30 of 30 `THIRTY` endgame positions (the merged set; the row asserts the length is 30). Seeds 1 and 87. Move, depth and nodes are equal against `chooseMove({ budgetMs: 3000 })`. Each side gets a fresh `virtualClock(1000)` (budget/3, the step of the merged A6 row; coarser than 100). `cli.test.ts` "ABC-174 A2/A3": no flag gives `difficulty === 5`. The ABC-101 A8′ rows are green and their assertions are unedited. |
| A4 | MET | numstat over engine/search/virtual-clock/level-seam is **empty** (below). The keys row covers every level. The `-U0` hunks in `levels.ts` touch only the header-comment lines (37-40), entries 2-5 (44-47) and `DEFAULT_LEVEL` (51). Entry 1 is unchanged by D1. The bodies of `createLevel`, `blunder` and `seededRandom` are untouched. |
| A5 | MET | `uci-session.test.ts` "ABC-174 A5": one row builds the option line from `DEFAULT_LEVEL` and a second checks the literal `default 5`. A bare `go` at the default gives a line with `score`, a time within 3000..3200 at step 100, and 0 draws. `go depth 3` at the default gives `depth 3`. At skills 3 and 4, `go depth 3` gives one `info string …depth`, then a level line with no ` score `, then the matching bestmove. ABC-171 A6 table: 1 → 100, 3 → 330, 5 → 3000 under `GO_G3500`. |
| A6 | NOT RUN (QE's) | `ENGINE_DEEP` / `LADDER_DEEP` were not run, as the brief says. |
| A7 | MET (data) | `levels.test.ts` "ABC-174 A7": `LEVELS[DEFAULT_LEVEL].budgetMs === DEFAULT_BUDGET_MS === 3000`; `max(budgets) === 3000 < HARD_CEILING_MS === 5000`; `LEVELS[1].budgetMs / 10 === 10 >= 4`. The R1 clamp row and ABC-087 A5 are unedited. No wall-clock figure is quoted. |
| A8 | MET | `--name-only` gives exactly the 7 named files (below). The `cli.ts` `-U0` hunk is one comment line (`:27`). Every pin is listed old → new in the commit body and below. |

## Pins (line at `bd480c99`, each found by content)
- ABC-087 A1, `src/levels.test.ts:191,193`: title "default 3" → "default 5", and `[1, 3, 5]` → `[1, 5, 5]`.
- ABC-087 A6, `src/levels.test.ts:227-235`: unchanged.
- ABC-101 A2, `src/cli.test.ts:4033-4041`:
  - title "the middle of the level set" → "the maximum";
  - `:4037` `toBe(levels[(n-1)/2])` → `toBe(Math.max(...levels))`;
  - `:4039` `toBeLessThan(Math.max)` → `toBe(HARDEST_LEVEL)`;
  - `:4038` the ruling-2 comment is replaced.
- ABC-061 A2/A3, `src/cli.test.ts:1343, 1352, 1361, 1370, 1379, 1404, 1410`: `difficulty: 3` → `5`. None of these argvs sets `--difficulty`.
- ABC-101 A8′, `src/cli.test.ts:4110-4139` and `:4141-4150`: the assertions are unchanged. The `:4134` comment "level 3 does not" → "the default level does not".
- `src/engine.test.ts:901, :903`: unchanged.
- ABC-167 A1 and ABC-171 A1, `src/uci-session.test.ts:121, :665`: `default 3` → `default 5`.
- ABC-171 A6, `src/uci-session.test.ts:802-803`:
  - `[3, 3_000]` → `[3, 330]` and `[5, 3_500]` → `[5, 3_000]`;
  - the level-1-only precondition → every level with `LEVELS[level].blunderRate > 0`. This is stronger.
- `levelTime`, `src/uci-session.test.ts:643, 647`: `level <= 2 ?` → `LEVELS[level].blunderRate > 0 ?`. The parameter is now typed `keyof typeof LEVELS`.
- ABC-171 A2 read-back, `src/uci-session.test.ts:719`: `levelTime(…, 3)` "still the default level 3" → `levelTime(…, 5)` "the default level 5". The value stays 3000.
- ABC-171 A7, `src/uci-session.test.ts:866, 868`: level 3 → level 5.
- ABC-171 A8, `src/uci-session.test.ts:882, 894`: "level 3 draws none" → level 5, and `value 3` → `value 5`. The page's `:877-893` had drifted.
- ABC-167 A5 default-budget rows, `src/uci-session.test.ts:211-212, 284-285, 412, 448, 453`: the values are unchanged. The `:211` label "capped by level 3" → "capped by the default level 5".
- Comment at `src/uci-session.test.ts:44`: "level 3 never calls" → "the default level (rate 0) never calls".
- ABC-171 A13a-d, `src/uci-session.test.ts:962, 989, 1006, 1033`: unchanged. A13b now also covers levels 3 and 4.
- **Further pins the build reddened: none.**

## Production lines (scopes 1-4)
- `src/levels.ts:37-40` header comment, `:44-47` entries, `:51` `DEFAULT_LEVEL`.
- `src/cli-options.ts:70-71`: the comment and `DEFAULT_DIFFICULTY = 5`.
- `src/uci-session.ts:349`: the option line is now a template on `DEFAULT_LEVEL`. The header at `:9` already read "default `DEFAULT_LEVEL`", so it needed no edit.
- `src/cli.ts:27`: comment only.

## Armed reds (test note 5): each watched once, then reverted
1. `DEFAULT_LEVEL` back to 3 → `levels.test.ts` went 8 red, including ABC-087 A1 `[1,5,5]`, ABC-174 A2, ABC-174 A3, A7 clause A and A6 ×3. Reverted.
2. Level 4's rate back to 0 → `uci-session.test.ts` went 1 red: "at skill 4, go depth 3: one info string…". Reverted.
3. The `default 3` literal kept in `uci-session.ts` → 4 red: ABC-167 A1, ABC-171 A1, the ABC-174 A5 row built from `DEFAULT_LEVEL` (the C12 pin), and the ABC-174 A5 literal row. Reverted.
After each revert, the file was restored from a scratch copy and checked by grep. The tip's gates were run after all three.

## Gates on `be6a5599`
- `npm run -s lint && typecheck && build && npm test`: rc 0. 59 files, **1987/1987**.
- `.test-results/last-run.json`: `success: true`, 1987 total, 1987 passed, 0 failed, 0 pending.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", rc 0.
- `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts`: 11/11.
- `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts`: 32/32.
- I ran all of these again after a comment-only amend to `levels.ts` (the earlier tip was `2b1acbd3`). The figures above are from that re-run on `be6a5599`.

## R-167-1
`git diff -U0 bd480c99...be6a5599 -- src | grep '^+' | grep -nE 'globalThis|\bglobal\b|Reflect|constructor'` printed nothing (grep rc 1).

## A4 numstat
`git diff --numstat bd480c99 be6a5599 -- src/engine.ts src/search.ts src/virtual-clock.ts src/level-seam.ts` printed nothing.

## A8 `--name-only`
```
src/cli-options.ts
src/cli.test.ts
src/cli.ts
src/levels.test.ts
src/levels.ts
src/uci-session.test.ts
src/uci-session.ts
```

## Production-lines measurement
`git diff --name-only bd480c99...be6a5599 | grep -v '\.test\.ts$' | grep '^src/'`:
```
src/cli-options.ts
src/cli.ts
src/levels.ts
src/uci-session.ts
```
So UAT applies, as the page says.

## Rows whose cost moved (NFR-008); no timing taken, QE reads the bar
- **New:** `levels.test.ts` ABC-174 A3. It runs 90 searches at 3000 ms on step 1000 (3 readings each): 30 references plus 2 seeds × 30. The other new rows are data, or UCI rows on step 50/100 at most 1000 ms.
- **Cheaper:** the ABC-171 A6 level-5 row now uses a 3000 ms budget instead of 3500, and the level-3 row 330 instead of 3000.
- **More rows:** `BLUNDER_LEVELS` grew from [1,2] to [1,2,3,4]. So ABC-171 A8 "every blunder level" loops 4 gos, and A13b has 4 rows instead of 2. The A13b rows are book hits with no search.
- **ABC-101 A8′ seam row:** levels 2-4 now have smaller budgets, so they are cheaper per call. Level 5 is 3000 ms instead of 4500.
- **Default-budget rows** (ABC-167 A5/A6/A7 at 3000): unchanged.

## Trace row (for whoever owns `plans/traceability.md`; I did not edit it)
| ABC-174 | Re-cut `LEVELS` to ADR-0045 D1; `DEFAULT_LEVEL`/`DEFAULT_DIFFICULTY` 5; UCI `Skill Level` default read from `DEFAULT_LEVEL` | EPIC-004 / ADR-0045 D1-D4 | grugops/ABC-174 @ be6a5599 (from bd480c99) | src/levels.ts, src/cli-options.ts, src/uci-session.ts, src/cli.ts, src/levels.test.ts, src/cli.test.ts, src/uci-session.test.ts | 1987/1987 success true; skips 0 "No findings."; CLI_DEEP 11/11; PERFT_DEEP 32/32; armed reds 3/3 observed; R-167-1 empty; A4 numstat empty | In Development → In Review (move is the Orchestrator's); A6 at QE; ABC-175 verdict before UAT (owner Q3); Scribe AGENTS.md:59 and Security/NFR nfr-catalog NFR-004 owed |

## Owed / for the Orchestrator
- **Typed notes not published.** The sanctioned writer (`propose_note` via `context-io.ts`) was not available in this session. I did not hand-write `.grugops/context/`. The content above is what those notes would have carried: decisions, artifact-refs and observations.
- The board move (In Development → In Review) and the trace row are left to the Orchestrator, because the brief fences `plans/board.md` and `plans/traceability.md`.
- **For QE:** A6 deep lanes, and the N8-LANE / NFR-008 reading.
- **For the Scribe:** AGENTS.md line 59.
- **For Security/NFR:** the NFR-004 catalog lines.
- **Host event, disclosed.** During one read-only `git show`/`grep` loop of mine, the host's per-user process limit was hit (about 2670 processes against `ulimit -u` 2666). Nearly all of those processes were not mine. My loop's forks failed, and the job ended with rc 143. I touched no other process. The loop was re-run later with fewer forks. This did not affect any gate: every gate above was run after recovery. QE should know the host was saturated around 21:40 +0300.
- **No undecided edge case was hit.** One choice to note: A3's step is budget/3 (1000), matching the merged A6 row and coarser than the brief's "10 or 100". It keeps the default lane light. Equality holds by construction at any step (test note 2).
