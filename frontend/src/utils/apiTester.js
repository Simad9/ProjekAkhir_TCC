// API Testing utility untuk debugging
// Bisa dipanggil dari browser console: window.apiTester.testMenuEndpoint()

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiTester = {
  async testMenuEndpoint() {
    console.log('🔍 Testing Menu API Endpoints...');
    console.log('Base URL:', BASE_URL);
    
    const endpoints = [
      '/api/menu',
      '/api/menus', 
      '/menu', 
      '/menus',
      '/api/Menu',
      '/api/makanan'
    ];
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing: ${BASE_URL}${endpoint}`);
        const response = await fetch(`${BASE_URL}${endpoint}`);
        
        results[endpoint] = {
          status: response.status,
          ok: response.ok,
          data: response.ok ? await response.json() : null
        };
        
        if (response.ok) {
          console.log(`✅ ${endpoint} - Status: ${response.status}`);
          console.log('Data preview:', results[endpoint].data);
        } else {
          console.log(`❌ ${endpoint} - Status: ${response.status}`);
        }
      } catch (error) {
        results[endpoint] = {
          error: error.message
        };
        console.log(`❌ ${endpoint} - Error: ${error.message}`);
      }
    }
    
    console.log('📊 Test Results Summary:', results);
    return results;
  },
  
  async testServerHealth() {
    console.log('🔍 Testing Server Health...');
    
    const healthEndpoints = [
      '/health',
      '/api/health',
      '/',
      '/api'
    ];
    
    for (const endpoint of healthEndpoints) {
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        console.log(`${endpoint}: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          console.log(`✅ Server is reachable at ${BASE_URL}${endpoint}`);
          return true;
        }
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.message}`);
      }
    }
    
    console.log('❌ Server appears to be unreachable');
    return false;
  },
  
  async testDatabaseConnection() {
    console.log('🔍 Testing Database Connection via API...');
    
    try {
      // Test user endpoint (should be working based on previous tests)
      const userResponse = await fetch(`${BASE_URL}/api/user/1`);
      console.log('User endpoint test:', userResponse.status);
      
      if (userResponse.ok) {
        console.log('✅ Database connection seems OK (user endpoint working)');
        return true;
      } else {
        console.log('❌ Database connection might have issues');
        return false;
      }
    } catch (error) {
      console.log('❌ Database connection test failed:', error.message);
      return false;
    }
  }
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  window.apiTester = apiTester;
} 