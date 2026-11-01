import { useMemo, useRef, useState } from "react";
import HtmlContent from "./HtmlContent.jsx";
import { extractPageMarkup } from "../lib/page-markup.js";

const YOUTUBE_URL = "https://www.youtube.com/watch?v=ZlCVNoSkNU4";

export default function HighlightPage({ source, navigate }) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const markup = useMemo(() => extractPageMarkup(source), [source]);

  function handleVideoTimeUpdate(event) {
    const buttons = rootRef.current?.querySelectorAll(".chapter") || [];
    let activeIndex = 0;
    buttons.forEach((button, index) => {
      if (event.currentTarget.currentTime >= Number(button.dataset.t) - 0.05) {
        activeIndex = index;
      }
    });
    setActiveChapter((current) => current === activeIndex ? current : activeIndex);
  }

  function handleChapterClick(seconds) {
    const video = videoRef.current;
    if (videoUnavailable) {
      window.open(`${YOUTUBE_URL}&t=${Math.floor(seconds)}s`, "_blank", "noopener");
    } else if (video) {
      const seekAndPlay = () => {
        video.currentTime = seconds;
        video.play().catch(() => {});
      };
      if (video.readyState >= 1) {
        seekAndPlay();
      } else {
        video.addEventListener("loadedmetadata", seekAndPlay, { once: true });
      }
    }

    setActiveChapter(
      Array.from(rootRef.current?.querySelectorAll(".chapter") || [])
        .findIndex((button) => Number(button.dataset.t) === seconds),
    );
    rootRef.current
      ?.querySelector("#reel-frame")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div ref={rootRef} className="react-content highlight-route">
      <HtmlContent
        markup={markup}
        navigate={navigate}
        videoRef={videoRef}
        activeChapter={activeChapter}
        onChapterClick={handleChapterClick}
        onVideoTimeUpdate={handleVideoTimeUpdate}
        onVideoError={() => setVideoUnavailable(true)}
        videoUnavailable={videoUnavailable}
      />
    </div>
  );
}
