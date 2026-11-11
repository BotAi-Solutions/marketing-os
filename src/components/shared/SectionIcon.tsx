// Maps registry icon names to lucide components so the schema stays free of React.
import {
  Building,
  ChartLine,
  FlaskConical,
  Globe,
  Images,
  Lightbulb,
  Magnet,
  Megaphone,
  MessageSquareText,
  Newspaper,
  PanelsTopLeft,
  SquareTerminal,
  Target,
  Telescope,
  Trophy,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react'
import type { IconName } from '@/lib/schema'

const ICONS: Record<IconName, LucideIcon> = {
  Building,
  ChartLine,
  FlaskConical,
  Globe,
  Images,
  Lightbulb,
  Magnet,
  Megaphone,
  MessageSquareText,
  Newspaper,
  PanelsTopLeft,
  SquareTerminal,
  Target,
  Telescope,
  Trophy,
}

export function SectionIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = ICONS[name]
  return <Icon aria-hidden {...props} />
}
