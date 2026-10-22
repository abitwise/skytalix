---
id: 20261022T174056Z-release-manager-decision-edd18e94
kind: decision
by: release-manager
at: 2026-10-22T17:40:56Z
verified_by: 
confidence: high
refs:
  - AR-1
  - AR-2
  - ABC-056
  - ABC-168
  - ADR-0036
  - 8ddd3f42
  - 6ccbcc3e
  - 513c0211
  - GHSA-2v37-7h3g-55p8
  - GHSA-fxqj-rqcc-2cmp
  - GHSA-68fv-2mgg-jv7q
  - 20261022T174045Z-release-manager-observation-fb563109
  - 20261022T173546Z-security-nfr-decision-7d7b76ec
  - 20261022T173538Z-security-nfr-observation-a8796ea3
  - 20261022T175800Z-orchestrator-decision-32c61052
  - 20261022T174000Z-orchestrator-decision-1b62e80b
  - 20261022T172518Z-release-manager-decision-130fb9a3
  - 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
  - 20261017T102600Z-release-manager-decision-ar1-restated-718112dd
  - 20261021T161340Z-orchestrator-decision-193e08fb
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
supersedes: 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
seal: sha256:47519fe7e942ec9e04cb44efa2c9e2122aada5c0f66c833043285f5baad87336
---

# Release Manager: `AR-1` RE-STATED in full at `main` `8ddd3f42`, with the advisory set, the revised reason, check table 1–8 and triggers (1)–(3). It adopts `…7d7b76ec` §§ 2–3, with one pinning. All checks read as expected and all 3 pairs are LOW in context, so there is no STOP. It supersedes `…901f43b6`

**Inputs:**
- Security/NFR `…7d7b76ec` §§ 2–6 and its readings `…a8796ea3`.
- Orchestrator `…32c61052` (dispatch, plus the residual it accepted) and `…1b62e80b` (route (a), the process fix).
- My own `…130fb9a3` (the 3-pair set; clauses (1) and (3)).
- The last full re-statement `…901f43b6`.
- The owner set `…193e08fb`.

**Readings:** this task's observation `…fb563109`. I measured them myself on a fresh clone of `main` `8ddd3f42`, which is byte-identical to `6ccbcc3e` outside `.grugops/` and `plans/`. I ran them myself and did not copy them.

**Authority:**
- The advisory set is unchanged from `…130fb9a3`. It is a strict subset of the owner-approved `…193e08fb` and adds no HIGH in context.
- The rewritten reason narrows nothing. It replaces descriptive sentences that had become false with legs that are measured.
- The Orchestrator dispatched this under the owner delegation `…5aaf7cec`.
- This is the Release Manager writing AR-1's record. It is not an owner signature and not a release approval. No release is cut, and nothing is deployed.

**Supersession:**
- It supersedes `…901f43b6` and only that note. The 2026-07-29 note that also carries `AR-2` stays unsuperseded, as `…718112dd` and `…901f43b6` state.
- It also consolidates `…130fb9a3` § 1 and § 3. The `supersedes` field holds one id, so `…130fb9a3` is not formally folded. **A reader who wants AR-1 now reads this note alone.** Where `…130fb9a3` and this note differ, this note wins.

## 1. The advisory set: 3 pairs, LOW in context
| package | installed | lock `dev` | npm severity | advisory | range (registry text, 2026-10-22) | in context |
|---|---|---|---|---|---|---|
| `nanoid` | 3.3.16 | true | high | GHSA-2v37-7h3g-55p8 | `<3.3.18` | **LOW** |
| `postcss` | 8.5.22 | true | moderate | GHSA-fxqj-rqcc-2cmp | `<=8.5.22` | **LOW** |
| `source-map-js` | 1.2.1 | true | high | GHSA-68fv-2mgg-jv7q | `>=1.0.0 <1.2.2` (was recorded as `1.0.0 - 1.2.1`; same pair) | **LOW** |

