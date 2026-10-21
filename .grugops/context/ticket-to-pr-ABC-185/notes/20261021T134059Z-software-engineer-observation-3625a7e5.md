---
id: 20261021T134059Z-software-engineer-observation-3625a7e5
kind: observation
by: software-engineer
at: 2026-10-21T13:40:59Z
verified_by: 
confidence: high (map emitted by the script that applied it)
refs:
  - ABC-185
  - plans/traceability.md
  - grugops/ABC-185
  - 745c6225
  - 528c9ef0
  - 20261021T134039Z-software-engineer-decision-41c6e606
supersedes: 
seal: sha256:57ef81a8f2fbb4c94ab7f5bcbb823304c2f4923aa3797f6b1fb7b1f3cb2526e8
---

# ABC-185 delivery: branch grugops/ABC-185, code 745c6225, merge-of-main 528c9ef0; the per-row map (A4 (c))

Branch `grugops/ABC-185` (worktree `../wt-ABC-185`, from main `bf6fc623`). Code commit `745c6225`: one file, `plans/traceability.md`, 86+/86−. Merge of main `80de5949`: `528c9ef0`. Done record: `.grugops/queue/done/ticket-to-pr-ABC-185.md`. Recorded as an observation, not an artifact-ref: this hop has no §14-gate run id to bind.

Correction to `…41c6e606`: the UAT column takes a cell that leads with the UAT waiver. At `:1207` a Status cell follows it; at `:1249` and `:1252` it is the last cell.

**Per-row map,** base line (same at the merge), source cell → column:

