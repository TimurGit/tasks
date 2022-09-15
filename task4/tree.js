import {readdir} from 'fs/promises';

async function writeByType(path, type){
    return (await readdir(path, { withFileTypes: true })).filter(f => (type ==='dir' ? f.isDirectory() : !f.isDirectory()))
        .map(f => f.name);
}

async function tree(path) {
    try {
        const dirs = await writeByType(path, 'dir');
        const files = await writeByType(path, 'files');
        return {files: files, dirs: dirs};
    } catch (err) {
        console.error(err);
    }
}
console.log(await tree(process.env.npm_config_path ?? ''));
