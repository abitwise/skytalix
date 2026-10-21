---
id: 20261021T105251Z-software-engineer-decision-7c491426
kind: decision
by: software-engineer
at: 2026-10-21T10:52:51Z
verified_by: 
confidence: high
refs:
  - ABC-161
  - QE-101-a
  - QE-101-b
  - SEC-101-a
  - grugops/ABC-161
  - 35788fd4
  - ee1818bb
  - src/cli.test.ts
  - plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md
  - 20261021T104240Z-ba-pm-decision-b0020834
  - 20261021T103740Z-ba-pm-observation-8425f6db
supersedes: 
seal: sha256:10919e686d3e52d07125631f4f943faffa6b294a871b688472f000b29cd61bca
---

# ABC-161 (second hop): the three edits as built, against the re-worded page at main 35788fd4

Base: `grugops/ABC-161` rebased onto `main` `35788fd4` (first hop's notes kept, now `dc1fbc93`). `src/` and `AGENTS.md` at `35788fd4` are byte-identical to `afc8d43a`'s. Code commit: `ee1818bb`, `src/cli.test.ts` only.

1. **Fix 1 (`ABC-101` `A8′` equivalence): `call < 3` at seed 7, the page's measured option.** No seed change, so the non-vacuity block (level 1's first draw at seed 7 is a blunder, differs from `DEFAULT_LEVEL`'s move) is untouched and green. Seed 7's draws are 0.0117, 0.0620, 0.9769 (from `…observation-8425f6db`); the third call makes a per-move rebuild at each of levels 1-4 decide differently from the kept generator. The comment above the loop says so.
2. **Fix 2 (`ABC-101` `A3`):** `"3\n"` added to `refusedValues`, with a one-line comment naming the `/m` regex and `.trim()`.
3. **Fix 3 (`ABC-065` `A3`):** the `toContain` loop is replaced. For each accepted `--` option that the resolver accepts some value word after (`resolveOptions([option, value]).ok`; today `--colour` and `--difficulty`), the slot must hold exactly one `|`-joined run after it (`<option> (\w+(?:\|\w+)+)`), and that run is set-equal to the value words the resolver accepts after that option. Every value is derived from `ACCEPTED_ARGUMENTS` plus the resolver, never transcribed; `COLOUR_VALUES` / `DIFFICULTY_VALUES` stay unexported. The `-- --colour black` example has no `|`, so it is not read as a list. One more line keeps the old row's guarantee: the union of the per-option accepted words equals every value word in `ACCEPTED_ARGUMENTS`. The option-equality half of the row is unchanged.

No production line, no `AGENTS.md` edit, no new `it`. Every changed line sits inside the three named `it` blocks.
