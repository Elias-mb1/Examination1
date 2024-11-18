import { useState } from "react"; // Använder useState för att hantera vald dryck.
import { useDrinkData } from "../api/menuapi"; // Hämtar drycker via vår API-funktion.
import { Drink, CartItems } from "../types"; // Typdefinitioner för drycker och varukorgsartiklar.

type DrinkProps = {
  addToCart: (items: CartItems) => void; // Funktion för att lägga till drycker i varukorgen.
};

export default function DrinkCard({ addToCart }: DrinkProps) {
  const { drinks } = useDrinkData(); // Hämta dryck-data från API.
  const [selectedDrink, setSelectedDrink] = useState<number | null>(null); // Håller koll på vilken dryck som är vald.

  // När användaren klickar på en dryck:
  const handleDrinkClick = (drink: Drink) => {
    // Om samma dryck klickas igen, avmarkera den; annars välj den.
    setSelectedDrink(selectedDrink === drink.id ? null : drink.id);

    // Lägg till vald dryck i varukorgen (1 st).
    addToCart({
      id: drink.id,
      name: drink.name,
      price: drink.price,
      quantity: 1,
    });
  };

  return (
    <div className="bg-[#605858] rounded-lg p-4 text-[#F4F3F1F0] mt-6">
      {/* Rubrik för dryckavsnittet */}
      <div className="flex mb-4">
        <h3 className="text-[22px] font-bold ">DRICKA</h3>
        {/* Separator mellan rubrik och pris */}
        <div className="border-t-0 border-l-0 border-r-0 border-b-2 border-dotted flex flex-grow items-start" />
        <h3 className="text-[22px] font-bold ">19 SEK</h3>
      </div>

      {/* Grid som visar alla drycker */}
      <div className="grid grid-cols-3 gap-4">
        {drinks.map((drink) => (
          <div
            key={drink.id} // Varje dryck måste ha ett unikt id.
            onMouseDown={() => {
              // När man trycker ner på en dryck
              setSelectedDrink(drink.id); // Markera drycken som vald.
              handleDrinkClick(drink); // Lägg till drycken i varukorgen.
            }}
            onMouseUp={() => setSelectedDrink(null)} // Återställ valet när man släpper musknappen.
            onMouseLeave={() => setSelectedDrink(null)} // Återställ valet om musen lämnar drycken.
            className={`p-2 text-center rounded cursor-pointer flex items-center justify-center ${
              selectedDrink === drink.id ? "bg-[#353131]" : "bg-[#F1F0EC3D]"
            }`} // Visar om drycken är vald genom att ändra bakgrundsfärg.
          >
            {drink.name} {/* Dryckens namn visas här */}
          </div>
        ))}
      </div>
    </div>
  );
}
