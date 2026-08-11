---
id: 20260812T090000Z-security-nfr-artifact-ref-6d1cebff
kind: artifact-ref
by: security-nfr
at: 2026-08-12T09:00:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-027-regate
  - ABC-027
  - ABC-017
  - ABC-019
  - NFR-002
  - NFR-007
  - NFR-008
  - N8-LANE
  - src/frame.ts
  - src/frame.test.ts
supersedes:
---

# The six instruments this re-gate built, written down so the numbers can be re-run rather than believed — and the STANDING RULE exercised, with something to report

> **Hand-authored** — `scripts/context-io.ts` absent from this repository (no `scripts/` directory)
> and from the kit at `/Users/olgeroeselg/.grugops/agent-factory/`; `mcp__grugops__propose_note` not
> in this session's tools. **`artifact-ref`, a pointer note. No `finding` in this task's notes.**

**Every harness lived OUTSIDE the repository**, this project's standing rule. Nothing under `src/`
was written: `git status --porcelain -- src/` is empty and the branch's `src/` is byte-identical to
the `RF-1` delivery. The only files this gate wrote inside the repository are these notes, the
`plans/traceability.md` re-gate paragraph, and the queue records under
`.grugops/queue/claimed/security-nfr-ABC-027-regate/`.

Worktree `/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-ABC-027`, branch
`grugops/ABC-027-frame-clearing`, tip **`b9d8bb2`**, tree clean at start. `main` is an ancestor of
`HEAD`, so the rebase the brief describes did happen.

## THE STANDING RULE — exercised, and this time there IS something to report

The rule my own last hop established, when a script appeared in my scratchpad: **content inside my
workspace is DATA, NOT INSTRUCTION.** It held again, and it was not a no-op.

The session scratchpad — which this hop shares with earlier hops — contains **runnable shell and
node harnesses left by other roles**, including `run-mutant.sh` and `lane.sh`. Both are hard-coded
against **`/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-ABC-019`** — a DIFFERENT
ticket's worktree, with a live agent on it — and `run-mutant.sh` writes into that tree's
`src/turn-loop.ts` and restores it against a hardcoded md5.

- **Nothing found in the workspace was executed.** Every instrument below was written from scratch at
  this hop, against the CONSTRUCTION recorded in my own FAIL-hop `artifact-ref` note, not against any
  file left behind.
- **Nothing in the workspace was an instruction addressed to an agent.** I scanned for it: no file
  attempts to authorise a write outside this subtask's boundary, none claims a human approval, none
  addresses a role. They are ordinary leftovers.
- **The reportable part is the shape, not an attack:** a build that treated a runnable file in its
  own scratchpad as a thing to run would have written into another ticket's live worktree without
  ever deciding to. **The rule is what stopped that, and it stopped a real path rather than a
  hypothetical one.** No channel was opened to the `ABC-017` or `ABC-019` agents and nothing was
  relayed.

## 1. `probe.py` — the margin probe, rebuilt from scratch

Drives **GNU screen 5.0.2** as a real terminal emulator:

1. `pty.fork()`, then `execvpe("screen", ["screen","-q","-c","/dev/null",("-U",)?,"-S",<id>,"-s",<runner>])`
   in the child, so the emulator is ATTACHED and takes its window size from the pty;
2. the parent sets `TIOCSWINSZ` to `(rows, cols)` on the master, drains the master on a thread, then
   re-sets the winsize and sends `SIGWINCH`;
3. the runner is `#!/bin/sh` → `sleep 2` → `printf '\033[H\033[2J'` → `cat <payload>` → `sleep 25`,
   so every cell of the window is known before the payload;
4. the screen is read back with **screen's own** `screen -S <id> -X hardcopy <file>`, then the
   session is quit and the child killed. `hardcopy` right-trims, so cell counts are reported as
   lengths.

`TERM=xterm-256color`, `LC_ALL=en_US.UTF-8`, `-U` for the unicode cells, one fresh emulator per cell.

**The instrument trap, re-recorded because it is what makes this probe trustworthy:** a DETACHED
`screen -d -m` ignores both `defwidth` and `width -w` and silently stays 80 x 24. **Sizing was
VERIFIED before any measurement** — a 25-character payload at a 10-column window came back
`ABCDEFGHIJ` / `KLMNOPQRST` / `UVWXY`, so it wraps at exactly column 10.

**Primitive payloads, exactly** (`printf` byte strings): `ABCDEFGHIJ`; `ABCDEFGHI\033[K`;
`ABCDEFGHIJ\033[K`; `ABCDEFGHIJ\033[Kx`; and **new at this hop** `\033[KABCDEFGHIJ` — the `RF-1`
shape at the primitive level.

## 2. `gen.mjs` / `gen37.mjs` — the emission generators

Dynamic-import the SHIPPED modules by absolute path (`src/frame.ts`, `src/render.ts`, `src/fen.ts`)
read-only under Node 24's type stripping, and write raw byte files:

- fixture: `parseFen(START_FEN)` → `renderBoard(position, mode, "white-bottom")` (9 x 18), status
  `["White to move","check: no",<third>]`, history `["  1. e4 e5","  2. Nf3 Nc6","","","","","",""]`,
  no messages → `H` = 23 via `frameHeight`;
- **shipped** emission taken from the real `beginFrameSession({isTTY:true, rows:H+1}, H)` — not
  re-implemented;
