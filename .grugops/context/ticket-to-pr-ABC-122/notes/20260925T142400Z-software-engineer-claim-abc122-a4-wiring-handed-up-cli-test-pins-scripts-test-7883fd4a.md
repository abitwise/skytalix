---
id: 20260925T142400Z-software-engineer-claim-abc122-a4-wiring-handed-up-cli-test-pins-scripts-test-7883fd4a
kind: claim
by: software-engineer
at: 2026-09-25T14:24:00Z
verified_by:
confidence: high
refs:
  - ABC-122
  - ABC-042
  - wave-2026-09-25
  - ticket-to-pr-ABC-122
  - src/cli.test.ts
  - package.json
  - AGENTS.md
  - plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md
supersedes:
---

# ABC-122: `A4` is NOT delivered. The `package.json` line is handed up because an existing test pins `scripts.test`. The rest is delivered, and what this hop did not verify is listed

Hand-authored and unsealed. A `claim`: the stop is asserted, and the evidence is in the
observation `3a0e770b`.

## The stop (queue file: "any change needed outside the ticket's Scope — hand up, do not trim or widen")

`A4` requires `package.json`'s `test` script to become
`"node tools/grugops/run-bounded.js 60000 vitest run"`. That line turns **`src/cli.test.ts` "A10 —
package.json gains exactly one scripts key and nothing else"** red (ABC-042; `SCRIPTS_AT_HEAD`
at `src/cli.test.ts:1659–1669` pins `test: "vitest run"`). Making it green means editing
`src/cli.test.ts:1661`. **`A11` fences `src/` to `search.ts`, `engine.ts` and this ticket's new
test files.** `A10` also requires the existing suite green "at the same test results". The ticket
cannot satisfy `A4` and `A11` together as written, so the line was **not committed**.
`package.json` is byte-identical to `66a45d1`.

**The ready patch: two lines, both measured with the patch applied and then reverted.**
- `package.json`: `"test": "vitest run"` → `"test": "node tools/grugops/run-bounded.js 60000 vitest run"`.
- `src/cli.test.ts:1661`: `test: "vitest run",` → `test: "node tools/grugops/run-bounded.js 60000 vitest run",`.
- **Reading with both applied:** `npm test` gave exit 0, 47 files, 1446 tests. With the root depth
  guard reverted it gave exit 124 at 60.23 s. Arguments forwarded.

**Options for the Orchestrator (BA/PM owns the page):**
- (a) Widen `A11` by that one line of `src/cli.test.ts`. It is a pin update, not a behaviour
  change, and the row still pins every key. This is the smallest change.
- (b) Re-cut `A4` into its own follow-up.
- Not recommended: adding a second script (for example `test:bounded`). That also reds the same
  row (`added` must equal `["chess"]`), and it leaves `npm test` unbounded, which is the gap K4
  exists to close.

## Also handed up / owed, not written here (fenced)

- **`AGENTS.md` `### Test`**: owed to the Scribe once `A4` lands, as the page says. Add:
  - the wrapper;
  - exit 124;
  - the bound, 60 s;
  - `node tools/grugops/run-bounded.proof.js` as the wrapper's own check;
  - that the `*_DEEP` lanes must NOT be run via `npm test`, because `ENGINE_DEEP` is ~98.7 s,
    over the bound.
- **Board**: not touched (fenced). This hop recommends `ABC-122` **stay `In Development`**
  pending the `A4` ruling, not `In Review`, because one criterion is unmet by a stop.
- **`lane-inventory.js` is red at this tree and, by inference, at base**, on
  `.grugops/context/ruling-abc079-oracle/probe/vt/oracle.test.ts`. That is not this ticket's.
  It is named so the next gate does not attribute it here.
- **UAT waiver input**: `src/` production lines in the delivered diff = **0**. The page expected
  > 0. `package.json` / `tools/` are outside the waiver's `^src/` grep. That is the
  Orchestrator's to read against the 2026-08-17 rule.

## Not verified by this hop (`UNKNOWN - verify`)

- Windows: the `child.kill` fallback was never run.
- Linux: not run. The same POSIX process-group calls are expected to work, UNVERIFIED.
- `lane-inventory.js` at base: inferred, not run.
- `N8-LANE`: n = 8 under a median load average of 17. The charge's sign is 5/8, so QE or
  Security/NFR should re-read it on a quieter machine.
- Test-first: the capacity rows were written against the existing guards (which were already
  green), so they were not red first. Their red was shown by the six mutants instead. The
  wrapper was built before its proof.
