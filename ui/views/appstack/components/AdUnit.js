import { useState } from 'react';
import { View, Platform, Dimensions } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { Separator } from '../../global_components/Separator';


function AdUnit({ topSeparator=true, bottomSeparator=true, profile=false, style, theme }) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [unitID, _setUnitID] = useState(Platform.select({
    ios: "ca-app-pub-3940256099942544/2934735716",//profile ? "ca-app-pub-1869877675520642/4107229992" : "ca-app-pub-1869877675520642/9703764501",
    android: "ca-app-pub-1869877675520642/6839821655",
  }));

  return (
    <View style={{
      marginHorizontal: 20,
      ...style
    }}>
      {topSeparator ? <Separator theme={theme} style={{ marginBottom: 10 }}/> : null}

      <View style={{
        width: Dimensions.get('window').width - 40,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <BannerAd
          unitId={unitID}
          size={BannerAdSize.BANNER}
          onAdLoaded={() => setAdLoaded(true)}
          onAdFailedToLoad={(error) => {
            console.log(`Ad failed to load : ${error}`);
          }}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
            publisherProvidedId: "pub-1869877675520642"
          }}
        />
      </View>
      
      {bottomSeparator ? <Separator theme={theme} style={{ marginTop: 10 }}/> : null}
    </View>
  );
}

export { AdUnit };