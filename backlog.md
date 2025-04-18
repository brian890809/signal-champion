# 📋 Updated Product Backlog: Peer-to-Peer Moving Marketplace (Hackathon-Optimized)

---

## 🧱 Epic 1: User Account & Authentication

### 🧩 User Stories
- **[MVP]** As a user, I want to sign up and log in (mocked or real).
- As a user, I want to select whether I’m a customer or a carrier.

### Priority: **Medium** for hackathon (consider mocked login), **High** post-hackathon.

---

## 📦 Epic 2: Job Creation & Listing (Customer Side)

### 🧩 User Stories
- **[MVP]** As a customer, I want to create a new move request with:
  - Item description
  - Pickup & drop-off location
  - Preferred time/date
- **[MVP]** As a customer, I want to view my active and past jobs.
- As a customer, I want to edit or cancel a job before it's accepted.
- As a customer, I want to receive status updates.

### Priority: **Top**

---

## 🚚 Epic 3: Carrier Dashboard

### 🧩 User Stories
- **[MVP]** As a carrier, I want to browse open jobs.
- **[MVP]** As a carrier, I want to accept a job and update its status: accepted → in transit → delivered.
- As a carrier, I want to see job details (items, locations, timing).
- As a carrier, I want to reject or pass on jobs.

### Priority: **Top**

---

## 🗺️ Epic 4: Tracking & Maps

### 🧩 User Stories
- **[MVP]** As a user, I want to view the job’s delivery status in real-time (mock or live GPS).
- As a user, I want a visual map of pickup/delivery locations.
- As a user, I want to receive a confirmation when the job is delivered.

### Priority: **High** for hackathon, especially if mocked tracking

---

## 💸 Epic 5: Payments (Mocked for Demo)

### 🧩 User Stories
- **[Demo]** As a customer, I want to see a mock payment screen after confirming a job (fake card form or “Pay Now” button).
- **[Demo]** As a carrier, I want to see a "Pending Payment" status that updates to "Paid" once delivery is marked complete.
- **[Demo]** As an admin (or demo viewer), I want to see a fake payment log with job ID, users, and amount.

### Priority: **Medium** — adds polish & completeness for demo without real integration

---

## ⭐ Epic 6: Reviews & Ratings

### 🧩 User Stories
- As a customer, I want to rate the carrier after job completion.
- As a carrier, I want to rate the customer.
- As a user, I want to see ratings before accepting/offering jobs.

### Priority: **Low for hackathon**, **High for post-MVP trust layer**

---

## 🔧 Epic 7: Admin & Platform Management

### 🧩 User Stories
- As an admin, I want to view all jobs and users (mock admin screen is fine for now).
- As an admin, I want to view a fake ledger of payments and job transactions.

### Priority: **Low for hackathon**, unless showcasing the platform view is critical for pitch

---

## 🛠 Engineering & Infra Tasks

- **[MVP]** Set up basic backend (Node/Express/Firebase)
- **[MVP]** Implement data models: User, Job, TrackingStatus, Payment
- Frontend scaffolding with routing and state handling
- Mock GPS/real-time updates using timeouts or simulated coordinates
- Create visual design polish (buttons, icons, success toasts)

---

## ✅ Hackathon MVP Scope (Core Focus)

- Customer creates a job
- Carrier browses & accepts
- Status updates through delivery
- Job tracking (basic or map)
- Mock payment flow
- Slick demo with happy path
