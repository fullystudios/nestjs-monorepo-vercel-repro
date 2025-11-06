declare global {
  type AppEnvironment = "local" | "development" | "staging" | "production";
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV?: "development" | "production" | "test";
      ENVIRONMENT?: AppEnvironment;

      // Database configuration
      DATABASE_HOST?: string;
      DATABASE_PORT?: string;
      DATABASE_NAME?: string;
      DATABASE_USERNAME?: string;
      DATABASE_PASSWORD?: string;
      DATABASE_SSL?: string;
      DATABASE_AUTO_RUN_MIGRATIONS?: string;

      // Postmark configuration
      POSTMARK_ENABLED?: "true" | "false";
      POSTMARK_SERVER_TOKEN?: string;
      POSTMARK_FROM_EMAIL?: string;
    }
  }
}

export {};
