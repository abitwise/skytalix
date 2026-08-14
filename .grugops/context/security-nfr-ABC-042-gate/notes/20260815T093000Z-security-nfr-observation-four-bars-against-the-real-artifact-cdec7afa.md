---
id: 20260815T093000Z-security-nfr-observation-four-bars-against-the-real-artifact-cdec7afa
kind: observation
by: security-nfr
at: 2026-08-15T09:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/cli.ts
  - src/cli-options.ts
  - src/cli.test.ts
  - V1.2.5
  - V1.3.2
  - V1.3.3
  - V2.1.1
  - V2.2.1
  - V2.2.2
supersedes: 
---

# The four bars, measured against the REAL artifact — all four MET, and where each instrument stops

**This is the first hop on `ABC-042` where the thing I reviewed on paper exists as a diff.** Everything
below was measured on the delivered tree at `8b07d9f`, not read off the ticket and not taken from the
build hop's notes. Where a number of mine disagrees with the build hop's, mine is stated and the
disagreement is named rather than averaged.

## Bar 1 — arguments are data, never code. **MET.**

Measured over the two delivered production modules, **whole source including comments** (which is the
stricter reading, and it is the one the delivered test takes — `sourceOf`, not `executableCodeOf`):

```
                        src/cli.ts   src/cli-options.ts
eval                         0             0
Function(                    0             0
child_process                0             0
import(                      0             0
```

`shell` occurs once in `cli.ts` and `spawn` twice in `cli-options.ts` — **all three are prose in
docblocks** ("the shell is told so", "provable only by spawning a child"). Bar 1's "no shell" clause is
satisfied structurally rather than textually: a shell needs `child_process` or a builtin import, and
production has **zero** of either. The in-suite row asserts four of the five tokens and not `shell`;
that costs nothing here because the reachability argument closes it, and I am not manufacturing a fix
for it.

**ASVS `V1.3.2 [L1]` (avoid dynamic code execution) and `V1.2.5 [L1]` (parameterised OS calls): MET on
the artifact.**

## BAR 1b — the delivered TEST file. **MET on the property. NO IN-SUITE INSTRUMENT — see `S1`.**

Measured over `src/cli.test.ts` with comments stripped, which is what "call sites, NEVER occurrences"
requires and what `RF-9` was raised to get:

```
exec SUBSTRING occurrences        8     <- must be > 0; the file MUST contain process.execPath
exec( CALL SITES                  0
execSync( CALL SITES              0
shell:                            0
node:child_process reach          1 import, 1 call: spawnSync(command, [...args], { cwd, encoding, stdio })
argv built by string concat       none — the argv is an array spread, and `command` is
                                  either the literal "npm" or process.execPath
```

Re-measured repository-wide over all 49 `src/` files with comments stripped: **0 `exec(`/`execSync(`
call sites, 0 `shell:`.** `RF-9`'s repair works exactly as intended — the correct build carries 8
substring hits and is GREEN, where the pre-repair wording would have redded it.

**The gap: no test asserts this.** Nothing in the suite reads `src/cli.test.ts` as data. BAR 1b's
property is stated in the file's own docblock (`:15-18`) — and **prose is not a criterion**, which is
the sentence I opened `RULING 2` with. Bars 1, 3 and 4 each got an in-suite row; BAR 1b did not.
Recorded as **`S1`**, low, in the ruling note.

## Bar 3 — no argument reaches the terminal unsanitised. **MET.**

The delivered probe is one child, `--colour <ESC>[2Jpurple`, captured on both channels. I ran the
delivered build myself rather than reading its assertion:

```
argv token                     echoed line                                              C0/DEL   C1
7-bit ESC U+001B + "[2J"       "--colour needs one of white/black/random: [2Jpurple"       0     none
DEL U+007F                     "--colour needs one of white/black/random: purple"          0     none
8-bit CSI U+009B + "2J"        "--colour needs one of white/black/random: 2Jpurple"        0     U+009B
C1 NEL U+0085                  "--colour needs one of white/black/random: purple"          0     U+0085
```

