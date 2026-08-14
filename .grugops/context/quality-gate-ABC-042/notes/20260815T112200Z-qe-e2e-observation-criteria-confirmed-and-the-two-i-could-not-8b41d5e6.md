---
id: 20260815T112200Z-qe-e2e-observation-criteria-confirmed-and-the-two-i-could-not-8b41d5e6
kind: observation
by: qe-e2e
at: 2026-08-15T11:22:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - src/cli.ts
  - src/cli-options.ts
supersedes: 
---

# Twelve criteria and four bars: what I confirmed **independently of the suite**, and what I could not

"Independently" means I ran the command or read the tree myself and got the number — not that I
watched the engineer's assertion go green. Where my only evidence is the suite, the row says so.

## The twelve

| # | verdict | how I confirmed it, at my own hand |
|---|---|---|
| `A1` | **MET, independent** | `npm run chess` → **exit 0**; stdout carries a **23-row** frame as its tail; the merged seam composed out of tree returns **23** rows and `frameHeight({board: renderBoard(...).length, status: STATUS_ROWS, history: HISTORY_ROWS})` = 23; all eight ranks `8…1` present as row prefixes; `AGENTS.md` reads `` - Dev / run: `npm run chess` `` and the old `UNKNOWN - verify` is gone |
| `A2` | **MET (letter), instrument was blind to the purpose** | Zero `export` in the entry point's executable text. But `M14` (a binding on `globalThis`) shipped green against the keyword-only row — **armed**, now killed |
| `A3` | **MET, independent** | `find src -mindepth 2 -name '*.ts'` → **0**; both modules directly in `src/`; production modules **18 → 20**. `ADR-0011` clause 1's placement trigger does not fire |
| `A4` | **MET, independent** | Ran the built entry point directly: `--colour white` puts rank **8** on top (white at the bottom), `--colour black` puts rank **1** on top; 8 runs of `--colour random` gave **both** outcomes (`1 8 1 1 1 1 8 1`). 1000 resolver calls, zero spawns, no `random` in the resolved options — and `M10` (leaking the word) is killed by that arm |
| `A5` | **MET** | Suite + mutant. `M12` — the build that prints the board on the other channel and *then* complains — is **killed** by `A5`'s union rows, so the union clause is doing the work it was written for |
| `A6` | **MET on the delivered build; (i)'s instrument had a hole and (ii)'s control cannot fail** | (i) equality-to-table, only-argv-literal and the fifth-flag row all fire (`M1`–`M5` killed). **But `M7`/`M19` — prefix and case weakening on `--colour` — shipped green and print a board for `--colourx`/`--COLOUR`.** Armed. (ii) 250-per-shape is a tautology under rejection sampling (`M17` hangs, never reds); the filter itself is correctly whole-form. (iii) four argvs, non-zero, named, zero frame rows on both channels |
| `A7` | **MET, independent** | `npm run chess` piped: **max code point 0x76** over the whole stdout, stderr empty. `node src/cli.ts --unicode` puts `U+2654`–`U+265F` glyphs in the board region |
| `A8` | **MET, independent** | No `ESC [` anywhere in the emitted stream. `beginFrameSession` has one call site, `(process.stdout, frame.length)`. Numeric literals are exactly `0, 0x20, 0x7f, 1, 2` / `0, 0.5, 1`, none a row count — and that transcription independently killed `M8`, `M13` and `M20`. On the trailing newline see the note below |
| `A9` | **MET on the delivered build; (2)'s instrument was defeatable** | The entry point's whole process surface, measured: exactly `process.argv`, `process.exitCode`, `process.stderr`, `process.stdout`; no bracket access; the resolver contains no `process`/`globalThis`/`import.meta` at all. **But `M11` (`process["argv"]`, branched on after the resolver returned) shipped green** — armed |
| `A10` | **MET, independently and more strongly than asserted** | I compared `package.json` **key by key against real `git show 8dbc3db:package.json`**, not against the suite's transcription: top-level keys added **[]**, removed **[]**; reserved keys present **[]**; `private` still `true`; scripts added **["chess"]** = `"node src/cli.ts"`, none removed, **none changed**; `engines` and `devDependencies` byte-identical |
| `A11` | **MET (recorded), reproduced** | My own 9-run, round-0-discarded, n=8 reading: `node src/cli.ts` median **61.3 ms** (59.1–62.8), `npm run chess` median **147.5 ms** (144.5–153.6). Bar ≤ 1 s — two orders under it. Machine: Apple M3, 8 cores, 16 GB, Darwin 25.5.0 arm64, Node v24.12.0. The engineer read 68.8 / 150.3 on the same machine; we agree. **`plans/nfr-catalog.md` untouched by me** |
| `A12` | **MET, independent** | `git diff --name-only e140355~1 e140355` = exactly the **six** paths. All **18** merged production modules compared by **git blob SHA** `main@8dbc3db` vs `e140355`: **18/18 identical**. Licence edit is one element + a verbatim citation, `toEqual` intact, `FRAME_PRODUCERS` and the regex untouched. Suite green, skip **0** |

