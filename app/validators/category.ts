import vine from '@vinejs/vine';

const position = () => vine.number().withoutDecimals().min(0).max(2147483647);
const categoryType = () => vine.enum(['expense', 'income'] as const);

export const createCategoryValidator = vine.create({
  categoryGroupId: vine.number().withoutDecimals().positive(),
  name: vine.string().trim().minLength(2).maxLength(120),
  type: categoryType(),
  color: vine.string().trim().maxLength(20).nullable().optional(),
  icon: vine.string().trim().maxLength(50).nullable().optional(),
  position: position().optional(),
});

export const updateCategoryValidator = vine.create({
  categoryGroupId: vine.number().withoutDecimals().positive(),
  name: vine.string().trim().minLength(2).maxLength(120),
  type: categoryType(),
  color: vine.string().trim().maxLength(20).nullable().optional(),
  icon: vine.string().trim().maxLength(50).nullable().optional(),
  position: position(),
});
