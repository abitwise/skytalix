---
id: 20261022T172518Z-release-manager-decision-130fb9a3
kind: decision
by: release-manager
at: 2026-10-22T17:25:18Z
verified_by: 
confidence: high
refs:
  - AR-1
  - ABC-198
  - ABC-056
  - ABC-168
  - QE-198-c
  - e0e5f987
  - 20261022T172421Z-release-manager-observation-d1d9ec04
  - 20261022T172439Z-release-manager-observation-eb1d1cdf
  - 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
  - 20261021T161340Z-orchestrator-decision-193e08fb
  - 20261022T153947Z-orchestrator-decision-e4ef897b
  - 20261022T161122Z-security-nfr-decision-0f626230
  - 20261022T153804Z-security-nfr-decision-140008ff
  - 20261022T171405Z-qe-e2e-decision-0b183705
  - 20261022T171339Z-qe-e2e-observation-feb20104
  - 20261022T172500Z-orchestrator-decision-2c4d34bd
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - 20261021T140532Z-security-nfr-decision-216ceb43
  - GHSA-2v37-7h3g-55p8
  - GHSA-fxqj-rqcc-2cmp
  - GHSA-68fv-2mgg-jv7q
supersedes: 
seal: sha256:6a680bc548bee727b69621f9f37f088f7980697b565f147a0f9169968ea968d7
---

# Release Manager: AR-1 RE-STATED on the 3-pair advisory set at `main` `e0e5f987`. The interim accept `…e4ef897b` has LAPSED. Pairs are compared, never counts. **Clause (2) premise drift has fired separately, from ABC-168's `bin`. The premise is NOT re-stated here; that re-read is routed**

**Inputs:**
- Orchestrator `…2c4d34bd` (ABC-198 Done; the interim accept lapses; this hop queued).
- The owner's approved set `…193e08fb`.
- Security/NFR `…0f626230` (the "AR-1 after the merge" section) and `…140008ff` (Ruling 3).
- QE `…0b183705` and its A7 reading `…feb20104`.
- The last full re-statement, `…901f43b6`.

**Readings:** `…d1d9ec04` (the audit set) and `…eb1d1cdf` (the premise checks). Both were measured by me on a fresh clone at `e0e5f987`.

**Authority:** the new set is a strict subset of the owner-approved `…193e08fb` and adds no HIGH. Under the owner delegation `…5aaf7cec` item 1, that sits inside the Orchestrator's remit, as `…0f626230` and `…2c4d34bd` state. This hop is the owner's Release Manager writing the record. It is not an approval of anything new, and it is not an owner signature.

## 1. The approved advisory set, re-stated
AR-1's recorded (package, advisory) set is now exactly these 3 pairs. They replace `…193e08fb`'s 6.

| package | installed | lock `dev` | npm severity | advisory | range |
|---|---|---|---|---|---|
| `nanoid` | 3.3.16 | true | high | GHSA-2v37-7h3g-55p8 | `<3.3.18` |
| `postcss` | 8.5.22 | true | moderate | GHSA-fxqj-rqcc-2cmp | `<=8.5.22` |
| `source-map-js` | 1.2.1 | true | high | GHSA-68fv-2mgg-jv7q | `1.0.0 - 1.2.1` |

**Contextual severity is low**, overridden from npm's high, under AR-1's package-independent dependency leg, which `…eb1d1cdf` measured as still holding:
- `npm audit --omit=dev` finds 0.
- There is no `dependencies` key, and 0 non-dev lock entries.
- No npm package specifier and no dynamic loader appears in the 42-file `src` production set or in the 22 built `dist/*.js` files.

**Dropped since `…193e08fb`:** the 3 vite pairs GHSA-698v-4r3x-3vcv, GHSA-r825-w8mm-5pxw and GHSA-587h-7wmj-h5pm. ABC-198's in-range bump removed them.

**Settled since `…193e08fb`:** `…216ceb43`'s `UNKNOWN - verify` (no dev-server or open-in-editor socket). QE `…feb20104` measured 0 listening sockets across a whole `npm test` at ABC-198's head, and its control plant read 1. I cite that reading; I did not re-run it. Its limit `QE-198-c` (one `/bin/sh` child outside the interposer, covered by `lsof` and a static read) is INFO.

