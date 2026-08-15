---
id: 20260815T220000Z-security-nfr-decision-e3-accepted-and-v222-does-not-require-more-b53d4f16
kind: decision
by: security-nfr
at: 2026-08-15T22:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - E2
  - E3
  - A9
  - A12
  - V2.2.2
  - ADR-0011
  - src/history.ts
supersedes: 
---

# RULING — `E3`: I **ACCEPT** the ruled scope. `V2.2.2 [L1]` is **MET** and does not require more on this ticket.

`E3` is mine to answer and it is the one open item on this ticket with my name in the owner column.
QE confirmed it live with `MP10`. **I rebuilt `MP10` rather than accept it**, because accepting a
confirmation of my own open item is the one place I am least able to see my own bias.

## Reproduced at my own hand

A second, unvalidated `process.argv` read placed in the **merged** module `src/history.ts`:

```ts
const AMBIENT_TRACE = process.argv.slice(2).includes("--trace");
if (AMBIENT_TRACE) process.stderr.write("trace on\n");
```

```
FULL suite                                  856 passed (856)  -> SURVIVES
node src/cli.ts --trace                     exit 1, and stderr carries "trace on"
node src/cli.ts --colour white --trace      exit 1, and stderr carries "trace on"
```

**The hole is live, and it is slightly worse than "a second read exists": the second path fires on
the REJECTION path too**, so a build can act on an argument the resolver has just refused. QE's
statement of it is accurate and I confirm it by construction, not by repetition.

## Do I accept the ruled scope? **Yes**, and here is the reasoning rather than the deference

**1. The control `V2.2.2` asks for is present and enforced on the surface this ticket delivers.** The
row asks that validation be enforced at a trusted layer and not relied on elsewhere. On the delivered
modules the resolver is the exclusive validator, and the instrument is now three assertions deep;
QE killed ten acquisition and branch spellings against it, including `MP8` — one read, but a branch
after the resolver returned. **What `MP10` demonstrates is a limit of the REGRESSION GUARD's reach,
not a failure of the control.**

**2. There is no live instance, measured on this tree, not inherited.** All 18 merged production
modules: **zero** occurrences of `process.argv`. The exclusive-validator property is true of the
whole tree today; what is missing is a guard that would keep it true tomorrow in files this ticket
does not deliver.

**3. Widening `A9` to the tree is measurably wrong, and I checked the claim rather than taking it.**
The merged modules that name `process.` at all:

```
src/frame.ts        process.env, process.stdout
src/glyph-mode.ts   process.env, process.stdout
src/perft-bench.ts  process.arch, process.hrtime, process.platform, process.version
src/render.ts       process.env
src/status-panel.ts process.env
src/turn-loop.ts    process.stdout
```

A whole-tree `A9` reds on six merged modules on the day it is written. Architect/Design's ruling that
the scope is **right** is correct on the evidence, not merely authoritative.

**4. Widening would not close `E3` anyway, and that is the part that decides it.** `A9`(2) is
asserted **entirely textually**. A second read introduced by a loader, a `--require` hook or a
dependency is invisible to the row at any scope. **A wider textual net does not catch a non-textual
fish.** Architect/Design says exactly this and it is the strongest thing in their note.

**5. `A12` bars the diff.** Reaching into merged modules to add a guard would breach the fence that
makes the rest of this review checkable.

## Does `V2.2.2` require more? **No — and I am saying where I would have said yes**

I would require more if any of these held. I checked all four and none does:

- a merged production module already read `process.argv` (**zero**, measured);
- the delivered resolver could be bypassed on the delivered surface (**no** — three independent rows,
  twenty-one mutants across two hops, my own `M4` refuted at the gate);
- the second-path harm were reachable by input rather than by an edit (**no** — `MP10` is a source
  edit to a merged module, which is a committer, not an attacker, and this is a local-only CLI under
  `ADR-0007` with no network, no filesystem and no dependencies);
- there were an in-suite instrument available that closes it (**no** — the only closing instrument is
  behavioural, and a behavioural argv-provenance test is a new spawn per case, on a ticket already
  breaching `N8-LANE` at 2.00x. **Buying a `V2.2.2` regression guard with more children would deepen
  `G1` to close a LOW.** I will not recommend that.)

## Therefore

> **`E3`: ACCEPTED as a LOW residual with the ruled scope intact. `V2.2.2 [L1]` is MET on the
> delivered artifact. Owner stays Security/NFR — me — and the item stays OPEN as a standing
> reading, not as a fix owed by `ABC-042`.**

**The trigger, stated so it can fire.** The day **any** merged production module acquires
`process.argv`, the exclusive-validator property stops being a property of two new files and becomes
a tree-wide invariant — and at that moment a tree-wide guard is owed and `A9`'s scope ruling expires.
That is the same trigger Architect/Design named for `E2`, and I am adopting it verbatim rather than
inventing a second one, so there is one trigger and not two that can disagree. **It fires on a
ticket, and the ticket is where it will be seen.**
