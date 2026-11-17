# Monster Index DB

Aplicación móvil híbrida creada con Ionic, Angular y Capacitor para explorar,
buscar y comparar información de criaturas mediante datos de PokéAPI.

## Requisitos

- Node.js 18.19 o posterior (compatible con Angular 18).
- npm.
- Ionic CLI: `npm install -g @ionic/cli`.
- Android Studio para compilar y ejecutar en Android.
- macOS con Xcode para compilar y ejecutar en iOS.

## Instalación y desarrollo

```bash
npm install
ionic serve
```

`ionic serve` inicia la aplicación en el navegador con recarga durante el
desarrollo.

## Compilación de producción

```bash
ionic build --prod
npx cap sync
```

Para compilar o ejecutar en Android, abre el proyecto nativo en Android Studio:

```bash
npx cap open android
```

El proyecto incluye actualmente la plataforma Android. Para agregar iOS en
macOS, instala primero su plataforma de Capacitor y sincronízala:

```bash
npm install @capacitor/ios
npx cap add ios
npx cap sync ios
npx cap open ios
```

## Datos y privacidad

La aplicación consulta PokéAPI mediante HTTPS para mostrar información. Las
imágenes y sonidos se cargan desde las URLs incluidas en las respuestas de la
API. No recopila datos personales ni incorpora SDKs de rastreo o analítica de
terceros. Consulta la [Política de Privacidad](./PRIVACY.md).

## Aviso legal

Aplicación no oficial desarrollada con fines educativos e informativos. Los
datos y recursos provienen de PokéAPI. Pokémon y los nombres de los personajes
son marcas registradas, propiedad y con derechos de autor de Nintendo,
Creatures Inc. y GAME FREAK Inc. Esta app no está afiliada ni respaldada por los
propietarios de la marca.