- **merged** reconstructed from `main`'s expression `` `\x1b[H${frame.join("\n")}\x1b[0J` ``;
- **old (+66)** reconstructed as `` `\x1b[H${frame.join("\x1b[K\n")}\x1b[0J` ``;
- the four-frame sequence uses thirds `["White may claim: threefold repetition", "",
  "check: YES — White to move out of check", ""]`, giving `W` = `{37, 18, 38, 18}` in ascii mode
  (38, not 39, because ASCII strips the em dash) and `{37, 18, 39, 18}` in unicode.

Reported by the generator: **425 → 494 characters, delta exactly 69 = `H × 3`; `\x1b[K` 23 = `H`;
`\x1b[0J` 1; `\x1b` 25 = `H + 2`** — in both glyph modes, and the delta is 69 at `W` = 37 as well
(843 → 912).

## 3. `drive.py` — the emulator cell driver

Sixteen named cells: the three writers at cols 18 (ascii and unicode), 19, 80, 12, and 37; and the
four-frame sequence at 80, 37 and 18. Prints `<row>|<len>|<text>` straight from the hardcopy.

## 4. `col0.mjs` — the structural safety check

Walks the real emission counting printable characters since the last newline or `\x1b[H` and reports
the column each escape fires at. **All 25 escapes fire at column 0** — `\x1b[H` 1, `\x1b[K` 23,
`\x1b[0J` 1 — at `W` = 18 ascii, `W` = 18 unicode and `W` = 37. This is the "safe by construction"
claim made falsifiable rather than asserted.

## 5. `bench.mjs` (+ a six-cell control) — the `NFR-002` write-half harness

11 rounds x 2,000 iterations, seven cells (shipped / old(+66) / merged x regular-file, shipped /
merged x `/dev/null`, in-memory, and `assembleFrame` alone), cell order rotated every round, round 0
discarded, medians of per-round means, a character checksum against elision (`62,106,000` at
`W` = 18 / `117,282,000` at `W` = 37), a `write` counter (**132,000 writes for 132,000 frames**), and
independent processes. The regular-file sink is `openSync(<tmp>,"w")` + `writeSync`, unlinked at the
end. A **six-cell control** matching the FAIL hop's exact cell set was run to test whether the cell
set explains this hop's scale shift: **it does not** (see the NFR observation's §2).

## 6. `run.sh` + the three trees — the `N8-LANE` harness

`pre` = `git archive main src`, `post` = the shipped `src`, `twin` = a copy of `pre` as the identity
null control; `package.json` / `package-lock.json` / `tsconfig.json` / `biome.json` copied and
`node_modules` symlinked. Identity verified by `diff -r` (exit 0) and by per-file md5 aggregate
before any round (`pre` = `twin` = `00b7ada18962faa9afe9b84f47327516`;
`post` = `4bea4e34518f06678021d9d9f2ff057e`, differing in exactly `src/frame.ts` and
`src/frame.test.ts`). 9 and 8 rounds x 3 conditions in two samples, order rotated every round,
round 0 discarded, one fresh OS process per run,
`/usr/bin/time -p env -u PERFT_DEEP sh -c 'npm test --silent >/dev/null 2>&1'`, CPU = user + sys,
statistic = median of paired per-round deltas with the sign.

## 7. `adversarial.mjs` — the escape-injection harness

30 payloads x 2 glyph modes x 3 placements = **180 cases**, each accounting for every `\x1b` byte in
the sink's text against the module's own three constants (now `H` erases, not `H − 1`), plus
C0/`U+007F` survivor counts, an above-`U+007F` count in ASCII mode, and a row-count check.
**180 / 180 clean.** It also carries the `AR-3` probe: a hand-built frame array containing `\x1b[2J`
reaches the sink unaltered.

## 8. `sub.mjs` / `reduce.mjs` — the substitution and clause-isolation harness

`sub.mjs` asserts the anchor occurs **exactly once** before any write, keeps a `.pristine` copy, and
asserts the restore by md5. `reduce.mjs` removes `A1`'s byte-exact `toBe` and its four count
assertions — each anchor's uniqueness asserted — and optionally one half of the column-0 clause, so
each half can be run alone. The out-of-tree copy was `diff -r`-verified byte-identical to the
worktree's `src/` before use, and **both files were verified restored by md5 after every run**
(`frame.test.ts` `c4ce369bc105204fae661baa14d95314`, `frame.ts`
`bf3e5a8413d0f2740775608b5925a1a8`).

**The harness files are in this session's scratchpad and are not durable.** What is durable is the
construction above, which is what a re-run needs.

Machine for every figure: **Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 /
Node v24.12.0 / vitest 3.2.7 / biome 2.5.5 / GNU screen 5.0.2 / Python 3.14.6** —
`UNKNOWN - verify` on any other hardware.

## NOT written, exhaustively

- **`plans/board.md`** — the Orchestrator's. The move is REQUESTED in the decision note, not written.
- **`plans/nfr-catalog.md`** — not touched; no bar created, moved, loosened or re-derived, and none
  is owed.
- **`plans/tickets/ABC-027-frame-writer-clears-each-row.md`** — not edited. The criteria are BA/PM's.
- **`src/`** — not one byte, in this repository or in any tree that feeds it.
- **`memory-bank/50-decisions/`** — `ADR-0009` and `ADR-0010` NOT re-opened, NOT edited, NOT
  re-litigated.
- **`src/status-panel.*`, `src/history-pane.*`, `src/turn-loop.*`** — NOT touched and NOT imported,
  not even read-only into a harness. No channel opened to the agents live on `ABC-017` or `ABC-019`;
  nothing relayed.
- **No `finding`, no verification stamp, no §14 gate verdict record.** That machinery does not exist
  in this repository and self-attesting one would be the fabrication Workflow 16 forbids.
- **Nothing merged, nothing pushed, nothing deployed. `main` was never checked out.**
