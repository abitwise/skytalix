---
id: 20261010T113116Z-qe-e2e-observation-abc058-twenty-four-probes-head-vs-base-4b252e30
kind: observation
by: qe-e2e
at: 2026-10-10T11:31:16Z
verified_by:
confidence: high
refs:
  - ABC-058
  - ABC-042
  - V1.2.5
  - V1.3.3
  - N8-SPAWN
  - src/cli.test.ts
  - src/cli.ts
  - 20261010T111050Z-software-engineer-observation-abc058-gates-mutants-a1-a8-cost-b98960df
  - .grugops/context/qe-ABC-058/probe/mutants.sh
  - .grugops/context/qe-ABC-058/probe/mutants-head.out.txt
  - .grugops/context/qe-ABC-058/probe/mutants-base.out.txt
supersedes:
---

# `ABC-058` probes: the Engineer's seven reproduce exactly; QE's own seventeen find the `S5` strip trades three kills (`Q11`–`Q13`)

Hand-authored, unsealed (`AGENTS.md`: no `finding` is admissible on this install).

**Harness.** QE's own `probe/mutants.sh` + `probe/mutate.cjs`, not the Engineer's. Each probe runs on
an out-of-tree `git archive` copy of base `b21ec7cf` or head `fb914ded`, with `node_modules`
symlinked. It runs `npx vitest run src/cli.test.ts` alone. Every anchor must occur exactly once, or
the probe is ABORTED and not run. After each probe the tree is restored from a pristine byte copy and
checked with `diff -r`. All 24 probes were run twice on head and gave identical verdicts. Load1 over
all 48 runs: min 4.09, median 6.36, max 10.43. Node v26.11.0.

Production mutants that use a **string** literal (`Q1`–`Q3`) keep the `A8` number row out of the
attribution, because `withoutStringText` blanks string text. That is why `Q1`/`Q2` red bar 3 alone.

| probe | base `b21ec7cf` | head `fb914ded` |
|---|---|---|
| control | GREEN 66/66 | GREEN 66/66 |
| `E-A1` prose docblock names `` `spawnSync(` `` | RED, pin | **GREEN** |
| `E-MS1` direct `spawnSync` child | RED, pin | RED, pin |
| `E-MS2` namespace import | RED, pin | RED, pin |
| `E-M3f` `0x7f`→`0x7e` | RED, `A8` row | RED, `A8` row + bar 3 |
| `E-M3g` `\|\| code === 0x7f` deleted | RED, `A8` row | RED, `A8` row + bar 3 |
| `E-M3h` `&& code !== 0x7f` | GREEN | **RED, bar 3** |
| `Q1` filter lets BEL through (C0-not-ESC class) | GREEN | **RED, bar 3** |
| `Q2` filter lets ESC through | RED, bar 3 | RED, bar 3 |
| `Q3` filter lets TAB through (a C0 not in the token) | GREEN | GREEN |
| `Q4` token BEL→TAB at the edge, correct build | n/a | GREEN (valid control) |
| `Q5` token BEL→TAB at the edge + TAB passes | n/a | **GREEN: the whitespace byte is lost** |
| `Q4b` TAB inside the locator (`[2J\tpurple`), correct build | n/a | GREEN (valid control) |
| `Q5b` same token + TAB passes | n/a | RED, bar 3, via non-vacuity (i) |
| `Q6` token BEL→TAB + BEL passes | n/a | GREEN |
| `Q7` BEL removed from the token + BEL passes | n/a | GREEN: BEL is load-bearing |
| `Q7b` DEL removed from the token + `M3h` | n/a | GREEN: DEL is load-bearing |
| `Q8` template-literal TEXT `` `…spawnSync( …` `` (not a call) | RED, pin | RED, pin |
| `Q9` real call inside a `${…}` interpolation | RED, pin | RED, pin |
| `Q10` a `//` line comment names `spawnSync(` | RED, pin | **GREEN** |
| `Q11` real call after a `"a//b"` string on the same line | RED, pin | **GREEN: the child is uncounted** |
| `Q12` real call between a `"/*"` and a `"*/"` string | RED, pin | **GREEN: the child is uncounted** |
| `Q13` namespace import + `cp.spawnSync(` after a `"x//y"` string | RED, pin | **GREEN: the child is uncounted** |
| `Q14` real call through an alias (`const alias = spawnSync`) | GREEN | GREEN |

"n/a" means the anchor is head's token and is absent at base. The probe ABORTED there and was not run.

**What they show.**
- **`A1`, `A2`, `A5`, `A6` reproduce exactly** as the Engineer reported (`…b98960df`).
- **Each byte in the new token is load-bearing** (`Q1`/`Q7`, `M3h`/`Q7b`, `Q2`). Head kills one
  class more than the page asked for (`Q1`).
- **The Engineer's whitespace argument is CONFIRMED** (`Q5`). One refinement: a whitespace byte placed
  inside `[2Jpurple` is still caught, but only by the non-vacuity check, not by clause (ii) (`Q5b`).
  BEL is the right choice.
- **The comment strip trades three kills** (`Q11`–`Q13`). The cause is that `executableCodeOf` strips
  `//…` and `/*…*/` without knowing about string literals, which the page's test note 2 warned of.
  Under that strip, a real direct child is invisible to the pin. `Q14` shows the pin was never proof
  against deliberate evasion. Graded in the gap register (`…904bdd2d`).

**Independent static checks (`probe/out-gates-tip.txt`).**
- `pin-count.mjs` at head: imported `["spawnSync"]`. The `spawnSync(` count is 1 on both the raw
  and the stripped view, at `const child = spawnSync(`. `CHILDREN` has 27 keys statically.
  `N8_SPAWN = 17 + 7 + 1 + 2` = 27.
- `strip-compare.cjs` checks the regex view against the repo's own TypeScript scanner. Both count 1
  call site. They differ in one place only: the `//` regex cuts the 7-char tail
  `/g, "")` off `executableCodeOf`'s own line. That line holds no call.
