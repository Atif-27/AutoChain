"use client";

import ActionNode from "@/components/ReactFlow/ActionNode";
import { initialEdges, initialNodes } from "@/components/ReactFlow/constants";
// import TriggerNode from "@/components/React-Flow/TriggerNode";
import { Button } from "@/components/ui/button";
// import { ToastAction } from "@/components/ui/toast";
// import { toast } from "@/components/ui/use-toast";
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
        actions: nodes.slice(1).map((action) => ({
          availableActionId: action.data.actionId,
          actionMetadata: JSON.parse((action.data.metadata as string) || "{}"),
        })),
      };

      await axiosInstance.post("/api/v1/zap", body);

      console.log("Success");

      router.push("/dashboard");
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const addNode = async () => {
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
