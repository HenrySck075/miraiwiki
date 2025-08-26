import type { UseFetchOptions, FetchResult } from "#app";
type KeysOf<T> = Array<T extends T ? keyof T extends string ? keyof T : never : never>;
import type { AvailableRouterMethod } from "nitropack/types";
import type { FetchError } from "ofetch";
type ReqT = string;
/**
 * basically a shorthand for useFetch with the most repetitive part of the path already included :D
 * @note expected to be used on pages having the `site` param
 */


export function useWikiFetch<ResT = void, ErrorT = FetchError, Method extends AvailableRouterMethod<ReqT> = ResT extends void ? 'get' extends AvailableRouterMethod<ReqT> ? 'get' : AvailableRouterMethod<ReqT> : AvailableRouterMethod<ReqT>, _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT, DataT = _ResT, PickKeys extends KeysOf<DataT> = KeysOf<DataT>, DefaultT = DataT>(endpoint: string, opts?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method>
) {
    return useFetch<ResT, ErrorT, ReqT, Method, _ResT, DataT, PickKeys, DefaultT>(`/api/${useRoute().params.site}${endpoint}`, {...opts, "responseType": "json"});
}