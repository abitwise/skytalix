---
id: 20261104T203737Z-security-nfr-decision-0089724b
kind: decision
by: security-nfr
at: 2026-11-04T20:37:37Z
verified_by: 
confidence: high on R-N8H-1's level (a pre-set one-sided mark) and on the Q-N8H-1 record; medium on the budget advice, which rests on the 0.45 rate and the 76 % forecast from one ticket; no level, bar, test or config moved
refs:
  - secnfr-ABC-302-a9
  - ABC-302
  - EPIC-011
  - NFR-008
  - R-N8H-1
  - R-N8H-2
  - R-N8H-3
  - Q-N8H-1
  - ABC-282
  - ABC-301
  - ABC-286
  - ABC-288
  - ADR-0035
  - ADR-0046
  - T-QEHOP-GROWTH
  - plans/nfr-catalog.md
  - qe-ABC-302/20261104T202906Z-qe-e2e-observation-09d75ba8
  - qe-ABC-302/20261104T202949Z-qe-e2e-decision-051a910d
  - qe-ABC-302/20261104T183610Z-qe-e2e-decision-82650a68
  - orch-2026-10-30a/20261104T195654Z-orchestrator-decision-3b15b361
  - orch-2026-10-30a/20261104T203052Z-orchestrator-decision-264a280a
  - orch-2026-10-30a/20261104T172442Z-orchestrator-decision-112cd856
  - secnfr-nfr008-1104/20261104T172222Z-security-nfr-decision-1184fec4
  - secnfr-nfr008-1104/20261104T172222Z-security-nfr-observation-4e87dae2
  - secnfr-nfr008-1104/20261104T172222Z-security-nfr-observation-e2c442d3
  - secnfr-nfr008-1104/20261104T171458Z-security-nfr-decision-39f73707
  - secnfr-ABC-281-a9/20261104T042047Z-security-nfr-decision-2e3b747f
  - arch-ABC-302/20261104T181301Z-architect-design-decision-bcadd41d
  - arch-ABC-302/20261104T181301Z-architect-design-observation-8c8cfeed
  - a5651cbf
  - bff22046
  - ec4edd92
  - 6d9ce1d7
  - fd6b595f
supersedes: 
seal: sha256:0be73d98edf26a2074606e7655ee0f7224a419813836c2fbdaf7da9d15f320da
---

# Security/NFR decision, secnfr-ABC-302-a9 (`ABC-302` A9): **PASS_WITH_RISKS.** `R-N8H-1` **stays MEDIUM**: 9.505 s is not below 9.5 s. `Q-N8H-1` is recorded as (a). **Advice: hold ABC-282 and ABC-301 at ≤ +0.10 s, do not tighten the wall number, and expect one further row move of at least −0.11 s. Bundle 1 needs a budget: ≤ +0.10 s for the bundle as a whole**

Ruled on this task's observation, which rests on `qe-ABC-302` `…09d75ba8` and `…051a910d`. Nothing was run. No §14 stamp exists on this install, so nothing here is a `finding`. Every risk is observation-grade, with a named owner. The budgets below are advice: the ruling is the Orchestrator's, and the page lines are BA/PM's.

## Security review (ASVS L1, `block_on: high`)
- **No security surface is touched.** 0 production lines; the delivered `src/` diff is eight `*.test.ts` files. The one new environment read is a test gate.
- No input, auth, session, data, secret, file, config or logging path changed, so no L1 requirement in V1–V17 applies. Nothing is HIGH, and nothing blocks.

## `NFR-008`
**MET, graded, at 9.505 s** [9.39, 9.55] on `a5651cbf`, holding for `main` `6d9ce1d7`. Headroom 0.495 s. The 9.4 s target was missed, and the Orchestrator accepted that (`…264a280a` item 1). No level, bar, W, F, cap or flag moved.

## `R-N8H-1`: **MEDIUM, unchanged**
- **The mark is LOW at a graded median < 9.5 s** (A9; `…1184fec4`). 9.505 s is not below it. Rounding goes the same way, since `a8-grade.py` prints 9.51 s.
- **The 0.005 s is inside the noise, and that does not earn LOW.** The interval contains 9.5 s, so the reading cannot place H under the mark any more than over it. The rule is one-sided and was set before the read: LOW is earned by a median under the line, and this read did not show one.
- **The substance agrees with the letter.** LOW was given at `secnfr-ABC-281-a9` because headroom cleared the spread. Here 0.495 s does not clear 0.3–0.5 s, and 0.45 s at the interval top does not either. Two budgeted merges are queued against it.
- **What did improve:** headroom went from 0.16 s to 0.495 s, and the interval top moved from 10.00 s to 9.55 s. A slow window now needs the full top of the spread to reach W (9.505 + 0.5 = 10.005 s), where before 0.16 s was enough. The same tree moved only 0.08 s across today's four reads.
- **Not re-played.** Re-reading this tree to look for 9.49 s would be a read chosen for its answer. The next graded read is the next lane-input ticket's.
- **Marks, unchanged:** LOW at a graded median < 9.5 s; closed at ≤ 9.0 s; HIGH on a graded NOT MET, which is the owner's (`ADR-0035` D6).
- **Owner:** the Orchestrator (the `NFR-008` watch). **Remedy owner:** Architect/Design. Until the lane is read again, every lane-input merge spends the 0.495 s on an estimate.

## The other risks
| id | state | owner | note |
| --- | --- | --- | --- |
| `R-N8H-2` | LOW, unchanged | Architect/Design (`T-QEHOP-GROWTH`) | 5 254 note files, 246 short of 5 500 |
| `R-N8H-3` | INFO, unchanged | BA/PM, at each cut | Applied at ABC-302: no new file |
| QE's LOW gap, moved breadth runs deep only | carried, no new id | Architect/Design (`…264a280a` item 2) | `R-281-a` stays closed; this is the Orchestrator's routing, not re-ruled here |

