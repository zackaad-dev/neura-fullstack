export type HealthResponse = { 
  status: 'UP' | 'DOWN';
  details?: Record<string, any>; 
};

export const healthApi = {
  get: async (): Promise<HealthResponse> => {
    try {
      // Note: We use the relative path so the Vite Proxy handles the port 8080 logic
      const response = await fetch('/actuator/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        // Even if it's 503 (Service Unavailable), Actuator returns JSON
        // We catch it here to prevent the app from crashing
        const errorData = await response.json().catch(() => ({ status: 'DOWN' }));
        return errorData as HealthResponse;
      }

      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'DOWN' };
    }
  }
};