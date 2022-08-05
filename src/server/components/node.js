import fetch, {AbortError} from "node-fetch";
import {testPort} from "../helpers/test-port.js";

export const getHostMetrics = async ({host = "", port, prot = "http"}) => {
    const link = `${prot.toLowerCase()}://${host}${port  && ![443, 80].includes(port) ? ':'+port:''}/metrics`
    let result = ""

    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, 10000)

    try {
        const response = await fetch(link, {
            signal: controller.signal
        });
        result = response.ok ? (await response.text()) : ""
    } catch (e) {
        const msg = (e instanceof AbortError) ? "Get Metrics Data: Operation aborted by timeout" : e.message
        result = `:error:${msg}`
        console.error(msg)
    } finally {
        clearTimeout(timeout)
    }

    return result
}

export const getHostApiData = async (body, { json = true, host = "", port, prot = "http"}) => {
    const link = `${prot.toLowerCase()}://${host}${port && ![443, 80].includes(port) ? ':'+port:''}`
    let result

    const controller = new AbortController()
    const timeout = setTimeout(() => {
        controller.abort()
    }, 10000)

    try {
        const response = await fetch(link, {
            signal: controller.signal,
            method: "POST",
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {
            result = json ? {
                ...(await response.json()),
            } : await response.text()
        } else {
            result = json ? {error: "no response"} : ":error:no response"
        }
    } catch (e) {
        const msg = (e instanceof AbortError) ? "Get API Data: Operation aborted by timeout" : e.message
        result = json ? {error: msg} : `:error:${msg}`
    } finally {
        clearTimeout(timeout)
    }

    return result
}


export const testPorts = async (host, ports = {}) => {
    const result = {}
    for (const port in ports) {
        result[port] = await testPort(ports[port], {host})
    }
    return result
}