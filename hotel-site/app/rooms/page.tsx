import Image from 'next/image'
import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

function formatPrice(cents: number) {
  return (cents / 100).toFixed(0)
}

export default async function RoomsPage() {
  const roomTypes = await prisma.roomType.findMany({ orderBy: { basePriceCents: 'asc' } })
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-serif font-semibold mb-10">Our Rooms & Suites</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {roomTypes.map((rt) => (
          <div key={rt.id} className="rounded-2xl overflow-hidden border shadow-sm bg-white">
            <div className="relative h-56">
              <Image src={(rt.images as string[])[0] || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop'} alt={rt.name} fill className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold">{rt.name}</h3>
              <p className="text-gray-600 mt-2 line-clamp-3">{rt.description}</p>
              <p className="mt-3 font-medium">From ${formatPrice(rt.basePriceCents as unknown as number)} / night</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}