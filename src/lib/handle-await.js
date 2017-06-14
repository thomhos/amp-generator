export function prom(promise) {
    return promise
        .then(data => [null, data])
        .catch(err => [err])
}