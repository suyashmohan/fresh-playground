import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { DB } from "../database/db.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: HandlerContext) {
    if (!req.body) {
      return await ctx.render([]);
    }

    const errors: string[] = [];
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (!email || email.trim().length == 0) {
      errors.push("Email not provided");
    }
    if (!password || password.trim().length == 0) {
      errors.push("Password not provided");
    }
    if (!confirmPassword || confirmPassword.trim().length == 0) {
      errors.push("Confirm Password not provided");
    }
    if (password !== confirmPassword) {
      errors.push("Passwords does not match");
    }

    if (errors.length > 0) {
      return await ctx.render(errors);
    }

    const db = DB.getInstance();
    await db.insertInto("user").values({
      email,
      password,
    }).execute();

    return new Response("", {
      status: 303,
      headers: { Location: "/signin" },
    });
  },
};

export default function SignUp({ data }: PageProps<string[]>) {
  return (
    <div class="font-sans bg-blue-50 h-screen w-screen flex flex-col items-center justify-center">
      <div class="flex flex-col items-center p-4">
        <img src="./favicon.ico" />
      </div>
      <form
        method="POST"
        class="flex flex-col flex-gap-4 bg-white w-full max-w-md p-8 rounded-md border-1 border-gray-300"
      >
        <div class="text-2xl flex flex-col items-center">
          Let's get started
        </div>
        <div class="text-sm flex flex-col items-center mb-4">
          Enter your details to create an account
        </div>

        {data && <ul>{data.map((e) => <li class="text-red-700">{e}</li>)}</ul>}
        <div class="flex flex-col ">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            class="border-1 border-blue-100 rounded-md px-2 py-1 mt-1"
          >
          </input>
        </div>
        <div class="flex flex-col">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="border-1 border-blue-100 rounded-md px-2 py-1 mt-1"
          >
          </input>
        </div>
        <div class="flex flex-col">
          <label for="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            class="border-1 border-blue-100 rounded-md px-2 py-1 mt-1"
          >
          </input>
        </div>
        <div class="w-full bg-blue-700 text-center text-gray-200 px-4 py-2 mt-4 rounded-md">
          <button type="Submit">Submit</button>
        </div>
        <div>
          Already have an account, signin{"  "}
          <a href="./signin" class="text-blue-700 hover:underline">here</a>
        </div>
      </form>
    </div>
  );
}
