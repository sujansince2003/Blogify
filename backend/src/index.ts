import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'
import { decode, sign, verify } from 'hono/jwt'
import { z } from "zod"

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),

  password: z.string().min(6, "password must be at least 6 character long"),
  email: z.string().email("email format didnot match")
})

export const loginSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
}).and(
  z.union([
    z.object({ email: z.string().email("Invalid email") }),  // Login with email
    z.object({ username: z.string().min(3, "Username must be at least 3 characters") }) // Login with username
  ])
)
import bcrypt from 'bcryptjs'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post("/api/v1/user/signup", async (c) => {
  const { email, username, password } = await c.req.json()

  const validateInput = registerSchema.safeParse({ email, username, password })
  if (!validateInput.success) {
    return c.json({ msg: "Validation failed", errors: validateInput.error.format() }, 400)
  }

  const prisma = getPrisma(c.env.DATABASE_URL)
  const userExists = await prisma.user.findUnique({
    where: {
      email
    }
  })
  if (userExists) {
    return c.json({ error: "User already exists" }, 400)
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data:
    {
      email, username, password: hashedPassword
    }
  })
  const token = await sign({
    id: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  }, c.env.JWT_SECRET)


  return c.json({ token: token, user })

})
app.post("/api/v1/user/signin", async (c) => {

  const body = await c.req.json()
  const validateInput = loginSchema.safeParse(body)
  if (!validateInput.success) {
    return c.json({ msg: "Validation failed", errors: validateInput.error.format() }, 400)
  }
  const { username, email, password } = body
  const prisma = getPrisma(c.env.DATABASE_URL)
  const user = await prisma.user.findFirst({
    where:
    {
      OR: [{ username }, { email }]
    }
  })
  if (!user) {
    return c.json({ msg: "user not found" }, 400)
  }
  const validatePassword = await bcrypt.compare(password, user.password)
  if (!validatePassword) {
    return c.json({ msg: "password incorrect" })
  }
  const token = await sign({ id: user.id }, c.env.JWT_SECRET)
  return c.json({ msg: "login successful", token }, 200)
})
app.post("/api/v1/blog", (c) => {
  return c.text('Hello Hono!')
})
app.put("/api/v1/blog", (c) => {
  return c.text('Hello Hono!')
})
app.get("/api/v1/blog/:id", (c) => {
  return c.text('Hello Hono!')
})
app.get("/api/v1/blog/bulk", (c) => {
  return c.text('Hello Hono!')
})


export default app
