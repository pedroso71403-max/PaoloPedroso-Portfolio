import parse, { attributesToProps, domToReact } from "html-react-parser";
import { getInternalRoute } from "../lib/page-markup.js";

export default function HtmlContent({ markup, navigate }) {
  function replace(node) {
    if (node.type !== "tag" || node.name !== "a" || !node.attribs.href) {
      return;
    }

    const path = getInternalRoute(node.attribs.href);
    if (!path) return;

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

  return parse(markup, { replace });
}
