import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Request and Response for Next.js
global.Request = class Request {
    constructor(input, init) {
        this.url = input
        this.method = init?.method || 'GET'
        this.headers = new Map(Object.entries(init?.headers || {}))
    }
}

global.Response = class Response {
    constructor(body, init) {
        this.body = body
        this.status = init?.status || 200
        this.headers = new Map(Object.entries(init?.headers || {}))
    }
}