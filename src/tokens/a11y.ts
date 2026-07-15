export type TextSizeMode = "standard" | "large" | "xl";

export const TEXT_SIZE_MODES: { key: TextSizeMode; label: string }[] = [
  { key: "standard", label: "قياسي" },
  { key: "large", label: "كبير" },
  { key: "xl", label: "كبير جداً" },
];

export const TEXT_SIZE_ROOT: Record<TextSizeMode, string> = {
  standard: "16px",
  large: "18px",
  xl: "20px",
};
