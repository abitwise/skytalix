---
kind: index
---
# Memory Bank — Index
_Updated: 2026-08-12 by Architect/Design (task `arch-audit-2026-08-12`, subtask `audit-architecture`) — **the ADR count was STALE BY FOUR** (this file said seven; there are eleven) and `30-architecture.md`'s description was stale by a whole epic. Both corrected below; the ADR count was measured by listing `50-decisions/`, not inferred. Previously 2026-08-06 by the Orchestrator (task `refinement-deploy-posture-2026-08-06`) — fill state corrected: `70-runbook.md` is no longer an empty template and the ADR count was three behind. Previously 2026-08-02 by the Orchestrator (state save before a context clear: `60-progress.md` filled, fill-state of the bank recorded below)._

> **Fill state — read this before you read the bank.** Only four files below carry real project
> content: **`60-progress.md`** (the plan-of-record — **start here**), **`30-architecture.md`**
> (as-built after **`EPIC-001` and `EPIC-002`**, rewritten 2026-08-12, plus the deployment posture),
> **`70-runbook.md`** (first filled 2026-08-06; short on purpose — this project deploys nowhere and
> there is almost nothing to operate), and **`50-decisions/`** (**sixteen** ratified ADRs,
> `ADR-0001`–`ADR-0016`, all `accepted`; next free id is **`ADR-0017`**). **Re-measured 2026-08-19 by
> listing `50-decisions/`, not inferred:** `ADR-0012` (book/engine composition point) was written
> `proposed` on 2026-08-18 and ratified the same day; `ADR-0013` (no placeholder opponent in `src/`)
> was written and ratified 2026-08-18; **`ADR-0014` (the default lane's CPU budget is overdrawn;
> `N8-LANE` is a rate limit, not a grant) was written and ratified 2026-08-19 at `ABC-108`, and this
> line was updated in the SAME COMMIT as the rule below requires; **`ADR-0015` (a substituted module
> must be a seam supplier) was written and ratified 2026-08-19 at `ABC-043` `G-01`, and this line was
> again updated in the SAME COMMIT.** **`ADR-0016` (a closed stdout reader ENDS the session at exit
> `0`; the entry point, not the write site, owns the stdout error arm) was written and ratified
> 2026-08-20 by Architect/Design at `design-ABC-115-2026-08-20`, and this line was updated in the
> SAME COMMIT — the count was RE-MEASURED by listing `50-decisions/` (sixteen `ADR-00*` files), not
> incremented from the sentence above it.** **`ADR-0021` (the turn loop gains a `quit` arm and a
> `take-back` arm; `resign` stays its own command) was written and ratified 2026-09-19 by
> Architect/Design at `owner-rulings-2026-09-19` / `ruling-abc046-quit-arm` on the owner's verbatim
> word. THE COUNT LINE ABOVE IS DELIBERATELY NOT UPDATED HERE: `ADR-0018`, `ADR-0019`, `ADR-0020`,
> `ADR-0022` and `ADR-0023` are reserved by five sibling hops of the same task on sibling branches,
> so any number written on this branch is wrong at merge — re-measure by listing `50-decisions/`
> after the task's branches land.**
> The rest — `10-project-brief`, `20-product`, `40-contributing`, `80-glossary` — are still the
> shipped empty templates. That is a real gap, not a hidden one; do not read them expecting content
> and do not treat their silence as a decision. `plans/` carries the delivery state meanwhile.
>
> **This count has now gone stale twice** (three behind on 2026-08-06, four behind on 2026-08-12),
> and it goes stale because it is a hand-maintained census of a directory. **Whoever writes
> `ADR-0014` updates this line in the same commit** — or better, reads `50-decisions/` and trusts
> that instead of this sentence.

<!--
  FORMAT — read before you fill this bank. (clear voice; this is a technical file, not a role prompt.)

  This is the project's persistent working memory. It ships EMPTY: each file below is named
  with its one-line purpose, but carries no project content — fill it per-project during
  bootstrap. Keep every file small and single-purpose; this is a memory bank, not a document dump.
-->

## Working-memory contract

- Roles **read this bank on start** to orient in one read.
- `60-progress.md` is the **running plan-of-record**, kept current by the **daily sweep**.
- `50-decisions/` captures **ADRs as they are made** (copy `50-decisions/ADR-template.md`).
- This index **maps the bank** so an agent or human can orient quickly.

## The bank

| File | Purpose |
|------|---------|
| `00-index.md` | this map + the working-memory contract |
| `10-project-brief.md` | the project's foundation: what, why, for whom |
| `20-product.md` | product context: users, value, scope |
| `30-architecture.md` | architecture, system patterns, tech context |
| `40-contributing.md` | how to contribute and the project conventions |
| `50-decisions/` | architecture decision records (ADRs); see `ADR-template.md` |
| `60-progress.md` | running plan-of-record: what works, what's left, known issues |
| `70-runbook.md` | how to operate, deploy, and roll back in production |
| `80-glossary.md` | shorthand, acronyms, domain terms |
