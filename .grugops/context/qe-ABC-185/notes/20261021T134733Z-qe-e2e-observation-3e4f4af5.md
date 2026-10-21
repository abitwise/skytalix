---
id: 20261021T134733Z-qe-e2e-observation-3e4f4af5
kind: observation
by: qe-e2e
at: 2026-10-21T13:47:33Z
verified_by: 
confidence: high (rendered and read by QE)
refs:
  - ABC-185
  - plans/traceability.md
  - grugops/ABC-185
  - grugops/qe-ABC-185
  - bf6fc623
  - 745c6225
  - 3d166e01
  - a78c353a
  - 6273bed2
supersedes: 
seal: sha256:d988832c12f093544ca4e6d0f21031ed532092d750f263ec260916cbf6599614
---

# ABC-185 A4 (d): 14 rows read in a marked 15.0.12 GFM render; 0 avoidable misplacements

Render: `node ~/.npm/_npx/d07ada7b4a99c96e/node_modules/marked/bin/marked.js --gfm -i plans/traceability.md -o <file>` at 6273bed2, rc 0. It gives 2 `<table` and 706 `<tr`; 706 is 708 `|` lines − 2 delimiter rows. Every rendered row has 10 cells; the header rows are at `:435` and `:628`. Each sampled `<tr>` was printed with its header labels and read.

Sample, `random.Random(185)`: one per layout, :1152 (6/c3), :1191 (7/c4), :1174 (7/c3), :1156 (5/c2), :1189 (7/none), :1180 (9/none), :1176 (5/c3), :1198 (6/none), :1207 (6/c2). Then 5 more at random: :1142, :1190, :1194, :1226, :1250. **14 rows, 140 cells.** I also read :1239, :1244, :1177, :1145, :1146, :1155, :1160, :1187, :1188, :1229 and :1231 to rule on them.

Result: every rendered cell's main content matches its header. No sampled row has a cell that an order-keeping map could have placed better. The only fragments of another kind are `<br>`-joined parts that A2's word order fixes in place: the branch in Title at :1180; status text in Code at :1198; the provenance clause in Code at :1189; the second branch in Status at :1250; and `branch<br>—` in Code at :1190 and :1194. A script scan for branch references outside Code finds exactly 5 across all 86 rows (:1177, :1180 Title; :1239, :1244, :1250 Status). The SE's decision `…41c6e606` names all 5.
