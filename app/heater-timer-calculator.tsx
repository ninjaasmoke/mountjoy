'use client'

import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

// Import the CSS for react-datepicker
import 'react-datepicker/dist/react-datepicker.css'

function calculateHeaterClockTime(currentTime: Date, desiredTime: Date) {
    const parseDate = (date: Date) => {
        return date.getHours() * 60 + date.getMinutes()
    }

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

    // Calculate the time difference in minutes (accounting for wrapping around midnight)
    const offset = (desiredMinutes - currentMinutes + 24 * 60) % (24 * 60)

    // Heater starts at 12:30 AM, which is 30 minutes past midnight
    const heaterStartMinutes = 30 // 12:30 AM in minutes

    // Calculate what to set the heater clock to
    const heaterClockMinutes = (heaterStartMinutes - offset + 24 * 60) % (24 * 60)

    return formatTime(heaterClockMinutes)
}

export default function HeaterTimerCalculator() {
    const [currentTime, setCurrentTime] = useState<Date | null>(new Date())
    const [expectedStartTime, setExpectedStartTime] = useState<Date | null>(null)
    const [result, setResult] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (currentTime && expectedStartTime) {
            if (currentTime > expectedStartTime) {
                setError('expected start time must be in the future')
                return
            }
            const heaterClockTime = calculateHeaterClockTime(currentTime, expectedStartTime)
            setResult(heaterClockTime)
        } else {
            setResult(null)
        }
    }, [currentTime, expectedStartTime])

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-2 border-black">
                <CardContent className="space-y-6 p-6">
                    <h1 className="text-3xl font-bold text-center text-black uppercase">Heater Timer</h1>

                    <div className="w-full">
                        <Label htmlFor="current-time" className="text-sm font-medium text-black">
                            Current Time
                        </Label>
                        <DatePicker
                            id="current-time"
                            selected={currentTime}
                            onChange={(date: Date | null) => setCurrentTime(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={5}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="w-full p-2 border-2 border-black focus:ring-2 focus:ring-black focus:border-black"
                        />
                    </div>

                    <div className="w-full">
                        <Label htmlFor="expected-start-time" className="text-sm font-medium text-black">
                            Expected Start Time
                        </Label>
                        <DatePicker
                            id="expected-start-time"
                            selected={expectedStartTime}
                            onChange={(date: Date | null) => setExpectedStartTime(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={5}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="w-full p-2 border-2 border-black focus:ring-2 focus:ring-black focus:border-black"
                        />
                    </div>

                    {error && (
                        <>
                            <h2 className="text-red-500 text-xl font-bold">CAN&apos;T GO BACK IN TIME!</h2>
                            <div className="text-red-500 text-sm">{error}</div>
                        </>
                    )}

                    {!error && result && (
                        <div className="mt-8 text-center">
                            <h2 className="text-xl font-bold text-black uppercase mb-2">Set Heater Clock To:</h2>
                            <div className="text-6xl font-bold text-black border-2 border-black p-4">{result}</div>
                        </div>
                    )}

                    <Button
                        onClick={() => {
                            if (currentTime && expectedStartTime) {
                                const heaterClockTime = calculateHeaterClockTime(currentTime, expectedStartTime)
                                setResult(heaterClockTime)
                            }
                        }}
                        className="w-full bg-black text-white hover:bg-[gray] transition-colors button"
                        disabled={!currentTime || !expectedStartTime}
                    >
                        Calculate
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

