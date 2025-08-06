import clsx from "clsx";

type Props = {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
};

const Skeleton = ({
  width = "100%",
  height = "1rem",
  rounded = "md",
  className = "",
}: Props) => {
  return (
    <div
      className={clsx(
        "bg-gray-300 dark:bg-gray-700 animate-pulse",
        `rounded-${rounded}`,
        className
      )}
      style={{ width, height }}
    ></div>
  );
};

export default Skeleton;
