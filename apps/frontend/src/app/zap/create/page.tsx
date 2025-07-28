import { ReactFlowProvider, useEdgesState, useNodesState } from "@xyflow/react";

const CreateNewZap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
};

const CreateNewZapProvider = () => {
  return (
    <ReactFlowProvider>
      <CreateNewZap />
    </ReactFlowProvider>
  );
};

export default CreateNewZapProvider;
