import { HandlerContext, PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import * as djwt from "djwt";
import { DB } from "../database/db.ts";
import { header, key } from "../utils/hmac_key.ts";

export async function handler(
  req: Request,
  ctx: HandlerContext,
): Promise<Response> {
  const errors: string[] = [];
  if (req.method === "POST" && req.body) {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || email.length == 0) {
      errors.push("Email not provided");
    }
    if (!password || password.length == 0) {
      errors.push("Password not provided");
    }

    if (errors.length === 0) {
      const db = DB.getInstance();
      const sql = await db.selectFrom("user").selectAll().where(
        "user.email",
        "=",
        email,
      ).executeTakeFirst();
      if (!sql) {
        errors.push("Record not found");
      }

      const payload: djwt.Payload = {
        email,
      };
      const jwt = await djwt.create(header, payload, key);
      const response = new Response("", {
        status: 303,
        headers: { Location: "/" },
      });
      setCookie(response.headers, {
        name: "jwt_token",
        value: jwt,
        maxAge: 60 * 60 * 24,
        httpOnly: true,
      });
      return response;
    }

    if (errors.length === 0) {
      return new Response("", {
        status: 303,
        headers: { Location: "/signin" },
      });
    }
  }
  return await ctx.render(errors);
}

export default function SignIn({ data }: PageProps<string[]>) {
  return (
    <div class="font-sans  bg-gray-100 h-screen w-screen flex flex-col items-center justify-center">
      <div class="text-2xl pb-4 flex flex-col items-center">
        Sign in to your account
      </div>
      <form
        method="POST"
        class="flex flex-col flex-gap-4 bg-white w-full max-w-md p-2 rounded-md border-1 border-gray-300"
      >
        <ul>{data.map((e) => <li class="text-red-700">{e}</li>)}</ul>
        <div class="flex flex-col ">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            class="border-1 border-indigo-200 rounded-md px-2 py-1 mt-1"
          >
          </input>
        </div>
        <div class="flex flex-col">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="border-1 border-indigo-200 rounded-md px-2 py-1 mt-1"
          >
          </input>
        </div>
        <div class="w-full bg-indigo-700 text-center text-gray-200 px-2 py-1 rounded-md">
          <button type="Submit">Submit</button>
        </div>
        <div>
          Don't have an account, signup{" "}
          <a href="./signup" class="text-indigo-700 hover:underline">here</a>
        </div>
      </form>
    </div>
  );
}
