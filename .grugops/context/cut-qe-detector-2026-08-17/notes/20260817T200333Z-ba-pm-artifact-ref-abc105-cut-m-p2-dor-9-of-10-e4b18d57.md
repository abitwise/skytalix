---
id: 20260817T200333Z-ba-pm-artifact-ref-abc105-cut-m-p2-dor-9-of-10-e4b18d57
kind: artifact-ref
by: ba-pm
at: 2026-08-17T20:03:33Z
verified_by:
confidence: high
refs:
  - ABC-105
  - plans/tickets/ABC-105-qe-hop-detector.md
  - plans/traceability.md
supersedes:
---

# `ABC-105` cut — `M`, `P2`, DoR **9/10 ⚠️**. Board row NOT placed.

**Written:** `plans/tickets/ABC-105-qe-hop-detector.md` — **238 lines**, inside the 300-line process
rule 2 budget; the reasoning behind the five decisions is in this folder's three sibling notes, not
in the ticket.

**Appended:** one row to `plans/traceability.md`, plus one dated `_Updated:` header paragraph. **No
existing row touched, no requirement linkage changed.**

**Deliberately NOT touched:** `plans/board.md` — the Orchestrator places the row. `AGENTS.md`,
`memory-bank/*`, `agent-factory/*` (read-only kit), `tools/`, `src/`. **Nothing was implemented:
there is no `tools/grugops/qe-hop-integrity.js` and no `.grugops/qe-cutover-2026-08-17.txt` on this
branch — both are the ticket's deliverables, not this hop's.**

**Id selection:** `plans/tickets/` was listed and the true maximum read as `ABC-104`; `ABC-105` is the
next free id. `ABC-088`–`ABC-091` and `ABC-097`–`ABC-099` do not exist as files and were **not**
reused — gaps in the sequence are left alone.

**The five decisions, one line each** (rulings and evidence in the sibling notes):

1. **Scan/mapping** — front matter over all `.grugops/context/*/notes/*.md`; covered = `by: qe-e2e`
   **and** `kind: decision` **and** `refs:` cite the ticket **and** the task folder names it,
   normalised (`abc031` ≡ `ABC-031`). Filenames are not read.
2. **When** — both, and neither is CI (no CI and no remote on this project, measured):
   `--ticket ABC-xxx` **blocks** the `Done` move; `--sweep` reports over all `Done` rows at hygiene.
3. **Retroactive** — **no.** Forward-only from 2026-08-17 via a **generated 38-id grandfather
   snapshot**, not an allowlist of five, because a sweep flags 9–20, not 5.
4. **Self-authorship** — **not closed, and said so in the ticket.** Completeness check on the record,
   not proof the hop ran. `A7` makes the honesty of that description testable.
5. **Size/priority/DoR** — `M` (5), honestly bigger than it looks (five measured sub-problems);
   `P2` with the argument for `P1` stated; DoR **9/10**, item 10 ⚠️ on the owner acknowledging the
   ceiling in decision 4 before it is built.

**Note on the brief:** it asked for a *"five-item Definition of Ready"*.
`agent-factory/checklists/definition-of-ready.md` has **ten** items and the ticket is scored against
all ten, matching `ABC-103`'s house shape.
