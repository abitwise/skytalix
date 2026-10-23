---
id: 20261023T211544Z-security-nfr-observation-37c4164f
kind: observation
by: security-nfr
at: 2026-10-23T21:15:44Z
verified_by: 
confidence: high (instrument output on the delivered pair; one-process holder probe in scratch; source reads; no lane or timing run)
refs:
  - ABC-203
  - security-nfr-ABC-203
  - EPIC-006
  - ADR-0047
  - ADR-0036
  - NFR-008
  - N8-LANE
  - N8-SPAWN
  - V5.3.2
  - 55a8f4ef
  - 5e23e249
  - 8fa09e14
  - 730666fb
  - src/pgn-file.ts
  - src/cli.ts
  - plans/tickets/ABC-203-at-game-end-npm-run-chess-writes-the-game-as-a-standard-pgn-file-under-games.md
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - arch-design-ABC-203/20261023T195428Z-architect-design-decision-e6de1e00
  - qe-ABC-203/20261023T210415Z-qe-e2e-decision-f28588e1
  - qe-ABC-203/20261023T210415Z-qe-e2e-observation-1f3c2e3d
  - qe-ABC-203/20261023T210415Z-qe-e2e-observation-2f8e789e
  - qe-ABC-203/20261023T210415Z-qe-e2e-observation-5b146b4b
  - QE-203-c
supersedes: 
seal: sha256:f3422b2e80eb89906e4d1cd8f0e0164e38f9c06821c0c1fb3f9463f4f30beb2e
---

# ABC-203 Security/NFR readings: clause (b) on 55a8f4ef..5e23e249, the shipped holder under four probes, and the source reads behind D2/D4/D5

Pair: base `55a8f4ef` (merge-base with `main`), build `5e23e249`. QE's merge `8fa09e14` has the same `src/`, `package.json` and lock (`git diff --stat` empty). Host load1 6.4 at the start (two other hops live). No vitest, no lane, no timing was run.

## 1. ADR-0036 clause (b), canonical instrument

`.grugops/context/design-F-072-1/probe/clause-b.mjs`, sha256 `24b963b1…6d94c58b` (last commit `0dfd17b3`). Run from main's checkout, because the fresh worktree has no `node_modules` (the instrument imports `typescript`). It reads git only.

- **Limb 1: FIRES.**
  - (b1) 1 line: `src/pgn-file.ts:23` `import { closeSync, mkdirSync, openSync, unlinkSync, writeFileSync } from "node:fs"`.
  - Ruling 2: holders 2 at `<base>` (`book-file.ts`, `uci.ts`), 3 at `<head>`; `src/pgn-file.ts` 74 `+`, 0 `-`.
  - (b2) 7 new runtime edges; 1 reaches a holder: `src/cli.ts -> src/pgn-file.ts`. The other 6 reach none (`cli.ts -> pgn.ts`, `pgn-file.ts -> pgn.ts`, `pgn.ts -> apply.ts / fen.ts / result-screen.ts / san.ts`).
  - 1 word hit (the holder's JSDoc), not counted.
- **Limb 2: FIRES.** (b1) 1 line: `src/cli.ts:245` `else process.stderr.write(\`PGN not saved: ${saved.code}\n\`)`. (b2) 0 edges reach a limb-2 holder. 2 word hits in the holder's JSDoc.
- **Limb 3: does not fire.** 0 lines, 0 edges, 0 word hits.
- **Baseline at `<head>`:** 46 production files. Limb 1 holders: `book-file.ts`, `pgn-file.ts`, `uci.ts`. Limb 2: `cli.ts`, `glyph-mode.ts`, `perft-bench.ts`, `uci.ts`. Limb 3: none. **6 distinct holders** (5 at `<base>`), so `pgn-file.ts` is the sixth.
- Every line the page and the Architect predicted (`…e6de1e00`; page § What Security/NFR must check, item 1) is what the instrument printed.

## 2. The shipped holder under four probes

One node process. It imports `src/pgn-file.ts` and `src/pgn.ts` from the worktree by absolute URL, with a scratch `mkdtemp` cwd per case. Node 26.11.1, macOS, non-root, umask 022.

| case | result |
|---|---|
| link at the file name `games/<stem>.pgn` pointing at an **existing** victim file | `{ok:true, path:"games/<stem>-2.pgn"}`. The victim still reads `VICTIM`. `"wx"` refused the link (EEXIST) and moved on, so nothing was written through it |
| `games` is a link to a directory | `{ok:true}`. The file lands in the target, and `games` is still a link. This confirms the Architect's `fs-probe.out` |
| created file mode | `644` (0666 masked by umask 022) |
| `pgnStamp` on `new Date(NaN)`, year −1, `new Date(8.64e15)` | `skytalix-NaNNaNNaN-NaNNaNNaN`, `skytalix--10101-013900`, `skytalix-2757600913-030000`. Only `[A-Za-z0-9-]`: no `/`, no `.`, no `\` |

The Architect's probe (`arch-design-ABC-203/probe/fs-probe.out`) covers the rest: a `games` regular file gives EEXIST at mkdir, mode 0555 gives EACCES at open, a dangling link at the file name gives EEXIST, and a dangling `games` link gives ENOENT.

## 3. Source reads at `5e23e249`

- **Path (D2/D3).** `writePgnFile(startedAt: Date, text: string)`. The path is the literal `games/` + `pgnStamp(startedAt).stem` + an optional `-2`..`-99` + `.pgn`. `text` reaches only `writeFileSync(descriptor, text)`. `cli.ts` passes `new Date()`, read once before `runTurnLoop(`.
- **Bytes.** `formatPgn` tag values come only from closed sets: fixed strings, `Difficulty` (1–5), the resolved colour (`white`/`black`) and the `Date`'s digits. Movetext is SAN from legal moves. The comment is `resultHeadline`'s fixed rows. **No typed or argv text reaches the file**, so there is no tag or comment injection.
- **D4.** `mkdirSync("games", {recursive:true})`, then `openSync(path,"wx")` per candidate, with EEXIST moving to the next suffix. The bytes go to the fd, then `closeSync`. On a write or close failure the code runs `unlinkSync(path)` (**unguarded**, line 70), then returns the first failure's code.
- **D5.** `errnoOf` returns a code matching `^E[A-Z0-9]+$` and rethrows anything else. `cli.ts`'s session handler is `catch {` (it binds nothing) and writes only the fixed `INTERNAL_ERROR` string, then exit 70. **No message or stack can reach stderr through the rethrow.**
- **QE-203-c's path.** If `unlinkSync` throws, its errno error leaves `writePgnFile` uncaught and reaches that same `catch {`. That gives exit 70, the fixed line and a partial file left behind. This is what QE reproduced. It leaks nothing.
- **Lane guards that bound a new call (source).** In `src/cli.test.ts`: L4526 checks that the neutral directory's `games/` holds exactly one file per child that printed `PGN saved:`, and L3289 checks that `cli.ts` has exactly one `` sink.write(`PGN saved: `` call. QE's plants P1, P2 and P6 red the L4526 guard (`qe-ABC-203/raw/plants-results.json`).
- **The writer's child.** `src/pgn.test.ts` holds one spawned child (the Architect's ruling, item 2). The page's criteria text names no child: the NFR trigger says "0 new spawns" (page L197–199).
