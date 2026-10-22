---
id: 20261022T172500Z-orchestrator-decision-2c4d34bd
kind: decision
by: orchestrator
at: 2026-10-22T17:25:00Z
verified_by: 
confidence: high
refs:
  - ABC-198
  - AR-1
  - QE-198-a
  - QE-198-b
  - QE-198-c
  - QE-198-d
  - .grugops/context/qe-ABC-198/notes/20261022T171405Z-qe-e2e-decision-0b183705.md
  - .grugops/context/owner-delegation-2026-10-22/notes/20261022T140148Z-orchestrator-decision-5aaf7cec.md
supersedes: 
seal: sha256:f4f8c108b0f0a29d808f342ff06af48a621a2f98c6f52fa278bf6cb7b2974558
---

# ABC-198 closed: merged, gates green on main; the AR-1 interim accept lapses

The decision is made under the owner delegation (`…5aaf7cec`).

**Inputs**
- QE PASS_WITH_GAPS (`…0b183705`, `grugops/qe-ABC-198` @ `981c2bff`, merge `24f32527`). A1–A7 are met.
- Security/NFR A8 PASS (`…0f626230`).

**The ABC-170 A2 intermittent is ruled pre-existing, so it is not a FAIL against A5.**
- At the 5 s default timeout, base reads 0/73 and head 0/73.
- With the CPU starved, base and head both read 3/3, with the same row and the same `Test timed out` signature.
- `@vitest/runner` is byte-identical in 4.1.11 and 4.1.12.

**Merged** to `main` at `e0e5f987` (`--no-ff`). Against `HEAD^1`, the only non-record lines are `package-lock.json` 53/53 and `src/cli.test.ts` 1/1.

**Gates on `main` @ `e0e5f987`** (after `npm ci`; installed vitest is 4.1.12)
- lint, typecheck and build exit 0.
- `npm test` passes 60 files and 1 995 tests in 9.47 s. That is not an NFR-008 reading: the host was loaded and the owner's foreign vitest was running. `last-run.json` reads `success: true`.
- The skip count is 0, and `test-skip-integrity` prints `No findings.`
- `qe-hop-integrity --ticket ABC-198` reports covered.
- Deep lanes: CLI_DEEP 95/95 (whole file), UCI_DEEP 5/5 (`src/uci.real-engine.test.ts`), PERFT_DEEP 32/32.
- `npm audit` lists nanoid, postcss and source-map-js only.

**UAT** is waived by measurement: 0 production lines. QE's verdict stands as the acceptance under the delegation.

**Gap rulings**
- **QE-198-a (LOW):** accepted interim. It goes to BA/PM (`bapm-rule-QE-198`) to lighten or own-timeout ABC-170 A2 and ABC-167 A7. Until it is ruled, a timeout red on those rows under load means a re-run on a quiet host, not a FAIL.
- **QE-198-b (LOW/INFO):** the roughly 5 % coverage-mode cost from `@vitest/mocker`. It goes to BA/PM in the same hop.
- **QE-198-c and QE-198-d (INFO):** agreed, no action. Process fix: future briefs give each hop its own scratch sub-folder.

**AR-1:** the interim LOW accept `…e4ef897b` lapses on this merge. The remaining set is exactly 3 pairs, all already owner-approved (`…193e08fb`):
- nanoid GHSA-2v37-7h3g-55p8
- postcss GHSA-fxqj-rqcc-2cmp
- source-map-js GHSA-68fv-2mgg-jv7q

The Release Manager re-states AR-1 on that set (`rm-restate-AR-1`). It is a subset of an approved set and no new HIGH accept, so it stays inside the delegation.

**Next:** ABC-178's B7/B8 timing hop runs alone on a quiet host. It needs the owner's quiet window, because the foreign vitest in `Projects/public/grugops` is active now.
