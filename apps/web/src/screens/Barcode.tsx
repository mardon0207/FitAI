import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Phone, Button, FoodThumb } from '@/design/primitives';
import { Icon } from '@/design/Icon';
import { FIT } from '@/design/tokens';
import { useDiary } from '@/stores/diary';
import { usePrefs, useT } from '@/stores/prefs';
import type { MealType } from '@fit/shared-types';

export function BarcodeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useT();
  const dark = usePrefs((s) => s.theme === 'dark');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<boolean>(false);
  
  const addEntry = useDiary((s) => s.addEntry);

  useEffect(() => {
    let controls: any = null;
    let isComponentMounted = true;

    async function startScanner() {
      try {
        const reader = new BrowserMultiFormatReader();
        // Delay to ensure the video element is properly rendered and ready
        await new Promise(res => setTimeout(res, 300));
        
        if (!videoRef.current || !isComponentMounted) return;

        controls = await reader.decodeFromConstraints(
          {
            audio: false,
            video: { facingMode: 'environment' }
          },
          videoRef.current,
          (result, err) => {
            if (result && isComponentMounted) {
              setScannedBarcode(result.getText());
              if (controls) controls.stop();
            }
          }
        );
      } catch (e) {
        console.error("Camera error:", e);
        if (isComponentMounted) setCameraError(true);
      }
    }

    if (!scannedBarcode) {
      startScanner();
    }

    return () => {
      isComponentMounted = false;
      if (controls) controls.stop();
    };
  }, [scannedBarcode]);

  useEffect(() => {
    if (!scannedBarcode) return;
    
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${scannedBarcode}.json`);
        const data = await res.json();
        
        if (data.status === 1 && data.product) {
          setProduct(data.product);
        } else {
          setError("Mahsulot bazada topilmadi. O'zingiz kiritishingiz mumkin.");
        }
      } catch(e) {
        setError("Tarmoq xatosi. Internetni tekshiring.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [scannedBarcode]);

  const handleAdd = () => {
    if (!product) return;
    
    const nut = product.nutriments || {};
    // Extract nutrients safely
    const kcal = nut['energy-kcal_100g'] ?? nut['energy_100g'] ?? 0;
    const protein = nut['proteins_100g'] ?? 0;
    const carbs = nut['carbohydrates_100g'] ?? 0;
    const fat = nut['fat_100g'] ?? 0;
    
    const hour = new Date().getHours();
    const defaultMeal: MealType = hour < 11 ? 'breakfast' : hour < 16 ? 'lunch' : hour < 21 ? 'dinner' : 'snack';
    
    addEntry({
      mealType: location.state?.meal || defaultMeal,
      foodSlug: `off_${scannedBarcode}`,
      foodName: product.product_name || 'Noma\'lum mahsulot',
      foodEmoji: '📦',
      quantity: 1,
      unit: 'g',
      grams: 100, // By default 100g since OFF data is per 100g
      kcal,
      protein,
      carbs,
      fat,
      micros: {},
      note: product.brands,
    });
    
    navigate('/diary');
  };

  const resetScanner = () => {
    setProduct(null);
    setError(null);
    setScannedBarcode(null);
  };

  return (
    <Phone dark statusColor="#fff">
      <div style={{
        flex: 1, background: '#000', position: 'relative', overflow: 'hidden',
      }}>
        {/* Camera Stream */}
        <video 
          ref={videoRef}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            opacity: scannedBarcode ? 0.3 : 1
          }}
          autoPlay
          playsInline
          muted
        />

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 50, left: 0, right: 0,
          padding: '0 20px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', zIndex: 10,
        }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Yopish"
            style={{
              width: 40, height: 40, borderRadius: 20,
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}
          >
            <Icon name="close" size={20} color="#fff" strokeWidth={2.5} />
          </button>
          <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Shtrix-kod</div>
          <button
            type="button"
            aria-label="Flash"
            style={{
              width: 40, height: 40, borderRadius: 20,
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}
          >
            <Icon name="flash" size={20} color={FIT.accent} strokeWidth={2} />
          </button>
        </div>

        {cameraError && !scannedBarcode && (
          <div style={{
            position: 'absolute', top: '50%', left: 20, right: 20,
            transform: 'translateY(-50%)', background: 'rgba(255,0,0,0.8)',
            color: '#fff', padding: 20, borderRadius: 16, textAlign: 'center', backdropFilter: 'blur(10px)'
          }}>
            <Icon name="alert" size={32} color="#fff" />
            <div style={{ marginTop: 10, fontWeight: 600, fontSize: 16 }}>Kameraga ulanib bo'lmadi</div>
            <div style={{ fontSize: 13, marginTop: 4, opacity: 0.8 }}>
              Kameraga ruxsat berilmagan yoki ulanishda xato.
            </div>
            <Button size="sm" variant="primary" style={{ marginTop: 16, width: '100%' }} onClick={() => navigate('/manual')}>
              Qo'lda kiritish
            </Button>
          </div>
        )}

        {/* Scan frame */}
        {!scannedBarcode && !cameraError && (
          <>
            <div style={{
              position: 'absolute', top: '32%', left: '50%',
              transform: 'translateX(-50%)', width: 240, height: 160,
            }}>
              <Corner position="tl" />
              <Corner position="tr" />
              <Corner position="bl" />
              <Corner position="br" />
              <div style={{
                position: 'absolute', top: '50%', left: 10, right: 10,
                height: 2, background: FIT.danger, boxShadow: `0 0 12px ${FIT.danger}`,
              }} />
            </div>

            <div style={{
              position: 'absolute', bottom: 180, left: 0, right: 0,
              textAlign: 'center', color: '#fff', fontSize: 13,
            }}>
              <div style={{ fontWeight: 600 }}>Shtrix-kodni ramka ichiga joylashtiring</div>
              <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>OpenFoodFacts bazasidan</div>
            </div>
          </>
        )}

        {/* Preview sheet / Loading / Error */}
        {scannedBarcode && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: dark ? FIT.surface : '#fff', 
            color: dark ? '#fff' : FIT.text,
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: '16px 20px 30px',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              width: 36, height: 4, background: FIT.border, borderRadius: 2, margin: '0 auto 16px',
            }} />
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ 
                  width: 30, height: 30, border: `3px solid ${FIT.border}`, 
                  borderTopColor: FIT.primary, borderRadius: '50%', 
                  margin: '0 auto 12px', animation: 'spin 1s linear infinite' 
                }} />
                <div style={{ fontWeight: 600 }}>Qidirilmoqda...</div>
                <div style={{ fontSize: 12, color: FIT.textMuted, marginTop: 4, fontFamily: FIT.mono }}>{scannedBarcode}</div>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: FIT.danger }}>Topilmadi</div>
                <div style={{ fontSize: 13, color: FIT.textMuted, marginTop: 4 }}>{error}</div>
                <div style={{ fontSize: 11, color: FIT.textMuted, marginTop: 4, fontFamily: FIT.mono }}>{scannedBarcode}</div>
                
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <Button size="md" variant="secondary" onClick={resetScanner} style={{ flex: 1 }}>
                    Qayta
                  </Button>
                  <Button size="md" variant="primary" onClick={() => navigate('/manual')} style={{ flex: 1 }}>
                    Qo'lda kiritish
                  </Button>
                </div>
              </div>
            ) : product ? (
              <div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {product.image_front_url ? (
                    <img 
                      src={product.image_front_url} 
                      alt="Product" 
                      style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover', background: FIT.surfaceAlt }}
                    />
                  ) : (
                    <FoodThumb emoji="📦" tone="blue" size={60} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>
                      {product.product_name || 'Noma\'lum'}
                    </div>
                    {product.brands && (
                      <div style={{ fontSize: 12, color: FIT.textMuted, marginTop: 2 }}>{product.brands}</div>
                    )}
                    
                    <div style={{
                      display: 'flex', gap: 10, fontSize: 11, fontFamily: FIT.mono,
                      marginTop: 8, fontWeight: 600,
                    }}>
                      <span style={{ color: FIT.primary }}>{Math.round(product.nutriments?.['energy-kcal_100g'] || product.nutriments?.['energy_100g'] || 0)} kkal</span>
                      <span style={{ color: FIT.protein }}>P {Math.round(product.nutriments?.['proteins_100g'] || 0)}g</span>
                      <span style={{ color: FIT.carbs }}>C {Math.round(product.nutriments?.['carbohydrates_100g'] || 0)}g</span>
                      <span style={{ color: FIT.fat }}>F {Math.round(product.nutriments?.['fat_100g'] || 0)}g</span>
                    </div>
                    <div style={{ fontSize: 10, color: FIT.textMuted, marginTop: 2 }}>per 100g</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <Button size="md" variant="secondary" onClick={resetScanner} style={{ flex: 1 }}>
                    Bekor
                  </Button>
                  <Button size="md" variant="primary" onClick={handleAdd} style={{ flex: 2 }}>
                    Kundalikka qo'shish
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Phone>
  );
}

function Corner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const common = {
    position: 'absolute' as const, width: 30, height: 30,
    borderStyle: 'solid', borderColor: FIT.primary, borderWidth: 0,
  };
  const specific: Record<typeof position, React.CSSProperties> = {
    tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 12 },
    tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 12 },
    bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 12 },
    br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 12 },
  };
  return <div style={{ ...common, ...specific[position] }} />;
}
