import { useState } from "react";
import { useWontonData } from "../api/menuapi";
import { CartItems } from "../types";

type WontonCardProps = {
  addToCart: (item: CartItems) => void;
};

export default function WontonCard({ addToCart }: WontonCardProps) {
  const { wontons } = useWontonData();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handleItemClick = (
    event: React.MouseEvent<HTMLLIElement>,
    wontonId: number
  ) => {
    event.preventDefault();
    setSelectedItem(wontonId);
    addToCart({
      id: wontonId,
      name: wontons.find((w) => w.id === wontonId)?.name || "",
      price: wontons.find((w) => w.id === wontonId)?.price || 0,
      quantity: 1,
    });
    setTimeout(() => {
      setSelectedItem(null);
    }, 100);
  };

  return (
    <div className="relative max-w-full mx-auto">
      <ul>
        {wontons.map((wonton, index) => (
          <div
            key={index}
            className={`text-[#F4F3F1F0] border-t-0 border-l-0 border-r-0 ${
              wontons.length - 1 !== index && "border-b border-dotted"
            }`}
          >
            <li
              key={wonton.id}
              className={`p-4 md:p-6 flex text-[#F4F3F1F0] cursor-pointer text-sm md:text-lg ${
                selectedItem === wonton.id ? "bg-[#353131]" : "bg-[#605858]"
              } ${index === 0 ? "rounded-t-lg" : ""} ${
                index === wontons.length - 1 ? "rounded-b-lg" : ""
              }`}
              onClick={(event) => handleItemClick(event, wonton.id)}
            >
              <div className="w-full">
                <div className="flex justify-between w-full gap-4">
                  <p className="text-base md:text-[26px] font-bold uppercase">
                    {wonton.name}
                  </p>
                  <div className="border-t-0 border-l-0 border-r-0 border-b-2 border-dotted flex-grow" />
                  <p className="text-base md:text-[26px] font-bold">
                    {wonton.price} SEK
                  </p>
                </div>
                <div className="w-full flex text-left pt-2 md:pt-3">
                  <p className="text-[#F4F3F1F0] text-xs md:text-base">
                    {wonton.ingredients.join(", ")}
                  </p>
                </div>
              </div>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}
