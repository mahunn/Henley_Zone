"use client";

import Image from "next/image";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  onClick?: () => void;
  title?: string;
};

/** Matches `images.qualities` in next.config.ts — do not vary by priority (hydration-safe). */
const IMAGE_QUALITY = 75;

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
  fill = false,
  sizes,
  priority = false,
  onClick,
  title
}: ProductImageProps) {
  if (!isOptimizable(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={className}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          onClick={onClick}
          title={title}
          style={{ width: "100%", height: "100%" }}
        />
      );
    }
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

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        quality={IMAGE_QUALITY}
        onClick={onClick}
        title={title}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 400}
      height={height ?? 400}
      className={className}
      sizes={sizes}
      priority={priority}
      quality={IMAGE_QUALITY}
      onClick={onClick}
      title={title}
    />
  );
}
