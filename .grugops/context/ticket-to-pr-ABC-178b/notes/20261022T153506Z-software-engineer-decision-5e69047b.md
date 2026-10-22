---
id: 20261022T153506Z-software-engineer-decision-5e69047b
kind: decision
by: software-engineer
at: 2026-10-22T15:35:06Z
verified_by: 
confidence: high (shape and diffs read directly)
refs:
  - ABC-178
  - QE-178-b
  - QE-178-a
  - QE-177-a
  - ABC-167
  - EPIC-007
  - efaa0a76
  - 0fb19ab9
  - 0036e5c6
  - d12831c6
  - 43e4996f
  - d781e5e5
  - 20261022T152530Z-ba-pm-decision-1f4936b2
  - 20261022T152530Z-ba-pm-observation-34bf730b
  - 20261022T151738Z-qe-e2e-decision-1ad5f522
  - 20261022T151717Z-qe-e2e-observation-f910b911
  - 20261022T141254Z-software-engineer-decision-82e891e8
  - src/uci-session.test.ts
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
supersedes: 
seal: sha256:6d69ff17ce5b96a67a710d2d0fd21bbdfdb0ec9728250ad7007b46e95b57d3d4
---

# ABC-178 QE-178-b fold: one comment line plus one re-check assertion appended to R1, after session 2's line; no new row. Branch `grugops/ABC-178`: merge `0fb19ab9` (main `d12831c6`), tip `0036e5c6`

- **Merge first:** `git merge main` (no rebase) gave `0fb19ab9`. The untracked `ticket-to-pr-ABC-178` notes in the worktree were byte-identical to `main`'s copies. They were moved aside, the merge ran, and they came back identical. The worktree is clean.
- **Shape (amended B1):** after `expect(talk(["stop", "ponderhit"]).out).toEqual([]);` R1 now has `// QE-178-b: re-read session 1 after session 2 ran; a fresh session's release must not reach it.` and then `expect(held.out.filter((line) => line.startsWith("bestmove"))).toEqual([]);`. This is the same `held.out` array, not a new session. The first check, before session 2, is unchanged. The assertion line is byte-equal to QE's `r1recheck.diff` line.
- **Why a comment line too:** without it, the re-check reads as a duplicate of the first check, and a later edit could remove it as dead. B3 (2026-10-22 block) allows comment lines that cite `QE-178-b`.
- **Additive twice over:** against `efaa0a76` it adds 2 lines and removes none. Against base (merge-base `d12831c6`, main without R1) it is one hunk of 9 `+` lines and 0 `-` lines in one file.
- **Notes stay uncommitted on the branch,** as for `ticket-to-pr-ABC-178`, so that `--name-only` against base stays exactly `src/uci-session.test.ts`. The brief allowed committing them; leaving them out keeps the B3 reading literal.
- **`main` moved during the hop** to `180ed863` (Orchestrator docs: `bed1f380`, `180ed863`; `git diff --name-only d12831c6 main -- src` is empty). It was not re-merged. The brief's merge was done once, at the start.
