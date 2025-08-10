import Image from 'next/image'
import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  const [images, stories] = await Promise.all([
    prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.story.findMany({ orderBy: { publishedAt: 'desc' } })
  ])

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
      <section>
        <h1 className="text-4xl font-serif font-semibold mb-6">Gallery</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="relative h-64 rounded-xl overflow-hidden shadow">
              <Image src={img.url} alt={img.caption} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-serif font-semibold mb-6">Stories</h2>
        <div className="grid md:grid-cols-2 gap-10">
          {stories.map((s) => (
            <article key={s.id} className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="text-gray-600 mt-2">{s.content}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}