---
id: 20260813T214232Z-security-nfr-observation-the-asvs-l1-review-of-abc-041-and-its-result-5b93444a
kind: observation
by: security-nfr
at: 2026-08-13T21:42:32Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - src/render-seam.ts
  - src/render-seam.test.ts
  - src/history-pane.nfr.test.ts
  - package.json
  - .grugops/factory.config.json
  - agent-factory/checklists/security-nfr-checklist.md
  - agent-factory/workflows/15-security-audit.md
supersedes: 
---

# The review the trigger obliged. ASVS **L1**, `block_on` **high**. Result: **`PASS`** on `ABC-041`'s change — zero findings, zero required fixes.

Run because the sibling `decision` adjudicates that the trigger fired. `security.asvs_level` is `L1`
and `security.block_on` is `high`, both read from `.grugops/factory.config.json`. The checklist was
filtered at read time to **70 of 345** requirements (`L <= L1`), counted mechanically off
`agent-factory/checklists/security-nfr-checklist.md` — the file ships the full set and is not
regenerated when the dial moves (WF15 step 1).

**No `finding` is recorded and no `§14-gate#<id>` stamp is emitted.** `AGENTS.md` § Role / workflow
files: none is admissible on this install. This is an `observation` and is labelled as one.

## The change, measured — not taken from `parent_ref`

Base `eea6afc`, tip `ac17fe2`. Under `src/`, exactly three files: `render-seam.ts` (+62),
`render-seam.test.ts` (+304), `history-pane.nfr.test.ts` (+1). No manifest, no lockfile, no
`biome.json`, no `tsconfig.json`, no `vitest.config.ts`.

**The production module's entire executable text is 16 lines** — five imports and one factory that
returns an arrow function calling `assembleFrame` over `renderBoard` / `renderStatusPanel` /
`renderHistory`. Read in full. It contains no `process.`, no `node:`, no `argv`, no `env`, no read,
no write, no spawn, no `fetch`, no `eval`. The single grep hit for those patterns in the file is the
word "argv" inside a docblock sentence about what `ABC-042` owns.

**The production boundary this repo actually holds, measured across all 47 `.ts` under `src/`:**

```
production (non-.test.ts) files importing a Node builtin:  0
test files importing a Node builtin:                       3
  history-pane.nfr.test.ts   node:child_process, node:fs   (MERGED, pre-existing)
  san.test.ts                node:fs                       (MERGED, pre-existing)
  render-seam.test.ts        node:fs                       (added by ABC-041)
```

`ABC-041` does not breach that boundary. It adds the **third** test file to a lane that already had
two.

## The L1 walk

**Chapters with no surface in this application at all — not applicable, and the absence is measured,
not assumed.** A tight grep over `src/` for `from "node:(http|https|net|tls|dgram|crypto|dns)"`,
`fetch(`, `new WebSocket`, `createHash`, `createCipher`, `randomBytes` returns **nothing**. There is
no HTTP server, no client, no socket, no TLS, no crypto primitive, no database, no ORM, no cookie, no
session store, no token, no credential, no user account, and no browser. Confirmed by
`AGENTS.md` § Deployment posture (local-only, no container, no CI, no remote, no release ever cut)
and `ADR-0007`.

- **V1 Encoding and Sanitization** (8 L1) — `V1.2.1`–`V1.2.4`, `V1.3.1`, `V1.5.1` **N/A**: no HTML,
  XML, URL, JS/JSON serialization, WYSIWYG or XML parser exists.
  - `V1.2.5` **OS command injection — PASS.** The diff adds **zero** spawn/exec/`child_process`
    (`git diff eea6afc HEAD -- src/ | grep '^+'` for those tokens: no match). The merged probe's
    `spawnSync` is pre-existing, untouched by this diff, and out of this ticket's scope.
  - `V1.3.2` **eval / dynamic code execution — PASS.** No `eval(`, no `new Function(` anywhere in
    `src/`. The `import(...)` hits are ESM dynamic imports of first-party modules in merged test
    files, none added here.
