---
id: 20260814T172802Z-architect-design-decision-rejection-channel-rule-5c012e04
kind: decision
by: architect-design
at: 2026-08-14T17:28:02Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - A5
  - A6
  - A7
  - A8
  - A9
  - EPIC-002
  - ADR-0011
  - src/frame.ts
  - src/glyph-mode.ts
  - src/history-pane.nfr.test.ts
supersedes: 
---

# RULING 1 — the rejection channel: the uniqueness rule is ADOPTED, the channel stays the engineer's, and "the emitted stream" is STDOUT

> **Hand-authored `decision`, not a `finding`.** No `finding` kind is admissible on this install
> (`AGENTS.md` § "Role / workflow files"). Every figure below was measured by `grep`/`node` at HEAD
> (`eefc217`); nothing under `src/` was written.

`A6` flags this *"for Architect/Design, not decided here"*. It is decided here, in four parts. Parts
1–3 need no criterion change. **Part 4 does, and its owner is BA/PM.**

## 1. The uniqueness rule is ADOPTED, in the corrected form the ticket already uses for stdout

> **The entry point is the only module that may acquire `process.stderr` as a WRITABLE HANDLE, and
> it may only write the rejection message through it. No module below the entry point acquires an
> I/O handle or writes — on either channel.**

This is `## The one correction this ticket makes to the audit's proposed rule`, one token wider. It
is adopted for the same reason and it needs **no ADR**: it is a restatement of what merged code
already does, which is the status the architecture audit gave the stdout sentence
(`.grugops/context/audit-architecture/notes/…stdout-hazard-already-contained…`, *"This does not need
an ADR … Writing it a fourth time would be ceremony"*).

**Measured, so the "restatement" claim is not an assertion.** `process.stderr` appears **once** in
the whole repository — `src/glyph-mode.test.ts:130` (`vi.spyOn(process.stderr, "write")`), a test
file. **Zero of the 18 production modules name it.** `console.error` appears **zero** times in
executable code (the one hit, `src/history-pane.nfr.test.ts:580`, is a comment). So the rule forbids
nothing that exists.

**The CHANNEL CHOICE stays the engineer's, exactly as `A6` says.** I am ruling the fence, not the
side of it. Both choices are fully specified by parts 2–4, so nothing is left to infer.

## 2. `process.stderr` is OUTSIDE `A9`'s first clause and INSIDE its second — which is already the right answer

`A9` is two clauses and they have different reach:

| clause, as worded | reaches `process.stderr`? |
|---|---|
| *"the entry point is the only **new** file containing `process.stdout`"* | **NO** — it names one literal token, and `process.stderr` is a different token |
| *"no other new module contains `process.` at all"* | **YES** — `process.stderr` is a `process.` |

**So `A9` as worded already delivers the rule in part 1 for every new module, and already permits it
in the entry point.** The resolver may not name `process.stderr`; the entry point may. No row is
added and no row is reworded for this. That is the answer to *"inside or outside that sentence as
worded"*: **outside the first, inside the second, and the pair is correct.**

**`A9`'s scope word is nevertheless wrong in a way that bites — see the criterion-changes note.**
`A9` says *"new **module**"* after saying *"new **file**"*, and the merged precedent `A1` cites by
name uses `process.execPath` to spawn (`src/history-pane.nfr.test.ts:582`). Under the widest reading
of *"module"* the new test file breaks `A9` clause (ii) on every build that satisfies `A1`. **Ruled:
`A9`'s scope is PRODUCTION modules — `ADR-0011` clause 1's expression, `.ts` under `src/` that is not
a `.test.ts`.** That is the only reading under which `A9` is satisfiable, and it is the reading
clause 1 already supplies, so no new definition is invented.

## 3. `A7`/`A8`'s "the emitted stream" means the child's STDOUT — and on `A7`'s own Given the readings do not differ at all

**The tension the subtask names dissolves once the citation is followed to its source.** `A7`'s
phrase traces through `src/frame.ts:118` — *"epic acceptance `2a` asserts zero of those over the
WHOLE emitted stream"* — to `EPIC-002` `#2a`, which measured says something narrower:

> `plans/epics/EPIC-002-terminal-board-and-game-loop.md:133-134` — *"**then** the number of code
> points above `U+007F` in the **emitted FRAME** is exactly **0**"*

**The authoritative row is FRAME-scoped.** *"The whole emitted stream"* is a widening introduced by a
docblock paraphrase and inherited into `A7`. Three readings are therefore on the table — frame,
stdout, both channels — and:

- **On `A7`'s own Given they coincide.** `A7`'s Given is *"stdout is a pipe and **no flags**"* — the
  success path, where the process writes one frame to stdout and **nothing at all to stderr**. An
  empty stream carries zero code points above `U+007F` under any reading. **`A7`'s verdict is
  identical under all three readings and distinguishes no build.**
- **`A8` forces the choice, and it forces STDOUT.** A both-channels reading means capturing two pipes
  and merging them; **two pipes have no defined interleaving**, so `A8`'s *"ends with exactly one
  `\n` after the last row"* would be non-deterministic — a criterion that can flake is not
  testable-and-measurable and would not have passed DoR item 4. The stdout reading is the only
  implementable one.

**RULED: in `A7` and `A8`, "the emitted stream" is the child's stdout.** No criterion change is
required for either row.

## 4. The ASCII property does NOT extend to the rejection message, and the rejection message does NOT go through the frame path

Two consequences that the engineer would otherwise have to guess.

**(a) The rejection message is not glyph-rendered and is not ASCII-filtered.** `EPIC-002` `#2a` is a
property of a *frame*, and `A5`/`A6` require **zero frame rows** on the rejection paths — so there is
no frame for the property to be about. Security bar 2 already holds the real safety property there
(*"zero C0 control characters and zero `\x1b`"*) and deliberately does **not** ban code points above
`U+007F`; that asymmetry is correct and must not be "fixed". Forcing a rejection message through an
ASCII filter would turn a user's `--colour ♞` into `--colour ?` and corrupt the one diagnostic `A6`
exists to give.

**(b) Security bar 2's FIRST arm is architecturally unavailable to the rejection message, so its
second arm is the only one that can hold.** Measured: `sanitize` is **module-private** in
`src/frame.ts:123` and is reachable only through the exported `assembleFrame` (`:194`). Routing the
usage message through it therefore means composing a frame — which emits frame rows (`A5`/`A6`
forbid), and makes `beginFrameSession`'s call count path-dependent (`A8` requires **exactly once**).
**So the entry point carries its own byte filter for the echoed argument.** This is a structural
ruling, not a Security verdict — whether bar 2 is `MET` stays Security/NFR's.

This is a restatement rather than a new constraint, which is the strongest form it can take:
**`A5` already requires `selectGlyphMode` to be called 0 times on a rejection**, so the rejection
message was already off the glyph path and therefore off the frame path. The two rows agree.

## What a build must assert — the one thing this ruling CHANGES

`A5` and `A6` say *"zero frame rows are written"* and **name no channel**. The moment the channel is
the engineer's, test note 4's failure mode — *"a build that prints the board and **then**
complains"* — is evaded by a build that prints the board to the **other** channel. A zero-rows
assertion taken on one channel passes that build.

> **RULED: `A5`'s and `A6`'s "zero frame rows" are asserted over stdout AND stderr, unioned.**
> `A7`/`A8`'s "emitted stream" is stdout; `A5`/`A6`'s "zero frame rows" is both. The asymmetry is
> deliberate: a positive property about ordered bytes needs one ordered channel, an absence property
> needs every channel that exists.

**This is a wording change to two criteria and its owner is BA/PM, not me and not the engineer.** It
is collected with the others in the criterion-changes note.
