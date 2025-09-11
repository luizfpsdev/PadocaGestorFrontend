import './App.css'
import { KeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'

function App() {

  const keycloakProviderInitConfig = {
    onLoad: 'check-sso',
  }

  function onKeycloakEvent(event, error) {
    console.log('onKeycloakEvent', event, error)
  }

  function onKeycloakTokens(tokens) {
    console.log('onKeycloakTokens', tokens)
  }

  return (
    <>
      <KeycloakProvider
        keycloak={keycloak}
        initConfig={keycloakProviderInitConfig}
        onEvent={onKeycloakEvent}
        onTokens={onKeycloakTokens}
      >

      </KeycloakProvider>
    </>
  )
}

export default App
