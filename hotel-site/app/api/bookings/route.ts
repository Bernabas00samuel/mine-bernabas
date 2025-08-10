import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

function toDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) throw new Error('Invalid date')
  return d
}

export async function POST(req: NextRequest) {
  try {
    const { roomTypeId, checkInDate, checkOutDate, numGuests, guestName, guestEmail } = await req.json()

    if (!roomTypeId || !checkInDate || !checkOutDate || !guestName || !guestEmail || !numGuests) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const checkIn = toDate(checkInDate)
    const checkOut = toDate(checkOutDate)
    if (checkOut <= checkIn) {
      return NextResponse.json({ error: 'checkOut must be after checkIn' }, { status: 400 })
    }

    const type = await prisma.roomType.findUnique({ where: { id: roomTypeId } })
    if (!type) return NextResponse.json({ error: 'Invalid room type' }, { status: 404 })
    if (numGuests > type.maxGuests) {
      return NextResponse.json({ error: `Max guests for this room is ${type.maxGuests}` }, { status: 400 })
    }

    const rooms = await prisma.room.findMany({ where: { typeId: roomTypeId }, orderBy: { roomNumber: 'asc' } })

    for (const room of rooms) {
      const conflict = await prisma.booking.findFirst({
        where: {
          roomId: room.id,
          NOT: [
            { checkOutDate: { lte: checkIn } },
            { checkInDate: { gte: checkOut } }
          ],
          status: { in: ['PENDING', 'CONFIRMED'] }
        }
      })
      if (!conflict) {
        const booking = await prisma.booking.create({
          data: {
            roomId: room.id,
            guestName,
            guestEmail,
            numGuests,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            status: 'PENDING'
          }
        })
        return NextResponse.json({ booking })
      }
    }

    return NextResponse.json({ error: 'No availability for selected dates' }, { status: 409 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}