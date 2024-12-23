import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface AuthFormProps {
  selectedPlan: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const AuthForm = ({ selectedPlan, loading, setLoading }: AuthFormProps) => {
  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <SignInForm
          selectedPlan={selectedPlan}
          loading={loading}
          setLoading={setLoading}
        />
      </TabsContent>
      <TabsContent value="signup">
        <SignUpForm
          selectedPlan={selectedPlan}
          loading={loading}
          setLoading={setLoading}
        />
      </TabsContent>
    </Tabs>
  );
};