// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  namespace App {
    interface Locals {
      session: {
        id: string;
        name: string;
        pfp: string;
      } | null;
    }
  }
}

export {};
