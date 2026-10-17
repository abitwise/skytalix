---
id: 20261017T110000Z-qe-e2e-decision-abc030-verdict-pass-with-gaps-5c5e3ce1
kind: decision
by: qe-e2e
task: qe-ABC-030
at: 2026-10-17T11:00:00Z
verified_by:
confidence: high
refs:
  - ABC-030
  - plans/tickets/ABC-030-nfr-justification-comments-cite-a-live-sibling-count.md
  - QE-030-a
  - QE-030-b
  - QE-030-c
  - 20261017T105000Z-qe-e2e-observation-abc030-criteria-and-gates-07a80df5
  - 20261017T105500Z-qe-e2e-observation-abc030-break-attempts-d53b8f4f
  - 20261017T134000Z-software-engineer-decision-three-sites-mechanism-form-3a1f0c30
  - 20261017T134500Z-software-engineer-observation-criteria-readings-7c2e91d4
supersedes:
---

# QE `ABC-030` on `grugops/ABC-030-nfr-comment-counts` (tip `e0f8b617`, code `bc185f83`, base `b84dc637`): **PASS_WITH_GAPS**

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). QE ran beside the SE hops on
`ABC-040` and `ABC-024` (width 3). The readings are in `…07a80df5` (criteria and gates) and `…d53b8f4f` (break
attempts). QE took every reading before opening the SE's notes. The SE's readings agree on every number.

| item | ruling | basis |
|---|---|---|
| `A1` | **MET** | grep 1 hit at base, 0 at tip (exit 1). The mechanism (`vi.mock` hoisted to file scope, every test there) is kept in both sentences |
| `A2` | **MET** | `src/*.ts` grep 3 → 0 (exit 1). Numstat `1 1` in exactly the three re-scored files; zobrist md5 is unchanged; every changed line is inside the header `/** */` |
| `A3` | **MET** | per-file counts `cmp` 0 (58 files, 1792). Base came from an independent `git archive` export. The full titles are byte-identical too |
| `A4` | **MET** | the three repaired sentences hold no integer. The dated witness `gameend:8` is kept. **Sentence-scoped reading**, the one the re-score's fence implies (see `QE-030-a`) |
| SE's A4 reading | **upheld, with one omission** | keeping `gameend:8` is right (test note 2). The SE's integer list misses two number words (`QE-030-a`) |
| Comment-only / 0 production | **confirmed** | all three UAT-waiver greps are empty |
| Gates | **green** | lint 0 (113), typecheck 0, build 0, `npm test` 58 / 1792, skip 0, `No findings.` |
| Merge | **clean** | `git merge-tree` against `main` exits 0 |

**Gap register.** None blocks, and no criterion is unmet.

- **`QE-030-a` (LOW, BA/PM's to rule).** Two **live** counts of another file survive in the same header blocks,
  written as words, so digit-based reading misses them:
  - `src/status-panel.nfr.test.ts:4-5`: *"`plans/nfr-catalog.md` has moved a bar off the clock and onto a count
    three times"*
  - `src/san.nfr.test.ts:17`: *"`plans/nfr-catalog.md` records that lesson twice"*

  Both are undated and both cite the catalog. Whether each is true today is `UNKNOWN - verify`. They are outside the
  repaired sentences, and under the re-score's reading A4 does not reach them. They are the same defect class one
  file over, and the SE's A4 list omits them. QE made no edit (no hidden scope). The ruling is BA/PM's: fold them,
  cut a follow-up, or accept them.
- **`QE-030-b` (LOW, an accepted residual; record only).** The A1/A2 regexes catch 2 of 6 planted live counts, only
  the two historical phrasings. They miss ``all 45 tests in `gameend.test.ts` ``, which is the form already standing
  at `gameend:8`, and three more variants. Nothing re-runs the grep after the gate: a control over comment text was
  refused at `ABC-028` `F4` and stays refused here. So A4's *"go red the moment anyone writes a live count back in"*
  holds for two phrasings, and only when someone re-runs the grep. No action is requested.
- **`QE-030-c` (INFO).** The SE's notes stamp `at:` with local time (+03:00) labelled `Z`, three hours fast
  (`bc185f83` is 10:46Z). Nothing reads order from them today.

**Not done, stated:**

- QE added no row to `plans/traceability.md`. The brief fences QE to the notes and the ABC-030 page; the row text is
  in the handoff for the Orchestrator to append.
- No deep lane was run: no engine, search, CLI or input file changed, so the `PUZZLE_DEEP` trigger does not fire.

**UAT-waiver reading:** `git diff --name-only b84dc637...e0f8b617 | grep -v '\.test\.ts$' | grep '^src/'` is
empty, so the 2026-08-17 waiver applies.

**Next column:** the Orchestrator's call. QE recommends leaving `In Review` toward `Ready for UAT`. Security/NFR does
not fire: 0 production lines and 0 new files under `src/`.
