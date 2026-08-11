---
id: 20260812T174500Z-ba-pm-observation-ar1-abc010-measured-2b93f0c7
kind: observation
by: ba-pm
at: 2026-08-12T17:45:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-cut
  - ABC-017
  - ABC-010
  - EPIC-003
  - EPIC-006
  - NFR-002
  - plans/tickets/ABC-010-fen-semantic-validation.md
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - src/fen.ts
  - src/history-pane.ts
  - 20260812T125500Z-security-nfr-observation-security-surface-3e70a1c4
  - 20260812T130500Z-security-nfr-decision-verdict-and-risks-9a4e28f1
supersedes:
---

# `AR-1` re-derived against `ABC-010`'s ACTUAL TEXT: the COMPUTE half is the one it closes, and the WIDTH half — the half everybody assumed it owned — is the one it does not

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp. The brief said *"the Orchestrator admits reading `ABC-010` quickly — check
> it"*, so `ABC-010` was read in full and its rule was **executed** rather than paraphrased.

## The question

Security/NFR homed `AR-1` — the supplied-FEN width and compute path — to **`ABC-010`**. The brief
doubted the compute half: *"the gate's finding was pane COMPUTE — 270.45 µs at 2e5 digits, 1.80x the
pane bar — which is not a validation question. Rule whether `ABC-010` truly receives it or whether the
compute half needs its own home."*

## The ruling, up front

> **`ABC-010` receives the COMPUTE half in full. It does NOT receive the WIDTH half.**
> **That is the exact inverse of the brief's expectation, and of what `ABC-017`'s own `## Out of
> scope` claims.**

## What `ABC-010` actually says about clock fields — it is a ROUND-TRIP rule, not a RANGE rule

`ABC-010` `## Scope`: *"**Clock fields that do not survive their own round trip** — the parser accepts
a halfmove or fullmove value only if it is a **finite integer whose serialization is byte-identical to
the input field**. `Infinity` and `1e+21` must never reach a `Position` or leave `toFen`."*

**There is no upper bound on `fullmoveNumber` anywhere in that ticket** — not in `## Scope`, not in
its eleven acceptance criteria, not in `## Out of scope`. The bound at 9,999 that `ABC-017`'s
`## Out of scope` attributes to it (*"`ABC-010` … is the ticket that would bound it"*) **is not in
`ABC-010`.**

## The compute half — CLOSED, and the mechanism is unreachability rather than speed

Every FEN in Security/NFR's compute table has a fullmove field of 1e3, 1e4, 1e5 or 2e5 **digits**.
Executed here:

| input | `Number()` | `ABC-010` admits it? |
|---|---|---|
| 400 nines (`ABC-010`'s own halfmove case) | `Infinity` | **NO** |
| 1e3 / 1e4 / 1e5 / 2e5 digits | `Infinity` | **NO** |
| `1000000000000000000000` (`ABC-010`'s own fullmove case) | `1e21` → `String` is `"1e+21"` | **NO** — not byte-identical |

So after `ABC-010`, `parseFen` throws before returning a `Position`, `newGame(fen)` throws at
construction, **no such `GameHistory` can exist, and the pane never renders one.** The 270.45 µs is
not made faster — it is made **unreachable**, which is the stronger outcome.

**And the residual compute after `ABC-010` is trivial**, which is the part that makes this a genuine
closure rather than a technicality: the longest field `ABC-010` still admits is **21 characters**, and
Security/NFR measured a **1e3-digit** field at 14.54 µs (0.10x the 150 µs pane bar) — so a 21-digit
one sits at the 13.03 µs baseline. **The pane bar cannot be bust by a supplied FEN once `ABC-010`
lands.**

**Conclusion: the compute half needs no separate home.** The brief's instinct that *"it is not a
validation question"* is right about the *nature* of the finding and wrong about the *remedy* —
validation does not make the parse cheap, it makes the input impossible, and that is sufficient.

## The width half — NOT CLOSED, and the numbers are small enough to be embarrassing

`ABC-010`'s round-trip rule kills the exponential cases and admits everything below `1e21`.
**Measured, executing `ABC-010`'s own rule** (`Number.isFinite(n) && Number.isInteger(n) && String(n)
=== s`) and applying the pane's row-width arithmetic `21 − 4 + len(String(n))`:

| fullmove field | `ABC-010` admits it? | pane row width | over `HISTORY_COLS` = 21 |
|---|---|---|---|
| `9999` | **YES** | 21 | +0 |
| `1000000` (7 digits) | **YES** | 24 | **+3** |
| `999999999999999` (15 digits) | **YES** | 32 | **+11** |
| `999999999999999900000` (21 digits — the longest admissible, searched not assumed) | **YES** | **38** | **+17** |

**So `ABC-010` as written moves the pane's worst case from 40 characters (+19) to 38 (+17). It does
not restore the 21-character promise `A2` makes — it barely moves it.**

*(Security/NFR's table reads one character wider than the anchor arithmetic at two rows — 22 at
4 digits, 33 at 15 — and that is **correct and mine is not a correction**: it played six plies from
each anchor, so the rendered window contains a move number that has **incremented** past a digit
boundary. Both figures are right and they are measuring slightly different things; the +19 bound is
Security/NFR's and it is confirmed below.)*

**Security/NFR's +19 is reachable under the REAL grammar, checked rather than assumed.**
`parseClock` applies `/^\d+$/` (`src/fen.ts:132`, `:178-179`), so an exponential-form field cannot be
supplied directly — which raised the question of whether a 23-character `String()` is reachable at
all. It is: a **309-digit** pure-digit field passes the grammar, `Number()`s to a finite
`1.7976931348623157e+308`, and `String()` returns **23 characters** → row width **40 (+19)**. **The
gate's bound is exact**, and `ABC-010` rejects that case.

## What `ABC-010` needs, specified so nobody re-derives it — and it is NOT applied here

**One scope bullet and one acceptance criterion.** Intended content, stated rather than written into
the ticket:

- **Scope bullet:** a `fullmoveNumber` (and `halfmoveClock`) outside a stated **range** is rejected,
  not merely one that fails its round trip — with the range chosen by whoever writes it and a stated
  reason. **The consumer's number, offered as an input and not as a decision:** every consumer of a
  move number in this project renders it into a fixed-width cell, and `ABC-017`'s is **4 digits**.
- **Acceptance criterion:** an exact FEN at the chosen bound + 1 throws a `FenError` naming the
  field, in `ABC-010`'s existing table-test shape.

**Owner: BA/PM, at `ABC-010`'s own promotion hop.** `ABC-010` has **never been promoted** — it sits
in `Backlog` and its DoR block self-assesses **all ten ✅**, which is now incomplete: item 2
(scope/out-of-scope) and item 4 (acceptance) both miss the range rule, and the ticket its own
`## Out of scope` is cited by (`ABC-017`) asserts a bound it does not deliver.
**Trigger: `EPIC-003`'s decomposition or `ABC-010`'s promotion, whichever comes first — and at the
latest before `EPIC-006` supplies a FEN from outside the process**, which is `AR-1`'s original trigger
and is unchanged.

**Why I did not apply it at this hop.** `ABC-010` is `P1`, size `M`, in `EPIC-003` — a different epic
— and a range rule changes its size calculus and its DoR. Amending it as a side effect of an
`ABC-017` cleanup hop is precisely the *"an edit applied at one site while the ticket asserts the same
thing at two others"* failure this board has recorded twice. **It is a ruling with an owner, not this
hop's write.**

## What is NOT owed, so the list does not regrow

- **No new ticket for `AR-1`.** Neither half needs one: the compute half is closed by `ABC-010`, and
  the width half is one bullet on the ticket that already owns FEN bounds.
- **No criterion on `ABC-028` or `ABC-029`.** The gap is in `src/fen.ts`, pre-exists `ABC-017`, and
  the pane adds no validation gap of its own — Security/NFR's four reasons for accepting it all still
  hold and none is re-litigated here.
- **No change to any bar.** `NFR-002`'s `< 16 ms` frame target, the 150 µs pane bar and the 3x ratio
  are untouched. `plans/nfr-catalog.md` was **not** edited.
- **The blast radius is unchanged and is somebody else's**: under `ADR-0010` cl. 2 a wide history row
  **widens the frame** rather than corrupting it, so the realistic worst case is a frame wider than
  the terminal — an `EPIC-006` / `ABC-019` concern, exactly as Security/NFR wrote. **I am not cutting
  a "frame fits the terminal" requirement**; `ADR-0010` cl. 7 gives `ABC-019` exactly one width
  criterion and it is not that one, and inventing a new NFR at a cutting hop is the defect that
  produced `ABC-026`.

## Method, so the numbers are attributable

`ABC-010`'s admission rule was **executed** as JavaScript against candidate fields, and the longest
admissible string was **searched** over digit lengths 1…24 rather than reasoned about. The pane's row
arithmetic is `HISTORY_COLS − padStart(4) + len(String(n))`, taken from Security/NFR's own derivation
and re-applied here. **No mutant was built, nothing was written under `src/`, and the delivered pane
was imported read-only.** Machine: the same Apple M3 / Node v24.12.0 tree the prior gates used; **none
of the figures in this note is a timing figure**, so hardware does not qualify them.
