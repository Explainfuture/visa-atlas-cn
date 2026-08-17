import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <span className="brand-mark" aria-hidden="true">
        签
      </span>
      <p>404 · 这张地图上暂时没有这一站</p>
      <h1>换一个目的地看看</h1>
      <Link className="primary-button" href="/">
        <ArrowLeft aria-hidden="true" size={18} />
        返回世界地图
      </Link>
    </main>
  );
}
