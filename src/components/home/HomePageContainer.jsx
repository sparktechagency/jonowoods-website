import React from "react";
import { TodaysVideo } from "./TodaysVideo";
import { ComingSoon } from "./ComingSoon";
import { DailyInspiration } from "./DailyInspiration";
import NewClasses from "../exploreComponents/NewClasses";
import BrowseByCategory from "../exploreComponents/BrowseByCategory";
import YogaQuotePage from "../exploreComponents/Qoute";

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
