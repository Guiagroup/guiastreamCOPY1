import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Video } from "@/types/video";
import { useNavigate } from "react-router-dom";
import { searchVideos } from "@/services/videoService";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Video[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.trim()) {
      const results = await searchVideos(value);
      setSuggestions(results);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (video: Video) => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    navigate(`/video/${video.id}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search videos..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
          {suggestions.map((video) => (
            <div
              key={video.id}
              className="flex items-center p-2 hover:bg-accent cursor-pointer"
              onClick={() => handleSelect(video)}
            >
              <img
                src={video.thumbnail_url || ''}
                alt={video.title}
                className="w-16 h-9 object-cover rounded"
              />
              <div className="ml-3">
                <p className="font-medium">{video.title}</p>
                <p className="text-sm text-muted-foreground">{video.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};