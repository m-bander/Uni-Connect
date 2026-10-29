import Lottie from "lottie-react";

type CustomLottieProps = {
  message: string;
  animationData: unknown;
};

const CustomLottie = ({ animationData, message }: CustomLottieProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center">
        <Lottie
          loop
          animationData={animationData}
          style={{ width: "30rem", height: "30rem" }}
        />
      </div>
      <p>{message}</p>
    </div>
  );
};

export default CustomLottie;
