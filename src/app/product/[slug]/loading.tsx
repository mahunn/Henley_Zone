export default function ProductLoading() {
  return (
    <div className="container pdp-skeleton-wrap" aria-busy="true" aria-label="Loading product">
      <div className="pdp-skeleton">
        <div className="pdp-skeleton-gallery" />
        <div className="pdp-skeleton-info">
          <div className="pdp-skeleton-line wide" />
          <div className="pdp-skeleton-line" />
          <div className="pdp-skeleton-line short" />
        </div>
      </div>
    </div>
  );
}
