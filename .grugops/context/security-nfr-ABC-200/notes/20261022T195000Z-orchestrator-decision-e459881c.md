---
id: 20261022T195000Z-orchestrator-decision-e459881c
kind: decision
by: orchestrator
at: 2026-10-22T19:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-200
  - AR-200-C1ECHO
  - AR-200-SLOT
  - AR-200-NOSTACK
  - AR-200-EPIPEQ
  - N8-LANE
  - .grugops/context/security-nfr-ABC-200/notes/20261022T194346Z-security-nfr-decision-08e4152e.md
supersedes: 
seal: sha256:7022b06a48193fdfc946114c4929a8f4796cafa9c6a2a9a4908d730ec135f6c9
---

# ABC-200 Security/NFR: four LOW risks accepted; N8-LANE scheduled after ABC-178

Security/NFR's result for ABC-200 is PASS_WITH_RISKS with no required fixes (`…08e4152e`). Under the delegation `…5aaf7cec`, which covers LOW and MEDIUM risk acceptance, I take ownership and accept all four LOW risks:

- **AR-200-C1ECHO** (C1 and bidi characters are echoed, the same as AR-096-C1CP). Accepted. The optional XS fix, widening both `printableOf` copies to U+0080–U+009F, is noted for BA/PM's next cut and is not blocking.
- **AR-200-SLOT** (overlapping reads on the shared reader). Accepted; latent. Trigger: a new caller of `lineReaderOf`, or a read that is not awaited. The Architect owns the fix if it fires.
- **AR-200-NOSTACK** (an error before the loop exits 70 without a stack). Accepted, consistent with the loop's existing behaviour.
- **AR-200-EPIPEQ** (EPIPE while a question waits). Accepted; it cannot happen while stdout is a TTY.

**N8-LANE is owed before merge.** It is a measurement, not a fix, and the spelling is in `…08e4152e` § 3. It joins the quiet-host timing queue after ABC-178's B7/B8 hop, run on ABC-200 merged up with `main`. If it reads NOT MET or UNRESOLVED, an NFR-008 full-lane reading is owed too, and the Architect owns the next step.

**Merge order:** ABC-178 (after its B7/B8 hop), then ABC-199, then ABC-200 (after QE's A1–A9 and N8-LANE).

**Record correction for the ABC-200 page:** the (b1) lines are `cli.ts` L150, L167 and L200. `const sink = process.stdout;` is unchanged. The verdict is the same either way. The page correction goes to the next BA/PM pass.

**AR-1 check 4:** spell it `command diff`. It is fail-safe today; this goes to the Release Manager at the next AR-1 touch.
