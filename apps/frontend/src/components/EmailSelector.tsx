import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel } from "@/component/ui/form";
import { type EmailSelector, emailSelectorSchema } from "@repo/zod-schemas";

import { Button } from "@/component/ui/button";
import { SheetClose } from "@/component/ui/sheet";
import { useNodeId, useReactFlow } from "@xyflow/react";
import { z } from "zod";
import { Input } from "@/component/ui/input";

const EmailSelector = () => {
  const nodeId = useNodeId();
  const { updateNodeData } = useReactFlow();

  const form = useForm<EmailSelector>({
    resolver: zodResolver(emailSelectorSchema),
    defaultValues: {
      email: "",
      body: "",
    },
  });

  function onSubmit(values: z.infer<typeof emailSelectorSchema>) {
    updateNodeData(nodeId as string, {
      metadata: JSON.stringify(values),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Send Email
          </h2>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input {...field} />
              </FormItem>
            )}
          />
          <FormField
            name="body"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <Input {...field} />
              </FormItem>
            )}
          />
        </div>
        <SheetClose asChild>
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </SheetClose>
      </form>
    </Form>
  );
};

export default EmailSelector;
