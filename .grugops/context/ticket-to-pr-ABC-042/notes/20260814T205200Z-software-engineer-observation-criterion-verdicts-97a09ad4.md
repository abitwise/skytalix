---
id: 20260814T205200Z-software-engineer-observation-criterion-verdicts-97a09ad4
kind: observation
by: software-engineer
at: 2026-08-14T20:52:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/cli.test.ts
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
supersedes: 
---

# Every criterion, MET or NOT MET, with the evidence that decides it

**Twelve criteria and four security bars.** Each row names the assertion that decides it; all of them
are in `src/cli.test.ts` unless the row says otherwise. **Suite: 856/856, 30 files, skip 0.**

| # | verdict | evidence |
|---|---|---|
| `A1` | **MET** | `npm run chess` exits **0**; the emitted frame is **23 rows** and equals `frameHeight({ board: renderBoard(start, "ascii", "white-bottom").length = 9, status: STATUS_ROWS = 3, history: HISTORY_ROWS = 8 })`, asserted through that expression rather than against `23`; the eight ranks are each present as a row prefix; `AGENTS.md`'s `Dev / run` now reads `` `npm run chess` `` and the old `UNKNOWN - verify` is gone — **the command was run, and it is the command recorded** |
| `A2` | **MET** | `expect(executableCodeOf("cli.ts")).not.toMatch(/\bexport\b/)` — zero export statements. Scoped to executable text, the way `src/render-seam.test.ts` scopes its own textual rows: the docblock says "IT EXPORTS NOTHING" and a whole-source reading would red on the sentence that states the property |
| `A3` | **MET** | `cli.ts` and `cli-options.ts` are **directly in `src/`**; `productionModules()` is **20**; `readdirSync(src, {recursive:true})` finds **zero** `.ts` under any subdirectory, so `ADR-0011` clause 1's placement trigger **still does not fire** and `R3` stays as it was. The `src/cli/main.ts` build was never made |
| `A4` | **MET** | 1000 evaluations of `["--colour","random"]`, **zero spawns**: every result is `"white"` or `"black"`, **both occur**, and `JSON.stringify(options)` contains `"random"` **0** times — the word reaches no renderer and no seam. Spawned: `--colour white` and `--colour black` board regions are byte-identical to `renderBoard(start, mode, "white-bottom"/"black-bottom")` padded to the panels' width (`src/render-seam.test.ts`'s own method), and `--colour random` equals exactly one of the two, with the two proved different |
| `A5` | **MET** | At the resolver: `["--ascii","--unicode"]` is refused, the problem names **both** flags, and `selectGlyphMode` is called **0** times — **behind an arming control** that first proves the spy can see a call at all. Spawned: non-zero exit, both flags on stderr, **zero frame rows on stdout AND stderr** |
| `A6` | **MET** | **(i)** the exported enumeration **equals** `## Scope`'s table element for element, both ways, no extras, against the test's **own transcription**, with duplicates excluded; membership is exact string equality; the enumeration is the **only argv literal** in the resolver (every dash-led token inside every string literal must be an accepted spelling, and every space-free literal must be an accepted spelling or one of four transcribed non-argv literals); the **18** near misses derived **from the table** (upper case, `+"x"`, one-character truncation) are each rejected **in their legal argv position**, and they collide with the accepted set **0** times; `--debug` is rejected and named. **(ii)** 1000 generated tokens, **250 per shape asserted FIRST**, filtered by **whole accepted form only**; **0** accepted, **0** unnamed. **(iii)** the four named argvs: non-zero exit, offending argument named, zero frame rows on both channels |
| `A7` | **MET** | No flags on a pipe: **max code point 0x76** over the whole emitted stdout (`<= 0x7f`), stderr empty. `--unicode` on a pipe: the board region carries code points in **U+2654–U+265F** |
| `A8` | **MET** | Zero `\x1b[` in the emitted stream; it **ends with `frame.join("\n") + "\n"` and NOT with a second newline** — "exactly one" asserted from both sides. `beginFrameSession` has **one call site**, matching `beginFrameSession(process.stdout, frame.length)`. Numeric literals in the two modules are exactly `0, 0x20, 0x7f, 1, 2` (entry) and `0, 0.5, 1` (resolver), each transcribed with what it is — **none is a row count** |
| `A9` | **MET** | `process.stdout` occurs **once** in the entry point and only as `beginFrameSession`'s sink; `process.argv` occurs **exactly once**, inside `resolveOptions(process.argv.slice(2))`, and `resolveOptions` has exactly one call site — no second read, no branch on argv afterwards; the resolver contains **no `process`, no `globalThis`, no `import.meta` at all**, asserted over its **whole source, comments included** (`src/render-seam.test.ts`'s stronger form, not the one-token one) |
| `A10` | **MET** | Asserted **key by key**: top-level keys equal `HEAD`'s eight; **no** `bin`, `main`, `files`, `publishConfig` or `dependencies`; `private` is still `true`; every `HEAD` script's command byte-identical; the added script keys are exactly `["chess"]` |
| `A11` | **MET (recorded, not asserted)** | Median **68.8 ms** over 8 children (round 0 discarded) on **Apple M3 / Darwin 25.5.0 arm64 / Node v24.12.0**; `npm run chess` **150.3 ms**. Bar ≤ 1 s. `plans/nfr-catalog.md` untouched |
| `A12` | **MET, with one scoping statement** | The delivered diff is **exactly** the entry point, the resolver, their one test file, `package.json`, `AGENTS.md` and `src/history-pane.nfr.test.ts` — **nothing else**; `git diff --numstat` shows **all 18 merged production modules byte-identical**; `LICENSED_DRIVERS` gained **one element plus its citation**, nothing else in that file; suite green, skip **0**. **Scoping:** the branch tip carries a **second commit** holding `.grugops/` queue and context state, which Workflows 16 and 17 require and which is not a code change. `A12`'s file list is asserted against the **delivered code commit**; both commits are named in the artifact note |

