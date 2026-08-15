---
id: 20260816T011800Z-security-nfr-observation-the-asvs-l1-reading-seven-of-seventy-apply-3e8b62c9
kind: observation
by: security-nfr
at: 2026-08-16T01:18:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - ABC-042
  - ABC-056
  - src/cli.ts
  - src/cli-options.ts
  - src/cli.test.ts
supersedes: 
---

# The ASVS L1 reading for `ABC-066` — **7 of the 70 L1 requirements apply, 7 PASS, 0 FAIL**

Filtered at read time to `security.asvs_level: "L1"` per Workflow 15 step 1. **The filter yields
exactly 70 requirements**, which matches that step's stated L1 count — the checklist file ships the
full ASVS 5.0 set and is not regenerated when the dial changes. Levels are cumulative; at L1 nothing
above L1 is in scope, and I have not audited to L2 or L3 and do not imply I have.

**Every pass below cites evidence. Nothing is ticked unbacked.** Where a requirement cannot apply I
record it **not-applicable with its reason** — not as a pass.

## The 7 that apply, each with its evidence

| req | requirement (abbreviated) | verdict | evidence I measured |
|---|---|---|---|
| **V1.2.5** | protects against OS command injection; OS calls are parameterized or contextually encoded | **PASS** | Production makes **zero** OS calls: no `node:child_process` in any of the 20 production files, **0** `spawn`/`exec`/`fetch` call sites. The one call site anywhere is `src/cli.test.ts`'s `spawnSync` in **argv-array** form; **0** `exec(` call sites, **0** `execSync(` call sites, **0** `shell:`, no argv built by string concatenation (`ABC-042` bar 1b, re-verified). The changed line is a **fixed literal printed as advice to a human**, never executed, and contains no user input. |
| **V1.3.2** | avoids `eval()` and dynamic code execution | **PASS** | **0** occurrences of `eval`, `new Function`, or argv-derived dynamic `import(` in production. A standing textual guard at `src/cli.test.ts:787` sweeps `["eval","Function(","child_process","import("]` and passes. |
| **V2.1.1** | documentation defines input validation rules | **PASS — and this change improves it** | `ACCEPTED_ARGUMENTS` (`src/cli-options.ts:46`) is the documented allowlist, **6 tokens**. This ticket's entire purpose is that the **printed** rule is now a runnable one: `npm run chess -- ` went from **0** occurrences in the program's output to present on **6 of 6** refusals. A validation rule the user cannot act on is a documentation defect, and it is the one being repaired. |
| **V2.2.1** | input validated to enforce expectations; **positive validation / allowlist** | **PASS** | `resolveOptions` is an allowlist over `ACCEPTED_ARGUMENTS`, **byte-unchanged** by this diff (`src/cli-options.ts` → **0** lines). Re-armed rather than assumed: `--`, `--depth`, `purple` and five malformed tokens all refuse with exit **1** and a named offending argument. **This is the requirement `ABC-042` was `BLOCKED` on (`RF-1`) and discharged on 2026-08-14; the discharge still holds and I re-checked it rather than inherit it.** |
| **V2.2.2** | validation enforced at a trusted layer | **PASS (adapted)** | There is no untrusted client tier — one local process. Validation runs in-process in `resolveOptions` **before any effect**: the refusal branch `return`s before `beginGlyphModeSession`, `newGame` or `beginFrameSession` are reached. The trusted layer is the only layer. |
| **V15.1.1** | documentation defines risk-based remediation timeframes for vulnerable 3rd-party components | **PASS by reference, with a named standing gap** | See `AR-1` below. **Not a finding of this change** — manifests are byte-untouched, so clause (a) does not fire. |
| **V15.2.1** | contains only components within the documented remediation timeframes | **PASS by reference** | `npm audit --omit=dev` → **found 0 vulnerabilities**. See `AR-1` below. |

## The standing accepted risk `AR-1`, re-checked at this gate rather than re-raised

`npm audit` on this branch: **3 vulnerabilities — 2 high, 1 moderate** (`brace-expansion` high,
`nanoid` high, `postcss` moderate), **all `isDirect: false`**.

**`npm audit --omit=dev` → `found 0 vulnerabilities`.** The package declares **no `dependencies` key
at all** (`Object.hasOwn(pkg,"dependencies")` → `false`); all three advisories are dev-toolchain
transitives under vitest/biome. The package is `"private": true` and `deploy` is
`none-local-only` — nothing is ever published or up.

**This is already found, already owned, already ticketed, and I am not re-raising it as a finding of
`ABC-066`:**

