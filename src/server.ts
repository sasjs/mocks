import appPromise from "./app";

appPromise.then(async (app) => {
  const port = process.env.PORT || 5000;
  const MOCK_SERVER_TYPE = process.env.MOCK_SERVER_TYPE;

  app.listen(port, () => {
    process.logger.info(
      `⚡️[server]: Server is running at http://localhost:${port}`
    );
    process.logger.info(
      `⚡️[server]: Mocking server type: ${MOCK_SERVER_TYPE}`
    );
  });
});
