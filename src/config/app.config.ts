export interface AppConfig {
  port: number;
}

const defaultPort = 5000;
export const appConfigFactory = (): { app: AppConfig } => ({
  app: {
    port: parseInt(process.env.APP_PORT) ?? defaultPort,
  },
});
