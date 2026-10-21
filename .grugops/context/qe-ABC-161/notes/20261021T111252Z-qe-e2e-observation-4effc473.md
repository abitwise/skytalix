---
id: 20261021T111252Z-qe-e2e-observation-4effc473
kind: observation
by: qe-e2e
at: 2026-10-21T11:12:52Z
verified_by: 
confidence: high (each gap measured or read from the code)
refs:
  - ABC-161
  - grugops/ABC-161
  - 5e755bcb
  - ee1818bb
  - 35788fd4
  - grugops/qe-ABC-161
  - src/cli.test.ts
  - plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md
  - QE-161-a
  - QE-161-b
  - QE-161-c
  - QE-161-d
  - QE-161-e
  - QE-182-d
supersedes: 
seal: sha256:984fb25a491602e91cd253dc85d1764d14b63a3798ab542025ad0a3026c549fa
---

# ABC-161 QE gap register: QE-161-a (LOW), QE-161-b..e (INFO); none blocks, none is against a criterion

- **`QE-161-a` (LOW; route SE via BA/PM; fold into the next ticket that edits `ABC-065` `A3` or the `Dev / run` slot).**
  - Fix 3's list capture `${option} (\w+(?:\|\w+)+)` has no right-hand delimiter, so text after the first non-word character is never read.
  - Six scratch probes pass on head with a wrong documented list: `…5|`, `…5|+3`, `…5 |6`, `random-ish`, `5.5` and `…random|+black` (`…fix3` note, B1–B5 and B10).
  - It is not live: the real slot is correct.
  - A candidate tightening, for the builder to judge and not a prescription: require the run to end at a delimiter, such as a backtick, comma or whitespace.
- **`QE-161-b` (INFO; BA/PM, slot WRITING RULES).** The row now requires the `|`-joined form, and the slot's WRITING RULES do not state it.
  - A meaning-equivalent re-wording (`1 | 2 | 3 | 4 | 5`, `1/2/3/4/5`, `1-5`) reds, as does a duplicate word.
  - A future single-value option would red on a correct slot.
  - All of these are loud, never silent.
- **`QE-161-c` (INFO; comment wording).** The row's last line compares the union of the resolver's accepted sets, not of the documented lists, with every value word.
  - The comment "every value word belongs to some documented list" holds only through the per-option equality above it.
  - The line does catch a value word that no option accepts.
- **`QE-161-d` (INFO; BA/PM, wording).** At the tip, A4's literal `git diff --name-only <base>` lists 11 files: `src/cli.test.ts` plus the SE's 10 Workflow 16 records. Outside `.grugops/context/` it is exactly `src/cli.test.ts`, so A4 holds on intent. This has the same shape as `QE-182-d`.
- **`QE-161-e` (INFO; residual of fix 1, already covered by the page's `P2` promotion trigger on a `LEVELS` re-cut).**
  - With `call < 3` at seed 7, a per-move rebuild at a blunder level reds only while that level's `blunderRate` is in (0.0117, 0.9769].
  - A level re-cut to a rate ≤ 0.0117 (for example 0.01) leaves a rebuild at that level blind. Nothing in the row pins the window; the non-vacuity block pins level 1 only.
  - The dependence on the table is much narrower than the old (0.0117, 0.0620] at two calls, but it is not zero. The comment's "without leaning on one level's rate" is true of today's table.

Gap count for process rule 1's control: 1 LOW + 4 INFO. No criterion gap; A1–A4 are met.
