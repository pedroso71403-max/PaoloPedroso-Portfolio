import { useEffect, useState } from "react";
import portfolioContent from "./content/portfolio.html?raw";
import PortfolioPage from "./components/PortfolioPage.jsx";
import ExportPage from "./components/ExportPage.jsx";
import "./styles/portfolio.css";

function currentRoute() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return ["/works", "/behind", "/highlight"].includes(path) ? path : "/";
}

export default function App() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    const handlePopState = () => setRoute(currentRoute());
    const handlePageNavigation = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "portfolio:navigate") return;
      const path = event.data.path;
      if (!["/", "/works", "/behind", "/highlight"].includes(path)) return;
      if (path !== window.location.pathname) {
        window.history.pushState(null, "", path);
      }
      setRoute(path);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("message", handlePageNavigation);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("message", handlePageNavigation);
    };
  }, []);

  function navigate(path) {
    if (path !== window.location.pathname) {
      window.history.pushState(null, "", path);
    }
    setRoute(path);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  useEffect(() => {
    if (route === "/works") document.title = "2024 Works — Paolo Pedroso";
    else if (route === "/behind") document.title = "Behind the Work — Paolo Pedroso";
    else if (route === "/highlight") document.title = "My Highlight — Paolo Pedroso";
    else document.title = "Paolo Pedroso";
  }, [route]);

  if (route === "/") {
    return <ExportPage src="/exports/portfolio.html" title="Paolo Pedroso portfolio" />;
  }

  if (route === "/works") {
    return <ExportPage src="/exports/garten-und-ich.html" title="Garten & Ich — 2024 Works" />;
  }

  if (route === "/highlight") {
    return <ExportPage src="/exports/highlight.html" title="Paolo Pedroso highlight" />;
  }

  const pageId = {
    "/": "page-portfolio",
    "/works": "page-works",
    "/behind": "page-behind",
  }[route];

  return (
    <PortfolioPage
      source={portfolioContent}
      pageId={pageId}
      navigate={navigate}
    />
  );
}
