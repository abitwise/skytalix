---
subtask: scribe-agents-md-timemode
role: agents-md-scribe
ref: .grugops/context/scribe-agents-md-timemode/
branch: new grugops/scribe-agents-md-timemode from main (this brief's sha or later)
width: records only, no CPU
---
# Scribe: AGENTS.md — UCI TimeMode line; A11 deep-lane command; wait-loop rule
## Do
1. UCI notes: add the TimeMode line (ADR-0052; `setoption name TimeMode value simple-tournament`, T 22 s, min(T, C); default `level`).
2. Deep lanes: add the ABC-220 A11 lane (ENGINE_DEEP over src/uci-session.test.ts, heap 400) in the existing spelling; keep cli.test.ts A3 green (a backticked vitest span must carry the heap flag).
3. One line for agents: wait on a background job by polling its output file or `kill -0 <pid>`, never `while pgrep -f <pattern>` (self-match, never exits).
Keep AGENTS.md under its byte budget (ABC-109 A5).
## Fences
AGENTS.md + your notes only. No board edits. Never push/force/amend/rebase/merge into main. No host paths. Run no tests or
node (an SE is timing); the Orchestrator runs cli.test.ts before merging. If sealing needs node, draft + give me the command.
## Publish
Notes (task `scribe-agents-md-timemode`), commit, `## Result` here, brief + claim to done/.
