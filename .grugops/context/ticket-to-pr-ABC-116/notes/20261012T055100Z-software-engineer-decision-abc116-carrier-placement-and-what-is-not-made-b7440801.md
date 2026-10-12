---
id: 20261012T055100Z-software-engineer-decision-abc116-carrier-placement-and-what-is-not-made-b7440801
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-116
at: 2026-10-12T05:51:00Z
verified_by:
confidence: high
refs:
  - ABC-116
  - ADR-0017
  - ADR-0035
  - G-QE115-3
  - src/cli.test.ts
  - plans/nfr-catalog.md
supersedes:
---

# `ABC-116`: where the carrier went, and what was named but not made

- **Placement.** The `T2` block is appended inside the existing JSDoc on `interface ChildOptions`
  (`src/cli.test.ts:321-346` at the tip, `interface ChildOptions` at `:347`), after the `hook` paragraph.
  - It covers both surfaces `A1` allows. The interface carries `input`, `hook` and `timeout`. Its
    first sentence also names `childOf`'s `args` / `productArgv`, the fourth spelling.
  - It is +25 lines, all ` * ` comment lines, and nothing is removed. No other site was touched.
- **What the block says.** It follows the re-score's `A1`(ii) reading:
  - the narrow set (`ADR-0035` d2);
  - the median, the twin's `R`, and the MET / NOT MET / UNRESOLVED state;
  - decision 3's per-set `F`, named **without its number**.
  - The only numbers in it are this hop's dated mutant reading and `ADR-0017`'s figure, so that the
    disagreement can be stated.
- **The canonical `N8-SPAWN` row form** is a new section on the ticket page. The `## Delivery`'s
  `### Security / NFR triggers` quotes it with the trigger sentences unchanged (`A3`).
- **Named and NOT made: the `plans/nfr-catalog.md` forward pointer.**
  - The edit is a one-line pointer from the `N8-SPAWN` account block to the `T1`/`T2` bullets. Its
    owner is Architect/Design.
  - The page's line numbers have drifted: the account block is at `:1192` (the page says ≈ 1147), the
    bullets are at `:1629-1630` (the page says ≈ 1508), and the file is 1999 lines (the page says 1531).
  - `plans/nfr-catalog.md` and `AGENTS.md` have 0 bytes changed.
- **A5 hash drift.** The page pins `63f66795…ca31`. The 8 rows hash to
  `c74e742698b59da90b67e101942f20406a20c8aee54da7f518df39da9eae0d3b` at base `3c38a8ea` AND at the tip.
  - That is the re-score's value: since `fcf12c1`, rows moved at `ABC-110` (`eee4dfff…`) and on the
    owner's word (`NFR-005`/`NFR-008`).
  - Graded base == head on 8 lines.
- **Not done, deliberately.** The harness was not committed as a lane or guard; it lives only in
  `probe/`, as `ADR-0017` d1 requires. `F` for `src/cli.test.ts` is left to its owner.
