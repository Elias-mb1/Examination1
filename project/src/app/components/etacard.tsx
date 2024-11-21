type ETACardProps = {
  eta: number; // ETA (beräknad tid för ankomst) i minuter
  orderId: string; // Unikt order-ID som identifierar beställningen
  onNewOrder: () => void; // Funktion för att påbörja en ny beställning
};

export default function ETACard({ eta, orderId, onNewOrder }: ETACardProps) {
  return (
    <div className="bg-[#605858] p-4 md:p-6 rounded-lg text-center w-full flex flex-col justify-between h-full">
      {/* Översta delen: Bild och rubrik */}
      <div>
        <div className="flex justify-center">
          {/* Bild som symboliserar att ordern håller på att tillagas */}
          <img
            src="./boxtop.svg"
            alt="Order box"
            className="w-40 h-36 md:w-[390px] md:h-[362px] mx-auto mb-4"
          />
        </div>

        {/* Rubrik som meddelar användaren att deras order tillagas */}
        <div className="flex-col items-center">
          <h2 className="text-[#F4F3F1F0] text-lg md:text-[32px] font-bold">
            DINA WONTONS
          </h2>
          <h2 className="text-[#F4F3F1F0] text-lg md:text-[32px] font-bold mb-2">
            TILLAGAS!
          </h2>
        </div>

        {/* Visar ETA och order-ID */}
        <p className="text-[#F4F3F1F0] text-base md:text-[26px] py-2 md:py-4">
          ETA {eta} MIN
        </p>
        <p className="text-[#EEEEEE] text-xs md:text-[15px] mt-1">
          #{orderId} {/* Order-ID visas som referens för användaren */}
        </p>
      </div>

      {/* Bottensektionen: Alternativ för kvitto och ny beställning */}
      <div className="mt-auto space-y-3">
        {/* Knapp för att visa kvitto - funktionaliteten kan läggas till senare */}
        <button className="bg-[#605858] w-full h-[50px] md:h-[77px] py-2 border border-[#F4F3F1F0] border-solid rounded font-bold text-[18px] md:text-[24px] text-white">
          SE KVITTO
        </button>

        {/* Knapp för att starta en ny beställning */}
        <button
          onClick={onNewOrder} // Anropar onNewOrder när användaren klickar
          className="w-full h-[50px] md:h-[77px] py-2 bg-[#353131] rounded text-white font-bold text-[18px] md:text-[24px] border-none"
        >
          GÖR EN NY BESTÄLLNING
        </button>
      </div>
    </div>
  );
}
