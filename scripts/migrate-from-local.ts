// Run with: DATABASE_URL="file:./dev.db" npx ts-node scripts/migrate-from-local.ts
import { localRepo } from '../lib/repos/localStorageRepo'

async function run() {
  // dynamic import to avoid requiring prisma in the app runtime
  // use ESM dynamic import so ts-node/esm can load this file
  const { dbRepo } = (await import('../lib/repos/dbRepo')) as { dbRepo: any }

  console.log('Loading data from localRepo...')
  const data = localRepo.loadAll()

  console.log(`Writing ${data.posts.length} posts, ${data.categories.length} categories, ${data.collections.length} collections to DB`)
  await dbRepo.saveAll(data)

  console.log('Done')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
