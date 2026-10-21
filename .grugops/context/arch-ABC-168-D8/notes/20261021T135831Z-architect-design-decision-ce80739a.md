---
id: 20261021T135831Z-architect-design-decision-ce80739a
kind: decision
by: architect-design
at: 2026-10-21T13:58:31Z
verified_by: 
confidence: high
refs:
  - ABC-168
  - ADR-0044
  - ADR-0044 D8
  - EPIC-007
  - EPIC-007 M9
  - A7
  - grugops/ABC-168
  - 2f02d158
  - 41f5b366
  - ADR-0011
  - ADR-0036
  - ADR-0018
  - ABC-170
  - ABC-172
supersedes: 
seal: sha256:b258ab1982942a89c1b08b667d301398ce32d0b8debea8f0f72052e7a8e043ed
---

# ABC-168 D8: ruling (a). dist/ may hold type-only emits; A7 and M9 fence what dist/uci.js LOADS. D8 gains "include": []

Recorded as a dated addendum in ADR-0044 (§ Addendum — 2026-10-21, plus a pointer in Status). No accepted text was rewritten.

1. **Fix (a).** D8's sentence "emits only uci.ts and what it imports … no terminal-only module is emitted" is false. tsc emits every file in the program, type-only imports included. Corrected guarantee: the runtime closure of dist/uci.js holds no terminal-only module and no test file. cli.js, line-input.js and *.test.js are still not emitted.
   Measured by hand at the build hop, in QE's fresh clone and at UAT:
   (i) in the away-from-clone copy, rm -f d/turn-loop.js d/history.js d/frame.js d/render.js before the dialogue, which still passes with exit 0;
   (ii) grep -l 'import(' dist/*.js prints nothing;
   (iii) there is no *.test.js, cli.js or line-input.js.
   A missing static ESM dependency fails at link time, so (i) proves the four are not loaded. The negative control is in the observation note.
2. **"include": [] is folded into D8.** Without it, D8 inherits the base include and the build exits 1.
3. **Rejected:**
   - (b), a types-only module for EngineSeam: GameHistory still pulls in history.js. It edits turn-loop.ts (D2's no-edit list, A11) and engine.ts a second time after ABC-170. It adds a clause-1 production module, and it is fragile against the next type-only import.
   - (c1) noResolve: measured exit 2.
   - (c2) a post-build prune: a second build step and a list that rots. It changes Scope 6 edit 3's pinned build value. It is gold plate for 43 KB of inert, git-ignored files.
   - (c3) a per-file transpile through the TS API: new build tooling (Alt 18).
4. **Cost.**
   - Core-unchanged: none, because no src/ file moves.
   - ADR-0011: clause 4 holds; clauses 1 and 3 are over src/, not dist/.
   - ADR-0036 (b1): it reads the src diff, which is unchanged.
   - UAT A8–A10: the same loaded code.
   - Revisit trigger: npm publish, or any packaging of dist/ for third parties (ADR-0018).
5. **ABC-172 is not affected.** It changes only the package name. The existing rebase note on the shared package.json (Dependencies) stands.
6. **The SE may resume from the WIP patch as it stands.** It already has "include": []. Restarting waits for BA/PM's amendment of the page and M9. The owner's confirmation of the M9 rewording gates QE/UAT reading A7, not development.
