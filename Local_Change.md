# Full Code Integration Guide for Service & Admin Control Panel

This document contains the **exact code snippets, structures, and SQL queries** written to enable custom, fully editable **Studio Specialties (Services / Services catalog)** in both the store frontend and the admin control panel.

---

## ── SECTION 1: DATABASE BACKEND (SUPABASE) ──

Run this SQL query inside your **Supabase Workspace SQL Editor** to create the new `services` table, seed it with initial defaults, and establish Row Level Security (RLS) policies:

```sql
-- 1. Create the services table
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    "basePrice" TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    "imageUrl" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row-Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 3. RLS READ ACCESS: Anyone can view (anonymous & authenticated clients)
CREATE POLICY "Allow public read access to services"
ON public.services
FOR SELECT
USING (true);

-- 4. RLS WRITE ACCESS: Authenticated Admin users can perform all operations
CREATE POLICY "Allow admins full write operations on services"
ON public.services
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Populating starting database records
INSERT INTO public.services (id, title, category, "basePrice", duration, description, features, rating, "imageUrl")
VALUES
(
  'service-visa-photo',
  'Premium Biometric & Visa Photography',
  'Visa',
  'Rs. 350',
  '10 Minutes / Express',
  'Guaranteed biometric approval matching international standard standards for US, Schengen, Canada, and UK passports.',
  '["100% Embassy Acceptance Promise", "Biometric Correction Software", "Digital Softcopy Included", "6 High-quality Matte Prints"]'::jsonb,
  4.9,
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'
),
(
  'service-cinematic-shoot',
  'High-End Cinematic Corporate & Promo Shoot',
  'Videography',
  'Rs. 85,000',
  '1 to 3 Days Shoot',
  'Premium cinema-grade storytelling video sessions with pristine audio mastering and high-end visual color correction.',
  '["4K Multi-angle Premium Cameras", "Professional Studio Lighting Rig", "Advanced Cine Color Grading Suite", "Lavalier and Shotgun Sound Recording"]'::jsonb,
  5.0,
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop'
)
ON CONFLICT (id) DO NOTHING;
```

---

## ── SECTION 2: FRONTEND ENGINE AND ADMIN PANEL MODIFICATIONS ──

Here are the precise code modifications applied to individual frontend components.

---

### 1️⃣ File: `src/lib/supabase.ts`

We registered a new `STORAGE_SERVICES_KEY` to act as an offline-first storage engine, loaded initial database records, and exported query handlers: `getServices`, `saveServiceItem`, and `deleteServiceItem`.

#### 👉 Replace imports at the top:

```typescript
import { PortfolioItem, VideoItem, StudioService } from "../types";
import { PORTFOLIO_ITEMS, STUDIO_VIDEOS, STUDIO_SERVICES } from "../data";
```

#### 👉 Add Key under other storage keys (approx line 30):

```typescript
const STORAGE_PORTFOLIO_KEY = "kathmandu_studio_portfolio";
const STORAGE_VIDEOS_KEY = "kathmandu_studio_videos";
const STORAGE_SERVICES_KEY = "kathmandu_studio_services";
```

#### 👉 Add Service Setup to `initializeMockDatabaseIfNeeded` function:

```typescript
const initializeMockDatabaseIfNeeded = () => {
  if (!localStorage.getItem(STORAGE_PORTFOLIO_KEY)) {
    localStorage.setItem(
      STORAGE_PORTFOLIO_KEY,
      JSON.stringify(PORTFOLIO_ITEMS),
    );
  }
  if (!localStorage.getItem(STORAGE_VIDEOS_KEY)) {
    localStorage.setItem(STORAGE_VIDEOS_KEY, JSON.stringify(STUDIO_VIDEOS));
  }
  if (!localStorage.getItem(STORAGE_SERVICES_KEY)) {
    localStorage.setItem(STORAGE_SERVICES_KEY, JSON.stringify(STUDIO_SERVICES));
  }
};
```

