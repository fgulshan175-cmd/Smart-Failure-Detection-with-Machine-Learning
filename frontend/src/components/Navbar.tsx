import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { Bell, Wifi, WifiOff, AlertTriangle } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const [dbConnected, setDbConnected] = useState(true);
  const [alertCount, setAlertCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Determine page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Telemetry Dashboard';
      case '/machines':
        return 'Machine Asset Management';
      case '/add-machine':
        return 'Register Machine Asset';
      case '/predict':
        return 'ML Failure Inference';
      case '/history':
        return 'Prediction Logs';
      case '/reports':
        return 'Download Center';
      case '/settings':
        return 'System Settings';
      default:
        return 'Predictive Maintenance';
    }
  };

  // Fetch dashboard status and alerts
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/dashboard');

        setDbConnected(true);

        if (res.data && res.data.summary) {
          const machinesAtRisk =
            res.data.summary.machines_at_risk || 0;

          setAlertCount(machinesAtRisk);
        }
      } catch (error) {
        console.error('Database/API connection check failed:', error);
        setDbConnected(false);
      }
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 30000);

    return () => clearInterval(interval);
  }, [location.pathname]);

  // Notification bell click
  const handleNotificationClick = () => {
    setShowNotifications((previous) => !previous);
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-industrial-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">

      {/* Page Title */}
      <div>
        <h2 className="text-lg font-semibold text-slate-100">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        {/* System Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/40 border border-slate-800/80">

          {dbConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />

              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">
                Sys Online
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-400 animate-pulse" />

              <span className="text-[10px] font-semibold text-red-400 uppercase tracking-widest">
                Sys Offline
              </span>
            </>
          )}

        </div>

        {/* Notifications */}
        <div className="relative">

          {/* Bell Button */}
          <button
            type="button"
            onClick={handleNotificationClick}
            className="relative p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 transition-colors cursor-pointer"
            aria-label="Notifications"
          >

            <Bell className="w-5 h-5 text-slate-300" />

            {/* Notification Badge */}
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-amber-500 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-950 border border-industrial-900">
                {alertCount}
              </span>
            )}

          </button>

          {/* Notification Popup */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">

              {/* Popup Header */}
              <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/70">
                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Notifications
                    </h3>

                    <p className="text-[10px] text-slate-400 mt-1">
                      System alerts and machine warnings
                    </p>
                  </div>

                  <Bell className="w-4 h-4 text-amber-400" />

                </div>
              </div>

              {/* Notification Content */}
              <div className="p-3">

                {alertCount > 0 ? (
                  <div className="space-y-3">

                    {/* Alert */}
                    <div className="flex gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">

                      <div className="flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-amber-300">
                          Machine Failure Risk Detected
                        </p>

                        <p className="text-xs text-slate-300 mt-1">
                          {alertCount}{' '}
                          {alertCount === 1 ? 'machine is' : 'machines are'}{' '}
                          currently at risk of failure.
                        </p>

                        <p className="text-[10px] text-slate-500 mt-2">
                          Check the Machine Asset Management page for details.
                        </p>
                      </div>

                    </div>

                  </div>
                ) : (
                  /* No Notifications */
                  <div className="py-8 text-center">

                    <Bell className="w-8 h-8 text-slate-600 mx-auto mb-3" />

                    <p className="text-sm text-slate-400">
                      No new notifications
                    </p>

                    <p className="text-[10px] text-slate-600 mt-1">
                      Everything looks normal.
                    </p>

                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default Navbar;