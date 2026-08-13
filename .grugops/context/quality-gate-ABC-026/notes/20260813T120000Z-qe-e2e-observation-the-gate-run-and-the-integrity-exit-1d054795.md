---
id: 20260813T120000Z-qe-e2e-observation-the-gate-run-and-the-integrity-exit-1d054795
kind: observation
by: qe-e2e
at: 2026-08-13T12:00:00Z
verified_by:
confidence: high
refs:
  - ABC-026
  - quality-gate-ABC-026
  - H2
  - NFR-008
  - vitest.config.ts
  - 06c5427
  - 21f5a12
supersedes:
---

# The gate, run on `grugops/quality-gate-ABC-026` at `21f5a12`. **Four mandatory gates GREEN. Test-integrity exited `2` — COULD NOT RUN, and that is not a pass.**

An `observation`, not a `finding`. **The substrate gap is re-verified rather than inherited — seventh
consecutive hop on this install:** `scripts/` does not exist in this repository, there is no
`context-io.*` and no `claim.*` anywhere in the repository or in the kit at
`/Users/olgeroeselg/.grugops/agent-factory`, and `mcp__grugops__propose_note` is not in this session's
tool set. Workflow 16's stop condition is live, so no `§14-gate` verdict can be emitted and **no note
here is a `finding` and no verification stamp was invented.** The queue claim was taken by hand with an
atomic `mkdirSync(".grugops/queue/claimed/quality-gate-ABC-026")`, `recursive: false`, per Workflow 17
step 2. Owner of the gap: **Orchestrator**.

## The gate

```
npm run lint       exit 0    49 files checked, 2 pre-existing infos (a biome-migrate notice)
npm run typecheck  exit 0
npm run build      exit 0    (tsc --noEmit wearing the build slot's name, as AGENTS.md discloses)
npm test           exit 0    807/807 tests on 28 files
skip count         0         DETERMINED, not assumed, by the AGENTS.md slot command:
                             npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'
```

Commands taken from the root `AGENTS.md` command slots; none invented. `quality.gate_enforcement` is
`blocking`, `self_fix_attempts` is `2` — **zero attempts were consumed, because nothing failed.**

## **Test-integrity exited `2`, and it is recorded as COULD NOT RUN**

```
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
  -> Error: cannot read the registry file: .grugops/test-skips.md
  -> EXIT 2
```

`.grugops/test-skips.md` does not exist. Workflow 05 distinguishes the codes and so does this record:
`0` is a pass, `1` is a test-integrity finding and a **human-only** stop, `2` is *the checker could not
run* — an error distinct from a clean fail, **never read as a pass.** This is `H2`, owned by a **named
human**. `quality.test_integrity` is `warn`.

**I did NOT create `.grugops/test-skips.md`.** The brief forbids it and Workflow 05 forbids it for a
better reason: the agent may not self-author the justification that clears its own gate. **The skip
count is genuinely `0`, so there is nothing for a registry to justify today** — which is exactly why
this is a substrate gap rather than a suite problem, and why exit `2` does not by itself block.

## `PERFT_DEEP` — the RULING, stated because the brief required it stated

**`PERFT_DEEP` was NOT run, and that is a ruling rather than an omission.** The deep lane is the
move-generation oracle. **This diff carries zero `src/` bytes** — re-verified mechanically at this hop,
not inherited: `git diff --numstat 06c5427 HEAD -- src/` is empty, `git status --short -- src/` is
empty, and `src/` is byte-identical to current `main` as well. A diff that cannot reach the rules core
cannot break the rules core, so running a ~37 s opt-in suite to re-confirm a tree `main`'s own gate
already passed would be theatre. **The prior hop's identical ruling is confirmed, by my own check.**

## One fact the gate itself cannot catch, verified rather than repeated

`vitest.config.ts` is outside `tsconfig.json`'s `include` (`src/**`, `spike/**`) and outside
`biome.json`'s `files.includes` (`src/**/*.ts`, `spike/**/*.ts`, `*.json`). **I verified this
directly** rather than trusting the file's own header:

```
npx biome check vitest.config.ts
  -> "These paths were provided but ignored:  - vitest.config.ts"    exit 0
npm run lint -> still 49 files, unchanged by the new file
```

**So the one file this ticket delivered is read by NEITHER `npm run lint` NOR `npm run typecheck`.** A
mistake in it is caught only by `npm test` actually running. The prior hop disclosed this in the file's
own header and declined to fix it; **the disclosure is accurate and the decision to leave repo-wide
tool scope alone is the right call for a ticket that owns no config**. It is recorded here as a gap
with an owner, not as a defect of this hop — see the `artifact-ref` note.
