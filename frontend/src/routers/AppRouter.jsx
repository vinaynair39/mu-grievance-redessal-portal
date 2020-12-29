import About from "pages/About/About";
import CommitteeDashboardPage from "pages/CommitteeDashboardPage/CommitteeDashboardPage";
import CommitteeMeetingPage from "pages/CommitteeMeetingPage/CommitteeMeetingPage";
import CommitteePage from "pages/CommitteePage/CommitteePage";
import CommitteeViewPage from "pages/CommitteeViewPage/CommitteeViewPage";
import CompletedPage from "pages/CompletedPage/CompletedPage";
import Contact from "pages/Contact/Contact";
import HomePage from "pages/HomePage/HomePage";
import PostGrievance from "pages/PostGrievance/PostGrievance";
import SecretaryDashboard from "pages/SecretaryDashboard/SecretaryDashboard";
import React from "react";
import { BrowserRouter as Router, Redirect, Switch, Route } from "react-router-dom";
import ProfilePage from "pages/ProfilePage/ProfilePage";
import SecretaryStats from "pages/SecretaryStatsPage/SecretaryStatsPage";
import SelectedPage from "pages/SelectedPage/SelectedPage";
import StudentDashboardPage from "pages/StudentDashboardPage/StudentDashboardPage";
import StudentGrievanceStatus from "pages/StudentGrievanceStatus/StudentGrievanceStatus";
import UnderProcessPage from "pages/UnderProcessPage/UnderProcessPage";
import UploadPage from "pages/UploadPage/UploadPage";
import ViewGrievance from "pages/ViewGrievance/ViewGrievance";
import CommitteeRoute from "./CommitteeRoute";
import PublicRoute from "./PublicRoute";
import SecretaryRoute from "./SecretaryRoute";
import StudentRoute from "./StudentRoute";

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <PublicRoute path="/" component={HomePage} exact />
        <PublicRoute path="/about" component={About} exact />
        <PublicRoute path="/contact" component={Contact} exact />
        <PublicRoute path="/upload/:id" component={UploadPage} />

        <SecretaryRoute path="/secretary" component={SecretaryDashboard} exact />
        <SecretaryRoute path="/secretary/selected" component={SelectedPage} exact />
        <SecretaryRoute path="/secretary/processing" component={UnderProcessPage} exact />
        <SecretaryRoute path="/secretary/completed" component={CompletedPage} exact />
        <SecretaryRoute path="/secretary/grievance/:id" component={ViewGrievance} />
        <SecretaryRoute path="/secretary/statistics" component={SecretaryStats} />
        <SecretaryRoute path="/secretary/committee" component={CommitteePage} exact />
        <SecretaryRoute path="/secretary/committee/register" component={CommitteeViewPage} exact />
        <SecretaryRoute path="/secretary/committee/:id" component={CommitteeViewPage} exact={true} />
        <SecretaryRoute path="/secretary/committee/edit/:id" component={CommitteeViewPage} exact={true} />
        <SecretaryRoute path="/secretary/profile" component={ProfilePage} exact={true} />

        <StudentRoute path="/student" component={StudentDashboardPage} exact />
        <StudentRoute path="/student/status/:id" component={ViewGrievance} exact />
        <StudentRoute path="/student/edit/:id" component={PostGrievance} exact />
        <StudentRoute path="/student/status" component={StudentGrievanceStatus} exact />
        <StudentRoute path="/student/post" component={PostGrievance} exact />

        <CommitteeRoute path="/committee" component={CommitteeDashboardPage} exact />
        <CommitteeRoute path="/committee/meeting" component={CommitteeMeetingPage} exact />
        <CommitteeRoute path="/committee/grievance/:id" component={ViewGrievance} exact />
        <CommitteeRoute path="/committee/profile" component={ProfilePage} exact={true} />
        <Route render={() => <Redirect to={{ pathname: "/" }} />} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
