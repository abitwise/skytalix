| id | spelling (⏎ = newline) | case | oracle binds value | NEW bindsAValueFrom | OLD regex | new vs oracle |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | `import { g } from "./m.ts";` | A1 value | true (g) | true | true | agree |
| S2 | `import { type T, g } from "./m.ts";` | A1 mixed | true (g) | true | true | agree |
| S3 | `import Dflt from "./m.ts";` | A1 default | true (default:Dflt) | true | true | agree |
| S4 | `import * as mod from "./m.ts";` | A1 namespace | true (*:mod) | true | true | agree |
| S5 | `import type { T } from "./m.ts";` | A1 import type | false | false | false | agree |
| S6 | `import { type T, type U } from "./m.ts";` | A1 inline all-type | false | false | true | agree |
| S7 | `import "./m.ts";` | A1 bare | false | false | true | agree |
| S8 | `export { g } from "./m.ts";` | A1 re-export | false | false | true | agree |
| E1 | `import { g, type T } from "./m.ts";` | mixed, type last | true (g) | true | true | agree |
| E2 | `import {⏎  type T,⏎  g,⏎} from "./m.ts";` | multi-line mixed | true (g) | true | true | agree |
| E3 | `import {⏎  type T,⏎  type U,⏎} from "./m.ts";` | multi-line all-type | false | false | true | agree |
| E4 | `import D, {⏎  type T,⏎} from "./m.ts";` | multi-line default + type | true (default:D) | true | true | agree |
| E5 | `import⏎  { g }⏎  from "./m.ts";` | keyword and from on own lines | true (g) | true | true | agree |
| E6 | `import { g as h } from "./m.ts";` | aliased value | true (g as h) | true | true | agree |
| E7 | `import { type T as V } from "./m.ts";` | aliased type | false | false | true | agree |
| E8 | `import { default as D } from "./m.ts";` | default via braces | true (default as D) | true | true | agree |
| E9 | `import D, { type T } from "./m.ts";` | default + type brace | true (default:D) | true | true | agree |
| E10 | `import D, { g } from "./m.ts";` | default + value brace | true (default:D, g) | true | true | agree |
| E11 | `import D, * as ns from "./m.ts";` | default + namespace | true (default:D, *:ns) | true | true | agree |
| E12 | `import type D from "./m.ts";` | type default | false | false | false | agree |
| E13 | `import type * as ns from "./m.ts";` | type namespace | false | false | false | agree |
| E14 | `import "./m.ts";⏎import { g } from "./m.ts";` | bare then value, one file | true (g) | true | true | agree |
| E15 | `import { g } from "./m.ts";⏎import "./m.ts";` | value then bare, one file | true (g) | true | true | agree |
| E16 | `import "./m.ts";⏎import { type T } from "./m.ts";` | bare then all-type, one file | false | false | true | agree |
| E17 | `import type { T } from "./m.ts";⏎import { g } from "./m.ts";` | type then value, one file | true (g) | true | true | agree |
| E18 | `import {} from "./m.ts";` | empty braces | false | false | true | agree |
| E19 | `import { type T, } from "./m.ts";` | trailing comma all-type | false | false | true | agree |
| E20 | `export * from "./m.ts";` | star re-export | false | false | true | agree |
| E21 | `export * as ns from "./m.ts";` | namespace re-export | false | false | true | agree |
| E22 | `export type { T } from "./m.ts";` | type re-export | false | false | false | agree |
| E23 | `import { type } from "./m.ts";` | a VALUE named type | true (type) | true | true | agree |
| E24 | `import { type as t } from "./m.ts";` | value `type` aliased | true (type as t) | false | true | under-count (fails red) |
| E25 | `import { typeX } from "./m.ts";` | name starting type | true (typeX) | true | true | agree |
| E26 | `import { g } from "./xm.ts";` | other target, same suffix | false | false | false | agree |
| E27 | `import { g } from "./m.tsx";` | other target, longer ext | false | false | false | agree |
| O1 | `import { /* g */ type T } from "./m.ts";` | block comment in braces | false | true | true | OVER-COUNT (false green) |
| O2 | `import {⏎  type T, // g⏎  type U,⏎} from "./m.ts";` | line comment in braces | false | true | true | OVER-COUNT (false green) |
| O3 | `import type{ T } from "./m.ts";` | import type{ no space | false | true | false | OVER-COUNT (false green) |
| O4 | `/*⏎import { g } from "./m.ts";⏎*/` | commented-out import at column 0 | false | true | true | OVER-COUNT (false green) |
| O5 | `const doc = `⏎import { g } from "./m.ts";⏎`;` | template literal at column 0 | false | true | true | OVER-COUNT (false green) |
| O6 | `import {⏎  // g,⏎  type T,⏎} from "./m.ts";` | commented-out specifier | false | true | true | OVER-COUNT (false green) |
| U1 | `import { g } from './m.ts';` | single quotes | true (g) | false | false | under-count (fails red) |
| U2 | `import { g } from "./m.ts"` | no semicolon | true (g) | false | false | under-count (fails red) |
| U3 | `import { g } from "./m.ts" with { type: "json" };` | import attributes | true (g) | false | false | under-count (fails red) |
| U4 | `import { "g" as h } from "./m.ts";` | string-named specifier | true (g as h) | false | true | under-count (fails red) |
| U5 | `import type { T } from "./a.ts"; import { g } from "./m.ts";` | two statements, one line | true (g) | false | false | under-count (fails red) |
| U6 | `import{ g }from "./m.ts";` | no whitespace after import | true (g) | false | false | under-count (fails red) |

ticket eight: NEW counts 4 of 8

| id | spelling | case | oracle binds (names) | tripwire counts | bindsAValueFrom(frame.ts) |
| --- | --- | --- | --- | --- | --- |
| F1 | `import { assembleFrame } from "./frame.ts";` | static value | true (assembleFrame) | true | true |
| F2 | `import assembleFrame from "./frame.ts";` | DEFAULT binding named assembleFrame | true (default:assembleFrame) | false | true |
| F3 | `import F, { type FrameParts } from "./frame.ts";` | default + type brace | true (default:F) | false | true |
| F4 | `import { default as assembleFrame } from "./frame.ts";` | default via braces | true (default as assembleFrame) | false | true |
| F5 | `import * as F from "./frame.ts";` | namespace | true (*:F) | true | true |
| F6 | `import { assembleFrame as c } from "./frame.ts";` | aliased | true (assembleFrame as c) | true | true |
| F7 | `import {⏎  type FrameParts,⏎  assembleFrame,⏎} from "./frame.ts";` | multi-line | true (assembleFrame) | true | true |
| F8 | `import { type assembleFrame } from "./frame.ts";` | inline type | false | false | false |
| F9 | `import F, { assembleFrame } from "./frame.ts";` | default + value | true (default:F, assembleFrame) | true | true |
| F10 | `import { /* x */ assembleFrame } from "./frame.ts";` | comment before name | true (assembleFrame) | false | true |
(node:39828) ExperimentalWarning: stripTypeScriptTypes is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
