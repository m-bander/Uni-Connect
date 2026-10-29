import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import MaterialItem from "./MaterialItem";
import type { Material } from "@/types/student/material";
import AddMaterialModal from "@/components/common/course/modals/AddMaterialModal";
import { useGetRoleUrl } from "@/hooks/use-role-url";

type MaterialsSectionProps = {
  materials: Material[];
  courseCode: string;
  allowModifyMaterials: boolean;
};

export default function MaterialsSection({
  materials,
  courseCode,
  allowModifyMaterials,
}: MaterialsSectionProps) {
  const { getRoleUrl } = useGetRoleUrl();
  const categoryFolders = [
    { name: "Lecture Slides", category: "lecture", color: "bg-blue-600" },
    { name: "Problem Sheets", category: "sheet", color: "bg-teal-600" },
    { name: "Past Quizzes", category: "quiz", color: "bg-cyan-600" },
    { name: "Tutorials", category: "tutorial", color: "bg-sky-600" },
    { name: "Textbook", category: "textbook", color: "bg-indigo-600" },
    { name: "Assignments", category: "assignment", color: "bg-emerald-600" },
  ];

  const recentMaterials = materials.slice(0, 3);
  const userRole = getRoleUrl();

  // TODO: do we instead create a backend route which returns an array with the material count for each category ?? + maybe add the recent materials
  const getMaterialCount = (category: string) => {
    return materials.filter((m) => m.category === category).length;
  };

  return (
    <div className="space-y-6">
      {/* Folders */}
      <div>
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Folders
          </h3>
          {allowModifyMaterials && (
            <div className="flex justify-end mb-3">
              <AddMaterialModal courseCode={courseCode} />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* TODO: Hide Past Quizzes for Instructor */}
          {categoryFolders
            .filter(folder => !(userRole === "instructor" && folder.category === "quiz"))
            .map((folder) => (
              <Link
                key={folder.category}
                to={`/${getRoleUrl()}/materials/${courseCode}/${folder.category}`}
              >
                <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 pl-6">
                      <div
                        className={`w-12 h-12 bg-linear-to-br ${folder.color} rounded-xl flex items-center justify-center`}
                      >
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold text-slate-800">
                          {folder.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-500">
                          {getMaterialCount(folder.category)} files
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
          ))}
        </div>
      </div>

      {/* Recent Materials */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Recent Materials
        </h3>
        <Card className="divide-y gap-0 p-0">
          {recentMaterials.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No materials found
            </p>
          ) : (
            recentMaterials.map((material) => (
              <MaterialItem
                key={material.id}
                material={material}
                allowModifyMaterials={allowModifyMaterials}
              />
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
