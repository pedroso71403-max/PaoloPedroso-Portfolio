import { useCallback, useEffect, useRef } from "react";

function localRoute(href) {
  try {
    const url = new URL(href, window.location.origin);
    if (url.hostname !== "paolopedroso.my.canva.site") return null;
    if (url.pathname.includes("highlight2026")) return "/highlight";
    if (url.pathname.includes("2024-works")) return "/works";
    if (url.pathname.includes("portfolio2026")) {
      if (url.hash === "#behind-the-work") return "/behind";
      if (url.hash === "#works") return "/works";
      return "/";
    }
  } catch {
    return null;
  }
  return null;
}

export default function ExportPage({ src, title }) {
  const frameRef = useRef(null);
  const cleanupRef = useRef(null);

  const sizeAndRouteLinks = useCallback(() => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!frame || !doc) return undefined;

    const syncHeight = () => {
      frame.style.height = `${Math.max(
        doc.documentElement.scrollHeight,
        doc.body?.scrollHeight || 0,
        window.innerHeight,
      )}px`;
    };

    doc.querySelectorAll("a[href]").forEach((anchor) => {
      const route = localRoute(anchor.href);
      if (route) {
        anchor.href = route;
        anchor.target = "_top";
        anchor.dataset.localRoute = route;
      }
    });

    const handleLocalNavigation = (event) => {
      const anchor = event.target.closest?.("a[data-local-route]");
      if (
        !anchor ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      event.preventDefault();
      window.parent.postMessage(
        { type: "portfolio:navigate", path: anchor.dataset.localRoute },
        window.location.origin,
      );
    };
    doc.addEventListener("click", handleLocalNavigation);
    doc.querySelectorAll("img:not([loading])").forEach((img) => {
      img.loading = "lazy";
    });

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(doc.documentElement);
    if (doc.body) observer.observe(doc.body);
    window.addEventListener("resize", syncHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
      doc.removeEventListener("click", handleLocalNavigation);
    };
  }, []);

  const handleLoad = () => {
    cleanupRef.current?.();
    cleanupRef.current = sizeAndRouteLinks();
  };

  useEffect(() => () => cleanupRef.current?.(), []);

  return (
    <iframe
      ref={frameRef}
      className="export-page-frame"
      src={src}
      title={title}
      onLoad={handleLoad}
      scrolling="no"
    />
  );
}
