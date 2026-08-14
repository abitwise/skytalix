---
id: 20260815T115000Z-qe-e2e-observation-three-lane-readings-reconciled-and-my-null-downgraded-7e5c4a11
kind: observation
by: qe-e2e
at: 2026-08-15T11:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G1
  - N8-LANE
  - NFR-008
  - plans/nfr-catalog.md
supersedes: 20260815T112800Z-qe-e2e-observation-n8-lane-measured-with-the-null-control-6d2fa374
---

# Three independent `N8-LANE` readings reconciled — and my own null control downgraded

**Supersedes my earlier `N8-LANE` note.** Every measurement in it stands unchanged; **one claim in it
was too strong and I am withdrawing it here.** The Security/NFR gate hop's result landed on `main`
(`feb4629`) while I was still running, so I could not have read it when I wrote that note. Having now
read it, two things need saying: the three readings agree, and **theirs is the admissible one, not
mine.**

## The three readings

| | Software Engineer (build hop) | **QE/E2E (me)** | Security/NFR (gate hop) |
|---|---|---|---|
| gross median delta | 1400 ms | **1390 ms** | 1460 ms |
| sign test on the signal | 7/7 | **7/7** | 7/7 |
| per-file floor | 160 ms *(imported from the catalog)* | **140 ms *(measured)*** | 160 ms *(imported)* |
| **net** | **1240 ms** | **1250 ms** | **1300 ms** |
| **against the 650 ms bar** | 1.91x | **1.92x** | **2.00x** |
| identity null control | **none** | byte-identical **rerun of the same tree** | byte-identical **`cmp`-verified copy tree**, 1532 files / 0 mismatches |
| null reading | — | −110 ms = **−1.01%**, sign **1/7** | −20 ms = **−0.19%**, sign **3/7** |

**Three separately built harnesses, three trees, one conclusion: `N8-LANE` is breached, somewhere
between 1.9x and 2.0x.** The spread (1240–1300 ms net) is smaller than the gap to the bar by a factor
of about nine. **The breach is not in doubt and nobody needs to measure it a fourth time.**

## The claim I am withdrawing

My earlier note said my null control *"closes the admissibility gap the engineer flagged"*. **That
was too strong, and re-scoring my own numbers against the catalog's clause is what shows it.** The
clause requires the null to read **≤ 1.5% CPU with its sign at chance**:

```
my null:  median -110 ms = -1.01% of A's median   -> magnitude PASSES (<= 1.5%)
          sign 1/7 positive, i.e. 6/7 one-directional -> NOT at chance -> FAILS
```

My null is **byte-identical by construction** (same tree, `git status --porcelain` clean throughout)
but it is a **rerun of one tree**, and reruns inherit position in the round. The consistent negative
sign is a real, small warm-drift ordering effect — which is precisely the artefact the "sign at
chance" half of the clause exists to catch. **So my reading satisfies the magnitude half and fails
the sign half: it is honest, reproducible and corroborating, but it is *not* a fully admissible
`N8-LANE` measurement either.**

Security/NFR's is. Their null is a **separate `cmp`-verified copy tree** interleaved in the same
rounds, reading **−0.19% with sign 3/7 — at chance**. That design removes the ordering artefact mine
retained, and it satisfies both halves of the clause.

> **The formal figure of record is Security/NFR's: `NOT MET at 2.00x`. Mine corroborates it
> independently at 1.92x and should be read as a second opinion, not as a competing verdict.**

I record this rather than quietly leaving two numbers in the context, because a later hop finding
1.92x and 2.00x with no reconciliation would reasonably re-measure — and because a gate that
overstates the strength of its own instrument is doing the exact thing this whole ticket is about.

## The one place my reading adds something theirs does not

**The per-file floor.** Both other hops **imported** 160 ms from the catalog; I **measured** it in the
same interleaved harness — a full run with one extra trivial test file, as its own condition —
and got **140 ms** (median of 7, range 10–400). That sits just under the catalog's own recorded band
of 154–180 ms.

This does not change any verdict — at *my* floor the net is 1250 ms, at *theirs* 1230 ms, both ~1.9x —
but it is a live datum on a number three hops have now taken on trust, and the catalog's own
restatement rule is arithmetic from that per-file cost. **Recorded as an observation for whoever next
touches the floor account. I did not edit `plans/nfr-catalog.md` or `ADR-0008`, and I am not
proposing that the 160 ms move** — one 7-round reading on a loaded machine is not grounds to move a
ratified number, and saying so is the point.

## Unchanged from the superseded note

- `NFR-008`'s own 13 s CPU total **holds** — my median full-lane reading is **10.94 s**.
- The ten children are **criteria-forced**; I re-derived the floor from the ticket, not from anyone's
  note: `A1` (1), `A4` (3), `A5` (1), `A6`(iii) (4), bar 3 (1).
- **`G1` is not mine to rule** and I did not rule it. Security/NFR ruled it and the Orchestrator has
  carried it to the owner with the merge held. **My terminal result does not turn on `G1`** — I block
  on two defeatable instruments, which is a separate and independently fixable matter.
- **No target, bar, level or measured figure moved.** Neither `plans/nfr-catalog.md` nor `ADR-0008`
  was opened for writing by me.
