---
id: 20260813T132000Z-ba-pm-decision-the-coverage-landmine-is-a-gitignore-change-not-a-ticket-and-the-artifact-is-stale-9d3e6b41
kind: decision
by: ba-pm
at: 2026-08-13T13:20:00Z
verified_by:
confidence: high
refs:
  - quality-gate-ABC-021
  - coverage/
  - .gitignore
  - agents-md-process-rules
supersedes:
---

# The `coverage/` landmine: **a `.gitignore` change, NOT a ticket and NOT an `AGENTS.md` line** — and the 22 tracked files are a stale artifact from the rules-core era

> **Hand-authored, no stamp.** The gate hop stepped on this, restored it byte-identically, and named
> it rather than quietly cleaning up. This note rules it.

## The hazard, re-verified at this hop

```
git ls-files coverage | wc -l          22        TRACKED
grep -c 'coverage' .gitignore           0        NOT IGNORED
```

vitest's coverage provider has `clean` defaulting to **`true`**, so it **wipes the directory before
it writes**. Any hop that runs a coverage command sees **22 tracked files as deleted** in
`git status`, and a hop that then commits with `git add -A` **silently deletes 22 tracked files** —
in a diff where the deletion looks like an intentional cleanup. The gate hop restored them with
`git checkout -- coverage/` and re-verified `git diff -- coverage/` empty.

## The fact that decides the disposition, and it was not in any note: **the artifact is STALE**

```
git log --diff-filter=A -- coverage/   -> 226c2e3, 8d0a8f7   (the rules-core feature commits)
git log -1 -- coverage/                -> 76ca714            (rules-core era; untouched since)
```

The 22 files cover **eight** `src/` modules — `apply`, `fen`, `gameend`, `legal`, `moves`, `perft`,
`position`, `zobrist` — plus `tools/grugops/`. **There are 47 files under `src/` today.** There is no
`turn-loop`, no `frame`, no `history-pane`, no `glyph-mode`, no `status-panel` in it. **It is an HTML
report of a tree that has not existed for two epics**, committed by accident during the rules-core
hops and never updated since.

**So this is not a record anyone is preserving. It is a build artifact that was checked in by
mistake, and it is a tripwire under every future coverage run.**

## The ruling

**A `.gitignore` change plus an index removal. Two commands, one commit, no ticket, no `AGENTS.md`
line.**

```
printf 'coverage/\n' >> .gitignore
git rm -r --cached coverage/
```

**Why not a ticket.** There is no user, no pain in the product, no acceptance criterion worth
writing, and no risk to weigh — the content is recoverable from git history forever, and it describes
a tree nobody can use. A ticket page for two commands would be the delivery audit's finding wearing a
ceremony: **142 ticket-lines per production line is the number this board is trying to bring down.**

**Why not an `AGENTS.md` line.** The brief offered it and the Scribe lane is live, so I want to be
explicit: **a warning is not a control.** An `AGENTS.md` line converts a mechanical hazard into a
human instruction every future hop must read and remember, and this board has the measurement on that
disposition — *"whoever next opens it"* was **0-for-2** on `ABC-030`'s evidence, with one miss by the
very commit that caused the staleness. **The `.gitignore` change removes the hazard; the line only
describes it.** And once the change lands, the line would itself be stale documentation of a fixed
problem — the exact defect class this hop spent all day homing. **Do not send this to the Scribe.**

**Why the 22 deletions in the fix commit are not the thing being warned about.** They are the same
deletions — made **deliberately, with a reason, in a commit that says so**, instead of silently
inside somebody else's `git add -A`. That distinction is the whole of it.

## I did not make the change, and that is a boundary, not a hedge

My boundary at this hop is ticket files and notes. `.gitignore` and the index are neither.
**Routed to the Orchestrator as a one-hop chore with the two commands above and the evidence that
the artifact is stale.** Until it lands the exposure is live: **any hop running coverage before then
must check `git status` for 22 `coverage/` deletions and `git checkout -- coverage/` before
committing.**
