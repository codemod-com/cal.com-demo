import { Info } from "lucide-react";

import { Tooltip } from "@calcom/ui";

export default function InfoBadge({ content }: { content: string }) {
  return (
    <>
      <Tooltip side="top" content={content}>
        <span title={content}>
          <Info className="text-subtle relative left-1 right-1 top-px mt-px h-4 w-4" />
        </span>
      </Tooltip>
    </>
  );
}
