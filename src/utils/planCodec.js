/**
 * Plan Codec - Utilities for encoding and decoding Base64 mitigation plans
 */

/**
 * Decodes a Base64 encoded mitigation plan string
 *
 * @param {string} base64String - The Base64 encoded plan
 * @returns {{ success: boolean, data?: object, error?: string }}
 */
export const decodePlan = (base64String) => {
  try {
    // Clean up the input (remove whitespace, newlines)
    const cleanedString = base64String.trim().replace(/\s/g, '');

    // Decode Base64
    const jsonString = atob(cleanedString);

    // Parse JSON
    const plan = JSON.parse(jsonString);

    return { success: true, data: plan };
  } catch (error) {
    if (error.name === 'InvalidCharacterError' || error.message.includes('atob')) {
      return { success: false, error: 'Invalid Base64 string. Please check your input.' };
    }
    if (error instanceof SyntaxError) {
      return { success: false, error: 'Invalid plan format. The decoded data is not valid JSON.' };
    }
    return { success: false, error: `Failed to decode plan: ${error.message}` };
  }
};

/**
 * Encodes a mitigation plan object to Base64
 *
 * @param {object} plan - The mitigation plan object
 * @returns {string} Base64 encoded string
 */
export const encodePlan = (plan) => {
  const jsonString = JSON.stringify(plan);
  return btoa(jsonString);
};
