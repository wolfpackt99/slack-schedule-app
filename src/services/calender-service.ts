import { Logger } from "@slack/bolt";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {};

export class CalendarService {
  private app: FirebaseApp;
  private logger: Logger;

  constructor(logger: Logger) {
    this.app = initializeApp(firebaseConfig);
    this.logger = logger;
  }

  async getThisWeeks(callback: Function) {
    var items = new Array<CalendarItem>();
    var db = getDatabase(this.app);
    const postListRef = ref(db, "thisweek");
    this.logger.info("out");
    onValue(
      postListRef,
      (snapshot) => {
        let today = new Date();
        let endDate = today.setDate(today.getDate() + 14);
        snapshot.forEach((childSnapshot) => {
          const childData: CalendarItem = childSnapshot.val();
          this.logger.debug(`${childData.CalendarName}"`);
          items.push(childData);
          items = items.sort((a, b) => +new Date(a.Start) - +new Date(b.Start));
          this.logger.debug(items.length);
          // ...
          items = items.filter(
            (a) =>
              +this.getMonday(today) > +new Date(a.Start) &&
              +new Date(a.Start) <= +new Date(endDate)
          );
        });
        callback(items);
      },
      {
        onlyOnce: true,
      }
    );
  }

  getMonday(d: Date) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
}

export interface CalendarItem {
  CalendarName: string;
  CalendarId: string;
  CustomDescription: string;
  EndTime: Date;
  IsAllDay: false;
  IsCustomDateTime: false;
  Location: string;
  Region: string;
  SlackChannelId: string;
  Start: Date;
  StartTime: Date;
  Tag: string;
  Time: string;
  Title: string;
  Type: string;
  Where: string;
}
