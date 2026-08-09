---
id: 20260809T102300Z-security-nfr-decision-0bf12840
kind: decision
by: security-nfr
at: 2026-08-09T10:23:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-014
  - ABC-015
  - ABC-016
  - ABC-017
  - ABC-019
  - EPIC-002
  - EPIC-003
  - EPIC-006
  - RISK-005
  - NFR-002
  - NFR-007
  - src/frame.ts
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - 20260809T102000Z-security-nfr-observation-8f4ab4f6
  - 20260809T102100Z-security-nfr-observation-3dcd09a5
  - 20260809T102200Z-security-nfr-observation-3269919d
supersedes: 
---

# VERDICT: **PASS_WITH_RISKS**. `ABC-018` `In Security/NFR → Ready for UAT` — no required fix, five accepted risks, every one owned

`In Security/NFR` **1/2 → 0/2**. `Ready for UAT` **0/4 → 1/4**. No limit approached, no override
taken, no written reason owed for the count. This is the `In Security/NFR` exit, the one board move
this role owns. **Nothing merged and nothing deployed — a human holds both.**

Gated against **`security.asvs_level: L1`** and **`security.block_on: high`**. `compliance_regime`
is **`[]`**, so **no Compliance Officer hand-off is owed** — recorded rather than silently omitted.
**No required fix is outstanding, and no high-severity item exists to block on.**

## The standard this verdict was reached against

**Not one figure is inherited.** The Engineer measured and QE explicitly declined to re-derive, so
both bars were re-derived here on instruments written outside the repository: the escape-stripping
bar on the **emitted stream at byte level** under Node's permission model, and `NFR-002`'s two halves
across four sink definitions with two fully independent samples. Where this gate agrees with the
Engineer it says so; where it does not — the regular-file write cell, ~11% higher and unattributable
— it says that too.

**The ticket's own wording about its risk surface was decided, not ratified.** Its
`## Security / NFR triggers` claims the exposure is *"self-inflicted rather than cross-user — there
is no second user and no trust boundary in a single-player CLI game"*. **That holds, and this gate
checked it rather than quoting it**: there is no network surface, no second principal, no persisted
state and no privilege boundary anywhere in `src/`. But the sentence is **not the whole surface**,
and three things it does not name were found by measuring: the sanitizer sits in the assembler while
the **writer** emits whatever it is handed; the `mode` parameter **fails open**; and the one input
this module does not bound is the one that comes from the player. All three are below the blocking
bar, and all three are recorded with owners rather than absorbed into the ticket's sentence.

## The two questions routed to this gate BY NAME, both decided

**1 — the C1 block (`U+0080`–`U+009F`), routed by QE, which characterized it and correctly did not
decide it.** **DECIDED: the bar stays exactly as written and NO C1 strip is required — requiring one
would be theatre.** A clean unicode frame with **no supplied text at all** already carries **64
C1-range bytes**, all of them from the module's own glyph table, and **the single 8-bit CSI byte
`0x9B` is the black queen (`U+265B` = `E2 99 9B`)**. The whole adversarial C1 payload adds 5 more, so
a strip would remove 5 of 69 and leave 64. The control that makes unicode mode safe is **the terminal
being UTF-8**, which belongs to mode selection (`ABC-015`), not to sanitization. In ASCII mode — the
mode a non-UTF-8 locale selects — the frame carries **zero** bytes above `0x7F`, measured. The
residual is accepted risk 4, because `ABC-015`'s rule row 2 lets `--unicode` beat the locale and make
the mismatch constructible.

