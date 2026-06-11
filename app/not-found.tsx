import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="indhold"
      className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center"
    >
      <h1 className="text-3xl font-bold text-brand">Siden blev ikke fundet</h1>
      <p className="mt-3 text-slate-600">
        Vi kunne ikke finde sommerhuse i den efterspurgte kategori.
      </p>
      <Link
        href="/blaavand"
        className="mt-6 rounded-md bg-brand px-5 py-2.5 font-medium text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Se sommerhuse i Blåvand
      </Link>
    </main>
  );
}
