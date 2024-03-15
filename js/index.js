const fetchTable = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

fetchTable('public/json/timeTable.json')
  .then(jsonData => {
		sTable(jsonData)
		timeData(jsonData)
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });

const idName = [
	{
		name: "stage",
		jaName: "ステージ"
	},{
		name: "ONED",
		jaName: "ONED"
	},{
		name: "DJ",
		jaName: "DJ企画"
	},{
		name: "smashBros",
		jaName: "スマブラ企画"
	}
]
const formatIdName = (id) => {
	return idName.find(item => item.name === id).jaName;
}
const linkId = (id) => {
	return `timetable.html#${id}`
}
const calcTime = (hour, minutes, timeRequired) => {
	const totalMinutes = minutes + timeRequired;
	const newHour = hour + Math.floor(totalMinutes / 60);
	const newMinutes = totalMinutes % 60;

	return `${hour}時${minutes}分~${newHour}時${newMinutes}分`;
};
const sTableFlame = (id, user, header, body) => {
	const timeTable = []
	const tableBody = [`<tr>
		<th><a href="${linkId(id)}">${formatIdName(id)}</a></th>
		<td><a href="${linkId(id)}">${user}</a></td>
		<td><a href="${linkId(id)}">${header}</a></td>
		<td><a href="${linkId(id)}">${calcTime(...body)}</a></td>
	</tr>`];
	timeTable.push(...tableBody)
	return timeTable.join('')
}
const getDate = () => {
	const date = new Date();
	const month = (date.getMonth() + 1);
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	return [month, day, hours, minutes]
}
const timeData = (jsonData) => {
	const timeTable = document.getElementById('time-table')
	const dateFrame = timeTable.querySelector('h3')
	let previousDate;
	const updateDate = () => {
		const date = getDate()
		return `現在時刻: ${date[0]}月${date[1]}日${date[2]}時${date[3]}分`;
	};
	const IntervalCalcDate = () => {
		const nowDate = updateDate()
		if (previousDate != nowDate) {
			dateFrame.innerHTML = nowDate
			sTable(jsonData)
			previousDate = nowDate
		}
	}
	sTable(jsonData)
	setInterval(IntervalCalcDate, 1000);
}
const sTable = (json) => {
	const date = getDate()
	const filterData = (category, date, json) => {
		return json[category].filter((stage) => {
			const startTime = stage.time.hour * 60 + stage.time.minutes - stage.duration;
			const endTime = startTime + stage.timeRequired + stage.duration;
			const nowTime = date[2] * 60 + date[3];
			return (
				stage.date.month === date[0] &&
				stage.date.day === date[1] &&
				startTime <= nowTime &&
				nowTime < endTime
			);
		});
	};
	const filterDatas = [
		["stage", filterData("stage", date, json)[0]],
		["ONED", filterData("ONED", date, json)[0]],
		["DJ", filterData("DJ", date, json)[0]],
		["smashBros", filterData("smashBros", date, json)[0]]
	]
	const tableData = ['<tbody><tr><th>project</th><td>出演者</td><td>名前</td><th>時間</th></tr>']
	filterDatas.map((item) => {
		const json = item[1]
		if (json != undefined) {
			tableData.push(sTableFlame(item[0], json.performer, json.title, [json.time.hour, json.time.minutes, json.timeRequired]))
		} else {
			tableData.push(`<tr><th><a href="${linkId(item[0])}">${formatIdName(item[0])}</a></th><td>演目はありません</td><td></td><td></td></tr>`)
			// tableData.push(`<tr><th>${formatIdName(item[0])}</th><td>当日ではないため動きません</td><td></td><td></td></tr>`)
		}
	})
	tableData.push('</tbody>')
	const tableDocData = document.getElementById('mainTable')
	tableDocData.innerHTML = tableData.join(' ')
}
