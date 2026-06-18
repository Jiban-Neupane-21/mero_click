/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Box } from "@mui/material";
import ServiceCatalog from "../components/ServiceCatalog";

interface ServicesPageProps {
  onSelectServiceForBooking: (serviceId: string) => void;
}

export default function ServicesPage({
  onSelectServiceForBooking,
}: ServicesPageProps) {
  return (
    <Box id="page-services">
      <ServiceCatalog onSelectServiceForBooking={onSelectServiceForBooking} />
    </Box>
  );
}
