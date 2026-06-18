'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { ShoppingBag, Package, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const CHANNEL_COOKIE = 'agronex-channel';

export function ChannelSwitcher() {
    const [channel, setChannel] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const value = document.cookie
            .split(';')
            .find(c => c.trim().startsWith(`${CHANNEL_COOKIE}=`))
            ?.split('=')[1];
        setChannel(value ?? null);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const doSwitch = (next: string) => {
        const label = next === 'retail-token' ? 'Retailer' : 'Wholesaler';
        document.cookie = `${CHANNEL_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
        setChannel(next);
        setOpen(false);
        toast.success(`Switched to ${label}`);
        router.refresh();
    };

    if (!channel) return null;

    const isRetail = channel === 'retail-token';
    const nextToken = isRetail ? 'wholesale-token' : 'retail-token';
    const nextLabel = isRetail ? 'Wholesaler' : 'Retailer';
    const NextIcon = isRetail ? Package : ShoppingBag;

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
            >
                {isRetail ? <ShoppingBag className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                {isRetail ? 'Retailer' : 'Wholesaler'}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>

            {open && (
                <div className="absolute top-full mt-2 right-0 w-52 bg-background border border-border rounded-xl shadow-lg p-3 z-50">
                    <p className="text-xs text-muted-foreground mb-3">Switch buying mode</p>
                    <button
                        onClick={() => doSwitch(nextToken)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                    >
                        <NextIcon className="h-4 w-4 text-primary" />
                        Switch to {nextLabel}
                    </button>
                    <button
                        onClick={() => setOpen(false)}
                        className="w-full text-center text-xs text-muted-foreground mt-2 py-1 hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
