---
id: 20260819T142000Z-qe-e2e-observation-abc037-qe-mutants-and-edge-probes-a5e6f7b8
kind: observation
by: qe-e2e
at: 2026-08-19T14:20:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - src/line-input.ts
  - src/line-input.test.ts
supersedes:
---

# QE mutant ledger — 11 mutants of my own, and the edge probes behind `G3`–`G6`

Every mutant is a DIFF applied to `src/line-input.ts`, run, then the tree restored and **verified by
md5 against `git show HEAD:src/line-input.ts`** — `2428f654f694b87a8e22ec199c01dcde` after every one.
Two of the engineer's (`M6`, `M6b`) were re-run to check their classification; the other nine are new.

## Ledger

| id | diff | lane | result |
|---|---|---|---|
| `M6` | drop `pending = ""` (re-run) | deep | **SURVIVES 26/26** — confirms the engineer. Retention 2.00 MiB = one chunk |
| `M6b` | drop `if (overlong) return;` (re-run) | deep | **SURVIVES 26/26** — confirms. Retention 0.00 MiB |
| `M6c` | drop both (re-run) | deep | **SURVIVES 26/26** — confirms. Retention **32.00 MiB**. KILLABLE — see the `M6c` note |
| `Q1` | obfuscated, CALL-time-bound `process.stdout.write` | deep | **1 red** — layer 1's spy, the layer called "not load-bearing" |
| `Q1b` | obfuscated, **LOAD**-time-bound `process.stdout.write` | full gate | **SURVIVES** — 26/26, 1175/1175, lint 0, typecheck 0. `G2` |
| `Q2` | plain-spelled load-time-bound `process.stdout.write` | deep | **1 red** — the token scan **only**; the `A6` spy row PASSED it |
| `Q3` | `fs.writeSync` via obfuscated import, `writeSync` spelled plainly | deep | **1 red** — the token scan |
| `Q3b` | the same with `m["write" + "Sync"]` | deep | **SURVIVES 26/26** — `G2`'s other half |
| `M-QE1` | `decoder.decode(chunk)` — drop `{ stream: true }` | deep | **SURVIVES 26/26**. `G4` |
| `M-QE2` | never `source.off("data", onData)` in `deliver` | deep | **1 red** — *deep lane only*. `G5` |
| `M-QE3` | check `ended` BEFORE `queued.shift()` in `readLine` | deep | **1 red** — *deep lane only*. `G5` |

## `G4` — the streaming decoder is a deliberate choice with no guard

`M-QE1` passes every one of the 26 tests. What it breaks:

```
delivered:  a UTF-8 "é" split across two chunks  ->  resolvers see "é4"
M-QE1:      the same input                       ->  resolvers see "��4"
```

`{ stream: true }` is what carries a partial multibyte sequence across a chunk boundary, and
`process.stdin` splits on 64 KiB reads, so this is reachable in production the moment a non-ASCII
character lands on a boundary. The suite's chunk-permutation sweep splits **strings**, never bytes, so
it cannot reach this. Impact for chess SAN is nil (ASCII), which is why I rate it **LOW** — but the
delivered code went out of its way to be correct here and nothing holds it there.

## `G5` — the deep lane is not "breadth only". It is load-bearing.

Both `M-QE2` and `M-QE3` are **green in the default lane and red only under `INPUT_DEEP=1`**, on the
`reads the same three lines however the chunk boundaries fall` row.

- `M-QE2` leaks a `data` listener on every read — the module's header says the listener is attached
  per read for a reason, and after N reads the source carries N listeners.
- `M-QE3` makes EOF outrank the queued surplus, so lines already parsed out of a chunk are thrown away
  the moment the stream ends.

Both are real defect classes. The test-file header and `AGENTS.md` both say the deep lane "holds the
BREADTH only" and that "every ACCEPTANCE criterion is answered in the default lane" — **both those
statements are true**, and the inference a reader will draw from them (that the deep lane adds no
protection) is false. `AGENTS.md`'s *"Run it after any change to `src/line-input.ts`"* is therefore
the right instruction and is now backed by two measured kills rather than by caution.

## `G6` — two overlapping reads orphan the first one, forever

```
const first  = seam(history);
const second = seam(history);          // overwrites `waiting`
source.write("e4\nNf3\n");
first  -> never settles
second -> resolves
```

`waiting` is a single slot and `deliver` reads it once. `runTurnLoop` awaits the seam before calling
it again, so this cannot happen through the merged loop today — but `createLineInputSeam` is an
exported production factory, `EPIC-006` wires it at startup, and **the single-caller precondition is
written down in neither the module header nor the suite nor the notes**. Cheap to close either with a
line in the header or with a row that asserts the second call is refused. **LOW.**

## Edge probes — what else I drove through the delivered build

All against the real seam, all passing except where noted:

| probe | result |
|---|---|
| a multibyte character split across two chunks | **correct** (`é4`) — but unguarded, see `G4` |
| a lone `\r` (classic Mac) | correctly NOT a terminator; the read waits for `\n` or EOF |
| a source that had ALREADY ended before the seam was built | **`eof`** — the `source.readableEnded === true` arm works |
| three reads after `end()` on a one-line stream | `move`, `eof`, `eof` — **EOF is sticky** |
| a single chunk carrying 500 lines | first read resolves `move`; the surplus queues and serves in order |
| an empty line (bare Enter) | `{ kind: "rejected", messages: ["unreadable"] }` |
| `"z" x 1024 + "\r\n"` | **rejected `line too long`** — `G3` |

**The empty line is worth a sentence and no more.** Pressing Enter at the prompt tells the player
"unreadable". That classification is `src/move-input.ts:191`'s, it is merged and gated, and I am
fenced from re-opening `ABC-033`/`ABC-035`. Recorded here because `ABC-037` is what makes it a thing a
player can actually do, and because it is the first keystroke a new player is likely to try. It is a
UX observation for whoever owns the prompt's copy, not a defect of this ticket.
