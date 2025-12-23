import { Node, Edge } from "reactflow";

export interface ValidationIssue {
  id: string;
  type: "error" | "warning";
  message: string;
  nodeRef?: string;
  nodeLabel?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  totalIssues: number;
}

export function validateStrategy(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  let issueCounter = 0;

  console.log("Starting validation...");
  console.log("Nodes to validate:", nodes);
  console.log("Edges to validate:", edges);

  // Check if strategy has nodes
  if (!nodes || nodes.length === 0) {
    errors.push({
      id: `err-${issueCounter++}`,
      type: "error",
      message: "Strategy has no blocks. Add at least one block to your strategy.",
    });
    return {
      isValid: false,
      errors,
      warnings,
      totalIssues: errors.length + warnings.length,
    };
  }

  // Validate each node
  nodes.forEach((node, index) => {
    console.log(`Validating node ${index}:`, node);

    if (!node || !node.data) {
      errors.push({
        id: `err-${issueCounter++}`,
        type: "error",
        message: `Block at position ${index} has no data`,
        nodeRef: node?.id,
      });
      return;
    }

    const nodeData = node.data as any;
    const nodeLabel = nodeData.label || "Unnamed Block";

    console.log(`Node ${index} - Type: ${node.type}, ActionType: ${nodeData.actionType}, Label: ${nodeLabel}`);

    // Check for order nodes
    if (node.type === "order") {
      const actionType = nodeData.actionType;
      console.log(`Validating order node with actionType: ${actionType}`);

      // Validate based on action type
      switch (actionType) {
        case "add-order":
          // Required fields for adding an order
          if (!nodeData.pair || nodeData.pair.trim() === "") {
            errors.push({
              id: `err-${issueCounter++}`,
              type: "error",
              message: "Trading pair is required for placing an order",
              nodeRef: node.id,
              nodeLabel,
            });
          }

          if (!nodeData.volume || nodeData.volume.trim() === "" || parseFloat(nodeData.volume) <= 0) {
            errors.push({
              id: `err-${issueCounter++}`,
              type: "error",
              message: "Volume must be greater than 0",
              nodeRef: node.id,
              nodeLabel,
            });
          }

          if (!nodeData.ordertype) {
            errors.push({
              id: `err-${issueCounter++}`,
              type: "error",
              message: "Order type is required (market, limit, etc.)",
              nodeRef: node.id,
              nodeLabel,
            });
          }

          if (!nodeData.type || (nodeData.type !== "buy" && nodeData.type !== "sell")) {
            errors.push({
              id: `err-${issueCounter++}`,
              type: "error",
              message: "Order side must be either 'buy' or 'sell'",
              nodeRef: node.id,
              nodeLabel,
            });
          }

          // Limit orders need a price
          if (nodeData.ordertype === "limit" && (!nodeData.price || nodeData.price.trim() === "")) {
            errors.push({
              id: `err-${issueCounter++}`,
              type: "error",
              message: "Limit orders require a price",
              nodeRef: node.id,
              nodeLabel,
            });
          }

          // Iceberg orders need displayvol
          if (nodeData.ordertype === "iceberg" && (!nodeData.displayvol || nodeData.displayvol.trim() === "")) {
            warnings.push({
              id: `warn-${issueCounter++}`,
              type: "warning",
              message: "Iceberg orders should specify display volume (minimum 1/15 of volume)",
              nodeRef: node.id,
              nodeLabel,
            });
          }

          // Volume validation warnings
          const volume = parseFloat(nodeData.volume);
          if (nodeData.volume && volume < 0.001) {
            warnings.push({
              id: `warn-${issueCounter++}`,
              type: "warning",
              message: `Order volume is very small (${nodeData.volume}) - consider transaction fees`,
              nodeRef: node.id,
              nodeLabel,
            });
          }

          // Warn about potentially large orders
          if (nodeData.volume && volume > 10) {
            warnings.push({
              id: `warn-${issueCounter++}`,
              type: "warning",
              message: `Large order volume (${nodeData.volume}) - verify you have sufficient funds before executing`,
              nodeRef: node.id,
              nodeLabel,
            });
          }

          // Warn if using market orders
          if (nodeData.ordertype === "market") {
            warnings.push({
              id: `warn-${issueCounter++}`,
              type: "warning",
              message: "Market orders may execute at unexpected prices during volatility",
              nodeRef: node.id,
              nodeLabel,
            });
          }

          // Check if price is reasonable for limit orders
          if (nodeData.ordertype === "limit" && nodeData.price) {
            const price = parseFloat(nodeData.price);
            if (price <= 0) {
              errors.push({
                id: `err-${issueCounter++}`,
                type: "error",
                message: "Limit price must be greater than 0",
                nodeRef: node.id,
                nodeLabel,
              });
            }
          }

          // Warn about potential insufficient funds
          warnings.push({
            id: `warn-${issueCounter++}`,
            type: "warning",
            message: "Ensure you have sufficient funds in your account before executing this order",
            nodeRef: node.id,
            nodeLabel,
          });
          break;

        case "amend-order":
          // Need either txid or cl_ord_id
          if ((!nodeData.txid || nodeData.txid.trim() === "") &&
              (!nodeData.cl_ord_id || nodeData.cl_ord_id.trim() === "")) {
            errors.push({
              id: `err-${issueCounter++}`,
              type: "error",
              message: "Either Order ID (txid) or Client Order ID is required to amend an order",
              nodeRef: node.id,
              nodeLabel,
            });
          }

          // Need at least one field to amend
          if (!nodeData.order_qty && !nodeData.limit_price && !nodeData.trigger_price) {
            warnings.push({
              id: `warn-${issueCounter++}`,
              type: "warning",
              message: "No changes specified - at least one of order quantity, limit price, or trigger price should be set",
              nodeRef: node.id,
              nodeLabel,
            });
          }
          break;

        case "cancel-order":
          // Need either txid or cl_ord_id
          if ((!nodeData.txid || nodeData.txid.toString().trim() === "") &&
              (!nodeData.cl_ord_id || nodeData.cl_ord_id.trim() === "")) {
            errors.push({
              id: `err-${issueCounter++}`,
              type: "error",
              message: "Either Order ID (txid) or Client Order ID is required to cancel an order",
              nodeRef: node.id,
              nodeLabel,
            });
          }
          break;

        case "cancel-all-orders-after":
          if (nodeData.timeout === undefined || nodeData.timeout < 0) {
            errors.push({
              id: `err-${issueCounter++}`,
              type: "error",
              message: "Timeout must be a non-negative number (0 to disable)",
              nodeRef: node.id,
              nodeLabel,
            });
          }
          break;

        case "batch-add":
          if (!nodeData.pair || nodeData.pair.trim() === "") {
            errors.push({
              id: `err-${issueCounter++}`,
              type: "error",
              message: "Trading pair is required for batch orders",
              nodeRef: node.id,
              nodeLabel,
            });
          }

          if (!nodeData.orders || nodeData.orders.length === 0) {
            errors.push({
              id: `err-${issueCounter++}`,
              type: "error",
              message: "Batch order must contain at least one order",
              nodeRef: node.id,
              nodeLabel,
            });
          } else if (nodeData.orders.length > 15) {
            warnings.push({
              id: `warn-${issueCounter++}`,
              type: "warning",
              message: `Batch contains ${nodeData.orders.length} orders - Kraken may have rate limits`,
              nodeRef: node.id,
              nodeLabel,
            });
          }
          break;

        case "batch-cancel":
          const ordersCount = (nodeData.orders || []).length;
          const clOrdIdsCount = (nodeData.cl_ord_ids || []).length;

          if (ordersCount === 0 && clOrdIdsCount === 0) {
            errors.push({
              id: `err-${issueCounter++}`,
              type: "error",
              message: "Must specify at least one order ID or client order ID to cancel",
              nodeRef: node.id,
              nodeLabel,
            });
          }

          if (ordersCount + clOrdIdsCount > 50) {
            errors.push({
              id: `err-${issueCounter++}`,
              type: "error",
              message: `Too many orders to cancel (${ordersCount + clOrdIdsCount}). Maximum is 50.`,
              nodeRef: node.id,
              nodeLabel,
            });
          }
          break;
      }
    }

    // Check for condition nodes
    if (node.type === "condition") {
      if (!nodeData.conditionType) {
        errors.push({
          id: `err-${issueCounter++}`,
          type: "error",
          message: "Condition type is not specified",
          nodeRef: node.id,
          nodeLabel,
        });
      }

      // Check for outgoing edges
      const outgoingEdges = edges.filter((e) => e.source === node.id);
      if (outgoingEdges.length === 0) {
        warnings.push({
          id: `warn-${issueCounter++}`,
          type: "warning",
          message: "Condition has no outgoing connections - it won't affect the flow",
          nodeRef: node.id,
          nodeLabel,
        });
      }
    }

    // Check for utility nodes
    if (node.type === "utility") {
      const utilityType = nodeData.utilityType;

      if (utilityType === "wait" && (!nodeData.duration || nodeData.duration <= 0)) {
        warnings.push({
          id: `warn-${issueCounter++}`,
          type: "warning",
          message: "Wait duration should be greater than 0",
          nodeRef: node.id,
          nodeLabel,
        });
      }
    }

    // Check if node has no connections
    const hasIncoming = edges.some((e) => e.target === node.id);
    const hasOutgoing = edges.some((e) => e.source === node.id);

    if (!hasIncoming && !hasOutgoing && nodes.length > 1) {
      warnings.push({
        id: `warn-${issueCounter++}`,
        type: "warning",
        message: "Block is isolated (no connections) and won't be executed",
        nodeRef: node.id,
        nodeLabel,
      });
    }
  });

  // Check for disconnected flows
  if (nodes.length > 1 && edges.length === 0) {
    warnings.push({
      id: `warn-${issueCounter++}`,
      type: "warning",
      message: "Multiple blocks exist but none are connected - they will execute independently",
    });
  }

  // General warnings
  const hasErrorHandler = nodes.some((n) =>
    n.type === "utility" && (n.data as any).utilityType === "error-handler"
  );

  if (!hasErrorHandler && nodes.length > 0) {
    warnings.push({
      id: `warn-${issueCounter++}`,
      type: "warning",
      message: "No error handler defined - strategy will halt on API errors",
    });
  }

  const result = {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalIssues: errors.length + warnings.length,
  };

  console.log("Validation complete!");
  console.log("Final result:", result);
  console.log(`Found ${errors.length} errors and ${warnings.length} warnings`);

  return result;
}
