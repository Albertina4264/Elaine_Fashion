import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { CtaBanner } from "@/components/cta-banner";
import { ContactForm } from "@/components/contact-form";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div>
      <PageHero kicker="CONTACTEZ-NOUS" title="Restons en contact" image="/products/photo-23.jpg" />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-8">
        <div>
          <h2 className="font-serif text-4xl text-navy">Contactez-nous</h2>
          <ul className="mt-10 space-y-8">
            <li className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 text-navy" />
              <div>
                <p className="font-medium">Téléphone</p>
                <a href="tel:788317477" className="cursor-pointer text-muted">788317477</a>
              </div>
            </li>
            <li className="flex gap-4">
              <Mail className="mt-1 h-5 w-5 text-navy" />
              <div>
                <p className="font-medium">E-mail</p>
                <a href="mailto:albertinaelainedjata@gmail.com" className="cursor-pointer text-muted">
                  albertinaelainedjata@gmail.com
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 text-navy" />
              <div>
                <p className="font-medium">Adresse</p>
                <p className="text-muted">Rue LIB 42, 332</p>
              </div>
            </li>
          </ul>
        </div>
        <ContactForm />
      </section>
      <section className="px-4 pb-16 text-center">
        <h2 className="font-serif text-2xl text-navy">Suivez-nous @Elaine Fashion</h2>
      </section>
      <CtaBanner />
    </div>
  );
}
