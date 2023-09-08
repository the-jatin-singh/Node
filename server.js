// Import necessary modules
const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const logEvents = require('./logEvents');
const EventEmitter = require('events');

// Create a custom EventEmitter class
class Emitter extends EventEmitter {}
const myEmitter = new Emitter();

// Listen for 'log' events and handle them with the logEvents function
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));

// Define the server's port, defaulting to 3500 if not specified
const PORT = process.env.PORT || 3500;

// Function to serve files asynchronously
const serveFile = async (filePath, contentType, response) => {
    try {
        // Read the file data
        const rawData = await fsPromises.readFile(
            filePath,
            // Set encoding to 'utf8' for non-image content types
            !contentType.includes('image') ? 'utf8' : ''
        );

        // Parse JSON data if the content type is 'application/json'
        const data = contentType === 'application/json'
            ? JSON.parse(rawData)
            : rawData;

        // Set response headers and send the data
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        // Handle errors, log them, and set a 500 status code
        console.log(err);
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

// Create an HTTP server
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    // Determine the file extension from the requested URL
    const extension = path.extname(req.url);

    // Initialize content type
    let contentType;

    // Set content type based on file extension
    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    // Define the file path based on the requested URL
    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);

    // Make '.html' extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    // Check if the file exists
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        // Serve the file
        serveFile(filePath, contentType, res);
    } else {
        // Handle special cases for redirection and serve a 404 page for others
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'Location': '/new-page.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location': '/' });
                res.end();
                break;
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }
    }
});

// Start the server and listen on the specified port
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
