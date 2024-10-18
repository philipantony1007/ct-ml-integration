import CustomError from '../errors/custom.error';

export const readMLModelConfiguration = () => {
  const envVars = {
    ml_model_endpoint: process.env.ML_MODEL_END_POINT as string,
  };

  // Validate the ML model endpoint
  if (!envVars.ml_model_endpoint || !isValidUrl(envVars.ml_model_endpoint)) {
    throw new CustomError(
      'InvalidEnvironmentVariablesError',
      'Invalid Environment Variables: ML_MODEL_END_POINT is not a valid URL. Please check your .env file.'
    );
  }

  return envVars;
};

// Helper function to validate URL format
const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
};
