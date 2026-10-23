---
id: 20261023T081245Z-software-engineer-decision-3c9e5d2b
kind: decision
by: software-engineer
at: 2026-10-23T08:12:45Z
verified_by: 
confidence: high
refs:
  - ABC-197
  - QE-177-b
  - ABC-167
  - EPIC-007
  - ABC-177
  - ABC-178
  - src/uci-session.test.ts
  - 051d557a
  - 20e397c8
  - QE-178-f
  - 20261022T155222Z-orchestrator-decision-931fad2b
  - 20261023T080227Z-architect-design-decision-578a9290
  - 20261023T072556Z-security-nfr-decision-d0c770b5
  - 20261023T081245Z-software-engineer-observation-eeec2b5f
  - 20261023T081245Z-software-engineer-observation-ba08acdc
  - 20261023T081245Z-software-engineer-observation-78292c2d
supersedes: 
seal: sha256:19a471ceb1cf5e0fac7b4c75719ef4299c2f7a10fed495ff158dcda4342eeffd
---

# `ABC-197` built to the page: R2 after U7's loop on the start position; QP1d declined; A5's two variants routed to BA/PM; notes left uncommitted off the delivered tip

- **R2 as the page spells it.**
  - Dialogue `["position startpos", "go depth 0"]` on step 100, with A1's four asserts and A1's bound `[3 000, 3 200]`.
  - Placed in `ABC-167 A7` directly after U7's loop, outside it (test note 3). U7 is byte-identical.
  - **The start position was kept** (test note 2). Its cost is known (25 621 nodes, as U7 read at step 100), and a smaller tree was not searched for, so as not to grow the hop.
- **Red-first.** The base file survives QP6 at 127/127. The tip file reds R2 alone under QP6 (2 600 < 3 000). The plant was reverted before the row was committed (`20e397c8`).
- **QP1d (QE-178-f) declined.** The Orchestrator's `…931fad2b` makes it optional, and it would *edit* R1's session-2 line, which A2 forbids ("no `-` line") and § Out of scope forbids ("`ABC-178`'s R1" byte-identical). Taking it needs a page change first.
- **A5's QP6-2900 and QP6-3300 cannot go red under A1 as written.** 3 300 is clipped by the level cap, so it is equivalent at the session boundary. 2 900 reads `time 3000`, inside the band A1's lower bound leaves.
  - I did **not** change the bound. The page is binding and A5 is QE's.
  - This is routed to BA/PM before QE's A5 gate. Detail: this task's A5 observation.
- **Notes are not committed on the branch.** Committing them would add `.grugops/…` to A2's `--name-only`. They sit uncommitted in `../wt-ABC-197/.grugops/context/ticket-to-pr-ABC-197/` for the Orchestrator's close, as ABC-177 and ABC-178 did.
- **No timing was taken.** A6 and A7 belong to the later quiet-host hop. The page's 0.605 s headroom is stale (now 0.990 s, `…d0c770b5`). The estimate itself is not edited.
- **Board and trace are not touched** (fence). The `In Development → In Review` move and the trace row are the Orchestrator's to apply; the row is in the done record.
