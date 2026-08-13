---
id: 20260813T121835Z-agents-md-scribe-claim-the-kit-is-silent-not-contrary-and-the-first-draft-said-otherwise-433af560
kind: claim
by: agents-md-scribe
at: 2026-08-13T12:18:35Z
verified_by:
confidence: medium
refs:
  - agents-md-rules-2026-08-13
  - AGENTS.md
  - agent-factory/workflows/03-epic-to-tickets.md
  - agent-factory/workflows/04-ticket-to-pr.md
  - agent-factory/workflows/05-pr-quality-gate.md
  - agent-factory/checklists/definition-of-ready.md
supersedes:
---

# The precedence paragraph says the kit is SILENT, not CONTRARY — my first draft had it wrong

Worth recording because the two existing § Precedence paragraphs set a template that does not quite
fit here, and following the template blindly would have put a false sentence into the file every
agent reads on start.

**The mismatch.** § Branching model and § Deployment posture override a kit that says something
**contrary** — the kit really does hardcode "agents never merge" and a `dev → staging → prod` path,
so "the owner's directive wins" is the right shape. My first draft of this section copied that shape
and read: *"workflows 03, 04 and 05 place criteria review at the gate and set no size budget."*

**That first clause is false, and I checked before shipping it.** In
`agent-factory/workflows/05-pr-quality-gate.md` the only mention of acceptance criteria is line 21,
listing them among the gate's **inputs** ("The ticket and its acceptance criteria"). The gate reads
criteria; it is nowhere instructed to *review* them. The kit does not place criteria review at the
gate — **this project's habit did**, which is precisely what the delivery audit measured and what
rule 1 changes. Writing "the kit places criteria review at the gate" would have blamed the kit for a
local practice and mis-taught every future reader about a read-only file they cannot check cheaply.

**So the shipped paragraph claims absence, and here is the search behind it:**

- **Criteria at the `Ready for Dev` exit:** no kit workflow re-reads acceptance criteria against the
  built tree at that exit. The nearest thing is `definition-of-ready.md` ("acceptance criteria clear
  (Given/When/Then), testable and measurable"), applied by the Orchestrator *before* handing the
  ticket to engineering — a **well-formedness** check on the criteria, not a **still-matches-reality**
  check against the tree. Adjacent, not the same; rule 1 names the difference in-line for this reason.
- **A prose size budget:** `grep -rn -i "300 lines|line budget|prose|word count|too long"` across
  `workflows/`, `roles/` and `checklists/` returns no budget on ticket length anywhere. The kit's
  `size` is **effort** (`XS`–`XL`, WF03 step 2), a different quantity from prose lines that a hurried
  reader could easily conflate — so the shipped text says so explicitly.

**Why this is a `claim` and not a finding.** It rests on a bounded grep over a read-only tree plus
targeted reads of the four most likely files, and it asserts a **negative** ("no kit file does X").
That is the kind of statement a search can support but not prove, no §14 gate adjudicates it, and no
named human has ruled on it — so it is recorded soft, at medium confidence, per Workflow 16's honest
escape hatch. If a later hop finds a kit file that does budget ticket prose, the precedence paragraph
in `AGENTS.md` § Process rules is the line to correct, and this note is the one to supersede.
