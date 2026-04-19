import { defineConfig } from "orval"

export default defineConfig({
  "42chess": {
    input: {
      target: "http://localhost:3000/swagger/json",
    },
    output: {
      mode: "tags-split",
      target: "./src/api",
      schemas: "./src/api/model",
      client: "react-query",
      httpClient: "axios",
      override: {
        mutator: {
          path: "./src/lib/axios-mutator.ts",
          name: "api",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
  "42chessZod": {
    input: {
      target: "http://localhost:3000/swagger/json",
    },
    output: {
      mode: "tags-split",
      client: "zod",
      target: "./src/api",
      schemas: "./src/api/model",
      fileExtension: ".zod.ts",
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
})
