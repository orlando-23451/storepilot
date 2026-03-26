const { test, expect } = require('@playwright/test');

const adminUser = {
  user_id: 1,
  tenant_id: 1,
  store_id: 1,
  role_code: 'admin',
  full_name: 'Ana Administradora',
  email: 'admin@storepilot.local',
  store_name: 'Sucursal Centro',
  target_margin_percent: 30,
};

const dashboardPayload = {
  success: true,
  data: {
    role_scope: 'admin',
    summary: {
      total_products: 8,
      low_stock_products: 1,
      low_margin_products: 2,
      average_cost: 84.5,
    },
    recent_sales: [
      { sale_id: 1, sale_number: 'SALE-1001', sale_date: '2026-03-19T12:00:00Z', total_amount: 617 },
    ],
    recent_purchases: [
      { purchase_id: 1, supplier_name: 'Distribuidora Centro', purchase_date: '2026-03-18T12:00:00Z', total_amount: 3150 },
    ],
  },
};

test('renders landing page sections and CTA', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /controla tu tienda física/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /entrar a la app/i })).toBeVisible();
  await expect(page.getByText(/beneficios principales/i)).toBeVisible();
});

test('allows login and sales capture flow with mocked api', async ({ page }) => {
  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({
      json: {
        success: true,
        data: {
          token: 'mock-token',
          user: adminUser,
        },
      },
    });
  });

  await page.route('**/api/v1/dashboard', async (route) => {
    await route.fulfill({ json: dashboardPayload });
  });

  await page.route('**/api/v1/products/categories', async (route) => {
    await route.fulfill({
      json: {
        success: true,
        data: [
          { category_id: 1, name: 'Electrónica' },
          { category_id: 2, name: 'Moda' },
        ],
      },
    });
  });

  await page.route('**/api/v1/products*', async (route) => {
    await route.fulfill({
      json: {
        success: true,
        data: [
          {
            product_id: 1,
            sku: 'SP-ELE-001',
            name: 'Pro Watch Series 8',
            category_name: 'Electrónica',
            sale_price: 299,
            stock_quantity: 10,
          },
        ],
        meta: { page: 1, page_size: 24, total: 1 },
      },
    });
  });

  await page.route('**/api/v1/sales*', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        json: {
          success: true,
          data: {
            sale_id: 10,
            sale_number: 'SALE-1010',
          },
        },
      });
      return;
    }

    await route.fulfill({
      json: {
        success: true,
        data: [
          {
            sale_id: 1,
            sale_number: 'SALE-1001',
            sale_date: '2026-03-19T12:00:00Z',
            payment_method: 'efectivo',
            total_amount: 617,
            created_by_name: 'Ana Administradora',
          },
        ],
      },
    });
  });

  await page.goto('/login');
  await page.getByLabel('Correo electrónico').fill('admin@storepilot.local');
  await page.getByLabel('Contraseña').fill('Admin123!');
  await page.getByRole('button', { name: /entrar al sistema/i }).click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.getByRole('link', { name: /ventas/i }).click();
  await expect(page.getByRole('heading', { name: 'Ventas' })).toBeVisible();

  await page.getByRole('button', { name: /agregar al carrito/i }).click();
  await page.getByRole('button', { name: /registrar venta/i }).click();

  await expect(page.getByText(/venta registrada/i)).toBeVisible();
});