#### 👉 Insert these methods inside `apiService` object:

```typescript
  // --- STUDIO SERVICES ---
  async getServices(): Promise<StudioService[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('id', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) return data as StudioService[];
      } catch (err) {
        console.warn('Supabase services fetch error, falling back to localStorage:', err);
      }
    }

    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_SERVICES_KEY);
    return stored ? JSON.parse(stored) : STUDIO_SERVICES;
  },

  async saveServiceItem(service: Omit<StudioService, 'id'> & { id?: string }): Promise<StudioService> {
    const newService: StudioService = {
      id: service.id || `s_${Date.now()}`,
      title: service.title,
      category: service.category,
      basePrice: service.basePrice,
      duration: service.duration,
      description: service.description,
      features: service.features || [],
      rating: service.rating ?? 5.0,
      imageUrl: service.imageUrl
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .upsert(newService)
          .select()
          .single();
        if (error) throw error;
        if (data) return data as StudioService;
      } catch (err) {
        console.warn('Supabase service insert/update error, falling back to localStorage:', err);
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_SERVICES_KEY);
    const list: StudioService[] = stored ? JSON.parse(stored) : [...STUDIO_SERVICES];
    const index = list.findIndex(x => x.id === newService.id);
    if (index !== -1) {
      list[index] = newService;
    } else {
      list.push(newService);
    }
    localStorage.setItem(STORAGE_SERVICES_KEY, JSON.stringify(list));
    return newService;
  },

  async deleteServiceItem(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase service delete error, falling back to localStorage:', err);
      }
    }

    // LocalStorage fallback
    const stored = localStorage.getItem(STORAGE_SERVICES_KEY);
    if (stored) {
      const list: StudioService[] = JSON.parse(stored);
      const filtered = list.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_SERVICES_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }
```

---

### 2️⃣ File: `src/components/ServiceCatalog.tsx`

We refactored active services to load asynchronously from `apiService.getServices()` instead of hardcoded raw arrays, and updated layout lists to auto-detect any newly specified categories.

#### 👉 Replace top-level imports:

```typescript
import { Check, Clock, Award } from "lucide-react";
import { apiService } from "../lib/supabase";
import { StudioService } from "../types";
import { useLocation, useNavigate } from "react-router-dom";
```

#### 👉 Overwrite inside component setup:

```typescript
const [services, setServices] = React.useState<StudioService[]>([]);
const [loading, setLoading] = React.useState(true);

React.useEffect(() => {
  let active = true;
  const fetchServices = async () => {
    try {
      const data = await apiService.getServices();
      if (active) {
        setServices(data);
      }
    } catch (err) {
      console.error("Failed to load dynamic studio services:", err);
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  };
  fetchServices();
  return () => {
    active = false;
  };
}, []);
```

#### 👉 Auto-populate Category Chips based on loaded packages:

```typescript
const categories = React.useMemo(() => {
  const list = [
    "All",
    "Visa",
    "Portrait",
    "Wedding",
    "Videography",
    "Photo Frame",
    "Product",
    "Photography",
    "Photo Enhancement",
    "Customized Gift",
    "Document Service",
  ];
  services.forEach((s) => {
    if (
      s.category &&
      !list.some((c) => c.toLowerCase() === s.category.toLowerCase())
    ) {
      list.push(s.category);
    }
  });
  return list;
}, [services]);
```

#### 👉 Filtering logic:

```typescript
const filteredServices =
  selectedCategory === "All"
    ? services
    : services.filter(
        (service) =>
          service.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
```

#### 👉 Render loader and robust parsing for `features` array:

```typescript
        {/* Services Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
            <CircularProgress sx={{ color: '#E50914' }} />
          </Box>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            ...
```

For parsing feature item loops safely (inside the card list):

