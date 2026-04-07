"use client";

import { useState } from "react";

import { siteContent } from "@/content/site-content";

type SubmissionState = {
  type: "idle" | "success" | "error";
  message: string;
};

const initialState: SubmissionState = {
  type: "idle",
  message: ""
};

export function ContactFormShell() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>(initialState);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmissionState(initialState);

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.append("access_key", siteContent.contactForm.accessKey);
    formData.append("subject", siteContent.contactForm.subject);
    formData.append("from_name", siteContent.contactForm.fromName);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const result = (await response.json()) as { success?: boolean; message?: string };

      if (response.ok && result.success) {
        form.reset();
        setSubmissionState({
          type: "success",
          message: "Your enquiry has been sent successfully. We will get back to you soon."
        });
      } else {
        setSubmissionState({
          type: "error",
          message: result.message ?? "Unable to send your enquiry right now. Please try again."
        });
      }
    } catch {
      setSubmissionState({
        type: "error",
        message: "Unable to send your enquiry right now. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="border-t border-white/10 pt-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm uppercase tracking-[0.24em] text-slate-500">Name</span>
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            className="mt-2 w-full border border-white/10 bg-[#091321] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-brass/50 focus:bg-[#0c1930]"
          />
        </label>
        <label className="block">
          <span className="text-sm uppercase tracking-[0.24em] text-slate-500">Email</span>
          <input
            type="email"
            name="email"
            required
            placeholder="name@example.com"
            className="mt-2 w-full border border-white/10 bg-[#091321] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-brass/50 focus:bg-[#0c1930]"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm uppercase tracking-[0.24em] text-slate-500">Subject</span>
          <input
            type="text"
            name="subject_line"
            required
            placeholder="How can we help?"
            className="mt-2 w-full border border-white/10 bg-[#091321] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-brass/50 focus:bg-[#0c1930]"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm uppercase tracking-[0.24em] text-slate-500">Message</span>
          <textarea
            rows={5}
            name="message"
            required
            placeholder="Share a brief outline of your requirement."
            className="mt-2 w-full border border-white/10 bg-[#091321] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-brass/50 focus:bg-[#0c1930]"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={isSubmitting} className="button-primary text-center disabled:opacity-70">
          {isSubmitting ? "Sending..." : "Send Inquiry"}
        </button>
        <a href="tel:+9101141026688" className="button-secondary text-center">
          Call the Office
        </a>
      </div>

      {submissionState.type !== "idle" ? (
        <p
          className={`mt-4 text-sm leading-7 ${
            submissionState.type === "success" ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {submissionState.message}
        </p>
      ) : (
        <p className="mt-4 text-sm leading-7 text-slate-400">
          Please share a brief outline of your requirement. Form enquiries are submitted directly from
          this page.
        </p>
      )}
    </form>
  );
}
