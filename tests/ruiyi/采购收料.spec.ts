import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // 1. 访问登录页：等待网络空闲（确保页面完全加载）
  await page.goto('https://szrysjdmf.dfs.yelinksaas.com/#/login', {
    waitUntil: 'networkidle', // 等待网络请求完成（比默认load更稳）
    timeout: 60000 // 超时时间60秒
  });

  // 2. 账号输入框：等待可见后填充（无需额外click，fill会自动聚焦）
  const accountInput = page.getByRole('textbox', { name: '账号' });
  await expect(accountInput).toBeVisible({ timeout: 10000 }); // 智能等待元素可见
  await accountInput.fill('magl');

  // 3. 密码输入框：等待可见后填充（修复原代码重复click问题）
  const pwdInput = page.getByRole('textbox', { name: '密码' });
  await expect(pwdInput).toBeVisible();
  await pwdInput.fill('111890');

  // 4. 登录按钮：等待可点击后点击
  const loginBtn = page.getByRole('button', { name: '登录' });
  await expect(loginBtn).toBeEnabled(); // 等待按钮可交互
  await loginBtn.click();

  // 5. 采购收料：等待文本可见后点击（确保登录后页面加载完成）
  const purchaseText = page.getByText('采购收料');
  await expect(purchaseText).toBeVisible({ timeout: 15000 });
  await purchaseText.click();

  // 6. 关键：等待iframe加载完成（解决旧版本contentFrame无参问题）
  const iframeLocator = page.locator('#iframe');
  await iframeLocator.waitFor({ state: 'attached', timeout: 10000 }); // 等待iframe挂载到DOM
  const frame = await iframeLocator.contentFrame(); // 无参调用，适配旧版本
  if (!frame) throw new Error('iframe加载失败，无法获取contentFrame'); // 容错处理

  // 7. 新增按钮：等待可点击
  const addBtn = frame.getByRole('button', { name: '新增' });
  await expect(addBtn).toBeEnabled();
  await addBtn.click();

  // 8. 添加物料按钮：等待可点击
  const addMaterialBtn = frame.getByRole('button', { name: ' 添加物料' });
  await expect(addMaterialBtn).toBeEnabled();
  await addMaterialBtn.click();

  // 9. 搜索输入框：等待可见后填充
  const searchInput = frame.getByRole('textbox', { name: '搜索', exact: true });
  await expect(searchInput).toBeVisible();
  await searchInput.fill('测试'); // 无需额外click，fill会自动聚焦

  // 10. 搜索物料名称：等待文本可见后点击
  const searchText = frame.getByText('搜索物料名称');
  await expect(searchText).toBeVisible();
  await searchText.click();

  // 11. 物料复选框：等待可见后点击
 // 1. 定位目标行并滚动到可见
  const targetRow = frame.getByRole('row', { name: 'WL20250916002 产成品 测试物料2 生产品' });
  await targetRow.scrollIntoViewIfNeeded();
  await expect(targetRow).toBeVisible({ timeout: 10000 });

  // 2. 定位原生 checkbox 并点击（最稳定）
  const materialCheckbox = targetRow.locator('input[type="checkbox"]');
  await expect(materialCheckbox).toBeEnabled({ timeout: 10000 });
  await materialCheckbox.click();
  
  // 12. 选择并关闭按钮：等待可点击
  const selectCloseBtn = frame.getByRole('button', { name: '选择并关闭' });
  await selectCloseBtn.scrollIntoViewIfNeeded();
  await expect(selectCloseBtn).toBeEnabled({ timeout: 10000 });
  await selectCloseBtn.click();
  
  //手动滚动，正数=向右滚动，负数=向左滚动
  const horizontalScrollContainer = frame.locator('.el-table__body-wrapper');
  await horizontalScrollContainer.evaluate((el) => {
  el.scrollLeft += 800; 
});
  const targetInput = frame.getByRole('textbox', { name: '请输入' }).nth(3);
  await targetInput.scrollIntoViewIfNeeded(); // 横向滚动到视口
  await expect(targetInput).toBeVisible({ timeout: 10000 }); // 等待元素加载
  await targetInput.fill('100');
});