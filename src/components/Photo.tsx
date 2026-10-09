import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  /** Tailwind aspect utility, e.g. "aspect-[4/3]". */
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
};

export function Photo({
  src,
  alt,
  caption,
  aspect = "aspect-[4/3]",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
  fit = "cover",
}: Props) {
  return (
    <figure className="group">
      <div
        className={`relative overflow-hidden border border-line ${aspect} ${
          fit === "contain" ? "bg-white" : "bg-sunk"
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`transition-transform duration-500 ease-out group-hover:scale-[1.02] ${
            fit === "contain"
              ? "object-contain p-6 sm:p-10"
              : "object-cover object-center"
          }`}
        />
      </div>
      {caption && (
        <figcaption className="eyebrow mt-2.5 normal-case tracking-[0.08em]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
