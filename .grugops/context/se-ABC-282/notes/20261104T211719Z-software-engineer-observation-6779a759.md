---
id: 20261104T211719Z-software-engineer-observation-6779a759
kind: observation
by: software-engineer
at: 2026-11-04T21:17:19Z
verified_by: 
confidence: high: paths and commits as committed
refs:
  - se-ABC-282
  - ABC-282
  - ADR-0071
  - ABC-078
  - ABC-221
  - ABC-283
  - NFR-004
  - NFR-008
  - R-0071-3
  - src/engine.ts
  - src/uci-session.ts
  - src/engine.test.ts
  - src/uci-session.test.ts
  - grugops/ABC-282
  - 04ebeb7e
supersedes: 
seal: sha256:b41ceb02dea9036c0a9aa80f3363b976a0036948a61d2ea33cccdc74e72c0281
---

# ABC-282 artifacts

- **Branch:** `grugops/ABC-282` from `main` `22931005`.
- **Code:** `04ebeb7e`: `src/engine.ts`, `src/uci-session.ts`, `src/engine.test.ts`, `src/uci-session.test.ts`.
- **Raw:** `raw/p1p2-22931005.jsonl`, `raw/p1-analysis-22931005.txt`, `raw/a0-3.mjs`, `raw/a0-3-22931005.jsonl`, `raw/a0-3-head.jsonl`, `raw/scan.mjs`, `raw/scan-a1.mjs`, `raw/scan-patch.py`, `raw/mut.py`, `raw/mut.txt`, `raw/tlines.sh`, `raw/tlines.txt`, `raw/wall.sh`, `raw/wall.tsv`, `raw/a3-ceiling.txt`.
- **QE lines, added to the lanes:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/engine.test.ts -t "ABC-282"` and the same on `src/uci-session.test.ts`.

## Owed, none of it this role's

- **Scribe:** the `AGENTS.md` UCI time-mode line, "`uci-clock-mode` stops before an iteration it predicts cannot finish (`ADR-0071`)", within the byte budget. The UCI session deep lane line's "ABC-221 A10, 3 x 59.5 s" gains the fourth search, up to 60 s.
- **Architect:** D12 item 5, `ADR-0066` d5's dated line.
- **BA/PM:** the `ABC-078` A3 text (D7), in force at the merge; the budget lines on the four pages; A0's numbers on the ticket are the old base's, and `…aadd2d48` holds the new ones; `ABC-221` A10's row now reads `go movetime 90000`, with the clock line as a fourth search.
- **QE:** A4 (5 games at `tc=40/900`), A6 (100 games at `tc=40/8`), the graded lane read. UAT is owed.
