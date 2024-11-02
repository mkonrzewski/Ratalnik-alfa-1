import { useState } from 'react';

export interface Province {
  id: number;
  name: string;
}

// Polish voivodeships (provinces) with IDs
const POLISH_VOIVODESHIPS: Province[] = [
  { id: 1, name: 'Dolnośląskie' },
  { id: 2, name: 'Kujawsko-pomorskie' },
  { id: 3, name: 'Lubelskie' },
  { id: 4, name: 'Lubuskie' },
  { id: 5, name: 'Łódzkie' },
  { id: 6, name: 'Małopolskie' },
  { id: 7, name: 'Mazowieckie' },
  { id: 8, name: 'Opolskie' },
  { id: 9, name: 'Podkarpackie' },
  { id: 10, name: 'Podlaskie' },
  { id: 11, name: 'Pomorskie' },
  { id: 12, name: 'Śląskie' },
  { id: 13, name: 'Świętokrzyskie' },
  { id: 14, name: 'Warmińsko-mazurskie' },
  { id: 15, name: 'Wielkopolskie' },
  { id: 16, name: 'Zachodniopomorskie' }
];

export const useProvinces = () => {
  const [provinces] = useState<Province[]>(POLISH_VOIVODESHIPS);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const getProvinceName = (id: number): string => {
    return provinces.find(p => p.id === id)?.name || '';
  };

  const getProvinceId = (name: string): number => {
    return provinces.find(p => p.name === name)?.id || 0;
  };

  return { 
    provinces, 
    isLoading, 
    error,
    getProvinceName,
    getProvinceId
  };
};