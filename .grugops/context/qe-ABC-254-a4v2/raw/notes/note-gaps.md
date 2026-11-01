# ABC-254 gaps after the D3-V2 read: QE-254-a CLOSED (A4 MET under D3-V2); QE-254-b and QE-254-c LOW carry (test-only); QE-254-d INFO carries (QE's instrument)

QE/E2E, task `qe-ABC-254-a4v2`. Follows this task's timing and host notes, the PREREG `…a1136cf6`, qe-ABC-254's verdict `…1c801504` and qe-ABC-254-a4's gaps `…42b83a6d`.

## Scope
The open items on ABC-254 after this read.

## QE-254-a: CLOSED by this read
- **What it was:** A4 was ungraded (UNRESOLVED) twice under D3 as first written.
- **How it closed:** the Architect's D3-V2 (`arch-d3-under-load/…6f646a39`) changed the validity rule, forward-only. No bar moved. This fresh read graded all four boards valid on the main schedule, so A4 is **MET**.
- The two earlier reads stay UNRESOLVED as graded, and nothing of theirs was pooled.

## QE-254-b: LOW, carried (unchanged from qe-ABC-254)
The tightened `hasLegalMove` bar does not catch a rebuild on the lazy list: PL3a survives the whole default lane. Carrier: BA/PM, test-only. Non-blocking.

## QE-254-c: LOW, carried (unchanged from qe-ABC-254)
No default-lane row reads quiet promotions in check: PQ2 survives the lane and dies only in the deep lane. Carrier: BA/PM, test-only. Non-blocking.

## QE-254-d: INFO, carried
- **Status:** the per-run `/proc` diff names only processes alive at both ends of a run.
- **This read:** it added a reaped-children view (V2-INFO). The view named the one foreign `claude` process behind the single discard. This window had too little short-lived load to show whether it names the `git` / `node` bursts seen before (`UNKNOWN - verify`).
- **Carrier:** QE's next timing hop. Not a product gap.

## Risk to watch (not a gap)
start's graded ratio is 1.1059, 0.006 above 1.10. The bar is met with margin on its own terms, since start serves as the "third board" (≥ 1.00). Even so, a future O1 read that depends on start crossing 1.10 should expect it to sit at the line.