**Why each is LOW (adopted from `…7d7b76ec` § 5):**
- Each pair is reachable only on the developer toolchain path: `vite` → `postcss` → {`nanoid`, `source-map-js`}, and `@vitest/coverage-v8` → `magicast` → `source-map-js`.
- That path runs on input the repository owns. 0 tracked CSS or `.map` files exist, and `dist/` has no source maps.
- None of the three is loaded by any runtime script or by the `bin`. None ships in a pack, and none is installed for a consumer of the packed artifact.

**Override owner:** the Release Manager. Each pair is overridden from npm's severity to LOW, on the reason in § 2. No pair is HIGH in context. `npm audit fix` is not taken; `fixAvailable` is recorded only as the option on file.

## 2. The reason (adopted verbatim from `…7d7b76ec` § 2)
> **No package from the npm tree is loaded on any runtime path, and none ships.** `npm audit --omit=dev` finds 0, and `package.json` has no key of any dependency type, so every audited package is a dev dependency. `npm pack` bundles no package and carries no `node_modules` path, so installing the packed artifact installs none of them. The runtime paths are:
> - the four `node` scripts: `chess` = `node src/cli.ts`, `uci` = `node src/uci.ts`, `perft` = `node src/perft-bench.ts` and `spike:perft` = `node spike/perft-bench.ts`. None has a loader flag, and there is no lifecycle script and no `.npmrc`;
> - the one `bin`, `skytalix` → `dist/uci.js`, which `build` (`tsc -p tsconfig.build.json`) emits from `src/uci.ts` into `dist/`.
>
> Their files import only relative modules and the Node built-ins in the recorded sets: `src` `{node:fs, node:readline}`, `dist` `{node:fs, node:readline}` and `spike` `{node:os}`. The package is `"private": true` and declares no `main`/`exports`/`files`. Dev packages run only when a developer invokes the toolchain (`vitest`, `vite`, coverage, `biome`, `tsc`) on files that the repository itself owns.

**Retired from `…901f43b6`'s reason** (false since ABC-168, `513c0211`):
- "declares no `bin`";
- "`build` emits nothing";
- the recorded set `{node:fs}`;
- "the runtime path is `npm run chess`" (singular).

**Carried over unchanged:** the scope paragraphs of `…718112dd`:
- not "ships nothing";
- an advisory against Node itself is outside AR-1;
- a runtime `dependencies` entry voids the premise;
- `npm audit fix` is not decided here.

**Why adopt rather than replace:**
- Every sentence in it is pinned by a check in § 3.
- The load-bearing claim, that nothing loads at runtime and nothing ships, was measured by Security/NFR directly, on the three runtime entries and on the installed tarball (`…a8796ea3` § 3).
- I found nothing in my readings that contradicts a sentence.

## 3. Premise check table 1–8 (adopted from `…7d7b76ec` § 3; one pinning, at 6a)
**How to run:** from a fresh checkout root, after `npm ci --ignore-scripts`, with no `dist/` present. Use `command grep` (BSD grep). Inside the table, `\|` stands for `|`.

**File sets:**
- `F=$(find src -type f \( -name '*.ts' -o -name '*.mts' -o -name '*.cts' -o -name '*.js' -o -name '*.mjs' -o -name '*.cjs' \) ! -name '*.test.*' ! -name '*.d.ts' ! -name '*.d.mts' ! -name '*.d.cts' | sort)` is `ADR-0036`'s production set.
- `K` is the same `find`, with `spike` in place of `src`.
- `D=$(find dist -type f | sort)` is read **after** check 4.
- The counts are context, not checks. At `8ddd3f42` they are `F` 42, `K` 1 and `D` 22.

**Spelled-out commands:**
- **5a** is `grep -hoE "(from\|import[[:space:]]*\(?)[[:space:]]*['\"][^'\"]+['\"]" <set> \| grep -vE "['\"](\./\|node:)"`.
- **5b** is `grep -nE "\brequire[[:space:]]*\(\|createRequire\|getBuiltinModule\|process\.(binding\|dlopen)\|\bimport[[:space:]]*\([[:space:]]*([^'\"[:space:]]\|$)" <set> \| grep -vE "^[^:]+:[0-9]+:[[:space:]]*(\*\|//)"`.
- **5c** is `grep -hoE "(from\|import[[:space:]]*\(?)[[:space:]]*['\"]node:[^'\"]+['\"]" <set> \| grep -oE "node:[^'\"]+" \| sort -u`.
- **5d** is `grep -hoE "(from\|import[[:space:]]*\(?)[[:space:]]*['\"][^'\"]+['\"]" <set> \| grep -E "['\"/]\.\.(/\|['\"])\|node_modules"`.

