/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Box } from "@mui/material";
import InteractiveResizer from "../components/InteractiveResizer";

export default function ResizerPage() {
  return (
    <Box id="page-resizer">
      <InteractiveResizer />
    </Box>
  );
}
