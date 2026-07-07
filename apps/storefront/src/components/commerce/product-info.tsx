'use client';

import { useState, useMemo, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, CheckCircle2, Minus, Plus } from 'lucide-react';
import { addToCart } from '@/app/[locale]/product/[slug]/actions';
import { toast } from 'sonner';
import { Price } from '@/components/commerce/price';
import { useTranslations } from 'next-intl';

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    description: string;
    variants: Array<{
      id: string;
      name: string;
      sku: string;
      priceWithTax: number;
      stockLevel: string;
      customFields?: { minOrderQuantity?: number | null } | null;
      options: Array<{
        id: string;
        code: string;
        name: string;
        groupId: string;
        group: {
          id: string;
          code: string;
          name: string;
        };
      }>;
    }>;
    optionGroups: Array<{
      id: string;
      code: string;
      name: string;
      options: Array<{
        id: string;
        code: string;
        name: string;
      }>;
    }>;
    customFields: {
      cropType: string | null;
      season: string | null;
      registrationNo: string | null;
    } | null;
  };
  searchParams: { [key: string]: string | string[] | undefined };
  currencyCode: string;
  channelToken?: string;
}

const formatLabel = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export function ProductInfo({
  product,
  searchParams,
  currencyCode,
  channelToken,
}: ProductInfoProps) {
  const t = useTranslations('Product');
  const pathname = usePathname();
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1) setQuantity(num);
    else if (value === '') setQuantity(1);
  };

  // Initialize selected options from URL
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const initialOptions: Record<string, string> = {};

    // Load from URL search params
    product.optionGroups.forEach(group => {
      const paramValue = searchParams[group.code];
      if (typeof paramValue === 'string') {
        // Find the option by code
        const option = group.options.find(opt => opt.code === paramValue);
        if (option) {
          initialOptions[group.id] = option.id;
        }
      }
    });

    return initialOptions;
  });

  // Find the matching variant based on selected options
  const selectedVariant = useMemo(() => {
    if (product.variants.length === 1) {
      return product.variants[0];
    }

    // If not all option groups have a selection, return null
    if (Object.keys(selectedOptions).length !== product.optionGroups.length) {
      return null;
    }

    // Find variant that matches all selected options
    return product.variants.find(variant => {
      const variantOptionIds = variant.options.map(opt => opt.id);
      const selectedOptionIds = Object.values(selectedOptions);
      return selectedOptionIds.every(optId => variantOptionIds.includes(optId));
    });
  }, [selectedOptions, product.variants, product.optionGroups]);

  const handleOptionChange = (groupId: string, optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupId]: optionId,
    }));

    // Find the option group and option to get their codes
    const group = product.optionGroups.find(g => g.id === groupId);
    const option = group?.options.find(opt => opt.id === optionId);

    if (group && option) {
      // Update URL with option code
      const params = new URLSearchParams(currentSearchParams);
      params.set(group.code, option.code);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    startTransition(async () => {
      const result = await addToCart(selectedVariant.id, quantity);

      if (result.success) {
        setIsAdded(true);
        if (result.insufficientStock) {
          setQuantity(result.quantityAvailable);
          toast.warning('Not enough stock', {
            description: `Only ${result.quantityAvailable} units available. Added ${result.quantityAvailable} to your cart.`,
          });
        } else {
          toast.success(t('addedToCartMessage'), {
            description: t('addedToCartDescription', { name: product.name }),
          });
        }
        setTimeout(() => setIsAdded(false), 2000);
      } else {
        toast.error(t('errorTitle'), {
          description: result.error || t('errorAddToCart'),
        });
      }
    });
  };

  const isInStock =
    selectedVariant && selectedVariant.stockLevel !== 'OUT_OF_STOCK';
  const canAddToCart = selectedVariant && isInStock;

  return (
    <div className="space-y-6">
      {/* Product Title & Price */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {product.name}
        </h1>
        {selectedVariant && (
          <p className="text-2xl md:text-3xl text-muted-foreground font-semibold mt-3">
            <Price
              value={selectedVariant.priceWithTax}
              currencyCode={currencyCode}
            />
          </p>
        )}
      </div>

      <Separator />

      {/* Product Description */}
      <div className="prose prose-sm max-w-none text-muted-foreground">
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>

      {/* Custom Fields */}
      {product.customFields && (
        <div className="flex flex-wrap gap-2 text-sm">
          {product.customFields.cropType && (
            <span className="rounded-full bg-muted px-3 py-1">
              Crop: {formatLabel(product.customFields.cropType)}
            </span>
          )}
          {product.customFields.season && (
            <span className="rounded-full bg-muted px-3 py-1">
              Season: {formatLabel(product.customFields.season)}
            </span>
          )}
          {product.customFields.registrationNo && (
            <span className="rounded-full bg-muted px-3 py-1">
              Reg No: {product.customFields.registrationNo}
            </span>
          )}
        </div>
      )}

      {/* MOQ Badge — wholesale only */}
      {channelToken === 'wholesale-token' && !!selectedVariant?.customFields?.minOrderQuantity && selectedVariant.customFields.minOrderQuantity > 0 && (
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-4 py-2 text-sm font-medium">
          Min. order: {selectedVariant.customFields.minOrderQuantity} units
        </div>
      )}

      {/* Option Groups */}
      {product.optionGroups.length > 0 && (
        <div className="space-y-5">
          {product.optionGroups.map(group => {
            const availableOptions = group.options.filter(option =>
              product.variants.some(v =>
                v.options.some(o => o.id === option.id),
              ),
            );
            return (
              <div key={group.id} className="space-y-3">
                <Label className="text-base font-semibold">{group.name}</Label>
                <RadioGroup
                  value={selectedOptions[group.id] || ''}
                  onValueChange={value => handleOptionChange(group.id, value)}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableOptions.map(option => (
                      <div key={option.id}>
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={option.id}
                          className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground peer-data-[checked]:border-primary peer-data-[checked]:ring-2 peer-data-[checked]:ring-primary/20 peer-data-[checked]:bg-primary/5 cursor-pointer transition-all"
                        >
                          {option.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            );
          })}
        </div>
      )}

      {/* Stock Status */}
      {selectedVariant && (
        <div className="text-sm">
          {isInStock ? (
            <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              {t('inStock')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-destructive font-medium">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              {t('outOfStock')}
            </span>
          )}
        </div>
      )}

      {/* Quantity Selector + Total */}
      {canAddToCart && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Label className="text-base font-semibold">Qty</Label>
            <div className="flex items-center rounded-lg border border-input">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-r-none"
                disabled={quantity <= 1}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => handleQuantityChange(e.target.value)}
                className="h-10 w-16 border-x border-input bg-transparent text-center text-sm focus:outline-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-l-none"
                onClick={() => setQuantity(q => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {quantity > 1 && (
              <p className="text-sm text-muted-foreground">
                Total:{' '}
                <span className="font-semibold text-foreground">
                  <Price
                    value={selectedVariant.priceWithTax * quantity}
                    currencyCode={currencyCode}
                  />
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="pt-2 space-y-3">
        <Button
          size="lg"
          className="w-full h-12 text-base font-semibold rounded-lg"
          disabled={!canAddToCart || isPending}
          onClick={handleAddToCart}
        >
          {isAdded ? (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              {t('addedToCart')}
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isPending
                ? t('adding')
                : !selectedVariant && product.optionGroups.length > 0
                  ? t('selectOptions')
                  : !isInStock
                    ? t('outOfStock')
                    : t('addToCart')}
            </>
          )}
        </Button>
      </div>

      {/* SKU */}
      {selectedVariant && (
        <div className="text-xs text-muted-foreground">
          {t('sku', { sku: selectedVariant.sku })}
        </div>
      )}
    </div>
  );
}
