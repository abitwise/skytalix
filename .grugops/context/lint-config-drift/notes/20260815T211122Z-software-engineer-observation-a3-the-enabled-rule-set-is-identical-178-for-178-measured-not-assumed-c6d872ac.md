---
id: 20260815T211122Z-software-engineer-observation-a3-the-enabled-rule-set-is-identical-178-for-178-measured-not-assumed-c6d872ac
kind: observation
by: software-engineer
at: 2026-08-15T21:11:22Z
verified_by: 
confidence: high
refs:
  - biome.json
  - lint-config-drift
  - A3
supersedes: 
---

# A3 — the rule set did NOT silently change. 178 rules before, the same 178 after.

**Answer: IDENTICAL, measured.** Not `UNKNOWN - verify`. A 2.5.5 command does report the enabled
set, it was found, and it was checked against a control before its verdict was believed.

`recommended: true` → `preset: "recommended"` is a rule-set edit wearing a rename's clothes, so the
enabled set was enumerated **before** the diff and **after** it and the two lists diffed.

## The instrument: `biome rage --linter`

It prints a `Linter:` block containing an explicit `Enabled rules:` enumeration, one rule per line,
`group/ruleName`. Captured both sides with `--colors=off`, extracted the block, `sort`ed, `diff`ed:

```
BEFORE enabled rule count: 178
AFTER  enabled rule count: 178
diff rules-before.txt rules-after.txt  ->  no output.  IDENTICAL - zero differences
```

**Zero lines differ.** Not "same count" — same names.

## The instrument was validated before its answer was trusted

A zero diff is worthless if the instrument ignores the config and prints a constant. So it was fed a
control: a scratch config (outside the repo, via `--config-path`) carrying
`preset: "recommended"` plus `correctness.noUnusedVariables: "off"`. Result: **177 rules, and the
diff against the real config is exactly one line — `correctness/noUnusedVariables` removed.**

The enumeration therefore tracks the configuration. The 178-for-178 zero diff is a measurement, not
a constant echoed back.

## One line in the rage output DOES change, and it is not what it looks like

```
  Recommended:                  true      (before)
  Recommended:                  unset     (after)
```

Read this as **the deprecated field's own reporting slot going empty**, not as recommended rules
being switched off. `rage` prints the `linter.rules.recommended` key's literal value; after the
migration that key no longer exists, because its value moved to `preset`. The proof that nothing was
disabled is the enumeration printed **immediately below that line, which is byte-identical on both
sides.** Anyone re-reading this later and reaching for the alarm should diff the rule list, not the
`Recommended:` line.

## What else was tried, and what it actually reports

Recorded so the next person does not re-derive it:

- **`biome rage --linter`** — **this is the one.** Enumerates the enabled set explicitly.
- **`biome lint --profile-rules .`** — a *behavioural* second opinion: prints per-rule execution
  time and an invocation `count` for the rules that actually RAN over the corpus. Useful, but it
  reports the rules that fired on these files, not the configured set, so it under-reports rules that
  had no applicable node. Not used as the A3 answer.
- **`biome explain NAME`** — takes a single positional name and shows documentation for it. It is a
  docs lookup for one rule. It does **not** enumerate the enabled set. (The subtask named
  `biome explain` as a candidate; this is the honest result of trying it.)
- **`biome check --verbose`** — `--verbose` "print[s] out what files were processed and which ones
  were modified". Files, not rules. Does not enumerate the rule set.

## Honest limit on the claim

`rage`'s enumeration is the configured analyzer rule set, and it includes `a11y/*`, `security/*` and
GraphQL rules that cannot fire on a TypeScript chess engine with no DOM. That does not weaken the
comparison — the same instrument answered the same question on both sides of the diff — but the
sentence this note supports is precisely *"the enabled set is unchanged"*, not *"every rule in it is
reachable in this codebase."*

The behavioural ground truth agrees: `biome check .` emitted **zero** source diagnostics before the
diff and **zero** after, over the identical 54-file corpus.
