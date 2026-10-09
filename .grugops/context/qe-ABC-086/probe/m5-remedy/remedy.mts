// The proposed default-lane row for G-QE-1: two live clocks at DIFFERENT steps, reads interleaved.
for (const f of ["./pristine.ts", "./m5.ts"]) {
  const { virtualClock } = await import(f);
  const a = virtualClock(1);
  const b = virtualClock(0.5);
  const got = [a(), b(), a(), b(), a(), b()];
  const want = [0, 0, 1, 0.5, 2, 1];
  console.log(f, JSON.stringify(got), JSON.stringify(got) === JSON.stringify(want) ? "GREEN" : "RED");
}
