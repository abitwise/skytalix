---
kind: adr
---
# ADR-0013: No placeholder opponent ships in `src/` — `ADR-0009` clause 9c's scope, and what the composition root may NOT default

## Status

**accepted** — 2026-08-18 by Architect/Design at task `design-p0-chain-rulings-2026-08-18`, on the
question `plans/tickets/ABC-043-the-live-session.md` § "The named decision this ticket cannot make
for itself" states and assigns to this role **by name**. BA/PM declined to rule it and said so; this
is that ruling.

**Signed under `memory-bank/60-progress.md` § "Standing directive — who decides" (owner,
2026-08-03).** No target moves, no level is set, nothing is measured, and **zero production lines**
are added — `ADR-0009`'s own accepted test, met. **The asymmetry matters and is stated up front: the
answer this ADR gives is the one Architect/Design HAS the authority to give.** The opposite answer
would decide what the shipped product promises a human, and that is the owner's under the same
directive's own hedge. See clause 4.

**`context.human_admission` is `off` and no `finding` is admissible on this install** (`AGENTS.md`).
That governs note kinds and gate stamps; it does not govern an ADR's `Status` line, and it has not
governed one since 2026-08-03.

## Context

### The question, in the ticket's words

> **Does the composition root supply a default opponent before `EPIC-004` lands?**

The Factory Coach's ruling presumes **yes** — *"even if the opponent is a stub that plays the first
legal move"*. `ADR-0009` clause 9c and `src/turn-loop.ts:45-47` say the opposite **for a module**:
*"a `src/` stub module would be production code that is dead the day the real parser and engine
land"*, which is why both merged stubs live in `src/turn-loop.test.ts`. The ticket then names the
narrow question precisely, and it is the one ruled here: **is a one-line default inside a
non-exporting entry point — which dies in one line the day `EPIC-004` lands, and which no module can
import — the same thing clause 9c forbids?**

### What is merged, read at source at `main` `3054ee0`

- **`src/cli.ts` exports nothing.** Its own header: *"IT EXPORTS NOTHING (`ADR-0011` clause 4,
  `A2`). Nothing can import a binding from it… Everything that could be unit-tested was moved OUT,
  into `src/cli-options.ts`; what is left is composition, and composition is proved by running the
  command as a child (`A1`)."* So the ticket's premise is **true**: a default written there is not a
  module and no module can import it.
- **`runTurnLoop` cannot be called without an engine.** `TurnLoopOptions.engine` is
  `readonly engine: EngineSeam` at `src/turn-loop.ts:150` — not optional. So the question is not
  cosmetic: with no `EngineSeam` there is no session at all, which is why `ABC-043` names
  *"AN `EngineSeam` DOES NOT EXIST"* as **the real blocker**.
- **`src/turn-loop.ts` has 0 production importers**, and both merged doubles — the coordinate reader
  and the seeded engine — are local to `src/turn-loop.test.ts`, exactly as clause 9c requires.
- **The entry point's test surface is a child process.** `ABC-043` inherits `ABC-042`'s test file
  and `N8-LANE` (**≤ 650 ms CPU**), and its own test note 5 caps the two tickets' **total spawn
  count in single digits**.

### The two readings that had to be separated before anything could be ruled

1. **A conformance reading** — does clause 9c's prohibition cover this container? That is what the
   ticket asks, and it is Architect/Design's.
2. **A product reading** — may the delivered `npm run chess` play a human against a placeholder? That
   is a different question wearing the same sentence, and it is **not** Architect/Design's.

Answering (1) without noticing (2) is how a design ruling ends up shipping a feature nobody cut.

## Decision

### Clause 1 — the ruling

**NO. Before `EPIC-004` lands, the composition root may not supply a default opponent** — not as a
`src/` module, not as an inline one-line `EngineSeam` literal inside `src/cli.ts`, and not behind a
flag. `ABC-043` waits for a real `EngineSeam`, which is what its own `## Dependencies` already says.

### Clause 2 — clause 9c does NOT decide this by its letter, and saying so is part of the ruling

