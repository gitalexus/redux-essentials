import { formatDistanceToNow, parseISO } from "date-fns";
import { FC } from "react";

interface TimeAgoProps {
  timestamp: string;
}

const TimeAgo: FC<TimeAgoProps> = ({ timestamp }) => {
  const date = parseISO(timestamp);
  const timePeriod = formatDistanceToNow(date);

  return (
    <span title={timestamp}>
      &nbsp; <i>{timePeriod}</i> ago
    </span>
  );
};

export default TimeAgo;
