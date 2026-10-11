---
id: 20261010T183947Z-software-engineer-decision-abc093-compiler-shape-weight-switch-strict-san-79cc28a5
kind: decision
by: software-engineer
at: 2026-10-10T18:39:47Z
verified_by:
confidence: high
refs:
  - ABC-093
  - ABC-094
  - ABC-096
  - ADR-0037
  - ADR-0023
  - NFR-006
  - NFR-008
  - tools/opening-book/compile.ts
  - tools/opening-book/book.test.ts
  - data/opening-book/book.json
  - data/opening-book/ATTRIBUTION.md
supersedes:
---

# `ABC-093`: how the compiler realises `ADR-0037` D1, and the four Engineer calls inside it

Hand-authored, unsealed (no `finding` admissible on this install). Cite `ADR-0037`; it holds the why.

**As ruled, not re-decided.** Key = 16-hex Zobrist, `m` = `[uci, weight]` sorted by UCI, keys sorted,
inline `n` at ≤ 12 plies, `maxPly` 12, `attribution` = `"ATTRIBUTION.md"`, `JSON.stringify` + `\n`.
Compiler at `tools/opening-book/compile.ts`, test at `tools/opening-book/book.test.ts` (one file),
artifact beside `ATTRIBUTION.md`. Configs widened exactly as D1(g) names. 0 lines under `src/`.

**Engineer calls (each small, each reversible):**
1. **Weights behind ONE named constant**, `WEIGHT_POLICY: "line-count" | "uniform" = "line-count"`.
   Flipping it to `"uniform"` writes `1` for every move; the encoding does not change. The owner's veto
   (D1(c)) is that one edit plus a regeneration. Not decided here.
2. **The pinned SHA is a constant**, `SOURCE_COMMIT`, written into the artifact's `source.commit`. The
   CLI stays `node tools/opening-book/compile.ts <dir>` as D1(g) words it. The compiler does NOT
   verify the inputs' sha256 against the pin (not in D1(f)'s list); `ATTRIBUTION.md` records the five
   hashes so a maintainer can. Recorded as an option, not built (coding rule 5).
3. **SAN validation covers the WHOLE source line, not just the first 12 plies.** D1(f) says "every
   SAN"; a line whose ply-20 SAN is broken is a malformed row. On the pinned source this refuses
   nothing (0 rejections on 3,865 rows). If a future source breaks past ply 12, the compile fails:
   that is the intended direction for "a malformed source never ships".
4. **"No artifact" is structural:** `writeBook` reads and compiles everything before its single
   `writeFileSync`. `A8` asserts it on disk per fixture; mutation M3 (write first) turns 7 tests red.
   Two equal names on one position are accepted; only two DIFFERENT names refuse (D1(f)'s wording).

**Control-byte check** uses `src/frame.ts`'s char-code test (`code < 0x20 || code === 0x7f`), not a
regex — Biome's `noControlCharactersInRegex` refuses the regex form.
