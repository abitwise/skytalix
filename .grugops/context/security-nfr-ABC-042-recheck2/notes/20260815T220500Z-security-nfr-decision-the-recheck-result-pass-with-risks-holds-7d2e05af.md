---
id: 20260815T220500Z-security-nfr-decision-the-recheck-result-pass-with-risks-holds-7d2e05af
kind: decision
by: security-nfr
at: 2026-08-15T22:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - S1
  - S2
  - S3
  - S4
  - S5
  - E3
  - G1
  - AR-1
  - AR-2
  - AR-3
  - AR-4
  - V1.2.5
  - V1.3.2
  - V1.3.3
  - V2.1.1
  - V2.2.1
  - V2.2.2
  - V11.5.1
  - V13.4.1
  - V15.1.1
  - V15.2.1
  - V16.5.1
supersedes: 20260815T095000Z-security-nfr-decision-gate-result-pass-with-risks-44517d3f
---

# THE RE-CHECK RESULT — `ABC-042` at `d011df4`: **`PASS_WITH_RISKS`**. Not blocked. Zero high findings.

`security.asvs_level: L1`, `security.block_on: high`. **This note supersedes the VERDICT of my gate
note only** — that note's verdict was recorded against `8b07d9f`, which is not the tree that merges.
Its ASVS coverage map, its four accepted risks and its `G1` ruling stand unchanged and are not
re-opened here.

> **Result: `PASS_WITH_RISKS` against the tree that will actually merge.** **No finding is `high`, so
> nothing blocks on `block_on: high`.** The security half stays **TRIGGERED and NOT WAIVED**. `G1`
> remains escalated to the project owner and the merge stays held on it — **not mine to close.**

## The four bars, against THIS tree

| bar | verdict | decided how |
|---|---|---|
| **bar 1** | **MET** | 0 `eval` / `Function(` / `child_process` / `import(` over both production modules, comments included; production imports **zero** Node builtins, so no shell is reachable. Bytes identical to my gate reading, verified by blob SHA |
| **`BAR 1b`** | **MET** | comment-stripped: **0** `exec(` call sites, **0** `execSync(`, **0** `shell:`; the one `spawnSync` takes an **array literal** and no `+` appears in the call. Repository-wide 0/0/0 across 50 files. **Guard materially improved** — `MS3`/`MS3b` now die on the spawn-pin row |
| **bar 3** | **MET** | ESC and DEL children run by me: **zero** C0 and **zero** `U+007F` reaching the terminal, zero frame rows, exit 1. **`M3` — the mutant that beat this row at the gate — is now KILLED** |
| **bar 4** | **MET** | 7 specifiers, all relative, two type-only; the grammar matches none; `fetch` / `WebSocket` / `XMLHttpRequest` **0 / 0 / 0** |

## `S1`, `S2`, `S3` — the three I raised at the gate

| # | status on this tree |
|---|---|
| **`S3`** | **CLOSED.** The literal scan gained the backtick alternation. `M2` (`--engine-path` via a template literal) **SURVIVED 29/29 at the gate** and is now **KILLED by the only-argv-literal row**; `M0` (quoted) still killed. Rebuilt by me, not read off the report |
| **`S2`** | **CLOSED.** Bar 3 locates the echoed token by whitespace split and asserts over **every** occurrence. `M3` (sanitiser removed **and** token moved off line 0) — **the exact evasion that shipped 29/29 GREEN at the gate while emitting `ESC [ 2 J`** — is now **KILLED**; `M3b` still killed. Rebuilt by me |
| **`S1`** | **OPEN, and NARROWER. Still LOW.** No in-suite bar 1b row exists. But its **named harm is now caught**: `MS3` (a second `execSync` import plus a call site) and `MS3b` (widened import list) both **RED** on the spawn-pin row. The residual is **`shell:` and the no-concatenation clause only** — `MS4` proves it survives. **The `S1` reading is settled in my ruling note: QE is right, the row was writable, the bar already decides it** |

