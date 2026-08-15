---
id: 20260815T130800Z-uat-planner-observation-the-amendment-run-two-new-scenarios-executed-and-four-facts-re-measured-a2c53294
kind: observation
by: uat-planner
at: 2026-08-15T13:08:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - EPIC-006
  - src/cli.ts
  - src/cli-options.ts
  - src/glyph-mode.ts
  - package.json
  - AGENTS.md
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - .grugops/context/uat-ABC-042-bapm/notes/20260815T112136Z-ba-pm-observation-the-corrected-uat6-scenario-ruled-sound-not-weakened-with-one-narrow-loss-fca3368c.md
  - .grugops/context/uat-ABC-042-qe/notes/20260815T112612Z-qe-e2e-observation-the-uncriterioned-behaviours-and-two-one-word-mutations-the-suite-cannot-see-ecf312e9.md
supersedes: 
---

# The amendment run — the two NEW scenarios executed, and four facts re-measured rather than carried

**Nothing in the amended pack is written from memory.** Every scenario this amendment adds was RUN
before it was written, and every clause it re-words was re-measured. **Two of the four re-measurements
corrected something the first pack said**, and both corrections are against my own text, not against
the product.

**This is an agent's execution and report, NOT an acceptance.** No box in the pack's § 9 is ticked,
no `finding` kind and no `verified_by` stamp is used — `context.human_admission` is `off` on this
install (`AGENTS.md` § Role / workflow files).

## 0. The tree under test — re-proved, because `main` MOVED since the first run

`main` was `eebbaa3d…` when the pack was built; it is **`79ee83ef40e1bea2a88c64155d4371118c9e0199`**
now (the pack itself merged). **The product did not move with it:**

```
$ git diff main --stat -- src package.json      # empty, exit 0
$ git rev-parse main:src   grugops/uat-ABC-042-amend:src
2b35f71cb939de02fc30f41821b2847250dc51ee
2b35f71cb939de02fc30f41821b2847250dc51ee
$ git rev-parse main:package.json   grugops/uat-ABC-042-amend:package.json
81d3a85ae064041428c3d8ad3720f42edb9a7071
81d3a85ae064041428c3d8ad3720f42edb9a7071
```

**The `src/` tree object and the `package.json` blob are byte-identical to `main`**, and identical to
the hashes the pack hop and the QE hop each recorded independently. Branch
`grugops/uat-ABC-042-amend`, cut **by name** from `grugops/uat-ABC-042-followups` at its tip
`6ae562925041497699d7dbc00ec16141201827ce`, in a **private `git worktree`**: the shared worktree's
`HEAD` was never moved and none of its files were touched.

| item | value |
|---|---|
| machine | Apple M3, 8 cores, host `MacBook-Air.local` |
| OS | Darwin 25.5.0, arm64 |
| Node | v24.12.0 |
| npm | 11.7.0 |
| working copy | private `git worktree` under the session scratchpad |

**Recorded rather than smoothed:** the pack hop and the QE hop both recorded host `Mac.lan`; this hop
ran on `MacBook-Air.local`. Same CPU brand, OS, Node and npm; I do not assert it is the same box.

**`npm install` was NOT run on this hop, and every command below still worked** — `node_modules` does
not exist in this worktree (checked: `[ -d node_modules ]` → NO). **The product needs no installed
dependency to draw a board**; `npm install` is needed for the test suite, not for the command a signer
types. This corrects the first pack's entry criterion 6, which required it.

## 1. UAT-18 — the twelve blank move-list rows (NEW, closes gap `B7`)

**Command run:** `npm run chess`, stdout captured to a file, then measured.

```
$ npm run chess > /tmp/amend-run1.txt 2>/tmp/amend-run1.err ; echo $?
0
$ wc -l < /tmp/amend-run1.txt         # 27  = 4 runner banner lines + a 23-row frame
$ wc -c < /tmp/amend-run1.err          # 0   bytes on stderr
```

