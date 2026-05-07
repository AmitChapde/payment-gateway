"use client";

import { detectCardType } from "@/utils/card";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaWifi } from "react-icons/fa";

interface CardPreviewProps {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
}

export default function CardPreview({
  cardHolder,
  cardNumber,
  expiry,
}: CardPreviewProps) {
  const cardType = detectCardType(cardNumber);

  const cardBrand = {
    visa: <FaCcVisa aria-label="Visa" />,
    mastercard: <FaCcMastercard aria-label="Mastercard" />,
    amex: <FaCcAmex aria-label="American Express" />,
    unknown: (
      <span className="text-sm font-semibold uppercase sm:text-base">
        Card
      </span>
    ),
  }[cardType];

  const displayNumber = cardNumber || "**** **** **** ****";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-800 to-emerald-800 p-5 text-white shadow-2xl shadow-zinc-300 sm:p-6">
      <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-white/10" />

      <div className="relative mb-6 flex items-start justify-between sm:mb-7">
        <div className="text-xs uppercase tracking-[0.18em] text-zinc-300 sm:text-sm">
          Payment Card
        </div>
        <div className="flex items-center gap-3 text-zinc-200">
          <FaWifi
            className="rotate-90 text-xl sm:text-2xl"
            aria-label="Contactless payment"
          />
        </div>
      </div>

      <div className="relative mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
        <div
          className="grid h-10 w-12 grid-cols-3 grid-rows-3 overflow-hidden rounded-lg border border-yellow-200/70 bg-gradient-to-br from-yellow-100 via-amber-300 to-yellow-600 shadow-lg shadow-black/20 sm:h-11 sm:w-14"
          aria-label="Card chip"
          role="img"
        >
          {Array.from({ length: 9 }).map((_, index) => (
            <span key={index} className="border border-amber-700/35" />
          ))}
        </div>
        <div className="h-7 w-px bg-white/20 sm:h-8" />
        <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-300 sm:text-xs">
          Debit
        </div>
      </div>

      <div className="relative mb-6 font-mono text-lg tracking-[0.18em] text-white sm:text-2xl sm:tracking-[0.2em]">
        {displayNumber}
      </div>

      <div className="relative flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 sm:text-xs">
            Card Holder
          </p>
          <p className="truncate text-sm font-medium uppercase sm:text-base">
            {cardHolder || "FULL NAME"}
          </p>
        </div>

        <div className="flex shrink-0 items-end gap-3 sm:gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 sm:text-xs">
              Expires
            </p>
            <p className="text-sm font-medium sm:text-base">
              {expiry || "MM/YY"}
            </p>
          </div>
          <div className="text-3xl leading-none text-white sm:text-4xl">
            {cardBrand}
          </div>
        </div>
      </div>
    </div>
  );
}