`ADR-0009` clause 9c's subject is *"a test double for **that seam**"* — `ABC-019`'s render seam — and
the thing it forbids is *"a `src/` **stub module**"*. A non-exported arrow function inside a file
that exports nothing is **not a module**, and the lingering mechanism 9c names (coding rule 12: dead
code is flagged, not deleted, so it lingers) bites a one-liner far less than it bites a module.
**Reading 9c as already covering this would be reading it as unfalsifiable**, which is the failure
this project's ADRs are written to avoid.

**So clause 9c is EXTENDED here, by clause 3, rather than "applied".** The extension lives in this
file; `ADR-0009` is not re-opened and none of its clauses 1–8, 9a, 9b or 9d–9f is touched.

### Clause 3 — the rule this ADR adds, and its discriminator: WHO CAN EXERCISE IT

**Placeholder behaviour for an unbuilt module may not ship in `src/` at all.** The container is not
the test. The test is who can run it:

- **Exercised only by tests** → it is a **test double**, and `ADR-0009` clause 9c binds it: it lives
  in a test file. Unchanged, and this is the merged precedent (`src/turn-loop.test.ts`,
  `src/frame.test.ts`).
- **Exercisable by a human running the delivered product** → it is **not a stub at all**. It is an
  **undelivered feature shipped early**, and it needs a cut ticket, an acceptance criterion and the
  owner — never a conformance ruling from this role.

A default opponent inside `src/cli.ts` is squarely in the second class: the human who types
`npm run chess` plays **against it**. Nothing about the one-line container changes that; it changes
only the lingering cost and the import surface, which were never the reason.

### Clause 4 — why the answer is NO rather than "ask the owner"

The two are not the same and the difference is not procedural.

**A YES is not mine to give.** It would decide that the shipped product plays a human against a
placeholder — *"what the product promises a user"*, which the owner's who-decides directive keeps
with him by name. **A NO is mine to give**, because it grants nothing, ships nothing and changes no
promise: it leaves the product exactly as `ABC-042` delivered it and leaves `ABC-043` waiting on the
dependency it already declares.

**The door is not nailed shut, and that is deliberate.** The owner may license a placeholder
opponent as a product decision. If he does, it arrives as a **cut ticket with criteria** — what it
plays, how a human is told they are not playing a real engine, and when it is removed — not as a line
smuggled in under a design ruling. **This ADR is superseded by such a licence, not violated by it.**

### Clause 5 — three reasons that hold on the design merits alone, so the ruling does not rest only on authority

Each is independent; any one of them carries the NO.

**(a) Clause 9c's *ratio* reaches it even though its letter does not.** The reason 9c gives is
dead-on-arrival production code that rule 12 flags rather than deletes, so it lingers. A one-liner
lingers less than a module — and it lingers in the **one file the entire product's composition lives
in**, which is the worst place in this repo for a line whose meaning is "temporary".

**(b) It is untestable where it would live, and the price is already budgeted elsewhere.**
`src/cli.ts` exports nothing, so behaviour placed there is provable **only** by spawning the process.
`ABC-043` shares `ABC-042`'s test file, inherits `N8-LANE`'s **≤ 650 ms CPU**, and its own test note
5 caps the combined spawn count in single digits. A default opponent is therefore either **asserted
with spawns the budget cannot spare**, or **shipped unasserted**. Both are worse than waiting.

**(c) Coding rules 5 and 7 — only requested features, no unrequested flexibility.** No cut ticket
carries a criterion that a placeholder opponent satisfies. `ABC-043` `A1` requires `runTurnLoop`
called once with an `EngineSeam` and **no cast and no adapter**; a real seam satisfies it and a
placeholder is not required by it.

### Clause 6 — schedule independence, written so it can be checked rather than trusted

**`ABC-078` is named in none of clauses 1–5, and the ruling would be identical if it did not exist.**
The routing brief for this hop warned in advance that `ABC-078` merging would make a default opponent
unnecessary in practice and that the convenience must not shape the answer. It did not: what
`ABC-078` changes is **who waits and for how long**, not what is permitted. Had `EPIC-004` been a
year away, the answer would still be NO and `ABC-043` would still be blocked — by the absence of an
engine, which is a fact about the product, not about this ADR.

