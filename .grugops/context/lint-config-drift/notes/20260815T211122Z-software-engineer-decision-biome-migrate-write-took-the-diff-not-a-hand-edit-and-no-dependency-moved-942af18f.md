---
id: 20260815T211122Z-software-engineer-decision-biome-migrate-write-took-the-diff-not-a-hand-edit-and-no-dependency-moved-942af18f
kind: decision
by: software-engineer
at: 2026-08-15T21:11:22Z
verified_by: 
confidence: high
refs:
  - biome.json
  - package.json
  - lint-config-drift
  - A5
supersedes: 
---

# Decision: let `biome migrate --write` author the diff, and check its dry run first

**Decision.** The two-line change to `biome.json` was produced by **Biome's own `biome migrate`**,
not typed by hand. `biome migrate` (no `--write`) was run first as a dry run, its proposed diff was
read in full, and only then was `--write` applied.

**Why.** The tool that emitted both diagnostics names its own remedy in its output
(`Run the command biome migrate to migrate the configuration file`). It knows the 2.3.0 → 2.5.5
mapping; a hand edit would be me guessing at it and would risk `preset`'s exact accepted spelling.
Reading the dry run first meant the diff was approved before it existed on disk, rather than
inspected after the fact.

**What the dry run proposed — and it proposed nothing else:**

```
  2 │ - "$schema": "https://biomejs.dev/schemas/2.3.0/schema.json",
  2 │ + "$schema": "https://biomejs.dev/schemas/2.5.5/schema.json",
 15 │ -       "recommended": true
 15 │ +       "preset": "recommended"
```

Two lines. It did **not** touch `files.includes`, the `formatter` block, `linter.enabled`, or any
other key — so the scope fence held without my having to revert anything the tool overreached on.

## The scope fence's tripwire did NOT trip

The fence said: *"Do not upgrade, add or remove a dependency to make this easier. If `biome migrate`
wants a version bump to succeed, stop and report rather than taking it."*

**`biome migrate` asked for no version bump.** It exited `0` on both the dry run and the write, with
`configuration successfully migrated`. `package.json` and `package-lock.json` are **untouched** —
`@biomejs/biome` stays `^2.3.0` in `package.json` and exactly `2.5.5` in the lock. Nothing was
installed, upgraded, added or removed to make this work; the only `npm` command run was `npm ci` in
a fresh worktree, which installs precisely what the committed lock already pins.

So A5's "only if the migration requires it, `package.json`'s biome pin" resolves to: **it did not
require it, so `package.json` is not in the diff.**

## What was deliberately NOT done

- The `^2.3.0` caret in `package.json` was left alone. It now names a version older than the schema
  the config declares, which reads oddly — but changing it is a dependency edit this hop was fenced
  out of, and the caret is doing no harm: the lock pins 2.5.5 and `npm ci` is reproducible. Flagged,
  not fixed (coding rule 12).
- The `formatter` block, `files.includes` and every rule that was not one of the two diagnostics were
  left exactly as found (coding rules 9 and 10). `includes` is still
  `["src/**/*.ts", "spike/**/*.ts", "*.json"]` and the corpus is still **54 files** before and after.
