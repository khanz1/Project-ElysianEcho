import { IconLoader2 } from "@tabler/icons-react";
import React from "react";

export const Loading = () => {
  return (
    <div className="w-full min-h-96 flex justify-center items-center">
      <IconLoader2 className="animate-spin w-10 h-10 text-primary" />
    </div>
  );
};
