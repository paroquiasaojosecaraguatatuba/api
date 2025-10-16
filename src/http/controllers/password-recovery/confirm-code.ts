import { useConfirmCodeSchema } from '@/schemas/useConfirmCodeSchema';
import { getAppContext } from '@/http/utils/getAppContext';

export const confirmCode: ControllerFn = async (c) => {
  const { daf, inputs, t } = getAppContext(c);

  const validationSchema = useConfirmCodeSchema(t);

  const { email, code } = validationSchema.parse(inputs);

  const user = await daf.user.findByEmail(email, c);

  if (!user) {
    return c.json({ message: t('resource-not-found') }, 400);
  }

  const passwordRecovery = await daf.passwordRecovery.findByUserId(user.id, c);

  if (!passwordRecovery) {
    return c.json({ message: t('resource-not-found') }, 400);
  }

  const isValidCode = passwordRecovery.code === code;

  if (!isValidCode) {
    return c.json({ message: t('invalid-code') }, 400);
  }

  return c.json({});
};
