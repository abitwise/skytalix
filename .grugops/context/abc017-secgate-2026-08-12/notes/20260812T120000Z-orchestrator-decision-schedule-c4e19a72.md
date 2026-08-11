---
id: 20260812T120000Z-orchestrator-decision-schedule-c4e19a72
kind: decision
by: orchestrator
at: 2026-08-12T12:00:00Z
verified_by:
confidence: high
refs:
  - abc017-secgate-2026-08-12
  - security-nfr-ABC-017
  - ABC-017
  - ABC-019
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - 20260812T102000Z-qe-e2e-decision-flags-and-verdict-8e47b3d5
supersedes:
---

# Schedule: `ABC-017` to the Security/NFR gate, and `ABC-019` is genuinely blocked behind it

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp. The §14 gate machinery does not exist in this repo.

## The request

*"Continue with `ABC-017` and then `ABC-019`."* Classification: **`quality-gate`**, Workflow
`agent-factory/workflows/05-pr-quality-gate.md`. Mode `lean`, cadence `kanban`, autonomy `pr`.

## Width: ONE, and the reason is not caution

`queue.wip_limit` is 3. I am running **one** agent, and `ABC-019` is the reason — it is not a
scheduling choice I made, it is a dependency I checked:

- `ABC-019` sits in `In Review` held for **`ADR-0009` cl. 9f** — the re-gate must run the loop's
  tests **against the REAL panels**, which requires `ABC-017` merged. Merge order is
  `ABC-016` → `ABC-027` → `ABC-017` → `ABC-019`; the first two are merged and `ABC-017` is third.
- Its `A20` was written RED ON PURPOSE and needs the rebase that `ABC-017`'s merge enables.
- The one `ABC-019` debt that could have run in parallel — Architect/Design's narrow `ADR-0009`
  transcription fix at cl. 9b and evidence (vii) — **is already discharged**: both correction
  blocks are present in `memory-bank/50-decisions/ADR-0009*.md` citing `abc019-a9b-2026-08-11`.
  I checked the file rather than the board row.

So there is no honest parallel `ABC-019` hop. Running one at width 3 would be theatre.

## Why the gate BEFORE the BA/PM criteria hop, when QE handed me that choice

QE explicitly did not make this call: *"whether to spend that hop before merging third, or to
merge and carry the gaps, is the Orchestrator's call."* I am **not deciding it yet**, and that is
deliberate. Sequencing the gate first is decidable now on its own merits:

- **The gate may add findings of its own** that BA/PM should rule on in the SAME hop. Two BA/PM
  amendments on one ticket is how `D19`/`D21` happened here — an edit applied at one site while the
  ticket asserted the same thing at two others.
- **BA/PM and Security/NFR would both write `plans/tickets/ABC-017-*.md` on one branch.** That is a
  real file conflict, not a hypothetical one.
- The gate measures NFR bars and the security surface. **None of that is contingent on whether
  `G1`/`G2` get criteria.** The criteria decision IS contingent on what the gate finds.

I will make the merge-or-close-the-gaps call after the gate reports, with both inputs in hand.
**`G1` and `G2` both name `ABC-019` as their live consumer**, which is why I am not pre-committing
to carrying them.

## What I did this hop, so the gate can attribute its own red

Rebased `grugops/ABC-017-history-pane` onto `main` (9 behind, `ABC-027` having merged at `ca0b448`).
**Two conflicts, both header-only in `plans/traceability.md`** — the `_Updated:` stack, never a
table row. Resolved by **row ownership** and verified by hash, not by eye:

| row | equals | md5 |
|---|---|---|
| `ABC-017` | the Engineer's `e0c08b6` | `6577eab6514e1c943a41c5d862fd7ffb` |
| `ABC-027` | `main`'s Security/NFR re-gate | `2ee78b045aec290b7fc8d7058a1997ab` |

37 table lines on `main`, on both branch sides, and after. Zero conflict markers. All three
`_Updated:` headers KEPT verbatim, newest first — none replaced, because replacing one destroys
content that exists nowhere else.

Gates on the rebased tip: `lint` / `typecheck` / `build` **exit 0**; **740/740 on 26 files**;
skip count **0**; `src/history-pane.ts` md5 `54fd4346dcc1a0060c4e66ae0149265d`; diff vs `main`
**+941 / −19** over four files.

**740/740 reproduces QE's `git merge-tree` prediction exactly.** QE measured the prospective merge
read-only rather than rebasing, and it was right — that is now confirmed against the real tree, not
trusted.

Also swept **one** stale `claimed/` directory (`ticket-to-pr-ABC-017-d23`), **after** verifying its
`done/` record and four published notes existed. The 30-minute TTL sweep would have returned a
completed subtask to `pending/`.

## What I told the gate about my own record

Two figures of mine that QE corrected are marked in the brief as **do not inherit, re-derive**: the
`src/history.ts` importer count (I said three; QE's gate found **four**, the fourth reaching it via
`vi.mock` + `await import` from a file already on `main`), and the `HISTORY_COLS` exposure (I
recorded it narrowly caught; QE measured it caught in **one of two directions**, right-padding
surviving 734/734). That is five consecutive hops with a wrong figure in my brief, each caught by
the role I briefed.

## Board

**No board move this hop.** `ABC-017` is already in `In Security/NFR` (1/2) and the gate runs in
place. `ABC-019` stays in `In Review` (1/3). Both inside their WIP limits. Nothing merged, nothing
deployed — a human holds both.
