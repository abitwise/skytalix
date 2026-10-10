---
id: 20261010T162956Z-qe-e2e-observation-abc138-gap-register-d5a380ba
kind: observation
by: qe-e2e
at: 2026-10-10T16:29:56Z
verified_by:
confidence: high
refs:
  - ABC-138
  - ABC-133
  - F-133-1
  - AR-133-LOADER
  - AR-133-WRAP
  - QE-133-d
  - QE-133-f
  - V1.2.5
  - src/cli.test.ts
  - 20261010T162956Z-qe-e2e-observation-abc138-plants-a5-gates-9cdaa822
  - 20261010T162956Z-qe-e2e-decision-abc138-verdict-pass-with-gaps-6ef45921
supersedes:
---

# `ABC-138` gap register: two LOW, four INFO. No criterion fails, and every hole was GREEN at base too, so no kill was traded. Both LOW gaps bear on Security/NFR's discharge ruling

This note is hand-authored and unsealed. Every gap is measured; the plants are in `…9cdaa822` and
`../probe/`. **No test was added:**
- Closing `QE-138-a` means editing (iii)'s filter, which is the engineer's delivered line, not an
  addition. A QE row that pins the hole would red the suite.
- `QE-138-b` sits inside the page's letter ("first argument").

| id | severity | gap | evidence | suggested owner |
|---|---|---|---|---|
| `QE-138-a` | **LOW** | **(iii)'s "inside a type" filter is `ts.isTypeNode`, and TypeScript classes `ExpressionWithTypeArguments` as a type node.** A class `extends` clause and an instantiation expression are VALUE positions, but a reference inside them is not counted. `spawnSync` is an ordinary function, so it is constructible: `class S extends (spawnSync as unknown as new (…) => object) {}` then `new S(…)` spawns a child. Neither (ii) nor (iii) sees it. This is against Scope (b)'s letter ("every value-position reference"). It is not one of `A2`'s six named plants, so `A2` stays MET. The pin's comment ("A reference inside a type does not count") reads as covering it | `W5` GREEN at base and at head. `W5` LIVE: GREEN 67/67, **1 child ran**, `tsc` 0, `biome check` 0. `W6` is the same parse-level hole, but biome's formatter currently breaks it (INFO `QE-138-d`) | **Software Engineer, one line, verified in scratch** (`fixcheck.out.txt`): `ts.findAncestor(name, (n) => ts.isTypeNode(n) && !ts.isExpressionWithTypeArguments(n)) === undefined`. With it, `W5` reds and the control, `F2` and `F2b` stay GREEN. Alternatively, Security/NFR keeps it as a stated residual of `AR-133-WRAP`. **`AR-133-WRAP` should not be discharged as fully closed while this stands** |
| `QE-138-b` | **LOW** | **Count (i) sees a literal module name only in the FIRST argument, but the comment's "THE BOUND IT KEEPS" names only a non-literal name.** A literal name in another position is unseen. Two examples: `process.getBuiltinModule.call(process, "node:child_process")` and `Reflect.apply(createRequire(…), undefined, ["child_process"])`. This is within the page's letter (Scope (a) says "first argument"), so it is a residual plus a comment-accuracy gap, not a defect. Both shapes are adversarial (`.call` / `Reflect.apply` on a loader) | `L3c` and `L5` GREEN at both tips. After `biome format --write`: GREEN 67/67, `tsc` 0, `biome check` 0 | Security/NFR, at the discharge ruling on `AR-133-LOADER`: name the residual. The comment's bound sentence could add "or a literal that is not the first argument". That wording is the engineer's or BA/PM's |
| `QE-138-c` | INFO | **The comment's remedy for the `A4` false red is the shape (i) cannot see.** "Spell it through a `const`" is right for a non-loader call. Applied to a loader, `process.getBuiltinModule(CP)` is the out-of-scope non-literal name, and it is GREEN. Out of scope by the page; recorded so the discharge ruling weighs it. The member-name backstop helps here: `.spawnSync` on the result reds (iii), and `.execSync` does not | `L3b` GREEN at both tips | Security/NFR (discharge wording) |
| `QE-138-d` | INFO | **The instantiation-expression alias is held off only by a formatter quirk.** `(spawnSync as unknown as <T>(…) => T)<object>` is GREEN as written, but `npm run lint` flags its format. `biome format --write` drops the parentheses, and the formatted line fails `tsc`. A Biome upgrade could reopen it. `QE-138-a`'s fix closes it at the source | `W6` GREEN unformatted. `W6` LIVE after formatting: `tsc` exit 2, RED (iii) | covered by `QE-138-a` |
| `QE-138-e` | INFO, fail-loud | **The stated `A4` class catches two natural test idioms:** `expect(text).not.toContain("child_process")` and `console.log("child_process")`. Both red (i), loud and as stated. `F4` is the likeliest real trip in this file, given bar 1's style | `F4`, `F1` RED (i). `F1b` (name not first) GREEN | none. Confirming the `C14` split is Security/NFR's call |
| `QE-138-f` | INFO | **Single-round headroom (`QE-133-f`, unchanged).** Single rounds over 250 ms occur at BOTH tips: head 261.1 ms at load1 9.2, and 267.7 ms at 52.5. The criterion is the median, which holds (170.3 / 183.7) | `a5-batch{1,2}.out.txt` | none |

**Pre-existing and unchanged:** `QE-133-d`. A type-only `import type { … } from
"node:child_process"` still reds (i) (`F5`).

**Not gaps (checked):**
- `L1`, `L2`, `L3a`, `L4` and `L6` red (i). These cover a renamed `createRequire`, a `require`
  alias, a `getBuiltinModule` variable callee, a no-substitution template and `vi.doMock`.
- `L8`, `W1`–`W4` and `W7` red (iii). These cover a re-export, `satisfies`, an array index, a
  shorthand property, `new (… as …)` and a destructured alias.
- There is no false red on a type-only reference (`F2`, `F2b`), a JSDoc `{@link}` (`F3`), an import
  type node (`F6`), the name as a non-first argument (`F1b`) or a non-exact string (`F7`).
