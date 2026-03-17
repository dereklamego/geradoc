# GeraDoc Backend - Technical Specification

**Role**: Core API Service  
**Architecture Style**: RESTful API / Clean Architecture  
**Focus**: Performance, Safety, and Highly Structured Document Management

---

## 1. Technological Stack (2026 Standards)

- **Runtime**: Node.js v22+ (LTS)
- **Framework**: [Fastify](https://www.fastify.io/) (High performance, low overhead)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL (Structured data and JSONB support for documents)
- **Validation**: [Zod](https://zod.dev/) (Schema-first validation)
- **Documentation**: Swagger/OpenAPI (via `@fastify/swagger`)
- **Security**: JWT (Jose), Argon2 (Hashing), Fastify-Helmet (Headers), DOMPurify (Server-side sanitization)

---

## 2. Data Architecture (Prisma Schema)

```prisma
// Users and Authentication
model User {
  id            String     @id @default(uuid())
  email         String     @unique
  passwordHash  String
  name          String
  role          Role       @default(USER)
  plan          Plan       @default(FREE)
  
  // Stripe Integration
  stripeCustomerId    String?  @unique
  stripeSubscriptionId String? @unique
  subscription        Subscription?

  documents     Document[]
  folders       Folder[]
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model Subscription {
  id                 String   @id @default(uuid())
  userId             String   @unique
  user               User     @relation(fields: [userId], references: [id])
  status             String   // active, trialing, past_due, canceled
  priceId            String   // ID do preço no Stripe
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd  Boolean  @default(false)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
  BETA
}

enum Plan {
  FREE
  PREMIUM
}

// Documents and Content
model Document {
  id          String   @id @default(uuid())
  title       String
  content     Json     // Flexible JSON structure for Rich Text / Dynamic Data
  status      Status   @default(DRAFT)
  version     Int      @default(1)
  isDeleted   Boolean  @default(false) // Soft Delete
  
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  folderId    String?
  folder      Folder?  @relation(fields: [folderId], references: [id])

  templateId  String?
  template    Template? @relation(fields: [templateId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Status {
  DRAFT
  PENDING
  APPROVED
  FINISHED
}

// Organization and Templates
model Folder {
  id        String     @id @default(uuid())
  name      String
  userId    String
  user      User       @relation(fields: [userId], references: [id])
  documents Document[]
}

model Template {
  id          String     @id @default(uuid())
  name        String
  description String
  structure   Json       // Pre-defined JSON structure
  category    String
  documents   Document[]
}
```

---

## 3. Essential Endpoints

### 3.1 Authentication
- `POST /api/auth/register`: User signup.
- `POST /api/auth/login`: Identity verification; returns JWT.
- `GET /api/auth/me`: Validates Token and returns active session data, **including current plan and subscription status**.

### 3.2 Document Management (CRUD)
- `GET /api/documents`: List docs with pagination (`?page=1&limit=10`) and search (`?q=title`).
- `POST /api/documents`: Create a new document (linked to Template or blank).
- `GET /api/documents/:id`: Fetch specific document content.
- `PATCH /api/documents/:id`: Partial update (Title, Content, Status).
- `DELETE /api/documents/:id`: Soft delete (sets `isDeleted: true`).

### 3.3 Optimized Features
- `PUT /api/documents/:id/autosave`: Debounced endpoint for rapid draft saving. Bypasses certain heavy validation hooks for speed.
- `GET /api/documents/:id/export?format=pdf|md`: Returns the generated file buffer or download link. **Requires active PREMIUM plan.**

### 3.4 Payment System (Stripe Integration)
- `GET /api/payments/plans`: Returns available plans, price IDs, and benefits.
- `POST /api/payments/create-checkout-session`: Creates a Stripe Checkout session. Expects `priceId` in body. Returns `url` for redirect.
- `POST /api/payments/create-portal-session`: Generates a link to the Stripe Customer Portal for subscription management.
- `POST /api/payments/webhook`: (Critical) Listener for Stripe events (`checkout.session.completed`, `customer.subscription.updated`).

---

## 4. Business Rules & Security

### 4.1 Data Isolation (Multi-tenant)
Every database query **must** include the `userId` in the `WHERE` clause, extracted from the decoded JWT. A user should never be able to access, edit, or delete a document belonging to another `userId`.

### 4.2 Content Sanitization
Before persisting `Json` content that might contain HTML strings:
1. Use a server-side library (like `jsdom` + `DOMPurify`) to strip `<script>`, `onerror`, and other XSS vectors.
2. Content must be validated against the Zod schema to ensure required JSON fields are present.

### 4.3 Low-Level Versioning
Upon every `PATCH` request that changes the `content`, the `updatedAt` field is managed by Prisma, and the `version` counter is incremented.

### 4.4 Billing & Subscription Rules (Paywall)
- **Document Quota**: `FREE` users are limited to a maximum of **5 documents**. The `POST /api/documents` endpoint must reject requests if this limit is reached.
- **Template Access**: `FREE` users can only access templates in the **"Basic"** category. Access to **"Premium"** templates requires `user.plan === 'PREMIUM'`.
- **Subscription Middleware**: Sensitive actions like "PDF Export" and "Premium Template Selection" must verify if `user.plan === 'PREMIUM'` AND `subscription.status === 'active'`.
- **Mocking Strategy**: If Stripe keys are missing, checkout endpoints should simulate success and redirect, and the webhook can be tested via `scripts/test-webhook.sh`.

---

## 5. Integration Guide

### 5.1 Authorization Header
The Frontend must send the JWT in the `Authorization` header using the Bearer scheme:
```http
Authorization: Bearer <your_jwt_token>
```

### 5.2 Error Handling Standard
The backend will return errors in a consistent JSON format to facilitate Frontend `toast` notifications:

```json
{
  "error": "Validation Error",
  "message": "The field 'title' is required.",
  "code": "BAD_REQUEST",
  "issues": [] // Array of Zod validation details if applicable
}
```

### 5.3 Typical Status Codes
- `200/201`: Success.
- `400`: Validation or business rule error.
- `401`: Token missing or invalid.
- `403`: Permission denied (Isolation violation).
- `404`: Resource not found.
- `429`: Rate limit exceeded (Anti-spam).

---

## 6. Development Workflow
1. `npm install`
2. `npx prisma migrate dev`
3. `npm run dev`
4. Access `http://localhost:3000/docs` for the interactive Swagger UI.
