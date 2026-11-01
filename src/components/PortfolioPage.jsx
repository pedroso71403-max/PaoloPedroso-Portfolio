import { useEffect, useMemo, useRef } from "react";
import HtmlContent from "./HtmlContent.jsx";
import { extractPageMarkup } from "../lib/page-markup.js";

export default function PortfolioPage({ source, pageId, navigate }) {
  const contentRef = useRef(null);
  const markup = useMemo(
    () => extractPageMarkup(source, pageId),
    [source, pageId],
  );

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const handleBookFilter = (event) => {
      const chip = event.target.closest("#page-behind .chip");
      if (!chip || !root.contains(chip)) return;

      const filter = chip.getAttribute("data-f");
      root.querySelectorAll("#page-behind .chip").forEach((item) => {
        item.classList.toggle("on", item === chip);
      });
      root.querySelectorAll("#page-behind .book").forEach((book) => {
        book.hidden = filter !== "all" && book.getAttribute("data-c") !== filter;
      });
    };

    root.addEventListener("click", handleBookFilter);

    const dots = Array.from(root.querySelectorAll(".side-dot"));
    const sections = dots
      .map((dot) => document.getElementById(dot.dataset.section))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = sections.indexOf(entry.target);
          dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === index);
          });
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      root.removeEventListener("click", handleBookFilter);
      observer.disconnect();
    };
  }, [pageId]);

  return (
    <div ref={contentRef} className="react-content portfolio-route">
      <HtmlContent markup={markup} navigate={navigate} />
    </div>
  );
}
