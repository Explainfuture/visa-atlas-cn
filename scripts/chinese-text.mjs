import OpenCC from "opencc-js";

const traditionalToSimplified = OpenCC.Converter({ from: "t", to: "cn" });

export function toSimplifiedChinese(value) {
  return typeof value === "string" ? traditionalToSimplified(value) : value;
}

export function containsConvertibleTraditionalChinese(value) {
  return typeof value === "string" && toSimplifiedChinese(value) !== value;
}
