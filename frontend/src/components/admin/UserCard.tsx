import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Trash2, X } from "lucide-react";
import type { User } from "@/types/user/user";
import type { serverRolesType } from "@/types/api/auth";
import { EditUserModal } from "./EditUserModal";
import { useDeleteUser } from "@/hooks/admin/use-delete-user";
import { useApproveUser } from "@/hooks/admin/use-approve-user";
import { useState } from "react";

type UserCardProps = {
  user: User;
  userType: "pending" | "user";
}

const getRoleBadgeColor = (role: serverRolesType) => {
  switch (role) {
    case "system_admin":
      return "bg-red-100 text-red-700 border-red-200";
    case "professor/ta":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "class_representative":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "course_head":
      return "bg-teal-100 text-teal-700 border-teal-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const formatRole = (role: serverRolesType) => {
  switch (role) {
    case "system_admin":
      return "Admin";
    case "professor/ta":
      return "Instructor";
    case "class_representative":
      return "Class Rep";
    case "course_head":
      return "Course Head";
    default:
      return "Student";
  }
};

export const UserCard = ({ user, userType }: UserCardProps) => {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { handleDeleteUser, isDeleting } = useDeleteUser(user.id);
  const { handleApproveUser } = useApproveUser(user.id);

  // Dialog control + which action triggered
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"approve" | "decline" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onOpenAction = (action: "approve" | "decline") => {
    setPendingAction(action);
    setDialogOpen(true);
  };

  // Prevent onOpenChange from closing dialog during processing
  const handleDialogOpenChange = (open: boolean) => {
    if (isProcessing) return; // block closing while we're processing
    if (!open) setPendingAction(null);
    setDialogOpen(open);
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;
    setIsProcessing(true);

    try {
      if (pendingAction === "decline") {
        // decline -> delete user
        setPendingDeleteId(user.id);
        await handleDeleteUser(user.id);
        setPendingDeleteId(null);
      } else if (pendingAction === "approve") {
        await handleApproveUser(user.id);
      }
      
    } finally {
      setIsProcessing(false);
      setDialogOpen(false);
      setPendingAction(null);
    }
  };
  
  const handleDelete = async (userId: string) => {
    try {
      setPendingDeleteId(userId);
      await handleDeleteUser(userId);
    } finally {
      setPendingDeleteId(null);
    }
  };

  return (
    <Card className="flex-row justify-between gap-4 p-4 hover:shadow-md transition-shadow">
      {/* Left Section */}
      <UserInfo user={user} userType={userType}/>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {userType === "user" ? (
          <>
            <EditUserModal user={user} />
            
            {/* Delete Modal */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-red-100 hover:text-red-600"
                  disabled={isDeleting && pendingDeleteId === user.id}
                >
                  {isDeleting && pendingDeleteId === user.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this user?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <strong>{user?.first_name} {user?.parent_name}</strong>? 
                    This action cannot be undone and will remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-white hover:bg-destructive/90"
                    onClick={() => handleDelete(user.id)}
                  >
                    {isDeleting && pendingDeleteId === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          /* PENDING user: two buttons open the same controlled dialog */
          <>
            <Button
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white gap-1"
              onClick={() => onOpenAction("approve")}
              aria-label={`Approve ${user.first_name}`}
            >
              <Check className="w-4 h-4" />
              Approve
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50 gap-1"
              onClick={() => onOpenAction("decline")}
              aria-label={`Decline ${user.first_name}`}
            >
              <X className="w-4 h-4" />
              Decline
            </Button>

            {/* Single AlertDialog for both actions */}
            <AlertDialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {pendingAction === "approve" ? "Approve User" : "Decline User"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {pendingAction === "approve" ? (
                      <>Are you sure you want to approve <strong>{user?.first_name} {user?.parent_name}</strong> as an instructor?</>
                    ) : (
                      <>Are you sure you want to decline <strong>{user?.first_name} {user?.parent_name}</strong>'s request? This action cannot be undone.</>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                  <Button
                    className={pendingAction === "approve" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
                    onClick={handleConfirm}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {pendingAction === "approve" ? "Approve" : "Decline"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </Card>
  );
};

type UserInfoProps = {
  user: User;
  userType: "pending" | "user";
};

export const UserInfo = ({ user, userType }: UserInfoProps) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-12 h-12">
        <AvatarImage src={user.image_url} alt={`${user.first_name} ${user.parent_name}`} />
        <AvatarFallback className="bg-linear-to-br from-blue-500 to-teal-500 text-white">
          {user.first_name.charAt(0)}{user.parent_name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold text-foreground">{user.first_name} {user.parent_name}</h3>
        {userType === "user" ? (
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
              {formatRole(user.role)}
            </Badge>
            {user.code && (
              <Badge variant="secondary" className="text-xs">
                Code: {user.code}
              </Badge>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{user.email}</p>
        ) }
      </div>
    </div>
  )
}