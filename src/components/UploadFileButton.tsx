import React, { useRef, useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";

interface UploadFileButtonProps extends ButtonProps {
  onFileChange: (file: File) => void;
}

export function UploadFileButton({
  onFileChange,
  ...props
}: UploadFileButtonProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Here you would typically handle the file, e.g., upload it
      console.log("'Selected file:'", file.name);
      onFileChange(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={handleButtonClick}
        variant="ghost"
        aria-label="Upload file"
        className="bg-primary"
        {...props}
      >
        {props.children}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
