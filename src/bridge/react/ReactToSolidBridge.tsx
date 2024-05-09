import {
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  createPortal,
} from 'react-dom'
import {
  type ParentComponent,
  createSignal,
} from 'solid-js'
import {
  Portal,
} from 'solid-js/web'

import {
  ReactToSolidBridgeContext,
} from './ReactToSolidBridgeContext'
import {
  SolidBridgeContainer,
} from '../solid/SolidBridgeContainer'
import {
  SolidToReactPortalElement,
} from '../solid/SolidToReactPortalElement'
import {
  useItems,
} from './useItems'

const initialSolidSignals = {}

export type ReactToSolidBridgeType = {
  children: ReactNode,
  getSolidComponent: () => ParentComponent,
  props: Record<string, any>,
  solidComponent: ParentComponent,
}

export const ReactToSolidBridge = ({
  children,
  getSolidComponent,
  props,
  solidComponent,
}: ReactToSolidBridgeType) => {
  const {
    addSolidChild,
    removeSolidChild,
  } = (
    useContext(
      ReactToSolidBridgeContext
    )
  )

  const {
    addItem: addSolidGrandchild,
    getItems: getSolidGrandchildren,
    removeItem: removeSolidGrandchild,
    subscribeToItems: subscribeToSolidGrandchildren,
  } = (
    useItems()
  )

  const [
    portalDomElement,
    setPortalDomElement,
  ] = (
    useState()
  )

  const parentDomElement = (
    useRef<
      HTMLDivElement
    >(
      null
    )
  )

  const getSolidComponentRef = (
    useRef(
      getSolidComponent
    )
  )

  useEffect(
    () => {
      getSolidComponentRef
      .current = (
        getSolidComponent
      )
    },
    [
      getSolidComponent
    ]
  )

  const solidComponentRef = (
    useRef(
      solidComponent
    )
  )

  useEffect(
    () => {
      solidComponentRef
      .current = (
        solidComponent
      )
    },
    [
      solidComponent
    ]
  )

  const propsRef = (
    useRef(
      props
    )
  )

  useEffect(
    () => {
      propsRef
      .current = (
        props
      )
    },
    [
      props
    ]
  )

  const solidPropsRef = (
    useRef()
  )

  const solidSignalsRef = (
    useRef(
      initialSolidSignals
    )
  )

  useEffect(
    () => {
      for (let prop in (props?.values || props)) {
        if (
          typeof (
            props
            [prop]
          )
          === 'function'
        ) {
          if (
            !(
              solidSignalsRef
              .current
              [prop]
            )
          ) {
            solidSignalsRef
            .current = {
              ...(
                solidSignalsRef
                .current
              ),
              [prop]: [
                (
                  ...args
                ) => (
                  propsRef
                  .current
                  [prop](
                    ...args
                  )
                )
              ],
            }
          }
        }
        else {
          if (
            !(
              solidSignalsRef
              .current
              [prop]
            )
          ) {
            solidSignalsRef
            .current = {
              ...(
                solidSignalsRef
                .current
              ),
              [prop]: (
                createSignal(
                  props
                  [prop]
                )
              ),
            }
          }
          else {
            solidSignalsRef
            .current
            [prop]
            [1](
              props
              [prop]
            )
          }
        }
      }

      if (
        !(
          solidPropsRef
          .current
        )
      ) {
        solidPropsRef
        .current = (
          Object
          .fromEntries(
            Object
            .entries(
              solidSignalsRef
              .current
            )
            .map(([
              key,
              value,
            ]) => ([
              key,
              (
                value
                [0]
              ),
            ]))
          )
        )
      }
    },
    [
      props,
    ],
  )

  useEffect(
    () => {
      if (!addSolidChild) {
        throw new Error(
          'You need to wrap `ReactToSolidBridge` in a `ReactToSolidBridgeProvider` component at the top-level of your React app.'
        )
      }

      const getSolidChildren = () => ([
        SolidToReactPortalElement({
          getChildElement: (
            setPortalDomElement
          ),
        }),
        (
          SolidBridgeContainer({
            getChildren: (
              getSolidGrandchildren
            ),
            subscribeToChildren: (
              subscribeToSolidGrandchildren
            ),
          })
        )
      ])

      const SolidChildComponent = () => (
        Portal({
          get children() {
            if (
              solidComponentRef
              .current
            ) {
              const proxy = (
                new Proxy(
                  {
                    get children() {
                      return getSolidChildren()
                    }
                  },
                  {
                    get: (
                      proxy,
                      propertyName,
                    ) => (
                      (
                        propertyName in (
                          solidPropsRef
                          .current
                        )
                      )
                      ? (
                        solidPropsRef
                        .current
                        [propertyName]()
                      )
                      : (
                        Reflect
                        .get(
                          proxy,
                          propertyName,
                        )
                      )
                    ),
                  }
                )
              )

              return (
                solidComponentRef
                .current(
                  proxy
                )
              )
            }
            else {
              return (
                getSolidComponentRef
                .current({
                  getChildren: getSolidChildren,
                  props: (
                    solidPropsRef
                    .current
                  ),
                })
              )
            }
          },
          mount: (
            parentDomElement
            .current
          ),
        })
      )

      addSolidChild(
        SolidChildComponent
      )

      return () => {
        removeSolidChild(
          SolidChildComponent
        )
      }
    },
    [
      addSolidChild,
      getSolidGrandchildren,
      removeSolidChild,
      subscribeToSolidGrandchildren,
    ],
  )

  const providerValue = (
    useMemo(
      () => ({
        addSolidChild: addSolidGrandchild,
        removeSolidChild: removeSolidGrandchild,
      }),
      [
        addSolidGrandchild,
        removeSolidGrandchild,
      ],
    )
  )

  return (
    <div ref={parentDomElement}>
      <ReactToSolidBridgeContext.Provider
        value={providerValue}
      >
        {
          children
          && portalDomElement
          && (
            createPortal(
              children,
              portalDomElement
            )
          )
        }
      </ReactToSolidBridgeContext.Provider>
    </div>
  )
}

export default ReactToSolidBridge
