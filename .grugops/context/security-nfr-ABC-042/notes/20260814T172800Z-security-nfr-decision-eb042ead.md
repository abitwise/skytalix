---
id: 20260814T172800Z-security-nfr-decision-eb042ead
kind: decision
by: security-nfr
at: 2026-08-14T17:28:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - NFR-007
  - N8-LANE
  - src/frame.ts
  - src/glyph-mode.nfr.test.ts
  - src/perft-bench.ts
supersedes: 
---

# RULING 2 — ASVS L1 review of `ABC-042` as specified: **BLOCKED**, one L1 fail, five more required fixes

`security.asvs_level: L1`, `security.block_on: high`. Reviewed **the design as specified**, before a
line is written, because that is where this gate sits. The criteria ARE the verification instrument
at this point, and ASVS is a **verification** standard — a control that is designed but that no
criterion verifies is not verified.

**Result: `BLOCKED`.** One **high** finding (an L1 fail) and `block_on` is `high`. Every fix below is
a criteria repair, not a code change. **I did not edit the ticket — criteria repair is BA/PM's.**

---

## RF-1 — HIGH — L1 fail, **V2.2.1** — the argv allowlist is designed but never verified. THE BLOCKER.

**ASVS V2.2.1 [L1]:** *"Verify that input is validated to enforce business or functional
expectations for that input. This should either use **positive validation against an allow list** of
values, patterns, and ranges … For L1, this can focus on input which is used to make specific
business or security decisions."* Argv here selects colour, board orientation and glyph mode —
`--ascii` is the mode that strips everything above `U+007F` — so it makes both.

**The design passes. The criteria do not verify it.** `## Scope` states *"The argv surface,
complete"* and closes it with *"anything else, including `--difficulty` | rejected."* That is a
correct allowlist. But the criterion that is supposed to hold it samples **four literals**:

> *"**`A6` (an unrecognised argument never starts a game).** **Given** each of `--difficulty 3`,
> `-x`, `--colour purple` and `foo`, **then** a usage message **naming the offending argument** is
> written, the exit code is **non-zero**, and **zero** frame rows are written."*

Four points of an infinite complement is a **denylist**, which is the exact construct V2.2.1 names as
insufficient. And `## Scope`'s exclusivity sentence — *"It is the only place that reads
`process.argv`"* — lives in prose, and prose is not a criterion.

**What a build does with this, passing every criterion on the page.** A resolver that recognises a
fifth, undocumented argument — `--debug`, `--engine-path`, anything not among the four literals —
ships **green**: `A4`, `A5`, `A6` pass (its four inputs are still rejected), `A1`/`A7`/`A8` pass,
`A10` constrains files and `package.json` keys, not behaviour, and all three security bars pass. The
same build is available from the other module: nothing forbids the entry point from *also* branching
on `process.argv` after the resolver has returned, creating a second, unvalidated input path.

**Required fix (both clauses; owner BA/PM).**
- **(a) Close the accepted set.** A criterion asserting the resolver rejects the **complement** of
  the documented allowlist — a property over generated unknown tokens, not four literals. This is a
  pure function and costs **zero spawns**; `A4` already runs 1000 spawn-free evaluations, so the
  instrument exists on the page.
- **(b) Make the resolver the exclusive validator.** Extend `A9`'s own textual instrument to argv:
  the entry point is the only new production file containing `process.argv`, it occurs **exactly
  once**, and its only use is as the argument to the resolver.

**Severity is not overridden.** L1 fail → high by the role's default mapping; `block_on: high` → it
blocks. The fix is two criteria and no code, so this block is cheap to clear.

---

## RF-2 — MEDIUM — bar 2's first disjunct is UNREACHABLE by any legal build

> *"every echoed byte is **either passed through `assembleFrame`'s sanitizer**
> (`src/frame.ts:123-132`) or the message contains **zero** C0 control characters and zero `\x1b`"*

