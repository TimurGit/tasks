const fs = require('fs');
const readline = require("readline");

function getRandom() {
    return Math.floor(Math.random() * 10000000);
}

function writeRandomNumbersToFilePromise(){
    return new Promise((resolve, reject) => {
        writeRandomNumbersToFile(resolve);
    })
}

function writeRandomNumbersToFile(resolve) {
    let stream = fs.createWriteStream('number.txt', {flags: 'a'});
    let rows = Array.from({length: 10000}, getRandom);
    for (let i = 0; i < rows.length; i++) {
        stream.write(`${rows[i]}\n`);
    }
    stream.end();
    stream.on('finish', function () {
        console.log('added: ' + rows.length + 'filesize: ' + fs.statSync("number.txt").size);
        if (fs.statSync("number.txt").size > (1024 * 1024 * 10)) {
            console.log('finish generate big file');
            resolve();
        } else {
            writeRandomNumbersToFile(resolve);
        }
    });

}


function sortToFiles() {
    console.log('start chunk and sort files...');
    return new Promise((resolve, reject) => {
        let arr = '';
        const rs = fs.createReadStream('number.txt');
        let k = 0;
        fs.appendFileSync('10mb/number' + k + '.txt', '');
        rs.on('data', (data) => {
            arr += data.toString();
            if (arr.length > 1000000) {
                rs.pause();
                fs.appendFileSync('10mb/number' + k + '.txt', arr.split('\n').sort((a, b) => (a - b)).join('\n'));
                k++;
                arr = '';
                rs.resume()
            }
        })
        rs.on('end', () => {
            console.log('end');
            resolve(k)
        })
    })
}

async function writeSortToFile(k) {
    const iterator = [];
    const rs = [];
    for (let i = 0; i < k; i++) {
        rs[i] = fs.createReadStream(`10mb/number${i}.txt`);
        const rl = readline.createInterface({
            input: rs[i],
            crlfDelay: Infinity
        });
        iterator[i] = rl[Symbol.asyncIterator]();
    }
    let ws = fs.createWriteStream('output.txt', {flags: 'a'});

    let file_rows = [];

    for (let i = 0; i < k; i++) {
        let result = await iterator[i].next();
        if (result.done) {
            throw new Error('Файл пустой');
        }
        file_rows[i] = Number(result.value);
        // rs[i].pause();
    }
    let files_is_end = 0;
    while (true) {
        const min_value = Math.min(...file_rows);
        const min_index = file_rows.indexOf(min_value);
        ws.write(`${min_value}\n`);
        // rs[min_index].resume();
        let result = await iterator[min_index].next();
        // rs[min_index].pause();
        if (result.done) {
            files_is_end++;
            if (files_is_end === k) break;
            continue;
        }
        file_rows[min_index] = Number(result.value);
    }
    ws.end();
    for (let i = 0; i < k; i++) {
        rs[i].destroy();
    }
}

(async () => {
    console.log('start');
    console.log('generate a big file');
    await writeRandomNumbersToFilePromise();
    console.log('end generate a big file');
    const k = await sortToFiles();
    console.log('sort to big file ' + k);
    await writeSortToFile(k);
    console.log('finish');
})();