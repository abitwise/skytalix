---
id: 20260815T113200Z-qe-e2e-observation-gaps-with-severity-and-owner-4a86f0c2
kind: observation
by: qe-e2e
at: 2026-08-15T11:32:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - A6
  - A9
  - A12
  - N8-LANE
  - src/cli.test.ts
  - src/history-pane.nfr.test.ts
supersedes: 
---

# Every gap this gate found, with severity and owner

**Numbered `Q1`…`Q10` to avoid colliding with the engineer's `G1`…`G7`**, which stand. Where a gap of
mine is the same item as one of theirs, the row says so. **None of these is a failing criterion** —
all twelve are MET on the delivered build. Two are failing *instruments*, and those are the block.

| # | gap | severity | owner |
|---|---|---|---|
| **`Q1`** | **`A6`(i)'s near-miss row tests `--colour`'s misses in the ONE-token form**, where they reject for the wrong reason (missing value). Every membership weakening on `--colour` is therefore invisible: `startsWith` (`M7`) and `toLowerCase` (`M19`) both ship **856/856 green** and make `--colourx black` / `--COLOUR black` print a **23-row board, exit 0**. The criterion already says "in its **legal argv position**"; `--colour`'s is two tokens. `M18` proves the diagnosis — the same weakening on `--ascii`, whose legal position genuinely is one token, **is** killed | **HIGH — blocking.** `A6` is the criterion whose repair discharged the ASVS **V2.2.1 [L1]** BLOCK, and the ticket's DoR item 4 states on the page that this build is *"RED deterministically"*. It is not | **Software Engineer** — **fix written and verified by me** on `grugops/quality-gate-ABC-042` (one loop, zero production bytes). Routing is the Orchestrator's |
| **`Q2`** | **`A9`(2)'s instrument is defeatable.** A second, unvalidated argv read spelled `process["argv"]`, branched on after the resolver returned, ships green against `expect(entry.match(/process\.argv/g)).toHaveLength(1)` (`M11`). That is the unvalidated input path ASVS **V2.2.2 [L1]** forbids. Same shape as `X8` in the `ABC-041` re-gate. The engineer applied the *stronger* textual form to the resolver and the weaker count to the entry point — the asymmetry is the hole | **HIGH — blocking** | **Software Engineer** — fix written and verified by me (process surface transcribed, plus a bracket-access guard) |
| `Q3` | **The merged licence guard's `toEqual` can be weakened to a subset with nothing asserting it.** `M15` — `expect(...).toEqual(expect.arrayContaining(runtimeImporters))` — **survives the whole suite**, which is exactly what that file's own comment says must never happen. **The delivered build does NOT do this** (comparator intact, verified; diff on that file is two hunks). What is missing is any *assertion* that it stays an equality — `A12`'s row checks the licence array's contents, not the comparator | **MEDIUM** — no live defect; a real hole in a guard `ADR-0002` clause 4 and `ADR-0011` clause 3 both rest on | **Architect/Design** (the clause-3 mechanism is theirs). **Explicitly NOT fixable under this ticket** — `A12` bounds the permitted change to that file to one array element plus a citation, so adding the assertion here would breach `A12` to protect `A12` |
| `Q4` | **`A6`(ii)'s "250 per shape, asserted FIRST" control is a tautology.** The corpus is built by rejection sampling in a `while (drawn.length < 250)` loop, so `expect(drawn).toHaveLength(250)` can never fail for any filter. Proved: switching the filter to the CONTAINS reading the criterion forbids makes the run **hang to a 180 s timeout** (`M17`) instead of reding. **The delivered filter is correct** — whole-form only — so `A6`(ii) is MET; the criterion's named detector for the failure it fears simply does not detect. A count of generator **draws** (not of items kept) is the instrument the criterion is describing | **MEDIUM** | **BA/PM** — the criterion's instrument wording. One clause |
| `Q5` | **Bar 1b's regexes count occurrences, not call sites — the same defect `RF-9` repaired one layer up.** The bar says "**call sites, NEVER occurrences**" and then supplies `/\bexec\s*\(/` and `/\bexecSync\s*\(/`, which a regex cannot honour: applied literally to the **correct** delivered file they return **1 and 1** (plus 1 `shell:`), all three in the file's own docblock quoting the forbidden spellings. A reviewer following the bar verbatim gets a **false RED**. Substantively the bar is **MET** (0 / 0 / 0 on executable text) | **LOW** — but **live right now**: the concurrent Security/NFR hop reads this bar first | **BA/PM** — one clause: apply the regexes to comment-stripped text |
| `Q6` | **The spawn-count pin is self-referential.** `expect(spawned).toBe(10)` counts only children created through `childOf`; `spawnSync` is in scope and a direct call would spawn a child the counter never sees while the pin stayed green. **Honest today** — exactly one `spawnSync` call site, all ten children at module scope, both channels piped on every one (all verified) — but not tamper-proof against a later hop | **LOW** | **BA/PM** or the next engineer to touch the file |
| `Q7` | **`A2` proved the keyword, not the property.** A binding published on `globalThis` shipped green against `not.toMatch(/\bexport\b/)` (`M14`). Lower stakes than `Q1`/`Q2` — it is still not an ESM import, so the `ADR-0011` census and probe-root reasoning survive | **LOW** | **Software Engineer** — **already armed** by me in the same one-line patch as `Q2` |
| `Q8` | **`A8`'s emitted stream ends with two newline BYTES**, because the frame's 23rd row is the empty string. This is **not** a violation — "exactly one `\n` after the last row" holds when the last row is empty, and the delivered assertion reads it correctly. But a reviewer running `tail -c 2` will see two newlines and reopen a closed criterion | **LOW, informational** | **BA/PM**, only if `A8` should say so; otherwise this note is the record |
| `Q9` | **`N8-LANE` breached — independently confirmed.** My own null-controlled reading: **1250 ms CPU net** (gross 1390, measured per-file floor 140) against the **650 ms** bar = **1.92x**, sign 7/7, treatment **12.6x** the identity-null noise floor. **This is the engineer's `G1`**, reproduced to 10 ms on a separately built harness, with the admissibility arm they flagged as missing now present. The ten spawns are criteria-forced — I re-derived the floor from the ticket, not from their note | **MEDIUM** — and **not mine to grade**; Security/NFR may grade it higher | **Security/NFR** for the reading (concurrent hop), then **BA/PM / the owner** for the bar. **I moved nothing in `plans/nfr-catalog.md` or `ADR-0008`** |
| `Q10` | **`A1`'s "no other setup" clause was not tested from cold.** I ran in a worktree with `node_modules` symlinked, not from a fresh `git clone && npm install`. The command works; the clean-clone path is unproven by me | **LOW** | **UAT** — this is exactly the destination `EPIC-006` gives the deferred UAT columns |