## The four bars

| bar | verdict | evidence |
|---|---|---|
| **1** — arguments are data, never code | **MET, independent** | Zero `eval`, `Function(`, `child_process`, `import(` in either production module; no shell on the path |
| **1b** — the delivered test file | **MET, with a trap in the bar's wording** | Executable text: **0** `exec(` call sites, **0** `execSync(`, **0** `shell:`; `spawnSync` in argv-array form, one call site, no concatenated argument. The bar's literal regexes over **raw** source return **1/1/1** — all in the file's own docblock quoting the forbidden spellings. See `Q5` |
| **3** — no argument reaches the terminal unsanitised | **MET, independent** | Non-vacuity first (`[2Jpurple` present), the echoed line carries zero C0 / `U+007F` / `ESC`, zero frame rows both channels, non-zero exit. `M13` (filter neutered) is killed by this bar |
| **4** — no filesystem and no network | **MET, independent** | Every specifier in both production modules is relative; the grammar matches none; `fetch`/`WebSocket`/`XMLHttpRequest` appear 0 times |

## What I could NOT confirm, stated plainly

1. **`G1` / `N8-LANE`'s formal reading.** I measured the cost independently and the bar is breached
   (separate note), but **the NFR ruling is Security/NFR's on this ticket and I did not make it.** I
   supply a number, not a verdict on the bar.
2. **`A11` as a *criterion*.** It is "recorded, not asserted" by design, so nothing in the suite
   holds it. My reading reproduces the engineer's, but a recorded reading is only as durable as the
   note it lives in — no instrument prevents it going stale.
3. **`A12`'s byte-identity and `A10`'s key-by-key halves are not held by any assertion** over the
   *tree* — `A12`'s suite row checks the licence array, and `A10`'s checks a **transcription** of
   `HEAD`. Both are MET, and both are held by diff review rather than by a test. That is what the
   ticket says (*"`A2`, `A3`, `A10`, `A12` are read off the diff"*), so it is a property of the
   design, not a defect — but it means a later hop that skips the diff read loses them silently.
4. **`A1`'s "no other setup" clause.** I ran in a worktree with `node_modules` symlinked from the
   main checkout, not from a fresh `npm install` in a clean clone. The command works; a genuinely
   cold `git clone && npm install && npm run chess` was not performed by me.

## One reading worth writing down so nobody re-measures it

`A8` says the stream *"ends with exactly one `\n` after the last row"*. The raw bytes end with **two
newline characters**. That is not a violation: the frame's **23rd row is the empty string**
(`[…, "                     ", "                     ", ""]`), so "one `\n` after the last row"
produces `…row22 \n <empty row> \n`. The delivered assertion is written against
`frame.join("\n") + "\n"` and therefore reads it correctly — `endsWith(join+"\n")` **true**,
`endsWith(join+"\n\n")` **false**. A reviewer who instead runs `tail -c 2` will see two newlines and
think `A8` failed. Recorded so that misread does not become a re-opened criterion.
