---
id: 20260817T160600Z-software-engineer-decision-the-401-anchor-resolved-by-reading-history-and-why-a3-needed-an-absence-assertion-10598df3
kind: decision
by: software-engineer
at: 2026-08-17T16:06:00Z
verified_by:
confidence: high
refs:
  - ABC-063
  - ABC-062
  - src/cli.test.ts
  - src/cli-options.ts
  - plans/tickets/ABC-063-uat16-six-game-verbs-named-in-no-test.md
  - 56c5cea
  - 1b4c4bd
supersedes:
---

# Two decisions this hop had to take: what `:401` meant, and what `A3` actually costs

## 1. `:401` — RESOLVED to `:554`, by reading it, not by guessing

The Orchestrator recorded `:401` **UNRESOLVED** rather than fill the gap from memory, naming the
`ABC-062` hop's invented anchor as the error not to repeat. I did not guess either. Method, so it can
be checked:

1. The page cites five anchors. Four are known: `:353`, `:372`, `:477`, `:780`. **A correct set of
   anchors must all hold in ONE revision of the file** — the revision the page was cut against.
2. `git log -- src/cli.test.ts` lists ten revisions. I printed lines 353, 372, 477 and 780 of each.
   **Exactly one revision has all four**: **`56c5cea`** (`test(ABC-042): grug walk every index, and
   grug pin both number`) — `:353` the enumeration/table equality, `:372` the only-argv-literal row,
   `:477` the 1000-token sweep, `:780` `expect(spawned).toBe(10)`. Every other revision misses on at
   least one. `56c5cea` is the cutting-hop tree.
3. `56c5cea:401` reads:
   `it("A6(i) — the near-miss family, COMPLETE OVER POSITION, is rejected in its legal position", …`
4. That test is **`src/cli.test.ts:554` today**, first-hand.

**Two independent confirmations.** The brief's own fence says *"Do not touch `:435`, `:525`, `:630`
**or the near-miss family**"* — enumerating the near-miss family exactly where the page's fourth
byte-identical anchor sits. And the Orchestrator's note records the `ABC-062` error as
"`:410` asserted where **`:554`** was meant" — the same referent, reached by a different route.

**Confidence: high.** Recorded as resolved, and the page's out-of-scope bullet now reads
`:435`, `:525`, `:554`, `:630`.

**A sixth stale anchor the review's table did not carry.** The page's `N8-LANE` bullet also cites
`:247` and `:477`. `56c5cea:247` is `A4 — --colour random resolves to white or black 1000 times,
with zero spawns`, today **`:329`**. Corrected in `1b4c4bd` along with the rest, so seven anchors
moved in total, not five.

## 2. `A3` needed an assertion the ticket page did not describe — and here is why

**The finding.** `A3` says: add any of the six to `ACCEPTED_ARGUMENTS` and the suite reds *here and
at `:435`*. A block that only calls `resolveOptions` on the six and asserts refusal **does not red**
under that mutant. `src/cli-options.ts:55` destructures the enumeration **positionally**:

```ts
const [ASCII, UNICODE, COLOUR, WHITE, BLACK, RANDOM] = ACCEPTED_ARGUMENTS;
```

and every membership test is exact equality against those six *names*. A seventh element **appended**
to `ACCEPTED_ARGUMENTS` binds to nothing, so the resolver still lands `--resign` in the default
branch and still rejects it. Only `:435`'s element-for-element equality would red. `A3`'s "here" half
would be false — a criterion satisfied on paper and vacuous in fact.

**The decision.** The block additionally asserts each of the six tokens is **not in
`ACCEPTED_ARGUMENTS`**. Measured: with `"--resign"` appended, the block reds at `:1270` **and**
`:435` reds at `:436`; reverted, 865/865 green.

**Why this is not scope creep.** It adds no case, no file, no production line and no child process;
the list is still exactly six and the assertion is derived from that same six-entry list. It is the
minimum that makes a stated criterion true. I flagged rather than bent it: had I written only the
rejection loop I would have reported `A3` met while the mutant sat green here.

**Rejected alternative:** mutate by *inserting* a verb at the front of `ACCEPTED_ARGUMENTS`, which
shifts the destructuring and reds the block indirectly. Rejected — it proves the criterion only for
one of the two ways a hop could add a word, and the append is the way a hop actually would.

**What `EPIC-006` must know.** `ABC-043`, `ABC-045` and `ABC-046` each make one or more of the six
legal. Each must move **`src/cli.test.ts:1213`'s block and `:435` in the same hop**. That is the
deliberate red this ticket bought; it is written into the block's comment so the next hop finds it
before deciding to delete a row.
