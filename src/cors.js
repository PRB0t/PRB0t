// MIT License
//
// Copyright (c) 2018 Mike Bannister
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
// From https://github.com/possibilities/micro-cors

const DEFAULT_ALLOW_METHODS = [
    "POST",
    "GET",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
];

const DEFAULT_ALLOW_HEADERS = [
    "X-Requested-With",
    "Access-Control-Allow-Origin",
    "X-HTTP-Method-Override",
    "Content-Type",
    "Cache-Control",
    "Authorization",
    "Accept"
];

const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

const cors = (options = {}) => handler => (req, res, ...restArgs) => {
    const {
        origin = "*",
        maxAge = DEFAULT_MAX_AGE_SECONDS,
        allowMethods = DEFAULT_ALLOW_METHODS,
        allowHeaders = DEFAULT_ALLOW_HEADERS,
        allowCredentials = true,
        exposeHeaders = []
    } = options;

    res.setHeader("Access-Control-Allow-Origin", origin);
    if (allowCredentials) {
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    if (exposeHeaders.length) {
        res.setHeader("Access-Control-Expose-Headers", exposeHeaders.join(","));
    }

    res.setHeader("Access-Control-Allow-Methods", allowMethods.join(","));
    res.setHeader("Access-Control-Allow-Headers", allowHeaders.join(","));
    res.setHeader("Access-Control-Max-Age", String(maxAge));

    if (req.method === "OPTIONS") {
        return {};
    }

    return handler(req, res, ...restArgs);
};

module.exports = cors;