| # | command | expected | read at `8ddd3f42` |
|---|---|---|---|
| 1 | `npm audit --omit=dev` | `found 0 vulnerabilities`, exit 0 | as expected |
| 2 | `jq 'has("dependencies")' package.json` | `false` | as expected |
| 3 | `jq -c '[.private, .bin, has("main"), has("exports"), has("files")]' package.json` | `[true,{"skytalix":"dist/uci.js"},false,false,false]` | as expected |
| 4 | `B=$(git status --porcelain --ignored); npm run -s build; echo $?; A=$(git status --porcelain --ignored); diff <(echo "$B") <(echo "$A") \| grep '^[<>]'` | `0`, then exactly `> !! dist/` | as expected |
| 5a | 5a over `$F` | empty | as expected |
| 5b | 5b over `$F` | empty | as expected |
| 5c | 5c over `$F` | `node:fs node:readline` | as expected |
| 5d | 5d over `$F` | empty | as expected |
| 5e | 5a, 5b and 5d over `$D`, then 5c over `$D` | empty, empty, empty; then `node:fs node:readline` | as expected |
| 5f | 5a, 5b and 5d over `$K`, then 5c over `$K` | empty, empty, empty; then `node:os` | as expected |
| 6a | `jq -r '.scripts \| to_entries[] \| "\(.key)=\(.value)"' package.json` | **byte-identical to the listing pinned below.** Any `diff` fires | as expected |
| 6b | `jq -r '.scripts[]' package.json \| grep -E -- "--(import\|require\|loader\|experimental-loader)([=[:space:]]\|$)\|(^\|[[:space:]])-r[[:space:]]"` | empty | as expected |
| 6c | `jq -c '[.scripts \| keys[] \| select(test("^(pre\|post)") or IN("install","prepare","prepack","postpack","publish","dependencies"))]' package.json` | `[]` | as expected |
| 6d | `ls -A \| grep -cxE '\.npmrc'` | `0` | as expected |
| 7 | `jq '[keys[] \| select(IN("dependencies","optionalDependencies","peerDependencies","bundleDependencies","bundledDependencies"))] \| length' package.json` and `jq '[.packages \| to_entries[] \| select(.key != "" and .value.dev != true)] \| length' package-lock.json` | `0` and `0` | as expected |
| 8 | `npm pack --dry-run --json --ignore-scripts \| jq -c '.[0] \| [(.bundled\|length), ([.files[].path \| select(test("(^\|/)node_modules/"))] \| length)]'` | `[0,0]` | as expected |

**The 6a listing (pinned here, 11 lines):**
```
typecheck=tsc --noEmit
test=NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/run-bounded.js 60000 vitest run --reporter=default --reporter=./tools/grugops/result-file-reporter.js --outputFile.json=.test-results/last-run.json
test:watch=NODE_OPTIONS=--max-old-space-size=128 vitest
lint=biome check .
lint:fix=biome check --write .
format=biome format --write
build=tsc -p tsconfig.build.json
chess=node src/cli.ts
uci=node src/uci.ts
perft=node src/perft-bench.ts
spike:perft=node spike/perft-bench.ts
```

**The one change from `…7d7b76ec` § 3: 6a's expected reading is pinned as literal text in this record.** § 3 said "as listed in observation § 2". That observation names the 11 keys, but it gives values for only the four `node` scripts. A literal `diff` needs the full text, so the record now holds it. The reading is the same.

**Recorded built-in sets:** `src` `{node:fs, node:readline}`, `dist` `{node:fs, node:readline}` and `spike` `{node:os}`.

