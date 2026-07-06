# Deploy to Render

## Local run

```bash
npm install
copy .env.example .env
npm start
```

## Environment variables

- `TELLONYM_TOKEN`: your token.
- `API_KEY`: private key required in the `x-api-key` request header.

## Test request

```bash
curl -X POST https://YOUR_RENDER_URL/send ^
  -H "Content-Type: application/json" ^
  -H "x-api-key: YOUR_API_KEY" ^
  -d "{\"message\":\"hello\",\"userId\":41869015}"
```
