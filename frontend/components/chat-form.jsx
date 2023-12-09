import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { socket } from "@/lib/socket";

const formSchema = z.object({
  prompt: z.string().min(1),
});

const ChatForm = ({ isLoading, setIsLoading }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values) => {
    const newMessage = {
      role: "user",
      content: values.prompt,
    };

	setIsLoading(true);
	socket.emit('user-message', newMessage.content);
	form.reset({
        prompt: "",
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-4"
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input placeholder="Type something" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} >Submit</Button>
      </form>
    </Form>
  );
};

export default ChatForm;
