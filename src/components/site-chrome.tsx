import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="签证地图首页">
        <span className="brand-mark" aria-hidden="true">
          签
        </span>
        <span>签证地图</span>
      </Link>

      <nav className="main-nav" aria-label="主导航">
        <Link href="/#world-map">世界地图</Link>
        <Link href="/#continents">七大洲</Link>
        <Link href="/#featured-guides">签证攻略</Link>
        <Link href="/passport">第一次办护照</Link>
      </nav>

      <Link className="header-action" href="/passport">
        办护照
        <ArrowRight aria-hidden="true" size={17} strokeWidth={2.2} />
      </Link>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="brand footer-brand" href="/">
        <span className="brand-mark" aria-hidden="true">
          签
        </span>
        <span>签证地图</span>
      </Link>
      <p>出发前，再到目的地官方渠道确认一次。</p>
    </footer>
  );
}
