// lambda.ts
import { app } from './src/app';

// Bun runtime ต้องการ export default object ที่มี fetch()
export default {
  async fetch(request: Request): Promise<Response> {
    try {
      return await app.handle(request)
    } catch (err) {
      console.error('Lambda Error:', err)
      return new Response(
        JSON.stringify({ error: String(err) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
}
