# arch-ABC-239 decisions: `ADR-0067` is written PROPOSED. It sets a Texel-style logistic fit of game results, cross-entropy with K fixed first, and Newton steps on a traced linear model behind an identity gate. Material is frozen at the first pull, and the free set is sign-bounded, C-S or C-F by an inner-split rule. `tools/tune/` writes only `src/evaluate-params.ts`. A value-identical "blend every half" ticket (E2-pre) goes first. Own games by default; Lichess CC0 for training on the owner's yes (recommended). Order: `ABC-269` → E2-pre → `ABC-239` → `ABC-270` / `ABC-271`; `ABC-272` free

Architect/Design, task `arch-ABC-239`, `grugops/arch-ABC-239` from `main` `af15cbc9`. Evidence: the results note of
this task, PREREG `…9ed1db11`, addenda `…255e9bcf` and `…f8d36d73`. ADR:
`memory-bank/50-decisions/ADR-0067-evaluation-weights-tuned-offline-by-a-logistic-fit-of-game-results-newton-on-cross-entropy-material-frozen-at-the-first-pull-and-a-value-identical-blend-of-every-half-first.md`.

## 1. What is decided (`ADR-0067`, PROPOSED; acceptance is the owner's)
- **Method:**
  - a logistic fit of game results, σ(K·e/400) in base 10, with mean cross-entropy (squared error reported beside it);
  - K by golden section on the base values, then fixed;
  - Newton steps with line search and bound projection, full batch, deterministic.
- **The identity gate:** a tracer in `tools/tune/` re-implements the term counts. Before any fit, every row must hold
  |model − `evaluate`| < 1 cp. The prototype had 0 misses of 254 485.
