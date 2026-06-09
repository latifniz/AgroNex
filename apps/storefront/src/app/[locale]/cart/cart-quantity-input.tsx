'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { adjustQuantity } from './actions';

interface CartQuantityInputProps {
  lineId: string;
  initialQuantity: number;
}

export function CartQuantityInput({ lineId, initialQuantity }: CartQuantityInputProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const syncToServer = (newQty: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const result = await adjustQuantity(lineId, newQty);
        if (result.insufficientStock && result.quantityAvailable !== undefined) {
          setQuantity(result.quantityAvailable);
          toast.warning('Not enough stock', {
            description: `Only ${result.quantityAvailable} units available.`,
          });
        }
      });
    }, 400);
  };

  const handleChange = (newQty: number) => {
    if (newQty < 1) return;
    setQuantity(newQty);
    syncToServer(newQty);
  };

  const handleInputChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1) {
      setQuantity(num);
      syncToServer(num);
    } else if (value === '') {
      setQuantity(1);
    }
  };

  return (
    <div className="flex items-center gap-1 border rounded-full bg-muted/50">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-background"
        disabled={quantity <= 1 || isPending}
        onClick={() => handleChange(quantity - 1)}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <input
        type="number"
        min={1}
        value={quantity}
        onChange={e => handleInputChange(e.target.value)}
        className="w-14 text-center font-semibold tabular-nums bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full hover:bg-background"
        disabled={isPending}
        onClick={() => handleChange(quantity + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
