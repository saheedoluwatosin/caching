# Caching Proxy Server CLI

This is a simple **CLI-based caching proxy server** that forwards requests to an origin server and caches the responses for faster subsequent access. It helps in improving efficiency by reducing the need for repetitive requests to the same server.

## Project URL

[Project Roadmap](https://roadmap.sh/projects/caching-server)

---

## Requirements

- You should be able to start the caching proxy server by running a command as follows:

```bash
caching-proxy --port=<number> --origin=<url>



caching-proxy --port=3000 --origin=http://dummyjson.com
In the example above, the caching proxy server starts on port 3000 and forwards requests to http://dummyjson.com.


When a request is made to http://localhost:3000, the caching proxy will forward it to the origin server (e.g., http://dummyjson.com/products).
The proxy will cache the response and include a header to indicate whether the response came from the cache or the origin server.


If the response is from the cache:
X-Cache: HIT

If the response is from the origin server:
X-Cache: MISS

You can clear the cache at any time by running the following command:
caching-proxy --clear-cache




