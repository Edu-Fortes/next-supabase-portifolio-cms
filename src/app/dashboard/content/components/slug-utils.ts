/**
 * Converts a title string into a URL-friendly slug
 * @param title - The title to convert
 * @returns A slugified string
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both ends
    .normalize('NFD') // Decompose characters (e.g., "ç" -> "c" + "¸")
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
