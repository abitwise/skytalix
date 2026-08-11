---
id: 20260812T031000Z-security-nfr-claim-b6d40e59
kind: claim
by: security-nfr
at: 2026-08-12T03:10:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-016
  - A12
  - A13
  - D27
  - NFR-008
supersedes:
---

# FOUR accepted risks, each with a NAMED OWNER and TRIGGER — and the `D27` ruling, which enlarges the item rather than closing it

> **Hand-authored.** A `claim` and not an `observation`, and the split is the one QE, BA/PM and the
> Engineer each drew on this ticket: **the measurements underneath are not in doubt** — they are in
> this hop's `observation` note and every one was run — but *"this is a risk worth accepting rather
> than fixing"* is a judgement, and severity/disposition is not gate-adjudicable.
> `confidence: UNKNOWN - verify` is on the **dispositions**, not on the readings.

**None of the four is `high`. `security.block_on` is `high`, so none blocks.** My role's rule is that
an accepted risk without a named owner is a finding nobody fixes — so every one below has an owner
and a trigger, including the one that arrived here explicitly **unowned**.

---

## R1 — `D27`'s comment repair. **UPHELD as non-blocking, but the item is BIGGER than recorded: three sites, not one.** Severity: LOW.

**BA/PM's disposition is upheld: this does NOT return `ABC-016` to `In Development`.** The dissent in
BA/PM's own `claim` note — that the delete-risk warrants sending it back now — is engaged rather
than ignored, and it is **weaker now, not stronger**: `ABC-027` took this project's first FAIL two
hours ago (`9fb55db`), so `ABC-016` is the only unblocked forward motion among the four, and the cost
of a dev hop plus re-gate here has gone up while the comment's every-sentence-is-true status has not
changed.

**But the item as recorded is incomplete, and I found that by grep rather than by argument.** `D27`
names one site — `src/status-panel.nfr.test.ts:241-253` — and rules that *"every factual sentence in
it stays true."* That ruling is correct **about that block**. The retired *"ply-independent"*
vocabulary lives at **three** sites:

| site | what it says | status |
|---|---|---|
| `:76` | *"…what lets the scan clause be stated ply-independently instead of as a second magic number"* | retired vocabulary; **not named by `D27`** |
| **`:203`** | ***"The scan clause is stated PLY-INDEPENDENTLY: one render's `squareAt` count is 64 plus the occupied squares of `history.initialFen`."*** | **restates as the criterion the exact sentence `A13` STRUCK as false at ply 0**; **not named by `D27`** |
| `:242` | *"…deliberately NOT the ply-independent formula above"* | the only site `D27` names — and its *"formula above"* is a live pointer at `:203` |

**`:203` is the one that matters.** It does not merely use retired vocabulary; **as an unqualified
statement of what the criterion says, it is false at ply 0** — measured, `64` and not `64 + occupied`
on both anchors. It is the same defect `A13`'s own `D27` correction exists to fix, sitting one file
over, in the file that becomes three other tickets' reference pattern.

**This is BA/PM's named pattern at the next level down: a repair audited on the site it names and not
on the site it points at.** I record it at its true size and no larger — **it costs zero coverage**
(the assertions are correct and green, 711/711), it is comment text only, and `A13` now names the
ply-0 assertion as *required*, which is the first line of defence. It is a documentation defect with
a real delete-risk, not a hole in the net.

- **Owner: BA/PM** — the vocabulary, its retirement and the criterion text are all BA/PM's, and
  `D27` is BA/PM's own carried item. **BA/PM may not write `src/`, so the Engineer applies the
  wording BA/PM rules.**
- **Trigger: the next dev hop that opens `src/status-panel.nfr.test.ts` for ANY other reason —
  and at the latest BEFORE `ABC-019` writes its own call-count criteria**, since `ABC-019` is
  explicitly meant to use this file as the pattern and would copy the retired vocabulary forward.
- **If neither trigger fires before merge, it merges as-is and that is an accepted cost, recorded
  rather than hidden** — the same disposition BA/PM took, now with the site list corrected and an
  owner attached.

## R2 — `A12` cannot fail on a terminal escape. Severity: LOW. **Not a required fix, and deliberately not a new criterion.**

`A12` pins *"code points above `U+007F` … exactly 0"*. **`ESC` is `0x1B`, below `U+007F`**, so a
panel that emitted an ANSI escape would pass `A12` — measured, not reasoned: my type-violation render
`"White to move  [2J1."` has `aboveU+007F` = 0.

