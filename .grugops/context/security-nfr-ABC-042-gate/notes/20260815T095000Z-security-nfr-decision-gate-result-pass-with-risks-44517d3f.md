---
id: 20260815T095000Z-security-nfr-decision-gate-result-pass-with-risks-44517d3f
kind: decision
by: security-nfr
at: 2026-08-15T09:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - V2.2.1
  - V2.2.2
  - V1.2.5
  - V1.3.2
  - V1.3.3
  - N8-LANE
  - AR-1
  - AR-2
  - AR-3
  - AR-4
  - plans/traceability.md
supersedes: 
---

# THE GATE RESULT — `ABC-042`: **`PASS_WITH_RISKS`**. Not blocked. Zero high findings. `G1` escalates to the owner.

`security.asvs_level: L1`, `security.block_on: high`. Reviewed the **delivered artifact** at `8b07d9f`
against ASVS L1 as specified and against the four bars on the ticket — each of which I wrote, and each
of which now has something real to run against.

> **Result: `PASS_WITH_RISKS`.** **No finding is `high`, so nothing blocks on `block_on: high`.**
> **The security half stays TRIGGERED and NOT WAIVED.** Three low required fixes, one medium NFR breach
> escalated to the project owner, four accepted risks with named owners — one of them re-confirmed on
> the artifact.

## The four bars, against the real artifact

| bar | verdict | how it was decided |
|---|---|---|
| **bar 1** — arguments are data, never code (production modules) | **MET** | 0 `eval`, 0 `Function(`, 0 `child_process`, 0 `import(` over the whole source of both modules, comments included. No shell is reachable: production imports **zero** Node builtins |
| **`BAR 1b`** — the delivered TEST file | **MET** | 8 `exec` substring hits and **0 call sites** of `exec(`/`execSync(`; **0** `shell:`; `node:child_process` reached once, as `spawnSync(command, [...args], {…})` — argument-array form, no string concatenation. `RF-9`'s repair does exactly its job. **Property MET; no in-suite instrument — `S1`** |
| **bar 3** — no argument reaches the terminal unsanitised | **MET** | Ran the delivered build on four hostile tokens: 7-bit `ESC`, `DEL`, 8-bit CSI, NEL. **C0 and `U+007F` stripped from the echoed token on every one**, zero frame rows on both channels, non-zero exit. `printableOf` filters per token before the join, so it is not coupled to which token was probed. **Instrument residual — `S2`** |
| **bar 4** — no filesystem and no network (production modules) | **MET** | 7 import specifiers, **all relative**, two type-only. The grammar (with `http2`, `RF-10` landed) matches none. `fetch` / `WebSocket` / `XMLHttpRequest`: **0 / 0 / 0** |

## `V2.2.1` — my HIGH, and whether the discharge holds. **IT HOLDS.**

The delivered resolver is a real positive allowlist: one exported closed enumeration, membership by
**exact string equality**, **rejection as the default branch**. I did not take that from the assertions
I specified — I built the builds that would slip through:

- `--debug` accepted as a quoted literal: **KILLED by two rows.**
- `--debug` accepted as a template literal: **KILLED.**
- A second branch on argv after the resolver returns, with only one `process.argv` occurrence:
  **KILLED** — `A9`(2) is stronger than the criterion I wrote for it, and it refuted my own prediction.
- An **untargeted** fifth flag (`--engine-path`) written as a template literal: **SURVIVES** — `S3`.

**`V2.2.1` and `V2.2.2` are MET on the artifact.** `S3` is a regression-guard residual, strictly
narrower than the `RF-7` residual I graded medium before any code existed, and it is one regex
alternation wide.

## Findings — every one, with severity, owner and whether it blocks

**On severity mapping, stated so the grading is auditable.** The role's default is the failed ASVS
row's level: L1 fail → high, L2 fail → medium, L3 fail → low. **No ASVS row fails on this artifact.**
`S1`–`S3` are not row failures; they are gaps in the *instrument that guards a control which is
present and verified*. They are graded on the harm a future edit could do, with the reason stated on
each. Nothing is inflated to make it block and nothing is deflated to avoid one.

