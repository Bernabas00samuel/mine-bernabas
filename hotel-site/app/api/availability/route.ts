import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

function toDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) throw new Error('Invalid date')
  return d
}

export async function POST(req: NextRequest) {
  try {
    const { roomTypeId, checkInDate, checkOutDate } = await req.json()
    if (!roomTypeId || !checkInDate || !checkOutDate) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const checkIn = toDate(checkInDate)
    const checkOut = toDate(checkOutDate)
    if (checkOut <= checkIn) {
      return NextResponse.json({ error: 'checkOut must be after checkIn' }, { status: 400 })
    }

    const roomsOfType = await prisma.room.count({ where: { typeId: roomTypeId } })

    const overlappingBookings = await prisma.booking.groupBy({
      by: ['roomId'],
      where: {
        room: { typeId: roomTypeId },
        NOT: [
          { checkOutDate: { lte: checkIn } },
          { checkInDate: { gte: checkOut } }
        ],
        status: { in: ['PENDING', 'CONFIRMED'] }
      },
      _count: { _all: true }
    })

    const unavailableCount = overlappingBookings.length
    const available = Math.max(roomsOfType - unavailableCount, 0)

    return NextResponse.json({ available })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}