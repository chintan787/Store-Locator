// import { vitePlugin as remix } from "@remix-run/dev";
// import { defineConfig } from "vite";
// import tsconfigPaths from "vite-tsconfig-paths";
// // const express = require('express');
// // const axios = require('axios');
// // const app = express();
// // Related: https://github.com/remix-run/remix/issues/2835#issuecomment-1144102176
// // Replace the HOST env var with SHOPIFY_APP_URL so that it doesn't break the remix server. The CLI will eventually
// // stop passing in HOST, so we can remove this workaround after the next major release.
// if (
//   process.env.HOST &&
//   (!process.env.SHOPIFY_APP_URL ||
//     process.env.SHOPIFY_APP_URL === process.env.HOST)
// ) {
//   process.env.SHOPIFY_APP_URL = process.env.HOST;
//   delete process.env.HOST;
// }

// const host = new URL(process.env.SHOPIFY_APP_URL || "http://localhost")
//   .hostname;
// let hmrConfig;

// if (host === "localhost") {
//   hmrConfig = {
//     protocol: "ws",
//     host: "localhost",
//     port: 64999,
//     clientPort: 64999,
//   };
// } else {
//   hmrConfig = {
//     protocol: "wss",
//     host: host,
//     port: parseInt(process.env.FRONTEND_PORT) || 8002,
//     clientPort: 443,
//   };
// }

// export default defineConfig({
//   server: {
//     port: Number(process.env.PORT || 3000),
//     hmr: hmrConfig,
//     fs: {
//       // See https://vitejs.dev/config/server-options.html#server-fs-allow for more information
//       allow: ["app", "node_modules"],
//     },
//   },
//   plugins: [
//     remix({
//       ignoredRouteFiles: ["**/.*"],
//     }),
//     tsconfigPaths(),
//   ],
//   build: {
//     assetsInlineLimit: 0,
//   },
// });



// // app.get('/api/locations', async (req, res) => {
// //   console.log('location api call')
// //   try {
// //     const response = await axios.get('https://your-store.myshopify.com/admin/api/2023-07/locations.json', {
// //       headers: {
// //         'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN, // Add your access token
// //       },
// //     });
// //     console.log('response',response)
// //     res.json(response.data.locations);
// //   } catch (error) {
// //     console.error("Error fetching locations:", error);
// //     res.status(500).send("Error fetching locations");
// //   }
// // });

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Related: https://github.com/remix-run/remix/issues/2835#issuecomment-1144102176
// Replace the HOST env var with SHOPIFY_APP_URL so that it doesn't break the remix server. The CLI will eventually
// stop passing in HOST, so we can remove this workaround after the next major release.
if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL ||
    process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

const host = new URL(process.env.SHOPIFY_APP_URL || "http://localhost")
  .hostname;
let hmrConfig;

if (host === "localhost") {
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999,
  };
} else {
  hmrConfig = {
    protocol: "wss",
    host: host,
    port: parseInt(process.env.FRONTEND_PORT) || 8002,
    clientPort: 443,
  };
}

export default defineConfig({
  server: {
    port: Number(process.env.PORT || 3000),
    hmr: hmrConfig,
    fs: {
      // See https://vitejs.dev/config/server-options.html#server-fs-allow for more information
      allow: ["app", "node_modules"],
    },
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
    }),
    tsconfigPaths(),
  ],
  build: {
    assetsInlineLimit: 0,
  },
});
