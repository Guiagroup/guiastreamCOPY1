import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField = ({ 
  label, 
  required, 
  children, 
  className 
}: FormFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium mb-2">
        {label} {required && "*"}
      </label>
      {children}
    </div>
  );
};