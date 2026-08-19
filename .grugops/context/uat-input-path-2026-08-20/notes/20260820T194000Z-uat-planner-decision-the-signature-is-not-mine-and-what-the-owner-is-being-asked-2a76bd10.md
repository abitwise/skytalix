---
id: 20260820T194000Z-uat-planner-decision-the-signature-is-not-mine-and-what-the-owner-is-being-asked-2a76bd10
kind: decision
by: uat-planner
at: 2026-08-20T19:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-033
  - ABC-035
  - ABC-037
  - AGENTS.md
  - plans/board.md
  - agent-factory/checklists/uat-checklist.md
  - ABC-110
  - ADR-0014
  - NFR-008
supersedes: 
---

# The `In UAT` exit is NOT mine — the signoff checklist, and what "passed" here does and does not mean

## Read this paragraph before you read any "PASS" in the sibling notes

**Twenty-four scenarios were conducted against the real build and twenty-four behaved as the
tickets say they should. That is a MEASUREMENT, and it is NOT an acceptance.**

- No human has accepted `ABC-033`, `ABC-035` or `ABC-037`. Not one.
- **These notes carry no stamp and cannot carry one.** `context.human_admission` is `off` on this
  install and no `finding` is admissible, so every note from this hop is a `decision` /
  `observation` / `artifact-ref` — hand-authored, unstamped, exactly as `AGENTS.md`
  § *Test and UAT authority* requires. There is no `§14-gate#<id>` here and no `human:<name>`.
- **The owner was told, on 2026-08-16, that a green agent report would NOT be treated as his
  acceptance.** This is that report. It is not his acceptance.
- **`AGENTS.md`'s zero-production-lines waiver does not apply** to any of the three; the
  Orchestrator measured that from git before enqueueing this hop, so **each of these three still
  needs the owner's word.** Nothing in this hop discharged it.

**If a later reader takes "UAT passed" off this hop as a human having accepted the work, they are
misreading it, and this paragraph is the correction placed where they will meet it.**

## The signoff checklist — nine questions the owner can answer with his word

The signature is the **project owner's**. His word in session IS the `In UAT` exit signature
(2026-08-16, `memory-bank/60-progress.md`). Nine questions, each answerable yes / no / not yet:

1. **`ABC-033`** — you can type `e4`, `e2e4`, `E2E4` or `e2-e4` and mix them freely in one game,
   without ever declaring which you are using. Is that the product you asked for?
2. **`ABC-033`** — when two of your knights can both reach a square, the product lists `Nbd2` and
   `Nfd2` and asks again instead of choosing for you. Do you accept refusing-to-guess as the
   behaviour, including the extra keystroke it costs you?
3. **`ABC-033`** — lower-case `o-o` castles. Do you accept the case tolerance as scoped (a retry,
   so `bxc4` still means the pawn), knowing the `bxc4`/`Bxc4` pair **could not be exercised from
   the prompt** and rests on the suite, not on this UAT?
4. **`ABC-035`** — `help` lists exactly `help board quit claim`, and `hel`, `h` and `boards` are
   not commands. Is that vocabulary and that strictness what you want?
5. **`ABC-035`** — **`quit` is recognised and does nothing; the session does not end.** The effect
   is `EPIC-006`'s by a 2026-08-12 ruling. **Do you accept shipping a `quit` the product advertises
   in its own `help` and does not honour?** This is the question I most want answered out loud.
6. **`ABC-035`** — `claim` with nothing claimable answers `repetition 1 of 3 / 50-move 0 of 100`.
   Is that the teaching you wanted, knowing the **available**-claim case was not reachable here?
7. **`ABC-037`** — ending the session mid-typing discards the half-line rather than guessing it,
   and the product closes with `input ended` and exit `0`. Correct?
8. **`ABC-037`** — **the criterion the ticket itself calls discriminating (`A5`: a bug below the
   prompt must crash loudly, never be dressed up as "not a legal move") COULD NOT BE EXERCISED
   from the prompt.** Do you accept `ABC-037` with that criterion resting on its unit suite and on
   code reading, and not on this UAT?
9. **All three** — do you accept that everything above was measured on piped input, and that
   `ABC-043`'s open live-stdin defect (first move silently eaten) may change what you see if you
   run these by hand at a keyboard?

## Exit criteria, stated so nobody has to infer them

**`In UAT` is exited by the owner's word on questions 1-9, and by nothing else.** Not by this
note, not by the scenario count, not by the absence of failures.

## Which column I believe each ticket should land in — a RECOMMENDATION; the move is the Orchestrator's

`plans/board.md` was **not touched** by this hop, per the brief's fence. `Ready for UAT` is at
`4/4` and `In UAT` at `0/4`, so the three moves fit the limit.

| ticket | my recommendation | why |
|---|---|---|
| `ABC-033` | **`In UAT`** now; `Ready to Release` **only on the owner's word** | 9/9 conducted scenarios behave as specified; two criteria not exercisable from the prompt, both named |
| `ABC-035` | **`In UAT`** now; `Ready to Release` **only on the owner's word**, and I recommend question 5 (`quit`) be put to him explicitly rather than bundled | 7/7 conducted scenarios pass; the `quit` boundary is correct-by-ticket but is a real usability exposure a signer should see |
| `ABC-037` | **`In UAT`** now; `Ready to Release` **only on the owner's word**, and I recommend question 8 (`A5`) be put to him explicitly | 8/8 conducted scenarios pass, but the ticket's OWN discriminating criterion was not exercisable at the product surface |

**I am not recommending `Done` for any of the three, and I am not recommending `Ready to Release`
for any of the three today.** A UAT that no human has signed does not clear the `In UAT` exit,
and none of these three qualifies for the zero-production-lines waiver.

## No defect was cut, and one thing was deliberately not fixed

**No defect was found that is attributable to these three tickets.** Nothing under `src/`,
`AGENTS.md`, `plans/nfr-catalog.md`, `package.json` or `vitest.config.ts` was modified by this
hop — checked, not asserted. `ABC-043`'s live-stdin defect was checked for, **not reproduced in
my harness**, **not re-cut** and **not fixed**; it remains open against `ABC-043`.

## Checklist coverage (`agent-factory/checklists/uat-checklist.md`)

UAT goal ✅ · entry criteria ✅ · business scenarios ✅ (24) · test data ✅ · expected results ✅ ·
known limitations ✅ (5, plus 6 not-exercised criteria named individually) · rollback ✅ ·
signoff person ✅ (the project owner) · exit criteria ✅. **Nine of nine — and the last two are the
two this hop can prepare and cannot satisfy.**

## Lane cost — REPORTED, NOT GRADED

This hop added **no test file and no production line**, so it moved the suite's CPU cost by
nothing. Wall-clock spent exercising the product was ~55 s across 14 runs, and it is dominated by
the engine's 3 s per-move budget rather than by anything these three tickets own. **No grade is
attached**: `ADR-0014` rules `NFR-008` **BREACHED** and `ABC-110` is live on it, so grading a lane
cost against that clause from this hop would be inventing a verdict on someone else's open ticket.