**2 — which of three "write" definitions is `NFR-002`'s row, routed by the Engineer, whose note
said in terms that the gate should pick.** **DECIDED: the row's quantity is `serialize + exactly ONE
write(2) to a real non-TTY fd`, and the bar is judged against the most expensive honest reading — the
regular file, 2.711–2.772 µs.** In-memory omits the syscall the row's own words require and is a
floor. A **fourth** sink the Engineer did not measure was added — a FIFO with a live reader, which is
`EPIC-006`'s shape, 2.285–2.317 µs — and it is recorded **beside** the row rather than as it, because
a pipe write's cost includes the reader's scheduling and is a property of the pair.

## What is MET

- **The security bar.** 21 adversarial strings × 2 glyph modes × 2 strategies, in the message region
  and in a panel row: **0 ESC bytes from supplied data, 0 C0, 0 `U+007F`, 0 code points above
  `U+007F` in ASCII mode, row count constant at 23, one write per frame (84/84), and exactly the
  module's own two sequences in place and zero in append.**
- **`NFR-002`, both halves.** Sum **0.0087–0.0088 ms against 16 ms — 0.055%, ~1,800x headroom, at
  40/120/300 plies on every sink definition, both halves flat.** `plans/nfr-catalog.md`'s write-half
  `UNKNOWN - verify` is **discharged**; **no target moved**, verified by hashing the row's `Target`
  and `Applies to` cells before and after.
- **`NFR-007`'s single-write clause**, counted rather than read.
- **`RISK-005`'s build obligation**, re-checked here rather than inherited: the mode is a required
  parameter with no default, the module's only import is a type-only one, `process.` appears in prose
  only, and every `isTTY`/`rows` read is of the injected sink.

## The five accepted risks — each with a severity, a NAMED OWNER and a place

1. **The control sits in the assembler, not in the writer.** A raw row handed to the writer emits
   1 ESC byte; the same payload through `assembleFrame` emits 0. **LOW** — no untrusted consumer
   in-process, zero runtime importers. **No change asked for**: the VALUE/SESSION split is the
   ticket's own design and matches `ABC-015`'s. **Owner: `ABC-019`**, the render trigger that will
   own the only call site.
2. **No bound on a supplied item's length.** Cold, own process: 400,000 characters costs
   14.1–15.8 ms — the whole 16 ms budget — and 1,000,000 costs 28.4–41.9 ms. **MEDIUM** (`V2.2.1` by
   analogue; not a live L1 failure, because nothing supplies this input yet). **Owner: BA/PM at
   `EPIC-003`**, which owns the input surface and will decide what a rejection message may quote
   back. Inventing a bound here is the unrequested flexibility rule 7 forbids; the **number** is
   handed forward instead.
3. **`mode` is an unchecked erased union and it fails OPEN.** `"ascii"` → 0 code points above
   `U+007F`; `"unicode"`, `"ASCII"`, `""`, `undefined`, `null`, `0` and a plain object → 34 each.
   `selectGlyphMode` fails **safe** to ASCII on ambiguity — `RISK-005`'s whole mitigation direction —
   while `assembleFrame` fails **open**. **LOW**: the only producer is `ABC-015`'s closed two-literal
   domain and there is no runtime caller. Third appearance of this class on this board, after
   `ABC-014`'s `GLYPHS[mode]` gadget and `ABC-015`'s flags half. **Owner: `EPIC-006`**, where
   `ABC-015`'s gate already placed the flags half.
4. **A forced `--unicode` on a terminal that is not UTF-8** puts 64 C1-range bytes per frame on the
   wire from the board's own glyph table, one of them 8-bit CSI. **LOW**, and **not fixable in this
   module** — see the C1 ruling. **Owner: `EPIC-006`**, which owns the flag.
5. **The message region cannot display the epic's own example rejection text.** At the real
   `W = 18`, `["no piece on that square"]` (23 characters) renders as `["", "(+1 more)"]` — the
   player is told something was withheld and **never what**. `"illegal move"` and
   `"e2e4 is illegal"` do fit. This conforms to every criterion and to `## Scope`, so it is a
   **design** gap and not a defect — and it is exactly the diagnosability shape a risk gate is
   required to look for: the message that explains a rejection is the one thing the player cannot
   read. **MEDIUM, and this severity is explicitly NOT ASVS-derived. NO ASVS DEFAULT SEVERITY WAS
   OVERRIDDEN BY THIS GATE IN EITHER DIRECTION.** **Owner: BA/PM**, place `ABC-016`/`ABC-017` (which
   set `W`) and `EPIC-003` (which writes the text).

