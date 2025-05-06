import { useState, useEffect, useCallback } from 'react';
import axios, { type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from "~/types/apiResponse";
import type { AuthHeaders } from "~/types/headers";
import {toast} from "sonner";

type UseApiOptions= {
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

const useApi = <T,>({ url, method = 'GET', data = null, headers = {}, trigger, showToast = true }: UseApiOptions): UseApiResult<T> => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<object | null>(null);
    const [result, setResult] = useState<T | null>(null);

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

            const response: AxiosResponse<ApiResponse<T>> = await axios(config);
            /**
             * Error on use-api.ts:38
             * POST http://localhost:8000/api/admin/categories 422 (Unprocessable Content)
             */

            if (!response.data.success) {
                const errorMessage = response.data.error;
                setError(errorMessage);
                console.log('Error:', errorMessage);
                throw new Error(response.data.message);
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
                    errorResponse.error.map(err  => {
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
