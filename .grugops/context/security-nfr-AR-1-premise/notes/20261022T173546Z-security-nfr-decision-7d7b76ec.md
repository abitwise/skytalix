---
id: 20261022T173546Z-security-nfr-decision-7d7b76ec
kind: decision
by: security-nfr
at: 2026-10-22T17:35:46Z
verified_by: 
confidence: high
refs:
  - AR-1
  - ABC-056
  - ABC-168
  - AR-168-BINPIN
  - ADR-0036
  - 6ccbcc3e
  - 513c0211
  - 3781190b
  - V15.1.1
  - V15.2.1
  - GHSA-2v37-7h3g-55p8
  - GHSA-fxqj-rqcc-2cmp
  - GHSA-68fv-2mgg-jv7q
  - 20261022T173538Z-security-nfr-observation-a8796ea3
  - 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
  - 20261022T172439Z-release-manager-observation-eb1d1cdf
  - 20261022T172518Z-release-manager-decision-130fb9a3
  - 20261022T172421Z-release-manager-observation-d1d9ec04
  - 20261022T174000Z-orchestrator-decision-1b62e80b
  - 20261021T161340Z-orchestrator-decision-193e08fb
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - 20261021T143943Z-security-nfr-decision-75a45be0
supersedes: 
seal: sha256:51c562abb3b02b5ae37836fab0086960282b32866020808bfa678e927bee3e6c
---

# Security/NFR: AR-1 premise re-read, **PASS_WITH_RISKS**. AR-1's reason still holds with `bin` → `dist/uci.js` in scope: no flagged package is reachable from any shipped or runtime path. All 3 pairs are **LOW in context**, and none is HIGH, so there is no STOP. The reason's descriptive sentences are false and are rewritten below, with a revised check table for the Release Manager to adopt. **ABC-056's `P1` `bin` trigger has FIRED.** What it requires is § 4

ASVS L1, `block_on: high`, `compliance_regime` empty. The readings are in this task's observation note `…a8796ea3`; "observation §" below means that note. This is a `decision`, not a `finding`: `human_admission` is `off`, and no gate stamp exists for a premise re-read.

## 1. Ruling: does AR-1's reason still hold?
**Yes, on its load-bearing leg, and now measured on every path that can run or ship:**
- **Dependency leg.** `--omit=dev` finds 0. No key of any dependency type exists, there are 0 non-dev lock entries, and `bundled` is 0.
- **Static reach.** 5a, 5b and 5d are empty over the 42-file `src` production set, all 22 `dist` files and `spike/`. No script has a loader flag or a lifecycle hook, and there is no `.npmrc`.
- **Runtime reach.** Under a resolve hook, `src/cli.ts`, `src/uci.ts` and `dist/uci.js` resolve 0 `node_modules` URLs. A control that loads the three flagged packages reads 47, so the hook can see a package load when one happens.
- **The shipped artifact.** The packed tarball, installed into an empty prefix, adds exactly 1 package (`skytalix`). None of nanoid, postcss or source-map-js is installed. The installed `skytalix` bin resolves 0 non-`skytalix` `node_modules` URLs.

**What no longer holds** (confirming `…130fb9a3` § 4):
- "declares no `bin`";
- "`build` emits nothing";
- the recorded built-in set `{node:fs}`;
- check 6's reach of a single script.

The `bin` did remove a leg of the reason. That leg was descriptive, and the property it stood for ("nothing outside `src` runs") is now measured directly on the `bin` path and on the shipped artifact.

