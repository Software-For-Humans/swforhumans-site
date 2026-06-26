"use client";

import { useEffect, useState } from "react";
import { LogoIsotype } from "./LogoIsotype";

/** Intro lines shown one at a time before the logo settles. The last
 *  line is the brand signature and lingers a beat longer. */
const MESSAGES = ["Quiet.", "Focused.", "Just Software, for humans."];

/**
 * Full-screen page loader with three phases:
 *
 *   1. LOADING — Two dark "curtains" cover the whole viewport. The
 *      brand isotype sits at the EXACT same coordinates the Hero's
 *      logo lives at, and pulses gently while we wait for fonts
 *      (minimum 1.5s so the animation reads as intentional).
 *   2. REVEALING — The two curtains slide off-screen (left half →
 *      left, right half → right), revealing the page below. The
 *      loader's logo fades out a beat AFTER the curtains begin moving
 *      so it visually "hands off" to the Hero's logo at the same
 *      position underneath — the user sees one logo that never moves.
 *   3. DONE — Component unmounts so it doesn't sit in the DOM.
 *
 * Layout key: the logo container uses `flex flex-col items-center
 * justify-center pb-16 md:pb-20` — the EXACT same classes as the
 * Hero's lockup container — plus an invisible h1 spacer with the same
 * content and font-size as the Hero's wordmark. That guarantees the
 * loader's isotype lands pixel-perfectly on top of the Hero's, so the
 * curtains can open without the logo appearing to jump.
 */
export function PageLoader() {
  // Client-only render: `mounted` is false on the server (component
  // returns null, nothing in the SSR HTML). After hydration the mount
  // effect flips it to true, the loader appears, and the timeline
  // effect runs the curtain animation.
  //
  // Why client-only: SSR'ing the loader caused React 19 hydration to
  // silently discard the markup, leaving the loader gone before its
  // animation could play. Skipping SSR avoids the whole class of
  // hydration mismatches.
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<"loading" | "revealing" | "hidden">(
    "loading",
  );
  // Which intro message is showing. While `msgIndex < MESSAGES.length`
  // the loader shows that line; once it reaches `MESSAGES.length` the
  // brand isotype settles in for the hand-off to the Hero logo.
  const [msgIndex, setMsgIndex] = useState(0);

  // Flip to mounted on the client after first render (intentional
  // client-only render gate; runs once). Also force the page to the
  // TOP so the loader's logo lines up with the Hero's logo for the
  // hand-off: disable the browser's scroll restoration (which would
  // otherwise reopen a reloaded page at the previous scroll position)
  // and jump to the top immediately.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Run the animation timeline once the component is mounted on the
  // client. NO cancellation in the cleanup: React Strict Mode in dev
  // would otherwise kill the first run's timers and leave the loader
  // stuck or skip it entirely.
  useEffect(() => {
    if (!mounted) return;

    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    (async () => {
      if (reduceMotion) {
        // Skip the message sequence; just hold the logo briefly, then
        // open. (Respects users who don't want motion.)
        setMsgIndex(MESSAGES.length);
        if (document.fonts?.ready) {
          try {
            await document.fonts.ready;
          } catch {
            // ignore
          }
        }
        await wait(700);
      } else {
        // Play the intro messages one at a time. The last line (the
        // brand tagline) lingers a little longer as the climax.
        for (let i = 0; i < MESSAGES.length; i++) {
          setMsgIndex(i);
          await wait(i === MESSAGES.length - 1 ? 1150 : 720);
        }

        // Make sure fonts are ready before the logo + reveal so the
        // Hero hand-off lands on the final typeface, not a fallback.
        if (document.fonts?.ready) {
          try {
            await document.fonts.ready;
          } catch {
            // ignore
          }
        }

        // Hand off to the isotype, let it settle, then reveal.
        setMsgIndex(MESSAGES.length);
        await wait(600);
      }

      // Guarantee we reveal at the very top, even if any scroll slipped
      // through while the loader was up — so the page always opens on
      // the Hero with the logos aligned.
      window.scrollTo(0, 0);
      setStage("revealing");
      await new Promise((r) => setTimeout(r, 1100));
      setStage("hidden");
    })();
  }, [mounted]);

  // Lock scrolling while the loader is visible.
  //
  // `overflow: hidden` on body alone is NOT enough on iOS Safari —
  // touch-scroll can bypass it and let the user reveal sections under
  // the curtain. The fix is a combination of:
  //   1. `overflow: hidden` on both <html> and <body>
  //   2. `touchAction: none` on <body>
  //   3. a `touchmove` listener with `preventDefault()` at the
  //      document level (`passive: false` — passive listeners can't
  //      preventDefault).
  // Together those block native scroll, touch-drag inertia, and the
  // pull-to-refresh / overscroll gestures.
  useEffect(() => {
    if (stage === "hidden") return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyTouchAction = body.style.touchAction;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.touchAction = "none";

    const blockTouchMove = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("touchmove", blockTouchMove, { passive: false });

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.touchAction = prevBodyTouchAction;
      document.removeEventListener("touchmove", blockTouchMove);
    };
  }, [stage]);

  if (!mounted || stage === "hidden") return null;

  const revealing = stage === "revealing";
  const showMessage = msgIndex < MESSAGES.length;

  const curtainStyle = {
    backgroundColor: "#152838",
    transition: "transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
  } as const;

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    >
      {/* LEFT curtain — slides off-screen to the left when revealing. */}
      <div
        className="absolute inset-y-0 left-0 w-1/2"
        style={{
          ...curtainStyle,
          transform: revealing ? "translateX(-100%)" : "translateX(0)",
        }}
      />

      {/* RIGHT curtain — slides off-screen to the right when revealing. */}
      <div
        className="absolute inset-y-0 right-0 w-1/2"
        style={{
          ...curtainStyle,
          transform: revealing ? "translateX(100%)" : "translateX(0)",
        }}
      />

      {showMessage ? (
        /* INTRO MESSAGES — one line at a time, centered. Each re-mounts
           via its `key` so the fade-in-rise animation replays. */
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <p
            key={msgIndex}
            className="loader-msg-anim max-w-[18ch] text-center font-medium tracking-tight text-white"
            style={{ fontSize: "clamp(26px, 7vw, 48px)", lineHeight: 1.15 }}
          >
            {MESSAGES[msgIndex]}
          </p>
        </div>
      ) : (
        /*
          Logo container — mirrors the Hero's lockup container EXACTLY so
          the isotype sits at the same screen coordinates as the Hero's
          isotype, which is right behind the curtains.
        */
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-16 md:pb-20">
          <div
            className="loader-logo-anim"
            style={{
              opacity: revealing ? 0 : 1,
              transition: "opacity 0.5s ease-out",
              transitionDelay: revealing ? "0.3s" : "0s",
            }}
          >
            <LogoIsotype
              className="h-[120px] w-auto text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)] md:h-[160px]"
            />
          </div>

          {/*
            Invisible wordmark spacer with the SAME content and font-size
            as the Hero's <h1>, so the flex layout pushes the isotype up
            by the same amount in both places. Without this the loader's
            isotype would sit lower than the Hero's (the Hero has a real
            h1 below its logo that takes height) and the handoff would
            look like a jump.
          */}
          <h1
            aria-hidden="true"
            className="invisible mt-3 text-center md:mt-4"
            style={{ fontSize: "var(--text-hero-wordmark)" }}
          >
            <span style={{ fontWeight: 400 }}>Software for </span>
            <span style={{ fontWeight: 700 }}>Humans</span>
          </h1>
        </div>
      )}
    </div>
  );
}
