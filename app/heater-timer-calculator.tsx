'use client'

import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function calculateHeaterClockTime(currentTime: Date, desiredTime: Date, heaterStartTime: Date) {
    const parseDate = (date: Date) => date.getHours() * 60 + date.getMinutes()

    const formatTime = (totalMinutes: number) => {
        const hours24 = Math.floor(totalMinutes / 60) % 24
        const minutes = totalMinutes % 60
        const meridian = hours24 >= 12 ? 'PM' : 'AM'
        let hours12 = hours24 % 12
        if (hours12 === 0) hours12 = 12
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${meridian}`
    }

    const currentMinutes = parseDate(currentTime)
    const desiredMinutes = parseDate(desiredTime)
    const heaterStartMinutes = parseDate(heaterStartTime)

    const offset = (desiredMinutes - currentMinutes + 24 * 60) % (24 * 60)
    const heaterClockMinutes = (heaterStartMinutes - offset + 24 * 60) % (24 * 60)

    return formatTime(heaterClockMinutes)
}

export default function HeaterTimerCalculator() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [expectedStartTime, setExpectedStartTime] = useState<Date | null>(null)
    const [heaterStartTime, setHeaterStartTime] = useState(() => {
        const defaultStart = new Date()
        defaultStart.setHours(1, 30, 0, 0)
        return defaultStart
    })

    const [result, setResult] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (currentTime && expectedStartTime && heaterStartTime) {
            if (currentTime > expectedStartTime) {
                setError('Expected time must be in the future.')
                setResult(null)
                return
            }
            const heaterClockTime = calculateHeaterClockTime(currentTime, expectedStartTime, heaterStartTime)
            setResult(heaterClockTime)
            setError(null)
        } else {
            setResult(null)
        }
    }, [currentTime, expectedStartTime, heaterStartTime])

    return (
        <div className="min-h-screen bg-black text-[#f5f5f7] flex items-center justify-center px-6 py-10 font-sans">
            <div className="w-full max-w-xl space-y-12">
                <h1 className="text-4xl font-semibold tracking-tight">Heater Timer</h1>

                <div className="space-y-6">
                    <Field label="Current Time">
                        <DatePicker
                            selected={currentTime}
                            onChange={(date) => setCurrentTime(date!)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={5}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="w-full bg-transparent text-lg text-[#f5f5f7] px-0 py-2 border-b border-[#3a3a3c] focus:outline-none"
                        />
                    </Field>

                    <Field label="Expected Start Time">
                        <DatePicker
                            selected={expectedStartTime}
                            onChange={(date) => setExpectedStartTime(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={5}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            placeholderText="Pick a time"
                            className="w-full bg-transparent text-lg text-[#f5f5f7] px-0 py-2 border-b border-[#3a3a3c] focus:outline-none"
                        />
                    </Field>

                    <Field label="Heater Start Time">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    const newDate = new Date(heaterStartTime)
                                    newDate.setHours(1, 30, 0, 0)
                                    setHeaterStartTime(newDate)
                                }}
                                className={`px-4 py-2 rounded border transition-colors font-medium text-lg ${heaterStartTime.getHours() === 1
                                        ? 'bg-amber-400 text-black border-amber-400'
                                        : 'bg-transparent text-[#f5f5f7] border-[#3a3a3c] hover:bg-[#232325]'
                                    }`}
                            >
                                1:30 AM
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const newDate = new Date(heaterStartTime)
                                    newDate.setHours(0, 30, 0, 0)
                                    setHeaterStartTime(newDate)
                                }}
                                className={`px-4 py-2 rounded border transition-colors font-medium text-lg ${heaterStartTime.getHours() === 0
                                        ? 'bg-amber-400 text-black border-amber-400'
                                        : 'bg-transparent text-[#f5f5f7] border-[#3a3a3c] hover:bg-[#232325]'
                                    }`}
                            >
                                12:30 AM
                            </button>
                        </div>
                    </Field>

                    {error && (
                        <div className="text-amber-500 text-base font-medium">{error}</div>
                    )}

                    {!error && result && (
                        <div className="pt-6">
                            <h2 className="text-base uppercase text-[#a1a1a3] mb-1">Set Heater Clock To</h2>
                            <div className="text-5xl font-semibold text-amber-400 tracking-tight">
                                {result}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            if (currentTime && expectedStartTime && heaterStartTime) {
                                const heaterClockTime = calculateHeaterClockTime(
                                    currentTime,
                                    expectedStartTime,
                                    heaterStartTime
                                )
                                setResult(heaterClockTime)
                                setError(null)
                            }
                        }}
                        disabled={!currentTime || !expectedStartTime}
                        className="w-full bg-amber-400 text-black text-lg font-semibold py-3 transition-colors hover:bg-amber-300 disabled:opacity-30"
                    >
                        Calculate
                    </button>
                </div>
            </div>
        </div>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm uppercase tracking-wide text-[#a1a1a3] font-medium">
                {label}
            </label>
            {children}
        </div>
    )
}
