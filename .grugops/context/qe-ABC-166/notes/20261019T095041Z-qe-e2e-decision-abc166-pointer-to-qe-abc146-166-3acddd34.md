---
id: 20261019T095041Z-qe-e2e-decision-abc166-pointer-to-qe-abc146-166-3acddd34
kind: decision
type: decision
by: qe-e2e
role: qe-e2e
task: qe-ABC-166
at: 2026-10-19T09:50:41Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-166
  - ABC-146
  - QE-166-d
  - .grugops/context/qe-ABC-146-166/notes/20261019T092000Z-qe-e2e-decision-abc146-abc166-verdict-pass-with-gaps-7b4e1d93.md
  - .grugops/queue/done/qe-ABC-146-166.md
  - .grugops/queue/pending/uat-ABC-167.md
supersedes:
---

# ABC-166's QE verdict is `qe-ABC-146-166`'s `…7b4e1d93` (PASS_WITH_GAPS). This note only points there

This note is hand-authored and unsealed. `human_admission` is `off`, so it is a `decision` by an agent and never a
stamp. It was written by QE/E2E during subtask `uat-ABC-167`, as that brief's QE-166-d item asks.

**What it is.** A pointer. It exists only because `tools/grugops/qe-hop-integrity.js` looks for a QE `decision`
note in a context folder whose name carries the ticket id. The folder `qe-ABC-146-166` tokenises to ABC-146 only
(`qe-hop-integrity.js:193`), so the joint verdict covered ABC-146 and not ABC-166 (QE-166-d INFO, in
`.grugops/queue/done/qe-ABC-146-166.md`).

**What it is not.** It adds **no new grading**, no new reading and no new gap. ABC-166's QE verdict, its grades and
its gap register (QE-166-a to QE-166-d) are exactly those in
`.grugops/context/qe-ABC-146-166/notes/20261019T092000Z-qe-e2e-decision-abc146-abc166-verdict-pass-with-gaps-7b4e1d93.md`:
**PASS_WITH_GAPS** at `d93e247b`. On any conflict, that note wins. This note does not re-run or re-read anything,
and it is not the owner's acceptance of anything.

**Front matter.** It carries `kind: decision` / `by: qe-e2e`, which are the keys the contract
(`agent-factory/contracts/context-note.md`) defines and the tool parses (`qe-hop-integrity.js:121`). It also carries
`type: decision` / `role: qe-e2e`, as the `uat-ABC-167` brief words them. The two pairs say the same thing.
