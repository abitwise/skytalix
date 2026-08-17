---
id: 20260817T171157Z-orchestrator-decision-qe-dispatch-resumes-standing-every-ticket-and-the-three-things-not-decided-3c8f1a44
kind: decision
by: orchestrator
at: 2026-08-17T17:11:57Z
verified_by:
confidence: high
refs:
  - memory-bank/60-progress.md
  - plans/board.md
  - plans/tickets/history/board-header-rule1-control-2026-08-17.md
  - agent-factory/workflows/04-ticket-to-pr.md
  - .grugops/context/qe-dispatch-resume-2026-08-17/notes/20260817T162917Z-orchestrator-decision-no-retro-qe-on-the-five-the-owners-call-and-the-premise-i-corrected-first-7b3e5d19.md
supersedes:
---

# QE dispatch resumes, standing, on every ticket — and the three things this hop did NOT decide

**Owner, 2026-08-17, in session, verbatim:**

> *"QE should yes resume, each ticket needs to pass through QE-s validation"*

**THE RULE: every ticket gets a `qe-e2e` hop and QE's recorded verdict before it may leave
`In Review`. None reaches `Done` without one.** Forward from the next ticket. The authority is
`memory-bank/60-progress.md` § "Standing directive — EVERY ticket passes through QE's validation. QE
dispatch resumes. 2026-08-17."; that section is the authority and this note is not a second copy of
it.

## The escalation closes in two directions, and the split is deliberate

The 2026-08-17 board header escalated *"whether the QE stop was deliberate"* and did not ticket it.
It is now answered, and the answer has two halves that point opposite ways:

| | answer | consequence |
|---|---|---|
| **Forward** | resume, every ticket | the directive above, standing |
| **Backward** | declined | the five stay closed, the cost of the stop is never measured |

**Both are his.** The backward half and the correction put to him before he took it are in the
`20260817T162917Z` note; they are not restated here.

## What this hop wrote

1. `memory-bank/60-progress.md` — the standing directive, 69 lines, inserted after the 2026-08-17 UAT
   waiver entry.
2. `plans/board.md` — the `_Updated:` header replaced. **The outgoing header was archived VERBATIM
   first**, to `plans/tickets/history/board-header-rule1-control-2026-08-17.md`, md5
   `25399ce316ac84ea88895260b5be3773`, 3276 chars, **verified byte-identical by `cmp` against the
   archive read back FROM DISK** — measured, not asserted. It is a **non-ticket archive** because
   neither this hop nor the rule-1 hop cut a ticket; precedent for that filename shape is the
   existing `board-backlog-rows-2026-08-13.md`. The board's 13 column headings were re-counted after
   the write and are intact.
3. Dispatched the `AGENTS.md` Scribe for a short pointer section — `AGENTS.md` is what every hop
   reads first, and workflow 04 evidently is not.

**No column moved. No ticket was cut. No code, config, gate or ADR changed.**

## The three things NOT decided, recorded so none of them is later mistaken for a ruling

1. **The detector.** A check that no ticket reaches `Done` without a `qe-e2e` note in its task folder
   was offered to the owner **twice** and he has ruled on it neither time. **NOT cut, NOT assumed.**
   It matters more than it looks: this directive re-affirms a rule that `04-ticket-to-pr.md` step 5
   *already made binding*, and which was skipped five consecutive times anyway. **A sixth restatement
   is the weakest available fix, and the record already shows restatement failing.**
2. **Alpha/beta UAT phasing.** He raised batching UAT into phase milestones in the same session, in
   tentative voice (*"I think the core idea was…"*). It would be a **fourth** kit override and it
   **collides with `Ready for UAT`'s WIP limit of 4** within four tickets, so it cannot be adopted
   without either a config change or a written exemption. Nothing was written as a directive on a
   maybe.
3. **Escalation #2 — re-specifying rule 1's control** against the disjoint-populations finding.
   Untouched by any of this and still open with the owner.

## The prediction this directive makes, stated so it can be checked

The next ticket to reach `In Review` produces a `qe-e2e`-authored note in its task folder. **If a
ticket reaches `Done` without one, this directive has failed in the same way its predecessor did**,
and the answer at that point is the detector in item 1 — not another entry in this file.
