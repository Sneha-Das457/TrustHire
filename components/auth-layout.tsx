import Link from "next/link";

type AuthLayoutProps = {
  children: React.ReactNode;
  supportingText: string;
};

export default function AuthLayout({ children, supportingText }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-[#f8fbfc] text-slate-900 lg:grid lg:grid-cols-[42%_58%]">
      <aside className="relative hidden overflow-hidden bg-[#0b1a33] p-8 text-white lg:flex lg:flex-col">
        <Brand inverse />
        <div className="my-auto max-w-md">
          <p className="font-serif text-5xl leading-[1.08] tracking-tight text-slate-50">
            Trusted referrals, clearer outcomes.
          </p>
          <p className="mt-6 max-w-sm text-base leading-7 text-slate-300">{supportingText}</p>
        </div>
      </aside>
      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
        <div className="mx-auto w-full max-w-[440px] lg:hidden"><Brand /></div>
        <div className="mx-auto flex w-full max-w-[440px] flex-1 items-center py-10 lg:py-16">
          {children}
        </div>
        <footer className="mx-auto flex w-full max-w-[440px] items-center gap-2 text-xs text-slate-400">
          <span>© TrustHire</span><span>·</span><Link href="#" className="hover:text-primary hover:underline">Privacy</Link><span>·</span><Link href="#" className="hover:text-primary hover:underline">Terms</Link>
        </footer>
      </section>
    </main>
  );
}

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return <Link href="/" className={`inline-flex items-center gap-2 font-semibold tracking-tight ${inverse ? "text-white" : "text-slate-900"}`}><span className="grid size-8 place-items-center rounded-md bg-primary text-sm font-bold text-white">T</span>TrustHire</Link>;
}
