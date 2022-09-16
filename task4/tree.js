import {readdir} from 'fs/promises';

async function* getFsItem(path) {
    const items = (await readdir(path, {withFileTypes: true}))
    const dirItems = items.filter(f => f.isDirectory())
        .map(f => f.name);
    const fileItems = items.filter(f => (!f.isDirectory()))
        .map(f => f.name);
    for (const filePath of fileItems) {
        yield {path: path + '/' + filePath, is_dir: false};
    }

    if (dirItems.length) {
        for (const [index, value] of dirItems.entries()) {
            if (index === 0) {
                yield {path, is_dir: true};
            }
            yield* getFsItem(path + '/' + value);
        }
    } else {
        yield {path, is_dir: true};
    }
}

async function tree(path) {
    try {
        const tree = {dir: [], files: []};

        for await (const item of getFsItem(path)) {
            if (item.is_dir) {
                tree.dir.push(item.path);
            } else {
                tree.files.push(item.path);
            }
        }
        return tree;
    } catch (err) {
        console.error(err);
    }
}

console.log(await tree(process.argv[2] ?? ''));
