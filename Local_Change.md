# Kathmandu Studio Gallery Navigation Integration Guide

This details the latest high-fidelity category routing and dynamic filter linkage added between the **Hero Showcase** and the **Portfolio Grid** components. Follow these structural integration steps to reproduce this architecture in your original workspace.

---

## 🎨 Overview of the Flow
1. **Hero Category Cards (`src/components/Hero.tsx`)**: Visitors are greeted with a beautiful grid section highlighting four core studio specialties (Cinematic Weddings, Executive Portraits, Visa & Biometrics, and Custom Framing).
2. **Deep-Link Redirection**: When clicking any category card, the application securely navigates to `/portfolio?category=<CategoryName>` and scrolls smoothly to the top of the viewport.
3. **Responsive URL Search Parameters (`src/components/PortfolioGrid.tsx`)**: The portfolio grid reads the dynamic `category` query parameter on mount or route update, automatically synchronizing the sub-tab selection and instantly filtering shown masterpieces.

---

### 1️⃣ Part A: Enhancements to `src/components/PortfolioGrid.tsx`

To enable dynamic category filtering from external state, we leverage React Router's `useSearchParams`.

#### Step 1: Add the Import at the Top of the File
```typescript
import { useSearchParams } from 'react-router-dom';
```

#### Step 2: Establish State Synchronizers inside the `PortfolioGrid` Component
Re-engineer the `activeTab` state hook and add an active `useEffect` listener to query URL modifications:

```typescript
export default function PortfolioGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeTab, setActiveTab] = useState(() => {
    return categoryParam || 'all';
  });
  
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const theme = useTheme();

  // Watch for external query updates and update active filters
  useEffect(() => {
    if (categoryParam) {
      setActiveTab(categoryParam);
    } else {
      setActiveTab('all');
    }
  }, [categoryParam]);
```

#### Step 3: Define Filter Match Keys
Optimize the categories mapper to align tab keys directly with the backend collection classification identifiers:

```typescript
  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'Wedding', label: 'Cinematic Weddings' },
    { id: 'Portrait', label: 'Executive Portraits' },
    { id: 'Visa', label: 'Visa & Biometrics' },
    { id: 'Videography', label: 'Studio & Commercial Films' },
    { id: 'Photo Frame', label: 'Custom Framing' },
    { id: 'Product', label: 'Product & Catalog' },
  ];
```

#### Step 4: Map Tab Changing Events onto searchParams
Ensure switching tabs in the UI correctly updates the URL search variables so the state remains clean and deep-linkable:

```typescript
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: newValue });
    }
  };
```

---

### 2️⃣ Part B: Enhancements to `src/components/Hero.tsx`

We integrate structural navigation and add the visual segment beneath the main features block.

#### Step 1: Add the Link Routing Import at the Top of the File
```typescript
import { useNavigate } from 'react-router-dom';
```

#### Step 2: Extract Navigation Controls inside `Hero`
```typescript
export default function Hero({ onNavigate }: HeroProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  // Smooth redirects to the targeted portfolio filters
  const handleCategoryRedirect = (category: string) => {
    navigate(`/portfolio?category=${category}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
