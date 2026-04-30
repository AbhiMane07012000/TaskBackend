const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const plans = [
    {
      name: 'FREE',
      price: 0,
      billingCycle: 'MONTHLY',
      maxProjects: 3,
      maxMembers: 5,
      maxTasks: 1500,
    },
    {
      name: 'PRO',
      price: 399,
      billingCycle: 'MONTHLY',
      maxProjects: 20,
      maxMembers: 10,
      maxTasks: 3000,
    },
    {
      name: 'PREMIUM',
      price: 799,
      billingCycle: 'MONTHLY',
      maxProjects: -1,
      maxMembers: -1,
      maxTasks: -1,
    },
  ]

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {},
      create: plan,
    })
    console.log(`Seeded plan: ${plan.name}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })