import { cacheProvider } from "./init.js";

export function withCache(ttl = 3600) {
    return async (req, res, next) => {
        // request
        // method + url
        // "GET:/products" : "[{}, {}, {}, ...]"
        let key = `${req.method}:${req.originalUrl}`;
        const cached = await cacheProvider.get(key);
        if (cached) {
            res.setHeader('X-Cache', 'HIT');
            return res.json(JSON.parse(cached));
        }

        // interceptor
        // res.json(body) >> send client response
        // res.json(body) >> cache + send client response


        const originalJson= res.json.bind(res);


        res.json = (async (body) => {
            if(res.statusCode >= 200 && res.statusCode < 300) {
                // 1. cache body
                await cacheProvider.set(key, JSON.parse(body), ttl);
                // 2. send response
                res.setHeader('X-Cache', 'MISS');

            }
            return originalJson(body);
        });

        next();
    };
}