import { cn } from "@/lib/utils"

export function PricingBadge({ pricingModel }) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2",
        pricingModel === "Free" && "bg-[#1C2B0E] text-[#84D149]",
        pricingModel === "Premium" && "bg-[#2D0C0C] text-[#FF4747]",
        pricingModel === "Freemium" && "bg-[#4D2F07] text-[#FF9F2F]",
        pricingModel === "Paid" && "bg-[#2D0C0C] text-[#FF4747]",
      )}
    >
      {pricingModel === "Freemium" && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="#FF9F2F"
          />
        </svg>
      )}
      {pricingModel === "Paid" && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM9.97 9.47C9.97 10.2 10.54 10.69 12.31 11.14C14.07 11.6 15.96 12.23 15.97 14.21C15.96 15.41 15.11 16.48 13.85 16.82V18H11.13V16.83C9.87 16.5 9 15.42 9 14.21H10.76C10.76 14.93 11.33 15.42 12.5 15.42C13.73 15.42 14.21 14.87 14.21 14.21C14.21 13.48 13.64 13 11.87 12.55C10.1 12.09 8.21 11.46 8.21 9.47C8.21 8.27 9.06 7.21 10.32 6.87V5.69H13.03V6.86C14.29 7.19 15.15 8.27 15.15 9.47H13.39C13.39 8.75 12.82 8.26 11.65 8.26C10.42 8.26 9.97 8.81 9.97 9.47Z"
            fill="#FF4747"
          />
        </svg>
      )}
      {pricingModel}
    </span>
  )
}