The frame, exactly as it came back (stdout lines 5–27; `$` marks end of line):

```
 5  8 .r:n.b:q.k:b.n:r   $      <- eight rank rows
 …
12  1 :R.N:B.Q:K.B:N.R   $
13     a b c d e f g h   $      <- the file letters  (9 board rows)
14  White to move  1.    $      <- 2 status rows
15  material: 0          $
16                       $      <- 12 move-list rows, ALL BLANK
…
26                       $
27                       $
```

| measurement | result |
|---|---|
| total frame rows | **23** |
| rows after the `material: 0` line | **12** |
| of those twelve, rows containing any non-space character | **0** |
| width of each of the first eleven | **21 characters, all spaces** |
| the twelfth | **zero characters**, followed by the stream's single trailing `\n` |
| `\x1b` bytes anywhere in stdout | **0** |
| exit code | **0** |

**Under a real pseudo-terminal** (`script -q /dev/null npm run chess < /dev/null`, exit `0`) the same
twelve rows come back blank — the count is 12 on a pipe and 12 on a terminal, so what the agent
measured is what the signer will see. *(The pty capture carries one extra line after the frame —
`ESC[1G ESC[0K`, the package runner tidying its own progress spinner. It is the runner's, not the
program's, and it is the same artifact the first run note recorded.)*

**UAT-18: PASS** — twelve blank rows, on both surfaces, exactly as § 7 point 4 says.

## 2. UAT-19 — saved to a file, the board is plain letters (NEW, closes gap `B1`)

`A7`'s first half — *"given stdout is a pipe and no flags, the entire emitted stream carries zero code
points above `U+007F`"* — had no scenario in the first pack. **Command run:**

```
$ npm run chess > /tmp/amend-board.txt ; echo $?
0
```

| measurement | result |
|---|---|
| chess figures (`U+2654`–`U+265F`) in the file | **0** |
| bytes above `U+007F` in the file | **0** |
| piece letters present | `K Q R B N P` and `k q r b n p`, all twelve |
| exit code | **0** |

**UAT-19: PASS.**

## 3. UAT-6's widened clause, re-verified over ALL THREE frame regions

BA/PM ruled the mid-run correction sound but named one real loss: the corrected clause said *"the
board or the status line"* and the frame has **three** regions — 9 board rows, 2 status rows and
**12 move-list rows**. The amended clause is *"anywhere in the 23-row frame the program writes"*.
**Re-run against that wider clause, ten times:**

```
$ for i in $(seq 10); do npm run chess -- --colour random > r.out 2> r.err ; … ; done
white-bottom runs: 7    black-bottom runs: 3
occurrences of the word `random` in the 23-row frame + stderr, across all ten runs: 0
```

Both sides appeared (7 / 3). **The word `random` occurs zero times in any of the three frame regions
and zero times on stderr, over ten runs.** Its only occurrence in the whole stream is stdout line 3 —
`> node src/cli.ts --colour random`, the package runner echoing the command line, above the frame.
**The widened clause costs the scenario nothing and it passes as widened.**

## 4. UAT-13's method, run as printed (closes gap `B2`)

The first pack told a non-engineer to time ten runs and take a median, and named no instrument. The
amended pack marks the timed reading **preparer-run, signer-witnessed** and prints the exact command,
**which was executed to produce this row**:

```
$ for i in $(seq 10); do /usr/bin/time -p npm run chess > /dev/null; done 2>&1 \
    | awk '/^real/{print $2}' | sort -n
0.16 0.16 0.16 0.16 0.16 0.16 0.17 0.17 0.17 0.21
```

**Median (the 5th and 6th of ten): 0.16 s = 160 ms, against a 1 000 ms bar.** Consistent with the
first run's 167 ms on the same class of machine. **UAT-13: PASS.**

## 5. THE CORRECTION THAT MATTERS — my own UAT-8 evidence was non-discriminating

QE's mutation `M1` showed the automated suite cannot see `--ascii` reaching the renderer. **Checking
my own run against that, the first pack's UAT-8 evidence has the same blindness, and I did not notice
it when I recorded the PASS.** Measured now:

```
$ diff <(tail -n 23 piped-default.txt) <(tail -n 23 piped-ascii.txt)
IDENTICAL frames (piped default == piped --ascii)
```

**On a pipe, `npm run chess` and `npm run chess -- --ascii` produce byte-identical frames**, because
`selectGlyphMode`'s row 1 (`--ascii` wins) and row 3 (a sink that cannot be seen gets the portable
form) agree there. **Every command an agent runs is piped. So the piped run that recorded UAT-8 PASS
could not distinguish "the flag worked" from "the pipe rule worked."** The PASS is not withdrawn —
it is **re-evidenced**, on the surface where the test discriminates:

