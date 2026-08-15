---
id: 20260813T214232Z-security-nfr-claim-the-threshold-cannot-discriminate-and-here-is-the-wording-that-can-2554d421
kind: claim
by: security-nfr
at: 2026-08-13T21:42:32Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - ABC-042
  - plans/tickets/ABC-041-render-seam-closure.md
  - agent-factory/checklists/definition-of-ready.md
  - src/history-pane.nfr.test.ts
  - src/san.test.ts
supersedes: 
---

# The threshold FIRED and still measured nothing. It fails on the BASELINE, not just on this ticket. Repair below, homed to **BA/PM**.

The sibling `decision` finds the trigger fired. This note is the separate question the subtask asked
me to home: whether the wording can discriminate at all. **It cannot**, and for two independent
reasons — one of which nobody has stated yet.

These are different claims and I am keeping them apart on purpose. "The threshold cannot
discriminate" is an argument about the **wording**. It is *not* an argument that the threshold did
not fire. Collapsing the two is how a defective clause gets quietly waived instead of repaired.

## Reason 1 (the Engineer's, and it is correct): the ticket's own criteria force the breach

`A3` requires *"asserted **textually over the diff**"* and `A6` requires *"asserted **over the diff,
not by inspection**"*. A textual assertion over a module's source requires opening that source, which
requires `node:fs`. **`ABC-041` cannot be delivered conformantly without breaching its own
threshold.** A predicate that every conforming build satisfies carries zero bits.

## Reason 2 (not yet on record, and it is the stronger one): the predicate was ALREADY TRUE of `main`

Measured across all 47 `.ts` files under `src/` at the branch's merge-base:

```
production (non-.test.ts) files importing a Node builtin:  0     <- a REAL invariant, 47 files, 0 breaches
test files importing a Node builtin:                       2     <- BEFORE ABC-041 existed
  src/history-pane.nfr.test.ts   node:child_process, node:fs   (merged, ABC-029)
  src/san.test.ts                node:fs                       (merged, ABC-013)
```

Read literally — the reading that is correct — *"the delivered diff … imports any Node builtin"*
describes a property the tree **had already abandoned two tickets before `ABC-041` was cut**. A
threshold that is satisfied by the baseline is not measuring the change; it is measuring the repo.
Every future ticket in this epic that writes a text-assertion test fires it too, at which point the
column stops being routed *by evidence* and starts being routed *by default* — which is exactly the
failure mode `lean` mode's "skip unless a trigger fires" is supposed to avoid in the other direction.

**So the trigger fired for the wrong reason.** It should have fired on new capability. It fired on a
test file doing what two merged test files already do.

## The defect, named precisely

The clause uses **one subject for a property that has two different scopes**. The property worth
guarding is *"the production artifact acquires no I/O capability"* — that is scoped to production
code and its runtime closure. The property `A10` guards is *"the blast radius stays in three named
files"* — that is scoped to the whole diff. Those are both good clauses. Welding them onto one
subject makes one of them wrong whichever subject is chosen, and that is the entire dispute.

## The repair — falsifiable, mechanical, and it still discriminates

Proposed replacement for `## Security / NFR triggers` → *"Security: not triggered. Firing threshold"*.
Three clauses, each with its own stated subject:

> **(a) Runtime dependency.** Fires if `package.json` gains a `dependencies` key, or if
> `package.json` / `package-lock.json` is touched at all by the diff.
> *(check: `git diff --numstat <base> HEAD -- package.json package-lock.json` is non-empty, or
> `jq 'has("dependencies")' package.json` is `true`.)*
>
> **(b) Production capability.** Fires if **any non-`.test.ts` file under `src/`** — the delivered
> module or any module in its runtime closure — imports a Node builtin, reads `process.`, or calls
> `spawn`/`exec`/`fetch`/`eval`/`new Function`.
> *(check: `grep -rlE 'from "node:' src/ | grep -v '\.test\.ts'` is empty. Today it is empty across
> 47 files — a real invariant with a real baseline of zero.)*
>
> **(c) Test-lane capability BEYOND existing precedent.** Fires if a **test** file added or changed
> by the diff introduces a capability the lane does not already hold: **network**, a **filesystem
> write outside a temp dir**, or a **new `child_process` spawn**. Read-only `node:fs` over the
> repository's own source is **explicit precedent** (`src/san.test.ts`, `src/history-pane.nfr.test.ts`)
> and does **not** fire.
>
> **(d) Blast radius.** Fires if the diff touches any file under `src/` other than the module, its
> test file and the named probe-root line. *(This is `A10` and is unchanged.)*

**Applied to `ABC-041` as delivered, this threshold does not fire on any of the four** — and it would
have fired loudly on the things that should route a change here: a runtime dep, a `process.env` read
in the seam, a spawn in the test lane. That is what "still discriminates" means.

## What would have to be true for it to fire, so the next ticket inherits a live threshold

`ABC-042` is the next pull and it is where clause (b) stops being free. `ABC-042` **reads argv,
resolves `random`, names `process.stdout`, and spawns** (the Orchestrator's own decision note calls it
"the heaviest either epic adds, because it **spawns**"). Under the repaired wording, `ABC-042` fires
(b) and (c) on the first line it writes — correctly, and by design rather than by accident.
**`ABC-042` is where `src/`'s zero-production-Node-builtin invariant ends, and it should be a
deliberate, reviewed crossing rather than a surprise.** That is worth writing into `ABC-042`'s own
trigger section before it is pulled.

## The process gap this exposed, which is bigger than the wording

`ABC-041`'s threshold says what fires. **It does not say who decides when the reading is disputed** —
and on a disputed reading the implementer is structurally the wrong decider, because the answer
determines whether the implementer's work is reviewed. Recommended addition to the Definition of
Ready's security/NFR item, one line: *a trigger's firing condition must be decidable without
judgement; if a delivered diff makes it arguable, it fires and the gate resolves it.* A gate that
runs and finds nothing costs one hop. A gate that is skipped on the gated party's own construction
costs whatever it would have found.

## Ownership

- **The wording of `ABC-041`'s threshold, and the template for `EPIC-006`'s remaining tickets:
  BA/PM.** BA/PM cuts tickets and writes the trigger sections; the Engineer's `A4` re-wording gap
  (`GAP 3`) is already queued to the same owner, so this rides with it. **`ABC-041`'s own page is not
  edited on this branch** — no criterion was waived and none is rewritten by a gate.
- **The `src/` zero-production-Node-builtin invariant, if it is to become a guard rather than a
  ticket-local clause: Architect/Design.** It is measurably true today (47 files, 0 breaches), it is
  the property clause (b) encodes, and `ABC-042` is the hop that breaks it. Whether it becomes an
  `ADR-0011`-style declared guard is Architect/Design's, not mine and not this ticket's.
- **The Definition-of-Ready line about who decides a disputed trigger: BA/PM**, since DoR item 6 is
  theirs to score.

Recorded as a `claim`, not a `finding` — `AGENTS.md` § Role / workflow files: **no `finding` is
admissible on this install**, and I did not invent a stamp. The two measurements it rests on (0
production files with Node builtins; 2 pre-existing test files with them) are mechanical and are
reproducible from the greps quoted above.
