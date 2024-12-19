import { ScrollArea } from "@/components/ui/scroll-area";

export const PrivacyContent = () => {
  return (
    <ScrollArea className="h-[400px] w-full p-4">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Privacy Policy</h2>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-2">
          <h3 className="text-lg font-semibold">Introduction</h3>
          <p>
            Your privacy is important to us. We collect and store personal data necessary 
            for creating your account and using our service, such as your email address 
            and username. This data is secured and will not be shared with third parties 
            without your consent.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold">Data Storage and Security</h3>
          <p>
            We use Supabase for data storage and online authentication, guaranteeing 
            the security and confidentiality of your information.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold">GDPR Compliance</h3>
          <p>
            Our platform complies with GDPR regulations, ensuring the protection of 
            your personal information. Under GDPR, you have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access your personal data</li>
            <li>Rectify inaccurate personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p>
            If you have any questions regarding our privacy policy, feel free to 
            contact us at privacy@guiastream.com
          </p>
        </section>
      </div>
    </ScrollArea>
  );
};