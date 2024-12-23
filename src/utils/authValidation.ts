import { toast } from "sonner";

export const validateAuthForm = (email: string, password: string) => {
  if (!email || !password) {
    toast.error('Validation error', {
      description: 'Please fill in all fields'
    });
    return false;
  }
  if (password.length < 6) {
    toast.error('Invalid password', {
      description: 'Password must be at least 6 characters long'
    });
    return false;
  }
  return true;
};