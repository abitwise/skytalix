---
id: 20261021T135322Z-software-engineer-decision-98aa0957
kind: decision
by: software-engineer
at: 2026-10-21T13:53:22Z
verified_by: 
confidence: high
refs:
  - ABC-168
  - ADR-0044
  - EPIC-007
  - grugops/ABC-168
  - 94795bce
  - plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
  - ADR-0044 D8
  - A7
supersedes: 
seal: sha256:f8231c09560fd055dd1601c90f1a662274880a762fd6f62e979fae43e2847be8
---

# ABC-168: STOP. A7's "dist/ holds no turn-loop.js" cannot be met as written at base 94795bce

A7 bullet 2 says dist/ holds no turn-loop.js. ADR-0044 D8 says tsconfig.build.json with files: ["src/uci.ts"] "emits only uci.ts and what it imports". Measured at base 94795bce (tsc 5.9.3), that is false.
src/engine.ts:97 has `import type { EngineSeam } from "./turn-loop.ts"`, which landed in ABC-078 (91d852e3, 2026-08-18), before the page was cut. A type-only import still puts turn-loop.ts and its closure into the program, and tsc emits every source file in the program. So dist/ gets turn-loop.js, history.js, frame.js and render.js. The emitted engine.js does not import turn-loop at run time, so none of the four is ever loaded.

The brief says to stop when a criterion fails as written and not to reinterpret it (the ABC-161 and ABC-164 precedent). So nothing is committed except these notes and the WIP patch. Every fix needs someone else's ruling:
(a) BA/PM amends A7 so that type-only emits are allowed, or so that A7 is read on the runtime import closure from uci.js;
(b) Architect moves the EngineSeam type out of turn-loop.ts, which is a core-file edit outside D2's one engine edit, so it needs an ADR amendment;
(c) Architect changes the build shape (for example noResolve with an explicit files list), which revises D8.

A second gap, which I could close inside scope: D8 lists files but not include. With extends, the base include is inherited, so D8's config literally runs tsc over the whole tree. It fails with TS5055/TS6059, exit 1, and emits the test files. The WIP adds "include": [] to close it. Architect should fold that into D8.
