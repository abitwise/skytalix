---
id: 20260811T235500Z-security-nfr-artifact-ref-e91b47d2
kind: artifact-ref
by: security-nfr
at: 2026-08-11T23:55:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-027
  - ABC-027
  - NFR-002
  - NFR-007
  - N8-LANE
  - src/frame.ts
  - src/frame.test.ts
supersedes:
---

# The four instruments this gate built, written down so the numbers can be re-run rather than believed

> **Hand-authored** — `scripts/context-io.ts` absent here and from the kit,
> `mcp__grugops__propose_note` not in this session's tools. **`artifact-ref`, a pointer note.**

**Every harness lived OUTSIDE the repository**, this project's standing rule. Nothing under `src/` was
written: `git status --porcelain -- src/` is empty and the branch's `src/` is byte-identical to the
Engineer's delivery. The only files this gate wrote inside the repository are these notes and the
queue records under `.grugops/queue/claimed/security-nfr-ABC-027/`.

The harness files themselves are in this session's scratchpad and are not durable. **What is durable
is below: each instrument's construction and its exact inputs, which is what a re-run needs.**

## 1. `probe2.py` — the margin probe (the one that answers the open question)

Drives **GNU screen 5.0.2** as a real terminal emulator:

1. `pty.fork()`, then `execvpe("screen", ["screen","-q","-c","/dev/null","-S",<id>,"-s",<runner>])` in
   the child, so the emulator is ATTACHED and takes its window size from the pty;
2. the parent sets `TIOCSWINSZ` to `(rows, cols)` on the master, drains the master on a thread, then
   re-sets the winsize and sends `SIGWINCH` — the sizing was **verified** by a run that wraps at
   exactly column 10, because a detached `screen -d -m` ignores both `defwidth` and
   `width -w` and silently stays 80 × 24 (an instrument trap this gate fell into first and records
   here so the next reader does not);
3. the runner is `#!/bin/sh` → `sleep 2` → `printf '\033[H\033[2J'` → `cat <payload>` → `sleep 25`, so
   every cell of the window is known before the payload;
4. the screen is read back with **screen's own** `screen -S <id> -X hardcopy <file>` — the emulator's
   buffer, not a model. `hardcopy` right-trims, so cell counts are reported as lengths.

`TERM=xterm-256color`, `LC_ALL=en_US.UTF-8`, `-U` added for the unicode cell. One fresh emulator per
cell.

**Payloads, exactly** (`printf` byte strings):

| name | bytes |
|---|---|
| `p_fill` | `ABCDEFGHIJ` |
| `p_short_el` | `ABCDEFGHI\033[K` |
| `p_fill_el` | `ABCDEFGHIJ\033[K` |
| `p_fill_el_x` | `ABCDEFGHIJ\033[Kx` |

## 2. `gen.mjs` / `gen-seq.mjs` / `gen-alt.mjs` — the emission generators

Dynamic-import the DELIVERED modules by absolute path
(`src/frame.ts`, `src/render.ts`, `src/fen.ts`) read-only under Node 24's type stripping, and write
raw byte files:

- fixture: `parseFen(START_FEN)` → `renderBoard(position, mode, "white-bottom")` (9 × 18), status
  `["White to move","check: no",<third>]`, history `["  1. e4 e5","  2. Nf3 Nc6","","","","","",""]`,
  no messages → `H` = 23 via `frameHeight`;
- **delivered** emission taken from the real `beginFrameSession({isTTY:true, rows:H+1}, H)` — not
  re-implemented;
- **merged** emission reconstructed from `main`'s expression: `` `\x1b[H${frame.join("\n")}\x1b[0J` ``;
- **candidate** emission built here and NOT written into `src/`:
  `` `\x1b[H\x1b[K${frame.join("\n\x1b[K")}\x1b[0J` ``;
- the four-frame sequence uses thirds `["White may claim: threefold repetition", "",
  "check: YES — White to move out of check", ""]`, giving `W` = `{37, 18, 38, 18}` in ascii mode
  (38, not the ticket's 39, because ASCII mode strips the em dash) and `{37, 18, 39, 18}` in unicode.

Reported by the generator and independently confirming `A1`: **425 → 491 characters, delta exactly
66 = `(H − 1) × 3`; `\x1b[K` count 22 = `H − 1`; `\x1b[0J` count 1; `\x1b` count 24 = `H + 1`** — in
both glyph modes.

## 3. `bench.mjs` — the `NFR-002` write-half harness

11 rounds × 2,000 iterations, six cells (delivered/merged × regular-file//dev/null, plus in-memory and
`assembleFrame`), cell order rotated every round, round 0 discarded, medians of per-round means,
checksum of characters sunk (`56,304,000` at `W` = 18 / `106,464,000` at `W` = 37) against elision, a
`write` counter (**120,000 writes for 120,000 frames**), two independent processes. The regular-file
sink is `openSync(<tmp>, "w")` + `writeSync`, unlinked at the end.

## 4. `run.sh` + the three trees — the `N8-LANE` harness

`pre` = `git archive main src`, `post` = the delivered `src`, `twin` = a copy of `pre` as the identity
null control; `package.json` / `package-lock.json` / `tsconfig.json` / `biome.json` copied and
`node_modules` symlinked. Identity verified by `diff -r` and by per-file md5 aggregate before any
round (`pre` = `twin` = `df71fb293d653eaa5e811986a81e04f7`; `post` = `6d016f6ab39af927913245c48c6a4ab8`,
differing in exactly `src/frame.ts` and `src/frame.test.ts`). 8 rounds × 3 conditions, order rotated
every round, round 0 discarded, one fresh OS process per run,
`/usr/bin/time -p env -u PERFT_DEEP sh -c 'npm test --silent >/dev/null 2>&1'`, CPU = user + sys,
statistic = median of paired per-round deltas with the sign reported.

**An instrument trap recorded because it produced silently EMPTY data first:** redirecting the whole
`/usr/bin/time` invocation's stderr discards `time`'s own output as well as the command's. The command
must be wrapped (`sh -c '… >/dev/null 2>&1'`) so only its stderr is dropped.

## 5. `adversarial.mjs` — the escape-injection harness

30 payloads × 2 glyph modes × 3 placements = **180 cases**, each accounting for every `\x1b` byte in
the sink's text against the module's own three constants, plus C0/`U+007F` survivor counts, an
above-`U+007F` count in ASCII mode, and a row-count check. **180 / 180 clean.** Payload list is in the
security observation note.

Machine for every timing above: **Apple M3 (Mac15,13) / 8 logical cores / Darwin 25.5.0 arm64 /
Node v24.12.0 / vitest 3.2.7**, `UNKNOWN - verify` on any other hardware.
