---
id: 20261022T152541Z-software-engineer-decision-96c58135
kind: decision
by: software-engineer
at: 2026-10-22T15:25:41Z
verified_by: 
confidence: high
refs:
  - ABC-189
  - AR-168-BINPIN
  - QE-168-b
  - ABC-042
  - ABC-168
  - EPIC-007
  - grugops/ABC-189
  - deb555d2
  - 823a9885
  - src/cli.test.ts
  - plans/tickets/ABC-189-nothing-pins-the-value-of-package-json-bin-so-bin-pointing-at-src-uci-ts-passes-every-test.md
supersedes: 
seal: sha256:c9fb438dc306534d23a92d488b5c4f686ad4b1e8209c0320d9da99ee28ce42a5
---

# ABC-189: pin `bin` by value in ABC-042 A10, one line, message `package.json bin (AR-168-BINPIN)`

- **What:** `src/cli.test.ts` gains one line, directly under `expect(packaged.private).toBe(true);` in
  `it("A10 — package.json gains exactly one scripts key and nothing else", …)`:
  `expect(packaged.bin, "package.json bin (AR-168-BINPIN)").toEqual({ skytalix: "dist/uci.js" });`
- **Why this shape:** it is the cut's measured shape. `toEqual` on the whole object also rejects an extra
  or renamed bin entry, not only a wrong path. The message reuses the cut's wording, which contains `AR-168-BINPIN`.
- **No comment line added.** The scope allows one; the message already names the risk id. A10's title, key list
  and every other row are unchanged.
- Commit `deb555d2` on `grugops/ABC-189`, from `main` `823a9885`. Not pushed, not merged.
