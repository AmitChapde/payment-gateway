import { detectCardType } from "@/utils/card";

interface CardPreviewProps {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
}

export default function     CardPreview({
  cardHolder,
  cardNumber,
  expiry,
}: CardPreviewProps) {
  const cardType = detectCardType(cardNumber);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-700 p-6 text-white shadow-lg">
      <div className="mb-8 flex items-center justify-between">
        <div className="text-sm uppercase tracking-widest text-zinc-300">
          Payment Card
        </div>

        <div className="text-sm font-semibold capitalize">
          {cardType}
        </div>
      </div>

      <div className="mb-6 text-2xl tracking-[0.2em]">
        {cardNumber || "•••• •••• •••• ••••"}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase text-zinc-400">
            Card Holder
          </p>

          <p className="text-sm font-medium uppercase">
            {cardHolder || "YOUR NAME"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-zinc-400">
            Expires
          </p>

          <p className="text-sm font-medium">
            {expiry || "MM/YY"}
          </p>
        </div>
      </div>
    </div>
  );
}