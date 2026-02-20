import { useQuery } from "@tanstack/react-query";

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => fetch('http://localhost:8081/actuator/health').then(r => r.json()),
    refetchInterval: 30_000,
    retry: 1,
  })
}