## 2. Revised reason (for the Release Manager to adopt; the scope paragraphs of `…718112dd` carry over)
> **No package from the npm tree is loaded on any runtime path, and none ships.** `npm audit --omit=dev` finds 0, and `package.json` has no key of any dependency type, so every audited package is a dev dependency. `npm pack` bundles no package and carries no `node_modules` path, so installing the packed artifact installs none of them. The runtime paths are:
> - the four `node` scripts: `chess` = `node src/cli.ts`, `uci` = `node src/uci.ts`, `perft` = `node src/perft-bench.ts` and `spike:perft` = `node spike/perft-bench.ts`. None has a loader flag, and there is no lifecycle script and no `.npmrc`;
> - the one `bin`, `skytalix` → `dist/uci.js`, which `build` (`tsc -p tsconfig.build.json`) emits from `src/uci.ts` into `dist/`.
>
> Their files import only relative modules and the Node built-ins in the recorded sets: `src` `{node:fs, node:readline}`, `dist` `{node:fs, node:readline}` and `spike` `{node:os}`. The package is `"private": true` and declares no `main`/`exports`/`files`. Dev packages run only when a developer invokes the toolchain (`vitest`, `vite`, coverage, `biome`, `tsc`) on files that the repository itself owns.

## 3. Revised premise check table
Run every check from a fresh checkout root after `npm ci --ignore-scripts`, with no `dist/` present. Use `command grep` (BSD grep). Inside the table, `\|` stands for `|`.

Define the file sets once:
- `F=$(find src -type f \( -name '*.ts' -o -name '*.mts' -o -name '*.cts' -o -name '*.js' -o -name '*.mjs' -o -name '*.cjs' \) ! -name '*.test.*' ! -name '*.d.ts' ! -name '*.d.mts' ! -name '*.d.cts' | sort)` is `ADR-0036`'s production set (unchanged). It holds 42 files today.
- `K` is the same `find`, with `spike` in place of `src`. It holds 1 file today.
- `D=$(find dist -type f | sort)` is read **after** check 4. It holds 22 files today, all `.js`.

The counts are context, not checks.

The table abbreviates three commands; spell them out as follows. Each runs over its file set:
- **5a** is `grep -hoE "(from\|import[[:space:]]*\(?)[[:space:]]*['\"][^'\"]+['\"]" <set> \| grep -vE "['\"](\./\|node:)"`.
- **5b** is `grep -nE "\brequire[[:space:]]*\(\|createRequire\|getBuiltinModule\|process\.(binding\|dlopen)\|\bimport[[:space:]]*\([[:space:]]*([^'\"[:space:]]\|$)" <set> \| grep -vE "^[^:]+:[0-9]+:[[:space:]]*(\*\|//)"`.
- **5d** is `grep -hoE "(from\|import[[:space:]]*\(?)[[:space:]]*['\"][^'\"]+['\"]" <set> \| grep -E "['\"/]\.\.(/\|['\"])\|node_modules"`.

