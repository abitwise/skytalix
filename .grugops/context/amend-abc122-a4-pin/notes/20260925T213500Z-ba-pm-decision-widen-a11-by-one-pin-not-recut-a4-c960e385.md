---
id: 20260925T213500Z-ba-pm-decision-widen-a11-by-one-pin-not-recut-a4-c960e385
kind: decision
by: ba-pm
at: 2026-09-25T21:35:00Z
verified_by:
confidence: high
refs:
  - ABC-122
  - ABC-042
  - amend-abc122-a4-pin
  - ticket-to-pr-ABC-122
  - src/cli.test.ts
  - package.json
  - plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md
supersedes:
---

# Ruling on the `ABC-122` `A4` stop: widen `A11` by exactly one pin; do not re-cut `A4`

Hand-authored and unsealed (`scripts/context-io.ts` / `mcp__grugops__propose_note` absent from
this install; `context.human_admission` is `off` — per `AGENTS.md`'s no-`finding` note). Recorded
as a `decision`: BA/PM's scope call, not a verified/gate-adjudicated result.

## The stop, read

The Engineer's build hop (`ticket-to-pr-ABC-122`, claim `7883fd4a`) measured `A4`'s required
`package.json` edit (`"test": "node tools/grugops/run-bounded.js 60000 vitest run"`) against
`A11`'s fence and found it reds `src/cli.test.ts:1661`'s `SCRIPTS_AT_HEAD.test` pin (`ABC-042`
`A10`: `package.json` gains exactly the documented scripts, nothing else). A two-line patch
(the `package.json` line plus the matching `src/cli.test.ts:1661` literal) was measured with
both applied — `npm test` gave exit 0, 47 files, 1446 tests; with the root depth guard reverted,
exit 124 at 60.23 s — then reverted, uncommitted. The Engineer named two options and a
non-recommendation; the Orchestrator recommended widening `A11`.

## Ruling

**Widen `A11` by exactly that one pin.** `A11`'s fence text on
`plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md` now names
`src/cli.test.ts:1661`'s `SCRIPTS_AT_HEAD.test` value as an explicitly permitted, single-line
change under `git diff --numstat <base>...HEAD -- src/`. `A4`'s text now states the same
literal string is mirrored into that pin in the same commit. Both edits are on the ticket page,
verbatim, not restated a third time here.

**Re-cutting `A4` is ruled out, explicitly.** It would leave K4 open — `ABC-081`'s own gate
gap ("the gate can hang instead of failing red") is this ticket's reason to exist — over a
one-line pin-widening decision, when a working, measured-green fix already exists (the
two-line patch above). No open design question remains: the wired string (`60000`, justified
as 8.1× the measured 7.45 s median lane wall, within the `A4` formula's `5×`–`120000` band),
the bound, and the fix are all already on the delivering page.

## The choice within the ruling: literal string, not a pattern/range pin

Two shapes were weighed, per the queue task's own framing:

1. **The whole wrapped string, literally** (`"node tools/grugops/run-bounded.js 60000 vitest
   run"`) — chosen.
2. **The wrapped command plus the bound, checked separately** (e.g., a regex for the command
   shape and a numeric assertion that `N` satisfies `A4`'s formula) — rejected.

**Why (1):** `SCRIPTS_AT_HEAD` (`src/cli.test.ts:1659–1669`) pins every one of `package.json`'s
nine `scripts` keys to a literal value inside one `toEqual`. `A10`'s stated purpose — the
committed script is what the pin says it is — is an exact-match discipline applied uniformly.
Shape (2) would special-case exactly one of nine keys to a different comparison kind: a
single-use abstraction built for one row (Karpathy rule 6, "no single-use abstractions"; rule
7, "no unrequested flexibility" — nothing in `A4`/`A10`/`A11` asked for a range-checked pin).
It would also let a future re-tuning of `N` pass silently as long as it stayed inside the `A4`
formula's band, without updating the pin — weakening the exact-match guard `A10` exists to be.
The literal string costs the identical one-line edit either way; it does not cost re-deriving
`A4`'s bound formula, which is untouched and stays the authority for what `N` must satisfy at
delivery. Only the *value* the pin asserts changes, from `"vitest run"` to the delivered wrapped
command — the same discipline as every other `SCRIPTS_AT_HEAD` row, and the same discipline the
row already had.

## Also recorded (facts owed onward, not scope changes)

- **The `*_DEEP` lanes must not run through `npm test`/the wrapper.** `ENGINE_DEEP` alone
  measures ≈ 98.7 s (`AGENTS.md`), over the wrapper's 60 000 ms `A4` bound; they run via
  `npx vitest run <file>` directly with their env var. Owed to the Scribe's `Test (all)`
  follow-up (already named on the ticket page).
- **`tools/grugops/lane-inventory.js` exits 1** on a tracked file,
  `.grugops/context/ruling-abc079-oracle/probe/vt/oracle.test.ts` (present since `b324cb6`,
  pre-existing at this ticket's base, before the Engineer's build hop). Not `ABC-122`'s; named
  for QE's hop so it is not misattributed.

## Definition of Ready — re-checked against the amendment

Unaffected: this is a scope-preserving fence widening (one existing pin's literal value),
not a new acceptance criterion, a re-size, or a re-priority. `plans/tickets/ABC-122-…md`'s
existing `## Definition of Ready` table (9/10, ⚠️ on item 10, non-blocking, assessed
2026-09-25 at the cut) stands unchanged; item 10's ⚠️ (the `A4` formula, not a fixed constant
at cut time) is now answered by the build hop's own delivered reading (`N = 60000`, 8.1×) and
by this ruling, not reopened by it.

## What this ruling does not do

It does not touch `src/`, `package.json`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`,
or any ADR (this hop's own fence). It does not commit the two-line patch — that is the next
Engineer hop's to apply and measure fresh, now inside the widened fence. It does not move the
board column (Orchestrator's).
