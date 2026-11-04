---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T19:57:33Z
subtask: arch-bundle-1
role: architect-design
ref: .grugops/context/arch-bundle-1/
branch: new grugops/arch-bundle-1 from main — worktree .claude/worktrees/arch-bundle-1
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Probes on scratch copies, each ≤ 30 min, ≤ 1 h in all; no games beyond what a PREREG names. Host paths only as placeholders.
---
# Accept the bundle read; design bundle 1 (ABC-286 P4 + ABC-288 O2c)
Owner 2026-11-04: read the Orchestrator's decision note of 2026-11-04T19:56:54Z in .grugops/context/orch-2026-10-30a/notes/.
1. ADR-0056: mark § the bundle read ACCEPTED 2026-11-04 (owner, Q-3K-11 (a)), carrying R-BUNDLE-1. Add a dated log line. No other change to the rule.
2. Design bundle 1 under that rule, on main (ABC-283 is in force). Read plans/tickets/ABC-286*.md and ABC-288*.md, ADR-0063 (K3, R-283-LMR), ADR-0060, arch-ABC-283-mate …05ef9fc9, and ADR-0056's bundle read.
   - PREREG sealed before any measured probe.
   - Write ADR-0072 (P4) and ADR-0073 (O2c; or an ADR-0063 amendment, if that is the right form, and say why), both PROPOSED: rule, values by a stated rule, doors plus the all-off door, the order against history, killers and K3, and the cost.
   - Probe the mate floor with both parts on and per part. R-283-LMR says it is order-sensitive, so name what happens if it goes red.
   - State the bundle's single read (C2′ 100 games at 100 ms, GAIN ≥ 50.0) and the bars each part still shows alone.
   - Respect the lane budget: rows ≥ 50 ms go deep; no new default-lane file.
   - Name the merge interaction with ABC-282 (W1) and with ABC-298 on orderMoves.
3. In your decision note, list the owed BA/PM lines and any owner question (acceptance of each new ADR).
Fences: memory-bank/50-decisions, your records, scratch. No committed src or tools; no ticket, EPIC or board edits. Do not use ADR-0074 (arch-ABC-289 holds it). No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-bundle-1, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

**2026-11-04, Architect/Design. The bundle read is ACCEPTED in `ADR-0056`. Bundle 1 is designed as `C1+M3`, and neither premise is met: `ADR-0072` and `ADR-0073` are PROPOSED with F1 fired, and the build waits for the owner's word. The mate floor reads 0 with both parts on and per part.**

- **PREREG `…aa5c4dc1`,** sealed and committed (`59a98278`) before any measured run. Readings `…ed82b408`; design, owed lines and owner questions `…37b7fb23`.
- **Forms by the rules:** O2c = C1, the countermove alone (continuation history fails Safety and buys no node). P4 = M3, T = 4 / 7 / 12, d ≤ 3, key-0 quiets, three non-pawn pieces (no form met every bar; M3 is carried).
- **P4, own door:** safety and pay met (d8 0.6039 / 0.8170 / 0.7509 / 0.8363, reach +0.116). L2 missed: drift 93.58 % / 94.12 %, 80 / 79 cp; audit 15.27 %, 29 errors ≥ 200 cp.
- **O2c, own door:** safety met. CH3 missed on all four: 1.0031 / 0.9999 / 1.0935 / 0.9989.
- **Mate floor:** `C1+M3`, `M3` and `C1` each read 0 on every row (d5 0 / 191, 0 / 189; older rows 0; d6 0 / 209; fresh KRK / KQK 0). Other forms went red; six of those rows clear with LMR off (`R-283-LMR`'s class).
- **The read, if the owner lifts:** one C2′, 100 games at 100 ms, GAIN ≥ 50.0, never re-played.
- **Owner:** `OQ-0072-1`, `OQ-0073-1`, one answer: (a) lift both and read the bundle, recommended over two misses; (b) `ABC-286` alone; (c) hold both.
- **Disclosed:** Step B's first attempt crashed on a missing import in the probe patch; it was fixed and all of Step B re-run. No form, bar or rule moved.
- **Measured:** about 13.5 min of the 1 h cap. No games. Nothing committed to `src/` or `tools/`.
