---
id: 20260821T122500Z-qe-e2e-observation-five-mutants-say-the-new-derivation-weakens-nothing-and-adds-one-13d0dd9e
kind: observation
by: qe-e2e
at: 2026-08-21T12:25:00Z
verified_by:
confidence: high
refs:
  - G-QE115-5
  - ABC-066
  - A1
  - A2
  - A4
supersedes:
---

# FIVE MUTANTS, BOTH DERIVATIONS, SAME TREE: THE NEW ONE LOSES NOTHING AND CATCHES ONE MORE

**The fence I had to discharge was "weaken nothing", and an argument is not a discharge.** So I built
mutants and ran the OLD derivation (`main` @ `e4a5c48`) and the NEW one against each, in the same
copied tree, and read both.

**The recorded copied-tree trap was honoured** (`…2b6f4c18`, BA/PM, today): the copy carries `src/`,
`AGENTS.md`, the configs and the lockfile, and I established it **GREEN at 61/61 on `src/cli.test.ts`
before a single token was mutated**. Every mutant was applied to that tree and reverted after, and
the tree was re-baselined green at the end. **No mutant was ever applied inside the git worktree** —
same reason BA/PM gave: a mutant in a worktree is one `git add -A` from being committed.

| # | mutant (production) | OLD derivation | NEW derivation |
| --- | --- | --- | --- |
| `M1` | `USAGE` loses the `-- ` separator (`ABC-066` `A4`'s named regression) | **RED** | **RED** |
| `M2` | `USAGE_EXIT_CODE` `1` → `0` | **RED** | **RED** |
| `M3` | resolver's default branch accepts every token | **RED** | **RED** |
| `M4` | `--ascii` becomes a refused token | **RED** (at `A2`) | **RED** (at the count, `11`) |
| `M5` | **the crash path prints the usage line too** | **GREEN** | **RED** |

**`M2` is the one that would have exposed a weakening and it does not.** The old filter *selected* on
non-zero, so a build that refused with exit `0` emptied the set and redded the count. The new one
selects on the resolver, so it had to keep that reach as an **assertion** — it does, and it reds with
a better message: *`refused ["--ascii","--unicode"] exit status: expected +0 not to be +0`* against
the old *`expected [] to have a length of 6`*. Same red, names the argv.

**`M3` answers the circularity question in the direction that matters.** The new derivation reads
`resolveOptions`, and `A2` reads it too — so I checked it cannot be self-satisfying. A resolver that
accepts everything **empties** the set (`3` survive, from `--colour`'s own missing-value branch) and
reds; one that refuses everything fills it with all 24 and reds. `A2` reads the same function in the
**opposite** direction over **different** inputs. Neither row can be made green by the other's
mutation.

**`M5` is the new capability, and it is the point.** A build that starts advertising the usage line
from a **crashed session** was **invisible to the old row** — it passed, 1 passed / 60 skipped. The
new converse assertion reds it, naming the offender: *`children advertising the separator from
outside the refusal set: expected [ [ '--colour', 'white' ] ] to deeply equal []`*.

**Zero assertions deleted, zero loosened.** `git diff --numstat`: `105 / 18` on `src/cli.test.ts`
alone. The 18 removed lines are the old filter's three code lines and its stale comment block; the
filter's two clauses are both **still present, as assertions over the derived set**, now read through
a wrapper-transparent status. Test count is **unchanged** (1213) because the additions live inside
the existing `it`, and `spawned` is **unchanged at 24** — no child added, no `spawnSync` call site
added, every spawn string byte-identical.
