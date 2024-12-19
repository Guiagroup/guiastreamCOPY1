import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }: CategoryFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === "all" ? "default" : "outline"}
        onClick={() => setSelectedCategory("all")}
        className="rounded-full"
      >
        {t('categories.allCategories')}
      </Button>
      {categories.map((category) => (
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