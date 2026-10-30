---
subtask: se-ABC-241
role: software-engineer
ticket: ABC-241
ref: .grugops/context/se-ABC-241/
branch: new grugops/ABC-241 from main e42b637b (worktree .claude/worktrees/se-ABC-241)
width: shared (no timed reads at this stage; do not run games or ENGINE_DEEP timing)
---
# SE ABC-241: repetition ignores an uncapturable ep square (ADR-0020 § AMENDMENT 2026-10-30)
## Read
The ticket (all FOLDED blocks; note line ~123: ABC-228 merged with (ii), level 5 = 4 000 ms), ADR-0020 § AMENDMENT
2026-10-30 C1–C4, ADR-0054, ADR-0044 D2 list, how se-ABC-230 built (task `se-ABC-230` notes).
## Do
Build to A1–A9 (test-first encouraged). Gates via `npm run …` (lint, typecheck, unit, build); npm test count.
A10 (smokes) is QE's, ALONE — do not play games. Another session (records only) runs beside you.
## Fences
Only the files the ticket/ADR name. Never push, force, amend, rebase, merge into main. No board edits. Never bare
`npx`/`npm exec`. No host paths in commits. Scratch in scratchpad `se-241/`.
## Publish
Sealed notes (task `se-ABC-241`, `at` from `date -u`), commit on the branch, `## Result` + 10-cell trace row here,
brief + claim to done/ (tracked copy on your branch if the guard refuses).
