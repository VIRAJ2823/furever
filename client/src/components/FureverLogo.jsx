
/**
 * Official FurEver Brand Logo
 * Features the signature infinity animal bond mark (cat silhouette + infinity loop + dog paw)
 * with refined, modern lifestyle typography.
 */
export default function FureverLogo({
  variant = "dark", // "dark" | "light"
  size = "md",      // "sm" | "md" | "lg"
  showWordmark = true,
  className = "",
}) {
  const isLight = variant === "light";

  const iconSizes = {
    sm: "h-5 sm:h-6 w-auto",
    md: "h-6 sm:h-7 md:h-8 w-auto",
    lg: "h-8 sm:h-10 md:h-11 w-auto",
  };

  const textSizes = {
    sm: "text-sm sm:text-base tracking-tight",
    md: "text-[17px] sm:text-xl md:text-2xl tracking-tight",
    lg: "text-2xl sm:text-3xl md:text-4xl tracking-tight",
  };

  const logoSrc = isLight ? "/images/furever-logo-white.png" : "/images/furever-logo-dark.png";

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2.5 md:gap-3 select-none shrink-0 ${className}`}>
      {/* Signature Infinity Animal Bond Mark */}
      <img
        src={logoSrc}
        alt="FurEver"
        className={`${iconSizes[size] || iconSizes.md} object-contain transition-transform duration-300 group-hover:scale-105 shrink-0`}
        loading="eager"
      />

      {showWordmark && (
        <span
          className={`font-heading font-black uppercase leading-none tracking-[0.12em] transition-colors duration-200 truncate ${
            textSizes[size] || textSizes.md
          } ${isLight ? "text-white" : "text-[#141414]"}`}
        >
          FUREVER
        </span>
      )}
    </div>
  );
}
