// Picks the preview component for a section's registry `preview` kind.
import { ArticlePreview } from '@/components/preview/ArticlePreview'
import { CaseStudyPreview } from '@/components/preview/CaseStudyPreview'
import { DocumentPreview } from '@/components/preview/DocumentPreview'
import { LandingPreview } from '@/components/preview/LandingPreview'
import { LinkedInPreview } from '@/components/preview/LinkedInPreview'
import { PromptPreview } from '@/components/preview/PromptPreview'
import type { Row, SectionDef } from '@/lib/schema'

export function RecordPreview({ section, row }: { section: SectionDef; row: Row }) {
  switch (section.preview ?? 'document') {
    case 'linkedin':
      return <LinkedInPreview row={row} />
    case 'article':
      return <ArticlePreview row={row} />
    case 'landing':
      return <LandingPreview row={row} />
    case 'caseStudy':
      return <CaseStudyPreview row={row} />
    case 'prompt':
      return <PromptPreview row={row} />
    default:
      return <DocumentPreview section={section} row={row} />
  }
}
