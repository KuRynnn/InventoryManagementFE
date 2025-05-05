import { useState, useCallback } from 'react';

const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error: unknown) {
      setIsLoading(false);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred while fetching data');
      }
      throw error;
    }
  }, []);

  const postData = async (url: string, data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }
      const responseData = await response.json();
      setIsLoading(false);
      return responseData;
    } catch (error: unknown) {
      setIsLoading(false);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred while submitting data');
      }
      throw error;
    }
  };

  return { fetchData, postData, isLoading, error };
};

export default useApi;