---
id: 20260812T231100Z-security-nfr-observation-nfr002-premise-re-derived-on-my-own-instruments-and-the-latency-is-real-5f2b1ad8
kind: observation
by: security-nfr
at: 2026-08-12T23:11:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0002
  - ADR-0011
  - NFR-002
  - R1
  - R4
  - A4
  - src/history-pane.ts
  - src/history-pane.nfr.test.ts
  - plans/nfr-catalog.md
supersedes:
---

# `NFR-002`'s premise RE-DERIVED on instruments I wrote — it holds, the residual hole IS latent, and the latency is BROADER than the record claims. One record count is off by one

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` **`off`**. Every cell below is a run at this hop, on throwaway out-of-tree copies
> in a **FRESH scratchpad root** created for this hop (the brief reported a cross-hop hazard on a
> shared scratchpad; the root I created was **empty on creation**, checked, and no file arrived in it
> that a command of mine did not put there).

## 1. The instruments are MINE, and that is the point

The brief required the premise re-derived on my own instruments because two prior gates corrected the
hop they were checking. **I did not run the repo's probe to answer this question.** I wrote two:

- **`myclosure.mjs`** — module-graph closure by `module.registerHooks` in a child, reporting on the
  child's **stdout** (deliberately a different channel from the repo's), different argv shape,
  written from scratch.
- **`astsweep.mjs`** — an importer sweep using the **TypeScript parser**, not a regex. It enumerates
  every module specifier in every production module and classifies it by AST node kind. **It cannot
  inherit the guard's blind spots, because it never looks at text.**

A third, `myclosure3.mjs`, is `myclosure.mjs` reporting on fd 3 — needed only to reach the one module
that corrupts a stdout channel (§4).

## 2. The closures — every figure the record turns on, reproduced

| quantity | record says | **I measured** |
|---|---|---|
| frame closure, rooted at the 5 declared producers | **11** modules, `history.ts` **absent** | **11** — `apply fen frame glyph-mode history-pane legal moves position render san status-panel`; **`history.ts` ABSENT** |
| the pane's own runtime closure | **exactly 7** | **7** — `apply fen history-pane legal moves position san` |
| `closure(frame.ts)` | **1** (imports nothing) | **1** |
| `closure(glyph-mode.ts)` | 0 deps | **1** (itself) |
| `closure(render.ts)` | 1 dep (`position.ts`) | **2** (itself + `position.ts`) |
| `closure(history-pane.ts)` / `closure(status-panel.ts)` | 6 deps each | **7** / **7** (itself + 6) |
| `perft-bench.ts` exports | **ZERO** — the only such module | **ZERO** (`grep '^export '` returns nothing) |

**My instrument is ARMED, and I proved it rather than asserting it:** rooted at `history.ts` it DOES
report `history.ts` (closure 8). A zero from a blind instrument is worth nothing.

## 3. The premise, not just the number — **PRODUCTION RUNTIME IMPORTERS = ZERO, measured 16 ways**

The record's zero rests on the regex guard. **I re-derived it by EVALUATION instead**: every
production module was made a root in its own child and its closure inspected for `history.ts`.

**15 of 16 measured directly; the 16th in §4. Result: only `history.ts` reaches `history.ts`, and
that is trivially itself as the root.** `apply fen frame gameend glyph-mode history-pane legal moves
perft position render san status-panel zobrist` — **none** evaluates `history.ts`.

**So `NFR-002`'s structural premise re-derives on my own instruments. It is MET.**

## 4. The 16th module, and my own stdout channel died exactly the way the record says the probe's did

`perft-bench.ts` runs `main()` at module scope. Rooted under **my stdout-channel** instrument it
returned:

```
ABC-006 perft harness — move-generation correctness + throughput
================================================================
```

— **the same corruption string `ADR-0011` records when it rejects form (a) of `A3`.** I did not cite
that; it happened to me. Re-run on **fd 3 with stdout discarded**, it reports cleanly:
`apply fen legal moves perft-bench perft position` — **7 modules, `history.ts` ABSENT.**

**That is `A2`'s value demonstrated from the outside: the same channel defect, on an instrument that
had never heard of it.**

## 5. `R1` (clause 2 fails OPEN) — checked against the catalog row, and there is no live instance

Clause 2 says the declared list must be *"checked by READING it against that row's `Applies to`
cell"*. I did. `NFR-002`'s cell enumerates **board + rank/file labels + status panel + bounded SAN
history pane + the fixed 2-row message region**. Mapping to the declaration:

| frame element | declared producer |
|---|---|
| board + labels | `render.ts` (and `glyph-mode.ts`, the mode the board renders through) |
| status panel | `status-panel.ts` |
| history pane | `history-pane.ts` |
| message region + assembly | `frame.ts` — holds `MESSAGE_ROWS` and `assembleFrame` |

**The five declared producers cover the cell with nothing left over.** And the complement is clean:
the five production modules NOT in the frame closure are `gameend`, `history`, `perft`,
`perft-bench`, `zobrist` — **not one is a renderer**. **So `R1` has no live instance on this tree.**
It stays a real fail-open risk with `EPIC-006` as its dated expiry; what I can add is that it is not
firing today, and that is measured rather than assumed.

## 6. THE LOAD-BEARING SAFETY CLAIM — the residual hole is LATENT. **Verified, and it is BROADER than claimed**

The brief named this as the claim I must not inherit. Measured with the **AST sweep**, so no regex
blind spot can hide inside the answer:

```
production modules parsed: 16
local module specifiers found: 44
  34  VALUE-IMPORT
  10  import-type
