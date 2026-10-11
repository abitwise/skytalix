// Load-time check plant: remove a JsonReporter hook, then import the reporter. Expect a throw.
const { JsonReporter } = await import(process.argv[2] + "/node_modules/vitest/dist/reporters.js").catch(() => import("vitest/reporters"));
for (const hook of ["onTestRunEnd", "writeReport"]) {
  const saved = JsonReporter.prototype[hook];
  delete JsonReporter.prototype[hook];
  try { await import(`${process.argv[2]}/tools/grugops/result-file-reporter.js?${hook}`); console.log(hook, "removed: NO THROW"); }
  catch (e) { console.log(hook, "removed: threw:", e.message); }
  JsonReporter.prototype[hook] = saved;
}
await import(`${process.argv[2]}/tools/grugops/result-file-reporter.js?intact`); console.log("intact: loads");
