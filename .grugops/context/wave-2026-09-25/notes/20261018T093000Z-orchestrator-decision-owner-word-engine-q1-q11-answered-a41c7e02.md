---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-18T09:30:00Z
sealed: false
refs: [EPIC-004, EPIC-007, ADR-0044]
---

# Owner word, 2026-10-18: answers to the engine questions Q1-Q11

The owner's reply, verbatim:

*"Q1, Q2, Q3: recommended answer ; Q4 - On in v1 ; Q5 - strength control also implemented ; Q6: don't ignore, implement if it has
not been implemented in our engine or expose/use otherwise ; Q7 web UI can have it's own backend Websocket/API that uses the engine
from CLI. Web router itself doesn't have to be part of the engine, but it should be possible to build for engine usage ; Q8: GNU GPL v3
; Q9: No, I will select new name "skytalix" - The name originates from the ancient Spartan skytale—the earliest known transposition
cipher used by generals to transmit tactical commands. It's a direct metaphor for chess engine architecture: Transposition Tables (TT),
move permutations, and decoding opening book lines into tactical execution. The -ix suffix follows Unix systems traditions, reflecting a
deterministic, compiled UCI CLI binary. ; Q10: I can install it ; Q11: Yes"*

How the Orchestrator reads it:

| Q | Answer | Reading |
|---|---|---|
| Q1 | Recommended | The UCI half of EPIC-004's "permanent non-goal" is lifted. |
| Q2 | Recommended | The first user is a human playing in the owner's UI. |
| Q3 | Recommended | Keep `HARD_CEILING_MS` (5 s). |
| Q4 | **Book on in v1** | Changes the recommendation. |
| Q5 | **Strength control in v1** | Changes the recommendation. Reuse the existing `src/levels.ts` (1-5) as a UCI option. |
| Q6 | **Honour `go depth` / `nodes`** | Changes the recommendation. Implement them, or expose or use whatever the engine already has. |
| Q7 | **Separate backend spawns the CLI** | The web UI's own WebSocket/API backend runs the engine CLI. The router is not in this repo, but this repo must be buildable into an engine artifact that backend can run. This replaces ADR-0044 D8 route (b). |
| Q8 | **GPL-3.0** | `GPL-3.0-or-later` vs `-only` is not stated, so it defaults to the FSF-recommended `GPL-3.0-or-later`; the owner may correct it. ABC-169 enters v1. |
| Q9 | **Name `skytalix`** | `id name skytalix`, author unchanged (`Olger Oeselg`). The UCI identity and the built artifact use it. Renaming the repo, the `cli-chess` package and the terminal game is NOT read into this answer; it is an open item for the owner. |
| Q10 | Owner installs | cutechess-cli and En Croissant. |
| Q11 | Yes | v1 is done without the web UI. |

- Route: the Architect revises ADR-0044 against Q4-Q9, then BA/PM revises EPIC-007 and the ticket plan, each citing the other's notes.
- The ADR and the epic stay PROPOSED until the owner reviews the revision. No ticket enters Ready, and no code is written.
