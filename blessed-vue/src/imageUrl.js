export function getImageUrl(image) {
    if (!image) return "";

    let path = String(image).trim();

    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    if (path.startsWith("/public/")) {
        path = path.slice(7);
    }

    if (!path.startsWith("/")) {
        path = "/" + path;
    }

    return encodeURI(path);
}
