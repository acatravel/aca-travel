-- ==============================================================================
-- ACA TRAVEL - ESQUEMA DE BASE DE DATOS (PostgreSQL / Supabase)
-- ==============================================================================
-- Este script crea las tablas necesarias para conectar la sección de comentarios
-- (testimonios con fotos de vacaciones) y el catálogo de paquetes turísticos y resorts.
-- Incluye índices de rendimiento, políticas RLS de seguridad y datos de muestra.
-- ==============================================================================

-- 1. Habilitar extensión para UUIDs (si se utiliza en Supabase o PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLA 1: CATEGORÍAS DE DESTINOS / ESTACIONES DEL MAPA 3D
-- ==============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    label_en VARCHAR(100),
    full_label VARCHAR(150) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLA 2: PAQUETES TURÍSTICOS Y RESORTS / HOTELES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS destinations (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    tagline TEXT,
    tagline_en TEXT,
    category VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
    experience_type VARCHAR(50) NOT NULL DEFAULT 'culture', -- 'beach' | 'adventure' | 'culture' | 'cruise'
    budget_tier VARCHAR(50) NOT NULL DEFAULT 'under-700',   -- 'under-700' | '700-1000' | 'over-1000'
    price_numeric NUMERIC(10, 2) NOT NULL DEFAULT 0,
    price_estimate VARCHAR(100) NOT NULL,
    price_estimate_en VARCHAR(100),
    initial_payment VARCHAR(100),
    initial_payment_en VARCHAR(100),
    duration VARCHAR(100) NOT NULL,                         -- ej: "3 Días / 2 Noches"
    duration_en VARCHAR(100),
    image TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,                       -- Galería múltiple de fotos
    is_resort BOOLEAN DEFAULT FALSE,
    price_per_night VARCHAR(100),                           -- Si es resort: ej. "$195 USD / noche"
    room_type VARCHAR(150),                                 -- ej: "Junior Suite Tropical View"
    occupancy VARCHAR(150),                                 -- ej: "2 Adultos" o "Base doble"
    kids_policy VARCHAR(255),                               -- ej: "¡Hasta 2 Niños GRATIS hasta 11 años!"
    meal_plan VARCHAR(255),                                 -- ej: "Todo Incluido 24 Horas"
    badge VARCHAR(150),                                     -- ej: "🔥 Top Más Cotizado"
    badge_en VARCHAR(150),
    departure VARCHAR(255),                                 -- ej: "✈️ Vuelos incluidos con maleta"
    departure_en VARCHAR(255),
    visa_requirement VARCHAR(255),                          -- ej: "✅ ¡Sin Visa Requerida!"
    visa_requirement_en VARCHAR(255),
    description TEXT,
    description_en TEXT,
    highlights JSONB DEFAULT '[]'::jsonb,                   -- Puntos clave
    includes JSONB DEFAULT '[]'::jsonb,                     -- Inclusiones del paquete
    itinerary_summary JSONB DEFAULT '[]'::jsonb,            -- Itinerario día por día [{ day: "...", activity: "..." }]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLA 3: COMENTARIOS Y TESTIMONIOS (CON FOTO DE VACACIONES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('rev-' || EXTRACT(EPOCH FROM NOW())::BIGINT),
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) DEFAULT '',
    city VARCHAR(150) DEFAULT 'Viajero Internacional',
    destination VARCHAR(150) NOT NULL,
    date VARCHAR(100) DEFAULT 'Reciente',
    quote TEXT NOT NULL,                                     -- Frase título resumen
    story TEXT NOT NULL,                                     -- Comentario completo
    avatar TEXT NOT NULL,                                    -- Foto de perfil del cliente
    vacation_photo TEXT,                                     -- Foto de las vacaciones subida por el usuario
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    highlight_tag VARCHAR(100) DEFAULT 'Reserva con Cuotas',
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ÍNDICES DE RENDIMIENTO PARA CONSULTAS RÁPIDAS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_is_resort ON destinations(is_resort);
CREATE INDEX IF NOT EXISTS idx_destinations_created_at ON destinations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD (Row Level Security - RLS para Supabase)
-- ==============================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 1. Categorías: Cualquier visitante puede leer
CREATE POLICY "Public Read Categories" ON categories
    FOR SELECT USING (true);

-- 2. Paquetes: Cualquier visitante puede leer
CREATE POLICY "Public Read Destinations" ON destinations
    FOR SELECT USING (true);

-- 3. Paquetes: Solo administradores pueden insertar/actualizar/eliminar
CREATE POLICY "Admin Full Destinations Access" ON destinations
    FOR ALL USING (auth.role() = 'authenticated');

-- 4. Testimonios: Visitantes pueden leer los testimonios aprobados
CREATE POLICY "Public Read Approved Testimonials" ON testimonials
    FOR SELECT USING (status = 'approved');

-- 5. Testimonios: Cualquier visitante puede enviar un testimonio desde el formulario web
CREATE POLICY "Public Insert Testimonials" ON testimonials
    FOR INSERT WITH CHECK (true);

-- 6. Testimonios: Administradores pueden ver todos (pendientes, aprobados, rechazados) y editarlos
CREATE POLICY "Admin Full Testimonials Access" ON testimonials
    FOR ALL USING (auth.role() = 'authenticated');


-- ==============================================================================
-- DATOS INICIALES (SEED DATA)
-- ==============================================================================

-- 1. Categorías Iniciales
INSERT INTO categories (id, label, label_en, full_label, emoji, order_index) VALUES
('colombia', 'Colombia', 'Colombia', '🇨🇴 Colombia Mágica', '🇨🇴', 1),
('mexico', 'México', 'Mexico', '🇲🇽 México All-Inclusive', '🇲🇽', 2),
('cruceros', 'Cruceros', 'Cruises', '🚢 Cruceros del Caribe', '🚢', 3),
('europa', 'Europa', 'Europe', '🇪🇺 Europa Soñada', '🇪🇺', 4),
('escapadas-rd', 'Resorts/RD', 'Resorts/DR', '🏨 Resorts & Escapadas RD', '🏨', 5)
ON CONFLICT (id) DO NOTHING;

-- 2. Paquetes y Resorts Iniciales
INSERT INTO destinations (
    id, title, title_en, tagline, tagline_en, category, experience_type, budget_tier,
    price_numeric, price_estimate, initial_payment, duration, image, is_resort,
    price_per_night, room_type, occupancy, kids_policy, meal_plan, badge,
    departure, visa_requirement, description, highlights, includes, itinerary_summary
) VALUES
(
    'dreams-macao-beach-punta-cana',
    'Dreams Macao Beach Punta Cana Resort & Spa',
    'Dreams Macao Beach Punta Cana Resort & Spa',
    'Parque acuático, playa virgen de ensueño, 9 restaurantes gourmet y Todo Incluido 24h',
    'Water park, pristine virgin beach, 9 gourmet restaurants & 24/7 Unlimited-Luxury',
    'escapadas-rd', 'beach', 'under-700',
    195.00, '$195 USD / noche', 'Aparta con solo $100 USD', '3 Días / 2 Noches',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
    TRUE, '$195 USD / noche', 'Junior Suite Tropical View', '2 Adultos',
    '¡Hasta 2 Niños GRATIS hasta 11 años!', 'Todo Incluido 24 Horas con Bebidas Premium',
    '🏨 Resort 5⭐ Todo Incluido',
    '🚐 Traslados privados desde Santo Domingo y Aeropuerto PUJ',
    '✅ ¡Sin trámites, paraíso local!',
    'Experimenta el máximo nivel de descanso y entretenimiento familiar en Playa Macao. Parque acuático con toboganes, río lento, 4 piscinas, deportes acuáticos, kids club y 9 restaurantes gastronómicos.',
    '["Parque acuático exclusivo en la propiedad con toboganes", "Playa Macao virgen de aguas cristalinas", "9 restaurantes gastronómicos a la carta", "Explorer Club para niños y Core Zone supervisado"]'::jsonb,
    '["Alojamiento en Junior Suite Tropical con balcón privado", "Alimentos gourmet ilimitados y room service 24h", "Bebidas alcohólicas y cócteles premium ilimitados", "Acceso completo a piscinas y actividades"]'::jsonb,
    '[{"day": "Día 1", "activity": "Check-in VIP con cóctel de bienvenida y parque acuático"}, {"day": "Día 2", "activity": "Deportes acuáticos en Playa Macao y show nocturno"}, {"day": "Día 3", "activity": "Desayuno buffet y check-out relajado"}]'::jsonb
),
(
    'cancun-riviera-maya-lujo',
    'Cancún & Riviera Maya All-Inclusive',
    'Cancún & Riviera Maya All-Inclusive Luxury',
    'Resorts de lujo 5 estrellas, cenotes cristalinos, catamaranes y descanso frente al mar',
    '5-Star beachfront luxury resorts, crystalline cenotes & catamarans',
    'mexico', 'beach', '700-1000',
    790.00, '$790 USD', 'Aparta con solo $200 USD', '5 Días / 4 Noches',
    'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=80',
    TRUE, '$198 USD / noche', 'Junior Suite Oceanfront', '2 Adultos',
    '¡Hasta 2 Niños GRATIS hasta 11 años!', 'Todo Incluido 24 Horas (Bebidas Premium)',
    '🌴 Resort All-Inclusive 5⭐',
    '✈️ Salidas y conexiones desde principales ciudades',
    '✅ Visa Mexicana o Visa Americana vigente',
    'El escape definitivo de descanso y diversión tropical en resort de lujo con alimentos y bebidas ilimitadas 24h.',
    '["Resort 5 estrellas All-Inclusive frente al mar", "Navegación en catamarán privado a Isla Mujeres", "Aventura en cenotes subterráneos"]'::jsonb,
    '["Boleto aéreo ida y vuelta con equipaje incluido", "Traslado privado aeropuerto - resort", "Alimentación gourmet y bebidas ilimitadas 24/7"]'::jsonb,
    '[{"day": "Día 1", "activity": "Llegada y check-in all-inclusive"}, {"day": "Día 2", "activity": "Catamarán a Isla Mujeres"}, {"day": "Día 3", "activity": "Expedición Cenotes Mayas"}]'::jsonb
),
(
    'colombia-medellin-cartagena',
    'Medellín, Guatapé & Cartagena Mágica',
    'Magical Medellín, Guatapé & Cartagena',
    'Comuna 13, la piedra del Peñol, rumba, café y el encanto colonial amurallado',
    'Comuna 13, El Peñol rock, vibrant nightlife & coffee culture',
    'colombia', 'culture', 'under-700',
    680.00, '$680 USD', 'Aparta con solo $150 USD', '6 Días / 5 Noches',
    'https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&w=1200&q=80',
    FALSE, '', '', '2 Adultos (Base Doble)',
    'Niños menores de 4 años viajan gratis', 'Desayunos Buffet Diarios',
    '🔥 El #1 Más Cotizado',
    '✈️ Salidas directas y conexiones internacionales',
    '✅ ¡Sin Visa para la mayoría de nacionalidades!',
    'Una experiencia transformadora en Sudamérica. Conoce Medellín, Guatapé y la mágica Cartagena amurallada.',
    '["Recorrido histórico Comuna 13 y Metrocable", "Excursión a Guatapé y subida al Peñol", "Pasadía VIP en islas privadas de Cartagena"]'::jsonb,
    '["Boletos aéreos ida y vuelta + vuelo interno", "Equipaje en cabina y bodega", "Hoteles 4 estrellas con desayuno buffet"]'::jsonb,
    '[{"day": "Día 1", "activity": "Llegada a Medellín"}, {"day": "Día 2", "activity": "Tour Comuna 13"}, {"day": "Día 3", "activity": "Pasadía Guatapé"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 3. Testimonios Iniciales (Con Foto de Vacaciones)
INSERT INTO testimonials (
    id, name, lastname, city, destination, date, quote, story, avatar, vacation_photo, rating, highlight_tag, status
) VALUES
(
    '1', 'Carlos', 'J.', 'Miami, USA', 'Medellín & Cartagena (Colombia)', 'Febrero 2026',
    '¡La mejor experiencia de viaje de nuestras vidas! Cero estrés con los vuelos y los tours.',
    'Teníamos meses queriendo conocer Colombia en familia pero temíamos caer en estafas online. El equipo de ACA Travel nos diseñó un plan de pagos flexible, nos coordinó hoteles increíbles y cuando aterrizamos en Medellín cada traslado y guía nos esperaba puntual.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&w=1000&q=80',
    5, 'Reserva con Cuotas', 'approved'
),
(
    '2', 'Roberto', 'F.', 'Santo Domingo, D.N.', 'Europa Soñada (Madrid, Roma & París)', 'Enero 2026',
    'El acompañamiento para la Visa Europea fue impecable. Nos aprobaron la visa sin ningún contratiempo.',
    'El proceso de visado para Europa siempre nos parecía un laberinto imposible. Los especialistas consulares de ACA Travel armaron nuestro expediente con reservas reales verificadas, póliza Schengen y hasta simulacro de entrevista. ¡La visa salió aprobada en menos de 10 días!',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    5, 'Asesoría Visa Exitosa', 'approved'
),
(
    '3', 'Claudia', 'P.', 'Ciudad de México', 'Cancún All-Inclusive & Cenotes', 'Diciembre 2025',
    'El resort 5 estrellas y la navegación privada a Isla Mujeres superaron todas nuestras expectativas.',
    'Éramos un grupo de 6 amigas celebrando una graduación. ACA Travel nos consiguió una tarifa grupal irrepetible con todo incluido de lujo. La atención por WhatsApp fue 10/10.',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80',
    5, 'Viaje en Grupo', 'approved'
)
ON CONFLICT (id) DO NOTHING;
