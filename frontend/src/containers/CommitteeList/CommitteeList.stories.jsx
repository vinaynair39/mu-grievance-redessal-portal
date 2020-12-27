import React from "react";
import CommitteeList from "./CommitteeList";

export default {
	component: CommitteeList,
	title: "CommitteeList",
	decorators: [(story) => <div style={{ padding: "1rem" }}>{story()}</div>],
	excludeStories: /.*Data$/,
};

export const CommitteeListData = [
	{
		name: "Vinay Nair",
		email: "marshallslim39@gmail.com",
		imageUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
		_id: "123",
	},
	{
		name: "Jesica steven",
		email: "marshallslim39@gmail.com",
		imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ7h-f5HkbyVATME3SHaEfSMIUDGEIodfigCQ&usqp=CAU",
		_id: "121113",
	},
	{
		name: "Sam stone",
		email: "marshallslim39@gmail.com",
		imageUrl: "https://miro.medium.com/max/2048/0*0fClPmIScV5pTLoE.jpg",
		_id: "1tt23",
	},
];

export const Default = () => <CommitteeList data={CommitteeListData} />;
