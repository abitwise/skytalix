---
subtask: qe-ABC-177
role: qe-e2e
ticket: ABC-177
branch: grugops/ABC-177 @ f81bf03c (from ff1e375f); worktree ../wt-ABC-177 (read-only for you)
ref: .grugops/context/qe-ABC-177/
---

# QE pass on ABC-177 (lean): default lane under 10 s per ADR-0046

## Read first
- The ticket page (A1–A12).
- ADR-0046.
- BA/PM's step ruling `…e7b3c210`.
- The SE's done file `.grugops/queue/done/ticket-to-pr-ABC-177.md`, with its notes and `probe/` (frozen mutant list, kill sets, census).
- The owner's AC-power rule `…bfdc97e5`.

## Check
1. **A1–A5, A7, A12:** re-confirm independently. Attack them, for example:
   - an A6 fold mutant that writes on `go infinite`, and a second release that writes;
   - a step-only diff;
   - the 126 test names at base and tip.
2. **A6 parity:** re-run the kill sets at base and tip for every changed row. Use the SE's frozen union list; it is frozen before head, so do not add to it after the fact. Grade the SE's choice of the union list where "M01–M11" was ambiguous.
3. **Open points, grade only (do not fix):**
   - **U8 at step 100.** The ticket allows {10, 100} for U8. The ban on cutting a search from ≥ 2 clock checks to 1 is BA/PM's condition on **step 1000** only, so 100 is in-ticket. Grade whether the U8 row still pins what ABC-171 needs.
   - **U1–U7 at step 1000.** Searches now stop at 655 nodes, on clock reads at iteration starts only, and never reach a mid-search clock check. Is any time-limit behaviour now left unpinned on the default lane? Name it as a gap if so.
4. **A8–A11, timing (yours):**
   - N8-LANE on the one-file set, ≤ 650 ms CPU.
   - Full-lane base-vs-head twin: four arms, each with its own `npm ci`.
   - NFR-008 ≤ 10 s; the target ≤ 9.2 s.
   - **AC power is required** for every reading (owner rule). Also required: a foreground-verified quiet window of 180 s with no foreign vitest, no `oeselg-labs/platform` process, and no other hop; load1 ≤ 8.
   - Record power, load1 and process count per run.
   - If no admissible window opens, mark it OWED. Never estimate.
   - Apply the page's escalation: over 9.2 s → O3 note for Architect/BA/PM; over 10 s → owner.
5. **Waiver:** production lines are expected empty, so UAT is waived. Confirm it.

## Fences
- Work in a scratch detached worktree `../wt-qe-ABC-177`, plus twin trees. Remove them all at the end.
- Do not touch `src/` on any branch, `../wt-ABC-177`, `plans/board.md`, `plans/traceability.md`, or any process you did not start.
- Keep forks low. Do not fix anything. Never push, merge or self-sign.

## Publish
- Notes under `ref:`, including a `kind: decision` by `qe-e2e`. Use the sanctioned writer if available.
- `.grugops/queue/done/qe-ABC-177.md` (this brief + `## Result`) and `.claim.md`, uncommitted. Include:
  - the verdict and per-criterion grades;
  - parity, the readings or OWED, and the NFR-008 result;
  - whether R-174-1 is discharged (≤ 10 s, admissible);
  - the gaps `QE-177-*`, the waiver, and a trace row.

## Result (qe-e2e, 2026-10-20): **PASS_WITH_GAPS on A1–A7 and A12; A8–A11 OWED** (no AC power during the hop). `NFR-008` NOT READ; `R-174-1` NOT discharged

**Notes** (`.grugops/context/qe-ABC-177/notes/`) are hand-authored and unsealed: `scripts/context-io.js` is absent from
the repo and the kit, and no `propose_note` tool was available.
- `…4c92197e`: A1–A5, A7, A12;
- `…e1dfd431`: A6 parity and the list grade;
- `…02deb2e2`: the open points and the gap probes;
- `…a4611b8d`: timing OWED;
- `…155330b9`: artifacts;
- **`…ec9517a5`: the decision (verdict).**

