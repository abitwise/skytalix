---
id: 20261022T153720Z-qe-e2e-observation-dac2aa03
kind: observation
by: qe-e2e
at: 2026-10-22T15:37:20Z
verified_by: 
confidence: high (own runs, 15 plants x head/base)
refs:
  - ABC-189
  - AR-168-BINPIN
  - QE-168-b
  - 91883f94
  - deb555d2
  - 823a9885
  - plans/tickets/ABC-189-nothing-pins-the-value-of-package-json-bin-so-bin-pointing-at-src-uci-ts-passes-every-test.md
  - 20261021T143943Z-security-nfr-decision-75a45be0
  - 20261021T145301Z-ba-pm-observation-89ba3c6d
  - QE-189-b
supersedes: 
seal: sha256:8440e0c7be79f22489648c3dbbc1731ca9993e5bba55efd3bb660fbcd6d1a453
---

# qe-ABC-189: A2 red read. Every bin plant at head and at base, on scratch exports only

Method: `git archive <sha> | tar -x` into the session scratchpad, with `node_modules` symlinked. Each plant was a raw-text edit of the export's `package.json` only; the real file was never edited.
Then `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts -t "A10 — package.json"` ran, selecting 1 of 95 tests.
"Red" means `1 failed`, rc 1; "green" means `1 passed`, rc 0. "npm reads" is `@npmcli/package-json` `normalize`/`prepare` from npm 11.20.0, which give the same answer.

| plant | bin as parsed | head 91883f94 | base 823a9885 | fires on | npm reads | should it go red |
|---|---|---|---|---|---|---|
| real | {skytalix: dist/uci.js} | green | green | — | same | no (correct) |
| (iv-b) page | {skytalix: src/uci.ts} | **red** | green | :1823 pin | src/uci.ts | yes: the AR-168-BINPIN mutant |
| (iv-a) page | {skytalix: dist/cli.js} | **red** | green | :1823 pin | dist/cli.js | yes |
| bare string | "dist/uci.js" | red | green | :1823 pin | {skytalix: dist/uci.js} | no, but harmless: an equivalent spelling (QE-189-b) |
| extra second key | {skytalix, skytalix-chess: dist/cli.js} | red | green | :1823 pin | both keys | yes: it adds a command |
| empty object | {} | red | green | :1823 pin | undefined | yes |
| bin key removed | absent | red | **red** | :1818 key list (the pin is not reached) | undefined | yes; ABC-168's key list already held it at base |
| ./dist/uci.js | {skytalix: ./dist/uci.js} | red | green | :1823 pin | {skytalix: dist/uci.js} | no, but harmless (QE-189-b) |
| wrong command name | {skytalix-uci: dist/uci.js} | red | green | :1823 pin | skytalix-uci | yes |
| name case | {Skytalix: dist/uci.js} | red | green | :1823 pin | Skytalix | yes |
| dist/uci.ts | {skytalix: dist/uci.ts} | red | green | :1823 pin | dist/uci.ts | yes |
| trailing space | {skytalix: "dist/uci.js "} | red | green | :1823 pin | "dist/uci.js " | yes |
| backslash | {skytalix: dist\uci.js} | red | green | :1823 pin | {skytalix: dist/uci.js} | no, but harmless (QE-189-b) |
| array | ["dist/uci.js"] | red | green | :1823 pin | {uci.js: dist/uci.js} | yes: it renames the command |
| duplicate key, real last | src/uci.ts then dist/uci.js | green | green | — | {skytalix: dist/uci.js} | no: JSON.parse and npm both keep the last key |
| duplicate key, real first | dist/uci.js then src/uci.ts | red | green | :1823 pin | src/uci.ts | yes |

- **The page's cases:** the real file is green at head, and `(iv-b)` and `(iv-a)` are red at head with `AR-168-BINPIN` in the message.
  The (iv-b) message is `package.json bin (AR-168-BINPIN): expected { skytalix: 'src/uci.ts' } to deeply equal { skytalix: 'dist/uci.js' }`, word for word as the page states.
  All three cases are green at base. The base (iv-b) green is the gap this ticket closes.
- **Repeated with a full copied `node_modules`** (`cp -a`, 111M) on fresh exports. The page's six readings are identical.
- **"A10 alone".** On (iv-b) at head, the whole `src/cli.test.ts` gives `1 failed | 94 passed`. The whole suite (`npm test` in the export) gives 1 failed / 1994 passed, and 1 failed / 59 passed files.
  The only failure is `ABC-042 … > A10 — package.json …`. On (iv-b) at base, the whole suite gives 60/60 and 1995/1995 with rc 0.
- **Count.** Of my 13 own plants, the pin alone catches 11 at head that base misses. Base catches `bin` removed, through the key list. Duplicate-key-real-last is not a wrong bin under npm.
  Three of the 11 are npm-equivalent spellings (QE-189-b).
