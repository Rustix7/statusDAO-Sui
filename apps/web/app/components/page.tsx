"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const WebsiteDashboard = () => {
  const [websites, setWebsites] = useState([]);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { getToken } = useAuth();
  const [token, setToken] = useState("");

  // Fetch token on component mount
  useEffect(() => {
    const fetchToken = async () => {
      const authToken = await getToken();
      setToken(authToken!);
    };
    fetchToken();
  }, [getToken]);

  // Fetch websites
  const getWebsites = async () => {
    if (!token) return; // Wait until token is available
    try {
      const res = await axios.get(`http://localhost:3001/api/v1/website-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWebsites(res.data);
    } catch (error) {
      console.error("Error fetching websites:", error);
    }
  };

  // Fetch websites on mount and update every 60s
  useEffect(() => {
    if (token) {
      getWebsites();
      const interval = setInterval(getWebsites, 1000 * 60);
      return () => clearInterval(interval);
    }
  }, [token]);

  // Add new website
  const handleAddWebsite = async (e: any) => {
    e.preventDefault();
    if (!newWebsiteUrl.trim() || !token) return;

    try {
      const result = await axios.post(
        `http://localhost:3001/api/v1/create-website`,
        { url: newWebsiteUrl },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Website added:", result.data);
      setNewWebsiteUrl(""); // Clear input
      getWebsites(); // Refresh list
    } catch (error) {
      console.error("Error adding website:", error);
    }
  };

  // Status color mapping
  const statusColors: { [key: string]: string } = {
    Good: "bg-green-500",
    Bad: "bg-red-500",
    disabled: "bg-yellow-500",
  };

  const statusLabels: { [key: string]: string } = {
    Good: "Online",
    Bad: "Offline",
    disabled: "Not Monitored",
  };

  // Remove website
  const handleRemoveWebsite = async(id : string) => {
    const result = await axios.delete(`${process.env.DB_URL}/delete-website`,{params : {
      websiteId : id
    }})

    if(result.status === 200) console.log("Successfully removed website");

    else {
      console.log(result.data.msg);
    }
    console.log(result.data);
  };

  // Start monitoring a website
  // const handleStartMonitoring = (id) => {
  //   setWebsites(websites.map(website => {
  //     if (website.id === id) {
  //       return { 
  //         ...website, 
  //         status: Math.random() > 0.2 ? 'up' : 'down',
  //         responseTime: Math.random() * 2,
  //         lastChecked: new Date().toISOString()
  //       };
  //     }
  //     return website;
  //   }));
  // };

  console.log(websites.map(w => console.log((w.status[w.status.length-1]).timestamp)));

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>Website Management - StatusGuard</title>
        <meta name="description" content="Manage your monitored websites" />
      </Head>

      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 111.412-.088z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11zm8.921 2.012a1 1 0 01.831 1.145 19.86 19.86 0 01-.545 2.436 1 1 0 11-1.92-.558c.207-.713.371-1.445.49-2.192a1 1 0 011.144-.83z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl font-bold">StatusGuard</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white font-medium">Dashboard</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Settings</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Reports</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Support</a>
            <a href="#" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md font-medium transition-colors">
              Account
            </a>
          </nav>
          <button className="md:hidden text-gray-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-6">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold">Website Management</h2>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md font-medium transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Website
          </button>
        </div>

        {/* Add Website Form */}
        {showAddForm && (
          <div className="bg-gray-800 p-6 mb-8 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Add New Website</h3>
            <form onSubmit={handleAddWebsite} className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-400 mb-1">Website URL</label>
                <input
                  type="text"
                  id="websiteUrl"
                  placeholder="example.com"
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Status Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">Monitored Websites</h3>
              <div className="bg-indigo-600/20 text-indigo-400 px-2 py-1 rounded-md text-sm font-medium">
                {websites.filter(w => !w.disabled).length}
              </div>
            </div>
            <div className="text-3xl font-bold">
              {websites.length}
              <span className="text-sm font-normal text-gray-400 ml-2">Total</span>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">Websites Online</h3>
              <div className="bg-green-600/20 text-green-400 px-2 py-1 rounded-md text-sm font-medium">
                {Math.round(websites.filter(w => w.status[((w.status).length)-1].status === 'Good').length / websites.filter(w => w => w.status[((w.status).length)-1].status === 'Bad').length * 100 || 0)}%
              </div>
            </div>
            <div className="text-3xl font-bold">
              {websites.filter(w => w.status[((w.status).length)-1].status === 'Good').length}
              <span className="text-sm font-normal text-gray-400 ml-2">Websites</span>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">Websites Offline</h3>
              <div className="bg-red-600/20 text-red-400 px-2 py-1 rounded-md text-sm font-medium">
                {Math.round(websites.filter(w => w.status[((w.status).length)-1].status === 'Bad').length / websites.filter(w => w => w.status[((w.status).length)-1].status !== 'Bad').length * 100 || 0)}%
              </div>
            </div>
            <div className="text-3xl font-bold">
              {websites.filter(w => w.status[((w.status).length)-1].status === 'Bad').length}
              <span className="text-sm font-normal text-gray-400 ml-2">Websites</span>
            </div>
          </div>
        </div>

        {/* Website List and Status */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Website List */}
          <div className="md:col-span-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-gray-700 flex justify-between items-center">
              <h3 className="font-bold">Your Websites</h3>
              <span className="text-sm text-gray-400">{websites.length} Total</span>
            </div>
            <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
              {websites.map(website => (
                <div 
                  key={website.id} 
                  className={`p-4 flex items-center cursor-pointer hover:bg-gray-700 transition-colors ${selectedWebsite?.id === website.id ? 'bg-gray-700' : ''}`}
                  onClick={() => setSelectedWebsite(website)}
                >
                  <div className="mr-3">
                    <div className={`w-3 h-3 rounded-full ${statusColors[(website.status[website.status.length-1].status)]}`}></div>
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{website.url}</div>
                    <div className="text-xs text-gray-400">
                      {(!website.disabled) 
                        ? `Last checked: ${new Date((website.status[website.status.length-1]).timestamp).toLocaleTimeString()}`
                        : 'Not being monitored'}
                    </div>
                  </div>
                  <div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveWebsite(website.id);
                      }}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {websites.length === 0 && (
                <div className="p-6 text-center text-gray-400">
                  No websites added yet. Click "Add Website" to get started.
                </div>
              )}
            </div>
          </div>

          {/* Website Details and Status Visualization */}
          <div className="md:col-span-2">
            {selectedWebsite ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 h-full">
                <div className="p-4 border-b border-gray-700 bg-gray-700 flex justify-between items-center">
                  <h3 className="font-bold flex items-center">
                    <span className="mr-2">{selectedWebsite.url}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedWebsite.status[selectedWebsite.status.length - 1].status === 'Good' ? 'bg-green-200 text-green-800' : 
                      selectedWebsite.status[selectedWebsite.status.length - 1].status === 'Bad' ? 'bg-red-200 text-red-800' : 
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {statusLabels[selectedWebsite.status[selectedWebsite.status.length - 1].status]}
                    </span>
                  </h3>
                  <div>
                    {!selectedWebsite.disabled ? (
                      <button 
                        onClick={() => handleStartMonitoring(selectedWebsite.id)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Start Monitoring
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStopMonitoring(selectedWebsite.id)}
                        className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Stop Monitoring
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {/* Status History Visualization */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-4">Status History</h4>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      {!selectedWebsite.disabled ? (
                        <div>
                          <div className="grid grid-cols-24 gap-1 mb-2">
                            {[...Array(24)].map((_, i) => (
                              <div key={i} className="h-8 rounded-sm bg-opacity-80" style={{
                                backgroundColor: i < 18 ? 
                                  (Math.random() > 0.1 ? '#10B981' : '#EF4444') : 
                                  (selectedWebsite.status[selectedWebsite.status.length - 1].status === 'Good' ? '#10B981' : '#EF4444')
                              }}></div>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>24 hours ago</span>
                            <span>12 hours ago</span>
                            <span>Now</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 py-6">
                          No monitoring data available. Start monitoring to collect data.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Response Time Visualization */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">Response Time</h4>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      {!selectedWebsite.disabled ? (
                        <div>
                          <div className="mb-4">
                            <span className="text-2xl font-bold">{selectedWebsite.status[selectedWebsite.status.length - 1].latency.toFixed(2)}s</span>
                            <span className="text-sm text-gray-400 ml-2">Current Response Time</span>
                          </div>
                          <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-green-400"
                              style={{ width: `${Math.min(selectedWebsite.status[selectedWebsite.status.length - 1].latency / 3 * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>0s</span>
                            <span>1s</span>
                            <span>2s</span>
                            <span>3s+</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 py-6">
                          No response time data available. Start monitoring to collect data.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg border border-gray-700 h-full flex items-center justify-center p-6">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-9a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xl font-medium mb-2">Select a Website</p>
                  <p>Choose a website from the list to view detailed status information</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WebsiteDashboard;