"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";

type Event = {
  _id: string;
  title: string;
  startingDate: string;
  prId: string | null;
};

export default function EventSearchDropdown({
  onSelect,
}: {
  onSelect: (event: Event) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const justSelected = useRef(false); 

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (justSelected.current) {
        justSelected.current = false;
        return;
      }

      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      const fetchEvents = async () => {
        setSearchLoading(true);
        try {
          const res = await fetch(`/api/events/search?query=${searchQuery}`);
          const data = await res.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setSearchLoading(false);
        }
      };

      fetchEvents();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSelect = (event: Event) => {
    onSelect(event);
    justSelected.current = true; 
    setSearchQuery(event.title); 
    setSearchResults([]); 
  };

  return (
    <div>
      <Input
        placeholder="Type event title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded border p-2"
      />
      {searchLoading && <p>Searching...</p>}

      {searchResults.length > 0 && (
        <ul className="mt-2 rounded border bg-gray-800 text-white shadow dark:border-gray-600">
          {searchResults.map((event) => (
            <li
              key={event._id}
              onClick={() => {
                handleSelect(event);
                console.log(event._id);
              }}
              className="cursor-pointer px-4 py-2 hover:bg-gray-900"
            >
              {event.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
