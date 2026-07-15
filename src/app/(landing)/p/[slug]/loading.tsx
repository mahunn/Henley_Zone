export default function LandingLoading() {
  return (
    <div className="lp-page" style={{ paddingBottom: "60px" }}>
      {/* 1. Gallery Skeleton */}
      <div className="lp-skeleton-gallery lp-skeleton-pulse" />
      <div className="lp-skeleton-thumbs">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="lp-skeleton-thumb lp-skeleton-pulse" />
        ))}
      </div>

      {/* 2. Info Skeleton */}
      <div className="lp-skeleton-info">
        <div className="lp-skeleton-brand lp-skeleton-pulse" />
        <div className="lp-skeleton-name lp-skeleton-pulse" />
        <div className="lp-skeleton-rating lp-skeleton-pulse" />
        <div className="lp-skeleton-price lp-skeleton-pulse" />
        <div className="lp-skeleton-stock lp-skeleton-pulse" />
      </div>

      {/* 3. Description Skeleton */}
      <div className="lp-skeleton-desc">
        <div className="lp-skeleton-desc-line lp-skeleton-pulse" />
        <div className="lp-skeleton-desc-line lp-skeleton-pulse" />
        <div className="lp-skeleton-desc-line lp-skeleton-pulse" />
        <div className="lp-skeleton-desc-line lp-skeleton-pulse" />
      </div>

      {/* 4. CTA Skeleton */}
      <div className="lp-skeleton-cta-wrap">
        <div className="lp-skeleton-cta lp-skeleton-pulse" />
      </div>

      {/* 5. Call Section Skeleton */}
      <div className="lp-skeleton-call">
        <div className="lp-skeleton-brand lp-skeleton-pulse" style={{ width: "140px", marginBottom: "8px" }} />
        <div className="lp-skeleton-name lp-skeleton-pulse" style={{ width: "160px", height: "20px", marginBottom: "12px" }} />
        <div className="lp-skeleton-call-btn lp-skeleton-pulse" />
      </div>

      {/* 6. Trust Badges Skeleton */}
      <div className="lp-skeleton-trust">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="lp-skeleton-trust-item lp-skeleton-pulse" />
        ))}
      </div>
    </div>
  );
}
