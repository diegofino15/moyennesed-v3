import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { Account } from "./Account";
import { Preferences } from "./Preferences";
import { CoefficientManager } from "./CoefficientsManager";
import { calculateAllPeriodAverages } from "./Period";
import { Logger } from "../utils/Logger";


export class UserData {
  static connected = false;
  static connecting = false;
  static unavailableServers = false;

  static mainAccount = new Account();
  static childrenAccounts = new Map();

  static token = "";
  static API_URL = "https://api.ecoledirecte.com";
  static currentYearPeriod = "";

  static async login(username, password) {
    this.API_URL = "https://api.ecoledirecte.com";
    if (username.substring(0, 4) == "demo") {
      this.API_URL = "https://api.moyennesed.my.to/test-api";
      Logger.info("Using demo API...");
    }

    Logger.login(`Logging-in ${username}...`);
    this.connected = false;
    this.connecting = true;
    this.unavailableServers = false;

    const credentials = {
      "identifiant": username,
      "motdepasse": encodeURIComponent(password),
    };

    var response = await axios.post(
      `${this.API_URL}/v3/login.awp?v=4`,
      `data=${JSON.stringify(credentials)}`,
      { headers: { "Content-Type": "text/plain" } },
    ).catch(error => {
      Logger.login(`An error occured while logging in : ${error}`, true);
    });
    response ??= { status: 500 };
    this.loginLogs = response.data;

    var success = 0;
    switch (response.status) {
      case 200:
        Logger.login("API request successful");
        switch (response.data.code) {
          case 200:
            Logger.login("Login successful !");
            this.token = response.data.token;
            this.formatReceivedLoginData(response.data.data.accounts.at(0));
            await AsyncStorage.setItem("credentials", JSON.stringify({ username, password }));
            success = 1;
            break;
          case 505: // Wrong password
            Logger.login(`Couldn't connect, wrong password for ${username}`);
            break;
          default:
            Logger.login(`API responded with unknown code ${response.data.code}`, true);
            success = -1;
            break;
        }
        break;
      default:
        Logger.login("API request failed", true);
        success = -1;
        break;
    }

    this.connecting = false;
    this.connected = success == 1;
    this.unavailableServers = success == -1;
    return success;
  }
  static formatReceivedLoginData(jsonData) {
    this.currentYearPeriod = jsonData.anneeScolaireCourante;

    this.mainAccount.init(jsonData, false);
    if (this.marksDataCache.has(this.mainAccount.id.toString()) && this.marksDataCache.get(this.mainAccount.id.toString())) {
      this.mainAccount.periods = this.marksDataCache.get(this.mainAccount.id.toString());
    }
    
    Logger.core(`Created account ${this.mainAccount.fullName()} (${this.mainAccount.id}) (${this.mainAccount.isParent ? "parent" : "student"} account)`);
    this.childrenAccounts.clear();
    if (this.mainAccount.isParent) {
      jsonData.profile.eleves.forEach(childData => {
        const childAccount = new Account();
        childAccount.init(childData, true);
        Logger.core("-> Created child account " + childAccount.fullName() + " (" + childAccount.id + ")");
        if (this.marksDataCache.has(childAccount.id.toString()) && this.marksDataCache.get(childAccount.id.toString())) {
          childAccount.periods = this.marksDataCache.get(childAccount.id.toString());
        }
        this.childrenAccounts.set(childAccount.id.toString(), childAccount);
      });
    }
  }

  static async refreshLogin() {
    Logger.info("Refreshing login...");
    const credentials = JSON.parse(await AsyncStorage.getItem("credentials"));
    if (credentials) {
      return await this.login(credentials.username, credentials.password);
    }
    return -1;
  }

