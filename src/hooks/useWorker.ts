import { useEffect, useState, useRef, useCallback } from "react";

type UseWorkerResult = [
  result: string | null,
  postMessage: (message: unknown) => void
];

// 미사용
const useWorker = ({ url }: { url: string }): UseWorkerResult => {
  const [result, setResult] = useState(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL(url, import.meta.url), {
      type: "module",
    });

    workerRef.current.onmessage = (e) => {
      setResult(e.data);
    };

    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, [url]);

  const postMessage = useCallback((message: unknown) => {
    if (workerRef.current) workerRef.current.postMessage(message);
  }, []);

  return [result, postMessage];
};

export default useWorker;
