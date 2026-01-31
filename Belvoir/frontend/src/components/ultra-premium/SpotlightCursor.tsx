import { useEffect, useRef, useState, memo } from "react";
import { gsap } from "gsap";

export const SpotlightCursor = memo(() => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check for fine pointer and reduced motion
    const hasFinPointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!hasFinPointer || prefersReducedMotion) return;

    setIsVisible(true);

    const spotlight = spotlightRef.current;
    const trail = trailRef.current;
    if (!spotlight || !trail) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Smooth movement using GSAP ticker
    const updatePosition = () => {
      gsap.to(spotlight, {
        x: mousePos.current.x - 150,
        y: mousePos.current.y - 150,
        duration: 0.3,
        overwrite: "auto",
        ease: "power2.out",
      });

      gsap.to(trail, {
        x: mousePos.current.x - 250,
        y: mousePos.current.y - 250,
        duration: 0.6,
        overwrite: "auto",
        ease: "power2.out",
      });
    };

    // Handle hover states
    const handleLinkEnter = () => {
      gsap.to(spotlight, { scale: 1.5, duration: 0.3, ease: "power2.out" });
    };

    const handleLinkLeave = () => {
      gsap.to(spotlight, { scale: 1, duration: 0.3, ease: "power2.out" });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    gsap.ticker.add(updatePosition);

    // Optimized hover detection
    const addListeners = (elements: NodeListOf<Element>) => {
      elements.forEach((el) => {
        el.addEventListener("mouseenter", handleLinkEnter);
        el.addEventListener("mouseleave", handleLinkLeave);
      });
    };

    const interactiveElements = document.querySelectorAll(
      "a, button, [data-cursor-hover]",
    );
    addListeners(interactiveElements);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              const elements = node.querySelectorAll(
                "a, button, [data-cursor-hover]",
              );
              if (node.matches("a, button, [data-cursor-hover]")) {
                node.addEventListener("mouseenter", handleLinkEnter);
                node.addEventListener("mouseleave", handleLinkLeave);
              }
              addListeners(elements);
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(updatePosition);
      observer.disconnect();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={trailRef}
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-[9998] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(184, 115, 51, 0.08) 0%, transparent 60%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={spotlightRef}
        className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-[9999] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(184, 115, 51, 0.15) 0%, rgba(139, 92, 36, 0.05) 40%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
});

SpotlightCursor.displayName = "SpotlightCursor";
export default SpotlightCursor;
