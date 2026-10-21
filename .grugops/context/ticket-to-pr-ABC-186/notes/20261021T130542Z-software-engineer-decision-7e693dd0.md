---
id: 20261021T130542Z-software-engineer-decision-7e693dd0
kind: decision
by: software-engineer
at: 2026-10-21T13:05:42Z
verified_by: 
confidence: high (every criterion scripted; A6 wording read once)
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
seal: sha256:75d699dd56796c7b64d2f0c4025a9d2ccdd4f0176273a3d90918ce529d68d3cf
---

# ABC-186 implemented as the page's Shape B (re-head), with the note settled inside its own lines

- **Re-head.** Byte-equal copies of the header and delimiter rows inserted between the blank line after the EPIC-001/ADR comment and `| ABC-057 |`. The comment and the blank lines on either side of it are untouched.
- **Blank lines.** The two blank lines between `ABC-121 (ADR-0026 accepted)`, `ABC-121 (refold)` and `ABC-109 (A5)` removed. Found by content at base `a3e6f2a7`, where the line numbers equal `3d36999b`'s (628/629, 740, 742).
- **Note (QE-165-b).** The ELEVEN-`|` / plain-split paragraph (6 lines) is deleted. The MEASURED STATE paragraph opens with `HISTORY, superseded by ROW SHAPE AND COUNT below:` (not re-wrapped, so the diff stays one line). The no-renderer sentence now reads: `marked` 15.0.12 (GFM on) splits as this note says (`qe-ABC-165` `…482f15f6`; `cmark-gfm` not tried). "Do not append to a row you believe malformed; report it." is byte-kept.
- **Forward rule.** One sentence (append directly below the last row; a blank line or an HTML comment ends a GFM table) and the `A1-fragments` command, byte-equal to the page. The check names the two commands: `A1-cells` (the command above) and `A1-fragments` (this one). No comment-close token written inside the note (only its own close).
- Diff: 1 file, +12 −13. No row word changed.
