---
id: 20261110T135731Z-security-nfr-decision-0088bc3b
kind: decision
by: security-nfr
at: 2026-11-10T13:57:31Z
verified_by: 
confidence: high: every reading above was measured on 32edaf91 in scratch copies; R1's fix was applied and run on a scratch copy
refs:
  - sec-ABC-315
  - ABC-315
  - grugops/ABC-315
  - 32edaf91
  - 278a536c
  - ADR-0036
  - ADR-0016
  - ADR-0044
  - V5.3.2
  - V15.3.1
  - V2.2.1
  - V1.3.2
  - V16.5.1
  - R1
  - AR-315-VERSIONFAIL
  - AR-315-FIELDS
  - AR-315-STDOUT
  - src/version-file.ts
  - src/cli.ts
  - src/uci.ts
  - src/cli-options.ts
  - src/book-file.ts
  - src/version.test.ts
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - se-ABC-315/20261110T135244Z-software-engineer-observation-d561adba
  - security-nfr-ABC-203/20261023T211544Z-security-nfr-decision-eaaa1133
supersedes: 
seal: sha256:71e5a06188f448c2158ef383137f64af2fd889de5ad90b3b5626eb2d87518dc3
---

# Security/NFR on ABC-315 at `32edaf91` (feature commit `278a536c`): PASS_WITH_REQUIRED_FIXES

**Scope.** The `src/` diff of `main...grugops/ABC-315` (merge base `c57c17bb`): the new holder `src/version-file.ts`, the `--version` arms in `src/cli.ts` and `src/uci.ts`, and the resolver row in `src/cli-options.ts`. ASVS level L1 (`.grugops/factory.config.json`). Every probe ran in a scratch copy outside the repository. No timing was read.

**Result.** One required fix, R1, at LOW. Nothing is at or above `security.block_on: high`. In the role's terms the result is `PASS_WITH_RISKS` if the Orchestrator declines R1. R1 then becomes the accepted risk `AR-315-VERSIONFAIL` (LOW, owner: the Orchestrator).

## 1. ADR-0036 clause (b): it FIRES, as routed. The canonical instrument ran on `c57c17bb..32edaf91`
- **Limb 1** fires in three ways:
  - (b1) on `src/version-file.ts:11`, the `node:fs` import;
  - Ruling 2 on `src/version-file.ts` and on `src/uci.ts`;
  - (b2) on `cli.ts -> version-file.ts` and on `uci.ts -> version-file.ts`.
  The limb-1 holders go from 3 to 4: `book-file.ts`, `pgn-file.ts`, `uci.ts` and `version-file.ts`.
- **Limb 2** fires on `uci.ts:41-42`, which reads `process.argv`. The value is only compared by exact equality to the constant `--version`, and it reaches nothing.
- **Limb 3** is silent.
- **§ Decision 3's re-arm (i), a seventh holder, has fired.** The holder set is now `cli.ts`, `glyph-mode.ts`, `perft-bench.ts`, `book-file.ts`, `uci.ts`, `pgn-file.ts` and `version-file.ts`. **The ruling: (b2) still gets no call-graph reach.** The reason is S1 Ruling 1's, verbatim in kind. The export takes no parameter and reads one fixed path, read-only. A new call over an existing edge re-reads the same bytes, so no new input reaches the capability. A second importer fires (b2), and any edit to the holder fires Ruling 2. The residual stays LOW, with Architect/Design as owner.
- **Re-armed for next time:** (i) an eighth holder; (ii) unchanged from `security-nfr-ABC-203/…eaaa1133` § 2.

## 2. Path construction: MET (`V5.3.2` [L1])
- The path is `new URL("../package.json", import.meta.url)`. It is a literal resolved against the module's own URL. No argument, environment value, cwd or option reaches it.
- The build has `rootDir: src` and `outDir: dist`. So `dist/version-file.js` resolves to the same repository-root `package.json` as `src/version-file.ts` (measured).
- Measured, all `skytalix 1.0.0` at exit 0: `node src/cli.ts --version`, `node src/uci.ts --version`, `node dist/uci.js --version` and `bin/skytalix-uci --version`.

## 3. Exposure: MET (`V15.3.1` [L1]); `JSON.parse` is not dynamic code (`V1.3.2` [L1], MET)
- Only `name` and `version` are printed. The rest of the parsed object is discarded and never logged.
- The file is repository-owned. Version disclosure is the feature, and `V13.4.6` is L3 and web-tier, so it does not apply.

## 4. Argument handling: MET (`V2.2.1` [L1])
- `cli-options.ts` accepts `--version` only when `argv.length === 1`. Anywhere else it refuses with exit 1 and names the token. `src/cli.test.ts` "ABC-315 A4" pins this.
- `uci.ts` accepts exactly `argv.length === 3 && argv[2] === "--version"`. Every other argv is still the usage error at exit 1 (`src/version.test.ts`).
- Near-miss spellings are refused (the ABC-042 table, 168 cases).

