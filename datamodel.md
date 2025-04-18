# 📦 MVP Data Model — Peer-to-Peer Moving Marketplace

This document defines the core data structures required for the MVP.

---

## 🔐 User

Represents both customers and carriers.

```json
{
  "id": "user_123",
  "name": "Alice Martins",
  "email": "alice@example.com",
  "role": "customer", // or "carrier"
  "phone": "1199999999",
  "vehicleInfo": {
    "type": "Van",
    "capacity": "medium"
  },
  "rating": 4.8
}
```

- `role`: Differentiates between customer and carrier.
- `vehicleInfo`: Only relevant for carriers.

---

## 📦 Job

Each move request posted by a customer.

```json
{
  "id": "job_456",
  "customerId": "user_123",
  "carrierId": "user_987",
  "items": [
    { "name": "Sofa", "dimensions": "200x90x80", "weight": "40kg" },
    { "name": "Boxes", "quantity": 5 }
  ],
  "pickupAddress": "Rua A, 100 - São Paulo",
  "dropoffAddress": "Rua B, 200 - São Paulo",
  "pickupTime": "2025-04-20T10:00:00Z",
  "status": "in_transit", // requested | accepted | in_transit | delivered | cancelled
  "tracking": {
    "currentLocation": {
      "lat": -23.55052,
      "lng": -46.633308
    },
    "lastUpdated": "2025-04-18T14:32:00Z"
  },
  "payment": {
    "status": "paid", // unpaid | pending | paid
    "amount": 150.00,
    "fakeTxnId": "txn_demo_789"
  },
  "createdAt": "2025-04-18T10:00:00Z"
}
```

- `status`: Controls the job state.
- `tracking`: Can be mocked for demo purposes.
- `payment`: Includes mock payment metadata.

---

## 🔄 TrackingUpdate (Optional)

Used for storing a stream of location and status logs.

```json
{
  "jobId": "job_456",
  "timestamp": "2025-04-18T14:35:00Z",
  "location": {
    "lat": -23.5499,
    "lng": -46.6325
  },
  "status": "in_transit"
}
```

---

## 💳 PaymentLog (Optional)

Simulates a transaction log for the admin/demo view.

```json
{
  "id": "txn_demo_789",
  "jobId": "job_456",
  "from": "user_123",
  "to": "user_987",
  "amount": 150.00,
  "status": "paid",
  "timestamp": "2025-04-18T10:45:00Z"
}
```

---

## 🔗 Entity Relationships

| Entity      | Relationships                                 |
|-------------|-----------------------------------------------|
| `User`      | 1:M with `Job` (as customer or carrier)       |
| `Job`       | 1:1 with `PaymentLog`, 1:M with `TrackingUpdate` |
| `Payment`   | Embedded in `Job`                             |

---

> 📁 Save this file as `DATA_MODEL.md` in the root of your project or in a `/docs` folder.
```

---

Would you like me to export this directly as a downloadable `.md` file?