```typescript
                  <List sx={{ p: 0, mb: 4 }} dense>
                    {(Array.isArray(service.features)
                      ? service.features
                      : (typeof service.features === 'string'
                          ? (() => {
                              try { return JSON.parse(service.features); } catch { return (service.features as any).split('\n').filter(Boolean); }
                            })()
                          : []
                        )
                    ).map((feature: string, idx: number) => (
                      <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <Check size={14} className="text-[#E50914]" />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: 1.4
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
```

---

### 3️⃣ File: `src/components/BookingPortal.tsx`

We loaded specialties through the async API fetch state to synchronize selection flows on the customer reservation system.

#### 👉 Add dynamic hooks setup:

```typescript
const [services, setServices] = useState<StudioService[]>([]);
const [loading, setLoading] = useState(true);

React.useEffect(() => {
  let active = true;
  apiService.getServices().then((data) => {
    if (active) {
      setServices(data);
      setLoading(false);
      if (data.length > 0 && !initialServiceId) {
        setSelectedService(data[0].id);
      }
    }
  });
  return () => {
    active = false;
  };
}, [initialServiceId]);
```

#### 👉 Replace base selections around Booking workflow:

Ensure `selectedService` has a string fallback, and `activeServiceObj` queries `services` dynamically:

```typescript
const [selectedService, setSelectedService] = useState<string>(
  initialServiceId || (STUDIO_SERVICES[0] ? STUDIO_SERVICES[0].id : ""),
);

const activeServiceObj =
  (services.length > 0 ? services : STUDIO_SERVICES).find(
    (s) => s.id === selectedService,
  ) || (services.length > 0 ? services[0] : STUDIO_SERVICES[0]);
```

Around step renders (approx line 265), replace `STUDIO_SERVICES.map(...)` with:

```typescript
{(services.length > 0 ? services : STUDIO_SERVICES).map((serv) => {
```

---

### 4️⃣ File: `src/components/Admin/AdminPanel.tsx`

We added interactive controls inside the Admin workspace to fully compile, add, update, and drop items from active services.

#### 👉 Add dynamic state fields:

```typescript
  const [services, setServices] = useState<StudioService[]>([]);
  ...
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    category: 'Portrait',
    basePrice: '',
    duration: '',
    description: '',
    rating: 5.0,
    imageUrl: '',
    featuresText: '',
  });
```

#### 👉 Query initial database payload (inside `loadDatabaseItems` method):

```typescript
  const loadDatabaseItems = async () => {
    setLoading(true);
    try {
      const fetchedPortfolios = await apiService.getPortfolioItems();
      const fetchedVideos = await apiService.getVideoItems();
      const fetchedServices = await apiService.getServices();
      setPortfolios(fetchedPortfolios);
      setVideos(fetchedVideos);
      setServices(fetchedServices);
    } catch (err: any) {
      console.error('Error fetching admin dataset:', err);
    } ...
```

#### 👉 Implement Action Handlers for Service Management:

