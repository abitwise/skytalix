---
id: 20260812T125500Z-security-nfr-observation-security-surface-3e70a1c4
kind: observation
by: security-nfr
at: 2026-08-12T12:55:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-017
  - ABC-017
  - ABC-010
  - EPIC-006
  - NFR-002
  - src/history-pane.ts
  - src/fen.ts
  - agent-factory/checklists/security-nfr-checklist.md
supersedes:
---

# The security half — ASVS L1. No injection surface, and ONE real input-validation gap that is BOUNDED and pre-existing.

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`.**
> `security.asvs_level` is `L1` (70 of the 345 requirements), `security.block_on` is `high`,
> `compliance_regime` is `[]` and `mode` is `lean` — **so there is no Compliance Officer hop**, and
> Section 13's deeper compliance work is not triggered. The security half still runs, and it did.

## Checklist scope, honestly bounded

At L1 the great majority of the active set is **structurally not applicable** to this change, and
that is a measured statement rather than a shrug: `src/history-pane.ts` is a pure function that
takes a `GameHistory` and returns `string[]`. Its runtime closure is seven modules
(`apply`, `fen`, `history-pane`, `legal`, `moves`, `position`, `san`). There is **no auth, no
session, no authorization, no token, no crypto, no network, no database, no file I/O, no child
process, no environment read, no logging, and no user account** anywhere in it — so V4, V6, V7, V8,
V9, V10, V11, V12, V17 have no surface at all, and V3's browser controls have no browser.

The requirements that genuinely engage, and what each reads:

- **V1.2.x / V1.3.x (injection, output encoding).** The real analogue in a terminal program is
  **escape-sequence injection into the emitted frame.** Measured — see below. **PASS.**
- **V1.3.2 (no `eval` / dynamic code execution).** No `eval`, no `Function`, no `vm` anywhere in the
  pane's closure. **PASS.**
- **V2.1.1 / V2.2.1 (documented input-validation rules; input validated against expected structure
  and logical limits).** This is the one that bites. **See the accepted risk.**
- **V5 (file handling).** Zero in production. The delivered `*.nfr.test.ts` reads `src/` with
  `readdirSync` / `readFileSync`, which is test-only and reads the repository's own source.
  **PASS.**
- **V13 (configuration) / V15 (secure coding and architecture).** `package.json` `dependencies` is
  `{}` — the pane adds no dependency and no supply-chain surface. **PASS.**
- **V14 (data protection).** No personal data, no secrets. A chess move list is the whole payload.
  **PASS.**
- **V16 (logging and error handling).** The pane logs nothing and throws nothing of its own. See the
  reliability observation below — this is worth a sentence, not a control.

## The injection question, MEASURED rather than accepted

The ticket states *"No security trigger. SAN strings are derived from generator-owned `Move`s; no
user-supplied text reaches this pane."* I tested it instead of accepting it. Byte audit over a
rendered pane of a 300-ply deterministic game:

| probe | count |
|---|---|
| `ESC` (`0x1B`) | **0** |
| other C0 control bytes | **0** |
| `DEL` (`0x7F`) | **0** |
| code points above `U+007E` | **0** |
| row count / row widths | **8 rows, all exactly 21 chars** |

**Clean. The claim holds and is now measured.** This matches the standard `ABC-018`'s gate set on
the emitted stream, and it is structurally robust rather than lucky: SAN is generated from the
move generator's own `Move` objects through `src/san.ts`, and the pane's only other content is a
decimal move number and spaces. **The pane takes no glyph mode and emits no escape sequences at
all**, so unlike `src/frame.ts` it has no module-owned escapes to distinguish from supplied ones.

## THE ONE REAL FINDING: `initialFen` IS externally supplied, and it is not range-checked

The ticket's *"no user-supplied text reaches this pane"* is **not quite true**, and the module's own
docblock is more honest than the ticket is. `renderHistory` calls `parseFen(history.initialFen)`,
and **`EPIC-006` owns startup and supplies that anchor** — the ticket's own `## Scope` says so, and
`D5` exists because that path is real. So one externally-supplied string does reach this pane.

**Two consequences, both measured on delivered code.**

**(a) It can break the pane's declared constant width — but the excess is BOUNDED.**
`rowFor` uses `padStart(4)`, which never truncates, so a `fullmoveNumber` above 9,999 widens the
row. Measured with six plies played from a high-fullmove anchor:

| FEN's fullmove digits | `fullmoveNumber` | widest row | vs `HISTORY_COLS` = 21 |
|---|---|---|---|
| 4 (`9999`) | 9999 | 22 | +1 |
| 7 | 1000000 | 24 | +3 |
| 15 | 999999999999999 | **33** | **+12** |
| 300 | 1e+300 | 23 | +2 |
| 5000 | **Infinity** | 25 | +4 |

