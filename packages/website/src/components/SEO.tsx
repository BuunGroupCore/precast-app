import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any>;
}

const DEFAULT_TITLE = "Precast - The Superhero CLI Builder for Modern Web Projects";
const DEFAULT_DESCRIPTION =
  "Build TypeScript projects with superhuman speed! Precast is a powerful CLI tool that helps you scaffold modern web applications with your preferred technology stack.";
const DEFAULT_KEYWORDS =
  "precast, cli, typescript, react, vue, angular, nextjs, web development, scaffolding, boilerplate, starter, template";
const DEFAULT_IMAGE = "https://precast.dev/og-image.png";
const DEFAULT_URL = "https://precast.dev";
const DEFAULT_AUTHOR = "Buun Group";

export function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url = DEFAULT_URL,
  type = "website",
  author = DEFAULT_AUTHOR,
  publishedTime,
  modifiedTime,
  canonicalUrl,
  noindex = false,
  jsonLd,
}: SEOProps) {
  const location = useLocation();
  const currentUrl = `${url}${location.pathname}`;
  const canonical = canonicalUrl || currentUrl;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attributeName = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attributeName}="${property}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, property);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("author", author);
    updateMetaTag("robots", noindex ? "noindex, nofollow" : "index, follow");

    // Open Graph tags
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", image, true);
    updateMetaTag("og:url", canonical, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:site_name", "Precast", true);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    updateMetaTag("twitter:site", "@buungroup");
    updateMetaTag("twitter:creator", "@buungroup");

    // Article specific tags
    if (type === "article") {
      if (publishedTime) {
        updateMetaTag("article:published_time", publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag("article:modified_time", modifiedTime, true);
      }
      updateMetaTag("article:author", author, true);
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonical);

    // JSON-LD structured data
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      script.setAttribute("data-seo-jsonld", "true");
      document.head.appendChild(script);

      // Cleanup function to remove the script
      return () => {
        const oldScript = document.querySelector('script[data-seo-jsonld="true"]');
        if (oldScript) {
          oldScript.remove();
        }
      };
    }
  }, [
    title,
    description,
    keywords,
    image,
    canonical,
    type,
    author,
    publishedTime,
    modifiedTime,
    noindex,
    jsonLd,
  ]);

  return null;
}

// Pre-configured SEO components for common pages
export function HomePageSEO() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Precast CLI",
    description: "The superhero CLI builder for modern web projects",
    url: "https://precast.dev",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Buun Group",
      url: "https://buungroup.com",
    },
  };

  return <SEO jsonLd={jsonLd} />;
}

export function BuilderPageSEO() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Precast Project Builder",
    description: "Visual project builder for creating modern web applications",
    url: "https://precast.dev/builder",
    applicationCategory: "DeveloperApplication",
    screenshot: "https://precast.dev/builder-screenshot.png",
  };

  return (
    <SEO
      title="Project Builder - Precast CLI"
      description="Build your perfect tech stack with our visual project builder. Choose frameworks, backends, databases, and more!"
      jsonLd={jsonLd}
    />
  );
}

export function ComponentsPageSEO() {
  return (
    <SEO
      title="Component Libraries - Precast"
      description="Explore our collection of super-powered UI component libraries. From Brutalist UI to Comic Components, find the perfect style for your project."
    />
  );
}

export function DocsPageSEO() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Precast Documentation",
    description: "Complete documentation for the Precast CLI tool",
    url: "https://precast.dev/docs",
    author: {
      "@type": "Organization",
      name: "Buun Group",
    },
  };

  return (
    <SEO
      title="Documentation - Precast CLI"
      description="Learn how to use Precast CLI to build amazing projects. Complete guides, API references, and tutorials."
      type="article"
      jsonLd={jsonLd}
    />
  );
}
