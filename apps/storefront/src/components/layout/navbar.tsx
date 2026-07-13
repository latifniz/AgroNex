import Image from "next/image";
import {NavigationLink} from '@/components/shared/navigation-link';
import {NavbarCollections} from '@/components/layout/navbar/navbar-collections';
import {NavbarCart} from '@/components/layout/navbar/navbar-cart';
import {NavbarUser} from '@/components/layout/navbar/navbar-user';
import {ThemeSwitcher} from '@/components/layout/navbar/theme-switcher';
import {CurrencyPickerWrapper} from '@/components/layout/navbar/currency-picker-wrapper';
import {MobileNavWrapper} from '@/components/layout/navbar/mobile-nav-wrapper';
import {Suspense} from "react";
import {SearchInput} from '@/components/layout/search-input';
import {NavbarUserSkeleton} from '@/components/shared/skeletons/navbar-user-skeleton';
import {SearchInputSkeleton} from '@/components/shared/skeletons/search-input-skeleton';
import {ChannelSwitcher} from '@/components/layout/navbar/channel-switcher';
import {cookies} from 'next/headers';

export async function Navbar() {
    const cookieStore = await cookies();
    const channelToken = cookieStore.get('agronex-channel')?.value ?? null;
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md bg-background/80">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Suspense>
                            <MobileNavWrapper />
                        </Suspense>
                        <NavigationLink href="/" className="shrink-0">
                            <Image src="/agronex.svg" alt="AgroNex" width={196} height={44} priority unoptimized className="dark:invert" style={{width: '196px', height: '44px', maxWidth: 'none'}} />
                        </NavigationLink>
                        <nav className="hidden md:flex items-center gap-6">
                            <Suspense>
                                <NavbarCollections/>
                            </Suspense>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex">
                            <Suspense fallback={<SearchInputSkeleton />}>
                                <SearchInput/>
                            </Suspense>
                        </div>
                        <Suspense>
                            <CurrencyPickerWrapper />
                        </Suspense>
                        <Suspense>
                            <ThemeSwitcher />
                        </Suspense>
                        <Suspense>
                            <ChannelSwitcher initialChannel={channelToken} />
                        </Suspense>
                        <Suspense>
                            <NavbarCart/>
                        </Suspense>
                        <Suspense fallback={<NavbarUserSkeleton />}>
                            <NavbarUser/>
                        </Suspense>
                        {process.env.NEXT_PUBLIC_DASHBOARD_URL && (
                            <a
                                href={process.env.NEXT_PUBLIC_DASHBOARD_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden sm:inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                                Dashboard
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
