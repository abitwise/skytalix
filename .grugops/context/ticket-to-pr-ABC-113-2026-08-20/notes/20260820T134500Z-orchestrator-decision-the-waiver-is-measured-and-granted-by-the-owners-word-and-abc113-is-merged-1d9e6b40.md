---
id: 20260820T134500Z-orchestrator-decision-the-waiver-is-measured-and-granted-by-the-owners-word-and-abc113-is-merged-1d9e6b40
kind: decision
by: orchestrator
role: orchestrator
task: ticket-to-pr-ABC-113-2026-08-20
at: 2026-08-20T13:45:00Z
verified_by:
confidence: high
refs:
  - ABC-113
  - EPIC-006
  - AGENTS.md#branching-model
  - AGENTS.md#test-and-uat-authority
supersedes:
---

# The waiver is MEASURED and the owner's word GRANTED it. `ABC-113` is merged to `main`

## What the owner said, and what it authorizes

Asked whether to waive `ABC-113` to `Done` on the zero-production-lines rule given that the branch
also carries two files he authored himself, he answered: **"waive it to Done and merge"**.

Merging gated work to `main` is authorized **standing** (2026-08-06, made per-ticket 2026-08-15) —
`AGENTS.md` § `Branching model`, one of this project's three documented kit overrides. The kit role
line *"never merge to a protected branch"* is overridden HERE and nowhere else. **The limit that
survives is the one that matters: it is approval to merge work that PASSED, never to skip or soften a
gate.** Gates were run on the branch tip before and on `main` after, and both are recorded below.

## The waiver, MEASURED — and measured with the instrument I pre-registered at the pull

At the pull I pre-registered that this ticket's waiver would be measured over the WHOLE BRANCH and
**never** over `<tip>~1`, because `ABC-113` is the first genuinely zero-production-line ticket since
that rule defect was found. Honoured:

- **The pre-registered instrument** — `git diff --name-only main...HEAD -- src/` → exactly
  `src/cli.test.ts` and `src/result-screen.test.ts`. Under `':!src/*.test.ts'` → **EMPTY**.
  **Zero production lines. The waiver is available.**
- **The defective instrument, run only for contrast** — `HEAD~1..HEAD` is also empty, **but it would
  be empty on ANY branch whose tip is a docs commit**, which is exactly the defect. It did not decide
  anything here. *The rule defect remains OPEN and unruled; this is the second ticket fenced by hand
  rather than by a repaired rule.*

**A waiver is not a signature.** Per `AGENTS.md`, `Done` under this rule means **merged and gated**,
never *accepted by a human*. **NO UAT WAS CONDUCTED on `ABC-113` and no scenario carries a human
acceptance.** The owner's word here GRANTED the waiver; it did not sign a UAT, because there was none
to sign.

## Disclosed before the waiver was applied, not after

The branch carries **`biome.json` and `vitest.config.ts`** (`2bef492`) — **two files that are not this
ticket's**, committed by the owner mid-hop. They are outside `src/`, so the `src/`-scoped waiver
instrument correctly does not see them, and `A3` still passes. **This was put to him in those words
before he answered, so the waiver is INFORMED rather than assumed** — he authored those two files
himself and merged them knowingly.

What they buy, measured at this hop: the **default lane now equals the contained lane** (`npx vitest
run` with no `--dir` → 40 files / 1207 tests / 0 skipped), and **`npm run lint` exits 0** over 72
files. Two defects that four hops worked around by hand are retired by the owner's own commit.

## Gates

**Branch tip `e3a71df`, before merge:** lint `npm run lint` — **0**, 72 files (the REAL gate command,
not the `src/`-scoped substitute — its historical red is gone). typecheck **0**. build **0**. unit
`npx vitest run` — **40 files / 1207 tests / 0 skipped**, green.

**Skip integrity: `UNKNOWN — verify`, recorded honestly.** `tools/grugops/test-skip-integrity.js`
requires a registry file and `.grugops/test-skips.md` does not exist. The measured skip count is **0**
by direct observation. **No agent authored that registry** — an agent writing its own justification to
clear its own gate is what that rule forbids.

**No `§14-gate#<id>` stamp and no `finding` is claimed.** This install has no `scripts/context-io.ts`
and no stamp issuer; a green verdict no issuer minted would be a faked stamp.

## What `Done` here does NOT close

- **`D4` — the third blind spot QE found — is OPEN and UNCUT.** `for (const history of [spare])`
  binds the name with neither `:` nor `=`, typechecks clean, and is 1207/1207 GREEN on both
  instruments. `A1` closes the annotated-rebind SPELLING, not the class. Merging `ABC-113` does not
  close it and must not be read as having closed it.
- **Two false sentences inside this ticket's own delivered comments**, named by QE, corrections
  deliberately NOT authored by the adjudicator. Uncut.
- **The `A1` comment overstates `M9`** (already killed on `main`), and **the `A2` comment UNDERSELLS
  itself** — QE constructed the mutant the page called unconstructible, so `A2` has an exclusive kill.
- **Nine off-shape rows in `plans/traceability.md`** — unowned, untouched.
- **The UAT-waiver rule defect itself** — still OPEN, fenced by hand for the second time.
- **`ABC-043` is untouched and stays `In Review`.**
