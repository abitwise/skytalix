---
subtask: bapm-rework-ABC-161
role: ba-pm
ticket: plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md
ref: .grugops/context/ticket-to-pr-ABC-161/ (on branch grugops/ABC-161 @ 1f623d18, notes only)
width: 1
---

# BA/PM: re-word ABC-161's A1 and A3 against today's `main`, then re-score DoR

The SE stopped `ticket-to-pr-ABC-161` before any code (decision `…67e9ccc1`, base readings `…b56b418c` which supersedes `…1ef80c09`, commands `…82d08f42`; on `grugops/ABC-161` @ `1f623d18`, read with `git show`). The page was cut at `1671f24f`; two later merges changed what its plants do at base `69610c5b`:
- **A1:** P11 is already **red on base**. The existing `A8′` row catches it at level 4, call 1, because `ABC-174` (`be6a5599`) set level 4 to `blunderRate: 0.05`. Levels 1–3 are still blind.
- **A3:** P9d is now **green on base**, since `f6b63c1c` put "ADR-0045" into the `AGENTS.md` Dev / run slot, so `4` occurs outside the level list. All five slot plants (P9a–P9e) are blind on base.
- **A2** holds as written (S2c green on base).

## Decide
1. **Fix 1 / A1.** Is fix 1 still wanted? If yes, re-word A1 so it measures what is still blind (e.g. a P11 variant scoped to levels 1–3, or a row that must discriminate per level), with green-on-base / red-on-head stated for today's base. If no, drop it with the reason, and say whether QE-101-a closes.
2. **A3.** Re-word for P9a–P9e all green on base → red on head (5 of 5), and the real `AGENTS.md` green on head.
3. **Refresh the stale pointers** (line numbers, "1810 of 1810", "78 of 78", the ABC-096 dependency line) to `main` readings, or drop them in favour of row names.
4. **Re-score DoR** and say where the ticket goes (Ready at 10/10). Size and priority as you judge; keep the promotion trigger.

## Fences
- Records only: the ABC-161 page, `plans/board.md` (the ABC-161 card, header counts, one `_Updated:` line prepended above the first existing one), notes.
- You may run plants in scratch copies outside the repo to confirm base readings (private `TMPDIR`; heap 400 for one file, 128 for multi-file). No `src/` or `AGENTS.md` edits. Never push or merge. Do not touch `../wt-ABC-161`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`; task `bapm-rework-ABC-161`). Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-rework-ABC-161.md` (brief + `## Result` + trace row as one `| ABC-161 | … |` line) and `.claim.md`, uncommitted on main.

## Result

