'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { ShoppingBag, Package } from 'lucide-react';

const CHANNEL_COOKIE = 'agronex-channel';

export function ChannelPicker() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasChannel = document.cookie
      .split(';')
      .some((c) => c.trim().startsWith(`${CHANNEL_COOKIE}=`));
    if (!hasChannel) {
      setOpen(true);
    }
  }, []);

  const selectChannel = (token: string) => {
    document.cookie = `${CHANNEL_COOKIE}=${token}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setOpen(false);
    router.refresh();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-2">Welcome to AgroNex</h2>
        <p className="text-muted-foreground text-center mb-8">
          How do you buy? We'll show you the right prices.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => selectChannel('retail-token')}
            className="flex flex-col items-center gap-3 rounded-xl border-2 border-muted p-6 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
          >
            <ShoppingBag className="h-10 w-10 text-primary" />
            <div className="text-center">
              <p className="font-semibold text-base">Retailer</p>
              <p className="text-xs text-muted-foreground mt-1">Small quantities, standard prices</p>
            </div>
          </button>
          <button
            onClick={() => selectChannel('wholesale-token')}
            className="flex flex-col items-center gap-3 rounded-xl border-2 border-muted p-6 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
          >
            <Package className="h-10 w-10 text-primary" />
            <div className="text-center">
              <p className="font-semibold text-base">Wholesaler</p>
              <p className="text-xs text-muted-foreground mt-1">Bulk orders, wholesale prices</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
