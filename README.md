# testmo-bulk-reporter

Node.js CLI Tool for bulk Testmo session creation and reporting.

## Repository

https://github.com/cygnarowski/testmo-bulk-reporter.git

## Features

- bulk creation of Testmo sessions from JSON
- automatic saving of created session IDs to JSON
- bulk import of test result comments from JSON
- automated HTTP POST requests to Testmo
- HTTP error handling
- console progress tracking

## Technologies

- JavaScript (ESM)
- Node.js 24
- Native Fetch API
- Native environment file support
- JSON

## Project Structure
```
testmo-bulk-reporter/
├── src/
│   ├── api/
│   │   └── testmoClient.js
│   ├── services/
│   │   ├── commentService.js
│   │   └── sessionService.js
│   ├── data/
│   │   ├── comments.json
│   │   ├── sessions.json
│   │   └── created-sessions.json
│   └── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Installation

### Prerequisites

Make sure you have installed:

- Node.js v24
- access to a Testmo instance
- valid Testmo session cookies and CSRF token

## Setup

### Clone the Repository
```
 git clone https://github.com/cygnarowski/testmo-bulk-reporter.git
 cd testmo-bulk-reporter
```

### Install Dependecies
```
npm install
```
No additional npm packages are required.

## Configuration

### Create a ```.env``` file in the project root:
```
TESTMO_SITE_NAME=https://your-instance.testmo.net
TESTMO_REMEMBER_WEB_KEY=your_cookie_name
TESTMO_REMEMBER_WEB_VALUE=your_cookie_value
TESTMO_CSRF_TOKEN=your_csrf_token
TESTMO_SESSION=your_session_cookie_value
TESTMO_SESSION_ID=your_session_id
TESTMO_MILESTONE_ID=your_milestone_id
TESTMO_TEMPLATE_ID=your_template_id
```
Use the cookie names and values from your authenticated Testmo session.

Important: Never commit your ```.env``` file or authentication credentials to GitHub.

## Input Data

### Sessions
Create a ```sessions.json``` file with the following structure:
```
[
  {
"assignee_id": null,
"attachments": [],
"config_id": null,
"custom_mission": null,
"estimate": "",
"issues": [],
"milestone_id": null,
"name": "session title",
"state_id": 11,
"tags": [],
"template_id": null
}
]
```

### Comments
Create a ```comments.json``` file with the following structure:

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

### Run the importer to see the options: 
```
 npm start
```




## How it works: 

### Session Creation: 
```
 npm start -- sessions
```

The script reads sessions.json and sends one POST request per session.

1. Loads configuration from .env.
2. Reads and parses sessions.json.
3. Builds a request body for each session.
4. Sends a POST request to the Testmo session endpoint.
5. Checks the HTTP response status.
6. Reads the created session ID from the response.
7. Saves created sessions to created-sessions.json
8. Displays import progress and a summary.

Example ``` created-sessions.json``` 
```
[
  {
    "id": 94,
    "name": "session title1"
  },
  {
    "id": 95,
    "name": "session title2"
  }
]
```

### Comment Import: 

```
 npm start -- comments
```

The script reads comments.json and sends one POST request per comment.

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

### Example output:

```
[1/3] OK: Verify user login functionality
[2/3] OK: Check registration form validation
[3/3] OK: Validate password reset process
Import completed
Success: 3
Errors: 0
```

## Important Notes: 

- The tool uses internal Testmo web application endpoints rather than the official public REST API.
- Internal endpoints may change without notice.
- The created-sessions.json file is updated after each successful session creation and overwritten on subsequent runs