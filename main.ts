/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { InnerRenderFunction, RenderContext, start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import { UnoCSS } from "./utils/unocss.ts";
import { DB } from "./database/db.ts";

const unoCSS = new UnoCSS();

async function render(ctx: RenderContext, render: InnerRenderFunction) {
  const body = render();
  const unoCSSOutput = await unoCSS.render(body);
  ctx.styles.splice(
    0,
    ctx.styles.length,
    ...unoCSSOutput,
    ...(ctx.styles ?? []),
  );
}

const db = DB.getInstance();
const sql = await db.selectFrom("user").selectAll().execute();
console.log(sql);

await start(manifest, { render });
