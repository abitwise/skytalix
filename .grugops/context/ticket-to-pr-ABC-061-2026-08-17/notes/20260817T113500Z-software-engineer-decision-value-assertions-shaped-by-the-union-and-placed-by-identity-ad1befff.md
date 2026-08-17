---
id: 20260817T113500Z-software-engineer-decision-value-assertions-shaped-by-the-union-and-placed-by-identity-ad1befff
kind: decision
by: software-engineer
at: 2026-08-17T11:35:00Z
verified_by: 
confidence: high
refs:
  - src/cli.test.ts
  - src/cli-options.ts
  - plans/tickets/ABC-061-resolver-accepting-path-asserts-only-ok.md
supersedes: 
---

# How the six argvs were pinned, and why the guard sits where it sits

Five choices, each one constrained by something already recorded rather than invented here.

**1. The comparison is against `.options`, not the resolution.** The Orchestrator's `G-F` is the
reason this ticket is satisfiable: `Resolution` is a discriminated union
(`src/cli-options.ts:88`–`90`), so "the whole resolved options object" is the union's payload. A
top-level whole-object comparison would fold `ok: true` into the expectation and assert something
weaker than the criterion asks. Each row narrows with `if (!resolution.ok) throw` — a `.ok` GUARD
that makes the type available, not a `.ok` ASSERTION, which is the thing this ticket exists to stop
being the whole test.

**2. Two blocks, not one: five deterministic argvs and `random` apart.** `--colour random`'s
expectation cannot live in a static table, and folding it in would have forced the other five through
a branch they do not need. `ABC-061 A2` holds the five; `ABC-061 A3` holds `random`.

**3. `random`'s expectation table is the TEST'S OWN; only which row applies is read off the build.**
`colour` is asserted ∈ `{white, black}` first, then the whole object is compared against the pairing
row for the colour that landed. Reading `orientation` or `flags` off the resolution would have been a
tautology; reading only WHICH SIDE the coin fell on is what "whichever side the coin lands" means.
One call, no seeding, no 1000 iterations — Test note 3.

**4. The blocks are placed BY IDENTITY, immediately after the
`it("A6(i) — every documented spelling resolves in its legal argv position")` block, inside the
existing `describe("ABC-042 — the accepted set is closed")`, and named with their own ticket id.**
`A5`'s line number (`:359`) points at an unrelated frame-region line today (`G-B`), so the number was
not used for anything. Placing them in the same `describe` rather than a new one follows the
precedent already merged in this file: `ABC-071` and `ABC-067` both added their own named `it` blocks
inside `ABC-065`'s `describe`. A reader tells the tickets apart by the `it` name, which is the file's
existing convention.

**5. `toEqual`, not `toStrictEqual`.** `toStrictEqual` is the stronger assertion, but no file in
`src/` uses it and coding rule 11 says match existing style. `toEqual` still reds on a changed field
value, a missing field, and an added field with a defined value — which is the case Test note 2
names. Recorded as a deliberate trade, not an oversight.

**One import line changed:** `type ResolvedOptions` added to the existing `./cli-options.ts` import,
so the expectation tables are typed by the delivered interface rather than by a hand-copied shape. It
is the only line in the diff that is not new.

**What I deliberately did NOT do**, each fenced by `## Out of scope` or by the subtask: no pty check,
no `--ascii` child (`spawned` stays 10), no assertion about `selectGlyphMode`, no widening to the
`.ok`-only sites `G-C` found at `:904` and `:989`, and no production line.
