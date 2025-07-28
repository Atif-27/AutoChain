import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  EmailSelector,
  type SolanaSelector,
  solanaSelectorSchema,
} from "@repo/zod-schemas";
import { Input } from "@/component/ui/input";
import { useNodeId, useNodesData, useReactFlow } from "@xyflow/react";
import { z } from "zod";
import { SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Action } from "./ReactFlow/ActionNode";

const SolanaSelector = ({ closeSheet }: { closeSheet: () => void }) => {
  const nodeId = useNodeId();
  const actionNode = useNodesData<Action>(nodeId as string);
  const { updateNodeData } = useReactFlow();

  const initialValues: SolanaSelector = (() => {
    try {
      const parsed = JSON.parse(actionNode?.data?.metadata ?? "{}");
      return {
        address: parsed.address ?? "",
        amount: parsed.amount ?? "",
      };
    } catch {
      return {
        address: "",
        amount: "",
      };
    }
  })();

  const form = useForm<SolanaSelector>({
    resolver: zodResolver(solanaSelectorSchema),
    defaultValues: initialValues,
  });

  function onSubmit(values: z.infer<typeof solanaSelectorSchema>) {
    updateNodeData(nodeId as string, {
      metadata: JSON.stringify(values),
    });
    closeSheet();
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Send Solana
            </h2>
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
          </div>
          {/* <SheetClose asChild> */}
          <Button type="submit" className="w-full">
            Continue
          </Button>
          {/* </SheetClose> */}
        </form>
      </Form>
    </>
  );
};

export default SolanaSelector;
