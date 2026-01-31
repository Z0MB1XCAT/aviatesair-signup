export default {
  async fetch(request) {
    const url = new URL(request.url)

    // ===== ACARS KEY GENERATOR =====
    if (url.pathname === "/generate-key") {
      const key = generateACARSKey()
      return json({ acars_key: key })
    }

    // ===== ACARS KEY VALIDATION =====
    if (url.pathname === "/validate-key" && request.method === "POST") {
      const body = await request.json()
      const key = body.acars_key

      const valid = isValidACARSKey(key)

      return json({
        valid,
        message: valid ? "ACARS key accepted" : "Invalid ACARS key"
      })
    }

    // ===== SIMPLE WEBSITE =====
    return new Response(htmlPage(), {
      headers: { "Content-Type": "text/html" }
    })
  }
}

// ===== HELPERS =====

function generateACARSKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let key = ""
  for (let i = 0; i < 28; i++) {
    key += chars[Math.floor(Math.random() * chars.length)]
  }
  return key
}

function isValidACARSKey(key) {
  return typeof key === "string" && /^[A-Z0-9]{28}$/.test(key)
}

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  })
}

function htmlPage() {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>AviatesAir ACARS Signup</title>
  <style>
    body {
      background: #0b1c2d;
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
      padding-top: 80px;
    }
    button {
      background: #1fa2ff;
      border: none;
      padding: 15px 25px;
      font-size: 16px;
      cursor: pointer;
      color: white;
      border-radius: 6px;
    }
    .key {
      margin-top: 20px;
      font-size: 18px;
      letter-spacing: 2px;
      background: #122a44;
      padding: 15px;
      display: inline-block;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <h1>AviatesAir ACARS</h1>
  <p>Generate your ACARS Key</p>
  <button onclick="generate()">Generate Key</button>
  <div id="key" class="key" style="display:none;"></div>

  <script>
    async function generate() {
      const res = await fetch("/generate-key")
      const data = await res.json()
      document.getElementById("key").style.display = "block"
      document.getElementById("key").innerText = data.acars_key
    }
  </script>
</body>
</html>
`
}
