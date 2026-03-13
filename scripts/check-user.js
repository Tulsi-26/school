
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'shsolanki141+studentlogin@gmail.com'
  const user = await prisma.user.findUnique({
    where: { email },
    include: { organization: true }
  })
  
  if (user) {
    console.log('User found:', JSON.stringify(user, null, 2))
  } else {
    console.log('User NOT found with email:', email)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
