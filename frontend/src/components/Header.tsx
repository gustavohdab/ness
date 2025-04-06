'use client'; // If using client-side components like NavigationMenu

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'; // Assuming Shadcn setup
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from 'lucide-react'; // Example icon, need to install lucide-react
import Link from 'next/link';
import { useState } from 'react'; // Need state for sheet open/close

export function Header() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const closeSheet = () => setIsSheetOpen(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="font-bold">AI Dev Matcher</span>
                </Link>

                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/jobs" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Jobs
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/developers" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Developers
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger
                        className="md:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                        aria-label="Toggle Menu"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>
                                <Link href="/" onClick={closeSheet}>
                                    AI Dev Matcher
                                </Link>
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col space-y-4 mt-6">
                            <SheetClose asChild>
                                <Link href="/jobs" className="text-lg font-medium text-foreground/80 hover:text-foreground">
                                    Jobs
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/developers" className="text-lg font-medium text-foreground/80 hover:text-foreground">
                                    Developers
                                </Link>
                            </SheetClose>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
} 