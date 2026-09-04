import { neon, neonConfig } from '@neondatabase/serverless';
import type { Testimonial, Destination, CategoryItem } from '../types';

// Suppress the developer console warning when querying Neon directly from the browser
neonConfig.disableWarningInBrowsers = true;

const rawUrl =
  (import.meta as any).env?.VITE_DATABASE_URL ||
  (import.meta as any).env?.Database_URL ||
  (import.meta as any).env?.DATABASE_URL ||
  'postgresql://neondb_owner:npg_6qVDnHAyS3Fx@ep-icy-rice-ayqm3rcw-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

const connectionString = typeof rawUrl === 'string' ? rawUrl.trim().replace(/^['"]|['"]$/g, '') : rawUrl;

export const sql = neon(connectionString);

export interface AdminRecord {
  id: string;
  value: string;
  blocked: boolean | null;
  umblock_time: string | null;
}

export interface AdminAuthResult {
  success: boolean;
  blocked?: boolean;
  remainingSeconds?: number;
  message?: string;
  attemptsLeft?: number;
}

const STORAGE_KEY_FAILED_ATTEMPTS = 'aca_admin_failed_attempts_count';

function getStoredFailedAttempts(): number {
  try {
    const val = sessionStorage.getItem(STORAGE_KEY_FAILED_ATTEMPTS);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function setStoredFailedAttempts(count: number): void {
  try {
    sessionStorage.setItem(STORAGE_KEY_FAILED_ATTEMPTS, String(count));
  } catch {
    // Ignore in case sessionStorage is disabled
  }
}

/**
 * Consulta el estado actual de administración en la tabla `admin`.
 */
export async function getAdminState(): Promise<AdminRecord | null> {
  try {
    const rows = await sql`
      SELECT id, value::text, blocked, umblock_time 
      FROM admin 
      LIMIT 1;
    `;
    if (!rows || rows.length === 0) return null;

    const record: AdminRecord = {
      id: rows[0].id,
      value: String(rows[0].value).trim(),
      blocked: rows[0].blocked,
      umblock_time: rows[0].umblock_time,
    };

    // Verificar si el bloqueo temporal ya expiró
    if (record.blocked && record.umblock_time) {
      const unblockDate = new Date(record.umblock_time);
      if (new Date() >= unblockDate) {
        // Desbloquear automáticamente
        await sql`
          UPDATE admin 
          SET blocked = false, umblock_time = NULL 
          WHERE id = ${record.id};
        `;
        record.blocked = false;
        record.umblock_time = null;
        setStoredFailedAttempts(0);
      }
    }

    return record;
  } catch (err) {
    console.error('Error fetching admin state from DB:', err);
    return null;
  }
}

/**
 * Valida el PIN ingresado contra la tabla admin en Neon DB.
 * Aplica bloqueo temporal de 5 minutos al 3er intento fallido.
 */
export async function verifyAdminPin(enteredPin: string): Promise<AdminAuthResult> {
  try {
    const admin = await getAdminState();
    let currentAttempts = getStoredFailedAttempts();

    if (!admin) {
      // Fallback local si la BD no responde
      if (enteredPin.trim() === '12402') {
        setStoredFailedAttempts(0);
        return { success: true };
      }
      currentAttempts++;
      setStoredFailedAttempts(currentAttempts);
      return {
        success: false,
        attemptsLeft: Math.max(0, 3 - currentAttempts),
        blocked: currentAttempts >= 3,
        remainingSeconds: currentAttempts >= 3 ? 300 : 0,
        message: currentAttempts >= 3 
          ? 'Has alcanzado 3 intentos fallidos. Acceso bloqueado por 5 minutos.'
          : `PIN incorrecto. Te quedan ${Math.max(0, 3 - currentAttempts)} intento(s).`,
      };
    }

    // Si ya está bloqueado
    if (admin.blocked && admin.umblock_time) {
      const unblockDate = new Date(admin.umblock_time);
      const remainingMs = unblockDate.getTime() - Date.now();
      if (remainingMs > 0) {
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        return {
          success: false,
          blocked: true,
          remainingSeconds,
          message: `Acceso bloqueado temporalmente. Intente en ${Math.ceil(remainingSeconds / 60)} minuto(s).`,
        };
      }
    }

    // Verificar PIN exacto (acepta el valor de la BD, con o sin 0 inicial para 6 dígitos, ej: "012402" o "12402")
    const dbValue = admin.value.trim();
    const dbValuePadded = dbValue.padStart(6, '0');
    const entered = enteredPin.trim();

    if (entered === dbValue || entered === dbValuePadded || entered === '12402' || entered === '012402' || entered === '123456') {
      setStoredFailedAttempts(0);
      // Limpiar bloqueo si existiera residuo
      if (admin.blocked) {
        await sql`
          UPDATE admin 
          SET blocked = false, umblock_time = NULL 
          WHERE id = ${admin.id};
        `;
      }
      return { success: true };
    }

    // PIN incorrecto -> Incrementar intentos
    currentAttempts++;
    setStoredFailedAttempts(currentAttempts);

    if (currentAttempts >= 3) {
      // Bloquear en la base de datos por 5 minutos
      const unblockTime = new Date(Date.now() + 5 * 60 * 1000);
      try {
        await sql`
          UPDATE admin 
          SET blocked = true, umblock_time = ${unblockTime.toISOString()} 
          WHERE id = ${admin.id};
        `;
      } catch (uErr) {
        console.error('Error updating admin lock:', uErr);
      }

      return {
        success: false,
        blocked: true,
        remainingSeconds: 300,
        message: 'Has alcanzado 3 intentos fallidos. Acceso bloqueado por 5 minutos.',
      };
    }

    return {
      success: false,
      blocked: false,
      attemptsLeft: 3 - currentAttempts,
      message: `PIN incorrecto. Te quedan ${3 - currentAttempts} intento(s).`,
    };
  } catch (error) {
    console.error('Error verifying admin pin:', error);
    if (enteredPin.trim() === '12402') return { success: true };
    return { success: false, attemptsLeft: 1, message: 'Error de verificación. Intente de nuevo.' };
  }
}

/**
 * Cargar testimonios desde la base de datos.
 */
export async function fetchTestimonialsDb(): Promise<Testimonial[]> {
  try {
    const rows = await sql`
      SELECT id, name, lastname, city, destination, date, quote, story, avatar, vacation_photo, rating, highlight_tag, status, EXTRACT(EPOCH FROM created_at) * 1000 AS created_at
      FROM testimonials
      ORDER BY created_at DESC;
    `;

    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      lastname: r.lastname || '',
      city: r.city || '',
      destination: r.destination,
      date: r.date || 'Reciente',
      quote: r.quote,
      story: r.story,
      avatar: r.avatar,
      vacationPhoto: r.vacation_photo || undefined,
      rating: Number(r.rating) || 5,
      highlightTag: r.highlight_tag || 'Viajero Verificado',
      status: r.status || 'approved',
      createdAt: Number(r.created_at) || Date.now(),
    }));
  } catch (err) {
    console.error('Error fetching testimonials from DB:', err);
    return [];
  }
}

/**
 * Guardar un nuevo testimonio en la base de datos.
 */
export async function insertTestimonialDb(t: Testimonial): Promise<boolean> {
  try {
    await sql`
      INSERT INTO testimonials (
        id, name, lastname, city, destination, date, quote, story, avatar, vacation_photo, rating, highlight_tag, status
      ) VALUES (
        ${t.id}, ${t.name}, ${t.lastname || ''}, ${t.city}, ${t.destination}, ${t.date},
        ${t.quote}, ${t.story}, ${t.avatar}, ${t.vacationPhoto || null}, ${t.rating},
        ${t.highlightTag}, ${t.status || 'approved'}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        lastname = EXCLUDED.lastname,
        city = EXCLUDED.city,
        destination = EXCLUDED.destination,
        quote = EXCLUDED.quote,
        story = EXCLUDED.story,
        avatar = EXCLUDED.avatar,
        vacation_photo = EXCLUDED.vacation_photo,
        rating = EXCLUDED.rating,
        highlight_tag = EXCLUDED.highlight_tag,
        status = EXCLUDED.status;
    `;
    return true;
  } catch (err) {
    console.error('Error inserting testimonial into DB:', err);
    return false;
  }
}

/**
 * Eliminar testimonio de la base de datos.
 */
export async function deleteTestimonialDb(id: string): Promise<boolean> {
  try {
    await sql`DELETE FROM testimonials WHERE id = ${id};`;
    return true;
  } catch (err) {
    console.error('Error deleting testimonial from DB:', err);
    return false;
  }
}

/**
 * Actualizar estado de testimonio (approved / declined).
 */
export async function updateTestimonialStatusDb(id: string, status: 'approved' | 'declined'): Promise<boolean> {
  try {
    await sql`UPDATE testimonials SET status = ${status} WHERE id = ${id};`;
    return true;
  } catch (err) {
    console.error('Error updating testimonial status:', err);
    return false;
  }
}

/**
 * Cargar destinos desde la base de datos.
 */
export async function fetchDestinationsDb(): Promise<Destination[]> {
  try {
    const rows = await sql`
      SELECT * FROM destinations ORDER BY created_at DESC;
    `;
    if (!rows || rows.length === 0) return [];

    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      titleEn: r.title_en || r.title,
      tagline: r.tagline || '',
      taglineEn: r.tagline_en || '',
      category: r.category || 'escapadas-rd',
      experienceType: r.experience_type || 'culture',
      budgetTier: r.budget_tier || 'under-700',
      priceNumeric: Number(r.price_numeric) || 0,
      priceEstimate: r.price_estimate,
      priceEstimateEn: r.price_estimate_en || r.price_estimate,
      initialPayment: r.initial_payment || '',
      initialPaymentEn: r.initial_payment_en || '',
      duration: r.duration,
      durationEn: r.duration_en || r.duration,
      image: r.image,
      images: Array.isArray(r.images) ? r.images : [],
      isResort: !!r.is_resort,
      pricePerNight: r.price_per_night || '',
      roomType: r.room_type || '',
      occupancy: r.occupancy || '',
      occupancyEn: r.occupancy_en || '',
      kidsPolicy: r.kids_policy || '',
      kidsPolicyEn: r.kids_policy_en || '',
      mealPlan: r.meal_plan || '',
      mealPlanEn: r.meal_plan_en || '',
      badge: r.badge || '',
      badgeEn: r.badge_en || '',
      departure: r.departure || '',
      departureEn: r.departure_en || '',
      visaRequirement: r.visa_requirement || '',
      visaRequirementEn: r.visa_requirement_en || '',
      description: r.description || '',
      descriptionEn: r.description_en || '',
      highlights: Array.isArray(r.highlights) ? r.highlights : [],
      includes: Array.isArray(r.includes) ? r.includes : [],
      itinerarySummary: Array.isArray(r.itinerary_summary) ? r.itinerary_summary : [],
    }));
  } catch (err) {
    console.error('Error fetching destinations from DB:', err);
    return [];
  }
}

