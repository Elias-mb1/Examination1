type ETACardProps = {
  eta: number;
  orderId: string;
  onNewOrder: () => void;
};

export default function ETACard({ eta, orderId, onNewOrder }: ETACardProps) {
  return (
    <div className="bg-[#605858] p-4 md:p-6 rounded-lg text-center w-full flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-center">
          <img
            src="./boxtop.svg"
            alt="Order box"
            className="w-40 h-36 md:w-[390px] md:h-[362px] mx-auto mb-4"
          />
        </div>

        <div className="flex-col items-center">
          <h2 className="text-[#F4F3F1F0] text-lg md:text-[32px] font-bold">
            DINA WONTONS
          </h2>
          <h2 className="text-[#F4F3F1F0] text-lg md:text-[32px] font-bold mb-2">
            TILLAGAS!
          </h2>
        </div>

        <p className="text-[#F4F3F1F0] text-base md:text-[26px] py-2 md:py-4">
          ETA {eta} MIN
        </p>
        <p className="text-[#EEEEEE] text-xs md:text-[15px] mt-1">#{orderId}</p>
      </div>

      <div className="mt-auto space-y-3">
        <button className="bg-[#605858] w-full h-[50px] md:h-[77px] py-2 border border-[#F4F3F1F0] border-solid rounded font-bold text-[18px] md:text-[24px] text-white">
          SE KVITTO
        </button>
        <button
          onClick={onNewOrder}
          className="w-full h-[50px] md:h-[77px] py-2 bg-[#353131] rounded text-white font-bold text-[18px] md:text-[24px] border-none"
        >
          GÖR EN NY BESTÄLLNING
        </button>
      </div>
    </div>
  );
}
