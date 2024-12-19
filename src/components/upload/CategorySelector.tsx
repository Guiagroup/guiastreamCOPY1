import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategories, deleteCategory, addCategory } from "@/services/categoryService";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormField } from "./FormField";
import { X } from "lucide-react";
import { toast } from "sonner";

interface CategorySelectorProps {
  category: string;
  setCategory: (category: string) => void;
  newCategory: string;
  setNewCategory: (category: string) => void;
}

export const CategorySelector = ({
  category,
  setCategory,
  newCategory,
  setNewCategory,
}: CategorySelectorProps) => {
  const { t } = useTranslation();
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Uncategorized']);
  
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await getCategories();
    if (cats.length > 0) {
      setCategories(cats);
      if (!cats.includes(category)) {
        setCategory(cats[0]);
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error(t("categories.nameRequired"));
      return;
    }

    const success = await addCategory(newCategory.trim());
    if (success) {
      await loadCategories();
      setCategory(newCategory.trim());
      setNewCategory("");
      setShowNewCategory(false);
      toast.success(t("categories.added"));
    }
  };

  const handleDeleteCategory = async (e: React.MouseEvent, categoryToDelete: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (categories.length <= 1) {
      toast.error(t("categories.cantDeleteLast"));
      return;
    }

    const success = await deleteCategory(categoryToDelete);
    if (success) {
      if (category === categoryToDelete) {
        setCategory("Uncategorized");
      }
      await loadCategories();
      toast.success(t("categories.deleted"));
    }
  };

  return (
    <FormField label={t("upload.category")} required>
      {!showNewCategory ? (
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("upload.selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem 
                  key={cat} 
                  value={cat} 
                  className="flex justify-between items-center group cursor-pointer"
                >
                  <span>{cat}</span>
                  {cat !== 'Uncategorized' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteCategory(e, cat)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowNewCategory(true)}
            className="whitespace-nowrap"
          >
            {t("upload.newCategory")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder={t("upload.enterCategory")}
            className="w-full"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="default"
              onClick={handleAddCategory}
              className="whitespace-nowrap"
            >
              {t("upload.add")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowNewCategory(false);
                setNewCategory("");
              }}
              className="whitespace-nowrap"
            >
              {t("upload.cancel")}
            </Button>
          </div>
        </div>
      )}
    </FormField>
  );
};