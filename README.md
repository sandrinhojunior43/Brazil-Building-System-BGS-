# Brazil Building System (BGS)

Aplicativo mobile para montar rotinas de treino, demonstrar exercícios com
modelo 3D e acompanhar a evolução do usuário na academia.

## Stack

- **React Native + Expo** (SDK 57, TypeScript)
- **React Navigation** (bottom tabs + native stack)
- Estrutura pronta para integração de um visualizador 3D de exercícios
  (`src/screens/Exercise3DScreen.tsx`)

## Como rodar

```bash
npm install
npm start        # abre o Expo Dev Tools / QR code
npm run android   # emulador/dispositivo Android
npm run ios       # simulador iOS (requer macOS)
npm run web       # preview no navegador (requer `npx expo install react-dom react-native-web`)
```

## Estrutura do projeto

```
src/
  theme/         # cores, espaçamento, tipografia e breakpoints do BGS
  hooks/
    useResponsive.ts   # hook central de responsividade (ver abaixo)
  components/    # componentes de UI reutilizáveis e responsivos
  navigation/    # bottom tabs + stacks (React Navigation)
  screens/       # telas do app
  data/          # dados de exemplo (mock) de rotinas/exercícios
  types/         # tipos de domínio (Routine, Exercise, ProgressEntry)
```

## Responsividade

Todo o app é construído em torno do hook `useResponsive()`
(`src/hooks/useResponsive.ts`), que usa `useWindowDimensions` do React
Native — ao contrário de `Dimensions.get`, ele recalcula automaticamente
quando o dispositivo gira, entra em split-screen ou é uma tela dobrável.

O hook expõe:

- `breakpoint`: `xs | sm | md | lg | xl`, conforme a largura da tela;
- `isTablet` / `isLandscape`: flags de layout;
- `scale(size)` / `scaleFont(size)`: escalam dimensões e fontes de forma
  proporcional à largura da tela, com limites (min/max) para não ficar
  desproporcional em telas muito pequenas ou muito grandes;
- `columns`: número de colunas sugerido para grades de cards (1 em
  celulares pequenos, até 4 em tablets);
- `contentPadding`: padding horizontal de conteúdo sugerido.

Componentes-base já aplicam isso automaticamente:

- `<Screen>`: respeita safe areas (notch, status bar, home indicator) e
  limita/centraliza a largura do conteúdo em telas grandes;
- `<AppText>`: escala fonte automaticamente por breakpoint;
- `<AppButton>`: garante altura mínima de toque de 48dp em qualquer tela;
- `<ResponsiveGrid>`: reflui o número de colunas conforme o tamanho da
  tela.

A tela de execução de exercício (`Exercise3DScreen`) é o melhor exemplo
prático: em celular na vertical o modelo 3D e as informações ficam
empilhados; em tablet ou com o celular na horizontal, ficam lado a lado.

## Próximos passos sugeridos

- Integrar o visualizador 3D real (ex.: `expo-gl` + `three.js` /
  `react-three-fiber`) no lugar do placeholder em `Exercise3DScreen`,
  carregando um asset `.glb` por exercício via `exercise.model3dId`.
- Substituir os dados mockados (`src/data/mockRoutines.ts`) por uma API.
- Adicionar autenticação de usuário e persistência de progresso.
