---
id: 20260812T231000Z-security-nfr-observation-the-subject-i-gated-with-digests-and-the-gate-steps-4e1a09c7
kind: observation
by: security-nfr
at: 2026-08-12T23:10:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0008
  - ADR-0011
  - NFR-002
  - NFR-008
  - src/history-pane.ts
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
supersedes:
---

# The subject I gated, by digest — and the Workflow 05 steps run in order on it

> **`kind: observation`, not `finding`, and that is forced.** There is no `§14-gate` verdict record
> under this task and `context.human_admission` is **`off`**, so no `finding` may be written and
> nothing is self-stamped. **`scripts/context-io.ts` and `scripts/claim.js` do not exist** —
> re-verified AT SOURCE at this hop, not inherited: there is no `scripts/` directory in this
> worktree, and a `find` for `context-io*` / `claim.js` across it (outside `node_modules`/`.git`)
> **and** across the kit root `/Users/olgeroeselg/.grugops/agent-factory` returns nothing. These
> notes are hand-authored and there is **no derived `index.md` / `index.jsonl`** — `notes/` is the
> source of truth. The Workflow 17 claim was taken **by hand**: `mkdir -p` for the missing
> `claimed/` parent, a **bare `mkdir`** on the task directory itself, so the atomicity the protocol
> relies on is intact and a second claimant would have taken `EEXIST`.
>
> **`confidence: high` because every figure below was RUN at this hop.**

## 0. The subject, identified before anything was judged

| | |
|---|---|
| worktree | `../cli-chess-abc029-sec` |
| branch | `grugops/security-nfr-ABC-029` |
| HEAD | `1e70dc2ffd4d7f741202ae2eb64d6d118271a70b` |
| `src/history-pane.ts` | md5 **`c4653c4c263c4c417ea34969164ccd86`** |
| `src/history-pane.nfr.test.ts` (the instrument) | md5 **`16bf2f50c93e2e896b5406cbfa772b8b`** |
| production modules / test files | **16** / **26** |
| machine | **Mac15,13**, 8 logical cores, Darwin 25.5.0 arm64, Node **v24.12.0**, npm **11.7.0**, vitest **3.2.7** |

**Both digests reproduce the Orchestrator's stated baseline exactly.** They were **re-taken after
the last run of this hop and are unchanged** — nothing this gate did wrote a repository worktree.
The brief warned that the tip has moved under a gate on this stack before; it did not move under
this one.

**The machine is the `NFR-008` reference machine, field for field**, so this hop's lane figures are
not `UNKNOWN - verify` on hardware grounds. On any other machine they would be.

## 1. The gate steps, in Workflow 05's order, from the `AGENTS.md` command slots

| step | command | result |
|---|---|---|
| lint | `npm run lint` | **PASS** — **0 errors**, 2 pre-existing `biome migrate` **infos** about `biome.json`; `quality.lint.strict` is `false`, so infos do not fail. Identical to the stated baseline |
| typecheck | `npm run typecheck` | **PASS** — 0 |
| unit | `npx vitest run` | **PASS** — **755 passed (755) on 26 files** |
| build | `npm run build` | **PASS** — 0 (`tsc --noEmit`) |
| e2e | — | **`UNKNOWN - verify`, non-blocking.** `quality.ui_e2e` is `ui-or-critical-path`; the `AGENTS.md` E2E slot is `UNKNOWN - verify`; there is no UI surface until `EPIC-006`. **None invented** |
| test-integrity | skip count, then `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | skip count **`0`**. Checker **exit `2` — COULD NOT RUN**; `.grugops/test-skips.md` does not exist. See §3 |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | **`UNKNOWN - verify`, non-blocking** — no `scripts/` directory in this host repo, which the workflow provides for |
| auto-UAT live E2E | `npm run test:e2e` | **`UNKNOWN - verify`** — no such script in `package.json` |

**All four `mandatory_gates` pass.**

## 2. Coverage — and the headline number is MISLEADING, which nobody has recorded

`npx vitest run --coverage`:

| scope | % stmts | % branch | % funcs | % lines |
|---|---|---|---|---|
| **`src/`** (all 15 imported production modules) | **100** | **99.6** | **100** | **100** |
| `tools/grugops/*.js` (2 files) | **0** | 0 | 0 | 0 |
| **"All files" headline** | **78.6** | 99.21 | 97.36 | **78.6** |

`quality.coverage_threshold` is **`0.8`**. **The application code is at 100% and the aggregate is
78.6% — below the floor — purely because the report includes grugops's OWN TOOLING.** There is **no
`vitest.config.*` in this repo at all** (checked), so coverage carries no `include`/`exclude` and
the v8 provider reports whatever it sees. `tools/grugops/reference-check.js` and
`tools/grugops/test-skip-integrity.js` are both **pre-existing on `main`** (`git ls-tree`), so this
is not `ABC-029`'s.

**Why it is worth writing down: a gate that reads only the headline reports a coverage MISS against
a tree whose application code is fully covered.** No gate on this project has enforced
`coverage_threshold` mechanically yet, which is why it has not bitten. **Owner: whoever next wires
`coverage_threshold` into the gate. Trigger: the first gate run that enforces it.** Not a merge
blocker and **not a defect in this change**.

*(`src/perft-bench.ts` is absent from the report because nothing imports it — it is `ADR-0011`
clause 4's entry point. Consistent, not a gap.)*

**One side effect of this step, recorded because it bit me:** `coverage/` is **tracked** and is not in
`.gitignore`, so running the coverage command **dirties the repository worktree** (15 tracked files
modified, 7 created). It was **restored** to its committed state and the restore was verified. Full
account in this hop's `artifact-ref`. **Any hop that runs `--coverage` will do the same.**

## 3. Test-integrity exit `2` — recorded as an error, never as a pass

`.grugops/test-skips.md` **does not exist and has never existed on any branch** —
`git log --all -- .grugops/test-skips.md` is empty. Per Workflow 05 an exit `2` is *"the checker
could not run — an error distinct from a clean fail, recorded as such, never read as a pass."* It is
**exit `2`, not exit `1`**, so the human-only short-circuit does **not** fire and no self-fix attempt
is owed. `quality.test_integrity` is **`warn`**.

**This is a standing REPO-LEVEL gate hole and it is NOT `ABC-029`'s** — it predates the ticket on
every branch. It is recorded as `UNKNOWN - verify`, and the skip count itself is a measured **`0`**.
**Owner: a human — `.grugops/test-skips.md` is human-owned by Workflow 05 and an agent may not
author it. Trigger: the first skipped test on this project**, at which moment the absent registry
stops being harmless.

## 4. `ADR-0008`'s two RATIFIED clauses — measured on the reference machine, both MET

Protocol as ratified: `npm test` with `PERFT_DEEP` unset, one fresh OS process per run, **round 0
discarded as warm-up**, median of the remaining **7**.

| clause | bar | **median of 7** | headroom |
|---|---|---|---|
| wall-clock | ≤ **3 s** | **1.669 s** | **1.33 s (44%)** |
| CPU (user + sys) | ≤ **13 s** | **8.866 s** | **4.13 s (32%)** |

Raw wall: 1.641 1.657 1.643 1.780 1.723 1.922 1.669 · Raw CPU: 8.762 8.912 8.810 8.863 8.887 8.866 8.920
(warm-up round discarded: wall 1.737, CPU 8.876).

**Both clauses MET with room.** These are the `NFR-008` figures that a paired protocol is not needed
for, and they are the ones that are actually resolvable — see the sibling note on `N8-LANE`.
