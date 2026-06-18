/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Box } from "@mui/material";
import VisaGuides from "../components/VisaGuides";
import InteractiveResizer from "../components/InteractiveResizer";

interface VisaGuidesPageProps {
  onScrollToResizer: () => void;
}

export default function VisaGuidesPage({
  onScrollToResizer,
}: VisaGuidesPageProps) {
  return (
    <Box id="page-visa-guides">
      <VisaGuides onScrollToResizer={onScrollToResizer} />
      <Box sx={{ mt: 4 }}>
        <InteractiveResizer />
      </Box>
    </Box>
  );
}
