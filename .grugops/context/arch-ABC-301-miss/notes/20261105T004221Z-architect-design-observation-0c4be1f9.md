---
id: 20261105T004221Z-architect-design-observation-0c4be1f9
kind: observation
by: architect-design
at: 2026-11-05T00:42:21Z
verified_by: 
confidence: high: read from git ancestry
refs:
  - arch-ABC-301-miss
  - ABC-301
  - arch-ABC-301-miss/20261105T004151Z-architect-design-decision-5941f727
  - ABC-279
  - ABC-283
supersedes: 
seal: sha256:a366081d49732ba716ef231c80297e06b89dfe928c7023a350a63513b136ee11
---

# arch-ABC-301-miss correction to …5941f727: `ABC-279` was already in the first pull's base. Between the pulls `main`'s search moved by `ABC-283`, not by `ABC-279`

The item 1 note says that between the pulls `main`'s search changed, "(`ABC-279` and `ABC-283` merged)". A git ancestry read after sealing shows `ABC-279`'s merge `7b70e268` is an ancestor of the first pull's base `a8fbade5`. So only `ABC-283` belongs in that line. The point stands: data, tool, free set and search all differ between the pulls, so "one ply later" isolates nothing. The sealed note is not rewritten. The ADR lines carry the corrected form.
