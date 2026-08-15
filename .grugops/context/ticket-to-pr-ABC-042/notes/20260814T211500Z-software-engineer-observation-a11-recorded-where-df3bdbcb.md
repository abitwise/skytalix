---
id: 20260814T211500Z-software-engineer-observation-a11-recorded-where-df3bdbcb
kind: observation
by: software-engineer
at: 2026-08-14T21:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - A11
  - A12
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
supersedes: 
---

# `A11` says "recorded in this ticket". `A12` says the diff is six files. This is where the reading went, and why.

## The collision, stated rather than resolved silently

- **`A11`:** *"the median wall time … is ≤ 1 s, **recorded in this ticket with its machine** — or `A11`
  is unrecorded rather than met."*
- **`A12`:** *"`git diff --name-only` shows exactly: the entry point, the resolver, their test
  file(s), `package.json`, `AGENTS.md` and `src/history-pane.nfr.test.ts` — **and nothing else**."*

`plans/tickets/ABC-042-…md` is not on that list, and the subtask's hard limits repeat it word for
word. **Editing the ticket page to satisfy `A11` would break `A12`; leaving it breaks `A11`'s
"recorded in this ticket".** Project rule 2 points the same way as `A12` — *"measurements … go to
`.grugops/context/<task>/notes/`"* — which is why I read this as a wording collision rather than a
choice between two equal options.

## What I did

**The reading is recorded, with its machine, in this task's notes and in the hand-back to the
Orchestrator** (`…observation-build-and-gate-4ea427ce`), and **the ticket page was not touched**:

| command | median | n | min | max |
|---|---|---|---|---|
| `node src/cli.ts` — the entry point as a child | **68.8 ms** | 8 (round 0 discarded of 9) | 61.2 | 74.3 |
| `npm run chess` — what a human types | **150.3 ms** | 8 | 146.0 | 152.8 |

**Machine: Apple M3, 8 cores, 16 GB, Darwin 25.5.0 arm64, Node v24.12.0, npm 11.7.0.**
Protocol: `spawnSync` from process start to the child's exit with the whole 23-row frame captured —
an **upper bound** on "to the last byte of the first frame". Bar: **≤ 1 s**. Not a suite assertion,
by `A11`'s own design. `plans/nfr-catalog.md` untouched.

## The gap this leaves — G8

**`A11` is MET on its measurement and its bar, and its "recorded in this ticket" clause is satisfied
in the notes rather than on the page.** Whoever owns the page can paste the two lines above if the
literal wording is to stand; **that page is BA/PM's and one line of it is not the engineer's to
write**, least of all on a ticket that has already lost two criteria to a build silently repairing
its own acceptance text.

- **Severity: low.** No measurement is missing, nothing is unverifiable, and the number is in the
  shared context where the next role reads it.
- **Owner: BA/PM** — either paste the reading onto the page (and accept that `A12`'s file list then
  needs the ticket on it), or reword `A11` to "recorded with its machine" and let rule 2 place it.

This is the fourth criterion-vs-criterion collision found on this ticket (`A10`'s two halves,
`A9`'s scope word, `BAR 1b`'s `exec` token, and now this). It is the smallest of the four and the
only one that costs nothing to leave standing.
