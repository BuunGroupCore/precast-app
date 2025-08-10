import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { INTERNAL_LINKS, SOCIAL_MEDIA, ORGANIZATIONS } from "@/config/constants";

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
  jsonLd?: Record<string, unknown>;
}

const DEFAULT_TITLE = "Precast - The Superhero CLI Builder for Modern Web Projects";
const DEFAULT_DESCRIPTION =
  "Build TypeScript projects with superhuman speed! Precast is a powerful CLI tool that helps you scaffold modern web applications with your preferred technology stack.";
const DEFAULT_KEYWORDS =
  "precast, cli, typescript, react, vue, angular, nextjs, web development, scaffolding, boilerplate, starter, template";
const DEFAULT_IMAGE = `${INTERNAL_LINKS.PRECAST_URL}/og-image.png`;
const DEFAULT_URL = INTERNAL_LINKS.PRECAST_URL;
const DEFAULT_AUTHOR = ORGANIZATIONS.BUUN_GROUP;

/**
 * SEO component for managing meta tags, Open Graph, Twitter Cards, and structured data.
 * Updates document head with appropriate meta tags for search engines and social media.
 */
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
    document.title = title;

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

    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("author", author);
    updateMetaTag("robots", noindex ? "noindex, nofollow" : "index, follow");

    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", image, true);
    updateMetaTag("og:url", canonical, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:site_name", "Precast", true);

    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    updateMetaTag("twitter:site", SOCIAL_MEDIA.TWITTER_HANDLE);
    updateMetaTag("twitter:creator", SOCIAL_MEDIA.TWITTER_HANDLE);

    if (type === "article") {
      if (publishedTime) {
        updateMetaTag("article:published_time", publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag("article:modified_time", modifiedTime, true);
      }
      updateMetaTag("article:author", author, true);
    }

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonical);

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      script.setAttribute("data-seo-jsonld", "true");
      document.head.appendChild(script);

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

/**
 * Pre-configured SEO component for the home page.
 * Includes WebApplication schema structured data.
 */
export function HomePageSEO() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Precast CLI",
    description: "The superhero CLI builder for modern web projects",
    url: INTERNAL_LINKS.PRECAST_URL,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: ORGANIZATIONS.BUUN_GROUP,
      url: "https://buungroup.com",
    },
  };

  return <SEO jsonLd={jsonLd} />;
}

/**
 * Pre-configured SEO component for the builder page.
 * Includes SoftwareApplication schema structured data.
 */
export function BuilderPageSEO() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Precast Project Builder",
    description: "Visual project builder for creating modern web applications",
    url: `${INTERNAL_LINKS.PRECAST_URL}/builder`,
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

/**
 * Pre-configured SEO component for the components page.
 */
export function ComponentsPageSEO() {
  return (
    <SEO
      title="Component Libraries - Precast"
      description="Explore our collection of super-powered UI component libraries. From Brutalist UI to Comic Components, find the perfect style for your project."
    />
  );
}

/**
 * Pre-configured SEO component for the documentation page.
 * Includes TechArticle schema structured data.
 */
export function DocsPageSEO() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Precast Documentation",
    description: "Complete documentation for the Precast CLI tool",
    url: INTERNAL_LINKS.PRECAST_DOCS,
    author: {
      "@type": "Organization",
      name: ORGANIZATIONS.BUUN_GROUP,
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

/**
 * Pre-configured SEO component for the testimonials page.
 * Includes ItemList schema structured data for testimonials.
 */
export function TestimonialsPageSEO({ testimonialsCount = 0 }: { testimonialsCount?: number }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "PRECAST Hero League Testimonials",
    description: "Developer testimonials and success stories from the PRECAST Hero League",
    url: INTERNAL_LINKS.PRECAST_TESTIMONIALS,
    isPartOf: {
      "@type": "WebSite",
      name: "PRECAST",
      url: INTERNAL_LINKS.PRECAST_URL,
    },
    about: {
      "@type": "SoftwareApplication",
      name: "PRECAST",
      description: "Developer tools and templates for building amazing projects",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Developer Testimonials",
      description: "Reviews and success stories from PRECAST users",
      numberOfItems: testimonialsCount,
    },
  };

  return (
    <SEO
      title="PRECAST Hero League - Developer Testimonials | Success Stories"
      description="Read testimonials from developers who joined the PRECAST Hero League. Discover success stories from our coding superheroes who built amazing projects with our tools and templates."
      keywords="PRECAST testimonials, developer reviews, success stories, coding heroes, web development tools, project templates, developer experiences"
      image="https://precast.dev/og-testimonials.png"
      jsonLd={jsonLd}
    />
  );
}

/**
 * Pre-configured SEO component for the Our Projects page.
 * Includes Organization schema structured data.
 */
export function ProjectsPageSEO() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Buun Group Open Source Projects",
    description: "Collection of open source projects from Buun Group",
    url: `${INTERNAL_LINKS.PRECAST_URL}/projects`,
    publisher: {
      "@type": "Organization",
      name: ORGANIZATIONS.BUUN_GROUP,
      url: "https://buungroup.com",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Open Source Projects",
      description: "List of open source projects developed by Buun Group",
    },
  };

  return (
    <SEO
      title="Our Projects - Buun Group | Open Source Projects"
      description="Explore open source projects from Buun Group including Precast, Starfighters, Piixels.art, and more. Join our community of developers building amazing tools."
      keywords="buun group projects, open source, precast, starfighters, piixels, brutalist ui, developer tools, open source projects"
      image="https://precast.dev/og-projects.png"
      jsonLd={jsonLd}
    />
  );
}

/**
 * Pre-configured SEO component for the roadmap page.
 */
export function RoadmapPageSEO() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Precast Development Roadmap",
    description: "Future support and testing for upcoming tools and frameworks in Precast",
    url: `${INTERNAL_LINKS.PRECAST_URL}/roadmap`,
    publisher: {
      "@type": "Organization",
      name: ORGANIZATIONS.BUUN_GROUP,
    },
  };

  return (
    <SEO
      title="Roadmap - Precast | Upcoming Features & Framework Support"
      description="See what's coming next to Precast. Track our progress on Angular, Nuxt, Remix, SolidJS, Fastify, Supabase, Firebase, Material UI, Clerk, and more."
      keywords="precast roadmap, upcoming features, framework support, angular, nuxt, remix, solidjs, supabase, firebase, material ui, clerk"
      jsonLd={jsonLd}
    />
  );
}