  static async getMarks(accountID) {
    this.unavailableServers = false;

    Logger.marks(`Getting marks for account ${accountID}...`);
    var response = await axios.post(
      `${this.API_URL}/v3/eleves/${accountID}/notes.awp?verbe=get&v=4`,
      'data={"anneeScolaire": ""}',
      { headers: { "Content-Type": "text/plain", "X-Token": this.token } },
    ).catch(error => {
      Logger.marks(`An error occured while getting marks : ${error}`, true);
    });
    response ??= { status: 500 };
    this.marksLogs[accountID] = response.data;
    
    switch (response.status) {
      case 200:
        Logger.marks("API request successful");
        switch (response.data.code) {
          case 200:
            Logger.marks(`Got marks for account ${accountID} !`);
            this.token = response.data.token;
            return response.data.data;
          case 520: // Outdated token
            Logger.info("Outdated token, reconnecting...");
            const reloginSuccessful = await this.refreshLogin();
            if (reloginSuccessful) {
              return await this.getMarks(accountID);
            }
            return 0;
          default:
            Logger.marks(`API responded with unknown code ${response.data.code}`, true);
            this.unavailableServers = true;
            return -1;
        }
      default:
        Logger.marks("API request failed", true);
        this.unavailableServers = true;
        return -1;
    }
  }

  static recalculateAllCoefficients() {
    function recalculatePeriodCoefficients(period) {
      period.marks.forEach(mark => {
        mark.coefficient = CoefficientManager.getDefaultEDMarkCoefficient(mark.id);
        mark.coefficientType = 0;
        var newCoefficient;
        if (Preferences.allowGuessMarkCoefficients) {
          newCoefficient = CoefficientManager.getGuessedMarkCoefficient(mark.id, mark.title);
          if (newCoefficient) {
            mark.coefficient = newCoefficient;
            mark.coefficientType = 1;
          }
        }
        if (Preferences.allowCustomCoefficients) {
          newCoefficient = CoefficientManager.getCustomMarkCoefficient(mark.id);
          if (newCoefficient != undefined) {
            mark.coefficient = newCoefficient;
            mark.coefficientType = 2;
          }
        }
      });
      period.subjects.forEach(subject => {
        subject.coefficient = CoefficientManager.getDefaultEDSubjectCoefficient(subject.id);
        subject.coefficientType = 0;
        var newCoefficient;
        if (Preferences.allowGuessSubjectCoefficients) {
          newCoefficient = CoefficientManager.getGuessedSubjectCoefficient(subject.id, subject.code, subject.subCode, subject.name);
          if (newCoefficient) {
            subject.coefficient = newCoefficient;
            subject.coefficientType = 1;
          }
        }
        if (Preferences.allowCustomCoefficients) {
          newCoefficient = CoefficientManager.getCustomSubjectCoefficient(subject.id);
          if (newCoefficient != undefined) {
            subject.coefficient = newCoefficient;
            subject.coefficientType = 2;
          }
        }

        subject.subSubjects.forEach(subSubject => {
          subSubject.coefficient = CoefficientManager.getDefaultEDSubjectCoefficient(subSubject.id);
          subSubject.coefficientType = 0;
          if (Preferences.allowGuessSubjectCoefficients) {
            newCoefficient = CoefficientManager.getGuessedSubjectCoefficient(subSubject.id, subSubject.code, subSubject.subCode, subSubject.name);
            if (newCoefficient) {
              subSubject.coefficient = newCoefficient;
              subSubject.coefficientType = 1;
            }
          }
          if (Preferences.allowCustomCoefficients) {
            newCoefficient = CoefficientManager.getCustomSubjectCoefficient(subSubject.id);
            if (newCoefficient != undefined) {
              subSubject.coefficient = newCoefficient;
              subSubject.coefficientType = 2;
            }
          }
        });
      });
      calculateAllPeriodAverages(period);
    }
    
    if (this.mainAccount.isParent) {
      this.childrenAccounts.forEach(childAccount => {
        for (let [_, period] of childAccount.periods) {
          recalculatePeriodCoefficients(period);
        }
      });
    } else {
      this.mainAccount.periods.forEach(period =>  {
        recalculatePeriodCoefficients(period);
      });
    }

    CoefficientManager.save();
    this.saveCache();
  }

