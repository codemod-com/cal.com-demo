import { _generateMetadata } from "app/_utils";

import Workflows from "@calcom/features/ee/workflows/pages/index";

import type { CalPageWrapper } from "@components/PageWrapper";

export const generateMetadata = async () =>
  await _generateMetadata("workflows", "workflows_to_automate_notifications");

const WorkflowsPage = Workflows as CalPageWrapper;

export default WorkflowsPage;
