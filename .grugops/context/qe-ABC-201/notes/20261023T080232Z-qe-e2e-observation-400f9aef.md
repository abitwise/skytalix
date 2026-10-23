---
id: 20261023T080232Z-qe-e2e-observation-400f9aef
kind: observation
by: qe-e2e
at: 2026-10-23T08:02:32Z
verified_by: 
confidence: high
refs:
  - ABC-201
  - EPIC-006
  - NFR-007
  - qe-ABC-201
  - security-nfr-timing-2026-10-23
  - ABC-200
  - QE-201-a
  - QE-201-b
  - QE-201-c
  - QE-201-d
  - QE-201-e
  - ADR-0037
  - AR-096-DISKCOLD
  - c91445e3
  - c0585331
supersedes: 
seal: sha256:f95014519a72d618c75c7e60fcaa279b1f641c56073cacc204cd88b52db75dea
---

# ABC-201 QE gap register: QE-201-a to QE-201-e, all INFO, none blocking

QE/E2E, task `qe-ABC-201`, 2026-10-23.

- **`QE-201-a` (INFO, BA/PM and future readers): A2's engine reply is not a pin.**
  - The book draw is `Math.random` per session (`src/book.ts`, ADR-0037 D3). Security/NFR's run replied `e5`; QE's A2 replied `c5`; QE's Q4 replied `e5`.
  - A2 is graded on 2 plies, which is robust. The `1. e4 e5` quoted on EPIC-006 and in the catalog insertion is one sample, not an expected value. A future check that pins the reply text would flake about as often as the book's weights allow.
- **`QE-201-b` (INFO, Orchestrator): the records cite `c91445e3`, from before ABC-200.**
  - ABC-200 changed the startup path (`src/cli.ts`, `line-input.ts`, `line-reader.ts`, `cli-options.ts`, `startup-questions.ts`).
  - QE's re-read at `c0585331` covers it: A1–A3 MET, and the first board is byte-identical.
  - The catalog and EPIC-006 lines name only `c91445e3`. Whether to add `c0585331` is the owning role's call. QE edits neither (fence).
- **`QE-201-c` (INFO, reported only): QE's series ran about 12 ms slower.**
  - Median 204.3 against 192.6 ms; max 227.2 against 220.9 ms. QE's load1 was 3.39, against 1.84–1.85.
  - There is one series each, so the difference cannot be attributed to ABC-200's code or to load. Both series are about 9× under the bar.
- **`QE-201-d` (INFO, wording): the page's "`Target` cell hashes the same … (`9f245333…`)".**
  - The hash covers the stripped first three cells of the row (ID, Category, Target) plus a newline, not the Target cell alone.
  - QE reproduced it, and it is equal before and after. The claim holds.
- **`QE-201-e` (INFO, carried, not new): what neither reading covers.**
  - Both readings ran on the same M3, so QE's re-read confirms the result on this host only.
  - The "nothing else installed" half of acceptance 1 stays `UNKNOWN - verify` beyond this host.
  - A disk-cold launch was not read (`AR-096-DISKCOLD` stands).
  - A TTY launch with the flags absent (ABC-200's question path) is outside `NFR-007`'s reading, as the ABC-200 page rules.
