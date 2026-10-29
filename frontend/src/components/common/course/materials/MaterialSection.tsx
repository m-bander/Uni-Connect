import { Card } from "@/components/ui/card";
import MaterialItem from "./MaterialItem";
import type { Material } from "@/types/student/material";
import { useAuth } from "@/providers/context/authContext";

type MaterialSectionProps = {
  materials: Material[];
  sectionName: string;
};

export default function MaterialSection({
  materials,
  sectionName,
}: MaterialSectionProps) {
  const { auth } = useAuth();
  // const { courseRepId } = useCourseData(courseCode)

  // TODO: Route To Check For Course Head ??
  const role = auth.user?.role;
  const allowModifyMaterials =
    role == "class_representative" ||
    role == "professor/ta" ||
    role == "course_head"; /* auth.user?.id == courseRepId */

  return (
    <Card className="divide-y gap-0 p-0">
      {materials.length === 0 ? (
        <p className="p-4 text-sm text-slate-500">
          No {sectionName.toLowerCase()} found
        </p>
      ) : (
        materials.map((material) => (
          <MaterialItem
            key={material.id}
            material={material}
            allowModifyMaterials={allowModifyMaterials}
          />
        ))
      )}
    </Card>
  );
}
