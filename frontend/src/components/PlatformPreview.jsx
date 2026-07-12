import { LayoutDashboard, Truck, Users, Map, Wrench, Fuel, BarChart3, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export default function PlatformPreview() {
  return (
    <div className="w-full bg-brand-bg relative z-30 pt-20 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-6 tracking-tight">
            Everything in one place
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            A complete operating system for your fleet. Role-based access, real-time status tracking, and automated business rules.
          </p>
        </div>

        {/* Browser/App Window Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-white/10 bg-[#0f0f13] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Window Header */}
          <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-[#141416]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto px-4 py-1 rounded-md bg-white/5 border border-white/5 flex items-center gap-2">
              <span className="text-xs text-gray-500">transitops.app/dashboard</span>
            </div>
          </div>

          {/* App Body */}
          <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* Sidebar */}
            <div className="hidden md:flex w-64 border-r border-white/5 bg-[#141416] p-4 flex-col gap-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">Menu</div>
              
              <div className="flex items-center gap-3 px-3 py-2.5 bg-brand-accent/10 text-brand-accent rounded-lg">
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Truck className="w-4 h-4" />
                <span className="text-sm">Fleet</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Users className="w-4 h-4" />
                <span className="text-sm">Drivers</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Map className="w-4 h-4" />
                <span className="text-sm">Trips</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Wrench className="w-4 h-4" />
                <span className="text-sm">Maintenance</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Fuel className="w-4 h-4" />
                <span className="text-sm">Fuel & Expenses</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Analytics</span>
              </div>
              <div className="mt-auto flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 md:p-8 bg-[#0a0a0a] overflow-x-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h3 className="text-2xl font-display font-medium text-white">Dashboard Overview</h3>
                  <p className="text-sm text-gray-500 mt-1">Logged in as Fleet Manager</p>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-gray-300">Live Sync Active</span>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#141416] p-5 rounded-2xl border border-white/5 flex flex-col">
                  <div className="text-sm text-gray-400 mb-2">Fleet Utilization %</div>
                  <div className="text-3xl font-display font-medium text-white tracking-tight">82%</div>
                  <div className="text-xs text-green-400 mt-auto pt-4 flex items-center gap-1">
                    ↑ 18 / 22 Vehicles On Trip
                  </div>
                </div>
                <div className="bg-[#141416] p-5 rounded-2xl border border-white/5 flex flex-col">
                  <div className="text-sm text-gray-400 mb-2">Fuel Efficiency</div>
                  <div className="text-3xl font-display font-medium text-white tracking-tight">6.4 <span className="text-lg text-gray-500">km/L</span></div>
                  <div className="text-xs text-green-400 mt-auto pt-4 flex items-center gap-1">
                    ↑ 0.2 from last week
                  </div>
                </div>
                <div className="bg-[#141416] p-5 rounded-2xl border border-white/5 flex flex-col">
                  <div className="text-sm text-gray-400 mb-2">Operational Cost</div>
                  <div className="text-3xl font-display font-medium text-white tracking-tight">$42.5k</div>
                  <div className="text-xs text-gray-500 mt-auto pt-4 flex items-center gap-1">
                    MTD (Fuel + Maint + Exp)
                  </div>
                </div>
                <div className="bg-[#141416] p-5 rounded-2xl border border-white/5 flex flex-col">
                  <div className="text-sm text-gray-400 mb-2">Vehicle ROI</div>
                  <div className="text-3xl font-display font-medium text-white tracking-tight">14.2%</div>
                  <div className="text-xs text-green-400 mt-auto pt-4 flex items-center gap-1">
                    ↑ Avg trailing 30 days
                  </div>
                </div>
              </div>

              {/* Live Status Board */}
              <div className="bg-[#141416] rounded-2xl border border-white/5 overflow-hidden">
                <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <h4 className="text-sm font-medium text-white">Live Asset Status</h4>
                  <button className="text-xs text-brand-accent hover:text-orange-400 transition-colors">View All Vehicles →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-transparent text-gray-500">
                      <tr>
                        <th className="px-6 py-4 font-medium">Asset</th>
                        <th className="px-6 py-4 font-medium">Driver</th>
                        <th className="px-6 py-4 font-medium">Route / Location</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-medium text-white">TRK-1042</td>
                        <td className="px-6 py-4">Alex Rodriguez</td>
                        <td className="px-6 py-4 text-gray-500">Dallas → Austin</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5"></span>
                            On Trip
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-medium text-white">TRK-1088</td>
                        <td className="px-6 py-4">Marcus Chen</td>
                        <td className="px-6 py-4 text-gray-500">Terminal A</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5"></span>
                            Available
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-medium text-white">TRK-0955</td>
                        <td className="px-6 py-4 text-gray-500">Unassigned</td>
                        <td className="px-6 py-4 text-gray-500">Maintenance Bay 2</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-1.5"></span>
                            In Shop
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-medium text-white">TRK-0812</td>
                        <td className="px-6 py-4">Sarah Jenkins</td>
                        <td className="px-6 py-4 text-gray-500">-</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5"></span>
                            Suspended
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
