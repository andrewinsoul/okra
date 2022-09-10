export const groupTableDataByRow = (
  rawData: Array<string>,
): Array<Array<string>> => {
  let dataArray: Array<string> = [];
  const containerArray: Array<Array<string>> = [];
  let index = 0;
  rawData.forEach((item) => {
    if (index === 6) {
      containerArray.push(dataArray);
      dataArray = [];
      dataArray.push(item);
      index = 0;
    } else {
      dataArray.push(item);
    }
    index = index + 1;
  });
  containerArray.push(dataArray);
  return containerArray;
};
