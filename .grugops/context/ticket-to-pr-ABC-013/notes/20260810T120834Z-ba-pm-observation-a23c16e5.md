---
id: 20260810T120834Z-ba-pm-observation-a23c16e5
kind: observation
by: ba-pm
at: 2026-08-10T12:08:34Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - ABC-022
  - ABC-023
  - plans/tickets/ABC-013-san-rendering.md
supersedes: 
---

# Fifteen builds scored: NINE wrong ones passed all thirteen criteria as written, and the pre-check's own `Pe4` lead was confirmed with the WRONG mechanism

The pre-check named its `Pe4` consequence *"a LEAD, not a finding … I ran no mutant. I did not build
this. BA/PM must measure it rather than inherit my reading of it."* This note is that measurement,
widened to the whole table.

## Method, and the one ordering fact that makes it honest

1. **The oracle was typed first.** 52 rows over 18 FENs, every expected string typed by hand from
   its FEN. Stamped before any implementation existed anywhere in the harness:
   `md5 56d56506fcf89de10d79c5774e2a630c`, `2026-08-10T11:51:22Z` (local `14:51:22`, UTC+3).
2. **Then** a reference `toSan` and 14 mutants were written (`builds.ts`), and each was scored.
   Nothing in the harness ever supplied an expected value; the reference is scored *against* the
   hand-typed table like every mutant.
3. Every build is scored twice: against **the ticket's thirteen criteria as written**, and against
   the repaired table. The thirteen are instantiated **charitably** — each prose criterion is handed
   the best FEN that can be built for it, which is strictly more than an engineer holding only the
   ticket would have had. `C7`/`C8`/`C9` are scored as the suffix-shape predicates they literally
   are, not as whole strings.
4. All moves come from `legalMoves(position)`, selected by `(from, to, promotion)`, and the selector
   asserts it matched **exactly one** move before scoring. Read-only against merged `src/`.

## Result

**The reference build passes both sets** — all 13 criteria and all 52 rows. Two independently
produced things agreeing (a hand-typed table and a from-scratch implementation) is corroboration of
the table's internal consistency; it is **not** proof that the table matches the SAN standard, which
no instrument in this repository can supply. Recorded as a `claim`, separately.

**NINE wrong builds pass all thirteen criteria as written and die only on the repaired table:**

| build | what it emits | rows red on the repaired table | now killed by |
|---|---|---:|---|
| rank before file | `N1c3` / `N5c3` | 2 | `A4` |
| rivals from the pseudo-legal list | `Nge4` with a PINNED rival | 1 | `A7` |
| rivals not filtered by piece type | `Nbd2`, `Rhf1`, `Ngf3`, … | 12 | `A8` |
| `#` on "no reply" without "in check" | `Qg6#` on a **stalemate** | 1 | `A17` |
| capture decided by `board[move.to]` | `d6` for an en-passant capture | 1 | `A10` |
| `x` for pawn captures only | `Ne5`, `Ra8+` | 2 | `A11`, `A3` |
| castle returns before the suffix | `O-O`, `O-O-O` where the rook checks | 2 | `A16` |
| wrong `K` letter | `Md2`, `Mf2` | 2 | `A2` |
| `P` on a quiet push, promotion branch separate | `Pe4`, `Pd3`, `Pe5`, `Pe6` | 4 | `A1` |

**Five wrong builds were already killed by the ticket as written**, and that is recorded too rather
than only the failures: zeros for castling (`C1`), full-square-always (`C2`,`C3`), promotion piece
after the suffix (`C9`), the suffix computed for the mover's own king (`C7`,`C8`,`C9`), and a wrong
**bishop** letter (`C6` — because `e8=B` is a promotion, so `B` is pinned indirectly where `K` is
not).

## The correction to the inherited lead — confirmed, but not as described

The pre-check's mutant was *"a build that emitted `Pe4` for a quiet pawn push"*, expected to pass all
thirteen. **Measured: it FAILS `C6`.** A build that prefixes `P` to every quiet pawn move also emits
`Pe8=Q`, `Pe8=R`, `Pe8=B`, `Pe8=N` — a promotion push is a quiet pawn move — and the promotion
criterion kills it on eight rows.

The build that actually survives is narrower: `P` on a quiet push, with the **promotion branch
written separately and correctly**. That shape is at least as plausible as the described one (the
promotion arm is a separate branch in every implementation of this grammar), so **the gap is real
and the lead was right**; only its witness was wrong. Recorded because "confirmed" and "confirmed as
described" are different verdicts, and this board's documented failure mode is inheriting a
mechanism instead of measuring it.

## One gap I found in my OWN repaired table, before it became a criterion

The first version of the repaired table did **not** kill the rank-before-file build: the ticket's
knight pair (`b1`+`d1`) stands on the **same rank**, so the rank could never have separated them and
a rank-first build reaches the same answer by a different route. It was invisible until the mutant
ran. `P-FILE-PREC` (`b1`+`d5` — different file *and* rank) was added for exactly that, and it is
what `A4`'s second pair is for. The ticket's own Test notes call disambiguation *"where the bugs
are, in both directions"*; the criterion that was supposed to protect that could not see one of the
two directions.
