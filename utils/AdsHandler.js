import { Platform } from 'react-native';
import mobileAds, { MaxAdContentRating, AdsConsent, AppOpenAd, AdEventType, TestIds, AdsConsentStatus } from 'react-native-google-mobile-ads';

import { Logger } from './Logger';


export class AdsHandler {
  static debugMode = false;
  static initialized = false;

  // Main configuration
  static async setConfig() {
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.T, // Teens
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
    });
  }

  // Consent status
  static alreadyOptainedConsent = false;
  static personalizedAdsConsent = false;
  static async getConsentStatus() {
    const consentInfo = await AdsConsent.requestInfoUpdate();
    this.alreadyOptainedConsent = consentInfo.status == AdsConsentStatus.OBTAINED;
    if (consentInfo.isConsentFormAvailable) { await AdsConsent.loadAndShowConsentFormIfRequired(); }
    const { selectPersonalisedAds } = await AdsConsent.getUserChoices();
    this.personalizedAdsConsent = selectPersonalisedAds;
  }

  // Main initialize function
  static async initialize(setShowed) {
    Logger.info("Initializing Ads...");

    await this.setConfig();
    await this.getConsentStatus();
    await mobileAds().initialize();
    this.initialized = true;
    
    if (this.triedShowingAppOpenAd && !this.showedAppOpenAd && this.alreadyOptainedConsent) { this.showAppOpenAd(setShowed); }
  }

  
  // AppOpen Ad
  static triedShowingAppOpenAd = false;
  static showedAppOpenAd = false;
  static appOpenAdID = Platform.OS === "ios" ? "ca-app-pub-1869877675520642/7552640661" : "ca-app-pub-1869877675520642/2337387712";
  static showAppOpenAd(setShowed) {
    this.triedShowingAppOpenAd = true;
    if (!this.initialized) { return; }
    this.showedAppOpenAd = true;

    Logger.info("Loading AppOpen Ad...");

    const appOpenAd = AppOpenAd.createForAdRequest(this.debugMode ? TestIds.APP_OPEN : this.appOpenAdID, {
      requestNonPersonalizedAdsOnly: !this.personalizedAdsConsent,
    });
    appOpenAd.addAdEventsListener((event) => {
      if (event.type === AdEventType.LOADED) {
        appOpenAd.show();
      } else if (event.type == AdEventType.ERROR) {
        Logger.info("AppOpen Ad couldn't open...", true);
        Logger.info(event.payload, true);
        setShowed(true);
      } else if (event.type === AdEventType.CLOSED) {
        setShowed(true);
      }
    });
    appOpenAd.load();
  }
}