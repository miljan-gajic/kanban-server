import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      hash: '$argon2id$v=19$m=65536,t=3,p=4$3rmVcc7FrXGDsTq6FhP/nA$seSWPMdgEV5vnzknbQ7/HTnGsmG0gCrf3CZI3c8XDC8',
      tasks: {
        create: [
          {
            title: 'Grab a coffee',
            description: 'Get a coffee from your favorite coffee shop',
          },
          {
            title: 'Watch a movie',
            description: 'Go watch a movie that you often talk about',
            subtasks: {
              create: [
                {
                  title: 'Buy pop-corn and soda',
                  description:
                    'Get there few mins early and buy something to eat and drink',
                },
              ],
            },
          },
          {
            title: 'Read a book',
            description: 'Go buy a book that you love so much',
            status: 'IN_PROGRESS',
          },
        ],
      },
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      hash: '$argon2id$v=19$m=65536,t=3,p=4$3rmVcc7FrXGDsTq6FhP/nA$seSWPMdgEV5vnzknbQ7/HTnGsmG0gCrf3CZI3c8XDC8',
      tasks: {
        create: [
          {
            title: 'Buy a video game',
            description:
              'Check the online review for Diablo IV and buy the game if it is really that good',
          },
          {
            title: 'Buy a new phone',
            description:
              'Decide to buy either Samsung foldable or newest iPhone',
          },
          {
            title: 'Make you favorite meal',
            description: 'See some online recipes for your dish',
          },
          {
            title: 'Dockerize the app',
            description: 'Dockerize the entire app and not only the db',
            subtasks: {
              create: [
                {
                  title: 'Dockerize NestJS',
                  description: 'Dockerize NestJS and all services there',
                },
                {
                  title: 'Dockerize SolidJS app',
                  description:
                    'Dockerize SolidJS app and all services there, it should be like react app',
                },
              ],
            },
          },
        ],
      },
    },
  });
  const simo = await prisma.user.upsert({
    where: { email: 'simo.matavulj@prisma.io' },
    update: {},
    create: {
      email: 'simo.matavulj@prisma.io',
      hash: '$argon2id$v=19$m=65536,t=3,p=4$3rmVcc7FrXGDsTq6FhP/nA$seSWPMdgEV5vnzknbQ7/HTnGsmG0gCrf3CZI3c8XDC8',
      firstName: 'Simo',
      lastName: 'Matavulj',
      role: 'ADMIN',
      tasks: {
        create: [
          {
            title: 'Buy a video game',
            description:
              'Check the online review for Diablo IV and buy the game if it is really that good',
          },
          {
            title: 'Buy a new phone',
            description:
              'Decide to buy either Samsung foldable or newest iPhone',
            subtasks: {
              create: [
                {
                  title:
                    'See if this one is any better than Samsung equivalent',
                  description:
                    'The new Samsung Fold and Flip are really good so check to see if those are any better than new iPhone',
                },
              ],
            },
          },
          {
            title: 'Make you favorite meal',
            description: 'See some online recipes for your dish',
          },
          {
            title: 'Dockerize the app',
            description: 'Dockerize the entire app and not only the db',
            subtasks: {
              create: [
                {
                  title: 'Dockerize NestJS',
                  description: 'Dockerize NestJS and all services there',
                },
                {
                  title: 'Dockerize SolidJS app',
                  description:
                    'Dockerize SolidJS app and all services there, it should be like react app',
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log({ alice, bob, simo });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
