---
by: architect-design
at: 2026-08-15T08:26:42Z
task: design-nfr008-spawn-account
---

# Now-running registry record

Claimed by hand per `agent-factory/workflows/17-task-claim.md` and `AGENTS.md` § "Role / workflow
files": `scripts/claim.js` is absent from this repository and from the kit, so `claimTask` /
`transition` were **not called and not faked**.

```
mkdir -p .grugops/queue/claimed                                # parent
mkdir    .grugops/queue/claimed/design-nfr008-spawn-account    # BARE mkdir — the atomic act
```

The bare `mkdir` returned success (exit 0, no `EEXIST`), so the **claim was WON, not lost**.
Concurrent width at claim time: seven other task directories under `claimed/`, all of them completed
hops on `ABC-042` whose directories were never released. No live competitor observed.

## The base commit, and why it is one commit past the one the subtask names

The subtask's frontmatter says `base: grugops/abc042-merge-key @ 6f05887`; its prose says *"Branch
from `grugops/abc042-merge-key`"*. **They differ, and this branch takes the branch tip `039766f`,
not `6f05887`.** The reason is mechanical rather than a judgement call: the subtask file was authored
**in** `039766f`, so it could not name its own commit, and `039766f` is also the commit that carries
`parent_ref:` — `.grugops/context/g1-answered-2026-08-15/notes/` — which the subtask names as the
first thing to read. Branching at `6f05887` would have produced a tree without the owner's answer in
it. `039766f` is a strict superset of `6f05887`; nothing the subtask points at is lost by taking it.

## The `pending → claimed` transition IS taken here, and why that departs from the subtask's sentence

The subtask says *"Its queue transition is the Orchestrator's"*, and gives the reason in the sentence
before it: *"This subtask file is tracked on `main` and will not exist in your branch's tree."*
**That reason does not hold on this base** — `039766f` added `.grugops/queue/pending/design-nfr008-spawn-account.md`,
so the file **is** in this tree and can be renamed from it. The transition is taken here per
Workflow 17 steps 3 and 5.

**Merge hazard, recorded before it bites.** The same path is tracked on `main`. If the Orchestrator
also transitions it there, integrating this branch will surface a rename/rename or delete/modify
conflict on `.grugops/queue/pending/design-nfr008-spawn-account.md`. It is expected, it is on the
queue substrate only, and it is the Orchestrator's to resolve — flagged rather than avoided by
leaving the transition untaken.

This record is NOT a `kind: claim` note. The queue owns work-ownership; Workflow 16 owns memory.
