---
subtask: se-ABC-220
role: software-engineer
ticket: ABC-220
ref: .grugops/context/se-ABC-220/
branch: new grugops/ABC-220 from main 8e1cdda5 (worktree .claude/worktrees/se-ABC-220)
width: shared — NO timed reads (another SE runs beside you)
---
# SE ABC-220: simple-tournament over UCI (TimeMode), T 22 s, min(T, C), 22 s ceiling (ADR-0052 ACCEPTED)
## Read
The ticket (all FOLDED blocks, A1–A14, § NFR triggers, § Test notes), ADR-0052 (ACCEPTED, D1–D7), ADR-0044, ADR-0027,
src/uci-session.test.ts's virtual-clock pattern, how se-ABC-230 built.
## Do
- Build A1–A10, A12's structure (0 new real-clock rows in the default lane) and A13 on the virtual clock.
- Write the A11 (ENGINE_DEEP) and A14 (opt-in real child) rows but **do not run them**, and do not time A12's
  wall: they need the host ALONE and QE runs them. Say in your notes that they are unrun.
- Owed at merge, your part: D5's latency sentence in src/uci-session.ts's header (Test notes 4).
- Gates via `npm run …` (lint, typecheck, unit, build); npm test count.
- se-ABC-241 builds in parallel and may also touch src/uci-session.ts; whoever merges second rebases. Do not coordinate
  by editing its branch.
## Fences
Only the files the ticket/ADR name. Never push, force, amend, rebase, merge into main. No board edits. Never bare
`npx`/`npm exec`. No host paths in commits. Scratch in scratchpad `se-220/`.
## Publish
Sealed notes (task `se-ABC-220`, `at` from `date -u`), commit on the branch, `## Result` + 10-cell trace row here,
brief + claim to done/ (tracked copy on your branch if the guard refuses).
