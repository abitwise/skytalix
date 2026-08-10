---
id: 20260810T134758Z-security-nfr-observation-064fdec4
kind: observation
by: security-nfr
at: 2026-08-10T13:47:58Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - ABC-016
  - ABC-017
  - NFR-002
  - ADR-0003
  - ADR-0004
  - src/san.ts
  - plans/nfr-catalog.md
supersedes: 
---

# `N1` is machine-independent and NOT position-independent — measured, and at two positions the ratio falls BELOW its own bar. Plus `NFR-002`'s frame budget re-derived and intact.

## 1. The ratio bar's one unexamined property

The ticket calls `N1` *"the primary bar and the only one that is machine-independent — it is a ratio,
so it survives a hardware change"*. True. BA/PM's decision note adds the reasoning behind the
threshold:

> I set the threshold at 5x against a measured 8.6x deliberately: the ratio varies with the position's
> pawn/piece mix, and a bar with less than ~1.7x of headroom against that variation would fail for the
> wrong reason.

The variation was named and never measured. It is measured here, on the delivered build, protocol A
(a diagnostic — **`N1` is defined at `P60` and only `P60`'s reading is the bar**):

| position | legal moves | pawn share | mean supplied | mean unassisted | **ratio** |
|---|---:|---:|---:|---:|---:|
| `startpos` | 20 | 80.0% | 0.128 | 0.553 | **4.33x** |
| `perft-3` (`8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - -`) | 14 | 28.6% | 0.377 | 1.862 | **4.94x** |
| **`P60` — the bar's position** | 42 | 19.0% | 0.477 | 4.259 | **8.94x** |
| `perft-5` | 44 | 29.5% | 0.166 | 3.573 | **21.51x** |
| `kiwipete` | 48 | 16.7% | 0.181 | 4.468 | **24.65x** |

**The ratio spans 4.33x to 24.65x — a factor of 5.7 — and at two of the five positions it is BELOW
the 5x bar.** The mechanism is exactly the one `ADR-0004` and the Engineer's call-count note describe
and is not a defect: a pawn move never builds a legal list at all, so at the start position (80%
pawns) the unassisted form is barely more expensive than the supplied one and there is almost nothing
for the optional parameter to save.

**`N1` is MET — 8.94x at `P60` against ≥ 5x, 1.79x of headroom.** What is refuted is only the implied
generality: the ~1.7x margin is adequate against *run-to-run* variation, not against *position*
variation, and the bar is safe because it pins its position, not because the ratio is stable.

## 2. `NFR-002`'s frame budget — re-derived independently, and intact

The most expensive item in a frame is this module, and `ABC-016` / `ABC-017` will consume it. Own
harness, own deterministic random-legal game (mulberry32), replay from `startpos` with `toSan` per
ply, 11 rounds / median, two samples:

```
40 plies,  full history render     107.9 / 106.1 µs    0.67% of a 16 ms frame
120 plies, full history render     416.5 / 410.5 µs    2.60% / 2.57% of a 16 ms frame
```

The ticket records 180 / 182 µs at 40 plies and 395 / 392 µs at 120 (2.5%); `ADR-0004` published
171 / 176 and 517 / 533 (3.3%). **This gate's 120-ply figure reproduces the ticket's to within 5% and
sits inside `ADR-0004`'s band.** The 40-ply figure reads lower (108 against 180) because it is a
different game with a different check density — the same population effect the bars themselves are
about, and it is not attributed further.

The catalog's 2026-07-30 correction bounds the SAN pane to **8 move pairs (16 plies)** and makes the
frame `O(window)`. Measured on that shape at a 71-ply game: **90.9 / 90.7 µs, 0.57% of a frame** — and
it is dominated by the REPLAY (71 `makeMove`s to reach the window), not by the 16 SAN renders, which
is worth knowing before anyone optimises the wrong half.

**A worst-case ceiling, LABELLED ARITHMETIC and not a measurement:** if every one of 120 plies were as
expensive as the worst single move measured anywhere here (10.35 µs at `P60`), a full unbounded
history render would cost **1.24 ms = 7.8% of a 16 ms frame**, ~12.9x of headroom. `ADR-0003`'s
published `legalMoves` range (1.8–5.4 µs) bounds the per-move worst at roughly 2 × 5.4 + string work
≈ 11 µs, so that ceiling is not obviously beatable by a nastier position. **`NFR-002` is intact with
room for `ABC-016` and `ABC-017` to spend.**

## 3. Do QE's five criteria gaps bear on this gate? **No — checked rather than assumed.**

The five surviving mutants are all over-qualified disambiguation (`Ra1b1` for `Rab1`). Weighed here
because the subtask asked for them to be weighed and not inherited:

- **Security: no bearing.** An over-qualified string is longer by at most two characters and stays
  inside the 7-character bound and the printable-ASCII set measured in the security note.
- **NFR: no bearing on `N1`–`N4`.** Over-qualification changes which branch of the qualifier ladder
  returns, not whether a legal list is built — the call counts, and therefore the ratio, are
  identical. A full-square-always build would pass all four bars.
- **The one place it does bear is a PRODUCT property**, which QE already routed to `ABC-016` /
  `ABC-017`: a history pane full of `Ra1b1` is a readability defect. That is not this gate's call and
  is not re-opened here.

**They do not block, they do not soften, and they do not change one figure in this gate.**

## What this note does NOT establish

- **That the ratio's floor is 4.33x.** Five positions is a sample, not a bound; a position with more
  pawns and no checks would read lower still. Nothing here searches for the minimum.
- **`NFR-002`'s WRITE half, or any renderer figure.** No renderer exists that calls `toSan`; the
  numbers above are the SAN compute component alone and the write half remains `ABC-018`'s, already
  measured at its own gate.
- **Any of it on other hardware.** Apple M3 / Node v24.12.0 / darwin-arm64; `UNKNOWN - verify`
  elsewhere.
