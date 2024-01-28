import { cloneElement } from 'react'
import { AlertDialogActionProps, AlertDialogCancelProps } from '@radix-ui/react-alert-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog'
import { Button } from './button'

type AlertProps = {
  className?: string
  style?: React.CSSProperties
  trigger: React.ReactElement
  title: string
  description?: string
  cancelText?: string
  cancelButtonProps?: Omit<AlertDialogCancelProps, 'onClick'>
  onCancel?: () => void
  okText?: string
  okButtonProps?: Omit<AlertDialogActionProps, 'onClick'>
  onOk?: () => void
  loading?: boolean
}

export default function Alert({
  className,
  style,
  trigger,
  title,
  description,
  cancelText = 'Cancel',
  cancelButtonProps,
  onCancel,
  okText = 'Continue',
  okButtonProps,
  onOk,
  loading,
}: AlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{cloneElement(trigger)}</AlertDialogTrigger>

      <AlertDialogContent className={className} style={style}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {!!description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel {...cancelButtonProps} onClick={onCancel} asChild>
            <Button loading={loading}>{cancelText}</Button>
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/80"
            {...okButtonProps}
            onClick={onOk}
            asChild
          >
            <Button loading={loading}>{okText}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
