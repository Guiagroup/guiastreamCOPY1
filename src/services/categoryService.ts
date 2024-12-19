import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const getCategories = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return ['Uncategorized'];

  const { data: categories, error } = await supabase
    .from('categories')
    .select('name')
    .eq('user_id', user.id)
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return ['Uncategorized'];
  }

  return ['Uncategorized', ...categories.map(cat => cat.name)];
};

export const addCategory = async (category: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error('You must be logged in to add categories');
    return false;
  }

  const normalizedCategory = category.trim();
  
  const { error } = await supabase
    .from('categories')
    .insert({ 
      name: normalizedCategory,
      user_id: user.id 
    });

  if (error) {
    if (error.code === '23505') {
      toast.error('Category already exists');
    } else {
      toast.error('Failed to add category');
      console.error('Error adding category:', error);
    }
    return false;
  }

  toast.success('Category added successfully');
  return true;
};

export const deleteCategory = async (category: string): Promise<boolean> => {
  if (category === 'Uncategorized') return false;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    toast.error('You must be logged in to delete categories');
    return false;
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('name', category)
    .eq('user_id', user.id);

  if (error) {
    toast.error('Failed to delete category');
    console.error('Error deleting category:', error);
    return false;
  }

  toast.success('Category deleted successfully');
  return true;
};