- **V2 Validation and Business Logic** (4 L1) — `V2.1.1`, `V2.2.1`, `V2.2.2` **N/A**: this change
  accepts no external input to validate. The seam's four parameters arrive from an in-process caller
  and are typed by `ABC-019`'s published `RenderSeam`; there is no trust boundary and no service
  layer. `V2.3.1` **N/A**: no multi-step business flow, no user.
- **V3 Web Frontend Security** (8 L1) — **N/A**, no web frontend.
- **V4 API and Web Service** (2 L1) — **N/A**, no API.
- **V5 File Handling** (4 L1) — **THE ONE CHAPTER THE `node:fs` IMPORT ACTIVATES**, and the only
  reason a walk was worth running:
  - `V5.3.2` **path construction from trusted data — PASS, and this is the substantive one.**
    `SOURCE_DIRECTORY` is `new URL(".", import.meta.url).pathname` — the test file's own directory,
    fixed at module load from the module's own URL. `sourceOf(file)` is reached from exactly three
    argument sources, all enumerated at `src/render-seam.test.ts:55,79,96,101,266,287`: two string
    literals (`"render-seam.ts"`, `"history-pane.nfr.test.ts"`) and the output of
    `readdirSync(SOURCE_DIRECTORY)` filtered to `.ts` and not `.test.ts`. **No argv, no env, no
    network, no stdin, and no user-supplied value reaches a path.** There is no traversal input to
    traverse with.
  - `V5.2.1` **size / DoS — PASS.** The reads are bounded by the repo's own `src/` (47 files), all
    first-party source, read once per test.
  - `V5.2.2` **extension / content validation — PASS in scope.** The filter is `endsWith(".ts")` and
    the files are the repository's own committed source. No file here is accepted from an untrusted
    party and none is used for a business or security decision.
  - `V5.3.1` **uploaded files executed via HTTP — N/A**, no upload, no public folder, no HTTP server.
- **V6 Authentication** (13), **V7 Session Management** (6), **V8 Authorization** (4), **V9
  Self-contained Tokens** (4), **V10 OAuth and OIDC** (5), **V11 Cryptography** (3), **V12 Secure
  Communication** (3) — **all N/A.** None of these surfaces exists in the repository.
- **V13 Configuration** (1 L1) — `V13.4.1` (deployed without `.git`) **N/A**: nothing is deployed and
  nothing is published (`"private": true`, no `bin`, `npm run build` is `tsc --noEmit` and emits
  nothing).
- **V14 Data Protection** (2 L1) — **N/A**: no HTTP, no client storage. There is no personal data,
  no PII, no credential and no secret anywhere on this path. A secrets scan over the delivered diff
  (`api_key|secret|token|passwd|password|PRIVATE KEY|xox[baprs]-|ghp_|AKIA…`) returns only the local
  variable `const token = FOOLS_MATE[cursor++]` — a four-character chess move like `"f2f3"`.
- **V15 Secure Coding and Architecture** (3 L1):
  - `V15.3.1` **return only the required subset of fields — PASS.** The seam returns
    `readonly string[]` — rendered rows. It exposes no object.
  - `V15.1.1` / `V15.2.1` **3rd-party remediation timeframes / in-timeframe components — see the
    dedicated section below.** Not `ABC-041`'s, and not clean either; recorded honestly.
- **V16 Security Logging and Error Handling**, **V17 WebRTC** — **0 L1 requirements** at this level.

**No L1 requirement fails on `ABC-041`'s change.** Nothing reaches the `high` default severity an L1
failure would carry, so nothing crosses `security.block_on = high`.

## The one thing that is NOT clean, scoped honestly: dev-dependency advisories

`npm audit` on this tree reports **3 vulnerabilities — 1 moderate, 2 high**:

```
brace-expansion  high      DoS via unbounded expansion / unbounded intermediate arrays (bypass of CVE-2026-14257 mitigation)
nanoid           high      custom generators can loop indefinitely when size is zero  (GHSA-2v37-7h3g-55p8)
postcss          moderate  attacker-controlled sourceMappingURL reads arbitrary .map files when `from` is unset (GHSA-fxqj-rqcc-2cmp)
```