**DONE.** Records only, uncommitted on `main` (base `afc8d43a`; its `src/` and `AGENTS.md` equal `69610c5b`'s). Notes are under `.grugops/context/bapm-rework-ABC-161/notes/`. All three were sealed with `admitAndAppend` with an explicit `contextRoot`, returned `findings: []`, and were read back with `readContext`:
- `20261021T103740Z-ba-pm-observation-8425f6db`: base readings, draws and the scratch prototype.
- `20261021T104240Z-ba-pm-decision-b0020834`: the rulings below. It supersedes `…decision-faaf2f14`.
- `20261021T103801Z-ba-pm-decision-faaf2f14`: the same rulings, but its refs name the stray observation id below.

**Seal slip: two stray notes are in the plugin cache.**
- *What happened.* My first `admitAndAppend` call passed no `contextRoot`. The writer's default root is the plugin's own directory, so `…observation-3d29ca70` and `…decision-07df475e` landed in `~/.claude/plugins/cache/grugops/grugops/2.1.0/.grugops/context/bapm-rework-ABC-161/notes/`.
- *What I did.* I re-sealed both into this repository, which gave new ids, then superseded the decision whose refs were wrong.
- *What is left.* Removing the stray copies was refused by the permission system. They remain, and the whole `.grugops/` tree under that plugin dir is this hop's. A human may delete it.
- *For the next agent.* `AGENTS.md`'s writer pointer does not say to pass `contextRoot`.

**Readings.** Each plant ran in a fresh scratch copy of `git archive afc8d43a`, as an exact-string edit asserted once, with a private `TMPDIR`.
- Base used the whole lane at heap 128: 59 files / 1987 tests.
- Every shared plant agrees with the SE's `…b56b418c`. P11 and P11-L4 are red at `A8′` "level 4, call 1". S2c and P9a–P9e are 1987/1987 green.
- **New:** P11-L1, P11-L2 and P11-L3 (rebuild at that one level) are 1987/1987 green on base.
- **Head prototype** (`call < 3`, `src/cli.test.ts` alone, heap 400, scratch only): 88/88 unplanted. P11-L1..L3 red at "level N, call 2"; P11-L4 red at "level 4, call 1".
- 0 copies left. `git status --porcelain` shows only this hop's records.

**Decisions.**
1. **Fix 1: KEPT, and re-aimed.**
   - Today's catch rests on level 4's 0.05 sitting between seed 7's first two draws (0.0117, 0.0620). Levels 1–3 are still blind, and a level-4 re-cut would blind the row silently.
   - **New A1:** P11-L1/L2/L3 green on base → red on head, 3 of 3. P11 and P11-L4 red on both. The non-vacuity block is kept.
   - The page's old seed option `4294967295` no longer qualifies (levels 3 and 4 decide alike). `call < 3` at seed 7 is measured to work. The Engineer picks.
   - **QE-101-a stays OPEN.** It closes when A1 is met at merge.
2. **A3:** P9a–P9e green on base → red on head, 5 of 5. The real `AGENTS.md` is green on head. Fix 3's text is unchanged, plus one sentence: the list is the `|` run, not the `-- --colour black` example.
3. **Pointers:**
   - Test line numbers are replaced by row names.
   - 1810/1810 becomes 1987/1987 (59 files), and 78/78 becomes the file's 88.
   - The ABC-096 dependency is marked discharged (`b20eb451`). ABC-168 is named as a disjoint editor of `src/cli.test.ts`.
   - The production line refs `:15` and `:158` were re-read and hold.
   - Exact plant strings are now on the page.
4. **Size, priority, DoR:**
   - XS (about 13 plants) and P3.
   - The promotion trigger is kept, with one clause added: a ticket that re-cuts a level's `blunderRate` in `LEVELS`.
   - **DoR 10/10. Backlog → Ready**, which takes Ready from 2/8 to 3/8.

**For the Orchestrator.**
- **(a) The `plans/traceability.md` row (line 1110) is stale:** "1810/1810", "pull after ABC-096", "P9d red on both". It is outside this hop's fence. The replacement row is below.
- **(b) The fix 2 and fix 3 head reds are expected, not measured** (`UNKNOWN - verify`). The SE reads them.
- **(c) Re-dispatch.** The SE hop can restart from `grugops/ABC-161` (notes only, at `1f623d18`) after a rebase onto `main`, or from a fresh branch.

**Board:** one `_Updated:` line prepended, the ABC-161 card moved from Backlog to Ready with a dated tail, and the Ready header 2/8 → 3/8.

**Fences:** no `src/`, `AGENTS.md` or `plans/traceability.md` edit; `../wt-ABC-161` was not touched; nothing was committed, pushed or merged. The brief moved pending → claimed → done by `claim.js` `transition`, and the claim directory was removed.

### Trace row (for the Orchestrator to replace ABC-161's row in `plans/traceability.md`)
| ABC-161 | Three `src/cli.test.ts` rows a wrong difficulty build passes (level rebuilt per move at levels 1–3, `/m` regex, slot drops a value); cut by BA/PM (`bapm-cut-followups`) from `QE-101-a`, `SEC-101-a`, `QE-101-b` (LOW); re-worded at `afc8d43a` (`bapm-rework-ABC-161`) after the SE stop `…67e9ccc1`: P11-L1..L3, S2c, P9a–P9e pass 1987/1987; P11/P11-L4 red on base (ABC-174's level 4) | EPIC-006 | — | `NFR-008` 0 / 0 / 0; test-only | not started; fence `src/cli.test.ts` only, inside three existing `it` blocks; no pull order (ABC-096 discharged, ABC-168 disjoint) | not started; nine plants green to red (P11-L1..L3, S2c, P9a–P9e), P11/P11-L4 red on both, equal counts, `CLI_DEEP` green | waiver expected | — | Ready, `XS`/`P3`, DoR 10/10 (re-scored 2026-10-21). Notes `.grugops/context/bapm-rework-ABC-161/notes/` (`…decision-b0020834`, `…observation-8425f6db`) |
