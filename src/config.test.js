import API_CONFIG from './config';

describe('API_CONFIG', () => {
  test('should have correct BASE_URL', () => {
    expect(API_CONFIG.BASE_URL).toBe('https://sendit.aident.my.id');
  });

  test('should have all required API endpoints', () => {
    expect(API_CONFIG.API_ENDPOINTS).toBeDefined();
    expect(API_CONFIG.API_ENDPOINTS.LOGIN).toBe('/api/login');
    expect(API_CONFIG.API_ENDPOINTS.REGISTER).toBe('/api/register');
    expect(API_CONFIG.API_ENDPOINTS.FORGOT_PASSWORD).toBe('/api/forgot-password');
    expect(API_CONFIG.API_ENDPOINTS.RESET_PASSWORD).toBe('/api/password-reset');
    expect(API_CONFIG.API_ENDPOINTS.ORDERS).toBe('/api/pemesanan');
    expect(API_CONFIG.API_ENDPOINTS.PAYMENTS).toBe('/api/payments');
    expect(API_CONFIG.API_ENDPOINTS.USERS).toBe('/api/users');
  });

  test('should export default configuration object', () => {
    expect(typeof API_CONFIG).toBe('object');
    expect(API_CONFIG).toHaveProperty('BASE_URL');
    expect(API_CONFIG).toHaveProperty('API_ENDPOINTS');
  });

  test('should have valid endpoint structure', () => {
    const endpoints = API_CONFIG.API_ENDPOINTS;
    
    Object.values(endpoints).forEach(endpoint => {
      expect(typeof endpoint).toBe('string');
      expect(endpoint).toMatch(/^\/api\/.+/);
    });
  });
});