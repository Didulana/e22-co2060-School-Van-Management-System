import * as adminService from './adminService';
import db from '../config/db';

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

describe('Admin Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdminSummary', () => {
    it('should return combined admin summary correctly', async () => {
      // Setup mocked responses for db pool
      const mockQuery = db.query as jest.Mock;
      
      // User query mock
      mockQuery.mockResolvedValueOnce({ rows: [{ total_users: '10' }] });
      // Vehicle query mock
      mockQuery.mockResolvedValueOnce({ rows: [{ total_vehicles: '5' }] });
      // Active routes query mock
      mockQuery.mockResolvedValueOnce({ rows: [{ active_routes: '3' }] });

      const result = await adminService.getAdminSummary();

      expect(mockQuery).toHaveBeenCalledTimes(3);
      expect(result).toEqual({
        totalUsers: 10,
        totalVehicles: 5,
        activeRoutes: 3,
      });
    });

    it('should throw error if db query fails', async () => {
      const mockQuery = db.query as jest.Mock;
      mockQuery.mockRejectedValue(new Error('DB Connection Error'));
      
      await expect(adminService.getAdminSummary()).rejects.toThrow('DB Connection Error');
    });
  });
});
