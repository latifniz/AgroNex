import type {Metadata} from "next";
import {Suspense} from "react";
import {getRouteLocale} from "@/i18n/server";
import {HeroSection} from "@/components/layout/hero-section";
import {FeaturedProducts} from "@/components/commerce/featured-products";
import {SITE_NAME, SITE_URL, buildCanonicalUrl} from "@/lib/metadata";
import {BadgeCheck, Tag, Zap, Mail, Phone} from "lucide-react";
import {Link} from '@/i18n/navigation';
import {getTranslations} from 'next-intl/server';
import {toOgLocale} from '@/i18n/locale-utils';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});
    const ogLocale = toOgLocale(locale);

    return {
        title: {
            absolute: `${SITE_NAME} - ${t('pageTitle')}`,
        },
        description: t('description'),
        alternates: {
            canonical: buildCanonicalUrl("/"),
        },
        openGraph: {
            title: `${SITE_NAME} - ${t('pageTitle')}`,
            description: t('ogDescription'),
            type: "website",
            locale: ogLocale,
            url: SITE_URL,
        },
    };
}

const featureKeys = [
    {icon: BadgeCheck, key: 'highQuality'},
    {icon: Tag, key: 'bestPrices'},
    {icon: Zap, key: 'fastDelivery'},
] as const;

export default async function Home() {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Home'});

    return (
        <div className="min-h-screen">
            <HeroSection/>
            <Suspense>
                <FeaturedProducts/>
            </Suspense>

            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-12">
                        {t('whyShopWithUs')}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {featureKeys.map((feature) => (
                            <div
                                key={feature.key}
                                className="group relative text-center space-y-4 rounded-xl border border-transparent bg-card p-8 transition-all duration-300 hover:border-border hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-full flex items-center justify-center transition-colors duration-300 group-hover:bg-primary/20">
                                    <feature.icon className="size-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">{t(`features.${feature.key}.title`)}</h3>
                                <p className="text-muted-foreground leading-relaxed">{t(`features.${feature.key}.description`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                        Get in Touch
                    </h2>
                    <p className="text-muted-foreground mb-10">
                        Have a question or want to try our platform? Reach out directly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <a
                            href="tel:+923191902669"
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-sm font-medium"
                        >
                            <Phone className="w-4 h-4 text-primary" />
                            +92 319 190 2669
                        </a>
                        <a
                            href="mailto:abdullatifnizamani517@gmail.com"
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-sm font-medium"
                        >
                            <Mail className="w-4 h-4 text-primary" />
                            abdullatifnizamani517@gmail.com
                        </a>
                    </div>
                    <Link
                        href="/contact"
                        className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                    >
                        View all contact options
                    </Link>
                </div>
            </section>
        </div>
    );
}
