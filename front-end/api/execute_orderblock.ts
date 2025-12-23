import { OrderBlock } from "@/lib/order-nodes";
import { addOrder } from "./add_order";
import { amendOrder } from "./amend_order";
import { cancelOrder } from "./cancel_order";
import { cancelAllOrders } from "./cancel_all_orders";
import { cancelAllOrdersAfterX } from "./cancel_all_orders";
import { getWebSocketsToken } from "./get_websockets_token";
import { addOrderBatch } from "./add_order_batch";
import { cancelOrderBatch } from "./cancel_order_batch";


export async function executeOrderBlock(node: OrderBlock) {
  // Check if node is an order type
  if (node.type === "order") {
    const actionType = (node.data as any).actionType;

    switch (actionType) {
      case "add-order":
        return addOrder(node.data);

      case "amend-order":
        return amendOrder(node.data);

      case "cancel-order":
        return cancelOrder(node.data);

      case "cancel-all-orders":
        return cancelAllOrders();

      case "cancel-all-orders-after":
        return cancelAllOrdersAfterX(node.data);

      case "batch-add":
        return addOrderBatch(node.data);

      case "batch-cancel":
        return cancelOrderBatch(node.data);

      default:
        throw new Error(`Unhandled order action type: ${actionType}`);
    }
  }

  // Check if node is a utility type
  if (node.type === "utility") {
    const utilityType = (node.data as any).utilityType;

    switch (utilityType) {
      case "get-websocket-token":
        return getWebSocketsToken();

      default:
        throw new Error(`Unhandled utility type: ${utilityType}`);
    }
  }

  throw new Error(`Unhandled node type: ${node.type}`);
}