**I am NOT asking for a criterion, and the reason is the ticket's own standard.** Applying `D17`'s
test — *does the criterion claim a protection it cannot deliver?* — **`A12` does not**: its wording
is exact and it delivers exactly what it says. The escape class is covered **at the frame level**,
where the ticket deliberately put it: `src/frame.ts:174` sanitizes the **panel's** rows (not only the
message region — read at source, this is the load-bearing fact) and `:105` drops C0 and `U+007F`
**unconditionally in both glyph modes**. The two controls are complementary and together cover the
space. Adding a panel-level control-character criterion would duplicate `ABC-018` and is the
gold-plating my role is told not to do.

- **Owner: `ABC-018` / `assembleFrame`** for the control itself, which is in place and correct.
- **Trigger: if any future change makes the panel's rows reach a terminal WITHOUT passing through
  `assembleFrame`** — then the panel needs its own control-character assertion, because `A12` will
  not catch it. `ABC-019` composes the first real frame and is where that would show up.

## R3 — a runtime `Position` type-contract violation is emitted verbatim. Severity: LOW. **Unreachable today.**

`${position.fullmoveNumber}` calls `toString()` on whatever is in that field. Measured: a string or
an object with a hostile `toString` is emitted **verbatim into row 1**, `ESC` included. TypeScript
prevents this at compile time; **nothing validates it at runtime.**

**It is unreachable in production and I am not asking for a guard** — every `Position` comes from
`parseFen` (which I proved validates both the placement and the fullmove fields by rejecting three
escape-carrying FENs) and is mutated by `makeMove` (integer arithmetic). There is no deserialization
boundary, no IPC and no `JSON.parse` into a `Position` anywhere in `src/`. Adding a runtime check for
a case that cannot occur is `AGENTS.md` rule 8 exactly.

- **Owner: Architect/Design**, as a boundary question rather than a panel one.
- **Trigger: the first code that constructs a `Position` from data that did NOT come through
  `parseFen`** — a saved-game load, a JSON fixture, a wire format. `EPIC-006` is the plausible
  moment. Until then this is a note, not a risk.

## R4 — the lane bar is met, but multi-agent concurrency is an unpriced input to it. Severity: LOW.

`NFR-008` is **MET with wide margin** on the instrument the row names (0.53x wall, 0.59x CPU — see
the `observation` note). **But my out-of-tree runs, taken while three agent worktrees were active on
this machine, read individual wall times up to 3.26 s — over the 3 s clause** — and my first N8-LANE
sample's identity null control came in at **−1.77%, outside the bar's own ≤ 1.5% admissibility
floor**, which is a load artefact and is reported rather than smoothed.

The row already carries the thermal fence (*"absolutes drift ~20% … ratios replicate and absolutes do
not"*). **What it does not carry is that this project now runs several agents concurrently on one
8-core machine, which is a lane-cost input nobody has priced.** The median-based bar absorbs it
today. It is worth naming before the lane's margin narrows.

- **Owner: Architect/Design** (owner of `NFR-008`'s floor account and of the lane's structure).
- **Trigger: the next `NFR-008` re-measurement, or the first hop whose lane median crosses 2 s wall.**
- **Not blocking, and explicitly NOT a request to move the bar** — the row says a gate does not move
  this bar, and this gate does not.

---

# The two judgements a gate genuinely cannot adjudicate, stated as such

**1. That `PASS_WITH_RISKS` is the right verdict rather than `PASS`.** Nothing I measured failed. All
four risks above are LOW, none blocks, and a defensible reader would call this a clean `PASS` and put
the four in the notes as observations. **I chose `PASS_WITH_RISKS` because `R1` grew under
measurement** — an item recorded as one site is three, and one of them states a struck formula as the
criterion — and because this ticket's whole record is that a `PASS` on this board has repeatedly been
a criterion nobody re-derived. **A reader who weights "nothing failed" above "one carried item got
bigger" lands on `PASS`, and I would not re-argue it.** The measured facts are identical either way.

**2. That `R1` does not warrant a backward move.** Stated at its true size in `R1` above, with
BA/PM's dissent engaged. **If the Orchestrator weighs the `ABC-019`-copies-the-pattern risk higher
than the merge-order cost, sending it back is legitimate and I would not re-argue that either.** It
is the single place in this hop where a defensible person lands elsewhere.

# What is NOT in doubt, so the boundary is clear

Everything in the `observation` note: the two independent `A14` samples and their agreement with two
prior hops to within 1.7%; the 21 regimes at which `A13`'s repaired scan clause holds; the structural
enumeration of `squareAt`'s production callers and `grep -c squareAt src/apply.ts` = 0; the four
zero-counts and both `isInCheck` halves; the two lane samples with their per-run count controls and
the `cmp`-verified identity null; the zero production runtime importers of `src/history.ts`; and the
escape probe's five vectors. **Those were run.** That `A12` is asserted on the panel's own rows and
that `assembleFrame` sanitizes panel rows are **source reads, not judgements**.
