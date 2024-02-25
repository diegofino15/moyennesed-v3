import { useState, useEffect } from "react";
import { Platform, Text } from "react-native";
import { VideoIcon } from "lucide-react-native";
import { RewardedAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';
import { PressableScale } from "react-native-pressable-scale";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AdsHandler from "../../../../utils/AdsHandler";


// Rewarded ad unit
const AD_COOLDOWN = 12 * 60 * 60 * 1000; // 12 hours
const adUnitId = __DEV__ ? TestIds.REWARDED : Platform.select({
  ios: process.env.EXPO_PUBLIC_IOS_REWARDED_AD_UNIT_ID,
  android: process.env.EXPO_PUBLIC_ANDROID_REWARDED_AD_UNIT_ID,
});
var rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['élève', 'lycéen', 'collège', 'lycée', 'école', 'éducation'],
  requestNonPersonalizedAdsOnly: !AdsHandler.servePersonalizedAds,
});

// Ad hidden component
function AdHiddenComponent({
  width,
  height,
  canShowContent,
  setCanShowContent,
  theme,
  style,
}) {
  const [triedToShowAd, setTriedToShowAd] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem("canShowAverage").then(value => {
      const data = JSON.parse(value);
      if (data) {
        const lastAdShowedDate = new Date(data?.lastAdShowedDate ?? 0);
        if (Date.now() - lastAdShowedDate <= AD_COOLDOWN) {
          setCanShowContent(true);
          return;
        }
      } else {
        setCanShowContent(true);
        AsyncStorage.setItem("canShowAverage", JSON.stringify({
          lastAdShowedDate: Date.now(),
        }));
        return;
      }

      // Setup ad
      if (AdsHandler.canServeAds) {
        rewarded.addAdEventsListener(event => {
          if (event.type === AdEventType.LOADED) {
            if (triedToShowAd) { rewarded.show(); }
          } else if (event.type === AdEventType.CLOSED || event.type === AdEventType.ERROR) {
            setCanShowContent(true);
            AsyncStorage.setItem("canShowAverage", JSON.stringify({
              lastAdShowedDate: Date.now(),
            }));
          }
        });
        rewarded.load();
      } else { setCanShowContent(true); }
    });
  }, []);

  return canShowContent ? null : (
    <PressableScale style={{
      width: width,
      height: height,
      borderWidth: 2,
      borderColor: theme.colors.background,
      borderRadius: 10,
      overflow: 'hidden',
      ...style,
    }} onPress={() => {
      if (rewarded.loaded) { rewarded.show(); }
      else { setTriedToShowAd(true); }
    }}>
      <BlurView tint="light" intensity={25} style={{
        padding: 10,
        width: '100%',
        height: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: Platform.select({ ios: null, android: theme.colors.background }),
      }}>
        <VideoIcon size={30} color={theme.colors.onSurface}/>
        <Text style={[theme.fonts.labelMedium, { textAlign: 'center' }]}>DÉVOILER LA MOYENNE</Text>
      </BlurView>
    </PressableScale>
  );
}

export default AdHiddenComponent;