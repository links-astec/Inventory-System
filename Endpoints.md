# Inventory Management System - Backend Design

## Overview

This is the backend design plan for a simple yet robust Inventory Management System targeted at small-scale sellers. The system is built using **Django** and **PostgreSQL**, following best practices for scalability, maintainability, and transparency.

As part of a group project, this document outlines the backend architecture, database models, services, notifications system, and API endpoint documentation.

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

(Models section remains unchanged...)

---

## 🛠️ Business Logic: Service Layer Approach

All critical backend operations (stock adjustments, notifications) are handled via a centralized **Service Layer** for consistency and scalability.

* `services.py`: Handles inventory adjustments and StockLog creation.
* `notifications.py`: Handles in-web notification creation and SMS notification sending.

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

(Notifications section remains unchanged...)

---

## 📊 Key System Flow

(Key system flow remains unchanged...)

---

## 🌟 Why This Design?

* ✅ Clean separation of concerns using the Service Layer.
* ✅ Full inventory change tracking via automated StockLogs.
* ✅ Dual notification system (in-web + SMS) for maximum visibility.
* ✅ Data isolation per seller ensures multi-user safety.
* ✅ Professional architecture suitable for future scaling.

---

## 📌 Next Steps

* Define API endpoints (CRUD + Notification views).
* Implement service layer and notification backend.
* Connect SMS gateway.
* Document API for frontend team.

---

## 📑 API Endpoints Documentation

### 🔹 Product Endpoints

**1. List Products**

* **Endpoint:** `/api/products/`
* **Method:** `GET`

**2. Create Product**

* **Endpoint:** `/api/products/`
* **Method:** `POST`
* **Body:**

```json
{
  "name": "Product Name",
  "description": "Optional description",
  "price": "25.50",
  "quantity": 10,
  "available": true
}
```

**3. Retrieve Product Details**

* **Endpoint:** `/api/products/{id}/`
* **Method:** `GET`

**4. Update Product**

* **Endpoint:** `/api/products/{id}/`
* **Method:** `PUT` or `PATCH`

**5. Soft Delete Product**

* **Endpoint:** `/api/products/{id}/`
* **Method:** `DELETE`
* **Action:** Sets `is_active = False`

---

### 🔹 Buyer Endpoints

**1. List Buyers**

* **Endpoint:** `/api/buyers/`
* **Method:** `GET`

**2. Create Buyer**

* **Endpoint:** `/api/buyers/`
* **Method:** `POST`

**3. Retrieve Buyer Details**

* **Endpoint:** `/api/buyers/{id}/`
* **Method:** `GET`

**4. Update Buyer**

* **Endpoint:** `/api/buyers/{id}/`
* **Method:** `PUT` or `PATCH`

**5. Soft Delete Buyer**

* **Endpoint:** `/api/buyers/{id}/`
* **Method:** `DELETE`

---

### 🔹 Transaction Endpoints

**1. Record New Sale**

* **Endpoint:** `/api/transactions/`
* **Method:** `POST`
* **Body:**

```json
{
  "buyer_id": 3,
  "product_id": 5,
  "quantity_sold": 2,
  "price_per_item": "20.00"
}
```

* **Action:** Records sale, auto-adjusts stock, logs stock change, notifies user if stock low.

**2. List Transactions**

* **Endpoint:** `/api/transactions/`
* **Method:** `GET`

**3. Retrieve Transaction Details**

* **Endpoint:** `/api/transactions/{id}/`
* **Method:** `GET`

---

### 🔹 Notification Endpoints

**1. List Unread Notifications**

* **Endpoint:** `/api/notifications/`
* **Method:** `GET`

**2. Mark Notification as Read**

* **Endpoint:** `/api/notifications/{id}/`
* **Method:** `PATCH`
* **Body:**

```json
{
  "is_read": true
}
```

---

## 🛋️ File Structure and Organization

```
inventory_project/
├── inventory/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── services.py   # Stock adjustments + logging
│   ├── notifications.py  # In-web + SMS notifications
│   └── permissions.py    # (Optional custom permissions)
├── users/
│   └── models.py (if extended)
├── manage.py
└── requirements.txt
```

---

## 🌐 Deployment Considerations

* Environment variables for sensitive data (SMS API keys).
* Security settings: ALLOWED\_HOSTS, HTTPS.
* Use Gunicorn + Nginx or Docker for deployment.

---

**Designed & Maintained by the Backend Team (Django + PostgreSQL)**
