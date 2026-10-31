# qe-ABC-247 A3 spot-check: the SE's file:line readings (`se-ABC-247` `…e9efa27d`) hold at `ca6e675c` and at the head

Read in git with `git show <sha>:<file> | sed -n <line>p` (`raw/a3/a3-read.txt`). The head is `4cd261c1`. Its `src/` equals the tip
`cec9c252`, and for these four files it equals `72a65fb7` (empty diff).

- **uci-session.ts, base:**
  - `:258` `let skill … = DEFAULT_LEVEL`; `:281` `go` starts.
  - `:286` `const level = LEVELS[skill]`; `:287` `Math.min(request.budgetMs, level.budgetMs)`.
  - `:295` `level.blunderRate > 0`; `:298` the `skill level … ignores go` info; `:301-302` `createLevel({ budgetMs, blunderRate })`.
  - `:313-318` `chooseMove(position, { budgetMs, now, …depth/nodes })`, with no skill.
  - `:342` setoption `Object.hasOwn(LEVELS, value)`; `:345` the range message; `:359` the `option name Skill Level … default 5 min 1 max 7` declaration.
  - **All as the SE states.**
- **uci-session.ts, head:**
  - `:99` `TIME_MODES` (`level` first); `:349` `skill`; `:351` `timeMode = TIME_MODES[0]`.
  - `:376` `go`; `:379` `parseGo(…, timeMode, info)`, with no skill.
  - `:382` `LEVELS[skill]`; `:383` `leveled`; `:384` the cap under `leveled`; `:388` book with no skill.
  - `:392` `leveled && level.blunderRate > 0`; `:395`; `:398` `createLevel`.
  - `:410-416` `chooseMove(position, { budgetMs, now, priorKeys, … })`.
  - `:440`, `:443`, `:462`.
  - **All as the SE states.**
- **levels.ts:**
  - base `:54` `5: { budgetMs: 3_000, blunderRate: 0 }`, `:55` `6: { 5_000, 0 }`.
  - head `:59` `5: { 4_000, 0 }`, `:60` `6: { 5_000, 0 }`.
  - **As stated.**
- **Other readers:**
  - `git grep -n -i skill` over non-test `src/` at both SHAs.
  - `git grep -e 'LEVELS[' -e DEFAULT_LEVEL` at both SHAs.
  - Beyond the SE's set they list only:
    - the setoption name dispatch `name === "skill level"` (base `:340`, head `:438`);
    - the head comment `:381`;
    - `level-seam.ts` (base `:15`, head `:27`: the CLI seam, not the UCI path, as the SE states).
  - Nothing else reads `skill` or `LEVELS` on a `go movetime` path. `src/uci.ts:76` builds the session with no skill.
- The engine's behaviour in A2 agrees with this reading. Level 6 searched 4 000 ms at both SHAs, with no `info … ignores go` line in any log, so there was no blunder branch.

**A3 MET.** The two unlisted lines are INFO (QE-247-c).
