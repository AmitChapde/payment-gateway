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
    unknown: <span className="text-base font-semibold uppercase">Card</span>,
  }[cardType];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-800 to-emerald-800 p-6 text-white shadow-2xl shadow-zinc-300">
      <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-white/10" />

      <div className="relative mb-7 flex items-start justify-between">
        <div className="text-sm uppercase tracking-widest text-zinc-300">
          Payment Card
        </div>

        <div className="flex items-center gap-3 text-zinc-200">
          <FaWifi
            className="rotate-90 text-2xl"
            aria-label="Contactless payment"
          />
        </div>
      </div>

      <div className="relative mb-8 flex items-center gap-4">
        <div
          className="grid h-11 w-14 grid-cols-3 grid-rows-3 overflow-hidden rounded-lg border border-yellow-200/70 bg-gradient-to-br from-yellow-100 via-amber-300 to-yellow-600 shadow-lg shadow-black/20"
          aria-label="Card chip"
          role="img"
        >
          {Array.from({ length: 9 }).map((_, index) => (
            <span key={index} className="border border-amber-700/35" />
          ))}
        </div>

        <div className="h-8 w-px bg-white/20" />

        <div className="text-xs uppercase tracking-widest text-zinc-300">
          Debit
        </div>
      </div>

      <div className="relative mb-6 text-2xl tracking-[0.2em]">
        {cardNumber || "**** **** **** ****"}
      </div>

      <div className="relative flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase text-zinc-400">Card Holder</p>

          <p className="truncate text-sm font-medium uppercase">
            {cardHolder || "FULL NAME"}
          </p>
        </div>

        <div className="flex shrink-0 items-end gap-5">
          <div>
            <p className="text-xs uppercase text-zinc-400">Expires</p>

            <p className="text-sm font-medium">{expiry || "MM/YY"}</p>
          </div>

          <div className="text-4xl leading-none text-white">{cardBrand}</div>
        </div>
      </div>
    </div>
  );
}
