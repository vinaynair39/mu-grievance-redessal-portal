import React from "react";
import { action } from "@storybook/addon-actions";
import CommitteeListItem from "./CommitteeListItem";

export default {
	component: CommitteeListItem,
	title: "CommitteeListItem",
	decorators: [(story) => <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{story()}</div>],
	excludeStories: /.*Data$/,
};

export const CommitteeListItemData = {
	name: "Vinay Nair",
	email: "marshallslim39@gmail.com",
	imageUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
	_id: "123",
};

export const Default = () => <CommitteeListItem {...CommitteeListItemData} />;