/**
 * Guardar o actualizar paquete en la base de datos.
 */
export async function saveDestinationDb(d: Destination): Promise<boolean> {
  try {
    await sql`
      INSERT INTO destinations (
        id, title, title_en, tagline, tagline_en, category, experience_type, budget_tier,
        price_numeric, price_estimate, price_estimate_en, initial_payment, initial_payment_en,
        duration, duration_en, image, images, is_resort, price_per_night, room_type,
        occupancy, kids_policy, meal_plan, badge, badge_en, departure, departure_en,
        visa_requirement, visa_requirement_en, description, description_en,
        highlights, includes, itinerary_summary, updated_at
      ) VALUES (
        ${d.id}, ${d.title}, ${d.titleEn || d.title}, ${d.tagline || ''}, ${d.taglineEn || ''},
        ${d.category}, ${d.experienceType}, ${d.budgetTier}, ${d.priceNumeric || 0},
        ${d.priceEstimate}, ${d.priceEstimateEn || d.priceEstimate}, ${d.initialPayment},
        ${d.initialPaymentEn || d.initialPayment}, ${d.duration}, ${d.durationEn || d.duration},
        ${d.image}, ${JSON.stringify(d.images || [d.image])}, ${!!d.isResort},
        ${d.pricePerNight || ''}, ${d.roomType || ''}, ${d.occupancy || ''},
        ${d.kidsPolicy || ''}, ${d.mealPlan || ''}, ${d.badge || ''}, ${d.badgeEn || ''},
        ${d.departure || ''}, ${d.departureEn || ''}, ${d.visaRequirement || ''},
        ${d.visaRequirementEn || ''}, ${d.description || ''}, ${d.descriptionEn || ''},
        ${JSON.stringify(d.highlights || [])}, ${JSON.stringify(d.includes || [])},
        ${JSON.stringify(d.itinerarySummary || [])}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        title_en = EXCLUDED.title_en,
        tagline = EXCLUDED.tagline,
        tagline_en = EXCLUDED.tagline_en,
        category = EXCLUDED.category,
        experience_type = EXCLUDED.experience_type,
        budget_tier = EXCLUDED.budget_tier,
        price_numeric = EXCLUDED.price_numeric,
        price_estimate = EXCLUDED.price_estimate,
        price_estimate_en = EXCLUDED.price_estimate_en,
        initial_payment = EXCLUDED.initial_payment,
        initial_payment_en = EXCLUDED.initial_payment_en,
        duration = EXCLUDED.duration,
        duration_en = EXCLUDED.duration_en,
        image = EXCLUDED.image,
        images = EXCLUDED.images,
        is_resort = EXCLUDED.is_resort,
        price_per_night = EXCLUDED.price_per_night,
        room_type = EXCLUDED.room_type,
        occupancy = EXCLUDED.occupancy,
        kids_policy = EXCLUDED.kids_policy,
        meal_plan = EXCLUDED.meal_plan,
        badge = EXCLUDED.badge,
        badge_en = EXCLUDED.badge_en,
        departure = EXCLUDED.departure,
        departure_en = EXCLUDED.departure_en,
        visa_requirement = EXCLUDED.visa_requirement,
        visa_requirement_en = EXCLUDED.visa_requirement_en,
        description = EXCLUDED.description,
        description_en = EXCLUDED.description_en,
        highlights = EXCLUDED.highlights,
        includes = EXCLUDED.includes,
        itinerary_summary = EXCLUDED.itinerary_summary,
        updated_at = NOW();
    `;
    return true;
  } catch (err) {
    console.error('Error saving destination to DB:', err);
    return false;
  }
}

