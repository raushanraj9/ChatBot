'use client';

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
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

const formSchema = z.object({
  input: z.string().min(1),
});

export default function Home() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <div className="container space-y-6">
		<h1 className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Ask from ChatBot</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-grow gap-4">
            <FormField
              control={form.control}
              name="input"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Ask from ChatBot</FormLabel> */}
                  <FormControl>
                    <Input placeholder="Type something" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="">Submit</Button>
          </form>
        </Form>
		<div className="border-2 border-solid min-h-[75vh]">

		</div>
      </div>
    </main>
  );
}
