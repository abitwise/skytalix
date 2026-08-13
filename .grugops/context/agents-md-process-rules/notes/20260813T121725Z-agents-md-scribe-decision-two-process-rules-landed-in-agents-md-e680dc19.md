---
id: 20260813T121725Z-agents-md-scribe-decision-two-process-rules-landed-in-agents-md-e680dc19
kind: decision
by: agents-md-scribe
at: 2026-08-13T12:17:25Z
verified_by:
confidence: high
refs:
  - agents-md-rules-2026-08-13
  - AGENTS.md
  - delivery-audit-2026-08-12
  - plans/board.md
  - agent-factory/workflows/16-context-read-write.md
supersedes:
---

# The owner's two rules are now durable: `AGENTS.md` § Process rules (this project)

Adopted in the owner's order — **B then A** — and written as rules **1** and **2** under one new H2,
placed immediately after `## Delivery` and before `## Branching model`. That placement groups the
three project-specific process sections together, so a reader who needs the local overrides finds
them adjacent instead of scattered.

**Cost: 24 lines, +1701 bytes.** `AGENTS.md` goes 227 → **251 lines**, 12,818 → **14,519 bytes** —
**44% of the 32 KiB Codex cap**, so the truncation risk this role guards against is not approached.

## The compression decisions, since keeping it short WAS the job

- **One shared `**Precedence**` paragraph, not two.** § Branching model and § Deployment posture each
  carry their own; both rules here answer the same precedence question about the same read-only kit,
  so writing it twice would have bought nothing and cost roughly eight lines. The § Precedence
  *pattern* is matched (bold lead, "so nobody has to guess", kit-is-read-only, what wins here); the
  duplication is not.
- **The evidence is POINTED AT, not restated.** The 9/25 rework rate, the 0.46:1 → 142:1 shift, the
  per-ticket gap counts and the 10.08 MB figure all stay in
  `.grugops/context/audit-delivery/notes/`. Copying them into the substrate every agent loads on
  start would have made `AGENTS.md` an instance of exactly what rule 2 forbids.
- **Both controls are kept IN FULL, including their anti-gaming clause.** These were the one thing
  that could not be shortened away: a rule whose control is trimmed off becomes unfalsifiable, and an
  unfalsifiable process rule is decoration. Rule 1 keeps "while gaps recorded at the `Ready for Dev`
  exit RISE"; rule 2 keeps "and criterion gaps at QE do not rise". I also spent four extra words to
  keep **"for five consecutive tickets"** on rule 1's QE threshold — without it a single lucky ticket
  satisfies the control.
- **One clarifying line added that the audit did not have:** rule 1 says it is *not* a Definition of
  Ready re-run. The kit's DoR (`agent-factory/checklists/definition-of-ready.md`) already makes the
  Orchestrator check acceptance criteria before handing a ticket to engineering, so without that line
  a future agent could reasonably read rule 1 as duplicated ceremony and skip it. DoR asks whether
  criteria are **well formed**; rule 1 asks whether they **still match what exists**. That distinction
  is the entire delta and it cost two lines.

## Verified before writing, not assumed

- **The Orchestrator really does own that exit** — `agent-factory/workflows/04-ticket-to-pr.md:33`:
  "The Orchestrator owns `Ready for Dev -> In Development`". The audit asserted it; I confirmed it at
  the source before writing a rule that assigns work to that owner.
- **`plans/board.md`'s one-line rule is live and enforced**, and it already routes overflow to
  `.grugops/context/<task>/notes/` under Workflow 16. Rule 2 is phrased as that rule *applied to*
  `plans/tickets/`, which is what proposal 2 actually proposed — not a new invention.

No ID was allocated and no ticket file was written; two BA/PM lanes hold `ABC-041`–`ABC-049` and
`ABC-050`+ concurrently. `AGENTS.md` is the only file this hop changed.
