import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Video } from "@/types/video";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  videos: Video[];
}

export const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory,
  videos 
}: CategoryFilterProps) => {
  const { t } = useTranslation();

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