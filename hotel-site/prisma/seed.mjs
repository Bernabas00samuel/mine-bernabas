import { PrismaClient } from '../app/generated/prisma/index.js'

const prisma = new PrismaClient()

async function main() {
  const roomTypes = [
    {
      name: 'Presidential Suite',
      description: 'A lavish retreat with panoramic city views, private lounge access, and personalized butler service.',
      basePriceCents: 120000,
      maxGuests: 4,
      bedType: 'King',
      sizeSqm: 180,
      amenities: [
        'Private terrace',
        'Butler service',
        'In-room spa',
        'Grand piano',
        'Cinema room'
      ],
      images: [
        '/images/rooms/presidential-1.jpg',
        '/images/rooms/presidential-2.jpg'
      ]
    },
    {
      name: 'Executive Room',
      description: 'Elegant design with workspace, marble bathroom, and access to the executive lounge.',
      basePriceCents: 38000,
      maxGuests: 2,
      bedType: 'King',
      sizeSqm: 45,
      amenities: [
        'Executive lounge access',
        'Marble bathroom',
        'High-speed Wi-Fi',
        'In-room espresso'
      ],
      images: [
        '/images/rooms/executive-1.jpg',
        '/images/rooms/executive-2.jpg'
      ]
    },
    {
      name: 'Deluxe Suite',
      description: 'Spacious suite with separate living area, perfect for extended stays and families.',
      basePriceCents: 58000,
      maxGuests: 3,
      bedType: 'King + Sofa Bed',
      sizeSqm: 80,
      amenities: [
        'Separate living area',
        'Walk-in wardrobe',
        'Rain shower & soaking tub',
        'City skyline view'
      ],
      images: [
        '/images/rooms/deluxe-1.jpg',
        '/images/rooms/deluxe-2.jpg'
      ]
    }
  ]

  const createdTypes = []
  for (const rt of roomTypes) {
    const created = await prisma.roomType.create({
      data: rt
    })
    createdTypes.push(created)
  }

  let roomNumber = 101
  for (const [idx, type] of createdTypes.entries()) {
    const roomsPerType = idx === 0 ? 3 : idx === 1 ? 10 : 6
    for (let i = 0; i < roomsPerType; i++) {
      await prisma.room.create({
        data: {
          roomNumber: String(roomNumber++),
          floor: Math.floor(roomNumber / 100),
          typeId: type.id
        }
      })
    }
  }

  await prisma.galleryImage.createMany({
    data: [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop',
        caption: 'Sunlit infinity pool overlooking the bay'
      },
      {
        url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1600&auto=format&fit=crop',
        caption: 'Grand lobby with crystal chandelier'
      },
      {
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop',
        caption: 'Presidential suite living room'
      }
    ]
  })

  await prisma.story.createMany({
    data: [
      {
        title: 'A Legacy of Timeless Luxury',
        content:
          'Founded in 1926, our hotel has hosted dignitaries, artists, and dreamers from around the world. Each marble corridor whispers tales of celebration and serenity.',
        imageUrl:
          'https://images.unsplash.com/photo-1501117716987-c8e3fda0fd1c?q=80&w=1600&auto=format&fit=crop'
      },
      {
        title: 'Crafted for the Senses',
        content:
          'From hand-loomed Egyptian cotton to bespoke fragrances, every detail has been curated to delight the senses and restore balance.',
        imageUrl:
          'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1600&auto=format&fit=crop'
      }
    ]
  })

  console.log('Seeded database successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })