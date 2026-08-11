---
id: 20260812T174000Z-ba-pm-decision-eight-items-homed-or-refused-9a4d17e5
kind: decision
by: ba-pm
at: 2026-08-12T17:40:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-cut
  - abc017-cut-2026-08-12
  - ABC-017
  - ABC-028
  - ABC-029
  - ABC-019
  - ABC-026
  - ABC-016
  - EPIC-006
  - ADR-0010
  - src/history-pane.ts
  - src/history-pane.nfr.test.ts
  - 20260812T164500Z-qe-e2e-observation-new-criteria-gaps-5e18a3c7
  - 20260812T130000Z-security-nfr-observation-history-cols-re-derived-5d92f6b3
  - 20260812T143500Z-ba-pm-decision-five-gap-rulings-8d2f4b61
supersedes:
---

# The eight items, one by one: SIX homed, ONE refused a home on purpose, ONE ruled and handed back with an owner

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp.

| # | item | disposition |
|---|---|---|
| 1 | `RISK-ABC017-01` — `WCACHE-LEN`, the live trap | **`ABC-028` `A1` + `A2`** |
| 2 | `RISK-ABC017-02` — `WLEAD-ODD` | **`ABC-028` `A3`** |
| 3 | `RISK-ABC017-03` — `A9`'s class surviving `A9` | **`ABC-028` `A4`**, restated once over the graph |
| 4 | `RISK-ABC017-04` — *"production module"* undefined | **`ABC-029` `A1` + `A3`**, with an open design question |
| 5 | `G5` / `AR-4` — the `HISTORY_COLS` self-comparison | **NOT HOMED. Stays unowned, and the reason has not changed** |
| 6 | the stale comment at `src/history-pane.ts:30` | **`ABC-029` `A4`** |
| 7 | `AR-1` / `ABC-010` | **Ruled: `ABC-010` receives HALF. No new ticket; a named amendment with an owner** |
| 8 | the gate that never ran (three items) | **8a → both tickets' NFR triggers; 8b + 8c → `ABC-029` `A2` + `A3`** |

---

## 1 — `RISK-ABC017-01`. Homed, and the TEXT half is ruled WITHOUT touching merged text

**Homed:** `ABC-028` `A1` (freshness across a mutation that does not change `moves.length`) and `A2`
(the freshness guard does not depend on another file's fixtures).

**The consumer path re-measured here, out of tree, on the delivered pane** — third independent
confirmation, and it is `EPIC-006`'s `undo` exactly as the brief says:

```
render 1 (20 plies) last row:        "  37. Nb1            "   moves.length 20
after playMove b8c6:                 "  37. Nb1     Nc6    "   moves.length 21
after takeBack(1) + playMove g8f6:   "  37. Nb1     Nf6    "   moves.length 21
panes 2 and 3 differ: true
```

### The text half — and there is a THIRD option neither the brief nor the precedent offered

The brief asked whether `ABC-016`'s `R1`/`D27` precedent applies (carry it forward) or whether a live
trap earns an exception (edit the merged text), **and to name who applies it if it earns one.**

**First, a correction to how the precedent is characterised, because I read it at source.** The brief
says `R1`/`D27` *"carried a false-vocabulary correction into a later hop rather than editing the
merged ticket."* `R1`'s three sites are all in **`src/status-panel.nfr.test.ts`** — a merged **test
file**, not a ticket. `ABC-016`'s ticket text was never the question, so **`R1` is not a precedent
about editing a merged ticket at all.** What it IS a precedent for is sharp and applies here directly:
*a repair audited on the site it names, not the site it points at* — one of three sites was fixed and
two survived into `main`, with the disposition *"Owner: BA/PM to word, Engineer to apply. Trigger: the
next dev hop opening that file."*

**Second, the ruling. Neither option is best, and the third one is:**

> **`A2` MAKES THE FALSE SENTENCE TRUE rather than correcting it.**

`ABC-017` says *"`A11` may be tidied to per-test fixtures freely and nothing is lost"*, and
`src/history-pane.nfr.test.ts:106-112` says the same. Both are false **only because `A14` does not
catch `WCACHE-LEN`**. `ABC-028` `A1` puts that catch in `src/history-pane.test.ts`, where it does not
depend on the other file's fixtures at all — and the moment it lands, **tidying `A11` really is free
and both sentences are true as written.** No merged ticket is re-opened, no merged sentence is edited,
and the trap is gone rather than annotated.

**That is strictly better than either offered option**, because editing the text would leave
`WCACHE-LEN` uncaught with a more honest comment above it — an accurate description of an
unguarded property.

**Third, the conditional, with the owner named as the brief requires.** Until `ABC-028` lands the
sentence IS false and the invitation IS live. If `ABC-028` is **not** scheduled before the next hop
opens that file, the correction falls due at **three** sites — `ABC-017`'s amendment header,
`ABC-017`'s `A14` block, and `src/history-pane.nfr.test.ts:106-112` — and **it is BA/PM's to author,
because BA/PM wrote the sentence at `refinement-ABC-017-gaps`.** It is **not** the Engineer's and it
is **not** part of `ABC-028`'s dev work: a dev hop editing a `Done` ticket's text is the boundary
confusion this project keeps paying for. **I did not apply it at this hop and the brief forbids me
to.**

**Interim mitigation, stated so it is not mistaken for a fix:** the Orchestrator has put the hazard
into `ABC-019`'s brief. **A brief expires at the end of a hop; the comment does not.** That is the
whole of `ABC-028`'s `P1` argument.

## 2 — `RISK-ABC017-02`. Homed, and the naive criterion would have been VACUOUS

**Homed:** `ABC-028` `A3`, at **21 plies**.

**Witnessed here, out of tree, rather than derived:** the delivered pane at 21 plies renders 8 rows of
21 characters, numbers **30–37**, row 1's white cell `Nc3`, and a **full** last row `37. Nb1 Nc6`.

**And the part nobody had written down.** The obvious criterion — *"eight rows, numbers 30–37, at an
odd length"* — **cannot fail on `WLEAD-ODD`.** Measured: 20 and 21 plies render the **same eight
numbers**, and `WLEAD-ODD` at 21 plies still renders eight rows with those same numbers and a full
last row. **Its only visible defect is row 1's white cell**, which it leaves empty while dropping the
`Nc3` ply off the top. So the white-cell clause is the assertion that reports and the other three are
context. **A criterion that cannot fail on the build it exists to catch is `D22`, which this ticket
has now paid for twice**, and cutting a third would have been this hop's own contribution to the
pattern. It is written into `A3` as a warning at the site.

## 3 — `RISK-ABC017-03`. Homed as ONE criterion, and yes, the pattern needs naming

**Homed:** `ABC-028` `A4` — stated **once over the whole `GameHistory` graph**, not as three more
clauses.

**The pattern, since the brief asked whether three repairs to one criterion is itself a finding.**
**It is, and the honest name is not *"`A9` keeps being wrong"*:**

> **`A9`'s subject is an OBJECT GRAPH, and it has been repaired once per node of that graph.**

`D10`/`D11` moved a snapshot taken too late. `D23` moved fixtures rendered too early. `D26` changed
the *kind* of measurement from a point-pair to an interval instrument — and the Engineer's reading was
that a fourth would not arrive because the kind had changed. **He was right about the kind and the
residual is one of coverage.** `GameHistory` is `{ initialFen, moves, position }` and `position`
carries a `Uint8Array`: **four repairs, four slots.** The pattern **predicts the fifth repair exactly**
— whichever slot the instrument does not reach.

**The consequence is what makes the naming worth anything:** stop repairing per slot. A per-slot
repair is what *guarantees* a fifth. `A4` is therefore written as one statement over every reachable
slot, with the five discriminating builds named so it cannot be satisfied by a subset.

**Two instrument facts measured here, because they decide whether the criterion is even writable:**

| probe | result |
|---|---|
| `Object.freeze(new Uint8Array(8))` | **throws** `TypeError: Cannot freeze array buffer views with elements` |
| `Object.freeze(new Uint8Array(0))` | OK — so the failure is about **elements**, not typed arrays |
| reassigning `history.moves` after `Object.freeze(history.moves)` | **succeeds** — the slot stays writable, which is `WMOVESWAP` mechanically |

**So `D26`'s instrument provably cannot be extended to the graph**, and no replacement has been
demonstrated. That is why `ABC-028`'s DoR item 4 is ❌ rather than ⚠️ — on this family, `D27` set the
bar that *a criterion that cannot discriminate its own guard is not testable*, and I am holding my own
output to it.

## 4 — `RISK-ABC017-04`. Homed, as a definition plus an instrument, NOT as a spike

**Homed:** `ABC-029` `A1` (the two guards agree about their file set, mechanically) and `A3` (the
`perft-bench.ts` ruling), with the definition question flagged for Architect/Design in `ABC-010`'s own
form. Spike considered and refused — reasoning in the shape note.

**Read at source rather than taken from QE:** the regex guard filters
`.ts && !.test.ts` (`:237-239`); the probe applies that filter and then removes `history.ts` **and
`perft-bench.ts`** (`:281-282`). **`history.ts`'s exclusion is principled and both roles gave the
reason.** `perft-bench.ts`'s is **a scope ruling wearing an implementation comment** — and it is the
one the criterion never authorised, because *"production module"* was never defined.

## 5 — `G5` / `AR-4`. NOT HOMED. It stays unowned, and here is the reason that did NOT change

**The brief was explicit that the owner asking for tickets is not itself a reason, and it is not.**

**What has changed since the three refusals:** `ABC-017` is `Done`, so the home that was previously
rejected as *wrong* is now merely *gone*; and `ABC-019` is unblocked for the first time.
**What has NOT changed — which is everything the refusals actually rested on:**

1. **The measurement is identical.** `WCOLS24R` (self-consistent 24 columns, padded right) still
   survives; `WCOLS24M` still dies ×7. `ABC-027` merged and did **not** close it — Security/NFR
   measured that on the rebased tip at 740/740, and QE deliberately did not rebuild it this pass.
2. **The restraint is still cross-ticket.** 21 rather than 24 was chosen at `ADR-0010` because 24
   **masks** the status panel's width swing, and masking another ticket's defect is not fixing it. A
   restraint taken for another ticket's benefit still cannot be guarded by a criterion on a third.
3. **`ADR-0010` still forbids the shapes a home would need.** Clause 2: *no panel reserves, pads or
   declares a frame width; `W` stays a per-frame max and may vary.* Clauses 5 and 7: **no
   constant-frame-width criterion**, and `ABC-019` must **not** be given one. Both `accepted`, both
   **not re-opened** at this hop.
4. **The named trigger has NOT fired.** Security/NFR wrote it precisely: *"whoever next opens
   frame-width ownership — on current evidence `ABC-019`'s `ADR-0010` narrowing criterion or
   `EPIC-006`."* **That criterion is still owed and not yet written.**

**So it stays unhomed, and Security/NFR's sentence is upheld verbatim: *"recording a fake owner to
satisfy the format would be worse than saying so."* Three roles refused it; this is the fourth.
`HISTORY_COLS` HOLDS at 21. No widening, no criterion here or anywhere, no constant-FRAME-width
criterion. `ADR-0009` and `ADR-0010` read and NOT re-opened.**

**One thing I DO hand over, and it is a sharpening rather than a homing.** The trigger was written as
indefinite — *"whoever next opens frame-width ownership"*. **It is now dated.** `ABC-019` is the last
ticket in the merge order, is unblocked for the first time, and its board row records that it **still
owes the `ADR-0010` criterion and prohibition**. So the moment the trigger fires is **`ABC-019`'s next
substantive hop**, and that hop is the one with the context to home this. **That belongs in
`ABC-019`'s brief, and it is the Orchestrator's to place** — I did not write it into `ABC-019`,
which is in flight.

## 6 — the stale comment. Homed

**Homed:** `ABC-029` `A4`.

**Swept exhaustively first**, which is `R1`/`D27`'s lesson applied rather than cited:
`grep -rn 'runtime importer' src/` returns **three** sites and **only `src/history-pane.ts:30` is
unqualified**. `src/history-pane.nfr.test.ts:228` already reads *"among the production modules"*;
`:269` is the file describing itself. **One site — unlike `ABC-016`, where naming one of three let two
survive into `main`.**

**Why it is on `ABC-029` and not `ABC-028`:** it is not an unrelated tidy-up, which rules 9 and 12 of
the twelve would forbid — **it is `ABC-029`'s own subject.** That ticket exists to settle what *"zero
runtime importers among the production modules"* covers, and `:30` is the last place in the tree still
saying it without the scope. QE's judgment that *"if it is ever corrected it belongs on a hop that
already touches production"* is honoured in substance: `ABC-029` is the hop whose subject **is** that
sentence.

**The constraint that blocked it is genuinely dead.** One byte moves `src/history-pane.ts`'s md5, and
four roles rested figures on that md5 **while the ticket was open**. The merge re-ran the gates on
`main` afterwards, so nothing rests on it now. It is `ABC-029`'s **only** permitted production line,
and the ticket says so.

## 7 — `AR-1` / `ABC-010`. RULED, and the ruling inverts the assumption

**Full measurement in the note beside this one.** In one line:

> **`ABC-010` closes the COMPUTE half and does NOT close the WIDTH half — which is the opposite of
> what everyone was carrying, including `ABC-017`'s own `## Out of scope`.**

**No new ticket.** `ABC-010` is the right home; it needs **one scope bullet and one acceptance
criterion**, specified exactly in that note so nobody re-derives it. **Owner: BA/PM, at `ABC-010`'s
own promotion hop** (it has never been promoted; its DoR block self-assesses all ✅ and that
assessment is now incomplete). **Trigger: `EPIC-003`'s decomposition or `ABC-010`'s promotion,
whichever comes first, and at the latest before `EPIC-006` supplies a FEN from outside the process.**
**I did not edit `ABC-010`** — it is a `P1` ticket in another epic, and amending it as a side effect
of an `ABC-017` cleanup hop is exactly the "an edit applied at one site while the ticket asserts the
same thing at two others" failure this board keeps recording.

## 8 — the gate that was scheduled and never ran. All three homed

**8a — `N8-LANE`'s new total (~575 ms of 650, ~102 ms of it the `RF-1` child process).**
**Homed as a measurable NFR trigger on BOTH new tickets**, not as work — because there is nothing to
*do* about it: the bar **holds**. Each ticket must measure its own delta by `N8-LANE`'s own method
(CPU user + sys, median of paired per-round deltas, n ≥ 7 interleaved, null control by identity) and
leave the total ≤ 650 ms, with `ADR-0008` still holding (≤ 3 s wall, ≤ 13 s CPU, `PERFT_DEEP` unset)
and the file count at **TWO**. **`ABC-026` owns the lane total and is the escalation route.**

> **The finding that is mine rather than inherited: ~75 ms of margin, and TWO tickets are competing
> for it.** `ABC-029` touches the ~102 ms item and, under form (a) of its `A3`, may **add** to it by
> rooting a module that runs a benchmark at import. **So whichever ticket lands second must re-measure
> the TOTAL, not its own delta** — that obligation is written into both. **No bar is re-derived and
> `N8-LANE` is not changed.**

**8b — the stdout channel.** **Homed:** `ABC-029` `A2`, with `WSTDOUT` as the discriminating build and
`WSTDERR` as the negative control that must keep surviving. Trigger dated to `EPIC-006`'s CLI entry
point, reproducible today by adding `perft-bench.ts` as a root.

**8c — the `perft-bench.ts` root.** **Homed:** `ABC-029` `A3`. **8b and 8c are the same fact from two
sides** — QE said so and it is why they are one ticket: the root cannot simply be added, because
adding it is what breaks the channel.

**And one correction carried into `ABC-029` because a later hop would otherwise act on it.** The
Engineer's note says *"the regex is not load-bearing any more and nothing rests on its reach — that is
the point of the probe."* **Measured by QE: false.** `WPERFT-STATIC` is killed by the **regex alone**;
the two instruments' coverage is **not nested**. His decision to keep the regex was right for a
stronger reason than he gave, and the note as written invites a later hop to delete a guard.
**`ABC-029` `A4` corrects that note.**

## Nothing merged, nothing deployed

No merge, no push, no deploy, no `git checkout main`. **Zero lines under `src/`.** `ABC-017` not
re-opened, not moved, not edited. A human holds merge and deploy.
