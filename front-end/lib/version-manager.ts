import { Node, Edge } from "reactflow";
import { StrategyMetadata } from "@/interfaces/StrategyMetadata";

export interface StrategyVersion {
  id: string;
  versionNumber: string;
  label: string;
  timestamp: string;
  timestampISO: string;
  status: "current" | "previous";
  nodes: Node[];
  edges: Edge[];
  metadata: StrategyMetadata;
  changes: {
    added: string[];
    removed: string[];
    modified: string[];
  };
}

const VERSION_HISTORY_KEY = "strategy-version-history";
const MAX_VERSIONS = 50; // Keep last 50 versions

/**
 * Get all saved versions from localStorage
 */
export function getVersionHistory(): StrategyVersion[] {
  if (typeof window === "undefined") return [];

  try {
    const historyStr = localStorage.getItem(VERSION_HISTORY_KEY);
    if (!historyStr) return [];

    const history = JSON.parse(historyStr);
    return history || [];
  } catch (error) {
    console.error("Failed to load version history:", error);
    return [];
  }
}

/**
 * Calculate human-readable timestamp (e.g., "2 hours ago", "5 days ago")
 */
function getRelativeTime(isoTimestamp: string): string {
  const now = new Date();
  const past = new Date(isoTimestamp);
  const diffMs = now.getTime() - past.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;
}

/**
 * Calculate changes between two versions
 */
function calculateChanges(
  previousNodes: Node[] = [],
  currentNodes: Node[]
): { added: string[]; removed: string[]; modified: string[] } {
  const added: string[] = [];
  const removed: string[] = [];
  const modified: string[] = [];

  const prevNodeMap = new Map(previousNodes.map(n => [n.id, n]));
  const currNodeMap = new Map(currentNodes.map(n => [n.id, n]));

  // Find added and modified nodes
  currentNodes.forEach(currNode => {
    const prevNode = prevNodeMap.get(currNode.id);

    if (!prevNode) {
      // Node was added
      const label = (currNode.data as any)?.label || "Unnamed Block";
      added.push(label);
    } else {
      // Check if node was modified
      const prevData = JSON.stringify(prevNode.data);
      const currData = JSON.stringify(currNode.data);

      if (prevData !== currData) {
        const label = (currNode.data as any)?.label || "Unnamed Block";
        modified.push(label);
      }
    }
  });

  // Find removed nodes
  previousNodes.forEach(prevNode => {
    if (!currNodeMap.has(prevNode.id)) {
      const label = (prevNode.data as any)?.label || "Unnamed Block";
      removed.push(label);
    }
  });

  return { added, removed, modified };
}

/**
 * Save a new version to history
 */
export function saveVersion(
  nodes: Node[],
  edges: Edge[],
  metadata: StrategyMetadata,
  label?: string
): StrategyVersion {
  const history = getVersionHistory();

  // Mark all previous versions as "previous"
  history.forEach(v => v.status = "previous");

  // Get previous version for diff calculation
  const previousVersion = history[0] || null;

  // Calculate version number
  const versionNumber = history.length === 0 ? "1.0" :
    `1.${history.length}`;

  // Calculate changes
  const changes = calculateChanges(previousVersion?.nodes || [], nodes);

  // Auto-generate label if not provided
  let autoLabel = label || "Manual save";
  if (!label) {
    if (changes.added.length > 0 && changes.removed.length === 0 && changes.modified.length === 0) {
      autoLabel = `Added ${changes.added.length} block${changes.added.length !== 1 ? "s" : ""}`;
    } else if (changes.removed.length > 0 && changes.added.length === 0 && changes.modified.length === 0) {
      autoLabel = `Removed ${changes.removed.length} block${changes.removed.length !== 1 ? "s" : ""}`;
    } else if (changes.modified.length > 0 && changes.added.length === 0 && changes.removed.length === 0) {
      autoLabel = `Modified ${changes.modified.length} block${changes.modified.length !== 1 ? "s" : ""}`;
    } else if (changes.added.length + changes.removed.length + changes.modified.length > 0) {
      autoLabel = "Updated strategy";
    } else {
      autoLabel = "No changes";
    }
  }

  const timestampISO = new Date().toISOString();

  const newVersion: StrategyVersion = {
    id: `version-${Date.now()}`,
    versionNumber,
    label: autoLabel,
    timestamp: getRelativeTime(timestampISO),
    timestampISO,
    status: "current",
    nodes: JSON.parse(JSON.stringify(nodes)), // Deep copy
    edges: JSON.parse(JSON.stringify(edges)), // Deep copy
    metadata: JSON.parse(JSON.stringify(metadata)), // Deep copy
    changes,
  };

  // Add to beginning of history
  history.unshift(newVersion);

  // Keep only last MAX_VERSIONS
  if (history.length > MAX_VERSIONS) {
    history.splice(MAX_VERSIONS);
  }

  // Save to localStorage
  try {
    localStorage.setItem(VERSION_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save version history:", error);
  }

  return newVersion;
}

/**
 * Restore a version (load it back into the editor)
 */
export function restoreVersion(versionId: string): {
  nodes: Node[];
  edges: Edge[];
  metadata: StrategyMetadata;
} | null {
  const history = getVersionHistory();
  const version = history.find(v => v.id === versionId);

  if (!version) {
    console.error(`Version ${versionId} not found`);
    return null;
  }

  // Save current state as a new version before restoring
  const currentNodes = localStorage.getItem("strategy-builder-nodes");
  const currentEdges = localStorage.getItem("strategy-builder-edges");
  const currentMetadata = localStorage.getItem("strategy-builder-metadata");

  if (currentNodes && currentEdges && currentMetadata) {
    try {
      saveVersion(
        JSON.parse(currentNodes),
        JSON.parse(currentEdges),
        JSON.parse(currentMetadata),
        `Before restoring to v${version.versionNumber}`
      );
    } catch (error) {
      console.error("Failed to save current state before restore:", error);
    }
  }

  // Load the version data into localStorage
  try {
    localStorage.setItem("strategy-builder-nodes", JSON.stringify(version.nodes));
    localStorage.setItem("strategy-builder-edges", JSON.stringify(version.edges));
    localStorage.setItem("strategy-builder-metadata", JSON.stringify(version.metadata));
  } catch (error) {
    console.error("Failed to restore version:", error);
    return null;
  }

  return {
    nodes: version.nodes,
    edges: version.edges,
    metadata: version.metadata,
  };
}

/**
 * Update relative timestamps for all versions
 */
export function refreshVersionTimestamps(): StrategyVersion[] {
  const history = getVersionHistory();

  history.forEach(version => {
    version.timestamp = getRelativeTime(version.timestampISO);
  });

  try {
    localStorage.setItem(VERSION_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to update version timestamps:", error);
  }

  return history;
}

/**
 * Delete a specific version
 */
export function deleteVersion(versionId: string): boolean {
  const history = getVersionHistory();
  const index = history.findIndex(v => v.id === versionId);

  if (index === -1) return false;

  history.splice(index, 1);

  try {
    localStorage.setItem(VERSION_HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error("Failed to delete version:", error);
    return false;
  }
}

/**
 * Clear all version history
 */
export function clearVersionHistory(): void {
  try {
    localStorage.removeItem(VERSION_HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear version history:", error);
  }
}
