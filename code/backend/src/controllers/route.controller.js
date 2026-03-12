const routeService = require("../services/route.service");

/**
 * POST /api/routes
 */
const createRoute = async (req, res) => {
  try {
    const route = await routeService.createRoute(req.body);
    return res.status(201).json(route);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * GET /api/routes
 * Optional: /api/routes?driver_id=1
 */
const getRoutes = async (req, res) => {
  try {
    const routes = await routeService.getRoutes(req.query.driver_id);
    return res.status(200).json(routes);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createRoute,
  getRoutes,
};