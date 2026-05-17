type CategoryType = {
  id: number;
  user_id: number;
  category_group_id: number;
  name: string;
  type: 'income' | 'expense';
};

type DbModule = {
  createSqliteKysely: () => { destroy: () => Promise<void> };
  createCategoriesRepository: (db: unknown) => {
    create: (payload: {
      user_id: number;
      category_group_id: number;
      name: string;
      type: 'income' | 'expense';
    }) => Promise<CategoryType>;
    listByUser: (
      userId: number,
      filters: {
        limit: number;
        offset: number;
        categoryGroupId?: number;
        type?: 'income' | 'expense';
      }
    ) => Promise<CategoryType[]>;
  };
};

async function loadDbModule(): Promise<DbModule> {
  const modulePath = '../../../../database/dist/index.js';
  return import(modulePath) as unknown as Promise<DbModule>;
}

export async function createLocalCategory(payload: {
  user_id: number;
  category_group_id: number;
  name: string;
  type: 'income' | 'expense';
}): Promise<CategoryType> {
  const dbModule = await loadDbModule();
  const db = dbModule.createSqliteKysely();
  try {
    const repo = dbModule.createCategoriesRepository(db);
    return await repo.create(payload);
  } finally {
    await db.destroy();
  }
}

export async function listLocalCategories(query: {
  user_id: number;
  page: number;
  page_size: number;
  category_group_id?: number;
  type?: 'income' | 'expense';
}): Promise<{ data: CategoryType[]; page: number; page_size: number; total: number }> {
  const dbModule = await loadDbModule();
  const db = dbModule.createSqliteKysely();
  try {
    const repo = dbModule.createCategoriesRepository(db);
    const limit = Math.max(query.page_size, 1);
    const offset = (Math.max(query.page, 1) - 1) * limit;
    const data = await repo.listByUser(query.user_id, {
      limit,
      offset,
      ...(query.category_group_id !== undefined
        ? { categoryGroupId: query.category_group_id }
        : {}),
      ...(query.type !== undefined ? { type: query.type } : {})
    });
    return { data, page: Math.max(query.page, 1), page_size: limit, total: data.length };
  } finally {
    await db.destroy();
  }
}

