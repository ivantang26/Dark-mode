import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="aurora opacity-50" aria-hidden="true" />
      <div className="container-x relative grid place-items-center py-16 md:py-24">
        <div className="w-full max-w-[420px]">
          <h1 className="text-center text-[2rem] font-semibold tracking-[-0.03em]">Welcome back</h1>
          <p className="mt-2 text-center text-mute">Log in to the Synapse console.</p>
          <LoginForm />
          <p className="mt-6 text-center text-[15px] text-mute">
            New here?{" "}
            <Link href="/signup" className="prose-link">
              Get an API key
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
