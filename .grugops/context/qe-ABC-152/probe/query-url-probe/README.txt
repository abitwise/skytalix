QE ABC-152: does a query-string import of a mocked module reach the mock? (runner off, vitest 4.1.11)
Two one-test files were written into a scratch copy of a99e9845 under src/qeprobe/ and deleted after the run:
  factory.test.ts.txt  - vi.mock("../apply.ts", factory that counts makeMove); static import, dynamic plain import,
                         dynamic "../apply.ts?qeprobe" import; each makeMove counted
  spy.test.ts.txt      - vi.mock("../legal.ts", { spy: true }); static import vs dynamic "../legal.ts?qeprobe"
Command: node_modules/.bin/vitest run src/qeprobe
Output (stderr lines):
  QEPROBE FACTORY static=1 plain=1 query=1
  QEPROBE SPYTRUE static=1 query=0
Reading: a FACTORY mock covers a query-string URL of the same file; a { spy: true } automock does NOT.
(An earlier draft of the factory probe, with no static import of the mocked module, read plain=0 query=0:
 UNKNOWN - verify why; it was not pursued. The counted run above is the one reported.)