## The security bars, as the ticket numbers them

| bar | verdict | evidence |
|---|---|---|
| **1** — arguments are data, never code | **MET** | Over the two **production** modules: zero `eval`, `Function(`, `child_process`, `import(`. There is no shell anywhere on the path |
| **1b** — the delivered test file | **MET** | `node:child_process` is reached only as `spawnSync(command, [...args])`, argv-array form; **zero call sites** of `exec(` / `execSync(`; zero `shell:`; no spawn argument built by string concatenation. The file does contain `process.execPath` — which is why the bar counts **call sites** |
| **3** — no argument reaches the terminal unsanitised | **MET** | One spawn with `--colour <ESC>[2Jpurple`, both channels captured. **(i) non-vacuity FIRST**: `[2Jpurple` **is present** in the output. **(ii)** the echoed line — a **superset** of the echoed token, so stronger, never weaker — carries **zero** C0, **zero** `U+007F`, **zero** `\x1b`. **(iii)** zero frame rows, and the exit is non-zero |
| **4** — no filesystem and no network | **MET** | Every import specifier in the two production modules is relative; the grammar `/^(node:)?(fs\|net\|http\|http2\|https\|tls\|dns\|dgram)(\/\|$)/` matches **none** of them, and `fetch`, `WebSocket`, `XMLHttpRequest` appear **0** times. The two modules import nothing non-relative at all, which keeps the production floor at zero |

**The review obligation is fired and is NOT discharged here.** It fires unconditionally on this
ticket, and the ASVS reading of the delivered **code** is Security/NFR's at the gate — not mine, and
not something a green suite stands in for. `A6`(i)'s instrument (`RF-7`) is the row they said they
would read first; it is the third `A6`(i) test in the file.

## Nothing was rediscovered the hard way, and nothing was built past

- No criterion was found unsatisfiable as literally worded. **Two were found to need a stated reading
  rather than a repair** — `A9`'s module scope and `A1`'s "the process writes", both recorded in the
  decision note with the alternative I did not take. Neither changed a single assertion's strength.
- The one measured conflict is between `N8-LANE` and the spawn-bearing criteria, and it is **not a
  criterion that rejects the delivered build** — it is a budget that no conforming build can meet.
  It is recorded with its arithmetic rather than absorbed.
