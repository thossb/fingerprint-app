import { Application, Router, send } from "./deps.ts";
import { join, dirname, fromFileUrl } from "https://deno.land/std@0.102.0/path/mod.ts";

const app = new Application();
const router = new Router();

// Serve static files
app.use(async (context, next) => {
  const root = join(dirname(fromFileUrl(import.meta.url)), 'public');
  try {
    await send(context, context.request.url.pathname, {
      root,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

// Define the root route
router.get("/", async (context) => {
  context.response.body = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fingerprint ID</title>
    <!-- CreepJS for generating fingerprint -->
    <script src="https://cdn.jsdelivr.net/npm/creepjs@1.0.8/dist/creep.min.js"></script>
  </head>
  <body>
    <h1>Your Fingerprint ID</h1>
    <div id="fingerprint"></div>
    <script>
      async function getFingerprint() {
        console.log("getFingerprint called");
        try {
          const result = await creep.getFingerprint();
          const fingerprint = result.visitorId;
          console.log("New Fingerprint: ", fingerprint);
          document.getElementById('fingerprint').innerText = 'Your Fingerprint ID: ' + fingerprint;
        } catch (error) {
          console.error("Failed to generate fingerprint: ", error);
          document.getElementById('fingerprint').innerText = 'Failed to generate fingerprint. Please try again later.';
        }
      }

      document.addEventListener("DOMContentLoaded", () => {
        console.log("DOMContentLoaded event fired");
        getFingerprint();
      });
    </script>
  </body>
  </html>`;
});

// Register routes and allowed methods
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
await app.listen({ port: 8000 });
console.log("Server is running on http://localhost:8000");