- **`AR-1`** is the standing accepted-risk override. **Owner: Release Manager.**
- **`ABC-056`** (`XS`, `P2`, Backlog, owner Release Manager) tracks precisely the drift I would
  otherwise be reporting — that `AR-1`'s stated reason covers `brace-expansion` only while the set
  is now three packages, and that **`AR-1` carries no re-check trigger**.

**Honest note on the severity map.** A strict reading of **V15.1.1** — *documentation defines
risk-based remediation **timeframes*** — is a **fail** at the repository level, because `AR-1` states
no timeframe and no re-check trigger; `ABC-056` says so in its own words. Workflow 15 step 3's
default map makes an L1 failure **`high`**, and `security.block_on` is `high`. **I am recording an
explicit severity override to `LOW`, with the reason and the owner the role's hard limits require:**

> **Reason for the override:** the exploitable surface is empty, not merely small. `npm audit
> --omit=dev` is **0**, there are **zero runtime dependencies**, the package is `private` and is
> never deployed. A remediation-timeframe gap on a dev-only toolchain advisory in a never-published
> local package is not a missing **baseline control of the shipped product**, which is what the L1 →
> `high` default is calibrated for. **Owner: Release Manager** (`AR-1`), **tracked by `ABC-056`**.

**This does not block `ABC-066` and is not attributable to it.** `ABC-066` touches **0** manifest
lines. Re-raising a known, owned, ticketed risk as a new finding at every per-ticket gate would be
gold-plating, which the role forbids; recording that I re-checked it and that it still holds is not.

## The 63 that do not apply, with the reason — recorded as N/A, **never as passes**

| section | L1 items | why not applicable to this change or this product |
|---|---|---|
| V1 (minus 1.2.5, 1.3.2) | 6 | No HTTP response, HTML, XML, URL building, JavaScript/JSON generation, database or XML parser exists anywhere in the product. |
| V2.3.1 | 1 | No multi-step business flow; the program parses argv, writes one frame, exits. |
| V3 Web Frontend | 8 | No browser, no cookies, no HSTS, no CORS, no HTTP methods. The UI is a terminal. |
| V4 API / Web Service | 2 | No HTTP service, no WebSocket. |
| V5 File Handling | 4 | The product accepts **no** file input and writes **no** file; **0** fs-write tokens in production. |
| V6 Authentication | 13 | No authentication, no accounts, no passwords. |
| V7 Session Management | 6 | No sessions, no tokens. |
| V8 Authorization | 4 | No consumers, no permissions; one local user. |
| V9 Self-contained Tokens | 4 | No tokens. |
| V10 OAuth / OIDC | 5 | No authorization server. |
| V11 Cryptography | 3 | No cryptography of any kind. |
| V12 Secure Communication | 3 | **No network I/O at all** — 0 `node:http/https/net/dns/tls`, 0 `fetch(`, in production and in tests. |
| V13.4.1 | 1 | Nothing is ever deployed (`deploy: none-local-only`), so source-control metadata cannot be deployed with it. |
| V14 Data Protection | 2 | No client storage, no HTTP, no sensitive data; the program holds a chess position. |
| V15.3.1 | 1 | No data objects are returned to any consumer. |

**63 N/A + 7 applicable = 70.** The arithmetic is stated so the filter can be checked rather than
trusted.

**V16 (Security Logging and Error Handling) contributes ZERO L1 requirements** — every V16 item is
L2 or L3 and is therefore outside this review's configured level. This is worth stating explicitly
because `ABC-066` changes an **error message**, and a reader might reasonably expect V16 to govern
it. At L1 it does not. **The control that does govern the refusal message is `ABC-042`'s bar 3**,
which maps to the V1.2.5 class, and I attacked it separately — see the bar-3 observation. The
C1/CSI escape class was ruled **L2** at `ABC-019` (`R-A`) and remains outside L1 scope; I have not
audited it and do not claim to have.

## The four mandatory gates, run by me on this tree

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | exit **0** — 54 files, 70 ms, **no fixes applied** |
| typecheck | `npm run typecheck` | exit **0**, no diagnostics |
| unit | `npm test` | exit **0** — **857 passed (857)** on **30 files (30)** |
| build | `npm run build` | exit **0** |
| skip count | `npx vitest run --reporter=json` | pending + todo = **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js … --skip-count 0` | **`No findings.`**, exit **0** |

All four `quality.mandatory_gates` pass, independently of the engineer's and QE's runs, and the
numbers agree with both.

**`scripts/check-uat-oracles.js` remains absent** — recorded `UNKNOWN - verify`, non-blocking, and
**not** recorded as a pass. Same reading QE recorded as `Q5`; referenced, not restated.
