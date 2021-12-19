import type { InitialOptionsTsJest } from "ts-jest";

const config: InitialOptionsTsJest = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
};

export default config;
