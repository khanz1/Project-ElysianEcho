import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AuthStateType, useFirebaseAuth } from "@/lib/firebase/hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadFileButton } from "@/components/UploadFileButton";
import { fetchUserByUID, updateUserByUID } from "@/features/user/user.action";

const profileFormSchema = z.object({
  displayName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  bio: z.string().max(160).min(4),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  displayName: "",
  bio: "",
  email: "",
};

export function ProfileForm() {
  const auth = useFirebaseAuth();
  const [pictureUrl, setPictureUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    if (!auth.user) {
      return toast({
        title: "You are not authorized",
      });
    }
    const user = await fetchUserByUID(auth.user.uid);

    await updateUserByUID(user);
    toast({
      title: "Data Updated",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  useEffect(() => {
    if (auth.status === AuthStateType.LOADED) {
      form.setValue("email", auth.user.email ?? "");
      form.setValue("displayName", auth.user.displayName ?? "");
      setPictureUrl(auth.user.photoURL ?? "");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.status]);

  const imageUrl = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file).toString();
    } else {
      return pictureUrl.toString();
    }
  }, [file, pictureUrl]);

  if (auth.status !== AuthStateType.LOADED) {
    return null;
  }
  return (
    <>
      <h5 className="mb-0 text-accent-foreground">Profile Picture</h5>
      <p className="text-[0.8rem] mt-0 text-neutral-500 dark:text-neutral-400">
        Choose a profile photo to represent yourself on the site. You can update
        or remove this photo anytime
      </p>
      <div className="flex gap-5 items-center">
        <Avatar className="w-20 h-20">
          <AvatarImage src={imageUrl} />
          <AvatarFallback className="text-accent-foreground">AM</AvatarFallback>
        </Avatar>
        <UploadFileButton onFileChange={setFile}>Upload</UploadFileButton>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-accent-foreground">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="your name..." {...field} />
                </FormControl>
                <FormDescription>
                  Enter your full name as you want it to appear publicly on the
                  site.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-accent-foreground">Email</FormLabel>
                <FormControl>
                  <Input placeholder="your email..." {...field} />
                </FormControl>
                <FormDescription>
                  Enter your email address. This will be used for account
                  verification and communication.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-accent-foreground">Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Write a brief biography to share with other users. You can
                  choose to make this private or public.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update profile</Button>
        </form>
      </Form>
    </>
  );
}
