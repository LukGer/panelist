## Architecture

- **Native app:** Expo Router app with CNG.

## Code Style

- Use TypeScript whenever possible.
- Use kebab-case for all file names. Avoid capital letters.
- Use `@/` path aliases for imports.
- Use root src directory.

## CLI

- Install packages: npx expo install
- Ensure the rules of React are enforced: npx expo lint
- Create native modules: npx create-expo-module --local
- Deploy iOS: npx testflight
- Deploy Android: eas build -p android -s
- Deploy web and server: npx expo export -p web && eas deploy
