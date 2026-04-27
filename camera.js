import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'

/**
 * Capture a nose-print photo.
 * - On Android/iOS: opens native camera via Capacitor
 * - On web: returns null (falls back to getUserMedia in NoseScanner)
 */
export const captureNosePhoto = async () => {
  if (!Capacitor.isNativePlatform()) return null

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      direction: 'rear',
      presentationStyle: 'fullscreen',
      promptLabelHeader: 'Scan Nose Print',
      promptLabelPhoto: 'Take Photo',
      promptLabelPicture: 'Choose from Gallery',
    })
    return image.dataUrl
  } catch (err) {
    if (err.message !== 'User cancelled photos app') {
      console.error('Camera error:', err)
    }
    return null
  }
}

/**
 * Request camera permissions explicitly (Android 13+)
 */
export const requestCameraPermission = async () => {
  if (!Capacitor.isNativePlatform()) return true
  const perm = await Camera.requestPermissions({ permissions: ['camera'] })
  return perm.camera === 'granted'
}