## `Q-N8H-1`: the owner's answer, recorded
- **The word.** *"1. yes; 2. yes; 3. yes"*, to the questions as put (`orch-2026-10-30a` `…3b15b361`). Item 1 reads: "`Q-N8H-1`: (a). `NFR-008` stays at 10 s, and room is made by moving slow rows (`ABC-302`). Fallback, only if a graded median stays ≥ 9.6 s after `ABC-302`: (b) re-state W, which comes back to the owner before it is used."
- **State: ANSWERED, (a).** W stays 10 s. (b) is not in force and moves nothing until the owner's word. 9.505 s < 9.6 s, so the fallback did not fire at this read.
- **One reading for the Orchestrator to confirm.** "Stays ≥ 9.6 s after `ABC-302`" does not literally say what happens if the lane later *comes back* to ≥ 9.6 s, and today's budgets lead there.
  - Reading 1: any later graded median ≥ 9.6 s goes to the owner at once (ruling `…112cd856` item 4 reads close to this).
  - Reading 2: a graded median ≥ 9.6 s first gets a row move, and it goes to the owner if the next graded read is still ≥ 9.6 s.
  - **I recommend reading 2.** It matches "stays", and it matches the owner's chosen path, moving rows. This is routing, and it moves no bound. If the Orchestrator is unsure it is what the owner meant, asking him is one line.
  - **It matters soon.** Under reading 1, the first ticket at full budget (9.605 s) could go to the owner on its own.

## Budget advice
### ABC-282 and ABC-301: **hold ≤ +0.10 s each. Do not tighten the wall number**
1. **The tightening that works arithmetically cannot be read.** Room under 9.6 s is 0.095 s for both. Halving to +0.05 s each lands 9.605 s, still on the line, so it takes **+0.04 s each (9.585 s)**. The gate is `N8-LANE`'s H − B median. Identical trees have read +0.025 s and −0.035 s on that median, and its interval is 0.15 s wide. A +0.04 s gate would pass and fail on noise.
2. **It would not hold the line anyway.** 9.585 s leaves 0.015 s, and one tree has read 0.08 s apart today.
3. **It would not save work.** At forecast cost (+0.05–0.15 s and about +0.15 s) each ticket would owe offsets, and those offsets come from the same rows a row move would use. The row rule's supply is empty, so each SE would be doing a row-move ticket's design inside an engine ticket.
4. **+0.10 s stays useful.** It is about the smallest number this read can defend, and it still catches a real overrun.

### Add one readable aim, at no cost
**Aim: rows the ticket adds or changes sum to ≤ 90 ms in-thread, with none added to `src/cli.test.ts`.**
- At the measured 0.45 s per second, 90 ms is about +0.04 s, so two tickets on aim land about 9.585 s and no row move is needed for them.
- The SE reads it from the same vitest JSON the ≥ 50 ms rule already uses.
- It is an aim, not a gate. It cannot see a search change that slows existing rows; the wall gate still covers that. `src/cli.test.ts` is excluded because rows there returned about 1:1 at the probe.

### Expect one further row move
- **Size** (realised, against today's budgets, spent in full):

| to get | after | need | forecast to ask for (÷ 0.76) |
| --- | --- | --- | --- |
| under 9.6 s | ABC-282 + ABC-301 (9.705 s) | −0.11 s | −0.15 s |
| under 9.6 s | those + bundle 1 (9.805 s) | −0.21 s | −0.28 s |
| under 9.5 s (LOW) | those + bundle 1 (9.805 s) | −0.31 s | −0.41 s |

- **Supply.** The probe's rule has no rows left. The leads outside it forecast −0.35 s, about −0.27 s at 76 %, and all of it is `UNKNOWN - verify`. So the −0.21 s looks reachable and the −0.31 s does not.
- **Timing.** It does not hold up either build. It should merge before the second of ABC-282 and ABC-301 merges. The first at full budget lands 9.605 s, on the line and inside the noise; the second lands 9.705 s, clearly over. It needs a census of `main` after ABC-302 first; that is a lock-using read, so route it as a timing hop.
- **If both tickets land on the aim,** the Orchestrator can drop this to bundle 1's need. Each gate's H arm is a graded read and will show it.

### Bundle 1 (ABC-286 + ABC-288): **yes, it needs a budget**
- **≤ +0.10 s for the bundle as a whole, read once at its bundle read.** Same terms: an admissible twin, no new test file in the default lane, any row ≥ 50 ms goes deep. A per-ticket +0.10 s would be +0.20 s.
- **Why.** Neither page carries one. ABC-283, also a bundle, cost +0.14 s. Unbudgeted it lands 9.845–10.005 s after today's budgets, which reaches W: a NOT MET, HIGH, and the owner's.
- `arch-bundle-1` is in design, so this is the cheapest moment. ABC-286's probe rows are already in `SEARCH_DEEP`. Whether pruning lowers lane time is `UNKNOWN - verify`, and the budget takes no credit for it.

### What this means for `Q-N8H-1`
**Heads-up, not an escalation.** After these three budgets and a row move, the lane sits around 9.5–9.6 s with the known leads spent. The same growth then has no rows to pay for it, and ABC-289 is already in design. `…1184fec4` called the form near its end, and this reading supports that. The fallback's trigger, not this note, is what takes it to the owner.

## Records
`plans/nfr-catalog.md`: one dated insertion in the `NFR-008` row and one `_Updated` line. No other row is touched. No ticket, EPIC, ADR or board line was edited; the budget lines are for the Orchestrator to rule and BA/PM to write.