- **The first pull:**
  - Material is frozen at the classical scale (the prototype's free material read queen 2 593 / 137).
  - Free: passed, doubled, isolated, three king-file terms and mobility, each mg / eg, plus the PSTs (C-S scales, or
    C-F cells with an L2 prior, by the inner rule).
  - Sign bounds from the relation tests.
  - A red relation test becomes a bound, with one refit. No test bar is edited, except `ABC-215` A2's rule-rebuild
    rows, which a provenance row replaces.
- **Emission:** rounded half away from zero, into `src/evaluate-params.ts` only, with a provenance header (manifest
  sha256, split strings, K, configuration, λ, losses, tool commit). Byte-identical on a re-run.
- **E2-pre:** `src/evaluate.ts` blends every term's halves (the delta form, a packed score recommended).
  - It is value-identical, and so node-identical to `ABC-269`'s head.
  - Bars: `G2` ≤ 1.05 ×, `G6` "≥ base", no games.
  - It keeps `ABC-239`'s A3 ("constants only") and A4 (`G2` ≤ 1.02 ×) true as written.
- **Data:**
  - Own self-play games by default (A1; 3 431 games and 254 485 rows today, manifest `6e8d0ab0…`).
  - Lichess CC0 for training only, on the owner's yes, with every comment ignored (`[%eval]` included) and own games
    as validation.
  - Split by opening, with an inner split for every choice.
- **Bars B-T0–B-T8 and falsifiers F1–F7** are in the ADR. The intent is GAIN. B-T2 = A2 as written (< 1.000 × base
  cross-entropy).

## 2. Recommendation
- **Build the tool. Do not wait for more design.** The pipeline works and is cheap: about 30 s of host for 254 k rows.
- **Ask Q-3K-7 now.** On own games alone the bounded move is about 0.4 % of loss, and C2′ may not see it. The tool's
  shape does not depend on the answer.
- **Do not free material** until a pull on broader data, inside a box.
- **Ask B-T8 (the outside pair) before merge.** A tuned set judged by self-play alone is `EPIC-008`'s failure.

## 3. Order and dependencies (plainly)
1. **`ABC-239`'s build waits for `ABC-269`'s merge: yes.** It needs E1's table and the delta blend.
2. **E2-pre** next: a new ticket, size S, value-identical.
3. **`ABC-239`:** the tool and the first pull.
4. **`ABC-270` (E3a) after `ABC-239`.** Its new terms then get fitted weights, not hand ones (`ABC-207` lost on hand
   weights). The tuner's king-table signal (≈ 3 × in every fit) suggests part of E3a's gap is a weight the tuner
   finds. If `ABC-239` stalls on data, `ABC-270` may go first on its rules, and the tuner traces it in its first pull.
5. **`ABC-271` (E4a) after `ABC-239`:** king distance and free path are fitted weights; the square rule stays a rule.
6. **`ABC-272` (E7a): order free.** A pawnless rule plus a multiplicative scale; the tracer applies the scale. Its
   premise probe can run any time after E1.
7. **`ABC-273` (R1)** stays where BA/PM put it, after E1: the outside anchor before E2.

## 4. Owner questions (framed; recommendation given; not assumed)
- **Q-3K-7 (a), Lichess CC0 for training.** May the tuner train on one Lichess standard-game monthly export?
  - Terms: CC0 by its page; URL and sha256 recorded; file kept outside the repository; rated games, base ≥ 180 s,
    both ratings ≥ 2000, normal termination; comments ignored; at most 1 M positions; own games stay the validation.
  - **Recommend yes.** The prototype shows that own games alone fit implausible material and leave about 0.4 % bounded.
  - Cost: one manual download, minutes of host, no runtime network.
- **Q-3K-7 (b), a Stockfish-labelled set:** not needed. **Recommend no** (product identity).
- **Q-3K-7 (c), games against Stockfish as training data:** **recommend no.** Half the moves are Stockfish's, and the
  results lean to losses.
- **If (a) is declined:** generating more own games is about 4 h per 1 000 games at 100 ms, which is over the 1 h line,
  so it is asked separately. Otherwise the first pull runs on today's own games, bounded.
- **B-T8, the 200 + 200 outside pair (≈ 5 h), before `ABC-239` merges:** asked first, per A6. **Recommend yes.**
- **Accept `ADR-0067`:** his word ("accept ADR-0067" / "decline it").

## 5. Owed lines (not edited here; fences: `ADR-0056`, `EPIC-011`, ticket pages)
- **`ABC-239` page (BA/PM):**
  - A1: the data per `ADR-0067` d9 (own games by default; Lichess only on the owner's recorded yes).
  - A2: cross-entropy on the outer validation, split by opening, < 1.000 × base (B-T2); the fit is reproducible.
  - A3 / A4: hold as written once E2-pre is merged (dependency added).
  - DoR row 10: "method ADR" → "`ADR-0067` PROPOSED; data: Q-3K-7".
  - Dependencies: `ABC-269` merged, E2-pre merged.
  - Intent line: "GAIN".
  - Test note 1: the manifest sha256 and split strings recorded.
  - The `ABC-215` A2 rule rows are replaced by a provenance row in the build.
  - The split rule does not fire (one tool module).
- **New ticket "E2-pre" (BA/PM):** "the evaluation blends every term's two halves, value-identical at E1's table". Bars
  per `ADR-0067` d8. Size S, `EPIC-011` Phase 4, between E1 and E2.
- **`ADR-0056` (Architect/Design, a later fold):**
  - row E2 → `ADR-0067`;
  - Q-3K-7 re-framed as (a) / (b) / (c), with the prototype's evidence;
  - D6 Phase 4: E1 → E2-pre → E2 → E3–E7, with `ABC-272` order free.
- **`EPIC-011` (BA/PM):** Phase 4 rows (E2-pre added; `ABC-239` design PROPOSED; `ABC-270` / `ABC-271` after
  `ABC-239`, with the stall clause). The king-table signal goes to `ABC-270` as supporting information.
- **`ADR-0064` (Architect/Design):** a dated pointer at d4 ("E2's method ADR is `ADR-0067`, PROPOSED") and at d6 ("the
  two-accumulator form is cut as E2-pre, value-identical").

## 6. Effort
- **E2-pre:** S. SE about a day, plus QE (node identity, `G2`, `G6`).
- **`ABC-239`:** L.
  - The tool: about 800–1 000 lines of TypeScript with tests outside the default lane.
  - One fit: minutes.
  - The reads: about 0.7 h (C2′, S′, Levels), plus `G6` and the futility audit. B-T8 adds about 5 h if asked.
