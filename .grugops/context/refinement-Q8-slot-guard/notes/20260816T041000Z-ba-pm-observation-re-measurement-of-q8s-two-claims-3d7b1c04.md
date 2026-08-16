---
id: 20260816T041000Z-ba-pm-observation-re-measurement-of-q8s-two-claims-3d7b1c04
kind: observation
by: ba-pm
at: 2026-08-16T04:10:00Z
verified_by: 
confidence: high
refs:
  - ABC-067
  - ABC-065
  - Q8
  - src/cli.test.ts
  - AGENTS.md
supersedes: 
---

# `Q8`'s two claims, re-measured by me before I wrote a criterion on either

My subtask told me to verify before writing acceptance, and told me the relay itself was **routing,
not evidence**. So I measured both claims myself against the working tree at `5cf86d3`, from the
delivered source, without mutating any file on disk — the mutants below were applied to an in-memory
copy of `AGENTS.md` inside a `node -e` script, so `AGENTS.md` was never written. **Two sibling BA/PM
hops share this working tree; nothing of mine touched it outside my own two paths.**

The locator under test, read from `src/cli.test.ts:898-907`:

```ts
const devRunSlot = (): string => {
  const agents = readFileSync(`${REPOSITORY}AGENTS.md`, "utf8");
  const start = agents.indexOf("- Dev / run:");
  const end = agents.indexOf(COMMENT_CLOSE, start);   // COMMENT_CLOSE = "-->"
  if (start < 0 || end < 0)
    throw new Error("AGENTS.md has no `- Dev / run:` slot with a comment");
  return agents.slice(start, end + COMMENT_CLOSE.length);
};
```

## Claim 1 — *"the slot grew from 9 lines to 16"*. **CONFIRMED, exactly, on the line count.**

| input | lines | bytes | further `"\n- "` bullets inside the captured slot |
|---|---|---|---|
| `AGENTS.md` unmutated | **9** | **800** | **0** |
| the slot's own `-->` removed (QE's `N4`) | **16** | **1089** | **4** |

The slot starts at `AGENTS.md:62`. The swallowed tail I printed and read with my own eyes: the two
Perft bullets, the Spike-benchmark bullet, the blank line, the `### Test` heading and
`` - Test (all): `npm test` <!-- vitest run --> `` — i.e. the extension stops at the **`### Test`
section's** comment closer, which is the next `-->` in the file.

**One discrepancy, recorded rather than smoothed over: QE reported `1082` bytes; I measure `1089`.**
The line count agrees exactly (16) and the swallowed content agrees exactly. Seven bytes is the size
of an ordinary edit to the swallowed region between QE's hop and mine, and I could not check the
history because **my subtask forbids me every git command** (two siblings, one index). **I do not
claim to know which figure was right at QE's hop; I claim mine is right at `5cf86d3`.** Neither
figure is load-bearing — the ticket's criteria are scored on the **bullet count** and on
**fail-vs-green**, not on a byte total, precisely so a prose edit cannot invalidate them.

**The token collector's output is IDENTICAL on both inputs** — `['--ascii','--colour','--unicode']`
either way. That is the whole of `Q8`: the guard captured **271 more bytes of a file it does not
know it is reading** and every assertion it makes stayed satisfied.

## Claim 2 — *"the `end < 0` branch is dead in practice because `AGENTS.md` contains ten `-->`"*. **Conclusion CONFIRMED. The number is WRONG, and wrong in the direction that strengthens it.**

Measured at `5cf86d3`:

- **14** occurrences of `-->` in `AGENTS.md`, on **13** lines (line 96 carries two).
- **All 14 fall at or after the slot's start** (`AGENTS.md:62`) — the first of them is the slot's own
  closer at line 70.
- Therefore **13 fallback closers follow the slot's own**, the last being the file's **final line**
  (129).

**QE said ten. I measure fourteen.** I did not attempt to reconstruct how ten was arrived at — no
counting rule I tried (lines-with-`-->`, occurrences-after-the-slot, lines-after-the-slot) yields
ten, and I will not invent a reading to make the number fit.

**The substance is unaffected and, if anything, understated by QE.** `end < 0` can fire only when
**no `-->` exists anywhere after `start`**. With the file's own last line being a bare `-->`, the
branch is unreachable for any slot position short of the end of the file. **It is not merely "dead
in practice" — it is dead for every input a real edit to this file can produce**, which is why the
ticket's `A3` requires the branch be made live *or* the comment claiming it stop claiming it.

## Claim 3 — QE's *reachability* claim, which my subtask asked me to rule on. **CONFIRMED, and it is pinnable.**

QE wrote: *"Had the window reached the `Coverage` bullet (`npx vitest run --coverage`), the same
mutant would have redded — on `--coverage`, for a reason with nothing to do with the defect."*
**Note QE stated this conditionally and was right to: one removed closer does NOT reach the coverage
bullet.** I measured the second order:

| input | slot lines | tokens collected |
|---|---|---|
| unmutated | 9 | `--ascii --colour --unicode` |
| slot closer removed | 16 | `--ascii --colour --unicode` — **green** |
| slot closer **and** the `### Test` closer removed | **25** | `--ascii --colour --coverage --unicode` |

At 25 lines `A3`'s set equality reds:
`['--ascii','--colour','--coverage','--unicode'] ≠ ['--ascii','--colour','--unicode']`.

**So the reachability claim is not narrative — it is a reproducible input**, and it is `ABC-067`'s
`A4`. It matters because it converts "we got lucky" from a feeling into a distance: **the guard is
one closer away from failing, and when it fails it will name `--coverage`, not the unterminated
comment.** A guard that reds for the wrong reason is the same broken instrument as one that greens
for the wrong reason, and that is the sharper way to state `Q8` than "it passed by luck".

## Baselines anyone re-checking this should re-derive, not quote

`npx vitest run src/cli.test.ts` at `5cf86d3`: **32/32 passed**, 1 file, 12 ms. That is the number
`ABC-067`'s `A1` must break under its mutant and preserve under the unmutated file.