Measured at source: `src/frame.ts:123` declares `function sanitize(…)` with **no `export`**;
`frame.ts` exports 8 symbols and `sanitize` is not among them. The only public route is
`assembleFrame`, which **returns a whole frame's rows** — and `A5`/`A6` require **zero frame rows**
written on exactly these paths. Exporting `sanitize` is a change to a merged module, which `A10`
forbids (*"`src/` otherwise byte-identical"*).

So the first disjunct cannot be taken, and the bar reduces to its second disjunct in every legal
build. **The second disjunct is also the stronger one:** `plans/board.md` already records `R-A` —
C1/CSI including `U+009B` **survives `sanitize` in `unicode` mode**. Routing the usage message
through the sanitizer would be the weaker control, not the safer one.

**Required fix (owner BA/PM):** delete the `assembleFrame` disjunct rather than re-word it, and state
that the byte-level property is the operative one. *(`ABC-041`'s precedent: BA/PM **deleted** a false
purpose clause rather than re-wording it.)*

**Severity, with the stated reason for not calling it high:** an unreachable branch of a
**disjunction** does not break the bar — the surviving branch carries it. This is a clarity defect,
not a control failure. Medium.

---

## RF-3 — MEDIUM — L2 **V1.3.3** — bar 2's operative disjunct rejects every conventional build, and can pass vacuously

> *"the message contains **zero** C0 control characters and zero `\x1b` — asserted byte-level over an
> argument containing `\x1b[2J`"*

Three defects in one clause:

1. **`\n` is U+000A — a C0 control character.** Any usage message terminated by a newline, and any
   multi-line usage block, violates "the message contains zero C0" **as literally worded**. This is
   the same defect class as bar 1 vs `A1`: a criterion whose literal reading rejects the delivered
   build. It is also the wrong scoping on the merits — **the injection vector is the ARGUMENT, not
   the message frame**.
2. **No non-vacuity control.** A build whose usage message does **not** contain the argument echoes
   zero bytes, so it contains zero C0 and zero `\x1b` and **passes bar 2 trivially**. The assertion
   can pass by observing nothing. `ABC-041`'s history is exactly this: *"one [mutant] built
   specifically to prove the third line was not vacuous."*
3. **The channel is unfixed and the likeliest build lands on the unwatched one.** `A6` leaves the
   channel to the engineer (*"The channel — stdout or stderr — is the engineer's"*), and the
   repository's first entry point reaches the terminal through `console.log` without ever naming
   `process.stdout` (`src/perft-bench.ts:56-111`). A bar 2 assertion written against stdout alone is
   blind to a `console.error` build.

**Required fix (owner BA/PM):** (i) scope the byte-level assertion to **the echoed argument's
bytes**, not the whole message; (ii) add the positive control — the argument **must be present**,
asserted before asserting what it lacks; (iii) capture and assert over **both stdout and stderr** of
the child.

**Severity:** the ASVS row that covers "data passed to a potentially dangerous context is sanitized …
only allowing characters which are safe for this context" is **V1.3.3 [L2]** — terminal-escape
injection has **no L1 row** in ASVS 5.0. Bar 2 is therefore a control `ABC-042` imposes **above** the
L1 floor, which is to the ticket's credit. L2 → medium. It does not block on `block_on: high`, and I
am not inflating it to make it block.

---

## RF-4 — MEDIUM — bar 3 is written in a spelling this repository never uses, and there is a MERGED precedent that this exact defect ships a false pass

> *"**No filesystem and no network.** Zero `fs`, `net`, `http`, `dns` imports in the delivered diff."*

Measured: **0 of 47** files in this repository use a bare builtin specifier. Every builtin is written
`node:`-prefixed, and the sub-path spelling `node:fs/promises` is in live use
(`src/glyph-mode.nfr.test.ts:53,64`). **A build importing `node:fs` satisfies bar 3 exactly as
worded.**

**This is not hypothetical here — it is a merged, measured, in-repo defect of the same shape.**
`src/glyph-mode.nfr.test.ts:52-55` records QE's finding verbatim: *"the guard named `node:fs` and
`node:child_process` but not `node:fs/promises`, which is a DIFFERENT module specifier and was
therefore unspied. A mutant reading `/etc/locale.conf` through `node:fs/promises` **passed all 271
tests** while the synchronous twin of the same read died here."*

Also missing: `https`, `tls`, `dgram`; and — the one an import-only grep can never see —
**`fetch` is a bare global on Node 22 and needs no import at all**, as are `WebSocket` and
`XMLHttpRequest`. A build can reach the network with zero import statements. (Baseline measured:
0 occurrences of all three across `src/`.)

**Required fix (owner BA/PM):** state the specifier **grammar**, not a word list — e.g.
`/^(node:)?(fs|net|http|https|tls|dns|dgram)(\/|$)/` matched over **both static and dynamic** import
specifiers — and add the no-import network globals `fetch` / `WebSocket` / `XMLHttpRequest` as
forbidden tokens.

**Note on redundancy, so the fix is not over-built:** under RULING 1 the production floor is **zero
Node builtins**, which strictly implies bar 3 for the entry point and resolver. Bar 3's only real
work is on the **test file** — where it must *permit* `node:child_process` (RULING 1's BAR 1b) and
probably `node:fs`, since `A10` requires `package.json` asserted key by key against `HEAD`. Bar 3 as
literally worded forbids the test file's `node:fs` while `A10` all but requires it: **the same scope
defect as bar 1, in a second bar.**

---

## RF-5 — MEDIUM — RULING 1 must be written into the ticket, not left in a context note

Bar 1 and the firing threshold do not state their scope. I ruled it, but **a ruling that lives only
in a context note gets re-derived by the next hop** — `AGENTS.md` § "Role / workflow files" exists as
a callout precisely because *"eight consecutive hops re-derived it from scratch before doing any
work."*

**Required fix (owner BA/PM):** write the production scope into bar 1 and into the firing threshold's
builtin clause, and add **BAR 1b** (argument-array form only; zero `exec`/`execSync`; zero `shell:`)
verbatim from `…decision-592c0a9e`. Two sentences.

---

## RF-6 — LOW — `plans/board.md:3`'s "0-of-47 … invariant BREAKS" sentence is false under RULING 1

Production stays at 0; the numerator is production-scoped (18) and the denominator counts tests (47);
the measured all-files figure is **4**, not 0 and not 2. **Owner: the Orchestrator** — board text is
the Orchestrator's alone and I am forbidden to edit it. Detail in `…decision-592c0a9e`.

---

## Bars 2 and 3, answered directly as asked: is each measurable **as worded**?

| bar | measurable as worded? | how it must be asserted |
|---|---|---|
| **1** (args are data, never code) | **No** — undecidable until "the delivered diff" is scoped. **Yes** after RULING 1. | `grep` over the two production modules for `eval`, `Function`, `child_process`, argv-derived `import(`, any shell; plus BAR 1b over the test file. |
| **2** (nothing unsanitised reaches the terminal) | **No.** Disjunct 1 unreachable (RF-2); disjunct 2 rejects any newline-terminated message and can pass vacuously (RF-3). | Spawn once with an argv containing a literal `\x1b[2J`; capture **stdout and stderr**; assert (i) the argument is **present** in the output, (ii) its echoed bytes contain no C0, no `U+007F` and no `\x1b`, (iii) zero frame rows. Non-vacuity first, absence second. |
| **3** (no fs, no net) | **No** — the listed spellings match nothing this repository writes, and `fetch` needs no import (RF-4). | Specifier-grammar match over static **and** dynamic imports in the production modules (where the floor is already zero builtins), plus the three no-import network globals. |

## Verdict

**`BLOCKED`** on **RF-1** (high, L1 `V2.2.1`, `block_on: high`). RF-2 through RF-6 are required fixes
at medium/low that do not themselves block. **No code is owed by any of this** — six criteria repairs,
five owned by BA/PM and one by the Orchestrator. `ABC-042` does not leave `Ready for Dev` until
RF-1(a) and RF-1(b) land.
