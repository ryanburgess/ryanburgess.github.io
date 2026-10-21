export default function PageHeading({ children }) {
  return (
    <div className="page-heading">
      <img
        className="page-heading-mark"
        src="/images/brand/ryan-burgess-mark.png"
        alt=""
        width="554"
        height="557"
      />
      <div className="page-heading-copy">{children}</div>
    </div>
  );
}
