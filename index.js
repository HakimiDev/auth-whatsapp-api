const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Client is ready!');
    const number_details = await client.getNumberId('967773195775'); // get mobile number details
    client.sendMessage(number_details._serialized, "test");
});

client.on('message', message => {
    const cmd = message.body.toLowerCase().trim();
    if (cmd === '!test') {
        message.reply('Hi');
    }
});

client.initialize();