`npm audit --omit=dev` → **`found 0 vulnerabilities`**. The audit metadata reads `prod: 1` (the root
package itself), `dev: 180`. All three live in the test toolchain.

**This is not attributable to `ABC-041` and I will not attach it to this ticket's result.**
`package.json` and `package-lock.json` are **byte-untouched** by the diff, and the package has no
`dependencies` key at all — so the change adds exactly zero supply-chain surface.

**It is already an accepted risk with a named owner, and I am REFERENCING it rather than re-raising
it:** `AR-1` in `.grugops/context/architecture-audit-2026-07-29/notes/…-security-nfr-observation-abedec95.md`,
severity overridden `high` → `low` with a stated reason, **owner: Release Manager**.

**What has changed since, and it is why this is recorded rather than silently inherited: the covered
set has DRIFTED.** `AR-1` was written 2026-07-29 over **5 high, all `brace-expansion`**, and its
override reason is specific — *"the vulnerable code path requires attacker-controlled glob patterns,
which do not exist here"*. Today's set is **3 (2 high, 1 moderate)** and **`nanoid` and `postcss` are
new entries that `AR-1`'s stated reason does not cover**.

**Disposition — an extension of `AR-1`, stated so it is visible rather than assumed.** The override's
*structural* premise is re-verified today and still holds: `npm audit --omit=dev` is **0**, the
package has **zero runtime dependencies**, is `"private": true`, declares no `bin`, emits nothing
from `build`, and `AGENTS.md` § Deployment posture records that nothing is deployed anywhere. None of
the three packages can reach a runtime artifact, because there is no runtime artifact. Severity
overridden **high → low, in context**, on that reason. **Owner: Release Manager**, unchanged — this
is the build/release surface, it wants a version bump on its own branch and its own gate, and it is
not a drive-by on a 62-line render seam. Recorded here, homed there.

## Result

- **`ABC-041`'s change: `PASS`.** Zero findings at any severity. **Zero required fixes.** Nothing
  crosses `block_on = high`. Under the subtask's vocabulary this is `PASS`, not `PASS_WITH_FIXES`.
- **The review as a whole: `PASS_WITH_RISKS`**, and the distinction is deliberate rather than
  hedging. The only accepted risk carried is the dev-dependency one above; it is **pre-existing,
  untouched by this diff, and owned by the Release Manager**. Labelling the ticket
  `PASS_WITH_RISKS` would have implied `ABC-041` carries risk it does not; labelling the review flat
  `PASS` would have buried an accepted-risk extension I actually made. Both scopes are stated instead.

Per WF15 step 4 this review produces the result and does not enforce it. Enforcement is the gate's
(`agent-factory/workflows/05-pr-quality-gate.md`), QE holds it, and it is running the same tip in
parallel. **I did not merge and did not deploy.**

## Two things noticed and deliberately NOT inflated into findings

1. **`new URL(".", import.meta.url).pathname`** breaks on a repository path containing spaces or
   percent-encodable characters (it returns the percent-encoded path); `fileURLToPath` is the correct
   idiom. **Not a security defect** — the failure mode is a test that cannot open its own source, not
   an exposure — and it is **house precedent at three merged sites** in
   `src/history-pane.nfr.test.ts` (`:315`, `:388`, `:539`). Coding rule 11 says match existing style;
   the Engineer did. Named here so it is on record, owed to nobody as a fix on this branch.
2. **The merged probe's `spawnSync` and `writeSync(3, …)`** (`src/history-pane.nfr.test.ts`) are the
   only spawn and the only filesystem *write* anywhere under `src/`. Both are pre-existing, both are
   byte-untouched by this diff, and both are outside this ticket's scope. Stated so that "the diff
   adds no write and no spawn" is read as the measured claim it is rather than as a claim about the
   tree.
