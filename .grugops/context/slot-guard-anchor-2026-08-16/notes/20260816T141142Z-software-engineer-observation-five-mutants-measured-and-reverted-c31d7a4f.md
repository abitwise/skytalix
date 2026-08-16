---
id: 20260816T141142Z-software-engineer-observation-five-mutants-measured-and-reverted-c31d7a4f
kind: observation
by: software-engineer
at: 2026-08-16T14:11:42Z
verified_by:
confidence: high
refs:
  - ABC-067
  - ABC-071
  - AGENTS.md
  - src/cli.test.ts
supersedes:
---

# Five mutants, measured before and after the repair, every one reverted and proved reverted

Applied **by hand** to `AGENTS.md` on disk, one at a time, `npx vitest run src/cli.test.ts` between
each, then restored from a pristine copy taken before the first. **No test in the delivered commit
writes `AGENTS.md`** (`ABC-067` test note 1) — the disk mutants are this hop's own measurement, not
the shipped instrument; the shipped mutants are in-memory fixtures.

Pristine `AGENTS.md` sha256 `36f4be2f28bc35734661882323db67f45c42749346a007c0114318c89f44d75b`,
re-measured after every single restore and identical each time; `git status --short AGENTS.md` clean.

| mutant | what | BEFORE | AFTER |
|---|---|---|---|
| `M1` = QE `N4` / `ABC-067` `A1` | slot's own `-->` deleted | **GREEN 32/32**; window 16 lines / 1089 bytes / 4 swallowed bullets | **RED** — `does not close before the next list item` |
| `M2` = `ABC-067` `A4` | that closer **and** the next `-->` deleted | **RED for the WRONG reason** — `expected ['--ascii','--colour','--coverage','--unicode'] to deeply equal [...]`; window 25 lines / 1861 bytes / 6 bullets | **RED for the right reason**, identical message to `M1` |
| `M3` = QE `N3a` / `ABC-071` `A1` | duplicate slot appended **after** the good one | **GREEN 32/32** — invisible | **RED** — `` `- Dev / run:` slots in AGENTS.md: expected 2 to be 1 `` |
| `M4` | same duplicate placed **immediately before** `### Development` | **GREEN 32/32** | **RED**, same message as `M3` |
| `M5` = QE `N3b` / `ABC-071` `A2` | same duplicate placed **far** before, above `## How to work here` | **RED for the WRONG reason** — picked up `--check` from the installer blockquote | **RED**, same message as `M3`/`M4` |

## The one place my measurement disagrees with a ticket, stated rather than hidden

`ABC-071` records QE's `N3b` — *"the same broken duplicate placed BEFORE the good one"* — as **RED**.
That is **placement-dependent, and the ticket does not say which placement**. `M4` (just before the
section heading) was **GREEN**; only `M5` (far enough before that the window swallowed another
comment's tokens) was red. **QE's figure is reproducible at `M5`'s placement and not at `M4`'s.**

This does not weaken `ABC-071` — it strengthens it. The defect was not a two-verdict asymmetry but a
**three-verdict one**: identical content, three placements, `GREEN` / `GREEN` / `RED-for-the-wrong-
reason`. `ABC-071` `A2` asks that both mutants now fail **for the same stated reason**; all three do,
on the slot count, and `N3b`'s pre-existing red is nowhere in that evidence — the new row's
before-state was measured against the old locator and it was `NO FAILURE — the guard accepted this
file` on both duplicate placements it drives.

## Baselines re-measured at this hop rather than quoted (`ABC-067` test note 5)

Unmutated `AGENTS.md`: slot **9 lines / 800 bytes / 0 further bullets**, label occurs **1** time,
**14** `-->` in the file (13 after the slot's own). Every figure on `ABC-067`'s page reproduced
exactly. Same figures re-measured after the repair — the captured region did not move.
