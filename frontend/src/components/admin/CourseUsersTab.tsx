import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronDown, Search, Trash2, Mail } from "lucide-react";
import type { User } from "@/types/user/user";
import { useRemoveCourseUser } from "@/hooks/admin/use-remove-course-user";

interface CourseUsersTabProps {
  courseCode: string;
  users: User[];
  type: "students" | "instructors";
}

export const CourseUsersTab = ({ courseCode, users, type }: CourseUsersTabProps) => {
  const { handleRemoveCourseUser, isRemoving } = useRemoveCourseUser(courseCode);

  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(u =>
    `${u.first_name} ${u.parent_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await handleRemoveCourseUser(selectedUser.id);
    } finally {
      setDeleteOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${type}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <ScrollArea className="h-[300px] pr-2 pl-2">
        <div className="space-y-2">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No {type} found.
            </p>
          ) : (
            filteredUsers.map((user) => (
              <Collapsible
                key={user.id}
                open={expandedId === user.id}
                onOpenChange={(open) => setExpandedId(open ? user.id : null)}
              >
                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.image_url} alt={`${user.first_name} ${user.parent_name}`} />
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-teal-500 text-white text-sm">
                          {user.first_name.charAt(0)}{user.parent_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {user.first_name} {user.parent_name}
                        </p>
                        <div className="flex items-center gap-2">
                          {user.code && (
                            <Badge variant="secondary" className="text-xs">
                              {user.code}
                            </Badge>
                          )}
                          {user.year && (
                            <span className="text-xs text-muted-foreground">
                              Year {user.year}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedId === user.id ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </CollapsibleTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CollapsibleContent className="pt-3 border-t border-border">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))
          )}
        </div>
      </ScrollArea>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {type === "students" ? "Student" : "Instructor"}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to remove {selectedUser?.first_name} {selectedUser?.parent_name} from this course? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRemoving ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};