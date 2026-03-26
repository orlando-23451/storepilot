const Router = require('koa-better-router');
const login = require('../src/auth/login');
const me = require('../src/auth/me');
const getDashboard = require('../src/dashboard/get');
const createUser = require('../src/users/create');
const getUser = require('../src/users/get');
const getUsers = require('../src/users/getAll');
const updateUser = require('../src/users/update');
const deleteUser = require('../src/users/delete');
const createProduct = require('../src/products/create');
const getProduct = require('../src/products/get');
const getProducts = require('../src/products/getAll');
const updateProduct = require('../src/products/update');
const deleteProduct = require('../src/products/delete');
const getCategories = require('../src/products/categories');
const createPurchase = require('../src/purchases/create');
const getPurchase = require('../src/purchases/get');
const getPurchases = require('../src/purchases/getAll');
const getInventory = require('../src/inventory/getAll');
const getInventoryMovements = require('../src/inventory/movements');
const createSale = require('../src/sales/create');
const getSale = require('../src/sales/get');
const getSales = require('../src/sales/getAll');
const getPricingSettings = require('../src/pricing/getSettings');
const getPricingSuggestions = require('../src/pricing/getAll');
const updatePricingSettings = require('../src/pricing/update');
const getReports = require('../src/reports/get');
const { requireRole } = require('../src/system/auth');

const router = Router({ prefix: '/api/v1' }).loadMethods();

router.get('/', async (ctx) => {
  ctx.body = {
    success: true,
    data: {
      service: 'StorePilot API',
      version: '0.1.0',
    },
    trace_id: ctx.state.traceId || '',
  };
});

router.post('/auth/login', login);
router.get('/auth/me', me);

router.get('/dashboard', getDashboard);

router.get('/users', requireRole(['admin']), getUsers);
router.get('/users/:userId', requireRole(['admin']), getUser);
router.post('/users', requireRole(['admin']), createUser);
router.put('/users/:userId', requireRole(['admin']), updateUser);
router.delete('/users/:userId', requireRole(['admin']), deleteUser);

router.get('/products', getProducts);
router.get('/products/categories', getCategories);
router.get('/products/:productId', getProduct);
router.post('/products', requireRole(['admin']), createProduct);
router.put('/products/:productId', requireRole(['admin']), updateProduct);
router.delete('/products/:productId', requireRole(['admin']), deleteProduct);

router.get('/purchases', requireRole(['admin']), getPurchases);
router.get('/purchases/:purchaseId', requireRole(['admin']), getPurchase);
router.post('/purchases', requireRole(['admin']), createPurchase);

router.get('/inventory', requireRole(['admin']), getInventory);
router.get('/inventory/movements', requireRole(['admin']), getInventoryMovements);

router.get('/sales', getSales);
router.get('/sales/:saleId', getSale);
router.post('/sales', createSale);

router.get('/pricing/settings', requireRole(['admin']), getPricingSettings);
router.put('/pricing/settings', requireRole(['admin']), updatePricingSettings);
router.get('/pricing/suggestions', requireRole(['admin']), getPricingSuggestions);

router.get('/reports/summary', requireRole(['admin']), getReports);

module.exports = () => router;
