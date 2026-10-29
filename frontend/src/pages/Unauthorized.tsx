import CustomLottie from "@/components/global/CustomLottie";

import UnauthorizedAnimation from "@/assets/lottie/Error 401.json";

export const Unauthorized = () => {
  return (
    <div className="w-dvw h-dvh flex items-center justify-center">
      <CustomLottie
        animationData={UnauthorizedAnimation}
        message="Unauthorized you don't have the appropriate roles."
      />
    </div>
  );
};
