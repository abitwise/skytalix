---
id: 20260926T023100Z-agents-md-scribe-observation-5dd1fcd9
kind: observation
by: agents-md-scribe
at: 2026-09-26T02:31:00Z
verified_by:
confidence: high
refs:
  - ABC-109
  - AGENTS.md
supersedes:
---

# ABC-109 — measurements and the A2 preservation table

Hand-authored, same admission-refusal reason as the sibling `decision` note. All measurements taken
in this worktree (`grugops/ABC-109-agents-md-cap`, branched from `0bf562f`), by `wc -c` / `git
cat-file -s`, per the ticket's own test note 1.

## A1 — size, headroom, edits

- Base re-measured at pull time (test note 2), NOT the ticket's quoted 29,749: **32,565 B**
  (`main`'s `AGENTS.md` at `0bf562f`, matching board's `32 565 B` line).
- After restructure: **21,786 B**.
- Cut: **10,779 B (33.1%)**.
- Headroom against the inherited 32,768 B cap: **10,982 B = 33.5%**.
- Headroom in edits at the ticket's measured **1,159 B/edit**: **10,982 / 1,159 ≈ 9.5 edits**.
- Headroom against the ticket's own `A1` target (≤ 24,576 B): **2,790 B** under target.

## A2 — before/after preservation table (every pointer opened and found to resolve)

