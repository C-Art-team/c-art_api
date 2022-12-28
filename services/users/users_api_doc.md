# C-Art API Documentation

## Endpoints :

List of available endpoints:

Public:

- `POST /register`

&nbsp;

## 1. POST /register

Request:

-body:

```json
{
  "email": "string",
  "password": "string",
  "username": "string",
  "preference": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "email": "string",
  "username": "string"
}
```

_Response (400 - Bad Request)_

```json
{
    "status": 400,
    "message": "Email is required, Invalid email format"
}
OR
{
    "status": 400,
    "message": "Password is required, Password cannot be shorter than 5 character"
}
OR
{
    "status": 400,
    "message": "Username is required, Username cannot be shorter than 5 character"
}
OR
{
    "status": 400,
    "message": "Invalid email format"
}
OR
{
    "status": 400,
    "message": "Password cannot be shorter than 5 character"
}
OR
{
    "status": 400,
    "message": "Username cannot be shorter than 5 character"
}
OR
{
    "status": 400,
    "message": "Email already used"
}
OR
{
    "status": 400,
    "message": "Username already used"
}
```

&nbsp;

## Global Error

_Response (500 - Internal Server Error)_

```json
{
  "status": 500,
  "message": "Internal Server Error"
}
```
