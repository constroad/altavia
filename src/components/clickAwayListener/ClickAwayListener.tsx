import React, { PropsWithChildren, useCallback, useEffect, useRef } from 'react'

type ClickAwayListenerProps = PropsWithChildren & {
  onClickAway: () => void
}

export const ClickAwayListener = (props: ClickAwayListenerProps) => {
  const { children, onClickAway } = props
  const ref = useRef<HTMLDivElement>(null)

  const handleClick = useCallback(
    (event: any) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway()
      }
    },
    [onClickAway]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [handleClick])

  return React.cloneElement(children as React.ReactElement, {
    ref,
  })
}
