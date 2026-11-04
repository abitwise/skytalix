---
id: 20261104T130511Z-architect-design-decision-c7cd07e0
kind: decision
by: architect-design
at: 2026-11-04T13:05:11Z
verified_by: 
confidence: high: records only; the rule's commands and counts are the ones QE ran (qe-ABC-248, qe-ABC-281); the per-hop wall is UNKNOWN - verify until the first hop under it; nothing run
refs:
  - arch-ADR-0070-accept
  - R-281-a
  - QE-279-a
  - ADR-0046
  - ADR-0069
  - ABC-281
  - ABC-248
  - ABC-279
  - NFR-008
  - R-N8H-1
  - qe-ABC-281/20261104T041512Z-qe-e2e-decision-960d38ff
  - qe-ABC-281/20261104T041512Z-qe-e2e-observation-1311443a
  - secnfr-ABC-281-a9/20261104T042047Z-security-nfr-decision-2e3b747f
  - secnfr-ABC-281-a9/20261104T042047Z-security-nfr-observation-52f74e3c
  - qe-ABC-279/20261104T003652Z-qe-e2e-observation-c49b050d
  - qe-ABC-279/20261104T003652Z-qe-e2e-decision-6e99201a
  - src/search.null-move.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:6374870314cff282464b87f8514afecd15b8c73842f5847f2509630059d3145b
---

# arch-ADR-0070-accept decision: R-281-a's run-frequency rule (ADR-0046) and QE-279-a's wording line (ADR-0069 d10)

Architect/Design, task `arch-ADR-0070-accept`, records only, from `main` `7a9ee712`. Nothing was run.

## 1. `R-281-a`: the run-frequency rule
Written as `ADR-0046`'s last dated section, after the 2026-11-04 form-S block, with a Status pointer. Inputs:
`qe-ABC-281` `…960d38ff`, `…1311443a` (the counts), `secnfr-ABC-281-a9` `…2e3b747f` / `…52f74e3c`, and
`qe-ABC-248` (A5's "4 passed").
- **Scope:** the rows moved out of the default lane under `ADR-0046`. These are `ABC-248`'s `ABC-167` A5 rows
  (`uci-session`, 4 passed) and `ABC-281`'s three (`QE-208-a`, `ABC-230` A3 / A4, levels A9; 1 passed each). The four
  `-t` lines are spelled with both brackets escaped, as their QE ran them.
- **Per ticket:** the trigger is a delivered diff that touches a lane input (any non-test `src/`, `package.json`,
  `package-lock.json`, `vitest.config.ts`, `tsconfig.json`) or one of the four test files. Then the QE hop runs all
  four lines on the tip, under the host lock, and records the passed counts.
  - The check is the count, not the exit code.
  - A short or red row is a blocking gap.
- **Per epic:** at an epic's close, QE runs the four once on `main`'s tip.
- **A later moved row** joins the table with its cut.
- **Why all four, and not a file map:** the guards cross modules, and the rows are cheap (about 0.74 s in-thread for
  `ABC-281`'s). A5's cost and the vitest start-up are `UNKNOWN - verify`; the first hop under the rule records them.
- **Not set:** the frequency of the files' full deep lanes, which hold rows born deep.
- **`R-281-a`:** closed from the first QE hop that applies the rule (Architect/Design, the residual's owner).
  Security/NFR records the state at its next reading.

## 2. `QE-279-a`: `ADR-0069` d10, A1 (b)'s wording
Written as a dated line under d10's "losing test, called directly" bullet. Input: `qe-ABC-279` `…c49b050d` (gap),
`…6e99201a` (verdict).
- **Why it cannot be met:** "on a board where SEE alone would call it losing" has no board for a capture of an equal
  or bigger piece, en passant or a capturing promotion (`see ≥ victim − attacker ≥ 0`). For a king capture, such a
  board exists only on an illegal move.
- **The row as it is read:** `false` on a legal board, with `see` stated, as built and as QE ruled met.
- **What it means:** at threshold 0 the four guards are a cost clause, not a behaviour clause. A deleting mutant is
  unkillable, and that is accepted. No code changes and no row is added. A later threshold above 0 would make them
  bite again, and its rows would have to show it.

## 3. Owed lines
- **Orchestrator:**
  - Put the four `-t` lines into each QE brief whose ticket's diff fires the trigger.
  - Queue the epic-close run.
  - Decide where a pointer to the rule lives for QE: `memory-bank/40-contributing.md` § Conventions, or the command
    log. `AGENTS.md` sits at 18 429 of 18 432 B.
- **Security/NFR:** `R-281-a`'s state at its next reading (recommended: closed from the first QE hop under the rule).
- **BA/PM (optional):** a pointer under the `ABC-279` page's A1 (b) to `ADR-0069` d10's dated line. `ABC-279` is
  Done, so this is a record, not a re-open.