| command, under a REAL pseudo-terminal (`script -q /dev/null … < /dev/null`) | exit | chess figures |
|---|---|---|
| `npm run chess` (no flags) | `0` | **32** |
| `npm run chess -- --ascii` | `0` | **0** — letters: `8 .r:n.b:q.k:b.n:r` |
| `npm run chess -- --unicode` | `0` | **32** |

**On a terminal the scenario is fully discriminating and the product is correct.** The consequence
for the pack, and it is now written into UAT-8: **the signer's own run at his own terminal is the
strongest evidence UAT-8 will ever have** — stronger than the agent's, and stronger than the suite's,
which QE proved blind here.

## 6. The missing `--` separator, re-measured — "silently" was MY word and it is wrong

The first pack's § 5 said `npm run chess --ascii` throws the option away **silently** and *"the user
never told"*; BA/PM carried that forward as `M1`, its highest-value signing item. **Measured again,
with stderr captured this time:**

| what was run | exit | what actually happened |
|---|---|---|
| `npm run chess --ascii`, piped | `0` | 23-row frame, **0 figures**; **96 bytes on stderr**: `npm warn Unknown cli config "--ascii". This will stop working in the next major version of npm.` Banner line 3 is `> node src/cli.ts` — **the program received no arguments** |
| `npm run chess --ascii`, under a real terminal | `0` | the same warning, **colourised**, then a board of **32 chess figures** — the exact opposite of what was asked for |
| `npm run chess -- --ascii`, under a real terminal (control) | `0` | **0 figures** — letters, correct |
| `npm run chess --colour black`, piped | `1` | two `npm warn` lines, then `unrecognised argument: black` |

**Two corrections to my own text, and one sharpening:**

1. **It is not silent.** The runner prints `npm warn Unknown cli config "--ascii"` on stderr, on a
   pipe and on a terminal, deterministically (three runs, three warnings). What it does **not** say
   is that the chess program never saw the option.
2. **On a terminal the wrong result is VISIBLE**: you ask for letters and get 32 chess figures. On a
   pipe it is invisible, because the pipe already gives letters. **The first pack described the pipe
   case and called it the general one.**
3. **`B4` is unaffected and stands.** `AGENTS.md` § Commands still never prints the `--` form, and a
   reader who combines its command with its option list still gets a board that is not the one he
   asked for, with exit `0`. Only the word *"silently"* is wrong — and whoever cuts the `AGENTS.md`
   documentation ticket should carry *"the runner warns in runner language and draws the default
   board"*, not *"the user is never told"*.

## What this run did NOT do

- **It did not run the automated test suite.** QE re-measured it on this same tree object (856/856 on
  30 files, skip 0, integrity clean) and that stands; nothing here disputes a number of theirs.
- **It touched no product file.** `src/` and `package.json` are byte-identical to `main` after the run
  as they were before it; `git status` in this worktree shows only queue records and this notes folder.
- **It did not re-run the other fifteen scenarios.** They are unchanged in substance and their results
  stand on the first run note, which this note does not supersede.
- **It signed nothing.**