### Clause 7 — what this ADR deliberately does NOT rule

- **It does not rule `ABC-043`'s `A5`.** That criterion needs an `EngineSeam` that **throws** and one
  that returns an illegal move, asserted *"through the real entry point rather than through a stub
  harness"* — and `src/cli.ts` exports nothing to inject through. Whether `A5` is satisfiable as
  written is a **criterion question, BA/PM's**, and it is flagged in this hop's notes rather than
  answered here. **It is not a licence to inject a placeholder**: an injectable fault seam and a
  default opponent are different objects.
- **It does not rule `EPIC-004`'s decomposition, its spike, or `NFR-005`'s provisional depth-7
  level.**
- **It does not move `ABC-043`'s DoR score or its column.** Both are other roles'.

## Alternatives

**A. Read 9c literally and permit the one-liner — the Factory Coach's presumption. REJECTED.** The
literal reading is *correct as far as it goes* (clause 2 concedes it), and it still loses: the
container was never the reason, and the permission it would grant is a product decision this role
cannot make (clause 4). It also fails clause 5(b) on cost alone.

**B. Rule 9c inapplicable and stay silent. REJECTED.** It leaves `ABC-043`'s DoR item open, hands the
same question to the next hop, and invites the literal reading to win by default at a moment when
someone is under schedule pressure. The question is a **standing conformance question that will be
asked again**; silence is the one answer guaranteed to cost twice.

**C. Permit it behind a hidden option (`--stub-engine`). REJECTED, three ways.** It is unrequested
flexibility (rule 7); a new CLI option is a product surface `ABC-042` explicitly fenced; and it
**still ships the placeholder** — it only makes reaching it a keystroke longer.

**D. Put the default in a test file and have `src/cli.ts` import it. REJECTED.** Production importing
a `.test.ts` inverts the dependency, puts a test file on the product's composition path, and defeats
every census instrument that partitions `src/` by the `.test.ts` suffix (`ADR-0011` clause 1,
`src/cli.test.ts:51`). This is the *worst* option and it is recorded because it looks like a
compromise.

## Consequences

- **`ABC-043` stays blocked on a real `EngineSeam`.** Its blocker is discharged by `EPIC-004`
  delivering one — `ABC-078` is the ticket in flight — and **not** by this ruling. No date moves
  because of this ADR; the ticket's own `## Dependencies` already said four merges stand in front of
  it.
- **Zero production lines.** `plans/nfr-catalog.md` is **not edited**: no target, bar, level or
  verification instrument moves, and a row for a decision that measures nothing is the gold-plating
  that catalog refuses.
- **`ADR-0009` gains a scope reading it did not have, and its file is not re-opened.** One pointer
  line is added under clause 9c so a reader of 9c finds this ADR; the clause's own words are
  byte-unchanged.
- **`src/turn-loop.ts:45-47`'s comment is now backed by a ruling that covers the entry point too.**
  The comment is **not edited** — it is accurate as written, and this ADR adds nothing it must say.
- **What would falsify this ADR**, owed by the role that signs it:
  - **the owner licensing a placeholder opponent** — then this is *superseded*, and clause 4 says so
    in advance;
  - **clause 5(b)** — if `src/cli.ts` ever gains an export that makes an injected engine provable
    without a spawn, that reason is gone (clauses 4 and 5(a),(c) stand alone);
  - **clause 3's discriminator** — if a delivered `src/` default can be shown unreachable by **any**
    invocation of `npm run chess`, it is not in the second class and this ADR does not reach it. That
    is a measurement, not an argument.

## Rollback

- **To un-rule it before anything is built:** delete this file. **No code depends on it, because its
  whole content is that no code exists.**
- **To reverse it after `EPIC-004` lands:** there is nothing to reverse — the question stops being
  askable the day a real `EngineSeam` is wired.
- **The asymmetry that decided the tie.** Waiting is fully reversible: the day the owner or
  `EPIC-004` says otherwise, one line changes. Shipping is not: a human who has already played
  `npm run chess` against a first-legal-move placeholder has had that experience, and no later commit
  takes it back. **When one direction is reversible and the other is not, the ruling goes to the
  reversible one.**
