import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function Button({ children, className = '', ...rest }: ButtonProps) {
  return (
    <button {...rest} className={`inline-flex items-center px-3 py-1.5 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-900 ${className}`}>
      {children}
    </button>
  )
}
