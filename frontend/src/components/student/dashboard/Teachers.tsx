import type { User } from "@/types/user/user";

type TeachersProps = {
  teachers: User[];
  showAll?: boolean;
};
const teachersCountIfNotShowAll = 2;

const Teachers = ({ teachers, showAll = false }: TeachersProps) => {
  if(!teachers)
  {
    return <></>
  }
  return (
    <div className="text-sm text-slate-500 mb-2">
      {!showAll && (
        <>
          {teachers
            .slice(0, teachersCountIfNotShowAll)
            .map((teacher, index, array) => (
              <span>{`${teacher.first_name} ${teacher.parent_name}${index < array.length - 1 ? ", " : ""}`}</span>
            ))}
          {teachers.length > teachersCountIfNotShowAll && (
            <span>
              , and {teachers.length - teachersCountIfNotShowAll} more
            </span>
          )}
        </>
      )}
      {showAll &&
        teachers.map((teacher, index, array) => (
          <span>{`${teacher.first_name} ${teacher.parent_name}${index < array.length - 1 ? ", " : ""} ${index === array.length - 2 ? "and " : ""}`}</span>
        ))}
    </div>
  );
};

export default Teachers;
