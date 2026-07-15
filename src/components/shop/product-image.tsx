"use client";

import { useEffect, useState } from "react";
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
  loadDelay?: number;
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
  title,
  loadDelay
}: ProductImageProps) {
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (priority) {
      setShouldLoad(true);
      return;
    }
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, loadDelay ?? 100);
    return () => clearTimeout(timer);
  }, [priority, loadDelay]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // If the image shouldn't be loaded yet, render a skeleton/spinner placeholder
  if (!shouldLoad) {
    return (
      <div
        className={className}
        style={{
          position: "relative",
          width: fill ? "100%" : (width ? `${width}px` : "100%"),
          height: fill ? "100%" : (height ? `${height}px` : "auto"),
          aspectRatio: fill ? "unset" : (width && height ? `${width}/${height}` : "auto"),
          backgroundColor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px"
        }}
      >
        <div className="lp-image-spinner" />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: fill ? "100%" : "auto",
        height: fill ? "100%" : "auto",
        display: fill ? "block" : "inline-block",
        overflow: "hidden",
        borderRadius: "inherit"
      }}
    >
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            borderRadius: "inherit"
          }}
        >
          <div className="lp-image-spinner" />
        </div>
      )}
      {isOptimizable(src) ? (
        fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            className={className}
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.3s ease-in-out"
            }}
            sizes={sizes}
            priority={priority}
            quality={IMAGE_QUALITY}
            onLoad={handleLoad}
            onClick={onClick}
            title={title}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width ?? 400}
            height={height ?? 400}
            className={className}
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.3s ease-in-out"
            }}
            sizes={sizes}
            priority={priority}
            quality={IMAGE_QUALITY}
            onLoad={handleLoad}
            onClick={onClick}
            title={title}
          />
        )
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
            width: fill ? "100%" : (width ? `${width}px` : "auto"),
            height: fill ? "100%" : (height ? `${height}px` : "auto")
          }}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          onLoad={handleLoad}
          onClick={onClick}
          title={title}
        />
      )}
    </div>
  );
}
