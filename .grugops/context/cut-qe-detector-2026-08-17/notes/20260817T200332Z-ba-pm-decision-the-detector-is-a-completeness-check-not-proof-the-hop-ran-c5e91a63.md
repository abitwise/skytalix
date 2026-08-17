---
id: 20260817T200332Z-ba-pm-decision-the-detector-is-a-completeness-check-not-proof-the-hop-ran-c5e91a63
kind: decision
by: ba-pm
at: 2026-08-17T20:03:32Z
verified_by:
confidence: high
refs:
  - ABC-105
  - plans/tickets/ABC-105-qe-hop-detector.md
  - AGENTS.md
  - tools/grugops/test-skip-integrity.js
  - .grugops/context/qe-dispatch-resume-2026-08-17/notes/20260817T171157Z-orchestrator-decision-qe-dispatch-resumes-standing-every-ticket-and-the-three-things-not-decided-3c8f1a44.md
supersedes:
---

# The ceiling, ruled and written INTO the ticket: this proves a record exists, **not** that QE ran.

`AGENTS.md` records for `.grugops/test-skips.md` that *"the agent may not self-author a
justification to clear its own gate."* **`ABC-105` does not achieve that property, and I have written
that limit into the ticket (`A7`, `## Scope` 4, `## Out of scope`) rather than leaving it to be
discovered by whoever builds it or, worse, by whoever later relies on it.**

**Why it cannot.** `by: qe-e2e` is self-declared metadata in a hand-authored markdown file. Any agent
can write a conforming note. The contrast with the precedent is exact and is the reason I can state
this confidently rather than as a worry: `test-skip-integrity.js` is un-cheatable because its
decisive input, `--skip-count`, comes from **outside the artifact under test** — the test runner —
and because it rejects placeholder owners, so a self-authored row cannot name an accountable human.
**`ABC-105` has neither lever.** The note and the claim about the note originate in the same process.
There is no external signal to compare against, and no human-owned register to check the authorship
against.

**What it does buy, and this is not nothing.** The measured failure was not forgery. It was
**silence**: five consecutive tickets reached `Done` with **no QE note at all** and **no note anywhere
recording a decision to stop** — the Orchestrator's own escalation established it was drift, not a
call. A completeness check on the record catches exactly that class and converts it from invisible
into a red exit at the `Done` gate. **The Orchestrator's judgement that a sixth restatement is the
weakest available fix stands; this is a stronger fix than restatement and a weaker one than a real
control, and it should be described as the middle thing it is.**

**Rulings, so the engineer decides nothing:**

1. **Do not describe the tool as preventing self-authorship.** `A7` makes the absence of such a claim
   a testable criterion — the header comment and the new `AGENTS.md` paragraph are read and must both
   state the ceiling in plain words.
2. **One cheap hardening only:** the verdict note must not live in the ticket's own `ticket-to-pr-*`
   folder. Measured true for `ABC-031`, `ABC-076`, `ABC-066` — QE dispatches to its own task folder —
   so it costs real QE nothing and makes a fake require a deliberate second folder.
3. **No `--force`/`--skip`/`--allow` flag** (test note 3). A per-run override is the silent-drift
   failure mode reintroduced through the fix's own front door. Scope exclusion is the committed
   snapshot or nothing.
4. **Forward-only from 2026-08-17**, inheriting the scope `AGENTS.md` § "QE validation authority"
   already sets in its own words rather than inventing a second one, and implemented as a **generated
   grandfather snapshot**, not an allowlist — see the `20260817T200330Z` note for the measurement that
   killed the allowlist design.

**Escalation, DoR item 10 ⚠️, and the only thing I want the owner's word on before a line is written:**
the owner said yes to *"the QE detector"*. If he meant a control an agent cannot satisfy by writing
its own note, **`ABC-105` is not it and cannot be made into it** — that needs an external signal and
is a different, larger commission. `ABC-105` is buildable and worth building either way; the risk I am
naming is a mismatch between what ships and what he believes he approved. **I did not resolve this by
guessing at his intent.**
