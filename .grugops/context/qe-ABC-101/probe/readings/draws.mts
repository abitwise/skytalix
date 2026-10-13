const { seededRandom, LEVELS } = await import("/Users/olgeroeselg/Projects/hacks/grugops-examples/wt-qe-ABC-101/src/levels.ts");
for (const seed of [7, 4294967295, 1]) { const r = seededRandom(seed); const d = [r(), r(), r()];
  console.log(`seed ${seed}: draws ${d.map(x => x.toFixed(4)).join(", ")}; level 1 (0.4) ${d.map(x => x < 0.4 ? "B" : "e").join("")}; level 2 (0.2) ${d.map(x => x < 0.2 ? "B" : "e").join("")}`); }
