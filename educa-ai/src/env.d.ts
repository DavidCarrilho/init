declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    AUTH_SECRET: string;
    NODE_ENV: "development" | "production" | "test";
  }
}
