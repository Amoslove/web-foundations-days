

# Library Books API

This API allows users to view, create, update, and delete books in a library.

## 1. List all books

- **Method:** GET
- **Path:** `/books`
- **Description:** Returns a list of all books in the library.
- **Success status:** 200 OK

## 2. Get one book

- **Method:** GET
- **Path:** `/books/{id}`
- **Description:** Returns the details of one book using its ID.
- **Success status:** 200 OK

## 3. Create a book

- **Method:** POST
- **Path:** `/books`
- **Description:** Adds a new book to the library.
- **Example request body:**

  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1958
  }
  ```

- **Success status:** 201 Created






## 4. Update a book

- **Method:** PUT
- **Path:** `/books/{id}`
- **Description:** Replaces the details of an existing book.
- **Example request body:**

  ```json
  {
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1959
  }
  ```

- **Success status:** 200 OK

## 5. Delete a book

- **Method:** DELETE
- **Path:** `/books/{id}`
- **Description:** Deletes a book using its ID.
- **Success status:** 204 No Content

## 6. List books by an author

- **Method:** GET
- **Path:** `/books?author=Chinua%20Achebe`
- **Description:** Returns books written by the specified author using a query parameter.
- **Success status:** 200 OK




## Error responses

### 400 Bad Request

- **Description:** The request contains invalid or missing information.
- **Example:** A user tries to create a book without providing the required title.

### 404 Not Found

- **Description:** The requested resource does not exist.
- **Example:** A user requests `GET /books/999` when book ID 999 does not exist.