`npm audit fix` is not taken. `fixAvailable: true` on all 3 pairs is recorded only as the option on file.

## 2. The interim accept `…e4ef897b` has LAPSED
- It covered only vite GHSA-9jrq-w75r-8gcw and GHSA-rq7h-c2jc-7f22, and @vitest/mocker GHSA-qxg6-89mg-rqv8 and GHSA-xp26-3454-mjgp.
- None of the 4 is in the audit at `e0e5f987`, and ABC-198 is merged.
- It is closed. Nothing stands on it.

## 3. Reopen triggers (re-read AR-1 and re-state this record when any is true; whoever observes it records it)
1. **Advisory drift (kept from `…901f43b6`).** The `npm audit` (package, advisory id) set differs from the table in § 1. That covers an added pair, a removed pair, and an empty set. It fires with the lockfile unchanged, because advisories come from the registry.
2. **Premise drift (kept).** Any of `…901f43b6`'s checks 1–7 reads differently from its recorded table. **This trigger has fired; see § 4.**
3. **Pairs, not counts (NEW).**
   - Every reader of `npm audit` on this repository compares the **sorted (package, advisory id) pair list** against § 1's table, with a literal `diff`.
   - A matching total or severity count is **not** evidence that clause (1) is quiet. 2026-10-22 showed why: "audit 7 = 7" hid 4 new pairs (`…e4ef897b` item 3).
   - The pair list is read with `npm audit --json | jq -r '.vulnerabilities[] | .name as $n | .via[] | select(type=="object") | "\($n) \(.url|split("/")|last)"' | sort`.
   - A non-empty `diff` fires clause (1). Any new pair at npm `high` or `critical` goes to the Orchestrator for the owner, under item 3 of the delegation.
   - Via-only rows (a package whose `via` holds only strings) are listed beside the pairs and do not fire on their own.

## 4. Clause (2) has FIRED: premise drift from ABC-168. NOT re-stated here; routed
- `…eb1d1cdf` measured three drifts at `e0e5f987`, all from ABC-168 (`825b21d1`, merged `513c0211`, after the owner approved `…193e08fb`):
  - check 3 now reads `[true,true,false,false,false]`, because of `bin` `skytalix` → `dist/uci.js`;
  - check 4: `build` now emits `dist/`;
  - check 5c: the built-in set is now `{node:fs, node:readline}`.
- Separately, `scripts.uci` is a second runtime script that check 6 does not read.
- `…901f43b6` § `A4` says: under a `bin`, "`AR-1`'s premise no longer holds, and re-stating it is not enough". ABC-056 names a `bin` as its `P1` promotion trigger.
- This hop's brief covers the advisory set only. I do not rewrite AR-1's reason or its check table on my own authority. Doing so would re-approve a changed premise without the review its own record demands.
- **What stands:** § 1's set, under the dependency leg that `…eb1d1cdf` measured as holding on both the source and built paths.
- **What does not stand:** the reason's sentences "declares no `bin`/`main`/`exports`/`files`" and "`build` emits nothing", the recorded built-in set `{node:fs}`, and check 6's single-script reach. Until they are re-read, they are **`UNKNOWN - verify`** as premises.
- **Routed to the Orchestrator**, for one of these:
  - (a) a Security/NFR hop re-reads AR-1's premise with the `bin` and `dist/` in scope. Candidates: widen check 3 to the declared `bin` set; replace check 4 with "`dist/` imports pass 5a–5d"; record `{node:fs, node:readline}`; have check 6 read every `scripts.*` that runs `src/`. A Release Manager hop then re-states the reason and table;
  - (b) the Orchestrator rules, under `…5aaf7cec`, whether a `bin` on a private, unpublished package is a "big architecture/requirements call" for the owner.
- I recommend (a) and do not decide (b).
- This does not block anything on the board. The dependency leg is intact, so the risk is not raised above low by this reading.

## Not touched
`package*.json`, `src/`, `tools/`, `plans/board.md`, `plans/traceability.md`, main's checkout. `AGENTS.md` holds no AR-1 line, so there was no risk-register line to update.
