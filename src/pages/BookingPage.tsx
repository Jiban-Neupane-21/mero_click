/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Box } from "@mui/material";
import BookingPortal from "../components/BookingPortal";

interface BookingPageProps {
  initialServiceId?: string;
}

export default function BookingPage({ initialServiceId }: BookingPageProps) {
  return (
    <Box id="page-book-session">
      <BookingPortal initialServiceId={initialServiceId} />
    </Box>
  );
}