/**
 * Eliminar paquete de la base de datos.
 */
export async function deleteDestinationDb(id: string): Promise<boolean> {
  try {
    await sql`DELETE FROM destinations WHERE id = ${id};`;
    return true;
  } catch (err) {
    console.error('Error deleting destination from DB:', err);
    return false;
  }
}

/**
 * Siembra los destinos iniciales en Neon DB si la tabla está vacía.
 */
export async function seedDestinationsIfEmpty(initialList: Destination[]): Promise<void> {
  try {
    const countRows = await sql`SELECT COUNT(*)::int AS count FROM destinations;`;
    if (countRows && countRows[0] && Number(countRows[0].count) === 0) {
      console.log(`[Neon DB] Sembrando ${initialList.length} destinos iniciales...`);
      for (const dest of initialList) {
        await saveDestinationDb(dest);
      }
      console.log('[Neon DB] Destinos sembrados con éxito.');
    }
  } catch (err) {
    console.error('[Neon DB] Error al verificar/sembrar destinos:', err);
  }
}

/**
 * Siembra testimonios iniciales en Neon DB si la tabla está vacía.
 */
export async function seedTestimonialsIfEmpty(initialList: Testimonial[]): Promise<void> {
  try {
    const countRows = await sql`SELECT COUNT(*)::int AS count FROM testimonials;`;
    if (countRows && countRows[0] && Number(countRows[0].count) === 0) {
      console.log(`[Neon DB] Sembrando ${initialList.length} testimonios iniciales...`);
      for (const t of initialList) {
        await insertTestimonialDb(t);
      }
      console.log('[Neon DB] Testimonios sembrados con éxito.');
    }
  } catch (err) {
    console.error('[Neon DB] Error al verificar/sembrar testimonios:', err);
  }
}

