/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Box, Container, Skeleton } from "@mui/material";
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
        <Box sx={{ py: { xs: 10, md: 14 } }}>
          <Container maxWidth="xl">
            {/* Header Skeleton */}
            <Box
              sx={{
                mb: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Skeleton
                variant="rounded"
                width={140}
                height={28}
                sx={{ mb: 2.5, borderRadius: "100px" }}
              />
              <Skeleton variant="text" width="50%" height={80} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="30%" height={24} />
            </Box>

            {/* Tabs Skeleton */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mb: 6,
                overflow: "hidden",
              }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="rounded" width={120} height={40} />
              ))}
            </Box>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Box key={i}>
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    sx={{ aspectRatio: "4/5" }}
                  />
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={24}
                    sx={{ mt: 2 }}
                  />
                  <Skeleton variant="text" width="40%" height={20} />
                </Box>
              ))}
            </div>
          </Container>
        </Box>
      ) : (
        <PortfolioGrid items={items} />
      )}
    </Box>
  );
}
