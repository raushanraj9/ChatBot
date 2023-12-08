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
import { BASE_API_URL } from "@/config/site";
import axios from 'axios';

const formSchema = z.object({
  prompt: z.string().min(1),
});

const ChatForm = ( { appendMessage } ) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values) => {
	/**
	 * @todo
	 * Make API call to backend
	 */
	const newMessage = {
		role: 'user',
		content: values.prompt,
	}

	const apiUrl = `${BASE_API_URL}/conversation`;
	const { data } = await axios.post( apiUrl, {
		message: newMessage.content,
	} );

	if ( 'message' in data && data.message?._id ) {
		newMessage._id = data.message._id;
		appendMessage( newMessage );
	} else {
		// throw error
	}
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-4"
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
        <Button type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ChatForm;
