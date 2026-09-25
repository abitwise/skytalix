---
id: 20260925T134051Z-security-nfr-decision-1259705f
kind: decision
by: security-nfr
at: 2026-09-25T13:40:51Z
verified_by:
confidence: high
refs:
  - NFR-005
  - AR-NFR005-079
  - ABC-079
  - ABC-081
  - ABC-121
  - plans/nfr-catalog.md
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
  - plans/traceability.md
  - .grugops/context/wave-2026-09-24/notes/20260925T190000Z-orchestrator-decision-aa98a05d.md
  - .grugops/context/secnfr-ABC-081/notes/20260925T124500Z-security-nfr-decision-abc081-pass-with-risks-nfr005-met-plain-node-no-security-finding-48e9e17c.md
supersedes:
---

# `NFR-005` runner wording PLACED; `AR-NFR005-079` CLOSED

**Not a stamp.** `context.human_admission` is `off`, so this is a hand-authored `decision`. It carries
no `§14-gate#<id>`. The authority is the owner's word, *"3. use recommendation"* (Orchestrator note
`…aa98a05d`, items 3a and 3b). No re-measurement was made at this hop.

## 1. Placed in `plans/nfr-catalog.md`, row `NFR-005`

- **Target column:** the text below was inserted immediately after *"Node rate is a **diagnostic, not
  the target**"*. It is `…48e9e17c` § 6 (a) verbatim, joined onto one line for the table cell. The
  one added byte-pair is the separator `. ` before it, because the anchor ended the cell with no
  full stop.

  > **Runner: plain `node`.** Depth-in-budget is read from `chooseMove` at `DEFAULT_BUDGET_MS` on
  > the real clock, in a plain `node` process — the product's own runtime (`npm run chess` →
  > `node src/cli.ts`). A depth read under vitest (5–7x fewer nodes/s on the same code, measured at
  > `ABC-080` and `ABC-081`) is a regression indicator, reported and never the verdict. Ruled by
  > Olger Oeselg, 2026-09-25 (*"2. use recommendation"*, `wave-2026-09-24` note `…0288b6ed`).

- **Verified-by (last) column:** appended at the end of the cell. It is `…48e9e17c` § 6 (b) verbatim.

  > **FLOOR MET at `ABC-081`'s close** (Security/NFR `secnfr-ABC-081`, 2026-09-25, Apple M3, node
  > v24.12.0): plain node kiwipete **6**, position-6 **6**, 5 of 5 rounds, load 3.6–4.6; depth 6
  > completes by 2.0 s. **Depth 7 not reached (WARN, still PROVISIONAL).** Vitest reads 5 / 5.

- **One `_Updated:` line** was added at the top of the file.
- **Levels:** no level moved. The depth 6 FAIL floor, the depth 7 WARN level and its PROVISIONAL
  marker are unchanged.
- **Other rows:** every other line of the file was hashed before and after. Only the `NFR-005` row
  changed.
- **Not placed:** § 6 (c), the missing plain-node guard in the suite. It was named as a gap, not as
  wording, and it is still Architect/Design's call.

## 2. `AR-NFR005-079` CLOSED

- **Reason:** its condition, *"`NFR-005` below its floor"*, no longer holds on the owner-ruled runner.
  On plain node, kiwipete read 6 and position-6 read 6, in 5 of 5 rounds, against a floor of 6
  (`…48e9e17c` § 1).
- **Where it is recorded closed:**
  - an appended closure paragraph at the end of `ABC-079`'s § Security/NFR (the original entry is
    left as written);
  - a new row in `plans/traceability.md`.
- **Not closed with it:** the depth-7 WARN. It was never part of this risk, and it stays with `ABC-121`
  and the `EPIC-004` spike.
- **Not edited, by fence:** `plans/board.md` line 392 still names `AR-NFR005-079` as open. The
  Orchestrator owns that line.

## Fences kept

- Zero lines were written under `src/`.
- No change was made to `plans/board.md`, `AGENTS.md` or any ADR.
- Nothing was merged or pushed.
- **Clock note:** this note's `at` is the machine's UTC clock. The Orchestrator's `…aa98a05d` and its
  enqueue carry `19:00Z` / `19:05Z`, which is later than this machine's clock. That was not
  corrected here.
