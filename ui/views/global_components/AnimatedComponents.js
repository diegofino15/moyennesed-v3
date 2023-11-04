import { useRef, useEffect } from "react";
import { Animated, Easing } from "react-native";


function AnimatedComponent({ index, animateRef, children }) {
  const appearAnimation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    appearAnimation.setValue(0);
    Animated.timing(appearAnimation, {
      toValue: 1,
      duration: 400,
      easing: Easing.elastic(1),
      useNativeDriver: true,
      delay: index * 100,
    }).start();
  }, [animateRef.current]);
  
  return (
    <Animated.View style={{
      opacity: appearAnimation ?? 0,
      transform: [{
        translateY: appearAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        })}, {
        scale: appearAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        })
      }],
    }}>
      {children}
    </Animated.View>
  );
}

export { AnimatedComponent };