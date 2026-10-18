---
subtask: secnfr-ABC-169
role: security-nfr
ticket: ABC-169
page: plans/tickets/ABC-169-declare-the-engine-private.md (as amended on main b40a2f77)
branch: grugops/ABC-169 @ 344a4128 (read-only; not committed to)
base: 849d7f92
done_at: 2026-10-18T12:45:33Z
result: PASS_WITH_RISKS. This is a PASS with no required fix and one LOW accepted risk (R-169-1, owner BA/PM). ABC-041 clause (a) fires and finds nothing. ADR-0036 (b1), (b2) and (c) do not fire. No timing readings were taken. Nothing was pushed, merged or committed.
---

# Security/NFR ABC-169: ABC-041 clause (a) review of the package.json change

Config: `security.asvs_level` L1, `block_on` high, `compliance_regime` [] (so nothing goes to the Compliance Officer).
The scope and risks are authoritative as stated on the ticket page (§ Scope, § Security / NFR triggers) and in the SE record
`.grugops/queue/done/ticket-to-pr-ABC-169-redo.md`.

## The diff (849d7f92..344a4128)

`git diff --stat`: 3 files, 8 insertions, 0 deletions.
- `package.json`: +1 line, `"license": "UNLICENSED",`.
- `src/evaluate.ts`: +6 header comment lines.
- `src/cli.test.ts`: +1 line, `"license",` in `AT_HEAD`.
- `package-lock.json` and `tools/` diff: 0 bytes.

## ABC-041 clause (a): FIRES, no finding

- The trigger: `git diff --numstat -- package.json package-lock.json` gives `1 0 package.json`. `has("dependencies")` is false at base and at tip.
- Top-level keys at the tip are the base keys plus `license`, and nothing else. The JSON of `scripts`, `devDependencies` and `engines` is
  identical at base and tip (sha256 prefix `dcaeb2aca8faec00` at both).

### What `npm publish` does with `private: true` (npm 11.20.0, read from the installed source and not run)

- The refusal is unchanged. `libnpmpublish/lib/publish.js:15` throws `EPRIVATE` whenever `manifest.private` is truthy. The check is
  unconditional, so `--force` does not bypass it. The `license` key does not take part in the check, and `"private": true` is untouched.
- `UNLICENSED` is the value npm documents for "no rights granted". npm's own docs follow it with "Consider also setting
  `"private": true`" (`npm/docs/content/configuring-npm/package-json.md:185-189`). This change is that documented pairing.
- **Pre-existing, not caused by this diff:**
  - In `lib/commands/publish.js:99-135`, a non-workspace publish first runs `prepublishOnly`, then pack (which runs `prepack`, `prepare` and
    `postpack`), then the registry version lookup. Only after that does `libpub` refuse.
  - `--dry-run` never reaches `libpub`. So `npm publish --dry-run` does not show the `EPRIVATE` refusal, and it is no evidence of
    the refusal.
  - None of those script names exists in `scripts`, so a real publish attempt runs no repo code before it is refused.
  - Recorded for whoever next reads publish behaviour. It is not a finding.

### Lifecycle hooks and scripts

- No effect.
  - `@npmcli/run-script` does not read `license` (`grep license` there is empty).
  - `scripts` is byte-identical, and it has no lifecycle-named key (no `pre*`/`post*`, `install`, `prepare`, `prepack` or `prepublishOnly`).
  - No `binding.gyp` is tracked, so there is no implicit install hook. No `.npmrc` is tracked.
- `npm ci`, which the gates use, does not write the lockfile. The SE's gates ran after `npm ci` with a clean `git status`.

### Lockfile drift: R-169-1 (LOW, accepted risk, owner BA/PM)

- Arborist copies `license` into the lockfile's root entry: `@npmcli/arborist/lib/shrinkwrap.js:100`, `metaFieldFromPkg`. At the tip,
  `packages[""]` holds only `name`, `version`, `devDependencies` and `engines`.
- I measured this in the scratch worktree with `npm install --package-lock-only --offline --ignore-scripts`:
  - at 344a4128 it adds exactly one line, `"license": "UNLICENSED",`, under `packages[""]`;
  - at 849d7f92, the control, the diff is empty.
  - Both were reset, and the worktree was removed.
- So ABC-169 is correct to its own A1 (the lock is unchanged). The next hop that regenerates the lock picks up this one extra line.
- **The concrete collision is ABC-172.** Its A2 says the lock diff is "exactly those two lines" (the two `name` fields), regenerated
  with `npm install --package-lock-only` (Test note 2). If ABC-169 merges first, ABC-172's regeneration gives 3 lines and A2 stops it.
- This is not a security fault. The added line is metadata, it is reproducible, and clause (a) reviews every lock touch anyway.
- **Accepted, owner BA/PM** (the ABC-172 page's owner). The fix belongs on ABC-172, not here: amend A2 to allow the
  `packages[""].license` line when ABC-169 is already on main.
- `UNKNOWN - verify`: `bin` is also in arborist's root metadata keys (`shrinkwrap.js`, the same list). ABC-168 (`bin`, with
  `package-lock.json` unchanged in its A12) may carry the same latent drift. That is BA/PM's to read for ABC-168. It was not measured here.

