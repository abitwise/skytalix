---
id: 20260813T022000Z-ba-pm-observation-the-sentence-measured-at-source-and-both-of-its-claims-are-wider-than-what-holds-b79f6aec
kind: observation
by: ba-pm
at: 2026-08-13T02:20:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-018
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - src/frame.ts
  - src/turn-loop.ts
  - plans/tickets/ABC-019-turn-loop-skeleton.md
supersedes:
---

# The sentence, measured at source — and BOTH of its claims are wider than what holds

> **`kind: observation`, not `finding`, and that is forced rather than chosen.** `context.human_admission`
> is **`off`** and there is no `§14-gate` verdict record under this task, so no `finding` may be
> admitted and nothing is self-stamped. **`scripts/context-io.ts` does not exist here — there is no
> `scripts/` directory in this worktree at all** — so these notes are hand-authored and there is no
> derived `index.md` / `index.jsonl`; `notes/` is the source of truth. The Workflow 17 claim was taken
> by hand the same way (bare `mkdir`, no `-p`, on the task dir).

## The bullet as it stood

`plans/tickets/ABC-019-turn-loop-skeleton.md` § `## Security / NFR triggers`, last bullet:

> **No security trigger of its own.** The loop places strings; `ABC-018` sanitizes them.

**I re-derived it at source rather than inheriting the gate's measurement**, because the clause I
owed had to be mine. The gate's reading and mine agree.

## CLAIM 2 — the delegation. Measured at `src/frame.ts:123-132`

```ts
function sanitize(text: string, mode: GlyphMode): string {
  let kept = "";
  for (const character of text) {
    const code = character.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) continue;
    if (mode === "ascii" && code > 0x7f) continue;
    kept += character;
  }
  return kept;
}
```

Three lines decide it, and they are unambiguous:

| code points | `unicode` mode | `ascii` mode |
|---|---|---|
| C0 (`< 0x20`), incl. `U+001B` ESC and `\n` | **dropped** | dropped |
| `U+007F` DEL | **dropped** | dropped |
| **C1 `U+0080`–`U+009F`, incl. `U+009B` (CSI)** | **SURVIVES** | dropped |
| `U+00A0`, `U+200B`, `U+2028`, and every other `> U+007F` | **SURVIVES** | dropped |

So *"`ABC-018` sanitizes them"* is **fully true in `ascii` glyph mode and only C0 + DEL true in
`unicode` mode.** It is applied to the panels and the message region alike — `assembleFrame` maps it
over `[...board, ...status, ...history]` at `src/frame.ts:195-197` and over `parts.messages` at
`:202`.

**`ABC-018` is not at fault.** The function's own doc comment (`src/frame.ts:114-122`) says it in its
own words — *"In Unicode mode they survive: a UTF-8 terminal can draw them, and ASCII mode exists for
the one that cannot"* — and epic acceptance `2a`'s zero-non-ASCII assertion is an `ascii`-mode
assertion. **The defect was `ABC-019`'s own justification claiming a wider control than the one it
delegates to.** `ABC-018` was not opened for edit, is not re-opened, and no change is requested of it.

**Not blocking and not reachable today, and I did not move any of this:** the requirement it would
engage is ASVS **`V1.3.3`, which is `L2`**, and `security.asvs_level` is **`L1`**. Whether a UTF-8
terminal *acts* on `U+009B` arriving as `C2 9B` is emulator-dependent — **`UNKNOWN - verify`** from
here, and I did not fabricate a terminal test. Risk `R-A`, its severity, its owners (`EPIC-006` for
the glyph mode and the seam wiring, `ABC-018` for `sanitize`) and its trigger (`EPIC-003`'s real
parser or `EPIC-006`'s CLI entry point, whichever is first) are **carried verbatim, not re-priced.**

## CLAIM 1 — the lead-in. It is the SAME shape and the gate did not name it

*"No security trigger of its own"* is true only under the reading **"adds no security BAR of its
own"** — which is what the surrounding bullets are, and which the gate measured true: the loop hands
seam-supplied message strings to the render seam untouched (`loopSanitizesAnything` **false**) and the
only notice string it originates is `INPUT_ENDED_NOTICE` (`src/turn-loop.ts:168`, read at source).

Under the reading the section's own title invites — **"does not trigger a security review"** — it is
**false, and was false when it was written.** The 2026-08-13 gate ran both halves and named the reason
in its own words: the change introduces **two trust boundaries**, the input seam and the engine seam.
A reader using this section to decide routing would have skipped Security/NFR on this sentence.

**This is the one thing I changed beyond the literally-named sentence**, and it is flagged as such in
the report and in `[D56]` so it can be reverted in one edit if the Orchestrator disagrees. My reason:
it is the same bullet, the same sentence pair and the same shape, and repairing one clause while
leaving its twin would have left instance eight in the line above instance seven.

## THE TWO NEIGHBOURS — checked IN THIS SECTION, and NEITHER needs a clause

Recorded so the absence is a measurement rather than an oversight.

- **`R-B` — `takeBack(history, 0)`'s domain.** **This section makes no repair claim at all.** Its one
  repair-adjacent sentence is *"No `Position` reference is held across a suspension"*, which
  constrains what the loop **holds**, not what the primitive can **undo**. `grep -i` for
  `repair|takeBack|corrupt` across the section's line range returns **zero** hits of that kind. The
  broader promise `R-B` narrows lives in `## Scope` (*"nobody downstream is ever handed a
  mid-mutation board"*) — **outside this hop's scope, and the gate measured it TRUE as written**: a
  phantom-ply board is a consistent board of a different game, not a mid-mutation one. **Nothing to
  qualify; `A9b`(i) untouched.**
- **`R-C` — the engine `catch` has no binding.** **This section nowhere claims the cause is
  preserved.** `grep -i "cause"` over the section returns exactly one hit and it is `NFR-002`'s
  derivation prose (*"has that missing term as its named cause"*), unrelated. I also read `A9` and
  `A14` and the transition table (`:377`, `:404-444`, `:614`, `:1016-1117`, `:1744-1748`): they name
  *that* the ply failed and which reason value it carries (`engine-threw` / `engine-failure`, both
  distinct from every `EndReason`), **never why**. Had either claimed otherwise it would be wrong.
  **Neither does.** `EPIC-004` owns the day an engine failure becomes diagnosable, unchanged.
