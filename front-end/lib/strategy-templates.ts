import { AmendOrderParams } from "@/api/amend_order"
import { OrderBlock } from "./order-nodes"
import { AddOrderParams } from "@/api/add_order"
import { CancelOrderParams } from "@/api/cancel_order"
import { CancelAllOrdersAfterParams } from "@/api/cancel_all_orders"
import { CancelOrderBatchParams } from "@/api/cancel_order_batch"
import { AddOrderBatchOrder } from "@/api/add_order_batch"

export const blockTemplates = {
  // Order Actions
  "place-order": {
  label: "Place Order",
  nodeType: "order",
  defaultData: {
    actionType: "add-order",
    ordertype: "market",
    type: "buy",
    volume: "1",
    pair: "XBTUSD",
    label: "Place Order",
  } as AddOrderParams & { actionType: string },
},
  "amend-order": {
  label: "Amend Order",
  nodeType: "order",
  defaultData: {
    actionType: "amend-order",
    txid: "OZUCWN-2ZS5T-JN2VN6",
    order_qty: "1",
    limit_price: "0",
    label: "Amend Order",
  } as AmendOrderParams & { actionType: string },
},
  "cancel-order": {
  label: "Cancel Order",
  nodeType: "order",
  defaultData: {
    actionType: "cancel-order",
    label: "Cancel Order",
  } as CancelOrderParams & { actionType: string },
},
  "cancel-all-orders": {
    label: "Cancel All Orders",
    nodeType: "order",
    defaultData: {
      actionType: "cancel-all-orders",
      label: "Cancel All Orders"
    },
  },
  "cancel-all-orders-after": {
  label: "Cancel All After X",
  nodeType: "order",
  defaultData: {
    actionType: "cancel-all-orders-after",
    timeout: 60,
    label: "Cancel all orders after X",
  } as CancelAllOrdersAfterParams & { actionType: string },
},
  "batch-add": {
    label: "Batch Add Orders",
    nodeType: "order",
    defaultData: {
      actionType: "batch-add",
      orders: [] as AddOrderBatchOrder[],
      pair: "XBTUSD",
      label: "Add Order Batch"
    },
  },
  "batch-cancel": {
  label: "Batch Cancel Orders",
  nodeType: "order",
  defaultData: {
    actionType: "batch-cancel",
    label: "Cancel Order Batch",
  } as CancelOrderBatchParams & { actionType: string },
},
  
  // Conditions
  "if-else": {
    label: "If/Else",
    nodeType: "condition",
    defaultData: {
      label: "If/Else",
      conditionType: "if-else",
      expression: "",
    },
  },
  "compare": {
    label: "Compare",
    nodeType: "condition",
    defaultData: {
      label: "Compare",
      conditionType: "compare",
      operator: ">",
      value: 0,
    },
  },
  "time-check": {
    label: "Time Check",
    nodeType: "condition",
    defaultData: {
      label: "Time Check",
      conditionType: "time",
      timeCondition: "after",
      time: "09:00",
    },
  },
  "price-threshold": {
    label: "Price Threshold",
    nodeType: "condition",
    defaultData: {
      label: "Price Threshold",
      conditionType: "price",
      operator: ">",
      value: 0,
      pair: "XBTUSD",
    },
  },
  
  // Utilities
  "wait": {
    label: "Wait",
    nodeType: "utility",
    defaultData: {
      label: "Wait",
      utilityType: "wait",
      duration: 60,
    },
  },
  "log": {
    label: "Log",
    nodeType: "utility",
    defaultData: {
      label: "Log Message",
      utilityType: "log",
      message: "",
    },
  },
  "get-balance": {
    label: "Get Balance",
    nodeType: "utility",
    defaultData: {
      label: "Get Balance",
      utilityType: "get-balance",
    },
  },
  "fetch-ticker": {
    label: "Fetch Ticker",
    nodeType: "utility",
    defaultData: {
      label: "Fetch Ticker",
      utilityType: "fetch-ticker",
      pair: "XBTUSD",
    },
  },

  // System
  "get-token": {
    label: "Get WebSocket Token",
    nodeType: "system",
    defaultData: {
      label: "Get WebSocket Token",
      utilityType: "get-websocket-token",
    },
  },
  "authenticate": {
    label: "Authenticate",
    nodeType: "system",
    defaultData: {
      label: "Authenticate",
      utilityType: "authenticate",
    },
  },
  "error-handler": {
    label: "Error Handler",
    nodeType: "system",
    defaultData: {
      label: "Error Handler",
      utilityType: "error-handler",
      errorAction: "log",
      retryCount: 3,
    },
  },
} as const

export const initialNodes: OrderBlock[] = [
  {
  id: "1",
  type: "order",
  position: { x: 250, y: 50 },
  data: {
    actionType: "add-order",
    label: "Place Order",
    ordertype: "market",
    type: "buy",
    volume: "1.25",
    pair: "XBTUSD",
    price: "27500",
    cl_ord_id: "6d1b345e-2821-40e2-ad83-4ecb18a06876",
    }
  }
]

export const initialEdges = [{ id: "e1-2", source: "1", target: "2", animated: true }]
