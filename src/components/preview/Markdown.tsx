// Minimal, XSS-safe Markdown → React renderer (headings, lists, quotes, code, bold/italic/code/links); no HTML injection.
import { Fragment, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Block =
  | { kind: 'heading'; level: 1 | 2 | 3; text: string }
  | { kind: 'ul' | 'ol'; items: string[] }
  | { kind: 'quote'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'hr' }
  | { kind: 'p'; text: string }

// Splits source text into block-level nodes.
function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i++
      continue
    }
    if (line.startsWith('```')) {
      const body: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) body.push(lines[i++])
      i++
      blocks.push({ kind: 'code', text: body.join('\n') })
      continue
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line)
    if (heading) {
      blocks.push({ kind: 'heading', level: heading[1].length as 1 | 2 | 3, text: heading[2] })
      i++
      continue
    }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      blocks.push({ kind: 'hr' })
      i++
      continue
    }
    const listType = /^\s*[-*]\s+/.test(line) ? 'ul' : /^\s*\d+[.)]\s+/.test(line) ? 'ol' : null
    if (listType) {
      const pattern = listType === 'ul' ? /^\s*[-*]\s+/ : /^\s*\d+[.)]\s+/
      const items: string[] = []
      while (i < lines.length && pattern.test(lines[i])) items.push(lines[i++].replace(pattern, ''))
      blocks.push({ kind: listType, items })
      continue
    }
    if (line.startsWith('>')) {
      const body: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) body.push(lines[i++].replace(/^>\s?/, ''))
      blocks.push({ kind: 'quote', text: body.join('\n') })
      continue
    }
    const body: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|```|>|\s*[-*]\s+|\s*\d+[.)]\s+)/.test(lines[i])) body.push(lines[i++])
    blocks.push({ kind: 'p', text: body.join('\n') })
  }
  return blocks
}

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*|_[^_\s][^_]*_)/g
const SAFE_HREF = /^(https?:|mailto:|\/|#)/i

// Renders inline emphasis, code and links; anything unrecognised stays plain text.
export function Inline({ text }: { text: string }) {
  const parts = text.split(INLINE)
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
        if (part.startsWith('`') && part.endsWith('`'))
          return (
            <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">
              {part.slice(1, -1)}
            </code>
          )
        const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part)
        if (link) {
          return SAFE_HREF.test(link[2]) ? (
            <a key={i} href={link[2]} target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
              {link[1]}
            </a>
          ) : (
            <Fragment key={i}>{link[1]}</Fragment>
          )
        }
        if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_')))
          return <em key={i}>{part.slice(1, -1)}</em>
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}

// Keeps single newlines inside a paragraph as line breaks.
const withBreaks = (text: string): ReactNode =>
  text.split('\n').map((line, i, all) => (
    <Fragment key={i}>
      <Inline text={line} />
      {i < all.length - 1 && <br />}
    </Fragment>
  ))

export function Markdown({ source, className }: { source: string; className?: string }) {
  return (
    <div className={cn('space-y-4 text-[15px] leading-7', className)}>
      {parseBlocks(source).map((block, i) => {
        switch (block.kind) {
          case 'heading': {
            const Tag = (['h2', 'h3', 'h4'] as const)[block.level - 1]
            const size = ['text-2xl', 'text-xl', 'text-lg'][block.level - 1]
            return (
              <Tag key={i} className={cn('pt-2 font-heading font-semibold tracking-tight', size)}>
                <Inline text={block.text} />
              </Tag>
            )
          }
          case 'ul':
          case 'ol': {
            const List = block.kind
            return (
              <List key={i} className={cn('space-y-1 pl-6', block.kind === 'ul' ? 'list-disc' : 'list-decimal')}>
                {block.items.map((item, j) => (
                  <li key={j}>
                    <Inline text={item} />
                  </li>
                ))}
              </List>
            )
          }
          case 'quote':
            return (
              <blockquote key={i} className="border-l-2 pl-4 text-muted-foreground italic">
                {withBreaks(block.text)}
              </blockquote>
            )
          case 'code':
            return (
              <pre key={i} className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed">
                <code>{block.text}</code>
              </pre>
            )
          case 'hr':
            return <hr key={i} />
          default:
            return <p key={i}>{withBreaks(block.text)}</p>
        }
      })}
    </div>
  )
}
