---
id: 20260816T045500Z-ba-pm-observation-gaps-found-at-the-wording-refinement-hop-3e77c1b9
kind: observation
by: ba-pm
at: 2026-08-16T04:55:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - ABC-066
  - ABC-021
  - ABC-026
  - plans/board.md
  - .grugops/queue/pending/refinement-Q8-slot-guard.md
supersedes: 
---

# Gaps found at the `refinement-abc065-wording` hop — each with severity and owner

Numbered **`W1`–`W5`** to stay clear of the Orchestrator's `G1`–`G3`, the Scribe's `G4`–`G7`, the
guard hop's `G8`–`G12`, QE's `Q1`–`Q10` and Security/NFR's `S1`–`S6`, all of which are referenced and
**not restated**. **None blocks anything. Four are new; one I created myself and left on purpose.**

**Count for the `Ready for Dev` exit control (`AGENTS.md` § Process rules 1): 5 gaps at this
refinement hop, of which 0 are `HIGH`, 1 `MEDIUM`, 4 `LOW`.** *(This is a refinement hop, not a `Ready
for Dev` exit; recorded in the same shape so the control's denominator is not quietly changed.)*

---

## `W1` — the board↔ticket front-matter contract is broken on **4 of 69** rows, and two of them say `Backlog` while sitting in `Done`. **MEDIUM.** Owner: **Orchestrator**

`plans/board.md`'s own FORMAT block states the contract: *"A ticket's `column:` value MUST equal the
board column it sits under, and `status:` is the kebab-case form of that column."* Measured at this
hop across every `- [ID]` row on the board against every `plans/tickets/ABC-*.md` front matter:

| ticket | page says | board says |
|---|---|---|
| `ABC-021` | `Backlog` | **`Done`** |
| `ABC-026` | `Backlog` | **`Done`** |
| `ABC-065` | `In Development` | **`Ready for UAT`** |
| `ABC-066` | `In Development` | **`Ready for UAT`** |

**65 of 69 agree, so this is a leak in the move step, not a broken convention.** The two `Done`
entries are the sharper half: a reader who trusts front matter sees two shipped tickets as unstarted
backlog. **And `ABC-021` and `ABC-026` are the SAME two tickets `ABC-052` measured going stale in
`plans/traceability.md` at their merge** — so one merge leaves **two** records stale, and `ABC-052`
covers only one of them, having explicitly fenced *"any ticket page"* out of its scope.

**NOT cut from this hop's id range** — it is not one of my assigned five, and repairing `ABC-065`'s
cell alone is the *refresh-a-number* trap `ABC-030` refuses. **It wants one ticket for the class, and
the Orchestrator owns both the column moves and the enqueue.**

## `W2` — `G6` / the `A6` wording was routed to BA/PM by the ruling and appears in **neither** BA/PM subtask. **LOW**, and it is a routing gap, not a prose gap. Owner: **Orchestrator**

The `G8`–`G12` ruling lists the BA/PM queue as: *"`S1`, `S2`, `G8`, `G9`+`G11`, `G12`, `Q3`/`Q4`, plus
`ABC-065`'s and `ABC-066`'s `A6` wording."* **Nine items. The two subtask files carry `Q7`, `Q9`,
`G8`, `G9`+`G11`, `G12` (mine) and `S1`, `S2`, `Q3`, `Q4` (the sibling's) — the `A6` wording is in
neither.** It is the item the ruling itself framed as unperformable-as-written (*"exactly two paths"
cannot be met by any hop that obeys Workflows 16/17*), and it was ruled scored against the delivery
commit excluding `.grugops/` — **a ruling that currently lives only in a note, which is the same
shape as the defect `ABC-060` exists to fix.**

**I did not absorb it.** It sits on the same page as `G12` and the same pen would repair it in the
same minute, so **`ABC-070` § Out of scope carries the recommendation to add it there before that
ticket is pulled** — stated for the Orchestrator to take or refuse, not taken.

## `W3` — `refinement-Q8-slot-guard` is in a **half-claimed** state: the claim directory exists and is EMPTY, and the task file is still in `pending/`. **LOW.** Owner: **Orchestrator**

Observed twice at this hop (04:30 and 05:00): `.grugops/queue/claimed/refinement-Q8-slot-guard/`
exists with **no `claim.md`** and no task file, while `.grugops/queue/pending/refinement-Q8-slot-guard.md`
is still in `pending/`. Workflow 17's atomic act — the bare `mkdir` — has been performed, so **a
second claimant is already locked out**, but nothing records **who** holds it or **when** they took it,
and `queue.stale_ttl_minutes` is `30` with no `at:` to measure the TTL against.

**Almost certainly a live sibling mid-claim rather than an abandoned lock** (my own lane and the
`abc066-security-qe` lane both completed the same sequence in the same window). **Recorded because
the failure mode is silent:** if that hop died between the `mkdir` and the `claim.md`, the item is
unclaimable and unattributable, and nothing will notice.

## `W4` — `Q7` has no owning ticket until the Orchestrator routes it, and my note is its only carrier. **LOW today, `MEDIUM` if it is dropped.** Owner: **Orchestrator**

Folded into the `Q8` subject rather than cut, with the proposed criterion and the `A1`-uniqueness
consequence written out verbatim in this hop's dedupe note. **`ABC-071` was deliberately left unspent
so an id is available if the `Q8` ticket is already closed to change.** Full reasoning and the risk
statement are in that note; not restated here.

## `W5` — I made `ABC-065`'s DoR row 2 quote a fence the page no longer carries. **LOW. Self-inflicted, left on purpose.** Owner: **BA/PM** (whoever next opens the page)

My `A2` re-word changed the criterion; **DoR row 2 still reads *"five fences, including `:193-204`
byte-identical…"***. I left it because that row is a **dated assessment record scored 2026-08-15
against the page as it then read**, and editing a scored DoR row after its gate is the class of thing
this hop refused elsewhere. **The annotation under `A2` carries the original wording verbatim, so the
row is consistent with what it assessed** — but a reader who reads the DoR before the criterion meets
the old fence one last time. **Named rather than discovered later.** If `G6` or `G12` opens the page,
a one-clause dated addendum on that row is the cheapest disposal.

---

## Measured control inputs, recorded because two project process rules ask for numbers

- **Rule 2 (ticket prose budget, median ≤ 300 lines).** The three tickets cut here are **196**, **169**
  and **154** lines — **median 169**. `ABC-065` grew **174 → 202** with the `A2` annotation and stays
  inside the budget.
- **Rule 1 (gaps at the `Ready for Dev` exit rise while gaps at QE fall).** This hop is not that exit,
  but it is the hop that turns nine QE/build-hop gaps into tickets: **5 items in, 3 tickets out, 1
  repaired in place, 1 folded across lanes, 0 dropped.**
- **`ABC-071` is UNSPENT.** No id outside `ABC-068`…`ABC-071` was written, and one inside it was not
  needed.