**The maximum is +19 characters (40 total), and it is a hard bound** — the row width is
`21 − 4 + len(String(n))`, and the longest `String()` a JS double can produce is 23 characters
(`"1.7976931348623157e+308"`). **So this is NOT the unbounded-supplied-string class `ABC-018`'s gate
priced at 14–42 ms.** That distinction is the reason this is an accepted risk and not a required
fix. Note `parseFen` accepts a fullmove number of `Infinity` without complaint.

Blast radius, checked against the ADRs rather than guessed: under `ADR-0010` cl. 2 no panel declares
a frame width and `W` is a per-frame max over delivered rows, so a wide history row **widens the
frame** rather than corrupting it, and `ADR-0010` cl. 1 puts the clearing on the consumer's writer
(which `ABC-027` has now merged, at column 0). The realistic worst case is a frame wider than the
terminal, i.e. wrapping — an `EPIC-006` / `ABC-019` concern, not a corruption.

**(b) Pane compute tracks FEN LENGTH, and can exceed the ticket's own 150 µs pane bar.**
Measured with a discarded warm-up, 11 rounds, rotated order, medians of per-round means:

| anchor | pane compute | of the 150 µs pane bar | of `NFR-002`'s 16 ms frame budget |
|---|---|---|---|
| legal (4 digits) | 13.03 µs | 0.09x | 0.081% |
| 1e3 digits | 14.54 µs | 0.10x | 0.091% |
| 1e4 digits | 26.50 µs | 0.18x | 0.166% |
| 1e5 digits | 141.50 µs | 0.94x | 0.884% |
| **2e5 digits** | **270.45 µs** | **1.80x — OVER the pane bar** | **1.690%** |

**So `A12`'s 150 µs pane bar is bustable by a supplied FEN while `NFR-002`'s 16 ms frame bar stays
met with ~59x of headroom.** The cost is in `parseFen` reading a long digit string, which the pane
pays once per render — it is not the pane's own algorithm degrading. (An earlier run of mine had no
warm-up round and read 50.98 µs on its first cell; that figure is **discarded**, not reported.)

### Disposition: ACCEPTED RISK, with the severity override stated

Under this role's default rule an **L1** input-validation miss (V2.2.1 — *"input is validated …
against an allow list of values, patterns, and ranges"*) is **`high`**, and `security.block_on` is
`high`, so the default would block. **I am overriding that default to an accepted risk, and here is
the stated reason, as the role's hard limits require:**

1. **The gap is in `src/fen.ts`, not in this change.** `parseFen` imposes no upper bound on
   `fullmoveNumber`; `src/history-pane.ts` adds no validation gap of its own. Failing `ABC-017` for
   a pre-existing property of a module it merely calls would be gold-plating, which this role is
   explicitly told not to do.
2. **It is unreachable today.** There is no CLI entry point — `Dev / run` and `E2E` are
   `UNKNOWN - verify` in `AGENTS.md`, `package.json` has no `bin`/`main`/`start`, and nothing
   supplies a FEN from outside the process until `EPIC-006`.
3. **It is already on the record as an accepted limitation**, in the delivered module's own docblock
   (`src/history-pane.ts:53-56`), which names `ABC-010` as the ticket that would impose the bound and
   argues — correctly — that a wrong move number is worse than a wide row.
4. **It is bounded**, as measured above, so the failure mode is a wide/slow frame, not a
   denial-of-service and not memory pressure.

- **Owner: BA/PM at `ABC-010`** (the ticket that owns FEN bounds), with **Architect/Design at
  `EPIC-006`** as the checkpoint if `ABC-010` has not landed by then.
- **Trigger: the first time a FEN reaches the process from outside it** — a load, a resume, or a
  `--fen` flag. `EPIC-006` owns startup and is where that first happens.
- **What the owner is owed, so the ticket has a bar and not a feeling:** the bound is +19 characters
  and the compute crosses the 150 µs pane bar at roughly 1.5e5 FEN digits.

## Reliability and observability — one sentence each, no control proposed

- **No failure mode in this pane has a log**, because this project has no logging anywhere; that is
  a project-wide posture set long before this ticket and I am not proposing a logger for a pure
  function. Recorded because a failure mode with no log is the incident nobody can diagnose later,
  and `EPIC-006` is where that question actually lands.
- **`WFREEZE`'s consumer impact is a genuine reliability shape**, and QE found it: a pane that froze
  the caller's `moves` array would leave `ABC-019`'s loop unable to play another move, failing with
  a `TypeError` from `playMove` and naming the wrong subsystem. The delivered pane does not do this
  — it is a guard gap, not a defect — and it is carried in the verdict note as `G2`.
