---
id: 20260812T083900Z-qe-e2e-observation-probe-bars-controls-and-a2-2d8f91a4
kind: observation
by: qe-e2e
at: 2026-08-12T08:39:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ADR-0011
  - NFR-002
  - NFR-008
  - src/history-pane.nfr.test.ts
supersedes:
---

# The probe's own bars — five controls falsified (the record required three), the five reach mutants re-run on both trees, and `A2` beaten harder than the criterion asks

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` `off`.

## 1. Controls — falsifiable, and I falsified two the record did not ask for

`## Security / NFR triggers` requires three controls to stay falsifiable. I ran five, each by
standalone re-execution of the real instrument against a mutated copy, never by reading:

| # | control | required | **measured** |
|---|---|---|---|
| **A** | `FRAME_PRODUCERS = []` → both positive controls must fail | fail | **RED** — `the probe loaded the pane: expected [] to include 'history-pane.ts'` |
| **B** | roots `[]` **and** both positive controls removed → arming must still pass | pass | **green, 8/8** — the arming report is independent of the closure phase, which is what the `?arming` query is for |
| **C** | *(mine)* arming import re-pointed at `san.ts?arming` → the ARMING control must itself fail | fail | **RED** — `the probe is ARMED: expected [ 'san.ts' ] to include 'history.ts'` |
| **D** | *(mine)* dead child (no `module.registerHooks`) must fail LOUDLY | fail loudly | **RED** — `Error: probe child failed (1): node:internal/modules/esm/translators:463 …`, the child's own stderr surfaced |
| **E** | *(mine)* child exits 0 but writes nothing to fd 3 | must not pass | **RED** — `SyntaxError: Unexpected end of JSON input` |

**Control C matters because the record only ever proved the arming control PASSES.** A control that
can only pass is not a control. It fails when disarmed. It is a real control.

**Control D is `A2`'s new non-zero-status check doing exactly the job `## Dependencies` demands** —
*"on an older Node the child throws and the test fails loudly … it must never pass by being unable to
look."* Confirmed: not a skip, not a silent green, and the child's own stderr is in the message.

**Control E is a constructed impossibility and I am recording it as such, not as a defect.** It
produces a wrong-reason red — the message names neither `history.ts` nor the property — but it needs
a child that exits `0` having written nothing, which no code path reaches. **I am not requesting a
fix**: `AGENTS.md` coding rule 8 forbids error handling for cases that cannot occur, and adding a
guard here would be exactly that.

## 2. Determinism — 12 runs, 12 × 8/8, 0 flaky

Re-run on this branch tip. The structural reason is intact and I verified it against the delivered
source rather than the note: **no wall-clock assertion, no concurrency, no ordering dependence, and
no duration compared to anything** anywhere in the probe. The bar `## Security / NFR triggers` sets
(*"12/12 identical after the change"*) is **MET**.

## 3. `## Test notes` 3 — the five reach mutants re-run after the channel change, on BOTH trees

| build | site | `base16` regex / probe | `base17` regex / probe |
|---|---|---|---|
| `WBAREIMP` | pane bare import | green / **RED** | green / **RED** |
| `WDYNIMP` | pane `void import` | green / **RED** | green / **RED** |
| `WQUERY` | pane `void import("./history.ts?v=2")` | green / **RED** | green / **RED** |
| `WREEXPORT` | pane `export { … } from` | green / **RED** | green / **RED** |
| `WINDIRECT` | `glyph-mode.ts` bare import (a ROOT) | green / **RED** | green / **RED** |
| `WTRANSITIVE-SAN` | `san.ts` bare import (in closure, NOT a root) | green / **RED** | green / **RED** |

**All six RED on both trees, with the re-scoped message** — `history.ts was evaluated on the frame
path: expected [ 'frame.ts', 'glyph-mode.ts', …(12) ] to not include 'history.ts'`.

**`## Test notes` 3's correction is confirmed independently**: `san.ts` is the transitive witness (in
the 11-module closure, not a root, RED on both trees) and `glyph-mode.ts` is a **root**, so
`WINDIRECT`'s pull is direct. The note was right to re-point it.

## 4. `A2` — met, and it survives a harder mutant than the criterion names

| build | `base16` | `base17` |
|---|---|---|
| `WSTDOUT` — module-scope `console.log` in `glyph-mode.ts` | **green / green, 8/8** | **green / green, 8/8** |
| `WSTDERR` — module-scope `console.error` | green / green, 8/8 | green / green, 8/8 |
| **`WSTDOUT-JSON`** *(mine)* — a root prints **well-formed JSON** `{"closure":[],"armed":[]}` at import | **green / green, 8/8** | **green / green, 8/8** |

**`WSTDOUT-JSON` is the mutant that matters and the criterion does not name it.** Under the delivered
stdout channel a printing module could not merely corrupt the report — a module printing
*parseable* JSON could have **forged** it, and a forged `{"closure":[],"armed":["history.ts"]}` would
have passed both positive controls vacuously. On fd 3 with the child's stdout discarded, the forgery
channel is gone, not just the corruption channel. **`A2` bought more than it claimed.**

`WSTDERR` still survives on both trees, so nothing over-reached onto stderr — `## Test notes` 4 holds.

## 5. Security posture — checked at source, nothing fired

- `dependencies` is `{}` and unchanged; no network; no file write anywhere in the change.
- The child's argv contains only `file:` URLs computed from `src/` and one `data:` URL built in the
  test. **fd 3 is opened by the parent for the child**; nothing outside the repository can write to it.
- `## Security / NFR triggers`' firing threshold — *"any change that makes the probe's child accept
  input from outside the repository, or that adds a dependency"* — is **not crossed**.

**A Security/NFR gate still fires for this ticket because it wrote a production line
(`src/history-pane.ts:30`).** I am not that gate. What it will need from me is in the `claim` note.
