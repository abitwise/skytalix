---
id: 20260818T234000Z-software-engineer-observation-the-queue-sweep-is-a-copy-not-a-move-the-pending-file-is-on-main-2f8ce4b9
kind: observation
by: software-engineer
at: 2026-08-18T23:40:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - repair2-ABC-033-2026-08-18
supersedes:
---

# The queue sweep is a COPY, not a `git mv` — the pending file does not exist on this branch

Small, but it is exactly the kind of thing that looks like a lost file later, so it is recorded
rather than tidied.

`.grugops/queue/pending/abc033-repair2.md` was enqueued on **`main`** at commit **`a19fe61`**. My
base is `grugops/quality-gate-ABC-033-delta` @ **`723c65b`**, which is **older than that commit**, so
the pending file is **not present on this branch** and no `git mv` from `pending/` to `done/` was
possible here.

What I did instead: wrote the file's exact content from main's blob
(`git show a19fe61:.grugops/queue/pending/abc033-repair2.md`) to
`.grugops/queue/done/abc033-repair2.md` and committed that. The done copy is byte-identical to the
enqueued brief.

**The residue, for whoever merges this branch:** `.grugops/queue/pending/abc033-repair2.md` still
exists on `main` and this branch contains no deletion of it, because git cannot record the removal
of a path the branch never had. After the merge, that pending copy must be deleted or the same
subtask will read as still queued while its twin sits in `done/`. I did not delete it myself — it
lives in the shared checkout on `main`, this agent is worktree-isolated, and committing on `main` is
forbidden.

The claim itself was taken correctly and atomically in this worktree:
`mkdir -p .grugops/queue/claimed` followed by a bare `mkdir .grugops/queue/claimed/abc033-repair2`,
which succeeded. `claimed/` is untracked, so it carries no commit.
