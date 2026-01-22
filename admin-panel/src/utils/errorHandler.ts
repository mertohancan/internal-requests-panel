/**
 * Type-safe error response interface
 */
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

/**
 * Extract error message from various error formats
 * @param error - The error object from catch block
 * @param fallbackMessage - Default message if no specific error is found
 * @returns User-friendly error message
 */
export const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  // Check if error is an object
  if (typeof error !== "object" || error === null) {
    return fallbackMessage;
  }

  const err = error as ErrorResponse;

  // Try to get message from response.data.message
  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  // Try to get message from error.message
  if (err.message) {
    return err.message;
  }

  // Return fallback message
  return fallbackMessage;
};
