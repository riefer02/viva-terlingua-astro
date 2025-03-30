import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatSlug } from '@/utils/url';
import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';

interface NavigationItem {
  title?: string;
  name?: string;
  website?: string;
  url?: string;
  slug?: string;
}

interface NavigationSection {
  items: NavigationItem[];
  path: string;
}

interface ExploreDropdownProps {
  navigationData: Record<string, NavigationSection>;
}

export function ExploreDropdown({ navigationData }: ExploreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Close dropdown when Escape key is pressed
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Focus management - focus first link when dropdown opens
  useEffect(() => {
    if (isOpen && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Only run on client-side
    if (typeof document === 'undefined') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="explore-dropdown-menu"
        className={cn(
          'bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 hover:text-primary-foreground focus-visible:bg-primary-foreground/30',
          isOpen && 'bg-primary-foreground/30'
        )}
      >
        Explore
        <ChevronDown
          className={cn(
            'ml-1 h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </Button>

      {isOpen && (
        <div
          id="explore-dropdown-menu"
          className="absolute right-0 mt-2 w-[800px] md:w-[1000px] rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 z-50"
          role="menu"
        >
          <div className="grid grid-cols-4 gap-4 p-4">
            {Object.entries(navigationData)
              .filter(([category]) => category !== 'Blogs')
              .map(([category, section], categoryIndex) => (
                <div key={category} className="space-y-2">
                  <a
                    href={`/${formatSlug(section.path)}`}
                    className="block font-medium text-lg text-foreground hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm px-1"
                    role="menuitem"
                    ref={categoryIndex === 0 ? firstLinkRef : null}
                  >
                    {category}
                  </a>
                  <hr className="my-2" />
                  <ul className="space-y-2" role="menu">
                    {section.items.map((item, index) => {
                      const isExternalLink =
                        category === 'Local Attractions' ||
                        category === 'Sponsors';
                      const href = isExternalLink
                        ? item.website || item.url || '#'
                        : category === 'Music'
                          ? `/musicians/${formatSlug(item.slug || '')}`
                          : `/${formatSlug(section.path)}/${formatSlug(item.slug || '')}`;
                      const label = item.title || item.name || '';

                      return (
                        <li key={index}>
                          <a
                            href={href}
                            className="block text-sm text-muted-foreground hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm px-1 truncate"
                            target={isExternalLink ? '_blank' : undefined}
                            rel={
                              isExternalLink ? 'noopener noreferrer' : undefined
                            }
                            role="menuitem"
                          >
                            {label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
