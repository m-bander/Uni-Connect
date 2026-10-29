import { Card, CardContent } from "@/components/ui/card"
import AnnouncementItem from "./AnnouncementItem"
import type { Announcement } from "@/types/student/announcement"

type DashboardAnnouncementsProps = {
  announcements: Announcement[]
  isLoading: boolean
}

export default function DashboardAnnouncements({
  announcements,
  isLoading,
}: DashboardAnnouncementsProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Recent Announcements
      </h2>
      <Card className="divide-y p-0 gap-0">
        {isLoading ? (
          <CardContent className="p-4 text-sm text-slate-500">
            Loading announcements...
          </CardContent>
        ) : announcements.length === 0 ? (
          <CardContent className="p-4 text-sm text-slate-500">
            No announcements found
          </CardContent>
        ) : (
          announcements.map((announcement) => (
            <AnnouncementItem
              key={announcement.id}
              announcement={announcement}
            />
          ))
        )}
      </Card>
    </section>
  )
}
