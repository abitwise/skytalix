---
id: 20260818T191500Z-security-nfr-decision-nfr-004-ruled-clause-a-is-an-accepted-risk-and-the-ceiling-is-owed-here-b2c3d4e5
kind: decision
by: security-nfr
at: 2026-08-18T19:15:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - NFR-004
  - EPIC-006
  - ABC-087
  - src/engine.ts
supersedes:
---

# `NFR-004` RULED, both clauses. Clause A (≤ 3 s) is an **ACCEPTED RISK** with a named owner and a
discharge route. Clause B (5 s hard ceiling) is **BREACHED and the enforcement is owed BY THIS
TICKET** — one line of production code, stated precisely enough to route

**This is not a stamp.** No `finding` is admissible on this install; this is a hand-authored
`decision`. It carries no `§14-gate#<id>`.

**Nobody had ruled this.** The engineer measured and routed it; QE measured it harder and wrote *"I
do NOT rule `NFR-004`"*. Both refusals were correct — the bar is this role's. **This note rules
it.** No target, level or bar is moved anywhere: `NFR-004`'s row still says ≤ 3 s at default
difficulty and a 5 s hard ceiling at any difficulty, byte for byte.

---

## Clause A — ≤ 3 s at default difficulty: **NOT MET, and ACCEPTED AS A RISK**

**The number.** Worst case across three independent hops: **3 027 / 3 030 / 3 031 ms**, on three
DIFFERENT positions, 27–29 of 30 calls over 3 000 ms. **Worst overshoot ever measured: 31 ms =
1.03% of the budget.** Median overshoot 2–3 ms over 450 samples (QE). Apple M3 (Mac15,13);
`UNKNOWN - verify` elsewhere.

**Why it is accepted rather than fixed — four reasons, and the fourth is the one that decides it.**

1. **The cause is known, bounded and structural, not a defect.** Iterative deepening spends its
   budget by construction: the final iteration is aborted AT the deadline, and what remains is the
   abort granularity. QE proved the attribution properly — median inter-check gap scales linearly
   with `NODES_PER_CLOCK_CHECK` across a 64x range on all six positions, and
   `max(gap) >= overshoot` in 24 of 24 runs. **There is no hidden second cause and this gate went
   looking for one.**
2. **Both in-module remedies are worse than the overshoot.** Aiming at `deadline − margin` makes
   the sentence true by silently redefining what `budgetMs` means, on the module whose entire
   subject is that the budget is honest — an unrequested behaviour change (coding rules 5 and 7).
   Cutting `NODES_PER_CLOCK_CHECK` to 256 **does not work for this purpose**: QE measured a 256-node
   interval taking 105 ms of wall clock, so the constant cuts the median ~4x and leaves the tail
   where it is. **A remedy that does not move the quantity the clause is missed on is not a remedy.**
3. **Materiality is negligible and nothing downstream reads this clause.** It is the latency of one
   move in a local CLI chess game. 30 ms is below human perception, there is no timeout, retry,
   SLA or contract anywhere in the tree denominated in `NFR-004`, and **live exposure today is nil**
   — `src/turn-loop.ts` is byte-identical and nothing in the shipped tree constructs an engine.
4. **The clause is dischargeable for free by the party that already owns the choosing.** A caller
   passing **2 900 ms** puts all 30 measured calls under 3 s with ~70 ms to spare and changes no
   line of this module. That is `EPIC-006`'s budget choice, which is `## Out of scope` here by the
   ticket's own words — and unlike clause B (below), **clause A really is a statement about the
   budget a caller CHOOSES.** "≤ 3 s **at default difficulty**" is a claim about the default, and
   the default is chosen elsewhere.

**Recorded as an accepted risk, with the owner and trigger the role's hard limits require:**

> **ACCEPTED RISK `AR-NFR004-A`.** `NFR-004`'s ≤ 3 s clause is missed by ≤ 31 ms (≤ 1.03%) on
> 27–29 of 30 benchmark calls at `budgetMs = 3000`, by the abort granularity. Accepted for
> `ABC-078` as delivered.
> **Owner: Security/NFR, at `EPIC-006`'s difficulty hop** (`ABC-087` if it lands first).
> **Discharge:** the owner of that hop either passes ~2 900 ms and the clause becomes literally
> true at zero cost, or re-accepts this risk in writing with its number. **It may not be discharged
> by editing the row.**

**What this acceptance is NOT.** It is not a licence for the next hop's overshoot. It is
denominated in a measured 1.03% on named positions on one machine; **a later reading that shows
materially more than that is a NEW question and not covered here**, and `ABC-074`'s off-M3
measurement is still owed.

---

## Clause B — 5 s hard ceiling at any difficulty: **BREACHED**, and the enforcement is **OWED HERE**

**The measurement, mine, independent of QE's:** `budgetMs = 5000` → **5 002 ms**;
`budgetMs = 6000` → **6 004 ms**. `chooseMove` computes `deadline = start + options.budgetMs` and
**contains no reference to 5 000 of any kind**. Elapsed tracks the budget upward without limit.

### The ruling: the clamp belongs to `ABC-078`, not to `EPIC-006`. Four reasons, in order of weight

1. **THE TICKET'S OWN `## Scope` CLAIMS IT.** Line 46: *"The default budget: **3 s**, hard ceiling
   **5 s** (`NFR-004`)."* That is in `## Scope`, not in `## Out of scope`. **The counter-argument
   quotes the wrong section.** `## Out of scope` defers *"difficulty selection — a flag, a prompt,
   or how a chosen level persists across a session"* and then says, in the same breath, **"It owns
   the mechanism; `EPIC-006` owns the choosing."** A ceiling is not a selection. It is the bound
   inside which every selection must land — a property of the mechanism, and the mechanism is
   this ticket's by the ticket's own boundary.
