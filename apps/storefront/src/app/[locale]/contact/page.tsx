import type {Metadata} from 'next';
import {Mail, Phone} from 'lucide-react';
import {SITE_NAME, buildCanonicalUrl} from '@/lib/metadata';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: `Get in touch with the ${SITE_NAME} team.`,
    alternates: {
        canonical: buildCanonicalUrl('/contact'),
    },
};

function LinkedInIcon({className}: {className?: string}) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
    );
}

export default function ContactPage() {
    const contacts = [
        {
            icon: <Phone className="w-5 h-5 text-primary" />,
            label: 'Phone',
            value: '+92 319 190 2669',
            href: 'tel:+923191902669',
        },
        {
            icon: <Mail className="w-5 h-5 text-primary" />,
            label: 'Email',
            value: 'abdullatifnizamani517@gmail.com',
            href: 'mailto:abdullatifnizamani517@gmail.com',
        },
        {
            icon: <LinkedInIcon className="w-5 h-5 text-primary" />,
            label: 'LinkedIn',
            value: 'linkedin.com/in/abdullatifniz',
            href: 'https://linkedin.com/in/abdullatifniz',
        },
    ];

    return (
        <div className="container mx-auto px-4 py-24 mt-16 max-w-2xl">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Contact Us</h1>
                <p className="text-muted-foreground">
                    Have a question or want to try our platform? Reach out directly.
                </p>
            </div>

            <div className="space-y-4">
                {contacts.map(({icon, label, value, href}) => (
                    <a
                        key={label}
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all group"
                    >
                        <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            {icon}
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                            <p className="font-medium text-sm">{value}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
