import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";
import { sign, verify } from "hono/jwt";
import { z } from "zod";
import { createMiddleware } from "hono/factory";
import bcrypt from "bcryptjs";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userID: string;
  };
}>();

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "password must be at least 6 character long"),
  email: z.string().email("email format didnot match"),
});

const loginSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .and(
    z.union([
      z.object({ email: z.string().email("Invalid email") }), // Login with email
      z.object({
        username: z.string().min(3, "Username must be at least 3 characters"),
      }), // Login with username
    ])
  );

//defining authmiddleware

const authMiddleware = createMiddleware(async (c, next) => {
  try {
    let authToken = c.req.header("Authorization");
    if (!authToken) {
      return c.json({ msg: "Token not provided" });
    }

    const token =
      authToken.length > 1 && authToken.startsWith("Bearer")
        ? authToken.split(" ")[1]
        : authToken;

    const isValidToken = await verify(token, c.env.JWT_SECRET);
    if (!isValidToken) {
      return c.json({ msg: "Invalid Token or expired token" });
    }
    c.set("userID", isValidToken?.id);
    await next();
  } catch (error) {
    console.error("Error occured in middleware");
    return c.json({ msg: "Error in the middleware", error });
  }
});

app.get("/", authMiddleware, async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const user = await prisma.user.findFirst({
    where: {
      id: c.get("userID"),
    },
    include: {
      blogs: true,
    },
  });
  if (!user) {
    return c.json({ msg: "user not found!!!" });
  }

  return c.json({ msg: "User found", user }, 200);
});
app.post("/api/v1/user/signup", authMiddleware, async (c) => {
  const { email, username, password } = await c.req.json();

  const validateInput = registerSchema.safeParse({ email, username, password });
  if (!validateInput.success) {
    return c.json(
      { msg: "Validation failed", errors: validateInput.error.format() },
      400
    );
  }

  const prisma = getPrisma(c.env.DATABASE_URL);
  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (userExists) {
    return c.json({ error: "User already exists" }, 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });
  const token = await sign(
    {
      id: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    c.env.JWT_SECRET
  );

  return c.json({ token: token, user });
});
app.post("/api/v1/user/signin", async (c) => {
  const body = await c.req.json();
  const validateInput = loginSchema.safeParse(body);
  if (!validateInput.success) {
    return c.json(
      { msg: "Validation failed", errors: validateInput.error.format() },
      400
    );
  }
  const { username, email, password } = body;
  const prisma = getPrisma(c.env.DATABASE_URL);
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });
  if (!user) {
    return c.json({ msg: "user not found" }, 400);
  }
  const validatePassword = await bcrypt.compare(password, user.password);
  if (!validatePassword) {
    return c.json({ msg: "password incorrect" });
  }
  const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ msg: "login successful", token }, 200);
});

const blogBodySchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  isPublished: z.boolean().optional(),
});

//post the blog
app.post("/api/v1/blog", authMiddleware, async (c) => {
  const blogBody = await c.req.json();
  const isValid = blogBodySchema.safeParse(blogBody);
  if (!isValid.success) {
    return c.json({ msg: "Error in input validation" });
  }
  const blog = isValid.data;

  const prisma = getPrisma(c.env.DATABASE_URL);
  const createBlog = await prisma.blog.create({
    data: {
      title: blog.title,
      content: blog.content,
      userId: c.get("userID"),
    },
  });

  return c.json({ msg: "blog created", createBlog });
});
app.put("/api/v1/blog", authMiddleware, async (c) => {
  const { title, content, id } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  const blogExist = await prisma.blog.findFirst({
    where: {
      id,
    },
  });
  if (!blogExist) {
    c.json({ msg: "blog dont exist" });
  }

  if (blogExist?.userId !== c.get("userID")) {
    return c.json({ msg: "you cannot update this blog" }, 403);
  }

  const updatedBlog = await prisma.blog.update({
    where: {
      id,
    },
    data: {
      title: title ?? blogExist?.title,
      content: content ?? blogExist?.content,
      updatedAt: new Date(),
    },
  });
  return c.json({ msg: "updated successfully", updatedBlog }, 200);
});
app.delete("/api/v1/blog", authMiddleware, async (c) => {
  const { title, content, id } = await c.req.json();
  const prisma = getPrisma(c.env.DATABASE_URL);
  const blogExist = await prisma.blog.findFirst({
    where: {
      id,
    },
  });
  if (!blogExist) {
    c.json({ msg: "blog dont exist" });
  }

  if (blogExist?.userId !== c.get("userID")) {
    return c.json({ msg: "you cannot delete this blog" }, 403);
  }

  await prisma.blog.delete({
    where: {
      id,
    },
  });
  return c.json({ msg: "delete successfully" }, 200);
});
app.get("/api/v1/blog/:id", authMiddleware, async (c) => {
  const blogId = c.req.param("id");
  const prisma = getPrisma(c.env.DATABASE_URL);

  const blogExist = await prisma.blog.findUnique(blogId);
  if (!blogExist) {
    return c.json({ msg: "blog dont exist" });
  }
  if (blogExist.userId !== c.get("userID")) {
    return c.json({ msg: "you are not allowed" });
  }
  return c.json({ msg: "successfully fetched", blogExist });
});
app.get("/api/v1/blog/bulk", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const blogs = await prisma.blog.findMany();
  return c.json({ msg: "fetched all blogs", blogs });
});

export default app;
