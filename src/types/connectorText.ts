export type ConnectorTextBlock = {
  type: 'connector_text'
  text?: string
}

export type ConnectorTextDelta = {
  type: 'connector_text_delta'
  text?: string
}

export function isConnectorTextBlock(_value: unknown): _value is ConnectorTextBlock {
  return false
}
