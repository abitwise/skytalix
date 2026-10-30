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

## Result
AGENTS.md +3 lines, 17,648 -> 18,176 B (budget 18,432; 256 B headroom): UCI TimeMode line after `npm run uci`; A11 lane
`ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts` before the real-engine UCI lane; one
wait-loop line under the `pgrep -f` rule. Nothing run. Note drafted under `.grugops/context/scribe-agents-md-timemode/raw/`; seal
pending (needs node):
`node .grugops/context/scribe-agents-md-timemode/raw/seal.mjs .grugops/context scribe-agents-md-timemode .grugops/context/scribe-agents-md-timemode/raw/seal-spec.json`
