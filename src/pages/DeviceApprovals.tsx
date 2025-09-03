import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeviceApprovals,
  updateDeviceApproval,
} from "../store/slices/deviceApprovals";
import { CheckCircle, XCircle, RotateCcw, Smartphone, User2, KeyRound } from "lucide-react";

export default function DeviceApprovals() {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state: any) => state.deviceApprovals);

  useEffect(() => {
    dispatch(fetchDeviceApprovals() as any);
  }, [dispatch]);

  const handleAction = (id: string, status: "approved" | "rejected") => {
    dispatch(updateDeviceApproval({ id, status }) as any);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Device Approval Requests</h1>
        <button
          onClick={() => dispatch(fetchDeviceApprovals() as any)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
        >
          <RotateCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-x-auto dark:bg-gray-900">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Device</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Platform</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">IP</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Device ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">First Device</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Active</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Requested At</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-900 dark:divide-gray-800">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No device requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((req: any, idx: number) => {
                    // Support both userId and user for user object
                    const user = req.userId || req.user;
                    const deviceInfo = req.deviceInfo || {};
                    return (
                      <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">{idx + 1}</td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User2 className="w-5 h-5 text-blue-500" />
                            <span className="font-medium text-gray-900 dark:text-white">{user?.fullName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-700 dark:text-gray-300">{user?.email}</td>
                        <td className="px-4 py-4 text-xs text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-gray-400" />
                            {deviceInfo.deviceName || <span className="italic text-gray-400">Unknown</span>}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-700 dark:text-gray-300">{deviceInfo.platform || "-"}</td>
                        <td className="px-4 py-4 text-xs text-gray-700 dark:text-gray-300">{deviceInfo.ipAddress || "-"}</td>
                        <td className="px-4 py-4 text-xs text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-gray-400" />
                            {req.deviceId || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-700 dark:text-gray-300">
                          {req.isFirstDevice ? (
                            <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs">Yes</span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">No</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-700 dark:text-gray-300">
                          {req.isActive ? (
                            <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs">Active</span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">Inactive</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {req.status === "approved" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-4 h-4 mr-1" /> Approved
                            </span>
                          ) : req.status === "rejected" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="w-4 h-4 mr-1" /> Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400">{new Date(req.requestedAt).toLocaleString()}</td>
                        <td className="px-4 py-4 text-right text-sm font-medium">
                          {req.status === "pending" ? (
                            <>
                              <button
                                className="px-3 py-1 rounded bg-green-500 text-white mr-2 hover:bg-green-600 transition"
                                onClick={() => handleAction(req._id, "approved")}
                              >
                                Approve
                              </button>
                              <button
                                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                                onClick={() => handleAction(req._id, "rejected")}
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
