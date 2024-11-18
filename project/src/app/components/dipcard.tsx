import { useState } from "react"; // Hook för att hantera komponentens state.
import { useDipData } from "../api/menuapi"; // Funktion för att hämta dipsås-data.
import { Dip, CartItems } from "../types"; // Typdefinitioner för dipsåser och varukorgsartiklar.

type DipCardProps = {
  addToCart: (items: CartItems) => void; // Funktion för att lägga till artiklar i varukorgen.
};

export default function DipCard({ addToCart }: DipCardProps) {
  const { dips } = useDipData(); // Hämta dipsåser från API.
  const [selectedDip, setSelectedDip] = useState<number | null>(null); // Håller koll på vald dipsås.

  // Funktion som hanterar klick på en dipsås.
  const handleDipClick = (dip: Dip) => {
    // Om samma dipsås klickas igen, avmarkera den; annars välj den.
    setSelectedDip(selectedDip === dip.id ? null : dip.id);

    // Lägg till vald dipsås i varukorgen med standardkvantitet på 1.
    addToCart({
      id: dip.id,
      name: dip.name,
      price: dip.price,
      quantity: 1,
    });
  };

  return (
    <div className="bg-[#605858] rounded-lg p-4 text-[#F4F3F1F0] mt-6">
      {/* Titelrad för dipsåskategorin */}
      <div className="flex mb-4">
        <h3 className="text-[22px] font-bold ">DIPSÅS</h3>
        {/* Streck mellan titeln och prisinformationen */}
        <div className="border-t-0 border-l-0 border-r-0 border-b-2 border-dotted flex flex-grow items-start" />
        <h3 className="text-[22px] font-bold ">19 SEK</h3>
      </div>

      {/* Grid för att visa tillgängliga dipsåser */}
      <div className="grid grid-cols-3 gap-4">
        {dips.map((dip) => (
          <div
            key={dip.id} // Unikt nyckel-ID för varje dipsås.
            onMouseDown={() => {
              setSelectedDip(dip.id); // Sätt dipsåsen som vald när musen trycks ner.
              handleDipClick(dip); // Lägg till dipsåsen i varukorgen.
            }}
            onMouseUp={() => setSelectedDip(null)} // Återställ vald dipsås när musknappen släpps.
            onMouseLeave={() => setSelectedDip(null)} // Återställ vald dipsås när muspekaren lämnar elementet.
            className={`p-2 text-center rounded cursor-pointer flex items-center justify-center ${
              selectedDip === dip.id ? "bg-[#353131]" : "bg-[#F1F0EC3D]"
            }`} // Byt bakgrundsfärg om dipsåsen är vald.
          >
            {dip.name} {/* Namn på dipsåsen */}
          </div>
        ))}
      </div>
    </div>
  );
}