| id | finding | severity | owner | blocks? |
|---|---|---|---|---|
| **`G1`** | **`N8-LANE` NOT MET: 1300 ms CPU net against 650 ms = 2.00x**, admissibly measured (null −0.19%, sign 3/7). 1070 ms of it is ten criteria-forced children. **No conforming build meets it — the floor is ~810 ms net (1.25x) with a free rejection path.** The criteria are not defective; the bar is owner-ratified; **I may not move it** | **medium** — a stated bar breached at 2.00x, consuming 38% of remaining lane headroom in one ticket; graded neither up (to force a block) nor down (to wave it through) | **PROJECT OWNER (Olger Oeselg) — ESCALATED.** `NFR-008`'s level is his, ratified in person. BA/PM owns the per-cut allocation | **No** on `block_on: high`. **Yes** in the sense that the merge decision needs the owner's answer first — the Orchestrator cannot record this ticket clean on `N8-LANE` |
| **`S1`** | **`BAR 1b` has no in-suite instrument.** Its property holds, measured by me at the gate. But the bar says *"asserted textually over the delivered diff"* and the only assertion is **prose in the test file's own docblock**. Bars 1, 3 and 4 each got a row; this one did not. A future edit adding `execSync("…")` to the one file licensed to spawn is caught by nothing mechanical | **low** — `V1.2.5 [L1]` is **MET** today by measurement, the file is bounded, and any edit to it returns through review. It is a drift guard, not a control failure. *"Prose is not a criterion"* is my own sentence and it applies to me too: I verified it by hand this hop, so the gap is future-tense | **Software Engineer** — one `it` block: read `src/cli.test.ts` with comments stripped, assert 0 call sites of `/\bexec\s*\(/` and `/\bexecSync\s*\(/`, 0 `shell:`, and that every `spawnSync` argv argument is an array | **No** |
| **`S2`** | **bar 3's assertion is a positional proxy for the echoed token.** It reads `child.union.split("\n")[0]` and calls that *"a superset of the echoed token, so this is stronger, never weaker"* — true only while the echo sits on line 0 and stdout is empty. Mutant `M3` (sanitiser removed **and** token moved to line 2) ships **29/29 GREEN while emitting a literal `ESC [ 2 J` to the terminal**, shown by `od -c`. Mutant `M3b` (sanitiser removed, layout unchanged) is **KILLED**, so the instrument is armed against the obvious mutation and blind only when the layout moves with it | **low** — needs two coordinated changes to reach harm; the delivered build is correct; and terminal-escape injection is **`V1.3.3 [L2]`**, above this project's active L1 floor, which is to the ticket's credit. Same reasoning that graded `RF-3` medium when the criterion could pass vacuously in the *ordinary* case — this cannot | **Software Engineer** — locate the echoed token in the union and assert over the located substring, rather than over line 0 | **No** |
| **`S3`** | **`A6`(i)'s only-argv-literal scan does not match template literals.** Its regex covers `"…"` and `'…'`. Mutant `M2` — `--engine-path` recognised via a backtick literal — **survives 29/29 GREEN**: the enumeration is unchanged (so the element-for-element equality passes), the literal is invisible to the scan, `A6`(ii)'s random corpus is blind (P ≈ 1.4e-9), the 18 near-misses are derived from the table and do not include it, and the explicit fifth-flag row names only `--debug` | **low** — strictly narrower than the `RF-7` residual I graded **medium** before any code existed: then *any* fifth flag shipped green, now it must be neither `--debug` nor quoted. The control itself is present and verified by three mutants | **Software Engineer** — add `` `(?:[^`\\]|\\.)*` `` to the literal alternation. One token, and `M2` then dies the way `M0` does | **No** |

## Accepted risks — all four re-affirmed, owners unchanged, one re-confirmed on the artifact

- **`AR-1` — C1/CSI is outside bar 2's stated character class. NOW MEASURED ON THE DELIVERED BUILD, not
  argued.** `--colour <U+009B>2Jpurple` echoes **`U+009B` intact**; so does `U+0085`. The 7-bit `ESC`
  form the bar names is stripped. This is `ABC-019`'s `R-A` with `ABC-042` as the new source, exactly
  as I recorded it on paper. **`V1.3.3`-adjacent, L2, outside the active L1 set. NOT re-opened, NOT a
  required fix** — requiring it here would be gold-plating past a standing ruling. **Owner: BA/PM**
  (author of `R-A`'s clause). Recorded so the new source is on the record when `R-A` is next read.
- **`AR-2` — `A11` has no mechanical guard.** By design (`## Test notes` 6). **Discharged in substance
  by the build hop**: 68.8 ms median for the entry point, 150.3 ms for `npm run chess`, both with the
  machine named, both more than an order of magnitude under the ≤ 1 s bar, `plans/nfr-catalog.md`
  untouched. **Owner: the Engineer at build time — obligation met.**
