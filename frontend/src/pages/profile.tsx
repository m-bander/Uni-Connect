import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { ChangeProfileImageModal } from "@/components/profile/ChangeProfileImageModal";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { useProfileData } from "@/hooks/use-profile-data";
import { Lock, UserRoundPen } from "lucide-react";

export const PersonalProfilePage = () => {
  const { profileData, isLoading } = useProfileData();
  return (
    <div className="w-full flex flex-col items-center  m-auto p-10 h-full md:w-full xl:w-6/10">
      <div className="flex flex-row justify-start w-full">
        <div className="">
          <Avatar className="w-30 h-30 mr-5 rounded-lg">
            <AvatarImage
              src={profileData?.image_url}
              className="object-cover"
            />
            <AvatarFallback className="rounded-lg">ST</AvatarFallback>
          </Avatar>
          {!isLoading && (
            <ChangeProfileImageModal image_url={profileData?.image_url} />
          )}
        </div>
        <div className="flex flex-col justify-center items-start ml-5">
          <h1 className="font-bold text-4xl mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your UniConnect account.</p>
        </div>
      </div>
      <Tabs defaultValue="profile" className="w-full mt-2">
        <TabsList className="w-full">
          <TabsTrigger value="profile">
            <UserRoundPen />
            <span className="max-md:hidden">Profile Settings</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock />
            <span className="max-md:hidden">Security Settings</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card className="p-5 flex items-center justify-center ">
            {!isLoading && !profileData && (
              <p className="text-red-500">
                An error has occurred couldn't load profile data.
              </p>
            )}
            {isLoading ? (
              <Spinner className="size-8 text-gray-500" />
            ) : (
              profileData && <ProfileForm userData={profileData} />
            )}
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card className="p-5 flex items-center justify-center ">
            <ChangePasswordForm />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
