---
id: 20260809T102500Z-security-nfr-claim-5c22a87e
kind: claim
by: security-nfr
at: 2026-08-09T10:25:00Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-015
  - ABC-016
  - ABC-017
  - ABC-019
  - EPIC-003
  - EPIC-006
  - NFR-002
  - RISK-005
  - src/frame.ts
  - 20260809T094900Z-qe-e2e-claim-273c224e
supersedes: 
---

# What this GATE does NOT establish — soft, non-load-bearing, explicitly unverified

`confidence: UNKNOWN - verify` on the whole note. Nothing here may be cited as settled. A
`PASS_WITH_RISKS` on the `In Security/NFR` exit means the measurable bars are met and the named risks
are owned; **it does not mean the frame is safe on a terminal, and it does not mean no further risk
exists.**

1. **NO TERMINAL WAS ATTACHED, and unlike `ABC-015`'s gate this one drove no pty.** Every reading
   here is of a captured sink or of a file descriptor. So *"a UTF-8 terminal does not honour `0x9B`"*
   — the load-bearing half of the C1 ruling — is **standards reasoning, not a measurement**, and it is
   `UNKNOWN - verify` on the terminals this project's `RISK-005` already names (Windows conhost,
   Windows Terminal, iTerm2, tmux). What a real terminal does with the 64 C1-range bytes a unicode
   frame carries has been observed by nobody.

2. **QE's `ONLCR` question is untouched by this gate and is still open.** This module emits no
   carriage return; if `EPIC-003`'s input surface puts the terminal into raw mode and raw mode drops
   `ONLCR` on this platform, the frame draws a staircase and nothing in the suite or in this gate
   would notice. `UNKNOWN - verify`, first observable at `EPIC-006`.

3. **The adversarial corpus is a SAMPLE, not a proof.** 21 strings is 21 hypotheses about what a
   player might type, chosen by one reader. The sanitizer is a two-condition allow-through over code
   points and this gate reasoned about the whole range, but **"no other input escapes it" is not
   claimed**. The corpus contains no fuzzing and no property test.

4. **The five accepted risks are DISPOSITIONS, not measurements of likelihood.** How often a player
   pastes 400,000 characters, how often anyone forces `--unicode` on a `LANG=C` terminal, and whether
   `ABC-019` will hand raw rows to the writer are all **unknown**, not "low" — they depend on tickets
   that do not exist. Only the **costs** are measured.

5. **The `NFR-002` figures are one machine and one Node version.** Apple M3 (Mac15,13) / Node
   v24.12.0 / Darwin 25.5.0 arm64, `UNKNOWN - verify` on any other hardware. `RISK-002`'s non-M3
   spike is the standing obligation and is not discharged here. The **compute half is a lower bound**
   while `ABC-013`, `ABC-016` and `ABC-017` do not exist, so the 1,800x headroom is headroom against
   a fraction of the eventual frame — a frame carrying a real SAN history could be two orders of
   magnitude more expensive and still meet the bar, but that is arithmetic, not a result.

6. **One difference from the Engineer is UNATTRIBUTED and no explanation is claimed.** The
   regular-file write cell reads ~11% higher here (2.711–2.772 against 2.43–2.48 µs). Two independent
   samples on each side agree with themselves and disagree with each other; this gate does not know
   why.

7. **The cold unbounded-input readings are three processes, not a distribution.** 14.1–15.8 ms at
   400,000 characters straddles the 16 ms bar, and this gate did not establish on which side the
   median falls, nor what the tail looks like, nor how it behaves under memory pressure. It is
   evidence that the bar is **reachable** by a supplied string, and it is nothing more precise.

8. **"No high-severity item exists" is a judgement about ASVS L1 engagement, and judgements can be
   wrong.** The one requirement this change genuinely engages, `V1.2.1`, is engaged **by analogue** —
   ASVS 5.0 names HTTP, HTML and XML contexts and has no requirement about terminal control
   sequences. If a later reader thinks a terminal sink deserves a stricter reading than this gate
   gave it, the evidence to re-decide on is in the `observation` notes rather than in this verdict.

9. **Nothing here says the module is CORRECT.** QE broke it 56 ways and found no production defect;
   this gate looked for danger and found no required fix. Neither is a proof, and the per-frame `W`
   QE characterized is still a demonstrated behaviour with an **unquantified** consequence that stays
   unquantified until `ABC-016` and `ABC-017` state their widths.

10. **UAT and E2E are ABSENT, not passed.** No CLI entry point until `EPIC-006`, zero runtime
    importers of `src/frame.ts`, `AGENTS.md`'s E2E slot `UNKNOWN - verify`. **Nothing about a
    player's actual experience of this frame has been observed by anyone** — which is the same
    sentence QE had to write, and it is still true after this gate.
