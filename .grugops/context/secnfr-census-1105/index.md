<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: secnfr-census-1105

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-05T11:55:26Z | decision | security-nfr | high: a pre-registration; sealed before any timing run; nothing measured yet |  | # PREREG, secnfr-census-1105: `NFR-008` graded on `main` with W1 in, with twin arms (ADR-0035 D1), then a row census and a probe. Sealed before any timing run |
| 2026-11-05T12:06:00Z | observation | security-nfr | high on the flags (ps, sampler and /proc/stat in every scored run); the figures are ungraded by the PREREG's rule |  | # secnfr-census-1105 session 1 is **not ALONE, so it is reported ungraded.** All 8 scored rounds are flagged: another project's vitest ran through the hold. The PREREG's one re-read applies. It waits for the host to clear, and it is final |
| 2026-11-05T12:22:13Z | decision | security-nfr | high: a probe plan fixed before the probe runs; row costs are the re-read's census medians; the remnants are proposals |  | # secnfr-census-1105 probe plan, sealed after the graded read's census and before the probe runs. Nine rows, 750 ms in-thread, and one stated change to the PREREG's arms |
