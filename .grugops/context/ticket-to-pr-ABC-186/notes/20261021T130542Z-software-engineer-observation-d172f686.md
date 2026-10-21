---
id: 20261021T130542Z-software-engineer-observation-d172f686
kind: observation
by: software-engineer
at: 2026-10-21T13:05:42Z
verified_by: 
confidence: high (commands run in this hop at base a3e6f2a7 and head 50d54d53)
refs:
  - ABC-186
  - QE-165-a
  - QE-165-b
  - plans/traceability.md
  - grugops/ABC-186
  - a3e6f2a7
  - 50d54d53
  - 20261021T124928Z-ba-pm-observation-411b3032
  - 20261021T124943Z-ba-pm-decision-1636e62c
  - 20261021T121535Z-qe-e2e-observation-482f15f6
supersedes: 
seal: sha256:80bc3a794c9c4caee995c885e1f8234875f8ab3516f5af276cd0545dfedc9c95
---

# ABC-186 criteria, base a3e6f2a7 → head 50d54d53

- **A1** `A1-fragments`: base `4 3` → head `2 0`.
- **A2** `marked` 15.0.12 (npx cache `~/.npm/_npx/d07ada7b4a99c96e`, `--gfm -o file`): base 1 `<table`, 60 `<tr` (695 expected) → head 2 `<table`, 696 `<tr` = 698 `|` lines − 2 delimiter rows. All 696 sit inside the two tables (59 + 637), 0 outside.
- **A2 side reading.** The base's 60th `<tr` was not a table row. Row `ABC-186 (BA/PM)` (`:1264` at base) has code spans that pair across its `|` separators when lexed as a paragraph, so its literal `<tr>` came out as raw HTML. In the table each cell is parsed on its own, and it renders as `&lt;tr&gt;`. Row word unchanged.
- **A3** outside the note: 2 lines removed, both empty; 2 added, byte-equal to the header and delimiter, between the blank after the comment and `| ABC-057 |`. Lines above the note byte-equal.
- **A4** `A1-cells`: identical list at base and head, 86 names.
- **A5** `A5-note`: base `1 1 1 0 0 0` → head `0 0 0 1 1 1`. Escape-aware line, `A1-cells` line and the "Do not append…" sentence byte-unchanged.
- **A6** command present byte-equal in the note; "a blank line, or an HTML comment, ends a GFM table" is in FORWARD ROW RULE.
- **A7** `git diff --name-only main...HEAD` minus `.grugops/`: `plans/traceability.md` only.
- Re-run at the merge of `main`: in the done record.
