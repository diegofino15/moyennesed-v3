import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { Account } from "./Account";
import { Preferences } from "./Preferences";
import { CoefficientManager, getMarkCoefficient, getSubjectCoefficient } from "../utils/CoefficientsManager";
import { calculateAllAverages } from "./Period";

export class UserData {
  static connected = false;
  static connecting = false;

  static mainAccount = new Account();
  static childrenAccounts = new Map();

  static token = "";
  static API_URL = "https://api.ecoledirecte.com";
  static currentYearPeriod = "";

  static async login(username, password) {
    this.API_URL = "https://api.ecoledirecte.com";
    if (username == "demo" || username == "demo-parent") { this.API_URL = "http://api.moyennesed.my.to:777/test-api"; }
    
    console.log(`Logging-in ${username}...`);
    this.connected = false;
    this.connecting = true;

    var response = await axios.post(
      `${this.API_URL}/v3/login.awp`,
      `data={"identifiant":"${username}", "motdepasse":"${password}"}`,
      { headers: { "Content-Type": "text/plain" } },
    ).catch(error => {
      console.log(`An error occured while logging in : ${error}`);
    });
    response ??= { status: 500 };

    var success = false;
    switch (response.status) {
      case 200:
        console.log("API request successful");
        switch (response.data.code) {
          case 200:
            console.log("Login successful !");
            this.token = response.data.token;
            this.formatReceivedLoginData(response.data.data.accounts.at(0));
            await AsyncStorage.setItem("credentials", JSON.stringify({ username, password }));
            success = true;
            break;
          case 505: // Wrong password
            console.log(`Couldn't connect, wrong password for ${username}`);
            break;
          default:
            console.log(`API responded with unknown code ${response.data.code}`);
            break;
        }
        break;
      default:
        console.log("API request failed");
        break;
    }

    this.connecting = false;
    this.connected = success;
    return success;
  }
  static formatReceivedLoginData(jsonData) {
    this.currentYearPeriod = jsonData.anneeScolaireCourante;

    this.mainAccount.init(jsonData, false);
    if (this.marksDataCache.has(this.mainAccount.id.toString()) && this.marksDataCache.get(this.mainAccount.id.toString())) {
      this.mainAccount.periods = this.marksDataCache.get(this.mainAccount.id.toString());
    }
    
    console.log(`Created account ${this.mainAccount.fullName()} (${this.mainAccount.id}) (${this.mainAccount.isParent ? "parent" : "student"} account)`);
    this.childrenAccounts.clear();
    if (this.mainAccount.isParent) {
      jsonData.profile.eleves.forEach(childData => {
        const childAccount = new Account();
        childAccount.init(childData, true);
        console.log("-> Created child account " + childAccount.fullName() + " (" + childAccount.id + ")");
        if (this.marksDataCache.has(childAccount.id.toString()) && this.marksDataCache.get(childAccount.id.toString())) {
          childAccount.periods = this.marksDataCache.get(childAccount.id.toString());
        }
        this.childrenAccounts.set(childAccount.id.toString(), childAccount);
      });
    }
  }

  static async refreshLogin() {
    console.log("Refreshing login...");
    const credentials = JSON.parse(await AsyncStorage.getItem("credentials"));
    if (credentials) {
      return await this.login(credentials.username, credentials.password);
    }
    return false;
  }

  static async getMarks(accountID) {
    console.log(`Getting marks for account ${accountID}...`);
    var response = await axios.post(
      `${this.API_URL}/v3/eleves/${accountID}/notes.awp?verbe=get`,
      'data={"anneeScolaire": ""}',
      { headers: { "Content-Type": "text/plain", "X-Token": this.token } },
    ).catch(error => {
      console.log(`An error occured while getting marks : ${error}`);
    });
    response ??= {
      status: 500
    };
    
    switch (response.status) {
      case 200:
        console.log("API request successful");
        switch (response.data.code) {
          case 200:
            console.log(`Got marks for account ${accountID} !`);
            this.token = response.data.token;
            return response.data.data;
          case 520: // Outdated token
            console.log("Outdated token, reconnecting...");
            const reloginSuccessful = await this.refreshLogin();
            if (reloginSuccessful) {
              return await this.getMarks(accountID);
            }
            return null;
          default:
            console.log(`API responded with unknown code ${response.data.code}`);
            return null;
        }
      default:
        console.log("API request failed");
        return null;
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
          if (newCoefficient) {
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
          if (newCoefficient) {
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
            if (newCoefficient) {
              subSubject.coefficient = newCoefficient;
              subSubject.coefficientType = 2;
            }
          }
        });
      });
      calculateAllAverages(period);
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
    console.log("Logging out...");
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
    console.log("Logged out !");
  }

  // Profile photo
  static temporaryProfilePhoto = "";
  static async loadProfilePhoto(account, callback, forceLoad=false) {
    return await AsyncStorage.getItem("photo").then(async (cachePhoto) => {
      if (cachePhoto && !forceLoad) {
        console.log("Loaded profile photo from cache");
        this.temporaryProfilePhoto = cachePhoto;
        callback(cachePhoto);
      } else {
        console.log("Loading profile photo...");
        return await fetch(`https:${account.photoURL}`, { headers: { 'Referer': `http:${account.photoURL}`, 'Host': 'doc1.ecoledirecte.com' } })
        .then(async (response) => {
          const blob = await response.blob();
          const fileReaderInstance = new FileReader();
          fileReaderInstance.readAsDataURL(blob); 
          fileReaderInstance.onload = () => {
            const base64data = fileReaderInstance.result;
            this.temporaryProfilePhoto = base64data;
            AsyncStorage.setItem("photo", base64data);
            console.log("Got profile photo !");
            callback(base64data);
          }
        })
        .catch(error => {
          console.log("Error getting profile photo: " + error);
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
}
