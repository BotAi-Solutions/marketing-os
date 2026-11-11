// Contact route: thin page that composes the contact feature.
import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/shared/page-header'
import { ContactForm } from '@/features/contact'

export function ContactPage() {
  return (
    <Container className="space-y-8 py-16">
      <PageHeader title="Contact" description="Tell us about your project." />
      <ContactForm />
    </Container>
  )
}