## Findings — every one, with severity, owner and whether it blocks

**Severity mapping, stated so the grading is auditable.** The role default is the failed ASVS row's
level. **No ASVS row fails on this artifact.** `S1`, `S4` and `S5` are not row failures; they are
gaps in instruments guarding controls that are present and verified, graded on the harm a future edit
could do. Nothing is inflated to make it block and nothing deflated to avoid one.

| id | finding | severity | owner | blocks? |
|---|---|---|---|---|
| **`G1`** | **`N8-LANE` NOT MET — 1300 ms CPU net against 650 ms = 2.00x.** **UNCHANGED by this tree**, and I measured the added work directly rather than re-running the lane: the 138-case family costs **0.0033 ms per full pass** against the old set's 0.0005 ms — a delta of ~0.003 ms against a 650 ms bar, **0.0005% of it**. Zero new spawns; the child set is byte-untouched in the diff and the pin at ten is green and now tamper-evident. This agrees with QE's independent 0.0062 ms and with its file-scoped −20 ms at chance | **medium**, unchanged | **PROJECT OWNER (Olger Oeselg) — ESCALATED, unanswered** | **No** on `block_on: high`. The merge stays held on it, and **that hold is not mine to lift, re-grade or re-open** |
| **`S1`** | **`BAR 1b` still has no in-suite instrument of its own**, but its harm is now mostly caught by the spawn-pin row. Residual: a `shell:` key added to the one spawn, and an argv built by concatenation, are asserted by **nothing** — `MS4` measured, 29/29 green | **low** — `V1.2.5 [L1]` is MET by measurement today, the file is bounded by `A12`, and any edit returns through review. A drift guard, not a control failure | **Software Engineer** — **two assertions appended to the existing spawn-pin row**, over `executableCodeOf` (not `sourceOf`): `shell\s*:` count 0, and no `+` inside the `spawnSync` argument text. **It cannot be written over raw source** — `shell:` occurs once in the file's own docblock | **No** |
| **`S4`** | **NEW. Bar 3's probe cannot observe its own `U+007F` clause.** The bar says *"spawn once with an argv token containing a literal `\x1b[2J`"*, so the one probe token carries **only** ESC. Mutant `M3h` — `printableOf` narrowed to `code < 0x20 && code !== 0x7f`, **the same two numeric literals**, ESC still stripped — ships **29/29 GREEN while `U+007F` reaches the terminal**. *(`M3f` and `M3g`, which change or delete a number, are both killed — by `A8`'s number transcription, not by bar 3. That is a real compensating control and it is why this is low rather than medium.)* **The defect is in MY bar text**: a clause naming three character classes, with a spawn spec exercising one | **low** — terminal-escape injection is **`V1.3.3 [L2]`, above the active L1 floor**; the delivered build is correct; a lone DEL byte is not an escape initiator; and two of the three ways to weaken the filter are caught by `A8` | **Software Engineer** (bar 3's probe token), or **BA/PM** if the bar's own spawn clause should say so. **The fix costs ZERO new spawns**: put `\x7f` and one more C0 into the SAME argv token. Given `G1`, "zero new spawns" is the whole reason this is worth naming | **No** |
| **`S5`** | **NEW. The spawn-pin row counts over RAW source, so a legal PROSE change reds it.** `sourceOf("cli.test.ts")` at `:787`, then `/\bspawnSync\s*\(/` pinned at 1 and the named-import list matched. **Measured**: one docblock sentence naming `` `spawnSync(` `` — exactly the shape this file's own docblock already uses for `` `exec(` `` — turns the row **RED on a correct file**. Direction is a **false RED**, which fails safe | **low** — no unsafe build passes. It is named because **this is the instrument the owner's `G1` decision rests on** (the row's own comment says so), and a false RED there reads as *"an eleventh child appeared"* on a ticket held at merge over a spawn-driven bar. Same class as QE's `Q11`, but here the fix is one identifier | **Software Engineer** — `sourceOf` → `executableCodeOf` at `:787`. **No kill is lost**: comment-stripped, the call-site count is still 1 and the import list still resolves, so `MS1` (an eleventh child) and `MS2` (namespace import) both still red. **Worth re-running those two after the change rather than taking my reasoning** | **No** |
| **`E3`** | **`A9`(2) is asserted entirely textually, and `A9`'s scope is the two new modules.** `MP10` rebuilt by me: a second `process.argv` read in the merged `src/history.ts` **survives 856/856**, and fires on the **rejection** path too | **low** — **ACCEPTED**; see my `E3` ruling note. `V2.2.2 [L1]` is **MET** on the delivered artifact | **Security/NFR (me)** — open as a standing reading, not a fix owed by this ticket. **Trigger: the first merged production module that acquires `process.argv`** (adopted verbatim from Architect/Design's `E2` trigger, so there is one trigger and not two) | **No** |

## Accepted risks — all four re-affirmed, owners unchanged

- **`AR-1` — C1/CSI outside bar 2's character class.** `V1.3.3`-adjacent, **L2, outside the active L1
  set**. `ABC-019`'s `R-A` with `ABC-042` as a new source. **Owner: BA/PM.** Not re-opened, not a
  required fix; requiring it here would be gold-plating past a standing ruling.
- **`AR-2` — `A11` has no mechanical guard.** By design. Discharged in substance three times now
  (engineer 68.8/150.3 ms, QE twice at 61.3–61.4/147.2–147.5 ms, bar ≤ 1 s). **Owner: the Engineer —
  obligation met.**
- **`AR-3` — `Math.random()` for `--colour random`.** CSPRNG is **`V11.5.1 [L2]`**, outside the active
  set; a game-setup coin flip with no stake and no adversary. **Owner: Security/NFR (me). Revisit
  trigger unchanged: if the colour draw ever becomes stake-bearing.**
- **`AR-4` — an uncaught exception prints a stack trace with absolute paths to stderr.**
  **`V16.5.1 [L2]`**, outside the active set, no attacker on a local-only CLI (`ADR-0007`). **Owner:
  the Engineer. Unchanged.**

## The ASVS L1 result — **nothing moved it**

| ASVS | at the gate (`8b07d9f`) | at `d011df4` |
|---|---|---|
| `V1.2.5 [L1]` | MET | **MET** — identical production bytes; and bar 1b's file gained a mechanical guard against an `exec`/`execSync` import |
| `V1.3.2 [L1]` | MET | **MET** — identical bytes |
| `V2.1.1 [L1]` | MET | **MET** — the exported enumeration still equals `## Scope`'s table element for element |
| `V2.2.1 [L1]` | MET (HIGH block discharged, held under 6 mutants) | **MET, and STRONGER** — `S3` closed the template-literal hole, the near-miss family is complete over position (138/134, 0 accepted), and 21 mutants across two hops die |
| `V2.2.2 [L1]` | MET | **MET, and STRONGER** — three independent rows; `E3`'s residual accepted with a named trigger |
| `V15.1.1` / `V15.2.1 [L1]` | MET | **MET** — `package.json` is untouched since my gate reading |
| `V13.4.1 [L1]` | N/A under `ADR-0007` | **N/A, unchanged** |

> **No ASVS L1 row changed disposition. The two that moved, moved in the safe direction.**

## The one sentence the Orchestrator needs

**`ABC-042` still passes the ASVS L1 security gate against the tree that will actually merge — all
four bars MET, zero high findings, two of my three gate findings CLOSED on mutants I rebuilt, two new
LOW instrument findings, four owned risks — and it still does not meet `N8-LANE` at 2.00x, which is
unchanged by this tree, is the project owner's call, and holds the merge.**
