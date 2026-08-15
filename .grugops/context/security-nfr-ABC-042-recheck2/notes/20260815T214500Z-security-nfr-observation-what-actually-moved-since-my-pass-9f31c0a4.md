---
id: 20260815T214500Z-security-nfr-observation-what-actually-moved-since-my-pass-9f31c0a4
kind: observation
by: security-nfr
at: 2026-08-15T21:45:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/cli.ts
  - src/cli-options.ts
  - src/cli.test.ts
  - ADR-0011
  - A6
  - A9
supersedes: 
---

# What actually moved between `8b07d9f` (the tree I passed) and `d011df4` (the tree that will merge)

**My `PASS_WITH_RISKS` was recorded against `8b07d9f`. That is not what merges.** The first job of
this hop is to establish the delta by measurement rather than assume it, because a re-check that
starts from "probably the same" is not a re-check.

## The whole non-`.grugops` delta, three files

```
memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md  +155
plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md             +78 / -78 lines touched
src/cli.test.ts                                                          +144 / -25
```

**Nothing else.** No `package.json`, no `AGENTS.md`, no other file under `src/`.

## The production modules are byte-identical — verified by blob SHA, not assumed

```
src/cli.ts          8b07d9f 4624457783…  ==  HEAD 4624457783…  ==  e140355 (the original build commit)
src/cli-options.ts  8b07d9f c1487e2c36…  ==  HEAD c1487e2c36…  ==  e140355
all 18 MERGED production modules under src/:  18 compared, 0 differing against `main`
```

**Consequence, stated once and relied on below:** every ASVS row whose surface is a production
module — `V1.2.5`, `V1.3.2`, `V2.1.1`, `V2.2.1`, `V2.2.2`, and bars 1, 3's subject and 4 — is being
read against **the identical bytes I read at the gate**. What can have moved is the **instrument**,
not the control. That is exactly the shape the subtask describes and it is confirmed rather than
taken.

## The delivered TEST file — what the two repair hops changed, and which of it is mine

| change | criterion | whose finding |
|---|---|---|
| the near-miss family made **complete over position** (18 → 138 cases, 134 distinct), `--colour`'s misses resolved in their **two-token** legal position, both counts pinned | `A6`(i) | BA/PM's `E1`, QE's `Q1` |
| the literal scan gained a **template-literal alternation** | `A6`(i) | **`S3` — MINE** |
| a **500-draw budget**, draws asserted before survivors | `A6`(ii) | QE's `Q4` |
| the whole `process.<name>` surface transcribed and sorted; bracket access forbidden; the bare identifier `process` pinned at 4; `globalThis` forbidden; the exact call shape pinned | `A9`(2) | QE's `Q2` |
| `globalThis` forbidden on the exports row as well | `A2` | QE's `Q7` |
| bar 3 **locates the echoed token by whitespace split** instead of reading line 0 | bar 3 | **`S2` — MINE** |
| the spawn pin closed **at its source**: the named-import list from `node:child_process` must equal `["spawnSync"]`, with exactly one call site | `N8-LANE` row | QE's `Q6` |

**Zero production bytes, zero new spawns, zero new test rows (29 before, 29 after).** I verified the
child set is untouched in the diff, which matters because the `G1` figure is 82% children.

## The tree runs green at my own hand

```
npm install            exit 0 (this worktree had NO node_modules — a real install)
npx vitest run src/cli.test.ts    29/29 passed
npm test               856 passed (856) on 30 files
```

## The `ADR-0011` clause 3 amendment — read, and it touches nothing I rely on

It strikes clause 3's **licence-admission sentence** and replaces it with a two-part property test
(necessity; the single supplier intact). It is **not an ASVS surface** and it is Architect/Design's.
What I checked is only whether it moves anything my review stands on:

- **Clause 1's file-set expression is UNCHANGED** — that is the expression `A9`'s scope borrows, so
  my `A9` reading is unaffected.
- **The licence EQUALITY is UNCHANGED** (`src/history-pane.nfr.test.ts:335`, verified in tree) — that
  is the assertion my recheck note called *"doing security work, not tidiness work"*, and it is
  byte-untouched.
- **Zero production lines, zero test lines**, by the amendment's own statement and by the diff.
- `R5` — the equality's own comparator is unwitnessed — is registered as a residual and routed to a
  new ticket. **For THIS diff my reliance still holds**, because `A12`'s *"nothing else in that
  file"* forecloses weakening the comparator here; `R5` is about the day after the merge, and it is
  Architect/Design's.

**Nothing in the amendment weakens a control I read.**
