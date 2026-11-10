import logo from '../assets/mpgi-logo.png';

/**
 * Official MPGI logo. The file is a 488px circular cut-out of the supplied artwork (transparent corners),
 * so it stays sharp on 2x screens up to ~244 CSS px. Rendered size is set per placement in brand.css via --logo-size; width/height attrs just reserve space (no layout shift). Aspect ratio is fixed (1:1); never stretch it.
 * `decorative` hides it from screen readers when adjacent text already names the institution.
 */
export default function BrandLogo({ size = 44, decorative = false, className = '', priority = false }) {
  return (
    <img
      className={`brand-logo ${className}`.trim()}
      src={logo}
      width={size}
      height={size}
      alt={decorative ? '' : 'MPGI – Maharana Pratap Group of Institutions logo'}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      draggable="false"
    />
  );
}
