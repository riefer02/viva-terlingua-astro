import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { mobileNavLinks } from '@/config/navigation';

export function MobileNavigation() {
  return (
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
          {mobileNavLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className="justify-start text-lg"
            >
              <a href={link.href}>{link.label}</a>
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
