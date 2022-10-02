export interface AppConfig {
  port: number;
}

export const appConfigFactory = (): { app: AppConfig } => ({
  app: {
    port: 5000,
  },
});
