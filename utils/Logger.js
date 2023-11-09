export class Logger {
  static showLoadLogs = true;
  static load(message, warn=false) { if (this.showLoadLogs) {
    if (warn) { console.warn(`LOAD  - ${message}`); }
    else { console.log(`LOAD  - ${message}`); }
  }}

  static showLoginLogs = false;
  static login(message, warn=false) { if (this.showLoginLogs) {
    if (warn) { console.warn(`LOGIN - ${message}`); }
    else { console.log(`LOGIN - ${message}`); }
  }}
  static showMarksLogs = false;
  static marks(message, warn=false) { if (this.showMarksLogs) {
    if (warn) { console.warn(`MARKS - ${message}`); }
    else { console.log(`MARKS - ${message}`); }
  }}

  static showCoreLogs = false;
  static core(message, warn=false) { if (this.showCoreLogs) {
    if (warn) { console.warn(`CORE  - ${message}`); }
    else { console.log(`CORE  - ${message}`); }
  }}
  static showInfoLogs = false;
  static info(message, warn=false) { if (this.showInfoLogs) {
    if (warn) { console.warn(`INFO  - ${message}`); }
    else { console.info(`${message}`); }
  }}
};