---
id: 20261021T091812Z-qe-e2e-observation-9caa5ead
kind: observation
by: qe-e2e
at: 2026-10-21T09:18:12Z
verified_by: 
confidence: high
refs:
  - ABC-180
  - AR-162-FALLBACK
  - AR-095-CWD
  - grugops/ABC-180
  - acb52edf
  - d9c3cca3
  - ccccc6bb
  - e68962d6
  - grugops/qe-ABC-180
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md
  - 20261021T090610Z-software-engineer-observation-f7427087
  - 20261021T090620Z-software-engineer-observation-81c15cc4
supersedes: 
seal: sha256:f132dcc70d8d0c0bdfbbe23c2c37a5c3a1acb6928225d938ccb2c990576e481f
---

# `ABC-180` @ `acb52edf`: QE's own readings of A1–A6. All six are MET

QE took these readings before opening the SE's notes (`ticket-to-pr-ABC-180`). The plant matrix is in this task's matrix note, the gates in its gates note. Base is `ccccc6bb`; its `src/` is identical to `e68962d6`'s, which the page cites. No timing was taken.

| criterion | grade | reading |
|---|---|---|
| `A1` | MET | Head deep lane: **11/11**, exit 0. A7's child line is `[CLI_DEEP] (cwd $TMPDIR/abc162-neutral-cwd-AkcxJs) node --max-old-space-size=400 <tree>/src/cli.ts --colour white --ascii`, which is not the tree root. A7 asserts that the decoy is present, that it does not parse as UTF-8 JSON, and that it differs from the delivered bytes. A7 is green, so its stderr is `""`, its status is 0 and the reply is in the delivered entries. **PD** (the decoy write replaced by a byte copy of the delivered book, test sha256 `0085b3bc…`): **10/11, red A7 at `:497`**, `the decoy parses as UTF-8 JSON: expected [Function] to throw an error`. |
| `A2` | MET | Every cell of the five-row table reproduces; see the matrix note. P6f: base **11/11 green**, head **10/11 red A7** at `:534` (the labelled stderr assertion). Received stderr is `opening book is not valid UTF-8 JSON; playing on without it`. The P6f head log contains `AR-162-FALLBACK` 3 times. |
| `A3` | MET | Lane-made entries (`abc095-book-absent-*`, `abc162-neutral-cwd-*`) still present under the private `TMPDIR`: **0** after each of the 19 runs, including green, P6f at head, and every red. The only entry left is `node-compile-cache`, which is Node's own. `removeCopy(` is still 3 and `rmSync(` is still 1, so no new removal path exists. |
| `A4` | MET | `grep -c AR-162-FALLBACK` is **4** at the tip and **0** at `e68962d6` (grep exits 1). **Placement:** `:533` is the message argument of `expect(booked.stderr, …)`, and `:530` is a `//` line directly above `expect(` (`:531`). Both name `AR-095-CWD` too. The other two occurrences are the file header (`:50`) and the A7 comment (`:489`). |
| `A5` | MET | `grep -nE 'no .?data/\|holds no\|fresh, empty'` exits 1 at the tip. At `e68962d6` it prints `:48`, `:443` and `:476`. |
| `A6` | MET | `git diff --name-only ccccc6bb acb52edf` lists only `src/cli.real-engine.test.ts`. The waiver form is empty. `npm test` gives 59 files and 1987 tests at base (scratch archive of `ccccc6bb`) and at the tip, with 0 skips. `CLI_DEEP` runs 11 tests at base and at head, and 6 children (`[CLI_DEEP] (cwd` lines) at both. `grep -cF` at the tip and at base: `mkdtempSync(` 2/2, `removeCopy(` 3/3, `rmSync(` 1/1, `spawnReal(` 5/5. |

- **Independence:** after taking these readings, QE compared them with the SE's notes `…f7427087` and `…81c15cc4`. They agree on every cell. QE's P6e body is its own (sha `977a70fe…`, against the SE's `c04934e3…`), and both are red.
- **Disclosure:** QE saw the SE's summary in `.grugops/queue/done/ticket-to-pr-ABC-180.md` while it was orienting on the previous QE record, before any run. Every reading here is from QE's own runs.
