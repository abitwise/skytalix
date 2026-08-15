---
id: 20260815T221745Z-orchestrator-decision-ready-for-dev-exit-re-read-for-abc065-and-abc066-7c41ae90
kind: decision
by: orchestrator
at: 2026-08-15T22:17:45Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
  - plans/board.md
  - AGENTS.md
supersedes: 
---

# `Ready for Dev` exit re-read — `ABC-065` + `ABC-066` pulled into `In Development`

Project process rule 1 (`AGENTS.md` § Process rules): before a ticket enters `In Development` the
Orchestrator re-reads its acceptance criteria **against the built tree** and records the gaps found
there. This is that record. Owner instruction this hop: *"pull ABC-065 + ABC-066 into In
Development"*. Tier: **Reduced** — `Agent` is available, but this is a default main thread, so the
role allowlist is honoured by instruction and is not runtime-enforced. Said so before scheduling.

**Clock note, so nobody reconciles it later.** `date -u` reads `2026-08-15T22:17Z`; the session date
and the board header read `2026-08-16` (local). Timestamps here are the UTC clock, unedited.

## Premises re-measured on `main` @ `3fb6ebd` — all four HOLD

| what the ticket asserts | measured now | verdict |
|---|---|---|
| `ABC-065` `A1`: `npm run chess -- ` occurs **0** times in `AGENTS.md` | `grep -c` → **0** | holds |
| `ABC-066` problem: `npm run chess -- ` occurs **0** times under `src/` | 52 files, **0** in every one | holds |
| `ABC-065` `A2`: `src/cli.test.ts:193-204` asserts `toContain("- Dev / run: \`npm run chess\`")` | read at `:193-204`, exactly that substring | holds |
| `ABC-066` scope: `src/cli.ts:53` is the `USAGE` constant, no `--` | `USAGE = "usage: npm run chess [--colour ...]"` at `:53` | holds |
| `spawned` pinned at 10 | `src/cli.test.ts:780` `expect(spawned).toBe(10)` | holds |
| `ACCEPTED_ARGUMENTS` is 6 tokens, 3 of them `--`-prefixed | `src/cli-options.ts:46-53` | holds |

DoR: both **10/10 MET** and neither re-scored here — scoring is BA/PM's and item 10 on `ABC-065`
was already cleared 2026-08-16 when the `agents-md-owner-grants` claim drained (verified: nothing by
that name under `pending/` or `claimed/`; `claimed/` does not exist at all).

## Gaps found AT THIS EXIT — three, none blocking

**`G1` — `ABC-065` § Dependencies bullet 1 is STALE prose.** It reads *"`AGENTS.md` IS CLAIMED RIGHT
NOW BY ANOTHER HOP"* and cites `.grugops/queue/claimed/agents-md-owner-grants/claim.md`. That claim
drained to `done/` and the `claimed/` directory does not exist. The same file's DoR row 10 already
records the drain, so the ticket **contradicts itself in two places**. Not blocking; the bullet's
second half (*"whoever pulls it re-reads the slot from `main` first"*) is live and was obeyed above.
Homed to **BA/PM**, not repaired here — ticket prose is not the Orchestrator's pen.

**`G2` — the two tickets are NOT file-disjoint, and both pages say they are.** `ABC-066`
§ Dependencies calls them *"DISJOINT FILES"*; `ABC-065`'s `A6` fences the diff to `AGENTS.md` +
`src/cli.test.ts` and `ABC-066`'s `A6` to `src/cli.ts` + `src/cli.test.ts`. **`src/cli.test.ts` is in
both.** The claim is true of PRODUCTION files only. Two concurrent branches writing that file is a
merge conflict this project has no automation to catch. **This is the gap that changed the schedule**
— see the ruling below. Homed to **BA/PM** as a wording repair on both pages.

**`G3` — `ABC-066` test note 3 offers a helper that does not exist.** *"If `ABC-062` has merged, its
extraction helper exists; use it."* `ABC-062` is not in `Done` and is not on the board's live rows at
all. So `ABC-066` writes the **first** stderr→usage-line extraction helper, and `ABC-065`'s guard
block reuses it rather than writing a second — which is exactly the fence `ABC-066` § Dependencies
already states for whichever ticket merges second. Ordering constraint, recorded, not a defect.

Rule-1 control is served: **3 gaps recorded at this exit**, which is the direction the control wants.

## Ruling: `ABC-065` is split into two subtasks, sequential; `ABC-066` runs in parallel with the first

`ABC-065`'s own header forbids splitting the TICKET (*"split, the guard reds on merge"*) and its
§ Dependencies says the pen on `AGENTS.md` is the Scribe's while the test block is an engineer's —
*"one hop, one ticket"*. Both are honoured: **one ticket, one branch, two hands in sequence.** The
ticket never enters `Done` on the documentation half alone.

Schedule, width **2** now against `queue.wip_limit` 3 and `claim_cap` 2:

1. **now, parallel** — `ticket-to-pr-ABC-065-scribe` (**AGENTS.md Scribe**, `AGENTS.md` only) and
   `ticket-to-pr-ABC-066` (**Software Engineer**, `src/cli.ts` + `src/cli.test.ts`). File sets are
   genuinely disjoint, so `G2` cannot bite between these two.
2. **after `ABC-066` lands** — `ticket-to-pr-ABC-065-guard` (**Software Engineer**,
   `src/cli.test.ts` only), branching from the merged tip so it rebases onto `ABC-066`'s block and
   reuses its helper per `G3`. **Not enqueued yet**, deliberately: a pending file for it today is a
   file two engineers could claim into a conflict.

Rejected: both engineers in parallel on separate branches. It is the faster schedule and it is the
one `G2` says will conflict in `src/cli.test.ts`, on a repo with no CI to catch it.

## Board

`Ready` 2/8 → **0/8**; `In Development` 0/3 → **2/3**. No WIP limit approached, no written reason
owed. `Done` untouched; `ABC-042` does not move and its page is not edited — both tickets say so and
both spawned hops are fenced on it.
