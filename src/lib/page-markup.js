export function extractPageMarkup(source, pageId) {
  const document = new DOMParser().parseFromString(source, "text/html");

  if (!pageId) return document.body.innerHTML;

  const page = document.getElementById(pageId);
  if (!page) {
    throw new Error(`The portfolio content is missing the "${pageId}" page.`);
  }

  page.removeAttribute("hidden");
  return page.outerHTML;
}

export function getInternalRoute(href) {
  if (href === "#works") return "/works";
  if (href === "#behind-the-work") return "/behind";
  if (href === "#portfolio") return "/";

  let url;
  try {
    url = new URL(href, window.location.origin);
  } catch {
    return null;
  }

  if (url.hostname !== "paolopedroso.my.canva.site") return null;
  if (url.pathname.includes("highlight2026")) return "/highlight";
  if (url.pathname.includes("portfolio2026")) {
    if (url.hash === "#works") return "/works";
    if (url.hash === "#behind-the-work") return "/behind";
    return "/";
  }

  return null;
}
