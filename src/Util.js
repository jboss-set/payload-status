export function getKeyFromUrl(url) {
    return url.substr(url.lastIndexOf('/')+1);
}
