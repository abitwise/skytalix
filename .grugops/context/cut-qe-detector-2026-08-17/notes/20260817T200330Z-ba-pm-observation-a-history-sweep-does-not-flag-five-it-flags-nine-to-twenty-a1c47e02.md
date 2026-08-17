---
id: 20260817T200330Z-ba-pm-observation-a-history-sweep-does-not-flag-five-it-flags-nine-to-twenty-a1c47e02
kind: observation
by: ba-pm
at: 2026-08-17T20:03:30Z
verified_by:
confidence: high
refs:
  - ABC-105
  - ABC-001
  - ABC-008
  - ABC-062
  - ABC-067
  - ABC-071
  - plans/tickets/ABC-105-qe-hop-detector.md
  - plans/board.md
supersedes:
---

# A retroactive sweep does not flag five tickets. It flags **9 to 20** — measured.

The brief for this ticket, and the Orchestrator's framing before it, both assume that a
history-scanning QE detector "will flag all five forever" and that an allowlist of
`ABC-068`/`061`/`062`/`063`/`064` with the owner's decline as the reason would therefore neutralise
it. **I measured it against the repository instead of accepting it, and the premise is false.**

Method: parse every `.grugops/context/*/notes/*.md` front matter (1288 notes, **all** of which have
front matter); keep the `by: qe-e2e` ones (**223**); parse the `## Done` section of `plans/board.md`
for line-leading `- [ABC-xxx]` rows (**38**); ask, per rule, which `Done` tickets have no QE note.

| coverage rule | `Done` tickets flagged |
|---|---|
| any `qe-e2e` note in a task folder naming the ticket | **9** — the five, **plus `ABC-067`, `ABC-071`, `ABC-008`, `ABC-001`** |
| `kind: decision` + `by: qe-e2e` + folder names it + `refs:` cite it | **20** of 38 |

**A five-item allowlist would leave between four and fifteen tickets flagged in perpetuity, and
worse, it would commit to git a claim — "these five are the unrecorded ones" — that is not true.**
That is exactly the cry-wolf failure the detector must be designed against, and it is arrived at by
the *fix* rather than by the problem.

`ABC-067` and `ABC-071` are the interesting pair: both closed 2026-08-16, the day before the
directive, both `Done`, and neither has a QE verdict note filed where the convention would put one.
I am **not** claiming QE did not run on them — only that the record does not show it, which is the
same observable state as the five and is precisely what the detector reads.

This measurement is what drove `ABC-105` to a **generated 38-id grandfather snapshot** rather than a
hand-curated allowlist: the tool writes the ids from the board itself, once, so the file is a
statement of fact about a date rather than a claim about which tickets were skipped.
