---
id: 20260810T134800Z-security-nfr-decision-b5f3e1a1
kind: decision
by: security-nfr
at: 2026-08-10T13:48:00Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - ABC-016
  - ABC-017
  - EPIC-002
  - EPIC-003
  - NFR-002
  - NFR-003
  - src/san.ts
  - plans/board.md
  - plans/tickets/ABC-013-san-rendering.md
supersedes: 
---

# SECURITY/NFR VERDICT: **PASS_WITH_RISKS**. No required fix. Four accepted risks, each with a named owner and a trigger. `ABC-013` moves `In Security/NFR` → `Ready for UAT`.

`security.block_on` is `high`; **nothing here is high or medium**, so nothing blocks.
`quality.gate_enforcement` is `blocking` and nothing was softened to reach this verdict.

## The two halves, kept apart

| half | result | why |
|---|---|---|
| **security** | **PASS** | untriggered — and confirmed by measurement, not by repeating the ticket |
| **NFR** | **PASS** | `N1`–`N4` re-derived independently on two builds and two protocols; all four met |

## Why PASS_WITH_RISKS and not PASS

Nothing found requires a fix and nothing found blocks. Four things are true that the next hops should
not have to rediscover, and an unowned risk is a finding nobody fixes — so each carries an owner and
a trigger rather than a paragraph.

| id | severity | risk | owner | trigger |
|---|---|---|---|---|
| `RISK-ABC013-01` | **LOW** | `N4`'s measured cell in the ticket reads `worst 9.34 / 9.25 µs` and that figure is a **mean over the three checking piece moves**, not a per-move maximum. The 14 µs bar was derived at ~1.5x of it; against a true reference worst (10.485–10.603 µs measured here) the same bar is ~1.32x. | **BA/PM** — that section is BA/PM's and a gate does not edit an NFR bar | the next re-derivation of `N4`, or any argument about the 14 µs bar. Anyone comparing a per-move worst against 9.34 will read a regression that does not exist — which is exactly what happened to the Engineer |
| `RISK-ABC013-02` | **LOW** | `N1` is machine-independent and **not position-independent**: measured 4.33x at startpos, 4.94x at perft-3, 8.94x at `P60`, 21.5x at perft-5, 24.65x at kiwipete — **below its own 5x bar at two of five positions**. The bar is MET because it pins `P60`. | **Security/NFR** — this column, at the next gate that touches `N1` | any re-derivation of `N1` away from `P60`, or any ticket quoting it as a property of `toSan` rather than of `toSan` **at `P60`**. It would produce a FALSE FAIL on a correct build |
| `RISK-ABC013-03` | **LOW** | `toSan` validates neither of its two caller obligations and logs nothing, so a caller that supplies an illegal `move` or a mismatched `legal` list gets a **silently wrong string with no error and no log**. Low today because there are **zero importers**. | **BA/PM at `EPIC-003`** — a total `toSan` is a contract change and belongs in a ticket, not in a gate | the first caller: `ABC-016`, `ABC-017`, or `parseSan`. This is also the only ASVS L1 row that pointed anywhere (`V2.2.1`), and it points forward rather than here |
| `RISK-ABC013-04` | **LOW** | QE's five criteria gaps (over-qualified disambiguation) stay open by design. **Weighed here rather than inherited: they bear on NEITHER half of this gate** — an over-qualified string stays inside the measured 7-character bound and the printable-ASCII set, and over-qualification changes which rung of the ladder returns, not whether a legal list is built, so the call counts and all four bars are identical. A full-square-always build passes `N1`–`N4`. | **BA/PM** | before `ABC-016` / `ABC-017` consume `toSan` — QE's recipe (one property: no shorter qualifier would also be unique) is already written up |

## What this gate refused to do

- **It did not move an NFR bar.** `RISK-ABC013-01` is a real defect in a number the ticket publishes,
  and the honest move is to report it to a human. `plans/nfr-catalog.md` was not edited, no catalog
  target moved, and no criterion, FEN, expected string or bar in the ticket was changed. A gate that
  edits the target it is scored against has stopped being a gate.
- **It did not close QE's five criteria gaps.** They are BA/PM's and they do not bear on this gate.
- **It did not touch `src/`.** No module, no test, not one character.
- **It did not fake a `finding`.** No `finding` is admissible on this task — there is no `§14-gate`
  verdict record to issue a `§14-gate#<id>` stamp (`emitVerdict` lives in the absent
  `scripts/context-io.ts`) and `context.human_admission` is `off`, so no `human:<name>` stamp exists
  either. Every measured result here is an `observation`, this verdict is a `decision`, and the limits
  are a `claim` with `confidence: UNKNOWN - verify` — the honest degrade Workflow 16 step 4 names.
  Nothing is self-stamped and no `index.md` / `index.jsonl` was hand-faked.

## Board move

`ABC-013` moves `In Security/NFR` → `Ready for UAT`. **In Security/NFR 1/2 → 0/2, Ready for UAT
0/4 → 1/4.** Every WIP limit respected. The `In Security/NFR` exit is this role's; the `Ready for UAT`
exit is the UAT Planner's and was **not** taken.

The outgoing `_Updated:` header was appended **verbatim** to
`plans/tickets/history/ABC-013-board-history.md` **before** the board header was replaced, per the
board's own rule, and byte-checked: the file grew by exactly the entry (10,380 chars) plus the header
(4,319) plus one newline, 31,684 → 46,384. Every board heading was edited at line start and verified
by **re-parsing the headings**, never by a containment test — the format comment's two example
headings were confirmed byte-identical to before, which is the fault the previous hop published about
this same file.

The ticket front matter moved `status: in-security-nfr → ready-for-uat`, `column: In Security/NFR →
Ready for UAT`, and the file's length changed by exactly the two token deltas (−4), with every other
line asserted byte-identical.

## Not authorised

**Nothing was merged and nothing was deployed.** The owner's standing merge directive
(`memory-bank/60-progress.md`) applies to work that passed and is the Orchestrator's to exercise at
the merge point with the owner; a gate result is not a merge instruction. `ABC-013` has not been
through UAT. A human holds deploy, and `production_requires_human_confirmation` is `true`.