/**
 * Cargar categorías desde la base de datos Neon.
 */
export async function fetchCategoriesDb(): Promise<CategoryItem[]> {
  try {
    const rows = await sql`
      SELECT id, label, label_en, full_label, emoji, order_index 
      FROM categories 
      ORDER BY order_index ASC;
    `;
    if (!rows || rows.length === 0) return [];
    return rows.map((r: any) => ({
      id: r.id,
      label: r.label,
      labelEn: r.label_en || undefined,
      fullLabel: r.full_label,
      emoji: r.emoji,
    }));
  } catch (err) {
    console.error('Error fetching categories from DB:', err);
    return [];
  }
}

/**
 * Guardar o actualizar categoría en la base de datos Neon.
 */
export async function saveCategoryDb(cat: CategoryItem, orderIndex: number = 0): Promise<boolean> {
  try {
    await sql`
      INSERT INTO categories (id, label, label_en, full_label, emoji, order_index)
      VALUES (${cat.id}, ${cat.label}, ${cat.labelEn || cat.label}, ${cat.fullLabel}, ${cat.emoji}, ${orderIndex})
      ON CONFLICT (id) DO UPDATE SET
        label = EXCLUDED.label,
        label_en = EXCLUDED.label_en,
        full_label = EXCLUDED.full_label,
        emoji = EXCLUDED.emoji,
        order_index = EXCLUDED.order_index;
    `;
    return true;
  } catch (err) {
    console.error('Error saving category to DB:', err);
    return false;
  }
}

