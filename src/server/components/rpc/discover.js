import {getHostApiData} from "../node.js";
import {datetime} from "@olton/datetime";

export const rpcDiscover = async ({prot, host, port}) => {
    const body = {
        "jsonrpc": "2.0",
        "method": "rpc.discover",
        "id": 1
    }
    const response = await getHostApiData(body, {
        prot, host, port
    })
    return {...response.result, timestamp: datetime().timestamp()}
}