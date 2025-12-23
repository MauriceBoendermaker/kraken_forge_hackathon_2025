import type { NodeTypes } from "reactflow";

import { OrderNode} from "@/components/strategy-builder/nodes/order-node";
import { ConditionNode } from "@/components/strategy-builder/nodes/condition-node"
import { LogicNode } from "@/components/strategy-builder/nodes/logic-node"
import { UtilityNode } from "@/components/strategy-builder/nodes/utility-node"
import { SystemNode } from "@/components/strategy-builder/nodes/system-node"

export const nodeTypes: NodeTypes = {
  order: OrderNode,
  condition: ConditionNode,
  logic: LogicNode,
  utility: UtilityNode,
  system: SystemNode,
}