```

#### Step 3: Append the Category Cards Grid JSX Code Block
Place this component layout code block directly inside the last level of the main `Container` node in `src/components/Hero.tsx` (right before the closing container rendering tags):

```tsx
        {/* Explore Portfolios by Category Showcase Section */}
        <Box sx={{ mt: { xs: 10, md: 14 }, borderTop: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', pt: { xs: 8, md: 10 } }} id="hero-quick-portfolio-redirects">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{
                color: '#E50914',
                fontWeight: 600,
                letterSpacing: '0.15em',
                display: 'block',
                mb: 1.5,
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              QUICK ACCESS GALLERIES
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                mb: 2,
                color: 'text.primary',
              }}
            >
              Explore Portfolios by Specialty
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                maxWidth: '600px',
                mx: 'auto',
                fontWeight: 300,
              }}
            >
              Instantly drill down into our custom-captured galleries. Filter by your targeted style to check our high-fidelity output.
            </Typography>
          </Box>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Weddings */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300 }}
              id="category-card-wedding"
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 20px rgba(0,0,0,0.04)',
                }}
                onClick={() => handleCategoryRedirect('Wedding')}
              >
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
                  alt="Cinematic Weddings Portfolio"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.1) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 3,
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#ff4d4d', fontWeight: 600, mb: 0.5, letterSpacing: '0.05em' }}>
                    CINEMATIC WEDDINGS
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, mb: 1, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.05rem' }}>
                    Traditional Couples
                  </Typography>
                  <Button
                    variant="text"
                    sx={{
                      color: '#ffffff',
                      p: 0,
                      minWidth: 'auto',
                      justifyContent: 'flex-start',
                      fontSize: '0.8rem',
                      textTransform: 'none',
                      fontFamily: '"Space Grotesk", sans-serif',
                      '&:hover': { color: '#ff4d4d', backgroundColor: 'transparent' },
                    }}
                  >
                    View Wedding Portfolio →
                  </Button>
                </Box>
              </Box>
            </motion.div>

            {/* Card 2: Executive Portraits */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300 }}
              id="category-card-portrait"
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 20px rgba(0,0,0,0.04)',
                }}
                onClick={() => handleCategoryRedirect('Portrait')}
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
                  alt="Executive Portraits Portfolio"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.1) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 3,
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#ff4d4d', fontWeight: 600, mb: 0.5, letterSpacing: '0.05em' }}>
                    EXECUTIVE PORTRAITS
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, mb: 1, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.05rem' }}>
                    Professional Headshots
                  </Typography>
                  <Button
                    variant="text"
                    sx={{
                      color: '#ffffff',
                      p: 0,
                      minWidth: 'auto',
                      justifyContent: 'flex-start',
                      fontSize: '0.8rem',
                      textTransform: 'none',
                      fontFamily: '"Space Grotesk", sans-serif',
                      '&:hover': { color: '#ff4d4d', backgroundColor: 'transparent' },
                    }}
                  >
                    View Portrait Portfolio →
                  </Button>
                </Box>
              </Box>
            </motion.div>

            {/* Card 3: Visa & Biometrics */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300 }}
              id="category-card-visa"
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 20px rgba(0,0,0,0.04)',
                }}
                onClick={() => handleCategoryRedirect('Visa')}
              >
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"
                  alt="Visa & Biometrics Portfolio"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.1) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 3,
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#ff4d4d', fontWeight: 600, mb: 0.5, letterSpacing: '0.05em' }}>
                    VISA & BIOMETRICS
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, mb: 1, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.05rem' }}>
                    Official Embassy Photos
                  </Typography>
                  <Button
                    variant="text"
                    sx={{
                      color: '#ffffff',
                      p: 0,
                      minWidth: 'auto',
                      justifyContent: 'flex-start',
                      fontSize: '0.8rem',
                      textTransform: 'none',
                      fontFamily: '"Space Grotesk", sans-serif',
                      '&:hover': { color: '#ff4d4d', backgroundColor: 'transparent' },
                    }}
                  >
                    View Biometric Portfolio →
                  </Button>
                </Box>
              </Box>
            </motion.div>

            {/* Card 4: Custom Framing */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300 }}
              id="category-card-framing"
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 20px rgba(0,0,0,0.04)',
                }}
                onClick={() => handleCategoryRedirect('Photo Frame')}
              >
                <img
                  src="https://images.unsplash.com/photo-1603184017968-902a6285a521?auto=format&fit=crop&q=80&w=800"
                  alt="Custom Framing Portfolio"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.1) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 3,
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#ff4d4d', fontWeight: 600, mb: 0.5, letterSpacing: '0.05em' }}>
                    CUSTOM FRAMING
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, mb: 1, fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.05rem' }}>
                    Handcrafted Wood Frames
                  </Typography>
                  <Button
                    variant="text"
                    sx={{
                      color: '#ffffff',
                      p: 0,
                      minWidth: 'auto',
                      justifyContent: 'flex-start',
                      fontSize: '0.8rem',
                      textTransform: 'none',
                      fontFamily: '"Space Grotesk", sans-serif',
                      '&:hover': { color: '#ff4d4d', backgroundColor: 'transparent' },
                    }}
                  >
                    View Framing Portfolio →
                  </Button>
                </Box>
              </Box>
            </motion.div>
          </div>
        </Box>
```
