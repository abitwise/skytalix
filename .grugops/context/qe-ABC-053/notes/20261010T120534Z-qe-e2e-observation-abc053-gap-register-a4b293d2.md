---
id: 20261010T120534Z-qe-e2e-observation-abc053-gap-register-a4b293d2
kind: observation
by: qe-e2e
at: 2026-10-10T12:05:34Z
verified_by:
confidence: high
refs:
  - ABC-053
  - ABC-054
  - ABC-057
  - ADR-0029
  - ADR-0030
  - ADR-0009
  - NFR-002
  - src/history-pane.nfr.test.ts
  - src/render-seam.ts
  - src/result-screen.ts
  - src/cli.ts
  - 20261010T120534Z-qe-e2e-observation-abc053-ledger-rebuilt-and-qe-mutants-594c5d57
  - 20261010T120534Z-qe-e2e-decision-abc053-verdict-pass-with-gaps-928ba81f
supersedes:
---

# `ABC-053` gap register: two LOW reach gaps, two LOW wording gaps, two INFO, one carried follow-up

This note is hand-authored and unsealed. No gap fails a criterion. Each one is measured, and the
build that shows it is in `…594c5d57`.

| id | severity | gap | evidence | suggested owner |
|---|---|---|---|---|
| **QE-053-a** | LOW | **The composer tripwire does not fail closed on two spellings.** It reads static `import … from "./frame.ts"` statements only. A second module that gets `assembleFrame` through a **re-export hop**, or through a **dynamic `import("./frame.ts")`**, is not counted. The docblock says "FAILS CLOSED ON A SECOND COMPOSER" and names only "a composer that never calls `assembleFrame`" as unseen. Neither spelling is among the four listed cases. A single-quote spelling is not a gap: the lint gate's formatter rejects it | `Q-COMPOSER-REEXPORT`, `Q-COMPOSER-DYNAMIC`: GREEN 23/23, `biome` exit 0, `tsc` exit 0 | BA/PM: fold into `ABC-054` (its general consumer instrument, the next hop on this file), or add one docblock line. Not this build's: `ADR-0030` decision 2 excludes `export … from` by definition, and the build follows the ruling |
| **QE-053-b** | LOW | **The per-frame phase reaches one non-game state.** It draws `"ascii"`, `"white-bottom"`, `thinking = false` and `messages = []`. An edge conditional on unicode, black-bottom, thinking, or a non-empty message region is green. The docblock's case 2 reads "a lazy load CONDITIONAL on a **game** state the frames do not reach", so these four are not named. The Engineer's decision note (`…9594aafe` item 4) says the mode case "is named there". By the docblock's own words it is not. `ADR-0029` asked for two game states only, so `A3b` is met | `Q-UNICODE-ONLY`, `Q-BLACK-BOTTOM-ONLY`, `Q-THINKING-ONLY`, `Q-MESSAGES-ONLY`: GREEN ×4 | BA/PM: a docblock word ("a state — game, glyph mode, orientation, `thinking`, messages — the frames do not reach") in `ABC-054`'s or `ABC-057`'s hop on this file. Or Architect/Design, if the frames should cover a small matrix |
| **QE-053-c** | LOW (pre-existing limit, wording) | Case 3 says a derive rebuilt from modules other than `history.ts` is seen "only [by] `ABC-041` `A2`'s synchronous spies". That holds when the rebuild calls `gameStatus` (`A2` spies it). A rebuild of the repetition counts by replay (`parseFen` + `makeMove` + `zobristKey`) calls nothing spied and is **seen by nothing**. Case 3 itself, "the probe does not cover it", is true | `Q-REDERIVE-GAMESTATUS`: RED on `A2` only. `Q-REDERIVE-REPLAY`: GREEN 23/23 | Same docblock pass as QE-053-b. No instrument is proposed: the limit pre-dates this ticket, as the docblock says |
| **QE-053-d** | LOW (wording) | A test comment says the settle "is not load-bearing on Node v26.11.0". That is true for `X5b`-class edges, which are issued synchronously or in a microtask. It is **false** for an import issued from a macrotask. One `setImmediate` deep is RED with 3 turns and GREEN with 0. Three turns reach exactly depth 3. Depth 4 is the docblock's case 1, correctly | `Q-SETTLE-IMM1..3` RED; `IMM4/5` GREEN; `IMM1+ZERO` GREEN. Identical on v24.12.0. 6/6 repeats, no flake | Same docblock pass: "not load-bearing for an edge issued during the frame; it reaches three macrotask turns". **The task's question, answered:** three turns suffice for every `ADR-0029` build and for a ≤ 3-deep `setImmediate` chain. They do not reach a 4-deep chain or a real timer |
| **QE-053-e** | INFO | `A3b` (iii), "arming last", is held by the probe's **structure**, not by an assertion. A reorder that runs the arming first, with a recorder that dies after it, turns `X5b` GREEN with nothing red. With the arming last, the same dead recorder is RED on `the probe is ARMED`. So the control works, and only a reviewer guards the order | `Q-CTRL-DEAF-AFTER-LOAD+X5b` RED; `Q-CTRL-ARMING-FIRST+DEAF+X5b` GREEN | none. It is test code guarding test code. Recorded so `ABC-054`/`ABC-057` keep the order when they open the child |
| **QE-053-f** | INFO | The instrument observes **loads**, so a specifier already loaded in the child before the clear is invisible. A frame importing `./history.ts?fixture` (the probe's own fixture URL) plus a derive is GREEN. It is contrived: no production code would spell that URL | `Q-FIXTURE-SPECIFIER`: GREEN | none |
| QE-053-g | `UNKNOWN - verify` | Node 22 loader timing for the per-frame phase. `package.json` admits `>= 22`. Node 24.12.0 is now measured and is identical to 26.11.0 | `ledger-node24.tsv` | whoever next has a Node 22 binary |
| (carried) | — | The three production docblocks named in `A5` are stale on landing: `src/render-seam.ts:35`, `src/result-screen.ts:14`, `src/cli.ts:8` ("frame producers 6"). QE confirms the list by filename. No other `src/` file names `FRAME_PRODUCERS` | `grep` over non-`.test.ts` filenames | BA/PM, the owed `XS` follow-up at merge (already on the ticket) |

**Not a gap, recorded so nobody re-derives it:**
- The Engineer's `CTRL-NO-COMPOSER` stayed green because a namespace import binds values.
  `Q-COMPOSER-NAMESPACE` confirms that the tripwire counts it.
- `Q-FACTORY-RENAME` (the probe renamed too) is green by design.
