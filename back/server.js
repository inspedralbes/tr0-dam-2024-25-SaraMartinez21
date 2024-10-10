const {spawn} = require('child_process');

const ls = spawn('ls', ['-l', '-a']);

ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    }
);

ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    }   
);