---
id: 20261019T131800Z-security-nfr-observation-abc171-triggers-r1671-book-surface-5a40004e
kind: observation
by: security-nfr
task: secnfr-ABC-171
at: 2026-10-19T13:18:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - ADR-0036
  - ADR-0044
  - R-167-1
  - plans/tickets/ABC-171-the-uci-session-offers-ownbook-and-skill-level.md
  - 20261019T085500Z-security-nfr-observation-abc167-triggers-and-qe167g-bracket-access-baba8a03
  - 20261019T131500Z-qe-e2e-decision-abc171-recheck-verdict-pass-d60ef4d9
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/secnfr-ABC-171/probe/clause-b.out
  - .grugops/context/secnfr-ABC-171/probe/grep.out
supersedes:
---

# ABC-171 at `5dee231c`: triggers (a)–(d) not triggered, R-167-1 adds nothing, the D10 book surface is clean

Hand-authored and unsealed. Read from git objects and from the scratch worktree `../wt-secnfr-ABC-171`, detached at
`5dee231c` and removed at the end of the hop. The base is `55a1e223`, which is `main...5dee231c`. Config:
`asvs_level` L1, `block_on` high, `compliance_regime` [].

## Triggers, against the page's § Security / NFR triggers
- **(a)** `git diff --name-only 55a1e223 5dee231c -- src package.json package-lock.json` lists only
  `src/uci-session.ts` and `src/uci-session.test.ts`. No manifest changed. **Not triggered.**
- **(b1)/(b2)** I ran ADR-0036's canonical instrument, `clause-b.mjs 55a1e223 5dee231c {1,2,3}`
  (`probe/clause-b.out`). Every limb gives (b1) 0, 0 new runtime edges and 0 reaching a holder: **"does not fire"**.
  - **The book seam:** the instrument counts no edge to `book.ts`, because `:18` is `import type { BookProbe }`. The
    probe is injected through `UciSessionOptions.book`.
  - **The one new runtime edge symbol:** `createLevel`, from the existing `./levels.ts` import, which holds no limb.
  - **The one word hit, limb 2:** `src/uci-session.ts:253`, the JSDoc "read once per process". It is prose, and I do
    not dispute it.
  - **Not triggered.**
- **(c)** the test imports `node:fs` (`readFileSync`, A11's source read), `vitest` and local modules. Its `"spawn"` and
  `"exec("` are A11's token-list literals (`:1059-1060`), not calls. **Not triggered.**
- **(d)** only the two named files. `src/book.ts`, `src/levels.ts` and `src/engine.ts` are unchanged in the pair.
  **Not triggered.**

## R-167-1 carry: confirmed, no new exposure
- The grep `git diff -U0 55a1e223...5dee231c -- src | grep '^+' | grep -nE 'globalThis|\bglobal\b|Reflect|constructor'`
  prints one line: `+  for (const value of ["0", "6", "2.5", "x", "constructor"]) {`, the test's A2 input literal.
- The same grep on `src/uci-session.ts` prints nothing (exit 1). So does a grep of the whole file at the tip for
  those words plus `eval`, `Function(` and `import(`.
- **The only new computed read with input behind it is `LEVELS[skill]` (`:280`).**
  - `skill` starts at `DEFAULT_LEVEL`.
  - It is set only at `:336`, after `Object.hasOwn(LEVELS, value)` passes, and `LEVELS` is a frozen record with keys
    1–5.
  - `constructor`, `__proto__` and `toString` are refused. The A2 `constructor` row is green, and QE probe P5 covers
    all three.
- The other bracket reads are the ABC-167 set, with keys that are literal or typed (`:76`, `:198`, `:212`, `:216`).
- **R-167-1 stays ACCEPTED, LOW. Owner: Security/NFR.** It now carries to the ABC-174 gate, which edits this file's
  option line, and to the ABC-168 gate.
- **INFO:** the optional tripwire (`globalThis`, `Reflect` and `.constructor` in A11's token list) was not added. It
  was optional, and it is not required now.

## D10 book read surface: confirmed
- **No path or file name comes from UCI input.**
  - The session holds no path, and it has no `readFile`, `argv` or `env`.
  - `setoption` sets only a boolean (`OwnBook`: exactly `true` or `false`) and an own-key level.
  - The book's bytes come only from the injected probe's `read`, which `ABC-168`'s `uci.ts` binds to `readBookFile`.
    The path rule is that ticket's gate. ASVS V5.3.2 holds here.
- **A bad or throwing book writes one warning and still a legal `bestmove`.**
  - `createBookProbe` (unchanged) catches any throw from `read()` (`src/book.ts:132-136`). It switches off for the
    life of the probe and warns once, with fixed text. The error text never reaches the warning.
  - It caps the bytes at `BOOK_MAX_BYTES` 1 MiB (ASVS V5.2.1) and only ever `JSON.parse`s them.
  - It re-checks every book move against `legalMoves`. An illegal one switches the book off, and the session searches
    instead.
  - Rows A9 "read throws" and "not the schema" are green at the tip: 3 legal `bestmove`s, no throw, `warn` exactly
    once.
  - With `OwnBook` off, `read` is called 0 times (A4). A13d is green.
  - My run: `vitest run src/uci-session.test.ts` at `5dee231c`, **118/118**. This was not a timing reading.
- **Residual, INFO:** the session trusts the probe's never-throws contract. It does not wrap `book.bookMove` itself.
  This is safe because D10 binds `createBookProbe`. The warning reaches the GUI as `info string` only through
  ABC-168's `warn` binding (QE-171-e, routed there).

## ASVS L1, the rows that apply
- **V1.3.2, no dynamic code:** none.
- **V1.2.5, no OS command:** no spawn.
- **V2.2.1, positive input validation:** `OwnBook` takes `true` or `false` only. `Skill Level` takes an own key only.
  The `go` values take a positive integer. Each refusal writes one `info string` and keeps the old value.
- **V5.2.1, file size cap:** holds.
- **V5.3.2, no path from input:** holds.
- **Every other L1 row is N/A.** There is no HTTP, authentication, session, cookie, crypto or storage.
- **INFO, the ABC-167 C1 echo:** `printableOf` echoes a `setoption` value back to the same GUI that sent it. It still
  stands, and it crosses no trust boundary.
