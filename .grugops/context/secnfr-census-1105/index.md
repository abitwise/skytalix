<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: secnfr-census-1105

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-11-05T11:55:26Z | decision | security-nfr | high: a pre-registration; sealed before any timing run; nothing measured yet |  | # PREREG, secnfr-census-1105: `NFR-008` graded on `main` with W1 in, with twin arms (ADR-0035 D1), then a row census and a probe. Sealed before any timing run |
| 2026-11-05T12:06:00Z | observation | security-nfr | high on the flags (ps, sampler and /proc/stat in every scored run); the figures are ungraded by the PREREG's rule |  | # secnfr-census-1105 session 1 is **not ALONE, so it is reported ungraded.** All 8 scored rounds are flagged: another project's vitest ran through the hold. The PREREG's one re-read applies. It waits for the host to clear, and it is final |
