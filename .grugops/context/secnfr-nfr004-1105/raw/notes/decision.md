# secnfr-nfr004-1105 decision: PASS_WITH_RISKS. `NFR-004`'s 60 s clause reads MET on the real clock, its `UNKNOWN - verify` struck and kept; `AR-NFR004-A` re-accepted with its number, with QE-223-d's +2.5 ms and A4's +3.9 ms; no rating changes; neither trigger fired

Security/NFR, records only, on `grugops/secnfr-nfr004-1105` from `main` `fefa1601`. Nothing was run. Readings: `…bc10e2ed`. Asked by Architect/Design `…1ce8828d` item 4, through the Orchestrator's brief.

## 1. `NFR-004`, `Verified by`: settled
- **Struck and kept, true until 2026-11-05:** "pending QE's re-run", and "`UNKNOWN - verify` until QE's `A10` re-run (`qe-ABC-221`); a QE wall over 60 000 ms reopens this line."
- **New dated line, in short:** the 60 s clause is MET on the real clock, in QE's `A10` re-run and in play. No wall or move reached 60 000 ms. `A10` walls 59 500.1, 59 500.8 and 59 499.4 ms. A4: 606 moves, longest 59 501 ms, 499 ms under 60 000, 0 moves ≥ 59 900 ms. 13 budgets at the cap, 2 moves ran to it. Neither host was quiet. The full text is in the row.
- **It settles the `uci-clock-mode` line only.** The levels 1–4 `UNKNOWN - verify` stands.
- **It holds for `main`:** no production file in `src/` changed from `04ebeb7e` to `fefa1601`. The diff is three test files.

## 2. `AR-NFR004-A`: re-accepted with its number. Owner: Security/NFR
- **The test is the risk's own:** a later reading materially worse than 1.03 %, or past ≤ 31 ms, is a new question. No reading comes near. `A10` +0.8 ms (0.001 %), QE-223-d +2.5 ms over 614 moves (≤ 0.012 %), A4 +3.9 ms over 118 moves at the abort (0.017 %), A4 at the cap +1 ms (0.002 %).
- **QE-223-d is taken with it,** as the brief asks. It adds the largest sample, at 22.4–25.3 s.
- **Unchanged:** the bound, the mechanism, the discharge clause, the blockquote and the scope, which is the reference machine. I did not tighten the bound: the risk's tail is a stall, and `ABC-078` recorded 105 ms.
- **The limits, said plainly.** The cap has 5 QE readings. +3.9 ms was read at a 23 s budget, not at the cap. The load was light for 24 threads, so the stall tail under saturation is unread. A stall past 31 ms would be a new question, still about 470 ms inside 60 s.

## 3. Rating: none changes
- **59 501 ms with foreign load changes no rating.** QE-282-l stays LOW, QE-282-k stays MEDIUM (host), `AR-UCI-BUSY` keeps ≤ 60 s under the Architect's ruling, `SEC-221-a` stays INFO. `R-0071-1` and `R-0071-2` are not this read's.
- **Why.** The margin at the longest move is 499 ms, about 16× the bound and over 4× the largest stall on record. It is `ADR-0052` D4's designed margin. The foreign window did not move the figure: 59 501 ms under load, 59 500 ms with no foreign vitest sampled, though two moves show little.
- **What moved is exposure.** The cap is reached in play now, where `ABC-223` read 0 of 629.
- **Triggers:** 0 moves ≥ 59 900 ms; no overshoot past ~31 ms. There is nothing to report under them, and nothing is re-opened.

## Accepted risk, owner, severity
- `AR-NFR004-A`: accepted, owner Security/NFR. No finding is high, and `security.block_on` is `high`. No required fix. No owner item.

## Left as found, for the Orchestrator
- **`NFR-009`'s `Verified by`** has the same stale `UNKNOWN - verify` until QE's `A10`. The brief names `NFR-004`'s cell only. One records-only line settles it: QE read +0.12 MiB, and `EPIC-009` already closed `RISK-EPIC009-07` on it.
- **`AR-UCI-BUSY`'s 2026-10-31 bullet** still reads the drain as pending. QE read 0.41 ms. The entry is Architect/Design's.
- **A4's nine logs** are not committed, though `…1434a7d1` says they are. They exist only in QE's worktree. Keep them before that worktree is cleared, or let `…1434a7d1`'s line stand corrected by this note.
- **The host label:** neither QE note spells `oeselg-dev`. I read both as the reference by inference.
