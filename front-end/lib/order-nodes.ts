import { AddOrderParams } from "@/api/add_order";
import { AmendOrderParams } from "@/api/amend_order";
import { AddOrderBatchParams } from "@/api/add_order_batch";
import { CancelOrderParams } from "@/api/cancel_order";
import { CancelOrderBatchParams } from "@/api/cancel_order_batch";
import { CancelAllOrdersAfterParams } from "@/api/cancel_all_orders";

export type NodeType =
  | "add order"
  | "amend order"
  | "cancel order"
  | "cancel all orders"
  | "cancel all orders after X"
  | "get websockets token"
  | "add order batch"
  | "cancel order batch"
  | "edit order";

export interface Position {
  x: number;
  y: number;
}

export interface BaseNode {
  id: string;
  position: Position;
  type: NodeType;
}

export interface AddOrderNode extends BaseNode {
  type: "add order";
  data: AddOrderParams & { actionType: "add-order" };
}

// dummy, not yet according to DOCS
export interface AmendOrderNode extends BaseNode {
  type: "amend order";
  data: AmendOrderParams & { actionType: "amend-order" };
}

// dummy, not yet according to DOCS
export interface CancelOrderNode extends BaseNode {
  type: "cancel order";
  data: CancelOrderParams & { actionType: "cancel-order" };
}

// dummy, not yet according to DOCS
export interface CancelAllOrdersNode extends BaseNode {
  type: "cancel all orders";
  data: { label: "Cancel All Orders"; actionType: "cancel-all-orders" };
}

// dummy, not yet according to DOCS
export interface CancelAllOrdersAfterXNode extends BaseNode {
  type: "cancel all orders after X";
  data: CancelAllOrdersAfterParams & { actionType: "cancel-all-orders-after" };
}

// dummy, not yet according to DOCS
export interface GetWebsocketTokenNode extends BaseNode {
  type: "get websockets token";
  data: { label: "Get Websockets Token"; actionType: "get-websocket-token" };
}

// dummy, not yet according to DOCS
export interface AddOrderBatchNode extends BaseNode {
  type: "add order batch";
  data: AddOrderBatchParams & { actionType: "batch-add" };
}

// dummy, not yet according to DOCS
export interface CancelOrderBatchNode extends BaseNode {
  type: "cancel order batch";
  data: CancelOrderBatchParams & { actionType: "batch-cancel" };
}

export type OrderBlock =
  | AddOrderNode
  | AmendOrderNode
  | CancelOrderNode
  | CancelAllOrdersNode
  | CancelAllOrdersAfterXNode
  | GetWebsocketTokenNode
  | AddOrderBatchNode
  | CancelOrderBatchNode;