import { Users, Briefcase, RefreshCcw, Building2 } from 'lucide-react';



export const StatusPie = (data) => {
  if (data) {
    const newData = data.map((item) => ({ name: item?.status, value: item?.count }));
    return newData || [];
  } else {
    return [];
  }
};

export const CardsDataa = (data) => {
    return [
      {
        title: 'Leads',
        value: data?.totalLeads || 0,
        icon: <Users className="h-5 w-5 text-indigo-600" />,
        bg: 'from-indigo-50 to-white',
        iconBg: 'bg-indigo-100',
        path: "/important",
      },
      {
        title: 'Deals',
        value: data?.totalDeals || 0,
        icon: <Briefcase className="h-5 w-5 text-green-600" />,
        bg: 'from-green-50 to-white',
        iconBg: 'bg-green-100',
        path: "/important",
      },
      {
        title: 'Renewals',
        value: data?.totalRenuals || 0,
        icon: <RefreshCcw className="h-5 w-5 text-yellow-600" />,
        bg: 'from-yellow-50 to-white',
        iconBg: 'bg-yellow-100',
        path: "/renuals",
      },
      {
        title: 'Customers',
        value: data?.totalCustomers || 0,
        icon: <Building2 className="h-5 w-5 text-pink-600" />,
        bg: 'from-pink-50 to-white',
        iconBg: 'bg-pink-100',
        path: "/important",
      },
    ];
}
