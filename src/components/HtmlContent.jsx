import parse, { attributesToProps, domToReact } from "html-react-parser";
import { getInternalRoute } from "../lib/page-markup.js";

export default function HtmlContent({
  markup,
  navigate,
  videoRef,
  activeChapter,
  onChapterClick,
  onVideoTimeUpdate,
  onVideoError,
  videoUnavailable = false,
}) {
  function replace(node) {
    if (node.type !== "tag") return;

    if (node.name === "a" && node.attribs.href) {
      const path = getInternalRoute(node.attribs.href);
      if (path) {
        const props = attributesToProps(node.attribs);
        props.href = path;
        delete props.target;
        delete props.rel;
        props.onClick = (event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          ) {
            return;
          }
          event.preventDefault();
          navigate(path);
        };

        return <a {...props}>{domToReact(node.children, { replace })}</a>;
      }
    }

    if (node.name === "video") {
      if (videoUnavailable) {
        const poster = node.attribs.poster;
        return (
          <a
            className="reel-card"
            href="https://www.youtube.com/watch?v=ZlCVNoSkNU4"
            target="_blank"
            rel="noopener noreferrer"
            style={poster ? { backgroundImage: `url("${poster}")` } : undefined}
          >
            <span className="pl"><i /></span>
            <span className="lb">Play the reel on YouTube</span>
          </a>
        );
      }

      const props = attributesToProps(node.attribs);
      props.src = "/assets/highlight-reel.mp4";
      props.ref = videoRef;
      props.onTimeUpdate = onVideoTimeUpdate;
      props.onError = onVideoError;
      return <video {...props} />;
    }

    if (node.name === "button" && node.attribs.class?.split(" ").includes("chapter")) {
      const props = attributesToProps(node.attribs);
      const index = Number(node.attribs["data-index"]);
      props.className = `${props.className || ""}${activeChapter === index ? " active" : ""}`;
      props.onClick = () => onChapterClick(Number(node.attribs["data-t"]) || 0);
      return <button {...props}>{domToReact(node.children, { replace })}</button>;
    }

    if (node.name === "a" && node.attribs.id === "reel-download") {
      const props = attributesToProps(node.attribs);
      props.href = "https://www.youtube.com/watch?v=ZlCVNoSkNU4";
      props.target = "_blank";
      props.rel = "noopener noreferrer";
      delete props.download;
      return <a {...props}>Watch on YouTube ↗</a>;
    }
  }

  return parse(markup, { replace });
}
