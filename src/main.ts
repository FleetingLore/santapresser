import { createNavigator, createPathUtils } from '@wein/collections';

const config = {
    rootDir: '/lore'
};

const pathUtils = createPathUtils(config);
const navigator = createNavigator(config);

async function init() {
    const path = window.location.pathname;

    if (pathUtils.isMarkdownPath(path)) {
        return; // Zola 处理
    }

    const fsPath = pathUtils.getFileSystemPathFromUrl(path);
    const loader = (await import('@wein/collections')).createLoader(config);

    await loader.loadLore(fsPath, navigator.navigate.bind(navigator));
    window.addEventListener('popstate', navigator.handlePopState.bind(navigator));
}

init();