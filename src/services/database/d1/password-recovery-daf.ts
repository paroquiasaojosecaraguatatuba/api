import { PasswordRecoveryDAF } from '../password-recovery-daf';

export const passwordRecoveryDAF: PasswordRecoveryDAF = {
  findByUserId: async (userId: string, c: DomainContext) => {
    const passwordRecovery = await c.env.DB.prepare(
      'SELECT id, user_id, code, created_at FROM password_recoveries WHERE user_id = ?',
    )
      .bind(userId)
      .first<{
        id: string;
        user_id: string;
        code: string;
        created_at: string;
      }>();

    if (!passwordRecovery) {
      return null;
    }

    return {
      id: passwordRecovery.id,
      userId: passwordRecovery.user_id,
      code: passwordRecovery.code,
      createdAt: passwordRecovery.created_at,
    };
  },
};
