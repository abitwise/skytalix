---
id: 20260804T184000Z-security-nfr-artifact-ref-a8848b5a
kind: artifact-ref
by: security-nfr
at: 2026-08-04T18:40:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-012
  - ABC-012
  - EPIC-002
  - NFR-002
  - NFR-003
  - src/history.ts
  - src/history.test.ts
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - plans/tickets/ABC-012-game-history-module.md
  - coverage/
  - grugops/ticket-to-pr-ABC-012
supersedes: 
---

# ABC-012 Security/NFR gate — what was produced, where it is, and what was NOT touched

## Branch

**`grugops/ticket-to-pr-ABC-012`**, on top of QE's `910cc51` and the Orchestrator's enqueue `73dec76`.
**No pull request exists and none was invented — this repository has no git remote** (`git remote -v`
is empty), so there is nowhere to push. `autonomy=pr` is honored the only way this substrate allows:
the work is committed on a working branch and **a human holds merge and deploy.**

## Files changed by this gate

| File | Change |
|---|---|
| `plans/board.md` | `In Security/NFR` 1/2 → 0/2 (card removed, EXITED comment with the full gate record), `Ready for UAT` 0/4 → 1/4 (card added, ENTERED comment), header `_Updated:` line |
| `plans/tickets/ABC-012-game-history-module.md` | front matter `in-security-nfr` → `ready-for-uat`, `column` updated, an appended Security/NFR gate record. **No acceptance criterion, `## Out of scope` line, NFR bar or test note edited** |
| `plans/traceability.md` | the `ABC-012` row updated **in place** — exactly the `NFRs`, `UAT` and `Status` cells; **the diff is one row**, verified. No row appended, no other row touched |
| `plans/nfr-catalog.md` | `NFR-003`'s row and `NFR-002`'s boundary-condition block gain `ABC-012`'s real-code measurements; header `_Updated:` line. **NO TARGET MOVED** |
| `.grugops/context/ticket-to-pr-ABC-012/notes/` | five notes: this one, a `decision`, two `observation`s and a `claim` |
| `.grugops/queue/…/ticket-to-pr-ABC-012-sec*` | moved `pending` → `claimed` → `done` **by hand**, with a `claim.md` registry record |

## Files deliberately NOT changed

- **`src/history.ts` and `src/history.test.ts`** — **not one byte.** This gate names required fixes
  rather than making them, and both defects it found need **guards**, which are production logic this
  column does not write. `src/history.ts` is md5 `12f8c562d46286e68383f8e2cab407fa`, **identical to
  the Engineer's `feat` commit `47cad31`** — which is also this gate's independent confirmation that
  QE changed no production code.
- **Every other file under `src/`** — `git diff --numstat 39e260d -- src/` shows exactly the two new
  files and nothing else.
- **`package.json` and `package-lock.json`** — byte-identical to merged `main` `39e260d`. No
  dependency was added, removed or changed; there are **no runtime dependencies at all**.
- **`coverage/`** — 22 tracked files, **byte-identical** after this gate's coverage run, which used
  QE's verified `--coverage.reportsDirectory` mitigation.
- **`NFR-001`, `NFR-004`, `NFR-005`, `NFR-006`, `NFR-007`** — byte-identical rows.
- **The ticket's acceptance prose**, including criterion 2, whose wording remains BA/PM's.
- **`.grugops/test-skips.md`** — **not created.** An agent may not self-author a justification to
  clear its own gate.
- **The kit root** (`/Users/olgeroeselg/.grugops/agent-factory`) — read only, never written.

## Commands run, and what they returned

| Command | Result |
|---|---|
| `npm test` | **226 passed / 10 files / 0 failed** |
| `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** (total 226, passed 226, failed 0) |
| `npm run lint` | **exit 0** (the same 2 pre-existing biome config-schema infos) |
| `npm run typecheck` | **exit 0** |
| `npm run build` | **exit 0** |
| `npx vitest run --coverage --coverage.include='src/history.ts' --coverage.reportsDirectory=<outside repo>` | **100 / 100 / 100 / 100**, and `coverage/` **untouched** |
| `git status --porcelain -uall coverage` | **empty** after the coverage run |
| `git diff --numstat 3a44b3f -- coverage` | **empty** — byte-identical |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **exit 2** — "cannot read the registry file"; recorded as an **error**, never as a pass |
| `git diff --numstat 47cad31 HEAD -- src/history.ts` | **empty** — QE changed no production code |
| `git diff --numstat 39e260d -- package.json package-lock.json` | **empty** |
| `git remote -v` | **empty** — no remote, so no PR |

## Out-of-repo harnesses (not artifacts of this repository)

Three, all run from the session scratchpad, **read-only against `src/`**, writing nothing into the
repository:

- **the NFR benchmark** — 12 cells including two fence cells and two `legalMoves` controls, 11 rounds
  with rotated cell order, two independent processes;
- **the security probe** — 12 hostile FEN payloads, the 15-case ply-argument table, the
  foreign-move corruption case, and the growth check;
- **the borrow probe** — the held-reference-across-`takeBack` check.

**None is committed and none is a repository artifact.** Their results are in the two observation
notes with their protocol, their machine and their controls. **The one instrument that produced a
false MISS is recorded in those notes with its number and its diagnosis, rather than deleted.**

## Remaining work, by owner

- **The Orchestrator** — owns the `Ready for UAT → …` routing. `ABC-012` is gated three times and
  waits on a human merge; there is no PR to open.
- **BA/PM** — owns criterion 2's wording (upheld unsatisfiable by two gates, re-wordable in either
  direction); the ruling on whether `takeBack` should guard a non-integer `plies`; whether to cut a
  ticket for the `src/fen.ts` out-of-range counter or fold it into `ABC-009` / `ABC-010`; and **a
  ticket for the untracked `coverage/` hygiene item, which three roles have now flagged and nobody
  owns.**
- **Architect/Design** — owns whether SEAM 1's declined `playMove` guard survives contact with a real
  parser, now that its consequence is measured as a confident wrong verdict rather than a corrupt
  board.
- **`ABC-019`** — the turn loop. First consumer of both defects and of the contradictory borrow
  guidance at `src/history.ts:42`. **This gate has recorded that `takeBack(NaN)` becomes a
  HIGH-severity ASVS L1 V2.2.1 failure at that ticket and will block there.**
- **Security/NFR at `EPIC-004`** — the non-M3 measurement that discharges accepted risk 5, on the
  spike that already exists for `NFR-005`.
