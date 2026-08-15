---
id: 20260815T131800Z-software-engineer-observation-which-process-spellings-i-assert-1ad1f221
kind: observation
by: software-engineer
at: 2026-08-15T13:18:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q2
  - A9
  - A2
  - ASVS-V2.2.2
  - src/cli.test.ts
  - src/cli.ts
supersedes: 
---

# `Q2` — which `process` spellings I assert, and which I do NOT

The subtask asked this question explicitly because `ABC-041`'s `A6` needed **four** spellings and
`process["argv"]` is **one**. Here is the answer in both directions, so the next hop does not have to
find the gap by building the mutant.

## What I changed, and why it is a closure and not a longer list

QE's arming enumerated spellings: the whole `process.<name>` surface transcribed, plus
`not.toMatch(/process\s*\[/)`. **A spelling list is never longer than the last census that wrote
it** — which is the defect this ticket keeps rediscovering. So the row now **counts the identifier**:

```ts
expect(entry.match(/\bprocess\b/g)).toHaveLength(4);
expect(entry).not.toContain("globalThis");
```

The delivered entry point names `process` exactly four times and the transcription row above it says
**which** four (`process.argv`, `process.exitCode`, `process.stderr`, `process.stdout`). Together they
**close** the set rather than list it — the same move `A6`(i) already makes on the accepted arguments,
and the reason it survives mutants nobody enumerated.

## ASSERTED — each one built as a mutant and watched go RED

| spelling | mutant | red against |
|---|---|---|
| `process.argv` a second time | (count row, pre-existing) | `A9` |
| `process["argv"]` / `process['argv']` | `MX8` (= QE's `M11`) | `A9` |
| `const ambient = process; ambient.argv` — **alias** | `MX9` | `A9` |
| `import { argv } from "node:process"` — **ESM import** | `MX10` | `A9` |
| `globalThis["process"].argv` — **`X8`'s own spelling** | `MX11` | `A2` **and** `A9` |
| `process?.argv` — **optional chaining** | `MX12` | `A9` |
| any `globalThis` route, including `globalThis.process.argv` | `MX13` | `A2` **and** `A9` |

`eval`, `new Function(`, and dynamic `import(` are fenced separately: **bar 1's row already asserts
`not.toContain` for all three over `src/cli.ts`**, so the obfuscated routes to an ambient binding are
closed by an assertion that already existed. I checked that rather than assuming it.

**Why `globalThis` is asserted on `A9`'s row as well as `A2`'s, which looks like duplication and is
not.** Before my change, `globalThis["process"].argv` — the exact spelling that beat `X8` in the
`ABC-041` re-gate — was caught **only by `A2`'s row**, which is about *publishing* a binding, not
about *acquiring* one. `A9`'s coverage of `Q2`'s worst spelling was therefore a **coincidence of
`Q7`'s arming**, and the day BA/PM rewords `A2` it would vanish with no row going red. `MX11` now
reds two rows instead of one, and each for its own reason.

## NOT ASSERTED — stated plainly, with why

1. **A second argv read from a MERGED production module.** `A9`'s scope is the **new** production
   modules — ruled on this ticket (`ADR-0011` clause 1, and the ticket's own scope note), because a
   whole-tree reading reds on `src/frame.ts`'s docblock and on `src/glyph-mode.ts`. If `src/history.ts`
   read `process.argv` tomorrow, **nothing here would see it.** That is the ruled scope, not an
   oversight, but it is a hole and I am naming it. (`src/cli-options.ts` **is** covered: its row
   asserts `not.toContain("process")` over its whole source, comments included.)
2. **Anything behavioural.** Every assertion in `A9`(2) is **textual** over the module's source. No
   test runs a build carrying a second argv read and observes it misbehave. A defect that produced a
   second read at runtime without writing the identifier — through a dependency, a loader, a
   `--require` hook — is invisible to all of it.
3. **Obfuscation that names neither `process` nor `globalThis` and evades bar 1.** For example
   `globalThis["proc" + "ess"]` is caught (it names `globalThis`), but a route through some third
   global that aliases the process object would not be. I judge this out of reach for a textual
   instrument and I am not claiming it.
4. **That four is the right number forever.** `toHaveLength(4)` is a **transcription**, like `A8`'s
   numeric literals. A legitimate future `process.stdin` reds this row and the author must update it
   and say why — which is the intent, but it means the row is a **tripwire**, not a proof of the
   property. A hop that "fixes" it by bumping the number without reading the transcription above it
   has disarmed it.
