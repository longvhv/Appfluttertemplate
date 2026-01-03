import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';

export interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

export interface CreditCardInputProps {
  value?: Partial<CardData>;
  onChange?: (value: Partial<CardData>) => void;
  disabled?: boolean;
  className?: string;
  showCardPreview?: boolean;
}

type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export function CreditCardInput({
  value = {},
  onChange,
  disabled = false,
  className = '',
  showCardPreview = true,
}: CreditCardInputProps) {
  const [cardData, setCardData] = useState<Partial<CardData>>(value);
  const [focused, setFocused] = useState<keyof CardData | null>(null);

  const detectCardType = (number: string): CardType => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    return 'unknown';
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '');
    const cardType = detectCardType(cleaned);
    
    // AMEX: XXXX XXXXXX XXXXX
    if (cardType === 'amex') {
      const match = cleaned.match(/(\d{1,4})(\d{1,6})?(\d{1,5})?/);
      if (!match) return cleaned;
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
    
    // Others: XXXX XXXX XXXX XXXX
    const match = cleaned.match(/(\d{1,4})/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiry = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  };

  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return false;
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const validateExpiry = (expiry: string): boolean => {
    const [month, year] = expiry.split('/');
    if (!month || !year) return false;
    
    const monthNum = parseInt(month);
    const yearNum = parseInt(`20${year}`);
    
    if (monthNum < 1 || monthNum > 12) return false;
    
    const now = new Date();
    const expiryDate = new Date(yearNum, monthNum - 1);
    
    return expiryDate > now;
  };

  const handleChange = (field: keyof CardData, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
      if (formattedValue.replace(/\s/g, '').length > 19) return;
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
      if (formattedValue.replace(/\D/g, '').length > 4) return;
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      const cardType = detectCardType(cardData.number || '');
      const maxLength = cardType === 'amex' ? 4 : 3;
      if (formattedValue.length > maxLength) return;
    }
    
    const newData = { ...cardData, [field]: formattedValue };
    setCardData(newData);
    onChange?.(newData);
  };

  const cardType = detectCardType(cardData.number || '');
  const isNumberValid = cardData.number ? validateCardNumber(cardData.number) : null;
  const isExpiryValid = cardData.expiry ? validateExpiry(cardData.expiry) : null;

  const cardColors: { [key in CardType]: string } = {
    visa: 'from-blue-600 to-blue-800',
    mastercard: 'from-orange-600 to-red-700',
    amex: 'from-green-600 to-teal-700',
    discover: 'from-orange-500 to-orange-700',
    unknown: 'from-gray-600 to-gray-800',
  };

  return (
    <div className={className}>
      {/* Card Preview */}
      {showCardPreview && (
        <div className={`
          relative w-full max-w-md mx-auto mb-6 p-6 rounded-2xl
          bg-gradient-to-br ${cardColors[cardType]}
          text-white shadow-2xl aspect-[1.586/1]
          transition-all duration-300
          ${focused ? 'scale-105' : ''}
        `}>
          {/* Card Type Logo */}
          <div className="absolute top-4 right-4">
            <div className="text-white/80 text-sm font-bold uppercase">
              {cardType !== 'unknown' ? cardType : 'Card'}
            </div>
          </div>

          {/* Chip */}
          <div className="w-12 h-10 bg-yellow-400/80 rounded mb-8" />

          {/* Card Number */}
          <div className={`text-xl tracking-wider mb-4 font-mono transition-all ${focused === 'number' ? 'scale-110' : ''}`}>
            {cardData.number || '•••• •••• •••• ••••'}
          </div>

          {/* Name and Expiry */}
          <div className="flex justify-between items-end">
            <div className={`transition-all ${focused === 'name' ? 'scale-110' : ''}`}>
              <div className="text-xs text-white/60 mb-1">Card Holder</div>
              <div className="text-sm font-medium uppercase">
                {cardData.name || 'YOUR NAME'}
              </div>
            </div>
            <div className={`transition-all ${focused === 'expiry' ? 'scale-110' : ''}`}>
              <div className="text-xs text-white/60 mb-1">Expires</div>
              <div className="text-sm font-medium">
                {cardData.expiry || 'MM/YY'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Fields */}
      <div className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              inputMode="numeric"
              value={cardData.number || ''}
              onChange={(e) => handleChange('number', e.target.value)}
              onFocus={() => setFocused('number')}
              onBlur={() => setFocused(null)}
              disabled={disabled}
              placeholder="1234 5678 9012 3456"
              className={`
                w-full pl-10 pr-4 py-2.5 rounded-xl border-2 transition-all
                bg-card dark:bg-card text-foreground
                ${isNumberValid === false
                  ? 'border-red-600 focus:border-red-600'
                  : isNumberValid === true
                  ? 'border-green-600 focus:border-green-600'
                  : 'border-border dark:border-border focus:border-indigo-600'
                }
                focus:ring-4 focus:ring-indigo-600/20
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            />
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            value={cardData.name || ''}
            onChange={(e) => handleChange('name', e.target.value.toUpperCase())}
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused(null)}
            disabled={disabled}
            placeholder="JOHN DOE"
            className={`
              w-full px-4 py-2.5 rounded-xl border-2 transition-all
              bg-card dark:bg-card text-foreground uppercase
              border-border dark:border-border focus:border-indigo-600
              focus:ring-4 focus:ring-indigo-600/20
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={cardData.expiry || ''}
              onChange={(e) => handleChange('expiry', e.target.value)}
              onFocus={() => setFocused('expiry')}
              onBlur={() => setFocused(null)}
              disabled={disabled}
              placeholder="MM/YY"
              className={`
                w-full px-4 py-2.5 rounded-xl border-2 transition-all
                bg-card dark:bg-card text-foreground
                ${isExpiryValid === false
                  ? 'border-red-600 focus:border-red-600'
                  : isExpiryValid === true
                  ? 'border-green-600 focus:border-green-600'
                  : 'border-border dark:border-border focus:border-indigo-600'
                }
                focus:ring-4 focus:ring-indigo-600/20
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              CVV
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={cardData.cvv || ''}
              onChange={(e) => handleChange('cvv', e.target.value)}
              onFocus={() => setFocused('cvv')}
              onBlur={() => setFocused(null)}
              disabled={disabled}
              placeholder={cardType === 'amex' ? '1234' : '123'}
              maxLength={cardType === 'amex' ? 4 : 3}
              className={`
                w-full px-4 py-2.5 rounded-xl border-2 transition-all
                bg-card dark:bg-card text-foreground
                border-border dark:border-border focus:border-indigo-600
                focus:ring-4 focus:ring-indigo-600/20
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
