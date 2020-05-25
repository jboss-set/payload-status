export function getKeyFromUrl(url) {
    return url.substr(url.lastIndexOf('/')+1);
}

export function safeClassName(name) {
    return name.replace(' ', '-').toLowerCase();
}

export function shortStatus(status) {
    return status === 'Pull Request Sent' ? 'PR Sent' : status;
}
