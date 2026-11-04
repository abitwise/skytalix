---
id: 20261104T212513Z-ba-pm-decision-fafe37de
kind: decision
by: ba-pm
at: 2026-11-04T21:25:13Z
verified_by: 
confidence: high on what the brief and rulings fix; J1-J9 are BA/PM judgement, disclosed
refs:
  - bapm-lines-1104b
  - grugops/bapm-lines-1104b
  - ABC-301
  - ABC-289
  - ABC-286
  - ABC-288
  - ABC-284
  - EPIC-011
  - ADR-0056
  - ADR-0067
  - ADR-0070
  - ADR-0072
  - ADR-0073
  - ADR-0074
  - OQ-0072-1
  - OQ-0073-1
  - OQ-0074-1
  - Q-3K-11
  - R-BUNDLE-1
  - QE-271-h
  - 732a0cea
  - orch-2026-10-30a/20261104T205921Z-orchestrator-decision-5ec6c124
  - orch-2026-10-30a/20261104T212001Z-orchestrator-decision-878035ca
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - arch-bundle-1/20261104T205538Z-architect-design-decision-37b7fb23
  - se-ABC-301-s0/20261104T211909Z-software-engineer-observation-534a582c
  - se-ABC-301-s0/20261104T211909Z-software-engineer-decision-8fb36960
supersedes: 
seal: sha256:07e6713eadba73b85435da8ab14004a1c7f9d41e5ee58ed35dc07722efa6ebe8
---

# bapm-lines-1104b decision: the owed page lines are written. ABC-301's P1 form stands provisional; ABC-286 and ABC-288 take their adr lines only, and every line that hangs on the owner's answer waits

BA/PM, task `bapm-lines-1104b`, records only, from `main` `732a0cea`. Nothing was run but the note seal and the records-path check. Inputs: `orch-2026-10-30a` `…5ec6c124`, `…878035ca`; `arch-bundle-1` `…37b7fb23`; `se-ABC-301-s0` `…534a582c`, `…8fb36960`.

**Written.**
- **`ABC-301`:** P1 gains a dated sub-line with the own-phase form, marked PROVISIONAL until `qe-ABC-301-s0` reads it. Test note 4 gains the two E4a "every half 0" rows as pins at scope 4. DoR 10/10, unchanged.
- **`ABC-289`:** DP5 names `G2`'s byte identity (`ADR-0074` d12 (d)). DoR 10/10, unchanged.
- **`EPIC-011`:** the § The per-change rule pointer reads ACCEPTED; § Owner questions gains OQ-0072-1 and OQ-0073-1, one answer, and the "Open now" line; rows P4 and O2c point at `ADR-0072` / `ADR-0073` PROPOSED, premises not met.
- **`ABC-286`, `ABC-288`:** the `adr:` lines, as PROPOSED, and a dated block naming what waits. DoR 9/10, Backlog, held, unchanged.

**Judgement calls, each open to the Orchestrator.**
- **J1. P1's written sentence is kept, not struck.** The form is accepted provisionally and a rejection is a STOP, so the sentence stands beside the dated line until QE reads it. QE's confirmation needs one line here: the equation replaced. The bar is unchanged: exact, 44 of 44.
- **J2. The P1 equation is spelled from the row on `grugops/ABC-301`,** read directly, with mg, D and e defined on the page, so a reader need not open the branch.
- **J3. Test note 4 keeps its "exactly those named in `ADR-0067`" list.** The two rows are added as outside that list, and QE's check is said to cover them too. The words "re-pinned or retired" are `…878035ca` 3's, as given.
- **J4. `ABC-286` and `ABC-288` do not use `ABC-289`'s "reading (b)" wording.** Reading (b) let that build start on PROPOSED with its premise met. `ADR-0072` and `ADR-0073` each say the build does not start on its own, F1 having fired. The `adr:` lines and the OQ rows say so.
- **J5. `…37b7fb23` § Owed lists both `adr:` lines under "on the owner's answer".** The brief takes the `adr:` lines now and holds the rest, and the brief governs. DoR row 10, the L2 / L4 / CH1 / CH3 numbers, scope 1 and `ABC-288`'s title wait. Row 10 therefore still reads "held on the joint probe" and "the ADR is owed"; each page's dated block says those lines are read with it.
- **J6. "Rows P4 and O2c" is read as both of their rows in `EPIC-011`:** § Phases (full line) and § Tickets rows 38 and 40 (one clause each), so the two sections do not disagree. § Dependencies is untouched; its dated line stands as history.
- **J7. One word struck in the pointer** ("draft"), since an accepted rule is not a draft. The older banner saying "draft" stays as history.
- **J8. The Open-now line** lists OQ-0072-1 with OQ-0073-1 as one question, beside OQ-0074-1, which is still open: no Orchestrator note records an answer.
- **J9. The recommendation in OQ-0073-1's row is labelled the Architect's,** with its case against, as `…37b7fb23` states it. The Orchestrator has recorded no recommendation of his own on it.

Untouched: `ABC-282`'s page, the board, the ADRs, `src/`, `tools/`. The file names and the column fields stay as they were.
