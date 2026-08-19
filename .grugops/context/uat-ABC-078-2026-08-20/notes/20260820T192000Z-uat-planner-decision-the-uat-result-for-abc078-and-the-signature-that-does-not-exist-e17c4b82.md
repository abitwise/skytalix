---
id: 20260820T192000Z-uat-planner-decision-the-uat-result-for-abc078-and-the-signature-that-does-not-exist-e17c4b82
kind: decision
by: uat-planner
at: 2026-08-20T19:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-078
  - plans/tickets/ABC-078-iterative-deepening-and-the-engine-seam.md
  - plans/board.md
  - plans/traceability.md
  - AGENTS.md
  - NFR-004
  - AR-NFR004-A
  - RISK-002
  - src/engine.ts
supersedes: 
---

# `ABC-078` — the UAT result, what it covers, and the signature that does NOT exist

## Read this paragraph before any other

**Nobody has accepted `ABC-078`.** What follows is an **agent-conducted UAT**: six business scenarios
executed against the merged product on `main` @ `2605163` (`ABC-078` @ `542887a`), with the results
reported. It is a `decision` note and carries **no verification stamp**, because none can exist here
— `context.human_admission` is `off` and no `finding` is admissible on this install. **"6 of 6 PASS"
below means "every scenario in the pack was run and none failed." It does NOT mean a named human has
seen this, agreed with it, or accepted the work,** and it must never be quoted as if it did. The
`In UAT` exit signature is the **owner's word in session** (`AGENTS.md` § *Test and UAT authority*,
2026-08-16), and that ruling said in advance that a green agent report would **not** be treated as his
acceptance. This hop did not resolve that by inference and does not self-sign.

## The waiver was tested and does not apply

Measured from git, not asserted: `git diff --name-only 542887a~1 542887a -- src/` returns
`src/engine.ts` and `src/engine.test.ts`. **Production lines shipped**, so the 2026-08-17
zero-production-lines waiver is **unavailable** and the owner's word is owed as before.

## The result

**6 business scenarios conducted · 6 PASS · 0 FAIL · 0 unrun · 0 blocked.** Numbers live in this
task's `observation` notes and the pack; they are not restated here.

| # | the player's question | result |
|---|---|---|
| `S1` | Does it answer every move I make, quickly enough? | **PASS** — 9 legal replies, waits 3003–3005 ms, exit 0 |
| `S2` | If I take Black, does it open, and keep answering deep into the game? | **PASS** — opening move in 3067 ms incl. start-up; 12 replies, 3001–3005 ms; exit 0 |
| `S3` | I hang my queen — does it take it? | **PASS** — `Qxh7??` answered by `Rxh7`, material −8 |
| `S4` | I offer a protected pawn — does it fall for it? | **PASS** — declined `Nxd4`, played `e6` |
| `S5` | It has mate in one — does it find it and end the game? | **PASS** — `1.f3 e5 2.g4 Qh4#`, session over, exit 0, reproduced identically |
| `S6` | Does it ever freeze across a whole session? | **PASS** — 21 pooled replies, max 3005 ms, zero at or above 5 s, zero hangs |

## Three things this result explicitly does NOT do

1. **It does not accept the ticket.** See the first paragraph.
2. **It does not discharge `AR-NFR004-A`.** This hop's own 21 readings are **3001–3005 ms — over
   `NFR-004`'s 3 000 ms clause**, in the same direction as the gate's. The risk stays exactly as
   written: owner Security/NFR at `EPIC-006`'s difficulty hop, discharged only by passing ~2 900 ms or
   by re-accepting it in writing with its number, **never by editing the row and never by a UAT
   passing**.
3. **It does not accept `RISK-002`.** Iterative deepening against a clock — the mechanism this ticket
   is named after — **has no business-observable acceptance at all**: the product exposes no budget
   and no depth, so a fixed-depth build costing ~3 s would pass all six scenarios. It is guarded by
   the repaired `A4` test that runs a search, and by nothing here. **The honest answer was recorded
   rather than covered with an invented scenario**, and no QE instrument was borrowed to fake the
   coverage — QE is not UAT.

## The column, and why it is not this role's to move

**`ABC-078` belongs in `In UAT` and must stay there until the owner speaks.** The pack and a nine-question
signoff checklist he can answer with his word are published under this task's folder; three of those
questions (the 3 ms overshoot, the unobservable mechanism, the single-machine measurement) are the
ones no agent may answer for him.

**This role did not touch `plans/board.md` or `plans/traceability.md`** — the fence on this hop, and
other branches are live in those files. The `Ready for UAT → In UAT` move and the trace row are the
Orchestrator's to make from this note. **`Ready to Release` / `Done` is not available on this
report**: `Done` would then mean *merged and gated*, never *accepted*, and this ticket is not one of
the kind that may reach it without a human.
