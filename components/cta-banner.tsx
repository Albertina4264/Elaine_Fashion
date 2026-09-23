import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/products/photo-23.jpg)" }}
      />
      <div className="absolute inset-0 bg-[#c4a574]/55" />
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center text-white">
        <h2 className="font-serif text-4xl md:text-5xl">Révélez votre style avec notre nouvelle collection!</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm md:text-base">
          Découvrez des vêtements, sacs, chaussures et accessoires soigneusement sélectionnés pour sublimer chaque femme.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex cursor-pointer rounded-full bg-gold px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#c09112]"
        >
          Voir plus
        </Link>
      </div>
    </section>
  );
}
