"use client";

import { useState } from "react";
import { Input } from "./input";

interface MultiSelectInputProps {
  data: string[];
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
}

export default function MultiSelectInput({
  data,
  selectedItems,
  setSelectedItems,
}: MultiSelectInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      const results = data.filter((item) =>
        item.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddItem = (item: string) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
    }
    setSuggestions([]);
    setSearchTerm("");
  };

  const handleRemoveItem = (item: string) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        className="px-3 py-2 w-full rounded border focus:outline-none focus:ring-2"
        onFocus={() => setSuggestions(data)}
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleAddItem(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        {selectedItems.map((item, index) => (
          <div
            key={index}
            className="inline-flex items-center mr-2 mb-2 px-3 py-1 bg-gray-200 dark:bg-gray-200 rounded-full"
          >
            <span className="dark:text-gray-800">{item}</span>
            <button
              type="button"
              className="ml-2 text-red-600 dark:text-red-400"
              onClick={() => handleRemoveItem(item)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
