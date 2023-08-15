require('dotenv').config();

const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('json spaces', 2);
app.use(cors());

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log("QR CODE:");
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Client is ready!');
});

const authPass = (req, res, next) => {
    const pass = req.headers["authorization"];
    if (pass !== process.env.PASS) return res.status(418).send('Auth is req!');
    next();
};

app.post('/send-message/:phone', authPass, async (req, res) => {
    const { phone } = req.params;
    const { authCode } = req.query;
    
    const number_details = await client.getNumberId(phone.trim());
    if (!number_details) return res.status(400).send('This user is not found!');

    if (typeof authCode !== "string" || !authCode.trim().length) return res.status(400).send('authCode must be a string!');
    client.sendMessage(number_details._serialized, authCode.trim());

    return res.status(200).send('Done!');
});

client.initialize();
const server = app.listen(process.env.PORT, () => console.log(`App is online with port ${server.address().port}`));
