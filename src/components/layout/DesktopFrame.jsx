export default function DesktopFrame({ children, className = "" }) {
  return (
    <div className="w-full">
      <div
        className={`
          max-w-[1728px]
          mx-auto
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
}
