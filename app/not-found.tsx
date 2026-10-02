import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="aurora opacity-50" aria-hidden="true" />
      <div className="container-x relative py-28 text-center">
        <p className="font-mono text-[14px] text-mute">
          HTTP/2 <span className="text-danger">404</span> model_not_found
        </p>
        <h1 className="h2 mt-4">That page didn’t stream.</h1>
        <p className="mx-auto mt-4 max-w-md text-mute">The link may be old, or the page moved. Try the docs or search with ⌘K.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Home
          </Link>
          <Link href="/docs" className="btn btn-secondary">
            Docs
          </Link>
        </div>
      </div>
    </section>
  );
}
