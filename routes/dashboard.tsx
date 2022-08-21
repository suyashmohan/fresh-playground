/** @jsx h */
import { h } from "preact";

export default function Playground() {
  return (
    <div class="font-sans flex flex-row items-start">
      <nav class="w-64 h-screen border-r-1 border-gray-300 p-2">
        <a href="#" class="block m-1 px-2 py-1 bg-gray-200 rounded-md">
          Dashboard
        </a>
        <a href="#" class="block m-1 px-2 py-1 hover:bg-gray-200 rounded-md">
          Users
        </a>
        <a href="#" class="block m-1 px-2 py-1 hover:bg-gray-200 rounded-md">
          Orders
        </a>
        <a href="#" class="block m-1 px-2 py-1 hover:bg-gray-200 rounded-md">
          Media
        </a>
      </nav>
      <div class="w-full">
        <header class="flex flex-row items-center justify-between p-2 bg-gray-100 border-b-1 border-gray-300">
          <div class="text-xl">Brand Name</div>
          <nav class="flex flex-row flex-gap-2 items-center">
            <a href="#">Company</a>
            <a href="#">Products</a>
            <a href="#">Team</a>
            <a
              href="./signin"
              class="bg-indigo-900 text-gray-200 px-2 py-1 rounded-md"
            >
              Login
            </a>
          </nav>
        </header>
        <main>
          <section class="m-2">
            <div class="border-b-1 border-gray-200 my-2">Monthly Stats</div>
            <div class="flex flex-row justify-between items-start">
              <div class="bg-gray-200 rounded-md flex flex-col items-center w-32">
                <div class="p-2">Users</div>
                <div class="p-4 text-xl font-bold">0</div>
              </div>
              <div class="bg-gray-200 rounded-md flex flex-col items-center w-32">
                <div class="p-2">Orders</div>
                <div class="p-4 text-xl font-bold">0</div>
              </div>
              <div class="bg-gray-200 rounded-md flex flex-col items-center w-32">
                <div class="p-2">Sales</div>
                <div class="p-4 text-xl font-bold">0 USD</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
