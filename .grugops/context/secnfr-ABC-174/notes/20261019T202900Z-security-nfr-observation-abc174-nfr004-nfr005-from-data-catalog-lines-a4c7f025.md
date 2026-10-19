---
id: 20261019T202900Z-security-nfr-observation-abc174-nfr004-nfr005-from-data-catalog-lines-a4c7f025
kind: observation
by: security-nfr
task: secnfr-ABC-174
at: 2026-10-19T20:29:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-174
  - ADR-0045
  - NFR-004
  - NFR-005
  - NFR-010
  - AR-NFR004-A
  - R-167-1
  - plans/nfr-catalog.md
  - plans/tickets/ABC-174-re-cut-the-level-table-per-adr-0045-the-default-moves-to-level-5-and-plays-as-today.md
  - .grugops/queue/done/ticket-to-pr-ABC-174.md
  - 20261019T202500Z-qe-e2e-decision-abc174-verdict-pass-with-gaps-e7b3c218
supersedes:
---

# ABC-174 at `be6a5599`: `NFR-004` A and B hold from the data, `NFR-005`'s referent is unchanged, security is not triggered, and two catalog lines got insertion-only dated notes

Hand-authored and unsealed: the sanctioned writer (`propose_note`) is not available in this session. Nothing was
timed or run at this hop except read-only `git` and one `grep`. The branch was read through git objects only.

## Read from the code at `be6a5599` (`git diff bd480c99 be6a5599`, `git show be6a5599:…`)
- `LEVELS` = 100/0.4, 180/0.2, 330/0.1, 1 000/0.05, 3 000/0; `DEFAULT_LEVEL` 5; `DEFAULT_DIFFICULTY` 5.
- `src/engine.ts` at the tip: `DEFAULT_BUDGET_MS = 3_000` (:122), `HARD_CEILING_MS = 5_000` (:129). The engine,
  search, clock and level-seam numstat is empty (SE and QE).
- The one production code change outside data: `src/uci-session.ts:349` writes the option line as a template on the
  module constant `DEFAULT_LEVEL`. The input path is unchanged: `setoption … Skill Level` still admits a value only by
  `Object.hasOwn(LEVELS, value)` (:336), and the `--difficulty` parser still matches a closed word list (`cli-options.ts:158`).

## `NFR-004`
- **Clause A (≤ 3 s at the default): holds as before, under `AR-NFR004-A`.** `LEVELS[DEFAULT_LEVEL]` is
  `{ 3 000, 0 }` = `DEFAULT_BUDGET_MS` at rate 0. This is the same call the default made at level 3. `A3` shows it
  equal by move, depth and nodes on 30/30 for 2 seeds. QE's real-clock `ABC-087` `A5` at level 5 = 3 000/0 read
  30/30 ≤ 5 s, max 3 007 ms. That is +7 ms, inside the risk's ≤ 31 ms bound and not worse than the +12 ms
  re-accepted at `ABC-087`. **`AR-NFR004-A` is re-accepted at this gate with its number** (+12 ms max, ≤ 31 ms bound,
  M3 reference). Owner: Security/NFR, as the catalog names it.
- **Clause B (5 s ceiling at any level): holds, with more margin than before.** The highest player-reachable budget
  falls from 4 500 ms to 3 000 ms (= max over `LEVELS`, < `HARD_CEILING_MS`). The engine clamp is unchanged, and the
  `R1` level-clamp row is unedited and green. Levels 1–4 now blunder. The largest blundering budget is 1 000 ms, so
  `THE LEVEL LAYER`'s real-clock re-read rule (a blundering level near the ceiling) does not fire.
- **Still `UNKNOWN - verify`:** whether a default-level (3 000 ms) move can read a first-call excess like the +90 ms
  one recorded at 4 500 ms. QE's one `A5` run did not show one. One run does not rule it out.

## `NFR-005`
The referent is unchanged. The row reads `chooseMove` at `DEFAULT_BUDGET_MS` on the real clock in plain `node`.
Neither the function nor the constant changed, and the default level now plays exactly that call (`A2`, `A3`). The
row's recorded state is not moved by this ticket and is not re-read here.

## `NFR-010`
Not affected. No test file, isolate or child is added. QE ran every lane under the cap at the tip: 1987/1987,
`CLI_DEEP` 11/11, `PERFT_DEEP` 32/32, `ENGINE_DEEP` 35/35, `LADDER_DEEP` short 18/18. There was no OOM.

## Security (ASVS L1, `security.asvs_level` L1)
Not triggered, as the page says. The L1 items this change could touch were walked:
- V1.3.2 (no dynamic code): the template interpolates a module constant, not input.
- V2.2.1 / V2.2.2 (input validated by positive rules): both level inputs are unchanged, as above.
- No dependency, spawn, file read, network, secret or personal data is added.
- **No ASVS requirement fails, so there is no security finding.**

## `R-167-1`
I re-ran `git diff -U0 bd480c99...be6a5599 -- src | grep '^+' | grep -nE 'globalThis|\bglobal\b|Reflect|constructor'`.
It printed nothing (rc 1). This confirms the SE and QE readings.

## Catalog lines (`plans/nfr-catalog.md`, main's working tree, uncommitted)
- **Edited: two lines, insertion only.** Each got one dated italic note, `*[2026-10-19, Security/NFR at ABC-174's
  gate …]*`. This is the catalog's inline-erratum form. Each note says it is true from `ABC-174`'s merge, so it is safe
  to commit before then. Removing the note restores the old line byte for byte, which was checked for both.
  - **`:1342`**: `AR-NFR004-A`'s re-acceptance block, "`LEVELS[3]` = `DEFAULT_BUDGET_MS`". The note says the default
    is `LEVELS[5]` from the merge, with the same `{ 3 000, 0 }` and the same call, so the block's figures stand. The
    words of the transcription are not altered.
  - **`:1366`** (`ADR-0045`'s ":1364", which shifted by 2 at `2ce60fde`): "Levels 4 and 5 (4 000 / 4 500 ms)". The note
    gives levels 4 and 5 as 1 000/0.05 and 3 000/0, level 5 as the default and the hardest, and `A5` at 3 000 ms (max
    3 007, QE). It says the 4 500 ms level is gone, the first-call question stays `UNKNOWN - verify`, and the
    blundering budgets are ≤ 1 000 ms.
- **Hashes (sha256).**
  - The file: `c42e27ab…7ee9bd9` before and `7c2aebc8…c504048c` after.
  - It has 2 287 lines both before and after. Exactly lines 1342 and 1366 differ.
  - All other lines joined: `efae8355…` before and after, so **byte-identical**.
  - Each table row `NFR-001`–`NFR-010` was hashed alone before and after. **All 10 are byte-identical**, and the
    joined rows read `bf189d8f…` both times.
- **Not edited (fence: "edit only those lines"). Each of these still names the old table:**
  - `:11`: the 2026-10-10 header log line.
  - `:1348`: "if a level-3 move ever reads it", inside the transcribed 2026-10-10 block.
  - `:1364`: the 2026-10-12 `ABC-101` record, "With no flag the level is `LEVELS[3]`".
  - `:1405`: `THE LEVEL LAYER`, "**'At default difficulty' means `LEVELS[3]`**".
  - The first three are dated history and are correct as history. **`:1405` is the forward-stated definition, and it
    goes stale at the merge.** That is `SEC-174-1` in the decision note.
- No `_Updated:` header line was added, because the fence did not allow it. No row, bar, level, target or
  `UNKNOWN - verify` marker moved.