- **`AR-3` — `Math.random()` for `--colour random`.** Unchanged. CSPRNG is `V11.5.1 [L2]`, outside the
  active set; a game-setup coin flip with no stake and no adversary. **Owner: Security/NFR (me).
  Revisit trigger unchanged: if the colour draw ever becomes stake-bearing.** The delivered
  `coin()` is `Math.random() < 0.5`, resolved in the resolver before any renderer or seam sees the
  word — verified by `A4`'s 1000 spawn-free resolutions with its leak counter at 0.
- **`AR-4` — an uncaught exception prints a stack trace with absolute paths to stderr.** `V16.5.1 [L2]`,
  outside the active set, no attacker on a local-only CLI (`ADR-0007`). The delivered build writes no
  `try`/`catch`, so the sub-clause ("must not swallow a non-zero exit") is moot. **Owner: the Engineer.
  Unchanged.**

## What I checked and deliberately did NOT raise, so the list is not padded

- **Bar 4's specifier scan cannot see a side-effect import** (`import "node:fs"`). Covered three times
  over — bar 1's `import(` ban is irrelevant to it, but production has **zero** non-relative imports
  and the review obligation fires on *"imports any Node builtin in a production module (permitted set:
  empty)"*. Same compensating-control reasoning that made `RF-10` low. Naming it would start the
  unclosable list I declined to start at `inspector`.
- **Bar 1's `not.toContain("eval")` would false-RED on a future comment containing "evaluations".** The
  error direction is a false RED, which fails safe. Same disposal the `ABC-041` hop gave the identical
  shape.
- **Repeated flags** (`--colour white --colour black`, `--ascii --ascii`) are accepted, last-wins. Every
  value is drawn from the allowlist, so **`V2.2.1` is untouched**. It is a wording question about
  whether `## Scope`'s table enumerates tokens or forms, and it is BA/PM's batched hop's if it is
  anyone's.
- **`process` aliasing to dodge `A9`(2).** I tried it (`M4`) and it **dies**. Closed, not deferred.

## Scope discipline — what this hop did and did not touch

- **Wrote:** my four notes here, the queue claim record, and **one cell** of `plans/traceability.md` —
  the stale `ABC-042` NFRs cell that has been flagged by three hops and that is mine. It said *"three
  bars"* where there are four and called a review obligation a firing threshold; both are corrected,
  the gate result is recorded there, and **the row was re-split after the write and still carries
  exactly 10 columns**, with every other line of the file verified byte-identical by hash.
- **Did not write:** `plans/board.md`, the ticket page, `plans/nfr-catalog.md`, `ADR-0008`, or any file
  under `src/`. **Zero bytes of production or test code changed by this hop.** Every mutant lived in an
  out-of-tree copy and was reverted from a pristine file.
- **Did not claim QE's gate.** The 12 criteria verdicts are the build hop's report and confirming them
  is QE's; I confirmed only what a security and NFR reading needs, and I re-measured rather than
  inherited every number I used.
- **Not merged. Not deployed.**

## The one sentence the Orchestrator needs

**`ABC-042` passes the ASVS L1 security gate with three low required fixes and four owned risks, and it
does not meet `N8-LANE` at 2.00x by a breach no conforming build can avoid — which is the project
owner's call, not mine, and it is escalated as such.**
