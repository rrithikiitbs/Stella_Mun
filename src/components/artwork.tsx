import Image from "next/image";
import { artwork, type ArtworkKey } from "@/lib/artwork";

type Props = {
  name: ArtworkKey;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  ratio?: string;
  position?: string;
  decorative?: boolean;
};

export function Artwork({ name, className = "", imageClassName = "", sizes = "(max-width: 768px) 100vw, 50vw", priority = false, ratio = "16 / 10", position = "center", decorative = false }: Props) {
  const asset = artwork[name];
  const base = `/images/optimized/${asset.path}`;
  const alt = decorative ? "" : asset.alt;
  return <div className={`artwork-frame ${className}`} style={{ aspectRatio: ratio }}>
    <picture>
      <source type="image/avif" sizes={sizes} srcSet={[480, 768, 1024].map(width => `${base}-${width}.avif ${width}w`).join(", ")} />
      <source type="image/webp" sizes={sizes} srcSet={[480, 768, 1024].map(width => `${base}-${width}.webp ${width}w`).join(", ")} />
      <Image src={`${base}-1024.webp`} alt={alt} fill sizes={sizes} priority={priority} unoptimized className={`artwork-image ${imageClassName}`} style={{ objectPosition: position }} />
    </picture>
  </div>;
}
