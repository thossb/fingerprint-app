import { Application, Router } from "./deps.ts";

const app = new Application();
const router = new Router();

router.get("/", async (context) => {
  context.response.body = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fingerprint ID</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/clientjs/0.1.11/client.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.0/js.cookie.min.js"></script>
  </head>
  <body>
    <h1>Your Fingerprint ID</h1>
    <div id="fingerprint"></div>
    <script>
      function getFingerprint() {
        const existingFingerprint = Cookies.get('fingerprint');
        if (existingFingerprint) {
          document.getElementById('fingerprint').innerText = 'Your Fingerprint ID: ' + existingFingerprint;
          return;
        }

        const client = new ClientJS();
        const fingerprint = client.getFingerprint();
        Cookies.set('fingerprint', fingerprint, { expires: 365 });
        document.getElementById('fingerprint').innerText = 'Your new Fingerprint ID: ' + fingerprint;
      }

      getFingerprint();
    </script>
  </body>
  </html>`;
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
console.log("Server is running on http://localhost:8000");
