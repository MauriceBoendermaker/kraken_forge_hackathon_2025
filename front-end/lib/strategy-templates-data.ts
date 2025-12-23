import { Node, Edge } from "reactflow";
import { StrategyMetadata } from "@/interfaces/StrategyMetadata";

export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  nodes: Node[];
  edges: Edge[];
  metadata: StrategyMetadata;
}

export const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  {
    id: "dca",
    name: "Dollar Cost Averaging",
    description: "Automatically purchase fixed amounts at regular intervals",
    category: "Buying Strategies",
    difficulty: "Beginner",
    thumbnail: "/dca-chart-strategy.jpg",
    metadata: {
      name: "Dollar Cost Averaging",
      description: "Buy a fixed amount of crypto at regular intervals, regardless of price",
      version: "1.0",
      tags: ["DCA", "Beginner", "Long-term"],
    },
    nodes: [
      {
        id: "place-order-1",
        type: "order",
        position: { x: 250, y: 100 },
        data: {
          label: "Buy BTC",
          actionType: "add-order",
          ordertype: "market",
          type: "buy",
          volume: "0.001",
          pair: "XBTUSD",
        },
      },
      {
        id: "wait-1",
        type: "utility",
        position: { x: 250, y: 220 },
        data: {
          label: "Wait 7 Days",
          utilityType: "wait",
          duration: 604800,
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "place-order-1",
        target: "wait-1",
        type: "default",
      },
    ],
  },
  {
    id: "stop-loss",
    name: "Stop-Loss",
    description: "Automatically sell when price drops below threshold",
    category: "Risk Management",
    difficulty: "Beginner",
    thumbnail: "/stop-loss-protection.jpg",
    metadata: {
      name: "Stop-Loss Protection",
      description: "Sell automatically when price falls below a certain level to limit losses",
      version: "1.0",
      tags: ["Risk Management", "Stop Loss", "Beginner"],
    },
    nodes: [
      {
        id: "condition-1",
        type: "condition",
        position: { x: 250, y: 100 },
        data: {
          label: "Price Below $40,000",
          conditionType: "price-threshold",
          operator: "<",
          value: 40000,
        },
      },
      {
        id: "cancel-order-1",
        type: "order",
        position: { x: 250, y: 240 },
        data: {
          label: "Sell All BTC",
          actionType: "add-order",
          ordertype: "market",
          type: "sell",
          volume: "0.1",
          pair: "XBTUSD",
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "condition-1",
        target: "cancel-order-1",
        type: "default",
      },
    ],
  },
  {
    id: "trailing-tp",
    name: "Trailing Take-Profit",
    description: "Lock in gains while letting profits run",
    category: "Risk Management",
    difficulty: "Intermediate",
    thumbnail: "/trailing-profit.jpg",
    metadata: {
      name: "Trailing Take-Profit",
      description: "Automatically adjust sell price as profit increases to maximize gains",
      version: "1.0",
      tags: ["Take Profit", "Risk Management", "Intermediate"],
    },
    nodes: [
      {
        id: "condition-1",
        type: "condition",
        position: { x: 150, y: 80 },
        data: {
          label: "Price Up 10%",
          conditionType: "price-threshold",
          operator: ">",
          value: 44000,
        },
      },
      {
        id: "amend-1",
        type: "order",
        position: { x: 150, y: 220 },
        data: {
          label: "Update Stop Loss",
          actionType: "amend-order",
          txid: "ORDER-ID",
          limit_price: "42000",
        },
      },
      {
        id: "condition-2",
        type: "condition",
        position: { x: 400, y: 80 },
        data: {
          label: "Stop Loss Hit",
          conditionType: "price-threshold",
          operator: "<",
          value: 42000,
        },
      },
      {
        id: "sell-1",
        type: "order",
        position: { x: 400, y: 220 },
        data: {
          label: "Sell BTC",
          actionType: "add-order",
          ordertype: "market",
          type: "sell",
          volume: "0.1",
          pair: "XBTUSD",
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "condition-1",
        target: "amend-1",
        type: "default",
      },
      {
        id: "e3-4",
        source: "condition-2",
        target: "sell-1",
        type: "default",
      },
    ],
  },
  {
    id: "grid-trading",
    name: "Grid Trading",
    description: "Place multiple buy/sell orders in a grid pattern",
    category: "Advanced Trading",
    difficulty: "Advanced",
    thumbnail: "/grid-trading-pattern.jpg",
    metadata: {
      name: "Grid Trading Strategy",
      description: "Create a grid of buy and sell orders at different price levels",
      version: "1.0",
      tags: ["Grid Trading", "Advanced", "Volatility"],
    },
    nodes: [
      {
        id: "buy-low-1",
        type: "order",
        position: { x: 100, y: 100 },
        data: {
          label: "Buy @ $39,000",
          actionType: "add-order",
          ordertype: "limit",
          type: "buy",
          volume: "0.01",
          pair: "XBTUSD",
          price: "39000",
        },
      },
      {
        id: "buy-low-2",
        type: "order",
        position: { x: 100, y: 220 },
        data: {
          label: "Buy @ $38,000",
          actionType: "add-order",
          ordertype: "limit",
          type: "buy",
          volume: "0.01",
          pair: "XBTUSD",
          price: "38000",
        },
      },
      {
        id: "sell-high-1",
        type: "order",
        position: { x: 400, y: 100 },
        data: {
          label: "Sell @ $41,000",
          actionType: "add-order",
          ordertype: "limit",
          type: "sell",
          volume: "0.01",
          pair: "XBTUSD",
          price: "41000",
        },
      },
      {
        id: "sell-high-2",
        type: "order",
        position: { x: 400, y: 220 },
        data: {
          label: "Sell @ $42,000",
          actionType: "add-order",
          ordertype: "limit",
          type: "sell",
          volume: "0.01",
          pair: "XBTUSD",
          price: "42000",
        },
      },
    ],
    edges: [],
  },
  {
    id: "breakout",
    name: "Breakout Signal",
    description: "Buy when price breaks above resistance level",
    category: "Technical Analysis",
    difficulty: "Intermediate",
    thumbnail: "/breakout-resistance.jpg",
    metadata: {
      name: "Breakout Trading",
      description: "Enter positions when price breaks through key resistance levels",
      version: "1.0",
      tags: ["Breakout", "Technical", "Intermediate"],
    },
    nodes: [
      {
        id: "condition-1",
        type: "condition",
        position: { x: 250, y: 80 },
        data: {
          label: "Price Above $45,000",
          conditionType: "price-threshold",
          operator: ">",
          value: 45000,
        },
      },
      {
        id: "buy-1",
        type: "order",
        position: { x: 250, y: 200 },
        data: {
          label: "Buy BTC",
          actionType: "add-order",
          ordertype: "market",
          type: "buy",
          volume: "0.05",
          pair: "XBTUSD",
        },
      },
      {
        id: "stop-loss-1",
        type: "order",
        position: { x: 250, y: 320 },
        data: {
          label: "Set Stop Loss",
          actionType: "add-order",
          ordertype: "stop-loss",
          type: "sell",
          volume: "0.05",
          pair: "XBTUSD",
          price: "43500",
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "condition-1",
        target: "buy-1",
        type: "default",
      },
      {
        id: "e2-3",
        source: "buy-1",
        target: "stop-loss-1",
        type: "default",
      },
    ],
  },
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    description: "Trade when price deviates from moving average",
    category: "Technical Analysis",
    difficulty: "Intermediate",
    thumbnail: "/mean-reversion-chart.jpg",
    metadata: {
      name: "Mean Reversion Strategy",
      description: "Buy when price is below average, sell when above",
      version: "1.0",
      tags: ["Mean Reversion", "Technical", "Intermediate"],
    },
    nodes: [
      {
        id: "condition-oversold",
        type: "condition",
        position: { x: 150, y: 80 },
        data: {
          label: "Price Below MA",
          conditionType: "price-threshold",
          operator: "<",
          value: 39500,
        },
      },
      {
        id: "buy-1",
        type: "order",
        position: { x: 150, y: 220 },
        data: {
          label: "Buy BTC",
          actionType: "add-order",
          ordertype: "market",
          type: "buy",
          volume: "0.02",
          pair: "XBTUSD",
        },
      },
      {
        id: "condition-overbought",
        type: "condition",
        position: { x: 400, y: 80 },
        data: {
          label: "Price Above MA",
          conditionType: "price-threshold",
          operator: ">",
          value: 40500,
        },
      },
      {
        id: "sell-1",
        type: "order",
        position: { x: 400, y: 220 },
        data: {
          label: "Sell BTC",
          actionType: "add-order",
          ordertype: "market",
          type: "sell",
          volume: "0.02",
          pair: "XBTUSD",
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "condition-oversold",
        target: "buy-1",
        type: "default",
      },
      {
        id: "e3-4",
        source: "condition-overbought",
        target: "sell-1",
        type: "default",
      },
    ],
  },
  {
    id: "rsi-momentum",
    name: "RSI Momentum",
    description: "Execute trades based on RSI overbought/oversold signals",
    category: "Technical Analysis",
    difficulty: "Intermediate",
    thumbnail: "/rsi-momentum-trading.jpg",
    metadata: {
      name: "RSI Momentum Strategy",
      description: "Trade based on RSI indicator signals for momentum",
      version: "1.0",
      tags: ["RSI", "Momentum", "Technical"],
    },
    nodes: [
      {
        id: "condition-oversold",
        type: "condition",
        position: { x: 150, y: 80 },
        data: {
          label: "RSI < 30 (Oversold)",
          conditionType: "rsi",
          operator: "<",
          value: 30,
        },
      },
      {
        id: "buy-1",
        type: "order",
        position: { x: 150, y: 220 },
        data: {
          label: "Buy BTC",
          actionType: "add-order",
          ordertype: "market",
          type: "buy",
          volume: "0.03",
          pair: "XBTUSD",
        },
      },
      {
        id: "condition-overbought",
        type: "condition",
        position: { x: 400, y: 80 },
        data: {
          label: "RSI > 70 (Overbought)",
          conditionType: "rsi",
          operator: ">",
          value: 70,
        },
      },
      {
        id: "sell-1",
        type: "order",
        position: { x: 400, y: 220 },
        data: {
          label: "Sell BTC",
          actionType: "add-order",
          ordertype: "market",
          type: "sell",
          volume: "0.03",
          pair: "XBTUSD",
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "condition-oversold",
        target: "buy-1",
        type: "default",
      },
      {
        id: "e3-4",
        source: "condition-overbought",
        target: "sell-1",
        type: "default",
      },
    ],
  },
  {
    id: "pairs-trading",
    name: "Pairs Trading",
    description: "Trade correlated assets based on divergence",
    category: "Advanced Trading",
    difficulty: "Advanced",
    thumbnail: "/pairs-trading.jpg",
    metadata: {
      name: "Pairs Trading Strategy",
      description: "Trade the spread between two correlated assets",
      version: "1.0",
      tags: ["Pairs", "Advanced", "Arbitrage"],
    },
    nodes: [
      {
        id: "condition-spread",
        type: "condition",
        position: { x: 250, y: 80 },
        data: {
          label: "Spread > Threshold",
          conditionType: "price-threshold",
          operator: ">",
          value: 1000,
        },
      },
      {
        id: "buy-weak",
        type: "order",
        position: { x: 150, y: 220 },
        data: {
          label: "Buy Undervalued",
          actionType: "add-order",
          ordertype: "market",
          type: "buy",
          volume: "0.02",
          pair: "ETHUSD",
        },
      },
      {
        id: "sell-strong",
        type: "order",
        position: { x: 350, y: 220 },
        data: {
          label: "Sell Overvalued",
          actionType: "add-order",
          ordertype: "market",
          type: "sell",
          volume: "0.001",
          pair: "XBTUSD",
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "condition-spread",
        target: "buy-weak",
        type: "default",
      },
      {
        id: "e1-3",
        source: "condition-spread",
        target: "sell-strong",
        type: "default",
      },
    ],
  },
];
