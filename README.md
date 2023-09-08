# Simple Node Server

This is a basic Node.js HTTP server that serves static files and logs events. It can serve as a foundation for developing your web applications.

## Prerequisites

Before running the server, ensure that you have the following prerequisites installed:

- [Node.js](https://nodejs.org/)
- [npm (Node Package Manager)](https://www.npmjs.com/)

## Installation

1. Clone this repository to your local machine:

```shell
git clone https://github.com/your-username/simple-Node-server.git
```

2. Navigate to the project directory:
```shell
cd simple-Node-server
```
3. Install the necessary dependencies:
```shell
npm install
```
## Usage
To start the server, run the following command:

```bash
node server.js
```
- The server will listen on port 3500 by default. You can specify a different port by setting the PORT environment variable. For instance, to run the server on port 5000:

```bash
PORT=5000 node server.js
```
- Once the server is running, you can access it in your web browser by navigating to http://localhost:3500 (or the custom port you specified).

## File Structure
- server.js: The primary server script that manages HTTP requests, serves static files, and logs events.
- logEvents.js: A module for logging events with timestamps and UUIDs.
- views/: This directory contains HTML files that can be served by the server.
- logs/: Log files are stored in this directory.

## Logging
The server uses a custom logging module (logEvents.js) to log events. Log files are stored in the logs/ directory and are named based on the event type. You can customize the logging behavior by modifying this module.

## Contributing
If you have any suggestions, bug reports, or feature requests, please feel free to open an issue or submit a pull request. Contributions are welcome!



