# BloomCart API Testing Guide

## Setup Before Testing

### 1. **Install Dependencies**

```bash
cd backend
npm install
```

### 2. **Setup Environment Variables**

Create a `.env` file in the backend directory with:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret_key_for_access_token
REFRESH_TOKEN_SECRET=your_secret_key_for_refresh_token
```

### 3. **Start the Server**

```bash
npm run dev
# or
npm start
```

The server will run on `http://localhost:5000`

---

## Testing Tools

Use one of these tools to test the APIs:

- **Postman** (Recommended - GUI based)
- **Insomnia** (Alternative GUI)
- **cURL** (Command line)
- **Thunder Client** (VS Code Extension)

---

## API Endpoints & Testing Steps

### **1. AUTHENTICATION ENDPOINTS** (`/api/auth`)

#### **1.1 Register User**

- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Body (JSON):**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

- **Expected Response:** `201 Created` with user details and tokens

#### **1.2 Login User**

- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Body (JSON):**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

- **Expected Response:** `200 OK` with `accessToken` and `refreshToken`
- **Note:** Save the `accessToken` for protected routes

#### **1.3 Get Current User**

- **Method:** `GET`
- **Endpoint:** `/api/auth/current-user`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Expected Response:** `200 OK` with current user details

#### **1.4 Refresh Access Token**

- **Method:** `POST`
- **Endpoint:** `/api/auth/refresh`
- **Headers:**
  - `Authorization: Bearer {refreshToken}`
- **Expected Response:** `200 OK` with new `accessToken`

#### **1.5 Logout User**

- **Method:** `POST`
- **Endpoint:** `/api/auth/logout`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Expected Response:** `200 OK` with success message

---

### **2. FLOWER ENDPOINTS** (`/api/flowers`)

#### **2.1 Get All Flowers** (Public)

- **Method:** `GET`
- **Endpoint:** `/api/flowers`
- **Expected Response:** `200 OK` with array of all flowers

#### **2.2 Get Flower by ID** (Public)

- **Method:** `GET`
- **Endpoint:** `/api/flowers/{flowerId}`
- **Example:** `/api/flowers/507f1f77bcf86cd799439011`
- **Expected Response:** `200 OK` with flower details

#### **2.3 Get My Flowers** (Protected)

- **Method:** `GET`
- **Endpoint:** `/api/flowers/my`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Expected Response:** `200 OK` with flowers added by logged-in user

#### **2.4 Create Flower** (Protected)

- **Method:** `POST`
- **Endpoint:** `/api/flowers/create-flower`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Body (JSON):**

```json
{
  "name": "Rose",
  "description": "Beautiful red roses",
  "price": 49.99,
  "quantity": 100,
  "image": "https://example.com/rose.jpg"
}
```

- **Expected Response:** `201 Created` with flower details

#### **2.5 Update Flower** (Protected)

- **Method:** `PATCH`
- **Endpoint:** `/api/flowers/update-flower/{flowerId}`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Body (JSON):**

```json
{
  "price": 59.99,
  "quantity": 150
}
```

- **Expected Response:** `200 OK` with updated flower details

#### **2.6 Delete Flower** (Protected)

- **Method:** `DELETE`
- **Endpoint:** `/api/flowers/delete-flower/{flowerId}`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Expected Response:** `200 OK` with success message

---

### **3. CART ENDPOINTS** (`/api/cart`) - All Protected

#### **3.1 Get Cart**

- **Method:** `GET`
- **Endpoint:** `/api/cart`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Expected Response:** `200 OK` with user's cart items

#### **3.2 Add to Cart**

- **Method:** `POST`
- **Endpoint:** `/api/cart/add`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Body (JSON):**

```json
{
  "flowerId": "507f1f77bcf86cd799439011",
  "quantity": 5
}
```

- **Expected Response:** `200 OK` with updated cart

#### **3.3 Update Cart Item**

- **Method:** `PATCH`
- **Endpoint:** `/api/cart/update`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Body (JSON):**

```json
{
  "flowerId": "507f1f77bcf86cd799439011",
  "quantity": 10
}
```

