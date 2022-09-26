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
  if (!jwt) {
    return await ctx.render({ email: null });
  }
  const payload = await djwt.verify(jwt, key);
  const email = payload["email"] as string;
  return await ctx.render({ email });
}

export default function Index({ data }: PageProps<Page>) {
  return (
    <div>
      <header class="flex flex-row items-center justify-between p-2 bg-gray-100 border-b-1 border-gray-300">
        <div class="text-xl">Welcome {data.email}</div>
        <nav class="flex flex-row flex-gap-2 items-center">
          <a href="./signup">Sign Up</a>
          <a
            href="./signin"
            class="bg-indigo-900 text-gray-200 px-2 py-1 rounded-md"
          >
            Login
          </a>
        </nav>
      </header>
    </div>
  );
}
