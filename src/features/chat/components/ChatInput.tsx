import { IconLoader2, IconSend2 } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import { AuthStateType, useFirebaseAuth } from "@/lib/firebase/hooks/useAuth";
import { ChatPageProps } from "@/pages";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createMessage } from "@/features/chat/chat.action";
import { ChatMessage } from "@/features/chat/actions/message.action";
import { Timestamp, updateDoc } from "@firebase/firestore";

export interface ChatFormProps extends ChatPageProps {
  formMode: "add" | "edit";
  setFormMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
  chat: ChatMessage | null;
  setExistingChat: React.Dispatch<React.SetStateAction<ChatMessage | null>>;
}

export const ChatInputForm = React.forwardRef<HTMLInputElement, ChatFormProps>(
  ({ query, chat, formMode, setFormMode, setExistingChat }, inputRef) => {
    const auth = useFirebaseAuth();

    const [message, setMessage] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      console.log(formMode, chat);
      if (formMode === "edit" && chat) {
        setMessage(chat.data().message);
      }
      if (formMode === "add") {
        setMessage("");
      }
    }, [formMode, chat]);

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (auth.status !== AuthStateType.LOADED) {
        return;
      }

      setIsSending(true);
      try {
        if (formMode === "edit" && chat) {
          await updateDoc(chat.ref, {
            message,
            isEdited: true,
            editedAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });

          // later if the updated chat is the last message
          // then update the last message in the user collection

          setFormMode("add");
          setExistingChat(null);
          setMessage("");
          return toast.success("Message updated");
        }
        await createMessage({
          type: "text",
          message,
          chatId: query.chatId,
          senderUID: auth.user.uid,
        });

        setMessage("");
      } finally {
        setIsSending(false);
      }
    };

    const handleOnUpload = async () => {
      if (auth.status !== AuthStateType.LOADED) {
        return;
      }

      if (!file) {
        return toast.error("No file selected");
      }

      setIsSending(true);
      try {
        await createMessage({
          type: "file",
          file,
          chatId: query.chatId,
          senderUID: auth.user.uid,
        });
      } finally {
        setIsSending(false);
        setFile(null);
        setIsDialogOpen(false);
      }
    };

    useEffect(() => {
      if (message.length) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }, [message]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = fileInputRef.current?.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        setIsDialogOpen(true); // Open the dialog if a file is selected
      }
    };

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <>
        <Dialog
          open={isDialogOpen}
          onOpenChange={() => {
            if (!file) {
              setIsDialogOpen(false); // Close the dialog if no file is selected
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Send a file</DialogTitle>
            </DialogHeader>
            {file && (
              <div className="py-4">
                <h5 className="text-neutral-100">{file.name}</h5>
                <img
                  src={URL.createObjectURL(file)}
                  alt="file"
                  className="w-full h-full object-contain rounded overflow-hidden"
                />
              </div>
            )}
            <DialogFooter>
              <Button type="button" onClick={handleOnUpload}>
                {isSending ? <IconLoader2 className="animate-spin" /> : "Send"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex gap-2 w-full">
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={handleButtonClick}
              size="icon"
              variant="ghost"
              aria-label="Upload file"
              className="rounded-full p-2"
            >
              <PlusIcon />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
            />
          </div>
          <form onSubmit={handleSendMessage} className="w-full">
            <div className="flex gap-2 w-full">
              <input
                ref={inputRef}
                type="text"
                id="chat-input"
                className="px-3 py-1 rounded-full text-sm w-full text-neutral-100 bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className={cn(
                  "bg-primary p-2 rounded-full transition-all duration-500",
                  isDisabled && "bg-neutral-700 cursor-not-allowed",
                )}
                disabled={isDisabled}
              >
                {isSending ? (
                  <IconLoader2 className="animate-spin" />
                ) : (
                  <IconSend2 size={20} />
                )}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  },
);

ChatInputForm.displayName = "ChatInputForm";
