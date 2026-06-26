"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";

interface CalendarWidgetProps {
  pricePerNight?: number;
  cleaningFee?: number;
  whatsAppPhone?: string;
  airbnbUrl?: string;
  lang?: "es" | "en";
}

export default function CalendarWidget({
  pricePerNight = 45,
  cleaningFee = 15,
  whatsAppPhone = "5491145379500",
  airbnbUrl = "https://www.airbnb.com.ar/rooms/1716762976739155303",
  lang = "es"
}: CalendarWidgetProps) {
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<number>(2);
  const [totalNights, setTotalNights] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [hasConflict, setHasConflict] = useState<boolean>(false);

  const t = {
    es: {
      perNight: " / noche",
      direct: "Directo sin comisiones",
      capacityBase: "👥 Capacidad Base:",
      base2: "2 huéspedes",
      extraGuest: "➕ Huésped adicional:",
      extraCost: "USD 10 / noche",
      cleaning: "🧹 Limpieza:",
      once: `USD ${cleaningFee} (pago único)`,
      checkin: "CHECK-IN",
      checkout: "CHECK-OUT",
      guestsLabel: "HUÉSPEDES",
      guest: "Huésped",
      guests: "Huéspedes",
      bookBtn: "Reservar por WhatsApp",
      airbnbBtn: "Ver publicación en Airbnb",
      nights: "noches",
      baseGuests: "base 2 huéspedes",
      extraGuestsLabel: "Huéspedes extra",
      cleaningLabel: "Limpieza",
      commission: "Comisión de canal directo",
      totalEst: "Total estimado",
      barNote: "El precio no incluye extras del bar. La reserva se confirma directamente por WhatsApp.",
      alertDates: "Por favor, selecciona las fechas de Check-In y Check-Out.",
      waMsg: (inD: string, outD: string, g: number) => `Hola! Quería consultar disponibilidad para el departamento de Córdoba 5579 desde el ${inD} hasta el ${outD} para ${g} ${g === 1 ? "huésped" : "huéspedes"}.`,
      conflictWarning: "⚠️ Las fechas seleccionadas ya están reservadas en Airbnb. Consultá de todas formas si querés verificar disponibilidad especial."
    },
    en: {
      perNight: " / night",
      direct: "Direct Booking - No Fees",
      capacityBase: "👥 Base Capacity:",
      base2: "2 guests",
      extraGuest: "➕ Extra guest:",
      extraCost: "USD 10 / night",
      cleaning: "🧹 Cleaning:",
      once: `USD ${cleaningFee} (one-time fee)`,
      checkin: "CHECK-IN",
      checkout: "CHECK-OUT",
      guestsLabel: "GUESTS",
      guest: "Guest",
      guests: "Guests",
      bookBtn: "Book via WhatsApp",
      airbnbBtn: "View Airbnb Listing",
      nights: "nights",
      baseGuests: "base 2 guests",
      extraGuestsLabel: "Extra guests",
      cleaningLabel: "Cleaning",
      commission: "Direct booking commission",
      totalEst: "Estimated total",
      barNote: "Price does not include bar extras. Booking is confirmed directly via WhatsApp.",
      alertDates: "Please select your Check-In and Check-Out dates.",
      waMsg: (inD: string, outD: string, g: number) => `Hi! I would like to inquire about availability for the apartment at Cordoba 5579 from ${inD} to ${outD} for ${g} ${g === 1 ? "guest" : "guests"}.`,
      conflictWarning: "⚠️ Selected dates are already booked on Airbnb. Feel free to inquire anyway for special availability."
    }
  }[lang];

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch("/cordoba5579/api/availability");
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.blockedDates)) {
            setBlockedDates(data.blockedDates);
          }
        }
      } catch (err) {
        console.error("Error fetching availability:", err);
      }
    }
    fetchAvailability();
  }, []);

  useEffect(() => {
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      const diffTime = outDate.getTime() - inDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setTotalNights(diffDays);
        const extraGuests = Math.max(0, guests - 2);
        const extraGuestCostPerNight = 10;
        const total = (diffDays * pricePerNight) + (diffDays * extraGuests * extraGuestCostPerNight) + cleaningFee;
        setTotalPrice(total);

        // Check for date conflict
        let conflict = false;
        const current = new Date(inDate);
        while (current < outDate) {
          const dateStr = current.toISOString().split("T")[0];
          if (blockedDates.includes(dateStr)) {
            conflict = true;
            break;
          }
          current.setDate(current.getDate() + 1);
        }
        setHasConflict(conflict);
      } else {
        setTotalNights(0);
        setTotalPrice(0);
        setHasConflict(false);
      }
    } else {
      setTotalNights(0);
      setTotalPrice(0);
      setHasConflict(false);
    }
  }, [checkIn, checkOut, pricePerNight, cleaningFee, guests, blockedDates]);

  const handleWhatsAppRedirect = () => {
    if (!checkIn || !checkOut) {
      alert(t.alertDates);
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

    const conflictMsg = hasConflict ? " (Nota: Airbnb indica que estas fechas pueden estar ocupadas)" : "";
    const message = t.waMsg(formattedCheckIn, formattedCheckOut, guests) + conflictMsg;
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${whatsAppPhone}?text=${encodedMessage}`;
    window.open(waUrl, "_blank");
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="bg-white dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-3xl p-6 shadow-lg dark:shadow-none shadow-neutral-100 sticky top-28 transition-colors duration-300">
      {/* Price Header */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">${pricePerNight}</span>
            <span className="text-neutral-500 dark:text-neutral-450 text-sm">{t.perNight}</span>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full font-medium">
            {t.direct}
          </div>
        </div>
        <div className="bg-neutral-50 dark:bg-[#141613] rounded-xl p-2.5 border border-[#EFEBE4] dark:border-[#2C302A] text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1">
          <p className="flex justify-between">
            <span>{t.capacityBase}</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{t.base2}</span>
          </p>
          <p className="flex justify-between">
            <span>{t.extraGuest}</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{t.extraCost}</span>
          </p>
          <p className="flex justify-between">
            <span>{t.cleaning}</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{t.once}</span>
          </p>
        </div>
      </div>

      {/* Date & Guest Inputs */}
      <div className="space-y-4 mb-6">
        <div className="border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl overflow-hidden divide-y divide-[#EFEBE4] dark:divide-[#2C302A]">
          <div className="grid grid-cols-2 divide-x divide-[#EFEBE4] dark:divide-[#2C302A]">
            <div className="p-3.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                {t.checkin}
              </label>
              <div className="flex items-center text-neutral-800 dark:text-neutral-200">
                <input
                  type="date"
                  min={getTodayString()}
                  value={checkIn}
                  onChange={(e) => {
                    const newIn = e.target.value;
                    setCheckIn(newIn);
                    
                    // If Check-Out is before or equal to the new Check-In, set it to Check-In + 1 day
                    if (checkOut && newIn) {
                      const inD = new Date(newIn);
                      const outD = new Date(checkOut);
                      if (outD <= inD) {
                        const nextDay = new Date(inD);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setCheckOut(nextDay.toISOString().split("T")[0]);
                      }
                    }
                  }}
                  className="w-full text-sm font-medium bg-transparent focus:outline-none border-none cursor-pointer dark:[color-scheme:dark]"
                />
              </div>
            </div>
            <div className="p-3.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                {t.checkout}
              </label>
              <div className="flex items-center text-neutral-800 dark:text-neutral-200">
                <input
                  type="date"
                  min={checkIn ? (() => {
                    const inD = new Date(checkIn);
                    inD.setDate(inD.getDate() + 1);
                    return inD.toISOString().split("T")[0];
                  })() : getTodayString()}
                  value={checkOut}
                  onChange={(e) => {
                    const newOut = e.target.value;
                    setCheckOut(newOut);
                    
                    // Double check validation
                    if (checkIn && newOut) {
                      const inD = new Date(checkIn);
                      const outD = new Date(newOut);
                      if (outD <= inD) {
                        const nextDay = new Date(inD);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setCheckOut(nextDay.toISOString().split("T")[0]);
                      }
                    }
                  }}
                  className="w-full text-sm font-medium bg-transparent focus:outline-none border-none cursor-pointer dark:[color-scheme:dark]"
                />
              </div>
            </div>
          </div>
          
          <div className="p-3.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
              {t.guestsLabel}
            </label>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                {guests} {guests === 1 ? t.guest : t.guests}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:border-neutral-800 dark:hover:border-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95 transition-all text-lg font-medium"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setGuests(Math.min(4, guests + 1))}
                  className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:border-neutral-800 dark:hover:border-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95 transition-all text-lg font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasConflict && (
        <div className="mb-4 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/30 font-medium leading-relaxed">
          {t.conflictWarning}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleWhatsAppRedirect}
          className="w-full bg-[#5F6F52] hover:bg-[#4F5D43] text-white py-4 px-6 rounded-2xl font-medium shadow-md dark:shadow-none flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>{t.bookBtn}</span>
        </button>

        <a
          href={airbnbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full border border-neutral-200 dark:border-neutral-700 hover:border-neutral-800 dark:hover:border-neutral-450 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 py-3.5 px-6 rounded-2xl font-medium flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
        >
          <span>{t.airbnbBtn}</span>
          <ArrowRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-350" />
        </a>
      </div>

      {/* Price Breakdown */}
      {totalNights > 0 && (
        <div className="mt-6 pt-6 border-t border-[#EFEBE4] dark:border-[#2C302A] space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex justify-between">
            <span className="underline decoration-dotted">
              ${pricePerNight} x {totalNights} {t.nights} ({t.baseGuests})
            </span>
            <span className="font-medium text-neutral-800 dark:text-neutral-200">${pricePerNight * totalNights}</span>
          </div>
          {guests > 2 && (
            <div className="flex justify-between">
              <span className="underline decoration-dotted">
                {t.extraGuestsLabel} (USD 10 x {guests - 2} x {totalNights} {t.nights})
              </span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">${(guests - 2) * 10 * totalNights}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="underline decoration-dotted">{t.cleaningLabel}</span>
            <span className="font-medium text-neutral-800 dark:text-neutral-200">${cleaningFee}</span>
          </div>
          <div className="flex justify-between text-emerald-600 dark:text-emerald-450 font-medium">
            <span>{t.commission}</span>
            <span>$0</span>
          </div>
          
          <div className="border-t border-[#EFEBE4] dark:border-[#2C302A] pt-4 mt-2 flex justify-between text-base font-bold text-neutral-900 dark:text-neutral-100">
            <span>{t.totalEst}</span>
            <span>${totalPrice}</span>
          </div>
          
          <p className="text-[10px] text-center text-neutral-400 dark:text-neutral-500 mt-2">
            {t.barNote}
          </p>
        </div>
      )}
    </div>
  );
}
