// Fail at startup rather than on the first sign-in.
export default defineNitroPlugin(() => {
  if (import.meta.dev) return;

  const secret = useRuntimeConfig().appSecret;
  if (!secret || secret.length < 32) {
    console.error(
      '[zeithub] NUXT_APP_SECRET must be set to at least 32 characters, ' +
        'e.g. the output of `openssl rand -base64 32`.'
    );
    process.exit(1);
  }
});
