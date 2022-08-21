/** @jsx h */
import { h } from "preact";
import { HandlerContext, PageProps } from "$fresh/server.ts";
import * as djwt from "djwt";
import { getCookies } from "$std/http/cookie.ts";
import { key } from "../utils/hmac_key.ts";

interface Page {
  email: string;
}

export async function handler(
  req: Request,
  ctx: HandlerContext,
): Promise<Response> {
  const jwt = getCookies(req.headers)["jwt_token"];
  let email = "";
  try {
    const payload = await djwt.verify(jwt, key);
    email = payload["email"] as string;
  } catch (err) {
    // Ignore
    console.error(err);
  }
  return await ctx.render({ email });
}

export default function Index({ data }: PageProps<Page>) {
  return (
    <div>
      Welcome {data.email}
      <div>
        Goto <a href="/dashboard" class="text-blue-700">Dashboard</a>
      </div>
    </div>
  );
}
