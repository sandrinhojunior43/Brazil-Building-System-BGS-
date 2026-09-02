import React, { useRef } from 'react';
import { GestureResponderEvent, PanResponder, PanResponderGestureState, StyleSheet, View, ViewStyle } from 'react-native';
import { GLView, type ExpoWebGLRenderingContext } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { colors } from '../theme';

interface Viewport3DProps {
  /** Identifica qual demonstração/modelo exibir (ver `Exercise.model3dId`). */
  modelId: string;
  style?: ViewStyle;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * Visualizador 3D de execução de exercício.
 *
 * Hoje renderiza uma figura procedural (placeholder) com expo-gl + three.js
 * via expo-three, já com: iluminação, câmera, rotação por arraste (pan) e
 * uma animação simples simulando o movimento do exercício.
 *
 * Para plugar o modelo 3D real por exercício:
 * 1. Coloque o asset `.glb` em `assets/models/<model3dId>.glb`;
 * 2. Carregue com `GLTFLoader` (`three/examples/jsm/loaders/GLTFLoader`),
 *    resolvendo o URI local via `expo-asset`
 *    (`Asset.fromModule(require(...)).downloadAsync()`);
 * 3. Troque `buildPlaceholderFigure()` pela cena carregada e toque o clipe
 *    de animação do glTF via `THREE.AnimationMixer` dentro do loop `render`.
 *
 * Referência: https://docs.expo.dev/versions/v57.0.0/sdk/gl-view/
 */
export function Viewport3D({ modelId, style }: Viewport3DProps) {
  const rotation = useRef({ x: -0.15, y: 0 });
  const dragStart = useRef({ x: -0.15, y: 0 });
  const cleanupRef = useRef<() => void>(() => {});

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragStart.current = { ...rotation.current };
      },
      onPanResponderMove: (_event: GestureResponderEvent, gesture: PanResponderGestureState) => {
        rotation.current = {
          x: clamp(dragStart.current.x - gesture.dy * 0.006, -1.1, 1.1),
          y: dragStart.current.y + gesture.dx * 0.006,
        };
      },
    })
  ).current;

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(colors.surfaceAlt, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 4.2);
    camera.lookAt(0, 1, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x3dd68c, 0.25);
    fillLight.position.set(-3, 1, -2);
    scene.add(fillLight);

    const figure = buildPlaceholderFigure(modelId);
    scene.add(figure.group);

    const start = Date.now();
    let frameId = 0;

    const renderLoop = () => {
      frameId = requestAnimationFrame(renderLoop);
      const elapsed = (Date.now() - start) / 1000;

      figure.animate(elapsed);
      figure.group.rotation.y = rotation.current.y;
      figure.group.rotation.x = rotation.current.x * 0.25;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    renderLoop();

    cleanupRef.current = () => cancelAnimationFrame(frameId);
  };

  React.useEffect(() => () => cleanupRef.current(), []);

  return (
    <View style={[styles.container, style]} {...panResponder.panHandlers}>
      <GLView style={styles.gl} onContextCreate={onContextCreate} />
    </View>
  );
}

/**
 * Monta uma figura humana estilizada simples (cápsulas/esferas) e retorna
 * uma função `animate(elapsedSeconds)` que move braços/pernas para simular
 * a execução do exercício — placeholder até termos o modelo 3D real.
 */
function buildPlaceholderFigure(modelId: string) {
  const group = new THREE.Group();

  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1c201e, roughness: 0.6 });
  const accentMaterial = new THREE.MeshStandardMaterial({ color: 0x00a859, roughness: 0.4 });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x151816, roughness: 1 });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.75, 4, 8), bodyMaterial);
  torso.position.y = 1.15;
  group.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), bodyMaterial);
  head.position.y = 1.85;
  group.add(head);

  // Pivô dos braços deslocado para a "ombro", para a rotação parecer
  // natural em vez de girar em torno do centro do braço.
  const armGeometry = new THREE.CapsuleGeometry(0.09, 0.55, 4, 8);
  armGeometry.translate(0, -0.3, 0);

  const leftArm = new THREE.Mesh(armGeometry, accentMaterial);
  leftArm.position.set(-0.5, 1.5, 0);
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeometry, accentMaterial);
  rightArm.position.set(0.5, 1.5, 0);
  group.add(rightArm);

  const legGeometry = new THREE.CapsuleGeometry(0.12, 0.7, 4, 8);
  const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
  leftLeg.position.set(-0.18, 0.5, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
  rightLeg.position.set(0.18, 0.5, 0);
  group.add(rightLeg);

  const floor = new THREE.Mesh(new THREE.CircleGeometry(1.3, 32), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  // Cadência do movimento varia um pouco conforme o exercício, só para o
  // placeholder não parecer sempre idêntico entre exercícios diferentes.
  const speed = /squat|press|row/.test(modelId) ? 0.9 : 1.2;

  return {
    group,
    animate(elapsed: number) {
      const swing = Math.sin(elapsed * speed * 2) * 0.55;
      leftArm.rotation.x = swing;
      rightArm.rotation.x = -swing;
      group.position.y = Math.abs(Math.sin(elapsed * speed * 2)) * 0.04;
    },
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  gl: {
    flex: 1,
  },
});
