import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PrivacyContent } from "./privacy/PrivacyContent";
import { useTranslation } from "react-i18next";

const AboutUsContent = () => (
  <div className="space-y-4">
    <p>
      We are a Germany-based platform dedicated to providing you with a personalized 
      space to organize and watch your favorite YouTube videos.
    </p>
    <p>
      Our mission is to offer you a seamless streaming experience, free from intrusive 
      ads, enabling you to create and manage your own video catalog, whether for 
      personal or family use.
    </p>
  </div>
);

export const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="link"
                      className="text-muted-foreground hover:text-primary p-0 h-auto"
                    >
                      {t("footer.aboutUs")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("footer.aboutUs")}</DialogTitle>
                    </DialogHeader>
                    <AboutUsContent />
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="link"
                      className="text-muted-foreground hover:text-primary p-0 h-auto"
                    >
                      {t("footer.privacyPolicy")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{t("footer.privacyPolicy")}</DialogTitle>
                    </DialogHeader>
                    <PrivacyContent />
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.followUs")}</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">GuiaStream</h2>
            <p className="text-muted-foreground">{t("footer.slogan")}</p>
          </div>
          <p className="text-muted-foreground">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};