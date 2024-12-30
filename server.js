import http from 'http';
import nodemailer from 'nodemailer';
const hostname = '127.0.0.1';
const port = 4000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'minhbac333@gmail.com',
        pass: 'chhd mdrz npwq jkej'
    }
});
// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.log('Error:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});
// Email options
let mailOptions = {
    from: 'minhbac333@gmail.com',
    to: 'minhbac333@gmail.com',
    subject: 'Report',
    text: 'Here is the output of the script...',
    html: '<h1>Script Output</h1><p>This is the result</p>'
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error:', error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});