| # | item | before (AGENTS.md) | after (AGENTS.md) | destination opened, found present |
|---|---|---|---|---|
| 1 | 2026-08-15 merge/test/UAT/deploy grant | `## Branching model`, `## Test and UAT authority`, `## Deployment posture` — full narrative | Same three sections, condensed; ruling, date and scope kept | `memory-bank/60-progress.md:174` "## Standing directive — deploy is ALLOWED and NOT NEEDED; merge, test and UAT are the agent's, per ticket. 2026-08-15." — present |
| 2 | 2026-08-16 signature ruling | `## Test and UAT authority`, full narrative | Condensed paragraph, ruling + "his word, not a green report" kept | `memory-bank/60-progress.md:276` "## Standing directive — the owner's word in session IS the `In UAT` signature. 2026-08-16." — present |
| 3 | 2026-08-16 ruling's "NOT a kit override" | Explicit sentence | Kept: "**NOT a kit override**" | Same section, `memory-bank/60-progress.md:297` "### 2. A standing ruling — what signs..." — present |
| 4 | 2026-08-17 zero-production-lines UAT waiver | `## Test and UAT authority`, full narrative + git measurement command | Condensed paragraph, git command kept verbatim | `memory-bank/60-progress.md:340` "## Standing directive — a ticket whose delivered diff carries ZERO PRODUCTION LINES has its UAT WAIVED, standing. 2026-08-17." — present |
| 5 | 2026-08-17 waiver's "this IS the third override" | Explicit sentence | Kept: "**This IS a kit override — the third**" | `memory-bank/60-progress.md:418` "### 5. PRECEDENCE — this one IS a kit override..." — present |
| 6 | 2026-08-17 QE-dispatch directive | `## QE validation authority`, full narrative | Condensed paragraph, forward-only + residual exposure numbers kept | `memory-bank/60-progress.md:466` "## Standing directive — EVERY ticket passes through QE's validation. QE dispatch resumes. 2026-08-17." — present |
| 7 | QE directive's "NOT an override" | Explicit sentence | Kept: "**NOT a kit override**" | `memory-bank/60-progress.md:496` "### 3. THIS IS NOT A KIT OVERRIDE..." — present |
| 8 | branching model override (#1 of 3) | `## Branching model`, full narrative | Condensed, "Kit override 1 of 3" kept, cross-ref to the count sentence | `memory-bank/60-progress.md:29` "## Standing directive — the branching model, and who turns the merge key..." — present |
| 9 | deployment posture override (#2 of 3) | `## Deployment posture`, full narrative | Condensed, "Kit override 2 of 3" kept | `memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md` — file present, opened |
| 10 | `ADR-0007` | `## Deployment posture`, three references | Condensed, one clear pointer kept + Architect/Design amend clause | Same file as row 9 — present |
| 11 | `ADR-0008` | Not present in `AGENTS.md` before this hop (checked: zero matches) | Not present after (unaffected; out of this restructure's scope) | `memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md` — file exists, was never AGENTS.md's to point at |
| 12 | kit-vs-state precedence rule | `## Kit vs state`, full section + boxed callout | **Untouched** — not edited this hop | N/A — same file, same section |
| 13 | "the count of kit overrides reads THREE... reader who counts four is wrong" | `## QE validation authority`, full sentence | Kept verbatim: "**This project's kit overrides remain THREE: the branching model, the deployment posture, and the zero-production-lines UAT waiver. A reader who counts four is wrong.**" | Same file, same section (condensed around it, sentence itself unedited) |

Every "after" cell was produced by grepping the post-restructure `AGENTS.md` and, for rows 1–11,
opening the named destination file at the quoted line and confirming the heading text matches
verbatim (commands run in this worktree; not re-derived from the ticket page).

## A3 — the tail, with byte offsets

Measured against the 21,786 B post-restructure file:

- `## Definition of ready / done` begins at byte **20,930**.
- `Definition of Ready:` / `Definition of Done:` pointer lines at bytes **20,963** / **21,036**.
- `## When uncertain` begins at byte **21,695**, file ends at **21,786**.

All three sit **2,790 B inside** the ticket's own 24,576 B target and **10,982 B inside** the
inherited 32,768 B cap.

## A4 — the machine-checked couplings

`npm test`: exit 0, **47 files, 1446 tests** — identical counts to the pre-restructure `## Test`
receipt (`RUN 2026-09-25: ... 47 files, 1446 tests`), so no test was added, removed or skipped by
this restructure. Specifically for the `- Dev / run:` slot: `src/cli.test.ts`'s `ABC-065`/`ABC-067`/
`ABC-071` block (slot-uniqueness, comment-closure, separator-and-option-equality assertions) is
inside that count and passed. `git diff --stat` against `0bf562f` touches only `AGENTS.md`,
`memory-bank/00-index.md` and the new `memory-bank/90-agents-md-command-log.md` — no line in
`src/cli.test.ts` (or any `src/` file) was touched. `npm run lint` and `npm run typecheck` also exit
0 (not required by `A4` but run for gate completeness on a docs-only change).

## A6 — zero production lines, lane charge

`git diff --name-only 0bf562f HEAD -- 'src/*' | grep -v '\.test\.ts$'` — no output (checked; no
`src/` file of any kind was touched, test or production). 0 new test files. 0 new spawns. Default
lane test count: 1446 before and after (Δ0, within the "at most 2" ceiling). No wall-clock cost was
added since no assertion was added — this restructure is prose-only in `AGENTS.md` +
`memory-bank/`. Zero production lines means the 2026-08-17 UAT waiver is available to this ticket
per its own rule, stated as a fact about the diff (not claimed in advance).

## A7 — destinations and their readers

- `memory-bank/90-agents-md-command-log.md` (new) — repo state, not kit. Reader: the `AGENTS.md`
  Scribe, before adding/amending a Commands-section line; any role chasing the full history behind
  a one-line summary `AGENTS.md` now carries. Indexed in `memory-bank/00-index.md`'s bank table.
- `memory-bank/60-progress.md` and `memory-bank/50-decisions/ADR-0007-...md` (both pre-existing,
  unmodified) — repo state. Reader: every role, on start, per `AGENTS.md`'s own "## Memory bank &
  plans" section ("`memory-bank/*` — read on start"). Nothing was moved into `agent-factory/`
  (read-only KIT).

## A8 — cap provenance

`AGENTS.md` now opens (after `## Mission`) with: "**Byte budget: this file targets ≤ 24,576 B.**
The 32,768-byte reader cap it guards against is **inherited** — sourced from the AGENTS.md Scribe's
2026-08-19 observation, not measured in this repository — and its overflow is silent and eats the
file from the tail (`ABC-109`)."
