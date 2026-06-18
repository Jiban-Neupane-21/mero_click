/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import PortfolioGrid from "../components/PortfolioGrid";
import { apiService } from "../utils/supabase";
import { PortfolioItem } from "../types";

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await apiService.getPortfolioItems();
        setItems(data);
      } catch (err) {
        console.error("Failed to load live portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPortfolio();
  }, []);

  return (
    <Box id="page-portfolio" sx={{ minHeight: "60vh" }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#E50914" }} />
        </Box>
      ) : (
        <PortfolioGrid items={items} />
      )}
    </Box>
  );
}
