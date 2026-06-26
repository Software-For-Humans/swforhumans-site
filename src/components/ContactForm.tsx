"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Web3Forms access key â€” set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in the
 * environment (e.g. Netlify env vars) to enable real submissions. When
 * it's not set, the form falls back to opening the visitor's email
 * client (mailto) so messages still reach us â€” it never silently drops.
 */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

/**
 * Contact form modal styled to match the page (dark aurora panel with
 * rounded corners, brand accent on focus/submit). Submits via Web3Forms
 * when configured, otherwise falls back to a mailto: handoff.
 */
export function ContactForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [shown, setShown] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // Remember what had focus before the modal opened, to restore on close.
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Flip "shown" true on mount so the entry animation plays once.
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Capture the previously-focused element, focus the first field, and
  // restore focus to the trigger when the modal unmounts.
  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => firstInputRef.current?.focus(), 350);
    return () => {
      clearTimeout(t);
      prevFocusRef.current?.focus?.();
    };
  }, []);

  // Close on Escape + trap Tab focus inside the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "sending") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !cardRef.current) return;
      const focusables = cardRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    try {
      if (WEB3FORMS_KEY) {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            name,
            email,
            subject: subject || `New message from ${name}`,
            message,
            from_name: "Software For Humans website",
          }),
        });
        if (!res.ok) throw new Error("send failed");
      } else {
        // No backend configured â€” hand off to the visitor's email client.
        const body = encodeURIComponent(`${message}\n\nâ€” ${name} (${email})`);
        const subj = encodeURIComponent(
          subject || "Contact from swforhumans.com",
        );
        window.location.href = `mailto:${site.email.hello}?subject=${subj}&body=${body}`;
      }
      setStatus("sent");
      // Auto-close after a short celebration so the user can see the âœ“.
      setTimeout(() => onClose(), 1400);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1500);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
      aria-modal="true"
      role="dialog"
      aria-labelledby="contact-form-title"
      aria-describedby="contact-form-desc"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-[3px] transition-opacity duration-500"
        style={{ opacity: shown ? 1 : 0 }}
        onClick={() => status !== "sending" && onClose()}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        ref={cardRef}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl"
        style={{
          backgroundColor: "#152838",
          opacity: shown ? 1 : 0,
          transform:
            reduceMotion || shown
              ? "translateY(0) scale(1)"
              : "translateY(20px) scale(0.96)",
          transition: reduceMotion
            ? "opacity 0.2s linear"
            : "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Decorative aurora blobs inside the card. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ opacity: 0.45 }}
        >
          <div
            className="absolute -top-32 -left-20 h-72 w-72 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(176,80,152,0.5) 0%, rgba(176,80,152,0) 70%)",
              filter: "blur(45px)",
            }}
          />
          <div
            className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,255,133,0.4) 0%, rgba(0,255,133,0) 70%)",
              filter: "blur(45px)",
            }}
          />
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={() => status !== "sending" && onClose()}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            Ã—
          </span>
        </button>

        {/* Content */}
        <div className="relative p-8 md:p-10">
          <h2
            id="contact-form-title"
            className="text-white"
            style={{
              fontSize: "var(--text-tagline-sm)",
              lineHeight: 1.1,
            }}
          >
            <span style={{ fontWeight: 400 }}>Get in </span>
            <span style={{ fontWeight: 700 }}>touch.</span>
          </h2>
          <p
            id="contact-form-desc"
            className="mt-3 font-light text-white/70"
            style={{
              fontSize: "var(--text-body-sm)",
              lineHeight: 1.45,
            }}
          >
            Drop us a note â€” we read every message.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <FormField
              ref={firstInputRef}
              id="name"
              label="Name"
              value={name}
              onChange={setName}
              type="text"
              required
              disabled={status !== "idle"}
            />
            <FormField
              id="email"
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              required
              disabled={status !== "idle"}
            />
            <FormField
              id="subject"
              label="Subject"
              value={subject}
              onChange={setSubject}
              type="text"
              disabled={status !== "idle"}
            />
            <FormTextarea
              id="message"
              label="Message"
              value={message}
              onChange={setMessage}
              required
              disabled={status !== "idle"}
            />

            <button
              type="submit"
              disabled={status !== "idle"}
              className="form-submit group relative w-full overflow-hidden rounded-full border border-white/20 px-8 py-4 text-white transition-all duration-300 hover:border-white/50 disabled:cursor-not-allowed"
            >
              {/* Hover fill */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0"
              />
              <span className="relative flex items-center justify-center gap-3">
                {status === "sending" && (
                  <span
                    aria-hidden="true"
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  />
                )}
                <span
                  aria-live="polite"
                  style={{
                    fontSize: "var(--text-body)",
                    fontWeight: 500,
                    color:
                      status === "sent"
                        ? "var(--accent)"
                        : status === "error"
                          ? "var(--accent-magenta)"
                          : "#fff",
                  }}
                >
                  {status === "idle" && "Send message"}
                  {status === "sending" && "Sendingâ€¦"}
                  {status === "sent" && "Sent âœ“"}
                  {status === "error" && "Couldnâ€™t send â€” retry"}
                </span>
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
};

const FormField = (() => {
  function FormFieldInner(
    {
      id,
      label,
      value,
      onChange,
      type = "text",
      required,
      disabled,
    }: FieldProps,
    ref: React.Ref<HTMLInputElement>,
  ) {
    return (
      <div className="form-field group">
        <label
          htmlFor={id}
          className="block text-white/60 transition-colors duration-300 group-focus-within:text-white"
          style={{
            fontSize: "var(--text-body-sm)",
            fontWeight: 500,
          }}
        >
          {label}
          {required ? " *" : ""}
        </label>
        <div className="relative mt-2">
          <input
            ref={ref}
            id={id}
            type={type}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-full bg-transparent pb-2 text-white outline-none placeholder:text-white/30 disabled:opacity-50"
            style={{
              fontSize: "var(--text-body)",
              borderBottom: "1px solid rgba(255,255,255,0.18)",
            }}
          />
          {/* Sliding focus underline */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-focus-within:w-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
        </div>
      </div>
    );
  }
  return Object.assign(
    (props: FieldProps & { ref?: React.Ref<HTMLInputElement> }) =>
      FormFieldInner(props, props.ref ?? null),
    { displayName: "FormField" },
  );
})();

function FormTextarea({
  id,
  label,
  value,
  onChange,
  required,
  disabled,
}: Omit<FieldProps, "type">) {
  return (
    <div className="form-field group">
      <label
        htmlFor={id}
        className="block text-white/60 transition-colors duration-300 group-focus-within:text-white"
        style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
      >
        {label}
        {required ? " *" : ""}
      </label>
      <div className="relative mt-2">
        <textarea
          id={id}
          rows={4}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full resize-none bg-transparent pb-2 text-white outline-none placeholder:text-white/30 disabled:opacity-50"
          style={{
            fontSize: "var(--text-body)",
            borderBottom: "1px solid rgba(255,255,255,0.18)",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-focus-within:w-full"
          style={{ backgroundColor: "var(--accent)" }}
        />
      </div>
    </div>
  );
}
