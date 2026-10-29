import Logo from "@/components/global/Logo";

export const CourseCardPlaceholderImage = () => {
  return (
    <div
      className={`w-full h-32 object-cove bg-[#d0e7ff] flex justify-center items-center `}
    >
      <Logo imageClassName="fill-black text-amber-500" showText={false} />
    </div>
  );
};