  static async logout() {
    Logger.info("Logging out...");
    this.connected = false;
    this.connecting = false;
    this.mainAccount.erase();
    this.childrenAccounts.clear();
    this.token = "";
    this.currentYearPeriod = "";
    await AsyncStorage.removeItem("credentials");
    this.gotMarksFor.clear();
    this.marksNeedUpdate.clear();
    this.marksDataCache.clear();
    await AsyncStorage.removeItem("cache");
    await Preferences.erase();
    await CoefficientManager.erase();
    this.temporaryProfilePhoto = "";
    await AsyncStorage.removeItem("photo");
    this.lastBugReport = null;
    Logger.info("Logged out !");
  }

  // Profile photo
  static temporaryProfilePhoto = "";
  static async loadProfilePhoto(account, callback, forceLoad=false) {
    return await AsyncStorage.getItem("photo").then(async (cachePhoto) => {
      if (cachePhoto && !forceLoad) {
        Logger.core("Loaded profile photo from cache");
        this.temporaryProfilePhoto = cachePhoto;
        callback(cachePhoto);
      } else {
        Logger.core("Loading profile photo...");
        if (!account.photoURL) { return null; }
        return await fetch(`https:${account.photoURL}`, { headers: { 'Referer': `http:${account.photoURL}`, 'Host': 'doc1.ecoledirecte.com' } })
        .then(async (response) => {
          const blob = await response.blob();
          const fileReaderInstance = new FileReader();
          fileReaderInstance.readAsDataURL(blob); 
          fileReaderInstance.onload = () => {
            const base64data = fileReaderInstance.result;
            this.temporaryProfilePhoto = base64data;
            AsyncStorage.setItem("photo", base64data);
            Logger.core("Got profile photo !");
            callback(base64data);
          }
        })
        .catch(error => {
          Logger.core("Error getting profile photo: " + error, true);
          this.temporaryProfilePhoto = "";
          AsyncStorage.removeItem("photo");
          callback("");
        });
      }
    });
  }

  // Cache
  static gotMarksFor = new Map();
  static marksNeedUpdate = new Map();
  static marksDataCache = new Map();
  static async loadCache() {
    await AsyncStorage.getItem("cache").then(jsonValue => {
      if (jsonValue != null) {
        const cache = JSON.parse(jsonValue);

        this.mainAccount = new Account();
        this.mainAccount.fromCache(cache.mainAccount);
        if (!this.mainAccount.isParent) { this.marksDataCache.set(this.mainAccount.id.toString(), this.mainAccount.periods); }
        this.childrenAccounts = new Map();

        const cacheChildrenAccounts = new Map(cache.childrenAccounts);
        cacheChildrenAccounts.forEach((cacheChildAccount, key) => {
          const childAccount = new Account();
          childAccount.fromCache(cacheChildAccount);
          this.childrenAccounts.set(childAccount.id.toString(), childAccount);
          this.marksDataCache.set(childAccount.id.toString(), childAccount.periods); 
        });

        this.gotMarksFor = new Map(cache.gotMarksFor);
        this.marksNeedUpdate = new Map(cache.gotMarksFor);
      }
    });
  }
  static async saveCache() {
    const savableChildrenAccounts = new Map();
    this.childrenAccounts.forEach((childAccount, key) => { savableChildrenAccounts.set(key, childAccount.toCache()); });
    
    await AsyncStorage.setItem("cache", JSON.stringify({
      gotMarksFor: Array.from(this.gotMarksFor.entries()),
      mainAccount: this.mainAccount.toCache(),
      childrenAccounts: Array.from(savableChildrenAccounts.entries()),
    }));
  }

  // Logs (for bug reports)
  static loginLogs = {};
  static marksLogs = {};
  static lastBugReport = null;
  static bugReportCooldown = 1000 * 60 * 60 * 24; // 1 day
}