export async function register() {
  // Prevent unhandled rejections from crashing the server
  process.on('unhandledRejection', (reason) => {
    console.error('[Unhandled Rejection]', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('[Uncaught Exception]', error);
  });
}