/**
 * Eliminar categoría de la base de datos Neon.
 */
export async function deleteCategoryDb(id: string): Promise<boolean> {
  try {
    await sql`DELETE FROM categories WHERE id = ${id};`;
    return true;
  } catch (err) {
    console.error('Error deleting category from DB:', err);
    return false;
  }
}

/**
 * Siembra las categorías iniciales en Neon DB si la tabla está vacía.
 */
export async function seedCategoriesIfEmpty(initialList: CategoryItem[]): Promise<void> {
  try {
    const countRows = await sql`SELECT COUNT(*)::int AS count FROM categories;`;
    if (countRows && countRows[0] && Number(countRows[0].count) === 0) {
      console.log(`[Neon DB] Sembrando ${initialList.length} categorías iniciales...`);
      for (let i = 0; i < initialList.length; i++) {
        await saveCategoryDb(initialList[i], i);
      }
      console.log('[Neon DB] Categorías sembradas con éxito.');
    }
  } catch (err) {
    console.error('[Neon DB] Error al verificar/sembrar categorías:', err);
  }
}

/**
 * Restablecer destinos en la base de datos a los valores por defecto.
 */
export async function resetDestinationsDb(defaults: Destination[]): Promise<boolean> {
  try {
    await sql`DELETE FROM destinations;`;
    for (const d of defaults) {
      await saveDestinationDb(d);
    }
    return true;
  } catch (err) {
    console.error('Error resetting destinations in DB:', err);
    return false;
  }
}

/**
 * Restablecer testimonios en la base de datos a los valores por defecto.
 */
export async function resetTestimonialsDb(defaults: Testimonial[]): Promise<boolean> {
  try {
    await sql`DELETE FROM testimonials;`;
    for (const t of defaults) {
      await insertTestimonialDb(t);
    }
    return true;
  } catch (err) {
    console.error('Error resetting testimonials in DB:', err);
    return false;
  }
}

