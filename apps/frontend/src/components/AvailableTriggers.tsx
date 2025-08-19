import { useEffect, useState } from "react";
import { Button } from "@/component/ui/button";
import { DialogClose } from "@/component/ui/dialog";
import { useNodeId, useReactFlow } from "@xyflow/react";
import axiosInstance from "@/utils/axiosInstance";
import Image from "next/image";
import { AvailableTrigger } from "@repo/zod-schemas";

const AvailableTriggers = () => {
  const nodeId = useNodeId();
  const { updateNodeData } = useReactFlow();
  const [triggers, setTriggers] = useState<AvailableTrigger[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAvailableTriggers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/api/v1/trigger/available");
      setTriggers(res.data.data);
    } catch (error) {
      console.log("Error while fetching the available triggers = ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTriggerData = (trigger: AvailableTrigger) => {
    updateNodeData(nodeId as string, {
      triggerId: trigger.id,
      triggerName: trigger.name,
      triggerImg: trigger.image,
    });
  };

  useEffect(() => {
    fetchAvailableTriggers();
  }, [setTriggers]);

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : triggers.length > 0 ? (
        <>
          {triggers.map((trigger) => (
            <DialogClose asChild key={trigger.id}>
              <Button
                variant={"link"}
                className="w-full flex items-center justify-start gap-4 border-2 py-6"
                onClick={() => setTriggerData(trigger)}
              >
                {trigger.image && (
                  <Image
                    src={trigger?.image}
                    className="w-8 h-8"
                    width={100}
                    height={100}
                    alt=""
                  />
                )}
                <h1 className="font-bold">{trigger.name}</h1>
              </Button>
            </DialogClose>
          ))}
        </>
      ) : (
        <h1>No available triggers</h1>
      )}
    </div>
  );
};

export default AvailableTriggers;
