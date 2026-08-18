---
id: 20260818T202500Z-software-engineer-observation-g4-unreadable-is-not-dead-code-it-was-pinned-to-nothing-9d4e77b1
kind: observation
by: software-engineer
at: 2026-08-18T20:25:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - src/move-input.ts
  - src/move-input.test.ts
supersedes:
---

# `G4`: `unreadable` is produced by most rejections. The code was never dead — it was asserted nowhere

The brief put the question sharply: find the input that produces `unreadable` and assert it exactly,
**or** say plainly that no input can, because then the code is dead and that is a finding about the
design. **The first is true**, and it is worth being precise, because "a reason code that no input
can produce" is a much larger claim than what M6 actually demonstrates.

M6 shows the reason code is **not asserted**. It does not show it is **not produced**. Measured
directly against the delivered module at `8c84265`, from the start position:

| line | `resolveMoveInput` | coordinate reader | SAN reader |
|---|---|---|---|
| `hello` | `rejected ["unreadable"]` | `unreadable` | `unreadable` |
| `e9e9` | `rejected ["unreadable"]` | `unreadable` | `unreadable` |
| `Qz9` | `rejected ["unreadable"]` | `unreadable` | `unreadable` |
| `""` | `rejected ["unreadable"]` | `unreadable` | `unreadable` |
| `"   "` | `rejected ["unreadable"]` | `unreadable` | `unreadable` |
| `!!!` / `1234` / `zzzz` | `rejected ["unreadable"]` | `unreadable` | `unreadable` |
| `e2e5` | `rejected ["no-such-move"]` | **`no-such-move`** | `unreadable` |

**Every one of `A6`'s own five rows produces `unreadable`** — the exact rows whose assertion accepted
either code. The permissive `stringMatching(/^(unreadable|no-such-move)$/)` was pinning the real
property "a code, not display copy" while accidentally unpinning the code itself, which is why M6
(always `no-such-move`) passed all 40 tests while M7 (always `unreadable`) died on the single `e2e5`
row. The precedence rule was asserted in one direction only, exactly as QE said.

## The repair

`A6`'s loop is now a table where each row names the code it expects, `e2e5` included as the sixth
row. The permissive regex is gone — nothing weaker replaced it, and the "code, not prose" property
is strictly stronger now that the code is an exact string.

**M6 now reds 5 tests** (the five unreadable rows). M7's direction was already covered and still is.
The precedence `no-such-move` outranks `unreadable` is now asserted in both directions: inverting it
was caught before, collapsing it is caught now.

**No design finding here.** The code is live, reachable by the most ordinary bad input there is, and
nothing about it needs redesigning. This was a test gap and only a test gap.
