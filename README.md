# Inventory Management System - Backend Design

## Overview

This is the backend design plan for a simple yet robust Inventory Management System targeted at small-scale sellers. The system is built using **Django** and **PostgreSQL**, following best practices for scalability, maintainability, and transparency.

As part of a group project, this document outlines the backend architecture, database models, services, and notifications system.

---

## 📦 Technologies Used

* **Backend Framework:** Django (Python 3.x)
* **Database:** PostgreSQL
* **Architecture Pattern:** MVC (Django)
* **Notification Channels:** In-Web & SMS
* **Stock Management:** Automated via Service Layer

---

## ✅ Core Features

* **User Authentication:** Secure registration/login system using Django’s built-in auth.
* **Inventory Management:** Add, update, delete (soft delete), and manage products.
* **Sales Tracking:** Record sales transactions with automatic stock reduction.
* **Stock Audit Trail:** Track all stock changes via automated Stock Logs.
* **Notifications:** Users are notified via in-web messages and SMS for key events.

---

## 📊 System Architecture Summary

| Component             | Approach / Technology             |
| --------------------- | --------------------------------- |
| Models                | Django ORM (PostgreSQL backend)   |
| Business Logic        | Centralized Service Layer         |
| Stock Change Tracking | Automated via StockLog model      |
| Notifications         | In-web + SMS notifications        |
| Data Isolation        | Per-user data via ForeignKeys     |
| Deletion Handling     | Soft Delete via `is_active` flags |

---

## 📦 Database Models

### 1️⃣ Product

| Field      | Type        | Notes                   |
| ---------- | ----------- | ----------------------- |
| user       | ForeignKey  | Tracks product owner    |
| name       | CharField   | Product name            |
| price      | Decimal     | Accurate currency store |
| quantity   | PositiveInt | Tracks stock count      |
| is\_active | Boolean     | Soft delete flag        |
| available  | Boolean     | Optional manual flag    |
| timestamps | DateTime    | Created / Updated       |

---

### 2️⃣ Buyer

| Field       | Type       | Notes                |
| ----------- | ---------- | -------------------- |
| user        | ForeignKey | Buyer owner (seller) |
| name        | CharField  | Buyer name           |
| contact     | CharField  | Optional contact     |
| is\_active  | Boolean    | Soft delete flag     |
| created\_at | DateTime   | Creation timestamp   |

---

### 3️⃣ Transaction

* Records every sale.
* Auto-reduces product quantity via service layer.

| Field            | Type        | Notes                  |
| ---------------- | ----------- | ---------------------- |
| user             | ForeignKey  | Seller                 |
| buyer            | ForeignKey  | Who bought the product |
| product          | ForeignKey  | Product sold           |
| quantity\_sold   | PositiveInt | Quantity sold          |
| price\_per\_item | Decimal     | Price at time of sale  |
| total\_price     | Decimal     | Auto-calculated        |
| date\_sold       | DateTime    | Sale timestamp         |

---

### 4️⃣ StockLog (Audit Trail)

Tracks every inventory change automatically.

| Field             | Type       | Notes                           |
| ----------------- | ---------- | ------------------------------- |
| user              | ForeignKey | Seller                          |
| product           | ForeignKey | Affected product                |
| change\_type      | CharField  | INCREASE or DECREASE            |
| quantity\_changed | Integer    | Change amount                   |
| note              | TextField  | Optional reason (sale, restock) |
| created\_at       | DateTime   | Change timestamp                |

---

### 5️⃣ Notification

Stores in-web notifications for users.

| Field       | Type       | Notes                     |
| ----------- | ---------- | ------------------------- |
| user        | ForeignKey | Notification recipient    |
| message     | TextField  | Notification content      |
| is\_read    | Boolean    | Whether notification read |
| created\_at | DateTime   | Timestamp                 |

---

## 🛠️ Business Logic: Service Layer Approach

All critical backend operations (stock adjustments, notifications) are handled via a centralized **Service Layer** for consistency and scalability.

Example Service Function:

```python
def adjust_product_stock(product, change_amount, change_type, user, note=""):
    product.quantity += change_amount
    product.save()

    StockLog.objects.create(
        user=user,
        product=product,
        change_type=change_type,
        quantity_changed=change_amount,
        note=note
    )

    if product.quantity < LOW_STOCK_THRESHOLD:
        notify_user(user, f"Product '{product.name}' is low on stock ({product.quantity} left).")
```

---

## 🔔 Notifications System

### In-Web Notifications:

* Stored in the `Notification` model.
* Displayed on the user’s dashboard.
* Mark-as-read functionality supported.

### SMS Notifications:

* SMS gateway integration (e.g. Twilio, Africa’s Talking).
* Used for:

  * Stock low alerts
  * New sales notifications
  * Manual stock adjustments

Notification Service Function:

```python
def notify_user(user, message):
    # In-Web Notification
    Notification.objects.create(user=user, message=message)

    # SMS Notification
    if user.profile.phone_number:
        send_sms(user.profile.phone_number, message)
```

---

## 📊 Key System Flow

| Event                       | Automated Actions                                       |
| --------------------------- | ------------------------------------------------------- |
| Sale recorded (Transaction) | Reduce stock, create StockLog, notify user if stock low |
| Manual stock adjustment     | Update stock, create StockLog, notify user              |
| Product soft-deleted        | Mark inactive, optional notification                    |
| Stock below threshold       | Create in-web + SMS notification                        |

---

## 🌟 Why This Design?

* ✅ Clean separation of concerns using the Service Layer.
* ✅ Full inventory change tracking via automated StockLogs.
* ✅ Dual notification system (in-web + SMS) for maximum visibility.
* ✅ Data isolation per seller ensures multi-user safety.
* ✅ Professional architecture suitable for future scaling.

---
