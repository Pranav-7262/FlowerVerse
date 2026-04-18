/**
 * Parses flower description into formatted points
 * Handles both line-break separated and sentence-separated descriptions
 */
export const parseDescriptionPoints = (description) => {
  if (!description) return [];

  // First, split by newlines
  let points = description
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // If only one line exists, try splitting by period or bullet points
  if (points.length === 1) {
    const text = points[0];

    // Check if it contains bullet points or dashes
    if (text.includes("•") || text.includes("-") || text.includes("*")) {
      points = text
        .split(/[•\-*]/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    } else if (text.includes(". ")) {
      // Split by period followed by space
      points = text
        .split(/\.\s+/)
        .map((line) => line.trim() + (line.endsWith(".") ? "" : "."))
        .filter((line) => line.length > 0);
    }
  }

  return points;
};

/**
 * Limits the number of description points displayed
 */
export const limitDescriptionPoints = (points, limit = 6) => {
  return points.slice(0, limit);
};

/**
 * Format description with proper capitalization
 */
export const formatDescriptionPoint = (point) => {
  if (!point) return "";
  const trimmed = point.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};
