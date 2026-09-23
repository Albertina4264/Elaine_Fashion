import Image from "next/image";

export function PageHero({
  title,
  kicker,
  image = "/products/photo-23.jpg",
}: {
  title: string;
  kicker?: string;
  image?: string;
}) {
  return (
    <section className="relative flex min-h-[52vh] items-center justify-center overflow-hidden pt-24">
      <Image src={image} alt="" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 px-4 py-20 text-center text-white">
        {kicker ? <p className="mb-3 text-xs tracking-[0.3em] uppercase">{kicker}</p> : null}
        <h1 className="font-serif text-5xl md:text-6xl">{title}</h1>
      </div>
    </section>
  );
}
