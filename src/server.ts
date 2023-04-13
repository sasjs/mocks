import appPromise from './app'

appPromise.then(async (app) => {
  const port = process.env.PORT || 5000

  app.listen(port, () => {
    process.logger.info(
      `⚡️[server]: Server is running at http://localhost:${port}`
    )
  })
})
