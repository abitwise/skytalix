---
id: 20261021T134039Z-software-engineer-decision-41c6e606
kind: decision
by: software-engineer
at: 2026-10-21T13:40:39Z
verified_by: 
confidence: high (each row read against the headers; word order fixed by A2)
refs:
  - ABC-185
  - ABC-165
  - ABC-186
  - plans/traceability.md
  - grugops/ABC-185
  - bf6fc623
  - 745c6225
  - 528c9ef0
  - 80de5949
  - 20261021T115747Z-ba-pm-decision-d2b9bf09
  - 20261021T115748Z-ba-pm-decision-e9a6c68a
  - 20261021T115746Z-ba-pm-observation-50929881
  - 20261021T124943Z-ba-pm-decision-1636e62c
supersedes: 
seal: sha256:4327a70375f96214ec768a0cae608d6d8ef3a3838d3b9ffae927b7624d85d861
---

# ABC-185 mapping rules: one column per source cell in source order, joined with <br>, empty columns —; 86 rows (85 + ABC-184)

**Rules applied to every row.** A2 strips only `|`, `\`, `—`, `<br>` and whitespace, so a source cell can never move ahead of an earlier one, and `; ` as a joiner would add a `;` that A2 sees. So: each row's map is monotonic, joins use `<br>` only, and empty columns get `—`. No cell was split. Title ← the hop description; Epic ← a cell that leads with EPIC (mixed `EPIC-nnn / ADR-…` cells kept whole); NFRs ← an ids/ADR/AR/finding cell; Code ← branch @ sha, `main (merge of …`, files; Tests ← gates, counts, readings, QE measurements; UAT ← only a cell that leads with the UAT waiver and is followed by nothing else (`:1207`, `:1249`, `:1252`); Status ← verdicts, column moves, note pointers.

**Placements forced by word order (named for A4 (b)/(d)):**
- `:1239` ABC-181 (QE), `:1244` ABC-182 (QE), `:1250` ABC-161 (QE): the second branch cell (`grugops/qe-… @ sha`) is the row's last cell, after the verdict, so it sits in Status. These are the only A4 (b) exceptions; 0 unexplained.
- `:1177`, `:1180` (ABC-173): `<sha> on grugops/ABC-173` precedes the ADR and NFR cells, so it joins Title (not matched by A4 (b)'s pattern).
- `:1145` `NFRs: none apply` follows the branch, so it sits in Tests.
- `:1155` ruling text, `:1229`/`:1231` change summaries, and `:1160`/`:1176` note pointers sit in Status after the verdict or reading.
- `:1188` `flag 400 …` joins the ADR addenda in NFRs; `:1198` `— (Backlog, DoR 9/10; …)` sits in Code; `:1187`–`:1189` hop names join Title.
- QE verdict and UAT waiver in one row (`:1146`): both in Status.
Line numbers are at base `bf6fc623`. They are the same at the merge `528c9ef0`, because main appended only at the tail.