The bar names C0, `U+007F` and `\x1b`. **All three are stripped, on the real build, on the error path
where argv-derived bytes actually are.** `printableOf` (`src/cli.ts:62-70`) drops every code point
below `0x20` plus `0x7f`, applied per offending token before the join — so it is not coupled to which
token happened to be probed.

The two C1 rows are **`AR-1`, re-confirmed on the artifact rather than on paper**. They are the
accepted risk I recorded before any code existed, with `ABC-042` named as a new source for it. It is
`V1.3.3`-adjacent, **L2, outside the active L1 set**, owner BA/PM via `ABC-019`'s `R-A`. **NOT
re-opened and NOT a required fix** — requiring it here would be gold-plating past a standing ruling,
which is what I said last time and what I am still saying with the bytes in front of me.

The instrument's residual is `S2` in the ruling note.

## Bar 4 — no filesystem and no network, in the production modules. **MET.**

Every import specifier in the two production modules, static and dynamic:

```
src/cli-options.ts   ./glyph-mode.ts (type-only), ./render.ts (type-only)
src/cli.ts           ./cli-options.ts, ./frame.ts, ./glyph-mode.ts, ./history.ts, ./render-seam.ts
```

**Five relative specifiers and two type-only ones. Zero non-relative imports, so zero Node builtins —
the production floor holds at 0 of 20.** The grammar
`/^(node:)?(fs|net|http|http2|https|tls|dns|dgram)(\/|$)/` matches none of them, and it carries
`http2` — `RF-10` landed. The three no-import globals `fetch` / `WebSocket` / `XMLHttpRequest`: **0 /
0 / 0** across both modules.

Instrument note, recorded and NOT raised as a fix: the delivered specifier scan matches `from "…"` and
`import("…")` and would not see a **side-effect import** (`import "node:fs"`). It does not matter here
— bar 1's `not.toContain("import(")` plus the measured zero non-relative imports plus the review
obligation's "imports any Node builtin in a production module (permitted set: empty)" all cover it,
which is the same compensating-control reasoning that made `RF-10` low. Naming it as a required fix
would start the unclosable list I declined to start at `inspector`.

## `A9` — the exclusivity rules, re-measured

```
src/cli.ts        process.argv occurrences (code)      1
                  process.stdout occurrences (code)    1   -> beginFrameSession(process.stdout, frame.length)
                  process.stderr occurrences (code)    1   -> the rejection write
                  resolveOptions( call sites           1
                  export statements (code)             0   (A2)
src/cli-options.ts contains "process" anywhere,
                  comments included                    NO
                  globalThis / import.meta             NO / NO
```

**`V2.2.2 [L1]` (validation enforced at a trusted layer): MET.** The resolver is the exclusive
validator and the assertion holds it — I tried to break it and could not (mutant `M4`, see the mutant
note).

## The ASVS L1 rows that fire, re-dispositioned against the artifact

| ASVS | on the design (2026-08-14) | on the artifact (today) |
|---|---|---|
| `V1.2.5 [L1]` | MET by design, strengthened by BAR 1b | **MET** — 0 call sites, argument-array form, measured |
| `V1.3.2 [L1]` | MET by design | **MET** — 0 `eval` / `Function` / dynamic `import(` |
| `V2.1.1 [L1]` | MET — the table is the documentation | **MET** — and the resolver's exported enumeration equals it element for element |
| `V2.2.1 [L1]` | **FAIL → the HIGH block**, then DISCHARGED on the repaired criteria | **MET** — see the mutant note; the discharge holds under three built mutants |
| `V2.2.2 [L1]` | MET in substance, exclusivity unverified | **MET** — exclusivity now verified, and the instrument survived a targeted mutant |
| `V15.1.1 / V15.2.1 [L1]` | MET structurally | **MET** — `package.json` gains one `scripts` key; no `dependencies`, `private` still `true`, asserted key by key |
| `V13.4.1 [L1]` | N/A under `ADR-0007` | **N/A, unchanged** — no `bin`, `main`, `files`, `publishConfig` |

The rows that do not fire are unchanged from `…observation-5e53ef26` and are not re-walked here.
