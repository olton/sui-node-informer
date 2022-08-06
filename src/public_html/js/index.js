
globalThis.n2f = (n) => Number(n).format(0, null, " ", ".")

globalThis.enterAddress = (form) => {
    $("#error-log-api").clear()
    $("#error-log-metric").clear()

    const statuses = ["api-status", 'metric-status', 'sync-status']
    const ports = ["api", "metrics", "http"]

    for(let s of statuses) {
        $("#"+s).parent().removeClassBy("bg-")
        $("#"+s).parent().removeClassBy("fg-")
    }

    for(let p of ports) {
        $("#port-"+p).parent().removeClassBy("bg-")
        $("#port-"+p).parent().removeClassBy("fg-")
    }

    $("#node-type-icon").removeClassBy("fg-").html($("<span>").addClass("mif-question"))
    $("#network-icon").removeClassBy("fg-")
    $("#rpc-type-icon").removeClassBy("fg-")

    $("#memory-usage-chart").clear()
    globalThis.memoryChart = null

    let address = form.elements["node_address"].value.trim()
    let api = (form.elements["api_port"].value.trim())
    let metric = (form.elements["metric_port"].value.trim())
    let http = (form.elements["http_port"].value.trim())

    if (api.length === 0) api = 9000
    if (metric.length === 0) metric = 9184
    if (http.length === 0) http = 8080

    if (!address) {
        nodeAddress = ""
        return
    }

    $("#activity").show()

    nodeAddress = address
    apiPort = (isNaN(api) ? 9000 : +api)
    metricPort = (isNaN(metric) ? 9184 : +metric)
    httpPort = (isNaN(http) ? 8080 : +http)

}

globalThis.currentTime = () => {
    $("#current-time").html(datetime().format(globalThis.dateFormat.full))
    setTimeout( currentTime, 1000)
}

const changeColors = () => {
    globalThis.chartLineColor = globalThis.darkMode ? '#3c424b' : "#e5e5e5"
    globalThis.chartLabelColor = globalThis.darkMode ? "#fff" : "#000"
    globalThis.chartBackground = globalThis.darkMode ? "#1b2125" : "#ffffff"
}

;$(() => {

    globalThis.darkMode = $.dark
    globalThis.ledgerVersion = -1

    const storedDarkMode = Metro.storage.getItem("darkMode")
    if (typeof storedDarkMode !== "undefined") {
        globalThis.darkMode = storedDarkMode
    }

    if (darkMode) {
        $("html").addClass("dark-mode")
    }

    changeColors()

    $(".light-mode-switch, .dark-mode-switch").on("click", () => {
        globalThis.darkMode = !globalThis.darkMode
        Metro.storage.setItem("darkMode", darkMode)
        if (darkMode) {
            $("html").addClass("dark-mode")
        } else {
            $("html").removeClass("dark-mode")
        }
        changeColors()
    })

    globalThis.portsProt = {
        api: 'HTTP',
        metrics: 'HTTP',
        http: 'HTTP'
    }

    globalThis.apiVersion = 'v0'

    $(".port-protocol-switcher").on("click", function() {
        const $el = $(this)
        const portType = $el.attr("data-port-type")
        let val = $el.text()

        val = (val === 'HTTP') ? 'HTTPS' : 'HTTP'

        $el.text(val)
        portsProt[portType] = val
    })

    $(".api-version-switcher").on("click", function() {
        const $el = $(this)
        const version = $el.attr("data-api-version")
        let val = $el.text()

        val = (val === 'v0') ? 'v1' : 'v0'

        $el.text(val)
        globalThis.apiVersion = val
    })

    const ports = {
        api: apiPort,
        metrics: metricPort,
        http: httpPort
    }
    const portsWrapper = $(".ports-wrapper")
    for(let p in ports) {
        portsWrapper.append(
            $("<div>").addClass("cell-fs-one-third").attr("title", `${(""+p).toUpperCase()} Port`).append(
                $("<div>").addClass("border bd-default p-2").html(
                    `
                        <div class="small-box-title">${p} port</div>
                        <div class="small-box-value" id="port-${p}">---</div>
                    `
                )
            )
        )
    }

    const address = Metro.utils.getURIParameter(window.location.href, "address")
    const api = Metro.utils.getURIParameter(window.location.href, "api")
    const metric = Metro.utils.getURIParameter(window.location.href, "metrics")
    const http = Metro.utils.getURIParameter(window.location.href, "http")

    if (address) {
        $("#address-form")[0].elements['node_address'].value = address
        nodeAddress = address
    }

    if (api) {
        $("#address-form")[0].elements['api_port'].value = api
        apiPort = api
    }

    if (metric) {
        $("#address-form")[0].elements['metric_port'].value = metric
        metricPort = metric
    }

    if (http) {
        $("#address-form")[0].elements['seed_port'].value = seed
        httpPort = http
    }

    currentTime()

})