- **Expected Response:** `200 OK` with updated cart

#### **3.4 Remove from Cart**

- **Method:** `DELETE`
- **Endpoint:** `/api/cart/remove/{flowerId}`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Expected Response:** `200 OK` with updated cart

#### **3.5 Clear Cart**

- **Method:** `DELETE`
- **Endpoint:** `/api/cart/clear-cart`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Expected Response:** `200 OK` with success message

---

### **4. ORDER ENDPOINTS** (`/api/orders`) - All Protected

#### **4.1 Checkout/Place Order**

- **Method:** `POST`
- **Endpoint:** `/api/orders/checkout`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Body (JSON):**

```json
{
  "shippingAddress": "123 Main Street, City, State 12345",
  "paymentMethod": "credit_card"
}
```

- **Expected Response:** `201 Created` with order details

#### **4.2 Get My Orders** (Buyer)

- **Method:** `GET`
- **Endpoint:** `/api/orders/my`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Expected Response:** `200 OK` with array of orders placed by user

#### **4.3 Get Seller Orders** (Seller)

- **Method:** `GET`
- **Endpoint:** `/api/orders/seller`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Expected Response:** `200 OK` with array of orders for flowers sold by user

#### **4.4 Cancel Order**

- **Method:** `PATCH`
- **Endpoint:** `/api/orders/cancel-order/{orderId}`
- **Headers:**
  - `Authorization: Bearer {accessToken}`
- **Expected Response:** `200 OK` with cancellation message

---

## Complete Testing Workflow

### **Scenario: User A (Buyer) purchases from User B (Seller)**

1. **Register User B (Seller)**
   - POST `/api/auth/register`
   - Save User B's `accessToken`

2. **Register User A (Buyer)**
   - POST `/api/auth/register`
   - Save User A's `accessToken`

3. **User B creates flowers**
   - Use User B's token
   - POST `/api/flowers/create-flower` (add 2-3 flowers)
   - Save the `flowerId` values

4. **User A views all flowers**
   - GET `/api/flowers` (public, no auth needed)
   - Verify flowers are visible

5. **User A adds flowers to cart**
   - Use User A's token
   - POST `/api/cart/add` (add 2 different flowers)
   - GET `/api/cart` (verify items added)

6. **User A modifies cart**
   - Use User A's token
   - PATCH `/api/cart/update` (change quantity)
   - DELETE `/api/cart/remove/{flowerId}` (remove one item)

7. **User A places order**
   - Use User A's token
   - POST `/api/orders/checkout` (place order)
   - GET `/api/orders/my` (verify order appears)

8. **User B checks received orders**
   - Use User B's token
   - GET `/api/orders/seller` (verify order appears)

9. **User A cancels order** (optional test)
   - Use User A's token
   - PATCH `/api/orders/cancel-order/{orderId}`

10. **Test token refresh**
    - POST `/api/auth/refresh` (with refresh token)
    - Verify new access token is returned

11. **User A logout**
    - POST `/api/auth/logout` (with old token)

---

## Sample cURL Commands

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'

# Get all flowers
curl http://localhost:5000/api/flowers

# Create flower (replace TOKEN with actual access token)
curl -X POST http://localhost:5000/api/flowers/create-flower \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Tulip","description":"Beautiful tulips","price":39.99,"quantity":50}'

# Add to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"flowerId":"FLOWER_ID","quantity":5}'

# Get cart
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer TOKEN"
```

---

## Error Testing

Test these error scenarios:

1. **Missing authentication** - Call protected endpoint without token
2. **Invalid token** - Call with expired/fake token
3. **Invalid data** - Send empty/malformed JSON
4. **Non-existent resource** - Try to get flower/order that doesn't exist
5. **Unauthorized action** - Try to delete another user's flower

---

## Notes

- All timestamps and IDs are auto-generated by MongoDB
- Passwords should be hashed by the backend
- Tokens are likely stored in cookies (check middleware)
- Cart should persist across sessions
- Proper error handling should return meaningful messages
