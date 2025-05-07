import { useState, useEffect, useCallback, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal} from 'react';
import axios, {type AxiosRequestConfig, type AxiosResponse, AxiosError} from 'axios';
import type {ApiResponse} from "~/types/apiResponse";
import type {AuthHeaders} from "~/types/headers";
import {toast} from "sonner";

type UseApiOptions = {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    headers?: AuthHeaders;
    trigger?: boolean;
    showToast?: boolean
};

type UseApiResult<T> = {
    isLoading: boolean;
    error: object | null;
    result: T | null;
};

const useApi = <T, >({
                         url,
                         method = 'GET',
                         data = null,
                         headers = {},
                         trigger,
                         showToast = true
                     }: UseApiOptions): { isLoading: boolean; error: object | null; result: T | null | undefined } => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<object | null>(null);
    const [result, setResult] = useState<T | null | undefined>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const config: AxiosRequestConfig = {
                url,
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                data: data ? data : undefined,
            };

            if (data instanceof FormData) {
                delete config.headers!['Content-Type'];
            } else {
                config.headers!['Content-Type'] = 'application/json';
            }

            const response: AxiosResponse<ApiResponse<T>> = await axios(config);

            if (!response.data.success) {
                const errorMessage = response.data.error;
                setError(errorMessage);
                console.log('Error:', errorMessage);
                throw new Error(response.data.message);
            } else {
                console.log(response.data.content)
            }


            if (showToast) toast.info(response.data.message, {
                position: "top-center"
            })

            setResult(response.data.content);

        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                const errorResponse = err.response?.data;
                setError(errorResponse.message);
                if (showToast) toast.error(errorResponse.message, {
                    position: "top-center"
                })
                if (errorResponse.error !== null && typeof errorResponse.error === "object") {
                    errorResponse.error.map((err: any | (() => React.ReactNode) | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined)  => {
                        if (showToast) showToast && toast.error(err, {position: "top-center"})
                    })
                }
                console.log('Axios Error:', errorResponse);
            } else {
                setError(err);
                console.log('General Error:', err);
            }
        } finally {
            setIsLoading(false);
        }
    }, [url, method, data]);

    useEffect(() => {
        if (trigger) {
            fetchData();
        }
    }, [fetchData, trigger]);

    return { isLoading, error, result };
};

export default useApi;
