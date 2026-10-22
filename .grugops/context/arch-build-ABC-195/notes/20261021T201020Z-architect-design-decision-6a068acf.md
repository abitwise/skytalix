---
id: 20261021T201020Z-architect-design-decision-6a068acf
kind: decision
by: architect-design
at: 2026-10-21T20:10:20Z
verified_by: 
confidence: high (built and measured in scratch; QE's read owed)
refs:
  - ABC-195
  - AR-193-HUNKHDR
  - AR-193-SPACEPATH
  - QE-193-a
  - QE-193-b
  - QE-193-c
  - R-193-a
  - ADR-0036
  - ADR-0036 S1
  - V1.2.5
  - NFR-008
  - F-095-1
  - 99d07d32
  - 5e840c58
  - 0dfd17b3
  - 6b0f8575
  - 63eadabe
  - 341da4c1
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/design-F-072-1/probe/r2-mutants.out.txt
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
  - plans/tickets/ABC-195-an-added-line-starting-plus-plus-hides-later-hunks-from-clause-b-and-a-production-file-whose-name-holds-a-space-goes-unseen.md
  - 20261021T185456Z-ba-pm-observation-7e1a757e
  - 20261021T185506Z-ba-pm-decision-d7a70688
  - 20261021T183616Z-security-nfr-decision-5719a86d
  - 20261021T183537Z-security-nfr-observation-c5270049
  - 20261021T183723Z-orchestrator-decision-73e94c9f
  - 20261021T182327Z-orchestrator-decision-f61be5db
  - 20261021T201014Z-architect-design-observation-1bafd98d
supersedes: 
seal: sha256:7683609acd66325f8b2b7801da1d2110730f06aab6de381465ff9ed024be0902
---

# Architect decision for `ABC-195`: built as the page scopes, four files, 0 `src/` lines. `changedLines` gains a header window and a one-TAB strip (3 added, 5 edited lines); the harness gains 5 rows with one reference mode (`TW`, the control twin), a plant check and a Ruling 2 parse that reads spaced names; `ADR-0036` § S1 gains one dated block. A1–A9 met on the builder's read; QE's read of A2–A7 is owed, and `AR-193-HUNKHDR` / `AR-193-SPACEPATH` close on it

Cites the page `plans/tickets/ABC-195-…md` `## Scope` / `## Out of scope` and Security/NFR `…decision-5719a86d` § 3 (the `## Risks`, what the fix must hold) as authoritative. Readings: this task's observation note.

## Chosen design
- **(a) The header window.** A `header` flag is set on a `diff --git ` line and cleared on `@@`; the C-quoted test and both `---`/`+++` tests apply only while it is set. Under `-U0` (or with context, whose lines start with a space) no hunk line can start `diff --git `, so the window is exact. This is Security's prototype shape, taken as is.
- **(b) The TAB.** Each header path goes through `.replace(/^([^"].*)\t$/, "$1")`: one trailing TAB dropped from a path not starting `"`; a C-quoted path untouched.
- **Rejected:** parsing the path from the `diff --git a/… b/…` line instead of `---`/`+++` (ambiguous for names holding ` b/`, and a larger edit than the page scopes); stripping all trailing whitespace (wider than the one TAB the page asks for).
- **Harness.** One mode, `TW <twin base> <twin head>`: `341da4c1` runs on the twin, its output read back `src/q-t.ts` → `src/q t.ts`, and both outputs pass `twmask`, which masks both pair ids in the `  diff` line only (SP-N5's twin has its own base, so the old head-only `mask` would not do). The map is a no-op on the four `++ ` rows. `pc` runs the stand-in's own command on plant and twin and exits 2 unless ≥ 1 / 0; the row prints the counts. The Ruling 2 list parse splits at `  (fired by Ruling 2:`; every Ruling 2 file line carries that text (one print site), so the 20 rows read as before (measured byte-identical).
- **ADR.** One block under `### S1` after the `ABC-193` block, stating (i)–(v), the harness and the rollback (revert `0dfd17b3`; the HUNKHDR stand-in and the SPACEPATH trigger rule return). 0 `−` lines.

## NFR and risk impact
- `AR-193-HUNKHDR` and `AR-193-SPACEPATH`: the fix is built. They close on QE's read (`A2`, `A4`, `A5`; `A3` shows each part's share). The HUNKHDR stand-in retires at merge; until then the Orchestrator keeps running it.
- `QE-193-c`: not taken as code (the page's call); the ADR block states block (i)'s scope exactly.
- `NFR-008`: 0 / 0 / 0; the instrument and the harness run by hand, outside `npm test`. Call surface unchanged (`V1.2.5`).
- No new residual found. The trailing TAB in a C-quoted dispute line for a name holding a space and a `"` stays (cosmetic, fenced by the page).

## For QE
- Re-run `A2` with base's instrument (`git show 99d07d32:<instrument>`, beside a `node_modules/typescript` link) and `A4` with the harness at the tip, under a private `HOME`/`TMPDIR`/`GIT_CONFIG_GLOBAL` and `GIT_CONFIG_NOSYSTEM=1`. `A3`'s copies are one-part removals of head's file. Plant ids repeat for a given tip (fixed commit dates).
- `main` moved to `5427f807` during the hop (records only, no overlap); the branch is not merged with it (the Orchestrator's merge).