## ADR-0036 (b1), (b2) and (c): none fires

- **(b)**, read with the canonical instrument `.grugops/context/design-F-072-1/probe/clause-b.mjs 849d7f92 344a4128 {1,2,3}`. It reads
  git objects only. Production files changed: 1 (`src/evaluate.ts`).
  - Each limb gives (b1) 0, (b2) 0 new edges, 0 word hits, and "does not fire".
  - Baselines at the tip: limb 1 `src/book-file.ts`; limb 2 `cli.ts`, `glyph-mode.ts`, `perft-bench.ts`; limb 3 none.
- **S1 Ruling 2** (the limb-1 holder file). The holders at base and at tip are `src/book-file.ts`.
  `git diff --name-only --no-renames 849d7f92 344a4128 -- src/book-file.ts` is empty, so it does not fire.
- **A3 checked again on its own** from git objects, with TypeScript 5.9.3 from main's `node_modules`:
  - The `removeComments` transpile is 9014 bytes at both base and tip, with sha256 `629c825d…72c7705` at both, so it is identical.
    This matches the SE.
  - Every `+` line in the evaluate.ts diff starts with ` *`. No other line was found.
- **(c)** The test edit is one string literal in an array literal. It adds no import, no call, no network, no write and no spawn.
  The test's `readFileSync` of `package.json` is pre-existing, read-only `node:fs` over the repo's own files, which is named precedent.
  There is nothing to dispute, so the tie rule does not act.
- **(d)**, for completeness: two `src/` files, both named on the page.

## Checklist (ASVS 5.0, filtered to L1)

- The diff adds no executable code (A3 transpile identity; the instrument gives 0/0/0) and no dependency (devDependencies are
  identical). So V1–V12, V14, V16 and V17 have no surface in this change.
- V15.1.1 and V15.2.1 (third-party components): no component was added or changed. N/A to this diff.
- V13.4.1 (no VCS metadata in a deploy): deploy is `none-local-only`. N/A.
- NFRs: none apply. The emitted code is byte-identical (A3), so no budget in `plans/nfr-catalog.md` can move. No timing was read.

## Also recorded, already owned (not a new risk)

- The credit names CC BY-SA 3.0 values inside an `UNLICENSED` package.
- The owner decided this already (`…c3e81a57` and its addendum): keep the tables, no distribution, and re-derive the values before
  any distribution to third parties.
- The comment gives the attribution that CC BY-SA requires. The decision is the owner's, and nothing here reopens it.

## Required fixes

None.

## Accepted risks

| id | severity | owner | risk |
|---|---|---|---|
| R-169-1 | LOW (not an ASVS fail; an NFR/process note) | BA/PM (ABC-172 page) | Lock drift: the next `npm install --package-lock-only` adds `packages[""].license`. ABC-172 A2 ("exactly those two lines") stops if ABC-169 merges first. |

## Notes not published

There is no `scripts/context-io.ts` in this repo, and no `propose_note` tool reached this agent. WF16 forbids hand-writing
`.grugops/context/`. These payloads are for a hop that has the writer to admit:

- `observation` (refs ABC-169, ABC-041, ADR-0036): ABC-041 (a) fires with no finding. ADR-0036 (b1)/(b2) give 0 on all three limbs with
  the canonical instrument, S1 Ruling 2 does not fire, (c) does not fire, and A3 transpile identity was re-measured.
- `observation` (refs ABC-169, ABC-172, ABC-168, package-lock.json): R-169-1 lock drift, measured at the tip, with an empty control at base.
- `observation` (refs ABC-169): npm 11.20.0 refuses a private publish only in `libnpmpublish`, after `prepublishOnly`, pack and
  the registry lookup, and `--dry-run` never reaches the refusal. This is pre-existing.
- `decision` (refs ABC-169): the result is PASS_WITH_RISKS, with no required fix.

## Trace row (for the Orchestrator to append; `plans/traceability.md` was not touched)

| ABC-169 | ABC-041 (a); ADR-0036 (b1)/(b2)/(c); ASVS L1 | `grugops/ABC-169` @ `344a4128` (base `849d7f92`) | (a) fires, no finding; (b1)/(b2)/(c) do not fire (instrument 0/0/0; S1 R2 holder untouched; A3 transpile identical) | NFRs: none apply | Security/NFR PASS_WITH_RISKS: no required fix; R-169-1 LOW lock drift, owner BA/PM (ABC-172 A2) |

## Board

Recommended, not made: the brief fences `plans/board.md`. The role's exit is `In Security/NFR` → `Ready for UAT`, and UAT here is
WAIVED by A3. The column move is the Orchestrator's, together with the QE result from `qe-ABC-169`.

## Fences

- Not touched: `plans/board.md`, `plans/traceability.md`, `wt-ABC-146`, `wt-ABC-170`, `../wt-ABC-169`, `grugops/ABC-169`, and other sessions' processes.
- The scratch worktree `../wt-sec-ABC-169` was created detached at 344a4128 and removed. `git worktree list` shows no `wt-sec`.
- No network publish was run, and no timing readings were taken. Nothing was pushed, merged or committed.
