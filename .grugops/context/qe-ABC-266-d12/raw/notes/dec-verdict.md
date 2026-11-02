# ADR-0062 D12 rule outcome: MISS (not loaded). Median played depth at 100 ms: Threads 12 = 7, Threads 1 = 7. By the pre-registered rule the Architect re-proposes before any ABC-266 build

QE/E2E, task `qe-ABC-266-d12`. The verdict is by rule (`raw/probe/analyse.mjs` on `raw/out/full.jsonl`) under the pre-registration sealed before the run (`…decision-6231db75`). No hand grade. Evidence is in this task's results observation.

## Verdict
- **Rule:** PASS iff median(T12, 100 ms) > median(T1, 100 ms). Read: 7 against 7, so not above.
- **LOADED:** no. Phase foreign cores 0.454, 2 of 20 blocks above 0.8, no foreign vitest or `cutechess-cli`.
- **Outcome: MISS.** It is not VOID-LOAD.

## What the rule routes
- **Before any `ABC-266` build,** the Architect re-proposes (ADR-0062 D12): helper diversity (D3), or ADR-0058's deeper-entry rule at `Threads ≥ 2` only, each with its own probe.
- ADR-0062 stays PROPOSED as written until the Architect acts. This hop moves no ADR text, no board line and no ticket row.

## For the Architect (evidence, not a design choice)
- **Lockstep:** all 12 workers completed the same depth in 19 of 20 searches at 100 ms. D6's deepest-completed rule changed the played depth once at T12 and never at T4.
- **Per-worker rate:** at T12 a worker runs at about 0.69 of a single thread (median nodes per worker per go), and about 0.98 at T4. With no depth gain from the table, T12 played 1 ply shallower than T1 on 4 of 20 positions at 100 ms. It was above on 1.
- **1000 ms (info):** T12's median is 10 and T1's is 10. T12 was above on 2 of 20 and below on none. The table starts to pay only at the longer budget, and only slightly.
- **T4 (info):** median 7 at 100 ms (19 of 20 equal to T1); 9.5 at 1000 ms against T1's 10.
- **Implication for A7 as written:** with the same build on both sides at 100 ms, `Threads 12` plays at about Threads 1's depth. A7's GAIN bar (≥ 50.0 of 100) would then read near 50 and fail about half the time on noise. That is the case D12's probe exists to catch.

## Not this hop's
- The re-proposal itself, any diversity probe, and the owner's acceptance of ADR-0062 (max 12 or 8).
- ADR-0062's text is unchanged. A dated line recording this outcome is the Architect's.

## Scope
D12's one probe. It is not A7 and not a gate. The build had not started, and nothing is blocked beyond what D12 states.

## Risks
- **A single pass of 20 positions.** A second pass could move a median by 0.5. The rule was sealed as one pass, and this note reads it as sealed.
