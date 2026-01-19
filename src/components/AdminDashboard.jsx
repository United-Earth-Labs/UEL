import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Eye, LogOut } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import ApplicationActionModal from './ApplicationActionModal';

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [error, setError] = useState(null);
  const [actionApp, setActionApp] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const applicationsRef = collection(db, 'applications');
    const q = query(applicationsRef, orderBy('submittedAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const apps = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplications(apps);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching applications:', error);
        setError(error.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteDoc(doc(db, 'applications', id));
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Error deleting application');
      }
    }
  };

  const downloadCSV = () => {
    const headers = ['Name', 'Email', 'Age', 'Contact', 'Background', 'Experience', 'Skills', 'Reason to Join', 'Ideas', 'Time Dedication', 'Availability', 'Status', 'Submitted'];
    const rows = applications.map(app => [
      app.name,
      app.email,
      app.age,
      app.contactNumber,
      app.background || 'N/A',
      app.experience || 'N/A',
      app.skills || 'N/A',
      app.reasonToJoin,
      app.innovativeIdeas,
      app.timeDedication,
      app.availability || 'N/A',
      app.status || 'pending',
      app.submittedAt ? new Date(app.submittedAt.seconds * 1000).toLocaleString() : 'N/A',
    ]);

    let csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' ? true : app.status === filter
  );

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-2xl text-cyan-400">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg"
          >
            <p className="text-red-300 mb-2">⚠️ Error: {error}</p>
            <p className="text-red-300 text-sm mb-3">
              Make sure Firestore security rules are updated. Check FIRESTORE_SETUP.md for instructions.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold"
            >
              Retry
            </button>
          </motion.div>
        )}
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-start"
        >
          <div>
            <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-2">
              Applications Dashboard
            </h1>
            <p className="text-gray-400">Manage all team applications</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              try {
                await signOut(auth);
                localStorage.removeItem('adminAccess');
                window.location.hash = '#admin';
                window.location.reload();
              } catch (error) {
                console.error('Logout error:', error);
                alert('Error logging out');
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total', value: stats.total, color: 'from-blue-500 to-cyan-500' },
            { label: 'Pending', value: stats.pending, color: 'from-yellow-500 to-orange-500' },
            { label: 'Approved', value: stats.approved, color: 'from-green-500 to-emerald-500' },
            { label: 'Rejected', value: stats.rejected, color: 'from-red-500 to-pink-500' },
          ].map((stat, i) => (
            <div key={i} className={`bg-gradient-to-br ${stat.color} p-6 rounded-lg`}>
              <div className="text-white text-sm font-semibold opacity-80">{stat.label}</div>
              <div className="text-3xl font-black text-white">{stat.value}</div>
            </div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex gap-4"
        >
          <button
            onClick={downloadCSV}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <Download className="inline mr-2 w-4 h-4" />
            Download CSV
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 flex gap-3 flex-wrap"
        >
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                filter === status
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Applications Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 border border-purple-500/30 rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-900/50 border-b border-purple-500/30">
                <tr>
                  <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Contact</th>
                  <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Submitted</th>
                  <th className="px-6 py-4 text-left text-cyan-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app, idx) => (
                  <tr
                    key={app.id}
                    className={`border-b border-purple-500/20 hover:bg-purple-500/10 transition-all ${
                      idx % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-800/30'
                    }`}
                  >
                    <td className="px-6 py-4 text-white font-semibold">{app.name}</td>
                    <td className="px-6 py-4 text-gray-300">{app.email}</td>
                    <td className="px-6 py-4 text-gray-300">{app.contactNumber}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded font-semibold text-white ${
                        (app.status || 'pending') === 'pending'
                          ? 'bg-yellow-600'
                          : (app.status || 'pending') === 'approved'
                          ? 'bg-green-600'
                          : 'bg-red-600'
                      }`}>
                        {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {app.submittedAt
                        ? new Date(app.submittedAt.seconds * 1000).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {(app.status || 'pending') === 'pending' && (
                        <button
                          onClick={() => {
                            console.log('Action button clicked for:', app.name);
                            setActionApp(app);
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition-all"
                          title="Take action"
                        >
                          Action
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="p-2 hover:bg-purple-500/30 rounded transition-all text-cyan-400 hover:text-cyan-300"
                        title="View details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-2 hover:bg-red-500/30 rounded transition-all text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No applications found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedApp(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-black text-cyan-400">{selectedApp.name}</h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-purple-500/20 rounded-full transition-all"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Email', value: selectedApp.email },
                { label: 'Age', value: selectedApp.age },
                { label: 'Contact Number', value: selectedApp.contactNumber },
                { label: 'Background', value: selectedApp.background || 'Not provided' },
                { label: 'Experience', value: selectedApp.experience || 'Not provided' },
                { label: 'Skills', value: selectedApp.skills || 'Not provided' },
                { label: 'Time Dedication', value: selectedApp.timeDedication },
                { label: 'Availability', value: selectedApp.availability || 'Not provided' },
                { label: 'Why Join', value: selectedApp.reasonToJoin },
                { label: 'Innovative Ideas', value: selectedApp.innovativeIdeas },
                {
                  label: 'Submitted',
                  value: selectedApp.submittedAt
                    ? new Date(selectedApp.submittedAt.seconds * 1000).toLocaleString()
                    : 'N/A',
                },
              ].map((field, i) => (
                <div key={i}>
                  <p className="text-cyan-400 font-semibold mb-1">{field.label}</p>
                  <p className="text-gray-300 bg-gray-900/50 p-3 rounded border border-purple-500/20 whitespace-pre-wrap">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Action Modal */}
      {actionApp && (
        <ApplicationActionModal
          application={actionApp}
          onClose={() => setActionApp(null)}
          onSuccess={() => setActionApp(null)}
        />
      )}
    </div>
  );
}
