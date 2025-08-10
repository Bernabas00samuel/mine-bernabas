import Image from 'next/image'
import Link from 'next/link'
import BookingForm from './components/BookingForm'
import { prisma } from './lib/prisma'

export const dynamic = 'force-dynamic'

type BookingFormRoomType = {
  id: string
  name: string
  maxGuests: number
  basePriceCents: number
}

export default async function Home() {
  const roomTypes = await prisma.roomType.findMany({ orderBy: { basePriceCents: 'asc' }, select: { id: true, name: true, maxGuests: true, basePriceCents: true } })

  return (
    <main>
      <section className="relative h-[70vh]">
        <Image src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop" alt="Hotel hero" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex items-center">
          <div className="text-white space-y-6">
            <h1 className="text-5xl md:text-6xl font-serif font-semibold">Where Elegance Meets Serenity</h1>
            <p className="max-w-2xl text-lg text-gray-200">Experience refined luxury in the heart of the city. Tailored stays, timeless design, and heartfelt hospitality.</p>
            <div className="flex gap-4">
              <Link href="#book" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md">Book your stay</Link>
              <Link href="/rooms" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-md">Explore rooms</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="book" className="relative -mt-16 z-20 max-w-5xl mx-auto px-6">
        <div className="rounded-2xl border bg-white/80 backdrop-blur shadow-2xl">
          <div className="p-6 md:p-10">
            <h2 className="text-2xl font-serif font-semibold mb-4">Reception & Reservations</h2>
            <p className="text-gray-600 mb-6">Reserve your room in moments. Our concierge will follow up to finalize every detail.</p>
            <BookingForm roomTypes={roomTypes as BookingFormRoomType[]} />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        {[{
          title: 'Artful Interiors',
          desc: 'Handcrafted furnishings and a palette inspired by the city\'s golden light.'
        }, {
          title: 'Culinary Journeys',
          desc: 'Seasonal menus that celebrate local producers and global flavors.'
        }, {
          title: 'Wellness, Elevated',
          desc: 'Skyline spa, hammam rituals, and a sunlit infinity pool.'
        }].map((h) => (
          <div key={h.title} className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="text-xl font-semibold">{h.title}</h3>
            <p className="text-gray-600 mt-2">{h.desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-serif font-semibold">Discover more</h2>
          <div className="flex gap-4">
            <Link href="/gallery" className="underline underline-offset-4">Gallery & Stories</Link>
            <Link href="/about" className="underline underline-offset-4">About us</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
