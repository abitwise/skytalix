---
id: 20260814T172700Z-security-nfr-decision-592c0a9e
kind: decision
by: security-nfr
at: 2026-08-14T17:27:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/history-pane.nfr.test.ts
  - src/glyph-mode.nfr.test.ts
  - plans/board.md
supersedes: 
---

# RULING 1 — "the delivered diff" in bars 1 and 3 and in the firing threshold means the delivered PRODUCTION modules

This is the ruling the parent `claim` asked for and did not make. **The claim is right that the
literal wording collides and wrong that the reading was undetermined** — the ticket's own page
supplies the method. I supersede nothing; this is my note.

## The ruling

> **Bar 1, bar 3 and the firing threshold's builtin clause are scoped to the delivered PRODUCTION
> modules — the entry point and the argv resolver. They do not reach the delivered test file.**

Under this reading `A1` and bar 1 are **jointly satisfiable**, the production invariant is preserved
**exactly** (0 of 18 production files import anything non-relative — measured, note
`…observation-85881f7a`), and the merged precedent stays legal.

## Why — four grounds, all internal to the page or measured

**1. The ticket already made this exact correction, and stated its method.**
`## The one correction this ticket makes to the audit's proposed rule` rejects a criterion written
word-for-word from the audit's sentence, on the ground that *"as literally worded that sentence is
already false on `main`, and a criterion written from it word for word would fail on green code."*
Its method is named in the next line: *"Measured 2026-08-13 by `grep` over **non-`.test.ts` files**
under `src/`."* **The ticket's own production-invariant measurement excludes test files.** Applying
the ticket's own stated method to bar 1 yields production scope. I am not importing an outside
principle; I am applying the page's.

**2. A reading that outlaws merged green code is the wrong reading — and this one does.**
I ran both merged `child_process` files at HEAD: 14 tests, 2 files, **all green**. The whole-diff
reading makes `src/history-pane.nfr.test.ts:23` illegal — the file the ticket cites **by name** in
`## Test notes` 1 as *"the merged precedent for spawning here."* A ticket cannot in one section cite
a precedent that another section outlaws. The ticket itself supplies the disposal rule for that
shape.

**3. Bar 1's stated intent is untouched by a test-file spawn, and the whole-diff reading inverts it.**
Bar 1's intent is *"Arguments are data, never code."* Argv reaches only the entry point and the
resolver. The merged precedent calls `spawnSync(process.execPath, [<argv array>], …)` — no shell, no
string command — which is the parameterised-OS-call form **ASVS V1.2.5 [L1] requires**, and
`glyph-mode.nfr.test.ts` imports `node:child_process` **only to spy that `glyph-mode.ts` never calls
it**. The whole-diff reading forbids both the ASVS-preferred construct and the instrument that
proves the absence of OS calls, while permitting nothing safer in their place.

**4. The ticket already distinguishes production modules from test files in criterion text.**
`A9`: *"the entry point is the only **new** file containing `process.stdout` … and no other new
**module** contains `process.` at all."* The same distinction, in a criterion, one section above the
bars.

## The ruling does not stand alone — it comes with a positive control, or it is a hole

A scope ruling by itself leaves the one file that actually contains `child_process` **ungoverned**.
That would widen the surface, not scope it. The ruling is therefore conditional on this control,
which is the **same L1 requirement (V1.2.5) applied to the only place a shell could appear**:

> **BAR 1b (test file, new).** The delivered test file may reach `node:child_process` **only** in
> argument-array form — `spawnSync` / `spawn` / `execFileSync` with an argv **array**. **Zero**
> occurrences of `exec`, `execSync`, and **zero** occurrences of `shell:` in the delivered diff. No
> spawn argument is built by string concatenation. Asserted textually over the delivered diff.

**The cited precedent already conforms** (`history-pane.nfr.test.ts:581-591`: argv array,
`stdio` fixed, no `shell`), and the repository-wide baseline is already clean — **0 occurrences of
`shell:` and 0 call sites of `exec`/`execSync` across all 47 files**. This control costs nothing to
meet and is decidable by `grep`.

## What this ruling does NOT do

- It does **not** waive the security half. `ABC-042` declares it *"triggered, and NOT waived"* and it
  stays triggered.
- It does **not** relax the production floor. Production modules import **zero** Node builtins —
  which is strictly stronger than bar 3 and makes bar 3 redundant for production (see RULING 2).
- It does **not** license a production spawn. `eval`, `Function`, `child_process`, argv-derived
  dynamic `import(`, and any shell remain forbidden in the entry point and the resolver, without
  exception.

## Consequence the Orchestrator owns, which I may not fix myself

`plans/board.md:3` reads *"`src/`'s **0-of-47**-production-Node-builtin invariant **BREAKS** at
`ABC-042`, which spawns."* Under this ruling **the invariant does not break**: production stays at 0.
What is wrong is the sentence — the numerator is production-scoped (18) and the denominator counts
tests (47), and the measured all-files figure is 4, not 0 and not 2. **Owner: the Orchestrator**;
board text is the Orchestrator's alone and I am forbidden to edit it. This board has a recorded
history of stale row text surviving five hops and three roles, so it is named here rather than left.
