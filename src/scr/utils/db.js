import { Preferences } from '@capacitor/preferences'

const PETS_KEY   = 'pawprint_pets_v1'
const SCANS_KEY  = 'pawprint_scans_v1'

// ── Pets ──────────────────────────────────────────────────────

export const loadPets = async (fallback = []) => {
  try {
    const { value } = await Preferences.get({ key: PETS_KEY })
    return value ? JSON.parse(value) : fallback
  } catch (e) {
    console.error('loadPets error:', e)
    return fallback
  }
}

export const savePets = async (pets) => {
  try {
    await Preferences.set({ key: PETS_KEY, value: JSON.stringify(pets) })
    return true
  } catch (e) {
    console.error('savePets error:', e)
    return false
  }
}

export const addPet = async (pet) => {
  const pets = await loadPets()
  const updated = [pet, ...pets]
  await savePets(updated)
  return updated
}

export const updatePet = async (updatedPet) => {
  const pets = await loadPets()
  const updated = pets.map(p => p.id === updatedPet.id ? updatedPet : p)
  await savePets(updated)
  return updated
}

export const deletePet = async (id) => {
  const pets = await loadPets()
  const updated = pets.filter(p => p.id !== id)
  await savePets(updated)
  return updated
}

// ── Scans / sightings ─────────────────────────────────────────

export const logScan = async (petId, location) => {
  try {
    const { value } = await Preferences.get({ key: SCANS_KEY })
    const scans = value ? JSON.parse(value) : []
    const newScan = {
      id: Math.random().toString(36).slice(2),
      petId,
      location,
      date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
    }
    scans.unshift(newScan)
    await Preferences.set({ key: SCANS_KEY, value: JSON.stringify(scans.slice(0, 500)) }) // keep last 500
    return newScan
  } catch (e) {
    console.error('logScan error:', e)
    return null
  }
}

export const getScansForPet = async (petId) => {
  try {
    const { value } = await Preferences.get({ key: SCANS_KEY })
    const scans = value ? JSON.parse(value) : []
    return scans.filter(s => s.petId === petId)
  } catch {
    return []
  }
}

export const clearAllData = async () => {
  await Preferences.remove({ key: PETS_KEY })
  await Preferences.remove({ key: SCANS_KEY })
}
