---
subtask: security-nfr-ABC-177
role: security-nfr
ticket: ABC-177
branch: grugops/ABC-177 @ f81bf03c (base ff1e375f)
ref: .grugops/context/qe-ABC-177/
width: 2 (beside arch-O3-ABC-177; neither runs timing)
---

# Security/NFR review of ABC-177: NFR-008 line, R-174-1 ruling, catalog fold-ins

## Read first
- The ticket `plans/tickets/ABC-177-*.md` and ADR-0046.
- `.grugops/queue/done/qe-ABC-177{,-timing,-timing-2,-timing-3}.md`.
- QE notes `…bc49c2fe`, `…84059cad`, `…e808274d`, plus the owner words:
  - `…bfdc97e5` (AC only);
  - `…b87c35b6` and `…f8cd47ba` (foreign runs logged);
  - `…31ab7d2d` (thermal kept, **ABC-177 only, no precedent**).
- The `plans/nfr-catalog.md` NFR-008 row, and R-174-1.

## Do
1. **NFR-008 verdict on `f81bf03c`.** QE reads MET at 9.395 s, flagged warm host 5/8, foreign runs logged, under the ABC-177-only thermal rule; the strict view is VOID. Rule MET or NOT MET and record exactly which flags go on the catalog line.
2. **R-174-1: discharge or not.** Rule on it and give the reason.
3. **Catalog fold-in, owed since 2026-10-20.** Add the AC-power rule (`…bfdc97e5`) to the NFR-008 row. Record the ABC-177-only thermal exception as an exception, not a rule change.
4. **Security surface.** The change is test-only (`src/uci-session.test.ts`); confirm that nothing else is touched.
5. **QE gaps:** the B/T twin at 1.54 % against the 1.5 % bar (ADR-0035 d1), and the `sampler174.mjs` crash on an unparsed `ps` line. Accept each as a risk, require a fix, or cut it to BA/PM.

## Fences
- Do not edit `plans/nfr-catalog.md` beyond the NFR-008 row and its risk block.
- Do not edit `src/` or the worktree.
- Run no timing. Never push or merge.

## Publish
- Sealed notes via the sanctioned writer (task `security-nfr-ABC-177`).
- Write `.grugops/queue/done/security-nfr-ABC-177.md` (brief + `## Result`) and `.claim.md`, uncommitted. The result gives the verdict (PASS / PASS_WITH_RISKS / FAIL), the required fixes, the accepted risks, and a trace row.

## Result (security-nfr, 2026-10-21 07:24Z): **PASS_WITH_RISKS.** `NFR-008` **MET** at 9.395 s (four flags); `R-174-1` **DISCHARGED**, effective at merge

**Notes**, sealed by the sanctioned writer (`context-io.js` `admitAndAppend`, grugops 2.1.0 plugin cache, task
`security-nfr-ABC-177`). All four read back through `readContext`:
- `20261021T072314Z-security-nfr-decision-b4d5793f`: the verdict and rulings;
- `20261021T072212Z-security-nfr-observation-4bb78960`: the evidence;
- `20261021T072219Z-security-nfr-observation-84c196c9`: the accepted risks, the required fix and the gap dispositions;
- `20261021T072219Z-security-nfr-observation-34fec102`: `SEC-177-1`, out of scope and routed.

### 1. `NFR-008` on `f81bf03c`: **MET, 9.395 s**
- Ruled under `ADR-0035` D1 + A1: H/H2 twin admissible (CPU +0.340 s ≤ 0.404 s, p 0.289), wall R 0.250 s, every H
  run ≤ 9.55 s, load1 3.75–7.28, AC on every run, capped stack.
- **Flags on the catalog line:**
  1. warm host (thermal ≥ 1 in 5/8 rounds), under the ABC-177-only exception `…31ab7d2d`;
  2. foreign window logged (20 of 181 polls; 0 of 36 lane runs);
  3. strict registered readout VOID;
  4. graded after a post-run owner rule change, and the re-read was not blind.
- It is not a thermal-0 reading and is not comparable with `QE-174-b`.

### 2. `R-174-1`: **DISCHARGED**, effective when `f81bf03c` lands on `main` with the lane's inputs unchanged
- **Reason.** The written condition, "first admissible full-lane reading ≤ 10 s on the declared capped stack", is met
  under the catalog's own admissibility rule, which has no thermal clause.
