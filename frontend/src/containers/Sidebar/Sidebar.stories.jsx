import React from "react";
import { action } from "@storybook/addon-actions";
import Sidebar from "./Sidebar";

export default {
	component: Sidebar,
	title: "Sidebar",
	decorators: [(story) => <div style={{ padding: "1rem" }}>{story()}</div>],

	excludeStories: /.*Data$/,
};

export const Dashboard = () => <Sidebar />;
