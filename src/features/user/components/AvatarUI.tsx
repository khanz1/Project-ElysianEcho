import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarUIProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
  pictureUrl?: string;
  fallbackText: string;
}

const AvatarUI = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  AvatarUIProps
>(({ className, pictureUrl, fallbackText, ...props }, ref) => {
  console.log("AvatarUI", pictureUrl, fallbackText);
  return (
    <Avatar className={cn("w-8 h-8", className)} {...props} ref={ref}>
      <AvatarImage src={pictureUrl} />
      <AvatarFallback>
        {fallbackText?.length ? fallbackText[0] : null}
      </AvatarFallback>
    </Avatar>
  );
});

// Set the display name to avoid the ESLint warning
AvatarUI.displayName = "AvatarUI";

export default AvatarUI;
