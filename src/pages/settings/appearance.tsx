import { useTheme } from "next-themes";

type Theme = "system" | "light" | "dark";
export default function Appearance() {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; label: string; previewClass: string }[] = [
    {
      value: "system",
      label: "System Default",
      previewClass: "bg-gradient-to-br from-black to-white",
    },
    {
      value: "light",
      label: "Light",
      previewClass: "bg-white border border-gray-200",
    },
    {
      value: "dark",
      label: "Dark",
      previewClass: "bg-gray-900",
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      {themes.map(({ value, label, previewClass }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground ${
            theme === value ? "border-primary" : "border-muted"
          } bg-popover`}
        >
          <div className={`w-full h-20 mb-2 ${previewClass}`} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
