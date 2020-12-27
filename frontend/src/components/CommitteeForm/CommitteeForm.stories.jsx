import React from "react";
import { action } from "@storybook/addon-actions";
import { withDesign } from "storybook-addon-designs";

import CommitteeForm from "./CommitteeForm";

export default {
	component: CommitteeForm,
	title: "CommitteeForm",
	decorators: [(story) => <div style={{ padding: "1rem" }}>{story()}</div>],
	excludeStories: /.*Data$/,
};

export const CommitteeFormData = {
	onSubmit: action("onSubmit"),
	loading: false,
};

export const Default = () => <CommitteeForm />;
