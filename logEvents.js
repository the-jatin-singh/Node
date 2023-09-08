// Import required modules
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Define a function to log events asynchronously
const logEvents = async (message, logName) => {
    // Generate a timestamp in the format 'yyyyMMdd HH:mm:ss'
    const dateTime = `${format(new Date(), 'yyyyMMdd HH:mm:ss')}`;
    
    // Create a log item with timestamp, a UUID, and the provided message
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        // Check if the 'logs' directory exists, create it if not
        if (!fs.existsSync(path.join(__dirname, 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }

        // Append the log item to the specified log file
        await fsPromises.appendFile(path.join(__dirname, 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

// Export the logEvents function
module.exports = logEvents;
