# Recommended pull order for ABC-284..ABC-299 after ABC-271 → the second pull and ABC-282, and one owner question (Q-3K-10, Q2's fence)

A recommendation to the Orchestrator, who sets the order (ADR-0056 D6: "the Orchestrator and BA/PM may reorder by width and evidence"). It assumes the ruled order stands first: ABC-271 (structure at 0) → E2's second pull, one read judging both; ABC-282 (W1) after ABC-283 on src/engine.ts. A probe or design hop is records-only and may run by width before its ticket's turn.

1. **ABC-284 (P1).** Its probe needs no build. One named premise (E1's tree) has been on main since 54dee3f2, with Q1 since then too, and no P1 re-probe is on record. It carries the largest Phase 2 estimate (+40–100, an estimate).
2. **ABC-286 (P4), when ABC-283 merges.** History on main is its only gate, and its joint probe follows at once.
3. **ABC-288 (O2c), when ABC-283 merges.** It builds on the same history table. If ABC-283 misses, both 2 and 3 stay held and drop out of this order.
4. **ABC-290 (E3b), right after the second pull.** It is the largest evaluation estimate after E2 (+40–100 for row E3, an estimate), and the tuner reads the king about 3 × heavier than E1's tables.
5. **ABC-292 (E5).** The second-largest evaluation estimate (+30–80). It is a re-try of ABC-207 by the tuner.
6. **ABC-291 (E4b), then 7. ABC-293 (E6).** These are smaller estimates under the same pattern. If the ADRs take form (a), items 4–7 can land as structure at 0, one at a time, and **one later pull can then fit all four in one read**. That spends one read where four would otherwise be needed.
8. **ABC-295 (R2), at Phase 4's close.** It is the first outside number on a tuned evaluation (RISK-EPIC010-05).
9. **ABC-298 (V3), after ABC-283.** It may be value-identical (an S2 read, no games), and its speed helps every later read and the 40/15 claim.
10. **ABC-297 (X2).** It acts at the depths 40/15 reaches, so it should come before the claim. Its probe comes first.
11. **ABC-296 (X1).** It is S, but the prior evidence is weak (ABC-210 read −4.8 ± 16.2 in another form).
12. **ABC-294 (E7b), after ABC-272's probe.** It is the smallest evaluation estimate, and its order is free.
13. **ABC-287 (P6), re-measured after the second pull.** It is the smallest search estimate, and it fails today's safety rows.
14. **ABC-285 (P5).** It is worth about 0 at 100 ms, and its NEUTRAL read can only show no harm. It is deferred by ruling.
15. **ABC-289 (Q2), only on a Q-3K-10 yes.** Its trim after Q1 is UNKNOWN - verify.
16. **ABC-299 (R3), at Phase 5's close.**

**Owner questions where cutting needed his choice:**
- **Q-3K-10 (new):** open ADR-0024 d4 for the **design** of Q2 (delta pruning), as Q-3K-9 opened it for Q1? Both Q-3K-9 and ADR-0069 left delta pruning fenced. The default until he answers: fenced, and ABC-289 stays held. Recorded in EPIC-011 § Owner questions; the Orchestrator takes it to him.
- **Recorded, not new, asked before the second pull:** the ADR-0067 d6 amendment (the margin-aware form) and B-T8's re-confirmation (…212d6a4c § 3).
- **None other.** Every other hold is an Architect's ADR, a probe, or another ticket's read. Amending ADR-0050 (P5) or adding new ADRs needs his acceptance when they are written. That is the normal path, not a cutting choice.
- **Later, not now:** if a form needs more than 16 MiB in all (O2c's tables), that is NFR-009's level and his. Each later tuning pull's B-T8 is his.
