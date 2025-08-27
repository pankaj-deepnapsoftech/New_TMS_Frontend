


export const StatusPie = (data) => {
   if(data){
      const newData =  data.map((item) => ({ name: item.status, value: item.count }));
      return newData || [];
   }
   else {
      return []
   }
}



















