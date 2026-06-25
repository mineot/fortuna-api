import vine from '@vinejs/vine';

export const updateSettingValidator = vine.create({
  locale: vine.string().trim().in(['en-US', 'pt-BR']),
  currency: vine.string().trim().minLength(1).maxLength(10),
  timezone: vine.string().trim().minLength(1).maxLength(50),
});
