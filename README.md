# testmo-bulk-reporter

Node.js CLI Tool for Bulk Testmo Session Reporting

## Repository

https://github.com/cygnarowski/testmo-bulk-reporter.git

## Features

- bulk import of test result comments from JSON
- automated HTTP POST requests to Testmo
- HTTP error handling
- console progress tracking

## Technologies

- JavaScript (ESM)
- Node.js
- Native Fetch API
- Native environment file support
- JSON

## Installation

### Prerequisites

Make sure you have installed:

- Node.js v24
- access to a Testmo instance
- valid Testmo session cookies and CSRF token

## Backend setup

### Clone the Repository

- git clone https://github.com/cygnarowski/testmo-bulk-reporter.git
- cd testmo-bulk-reporter

No additional npm packages are required.

## Configuration

### Create a .env file in the project root:
```
TESTMO_URL=https://your-instance.testmo.net

TESTMO_SESSION_ID=your_session_id

TESTMO_REMEMBER_WEB_KEY=your_cookie_name

TESTMO_REMEMBER_WEB_VALUE=your_cookie_value

TESTMO_SESSION=your_session_cookie_value

TESTMO_CSRF_TOKEN=your_csrf_token
```
Use the cookie names and values from your authenticated Testmo session.

Important: Never commit your .env file or authentication credentials to GitHub.

## Input Data

Create a comments.json file with the following structure:
```
[
  {
    "comment": "Verify user login functionality"
  },
  {
    "comment": "Check registration form validation"
  },
  {
    "comment": "Validate password reset process"
  }
]
```
Each object represents one test result comment to be added to the specified Testmo session.

## Usage 

### Run the importer: 
- npm start

The script reads comments.json and sends one POST request per comment.


### Example output:

```
[1/3] OK: Verify user login functionality

[2/3] OK: Check registration form validation

[3/3] OK: Validate password reset process

Import completed

Success: 3

Errors: 0
```

## How it works: 

1. Loads configuration from .env.
2. Reads and parses comments.json.
3. Builds a request body for each comment.
4. Sends a POST request to the Testmo session endpoint.
5. Checks the HTTP response status.
6. Displays import progress and a summary.

The request body follows this structure:
```
{
  "comment": "Verify user login functionality",
  "status_id": null,
  "elapsed": "",
  "attachments": [],
  "issue": []
}
```
