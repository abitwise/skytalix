---
id: 20260927T112430Z-software-engineer-artifact-ref-64536458
kind: artifact-ref
by: software-engineer
at: 2026-09-27T11:24:30Z
verified_by:
confidence: high
refs:
  - ABC-124
  - ticket-to-pr-ABC-124
  - wave-2026-09-25
  - biome.json
  - tools/grugops/uat-spec-integrity.js
  - plans/tickets/ABC-124-extend-biome-lint-coverage-to-tools.md
  - plans/traceability.md
supersedes:
---

# ABC-124 build artifacts

- **Branch:** `grugops/ABC-124-lint-tools`, from `ddcebc5`. It is one commit on that branch; the
  commit sha is in the Software Engineer's hand-back. NOT merged, NOT pushed.
- **Code and config:**
  - `biome.json` (+17/−1): `"tools/**/*.js"` in `files.includes`, and one `overrides` entry that
    sets the formatter to off and `assist.actions.source.organizeImports` to `"off"` for
    `tools/**/*.js`.
  - `tools/grugops/uat-spec-integrity.js` (+1/−3): Biome's safe autofix, at old lines 603, 1214 and
    2384.
- **Docs and trace:**
  - The `## Delivery` section on `plans/tickets/ABC-124-extend-biome-lint-coverage-to-tools.md`.
  - One `ABC-124 (build)` row in `plans/traceability.md`.
- **Notes:**
  - Decision `…3da01ce6`, readings `…18bca91a`, and the re-install risk `…63b1276a`.
  - `raw-a7-capture.mjs.txt` and `raw-a7-probe.mjs.txt`: the A7 harness.
  - `raw-a7-fixture.txt`: the scratch uat-spec fixture layout.
  - `raw-a7-before.json.txt` and `raw-a7-after.json.txt`: byte-identical captures, sha1 `5bf11df2…`.
- **Tests added:** none to `npm test`. No vitest-collectable behavior changed, and the ticket adds no
  `src/` file. The A2 red/green proof and the A7 behavior capture are delivery-time readings kept
  beside the notes, not committed tests.
- **Commands run:**
  - `npx biome check tools/` (before and after).
  - `npm run lint`, twice with the plant in place (HEAD config, then the delivered config), and
    once clean.
  - `npx biome check --write tools/grugops/uat-spec-integrity.js`.
  - `npx biome check --write tools/`.
  - `npx biome format tools/` and `npx biome format .`.
  - `node <scratch>/capture.mjs before|after`.
  - `npm test`, `npm run typecheck`, `npm run build`.
- **Not touched:** `plans/board.md`. The move to `In Review` is the Orchestrator's to make.