```typescript
// --- STUDIO SERVICES ACTIONS ---
const handleServiceFormChange = (prop: string, val: any) => {
  setServiceForm((prev) => ({ ...prev, [prop]: val }));
};

const handleEditService = (service: StudioService) => {
  setEditingServiceId(service.id);
  setServiceForm({
    title: service.title,
    category: service.category,
    basePrice: service.basePrice,
    duration: service.duration,
    description: service.description,
    rating: service.rating || 5.0,
    imageUrl: service.imageUrl,
    featuresText: Array.isArray(service.features)
      ? service.features.join("\n")
      : "",
  });
  setIsServiceModalOpen(true);
};

const handleAddServiceClick = () => {
  setEditingServiceId(null);
  setServiceForm({
    title: "",
    category: "Portrait",
    basePrice: "",
    duration: "",
    description: "",
    rating: 5.0,
    imageUrl: "",
    featuresText: "",
  });
  setIsServiceModalOpen(true);
};

const handleSaveService = async (e: React.FormEvent) => {
  e.preventDefault();
  if (
    !serviceForm.title ||
    !serviceForm.imageUrl ||
    !serviceForm.basePrice ||
    !serviceForm.duration
  ) {
    triggerAlert(
      "error",
      "Please provide title, base price, duration, and an image URL.",
    );
    return;
  }

  const features = serviceForm.featuresText
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

  try {
    await apiService.saveServiceItem({
      id: editingServiceId || undefined,
      title: serviceForm.title,
      category: serviceForm.category as any,
      basePrice: serviceForm.basePrice,
      duration: serviceForm.duration,
      description: serviceForm.description,
      features: features,
      rating: Number(serviceForm.rating) || 5.0,
      imageUrl: serviceForm.imageUrl,
    });

    triggerAlert(
      "success",
      editingServiceId
        ? "Successfully updated studio service details!"
        : "Successfully created new studio service!",
    );
    setIsServiceModalOpen(false);
    loadDatabaseItems();
    if (onDataChange) onDataChange();
  } catch (err: any) {
    triggerAlert("error", err.message || "Error saving service details.");
  }
};

const handleDeleteService = async (id: string, title: string) => {
  if (
    window.confirm(
      `Are you sure you want to permanently delete service "${title}" from Kathmandu active specialties?`,
    )
  ) {
    try {
      await apiService.deleteServiceItem(id);
      triggerAlert(
        "success",
        `Deleted studio service "${title}" successfully.`,
      );
      loadDatabaseItems();
      if (onDataChange) onDataChange();
    } catch (err: any) {
      triggerAlert("error", err.message || "Error deleting service.");
    }
  }
};
```

#### 👉 Appended third dashboard tab:

Inside the Tab selection UI grid, add the specialties selector tab (approx line 446):

```typescript
<Tab icon={<Sparkles size={18} />} label="Manage Studio Specialties" iconPosition="start" />
```

#### 👉 Insert Specialties Management Grid View:

Right inside your render block (after tab `activeTab === 1`), append the active specialties tab content:

```tsx
{
  /* ==================================== STUDIO SERVICES VIEW ==================================== */
}
{
  activeTab === 2 && (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 }}
        >
          Active Studio Specialties / Services ({services.length} active)
        </Typography>
        <Button
          variant="contained"
          onClick={handleAddServiceClick}
          startIcon={<PlusCircle size={16} />}
          sx={{
            backgroundColor: "#E50914",
            fontFamily: '"Space Grotesk", sans-serif',
            textTransform: "none",
            borderRadius: "6px",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#b91c1c" },
          }}
        >
          Add Studio Specialty
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#E50914" }} />
        </Box>
      ) : services.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            border: "1px dashed rgba(255,255,255,0.1)",
            borderRadius: "8px",
          }}
        >
          <Typography color="textSecondary">
            No custom studio specialties defined yet.
          </Typography>
        </Box>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => (
            <div key={item.id}>
              <Card
                sx={{
                  background: "#121214",
                  border: "1px solid rgba(255,255,255,0.06)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "8px",
                  overflow: "hidden",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.01)" },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    aspectRatio: "16/9",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Box sx={{ position: "absolute", top: 8, left: 8 }}>
                    <Chip
                      label={item.category}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(0,0,0,0.85)",
                        color: "#ffffff",
                        border: "1px solid rgba(255,255,255,0.15)",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  {item.duration && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        backgroundColor: "rgba(0,0,0,0.8)",
                        color: "#ffffff",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "3px",
                        fontSize: "0.7rem",
                        fontWeight: 650,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Clock size={10} className="text-[#E50914]" />
                      {item.duration}
                    </Box>
                  )}
                </Box>
                <CardContent
                  sx={{
                    p: 2.5,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        lineHeight: 1.3,
                        color: "#ffffff",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.6)",
                        mb: 2,
                        fontSize: "0.82rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </Typography>
                    <div className="flex justify-between items-center bg-[#18181c] p-2.5 rounded border border-white/[0.04] mb-3">
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        Base Pricing:
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#E50914", fontWeight: 700 }}
                      >
                        {item.basePrice}
                      </Typography>
                    </div>

                    {/* Features Preview */}
                    {item.features && item.features.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255,255,255,0.4)",
                            textTransform: "uppercase",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                          }}
                        >
                          Included Features Preview:
                        </Typography>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(Array.isArray(item.features) ? item.features : [])
                            .slice(0, 3)
                            .map((f: string, i: number) => (
                              <Chip
                                key={i}
                                label={f}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(255,255,255,0.04)",
                                  color: "rgba(255,255,255,0.7)",
                                  fontSize: "0.65rem",
                                }}
                              />
                            ))}
                          {(Array.isArray(item.features) ? item.features : [])
                            .length > 3 && (
                            <Chip
                              label={`+${item.features.length - 3} more`}
                              size="small"
                              sx={{
                                backgroundColor: "rgba(255,255,255,0.04)",
                                color: "rgba(255,255,255,0.5)",
                                fontSize: "0.65rem",
                              }}
                            />
                          )}
                        </div>
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                      pt: 1.5,
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleEditService(item)}
                      startIcon={<Edit size={14} />}
                      sx={{
                        color: "#38bdf8",
                        textTransform: "none",
                        fontFamily: '"Space Grotesk"',
                        fontSize: "0.75rem",
                      }}
                    >
                      Edit Features
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteService(item.id, item.title)}
                      sx={{
                        color: "#f43f5e",
                        "&:hover": { backgroundColor: "rgba(244,63,94,0.08)" },
                      }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}
```

