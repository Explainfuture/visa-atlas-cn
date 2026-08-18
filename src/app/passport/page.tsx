import type { Metadata } from "next";
import { PassportGuide } from "@/components/passport-guide";

export const metadata: Metadata = {
  title: "第一次办护照：材料、费用、流程与全国办理地点",
  description: "给从未办过护照的新手：解释护照用途，列出首次申领材料、120元费用、办理步骤，并按省份和城市查询出入境受理窗口。",
};

export default function PassportPage() {
  return <PassportGuide />;
}
