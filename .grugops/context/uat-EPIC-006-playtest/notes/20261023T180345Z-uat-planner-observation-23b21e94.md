---
id: 20261023T180345Z-uat-planner-observation-23b21e94
kind: observation
by: uat-planner
at: 2026-10-23T18:03:45Z
verified_by: 
confidence: high (guide committed; content read back)
refs:
  - EPIC-006
  - uat-EPIC-006-playtest
  - plans/uat/EPIC-006-play-test-guide.md
  - d78b0833
  - 8f619b80
  - grugops/uat-EPIC-006-playtest
supersedes: 
seal: sha256:38c780a37340f705cb93ddb92f26f93603fc846c9727b4bc2d15604b37f3e7cf
---

# UAT Planner: owner play-test guide for EPIC-006's negotiable slice (pointer)

- **Guide:** `plans/uat/EPIC-006-play-test-guide.md` on `grugops/uat-EPIC-006-playtest` @ `d78b0833` (base `main` `8f619b80`). sha256 `453eb23931e5598119e69e248f16dbc8e132e25a586a27a4326ab45c08f49edd`. 105 lines.
- **Owner's ask (2026-10-23):** "create a guide to so i can fulfill the play-testing". The epic's ask (§ Negotiable slice): build save/resume and PGN export only if play-testing shows that games get abandoned mid-way.
- **Contents:** setup; an in-game cheat sheet; the protocol; a 10-column log table; the decision rule; the hand-back.
- **Protocol:** 5 games over at least 2 sittings, at least 2 as white and 2 as black, at least one level 1–2 and at least one level 4–5. Play naturally. Optionally one other person plays 2–3 games.
- **Decision rule (a recommendation; the owner decides):**
  - **Save/resume:** at least 2 games abandoned AND "would have saved and come back" = y. An abandon out of boredom or because you were losing does not count.
  - **PGN export:** at least 2 games with "want as PGN" = y. The guide notes that a finished game already prints its full move list, so a "y" means wanting a file.
  - **Both:** both rules hit.
  - **Neither:** drop the slice, and BA/PM checks whether EPIC-006 can close.
  - **Bugs:** reported separately; they do not count.
- **Hand-back:** paste the table into the Orchestrator session, or save it as `plans/uat/EPIC-006-play-test-log.md`. The Orchestrator records it as the owner's word and routes it to BA/PM.
- **Signoff:** no signoff is captured here. The owner's filled log and decision are the acceptance input. Nothing was self-signed.
- **Kind:** this is an `observation`, not the `artifact-ref` the brief asked for. See the failed-attempt note of this hop.
