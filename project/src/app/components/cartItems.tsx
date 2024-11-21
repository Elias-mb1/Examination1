"use client"; // Markerar att denna fil körs på klienten i Next.js.
import { useState, useEffect } from "react";
import { CartItems } from "../types";
import ETAcard from "./etacard";

// API-konstanter: URL och nyckel för att hantera beställningar.
const API_URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/e1mk/orders";
const API_KEY = "yum-7BTxHCyHhzI";

export default function Cart({
  cartItems, // Lista över varor som skickas som props.
  clearCart, // Funktion som tömmer varukorgen externt.
}: {
  cartItems: CartItems[]; // Typdefinition för varukorgens innehåll.
  clearCart: () => void; // Funktion för att rensa varukorgen.
}) {
  // State för att hålla varukorgens aktuella innehåll.
  const [items, setItems] = useState<CartItems[]>(cartItems);

  // State för att hantera om varukorgen är synlig eller inte.
  const [isCartVisible, setCartVisibility] = useState(false);

  // State för att lagra information om beställningen (ETA och order-ID).
  const [orderDetails, setOrderDetails] = useState<{
    success: boolean; // Om ordern lyckades eller inte.
    eta: number | null; // Förväntad leveranstid i minuter.
    orderId: string | null; // Order-ID.
  }>({
    success: false, // Initiera med att ingen beställning har gjorts.
    eta: null,
    orderId: null,
  });

  // Beräknar den totala summan i varukorgen.
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Beräknar det totala antalet varor i varukorgen.
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Effekt: Uppdatera lokalt state om `cartItems` som skickas in ändras.
  useEffect(() => {
    if (cartItems.length > 0) {
      setItems(cartItems);
    }
  }, [cartItems]);

  // Funktion för att uppdatera kvantiteten av en vara (öka eller minska).
  const updateQuantity = (id: number, delta: number) => {
    setItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0) // Tar bort varor med kvantitet <= 0.
    );
  };

  // Funktion för att skicka en beställning.
  const placeOrder = async () => {
    // Skapa en lista med varu-ID:n baserat på kvantiteter.
    const orderItems = items.flatMap((item) => Array(item.quantity).fill(item.id));

    try {
      // Skicka POST-förfrågan till API:t.
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Anger att vi skickar JSON.
          "x-zocom": API_KEY, // API-nyckeln för autentisering.
        },
        body: JSON.stringify({ items: orderItems }), // Data som skickas i förfrågan.
      });

      // Kontrollera om svaret är lyckat.
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Tolka svaret från API:t.
      const data = await response.json();

      // Beräkna ETA i minuter och uppdatera orderdetaljer.
      const etaMinutes = Math.round(
        (new Date(data.order.eta).getTime() - Date.now()) / 60000
      );

      setOrderDetails({
        success: true,
        eta: etaMinutes,
        orderId: data.order.id,
      });

      // Töm varukorgen efter en lyckad beställning.
      setItems([]);
    } catch (error) {
      console.error("order error: could not place order", error);
    }
  };

  // Funktion för att återställa varukorgen efter en beställning.
  const resetCart = () => {
    setOrderDetails({ success: false, eta: null, orderId: null }); // Återställ orderstatus.
    setCartVisibility(false); // Stäng varukorgen.
    setItems([]); // Töm lokalt innehåll i varukorgen.
    clearCart(); // Töm den externa varukorgen.
  };

  return (
    <div>
      {/* Knapp för att öppna varukorgen */}
      <button
        onClick={() => setCartVisibility(true)}
        className="fixed top-4 right-4 bg-[#F4F3F1F0] text-white p-2 rounded border-none"
      >
        <img src="./cart btn.svg" alt="Cart Button" />
        {/* Visar en notisbricka med det totala antalet varor om det är större än 0 */}
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#EB5757] text-[#F4F3F1F0] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {totalQuantity}
          </span>
        )}
      </button>

      {/* Modal för att visa varukorgen */}
      {isCartVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center">
          <div
            className={`w-full max-w-md relative ${
              orderDetails.success ? "bg-[#605858]" : "bg-[#EEEEEE] pt-24 p-6"
            }`}
          >
            {/* Knapp för att stänga varukorgen */}
            {!orderDetails.success && (
              <button
                onClick={() => setCartVisibility(false)}
                className="absolute top-4 right-4 bg-[#EEEEEE] text-white p-2 rounded border-none"
              >
                <img src="./cart btn.svg" alt="Close Button" />
              </button>
            )}

            {orderDetails.success ? (
              // Visa ETA-kortet efter en lyckad beställning.
              <ETAcard
                eta={orderDetails.eta!}
                orderId={orderDetails.orderId!}
                onNewOrder={resetCart}
              />
            ) : (
              <div>
                {/* Meddelande om varukorgen är tom */}
                {items.length === 0 ? (
                  <p className="text-gray-500 text-center">
                    Din varukorg är tom.
                  </p>
                ) : (
                  // Lista över varor i varukorgen
                  <ul className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="border-b border-dotted flex justify-between items-center py-2"
                      >
                        {/* Visar namn, pris och kvantitet */}
                        <div className="w-full">
                          <div className="flex justify-between">
                            <p className="text-[#353131] text-[22px] font-bold uppercase">
                              {item.name}
                            </p>
                            <p className="text-[22px] text-[#353131] font-bold">
                              {item.price * item.quantity} SEK
                            </p>
                          </div>
                          <div className="flex items-center pt-2">
                            {/* Knapp för att öka kvantiteten */}
                            <button
                              className="border-none px-2 py-1"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <img src="./plus.svg" alt="+" />
                            </button>
                            <p className="pb-1 text-[#353131]">
                              {item.quantity} stycken
                            </p>
                            {/* Knapp för att minska kvantiteten */}
                            <button
                              className="border-none px-2 py-1"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <img src="./minus.svg" alt="-" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Totalsumma och knapp för att skicka beställning */}
                {items.length > 0 && (
                  <div className="mt-4 bg-[#3531313D] p-4 gap-2 rounded flex justify-between">
                    <div>
                      <h3 className="text-[22px] text-[#353131] font-bold">TOTALT</h3>
                      <p className="text-[16px] text-[#353131]">inkl 20% moms</p>
                    </div>
                    <h3 className="text-[#353131] text-[32px] flex items-center">
                      {total} SEK
                    </h3>
                  </div>
                )}
                <button
                  onClick={placeOrder}
                  className="text-[24px] font-bold w-full mt-4 bg-[#353131] text-white py-6 px-4 rounded"
                >
                  TAKE MY MONEY!
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
