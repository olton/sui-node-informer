export const parseMetrics = data => {
    const lines = data.split("\n")
    let counters = {}

    for(let l of lines) {
        if (l[0] === "#") continue

        let val = l.split(" ")[1]

        counters.check = true
        counters.is_validator = false


        if (l.includes("gossip_queued_count")) counters.gossip_queued_count = val
        if (l.includes("gossip_sync_count"))   counters.gossip_sync_count = val
        if (l.includes("gossip_task_error_count")) counters.gossip_task_error_count = val
        if (l.includes("gossip_task_success_count")) counters.gossip_task_success_count = val

        if (l.includes("num_shared_obj_tx")) counters.num_shared_obj_tx = val
        if (l.includes("num_tx_already_processed")) counters.num_tx_already_processed = val

        if (l.includes("total_events")) counters.total_events = val
        if (l.includes("total_signature_errors")) counters.total_signature_errors = val
        if (l.includes("total_transaction_certificates")) counters.total_transaction_certificates = val
        if (l.includes("total_transaction_effects")) counters.total_transaction_effects = val
        if (l.includes("total_transaction_orders")) counters.total_transaction_orders = val
        if (l.includes("total_tx_certificates_created")) counters.total_tx_certificates_created = val

        if (l.includes("req_latency_by_route_sum{route=\"rpc.discover\"}")) counters.latency_by_route_sum_rpc_discover = val
        if (l.includes("req_latency_by_route_count{route=\"rpc.discover\"}")) counters.latency_by_route_count_rpc_discover = val
        if (l.includes("req_latency_by_route_sum{route=\"versions\"}")) counters.latency_by_route_sum_version = val
        if (l.includes("req_latency_by_route_count{route=\"versions\"}")) counters.latency_by_route_count_version = val

        if (l.includes("rpc_requests_by_route")) {
            if (l.includes("rpc.discover")) counters.rpc_discover = val
            if (l.includes("versions")) counters.rpc_versions = val
        }
        if (l.includes("errors_by_route")) counters.errors_by_route = val

    }

    // console.log(counters)

    return counters
}