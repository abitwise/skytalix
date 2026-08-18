# Queue claim — `refinement-abc032-tolerances-2026-08-18`

- task: `refinement-abc032-tolerances-2026-08-18`
- by: `ba-pm`
- at: 2026-08-18T00:30:00Z
- tickets: `ABC-032` (page repair + closed-list rulings), `ABC-033`, `ABC-034` (consequences), `ABC-106` (cut here)
- branch: `grugops/ba-abc032-rulings`, from `grugops/abc032-parse-san` @ `c29738c`

Taken by hand per `AGENTS.md` § Role / workflow files: `mkdir -p .grugops/queue/claimed` for the
parent, then a bare `mkdir` of this directory — that bare `mkdir` is the atomic act. No
`scripts/claim.js` exists on this install.

Scope: the four items QE pinned to BA/PM at the `ABC-032` gate — the defective `A4` FEN (`G8`), and
the ACCEPT/REFUSE ruling on `G5` (redundant qualifiers), `G6` (mixed castle spellings) and `G7`
(`e8=K`'s reject code). Zero files under `src/` are touched by this hop; `plans/board.md` is the
Orchestrator's and is not touched.
