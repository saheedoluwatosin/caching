import fetch from 'node-fetch';
import {URL} from 'url';
import http from 'http';

let cache = {};

const clearCache = () => {
    cache = {};
    console.log('Cache cleared');
};

const fetchAndCache = async (url, origin) => {
    try {
        const targetUrl = `${origin}${url.pathname}${url.search || ''}`;
        //console.log('Target URL:', targetUrl);
        const response = await fetch(targetUrl);
        const data = await response.text();
        const headers = { ...response.headers };
        cache[url.href] = { data, headers };
        return { data, headers };
    } catch (error) {
        return { data: 'Error fetching data', headers: {} };
    }
};

const handleRequest = async (request, response, origin, port) => {
    try {
        let requestUrl = new URL(request.url, `http://localhost:${port}`);
        console.log('Received request for:', requestUrl.href);

        if (cache[requestUrl.href]) {
            console.log(`Cache hit for ${requestUrl.href}`);
            const cachedResponse = cache[requestUrl.href];
            response.writeHead(200, {
                'X-Cache': 'HIT',
                ...cachedResponse.headers
            });
            response.end(cachedResponse.data);
        } else {
            console.log(`Cache miss for ${requestUrl.href}`);
            fetchAndCache(requestUrl, origin).then(({ data, headers }) => {
                response.writeHead(200, {
                    'X-Cache': 'MISS',
                    ...headers
                });
                response.end(data);
            }).catch(error => {
                response.writeHead(500);
                response.end('Error fetching data from origin');
            });
        }
    } catch (error) {
        response.writeHead(500);
        response.end('Internal server error');
    }
};

const args = process.argv.slice(2);
const portArg = args.find(arg => arg.startsWith('--port'));
const originArg = args.find(arg => arg.startsWith('--origin'));
const clearCacheArg = args.includes('--clear-cache');

if (clearCacheArg) {
    clearCache();
    process.exit(0);
}

const port = portArg ? parseInt(portArg.split('=')[1]) : 3000;
const origin = originArg ? originArg.split('=')[1] : null;

if (!origin) {
    console.log('Origin server URL (--origin) must be provided.');
    process.exit(1);
}

// Pass `port` to handleRequest
const server = http.createServer((request, response) => 
    handleRequest(request, response, origin, port)
);

server.listen(port, () => {
    console.log(`Caching proxy server running on http://localhost:${port}`);
});