import React from "react";
import { action } from "@storybook/addon-actions";
import List from "./List";

export default {
	component: List,
	title: "List",
	decorators: [(story) => <div style={{ padding: "1rem" }}>{story()}</div>],

	excludeStories: /.*Data$/,
};

export const ListData = [
	{
		title: "My College made me pay fees more than what I was supposed to pay",
		timestamp: 1593166964958,
		against: "Ramrao Adik insititue of technology",
		_id: "12345",
		status: "-2",
		type: "dashboard",
		author: {
			email: "vnnair39@gmail.com",
			name: "Vinay",
		},
		allotedDate: 1593166964658,
	},
	{
		title: "My College made me pay fees more than what I was supposed to pay",
		timestamp: 1593166964958,
		against: "Ramrao Adik insititue of technology",
		_id: "12345",
		status: "-2",
		type: "dashboard",
		author: {
			email: "vnnair39@gmail.com",
			name: "Vinay",
		},
		allotedDate: 1593166964658,
	},
	{
		title: "My College made me pay fees more than what I was supposed to pay",
		timestamp: 1593166964958,
		against: "Ramrao Adik insititue of technology",
		_id: "12345",
		status: "-2",
		type: "dashboard",
		author: {
			email: "vnnair39@gmail.com",
			name: "Vinay",
		},
		allotedDate: 1593166964658,
	},
];

export const Dashboard = () => <List grievances={ListData} />;
export const Empty = () => <List grievances={[]} />;
