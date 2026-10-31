import { XIcon } from 'lucide-react'
import { Dialog as ModalPrimitive } from 'radix-ui'
import type * as React from 'react'
import { cn } from '@/lib/utils'

function Modal({ ...props }: React.ComponentProps<typeof ModalPrimitive.Root>) {
  return <ModalPrimitive.Root data-slot="modal" {...props} />
}

function ModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Title>) {
  return (
    <ModalPrimitive.Title
      data-slot="modal-title"
      className={className}
      {...props}
    />
  )
}

function ModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Description>) {
  return (
    <ModalPrimitive.Description
      data-slot="modal-description"
      className={className}
      {...props}
    />
  )
}

function ModalContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Content>) {
  return (
    <ModalPrimitive.Portal>
      <ModalPrimitive.Overlay
        data-slot="modal-overlay"
        className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=open]:fade-in-0"
      />
      <ModalPrimitive.Content
        data-slot="modal-content"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-card shadow-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0',
          className,
        )}
        {...props}
      >
        {children}
        <ModalPrimitive.Close
          aria-label="Fechar"
          className="absolute top-3 right-3 text-highlight outline-none focus-visible:outline-2 focus-visible:outline-ring"
        >
          <XIcon aria-hidden="true" className="size-[18px]" />
        </ModalPrimitive.Close>
      </ModalPrimitive.Content>
    </ModalPrimitive.Portal>
  )
}

export { Modal, ModalContent, ModalDescription, ModalTitle }
