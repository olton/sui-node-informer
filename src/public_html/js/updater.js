const METRIC_DEFAULT = {
}

globalThis.updateLedgerData = (data) => {
    const ledger = data.ledger
    const target = data.target
    const error = typeof ledger.error !== "undefined"
    const apiStatus = $("#api_status")
    const chainStatus = $("#chain_status")
    const errorLog = $("#error-log-api").clear()
    const chainOk = $("#chain-ok")
    const syncStatus = $("#sync_status")

    const in_chain = !error && +(data.ledger.chain_id) === +(data.ledger.aptos_chain_id)
    const synced = !error && Math.abs(+(data.ledger.ledger_version) - +(data.ledger.aptos_version)) <= (config.aptos.accuracy || 100)

    if (!error) {
        globalThis.ledgerVersion = ledger.ledger_version
        $("#chain_id").text(ledger.chain_id)
        $("#epoch").text(ledger.epoch)
        $("#ledger_version").text(n2f(ledger.ledger_version))
        $("#ledger_timestamp").text(datetime(ledger.ledger_timestamp / 1000).format(globalThis.dateFormat.full))
    } else {
        globalThis.ledgerVersion = -1
        errorLog.clear().append(
            $("<div>").addClass("remark alert").text(`API: ${ledger.error}`)
        )
        $("#chain_id").text(0)
        $("#epoch").text(0)
        $("#ledger_version").text(0)
        $("#ledger_timestamp").text(globalThis.dateFormat.full)
    }

    apiStatus.parent().removeClassBy("bg-").addClass("fg-white")
    if (!error && ledger && ledger.chain_id) {
        apiStatus.parent().addClass("bg-green")
        apiStatus.text("CONNECTED")
    } else {
        apiStatus.parent().addClass("bg-red")
        apiStatus.text("PORT CLOSED")
    }


    chainStatus.parent().removeClassBy("bg-").addClass("fg-white")
    chainOk.removeClassBy("fg-")

    if (!error) {
        if (in_chain) {
            chainStatus.parent().addClass("bg-green")
            chainStatus.text("IN CHAIN")
            chainOk.addClass("fg-green");
        } else {
            chainStatus.parent().addClass("bg-red")
            chainStatus.text("UPDATE NODE")
            chainOk.addClass("fg-red");
        }
    } else {
        chainStatus.parent().addClass("bg-red")
        chainStatus.text("NO DATA")
    }

    syncStatus.parent().removeClassBy("bg-")
    if (!error) {
        if (synced) {
            syncStatus.parent().addClass("bg-green fg-white")
            syncStatus.text("SYNCED")
        } else {
            syncStatus.parent().addClass("bg-cyan fg-white")
            syncStatus.text("CATCHUP")
        }
    } else {
        syncStatus.parent().addClass("bg-red")
        syncStatus.text("NOT SYNCED")
    }

    if (target && target.host) {
        $("#node_host").text(target.host)
    }
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
        pr.removeClassBy("bg-").addClass(!portNum ? 'bg-violet' : ports[port] ? "bg-green" : "bg-red").addClass("fg-white")
        el.html(`${!portNum ? 'NOT DEF' : portNum}`)
    }
}

globalThis.updateRpcDiscover = data => {
    const {rpc_discover, target} = data
    const nodeSecured = $("#node-secured")
    const nodeHealth = $("#node-health")
    const apiStatus = $("#api-status")

    $("#sync-status").parent().addClass("bg-violet fg-white")

    nodeSecured.removeClass("d-none")
    if (target.prot === 'HTTPS') {
        nodeSecured.removeClass("d-none")
    }

    $("#node-host").html(target.host)


    nodeHealth.removeClass("fg-green")
    if (rpc_discover) {
        nodeHealth.addClass("fg-green").html(`node-health:ok`)
    }

    apiStatus.parent().removeClassBy("bg-")
    apiStatus.parent().removeClassBy("fg-")
    if (rpc_discover) {
        apiStatus.html(`CONNECTED`)
        apiStatus.parent().addClass(`bg-green fg-white`)

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