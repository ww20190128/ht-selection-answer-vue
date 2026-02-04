// 获取URL参数
export function parseQueryString(url) {
    return [...new URL(url).searchParams].reduce((cur, [key, value]) => {
        cur[key] = value;
        return cur;
    }, {});
}

export function createMeta(name, content) {
    const meta = document.createElement('meta');
    meta.content = content;
    meta.name = name;
    document.getElementsByTagName('head')[0].appendChild(meta);
}
export function storage(cache = window.sessionStorage, storageKey = '__cache__') {
    const get = (key) => {
        try {
            const storageJson = cache.getItem(storageKey)
            const values = JSON.parse(storageJson)
            return values[key]
        } catch (error) {
            return null
        }
    }
    const set = (key, value) => {
        try {
            let values = {};
            const storageJson = cache.getItem(storageKey)
            if (storageJson) {
                values = JSON.parse(storageJson)
            }
            values[key] = value;
            cache.setItem(storageKey, JSON.stringify(values))
        } catch (error) {

        }
    }
    return {
        get, set
    }
}