import { useEffect } from 'react'
import { mountAssistant } from './assistant.js'

// The assistant lives outside React's tree (it is appended to <body> once) so a call survives page changes.
export default function AssistantWidget({ hidden }) {
  useEffect(() => { mountAssistant().setHidden(hidden) }, [hidden])
  return null
}