2. **"AT ANY DIFFICULTY" IS PRECISELY THE PHRASE THAT PUTS IT BEYOND THE CALLER.** `NFR-004` reads
   *"hard ceiling 5 s **at any difficulty**"*. A ceiling that holds only when the caller chooses
   well is not a ceiling on the engine; it is a second requirement on the caller that nobody has
   written down. **The Orchestrator's framing is right and I adopt it: a bar nobody enforces is not
   a bar.** Clause A survives being a statement about a chosen default because it says *"at default
   difficulty"*. Clause B cannot, because it says the opposite.
3. **`EPIC-006` CANNOT HONOUR A CONSTRAINT NOTHING RECORDS.** There is today **no test, no type, no
   constant, no comment and no ticket line** anywhere in the tree that says a budget above ~4.99 s
   breaches a merged NFR. `EPIC-006` will pick difficulty budgets against a module that accepts any
   `number` and documents no range. **Deferring enforcement to a hop that has not been told the
   constraint exists is not deferral; it is loss.**
4. **THE COST OF ENFORCING IT HERE IS ONE LINE.** A ruling that "this belongs to the other ticket"
   would be easier to defend if honouring it here were expensive. It is not: see the fix below. It
   also **closes the only genuinely unbounded path in the module for free** (`budgetMs: Infinity`
   becomes a 5 s search).

**What I am NOT ruling.** I am not requiring validation, rejection or a throw. I am not requiring
the module to police anything else about its inputs. And **this does not re-open the engineer's
judgement** — the engineer named the gap, named the argument on both sides and routed it to this
gate, which is exactly right. The routing was correct; the destination is that the clamp lands
here.

### THE REQUIRED FIX, stated precisely enough to route as one repair hop

**Severity: MEDIUM.** `security.block_on` is `high`, so **this does not block the gate** — but it
is a required fix, not an accepted risk, and it must not be closed by anything less than the change
below. Rationale for MEDIUM rather than HIGH: **live exposure today is nil** (nothing constructs an
engine, `src/turn-loop.ts` is byte-identical, the only budget any caller passes is 3 000), so this
is a latent breach of a merged bar rather than a live defect.

**In `src/engine.ts`, and nowhere else:**

1. **Add one exported constant**, beside `DEFAULT_BUDGET_MS`:

   ```ts
   /**
    * `NFR-004`'s hard ceiling, in milliseconds. A bound on the MECHANISM, not a difficulty:
    * `NFR-004` says the ceiling holds AT ANY DIFFICULTY, so it is honoured here whatever a
    * caller passes. `EPIC-006` chooses a budget; it does not choose the ceiling.
    */
   export const HARD_CEILING_MS = 5_000;
   ```

2. **Change one line** in `chooseMove`'s `budget` initialiser:

   ```ts
   deadline: start + Math.min(options.budgetMs, HARD_CEILING_MS),
   ```

   **Every degenerate input QE and this gate measured is preserved by `Math.min`, and that is why
   this shape and not an `if`:** `NaN` → `NaN` (both comparisons false → depth 1, exactly as today);
   `0` / `-1` / `-1e9` → unchanged (depth 1); `Infinity` → **5 000**, which is the second thing this
   line fixes. No other behaviour changes below 5 s at all.

3. **Two comment lines**, one on `budgetMs` and one on `Clock`, stating what the module requires:
   that `budgetMs` above `HARD_CEILING_MS` is capped rather than honoured, and that `Clock` must be
   a real-time, non-decreasing source (`Date.now` satisfies it; a frozen or backwards clock does not
   terminate). **This is QE's `G6` remedy and it costs nothing.**

4. **One guarding assertion, and it belongs on the INJECTED clock, not on the wall.** A real-clock
   test of this costs 5 s of lane and is machine-dependent, which this project's standing rule keeps
   out of the default suite. **Assert it deterministically instead:** with an injected clock the
   search must stop at `start + 5 000` when handed `budgetMs = 10_000` — machine-independent,
   millisecond-cheap, and it reds the moment the clamp is removed. **The repair hop writes it; this
   gate does not write tests.** For `N8-LANE` accounting, that assertion adds no test FILE and no
   child process.

**Definition of done for the repair hop:** `budgetMs = 10_000` returns inside 5 s + granularity on
the real clock (measured and recorded, not asserted in the default lane); `budgetMs: Infinity`
returns; all 1 016 default tests and the 23 `ENGINE_DEEP` tests stay green; `src/turn-loop.ts`
stays byte-identical.

### The residual after the fix, stated now so it is not discovered later as a surprise

**With the clamp in place, a caller passing 10 s will return at ~5 003 ms — still ~3 ms over a
"hard" ceiling.** That residual is **the same accepted risk as clause A**, same mechanism, same
owner (`AR-NFR004-A`), and it is bounded by the same ≤ 31 ms. **I decline to require a safety
margin to hide it.** The engineer refused to invent one, QE recorded that refusal as correct, and I
agree: a margin would make the sentence true by making `budgetMs` a lie, and this module's whole
subject is that the budget is honest. **If the project wants the 5 s ceiling literally true to the
millisecond, that is a decision to take at `EPIC-006` alongside the budget choice, with its cost
visible — not a thing to slip into a repair hop.**