`:1142` ABC-169 (6 cells): c1→Ticket, c2→Epic, c3→Code, c4→Code, c5→Tests, c6→Status
`:1143` ABC-169 (6 cells): c1→Ticket, c2→Epic, c3→Code, c4→Code, c5→Tests, c6→Status
`:1144` ABC-170 (6 cells): c1→Ticket, c2→Epic, c3→Code, c4→Code, c5→Tests, c6→Status
`:1145` ABC-169 (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Tests, c5→Tests, c6→Status
`:1146` ABC-169 (6 cells): c1→Ticket, c2→Epic, c3→Code, c4→Tests, c5→Status, c6→Status
`:1147` ABC-170 (6 cells): c1→Ticket, c2→Epic, c3→Code, c4→Code, c5→Tests, c6→Status
`:1148` ABC-170 (6 cells): c1→Ticket, c2→Title, c3→Code, c4→Code, c5→Tests, c6→Status
`:1150` ABC-170 (merge) (7 cells): c1→Ticket, c2→Title, c3→Epic, c4→Code, c5→Code, c6→Tests, c7→Status
`:1151` ABC-167 (7 cells): c1→Ticket, c2→Epic, c3→Code, c4→Code, c5→Tests, c6→Tests, c7→Status
`:1152` ABC-167 (6 cells): c1→Ticket, c2→Epic, c3→Code, c4→Code, c5→Tests, c6→Status
`:1153` ABC-167 (bapm-amend-ABC-167) (6 cells): c1→Ticket, c2→Epic, c3→Code, c4→Code, c5→Tests, c6→Status
`:1154` ABC-167 (fix, blocked) (5 cells): c1→Ticket, c2→Code, c3→Code, c4→Tests, c5→Status
`:1155` ABC-167 (bapm-amend2-ABC-167) (5 cells): c1→Ticket, c2→Code, c3→Code, c4→Status, c5→Status
`:1156` ABC-167 (5 cells): c1→Ticket, c2→Code, c3→Code, c4→Tests, c5→Status
`:1157` ABC-167 (6 cells): c1→Ticket, c2→Epic, c3→Code, c4→Code, c5→Tests, c6→Status
`:1158` ABC-167 (5 cells): c1→Ticket, c2→Code, c3→Code, c4→Tests, c5→Status
`:1160` ABC-167 (5 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Status, c5→Status
`:1161` ABC-146 / ABC-166 (6 cells): c1→Ticket, c2→Epic, c3→Code, c4→Code, c5→Tests, c6→Status
`:1163` ABC-167 (merge) (7 cells): c1→Ticket, c2→Title, c3→Epic, c4→Code, c5→Code, c6→Tests, c7→Status
`:1164` ABC-171 (7 cells): c1→Ticket, c2→Epic, c3→Code, c4→Code, c5→Tests, c6→Tests, c7→Status
`:1166` ABC-087 / ABC-085 A2 (re-cut) (9 cells): c1→Ticket, c2→Title, c3→Epic, c4→NFRs, c5→NFRs, c6→Code, c7→Tests, c8→Status, c9→Status
`:1167` ABC-171 (6 cells): c1→Ticket, c2→Epic, c3→Code, c4→Code, c5→Tests, c6→Status
`:1168` ABC-167 (5 cells): c1→Ticket, c2→Code, c3→Code, c4→Tests, c5→Status
`:1173` ABC-173 (A1, A2, design) (9 cells): c1→Ticket, c2→Title, c3→Epic, c4→NFRs, c5→NFRs, c6→Code, c7→Tests, c8→Status, c9→Status
`:1174` ABC-171 (7 cells): c1→Ticket, c2→Epic, c3→Code, c4→Code, c5→Tests, c6→Tests, c7→Status
`:1175` ABC-171 (6 cells): c1→Ticket, c2→Epic, c3→Code, c4→Code, c5→Tests, c6→Status
`:1176` ABC-171 (5 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Status, c5→Status
`:1177` ABC-173 (C1, C2, A1–A8) (9 cells): c1→Ticket, c2→Title, c3→Title, c4→NFRs, c5→NFRs, c6→Code, c7→Tests, c8→Status, c9→Status
`:1178` ABC-173 (C1, C2, A1–A9) (7 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status, c7→Status
`:1180` ABC-173 fix (QE-173-a, QE-173-b) (9 cells): c1→Ticket, c2→Title, c3→Title, c4→NFRs, c5→NFRs, c6→Code, c7→Tests, c8→Status, c9→Status
`:1182` ABC-171 (merge) (7 cells): c1→Ticket, c2→Title, c3→Epic, c4→Code, c5→Code, c6→Tests, c7→Status
`:1183` ABC-173 (merge) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Code, c6→Tests, c7→Status
`:1186` ABC-174 (7 cells): c1→Ticket, c2→Title, c3→Epic, c4→Code, c5→Code, c6→Tests, c7→Status
`:1187` ABC-175 / ABC-174 (7 cells): c1→Ticket, c2→Title, c3→Title, c4→Code, c5→Tests, c6→Tests, c7→Status
`:1188` ABC-175 (7 cells): c1→Ticket, c2→Title, c3→Title, c4→NFRs, c5→NFRs, c6→NFRs, c7→Status
`:1189` ABC-175 (7 cells): c1→Ticket, c2→Title, c3→Title, c4→Code, c5→Code, c6→Status, c7→Status
`:1190` ABC-174 (QE) (7 cells): c1→Ticket, c2→Title, c3→Epic, c4→Code, c5→Code, c6→Tests, c7→Status
`:1191` ABC-174 (Security/NFR) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Code, c6→Tests, c7→Status
`:1192` ABC-174 (Scribe) (7 cells): c1→Ticket, c2→Title, c3→Epic, c4→Code, c5→Code, c6→Tests, c7→Status
`:1193` ABC-175 (verdict) (7 cells): c1→Ticket, c2→Title, c3→Epic, c4→Code, c5→Code, c6→Tests, c7→Status
`:1194` ABC-174 (merge) (7 cells): c1→Ticket, c2→Title, c3→Epic, c4→Code, c5→Code, c6→Tests, c7→Status
`:1197` ABC-177 (A8–A11 timing) (7 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status, c7→Status
`:1198` ABC-178 (B1–B9) (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1199` ABC-177 (A8–A11 timing-2) (7 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status, c7→Status
`:1200` ABC-177 (A9–A11 timing-3) (7 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Tests, c5→Tests, c6→Status, c7→Status
`:1201` ABC-177 (A11 O3) (7 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status, c7→Status
`:1202` ABC-177 (Security/NFR) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Code, c6→Tests, c7→Status
`:1203` ABC-177 (merge) (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1204` SEC-177-1 (QE redact, owner option 2) (7 cells): c1→Ticket, c2→Title, c3→Epic, c4→Code, c5→Code, c6→Tests, c7→Status
`:1206` ABC-162 (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1207` ABC-159 (6 cells): c1→Ticket, c2→Code, c3→Code, c4→Tests, c5→UAT, c6→Status
`:1209` ABC-160 (merge) (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1211` ABC-159 (merge) (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1212` ABC-162 (QE) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Code, c6→Tests, c7→Status
`:1213` AGENTS.md (scribe 2026-10-21) (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1214` ABC-162 (Security/NFR) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Code, c6→Tests, c7→Status
`:1215` ABC-162 (merge) (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1218` ABC-179 (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1219` ABC-163 (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1220` ABC-180 (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1221` ABC-179 (QE) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Code, c6→Tests, c7→Status
`:1222` ABC-179 (merge) (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1223` ABC-180 (QE) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Code, c6→Tests, c7→Status
`:1224` ABC-163 (Architect fold review) (7 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status, c7→Status
`:1226` ABC-180 (Security/NFR) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Code, c6→Tests, c7→Status
`:1227` ABC-180 (merge) (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1228` ABC-163 (QE) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Code, c6→Tests, c7→Status
`:1229` ABC-163 (Architect ADR text) (7 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status, c7→Status
`:1230` ABC-163 (Security/NFR) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Code, c6→Tests, c7→Status
`:1231` ABC-163 (Architect ADR text 2) (7 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status, c7→Status
`:1232` ABC-163 (merge) (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1236` ABC-181 (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1237` ABC-183 (6 cells): c1→Ticket, c2→Title, c3→Code, c4→Code, c5→Tests, c6→Status
`:1238` ABC-182 (6 cells): c1→Ticket, c2→Title, c3→Code, c4→Code, c5→Tests, c6→Status
`:1239` ABC-181 (QE) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Tests, c6→Status, c7→Status
`:1240` ABC-181 (merge) (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1241` ABC-183 (QE) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Code, c6→Tests, c7→Status
`:1242` ABC-183 (Security/NFR) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Code, c6→Tests, c7→Status
`:1243` ABC-183 (merge) (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1244` ABC-182 (QE) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Tests, c6→Status, c7→Status
`:1245` ABC-182 (merge) (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1247` ABC-161 (6 cells): c1→Ticket, c2→Title, c3→Code, c4→Code, c5→Tests, c6→Status
`:1249` ABC-161 (5 cells): c1→Ticket, c2→Code, c3→Code, c4→Tests, c5→UAT
`:1250` ABC-161 (QE) (7 cells): c1→Ticket, c2→Title, c3→NFRs, c4→Code, c5→Tests, c6→Status, c7→Status
`:1251` ABC-161 (merge) (6 cells): c1→Ticket, c2→NFRs, c3→Code, c4→Code, c5→Tests, c6→Status
`:1252` ABC-184 (5 cells): c1→Ticket, c2→Code, c3→Code, c4→Tests, c5→UAT
