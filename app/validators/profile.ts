import vine from '@vinejs/vine';

export function updateProfileValidator(userId: number) {
  return vine.create({
    fullName: vine.string().nullable(),
    email: vine
      .string()
      .email()
      .maxLength(254)
      .unique(async (db, value) => {
        const row = await db
          .query()
          .from('users')
          .where('email', value)
          .whereNot('id', userId)
          .first();
        return !row;
      }),
    currentPassword: vine.string().optional(),
    newPassword: vine
      .string()
      .minLength(8)
      .maxLength(32)
      .confirmed({
        as: 'newPasswordConfirmation',
      })
      .optional(),
  });
}
