---
subtask: bapm-rule-QE-189
role: ba-pm
tickets: [ABC-189]
branch: main (records only; commit nothing, the Orchestrator commits)
ref: .grugops/context/bapm-rule-QE-189/
width: 3 (beside qe-ABC-178b and ticket-to-pr-ABC-198)
---

# BA/PM (records only): rule QE-189-a (LOW proposed) and QE-189-b/-c (INFO) from ABC-189's QE gate. ABC-189 is merged; this gates nothing

## Read first
- QE `.grugops/context/qe-ABC-189/notes/` in main's tree (merged; verdict `…b2012318`) and the `## QE` section on ABC-189's page.
- ABC-189's page; Security/NFR `security-nfr-ABC-168` `…75a45be0` § 5 (AR-168-BINPIN and its packaging trigger); ABC-168's page (A7, `dist/`); `tsconfig.build.json`; the owner delegation `…5aaf7cec`.

## Do
- **QE-189-a:** the pin checks `bin`'s text, not that the build emits that file. Changing `tsconfig.build.json` `outDir` to `build` passes every gate while `bin` names a missing `dist/uci.js`. Rule cut (an XS test-only pin, e.g. `outDir` plus the `bin` target exist after `npm run build`, or a check that reads `tsconfig.build.json`) / fold (into the packaging ticket AR-168-BINPIN's trigger would pull, if one exists) / accept with a reopen trigger. Weigh it against the ABC-168 A7 lane, which already builds `dist/`: does any existing row read `dist/uci.js` after a build? Measure on a scratch copy if you cut (no vitest in main's checkout; one-file runs in scratch only). Next free id **ABC-199**.
- QE-189-b (the pin is stricter than npm) and QE-189-c (no test reads the lock root's `bin`): agree INFO, or say why not.
- If anything is cut, one `_Updated:` line at the top of `plans/board.md` and the card. Otherwise only a dated line on ABC-189's page.

## Fences
- Only `plans/` and your notes (context root: this repository's `.grugops/context`). No `src/`, `tsconfig*`, `package*.json`, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config. Commit nothing. Touch no board card except a new one.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `bapm-rule-QE-189`). Every `at` from `date -u`. Include a `kind: decision`.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/bapm-rule-QE-189.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.

## Result (ba-pm, 2026-10-22T15:56:54Z): **QE-189-a ACCEPTED, no ticket, with one acceptance rule and reopen triggers R1–R3. QE-189-b and QE-189-c agreed INFO. No card moves, no board line, and the next free id stays ABC-199.**

These are records only, uncommitted on `main`: `4952425a` at the start and `eb28c867` at the finish. The only commits between them are the Orchestrator's `qe-ABC-178b` records, which do not overlap this hop.

Notes are in `.grugops/context/bapm-rule-QE-189/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend`, with this checkout's `.grugops/context` passed explicitly, and both were read back through `readContext`:
- `20261022T155552Z-ba-pm-observation-7fe603e7`: the readings, all on scratch exports of `4952425a`. No vitest ran, and nothing ran in main's checkout;
- `20261022T155615Z-ba-pm-decision-9d0dc304`: the ruling per gap, the rule, and the reopen triggers.

| gap | ruling |
|---|---|
| QE-189-a (LOW proposed) | **ACCEPT, no ticket.** (1) Fold is unavailable: `AR-168-BINPIN` is closed and no packaging ticket exists. (2) No consumer of `dist/` exists. The ticket that would create one must prove the installed launch (ABC-189 fenced that out to it), and that one check catches all 4 measured plants. Those are `outDir`, `rootDir`, `files` and a base `emitDeclarationOnly`; each keeps build, typecheck and the pin green with `bin` dangling. A static `tsconfig.build.json` pin catches only 3 of the 4 (it is blind to the base emit change). (3) The failure is loud at launch: measured, a dangling `bin` installs with rc 0, 0 warnings and no `.bin` link, then the launch gives rc 127. (4) A full check in the default lane is a `tsc` run of about 0.6 s, against about 0.6 s of `NFR-008` headroom. **No existing row reads `dist/uci.js` after a build:** `A7` is a by-hand reading at ABC-168's hops, and the `build` gate reads only rc. **Rule:** a ticket touching `tsconfig.build.json`, the base `compilerOptions`, `bin` or `scripts.build` carries "after `npm run build`, every `bin` path exists and starts with `#!/usr/bin/env node`". **Reopen:** (R1) a packaging or backend-dependency ticket carries the installed-launch check (pack, install into an empty consumer, `.bin/skytalix` gives `uciok` rc 0); (R2) a dangling `bin` is seen on `main`; (R3) a second `bin` command or a second `files` entry. |
| QE-189-b (INFO) | **Agree, no action.** Stricter than npm is the safe direction. Every such spelling is a `bin` edit under the rule, and the cost is a one-line re-pin; copying npm's normalisation would be bloat. **Reopen:** a deliberate non-object `bin` spelling. |
| QE-189-c (INFO) | **Agree, no action.** QE's `UNKNOWN - verify` is now measured: `package-lock.json` is not in the `npm pack` tarball, and `npm install --package-lock-only` rewrites a drifted root `bin` from `package.json`. **Reopen:** any tool or test starts reading the lock root's `bin`. |

Files:
- `plans/tickets/ABC-189-nothing-pins-the-value-of-package-json-bin-so-bin-pointing-at-src-uci-ts-passes-every-test.md`: +11 lines, one dated ruling paragraph appended after `## QE`.
- `.grugops/context/bapm-rule-QE-189/notes/`: 2 notes, new.
- This done record and `bapm-rule-QE-189.claim.md`.

Not touched:
- `plans/board.md` (nothing was cut), `plans/traceability.md` (the row is below, for the Orchestrator), and every card;
- `src/`, the tsconfigs, `package*.json`, `AGENTS.md`, `memory-bank/`;
- branches, worktrees and git config;
- the pending file and the claim directory.

Side effect, for disclosure: one offline `npm install --package-lock-only` (QE-189-c) read the user's npm cache `~/.npm`. Every other npm run used a scratch cache.

For the Orchestrator (optional): `AR-168-BINPIN`'s trigger list closed with it, so R1 now lives only on ABC-189's page and in `…9d0dc304`. A Scribe hop may carry it into `memory-bank/45-standing-rulings.md`.

No stop.

### Trace row (10 cells, header order)

| ABC-189 (BA/PM QE-189 ruling) | ruled QE-189-a ACCEPT (no ticket; no dist/ consumer; fold target gone with AR-168-BINPIN closed; the installed-launch check owed by any packaging or backend ticket catches all 4 measured build-config plants, a static pin 3; dangling bin installs silently and fails at launch rc 127), with an acceptance rule for tsconfig/bin/build hops and reopen triggers R1–R3; QE-189-b and QE-189-c agreed INFO (no action; c measured: lock not in tarball, lock-only install rewrites root bin) | EPIC-007 | — | QE-189-a, QE-189-b, QE-189-c; AR-168-BINPIN (closed); ABC-168 A7; ADR-0044 D8; NFR-008; notes …b2012318, …f3106f00, …340a360e, …75a45be0, …5aaf7cec, …7fe603e7, …9d0dc304 | main @ eb28c867 (uncommitted, records only)<br>plans/tickets/ABC-189-nothing-pins-the-value-of-package-json-bin-so-bin-pointing-at-src-uci-ts-passes-every-test.md | — (records only; scratch exports of 4952425a: P0 real green, P1–P4 build/typecheck rc 0 with dist/uci.js missing; pack+install P0 uciok rc 0, P1 launch rc 127; lock plant healed by --package-lock-only) | — (no ticket cut) | — | ABC-189 stays Done; no card moves; next free ABC-199 |
