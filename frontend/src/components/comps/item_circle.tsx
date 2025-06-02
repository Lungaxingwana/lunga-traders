interface ItemCircleProps {
  number: number;
  numberFontSize?: string;
  width?: string;
  height?: string;
  stepNumber?: null | boolean;
  bg_direction?: string;
}
export default function ItemCircle({
  number,
  numberFontSize='20px',
  width,
  height,
  stepNumber = false,
  bg_direction="r",
}: ItemCircleProps) {
  return (
    <div
      className={`rounded-full bg-gradient-to-${bg_direction} from-[#000051] to-[#00d8ff] 
         justify-center items-center align-middle flex
        }] font-bold text-white`} style={{ width: width||"40px", height:height||"40px", fontSize: numberFontSize, background: stepNumber ? "#686868": "", zIndex:10 }}
    >
      {number || 1}
    </div>
  );
}
