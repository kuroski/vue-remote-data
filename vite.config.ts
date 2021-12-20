import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";

export default defineConfig({
  base: "/vue-remote-data/",
  plugins: [vue(), vueJsx()],
  optimizeDeps: {
    exclude: ["vue-demi"],
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "VueRemoteData",
      fileName: (format) => `vue-remote-data.${format}.js`,
    },
    rollupOptions: {
      external: ["vue", "vue-demi", "@devexperts/remote-data-ts"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
