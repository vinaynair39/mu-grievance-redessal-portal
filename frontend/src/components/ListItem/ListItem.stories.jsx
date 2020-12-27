import React from "react";
import { action } from "@storybook/addon-actions";
import ListItem from "./ListItem";

export default {
	component: ListItem,
	title: "ListItem",
	decorators: [(story) => <div style={{ padding: "3rem" }}>{story()}</div>],

	excludeStories: /.*Data$/,
};

export const ListItemData = {
	title: "My College made me pay fees more than what I was supposed to pay",
	timestamp: 1593166964958,
	against: "Ramrao Adik insititue of technology",
	_id: "12345",
	status: -1,
	type: "selected",
	author: {
		email: "vnnair39@gmail.com",
		name: "Vinay",
	},
	meetingType: null,
	meetinLink: null,
	alloted_on: null,
};

export const Dashboard = () => <ListItem {...ListItemData} />;
// export const Selected = () => <ListItem {...ListItemData} />;
// export const Processing = () => <ListItem {...ListItemData} status="0" type="processing" />;
