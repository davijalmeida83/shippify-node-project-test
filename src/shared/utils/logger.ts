export const logger = {
  info: (message: string, ...optionalParams: any[]) => {
    console.info(`[INFO]: ${message}`, ...optionalParams);
  },
  warn: (message: string, ...optionalParams: any[]) => {
    console.warn(`[WARN]: ${message}`, ...optionalParams);
  },
  error: (message: string, ...optionalParams: any[]) => {
    console.error(`[ERROR]: ${message}`, ...optionalParams);
  },
};