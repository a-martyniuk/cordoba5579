"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";

interface CalendarWidgetProps {
  pricePerNight?: number;
  cleaningFee?: number;
  whatsAppPhone?: string;
  airbnbUrl?: string;
}

export default function CalendarWidget({
  pricePerNight = 45,
  cleaningFee = 15,
  whatsAppPhone = "5491131018899", // Placeholder phone, user can change later
  airbnbUrl = "https://www.airbnb.com" // Placeholder URL
}: CalendarWidgetProps) {
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<number>(2);
  const [totalNights, setTotalNights] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      const diffTime = outDate.getTime() - inDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setTotalNights(diffDays);
        setTotalPrice(diffDays * pricePerNight + cleaningFee);
      } else {
        setTotalNights(0);
        setTotalPrice(0);
      }
    } else {
      setTotalNights(0);
      setTotalPrice(0);
    }
  }, [checkIn, checkOut, pricePerNight, cleaningFee]);

  const handleWhatsAppRedirect = () => {
    if (!checkIn || !checkOut) {
      alert("Por favor, selecciona las fechas de Check-In y Check-Out.");
      return;
    }
    
    const formattedCheckIn = new Date(checkIn).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    const formattedCheckOut = new Date(checkOut).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    const message = `Hola! Quería consultar disponibilidad para el departamento de Córdoba 5579 desde el ${formattedCheckIn} hasta el ${formattedCheckOut} para ${guests} ${guests === 1 ? "huésped" : "huéspedes"}.`;
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${whatsAppPhone}?text=${encodedMessage}`;
    window.open(waUrl, "_blank");
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 shadow-lg shadow-neutral-100 sticky top-28">
      {/* Price Header */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <span className="text-2xl font-semibold text-neutral-900">${pricePerNight}</span>
          <span className="text-neutral-500 text-sm"> / noche</span>
        </div>
        <div className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
          Directo sin comisiones
        </div>
      </div>

      {/* Date & Guest Inputs */}
      <div className="space-y-4 mb-6">
        <div className="border border-[#EFEBE4] rounded-2xl overflow-hidden divide-y divide-[#EFEBE4]">
          <div className="grid grid-cols-2 divide-x divide-[#EFEBE4]">
            <div className="p-3.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                CHECK-IN
              </label>
              <div className="flex items-center text-neutral-800">
                <input
                  type="date"
                  min={getTodayString()}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-sm font-medium bg-transparent focus:outline-none border-none cursor-pointer"
                />
              </div>
            </div>
            <div className="p-3.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                CHECK-OUT
              </label>
              <div className="flex items-center text-neutral-800">
                <input
                  type="date"
                  min={checkIn || getTodayString()}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-sm font-medium bg-transparent focus:outline-none border-none cursor-pointer"
                />
              </div>
            </div>
          </div>
          
          <div className="p-3.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              HUÉSPEDES
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-800">
                {guests} {guests === 1 ? "Huésped" : "Huéspedes"}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-neutral-800 active:scale-95 transition-all text-lg font-medium"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setGuests(Math.min(2, guests + 1))}
                  className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-neutral-800 active:scale-95 transition-all text-lg font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleWhatsAppRedirect}
          className="w-full bg-[#5F6F52] hover:bg-[#4F5D43] text-white py-4 px-6 rounded-2xl font-medium shadow-md shadow-neutral-100 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Reservar por WhatsApp</span>
        </button>

        <a
          href={airbnbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full border border-neutral-200 hover:border-neutral-800 text-neutral-800 py-3.5 px-6 rounded-2xl font-medium flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
        >
          <span>Ver publicación en Airbnb</span>
          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-800" />
        </a>
      </div>

      {/* Price Breakdown */}
      {totalNights > 0 && (
        <div className="mt-6 pt-6 border-t border-[#EFEBE4] space-y-3 text-sm text-neutral-600">
          <div className="flex justify-between">
            <span className="underline decoration-dotted">
              ${pricePerNight} x {totalNights} noches
            </span>
            <span className="font-medium text-neutral-800">${pricePerNight * totalNights}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline decoration-dotted">Limpieza</span>
            <span className="font-medium text-neutral-800">${cleaningFee}</span>
          </div>
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Comisión de canal directo</span>
            <span>$0</span>
          </div>
          
          <div className="border-t border-[#EFEBE4] pt-4 mt-2 flex justify-between text-base font-bold text-neutral-900">
            <span>Total estimado</span>
            <span>${totalPrice}</span>
          </div>
          
          <p className="text-[10px] text-center text-neutral-400 mt-2">
            El precio no incluye extras del bar. La reserva se confirma directamente por WhatsApp.
          </p>
        </div>
      )}
    </div>
  );
}
