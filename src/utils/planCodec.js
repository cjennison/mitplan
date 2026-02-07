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

export const encodePlan = (plan) => {
  const jsonString = JSON.stringify(plan);
  return btoa(jsonString);
};
