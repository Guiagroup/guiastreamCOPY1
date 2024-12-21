import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Video } from "@/types/video";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  videos: Video[];
}

export const CategoryFilter = ({ 
  categories: initialCategories, 
  selectedCategory, 
  setSelectedCategory,
  videos 
}: CategoryFilterProps) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    setCategories(initialCategories);

    // Subscribe to real-time category updates
    const channel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCategories(prev => [...prev, (payload.new as any).name]);
            toast.success('New category added');
          } else if (payload.eventType === 'DELETE') {
            setCategories(prev => prev.filter(cat => cat !== (payload.old as any).name));
            toast.success('Category removed');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialCategories]);

  // Filter out categories with no videos
  const activeCategories = categories.filter(category => 
    videos.some(video => video.category === category)
  );

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === "all" ? "default" : "outline"}
        onClick={() => setSelectedCategory("all")}
        className="rounded-full"
      >
        {t('categories.allCategories')}
      </Button>
      {activeCategories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => setSelectedCategory(category)}
          className="rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};