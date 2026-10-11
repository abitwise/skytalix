---
id: 20261011T084951Z-qe-e2e-observation-abc070-a1-grep-blind-to-wrap-7fa9a4d1
kind: observation
by: qe-e2e
at: 2026-10-11T08:49:51Z
verified_by:
confidence: high
refs:
  - ABC-070
  - G-QE-070-2
  - .grugops/context/ticket-to-pr-ABC-070/notes/20261011T084531Z-software-engineer-artifact-ref-abc070-delivered-2f6c0e94.md
supersedes:
---

# QE `ABC-070`: A1's "one grep" oracle cannot see the defect it targets. The SE's "was 2" baseline does not reproduce

- `ABC-070` test note 3 says *"One `grep` is the whole of `A1`"*. The SE's § Delivery A1 row records `grep -c 'IS CLAIMED RIGHT NOW\|must not be pulled'` → 0 (was 2). I re-ran that exact command on `ABC-065` at `c0fedf7c~1`. It returns **1**, not 2. The phrase "This ticket must / not be pulled" wraps across `:132–133`, so a line grep never matches it.
- **Consequence:** the after-count of 0 is correct, but a line grep alone does not prove it. A surviving wrapped "must not\n be pulled" would also read 0. QE's A1 reading used whitespace-normalised text and gives 2 → 0, so **A1 stays MET**. The "was 2" in the SE's delivery row and in the trace row is not what the cited command outputs. It matches the ticket's own "Today: 2" claim, and that claim is correct when counted by statements, not by grep lines.
- **Gap (LOW), owner BA/PM:** class lesson for prose criteria cut on wrapped markdown. Specify a whitespace-normalised search, or count statements by reading, not `grep -c`. **SE, for the record:** the delivery row's baseline figure does not come from the cited command. QE did not edit the ticket page or the SE's trace row (fenced).