**Plant controls (cited, not re-run):** `…901f43b6` § A2/A3 for the kept checks, and `…a8796ea3` § 5 for 5e, 6b and 6c. Each fired.

**Optional, at a premise re-read only (not routine):** the resolve-hook reading of `src/cli.ts`, `src/uci.ts` and `dist/uci.js`, and of the installed tarball's `bin` (`…a8796ea3` § 3). Expect 0 `node_modules` URLs from each, and a non-zero control. It is not a timing run. This hop cites Security/NFR's reading at `6ccbcc3e`, because source and manifests are byte-identical at `8ddd3f42`.

## 4. Reopen triggers
AR-1 must be re-read, and this record re-stated, when any of the following is true. Whoever observes it records it.
1. **Advisory drift.** The `npm audit` (package, advisory id) set differs from § 1. That covers an added pair, a removed pair, and an empty set. It fires with the lockfile unchanged, because advisories come from the registry. A new pair at npm `high` or `critical` goes to the Orchestrator for the owner, under item 3 of `…5aaf7cec`. **Quiet at `8ddd3f42`.**
2. **Premise drift.** Any check 1–8 reads differently from § 3's expected column. Examples:
   - a different `bin` value, or a `main`/`exports`/`files` key;
   - `build` writing anything besides `dist/`;
   - any 5a, 5b or 5d output, or any 5c, 5e or 5f built-in set change;
   - any 6a `diff` against the pinned listing, a non-empty 6b, a 6c other than `[]`, or an `.npmrc`;
   - either check 7 count other than `0`;
   - a pack reading other than `[0,0]`.

   **Quiet at `8ddd3f42`.** Check 2 or 7 turning, a second `bin`, a publish or dropping `"private": true` also re-arms ABC-056's `P1` substance (§ 6).
3. **Pairs, not counts.** Every reader of `npm audit` compares the sorted pair list from `npm audit --json | jq -r '.vulnerabilities[] | .name as $n | .via[] | select(type=="object") | "\($n) \(.url|split("/")|last)"' | sort` against § 1, with a literal `diff`. A matching total or severity count is **not** evidence that clause (1) is quiet. Via-only rows are listed beside the pairs and do not fire on their own. A change in range text alone, with the same pair, does not fire. **Quiet at `8ddd3f42`** (`diff` rc 0).

## 5. Residuals I own
- **AR-1 itself:** LOW, owned by the Release Manager. It holds the 3 pairs in § 1.
- **The loader flag set outside the repository: LOW, accepted** by the Orchestrator in `…32c61052`. Owner: the Release Manager.
  - A loader flag can reach a runtime path through the user's `NODE_OPTIONS` or a user-level `~/.npmrc` `node-options`.
  - No repository check can see that. The repository half (`.npmrc` in the checkout) is check 6d.
  - Exploiting it needs a developer environment that is already compromised.
  - **Trigger:** any change that makes the project run somewhere other than a developer's own shell, such as CI that runs the `bin`, a published package, or a deploy. Any of those must re-weigh this residual.

**Not mine, cited:** the INFO that, with no `files` allow-list, a pack would carry the whole repository (`…7d7b76ec` § 6). The owner is the Orchestrator. The trigger is any pack or publish, or dropping `"private": true`.

## 6. ABC-056's `P1` trigger: what this hop discharges
- `…7d7b76ec` § 4 item 2, the Release Manager re-statement, is **done by this note**. Item 1, the re-read, was done by Security/NFR. Item 3, the Orchestrator's process fix in `…1b62e80b`, stands: any ticket that adds a `bin`, a build output or a runtime dependency owes an AR-1 premise re-read before Done. Checks 3, 4, 5e, 6a and 8 now make each of those a clause (2) drift.
- The merge hold in `…32c61052` was "no ticket touching `package.json`, `tsconfig.build.json` or `dist/` merges until this hop lands". It waits only on this branch merging. Lifting it is the Orchestrator's call.

## Not touched
- `src/`, `tools/`, `package*.json`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` and main's checkout.
- No release record is cut: this is a risk-record hop, with no REL and no deploy.
- Nothing was pushed, merged, forced, amended or rebased.
