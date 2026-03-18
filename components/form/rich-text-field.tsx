'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo } from 'react'

import {
  extensions as coreExtensions,
  type AnyExtension as TiptapExtension
} from '@tiptap/core'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Typography } from '@tiptap/extension-typography'
import { Underline } from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'

import { normalizeTiptapValue, type TiptapDirection } from '@/lib/tiptap'
import { BubbleMenu } from '@/lib/tiptap/extensions/bubble-menu'
import { FloatingMenu } from '@/lib/tiptap/extensions/floating-menu'
import SearchAndReplace from '@/lib/tiptap/extensions/search-and-replace'
import { EditorToolbar } from '@/lib/tiptap/toolbars/editor-toolbar'
import '@/lib/tiptap/styles.css'

import { cn, isFieldInvalid } from '@/utils'

import {
  FieldWrapper,
  type FieldWrapperClassNames
} from '@/components/form/field-wrapper'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

import { useFieldContext } from './form'

export type TiptapAvailableExtentions = {
  color: boolean
  highlight: boolean
  link: boolean
  placeholder: boolean
  searchAndReplace: boolean
  subscript: boolean
  superscript: boolean
  textAlign: boolean
  textDirection: boolean
  textStyle: boolean
  typography: boolean
  underline: boolean
}

const DEFAULT_EXTENTIONS: TiptapAvailableExtentions = {
  color: true,
  highlight: true,
  link: true,
  placeholder: true,
  searchAndReplace: false,
  subscript: true,
  superscript: true,
  textAlign: true,
  textDirection: true,
  textStyle: true,
  typography: true,
  underline: true
}

export type TiptapFieldProps = {
  classNames?: FieldWrapperClassNames & {
    editor?: string
    scrollArea?: string
  }
  dir?: TiptapDirection
  extensions?: Partial<TiptapAvailableExtentions>
  label?: string
  placeholder?: string
  required?: boolean
}

const RichTextFieldComponent = ({
  classNames,
  dir,
  extensions,
  label,
  placeholder,
  required
}: TiptapFieldProps) => {
  const field = useFieldContext<string>()
  const value = normalizeTiptapValue(field.state.value)

  const resolvedExtentions = useMemo(
    () => ({
      ...DEFAULT_EXTENTIONS,
      ...extensions
    }),
    [extensions]
  )

  const editorExtensions = useMemo(() => {
    const configuredExtensions: TiptapExtension[] = [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc'
          }
        },
        heading: {
          levels: [1, 2, 3, 4]
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal'
          }
        }
      })
    ]

    if (resolvedExtentions.placeholder) {
      configuredExtensions.push(
        Placeholder.configure({
          emptyNodeClass: 'is-editor-empty',
          includeChildren: false,
          placeholder: ({ node }) => {
            switch (node.type.name) {
              case 'codeBlock':
                return ''
              case 'detailsSummary':
                return 'Section title'
              case 'heading':
                return `Heading ${node.attrs.level}`
              default:
                return placeholder || "Write, type '/' for commands"
            }
          }
        })
      )
    }

    if (resolvedExtentions.textAlign) {
      configuredExtensions.push(
        TextAlign.configure({
          types: ['heading', 'paragraph']
        })
      )
    }

    if (resolvedExtentions.textDirection) {
      configuredExtensions.push(
        coreExtensions.TextDirection.configure({
          direction: dir === 'auto' ? undefined : (dir ?? 'ltr')
        })
      )
    }

    if (resolvedExtentions.textStyle) {
      configuredExtensions.push(TextStyle)
    }

    if (resolvedExtentions.subscript) {
      configuredExtensions.push(Subscript)
    }

    if (resolvedExtentions.superscript) {
      configuredExtensions.push(Superscript)
    }

    if (resolvedExtentions.underline) {
      configuredExtensions.push(Underline)
    }

    if (resolvedExtentions.link) {
      configuredExtensions.push(Link)
    }

    if (resolvedExtentions.color) {
      configuredExtensions.push(Color)
    }

    if (resolvedExtentions.highlight) {
      configuredExtensions.push(
        Highlight.configure({
          multicolor: true
        })
      )
    }

    if (resolvedExtentions.searchAndReplace) {
      configuredExtensions.push(SearchAndReplace)
    }

    if (resolvedExtentions.typography) {
      configuredExtensions.push(Typography)
    }

    return configuredExtensions
  }, [dir, placeholder, resolvedExtentions])

  const editor = useEditor({
    content: value,
    editorProps: {
      attributes: {
        class: 'max-w-full focus:outline-none',
        dir: dir ?? 'ltr'
      }
    },
    extensions: editorExtensions,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      field.handleChange(editor.getHTML())
    }
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) {
    return null
  }

  return (
    <FieldWrapper
      classNames={{
        childrenWrapper: cn(
          'tiptap-editor border-input bg-background rounded-md border overflow-hidden',
          classNames?.childrenWrapper
        ),
        label: classNames?.label,
        wrapper: classNames?.wrapper
      }}
      field={field}
      label={label}
      required={required}
    >
      <EditorToolbar editor={editor} />
      <BubbleMenu editor={editor} />
      <FloatingMenu editor={editor} />
      <ScrollArea className={cn('h-50', classNames?.scrollArea)}>
        <EditorContent
          aria-invalid={isFieldInvalid(field)}
          className="w-full min-w-full cursor-text"
          editor={editor}
          onBlur={() => field.handleBlur()}
        />
      </ScrollArea>
    </FieldWrapper>
  )
}

export const RichTextField = dynamic(
  () => Promise.resolve(RichTextFieldComponent),
  {
    loading: () => <Skeleton />,
    ssr: false
  }
)
