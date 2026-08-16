---
task: epic-to-tickets-EPIC-005
subtask: epic-to-tickets-EPIC-005
by: ba-pm
at: 2026-08-16T06:05:00Z
branch: grugops/decompose-epics-2026-08-16
base: main @ a5a4d51
ref: .grugops/context/epic-to-tickets-EPIC-005/
---

# Claim — `epic-to-tickets-EPIC-005`

Claimed by hand per Workflow 17 and `AGENTS.md`'s standing note: `mkdir -p .grugops/queue/claimed`
for the parent, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/epic-to-tickets-EPIC-005/` — that bare `mkdir` is the atomic act and it
succeeded on the first attempt, so the claim is uncontested. Two sibling claims
(`epic-to-tickets-EPIC-004`, `epic-to-tickets-EPIC-006-packaging`) were present alongside mine and
neither was touched.

**`base:` NOT verified, and that is reported rather than smoothed.** The subtask says `main @
a5a4d51`; the tip named in this session's opening state is `5cf86d3`. **I ran no git command (hard
limit), so I cannot say which is current and I did not assume.** Nothing I wrote depends on either
value. Flagged to the Orchestrator.

**No git command was run by this hop** — no `status`, no `diff`, no `log`. Two sibling BA/PM hops
share this working tree and one git index; the Orchestrator commits once.

## Written by this hop — and nothing else

- `plans/tickets/ABC-092-opening-book-source-and-licence-decided-before-a-byte-is-copied.md`
- `plans/tickets/ABC-093-compile-the-opening-book-into-a-static-checked-in-artifact.md`
- `plans/tickets/ABC-094-book-probe-lookup-weighted-choice-and-safe-failure.md`
- `plans/tickets/ABC-095-short-circuit-the-engines-move-choice-with-the-book-and-fall-through-cleanly.md`
- `plans/tickets/ABC-096-show-the-named-opening-when-the-book-knows-it.md`
- `.grugops/context/epic-to-tickets-EPIC-005/notes/` (4 notes)
- this claim record and its queue transition

**NOT written, by hard limit:** `plans/board.md`, `plans/traceability.md` (Orchestrator's — the rows
I want are in my gaps note), `plans/epics/` (the `S`→`M` correction is a note, not an edit),
`plans/nfr-catalog.md`, `AGENTS.md`, anything under `src/`, any test, and **any id at or above
`ABC-097`** — `ABC-097`–`ABC-099` are unused and free, and nothing at or above `ABC-100` was
touched.

## Outcome

**5 tickets, `ABC-092`…`ABC-096`** — `S` / `M` / `M` / `S` / `S`, priorities `P1` / `P1` / `P1` /
`P1` / `P3`. **Epic size corrected `S` → `M`** (note, not edit). **Pullability answered plainly: the
WORK is pullable today — 4 of 5 tickets need nothing from `EPIC-004` — but the VALUE is not, because
`ABC-095` is hard-blocked on a move interface that does not exist.** 13 gaps `G1`–`G13` recorded
with severity and owner.

**Stop conditions:** `XL` did **not** fire (largest is `M`; no `SPLIT_REQUIRED`). The
source/licence stop condition **DID** fire — `ABC-092` shapes the decision and **names no candidate
source anywhere**, deliberately. The engine-design stop condition **fired twice** (where the
short-circuit lives; who owns the seeded-randomness seam) — both named, neither resolved.
**No `EPIC-004` ticket id appears anywhere in my output.**
