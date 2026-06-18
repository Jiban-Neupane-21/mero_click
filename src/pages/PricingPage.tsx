/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Box } from "@mui/material";
import PricingSection from "../components/PricingSection";

interface PricingPageProps {
  onBookPricingPackage: (serviceId: string) => void;
}

export default function PricingPage({
  onBookPricingPackage,
}: PricingPageProps) {
  return (
    <Box id="page-pricing">
      <PricingSection onBookPricingPackage={onBookPricingPackage} />
    </Box>
  );
}
