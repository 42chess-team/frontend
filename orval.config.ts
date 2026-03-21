import { defineConfig } from "orval"

export default defineConfig({
  onchess: {
    input: {
      target: "",
    },
    output: {
      mode: "tags-split",
      target: "./src/api",
      schemas: "./src/api/model",
      client: "react-query",
      httpClient: "axios",
      override: {
        mutator: {
          path: "./src/lib/axios.ts",
          name: "api",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
  onchessZod: {
    input: {
      target: "",
    },
    output: {
      mode: "tags-split",
      client: "zod",
      target: "./src/api",
      fileExtension: ".zod.ts",
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
})
