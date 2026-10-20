export default function PageHeading({ children }) {
  return (
    <div className="page-heading">
      <img
        className="page-heading-mark"
        src="/images/brand/ryan-burgess-mark.png"
        alt=""
        width="256"
        height="256"
      />
      <div className="page-heading-copy">{children}</div>
    </div>
  );
}
