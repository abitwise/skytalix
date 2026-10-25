---
id: 20261025T122918Z-security-nfr-decision-7522161b
kind: decision
by: security-nfr
at: 2026-10-25T12:29:18Z
verified_by: 
confidence: medium: engineering reading of the records, not legal advice; legal readings UNKNOWN - verify
refs:
  - security-nfr-lic-pub-1
  - LIC-PUB-1
  - OQ-214-4
  - ABC-214
  - ABC-215
  - ADR-0048
  - ADR-0049
  - EPIC-008
  - SEC-PUB-1
  - SEC-212-b
  - 5c91e2e4
  - 59f50717
  - 794d5c04
  - cc30eebe
  - orch-2026-10-25x/20261025T122241Z-orchestrator-decision-26f4e001
  - orch-2026-10-25w/20261025T121545Z-orchestrator-decision-ccf209d9
  - security-nfr-public-repo-redacted/20261024T110658Z-security-nfr-decision-04b04305
  - security-nfr-lic-pub-1/20261025T122908Z-security-nfr-observation-8127705e
supersedes: 
seal: sha256:c487bd03110dc488726b66f27a4f621f9032eed1748b15bbb9e9335a0b5e6d5f
---

# Security/NFR `security-nfr-lic-pub-1`: PASS_WITH_RISKS. OQ-214-4 DISPOSED (moot at `main`'s tip since `5c91e2e4`). LIC-PUB-1: recommend the owner close it at the tip, both parts, with history residuals INFO

This is a `decision`, not a `finding`: `context.human_admission` is `off`, and a licence reading is not gate-adjudicable. Evidence: this task's observations (the licence evidence at `cc30eebe`; the records edited at `794d5c04`).
*This is an engineering role's reading, not legal advice.*

## OQ-214-4: DISPOSED, moot at `main`'s tip (Security/NFR's disposition, per `ABC-215` § Design ruling)
- **The question** (`ABC-214` § Open questions): under the Adaptation reading, does a `NOTICE` carve-out satisfy BY-SA 3.0 § 4(b)?
- **At `main` `cc30eebe`** there is no carve-out and no value declared as CC BY-SA: `NOTICE` has no CC BY-SA section, the `src/evaluate.ts` header claims the values as this project's own, made by stated rules, and QE `A2`/`A3` are MET. The question has no subject at the tip. `ABC-214` said this ticket "removes the question at its tip"; it did.
- **Not answered, and not owed by an engineering role:** whether the carve-out met § 4(b) for the versions that carried it (`59f50717` up to `5c91e2e4`). That is a history question. It joins LIC-PUB-1's history residual (below) and stays `UNKNOWN - verify` (legal).
- **On the public tip** it becomes moot only when the owner pushes a `main` containing `5c91e2e4`. Local refs show the last push at `3497aad2`, before it.

## LIC-PUB-1 (MEDIUM, owner-owned): recommended disposition for the owner to close
**Recommended words for the owner:** *"LIC-PUB-1 closed at the tip; history not rewritten."*
- **Part 1, the licence.** Closed 2026-10-24: `ADR-0048` accepted and `ABC-214` merged at `59f50717` (Security/NFR `…04b04305`). Unchanged.
- **Part 2, the Adaptation remainder** that `ADR-0048` § Consequences and `ABC-215` kept open. Ended at the tip by `ABC-215` (`5c91e2e4`): the values are rule-made, and the carve-out is removed.
- **Reconciling the records:** the 2026-10-24 notes recorded LIC-PUB-1 CLOSED; `ABC-215`, `ADR-0048` § Consequences and the Orchestrator kept a remainder open. With part 2 ended, both readings now give the same state. Nothing is reopened, and no sealed note is edited. The owner's word makes the record single.
- **Residuals, all INFO, owner Olger Oeselg (accepted posture, no new control warranted):**
  1. Public history keeps the earlier versions: 3 without attribution (2026-08-17 to 2026-10-18), then the carve-out versions. No rewrite and no force push (`ADR-0048` decision 8; the `SEC-PUB-1` acceptance).
  2. The public tip lags `main`. Per local refs it still carries the `ABC-214` carve-out until the owner pushes. That is the owner's act; agents never push (`ADR-0049` decision 1).
  3. 164 of 391 value cells equal the earlier values because their stated rule produces them. This is provenance, not a licence ruling. `UNKNOWN - verify` (legal).
  4. Every legal reading (the tables' protectability, Adaptation versus Collection) stays `UNKNOWN - verify`. Legal advice is the owner's call.
- **Re-open trigger:** a third-party value or table is brought into `src/` again, or legal advice says the coincident rule-made cells or the history need action.

## The other two items in the brief
- **EPIC-008 § Dependencies:** 1 personal path redacted at the tip under `ADR-0049` decision 4 (LOW, a forward application; dated history untouched). The Stockfish system-package path is kept: d4 does not name it.
- **`plans/nfr-catalog.md`:** the stale "no `bin`, ten modules with no entry point" line (`…f2ef08e0`, INFO) is dated and closed. No bound moved.

## Result: PASS_WITH_RISKS
- 0 HIGH, 0 MEDIUM newly raised. `security.block_on` is `high`, so nothing blocks.
- LIC-PUB-1 awaits the owner's closing word. The four residuals are INFO and the owner's.
- ASVS L1: no requirement in scope (records only; no code, dependency or config change).

## Owed
- **Owner:** the LIC-PUB-1 closing word (above); the push that makes the tip public is his, whenever he chooses.
- **Orchestrator:** the 10-cell trace row from the brief's Result; any board line. Merge is the Orchestrator's on the standing ruling.
