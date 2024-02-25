import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

type MarkdownProps = {
  className?: string
  children: string
}

export default function Markdown({ className, children }: MarkdownProps) {
  return (
    <ReactMarkdown
      className={className}
      components={{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        code: ({ children, className, ref, ...rest }) => {
          const match = /language-(\w+)/.exec(className || '')

          return match ? (
            <SyntaxHighlighter
              customStyle={{ backgroundColor: 'transparent' }}
              {...rest}
              PreTag="div"
              language={match[1]}
              style={tomorrow}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        },
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