`qe-hop-integrity.js --ticket ABC-177` reports: covered.

What I did not do: commit, push, merge, fix or self-sign anything. I did not touch `src/` on any branch,
`../wt-ABC-177` (clean at `f81bf03c`), `plans/board.md`, `plans/traceability.md`, or any process I did not start.
`../wt-qe-ABC-177` and every scratch archive tree were removed. User processes peaked at 422, against `ulimit -u`
2666.

### Per criterion
| crit | grade |
|---|---|
| A1 | **MET.** One `talk` on `[position, go infinite, R, R]` at step 1 000, asserting (a), (b) and (c). Frozen H1/H2 (a `bestmove` on `go infinite`; a second release writing) are in both U1 rows' kill sets at the tip. The fold is lossless within a session. Its one loss is cross-session: `QE-177-a` |
| A2 | **MET.** U1–U7 100 → 1 000, U8 10 → 100; parity at each |
| A3 | **MET.** `npm test` at base and tip: 59 files, 1 987/1 987, `success` true, 0 pending/todo. `uci-session` 126/126 at each. Sorted names byte-identical (sha256 `55785e96…` at both) |
| A4 | **MET.** 7 non-U1 hunks are a step literal only (294, 325, 333, 349, 409, 506, 831). No `it(`/`describe(` line touched; no `expect(` outside U1 |
| A5 | **MET.** `--name-only` gives `src/uci-session.test.ts` only. Every hunk is inside U1–U8's base ranges |
| A6 | **MET.** See the parity section below |
| A7 | **MET.** Census re-run exactly: 536 406 → 43 438 (**−492 968**). All 15 rows fewer; 111 unchanged |
| A8 | **OWED.** No AC power |
| A9 | **OWED.** No AC power |
| A10 | **OWED.** `NFR-008` not read |
| A11 | **OWED.** No reading, so neither escalation route (> 9.2 s → O3; > 10 s → owner) fires |
| A12 | **MET.** lint, typecheck and build 0; `npm test` 1 987/1 987; skip capture 0; skip-integrity "No findings."; `CLI_DEEP` 11/11; `PERFT_DEEP` 32/32. The M4 sweep is green and reds under a release-path plant (`write("released")`) |

### Parity (A6)
- **How it ran:** the SE's harness and frozen list, re-run at a base archive and a **full** tip archive. 145 mutants and
  a control, 15 rows each run, no suite errors.
- **Result: 15/15 rows SAME, and per-unit parity is true for U1–U8.** `kill-qb.jsonl` and `kill-qh.jsonl` are
  byte-identical (`c4534664…`). They also match the SE's raw files, with 0 ids differing.
- **The freeze is proven by re-derivation, not by mtimes.**
  - `freeze.mjs` was run against base only and gave a byte-identical list (`b9033970…`).
  - Its inputs are the three prior-QE mutant sources, committed 2026-10-18/19, plus the base source. It has no head
    input.
- **The SE's union reading of "M01–M11" is CORRECT and conservative.** 174-M09/M10/M11/M17 sit in the U2, U6 and U7
  kill sets, so the ABC-174 reading mattered.

### Open points (graded, not fixed)
- **U8 at step 100: in-ticket ({10, 100}), and it still pins ABC-171 A7 as written.**
  - The same moves are written (b1c3, b1c3, e2a6), over both paths, and the kill set is unchanged.
  - The level-1 engine searches are now depth 1 (29 and 602 nodes). At step 10 they reached depths 4 and 2. That is
    `QE-177-c`, INFO; the remedy is one literal, and the call is BA/PM's.
- **U1–U7 at step 1 000: one time-limit behaviour is left unpinned on the default lane.**
  - **QP6:** a dropped `depth`/`nodes`/`mate` token on a `go` with no time token sets G to 2 500. All 6 U7 rows kill it
    at base; at the tip it survives the whole lane (1 987/1 987). The blind band grew from about 100 ms to about
    1 000 ms. That is `QE-177-b`, LOW.
  - The mid-iteration abort (QP2) and the loop-top deadline (QP3) are killed by no U1–U7 row **at base either**, and
    the lane still kills both. QP2 reds 19 rows; QP3 hangs the lane at the 60 s bound.
  - The hold path's own abort stays pinned by A6-d1 (class P, unchanged).

