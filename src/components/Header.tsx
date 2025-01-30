import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className={cn('w-full', className)}>
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Site Name */}
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-primary-foreground/20 rounded">
                {/* Logo placeholder */}
              </div>
              <span className="text-lg font-semibold">Your Website</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  asChild
                  className="text-primary-foreground hover:text-primary-foreground/90 hover:bg-primary-foreground/10"
                >
                  <a href={item.href}>{item.label}</a>
                </Button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open Menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-2 mt-8">
                  {navItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      asChild
                      className="justify-start"
                    >
                      <a href={item.href}>{item.label}</a>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
