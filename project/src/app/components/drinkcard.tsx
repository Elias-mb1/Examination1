//drinkcard.tsx
import { useState } from "react";
import { useDrinkData } from "../api/menuapi";
import { Drink, CartItems } from "../types";

type DrinkProps = {
  addToCart: (items: CartItems) => void;
};

export default function DrinkCard({ addToCart }: DrinkProps) {
  const { drinks } = useDrinkData();
  const [selectedDrink, setSelectedDrink] = useState<number | null>(null);

  const handleDrinkClick = (drink: Drink) => {
    setSelectedDrink(selectedDrink === drink.id ? null : drink.id);
    addToCart({
      id: drink.id,
      name: drink.name,
      price: drink.price,
      quantity: 1,
    });
  };

  return (
    <div className="bg-[#605858] rounded-lg p-4 text-[#F4F3F1F0] mt-6">
      <div className="flex mb-4">
        <h3 className="text-[22px] font-bold ">DRICKA</h3>
        <div className="border-t-0 border-l-0 border-r-0 border-b-2 border-dotted flex flex-grow items-start" />
        <h3 className="text-[22px] font-bold ">19 SEK</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {drinks.map((drink) => (
          <div
            key={drink.id}
            onMouseDown={() => {
              setSelectedDrink(drink.id); // Sätt till vald dipsås när musen trycks ner
              handleDrinkClick(drink); // Lägg till i varukorgen
            }}
            onMouseUp={() => setSelectedDrink(null)} // Återställ när musen släpps
            onMouseLeave={() => setSelectedDrink(null)} // Återställ när musen lämnar elementet
            className={`p-2 text-center rounded cursor-pointer flex items-center justify-center ${
              selectedDrink === drink.id ? "bg-[#353131]" : "bg-[#F1F0EC3D]"
            }`}
          >
            {drink.name}
          </div>
        ))}
      </div>
    </div>
  );
}
