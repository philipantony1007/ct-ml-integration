// utils/mlClient.utils.ts
import axios from 'axios';
import { readConfiguration } from './config.utils';
import CustomError from '../errors/custom.error';

// Create the ML client with axios
export const createMLClient = () => {
  const config = readConfiguration();
  const endpointUrl = config.ml_model_endpoint;

  const axiosInstance = axios.create({
    baseURL: endpointUrl,
    headers: {
      'Content-Type': 'application/json',
      // Add any additional headers if required
    },
  });

  const predict = async (body: any): Promise<any> => {
    try {
      const response = await axiosInstance.post('', body);
      return response;
    } catch (error: any) {
      throw new CustomError(500, 'Error invoking ML endpoint', error);
    }
  };

  return { predict };
};

export type MLClient = ReturnType<typeof createMLClient>;