## ASVS L1, counted at the source rather than inherited

**70 active requirements. `V16` and `V17` carry no L1 requirement at all — checked, not assumed.**
`V1.2.1` **PASS by analogue ON EVIDENCE** (output encoding for a terminal sink — this change's one
real engagement) · `V1.2.5`, `V1.3.2` **PASS ON EVIDENCE** under the permission model with three
armed positive controls · `V2.1.1` **PASS** — the ticket's `## Scope` and `## Security / NFR
triggers` *are* the documented input-validation rule, with a measurable bar · `V2.2.1` **PASS** on
the message text, with risks 2 and 3 recorded rather than waived · `V2.2.2` **PASS by analogue**
with risk 1 named · `V15.3.1` **PASS by analogue** · `V1.2.2`/`V1.2.3`/`V1.2.4`/`V1.3.1`/`V1.5.1`
**not engaged** (no HTML, JSON, SQL, WYSIWYG or XML anywhere) · `V13.4.1` **DEFERRED**, unchanged and
**not relaxed** · `V15.1.1`/`V15.2.1` **NOT MET**, the carried `high → low` override restated with
its evidence **re-checked here** (`dependencies` is `{}`, `package.json` untouched on this branch),
owner Architect/Design at `EPIC-006` · the remaining chapters **structurally N/A**. **`V7` Session
Management is N/A and is named rather than skipped because the keyword matches:**
`beginFrameSession` is a process-lifetime strategy constant, and ASVS "session" means an
authentication session with a token.

## Why this is a PASS and not a FAIL, stated rather than assumed

Under `security.block_on: high`, a **high**-severity item blocks. There is none: the one L1
requirement this change genuinely engages is met on measured evidence, and every risk above is LOW or
MEDIUM with a named owner and a place. Two of the five are not this ticket's to fix at all (4 is a
mode-selection property, 5 is a design decision about `W`), one is a call-site obligation that has no
call site yet, and two are conditions on tickets that do not exist. **Sending `ABC-018` back would
ask the Engineer to change a module that is correct against its bar.**

## What this gate did NOT do

**No production code and no test was changed.** `git diff --stat -- src/` is empty and
`src/frame.ts` still hashes `bb827f52fe537817e40020a29dfa0e6d`. **Repairing the implementation to
make this gate's own verdict come out green is not this role's, and there was nothing to repair.**
No acceptance criterion was amended — that is the `Backlog` exit. No ticket other than `ABC-018` was
touched. **UAT is DEFERRED to `EPIC-006` and explicitly NOT passed** — zero runtime importers
verified here, no `bin`/`main`/`exports`/`start`, no CLI entry point, so there is no surface a human
can exercise and a UAT pass would be a fabrication. **This gate attached no terminal and claims
none.** No `finding` was written: none is admissible on this task — there is no §14 gate here to
issue a `§14-gate#<id>` stamp and `context.human_admission` is `off`. Nothing is self-stamped and no
`index.md` / `index.jsonl` was hand-faked.

## Carried forward unchanged, and NOT discharged here

QE's two criteria-level items for BA/PM (no criterion constructs a sink whose `isTTY` or `rows` is
**absent** — the third consecutive ticket; and criterion 2 is weaker than it was ruled to be); the
per-frame `W`, handed to `ABC-016`/`ABC-017`; criterion 1's integration obligation at
`ABC-019`/`EPIC-006`; the reserved prompt row's one-sided contract, still the Orchestrator's; the
`EPIC-006`/`ADR-0007` `npx` disagreement; the two ASVS deferrals; `coverage/` tracked and stale;
`ABC-009` and `ABC-022`, displaced twice.

## Next action

The Orchestrator runs the gates on both sides and decides the merge of `ABC-018` to `main` under the
owner's standing authority — which is approval to merge work that **passed**, never to skip or soften
a gate. Deploy is not included and nothing here deploys.