```

| construct | record's claim | **AST sweep** |
|---|---|---|
| bare `import "./x.ts";` anywhere in production | zero | **ZERO** |
| re-export `export … from "./x.ts"` anywhere in production | zero | **ZERO** |
| references to `history.ts` | two `import type` lines | **exactly two, both `import type`** — `history-pane.ts`, `status-panel.ts` |
| **dynamic `import(…)` of ANY local module** | *not stated* | **ZERO** |

**The claim holds. The hole is LATENT — confirmed on an instrument that does not share the guard's
grammar.**

**And it is latent in one more direction than the record states.** The record establishes latency for
the two *textual* halves (`WLAUNDER`'s re-export and the bare import). **`R4` — the two DYNAMIC forms
that the containment deliberately does not recover — is ALSO latent: there is not one dynamic import
of any local module anywhere in production `src/`.** That makes `R4`'s trigger (*"the first
production module that gains a dynamic import of any local module"*) **mechanically checkable and
currently at zero**, which is a stronger position than "accepted residual" alone. **Recorded as a
strengthening of `R4`, not a change to it — `R4` is Architect/Design's and I did not open the ADR.**

## 7. `A4`'s one production line — the only production change, and it is CORRECT

The whole production diff against `main`:

```
- * IT IMPORTS `GameHistory` AS A TYPE ONLY, so `src/history.ts` keeps its zero runtime importers.
+ * IT IMPORTS `GameHistory` AS A TYPE ONLY, so IT ADDS NO RUNTIME IMPORTER OF `src/history.ts`.
```

**The struck sentence is an unqualified whole-tree claim that goes FALSE the moment `turn-loop.ts`
lands** — the licensed driver is a runtime importer, so `history.ts` does not keep zero. **The
replacement is a claim about the PANE, and it is true on both trees.** `status-panel.ts:24` carries
the identical phrasing. **Both are true, and I verified both against the module graph rather than by
reading**: neither module's closure contains `history.ts`, and each holds exactly one `import type`.

## 8. ONE CORRECTION to the record — the comment count is THREE, not four

QE's note `20260812T083700Z-…-twelve-kills-lost-not-one` states the production references to
`history.ts` are *"two `import type` lines … and **four comments**"*. **Counted mechanically at this
hop over all 16 production modules — occurrences, not lines:**

| file | occurrences | what |
|---|---|---|
| `history-pane.ts` | 2 | comment `:30` + `import type` `:61` |
| `status-panel.ts` | 2 | comment `:24` + `import type` `:42` |
| `san.ts` | 1 | comment `:16` |

**Five occurrences total: two `import type` lines and THREE comments.** The fourth comment does not
exist on this tree.

**It changes NO verdict and I am not inflating it** — the load-bearing half of that sentence (zero
bare imports, zero re-exports, type-only references only) is **correct and independently
re-verified** above. It is recorded because this ticket's whole recurring lesson is that a count
stated in the record gets cited later as if it were a census, and *"exactly one"* is the sentence
this stack has already paid for once. **Flagged, NOT fixed** — the note is an immutable record and
Workflow 16 appends rather than rewrites. **Owner: QE/E2E. Trigger: the next hop that cites the
count.**

*(Also verified while there: all three comments are JSDoc ` * ` continuation lines, so the anchored
expression cannot match them. `L2`'s `WEXPORT-STRING` false-positive surface has **no live instance**
— no production module holds a string or comment quoting the specifier at column 0 behind an
`export` keyword. The limit is real; it is not firing.)*