| # | status | command | expected reading at `6ccbcc3e` |
|---|---|---|---|
| 1 | kept | `npm audit --omit=dev` | `found 0 vulnerabilities`, exit 0 |
| 2 | kept | `jq 'has("dependencies")' package.json` | `false` |
| 3 | **widened** (reads the declared `bin` set) | `jq -c '[.private, .bin, has("main"), has("exports"), has("files")]' package.json` | `[true,{"skytalix":"dist/uci.js"},false,false,false]` |
| 4 | **replaced** (build writes exactly `dist/`) | `B=$(git status --porcelain --ignored); npm run -s build; echo $?; A=$(git status --porcelain --ignored); diff <(echo "$B") <(echo "$A") \| grep '^[<>]'` | `0`, then exactly `> !! dist/` |
| 5a | kept (over `F`) | 5a over `$F` | empty |
| 5b | kept (over `F`) | 5b over `$F` | empty |
| 5c | **re-recorded** | ``grep -hoE "(from\|import[[:space:]]*\(?)[[:space:]]*['\"]node:[^'\"]+['\"]" $F \| grep -oE "node:[^'\"]+" \| sort -u`` | `node:fs node:readline` |
| 5d | kept (over `F`) | 5d over `$F` | empty |
| 5e | **new** (the `bin`'s tree) | 5a, 5b and 5d over `$D`, then the 5c command over `$D` | empty, empty, empty; then `node:fs node:readline` |
| 5f | **new** (the runtime script outside `src`) | 5a, 5b and 5d over `$K`, then the 5c command over `$K` | empty, empty, empty; then `node:os` |
| 6a | **widened** (every script, not only `chess`) | `jq -r '.scripts \| to_entries[] \| "\(.key)=\(.value)"' package.json` | exactly the 11 lines `typecheck`, `test`, `test:watch`, `lint`, `lint:fix`, `format`, `build`, `chess`, `uci`, `perft` and `spike:perft`, as listed in observation § 2. Any `diff` against the recorded listing fires |
| 6b | **new** (no loader flag in any script) | `jq -r '.scripts[]' package.json \| grep -E -- "--(import\|require\|loader\|experimental-loader)([=[:space:]]\|$)\|(^\|[[:space:]])-r[[:space:]]"` | empty |
| 6c | **new** (no lifecycle hook) | `jq -c '[.scripts \| keys[] \| select(test("^(pre\|post)") or IN("install","prepare","prepack","postpack","publish","dependencies"))]' package.json` | `[]` |
| 6d | **new** (the repository half of `…901f43b6`'s `.npmrc` residual) | `ls -A \| grep -cxE '\.npmrc'` | `0` |
| 7 | kept | `jq '[keys[] \| select(IN("dependencies","optionalDependencies","peerDependencies","bundleDependencies","bundledDependencies"))] \| length' package.json` and `jq '[.packages \| to_entries[] \| select(.key != "" and .value.dev != true)] \| length' package-lock.json` | `0` and `0` |
| 8 | **new** (what a pack ships) | `npm pack --dry-run --json --ignore-scripts \| jq -c '.[0] \| [(.bundled\|length), ([.files[].path \| select(test("(^\|/)node_modules/"))] \| length)]'` | `[0,0]` |

**Recorded built-in sets:** `src` `{node:fs, node:readline}`, `dist` `{node:fs, node:readline}` and `spike` `{node:os}`.

Plant controls for 5e (two plants), 6b (two plants) and 6c (one plant) each fired. They are listed in observation § 5. The kept checks' plants are `…901f43b6` § A2/A3.

**Optional, at a premise re-read only (not routine):** observation § 3's resolve-hook reading of the three runtime entries and of the installed tarball. Expect 0 `node_modules` URLs from each, and a non-zero control. It runs the engine for about a second. It is not a timing run.

**Trigger clause (2), revised:** any check 1–8 reads differently from the table above. Examples: a different `bin` value, `build` writing anything besides `dist/`, any 5c, 5e or 5f set change, a `scripts` listing diff, a non-empty 6b, a 6c other than `[]`, an `.npmrc`, or a pack reading other than `[0,0]`. Clause (1) and clause (3) of `…130fb9a3` are unchanged, and both read quiet today.

## 4. ABC-056's `P1` trigger: **FIRED**
- **Why it fires.** The page's text is: "Promote to `P1` the moment this project acquires a runtime dependency, a `bin`, or anything to deploy." A `bin` has existed on `main` since `513c0211`, so the `bin` leg has fired. The runtime-dependency leg has not fired: checks 2, 7 and 8 read `false`, `0`/`0` and `[0,0]`. The deploy leg has not fired: `private` is `true`, nothing is published, and `AGENTS.md` reads "This project deploys nowhere; it runs locally, from source."
- **The card itself.** ABC-056 is Done (merged `3781190b`, 2026-10-17), so there is no card left to promote.
- **What the trigger requires, in substance.** `…901f43b6` § A4: "re-stating it is not enough". The premise must be re-read and the reason rewritten, at `P1` urgency. Concretely:
  1. **The re-read with the `bin` path in scope.** This hop has done it.
  2. **A Release Manager hop that re-states AR-1** with § 2's reason and § 3's table and trigger. It supersedes nothing that also carries AR-2. This is P1: dispatch it next, before any further ticket that touches `package.json` (`bin`, `scripts`, dependencies), `tsconfig.build.json` or `dist/` merges. Nothing on the board waits on it.
  3. **The Orchestrator's standing process fix (`…1b62e80b`)** keeps the trigger alive: any ticket that adds a `bin`, a build output or a runtime dependency owes an AR-1 premise re-read before Done. Revised check 3, 4, 5e and 6a now make each of those visible as a premise drift.
- **What the trigger does not require.** It needs no owner escalation and no code change. The escalation rule in `…1b62e80b` is for a pair that is HIGH in context, and none is (§ 5).

## 5. Severity per pair, in context
All three pairs are reachable **only** on the developer toolchain path: `vitest`/`vite` → `postcss`, and coverage → `magicast`. That path runs on input the repository owns. None of the three is loaded by any runtime script or by the `bin`, none ships in a pack, and none is installed for a consumer of the packed artifact.

| pair | npm | in context | why |
|---|---|---|---|
| nanoid GHSA-2v37-7h3g-55p8 | high | **LOW** | It is a denial of service, and only through a custom generator called with size 0. The only caller is `postcss` inside the toolchain. There is no runtime or shipped reach, and it is absent from a consumer's install |
| postcss GHSA-fxqj-rqcc-2cmp | moderate | **LOW** | Exploitation needs attacker-controlled CSS with a `sourceMappingURL`. The repository tracks 0 CSS or `.map` files. It is toolchain only and absent from a consumer's install |
| source-map-js GHSA-68fv-2mgg-jv7q | high | **LOW** | It is an event-loop denial of service from a crafted indexed source map. Its inputs are toolchain only and repository-owned, and `dist/` holds no source maps. It is absent from a consumer's install |

**Override owner:** the Release Manager, as AR-1's owner. The reason is the one stated in § 2. Each override is from npm's severity to LOW. This matches the owner-approved set `…193e08fb`, and the 3 pairs are a subset of that set. No pair is HIGH in context, so the brief's STOP condition does not hold and no `finding` is published.

## 6. Result: **PASS_WITH_RISKS**
- **Required fixes:** none in code. Records: the Release Manager adopts § 2 and § 3 (§ 4 item 2).
- **Accepted risk:** `AR-1`, LOW, owned by the Release Manager. It holds the 3 pairs in `…130fb9a3` § 1, unchanged.
- **Residual, carried and narrowed.** `…901f43b6` named a loader flag reaching a runtime path from outside `package.json`. The repository half (`.npmrc`) is now check 6d. The user-environment half (`NODE_OPTIONS`, a user-level `~/.npmrc`) stays outside any repository check. It is LOW and owned by the Release Manager.
- **INFO (not AR-1; owner: the Orchestrator).** With no `files` key, a pack carries 8 607 entries, including `.grugops/` (8 154), `plans/` and `memory-bank/`. `dist/` ships only if `build` ran before the pack; otherwise the `bin` target is missing from the tarball. Neither case ships an npm package. **Trigger:** any step that packs or publishes the project, or that drops `"private": true`. That step owes a decision on a `files` allow-list and on a build before pack. There is no action today.
- **INFO.** The registry's range text for source-map-js now reads `>=1.0.0 <1.2.2`. It was recorded as `1.0.0 - 1.2.1`. The pair is the same, so clause (3) is quiet. A table re-statement may take the new text.

## Owed
- **The Orchestrator:**
  - dispatch the Release Manager re-statement (§ 4 item 2) at P1;
  - append the trace row in this task's done record;
  - no board move (no ticket sits in `In Security/NFR` for this).
- **The Release Manager:**
  - re-state AR-1's reason and premise table from §§ 2–3;
  - keep clauses (1) and (3);
  - adopt or replace the revised clause (2).
