"use client"; // Indikerar att denna fil körs på klienten i Next.js.
import { useState, useEffect } from "react"; // React-hooks för state och livscykelhantering.
import { CartItems } from "../types"; // Typdefinition för objekt i varukorgen.
import ETAcard from "./etacard"; // Komponent för att visa ETA och orderinformation.

const API_URL =
  "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/e1mk/orders"; // API-URL för att skapa beställningar.
const API_KEY = "yum-7BTxHCyHhzI"; // API-nyckeln för autentisering.

export default function Cart({
  cartItems, // Varor som skickas in som props till komponenten.
  clearCart, // Funktion som tömmer varukorgen.
}: {
  cartItems: CartItems[]; // Typ för inkommande varor.
  clearCart: () => void; // Typ för funktionen clearCart.
}) {
  // Lokalt state för att hantera varukorgens innehåll, synlighet och orderstatus.
  const [items, setItems] = useState<CartItems[]>(cartItems);
  const [showCart, setShowCart] = useState(false); // Håller koll på om varukorgen är öppen.
  const [orderSuccess, setOrderSuccess] = useState(false); // Indikerar om en order lyckades.
  const [eta, setEta] = useState<number | null>(null); // Förväntad ankomsttid.
  const [orderId, setOrderId] = useState<string | null>(null); // Order-ID.

  // Beräknar den totala kostnaden för varukorgen.
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity, // Pris multiplicerat med antal.
    0 // Startvärde.
  );

  // Beräknar det totala antalet varor i varukorgen.
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Funktion för att stänga varukorgen.
  const handleClose = () => {
    setShowCart(false);
  };

  // Funktion för att öppna varukorgen.
  const handleOpen = () => {
    setShowCart(true);
  };

  // Effekt som uppdaterar lokalt state om inkommande `cartItems` ändras.
  useEffect(() => {
    if (cartItems.length > 0) {
      setItems(cartItems);
    }
  }, [cartItems]);

  // Ökar antalet av en specifik vara i varukorgen.
  const increaseQuantity = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Minskar antalet av en specifik vara i varukorgen.
  const decreaseQuantity = (id: number) => {
    setItems(
      (prevItems) =>
        prevItems
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0) // Tar bort varor med 0 kvantitet.
    );
  };

  // Skapar en order när "Take My Money"-knappen klickas.
  const handleOrder = async () => {
    setOrderSuccess(false); // Återställ orderstatus.

    // Skapar en lista av varu-ID:n, där varje ID upprepas baserat på kvantitet.
    const orderItems = items.flatMap((item) =>
      Array(item.quantity).fill(item.id)
    );

    try {
      const response = await fetch(API_URL, {
        method: "POST", // POST-metod för att skicka data.
        headers: {
          "Content-Type": "application/json", // Anger att vi skickar JSON.
          "x-zocom": API_KEY, // Autentisering med API-nyckeln.
        },
        body: JSON.stringify({ items: orderItems }), // Data som skickas i POST-förfrågan.
      });

      if (!response.ok) {
        // Om något går fel, kasta ett fel.
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json(); // Parsar JSON-svaret.
      setEta(
        Math.round((new Date(data.order.eta).getTime() - Date.now()) / 6000)
      ); // Beräknar ETA (förväntad leveranstid).
      setOrderId(data.order.id); // Sparar order-ID från svaret.
      setOrderSuccess(true); // Indikerar att ordern lyckades.
      setItems([]); // Tömmer varukorgen efter lyckad beställning.
    } catch (error) {
      console.error("order error: could not place order", error); // Loggar eventuella fel.
    }
  };

  // Återställer varukorgen efter en beställning.
  const handleNewOrder = () => {
    setOrderSuccess(false); // Återställ orderstatus.
    setShowCart(false); // Stäng varukorgen.
    setItems([]); // Töm lokalt state för varukorgen.
    clearCart(); // Töm externa varukorgen.
  };

  return (
    <div>
      {/* Knapp för att öppna varukorgen */}
      <button
        onClick={handleOpen}
        className="fixed top-4 right-4 bg-[#F4F3F1F0] text-white p-2 rounded border-none"
      >
        <img src="./cart btn.svg" alt="Cart Button" />
        {/* Notisbricka som visar antal varor */}
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#EB5757] text-[#F4F3F1F0] text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {totalQuantity}
          </span>
        )}
      </button>

      {/* Modal för varukorgen */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center">
          <div
            className={`w-full max-w-md relative ${
              orderSuccess ? "bg-[#605858]" : "bg-[#EEEEEE] pt-24 p-6"
            }`}
          >
            {/* Knapp för att stänga varukorgen */}
            {!orderSuccess && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 bg-[#EEEEEE] text-white p-2 rounded border-none"
              >
                <img src="./cart btn.svg" alt="close Button" />
              </button>
            )}

            {orderSuccess ? (
              // ETA-kort som visas efter lyckad order.
              <ETAcard
                eta={eta!}
                orderId={orderId!}
                onNewOrder={handleNewOrder}
              />
            ) : (
              <div>
                {/* Meddelande om varukorgen är tom */}
                {items.length === 0 ? (
                  <div>
                    <p className="text-gray-500 flex justify-center">
                      Din varukorg är tom.
                    </p>
                  </div>
                ) : (
                  // Lista över varor i varukorgen
                  <ul className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {items.map((item, index) => (
                      <li
                        key={item.id}
                        className={`border-t-0 border-l-0 border-r-0 ${
                          items.length - 1 !== index &&
                          "border-b border-dotted"
                        } flex-grow flex justify-between items-center py-2`}
                      >
                        {/* Visar namn och pris */}
                        <div className="w-full">
                          <div className="flex justify-between w-full gap-2">
                            <p className="text-[#353131] text-[22px] font-bold flex uppercase">
                              {item.name}
                            </p>
                            <p className="text-[22px] text-[#353131] font-bold flex items-center">
                              {item.price * item.quantity} SEK
                            </p>
                          </div>
                          {/* Knapp för att ändra antal */}
                          <div className="w-full flex items-center text-left pt-2">
                            <button
                              className="border-none px-2 py-1"
                              onClick={() => increaseQuantity(item.id)}
                            >
                              <img src="./plus.svg" alt="+" />
                            </button>
                            <p className="pb-1 text-[#353131]">
                              {item.quantity} stycken
                            </p>
                            <button
                              className="border-none px-2 py-1"
                              onClick={() => decreaseQuantity(item.id)}
                            >
                              <img src="./minus.svg" alt="-" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {/* Totalt och knapp för att beställa */}
                {items.length > 0 && (
                  <div className="pt-20">
                    <div className="mt-4 bg-[#3531313D] p-4 gap-2 rounded flex justify-between w-full">
                      <div className="flex-col font-bold">
                        <h3 className="text-[22px] text-[#353131]">TOTALT</h3>
                        <h3 className="text-[16px] text-[#353131]">
                          inkl 20% moms
                        </h3>
                      </div>
                      <h3 className="text-[#353131] text-[32px] flex items-center">
                        {total} SEK
                      </h3>
                    </div>
                    <button
                      onClick={handleOrder}
                      className="text-[24px] font-bold w-full mt-4 bg-[#353131] text-white py-6 px-4 rounded shadow-"
                    >
                      TAKE MY MONEY!
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
