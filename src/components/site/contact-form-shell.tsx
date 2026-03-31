export function ContactFormShell() {
  return (
    <form className="panel-card p-6">
      {/* Presentation-only form shell for v1. Connect to a third-party form service or a route
          handler later when real inquiry routing is approved. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm uppercase tracking-[0.24em] text-slate-500">Name</span>
          <input
            type="text"
            placeholder="Your name"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#091321] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-brass/50 focus:bg-[#0c1930]"
          />
        </label>
        <label className="block">
          <span className="text-sm uppercase tracking-[0.24em] text-slate-500">Email</span>
          <input
            type="email"
            placeholder="name@example.com"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#091321] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-brass/50 focus:bg-[#0c1930]"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm uppercase tracking-[0.24em] text-slate-500">Subject</span>
          <input
            type="text"
            placeholder="How can we help?"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#091321] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-brass/50 focus:bg-[#0c1930]"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm uppercase tracking-[0.24em] text-slate-500">Message</span>
          <textarea
            rows={5}
            placeholder="Share a brief outline of your requirement."
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#091321] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-brass/50 focus:bg-[#0c1930]"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <a href="mailto:gulati@casanjaygulati.com" className="button-primary text-center">
          Email Us
        </a>
        <a href="tel:+919899983485" className="button-secondary text-center">
          Call the Office
        </a>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-400">
        Please share a brief outline of your requirement. For immediate assistance, you may also
        contact the office directly by email or phone.
      </p>
    </form>
  );
}
