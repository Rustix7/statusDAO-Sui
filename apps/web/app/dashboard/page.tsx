"use client"
import { useEffect, useState } from 'react';
import {
  GlobeIcon, XCircleIcon, CheckCircleIcon,
  AlertCircleIcon, PhoneIcon, MailIcon, PlusIcon,
  Trash2Icon, RefreshCwIcon, BarChart2Icon, Zap,
  ClockIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

const StatusHistorySection = ({ site }: { site: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get last 10 status entries for the compact view
  const recentStatus = site.status.slice(-10).reverse();

  return (
    <div className="mt-4 border-t border-slate-700 pt-3">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center text-gray-400">
          <ClockIcon size={16} className="mr-2" />
          <span className="text-sm font-medium">Status History</span>
        </div>

        {/* Compact history bars always visible */}
        <div className="flex items-center">
          <div className="flex items-center space-x-1 mr-3">
            {recentStatus.map((status: any, idx: any) => (
              <div
                key={idx}
                className={`h-4 w-2 rounded-sm ${status.status === 'Good' ? 'bg-teal-400' : 'bg-red-400'
                  }`}
              />
            ))}
          </div>

          {isExpanded ?
            <ChevronUpIcon size={18} className="text-gray-400" /> :
            <ChevronDownIcon size={18} className="text-gray-400" />
          }
        </div>
      </div>

      {/* Expanded detailed history */}
      {isExpanded && (
        <div className="mt-3 bg-slate-800/50 rounded-lg p-3 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {site.status.slice().reverse().map((status: any, idx: any) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${status.status === 'Good' ? 'bg-teal-400' : 'bg-red-400'
                      }`}
                  />
                  <span className={status.status === 'Good' ? 'text-teal-400' : 'text-red-400'}>
                    {status.status === 'Good' ? 'Online' : 'Offline'}
                  </span>
                </div>

                <div className="flex items-center">
                  {status.status === 'Good' && (
                    <span className="text-gray-400 mr-3">{status.latency}ms</span>
                  )}
                  <span className="text-gray-500">
                    {new Date(status.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const UserDashboard = () => {
  //   const [isScrolled,] = useState(false);
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | undefined>();

  const [websites, setWebsites] = useState<any>([]);

  const [emailInputModal, setEmailInputModal] = useState(false);
  const [phoneInputModal, setPhoneInputModal] = useState(false);
  const [contactInput, setContactInput] = useState('');
  const [currentSite, setCurrentSite] = useState(null);

  // Toggle notification preferences
  const toggleNotification = async (site: any, type: string) => {
    // For turning off notifications
    if ((site.notifyByEmail === true && type === "Email") || (site.notifyByPhone === true && type === "Phone")) {
      let url = "http://localhost:3001/api/v1/website-remove-notifications";
      let data;

      if (type === "Email") {
        data = { type: "removeEmail", websiteId: site.id };
      } else {
        data = { type: "removePhone", websiteId: site.id };
      }

      try {
        const freshToken = await getToken();
        const result = await axios.post(url,
          {...data},
          {
            headers: {
              Authorization: `Bearer ${freshToken}`,
              "Content-Type": "application/json"
            }
          }
        );
        console.log(result.data);
      } catch (e) {
        console.log("Error while updating notification settings:", e);
      } finally {
        getWebsites();
      }
    }
    // For turning on notifications - show input modal
    else {
      setCurrentSite(site);
      if (type === "Email") {
        setEmailInputModal(true);
      } else {
        setPhoneInputModal(true);
      }
    }
  };

  // Submit contact info for notifications
  const submitContactInfo = async (type: string) => {
    if (!contactInput.trim() || !currentSite) return;

    console.log(currentSite);

    let url = "http://localhost:3001/api/v1/website-notifications";
    let data;

    if (type === "Email") {
      data = {
        notifyEmail: contactInput,
        websiteId: currentSite
      };
      setEmailInputModal(false);
    } else {
      data = {
        notifyPhone: contactInput,
        websiteId: currentSite
      };
      setPhoneInputModal(false);
    }

    try {
      const freshToken = await getToken();
      const result = await axios.post(url,
        {...data},
        {
          headers: {
            Authorization: `Bearer ${freshToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      console.log(result.data);
      setContactInput('');
    } catch (e) {
      console.log("Error while adding notification:", e);
    } finally {
      getWebsites();
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const authToken = await getToken();
      setToken(authToken!);
    };
    fetchToken();
  }, [getToken]);

  const getWebsites = async () => {
    if (!token) return;
    try {
      const freshToken = await getToken();
      const res = await axios.get(`http://localhost:3001/api/v1/website-status`, {
        headers: {
          Authorization: `Bearer ${freshToken}`,
        },
      });
      setWebsites(res.data);
    } catch (error) {
      console.error("Error fetching websites:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getWebsites();
      const interval = setInterval(getWebsites, 1000 * 60);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleAddSite = async (e: any) => {
    e.preventDefault();
    if (!newSiteUrl.trim() || !token) return;

    try {
      const freshToken = await getToken();
      const result = await axios.post(
        `http://localhost:3001/api/v1/create-website`,
        { url: newSiteUrl },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${freshToken}`,
          },
        }
      );

      console.log("Website added:", result.data);
      setNewSiteUrl("");
      getWebsites();
    } catch (error) {
      console.error("Error adding website:", error);
    }
  };
  // Toggle notification preferences
  // const toggleNotification = async(site : any, type : any) => {



  //   let url;
  //   let data;

  //   if((site.notifyByEmail === true && type === "Email") || (site.notifyPhone === true && type === "Phone")){
  //     url = "https://localhost:3001/api/v1/website-remove-notifications";

  //     if(type === "Email"){
  //       data = {type : "removeEmail"}
  //     }
  //     else {
  //       data = {type : "removePhone"}
  //     }
  //   }

  //   else((site.notifyByEmail === false && type === "Email") || (site.notifyPhone === false && type === "Phone")){
  //     url = "https://localhost:3001/api/v1/website-notifications";

  //     if(type === "Email"){
  //       data = {notifyEmail : "Ayushsingla1122@gmail.com"}
  //     }
  //     else {
  //       data = {notifyPhone : "9416855609"}
  //     }

  //   }

  //   try {
  //     const freshToken = await getToken();
  //     const result = await axios.post(url,
  //       {...data},
  //       {headers : {
  //         Authorization : `Bearer ${freshToken}`,
  //         "Content-Type" : "application/json"
  //       }}
  //     )
  //     console.log(result.data);
  //   } catch(e){
  //     console.log("Error while fetching", e)
  //   }

  //   finally{
  //     getWebsites();
  //   }
  // };

  const removeSite = async (id: string) => {
    try {

      const freshToken = await getToken();
      const result = await axios.delete(`http://localhost:3001/api/v1/delete-website`, {
        params: {
          websiteId: id
        },
        headers: {
          Authorization: `Bearer ${freshToken}`
        }
      })
      console.log(result.data);
      getWebsites();
    }
    catch (e) {
      console.log("Error while fetching", e)
    }
  };

  // Get status icon and color
  const getStatusInfo = (status: any) => {
    switch (status) {
      case 'Good':
        return { icon: <CheckCircleIcon size={18} />, color: 'text-teal-400', bgColor: 'bg-teal-400/20', barColor: 'bg-teal-400' };
      case 'Bad':
        return { icon: <XCircleIcon size={18} />, color: 'text-red-400', bgColor: 'bg-red-400/20', barColor: 'bg-red-400' };
    }
  };

  let totalChecks = websites.reduce((sum: number, s: any) => sum + s.status.length, 0);

  let overallUptime = 0;
  let avgRes = 0;
  for (let i = 0; i < websites.length; i++) {
    const statusArr = websites[i].status;

    if (!websites[i].disable) {

      for (let j = 0; j < statusArr.length; j++) {
        if (statusArr[j].status === 'Good') {
          overallUptime++;
          avgRes += statusArr[j].latency;
        }
      }
    }
  }

  overallUptime = overallUptime / (totalChecks) * 100;
  avgRes = avgRes / totalChecks;


  return (<div className="bg-slate-950 text-gray-100 min-h-screen font-sans">
    <Navbar />

    <div className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Websites</h1>
            <p className="text-gray-400">Monitor and manage your website status</p>
          </div>
          <button
            onClick={() => setShowAddSiteModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-6 py-3 rounded-full transition font-medium flex items-center justify-center mt-4 md:mt-0"
          >
            <PlusIcon size={18} className="mr-2" />
            Add New Website
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: 'Online Sites',
              count: websites.filter((s: any) => s.status[(s.status.length) - 1]?.status === 'Good').length,
              icon: <CheckCircleIcon size={24} />,
              color: 'text-teal-400',
              bgColor: 'bg-teal-400/10'
            },
            {
              title: 'Offline Sites',
              count: websites.filter((s: any) => s.status[(s.status.length) - 1]?.status === 'Bad').length,
              icon: <XCircleIcon size={24} />,
              color: 'text-red-400',
              bgColor: 'bg-red-400/10'
            },
            {
              title: 'Pending Sites',
              count: websites.filter((s: any) => s.disable === true).length,
              icon: <AlertCircleIcon size={24} />,
              color: 'text-yellow-400',
              bgColor: 'bg-yellow-400/10'
            }
          ].map((card, index) => (
            <div key={index} className="border border-slate-800 bg-slate-900/80 rounded-2xl p-6 backdrop-blur-sm backdrop-filter">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-xl mr-4 ${card.bgColor}`}>
                  <span className={card.color}>{card.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{card.title}</h3>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Websites List */}
        <div className="border border-slate-800 bg-slate-900/80 rounded-2xl p-6 backdrop-blur-sm backdrop-filter mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Monitored Websites</h2>
            <button className="text-cyan-400 flex items-center hover:text-cyan-300 transition">
              <RefreshCwIcon size={16} className="mr-2" />
              Refresh All
            </button>
          </div>

          <div className="space-y-4">
            {websites.map((site: any) => {
              const statusInfo = getStatusInfo(site.status[(site.status.length) - 1]?.status);
              console.log(statusInfo)

              return (
                <div key={site.id} className="border border-slate-800 bg-slate-800/30 rounded-xl p-5 backdrop-blur-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    {/* Website URL and Status */}
                    <div className="flex items-center mb-4 lg:mb-0">
                      <div className={`p-2 rounded-lg mr-4 ${statusInfo?.bgColor ? (statusInfo.bgColor) : ("bg-red-40")}`}>
                        <span className={statusInfo?.color}>{statusInfo?.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <GlobeIcon size={16} className="text-gray-400 mr-2" />
                          <h3 className="font-medium">{site.url}</h3>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-400">
                          <span>Last checked: {new Date(site.status[(site.status.length) - 1]?.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Bar */}
                    <div className="lg:w-1/3 mb-4 lg:mb-0">
                      <div className="flex items-center mb-1">
                        <span className={`text-sm ${statusInfo?.color}`}>
                          {site.status[(site.status.length) - 1]?.status === 'Good' ? 'Online' : site.status[(site.status.length) - 1]?.status === 'Bad' ? 'Offline' : 'Disabled'}
                        </span>
                        {site.status[(site.status.length) - 1]?.status === 'Good' && (
                          <span className="text-sm text-gray-400 ml-2">
                            Response: {site.status[(site.status.length) - 1]?.latency}ms
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${statusInfo?.barColor}`}
                          style={{
                            width: site.status[(site.status.length) - 1]?.status === 'Good' ? '100%' :
                              site.status[(site.status.length) - 1]?.status === 'Bad' ? '100%' : '30%'
                          }}>
                        </div>
                      </div>
                      <StatusHistorySection site={site} />
                    </div>

                    {/* Notification Preferences */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleNotification(site.id, 'Email')}
                        className={`p-2 rounded-lg ${site?.notifyByEmail ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700 text-gray-400'}`}
                        title="Email notifications"
                      >
                        <MailIcon size={18} />
                      </button>
                      <button
                        onClick={() => toggleNotification(site, 'Phone')}
                        className={`p-2 rounded-lg ${site?.notifyByPhone ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-700 text-gray-400'}`}
                        title="Phone call notifications"
                      >
                        <PhoneIcon size={18} />
                      </button>
                      <button
                        onClick={() => removeSite(site.id)}
                        className="p-2 rounded-lg bg-slate-700 text-gray-400 hover:text-red-400 transition"
                        title="Remove website"
                      >
                        <Trash2Icon size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="border border-slate-800 bg-slate-900/80 rounded-2xl p-6 backdrop-blur-sm backdrop-filter">
          <div className="flex items-center mb-6">
            <BarChart2Icon size={20} className="text-cyan-400 mr-2" />
            <h2 className="text-xl font-semibold">Monitoring Statistics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Checks', value: `${totalChecks}` },
              { label: 'Avg. Response Time', value: `${parseInt(String(avgRes))}ms` },
              { label: 'Overall Uptime', value: `${overallUptime.toFixed(2)}%` }
            ].map((stat, index) => (
              <div key={index} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/20">
                <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                {/* <div className="text-teal-400 text-sm">{stat.trend} this week</div> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {emailInputModal && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
        <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-800">
          <h3 className="text-xl font-bold mb-4">Add Email Notification</h3>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Your Email Address</label>
            <input
              type="email"
              value={contactInput}
              onChange={(e) => setContactInput(e.target.value)}
              placeholder="e.g. your@email.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="mb-6">
            <p className="text-gray-400 text-sm">We'll send you notifications when this website goes down.</p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setEmailInputModal(false);
                setContactInput('');
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => submitContactInfo("Email")}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg transition"
            >
              Save Email
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Phone Input Modal */}
    {phoneInputModal && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
        <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-800">
          <h3 className="text-xl font-bold mb-4">Add Phone Notification</h3>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Your Phone Number</label>
            <input
              type="tel"
              value={contactInput}
              onChange={(e) => setContactInput(e.target.value)}
              placeholder="e.g. 1234567890"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="mb-6">
            <p className="text-gray-400 text-sm">We'll call you when this website goes down.</p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setPhoneInputModal(false);
                setContactInput('');
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => submitContactInfo("Phone")}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg transition"
            >
              Save Phone
            </button>
          </div>
        </div>
      </div>
    )}



    {/* Add Website Modal */}
    {showAddSiteModal && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
        <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-800">
          <h3 className="text-xl font-bold mb-4">Add New Website</h3>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Website URL</label>
            <input
              type="text"
              value={newSiteUrl}
              onChange={(e) => setNewSiteUrl(e.target.value)}
              placeholder="e.g. example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="mb-6">
            <p className="text-gray-400 text-sm">Notification preferences can be configured after adding the website.</p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAddSiteModal(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSite}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg transition"
            >
              Add Website
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default UserDashboard;