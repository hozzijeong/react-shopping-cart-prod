import { useState } from 'react';
import { FETCH_METHOD, MESSAGE } from '../constants';
import { MutationFetchMethod } from '../types';

interface UseMutationArg<BodyData, ResponseData> {
  onSuccess?: (data?: {
    response: ResponseData | string;
    headers: Headers;
    fetchInformation: FetchInformation<BodyData>;
  }) => void;
  onFailure?: (error?: string) => void;
  onSettled?: () => void;
}

interface FetchInformation<BodyData> {
  url: string;
  method: MutationFetchMethod;
  bodyData?: BodyData;
  headers?: HeadersInit;
  referenceData?: unknown;
}

const useMutation = <BodyData, ResponseData>({
  onSuccess,
  onFailure,
  onSettled,
}: UseMutationArg<BodyData, ResponseData>) => {
  const [isLoading, setIsLoading] = useState(false);

  const mutateQuery = async (fetchInformation: FetchInformation<BodyData>) => {
    setIsLoading(true);
    const { url, method, bodyData, headers } = fetchInformation;

    const body = bodyData ? JSON.stringify(bodyData) : null;

    try {
      if (!navigator.onLine) {
        throw new Error('네트워크 오프라인이 감지되었습니다');
      }

      const response = await fetch(url, { method, body, headers });
      if (!response.ok) {
        throw new Error(MESSAGE.RESPONSE_NOT_OKAY);
      }

      if (method === FETCH_METHOD.DELETE || FETCH_METHOD.PATCH) {
        const data = await response.text();
        onSuccess?.({ response: data, headers: response.headers, fetchInformation });
        setIsLoading(false);
      } else {
        const data: ResponseData = await response.json();
        onSuccess?.({ response: data, headers: response.headers, fetchInformation });
        setIsLoading(false);
      }
    } catch (e) {
      if (e instanceof Error) {
        setIsLoading(false);

        onFailure?.(e.message);
      }
    } finally {
      onSettled?.();
      setIsLoading(false);
    }
  };

  return { mutateQuery, isLoading };
};
export default useMutation;
