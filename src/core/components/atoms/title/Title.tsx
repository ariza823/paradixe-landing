import type { TitleProps, TitleSize } from "./Title.types.ts";

const sizeClasses: Record<TitleSize, string> = {
  none: "",
  section: "font-gothic text-[36px] sm:text-[56px] font-bold leading-[1.05] text-ink",
  group: "font-gothic text-[28px] sm:text-[34px] font-bold leading-[1.1] text-ink",
  panel: "text-[20px] sm:text-[24px] font-bold leading-[1.2] text-ink",
  product: "text-[18px] font-bold leading-[1.3] text-ink",
};

function Title({
  children,
  as: Tag = "h2",
  size = "section",
  addStyle = "",
  ...props
}: Readonly<TitleProps>) {
  return (
    <Tag className={`${sizeClasses[size]} ${addStyle}`.trim()} {...props}>
      {children}
    </Tag>
  );
}

export default Title;
