import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudentMaterials } from "@/hooks/student/use-student-materials";
import type { Material } from "@/types/student/material";
import MaterialSection from "@/components/common/course/materials/MaterialSection";
import { useGetRoleUrl } from "@/hooks/use-role-url";

const categoryList = [
  { id: "lecture", label: "Lecture Slides", category: "lecture" },
  { id: "sheet", label: "Problem Sheets", category: "sheet" },
  { id: "quiz", label: "Past Quizzes", category: "quiz" },
  { id: "assignment", label: "Assignments", category: "assignment" },
  { id: "tutorial", label: "Tutorials", category: "tutorial" },
  { id: "textbook", label: "Textbook", category: "textbook" },
];

export default function Materials() {
  const { id, category } = useParams<{ id: string; category: string }>();
  const { materials } = useStudentMaterials(id);
  const { getRoleUrl } = useGetRoleUrl();

  const userRole = getRoleUrl();

  if (!id) {
    return <></>;
  }

  const filterMaterialsByCategory = (tabCategory: string): Material[] => {
    return materials.filter((m) => m.category === tabCategory);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Materials</h1>
        <p className="text-slate-500">Signals & Systems - Dr. Sarah Johnson</p>
      </div>

      <Tabs defaultValue={category || "lecture"} className="space-y-6">
        <TabsList className="bg-slate-100">
          {categoryList
            .filter(
              (cat) => !(userRole === "instructor" && cat.category === "quiz")
            )
            .map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>
                {cat.label}
              </TabsTrigger>
            ))}
        </TabsList>

        {categoryList.map((cat) => (
          <TabsContent key={cat.id} value={cat.id}>
            <MaterialSection
              materials={filterMaterialsByCategory(cat.category)}
              sectionName={cat.label}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
