export class Logger {
  static showLoadLogs = true;
  static load(message, warn=false) { if (this.showLoadLogs) {
    if (warn) { console.warn(`LOAD  - ${message}`); }
    else { console.log(`LOAD  - ${message}`); }
  }}

  static showLoginLogs = true;
  static login(message, warn=false) { if (this.showLoginLogs) {
    if (warn) { console.warn(`LOGIN - ${message}`); }
    else { console.log(`LOGIN - ${message}`); }
  }}
  static showMarksLogs = true;
  static marks(message, warn=false) { if (this.showMarksLogs) {
    if (warn) { console.warn(`MARKS - ${message}`); }
    else { console.log(`MARKS - ${message}`); }
  }}

  static showCoreLogs = true;
  static core(message, warn=false) { if (this.showCoreLogs) {
    if (warn) { console.warn(`CORE  - ${message}`); }
    else { console.log(`CORE  - ${message}`); }
  }}
  static showInfoLogs = true;
  static info(message, warn=false) { if (this.showInfoLogs) {
    if (warn) { console.warn(`INFO  - ${message}`); }
    else { console.log(`INFO  - ${message}`); }
  }}
};