


export const StatusPie = (data) => {
   const newData =  data.map((item) => ({ name: item.status, value: item.count }));
   return newData
}



















