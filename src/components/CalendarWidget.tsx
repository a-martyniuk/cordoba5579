"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, ArrowRight, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface CalendarWidgetProps {
  whatsAppPhone?: string;
  airbnbUrl?: string;
  lang?: "es" | "en";
}

export default function CalendarWidget({
  whatsAppPhone = "5491145379500",
  airbnbUrl = "https://www.airbnb.com.ar/rooms/1716762976739155303",
  lang = "es"
}: CalendarWidgetProps) {
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const t = {
    es: {
      perNight: " / noche",
      availabilityTitle: "Calendario de Disponibilidad",
      booked: "Ocupado",
      available: "Disponible",
      bookBtn: "Reservar en Airbnb",
      waBtn: "Consultar por WhatsApp",
      months: [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ],
      weekdays: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"],
      waMsg: "¡Hola! Estoy interesado en consultar disponibilidad para el departamento de Córdoba 5579."
    },
    en: {
      perNight: " / night",
      availabilityTitle: "Availability Calendar",
      booked: "Booked",
      available: "Available",
      bookBtn: "Book on Airbnb",
      waBtn: "Inquire via WhatsApp",
      months: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ],
      weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      waMsg: "Hi! I am interested in inquiring about availability for the apartment at Cordoba 5579."
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

  const handleWhatsAppRedirect = () => {
    const encodedMessage = encodeURIComponent(t.waMsg);
    const waUrl = `https://wa.me/${whatsAppPhone}?text=${encodedMessage}`;
    window.open(waUrl, "_blank");
  };

  // Calendar Helper Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate day cells
  const dayCells = [];
  // Padding cells for previous month days
  for (let i = 0; i < firstDayOfMonth; i++) {
    dayCells.push(<div key={`empty-${i}`} className="h-8"></div>);
  }

  // Current month days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isBlocked = blockedDates.includes(dateStr);
    const isPast = dateObj < today;

    let cellClass = "h-8 w-8 flex items-center justify-center rounded-full text-xs font-semibold transition-all ";
    
    if (isPast) {
      cellClass += "text-neutral-300 dark:text-neutral-700 line-through cursor-not-allowed";
    } else if (isBlocked) {
      cellClass += "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 line-through cursor-not-allowed border border-red-100 dark:border-red-950/30";
    } else {
      cellClass += "bg-emerald-50/60 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-950/20 hover:scale-105 cursor-pointer";
    }

    dayCells.push(
      <div 
        key={`day-${day}`} 
        className="flex items-center justify-center"
        title={isBlocked ? t.booked : t.available}
      >
        <span className={cellClass}>
          {day}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1E211D] border border-[#EFEBE4] dark:border-[#2C302A] rounded-3xl p-6 shadow-lg dark:shadow-none shadow-neutral-100 sticky top-28 transition-colors duration-300 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EFEBE4]/60 dark:border-[#2C302A]/60">
        <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
          {lang === "es" ? "Reserva tu Estadía" : "Book your Stay"}
        </h3>
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#5F6F52] dark:text-[#889B73] bg-[#5F6F52]/5 dark:bg-[#889B73]/5 px-2.5 py-1 rounded-full uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          <span>Airbnb Sync</span>
        </div>
      </div>

      {/* Calendar Card Block */}
      <div className="border border-[#EFEBE4] dark:border-[#2C302A] rounded-2xl p-4 bg-[#FAF9F7] dark:bg-[#141613]/50 space-y-3 font-sans">
        <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-center">
          {t.availabilityTitle}
        </h4>
        
        {/* Month Selector */}
        <div className="flex items-center justify-between">
          <button 
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
            {t.months[month]} {year}
          </span>
          <button 
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-neutral-400">
          {t.weekdays.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-y-2 text-center">
          {dayCells}
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-4 text-[10px] text-neutral-400 font-semibold pt-2 border-t border-[#EFEBE4] dark:border-[#2C302A]/55">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40"></span>
            <span>{t.available}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40 line-through"></span>
            <span>{t.booked}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <a
          href={airbnbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#E0565D] hover:bg-[#C93B42] text-white py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer text-sm"
        >
          <span>{t.bookBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </a>

        <button
          onClick={handleWhatsAppRedirect}
          className="w-full border border-[#EFEBE4] dark:border-[#2C302A] hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-700 dark:text-neutral-350 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all active:scale-[0.98] text-sm"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>{t.waBtn}</span>
        </button>
      </div>
    </div>
  );
}
