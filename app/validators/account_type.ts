import vine from '@vinejs/vine';

export const createAccountTypeValidator = vine.create({
  termKey: vine.string().trim().minLength(3).maxLength(180),
  description: vine.string().trim().maxLength(2000).nullable(),
});

export const updateAccountTypeValidator = vine.create({
  termKey: vine.string().trim().minLength(3).maxLength(180),
  description: vine.string().trim().maxLength(2000).nullable(),
});
