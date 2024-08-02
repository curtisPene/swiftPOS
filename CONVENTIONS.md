# Project Conventions

This document outlines the conventions used throughout the SwiftPOS project to ensure consistency and maintainability.

## Table of Contents

- [Project Conventions](#project-conventions)
  - [Table of Contents](#table-of-contents)
  - [Commit Messages](#commit-messages)
    - [Format](#format)
  - [Commit Types for Reference](#commit-types-for-reference)
  - [Error and Success Response Conventions](#error-and-success-response-conventions)
    - [HTTP Status Codes for Reference](#http-status-codes-for-reference)
  - [Custom Error Codes for JSON Response](#custom-error-codes-for-json-response)
  - [Common Error Code Prefixes](#common-error-code-prefixes)
  - [Success Response Structure](#success-response-structure)
    - [Example Success Response](#example-success-response)
  - [Error Response Structure](#error-response-structure)
  - [Example Error Response](#example-error-response)
  - [JWT Payload Structure](#jwt-payload-structure)
    - [Standard Claims](#standard-claims)
    - [Custom Claims](#custom-claims)
    - [Example JWT Payload](#example-jwt-payload)

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

### Format

- `<type>(<optional scope>): <description>`
- `<optional body>`
- `<optional footer>`

## Commit Types for Reference

1. **feat**: A new feature for the user.
2. **fix**: A bug fix.
3. **docs**: Documentation only changes.
4. **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
5. **refactor**: A code change that neither fixes a bug nor adds a feature.
6. **perf**: A code change that improves performance.
7. **test**: Adding missing or correcting existing tests.
8. **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm).
9. **ci**: Changes to CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs).
10. **chore**: Other changes that don't modify src or test files.
11. **revert**: Reverts a previous commit.

## Error and Success Response Conventions

### HTTP Status Codes for Reference

- **1xx (Informational)**: Indicates that the request was received and understood. The server is continuing the process.
  - Examples: `100 Continue`, `101 Switching Protocols`
- **2xx (Successful)**: Indicates that the request was successfully received, understood, and accepted.
  - Examples: `200 OK`, `201 Created`, `204 No Content`
- **3xx (Redirection)**: Indicates that further action is needed to complete the request.
  - Examples: `301 Moved Permanently`, `302 Found`, `304 Not Modified`
- **4xx (Client Errors)**: Indicates an issue with the request from the client.
  - Examples: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
- **5xx (Server Errors)**: Indicates an issue on the server side.
  - Examples: `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable

## Custom Error Codes for JSON Response

- **Format**: Error codes should follow the structure `PREFIX_CODE`. The `PREFIX` represents the category of the error (e.g., `USER_`, `AUTH_`, `DB_`), and `CODE` is a unique identifier.
- **Examples**: `USER_NOT_FOUND`, `AUTH_INVALID_TOKEN`, `DB_CONNECTION_FAILED`

## Common Error Code Prefixes

- **USER\_**: Related to user-specific issues

  - Example: `USER_NOT_FOUND`, `USER_INVALID_CREDENTIALS`

- **AUTH\_**: Related to authentication and authorization issues

  - Example: `AUTH_INVALID_TOKEN`, `AUTH_EXPIRED_SESSION`

- **DB\_**: Related to database issues

  - Example: `DB_CONNECTION_FAILED`, `DB_QUERY_ERROR`

- **SERVER\_**: General server errors

  - Examples:
    - `SERVER_INTERNAL_ERROR`: For a generic internal server error.
    - `SERVER_UNAVAILABLE`: For a service being temporarily unavailable.
    - `SERVER_TIMEOUT`: For timeout issues on the server side.
    - `SERVER_CONFIGURATION_ERROR`: For issues related to server configuration.

- **VALIDATION\_**: Related to validation errors

  - Example: `VALIDATION_REQUIRED_FIELD`, `VALIDATION_INVALID_FORMAT`

- **PERMISSION\_**: Related to permission issues

  - Example: `PERMISSION_DENIED`, `PERMISSION_NOT_GRANTED`

- **PAYMENT\_**: Related to payment processing issues

  - Example: `PAYMENT_FAILED`, `PAYMENT_INVALID_AMOUNT`

- **NETWORK\_**: Related to network issues

  - Example: `NETWORK_TIMEOUT`, `NETWORK_UNAVAILABLE`

- **FILE\_**: Related to file handling issues

  - Example: `FILE_NOT_FOUND`, `FILE_UPLOAD_ERROR`

- **SERVICE\_**: Related to external services or APIs
  - Example: `SERVICE_UNAVAILABLE`, `SERVICE_TIMEOUT`

## Success Response Structure

Successful responses should follow this structure:

- **`status`**: The HTTP status code representing the successful operation.
- **`data`**: The main content of the response, such as the requested resource.
- **`message`**: An optional human-readable message providing additional context or confirmation.

### Example Success Response

```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "message": "User fetched successfully"
}
```

## Error Response Structure

Error responses should adhere to the following structure:

- **`status`**: The HTTP status code representing the error.
- **`message`**: A human-readable description of the error that provides context and guidance.
- **`code`**: A specific code associated with the error type, if different from `error`.
- **`details`** (optional): Additional information or context that may help in troubleshooting.

## Example Error Response

```json
{
  "status": 400,
  "message": "The user with the provided ID was not found.",
  "code": "USER_NOT_FOUND",
  "details": {
    "field": "user_id",
    "expected_format": "UUID"
  }
}
```

## JWT Payload Structure

When using JSON Web Tokens (JWTs) for authentication and authorization, adhere to the following payload structure:

### Standard Claims

- **`sub`** (Subject): Identifies the principal that is the subject of the JWT (e.g., user ID).
- **`iat`** (Issued At): Timestamp indicating when the JWT was issued.
- **`exp`** (Expiration Time): Timestamp indicating when the JWT will expire.
- **`aud`** (Audience): Identifies the recipients that the JWT is intended for.
- **`iss`** (Issuer): Identifies the issuer of the JWT.
- **`nbf`** (Not Before): Timestamp indicating when the JWT should start being valid.

### Custom Claims

- **`role`**: Defines the user's role (e.g., `admin`, `user`).
- **`permissions`**: Lists specific permissions assigned to the user (e.g., `read`, `write`).

### Example JWT Payload

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1716239022,
  "role": "admin",
  "permissions": ["read", "write"]
}
```