## Two of the engineer's gaps I can now speak to

- **Their `G1`** — confirmed independently and more strongly. See `Q9`.
- **Their `G2`** (spawn count 10 against the ticket's "single digits") — **I re-derived the floor from
  the ticket rather than accepting their arithmetic**: `A1` names the bare `npm run <name>` (1), `A4`
  names three colour runs (3), `A5` (1), `A6`(iii) names four argvs verbatim (4), bar 3 says "spawn
  once" (1). **Ten, and no two are mergeable without changing what a criterion says.** Their reading
  holds.

## What I am NOT raising, so the list is not padded

- **`A10`/`A12`'s halves being held by diff review rather than by an assertion.** The ticket says so
  itself (*"`A2`, `A3`, `A10`, `A12` are read off the diff"*), and I performed both reads
  independently — `A10` key-by-key against real `git show 8dbc3db:package.json`, `A12` by blob SHA
  across all 18 modules. Design, not defect.
- **The six rejection children each loading the whole engine.** The engineer measured the
  dynamic-`import()` lever, found it still misses the bar, and declined it under coding rules 5 and
  7. I agree and add nothing.
- **`--difficulty` / packaging (`EPIC-006` #4 and #1).** Named unmet by the ticket already; `A10`'s
  fence holds and I verified it holds.
