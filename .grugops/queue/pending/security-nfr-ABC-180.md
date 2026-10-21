---
subtask: security-nfr-ABC-180
role: security-nfr
ticket: plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md
ref: .grugops/context/qe-ABC-180/
branch: grugops/qe-ABC-180 @ c0a7225f (over SE acb52edf/d9c3cca3; base ccccc6bb); QE worktree ../wt-qe-ABC-180 (read only)
width: 3 (beside qe-ABC-163 and arch-ABC-163-adr)
---

# Security/NFR: AR-162-FALLBACK close, and QE-180 G-1/G-2

QE (`…f88e0845`) found AR-162-FALLBACK's written close condition met: P6f is green at base and red at head, at the labelled stderr check. But QE found a new surviving build:
- **G-1 (low):** P6g reads the cwd book only when it parses as JSON, and otherwise falls back silently. It is green at both base and head.
  - QE tried a fix in scratch: a valid-book decoy whose only reply to 1. e4 is `b7b5`, the one legal reply the delivered book lacks. It kills P6b, P6f and P6g at `:523`.
  - The cost: the fixed stderr message and the PD guard are lost.
- **G-2 (low):** nothing pins the decoy write before the child spawns.
- **G-3 (info):** an override at a different path survives.

The plant evidence is in `…91bdbc2a`.

## Decide
1. **AR-162-FALLBACK.** Close it as written. Or close it and carry P6g/G-2 as a narrower named residual, with an owner, a trigger and a close condition. Or keep it open. The Orchestrator owns AR-162-FALLBACK and follows your ruling. Promotion-trigger reading on record: `…6d15cdc3`.
2. **G-1 and G-2.** Accept each as a risk, or recommend a BA/PM cut naming the fix shape. Weigh QE's valid-book decoy against what it gives up.
3. **Security surface.** Confirm the change is test-only (`src/cli.real-engine.test.ts`) and that the decoy write raises no new temp-file concern.

## Fences
- Records only, plus the risk record wherever AR-162-FALLBACK lives (the ABC-095/ABC-162 pages, your earlier `…06c147db`).
- No `src/`, `AGENTS.md`, board or worktree edits. No timing. Never push or merge.

## Publish
- Seal notes with the plugin writer (task `security-nfr-ABC-180`).
- Write `.grugops/queue/done/security-nfr-ABC-180.md` (brief + `## Result`: verdict, rulings, trace row) and `.claim.md`, uncommitted on main.
