const METRIC_DEFAULT = {
}

globalThis.updateMetricData = (d) => {
    let metric
    const status = typeof d.check !== "undefined"
    const errorLog = $("#error-log-metric").clear()

    if (!status) {
        if (typeof d === "string")
        errorLog.html(
            `<div class="remark alert">Metric: ${d.split(":error:")[1]}</div>`
        )
        metric = METRIC_DEFAULT
    } else {
        metric = (d)
    }

    for (let o in metric) {
        if (["sync_timestamp_committed", "sync_timestamp_real", "sync_timestamp_synced"].includes(o)) {
            $(`#${o}`).text(datetime(+metric[o]).format(globalThis.dateFormat.full))
        } else {
            if (['system_total_memory'].includes(o)) {
                $(`#${o}`).text(n2f(metric[o]/1024**2))
            } else {
                $(`#${o}`).text(n2f(metric[o]))
            }
        }
    }

    const nodeType = $("#node-type")
    const nodeTypeIcon = $("#node-type-icon").removeClassBy("fg-")
    const networkIcon = $("#network-icon").removeClassBy("fg-")
    const versionIcon = $("#version-icon").removeClassBy("fg-")


    if (status) {
        nodeTypeIcon.addClass("fg-green")
        networkIcon.addClass("fg-green")
        versionIcon.addClass("fg-green")
    }

    if (metric.is_validator) {
        nodeType.text(`Validator`)
        nodeTypeIcon.html($("<span>").addClass("mif-user-secret"));
        $("#fullnode-state").hide()
        $("#validator-state").show()
    } else {
        nodeType.text(`FullNode`)
        nodeTypeIcon.html($("<span>").addClass("mif-organization"));
        $("#fullnode-state").show()
        $("#validator-state").hide()
    }

    const metricStatus = $("#metric-status")

    metricStatus.parent().removeClassBy("bg-").addClass("fg-white")
    if (status) {
        metricStatus.parent().addClass("bg-green")
        metricStatus.text("CONNECTED")
    } else {
        metricStatus.parent().addClass("bg-red")
        metricStatus.text("PORT CLOSED")
    }
}

globalThis.updatePortTest = data => {
    const ports = data.test
    const targets = data.target.ports

    if (!ports) return

    for(let port in targets){
        const el = $("#port-"+port)
        const pr = el.parent()
        const portNum = targets[port]

        pr
            .removeClassBy("bg-")
            .removeClassBy("fg-")
            .addClass(!portNum ? 'bg-violet' : ports[port] ? "bg-green" : "bg-red")
            .addClass("fg-white")

        el.html(`${!portNum ? 'NO DEF' : portNum}`)
    }
}

globalThis.updateRpcDiscover = data => {
    const {rpc_discover, target} = data
    const nodeSecured = $("#node-secured")
    const nodeHealth = $("#node-health")
    const apiStatus = $("#api-status")
    const rpcTypeIcon = $("#rpc-type-icon")

    $("#sync-status").parent().addClass("bg-violet fg-white")

    nodeSecured.addClass("d-none")
    if (target.prot === 'HTTPS') {
        nodeSecured.removeClass("d-none")
    }

    $("#node-host").html(target.host)

    nodeHealth.removeClass("fg-green")
    rpcTypeIcon.removeClass("fg-green")
    apiStatus.parent().removeClassBy("bg-")
    apiStatus.parent().removeClassBy("fg-")
    if (rpc_discover) {
        apiStatus.html(`CONNECTED`)
        apiStatus.parent().addClass(`bg-green fg-white`)
        rpcTypeIcon.addClass('fg-green')
        nodeHealth.addClass("fg-green").html(`node-health:ok`)

        $("#node-timestamp").html(datetime(rpc_discover.timestamp).format(dateFormat.full))
        $("#rpc-version").html(rpc_discover.info.version)
        $("#rpc-type").html(rpc_discover.info.title)
        $("#rpc-title").html(rpc_discover.info.title)
        $("#rpc-description").html(rpc_discover.info.description)
        $("#open-rpc-version").html(rpc_discover.openrpc)

        $("#contact-name").html(rpc_discover.info.contact.name)
        $("#contact-url").html(rpc_discover.info.contact.url)
        $("#contact-email").html(rpc_discover.info.contact.email)
    }
}