- **No H run exceeded 10 s.** So the thermal handling decided only whether a reading existed, never which way it fell.
- `main` `0374bb18` differs from the arms' base `ff1e375f` only under `.grugops/` and `plans/`.
- **If a lane input lands first, the discharge does not carry.**
- Until the merge, `main` carries `R-174-1`.

### 3. Catalog fold-in (`plans/nfr-catalog.md`, uncommitted; 30 insertions, the 1 deletion is the edited row line)
- **`NFR-008` `Target` cell:** one dated insertion that loses no byte. It adds:
  - the owner's AC-power rule (`…bfdc97e5`);
  - the latest verdict with its flags;
  - the ABC-177-only thermal **exception**, recorded as an exception and not a rule change.
- **`R-174-1` block:** one dated discharge blockquote.
- Removing the two insertions gives back `HEAD`'s file byte for byte.
- `NFR-001`–`007`, `009` and `010` are hashed byte-identical before and after.
- **Not added, because of the fence:** a top `_Updated:` line. The Orchestrator may add it at close.

### 4. Security surface
- `git diff --name-only ff1e375f f81bf03c` = `src/uci-session.test.ts` only (+16 / −14): step literals and the U1 fold.
- No production byte. No ASVS L1 requirement in reach. The UAT-waiver probe is empty.

### 5. QE gaps
- **B/T twin 1.54 % > 1.5 %: ACCEPTED as `R-177-2`.**
- **`sampler174.mjs` crash: REQUIRED FIX `FIX-177-1`.**

### Required fixes
- **`FIX-177-1`** (LOW, owner QE/E2E). `sampler174.mjs:15` dereferences an unguarded `match`. The fix:
  - skip the unmatched line, and log it with its time;
  - count unparsed lines per sample;
  - never throw from the interval;
  - re-register the fixed copy by sha256.

  Due before the next full-lane `NFR-008` reading that uses it. **It does not block `ABC-177`.**

### Accepted risks
- **`R-177-1`** (LOW). The discharging MET was read warm, under an ABC-177-only exception, and no thermal-0 reading
  exists. **Owner: Olger Oeselg, on `…31ab7d2d`.** It closes at the next Security/NFR gate that reads the full lane
  under its own pre-registration.
- **`R-177-2`** (LOW). The B/T identity twin is inadmissible by 0.011 s, so the H−B saving (−1.620 s wall / −3.605 s
  CPU) has no state, and the B/T R does not move `F`. **Owner: Architect/Design.**

### Open, routed (not part of this verdict)
- **`SEC-177-1`.** QE's `window.mjs` and `sampler174.mjs` commit other projects' command lines into this repository's
  git history: a private repository's paths, a Keycloak admin login, and an S3 SigV4 `curl` naming credential
  variables.
  - No literal secret value was found by pattern scan. A full scan is `UNKNOWN - verify`.
  - There is no remote today.
  - V16.2.5 is L2, outside the L1 dial, so it does not gate.
  - **Decision owner: Olger Oeselg**, on whether the captures stay in history before any push. Forward instrument change: QE/E2E.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-177 (Security/NFR) | NFR-008 R-1 MET 9.395 s on f81bf03c (t3-r1; flags: warm host thermal ≥ 1 in 5/8 rounds under ABC-177-only exception …31ab7d2d, foreign window logged, strict view VOID, post-run regrade not blind); R-174-1 DISCHARGED effective at merge if lane inputs unchanged; AC-power rule (…bfdc97e5) and the thermal exception folded into the NFR-008 row; security-nfr-ABC-177 …b4d5793f | ADR-0035 / ADR-0046 | grugops/ABC-177 @ f81bf03c (from ff1e375f) | src/uci-session.test.ts (test-only) | QE …bc49c2fe / …e808274d (read, not re-timed) | PASS_WITH_RISKS — R-177-1 LOW (Olger Oeselg), R-177-2 LOW (Architect/Design); FIX-177-1 LOW (QE/E2E, before next full-lane reading); SEC-177-1 routed to owner |

### Next
- **Recommended:** `In Security/NFR` → `Ready for UAT`. The UAT waiver applies, with zero production lines. The Orchestrator decides.
- A11 / O3 runs in parallel under `arch-O3-ABC-177`.

### Fences kept
- No `src/` or worktree byte changed.
- No catalog byte outside the `NFR-008` row and the `R-174-1` block.
- No timing, no vitest, no window and no arm.
- Nothing committed, pushed or merged.
- `plans/board.md` and `plans/traceability.md` were not edited.
