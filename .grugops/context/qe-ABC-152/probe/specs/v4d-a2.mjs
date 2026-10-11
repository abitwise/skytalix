import specs from "./v4-specs.mjs";
const s = specs.find((x) => x.id === "a2-ordinal-salt-head");
export default [{ ...s, id: process.env.QE_A2_ID, t: "ABC-094 A2", expect: process.env.QE_A2_EXPECT }];
