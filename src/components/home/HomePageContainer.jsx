import BrowseByCategory from "../exploreComponents/BrowseByCategory";
import NewClasses from "../exploreComponents/NewClasses";
import YogaQuotePage from "../exploreComponents/Qoute";
import { ComingSoon } from "./ComingSoon";
import { DailyInspiration } from "./DailyInspiration";
import { TodaysVideo } from "./TodaysVideo";

const HomePageContainer = () => {
  
  return (
    <div>
      <YogaQuotePage />
      <TodaysVideo />
      <ComingSoon />
      <DailyInspiration />
      <BrowseByCategory />
      <NewClasses />
    </div>
  );
};

export default HomePageContainer;
