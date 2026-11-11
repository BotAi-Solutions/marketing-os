// Contact form built from shadcn primitives; submits via the feature's API.
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { sendContactMessage } from '@/features/contact/api/send-contact-message'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  // Collects form values and forwards them to the API helper.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setStatus('sending')
    try {
      await sendContactMessage({ name: String(data.get('name')), email: String(data.get('email')) })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Card className="max-w-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Get in touch</CardTitle>
          <CardDescription>We reply within one business day.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 py-4">
          <Input name="name" placeholder="Your name" required />
          <Input name="email" type="email" placeholder="you@example.com" required />
        </CardContent>
        <CardFooter className="justify-between">
          <span className="text-sm text-muted-foreground">
            {status === 'sent' && <span className="text-success">Message sent.</span>}
            {status === 'error' && <span className="text-destructive">Something went wrong.</span>}
          </span>
          <Button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
