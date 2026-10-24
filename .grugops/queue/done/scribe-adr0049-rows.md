---
subtask: scribe-adr0049-rows
role: agents-md-scribe
ref: .grugops/context/scribe-adr0049-rows/
adr: memory-bank/50-decisions/ADR-0049-the-source-is-public-on-github-and-the-engine-still-deploys-nowhere-and-publishes-no-package.md
branch: new grugops/scribe-adr0049-rows from main, worktree ../wt-scribe-adr0049-rows
width: 1 of 3 (beside qe-ABC-204 ALONE and bapm-cut-readme; records only — no npm, vitest or build)
---

# ADR-0049 (ACCEPTED) rows owned by the Scribe: 28, 29, 35

## Do
- Owner accepted ADR-0049 (`owner-word-2026-10-24/…619938c5` item 1; Architect `arch-accept-adr0049/…1e9e06f0`). Apply § Records rows 28, 29 and 35 exactly as each disposition says (dated lines; history stays). Log the pass in `memory-bank/90-agents-md-command-log.md` if any `AGENTS.md` line moves.
- Touch no other row; BA/PM owns 20–24 (sibling branch), Security/NFR owns 34.

## Fences
- Only your worktree and `<scratchpad>/scribe0049/`. No `src/` edits. Do NOT run npm, vitest or builds. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4); scan your diff.

## Publish
- Commit on your branch. Seal notes (task scribe-adr0049-rows). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

Done by the AGENTS.md Scribe, 2026-10-24. Branch `grugops/scribe-adr0049-rows` from `main` `5ec82f34`; code commit `c7529e5f`, note commit `705a956f` (tip). Not pushed, not merged. Nothing run: no npm, vitest or build.

- **Rows applied, all in `memory-bank/45-standing-rulings.md`:** rows 28 and 29 as one dated correction in § Deployment posture, after the 2026-10-23 correction (section's line 145 onward); row 35 as one dated line in § Branching model, under the Config trap paragraph. 20 added lines, 0 removed; the quoted sentences stay as history.
- **Not applied, by design:** no `AGENTS.md` line moved (row 36 is "none: true"), so `90-agents-md-command-log.md` has no entry. Rows 20–24 (BA/PM) and 34 (Security/NFR) untouched; no board, `plans/`, `src/`, `tools/` or `package.json` line.
- **Class scan** of the diff (IPv4, personal paths, host/realm/namespace patterns, the reference-check word, the bin name): 0 hits.
- **Note:** `.grugops/context/scribe-adr0049-rows/notes/20261024T154217Z-agents-md-scribe-decision-9f2aaeef.md` (decision, sealed via the sanctioned writer, index files rendered).

Trace row (10 cells) for the Orchestrator to place in `plans/traceability.md`:

| (owner action) public repo (scribe-adr0049-rows) | AGENTS.md Scribe: ADR-0049 § Records rows 28, 29 and 35 applied as dated lines in the standing rulings (§ Deployment posture correction: a remote exists, the source is public, `ADR-0018` decided the channel; § Branching model: `pr` still means branch + gate, pushing is the owner's); history kept; no AGENTS.md line moved | EPIC-007 | — | none moves (records only; availability stays not-applicable-local-only) | `grugops/scribe-adr0049-rows` @ `705a956f` (code `c7529e5f`, on 5ec82f34)<br>ADR-0049, `memory-bank/45-standing-rulings.md`, `.grugops/context/scribe-adr0049-rows/notes/20261024T154217Z-agents-md-scribe-decision-9f2aaeef.md` | not run (records only; host kept quiet for the QE timing run) | n/a (no behaviour) | — | unchanged (no board edit) |
