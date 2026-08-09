---
task: ticket-to-pr-ABC-009-dev
by: software-engineer
at: 2026-08-09T11:16:18Z
done_at: 2026-08-09T11:43:30Z
outcome: done — `ABC-009` implemented on `grugops/ticket-to-pr-ABC-009` and moved `In Development` → `In Review`, the one board move this role owns (`In Development` 1/3 → 0/3, `In Review` 0/3 → 1/3). ONE production file changed (`src/moves.ts`, +30 −8: two identity guards in `addCastlingMoves` plus a `rookFrom` field on the precomputed `CastleOption` table) and ONE test file added (`src/moves.castling.test.ts`, 33 tests); NOT ONE existing test file changed by a line — `git diff --name-only -- 'src/*.test.ts'` is empty, which is `A8`'s line-level requirement made mechanical. The fix site was NOT ruled on by the ticket, so the structural choice is recorded with the three alternatives it rejected (a `CASTLE_ROOK_MOVE` import from `apply.ts` = module cycle; per-call arithmetic; a `legalMoves`-layer filter). ALL FIFTEEN post-fix counts in `A1`–`A6` matched the delivered diff on the first run — NO discrepancy, and nothing adjusted in either direction; a third independent derivation. Red before green proved: 23 failed / 10 passed against the unfixed tree, the 10 being exactly the four legal-castle controls and the six `A7` rows, so `A7` was ABSENT rather than failing. Five mutants run against the delivered diff: four die in disjoint named sets (king → `A4`+`A5`; rook → `A3`+`A6`; occupancy → `A5`+`A6`; swapped squares → 19 assertions incl. kiwipete perft(1)), and a fifth (colour-blind) survives all twelve criteria but was PROVED behaviour-equivalent over 9,604 boards with zero divergence. GATES: lint 0 (zero autofix passes, 0 of 2 self-fix attempts spent), typecheck 0, `npm test` 337/337 on 15 files (304/304 on 14 before, measured not subtracted), build 0, skip count 0, `A9` deep lane 32/32 EXACT in 36.93 s run BEFORE review. Test-integrity checker exit 2 (`cannot read the registry file`) recorded as an ERROR and NOT a pass; no registry file created. E2E and auto-UAT oracles `UNKNOWN - verify`. `NFR-001`/`A10` MET on both clauses and it is the FIRST throughput figure any role measured on this ticket: floor 6.08M–6.15M nodes/sec, ratio aggregate 0.9987/0.9974 against ≥ 0.98 on two independent samples, three trees in one process with a byte-identical twin as null control and the structurally-zero cells read first — no per-cell claim is made, the instrument's floor being ±1%. `NFR-005` not measured (structural exclusion); `plans/nfr-catalog.md` NOT edited and no target moved. Six notes published (1 `decision`, 3 `observation`, 1 `claim`, 1 `artifact-ref`); no `finding`, nothing self-stamped, no `index.*` hand-faked. Three items go out OPEN and are reported, not closed: seven defects still not proven complete, the two places BA/PM named still unexamined, `ABC-022` half (b) still live BY DESIGN. QE and Security/NFR NOT enqueued — the Orchestrator owns that. Nothing merged and nothing deployed.
---

# Now-running registry record — `ticket-to-pr-ABC-009-dev`

Claimed **by hand**. Workflow 17's `scripts/claim.js` does not exist in this install — re-checked
at the source rather than inherited from the two Orchestrator notes or from BA/PM's record:
`ls scripts` → no such directory in the repo; `ls /Users/olgeroeselg/.grugops/agent-factory/scripts`
→ no such directory in the kit. `tools/grugops/` holds only `reference-check.js` and
`test-skip-integrity.js`, neither of which claims or schedules.

What was used instead, and why it still satisfies the workflow's actual requirement:

- `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-009-dev` — a single atomic `mkdir(2)`, the same
  primitive `claimTask`'s `mkdirSync` relies on. It returned 0, so this is the first and only
  claimant; a second writer would have received `EEXIST` and lost the claim. The claim directory's
  existence IS the claim (Workflow 17 § the claim/note seam), and that property is unchanged by the
  absence of the script.
- `pending/ticket-to-pr-ABC-009-dev.md` → `claimed/ticket-to-pr-ABC-009-dev/…` by plain `mv`
  (atomic rename within one filesystem), standing in for `claim.js transition`.
- `done` transition will be a second plain `mv`, recorded with an `outcome:` above.

The substrate is absent and **that is recorded honestly**, as every prior subtask on this board
recorded it. This record is NOT a `kind: claim` note — it is the queue's ownership record; the
shared context is written separately per Workflow 16.

**Timestamp note, recorded because the trace sorts on `at`.** `date -u` on this machine reads
`2026-08-09T11:16:18Z` (local `14:16 EEST`, UTC+3). The `at` above is true UTC. BA/PM's five notes
are also true UTC (`11:01`–`11:07Z`, file mtimes `14:02`–`14:06` local). The Orchestrator's second
note carries `at: 2026-08-09T14:15:00Z` with an `11:12Z` mtime — that is local time labelled `Z`.
Consequence, stated rather than papered over: my notes carry honest UTC stamps that sort *before*
that one note's stamp despite being written after it. I did not shift my clock to fix the ordering,
because a fabricated timestamp is worse than a visible artifact.
