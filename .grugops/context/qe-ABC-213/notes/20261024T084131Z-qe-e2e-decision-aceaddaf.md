---
id: 20261024T084131Z-qe-e2e-decision-aceaddaf
kind: decision
by: qe-e2e
at: 2026-10-24T08:41:31Z
verified_by: 
confidence: high (verdict on the readings in the two sibling observations; signs UAT under the owner delegation …5aaf7cec item 2)
refs:
  - qe-ABC-213
  - ABC-213
  - EPIC-006
  - ABC-203
  - AR-203-UNLINK
  - AR-203-LANEGAP
  - QE-203-b
  - QE-203-c
  - ADR-0047
  - ADR-0015
  - ADR-0036
  - NFR-008
  - grugops/ABC-213
  - 3dc70e20
  - e71c8901
  - 5a10b4b6
  - dfaa4cdc
  - adf6af38
  - src/pgn-file.ts
  - src/pgn.test.ts
  - ticket-to-pr-ABC-213/20261023T224721Z-software-engineer-decision-464bea64
  - ticket-to-pr-ABC-213/20261023T224721Z-software-engineer-observation-3ff2f272
  - arch-design-ABC-213/20261023T223723Z-architect-design-decision-d7ce173f
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - QE-213-a
  - QE-213-b
  - QE-213-c
  - QE-213-d
  - QE-213-e
supersedes: 
seal: sha256:76b062d688f5473d2de3049924a59eb646396376ee91bd7454b211afe871c3ff
---

# QE verdict ABC-213: PASS_WITH_GAPS at merge 3dc70e20 — A1–A7 MET, no blocking gap; 1 LOW (QE-213-a), 4 INFO; UAT waiver does not apply, this verdict signs UAT; next In Security/NFR

QE/E2E, task `qe-ABC-213`. The readings are in the two sibling observations of this task. The page's `## QE addendum` carries the same verdict.

## Verdict: PASS_WITH_GAPS
- `A1`–`A7` MET at merge `3dc70e20` (`e71c8901` + `main` `adf6af38`). Gates: lint, typecheck and build 0; `npm test` 62 files, 2044/2044, success; skips 0, `No findings.`.
- Every pre-registered plant (X1, X3, X4, X5) reds the row it names. A5 by hand: base exit 70, head exit 0 with `PGN not saved: EFBIG` and the control's exact stdout.

## Findings
- **QE-213-a — LOW.** `ADR-0047` D4's "the one path this call created is removed" is pinned only at the first candidate. Plant Q7 (unlink `games/<stem>.pgn`) passes the whole lane, and on a single fault at `-2` it would delete the owner's earlier game. Head is correct. The probe row in `raw/probe-rows.ts` pins it (0 spawns, 0 files). Not blocking. Fold it into the next ticket that touches `pgn.test.ts` or `pgn-file.ts`, or Security/NFR rules it.
- **QE-213-b — INFO.** First code on a write-then-close double fault (`ABC-203`'s `??=`) is unpinned (Q6 green lane-wide).
- **QE-213-c — INFO.** D5 rethrow of a codeless first failure is unpinned; `A3` covers only a codeless unlink (Q8 green lane-wide).
- **QE-213-d — INFO.** `src/pgn-file.ts` header lines 15–16 still say the path "is removed", with no condition; now best-effort. It rides with the owed D4 dated line, since `A6` kept the diff to the cleanup branch.
- **QE-213-e — INFO.** On a double fault the partial file stays in `games/` while the player sees `PGN not saved: <CODE>` (A5 head: 1 file). This is the ruled D4/D5 reading, recorded for UAT.

## UAT
The waiver does **not** apply: the reference measurement lists `src/pgn-file.ts`. This verdict (PASS_WITH_GAPS, no blocking gap) signs the `In UAT` exit under the 2026-10-22 delegation (`20261022T140148Z-orchestrator-decision-5aaf7cec` item 2), recorded by the Orchestrator as a `decision`.

Owner try list (optional):
- play `npm run chess` to an end and open the saved file (regression);
- `node .grugops/context/qe-ABC-203/raw/scripts/unlinkfault.mjs <checkout> <tmpdir>` shows exit 0 and `PGN not saved: EFBIG`.

## Owed (not gaps)
1. The writer child's CPU, median of 5 at base and at head (page § NFR triggers). It is byte-identical, so the growth is 0 by construction, but it has not been read. No timing ran on this hop: the host was on battery with a sibling QE hop.
2. The in-process cost of rig (b′) in `src/pgn.test.ts`, for Security/NFR under `ADR-0036` Ruling 2.
3. `qe-timing-ABC-203` reports before ABC-213 merges (page DoR row 5).
4. The `ADR-0047` D4 dated line (Architect/Design; the Orchestrator confirms it is below the owner bar).
5. `CLI_DEEP` was not run: it is not in the brief, and `src/cli.ts` is byte-identical.

## Next
`In Review → In Security/NFR` (`ADR-0036` Ruling 2; it closes `AR-203-UNLINK`: X3 is red at base, the fix is green at head). Board moves are the Orchestrator's.