## 5. Cost on a normal start or UCI session: NONE. No new failure mode there
- `version-file.ts` runs nothing at import. `readFileSync` runs only inside `readVersionLine()`, and that is called only on the `--version` arms.
- **Measured with `package.json` deleted from a scratch copy:** a normal `uci` session answered `id name skytalix`, `id author …` and `option …` at exit 0. A normal `cli` start, with stdin not a TTY, exited 0. Only `--version` failed.
- The `--version` arm in `cli.ts` comes after the error arm and before any question, book read or frame.
- **Measured under a pseudo-terminal (`script`):** both entry points print one line and exit 0. Nothing waits on stdin.

## 6. The EPIPE arm on `uci.ts`'s `--version` path: MET, and load-bearing
- **Probe.** The reader closes before the write. Three runs each of `src/cli.ts`, `src/uci.ts` and `dist/uci.js` gave exit 0 and 0 stderr bytes.
- **Control.** The same probe on a scratch copy with the arm removed gave exit 1 and an unhandled `EPIPE` stack, three runs out of three. So the arm is what makes exit 0.
- **Other stdout errors.** A non-EPIPE error is re-thrown. Measured on `--version >/dev/full`: `ENOSPC`, a stack and exit 1. That is the same trade `ADR-0016` records for the session paths, and it is not new. See accepted risk AR-315-STDOUT.

## 7. Failure when package.json is missing: R1 (LOW). Malformed, unreadable or field-less: no fix
- **Missing (R1).** On all three entry points the `--version` arm throws out of the product:
  - an uncaught `ENOENT` stack, which prints the absolute path of the install and the source frames;
  - **exit 1**, the code `ADR-0016` clause 2 reserves for a refused command line.

  In `cli.ts` the arm sits outside the existing `try`. In `uci.ts` it has no catch. This is not how `src/book-file.ts` fails. That holder also throws, but its caller turns the throw into one fixed line and no path (measured here: `opening book could not be read; playing on without it`).

  **Reachability.** A clone or package always carries `package.json`. The realistic route is copying `dist/` alone, which `ADR-0044` D8 names the engine artifact.

  **Impact.** It touches the local user only. The leaked path is the user's own, on the user's own terminal. `V16.5.1` is L2, above the configured L1, so this is LOW on the product's own no-echo convention and on the exit contract. It is not a checklist failure.
- **Malformed or unreadable `package.json`.** Measured: Node's loader refuses (`ERR_INVALID_PACKAGE_CONFIG`) before any product code runs, on every start and not only on `--version`. This change did not introduce it, and it is out of scope.
- **Valid JSON with no `version`.** It prints `skytalix undefined` at exit 0. The file is repository-owned, and `src/version.test.ts` pins `name === "skytalix"` and the `MAJOR.MINOR.PATCH` version. See accepted risk AR-315-FIELDS.

## Required fix

**R1 (LOW).** On the `--version` arms, a failing `readVersionLine()` must end like every other internal failure: the fixed `INTERNAL_ERROR` line on stderr, exit 70, no stack and no path. Make these exact edits, and keep `version-file.ts` unchanged: it is a holder that throws, as `book-file.ts` is.

- `src/cli.ts`: move the arm INSIDE the existing `try` as its first statement. The existing `catch` then writes `INTERNAL_ERROR` and sets 70. The text becomes:
  ```ts
  try {
    // `ABC-315` — … (the existing comment)
    if (parsed.version) {
      sink.write(`${readVersionLine()}\n`);
      return;
    }
    // `ABC-200` — …
    const resolution = await askAbsentOptions(…);
  ```
- `src/uci.ts`: inside `if (versionOnly)`, after the `sink.on("error", …)` arm:
  ```ts
    try {
      sink.write(`${readVersionLine()}\n`);
    } catch {
      process.stderr.write(`${INTERNAL_ERROR}\n`);
      process.exitCode = INTERNAL_ERROR_EXIT_CODE;
    }
    return;
  ```
- **Verified on a scratch copy with `package.json` removed.** `cli.ts --version` gives the fixed line and exit 70. `uci.ts --version` gives `internal error: a bug ended this session` and exit 70. With `package.json` present, both give the version line at exit 0.
- **Tests.** The `cli.test.ts` pin `sink.write(\`${readVersionLine()}\n\`)` still matches after the move. A spawn row for the missing-file case is welcome, but this review does not require one.

## Accepted risks (each LOW or INFO)
- **AR-315-VERSIONFAIL** (LOW, owner: the Orchestrator). This applies only if R1 is declined.
- **AR-315-FIELDS** (INFO, owner: the Orchestrator). A field-less `package.json` prints `undefined`. The test pins guard it.
- **AR-315-STDOUT** (INFO, owner: the Orchestrator). A non-EPIPE stdout error on `--version` gives a stack and exit 1. This is the existing `ADR-0016` trade, unchanged.
- **§ Decision 3 residual** (LOW, owner: Architect/Design). Unchanged, and re-armed per § 1.

## NFR
`nfr.perf_p95_ms` and `NFR-*` are unaffected: there is no work on the normal start path, per § 5. Availability does not apply, because the product is local-only. Every failure mode on the `--version` path leaves a stderr line, or will once R1 lands. There is no log or metric surface in this product.

`src/version.test.ts` ran alone under the host lock: 4 out of 4 pass.
