export interface FooterProps {
  copyright?: string;
  links?: Array<{ label: string; href: string }>;
}

export function Footer({
  copyright = `© ${new Date().getFullYear()} Precast. All rights reserved.`,
  links = [],
}: FooterProps) {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm mb-4 md:mb-0">{copyright}</div>

          <nav className="flex space-x-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
