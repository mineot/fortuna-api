import vine from '@vinejs/vine';

export const createPayeeValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(160),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});

export const updatePayeeValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(160),
  notes: vine.string().trim().maxLength(5000).nullable().optional(),
});
