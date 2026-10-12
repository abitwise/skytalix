---
id: 20261012T073610Z-qe-e2e-observation-abc105-security-config-blast-radius-uat-waiver-3740506e
kind: observation
by: qe-e2e
at: 2026-10-12T07:36:10Z
verified_by:
confidence: high
refs:
  - ABC-105
  - A8
  - QE-105-r
  - QE-105-s
  - QE-105-u
  - QE-105-v
  - tsconfig.json
  - biome.json
  - 20261012T072315Z-software-engineer-decision-abc105-test-file-needs-tsconfig-allowjs-and-two-include-lines-d53d8ab6
supersedes:
---

# QE `ABC-105`: security holds; `allowJs` adds exactly the tool and its test to `tsc`; the UAT-waiver measurement is empty, but the `ABC-122` precedent puts the waiver to the Orchestrator

Hand-authored and unsealed (`AGENTS.md`).

## Security (static read of `tools/grugops/qe-hop-integrity.js` at `60415a8a`, plus a probe)

- **Imports:** `node:fs` (`lstatSync`, `readdirSync`, `readFileSync`, `realpathSync`), `node:path` (`join`) and
  `node:url` (`fileURLToPath`). There are no others. A grep for `eval`, `Function(`, `require(`, `import(`,
  `child_process`, `spawn`, `vm.`, `Worker`, `process.env`, network modules and `fetch` finds **none**. The only
  `.exec(` calls are on RegExps.
- **It executes nothing it reads.** Note text goes only through `String.split` and three anchored, linear RegExps.
  The `--ticket` value must match `^ABC-\d{3,}$` and is never used in a path.
- **It writes nothing.** No fs write, mkdir or unlink call exists. It writes only to stdout and stderr.
  `git status --porcelain` stayed clean after every QE run of the tool.
- **Symlinks.** A link at task-folder, `notes/` or note-file level exits 2 and is never followed. QE probed all
  three levels on synthetic trees (`probe/symprobe.mjs`). Only the task-folder level has a test (`QE-105-q`). A
  symlinked `.grugops/context` root **is** followed (exit 0), which is `QE-105-r` (LOW). There are 0 symlinks
  under `.grugops/context` today.
- **The CLI wrapper** (line 353, `process.exitCode = main(...)`) is outside every test, because the page requires
  0 spawns. QE read its exit codes by hand: `--sweep` 1, `--ticket ABC-061` 0, `ABC-073` 1. Gap `QE-105-s`
  (LOW, by design).

## Config blast radius (`tsconfig.json` `allowJs` plus 1 include, `biome.json` plus 1 include)

- **`tsc --noEmit --listFiles`, excluding `node_modules`**, gives 96 files at the base and 98 at the tip. The
  difference is exactly `tools/grugops/qe-hop-integrity.js` and `tools/grugops/qe-hop-integrity.test.ts`. Including
  `node_modules`, the count goes 354 → 356, so no `.js` is pulled in from dependencies. Both trees were scratch
  `git archive` copies. The base tree also held 7 stale `.grugops/queue/pending/*.md` files from an earlier
  session; neither `tsc` nor Biome reads them.
- **`checkJs` is absent, so it is off.** The `.js` is parsed for inference and is not error-checked. `noEmit:
  true` is in `tsconfig.json`, and `build` and `typecheck` are both `tsc --noEmit`, so **nothing is emitted**.
- **Biome** checks 107 files at the base and 109 at the tip. The tool was already linted through
  `tools/**/*.js`. The coverage at the base is a subset of the coverage at the tip.
- **Ruling (`QE-105-u`, LOW): project-wide `allowJs` is acceptable.**
  - Every `include` pattern is `*.ts`, so `allowJs` admits a `.js` only when an included `.ts` imports it. QE
    measured exactly one such file.
  - The residual: after this change, a future `.ts` that imports a `.js` no longer fails with `TS7016`. Its
    types are silently inferred.
  - **A narrower option exists:** a sibling declaration file `tools/grugops/qe-hop-integrity.d.ts` declaring the
    four exports, with `allowJs` left off. The Engineer rejected it as "a fourth file outside the brief's list"
    (`…d53d8ab6`). That is a scope call, not a technical bar.
  - A second option, `// @ts-expect-error` on the import, would type the imports `any`, which is worse.
  - QE changes neither.

## UAT-waiver reading

- **The measurement is empty.** Both `git diff --name-only ada10423~1 ada10423 | grep -v '\.test\.ts$' | grep
  '^src/'` (the delivered commit) and the same command over `aeeba067..60415a8a` print nothing. The rule's
  measurement, as written in `AGENTS.md`, therefore passes.
- **Whether it honestly applies is a separate question (`QE-105-v`).**
  - The rule is keyed on `src/`. This branch adds **353 lines of runnable code** under `tools/`. A human, the
    Orchestrator at the `Done` exit, runs it as a blocking step, and its stdout is what that human reads.
  - It has no player-visible behaviour.
  - The nearest precedent is `ABC-122`, which added `tools/grugops/run-bounded.js`. There the board records
    "**UAT not waived** by the Orchestrator: `package.json`/`tools/` change the gate's behaviour; the owner's
    word is asked".
  - QE's reading: **the waiver's letter applies, and its spirit is contestable on that precedent.** The
    Orchestrator should not apply it silently. Either state the application against `ABC-122`, or ask the owner
    to read one `--ticket` and one `--sweep` output. That is the Orchestrator's and the owner's call, not QE's.
