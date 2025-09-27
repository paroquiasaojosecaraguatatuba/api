export const logWithConsole = async ({
  data,
  error,
  env,
}: {
  data: object;
  error?: unknown;
  env: Bindings;
}) => {
  const now = new Date().toLocaleString("pt-BR", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "America/Sao_Paulo",
  });

  const errorObject =
    error instanceof Error
      ? { message: error.message, stack: error.stack }
      : String(error);

  const log = {
    data,
    error: errorObject,
  };

  console.log(`🚨 **Error on API [${env.ENVIRONMENT.toUpperCase()}]**\n${now}`);
  console.log(JSON.stringify(log, null, 2));
};