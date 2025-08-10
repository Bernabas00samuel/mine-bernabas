"use client"

import { useEffect, useMemo, useState } from 'react'

type RoomType = {
  id: string
  name: string
  maxGuests: number
  basePriceCents: number
}

export default function BookingForm({ roomTypes }: { roomTypes: RoomType[] }) {
  const [roomTypeId, setRoomTypeId] = useState(roomTypes[0]?.id ?? '')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [numGuests, setNumGuests] = useState(1)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [available, setAvailable] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const selectedType = useMemo(() => roomTypes.find((r) => r.id === roomTypeId), [roomTypeId, roomTypes])

  useEffect(() => {
    setAvailable(null)
    setMessage(null)
  }, [roomTypeId, checkInDate, checkOutDate])

  async function checkAvailability() {
    setMessage(null)
    if (!roomTypeId || !checkInDate || !checkOutDate) return
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomTypeId, checkInDate, checkOutDate })
    })
    const data = await res.json()
    setAvailable(data.available ?? 0)
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomTypeId, guestName, guestEmail, numGuests, checkInDate, checkOutDate })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to book')
      setMessage('Booking request received! We\'ll confirm shortly.')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setMessage(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submitBooking} className="grid gap-4 p-6 bg-white/70 backdrop-blur rounded-xl shadow-xl">
      <div>
        <label className="block text-sm font-semibold">Room Type</label>
        <select className="mt-1 w-full rounded-md border px-3 py-2" value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)}>
          {roomTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>{rt.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold">Check-in</label>
          <input type="date" className="mt-1 w-full rounded-md border px-3 py-2" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold">Check-out</label>
          <input type="date" className="mt-1 w-full rounded-md border px-3 py-2" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold">Guests</label>
          <input type="number" min={1} max={selectedType?.maxGuests ?? 5} className="mt-1 w-full rounded-md border px-3 py-2" value={numGuests} onChange={(e) => setNumGuests(Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm font-semibold">Email</label>
          <input type="email" className="mt-1 w-full rounded-md border px-3 py-2" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold">Full Name</label>
        <input className="mt-1 w-full rounded-md border px-3 py-2" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={checkAvailability} className="rounded-md bg-black text-white px-4 py-2">Check availability</button>
        <button disabled={submitting} className="rounded-md bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 disabled:opacity-50">{submitting ? 'Submitting…' : 'Book now'}</button>
        {available !== null && <span className="text-sm text-gray-700">{available} rooms available</span>}
      </div>
      {message && <p className="text-sm text-rose-600">{message}</p>}
    </form>
  )
}