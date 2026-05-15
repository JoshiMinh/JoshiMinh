import React from 'react'

type Props = React.ComponentProps<'button'> & {
  variant?: 'default' | 'ghost'
  as?: any
  href?: string
}

export default function Button({ variant='default', as: Component = 'button', className='', children, href, ...rest }: Props) {
  const base = variant === 'ghost'
    ? 'inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/6 text-sm text-muted bg-transparent'
    : 'inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-br from-accent to-blue-700 text-sm font-semibold'

  if (Component === 'a') {
    return (
      <a className={`${base} ${className}`} href={href} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  )
}
