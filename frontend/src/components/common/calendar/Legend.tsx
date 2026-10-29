import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EVENT_TYPE_TO_STYLINGS } from "@/constants/student/calendar";

const Legend = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Legend</CardTitle>
        <CardDescription>Indicator color to deadline type.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2">
        <ul>
          {Object.entries(EVENT_TYPE_TO_STYLINGS)
            .slice(0, 3)
            .map(([eventType, stylings], index) => (
              <li key={eventType + index} className="flex gap-2 items-center">
                <span
                  className={`rounded-full size-[6px] inline-block ${stylings.backgroundColorClassName}`}
                />
                <p className="mb-0.5 capitalize">{eventType}</p>
              </li>
            ))}
        </ul>
        <ul>
          {Object.entries(EVENT_TYPE_TO_STYLINGS)
            .slice(3)
            .map(([eventType, stylings], index) => (
              <li key={eventType + index} className="flex gap-2 items-center">
                <span
                  className={`rounded-full size-[6px] inline-block ${stylings.backgroundColorClassName}`}
                />
                <p className="mb-0.5 capitalize">{eventType}</p>
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Legend;
