---
id: 20260813T090000Z-orchestrator-decision-three-rulings-under-delegation-and-the-one-that-reversed
kind: decision
by: orchestrator
at: 2026-08-13T09:00:00Z
verified_by:
confidence: high
refs:
  - ABC-036
  - EPIC-003
  - EPIC-006
  - H2
  - memory-bank/60-progress.md
  - plans/board.md
supersedes:
---

# Three rulings taken under the owner's delegation — and the one that reversed on verification

> **Hand-authored, no stamp.** No `scripts/context-io.ts` in this repo or the kit, no
> `mcp__grugops__propose_note` in this session, `human_admission` `off`, no `§14-gate` verdict under
> this task. **No `finding` on this hop** — every result here is a `decision`, `claim` or
> `observation`, which is the honest kind.

## The delegation and its limits

**Olger Oeselg, 2026-08-13, in session:** *"commit and merge. Decide on 2, 3 and 4 based on your best
recommendations."* Items 2/3/4 were the three the Orchestrator had escalated as needing a named human.

Three limits, recorded so the next hop cannot inflate them: **this hop's three items only**;
**revocable**; and **explicitly not precedent**, following `ADR-0004`'s Status section, which records
its own by-delegation ratification the same way. A general *use your judgement* is not a standing
grant over every judgement, and the moment it is read as one, escalation stops meaning anything.

## Ruling 1 — the legality-first directive: PRECONDITION MET, directive NOT revoked

Full text in `memory-bank/60-progress.md` § "Standing directive — read before prioritising anything",
as an amendment under the owner's 2026-07-31 words rather than a replacement of them.

The distinction that carries it: *rules-correctness beats features* still binds every feature — the
generator stays the source of truth for `ABC-031`, `ABC-034` and `ABC-036` alike. What it no longer
does is justify deferring the entry point, because its own precondition is **discharged and measured**:
`EPIC-001` `Done`, deep perft 32/32, 807/807 on 28 files, three defects escaped the 2026-07-24 merges
and were caught, none since 2026-08-04. **A directive that says *legality first* is satisfied when
legality is first and done; it does not additionally say *and nothing may be run*.**

If the owner disagrees, the amendment paragraph is the thing to strike; the quoted directive above it
was not touched.

## Ruling 2 — `H2`: **DECLINED. The delegation does not reach it.**

**This is the recommendation that reversed, and the reversal is the point.** The Orchestrator had
carried `H2` to the owner as *four lines from closed*, and the Factory Coach had already proved the
mechanism (header-only registry built OUTSIDE the repo, `--skip-count 0` → `No findings.`, exit `0`).
Writing it would have taken seconds.

**Verified at source before acting, and the source forbids it in three places:**

| Where | What it says |
|---|---|
| `05-pr-quality-gate.md` step 3 | *"always human-only (a human owns `.grugops/test-skips.md`): the agent may not self-author a justification to clear its own gate"* |
| `05-pr-quality-gate.md` step 4 | *"do not retry, do not edit the baseline, **do not write into the skip registry**"* |
| `config/factory.config.md` `test_integrity` | never `off` — the TINT-03 carve-out; *"the gate must never silently accept a hollowed-out test suite"* |

An **empty** registry authorises no skip, and that argument is genuinely available — it is why this
was close. It was refused anyway: the file is the control surface governing whether an agent may
excuse its own failing tests, and **creating that surface on a general delegation rather than an
explicit instruction is the exact shape of the failure the rule exists to prevent.** The precedent
matters more than the four lines: the next agent, holding a vaguer grant, would cite this one.

**Nothing is concealed in the meantime.** Skip count is `0`, measured on every gate this week, and
Workflow 05 already records exit `2` as *could not run* — never as a pass. Owner: a named human.
The exact file content and the exact gate wiring are recorded in `60-progress.md` so nobody re-derives
them.

## Ruling 3 — `ABC-036`: accept the reduced promise, refuse the pager

Count clause binds exactly (zero tolerance against `EPIC-001`'s generator); list clause reduced to a
partial list plus the exact total and the existing `+N` marker. Pager refused as unrequested scope
(coding rules 5 and 7) — new interaction surface bought to satisfy a sentence **before any human has
run this program once**. Reversal named, not closed off: if play-testing under `EPIC-006` shows the
truncation is a real barrier, the pager is the change, and `ABC-038`'s escalation trigger fires at the
same moment.

**The DoR score was deliberately NOT re-scored.** The Orchestrator ruled the blocker; the checklist is
BA/PM's at pull time. Re-scoring another role's ⚠️ from the coordinator's chair is how a recorded gap
becomes a smoothed one.

## Board moves made, and the one convention broken on purpose

`Backlog → Ready`: `ABC-021`, `ABC-026` (BA/PM's exit, BA/PM's judgement, the Orchestrator's row).
Eight `Backlog` appends, five row edits, `Ready` `0/8 → 2/8`.

**BA/PM's requested rows were NOT taken verbatim, and that is a deliberate override of an explicit
request.** They were placed in short form. The reason is the delivery audit's headline finding —
20,510 words on this board, ticket prose at 142 lines per production line against 0.46:1 at
`ABC-001`–`008` — and the board's own rule that a row is ONE LINE with detail in the hop's notes. The
requested full text is committed and unlost in
`.grugops/context/refinement-post-abc030/notes/…-the-verbatim-board-rows-…md`; the ten outgoing
`Backlog` rows are archived verbatim in `plans/tickets/history/board-backlog-rows-2026-08-13.md` and
the outgoing header in `plans/tickets/history/ABC-028-board-history.md`, **both verified byte-identical
by re-hashing what was written rather than by asserting it.**

The Orchestrator wrote most of the prose it is now trimming. That is recorded rather than quietly
corrected.

## One defect this hop owns and did NOT repair

The backward-move ordinals are off by one — `ABC-011` moved backward 2026-08-03, six days before the
move `ABC-009`'s header calls "FIRST", and `ABC-011`'s own header says it is a backward move. Both
tickets are in `Done`. **Not repaired here, on this project's own standing rule: a gap found after a
merge becomes a new ticket, never a silent edit to a merged one.** Owner: Orchestrator. It needs an ID
and did not get one this hop, because BA/PM held ID allocation and its hop is closed — next free is
`ABC-039`.
