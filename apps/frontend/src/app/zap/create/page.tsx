"use client";

import ActionNode from "@/components/ReactFlow/ActionNode";
import { initialEdges, initialNodes } from "@/components/ReactFlow/constants";
// import TriggerNode from "@/components/React-Flow/TriggerNode";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  NodeTypes,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import router from "next/router";
import TriggerNode from "@/components/ReactFlow/TriggerNode";

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

const CreateNewZap = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [clicked, setClicked] = useState<number>(0);
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const publishZapHandler = async () => {
    try {
      const body = {
        availableTriggerId: nodes[0].data.triggerId,
        actions: nodes.slice(1).map((action, index) => {
          if (!action.data.actionId || !action.data.metadata) {
            // throw new Error(`Action Number ${index + 1}: detail Missing`);
          }
          return {
            availableActionId: action.data.actionId,
            actionMetadata: JSON.parse(
              (action.data.metadata as string) || "{}"
            ),
          };
        }),
      };

      console.log(body);

      // Validate that all actions have required data
      const missingActionDetails = nodes.slice(1).findIndex((action, index) => {
        return !action.data.actionId || !action.data.metadata;
      });

      if (missingActionDetails !== -1) {
        toast.error(`Action ${missingActionDetails + 1} is missing required details. Please configure all actions.`);
        return;
      }

      await axiosInstance.post("/api/v1/zap", body);
      toast.success("Zap published successfully! Redirecting to dashboard...");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || "Failed to publish Zap. Please try again.";
        console.error("Publish Zap error:", error);
        toast.error(errorMessage);
      } else {
        console.error("Error while publishing Zap:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const addNode = async () => {
    try {
      setNodes((prevNodes) => [
        ...prevNodes,
        {
          id: (prevNodes.length + 1).toString(),
          position: {
            x: prevNodes[prevNodes.length - 1].position.x,
            y: prevNodes[prevNodes.length - 1].position.y + 200,
          },
          data: { actionId: "", actionName: "", actionImg: "", metadata: "" },
          type: "action",
        },
      ]);
      setClicked((prev) => prev + 1);
      toast.info("New action node added. Configure it to proceed.", {
        description: "Click on the node to set up the action details."
      });
    } catch (error) {
      console.error("Error adding node:", error);
      toast.error("Failed to add new node. Please try again.");
    }
  };

  const addEdge = async () => {
    setEdges((prevEdges) => [
      ...prevEdges,
      {
        id: `ed-${edges.length + 1}`,
        source: prevEdges[prevEdges.length - 1].target.toString(),
        target: nodes[nodes.length - 1].id.toString(),
      },
    ]);
  };

  const fitViewOptions = {
    maxZoom: 1,
    minZoom: 0.5,
  };

  useEffect(() => {
    if (clicked !== 0) {
      addEdge();
    }
  }, [clicked]);

  return (
    <div className="w-full h-[92vh] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        zoomOnScroll={false}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={fitViewOptions}
      >
        <Background variant={BackgroundVariant.Dots} gap={10} />
        <Controls />
        <div className="flex items-center gap-4 absolute right-4 top-4">
          <Button className="z-10" onClick={addNode}>
            Add Node
          </Button>
          <Button className="z-10" onClick={publishZapHandler}>
            Publish
          </Button>
          <Button className="z-10  cursor-pointer bg-teal-500 hover:bg-teal-600" onClick={() => router.push("/ai")}>
              <div className="text-white">
                Build with AI</div>
          </Button>
        </div>
      </ReactFlow>
    </div>
  );
};

const CreateNewZapProvider = () => {
  return (
    <ReactFlowProvider>
      <CreateNewZap />
    </ReactFlowProvider>
  );
};

export default CreateNewZapProvider;
