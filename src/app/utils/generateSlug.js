import { slugify as tSlugify } from "transliteration";

/**
 * যেকোনো string থেকে clean URL slug তৈরি করে।
 * Bangla, English, Mixed — সব handle করে।
 *
 * @param {string} text - product name বা যেকোনো string
 * @returns {string} - clean slug, e.g. "deshi-bittrutt"
 */
export const generateSlug = (text) => {
  if (!text) return `item-${Date.now().toString(36)}`;

  const slug = tSlugify(text, {
    lowercase: true,
    separator: "-",
    trim: true           
  });

  // transliteration কিছু edge case এ empty দিতে পারে
  return slug || `item-${Date.now().toString(36)}`;
};