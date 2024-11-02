import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Province } from '../hooks/useProvinces';

interface ComboboxProps {
  value: number;
  onChange: (value: number) => void;
  options: Province[];
  placeholder?: string;
  disabled?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const comboboxRef = useRef<HTMLDivElement>(null);

  const selectedProvince = options.find(option => option.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Initialize query with current value's name
    if (selectedProvince) {
      setQuery(selectedProvince.name);
    }
  }, [selectedProvince]);

  const filteredOptions = query === ''
    ? options
    : options.filter((option) =>
        option.name.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="relative w-full" ref={comboboxRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronsUpDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          {filteredOptions.length === 0 ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              No results found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                  value === option.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-900'
                } hover:bg-indigo-50`}
                onClick={() => {
                  onChange(option.id);
                  setQuery(option.name);
                  setIsOpen(false);
                }}
              >
                <span className={`block truncate ${value === option.id ? 'font-medium' : 'font-normal'}`}>
                  {option.name}
                </span>
                {value === option.id && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Combobox;