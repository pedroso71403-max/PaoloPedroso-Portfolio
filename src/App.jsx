import { useEffect, useState } from "react";
import portfolioContent from "./content/portfolio.html?raw";
import highlightContent from "./content/highlight.html?raw";
import PortfolioPage from "./components/PortfolioPage.jsx";
import HighlightPage from "./components/HighlightPage.jsx";
import "./styles/portfolio.css";
import "./styles/highlight.css";

function currentRoute() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return ["/works", "/behind", "/highlight"].includes(path) ? path : "/";
}

export default function App() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    const handlePopState = () => setRoute(currentRoute());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(path) {
    if (path !== window.location.pathname) {
      window.history.pushState(null, "", path);
    }
    setRoute(path);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  useEffect(() => {
    if (route === "/works") document.title = "Selected Work — Paolo Pedroso";
    else if (route === "/behind") document.title = "Behind the Work — Paolo Pedroso";
    else if (route === "/highlight") document.title = "My Highlight — Paolo Pedroso";
    else document.title = "Paolo Pedroso";
  }, [route]);

  if (route === "/highlight") {
    return <HighlightPage source={highlightContent} navigate={navigate} />;
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
