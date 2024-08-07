import { Application, Router } from "./deps.ts";

const app = new Application();
const router = new Router();

// Define the root route
router.get("/", async (context) => {
  context.response.body = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fingerprint ID</title>
    <!-- ClientJS for generating fingerprint -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/clientjs/0.1.11/client.min.js"></script>
    <!-- js-cookie for managing cookies -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.0/js.cookie.min.js"></script>
  </head>
  <body>
    <h1>Your Fingerprint ID</h1>
    <div id="fingerprint"></div>
    <script>
      function getFingerprint() {
        console.log("getFingerprint called");
        const existingFingerprint = Cookies.get('fingerprint');
        console.log("Existing Fingerprint: ", existingFingerprint);
        if (existingFingerprint) {
          document.getElementById('fingerprint').innerText = 'Your Fingerprint ID: ' + existingFingerprint;
          return;
        }

        try {
          const client = new ClientJS();
          const fingerprint = client.getFingerprint();
          console.log("New Fingerprint: ", fingerprint);
          Cookies.set('fingerprint', fingerprint, { expires: 365 });
          document.getElementById('fingerprint').innerText = 'Your new Fingerprint ID: ' + fingerprint;
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
