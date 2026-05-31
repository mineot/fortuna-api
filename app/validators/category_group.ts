import vine from '@vinejs/vine';

const position = () => vine.number().withoutDecimals().min(0).max(2147483647);

export const createCategoryGroupValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120),
  position: position().optional(),
});

export const updateCategoryGroupValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120),
  position: position(),
});
