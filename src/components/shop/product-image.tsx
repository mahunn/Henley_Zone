"use client";

import Image from "next/image";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  onClick?: () => void;
  title?: string;
};

function isOptimizable(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("data:")) return false;
  return src.startsWith("/") || src.startsWith("https://");
}

export function ProductImage({
  src,
  alt,
  className,
  width,
  height,
  sizes,
  priority = false,
  onClick,
  title
}: ProductImageProps) {
  if (!isOptimizable(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onClick={onClick}
        title={title}
      />
    );
  }

  const img = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      quality={priority ? 82 : 72}
      onClick={onClick}
      title={title}
    />
  );

  return img;
}
