# bapm-owner-answers-1104 observation: what the records on `main` `7dd241cf` show, read before the pages were written

BA/PM, task `bapm-owner-answers-1104`, records only. I read these with git, grep and sed on the branch cut from `main`
`7dd241cf`. Nothing was run.

- **`ADR-0071` § Status** reads: "ACCEPTED 2026-11-04 by the owner, in form (a), as written (OQ-0071-1). Not in force
  until `ABC-282` merges on its read (A6, D10)." It names option (b) as not taken. It records the harness ticket
  `ABC-300` as merged at `4ea39135`, and QE-300-a as carried to `ABC-282` A6. It records the Orchestrator's hold (until
  `ABC-283` merges or misses).
- **`ADR-0024`** has the 2026-11-04 § Status block (line 27: "Opened 2026-11-04 for design, by the owner's word
  (`Q-3K-10`…") and the d4 dated line (line 178). Both were written by `arch-owner-answers-1104` (`bcf795c3`, merged
  `b3438ca2`).
- **`4ea39135`** is "merge(ABC-300): the harness plays a clock — d --tc 40/8 (tools only) — QE PASS_WITH_GAPS, UAT
  waived".
- **QE-300-a** is defined in `qe-ABC-300` `…fbda2ad6` and `…69a765b1`: A6 `UNKNOWN - verify`, carried to `ABC-282`
  A6, non-blocking.
- **Before this task,** `ABC-282` said `ADR-0071` PROPOSED, with OQ-0071-1 pending, in four places: `adr:`, the
  header merge sentence, § Dependencies and DoR row 5. `ABC-289` named `Q-3K-10` as a hold in six places: the title,
  `adr:`, § Dependencies, DoR rows 5 and 10, and F1. `EPIC-011` named `Q-3K-10` as a hold in § Phases row 3, § Tickets
  row 41 and § Dependencies. It also listed `Q-3K-10` and OQ-0071-1 as open in § Owner questions (the dated line of
  `bapm-ABC-282-adr`).
- **After `b9593f90`:** none of these places names the owner's word as pending. The dated history headers (and
  `EPIC-011` § Phases row 5, W1; see J4 in the decision note) keep their wording as written.