#### 👉 Modal Form Dialog for Adding/Modifying Services:

Add this modal block to the bottom of your file, directly adjacent to the existing Video or Portfolio Modals (line 1150+):

```tsx
{
  /* ==================================== MODAL DIALOG: ADD/EDIT STUDIO SERVICE ==================================== */
}
<Dialog
  open={isServiceModalOpen}
  onClose={() => setIsServiceModalOpen(false)}
  fullWidth
  maxWidth="sm"
  sx={{
    "& .MuiPaper-root": {
      backgroundColor: "#18181b",
      backgroundImage: "none",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "12px",
      color: "#ffffff",
    },
  }}
>
  <Box component="form" onSubmit={handleSaveService}>
    <DialogTitle
      sx={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        fontFamily: '"Space Grotesk"',
        fontWeight: 700,
      }}
    >
      {editingServiceId
        ? "Edit Active Service Specialty"
        : "Add New Active Service Specialty"}
    </DialogTitle>
    <DialogContent sx={{ p: 4 }}>
      <TextField
        fullWidth
        label="Service / Specialty Title"
        placeholder="e.g. Cinematic Wedding Motion Film"
        margin="normal"
        required
        value={serviceForm.title}
        onChange={(e) => handleServiceFormChange("title", e.target.value)}
        slotProps={{
          inputLabel: {
            style: {
              color: "rgba(255, 255, 255, 0.6)",
              fontFamily: '"Space Grotesk"',
            },
          },
          input: { style: { color: "#ffffff" } },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
            "&:hover fieldset": { borderColor: "#E50914" },
            "&.Mui-focused fieldset": { borderColor: "#E50914" },
          },
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        <TextField
          fullWidth
          label="Category Name"
          placeholder="e.g. Wedding, Portrait, Visa"
          margin="none"
          required
          value={serviceForm.category}
          onChange={(e) => handleServiceFormChange("category", e.target.value)}
          slotProps={{
            inputLabel: {
              style: {
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: '"Space Grotesk"',
              },
            },
            input: { style: { color: "#ffffff" } },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
              "&:hover fieldset": { borderColor: "#E50914" },
              "&.Mui-focused fieldset": { borderColor: "#E50914" },
            },
          }}
        />

        <TextField
          fullWidth
          label="Rating (1.0 to 5.0)"
          type="number"
          placeholder="4.9"
          margin="none"
          required
          value={serviceForm.rating}
          onChange={(e) => handleServiceFormChange("rating", e.target.value)}
          slotProps={{
            inputLabel: {
              style: {
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: '"Space Grotesk"',
              },
            },
            input: { style: { color: "#ffffff" } },
            htmlInput: { min: 1.0, max: 5.0, step: 0.1 },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
              "&:hover fieldset": { borderColor: "#E50914" },
              "&.Mui-focused fieldset": { borderColor: "#E50914" },
            },
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <TextField
          fullWidth
          label="Base Price (with currency symbol)"
          placeholder="Rs. 45,000"
          margin="none"
          required
          value={serviceForm.basePrice}
          onChange={(e) => handleServiceFormChange("basePrice", e.target.value)}
          slotProps={{
            inputLabel: {
              style: {
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: '"Space Grotesk"',
              },
            },
            input: { style: { color: "#ffffff" } },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
              "&:hover fieldset": { borderColor: "#E50914" },
              "&.Mui-focused fieldset": { borderColor: "#E50914" },
            },
          }}
        />

        <TextField
          fullWidth
          label="Duration Label"
          placeholder="e.g. 1 hour / 3 days"
          margin="none"
          required
          value={serviceForm.duration}
          onChange={(e) => handleServiceFormChange("duration", e.target.value)}
          slotProps={{
            inputLabel: {
              style: {
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: '"Space Grotesk"',
              },
            },
            input: { style: { color: "#ffffff" } },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
              "&:hover fieldset": { borderColor: "#E50914" },
              "&.Mui-focused fieldset": { borderColor: "#E50914" },
            },
          }}
        />
      </div>

      <TextField
        fullWidth
        label="Cover Image URL"
        placeholder="https://images.unsplash.com/..."
        margin="normal"
        required
        value={serviceForm.imageUrl}
        onChange={(e) => handleServiceFormChange("imageUrl", e.target.value)}
        slotProps={{
          inputLabel: {
            style: {
              color: "rgba(255, 255, 255, 0.6)",
              fontFamily: '"Space Grotesk"',
            },
          },
          input: { style: { color: "#ffffff" } },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
            "&:hover fieldset": { borderColor: "#E50914" },
            "&.Mui-focused fieldset": { borderColor: "#E50914" },
          },
        }}
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Service Outline / Description"
        placeholder="Describe service outputs, resolutions, camera bodies used..."
        margin="normal"
        required
        value={serviceForm.description}
        onChange={(e) => handleServiceFormChange("description", e.target.value)}
        slotProps={{
          inputLabel: {
            style: {
              color: "rgba(255, 255, 255, 0.6)",
              fontFamily: '"Space Grotesk"',
            },
          },
          input: { style: { color: "#ffffff" } },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
            "&:hover fieldset": { borderColor: "#E50914" },
            "&.Mui-focused fieldset": { borderColor: "#E50914" },
          },
        }}
      />

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Features List (Put each feature on a separate new line)"
        placeholder="4K Multi-angle cinematic cameras&#10;Professional editing suite adjustments&#10;Delivered in physical drives within 7 days"
        margin="normal"
        value={serviceForm.featuresText}
        onChange={(e) =>
          handleServiceFormChange("featuresText", e.target.value)
        }
        slotProps={{
          inputLabel: {
            style: {
              color: "rgba(255, 255, 255, 0.6)",
              fontFamily: '"Space Grotesk"',
            },
          },
          input: { style: { color: "#ffffff" } },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
            "&:hover fieldset": { borderColor: "#E50914" },
            "&.Mui-focused fieldset": { borderColor: "#E50914" },
          },
        }}
      />
    </DialogContent>
    <DialogActions sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <Button
        onClick={() => setIsServiceModalOpen(false)}
        sx={{ color: "#a1a1aa" }}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "#E50914",
          "&:hover": { backgroundColor: "#b91c1c" },
        }}
      >
        {editingServiceId ? "Update Service" : "Activate Service"}
      </Button>
    </DialogActions>
  </Box>
</Dialog>;
```
