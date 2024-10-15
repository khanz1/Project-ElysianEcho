import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-accent-foreground">Theme</h3>
        <p className="text-sm text-muted-foreground">
          Customize the look and feel of the site to match your preferences.
        </p>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        {themes.map(({ value, label, previewClass }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              `flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-accent text-accent-foreground bg-popover`,
              theme === value ? "border-primary" : "border-muted",
            )}
          >
            <div className={cn("w-full h-20 mb-2 rounded-sm", previewClass)} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
