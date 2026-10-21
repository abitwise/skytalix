---
id: 20261021T072314Z-security-nfr-decision-b4d5793f
kind: decision
by: security-nfr
at: 2026-10-21T07:23:14Z
verified_by: 
confidence: high (rulings on QE's printed figures and the catalog's own rule; nothing re-timed)
refs:
  - ABC-177
  - NFR-008
  - R-174-1
  - R-177-1
  - R-177-2
  - FIX-177-1
  - SEC-177-1
  - ADR-0035
  - ADR-0046
  - 20261021T072212Z-security-nfr-observation-4bb78960
  - 20261021T072219Z-security-nfr-observation-84c196c9
  - 20261021T072219Z-security-nfr-observation-34fec102
  - 20261021T071304Z-qe-e2e-observation-bc49c2fe
  - 20261021T071306Z-qe-e2e-decision-e808274d
  - 20261021T065500Z-orchestrator-decision-31ab7d2d
  - 20261020T150000Z-orchestrator-decision-bfdc97e5
  - plans/nfr-catalog.md
  - f81bf03c
supersedes: 
seal: sha256:dc7cdcfff46c1dfc82f358aa4f299b86a9157f672d535c83c8056025d7f79ff6
---

# Security/NFR on `ABC-177` at `f81bf03c`: **PASS_WITH_RISKS.** `NFR-008` **MET** at 9.395 s (four flags). `R-174-1` **DISCHARGED**, effective at merge

This is a `decision`, not a `finding`: no stamp exists. Evidence: `…4bb78960`. Risks and the fix: `…84c196c9`.
Out-of-scope security observation: `…34fec102`. Nothing was run or timed at this hop.

## 1. `NFR-008` on `f81bf03c`: **MET, 9.395 s median wall**
- **Rule.** `ADR-0035` D1 + A1. Admissible H/H2 twin: CPU median +0.340 s ≤ 0.404 s, sign p 0.289. R 0.250 s ≤ 10 s.
  Median ≤ 10 s.
- **Conditions.** load1 3.75–7.28. AC on every run. Capped stack, Node v26.11.1 / vitest 4.1.11.
- **Flags on the catalog line, exactly:**
  1. **warm host (thermal ≥ 1 in 5/8 rounds)**, kept only under the ABC-177-only exception `…31ab7d2d`;
  2. **foreign window logged**: 20 of 181 window polls (another repository's single-file vitest); 0 foreign vitest on
     36/36 lane runs (`…b87c35b6`, `…f8cd47ba`);
  3. **strict registered readout VOID** (thermal only);
  4. **graded after a post-run owner rule change; the re-read was not blind** (QE disclosed it).
- It is not a thermal-0 reading and is not comparable with `QE-174-b`. It supersedes `QE-174-b`'s NOT MET as the latest reading.

## 2. `R-174-1`: **DISCHARGED, effective when `f81bf03c` lands on `main` with the lane's inputs unchanged**
- **The condition, as written, is met:** "the first admissible full-lane reading ≤ 10 s on the declared capped stack".
- **"Admissible" is the catalog's rule** (`ADR-0035` D1 + A1). That rule has no thermal clause.
  - The thermal discard that VOIDs the strict view is QE's instrument rule. The owner lifted it for `ABC-177` alone.
  - **No H run was over 10 s** (max 9.55 s). So the thermal handling decided only whether a reading exists. It could not
    turn NOT MET into MET.
  - The warm rounds did not read faster than the thermal-0 ones.
- **When it takes effect:**
  - At `main` `0374bb18`, `main` differs from the arms' base `ff1e375f` only under `.grugops/` and `plans/`.
  - If a lane input (`src`, `tools`, `package.json`, `package-lock.json`, `vitest.config.ts`, `tsconfig.json`) lands
    before the merge, the discharge does not carry.
  - **Until the merge, `main` still carries `R-174-1`.**
- **Residual:** `R-177-1` (LOW, owner Olger Oeselg).

## 3. Catalog fold-ins (`plans/nfr-catalog.md`, this hop, uncommitted)
- **`NFR-008` row, `Target` cell:** one dated insertion after the 2026-10-20 note. It loses no byte; the old file is
  recovered exactly by removing it.
  - It adds the owner's **AC-power rule** (`…bfdc97e5`), owed since 2026-10-20.
  - It adds the latest verdict with its four flags.
  - It records the **ABC-177-only thermal exception, as an exception and not a rule change**.
- **`R-174-1` block:** one dated blockquote after the risk's text, with the discharge, its effective condition and its residuals.
- **Byte-identical:** `NFR-001`–`NFR-007`, `NFR-009` and `NFR-010`, each hashed before and after.
- **Not done, because of the fence:** no `_Updated:` line at the top of the file and no new section. The Orchestrator
  may add the header line at close.

## 4. Security surface
- The diff is `src/uci-session.test.ts` only (+16 / −14): step literals and the U1 fold.
- It has no production byte, no import, no I/O and no secret. No ASVS L1 requirement is in reach.
- The UAT-waiver probe prints nothing.
- **Nothing else is touched.**

## 5. QE gaps
- **B/T twin at 1.54 % against the 1.5 % limit: ACCEPTED as `R-177-2`** (LOW, owner Architect/Design).
  - The twin is inadmissible by 0.011 s, so the H−B saving has no state, and the B/T R does not move `F`.
  - `NFR-008` is unaffected.
- **`sampler174.mjs` crash: REQUIRED FIX `FIX-177-1`** (LOW, owner QE/E2E). Guard the parse and log the unmatched line
  before the next full-lane reading that uses the sampler.
  - It is not due for `ABC-177`.
  - It is not cut to BA/PM: it is a probe instrument, not product code.

## Result
- **PASS_WITH_RISKS.**
- **Required fixes:** `FIX-177-1`. It does not block `ABC-177`.
- **Accepted risks:** `R-177-1` (LOW, Olger Oeselg, on `…31ab7d2d`) and `R-177-2` (LOW, Architect/Design).
- **Open, routed:** `SEC-177-1`, outside this diff and outside the L1 set. Decision owner: Olger Oeselg.
- **A11 / O3** is Architect/Design's and BA/PM's (`arch-O3-ABC-177`), not this gate's.
- **Recommended column:** `In Security/NFR` → `Ready for UAT`, where the UAT waiver applies (zero production lines).
  The Orchestrator decides.
