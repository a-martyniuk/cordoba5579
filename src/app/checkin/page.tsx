"use client";

import React, { useState } from "react";
import { Key, Wifi, Copy, Check, ShieldAlert, Clock, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function CheckInPortal() {
  const [copied, setCopied] = useState(false);
  const wifiPassword = "hola.cordoba";

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(wifiPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-800 font-sans antialiased pb-12">
      {/* Top Banner */}
      <div className="bg-[#5F6F52] text-white py-8 px-4 text-center relative shadow-md">
        <Link 
          href="/" 
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-white/90 hover:text-white font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Volver</span>
        </Link>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Córdoba 5579</h1>
        <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-medium">Portal de Check-In Digital y Manual del Huésped</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        {/* Welcome Card */}
        <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#5F6F52]">
            <span className="text-xl">👋</span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-neutral-900">¡Te damos la bienvenida!</h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Hemos preparado esta guía personalizada para que tu ingreso sea autónomo, rápido y sin fricciones. Si tenés cualquier consulta, podés contactar a Jorge directamente.
          </p>
        </div>

        {/* WiFi Card */}
        <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-[#5F6F52] pb-3 border-b border-[#F5F2EB]">
            <Wifi className="w-5 h-5" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900">Conexión a Wi-Fi</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase">Red (SSID)</span>
              <p className="font-mono text-xs sm:text-sm font-bold text-neutral-800">Cordoba5579_5G</p>
            </div>
            
            <div className="bg-[#FAF9F7] border border-[#EFEBE4] rounded-2xl p-3.5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Contraseña</span>
                <p className="font-mono text-xs sm:text-sm font-bold text-neutral-800">{wifiPassword}</p>
              </div>
              <button
                onClick={handleCopyPassword}
                className="bg-white hover:bg-neutral-50 text-[#5F6F52] border border-[#EFEBE4] p-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95 text-xs font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600 text-[10px]">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-[10px]">Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 text-center">
            También podés escanear el código QR impreso sobre el mueble del televisor para conectarte de inmediato.
          </p>
        </div>

        {/* Step-by-Step Entry Manual */}
        <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 text-[#5F6F52] pb-3 border-b border-[#F5F2EB]">
            <Key className="w-5 h-5" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900">Manual de Ingreso Autónomo</h3>
          </div>

          {/* Video Placeholder Card */}
          <div className="bg-neutral-950 rounded-2xl overflow-hidden aspect-video relative flex flex-col justify-end p-4 border border-neutral-800 group shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent flex items-center justify-center">
              <div className="w-16 h-16 bg-[#5F6F52]/90 hover:bg-[#5F6F52] text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer">
                <span className="text-2xl ml-1">▶</span>
              </div>
            </div>
            <div className="z-10 text-white space-y-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Video Guía</span>
              <h5 className="font-bold text-xs sm:text-sm">Cómo ingresar al edificio y retirar las llaves</h5>
            </div>
          </div>

          {/* Steps list */}
          <div className="space-y-5">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">Llegada al Edificio</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Dirigite a la entrada principal en <strong>Av. Córdoba 5579</strong>. El ingreso cuenta con iluminación y seguridad por cámaras las 24 hs.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">Retiro de Llaves (Lockbox)</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  A la derecha de la puerta de entrada verás unas cajas metálicas de seguridad. Ubicá la rotulada como <strong>&quot;Depto 4B&quot;</strong>. Introduce el código de combinación: <strong className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-800 font-mono">5579</strong>, desliza la traba hacia abajo y retira el juego de llaves.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">Ascensor al Piso 4</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Usa la llave magnética (el llavero circular azul/negro) aproximándola al lector de la puerta de vidrio del hall. Dirigite a los ascensores y subí al <strong>piso 4</strong>.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#5F6F52] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs sm:text-sm text-neutral-900">Acceso al Departamento (4B)</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  El departamento es el <strong>4B</strong>. Introduce la llave física en la cerradura, girala dos vueltas a la izquierda ¡y bienvenido a tu hogar temporal!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* House Rules & Norms */}
        <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-[#5F6F52] pb-3 border-b border-[#F5F2EB]">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900">Normas Clave de Convivencia</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600">
            <div className="flex items-start gap-2 bg-[#FAF9F7] p-3 rounded-xl border border-[#EFEBE4]/50">
              <span className="text-lg">🚭</span>
              <p><strong>Prohibido fumar:</strong> Multa por fumar dentro del depto o balcones del edificio.</p>
            </div>
            <div className="flex items-start gap-2 bg-[#FAF9F7] p-3 rounded-xl border border-[#EFEBE4]/50">
              <span className="text-lg">🚫🐾</span>
              <p><strong>Sin mascotas:</strong> No se admite el ingreso de mascotas en la propiedad.</p>
            </div>
            <div className="flex items-start gap-2 bg-[#FAF9F7] p-3 rounded-xl border border-[#EFEBE4]/50">
              <span className="text-lg">🤫</span>
              <p><strong>Horas de silencio:</strong> De 22:00 a 08:00 hs. Respetar el descanso de los vecinos.</p>
            </div>
            <div className="flex items-start gap-2 bg-[#FAF9F7] p-3 rounded-xl border border-[#EFEBE4]/50">
              <span className="text-lg">🏊</span>
              <p><strong>Piscina en terraza:</strong> Piso 9. Solo huéspedes, ducha previa obligatoria. Cierre 20 hs.</p>
            </div>
          </div>
        </div>

        {/* Check-Out Instructions */}
        <div className="bg-white border border-[#EFEBE4] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-[#5F6F52] pb-3 border-b border-[#F5F2EB]">
            <Clock className="w-5 h-5" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900">Instrucciones de Check-Out</h3>
          </div>
          
          <div className="space-y-3.5 text-xs text-neutral-600">
            <p>El horario límite de check-out es a las <strong>11:00 hs</strong>. Te solicitamos:</p>
            <ol className="space-y-2.5 list-decimal list-inside">
              <li><strong>Apagar luces y aires:</strong> Asegurate de apagar todos los aires acondicionados y luces.</li>
              <li><strong>Guardar llaves:</strong> Cerrá la puerta del depto tirando firmemente y colocá las llaves de regreso en la misma caja de seguridad (lockbox) del ingreso, desordenando los números de combinación al cerrar.</li>
              <li><strong>Avisar por WhatsApp:</strong> Enviale un mensaje rápido a Jorge confirmando tu salida. ¡Buen viaje de regreso!</li>
            </ol>
          </div>
        </div>

        {/* Contact Support */}
        <a
          href="https://wa.me/5491145379500?text=Hola%20Jorge!%20Estoy%20ingresando%20al%20departamento..."
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#5F6F52] hover:bg-[#4F5D43] text-white py-4 px-6 rounded-2xl font-semibold shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Contactar Soporte (Jorge - WhatsApp)</span>
        </a>
      </div>
    </div>
  );
}