### Timing: A8–A11 **OWED**; `NFR-008` result **NOT READ**
- **Power:** `pmset` read 'Battery Power' at 19:00:59Z (98 %) and on **51/51** samples from 19:21:22 to 19:46:22Z
  (`probe/powerlog.tsv`), ending at 86 %.
- **Foreign processes:** another session's `oeselg-labs/platform` scaffolder vitest suite was present in every sample.
- **load1** ranged 2.01–8.59.
- **The pre-registered AC gate (P1) blocks any arm.** So no window was attempted, no twin tree or `npm ci` was built,
  and no run was taken.
- **Nothing was estimated.** The census and the ADR's 8.6–9.3 s are not readings.
- **`R-174-1` is NOT discharged.** The last admissible state is `QE-174-b`'s NOT MET, 10.010 s.
- The instruments, the pre-registration and `powercheck.py` are ready in `.grugops/context/qe-ABC-177/probe/` for the
  timing hop.

### Gaps
| gap | severity | what | route |
|---|---|---|---|
| `QE-177-g` | **MEDIUM** | A8–A11 OWED: battery throughout, plus a foreign platform suite | Orchestrator: re-dispatch the timing half on AC. Then Security/NFR rules `NFR-008` / `R-174-1` |
| `QE-177-b` | LOW | U7 at step 1 000: a G cut on the dropped-limit path survives the default lane (QP6) | BA/PM: accept, or a new test-only ticket. ABC-177 is not widened |
| `QE-177-a` | LOW | The fold drops U1's cross-session comparison: module-scope `held` (QP1) survives the default lane | BA/PM: accept, or a new test-only row (about 655 nodes) |
| `QE-177-c` | INFO | U8 at step 100: the level-1 engine searches are depth 1 | BA/PM's reading; the remedy is one literal |
| `QE-177-d` | INFO | QP4b leaves U1 and QP5 leaves U7, but 24 and 16 lane rows still kill them | none |
| `QE-177-e` | INFO | 5 inert frozen entries, including the SE's 171-S42b successor. No changed row is affected | none |
| `QE-177-f` | INFO | A self-symlink `node_modules/node_modules` in main's tree (2026-10-17) | workspace owner |

### Waiver
- `git diff --name-only f81bf03c~1 f81bf03c | grep -v '\.test\.ts$' | grep '^src/'` is **empty**, and the base...tip
  form is empty too.
- **So the standing UAT waiver applies (confirmed).** A waiver is not a signature.

### Next column
- **Stay in `In Review`** until the timing hop reads A8–A11 on AC.
- Then `In Security/NFR`, for the `NFR-008` state and `R-174-1`.
- Then `Ready for UAT` → `Done` under the waiver.
- The Orchestrator decides.

### Trace row (for the Orchestrator to append; QE did not edit `plans/traceability.md`)
`| ABC-177 (A1–A12) | ADR-0046; BA/PM …e7b3c210; owner …bfdc97e5 (AC only) | grugops/ABC-177 @ f81bf03c (from ff1e375f) | src/uci-session.test.ts | QE qe-ABC-177: A1–A5, A7, A12 MET (1987/1987 both; 126 names identical; step-literal-only diff; census −492 968 reproduced; lint/typecheck/build, skips 0, CLI_DEEP 11, PERFT 32; M4 sweep reds on plant); A6 MET 15/15 rows SAME over the frozen 145 (list re-derived byte-identical b9033970); A8–A11 OWED (battery 51/51 samples, no AC; NFR-008 not read; R-174-1 not discharged); 0 production lines (UAT waived) | PASS_WITH_GAPS on A1–A7/A12, timing OWED: QE-177-g MEDIUM → timing hop on AC; QE-177-a/-b LOW → BA/PM; -c..-f INFO | notes …4c92197e, …e1dfd431, …02deb2e2, …a4611b8d, …155330b9, …ec9517a5 |`
