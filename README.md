# Express & MongoDB CRUD API Task 🚀

This project is a RESTful API built using **Node.js**, **Express**, and the native **MongoDB** driver to perform complete CRUD operations.

## 🛠️ API Endpoints & Operations

The application implements the following 5 endpoints:

1. **`POST /users`**
   - **Description:** Adds 5 users (or any user object/array) containing `name`, `age`, and `city`.
   - **Response:** Returns the created user(s) along with their generated IDs.

2. **`GET /users`**
   - **Description:** Retrieves and displays all user documents from the collection.

3. **`GET /users/:id`**
   - **Description:** Retrieves a specific user by their unique `_id`.

4. **`PATCH /users/:id`**
   - **Description:** Updates specific fields (e.g., name or age) of a user by their `_id`.
   - **Response:** Returns the updated user document.

5. **`DELETE /users/:id`**
   - **Description:** Deletes a user from the collection using their `_id`.
   - **Response:** Returns a confirmation message of deletion.

---

## ⚙️ Installation & Running the App

1. Clone or download this repository.
2. Install dependencies:
   ```bash
   npm install
