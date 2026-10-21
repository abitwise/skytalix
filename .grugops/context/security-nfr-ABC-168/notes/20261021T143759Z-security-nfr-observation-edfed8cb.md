---
id: 20261021T143759Z-security-nfr-observation-edfed8cb
kind: observation
by: security-nfr
at: 2026-10-21T14:37:59Z
verified_by: 
confidence: high (instrument run on the delivery pair; plants in scratch, outside the repository)
refs:
  - ABC-168
  - EPIC-007
  - grugops/ABC-168
  - grugops/qe-ABC-168
  - b71f8902
  - 6d27dc9e
  - c98509b3
  - ADR-0036
  - ADR-0036 S1 Ruling 2
  - ADR-0044
  - ABC-041
  - AR-163-DELONLY
  - AR-095-CWD
  - AR-162-FALLBACK
  - AR-180-VALIDATED
  - AR-183-CWDARG
  - QE-168-b
  - QE-168-c
  - QE-172-a
  - V5.3.2
  - V1.2.5
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - 20261021T142929Z-qe-e2e-observation-b1a6b8ef
  - 20261021T142929Z-qe-e2e-observation-7547ac22
supersedes: 
seal: sha256:a620ff361a67e69de249ea27cf5023145289e104b58bc236cb2ad943e6cbd9e6
---

# ABC-168 Security/NFR readings: clause (b) limbs 1 and 2 FIRE, limb 3 silent; book read is module-URL on both launch paths (4 plants); a second limb-1 holder appears; QE's two deletion-only mutants fire nothing on any limb; clause (a) clean

Delivery pair `c98509b3..b71f8902`. The QE merge `6d27dc9e` is identical to `b71f8902` in `src/`, `data/`, `package*.json` and `tsconfig*` (`git diff --quiet`). Plants ran only in scratch extracts outside the repository. No timing was taken; `go movetime 100` is a dialogue limit, not a reading.

## 1. Clause (b), canonical instrument `.grugops/context/design-F-072-1/probe/clause-b.mjs` (at `87d3897d`)
- Production files changed: 1, `src/uci.ts`. Nothing is unresolved or disputed on any limb.
- **Limb 1 FIRES.**
  - (b1) `src/uci.ts:25`, `import { createInterface } from "node:readline"`.
  - Ruling 2: holders 1 at `<base>`, 2 at `<head>` (`src/book-file.ts`, `src/uci.ts`). It fires on `src/uci.ts` (90 `+` lines). `src/book-file.ts` has 0 changed lines, so Ruling 2 is silent on it.
  - (b2) `src/uci.ts -> src/book-file.ts` (holds it). This is the second importer that `ADR-0036` § S1 Ruling 1 predicted would fire. The edges to `book.ts` and `uci-session.ts` reach no holder.
- **Limb 2 FIRES.** (b1) 7 lines: `uci.ts:37-39` (argv length, usage to stderr, exit code 1), `:43-44` (stdout and stdin acquired once), `:83-84` (fixed internal-error line, exit code 70). (b2) none.
- **Limb 3 does not fire.** There are 0 call spans, and production has 0 limb-3 holders.
- **Holders at `<head>`:** 5 distinct files. Limb 1: `book-file.ts` and `uci.ts`. Limb 2: `cli.ts`, `glyph-mode.ts`, `perft-bench.ts` and `uci.ts`.
- **Importers of `src/uci.ts` at `b71f8902`:** 0 (`git grep` for `./uci` imports in `src/`). The lane spawns it and does not import it.
- **By-hand Ruling 2 check** (holders at `<base>` and `<head>`: `src/book-file.ts`, `src/uci.ts`): `git diff --name-only --no-renames c98509b3 b71f8902 -- <both>` lists `src/uci.ts`.

## 2. The book read on the launch path (scratch: `git archive b71f8902`, `npm run build` rc 0, 22 files)
Dialogue: `uci`, `isready`, `position startpos`, `go movetime 100`, `quit`.
- P1: `node <x>/src/uci.ts` from a neutral cwd that holds a non-JSON decoy at `./data/opening-book/book.json` gives `readyok`, `info string book`, `bestmove d2d4`; rc 0, 0 B stderr.
- P2: the same with `<x>/dist/uci.js` gives `info string book`, `bestmove e2e4`; rc 0, 0 B stderr.
- P3: `dist` copied away (no `../data` beside it), with the cwd holding the **real** book at `./data` gives exactly one `info string opening book could not be read; playing on without it`, then `bestmove g1f3`; rc 0.
- P4: the same away copy, run from its own parent, gives the same single warning; rc 0.
- So both launch paths read `new URL("../data/opening-book/book.json", import.meta.url)`: one fixed path that ignores the cwd. That is the same constant read the CLI binds (`cli.ts:179` and `uci.ts:72` both bind `read: readBookFile`, unedited). `book-file.ts`, `book.ts`, `uci-session.ts` and `cli.ts` are unchanged at this pair.
- The warning text is fixed. Its reasons are the 5 `BookRefused` literals plus `could not be read`. It carries no file byte and no `fs` error message or path.

## 3. Deletion-only plants in `src/uci.ts` (scratch git repo from `b71f8902`)
- D1, QE's mutant (iii): delete `process.exitCode = INTERNAL_ERROR_EXIT_CODE;` (0/1).
- D2, QE's mutant (i-b): delete the 4-line `sink.on("error", …)` EPIPE arm (0/4).
- **Instrument: limbs 1, 2 and 3 all "does not fire" on both plants.** Ruling 2 shows "holder files with + lines: 0".
- The by-hand `--name-only` check lists `src/uci.ts` on both.
- QE (`…b1a6b8ef`) read both mutants green on `npm test` and on the `UCI_DEEP` lane. Only hand criteria A3 and A4 catch them.

## 4. Clause (a)
- `package.json` adds `bin: { skytalix: "dist/uci.js" }`, changes `build` to `tsc -p tsconfig.build.json` and adds `uci: "node src/uci.ts"`.
- `devDependencies` are identical to base. There is no `dependencies` key. No lifecycle script was added (no pre/post, `prepare` or `install`). `private: true` and `license: UNLICENSED` stay.
- `package-lock.json` numstat is empty. The lock root `packages[""]` has neither `bin` nor `license` (the drift `security-nfr-ABC-172` measured at +4 root lines). QE's fresh-clone `npm ci` rc 0 (`…7547ac22`).

## 5. Clause (c) and the input path
- `src/uci.real-engine.test.ts` uses `spawnSync(process.execPath, argv, { env: CHILD_ENV })`: an argument array, no shell, a fixed argv, an empty environment, a `timeout` and a loud throw on `child.error`. This is the form `cli.real-engine.test.ts` already holds, so (c) adds no new kind of capability.
- stdin comes through `node:readline` with `crlfDelay: Infinity` and no line-length cap. The only writer is the parent that launched the child.
- The session drops C0 and U+007F (`printableOf`, `uci-session.ts:80`).
- Every stdout byte goes through `write()`. stderr carries only the two fixed lines (usage and internal error), and the thrown value is never echoed.
