import vine from '@vinejs/vine';

export const createAccountTypeValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120),
  description: vine.string().trim().maxLength(2000).nullable().optional(),
});

export const updateAccountTypeValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120),
  description: vine.string().trim().maxLength(2000).nullable().optional(),
});
