// Contact API call; swap the stub for a real fetch when the backend exists.
import type { ContactMessage } from '@/features/contact/types'

export async function sendContactMessage(message: ContactMessage): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  if (!message.email.includes('@')) throw new Error('Invalid email')
}
